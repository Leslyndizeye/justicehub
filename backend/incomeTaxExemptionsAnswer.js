import { lawExcerptMetadata } from './lawArticles.js';
import { readLawArticles } from './lawArticleReader.js';

// This explanation was reviewed against Article 16 of this exact PDF version.
// A replacement PDF requires a fresh review, even if its title is unchanged.
const reviewedHash = '41d4351ea189cea2571e7f4dbae20f7cab3c0148b4193d75ce954e1e4518dd02';
const fold = text => String(text).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
const overviewWords = new Set('what which are is the a an payments payment types categories exempt exempted excluded exemptions from of employment income tax taxation paye please explain list tell me about in rwanda rwandan under law laws article ibisonewe ibishyurwa ibyishyurwa umusoro ku musaruro ukomoka murimo ni iki ibihe amategeko itegeko mbwira sobanura mu ya paiements paiement exoneres exonere exonerations impot revenu emploi quels quelles sont les le la l de du des sur expliquer explique liste au'.split(' '));

export function isBasicEmploymentExemptionsQuestion(message) {
  const text = fold(message);
  const topic = /\bemployment income tax\b|\bpaye\b|\bumusoro ku musaruro ukomoka ku murimo\b|\bimpot (?:sur le )?revenu d['’ ]emploi\b/.test(text);
  const exemption = /\b(?:exempt(?:ed|ions)?|excluded|ibisonewe|exoner(?:es|e|ations))\b/.test(text);
  if (!topic || !exemption) return false;
  const remainder = text.replace(/\b(?:law|loi|itegeko)\s*(?:(?:no\.?|n[º°o]?\.?)\s*)?0?27\/2022\b/g, '')
    .replace(/\barticle\s+16\b/g, '').replace(/\bd['’]emploi\b/g, 'emploi');
  return (remainder.match(/[\p{L}\p{N}]+/gu) || []).every(word => overviewWords.has(word));
}

const normalize = text => String(text).normalize('NFKC').replace(/\s+/g, ' ').trim();

export function incomeTaxExemptionsAnswer(message, excerpts = [], language = 'en') {
  if (!isBasicEmploymentExemptionsQuestion(message)) return null;
  const source = excerpts.find(excerpt => {
    const doc = lawExcerptMetadata(excerpt);
    if (doc?.key !== 'law-27-2022' || doc.sha256 !== reviewedHash
      || excerpt.coverage !== 'complete_article' || excerpt.articleNumber !== 16) return false;
    const article = readLawArticles(doc.key, doc.language).find(item => item.number === 16);
    if (!article?.complete || doc.page !== article.segments[0]?.page) return false;
    const original = article.segments.map(segment => segment.text).join('\n');
    const supplied = String(excerpt.content).split('\n').slice(2).join('\n');
    if (normalize(supplied) !== normalize(original)) return false;
    try {
      const url = new URL(excerpt.source);
      return url.href === `${doc.archiveSource}#page=${doc.page}`;
    } catch { return false; }
  });
  if (!source) return null;
  const link = `[Income_Tax_law_of_2022.pdf](${source.source})`;
  return {
    en: `**Article 16 of Law No. 027/2022 excludes these five categories of payments from taxable employment income:**

1. **Specified expense payments or reimbursements** incurred by the employee or their associate. Article 16(1) lists these conditions: (a) wholly for the employer’s business activities; (b) deducted or deductible when calculating the employee’s income from all their business activities.
2. **Employer contributions to public social security** made for the employee.
3. **Pension payments** from the public social-security institution or a qualified pension fund.
4. **Aid-service employment income** paid to a non-Rwandan citizen by a foreign government or NGO under an agreement signed by Rwanda’s government, for aid services performed in Rwanda.
5. **Income of a non-resident individual from a non-resident employer** for services performed in Rwanda, **unless those services relate to the employer’s permanent establishment in Rwanda**.

These payments are left out when calculating taxable employment income, subject to their listed conditions.

Source: ${link}, Article 16. This explains the published 2022 provision; later amendments have not been checked in this answer.`,
    rw: `**Ingingo ya 16 y’Itegeko nº 027/2022 igaragaza ibyiciro bitanu by’ibishyurwa bitabarirwa mu musaruro usoreshwa ukomoka ku murimo:**

1. **Iyishyurwa cyangwa isubizwa ry’ibyakoreshejwe n’umukozi cyangwa uwo bafatanyije.** Ingingo ya 16(1) igaragaza ibi bisabwa: (a) byose bigenewe ibikorwa by’umukoresha; (b) bivanwa cyangwa byagombaga kuvanwa mu ibara ry’umusaruro w’umukozi ku bikorwa bye byose.
2. **Imisanzu y’ubwiteganyirize** umukoresha ashyirira umukozi mu rwego rwa Leta rubishinzwe.
3. **Ibyishyurwa biturutse ku bwiteganyirize** bitanzwe n’urwego rwa Leta rubishinzwe cyangwa ikigega cya pansiyo cyemewe.
4. **Umusaruro w’imirimo y’imfashanyo yakorewe mu Rwanda**, wishyuwe umuntu udafite ubwenegihugu nyarwanda na Leta y’inyamahanga cyangwa umuryango utari uwa Leta, hakurikijwe amasezerano bagiranye na Leta y’u Rwanda.
5. **Umusaruro wishyuwe umuntu ku giti cye udatuye mu Rwanda n’umukoresha na we udatuye mu Rwanda**, kubera serivisi yakoreye mu Rwanda, **uretse iyo izo serivisi zifitanye isano n’icyicaro gihoraho cy’umukoresha mu Rwanda**.

Ibi ntibibarirwa mu musaruro usoreshwa ukomoka ku murimo, hakurikijwe ibisabwa kuri buri cyiciro.

Isoko: ${link}, Ingingo ya 16. Ibi bisobanura inyandiko yasohotse mu 2022; impinduka zakurikiyeho ntizigenzuwe muri iki gisubizo.`,
    fr: `**L’article 16 de la loi nº 027/2022 exclut ces cinq catégories de paiements du revenu d’emploi imposable :**

1. **L’acquittement ou le remboursement de dépenses de l’employé ou de son associé.** L’article 16(1) énonce ces conditions : (a) totalement au titre des activités d’affaires de l’employeur ; (b) déductibles dans le calcul du revenu de l’employé tiré de toutes ses activités.
2. **Les cotisations de l’employeur à la sécurité sociale publique**, versées pour le compte de l’employé.
3. **Les pensions** versées par l’institution publique de sécurité sociale ou un fonds de pension qualifié.
4. **Le revenu de services d’assistance au Rwanda**, perçu par un employé non rwandais auprès d’un gouvernement étranger ou d’une ONG, dans le cadre d’une convention signée par le Gouvernement rwandais.
5. **Le revenu d’une personne physique non résidente au Rwanda auprès d’un employeur également non résident**, pour des services au Rwanda, **sauf si ces services se rapportent à un établissement stable de l’employeur au Rwanda**.

Ces paiements sont exclus du calcul du revenu d’emploi imposable, sous les conditions indiquées pour chaque catégorie.

Source : ${link}, article 16. Cette explication porte sur la disposition publiée en 2022 ; les modifications ultérieures n’ont pas été vérifiées ici.`,
  }[language] || null;
}
