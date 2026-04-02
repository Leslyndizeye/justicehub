import React, { useState, useEffect, useRef } from 'react';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
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

  const plans = [
    {
      name: "Abunzi Core",
      price: "0",
      desc: "Essential AI legal access for mediation committees and citizens seeking basic ubutabera.",
      cta: "Access Portal",
      featured: false,
      features: ["Plain Kinyarwanda Support", "Basic Gazette Search", "Public Rights Chat", "Mediation Helper"]
    },
    {
      name: "Advocate Plus",
      price: billingCycle === 'monthly' ? "65,000" : "650,000",
      desc: "The standard for legal professionals. Full IECMS integration and RLRC-verified jurisprudential analysis.",
      cta: "Secure Trial",
      featured: true,
      features: ["Advanced Case Mapping", "IECMS E-Filing Engine", "Unlimited Gazette Access", "Drafting Intelligence"]
    },
    {
      name: "Judicial Enterprise",
      price: "Custom",
      desc: "For large chambers and government institutions requiring high-security nodes.",
      cta: "Inquire Protocol",
      featured: false,
      features: ["Sovereign Local Cloud", "Institutional API", "Multi-User Chambers", "Direct MINIJUST Sync"]
    }
  ];

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-40 px-6 md:px-12 bg-neutral-100 dark:bg-[#05070A] relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <div className="absolute top-40 left-10 w-24 h-24 border border-legal-gold/20 rounded-xl rotate-12"></div>
        <div className="absolute top-60 right-20 w-32 h-32 border border-legal-gold/20 rounded-2xl -rotate-12"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-legal-gold/30 bg-legal-gold/10 text-legal-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6">
            Scalable Excellence
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-legal-navy dark:text-white mb-8 leading-tight">
            Tailored Access for the <br />
            <span className="text-legal-gold font-serif italic text-2xl md:text-4xl">Rwandan Legal Ecosystem</span>
          </h2>

          <div className="inline-flex p-1 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-legal-gold text-white' : 'text-neutral-500 hover:text-legal-navy dark:hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${billingCycle === 'annual' ? 'bg-legal-gold text-white' : 'text-neutral-500 hover:text-legal-navy dark:hover:text-white'}`}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <div 
              key={i} 
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`relative p-8 rounded-[2rem] transition-all duration-700 flex flex-col ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${
                p.featured
                  ? 'bg-neutral-50 dark:bg-legal-charcoal border-legal-gold/40 shadow-2xl scale-[1.02] z-20 border'
                  : 'bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-legal-navy dark:text-white shadow-xl backdrop-blur-3xl'
              }`}
            >
              {p.featured && (
                <div className="absolute top-6 right-6 bg-legal-gold/20 border border-legal-gold/30 text-legal-gold px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em]">
                  Recommended
                </div>
              )}

              <h3 className={`text-lg font-black mb-4 tracking-tight ${p.featured ? 'text-legal-gold' : 'text-legal-navy dark:text-white'}`}>{p.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black tracking-tighter text-legal-navy dark:text-white">
                  {p.price !== 'Custom' && 'RWF '}
                  {p.price}
                </span>
                {p.price !== 'Custom' && <span className="text-[10px] font-bold opacity-30 text-neutral-400">,00</span>}
              </div>

              <p className={`text-[11px] mb-8 leading-relaxed font-medium min-h-[40px] ${p.featured ? 'text-neutral-600 dark:text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {p.desc}
              </p>

              <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all mb-8 shadow-xl ${
                p.featured
                  ? 'bg-legal-gold text-white hover:opacity-90'
                  : 'bg-neutral-200 dark:bg-white/10 text-legal-navy dark:text-white hover:bg-neutral-300 dark:hover:bg-white/20'
              }`}>
                {p.cta}
              </button>

              <div className="space-y-4">
                <p className={`text-[7px] font-black uppercase tracking-[0.3em] ${p.featured ? 'text-legal-gold' : 'text-neutral-500 dark:text-neutral-500'}`}>
                  System Specifications :
                </p>
                <ul className="space-y-3">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-[10px] font-bold tracking-tight">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${p.featured ? 'bg-legal-gold text-white' : 'bg-neutral-200 dark:bg-white/10 text-legal-gold'}`}>
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <span className={p.featured ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-700 dark:text-neutral-400'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;