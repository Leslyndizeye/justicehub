import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAuthenticatedFetch } from '../lib/authenticatedFetch.js';

test('chat and admin calls attach the current identity without losing streaming signals or JSON headers', async () => {
  const calls = [];
  const request = createAuthenticatedFetch({ getUser: () => ({ getIdToken: async () => 'verified-user-token' }), fetchImpl: async (...args) => { calls.push(args); return new Response('{}'); } });
  const signal = new AbortController().signal;
  await request('/api/chat', { method: 'POST', signal, headers: { 'Content-Type': 'application/json' }, body: '{"message":"hello"}' });
  assert.equal(calls[0][1].headers.get('Authorization'), 'Bearer verified-user-token');
  assert.equal(calls[0][1].headers.get('Content-Type'), 'application/json');
  assert.equal(calls[0][1].signal, signal);
  assert.equal(calls[0][1].body, '{"message":"hello"}');
});

test('signed-out requests never reach the API and failed writes are not replayed', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; throw new TypeError('Connection lost'); };
  const signedOut = createAuthenticatedFetch({ getUser: () => null, fetchImpl });
  await assert.rejects(signedOut('/api/admin/stats'), /Sign in/);
  assert.equal(calls, 0);
  const signedIn = createAuthenticatedFetch({ getUser: () => ({ getIdToken: async () => 'token' }), fetchImpl });
  await assert.rejects(signedIn('/api/sessions/id', { method: 'DELETE' }), /Connection lost/);
  assert.equal(calls, 1);
});
