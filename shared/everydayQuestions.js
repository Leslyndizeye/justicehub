import { questionWording } from './questionWording.js';
import {rwandaLawOverviewQuestion} from './rwandaLawOverview.js';
import {theftComparisonContext} from './theftComparison.js';

const fold = value => String(value || '').normalize('NFKD').replace(/\p{M}/gu, '').replace(/[‘’]/g, "'").toLowerCase().trim();
const orientationIntents = new Set(['personal_feelings', 'wellbeing', 'violence_discussion']);
const feelingsWords = new Set('i im m am in love loving falling have romantic feelings crush on for with someone somebody a person is it that this legal illegal allowed okay ok wrong against the law to be rwanda rwandan please can you u tell me if'.split(' '));
const exampleWords = new Set('can could would you u please give tell show me us about one an a simple example everyday common commonly often sometimes usually law laws that which people we they break violate ignore likely in rwanda rwandan'.split(' '));

// These narrow, model-free orientations make no finding about a relationship's
// legality, a diagnosis, or a statutory offence. Specific facts need retrieval.
export function everydayQuestionRoute(message, history = []) {
  const comparison=theftComparisonContext(message,history);
  if(comparison)return {kind:'legal',intent:'theft_comparison',researchTopic:'theft aggravating circumstances',...(comparison!==message?{context:comparison,answerTask:'explanation'}:{})};
  const text = fold(questionWording(message).normalized);
  if (/\b(?:online|internet|interineti|google|browse)\b/.test(text)) return null;
  if(rwandaLawOverviewQuestion(text))return {kind:'legal',intent:'rwanda_law_overview',researchTopic:'constitution rights equality'};
  // A general ethical discussion is not a request for a statutory charge or
  // penalty. Keep this narrow: personal incidents, threats and legal details
  // must continue through safety handling or source-grounded research.
  if (/^(?:so\s+)?(?:what do (?:you|u) think|what are your thoughts|what is your opinion)\s+(?:about|on|of)\s+(?:(?:a|the)\s+)?(?:person (?:killing|who kills) (?:another person|someone|somebody)|someone killing (?:another person|someone)|murder|homicide|killing (?:someone|another person))[.!?]*$/.test(text)) {
    return { kind: 'legal', intent: 'violence_discussion' };
  }
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
    violence_discussion: {
      en: 'Deliberately taking someone’s life is a grave harm: a life is lost, and families and communities can be deeply affected. But I would not judge a particular person without understanding what happened. A deliberate attack, an accident and an act claimed as self-defence need different legal analysis. Are you asking generally, about the law in Rwanda, or about a real incident?',
      rw: 'Kwambura umuntu ubuzima ubigambiriye ni igikorwa kibi cyane: umuntu arapfa, kandi umuryango we n’abandi bantu bikabagiraho ingaruka zikomeye. Ariko sinacira umuntu urubanza ntazi uko byagenze. Igitero kigambiriwe, impanuka no kuvuga ko umuntu yirwanagaho bisaba gusuzumwa mu buryo butandukanye. Urabaza muri rusange, ku mategeko yo mu Rwanda, cyangwa ku byabaye koko?',
      fr: 'Ôter délibérément la vie à quelqu’un cause un tort immense : une vie est perdue, et les familles comme les communautés peuvent être profondément touchées. Je ne jugerais toutefois pas une personne sans comprendre les faits. Une attaque délibérée, un accident et un acte présenté comme de la légitime défense demandent des analyses juridiques différentes. Votre question est-elle générale, concerne-t-elle le droit rwandais ou un incident réel ?',
    },
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
