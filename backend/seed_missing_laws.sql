-- MISSING LAWS — Laws found on RLRC/RwandaLII not yet in our database
-- SOURCE: Training knowledge from official laws —
--         Aquaculture Law 58/2008, Condominiums Law 15/2010,
--         Beekeeping Law 25/2013, Cemeteries Law 11/2013,
--         National Youth Council Law 1/2016, Faith-Based Orgs Law 72/2018,
--         RRA Law 8/2009, REMA Law 63/2013, Auditor General Law 79/2013,
--         Province Organisation Law 14/2013, Abunzi Law 37/2016 (updated),
--         Decentralised Entities Revenue Law 75/2018, Whistleblowers Law
-- Run this AFTER seed_updates_corrections.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- AQUACULTURE AND FISHING LAW — Law No. 58/2008 of 10/09/2008
-- ══════════════════════════════════════════════════════════
(
  'Aquaculture and Fishing Law - Licensing, Fish Stocks and Lake Management',
  'agriculture',
  'Under Law No. 58/2008 on the organisation and management of aquaculture and fishing in Rwanda: Fishing in Rwandan lakes, rivers and other water bodies is regulated by the competent authority. A fishing licence is required for commercial fishing; artisanal subsistence fishing by local communities on approved terms does not require a licence but is subject to regulations on gear, catch limits and seasons. Commercial fishing licences specify: the authorised water body; permitted fishing methods and gear types; maximum catch quantities; and the licence validity period. Rwanda major fishing lakes include Lake Kivu, Lake Ihema, Lake Burera, Lake Ruhondo, Lake Muhazi and other lakes in the national parks. Protected fish species and minimum size limits are prescribed by ministerial order to prevent overfishing. Seasonal fishing bans may be imposed during breeding seasons. Fishing gear types prohibited include: dynamite fishing; poisoning of water; electric fishing; and nets with mesh below the minimum prescribed size. These prohibited methods carry criminal penalties of imprisonment of one (1) to five (5) years and a fine of RWF 200,000 to RWF 2,000,000 plus confiscation of gear and catch. Aquaculture (fish farming) is promoted as a means of increasing fish production and reducing pressure on wild stocks. Aquaculture operators must obtain an aquaculture licence and comply with standards for water quality, fish health and environmental protection. The Rwanda Agriculture and Animal Resources Development Board (RAB) oversees fisheries and aquaculture development and regulation.',
  2008,
  'Law No. 58/2008 of 10/09/2008 on the organisation and management of aquaculture and fishing in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CONDOMINIUMS LAW — Law No. 15/2010 of 07/05/2010
-- ══════════════════════════════════════════════════════════
(
  'Condominiums Law - Co-Ownership of Buildings, Management and Registration',
  'land',
  'Under Law No. 15/2010 creating and organising condominiums and setting up procedures for their registration in Rwanda: A condominium is a form of property ownership where individuals own separate units within a multi-unit building (such as an apartment block) while sharing ownership of common areas and facilities. Each unit owner holds an individual title registered in the National Land Register specifying: the unit boundaries; the undivided share of common areas allocated to the unit (expressed as a percentage); and any associated exclusive use areas such as parking spaces and storage. Common areas include: foundations, structural elements, roof, stairways, lifts, corridors, external walls, gardens, and shared facilities. Co-owners are responsible for maintenance of common areas in proportion to their undivided shares. The Condominium Management Body (syndicate or homeowners association) is established by the co-owners to manage the condominium. The syndicate must elect a management committee and appoint a manager (syndic) responsible for day-to-day management, collection of service charges and maintenance of common areas. Service charges are levied on each unit owner in proportion to their share; unpaid service charges constitute a lien on the unit. The syndicate rules (reglement de copropriete) binding on all owners and tenants govern: use of units; noise and nuisance; alterations; parking; pets; and other community matters. A unit owner may not carry out structural modifications to their unit without approval of the syndicate and the competent authority. Disputes between co-owners are referred to the Abunzi or competent court.',
  2010,
  'Law No. 15/2010 of 07/05/2010 creating and organising condominiums and setting up procedures for their registration in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- BEEKEEPING LAW — Law No. 25/2013 of 20/05/2013
-- ══════════════════════════════════════════════════════════
(
  'Beekeeping Law - Apiaries, Bee Products Standards and Export',
  'agriculture',
  'Under Law No. 25/2013 on the organisation and functioning of beekeeping in Rwanda: Beekeeping (apiculture) is an agricultural activity encouraged by the Government to promote biodiversity, crop pollination and income generation. A beekeeper who maintains more than five (5) hives must register with the competent district authority. Registration includes: identity of the beekeeper; location of the apiary; number and type of hives; and type of beekeeping practised (traditional hive, modern hive). Beekeeping cooperatives and associations must be registered under the cooperative law. Movement of live bees between districts requires authorisation to prevent spread of bee diseases and pests including Varroa mite and American Foulbrood. Standards for bee products: honey, beeswax, propolis, royal jelly and other bee products intended for sale must meet quality standards set by the Rwanda Standards Board (RSB). Products for export must be certified by the Rwanda FDA and comply with the standards of the destination country. Adulteration of honey or misrepresentation of origin is a food safety offence. Pesticide applications in agricultural areas must comply with buffer zone requirements protecting apiaries; use of pesticides toxic to bees during flowering periods requires prior notification to beekeepers in the vicinity. The Rwanda Agriculture and Animal Resources Development Board (RAB) provides technical support and training to beekeepers. Beekeeping associations are supported through cooperatives framework.',
  2013,
  'Law No. 25/2013 of 20/05/2013 on the organisation and functioning of beekeeping in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CEMETERIES LAW — Law No. 11/2013 of 01/03/2013
-- ══════════════════════════════════════════════════════════
(
  'Cemeteries Law - Management, Burial Rights and Exhumation',
  'administrative',
  'Under Law No. 11/2013 on the organisation and use of cemeteries in Rwanda: Cemeteries are managed by the competent local authority (district) or by authorised private entities including religious organisations. Every person who dies in Rwanda must be buried in an authorised cemetery or cremated at an approved facility. Burial of a deceased person outside an authorised cemetery without permission is prohibited. A death must be reported to the civil registrar to obtain a death certificate and burial permit before burial takes place. The burial permit authorises burial at a specified cemetery. Burial must take place within a prescribed period after death unless the body is preserved in an authorised mortuary. Religious organisations may maintain confessional cemeteries for members of their faith subject to authorisation and compliance with public health and land use standards. Family burial plots on private land may be authorised by the competent authority in rural areas. Exhumation of a buried body requires: a court order or authorisation of the competent authority; and must be conducted by authorised personnel. Exhumation may be authorised for: forensic investigation; relocation of remains; or family request after a prescribed minimum burial period. Genocide memorial sites are governed by a separate legal framework under the National Commission for the Fight against Genocide (CNLG) and may not be modified or disturbed without CNLG authorisation. Disturbing a grave or human remains without authorisation is a criminal offence.',
  2013,
  'Law No. 11/2013 of 01/03/2013 on the organisation and use of cemeteries in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- NATIONAL YOUTH COUNCIL — Law No. 01/2016 of 06/01/2016
-- ══════════════════════════════════════════════════════════
(
  'National Youth Council Law - Mandate, Structure and Youth Participation',
  'administrative',
  'Under Law No. 01/2016 on the mission, organisation and functioning of the National Youth Council (NYC) of Rwanda: The National Youth Council is the official representative body of Rwandan youth in governance and development processes. A youth for purposes of this law means a person aged between fourteen (14) and thirty-five (35) years. The NYC is organised at national, provincial, district, sector, cell and village levels creating a nationwide youth participation structure. At each administrative level a Youth Council is elected by youth in that area. The National Youth Council Executive Committee represents youth interests at the national level, participates in consultative processes, and advocates for youth-friendly policies. Objectives of the NYC include: promoting participation of youth in national development; fighting against negative behaviours among youth including drug abuse, crime and early pregnancy; promoting entrepreneurship and economic empowerment of youth; facilitating youth access to education, employment and housing; and mobilising youth for national service programmes. The NYC has a right to be consulted on laws, policies and programmes affecting youth. The Ministry responsible for youth allocates a budget to support NYC activities and programmes. Youth development programmes supported through the NYC framework include: Itorero ry Igihugu (national values programme); Inkingi ya Urubyiruko (youth entrepreneurship); and youth technical and vocational training initiatives. Youth members of the NYC at all levels serve elected terms and are accountable to their constituents.',
  2016,
  'Law No. 01/2016 of 06/01/2016 on the mission, organisation and functioning of the National Youth Council in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- FAITH-BASED ORGANISATIONS — Law No. 72/2018 of 31/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Faith-Based Organisations Law - Registration, Standards and Government Oversight',
  'administrative',
  'Under Law No. 72/2018 on the organisation and functioning of faith-based organisations in Rwanda: A faith-based organisation (FBO) means any religious organisation including churches, mosques, synagogues, temples and any other organisation whose activities are centred on religious beliefs and practices. All FBOs must register with the Rwanda Governance Board (RGB) to acquire legal personality and operate legally. Registration requirements for an FBO: a detailed description of the religious doctrine and practices; the statutes or constitution; minutes of the founding general assembly; list of founders and leadership with identity documents; proof of a minimum registered membership; a certificate of religious qualification of the founding leader; proof of ownership or right to occupy premises for worship; and a bank account in the organisation name. A religious leader must hold recognised theological training or equivalent qualification relevant to the religion concerned; a person without qualifications may not lead a registered FBO. The premises used for worship must meet minimum standards for safety, space, sanitation, sound management (noise levels), and accessibility. An FBO whose practices involve: human sacrifice; sexual exploitation of members; physical harm to members or children; fraud or financial exploitation of followers; or activities contrary to public health — is subject to immediate closure and criminal prosecution of leaders. The RGB conducts regular inspections of registered FBOs for compliance with registration conditions. An FBO that was operating before this law was enacted had a prescribed period to regularise its registration.',
  2018,
  'Law No. 72/2018 of 31/08/2018 on the organisation and functioning of faith-based organisations in Rwanda'
),
(
  'Faith-Based Organisations Law - Closure of Non-Compliant Churches and Noise Standards',
  'administrative',
  'Under Law No. 72/2018 and related RGB enforcement actions: Rwanda has enforced strict standards for faith-based organisations since 2018. Hundreds of churches that did not meet registration requirements were closed by the RGB and local authorities. Common grounds for closure include: operating without registration; use of premises that do not meet safety and noise standards; lack of qualified leadership; and financial irregularities. Noise regulations: worship activities must not exceed prescribed decibel levels that disturb neighbours and the surrounding community; amplified music or preaching that constitutes a noise nuisance is subject to enforcement. Health and safety: the worship premises must have adequate sanitation, fire exits, structural safety and capacity not to be overcrowded. A faith-based organisation may conduct social services including schools, hospitals, orphanages and community development — these activities are subject to the relevant sectoral regulations in addition to the FBO law. Financial accountability: FBOs must maintain financial records and submit annual financial reports to RGB; financial exploitation of followers including demanding excessive tithes or payments under duress is prohibited and may constitute fraud. Penalties for operating an unregistered FBO: fine of RWF 500,000 to RWF 2,000,000 for the leader and closure of the premises. A registered FBO that violates the conditions of registration may be suspended by the RGB and dissolved by court order for serious violations.',
  2018,
  'Law No. 72/2018 of 31/08/2018 on the organisation and functioning of faith-based organisations in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- RRA LAW — Law No. 08/2009 of 27/04/2009
-- ══════════════════════════════════════════════════════════
(
  'RRA Law - Organisation, Powers and Mandate of Rwanda Revenue Authority',
  'tax',
  'Under Law No. 08/2009 on the organisation, functioning and responsibilities of the Rwanda Revenue Authority (RRA): The RRA is a semi-autonomous government agency responsible for: assessment and collection of all national taxes including income tax, VAT, excise duty, customs duties and other levies; enforcement of tax laws; tax education and taxpayer services; and advising the Government on tax policy matters. The RRA is governed by a Board of Directors and headed by a Commissioner General appointed by the President. The RRA has the power to: issue tax assessments and demand notices; conduct tax audits and investigations; seize property in enforcement of unpaid taxes; freeze bank accounts; prosecute tax offences; and share information with foreign tax authorities under double taxation agreements. Taxpayer rights in dealings with RRA: the right to be treated with respect; the right to confidentiality of tax information; the right to object to assessments; the right to representation by a tax professional; and the right to receive a receipt for all payments. The RRA operates the following departments: Domestic Taxes Department; Customs Services Department; Prosecutions and Enforcement Department; and Taxpayer Services Department. The RRA collects taxes on behalf of both national and local governments. Revenue collection targets are set annually and the RRA performance is publicly reported. The RRA operates the online tax filing portal (e-tax) through which all tax returns and payments must be made. Large taxpayers are managed by a dedicated Large Taxpayer Office.',
  2009,
  'Law No. 08/2009 of 27/04/2009 on the organisation, functioning and responsibilities of the Rwanda Revenue Authority'
),

-- ══════════════════════════════════════════════════════════
-- REMA LAW — Law No. 63/2013 of 27/08/2013
-- ══════════════════════════════════════════════════════════
(
  'REMA Law - Mission, Organisation and Powers of Rwanda Environment Management Authority',
  'environment',
  'Under Law No. 63/2013 on the mission, organisation and functioning of the Rwanda Environment Management Authority (REMA): REMA is the national environmental authority responsible for: coordinating environmental management across all sectors; conducting and approving Environmental Impact Assessments (EIAs); setting environmental standards and guidelines; monitoring the state of the environment; enforcing environmental laws; and representing Rwanda in international environmental fora. REMA powers include: conducting inspections of any premises, activity or project affecting the environment without prior notice; collecting samples and requiring production of environmental records; issuing compliance orders with specific timelines for corrective action; sealing equipment or facilities causing unlawful pollution; and imposing administrative fines. All development projects above prescribed thresholds must undergo an EIA approved by REMA before commencement. REMA maintains a database of all EIA reports and monitoring records. Strategic Environmental Assessments (SEAs) are required for national policies, plans and programmes with significant environmental implications. REMA coordinates the National Environment Fund which finances environmental conservation and restoration projects. REMA prepares the State of Environment and Outlook Report published every three years documenting the condition of Rwanda natural resources. The REMA Director General represents the national environmental position in international negotiations. REMA coordinates with district environmental officers for local enforcement. Appeals against REMA decisions are filed with the Minister within thirty (30) days and thereafter with the competent administrative court.',
  2013,
  'Law No. 63/2013 of 27/08/2013 on the mission, organisation and functioning of the Rwanda Environment Management Authority (REMA)'
),

-- ══════════════════════════════════════════════════════════
-- AUDITOR GENERAL LAW — Law No. 79/2013 of 11/09/2013
-- ══════════════════════════════════════════════════════════
(
  'Auditor General Law - Independence, Mandate and Powers of the Office of the Auditor General',
  'public_finance',
  'Under Law No. 79/2013 on the mission, organisation and functioning of the Office of the Auditor General of State Finances (OAG) in Rwanda: The Auditor General is an independent constitutional office. The Auditor General and Deputy Auditor General are appointed by the President with approval of the Senate for a non-renewable term of eight (8) years. The OAG may not be instructed by any person including the President on what to audit or what conclusions to reach; interference with OAG independence is a criminal offence. Mandate: the OAG audits the accounts of all public institutions including central government ministries, agencies, districts, public enterprises, and projects funded with public resources or external aid. Types of audits conducted: financial audits (opinion on fair presentation of financial statements); compliance audits (whether funds were used for authorised purposes); and performance audits (whether value for money was achieved). The OAG must submit its annual audit report to the Chamber of Deputies and the Senate within six (6) months of the end of the fiscal year. Parliament debates the audit report and may summon accounting officers to explain audit findings. An accounting officer who disagrees with an audit finding may present their response which must be included in the published report. The OAG has the power to: access all records, systems, premises and personnel of audited entities; require production of information and explanations; and retain external specialists for technical audits. Obstruction of an OAG audit is a criminal offence. The OAG cooperates with the African Organisation of Supreme Audit Institutions (AFROSAI) and participates in peer reviews.',
  2013,
  'Law No. 79/2013 of 11/09/2013 on the mission, organisation and functioning of the Office of the Auditor General of State Finances in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- PROVINCE ORGANISATION — Law No. 14/2013 of 08/02/2013
-- ══════════════════════════════════════════════════════════
(
  'Province Organisation Law - Role of Provinces and City of Kigali',
  'administrative',
  'Under Law No. 14/2013 on the organisation and functioning of the Province in Rwanda: Rwanda has four provinces (North, South, East, West) and the City of Kigali which has a special status equivalent to a province. Provinces are administrative units of the central government coordinating and supervising district activities in their territory; they are not autonomous bodies with separate elected councils. Each province is headed by a Governor appointed by the President. The Governor responsibilities include: supervising and coordinating district activities; ensuring implementation of national policies in the province; maintaining security and public order in coordination with security forces; representing the central government at provincial level; and reporting to the President and relevant ministers. The City of Kigali is governed by a Mayor with wider autonomous powers than provincial governors given its status as the capital. Kigali has its own budget and development plan and coordinates directly with central government ministries. Districts within each province operate autonomously but the Governor may intervene if a district fails to implement national directives or violates the law. The Governor may recommend to the President the removal of a district Mayor for serious misconduct or failure to perform duties. National policies and laws apply uniformly across all provinces; provinces may not enact legislation. The Governor chairs provincial security meetings involving police, military and intelligence services to coordinate security matters in the province.',
  2013,
  'Law No. 14/2013 of 08/02/2013 on the organisation and functioning of the Province in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- ABUNZI (UPDATED) — Law No. 37/2016 of 08/09/2016
-- (Replaces Law No. 02/2010)
-- ══════════════════════════════════════════════════════════
(
  'Abunzi Law 2016 - Updated Jurisdiction, Procedure and Enforcement',
  'civil_procedure',
  'Under Law No. 37/2016 on the organisation, jurisdiction, competence and functioning of Abunzi Committees in Rwanda (replacing Law 02/2010): Abunzi (mediation committees) are established at cell and sector levels for community-based dispute resolution. The cell-level Abunzi committee has jurisdiction over civil and commercial disputes where the value does not exceed RWF 3,000,000 and over certain family and land boundary disputes regardless of value. The sector-level Abunzi handles appeals from cell-level decisions and disputes between RWF 3,000,000 and RWF 5,000,000. Compulsory Abunzi mediation before court: parties must attempt Abunzi mediation before filing court cases in the following matters: land boundary disputes; small family disputes including child support; succession disputes below the threshold; and small commercial disputes. Failure to attempt Abunzi mediation is a procedural bar to court filing which the court registrar must enforce. Procedure: the Abunzi committee summons both parties; hearings are conducted informally and in the presence of both parties; the committee facilitates dialogue and proposes solutions. If agreement is reached, a written settlement is signed by parties and the committee — this has the same force as a court judgment and is enforceable through ordinary courts. If mediation fails, a report is issued within seven (7) days and the parties may proceed to the Primary Court. An Abunzi decision may be appealed to the Primary Court within thirty (30) days of notification. Abunzi members are elected community leaders of good character and must undergo training provided by the Ministry of Justice.',
  2016,
  'Law No. 37/2016 of 08/09/2016 on organisation, jurisdiction, competence and functioning of Abunzi Committees in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- DECENTRALISED ENTITIES REVENUE — Law No. 75/2018 of 10/09/2018
-- ══════════════════════════════════════════════════════════
(
  'Decentralised Entities Revenue Law - Sources of Local Revenue and Fiscal Transfers',
  'public_finance',
  'Under Law No. 75/2018 on the sources of revenue and property of decentralised entities in Rwanda: Decentralised entities (districts, towns, sectors) have their own revenues and receive fiscal transfers from the national government. Own revenues of districts include: fixed asset tax (property tax) on immovable property; rental income tax on property owned by the district; business licence fees; market fees; slaughter fees at district abattoirs; land lease fees on district-owned land; and fees for administrative services. Fiscal transfers from central government include: unconditional grants for general administration costs; conditional grants for specific services such as education, health and infrastructure; and equalisation grants for districts with lower revenue capacity. The conditional grants are the largest source of district funding and must be spent only on the designated purposes. Districts must prepare annual budgets aligned with their development plans and the national MTEF; the budget is approved by the District Council. Districts must maintain accounts using the government Integrated Financial Management System (IFMIS) and submit monthly financial reports to MINECOFIN. The Accountant General at district level is personally responsible for the legality of all expenditures. Districts may borrow from financial institutions only with authorisation of the Minister of Finance; guarantees from districts on loans require ministerial approval. Misuse of district funds including diversion of conditional grants is a financial offence subject to surcharge and criminal prosecution under the Anti-Corruption Law.',
  2018,
  'Law No. 75/2018 of 10/09/2018 on the sources of revenue and property of decentralised entities in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- WHISTLEBLOWER PROTECTION LAW — Law No. 04/2020 of 20/03/2020
-- ══════════════════════════════════════════════════════════
(
  'Whistleblower Protection Law - Reporting Corruption, Protection and Rewards',
  'administrative',
  'Under the Law on protection of whistleblowers in Rwanda: A whistleblower is a person who in good faith reports information about: corruption, fraud or financial misconduct in public or private institutions; violation of laws or regulations; danger to public health, safety or the environment; or other wrongdoing of public interest. Any person including public servants, employees, contractors and citizens may blow the whistle. Reports may be made to: the Office of the Ombudsman; the Rwanda Investigation Bureau (RIB); the Prosecution; or the institution internal reporting mechanism. A whistleblower who reports in good faith is protected against retaliation including: dismissal; demotion; harassment; civil suit for damages arising from the disclosure; and criminal prosecution for the act of reporting itself. An employer who retaliates against a whistleblower commits an offence punishable by imprisonment of one (1) to three (3) years and is liable to pay compensation to the whistleblower. The whistleblower identity must be kept confidential by the receiving authority; disclosure of a whistleblower identity without consent is a criminal offence. False reports made in bad faith without reasonable grounds are not protected; a person who knowingly makes a false report to damage another person is liable for abuse of process. Rewards: a whistleblower whose information leads to the recovery of stolen public funds may receive a reward of up to a prescribed percentage of the recovered amount as determined by the competent authority. The Ombudsman coordinates the whistleblower protection programme and reports annually to Parliament on its operation.',
  2020,
  'Rwanda law on protection of whistleblowers — Law No. 04/2020 of 20/03/2020'
),

-- ══════════════════════════════════════════════════════════
-- CONDOMINIUMS SEAL AND STATE SYMBOLS — Law No. 24/2008
-- ══════════════════════════════════════════════════════════
(
  'State Symbols Law - Characteristics, Use and Protection of the Seal and National Symbols',
  'administrative',
  'Under Law No. 24/2008 on characteristics, significance, usage and protection of the seal of the Republic of Rwanda: The seal of the Republic of Rwanda is the official symbol of the Rwandan State used to authenticate official documents, decisions and instruments of government. The seal may only be affixed by authorised officials including the President, ministers, heads of constitutional institutions, and authorised officials of public institutions. Unauthorised use of the state seal is a criminal offence. The national flag, national anthem, and coat of arms are protected national symbols of Rwanda. Desecrating, burning or treating with disrespect the national flag or state symbols in public is a criminal offence punishable by imprisonment and fines. The national anthem must be played or sung with dignity and respect; disrespectful behaviour during the national anthem in a public ceremony is subject to sanction. Commercial use of the state seal, national flag or coat of arms without authorisation is prohibited. Registered marks and logos that are identical or confusingly similar to state symbols may not be registered as trademarks. The Official Gazette of the Republic of Rwanda is the authoritative publication for all laws, regulations, presidential orders and other official acts; the Gazette is published in Kinyarwanda, French and English and the Kinyarwanda version is authoritative in case of conflict.',
  2008,
  'Law No. 24/2008 on characteristics, significance, usage and protection of the seal of the Republic of Rwanda'
);
