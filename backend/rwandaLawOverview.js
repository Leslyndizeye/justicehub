import {rwandaLawOverviewQuestion} from '../shared/rwandaLawOverview.js';
import {readLawArticles} from './lawArticleReader.js';
import {lawExcerptMetadata} from './lawArticles.js';
import catalog from './data/amategekoCatalog.json' with {type:'json'};

export const overviewArticles=Object.freeze([23,16,10]);
const constitution=catalog.documents.find(doc=>doc.key==='constitution-2023');
const normalize=text=>String(text).replace(/\s+/g,' ').trim();
function supported(doc,number) {
  const metadata=lawExcerptMetadata(doc);
  if(metadata?.key!=='constitution-2023'||doc.articleNumber!==number||doc.coverage!=='complete_article')return false;
  const article=readLawArticles('constitution-2023',metadata.language).find(item=>item.number===number);
  if(!article?.complete)return false;
  const body=String(doc.content).split('\n').slice(2).join('\n');
  return normalize(body)===normalize(article.segments.map(segment=>segment.text).join('\n'));
}

// A concise explanation of supplied published text. It consumes no AI quota,
// makes no case decision and never labels the version as freshly verified law.
export function rwandaLawOverviewAnswer(message,docs=[],language='en') {
  const request=rwandaLawOverviewQuestion(message);if(!request)return null;
  const numbers=overviewArticles.slice(0,request.count);
  const selected=numbers.map(number=>docs.find(doc=>supported(doc,number)));
  if(selected.some(doc=>!doc))return null;
  const copy={
    en:{intro:'Here are examples from Rwanda’s published 2023 Constitution:',
      points:{23:'**Privacy — Article 23.** It protects personal and family privacy, the home and communications. Entry, searches and interference with communications have exceptions governed by law.',
        16:'**Equality — Article 16.** All Rwandans are equal in rights and freedoms. The provision prohibits discrimination on grounds including sex, ethnicity, religion and disability.',
        10:'**Women’s representation — Article 10(d).** It sets a minimum of **30% of positions in decision-making organs** for women. This is a minimum quota, not a requirement that every institution have a 50/50 split.'},
      note:'These examples explain the cited published version; later amendments have not been checked in this answer.',followup:'Which would you like to explore?'},
    rw:{intro:'Dore ingero zo mu Itegeko Nshinga ry’u Rwanda ryatangajwe mu 2023:',
      points:{23:'**Ubuzima bwite — Ingingo ya 23.** Irengera ubuzima bwite bw’umuntu, ubw’umuryango, urugo n’itumanaho. Hari ibihe n’uburyo amategeko ateganya ku kwinjira mu rugo, kurusaka no ku ibanga ry’itumanaho.',
        16:'**Uburinganire — Ingingo ya 16.** Abanyarwanda bose barareshya mu burenganzira no mu bwisanzure. Iyi ngingo ibuza ivangura, harimo irishingiye ku gitsina, ubwoko, idini cyangwa ubumuga.',
        10:'**Abagore mu nzego zifata ibyemezo — Ingingo ya 10(d).** Abagore bagomba kugira nibura **30% by’imyanya mu nzego zifata ibyemezo**. Ni igipimo ntarengwa cyo hasi, si itegeko risaba ko buri rwego rugira 50% by’abagore na 50% by’abagabo.'},
      note:'Izi ngero zisobanura inyandiko yatangajwe ivugwa hano; impinduka zakurikiyeho ntizigenzuwe muri iki gisubizo.',followup:'Ni ikihe muri ibi ushaka kumenya birambuye?'},
    fr:{intro:'Voici des exemples tirés de la Constitution rwandaise publiée en 2023 :',
      points:{23:'**Vie privée — Article 23.** Il protège la vie privée, la famille, le domicile et les communications, avec des exceptions encadrées par la loi pour les entrées, perquisitions et atteintes à la confidentialité des communications.',
        16:'**Égalité — Article 16.** Tous les Rwandais sont égaux en droits et libertés. La disposition interdit notamment les discriminations fondées sur le sexe, l’origine ethnique, la religion et le handicap.',
        10:'**Représentation des femmes — Article 10(d).** Il prévoit au moins **30 % des postes dans les organes de décision** pour les femmes. Il s’agit d’un minimum, pas d’une obligation de parité à 50/50 dans chaque institution.'},
      note:'Ces exemples expliquent la version publiée citée ; les modifications ultérieures n’ont pas été vérifiées dans cette réponse.',followup:'Quel sujet souhaitez-vous approfondir ?'},
  }[language]||null;
  if(!copy)return null;
  return `${copy.intro}\n\n${numbers.map((number,index)=>`${copy.points[number]} [${language==='rw'?'Itegeko Nshinga':language==='fr'?'Constitution':'Constitution'} (${number})](${constitution.originalSource}#page=${selected[index].pdfPages[0]})`).join('\n\n')}\n\n${copy.note}\n\n${copy.followup}`;
}
