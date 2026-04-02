import React, { useEffect, useRef, useState } from 'react';

const steps = [
  {
    num: "01",
    title: "Upload & Ingest",
    desc: "Simply drop your case files, evidence, or legislation queries into the secure Ireme portal."
  },
  {
    num: "02",
    title: "AI Analysis",
    desc: "Our model cross-references your documents against thousands of Rwandan legal precedents in seconds."
  },
  {
    num: "03",
    title: "Generate & Refine",
    desc: "Receive drafts, summaries, or citations. Use our collaborative editor to perfect the final output."
  }
];

const Process: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="py-24 md:py-32 bg-neutral-100 dark:bg-[#05070A] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-legal-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 px-6 md:px-12">
        <div className={`text-center mb-16 md:mb-24 reveal ${isVisible ? 'active' : ''}`}>
          <div className="text-[9px] font-black uppercase tracking-[0.5em] text-legal-gold mb-3">The Workflow</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-legal-navy dark:text-white leading-tight">Streamlined Justice.</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-base font-light max-w-xl mx-auto leading-relaxed">From complex data to actionable legal intelligence in three steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16 relative">
          {steps.map((s, i) => (
            <div
              key={i}
              style={{ transitionDelay: `${i * 200}ms` }}
              className={`relative reveal ${isVisible ? 'active' : ''}`}
            >
              <div className="text-6xl md:text-[6.5rem] font-black text-legal-navy/5 dark:text-white/5 absolute -top-12 md:-top-16 -left-4 md:-left-6 select-none tracking-tighter">{s.num}</div>
              <div className="relative z-10 pt-8 md:pt-10">
                <h3 className="text-xl md:text-2xl font-black mb-4 text-legal-navy dark:text-white tracking-tight uppercase">{s.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light text-sm md:text-base">{s.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-[40%] -right-8 w-16 h-[1px] bg-gradient-to-r from-legal-gold/30 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;