import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionRoute, scopeReply } from '../questionRouting.js';
import { searchLegalDocs } from '../legalRetrieval.js';
import { searchLocalLaws } from '../localLawSearch.js';
import { publicSearchPlan } from '../externalSearch.js';
import { createChatProvider } from '../chatProvider.js';

const question = 'what minimum age of kid to work';
const docs = searchLocalLaws(question);
const completion = answer => ({ choices: [{ message: { content: JSON.stringify(answer) } }] });
const sourceAnswer = { status: 'answered', points: [{ kind: 'rule', statement: 'Article 5 sets the minimum employment age at sixteen years.',
  evidence: [{ source_id: 'P1', quote: docs[0].content.split('\n').slice(2).join('\n').trim(), paragraph: null }],
}] };
const client = create => ({ chat: { completions: { create } } });
const research = { status: 'ok', provider: 'tavily', sources: [{ title: 'Official child employment guidance', url: 'https://www.gov.rw/child-work',
  evidence: 'page_excerpt', excerpt: 'Children may undertake only permitted light work under the specified conditions.' }] };

test('unrelated food requests never reach PDF, database, model or web search, even after a legal discussion', async () => {
  const history = [{ sender: 'user', content: 'Explain VAT exemptions' }, { sender: 'ai', content: 'Article 14 concerns foreign services.' }];
  const never = () => { throw new Error('Unexpected external call'); };
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: client(never), externalSearch: { lookup: never } });
  for (const message of ['i want yogohurt', 'i want yoghurt', 'Give me a yoghurt recipe', 'latest football scores']) {
    assert.equal(questionRoute(message, history).kind, 'unrelated');
    assert.deepEqual(await searchLegalDocs({ from: never }, message, history, 'en', { localSearch: never }), []);
    assert.equal(publicSearchPlan(message, history), null);
    for (const language of ['en', 'rw', 'fr']) {
      const tokens = [];
      const reply = await provider.reply({ message, history, legalDocs: docs, replyLanguage: language, streaming: true,
        onEvent: (event, data) => { if (event === 'token') tokens.push(data.text); } });
      assert.equal(reply, scopeReply(language)); assert.equal(reply, tokens.join(''));
      assert.doesNotMatch(reply, /Article|PDF|Search sources|2022/);
    }
  }
});

test('actual legal connections override ordinary words, but previous assistant claims cannot invent one', () => {
  for (const message of [question, 'My employer has not paid my salary', 'Can I get a refund for expired yoghurt?',
    'I was sold unsafe food. What are my rights?',
    'What does the law say about sports betting?', 'Ndatubuwe amafaranga', 'I paid for a phone but never received it']) {
    assert.equal(questionRoute(message).kind, 'legal', message);
  }
  assert.equal(questionRoute('why?', [{ sender: 'user', content: question }]).kind, 'legal');
  assert.equal(questionRoute('in english', [{ sender: 'user', content: question }]).kind, 'legal');
  assert.notEqual(questionRoute('why?', [{ sender: 'user', content: 'i want yoghurt' }, { sender: 'ai', content: 'Law No. 049/2023 Article 14' }]).kind, 'legal');
  assert.equal(questionRoute('hello').kind, 'social');
  assert.equal(questionRoute('What do you like to eat?').kind, 'social');
  assert.equal(questionRoute('I cannot breathe').kind, 'safety');
  assert.equal(questionRoute('Can you explain that thing?').kind, 'unclear');
});

test('fictional lawyer identity questions use conversation without PDFs, database or web research', async () => {
  const never = () => { throw new Error('No legal research for fictional identity'); };
  const history = [{ sender: 'user', content: question }, { sender: 'ai', content: 'Article 20: Counterfeiting negotiable instruments.' }];
  const expected = 'Yes. Jimmy McGill is the fictional lawyer also known as Saul Goodman in Better Call Saul.';
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { lookup: never }, client: client(async request => {
    calls++;
    assert.equal(request.response_format, undefined);
    assert.equal(request.tools, undefined);
    assert.equal(request.tool_choice, 'none');
    assert.match(request.messages[0].content, /permitted conversational discussion/);
    assert.doesNotMatch(request.messages[0].content, /Amategeko PDF:|BACKEND WEB RESEARCH/);
    if (request.stream) return (async function* () { yield { choices: [{ delta: { content: expected } }] }; })();
    return { choices: [{ message: { content: expected } }] };
  }) });
  for (const message of ['do uknow jimmy mcgill', 'do u knowjimmy mcgill', 'do uknowjimmymcgill', 'do u know Jimmy McGill?', 'Do you know Jimmy McGill in Better Call Saul?',
    'Who is Saul Goodman?', 'Tell me about Jimmy McGill.']) {
    const routing = await provider.understand({ message, history });
    assert.equal(routing.kind, 'social', message);
    assert.deepEqual(await searchLegalDocs({ from: never }, message, history, 'en', { localSearch: never, resolvedRoute: routing }), []);
    assert.equal(publicSearchPlan(message, history, routing), null);
    const tokens = [];
    const reply = await provider.reply({ message, history, legalDocs: docs, routing, replyLanguage: 'en', streaming: true,
      onEvent(event, data) { if (event === 'token') tokens.push(data.text); } });
    assert.equal(reply, expected); assert.equal(tokens.join(''), expected);
    assert.doesNotMatch(reply, /Article|PDF|could not verify|counterfeit/i);
  }
  assert.equal(calls, 7, 'Only the conversational answer calls the model');
  for (const message of ['tell me more', 'in English', 'why?']) {
    assert.equal(questionRoute(message, [{ sender: 'user', content: 'Do you know Jimmy McGill?' }]).kind, 'social');
  }
});

test('fictional plot and comparisons with real law are distinguished before retrieval', async () => {
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: client(async request => {
    calls++;
    assert.equal(request.response_format.json_schema.name, 'question_understanding');
    assert.match(request.messages[0].content, /SOCIAL conversation with topic=none/);
    const message = JSON.parse(request.messages[1].content).message;
    return completion(message.includes('Rwanda')
      ? { kind: 'legal', topic: 'legal_profession', anchor: null, forceWeb: false, followup: false }
      : { kind: 'social', topic: 'none', anchor: null, forceWeb: false, followup: false });
  }) });
  const plot = 'Why did Jimmy McGill become Saul Goodman?';
  const legal = 'Would Jimmy McGill be allowed to practise as a lawyer in Rwanda?';
  assert.equal(questionRoute(plot).kind, 'unclear');
  const plotRoute = await provider.understand({ message: plot });
  assert.equal(plotRoute.kind, 'social'); assert.equal(publicSearchPlan(plot, [], plotRoute), null);
  const followup = 'What crimes did he commit in the show?';
  const history = [{ sender: 'user', content: 'Do you know Jimmy McGill?' }];
  assert.equal(questionRoute(followup, history).kind, 'unclear');
  const followupRoute = await provider.understand({ message: followup, history });
  assert.equal(followupRoute.kind, 'social'); assert.equal(publicSearchPlan(followup, history, followupRoute), null);
  const legalRoute = await provider.understand({ message: legal });
  assert.equal(legalRoute.kind, 'legal');
  assert.match(publicSearchPlan(legal, [], legalRoute).query, /Rwanda lawyer advocate bar association/);
  assert.equal(calls, 3);
});

test('a supported PDF answer makes one source-checked model call and no online search', async () => {
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { lookup() { throw new Error('PDF is sufficient'); } },
    client: client(async request => {
      calls++; assert.equal(request.tools, undefined);
      assert.doesNotMatch(request.messages[0].content, /BACKEND WEB RESEARCH/);
      return completion(sourceAnswer);
    }),
  });
  const reply = await provider.reply({ message: question, legalDocs: docs, replyLanguage: 'en' });
  assert.equal(calls, 1); assert.match(reply, /sixteen years/);
  assert.doesNotMatch(reply, /could not verify an explanation|Search sources/);
});

test('insufficient PDF support triggers one web lookup before a checked second draft, without publishing the first', async () => {
  const order = []; const tokens = [];
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { async lookup() { order.push('web'); return research; } },
    client: client(async () => {
      order.push('draft');
      if (order.length === 1) return completion({ status: 'insufficient', points: [] });
      return completion({ status: 'answered', points: [{ kind: 'rule', statement: 'Only permitted light work is covered by this guidance.',
        evidence: [{ source_id: 'W1', quote: research.sources[0].excerpt, paragraph: null }] }] });
    }),
  });
  const reply = await provider.reply({ message: 'What child work is allowed?', legalDocs: docs, replyLanguage: 'en', streaming: true,
    onEvent: (event, data) => { if (event === 'token') tokens.push(data.text); } });
  assert.deepEqual(order, ['draft', 'web', 'draft']);
  assert.equal(reply, tokens.join('')); assert.match(reply, /permitted light work/);
  assert.doesNotMatch(reply, /could not verify an explanation/);
});

test('current-law verification needs web evidence even when a dated PDF exists; Stop prevents deferred research', async () => {
  const order = [];
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { async lookup() { order.push('web'); return research; } },
    client: client(async () => { order.push('draft'); return completion(sourceAnswer); }),
  });
  await provider.reply({ message: question + ' under current law', legalDocs: docs, replyLanguage: 'en' });
  assert.deepEqual(order, ['web', 'draft']);
  const controller = new AbortController(); let lookups = 0;
  const stopped = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { async lookup() { lookups++; return research; } },
    client: client(async () => { controller.abort(); return completion({ status: 'insufficient', points: [] }); }),
  });
  await assert.rejects(stopped.reply({ message: question, legalDocs: docs, signal: controller.signal }), { name: 'AbortError' });
  assert.equal(lookups, 0);
});

test('missing PDF provisions search online after local and stored sources; failed search does not retry endlessly', async () => {
  const order = [];
  const query = { textSearch() { return this; }, order() { return this; }, async limit() { return { data: [] }; } };
  const stored = { from() { order.push('database'); return { select: () => query }; } };
  const message = 'What does Rwanda law say about drone permits?';
  const legalDocs = await searchLegalDocs(stored, message, [], 'en', { localSearch() { order.push('pdf'); return []; } });
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { async lookup() { order.push('web'); return { status: 'unavailable', sources: [] }; } },
    client: client(async () => { order.push('draft'); return { choices: [{ message: { content: 'I could not verify the permit requirements.' } }] }; }),
  });
  await provider.reply({ message, legalDocs, replyLanguage: 'en' });
  assert.equal(order[0], 'pdf'); assert.equal(order.filter(item => item === 'web').length, 1);
  assert.ok(order.indexOf('web') > order.lastIndexOf('database'));
});

test('PDF and web insufficiency never substitute the retrieved article as an answer', async () => {
  for (const status of ['ok', 'unavailable']) {
    let calls = 0; let lookups = 0;
    const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { async lookup() {
      lookups++; return status === 'ok' ? research : { status, sources: [] };
    } }, client: client(async () => { calls++; return completion({ status: 'insufficient', points: [] }); }) });
    const reply = await provider.reply({ message: question, legalDocs: docs, replyLanguage: 'en' });
    assert.equal(lookups, 1); assert.equal(calls, status === 'ok' ? 2 : 1);
    assert.doesNotMatch(reply, /Article 5|Law_regulating_labour|sixteen|exact wording/);
    assert.match(reply, /available legal sources/);
  }
});

test('malformed or unsupported drafts do not spend search credits as if they proved the PDF insufficient', async () => {
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { lookup() { throw new Error('Do not mask validation errors with research'); } },
    client: client(async () => completion({ status: 'insufficient', points: [{ statement: 'Invented advice' }] })) });
  const reply = await provider.reply({ message: question, legalDocs: docs, replyLanguage: 'en' });
  assert.doesNotMatch(reply, /Invented advice/);
});

test('unclear questions ask for context without selecting a PDF or offering a browser tool', async () => {
  const message = 'Can you explain that thing?';
  assert.deepEqual(await searchLegalDocs({ from() { throw new Error('No database search'); } }, message), []);
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { lookup() { throw new Error('No web lookup'); } }, client: client(async request => {
    assert.equal(request.tools, undefined); assert.equal(request.tool_choice, 'none');
    assert.match(request.messages[0].content, /legal connection.*unclear/);
    assert.doesNotMatch(request.messages[0].content, /Amategeko PDF:/);
    return { choices: [{ message: { content: 'Which legal issue would you like help with?' } }] };
  }) });
  assert.match(await provider.reply({ message, legalDocs: docs, replyLanguage: 'en' }), /Which legal issue/);
});

test('online follow-ups retain the latest user legal topic across repeated requests, including local languages', () => {
  const history = [{ sender: 'user', content: 'Can I get a refund for expired yoghurt?' },
    { sender: 'ai', content: 'Article 14 of the VAT law concerns foreign services.' },
    { sender: 'user', content: 'can you search online?' }];
  for (const message of ['can you search online ?', 'Please search online again', 'could you look it up online?',
    'can you check online?', 'can you search the internet?', 'shakisha kuri internet', 'shakisha kuri interineti', 'peux-tu chercher en ligne ?']) {
    const route = questionRoute(message, history);
    assert.equal(route.kind, 'legal', message); assert.equal(route.forceWeb, true, message);
    assert.equal(route.context, history[0].content);
    const plan = publicSearchPlan(message, history);
    assert.match(plan.query, /consumer protection/); assert.doesNotMatch(plan.query, /VAT|foreign|Article 14/);
  }
  const personal = [{ sender: 'user', content: 'My client Aniela was scammed. Her phone is 250788123456. What rights does she have?' }];
  assert.doesNotMatch(publicSearchPlan('can you search online?', personal).query, /Aniela|250788|client/);
});

test('the screenshot search follow-up performs a lookup even when the PDFs already support an answer', async () => {
  const order = []; const history = [{ sender: 'user', content: question }, { sender: 'ai', content: 'An unrelated tax article.' }];
  const message = 'can you search online ?';
  const legalDocs = await searchLegalDocs({ from() { throw new Error('Local PDF is present'); } }, message, history, 'en', {
    localSearch(text) { order.push('pdf'); assert.ok(text.includes(question)); return docs; },
  });
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { async lookup(input) {
    order.push('web'); assert.match(publicSearchPlan(input.message, input.history).query, /employment labour/); return research;
  } }, client: client(async request => {
    order.push('draft'); assert.match(request.messages[0].content, /ONLINE SEARCH FOLLOW-UP/);
    assert.ok(request.messages[0].content.includes(question));
    assert.match(request.messages[0].content, /BACKEND WEB RESEARCH/);
    return completion(sourceAnswer);
  }) });
  const reply = await provider.reply({ message, history, legalDocs, replyLanguage: 'en' });
  assert.deepEqual(order, ['pdf', 'web', 'draft']); assert.match(reply, /sixteen years/);
  assert.doesNotMatch(reply, /Which legal issue/);
});

test('an earlier wrong assistant article does not authorize searching an unrelated topic; a missing topic gets clarification', async () => {
  const never = () => { throw new Error('Do not research unrelated food'); };
  const history = [{ sender: 'user', content: 'i want yogohurt' }, { sender: 'ai', content: 'Law No. 049/2023 Article 14' }];
  const message = 'can you search online?';
  assert.equal(questionRoute(message, history).kind, 'unrelated');
  assert.deepEqual(await searchLegalDocs({ from: never }, message, history, 'en', { localSearch: never }), []);
  assert.equal(publicSearchPlan(message, history), null);
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: client(never), externalSearch: { lookup: never } });
  assert.equal(await provider.reply({ message, history, legalDocs: docs, replyLanguage: 'en' }), scopeReply('en'));
  assert.equal(questionRoute(message).kind, 'unclear');
  assert.equal(publicSearchPlan(message), null);
});

test('an explicit online request bypasses a reviewed canned PDF answer, and Stop cancels the answer after lookup', async () => {
  let lookups = 0; let drafts = 0;
  const controller = new AbortController();
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { async lookup() {
    lookups++; controller.abort(); return research;
  } }, client: client(async () => { drafts++; throw new Error('No draft after Stop'); }) });
  await assert.rejects(provider.reply({ message: 'umuntu wibye ahanishwa iki? please search online', history: [],
    legalDocs: [], replyLanguage: 'en', signal: controller.signal }), { name: 'AbortError' });
  assert.equal(lookups, 1); assert.equal(drafts, 0);
});
