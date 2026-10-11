import { vatQuestion } from './legalTaxTopic.js';
import { excerptArticles, lawExcerptMetadata } from './lawArticles.js';

const topic = /\b(?:vat|tva|value[ -]added tax|taxe sur la valeur ajout[eé]e)\b|\b(?:[a-z]*musoro\s*(?:ku|w[’' ]?[iya]?)?\s*)?i?nyonger(?:a|era)\s*gaciro\b/gi;
const overviewWords = new Set('what is are does do say says about tell me explain overview briefly please the a an of in on law laws rwanda rwandan amategeko itegeko avuga rivuga ku ki iki ikihe ikiha ni iki se mu mbwira bisobanura sobanura umusoro imisoro how works work que quelle quelles dit disent la le les loi lois au du de en explique expliquer sur'.split(' '));

export function isBasicVatOverview(message) {
  if (!vatQuestion(message) || vatQuestion(message).article || vatQuestion(message).focus !== 'overview') return false;
  const remainder = String(message).replace(topic,' ').match(/[\p{L}\p{N}]+/gu) || [];
  return remainder.every(word => overviewWords.has(word.toLowerCase()));
}

// Narrow, dated source answer. It is never a case-specific tax decision or a
// claim that the 2023 text remains unchanged. Other VAT requests use the model.
export function vatOverviewAnswer(message, excerpts = [], language = 'en') {
  if (!isBasicVatOverview(message)) return null;
  const valid = excerpts.filter(excerpt => {
    const doc = lawExcerptMetadata(excerpt);
    if (doc?.key !== 'law-49-2023' || doc.page < doc.provisionsFrom) return false;
    try {
      const url = new URL(excerpt.source);
      return url.protocol === 'https:' && !url.username && !url.password && !url.search
        && url.pathname === `/storage/v1/object/public/justicehub-legal-sources/amategeko/${doc.sha256}.pdf`
        && url.hash === `#page=${doc.page}`;
    } catch { return false; }
  });
  const article = number => valid.filter(excerpt=>excerptArticles(excerpt).includes(number)).map(excerpt=>excerpt.content).join('\n');
  if (!/\b0\s*%/.test(article(4)) || !/\b18\s*%/.test(article(4)) || !/byoherejwe|export/i.test(article(7))
    || !/uburezi|education|éducation/i.test(article(8)) || !/ubuzima|health|santé/i.test(article(8))
    || !/200[\s.,]*000[\s.,]*000/.test(article(28)) || !/\b15\b/.test(article(28))) return null;
  const source = new URL(valid[0].source); source.hash = '';
  const link = `[LAW ESTABLISHING VALUE ADDED TAX.pdf](${source.href})`;
  return {
    rw: `Itegeko nº 049/2023 ryo ku wa 05/09/2023 rishyiraho umusoro ku nyongeragaciro (VAT). Mu nyandiko ya 2023 yabitswe:

- **Ingingo ya 4:** ibipimo ni 0% ku bintu na serivisi bicibwa umusoro ku ijanisha rya zeru, na 18% ku bindi bisoreshwa.
- **Ingingo ya 7:** igaragaza ibicibwa umusoro ku ijanisha rya zeru, harimo ibintu na serivisi byoherejwe mu mahanga.
- **Ingingo ya 8:** igaragaza ibisonewe, harimo serivisi n’ibikoresho bimwe by’ubuzima n’uburezi, hakurikijwe ibisabwa n’urutonde rwemewe. **Gusonerwa umusoro bitandukanye no gusoreshwa kuri 0%.**
- **Ingingo ya 28:** usora ufite ibyacurujwe bitarenze 200.000.000 FRW ku mwaka amenyekanisha buri gihembwe, mu minsi 15 nyuma yacyo; urengeje uwo mubare akamenyekanisha buri kwezi, mu minsi 15 nyuma yako. Ufite ibyacurujwe bitarenze uwo mubare ashobora guhitamo kumenyekanisha buri kwezi.

Isoko: ${link}.

Ibi bisobanura inyandiko ya 2023; impinduka zakurikiyeho ntizigenzuwe muri iki gisubizo.`,
    en: `Law No. 049/2023 of 05/09/2023 establishes value added tax (VAT). In the stored 2023 version:

- **Article 4:** rates are 0% for zero-rated taxable supplies and 18% for other taxable supplies.
- **Article 7:** lists zero-rated supplies, including exported goods and services.
- **Article 8:** lists exemptions, including specified health and education supplies, subject to the stated conditions and approved lists. **VAT-exempt and zero-rated are different categories.**
- **Article 28:** taxpayers with annual turnover of no more than RWF 200 million declare quarterly within 15 days after the quarter; those above that threshold declare monthly within 15 days after the month. Smaller taxpayers may choose monthly declarations.

Source: ${link}.

This explains the published 2023 text; later amendments have not been checked in this answer.`,
    fr: `La loi nº 049/2023 du 05/09/2023 établit la taxe sur la valeur ajoutée (TVA). Dans la version de 2023 enregistrée :

- **Article 4 :** les taux sont de 0 % pour les opérations taxables à taux zéro et de 18 % pour les autres opérations taxables.
- **Article 7 :** énumère les opérations à taux zéro, dont les biens et services exportés.
- **Article 8 :** énumère les exonérations, notamment certaines fournitures de santé et d’éducation, sous les conditions et listes approuvées. **L’exonération et le taux zéro sont différents.**
- **Article 28 :** jusqu’à 200 millions FRW de chiffre d’affaires annuel inclus, la déclaration est trimestrielle, dans les 15 jours suivant le trimestre ; au-delà, elle est mensuelle, dans les 15 jours suivant le mois. Les petits contribuables peuvent choisir la déclaration mensuelle.

Source : ${link}.

Cette explication porte sur le texte publié en 2023 ; les modifications ultérieures n’ont pas été vérifiées ici.`,
  }[language] || null;
}
