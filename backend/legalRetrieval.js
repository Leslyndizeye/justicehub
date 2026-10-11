import { interpretLegalQuestion } from './legalQuestion.js';
import { matchedLegalVocabulary } from './legalVocabulary.js';
import { interpretCasualMessage } from '../shared/chatCasual.js';
import lawCatalog from './data/amategekoCatalog.json' with {type:'json'};

const noise = new Set('a an the is are was were be been being of in on for to at and or with from by as it this that these those me my you your i we our us please explain tell show understand what which how why when about law laws rwanda rwandan article articles no number latest current english french kinyarwanda under relating governing says does do should could would rwo bya ibyo kuri ni iki gute amategeko mbwira'.split(' '));
const catalogue = new Map(lawCatalog.documents.map(doc=>[doc.key,doc]));
export function legalSearchTerms(message) {
  return [...new Set((String(message).toLowerCase().match(/[\p{L}]{3,}/gu) || []).filter(word => !noise.has(word)))].slice(0,10);
}

export function excerptBody(doc) {
  const text = String(doc.content || '');
  return text.startsWith('[Amategeko PDF:') ? text.split('\n').slice(2).join('\n') : text;
}

export function rankLegalDocuments(documents, message, topic, language = 'en') {
  const terms = legalSearchTerms(message);
  const metadata = doc => {
    const match = String(doc.content).match(/^\[Amategeko PDF: ([\w-]+); language: (rw|en|fr); page: (\d+);/);
    return match ? {...catalogue.get(match[1]),language:match[2],page:Number(match[3])} : null;
  };
  const score = doc => {
    const body = excerptBody(doc);
    const lower = body.toLowerCase();
    let value = terms.reduce((sum,word) => sum + (lower.includes(word) ? 3 : 0),0);
    if (terms.includes('deadline') && /\b(?:due|before|within|time limit)\b/.test(lower)) value += 2;
    if (terms.includes('declaration') && /\b(?:return|filing|file)\b/.test(lower)) value += 2;
    if (topic === 'theft' && /theft|robbery|kwiba|ubujura/i.test(doc.title || '')) value += 15;
    else if (topic && matchedLegalVocabulary(doc.title).some(entry => entry.topic === topic)) value += 15;
    if (String(doc.content).includes(`language: ${language};`)) value += 2;
    const meta = metadata(doc);
    if (meta) value += .5 - meta.page / 10000;
    if (/TABLE OF CONTENTS|TABLE DES MATI[ÈE]RES|ISHAKIRO|AMASHAKIRO/i.test(body)
      || (body.match(/(?:Article\s+(?:\d+|One)|Ingingo\s+ya)/g) || []).length >= 3
        && !/\b(?:shall|must|may|means|entitled|prohibited|agomba|ashobora|doit|peut|interdit)\b/i.test(body)) value -= 50;
    return value;
  };
  const wantsContents = /table of contents|ishakiro|amashakiro|table des mati/i.test(message);
  const ranked = documents.filter(doc => { const meta = metadata(doc); return wantsContents || !meta || meta.page >= meta.provisionsFrom; })
    .sort((a,b) => score(b)-score(a));
  const seen = new Set();
  return ranked.filter(doc => {
    // The three translations on the same PDF page represent one source, not three independent sources.
    const key = String(doc.content).startsWith('[Amategeko PDF:') ? doc.source : `${doc.source}\n${doc.content}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0,4);
}

export async function searchLegalDocs(client, message, history = [], language = 'en') {
  if (interpretCasualMessage(message)?.standalone) return [];
  const { retrievalQuery, topic } = interpretLegalQuestion(message, history);
  try {
    const law = String(message).match(/\b(?:law|loi|itegeko|tegeko)\s*(?:(?:no\.?|n[º°o]?\.?|number)\s*)?(\d{1,3})\/((?:19|20)\d{2})/i);
    const terms = legalSearchTerms(message);
    let query = client.from('legal_documents').select('title, category, content, year, source');
    if (law) {
      const number = `${Number(law[1])}/${law[2]}`;
      query = query.or(`title.ilike.%${number}%,source.ilike.%${number}%`);
    }
    if (!law || terms.length) {
      query = query.textSearch('content', topic ? retrievalQuery : terms.map(word => `"${word}"`).join(' ') || retrievalQuery,
        {type:'websearch',config:'english'});
    }
    const { data, error } = await query.limit(law ? 1000 : topic ? 16 : 128);
    if (error) return [];
    let documents = data || [];
    if (!topic && terms.length > 1 && (!documents.length || !documents.some(doc=>String(doc.content).startsWith('[Amategeko PDF:')))) {
      // A question's everyday wording need not occur verbatim in a statute. Use its
      // specific terms to recover passages, without forcing all words to appear together.
      const specific = terms.filter(word=>!['tax','income','criminal','procedure','court','courts'].includes(word));
      let fallback = client.from('legal_documents').select('title, category, content, year, source');
      if (law) { const number=`${Number(law[1])}/${law[2]}`; fallback=fallback.or(`title.ilike.%${number}%,source.ilike.%${number}%`); }
      const result = await fallback.textSearch('content',(specific.length?specific:terms).map(word=>`"${word}"`).join(' OR '),
        {type:'websearch',config:'english'}).order('year',{ascending:false}).limit(law?1000:128);
      if (!result.error) documents = [...documents,...(result.data || [])];
    }
    return rankLegalDocuments(documents, message, topic, language);
  } catch {
    return [];
  }
}
