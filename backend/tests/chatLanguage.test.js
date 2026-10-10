import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveReplyLanguage, languageCopy } from '../chatLanguage.js';
import { createChatProvider, publicChatError } from '../chatProvider.js';
import { createSearchTracker } from '../chatSearch.js';

test('recognises the Kinyarwanda theft question and longer messages', () => {
  for (const message of ['umuntu wibye bamuhanisha icyi mu rwanda', 'Ndashaka kumenya amategeko yo mu Rwanda n’uburenganzira bw’umuntu.', 'Muraho', 'Murakoze!']) {
    assert.equal(resolveReplyLanguage(message), 'rw', message);
  }
});

test('automatically recognises short personal questions and mixed Kinyarwanda follow-ups', () => {
  for (const message of ['uzi izina ryanjye ?', 'uzi izina ryarye ?', 'Nitwa Aniela.', 'Uranyibuka?', 'ahanishwa iki?', 'ahanishwaki?', 'ese ngiye muyindi chat would u be able to know my name ?', 'nonese ko nshaka kugira memory ?']) {
    assert.equal(resolveReplyLanguage(message), 'rw', message);
  }
  assert.equal(resolveReplyLanguage('Do you know my name?'), 'en');
  assert.equal(resolveReplyLanguage('What is my name?'), 'en');
  assert.equal(resolveReplyLanguage('Do you know what “izina ryanjye” means?'), 'en');
});

test('current language overrides old English answers, while short follow-ups use prior user language', () => {
  const history = [{ sender: 'user', content: 'umuntu wibye bamuhanisha icyi mu rwanda' }, { sender: 'ai', content: 'What happens to a person who breaks the law in Rwanda?' }];
  assert.equal(resolveReplyLanguage('umuntu wibye bamuhanisha icyi mu rwanda', history), 'rw');
  assert.equal(resolveReplyLanguage('ok', history), 'rw');
  assert.equal(resolveReplyLanguage('Please explain this in English.', history), 'en');
  assert.equal(resolveReplyLanguage('What are the legal options for someone accused of theft?', history), 'en');
  assert.equal(resolveReplyLanguage('My client needs legal guidance.'), 'en');
});

test('explicit reply preferences and language instructions are respected', () => {
  assert.equal(resolveReplyLanguage('Hello!', [], 'rw'), 'rw');
  assert.equal(resolveReplyLanguage('Muraho', [], 'en'), 'en');
  assert.equal(resolveReplyLanguage('Answer in Kinyarwanda please.'), 'rw');
  assert.equal(resolveReplyLanguage('Bonjour, pouvez-vous expliquer mes droits et les lois au Rwanda ?'), 'fr');
  assert.equal(resolveReplyLanguage('123', []), 'auto');
});

test('short language-switch requests override the previous user language without interpreting mentions as commands', async () => {
  const history = [{ sender: 'user', content: 'Mbwira amategeko yo mu Rwanda ku gutubura.' }, { sender: 'ai', content: 'Gutubura bivuga ubutekamutwe.' }];
  for (const request of ['in english', 'English please!', 'mu cyongereza']) assert.equal(resolveReplyLanguage(request, history), 'en');
  for (const request of ['French pls', 'en français', 'mu gifaransa']) assert.equal(resolveReplyLanguage(request, history), 'fr');
  for (const request of ['in Kinyarwanda', 'muri ikinyarwanda']) assert.equal(resolveReplyLanguage(request, [{ sender: 'user', content: 'What are my rights?' }]), 'rw');
  assert.equal(resolveReplyLanguage('My client studies English and French.'), 'en');
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', externalSearch: { lookup: async () => ({ status: 'not_needed', sources: [] }) }, client: { chat: { completions: { create: async request => {
    calls++;
    assert.match(request.messages[0].content, /REQUIRED ANSWER LANGUAGE: English/);
    assert.equal(request.tool_choice, 'none');
    return { choices: [{ message: { content: 'In this context, gutubura means fraud or scamming. Confirm the applicable law before relying on a specific penalty.' } }] };
  } } } } });
  assert.match(await provider.reply({ message: 'in english', history }), /means fraud/);
  assert.equal(calls, 1, 'Do not translate an English answer back into Kinyarwanda');
});

test('Kinyarwanda reaches the provider instruction and localized lookup recovery', async () => {
  const requests = [];
  const events = [];
  const client = { chat: { completions: { create: async request => {
    requests.push(request);
    if (request.tools) throw Object.assign(new Error('Too large'), { code: 'context_length_exceeded' });
    return (async function* () { yield { choices: [{ delta: { content: 'Igihano giterwa n’icyaha cyakozwe.' } }] }; })();
  } } } };
  const provider = createChatProvider({ client, model: 'openai/gpt-oss-120b' });
  const reply = await provider.reply({ message: 'umuntu wibye bamuhanisha icyi mu rwanda ubu', streaming: true, signal: new AbortController().signal, onEvent: (name, data) => events.push([name, data]) });
  assert.match(requests[0].messages[0].content, /REQUIRED ANSWER LANGUAGE: Ikinyarwanda/);
  assert.match(requests[1].messages[0].content, /REQUIRED ANSWER LANGUAGE: Ikinyarwanda/);
  assert.match(reply, /^Sinashoboye/);
  assert.doesNotMatch(reply, /I couldn’t|general guidance/);
  assert.equal(events.filter(([name]) => name === 'token').map(([, data]) => data.text).join(''), reply);
});

test('localized errors keep structured retry timing and source links intact', () => {
  const result = publicChatError({ status: 429, retryAfterSeconds: 120 }, 'rw');
  assert.equal(result.retryAfterSeconds, 120);
  assert.match(result.error, /minota.*2/);
  assert.equal(publicChatError(new Error('Provider failed'), 'rw').error, languageCopy('rw').genericError);
  const tracker = createSearchTracker({ language: 'rw' });
  tracker.observe([{ name: 'browser.open', index: 1, output: 'L1: URL: https://official.example/law' }]);
  assert.match(tracker.finish('Amategeko. 【1†L4-L7】'), /\[official.example\]\(https:\/\/official.example\/law\)/);
  assert.doesNotMatch(tracker.finish('Amategeko. 【99†L4-L7】'), /【|Pages checked/);
  assert.match(tracker.finish('Amategeko.'), /Imbuga zasuzumwe/);
});
