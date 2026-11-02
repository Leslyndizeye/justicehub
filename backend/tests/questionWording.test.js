import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionWording } from '../../shared/questionWording.js';
import { questionRoute } from '../questionRouting.js';
import { createChatProvider } from '../chatProvider.js';
import { searchLegalDocs } from '../legalRetrieval.js';

test('spelling hints preserve original facts, amounts, names, negation, URLs and quoted/code content', () => {
  const message = 'My name is Salery. My emploer will not pay 120,000 FRW by 2026-11-02. Article 54, https://example.com/legel and `contrakt` are unchanged.';
  const result = questionWording(message);
  assert.equal(result.original, message);
  assert.match(result.normalized, /My name is Salery\. My employer will not pay 120,000 FRW by 2026-11-02\. Article 54/);
  assert.match(result.normalized, /https:\/\/example.com\/legel and `contrakt`/);
  assert.deepEqual(result.hints, [{ written: 'emploer', possibleReading: 'employer' }]);
  assert.equal(questionWording('My client did not murder anyone. My order is late. A fine is not a conviction.').normalized,
    'My client did not murder anyone. My order is late. A fine is not a conviction.');
});

test('informal employment wording reaches semantic understanding and salary sources while the model receives the original question', async () => {
  const message = 'my emploer wont pay my salery'; let understood = false;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: { chat: { completions: { async create(request) {
    understood = true;
    const input = JSON.parse(request.messages[1].content);
    assert.equal(input.message, message);
    assert.deepEqual(input.wordingHints.map(hint => hint.possibleReading), ['employer', 'salary']);
    return { choices: [{ message: { content: JSON.stringify({ kind: 'legal', topic: 'employment_pay', anchor: null, followup: false, forceWeb: false, clarification: 'none' }) } }] };
  } } } } });
  const routing = await provider.understand({ message });
  assert.equal(understood, true);
  const docs = await searchLegalDocs({ from() { throw new Error('Local source retrieval should suffice'); } }, message, [], 'en', { resolvedRoute: routing });
  assert.ok(docs.some(doc => /salary|payment/i.test(doc.content)));
  assert.equal(message, 'my emploer wont pay my salery');
});

test('unfamiliar spellings and sound-alikes remain questions for understanding rather than automatic legal findings', () => {
  for (const message of ['can u explain this legel issue', 'my landloard wants me out', 'how does divorse work', 'i need a marige document']) {
    assert.equal(questionRoute(message).kind, 'legal', message);
  }
  assert.equal(questionWording('brake the low; low salary; I ordered food').hints.length, 0);
  assert.equal(questionRoute('i am in love with someone is it legel in rwanda').intent, 'personal_feelings');
});
