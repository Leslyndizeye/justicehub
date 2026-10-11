import { createSpeechReader, speechChunks } from './speechReader.js';
import { speechLanguage } from './speechLanguage.js';

export function createAnswerReader({ base = '', fetchImpl = fetch, AudioClass = globalThis.Audio,
  urls = globalThis.URL, deviceReader = createSpeechReader() } = {}) {
  const cloudSupported = Boolean(AudioClass && urls?.createObjectURL && urls?.revokeObjectURL);
  let state = { messageId: null, status: 'idle', error: '' };
  let generation = 0, controller = null, audio = null, audioUrl = null, mode = null;
  let consent = false;
  let unsubscribeDevice = null;
  const listeners = new Set();
  const update = next => { state = next; for (const listener of listeners) listener(state); };
  const releaseUrl = () => { if (audioUrl) urls.revokeObjectURL(audioUrl); audioUrl = null; };

  function stop(messageId) {
    if (messageId && state.messageId !== messageId) return;
    generation++;
    controller?.abort();
    controller = null;
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

  async function start({ messageId, text, language = 'auto', voice = 'Sulafat' }) {
    stop();
    if (voice === 'device') {
      mode = 'device';
      unsubscribeDevice = deviceReader.subscribe(next => { if (mode === 'device') update(next); });
      deviceReader.start({ messageId, text, language });
      return;
    }
    const fail = error => { stop(); update({ messageId, status: 'error', error }); };
    if (!cloudSupported) { fail('Natural voices are not supported in this browser. Choose a device voice instead.'); return; }
    if (!consent) { fail('Choose a voice and confirm before sending this answer for audio.'); return; }
    if (!['Sulafat', 'Algieba'].includes(voice)) { fail('Please choose an available voice.'); return; }
    if (typeof text !== 'string' || text.length > 12000) { fail('This answer is too long for natural speech. Choose a device voice instead.'); return; }
    const chunks = speechChunks(text, 2400);
    if (!chunks.length) return;
    mode = 'cloud';
    const activeGeneration = generation;
    const requestController = new AbortController();
    controller = requestController;
    const code = speechLanguage(text, language);
    audio = new AudioClass();
    const player = audio;
    let index = 0;
    const current = () => activeGeneration === generation && !requestController.signal.aborted;
    const play = async () => {
      if (!current()) return;
      try {
        // Called directly by Resume after a browser blocks delayed autoplay.
        await player.play();
        if (current()) update({ messageId, status: 'reading', error: '' });
      } catch (error) {
        if (!current()) return;
        if (error?.name === 'NotAllowedError') update({ messageId, status: 'paused', error: 'Your audio is ready. Tap Play audio to listen.' });
        else fail('Audio could not play. Try again or choose a device voice.');
      }
    };
    player.onerror = () => { if (current()) { releaseUrl(); fail('Audio could not play. Try again or choose a device voice.'); } };
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
          let body = {}; try { body = await response.json(); } catch { /* Never display raw service errors. */ }
          const message = response.status === 401 ? 'Please sign in again to use natural voices.'
            : response.status === 429 ? 'Natural speech is busy or has reached its free usage limit. Try later or choose a device voice.'
            : body.code === 'speech_unconfigured' ? 'Natural voices are not available yet. Choose a device voice instead.'
            : 'Natural speech is temporarily unavailable. Try later or choose a device voice.';
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
        if (current()) fail('Natural speech could not connect. Try again or choose a device voice.');
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
