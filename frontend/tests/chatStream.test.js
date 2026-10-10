import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readChatStream } from '../lib/chatStream.js';

const encoder = new TextEncoder();
const event = (name, data) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
const response = chunks => new Response(new ReadableStream({
  start(controller) {
    for (const chunk of chunks) controller.enqueue(chunk);
    controller.close();
  },
}), { headers: { 'Content-Type': 'text/event-stream; charset=utf-8' } });

test('reconstructs split UTF-8 tokens and frame boundaries', async () => {
  const text = 'Hello, Aline! 👋';
  const wire = encoder.encode(event('session', { sessionId: 'test' }) + event('token', { text }) + event('done', { reply: text, sessionId: 'test' }));
  const chunks = Array.from(wire, byte => Uint8Array.of(byte));
  const seen = [];
  const result = await readChatStream(response(chunks), (name, payload) => seen.push([name, payload]));
  assert.equal(result.reply, text);
  assert.deepEqual(seen.map(item => item[0]), ['session', 'token', 'done']);
  assert.equal(seen[1][1].text, text);
});

test('handles CRLF and ignores keepalive comments', async () => {
  const wire = ': keepalive\r\n\r\n' + event('token', { text: 'Hi' }).replace(/\n/g, '\r\n') + event('done', { reply: 'Hi', sessionId: 'test' }).replace(/\n/g, '\r\n');
  const seen = [];
  const bytes = encoder.encode(wire);
  await readChatStream(response(Array.from(bytes, b => Uint8Array.of(b))), name => seen.push(name));
  assert.deepEqual(seen, ['token', 'done']);
});

test('delivers web search status before answer tokens', async () => {
  const seen = [];
  const wire = event('status', { text: 'Searching the web…', webSearch: true }) + event('token', { text: 'News' }) + event('done', { reply: 'News', sessionId: 'test' });
  await readChatStream(response([encoder.encode(wire)]), (name, payload) => seen.push([name, payload]));
  assert.deepEqual(seen.map(([name]) => name), ['status', 'token', 'done']);
  assert.equal(seen[0][1].webSearch, true);
});

test('reports a mid-stream server failure after delivering partial text', async () => {
  const seen = [];
  await assert.rejects(readChatStream(response([encoder.encode(event('token', { text: 'Partial' }) + event('error', { error: 'Provider unavailable' }))]), name => seen.push(name)), /Provider unavailable/);
  assert.deepEqual(seen, ['token']);
});

test('preserves rate-limit metadata for the composer countdown without delivering a completed reply', async () => {
  await assert.rejects(readChatStream(response([encoder.encode(event('error', {
    status: 429, error: 'Wait before trying again.', retryAfterSeconds: 3333,
  }))]), () => {}), error => {
    assert.equal(error.status, 429);
    assert.equal(error.retryAfterSeconds, 3333);
    assert.equal(error.message, 'Wait before trying again.');
    return true;
  });
});

test('does not treat an interrupted reply as successfully completed', async () => {
  await assert.rejects(readChatStream(response([encoder.encode(event('token', { text: 'Partial' }))]), () => {}), /before the reply finished/);
});

test('releases the connection immediately after a completed event', async () => {
  let cancelled = false;
  const body = new ReadableStream({
    start(controller) { controller.enqueue(encoder.encode(event('done', { reply: 'Hi', sessionId: 'test' }))); },
    cancel() { cancelled = true; },
  });
  await readChatStream(new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }), () => {});
  assert(cancelled);
  assert.equal(body.locked, false);
});

test('preserves abort errors for the Stop button', async () => {
  const body = new ReadableStream({ start(controller) { controller.error(new DOMException('Stopped', 'AbortError')); } });
  await assert.rejects(readChatStream(new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }), () => {}), { name: 'AbortError' });
});

test('rejects non-stream responses and malformed completed events', async () => {
  await assert.rejects(readChatStream(new Response('{}'), () => {}), /did not return a streamed reply/);
  await assert.rejects(readChatStream(response([encoder.encode(event('done', {}))]), () => {}), /completed answer/);
});
