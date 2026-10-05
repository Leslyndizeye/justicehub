import React, { useState } from 'react';

const faqs = [
  {
    q: "How does JusticeHub ensure data sovereignty for Rwandan legal firms?",
    a: "We operate on local sovereign clouds within Kigali, fully compliant with the Law No. 058/2021 relating to the protection of personal data and privacy, and the 2025 Digital Sovereignty Directives."
  },
  {
    q: "Does the AI support 'Amategeko' terminology in legal Kinyarwanda?",
    a: "Yes. Our models are trained specifically on the Journal Officiel (Official Gazette) and judicial records, capturing the high-level linguistic nuances of Rwandan legislative Kinyarwanda."
  },
  {
    q: "Is JusticeHub an official partner of the Rwanda Law Reform Commission (RLRC)?",
    a: "JusticeHub is a private legal-tech initiative engineered to support legal professionals. While we integrate with RLRC standards and gazette nodes, we are an independent technology provider for Advocates and Legal Officers."
  },
  {
    q: "Can the AI generate documents for the IECMS?",
    a: "Absolutely. JusticeHub includes a specialized formatting engine that prepares documents specifically for direct upload to the Integrated Electronic Case Management System (IECMS)."
  }
];

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-32 px-6 md:px-12 bg-neutral-100 dark:bg-[#05070A]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black mb-12 text-center text-legal-navy dark:text-white tracking-tight uppercase">System Protocol & Compliance</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 hover:border-legal-gold/30 transition-all duration-500 group cursor-default">
              <h3 className="text-base font-black mb-4 flex justify-between items-center text-legal-navy dark:text-white group-hover:text-legal-gold transition-colors tracking-tight uppercase">
                {f.q}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-medium">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;