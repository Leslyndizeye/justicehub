import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { apiAccess } from '../apiAccess.js';

test('public API access verifies sign-in, owner IDs, database roles, and session ownership before mutations', async t => {
  const app = express();
  app.use(express.json());
  let mutations = 0;
  const profileCalls = [];
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', apiAccess({
    verify: async token => {
      if (token === 'invalid') throw Object.assign(new Error('Invalid'), { status: 401 });
      if (token === 'outage') throw Object.assign(new Error('Unavailable'), { status: 503 });
      return { uid: token };
    },
    profile: async uid => { profileCalls.push(uid); return { role: uid === 'admin-owner' ? 'admin' : 'citizen' }; },
    ownsSession: async (id, uid) => id === 'own-session' && uid === 'alice',
  }));
  app.get('/api/users/:uid', (req, res) => res.json({ owner: req.identity.uid }));
  app.post('/api/users', (req, res) => { mutations++; res.json({ owner: req.identity.uid }); });
  app.get('/api/sessions/:uid', (req, res) => res.json([]));
  app.post('/api/sessions', (req, res) => { mutations++; res.json({ owner: req.identity.uid }); });
  app.get('/api/messages/:sessionId', (req, res) => res.json([]));
  app.delete('/api/sessions/:sessionId', (req, res) => { mutations++; res.json({ success: true }); });
  app.get('/api/admin/stats', (req, res) => res.json({ allowed: true }));
  app.patch('/api/users/:uid/role', (req, res) => { mutations++; res.json({ allowed: true }); });
  app.post('/api/chat', (req, res) => { mutations++; res.json({ owner: req.identity.uid, role: req.accountRole }); });
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, token, method = 'GET', body) => fetch(base + path, { method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  assert.equal((await request('/health')).status, 200);
  for (const path of ['/api/users/alice', '/api/sessions/alice', '/api/messages/own-session', '/api/admin/stats']) {
    assert.equal((await request(path)).status, 401, path);
    assert.equal((await request(path, 'invalid')).status, 401, path);
  }
  assert.equal((await request('/api/users/alice', 'outage')).status, 503);
  assert.equal((await request('/api/users/bob', 'alice')).status, 403);
  assert.equal((await request('/api/sessions/bob', 'alice')).status, 403);
  for (const path of ['/api/users', '/api/sessions', '/api/chat']) {
    assert.equal((await request(path, 'alice', 'POST', { uid: 'bob', role: 'admin' })).status, 403);
  }
  assert.equal((await request('/api/messages/other-session', 'alice')).status, 404);
  assert.equal((await request('/api/sessions/other-session', 'alice', 'DELETE')).status, 404);
  assert.equal((await request('/api/admin/stats', 'alice')).status, 403);
  assert.equal((await request('/api/users/alice/role', 'alice', 'PATCH', { role: 'admin' })).status, 403);
  assert.equal((await request('/api/ADMIN/stats/', 'alice')).status, 403);
  assert.equal((await request('/api/users/alice/ROLE/', 'alice', 'PATCH', { role: 'admin' })).status, 403);
  assert.equal((await request('/api/USERS/bob/', 'alice')).status, 403);
  assert.equal((await request('/api/CHAT/', 'alice', 'POST', { uid: 'bob' })).status, 403);
  assert.equal(mutations, 0);
  const chat = await request('/api/chat', 'alice', 'POST', { uid: 'alice', role: 'admin', message: 'Hello' });
  assert.deepEqual(await chat.json(), { owner: 'alice', role: 'citizen' });
  assert.equal((await request('/api/users/alice', 'alice')).status, 200);
  assert.equal((await request('/api/messages/own-session', 'alice')).status, 200);
  assert.equal((await request('/api/admin/stats', 'admin-owner')).status, 200);
  assert.equal((await request('/api/users/alice/role', 'admin-owner', 'PATCH', { role: 'citizen' })).status, 200);
  assert.ok(profileCalls.includes('alice') && profileCalls.includes('admin-owner'));
});

test('a failed role or ownership lookup denies access instead of trusting caller input', async t => {
  const app = express();
  app.use('/api', apiAccess({ verify: async () => ({ uid: 'alice' }), profile: async () => { throw new Error('Database unavailable'); }, ownsSession: async () => { throw new Error('Database unavailable'); } }));
  app.use('/api', (req, res) => res.json({ unsafe: true }));
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  t.after(() => { server.closeAllConnections(); server.close(); });
  for (const path of ['/api/admin/stats', '/api/messages/session']) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { headers: { Authorization: 'Bearer token' } });
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /unsafe/);
  }
});
