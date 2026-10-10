// Retrieval vocabulary, not statutory definitions or a finding that an offence occurred.
// Formal terms were reviewed against the linked primary sources on 2026-10-06.
import { isCorrectionRequest } from './chatCorrection.js';
export const vocabularySources = {
  fraud: 'https://www.rib.gov.rw/updates/news/news-detail/inzego-zumutekano-zahagurukiye-ubwambuzi-bushukana-abagera-kuri-767-babufatiwemo',
  policing: 'https://police.gov.rw/rw/amakuru/amakuru-ya-polisi/news-detail/news/kigali-abakora-irondo-ryumwuga-basabwe-kurangwa-nimyitwarire-myiza-no-gukora-kinyamwuga/',
  forgery: 'https://www.rib.gov.rw/updates/news/news-detail/rib-iributsa-abashinzwe-irangamimerere-gushishoza-mugihe-cyimyandikire-yimyirondoro',
  trafficking: 'https://www.rib.gov.rw/updates/news/news-detail/tumenye-icyaha-cyicuruzwa-ryabantu-nuburyo-bwo-kukirinda',
  law: 'https://www.minijust.gov.rw/fileadmin/user_upload/Minijust/Publications/Laws/Offences_and_penalties_in_general_2018.pdf',
  sexualTerms: 'https://www.rlrc.gov.rw/fileadmin/user_upload/RLRC/Publications/Dictionary_of_Legal_Terms/Dictionary_of_Legal_Terms.pdf',
  rapeUsage: 'https://www.police.gov.rw/media/news-detail/news/abagabo-babiri-bafunzwe-bakekwaho-gufata-kungufu/',
  genderViolence: 'https://www.police.gov.rw/media/news-detail/news/ngoma-abayobozi-bakanguriwe-kurushaho-kurwanya-ihohoterwa-rishingiye-ku-gitsina-nirikorerwa-abana/',
  agriculture: 'https://support.new.irembo.gov.rw/is/support/solutions/articles/47001285906-uko-wasaba-uruhushya-rwo-gutubura-imbuto',
  colloquialFraud: 'https://yegob.rw/wagira-ngo-yabyize-mu-ishuri-iyumvire-amajwi-yumugabo-wagerageje-gutubura-ntibimuhire-maze-agatukana-ibitutsi-nyandagazi-amajwi/',
  guteka: 'https://umuseke.rw/polisi-yafashe-abahanuzi-bava-i-kigali-bakajya-mu-ntara-guteka-umutwe/',
  smuggling: 'https://police.gov.rw/rw/amakuru/amakuru-ya-polisi/news-detail/news/nyagatare-polisi-yafashe-abantu-bane-binjiza-magendu-n-abacuruza-ibiyobyabwenge/',
  kanyanga: 'https://police.gov.rw/media/news-detail/news/kanyanga-distillery-destroyed-in-nyanza/',
  giti: 'https://www.ombudsman.gov.rw/fileadmin/user_upload/ombudsman/documents/Raporo_zikorwa_kuri_Ruswa/Media_and_Corruption_Rwanda_2015.pdf#page=44',
  akantu: 'https://www.police.gov.rw/media/news-detail/news/umugabo-afunzwe-akurikiranweho-kugerageza-guha-ruswa-umuyobozi-wakagari/?cHash=3af0d63a2f7ff4ed3acc000a0ff9cde4&tx_news_pi1%5Baction%5D=detail&tx_news_pi1%5Bcontroller%5D=News',
  corruptionIdioms: 'https://www.minubumwe.gov.rw/index.php?eID=dumpFile&f=67579&t=f&token=30e4f719717b3e8efe52aa5f609acebecd408d4c#page=23',
  ikiziriko: 'https://www.ombudsman.gov.rw/ibindi/rutsiroabaturage-barenga-11500-bitabiriye-gahunda-yo-gukumira-no-kurwanya-akarengane-na-ruswa',
  propertyLoss: 'https://police.gov.rw/media/news-detail/news/polisi-yafashe-ucyekwaho-kwiba-imodoka-akayikuramo-moteri/',
  propertyFraudUsage: 'https://m.imvahonshya.co.rw/rubavu-umwarimu-akurikiranyweho-gucucura-abaturage-nabarimu-akoresheje-uburiganya/',
  vendors: 'https://police.gov.rw/media/news-detail/news/rnp-assumes-lead-role-to-get-vendors-off-the-streets/',
  khat: 'https://police.gov.rw/media/news-detail/news/mayirungi-a-silent-narcotic-destroying-lives/',
  heroin: 'https://police.gov.rw/media/news-detail/news/kigali-over-340kgs-of-seized-narcotics-disposed-of/',
  localBrews: 'https://police.gov.rw/media/news-detail/news/how-western-region-is-combating-illicit-drugs/',
  snatching: 'https://police.gov.rw/media/news-detail/news/gerayo-amahoro-abatwara-moto-basabwe-kubahiriza-parikingi-zashyizweho/',
  impersonation: 'https://www.police.gov.rw/rw/amakuru/amakuru-ya-polisi/news-detail/news/kigali-polisi-yerekanye-abantu-8-bacyekwaho-kwiyitirira-inzego-z-umutekano-no-kwambura-abacuruzi/',
  favouritism: 'https://www.rib.gov.rw/updates/news/news-detail/minisitiri-wubutabera-yasabye-abasoje-amahugurwa-yibanze-yubugenzacyaha-guhangana-nibyaha-bibangamira-ituze-niterambere-ryabaturage',
  concealment: 'https://www.musanze.gov.rw/ibigezweho/inkuru-irambuye/nta-muyobozi-ukwiye-gukingira-ikibaba-abanyabyaha',
  funds: 'https://police.gov.rw/rw/amakuru/amakuru-ya-polisi/news-detail/news/ruhango-abayobozi-binzego-zibanze-bakanguriwe-kwirinda-ruswa-no-kunyereza-ibya-rubanda-binyuzwa/',
  fictitious: 'https://police.gov.rw/uploads/tx_download/UMUTEKANO__No_33.pdf#page=11',
  cyber: 'https://cyber.gov.rw/updates/article/uburyo-bune-4-bwo-kurinda-amakuru-yawe-bwite-kwinjirirwa/',
  phishing: 'https://cyber.gov.rw/updates/article/umutekano-wa-imeli-uburyo-6-bwo-kohereza-kwakira-no-kubika-imeli-mu-mutekano/',
  ibyuma: 'https://police.gov.rw/rw/amakuru/amakuru-ya-polisi/news-detail/news/hakajijwe-ingamba-zo-kurwanya-inzoga-zitujuje-ubuziranenge/?cHash=94c1dd1cbc41946122e91e8c1228119c&tx_news_pi1%5Baction%5D=detail&tx_news_pi1%5Bcontroller%5D=News',
};

// An ambiguous euphemism needs both an official/service setting and a requested benefit.
// Mere gifts, objects, thirst, massage, writing supplies, and people's names are different uses.
const serviceContext = /\b(?:serivisi|service\w*|umuyobozi|abayobozi|umukozi|abakozi|gitifu|akagari|umurenge|polisi|police|official\w*|permit\w*|icyangombwa|ibyangombwa|guhabwa akazi|girinka|gira inka)\b/i;
const benefitContext = /\b(?:amafaranga|mobile money|kwishyur\w*|[a-z]*sab(?:a|ye|wa|we)|gutanga|natanze|batanze|muh(?:e|a)|ump(?:e|a)|kumpa|kuguha|payment\w*|pay\w*|demand\w*|request\w*|give)\b/i;
const digitalContext = /\b(?:konti|amakonti|amakuru|ikoranabuhanga|murandasi|internet|online|imeli|email|whatsapp|facebook|instagram|account\w*|data|password\w*)\b/i;

// Common legal expression, including joined typing and person-object variants.
// Keep the subject/object roles in the original message; this is a topic hint.
export const forceTakingTerms = /\b(?:gufata|gufatu|gufatwa|[a-z]*fat(?:a|wa|we)|[a-z]*fash(?:e|we))\s*(?:(?:umuntu|umugore|umugabo|umukobwa|umwana|abana|abagore|abakobwa|umunyeshuri|undi)\s+)?ku\s*ngufu\b/i;

function literalForceTaking(text, match) {
  const before = text.slice(Math.max(0, match.index - 70), match.index).split(/[.!?\n]/).at(-1);
  const after = text.slice(match.index + match[0].length, match.index + match[0].length + 90).split(/[.!?\n]/)[0];
  const scope = before + match[0] + after;
  if (/\b(?:imibonano|mpuzabitsina|gusamban\w*|rape|sexual|viol)\b/i.test(scope)) return false;
  // Police merely being mentioned in a rape report is not an arrest sense.
  return /\b(?:polisi|abapolisi|police)\s*$/i.test(before)
    || /\b(?:yanze|kwanga)\s+gufatwa\b|\b(?:arrest\w*|custody|detain\w*)\b/i.test(scope)
    || /^\s+(?:umutungo|ubutaka|inzu|amafaranga|telefone|telefoni|umupira|property|land|phone)\b/i.test(after);
}

export const legalVocabulary = [
  { topic: 'rape', terms: forceTakingTerms, forcePhrase: true, query: 'rape OR nonconsensual sexual intercourse', meaning: 'gufata ku ngufu (also typed gufata kungufu or gufatukungufu) commonly means rape in sexual-offence usage, not robbery or theft. It can describe literal use of force in an arrest/property context; use the facts to distinguish that sense. Preserve consent and the people involved; do not assume guilt or a penalty', source: vocabularySources.sexualTerms, usageSource: vocabularySources.rapeUsage, colloquial: true, canonical: 'gukoresha undi imibonano mpuzabitsina ku gahato (rape)' },
  { topic: 'rape', terms: /\b(?:gusambanya\s+ku\s+gahato|gukoresha\s+(?:undi|umuntu)\s+imibonano\s+mpuzabitsina\s+ku\s+gahato|rape(?:d|s)?|viol)\b/i, query: 'rape OR nonconsensual sexual intercourse', meaning: 'forced or non-consensual sexual intercourse; rape. A literal arrest, robbery, and consensual intercourse are different concepts. This vocabulary does not establish statutory elements or guilt', source: vocabularySources.law, canonical: 'gukoresha undi imibonano mpuzabitsina ku gahato (rape)' },
  { topic: 'child_defilement', terms: /\b(?:gusambanya\s+(?:umwana|abana)|[a-z]*sambany(?:ije|a)\s+(?:umwana|abana)|child defilement|sexual abuse of (?:a child|children))\b/i, query: 'child defilement OR child sexual abuse', meaning: 'gusambanya umwana refers to child defilement/sexual abuse of a child in the cited Rwanda law. Do not replace it with adult consensual sex or assume a child can legally consent. Age, applicable law and specific acts matter', source: vocabularySources.law, canonical: 'gusambanya umwana (child defilement / child sexual abuse)' },
  { topic: 'sexual_harassment', terms: /\b(?:guhoza\s+(?:undi\s+)?(?:muntu\s+)?ku\s+nke(?:nke|ke)\s+(?:bifitanye\s+isano\s+n[' ]imibonano\s+mpuzabitsina|y[' ]imibonano\s+mpuzabitsina)|sexual harassment|harcèlement sexuel)\b/i, query: 'sexual harassment', meaning: 'sexual harassment; distinguish it from rape and from non-sexual harassment. Guhoza ku nkeke alone does not select a sexual offence', source: vocabularySources.law, canonical: 'guhoza ku nkeke bifitanye isano n’imibonano mpuzabitsina (sexual harassment)' },
  { topic: 'gender_based_violence', terms: /\b(?:ihohoter(?:a|wa)\s+rishingiye\s+ku\s+gitsina|gender[ -]based violence|violence basée sur le genre)\b/i, query: 'gender based violence', meaning: 'gender-based violence (GBV), a broader category that must not automatically be translated as rape. Determine the actual conduct; not every form is sexual violence', source: vocabularySources.genderViolence, canonical: 'ihohotera rishingiye ku gitsina (gender-based violence)' },
  { topic: 'indecent_assault', terms: /\b(?:urukozasoni|indecent assault|attentat à la pudeur)\b/i, query: 'indecent assault', meaning: 'urukozasoni is the heading translated as indecent assault in the cited 2018 law, concerning an indecent act against another person’s body without consent. An everyday reference to shame or indecency need not describe that offence', context: /\b(?:icyaha|amategeko|igihano|umubiri|ntabyemeye|law\w*|offence\w*|assault|consent|pudeur)\b/i, source: vocabularySources.law, canonical: 'urukozasoni (indecent assault, when discussing the legal offence)' },
  { topic: 'fraud', terms: /\b(?:ubutekamutwe|[au]batekamutwe|umutekamutwe|uburiganya|ubwambuzi bushukana|fraud\w*|scam\w*|swindl\w*|escroquerie)\b/i, query: 'fraud OR swindling OR deception', meaning: 'deception/scamming or obtaining another person’s property by fraud; not physical assault', source: vocabularySources.fraud },
  // Colloquial sense supplied by the user; the same stem also has a lawful agricultural sense.
  { topic: 'fraud', terms: /\b(?:[a-z]*tubu(?:r[a-z]*|we|wa)|[au]batubuzi|umutubuzi)\b/i, query: 'fraud OR swindling OR deception', meaning: 'in the user’s colloquial crime/financial context, gutubura means scamming; do not translate it as beating, assault, or gusambura', source: vocabularySources.fraud, usageSource: vocabularySources.colloquialFraud, colloquial: true, canonical: 'ubutekamutwe (ubwambuzi bushukana / scamming)' },
  { topic: 'fraud', terms: /\b(?:guteka|gutekera|[a-z]*teke(?:ye|ra)|[a-z]*tekera)\s+umutwe\b/i, query: 'fraud OR swindling OR deception', meaning: 'guteka/gutekera umutwe is an idiom for scamming or swindling, not literally cooking a head', source: vocabularySources.fraud, usageSource: vocabularySources.guteka, colloquial: true, canonical: 'gukora ubutekamutwe (swindling)' },
  { topic: 'theft', terms: /\b(?:kwiba|wibye|uwibye|yibye|ubujura|theft|steal(?:ing|s)?|stole(?:n)?|robbery|vol(?:e|é|er)?)\b/i, query: 'theft', meaning: 'stealing/theft; robbery may have additional elements and should be distinguished', source: vocabularySources.law },
  { topic: 'assault', terms: /\b(?:gukubita|gukomeretsa|yakubise|yankubise|bamukubise|assault\w*|battery)\b/i, query: 'assault OR bodily injury', meaning: 'physical assault or bodily injury, distinct from deception/scamming', source: vocabularySources.policing },
  { topic: 'bribery', terms: /\b(?:ruswa|brib\w*|corruption)\b/i, query: 'bribery OR corruption', meaning: 'bribery/corruption; identify the alleged act before selecting a provision', source: vocabularySources.policing },
  { topic: 'forgery', terms: /\b(?:inyandiko mpimbano|guhimba inyandiko|forgery|forged documents?|falsification)\b/i, query: 'forgery OR forged document', meaning: 'forging, altering, or using false documents', source: vocabularySources.forgery },
  { topic: 'trafficking', terms: /\b(?:icuruzwa ry['’ ]abantu|human trafficking|traite des personnes)\b/i, query: 'human trafficking', meaning: 'human trafficking; preserve who is affected and the stated facts', source: vocabularySources.trafficking },
  { topic: 'drugs', terms: /\b(?:ibiyobyabwenge|ibyobyabwenge|urumogi|narcotic\w*|drug trafficking)\b/i, query: 'narcotics OR drugs', meaning: 'drugs/narcotics; distinguish possession, supply, and other conduct', source: vocabularySources.policing },
  { topic: 'drugs', terms: /\bkanyanga\b/i, query: 'kanyanga OR illicit gin', meaning: 'Kanyanga is a local name for crude illicit gin, not cannabis; legal classification and penalties require current sources', source: vocabularySources.kanyanga, colloquial: true, canonical: 'Kanyanga (inzoga y’inkorano / crude illicit gin)' },
  { topic: 'smuggling', terms: /\b(?:magendu|smuggl\w*)\b/i, query: 'smuggling OR customs', meaning: 'magendu refers to smuggling or smuggled goods in customs/trade context, not necessarily counterfeit goods', source: vocabularySources.smuggling, colloquial: true, canonical: 'magendu (smuggling / ibicuruzwa byinjijwe mu buryo butemewe)' },
  { topic: 'smuggling', terms: /\bpanya\b/i, context: /\b(?:imipaka|umupaka|kwambuka|kwinjiza|inzira|magendu|border|import\w*|customs|smuggl\w*)\b/i, exclude: /\b(?:imbeba|rats?|rodents?)\b/i, query: 'smuggling OR customs', meaning: 'panya can mean unofficial border routes in a smuggling context; do not assume this meaning for animals or unrelated paths', source: vocabularySources.smuggling, colloquial: true, canonical: 'inzira za panya (unofficial border routes)' },
  { topic: 'bribery', terms: /\bgiti\b/i, context: /\b(?:itangazamakuru|umunyamakuru|abanyamakuru|journalis\w*|media|reporter\w*|news coverage)\b/i, exclude: /\b(?:igiti|ibiti|amababi|trees?|umurenge wa giti|ku giti (?:cyabo|cyanjye|cye|cyawe))\b/i, query: 'bribery OR media corruption', meaning: 'GITI in the cited media study is a payment conditioning coverage/reporting; ordinary transport reimbursement, a tree, and a place name are different meanings', source: vocabularySources.giti, colloquial: true, canonical: 'GITI (ruswa ijyanye n’itangazamakuru / payment influencing reporting)' },
  { topic: 'bribery', terms: /\b(?:kurya\s+akantu|akantu)\b/i, requires: [serviceContext, benefitContext], contextWindow: 160, exclude: /\b(?:ibiryo|kurya ibiryo|food|snack|impano y[' ]isabukuru|birthday gift)\b/i, query: 'bribery OR corruption', meaning: 'akantu/kurya akantu can be a euphemism for a requested unofficial benefit in exchange for a service; alone akantu means a small thing, not proof of a bribe', source: vocabularySources.akantu, usageSource: vocabularySources.corruptionIdioms, colloquial: true, canonical: 'akantu (possible bribe / ruswa ishoboka mu mitangire ya serivisi)' },
  { topic: 'bribery', terms: /\b(?:kwica\s+akanyota|gukanda\s+amaguru|umuti\s+w[' ]ikaramu|inyoroshyo)\b/i, requires: [serviceContext, benefitContext], contextWindow: 160, exclude: /\b(?:inyota|thirst|massage|masaje|ink|wino)\b/i, query: 'bribery OR corruption', meaning: 'the 2014 official integrity guide lists kwica akanyota, gukanda amaguru, umuti w’ikaramu, and inyoroshyo as bribery euphemisms; use this sense only for a service-linked benefit, not literal thirst relief, leg massage, or pen ink. The guide is usage evidence, not current sentencing law', source: vocabularySources.corruptionIdioms, colloquial: true, canonical: 'ruswa ishoboka (possible service-linked bribe)' },
  { topic: 'bribery', terms: /\bikiziriko\b/i, requires: [/\b(?:girinka|gira inka)\b/i, benefitContext], contextWindow: 160, exclude: /\b(?:umugozi|rope|tether|kuzirika|kuboha)\b/i, query: 'bribery OR corruption OR Girinka', meaning: 'ikiziriko in the cited Girinka complaints refers to an allegedly demanded unofficial payment to receive a programme benefit; distinguish a literal rope/tether or legitimate purchase, and preserve that these are allegations', source: vocabularySources.ikiziriko, colloquial: true, canonical: 'ikiziriko (alleged unofficial Girinka payment)' },
  { topic: 'property_loss', terms: /\b[a-z]*cucu(?:r[a-z]*|ye|we|wa)\b/i, context: /\b(?:amafaranga|imitungo|umutungo|banki|imodoka|money|property|assets?|bank\w*)\b/i, contextWindow: 160, exclude: /\b(?:icupa|bottle|ikirahure|glass)\b/i, query: 'theft OR fraud OR swindling', meaning: 'gucucura in property/money context describes stripping someone of property; reporting uses it for both theft and deception. The method and facts determine the legal issue; do not automatically call it theft, fraud, or assault or reuse a theft penalty', source: vocabularySources.propertyLoss, usageSource: vocabularySources.propertyFraudUsage, colloquial: true, canonical: 'gutwara umutungo w’undi (taking another person’s property; method unspecified)' },
  { topic: 'street_vending', terms: /\b(?:abazunguzayi|umuzunguzayi)\b/i, query: '"street vending" OR "informal trade" OR "market regulation"', meaning: 'abazunguzayi refers to street vendors/hawkers; it is a livelihood label, not a synonym for thieves or a finding of guilt. Current permit/location rules require separate checking; do not copy fines from the 2017 usage report', source: vocabularySources.vendors, colloquial: true, canonical: 'abacuruzi bo mu muhanda (street vendors / hawkers)' },
  { topic: 'drugs', terms: /\b(?:mayirungi|miraa|khat)\b/i, query: 'khat OR mayirungi OR narcotics', meaning: 'mayirungi, miraa, and khat refer to the same plant/drug in the cited Police report; not cannabis or heroin. Distinguish health questions from alleged possession/supply; verify current classification and penalties separately', source: vocabularySources.khat, colloquial: true, canonical: 'mayirungi (khat / miraa)' },
  { topic: 'drugs', terms: /\bmugo\b/i, context: /\b(?:ibiyobyabwenge|ibyobyabwenge|ikiyobyabwenge|heroin\w*|drug\w*|narcotic\w*|kunywa|gucuruza|ibihano|igihano|ahanishw\w*)\b/i, contextWindow: 160, exclude: /\b(?:nitwa|yitwa|izina|mr|mrs|name|professor|doctor|dr)\b/i, query: 'heroin OR narcotics', meaning: 'mugo is a local name for heroin in substance context; do not rewrite a person’s name as a drug. Current classification and penalties require verification', source: vocabularySources.heroin, colloquial: true, canonical: 'mugo (heroin)' },
  { topic: 'drugs', terms: /\b(?:muriture|bareteta|ibikwangari|igikwangari)\b/i, query: '"illicit brew" OR "unauthorised drinks" OR narcotics', meaning: 'muriture, bareteta, and ibikwangari are local brew names in Police reporting; distinguish these alcoholic preparations from cannabis and heroin. A name alone does not establish composition, current legality, or guilt', source: vocabularySources.localBrews, colloquial: true, canonical: 'inzoga y’inkorano ivugwa mu makuru ya Polisi (locally named brew)' },
  { topic: 'property_snatching', terms: /\b[a-z]*shiku(?:z[a-z]*|je|jwe)\b/i, context: /\b(?:telefoni|telefone|terefone|amaterefone|isakoshi|amasakoshi|amafaranga|phone\w*|bags?|purse|money)\b/i, contextWindow: 160, query: 'theft OR robbery OR "property snatching"', meaning: 'gushikuza/yanshikuje in phone, bag, or money context means snatching property; force, injury, and other facts may affect the applicable offence. Do not automatically reuse an ordinary theft sentence', source: vocabularySources.snatching, colloquial: true, canonical: 'gushikuza umutungo (snatching property; circumstances matter)' },
  { topic: 'impersonation', terms: /\b(?:kwiyitirira|wiyitirira|[a-z]*yitiri(?:ra|ye))\b/i, context: /\b(?:polisi|umupolisi|traffic police|umuyobozi|umurimo|imirimo|inzego|umwirondoro|imyirondoro|identity|official\w*|officer\w*)\b/i, contextWindow: 160, exclude: /\b(?:ikinamico|filimi|roleplay|acting|theatre|movie)\b/i, query: 'impersonation OR "identity theft" OR fraud', meaning: 'kwiyitirira in an identity or official-role context means falsely claiming an identity/role; distinguish impersonation from authorised representation or theatrical acting. Identify the deception and purpose before selecting a charge', source: vocabularySources.impersonation, colloquial: true, canonical: 'kwiyitirira umwirondoro cyangwa umurimo (claiming a false identity or role)' },
  { topic: 'threats', terms: /\b(?:iterabwoba|gutera\s+ubwoba|gukangisha|[a-z]*kangish(?:a|ije|wa|ijwe))\b/i, exclude: /\b(?:ikinamico|filimi|roleplay|movie|roller coaster)\b/i, contextWindow: 160, query: 'threats OR intimidation OR extortion OR terrorism', meaning: 'gutera ubwoba/gukangisha means threatening or intimidating; iterabwoba may mean intimidation in a personal complaint or terrorism in a different context. Demanding money through threats can raise extortion questions, but not every threat or fearful feeling is terrorism or proof of an offence', source: vocabularySources.impersonation, colloquial: true, canonical: 'ibikangisho cyangwa iterabwoba (threats/intimidation; distinguish terrorism by the facts)' },
  { topic: 'favouritism', terms: /\b(?:ikimenyane|itonesha|gutonesha)\b/i, context: /\b(?:akazi|guhabwa|serivisi|service\w*|umuyobozi|abayobozi|polisi|abakozi|amasoko|hiring|recruit\w*|official\w*)\b/i, contextWindow: 160, query: 'favouritism OR nepotism OR discrimination', meaning: 'ikimenyane/itonesha in recruitment or service decisions concerns favouritism based on connections or preferential treatment; it is not automatically a paid bribe or necessarily favouring a relative. Compare the actual selection rules and facts', source: vocabularySources.favouritism, colloquial: true, canonical: 'itonesha rishingiye ku kimenyane (favouritism / preferential treatment)' },
  { topic: 'justice_process', terms: /\b(?:gukingira|gukingirira|[a-z]*kingir(?:a|iye|wa|we))\s+ikibaba\b/i, context: /\b(?:icyaha|ibyaha|abanyabyaha|abanyacyaha|ibimenyetso|bakekwaho|criminal\w*|wrongdoing|evidence|investigation)\b/i, contextWindow: 160, exclude: /\b(?:inyoni|amababa|bird\w*|wing\w*)\b/i, query: '"obstruction of justice" OR concealment OR evidence', meaning: 'gukingira ikibaba in a wrongdoing context means shielding or covering for alleged wrongdoing, not literally covering a wing. Distinguish concealing evidence or assisting evasion from lawful defence, confidentiality, and an unproven accusation; do not assume obstruction merely because someone has a lawyer', source: vocabularySources.concealment, evidence: 'Official indexed title/excerpt corroborates usage; the full page could not be opened during review. This is not a verified legal provision.', colloquial: true, canonical: 'gukingira ikibaba (shielding alleged wrongdoing; establish the actual conduct)' },
  { topic: 'embezzlement', terms: /\b(?:kunyereza|inyerezwa|[a-z]*nyereje)\b/i, context: /\b(?:amafaranga|ibya rubanda|umutungo|imari|fund\w*|money|asset\w*|property)\b/i, contextWindow: 160, exclude: /\b(?:umusoro|imisoro|tax\w*)\b/i, query: 'embezzlement OR "misappropriation of funds"', meaning: 'kunyereza/inyerezwa of entrusted or public money concerns misappropriation/embezzlement; identify ownership, responsibility, and conduct rather than assuming ordinary theft. The same verb with taxes has a different meaning', source: vocabularySources.funds, colloquial: true, canonical: 'kunyereza umutungo (misappropriating entrusted funds or property)' },
  { topic: 'fraud', terms: /\bbaringa\b/i, requires: [/\b(?:akazi|umushinga|imishinga|sosiyete|company|companies|project\w*|job\w*|payroll)\b/i, benefitContext], contextWindow: 160, exclude: /\b(?:ikinamico|filimi|fiction|story|movie|congo|drc|place name)\b/i, query: 'fraud OR "fictitious project" OR "ghost employee"', meaning: 'baringa in a paid job/project scheme describes a fictitious or nonexistent entity, offer, or post; the Police example concerns a promised job in a nonexistent project. Fiction, hypothetical examples, and the place name Baringa are different; nonexistence alone does not prove fraud', source: vocabularySources.fictitious, colloquial: true, canonical: 'baringa (fictitious/nonexistent job, project, or entity)' },
  { topic: 'account_takeover', terms: /\b(?:kw(?:iba|ibwa)\s+(?:amakonti|konti)|kwinjirira\s+(?:amakonti|konti)|konti\s+(?:y[a-z]*\s+)?[a-z]*ibwe|account takeover)\b/i, query: '"account takeover" OR "unauthorised access" OR "identity theft"', meaning: 'kwiba konti/konti yibwe concerns account takeover or stolen account credentials; it is distinct from ordinary physical-property theft. Help with securing/recovering the account and checking relevant cyber law, without requesting a password or one-time code', source: vocabularySources.cyber, colloquial: true, canonical: 'kwinjira muri konti utabyemerewe (account takeover / stolen credentials)' },
  { topic: 'privacy_breach', terms: /\b(?:kwinjirirwa|kwinjirira|[a-z]*njiriwe)\b/i, context: digitalContext, contextWindow: 160, exclude: /\b(?:inzu|icyumba|room|house)\b/i, query: '"data breach" OR "unauthorised access" OR privacy', meaning: 'kwinjirirwa/kwinjirira in data or account context concerns a data breach or unauthorised access; an accidental disclosure is not necessarily an intentional attack. Entering a house or room is a different meaning', source: vocabularySources.cyber, colloquial: true, canonical: 'kwinjirirwa kw’amakuru (data breach / unauthorised access)' },
  { topic: 'phishing', terms: /\b(?:phishing|imeli\s+(?:mpimbano|[yz][' ]?uburiganya)|ubutumwa\s+bw[' ]?uburiganya)\b/i, context: digitalContext, contextWindow: 160, query: 'phishing OR "online fraud"', meaning: 'phishing/imeli z’uburiganya or imeli mpimbano in digital context concerns deceptive messages impersonating a trusted sender to obtain sensitive information. It is distinct from fishing for fish; do not ask the user to disclose passwords, PINs, or verification codes', source: vocabularySources.phishing, colloquial: true, canonical: 'ubushukanyi bwo kuri internet (phishing / deceptive messages)' },
  { topic: 'drugs', terms: /\bibyuma\b/i, context: /\b(?:inzoga|ibinyobwa|ibinyobwa bisindisha|kunywa|banyw\w*|spirits?|alcohol\w*|drinks?|brew\w*)\b/i, contextWindow: 160, exclude: /\b(?:inzugi|amadirishya|gusudira|moteri|ibyuma byubaka|ibyuma byo|tools?|metal|steel|welding|engine)\b/i, query: '"substandard alcoholic beverages" OR "illicit spirits"', meaning: 'ibyuma is used for certain substandard alcoholic drinks in the Police report dated 8 August 2026; ordinary metal, tools, and equipment are other meanings. Identify the product and applicable safety rules rather than assuming every drink is a narcotic or inferring its ingredients', source: vocabularySources.ibyuma, colloquial: true, canonical: 'inzoga zitwa ibyuma (locally named substandard alcoholic drinks)' },
  { topic: 'bribery', terms: /\b(?:bituga\s+ukwaha|kabituga\s+ukwaha|ururimi\s+rwa\s+veterineri)\b/i, requires: [serviceContext, benefitContext], contextWindow: 160, exclude: /\b(?:ururimi rw[' ]inka|tongue|animal anatomy|ikirere)\b/i, query: 'bribery OR corruption', meaning: 'bituga ukwaha and ururimi rwa veterineri appear in the 2014 integrity guide as bribery euphemisms; recognise a requested unofficial benefit in a service context, not ordinary speech about an animal’s tongue. This is documented language usage, not current sentencing law', source: vocabularySources.corruptionIdioms, colloquial: true, canonical: 'ruswa ishoboka (possible unofficial service payment)' },
  { topic: 'murder', terms: /\b(?:ubwicanyi|kwica(?!\s+akanyota\b)|murder|homicide)\b/i, query: 'murder OR homicide', meaning: 'killing/homicide; do not assume intent or guilt from the topic alone', source: vocabularySources.law },
];

function vocabularyText(message) {
  // Keep offsets stable for replacements while excluding quoted code and source URLs.
  return String(message || '').replace(/```[\s\S]*?```|`[^`\n]+`|https?:\/\/\S+/g, block => ' '.repeat(block.length)).replace(/[’]/g, "'");
}

function qualifiedMatches(text, entry) {
  const seedContext = /\b(?:imbuto|ingemwe|umusaruro|imigozi|ibijumba|kororoka|seed\w*|seedling\w*|plant propagation|livestock)\b/i.test(text);
  if (entry.usageSource === vocabularySources.colloquialFraud && seedContext) return [];
  return [...text.matchAll(new RegExp(entry.terms.source, 'gi'))].filter(match => {
    if (entry.forcePhrase && literalForceTaking(text, match)) return false;
    const scope = entry.contextWindow ? text.slice(Math.max(0, match.index - entry.contextWindow), match.index + match[0].length + entry.contextWindow) : text;
    return (!entry.context || entry.context.test(scope))
      && (!entry.requires || entry.requires.every(condition => condition.test(scope)))
      && (!entry.exclude || !entry.exclude.test(scope));
  });
}

export function matchedLegalVocabulary(message) {
  const text = vocabularyText(message);
  return legalVocabulary.filter(entry => qualifiedMatches(text, entry).length);
}

export function vocabularyContext(message, history = []) {
  let matches = matchedLegalVocabulary(message);
  if (!matches.length && isCorrectionRequest(message)) {
    const subject = [...history].reverse().find(turn => turn.sender === 'user' && typeof turn.content === 'string' && !isCorrectionRequest(turn.content));
    return subject ? matchedLegalVocabulary(subject.content) : [];
  }
  if (!matches.length && message.length < 120 && /ahanishw|bamuhanis|igihano|punish|penalt|sentenc|peine/i.test(message)) {
    for (const turn of [...history].reverse()) {
      if (turn.sender !== 'user' || typeof turn.content !== 'string') continue;
      matches = matchedLegalVocabulary(turn.content);
      if (matches.length || /\b(?:imisoro|tax\w*|akazi|employment|ubutaka|land)\b/i.test(turn.content)) break;
    }
  }
  return matches;
}

export function canonicalLegalQuestion(message, history = []) {
  const context = vocabularyContext(message, history);
  const aliases = context.filter(entry => entry.canonical);
  if (!aliases.length) return message;
  const text = vocabularyText(message);
  const candidates = aliases.flatMap(entry => qualifiedMatches(text, entry).map(match => ({
    index: match.index, length: match[0].length,
      wording: entry.forcePhrase ? `${match[0]} (rape in sexual-offence usage)`
        : /^natubuwe$/i.test(match[0]) ? 'nakorewe ubutekamutwe (I was scammed)'
      : /^gutubura$/i.test(match[0]) ? 'gukora ubutekamutwe (scamming)' : entry.canonical,
  }))).sort((a, b) => b.length - a.length);
  // A specific phrase such as "kwinjirira konti" wins over its shorter verb hint.
  // Applying overlapping replacements would corrupt the research wording.
  const replacements = [];
  for (const candidate of candidates) {
    if (!replacements.some(other => candidate.index < other.index + other.length && other.index < candidate.index + candidate.length)) replacements.push(candidate);
  }
  replacements.sort((a, b) => b.index - a.index);
  let wording = message;
  for (const replacement of replacements) wording = wording.slice(0, replacement.index) + replacement.wording + wording.slice(replacement.index + replacement.length);
  return `Original question: ${message}\n\nResearch wording with recognized slang explained: ${wording}\nTopic translation: ${[...new Set(aliases.map(entry => entry.topic))].join(', ')}. Answer the original question in the user's language, preserving the original people, facts, intent, and uncertainty. Earlier assistant definitions may be wrong.`;
}

export function legalVocabularyInstruction(message, history = []) {
  const matches = vocabularyContext(message, history);
  if (!matches.length) {
    // Definition questions can explain competing senses without selecting an offence.
    const definitionQuestion = message.length < 240 && /\b(?:ni iki|bivuga iki|bisobanur\w*|meaning|what (?:does|is)|translate|signifie|icyaha|amategeko)\b/i.test(message);
    const text = vocabularyText(message);
    const ambiguous = definitionQuestion ? legalVocabulary.filter(entry => (entry.context || entry.requires) && entry.terms.test(text)).slice(0, 4) : [];
    if (!ambiguous.length) return '';
    return `AMBIGUOUS WORD MEANING (no offence selected):\n${ambiguous.map(entry => `- ${entry.meaning}. Usage reference: ${entry.source}${entry.evidence ? `. Evidence scope: ${entry.evidence}` : ''}`).join('\n')}\nThe context needed to select the legal sense is missing. Briefly explain both the ordinary and the documented contextual sense in the user's language. Do not assert that the user described a crime, rewrite an ordinary word as a charge, or supply penalties from a vocabulary definition. Ask for context only if needed to address their actual legal situation.`;
  }
  return `LEGAL VOCABULARY CONTEXT (meaning and retrieval hints, not verified current law):\n${matches.map(entry => `- ${entry.meaning}. Vocabulary reference: ${entry.source}${entry.usageSource ? `; observed local usage: ${entry.usageSource}` : ''}${entry.evidence ? `. Evidence scope: ${entry.evidence}` : ''}`).join('\n')}\nKeep the original wording and facts. Explain the recognized meaning directly in short paragraphs; do not create a table for a simple meaning/legal-overview question. Ask one focused question only when competing meanings affect the answer. These synonyms do not establish the charge, statutory elements, guilt, article number, or penalty. Verify those from relevant law. A general statement that a law was amended does not prove the specific provision is unchanged; qualify dated references unless the relevant amendment text was checked. Do not invent a sentence range from a vocabulary match. Do not reuse an earlier assistant’s mistranslation as evidence. In Ikinyarwanda, prison duration uses imyaka (years), not amavuko (birth/age wording). Describe Law 68/2018 as the law determining offences and penalties in general (itegeko riteganya ibyaha n’ibihano muri rusange); do not invent a commercial-law title.`;
}
