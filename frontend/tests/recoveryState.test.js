import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { recoveryState, requestError } from '../lib/recoveryState.js';
import { fetchOwnSessions } from '../lib/chatSessions.js';
import { chatFailureNotice } from '../lib/chatErrors.js';

const source = fs.readFileSync(new URL('../components/StatusScreen.tsx', import.meta.url), 'utf8')
  .replace("import './statusScreen.css';", '')
  .replace('../lib/recoveryState.js', new URL('../lib/recoveryState.js', import.meta.url).href);
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const cache = path.resolve('node_modules/.cache/justicehub-tests');
fs.mkdirSync(cache, { recursive: true });
const modulePath = path.join(cache, 'StatusScreen.mjs');
fs.writeFileSync(modulePath, compiled, 'utf8');
const { default: StatusScreen, StatusPanel } = await import(pathToFileURL(modulePath).href);

test('failed history reads retain their status and distinguish missing resources from connection failures', async () => {
  for (const [status, kind] of [[401, 'sign-in'], [403, 'forbidden'], [503, 'unavailable']]) {
    try {
      await fetchOwnSessions('', 'test-user', undefined, async () => new Response('', { status }), async () => {});
      assert.fail('A failed read must not become an empty chat list.');
    } catch (error) { assert.equal(recoveryState(error, { resource: 'history' }).kind, kind); }
  }
  assert.equal(recoveryState(requestError(404), { resource: 'conversation' }).kind, 'not-found');
  assert.equal(recoveryState(new TypeError('Failed to fetch'), { resource: 'conversation' }).kind, 'unavailable');
  assert.equal(recoveryState(new TypeError('Failed to fetch'), { resource: 'conversation', online: false }).kind, 'offline');
  assert.equal(recoveryState(new Error('Unexpected runtime stack')).kind, 'unexpected');
});

test('recovery panels show only useful controls and never render raw diagnostics', () => {
  const raw = Object.assign(new Error('SUPABASE_SERVICE_ROLE_KEY <script>Failed to fetch stack trace</script>'), { status: 503 });
  const unavailable = renderToStaticMarkup(React.createElement(StatusPanel, { state: recoveryState(raw, { resource: 'history' }), compact: true, onRetry() {}, busy: true }));
  assert.doesNotMatch(unavailable, /SUPABASE|script|stack trace|Failed to fetch|backend|npm/);
  assert.match(unavailable, /disabled=""/);
  assert.match(unavailable, /role="status"/);
  const missing = renderToStaticMarkup(React.createElement(StatusPanel, { state: recoveryState(requestError(404), { resource: 'conversation' }), onRetry() {}, onBack() {} }));
  assert.match(missing, /404/);
  assert.match(missing, /New conversation/);
  assert.doesNotMatch(missing, /Try again/);
  const signIn = renderToStaticMarkup(React.createElement(StatusPanel, { state: recoveryState(requestError(401)), onSignIn() {}, onRetry() {} }));
  assert.match(signIn, /Sign in again/);
  assert.doesNotMatch(signIn, /Try again/);
});

test('standalone pages offer real recovery destinations and chat failures preserve quota notices without leaking provider bodies', () => {
  const page = renderToStaticMarkup(React.createElement(StatusScreen, { state: recoveryState(requestError(404)), workspaceHref: '/dashboard' }));
  assert.match(page, /<main/);
  assert.match(page, /href="\/"/);
  assert.match(page, /href="\/dashboard"/);
  assert.match(page, /aria-label="Recovery links"/);
  assert.doesNotMatch(chatFailureNotice(new TypeError('Failed to fetch')), /Failed to fetch/);
  assert.doesNotMatch(chatFailureNotice({ status: 500, message: 'SQL error with private credentials' }), /SQL|credentials/);
  assert.match(chatFailureNotice({ status: 429, retryAfterSeconds: 65 }, 'rw'), /1:05/);
  assert.match(chatFailureNotice({ status: 401 }, 'fr'), /Reconnectez-vous/);
});
