import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boundedContext, createChatProvider, publicChatError, retryDelaySeconds } from '../chatProvider.js';

const main = 'openai/gpt-oss-120b';
const fallback = 'openai/gpt-oss-20b';
const signal = () => new AbortController().signal;
const client = create => ({ chat: { completions: { create } } });
const limited = (duration = '55m32.016s') => Object.assign(new Error('API limit'), {
  status: 429,
  error: { error: { code: 'rate_limit_exceeded', message: `Rate limit reached for organization org_private. Please try again in ${duration}.` } },
});
const answer = text => ({ choices: [{ message: { content: text } }] });
const token = text => ({ choices: [{ delta: { content: text } }] });

test('a vague new-law question may clarify without triggering required-tool errors', async () => {
  let calls = 0;
  const provider = createChatProvider({ client: client(async request => {
    calls++;
    if (request.tool_choice === 'required') throw Object.assign(new Error('Tool choice is required, but model did not call a tool'), { status: 400 });
    return answer('Which topic or sector do you mean?');
  }), model: main });
  assert.equal(await provider.reply({ message: 'What is the latest new law in Rwanda?', signal: signal() }), 'Which topic or sector do you mean?');
  assert.equal(calls, 1);
});

test('rate limits switch to a web-capable fallback and avoid the cooling-down model on the next request', async () => {
  let time = 0;
  const calls = [];
  const events = [];
  const provider = createChatProvider({ model: main, now: () => time, client: client(async request => {
    calls.push(request);
    if (request.model === main && time === 0) throw limited();
    return (async function* () {
      yield { choices: [{ delta: { executed_tools: [{ name: 'browser.search', search_results: { results: [{ title: 'Official news', url: 'https://news.example/story' }] } }] } }] };
      yield token('See [Official news](https://news.example/story).');
    })();
  }) });
  const first = await provider.reply({ message: 'latest news', streaming: true, signal: signal(), onEvent: (name, data) => events.push([name, data]) });
  assert.match(first, /Official news/);
  assert.deepEqual(calls.map(request => request.model), [main, fallback]);
  assert.deepEqual(calls[1].tools, [{ type: 'browser_search' }]);
  assert.equal(calls[1].reasoning_effort, 'medium');
  assert.equal(calls[1].messages[0].role, 'developer');
  assert(events.some(([name, data]) => name === 'status' && data.webSearch === false));
  assert(events.some(([name, data]) => name === 'status' && data.webSearch === true));
  await provider.reply({ message: 'hello', streaming: true, signal: signal() });
  assert.deepEqual(calls.map(request => request.model), [main, fallback, fallback]);
  time = 3600000;
  await provider.reply({ message: 'hello', streaming: true, signal: signal() });
  assert.equal(calls.at(-1).model, main);
});

test('both models being limited returns a safe retry message and does not retry blocked requests repeatedly', async () => {
  let calls = 0;
  const provider = createChatProvider({ model: main, now: () => 0, client: client(async () => { calls++; throw limited(); }) });
  for (let attempt = 0; attempt < 2; attempt++) {
    await assert.rejects(provider.reply({ message: 'hello', signal: signal() }), error => {
      const result = publicChatError(error);
      assert.equal(result.status, 429);
      assert.match(result.error, /56 minutes/);
      assert.equal(result.retryAfterSeconds, 3333);
      assert.doesNotMatch(result.error, /org_private|rate_limit_exceeded/);
      return true;
    });
  }
  assert.equal(calls, 2);
});

test('does not concatenate a fallback reply after visible text or retry non-rate-limit failures', async () => {
  let calls = 0;
  const received = [];
  const provider = createChatProvider({ model: main, client: client(async () => {
    calls++;
    return (async function* () { yield token('Partial reply'); throw limited(); })();
  }) });
  await assert.rejects(provider.reply({ message: 'hello', streaming: true, signal: signal(), onEvent: (name, data) => { if (name === 'token') received.push(data.text); } }), { status: 429 });
  assert.equal(calls, 1);
  assert.deepEqual(received, ['Partial reply']);
  const badKey = createChatProvider({ model: main, client: client(async () => { calls++; throw Object.assign(new Error('Bad key'), { status: 401 }); }) });
  await assert.rejects(badKey.reply({ message: 'hello', signal: signal() }), { status: 401 });
  assert.equal(calls, 2);
});

test('abort cancels fallback, and a configured none keeps requests on the main model', async () => {
  const controller = new AbortController();
  let calls = 0;
  const provider = createChatProvider({ model: main, client: client(async () => { calls++; controller.abort(); throw limited(); }) });
  await assert.rejects(provider.reply({ message: 'hello', signal: controller.signal }), { name: 'AbortError' });
  assert.equal(calls, 1);
  const disabled = createChatProvider({ model: main, fallbackModel: 'none', client: client(async () => { calls++; throw limited(); }) });
  await assert.rejects(disabled.reply({ message: 'hello', signal: signal() }), { status: 429 });
  assert.equal(calls, 2);
});

test('honors the longer provider wait instead of trusting a shorter Retry-After header', () => {
  const error = limited('12s');
  error.headers = new Headers({ 'retry-after': '12' });
  assert.equal(retryDelaySeconds(error), 12);
  assert.equal(retryDelaySeconds(limited('1h2m3.5s')), 3723.5);
  assert.equal(publicChatError(error).error, 'The AI service has reached its usage limit. Please wait at least 12 seconds before trying again.');
  const daily = limited();
  daily.headers = new Headers({ 'retry-after': '2' });
  assert.equal(retryDelaySeconds(daily), 3332.016);
  assert.equal(publicChatError(daily).retryAfterSeconds, 3333);
  assert.match(publicChatError({ status: 400, error: { code: 'tool_use_failed' } }).error, /more specific question/);
});

test('uses exhausted quota resets and HTTP-date retries, ignoring non-exhausted resets', () => {
  const error = Object.assign(new Error('Quota reached'), { status: 429, headers: new Headers({
    'retry-after': '2', 'x-ratelimit-remaining-requests': '0', 'x-ratelimit-reset-requests': '2m59.56s',
    'x-ratelimit-remaining-tokens': '400', 'x-ratelimit-reset-tokens': '1h',
  }) });
  assert.equal(retryDelaySeconds(error), 179.56);
  error.headers.set('x-ratelimit-remaining-requests', '10');
  assert.equal(retryDelaySeconds(error), 2);
  error.headers.set('retry-after', 'Tue, 06 Oct 2026 12:01:00 GMT');
  assert.equal(retryDelaySeconds(error, Date.parse('2026-10-06T12:00:00Z')), 60);
  assert.equal(retryDelaySeconds({ status: 429 }), 60);
});

test('repeated short rate limits back off and diagnostics identify the limited models safely', async () => {
  let time = 0;
  let calls = 0;
  const provider = createChatProvider({ model: main, now: () => time, client: client(async () => {
    calls++; throw limited('2s');
  }) });
  await assert.rejects(provider.reply({ message: 'hello' }), error => {
    assert.equal(error.code, 'rate_limit_exceeded');
    assert.deepEqual(error.rateLimits.map(item => item.model), [main, fallback]);
    assert.equal(error.retryAfterSeconds, 2);
    return true;
  });
  time = 2000;
  await assert.rejects(provider.reply({ message: 'hello' }), error => error.retryAfterSeconds === 10);
  assert.equal(calls, 4);
  time = 3000;
  await assert.rejects(provider.reply({ message: 'hello' }), error => error.retryAfterSeconds === 9);
  assert.equal(calls, 4);
  time = 12000;
  await assert.rejects(provider.reply({ message: 'hello' }), error => error.retryAfterSeconds === 20);
  assert.equal(calls, 6);
});

test('reports the earliest retry when both models have different cooldowns', async () => {
  const provider = createChatProvider({ model: main, now: () => 0, client: client(async request => { throw limited(request.model === main ? '10s' : '55m'); }) });
  for (let attempt = 0; attempt < 2; attempt++) {
    await assert.rejects(provider.reply({ message: 'hello', signal: signal() }), error => {
      assert.equal(publicChatError(error).retryAfterSeconds, 10);
      return true;
    });
  }
});

test('bounds excerpts and saved history while retaining whole recent messages and source identities', () => {
  const context = boundedContext([{ sender: 'user', content: 'Old'.repeat(3000) }, { sender: 'ai', content: 'Recent answer' }, { sender: 'user', content: 'My name is Aline' }], Array.from({ length: 4 }, (_, i) => ({ title: `Law ${i}`, source: `https://official.example/${i}`, content: 'x'.repeat(5000) })));
  assert.deepEqual(context.history.map(item => item.content), ['Recent answer', 'My name is Aline']);
  assert(context.legalDocs.reduce((size, doc) => size + doc.content.length, 0) < 4300);
  assert.equal(context.legalDocs[0].source, 'https://official.example/0');
  assert.match(context.legalDocs[0].content, /Excerpt truncated/);
});

test('recovers once from browser context overflow with transparent general guidance', async () => {
  const calls = [];
  const tokens = [];
  const provider = createChatProvider({ model: main, client: client(async request => {
    calls.push(request);
    if (request.tools) throw Object.assign(new Error('Please reduce the length of the messages or completion.'), { code: 'context_length_exceeded' });
    return (async function* () { yield token('For your client, start by confirming the charge and procedural stage.'); })();
  }) });
  const reply = await provider.reply({ message: 'My client intentionally stole property; what lawful steps can I take?', streaming: true, signal: signal(), onEvent: (name, data) => { if (name === 'token') tokens.push(data.text); } });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].tools, undefined);
  assert.equal(calls[1].messages[0].role, 'developer');
  assert.match(calls[1].messages[0].content, /Live web search is unavailable/);
  assert.match(reply, /couldn’t complete a live source lookup/);
  assert.match(reply, /your client/);
  assert.equal(tokens.join(''), reply);
});

test('a bare refusal includes a useful lawful alternative in the streamed and saved reply', async () => {
  const seen = [];
  const provider = createChatProvider({ model: main, client: client(async () => (async function* () { yield token('I’m sorry, but I can’t help with that.'); })()) });
  const reply = await provider.reply({ message: 'Invent a false alibi for my client.', streaming: true, signal: signal(), onEvent: (name, data) => { if (name === 'token') seen.push(data.text); } });
  assert.match(reply, /can’t help/);
  assert.match(reply, /true facts/);
  assert.match(reply, /lawful ways/);
  assert.equal(seen.join(''), reply);
});

test('a browser timeout recovers once without treating it as the user stopping the reply', async () => {
  const calls = [];
  const client = { chat: { completions: { create: async (request, options) => {
    calls.push(request);
    if (request.tools) return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(Object.assign(new Error('Provider request aborted'), { name: 'AbortError' })), { once: true });
    });
    return { choices: [{ message: { content: 'Confirm the charge and case stage before checking eligibility.' } }] };
  } } } };
  const provider = createChatProvider({ client, model: main, requestTimeoutMs: 10 });
  // An active timer keeps the mock alive while AbortSignal.timeout uses an unref timer.
  const keepAlive = setTimeout(() => {}, 1000);
  try {
    const reply = await provider.reply({ message: 'My client needs legal guidance.', signal: new AbortController().signal });
    assert.equal(calls.length, 2);
    assert.equal(calls[1].tools, undefined);
    assert.match(reply, /couldn’t complete a live source lookup/);
    assert.match(reply, /Confirm the charge/);
  } finally { clearTimeout(keepAlive); }
});
