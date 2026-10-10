import { normalizeMemory } from './userMemory.js';

export function createAccountMemory({ base = '', getToken, fetchImpl = fetch }) {
  async function request(method, body, signal) {
    const token = await getToken(false);
    const send = token => fetchImpl(`${base}/api/memory`, { method, cache: 'no-store', signal,
      headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    let response = await send(token);
    // Only a rejected identity can be refreshed/replayed. Never replay an
    // ambiguous failed PUT; it may already have committed in the database.
    if (response.status === 401) { await response.body?.cancel(); response = await send(await getToken(true)); }
    const value = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(value.error || 'Account memory could not be synchronized.'), { status: response.status, code: value.code });
    if (!Number.isSafeInteger(value.revision) || value.revision < 0 || value.memory != null && (!Array.isArray(value.memory.items) || value.memory.version !== 1)) throw new Error('Invalid account memory response.');
    return { memory: value.memory == null ? null : normalizeMemory(value.memory), revision: value.revision, updatedAt: value.updatedAt || null };
  }
  return {
    read: signal => request('GET', null, signal),
    write: (memory, revision, signal) => request('PUT', { memory: normalizeMemory(memory), expectedRevision: revision }, signal),
  };
}

// A cleared cloud record must defeat an old browser cache. Migrate browser
// details only when this owner has no cloud document (revision zero).
export function initialAccountMemory(remote, local) {
  return remote.revision === 0 ? normalizeMemory(local) : normalizeMemory(remote.memory);
}
