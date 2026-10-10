import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAccountMemory, initialAccountMemory } from '../lib/accountMemory.js';
import { normalizeMemory, captureMemory, localMemoryReply, nameRecallRequest, addMemoryNote } from '../lib/userMemory.js';

const response = value => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });

test('account requests use the current sign-in token and never a caller-provided owner or model endpoint', async () => {
  const calls = [];
  const saved = captureMemory(null, 'Nitwa Aniela', () => 'name-1');
  const api = createAccountMemory({ getToken: async () => 'test-identity', fetchImpl: async (url, options) => {
    calls.push({ url, options });
    return response({ memory: saved, revision: 1 });
  } });
  assert.equal((await api.read()).memory.items[0].value, 'Aniela');
  await api.write(saved, 1);
  assert.deepEqual(calls.map(call => call.url), ['/api/memory', '/api/memory']);
  assert.equal(calls[1].options.headers.Authorization, 'Bearer test-identity');
  assert.deepEqual(Object.keys(JSON.parse(calls[1].options.body)), ['memory', 'expectedRevision']);
  assert.equal(calls[0].options.cache, 'no-store');
});

test('a rejected identity is refreshed once but ambiguous database writes and conflicts are never replayed', async () => {
  const tokens = [];
  let calls = 0;
  const api = createAccountMemory({ getToken: async force => { tokens.push(force); return force ? 'new-token' : 'old-token'; }, fetchImpl: async () => {
    calls++;
    return calls === 1 ? new Response('{}', { status: 401 }) : response({ memory: null, revision: 0 });
  } });
  await api.read();
  assert.deepEqual(tokens, [false, true]);
  for (const failure of ['network', 'conflict']) {
    let attempts = 0;
    const broken = createAccountMemory({ getToken: async () => 'token', fetchImpl: async () => {
      attempts++;
      if (failure === 'network') throw new TypeError('Network unavailable');
      return new Response(JSON.stringify({ code: 'memory_conflict', error: 'Reload account memory.' }), { status: 409 });
    } });
    await assert.rejects(broken.write(normalizeMemory(null), 2));
    assert.equal(attempts, 1);
  }
});

test('cloud clears and corrections defeat stale browser names, and local migration only happens for a new owner document', () => {
  const old = captureMemory(null, 'My name is Aniela', () => 'old');
  assert.equal(initialAccountMemory({ memory: null, revision: 0 }, old).items[0].value, 'Aniela');
  const cleared = captureMemory(old, 'Forget everything about me.');
  const restored = initialAccountMemory({ memory: cleared, revision: 3 }, old);
  assert.equal(restored.items.length, 0);
  assert.equal(restored.recoverPreviousName, false);
  assert.equal(restored.useProfileName, false);
  assert.equal(restored.autoSave, false);
});

test('the screenshot name question recalls a real saved name and never saves nde as a name', () => {
  const memory = captureMemory(null, 'Nitwa Aniela', () => 'name');
  for (const text of ['ese nitwa nde', 'nitwa nde?', 'ese izina ryanjye ni irihe?']) {
    assert.ok(nameRecallRequest(text));
    assert.match(localMemoryReply(text, memory, '', true, [], 'checked', 'account').reply, /Aniela/);
    assert.deepEqual(captureMemory(memory, text), memory);
  }
  assert.equal(captureMemory(null, 'nitwa nde?').items.length, 0);
  assert.match(localMemoryReply('Nitwa Aniela', memory, '', true, [], 'checked', 'account').reply, /konti yawe/);
  assert.doesNotMatch(localMemoryReply('My name is Aniela', memory, '', true, [], 'checked', 'account').reply, /this browser/);
});

test('important memories are retained at capacity and exposed credentials are excluded from migration', () => {
  let memory = normalizeMemory(null);
  for (let i = 0; i < 16; i++) memory = addMemoryNote(memory, `Useful note ${i}`, () => `note-${i}`);
  assert.deepEqual(addMemoryNote(memory, 'New note that would evict an old one', () => 'extra'), memory);
  for (const key of ['tvly-test-key-123456789012345', 'sb_secret_testkey123456789012345', 'gsk_testkey123456789012345']) {
    assert.equal(addMemoryNote(null, key).items.length, 0);
    assert.equal(normalizeMemory({ items: [{ id: 'bad', kind: 'note', value: key }] }).items.length, 0);
  }
});
