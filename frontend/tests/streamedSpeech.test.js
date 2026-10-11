import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPcmPlayer } from '../lib/pcmPlayer.js';
import { createAnswerReader } from '../lib/answerReader.js';
import { createSpeechReader } from '../lib/speechReader.js';

function audioContext() {
  const contexts = [];
  class Context {
    constructor() { this.currentTime = 1; this.sources = []; contexts.push(this); }
    async resume() { this.resumed = true; }
    async close() { this.closed = true; }
    createBuffer(channels, samples, rate) {
      assert.equal(channels, 1); assert.equal(rate, 24000);
      const values = new Float32Array(samples);
      return { values, getChannelData: () => values };
    }
    createBufferSource() {
      const source = { connect() {}, disconnect() {}, start(at) { this.at = at; }, stop() { this.stopped = true; } };
      this.sources.push(source); return source;
    }
  }
  return { Context, contexts };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('PCM preserves signed samples across odd network chunks and schedules continuous playback', async () => {
  const { Context, contexts } = audioContext();
  const player = createPcmPlayer(Context);
  await player.resume();
  assert.equal(player.append(new Uint8Array([0])), false);
  player.append(new Uint8Array([128, 255, 127, 0]));
  player.append(new Uint8Array([0]));
  const context = contexts[0];
  assert.deepEqual(Array.from(context.sources[0].buffer.values), [-1, 32767 / 32768]);
  assert.deepEqual(Array.from(context.sources[1].buffer.values), [0]);
  assert.equal(context.sources[1].at, context.sources[0].at + 2 / 24000);
  let finished = false;
  const pending = player.finish().then(() => { finished = true; });
  context.sources[0].onended(); await tick();
  assert.equal(finished, false);
  context.sources[1].onended(); await pending;
  assert.equal(finished, true);
  player.stop(); assert.equal(context.closed, true);
});

test('Stop cancels queued PCM, closes audio resources and rejects pending playback completion', async () => {
  const { Context, contexts } = audioContext();
  const player = createPcmPlayer(Context);
  player.append(new Uint8Array([1, 0]));
  const pending = player.finish();
  player.stop();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(contexts[0].sources[0].stopped, true);
  assert.equal(contexts[0].sources[0].onended, null);
  assert.equal(contexts[0].closed, true);
  assert.equal(player.append(new Uint8Array([1, 0])), false);
});

test('the answer starts playing before EOF, then waits for playback before requesting the next section', async () => {
  const { Context, contexts } = audioContext();
  const requests = [], upstreams = [];
  const reader = createAnswerReader({ AudioContextClass: Context, deviceReader: createSpeechReader({ synthesis: null }),
    fetchImpl: async (_, options) => {
      requests.push(JSON.parse(options.body));
      return new Response(new ReadableStream({ start(controller) { upstreams.push(controller); } }), { headers: { 'content-type': 'audio/pcm' } });
    },
  });
  reader.allowNaturalVoice();
  const text = 'You can ask for an explanation. '.repeat(90).trim();
  const pending = reader.start({ messageId: 'a', text, language: 'en' });
  await tick();
  upstreams[0].enqueue(new Uint8Array([0, 128])); await tick();
  assert.equal(reader.snapshot().status, 'reading');
  assert.equal(contexts[0].sources.length, 1);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].stream, true); assert.equal(requests[0].voice, 'Algieba');
  upstreams[0].close(); await tick();
  assert.equal(requests.length, 1); // EOF alone must not use another generation.
  contexts[0].sources[0].onended(); await tick();
  assert.equal(requests.length, 2);
  upstreams[1].enqueue(new Uint8Array([1, 0])); upstreams[1].close(); await tick();
  contexts[0].sources[1].onended(); await pending;
  assert.equal(requests.map(request => request.text).join(' '), text);
  assert.equal(reader.snapshot().status, 'idle');
  assert.equal(contexts[0].closed, true);
});

test('switching answers aborts a pending stream and cannot publish late PCM or errors', async () => {
  const { Context, contexts } = audioContext();
  let upstream, signal;
  const reader = createAnswerReader({ AudioContextClass: Context, deviceReader: createSpeechReader({ synthesis: null }),
    fetchImpl: async (_, options) => {
      signal = options.signal;
      return new Response(new ReadableStream({ start(controller) { upstream = controller; } }), { headers: { 'content-type': 'audio/pcm' } });
    },
  });
  reader.allowNaturalVoice();
  const pending = reader.start({ messageId: 'old', text: 'Hello.' });
  await tick();
  upstream.enqueue(new Uint8Array([1, 0])); await tick();
  reader.stop();
  assert.equal(signal.aborted, true);
  assert.equal(contexts[0].sources[0].stopped, true);
  upstream.enqueue(new Uint8Array([2, 0]));
  await pending;
  assert.equal(contexts[0].sources.length, 1);
  assert.equal(reader.snapshot().status, 'idle');
});

test('a truncated stream stops playback and never retries with another API or voice', async () => {
  const { Context, contexts } = audioContext();
  let requests = 0;
  const reader = createAnswerReader({ AudioContextClass: Context, deviceReader: createSpeechReader({ synthesis: null }),
    fetchImpl: async () => { requests++; return new Response(new Uint8Array([1, 0, 2]), { headers: { 'content-type': 'audio/pcm' } }); },
  });
  reader.allowNaturalVoice(); await reader.start({ messageId: 'a', text: 'Hello.' });
  assert.equal(requests, 1); assert.equal(reader.snapshot().status, 'error');
  assert.equal(contexts[0].sources[0].stopped, true);
  await reader.start({ messageId: 'b', text: 'Hello.', voice: 'Sulafat' });
  assert.equal(requests, 1); assert.match(reader.snapshot().error, /smooth voice/);
});
