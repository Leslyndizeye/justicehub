import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionRoute, needsQuestionUnderstanding } from '../questionRouting.js';
import { everydayQuestionReply } from '../../shared/everydayQuestions.js';
import { createChatProvider } from '../chatProvider.js';
import { searchLegalDocs } from '../legalRetrieval.js';
import { lawExcerptMetadata } from '../lawArticles.js';

const noDatabase = { from() { throw new Error('Orientation must not query the database'); } };
const neverGenerate = { chat: { completions: { create() { throw new Error('Orientation must not spend model quota'); } } } };
const model = 'openai/gpt-oss-120b';

test('the reported everyday questions receive helpful streamed replies even without database, search or model quota', async () => {
  const provider = createChatProvider({ model, client: neverGenerate,
    externalSearch: { lookup() { throw new Error('Orientation must not research online'); } } });
  for (const [message, expected] of [
    ['i am in love with someone is it legal in rwanda', /romantic feelings.*dating, marriage/s],
    ['can u tell me one law that sometimes we likely kill', /law people sometimes break.*law about killing/s],
    ['i think i am sick', /sorry.*healthcare professional.*sick leave/is],
    ["I'm falling in love with someone. Is that illegal?", /romantic feelings/],
    ['Is loving someone against the law in Rwanda?', /romantic feelings/],
    ['I have a crush on someone. Is it allowed?', /romantic feelings/],
  ]) {
    const routing = await provider.understand({ message });
    const legalDocs = await searchLegalDocs(noDatabase, message, [], 'en', { resolvedRoute: routing });
    assert.deepEqual(legalDocs, []);
    const tokens = [];
    const reply = await provider.reply({ message, routing, legalDocs, history: [], replyLanguage: 'en', streaming: true,
      onEvent: (event, data) => { assert.equal(event, 'token'); tokens.push(data.text); } });
    assert.match(reply, expected);
    assert.equal(reply, tokens.join(''));
    assert.doesNotMatch(reply, /allowance|couldn.t establish|unrelated article|Article \d|Web search used/);
  }
});

test('sick-leave rights retrieve illness provisions instead of the general wellbeing orientation or maternity leave', async () => {
  const message = 'My employer refuses sick leave. What are my rights?';
  const routing = questionRoute(message);
  assert.equal(routing.kind, 'legal');
  assert.equal(everydayQuestionReply(routing), null);
  const docs = await searchLegalDocs(noDatabase, message, [], 'en', { resolvedRoute: routing });
  assert.ok(docs.some(doc => lawExcerptMetadata(doc)?.key === 'law-66-2018' && [54, 55].includes(doc.articleNumber)));
  assert.equal(docs.filter(doc => [54, 55].includes(doc.articleNumber)).length, 2);
  assert.ok(docs.every(doc => doc.articleNumber !== 56));
});

test('specific relationship facts, real killing questions and medical emergencies are not reduced to simple orientations', () => {
  for (const message of [
    'I am in love with someone who is fifteen. Is it legal?',
    'I am in love with my teacher. Is it legal?',
    'I love her but she refuses to date me. Can I follow her?',
    'Is it legal to marry someone who is already married?',
    'What law applies when someone kills in self-defence?',
    'Can I kill a person who threatens me?',
    'What law applies if we sometimes kill someone?',
    'I am sick and my employer refuses sick leave',
  ]) assert.equal(everydayQuestionReply(questionRoute(message)), null, message);
  for (const message of ['I am sick and cannot breathe', 'I want to kill myself']) {
    assert.equal(questionRoute(message).kind, 'safety');
    assert.equal(everydayQuestionReply(questionRoute(message)), null);
  }
  assert.equal(questionRoute('search online: is being in love legal in Rwanda?').forceWeb, true);
  assert.notEqual(questionRoute('Give me one law people commonly break by hunting protected animals').intent, 'legal_example');
  assert.notEqual(questionRoute('Give me one tax law people commonly break').intent, 'legal_example');
});

test('a clarification follow-up retrieves an actual privacy provision for an everyday example without assuming homicide', async () => {
  const original = 'can u tell me one law that sometimes we likely kill';
  const history = [{ sender: 'user', content: original }, { sender: 'ai', content: everydayQuestionReply(questionRoute(original)) }];
  for (const message of ['the first one', 'break the law', 'Give me one law people commonly break']) {
    const routing = questionRoute(message, history);
    assert.equal(routing.intent, 'legal_example');
    const docs = await searchLegalDocs(noDatabase, message, history, 'en', { resolvedRoute: routing });
    assert.ok(docs.length);
    assert.ok(docs.every(doc => lawExcerptMetadata(doc)?.key === 'constitution-2023' && doc.articleNumber === 23));
    assert.match(docs[0].content, /privacy|private life/i);
  }
});

test('general legal keywords permit semantic understanding while clear tax and article requests retain the fast path', () => {
  for (const message of ['Is it legal to be with my teacher?', 'Can you explain the law about a crush?', 'Am I allowed to do that legally?']) {
    assert.equal(needsQuestionUnderstanding(message, questionRoute(message)), true, message);
  }
  for (const message of ['Explain the VAT rate', 'Explain Law No. 027/2022 article 12', 'What does the constitution say about equality?']) {
    assert.equal(needsQuestionUnderstanding(message, questionRoute(message)), false, message);
  }
});

test('orientations use the requested language, preserve cancellation and provide no unsupported relationship authorization', async () => {
  for (const [message, language, expected] of [
    ['i am in love with someone is it legal in rwanda', 'rw', /amarangamutima/],
    ['je suis amoureux de quelqu’un', 'fr', /sentiments amoureux/],
    ['ndumva ndwaye', 'rw', /ubuzima/],
  ]) assert.match(everydayQuestionReply(questionRoute(message), language), expected);
  const controller = new AbortController(); controller.abort();
  const provider = createChatProvider({ model, client: neverGenerate });
  await assert.rejects(provider.reply({ message: 'i think i am sick', signal: controller.signal }), { name: 'AbortError' });
});
