import React, { useEffect, useRef, useState } from 'react';

const features = [
  {
    title: "Three languages",
    desc: "Ask questions in Ikinyarwanda, English, or French and review explanations alongside legal references and source links.",
    icon: "⚜"
  },
  {
    title: "Source links",
    desc: "Open the legal sources linked in an answer and read the original information for yourself.",
    icon: "⁂"
  },
  {
    title: "Plain explanations",
    desc: "Ask what a legal word or procedure means, and follow up when you need a simpler explanation.",
    icon: "⊕"
  },
  {
    title: "Follow-up questions",
    desc: "Keep exploring a topic in the same chat without starting your explanation again.",
    icon: "⎈"
  },
  {
    title: "Saved conversations",
    desc: "Sign in to revisit your earlier questions and continue a saved conversation.",
    icon: "⍟"
  },
  {
    title: "Help with research",
    desc: "Organise questions, review explanations, and explore lawful options while preparing for a case.",
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
