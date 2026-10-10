import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpretCasualMessage, casualReply } from '../../shared/chatCasual.js';
import { resolveReplyLanguage } from '../chatLanguage.js';
import { createChatProvider } from '../chatProvider.js';
import { searchLegalDocs } from '../legalRetrieval.js';
import { buildChatMessages } from '../chatPrompt.js';

const oldLegalChat = [
  { sender: 'user', content: 'What does Rwanda law say about gutubura?' },
  { sender: 'ai', content: 'Gutubura means assault.' },
  { sender: 'user', content: 'What is the penalty for theft?' },
  { sender: 'ai', content: 'I could not complete a live source lookup. Here is general theft guidance.' },
];

test('short Kinyarwanda typing greetings choose their own language instead of the earlier topic', () => {
  for (const message of ['bimeze gute c', 'Bimeze gute c?', 'bimeze gutec!', 'bimeze gute se?', 'umeze ute c', 'amakuru c', 'bite c', 'amakuru?', 'bimeze gute c 😊']) {
    assert.equal(interpretCasualMessage(message)?.standalone, true, message);
    assert.equal(resolveReplyLanguage(message, oldLegalChat), 'rw', message);
    assert.equal(resolveReplyLanguage(message), 'rw', message);
  }
  assert.equal(resolveReplyLanguage('how r u?', oldLegalChat), 'en');
  assert.equal(resolveReplyLanguage('how are u?', oldLegalChat), 'en');
});

test('the screenshot greeting replies without model requests, legal research, or recovery boilerplate', async () => {
  let calls = 0;
  const provider = createChatProvider({
    model: 'openai/gpt-oss-120b',
    client: { chat: { completions: { create: async () => { calls++; throw Object.assign(new Error('Limited'), { status: 429 }); } } } },
  });
  for (const streaming of [true, false]) {
    const events = [];
    const reply = await provider.reply({ message: 'bimeze gute c', history: oldLegalChat, legalDocs: [{ title: 'Theft', content: 'Unrelated excerpt' }], streaming, onEvent: (name, data) => events.push([name, data]) });
    assert.match(reply, /Wowe umeze ute/);
    assert.doesNotMatch(reply, /amategeko|gutubura|icyaha|lookup|Sinashoboye|Imbuga/);
    assert.deepEqual(events, streaming ? [['token', { text: reply }]] : []);
  }
  assert.deepEqual(await searchLegalDocs({ from() { calls++; throw new Error('Should not query legal documents'); } }, 'bimeze gute c', oldLegalChat), []);
  assert.equal(calls, 0);
});

test('a greeting also works during provider cooldown but does not clear its quota limit', async () => {
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', fallbackModel: 'none', now: () => 0,
    client: { chat: { completions: { create: async () => { calls++; throw Object.assign(new Error('Quota limit'), { status: 429, retryAfterSeconds: 60 }); } } } },
  });
  await assert.rejects(provider.reply({ message: 'Explain my rights' }), { status: 429 });
  assert.match(await provider.reply({ message: 'bimeze gute c' }), /Wowe umeze ute/);
  await assert.rejects(provider.reply({ message: 'Explain my rights' }), { status: 429 });
  assert.equal(calls, 1);
});

test('mixed greetings preserve the substantive request, sources, identifiers and code', async () => {
  const message = 'bimeze gute c, nsobanurira gutubura n’ingingo C. https://example.com/C `char c = 1;`';
  assert.equal(interpretCasualMessage(message)?.standalone, false);
  assert.equal(casualReply(message, 'rw'), null);
  const messages = buildChatMessages({ message, replyLanguage: 'rw' });
  assert.match(messages[0].content, /CASUAL TYPING CONTEXT/);
  assert.match(messages[0].content, /answer that substantive request/);
  assert.match(messages.at(-1).content, /Original question: bimeze gute c/);
  assert.match(messages.at(-1).content, /scam|fraud/i);
  assert.match(messages.at(-1).content, /https:\/\/example.com\/C/);
  assert.match(messages.at(-1).content, /`char c = 1;`/);
  let query;
  await searchLegalDocs({ from() { return { select() { return { textSearch(column, value) { query = value; return { limit: async () => ({ data: [] }) }; } }; } }; } }, message);
  assert.match(query, /fraud|swindl/i);
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: { chat: { completions: { create: async request => {
    calls++;
    assert.match(request.messages[0].content, /CASUAL TYPING CONTEXT/);
    return { choices: [{ message: { content: 'Gutubura ni ubutekamutwe. Bisaba gusuzuma amakuru n’amategeko.' } }] };
  } } } } });
  assert.match(await provider.reply({ message }), /Gutubura/);
  assert.equal(calls, 1);
});

test('substantive or quoted words, URLs, code and ordinary C references are not standalone greetings', () => {
  for (const message of ['Explain grade C', 'Teach me C', '`bimeze gute c`', '"bimeze gute c" means what?', 'https://example.com/bimeze-gute-c', 'amakuru mashya ku mategeko', 'amakuru C programming language', 'bite the apple', 'bimeze gute c, umuntu wibye ahanishwa iki?', 'bimeze gute c 12', 'bimeze gute c https://example.com', 'bimeze gute c `C`']) {
    assert.notEqual(interpretCasualMessage(message)?.standalone, true, message);
    assert.equal(casualReply(message, 'rw'), null, message);
    assert.ok(buildChatMessages({ message }).at(-1).content.includes(message), message);
  }
});

test('explicit language requests still take precedence over the greeting', async () => {
  assert.equal(resolveReplyLanguage('bimeze gute c, answer in English'), 'en');
  assert.equal(resolveReplyLanguage('bimeze gute c', [], 'fr'), 'fr');
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: {} });
  assert.match(await provider.reply({ message: 'bimeze gute c', replyLanguage: 'en' }), /How are you/);
  assert.match(await provider.reply({ message: 'bimeze gute c', replyLanguage: 'fr' }), /comment allez-vous/);
});

test('cancelled greetings do not emit a reply', async () => {
  const controller = new AbortController();
  controller.abort();
  const events = [];
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: {} });
  await assert.rejects(provider.reply({ message: 'bimeze gute c', streaming: true, signal: controller.signal, onEvent: (...event) => events.push(event) }), { name: 'AbortError' });
  assert.deepEqual(events, []);
});

test('stretched acknowledgements in the new screenshot require no quota and keep bare ok language context', async () => {
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: {} });
  for (const message of ['okay okay gotchuuu', 'okay gotchuuuu!', 'gotcha', 'got u', 'got it', 'okay', 'ok']) {
    assert.equal(interpretCasualMessage(message)?.kind, 'acknowledgement', message);
    assert.match(await provider.reply({ message }), /Got it/, message);
  }
  const rwHistory = [{ sender: 'user', content: 'umuntu wibye ahanishwa iki?' }];
  assert.equal(resolveReplyLanguage('ok', rwHistory), 'rw');
  assert.match(await provider.reply({ message: 'okay okay', history: rwHistory }), /^Ni byiza/);
  for (const message of ['okay okay gotchuuu, what is the current law?', 'gotcha https://example.com', 'got it 2026', 'okay `C`', 'okay explain my rights']) {
    assert.equal(casualReply(message, 'en'), null, message);
  }
});
