import { theftPenaltyFacts as facts, theftPenaltyReference, theftPoliceReference } from './legalReferences.js';
import {theftComparisonContext} from '../shared/theftComparison.js';

export function referencedTheftComparisonAnswer(message,language='en',history=[]) {
  if(!theftComparisonContext(message,history))return null;
  const source=theftPenaltyReference.source;
  if(language==='rw')return `**Oya, ibihano si bimwe.** Mu nyandiko yasohowe y’itegeko nº 68/2018:

- **Ingingo ya 166:** umuntu uhamijwe n’urukiko icyaha cyo kwiba ashobora guhanishwa igifungo cy’umwaka **1 kugeza ku myaka 2**, ihazabu ya **FRW 1,000,000 kugeza kuri 2,000,000**, imirimo y’inyungu rusange y’amezi **6**, cyangwa **kimwe gusa muri ibyo bihano**. Ntibivuze ko byose bitangwa buri gihe.
- **Ingingo ya 167** iteganya ko igihano cyikuba kabiri iyo hari imwe mu mpamvu nkomezacyaha zivugwamo. Urugero, igifungo cy’umwaka 1 kugeza ku myaka 2 kiba **imyaka 2 kugeza kuri 4**, iyo iyo ngingo ikurikizwa. Mu ngero harimo kwiba nijoro cyangwa byakozwe n’abantu barenze umwe. Ku mukozi wa Leta, iyo ngingo ivuga kwishingikiriza ku mirimo ye; kuba umukozi wa Leta byonyine ntibihagije.
- **Ingingo ya 168** ifite ibihano byihariye ku kwiba hakoreshejwe kiboko cyangwa ibikangisho; ntibikwiye kuvanga ibyo byaha byose.

[Isoko: Minisiteri y’Ubutabera, impapuro za 155–156](${source}). Ibi bisobanura inyandiko yo mu 2018; sinagenzuye impinduka zakurikiyeho kandi si ukwemeza igihano cy’umuntu runaka.`;
  if(language==='fr')return `**Non, les peines ne sont pas identiques.** Dans le texte publié de la loi nº 68/2018 :

- **L’article 166 :** après une condamnation pour vol, le texte énumère **1 à 2 ans de prison**, une amende de **1,000,000 à 2,000,000 FRW**, **6 mois de travaux d’intérêt général**, ou **une seule de ces peines**. Elles ne doivent donc pas être présentées comme systématiquement cumulatives.
- **L’article 167** double la peine dans les circonstances aggravantes qu’il énumère. Par exemple, la durée de 1 à 2 ans devient **2 à 4 ans** lorsque cet article s’applique. Les exemples comprennent le vol commis la nuit ou par plusieurs personnes. Pour un fonctionnaire, la disposition vise le fait de tirer avantage de ses fonctions ; sa seule qualité de fonctionnaire ne suffit pas.
- **L’article 168** prévoit des peines distinctes pour le vol avec violence ou menaces : toutes ces situations ne relèvent donc pas d’un simple doublement.

[Source : ministère de la Justice, pages 155–156](${source}). Il s’agit du texte publié en 2018 ; les modifications ultérieures et la peine applicable à un cas particulier n’ont pas été vérifiées.`;
  return `**No—the penalties are not the same.** In the published text of Law nº 68/2018:

- **Article 166:** after a court conviction for theft, the text lists **1–2 years in prison**, a **FRW 1,000,000–2,000,000 fine**, **6 months of community service**, or **only one of those penalties**. Do not read the list as requiring all penalties together in every case.
- **Article 167** doubles the penalty for the aggravating circumstances it lists. For example, the 1–2-year prison range becomes **2–4 years** when this article applies. Examples include theft at night or by more than one person. For a civil servant, the provision refers to taking advantage of official duties; government employment alone is not enough.
- **Article 168** separately addresses theft involving violence or threats. Those cases should not all be treated as simple doubling.

[Source: Ministry of Justice, pages 155–156](${source}). This explains the published 2018 text; I haven’t verified later amendments or the sentence in a particular case.`;
}

/** Render a narrow source lookup; case advice and current-law verification still need the model. */
export function referencedPenaltyAnswer(message, interpretation, language) {
  if (!interpretation.penaltyQuestion || message.length > 150) return null;
  const needsMore = /\b(?:my client|my case|i stole|i was|i am|mon client|ma situation|latest|current\w*|today|new|recent\w*|amend\w*|202\d|violence|violent|armed|aggravat\w*|repeat\w*|recidiv\w*|burglary|night|tonight|motorcycle|child|minor|sentence reduction|kiboko|intwaro|nijoro|umukiriya|naribye|nibye|nkomezacyaha|moto|umwana|bishya|vuba|ubu|ahinduwe|r[eé]cent\w*|actuel\w*)\b|aggravé/i;
  if (needsMore.test(message)) return null;
  const source = theftPenaltyReference.source;
  const corroboration = theftPoliceReference.source;
  const minFine = facts.fineMin.toLocaleString('en-US');
  const maxFine = facts.fineMax.toLocaleString('en-US');
  if (language === 'rw') return `**Umuntu uhamijwe n’urukiko icyaha cyo kwiba**, mu nyandiko y’itegeko nº 68/2018, ingingo ya 166, ashobora guhanishwa:

- Igifungo cy’umwaka **${facts.prisonYearsMin} kugeza ku myaka ${facts.prisonYearsMax}**;
- Ihazabu ya **${minFine} kugeza kuri ${maxFine} FRW**;
- Imirimo y’inyungu rusange y’amezi **${facts.communityServiceMonths}**;
- Cyangwa **kimwe gusa muri ibyo bihano**, nk’uko iyo ngingo ibivuga. Ntibivuze ko buri muntu ahabwa ibyo bihano byose icyarimwe.

Isoko: [Ingingo ya 166, inyandiko ya Minisiteri y’Ubutabera](${source}). [Polisi y’u Rwanda yabigarutseho ku wa 20/02/2025](${corroboration}).

Impamvu nkomezacyaha cyangwa icyaha gitandukanye bishobora gutuma igihano gihinduka. Ibi ni ibisobanuro by’inyandiko zavuzwe; sinagenzuye niba hari impinduka zabaye nyuma, kandi si igihano cyemejwe ku muntu runaka.`;
  if (language === 'fr') return `Pour une personne **reconnue coupable de vol par un tribunal**, le texte publié de l’article 166 de la loi nº 68/2018 prévoit une peine de **${facts.prisonYearsMin} à ${facts.prisonYearsMax} ans de prison**, une amende de **${minFine} à ${maxFine} FRW**, des travaux d’intérêt général pendant **${facts.communityServiceMonths} mois**, ou **une seule de ces peines**. Il ne faut donc pas présenter toutes ces peines comme systématiquement cumulatives.

Sources : [texte du ministère de la Justice](${source}) et [explication de la Police du 20 février 2025](${corroboration}). Des circonstances aggravantes ou une autre qualification peuvent modifier la peine. Ce résumé décrit ces textes datés ; je n’ai pas vérifié les modifications ultérieures ni la peine applicable à un cas particulier.`;
  return `For someone **convicted of theft by a court**, the published text of Article 166 of Law nº 68/2018 lists **${facts.prisonYearsMin}–${facts.prisonYearsMax} years in prison**, a **FRW ${minFine}–${maxFine} fine**, **${facts.communityServiceMonths} months of community service**, or **only one of those penalties**. It does not say every person must receive all the listed penalties together.

Sources: [Ministry of Justice published text](${source}) and [Police explanation dated 20 February 2025](${corroboration}). Aggravating circumstances or a different charge can change the penalty. This describes the dated references; I haven’t verified later amendments or the sentence in a particular case.`;
}
