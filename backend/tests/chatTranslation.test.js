import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsTranslation, protectTranslationText, translateReply } from '../chatTranslation.js';
import { createChatProvider } from '../chatProvider.js';

test('detects an English draft for a Kinyarwanda reply without retranslating native text', () => {
  assert.equal(needsTranslation('A person who stole property should check the applicable law and penalty.', 'rw'), true);
  assert.equal(needsTranslation('Igihano cy’ubujura giterwa n’icyaha cyakozwe n’amategeko akurikizwa.', 'rw'), false);
  assert.equal(needsTranslation('A person who stole property should check the applicable law.', 'en'), false);
});

test('protects links, code, legal identifiers and dates, and rejects lost or duplicated values', () => {
  const source = 'Article 15, law 027/2019, date 04/09/2025: [source](https://official.example/law?article=15&year=2025). `112`\n```js\nconst x = 10;\n```';
  const protectedText = protectTranslationText(source);
  assert.equal(protectedText.restore(protectedText.masked), source);
  assert.doesNotMatch(protectedText.masked, /https:\/\/official|027\/2019|const x/);
  assert.throws(() => protectedText.restore(protectedText.masked.replace('ZXJH000000XZ', '')), /protected source or number/);
  assert.throws(() => protectedText.restore(protectedText.masked + ' ZXJH000000XZ'), /protected source or number/);
});

test('translation repair uses contextual slang hints without misclassifying ordinary names', async () => {
  const requests = [];
  const client = { chat: { completions: { create: async request => {
    requests.push(request);
    return { choices: [{ message: { content: 'Aya magambo agomba gusobanurwa neza mu Kinyarwanda.' } }] };
  } } } };
  await translateReply({ client, model: 'openai/gpt-oss-20b', text: 'The official requested payment called umuti w’ikaramu for a service. Drug called mugo means heroin.', target: 'rw' });
  assert.equal(requests.length, 1);
  assert.match(requests[0].messages[0].content, /bribery euphemisms/);
  assert.match(requests[0].messages[0].content, /mugo is a local name for heroin/);
  assert.match(requests[0].messages[0].content, /not new facts to add/);
  await translateReply({ client, model: 'openai/gpt-oss-20b', text: 'Professor Mugo studies drug policy.', target: 'rw' });
  assert.doesNotMatch(requests[1].messages[0].content, /mugo is a local name for heroin/);
});

test('does not stream the wrong-language draft and preserves verified links through translation', async () => {
  const calls = [];
  const seen = [];
  const client = { chat: { completions: { create: async request => {
    calls.push(request);
    if (request.stream) return (async function* () {
      yield { choices: [{ delta: { content: 'A person who stole property needs the applicable law. See [source](https://official.example/law).' } }] };
    })();
    const { text } = JSON.parse(request.messages[1].content);
    const placeholder = text.match(/ZXJH\d{6}XZ/)[0];
    return { choices: [{ message: { content: `Igihano cy’ubujura giterwa n’icyaha cyakozwe n’amategeko akurikizwa. Reba [inkomoko](${placeholder}).` } }] };
  } } } };
  const provider = createChatProvider({ client, model: 'openai/gpt-oss-120b' });
  const reply = await provider.reply({ message: 'umuntu wibye bamuhanisha icyi mu rwanda ubu', streaming: true, signal: new AbortController().signal, onEvent: (name, data) => seen.push([name, data]) });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].tools, undefined);
  assert.match(calls[1].messages[0].content, /Ikinyarwanda/);
  assert.match(reply, /https:\/\/official.example\/law/);
  assert.doesNotMatch(reply, /ZXJH|A person who/);
  assert.equal(seen.filter(([name]) => name === 'token').map(([, data]) => data.text).join(''), reply);
  assert(seen.some(([name, data]) => name === 'status' && /guhindura/.test(data.text)));
});

test('rejects a translation that returns English rather than publishing it as Kinyarwanda', async () => {
  const client = { chat: { completions: { create: async () => ({ choices: [{ message: { content: 'This is still an English explanation of the applicable legal rules.' } }] }) } } };
  await assert.rejects(translateReply({ client, model: 'openai/gpt-oss-120b', text: 'Please explain the rule.', target: 'rw', signal: new AbortController().signal }), /requested language/);
});
