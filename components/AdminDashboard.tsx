import React, { useEffect, useState, useCallback } from 'react';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type Tab = 'overview' | 'users' | 'consultations' | 'legal-db';

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

interface LegalDoc {
  id: number;
  title: string;
  category: string;
  year: number | null;
  source: string;
}

const ROLE_COLORS: Record<string, string> = {
  admin:    'bg-red-500/20 text-red-400 border-red-500/30',
  attorney: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  judge:    'bg-purple-500/20 text-purple-400 border-purple-500/30',
  citizen:  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const Badge: React.FC<{ role: string }> = ({ role }) => (
  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${ROLE_COLORS[role] ?? 'bg-white/10 text-white/60 border-white/10'}`}>
    {role}
  </span>
);

const StatCard: React.FC<{ label: string; value: number; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-legal-gold/20 transition-all">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
    <div>
      <div className="text-3xl font-black text-white tracking-tighter">{value.toLocaleString()}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">{label}</div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalSessions: 0, totalMessages: 0, totalDocuments: 0 });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [docs, setDocs] = useState<LegalDoc[]>([]);
  const [docSearch, setDocSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ type: 'user' | 'doc'; id: string | number; label: string } | null>(null);

  const fetchStats = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/stats`);
    const data = await res.json();
    setStats(data);
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/users`);
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  }, []);

  const fetchSessions = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/sessions`);
    const data = await res.json();
    setSessions(Array.isArray(data) ? data : []);
  }, []);

  const fetchDocs = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/documents`);
    const data = await res.json();
    setDocs(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    Promise.all([fetchStats(), fetchUsers(), fetchSessions(), fetchDocs()])
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
    await fetchStats();
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
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              My Dashboard
            </button>
            <button
              onClick={() => signOut(auth).then(() => navigate('/auth'))}
              className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/5 bg-[#05070A]/80 sticky top-[65px] z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {([
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: `Users (${users.length})`, icon: '👥' },
            { id: 'consultations', label: `Consultations (${sessions.length})`, icon: '💬' },
            { id: 'legal-db', label: `Legal DB (${docs.length})`, icon: '📚' },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`px-5 py-4 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
                tab === t.id
                  ? 'border-legal-gold text-legal-gold'
                  : 'border-transparent text-neutral-500 hover:text-white'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">System Overview</h2>
              <p className="text-neutral-500 text-sm">Live metrics from the JusticeHub platform.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={stats.totalUsers} icon="👤" color="bg-blue-500/10" />
              <StatCard label="Consultations" value={stats.totalSessions} icon="💬" color="bg-legal-gold/10" />
              <StatCard label="Messages" value={stats.totalMessages} icon="📨" color="bg-purple-500/10" />
              <StatCard label="Legal Documents" value={stats.totalDocuments} icon="📚" color="bg-emerald-500/10" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-300 truncate max-w-[200px]">{u.email}</span>
                      <Badge role={u.role} />
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

        {/* USERS */}
        {tab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">User Management</h2>
                <p className="text-neutral-500 text-sm">Manage roles and access for all registered users.</p>
              </div>
              <input
                type="text"
                placeholder="Search email or role..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-600 outline-none focus:border-legal-gold/50 w-64"
              />
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Email</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Role</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500 hidden md:table-cell">Joined</th>
                    <th className="text-right px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300 font-medium truncate max-w-[200px]">{u.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={e => changeRole(u.id, e.target.value)}
                          disabled={updatingRole === u.id || u.id === user?.uid}
                          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-white outline-none focus:border-legal-gold/50 cursor-pointer disabled:opacity-40"
                        >
                          <option value="citizen">Citizen</option>
                          <option value="attorney">Attorney</option>
                          <option value="judge">Judge</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500 hidden md:table-cell">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== user?.uid && (
                          <button
                            onClick={() => setConfirm({ type: 'user', id: u.id, label: u.email })}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-neutral-600 text-sm">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONSULTATIONS */}
        {tab === 'consultations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">All Consultations</h2>
              <p className="text-neutral-500 text-sm">Most recent 100 sessions across all users.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Session Title</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500 hidden md:table-cell">User</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500 hidden lg:table-cell">Role</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300 font-medium max-w-xs truncate">{s.title}</td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500 hidden md:table-cell truncate max-w-[180px]">{s.profiles?.email ?? s.user_id}</td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {s.profiles?.role && <Badge role={s.profiles.role} />}
                      </td>
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

        {/* LEGAL DB */}
        {tab === 'legal-db' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Legal Database</h2>
                <p className="text-neutral-500 text-sm">All documents in the RAG knowledge base used by the AI.</p>
              </div>
              <input
                type="text"
                placeholder="Search title or category..."
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-600 outline-none focus:border-legal-gold/50 w-64"
              />
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Title</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500 hidden md:table-cell">Category</th>
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500 hidden lg:table-cell">Year</th>
                    <th className="text-right px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(d => (
                    <tr key={d.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300 font-medium max-w-xs truncate">{d.title}</td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-legal-gold/10 border border-legal-gold/20 text-legal-gold">
                          {d.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500 hidden lg:table-cell">{d.year ?? '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setConfirm({ type: 'doc', id: d.id, label: d.title })}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                        >
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
