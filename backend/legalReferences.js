// Reviewed against the Ministry PDF (page 155) and the linked RNP explanation.
// These dated sources do not establish that no later amendment exists.
export const theftPenaltyFacts = Object.freeze({ prisonYearsMin: 1, prisonYearsMax: 2, fineMin: 1000000, fineMax: 2000000, communityServiceMonths: 6 });
export const theftPenaltyReference = {
  title: 'Law 68/2018, Article 166 — theft penalties (published text)',
  category: 'criminal',
  year: 2018,
  source: 'https://www.minijust.gov.rw/fileadmin/user_upload/Minijust/Publications/Laws/Offences_and_penalties_in_general_2018.pdf#page=155',
  reviewed_on: '2026-10-06',
  content: 'The Ministry of Justice published text of Law 68/2018, Article 166, applies to a court conviction for theft. It lists a prison term of 1–2 years, a fine of FRW 1,000,000–2,000,000, six months of community service, or only one of those penalties. Preserve the statutory alternatives: do not claim imprisonment is automatic or that all listed penalties must always be imposed together. Kinyarwanda terms: igifungo, ihazabu, imirimo y’inyungu rusange; umuntu uhamijwe n’urukiko icyaha cyo kwiba. Article 167 provides doubling for specified aggravating circumstances; a different theft offence may have different penalties. This is a dated published text, not a consolidated guarantee of the current law or the sentence in any specific case.',
};

export const theftPoliceReference = {
  title: 'Rwanda National Police explanation of theft penalties, 20 February 2025',
  category: 'criminal',
  year: 2025,
  source: 'https://police.gov.rw/media/news-detail/news/gicumbi-police-arrest-another-suspected-motorcycle-thief/',
  reviewed_on: '2026-10-06',
  content: 'The Rwanda National Police article dated 20 February 2025 also describes the Article 166 ranges and the community-service/one-penalty alternatives, and says specified Article 167 aggravating circumstances double the penalty. This corroborates the cited published provision as described on that date; it is not evidence that no subsequent amendment exists.',
};

// Read against the English text on Ministry PDF pages 155–157, 2026-11-03.
export const theftAggravationReference = {
  title:'Law 68/2018, Articles 167–168 — qualified theft penalties (published text)',category:'criminal',year:2018,
  source:theftPenaltyReference.source,reviewed_on:'2026-11-03',
  content:'Article 167 doubles the theft penalty for the listed circumstances: burglary, climbing or keys other than the owner’s; theft in an occupied house, a building used for habitation or its surroundings; a civil servant taking advantage of official duties or a person responsible for services of general interest; usurping a false public-service title or insignia or a false public-authority mandate; theft at night; or theft by more than one person. Being a government employee alone does not establish the civil-servant condition. Article 166 also includes six months of community service or only one of the listed penalties; do not reduce its alternatives to prison versus fine only. Article 168 separately provides 5–7 years of imprisonment AND a FRW 3,000,000–5,000,000 fine for theft involving violence or threats. It has distinct injury-related provisions; its 20–25-year death provision requires that the violence or threats were used WITHOUT intent to cause death. Do not generalize that range to every fatal theft or omit the intent condition. These are dated 2018 provisions, not current-law verification or a sentence for a particular person.',
};

export const fraudReference = {
  title: 'Law 68/2018, Article 174 — fraud (published text)', category: 'criminal', year: 2018,
  source: 'https://www.minijust.gov.rw/fileadmin/user_upload/Minijust/Publications/Laws/Offences_and_penalties_in_general_2018.pdf#page=161',
  reviewed_on: '2026-10-06',
  content: 'Article 174 concerns obtaining another person’s property or finances through deception using false names/qualifications, promises, or threats of future misfortune. The published baseline on court conviction is 2–3 years of imprisonment AND a fine of FRW 3,000,000–5,000,000. Securities-related conduct has a separate provision. Do not confuse fraud with assault or automatically apply this baseline to every alleged scam. This is the 2018 text, not a verification of later amendments or current case eligibility.',
};

export function referencesForQuestion(interpretation) {
  if (interpretation.topic === 'theft') return [theftPenaltyReference, theftPoliceReference,theftAggravationReference];
  return interpretation.topic === 'fraud' ? [fraudReference] : [];
}
