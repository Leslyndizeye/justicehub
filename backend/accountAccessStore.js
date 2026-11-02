import { setTimeout as delay } from 'node:timers/promises';
import { apiAccessDiagnostic } from './apiAccessDiagnostics.js';

const transientReasons = new Set(['database_dns_failed', 'database_connection_failed', 'database_timeout']);

// Retry only these read-only access checks, once. Never cache a role, relax
// authorization, or replay a chat/session write after an ambiguous failure.
export function createAccountAccessStore(client, { wait = ms => delay(ms) } = {}) {
  async function read(query, stage) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const { data, error, status } = await query();
        if (error) throw Object.assign(new Error('Account database lookup failed', { cause: error }), {
          ...(typeof error.code === 'string' ? { code: error.code } : {}), status,
        });
        return data;
      } catch (error) {
        const reason = apiAccessDiagnostic(error, stage).reason;
        const transient = transientReasons.has(reason)
          || reason === 'account_lookup_failed' && [408, 500, 502, 503, 504].includes(error?.status);
        if (attempt || !transient) throw error;
        await wait(300);
      }
    }
  }
  return {
    profile: uid => read(() => client.from('profiles').select('role').eq('id', uid).maybeSingle(), 'profile'),
    ownsSession: async (id, uid) => Boolean(await read(() => client.from('chat_sessions').select('id').eq('id', id).eq('user_id', uid).maybeSingle(), 'session_ownership')),
  };
}
