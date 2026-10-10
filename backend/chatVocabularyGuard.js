import { forceTakingTerms, vocabularyContext, vocabularySources } from './legalVocabulary.js';
import { conversationCorrection } from './chatCorrection.js';

export function needsVocabularyReview(message, history = []) {
  return Boolean(conversationCorrection(message, history)) || vocabularyContext(message, history).some(entry => entry.colloquial || ['rape', 'child_defilement', 'gender_based_violence', 'sexual_harassment'].includes(entry.topic));
}

/** Narrow regression check for the observed scamming -> assault mistranslation. */
export function wrongFraudMeaning(message, history, reply) {
  const context = vocabularyContext(message, history);
  if (!context.some(entry => entry.usageSource === vocabularySources.colloquialFraud || entry.usageSource === vocabularySources.guteka)) return false;
  const text = reply.replace(/```[\s\S]*?```|`[^`\n]+`|https?:\/\/\S+/g, '').replace(/[*_`]/g, '');
  if (conflictingDefinition(reply, meaningRules[0], context)) return true;
  const statements = text.split(/[\n.!?]+/);
  if (context.some(entry => entry.topic !== 'fraud')) return false;
  const fraud = /\b(?:ubutekamutwe|uburiganya|ubwambuzi bushukana|fraud\w*|scam\w*|swindl\w*|escroquerie)\b/i.test(text);
  const injury = statements.some(line => /\b(?:assault|battery|gukubita|gukomeretsa|ibikomere|bodily injury)\b/i.test(line)
    && !/\b(?:not|isn't|si|ntabwo|ntibivuga|pas)\b/i.test(line));
  return injury && !fraud;
}

export function safeFraudMeaningReply(language) {
  const source = vocabularySources.fraud;
  if (language === 'rw') return `Hano, **gutubura** bivuga **ubutekamutwe cyangwa ubwambuzi bushukana**: gushuka umuntu kugira ngo umwambure amafaranga cyangwa undi mutungo.

Mu bisobanuro bya [RIB ku bwambuzi bushukana](${source}), iyi migirire ihuzwa no kwihesha ikintu cy’undi hakoreshejwe uburiganya. Icyaha kigomba guhamishwa n’urukiko.

Sinashoboye kugenzura amategeko agezweho n’igihano kijyanye n’ikibazo cyawe. Ibihano bigomba gushakwa mu nyandiko y’itegeko ikurikizwa, hashingiwe ku byabaye.`;
  if (language === 'fr') return `Dans ce contexte, **gutubura** signifie **escroquer ou arnaquer quelqu’un**, notamment pour obtenir son argent ou ses biens par tromperie.

[L’explication du RIB](${source}) relie cette conduite à l’obtention frauduleuse du bien d’autrui. La culpabilité doit être établie par un tribunal.

Je n’ai pas pu vérifier le droit actuel ni la peine applicable à votre situation. Il faut consulter le texte en vigueur et les faits pertinents.`;
  return `Here, **gutubura means scamming or swindling someone** to obtain money or property through deception.

[RIB’s explanation of deceptive taking of property](${source}) connects this conduct with obtaining another person’s property by fraud. Guilt must be established by a court.

I couldn’t verify current law or the penalty for your situation. Those require the applicable legal text and relevant facts.`;
}

// Positive definition conflicts only. These rules are not a general factual/legal verifier.
const meaningRules = [
  { id: 'fraud', source: vocabularySources.fraud, terms: /\b(?:gutubur\w*|guteka umutwe)\b/i, wrong: /\b(?:assault|battery|agression|gukubita|gusambura)\b/i,
    meaning: { rw: 'Gutubura cyangwa gutekera umutwe, muri iyi mvugo, bivuga ubutekamutwe cyangwa ubwambuzi bushukana; si ugukubita umuntu.', en: 'Gutubura or guteka/gutekera umutwe in this usage concerns scamming or swindling through deception, distinct from physical assault.', fr: 'Gutubura ou guteka/gutekera umutwe, dans cet usage, renvoie à l’escroquerie par tromperie, distincte de l’agression physique.' } },
  { id: 'gin', source: vocabularySources.kanyanga, terms: /\bkanyanga\b/i, wrong: /\b(?:cannabis|marijuana|heroin\w*|héroïne|urumogi|khat)\b/i,
    meaning: { rw: 'Kanyanga ni inzoga y’inkorano; si urumogi cyangwa heroin.', en: 'Kanyanga is a local name for crude gin, distinct from cannabis and heroin.', fr: 'Kanyanga désigne un gin artisanal, distinct du cannabis et de l’héroïne.' } },
  { id: 'khat', source: vocabularySources.khat, terms: /\b(?:mayirungi|miraa|khat)\b/i, wrong: /\b(?:cannabis|marijuana|heroin\w*|héroïne|urumogi)\b/i,
    meaning: { rw: 'Mayirungi, miraa na khat ni amazina y’ikimera kimwe; si urumogi cyangwa heroin.', en: 'Mayirungi, miraa and khat name the same plant; they are distinct from cannabis and heroin.', fr: 'Mayirungi, miraa et khat désignent la même plante, distincte du cannabis et de l’héroïne.' } },
  { id: 'heroin', source: vocabularySources.heroin, terms: /\bmugo\b/i, wrong: /\b(?:cannabis|marijuana|urumogi|khat|mayirungi)\b/i,
    meaning: { rw: 'Mu mvugo yerekeye ibiyobyabwenge, mugo bivuga heroin. Ntibivuga urumogi cyangwa mayirungi.', en: 'In substance-related usage, mugo means heroin, distinct from cannabis or khat. A person’s name has a different context.', fr: 'Dans ce contexte de substances, mugo désigne l’héroïne, distincte du cannabis ou du khat. Un nom de personne relève d’un autre contexte.' } },
  { id: 'brews', source: vocabularySources.localBrews, terms: /\b(?:muriture|bareteta|i[bg]ikwangari)\b/i, wrong: /\b(?:cannabis|marijuana|heroin\w*|héroïne|urumogi|khat)\b/i,
    meaning: { rw: 'Muriture, bareteta n’ibikwangari ni amazina y’inzoga z’inkorano zivugwa mu makuru ya Polisi; si amazina y’urumogi cyangwa heroin.', en: 'Muriture, bareteta and ibikwangari are local brew names in Police reporting, distinct from cannabis and heroin.', fr: 'Muriture, bareteta et ibikwangari sont des noms locaux de boissons artisanales dans les rapports de la Police, distinctes du cannabis et de l’héroïne.' } },
  { id: 'smuggling', source: vocabularySources.smuggling, terms: /\bmagendu\b/i, wrong: /\b(?:counterfeit|fake products?|contrefaçon|ibihimbano|mpimbano)\b/i,
    meaning: { rw: 'Magendu bivuga ibicuruzwa byinjijwe mu buryo butemewe n’amategeko. Ntibivuga ko ibyo bicuruzwa byose ari ibihimbano.', en: 'Magendu refers to smuggling or smuggled goods. Smuggled goods are not necessarily counterfeit.', fr: 'Magendu renvoie à la contrebande ou aux marchandises de contrebande. Elles ne sont pas nécessairement contrefaites.' } },
  { id: 'routes', source: vocabularySources.smuggling, terms: /\bpanya\b/i, wrong: /\b(?:rats?|rodents?|imbeba)\b/i,
    meaning: { rw: 'Mu mvugo yerekeye imipaka na magendu, inzira za panya ni inzira zikoreshwa mu kwambuka umupaka mu buryo butemewe. Indi mvugo ishobora kugira ikindi gisobanuro.', en: 'In this border/smuggling context, panya refers to unofficial border routes. Animal-related usage is a different sense.', fr: 'Dans ce contexte de frontière et de contrebande, panya désigne des passages non officiels; le sens lié aux animaux est différent.' } },
  { id: 'vendors', source: vocabularySources.vendors, terms: /\b(?:abazunguzayi|umuzunguzayi)\b/i, wrong: /\b(?:thieves|thief|criminals?|voleurs?|criminels?|abajura|umujura)\b/i,
    meaning: { rw: 'Abazunguzayi ni abacuruzi bo mu muhanda. Iri zina ubwaryo ntirivuga ko ari abajura cyangwa ko bahamwe n’icyaha.', en: 'Abazunguzayi means street vendors or hawkers. The label alone does not mean thieves or establish guilt.', fr: 'Abazunguzayi désigne des vendeurs de rue. Cette appellation ne signifie pas voleurs et n’établit aucune culpabilité.' } },
  { id: 'drink', source: vocabularySources.ibyuma, terms: /\bibyuma\b/i, wrong: /\b(?:metal|steel|tools?|equipment|métal|outils?|ibyuma byo gusudira)\b/i,
    meaning: { rw: 'Hano, mu mvugo yerekeye inzoga, ibyuma ni izina rikoreshwa kuri zimwe mu nzoga zitujuje ubuziranenge. Ibyuma nk’ibikoresho ni ikindi gisobanuro.', en: 'Here, in beverage context, ibyuma is a local name used for certain substandard alcoholic drinks. Metal or equipment is a different sense.', fr: 'Ici, dans le contexte des boissons, ibyuma désigne certaines boissons alcoolisées non conformes. Le métal ou les outils constituent un autre sens.' } },
  { id: 'tether', source: vocabularySources.ikiziriko, terms: /\bikiziriko\b/i, wrong: /\b(?:rope|tether|umugozi|corde)\b/i,
    meaning: { rw: 'Hano, mu kibazo cya Girinka n’amafaranga asabwa, ikiziriko ni izina rivugwa ku mafaranga yatswe kugira ngo umuntu ahabwe inka. Ibivugwa bigomba gusuzumwa; umugozi w’inka ni ikindi gisobanuro.', en: 'In this Girinka payment complaint, ikiziriko refers to an allegedly demanded unofficial payment. A literal cattle tether is another sense, and the allegation still requires investigation.', fr: 'Dans cette plainte concernant un paiement lié à Girinka, ikiziriko désigne un paiement officieux prétendument exigé. La corde d’un animal est un autre sens; les faits restent à établir.' } },
  { id: 'media', source: vocabularySources.giti, terms: /\bgiti\b/i, wrong: /\b(?:tree|arbre|igiti)\b/i,
    meaning: { rw: 'Mu mvugo yerekeye itangazamakuru, GITI ivugwa ku mafaranga ahabwa umunyamakuru kugira ngo agire icyo ahindura mu gutangaza amakuru. Amafaranga y’urugendo asanzwe n’igisobanuro cy’igiti biratandukanye.', en: 'In the documented media context, GITI refers to payment conditioning news coverage. Ordinary transport reimbursement and a tree are different meanings.', fr: 'Dans le contexte médiatique documenté, GITI renvoie à un paiement conditionnant la couverture journalistique. Un remboursement normal de transport ou un arbre relèvent d’autres sens.' } },
  { id: 'favouritism', source: vocabularySources.favouritism, terms: /\b(?:ikimenyane|itonesha|gutonesha)\b/i, wrong: /\b(?:paying a bribe|cash bribe|amafaranga ya ruswa|payer un pot-de-vin)\b/i,
    meaning: { rw: 'Ikimenyane mu gutanga akazi cyangwa serivisi kivuga gutonesha umuntu kubera abo aziranye na bo. Ibi ubwabyo ntibisobanura ko habayeho gutanga amafaranga ya ruswa.', en: 'In recruitment or service decisions, ikimenyane concerns favouritism through connections. It does not by itself mean paying a cash bribe.', fr: 'Dans le recrutement ou les services, ikimenyane concerne le favoritisme lié aux relations. Cela ne signifie pas, à lui seul, verser un pot-de-vin.' } },
  { id: 'personal_threat', source: vocabularySources.impersonation, terms: /\b(?:iterabwoba|gutera ubwoba|gukangisha)\b/i, wrong: /\b(?:terrorism|terrorisme|ubwihebe)\b/i,
    when: text => /\b(?:amafaranga|money|muhe|umuturanyi|neighbor|neighbour|yankangish\w*)\b/i.test(text) && !/\b(?:terror\w*|ubwihebe|igisasu|bomb\w*|militant\w*)\b/i.test(text),
    meaning: { rw: 'Hano, iterabwoba cyangwa gukangisha bivuga gutera umuntu ubwoba. Gusaba amafaranga hakoreshejwe ibikangisho bigomba gusuzumwa hashingiwe ku byabaye; ntibihita biba ibyaha by’ubwihebe.', en: 'Here, the wording concerns personal threats or intimidation. Demanding money through threats requires examining the facts; it does not automatically establish terrorism.', fr: 'Ici, il s’agit de menaces ou d’intimidation personnelles. Exiger de l’argent sous la menace nécessite d’examiner les faits; cela n’établit pas automatiquement le terrorisme.' } },
  { id: 'rape', topics: ['rape'], source: vocabularySources.sexualTerms, slashDefinition: true,
    terms: new RegExp(`(?:${forceTakingTerms.source}|\\b(?:gusambanya\\s+ku\\s+gahato|gukoresha\\s+(?:undi|umuntu)\\s+imibonano\\s+mpuzabitsina\\s+ku\\s+gahato|rape(?:d|s)?|viol)\\b)`, 'i'),
    wrong: /\b(?:robbery|theft|stealing|ubujura|kwiba|vol(?:er)?|braquage|assault with force|gukubita)\b/i,
    meaning: { rw: 'Mu mvugo yerekeye ihohotera rishingiye ku gitsina, gufata ku ngufu bivuga gukoresha undi imibonano mpuzabitsina ku gahato (rape); si ubujura. Gufata umuntu ukoresheje imbaraga mu gihe cyo kumuta muri yombi ni ikindi gisobanuro kigomba gutandukanywa n’iki.', en: 'In sexual-offence usage, gufata ku ngufu means rape: non-consensual sexual acts. It does not mean robbery. Literal use of force during an arrest is a different context. When a child is involved, the relevant child-protection provisions must also be checked.', fr: 'Dans le contexte des infractions sexuelles, gufata ku ngufu signifie viol : des actes sexuels sans consentement. Cela ne signifie pas vol. L’usage littéral de la force lors d’une arrestation relève d’un autre contexte.' } },
  { id: 'child_defilement', topics: ['child_defilement'], source: vocabularySources.law, terms: /\bgusambanya\s+(?:umwana|abana)\b/i, wrong: /\b(?:adultery|adult consensual sex|consensual adult sex|adultère|ubusambanyi bw[' ]abakuru)\b/i,
    meaning: { rw: 'Gusambanya umwana bivuga icyaha gikorerwa umwana; mu nyandiko y’itegeko yasuzumwe byitwa child defilement mu Cyongereza. Si imibonano y’abantu bakuru babyumvikanyeho.', en: 'Gusambanya umwana refers to child defilement or sexual abuse of a child. It is distinct from consensual intercourse between adults.', fr: 'Gusambanya umwana renvoie au viol sur enfant ou aux abus sexuels sur un enfant, distincts des rapports consentis entre adultes.' } },
  { id: 'gender_based_violence', topics: ['gender_based_violence'], source: vocabularySources.genderViolence, terms: /\bihohoter(?:a|wa)\s+rishingiye\s+ku\s+gitsina\b/i, wrong: /\b(?:only rape|always rape|rape only|uniquement (?:le )?viol|gufata ku ngufu gusa)\b/i,
    meaning: { rw: 'Ihohotera rishingiye ku gitsina ni imvugo yagutse; ntirisobanura gusa gufata ku ngufu. Uburyo ryakozwemo ni bwo bugomba gusuzumwa.', en: 'Ihohotera rishingiye ku gitsina means gender-based violence, a broader category than rape. The particular conduct must be identified.', fr: 'Ihohotera rishingiye ku gitsina signifie violence basée sur le genre, une catégorie plus large que le viol. Il faut identifier les actes précis.' } },
  { id: 'sexual_harassment', topics: ['sexual_harassment'], source: vocabularySources.law,
    terms: /\b(?:guhoza\s+(?:undi\s+)?(?:muntu\s+)?ku\s+nke(?:nke|ke)\s+(?:bifitanye\s+isano\s+n[' ]imibonano\s+mpuzabitsina|y[' ]imibonano\s+mpuzabitsina)|sexual harassment|harcèlement sexuel)\b/i,
    wrong: /\b(?:rape|robbery|viol|ubujura|gufata\s+ku\s*ngufu)\b/i,
    meaning: { rw: 'Guhoza undi ku nkeke bifitanye isano n’imibonano mpuzabitsina bivuga sexual harassment. Igikorwa ubwacyo kigomba gusuzumwa; iyi mvugo ntisobanura ubujura cyangwa gufata ku ngufu.', en: 'This expression means sexual harassment. It is distinct from rape and robbery; the facts determine the applicable offence.', fr: 'Cette expression signifie harcèlement sexuel, distinct du viol et du vol. Les faits déterminent l’infraction applicable.' } },
];

function conflictingDefinition(reply, rule, context) {
  const text = reply.replace(/```[\s\S]*?```|`[^`\n]+`|https?:\/\/\S+/g, '').replace(/[*_`]/g, '');
  const separators = rule.slashDefinition ? '[:|/–-]' : '[:|–-]';
  const definition = new RegExp(`${rule.terms.source}\\s*(?:\\(([^)]{1,120})\\)|(?:${separators}|(?:means?|is|are|refers to|bivuga|bisobanura|ni|signifie|désigne|est|sont)\\b)\\s+([^\\n.!?;]{1,120}))`, 'gi');
  for (const match of text.matchAll(definition)) {
    const framing = text.slice(Math.max(0, match.index - 90), match.index).split(/[\n.!?;]/).at(-1);
    if (/\b(?:(?:incorrect|wrong|false|mistaken) (?:claim|definition|translation|statement|interpretation)|(?:mistakenly|incorrectly|falsely) (?:said|called|wrote|claimed|described)|misconception|(?:affirmation|traduction|définition) (?:erronée|incorrecte)|ordinary meaning|literal meaning|outside (?:this|media|border))\b/i.test(framing)) continue;
    const predicate = match[1] || match[2];
    const bad = predicate.match(rule.wrong);
    if (!bad) continue;
    const before = predicate.slice(0, bad.index);
    if (/\b(?:not|isn't|aren't|unlike|rather than|distinct from|different from|distincte? (?:du|de|des)|différent(?:e)? (?:du|de|des)|whereas|while|naho|tandis que|alors que|si|ntabwo|ntibivuga|pas|non|sans|can|may|might|sometimes|ishobora|peut|parfois|or|cyangwa|ou)\b/i.test(before)) continue;
    // A named group accused of theft can be described without redefining all vendors.
    if (rule.id === 'vendors' && context.some(entry => entry.topic !== 'street_vending')
      && !/means?|refers to|bivuga|bisobanura|signifie|désigne/i.test(match[0])) continue;
    if (/\b(?:some|suspected|alleged|bamwe|bakekwaho|accusés)\b/i.test(before)) continue;
    return true;
  }
  return false;
}

export function vocabularyIssues(message, history = [], reply = '') {
  const context = vocabularyContext(message, history);
  const correction = conversationCorrection(message, history);
  const subjectText = correction ? `${correction.originalQuestion}\n${message}` : message;
  const issues = [];
  if (wrongFraudMeaning(message, history, reply)) issues.push(meaningRules[0]);
  for (const rule of meaningRules) {
    const subject = { fraud: 'gutubura', gin: 'kanyanga', khat: 'mayirungi', heroin: 'mugo', brews: 'muriture', smuggling: 'magendu', routes: 'panya', vendors: 'abazunguzayi', drink: 'ibyuma', tether: 'ikiziriko', media: 'giti', favouritism: 'ikimenyane', personal_threat: 'iterabwoba' }[rule.id];
    const active = context.some(entry => rule.topics?.includes(entry.topic) || ((entry.source === rule.source || entry.usageSource === rule.source) && entry.terms.test(subject))
      || (rule.id === 'fraud' && entry.usageSource === vocabularySources.guteka));
    if (active && (!rule.when || rule.when(subjectText)) && !issues.some(issue => issue.id === rule.id) && conflictingDefinition(reply, rule, context)) issues.push(rule);
  }
  return issues;
}

export function correctedVocabularyReply({ message, history = [], language = 'en', issues }) {
  const correction = conversationCorrection(message, history);
  const acknowledgedError = correction && vocabularyIssues(correction.originalQuestion, [], correction.previousAnswer).length;
  const prefix = acknowledgedError ? ({ rw: 'Nari numvise nabi ibyo wabajije.\n\n', fr: 'J’avais mal compris votre question.\n\n', en: 'I misinterpreted your earlier question.\n\n' }[language] || '') : '';
  if (issues.length === 1 && issues[0].id === 'fraud') {
    const context = vocabularyContext(message, history);
    const label = context.some(entry => entry.usageSource === vocabularySources.colloquialFraud) ? '**gutubura**' : '**guteka/gutekera umutwe**';
    return prefix + safeFraudMeaningReply(language).replace(/\*\*gutubura\*\*/g, label).replace('**gutubura means', `${label.slice(0, -2)} means`);
  }
  const copy = language === 'rw' ? { heading: 'Ibisobanuro byakosowe:', source: 'Inkomoko', limit: 'Izi nyandiko zisobanura imvugo. Icyaha n’igihano bishoboka bigomba kugenzurwa mu mategeko akurikizwa, hashingiwe ku byabaye.' }
    : language === 'fr' ? { heading: 'Sens corrigé :', source: 'Source', limit: 'Ces références documentent le vocabulaire. L’infraction et la peine éventuelles nécessitent de vérifier le droit applicable et les faits.' }
      : { heading: 'Corrected meaning:', source: 'Usage source', limit: 'These references document vocabulary. Any applicable offence or penalty requires checking current law and the facts.' };
  return prefix + copy.heading + '\n\n' + issues.slice(0, 4).map(issue => `${issue.meaning[language] || issue.meaning.en} [${copy.source}](${issue.source})`).join('\n\n') + '\n\n' + copy.limit;
}

/** Exclude only answers known to have mistranslated the preceding user's slang question. */
export function reviewedVocabularyHistory(history = []) {
  const reviewed = [];
  let latestUser = '';
  for (const turn of history) {
    if (turn.sender === 'user') latestUser = turn.content || '';
    if (turn.sender === 'ai' && typeof turn.content === 'string' && vocabularyIssues(latestUser, reviewed, turn.content).length) continue;
    reviewed.push(turn);
  }
  return reviewed;
}
