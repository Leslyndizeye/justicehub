const fold = value => String(value || '').normalize('NFKD').replace(/\p{M}/gu, '').replace(/[‘’]/g, "'").toLowerCase().trim();
const orientationIntents = new Set(['personal_feelings', 'wellbeing']);
const feelingsWords = new Set('i im m am in love loving falling have romantic feelings crush on for with someone somebody a person is it that this legal illegal allowed okay ok wrong against the law to be rwanda rwandan please can you u tell me if'.split(' '));
const exampleWords = new Set('can could would you u please give tell show me us about one an a simple example everyday common commonly often sometimes usually law laws that which people we they break violate ignore likely in rwanda rwandan'.split(' '));

// These narrow, model-free orientations make no finding about a relationship's
// legality, a diagnosis, or a statutory offence. Specific facts need retrieval.
export function everydayQuestionRoute(message, history = []) {
  const text = fold(message);
  if (/\b(?:online|internet|interineti|google|browse)\b/.test(text)) return null;
  const feelings = /\b(?:in love|romantic feelings|falling in love|loving someone|love someone|love somebody|crush on someone)\b/.test(text)
    && (text.match(/[\p{L}\p{N}]+/gu) || []).every(word => feelingsWords.has(word));
  const frenchFeelings = /^(?:je suis amoureux|je suis amoureuse)(?: de quelqu'un)?(?: est ce (?:legal|illegal|permis)(?: au rwanda)?)?[.!?]*$/.test(text.replace(/[-,]/g, ' '));
  const kinyarwandaFeelings = /^(?:nkunda umuntu|ndi mu rukundo)(?: (?:ese )?(?:biremewe|byemewe)(?: mu rwanda)?)?[.!?]*$/.test(text);
  if (feelings || frenchFeelings || kinyarwandaFeelings) return { kind: 'legal', intent: 'personal_feelings' };
  if (/^(?:i think (?:that )?)?(?:i am|i'm|im|i feel) (?:sick|ill|unwell)(?: today)?[.!?]*$/.test(text)
    || /^(?:je suis malade|je me sens malade|ndwaye|ndumva ndwaye)[.!?]*$/.test(text)) return { kind: 'social', intent: 'wellbeing' };
  if (/\blaws?\b/.test(text) && /\bkill\b/.test(text) && /\b(?:sometimes|likely|often|commonly|usually)\b/.test(text)
    && !/\b(?:murder|homicide|self.defen[cs]e|suicide|myself|want to kill|plan to kill|killed|victim)\b|\bkill\s+(?:(?:a|the|my|our|your)\s+)?(?:person|someone|somebody|people|child|man|woman|him|her|them)\b/.test(text)) {
    return { kind: 'unclear', clarification: 'law_wording' };
  }
  const prior = [...history].reverse().find(turn => turn.sender === 'user' && typeof turn.content === 'string');
  const resolvingWording = prior && everydayQuestionRoute(prior.content)?.clarification === 'law_wording'
    && /^(?:the )?(?:first(?: one)?|break(?:ing)?(?: (?:a |the )?law)?|violate(?: (?:a |the )?law)?|i mean break(?: the law)?)[.!?]*$/.test(text);
  const generalExample = /\blaws?\b/.test(text) && /\b(?:break|violate|ignore)\b/.test(text)
    && /\b(?:one|example|everyday|common|commonly|often|sometimes)\b/.test(text)
    && (text.match(/[\p{L}\p{N}]+/gu) || []).every(word => exampleWords.has(word));
  if (resolvingWording || generalExample) return { kind: 'legal', intent: 'legal_example', researchTopic: 'constitution rights privacy' };
  return null;
}

export function orientationRoute(route) { return orientationIntents.has(route?.intent) || Boolean(route?.clarification); }

export function everydayQuestionReply(route, language = 'en') {
  const replies = {
    personal_feelings: {
      en: 'Having romantic feelings does not, by itself, describe a criminal act. If you mean dating, marriage or sexual activity, age, consent and the circumstances matter. Which part worries you?',
      rw: 'Kugira amarangamutima yo gukunda umuntu ubwabyo ntibivuga ko wakoze icyaha. Niba ubaza ku kurambagizanya, gushyingirwa cyangwa imibonano mpuzabitsina, imyaka, ukwemera n’uko ibintu bimeze ni ngombwa. Ni iki kiguhangayikishije?',
      fr: 'Avoir des sentiments amoureux ne décrit pas, en soi, un acte criminel. Pour une relation, un mariage ou des rapports sexuels, l’âge, le consentement et les circonstances comptent. Quel aspect vous inquiète ?',
    },
    wellbeing: {
      en: 'I’m sorry you’re feeling unwell. A healthcare professional can help assess your symptoms. If your question concerns sick leave, access to care or your rights as a patient, tell me what happened and I can help with that.',
      rw: 'Mbabajwe n’uko utameze neza. Umukozi wo mu rwego rw’ubuzima ashobora kugufasha gusuzuma ibimenyetso ufite. Niba ubaza ku kiruhuko cy’uburwayi, kubona ubuvuzi cyangwa uburenganzira bw’umurwayi, mbwira uko ikibazo giteye ngufashe.',
      fr: 'Je suis désolé que vous vous sentiez mal. Un professionnel de santé peut évaluer vos symptômes. Si votre question concerne un congé maladie, l’accès aux soins ou vos droits comme patient, expliquez-moi la situation.',
    },
    law_wording: {
      en: 'Do you mean an example of a law people sometimes break, or a law about killing someone?',
      rw: 'Ushaka urugero rw’itegeko abantu rimwe na rimwe barenga, cyangwa ubaza ku itegeko ryerekeye kwica umuntu?',
      fr: 'Voulez-vous un exemple de loi que des personnes enfreignent parfois, ou une loi concernant le fait de tuer quelqu’un ?',
    },
    relationship_context: {
      en: 'Are you asking about having feelings, dating, marriage, or age and consent? Those are different questions, so I want to understand what worries you.',
      rw: 'Urabaza ku marangamutima, kurambagizanya, gushyingirwa, cyangwa imyaka n’ukwemera? Mbwira icyo ushaka kumenya kugira ngo ngufashe neza.',
      fr: 'Votre question concerne-t-elle les sentiments, une relation, le mariage, ou l’âge et le consentement ? Quel aspect vous inquiète ?',
    },
  };
  const selected = replies[route?.clarification] || replies[route?.intent];
  return selected?.[language] || selected?.en || null;
}
