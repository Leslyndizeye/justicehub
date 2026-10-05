import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import SocialProof from './components/SocialProof';
import CTA from './components/CTA';
import Features from './components/Features';
import Process from './components/Process';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import IntroSequence from './components/IntroSequence';
import AuthPage from './components/AuthPage';
import Dashboard from './components/dashboard';
import AdminDashboard from './components/AdminDashboard';
import { auth } from './components/firebaseConfig';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const ThemeContext = React.createContext({ isDark: true, toggleTheme: () => {} });

// ── Landing page ──────────────────────────────────────────────
const LandingPage: React.FC<{ onAuthClick: () => void }> = ({ onAuthClick }) => (
  <>
    <Navbar onAuthClick={onAuthClick} />
    <main>
      <Hero />
      <SocialProof />
      <div className="py-20 bg-neutral-100 dark:bg-[#05070A]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-serif italic text-legal-gold mb-4">The Sovereign Standard</h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-sm">Elevating the Rwandan Jurisprudential landscape through high-fidelity cognitive analysis and sovereign data protocols.</p>
        </div>
      </div>
      <Services />
      <Features />
      <Process />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
    <footer className="py-16 px-6 bg-neutral-100 dark:bg-[#05070A]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-neutral-500 dark:text-neutral-500 text-sm">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-legal-gold flex items-center justify-center">
              <span className="text-white font-black">J</span>
            </div>
            <span className="text-lg font-bold text-legal-navy dark:text-white uppercase tracking-tighter">JusticeHub</span>
          </div>
          <p className="max-w-xs text-center md:text-left font-light">Elevating the Rwandan Jurisprudential landscape through sovereign intelligence.</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-legal-gold/5 text-center text-[10px] opacity-50 uppercase tracking-[0.2em] font-bold">
        © 2025 JusticeHub Ltd. Registered in the Republic of Rwanda. RDB Certified.
      </div>
    </footer>
  </>
);

// ── Spinner ───────────────────────────────────────────────────
const Spinner = () => (
  <div className="min-h-screen bg-[#05070A] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-legal-gold/20 border-t-legal-gold rounded-full animate-spin"></div>
  </div>
);

// ── App ───────────────────────────────────────────────────────
const App: React.FC = () => {
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [user, setUser]     = useState<User | null | 'loading'>('loading');
  const [role, setRole]     = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const backgroundTimerRef  = useRef<number | null>(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  const toggleTheme = () => {
    setIsDark(d => !d);
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
  };

  // Upsert profile → returns role without ever overwriting it
  const resolveRole = async (u: User): Promise<string> => {
    try {
      const provider = u.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password';
      const res = await fetch(`${API}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: u.uid, email: u.email, auth_provider: provider }),
      });
      const data = await res.json();
      return data.role ?? 'citizen';
    } catch {
      return 'citizen';
    }
  };

  useEffect(() => {
    document.documentElement.className = 'dark scroll-smooth overflow-x-hidden';

    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'resetPassword' && params.get('oobCode')) {
      navigate('/auth', { state: { mode: 'confirmReset', oobCode: params.get('oobCode') }, replace: true });
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setRoleLoading(true);
        const r = await resolveRole(u);
        setRole(r);
        setRoleLoading(false);
        // Redirect from /auth after login
        if (location.pathname === '/auth') {
          navigate(r === 'admin' ? '/adminxt' : '/dashboard', { replace: true });
        }
      } else {
        setRole(null);
        setRoleLoading(false);
      }
    });

    const handleVisibility = () => {
      if (document.hidden && auth.currentUser) {
        backgroundTimerRef.current = window.setTimeout(() => {
          signOut(auth).then(() => navigate('/auth', { replace: true }));
        }, 3 * 60 * 60 * 1000);
      } else {
        if (backgroundTimerRef.current) { clearTimeout(backgroundTimerRef.current); backgroundTimerRef.current = null; }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
      if (backgroundTimerRef.current) clearTimeout(backgroundTimerRef.current);
    };
  }, []);

  const showIntro = !isIntroFinished && location.pathname === '/';
  // Wait for both Firebase auth AND role fetch to complete before rendering routes
  const isReady = user !== 'loading' && !roleLoading;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className="relative min-h-screen w-full bg-neutral-100 dark:bg-[#05070A] selection:bg-legal-gold/30">
        {showIntro && <IntroSequence onFinish={() => setIsIntroFinished(true)} />}

        <div className={`transition-opacity duration-300 ${(!showIntro && isReady) ? 'opacity-100' : 'opacity-0'}`}>
          {isReady && (
            <Routes>
              <Route path="/" element={<LandingPage onAuthClick={() => navigate('/auth')} />} />

              {/* Auth page */}
              <Route path="/auth" element={
                user
                  ? <Navigate to={role === 'admin' ? '/adminxt' : '/dashboard'} replace />
                  : <AuthPage
                      onBack={() => navigate('/')}
                      initialMode={(location.state as any)?.mode}
                      oobCode={(location.state as any)?.oobCode}
                    />
              } />

              {/* Regular dashboard — redirect to adminxt if admin */}
              <Route path="/dashboard" element={
                !user
                  ? <Navigate to="/auth" replace />
                  : role === 'admin'
                  ? <Navigate to="/adminxt" replace />
                  : <Dashboard />
              } />

              {/* Admin panel — redirect to dashboard if not admin */}
              <Route path="/adminxt" element={
                !user
                  ? <Navigate to="/auth" replace />
                  : role !== 'admin'
                  ? <Navigate to="/dashboard" replace />
                  : <AdminDashboard />
              } />

              <Route path="/solutions"    element={<Navigate to="/#services"     replace />} />
              <Route path="/intelligence" element={<Navigate to="/#features"     replace />} />
              <Route path="/method"       element={<Navigate to="/#process"      replace />} />
              <Route path="/pricing"      element={<Navigate to="/#pricing"      replace />} />
              <Route path="/testimonials" element={<Navigate to="/#testimonials" replace />} />
              <Route path="*"             element={<Navigate to="/"              replace />} />
            </Routes>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
