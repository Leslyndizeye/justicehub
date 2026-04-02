import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  confirmPasswordReset,
  verifyPasswordResetCode,
  signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebaseConfig';

type UserRole = 'attorney' | 'judge' | 'citizen' | null;
type AuthView = 'login' | 'signup' | 'forgot' | 'verify' | 'role' | 'confirmReset';

interface AuthPageProps {
  onBack: () => void;
  initialMode?: AuthView;
  oobCode?: string | null;
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
  isSignup?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, placeholder, required = true, isPassword = false, showPassword = false, onTogglePassword, isSignup = false }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">{label}</label>
    <div className="relative">
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={isPassword ? (isSignup ? 'new-password' : 'current-password') : 'email'}
        className={`w-full px-6 py-4 rounded-2xl border border-neutral-100 dark:border-white/10 bg-white dark:bg-white/[0.04] text-neutral-900 dark:text-white focus:border-legal-gold dark:focus:border-legal-gold focus:ring-1 focus:ring-legal-gold outline-none text-base font-medium transition-all ${isPassword ? 'pr-14' : ''}`}
        required={required}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-legal-gold transition-colors p-2"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
          )}
        </button>
      )}
    </div>
  </div>
);

const AuthPage: React.FC<AuthPageProps> = ({ onBack, initialMode = 'login', oobCode }) => {
  const [view, setView] = useState<AuthView>(initialMode);
  const [role, setRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [licenseId, setLicenseId] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  // Check if we are in reset mode on load
  useEffect(() => {
    if (oobCode && initialMode === 'confirmReset') {
      verifyPasswordResetCode(auth, oobCode)
        .then((emailAddress) => {
          setEmail(emailAddress); // Show user which email they are resetting for
        })
        .catch((err) => {
          console.error("Verification error:", err);
          setError('This security link has expired or is invalid. Please request a new one.');
        });
    }
  }, [oobCode, initialMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    resetMessages();
    setLoading(true);

    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (view === 'signup') {
        if (password !== confirmPassword) throw new Error("Security keys do not match.");
        if (password.length < 8) throw new Error("Security key must be at least 8 characters for sovereign compliance.");
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update Firebase profile
        await updateProfile(userCredential.user, { displayName: fullName });
        
        // Save Role to Firestore for AI tailoring
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          role: role || 'citizen',
          fullName: fullName,
          email: email,
          licenseId: licenseId || null,
          createdAt: new Date(),
          verified: false
        });

        await sendEmailVerification(userCredential.user);
        await signOut(auth); // prevent auto-redirect to dashboard before email verified
        setView('verify');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      const msg = err.code === 'auth/invalid-credential' 
        ? 'Invalid identity or security key.' 
        : err.code === 'auth/email-already-in-use'
        ? 'This identity protocol is already registered.'
        : err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;
    resetMessages();

    if (password !== confirmPassword) {
      setError("Security keys do not match. Please re-enter.");
      return;
    }
    if (password.length < 8) {
      setError("Security key must be at least 8 characters for sovereign compliance.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess('Identity secured. Your password has been updated successfully.');
      setTimeout(() => setView('login'), 3000);
    } catch (err: any) {
      console.error("Reset confirm error:", err);
      setError(err.message || 'Failed to update security credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your identity email.');
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Reset link dispatched. Please check your inbox and authorized domains.');
    } catch (err: any) {
      console.error("Reset Error:", err);
      setError(err.code === 'auth/user-not-found' ? 'No authorized account found with this email.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (loading) return;
    setLoading(true);
    resetMessages();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // On first sign in with Google, we might need to set a default role if it doesn't exist
      const userDoc = doc(db, 'users', result.user.uid);
      await setDoc(userDoc, {
        role: 'citizen',
        fullName: result.user.displayName,
        email: result.user.email,
        updatedAt: new Date()
      }, { merge: true });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePw = () => setShowPassword((p: boolean) => !p);

  return (
    <div className="min-h-screen w-full bg-[#05070A] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 z-0 bg-[#05070A]"></div>
      <div className="absolute inset-0 z-0 grid-lines opacity-[0.05]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-legal-gold to-transparent opacity-20"></div>

      <div className="relative z-10 w-full max-w-[480px]">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-legal-gold transition-all flex items-center gap-2 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            Return to Site
          </button>
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-legal-gold flex items-center justify-center mx-auto mb-6 shadow-[0_20px_50px_rgba(197,160,89,0.3)]">
            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase mb-2">
            {view === 'verify' ? 'Device Auth' : view === 'role' ? 'Select Domain' : view === 'forgot' ? 'Security Reset' : view === 'confirmReset' ? 'Credential Update' : 'ireme Access'}
          </h1>
          <p className="text-legal-gold text-[10px] font-black tracking-[0.5em] uppercase opacity-80">Law & Wellbeing Intelligence</p>
        </div>

        <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-legal-gold/5 blur-[80px] rounded-full pointer-events-none"></div>

          {(error || success) && (
            <div className={`p-5 text-[11px] font-black rounded-2xl mb-8 text-center uppercase tracking-widest border animate-fade-in-up transition-all duration-700 ${success ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              <div className="flex flex-col items-center gap-3">
                {success && <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">✓</div>}
                {success || error}
              </div>
            </div>
          )}

          {view === 'role' && (
            <div className="space-y-4 animate-fade-in-up">
              <RoleButton icon="⚖️" title="Attorney" sub="Bar Registered Counsel" onClick={() => { setRole('attorney'); setView('signup'); resetMessages(); }} />
              <RoleButton icon="🏛️" title="Judge" sub="Judicial Official" onClick={() => { setRole('judge'); setView('signup'); resetMessages(); }} />
              <RoleButton icon="🤝" title="Citizen" sub="Public Litigant" onClick={() => { setRole('citizen'); setView('signup'); resetMessages(); }} />
              <button onClick={() => setView('login')} className="w-full mt-6 text-[10px] font-black uppercase text-neutral-500 hover:text-white tracking-[0.3em] transition-colors">Identification Portal</button>
            </div>
          )}

          {view === 'verify' && (
            <div className="text-center space-y-10 animate-fade-in-up py-6">
              <div className="text-7xl animate-bounce">✉️</div>
              <p className="text-base text-neutral-400 font-medium leading-relaxed">
                Verification link dispatched to <br />
                <span className="text-white font-bold">{email}</span>. <br />
                Please authorize your session.
              </p>
              <button onClick={onBack} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-legal-gold hover:text-white transition-all shadow-xl">Return to ireme</button>
            </div>
          )}

          {view === 'confirmReset' && (
            <form onSubmit={handleConfirmReset} className="space-y-6">
              <div className="text-center mb-6">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Secure Reset for</span>
                <div className="text-sm font-bold text-white mt-1">{email || "Authorized User"}</div>
              </div>
              <InputField label="New Security Key" type="password" value={password} onChange={setPassword} placeholder="••••••••" isPassword showPassword={showPassword} onTogglePassword={togglePw} isSignup />
              <InputField label="Confirm Security Key" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" isPassword showPassword={showPassword} onTogglePassword={togglePw} isSignup />
              <p className="text-[9px] text-neutral-500 font-medium px-2 leading-relaxed italic">
                Protocol: Your new key must be at least 8 characters and differ from previous identifiers.
              </p>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl hover:bg-legal-gold hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
              >
                {loading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                Authorize Key Update
              </button>
            </form>
          )}

          {(view === 'login' || view === 'signup' || view === 'forgot') && (
            <form onSubmit={view === 'forgot' ? handleForgotPassword : handleAuth} className="space-y-6">
              {view === 'signup' && (
                <>
                  <InputField label="Full Legal Name" type="text" value={fullName} onChange={setFullName} placeholder="Jean-Claude Gasana" />
                  {role === 'attorney' && <InputField label="Bar ID" type="text" value={licenseId} onChange={setLicenseId} placeholder="RBA/2025/00..." />}
                  {role === 'judge' && <InputField label="Judicial ID" type="text" value={licenseId} onChange={setLicenseId} placeholder="JUD/KGL/..." />}
                </>
              )}

              <InputField label="Email Identity" type="email" value={email} onChange={setEmail} placeholder="identity@ireme.rw" />

              {view !== 'forgot' && (
                <div className="space-y-6">
                  <InputField label="Security Key" type="password" value={password} onChange={setPassword} placeholder="••••••••" isPassword showPassword={showPassword} onTogglePassword={togglePw} isSignup={view === 'signup'} />
                  {view === 'signup' && (
                    <InputField label="Confirm Security Key" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" isPassword showPassword={showPassword} onTogglePassword={togglePw} isSignup />
                  )}
                </div>
              )}

              {view === 'login' && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setView('forgot'); resetMessages(); }} className="text-[10px] font-black uppercase text-neutral-500 hover:text-legal-gold tracking-widest transition-colors">Recover Identity</button>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl hover:bg-legal-gold hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
              >
                {loading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                {view === 'login' ? 'Authenticate' : view === 'forgot' ? 'Dispatch Reset' : 'Establish Identity'}
              </button>

              {(view === 'login' || view === 'signup') && (
                <>
                  <div className="relative py-10 flex items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-6 text-[9px] font-black text-neutral-700 uppercase tracking-[0.6em]">Or Choose</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-4 px-4 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-white hover:bg-white/[0.06] transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                    Federated Access
                  </button>

                  <div className="text-center mt-10">
                    <button 
                      type="button"
                      onClick={() => { resetMessages(); if (view === 'login') setView('role'); else setView('login'); }}
                      className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.3em] hover:text-legal-gold transition-colors"
                    >
                      {view === 'login' ? "Register ireme Identity" : "Already Identified? Login"}
                    </button>
                  </div>
                </>
              )}

              {view === 'forgot' && (
                <div className="text-center mt-10">
                  <button type="button" onClick={() => { setView('login'); resetMessages(); }} className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.3em] hover:text-legal-gold transition-colors">Return to Identification</button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      
      <div className="mt-16 text-center text-[9px] text-neutral-700 font-black uppercase tracking-[0.8em] opacity-40">
        IREME AI • REPUBLIC OF RWANDA
      </div>
    </div>
  );
};

const RoleButton = ({ icon, title, sub, onClick }: any) => (
  <button onClick={onClick} className="w-full p-6 bg-white/[0.03] border border-white/5 rounded-[1.5rem] hover:border-legal-gold hover:bg-white/[0.08] transition-all text-left flex items-center gap-6 group">
    <span className="text-4xl transition-transform group-hover:scale-110 group-hover:rotate-6">{icon}</span>
    <div className="flex flex-col">
      <span className="text-base font-black uppercase text-white tracking-tight">{title}</span>
      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{sub}</span>
    </div> 
  </button>
);

export default AuthPage;