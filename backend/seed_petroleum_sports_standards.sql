-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Petroleum Law, Sports Law, Standards Law, Surveying Law,
--         Real Estate Agents Law, Weights and Measures, Plastic Bags Law,
--         Veterinary Law, Gacaca legacy, CNLG, Benchmarking
-- Run this AFTER seed_aviation_housing_disaster.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- PETROLEUM AND GAS LAW
-- ══════════════════════════════════════════════════════════
(
  'Petroleum Law - Petroleum Products Importation, Storage and Distribution',
  'energy',
  'Under Rwanda petroleum laws and regulations: The Rwanda Utilities Regulatory Authority (RURA) regulates the petroleum sector including importation, wholesale, storage, distribution and retail of petroleum products. Rwanda imports all its petroleum products as it has no domestic oil production (though the Lake Kivu methane gas project extracts and processes methane dissolved in the lake). Petroleum importers and major distributors must be licensed by RURA. Storage facilities (fuel depots) must meet safety standards including fire prevention, spill containment and environmental requirements prescribed by RURA and the Rwanda Environment Management Authority. Retail fuel stations must be licensed; operators must maintain equipment in safe working condition and use approved measuring equipment for fuel dispensing. RURA regulates retail fuel pump prices; prices are reviewed monthly based on import parity pricing reflecting international oil prices and the exchange rate. Price gouging (charging above the regulated maximum price) is prohibited. The Rwanda Energy Group (REG) and private companies manage the fuel import pipeline from the port of Dar es Salaam in Tanzania through Uganda to Rwanda. Strategic petroleum reserves are maintained to ensure supply continuity during disruptions. Adulteration of petroleum products is a criminal offence. The Lake Kivu methane extraction project by KivuWatt and other operators is regulated under the energy and environment laws with specific arrangements for the Rwanda-DRC joint management of the shared lake resource.',
  2015,
  'Rwanda petroleum sector regulations and RURA petroleum licensing framework'
),

-- ══════════════════════════════════════════════════════════
-- SPORTS LAW — Law No. 34/2009 of 27/08/2009
-- ══════════════════════════════════════════════════════════
(
  'Sports Law - Sports Governance, Federations, Anti-Doping and Sports Disputes',
  'administrative',
  'Under Law No. 34/2009 on the organisation of sports activities in Rwanda: The Rwanda Sports Council and the National Olympic Committee of Rwanda oversee sports governance. National sports federations for each sport discipline must be recognised by the Rwanda Sports Council and affiliated to their respective international federation. Sports clubs must be registered with the relevant national federation. Public and private schools must provide physical education and sports activities. The Government promotes sports development through funding of sports infrastructure, national teams and elite athlete development programmes. Anti-doping: Rwanda is signatory to the World Anti-Doping Code through the Rwanda Anti-Doping Organisation. Athletes are subject to in-competition and out-of-competition testing; a positive doping test results in suspension from competition and forfeiture of results. Match-fixing and sports betting manipulation are prohibited; athletes, officials and others who manipulate sports results commit an offence. Sports agents who represent athletes or facilitate transfers must be licensed by the relevant international federation. Player contracts in professional sports must be registered with the federation. Sports disputes are resolved by the Rwanda Sports Arbitration Tribunal before any resort to ordinary courts; international sports disputes may be referred to the Court of Arbitration for Sport (CAS) in Lausanne, Switzerland. Children participating in sports must have parental consent and appropriate safeguarding measures must be in place at all sports clubs and events.',
  2009,
  'Law No. 34/2009 of 27/08/2009 on organisation of sports activities in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- STANDARDS LAW — Rwanda Standards Board
-- ══════════════════════════════════════════════════════════
(
  'Standards Law - Rwanda Standards Board, Certification and Mandatory Standards',
  'administrative',
  'Under the law establishing the Rwanda Standards Board (RSB): The RSB is responsible for: developing, publishing and implementing national standards; promoting standardisation and quality assurance; certifying products and management systems; metrology (weights and measures accuracy); and facilitating trade through standards harmonisation. RSB standards are developed through technical committees involving industry, consumers and government. RSB adopts international standards from ISO, IEC, Codex Alimentarius and regional bodies (EAC, COMESA) as Rwandan standards wherever applicable to avoid duplication and facilitate trade. Mandatory standards: RSB designates certain standards as mandatory — products and services covered by mandatory standards must comply before being sold or used in Rwanda. Products covered by mandatory standards must be tested and certified before being placed on the market. RSB grants the RSB Quality Mark (RSB certification mark) to products that comply with the relevant standard. RSB conducts market surveillance to detect and remove non-compliant products. Weighing and measuring instruments used in trade (scales, fuel meters, utility meters) must be verified and stamped by RSB metrology division to ensure accuracy. Incorrect weights and measures used in commercial transactions are punishable by fines. RSB participates in EAC Mutual Recognition Arrangements allowing products certified to EAC standards in one Partner State to be accepted in others without re-testing.',
  2012,
  'Rwanda Standards Board Act and RSB regulations on standardisation and quality assurance'
),

-- ══════════════════════════════════════════════════════════
-- REAL ESTATE AGENTS AND VALUERS LAW
-- ══════════════════════════════════════════════════════════
(
  'Real Estate Law - Real Estate Agents, Property Valuers and Conveyancing',
  'land',
  'Under Rwandan real estate laws and regulations: Real estate agents who provide intermediary services for the sale, purchase, lease or management of property must be registered with the competent authority. To be registered as a real estate agent a person must: hold relevant qualifications; have professional indemnity insurance; and maintain a client account separate from business accounts. An agent has a fiduciary duty to act in the best interests of their client; a dual agency (representing both buyer and seller) requires full disclosure and consent of both parties. Estate agents may charge commission on successful transactions at agreed rates; commission is due only upon completion of the transaction not merely upon introduction of a buyer. Certified property valuers must be registered with the professional body and hold an appropriate qualification. Only a certified valuer may prepare property valuations for: bank mortgage purposes; insurance; taxation; and court proceedings. A valuer must be independent; a valuer who has a financial interest in the property being valued must disclose this and must not accept the instruction if impartiality is compromised. Conveyancing (the legal process of transferring property ownership) must be conducted by a notary in Rwanda. The notary verifies title, drafts the transfer deed, ensures payment of transfer taxes, and registers the transfer in the National Land Register. A buyer should conduct title due diligence through a search of the National Land Register before completing a purchase.',
  2018,
  'Rwanda real estate agents and property valuers regulations'
),

-- ══════════════════════════════════════════════════════════
-- PLASTIC BAGS AND POLLUTION CONTROL
-- ══════════════════════════════════════════════════════════
(
  'Plastic Bags Law - Ban on Non-Biodegradable Plastics and Environmental Protection',
  'environment',
  'Under Rwanda environmental laws and the ban on plastic bags: Rwanda has one of the world strictest bans on non-biodegradable plastic bags (polyethylene bags). The import, manufacture, use, sale and distribution of non-biodegradable plastic bags is prohibited in Rwanda. The ban applies to all types of polyethylene shopping bags regardless of size or thickness. Violations are enforced at borders, in shops, and during Umuganda community clean-up activities. A person found importing or distributing prohibited plastic bags is subject to arrest, confiscation of the goods, a fine of up to RWF 10,000,000 and imprisonment of up to one (1) year. Tourists arriving in Rwanda by air or land are required to surrender plastic bags at the border. Alternatives permitted include: biodegradable bags; paper bags; cloth bags; and bags made from plant materials. Single-use plastics more broadly (straws, cutlery, plates) are also being phased out under the broader plastic pollution control policy. Rwanda holds the annual Green City Kigali programme and Kigali is regularly ranked among the cleanest cities in Africa. The prohibition on littering is enforced; dropping litter in public places is a punishable offence under local by-laws. Community Umuganda — monthly community work — includes environmental clean-up as a core activity. The ban on plastic bags is considered a model for other African countries and has been widely replicated.',
  2008,
  'Rwanda law prohibiting the manufacture, importation, use and sale of polythene bags'
),

-- ══════════════════════════════════════════════════════════
-- SURVEYING LAW — Land Surveyors
-- ══════════════════════════════════════════════════════════
(
  'Surveying Law - Licensed Land Surveyors, Cadastral Surveys and Boundary Disputes',
  'land',
  'Under Rwandan surveying laws and regulations: Land surveys determining the boundaries and dimensions of parcels of land must be conducted by a licensed land surveyor registered with the Rwanda Land Management and Use Authority (RLMUA) or the Institute of Real Property Valuers in Rwanda (IRPVR). A licensed surveyor must hold an accredited qualification in surveying and complete professional training. Cadastral surveys establish the official boundaries of land parcels and are recorded in the National Cadastre. The cadastral map is the official reference for determining land boundaries; all land registration is based on cadastral survey data. A landowner who disputes the boundary between their land and a neighbour must engage a licensed surveyor to conduct a boundary survey before commencing any court proceedings. The surveyor prepares an official boundary survey report which is admissible in court. Courts hearing land boundary disputes rely on cadastral records and licensed surveyor reports as primary evidence. Illegal demarcation — moving or removing boundary markers without authority — is a criminal offence. Subdivision of land requires a subdivision survey by a licensed surveyor and approval by the competent authority before registration of the new parcels. Large-scale land surveys for infrastructure projects are conducted by the Rwanda Land Management and Use Authority in coordination with the relevant project proponent.',
  2014,
  'Rwanda land surveying laws and RLMUA regulations on land surveyors and cadastral surveys'
),

-- ══════════════════════════════════════════════════════════
-- GACACA LEGACY AND GENOCIDE JUSTICE
-- ══════════════════════════════════════════════════════════
(
  'Gacaca Courts Legacy - Genocide Justice, Reconciliation and Community Courts',
  'criminal',
  'The Gacaca court system was a community-based transitional justice mechanism established by Rwanda to try genocide cases at the community level, drawing on the traditional Rwandan practice of local dispute resolution. Gacaca courts operated from 2001 to 2012 and tried approximately two million genocide cases — making it the largest community justice process in history. Gacaca courts had jurisdiction over genocide crimes committed between 1 October 1990 and 31 December 1994. Category 1 (planners and leaders) was tried by ordinary courts; Category 2 (killers) and Category 3 (property crimes) were tried by Gacaca. Gacaca procedures: hearings were held in the community where crimes occurred; witnesses testified publicly; perpetrators who confessed fully and genuinely could receive reduced sentences including community service; victims and survivors participated directly in proceedings. Confessions and apologies made in Gacaca proceedings are not admissible in subsequent criminal proceedings for the same acts (res judicata). Gacaca courts are now closed; their archives are maintained by the National Commission for the Fight against Genocide (CNLG). New genocide evidence discovered after Gacaca can be tried by ordinary courts. Denial of genocide findings or questioning convictions without legal basis may constitute genocide denial under the Genocide Ideology Law. Gacaca is studied internationally as a model for community-based transitional justice in post-conflict societies.',
  2004,
  'Organic Law No. 40/2000 establishing Gacaca courts and subsequent amendments, now historical'
),

-- ══════════════════════════════════════════════════════════
-- VETERINARY LAW
-- ══════════════════════════════════════════════════════════
(
  'Veterinary Law - Licensed Veterinarians, Animal Welfare and Practice Standards',
  'agriculture',
  'Under Rwanda veterinary practice laws and the Rwanda Veterinary Council: Veterinarians must be registered with the Rwanda Veterinary Council before practicing veterinary medicine. Registration requires: a recognised degree in veterinary medicine; completion of a supervised internship period; passing the professional competency assessment; and annual renewal. Only registered veterinarians may: diagnose and treat animal diseases; perform surgical procedures on animals; prescribe veterinary medicines; and issue health certificates for animals and animal products. Veterinary medicines may only be dispensed by a licensed veterinarian or licensed veterinary drug shop. The use of veterinary antibiotics as growth promoters in livestock is regulated to control antimicrobial resistance. Animal welfare: animals must not be subjected to unnecessary pain, suffering or distress. The transport of live animals must comply with standards for space, ventilation, food and water. Slaughter of animals must be conducted humanely using approved methods that minimise suffering. Ritual slaughter is permitted but must be conducted by trained persons using methods that minimise animal suffering. A person who deliberately causes unnecessary suffering to animals commits an offence punishable by fines and possible imprisonment. Wild animals may not be kept as pets without a permit from the Rwanda Development Board wildlife division. Zoos and wildlife sanctuaries must be licensed and must meet animal welfare standards.',
  2016,
  'Rwanda veterinary practice laws and Rwanda Veterinary Council regulations'
),

-- ══════════════════════════════════════════════════════════
-- E-GOVERNMENT AND DIGITAL SERVICES LAW
-- ══════════════════════════════════════════════════════════
(
  'E-Government Law - Irembo Platform, Digital Services and Electronic Government',
  'digital',
  'Under Rwanda e-government laws and policies: Rwanda has implemented a comprehensive e-government strategy delivering public services digitally through the Irembo platform. The Irembo e-government platform provides online access to over 100 government services including: passport applications; driving licence applications and renewals; business registration; land transfer applications; birth and marriage certificates; visa applications; court fee payment; tax filing; and health insurance registration. Legal framework for e-government services: electronic applications and approvals through Irembo have the same legal effect as paper applications and approvals. Digital identity: the national identity card system provides a biometric digital identity used to authenticate access to government services. The Rwanda Information Society Authority (RISA) coordinates e-government infrastructure and digital service delivery. The Smart Rwanda Master Plan guides Rwanda digital transformation strategy. Open government data: non-sensitive government data is published on the Rwanda open data portal for public access and use. Electronic government communications and decisions issued through Irembo constitute official communications and are legally valid. Service level standards: each government service on Irembo has a published maximum processing time; failure to process within the standard time entitles the applicant to an escalation procedure. Accessibility: e-government services must be accessible to persons with disabilities and to citizens with limited digital literacy through assisted service centres.',
  2018,
  'Rwanda e-government legal framework, Irembo platform regulations and RISA digital services policies'
);
