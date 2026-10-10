import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APIConnectionError, APIConnectionTimeoutError } from 'groq-sdk';
import { chatErrorDiagnostic, providerFailure } from '../chatDiagnostics.js';
import { createChatProvider, publicChatError } from '../chatProvider.js';

const model = 'openai/gpt-oss-120b';
const fallback = 'openai/gpt-oss-20b';
const api = create => ({ chat: { completions: { create } } });
const externalSearch = { lookup: async () => ({ status: 'not_needed', sources: [] }) };

test('connection and timeout diagnostics recognise actual SDK errors without logging sensitive contents', () => {
  const error = new APIConnectionError({ message: 'gsk_private tvly-private secret user case', cause: Object.assign(new Error('Bearer private'), { code: 'ECONNRESET' }) });
  error.stack = 'Error: private message\n at fail (C:\\Users\\private\\backend\\chatProvider.js:200:3)';
  const diagnostic = chatErrorDiagnostic(error, 'generate');
  assert.deepEqual(diagnostic, { stage: 'generate', status: 'internal', code: 'provider_connection_failed', type: 'APIConnectionError', causeCode: 'ECONNRESET', location: 'chatProvider.js:200:3' });
  assert.doesNotMatch(JSON.stringify(diagnostic), /private|gsk_|tvly-|Bearer|Users/);
  assert.equal(providerFailure(new APIConnectionTimeoutError()), 'request_timeout');
  assert.equal(providerFailure(new TypeError('Incorrect application code')), null);
  assert.equal(chatErrorDiagnostic(new TypeError('gsk_private'), 'save_reply').type, 'TypeError');
  assert.equal(chatErrorDiagnostic({ code: '42501' }, 'save_user').code, '42501');
  assert.equal(chatErrorDiagnostic({ code: 'tvly-secret-value' }).code, 'request_failed');
});

test('timeouts and lost connections have localized public messages with no raw provider text', () => {
  for (const language of ['en', 'rw', 'fr']) {
    const timeout = publicChatError(new APIConnectionTimeoutError({ message: 'Secret provider body' }), language);
    const connection = publicChatError(new APIConnectionError({ message: 'Secret provider body' }), language);
    assert.equal(timeout.status, 504);
    assert.equal(connection.status, 502);
    assert.doesNotMatch(JSON.stringify([timeout, connection]), /Secret/);
    assert.match(timeout.error, { en: /too long/, rw: /yatinze/, fr: /trop de temps/ }[language]);
  }
});

test('SDK connection errors, timeouts and transient server failures try the answer fallback once', async () => {
  for (const error of [new APIConnectionError({}), new APIConnectionTimeoutError(), Object.assign(new Error('Server failed'), { status: 503 })]) {
    const calls = [];
    const provider = createChatProvider({ model, externalSearch, client: api(async request => {
      calls.push(request.model);
      if (request.model === model) throw error;
      return { choices: [{ message: { content: 'Here is the answer.' } }] };
    }) });
    assert.equal(await provider.reply({ message: 'Please explain your role.' }), 'Here is the answer.');
    assert.deepEqual(calls, [model, fallback]);
  }
});

test('a local request deadline uses the fallback while a user Stop cancels it', async () => {
  const calls = [];
  const provider = createChatProvider({ model, externalSearch, requestTimeoutMs: 10, client: api((request, options) => {
    calls.push(request.model);
    if (request.model !== model) return { choices: [{ message: { content: 'Fallback answer.' } }] };
    return new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(Object.assign(new Error('Aborted request'), { name: 'AbortError' })), { once: true }));
  }) });
  const keepAlive = setTimeout(() => {}, 1000);
  try {
    assert.equal(await provider.reply({ message: 'Please explain your role.' }), 'Fallback answer.');
    assert.deepEqual(calls, [model, fallback]);
  } finally { clearTimeout(keepAlive); }
  const controller = new AbortController();
  let cancelledCalls = 0;
  const cancelled = createChatProvider({ model, externalSearch, client: api(async () => {
    cancelledCalls++;
    controller.abort();
    throw new APIConnectionError({});
  }) });
  await assert.rejects(cancelled.reply({ message: 'Please explain your role.', signal: controller.signal }), { name: 'AbortError' });
  assert.equal(cancelledCalls, 1);
});

test('no fallback follows visible text, bad credentials or an application bug', async () => {
  for (const error of [Object.assign(new Error('Invalid key'), { status: 401 }), new TypeError('Application bug')]) {
    let calls = 0;
    const provider = createChatProvider({ model, externalSearch, client: api(async () => { calls++; throw error; }) });
    await assert.rejects(provider.reply({ message: 'Please explain your role.' }));
    assert.equal(calls, 1);
  }
  let calls = 0;
  const received = [];
  const partial = createChatProvider({ model, externalSearch, client: api(async () => {
    calls++;
    return (async function* () { yield { choices: [{ delta: { content: 'Partial reply' } }] }; throw new APIConnectionError({}); })();
  }) });
  await assert.rejects(partial.reply({ message: 'Please explain your role.', streaming: true, onEvent: (event, data) => { if (event === 'token') received.push(data.text); } }));
  assert.equal(calls, 1);
  assert.deepEqual(received, ['Partial reply']);
});

test('a fallback timeout after a main-model quota error is reported as a timeout', async () => {
  const provider = createChatProvider({ model, externalSearch, client: api(async request => {
    if (request.model === model) throw Object.assign(new Error('Quota exceeded'), { status: 429 });
    throw new APIConnectionTimeoutError();
  }) });
  await assert.rejects(provider.reply({ message: 'Please explain your role.' }), error => {
    assert.equal(publicChatError(error).code, 'request_timeout');
    assert.equal(chatErrorDiagnostic(error).stage, 'answer');
    return true;
  });
});
