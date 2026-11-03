import test from 'node:test';
import assert from 'node:assert/strict';

import { buildLegalAnswerPipeline, legalAnswerContract } from '../legalPipeline.js';

test('legal answer pipeline identifies a legal task and source-grounding requirements', () => {
  const pipeline = buildLegalAnswerPipeline({
    message: 'What is the penalty for theft in Rwanda?',
    history: [],
    routing: { kind: 'legal', answerTask: 'penalty' },
    replyLanguage: 'en',
  });

  assert.equal(pipeline.task, 'penalty');
  assert.equal(pipeline.mustCiteSources, true);
  assert.equal(pipeline.needsCurrentVerification, false);
  assert.deepEqual(pipeline.steps[0], 'classify the user intent and legal task');
});

test('legal answer contract flags missing source grounding for legal tasks', () => {
  const contract = legalAnswerContract({
    answer: 'Theft is punishable under the law.',
    sources: [],
    task: 'rule',
  });

  assert.equal(contract.isCompliant, false);
  assert.equal(contract.hasSourceEvidence, false);
  assert.match(contract.warnings[0], /source grounding/i);

  const compliant = legalAnswerContract({
    answer: 'Theft attracts penalties under the statute [Law No. 68/2018](https://example.test/law-68-2018).',
    sources: [{ title: 'Law No. 68/2018' }],
    task: 'rule',
  });

  assert.equal(compliant.isCompliant, true);
  assert.equal(compliant.hasSourceEvidence, true);
});
