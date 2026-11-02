import { interpretCasualMessage } from '../../shared/chatCasual.js';
import { everydayQuestionRoute, orientationRoute } from '../../shared/everydayQuestions.js';

const modelFreeMessage = message => interpretCasualMessage(message)?.standalone === true || orientationRoute(everydayQuestionRoute(message));
const publicCodes = new Set(['account_access_unavailable', 'conversation_unavailable', 'message_not_saved', 'reply_not_saved']);

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
    code: publicCodes.has(payload?.code) ? payload.code : undefined,
    retryAfterSeconds: Number.isFinite(seconds) && seconds > 0 ? seconds : undefined,
  });
}

export function rateLimitDeadline(error, time = Date.now()) {
  return error?.status === 429 && Number.isFinite(error.retryAfterSeconds) && error.retryAfterSeconds > 0
    ? time + error.retryAfterSeconds * 1000 : 0;
}

/** Display actionable text rather than raw network or provider exceptions. */
export function chatFailureNotice(error, language = 'en') {
  if (error?.status === 429) return ({
    en:'The reply could not be generated because the chat usage limit was reached. Check the retry notice below.',
    rw:'Igisubizo nticyatanzwe kuko chat yageze ku rugero ntarengwa. Reba ubutumwa bwo kongera kugerageza hepfo.',
    fr:'La réponse n’a pas pu être générée car la limite d’utilisation du chat a été atteinte. Consultez le délai de nouvel essai ci-dessous.',
  })[language] || 'The chat usage limit was reached. Check the retry notice below.';
  const storageNotices = {
    conversation_unavailable: { en: 'Your conversation could not be opened right now. Please try again shortly.', rw: 'Ikiganiro cyawe nticyashoboye gufungurwa ubu. Ongera ugerageze mu kanya.', fr: 'Votre conversation n’a pas pu être ouverte. Réessayez dans un instant.' },
    message_not_saved: { en: 'Your message could not be saved. Please try again shortly.', rw: 'Ubutumwa bwawe ntibwashoboye kubikwa. Ongera ugerageze mu kanya.', fr: 'Votre message n’a pas pu être enregistré. Réessayez dans un instant.' },
    reply_not_saved: { en: 'Your answer could not be saved. Copy it before leaving this conversation.', rw: 'Igisubizo nticyashoboye kubikwa. Gikoporore mbere yo kuva muri iki kiganiro.', fr: 'Votre réponse n’a pas pu être enregistrée. Copiez-la avant de quitter cette conversation.' },
  };
  if (error?.status === 503 && Object.hasOwn(storageNotices, error.code)) return storageNotices[error.code][language] || storageNotices[error.code].en;
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
    ? `AI yageze ku rugero ntarengwa. Tegereza nibura ${duration}${wait < 60 ? ' s' : ''} mbere yo kongera kugerageza.`
    : 'Ushobora kongera kugerageza; serivisi ishobora kuba igifite imipaka.';
  if (language === 'fr') return wait
    ? `Limite d’utilisation de l’IA atteinte. Attendez au moins ${duration}${wait < 60 ? ' s' : ''} avant de réessayer.`
    : 'Vous pouvez réessayer. La disponibilité du chat n’a pas encore été vérifiée.';
  return wait
    ? `AI usage limit reached. Wait at least ${duration}${wait < 60 ? ' s' : ''} before retrying.`
    : 'You can retry now. Chat availability has not been checked; the service may still be limited.';
}
