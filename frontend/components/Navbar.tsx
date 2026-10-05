import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

interface NavbarProps {
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogoVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setIsMobileMenuOpen(false);
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'Solutions', id: 'services' },
    { name: 'Intelligence', id: 'features' },
    { name: 'Method', id: 'process' },
    { name: 'Access', id: 'pricing' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] px-4 md:px-6 py-4 md:py-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-white/95 dark:bg-legal-navy/80 border border-neutral-100 dark:border-white/5 backdrop-blur-3xl pointer-events-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
          
          <div 
            className={`flex items-center gap-2 md:gap-3 cursor-pointer group transition-all duration-1000 ${isLogoVisible ? 'opacity-100 translate-x-0 blur-none' : 'opacity-0 -translate-x-12 blur-md'}`} 
            onClick={() => scrollTo('hero')}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-legal-gold flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-legal-gold/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-legal-navy dark:text-white uppercase">JusticeHub</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[9px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.3em]">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollTo(link.id)} 
                className="hover:text-legal-gold transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-legal-gold transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:scale-110 transition-all shadow-sm"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-legal-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-legal-navy" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            
            <button
              onClick={() => navigate('/auth')}
              className="px-6 md:px-8 py-2.5 md:py-3.5 bg-black dark:bg-white text-white dark:text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.05] active:scale-95 transition-all shadow-xl dark:shadow-white/10"
            >
              Login
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-500 dark:text-neutral-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div 
        className={`fixed inset-0 z-[140] lg:hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-[#05070A]/80 backdrop-blur-2xl" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-white dark:bg-legal-navy p-10 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="mt-16 space-y-8">
            {navLinks.map((link, idx) => (
              <button 
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`block w-full text-left text-3xl font-black tracking-tighter transition-all duration-500 delay-[${idx * 100}ms] ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} ${isDark ? 'text-white hover:text-legal-gold' : 'text-legal-navy hover:text-legal-gold'}`}
              >
                {link.name}
              </button>
            ))}
          </div>
          
          <div className="mt-auto pt-10 border-t border-neutral-100 dark:border-white/5">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400 mb-4">Support Protocol</div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Establishing a new standard for sovereign Rwandan legal intelligence.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;