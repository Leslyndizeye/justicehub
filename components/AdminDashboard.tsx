import React, { useEffect, useState, useCallback } from 'react';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type Tab = 'overview' | 'users' | 'consultations' | 'chats' | 'legal-db';

interface Stats {
  totalUsers: number;
  totalSessions: number;
  totalMessages: number;
  totalDocuments: number;
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  auth_provider: string;
  created_at: string;
}

interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles: { email: string; role: string } | null;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
  user_id: string;
  profiles: { email: string; role: string; auth_provider: string } | null;
  chat_sessions: { title: string } | null;
}

interface LegalDoc {
  id: number;
  title: string;
  category: string;
  year: number | null;
  source: string;
}

// ── Role display config ───────────────────────────────────────────────────────
const ROLES: Record<string, { icon: string; label: string; sub: string; color: string; bg: string }> = {
  admin:    { icon: '🔑', label: 'Admin',    sub: 'System Administrator',  color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
  attorney: { icon: '⚖️', label: 'Attorney', sub: 'Bar Registered Counsel', color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  judge:    { icon: '🏛️', label: 'Judge',    sub: 'Judicial Official',      color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
  citizen:  { icon: '🤝', label: 'Citizen',  sub: 'Public Litigant',        color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

const RoleBadge: React.FC<{ role: string; showSub?: boolean }> = ({ role, showSub = false }) => {
  const r = ROLES[role] ?? { icon: '👤', label: role, sub: 'Identification Portal', color: 'text-neutral-400', bg: 'bg-white/5 border-white/10' };
  return showSub ? (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${r.bg}`}>
      <span className="text-base">{r.icon}</span>
      <div className="flex flex-col leading-tight">
        <span className={`text-[10px] font-black uppercase tracking-widest ${r.color}`}>{r.label}</span>
        <span className="text-[8px] text-neutral-500 uppercase tracking-widest">{r.sub}</span>
      </div>
    </div>
  ) : (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${r.bg} ${r.color}`}>
      {r.icon} {r.label}
    </span>
  );
};

const AuthBadge: React.FC<{ provider: string }> = ({ provider }) => {
  const isGoogle = provider === 'google';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${isGoogle ? 'bg-white/5 border-white/10 text-white' : 'bg-legal-gold/10 border-legal-gold/20 text-legal-gold'}`}>
      {isGoogle ? (
        <><svg className="w-3 h-3" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg> Google</>
      ) : (
        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Email</>
      )}
    </span>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-legal-gold/20 transition-all">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
    <div>
      <div className="text-3xl font-black text-white tracking-tighter">{value.toLocaleString()}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">{label}</div>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalSessions: 0, totalMessages: 0, totalDocuments: 0 });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [docs, setDocs] = useState<LegalDoc[]>([]);
  const [docSearch, setDocSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'user' | 'ai'>('all');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ type: 'user' | 'doc'; id: string | number; label: string } | null>(null);

  const fetchStats    = useCallback(async () => { const r = await fetch(`${API}/api/admin/stats`);     setStats(await r.json()); }, []);
  const fetchUsers    = useCallback(async () => { const r = await fetch(`${API}/api/admin/users`);     const d = await r.json(); setUsers(Array.isArray(d) ? d : []); }, []);
  const fetchSessions = useCallback(async () => { const r = await fetch(`${API}/api/admin/sessions`);  const d = await r.json(); setSessions(Array.isArray(d) ? d : []); }, []);
  const fetchChats    = useCallback(async () => { const r = await fetch(`${API}/api/admin/messages`);  const d = await r.json(); setChats(Array.isArray(d) ? d : []); }, []);
  const fetchDocs     = useCallback(async () => { const r = await fetch(`${API}/api/admin/documents`); const d = await r.json(); setDocs(Array.isArray(d) ? d : []); }, []);

  useEffect(() => {
    Promise.all([fetchStats(), fetchUsers(), fetchSessions(), fetchChats(), fetchDocs()])
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (uid: string, role: string) => {
    setUpdatingRole(uid);
    await fetch(`${API}/api/users/${uid}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    await fetchUsers();
    setUpdatingRole(null);
  };

  const deleteUser = async (uid: string) => {
    await fetch(`${API}/api/admin/users/${uid}`, { method: 'DELETE' });
    setUsers(prev => prev.filter(u => u.id !== uid));
    await fetchStats();
    setConfirm(null);
  };

  const deleteDoc = async (id: number) => {
    await fetch(`${API}/api/admin/documents/${id}`, { method: 'DELETE' });
    setDocs(prev => prev.filter(d => d.id !== id));
    await fetchStats();
    setConfirm(null);
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredDocs = docs.filter(d =>
    d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(docSearch.toLowerCase())
  );

  const filteredChats = chats.filter(m => {
    const matchesSender = chatFilter === 'all' || m.sender === chatFilter;
    const matchesSearch = m.content.toLowerCase().includes(chatSearch.toLowerCase()) ||
      (m.profiles?.email ?? '').toLowerCase().includes(chatSearch.toLowerCase()) ||
      (m.chat_sessions?.title ?? '').toLowerCase().includes(chatSearch.toLowerCase());
    return matchesSender && matchesSearch;
  });

  const tabs = [
    { id: 'overview',       label: 'Overview',                      icon: '📊' },
    { id: 'users',          label: `Users (${users.length})`,       icon: '👥' },
    { id: 'consultations',  label: `Sessions (${sessions.length})`, icon: '💬' },
    { id: 'chats',          label: `Chats (${chats.length})`,       icon: '🗨️' },
    { id: 'legal-db',       label: `Legal DB (${docs.length})`,     icon: '📚' },
  ] as const;

  if (loading) return (
    <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-legal-gold/20 border-t-legal-gold rounded-full animate-spin mb-4"></div>
      <div className="text-legal-gold text-[10px] font-black uppercase tracking-widest animate-pulse">Loading Admin Panel...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0f14] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto text-2xl">⚠️</div>
            <div>
              <p className="text-white font-black text-base">Confirm Deletion</p>
              <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
                Permanently delete <span className="text-white font-bold">"{confirm.label}"</span>? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
              <button
                onClick={() => confirm.type === 'user' ? deleteUser(confirm.id as string) : deleteDoc(confirm.id as number)}
                className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all"
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="border-b border-white/5 bg-[#05070A]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-legal-gold flex items-center justify-center">
              <span className="text-white text-[10px] font-black">J</span>
            </div>
            <div>
              <div className="text-[9px] font-black text-legal-gold uppercase tracking-widest">JusticeHub</div>
              <div className="text-sm font-black text-white uppercase tracking-tight">Admin Control Panel</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-neutral-500 font-bold hidden md:block">{user?.email}</span>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              My Dashboard
            </button>
            <button onClick={() => signOut(auth).then(() => navigate('/auth'))} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/5 bg-[#05070A]/80 sticky top-[65px] z-40 backdrop-blur-xl overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 min-w-max">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`px-5 py-4 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                tab === t.id ? 'border-legal-gold text-legal-gold' : 'border-transparent text-neutral-500 hover:text-white'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">System Overview</h2>
              <p className="text-neutral-500 text-sm">Live metrics from the JusticeHub platform.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Users"     value={stats.totalUsers}     icon="👤" color="bg-blue-500/10" />
              <StatCard label="Consultations"   value={stats.totalSessions}  icon="💬" color="bg-legal-gold/10" />
              <StatCard label="Messages"        value={stats.totalMessages}  icon="🗨️" color="bg-purple-500/10" />
              <StatCard label="Legal Documents" value={stats.totalDocuments} icon="📚" color="bg-emerald-500/10" />
            </div>

            {/* Role legend */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-5">Role Directory</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(ROLES).map(([key, r]) => (
                  <div key={key} className={`flex items-center gap-3 p-4 rounded-xl border ${r.bg}`}>
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${r.color}`}>{r.label}</div>
                      <div className="text-[8px] text-neutral-500 mt-0.5">{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-neutral-300 truncate">{u.email}</span>
                      <RoleBadge role={u.role} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">Recent Consultations</h3>
                <div className="space-y-3">
                  {sessions.slice(0, 5).map(s => (
                    <div key={s.id} className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-neutral-300 truncate">{s.title}</span>
                      <span className="text-[9px] text-neutral-600">{s.profiles?.email ?? s.user_id} • {new Date(s.updated_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">User Management</h2>
                <p className="text-neutral-500 text-sm">Manage roles and access for all registered users.</p>
              </div>
              <input type="text" placeholder="Search email or role..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-600 outline-none focus:border-legal-gold/50 w-64 shrink-0" />
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Email</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Role</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Auth Method</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Joined</th>
                    <th className="text-right px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Change Role</th>
                    <th className="text-right px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300 font-medium truncate max-w-[180px]">{u.email}</td>
                      <td className="px-6 py-4"><RoleBadge role={u.role} showSub /></td>
                      <td className="px-6 py-4"><AuthBadge provider={u.auth_provider ?? 'password'} /></td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role}
                          onChange={e => changeRole(u.id, e.target.value)}
                          disabled={updatingRole === u.id || u.id === user?.uid}
                          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-white outline-none focus:border-legal-gold/50 cursor-pointer disabled:opacity-40"
                        >
                          <option value="citizen">🤝 Citizen</option>
                          <option value="attorney">⚖️ Attorney</option>
                          <option value="judge">🏛️ Judge</option>
                          <option value="admin">🔑 Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== user?.uid && (
                          <button onClick={() => setConfirm({ type: 'user', id: u.id, label: u.email })}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-neutral-600 text-sm">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CONSULTATIONS ── */}
        {tab === 'consultations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">All Consultations</h2>
              <p className="text-neutral-500 text-sm">Most recent 100 sessions across all users.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Session Title</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">User</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Role</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300 font-medium max-w-xs truncate">{s.title}</td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500 truncate max-w-[180px]">{s.profiles?.email ?? s.user_id}</td>
                      <td className="px-6 py-4">{s.profiles?.role && <RoleBadge role={s.profiles.role} />}</td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500">{new Date(s.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {sessions.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-neutral-600 text-sm">No sessions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CHATS ── */}
        {tab === 'chats' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Chat Messages</h2>
                <p className="text-neutral-500 text-sm">Last 200 messages across all users and sessions.</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <input type="text" placeholder="Search messages or email..." value={chatSearch} onChange={e => setChatSearch(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-600 outline-none focus:border-legal-gold/50 w-56" />
                <div className="flex rounded-xl overflow-hidden border border-white/10">
                  {(['all', 'user', 'ai'] as const).map(f => (
                    <button key={f} onClick={() => setChatFilter(f)}
                      className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${chatFilter === f ? 'bg-legal-gold text-black' : 'bg-white/[0.02] text-neutral-500 hover:text-white'}`}>
                      {f === 'all' ? 'All' : f === 'user' ? '👤 User' : '🤖 AI'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredChats.map(m => (
                <div key={m.id} className={`p-5 rounded-2xl border transition-all ${m.sender === 'ai' ? 'bg-legal-gold/[0.03] border-legal-gold/10' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${m.sender === 'ai' ? 'bg-legal-gold/10 border-legal-gold/20 text-legal-gold' : 'bg-white/5 border-white/10 text-neutral-400'}`}>
                        {m.sender === 'ai' ? '🤖 JusticeHub AI' : '👤 User'}
                      </span>
                      {m.profiles?.role && <RoleBadge role={m.profiles.role} />}
                      <span className="text-[9px] text-neutral-600">{m.profiles?.email ?? m.user_id}</span>
                      {m.chat_sessions?.title && (
                        <span className="text-[9px] text-neutral-600 hidden md:block">— {m.chat_sessions.title}</span>
                      )}
                    </div>
                    <span className="text-[9px] text-neutral-600 whitespace-nowrap shrink-0">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed line-clamp-4">{m.content}</p>
                </div>
              ))}
              {filteredChats.length === 0 && (
                <div className="py-16 text-center text-neutral-600 text-sm">No messages found.</div>
              )}
            </div>
          </div>
        )}

        {/* ── LEGAL DB ── */}
        {tab === 'legal-db' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Legal Database</h2>
                <p className="text-neutral-500 text-sm">All documents in the RAG knowledge base used by the AI.</p>
              </div>
              <input type="text" placeholder="Search title or category..." value={docSearch} onChange={e => setDocSearch(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-600 outline-none focus:border-legal-gold/50 w-64 shrink-0" />
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Title</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Category</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Year</th>
                    <th className="text-right px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(d => (
                    <tr key={d.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300 font-medium max-w-xs truncate">{d.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-legal-gold/10 border border-legal-gold/20 text-legal-gold">{d.category}</span>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500">{d.year ?? '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setConfirm({ type: 'doc', id: d.id, label: d.title })}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-neutral-600 text-sm">No documents found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
