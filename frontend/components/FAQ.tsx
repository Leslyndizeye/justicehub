import React from 'react';

const faqs = [
  { q: 'Is JusticeHub free?', a: 'Yes. JusticeHub is free during the beta, with no paid plans or payment card required. Usage limits can affect chat availability.' },
  { q: 'Can I ask in Ikinyarwanda?', a: 'Yes. You can use Ikinyarwanda, English, or French. JusticeHub follows the language of your message automatically. You can ask for a simpler explanation at any time.' },
  { q: 'Can JusticeHub handle my case for me?', a: 'JusticeHub helps you understand legal information and prepare questions. It does not represent you, file cases, or decide what a court will do.' },
  { q: 'How do I check an answer?', a: 'Open the source links in the answer and read the official text. Answers and translations can contain mistakes, and laws can change. Check important details before acting on them.' },
  { q: 'Should I share private case details?', a: 'Share only what is needed to explain your question. Leave out passwords, identity numbers, and other people’s private information. Your messages are processed by AI services, and saved chats remain in your account.' },
];

const FAQ: React.FC = () => (
  <section id="faq" className="py-24 md:py-32 px-6 md:px-12 bg-neutral-100 dark:bg-[#05070A]">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-legal-navy dark:text-white tracking-tight">Questions you may have</h2>
      <div className="space-y-4">{faqs.map(faq => <div key={faq.q} className="p-7 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10"><h3 className="text-base font-semibold mb-3 text-legal-navy dark:text-white">{faq.q}</h3><p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{faq.a}</p></div>)}</div>
    </div>
  </section>
);

export default FAQ;
