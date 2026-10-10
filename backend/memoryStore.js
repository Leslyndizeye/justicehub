import { createClient } from '@supabase/supabase-js';
import { isDeepStrictEqual } from 'node:util';
import { normalizeMemory, sensitiveMemory } from '../shared/userMemory.js';

const bad = () => Object.assign(new Error('Invalid saved-memory request'), { status: 400, code: 'invalid_memory' });
const conflict = () => Object.assign(new Error('Memory changed on another device. Reload it before saving.'), { status: 409, code: 'memory_conflict' });
export function validateMemoryWrite(body) {
  if (!body || Object.keys(body).some(key => !['memory', 'expectedRevision'].includes(key)) || !Number.isSafeInteger(body.expectedRevision) || body.expectedRevision < 0 || body.expectedRevision >= Number.MAX_SAFE_INTEGER) throw bad();
  const value = body.memory;
  if (!value || value.version !== 1 || !Array.isArray(value.items) || value.items.length > 17 || JSON.stringify(value).length > 10000 || Buffer.byteLength(JSON.stringify(value), 'utf8') > 12000) throw bad();
  for (const key of ['enabled', 'useProfileName', 'recoverPreviousName', 'autoSave']) if (typeof value[key] !== 'boolean') throw bad();
  if (!Array.isArray(value.ignoredCategories)) throw bad();
  for (const item of value.items) {
    if (typeof item?.id !== 'string' || !item.id || item.id.length > 80 || typeof item.value !== 'string' || !item.value.trim()
      || item.value.length > (item.kind === 'name' ? 80 : 240) || sensitiveMemory(item.value)) throw bad();
  }
  const normalized = normalizeMemory(value);
  if (!isDeepStrictEqual(normalized, value) || new Set(value.items.map(item => item.id)).size !== value.items.length) throw bad();
  return { memory: normalized, expectedRevision: body.expectedRevision };
}

function storageFailure(error) {
  if (error?.code === '23505') return conflict();
  return Object.assign(new Error(['42P01', 'PGRST205'].includes(error?.code) ? 'Database memory table is not configured.' : 'Database memory is temporarily unavailable.'), {
    status: 503, code: ['42P01', 'PGRST205'].includes(error?.code) ? 'memory_schema_missing' : 'memory_unavailable',
  });
}

export function createMemoryStore(client, now = () => new Date().toISOString()) {
  const ready = () => { if (!client) throw Object.assign(new Error('Database memory setup is incomplete.'), { status: 503, code: 'memory_unconfigured' }); };
  const document = row => ({ memory: row ? normalizeMemory(row.memory) : null, revision: row?.revision || 0, updatedAt: row?.updated_at || null });
  return {
    async read(uid) {
      ready();
      const { data, error } = await client.from('user_memories').select('memory,revision,updated_at').eq('owner_id', uid).maybeSingle();
      if (error) throw storageFailure(error);
      return document(data);
    },
    async write(uid, input) {
      ready();
      const { memory, expectedRevision } = validateMemoryWrite(input);
      const record = { memory, revision: expectedRevision + 1, updated_at: now() };
      const query = expectedRevision === 0
        ? client.from('user_memories').insert({ ...record, owner_id: uid })
        : client.from('user_memories').update(record).eq('owner_id', uid).eq('revision', expectedRevision);
      const { data, error } = await query.select('memory,revision,updated_at').maybeSingle();
      if (error) throw storageFailure(error);
      if (!data) throw conflict();
      return document(data);
    },
  };
}

export function configuredMemoryStore(env = process.env) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  // Never change the existing public-data client to use this privileged key.
  return createMemoryStore(key ? createClient(env.SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false }, global: {
    fetch: (url, options = {}) => fetch(url, { ...options, signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(8000)]) : AbortSignal.timeout(8000) }),
  } }) : null);
}
