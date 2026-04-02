import React, { useEffect, useRef, useState } from 'react';

const features = [
  {
    title: "JURISPRUDENTIAL MODELS",
    desc: "Seamlessly analyze codified records across Kinyarwanda and French using neural models trained on the Republic's history.",
    icon: "⚜"
  },
  {
    title: "GAZETTE SYNTHESIS",
    desc: "Real-time extraction of statutory updates from the Journal Officiel. Cite with infallible authority and currency.",
    icon: "⁂"
  },
  {
    title: "LITIGANT GUIDANCE",
    desc: "AI-driven clarify for family, property, and civil law. Reducing the distance between amategeko and everyday citizens.",
    icon: "⊕"
  },
  {
    title: "FORENSIC DISCOVERY",
    desc: "Instant search and cross-referencing across voluminous case files to build robust comparative jurisprudential foundations.",
    icon: "⎈"
  },
  {
    title: "SOVEREIGN DATA CLOUD",
    desc: "Zero-knowledge encryption for sensitive files, hosted on local Rwandan nodes for absolute data autonomy.",
    icon: "⍟"
  },
  {
    title: "IECMS OPTIMIZATION",
    desc: "Statutory formatting for direct upload to the Integrated Electronic Case Management System. Eliminating procedural friction.",
    icon: "⌬"
  }
];

const Features: React.FC = () => {
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
    <section id="features" ref={sectionRef} className="py-24 px-6 md:px-12 relative bg-neutral-100 dark:bg-[#05070A]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-neutral-300 dark:border-white/5">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group p-10 border border-neutral-300 dark:border-white/5 hover:bg-neutral-200/50 dark:hover:bg-white/[0.02] transition-all duration-500 reveal ${isVisible ? 'active' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-3xl mb-8 transition-transform group-hover:scale-110 group-hover:rotate-12 inline-block">
                {f.icon}
              </div>
              <h3 className="text-lg font-black mb-3 text-legal-navy dark:text-white uppercase tracking-tight">{f.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-[13px] leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;