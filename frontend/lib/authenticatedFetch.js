export function createAuthenticatedFetch({ getUser, fetchImpl = fetch }) {
  return async function authenticatedFetch(input, options = {}) {
    const user = getUser();
    if (!user) throw new Error('Sign in before using JusticeHub.');
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
    // A failed write is never automatically replayed.
    return fetchImpl(input, { ...options, headers });
  };
}
