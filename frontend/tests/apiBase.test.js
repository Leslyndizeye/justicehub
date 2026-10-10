import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiBaseUrl } from '../lib/apiBase.js';

test('development uses same-origin API requests, including remote access to the dev website', () => {
  for (const target of [undefined, 'http://localhost:4000', 'http://127.0.0.1:4000', 'https://backend.example']) {
    assert.equal(apiBaseUrl(target, true) + '/api/sessions/user', '/api/sessions/user');
  }
});

test('production keeps the configured backend URL and removes trailing slashes', () => {
  assert.equal(apiBaseUrl(' https://backend.example/// ', false), 'https://backend.example');
  assert.equal(apiBaseUrl('https://backend.example/base', false), 'https://backend.example/base');
  assert.equal(apiBaseUrl(undefined, false), 'http://localhost:4000');
});
