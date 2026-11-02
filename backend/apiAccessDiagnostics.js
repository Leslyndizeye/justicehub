const networkCodes = ['ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET'];
const stages = new Set(['profile', 'session_ownership', 'request']);

// PostgREST can return fetch failures as strings in `details`, rather than
// preserving Error.cause. Inspect them, but never log raw messages or bodies:
// they can contain database URLs, credentials, or account identifiers.
export function apiAccessDiagnostic(error, stage) {
  const parts = [];
  let causeCode;
  let timedOut = false;
  for (let item = error, depth = 0; item && depth < 4; item = item.cause, depth++) {
    if (networkCodes.includes(item.code)) causeCode ||= item.code;
    timedOut ||= ['TimeoutError', 'AbortError'].includes(item.name);
    for (const field of ['message', 'details']) {
      if (typeof item[field] === 'string') parts.push(item[field].slice(0, 16000));
    }
  }
  const text = parts.join('\n');
  causeCode ||= networkCodes.find(code => new RegExp(`\\b${code}\\b`).test(text));
  const code = /^(?:[A-Z0-9]{5}|PGRST\d{3})$/.test(error?.code || '') ? error.code : undefined;
  let reason = 'account_lookup_failed';
  if (causeCode === 'ENOTFOUND') reason = 'database_dns_failed';
  else if (timedOut || ['ETIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT'].includes(causeCode) || /\b(?:TimeoutError|AbortError)\b/.test(text)) reason = 'database_timeout';
  else if (causeCode || /fetch failed/i.test(text)) reason = 'database_connection_failed';
  else if (code === '42501') reason = 'database_permission_denied';
  else if (['42P01', '42703', 'PGRST204', 'PGRST205'].includes(code)) reason = 'database_schema_missing';
  else if (['PGRST301', 'PGRST302', 'PGRST303'].includes(code) || /invalid api key|invalid jwt|jwt expired/i.test(text)) reason = 'database_credentials';
  return {
    stage: stages.has(stage) ? stage : 'request',
    reason,
    ...(code ? { code } : {}),
    ...(causeCode ? { causeCode } : {}),
  };
}
