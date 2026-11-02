// Narrow checks for observed scope/charge errors. Authentic quotations alone
// do not prove an interpretation; this is not a general entailment verifier.
import {isReviewedStatute} from './criminalProvisions.js';
const fold=text=>String(text).normalize('NFKD').replace(/\p{M}/gu,'').replace(/[‘’]/g,"'").replace(/\s+/g,' ').toLowerCase();
const offences=[
  {claim:/\b(?:theft|stealing|robbery|vol)\b|icyaha cyo kwiba/i,support:/\b(?:theft|steal\w*|stolen|robbery|vol)\b|kwiba|ubujura/i},
  {claim:/\b(?:fraud|escroquerie)\b|icyaha cy['’ ]?uburiganya/i,support:/\b(?:fraud|escroquer\w*|false pretences?|swindl\w*)\b|kwihesha.*uburiganya/i},
  {claim:/\b(?:defamation|libel|slander|diffamation)\b|icyaha cyo gusebanya/i,support:/\b(?:defam\w*|libel|slander|diffam\w*)\b|gusebanya/i},
  {claim:/\b(?:perjury|parjure)\b|icyaha cyo kubeshya.*indahiro/i,support:/\b(?:perjury|parjure|false testimony|false evidence|false oath)\b|kubeshya.*indahiro|ubuhamya bw['’ ]?ibinyoma/i},
];
const legalEffect=/\b(?:commits?|constitutes?|liable|punish\w*|compensation|damages|commet|constitue|puni\w*|responsabilite)\b|ahanishwa|akora icyaha/i;

function limitation(sentence) {
  // A stated source gap is different from "this is not a crime", which is
  // itself a legal conclusion requiring relevant authority.
  return /(?:does? not|cannot|can't|do not|doesn't|not enough to|insufficient to).{0,55}(?:establish|support|determine|conclude|prove|decide|confirm|define)|(?:ne .{0,25}(?:pas|permet)).{0,45}(?:etablir|conclure|determiner|prouver)|ntibi(?:garagaza|hagije|hamya)|ntibishobora.{0,25}(?:kwemeza|kugaragaza)/i.test(sentence)
    && !/\b(?:but|however|nevertheless|mais|pourtant|ariko)\b|\band (?:you|your|it|the act|lying|a lie).{0,35}(?:is|are|has|have|breach|violate)/i.test(sentence);
}

function generalCivilPrinciple(item) {
  if(item.source.metadata?.key==='law-71-2024' && item.source.doc.articleNumber===13)return true;
  const text=fold(item.entry.quote);
  return /good faith|bonne foi|nta buriganya/.test(text) && /civil rights|droits civils|mbonezamubano|diligence|ubushishozi/.test(text);
}

export function legalApplicationIssue(point,evidence) {
  const statement=fold(point.statement);
  const sentences=statement.split(/(?<=[.!?;])\s+/);
  for(const offence of offences) {
    if(!sentences.some(sentence=>offence.claim.test(sentence) && !limitation(sentence)))continue;
    // Support must occur in this point's own quotation, not an unrelated
    // article elsewhere in the draft or the user's allegation.
    if(!evidence.some(item=>{
      const quote=fold(item.entry.quote);
      if(offence.support.test(quote) && legalEffect.test(quote))return true;
      // A verified article's own penalty paragraph need not repeat its offence
      // heading. Never borrow a heading from another article or a civil rule.
      const article=item.source.doc;
      return isReviewedStatute(article) && offence.support.test(fold(article.content.split('\n').slice(0,2).join(' ')))
        && legalEffect.test(fold(article.content)) && /imprison|fine|penalt|emprison|amende|igifungo|ihazabu/i.test(quote);
    }))return 'offence_support';
  }
  if(!evidence.length || !evidence.every(generalCivilPrinciple))return null;
  for(const sentence of sentences) {
    if(limitation(sentence))continue;
    if(/\b(?:criminal|crime|offen[cs]e|illegal|unlawful|breach\w*|violat\w*|infraction|illicite|illegal\w*|viole\w*)\b|icyaha|binyuranyije n['’ ]?amategeko/i.test(sentence))return 'scope_connection';
    if(/\b(?:lie|lies|lied|lying|private conversation|mentir|mensonge\w*|conversation privee)\b|kubeshya|ibinyoma/i.test(sentence))return 'scope_connection';
    if(/\b(?:you|your)\b/.test(sentence) && !/\b(?:if|where|when|provided)\b/.test(sentence)
      && /dishonest|failed|diligence|good faith|civil obligation|legal obligation/.test(sentence))return 'scope_connection';
    // An application of a general principle must state its legal context,
    // rather than silently applying it to all behaviour.
    if(point.kind==='application' && (!/civil rights|civil obligation|legal obligation|droits civils|obligation|mbonezamubano|inshingano/.test(sentence)
      || !/\b(?:if|where|when|provided|si|lorsque|iyo)\b/.test(sentence)))return 'scope_connection';
  }
  return null;
}

export function applicationClarification(message,language='en') {
  const lying=/\b(?:lie|lies|lied|lying|menti\w*|mensonge\w*)\b|kubeshya|ibinyoma/i.test(fold(message));
  const copy=lying ? {
    en:'I need more details before assessing the legal position. What was the false statement about, and did it concern an agreement, a legal obligation or a financial loss?',
    rw:'Nkeneye amakuru y’inyongera mbere yo gusuzuma uko amategeko abiteganya. Ibyo wavuze bitari ukuri byarebaga iki? Byari bifitanye isano n’amasezerano, inshingano z’amategeko cyangwa igihombo cy’amafaranga?',
    fr:'Il manque des faits pour examiner la situation juridique. Sur quoi portait la fausse déclaration ? Concernait-elle un accord, une obligation juridique ou une perte financière ?',
  } : {
    en:'I need more facts to connect the provision to your situation. What exactly happened, and what agreement, obligation or right was involved?',
    rw:'Nkeneye amakuru y’inyongera kugira ngo ngaragaze isano y’iyi ngingo n’ikibazo cyawe. Ni iki cyabaye, kandi ni ayahe masezerano, inshingano cyangwa uburenganzira byarebwaga?',
    fr:'Il manque des faits pour relier la disposition à votre situation. Que s’est-il passé exactement, et quel accord, obligation ou droit était en jeu ?',
  };
  return copy[language] || copy.en;
}
