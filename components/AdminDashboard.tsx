import React, { useEffect, useState, useCallback } from 'react';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Users, FileText, MessageSquare, RefreshCw,
  LogOut, LayoutDashboard, Shield, Trash2, Search,
  ArrowUpRight, ChevronDown, Database, BookOpen, MessagesSquare,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const GOLD = '#C5A059';

type Tab = 'overview' | 'users' | 'consultations' | 'chats' | 'legal-db';

interface Stats { totalUsers: number; totalSessions: number; totalMessages: number; totalDocuments: number; }
interface UserProfile { id: string; email: string; role: string; auth_provider: string; created_at: string; }
interface Session { id: string; title: string; created_at: string; updated_at: string; user_id: string; profiles: { email: string; role: string } | null; }
interface ChatMessage { id: string; content: string; sender: 'user' | 'ai'; created_at: string; user_id: string; profiles: { email: string; role: string; auth_provider: string } | null; chat_sessions: { title: string } | null; }
interface LegalDoc { id: number; title: string; category: string; year: number | null; source: string; }

const ROLE_META: Record<string, { label: string; sub: string; color: string; border: string; text: string }> = {
  admin:    { label: 'Admin',    sub: 'System Administrator',   color: '#ef4444', border: 'border-red-500/20',     text: 'text-red-400' },
  attorney: { label: 'Attorney', sub: 'Bar Registered Counsel', color: '#3b82f6', border: 'border-blue-500/20',    text: 'text-blue-400' },
  judge:    { label: 'Judge',    sub: 'Judicial Official',      color: '#a855f7', border: 'border-purple-500/20',  text: 'text-purple-400' },
  citizen:  { label: 'Citizen',  sub: 'Public Litigant',        color: '#10b981', border: 'border-emerald-500/20', text: 'text-emerald-400' },
};

const RoleBadge: React.FC<{ role: string; showSub?: boolean }> = ({ role, showSub = false }) => {
  const m = ROLE_META[role] ?? { label: role, sub: 'Identification Portal', color: '#6b7280', border: 'border-white/10', text: 'text-neutral-400' };
  if (showSub) return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white/[0.03] ${m.border}`}>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
      <div className="flex flex-col leading-tight">
        <span className={`text-[10px] font-black uppercase tracking-widest ${m.text}`}>{m.label}</span>
        <span className="text-[8px] text-neutral-500 uppercase tracking-widest">{m.sub}</span>
      </div>
    </div>
  );
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border bg-white/[0.02] ${m.border} ${m.text}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
      {m.label}
    </span>
  );
};

const AuthBadge: React.FC<{ provider: string }> = ({ provider }) => (
  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${provider === 'google' ? 'bg-white/5 border-white/10 text-white' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
    {provider === 'google' ? 'Google' : 'Email'}
  </span>
);

// ── Custom tooltip for charts ─────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0f14] border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────
const StatCard: React.FC<{ title: string; value: number; sub: string; icon: React.ReactNode; color: string }> = ({ title, value, sub, icon, color }) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top right, ${color}08, transparent 70%)` }} />
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{title}</span>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
        <span style={{ color }}>{icon}</span>
      </div>
    </div>
    <div className="text-3xl font-black text-white tracking-tighter">{value.toLocaleString()}</div>
    <div className="flex items-center gap-1 mt-2">
      <ArrowUpRight className="w-3 h-3" style={{ color }} />
      <span className="text-[10px] text-neutral-500 font-medium">{sub}</span>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate  = useNavigate();
  const user      = auth.currentUser;
  const [tab, setTab]               = useState<Tab>('overview');
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats]           = useState<Stats>({ totalUsers: 0, totalSessions: 0, totalMessages: 0, totalDocuments: 0 });
  const [users, setUsers]           = useState<UserProfile[]>([]);
  const [sessions, setSessions]     = useState<Session[]>([]);
  const [chats, setChats]           = useState<ChatMessage[]>([]);
  const [docs, setDocs]             = useState<LegalDoc[]>([]);
  const [docSearch, setDocSearch]   = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'user' | 'ai'>('all');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [confirm, setConfirm]       = useState<{ type: 'user' | 'doc'; id: string | number; label: string } | null>(null);

  const fetchAll = useCallback(async () => {
    const [s, u, se, ch, d] = await Promise.all([
      fetch(`${API}/api/admin/stats`).then(r => r.json()),
      fetch(`${API}/api/admin/users`).then(r => r.json()),
      fetch(`${API}/api/admin/sessions`).then(r => r.json()),
      fetch(`${API}/api/admin/messages`).then(r => r.json()),
      fetch(`${API}/api/admin/documents`).then(r => r.json()),
    ]);
    setStats(s);
    setUsers(Array.isArray(u) ? u : []);
    setSessions(Array.isArray(se) ? se : []);
    setChats(Array.isArray(ch) ? ch : []);
    setDocs(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => { fetchAll().finally(() => setLoading(false)); }, []);

  const refresh = async () => { setRefreshing(true); await fetchAll(); setRefreshing(false); };

  const changeRole = async (uid: string, role: string) => {
    setUpdatingRole(uid);
    await fetch(`${API}/api/users/${uid}/role`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    await fetchAll();
    setUpdatingRole(null);
  };

  const deleteUser = async (uid: string) => {
    await fetch(`${API}/api/admin/users/${uid}`, { method: 'DELETE' });
    setUsers(p => p.filter(u => u.id !== uid));
    setStats(p => ({ ...p, totalUsers: p.totalUsers - 1 }));
    setConfirm(null);
  };

  const deleteDoc = async (id: number) => {
    await fetch(`${API}/api/admin/documents/${id}`, { method: 'DELETE' });
    setDocs(p => p.filter(d => d.id !== id));
    setStats(p => ({ ...p, totalDocuments: p.totalDocuments - 1 }));
    setConfirm(null);
  };

  // ── Chart data derived from real data ──────────────────────
  // Messages per day (last 7 days)
  const msgByDay = (() => {
    const days: Record<string, number> = {};
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      days[d.toLocaleDateString('en', { weekday: 'short' })] = 0;
    }
    chats.forEach(m => {
      const label = new Date(m.created_at).toLocaleDateString('en', { weekday: 'short' });
      if (label in days) days[label]++;
    });
    return Object.entries(days).map(([day, messages]) => ({ day, messages }));
  })();

  // Users by role
  const usersByRole = Object.entries(
    users.reduce((acc, u) => { acc[u.role] = (acc[u.role] ?? 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([role, count]) => ({ role: ROLE_META[role]?.label ?? role, count, color: ROLE_META[role]?.color ?? '#6b7280' }));

  // Docs by category
  const docsByCategory = Object.entries(
    docs.reduce((acc, d) => { acc[d.category] = (acc[d.category] ?? 0) + 1; return acc; }, {} as Record<string, number>)
  ).slice(0, 6).map(([cat, count], i) => ({
    name: cat, value: count,
    color: ['#C5A059','#3b82f6','#10b981','#a855f7','#ef4444','#f59e0b'][i],
  }));

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.role.includes(userSearch.toLowerCase()));
  const filteredDocs  = docs.filter(d => d.title.toLowerCase().includes(docSearch.toLowerCase()) || d.category.toLowerCase().includes(docSearch.toLowerCase()));
  const filteredChats = chats.filter(m => {
    const matchSender = chatFilter === 'all' || m.sender === chatFilter;
    const matchSearch = m.content.toLowerCase().includes(chatSearch.toLowerCase()) || (m.profiles?.email ?? '').toLowerCase().includes(chatSearch.toLowerCase());
    return matchSender && matchSearch;
  });

  const tabs = [
    { id: 'overview',      label: 'Overview',                     icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'users',         label: `Users (${users.length})`,      icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'consultations', label: `Sessions (${sessions.length})`, icon: <MessagesSquare className="w-3.5 h-3.5" /> },
    { id: 'chats',         label: `Chats (${chats.length})`,      icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'legal-db',      label: `Legal DB (${docs.length})`,    icon: <BookOpen className="w-3.5 h-3.5" /> },
  ] as const;

  if (loading) return (
    <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
      <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-widest animate-pulse">Loading Admin Panel...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0f14] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-white font-black text-base">Confirm Deletion</p>
              <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
                Permanently delete <span className="text-white font-bold">"{confirm.label}"</span>? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => confirm.type === 'user' ? deleteUser(confirm.id as string) : deleteDoc(confirm.id as number)}
                className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/5 bg-[#05070A]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">JusticeHub</div>
              <div className="text-sm font-black text-white uppercase tracking-tight">Admin Control Panel</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-neutral-500 font-bold hidden md:block">{user?.email}</span>
            <button onClick={refresh} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-40">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">User Dashboard</span>
            </button>
            <button onClick={() => signOut(auth).then(() => navigate('/auth'))}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/5 bg-[#05070A]/80 sticky top-[65px] z-40 backdrop-blur-xl overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 flex min-w-max">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)}
              className={`flex items-center gap-2 px-5 py-4 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${tab === t.id ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-neutral-500 hover:text-white'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Analytics Dashboard</h1>
                <p className="text-neutral-500 mt-1 text-sm">Welcome back. Here is what is happening with JusticeHub.</p>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users"     value={stats.totalUsers}     sub="Registered accounts"    icon={<Users className="w-4 h-4" />}          color="#3b82f6" />
              <StatCard title="Consultations"   value={stats.totalSessions}  sub="Chat sessions opened"   icon={<MessagesSquare className="w-4 h-4" />}   color={GOLD} />
              <StatCard title="Messages"        value={stats.totalMessages}  sub="User and AI messages"   icon={<MessageSquare className="w-4 h-4" />}    color="#a855f7" />
              <StatCard title="Legal Documents" value={stats.totalDocuments} sub="In RAG knowledge base"  icon={<Database className="w-4 h-4" />}         color="#10b981" />
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Area chart — messages last 7 days */}
              <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-black text-white">Message Activity</h2>
                    <p className="text-neutral-500 text-xs mt-0.5">Daily messages over the past 7 days</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20">
                    <TrendingUp className="w-3 h-3 text-[#C5A059]" />
                    <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Live</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={msgByDay}>
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={GOLD} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <Tooltip content={<DarkTooltip />} />
                    <Area type="monotone" dataKey="messages" name="Messages" stroke={GOLD} strokeWidth={2.5} fill="url(#goldGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <TrendingUp className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs text-neutral-500">Showing total messages for the last 7 days</span>
                </div>
              </div>

              {/* Pie chart — docs by category */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="mb-6">
                  <h2 className="text-base font-black text-white">Legal DB by Category</h2>
                  <p className="text-neutral-500 text-xs mt-0.5">Distribution of RAG documents</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={docsByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {docsByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {docsByCategory.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[9px] font-medium text-neutral-400 truncate capitalize">{item.name}</span>
                      <span className="text-[9px] text-neutral-600 ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar chart — users by role */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="mb-6">
                  <h2 className="text-base font-black text-white">Users by Role</h2>
                  <p className="text-neutral-500 text-xs mt-0.5">Breakdown of registered user roles</p>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={usersByRole}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="role" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="count" name="Users" radius={[6, 6, 0, 0]} barSize={40}>
                      {usersByRole.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent users */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-black text-white">Recent Users</h2>
                    <p className="text-neutral-500 text-xs mt-0.5">{users.length} registered accounts</p>
                  </div>
                </div>
                <div className="space-y-5">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-black text-white">{u.email.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{u.email}</p>
                        <p className="text-[10px] text-neutral-500">{new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                      <RoleBadge role={u.role} />
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">User Management</h2>
                <p className="text-neutral-500 text-sm mt-1">Manage roles and access for all registered users.</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input type="text" placeholder="Search email or role..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#C5A059]/50" />
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Email', 'Role', 'Auth Method', 'Joined', 'Change Role', ''].map(h => (
                      <th key={h} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500 ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300 font-medium truncate max-w-[200px]">{u.email}</td>
                      <td className="px-6 py-4"><RoleBadge role={u.role} showSub /></td>
                      <td className="px-6 py-4"><AuthBadge provider={u.auth_provider ?? 'password'} /></td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} disabled={updatingRole === u.id || u.id === user?.uid}
                            className="appearance-none bg-white/[0.03] border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-[10px] font-black uppercase text-white outline-none focus:border-[#C5A059]/50 cursor-pointer disabled:opacity-40">
                            <option value="citizen">Citizen</option>
                            <option value="attorney">Attorney</option>
                            <option value="judge">Judge</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== user?.uid && (
                          <button onClick={() => setConfirm({ type: 'user', id: u.id, label: u.email })}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all">
                            <Trash2 className="w-4 h-4" />
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
              <h2 className="text-2xl font-black uppercase tracking-tighter">All Consultations</h2>
              <p className="text-neutral-500 text-sm mt-1">Most recent 100 sessions across all users.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Session Title', 'User', 'Role', 'Last Active'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500">{h}</th>
                    ))}
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
                <h2 className="text-2xl font-black uppercase tracking-tighter">Chat Messages</h2>
                <p className="text-neutral-500 text-sm mt-1">Last 200 messages across all users and sessions.</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input type="text" placeholder="Search messages..." value={chatSearch} onChange={e => setChatSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#C5A059]/50 w-52" />
                </div>
                <div className="flex rounded-xl overflow-hidden border border-white/10">
                  {(['all', 'user', 'ai'] as const).map(f => (
                    <button key={f} onClick={() => setChatFilter(f)}
                      className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${chatFilter === f ? 'bg-[#C5A059] text-black' : 'bg-white/[0.02] text-neutral-500 hover:text-white'}`}>
                      {f === 'all' ? 'All' : f === 'user' ? 'User' : 'AI'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {filteredChats.map(m => (
                <div key={m.id} className={`p-5 rounded-2xl border transition-all ${m.sender === 'ai' ? 'bg-[#C5A059]/[0.03] border-[#C5A059]/10' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${m.sender === 'ai' ? 'bg-[#C5A059]/10 border-[#C5A059]/20 text-[#C5A059]' : 'bg-white/5 border-white/10 text-neutral-400'}`}>
                        {m.sender === 'ai' ? 'JusticeHub AI' : 'User'}
                      </span>
                      {m.profiles?.role && <RoleBadge role={m.profiles.role} />}
                      <span className="text-[9px] text-neutral-600">{m.profiles?.email ?? m.user_id}</span>
                    </div>
                    <span className="text-[9px] text-neutral-600 whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed line-clamp-4">{m.content}</p>
                </div>
              ))}
              {filteredChats.length === 0 && <div className="py-16 text-center text-neutral-600 text-sm">No messages found.</div>}
            </div>
          </div>
        )}

        {/* ── LEGAL DB ── */}
        {tab === 'legal-db' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Legal Database</h2>
                <p className="text-neutral-500 text-sm mt-1">All documents in the RAG knowledge base used by the AI.</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input type="text" placeholder="Search title or category..." value={docSearch} onChange={e => setDocSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#C5A059]/50" />
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Title', 'Category', 'Year', ''].map(h => (
                      <th key={h} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-500 ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(d => (
                    <tr key={d.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300 font-medium max-w-xs truncate">{d.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059]">{d.category}</span>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-neutral-500">{d.year ?? '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setConfirm({ type: 'doc', id: d.id, label: d.title })}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all">
                          <Trash2 className="w-4 h-4" />
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
