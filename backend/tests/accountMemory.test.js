import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { generateKeyPair, SignJWT } from 'jose';
import { createFirebaseIdentity } from '../firebaseIdentity.js';
import { createMemoryStore, validateMemoryWrite, configuredMemoryStore } from '../memoryStore.js';
import { memoryRouter } from '../memoryRoutes.js';
import { normalizeMemory, captureMemory } from '../../shared/userMemory.js';

const projectId = 'test-project';
const issuer = `https://securetoken.google.com/${projectId}`;
const time = Date.UTC(2026, 9, 9);
const seconds = time / 1000;
const pair = await generateKeyPair('RS256');
const secondPair = await generateKeyPair('RS256');
const sign = (payload = {}, key = pair.privateKey, header = {}) => new SignJWT({ auth_time: seconds - 30, ...payload })
  .setProtectedHeader({ alg: 'RS256', kid: 'known-key', ...header }).setIssuer(payload.iss || issuer).setAudience(payload.aud || projectId)
  .setSubject(payload.sub ?? 'owner-a').setIssuedAt(payload.iat ?? seconds - 10).setExpirationTime(payload.exp ?? seconds + 100).sign(key);
function verifier() {
  let calls = 0;
  const verify = createFirebaseIdentity({ projectId, now: () => time, importCertificate: async () => pair.publicKey, fetchImpl: async () => {
    calls++;
    return new Response(JSON.stringify({ 'known-key': '-----BEGIN CERTIFICATE-----test fixture' }), { headers: { 'cache-control': 'max-age=3600' } });
  } });
  return { verify, calls: () => calls };
}

test('Firebase identity checks signatures, exact issuer/project, dates and subject rather than trusting decoded UID', async () => {
  const { verify, calls } = verifier();
  assert.deepEqual(await verify(await sign()), { uid: 'owner-a' });
  for (const payload of [{ aud: 'another-project' }, { iss: 'https://attacker.example' }, { sub: '' }, { exp: seconds - 1 }, { iat: seconds + 60 }, { auth_time: seconds + 60 }, { auth_time: 'bad' }, { user_id: 'owner-b' }]) {
    await assert.rejects(verify(await sign(payload)), { status: 401 });
  }
  await assert.rejects(verify(await sign({}, secondPair.privateKey)), { status: 401 });
  await assert.rejects(verify(await sign({}, pair.privateKey, { kid: 'unknown-key' })), { status: 401 });
  await assert.rejects(verify('not-a-token'), { status: 401 });
  assert.equal(calls(), 1, 'Valid certificates are cached and unknown kids cannot hammer the endpoint');
});

test('certificate-service outages fail closed and do not accept unverified tokens', async () => {
  const verify = createFirebaseIdentity({ projectId, fetchImpl: async () => { throw new Error('Network failed'); } });
  await assert.rejects(verify(await sign()), { status: 503, code: 'identity_unavailable' });
});

function fakeDatabase() {
  const rows = new Map();
  const client = { from(table) {
    assert.equal(table, 'user_memories');
    const filters = {};
    let operation = 'read';
    let value;
    const query = {
      select() { return query; }, eq(key, entry) { filters[key] = entry; return query; },
      insert(entry) { operation = 'insert'; value = entry; return query; },
      update(entry) { operation = 'update'; value = entry; return query; },
      async maybeSingle() {
        const uid = operation === 'insert' ? value.owner_id : filters.owner_id;
        const old = rows.get(uid);
        if (operation === 'insert') {
          if (old) return { error: { code: '23505' } };
          rows.set(uid, structuredClone(value));
        } else if (operation === 'update') {
          if (!old || old.revision !== filters.revision) return { data: null };
          rows.set(uid, { ...old, ...structuredClone(value) });
        }
        return { data: rows.get(uid) ? structuredClone(rows.get(uid)) : null };
      },
    };
    return query;
  } };
  return { rows, client };
}

test('stored memory persists independently of chat sessions and stale writes cannot undo a clear or correction', async () => {
  const { client } = fakeDatabase();
  const store = createMemoryStore(client);
  const name = captureMemory(null, 'Nitwa Aniela', () => 'name');
  assert.equal((await store.read('owner-a')).revision, 0);
  await store.write('owner-a', { memory: name, expectedRevision: 0 });
  assert.equal((await createMemoryStore(client).read('owner-a')).memory.items[0].value, 'Aniela');
  assert.equal((await store.read('owner-b')).memory, null);
  const cleared = captureMemory(name, 'Forget everything about me.');
  await store.write('owner-a', { memory: cleared, expectedRevision: 1 });
  await assert.rejects(store.write('owner-a', { memory: name, expectedRevision: 1 }), { status: 409 });
  await assert.rejects(store.write('owner-a', { memory: name, expectedRevision: 0 }), { status: 409 });
  assert.equal((await store.read('owner-a')).memory.items.length, 0);
});

test('API validates bounded memory, credentials, IDs and metadata independently of the browser', () => {
  const memory = normalizeMemory(null);
  assert.deepEqual(validateMemoryWrite({ memory, expectedRevision: 0 }).memory, memory);
  for (const body of [
    { memory, expectedRevision: 0, owner_id: 'someone-else' }, { memory, expectedRevision: -1 },
    { memory: { ...memory, autoSave: 'true' }, expectedRevision: 0 },
    { memory: { ...memory, items: [{ id: 'secret', kind: 'note', value: 'tvly-test-key-123456789012345', category: 'note', origin: 'manual' }] }, expectedRevision: 0 },
    { memory: { ...memory, items: [{ id: 'name', kind: 'name', value: 'nde', category: 'name', origin: 'automatic' }] }, expectedRevision: 0 },
    { memory: { ...memory, items: Array.from({ length: 17 }, (_, i) => ({ id: `note-${i}`, kind: 'note', value: `Useful detail ${i}`, category: 'note', origin: 'manual' })) }, expectedRevision: 0 },
  ]) assert.throws(() => validateMemoryWrite(body), { status: 400 });
});

test('the HTTP memory API refuses forged ownership and isolates two verified accounts', async t => {
  const { client } = fakeDatabase();
  const { verify } = verifier();
  const app = express();
  app.use(express.json());
  app.use('/api/memory', memoryRouter({ verify, store: createMemoryStore(client) }));
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  t.after(() => { server.closeAllConnections(); server.close(); });
  const url = `http://127.0.0.1:${server.address().port}/api/memory`;
  const ownerA = await sign({ sub: 'owner-a' });
  const ownerB = await sign({ sub: 'owner-b' });
  const memory = captureMemory(null, 'My name is Aniela', () => 'name');
  const headers = { Authorization: `Bearer ${ownerA}`, 'Content-Type': 'application/json' };
  assert.equal((await fetch(url)).status, 401);
  assert.equal((await fetch(url, { headers: { Authorization: `Bearer ${await sign({}, secondPair.privateKey)}` } })).status, 401);
  const write = await fetch(url, { method: 'PUT', headers, body: JSON.stringify({ memory, expectedRevision: 0 }) });
  assert.equal(write.status, 200);
  const wrongOwner = await fetch(url, { method: 'PUT', headers, body: JSON.stringify({ memory, expectedRevision: 1, owner_id: 'owner-b' }) });
  assert.equal(wrongOwner.status, 400);
  const other = await fetch(`${url}?owner_id=owner-a`, { headers: { Authorization: `Bearer ${ownerB}` } });
  assert.equal((await other.json()).memory, null);
  const own = await fetch(url, { headers });
  assert.equal((await own.json()).memory.items[0].value, 'Aniela');
  assert.match(own.headers.get('cache-control'), /no-store/);
});

test('missing privileged storage configuration cannot fall back to the anonymous database key', async () => {
  const store = configuredMemoryStore({ SUPABASE_ANON_KEY: 'public-key' });
  await assert.rejects(store.read('owner-a'), { status: 503, code: 'memory_unconfigured' });
});

test('automatic background facts persist for the verified owner, including corrected and forgotten details', async () => {
  const { client } = fakeDatabase();
  const store = createMemoryStore(client);
  const memory = captureMemory(null, 'I live in Kigali. I speak English. I prefer short answers in Kinyarwanda. I need free tools. My laptop runs Windows.');
  await store.write('owner-a', { memory, expectedRevision: 0 });
  const next = captureMemory((await createMemoryStore(client).read('owner-a')).memory, 'Actually, I live in Huye. Forget my language.');
  await store.write('owner-a', { memory: next, expectedRevision: 1 });
  const reloaded = await createMemoryStore(client).read('owner-a');
  assert.equal(reloaded.memory.items.find(item => item.category === 'location').value, 'I live in Huye.');
  assert.equal(reloaded.memory.items.some(item => item.category.startsWith('language')), false);
  assert.equal(reloaded.memory.items.find(item => item.category === 'response_style').value, 'I prefer short answers.');
  assert.equal(reloaded.memory.items.find(item => item.category === 'budget').value, 'I need free tools.');
  assert.equal((await store.read('owner-b')).memory, null);
});
