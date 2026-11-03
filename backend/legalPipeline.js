import { questionRoute } from './questionRouting.js';
import { questionTask } from './legalFlow.js';

export function buildLegalAnswerPipeline({ message, history = [], routing, replyLanguage = 'en' } = {}) {
  const route = routing || questionRoute(message, history);
  const task = route?.answerTask || questionTask(message || '');
  const legalIntent = route?.kind === 'legal' || route?.kind === 'unclear' || route?.kind === 'social' ? route.kind : 'unknown';
  const isCurrentVerification = task === 'current_verification' || !!route?.forceWeb;
  const needsEvidence = ['penalty', 'rule', 'deadline', 'amount', 'procedure', 'eligibility', 'remedy', 'comparison', 'application', 'source', 'current_verification'].includes(task);

  return {
    task,
    routeKind: legalIntent,
    needsEvidence,
    mustCiteSources: needsEvidence,
    needsCurrentVerification: isCurrentVerification,
    replyLanguage,
    outputContract: {
      answerInPlainLanguage: true,
      legalRuleFirst: ['penalty', 'rule', 'deadline', 'amount', 'procedure', 'eligibility', 'remedy', 'comparison', 'application', 'source'].includes(task),
      mentionUncertainty: isCurrentVerification,
      citePrimarySources: needsEvidence,
      refuseUnsupportedClaims: true,
    },
    steps: [
      'classify the user intent and legal task',
      'identify the statute, article, or legal issue involved',
      'ground the answer in document excerpts or official sources',
      'state the rule, conditions, and exceptions plainly',
      'flag uncertainty or missing facts instead of guessing',
    ],
  };
}

export function legalAnswerContract({ answer = '', sources = [], task = 'rule' } = {}) {
  const text = String(answer || '').trim();
  const legalSources = Array.isArray(sources) ? sources : [];
  const hasCitations = /\[[^\]]+\]\([^\)]+\)|https?:\/\//i.test(text) || legalSources.length > 0;
  const taskNeedsEvidence = ['penalty', 'rule', 'deadline', 'amount', 'procedure', 'eligibility', 'remedy', 'comparison', 'application', 'source', 'current_verification'].includes(task);

  return {
    task,
    hasText: text.length > 0,
    hasSourceEvidence: hasCitations,
    isCompliant: !taskNeedsEvidence || (text.length > 0 && (!taskNeedsEvidence || hasCitations)),
    warnings: !taskNeedsEvidence
      ? []
      : !hasCitations
        ? ['Answer is missing source grounding for a legal task. Cite the relevant statute, article, or official source.']
        : [],
  };
}
