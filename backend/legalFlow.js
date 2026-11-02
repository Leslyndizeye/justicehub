import {isPenaltyFollowup} from './legalQuestion.js';

export const answerTasks=Object.freeze(['none','discussion','explanation','rule','penalty','deadline','amount','procedure','eligibility','remedy','comparison','application','source','current_verification']);
const fold=value=>String(value||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[’]/g,"'").trim().replace(/[?!.,]+$/,'').replace(/\s+/g,' ');
const followups=[
  ['source',/^(?:which (?:law|article|source)(?: applies)?|what is (?:the|your) source|where can i read (?:it|that|this|the law)|show me the (?:source|law)|give me (?:the|a) (?:source|link))$/],
  ['amount',/^(?:and )?(?:how much(?: is (?:it|that))?|what(?:'s| is| about)? (?:the )?(?:rate|amount|fee|threshold|percentage)|quel est le (?:montant|taux)|ni angahe)$/],
  ['current_verification',/^(?:please )?(?:is (?:it|that|this) still (?:valid|in force|the law)|what (?:is|about) (?:the )?(?:current|latest) (?:law|rule)|(?:search|check|verify|look (?:it|that) up)(?: (?:it|that|this))? (?:online|on the web|on the internet)|recherche sur internet|cherche en ligne|shakisha kuri interineti)$/],
  ['deadline',/^(?:(?:and|so|then) )?(?:what(?:'s| is| about)? (?:the )?(?:deadline|time limit)|when (?:do|must|should) (?:i|we) (?:file|pay|apply|appeal|submit)|how (?:much|long) (?:time )?(?:do i have|is allowed)|quel est le delai|dans quel delai|igihe ntarengwa ni iki)$/],
  ['procedure',/^(?:(?:and|so|then) )?(?:how (?:do|can|should) (?:i|we) (?:do (?:it|that)|apply|file|report(?: (?:it|that))?|appeal|register|complain|declare|submit)|what (?:documents|papers) do i need|what(?:'s| is) the (?:process|procedure)|where (?:do|can|should) i (?:go|apply|file|report(?: it)?)|who (?:do|should|can) i contact|comment (?:faire|deposer une plainte)|nabigenza nte)$/],
  ['eligibility',/^(?:(?:and|so|then) )?(?:who (?:qualifies|is eligible|can apply)|(?:am i|are we) eligible|does (?:it|that|this) apply to me|what are the (?:conditions|requirements)|qui peut (?:beneficier|demander)|bireba bande)$/],
  ['remedy',/^(?:(?:and|so|then) )?(?:what (?:can|should) (?:i|we) do(?: next)?|what are my (?:options|remedies)|how can i (?:challenge|contest) (?:it|that|this)|can i appeal(?: (?:it|that|this))?|que puis-je faire|nakora iki)$/],
  ['comparison',/^(?:and )?(?:what(?:'s| is) the difference(?: between (?:them|the two))?|how do they (?:differ|compare)|quelle est la difference|bitandukaniye he)$/],
  ['explanation',/^(?:and )?(?:why|how|explain(?: (?:it|that|more|simply))?|tell me more|give me an example|what does (?:it|that|this) mean|in simple words|sobanura(?: neza)?|explique(?: simplement)?)$/],
  ['rule',/^(?:(?:and|so) )?(?:what does the law say(?: about (?:it|that|this))?|is (?:it|that|this) (?:legal|allowed)|what are my rights|is it permitted|est-ce legal|biremewe)$/],
];
export function legalFollowup(message) {
  const text=fold(message);
  if(isPenaltyFollowup(text))return {answerTask:'penalty'};
  const found=followups.find(([,pattern])=>pattern.test(text));
  return found?{answerTask:found[0],...(found[0]==='current_verification'?{forceWeb:true}:{})}:null;
}
export function questionTask(message) {
  const text=fold(message);const exact=legalFollowup(text);if(exact)return exact.answerTask;
  if(/\b(?:current|latest|in force|amendment|agezweho|actuel|aujourd'hui)\b/.test(text))return 'current_verification';
  if(/\b(?:compare|difference between|bitandukaniye|difference entre)\b/.test(text))return 'comparison';
  if(/\b(?:cite|which law|law number|source for|source of that|where can i read)\b/.test(text))return 'source';
  if(/\b(?:penalt\w*|punish\w*|prison|jail|sentence|igihano|ibihano|ahanish\w*|peine)\b/.test(text))return 'penalty';
  if(/\b(?:deadline|time limit|when must|how many days|delai|igihe ntarengwa)\b/.test(text))return 'deadline';
  if(/\b(?:rate|rates|fee|fees|amount|threshold|percentage|how much|montant|taux)\b/.test(text))return 'amount';
  if(/\b(?:eligible|eligibility|qualif\w*|who can|requirements|conditions|bireba bande)\b/.test(text))return 'eligibility';
  if(/\b(?:how (?:do|can|should) i|procedure|process|documents|apply for|file a|report a|register|comment faire)\b/.test(text))return 'procedure';
  if(/\b(?:what can i do|options|remedies|compensation|challenge|reinstatement|nakora iki)\b/.test(text))return 'remedy';
  if(/\b(?:my case|my client|in my situation|what if|suppose|byambayeho)\b/.test(text))return 'application';
  if(/\b(?:mean|meaning|explain|definition|sobanura|signifie|expliquer)\b/.test(text))return 'explanation';
  return 'rule';
}
export function conceptualDiscussion(message) {
  const text=fold(message);
  const start=/^(?:so )?(?:what (?:do|would) (?:you|u) think (?:about|of)|how do (?:you|u) feel about|what(?:'s| is) your (?:view|opinion) (?:on|about|of)|what are your thoughts (?:on|about)|que penses-tu de|que pensez-vous de|utekereza iki kuri)\s+/.exec(text);
  if(!start || text.length>180)return false;
  return !/\b(?:article|section|penalt\w*|punish\w*|sentenc\w*|deadline|current|latest|today|my|our|i|he|she|they|his|her|their|client|case|if|how|can|should|could|report\w*|avoid|evad\w*|commit\w*|charged|convict\w*|online|internet|web|moi|mon|ma|mes)\b|\d|[;\n?]/.test(text.slice(start[0].length));
}
export function flowInstruction(task) {
  const instructions={
    explanation:'Explain the concept or provision in everyday words. A definition is not a case finding. A simple hypothetical must remain clearly hypothetical.',
    rule:'Answer the actual legal rule with its scope, conditions and exceptions; do not replace it with an unrelated definition or procedure.',
    penalty:'Find the provision establishing the consequence for the identified act. Distinguish criminal punishment, civil remedies and administrative or tax sanctions. Do not treat every legal issue as a crime. Preserve conviction or assessment conditions, ranges, units and alternatives. A procedure article alone does not establish a penalty.',
    deadline:'Find the actual time limit and its triggering event. Preserve days versus months, calendar versus working days, notice/service dates, exceptions and any source qualification. Do not calculate a case deadline without the needed dates and applicable rule.',
    amount:'Find the supported rate, fee, amount or threshold and its currency or units, taxable base, period, conditions and exceptions. Do not treat an exemption as a zero rate, a threshold as a tax rate, or a fine as a routine fee. Calculate only when the necessary rule and facts are supplied.',
    procedure:'Explain only supported steps, the competent authority, necessary documents and relevant conditions. Do not invent a form, office, filing fee, contact, deadline or obligation.',
    eligibility:'Explain who qualifies and each relevant condition, exception and exclusion. Distinguish the person, employer, taxpayer, resident or other legally defined role. Ask for missing material facts rather than declaring eligibility.',
    remedy:'Identify source-supported lawful options for the issue, such as a complaint, review, appeal or compensation where applicable. Distinguish an available remedy from a guaranteed outcome and check prerequisites and time limits.',
    comparison:'Keep the compared topics, laws and versions separate. Compare only points supported for each side; identify when a source for one side is missing. Do not merge similarly numbered articles from different laws.',
    application:'Separate the user facts, applicable provisions and conditional conclusions. Preserve negation, ages, amounts and who did what. Ask one focused question for a genuinely missing material fact; do not invent guilt or entitlement.',
    current_verification:'The user requests current-law verification. A dated local document does not prove current applicability or that there are no amendments. Use actual relevant official research and report precisely what could not be verified.',
    source:'Identify the relevant law or article with a descriptive link to its actual supplied official source and version. Do not invent an article, URL or claim to have checked current applicability without relevant research.',
  };
  return instructions[task]?`REQUESTED LEGAL TASK (${task}): ${instructions[task]}`:'';
}
export function taskEvidenceScore(text,task) {
  const patterns={penalty:/liable|punish|penalt|ahanish|igihano|passible|puni/gi,deadline:/within|before|time limit|deadline|days?|months?|delai|iminsi|amezi/gi,procedure:/application|submit|file|complaint|notify|procedure|request|demande|gusaba/gi,eligibility:/entitled|eligible|conditions|requirements|qualif|exempt|bisonewe/gi,remedy:/compensation|damages|appeal|review|reinstat|indemni|ubujurire/gi};
  return Math.min(4,(String(text).match(patterns[task]||/$a/g)||[]).length);
}
export function flowSearchTerms(message,task) {
  const text=fold(message);
  if(['procedure','remedy','deadline','eligibility'].includes(task)&&/appeal|objection|contest|review|ubujurire|recours/.test(text))return ['appeal','objection','review'];
  return {penalty:['penalty','fine','punishment'],deadline:['deadline','time','limit'],procedure:['application','procedure','submission'],eligibility:['conditions','eligibility'],remedy:['remedy','compensation','damages'],amount:['rate','fee','amount','threshold']}[task]||[];
}
export function taskClarification(task,language='en') {
  const copy={
    penalty:{en:'Which action or missed obligation are you asking about? Describe what someone did or failed to do, in your own words.',fr:'De quel acte ou de quelle obligation non respectée parlez-vous ? Décrivez simplement ce qui a été fait ou omis.',rw:'Urabaza ku kihe gikorwa cyangwa inshingano itubahirijwe? Sobanura mu magambo yawe icyakozwe cyangwa icyirengagijwe.'},
    deadline:{en:'Which filing, payment, decision or appeal is this about, and when did the relevant event happen?',fr:'De quel dépôt, paiement, décision ou recours s’agit-il, et quand l’événement concerné a-t-il eu lieu ?',rw:'Ni ubuhe busabe, ubwishyu, icyemezo cyangwa ubujurire uvuga, kandi ibyabaye bifitanye isano na byo byabaye ryari?'},
    amount:{en:'Which rate, fee or amount do you mean, and what transaction or period does it concern?',fr:'De quel taux, frais ou montant parlez-vous, et pour quelle opération ou période ?',rw:'Urabaza ku kihe gipimo cyangwa amafaranga, kandi bireba ikihe gikorwa cyangwa igihe?'},
    procedure:{en:'What action do you want to take, and what stage have you reached?',fr:'Quelle démarche souhaitez-vous entreprendre, et à quelle étape en êtes-vous ?',rw:'Ni iki ushaka gukora, kandi ugeze ku yihe ntambwe?'},
    eligibility:{en:'Who is applying or seeking the benefit, and what relevant circumstances should I consider?',fr:'Qui demande l’accès ou l’avantage, et quelles circonstances pertinentes faut-il prendre en compte ?',rw:'Ni nde usaba cyangwa ushaka kugenerwa ibivugwa, kandi ni ibihe bimureba ngomba kwitaho?'},
  };
  return copy[task]?.[language]||copy[task]?.en||null;
}
