import React, { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import type { createSpeechReader } from '../lib/speechReader.js';

type Reader = ReturnType<typeof createSpeechReader>;

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
  const reading = state.messageId === messageId && state.status === 'reading';
  const error = state.messageId === messageId ? state.error : '';
  return <>
    <button type="button" className={`chat-message-action ${reading ? 'is-reading' : ''}`}
      aria-label={reading ? 'Stop reading aloud' : 'Read answer aloud'} aria-pressed={reading}
      disabled={disabled || !reader.supported} title={reader.supported ? 'Read aloud with a device voice' : 'Read aloud is not supported in this browser'}
      onClick={() => reading ? reader.stop(messageId) : reader.start({ messageId, text: getText(), language })}>
      {reading ? <Square size={13} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
      {reading ? 'Stop reading' : 'Read aloud'}
    </button>
    {error && <span role="status" className="chat-speech-notice">{error}</span>}
  </>;
}
