import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAmbientRain } from '../lib/ambientRain.js';

function audioHarness(options = {}, sampleRate = 16000) {
  const contexts = [];
  class Context {
    constructor() {
      contexts.push(this);
      this.sampleRate = sampleRate; this.currentTime = 0; this.state = 'suspended'; this.nodes = [];
      this.ready = new Promise((resolve, reject) => { this.allow = () => { this.state = 'running'; resolve(); }; this.deny = reject; });
    }
    resume() { return this.ready; }
    close() { this.state = 'closed'; return Promise.resolve(); }
    node() {
      const node = { frequency: {}, Q: {}, gain: { targets: [], setTargetAtTime(value) { this.targets.push(value); } },
        connect() {}, disconnect() { this.disconnected = true; },
        start() { this.started = true; }, stop() { this.stopped = true; },
      };
      this.nodes.push(node); return node;
    }
    createBufferSource() { return this.node(); }
    createBiquadFilter() { return this.node(); }
    createGain() { return this.node(); }
    createBuffer(channels, length) {
      const data = Array.from({ length: channels }, () => new Float32Array(length));
      return { getChannelData: channel => data[channel] };
    }
  }
  return { contexts, player: createAmbientRain({ AudioContextClass: Context, ...options }) };
}

test('rain starts only after audio permission, does not overlap on repeated starts, and releases audio on stop', async () => {
  const { player, contexts } = audioHarness();
  const starting = player.start();
  assert.equal(contexts.length, 1);
  const context = contexts[0];
  assert.equal(context.nodes[0].started, undefined);
  const repeated = player.start();
  assert.equal(contexts.length, 1);
  context.allow(); await starting; await repeated;
  assert.equal(context.nodes[0].started, true);
  player.stop(); player.stop();
  assert.equal(context.state, 'closed');
  assert.ok(context.nodes.every(node => node.disconnected));
  assert.equal(context.nodes[0].stopped, true);
});

test('turning rain off while permission is pending prevents late playback and leaves a new attempt intact', async () => {
  const { player, contexts } = audioHarness();
  const first = player.start(); player.stop();
  const second = player.start();
  contexts[0].deny(new Error('Permission denied for the old attempt'));
  await first;
  assert.equal(contexts[0].nodes[0].started, undefined);
  assert.equal(contexts[1].state, 'suspended');
  contexts[1].allow(); await second;
  assert.equal(contexts[1].nodes[0].started, true);
  player.stop();

  const third = player.start(); player.stop();
  contexts[2].allow(); await third;
  assert.equal(contexts[2].nodes[0].started, undefined);
});

test('unavailable or denied audio stays silent, cleans up and allows a fresh attempt', async () => {
  await assert.rejects(createAmbientRain({ AudioContextClass: null }).start(), /rain_audio_unavailable/);
  const { player, contexts } = audioHarness();
  const attempt = player.start(); contexts[0].deny(new Error('Private browser details'));
  await assert.rejects(attempt, /rain_audio_unavailable/);
  assert.equal(contexts[0].state, 'closed');
  assert.ok(contexts[0].nodes.every(node => node.disconnected));
  const retry = player.start(); contexts[1].allow(); await retry;
  assert.equal(contexts[1].nodes[0].started, true);
  player.stop();
});

test('the filtered signal has consistent audible energy at common output sample rates without clipping or loop clicks', async () => {
  for (const rate of [44100, 48000, 96000]) {
    const { player, contexts } = audioHarness({}, rate);
    const starting = player.start(); contexts[0].allow(); await starting;
    const source = contexts[0].nodes[0];
    assert.equal(source.loop, true);
    for (let channel = 0; channel < 2; channel++) {
      const samples = source.buffer.getChannelData(channel);
      const rms = Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);
      assert.ok(rms > 0.15 && rms <= 0.201, `Signal RMS ${rms} at ${rate} Hz`);
      assert.ok(samples.every(value => Number.isFinite(value) && Math.abs(value) <= 0.801));
      assert.equal(Math.abs(samples[0]), 0); assert.equal(Math.abs(samples.at(-1)), 0);
    }
    player.stop();
  }
});

test('playback state stays off until audio runs, volume changes live, and interruptions switch playback off', async () => {
  const states = [];
  const { player, contexts } = audioHarness({ onPlaybackChange: playing => states.push(playing) });
  player.setVolume(0.7);
  const starting = player.start();
  assert.deepEqual(states, []);
  contexts[0].allow(); await starting;
  assert.deepEqual(states, [true]);
  const gain = contexts[0].nodes[2].gain;
  assert.equal(gain.targets.at(-1), 0.7);
  player.setVolume(0.3); assert.equal(gain.targets.at(-1), 0.3);
  player.setVolume(2); assert.equal(gain.targets.at(-1), 1);
  player.setVolume(NaN); assert.equal(gain.targets.at(-1), 1);
  const interrupted = contexts[0].onstatechange;
  contexts[0].state = 'suspended'; interrupted();
  assert.deepEqual(states, [true, false]);
  assert.equal(contexts[0].state, 'closed');
  const retry = player.start(); contexts[1].allow(); await retry;
  interrupted(); assert.equal(contexts[1].state, 'running', 'An old event cannot stop new playback');
  player.stop();
});

test('a browser that never resumes audio times out, cleans up, and cannot start later after a retry', async () => {
  const states = [];
  const { player, contexts } = audioHarness({ startTimeoutMs: 15, onPlaybackChange: playing => states.push(playing) });
  await assert.rejects(player.start(), /rain_audio_unavailable/);
  assert.equal(contexts[0].state, 'closed'); assert.deepEqual(states, [false]);
  const retry = player.start();
  contexts[0].allow();
  contexts[1].allow(); await retry;
  assert.equal(contexts[0].nodes[0].started, undefined);
  assert.equal(contexts[1].nodes[0].started, true);
  player.stop();
});
