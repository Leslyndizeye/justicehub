const existingResearchTopics = Object.freeze({
  employment_pay: 'employment labour salary wages payment',
  employment_dismissal: 'employment labour dismissal termination notice',
  employment_age: 'employment labour child minimum age',
  employment_leave: 'employment labour leave maternity',
  employment_sick_leave: 'employment labour sick medical leave',
  employment: 'employment labour',
  vat: 'value added tax VAT', income_tax: 'income tax employment exemptions', tax: 'tax',
  tenancy: 'tenancy landlord tenant rent lease', family: 'family marriage divorce inheritance',
  land: 'land property ownership', consumer: 'consumer protection refund goods services',
  contracts: 'contracts agreement obligations', fraud: 'fraud scam', theft: 'theft robbery',
  sexual_violence: 'rape sexual violence', homicide: 'homicide murder killing a person', criminal_procedure: 'criminal procedure arrest bail',
  civil_procedure: 'civil procedure court', constitutional: 'constitution rights equality',
  privacy: 'data protection privacy', cybercrime: 'cybercrime hacking',
  legal_profession: 'lawyer advocate bar association', other: 'law rights',
  relationships: 'family relationships marriage consent privacy',
  everyday_law: 'constitution rights privacy', health_rights: 'healthcare patient rights',
});

// These are routing/research fields, not claims that every law in a field is
// indexed or current. Local-source coverage is reported separately.
export const legalFields = Object.freeze([
  ['vat','VAT','value added tax VAT',['vat','tva','value added tax'],['law-49-2023']],
  ['income_tax','Income tax and PAYE','income tax employment exemptions',['income tax','paye','income exemptions'],['law-27-2022']],
  ['tax_procedure','Tax administration and disputes','tax procedures declaration assessment objection appeal',['tax procedures','tax assessment','tax appeal','tax declaration','tax administration'],['law-20-2023']],
  ['customs','Customs and cross-border trade','customs import export duties East African Community',['customs','import duty','import duties','export duties','magendu'],[]],
  ['excise','Excise duties','excise duties',['excise'],[]],
  ['property_tax','Property and local taxes','property tax local government taxes',['property tax','land tax','rental income tax'],[]],
  ['tax','Tax and RRA','tax',['tax','taxes','rra','imisoro','umusoro','impot','fiscalite'],['law-27-2022','law-49-2023','law-20-2023']],
  ['employment','Employment and labour','employment labour',['employment','labour','labor','salary','wages','dismissal','sick leave','akazi','umushahara','travail','salaire','licenciement'],['law-66-2018']],
  ['social_security','Social security and pensions','social security pension employment insurance',['rssb','social security','pension','pensions','retirement','izabukuru'],[]],
  ['family','Persons and family','family marriage divorce inheritance',['family','marriage','divorce','custody','child support','umuryango','gushyingirwa','mariage','famille'],['law-71-2024']],
  ['inheritance','Succession and inheritance','succession inheritance wills matrimonial property',['inheritance','succession','will and testament','estate distribution','izungura'],[]],
  ['land','Land and property','land property ownership',['land','property ownership','land title','ubutaka','foncier'],[]],
  ['tenancy','Housing and tenancy','tenancy landlord tenant rent lease',['tenancy','tenant','landlord','eviction','rent','lease','ubukode','locataire','bailleur'],[]],
  ['contracts','Contracts and obligations','contracts agreement obligations',['contract','contracts','agreement','amasezerano','contrat'],[]],
  ['consumer','Consumer protection','consumer protection refund goods services',['consumer','refund','defective goods','consumer protection','consommateur'],[]],
  ['company','Companies and business registration','companies business registration corporate governance',['company law','companies','corporate','business registration','register a business','rdb'],[]],
  ['insolvency','Insolvency and bankruptcy','insolvency bankruptcy restructuring',['insolvency','bankruptcy','bankrupt','liquidation'],[]],
  ['competition','Competition and market conduct','competition anti competitive practices',['competition law','monopoly','price fixing','anti competitive'],[]],
  ['banking','Banking and lending','banking lending financial regulation',['banking','bank loan','lending','credit agreement','bnr','banque'],[]],
  ['insurance','Insurance','insurance policy claims financial regulation',['insurance','insurance claim','assurance'],[]],
  ['payments','Payments and financial services','payments mobile money financial services',['mobile money','payment services','payment dispute','fintech'],[]],
  ['procurement','Public procurement','public procurement tender review',['procurement','public tender','rppa','isoko rya leta','marches publics'],[]],
  ['administrative','Administrative and public service law','administrative decisions public service judicial review',['administrative law','administrative decision','public service','civil service','ombudsman','akarengane'],['law-22-2018']],
  ['immigration','Immigration and residence','immigration visa residence work permit',['immigration','visa','residence permit','work permit','refugee','asylum'],[]],
  ['nationality','Nationality and civil status','nationality citizenship civil status',['nationality','citizenship','naturalisation','naturalization','ubwenegihugu'],['law-71-2024']],
  ['constitutional','Constitutional rights','constitution rights equality',['constitution','constitutional law','human rights','equality','discrimination','itegeko nshinga','uburenganzira','droits humains'],['constitution-2023']],
  ['criminal','Criminal offences and responsibility','criminal offences responsibility penalties',['criminal law','crime','criminal offence','icyaha','ibyaha'],['law-59-2023']],
  ['homicide','Homicide','homicide murder killing a person',['homicide','murder','manslaughter','ubwicanyi'],[]],
  ['fraud','Fraud and scams','fraud scam',['fraud','scam','scamming','gutubura','escroquerie'],[]],
  ['theft','Theft and robbery','theft robbery',['theft','stealing','robbery','ubujura','kwiba'],[]],
  ['sexual_violence','Sexual violence and child protection','rape sexual violence',['rape','sexual violence','child defilement','gufata kungufu'],[]],
  ['corruption','Corruption and misuse of office','corruption bribery abuse of office',['corruption','bribery','bribe','ruswa'],[]],
  ['criminal_procedure','Criminal investigation and procedure','criminal procedure arrest bail',['criminal procedure','arrest','bail','detention','imanza nshinjabyaha'],['law-27-2019','law-12-2017']],
  ['civil_procedure','Civil, commercial and administrative procedure','civil procedure court',['civil procedure','commercial procedure','labour procedure','jurisdiction','court procedure','civil lawsuit'],['law-22-2018','law-30-2018']],
  ['privacy','Privacy and personal data','data protection privacy',['privacy','personal data','data protection','vie privee'],['constitution-2023']],
  ['cybercrime','Cybercrime','cybercrime hacking',['cybercrime','cyber crime','hacking','phishing','cyberbullying'],['law-60-2018']],
  ['intellectual_property','Intellectual property','intellectual property copyright trademarks patents',['intellectual property','copyright','trademark','patent'],[]],
  ['health_rights','Healthcare and patient rights','healthcare patient rights',['patient rights','healthcare','medical consent','medical negligence','health insurance'],[]],
  ['education','Education and student rights','education school student rights',['education','school fees','student rights','school discipline','uburezi'],[]],
  ['environment','Environment and natural resources','environment pollution conservation natural resources',['environment','environmental law','pollution','conservation','waste disposal','ibidukikije'],[]],
  ['mining','Mining','mining minerals licences',['mining','minerals','quarry','quarrying'],[]],
  ['energy','Energy and utilities','energy electricity water utilities',['energy law','electricity','water supply','utilities'],[]],
  ['transport','Transport and road traffic','transport road traffic safety',['road traffic','traffic','driving','transport','road accident','rura'],[]],
  ['agriculture','Agriculture and livestock','agriculture livestock seeds plant health',['agriculture','livestock','seed certification','farming','ubuhinzi'],[]],
  ['legal_profession','Legal profession and legal aid','lawyer advocate bar association',['lawyer','advocate','bar association','legal aid','avoka','avocat'],['law-83-2013','rba-internal-rules-2014','rba-regulation-01-2014']],
  ['foreign_services','Authorisation for foreign services','foreign services authorisation',['foreign services','serivisi zo mu mahanga'],['ministerial-order-003-2024']],
  ['alternative_disputes','Mediation and arbitration','mediation arbitration alternative dispute resolution',['mediation','arbitration','abunzi','conciliation'],[]],
  ['elections','Elections and political rights','elections political rights electoral law',['election','elections','electoral','voting rights','amatora'],['constitution-2023']],
].map(([id,label,query,aliases,lawKeys])=>Object.freeze({id,label,query:existingResearchTopics[id]||query,aliases:Object.freeze(aliases),lawKeys:Object.freeze(lawKeys)})));

export const researchTopics=Object.freeze({...Object.fromEntries(legalFields.map(field=>[field.id,field.query])),...existingResearchTopics});
const fold=value=>String(value).normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase();
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function legalFieldsIn(message) {
  const text=fold(String(message).replace(/```[\s\S]*?```|`[^`]*`|https?:\/\/\S+|[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,' '));const matches=[];
  for(const field of legalFields)for(const alias of field.aliases) {
    if(new RegExp(`(?:^|[^\\p{L}\\p{N}])${escape(fold(alias)).replace(/ /g,'\\s+')}(?=$|[^\\p{L}\\p{N}])`,'u').test(text))matches.push({field,score:alias.length});
  }
  const seen=new Set();
  return matches.sort((a,b)=>b.score-a.score).filter(({field})=>{if(seen.has(field.id))return false;seen.add(field.id);return true;}).map(({field})=>field);
}
export const legalFieldFor=message=>legalFieldsIn(message)[0]||null;
export const fieldForTopic=query=>legalFields.find(field=>field.query===query)||null;
