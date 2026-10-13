import { basicEmploymentAgeQuestion } from './employmentAgeTopic.js';
import { lawExcerptMetadata } from './lawArticles.js';
import { readLawArticles } from './lawArticleReader.js';

const reviewedHash = 'c69751950c8114a9b3ba961ce0b668a05bdad5e77a3fe8431c840c4522b305b7';
const normalize = text => String(text).normalize('NFKC').replace(/\s+/g, ' ').trim();

// Reviewed explanation of this exact published PDF, not a current-law or
// individual employment decision. Changed text requires a fresh review.
export function employmentAgeAnswer(message, excerpts = [], language = 'en') {
  if (!basicEmploymentAgeQuestion(message)) return null;
  const valid = number => excerpts.find(excerpt => {
    const doc = lawExcerptMetadata(excerpt);
    if (doc?.key !== 'law-66-2018' || doc.sha256 !== reviewedHash || excerpt.articleNumber !== number
      || excerpt.coverage !== 'complete_article') return false;
    const original = readLawArticles(doc.key, doc.language).find(article => article.number === number);
    return original?.complete && doc.page === original.segments[0]?.page
      && excerpt.source === `${doc.archiveSource}#page=${doc.page}`
      && normalize(excerpt.content.split('\n').slice(2).join('\n')) === normalize(original.segments.map(segment => segment.text).join('\n'));
  });
  const age = valid(5), prohibited = valid(6);
  if (!age || !prohibited) return null;
  const link = `[Law_regulating_labour_in_Rwanda.pdf](${age.source})`;
  return {
    en: `**The minimum age for ordinary employment is 16 years.** Article 5 of Law No. 66/2018 sets that age.

**Ages 13–15:** only light work within an apprenticeship is allowed. This exception does not allow ordinary employment at 15. The Minister’s order determines the permitted light-work list.

**Under 18:** Article 6 prohibits specified harmful work, including dangerous machinery, underground work, heavy loads, and long-hours or night work. Turning 18 does not automatically authorize every occupation.

**PDF wording — Article 5:**
> The minimum age for admission to employment is sixteen (16) years.

Source: ${link}, Articles 5–6. This explains the published 2018 text; later changes and the applicable Minister’s orders are not checked in this answer.`,
    rw: `**Imyaka fatizo yo gutangira akazi gasanzwe ni 16.** Ingingo ya 5 y’Itegeko nº 66/2018 ni yo igena iyo myaka.

**Imyaka 13–15:** umwana yemerewe gusa imirimo yoroheje mu rwego rwo kwitoza umurimo. Ibi ntibivuga ko ufite imyaka 15 yemerewe akazi gasanzwe. Iteka rya Minisitiri ni ryo rigena urutonde rw’iyo mirimo yoroheje.

**Utaramara imyaka 18:** Ingingo ya 6 ibuza imirimo yangiza umwana, harimo gukoresha imashini ziteje akaga, gukorera munsi y’ubutaka, gutwara imitwaro iremereye, gukora amasaha menshi cyangwa nijoro. Kugira imyaka 18 ntibihita byemerera umuntu gukora umurimo uwo ari wo wose.

**Amagambo ya PDF — Ingingo ya 5:**
> Imyaka fatizo yo gutangira gukora akazi ni cumi n’itandatu (16).

Isoko: ${link}, Ingingo ya 5–6. Ibi bisobanura inyandiko yatangajwe mu 2018; impinduka zakurikiyeho n’amateka ya Minisitiri bireba iki kibazo ntibyagenzuwe muri iki gisubizo.`,
    fr: `**L’âge minimum pour un emploi ordinaire est de 16 ans.** L’article 5 de la loi nº 66/2018 fixe cet âge.

**De 13 à 15 ans :** seuls des travaux légers dans le cadre d’un apprentissage sont autorisés. Cette exception n’autorise pas un emploi ordinaire à 15 ans. Un arrêté ministériel fixe la liste des travaux légers permis.

**Moins de 18 ans :** l’article 6 interdit certaines formes de travail nocives, notamment les machines dangereuses, le travail souterrain, les charges lourdes et le travail de longue durée ou de nuit. Avoir 18 ans n’autorise pas automatiquement toute profession.

**Texte PDF — Article 5 :**
> L’âge minimum d’admission à l’emploi est de seize (16) ans.

Source : ${link}, articles 5–6. Cette explication porte sur le texte publié en 2018 ; les modifications ultérieures et les arrêtés ministériels applicables ne sont pas vérifiés dans cette réponse.`,
  }[language] || null;
}
