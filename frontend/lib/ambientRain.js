// Local rain-like noise: no download, account, API or fee.
function rainBuffer(context) {
  const buffer = context.createBuffer(2, Math.ceil(context.sampleRate * 8), context.sampleRate);
  const smoothing = 1 - Math.exp(-2 * Math.PI * 2200 / context.sampleRate);
  const fadeSamples = Math.max(1, Math.round(context.sampleRate * 0.015));
  for (let channel = 0; channel < 2; channel++) {
    const samples = buffer.getChannelData(channel);
    let filtered = 0, sum = 0, peak = 0;
    for (let i = 0; i < samples.length; i++) {
      filtered += smoothing * (Math.random() * 2 - 1 - filtered);
      const fade = Math.min(1, i / fadeSamples, (samples.length - 1 - i) / fadeSamples);
      samples[i] = filtered * fade;
      sum += samples[i] ** 2;
      peak = Math.max(peak, Math.abs(samples[i]));
    }
    // Normalize after filtering, so different output sample rates stay audible.
    const scale = Math.min(0.2 / Math.max(Math.sqrt(sum / samples.length), 0.0001), 0.8 / Math.max(peak, 0.0001));
    for (let i = 0; i < samples.length; i++) samples[i] *= scale;
  }
  return buffer;
}

export function createAmbientRain({
  AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext,
  onPlaybackChange = (_playing) => {}, startTimeoutMs = 5000,
} = {}) {
  let current = null;
  let volume = 0.5;

  const stop = () => {
    const sound = current;
    current = null;
    if (!sound) return;
    sound.context.onstatechange = null;
    try { sound.source.stop(); } catch { /* Source may not have started yet. */ }
    for (const node of [sound.source, sound.highpass, sound.gain]) node.disconnect();
    Promise.resolve(sound.context.close()).catch(() => {});
    onPlaybackChange(false);
  };

  return {
    async start() {
      if (current) return current.ready;
      if (!AudioContextClass) throw new Error('rain_audio_unavailable');
      const context = new AudioContextClass();
      let sound, timer;
      try {
        const source = context.createBufferSource();
        const highpass = context.createBiquadFilter();
        const gain = context.createGain();
        sound = { context, source, highpass, gain, playing: false };
        current = sound;
        // Resume within the original click gesture, before awaiting anything.
        const resumed = context.resume();
        sound.ready = Promise.race([resumed, new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('rain_audio_unavailable')), startTimeoutMs);
        })]);
        source.buffer = rainBuffer(context);
        source.loop = true;
        highpass.type = 'highpass'; highpass.frequency.value = 130;
        gain.gain.value = 0;
        source.connect(highpass); highpass.connect(gain); gain.connect(context.destination);
        await sound.ready;
        if (current !== sound) return;
        if (context.state !== 'running') throw new Error('rain_audio_unavailable');
        source.start();
        gain.gain.setTargetAtTime(volume, context.currentTime, 0.15);
        sound.playing = true;
        // A tab/OS interruption must not leave a silent toggle displaying On.
        context.onstatechange = () => {
          if (current === sound && sound.playing && context.state !== 'running') stop();
        };
        onPlaybackChange(true);
      } catch {
        if (sound && current !== sound) return;
        if (sound) stop();
        else Promise.resolve(context.close()).catch(() => {});
        throw new Error('rain_audio_unavailable');
      } finally { clearTimeout(timer); }
    },
    setVolume(value) {
      if (!Number.isFinite(value)) return;
      volume = Math.max(0, Math.min(1, value));
      if (current?.playing) current.gain.gain.setTargetAtTime(volume, current.context.currentTime, 0.1);
    },
    stop,
  };
}
