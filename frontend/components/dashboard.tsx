import { createAuthenticatedFetch } from '../lib/authenticatedFetch.js';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { auth } from './firebaseConfig';
import ChatMarkdown from './ChatMarkdown';
import { useProgressiveText } from './useProgressiveText';
import { readChatStream } from '../lib/chatStream.js';
import { captureMemory, localMemoryReply, nameRecallRequest, normalizeMemory, readLocalMemory, recoverPreviousChatName, writeLocalMemory } from '../lib/userMemory.js';
import { chatReplyError, rateLimitDeadline, rateLimitNotice, chatRequestAllowed, cooldownAfterReply, chatFailureNotice } from '../lib/chatErrors.js';
import { useNavigate, useParams } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { conversationPath, fetchOwnSessions } from '../lib/chatSessions.js';
import { apiBaseUrl } from '../lib/apiBase.js';
import { createAccountMemory, initialAccountMemory } from '../lib/accountMemory.js';
import { Scale, Plus, MessageSquare, Menu, X, ArrowUp, CloudRain, LogOut } from 'lucide-react';
import './chatGlass.css';
import { createSpeechReader } from '../lib/speechReader.js';
import ReadAloudButton from './ReadAloudButton';
import { StatusPanel } from './StatusScreen';
import { recoveryState, requestError } from '../lib/recoveryState.js';

const API = apiBaseUrl(import.meta.env.VITE_API_URL, import.meta.env.DEV);
type ReplyLanguage = 'auto' | 'rw' | 'en' | 'fr';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
  streaming?: boolean;
  animate?: boolean;
  stopped?: boolean;
  error?: string;
  webSearch?: boolean;
  status?: string;
  replyLanguage?: ReplyLanguage;
  memoryKind?: string;
}

interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

const Dashboard: React.FC<{ user: User; role: string }> = ({ user, role: userRole }) => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const activeSessionId = sessionId || null;
  const fetch = useMemo(() => createAuthenticatedFetch({ getUser: () => user }), [user]);
  const speechReader = useMemo(() => createSpeechReader(), []);
  useEffect(() => { speechReader.stop(); }, [speechReader, activeSessionId]);
  useEffect(() => () => speechReader.dispose(), [speechReader]);
  const [loading, setLoading] = useState(true);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [initialMemory] = useState(() => {
    try { return user ? readLocalMemory(user.uid, localStorage) : normalizeMemory(null); }
    catch { return normalizeMemory(null); }
  });
  const memoryRef = useRef(initialMemory);
  const nameLookupStatus = useRef('unchecked');
  const [memoryPersistent, setMemoryPersistent] = useState(() => {
    try { localStorage.getItem('justicehub-storage-check'); return true; } catch { return false; }
  });
  const [memoryCloudState, setMemoryCloudState] = useState('loading');
  const cloudRevision = useRef(0);
  const cloudReady = useRef(false);
  const cloudQueue = useRef<Promise<unknown>>(Promise.resolve());
  const cloudWriteSequence = useRef(0);
  const memoryLifecycle = useRef(new AbortController());
  const accountMemory = useMemo(() => createAccountMemory({ base: API, getToken: (force: boolean) => user.getIdToken(force) }), [user]);
  const [rateLimit, setRateLimit] = useState<{ until: number; language: ReplyLanguage } | null>(null);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsReady, setSessionsReady] = useState(false);
  const [sessionsError, setSessionsError] = useState<ReturnType<typeof recoveryState> | null>(null);
  const [sessionsReloading, setSessionsReloading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<ReturnType<typeof recoveryState> | null>(null);
  const [messageLoadAttempt, setMessageLoadAttempt] = useState(0);
  const sessionsRef = useRef<ChatSession[]>([]);
  const sessionsRequest = useRef(0);
  const [rainActive, setRainActive] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyPanelRef = useRef<HTMLElement>(null);
  const historyToggleRef = useRef<HTMLButtonElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatViewportRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);
  const streamRequest = useRef<AbortController | null>(null);
  const skipSessionLoad = useRef<string | null>(null);

  useEffect(() => () => { streamRequest.current?.abort(); }, []);

  useEffect(() => {
    if (!historyOpen) return;
    const frame = requestAnimationFrame(() => {
      // Wait for the drawer's visible styles before moving keyboard focus into it.
      historyPanelRef.current?.getBoundingClientRect();
      historyPanelRef.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    });
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setHistoryOpen(false); };
    const desktop = window.matchMedia('(min-width: 960px)');
    const closeOnDesktop = () => { if (desktop.matches) setHistoryOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
      if (!desktop.matches) historyToggleRef.current?.focus();
    };
  }, [historyOpen]);

  const keepHistoryFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!historyOpen || event.key !== 'Tab') return;
    const panel = historyPanelRef.current;
    if (!panel) return;
    const buttons = panel.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    const first = buttons.item(0);
    const last = buttons.item(buttons.length - 1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };

  useEffect(() => {
    if (!rateLimit) { setWaitSeconds(0); return; }
    const tick = () => setWaitSeconds(Math.max(0, Math.ceil((rateLimit.until - Date.now()) / 1000)));
    tick();
    if (rateLimit.until <= Date.now()) return;
    const timer = window.setInterval(() => {
      tick();
      if (rateLimit.until <= Date.now()) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [rateLimit]);

  const saveMemory = async (next: ReturnType<typeof normalizeMemory>) => {
    const normalized = normalizeMemory(next);
    if (normalized.recoverPreviousName !== memoryRef.current.recoverPreviousName || normalized.enabled !== memoryRef.current.enabled) nameLookupStatus.current = 'unchecked';
    memoryRef.current = normalized;

    let stored = false;
    try { stored = Boolean(user && writeLocalMemory(user.uid, normalized, localStorage)); } catch { /* Private storage may be unavailable. */ }
    setMemoryPersistent(stored);

    if (!cloudReady.current) return stored;
    const lifecycle = memoryLifecycle.current;
    const writeSequence = ++cloudWriteSequence.current;
    setMemoryCloudState('saving');
    const job = cloudQueue.current.then(async () => {
      if (!cloudReady.current || lifecycle.signal.aborted) return stored;
      try {
        const saved = await accountMemory.write(normalized, cloudRevision.current, AbortSignal.any([lifecycle.signal, AbortSignal.timeout(15000)]));
        if (lifecycle.signal.aborted) return stored;
        cloudRevision.current = saved.revision;
        if (writeSequence === cloudWriteSequence.current) {
          setMemoryCloudState('saved');

        }
        return true;
      } catch (error) {
        if (lifecycle.signal.aborted) return stored;
        cloudReady.current = false;
        const conflict = error instanceof Error && 'status' in error && error.status === 409;
        setMemoryCloudState(conflict ? 'conflict' : 'local');
        console.warn('Account memory save failed:', conflict ? 'memory_conflict' : 'memory_unavailable');

        return stored;
      }
    });
    cloudQueue.current = job.catch(() => {});
    return job;
  };

  useEffect(() => {
    const controller = new AbortController();
    memoryLifecycle.current = controller;
    cloudReady.current = false;
    setMemoryCloudState('loading');

    void (async () => {
      try {
        const remote = await accountMemory.read(AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]));
        if (controller.signal.aborted) return;
        const next = initialAccountMemory(remote, memoryRef.current);
        cloudRevision.current = remote.revision;
        cloudReady.current = true;
        memoryRef.current = next;

        nameLookupStatus.current = 'unchecked';
        try { setMemoryPersistent(writeLocalMemory(user.uid, next, localStorage)); } catch { setMemoryPersistent(false); }
        if (remote.revision === 0) await saveMemory(next);
        else { setMemoryCloudState('saved'); }
      } catch (error) {
        if (controller.signal.aborted) return;
        setMemoryCloudState('local');
        console.warn('Account memory load failed:', error instanceof Error && 'code' in error ? error.code : 'memory_unavailable');
      }
    })();
    return () => { controller.abort(); cloudReady.current = false; };
  }, [accountMemory, user.uid]);

  useEffect(() => {
    if (!user) return;
    const update = (event: StorageEvent) => {
      if (event.key !== `justicehub-memory-v1:${user.uid}`) return;
      try {
        const next = readLocalMemory(user.uid, localStorage);
        memoryRef.current = next;

        cloudReady.current = false;
        setMemoryCloudState('conflict');
        console.warn('Account memory changed in another tab; refresh to synchronize.');
      } catch { /* Another tab may have disabled storage. */ }
    };
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, [user]);

  const scrollToReply = useCallback(() => {
    const viewport = chatViewportRef.current;
    if (viewport && shouldAutoScroll.current) viewport.scrollTop = viewport.scrollHeight;
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToReply();
  }, [messages, scrollToReply]);

  const loadSessions = useCallback(async (signal?: AbortSignal) => {
    const request = ++sessionsRequest.current;
    setSessionsReloading(true);
    try {
      const timeout = AbortSignal.timeout(10000);
      const owned = await fetchOwnSessions(API, user.uid, signal ? AbortSignal.any([signal, timeout]) : timeout, fetch);
      if (signal?.aborted || request !== sessionsRequest.current) return;
      sessionsRef.current = owned;
      setSessions(owned);
      setSessionsReady(true);
      setSessionsError(null);
      return owned;
    } catch (err) {
      if (signal?.aborted || request !== sessionsRequest.current) return;
      setSessionsError(recoveryState(err, { resource: 'history', online: navigator.onLine }));
      console.warn('Sessions load failed:', err);
    } finally {
      if (!signal?.aborted && request === sessionsRequest.current) setSessionsReloading(false);
    }
  }, [user.uid, fetch]);

  useEffect(() => {
    const reconnect = () => { void loadSessions(); };
    window.addEventListener('online', reconnect);
    return () => window.removeEventListener('online', reconnect);
  }, [loadSessions]);

  const loadMessages = useCallback(async (id: string, signal: AbortSignal) => {
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const res = await fetch(`${API}/api/messages/${encodeURIComponent(id)}`, { signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]) });
      if (!res.ok) throw requestError(res.status);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid message response.');
      if (!signal.aborted) setMessages(data.filter(message => message.user_id === user.uid));
    } catch (err) {
      if (signal.aborted) return;
      setMessagesError(recoveryState(err, { resource: 'conversation', online: navigator.onLine }));
      console.warn('Messages load failed:', err);
    } finally {
      if (!signal.aborted) setMessagesLoading(false);
    }
  }, [user.uid, fetch]);

  // App already resolves the profile. Chat history loads independently on every sign-in.
  useEffect(() => {
    const controller = new AbortController();
    void loadSessions(controller.signal).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [loadSessions]);

  // The URL is the selected conversation, including on refresh and Back/Forward navigation.
  useEffect(() => {
    if (activeSessionId && skipSessionLoad.current === activeSessionId) {
      skipSessionLoad.current = null;
      return;
    }
    skipSessionLoad.current = null;
    const pending = streamRequest.current;
    streamRequest.current = null;
    pending?.abort();
    setIsAnalysing(false);
    setMessages([]);
    setMessagesError(null);
    setMessagesLoading(false);
    if (!activeSessionId || !sessionsReady) return;
    if (!sessionsRef.current.some(session => session.id === activeSessionId)) {
      setMessagesError(recoveryState(requestError(404), { resource: 'conversation' }));
      return;
    }
    const controller = new AbortController();
    void loadMessages(activeSessionId, controller.signal);
    return () => controller.abort();
  }, [activeSessionId, sessionsReady, loadMessages, messageLoadAttempt]);

  const startNewChat = () => {
    setHistoryOpen(false);
    const pending = streamRequest.current;
    streamRequest.current = null;
    pending?.abort();
    setIsAnalysing(false);
    shouldAutoScroll.current = true;
    navigate('/dashboard');
    setMessages([]);
  };

  const selectSession = (sessionId: string) => {
    setHistoryOpen(false);
    if (sessionId === activeSessionId) return;
    const pending = streamRequest.current;
    streamRequest.current = null;
    pending?.abort();
    setIsAnalysing(false);
    shouldAutoScroll.current = true;
    setMessages([]);
    navigate(conversationPath(sessionId));
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this consultation? This cannot be undone.')) return;
    try {
      const response = await fetch(`${API}/api/sessions/${sessionId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Conversation could not be deleted.');
      if (activeSessionId === sessionId) startNewChat();
      sessionsRef.current = sessionsRef.current.filter(s => s.id !== sessionId);
      setSessions(sessionsRef.current);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const sendMessage = async () => {
    if (!currentPrompt.trim() || streamRequest.current || !user || memoryCloudState === 'loading' || messagesLoading || activeSessionId && (!sessionsReady || messagesError)) return;

    const prompt = currentPrompt.trim();
    const controller = new AbortController();
    streamRequest.current = controller;
    shouldAutoScroll.current = true;
    const turnId = crypto.randomUUID();
    const replyId = `reply-${turnId}`;
    let responseLanguage: ReplyLanguage = 'auto';
    let blockedByCooldown = false;
    let fullText = '';
    let nextMemory = captureMemory(memoryRef.current, prompt);
    let persisted = JSON.stringify(nextMemory) !== JSON.stringify(memoryRef.current) ? await saveMemory(nextMemory) : memoryPersistent || cloudReady.current;
    if (controller.signal.aborted) { streamRequest.current = null; return; }
    const recall = nameRecallRequest(prompt, messages);
    const needsNameRecovery = Boolean(recall && nextMemory.enabled && nextMemory.recoverPreviousName && !nextMemory.items.some(item => item.kind === 'name') && nameLookupStatus.current !== 'checked');
    let localReply = needsNameRecovery ? null : localMemoryReply(prompt, nextMemory, user.displayName, persisted, messages, nameLookupStatus.current, cloudReady.current ? 'account' : 'browser');
    // Keep the draft and existing countdown instead of creating another failed
    // turn on every click. Memory actions and model-free casual replies work.
    if (!localReply && !needsNameRecovery && !chatRequestAllowed(prompt, rateLimit)) {
      streamRequest.current = null;
      return;
    }
    setCurrentPrompt('');
    setIsAnalysing(true);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `user-${turnId}`,
      content: prompt,
      sender: 'user',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg, {
      id: replyId, sender: 'ai', created_at: new Date().toISOString(),
      streaming: !localReply, animate: true,
      content: localReply?.reply || '',
      replyLanguage: (localReply?.language || 'auto') as ReplyLanguage,
      memoryKind: localReply?.kind,
    }]);

    try {
      if (needsNameRecovery) {
        try {
          const lookupSignal = AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]);
          const knownSessions = sessions.length ? sessions : await loadSessions(lookupSignal);
          if (!knownSessions) throw new Error('Conversations could not be loaded.');
          const recovered = await recoverPreviousChatName({ memory: nextMemory, uid: user.uid, sessions: knownSessions, signal: lookupSignal,
            fetchMessages: async (sessionId: string, signal: AbortSignal) => {
              const response = await fetch(`${API}/api/messages/${sessionId}`, { signal });
              if (!response.ok) throw new Error('Earlier messages could not be loaded.');
              return response.json();
            },
          });
          if (streamRequest.current !== controller) return;
          nameLookupStatus.current = recovered.status;
          // A delete or correction made while reading history must win over the lookup.
          if (JSON.stringify(memoryRef.current) === JSON.stringify(nextMemory) && JSON.stringify(nextMemory) !== JSON.stringify(recovered.memory)) {
            persisted = await saveMemory(recovered.memory);
          }
          nextMemory = memoryRef.current;
        } catch (error) {
          if (controller.signal.aborted) throw error;
          nameLookupStatus.current = 'failed';

        }
        if (streamRequest.current !== controller) return;
        localReply = localMemoryReply(prompt, nextMemory, user.displayName, persisted, messages, nameLookupStatus.current, cloudReady.current ? 'account' : 'browser');
      }
      if (localReply) {
        setMessages(prev => prev.map(m => m.id === replyId ? { ...m, content: localReply.reply, replyLanguage: localReply.language as ReplyLanguage, memoryKind: localReply.kind, streaming: false } : m));
        return;
      }
      if (!chatRequestAllowed(prompt, rateLimit)) {
        blockedByCooldown = true;
        const seconds = Math.ceil((rateLimit.until - Date.now()) / 1000);
        responseLanguage = rateLimit.language;
        throw chatReplyError({ status: 429, retryAfterSeconds: seconds, error: rateLimitNotice(seconds, rateLimit.language) });
      }
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          uid: user.uid,
          sessionId: activeSessionId,
          message: prompt,
          role: userRole,
          stream: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw chatReplyError({ ...data, status: res.status }, 'The message could not be sent. Please try again.');
      }
      const result = await readChatStream(res, (event: string, data: any) => {
        if (streamRequest.current !== controller) return;
        if (event === 'session' && ['auto', 'rw', 'en', 'fr'].includes(data.replyLanguage)) {
          responseLanguage = data.replyLanguage;
          setMessages(prev => prev.map(m => m.id === replyId ? { ...m, replyLanguage: data.replyLanguage } : m));
        }
        if (event === 'session' && data.sessionId !== activeSessionId) {
          skipSessionLoad.current = data.sessionId;
          const session = { id: data.sessionId, user_id: user.uid, title: prompt.slice(0, 60), created_at: new Date().toISOString() };
          sessionsRef.current = [session, ...sessionsRef.current.filter(item => item.id !== session.id)];
          setSessions(sessionsRef.current);
          setSessionsReady(true);
          navigate(conversationPath(data.sessionId), { replace: true });
          void loadSessions();
        }
        if (event === 'token' && typeof data.text === 'string') {
          fullText += data.text;
          setMessages(prev => prev.map(m => m.id === replyId ? { ...m, content: fullText } : m));
        }
        if (event === 'status' && typeof data.text === 'string') {
          setMessages(prev => prev.map(m => m.id === replyId ? { ...m, status: data.text, webSearch: data.webSearch === true } : m));
        }
      });
      if (streamRequest.current !== controller) return;
      setRateLimit(previous => cooldownAfterReply(prompt, previous));
      setMessages(prev => prev.map(m => m.id === replyId ? { ...m, content: result.reply, streaming: false } : m));
      void loadSessions();

    } catch (err) {
      if (streamRequest.current !== controller) return;
      const stopped = controller.signal.aborted;
      const deadline = !stopped ? rateLimitDeadline(err) : 0;
      if (deadline && !blockedByCooldown) setRateLimit(previous => ({ until: Math.max(previous?.until || 0, deadline), language: responseLanguage }));
      if (!stopped) console.error('Chat failed:', err);
      setMessages(prev => prev.map(m => m.id === replyId ? {
        ...m, streaming: false, stopped,
        error: stopped ? undefined : chatFailureNotice(err, responseLanguage),
      } : m));
      if (!stopped) setCurrentPrompt(current => current || prompt);
    } finally {
      if (streamRequest.current === controller) {
        streamRequest.current = null;
        setIsAnalysing(false);
      }
    }
  };

  if (loading) return (
    <div className="justice-chat chat-loading">
      <div className="chat-loading-card">
        <Scale size={30} aria-hidden="true" />
        <div className="chat-loading-spinner" aria-hidden="true" />
        <p role="status">Opening your workspace…</p>
      </div>
    </div>
  );

  const displayName = user.displayName || user.email?.split('@')[0] || 'Your account';
  const suggestions = ['Help me understand a legal document', 'Explain my rights in Rwanda', 'What does this legal term mean?'];
  // A history failure cannot prove that a conversation URL is missing.
  const conversationError = messagesError || (activeSessionId && !sessionsReady ? sessionsError : null);
  const conversationPending = messagesLoading || Boolean(activeSessionId && !sessionsReady && !sessionsError);
  const emptyConversation = !conversationPending && !conversationError && messages.length === 0;
  const signInAgain = () => {
    void auth.signOut().then(() => navigate('/auth', { state: { returnTo: conversationPath(activeSessionId) } }))
      .catch(() => console.warn('Sign-in recovery could not be opened.'));
  };
  const retryConversation = () => {
    if (!sessionsReady) void loadSessions();
    else setMessageLoadAttempt(attempt => attempt + 1);
  };

  return (
    <div className="justice-chat">
      <div className="chat-ambient" aria-hidden="true" />
      {rainActive && <RainEffect />}
      {historyOpen && <button type="button" className="chat-drawer-backdrop" aria-label="Close chat history" tabIndex={-1} onClick={() => setHistoryOpen(false)} />}

      <aside ref={historyPanelRef} id="chat-history" className={`chat-sidebar ${historyOpen ? 'is-open' : ''}`}
        role={historyOpen ? 'dialog' : undefined} aria-modal={historyOpen || undefined} aria-label="Chat history" onKeyDown={keepHistoryFocus}
        onTransitionEnd={(event: React.TransitionEvent<HTMLElement>) => {
          if (historyOpen && event.target === event.currentTarget && event.propertyName === 'transform' && !event.currentTarget.contains(document.activeElement)) {
            event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
          }
        }}>
        <div className="chat-brand">
          <div className="chat-brand-mark"><Scale size={25} strokeWidth={1.7} aria-hidden="true" /></div>
          <div><span className="chat-brand-name">JusticeHub</span><span className="chat-brand-subtitle">A clearer way forward</span></div>
          <button type="button" className="chat-icon-button chat-drawer-close" onClick={() => setHistoryOpen(false)} aria-label="Close chat history"><X size={20} /></button>
        </div>
        <button type="button" onClick={startNewChat} className="chat-new-button"><Plus size={18} aria-hidden="true" />New conversation</button>

        <nav className="chat-history-list custom-scrollbar" aria-label="Saved conversations">
          <div className="chat-section-label">Your conversations</div>
          {sessionsError && <div className="chat-history-recovery"><StatusPanel state={sessionsError} compact busy={sessionsReloading} onRetry={() => void loadSessions()} onSignIn={signInAgain} /></div>}
          {sessionsReady && !sessions.length && !sessionsError && <p className="chat-history-empty">Your saved chats will appear here.</p>}
          {sessions.map(s => (
            <div key={s.id} className={`chat-session ${activeSessionId === s.id ? 'is-active' : ''}`}>
              <button type="button" onClick={() => selectSession(s.id)} className="chat-session-link" aria-current={activeSessionId === s.id ? 'page' : undefined} title={s.title}>
                <MessageSquare size={17} strokeWidth={1.7} aria-hidden="true" /><span>{s.title}</span>
              </button>
              <button type="button" onClick={e => deleteSession(s.id, e)} className="chat-session-delete" title="Delete conversation" aria-label={`Delete ${s.title}`}>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          ))}
        </nav>

        <div className="chat-sidebar-bottom">
          <button type="button" onClick={() => setRainActive(active => !active)} className={`chat-ambient-button ${rainActive ? 'is-active' : ''}`} aria-pressed={rainActive}>
            <CloudRain size={17} aria-hidden="true" /><span>Ambient rain</span><span className="chat-toggle-track" aria-hidden="true"><span /></span>
          </button>
          <div className="chat-account">
            <div className="chat-account-avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</div>
            <div className="chat-account-text"><span>{displayName}</span><small>{userRole === 'citizen' ? 'Citizen account' : userRole}</small></div>
            <button type="button" onClick={() => auth.signOut()} className="chat-icon-button chat-signout" aria-label="Sign out" title="Sign out"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      <main className={`chat-workspace ${emptyConversation ? 'chat-workspace--empty' : ''}`} inert={historyOpen || undefined} aria-hidden={historyOpen || undefined}>
        <header className="chat-header">
          <div className="chat-header-left">
            <button ref={historyToggleRef} type="button" className="chat-icon-button chat-history-toggle" onClick={() => setHistoryOpen(open => !open)} aria-expanded={historyOpen} aria-controls="chat-history" aria-label="Open chat history"><Menu size={21} /></button>
            <h1>JusticeHub</h1>
          </div>
          <button type="button" onClick={startNewChat} className="chat-icon-button" aria-label="New conversation" title="New conversation"><Plus size={21} /></button>
        </header>


        <div ref={chatViewportRef} className="chat-viewport custom-scrollbar" onScroll={e => {
          const view = e.currentTarget;
          shouldAutoScroll.current = view.scrollHeight - view.scrollTop - view.clientHeight < 120;
        }}>
          {conversationPending ? <div role="status" className="chat-conversation-status">Loading conversation…</div>
            : conversationError ? <div className="chat-conversation-recovery"><StatusPanel state={conversationError} autoFocus busy={sessionsReloading} onRetry={retryConversation} onSignIn={signInAgain} onBack={startNewChat} /></div>
            : messages.length === 0 ? (
              <div className="chat-welcome">
                <h2>What’s on your <span>mind?</span></h2>
                <p>Make sense of Rwandan law, explore a question,<br className="chat-desktop-break" /> or simply start a conversation.</p>
              </div>
            ) : <div className="chat-messages">{messages.map(m => <MessageBubble key={m.id} message={m} reader={speechReader} onReveal={scrollToReply} onEdit={text => { setCurrentPrompt(text); composerRef.current?.focus(); }} />)}</div>}
          <div ref={chatEndRef} className="chat-scroll-end" />
        </div>

        {!conversationError && !conversationPending && <div className="chat-composer-area">
          {rateLimit && <div role="status" className="chat-quota-notice">{rateLimitNotice(waitSeconds, rateLimit.language)}</div>}
          <div className="chat-composer">
            <textarea ref={composerRef} value={currentPrompt} onChange={e => setCurrentPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              aria-label="Message JusticeHub" placeholder="Ask anything, in your own words…" className="chat-input custom-scrollbar" />
            <button type="button" onClick={() => isAnalysing ? streamRequest.current?.abort() : sendMessage()}
              disabled={!isAnalysing && (!currentPrompt.trim() || memoryCloudState === 'loading' || messagesLoading || Boolean(activeSessionId && (!sessionsReady || messagesError)))}
              aria-label={isAnalysing ? 'Stop response' : 'Send message'} title={isAnalysing ? 'Stop response' : 'Send message'} className="chat-send-button">
              {isAnalysing ? <span className="chat-stop-icon" /> : <ArrowUp size={22} strokeWidth={2} aria-hidden="true" />}
            </button>
          </div>
          {emptyConversation && <div className="chat-suggestions">
            {suggestions.map(prompt => <button key={prompt} type="button" onClick={() => { setCurrentPrompt(prompt); composerRef.current?.focus(); }}><MessageSquare size={15} aria-hidden="true" /><span>{prompt}</span></button>)}
          </div>}
        </div>}
      </main>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message; reader: ReturnType<typeof createSpeechReader>; onEdit: (text: string) => void; onReveal: () => void }> = ({ message: m, reader, onEdit, onReveal }) => {
  const [copied, setCopied] = useState(false);
  const contentElement = useRef<HTMLDivElement>(null);
  const visible = useProgressiveText(m.content, Boolean(m.animate));
  const writing = Boolean(m.streaming) || visible.length < m.content.length;
  useEffect(() => { onReveal(); }, [visible, onReveal]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contentElement.current?.innerText.trim() || m.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [m.content]);

  return (
    <div className={`chat-message chat-message--${m.sender}`}>
      {m.sender === 'ai' && (
        <div className="chat-assistant-avatar" aria-hidden="true">
          <Scale size={19} strokeWidth={1.6} />
        </div>
      )}
      <div className={`chat-message-shell chat-message-shell--${m.sender}`}>
        {m.sender === 'ai' && <div className="chat-message-meta">
          <span>JusticeHub</span>
          {(m.webSearch || (m.status && m.streaming && !m.content)) && <span role="status" className="font-normal text-legal-gold">{m.streaming && !m.content ? m.status : (m.replyLanguage === 'rw' ? 'Nashakishije kuri internet' : m.replyLanguage === 'fr' ? 'Recherche web effectuée' : 'Web search used')}</span>}
        </div>}
        <div ref={contentElement} aria-busy={m.sender === 'ai' && writing} className={`chat-message-body chat-message-body--${m.sender}`}>
          {m.sender === 'ai' ? (
            <>
              {m.streaming && !visible ? (
                <div role="status" className="flex items-center gap-2.5 py-2 text-sm text-neutral-400">
                  <span className="flex gap-1" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className="h-1.5 w-1.5 rounded-full bg-legal-gold motion-safe:animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />)}</span>
                  {m.replyLanguage === 'rw' ? 'Ndimo gutekereza…' : m.replyLanguage === 'fr' ? 'Je réfléchis…' : 'Thinking...'}
                </div>
              ) : <ChatMarkdown content={visible} />}
              {visible && writing && <span aria-label="Writing response" className="mt-2 inline-block h-4 w-1.5 rounded-sm bg-legal-gold motion-safe:animate-pulse" />}
              {m.stopped && <p className="mt-3 text-xs text-neutral-500">Response stopped.</p>}
              {m.error && <p role="alert" className="mt-3 text-sm text-red-300">{m.error}</p>}
            </>
          ) : (
            <div className="whitespace-pre-wrap">{m.content}</div>
          )}
        </div>

        {/* Action buttons */}
        <div className={`chat-message-actions chat-message-actions--${m.sender}`}>
          {m.sender === 'ai' && (
            <button
              onClick={copy}
              disabled={writing || !m.content}
              className="chat-message-action"
            >
              {copied ? (
                <><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>Copied</>
              ) : (
                <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy</>
              )}
            </button>
          )}
          {m.sender === 'ai' && <ReadAloudButton reader={reader} messageId={m.id} language={m.replyLanguage}
            disabled={writing || !m.content} getText={() => {
              const body = contentElement.current?.querySelector<HTMLElement>('.chat-markdown');
              if (!body) return '';
              const plain = body.cloneNode(true) as HTMLElement;
              // Read the explanation rather than spelling out program code or long URLs.
              plain.querySelectorAll('pre').forEach(block => block.remove());
              plain.querySelectorAll('a').forEach(link => { if (/^https?:\/\//i.test(link.textContent?.trim() || '')) link.remove(); });
              plain.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote').forEach(block => block.append(document.createTextNode(' ')));
              plain.querySelectorAll('br').forEach(breakElement => breakElement.replaceWith(document.createTextNode(' ')));
              return plain.textContent || '';
            }} />}
          {m.sender === 'user' && (
            <button
              onClick={() => onEdit(m.content)}
              className="chat-message-action"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const RainEffect = () => (
  <div className="chat-rain" aria-hidden="true">
    <div className="absolute inset-0 rain-container overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${0.8 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.1 + Math.random() * 0.3
          }}
        />
      ))}
    </div>
  </div>
);

export default Dashboard;
