import { theftPenaltyFacts as facts, theftPenaltyReference, theftPoliceReference } from './legalReferences.js';
import {theftComparisonQuestion} from '../shared/theftComparison.js';

export function referencedTheftComparisonAnswer(message,language='en') {
  if(!theftComparisonQuestion(message))return null;
  const source=theftPenaltyReference.source;
  if(language==='rw')return `**Oya, ibihano si bimwe.** Mu nyandiko yasohowe y’itegeko nº 68/2018:

- **Ingingo ya 166** iteganya ibihano bisanzwe byo kwiba. Iyo ngingo ivuga n’uburyo umuntu ashobora guhanishwa kimwe gusa mu bihano biteganyijwe.
- **Ingingo ya 167** iteganya ko igihano cyikuba kabiri iyo hari imwe mu mpamvu nkomezacyaha zivugwamo, nko kwiba nijoro cyangwa kwiba byakozwe n’abantu barenze umwe.
- **Ingingo ya 168** ifite ibihano byihariye ku kwiba hakoreshejwe kiboko cyangwa ibikangisho; ntibikwiye kuvanga ibyo byaha byose.

[Isoko: Minisiteri y’Ubutabera, impapuro za 155–156](${source}). Ibi bisobanura inyandiko yo mu 2018; sinagenzuye impinduka zakurikiyeho kandi si ukwemeza igihano cy’umuntu runaka.`;
  if(language==='fr')return `**Non, les peines ne sont pas identiques.** Dans le texte publié de la loi nº 68/2018 :

- **L’article 166** prévoit les peines de base du vol, avec la possibilité de ne prononcer qu’une seule des peines énumérées.
- **L’article 167** double la peine dans les circonstances aggravantes qu’il énumère, notamment le vol commis la nuit ou par plusieurs personnes.
- **L’article 168** prévoit des peines distinctes pour le vol avec violence ou menaces : toutes ces situations ne relèvent donc pas d’un simple doublement.

[Source : ministère de la Justice, pages 155–156](${source}). Il s’agit du texte publié en 2018 ; les modifications ultérieures et la peine applicable à un cas particulier n’ont pas été vérifiées.`;
  return `**No—the penalties are not the same.** In the published text of Law nº 68/2018:

- **Article 166** sets the baseline theft penalties and includes the option of only one of the listed penalties.
- **Article 167** doubles the penalty for the aggravating circumstances it lists, including theft at night or by more than one person.
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
