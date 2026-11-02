import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createAccountAccessStore } from '../accountAccessStore.js';
import { apiAccess } from '../apiAccess.js';

function database(read) {
  const queries = [];
  return { queries, from(table) {
    const query = { table, filters: [] }; queries.push(query);
    return { select(columns) { query.columns = columns; return this; },
      eq(column, value) { query.filters.push([column, value]); return this; },
      maybeSingle() { return read(query, queries.length); } };
  } };
}

test('an intermittent profile lookup recovers on the server without replaying a chat mutation', async t => {
  const db = database(async (_, attempt) => attempt === 1
    ? { data: null, error: { message: 'TypeError: fetch failed', details: 'getaddrinfo ENOTFOUND private.supabase.co' }, status: 0 }
    : { data: { role: 'citizen' }, error: null, status: 200 });
  const waits = []; let chats = 0;
  const app = express();
  app.use('/api', apiAccess({ verify: async () => ({ uid: 'alice' }), ...createAccountAccessStore(db, { wait: async ms => waits.push(ms) }), onError() { throw new Error('Recovered reads must not fail authorization'); } }));
  app.post('/api/chat', (req, res) => { chats++; res.json({ role: req.accountRole }); });
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  t.after(() => { server.closeAllConnections(); server.close(); });
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/chat`, { method: 'POST', headers: { Authorization: 'Bearer token' } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { role: 'citizen' });
  assert.equal(chats, 1); assert.equal(db.queries.length, 2); assert.deepEqual(waits, [300]);
  assert.ok(db.queries.every(query => query.table === 'profiles' && query.columns === 'role' && JSON.stringify(query.filters) === JSON.stringify([['id', 'alice']])));
});

test('persistent outages stay bounded and permissions, credentials and schema failures are never retried', async () => {
  for (const [error, status, attempts] of [
    [{ message: 'TypeError: fetch failed', details: 'ECONNRESET' }, 0, 2],
    [{ message: 'Unavailable' }, 503, 2],
    [{ code: '42501' }, 403, 1],
    [{ code: 'PGRST301' }, 401, 1],
    [{ code: '42P01' }, 404, 1],
  ]) {
    const db = database(async () => ({ data: null, error, status }));
    const store = createAccountAccessStore(db, { wait: async () => {} });
    await assert.rejects(store.profile('alice'));
    assert.equal(db.queries.length, attempts);
  }
});

test('ownership recovery always keeps both owner and session filters; missing records and changed roles are read afresh', async () => {
  const db = database(async (_, attempt) => attempt === 1 ? Promise.reject(Object.assign(new Error('Network'), { code: 'ECONNRESET' }))
    : { data: attempt === 2 ? { id: 'session' } : null, error: null });
  const store = createAccountAccessStore(db, { wait: async () => {} });
  assert.equal(await store.ownsSession('session', 'alice'), true);
  assert.equal(await store.ownsSession('session', 'alice'), false);
  assert.ok(db.queries.every(query => JSON.stringify(query.filters) === JSON.stringify([['id', 'session'], ['user_id', 'alice']])));
  const roles = database(async (_, attempt) => ({ data: { role: attempt === 1 ? 'admin' : 'citizen' }, error: null }));
  const accounts = createAccountAccessStore(roles);
  assert.equal((await accounts.profile('alice')).role, 'admin');
  assert.equal((await accounts.profile('alice')).role, 'citizen');
});
