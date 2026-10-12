import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAmbientRain } from '../lib/ambientRain.js';

function audioHarness() {
  const contexts = [];
  class Context {
    constructor() {
      contexts.push(this);
      this.sampleRate = 16; this.currentTime = 0; this.state = 'suspended'; this.nodes = [];
      this.ready = new Promise((resolve, reject) => { this.allow = () => { this.state = 'running'; resolve(); }; this.deny = reject; });
    }
    resume() { return this.ready; }
    close() { this.state = 'closed'; return Promise.resolve(); }
    node() {
      const node = { frequency: {}, Q: {}, gain: { setTargetAtTime() {} },
        connect() {}, disconnect() { this.disconnected = true; },
        start() { this.started = true; }, stop() { this.stopped = true; },
      };
      this.nodes.push(node); return node;
    }
    createBufferSource() { return this.node(); }
    createBiquadFilter() { return this.node(); }
    createGain() { return this.node(); }
    createBuffer(channels, length) { return { getChannelData: () => new Float32Array(length) }; }
  }
  return { contexts, player: createAmbientRain({ AudioContextClass: Context }) };
}

test('rain starts only after audio permission, does not overlap on repeated starts, and releases audio on stop', async () => {
  const { player, contexts } = audioHarness();
  const starting = player.start();
  assert.equal(contexts.length, 1);
  const context = contexts[0];
  assert.equal(context.nodes[0].started, undefined);
  await player.start();
  assert.equal(contexts.length, 1);
  context.allow(); await starting;
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
