import {lawExcerptMetadata,excerptArticles} from './lawArticles.js';

export function unsupportedArticleCitations(text, excerpts, externalSearchResult) {
  // External research can legitimately introduce a different law/article.
  // This local check makes no claim to validate that external interpretation.
  if(externalSearchResult?.sources?.length || !excerpts.some(doc=>lawExcerptMetadata(doc)))return [];
  const supported=new Set(excerpts.flatMap(doc=>excerptArticles(doc)));
  for(const excerpt of excerpts) {
    for(const match of String(excerpt.content).matchAll(/\b(?:Article|Ingingo(?:\s+ya)?)\s+(\d{1,4})\b/gi))supported.add(Number(match[1]));
  }
  const issues=[];
  for(const match of String(text).matchAll(/\b(?:Articles?|Ingingo(?:\s+ya)?)\s+(\d{1,4}(?:\s*[,;&]\s*\d{1,4})*)/gi)) {
    const context=text.slice(Math.max(0,match.index-70),match.index+match[0].length+80);
    // Do not turn a stated inability to verify an article into a positive claim.
    if(/not (?:found|provided|verified)|cannot (?:confirm|verify)|ntiyabonetse|ntigenzuwe|non vérifié|introuvable/i.test(context))continue;
    for(const number of match[1].match(/\d+/g).map(Number))if(!supported.has(number))issues.push(number);
  }
  return [...new Set(issues)];
}

export function sourceReadingReply(excerpts, language) {
  const intro={en:'I could not support that interpretation from the supplied PDF text. These are the relevant source passages; their current applicability still needs checking.',
    rw:'Sinashoboye kwemeza ibyo bisobanuro nshingiye ku nyandiko ya PDF yatanzwe. Dore ibice by’inyandiko bijyanye n’ikibazo; niba bigikurikizwa ubu biracyakeneye kugenzurwa.',
    fr:'Je ne peux pas confirmer cette interprétation à partir du PDF fourni. Voici les passages pertinents ; leur applicabilité actuelle reste à vérifier.'}[language] || 'These source passages need further review.';
  return `${intro}\n\n${excerpts.slice(0,2).map(doc=>{
    const metadata=lawExcerptMetadata(doc);
    const label=String(metadata?.filename || doc.title).replace(/[\[\]\\\r\n]/g,' ');
    const body=String(doc.content).split('\n').slice(2).join('\n');
    const text=body.slice(0,excerpts.length===1 ? 1800 : 700);
    return `[${label}](${doc.source})\n\n${text.split('\n').map(line=>`> ${line}`).join('\n')}${text.length<body.length ? '\n\n[…]' : ''}`;
  }).join('\n\n')}`;
}

const periods=[
  /\b(?:weeks?|weekly|icyumweru|byumweru|semaine\w*|hebdomadaire)\b/i,
  /\b(?:months?|monthly|ukwezi|kwezi|amezi|mois|mensuel\w*)\b/i,
  /\b(?:quarters?|quarterly|igihembwe|gihembwe|trimestre\w*|trimestriel\w*)\b/i,
];
// A limited translation/grounding check for the observed week-versus-quarter
// mistake. It does not verify every deadline or establish semantic equivalence.
export function unsupportedFilingPeriod(text,excerpts,externalSearchResult) {
  if(externalSearchResult?.sources?.length)return false;
  const body=excerpts.filter(doc=>lawExcerptMetadata(doc)).map(doc=>String(doc.content).split('\n').slice(2).join('\n')).join('\n');
  if(!/declar\w*|menyekan\w*/i.test(body))return false;
  return periods.some(pattern=>{
    if(pattern.test(body))return false;
    const match=String(text).match(pattern);
    if(!match)return false;
    const context=text.slice(Math.max(0,match.index-80),match.index+match[0].length+80);
    return /\b\d+\b|declar\w*|menyekan\w*|bamenyesha|after|nyuma/i.test(context);
  });
}
