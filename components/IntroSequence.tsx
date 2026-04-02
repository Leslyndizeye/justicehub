
import React, { useEffect, useState } from 'react';

interface IntroSequenceProps {
  onFinish: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'words' | 'logo'>('words');
  const [currentWord, setCurrentWord] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  const segments = [
    { main: "Equity", sub: "FOUNDATION" },
    { main: "ireme Justice", sub: "THE FUTURE OF RWANDAN LAW" }
  ];

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => {
        if (prev < segments.length - 1) return prev + 1;
        clearInterval(wordInterval);
        return prev;
      });
    }, 800);

    const logoTimeout = setTimeout(() => {
      setPhase('logo');
    }, 1800);

    const fadeTimeout = setTimeout(() => {
      setFadingOut(true);
    }, 2800);

    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 3400);

    return () => {
      clearInterval(wordInterval);
      clearTimeout(logoTimeout);
      clearTimeout(fadeTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[1000] bg-[#05070A] flex items-center justify-center overflow-hidden transition-opacity duration-600 ${fadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 grid-lines opacity-[0.03]"></div>

      <div className={`transition-opacity duration-500 ${phase === 'words' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="relative flex flex-col items-center justify-center h-32">
          {segments.map((seg, idx) => (
            <div
              key={seg.main}
              className={`absolute flex flex-col items-center transition-all duration-500
                ${currentWord === idx
                  ? 'opacity-100 translate-y-0 blur-none'
                  : 'opacity-0 translate-y-4 blur-sm'}`}
            >
              <h1 className="text-white text-4xl md:text-6xl font-serif italic tracking-tight text-center">
                {seg.main}
              </h1>
              <div className="mt-4 h-[1px] w-12 bg-legal-gold/40"></div>
              <span className="mt-4 text-neutral-500 text-[10px] font-black tracking-[0.6em] uppercase text-center">
                {seg.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`absolute flex flex-col items-center gap-8 transition-all duration-700 ${phase === 'logo' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="relative">
          <div className="absolute inset-[-20px] bg-legal-gold/5 blur-[40px] rounded-full"></div>
          <div className="relative z-10 w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-12 h-12 text-legal-gold opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase">IREME</h2>
        </div>
      </div>
    </div>
  );
};

export default IntroSequence;
