// Dialogue-grounded local extraction. Facts must come from the person's own statements.
export const memoryCategories = ['note', 'response_style', 'language', 'language_ability', 'occupation', 'education', 'project', 'goal', 'location', 'skills', 'interests', 'constraints', 'budget', 'hardware', 'deployment'];
export const memoryCategoryLabels = { note: 'Saved note', response_style: 'Response preference', language: 'Language preference', language_ability: 'Languages spoken', occupation: 'Work', education: 'Study', project: 'Project', goal: 'Goal', location: 'General location', skills: 'Skills', interests: 'Interests', constraints: 'Project constraints', budget: 'Project budget', hardware: 'Computer', deployment: 'Hosting requirements' };
export function memoryCategoryMatches(category, group) {
  return category === group || group === 'constraints' && ['budget', 'hardware', 'deployment'].includes(category)
    || group === 'language' && category === 'language_ability';
}

const privateOrCase = /\b(?:password|api[ _-]?key|secret|passport|national id|born|birthday|date of birth|home address|street|avenue|house number|phone|email|bank|account number|client|patient|court case|accused|arrested|stole|criminal record|immigration|diagnos\w*|illness|medical|health|political|religion|ijambo ry['’]ibanga|indangamuntu|umukiriya|urubanza|naribye|uburwayi|navutse|mot de passe)\b|https?:\/\/|[^\s]+@[^\s]+\.[a-z]+|\b\d{9,}\b|\b(?:gsk_|sk-|tvly-|sb_secret_|eyJ)[A-Za-z0-9_-]{12,}/i;
const hypothetical = /\b(?:imagine|suppose|pretend|hypothetical|for example|if i|if my|niba|urugero|imaginons|supposons|par exemple|si je)\b/i;
const temporary = /\b(?:today|tonight|just now|this morning|this afternoon|this week|currently visiting|on holiday|uyu munsi|uyu mugoroba|aujourd'hui|ce soir)\b/i;
const uncertain = /\b(?:maybe|perhaps|might|not sure|possibly|probably|bishoboka|peut.[eê]tre|je ne sais pas)\b/i;
const thirdParty = /\b(?:my (?:friend|client|child|son|daughter|wife|husband|partner|colleague)|umukiriya|inshuti yanjye|umwana wanjye|mon (?:ami|client|enfant)|ma (?:femme|coll[eè]gue))\b/i;
const occupation = /^(?:i(?: am|['’]m)|i work as|je suis|je travaille comme|ndi|nkora nka)\s+(?:(?:a|an|un|une)\s+)?(?:lawyer|attorney|judge|teacher|engineer|software developer|developer|programmer|student|doctor|nurse|farmer|entrepreneur|researcher|advocate|accountant|designer|business owner|umunyamategeko|umwarimu|umucamanza|umuhinzi|umucuruzi|umushakashatsi|avocat(?:e)?|enseignant(?:e)?|ing[eé]nieur|d[eé]veloppeur|comptable)\b/i;
const education = /^(?:i study|i(?: am|['’]m) studying|i(?: am|['’]m) (?:a |an )?(?:law |university |college )?student|niga|ndiga|ndimo kwiga|ndi umunyeshuri|je suis [eé]tudiant(?:e)?|j['’][eé]tudie)\b/i;
const project = /^(?:i(?: am|['’]m) (?:building|developing|working on)|my (?:project|app|business) (?:is|is called)|ndimo (?:kubaka|gukora)|umushinga wanjye ni|je (?:d[eé]veloppe|travaille sur|construis))\s/i;
const goal = /^(?:my goal is|i aim to|i want to become|i(?: am|['’]m) planning to study|intego yanjye|ndashaka kuzaba|je souhaite devenir|mon objectif)\s/i;
const preferenceStart = /^(?:i (?:prefer|like|want|need)|please(?: always)?|keep (?:your |the )?|make (?:your |the )?|nkunda|ndashaka|ujye|je pr[eé]f[eè]re|je souhaite|j['’]aime|r[eé]ponds)\b/i;
const supportedLanguage = /\b(?:english|french|kinyarwanda|ikinyarwanda|anglais|fran[cç]ais|icyongereza|igifaransa)\b/i;
const questionStart = /^(?:can (?:you|u|i)|could (?:you|u|i)|do (?:you|u|i)|what|how|why|where|who|when|is|am i|ese|uzi|waba|ni iki|comment|pourquoi|est.ce)\b/i;
const negation = /\b(?:not|never|no longer|don't|do not|isn't|is not|stopped|ntabwo|sindi|siniga|ntibikiri|ne .* pas)\b/i;

export function memoryStatements(message) {
  if (typeof message !== 'string' || hypothetical.test(message)) return [];
  if (/\b(?:do not|don't|never) (?:save|remember|store)|ntukabike|ntukibuke|ne (?:m[eé]morise|retiens) pas/i.test(message)) return [];
  // Block quotations and code before splitting: quoted instructions are not identity.
  const text = message.replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60|\x60[^\x60]*\x60/g, '').replace(/^\s*>.*$/gm, '')
    .replace(/"[^"\n]*"|“[^”\n]*”|«[^»\n]*»/g, '');
  return text.split(/(?<=[.!?;])\s+|\n+/).flatMap(chunk => chunk.split(/,\s*(?=(?:can you|could you|please|how|what|i\b|i['’]m|my\b|je\b|j['’]|ndi\b|niga\b|nkunda\b|nitwa\b))|\s+(?:and|kandi|et|but|ariko|mais)\s+(?=(?:i\b|i['’]m|my\b|ndi\b|niga\b|nkunda\b|nitwa\b|ndimo\b|je\b))/i))
    .map(chunk => chunk.trim().replace(/^(?:hello|hi|muraho|bonjour)[!,]\s*/i, '')
      .replace(/^(?:(?:actually|correction|to clarify|no|now|en fait|maintenant|ahubwo|ubu|mu by'ukuri|mubyukuri)[,:]?\s+)+/i, ''))
    .filter(sentence => sentence && sentence.length <= 240 && !sentence.endsWith('?') && !questionStart.test(sentence)
      && !temporary.test(sentence) && !uncertain.test(sentence));
}

function responsePreference(sentence) {
  return preferenceStart.test(sentence)
    && /\b(?:answers|responses|explanations|examples|explain|ibisubizo|ibisobanuro|ingero|r[eé]ponses|explications|exemples)\b/i.test(sentence)
    && /\b(?:short|brief|concise|detailed|simple|plain|examples|step.by.step|bigufi|birambuye|byoroshye|ingero|courtes|courts|simples|exemples)\b|d[eé]taill[eé]/i.test(sentence);
}

function classify(sentence) {
  if (/^(?:i (?:don't|do not) (?:like|want)|please (?:don't|do not)|don't)\b/i.test(sentence)
      && /\b(?:long|complicated|technical) (?:answers|responses|explanations)\b/i.test(sentence)) return 'response_style';
  if (negation.test(sentence)) return null;
  // Only a short general place name is accepted, not a street address or narrative.
  if (/^(?:i live in|i(?: am|['’]m) based in|ntuye|mba|j['’]habite [aà]|je vis [aà]|je vis en)\s+[\p{L}][\p{L}\p{M} ’'.,-]{1,65}[.!]?$/iu.test(sentence)) return 'location';
  if (preferenceStart.test(sentence) && supportedLanguage.test(sentence)
      && /\b(?:answers|responses|reply|replies|explanations|speak|language|ibisubizo|subiza|unsubiza|vuga|ururimi|r[eé]ponses|r[eé]ponds|langue)\b/i.test(sentence)
      && !/\b(?:french|english) (?:law|history|culture|literature)\b/i.test(sentence)
      && !/\b(?:this answer|this time|for now|iki gisubizo|cette r[eé]ponse)\b/i.test(sentence)) return 'language';
  if (/^(?:i prefer|je pr[eé]f[eè]re)\s+(?:english|french|kinyarwanda|ikinyarwanda|anglais|fran[cç]ais)[.!]?$/i.test(sentence)) return 'language';
  if (/^(?:i (?:speak|understand)|mvuga|numva|je parle|je comprends)\s+/i.test(sentence) && supportedLanguage.test(sentence)
      && !/\b(?:french|english) (?:law|history|culture|literature)\b/i.test(sentence)) return 'language_ability';
  if (education.test(sentence)) return 'education';
  if (occupation.test(sentence)) return 'occupation';
  if (project.test(sentence)) return 'project';
  if (goal.test(sentence)) return 'goal';
  if (/^(?:i (?:know|use|code in|program in)|i(?: am|['’]m) (?:learning|experienced in|skilled in)|my (?:tech stack|skills) (?:are|is|include)|nzi|je (?:connais|programme en|sais utiliser))\s+/i.test(sentence)
      && /\b(?:javascript|typescript|python|java|react|node(?:\.js)?|express|firebase|supabase|sql|html|css|programming|coding|web development|translation|design|accounting)\b/i.test(sentence)) return 'skills';
  if (/^(?:i(?: am|['’]m) interested in|my interests (?:are|include)|i enjoy|i like learning about|nkunda kwiga|nshishikajwe|je m['’]int[eé]resse [aà]|mes int[eé]r[eê]ts)\s+/i.test(sentence)) return 'interests';
  if (/^(?:my (?:project |app |hosting |software )?budget (?:is|for)|i (?:need|want|can only use|only use)|my (?:project|app|website) (?:needs|requires|must)|my (?:computer|laptop) (?:has|runs)|ndashaka|umushinga wanjye|mon budget|mon projet|mon ordinateur)\b/i.test(sentence)
      && /\b(?:free|zero (?:cost|payment)|no payments?|no paid|offline|public (?:website|beta)|windows|linux|macos|ram|nta kwishyura)\b/i.test(sentence)) {
    if (/\b(?:budget|free|zero (?:cost|payment)|no payments?|no paid|nta kwishyura)\b/i.test(sentence)) return 'budget';
    if (/\b(?:computer|laptop|windows|linux|macos|ram|ordinateur)\b/i.test(sentence)) return 'hardware';
    if (/\bpublic (?:website|beta)\b/i.test(sentence)) return 'deployment';
    return 'constraints';
  }
  if (responsePreference(sentence)) return 'response_style';
  return null;
}

export function extractImportantFacts(message) {
  if (typeof message !== 'string' || privateOrCase.test(message) || thirdParty.test(message)) return [];
  const facts = [];
  for (const sentence of memoryStatements(message)) {
    if (privateOrCase.test(sentence) || thirdParty.test(sentence)) continue;
    // Separate a supported compound preference so forgetting a language cannot leave it in a style note.
    const combined = sentence.match(/^(i (?:prefer|like|want|need))\s+((?:short|brief|concise|detailed|simple|plain|step-by-step)\s+(?:answers|responses|explanations))\s+in\s+(English|French|Kinyarwanda|Ikinyarwanda)[.!]*$/i);
    if (combined) {
      facts.push({ category: 'language', value: `${combined[1]} ${combined[2].replace(/^\S+\s+/, '')} in ${combined[3]}.`, statement: sentence });
      facts.push({ category: 'response_style', value: `${combined[1]} ${combined[2]}.`, statement: sentence });
      continue;
    }
    const category = classify(sentence);
    if (category) facts.push({ category, value: sentence });
  }
  return facts;
}

// A retraction removes matching old information only; "not a teacher" cannot remove "lawyer".
export function extractMemoryRetractions(message) {
  const changes = [];
  for (const sentence of memoryStatements(message)) {
    if (privateOrCase.test(sentence) || thirdParty.test(sentence)) continue;
    const match = sentence.match(/^i (?:no longer|don't|do not) (work as|study|live in|use)\s+(.+?)[.!]*$/i);
    const roleMatch = sentence.match(/^i(?: am|['’]m) (?:no longer|not)\s+(?:a |an )?(.+?)(?: anymore)?[.!]*$/i);
    if (match) {
      const category = ({ 'work as': 'occupation', study: 'education', 'live in': 'location', use: 'skills' })[match[1].toLowerCase()];
      changes.push({ category, value: match[2].replace(/[.!]+$/, '').trim(), statement: sentence });
    } else if (roleMatch && occupation.test('I am a ' + roleMatch[1])) {
      changes.push({ category: 'occupation', value: roleMatch[1].replace(/[.!]+$/, '').trim(), statement: sentence });
    }
    const other = sentence.match(/^(siniga|sinkiba i|sinkituye i|sindi|je ne travaille plus comme|je ne travaille pas comme|je n['’][eé]tudie plus|je n['’]habite plus [aà])\s+(.+?)[.!]*$/i);
    if (other) {
      const prefix = other[1].toLowerCase();
      const value = other[2].replace(/[.!]+$/, '').trim();
      const category = /siniga|[eé]tudie/.test(prefix) ? 'education' : /sinkiba|sinkituye|habite/.test(prefix) ? 'location' : 'occupation';
      changes.push({ category, value, statement: sentence });
    }
  }
  return changes;
}

export function forgottenCategory(message) {
  const text = message.trim().replace(/[.!?]+$/, '');
  const match = text.match(/^(?:forget (?:my |the )?|ibagirwa |oublie (?:mon |ma |mes )?)(job|work|profession|occupation|study|studies|education|project|goal|preferences|response preference|language|location|city|skills|interests|constraints|budget|akazi|amasomo|umushinga|intego|ururimi|aho ntuye|ubumenyi|langue|ville|comp[eé]tences|[eé]tudes|projet|objectif|int[eé]r[eê]ts|contraintes)$/i);
  if (!match) return null;
  const word = match[1].toLowerCase();
  if (/^(?:job|work|profession|occupation|akazi)$/.test(word)) return 'occupation';
  if (/^(?:study|studies|education|amasomo|[eé]tudes)$/.test(word)) return 'education';
  if (/^(?:project|umushinga|projet)$/.test(word)) return 'project';
  if (/^(?:goal|intego|objectif)$/.test(word)) return 'goal';
  if (/^(?:language|ururimi|langue)$/.test(word)) return 'language';
  if (/^(?:location|city|aho ntuye|ville)$/.test(word)) return 'location';
  if (/^(?:skills|ubumenyi|comp[eé]tences)$/.test(word)) return 'skills';
  if (/^(?:interests|int[eé]r[eê]ts)$/.test(word)) return 'interests';
  if (word === 'budget') return 'budget';
  if (/^(?:constraints|contraintes)$/.test(word)) return 'constraints';
  return 'response_style';
}
