import React, { useEffect, useState, useRef, useCallback } from 'react';
import { auth } from './firebaseConfig';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [user] = useState(auth.currentUser);
  const [userRole, setUserRole] = useState<string>('citizen');
  const [loading, setLoading] = useState(true);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [rainActive, setRainActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync user to Supabase and load sessions on mount
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      try {
        // Upsert user profile in Supabase
        const provider = user.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password';
        const profileRes = await fetch(`${API}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, email: user.email, role: 'citizen', auth_provider: provider }),
        });
        const profile = await profileRes.json();
        if (profile.role) setUserRole(profile.role);

        // Load sessions
        await loadSessions();
      } catch (err) {
        console.warn('Init failed:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user]);

  // Load messages when session changes
  useEffect(() => {
    if (!activeSessionId) { setMessages([]); return; }
    loadMessages(activeSessionId);
  }, [activeSessionId]);

  // Auto-scroll on new messages
  useEffect(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages]);

  const loadSessions = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/api/sessions/${user.uid}`);
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Sessions load failed:', err);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`${API}/api/messages/${sessionId}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Messages load failed:', err);
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this consultation? This cannot be undone.')) return;
    try {
      await fetch(`${API}/api/sessions/${sessionId}`, { method: 'DELETE' });
      if (activeSessionId === sessionId) { setActiveSessionId(null); setMessages([]); }
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const sendMessage = async () => {
    if (!currentPrompt.trim() || isAnalysing || !user) return;

    const prompt = currentPrompt;
    setCurrentPrompt('');
    setIsAnalysing(true);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      content: prompt,
      sender: 'user',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          sessionId: activeSessionId,
          message: prompt,
          role: userRole,
          history: messages,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Set session if new
      if (!activeSessionId && data.sessionId) {
        setActiveSessionId(data.sessionId);
        await loadSessions();
      }

      // Reload messages from Supabase for accuracy
      await loadMessages(data.sessionId || activeSessionId!);

    } catch (err) {
      console.error('Chat failed:', err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        content: 'JusticeHub encountered an error. Please try again.',
        sender: 'ai',
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setIsAnalysing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center font-mono">
      <div className="w-12 h-12 border-2 border-legal-gold/20 border-t-legal-gold rounded-full animate-spin mb-6"></div>
      <div className="text-legal-gold text-[10px] font-black uppercase tracking-widest animate-pulse">Entering JusticeHub...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070A] flex text-white relative overflow-hidden h-screen">
      {rainActive && <RainEffect />}

      {/* Sidebar */}
      <aside className="w-80 bg-white/[0.01] border-r border-white/5 flex flex-col hidden lg:flex z-20 backdrop-blur-3xl shrink-0">
        <div className="p-6 border-b border-white/5">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-legal-gold/50 transition-all"
          >
            <svg className="w-4 h-4 text-legal-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            New Session
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600 mb-4 ml-2">Consultation Logs</div>
          {sessions.map(s => (
            <div
              key={s.id}
              className={`group relative flex items-center rounded-xl border transition-all ${activeSessionId === s.id ? 'bg-legal-gold/10 border-legal-gold/30' : 'border-transparent hover:bg-white/[0.03]'}`}
            >
              <button
                onClick={() => setActiveSessionId(s.id)}
                className={`flex-1 text-left p-4 text-[10px] font-bold truncate ${activeSessionId === s.id ? 'text-legal-gold' : 'text-neutral-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <svg className={`w-3.5 h-3.5 shrink-0 ${activeSessionId === s.id ? 'text-legal-gold' : 'text-neutral-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                  <span className="truncate uppercase tracking-wider">{s.title}</span>
                </div>
              </button>
              <button
                onClick={(e) => deleteSession(s.id, e)}
                className="opacity-0 group-hover:opacity-100 pr-3 text-neutral-600 hover:text-red-500 transition-all shrink-0"
                title="Delete consultation"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 space-y-3">
          <button
            onClick={() => setRainActive(!rainActive)}
            className={`w-full py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${rainActive ? 'bg-legal-gold text-white shadow-lg' : 'bg-white/5 text-neutral-500 hover:text-white border border-white/5'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25M8 16v6M12 18v4M16 16v6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {rainActive ? 'Rain: On' : 'Rain: Off'}
          </button>
          <button onClick={() => auth.signOut()} className="w-full py-3 text-[9px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors">
            Terminate
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col relative z-10 bg-[#05070A]/50 backdrop-blur-md">
        <header className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 z-30 bg-[#05070A]/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-legal-gold flex items-center justify-center">
              <span className="text-white text-[10px] font-black">J</span>
            </div>
            <div>
              <div className="text-[9px] font-black text-legal-gold uppercase tracking-[0.4em] mb-0.5">
                JusticeHub Node: {userRole}
              </div>
              <div className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-2">
                <span>{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                <span className="text-neutral-500">KGL_JUSTICEHUB_01</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Sovereign Link Verified</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-20">
              <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-10 shadow-2xl">
                <svg className="w-12 h-12 text-legal-gold opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" /><path d="M2 17L12 22L22 17" /><path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white/40 mb-4">Awaiting Consultation</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-600 leading-relaxed">
                Consult JusticeHub on Rwandan Law, Policy, or Personal Growth.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full space-y-10">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onEdit={(text) => setCurrentPrompt(text)}
                />
              ))}
              {isAnalysing && (
                <div className="flex gap-6 justify-start">
                  <div className="w-10 h-10 rounded-2xl bg-legal-gold flex items-center justify-center shrink-0 shadow-xl shadow-legal-gold/20 mt-1">
                    <span className="text-white text-[10px] font-black">J</span>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-legal-gold animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={chatEndRef} className="h-4" />
        </div>

        <div className="p-6 md:p-10 border-t border-white/5 bg-[#05070A]/95 backdrop-blur-3xl sticky bottom-0">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-legal-gold/0 via-legal-gold/20 to-legal-gold/0 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Consult JusticeHub..."
              className="relative w-full bg-[#0d0f14] border border-white/10 rounded-[2.2rem] py-6 px-8 pr-20 text-sm md:text-base font-medium focus:border-legal-gold/50 outline-none transition-all resize-none h-[88px] custom-scrollbar focus:shadow-[0_0_50px_rgba(197,160,89,0.05)]"
            />
            <button
              onClick={sendMessage}
              disabled={isAnalysing || !currentPrompt.trim()}
              className="absolute right-4 bottom-4 p-4 bg-legal-gold text-white rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 group/btn"
            >
              <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9-7-9-7M3 12h18"/></svg>
            </button>
          </div>
          <div className="mt-5 text-center">
            <span className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.8em]">
              Republic of Rwanda • JusticeHub AI Node
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message; onEdit: (text: string) => void }> = ({ message: m, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(m.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [m.content]);

  return (
    <div className={`flex gap-6 animate-fade-in-up ${m.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
      {m.sender === 'ai' && (
        <div className="w-10 h-10 rounded-2xl bg-legal-gold flex items-center justify-center shrink-0 shadow-xl shadow-legal-gold/20 mt-1">
          <span className="text-white text-[10px] font-black">I</span>
        </div>
      )}
      <div className={`group relative max-w-[85%] ${m.sender === 'ai' ? 'w-full' : ''}`}>
        <div className={`p-6 md:p-8 rounded-[2rem] text-sm md:text-base font-medium leading-[1.6] ${m.sender === 'ai' ? 'bg-white/[0.03] border border-white/5 text-neutral-200' : 'bg-legal-gold text-white font-bold shadow-2xl shadow-legal-gold/10'}`}>
          {m.sender === 'ai' ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-lg font-black text-white uppercase tracking-tight mb-3 mt-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-base font-black text-white uppercase tracking-tight mb-2 mt-4">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm font-black text-legal-gold uppercase tracking-tight mb-2 mt-3">{children}</h3>,
                p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                strong: ({children}) => <strong className="font-black text-white">{children}</strong>,
                ul: ({children}) => <ul className="mb-3 space-y-1.5 list-none">{children}</ul>,
                ol: ({children}) => <ol className="mb-3 space-y-1.5 list-decimal list-inside">{children}</ol>,
                li: ({children}) => <li className="flex gap-2 items-start"><span className="text-legal-gold shrink-0 mt-1">›</span><span>{children}</span></li>,
                blockquote: ({children}) => <blockquote className="border-l-2 border-legal-gold/40 pl-4 my-3 text-neutral-400 italic">{children}</blockquote>,
                code: ({children}) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-legal-gold text-xs font-mono">{children}</code>,
                hr: () => <hr className="border-white/10 my-4" />,
              }}
            >
              {m.content}
            </ReactMarkdown>
          ) : (
            <div className="whitespace-pre-wrap">{m.content}</div>
          )}
        </div>

        {/* Action buttons */}
        <div className={`flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${m.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
          {m.sender === 'ai' && (
            <button
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
            >
              {copied ? (
                <><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>Copied</>
              ) : (
                <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy</>
              )}
            </button>
          )}
          {m.sender === 'user' && (
            <button
              onClick={() => onEdit(m.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
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
  <div className="fixed inset-0 z-50 pointer-events-none">
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
