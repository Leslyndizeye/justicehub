import index from './data/amategekoArticles.json' with {type:'json'};
import catalog from './data/amategekoCatalog.json' with {type:'json'};
import { articleHeadings } from './lawArticleHeadings.js';
const documents = new Map(catalog.documents.map(doc=>[doc.key,doc]));

export function lawExcerptMetadata(excerpt) {
  const match = String(excerpt.content || '').match(/^\[Amategeko PDF: ([\w-]+); language: (rw|en|fr); page: (\d+); part: (\d+);/);
  const document = match && documents.get(match[1]);
  return document ? {...document, language:match[2], page:Number(match[3]), part:Number(match[4])} : null;
}

// The previous heading supplies a continuation's article, never its PDF page number.
export function excerptArticles(excerpt) {
  const metadata = lawExcerptMetadata(excerpt);
  if (!metadata || metadata.page < metadata.provisionsFrom) return [];
  const body = String(excerpt.content).split('\n').slice(2).join('\n');
  const headings = articleHeadings(body);
  const previous = index.documents[metadata.key]?.[metadata.language]?.filter(start =>
    start.page < metadata.page || start.page === metadata.page && start.part < metadata.part).at(-1);
  const beginsWithHeading = /^(?:Ingingo\s+ya\s+(?:\d+|mbere)|Article\s+(?:\d+|One|premier))\s*:/i.test(body.trimStart());
  return [...new Set([...(previous && !beginsWithHeading ? [previous.number] : []), ...headings])];
}
