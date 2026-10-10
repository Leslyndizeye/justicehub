import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createChatProvider } from '../chatProvider.js';
import { interpretLegalQuestion } from '../legalQuestion.js';
import { referencedPenaltyAnswer } from '../legalAnswer.js';

test('the exact short theft question returns the sourced penalty without model quota or a procedure table', async () => {
  const events = [];
  let calls = 0;
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: { chat: { completions: { create() { calls++; throw new Error('No external calls expected'); } } } } });
  const reply = await provider.reply({ message: 'umuntu wibye ahanishwa iki ?', streaming: true, signal: new AbortController().signal, onEvent: (name, data) => events.push([name, data]) });
  assert.equal(calls, 0);
  assert.match(reply, /uhamijwe n’urukiko/);
  assert.match(reply, /1 kugeza ku myaka 2/);
  assert.match(reply, /1,000,000 kugeza kuri 2,000,000 FRW/);
  assert.match(reply, /rusange.*6/s);
  assert.match(reply, /kimwe gusa muri ibyo bihano/);
  assert.match(reply, /sinagenzuye niba hari impinduka zabaye nyuma/);
  assert.match(reply, /\[.*\]\(https:\/\/www\.minijust\.gov\.rw.*page=155\)/);
  assert.doesNotMatch(reply, /\|.*\||umunyamategeko ashobora guhitamo|gufatwa|gutanga ikirego/i);
  assert.equal(events.filter(([name]) => name === 'token').map(([, data]) => data.text).join(''), reply);
});

test('a short punishment follow-up uses the user’s theft topic despite earlier assistant deflection', async () => {
  const history = [{ sender: 'user', content: 'umuntu wibye bamuhanisha icyi mu rwanda' }, { sender: 'ai', content: 'Do you mean reporting, laws, or court procedures?' }];
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: null });
  const reply = await provider.reply({ message: 'ahanishwa iki?', history });
  assert.match(reply, /igifungo|Igifungo/);
  assert.doesNotMatch(reply, /ushaka kumenya|court procedures/i);
});

test('dated source lookup cannot answer current amendments, aggravating facts, or a client-specific sentence', () => {
  for (const message of ['What is the latest penalty for theft?', 'What is the penalty for aggravated theft?', 'What penalty applies to theft with violence?', 'What is the penalty for theft committed by a child?', 'What punishment can my client get for theft?', 'umuntu wibye ahanishwa iki ubu?', 'Quelle est la peine pour vol aggravé ?']) {
    assert.equal(referencedPenaltyAnswer(message, interpretLegalQuestion(message), 'en'), null, message);
  }
});

test('source lookup uses the requested language and does not claim a live web search', () => {
  const message = 'What is the penalty for theft in Rwanda?';
  const intent = interpretLegalQuestion(message);
  const french = referencedPenaltyAnswer(message, intent, 'fr');
  assert.match(french, /reconnue coupable/);
  assert.match(french, /une seule de ces peines/);
  const english = referencedPenaltyAnswer(message, intent, 'en');
  assert.match(english, /convicted of theft by a court/);
  assert.match(english, /only one of those penalties/);
  assert.match(english, /haven’t verified later amendments/);
  assert.doesNotMatch(english, /searched the web|current law guarantees|lawyer chooses/i);
});

test('Stop cancels source replies before text is emitted', async () => {
  const controller = new AbortController();
  controller.abort();
  const provider = createChatProvider({ model: 'openai/gpt-oss-120b', client: null });
  await assert.rejects(provider.reply({ message: 'umuntu wibye ahanishwa iki?', signal: controller.signal }), { name: 'AbortError' });
});
