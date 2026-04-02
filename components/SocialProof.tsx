import React from 'react';

const partners = [
  { 
    name: "MINIJUST", 
    full: "Ministry of Justice", 
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L2 8V21H22V8L12 3ZM12 5.5L19.5 9.25V18.5H4.5V9.25L12 5.5ZM7 11V16H9V11H7ZM11 11V16H13V11H11ZM15 11V16H17V11H15Z"/>
      </svg>
    )
  },
  { 
    name: "RWANDA BAR", 
    full: "Bar Association", 
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 7V12C3 17.5 7.1 22.1 12 23C16.9 22.1 21 17.5 21 12V7L12 2ZM19 12C19 16.4 15.9 20.2 12 21C8.1 20.2 5 16.4 5 12V8.4L12 4.5L19 8.4V12ZM12 7L8 10H16L12 7ZM8 12H11V17H13V12H16L12 9L8 12Z"/>
      </svg>
    )
  },
  { 
    name: "JUDICIARY", 
    full: "Supreme Court", 
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L2 6V11C2 16.5 6.3 21.1 12 22C17.7 21.1 22 16.5 22 11V6L12 1ZM20 11C20 15.4 16.6 19.1 12 20C7.4 19.1 4 15.4 4 11V7.3L12 3.3L20 7.3V11ZM12 6L7 9V11H17V9L12 6ZM9 13H11V18H13V13H15L12 10L9 13Z"/>
      </svg>
    )
  },
  { 
    name: "UNDP", 
    full: "Rwanda Mission", 
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2ZM12 20C7.6 20 4 16.4 4 12S7.6 4 12 4 20 7.6 20 12 16.4 20 12 20ZM11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"/>
      </svg>
    )
  },
  { 
    name: "ILPD", 
    full: "Legal Practice Inst.", 
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H7V11L9.5 9.5L12 11V4H18V20Z"/>
      </svg>
    )
  },
  { 
    name: "OFFICIAL GAZETTE", 
    full: "Republic of Rwanda", 
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18ZM6 10H14V12H6V10ZM6 14H14V16H6V14ZM16 10H18V16H16V10Z"/>
      </svg>
    )
  }
];

const SocialProof: React.FC = () => {
  return (
    <div className="py-20 bg-neutral-100 dark:bg-[#05070A] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-legal-gold/5 border border-legal-gold/20">
            <span className="text-[9px] font-black text-legal-gold uppercase tracking-[0.6em]">
              Validated Protocols
            </span>
          </div>
        </div>
        
        <div className="relative flex overflow-hidden mask-marquee mb-16">
          <div className="flex animate-scroll whitespace-nowrap py-4 gap-24">
            {[...partners, ...partners].map((p, idx) => (
              <div key={idx} className="flex items-center gap-6 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-legal-gold group-hover:text-white shadow-lg shadow-black/5">
                  <div className="group-hover:scale-110 transition-transform scale-75 md:scale-100">{p.logo}</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-black text-legal-navy dark:text-white tracking-tighter leading-none group-hover:text-legal-gold transition-colors">{p.name}</span>
                  <span className="text-[7px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">{p.full}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
          <StatCard val="3.2k+" label="Legal Professionals" />
          <StatCard val="99.9%" label="Accuracy Rating" />
          <StatCard val="1.2m+" label="Cases Analyzed" />
          <StatCard val="350ms" label="Processing Speed" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ val, label }: { val: string, label: string }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="text-3xl md:text-4xl font-black mb-2 text-legal-navy dark:text-white group-hover:text-legal-gold transition-all duration-500 tracking-tighter">
      {val}
    </div>
    <div className="text-[7px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.4em] group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
      {label}
    </div>
  </div>
);

export default SocialProof;