import { interpretCasualMessage } from '../../shared/chatCasual.js';
import { everydayQuestionRoute, orientationRoute } from '../../shared/everydayQuestions.js';

const modelFreeMessage = message => interpretCasualMessage(message)?.standalone === true || orientationRoute(everydayQuestionRoute(message));

/** Greetings/acknowledgements use the backend's shared rules and no model tokens. */
export function chatRequestAllowed(message, cooldown, time = Date.now()) {
  return !(cooldown?.until > time) || modelFreeMessage(message);
}

/** A successful canned reply does not establish that the provider quota recovered. */
export function cooldownAfterReply(message, cooldown) {
  return modelFreeMessage(message) ? cooldown : null;
}

/** Keep provider retry metadata when a streamed or JSON response fails. */
export function chatReplyError(payload, fallback = 'The reply could not be completed.') {
  const seconds = Number(payload?.retryAfterSeconds);
  return Object.assign(new Error(typeof payload?.error === 'string' ? payload.error : fallback), {
    status: Number(payload?.status) || undefined,
    code: payload?.code === 'account_access_unavailable' ? payload.code : undefined,
    retryAfterSeconds: Number.isFinite(seconds) && seconds > 0 ? seconds : undefined,
  });
}

export function rateLimitDeadline(error, time = Date.now()) {
  return error?.status === 429 && Number.isFinite(error.retryAfterSeconds) && error.retryAfterSeconds > 0
    ? time + error.retryAfterSeconds * 1000 : 0;
}

/** Display actionable text rather than raw network or provider exceptions. */
export function chatFailureNotice(error, language = 'en') {
  if (error?.status === 429 && error?.retryAfterSeconds > 0) return rateLimitNotice(error.retryAfterSeconds, language);
  if (error?.status === 503 && error.code === 'account_access_unavailable') return ({
    en: 'Your account could not be checked right now. Please try again in a moment.',
    rw: 'Konti yawe ntiyashoboye kugenzurwa ubu. Ongera ugerageze mu kanya.',
    fr: 'Votre compte n’a pas pu être vérifié pour le moment. Réessayez dans un instant.',
  })[language] || 'Your account could not be checked right now. Please try again in a moment.';
  if(error?.status===413)return ({en:'This request is too large to answer at once. Try a shorter question or a new conversation.',rw:'Iki kibazo ni kirekire cyane ngo gisubizwe icyarimwe. Gerageza ikibazo kigufi cyangwa utangire ikiganiro gishya.',fr:'Cette demande est trop longue pour une seule réponse. Essayez une question plus courte ou une nouvelle conversation.'})[language] || 'Try a shorter question or a new conversation.';
  const signIn = error?.status === 401;
  if (language === 'rw') return signIn ? 'Ongera winjire kuri konti yawe, hanyuma wongere ugerageze.' : 'Igisubizo nticyarangiye. Ongera ugerageze mu kanya.';
  if (language === 'fr') return signIn ? 'Reconnectez-vous à votre compte, puis réessayez.' : 'La réponse n’a pas pu être terminée. Réessayez dans un moment.';
  return signIn ? 'Please sign in again, then retry your message.' : 'We couldn’t finish the reply. Please try again in a moment.';
}

export function rateLimitNotice(seconds, language = 'en') {
  const wait = Math.max(0, Math.ceil(seconds));
  const duration = wait >= 60 ? `${Math.floor(wait / 60)}:${String(wait % 60).padStart(2, '0')}` : String(wait);
  if (language === 'rw') return wait
    ? `AI yageze ku rugero ntarengwa. Tegereza nibura ${duration}${wait < 60 ? ' s' : ''} mbere yo kongera kugerageza. Memory iracyakora.`
    : 'Igihe cyo gutegereza kirarangiye. Ushobora kongera kugerageza; serivisi ishobora kuba igifite imipaka. Memory iracyakora.';
  if (language === 'fr') return wait
    ? `Limite d’utilisation de l’IA atteinte. Attendez au moins ${duration}${wait < 60 ? ' s' : ''} avant de réessayer. La mémoire reste disponible.`
    : 'Le délai est écoulé. Vous pouvez réessayer ; les limites du service peuvent encore s’appliquer. La mémoire reste disponible.';
  return wait
    ? `AI usage limit reached. Wait at least ${duration}${wait < 60 ? ' s' : ''} before retrying. Saved memory still works.`
    : 'The wait time has passed. You can try again; the service may still be limited. Saved memory still works.';
}
