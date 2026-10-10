import { requestError } from './recoveryState.js';

export const dashboardRoute = '/dashboard/:sessionId?';
export function conversationPath(sessionId) { return sessionId ? `/dashboard/${encodeURIComponent(sessionId)}` : '/dashboard'; }

export function signInDestination(role, returnTo) {
  if (role === 'admin') return '/adminxt';
  return typeof returnTo === 'string' && /^\/dashboard(?:\/[^/?#]+)?$/.test(returnTo) ? returnTo : '/dashboard';
}

function waitForRetry(delay, signal) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, delay);
    function abort() { clearTimeout(timer); reject(signal.reason); }
    signal?.addEventListener('abort', abort, { once: true });
  });
}

export async function fetchOwnSessions(api, uid, signal, fetcher = fetch, wait = waitForRetry) {
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    signal?.throwIfAborted();
    try {
      response = await fetcher(`${api}/api/sessions/${encodeURIComponent(uid)}`, { signal });
      if (![502, 503, 504].includes(response.status) || attempt === 2) break;
      await response.body?.cancel();
    } catch (error) {
      if (signal?.aborted || error?.name === 'AbortError') throw error;
      if (!(error instanceof TypeError)) throw error;
      if (attempt === 2) throw requestError(0, 'connection_unavailable');
    }
    // Only retry this read-only history request, never a chat POST or mutation.
    await wait(attempt === 0 ? 300 : 700, signal);
  }
  if (!response.ok) throw requestError(response.status);
  const records = await response.json();
  if (!Array.isArray(records)) throw new Error('Invalid conversation response.');
  return records.filter(session => session?.user_id === uid && typeof session.id === 'string');
}
