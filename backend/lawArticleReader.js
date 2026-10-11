import corpus from './data/amategeko.json' with {type:'json'};
import catalog from './data/amategekoCatalog.json' with {type:'json'};
import { articleHeadingPositions } from './lawArticleHeadings.js';
import { lawExcerptMetadata, excerptArticles } from './lawArticles.js';

const documents = new Map(corpus.documents.map(doc=>[doc.key,doc]));
const catalogByHash = new Map(catalog.documents.map(doc=>[doc.sha256,doc]));
const cache = new Map();

function sourceDocument(excerpt) {
  // Legacy entries retain the archived source after "Source PDF:". Do not
  // infer the document solely from a legacy title or a model-generated link.
  for (const match of String(excerpt.source || '').matchAll(/https:\/\/[^\s)]+/g)) {
    try {
      const url=new URL(match[0]);
      const hash=url.pathname.match(/^\/storage\/v1\/object\/public\/justicehub-legal-sources\/amategeko\/([a-f0-9]{64})\.pdf$/)?.[1];
      const metadata=hash && catalogByHash.get(hash);
      if (!metadata || url.username || url.password || url.search) continue;
      const tagged=lawExcerptMetadata(excerpt);
      if (tagged && (tagged.key!==metadata.key || url.hash!==`#page=${tagged.page}`)) continue;
      url.hash='';
      return {metadata,url};
    } catch { /* An invalid link is not a source identity. */ }
  }
  return null;
}

export function readLawArticles(key, language='en') {
  const cacheKey=`${key}:${language}`;
  if(cache.has(cacheKey))return cache.get(cacheKey);
  const document=documents.get(key);
  const metadata=catalog.documents.find(doc=>doc.key===key);
  if(!document || !metadata || document.sha256!==metadata.sha256)return [];
  const chunks=document.chunks.filter(chunk=>chunk.language===language && chunk.page>=metadata.provisionsFrom)
    .sort((a,b)=>a.page-b.page || a.part-b.part);
  const articles=[];
  let current;
  for(const chunk of chunks) {
    const headings=articleHeadingPositions(chunk.text);
    let offset=0;
    const append=text=>{if(current && text.trim())current.segments.push({page:chunk.page,part:chunk.part,text:text.trim()});};
    for(const heading of headings) {
      append(chunk.text.slice(offset,heading.offset));
      if(current)current.complete=true;
      current={key,language,number:heading.number,segments:[],complete:false};
      articles.push(current);offset=heading.offset;
    }
    append(chunk.text.slice(offset));
  }
  // The final recognized heading has no following heading proving its end.
  // Leave it partial rather than asserting that extraction reached the end.
  cache.set(cacheKey,articles);
  return articles;
}

function overlap(article, text) {
  const words=[...new Set(String(text).toLowerCase().match(/[\p{L}]{4,}/gu)||[])];
  const body=article.segments.map(segment=>segment.text).join('\n').toLowerCase();
  return words.reduce((score,word)=>score+(body.includes(word)?1:0),0);
}

export function expandLawArticles(excerpts, message, {language='en', preferredArticles=[]}={}) {
  const expanded=[];const seen=new Set();
  for(const [position,excerpt] of excerpts.entries()) {
    const source=sourceDocument(excerpt);
    if(!source){expanded.push(excerpt);continue;}
    const tagged=lawExcerptMetadata(excerpt);
    const available=readLawArticles(source.metadata.key,tagged?.language || language);
    if(!available.length){expanded.push(excerpt);continue;}
    const numbers=excerptArticles(excerpt);
    const preferred=preferredArticles[position];
    let candidates=available.filter(article=>preferred ? article.number===preferred : numbers.includes(article.number));
    if(preferred && !candidates.length)continue;
    if(!candidates.length)candidates=available;
    const chosen=[...candidates].sort((a,b)=>overlap(b,excerpt.content+'\n'+message)-overlap(a,excerpt.content+'\n'+message))[0];
    if(!chosen){expanded.push(excerpt);continue;}
    const identity=`${chosen.key}:${chosen.language}:${chosen.number}`;
    if(seen.has(identity))continue;
    seen.add(identity);
    let segments=chosen.segments;
    let complete=chosen.complete;
    if(segments.map(segment=>segment.text).join('\n').length>5200) {
      // For a very long article, retain the matched passage and its neighbors,
      // without cutting a paragraph at an arbitrary character boundary.
      const matched=tagged ? Math.max(0,segments.findIndex(segment=>segment.page===tagged.page && segment.part===tagged.part))
        : segments.map((segment,index)=>({index,score:overlap({segments:[segment]},message+'\n'+excerpt.content)})).sort((a,b)=>b.score-a.score)[0].index;
      segments=segments.slice(Math.max(0,matched-1),matched+2);complete=false;
    }
    const first=segments[0];
    if(!first){expanded.push(excerpt);continue;}
    expanded.push({...excerpt,title:`${source.metadata.title} — Article ${chosen.number}`,
      source:`${source.url.href}#page=${first.page}`,
      content:`[Amategeko PDF: ${chosen.key}; language: ${chosen.language}; page: ${first.page}; part: ${first.part}; published: ${source.metadata.published || 'unknown'}]\n${source.metadata.title}. Published version; later amendments and current applicability have not been verified.\n${segments.map(segment=>segment.text).join('\n')}`,
      coverage:complete?'complete_article':'partial_article',articleNumber:chosen.number,
      pdfPages:[...new Set(segments.map(segment=>segment.page))],
    });
  }
  return expanded;
}
