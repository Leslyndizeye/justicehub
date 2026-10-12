import React, { useEffect, useRef } from 'react';
import { Trash2, X } from 'lucide-react';

interface Props {
  title: string;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConversationDialog({ title, busy, error, onCancel, onConfirm }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // The native modal provides keyboard focus containment and makes the
    // background inert while retaining our own appearance and wording.
    dialog.showModal();
    cancelRef.current?.focus();
    return () => { dialog.close(); };
  }, []);

  return (
    <dialog ref={dialogRef} className="chat-delete-dialog" aria-labelledby="delete-conversation-title"
      aria-describedby="delete-conversation-description" aria-busy={busy}
      onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}>
      <button type="button" className="chat-delete-close chat-icon-button" aria-label="Close delete confirmation"
        onClick={onCancel} disabled={busy}><X size={19} aria-hidden="true" /></button>
      <div className="chat-delete-mark" aria-hidden="true"><Trash2 size={23} strokeWidth={1.7} /></div>
      <h2 id="delete-conversation-title">Delete conversation?</h2>
      <p id="delete-conversation-description">This will permanently delete <strong>“{title}”</strong> and its messages. This cannot be undone.</p>
      {error && <p className="chat-delete-error" role="alert">{error}</p>}
      <div className="chat-delete-actions">
        <button ref={cancelRef} type="button" className="chat-delete-cancel" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="button" className="chat-delete-confirm" onClick={onConfirm} disabled={busy}>
          {busy ? 'Deleting…' : 'Delete conversation'}
        </button>
      </div>
    </dialog>
  );
}
