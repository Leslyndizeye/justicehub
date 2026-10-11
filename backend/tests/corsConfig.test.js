import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cors from 'cors';
import { configuredCorsOrigins } from '../corsConfig.js';

const frontend = 'https://justicehub-pleo-liard.vercel.app';

test('frontend configuration accepts deployment URLs and preserves exact origin boundaries', () => {
  assert.deepEqual(configuredCorsOrigins(), ['http://localhost:5173']);
  assert.deepEqual(configuredCorsOrigins(` ${frontend}/dashboard/ , https://www.example.com/ , ${frontend} `), [
    'http://localhost:5173', frontend, 'https://www.example.com',
  ]);
  for (const value of ['*', 'null', 'https://*.vercel.app', 'ftp://example.com', 'https://user:password@example.com']) {
    assert.throws(() => configuredCorsOrigins(value));
  }
});

test('configured frontend preflights succeed before authentication while unrelated origins stay blocked', async t => {
  const app = express();
  app.use(cors({ origin: configuredCorsOrigins(` ${frontend}/ `) }));
  let protectedRequests = 0;
  app.use('/api', (req, res) => { protectedRequests++; res.status(401).json({ error: 'Sign in required' }); });
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [path, method] of [['/api/users', 'POST'], ['/api/memory', 'GET'], ['/api/sessions/account', 'GET'], ['/api/chat', 'POST']]) {
    const response = await fetch(base + path, { method: 'OPTIONS', headers: {
      Origin: frontend, 'Access-Control-Request-Method': method, 'Access-Control-Request-Headers': 'authorization,content-type',
    } });
    assert.equal(response.status, 204, path);
    assert.equal(response.headers.get('access-control-allow-origin'), frontend, path);
    assert.match(response.headers.get('access-control-allow-headers'), /authorization/);
    assert.match(response.headers.get('access-control-allow-headers'), /content-type/);
    assert.ok(response.headers.get('access-control-allow-methods').split(',').includes(method));
  }
  assert.equal(protectedRequests, 0);
  for (const origin of ['https://unrelated.vercel.app', frontend + '.evil.example', 'null']) {
    const response = await fetch(base + '/api/users', { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' } });
    assert.equal(response.headers.get('access-control-allow-origin'), null, origin);
  }
  const response = await fetch(base + '/api/memory', { headers: { Origin: frontend } });
  assert.equal(response.status, 401);
  assert.equal(response.headers.get('access-control-allow-origin'), frontend);
  assert.equal(protectedRequests, 1);
});
