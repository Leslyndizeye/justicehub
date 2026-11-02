// A conceptual discussion must not quietly turn into an unsourced statutory
// answer. Buffer it, repair once, then use the ordinary provider fallback.
export function generalDiscussionIssue(text) {
  if (String(text).trim().split(/\s+/).length > 180) return 'length';
  if (/https?:\/\/|\b(?:article\s+\d+|law\s*(?:no\.?|n[º°])?\s*\d+|penal code|criminal code|civil code|imprison\w*|convict\w*|sentenc\w*|punish\w*|penalt\w*|liable to|illegal|unlawful|offen[cs]e|statutor\w*|infraction|amende|emprison\w*|igihano|igifungo|ihazabu)\b|\b(?:a|an|pay|financial|monetary)\s+fine\b|\bfines?\s+of\b|\b(?:must report|legally required|have the right to)\b|\b(?:file|pursue)\s+(?:a\s+)?(?:civil\s+)?claim\b/i.test(String(text))) return 'legal_claim';
  return null;
}
