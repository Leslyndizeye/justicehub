// Opt-in checks of informal wording. Uses Groq quota, never database/search
// access, legal-answer generation, fine-tuning, or writes to a provider model.
import 'dotenv/config';
import assert from 'node:assert/strict';
import Groq from 'groq-sdk';
import { createChatProvider } from '../chatProvider.js';
import { researchTopics } from '../questionUnderstanding.js';
import { chatErrorDiagnostic } from '../chatDiagnostics.js';

const cases = [
  { id: 'salary_spelling', message: 'my emploer wont pay my salery', topics: ['employment_pay', 'employment'] },
  { id: 'tenancy_spelling', message: 'my landloard changed the locks and now i cant get into my home', topics: ['tenancy'] },
  { id: 'phonetic_context', message: 'wat low says about salery', topics: ['employment_pay', 'employment'] },
  { id: 'french_everyday', message: 'mon patron ne me paie plus et je ne sais pas quoi faire', topics: ['employment_pay', 'employment'] },
  { id: 'missing_context', message: 'he said it was fine, what should i do?', kind: 'unclear' },
];
const selected = process.argv[2] ? cases.filter(item => item.id === process.argv[2]) : cases;
if (!selected.length) throw new Error(`Choose a case: ${cases.map(item => item.id).join(', ')}`);
const client = new Groq({ apiKey: process.env.GROQ_API_KEY, maxRetries: 0 });
const provider = createChatProvider({ client, model: process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b',
  fallbackModel: process.env.GROQ_FALLBACK_MODEL?.trim() || 'openai/gpt-oss-20b' });
for (const item of selected) {
  try {
    const route = await provider.understand({ message: item.message, signal: AbortSignal.timeout(25000) });
    if (item.kind) assert.equal(route.kind, item.kind);
    else {
      assert.equal(route.kind, 'legal');
      assert.ok(item.topics.some(topic => researchTopics[topic] === route.researchTopic));
    }
    console.log(JSON.stringify({ case: item.id, passed: true, kind: route.kind, topic: route.researchTopic || null }));
  } catch (error) {
    console.error(JSON.stringify({ case: item.id, passed: false, diagnostic: chatErrorDiagnostic(error) }));
    process.exitCode = 1;
    break;
  }
}
