import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { readSpeechPcm } from '../speechStream.js';
import { createSpeechProvider } from '../speechProvider.js';
import { speechRouter } from '../speechRoutes.js';

const input = { text: 'Hello.', voice: 'Algieba', language: 'en', consent: true, stream: true };
const encoder = new TextEncoder();
const audio = (bytes = [0, 128, 255, 127]) => ({ event_type: 'step.delta', delta: { type: 'audio', mime_type: 'audio/l16;rate=24000', data: Buffer.from(bytes).toString('base64') } });
const completed = { event_type: 'interaction.completed', interaction: { status: 'completed' } };
const frame = event => `data: ${JSON.stringify(event)}\r\n\r\n`;
const response = events => new Response(events.map(frame).join(''), { headers: { 'content-type': 'text/event-stream' } });

test('SSE plays its first audio before completion and handles split CRLF and UTF-8 frames', async () => {
  let upstream, first;
  const received = [];
  const started = new Promise(resolve => { first = resolve; });
  const body = new ReadableStream({ start(controller) { upstream = controller; } });
  const pending = readSpeechPcm(new Response(body, { headers: { 'content-type': 'text/event-stream' } }), bytes => { received.push(bytes); first(); });
  const initial = encoder.encode(frame({ event_type: 'step.start', label: 'Ikinyarwanda — speech' }) + frame(audio()));
  for (const byte of initial) upstream.enqueue(new Uint8Array([byte]));
  await started;
  assert.deepEqual(Buffer.concat(received), Buffer.from([0, 128, 255, 127]));
  upstream.enqueue(encoder.encode(frame(audio([1, 0])) + frame(completed) + 'data: [DONE]\n\n'));
  upstream.close();
  assert.deepEqual(await pending, Buffer.from([0, 128, 255, 127, 1, 0]));
});

test('incomplete, wrong-format and failed streams cannot be reported as completed audio', async () => {
  for (const events of [[audio()], [completed], [audio([1]), completed], [audio(), { event_type: 'error' }],
    [{ ...audio(), delta: { ...audio().delta, mime_type: 'audio/wav' } }, completed], [audio(), completed, audio()]]) {
    await assert.rejects(readSpeechPcm(response(events), () => {}), { code: 'speech_unavailable' });
  }
  const controller = new AbortController();
  await assert.rejects(readSpeechPcm(response([audio(), completed]), () => controller.abort(), controller.signal), { name: 'AbortError' });
});

test('stream requests use only Smooth PCM and cache only complete audio for its verified owner', async () => {
  let calls = 0;
  const provider = createSpeechProvider({ apiKey: 'test', freeTierConfirmed: true, fetchImpl: async (_, options) => {
    calls++;
    const body = JSON.parse(options.body);
    assert.equal(body.stream, true);
    assert.deepEqual(body.response_format, { type: 'audio', mime_type: 'audio/l16', sample_rate: 24000 });
    assert.deepEqual(body.generation_config.speech_config, [{ voice: 'Algieba' }]);
    assert.equal(body.store, false);
    return response([audio(), completed]);
  } });
  for (const owner of ['alice', 'alice', 'bob']) {
    const received = [];
    const result = await provider.generate(owner, input, undefined, bytes => received.push(bytes));
    assert.deepEqual(Buffer.concat(received), result);
  }
  assert.equal(calls, 2);
  let failures = 0;
  const failing = createSpeechProvider({ apiKey: 'test', freeTierConfirmed: true, fetchImpl: async () => { failures++; return response([audio()]); } });
  for (let i = 0; i < 2; i++) await assert.rejects(failing.generate('alice', input, undefined, () => {}), { code: 'speech_unavailable' });
  assert.equal(failures, 2); // No cached partial clip or automatic retries.
});

test('HTTP forwards audio before the provider finishes and cancels work when the reader disconnects', async t => {
  let finish, arrived, signal;
  const started = new Promise(resolve => { arrived = resolve; });
  const app = express(); app.use(express.json());
  app.use('/api/speech', (req, res, next) => { req.identity = { uid: 'alice' }; next(); }, speechRouter({ provider: {
    async generate(owner, body, abort, onAudio) {
      assert.equal(owner, 'alice'); assert.equal(body.stream, true); signal = abort;
      await onAudio(Buffer.from([0, 128])); arrived();
      await new Promise(resolve => { finish = resolve; abort.addEventListener('abort', resolve, { once: true }); });
      return Buffer.from([0, 128]);
    },
  } }));
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  t.after(() => { finish?.(); server.closeAllConnections(); server.close(); });
  const url = `http://127.0.0.1:${server.address().port}/api/speech`;
  const result = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
  await started;
  assert.equal(result.headers.get('content-type'), 'audio/pcm');
  assert.equal(result.headers.get('cache-control'), 'private, no-store, no-transform');
  const reader = result.body.getReader();
  assert.deepEqual(Buffer.from((await reader.read()).value), Buffer.from([0, 128]));
  const aborted = new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
  await reader.cancel(); await aborted;
  assert.equal(signal.aborted, true);
});
