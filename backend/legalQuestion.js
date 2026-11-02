import { matchedLegalVocabulary, vocabularyContext } from './legalVocabulary.js';
import { isCorrectionRequest } from './chatCorrection.js';
const punishment = /\b(?:ahanishw\w*|bahanishw\w*|bamuhanis\w*|igihano|ibihano|gihan\w*|punish\w*|penalt\w*|sentenc\w*|peine\w*)\b/i;
const otherTopic = /\b(?:imisoro|umusoro|tax\w*|ubwicanyi|murder|kill\w*|rape|fraud|uburiganya|akazi|employment|land|ubutaka)\b/i;
export const asksPenalty = message => punishment.test(String(message)) || /\b(?:prison|jail|imprisonment|igifungo|ihazabu)\b/i.test(String(message));
const penaltyFollowupWords = new Set('what someone somebody person a an the can could may be is are get gets punished punish punishment penalty penalties sentence sentenced sentencing prison jail imprisonment many years year months month term by with for to he she they him her them it that this and so then how much long would will should in rwanda please u you tell me'.split(' '));
export function isPenaltyFollowup(message) {
  if (!asksPenalty(message) || String(message).length > 180) return false;
  if (/^(?:ahanishwa|bamuhanisha|bahanishwa|ahanishwaki|bamuhanisha icyi)\s*(?:iki|icyi)?[\s?!.,]*$/i.test(message)) return true;
  const words = String(message).toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  return words.length > 0 && words.every(word => penaltyFollowupWords.has(word));
}

/** Topic keywords for the English corpus, not a translation or a finding of guilt. */
export function interpretLegalQuestion(message, history = []) {
  let matches = isCorrectionRequest(message) ? vocabularyContext(message, history) : matchedLegalVocabulary(message);
  if (!matches.length && asksPenalty(message) && message.length < 120 && !otherTopic.test(message)) {
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
  return { topic, topics, penaltyQuestion, penaltyRequested: asksPenalty(message) && !differentAction, retrievalQuery: matches.length ? [...new Set(matches.map(entry => entry.query))].join(' OR ') : message };
}

export function legalQuestionInstruction(interpretation) {
  if (interpretation.topic === 'fraud' && interpretation.penaltyRequested) return 'CURRENT QUESTION: Answer the baseline punishment following a conviction for ordinary fraud from the supplied Article 174 text. Preserve both the prison term AND the fine and their units. Do not substitute case-review procedure or a general discussion of honesty. Do not volunteer the separate shares/securities paragraph unless the user actually asks about that conduct; if relevant, retain its intent, business context and strict more-than fine threshold. This is the dated published text, not a verified current sentence or a finding of guilt.';
  if (interpretation.topic === 'murder' && interpretation.penaltyRequested) return 'CURRENT QUESTION: This punishment question refers to the preceding USER topic about one person killing another. Answer the source-supported homicide question, not grounds for reviewing a case or a general court-process overview. Do not assume intent or guilt. Explain Article 107 conditionally for intentional killing and distinguish Article 111 for negligent killing without intent, when supplied. An accident alone does not prove negligence. Keep conviction conditions and statutory alternatives. Limit the answer to the dated supplied text, without claiming current verification or a sentence for a particular person. Do not repeat the ethical orientation instead of answering the punishment question.';
  if (!interpretation.penaltyQuestion) return '';
  return `CURRENT QUESTION: The user asks what punishment can follow a court conviction for theft in Rwanda. "Umuntu wibye ahanishwa iki?", "bamuhanisha icyi?", and the short follow-up "ahanishwa iki?" are penalty questions, not requests for the arrest/court process or where to report a crime. Answer the applicable baseline penalty from the supplied source FIRST, including the statute's alternatives and conviction condition; cite the source and distinguish its date from verified current law. Then briefly mention that aggravated circumstances or a different charge can change the penalty. Do not ask what they mean by punishment or offer a menu of laws/reporting/courts. Do not replace the requested penalty with a table of arrest, detention, bail, and trial. If a current amendment or case-specific outcome cannot be verified, say that narrowly without discarding the documented baseline. Use two or three short paragraphs unless the user explicitly asks for a table or more detail.`;
}
