import { interpretLegalQuestion } from './legalQuestion.js';
import { matchedLegalVocabulary } from './legalVocabulary.js';
import { interpretCasualMessage } from '../shared/chatCasual.js';

export async function searchLegalDocs(client, message, history = []) {
  if (interpretCasualMessage(message)?.standalone) return [];
  const { retrievalQuery, topic } = interpretLegalQuestion(message, history);
  try {
    const { data, error } = await client.from('legal_documents')
      .select('title, category, content, year, source')
      .textSearch('content', retrievalQuery, { type: 'websearch', config: 'english' })
      .limit(topic ? 16 : 4);
    if (error) return [];
    const documents = data || [];
    // A passing mention of theft in an employment or ethics document is less useful
    // than an excerpt actually devoted to theft offences.
    if (topic === 'theft') documents.sort((a, b) => Number(/theft|robbery|kwiba|ubujura/i.test(b.title || '')) - Number(/theft|robbery|kwiba|ubujura/i.test(a.title || '')));
    else if (topic) documents.sort((a, b) => Number(matchedLegalVocabulary(b.title).some(entry => entry.topic === topic)) - Number(matchedLegalVocabulary(a.title).some(entry => entry.topic === topic)));
    return documents.slice(0, 4);
  } catch {
    return [];
  }
}
