import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-neutral-100 dark:bg-[#05070A]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-legal-navy dark:text-white mb-8 leading-[0.85]">
          A NEW ERA <br />
          <span className="text-legal-gold">BEGINS.</span>
        </h2>
        
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
          Join the vanguard of legal professionals shaping the future of Rwandan justice. 
          Deployment takes seconds. Impact lasts forever.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button className="w-full sm:w-auto px-10 py-5 bg-legal-gold text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_-15px_rgba(197,160,89,0.6)]">
            Start Your Journey
          </button>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-legal-navy bg-legal-gold/20 flex items-center justify-center text-[10px] font-bold text-legal-navy dark:text-white shadow-xl">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-legal-navy dark:text-white font-black text-[11px] tracking-tight">2,400+ Active</div>
              <div className="text-neutral-500 text-[7px] uppercase font-bold tracking-widest">RLRC Registered</div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-neutral-200 dark:border-white/5 flex flex-wrap items-center justify-center gap-8 text-neutral-500 text-[8px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-legal-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
            Sovereign Rwandan Data
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-legal-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
            Official Gazette Integrated
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-legal-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
            Court Filing Compatible
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;