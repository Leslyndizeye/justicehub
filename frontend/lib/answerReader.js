import { createSpeechReader, speechChunks } from './speechReader.js';
import { speechLanguage } from './speechLanguage.js';
import { createPcmPlayer } from './pcmPlayer.js';

export function createAnswerReader({ base = '', fetchImpl = fetch, AudioClass = globalThis.Audio,
  AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext,
  urls = globalThis.URL, deviceReader = createSpeechReader() } = {}) {
  const cloudSupported = Boolean(AudioContextClass || AudioClass && urls?.createObjectURL && urls?.revokeObjectURL);
  let state = { messageId: null, status: 'idle', error: '' };
  let generation = 0, controller = null, audio = null, audioUrl = null, mode = null;
  let consent = false;
  let pcmPlayer = null;
  let unsubscribeDevice = null;
  const listeners = new Set();
  const update = next => { state = next; for (const listener of listeners) listener(state); };
  const releaseUrl = () => { if (audioUrl) urls.revokeObjectURL(audioUrl); audioUrl = null; };

  function stop(messageId) {
    if (messageId && state.messageId !== messageId) return;
    generation++;
    controller?.abort();
    controller = null;
    pcmPlayer?.stop();
    pcmPlayer = null;
    if (audio) {
      audio.onended = audio.onerror = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio = null;
    }
    releaseUrl();
    mode = null;
    unsubscribeDevice?.();
    unsubscribeDevice = null;
    deviceReader.stop();
    update({ messageId: null, status: 'idle', error: '' });
  }

  async function start({ messageId, text, language = 'auto', voice = 'Algieba' }) {
    stop();
    if (voice === 'device') {
      mode = 'device';
      unsubscribeDevice = deviceReader.subscribe(next => { if (mode === 'device') update(next); });
      deviceReader.start({ messageId, text, language });
      return;
    }
    const fail = error => { stop(); update({ messageId, status: 'error', error }); };
    if (!cloudSupported) { fail('Read aloud is not supported in this browser.'); return; }
    if (!consent) { fail('Click Read aloud to listen to this answer.'); return; }
    if (voice !== 'Algieba') { fail('Please use the smooth voice.'); return; }
    if (typeof text !== 'string' || text.length > 12000) { fail('This answer is too long to read aloud. Try a shorter answer.'); return; }
    const chunks = speechChunks(text, 2400);
    if (!chunks.length) return;
    mode = 'cloud';
    const activeGeneration = generation;
    const requestController = new AbortController();
    controller = requestController;
    const code = speechLanguage(text, language);
    let index = 0;
    const current = () => activeGeneration === generation && !requestController.signal.aborted;
    const responseError = async response => {
      let body = {}; try { body = await response.json(); } catch { /* Never display raw service errors. */ }
      return response.status === 401 ? 'Please sign in again to use natural voices.'
        : response.status === 429 ? 'Natural speech is busy or has reached its free usage limit. Please try later.'
        : body.code === 'speech_unconfigured' ? 'Read aloud is not available yet. Please try later.'
        : 'Natural speech is temporarily unavailable. Please try later.';
    };
    if (AudioContextClass) {
      update({ messageId, status: 'loading', error: '' });
      try {
        const player = createPcmPlayer(AudioContextClass);
        pcmPlayer = player;
        // Unlock audio within the click gesture, before waiting for the network.
        await player.resume();
        if (!current()) return;
        for (const chunk of chunks) {
          update({ messageId, status: 'loading', error: '' });
          const response = await fetchImpl(`${base}/api/speech`, { method: 'POST',
            headers: { 'Content-Type': 'application/json' }, signal: requestController.signal,
            body: JSON.stringify({ text: chunk, voice, language: code, consent: true, stream: true }),
          });
          if (!current()) return;
          if (!response.ok) { const message = await responseError(response); if (current()) fail(message); return; }
          if (!response.body || !response.headers.get('content-type')?.startsWith('audio/pcm')) throw new Error('Invalid audio stream');
          const stream = response.body.getReader();
          let bytes = 0;
          try {
            while (current()) {
              const { done, value } = await stream.read();
              if (!current()) return;
              if (done) break;
              bytes += value.length;
              if (bytes > 8 * 1024 * 1024) throw new Error('Audio too large');
              if (player.append(value)) update({ messageId, status: 'reading', error: '' });
            }
            if (!bytes) throw new Error('Empty audio');
          } finally { await stream.cancel().catch(() => {}); stream.releaseLock(); }
          await player.finish();
          if (!current()) return;
        }
        if (current()) stop();
      } catch {
        if (current()) fail('Smooth speech could not finish. Please try again.');
      }
      return;
    }
    audio = new AudioClass();
    const player = audio;
    const play = async () => {
      if (!current()) return;
      try {
        // Called directly by Resume after a browser blocks delayed autoplay.
        await player.play();
        if (current()) update({ messageId, status: 'reading', error: '' });
      } catch (error) {
        if (!current()) return;
        if (error?.name === 'NotAllowedError') update({ messageId, status: 'paused', error: 'Your audio is ready. Tap Play audio to listen.' });
        else fail('Audio could not play. Please try again.');
      }
    };
    player.onerror = () => { if (current()) { releaseUrl(); fail('Audio could not play. Please try again.'); } };
    async function next() {
      if (!current()) return;
      releaseUrl();
      if (index >= chunks.length) {
        player.onended = player.onerror = null;
        player.removeAttribute('src');
        player.load();
        generation++;
        audio = null;
        controller = null;
        update({ messageId: null, status: 'idle', error: '' });
        return;
      }
      update({ messageId, status: 'loading', error: '' });
      try {
        const response = await fetchImpl(`${base}/api/speech`, { method: 'POST',
          headers: { 'Content-Type': 'application/json' }, signal: requestController.signal,
          body: JSON.stringify({ text: chunks[index++], voice, language: code, consent: true }),
        });
        if (!current()) return;
        if (!response.ok) {
          const message = await responseError(response);
          if (current()) fail(message);
          return;
        }
        if (!response.headers.get('content-type')?.startsWith('audio/wav')) throw new Error('Invalid audio');
        const blob = await response.blob();
        if (!current()) return;
        if (!blob.size || blob.size > 8 * 1024 * 1024) throw new Error('Invalid audio');
        audioUrl = urls.createObjectURL(blob);
        player.src = audioUrl;
        await play();
      } catch {
        if (current()) fail('Natural speech could not connect. Please try again.');
      }
    }
    player.onended = next;
    player.resumeSpeech = play;
    await next();
  }

  return {
    supported: cloudSupported || deviceReader.supported,
    cloudSupported,
    deviceSupported: deviceReader.supported,
    hasConsent: () => consent,
    allowNaturalVoice: () => { consent = true; },
    start, stop,
    resume(messageId) { if (state.messageId === messageId && state.status === 'paused') return audio?.resumeSpeech(); },
    snapshot: () => state,
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    dispose() { stop(); deviceReader.dispose(); listeners.clear(); },
  };
}
