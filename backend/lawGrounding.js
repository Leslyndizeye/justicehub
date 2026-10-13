import {lawExcerptMetadata,excerptArticles} from './lawArticles.js';
import {readLawArticles} from './lawArticleReader.js';

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

export function sourceReadingReply(excerpts, language, question='') {
  const words=[...new Set(String(question).toLowerCase().match(/[\p{L}]{4,}/gu)||[])].filter(word=>!['what','does','about','please','explain','rwanda','rwandan','labour','employment','amategeko','itegeko','avuga','mbwira','article','ingingo'].includes(word));
  const meaning=/defin|meaning|mean\b|scope|purpose|bisobanur|ibirebwa|intego|signifi/i.test(question);
  const background=/definitions|scope of|purpose of|ibisobanuro|ibirebwa|intego|d[eé]finitions|champ d.application|objet de/i;
  const heading=doc=>{
    const metadata=lawExcerptMetadata(doc);
    return metadata && doc.articleNumber ? readLawArticles(metadata.key,metadata.language).find(article=>article.number===doc.articleNumber)?.segments[0]?.text.split('\n')[0] || '' : '';
  };
  const candidates=excerpts.map(doc=>({doc,body:String(doc.content).split('\n').slice(2).join('\n').trim()}))
    .filter(item=>item.body.length>=30 && (meaning || !background.test(heading(item.doc) || item.body.split('\n')[0])));
  const score=text=>words.reduce((sum,word)=>sum+(text.toLowerCase().includes(word)?1:0),0);
  candidates.sort((a,b)=>score(b.body)-score(a.body));
  const selected=candidates[0];
  if(!selected) {
    // A broad query returning only definitions cannot establish a case-specific
    // rule. Ask for the topic instead of dumping unrelated clipped paragraphs.
    const labour=excerpts.some(doc=>lawExcerptMetadata(doc)?.key==='law-66-2018');
    if(!labour)return {en:'Which legal issue or provision would you like me to explain? I do not have a relevant passage for a reliable answer yet.',rw:'Ni ikihe kibazo cy’amategeko cyangwa ingingo ushaka ko nsobanura? Nta gice cy’inyandiko gihagije mfite cyo kugusubiza neza.',fr:'Quel sujet juridique ou quelle disposition souhaitez-vous comprendre ? Je n’ai pas encore de passage pertinent pour une réponse fiable.'}[language] || 'Which legal issue would you like me to explain?';
    return {en:'Which part of labour law do you want help with—dismissal, pay, leave, working hours, or something else?',
      rw:'Ni iki ushaka kumenya ku mategeko agenga umurimo: kwirukanwa, umushahara, ikiruhuko, amasaha y’akazi, cyangwa ikindi?',
      fr:'Quel sujet du droit du travail souhaitez-vous comprendre : licenciement, salaire, congés, horaires, ou autre chose ?'}[language] || 'Which legal issue would you like me to explain?';
  }
  return `${{en:'Here is the exact wording from the relevant PDF passage:',
    rw:'Dore amagambo y’umwimerere yo muri iki gice cya PDF:',
    fr:'Voici le texte exact du passage PDF pertinent :'}[language] || 'The PDF passage states:'}\n\n${[selected].map(({doc,body})=>{
    const metadata=lawExcerptMetadata(doc);
    const label=String(metadata?.filename || doc.title).replace(/[\[\]\\\r\n]/g,' ');
    // Whole sentences/clauses only. Never cut a word or present a fragment as
    // the complete provision. Keep the link when no compact passage is usable.
    const units=body.split(/(?<=[.!?;])\s+(?=[\p{Lu}\d(])|\n(?=\s*\d+\s*[º°])/u);
    const fitting=units.filter(unit=>unit.length>=30 && unit.length<=1200);
    fitting.sort((a,b)=>score(b)-score(a));
    const text=body.length<=1400 ? body : fitting[0] || '';
    const article=doc.articleNumber ? `${language==='rw'?'Ingingo ya':'Article'} ${doc.articleNumber}` : '';
    return `${article ? `**${article}**\n\n` : ''}${text ? text.split('\n').map(line=>`> ${line}`).join('\n')+'\n\n' : ''}[${label}](${doc.source})`;
  }).join('\n\n')}\n\n${{en:'This quotes the published source. A supported explanation for your question was not produced; later changes are not covered here.',
    rw:'Aya ni amagambo yo mu nyandiko yatangajwe. Nta bisobanuro by’ikibazo cyawe bishingiye ku masoko byatanzwe; impinduka zakurikiyeho ntizirebwa hano.',
    fr:'Il s’agit du texte publié. Une explication étayée répondant à votre question n’a pas été produite ; les modifications ultérieures ne sont pas couvertes.'}[language] || ''}`;
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
