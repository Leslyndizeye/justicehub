import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';

type UserRole = 'attorney' | 'judge' | 'citizen' | null;
type AuthView = 'login' | 'signup' | 'forgot' | 'verify' | 'role';

interface AuthModalProps {
  onClose: () => void;
}

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, placeholder, required = true, isPassword = false, showPassword = false, onTogglePassword }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">{label}</label>
    <div className="relative">
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-white/[0.02] dark:text-white focus:border-legal-gold outline-none text-[11px] font-bold transition-all ${isPassword ? 'pr-10' : ''}`}
        required={required}
      />
      {isPassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-legal-gold transition-colors p-1"
        >
          {showPassword ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
          )}
        </button>
      )}
    </div>
  </div>
);

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [view, setView] = useState<AuthView>('login');
  const [role, setRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    resetMessages();
    setLoading(true);

    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (view === 'signup') {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        await sendEmailVerification(userCredential.user);
        setView('verify');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message.includes('auth/invalid-credential') ? 'Authentication failed. Please check your credentials.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (loading) return;
    setLoading(true);
    resetMessages();
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Success: A reset protocol has been dispatched to your inbox.');
    } catch (err: any) {
      setError(err.message.includes('user-not-found') ? 'Email address not recognized in the sovereign database.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => setShowPassword((p: boolean) => !p);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#05070A]/90 backdrop-blur-lg p-4 overflow-y-auto">
      <div 
        className={`relative w-full max-w-[420px] bg-white dark:bg-neutral-900 rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-white/5 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] my-8
          ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-neutral-400 hover:text-black dark:hover:text-white transition-colors z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-legal-gold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-legal-gold/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L17L22 12" />
              </svg>
            </div>
            <h2 className="text-lg font-black tracking-tight text-neutral-900 dark:text-white uppercase">
              {view === 'verify' ? 'Verification' : view === 'role' ? 'Select Role' : view === 'forgot' ? 'Reset Account' : view === 'login' ? 'Authorized Entry' : `Register ${role}`}
            </h2>
          </div>

          {(error || success) && (
            <div className={`p-3 text-[9px] font-bold rounded-lg mb-6 text-center uppercase tracking-wider border ${success ? 'bg-emerald-50 text-emerald-500 border-emerald-500/20' : 'bg-red-50 text-red-500 border-red-500/20'}`}>
              {success || error}
            </div>
          )}

          {view === 'role' && (
            <div className="space-y-3 animate-fade-in-up">
              <button onClick={() => { setRole('attorney'); setView('signup'); resetMessages(); }} className="w-full p-4 bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 rounded-xl hover:border-legal-gold transition-all text-left flex items-center gap-4">
                <span className="text-xl">⚖️</span>
                <div className="flex flex-col"><span className="text-[11px] font-black uppercase text-neutral-900 dark:text-white">Attorney</span><span className="text-[8px] font-bold text-neutral-400 uppercase">Legal Professional</span></div>
              </button>
              <button onClick={() => { setRole('judge'); setView('signup'); resetMessages(); }} className="w-full p-4 bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 rounded-xl hover:border-legal-gold transition-all text-left flex items-center gap-4">
                <span className="text-xl">🏛️</span>
                <div className="flex flex-col"><span className="text-[11px] font-black uppercase text-neutral-900 dark:text-white">Judge</span><span className="text-[8px] font-bold text-neutral-400 uppercase">Judicial Official</span></div>
              </button>
              <button onClick={() => { setRole('citizen'); setView('signup'); resetMessages(); }} className="w-full p-4 bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 rounded-xl hover:border-legal-gold transition-all text-left flex items-center gap-4">
                <span className="text-xl">🤝</span>
                <div className="flex flex-col"><span className="text-[11px] font-black uppercase text-neutral-900 dark:text-white">Citizen</span><span className="text-[8px] font-bold text-neutral-400 uppercase">General Public</span></div>
              </button>
              <button onClick={() => { setView('login'); resetMessages(); }} className="w-full mt-4 text-[9px] font-black uppercase text-neutral-400 hover:text-legal-gold tracking-widest">Back to Login</button>
            </div>
          )}

          {view === 'verify' && (
            <div className="text-center space-y-6 animate-fade-in-up py-4">
              <div className="text-4xl">✉️</div>
              <p className="text-[11px] text-neutral-500 font-bold leading-relaxed">Verification protocol triggered for <span className="text-black dark:text-white">{email}</span>. Please authorize your device via the link sent to your inbox.</p>
              <button onClick={onClose} className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[9px] rounded-xl">Enter System</button>
            </div>
          )}

          {(view === 'login' || view === 'signup' || view === 'forgot') && (
            <form onSubmit={view === 'forgot' ? handleForgotPassword : handleAuth} className="space-y-4">
              {view === 'signup' && (
                <>
                  <InputField label="Full Name" type="text" value={fullName} onChange={setFullName} placeholder="Jean-Claude Gasana" />
                  {role === 'attorney' && (
                    <>
                      <InputField label="Law Firm" type="text" value={orgName} onChange={setOrgName} placeholder="Gasana & Partners" />
                      <InputField label="Bar License" type="text" value={licenseId} onChange={setLicenseId} placeholder="RBA/2025/..." />
                    </>
                  )}
                  {role === 'judge' && (
                    <>
                      <InputField label="Court Name" type="text" value={orgName} onChange={setOrgName} placeholder="High Court of Kigali" />
                      <InputField label="Judicial ID" type="text" value={licenseId} onChange={setLicenseId} placeholder="JUD-2025-..." />
                      <InputField label="Jurisdiction" type="text" value={jurisdiction} onChange={setJurisdiction} placeholder="Province / District" />
                    </>
                  )}
                </>
              )}

              <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="counsel@ireme.rw" />

              {view !== 'forgot' && (
                <div className="space-y-4">
                  <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" isPassword showPassword={showPassword} onTogglePassword={toggle} />
                  {view === 'signup' && <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" isPassword showPassword={showPassword} onTogglePassword={toggle} />}
                </div>
              )}

              {view === 'login' && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setView('forgot'); resetMessages(); }} className="text-[9px] font-black uppercase text-neutral-400 hover:text-legal-gold tracking-widest">Forgot Credentials?</button>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:scale-102 active:scale-98 transition-all shadow-xl disabled:opacity-50 mt-4"
              >
                {loading ? 'Processing...' : view === 'login' ? 'Authenticate' : view === 'forgot' ? 'Trigger Reset Protocol' : 'Register Account'}
              </button>

              {(view === 'login' || view === 'signup') && (
                <>
                  <div className="relative py-6 flex items-center">
                    <div className="flex-grow border-t border-neutral-100 dark:border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[8px] font-black text-neutral-300 uppercase tracking-[0.4em]">Alternative</span>
                    <div className="flex-grow border-t border-neutral-100 dark:border-white/5"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-white/[0.02] dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-all text-[9px] font-black uppercase tracking-widest"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-3.5 h-3.5" alt="Google" />
                    Sign in with Google
                  </button>

                  <div className="text-center mt-6">
                    <button 
                      type="button"
                      onClick={() => { resetMessages(); if (view === 'login') setView('role'); else setView('login'); }}
                      className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest hover:text-legal-gold transition-colors"
                    >
                      {view === 'login' ? "New Access? Register Role" : "Existing Counsel? Login"}
                    </button>
                  </div>
                </>
              )}

              {view === 'forgot' && (
                <div className="text-center mt-6">
                  <button type="button" onClick={() => { setView('login'); resetMessages(); }} className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest hover:text-legal-gold transition-colors">Return to Identification</button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;