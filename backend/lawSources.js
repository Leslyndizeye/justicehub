import catalog from './data/amategekoCatalog.json' with {type:'json'};
import { excerptArticles } from './lawArticles.js';

const documents = new Map(catalog.documents.map(doc=>[doc.key,doc]));

// Show the actual dated PDFs supplied to the model even when it omits a link.
// This is provenance, not a claim that generated legal statements were verified.
export function finishLawReply(text, excerpts = [], language = 'en') {
  if (!text.trim()) return text;
  const sources = new Map();
  for (const excerpt of excerpts) {
    const match = String(excerpt.content).match(/^\[Amategeko PDF: ([\w-]+); language: (?:rw|en|fr); page: (\d+);/);
    const doc = match && documents.get(match[1]);
    if (!doc) continue;
    try {
      const url = new URL(excerpt.source);
      const page = Number(match[2]);
      if (url.protocol !== 'https:' || url.username || url.password || url.search
        || url.pathname !== `/storage/v1/object/public/justicehub-legal-sources/amategeko/${doc.sha256}.pdf`
        || url.hash !== `#page=${page}` || page < 1 || page > doc.pages) continue;
      url.hash = '';
      if (text.includes(url.href)) continue;
      const source = sources.get(url.href) || {title:(doc.filename || doc.title).replace(/[\[\]\\\r\n]/g,' ').slice(0,170),url:excerpt.source,pages:new Set(),articles:new Set()};
      source.pages.add(page);
      for(const extra of excerpt.pdfPages || [])if(Number.isInteger(extra) && extra>=page && extra<=doc.pages)source.pages.add(extra);
      for (const number of excerptArticles(excerpt)) source.articles.add(number);
      sources.set(url.href,source);
    } catch { /* Malformed source metadata never becomes a clickable citation. */ }
  }
  if (!sources.size) return text;
  const label = {en:'Reference PDFs (published versions)',rw:'Inyandiko za PDF zifashishijwe (zashyizwe ahagaragara)',fr:'PDF de référence (versions publiées)'}[language] || 'Reference PDFs (published versions)';
  const pageWord = {en:'pages',rw:'paji',fr:'pages'}[language] || 'pages';
  const articleWord = {en:'Articles',rw:'Ingingo',fr:'Articles'}[language] || 'Articles';
  return `${text}\n\n${label}:\n${[...sources.values()].map(source=>`- [${source.title}](${source.url}) — ${source.articles.size ? `${articleWord} ${[...source.articles].sort((a,b)=>a-b).join(', ')}; ` : ''}PDF ${pageWord} ${[...source.pages].sort((a,b)=>a-b).join(', ')}`).join('\n')}`;
}
