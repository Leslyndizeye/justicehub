import catalog from './data/amategekoCatalog.json' with {type:'json'};
import {readLawArticles,expandLawArticles} from './lawArticleReader.js';
import {interpretLegalQuestion} from './legalQuestion.js';
import {interpretCasualMessage} from '../shared/chatCasual.js';

const noise=new Set('a an the to of and or in on for is are was were it this that those what how why when which please explain tell me about under law laws article articles no ya mu ni ku kuri iki ki avuga rivuga amategeko itegeko mbwira rwanda rwandan en le la les de des du loi au does do can could should would my your i we have with person people umuntu'.split(' '));
const hints=[
  [/\b(?:minimum age|child(?:ren)?|kids?|umwana|abana|enfants?).*(?:work|employ|akazi|gukora|travail)|\b(?:work|employ|akazi|travail).*(?:minimum age|child(?:ren)?|kids?|umwana|abana|enfants?)/i,['minimum','age','admission','employment','child'],'law-66-2018',/minimum age|work for the child|imyaka|umwana|âge|enfant/i],
  [/\b(?:unpaid|not (?:been )?paid|ntampemba|ntahemb|adahemba)\b/i,['salary','intervals','prescription'],'law-66-2018',/salary|umushahara|salaire/i],
  [/\b(?:unfair(?:ly)?|unlawful(?:ly)?|wrongful(?:ly)?|without (?:a )?(?:reason|cause)|nta mpamvu|bidakurikije amategeko).*(?:dismiss|fir(?:e|ed)|terminat|kwirukan)|\b(?:dismiss|fir(?:e|ed)|terminat|kwirukan).*(?:unfair|unlawful|wrongful|without|nta mpamvu|bidakurikije)/i,['unlawful','termination','damages'],'law-66-2018'],
  [/\b(?:fired|sacked|dismiss\w*|terminat\w*|kwirukan\w*|licenci\w*)\b/i,['termination','dismissal'],'law-66-2018'],
  [/\b(?:notice|integuza|pr[eé]avis)\b/i,['notice','notification'],'law-66-2018',/notice|integuza|pr[eé]avis/i],
  [/\b(?:severance|terminal benefits|economic reasons|imperekeza)\b/i,['terminal','benefits','economic'],'law-66-2018'],
  [/\b(?:overtime|working hours|amasaha.*akazi|heures.*travail)\b/i,['working','hours','extra'],'law-66-2018'],
  [/\b(?:unpaid|salary|wages|umushahara|salaire)\b/i,['salary','payment'],'law-66-2018'],
  [/\b(?:maternity|maternitty|ikiruhuko.*kubyara|kubyara|cong[eé].*maternit[eé])(?=$|[^\p{L}])/iu,['maternity','leave'],'law-66-2018',/maternity|kubyara|maternit[eé]/i],
  [/\b(?:dismissal|dismissed|termination|kwirukanwa|umukoresha|employment|labou?r|akazi)\b/i,['employment'],'law-66-2018'],
  [/\b(?:income tax|umusoro.*nyungu|imp[oô]t.*revenu)\b/i,['income','tax'],'law-27-2022'],
  [/\b(?:tax procedures|proc[eé]dures fiscales|imiburanishirize.*imisoro)\b/i,['tax','procedure'],'law-20-2023'],
  [/\b(?:constitution|itegeko nshinga)\b/i,['constitution'],'constitution-2023'],
  [/\b(?:divorce|marriage|family law|gushyingir\w*|gutandukana|umuryango)\b/i,['family'],'law-71-2024'],
  [/\b(?:cybercrime|hacking|phishing|konti.*yibwe|kwiba konti)\b/i,['cyber'],'law-60-2018'],
  [/\b(?:criminal procedure|bail|imanza nshinjabyaha|gufatwa)\b/i,['criminal','procedure'],'law-27-2019'],
  [/\b(?:civil procedure|imanza.*mbonezamubano)\b/i,['civil','procedure'],'law-22-2018'],
  [/\b(?:bar internal rules|advocates.? internal rules)\b/i,['internal','rules'],'rba-internal-rules-2014'],
  [/\b(?:bar association|urugaga.*avoka)\b/i,['bar','association'],'law-83-2013'],
  [/\b(?:lawyer.?s? fees|advocate.?s? fees|ibihembo.*avoka)\b/i,['fees'],'rba-regulation-01-2014'],
  [/\b(?:investigation bureau|rib)\b/i,['investigation'],'law-12-2017'],
  [/\b(?:foreign services|serivisi zo mu mahanga)\b/i,['foreign','services'],'ministerial-order-003-2024'],
];
const fold=text=>String(text).normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase();
const tokens=text=>(fold(text).match(/[\p{L}]{3,}/gu)||[]).filter(word=>!noise.has(word));
let index;
function searchIndex() {
  if(index)return index;
  const records=[];const frequencies=new Map();let totalLength=0;
  for(const doc of catalog.documents)for(const language of ['en','rw','fr']) {
    if(!doc.archiveSource)continue;
    for(const article of readLawArticles(doc.key,language)) {
      const text=article.segments.map(segment=>segment.text).join('\n');
      const terms=new Map();for(const word of tokens(text))terms.set(word,(terms.get(word)||0)+1);
      const length=[...terms.values()].reduce((a,b)=>a+b,0);
      for(const word of terms.keys())frequencies.set(word,(frequencies.get(word)||0)+1);
      records.push({doc,article,terms,length,text});totalLength+=length;
    }
  }
  index={records,frequencies,averageLength:totalLength/Math.max(1,records.length)};
  return index;
}

export function searchLocalLaws(message,history=[],language='en') {
  if(interpretCasualMessage(message)?.standalone)return [];
  let text=String(message);
  const lawNumber=value=>value.match(/\b(?:law|loi|itegeko)\s*(?:(?:no\.?|n[º°o]?\.?|number)\s*)?(\d{1,3})\/((?:19|20)\d{2})/i);
  let named=lawNumber(text);
  let selected=hints.filter(([pattern])=>pattern.test(text));
  if(!named && !selected.length && text.length<140 && /^(?:and\b|what about|how about|none\b|se\b|explain (?:it|that)|sobanura)/i.test(text)) {
    const earlier=[...history].reverse().find(item=>item.sender==='user' && typeof item.content==='string');
    if(earlier){named=lawNumber(earlier.content);selected=hints.filter(([pattern])=>pattern.test(earlier.content));text+=' '+earlier.content;}
  }
  const legalIntent=Boolean(named || selected.length || /\b(?:legal|laws?|rights|amategeko|itegeko|ibihano|uburenganzira|ingingo|ngingo)\b/i.test(text));
  if(!legalIntent)return [];
  const explicitKey=named && `law-${Number(named[1])}-${named[2]}`;
  const articleNumber=text.match(/\b(?:article|i?ngingo\s*(?:ya)?)\s*(\d{1,3})\b/i)?.[1];
  const scope=explicitKey ? [explicitKey] : selected.map(item=>item[2]);
  const interpretation=interpretLegalQuestion(message,history);
  if(interpretation.topic && !scope.length)return [];
  const query=[...new Set(tokens(text+' '+(interpretation.topic?interpretation.retrievalQuery:'')+' '+selected.flatMap(item=>item[1]).join(' ')))].slice(0,24);
  if(!query.length && !articleNumber && !explicitKey)return [];
  const {records,frequencies,averageLength}=searchIndex();
  const ranked=[];
  for(const record of records) {
    if(scope.length && !scope.includes(record.doc.key))continue;
    if(selected[0]?.[3] && !selected[0][3].test(record.text))continue;
    if(articleNumber && record.article.number!==Number(articleNumber))continue;
    let score=0;let matches=0;
    for(const word of query) {
      const count=record.terms.get(word)||0;if(!count)continue;matches++;
      const idf=Math.log(1+(records.length-(frequencies.get(word)||0)+.5)/((frequencies.get(word)||0)+.5));
      score+=idf*(count*2.2)/(count+1.2*(.25+.75*record.length/averageLength));
    }
    if(!matches && !articleNumber && !explicitKey)continue;
    if(!scope.length && matches<Math.min(2,query.length))continue;
    const heading=record.text.split('\n')[0].toLowerCase();
    for(const word of query)if(heading.includes(word))score+=2*Math.log(1+(records.length-(frequencies.get(word)||0)+.5)/((frequencies.get(word)||0)+.5));
    // Definitions/scope are background, not the operative rule for every case.
    // Keep them fully available when the user actually asks about their meaning.
    const background=/definitions|scope of|purpose of|ibisobanuro|ibirebwa|intego|d[eé]finitions|champ d.application|objet de/i;
    if(background.test(heading) && !/defin|meaning|mean\b|scope|appl(?:y|ies) to|purpose|bisobanur|ibirebwa|intego|signifi|champ d.application/i.test(text))score*=.18;
    const definitionRequested=/defin|meaning|mean\b|what is|bisobanur|signifi/i.test(text);
    const intentPriority=definitionRequested && /definitions|ibisobanuro|d[eé]finitions/i.test(heading) ? 1 : 0;
    if(/insolven|ubwishyu.*buke/i.test(heading) && !/insolven|bankrupt|ubwishyu.*buke/i.test(text))score*=.25;
    score+=(record.article.language===language?2:record.article.language==='en'?1:0);
    if(articleNumber)score+=30;
    ranked.push({record,score,intentPriority});
  }
  ranked.sort((a,b)=>b.intentPriority-a.intentPriority || b.score-a.score);
  const seen=new Set();const seeds=[];const preferred=[];
  for(const {record} of ranked) {
    const identity=`${record.doc.key}:${record.article.number}`;
    if(seen.has(identity))continue;seen.add(identity);
    // For an oversized article, expansion keeps neighbors of this seed.
    // Anchor it at the matching clause rather than the beginning of the PDF.
    const questionWords=tokens(message);
    const segmentScore=segment=>questionWords.reduce((sum,word)=>sum+(fold(segment.text).includes(word)?1:0),0);
    const first=[...record.article.segments].sort((a,b)=>segmentScore(b)-segmentScore(a))[0];if(!first)continue;
    seeds.push({title:record.doc.title,year:record.doc.year,category:'legal',source:`${record.doc.archiveSource}#page=${first.page}`,
      content:`[Amategeko PDF: ${record.doc.key}; language: ${record.article.language}; page: ${first.page}; part: ${first.part}; published: ${record.doc.published || 'unknown'}]\nPublished PDF copy.\n${first.text}`});
    preferred.push(record.article.number);
    if(seeds.length>=4)break;
  }
  return expandLawArticles(seeds,message,{language,preferredArticles:preferred});
}
