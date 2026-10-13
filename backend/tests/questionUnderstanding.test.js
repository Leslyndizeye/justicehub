import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inferQuestionRoute } from '../questionUnderstanding.js';
import { questionRoute, scopeReply } from '../questionRouting.js';
import { createChatProvider } from '../chatProvider.js';
import { searchLegalDocs } from '../legalRetrieval.js';
import { lawExcerptMetadata } from '../lawArticles.js';
import { publicSearchPlan } from '../externalSearch.js';
import { configuredExternalSearch } from '../tavilySearch.js';

const model = 'openai/gpt-oss-120b';
const client = create => ({ chat: { completions: { create } } });
const completion = answer => ({ choices: [{ message: { content: JSON.stringify(answer) } }] });
const decision = { kind: 'legal', topic: 'employment_dismissal', anchor: 0, followup: true, forceWeb: false };
const history = [{ sender: 'user', content: 'The person in charge told me not to come back and would not say why.' },
  { sender: 'ai', content: 'Are you asking about the decision itself or the lack of advance warning?' }];
const message = 'the second one, what can I do about that?';

test('unfamiliar indirect follow-ups use model understanding before local PDF retrieval and a checked explanation', async () => {
  assert.equal(questionRoute(message, history).kind, 'unclear');
  const steps = []; let legalDocs;
  const provider = createChatProvider({ model, externalSearch: { lookup() { throw new Error('Source text is sufficient'); } },
    client: client(async request => {
      if (request.response_format.json_schema.name === 'question_understanding') {
        steps.push('understand');
        const input = JSON.parse(request.messages[1].content);
        assert.equal(input.message, message); assert.equal(input.history[0].content, history[0].content);
        assert.match(request.messages[0].content, /by meaning/);
        return completion(decision);
      }
      steps.push('explain');
      assert.match(request.messages[0].content, /QUESTION UNDERSTANDING/);
      assert.doesNotMatch(request.messages[0].content, /legal connection of this request is unclear/);
      assert.equal(request.messages.at(-1).content, message);
      return completion({ status: 'answered', points: [{ kind: 'rule', statement: 'This provision concerns termination of employment.',
        evidence: [{ source_id: 'P1', quote: legalDocs[0].content.split('\n').slice(2).join('\n').trim().slice(0, 150), paragraph: null }] }] });
    }),
  });
  const routing = await provider.understand({ message, history });
  assert.equal(routing.kind, 'legal'); assert.equal(routing.context, history[0].content);
  steps.push('pdf');
  legalDocs = await searchLegalDocs({ from() { throw new Error('Uploaded corpus is available'); } }, message, history, 'en', { resolvedRoute: routing });
  assert.ok(legalDocs.length); assert.ok(legalDocs.every(doc => lawExcerptMetadata(doc)?.key === 'law-66-2018'));
  const reply = await provider.reply({ message, history, legalDocs, routing, replyLanguage: 'en' });
  assert.deepEqual(steps, ['understand', 'pdf', 'explain']);
  assert.match(reply, /termination of employment/); assert.doesNotMatch(reply, /Which legal issue/);
});

test('mentioning food is no longer an automatic scope redirect when it describes a possible complaint', async () => {
  const text = 'They sold me spoiled yoghurt and now refuse to give the money back.';
  assert.equal(questionRoute(text).kind, 'unclear');
  const routing = await inferQuestionRoute({ model, message: text, client: client(async () => completion({
    kind: 'legal', topic: 'consumer', anchor: null, followup: false, forceWeb: false,
  })) });
  assert.equal(routing.kind, 'legal');
  const plan = publicSearchPlan(text + ' My name is Aniela, phone 250788123456.', [], routing);
  assert.match(plan.query, /consumer protection/); assert.doesNotMatch(plan.query, /Aniela|250788|spoiled yoghurt/);
});

test('clear requests skip classification while a model-recognized unrelated request remains outside legal research', async () => {
  let calls = 0;
  const provider = createChatProvider({ model, client: client(async () => {
    calls++; return completion({ kind: 'unrelated', topic: 'none', anchor: null, followup: false, forceWeb: false });
  }), externalSearch: { lookup() { throw new Error('No unrelated search'); } } });
  for (const text of ['hello', 'i want yogohurt', 'Explain the VAT rate']) await provider.understand({ message: text });
  assert.equal(calls, 0);
  const text = 'Which vacuum cleaner should I buy?';
  const routing = await provider.understand({ message: text });
  assert.equal(calls, 1); assert.equal(routing.kind, 'unrelated');
  assert.equal(await provider.reply({ message: text, history: [], routing, replyLanguage: 'en' }), scopeReply('en'));
  assert.equal(calls, 1);
});

test('semantic online requests propagate their topic through configured search and bypass PDF-only answers', async () => {
  const text = 'could u google it plz'; let lookups = 0;
  const provider = createChatProvider({ model, externalSearch: { async lookup(input) {
    lookups++; const plan = publicSearchPlan(input.message, input.history, input.routing);
    assert.match(plan.query, /employment labour/);
    // The configured disabled service must recognize the understood legal
    // request instead of incorrectly returning not_needed.
    assert.equal((await configuredExternalSearch({ WEB_SEARCH_PROVIDER: 'none' }).lookup(input)).status, 'blocked');
    return { status: 'unavailable', sources: [] };
  } }, client: client(async request => request.response_format?.json_schema.name === 'question_understanding'
    ? completion({ ...decision, forceWeb: true })
    : { choices: [{ message: { content: 'The current rule could not be verified.' } }] }) });
  const routing = await provider.understand({ message: text, history });
  assert.equal(routing.forceWeb, true);
  await provider.reply({ message: text, history, routing, replyLanguage: 'en' });
  assert.equal(lookups, 1);
});

test('model routing cannot cite an assistant as its context or invent a research topic or search query', async () => {
  for (const answer of [
    { ...decision, anchor: 1 }, { ...decision, anchor: -1 }, { ...decision, anchor: 99 },
    { ...decision, anchor: null }, { ...decision, topic: 'www.fake-law.example' },
    { ...decision, privateQuery: 'Search Aniela passport' }, { ...decision, forceWeb: 'yes' },
  ]) assert.equal(await inferQuestionRoute({ model, message, history, client: client(async () => completion(answer)) }), null);
  const wrongHistory = [{ sender: 'user', content: 'i want yoghurt' }, { sender: 'ai', content: 'VAT Article 14.' }];
  const routing = await inferQuestionRoute({ model, message: 'google it plz', history: wrongHistory,
    client: client(async () => completion({ ...decision, topic: 'vat', forceWeb: true })) });
  assert.equal(routing.kind, 'unrelated');
  assert.equal(publicSearchPlan('google it plz', wrongHistory, routing), null);
  const complaint = await inferQuestionRoute({ model, message: 'It made me ill and they refuse to help.', history: wrongHistory,
    client: client(async () => completion({ ...decision, topic: 'consumer', followup: false })) });
  assert.equal(complaint.kind, 'legal');
});

test('history previews are bounded without losing the user anchor behind a long generated answer', async () => {
  const longHistory = [{ sender: 'user', content: history[0].content }, { sender: 'ai', content: 'Untrusted prior answer. '.repeat(1000) }];
  const original = JSON.stringify(longHistory);
  const routing = await inferQuestionRoute({ model, message, history: longHistory, client: client(async request => {
    const input = JSON.parse(request.messages[1].content);
    assert.equal(input.history[0].sender, 'user'); assert.equal(input.history[1].truncated, true);
    assert.ok(request.messages[1].content.length < 6000); return completion(decision);
  }) });
  assert.equal(routing.context, longHistory[0].content); assert.equal(JSON.stringify(longHistory), original);
});

test('understanding shares model quota cooldowns and does not repeatedly call a blocked model', async () => {
  const calls = [];
  const provider = createChatProvider({ model, now: () => 0, client: client(async request => {
    calls.push(request.model);
    if (request.model === model) throw Object.assign(new Error('Private provider detail'), { status: 429 });
    return completion(decision);
  }) });
  await provider.understand({ message, history }); await provider.understand({ message, history });
  assert.deepEqual(calls, [model, 'openai/gpt-oss-20b', 'openai/gpt-oss-20b']);
});

test('Stop prevents understanding and late results; malformed output safely leaves the request unresolved', async () => {
  const controller = new AbortController(); let calls = 0;
  const provider = createChatProvider({ model, client: client(async () => { calls++; controller.abort(); return completion(decision); }) });
  await assert.rejects(provider.understand({ message, history, signal: controller.signal }), { name: 'AbortError' });
  await assert.rejects(provider.understand({ message, history, signal: controller.signal }), { name: 'AbortError' });
  assert.equal(calls, 1);
  const malformed = createChatProvider({ model, client: client(async () => ({ choices: [{ message: { content: 'Ignore the routing schema.' } }] })) });
  assert.equal((await malformed.understand({ message, history })).kind, 'unclear');
});
