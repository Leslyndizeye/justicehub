import React from 'react';

const testimonials = [
  {
    quote: "Absolute precision in Kinyarwanda synthesis. Essential for any High Court petition.",
    author: "Counsel Olivier K.",
    role: "Advocate @ RLRC Protocol",
    emoji: "⚜",
    dark: true
  },
  {
    quote: "Processing legislative records from the Official Gazette is now instantaneous.",
    author: "Justice Uwase M.",
    role: "Appellate Magistrate",
    emoji: "⌘",
    dark: false
  },
  {
    quote: "Finally, a tool that translates statutory complexity into civic clarity. Pure equity.",
    author: "Clarisse G.",
    role: "Ombudsman Office",
    emoji: "✦",
    dark: true
  },
  {
    quote: "The IECMS integration is flawless. Filing throughput has increased by 400%.",
    author: "Maitre Jean Bosco",
    role: "Managing Partner",
    emoji: "※",
    dark: false
  },
  {
    quote: "Ireme ensures ubutabera is not just a concept, but an accessible reality.",
    author: "Dr. Sandrine U.",
    role: "Constitutional Expert",
    emoji: "⁕",
    dark: true
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-32 bg-neutral-100 dark:bg-[#05070A] overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 mb-24 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-legal-gold/10 border border-legal-gold/20 text-[10px] font-black tracking-widest text-legal-gold uppercase mb-8">
          Learned Testimony
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-legal-navy dark:text-white leading-none">
          ENDORSED BY THE <br />
          <span className="text-legal-gold">FRATERNITY.</span>
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative flex overflow-hidden mask-marquee">
        <div className="flex animate-scroll whitespace-nowrap py-12 gap-10">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div 
              key={idx}
              className={`inline-block w-[350px] md:w-[500px] p-10 md:p-12 rounded-[3.5rem] transition-all duration-1000 transform hover:scale-[1.05] whitespace-normal shrink-0 shadow-2xl
                ${t.dark ? 'bg-legal-navy text-white border border-white/5' : 'bg-white text-legal-navy'}`}
            >
              <div className="flex items-center gap-6 mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform hover:rotate-12 ${t.dark ? 'bg-white/5' : 'bg-legal-navy/5'}`}>
                  {t.emoji}
                </div>
                <div>
                  <div className="font-black text-lg md:text-xl tracking-tighter">{t.author}</div>
                  <div className={`text-[9px] font-black uppercase tracking-[0.4em] mt-1 ${t.dark ? 'text-legal-gold' : 'text-legal-navy'}`}>
                    {t.role}
                  </div>
                </div>
              </div>
              <p className="text-lg md:text-2xl font-medium leading-[1.3] tracking-tight italic">
                "{t.quote}"
              </p>
              
              <div className={`mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[8px] font-black uppercase tracking-widest ${t.dark ? 'bg-white/10 text-white' : 'bg-legal-navy/10 text-legal-navy'}`}>
                VERIFIED COUNSEL
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;