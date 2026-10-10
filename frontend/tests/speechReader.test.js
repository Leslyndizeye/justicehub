import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSpeechReader, speechChunks } from '../lib/speechReader.js';
import { speechLanguage } from '../lib/speechLanguage.js';

function device(voices = [
  { lang: 'en-US', localService: true, default: true },
  { lang: 'fr-FR', localService: true },
]) {
  const spoken = [];
  let cancels = 0;
  const synthesis = { getVoices: () => voices, speak: utterance => spoken.push(utterance), cancel: () => { cancels++; } };
  class Utterance { constructor(text) { this.text = text; } }
  return { spoken, get cancels() { return cancels; }, reader: createSpeechReader({ synthesis, Utterance }) };
}

test('reads a completed answer using a matching local device voice and not a remote service', () => {
  const d = device();
  d.reader.start({ messageId: 'answer', language: 'fr', text: 'Vous avez des droits.' });
  assert.equal(d.spoken[0].text, 'Vous avez des droits.');
  assert.equal(d.spoken[0].lang, 'fr-FR');
  assert.equal(d.spoken[0].voice.localService, true);
  assert.equal(d.reader.snapshot().status, 'reading');
  d.spoken[0].onend();
  assert.equal(d.reader.snapshot().status, 'idle');
});

test('reopened answers choose their own language without changing the database', () => {
  const d = device();
  d.reader.start({ messageId: 'saved-fr', text: 'Vous pouvez demander une explication du document et vérifier les conditions de votre contrat avant de le signer.' });
  assert.equal(d.spoken[0].lang, 'fr-FR');
  assert.equal(speechLanguage('Nitwa Aniela.', 'auto'), 'rw');
  assert.equal(speechLanguage('Gufata kungufu means rape.', 'auto'), 'en');
  assert.equal(speechLanguage('Muraho, nshobora kugufasha gusobanukirwa amategeko n’uburenganzira bwawe mu Rwanda.', 'auto'), 'rw');
  assert.equal(speechLanguage('Bonjour', 'en'), 'en');
});

test('starting another answer cancels the previous one and late callbacks cannot restart it', () => {
  const d = device();
  d.reader.start({ messageId: 'first', text: 'A long answer. '.repeat(100) });
  const oldEnd = d.spoken[0].onend;
  d.reader.start({ messageId: 'second', text: 'A different answer.' });
  assert.equal(d.cancels, 1);
  oldEnd();
  assert.equal(d.spoken.length, 2);
  assert.equal(d.reader.snapshot().messageId, 'second');
  d.reader.stop('first');
  assert.equal(d.reader.snapshot().messageId, 'second');
  d.reader.stop('second');
  assert.equal(d.cancels, 2);
  assert.equal(d.reader.snapshot().status, 'idle');
});

test('long replies are fully read in order and preserve legal amounts, dates, and negation', () => {
  const text = ('A deadline is 30 days. Do not change RWF 100000 or 10/10/2026. ').repeat(60).trim();
  const d = device();
  d.reader.start({ messageId: 'long', text });
  let offset = 0;
  while (d.reader.snapshot().status === 'reading') d.spoken[offset++].onend();
  assert.equal(d.spoken.map(u => u.text).join(' '), text);
  assert.ok(d.spoken.length > 1);
  assert.ok(d.spoken.every(u => u.text.length <= 360));
  assert.deepEqual(speechChunks(''), []);
});

test('missing Kinyarwanda voices never silently use English or a remote Kinyarwanda voice', () => {
  const d = device([{ lang: 'rw-RW', localService: false }, { lang: 'en-US', localService: true }]);
  d.reader.start({ messageId: 'rw', language: 'rw', text: 'Nitwa Aniela.' });
  assert.equal(d.spoken.length, 0);
  assert.equal(d.reader.snapshot().status, 'error');
  assert.match(d.reader.snapshot().error, /Kinyarwanda/);
});

test('device failures and unsupported browsers return a usable status without throwing', () => {
  const unsupported = createSpeechReader({ synthesis: null, Utterance: null });
  assert.equal(unsupported.supported, false);
  unsupported.start({ messageId: 'answer', text: 'Hello' });
  assert.match(unsupported.snapshot().error, /not supported/);
  const d = device();
  d.reader.start({ messageId: 'answer', text: 'Hello' });
  d.spoken[0].onerror({ error: 'synthesis-failed' });
  assert.equal(d.reader.snapshot().status, 'error');
  d.reader.start({ messageId: 'answer', text: 'Hello again' });
  assert.equal(d.reader.snapshot().status, 'reading');
});

test('leaving the chat stops reading and prevents further updates to unmounted listeners', () => {
  const d = device();
  const states = [];
  const unsubscribe = d.reader.subscribe(state => states.push(state));
  d.reader.start({ messageId: 'answer', text: 'Hello' });
  const emittedBeforeUnmount = states.length;
  unsubscribe();
  d.reader.dispose();
  assert.equal(d.cancels, 1);
  assert.equal(states.length, emittedBeforeUnmount);
  assert.equal(d.reader.snapshot().status, 'idle');
});
