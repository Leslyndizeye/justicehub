// Gemini streaming audio: signed 16-bit little-endian PCM, mono, 24 kHz.
export function createPcmPlayer(AudioContextClass) {
  const context = new AudioContextClass({ latencyHint: 'interactive' });
  const sources = new Set();
  const waiters = new Set();
  let nextTime = 0, leftover = null, stopped = false;
  const settle = () => { if (!sources.size) { for (const waiter of waiters) waiter.resolve(); waiters.clear(); } };
  return {
    resume: () => context.resume(),
    append(bytes) {
      if (stopped) return false;
      let data = bytes;
      if (leftover !== null) { data = new Uint8Array(bytes.length + 1); data[0] = leftover; data.set(bytes, 1); }
      const evenLength = data.length - data.length % 2;
      leftover = data.length % 2 ? data.at(-1) : null;
      if (!evenLength) return false;
      const samples = evenLength / 2;
      const buffer = context.createBuffer(1, samples, 24000);
      const channel = buffer.getChannelData(0);
      const view = new DataView(data.buffer, data.byteOffset, evenLength);
      for (let i = 0; i < samples; i++) channel[i] = view.getInt16(i * 2, true) / 32768;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      sources.add(source);
      source.onended = () => { sources.delete(source); source.disconnect(); settle(); };
      const at = Math.max(nextTime, context.currentTime + 0.04);
      source.start(at);
      nextTime = at + samples / 24000;
      return true;
    },
    async finish() {
      if (leftover !== null) throw new Error('Incomplete audio sample');
      if (stopped) throw new DOMException('Stopped', 'AbortError');
      if (sources.size) await new Promise((resolve, reject) => waiters.add({ resolve, reject }));
    },
    stop() {
      stopped = true;
      for (const source of sources) { source.onended = null; try { source.stop(); } catch { /* Already ended. */ } source.disconnect(); }
      sources.clear();
      for (const waiter of waiters) waiter.reject(new DOMException('Stopped', 'AbortError'));
      waiters.clear();
      Promise.resolve(context.close()).catch(() => {});
    },
  };
}
