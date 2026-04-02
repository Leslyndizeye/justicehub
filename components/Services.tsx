import React, { useState, useEffect, useRef } from 'react';

const serviceList = [
  {
    id: "01",
    title: "ADVOCATE ANALYTICS",
    role: "Learned Counsel",
    description: "High-precision synthesis of Supreme Court and High Court rulings. Identify winning legal arguments and judicial trends with automated precedent mapping and verified statutory archives.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "02",
    title: "IECMS OPTIMIZATION",
    role: "Officer of the Court",
    description: "Automated preparation and strategic formatting of legal submissions for the Integrated Electronic Case Management System, ensuring 100% compliance with RLRC procedural standards.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "03",
    title: "MEDIATION PORTAL",
    role: "Legal Mediator",
    description: "Empowering mediation committees and citizens with AI-driven translations of statutory law into plain Kinyarwanda, bridging the gap between legislation and public equity.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "04",
    title: "STATUTORY SEARCH",
    role: "Legal Researcher",
    description: "High-speed semantic search across the entire Official Gazette archive, dating back to historical land laws and post-1994 legislative reforms, synced with sovereign data nodes.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800"
  }
];

const Services: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const hoverTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleMouseEnter = (id: string) => {
    setActiveId(id);
    setShowImage(true);
    
    // Clear any existing timer when switching services
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    
    // Auto-hide the image after 2 seconds while still hovering to allow reading the text
    hoverTimerRef.current = window.setTimeout(() => {
      setShowImage(false);
    }, 2000);
  };

  const handleMouseLeave = () => {
    setActiveId(null);
    setShowImage(false);
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
  };

  return (
    <section id="services" ref={sectionRef} className="py-24 md:py-40 px-6 bg-neutral-100 dark:bg-[#05070A] transition-colors duration-500 overflow-hidden">
      {/* 80% screen constraint for high-end look */}
      <div className="max-w-6xl mx-auto">
        <div className={`mb-20 md:mb-32 reveal ${isVisible ? 'active' : ''}`}>
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="h-[1px] w-8 md:w-12 bg-legal-gold"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-legal-gold">Legal Engineering & Strategy</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-legal-navy dark:text-white uppercase leading-none max-w-4xl">
            IREME JUSTICE DEPLOYS <br />
            <span className="font-serif italic text-legal-gold">Sovereign Jurisprudential Precision</span>
          </h2>
        </div>

        <div className="relative border-t border-neutral-100 dark:border-white/5">
          {serviceList.map((service) => (
            <div
              key={service.id}
              onMouseEnter={() => handleMouseEnter(service.id)}
              onMouseLeave={handleMouseLeave}
              className={`group relative flex flex-col md:flex-row items-center justify-between py-12 md:py-16 px-6 md:px-10 border-b border-neutral-100 dark:border-white/5 transition-all duration-500 md:cursor-none
                ${activeId === service.id ? 'bg-neutral-950 dark:bg-white text-white dark:text-black z-10' : 'text-legal-navy dark:text-white'}`}
            >
              <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto mb-6 md:mb-0">
                <span className={`text-lg md:text-xl font-black transition-colors duration-500 ${activeId === service.id ? 'text-neutral-500' : 'text-neutral-300 dark:text-white/20'}`}>
                  {service.id}
                </span>
                <div className="flex flex-col">
                  {/* Title remains static, no movement on hover as requested */}
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none mb-1 transition-none">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${activeId === service.id ? 'text-legal-gold' : 'text-neutral-400'}`}>
                      {service.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full md:max-w-2xl">
                <p className={`text-sm md:text-base leading-relaxed font-medium transition-colors duration-500 ${activeId === service.id ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {service.description}
                </p>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500
                  ${activeId === service.id ? 'bg-white dark:bg-black border-transparent rotate-45' : 'border-neutral-200 dark:border-white/10'}`}>
                  <svg className={`w-5 h-5 md:w-6 md:h-6 ${activeId === service.id ? 'text-black dark:text-white' : 'text-neutral-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </div>
              </div>

              {/* Floating Hover Image Follower - Vanishes after 2 seconds to avoid obscuring text */}
              <div className="hidden md:block">
                <div
                  className={`fixed pointer-events-none z-[200] w-72 h-96 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out transform
                    ${(activeId === service.id && showImage) ? 'opacity-100 scale-100 rotate-12 blur-none translate-y-0' : 'opacity-0 scale-75 rotate-0 blur-3xl translate-y-10'}`}
                  style={{
                    left: mousePos.x + 30,
                    top: mousePos.y - 180,
                    transition: (activeId === service.id && showImage) ? 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)' : 'opacity 0.3s ease-in'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-10 left-8 right-8 text-white z-20">
                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-legal-gold mb-2">Legal Infrastructure</div>
                    <div className="text-xl font-black tracking-tight leading-none uppercase">{service.title} <br/> {service.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;