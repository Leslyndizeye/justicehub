// Quiet, locally generated rain ambience. No downloads, API calls or credentials.
export function createAmbientRain({ AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext } = {}) {
  let current = null;

  const stop = () => {
    const sound = current;
    current = null;
    if (!sound) return;
    try { sound.source.stop(); } catch { /* It may still be waiting for audio permission. */ }
    sound.source.disconnect();
    sound.highpass.disconnect();
    sound.lowpass.disconnect();
    sound.gain.disconnect();
    Promise.resolve(sound.context.close()).catch(() => {});
  };

  return {
    async start() {
      if (current) return;
      if (!AudioContextClass) throw new Error('rain_audio_unavailable');
      const context = new AudioContextClass();
      let sound;
      try {
        const source = context.createBufferSource();
        const highpass = context.createBiquadFilter();
        const lowpass = context.createBiquadFilter();
        const gain = context.createGain();
        sound = { context, source, highpass, lowpass, gain };
        current = sound;
        // Resume directly within the toggle's click gesture, before awaiting.
        const ready = context.resume();
        const buffer = context.createBuffer(2, context.sampleRate * 8, context.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
          const samples = buffer.getChannelData(channel);
          for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
        }
        source.buffer = buffer;
        source.loop = true;
        highpass.type = 'highpass'; highpass.frequency.value = 180;
        lowpass.type = 'lowpass'; lowpass.frequency.value = 1800;
        lowpass.Q.value = 0.5;
        gain.gain.value = 0;
        source.connect(highpass); highpass.connect(lowpass); lowpass.connect(gain); gain.connect(context.destination);
        await ready;
        // Turning off or leaving the dashboard while resume is pending wins.
        if (current !== sound) return;
        if (context.state !== 'running') throw new Error('rain_audio_unavailable');
        source.start();
        gain.gain.setTargetAtTime(0.16, context.currentTime, 0.3);
      } catch {
        if (sound && current !== sound) return;
        if (sound) stop();
        else Promise.resolve(context.close()).catch(() => {});
        throw new Error('rain_audio_unavailable');
      }
    },
    stop,
  };
}
