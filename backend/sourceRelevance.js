import {interpretLegalQuestion} from './legalQuestion.js';
import {matchedLegalVocabulary} from './legalVocabulary.js';
import {lawExcerptMetadata} from './lawArticles.js';

export function sourceBody(document) {
  const content=String(document?.content||'');
  return lawExcerptMetadata(document)?content.split('\n').slice(2).join('\n').trim():content.trim();
}

// A real quotation is not evidence for a different topic. This vocabulary
// check rejects obvious mismatches; it does not prove legal applicability.
export function sourceMatchesTopic(document,question) {
  const requested=interpretLegalQuestion(question).topics;
  if(!requested.length)return true;
  const supplied=new Set(matchedLegalVocabulary(sourceBody(document)).map(entry=>entry.topic));
  return requested.some(topic=>supplied.has(topic));
}
