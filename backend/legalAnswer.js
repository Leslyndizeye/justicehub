import { theftPenaltyFacts as facts, theftPenaltyReference, theftPoliceReference } from './legalReferences.js';

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
