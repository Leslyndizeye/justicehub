import corpus from './data/criminalProvisions.json' with {type:'json'};
import {interpretLegalQuestion} from './legalQuestion.js';

// Reviewed, dated primary text. These excerpts are not a consolidated code or
// proof that a provision is currently in force or applies to a particular case.
const documents = corpus.articles.map(article => Object.freeze({
  title: `Law No. ${corpus.law}, Article ${article.number} (published ${corpus.published})`,
  category: 'criminal', year: 2018, evidenceKind: 'statute', coverage: 'complete',
  articleNumber: article.number, pdfPages: article.pages,
  source: `${corpus.source}#page=${article.pages[0]}`,
  reviewed_on: corpus.reviewedOn, sourceSha256: corpus.sha256, content: article.text,
}));

export function isReviewedStatute(document) {
  return document?.evidenceKind === 'statute' && documents.some(known => known.articleNumber === document.articleNumber
    && known.source === document.source && known.content === document.content);
}

export function searchCriminalProvisions(message, history = []) {
  const named = String(message).match(/\b(?:law|loi|itegeko)\s*(?:(?:no\.?|n[º°o]?\.?)\s*)?(\d{1,3})\/(\d{4})/i);
  if (named && (Number(named[1]) !== 68 || named[2] !== '2018')) return [];
  const {topic} = interpretLegalQuestion(message, history);
  // A tax/cyber offence needs its own legal analysis, not automatic use of the
  // general fraud provision merely because it shares the word "fraud".
  if (!named && /\b(?:tax\w*|rra|imisoro|umusoro|cyber\w*|computer|fiscal\w*)\b/i.test(message)) return [];
  const requested = String(message).match(/\b(?:article|ingingo\s+ya)\s+(\d{1,3})\b/i)?.[1];
  if (!named && !['murder','fraud'].includes(topic)) return [];
  return documents.filter(doc => requested ? doc.articleNumber === Number(requested)
    : corpus.articles.find(article => article.number === doc.articleNumber).topic === topic);
}
