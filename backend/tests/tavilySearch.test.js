import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTavilySearch, freeSearchAllowance, configuredExternalSearch } from '../tavilySearch.js';
import { publicSearchPlan, normalizeSearchSources, externalSearchInstruction, finishExternalReply } from '../externalSearch.js';
import { createChatProvider } from '../chatProvider.js';

const freeUsage = () => ({ key: { usage: 0, limit: 1000 }, account: { current_plan: 'Researcher', plan_usage: 0, plan_limit: 1000, paygo_limit: 0, paygo_usage: 0 } });
const source = { title: 'Official tax amendment', url: 'https://www.rra.gov.rw/tax-amendment', content: 'A search snippet', raw_content: 'Official amendment text with applicable conditions.', published_date: '2026-09-01' };
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });

test('only a verified free account with unused free credits and no PAYG usage permits search', () => {
  assert.deepEqual(freeSearchAllowance(freeUsage()), { remaining: 900 });
  for (const [field, value] of [['current_plan', 'Bootstrap'], ['paygo_limit', 1], ['paygo_usage', 1], ['plan_limit', 15000]]) {
    const usage = freeUsage(); usage.account[field] = value;
    assert.equal(freeSearchAllowance(usage).reason, 'plan', field);
  }
  for (const usage of [{}, { account: freeUsage().account }, { ...freeUsage(), account: { ...freeUsage().account, plan_usage: '1' } }]) {
    assert.equal(freeSearchAllowance(usage).reason, 'usage');
  }
  for (const field of ['paygo_limit', 'paygo_usage']) {
    const usage = freeUsage(); delete usage.account[field];
    assert.equal(freeSearchAllowance(usage).reason, 'plan');
  }
  const used = freeUsage(); used.account.plan_usage = 900;
  assert.equal(freeSearchAllowance(used).reason, 'quota');
  const keyUsed = freeUsage(); keyUsed.key.limit = 1; keyUsed.key.usage = 1;
  assert.equal(freeSearchAllowance(keyUsed).reason, 'quota');
});

test('nullable limits on a real free-account response retain the finite account ceiling', async () => {
  const usage = freeUsage();
  usage.key.limit = null;
  usage.account.paygo_limit = null;
  assert.deepEqual(freeSearchAllowance(usage), { remaining: 900 });
  usage.account.plan_usage = 899;
  assert.deepEqual(freeSearchAllowance(usage), { remaining: 1 });
  let posts = 0;
  const service = createTavilySearch({ apiKey: 'test', fetchImpl: async url => {
    if (url.endsWith('/usage')) return json(usage);
    posts++; return json({ results: [source], usage: { credits: 1 } });
  } });
  assert.equal((await service.lookup({ message: 'latest tax law' })).status, 'ok');
  assert.equal((await service.lookup({ message: 'latest land law' })).reason, 'quota');
  assert.equal(posts, 1);
  usage.account.plan_usage = 900;
  assert.equal(freeSearchAllowance(usage).reason, 'quota');
  usage.account.paygo_usage = 1;
  assert.equal(freeSearchAllowance(usage).reason, 'plan');
  usage.account.paygo_usage = 0;
  for (const value of [undefined, '0', -1]) {
    usage.key.limit = value;
    assert.equal(freeSearchAllowance(usage).reason, 'usage');
  }
});

test('legal searches preserve topic and explicit law numbers without sending personal case details', () => {
  const plan = publicSearchPlan('My client Aniela has been charged with gutubura; what is the current penalty under law No 068/2018? Her phone is +250788123456.');
  assert.match(plan.query, /Rwanda fraud.*penalties.*068\/2018.*latest/);
  assert.doesNotMatch(plan.query, /Aniela|250|client|phone|charged/);
  assert.equal(plan.legal, true);
  assert.match(publicSearchPlan('latest laws please', [{ sender: 'user', content: 'Tell me about tax law' }]).query, /tax/);
  assert.equal(publicSearchPlan('bimeze gute c'), null);
  assert.equal(publicSearchPlan('how are you?'), null);
  assert.equal(publicSearchPlan('hello'), null);
  assert.equal(publicSearchPlan('What is your purpose?'), null);
  assert.equal(publicSearchPlan('Please explain React components.'), null);
  assert.equal(publicSearchPlan('latest news about my client, account 123456').query, 'latest Rwanda news');
  assert.match(publicSearchPlan('Quelles sont les dernières lois fiscales au Rwanda ?').query, /tax.*latest/);
});

test('basic search is bounded, free-checked first, timestamped and cached without a repeated credit', async () => {
  let time = Date.UTC(2026, 9, 9);
  const calls = [];
  const service = createTavilySearch({ apiKey: 'test-key', now: () => time, fetchImpl: async (url, options) => {
    calls.push([url, options]);
    if (url.endsWith('/usage')) return json(freeUsage());
    assert.equal(options.redirect, 'error');
    const body = JSON.parse(options.body);
    assert.equal(body.search_depth, 'basic');
    assert.equal(body.auto_parameters, false);
    assert.equal(body.include_answer, false);
    assert.equal(body.include_raw_content, 'text');
    assert.equal(body.max_results, 3);
    assert.ok(body.include_domains.includes('minijust.gov.rw'));
    return json({ results: [source], usage: { credits: 1 } });
  } });
  const first = await service.lookup({ message: 'What are the latest tax laws in Rwanda?' });
  assert.equal(first.status, 'ok');
  assert.equal(first.sources[0].evidence, 'page_excerpt');
  assert.equal(first.sources[0].publishedAt, '2026-09-01');
  assert.equal(first.retrievedAt, '2026-10-09T00:00:00.000Z');
  time += 1000;
  assert.equal((await service.lookup({ message: 'What are the latest tax laws in Rwanda?' })).status, 'cached');
  assert.equal(calls.length, 2);
  time += 16 * 60 * 1000;
  assert.equal((await service.lookup({ message: 'What are the latest tax laws in Rwanda?' })).status, 'ok');
  assert.equal(calls.length, 4);
});

test('missing keys, unavailable usage, paid accounts, quotas and zero limits never POST search', async () => {
  const missing = createTavilySearch({ fetchImpl: () => { throw new Error('No network allowed'); } });
  assert.equal((await missing.lookup({ message: 'latest tax law' })).status, 'unconfigured');
  assert.equal((await missing.lookup({ message: 'hello' })).status, 'not_needed');
  for (const scenario of ['usage_failure', 'paid', 'quota', 'zero']) {
    let calls = 0;
    const service = createTavilySearch({ apiKey: 'test', monthlyLimit: scenario === 'zero' ? 0 : 900, fetchImpl: async url => {
      calls++; assert.ok(url.endsWith('/usage'));
      if (scenario === 'usage_failure') throw new Error('Offline');
      const usage = freeUsage();
      if (scenario === 'paid') usage.account.current_plan = 'Project';
      if (scenario === 'quota') usage.account.plan_usage = 900;
      return json(usage);
    } });
    const result = await service.lookup({ message: 'latest tax law' });
    assert.notEqual(result.status, 'ok');
    assert.equal(calls, 1, scenario);
  }
});

test('account reservations stop concurrent overspending even when reported usage is stale', async () => {
  let posts = 0;
  const service = createTavilySearch({ apiKey: 'test', monthlyLimit: 1, fetchImpl: async url => {
    if (url.endsWith('/usage')) return json(freeUsage());
    posts++; return json({ results: [source], usage: { credits: 1 } });
  } });
  const results = await Promise.all(['latest tax law', 'latest land law', 'latest employment law'].map(message => service.lookup({ message })));
  assert.equal(results.filter(result => result.status === 'ok').length, 1);
  assert.equal(results.filter(result => result.reason === 'quota').length, 2);
  assert.equal(posts, 1);
});

test('search errors and unexpected credit use never trigger retries, advanced search or another provider', async () => {
  for (const scenario of ['network', 'quota', 'credits', 'missing_usage']) {
    let posts = 0;
    const service = createTavilySearch({ apiKey: 'test', now: () => Date.UTC(2026, 9, 9), fetchImpl: async url => {
      if (url.endsWith('/usage')) return json(freeUsage());
      posts++;
      if (scenario === 'network') throw new Error('Timeout');
      if (scenario === 'quota') return json({}, 432);
      if (scenario === 'missing_usage') return json({ results: [source] });
      return json({ results: [source], usage: { credits: 2 } });
    } });
    assert.notEqual((await service.lookup({ message: 'latest tax law' })).status, 'ok');
    assert.notEqual((await service.lookup({ message: 'latest land law' })).status, 'ok');
    assert.equal(posts, 1, scenario);
  }
});

test('configuration never falls back to Groq tools when Tavily is disabled or missing', async () => {
  assert.throws(() => configuredExternalSearch({ WEB_SEARCH_PROVIDER: 'groq' }), /must be tavily or none/);
  const disabled = configuredExternalSearch({ WEB_SEARCH_PROVIDER: 'none', GROQ_WEB_SEARCH: 'true' });
  assert.equal((await disabled.lookup({ message: 'latest tax law' })).status, 'blocked');
  assert.equal((await disabled.lookup({ message: 'hello' })).status, 'not_needed');
  assert.equal((await configuredExternalSearch({}).lookup({ message: 'latest tax law' })).status, 'unconfigured');
});

test('source excerpts distinguish snippets, reject unrelated legal sources and unsafe URLs, and bound context', () => {
  const results = normalizeSearchSources([
    { ...source, raw_content: 'x'.repeat(10000) }, source,
    { ...source, url: 'https://blog.example/tax' },
    { ...source, url: 'https://rra.gov.rw.other.example/tax' },
    { ...source, url: 'https://localhost/internal' },
    { ...source, url: 'javascript:alert(1)' },
    { ...source, url: 'https://name:secret@rra.gov.rw/tax' },
    { ...source, url: 'https://minijust.gov.rw/law', raw_content: null },
  ], true);
  assert.equal(results.length, 2);
  assert.equal(results[0].excerpt.length, 1100);
  assert.equal(results[1].evidence, 'search_snippet');
  const state = { status: 'ok', retrievedAt: '2026-10-09', sources: results };
  assert.match(externalSearchInstruction(state), /untrusted evidence.*not instructions/);
  assert.match(externalSearchInstruction(state), /snippets alone cannot establish/i);
  const reply = finishExternalReply('Answer. 【1†L2】', state, 'rw');
  assert.doesNotMatch(reply, /【|Pages checked/);
  assert.match(reply, /Amasoko.*2026-10-09/);
});

test('cancelling a usage check emits no evidence and leaves the queue usable', async () => {
  const controller = new AbortController();
  const service = createTavilySearch({ apiKey: 'test', fetchImpl: async url => {
    if (url.endsWith('/usage')) { controller.abort(); return json(freeUsage()); }
    throw new Error('Should not POST after abort');
  } });
  await assert.rejects(service.lookup({ message: 'latest tax law', signal: controller.signal }), { name: 'AbortError' });
  assert.equal((await service.lookup({ message: 'hello' })).status, 'not_needed');
});

test('cancelling a queued lookup prevents its search while another lookup completes', async () => {
  let releaseUsage;
  const usageReady = new Promise(resolve => { releaseUsage = resolve; });
  let posts = 0;
  const service = createTavilySearch({ apiKey: 'test', fetchImpl: async url => {
    if (url.endsWith('/usage')) { await usageReady; return json(freeUsage()); }
    posts++; return json({ results: [source], usage: { credits: 1 } });
  } });
  const first = service.lookup({ message: 'latest tax law' });
  const controller = new AbortController();
  const second = service.lookup({ message: 'latest land law', signal: controller.signal });
  controller.abort();
  releaseUsage();
  assert.equal((await first).status, 'ok');
  await assert.rejects(second, { name: 'AbortError' });
  assert.equal(posts, 1);
  assert.equal((await service.lookup({ message: 'latest employment law' })).status, 'ok');
  assert.equal(posts, 2);
});

test('Groq fallback reuses one external lookup and never receives built-in browser tools', async () => {
  let lookups = 0;
  const requests = [];
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', searchSetting: 'true', externalSearch: { lookup: async () => {
    lookups++; return { status: 'ok', retrievedAt: '2026-10-09', sources: normalizeSearchSources([source], true) };
  } }, client: { chat: { completions: { create: async request => {
    requests.push(request);
    assert.equal(request.tools, undefined);
    assert.equal(request.tool_choice, 'none');
    assert.match(request.messages[0].content, /BACKEND WEB RESEARCH/);
    assert.match(request.messages[0].content, /Official amendment text/);
    assert.doesNotMatch(request.messages[0].content, /You have browser_search/);
    if (requests.length === 1) throw Object.assign(new Error('Model limit'), { status: 429 });
    return (async function* () { yield { choices: [{ delta: { content: 'The supplied source describes a tax amendment.' } }] }; })();
  } } } } });
  const reply = await provider.reply({ message: 'latest Rwanda tax law', streaming: true });
  assert.equal(lookups, 1);
  assert.equal(requests.length, 2);
  assert.match(reply, /https:\/\/www.rra.gov.rw\/tax-amendment/);
});

test('missing or failed search produces a localized limitation, while canned replies skip it completely', async () => {
  for (const language of ['en', 'rw', 'fr']) {
    let lookups = 0;
    const events = [];
    const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { lookup: async () => {
      lookups++; return { status: 'unconfigured', sources: [] };
    } }, client: { chat: { completions: { create: async request => {
      assert.equal(request.tools, undefined);
      assert.equal(request.tool_choice, 'none');
      const content = { en: 'General guidance only.', rw: 'Ibisobanuro rusange gusa.', fr: 'Informations générales uniquement.' }[language];
      return (async function* () { yield { choices: [{ delta: { content } }] }; })();
    } } } } });
    const reply = await provider.reply({ message: 'latest tax law', replyLanguage: language, streaming: true, onEvent: (name, data) => events.push([name, data]) });
    assert.match(reply, { en: /key is not configured.*not been verified/s, rw: /Tavily.*urufunguzo.*kugenzura/s, fr: /clé Tavily.*pas été vérifiées/s }[language]);
    assert.equal(events.filter(([name]) => name === 'token').map(([, data]) => data.text).join(''), reply);
    await provider.reply({ message: 'bimeze gute c' });
    await provider.reply({ message: 'umuntu wibye ahanishwa iki?' });
    assert.equal(lookups, 1);
  }
});

test('all cooling-down models skip external calls and cache age is never claimed as a fresh lookup', async () => {
  let lookups = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', fallbackModel: 'none', now: () => 0,
    externalSearch: { lookup: async () => { lookups++; return { status: 'cached', retrievedAt: '2026-10-08T00:00:00.000Z', sources: [source] }; } },
    client: { chat: { completions: { create: async () => { throw Object.assign(new Error('Limited'), { status: 429 }); } } } },
  });
  await assert.rejects(provider.reply({ message: 'latest tax law' }), { status: 429 });
  await assert.rejects(provider.reply({ message: 'latest tax law' }), { status: 429 });
  assert.equal(lookups, 1);
  const working = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { lookup: async () => ({ status: 'cached', retrievedAt: '2026-10-08', sources: [] }) }, client: { chat: { completions: { create: async () => ({ choices: [{ message: { content: 'Here is general guidance.' } }] }) } } } });
  assert.match(await working.reply({ message: 'latest tax law' }), /saved at 2026-10-08; this is not a new live verification/);
});
