import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Support old replies containing <br> without enabling arbitrary HTML.
export function remarkSafeBreaks() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (!node.children) return;
      node.children = node.children.flatMap((child: any) => {
        if (child.type === 'html' && /^\s*<br\s*\/?\s*>\s*$/i.test(child.value)) {
          return [{ type: 'break' }];
        }
        visit(child);
        return [child];
      });
    };
    visit(tree);
  };
}

const ChatMarkdown: React.FC<{ content: string }> = ({ content }) => (
  <div className="chat-markdown">
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkSafeBreaks]}
    skipHtml
    components={{
      h1: ({ children }) => <h1 className="mt-6 mb-3 text-xl font-semibold text-white first:mt-0">{children}</h1>,
      h2: ({ children }) => <h2 className="mt-6 mb-3 text-lg font-semibold text-white first:mt-0">{children}</h2>,
      h3: ({ children }) => <h3 className="mt-5 mb-2 text-base font-semibold text-white first:mt-0">{children}</h3>,
      p: ({ children }) => <p className="mb-4 leading-[1.8] last:mb-0">{children}</p>,
      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
      ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 marker:text-legal-gold">{children}</ul>,
      ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 marker:font-medium marker:text-legal-gold">{children}</ol>,
      li: ({ children }) => <li className="pl-1 leading-[1.8] [&>p]:mb-2 [&>ul]:my-2 [&>ol]:my-2">{children}</li>,
      a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="break-words text-legal-gold underline decoration-legal-gold/40 underline-offset-4 hover:decoration-legal-gold">{children}</a>,
      table: ({ children }) => <div className="chat-table-scroll my-5 w-full overflow-x-auto rounded-xl border border-white/10"><table className="w-full border-collapse text-left text-sm">{children}</table></div>,
      thead: ({ children }) => <thead className="bg-white/[0.06] text-white">{children}</thead>,
      tbody: ({ children }) => <tbody className="divide-y divide-white/10">{children}</tbody>,
      th: ({ children }) => <th className="min-w-[140px] px-4 py-3 align-top font-semibold">{children}</th>,
      td: ({ children }) => <td className="min-w-[140px] px-4 py-3 align-top leading-relaxed">{children}</td>,
      blockquote: ({ children }) => <blockquote className="my-4 border-l-2 border-legal-gold/50 pl-4 text-neutral-400">{children}</blockquote>,
      pre: ({ children }) => <pre className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-neutral-200">{children}</pre>,
      code: ({ children, className }) => <code className={`rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-legal-gold ${className || ''}`}>{children}</code>,
      hr: () => <hr className="my-6 border-white/10" />,
    }}
  >
    {content}
  </ReactMarkdown>
  </div>
);

export default ChatMarkdown;
