import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpretLegalQuestion } from '../legalQuestion.js';
import { searchLegalDocs } from '../legalRetrieval.js';
import { buildChatMessages } from '../chatPrompt.js';

test('understands the Kinyarwanda punishment questions in the screenshots', () => {
  for (const message of ['umuntu wibye bamuhanisha icyi mu rwanda', 'umuntu wibye ahanishwa iki ?', 'umuntu wibye ahanishwaki?', 'What is the penalty for theft in Rwanda?', 'Quelle est la peine pour vol au Rwanda ?']) {
    const result = interpretLegalQuestion(message);
    assert.equal(result.topic, 'theft', message);
    assert.equal(result.penaltyQuestion, true, message);
    assert.equal(result.retrievalQuery, 'theft', message);
  }
});

test('a short punishment follow-up retains theft, but another topic and assistant guesses do not', () => {
  const history = [{ sender: 'user', content: 'umuntu wibye bamuhanisha icyi mu rwanda' }, { sender: 'ai', content: 'Please clarify what you mean.' }];
  assert.equal(interpretLegalQuestion('ahanishwa iki?', history).penaltyQuestion, true);
  assert.equal(interpretLegalQuestion('bamuhanisha iki?', history).topic, 'theft');
  assert.equal(interpretLegalQuestion('ahanishwa iki?', [...history, { sender: 'user', content: 'None se ubwicanyi?' }]).topic, 'murder');
  assert.equal(interpretLegalQuestion('ahanishwa iki?', [{ sender: 'ai', content: 'Your case concerns theft.' }]).topic, null);
  assert.equal(interpretLegalQuestion('What is the penalty for tax fraud?', history).topic, 'fraud');
});

test('lawful mitigation and requests for wrongdoing are not rewritten as a general penalty query', () => {
  for (const message of ['My client stole property; how do I reduce the sentence?', 'How can I steal without getting punished?', 'Where do I report theft?', 'How does arrest and sentencing for theft work?']) {
    assert.equal(interpretLegalQuestion(message).penaltyQuestion, false, message);
  }
});

test('Kinyarwanda uses English topic retrieval and database errors do not fabricate references', async () => {
  let query;
  const document = { title: 'Theft', content: 'Legal excerpt', source: 'https://official.example/law' };
  const incidental = { title: 'Employment misconduct', content: 'Also mentions theft' };
  const client = { from() { return { select() { return { textSearch(column, value) {
    query = value;
    return { limit: async () => value === 'theft' ? { data: [incidental, document] } : { data: [] } };
  } }; } }; } };
  assert.deepEqual(await searchLegalDocs(client, 'umuntu wibye ahanishwa iki ?'), [document, incidental]);
  assert.equal(query, 'theft');
  assert.deepEqual(await searchLegalDocs({ from() { throw new Error('Unavailable'); } }, 'umuntu wibye ahanishwa iki?'), []);
});

test('the punishment request gets dated official grounding even with no database matches', () => {
  const messages = buildChatMessages({ message: 'umuntu wibye ahanishwa iki ?', replyLanguage: 'rw' });
  const instruction = messages[0].content;
  assert.match(instruction, /CURRENT QUESTION.*punishment/s);
  assert.match(instruction, /baseline penalty.*FIRST/);
  assert.match(instruction, /1–2 years/);
  assert.match(instruction, /1,000,000–2,000,000/);
  assert.match(instruction, /six months of community service/);
  assert.match(instruction, /only one of those penalties/);
  assert.match(instruction, /minijust\.gov\.rw.*page=155/);
  assert.match(instruction, /20 February 2025/);
  assert.match(instruction, /not a consolidated guarantee/);
  assert.doesNotMatch(instruction, /No matching legal excerpts were retrieved/);
  assert.equal(messages.at(-1).content, 'umuntu wibye ahanishwa iki ?');
  const unrelated = buildChatMessages({ message: 'hello' })[0].content;
  assert.doesNotMatch(unrelated, /CURRENT QUESTION|six months of community service/);
});
