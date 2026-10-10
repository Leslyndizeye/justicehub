import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsVocabularyReview, wrongFraudMeaning, reviewedVocabularyHistory } from '../chatVocabularyGuard.js';
import { buildChatMessages } from '../chatPrompt.js';
import { createChatProvider } from '../chatProvider.js';

const message = 'gutubura murwanda cyangwa amategeko yo murwanda abivugaho iki ?';
const token = content => ({ choices: [{ delta: { content } }] });
const client = create => ({ chat: { completions: { create } } });

test('detects the screenshot mistranslation without rejecting a correct distinction', () => {
  for (const draft of ['**Gutubura (assault) mu Rwanda**\nIgihano ni igifungo.', 'Gutubura bivuga gukubita umuntu.', 'Icyaha ni ugukomeretsa umuntu, harimo ibikomere.']) {
    assert.equal(wrongFraudMeaning(message, [], draft), true, draft);
  }
  for (const draft of ['Gutubura ni ubutekamutwe, si gukubita.', 'Scamming is fraud, not assault.', 'Gutubura si ugukubita; bivuga ubwambuzi bushukana.']) {
    assert.equal(wrongFraudMeaning(message, [], draft), false, draft);
  }
  assert.equal(wrongFraudMeaning('gutubura no gukubita biratandukaniye he?', [], 'Fraud differs from assault.'), false);
  assert.equal(needsVocabularyReview('gutubura imbuto'), false);
  assert.equal(needsVocabularyReview(message), true);
});

test('an old assistant mistranslation cannot change the user’s fraud topic on follow-up', () => {
  const history = [{ sender: 'user', content: message }, { sender: 'ai', content: 'Gutubura (assault) mu Rwanda' }];
  assert.equal(needsVocabularyReview('ahanishwa iki?', history), true);
  assert.equal(wrongFraudMeaning('ahanishwa iki?', history, 'Assault causes bodily injury.'), true);
  const request = buildChatMessages({ message: 'ahanishwa iki?', history });
  assert(!request.some(item => item.role === 'assistant' && item.content.includes('Gutubura (assault)')));
  assert(request.some(item => item.role === 'user' && item.content === message));
  assert.equal(history.length, 2, 'Saved history is unchanged');
});

test('legitimate assault explanations and corrected fraud answers remain in context', () => {
  const history = [{ sender: 'user', content: 'What does assault mean?' }, { sender: 'ai', content: 'Assault concerns physical injury.' },
    { sender: 'user', content: message }, { sender: 'ai', content: 'Gutubura ni ubutekamutwe, si gukubita.' }];
  assert.deepEqual(reviewedVocabularyHistory(history), history);
});

test('a long mistaken answer is removed before applying the conversation budget', async () => {
  const history = [{ sender: 'user', content: 'My question concerns gutubura.' },
    { sender: 'ai', content: 'Gutubura (assault). ' + 'Wrong explanation. '.repeat(400) }];
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: client(async request => {
    assert(request.messages.some(item => item.role === 'user' && item.content === history[0].content));
    assert(!request.messages.some(item => item.role === 'assistant' && item.content.includes('assault')));
    return { choices: [{ message: { content: 'Gutubura ni ubutekamutwe.' } }] };
  }) });
  assert.match(await provider.reply({ message, history, replyLanguage: 'rw' }), /ubutekamutwe/);
  assert.equal(history.length, 2);
});

test('withholds a bad streamed draft and returns sourced meaning without extra requests or wrong source links', async () => {
  const events = [];
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: client(async request => {
    calls++;
    assert.match(request.messages.at(-1).content, /gukora ubutekamutwe/);
    return (async function* () {
      yield { choices: [{ delta: { executed_tools: [{ name: 'browser.open', index: 0, output: 'URL: https://official.example/assault' }] } }] };
      yield token('**Gutubura (assault) mu Rwanda**\n');
      assert(!events.some(([name]) => name === 'token'));
      yield token('Igihano ni imyaka itatu. Gukubita bitera ibikomere.');
    })();
  }) });
  const reply = await provider.reply({ message, replyLanguage: 'rw', streaming: true, onEvent: (event, data) => events.push([event, data]) });
  assert.equal(calls, 1);
  assert.match(reply, /ubutekamutwe cyangwa ubwambuzi bushukana/);
  assert.match(reply, /rib\.gov\.rw/);
  assert.doesNotMatch(reply, /assault|official\.example|itatu/);
  assert.equal(events.filter(([name]) => name === 'token').map(([, data]) => data.text).join(''), reply);
  assert.equal(events.filter(([name]) => name === 'status').at(-1)[1].webSearch, false);
});

test('a correct slang draft is checked before publishing and then saved intact', async () => {
  const chunks = [];
  const reply = 'Gutubura ni ubutekamutwe. Icyaha kigomba guhamishwa n’urukiko; ibihano bigenzurwa mu itegeko rikurikizwa.';
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: client(async () => (async function* () {
    yield token(reply.slice(0, 40));
    assert.equal(chunks.length, 0);
    yield token(reply.slice(40));
  })()) });
  const result = await provider.reply({ message, replyLanguage: 'rw', streaming: true, onEvent: (event, data) => { if (event === 'token') chunks.push(data.text); } });
  assert.equal(result, reply);
  assert.equal(chunks.join(''), reply);
});

test('translation introducing the wrong slang meaning is also blocked before any text is sent', async () => {
  let calls = 0;
  const chunks = [];
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: client(async () => {
    calls++;
    return { choices: [{ message: { content: calls === 1 ? 'Scamming is fraud. The legal outcome depends on the facts.' : 'Gutubura (assault) bivuga gukubita umuntu.' } }] };
  }) });
  const reply = await provider.reply({ message, replyLanguage: 'rw', onEvent: (event, data) => { if (event === 'token') chunks.push(data.text); } });
  assert.equal(calls, 2);
  assert.match(reply, /ubutekamutwe cyangwa ubwambuzi bushukana/);
  assert.deepEqual(chunks, []);
});

test('Stop cancels a withheld slang draft instead of publishing it after cancellation', async () => {
  const controller = new AbortController();
  const chunks = [];
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: client(async () => (async function* () {
    yield token('Gutubura ni ubutekamutwe.');
    controller.abort();
  })()) });
  await assert.rejects(provider.reply({ message, streaming: true, signal: controller.signal, onEvent: (event, data) => { if (event === 'token') chunks.push(data.text); } }), { name: 'AbortError' });
  assert.deepEqual(chunks, []);
});
