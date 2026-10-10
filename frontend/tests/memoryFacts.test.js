import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractImportantFacts } from '../lib/memoryFacts.js';
import { captureMemory, localMemoryReply, normalizeMemory, readLocalMemory, removeMemoryItem, writeLocalMemory } from '../lib/userMemory.js';

test('automatically keeps clear first-person facts and preferences without a remember command', () => {
  const memory = captureMemory(null, 'My name is Aline. I am a lawyer. I study constitutional law. I prefer short answers. I am building JusticeHub. My goal is to become a judge.');
  assert.equal(memory.items.length, 6);
  assert.deepEqual(memory.items.map(item => item.category), ['name', 'occupation', 'education', 'response_style', 'project', 'goal']);
  assert(memory.items.every(item => item.origin === 'automatic'));
  assert.match(localMemoryReply('What do you remember about me?', memory).reply, /lawyer|constitutional law|short answers|JusticeHub|judge/);
});

test('identifies Kinyarwanda and French background and response preferences', () => {
  assert.deepEqual(extractImportantFacts('Ndi umunyamategeko. Ndi umunyeshuri w’amategeko. Nkunda ibisubizo bigufi. Ndimo kubaka JusticeHub.').map(item => item.category), ['occupation', 'education', 'response_style', 'project']);
  assert.deepEqual(extractImportantFacts('Je suis avocate. J’étudie le droit. Je préfère des réponses courtes. Je développe JusticeHub.').map(item => item.category), ['occupation', 'education', 'response_style', 'project']);
  const memory = captureMemory(null, 'Niga amategeko. Nkunda ibisubizo bigufi. Ndimo kubaka JusticeHub.');
  for (const question of ['niga iki?', 'nkunda ibisubizo bimeze bite?', 'umushinga wanjye ni uwuhe?']) {
    const answer = localMemoryReply(question, memory);
    assert.equal(answer.language, 'rw');
    assert.match(answer.reply, /^Wambwiye ibi:/);
  }
  const french = captureMemory(null, 'Je suis avocate.');
  assert.equal(localMemoryReply('Quelle est ma profession?', french).language, 'fr');
});

test('important information survives a fresh chat, reload and account-specific storage', () => {
  const values = new Map();
  const disk = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  const memory = captureMemory(null, 'I study law. I am building JusticeHub.');
  assert(writeLocalMemory('alice', memory, disk));
  const reloaded = readLocalMemory('alice', disk);
  assert.match(localMemoryReply('What am I studying?', reloaded).reply, /I study law/);
  assert.match(localMemoryReply('What project am I working on?', reloaded).reply, /JusticeHub/);
  assert.doesNotMatch(localMemoryReply('What am I studying?', readLocalMemory('bob', disk)).reply, /I study law/);
});

test('new facts update a category without accumulating contradictory preferences', () => {
  let memory = captureMemory(null, 'I prefer short answers. I work as a teacher.');
  memory = captureMemory(memory, 'I prefer detailed explanations. I work as a lawyer.');
  assert.equal(memory.items.length, 2);
  assert.equal(memory.items.find(item => item.category === 'response_style').value, 'I prefer detailed explanations.');
  assert.equal(memory.items.find(item => item.category === 'occupation').value, 'I work as a lawyer.');
  const duplicate = captureMemory(memory, 'I prefer detailed explanations.');
  assert.deepEqual(duplicate, memory);
});

test('does not turn questions, hypothetical roles, temporary states, quoted code or private cases into identity', () => {
  for (const message of ['Am I a lawyer?', 'Imagine this. I am a lawyer.', 'For example, I study law.', 'My client is a teacher.', 'I work as a lawyer on my client’s court case.', 'I am a teacher today.', 'I am diagnosed with an illness.', 'I am a lawyer and my password is secret.', 'I am a student with national id 1234567890123456.', '```\nI am a lawyer.\n```', '"I am a lawyer."', 'I am not a lawyer.']) {
    assert.equal(extractImportantFacts(message).length, 0, message);
  }
});

test('handles a background statement before a question and preserves technical project names', () => {
  assert.equal(extractImportantFacts('I study law, can you explain theft?')[0].value, 'I study law');
  assert.equal(extractImportantFacts('I am building a Node.js 2.0 app.')[0].value, 'I am building a Node.js 2.0 app.');
  assert.deepEqual(extractImportantFacts('I study law and I prefer simple answers.').map(item => item.category), ['education', 'response_style']);
});

test('automatic-saving off still permits explicit remember requests and never claims an unsaved name was saved', () => {
  const memory = { ...normalizeMemory(null), autoSave: false };
  assert.deepEqual(captureMemory(memory, 'I am a lawyer. My name is Alice.'), memory);
  assert.equal(captureMemory(memory, 'Remember that I am a lawyer.').items[0].origin, 'manual');
  const named = captureMemory(memory, 'Remember that my name is Aline.');
  assert.equal(named.items[0].value, 'Aline');
  assert.match(localMemoryReply('My name is Aline.', memory, 'Different Account Name').reply, /wasn’t saved/);
});

test('forgotten categories do not reappear automatically, but an explicit request can restore them', () => {
  let memory = captureMemory(null, 'I study law. I work as a teacher.');
  const job = memory.items.find(item => item.category === 'occupation');
  memory = removeMemoryItem(memory, job.id);
  assert.equal(captureMemory(memory, 'I work as a teacher.').items.some(item => item.category === 'occupation'), false);
  memory = captureMemory(memory, 'Remember that I work as a lawyer.');
  assert.equal(memory.items.find(item => item.category === 'occupation').value, 'I work as a lawyer.');
  memory = captureMemory(memory, 'Forget my studies');
  assert.equal(captureMemory(memory, 'I study law.').items.some(item => item.category === 'education'), false);
  assert.match(localMemoryReply('Forget my studies', memory).reply, /Removed from saved memory/);
  const cleared = captureMemory(memory, 'Forget everything about me');
  assert.equal(cleared.items.length, 0);
  assert.equal(cleared.autoSave, false);
});

test('automatically identifies useful general location, language, technical skills and interests', () => {
  const memory = captureMemory(null, 'I live in Kigali. I prefer Kinyarwanda answers. I speak English and French. I code in TypeScript and Python. I am interested in constitutional law.');
  assert.deepEqual(memory.items.map(item => item.category), ['location', 'language', 'language_ability', 'skills', 'interests']);
  for (const [question, expected] of [
    ['Where do I live?', /Kigali/], ['What language do I prefer?', /Kinyarwanda/],
    ['What languages do I speak?', /English and French/], ['What are my skills?', /TypeScript and Python/],
    ['What am I interested in?', /constitutional law/], ['What did I tell you about my location?', /Kigali/],
  ]) assert.match(localMemoryReply(question, memory).reply, expected, question);
  assert.doesNotMatch(localMemoryReply('What language do I prefer?', memory).reply, /English/);
});

test('budget, computer and deployment requirements coexist and can be recalled together in a fresh chat', () => {
  const memory = normalizeMemory(captureMemory(null, 'I need only free tools. My laptop has 16 GB RAM. I want a public website.'));
  assert.deepEqual(memory.items.map(item => item.category), ['budget', 'hardware', 'deployment']);
  assert.match(localMemoryReply('What are my project constraints?', memory).reply, /free tools[\s\S]*16 GB RAM[\s\S]*public website/);
  assert.match(localMemoryReply('What is my budget?', memory).reply, /free tools/);
  assert.doesNotMatch(localMemoryReply('What is my budget?', memory).reply, /RAM/);
  assert.match(localMemoryReply('What computer do I use?', memory).reply, /16 GB RAM/);
});

test('supports Kinyarwanda and French statements and personal recalls for the new categories', () => {
  const memory = captureMemory(null, 'Ntuye i Kigali. Ujye unsubiza mu Kinyarwanda. Nzi Python. Nshishikajwe n’amategeko.');
  assert.deepEqual(memory.items.map(item => item.category), ['location', 'language', 'skills', 'interests']);
  for (const question of ['ntuye he?', 'ese nkunda ururimi uruhe?', 'nzi iki?']) {
    assert.equal(localMemoryReply(question, memory).language, 'rw');
    assert.match(localMemoryReply(question, memory).reply, /^Wambwiye ibi:/);
  }
  const french = captureMemory(null, 'J’habite à Kigali. Je préfère des réponses en français. Je connais Python.');
  assert.deepEqual(french.items.map(item => item.category), ['location', 'language', 'skills']);
  assert.equal(localMemoryReply('Où est-ce que j’habite?', french).language, 'fr');
  assert.match(localMemoryReply('Où est-ce que j’habite?', french).reply, /Kigali/);
});

test('corrections, introductions later in a message, and multiple clear facts are processed in order', () => {
  let memory = captureMemory(null, 'I study law. My name is Aline. I live in Kigali.');
  assert.equal(memory.items.find(item => item.kind === 'name').value, 'Aline');
  memory = captureMemory(memory, 'Actually, I live in Huye. Correction: my name is Aniela.');
  assert.equal(memory.items.find(item => item.category === 'location').value, 'I live in Huye.');
  assert.equal(memory.items.find(item => item.kind === 'name').value, 'Aniela');
  assert.equal(memory.items.filter(item => item.category === 'location').length, 1);
  assert.equal(memory.items.find(item => item.category === 'education').value, 'I study law.');
  assert.equal(captureMemory(null, 'Please call me Aline.').items[0].value, 'Aline');
});

test('retractions clear matching facts without corrupting another fact or person', () => {
  let memory = captureMemory(null, 'I work as a lawyer. I study law. I live in Kigali.');
  assert.deepEqual(captureMemory(memory, 'I am not a teacher.'), memory);
  memory = captureMemory(memory, 'I no longer study law. I no longer live in Kigali.');
  assert.deepEqual(memory.items.map(item => item.category), ['occupation']);
  memory = captureMemory(memory, 'I am no longer a lawyer.');
  assert.equal(memory.items.length, 0);
  assert.equal(captureMemory(null, 'I work as a teacher. I no longer work as a teacher.').items.length, 0);
  assert.equal(captureMemory(null, 'I no longer work as a teacher. I work as a lawyer.').items[0].value, 'I work as a lawyer.');
  assert.equal(captureMemory(null, 'I study law. Forget my studies.').items.length, 0);
  assert.equal(captureMemory(null, 'Nitwa Aline. Forget my name.').items.length, 0);
});

test('names and new background facts do not come from guesses, examples, secrets or temporary situations', () => {
  for (const text of [
    'Maybe I live in Kigali.', 'I live in Kigali today.', 'I live in Kigali?', 'Do you think I live in Kigali?',
    'I live at 12 Main Street.', 'I live in KG 123 Street.', 'I live in Kigali with my client.',
    'I am interested in my health diagnosis.', 'I am interested in religion.', 'I am interested in my client’s case.',
    'If I were a teacher. My name is Alice.', 'Imagine this. My name is Alice.',
    'My name is Alice today.', 'Maybe my name is Alice.', 'My name is Alice?',
    '> I study law.\n> My name is Alice.', '```\nMy name is Alice.\n```',
    'The assistant said I live in Kigali.', '"I live in Kigali."', 'I study law. Do not save this.',
    'I prefer answers about French law.', 'I understand English law.',
  ]) assert.equal(captureMemory(null, text).items.length, 0, text);
});

test('duplicates with different punctuation or capitalization do not replace existing memory IDs', () => {
  const memory = captureMemory(null, 'I study law. I live in Kigali.');
  assert.deepEqual(captureMemory(memory, 'i study law\nI live in Kigali'), memory);
});

test('group forget requests suppress every related automatic slot; explicit remembering can restore a chosen slot', () => {
  let memory = captureMemory(null, 'I need free tools. My laptop runs Windows. I want a public website. I speak English. I prefer French answers.');
  memory = captureMemory(memory, 'Forget my constraints');
  assert.deepEqual(memory.items.map(item => item.category), ['language_ability', 'language']);
  assert.deepEqual(captureMemory(memory, 'I need free tools. My laptop runs Windows.'), memory);
  memory = captureMemory(memory, 'Remember that I need free tools.');
  assert.equal(memory.items.find(item => item.category === 'budget').origin, 'manual');
  memory = captureMemory(memory, 'Forget my language');
  assert.equal(memory.items.some(item => item.category.startsWith('language')), false);
  assert.deepEqual(captureMemory(memory, 'I speak English. I prefer French answers.'), memory);
});

test('a negative response preference is stored as stated without reversing its meaning', () => {
  const memory = captureMemory(null, 'I do not like complicated explanations.');
  assert.equal(memory.items[0].category, 'response_style');
  assert.equal(memory.items[0].value, 'I do not like complicated explanations.');
  assert.match(localMemoryReply('What answers do I prefer?', memory).reply, /do not like/);
});

test('common Kinyarwanda and French retractions remove the corresponding earlier statement', () => {
  let memory = captureMemory(null, 'Ndi umunyamategeko. Niga amategeko. Ntuye i Kigali.');
  memory = captureMemory(memory, 'Sindi umunyamategeko. Siniga amategeko. Sinkituye i Kigali.');
  assert.equal(memory.items.length, 0);
  memory = captureMemory(null, 'Je travaille comme avocate. J’étudie le droit. J’habite à Kigali.');
  memory = captureMemory(memory, 'Je ne travaille plus comme avocate. Je n’étudie plus le droit. Je n’habite plus à Kigali.');
  assert.equal(memory.items.length, 0);
});

test('a combined style and language preference retains both facts when language later changes', () => {
  let memory = normalizeMemory(captureMemory(null, 'I prefer short answers in Kinyarwanda.'));
  assert.deepEqual(memory.items.map(item => item.category), ['language', 'response_style']);
  memory = captureMemory(memory, 'Actually, I prefer English answers.');
  assert.match(localMemoryReply('What language do I prefer?', memory).reply, /English/);
  assert.match(localMemoryReply('What answers do I prefer?', memory).reply, /short answers/);
  assert.equal(memory.items.length, 2);
  assert.deepEqual(captureMemory(memory, 'I prefer English answers.'), memory);
  const forgottenLanguage = captureMemory(memory, 'Forget my language');
  assert.doesNotMatch(localMemoryReply('What do you remember about me?', forgottenLanguage).reply, /English|Kinyarwanda/);
  assert.match(localMemoryReply('What do you remember about me?', forgottenLanguage).reply, /short answers/);
  const forgottenStyle = captureMemory(captureMemory(null, 'I prefer short answers in Kinyarwanda.'), 'Forget my response preference');
  assert.doesNotMatch(localMemoryReply('What do you remember about me?', forgottenStyle).reply, /short/);
  assert.match(localMemoryReply('What do you remember about me?', forgottenStyle).reply, /Kinyarwanda/);
});
