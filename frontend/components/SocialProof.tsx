import React from 'react';

const SocialProof: React.FC = () => (
  <section className="py-14 px-6 bg-neutral-100 dark:bg-[#05070A]" aria-label="Supported languages">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Use the language you feel comfortable with.</p>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10">
        {['Ikinyarwanda', 'English', 'Français'].map(language => <span key={language} className="px-5 py-3 rounded-full border border-legal-gold/20 text-legal-navy dark:text-white text-base font-semibold">{language}</span>)}
      </div>
    </div>
  </section>
);

export default SocialProof;
