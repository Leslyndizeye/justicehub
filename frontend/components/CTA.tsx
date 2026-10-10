import React from 'react';
import { Link } from 'react-router-dom';

const CTA: React.FC = () => (
  <section className="py-24 md:py-32 px-6 md:px-12 bg-neutral-100 dark:bg-[#05070A]">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-legal-navy dark:text-white mb-7 leading-tight">Have a question?<br /><span className="text-legal-gold">Let’s start there.</span></h2>
      <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed">You don’t need to know legal terms to ask. Describe your question in your own words, and JusticeHub will help you explore it.</p>
      <Link to="/auth" className="inline-block px-10 py-4 bg-legal-gold text-legal-navy font-semibold text-sm rounded-full hover:opacity-90 transition-opacity">Start for free</Link>
      <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">Free during the beta. No payment card needed.</p>
      <p className="mt-12 pt-8 border-t border-neutral-200 dark:border-white/10 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">JusticeHub provides information and research support. For decisions about your case, check the official sources and speak with a qualified legal professional.</p>
    </div>
  </section>
);

export default CTA;
