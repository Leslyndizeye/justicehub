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

export const fraudReference = {
  title: 'Law 68/2018, Article 174 — fraud (published text)', category: 'criminal', year: 2018,
  source: 'https://www.minijust.gov.rw/fileadmin/user_upload/Minijust/Publications/Laws/Offences_and_penalties_in_general_2018.pdf#page=161',
  reviewed_on: '2026-10-06',
  content: 'Article 174 concerns obtaining another person’s property or finances through deception using false names/qualifications, promises, or threats of future misfortune. The published baseline on court conviction is 2–3 years of imprisonment AND a fine of FRW 3,000,000–5,000,000. Securities-related conduct has a separate provision. Do not confuse fraud with assault or automatically apply this baseline to every alleged scam. This is the 2018 text, not a verification of later amendments or current case eligibility.',
};

export function referencesForQuestion(interpretation) {
  if (interpretation.topic === 'theft') return [theftPenaltyReference, theftPoliceReference];
  return interpretation.topic === 'fraud' ? [fraudReference] : [];
}
