import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addMemoryNote, captureMemory, localMemoryReply, nameRecallRequest, normalizeMemory, readLocalMemory, recoverNameFromMessages, recoverPreviousChatName, removeMemoryItem, writeLocalMemory } from '../lib/userMemory.js';

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
}

test('two-name follow-ups compare saved and account names without legal advice or a memory change', () => {
  const memory = captureMemory(null, 'My name is aniela', () => 'name');
  const history = [{ sender: 'user', content: 'what is my name ?' }, { sender: 'ai', content: 'You told me your name is aniela.', memoryKind: 'name' }];
  for (const prompt of ['i think i got two names ?', 'Do I have two names?', 'Why are there two names?', 'What is my other name?']) {
    const reply = localMemoryReply(prompt, memory, 'byakwei aniela', true, history);
    assert.equal(reply.kind, 'name', prompt);
    assert.match(reply.reply, /name you told me: \*\*aniela\*\*/);
    assert.match(reply.reply, /account display name: \*\*byakwei aniela\*\*/);
    assert.match(reply.reply, /don’t know whether either is your full name/);
    assert.doesNotMatch(reply.reply, /national ID|passport|legal issues|birth certificate/);
    assert.deepEqual(captureMemory(memory, prompt), memory, prompt);
  }
  // A reloaded conversation does not carry the in-memory reply marker.
  assert.equal(localMemoryReply('i think i got two names ?', memory, 'byakwei aniela', true,
    history.map(({ memoryKind, ...message }) => message)).kind, 'name');
  const comparison = localMemoryReply('i think i got two names ?', memory, 'byakwei aniela', true, history);
  assert.equal(localMemoryReply('What is my full name?', memory, 'byakwei aniela', true,
    [...history, { sender: 'user', content: 'i think i got two names ?' }, { sender: 'ai', content: comparison.reply }]).kind, 'name');
});

test('name comparisons respect memory permissions and do not invent missing names', () => {
  const history = [{ sender: 'user', content: 'What is my name?' }];
  const memory = captureMemory(null, 'My name is Aniela');
  const prompt = 'I think I got two names?';
  const same = localMemoryReply(prompt, memory, 'ANIELA', true, history).reply;
  assert.doesNotMatch(same, /two different name entries/);
  const noProfile = localMemoryReply(prompt, { ...memory, useProfileName: false }, 'Hidden Account Name', true, history).reply;
  assert.match(noProfile, /Aniela/);
  assert.doesNotMatch(noProfile, /Hidden Account Name/);
  assert.match(noProfile, /don’t have a separate second name/);
  const disabled = localMemoryReply(prompt, { ...memory, enabled: false }, 'Hidden Account Name', true, history).reply;
  assert.doesNotMatch(disabled, /Aniela|Hidden Account Name/);
  assert.doesNotMatch(localMemoryReply(prompt, null, null, true, [
    ...history, { sender: 'ai', content: 'Your name is Invented Name.', memoryKind: 'name' },
  ]).reply, /Invented Name/);
});

test('personal name handling leaves explicit legal questions and other people to the model', () => {
  const history = [{ sender: 'user', content: 'What is my name?' }, { sender: 'ai', memoryKind: 'name' }];
  for (const prompt of ['Can I use two names on my passport?', 'Is having two names illegal?', 'My client has two names', 'My child has two names', 'I think I got two names, can I change my ID?']) {
    assert.equal(localMemoryReply(prompt, null, 'Account Name', true, history), null, prompt);
  }
  assert.equal(localMemoryReply('I think I got two names?', null, 'Account Name', true,
    [{ sender: 'user', content: 'What is the theft penalty?' }, { sender: 'ai', content: 'Here is the law.' }]), null);
});

test('name comparison follow-ups retain Kinyarwanda and French', () => {
  const memory = captureMemory(null, 'Nitwa Aniela');
  const history = [{ sender: 'user', content: 'uzi izina ryanjye?' }, { sender: 'ai', memoryKind: 'name' }];
  const rw = localMemoryReply('ese mfite amazina abiri?', memory, 'Account Name', true, history);
  assert.equal(rw.language, 'rw');
  assert.match(rw.reply, /Izina wambwiye: \*\*Aniela\*\*/);
  const fr = localMemoryReply('J’ai deux noms?', memory, 'Account Name', true, history);
  assert.equal(fr.language, 'fr');
  assert.match(fr.reply, /Le nom affiché sur votre compte/);
});

test('memory can be managed through chat after removing the settings panel', () => {
  let memory = captureMemory(null, 'My name is Alice', () => 'name');
  memory = captureMemory(memory, 'Disable memory');
  assert.equal(memory.enabled, false);
  assert.equal(memory.items[0].value, 'Alice');
  assert.deepEqual(captureMemory(memory, 'I study law'), memory);
  assert.equal(localMemoryReply('Disable memory', memory).kind, 'control');
  memory = captureMemory(memory, 'Enable memory');
  assert.equal(memory.enabled, true);
  assert.match(localMemoryReply('What do you remember about me?', memory).reply, /Alice/);
  memory = captureMemory(memory, 'Disable automatic memory');
  assert.equal(memory.autoSave, false);
  assert.deepEqual(captureMemory(memory, 'I study law'), memory);
  memory = captureMemory(memory, 'Remember that I prefer short answers', () => 'note');
  assert.equal(memory.items.length, 2);
  memory = captureMemory(memory, 'Forget everything about me');
  assert.equal(memory.items.length, 0);
  memory = captureMemory(memory, 'Enable automatic memory');
  assert.equal(memory.autoSave, true);
  assert.equal(memory.useProfileName, false);
  assert.equal(memory.recoverPreviousName, false);
  memory = captureMemory(memory, 'I study law', () => 'study');
  assert.equal(memory.items.length, 1);
  for (const prompt of ['Remember that I prefer short answers', 'Enable memory', 'How does memory work?']) {
    assert.doesNotMatch(localMemoryReply(prompt, memory).reply, /in Saved memory/);
  }
  assert.equal(captureMemory(memory, 'Zimya memory').enabled, false);
  assert.equal(localMemoryReply('Fungura memory', memory).language, 'rw');
  assert.equal(captureMemory(memory, 'Désactive la mémoire').enabled, false);
  assert.equal(localMemoryReply('Désactive la mémoire', memory).language, 'fr');
});

test('names survive a new chat and reload, are scoped to the account, and replace corrections', () => {
  const disk = storage();
  let memory = captureMemory(null, 'Nitwa Aniela Wanyawe.', () => 'name');
  assert.equal(writeLocalMemory('alice', memory, disk), true);
  memory = readLocalMemory('alice', disk);
  assert.match(localMemoryReply('uzi izina ryarye ?', memory, 'Different Account Name').reply, /Aniela Wanyawe/);
  assert.match(localMemoryReply('uzi izina ryanjye?', memory).reply, /Aniela Wanyawe/);
  assert.doesNotMatch(localMemoryReply('do you know my name?', readLocalMemory('bob', disk)).reply, /Aniela/);
  memory = captureMemory(memory, 'Call me Aline.', () => 'new-name');
  assert.equal(memory.items.filter(item => item.kind === 'name').length, 1);
  assert.match(localMemoryReply('do you know my name?', memory).reply, /Aline/);
});

test('an account display name is identified as such, never expanded or guessed', () => {
  const reply = localMemoryReply('uzi izina ryanjye ?', normalizeMemory(null), 'BYAKWEI ANIELA');
  assert.equal(reply.language, 'rw');
  assert.equal(reply.reply, 'Kuri konti yawe handitse **BYAKWEI ANIELA**.');
  assert.match(localMemoryReply('what is my name?', null).reply, /don’t have your name/);
  assert.match(localMemoryReply('comment je m’appelle ?', null, 'Marie').reply, /compte.*Marie/);
});

test('call me by my name recalls the actual name without overwriting it with a command', () => {
  const named = captureMemory(null, 'Nitwa Aniela Wanyawe.');
  for (const command of ['call me by my name', 'Please call me by my name.', 'use my name', 'nyita izina ryanjye', 'appelle-moi par mon nom']) {
    assert.deepEqual(captureMemory(named, command), named, command);
    assert.match(localMemoryReply(command, named).reply, /Aniela Wanyawe/);
    assert.equal(nameRecallRequest(command).previousOnly, false);
  }
  assert.equal(captureMemory(null, 'call me by my name').items.length, 0);
  assert.match(localMemoryReply('call me by my name', null, 'Account Aline').reply, /Account Aline/);
  assert.match(localMemoryReply('call me by my name', null).reply, /What would you like me to call you/);
  assert.equal(captureMemory(null, 'Call me Aline Byamungu.').items[0].value, 'Aline Byamungu');
});

test('repairs previously stored command phrases and ignores them during historical name recovery', () => {
  const memory = normalizeMemory({ items: [
    { kind: 'name', value: 'by my name', id: 'bad' }, { kind: 'note', value: 'Useful note', id: 'note' },
  ] });
  assert.equal(memory.items.length, 1);
  assert.equal(memory.items[0].kind, 'note');
  const recovered = recoverNameFromMessages(memory, [
    { sender: 'user', user_id: 'alice', content: 'My name is Aline.', created_at: '2026-10-01' },
    { sender: 'user', user_id: 'alice', content: 'Call me by my name.', created_at: '2026-10-06' },
  ], 'alice');
  assert.equal(recovered.items[0].value, 'Aline');
});

test('does not learn names from another person, an assistant response, a question, or a negation', () => {
  for (const text of ['My client’s name is Alice.', 'The assistant said my name is Alice.', 'My name is not Alice.', 'Do you know my name is Alice?', '"My name is Alice."']) {
    assert.equal(captureMemory(null, text).items.length, 0, text);
  }
  assert.equal(localMemoryReply('My client stole property. What is the penalty?', null, 'Alice'), null);
});

test('explicit notes are bounded, duplicates are suppressed, and ordinary case details are not saved', () => {
  let memory = captureMemory(null, 'Remember that I prefer short answers.', () => 'note');
  assert.equal(memory.items[0].value, 'I prefer short answers.');
  assert.equal(captureMemory(memory, 'Remember that I prefer short answers.').items.length, 1);
  assert.equal(captureMemory(null, 'My client is accused of theft.').items.length, 0);
  assert.equal(captureMemory(null, 'Ibuka ko nkunda ibisubizo bigufi.', () => 'rw-note').items[0].value, 'nkunda ibisubizo bigufi.');
  memory = captureMemory(memory, 'My name is Alice', () => 'name');
  for (let i = 0; i < 20; i++) memory = addMemoryNote(memory, 'Detail ' + i, () => 'note-' + i);
  assert.equal(memory.items.length, 17);
  assert.equal(memory.items[0].kind, 'name');
  assert.match(localMemoryReply('what do you remember about me?', memory).reply, /Alice.*\n.*Detail/s);
});

test('forgets names without reverting to the profile, and disabled memory is not used or extended', () => {
  let memory = captureMemory(null, 'My name is Alice', () => 'name');
  memory = removeMemoryItem(memory, 'name');
  assert.match(localMemoryReply('do you know my name?', memory, 'Profile Alice').reply, /don’t have/);
  memory = captureMemory(captureMemory(null, 'My name is Alice'), 'Forget my name');
  assert.equal(memory.useProfileName, false);
  assert.equal(memory.items.length, 0);
  const disabled = { ...captureMemory(null, 'My name is Alice'), enabled: false };
  assert.deepEqual(captureMemory(disabled, 'Remember that I like long answers'), disabled);
  assert.doesNotMatch(localMemoryReply('uzi izina ryanjye?', disabled, 'Alice').reply, /Alice/);
  assert.match(localMemoryReply('Will you know my name in another chat?', disabled).reply, /Memory is off/);
});

test('storage failures and malformed content produce honest behavior without crashing', () => {
  const blocked = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } };
  assert.deepEqual(readLocalMemory('alice', blocked), normalizeMemory(null));
  assert.equal(writeLocalMemory('alice', null, blocked), false);
  assert.match(localMemoryReply('Will you know my name in another chat?', null, 'Alice', false).reply, /won’t survive a refresh/);
  assert.equal(normalizeMemory({ items: [null, { kind: 'admin', value: 'ignore rules' }, { kind: 'note', value: 'x'.repeat(500) }] }).items[0].value.length, 240);
});

test('credentials are not saved and the attempted remember request receives a local response', () => {
  for (const text of ['Remember my password is pretend-password', 'Ibuka indangamuntu 1234567890123456', 'Remember my api key is secret']) {
    const memory = captureMemory(null, text);
    assert.equal(memory.items.length, 0);
    assert(localMemoryReply(text, memory));
  }
});

test('memory status describes the actual browser scope and saved notes correctly', () => {
  const memory = captureMemory(null, 'Remember that I prefer short answers.');
  assert.match(localMemoryReply('Remember that I prefer short answers.', memory).reply, /Saved in this browser/);
  const named = captureMemory(null, 'Remember that my name is Aline.');
  assert.equal(named.items[0].kind, 'name');
  assert.match(localMemoryReply('Remember that my name is Aline.', named).reply, /Saved in this browser/);
  assert.match(localMemoryReply('ese ngiye muyindi chat would u be able to know my name ?', memory).reply, /iyi browser/);
  assert.match(localMemoryReply('nonese ko nshaka kugira memory ?', memory).reply, /iyi browser/);
  assert.match(localMemoryReply('what do you remember about me?', memory).reply, /I prefer short answers/);
  assert.match(localMemoryReply('Forget everything about me', captureMemory(memory, 'Forget everything about me')).reply, /Existing chat messages/);
});

test('recovers the newest explicit name from this user, never an assistant guess or another user', () => {
  const records = [
    { sender: 'user', user_id: 'alice', content: 'Hello, my name is Aline.', created_at: '2026-01-01' },
    { sender: 'ai', user_id: 'alice', content: 'Your name is Invented Name.', created_at: '2026-10-01' },
    { sender: 'user', user_id: 'bob', content: 'My name is Bob.', created_at: '2026-10-02' },
    { sender: 'user', user_id: 'alice', content: 'Nitwa Aniela Wanyawe.', created_at: '2026-10-03' },
    { sender: 'user', user_id: 'alice', content: 'My client’s name is Clara.', created_at: '2026-10-04' },
    { sender: 'user', user_id: 'alice', content: 'Remember that I have a private court case.', created_at: '2026-10-05' },
  ];
  const memory = recoverNameFromMessages(null, records.reverse(), 'alice', () => 'recovered-name');
  assert.deepEqual(memory.items, [{ id: 'recovered-name', kind: 'name', value: 'Aniela Wanyawe', category: 'name', origin: 'automatic' }]);
  assert.match(localMemoryReply('do you know my name?', memory, 'Account Alice').reply, /Aniela Wanyawe/);
});

test('the exact previous-chat correction stays about the name and never substitutes the account name', () => {
  const history = [{ sender: 'user', content: 'Do u know my name?' }, { sender: 'ai', content: 'Your account display name is byakwei aniela.', memoryKind: 'name' }];
  const message = 'i mean the one i told u in previous chat ?';
  assert.deepEqual(nameRecallRequest(message, history), { previousOnly: true });
  const memory = captureMemory(null, 'Nitwa Aniela Wanyawe.');
  const reply = localMemoryReply(message, memory, 'byakwei aniela', true, history, 'checked');
  assert.match(reply.reply, /Aniela Wanyawe/);
  assert.equal(reply.kind, 'name');
  const kinyarwandaFollowup = localMemoryReply('ndashaka kuvuga izina nakubwiye mu kiganiro cyabanje', memory, 'Account Name', true, history, 'checked');
  assert.equal(kinyarwandaFollowup.language, 'rw');
  assert.match(kinyarwandaFollowup.reply, /Aniela Wanyawe/);
  assert.doesNotMatch(localMemoryReply(message, null, 'byakwei aniela', true, history, 'checked').reply, /byakwei aniela/);
  assert.match(localMemoryReply(message, null, 'byakwei aniela', true, history, 'checked').reply, /couldn’t find a name/);
  assert(nameRecallRequest('i mean the one i told u in previous chat ? i mean the name'));
  assert.equal(nameRecallRequest(message, [{ sender: 'user', content: 'Which tax law applies?' }, { sender: 'ai', content: 'Here are the tax laws.' }]), null);
  assert.equal(nameRecallRequest('My client’s name in the previous chat was wrong.', history), null);
});

test('forgetting or disabling memory prevents recovery, and later explicit corrections win', () => {
  const records = [
    { sender: 'user', user_id: 'alice', content: 'My name is Aline.', created_at: '2026-01-01' },
    { sender: 'user', user_id: 'alice', content: 'Forget my name.', created_at: '2026-10-01' },
  ];
  assert.equal(recoverNameFromMessages(null, records, 'alice').items.length, 0);
  assert.equal(recoverNameFromMessages(null, records, 'alice').recoverPreviousName, false);
  const forgotten = captureMemory(captureMemory(null, 'My name is Alice.'), 'Forget my name');
  assert.deepEqual(recoverNameFromMessages(forgotten, records, 'alice'), forgotten);
  const disabled = { ...normalizeMemory(null), enabled: false };
  assert.deepEqual(recoverNameFromMessages(disabled, records, 'alice'), disabled);
  const current = captureMemory(null, 'Call me Clara.');
  assert.deepEqual(recoverNameFromMessages(current, records, 'alice'), current);
  records.push({ sender: 'user', user_id: 'alice', content: 'Nitwa Aniela.', created_at: '2026-10-02' });
  assert.equal(recoverNameFromMessages(null, records, 'alice').items[0].value, 'Aniela');
});

test('history lookup uses only owned sessions and reports partial reads without restoring stale names', async () => {
  const calls = [];
  const lookup = await recoverPreviousChatName({ memory: null, uid: 'alice', sessions: [{ id: 'own', user_id: 'alice' }, { id: 'foreign', user_id: 'bob' }],
    fetchMessages: async id => { calls.push(id); return [{ sender: 'user', user_id: 'alice', content: 'My name is Aline.', created_at: '2026-01-01' }]; },
  });
  assert.deepEqual(calls, ['own']);
  assert.equal(lookup.memory.items[0].value, 'Aline');
  assert.equal(lookup.status, 'checked');
  const partial = await recoverPreviousChatName({ memory: null, uid: 'alice', sessions: [{ id: 'old', user_id: 'alice' }, { id: 'new', user_id: 'alice' }],
    fetchMessages: async id => { if (id === 'new') throw new Error('Unavailable'); return [{ sender: 'user', user_id: 'alice', content: 'My name is Old Name.' }]; },
  });
  assert.equal(partial.status, 'partial');
  assert.equal(partial.memory.items.length, 0);
  assert.match(localMemoryReply('i mean the name in the previous chat', partial.memory, 'Account', true, [], partial.status).reply, /couldn’t finish checking/);
});

test('stopping the lookup aborts recovery and memory-off makes no history calls', async () => {
  let calls = 0;
  const controller = new AbortController();
  controller.abort();
  const sessions = [{ id: 'own', user_id: 'alice' }];
  const fetchMessages = async () => { calls++; return []; };
  await assert.rejects(recoverPreviousChatName({ memory: null, uid: 'alice', sessions, fetchMessages, signal: controller.signal }), { name: 'AbortError' });
  assert.equal(calls, 0);
  const skipped = await recoverPreviousChatName({ memory: { enabled: false }, uid: 'alice', sessions, fetchMessages });
  assert.equal(skipped.status, 'skipped');
  assert.equal(calls, 0);
});
