const networkCodes = new Set(['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET']);
const errorTypes = new Set(['Error', 'TypeError', 'ReferenceError', 'SyntaxError', 'AbortError', 'TimeoutError', 'APIError', 'APIConnectionError', 'APIConnectionTimeoutError', 'APIUserAbortError', 'AuthenticationError', 'PermissionDeniedError', 'RateLimitError', 'InternalServerError', 'BadRequestError', 'NotFoundError']);
const knownCodes = new Set(['rate_limit_exceeded', 'model_not_found', 'tool_use_failed', 'context_length_exceeded', 'empty_model_response', 'translation_protected_value_changed', 'translation_empty', 'translation_wrong_language', 'request_timeout', 'provider_connection_failed', 'provider_unavailable']);
const stages = new Set(['create_session', 'load_session', 'load_history', 'save_user', 'legal_retrieval', 'generate', 'answer', 'translation', 'save_reply', 'update_session']);

function errorType(error) {
  const constructor = error?.constructor?.name;
  return constructor && constructor !== 'Object' && constructor !== 'Error' ? constructor : error?.name || 'Error';
}

function connectionCode(error) {
  let item = error;
  for (let depth = 0; depth < 4 && item; depth++, item = item.cause) {
    if (networkCodes.has(item.code)) return item.code;
  }
}

export function providerFailure(error, timedOut = false) {
  const type = errorType(error);
  if (timedOut || ['APIConnectionTimeoutError', 'TimeoutError'].includes(type)) return 'request_timeout';
  if (type === 'APIConnectionError' || connectionCode(error)) return 'provider_connection_failed';
  if ([408, 500, 502, 503, 504].includes(error?.status)) return 'provider_unavailable';
  return null;
}

// Logs must never include provider response bodies, prompts, saved personal
// details, keys, arbitrary error messages, or full filesystem paths.
export function chatErrorDiagnostic(error, stage = 'generate') {
  const type = errorType(error);
  const rawCode = error?.error?.error?.code || error?.error?.code || error?.code;
  const failure = error?.chatFailure || providerFailure(error);
  const phase = error?.chatPhase || stage;
  const frame = typeof error?.stack === 'string' ? error.stack.match(/(?:[\\/])((?:chatProvider|chatTranslation|searchFallback|chatPrompt|externalSearch|server|legalQuestion|chatLanguage)\.js:\d+:\d+)/)?.[1] : undefined;
  return {
    stage: stages.has(phase) ? phase : 'generate',
    status: Number.isInteger(error?.status) ? error.status : 'internal',
    code: knownCodes.has(rawCode) ? rawCode : knownCodes.has(failure) ? failure : /^[A-Z0-9]{5}$/.test(rawCode || '') ? rawCode : 'request_failed',
    type: errorTypes.has(type) ? type : 'Error',
    ...(connectionCode(error) ? { causeCode: connectionCode(error) } : {}),
    ...(frame ? { location: frame } : {}),
  };
}
