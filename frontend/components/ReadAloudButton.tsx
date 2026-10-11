import React, { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
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
  useEffect(() => reader.subscribe(setState), [reader]);
  useEffect(() => () => reader.stop(messageId), [reader, messageId]);
  const ownState = state.messageId === messageId;
  const active = ownState && ['loading', 'reading', 'paused'].includes(state.status);
  const loading = ownState && state.status === 'loading';
  const paused = ownState && state.status === 'paused';
  const error = ownState ? state.error : '';
  return <>
    <button type="button" className={`chat-message-action ${active ? 'is-reading' : ''}`}
      aria-label={paused ? 'Play prepared audio' : active ? 'Stop reading aloud' : 'Read answer aloud'} aria-pressed={active}
      disabled={disabled || !reader.supported} title="Read this answer aloud"
      onClick={() => {
        if (paused) { void reader.resume(messageId); return; }
        if (active) { reader.stop(messageId); return; }
        const voice = reader.cloudSupported ? 'Algieba' : 'device';
        if (voice === 'Algieba') reader.allowNaturalVoice();
        void reader.start({ messageId, text: getText(), language, voice });
      }}>
      {active && !paused ? <Square size={13} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
      {paused ? 'Play audio' : loading ? 'Stop preparing' : active ? 'Stop reading' : 'Read aloud'}
    </button>
    {error && <span role="status" className="chat-speech-notice">{error}</span>}
    {loading && <span role="status" className="chat-speech-notice">Preparing smooth speech…</span>}
  </>;
}
