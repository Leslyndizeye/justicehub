import { franc } from 'franc-min';
import { interpretCasualMessage } from '../shared/chatCasual.js';

export const replyLanguages = ['auto', 'rw', 'en', 'fr'];
const codes = { kin: 'rw', eng: 'en', fra: 'fr' };
const shortWords = new Map([
  ['muraho', 'rw'], ['murakoze', 'rw'], ['urakoze', 'rw'], ['amakuru', 'rw'], ['yego', 'rw'], ['oya', 'rw'], ['mwiriwe', 'rw'], ['sibyo', 'rw'], ['si byo', 'rw'], ['wibeshye', 'rw'], ['ntiwanyumvise', 'rw'],
  ['hello', 'en'], ['hi', 'en'], ['thanks', 'en'], ['yes', 'en'], ['no', 'en'],
  ['bonjour', 'fr'], ['merci', 'fr'], ['oui', 'fr'], ['non', 'fr'],
]);

function detect(text) {
  const casual = interpretCasualMessage(text);
  // A bare "ok" is ambiguous and should keep the previous user's language.
  if (casual?.standalone && !/^(?:ok|okay)(?:[,\s]+(?:ok|okay)){0,4}[.!?\s]*$/i.test(text.trim())) return casual.language;
  const cleaned = text.replace(/```[\s\S]*?```|https?:\/\/\S+/g, '').trim();
  const word = cleaned.toLowerCase().replace(/[.!?,;:]+$/g, '');
  if (shortWords.has(word)) return shortWords.get(word);
  // An English explanation may quote the Kinyarwanda expression it defines.
  // That quoted expression must not make an English draft pass the rw check.
  const englishProse = cleaned.match(/\b(?:the|this|that|means|refers|which|without|should|person|legal|while|criminal|consent|expression)\b/gi) || [];
  if (cleaned.length >= 80 && englishProse.length >= 4 && franc(cleaned, { minLength: 20 }) === 'eng') return 'en';
  // Trigram detection is unreliable on tiny samples with shared legal vocabulary.
  // Clear English question/first-person openings help avoid classifying "My client needs..." as French.
  if (cleaned.length < 80 && /^(?:i(?:['’]m)?|my|what|how|why|which|please|do (?:you|u)|can (?:you|u)|could you|tell me|explain)\b/i.test(cleaned)) return 'en';
  // Short everyday questions often contain too few characters for trigram detection.
  // English questions quoting these words keep their own language.
  if (/^(?:ese|none se|nonese|ndabaza|nshaka|ndashaka|mbwira|nsobanurira|nitwa)\b/i.test(cleaned)
      || /\b(?:izina (?:ryanjye|ryange|ryarye|ryajye)|witwa|wowe|urabizi|uranyibuka|unyibuka|ibuka ko|ahanishw\w*|bamuhanis\w*|gutubura|natubuwe|ubutekamutwe|ubwambuzi bushukana|gufata\s*ku\s*ngufu|gufatwa\s*ku\s*ngufu|gusambanya|urukozasoni|ni iki|bivuga iki|amategeko|icyaha)\b/i.test(cleaned)) return 'rw';
  return codes[franc(cleaned, { minLength: 20 })] || 'auto';
}

export function resolveReplyLanguage(message, history = [], preference = 'auto') {
  if (replyLanguages.includes(preference) && preference !== 'auto') return preference;
  const shortRequest = message.trim().match(/^(?:(?:in|en)\s+)?(english|french|français|kinyarwanda|ikinyarwanda)(?:\s+(?:please|pls))?[.!?\s]*$/i)
    || message.trim().match(/^(?:mu|muri)\s+(cyongereza|gifaransa|i?kinyarwanda)[.!?\s]*$/i);
  if (shortRequest) return { english: 'en', french: 'fr', français: 'fr', cyongereza: 'en', gifaransa: 'fr', kinyarwanda: 'rw', ikinyarwanda: 'rw' }[shortRequest[1].toLowerCase()];
  const explicit = message.match(/\b(?:answer|reply|respond|explain|write|translate|meaning|is what)\b.{0,25}\b(?:in|using)\s+(kinyarwanda|ikinyarwanda|english|french)\b/i)
    || message.match(/\bin\s+(english|french|kinyarwanda|ikinyarwanda)\s+(?:is\s+what|please|pls|bisobanura\s+iki)\b/i)
    || message.match(/\bin\s+(english|french|kinyarwanda|ikinyarwanda)[?!\s]*$/i);
  if (explicit) return { kinyarwanda: 'rw', ikinyarwanda: 'rw', english: 'en', french: 'fr' }[explicit[1].toLowerCase()];
  if (/\b(?:subiza|nsobanurira|sobanura)\b.{0,20}\b(?:mu|muri)\s+(?:i?kinyarwanda)\b/i.test(message)) return 'rw';
  const current = detect(message);
  if (current !== 'auto') return current;
  // Short follow-ups inherit a user's language; an earlier English AI reply must not override it.
  if (message.replace(/[^\p{L}]/gu, '').length < 20) {
    for (const item of [...history].reverse()) {
      if (item.sender !== 'user' || typeof item.content !== 'string') continue;
      const previous = detect(item.content);
      if (previous !== 'auto') return previous;
    }
  }
  return 'auto';
}

export function languageInstruction(language) {
  const common = 'Match the language of the latest user message unless they explicitly request another language or the reply-language setting selects one. Earlier English replies and English search results do not select the answer language. Translate explanations, not the user’s question into an English answer. Preserve meaning, negation, names, source URLs, amounts, dates, and article numbers; do not add or omit legal conditions. A request to translate quoted text may use its explicitly requested target language.';
  const selected = { rw: 'REQUIRED ANSWER LANGUAGE: Ikinyarwanda (Kinyarwanda, rw). Write the entire explanation and any clarifying question in clear, natural Ikinyarwanda. Do not switch to English because sources are English.', en: 'REQUIRED ANSWER LANGUAGE: English.', fr: 'REQUIRED ANSWER LANGUAGE: French. Réponds en français.' }[language] || 'Detect and answer in the user’s language. Use English only when no language can reasonably be identified.';
  return `${selected}\n${common}\nKinyarwanda everyday meaning: "uzi izina ryanjye?" (also misspelled "uzi izina ryarye?") asks "do you know MY name?", not a child's name or private information about strangers. "nitwa" introduces the speaker's name; "unyibuka/uranyibuka" asks if you remember them; "ibuka" means remember; "mu kindi kiganiro/muyindi chat" means another conversation. If no personal context is supplied, do not invent a name.\nKinyarwanda legal meaning: kwiba/wibye concerns stealing/theft, not breaking the law in general; icyaha means an offence; igihano means a penalty; igifungo means imprisonment; uburenganzira means rights. "umuntu wibye bamuhanisha icyi mu Rwanda" asks about the punishment for theft in Rwanda. Keep that topic and verify any exact penalty rather than replacing it with a generic arrest-and-bail overview.`;
}

export function languageCopy(language) {
  if (language === 'rw') return {
    timeoutError: 'Serivisi ya AI yatinze gusubiza. Ongera ugerageze nyuma gato.',
    connectionError: 'Ntibyashobotse kugera kuri serivisi ya AI. Ongera ugerageze nyuma gato.',
    searchFallback: 'Tavily ntibyashobotse. Ndagerageza gushakisha nkoresheje Groq…',
    searchFallbackUsed: 'Nabonye amasoko nkoresheje ishakisha rya Groq.',
    vocabularyRecovery: 'Ndakosora inyito y’ijambo nkoresheje ibisobanuro byasuzumwe…',
    search: 'Ndashakisha amakuru kuri internet…', fallback: 'Modeli isanzwe irahuze. Ndagerageza indi…', translating: 'Ndimo guhindura igisubizo mu Kinyarwanda…',
    lookupRecovery: 'Gushakisha amakuru ntibyashoboye kurangira. Ndakomeza n’ibisobanuro rusange…',
    lookupNotice: 'Sinashoboye kugenzura amakuru ku mbuga zemewe. Ibisobanuro bikurikira ni rusange; amategeko n’inzira zihariye zikoreshwa bigomba kubanza kugenzurwa.\n\n',
    lawfulAlternative: 'Nshobora kugufasha gutunganya amakuru y’ukuri, gusobanukirwa uburenganzira bwawe, cyangwa gushaka inzira zemewe n’amategeko zo gukemura ikibazo.',
    pages: 'Imbuga zasuzumwe', genericError: 'Igisubizo nticyashoboye kurangira. Ongera ugerageze nyuma gato.',
    searchError: 'Gushakisha amakuru kuri internet ntibyashobotse. Gerageza kubaza ikibazo gisobanutse kurushaho.',
    rateLimit: seconds => `Serivisi ya AI yageze ku rugero ntarengwa rwo kuyikoresha. Tegereza nibura ${seconds < 60 ? `amasegonda ${seconds}` : `iminota ${Math.ceil(seconds / 60)}`} mbere yo kongera kugerageza.`,
  };
  if (language === 'fr') return {
    timeoutError: 'Le service d’IA a mis trop de temps à répondre. Réessayez dans un moment.',
    connectionError: 'Impossible de joindre le service d’IA. Réessayez dans un moment.',
    searchFallback: 'Tavily est indisponible. Essai de la recherche Groq…',
    searchFallbackUsed: 'Sources trouvées avec la recherche Groq.',
    vocabularyRecovery: 'Je corrige le sens du terme à partir des références vérifiées…',
    search: 'Recherche sur le web…', fallback: 'Le modèle principal est occupé. Essai avec un autre modèle…', translating: 'Traduction de la réponse en français…',
    lookupRecovery: 'La recherche n’a pas abouti. Je poursuis avec des informations générales…',
    lookupNotice: 'Je n’ai pas pu vérifier les sources en ligne. Les informations ci-dessous sont générales ; toute option juridique précise reste à vérifier.\n\n',
    lawfulAlternative: 'Je peux vous aider à organiser les faits véridiques, comprendre vos droits ou rechercher des solutions légales.',
    pages: 'Pages consultées', genericError: 'La réponse n’a pas pu être terminée. Veuillez réessayer dans un moment.',
    searchError: 'La recherche en ligne n’a pas abouti. Essayez une question plus précise.',
    rateLimit: seconds => `Le service d’IA a atteint sa limite d’utilisation. Attendez au moins ${seconds < 60 ? `${seconds} secondes` : `${Math.ceil(seconds / 60)} minutes`} avant de réessayer.`,
  };
  return {
    timeoutError: 'The AI service took too long to respond. Please try again shortly.',
    connectionError: 'Could not connect to the AI service. Please try again shortly.',
    searchFallback: 'Tavily is unavailable. Trying Groq search…',
    searchFallbackUsed: 'Sources found using Groq search.',
    vocabularyRecovery: 'Correcting the term’s meaning using reviewed references…',
    search: 'Searching the web…', fallback: 'The main model is busy. Trying another model…', translating: 'Translating the reply…',
    lookupRecovery: 'The source lookup could not be completed. Continuing with general guidance…',
    lookupNotice: 'I couldn’t complete a live source lookup, so the guidance below is general and any specific legal option still needs verification.\n\n',
    lawfulAlternative: 'I can help you organise the true facts, understand legal rights, or research lawful ways to resolve the situation.',
    pages: 'Pages checked', genericError: 'The reply could not be completed. Please try again shortly.',
    searchError: 'The web search could not be completed. Please try a more specific question.',
    rateLimit: seconds => `The AI service has reached its usage limit. Please wait at least ${seconds < 60 ? `${seconds} seconds` : `${Math.ceil(seconds / 60)} minutes`} before trying again.`,
  };
}
