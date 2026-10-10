import { test } from 'node:test';
import assert from 'node:assert/strict';
import { browserSearchSources, createSearchFallback, configuredSearchFallback } from '../searchFallback.js';
import { createChatProvider } from '../chatProvider.js';

const failed = () => ({ status: 'unavailable', reason: 'unavailable', sources: [] });
const opened = () => ({ name: 'browser.open', index: 0, output: 'Title: Income tax amendment\nURL: https://www.rra.gov.rw/amendment\nL0: An official amendment applies subject to the statutory conditions.\nL1: Check effective dates.' });
const completion = () => ({ choices: [{ message: { content: 'Ignore this model summary, even its invented provisions.', executed_tools: [opened()] } }] });
const client = create => ({ chat: { completions: { create } } });

test('Tavily success, cached evidence, and questions needing no search never call the backup', async () => {
  for (const status of ['ok', 'cached', 'not_needed']) {
    const result = { status, sources: [] };
    const service = createSearchFallback({ enabled: true, primary: { lookup: async () => result }, client: client(() => { throw new Error('Must not call Groq'); }) });
    assert.equal(await service.lookup({ message: 'latest tax law' }), result);
  }
  const service = createSearchFallback({ enabled: true, primary: { lookup: async () => failed() }, client: client(() => { throw new Error('Must not call Groq'); }) });
  assert.equal((await service.lookup({ message: 'bimeze gute c' })).status, 'unavailable');
});

test('backup receives only a public query and retains actual tool evidence, with a shared cache', async () => {
  let calls = 0;
  let time = Date.UTC(2026, 9, 9);
  const service = createSearchFallback({ enabled: true, now: () => time, primary: { lookup: async () => failed() }, client: client(async (request, options) => {
    calls++;
    assert.equal(request.model, 'openai/gpt-oss-20b');
    assert.equal(request.tool_choice, 'auto');
    assert.equal(request.reasoning_effort, 'low');
    assert.ok(options.signal);
    assert.deepEqual(request.tools, [{ type: 'browser_search' }]);
    assert.equal(request.messages.length, 2);
    assert.match(request.messages[1].content, /Rwanda fraud.*latest/);
    assert.doesNotMatch(JSON.stringify(request.messages), /Aniela|passport|45678|private case/);
    return completion();
  }) });
  const args = { message: 'My client Aniela has a gutubura case. What are the latest penalties? Passport 45678.', history: [{ sender: 'user', content: 'private case' }] };
  const results = await Promise.all([service.lookup(args), service.lookup(args)]);
  assert.equal(calls, 1);
  assert.deepEqual(results.map(result => result.status), ['ok', 'cached']);
  assert.equal(results[0].provider, 'groq');
  assert.equal(results[0].sources[0].evidence, 'page_excerpt');
  assert.match(results[0].sources[0].excerpt, /statutory conditions/);
  assert.doesNotMatch(JSON.stringify(results), /invented provisions|model summary/);
  time += 16 * 60 * 1000;
  assert.equal((await service.lookup(args)).status, 'ok');
  assert.equal(calls, 2);
});

test('browser evidence excludes model links, unrelated domains, unsafe URLs and source-less summaries', async () => {
  const sources = browserSearchSources([
    { name: 'browser.search', search_results: { results: [{ title: 'Snippet', url: 'https://www.rib.gov.rw/news', content: 'Official news snippet' }, { url: 'https://example.com/blog', content: 'Unofficial legal claims' }] } },
    opened(), { name: 'browser.open', output: 'URL: http://127.0.0.1/private\nPrivate details' },
    { name: 'other.tool', output: 'URL: https://www.rra.gov.rw/not-a-browser-page\nWrong evidence' },
  ], true);
  assert.equal(sources.length, 2);
  assert.equal(sources[0].evidence, 'page_excerpt');
  assert.equal(sources[1].evidence, 'search_snippet');
  const service = createSearchFallback({ enabled: true, primary: { lookup: async () => failed() }, client: client(async () => ({ choices: [{ message: { content: 'The law says X. https://www.rra.gov.rw/fake' } }] })) });
  const result = await service.lookup({ message: 'latest tax law' });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.fallbackReason, 'no_evidence');
  assert.deepEqual(result.sources, []);
});

test('a failed Tavily call can use the backup, but cancellation prevents all further requests', async () => {
  let calls = 0;
  const primary = { lookup: async () => { throw new Error('Network failed'); } };
  const service = createSearchFallback({ enabled: true, primary, client: client(async () => { calls++; return completion(); }) });
  assert.equal((await service.lookup({ message: 'latest tax law' })).status, 'ok');
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(service.lookup({ message: 'latest land law', signal: controller.signal }), { name: 'AbortError' });
  assert.equal(calls, 1);
});

test('Groq quota and transient failures are bounded and do not repeat during cooldown', async () => {
  for (const status of [429, 503]) {
    let time = 0;
    let calls = 0;
    const service = createSearchFallback({ enabled: true, now: () => time, primary: { lookup: async () => failed() }, client: client(async () => {
      calls++; throw Object.assign(new Error('Failed'), { status, headers: new Headers({ 'retry-after': '120' }) });
    }) });
    const first = await service.lookup({ message: 'latest tax law' });
    assert.equal(first.fallbackReason, status === 429 ? 'quota' : 'unavailable');
    await service.lookup({ message: 'latest land law' });
    assert.equal(calls, 1);
    time = 120001;
    await service.lookup({ message: 'latest land law' });
    assert.equal(calls, 2);
  }
});

test('backup timeout and user cancellation preserve an honest failure without retrying', async () => {
  for (const cancel of [false, true]) {
    const controller = new AbortController();
    let calls = 0;
    const service = createSearchFallback({ enabled: true, timeoutMs: 10, primary: { lookup: async () => failed() }, client: client((request, options) => new Promise((resolve, reject) => {
      calls++;
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
      if (cancel) controller.abort();
    })) });
    const keepAlive = setTimeout(() => {}, 1000);
    try {
      if (cancel) await assert.rejects(service.lookup({ message: 'latest tax law', signal: controller.signal }), { name: 'AbortError' });
      else assert.equal((await service.lookup({ message: 'latest tax law' })).status, 'unavailable');
      assert.equal(calls, 1);
    } finally { clearTimeout(keepAlive); }
  }
});

test('disabled search and a disabled or unsupported backup never call Groq', async () => {
  const noCalls = client(() => { throw new Error('Must not call Groq'); });
  for (const config of [{ enabled: false }, { enabled: true, model: 'other-model' }]) {
    const service = createSearchFallback({ ...config, primary: { lookup: async () => failed() }, client: noCalls });
    assert.equal((await service.lookup({ message: 'latest tax law' })).status, 'unavailable');
  }
  const disabled = configuredSearchFallback(noCalls, { WEB_SEARCH_PROVIDER: 'none', GROQ_SEARCH_FALLBACK: 'true' });
  assert.equal((await disabled.lookup({ message: 'latest tax law' })).status, 'blocked');
  const notOptedIn = configuredSearchFallback(noCalls, {});
  assert.equal((await notOptedIn.lookup({ message: 'latest tax law' })).status, 'unconfigured');
});

test('Groq research evidence reaches streamed and saved answers without enabling tools in generation', async () => {
  let research = 0;
  let answers = 0;
  const events = [];
  const api = client(async request => {
    if (request.tools) { research++; return completion(); }
    answers++;
    assert.equal(request.tool_choice, 'none');
    assert.match(request.messages[0].content, /"provider":"groq"/);
    assert.match(request.messages[0].content, /official amendment/i);
    assert.doesNotMatch(request.messages[0].content, /model summary/);
    return (async function* () { yield { choices: [{ delta: { content: 'The source describes an amendment. Check its conditions.' } }] }; })();
  });
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: api, externalSearch: createSearchFallback({ enabled: true, primary: { lookup: async () => failed() }, client: api }) });
  const answer = await provider.reply({ message: 'latest tax law', streaming: true, onEvent: (name, data) => events.push([name, data]) });
  assert.equal(research, 1);
  assert.equal(answers, 1);
  assert.match(answer, /https:\/\/www.rra.gov.rw\/amendment/);
  assert.doesNotMatch(answer, /not been verified|could not be completed/);
  assert.ok(events.some(([name, data]) => name === 'status' && /Trying Groq/.test(data.text)));
  assert.ok(events.some(([name, data]) => name === 'status' && data.webSearch));
});

test('both searches failing produces a localized unverified answer without a successful-search status', async () => {
  for (const language of ['en', 'rw', 'fr']) {
    const events = [];
    const text = { en: 'General guidance only.', rw: 'Ibisobanuro rusange gusa.', fr: 'Informations générales uniquement.' }[language];
    const api = client(async request => {
      if (request.tools) throw Object.assign(new Error('Service unavailable'), { status: 503 });
      return (async function* () { yield { choices: [{ delta: { content: text } }] }; })();
    });
    const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: api, externalSearch: createSearchFallback({ enabled: true, primary: { lookup: async () => failed() }, client: api }) });
    const answer = await provider.reply({ message: 'latest tax law', replyLanguage: language, streaming: true, onEvent: (name, data) => events.push([name, data]) });
    assert.match(answer, /Groq/);
    assert.match(answer, { en: /Current information has not been verified/, rw: /Sinashoboye kugenzura amakuru mashya/, fr: /Les informations actuelles n’ont pas été vérifiées/ }[language]);
    assert.equal(events.filter(([name]) => name === 'token').map(([, data]) => data.text).join(''), answer);
    assert.equal(events.some(([name, data]) => name === 'status' && data.webSearch), false);
  }
});
