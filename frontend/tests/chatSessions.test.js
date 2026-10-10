import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchRoutes } from 'react-router-dom';
import { conversationPath, dashboardRoute, fetchOwnSessions, signInDestination } from '../lib/chatSessions.js';

test('a saved conversation URL resolves to the same session on refresh and browser navigation', () => {
  const routes = [{ path: dashboardRoute }];
  const path = conversationPath('session-123');
  assert.equal(path, '/dashboard/session-123');
  assert.equal(matchRoutes(routes, path)[0].params.sessionId, 'session-123');
  assert.equal(matchRoutes(routes, '/dashboard')[0].params.sessionId, undefined);
  assert.equal(conversationPath(null), '/dashboard');
  assert.equal(matchRoutes(routes, '/dashboard/a/b'), null);
});

test('sign-in returns to the conversation without accepting an external redirect', () => {
  assert.equal(signInDestination('citizen', '/dashboard/session-123'), '/dashboard/session-123');
  assert.equal(signInDestination('admin', '/dashboard/session-123'), '/adminxt');
  for (const path of ['https://external.example', '//external.example', '/adminxt', '/dashboard/../adminxt']) {
    assert.equal(signInDestination('citizen', path), '/dashboard');
  }
});

test('initial history loading only needs the sessions endpoint and filters the signed-in account', async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push(url);
    assert(options.signal);
    return Response.json([{ id: 'mine', user_id: 'alice' }, { id: 'other', user_id: 'bob' }]);
  };
  const sessions = await fetchOwnSessions('http://localhost:4000', 'alice', new AbortController().signal, fetcher);
  assert.deepEqual(sessions, [{ id: 'mine', user_id: 'alice' }]);
  assert.deepEqual(calls, ['http://localhost:4000/api/sessions/alice']);
});

test('history failures surface a retryable error instead of appearing as an empty account', async () => {
  await assert.rejects(fetchOwnSessions('api', 'alice', undefined, async () => new Response('', { status: 503 })), { status: 503 });
  await assert.rejects(fetchOwnSessions('api', 'alice', undefined, async () => Response.json({ error: 'bad' })), /Invalid conversation/);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchOwnSessions('api', 'alice', controller.signal, async (url, { signal }) => signal.throwIfAborted()), { name: 'AbortError' });
});

test('a temporary connection failure recovers the account history without another user action', async () => {
  let calls = 0;
  const pauses = [];
  const sessions = await fetchOwnSessions('', 'alice/a', new AbortController().signal, async url => {
    assert.equal(url, '/api/sessions/alice%2Fa');
    if (++calls === 1) throw new TypeError('Failed to fetch');
    if (calls === 2) return new Response('', { status: 502 });
    return Response.json([{ id: 'mine', user_id: 'alice/a' }]);
  }, async delay => pauses.push(delay));
  assert.deepEqual(sessions, [{ id: 'mine', user_id: 'alice/a' }]);
  assert.equal(calls, 3);
  assert.equal(pauses.length, 2);
});

test('persistent network failures are bounded and identify a connection problem without setup instructions', async () => {
  let calls = 0;
  await assert.rejects(fetchOwnSessions('', 'alice', undefined, async () => {
    calls++; throw new TypeError('Failed to fetch');
  }, async () => {}), { status: 0, code: 'connection_unavailable' });
  assert.equal(calls, 3);
});

test('authorization, application and invalid-response failures do not retry or return empty history', async () => {
  for (const status of [401, 403, 404, 500]) {
    let calls = 0;
    await assert.rejects(fetchOwnSessions('', 'alice', undefined, async () => {
      calls++; return new Response('', { status });
    }, async () => { throw new Error('Should not wait'); }));
    assert.equal(calls, 1, String(status));
  }
  await assert.rejects(fetchOwnSessions('', 'alice', undefined, async () => Response.json(null)), /Invalid conversation/);
});

test('abort during a retry delay prevents the next history request', async () => {
  let calls = 0;
  const controller = new AbortController();
  const pending = fetchOwnSessions('', 'alice', controller.signal, async () => {
    calls++; throw new TypeError('Failed to fetch');
  });
  setTimeout(() => controller.abort(), 5);
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(calls, 1);
});
