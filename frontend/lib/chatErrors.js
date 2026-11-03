import { interpretCasualMessage } from '../../shared/chatCasual.js';
import { everydayQuestionRoute, orientationRoute } from '../../shared/everydayQuestions.js';

const modelFreeMessage = (message,history=[]) => {
  const route=everydayQuestionRoute(message,history);
  return interpretCasualMessage(message)?.standalone===true||orientationRoute(route)||['rwanda_law_overview','theft_comparison'].includes(route?.intent);
};
const publicCodes = new Set(['account_access_unavailable', 'conversation_unavailable', 'message_not_saved', 'reply_not_saved']);

/** Greetings/acknowledgements use the backend's shared rules and no model tokens. */
export function chatRequestAllowed(message, cooldown, time = Date.now(), history = []) {
  return !(cooldown?.until > time) || modelFreeMessage(message,history);
}

/** A successful canned reply does not establish that the provider quota recovered. */
export function cooldownAfterReply(message, cooldown, history = []) {
  return modelFreeMessage(message,history) ? cooldown : null;
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
    en:'We couldn’t finish this reply. Please try again shortly.',
    rw:'Igisubizo nticyarangiye. Ongera ugerageze mu kanya.',
    fr:'La réponse n’a pas pu être terminée. Réessayez dans un moment.',
  })[language] || 'We couldn’t finish this reply. Please try again shortly.';
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
  if(error?.status===413)return ({en:'We couldn’t prepare this reply. Please try again.',rw:'Ntitwashoboye gutegura iki gisubizo. Ongera ugerageze.',fr:'La réponse n’a pas pu être préparée. Réessayez.'})[language] || 'We couldn’t prepare this reply. Please try again.';
  const signIn = error?.status === 401;
  if (language === 'rw') return signIn ? 'Ongera winjire kuri konti yawe, hanyuma wongere ugerageze.' : 'Igisubizo nticyarangiye. Ongera ugerageze mu kanya.';
  if (language === 'fr') return signIn ? 'Reconnectez-vous à votre compte, puis réessayez.' : 'La réponse n’a pas pu être terminée. Réessayez dans un moment.';
  return signIn ? 'Please sign in again, then retry your message.' : 'We couldn’t finish the reply. Please try again in a moment.';
}

export function rateLimitNotice(seconds, language = 'en') {
  if(!(seconds>0))return '';
  return ({en:'Please try again shortly.',rw:'Ongera ugerageze mu kanya.',fr:'Réessayez dans un moment.'})[language]||'Please try again shortly.';
}
