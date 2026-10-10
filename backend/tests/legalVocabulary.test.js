import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpretLegalQuestion } from '../legalQuestion.js';
import { matchedLegalVocabulary, legalVocabularyInstruction, canonicalLegalQuestion } from '../legalVocabulary.js';
import { buildChatMessages } from '../chatPrompt.js';
import { resolveReplyLanguage } from '../chatLanguage.js';
import { searchLegalDocs } from '../legalRetrieval.js';

test('the exact gutubura question retrieves fraud and tells the model not to confuse it with assault', () => {
  const message = 'okay ngaho mbwira niki amategeko yo mu rwanda avuga kucyaha cyo gutubura';
  const interpretation = interpretLegalQuestion(message);
  assert.equal(interpretation.topic, 'fraud');
  assert.match(interpretation.retrievalQuery, /fraud/);
  assert.doesNotMatch(interpretation.retrievalQuery, /assault/);
  const instruction = buildChatMessages({ message, replyLanguage: 'rw' })[0].content;
  assert.match(instruction, /gutubura means scamming/);
  assert.match(instruction, /not.*assault/);
  assert.match(instruction, /Do not invent a sentence range/);
  assert.match(instruction, /observed local usage/);
  assert.match(instruction, /Article 174.*fraud/);
  assert.match(instruction, /2–3 years.*AND.*3,000,000–5,000,000/);
  const lastMessage = buildChatMessages({ message, replyLanguage: 'rw' }).at(-1).content;
  assert(lastMessage.includes(message));
  assert.match(lastMessage, /gukora ubutekamutwe \(scamming\)/);
  assert.match(lastMessage, /Topic translation: fraud/);
  assert.equal(resolveReplyLanguage(message), 'rw');
});

test('researched local terms include canonical translations with context gates', () => {
  for (const [question, topic, translation] of [
    ['natubuwe amafaranga', 'fraud', 'I was scammed'],
    ['amategeko ku gutekera umutwe', 'fraud', 'swindling'],
    ['magendu ihanishwa iki?', 'smuggling', 'smuggling'],
    ['kwinjiza ibintu mu nzira za panya', 'smuggling', 'unofficial border routes'],
    ['abanyamakuru basaba GITI', 'bribery', 'payment influencing reporting'],
    ['Kanyanga ni iki?', 'drugs', 'crude illicit gin'],
  ]) {
    assert.equal(interpretLegalQuestion(question).topic, topic, question);
    assert(canonicalLegalQuestion(question).includes(question), 'Keep the original wording');
    assert(canonicalLegalQuestion(question).includes(translation), question);
  }
  for (const question of ['gutubura imbuto', 'gutubura umusaruro', 'Giti ni umurenge', 'umunyamakuru ari ku giti cye', 'a journalist photographed a tree called giti', 'panya ni imbeba']) {
    assert.equal(canonicalLegalQuestion(question), question);
  }
});

test('normalizing slang preserves source URLs and code rather than rewriting their contents', () => {
  const question = 'gutubura: https://example.test/gutubura `gutubura` 2026';
  const normalized = canonicalLegalQuestion(question);
  assert.match(normalized, /Research wording.*gukora ubutekamutwe/);
  assert(normalized.includes('https://example.test/gutubura `gutubura` 2026'));
  assert.equal(canonicalLegalQuestion('Read https://example.test/gutubura'), 'Read https://example.test/gutubura');
  assert.equal(canonicalLegalQuestion('```\ngutubura\n```'), '```\ngutubura\n```');
});

test('matches related formal terms and common inflections to distinct topics', () => {
  for (const [phrase, topic] of [
    ['natubuwe amafaranga', 'fraud'], ['umuntu wantuburiye', 'fraud'], ['ubutekamutwe', 'fraud'], ['guteka umutwe', 'fraud'],
    ['ubwambuzi bushukana', 'fraud'], ['uburiganya', 'fraud'], ['scamming', 'fraud'],
    ['gukubita no gukomeretsa', 'assault'], ['ruswa', 'bribery'], ['inyandiko mpimbano', 'forgery'],
    ['icuruzwa ry’abantu', 'trafficking'], ['ibiyobyabwenge', 'drugs'], ['ubwicanyi', 'murder'], ['ubujura', 'theft'],
  ]) assert.equal(interpretLegalQuestion(phrase).topic, topic, phrase);
});

test('the agricultural sense of gutubura is not rewritten as a fraud charge', () => {
  for (const phrase of ['gutubura imbuto', 'uruhushya rwo gutubura ingemwe', 'gutubura seeds']) {
    assert.equal(matchedLegalVocabulary(phrase).length, 0);
    assert.equal(interpretLegalQuestion(phrase).topic, null);
  }
  assert.equal(interpretLegalQuestion('uburiganya mu bucuruzi bw’imbuto').topic, 'fraud');
  assert.equal(resolveReplyLanguage('What does gutubura mean?'), 'en');
});

test('short follow-ups inherit the latest user topic without trusting an assistant mistranslation', () => {
  const history = [
    { sender: 'user', content: 'umuntu wibye ahanishwa iki?' },
    { sender: 'user', content: 'None se gutubura?' },
    { sender: 'ai', content: 'Gutubura means assault.' },
  ];
  assert.equal(interpretLegalQuestion('ahanishwa iki?', history).topic, 'fraud');
  assert.match(legalVocabularyInstruction('ahanishwa iki?', history), /gutubura means scamming/);
  assert.equal(interpretLegalQuestion('ahanishwa iki?', [{ sender: 'ai', content: 'gutubura' }]).topic, null);
});

test('mixed allegations remain distinct and do not trigger the narrow theft penalty answer', () => {
  const result = interpretLegalQuestion('kwiba no gutubura ahanishwa iki?');
  assert.equal(result.topic, null);
  assert.deepEqual(new Set(result.topics), new Set(['theft', 'fraud']));
  assert.equal(result.penaltyQuestion, false);
});

test('retrieval favors a fraud document over an unrelated passing mention', async () => {
  const fraud = { title: 'Fraud and Swindling', content: 'Relevant excerpt' };
  const unrelated = { title: 'Employment handbook', content: 'Mentions fraud' };
  const client = { from() { return { select() { return { textSearch(column, query) {
    assert.match(query, /fraud OR swindling/);
    return { limit: async count => { assert.equal(count, 16); return { data: [unrelated, fraud] }; } };
  } }; } }; } };
  assert.deepEqual(await searchLegalDocs(client, 'gutubura'), [fraud, unrelated]);
});

test('service and payment context identifies documented bribery euphemisms', () => {
  for (const question of [
    'Umuyobozi yansabye akantu kugira ngo mbonere serivisi.',
    'Umukozi ansaba amafaranga yo kwica akanyota mbere yo kumpa icyangombwa.',
    'Gitifu yansabye amafaranga yo gukanda amaguru.',
    'Umukozi ansaba umuti w’ikaramu ngo ampe icyangombwa.',
    'Umuyobozi ansaba inyoroshyo kugira ngo ampe serivisi.',
    'Umuyobozi ansaba kurya akantu mbere yo kumpa icyangombwa.',
    'Muri Girinka bansabye amafaranga y’ikiziriko kugira ngo mbone inka.',
  ]) {
    assert.equal(interpretLegalQuestion(question).topic, 'bribery', question);
    assert.match(canonicalLegalQuestion(question), /possible.*bribe|alleged unofficial Girinka payment/i);
    assert(canonicalLegalQuestion(question).includes(question));
  }
  assert.match(legalVocabularyInstruction('Muri Girinka bansabye amafaranga y’ikiziriko'), /preserve that these are allegations/);
});

test('ordinary objects, thirst, massage, ropes, and names do not become crime topics', () => {
  for (const question of [
    'Mfite akantu mu mufuka.', 'Umuyobozi afite akantu.',
    'Kwica akanyota nyuma yo kwiruka.', 'Umukozi anywa amazi yo kwica akanyota afite inyota.',
    'Gukanda amaguru ni masaje.', 'Umukozi yasabye wino: umuti w’ikaramu.',
    'Naguze umugozi w’ikiziriko cy’inka.', 'Muri Girinka naguze umugozi w’ikiziriko.',
    'Gucucura icupa.', 'Professor Mugo researches drug policy.',
    'Yitwa Mugo kandi ni umukozi.',
  ]) {
    assert.equal(interpretLegalQuestion(question).topic, null, question);
    assert.equal(canonicalLegalQuestion(question), question);
  }
  // A separate genuine homicide reference is preserved beside the thirst idiom.
  assert.equal(interpretLegalQuestion('Kwica akanyota si kwica umuntu.').topic, 'murder');
});

test('context checks apply per occurrence and preserve URLs, inline code, and literal uses', () => {
  const question = 'Umuyobozi yansabye akantu kugira ngo ampe serivisi. '
    + 'https://example.test/akantu `akantu` ' + 'Andi magambo. '.repeat(40) + 'Mfite akantu mu mufuka.';
  const normalized = canonicalLegalQuestion(question).split('Research wording with recognized slang explained: ')[1];
  assert.match(normalized, /possible bribe/);
  assert(normalized.includes('https://example.test/akantu `akantu`'));
  assert(normalized.includes('Mfite akantu mu mufuka.'));
  assert.equal(matchedLegalVocabulary('`gucucura` amafaranga').length, 0);
  assert.equal(matchedLegalVocabulary('`kwica` akanyota').length, 0);
  const remoteContext = 'Umuyobozi yansabye amafaranga. ' + 'Andi magambo. '.repeat(40) + 'Mfite akantu.';
  assert.equal(canonicalLegalQuestion(remoteContext), remoteContext);
});

test('broad property loss and street-vending labels do not select a theft sentence', () => {
  const question = 'Yancucuye amafaranga, ahanishwa iki?';
  const interpreted = interpretLegalQuestion(question);
  assert.equal(interpreted.topic, 'property_loss');
  assert.match(interpreted.retrievalQuery, /theft OR fraud/);
  assert.equal(interpreted.penaltyQuestion, false);
  assert.match(legalVocabularyInstruction(question), /method and facts determine/);
  assert.equal(interpretLegalQuestion('ahanishwa iki?', [{ sender: 'user', content: question }]).topic, 'property_loss');
  for (const phrase of ['abazunguzayi', 'umuzunguzayi ahanishwa iki?']) {
    assert.equal(interpretLegalQuestion(phrase).topic, 'street_vending');
    assert.equal(interpretLegalQuestion(phrase).penaltyQuestion, false);
    assert.match(canonicalLegalQuestion(phrase), /street vendors/);
  }
  assert.match(legalVocabularyInstruction('abazunguzayi'), /not a synonym for thieves/);
});

test('local substance names are translated distinctly without treating personal names as drugs', () => {
  for (const [question, translation] of [
    ['mayirungi ni iki?', 'khat / miraa'], ['Miraa ni iki?', 'khat / miraa'],
    ['ibiyobyabwenge bya mugo', 'mugo (heroin)'],
    ['muriture ni iki?', 'locally named brew'], ['bareteta ni iki?', 'locally named brew'],
    ['ibikwangari ni iki?', 'locally named brew'], ['igikwangari ni iki?', 'locally named brew'],
  ]) {
    assert.equal(interpretLegalQuestion(question).topic, 'drugs');
    assert(canonicalLegalQuestion(question).includes(translation));
    assert.equal(resolveReplyLanguage(question), 'rw');
  }
  assert.equal(resolveReplyLanguage('What does mayirungi mean?'), 'en');
  assert.equal(resolveReplyLanguage('Explain kwica akanyota in English'), 'en');
});

test('deeper vocabulary distinguishes snatching, identity, favouritism, and handling entrusted funds', () => {
  for (const [question, topic, gloss] of [
    ['Yanshikuje telefoni, ahanishwa iki?', 'property_snatching', 'snatching property'],
    ['Umuntu yiyitiriye umupolisi.', 'impersonation', 'false identity or role'],
    ['Yankangishije ngo muhe amafaranga.', 'threats', 'threats/intimidation'],
    ['Yanshyizeho iterabwoba ngo muhe amafaranga.', 'threats', 'distinguish terrorism'],
    ['Ikimenyane mu gutanga akazi', 'favouritism', 'preferential treatment'],
    ['Umuyobozi akora itonesha mu gutanga serivisi.', 'favouritism', 'preferential treatment'],
    ['Gukingira ikibaba abanyabyaha', 'justice_process', 'shielding alleged wrongdoing'],
    ['Umukozi yanyereje amafaranga ya rubanda.', 'embezzlement', 'entrusted funds'],
    ['Bansabye amafaranga y’akazi mu mushinga baringa.', 'fraud', 'fictitious/nonexistent'],
    ['Umuyobozi yansabye amafaranga ya bituga ukwaha.', 'bribery', 'unofficial service payment'],
    ['Umukozi ansaba ururimi rwa veterineri kugira ngo ampe serivisi.', 'bribery', 'unofficial service payment'],
  ]) {
    const interpretation = interpretLegalQuestion(question);
    assert.equal(interpretation.topic, topic, question);
    assert.equal(interpretation.penaltyQuestion, false, 'Do not reuse the narrow theft sentence');
    assert(canonicalLegalQuestion(question).includes(question));
    assert(canonicalLegalQuestion(question).includes(gloss), question);
  }
  assert.match(legalVocabularyInstruction('Gukingira ikibaba abanyabyaha'), /lawful defence/);
  assert.match(legalVocabularyInstruction('Ikimenyane mu gutanga akazi'), /not automatically a paid bribe/);
});

test('data and account complaints use cyber retrieval rather than a physical theft penalty', () => {
  for (const question of ['kwiba konti ahanishwa iki?', 'konti yanjye yibwe', 'kwinjirira konti yanjye', 'Amakuru yanjye yarinjiriwe kuri internet']) {
    const interpretation = interpretLegalQuestion(question);
    assert(interpretation.topics.some(topic => ['account_takeover', 'privacy_breach'].includes(topic)), question);
    assert.match(interpretation.retrievalQuery, /access|breach/i);
    assert.equal(interpretation.penaltyQuestion, false);
    assert.match(buildChatMessages({ message: question, replyLanguage: 'rw' })[0].content, /National|cyber\.gov\.rw/);
  }
  const wording = canonicalLegalQuestion('kwinjirira konti yanjye').split('Research wording with recognized slang explained: ')[1].split('\nTopic translation:')[0];
  assert.equal(wording, 'kwinjira muri konti utabyemerewe (account takeover / stolen credentials) yanjye');
  assert.match(legalVocabularyInstruction('kwiba konti'), /without requesting a password/);
  for (const phrase of ['Nakiriye imeli mpimbano kuri konti yanjye.', 'Nakiriye imeli z’uburiganya.', 'imeli zuburiganya']) {
    const phishing = interpretLegalQuestion(phrase);
    assert(phishing.topics.includes('phishing'), phrase);
    assert.equal(phishing.penaltyQuestion, false);
    assert.match(phishing.retrievalQuery, /phishing/);
  }
});

test('recent drink slang needs beverage context and preserves literal metal and equipment', () => {
  const question = 'Inzoga z’ibyuma zivugwaho iki?';
  assert.equal(interpretLegalQuestion(question).topic, 'drugs');
  assert.match(canonicalLegalQuestion(question), /substandard alcoholic drinks/);
  assert.match(legalVocabularyInstruction(question), /8 August 2026/);
  for (const question of ['ibyuma byo gusudira', 'Ibyuma by’inzugi n’amadirishya', 'Naguze ibyuma by’imodoka.', 'Nanyoye inzoga maze ngura ibyuma byo gusudira.']) {
    assert.equal(canonicalLegalQuestion(question), question);
    assert.equal(interpretLegalQuestion(question).topic, null);
  }
});

test('meaning-only questions explain ambiguity without choosing a legal offence or rewriting the user', () => {
  for (const question of ['akantu ni iki?', 'ibyuma bivuga iki?', 'kwica akanyota ni iki?', 'What does ikiziriko mean?', 'Mugo ni iki?', 'Amategeko avuga iki ku ikiziriko?']) {
    assert.equal(interpretLegalQuestion(question).topic, null, question);
    assert.equal(canonicalLegalQuestion(question), question);
    assert.match(buildChatMessages({ message: question })[0].content, /AMBIGUOUS WORD MEANING \(no offence selected\)/);
    assert.match(legalVocabularyInstruction(question), /both the ordinary and the documented contextual sense/);
  }
  assert.equal(legalVocabularyInstruction('What does `ibyuma` mean?'), '');
  assert.equal(legalVocabularyInstruction('Read https://example.test/ibyuma'), '');
});

test('ordinary representations, names, stories, and rooms remain outside the new legal aliases', () => {
  for (const question of [
    'Yiyitiriye umupolisi mu ikinamico.', 'Ikimenyane ni ubucuti bwacu.',
    'Kwinjirira inzu.', 'Yarinjiriwe icyumba.', 'Gukingira ikibaba cy’inyoni.',
    'Nkunze filimi ivuga ku mushinga baringa n’amafaranga.', 'Baringa is a place name in Congo.',
    'Gutera ubwoba muri filimi.', 'Ururimi rw’inka veterineri yarusuzumye.',
  ]) assert.equal(canonicalLegalQuestion(question), question);
  assert.equal(interpretLegalQuestion('kunyereza umusoro').topic, null);
});
