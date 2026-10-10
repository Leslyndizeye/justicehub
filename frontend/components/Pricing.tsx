import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const features = [
  'Ask in Ikinyarwanda, English, or French',
  'Understand your rights and responsibilities',
  'Get help reading legal terms and document passages',
  'Explore legal references and source links',
  'Save conversations and return to them later',
];

const Pricing: React.FC = () => (
  <section id="pricing" className="py-24 md:py-32 px-6 md:px-12 bg-neutral-100 dark:bg-[#05070A]">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 rounded-full border border-legal-gold/30 bg-legal-gold/10 text-legal-gold text-xs font-semibold mb-6">Free during the beta</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-legal-navy dark:text-white leading-tight mb-5">
          Free access <br /><span className="text-legal-gold font-serif italic">for everyone.</span>
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl mx-auto">
          Whether you’re learning about your rights or researching a legal question, start with JusticeHub at no cost.
        </p>
      </div>
      <div className="p-7 md:p-10 rounded-[2rem] border border-legal-gold/30 bg-white dark:bg-white/[0.04] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-legal-navy dark:text-white mb-3">JusticeHub Free</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">One account to ask questions, learn, and keep your conversations together.</p>
          </div>
          <div className="sm:text-right shrink-0">
            <p className="text-4xl font-bold tracking-tight text-legal-navy dark:text-white">RWF 0</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">No payment card needed</p>
          </div>
        </div>
        <ul className="space-y-4 mb-8">
          {features.map(feature => <li key={feature} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed"><Check size={19} className="text-legal-gold shrink-0 mt-0.5" aria-hidden="true" /><span>{feature}</span></li>)}
        </ul>
        <Link to="/auth" className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-legal-gold text-legal-navy font-semibold text-sm hover:opacity-90 transition-opacity">Start for free<ArrowRight size={18} aria-hidden="true" /></Link>
        <p className="mt-5 text-center text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">Free access has usage limits. If chat is busy, you may need to try again later.</p>
      </div>
    </div>
  </section>
);

export default Pricing;
