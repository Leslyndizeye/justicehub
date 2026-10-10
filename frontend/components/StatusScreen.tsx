import React, { useEffect, useRef } from 'react';
import { ArrowRight, RotateCw, Scale, WifiOff, LockKeyhole, Search } from 'lucide-react';
import { recoveryState } from '../lib/recoveryState.js';
import './statusScreen.css';

type Recovery = ReturnType<typeof recoveryState>;
type Props = {
  state: Recovery;
  compact?: boolean;
  busy?: boolean;
  onRetry?: () => void;
  onSignIn?: () => void;
  onBack?: () => void;
  backLabel?: string;
  autoFocus?: boolean;
};

export function StatusPanel({ state, compact = false, busy = false, onRetry, onSignIn, onBack, backLabel = 'New conversation', autoFocus = false }: Props) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (autoFocus) title.current?.focus({ preventScroll: true }); }, [autoFocus, state.kind]);
  const Icon = state.kind === 'not-found' ? Search : state.kind === 'forbidden' || state.kind === 'sign-in' ? LockKeyhole
    : state.kind === 'unavailable' || state.kind === 'offline' ? WifiOff : Scale;
  return (
    <section className={`justice-status-panel ${compact ? 'is-compact' : ''}`} aria-label={state.title}>
      <div className="justice-status-symbol" aria-hidden="true"><Icon size={compact ? 22 : 36} strokeWidth={1.5} /></div>
      {!compact && <span className="justice-status-code" aria-hidden="true">{state.code}</span>}
      <h2 ref={title} tabIndex={autoFocus ? -1 : undefined}>{state.title}</h2>
      <p>{state.description}</p>
      <div className="justice-status-actions">
        {state.kind === 'sign-in' && onSignIn ? <button type="button" className="justice-status-primary" onClick={onSignIn}>Sign in again<ArrowRight size={16} aria-hidden="true" /></button>
          : state.retryable && onRetry && <button type="button" className="justice-status-primary" onClick={onRetry} disabled={busy}><RotateCw className={busy ? 'is-spinning' : ''} size={16} aria-hidden="true" />{busy ? 'Trying again…' : 'Try again'}</button>}
        {onBack && <button type="button" className="justice-status-secondary" onClick={onBack}>{backLabel}<ArrowRight size={16} aria-hidden="true" /></button>}
      </div>
      <span className="justice-status-announcement" role="status">{busy ? 'Trying to reconnect.' : state.title}</span>
    </section>
  );
}

export default function StatusScreen({ state, homeHref = '/', workspaceHref, onRetry }: { state: Recovery; homeHref?: string; workspaceHref?: string; onRetry?: () => void }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${state.code} · JusticeHub`;
    return () => { document.title = previous; };
  }, [state.code]);
  return (
    <main className="justice-status-page">
      <a href={homeHref} className="justice-status-brand"><Scale size={25} strokeWidth={1.5} aria-hidden="true" />JusticeHub</a>
      <div className="justice-status-page-content">
        <StatusPanel state={state} autoFocus onRetry={onRetry} />
        <nav className="justice-status-navigation" aria-label="Recovery links">
          <a href={homeHref}>Back to home<ArrowRight size={16} aria-hidden="true" /></a>
          {workspaceHref && <a href={workspaceHref}>Open your workspace<ArrowRight size={16} aria-hidden="true" /></a>}
        </nav>
      </div>
      <span className="justice-status-footer">A clearer way forward.</span>
    </main>
  );
}
