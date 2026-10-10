import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalLegalQuestion, legalVocabularyInstruction, matchedLegalVocabulary } from '../legalVocabulary.js';
import { interpretLegalQuestion } from '../legalQuestion.js';
import { publicSearchPlan } from '../externalSearch.js';
import { resolveReplyLanguage } from '../chatLanguage.js';
import { vocabularyIssues, needsVocabularyReview, reviewedVocabularyHistory } from '../chatVocabularyGuard.js';
import { createChatProvider } from '../chatProvider.js';
import { buildChatMessages } from '../chatPrompt.js';
import { needsTranslation } from '../chatTranslation.js';

test('common rape wording and joined typing are recognised without inventing a robbery topic or penalty', () => {
  for (const message of ['gufata ku ngufu', 'gufata kungufu', 'gufatukungufu', 'gufatakungufu', 'gufatwa ku ngufu', 'yafashe umukobwa ku ngufu', 'bamufashe ku ngufu', 'gusambanya ku gahato', 'gukoresha undi imibonano mpuzabitsina ku gahato']) {
    const interpretation = interpretLegalQuestion(message);
    assert.equal(interpretation.topic, 'rape', message);
    assert.match(interpretation.retrievalQuery, /rape/);
    assert.equal(interpretation.penaltyQuestion, false);
    assert.match(publicSearchPlan(message).query, /Rwanda rape/);
    assert.doesNotMatch(publicSearchPlan(message).query, /theft|robbery/);
    assert.match(legalVocabularyInstruction(message), /rape/i);
    assert.equal(needsVocabularyReview(message), true);
  }
  assert.equal(resolveReplyLanguage('gufata kungufu'), 'rw');
  for (const message of ['Gufata kungufu in english is what?', 'gufata kungufu in English?', 'What is gufata ku ngufu in English?']) assert.equal(resolveReplyLanguage(message), 'en');
  assert.match(canonicalLegalQuestion('yafashe umukobwa ku ngufu'), /yafashe umukobwa ku ngufu \(rape/);
  const englishDraft = 'In Kinyarwanda the phrase gufata kungufu is a common expression that refers to the criminal act of rape. It means non-consensual sexual intercourse, while literal force during an arrest is a different context.';
  assert.equal(resolveReplyLanguage(englishDraft), 'en');
  assert.equal(needsTranslation(englishDraft, 'rw'), true);
  assert.equal(needsTranslation('Gufata ku ngufu bivuga gukoresha undi imibonano mpuzabitsina ku gahato, nyir’ukubikorerwa atabyemeye. Icyaha n’igihano bigomba kugenzurwa mu mategeko akurikizwa.', 'rw'), false);
});

test('sexual terms keep the distinctions between child abuse, harassment, indecent assault and GBV', () => {
  for (const [message, topic, query] of [
    ['gusambanya umwana', 'child_defilement', /child defilement/],
    ['yasambanyije umwana', 'child_defilement', /child sexual abuse/],
    ['gusambanya abana', 'child_defilement', /child defilement/],
    ['guhoza undi ku nkeke bifitanye isano n’imibonano mpuzabitsina', 'sexual_harassment', /sexual harassment/],
    ['guhoza ku nkenke y’imibonano mpuzabitsina', 'sexual_harassment', /sexual harassment/],
    ['ihohotera rishingiye ku gitsina', 'gender_based_violence', /gender based violence/],
    ['icyaha cy’urukozasoni', 'indecent_assault', /indecent assault/],
  ]) {
    const interpretation = interpretLegalQuestion(message);
    assert.equal(interpretation.topic, topic, message);
    assert.match(interpretation.retrievalQuery, query);
    assert.equal(interpretation.penaltyQuestion, false);
  }
  assert.equal(interpretLegalQuestion('guhoza ku nkeke').topic, null);
  assert.equal(interpretLegalQuestion('Yagize urukozasoni.').topic, null);
});

test('clear literal arrest, property-taking, links and code are not rewritten as rape', () => {
  for (const message of ['Polisi yafashe umuntu ku ngufu kuko yanze gufatwa.', 'Gufata ku ngufu telefone yanjye.', 'Gufata ubutaka ku ngufu.', 'Gufata ku ngufu umupira.', 'Read https://example.com/gufatukungufu', 'Explain `gufata kungufu` in this code snippet.']) {
    assert.equal(matchedLegalVocabulary(message).some(entry => entry.topic === 'rape'), false, message);
    assert.equal(canonicalLegalQuestion(message), message);
    assert.deepEqual(vocabularyIssues(message, [], 'Gufata kungufu means robbery.'), []);
  }
  assert.equal(interpretLegalQuestion('Polisi yafashe ukekwaho gufata umukobwa ku ngufu.').topic, 'rape');
});

test('the screenshot definitions are rejected, while correct comparisons and labelled mistakes are preserved', () => {
  const question = 'amategeko avuga iki ku gufata kungufu?';
  for (const draft of [
    'Gufata kungufu (gukora ubujura cyangwa igikorwa cy’akajagari ukoresheje imbaraga).',
    '| Gufata kungufu / Robbery | Imyaka 5 kugeza ku 10 |',
    'Gufata ku ngufu means robbery.', 'Gufata kungufu bivuga gukubita umuntu.',
  ]) assert.equal(vocabularyIssues(question, [], draft)[0]?.id, 'rape', draft);
  for (const draft of [
    'Gufata ku ngufu means rape, not robbery.',
    'Gufata kungufu si ubujura; bivuga gukoresha undi imibonano mpuzabitsina ku gahato.',
    'Incorrect translation: Gufata kungufu means robbery. The correct sexual-offence meaning is rape.',
    'Rape and robbery are distinct offences.',
    'Gufata ku ngufu means rape, whereas robbery concerns taking property.',
  ]) assert.deepEqual(vocabularyIssues(question, [], draft), [], draft);
  assert.equal(vocabularyIssues('gusambanya umwana', [], 'Gusambanya umwana means adultery.')[0]?.id, 'child_defilement');
  assert.equal(vocabularyIssues('ihohotera rishingiye ku gitsina', [], 'Ihohotera rishingiye ku gitsina means only rape.')[0]?.id, 'gender_based_violence');
  assert.equal(vocabularyIssues('sexual harassment', [], 'Sexual harassment means rape.')[0]?.id, 'sexual_harassment');
  assert.deepEqual(vocabularyIssues('sexual harassment', [], 'Sexual harassment is distinct from rape.'), []);
});

test('a mistaken old answer cannot supply the topic for a short penalty follow-up', () => {
  const history = [{ sender: 'user', content: 'gufata kungufu' }, { sender: 'ai', content: 'Gufata kungufu / Robbery. The penalty is five to ten years.' }];
  const snapshot = structuredClone(history);
  assert.equal(interpretLegalQuestion('ahanishwa iki?', history).topic, 'rape');
  assert.match(publicSearchPlan('ahanishwa iki?', history).query, /rape.*penalties/);
  assert.equal(reviewedVocabularyHistory(history).length, 1);
  const messages = buildChatMessages({ message: 'ahanishwa iki?', history });
  assert.equal(messages.some(item => item.role === 'assistant' && /Robbery/.test(item.content)), false);
  assert.deepEqual(history, snapshot);
});

test('wrong rape drafts are withheld and replaced with sourced meaning without carrying over invented penalties', async () => {
  const events = [];
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { lookup: async () => ({ status: 'not_needed', sources: [] }) }, client: { chat: { completions: { create: async () => {
    calls++;
    return (async function* () {
      yield { choices: [{ delta: { content: 'Gufata kungufu / Robbery. ' } }] };
      assert.equal(events.some(([name]) => name === 'token'), false);
      yield { choices: [{ delta: { content: 'The penalty is five to ten years. https://example.com/wrong-law' } }] };
    })();
  } } } } });
  const reply = await provider.reply({ message: 'Gufata kungufu in English is what?', streaming: true, onEvent: (name, data) => events.push([name, data]) });
  assert.equal(calls, 1);
  assert.match(reply, /means rape/);
  assert.match(reply, /rlrc.gov.rw/);
  assert.doesNotMatch(reply, /five to ten|example.com/);
  assert.equal(events.filter(([name]) => name === 'token').map(([, data]) => data.text).join(''), reply);
});
