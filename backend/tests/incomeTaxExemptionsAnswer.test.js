import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchLocalLaws } from '../localLawSearch.js';
import { incomeTaxExemptionsAnswer, isBasicEmploymentExemptionsQuestion } from '../incomeTaxExemptionsAnswer.js';
import { createChatProvider } from '../chatProvider.js';

const question = 'what are Payments exempted from\nemployment income tax';
const docs = searchLocalLaws(question);

test('the exact reported question receives all five conditional exemptions and one PDF citation', () => {
  const answer = incomeTaxExemptionsAnswer(question, docs);
  assert.equal((answer.match(/^\d\. /gm) || []).length, 5);
  assert.match(answer, /employee or their associate/);
  assert.match(answer, /\(a\) wholly.*\(b\) deducted or deductible/);
  assert.match(answer, /public social security/);
  assert.match(answer, /qualified pension fund/);
  assert.match(answer, /non-Rwandan citizen.*agreement signed.*aid services performed in Rwanda/);
  assert.match(answer, /non-resident individual from a non-resident employer/);
  assert.match(answer, /unless.*permanent establishment in Rwanda/);
  assert.match(answer, /published 2022 provision/);
  assert.equal((answer.match(/\]\(https:/g) || []).length, 1);
  assert.doesNotMatch(answer, /could not verify|not a complete answer|saved at|business activities\s+or\s/);
});

test('reviewed English, Kinyarwanda and French source text can support the translated explanation', () => {
  for (const sourceLanguage of ['en', 'rw', 'fr']) {
    const sources = searchLocalLaws(question, [], sourceLanguage);
    for (const language of ['en', 'rw', 'fr']) {
      const answer = incomeTaxExemptionsAnswer(question, sources, language);
      assert.ok(answer, `${sourceLanguage} -> ${language}`);
      assert.equal((answer.match(/^\d\. /gm) || []).length, 5);
      assert.equal((answer.match(/\]\(https:/g) || []).length, 1);
    }
  }
});

test('only a generic exemption overview qualifies; individual eligibility and current-law research use the model', () => {
  for (const text of [question, 'Which payments are exempt from PAYE?', 'Explain payments exempted from employment income tax under Law No. 027/2022 Article 16',
    'Ibisonewe umusoro ku musaruro ukomoka ku murimo ni ibihe?', 'Quels paiements sont exonérés de l’impôt sur le revenu d’emploi ?']) {
    assert.equal(isBasicEmploymentExemptionsQuestion(text), true, text);
  }
  for (const text of ['What payments are exempt from VAT?', 'What are employment income tax exemptions today?',
    'Are my NGO wages exempt from PAYE?', 'What payments are exempt from PAYE under Law No. 014/2025?',
    'Explain Article 17 payments exempted from employment income tax', 'Calculate tax on my pension',
    question + ' Does this apply to my employer?', 'Are all pension payments exempt from PAYE?']) {
    assert.equal(isBasicEmploymentExemptionsQuestion(text), false, text);
    assert.equal(incomeTaxExemptionsAnswer(text, docs), null, text);
  }
});

test('missing, partial, altered or misidentified evidence cannot activate the reviewed answer', () => {
  assert.equal(incomeTaxExemptionsAnswer(question, []), null);
  const source = docs.find(doc => doc.articleNumber === 16);
  for (const changed of [
    { coverage: 'partial_article' }, { articleNumber: 17 },
    { content: source.content.replace('unless', 'even when') },
    { content: source.content.slice(0, -50) },
    { source: source.source.replace('#page=39', '#page=38') },
    { source: source.source.replace('lazejiagfzqqqkesuvgk.supabase.co', 'example.com') },
    { source: source.source + '?untrusted=1' },
    { content: source.content.replace('law-27-2022', 'law-49-2023') },
  ]) assert.equal(incomeTaxExemptionsAnswer(question, [{ ...source, ...changed }]), null);
});

test('the reviewed answer streams without a model or web request, including during model cooldown', async () => {
  let calls = 0; let lookups = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', fallbackModel: 'none',
    externalSearch: { async lookup() { lookups++; return { status: 'disabled' }; } },
    client: { chat: { completions: { async create() { calls++; throw Object.assign(new Error('Provider quota'), { status: 429, retryAfterSeconds: 600 }); } } } },
  });
  await assert.rejects(provider.reply({ message: question + ' Does this apply to my employer?', legalDocs: docs, history: [] }));
  const before = { calls, lookups }; const tokens = [];
  const answer = await provider.reply({ message: question, legalDocs: docs, history: [], replyLanguage: 'en', streaming: true,
    onEvent: (event, data) => { if (event === 'token') tokens.push(data.text); },
  });
  assert.deepEqual({ calls, lookups }, before);
  assert.equal(answer, incomeTaxExemptionsAnswer(question, docs));
  assert.equal(answer, tokens.join(''));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(provider.reply({ message: question, legalDocs: docs, signal: controller.signal }), { name: 'AbortError' });
});
