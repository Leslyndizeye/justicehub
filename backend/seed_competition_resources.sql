-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Competition Law 11/2016, Energy Law 06/2015, Water Law 62/2008,
--         Forest Law 47/2013, Transport Law 16/2016, Media Law 02/2013,
--         Public Finance Law 37/2006
-- Run this AFTER seed_health_social_coop.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- COMPETITION AND CONSUMER PROTECTION LAW — Law No. 11/2016 of 05/05/2016
-- ══════════════════════════════════════════════════════════
(
  'Competition Law - Prohibited Practices and Market Dominance',
  'competition',
  'Under Law No. 11/2016 on competition and consumer protection in Rwanda: Agreements between competitors that restrict competition are prohibited, including: price-fixing agreements; agreements to divide markets; bid rigging; and agreements to limit production or restrict technical development. Abuse of dominant market position is prohibited. A company holds a dominant position when it can act independently of competitors and customers. Abusive practices by dominant firms include: predatory pricing designed to eliminate competitors; imposing unfair trading conditions; refusing to supply without objective justification; and tying the purchase of one product to another. Mergers and acquisitions that substantially lessen competition must be notified to and approved by the Rwanda Development Board (RDB) if they exceed prescribed thresholds. The RDB may block a merger, approve it conditionally, or approve it unconditionally. Penalties for anti-competitive practices: fines of up to ten percent (10%) of the annual turnover of the infringing company in Rwanda. Senior managers who authorise anti-competitive conduct may be personally fined and disqualified from serving as directors.',
  2016,
  'Law No. 11/2016 of 05/05/2016 on competition and consumer protection in Rwanda'
),
(
  'Competition Law - Consumer Protection Rights and Remedies',
  'competition',
  'Under Law No. 11/2016: Consumers have the right to: accurate and sufficient information about goods and services before purchase; goods and services that meet safety and quality standards; protection against unfair commercial practices including misleading advertising; and redress for harm caused by defective goods or services. Unfair commercial practices prohibited include: making false or misleading statements about the nature, origin, quality or price of goods; using aggressive sales tactics; and making offers that create a false impression of urgency. A seller of goods bears strict liability for damage caused by defective goods. The consumer does not need to prove fault — only that the goods were defective and caused the harm. A consumer who suffers harm from a defective product may claim: repair or replacement of the defective goods; refund of the purchase price; and compensation for consequential losses including personal injury. Consumers may file complaints with the Rwanda Development Board which may investigate, impose fines and order redress. Small consumer claims may be handled through simplified mediation procedures. Class actions by groups of consumers affected by the same practice are permitted.',
  2016,
  'Law No. 11/2016 of 05/05/2016 on competition and consumer protection in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- ENERGY LAW — Law No. 06/2015 of 28/03/2015
-- ══════════════════════════════════════════════════════════
(
  'Energy Law - Licensing, Electricity Access and RURA Regulation',
  'energy',
  'Under Law No. 06/2015 on energy in Rwanda: The energy sector is regulated by the Rwanda Utilities Regulatory Authority (RURA). No person may generate, transmit, distribute or supply electricity without a licence from RURA. Licences are granted for specific activities: generation licence; transmission licence; distribution licence; supply licence; and off-grid energy system licence. Rwanda Energy Group (REG) is the state entity responsible for electricity generation, transmission and distribution. The Government targets universal electricity access through: extension of the national grid; off-grid solar systems for rural households; and mini-grids for communities distant from the national grid. Independent Power Producers (IPPs) may obtain generation licences and sell electricity to REG under Power Purchase Agreements (PPAs). RURA sets electricity tariffs for consumers and may adjust them based on cost of service reviews. Electricity supply to public institutions, health centres and schools is prioritised. A person who illegally connects to the electricity network, tampers with a meter, or steals electricity commits an offence punishable by imprisonment of one (1) to five (5) years and a fine of RWF 200,000 to RWF 2,000,000.',
  2015,
  'Law No. 06/2015 of 28/03/2015 on energy in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- WATER LAW — Law No. 62/2008 of 10/09/2008
-- ══════════════════════════════════════════════════════════
(
  'Water Law - Water Rights, Use Permits and Protection of Water Resources',
  'environment',
  'Under Law No. 62/2008 relating to water resources management in Rwanda: Water resources including surface water, groundwater and rainwater are public property belonging to the State. No person may abstract or use water from any water source for commercial or industrial purposes without a water use permit from the competent authority. Water use permits specify the source, volume, purpose and conditions of use. Small-scale domestic use and small-scale subsistence agriculture are generally exempt from permit requirements. Discharge of effluents, pollutants or waste into water bodies is prohibited without an authorisation specifying the maximum permissible levels of pollutants. Buffer zones are established along rivers, lakes and wetlands within which certain activities are restricted. The Rwanda Water Resources Board oversees water resources policy and allocation. The Water and Sanitation Corporation (WASAC) manages water supply and sanitation services. Any person who pollutes a water source commits an offence punishable by imprisonment of one (1) to five (5) years and a fine of RWF 1,000,000 to RWF 10,000,000. Corporations committing water pollution offences face fines of ten (10) times the amounts applicable to individuals and mandatory remediation at their own cost.',
  2008,
  'Law No. 62/2008 of 10/09/2008 relating to water resources management in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- FOREST LAW — Law No. 47/2013 of 16/06/2013
-- ══════════════════════════════════════════════════════════
(
  'Forest Law - Forest Classification, Permits and Illegal Logging Penalties',
  'environment',
  'Under Law No. 47/2013 relating to forests in Rwanda: Forests are classified as: national forests (public forests owned and managed by the State under the Rwanda Forestry Authority RFA); local forests (managed by local government); and private forests (owned and managed by private persons). National forests are protected and may not be converted to other uses without authorisation of the Minister. Deforestation of national or local forest requires a permit from the competent authority. Commercial logging and timber harvesting require a harvesting permit from the Rwanda Forestry Authority specifying the species, volume and area of harvest. Permits require payment of forest royalties. Agroforestry and reforestation activities are promoted and may qualify for government incentives. Any person who carries out unauthorised felling, harvesting or burning of trees in a protected forest commits an offence punishable by imprisonment of one (1) to five (5) years and a fine of RWF 500,000 to RWF 5,000,000. Confiscation of timber and equipment used in illegal logging is mandatory. A person who knowingly purchases or transports illegally logged timber commits the same offence. Rwanda has committed to maintaining forest cover of thirty percent (30%) of national territory.',
  2013,
  'Law No. 47/2013 of 16/06/2013 relating to forests in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- TRANSPORT LAW — Law No. 16/2016 of 02/04/2016
-- ══════════════════════════════════════════════════════════
(
  'Transport Law - Road Traffic Rules, Licences and Penalties',
  'transport',
  'Under Law No. 16/2016 on road transport in Rwanda: All motor vehicles operated on public roads must be registered, roadworthy, and covered by valid third party insurance. A driving licence is required to operate any motor vehicle; different categories of licences apply to different classes of vehicle. Vehicle inspection is mandatory at prescribed intervals to ensure roadworthiness. Traffic offences and penalties: driving under the influence of alcohol (blood alcohol content above 0.08%) is punishable by suspension of driving licence for one (1) to three (3) years, imprisonment of one (1) to six (6) months and a fine of RWF 100,000 to RWF 500,000; for a repeat offence, the licence is permanently revoked and imprisonment increases to six (6) months to two (2) years. Speeding, running red lights, using a mobile phone while driving, and failure to wear a seatbelt are punishable by fines. Causing death or serious injury through negligent driving is punishable by imprisonment of two (2) to five (5) years. Commercial passenger transport operators (buses, taxis, moto-taxis) must obtain an operating licence from the competent authority and meet prescribed safety and service standards. Overloading a commercial vehicle attracts fines and vehicle detention.',
  2016,
  'Law No. 16/2016 of 02/04/2016 on road transport in Rwanda'
),
(
  'Transport Law - Public Transport, Moto-Taxi Regulation and Accident Liability',
  'transport',
  'Under Law No. 16/2016: Public transport services including buses, minibuses, taxis and motorcycle taxis (moto-taxis) are subject to specific regulations. Moto-taxi operators must: be licensed; wear an approved helmet and provide a helmet to their passenger; display an identification plate; be registered with a moto-taxi cooperative or association; and pass a safety training programme. A passenger transported on a moto-taxi must wear the provided helmet. Maximum passenger loads and cargo weights for all classes of commercial vehicles are prescribed by regulation. Road traffic accidents resulting in personal injury must be reported to the police within twenty-four (24) hours. The driver who caused the accident bears civil liability for injuries and damage caused; third party insurance covers this liability up to the policy limit. Uninsured vehicles involved in accidents are subject to civil claims against the Rwanda Road Accident Compensation Fund. The Rwanda National Police traffic division is responsible for enforcement of road traffic rules. Installation of speed bumps, road signs and traffic signals on public roads requires authorisation from the Rwanda Transport Development Agency (RTDA).',
  2016,
  'Law No. 16/2016 of 02/04/2016 on road transport in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- MEDIA LAW — Law No. 02/2013 of 08/02/2013
-- ══════════════════════════════════════════════════════════
(
  'Media Law - Press Freedom, Journalist Accreditation and Rwanda Media Commission',
  'media',
  'Under Law No. 02/2013 on media in Rwanda: Freedom of the press and freedom of expression are guaranteed. Every person has the right to communicate and receive information freely. The Rwanda Media Commission (RMC) is the self-regulatory body for media professionals, responsible for setting and enforcing professional standards, accrediting journalists and investigating complaints against media. To practice journalism in Rwanda, a person must obtain accreditation from the RMC by: holding a qualification in journalism or communication; demonstrating knowledge of media ethics; and not having been convicted of an offence involving dishonesty or incitement. Media houses must be registered with the RMC. Content broadcast or published must not: incite genocide, discrimination or violence; violate the dignity or privacy of persons without public interest justification; publish obscene material; or make false statements of fact presented as true. A media practitioner who publishes false information causing harm to another person commits a civil wrong entitling the aggrieved person to damages. The RMC may issue warnings, reprimands, suspend or revoke accreditation of journalists who violate media ethics. Journalists have the right to protect their sources; disclosure of sources may only be ordered by a court in exceptional circumstances.',
  2013,
  'Law No. 02/2013 of 08/02/2013 on media in Rwanda'
),
(
  'Media Law - Broadcasting, Advertising Standards and Online Media',
  'media',
  'Under Law No. 02/2013: Broadcasting services including television and radio require a licence from RURA (Rwanda Utilities Regulatory Authority). Broadcasters must comply with content standards including: a minimum percentage of local content; requirements to broadcast in Kinyarwanda; and restrictions on broadcasting content harmful to children during daytime hours. Advertising must be truthful, decent and not misleading. Advertising of alcohol and tobacco is restricted. Political advertising during election campaigns is subject to rules ensuring equitable access and preventing abuses. Online media including news websites and digital publications are subject to the same content standards as print and broadcast media. Bloggers and online content creators who publish news and public affairs content are required to register with the RMC. A media house or broadcaster that violates the law may be fined by RURA up to RWF 100,000,000 and may have its licence suspended. RURA and RMC coordinate on matters affecting both broadcast regulation and professional journalism standards. Defamation committed through media may give rise to both civil damages claims and, in serious cases, criminal prosecution under the Penal Code.',
  2013,
  'Law No. 02/2013 of 08/02/2013 on media in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- PUBLIC FINANCE LAW — Law No. 37/2006 of 12/09/2006 (as amended)
-- ══════════════════════════════════════════════════════════
(
  'Public Finance Law - Budget Process, Treasury and Accountability',
  'public_finance',
  'Under Law No. 37/2006 on state finances and property in Rwanda (as amended): The national budget is prepared by the Ministry of Finance and Economic Planning (MINECOFIN) through a consultative process involving sector ministries, civil society and Parliament. The budget follows a Medium-Term Expenditure Framework (MTEF) of three years. The budget bill is submitted to Parliament for approval by the end of March each year. Parliament approves the budget by the end of June before the start of the financial year on 1 July. The Accountant General in MINECOFIN is responsible for managing the consolidated fund and maintaining the Government financial management information system (IFMIS). All public revenues must be paid into the Consolidated Fund. No public expenditure may be made without a budget appropriation by Parliament. Accounting officers in each public institution are personally responsible for the legality and propriety of expenditure. Internal audit units must be established in all public institutions. The annual public accounts must be audited by the Office of the Auditor General and the audit report submitted to Parliament within six (6) months of the end of the financial year.',
  2006,
  'Law No. 37/2006 of 12/09/2006 on state finances and property in Rwanda, as amended'
),
(
  'Public Finance Law - Auditor General, Accountability and Sanctions',
  'public_finance',
  'Under Law No. 37/2006: The Auditor General of Rwanda is an independent constitutional office responsible for auditing all public institutions, state-owned enterprises and projects funded by public resources. The Auditor General issues audit opinions on financial statements and reports on compliance, performance and value for money. Parliament reviews the Auditor General report and may summon accounting officers to explain audit findings. Accounting officers found to have caused financial loss to the State through negligence, fraud or misappropriation may be required to make restitution and are subject to disciplinary action and criminal prosecution. Public servants who misappropriate public funds are subject to prosecution under the Anti-Corruption Law and the Penal Code. Surcharges may be imposed on accounting officers for improper payments in breach of financial regulations. The Ombudsman monitors the asset declarations of public officials to detect illicit enrichment. All public officials above a prescribed level must declare their assets annually to the Office of the Ombudsman. False or incomplete asset declarations constitute an offence. Rwanda follows International Public Sector Accounting Standards (IPSAS) for government financial reporting.',
  2006,
  'Law No. 37/2006 of 12/09/2006 on state finances and property in Rwanda, as amended'
);
