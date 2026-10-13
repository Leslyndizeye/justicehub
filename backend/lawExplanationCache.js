import {createHash} from 'node:crypto';
import {lawExcerptMetadata} from './lawArticles.js';
import {readLawArticles} from './lawArticleReader.js';

const fold=value=>String(value).normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase();
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const words=new Set('please explain summarize summarise sobanura mbwira explique expliquer expliquez what does say says mean means que dit article ingingo ya in english french kinyarwanda en francais mu cyongereza rwanda rwandan au du de le la les law loi itegeko'.split(' '));
const aliases={
  'constitution-2023':['constitution','constitution of rwanda','constitution of the republic of rwanda','constitution 2023'],
  'rba-internal-rules-2014':['bar internal rules','bar internal rules and regulations'],
  'rba-regulation-01-2014':['lawyer fees','advocates fees'],
  'ministerial-order-003-2024':['foreign services authorisation','foreign services authorization'],
};

function publishedArticle(doc) {
  const metadata=lawExcerptMetadata(doc);
  if(!metadata || doc.coverage!=='complete_article')return false;
  const article=readLawArticles(metadata.key,metadata.language).find(item=>item.number===doc.articleNumber);
  const normalize=value=>String(value).normalize('NFKC').replace(/\s+/g,' ').trim();
  return article?.complete && metadata.page===article.segments[0]?.page
    && doc.source===`${metadata.archiveSource}#page=${metadata.page}`
    && normalize(doc.content.split('\n').slice(2).join('\n'))===normalize(article.segments.map(segment=>segment.text).join('\n'));
}

// Only explicit public article explanations qualify. Personal facts, generic
// follow-ups, current-law requests and incomplete documents cannot be reused.
export function reusableLawExplanation(message,docs,language,role) {
  if(!docs.length || !docs.every(publishedArticle))return null;
  const text=fold(message);
  if(!/^(?:please\s+)?(?:explain|summari[sz]e|sobanura|mbwira|explique\w*|what does|que dit)\b/.test(text))return null;
  const articles=[...text.matchAll(/\b(?:article|ingingo\s*(?:ya)?)\s+(\d{1,3})\b/g)];
  if(articles.length!==1)return null;
  const number=Number(articles[0][1]);
  const source=docs.find(doc=>doc.coverage==='complete_article' && doc.articleNumber===number && lawExcerptMetadata(doc));
  if(!source)return null;
  const metadata=lawExcerptMetadata(source);
  let remaining=text.replace(articles[0][0],' ');
  let identified=false;
  const law=metadata.key.match(/^law-(\d+)-(\d{4})$/);
  if(law){
    const pattern=new RegExp(`\\b(?:law|loi|itegeko)\\s*(?:(?:no\\.?|n[°ºo]?\\.?|number)\\s*)?0*${Number(law[1])}/${law[2]}\\b`,'g');
    identified=pattern.test(remaining);pattern.lastIndex=0;remaining=remaining.replace(pattern,' ');
  }
  const labels=[metadata.title,metadata.filename,...(aliases[metadata.key] || [])].map(fold).sort((a,b)=>b.length-a.length);
  for(const label of labels){if(remaining.includes(label)){identified=true;remaining=remaining.replace(new RegExp(escape(label),'g'),' ');}}
  if(!identified || !(remaining.match(/[\p{L}\p{N}]+/gu)||[]).every(word=>words.has(word)))return null;
  const identity=docs.map(doc=>({source:doc.source,content:doc.content,article:doc.articleNumber,coverage:doc.coverage}));
  return createHash('sha256').update(JSON.stringify({format:1,number,identity,language,role})).digest('hex');
}

export function createLawExplanationCache(limit=128) {
  const entries=new Map();
  return {
    get(key){const value=entries.get(key);if(value!==undefined){entries.delete(key);entries.set(key,value);}return value;},
    set(key,raw){entries.delete(key);entries.set(key,raw);if(entries.size>limit)entries.delete(entries.keys().next().value);},
    delete:key=>entries.delete(key),
  };
}
