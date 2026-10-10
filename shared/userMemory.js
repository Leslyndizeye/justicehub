/** Shared selective-memory rules. Storage adapters decide where details persist. */
import { extractImportantFacts, extractMemoryRetractions, memoryStatements, forgottenCategory, memoryCategoryMatches, memoryCategories, memoryCategoryLabels } from './memoryFacts.js';

export function sensitiveMemory(value) {
  return /\b(?:password|api[ _-]?key|secret[ _-]?key|national id|passport|ijambo ry['’]ibanga|indangamuntu)\b|\b(?:gsk_|sk-|tvly-|sb_secret_|eyJ)[A-Za-z0-9_-]{12,}|-----BEGIN .*PRIVATE KEY-----|\b\d{16}\b/i.test(value);
}

function validPersonalName(value) {
  const text = normalizedText(value);
  return /^[\p{L}][\p{L}\p{M} '\u2019-]{0,79}$/u.test(value) && value.split(/\s+/).length <= 6
    && !/^(?:not|si|pas)\b/i.test(value) && !/^(?:nde|ninde|iki|who|what|unknown)$/i.test(text)
    && !/^(?:(?:by |using |with |par |avec )?(?:my|your|the|mon|ton) (?:real |saved |preferred |actual |vrai )?(?:name|nom)|(?:the |my )?(?:same|previous|old) name|(?:izina|amazina) (?:ryanjye|yanjye)|as before|like before)$/i.test(text);
}

export function normalizeMemory(input) {
  const items = [];
  for (const item of Array.isArray(input?.items) ? input.items : []) {
    if (!['name', 'note'].includes(item?.kind) || typeof item.value !== 'string') continue;
    const value = item.value.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, item.kind === 'name' ? 80 : 240);
    // Also repair the invalid name written by older versions for "call me by my name".
    if (item.kind === 'name' && !validPersonalName(value)) continue;
    if (sensitiveMemory(value)) continue;
    const category = item.kind === 'name' ? 'name' : memoryCategories.includes(item.category) ? item.category : 'note';
    if (!value || items.some(saved => saved.kind === item.kind && (item.kind === 'name' || saved.value === value && saved.category === category))) continue;
    if (item.kind === 'note' && items.filter(saved => saved.kind === 'note').length >= 16) continue;
    items.push({ id: typeof item.id === 'string' ? item.id.slice(0, 80) : `item-${items.length}`, kind: item.kind, value, category, origin: item.origin === 'automatic' ? 'automatic' : 'manual' });
    if (items.length === 17) break;
  }
  return { version: 1, enabled: input?.enabled !== false, useProfileName: input?.useProfileName !== false,
    recoverPreviousName: input?.recoverPreviousName !== false && !(input?.recoverPreviousName == null && input?.useProfileName === false),
    autoSave: input?.autoSave !== false,
    ignoredCategories: Array.isArray(input?.ignoredCategories) ? [...new Set(input.ignoredCategories.filter(category => memoryCategories.includes(category) && category !== 'note'))] : [], items };
}

export function memoryKey(uid) { return `justicehub-memory-v1:${uid}`; }
export function readLocalMemory(uid, storage) {
  try { return normalizeMemory(JSON.parse(storage.getItem(memoryKey(uid)) || 'null')); }
  catch { return normalizeMemory(null); }
}
export function writeLocalMemory(uid, memory, storage) {
  try { storage.setItem(memoryKey(uid), JSON.stringify(normalizeMemory(memory))); return true; }
  catch { return false; }
}

export function addMemoryNote(input, text, id = () => crypto.randomUUID(), options = {}) {
  const memory = normalizeMemory(input);
  const value = text.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 240);
  if (!memory.enabled || !value || sensitiveMemory(value)) return memory;
  const category = memoryCategories.includes(options.category) ? options.category : 'note';
  if (memory.items.some(item => item.kind === 'note' && (item.value === value && (category === 'note' || item.category === category) || item.category === category && normalizedText(item.value) === normalizedText(value)))) return memory;
  const origin = options.origin === 'automatic' ? 'automatic' : 'manual';
  if (origin === 'automatic' && memory.ignoredCategories.some(ignored => memoryCategoryMatches(category, ignored))) return memory;
  const retained = memory.items.filter(item => item.kind === 'note' && (category === 'note' || item.category !== category));
  // Never silently evict an existing note when the bounded memory is full.
  if (retained.length >= 16) return memory;
  const notes = [...retained, { id: id(), kind: 'note', value, category, origin }];
  return { ...memory, ignoredCategories: origin === 'manual' ? memory.ignoredCategories.filter(ignored => !memoryCategoryMatches(category, ignored)) : memory.ignoredCategories, items: [...memory.items.filter(item => item.kind === 'name'), ...notes] };
}

function memoryControl(message) {
  const text = normalizedText(message);
  if (/^(?:enable|turn on) (?:saved )?memory$|^fungura memory$|^active (?:la )?m[eé]moire$/.test(text)) return { field: 'enabled', value: true };
  if (/^(?:disable|turn off) (?:saved )?memory$|^zimya memory$|^d[eé]sactive (?:la )?m[eé]moire$/.test(text)) return { field: 'enabled', value: false };
  if (/^(?:enable|resume|turn on) automatic (?:memory|saving)$/.test(text)) return { field: 'autoSave', value: true };
  if (/^(?:disable|stop|turn off) automatic (?:memory|saving)$/.test(text)) return { field: 'autoSave', value: false };
  return null;
}

export function captureMemory(input, message, id = () => crypto.randomUUID(), options = {}) {
  const memory = normalizeMemory(input);
  const text = message.trim();
  const control = memoryControl(text);
  if (control) return { ...memory, [control.field]: control.value };
  if (/^(?:forget (?:my name|everything(?: you remember)?(?: about me)?)|ibagirwa (?:izina ryanjye|byose)|oublie (?:mon nom|tout))\s*[.!?]*$/i.test(text)) {
    const nameOnly = /my name|izina ryanjye|mon nom/i.test(text);
    return { ...memory, useProfileName: false, recoverPreviousName: false, autoSave: nameOnly ? memory.autoSave : false, items: nameOnly ? memory.items.filter(item => item.kind !== 'name') : [] };
  }
  if (!memory.enabled) return memory;
  const forgotten = forgottenCategory(text);
  if (forgotten) return { ...memory, ignoredCategories: [...new Set([...memory.ignoredCategories, forgotten])], items: memory.items.filter(item => !memoryCategoryMatches(item.category, forgotten)) };
  const requested = text.match(/^(?:please\s+)?(?:remember (?:that\s+)?|ibuka (?:ko\s+)?|ujye wibuka (?:ko\s+)?|souviens-toi (?:que\s+)?)(.+)$/i);
  if (requested) {
    if (/^(?:my name is|my name['’]s|my names are|i(?: am|['’]m) called|(?:just )?call me|you can call me|nitwa|(?:izina ryanjye|amazina yanjye) ni|nyita|je m['’]appelle|appelle[- ]moi)\s+/i.test(requested[1])) return captureMemory(memory, requested[1], id, { explicit: true });
    const facts = extractImportantFacts(requested[1]);
    return addMemoryNote(memory, requested[1], id, { category: facts.length === 1 ? facts[0].category : 'note' });
  }
  let result = memory;
  const facts = extractImportantFacts(text);
  const retractions = extractMemoryRetractions(text);
  for (const sentence of memoryStatements(text)) {
    // Apply changes in spoken order: a later retraction or forget must defeat an earlier fact.
    if (forgottenCategory(sentence) || /^(?:forget (?:my name|everything(?: you remember)?(?: about me)?)|ibagirwa (?:izina ryanjye|byose)|oublie (?:mon nom|tout))\s*[.!?]*$/i.test(sentence)) {
      result = captureMemory(result, sentence, id, options);
      continue;
    }
    if (!result.autoSave && !options.explicit) continue;
    const introduction = sentence.match(/^(?:please\s+)?(?:my name is|my name['’]s|my names are|i(?: am|['’]m) called|(?:just )?call me|you can call me|nitwa|(?:izina ryanjye|amazina yanjye) ni|nyita|je m['’]appelle|appelle[- ]moi)\s+([^\n.!?;,]+)/i);
    if (introduction) {
      const value = introduction[1].split(/\s+(?:and|but|kandi|ariko|et|mais)\s+/i)[0].trim();
      if (validPersonalName(value) && !sensitiveMemory(value) && result.items.find(item => item.kind === 'name')?.value !== value) {
        result = { ...result, items: [{ id: id(), kind: 'name', value, category: 'name', origin: options.explicit ? 'manual' : 'automatic' }, ...result.items.filter(item => item.kind !== 'name')] };
      }
    }
    for (const change of retractions.filter(change => change.statement === sentence)) {
      const escaped = normalizedText(change.value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}(?:$|[^\\p{L}\\p{N}])`, 'u');
      result = { ...result, items: result.items.filter(item => item.category !== change.category || !matches.test(normalizedText(item.value))) };
    }
    for (const fact of facts.filter(fact => (fact.statement || fact.value) === sentence)) result = addMemoryNote(result, fact.value, id, { category: fact.category, origin: options.explicit ? 'manual' : 'automatic' });
  }
  return result;
}

export function removeMemoryItem(input, itemId) {
  const memory = normalizeMemory(input);
  const removedName = memory.items.some(item => item.id === itemId && item.kind === 'name');
  const removed = memory.items.find(item => item.id === itemId);
  return { ...memory, useProfileName: removedName ? false : memory.useProfileName,
    recoverPreviousName: removedName ? false : memory.recoverPreviousName,
    ignoredCategories: removed?.kind === 'note' && removed.category !== 'note' ? [...new Set([...memory.ignoredCategories, removed.category])] : memory.ignoredCategories,
    items: memory.items.filter(item => item.id !== itemId) };
}

function escapeMarkdown(value) { return value.replace(/[\\`*_{}\[\]<>]/g, '\\$&'); }
function normalizedText(value) { return value.toLowerCase().replace(/[’]/g, "'").replace(/[?!.,]/g, '').trim().replace(/\s+/g, ' '); }

function directNameQuestion(text) {
  return useKnownName(text) || /^(?:(?:do (?:you|u)|can (?:you|u)) (?:know|remember|tell me) my name|what(?:'s| is) my name|(?:ese )?nitwa nde|(?:ese )?izina ryanjye ni irihe|(?:ese )?(?:uzi|waba uzi|uribuka) izina (?:ryanjye|ryange|ryarye|ryajye)|(?:tu |vous )?(?:connais|connaissez|sais|savez) (?:mon nom|comment je m'appelle)|comment je m'appelle)$/.test(text);
}

function useKnownName(text) {
  return /^(?:please )?(?:call me (?:by |using )?(?:my|the) (?:saved |preferred |real )?name|(?:use|say) my name|address me by my name|nyita izina ryanjye|nkoresha izina ryanjye|appelle-moi (?:par |avec )?mon nom)$/.test(text);
}

function nameComparisonQuestion(text) {
  return /^(?:(?:i think |but |so |wait |then )*)(?:(?:i|i've) (?:have|got|have got) (?:two|2|different) names|do i have (?:two|2) names|why (?:(?:do i have|are there) )?(?:two|2|different) names|(?:what(?:'s| is)|which is) (?:my |the )?(?:other|second|full|account|saved) name|(?:ese )?mfite amazina abiri|(?:ese )?irindi zina ni irihe|j'ai deux noms|pourquoi deux noms|quel est (?:mon |l')autre nom)$/.test(text);
}

function factRecallCategory(text) {
  text = text.replace(/^ese\s+/, '');
  if (/^(?:what(?:'s| is) my (?:job|profession|occupation)|what do i do for work|do you (?:know|remember) my (?:job|profession)|uzi akazi nkora|nkora akahe kazi|quelle est ma profession)$/.test(text)) return 'occupation';
  if (/^(?:what (?:am i studying|do i study)|do you (?:know|remember) what i study|niga iki|que(?:lle mati[eè]re)? (?:j'[eé]tudie|est.ce que j'[eé]tudie))$/.test(text)) return 'education';
  if (/^(?:what project am i working on|what am i (?:building|developing)|what(?:'s| is) my project|umushinga wanjye ni uwuhe|quel est mon projet)$/.test(text)) return 'project';
  if (/^(?:what(?:'s| is) my goal|what do i want to become|intego yanjye ni iyihe|quel est mon objectif)$/.test(text)) return 'goal';
  if (/^(?:what (?:answers|responses|explanations) do i prefer|what(?:'s| is) my response preference|nkunda ibisubizo bimeze bite)$/.test(text)) return 'response_style';
  if (/^(?:where do i live|where am i based|do you (?:know|remember) where i live|what(?:'s| is) my (?:city|location)|ntuye he|mba he|o[uù] (?:j'habite|est.ce que j'habite))$/.test(text)) return 'location';
  if (/^(?:what languages? do i speak|mvuga uruhe rurimi|quelles langues je parle)$/.test(text)) return 'language_ability';
  if (/^(?:what language (?:do i prefer|should you use)|what(?:'s| is) my (?:preferred )?language|nkunda ururimi uruhe|quelle langue je pr[eé]f[eè]re)$/.test(text)) return 'language';
  if (/^(?:what(?:'s| is| are) my (?:skills|tech stack)|what (?:skills do i have|programming languages do i use)|nzi iki|quelles sont mes comp[eé]tences)$/.test(text)) return 'skills';
  if (/^(?:what (?:am i interested in|are my interests|do i enjoy)|what(?:'s| is) my interest|nshishikajwe n'iki|quels sont mes int[eé]r[eê]ts)$/.test(text)) return 'interests';
  if (/^(?:what(?:'s| is) my (?:project )?budget)$/.test(text)) return 'budget';
  if (/^(?:what computer do i use|what(?:'s| is) my computer)$/.test(text)) return 'hardware';
  if (/^(?:what(?:'s| is| are) my (?:project )?(?:constraints|requirements)|what does my project need|quelles sont mes contraintes)$/.test(text)) return 'constraints';
  const about = text.match(/^(?:what do you (?:know|remember)|what did i tell you) about my (job|work|studies|education|project|goal|preferences|language|location|skills|interests|budget|constraints)$/);
  if (about) return ({ job: 'occupation', work: 'occupation', studies: 'education', preferences: 'response_style' })[about[1]] || about[1];
  return null;
}

/** Resolve "the one I told you" only when the current conversation is about the user's name. */
export function nameRecallRequest(message, history = []) {
  const text = normalizedText(message);
  if (directNameQuestion(text)) return { previousOnly: false };
  if (/\b(?:client|child|son|daughter|umwana)\b/.test(text)) return null;
  const previousChat = /(?:previous|earlier|old|last) (?:chat|conversation)|(?:ikiganiro|kiganiro) (?:cyabanje|gishize)|(?:nabanje|nakubwiye)|conversation pr[eé]c[eé]dente/.test(text);
  const clarification = /\b(?:i mean|i meant|the one|told (?:you|u)|the name|mbivuze|ndashaka kuvuga|je parle)\b/.test(text);
  const recent = history.slice(-6);
  const lastUser = [...recent].reverse().find(item => item.sender === 'user');
  const lastAssistant = [...recent].reverse().find(item => item.sender === 'ai');
  const nameTopic = lastAssistant?.memoryKind === 'name'
    || Boolean(lastUser && (directNameQuestion(normalizedText(lastUser.content || '')) || nameComparisonQuestion(normalizedText(lastUser.content || '')) || /\b(?:the name|my name)\b/.test(normalizedText(lastUser.content || ''))));
  if (nameTopic && nameComparisonQuestion(text)) return { previousOnly: false, compareNames: true };
  const namesMentioned = /\b(?:my name|the name|izina|mon nom)\b/.test(text);
  if (previousChat && (namesMentioned || clarification && nameTopic)) return { previousOnly: true };
  if (clarification && nameTopic && /\b(?:one|name|izina|nom)\b/.test(text)) return { previousOnly: true };
  return null;
}

/** Recover only explicit first-person names from this account's saved user messages. */
export function recoverNameFromMessages(input, records, uid, id = () => crypto.randomUUID()) {
  const memory = normalizeMemory(input);
  if (!memory.enabled || !memory.recoverPreviousName || memory.items.some(item => item.kind === 'name')) return memory;
  let candidate = normalizeMemory(null);
  let changed = false;
  const ownMessages = records.filter(item => item?.sender === 'user' && item.user_id === uid && typeof item.content === 'string')
    .sort((a, b) => (Date.parse(a.created_at) || 0) - (Date.parse(b.created_at) || 0));
  for (const item of ownMessages) {
    const next = captureMemory(candidate, item.content, id);
    if (next.items.some(saved => saved.kind === 'name') || next.useProfileName !== candidate.useProfileName || next.items.length !== candidate.items.length) changed = true;
    // Do not backfill arbitrary notes or case details from history.
    candidate = { ...next, items: next.items.filter(saved => saved.kind === 'name') };
  }
  const name = candidate.items.find(item => item.kind === 'name');
  if (name) return { ...memory, items: [name, ...memory.items.filter(item => item.kind !== 'name')] };
  if (changed && !candidate.useProfileName) return { ...memory, useProfileName: false, recoverPreviousName: false };
  return memory;
}

/** Read this app's existing chat APIs; never send recovered values to a model. */
export async function recoverPreviousChatName({ memory, uid, sessions, fetchMessages, signal }) {
  const current = normalizeMemory(memory);
  if (!current.enabled || !current.recoverPreviousName || current.items.some(item => item.kind === 'name')) return { memory: current, status: 'skipped' };
  const owned = sessions.filter(session => session.user_id === uid).slice(0, 25);
  const records = [];
  let failed = false;
  for (let offset = 0; offset < owned.length; offset += 4) {
    signal?.throwIfAborted();
    const results = await Promise.allSettled(owned.slice(offset, offset + 4).map(session => fetchMessages(session.id, signal)));
    signal?.throwIfAborted();
    for (const result of results) {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) records.push(...result.value);
      else failed = true;
    }
  }
  // An unread newer message could contain a correction or a forget request.
  return { memory: failed ? current : recoverNameFromMessages(current, records, uid), status: failed ? 'partial' : 'checked' };
}

/** Personal lookups are answered locally, without a model request or personal-data upload. */
function browserMemoryReply(message, input, profileName, persistent = true, history = [], lookupStatus = 'unchecked') {
  const memory = normalizeMemory(input);
  const text = normalizedText(message);
  const language = /^(?:fungura|zimya|ese|none se|nonese|uzi|waba|uribuka|nitwa|izina|amazina|nyita|ibuka|ujye|ibagirwa|uranyibuka|unyibuka|ndashaka|nshaka|mbivuze|nashatse|nkora|niga|umushinga|intego|nkunda|ntuye|mba|nzi|mvuga|numva|nshishikajwe|mfite|irindi)\b/.test(text) ? 'rw'
    : (/^o[uù](?:\s|$)/.test(text) || /^(?:active|d[eé]sactive|tu|vous|comment|quel|quelle|quels|quelles|que|je m'appelle|j'ai deux noms|pourquoi deux noms|appelle|souviens|oublie)\b/.test(text)) ? 'fr' : 'en';
  const nameQuestion = nameRecallRequest(message, history);
  const control = memoryControl(message);
  if (control) {
    const on = control.value;
    const automatic = control.field === 'autoSave';
    const reply = language === 'rw' ? (on ? 'Memory irafunguye.' : 'Memory irazimye; amakuru yari abitswe ntayasibwe.')
      : language === 'fr' ? (on ? 'La mémoire est activée.' : 'La mémoire est désactivée ; les détails enregistrés sont conservés.')
      : automatic ? (on ? 'Automatic saving is on. Saved memory must also be enabled to capture details.' : 'Automatic saving is off. Explicit “Remember that…” requests still work when memory is enabled.')
      : on ? 'Saved memory is on. Automatic saving follows its existing setting.' : 'Saved memory is off. Existing details are kept; use “Forget everything about me” to clear them.';
    return { language, kind: 'control', reply };
  }
  const name = memory.enabled ? memory.items.find(item => item.kind === 'name')?.value || (memory.useProfileName && typeof profileName === 'string' ? profileName.slice(0, 80) : '') : '';
  const factCategory = factRecallCategory(text);
  if (factCategory) {
    const facts = memory.enabled ? memory.items.filter(item => item.kind === 'note' && (item.category === factCategory || factCategory === 'constraints' && memoryCategoryMatches(item.category, factCategory))) : [];
    const heading = language === 'rw' ? 'Wambwiye ibi:' : language === 'fr' ? 'Vous m’avez dit :' : 'You told me:';
    const missing = language === 'rw' ? 'Nta makuru mfite kuri ibyo muri memory. Ushobora kumbwira icyo ushaka ko nibuka.' : language === 'fr' ? 'Je n’ai pas ce détail en mémoire. Dites-moi ce que vous souhaitez que je retienne.' : 'I don’t have that detail in saved memory yet. Tell me what you’d like me to remember.';
    return { language, kind: 'fact', reply: facts.length ? `${heading}\n\n${facts.map(fact => '> ' + escapeMarkdown(fact.value)).join('\n\n')}` : missing };
  }
  if (nameQuestion) {
    if (nameQuestion.compareNames) {
      // A follow-up is not an introduction or evidence of a second legal name.
      const saved = memory.enabled ? memory.items.find(item => item.kind === 'name')?.value : '';
      const account = memory.enabled && memory.useProfileName && typeof profileName === 'string' ? profileName.trim().slice(0, 80) : '';
      const labels = language === 'rw' ? ['Izina wambwiye', 'Izina riri kuri konti']
        : language === 'fr' ? ['Le nom que vous m’avez donné', 'Le nom affiché sur votre compte']
        : ['The name you told me', 'Your account display name'];
      const values = [saved && `${labels[0]}: **${escapeMarkdown(saved)}**.`, account && `${labels[1]}: **${escapeMarkdown(account)}**.`].filter(Boolean);
      const different = saved && account && normalizedText(saved) !== normalizedText(account);
      const explanation = language === 'rw'
        ? different ? 'Aya mazina aratandukanye. Sinzi niba ari amazina yawe yose. Ushaka ko nkwita irihe?' : 'Sinzi irindi zina ryawe cyangwa niba iri ari izina ryawe ryose. Wambwira izina ushaka ko nkoresha?'
        : language === 'fr'
          ? different ? 'Ces deux noms sont différents. Je ne sais pas s’ils constituent votre nom complet. Quel nom souhaitez-vous que j’utilise ?' : 'Je ne connais pas d’autre nom ni votre nom complet. Quel nom souhaitez-vous utiliser ?'
          : different ? 'Those are two different name entries. I don’t know whether either is your full name. What would you like me to call you?' : 'I don’t have a separate second name or a confirmed full name. What name would you like me to use?';
      return { language, kind: 'name', reply: [...values, explanation].join('\n\n') };
    }
    const preferred = memory.items.some(item => item.kind === 'name');
    if (nameQuestion.previousOnly && !preferred) {
      const unavailable = lookupStatus === 'partial' || lookupStatus === 'failed';
      const reply = language === 'rw'
        ? unavailable ? 'Sinashoboye kugenzura ibiganiro byawe byabanje byose. Ongera ugerageze nyuma; sinshaka gukeka izina wambwiye.' : 'Mu makuru nabonye, nta zina wambwiye ryabitswe. Izina ryo kuri konti rishobora kuba ritandukanye. Wambwira izina ushaka ko nkoresha?'
        : language === 'fr'
          ? unavailable ? 'Je n’ai pas pu vérifier tous les anciens chats. Réessayez ; je ne veux pas deviner votre nom.' : 'Je n’ai pas trouvé de nom que vous avez donné dans les détails disponibles. Le nom du compte peut être différent. Quel nom souhaitez-vous utiliser ?'
          : unavailable ? 'I couldn’t finish checking your earlier chats. Please try again; I don’t want to guess the name you told me.' : 'I couldn’t find a name you gave me in the available saved details. Your account name may be different. What name would you like me to use?';
      return { language, reply, kind: 'name' };
    }
    const safeName = escapeMarkdown(name);
    if (useKnownName(text) && name) return { language, kind: 'name', reply: language === 'rw'
      ? `Yego, **${safeName}**.${preferred ? '' : ' Ni izina riri kuri konti yawe.'}`
      : language === 'fr' ? `Bien sûr, **${safeName}**.${preferred ? '' : ' C’est le nom affiché sur votre compte.'}`
      : `Of course, **${safeName}**.${preferred ? '' : ' That’s the name displayed on your account.'}` };
    return { language, kind: 'name', reply: language === 'rw'
      ? name ? `${preferred ? 'Wambwiye ko witwa' : 'Kuri konti yawe handitse'} **${safeName}**.` : 'Ntabwo mfite izina ryawe. Wambwira uko witwa?'
      : language === 'fr'
        ? name ? `${preferred ? 'Vous m’avez dit vous appeler' : 'Le nom affiché sur votre compte est'} **${safeName}**.` : 'Je n’ai pas votre nom. Comment souhaitez-vous que je vous appelle ?'
        : name ? `${preferred ? 'You told me your name is' : 'Your account display name is'} **${safeName}**.` : 'I don’t have your name yet. What would you like me to call you?' };
  }
  if (/^(?:what do you remember about me|what have you saved about me|do (?:you|u) remember me|(?:ese )?(?:uranyibuka|unyibuka)|ni iki (?:unyibukaho|wibuka kuri njye)|tu te souviens de moi)$/.test(text)) {
    const values = memory.enabled ? [...(name ? [name] : []), ...memory.items.filter(item => item.kind === 'note').map(item => item.value)] : [];
    const heading = language === 'rw' ? 'Dore amakuru mfite:' : language === 'fr' ? 'Voici ce que j’ai en mémoire :' : 'Here’s what I have saved:';
    const empty = language === 'rw' ? 'Nta makuru mfite muri memory. Wambwira uko witwa cyangwa icyo ushaka ko nibuka.' : language === 'fr' ? 'Je n’ai pas de détails enregistrés. Dites-moi ce que vous souhaitez que je retienne.' : 'I don’t have any saved details. Tell me your name or what you’d like me to remember.';
    return { language, reply: values.length ? `${heading}\n\n${values.map(value => '- ' + escapeMarkdown(value)).join('\n')}` : empty };
  }
  if ((/(?:another|new|different) (?:chat|conversation)|mu (?:kindi|gishya) kiganiro|muyindi chat|mu yindi chat|autre conversation/.test(text) && /remember|know my name|memory|izina|unyibuka|uranyibuka|wibuka|souviendra/.test(text))
      || /\bmemory\b/.test(text) && /\b(?:nshaka|ndashaka|want|enable|how)\b/.test(text)) {
    const reply = !memory.enabled
      ? { rw: 'Memory irazimye. Andika "Fungura memory" kugira ngo amakuru akomeze gukoreshwa mu biganiro bishya.', fr: 'La mémoire est désactivée. Dites "Active la mémoire" pour réutiliser vos détails.', en: 'Memory is off. Say "Enable memory" to reuse details across chats.' }[language]
      : persistent
        ? { rw: 'Yego. Izina n’amakuru wansabye kubika bizakomeza kuboneka mu biganiro bishya kuri iyi konti muri iyi browser. Andika "Ni iki unyibukaho?" kugira ngo ubisuzume, cyangwa "Ibagirwa byose" kugira ngo ubisibe.', fr: 'Oui. Vos détails enregistrés restent disponibles dans les nouveaux chats de ce compte, dans ce navigateur. Dites "Tu te souviens de moi ?" pour les consulter, ou "Oublie tout" pour les supprimer.', en: 'Yes. Your saved name and notes remain available in new chats for this account in this browser. Ask "What do you remember about me?" to review them, or say "Forget everything about me" to clear them.' }[language]
        : { rw: 'Amakuru aribukwa mu gihe iyi paji ifunguye gusa; browser yanze kuyabika.', fr: 'Les détails restent disponibles seulement tant que cette page est ouverte : le stockage du navigateur est indisponible.', en: 'Details are remembered while this page is open, but browser storage is unavailable, so they won’t survive a refresh.' }[language];
    return { language, reply };
  }
  if (/^(?:forget (?:my name|everything(?: you remember)?(?: about me)?)|ibagirwa (?:izina ryanjye|byose)|oublie (?:mon nom|tout))$/.test(text) || forgottenCategory(message)) {
    return { language, reply: { rw: 'Nabisibye muri memory. Ibiganiro byabanje ntibyasibwe.', fr: 'C’est supprimé de la mémoire. Les anciens chats ne sont pas effacés.', en: 'Removed from saved memory. Existing chat messages haven’t been deleted.' }[language] };
  }
  if (/^(?:please\s+)?(?:remember\b|ibuka\b|ujye wibuka\b|souviens-toi\b)/.test(text)) {
    const requested = message.trim().replace(/^(?:please\s+)?(?:remember (?:that\s+)?|ibuka (?:ko\s+)?|ujye wibuka (?:ko\s+)?|souviens-toi (?:que\s+)?)/i, '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 240);
    const saved = memory.enabled && (memory.items.some(item => item.kind === 'note' && item.value === requested)
      || memory.items.some(item => item.kind === 'name' && captureMemory(null, requested).items.some(saved => saved.kind === 'name' && saved.value === item.value)));
    return { language, reply: saved
      ? { rw: persistent ? 'Nabibitse muri memory y’iyi browser. Andika "Ni iki unyibukaho?" kugira ngo ubisuzume.' : 'Ndabyibuka kuri iyi paji gusa; browser yanze kubibika.', fr: persistent ? 'C’est enregistré dans ce navigateur. Dites "Tu te souviens de moi ?" pour le consulter.' : 'Je le retiens sur cette page seulement ; le stockage est indisponible.', en: persistent ? 'Saved in this browser. Ask "What do you remember about me?" to review it.' : 'Remembered on this page only; browser storage is unavailable.' }[language]
      : { rw: 'Ntabwo nabibitse. Reba niba memory ifunguye; ntibika amagambo y’ibanga cyangwa indangamuntu.', fr: 'Ce n’est pas enregistré. Vérifiez que la mémoire est activée ; elle ne conserve pas les identifiants sensibles.', en: 'That wasn’t saved. Check that memory is enabled; credentials and identity numbers aren’t saved here.' }[language] };
  }
  if (/^(?:my name is|call me|you can call me|nitwa|izina ryanjye ni|nyita|je m'appelle|appelle[- ]moi)\s+[\p{L}\p{M} '\u2019-]{1,80}$/u.test(text)) {
    const proposedName = captureMemory(null, message).items.find(item => item.kind === 'name')?.value;
    const storedName = memory.enabled ? memory.items.find(item => item.kind === 'name')?.value : null;
    if (!proposedName || proposedName !== storedName) return { language, reply: { rw: 'Ntabwo nabibitse muri memory. Ushobora kuyifungura cyangwa ukambwira uti “Ibuka ko nitwa…” kugira ngo izina ribikwe.', fr: 'Ce nom n’a pas été enregistré. Activez la mémoire ou demandez explicitement de le retenir.', en: 'That name wasn’t saved. Enable automatic memory or say “Remember that my name is…” to save it explicitly.' }[language] };
    const safeName = escapeMarkdown(storedName);
    return { language, reply: { rw: `Ndabyumvise, **${safeName}**. ${persistent ? 'Nabibitse muri iyi browser.' : 'Ndabyibuka kuri iyi paji gusa.'}`, fr: `D’accord, **${safeName}**. ${persistent ? 'C’est enregistré dans ce navigateur.' : 'Je le retiens sur cette page seulement.'}`, en: `Got it, **${safeName}**. ${persistent ? 'Saved in this browser.' : 'Remembered on this page only.'}` }[language] };
  }
  return null;
}

export function localMemoryReply(message, input, profileName, persistent = true, history = [], lookupStatus = 'unchecked', storage = 'browser') {
  const result = browserMemoryReply(message, input, profileName, persistent, history, lookupStatus);
  if (!result || storage !== 'account' || !persistent) return result;
  return { ...result, reply: result.reply
    .replace(/this browser/gi, 'your account database')
    .replace(/muri memory y’iyi browser|muri iyi browser|muri memory y'iyi browser/g, 'muri memory ya konti yawe')
    .replace(/dans ce navigateur/g, 'dans la base de données de votre compte') };
}
