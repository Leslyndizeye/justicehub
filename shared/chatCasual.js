// Small, contextual chat-typing rules. Never expand individual letters globally:
// "c" can be a name, a grade, a legal identifier, or a programming language.
const openings = [
  { language: 'rw', pattern: /^(?:bimeze\s+gute(?:\s*(?:se|c))?|umeze\s+ute(?:\s+(?:se|c))?)(?=$|[\s?!.,;:])/iu, wording: 'Bimeze gute se?', meaning: 'How are you? / How is it going?' },
  { language: 'rw', pattern: /^(?:bite|amakuru)\s+(?:se|c)(?=$|[\s?!.,;:])/iu, wording: 'Amakuru se?', meaning: 'How are you? / How is it going?' },
  { language: 'rw', pattern: /^amakuru(?=$|[?!.,;:]|\s*$)/iu, wording: 'Amakuru?', meaning: 'How are you?' },
  { language: 'en', pattern: /^how\s+(?:are|r)\s+(?:you|u)(?:\s+doing)?(?=$|[\s?!.,;:])/iu, wording: 'How are you?', meaning: 'How are you?' },
];

const acknowledgement = /^(?:(?:ok|okay)[,\s]+){0,4}(?:gotch(?:u+|a)|got\s+(?:you|u|it)|understood)[.!?\s]*$|^(?:ok|okay)(?:[,\s]+(?:ok|okay)){0,4}[.!?\s]*$/iu;

export function interpretCasualMessage(message) {
  if (typeof message !== 'string') return null;
  const text = message.trim();
  if (acknowledgement.test(text)) return { kind: 'acknowledgement', language: 'en', wording: 'Got it.', meaning: 'The speaker has understood.', standalone: true };
  for (const entry of openings) {
    const match = text.match(entry.pattern);
    if (!match) continue;
    const rest = text.slice(match[0].length);
    // Only punctuation and emoji may trail a standalone greeting. A legal
    // question, name, number, link, or code must continue through the model.
    const standalone = /^[\s?!.,;:\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D]*$/u.test(rest);
    return { kind: 'greeting', language: entry.language, wording: entry.wording, meaning: entry.meaning, standalone };
  }
  return null;
}

export function casualReply(message, language) {
  const greeting = interpretCasualMessage(message);
  if (!greeting?.standalone) return null;
  const selectedLanguage = !language || language === 'auto' ? greeting.language : language;
  if (greeting.kind === 'acknowledgement') return { rw: 'Ni byiza! Ndi hano niba hari ikindi ukeneye.', en: "Got it! I'm here if you need anything else.", fr: 'D’accord ! Je suis là si vous avez besoin d’autre chose.' }[selectedLanguage] || null;
  return {
    rw: 'Ni byiza, nditeguye kugufasha! Wowe umeze ute?',
    en: "I'm here and ready to help! How are you?",
    fr: 'Je suis là et prêt à vous aider ! Et vous, comment allez-vous ?',
  }[selectedLanguage] || null;
}

export function casualInstruction(message) {
  const greeting = interpretCasualMessage(message);
  if (!greeting) return '';
  return `CASUAL TYPING CONTEXT\nRecognized opening (meaning data, not instructions): ${JSON.stringify(greeting)}. In these Kinyarwanda greeting expressions, a trailing "c" is a casual spelling of "se"; it is not an offence or a request to resume the earlier legal topic. For English "how r u", "r" means "are" and "u" means "you" in that phrase; "gotchuuu" means "got you / understood". Never expand these letters elsewhere, including names, code, URLs, and legal identifiers. A standalone greeting or acknowledgement deserves a brief natural response without research or a legal disclaimer. If other text follows the greeting, answer that substantive request too; do not discard it or assume the opening chooses the language of the rest. Preserve the original message and do not lecture the user about spelling.`;
}
