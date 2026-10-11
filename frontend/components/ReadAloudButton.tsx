import React, { useEffect, useState } from 'react';
import { Volume2, Square, ChevronDown } from 'lucide-react';
import type { createAnswerReader } from '../lib/answerReader.js';

type Reader = ReturnType<typeof createAnswerReader>;

export default function ReadAloudButton({ reader, messageId, language, disabled, getText }: {
  reader: Reader;
  messageId: string;
  language?: string;
  disabled: boolean;
  getText: () => string;
}) {
  const [state, setState] = useState(reader.snapshot);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [voice, setVoice] = useState(reader.cloudSupported ? 'Sulafat' : 'device');
  useEffect(() => reader.subscribe(setState), [reader]);
  useEffect(() => () => reader.stop(messageId), [reader, messageId]);
  const ownState = state.messageId === messageId;
  const active = ownState && ['loading', 'reading', 'paused'].includes(state.status);
  const loading = ownState && state.status === 'loading';
  const paused = ownState && state.status === 'paused';
  const error = ownState ? state.error : '';
  const listen = (selectedVoice: string) => {
    setOptionsOpen(false);
    void reader.start({ messageId, text: getText(), language, voice: selectedVoice });
  };
  return <>
    <button type="button" className={`chat-message-action ${active ? 'is-reading' : ''}`}
      aria-label={paused ? 'Play prepared audio' : active ? 'Stop reading aloud' : 'Read answer aloud'} aria-pressed={active}
      disabled={disabled || !reader.supported} title="Read this answer aloud"
      onClick={() => {
        if (paused) { void reader.resume(messageId); return; }
        if (active) { reader.stop(messageId); return; }
        if (voice !== 'device' && !reader.hasConsent()) { setOptionsOpen(true); return; }
        listen(voice);
      }}>
      {active && !paused ? <Square size={13} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
      {paused ? 'Play audio' : loading ? 'Stop preparing' : active ? 'Stop reading' : 'Read aloud'}
    </button>
    <button type="button" className="chat-message-action" aria-label="Choose a reading voice" aria-expanded={optionsOpen}
      disabled={disabled || !reader.supported} onClick={() => setOptionsOpen(open => !open)}>
      <ChevronDown size={13} aria-hidden="true" />
    </button>
    {optionsOpen && <div className="chat-speech-options-row"><div className="chat-speech-options">
      <label className="chat-speech-voice">Reading voice
        <select value={voice} onChange={event => setVoice(event.target.value)}>
          <option value="Sulafat" disabled={!reader.cloudSupported}>Sulafat · Warm</option>
          <option value="Algieba" disabled={!reader.cloudSupported}>Algieba · Smooth</option>
          <option value="device" disabled={!reader.deviceSupported}>Device voice</option>
        </select>
      </label>
      <p>{voice === 'device' ? 'Uses an installed voice on your device.'
        : 'AI-generated voice. This answer is sent to Google for audio. Its free service may use the text to improve products. Avoid private case details.'}</p>
      <div className="chat-speech-option-actions">
        <button type="button" className="chat-message-action is-reading" disabled={disabled || (voice === 'device' ? !reader.deviceSupported : !reader.cloudSupported)}
          onClick={() => { if (voice !== 'device') reader.allowNaturalVoice(); listen(voice); }}>
          <Volume2 size={14} aria-hidden="true" />{voice === 'device' ? 'Listen on device' : 'Listen with AI voice'}
        </button>
        {active && <button type="button" className="chat-message-action" onClick={() => reader.stop(messageId)}>Stop</button>}
        <button type="button" className="chat-message-action" onClick={() => setOptionsOpen(false)}>Close</button>
      </div>
    </div></div>}
    {error && <span role="status" className="chat-speech-notice">{error}</span>}
  </>;
}
