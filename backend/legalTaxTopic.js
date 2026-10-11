// Topic recognition only: this does not establish a rate, exemption or current law.
const vatWords = /\b(?:vat|tva|value[ -]added tax|taxe sur la valeur ajout[eé]e)\b/i;
const vatKinyarwanda = /\b(?:[a-z]*musoro\s*(?:ku|w[’' ]?[iya]?)?\s*)?i?nyonger(?:a|era)\s*gaciro\b/i;

export function vatQuestion(message, history = []) {
  const text = String(message || '');
  let explicit = vatWords.test(text) || vatKinyarwanda.test(text);
  // Only a short referential follow-up can inherit the previous user's topic.
  if (!explicit && text.length < 140 && /^(?:none|se\b|aho\b|what about|and\b|how about|(?:explain|mbwira).{0,15}(?:article|ingingo))|\b(?:that tax|uwo musoro|iryo tegeko)\b/i.test(text)) {
    const earlier = [...history].reverse().find(item => item.sender === 'user' && typeof item.content === 'string');
    explicit = Boolean(earlier && (vatWords.test(earlier.content) || vatKinyarwanda.test(earlier.content)));
  }
  if (!explicit) return null;
  const article = text.match(/\b(?:article|i?ngingo\s*(?:ya)?)\s*(\d{1,3})\b/i)?.[1];
  let focus = 'overview';
  if (/\b(?:exempt\w*|bisonewe|gusoner\w*|exon[eé]r\w*)\b/i.test(text)) focus = 'exemptions';
  else if (/zero[ -]rat|ijanisha rya zeru/i.test(text)) focus = 'zero_rate';
  else if (/declar\w*|filing|deadline|imenyekan\w*|kumenyekan\w*/i.test(text)) focus = 'declaration';
  else if (/\b(?:rate\w*|ibipimo|ijanisha|taux)\b/i.test(text)) focus = 'rates';
  else if (/register|registration|kwiyandik\w*|iyandik\w*/i.test(text)) focus = 'registration';
  return { article: article ? Number(article) : null, focus };
}

export const vatOverviewArticles = [4, 7, 8, 28];
export function vatFocusArticles(question) {
  if (question.article) return [question.article];
  return {overview:vatOverviewArticles, rates:[4,7,8], exemptions:[8,9], zero_rate:[7,9], declaration:[28,29], registration:[30,18]}[question.focus];
}
