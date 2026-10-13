import { interpretCasualMessage } from '../shared/chatCasual.js';
import { matchedLegalVocabulary } from './legalVocabulary.js';
import { vatQuestion } from './legalTaxTopic.js';
import { isCorrectionRequest } from './chatCorrection.js';

const fold = text => String(text || '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
const legalWords = /\b(?:laws?|legal|legally|illegal|rights?|responsibilit\w*|courts?|judges?|lawyers?|advocates?|attorneys?|justice|constitution|contracts?|agreements?|tax\w*|paye|vat|tva|income|employment|employers?|employees?|labou?r|salary|wages?|dismiss\w*|fired|severance|overtime|maternity|maternitty|termination|apprentice|tenan\w*|landlord|rent\w*|evict\w*|deposit|land|property|ownership|inherit\w*|divorc\w*|marriage|custody|child support|fraud|scam\w*|theft|steal\w*|stolen|robbery|rape|assault|threat\w*|harass\w*|abuse|consent|discriminat\w*|arrest\w*|bail|prison|sentenc\w*|penalt\w*|punish\w*|prohibit\w*|evidence|summon\w*|appeal\w*|lawsuit|complaint|licen[cs]\w*|permit|authoris\w*|authoriz\w*|privacy|data protection|cybercrime|hacking|phishing|copyright|trademark|refund|consumer|compensation|damages|defence|defense|crime|criminal|offence|offense|police|rib|parliament|bar association|bar internal|amategeko|itegeko|tegeko|ingingo|uburenganzira|inshingano|icyaha|ibyaha|ibihano|igihano|umusoro|imisoro|akazi|umukozi|umukoresha|umushahara|kwirukan\w*|ubutaka|amasezerano|ubukode|ubujura|gutubur\w*|gufata\s*ku\s*ngufu|uburiganya|ubwicanyi|ahanish\w*|urukiko|inkiko|ikirego|avoka|kubyara|lois?|juridique|droits?|avocats?|tribunal|impots?|emploi|travail|salaire|licenci\w*|locataire|bailleur|contrat|divorce|plainte|peine|vol|viol|escroquer\w*|autorisation)\b/i;
const social = /^(?:hello|hi|hey+|yoo+|muraho|mwiriwe|mwaramutse|thanks|thank you|murakoze|bonjour|salut|merci|who are you|what (?:is your purpose|can you do|do you like to eat)|what is my name|what do you remember about me|remember .+|forget .+)[\s.!?]*$/i;
const introduction = /^(?:my name is|nitwa)\s+[\p{L}'’-]+(?:\s+[\p{L}'’-]+){0,2}[.!?]*$/iu;
const fictionalTopic = /\b(?:jimmy mcgill|saul goodman|better call saul)\b/i;
const fictionalIntroduction = /^(?:(?:do|did)\s+(?:you|u)\s*know|(?:you|u)\s*know|who(?:\s*is|'s)|tell\s+me\s+about)\s*(?:jimmy\s*mcgill|saul\s*goodman)(?:\s+(?:in|from)\s+better call saul)?[\s.!?]*$/i;
const unrelated = /\b(?:yog(?:h|o|oh)?urt|recipes?|cook\w*|meal|food|hungry|football|soccer|sports?|match score|celebrit\w*|weather|horoscope|video games?|python|javascript|programming|coding|bitcoin price)\b|\b(?:i (?:want|need|like) (?:to eat|to drink|pizza|milk|coffee|tea)|latest news)\b|\b(?:ndashaka|nkunda)\s+(?:kurya|kunywa|yawurute)|\b(?:recette|cuisin\w*|yaourt)\b/i;
const followup = /^(?:(?:and |but |so )?(?:why|how|what about (?:that|this|it|now|children)|is that (?:legal|allowed|right)|explain (?:it|that|more)|tell me more|in (?:english|french|kinyarwanda)|answer in (?:english|french|kinyarwanda)|what (?:is|about) the (?:penalty|punishment)|how much|how long|what next)|sobanura(?: neza)?|ahanishwa iki|mu cyongereza|en francais)[\s.!?]*$/i;
const onlineFollowup = /^(?:please\s+)?(?:(?:can|could|would) you\s+)?(?:search(?:\s+(?:it|that))?\s+(?:online|(?:the )?web|(?:on(?: the)?|the) internet)|look (?:it|that) up(?: online)?|check(?: (?:it|that))? (?:online|on(?: the)? internet)|do a web search|browse(?: the web)?|(?:shakisha|washakisha) kuri (?:internet|interineti)|recherche sur internet|cherche en ligne|peux-tu chercher en ligne)(?:\s+(?:please|again|instead|for (?:it|that|this)))?[\s.!?]*$/i;
export const requestsOnlineSearch = message => onlineFollowup.test(fold(message))
  || /\b(?:search|check|verify|look up|shakisha|chercher|rechercher)\b.{0,80}\b(?:online|internet|interineti|web|en ligne)\b/i.test(fold(message));

// This is a conservative routing gate, not a finding that an offence occurred.
// An unclear request gets context before retrieval; a mere possible legal angle
// to any everyday word must not manufacture a legal question.
export function questionRoute(message, history = []) {
  const text = fold(message);
  if (interpretCasualMessage(message)?.standalone || social.test(text) || introduction.test(text)) return { kind: 'social' };
  if (/\b(?:suicid\w*|kill myself|hurt myself|can't breathe|cannot breathe|medical emergency|in immediate danger)\b/i.test(text)) return { kind: 'safety' };
  if (fictionalIntroduction.test(text)) return { kind: 'social' };
  // A fictional lawyer is permitted conversation, not automatically a request
  // for statutes. Let semantic understanding distinguish plot from real law.
  const previousUser = [...history].reverse().find(turn => turn.sender === 'user' && typeof turn.content === 'string');
  if (fictionalTopic.test(text) || (previousUser && fictionalTopic.test(fold(previousUser.content))
    && /\b(?:he|him|his|character|show|series|story)\b/i.test(text))) return { kind: 'unclear' };
  if (/\b(?:children|child|kids?|umwana|abana|enfant).*(?:work|akazi|gukora|travail)|\b(?:work|akazi|travail).*(?:children|child|kids?|umwana|abana|enfant)|\b(?:paid|bought).*(?:never|not|didn't|refus).*(?:deliver|receive|refund)|\b(?:minimum age).*(?:work|employ)/i.test(text)) return { kind: 'legal', ...(requestsOnlineSearch(message) ? { forceWeb: true } : {}) };
  if (legalWords.test(text) || matchedLegalVocabulary(message).some(entry => entry.topic) || vatQuestion(message)) return { kind: 'legal', ...(requestsOnlineSearch(message) ? { forceWeb: true } : {}) };
  // Intercept only clear off-topic requests. A sentence mentioning food or
  // technology might describe a consumer complaint or other indirect issue.
  if (unrelated.test(text) && (/^i (?:want|need|like) (?:some |a |an )?(?:yog(?:h|o|oh)?urt|pizza|milk|coffee|tea)(?: please)?[\s.!?]*$/i.test(text)
    || /^(?:please )?(?:give|show|write|make|find|recommend|suggest|tell).*(?:recipe|football scores|sports scores|python code|javascript code)/i.test(text)
    || /^latest (?:football|soccer|sports|news)\b/i.test(text))) return { kind: 'unrelated' };
  if (followup.test(text) || onlineFollowup.test(text) || isCorrectionRequest(message)) {
    // Only user context can establish a topic. A previous erroneous assistant
    // PDF citation must never make the next message a legal request.
    const previous = [...history].reverse().find(item => item.sender === 'user' && typeof item.content === 'string' && !followup.test(fold(item.content)) && !onlineFollowup.test(fold(item.content)) && !isCorrectionRequest(item.content));
    const earlierRoute = previous && questionRoute(previous.content);
    if (earlierRoute?.kind === 'legal') return { kind: 'legal', context: previous.content, ...(requestsOnlineSearch(message) ? { forceWeb: true } : {}) };
    if (earlierRoute?.kind === 'social' && followup.test(text)) return { kind: 'social', context: previous.content };
    if (onlineFollowup.test(text) && earlierRoute?.kind === 'unrelated') return { kind: 'unrelated' };
  }
  return { kind: 'unclear' };
}

export function scopeReply(language = 'en') {
  return {
    en: 'JusticeHub focuses on law and your rights, especially in Rwanda. I can help with a legal question or explain a legal document.',
    rw: 'JusticeHub igufasha kumenya amategeko n’uburenganzira bwawe, cyane cyane mu Rwanda. Nshobora kugufasha ku kibazo cy’amategeko cyangwa kugusobanurira inyandiko y’amategeko.',
    fr: 'JusticeHub vous aide à comprendre le droit et vos droits, surtout au Rwanda. Je peux vous aider sur une question juridique ou expliquer un document juridique.',
  }[language] || 'JusticeHub focuses on law and your rights, especially in Rwanda. I can help with a legal question or explain a legal document.';
}

export function insufficientSourcesReply(language = 'en') {
  return {
    en: 'I couldn’t establish the answer from the available legal sources. I won’t substitute an unrelated article. If you have the relevant provision or document, share it and I can explain it.',
    rw: 'Sinabonye amakuru ahagije mu masoko y’amategeko mfite yo gusubiza iki kibazo neza. Ntabwo nayasimbuza ingingo itajyanye na cyo. Niba ufite ingingo cyangwa inyandiko ibireba, yohereze ngusobanurire.',
    fr: 'Les sources juridiques disponibles ne permettent pas d’établir la réponse. Je ne remplacerai pas le texte pertinent par un article sans rapport. Si vous avez la disposition ou le document concerné, partagez-le pour que je l’explique.',
  }[language] || 'The available legal sources do not establish the answer to this question.';
}
