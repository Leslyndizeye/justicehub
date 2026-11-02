import { interpretCasualMessage } from '../shared/chatCasual.js';
import { matchedLegalVocabulary } from './legalVocabulary.js';
import { vatQuestion } from './legalTaxTopic.js';
import { isCorrectionRequest } from './chatCorrection.js';
import { employmentAgeQuestion } from './employmentAgeTopic.js';
import { everydayQuestionRoute } from '../shared/everydayQuestions.js';
import { questionWording } from '../shared/questionWording.js';
import { asksPenalty, isPenaltyFollowup } from './legalQuestion.js';
import {legalFieldFor,fieldForTopic} from './legalTopics.js';
import {legalFollowup,questionTask,conceptualDiscussion} from './legalFlow.js';

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
function baseQuestionRoute(message, history = []) {
  const text = fold(questionWording(message).normalized);
  if (interpretCasualMessage(message)?.standalone || social.test(text) || introduction.test(text)) return { kind: 'social' };
  if (/\b(?:suicid\w*|kill myself|hurt myself|can't breathe|cannot breathe|medical emergency|in immediate danger)\b/i.test(text)) return { kind: 'safety' };
  const everyday = everydayQuestionRoute(message, history);
  if (everyday && !requestsOnlineSearch(message)) return everyday;
  if (fictionalIntroduction.test(text)) return { kind: 'social' };
  // A fictional lawyer is permitted conversation, not automatically a request
  // for statutes. Let semantic understanding distinguish plot from real law.
  const previousUser = [...history].reverse().find(turn => turn.sender === 'user' && typeof turn.content === 'string');
  if (fictionalTopic.test(text) || (previousUser && fictionalTopic.test(fold(previousUser.content))
    && /\b(?:he|him|his|character|show|series|story)\b/i.test(text))) return { kind: 'unclear' };
  // Resolve referential punishment questions before the generic legal-keyword
  // gate. An earlier assistant article is never an anchor or legal authority.
  if (isPenaltyFollowup(text)) {
    const previous = [...history].reverse().find(turn => turn.sender === 'user' && typeof turn.content === 'string'
      && !isPenaltyFollowup(turn.content) && !followup.test(fold(turn.content)) && !onlineFollowup.test(fold(turn.content)));
    const earlier = previous && questionRoute(previous.content);
    if (['legal', 'discussion'].includes(earlier?.kind)) return { kind: 'legal', context: previous.content };
    return { kind: 'unclear' };
  }
  const discussion = /^(?:so\s+)?(?:what (?:do|would) (?:you|u) think|how do (?:you|u) feel|what(?:'s| is) your (?:view|opinion)|what are your thoughts)\s+(?:about|on|of)\s+/.exec(text);
  const specifics = /\b(?:article|section|law|legal|illegal|penalt\w*|punish\w*|sentenc\w*|fine|deadline|current|latest|today|my|our|i|he|she|they|his|her|their|client|case|if|how|can|should|could|help|report\w*|avoid|evad\w*|commit\w*|charged|convict\w*|police|court)\b|\d|[;\n]/.test(text.slice(discussion?.[0].length || 0));
  if (discussion && text.length <= 150 && !specifics && !requestsOnlineSearch(message)
    && (legalWords.test(text) || matchedLegalVocabulary(message).some(entry => entry.topic))) return { kind: 'discussion' };
  if (employmentAgeQuestion(message)) return { kind: 'legal', researchTopic: 'employment labour child minimum age', ...(requestsOnlineSearch(message) ? { forceWeb: true } : {}) };
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
    if ((earlierRoute?.kind === 'discussion' || earlierRoute?.intent === 'violence_discussion') && followup.test(text)
      && !asksPenalty(message) && !requestsOnlineSearch(message) && !/\b(?:legal|allowed|rights?)\b/i.test(message)) return {kind:'discussion',context:previous.content};
    if (['legal', 'discussion'].includes(earlierRoute?.kind)) return { kind: 'legal', context: previous.content, ...(requestsOnlineSearch(message) ? { forceWeb: true } : {}) };
    if (earlierRoute?.kind === 'social' && followup.test(text)) return { kind: 'social', context: previous.content };
    if (onlineFollowup.test(text) && earlierRoute?.kind === 'unrelated') return { kind: 'unrelated' };
  }
  return { kind: 'unclear' };
}

// Field-independent conversation state is reconstructed from verified USER
// turns on each request. No generated article or answer becomes legal evidence.
export function questionRoute(message,history=[]) {
  const route=baseQuestionRoute(message,history);
  if(route.intent || route.clarification || ['social','safety','unrelated'].includes(route.kind))return route;
  if(route.kind==='unclear'&&(fictionalTopic.test(message)||fictionalTopic.test(history.findLast(turn=>turn.sender==='user')?.content||'')))return route;
  const followup=legalFollowup(message);
  if(followup) {
    const at=history.findLastIndex(turn=>turn.sender==='user'&&typeof turn.content==='string'
      && !/^(?:thanks|thank you|ok|okay|murakoze|merci)[.!?\s]*$/i.test(turn.content));
    if(at<0)return {kind:'unclear',answerTask:followup.answerTask};
    const previous=history[at];const earlier=questionRoute(previous.content,history.slice(0,at));
    if(!['legal','discussion'].includes(earlier.kind))return {kind:earlier.kind==='unrelated'&&followup.forceWeb?'unrelated':'unclear',answerTask:followup.answerTask};
    const extendsContext=legalFollowup(previous.content)&&!earlier.forceWeb
      && !['current_verification','source','explanation'].includes(earlier.answerTask);
    const context=extendsContext && earlier.context && earlier.context!==previous.content
      ? `${earlier.context}\n${previous.content}` : earlier.context || previous.content;
    const field=fieldForTopic(earlier.researchTopic)||legalFieldFor(context);
    const discussion=followup.answerTask==='explanation'&&(earlier.kind==='discussion'||earlier.intent==='violence_discussion');
    return {kind:discussion?'discussion':'legal',context,answerTask:discussion?'discussion':followup.answerTask,
      ...(earlier.researchTopic?{researchTopic:earlier.researchTopic}:field?{researchTopic:field.query}:{}),
      ...(field?{field:field.id}:{}),...(followup.forceWeb?{forceWeb:true}:{})};
  }
  const field=fieldForTopic(route.researchTopic)||(vatQuestion(message)?fieldForTopic('value added tax VAT'):legalFieldFor(message));
  if(field && conceptualDiscussion(message) && !requestsOnlineSearch(message))return {kind:'discussion',answerTask:'discussion',field:field.id,researchTopic:field.query};
  // Recognising a field does not establish a legal request: "I enjoy farming"
  // still needs semantic understanding instead of manufacturing a case.
  const kind=route.kind;
  return {...route,kind,...(['legal','discussion'].includes(kind)?{
    answerTask:kind==='discussion'?'discussion':questionTask(message),
    ...(field?{field:field.id,...(!route.researchTopic?{researchTopic:field.query}:{})}:{}),
    ...(questionTask(message)==='current_verification'?{forceWeb:true}:{}),
  }:{})};
}

// A generic legal keyword establishes scope, not the meaning of an informal
// question. Give the semantic classifier these requests before choosing laws.
export function needsQuestionUnderstanding(message, route) {
  if (route.clarification || route.intent) return false;
  if (route.kind === 'unclear') return true;
  if (route.kind === 'legal' && questionWording(message).hints.length) return true;
  if (route.kind === 'legal' && !route.context && asksPenalty(message) && !matchedLegalVocabulary(message).some(entry => entry.topic)) return true;
  return route.kind === 'legal' && !route.researchTopic && !route.context
    && /\b(?:laws?|legal|illegal|allowed|rights?)\b/i.test(message)
    && !/\b(?:article|ingingo|constitution|tax|vat|paye|employment|labou?r|salary|dismissal|marriage|divorce|contract|rent|landlord|tenant|land|property|theft|fraud|rape|assault|bail|arrest|court|privacy|cybercrime|lawyer|licen[cs]e|permit)\b/i.test(message);
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
