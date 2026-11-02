// Hints for routing, not corrections to the user's saved words or legal facts.
// Avoid fuzzy substitutions: similar words can name different acts or people.
const spellings = new Map(Object.entries({
  legel: 'legal', leagal: 'legal', legall: 'legal', ilegall: 'illegal', illigal: 'illegal',
  marage: 'marriage', marige: 'marriage', marrige: 'marriage', marrage: 'marriage',
  divorse: 'divorce', custudy: 'custody', landloard: 'landlord', landload: 'landlord',
  tenent: 'tenant', tennant: 'tenant', contrakt: 'contract', agrement: 'agreement',
  salery: 'salary', sallary: 'salary', emploer: 'employer', employeer: 'employer',
  dismisal: 'dismissal', dimissal: 'dismissal', overtym: 'overtime', maternaty: 'maternity',
  payrol: 'payroll', taxs: 'taxes', exemtion: 'exemption', exeption: 'exception',
  declaraton: 'declaration', compansation: 'compensation', permision: 'permission',
}));

export function questionWording(message) {
  const original = typeof message === 'string' ? message : '';
  const protectedRanges = [...original.matchAll(/```[\s\S]*?```|`[^`]*`|https?:\/\/\S+|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\b(?:my name is|call me|nitwa|je m'appelle)\s+[\p{L}'’-]+(?:\s+[\p{L}'’-]+){0,2}/giu)]
    .map(match => [match.index, match.index + match[0].length]);
  const hints = [];
  const normalized = original.replace(/\b[A-Za-z]{3,}\b/g, (word, offset) => {
    if (protectedRanges.some(([start, end]) => offset >= start && offset < end)) return word;
    const possibleReading = spellings.get(word.toLowerCase());
    if (!possibleReading) return word;
    if (hints.length < 8 && !hints.some(hint => hint.written === word)) hints.push({ written: word, possibleReading });
    return possibleReading;
  });
  return { original, normalized, hints };
}
