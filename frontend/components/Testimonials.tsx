import React from 'react';

const examples = [
  { title: 'Your rights', question: 'What are my rights at work?' },
  { title: 'Legal documents', question: 'Can you explain this part of my contract?' },
  { title: 'Legal research', question: 'Where can I find the official text of this law?' },
];

const Testimonials: React.FC = () => (
  <section id="testimonials" className="py-24 px-6 md:px-12 bg-neutral-100 dark:bg-[#05070A]">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-legal-navy dark:text-white text-center mb-4">Not sure where to start?</h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-center mb-10">Here are a few questions you can ask.</p>
      <div className="grid md:grid-cols-3 gap-5">{examples.map(example => <div key={example.title} className="p-7 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03]"><h3 className="text-sm font-semibold text-legal-gold mb-4">{example.title}</h3><p className="text-lg text-legal-navy dark:text-white leading-relaxed">“{example.question}”</p></div>)}</div>
    </div>
  </section>
);

export default Testimonials;
