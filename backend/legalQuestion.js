import { matchedLegalVocabulary, vocabularyContext } from './legalVocabulary.js';
import { isCorrectionRequest } from './chatCorrection.js';
const punishment = /\b(?:ahanishw\w*|bahanishw\w*|bamuhanis\w*|igihano|ibihano|gihan\w*|punish\w*|penalt\w*|sentenc\w*|peine\w*)\b/i;
const otherTopic = /\b(?:imisoro|umusoro|tax\w*|ubwicanyi|murder|kill\w*|rape|fraud|uburiganya|akazi|employment|land|ubutaka)\b/i;

/** Topic keywords for the English corpus, not a translation or a finding of guilt. */
export function interpretLegalQuestion(message, history = []) {
  let matches = isCorrectionRequest(message) ? vocabularyContext(message, history) : matchedLegalVocabulary(message);
  if (!matches.length && punishment.test(message) && message.length < 120 && !otherTopic.test(message)) {
    for (const item of [...history].reverse()) {
      if (item.sender !== 'user' || typeof item.content !== 'string') continue;
      const earlier = matchedLegalVocabulary(item.content);
      if (earlier.length) { matches = earlier; break; }
      if (otherTopic.test(item.content)) break;
    }
  }
  const topics = [...new Set(matches.map(entry => entry.topic))];
  const topic = topics.length === 1 ? topics[0] : null;
  // Requests for mitigation, wrongdoing, or the case process keep their own purpose.
  const differentAction = /\b(?:reduce|avoid|evade|get away|lenien\w*|mitigat\w*|bail|arrest|report|gufatwa|gutanga ikirego|kugabanya|kwirinda|kwepa)\b|how (?:to|can i|do i) (?:steal|rob)|n(?:a|i)kwiba/i.test(message);
  const penaltyQuestion = topic === 'theft' && punishment.test(message) && !differentAction;
  return { topic, topics, penaltyQuestion, retrievalQuery: matches.length ? [...new Set(matches.map(entry => entry.query))].join(' OR ') : message };
}

export function legalQuestionInstruction(interpretation) {
  if (!interpretation.penaltyQuestion) return '';
  return `CURRENT QUESTION: The user asks what punishment can follow a court conviction for theft in Rwanda. "Umuntu wibye ahanishwa iki?", "bamuhanisha icyi?", and the short follow-up "ahanishwa iki?" are penalty questions, not requests for the arrest/court process or where to report a crime. Answer the applicable baseline penalty from the supplied source FIRST, including the statute's alternatives and conviction condition; cite the source and distinguish its date from verified current law. Then briefly mention that aggravated circumstances or a different charge can change the penalty. Do not ask what they mean by punishment or offer a menu of laws/reporting/courts. Do not replace the requested penalty with a table of arrest, detention, bail, and trial. If a current amendment or case-specific outcome cannot be verified, say that narrowly without discarding the documented baseline. Use two or three short paragraphs unless the user explicitly asks for a table or more detail.`;
}
