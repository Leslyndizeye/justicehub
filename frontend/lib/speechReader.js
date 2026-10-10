import { speechLanguage } from './speechLanguage.js';

const languageNames = { en: 'English', fr: 'French', rw: 'Kinyarwanda' };

// Short utterances keep long replies manageable without dropping the rest of an answer.
export function speechChunks(text, limit = 360) {
  let remaining = String(text || '').replace(/\s+/gu, ' ').trim();
  const chunks = [];
  while (remaining.length > limit) {
    const prefix = remaining.slice(0, limit + 1);
    const sentenceEnds = [...prefix.matchAll(/[.!?;:]\s/gu)];
    let cut = sentenceEnds.at(-1)?.index + 1;
    if (!Number.isFinite(cut) || cut < limit / 2) cut = prefix.lastIndexOf(' ');
    if (cut < 1) cut = limit;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export function createSpeechReader({ synthesis = globalThis.speechSynthesis, Utterance = globalThis.SpeechSynthesisUtterance } = {}) {
  const supported = Boolean(synthesis?.getVoices && synthesis?.speak && synthesis?.cancel && Utterance);
  let state = { messageId: null, status: 'idle', error: '' };
  let generation = 0;
  let currentUtterance = null;
  // Some browsers populate the voice list asynchronously after its first read.
  if (supported) { try { synthesis.getVoices(); } catch { /* Retry on the user click. */ } }
  const listeners = new Set();
  const update = next => { state = next; for (const listener of listeners) listener(state); };

  function stop(messageId) {
    if (messageId && state.messageId !== messageId) return;
    generation++;
    if (currentUtterance) {
      currentUtterance.onstart = currentUtterance.onend = currentUtterance.onerror = null;
      currentUtterance = null;
      synthesis.cancel();
    }
    update({ messageId: null, status: 'idle', error: '' });
  }

  function start({ messageId, text, language = 'auto' }) {
    stop();
    const fail = error => update({ messageId, status: 'error', error });
    if (!supported) { fail('Read aloud is not supported in this browser.'); return; }
    const chunks = speechChunks(text);
    if (!chunks.length) return;
    const code = speechLanguage(text, language);
    let voice;
    try {
      // Never send an answer to a remote voice service or select another language silently.
      const voices = synthesis.getVoices().filter(voice => voice.localService && voice.lang.toLowerCase().split(/[-_]/)[0] === code);
      voice = voices.find(voice => voice.default) || voices[0];
    } catch { fail('The device voices could not be loaded. Try again.'); return; }
    if (!voice) {
      fail(`No installed ${languageNames[code]} voice is available on this device. Try again after enabling a device voice for this language.`);
      return;
    }
    const activeGeneration = generation;
    let index = 0;
    update({ messageId, status: 'reading', error: '' });
    function speakNext() {
      if (activeGeneration !== generation) return;
      if (index >= chunks.length) {
        currentUtterance = null;
        update({ messageId: null, status: 'idle', error: '' });
        return;
      }
      try {
        const utterance = new Utterance(chunks[index++]);
        currentUtterance = utterance;
        utterance.voice = voice;
        utterance.lang = voice.lang;
        utterance.rate = 1;
        utterance.onend = speakNext;
        utterance.onerror = event => {
          if (activeGeneration !== generation) return;
          currentUtterance = null;
          if (['canceled', 'interrupted'].includes(event.error)) update({ messageId: null, status: 'idle', error: '' });
          else fail('The answer could not be read aloud. Try again or check your device voice settings.');
        };
        synthesis.speak(utterance);
      } catch {
        currentUtterance = null;
        fail('The answer could not be read aloud. Try again or check your device voice settings.');
      }
    }
    speakNext();
  }

  return {
    supported, start, stop,
    snapshot: () => state,
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    dispose() { stop(); listeners.clear(); },
  };
}
