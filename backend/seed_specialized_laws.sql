-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         National Police Law, Rwanda Defense Forces Law,
--         Genocide Survivors Law (FARG), Gacaca legacy,
--         Consumer Credit, Hire Purchase, Stamp Duty,
--         Statistics Law, Archives Law, Cultural Heritage Law
-- Run this AFTER seed_labour_extended.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- NATIONAL POLICE LAW
-- ══════════════════════════════════════════════════════════
(
  'National Police Law - Powers, Duties and Accountability of Rwanda National Police',
  'criminal_procedure',
  'Under the law governing the Rwanda National Police (RNP): The Rwanda National Police is responsible for maintaining law and order, preventing and detecting crime, protecting persons and property, and enforcing laws. The RNP operates under the Ministry of Internal Security. Police officers have the power to: arrest persons suspected of committing offences; detain persons for up to twenty-four (24) hours before bringing them before the prosecution; search persons and premises with or without a warrant in prescribed circumstances; seize evidence; and use reasonable force when necessary and proportionate. The use of firearms by police is governed by strict rules: firearms may be used only as a last resort to protect life when non-lethal means have failed or are not feasible; warning shots must be given if possible; and every use of a firearm must be reported and investigated. A person who believes they have been unlawfully arrested, subjected to excessive force or otherwise mistreated by a police officer may file a complaint with the Police Inspectorate. The Inspectorate investigates complaints and may recommend disciplinary action or criminal prosecution of officers. Rwanda National Police officers found guilty of torture, corruption or abuse of power are subject to dismissal and criminal prosecution. The RNP operates the community policing programme (Polisi Mwananchi) which involves community members in crime prevention and reporting.',
  2018,
  'Law governing the Rwanda National Police and related police conduct regulations'
),

-- ══════════════════════════════════════════════════════════
-- GENOCIDE SURVIVORS — FARG Law
-- ══════════════════════════════════════════════════════════
(
  'Genocide Survivors Law - FARG, Benefits and Support Programmes',
  'social_security',
  'Under the law establishing the Fund for Genocide Survivors (FARG): The FARG (Fonds d Appui aux Rescapes du Genocide) was established to provide social and economic assistance to survivors of the 1994 genocide against the Tutsi. FARG is funded by a mandatory contribution of five percent (5%) of the national budget annually and by other contributions. Benefits provided by FARG include: education support — payment of school fees and supplies for genocide survivor children from primary through university level; healthcare — FARG covers medical expenses for genocide survivors who cannot afford treatment including specialised mental health services for trauma; housing — construction or renovation of housing for destitute genocide survivor households; and economic support including income-generating project support. To receive FARG support, a person must be registered as a genocide survivor with the National Commission for the Fight against Genocide (CNLG). Registration requires evidence of being a direct victim of the 1994 genocide including loss of family members or personal injury. Genocide survivors have priority access to reparations programmes. The International Criminal Tribunal for Rwanda (ICTR) and Gacaca courts convicted genocide perpetrators; fines and asset confiscations from perpetrators may be directed to survivor reparations. A person who falsely claims genocide survivor status to obtain FARG benefits commits fraud and is subject to criminal prosecution.',
  2002,
  'Law establishing the Genocide Survivors Support and Assistance Fund (FARG) in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CONSUMER CREDIT AND HIRE PURCHASE
-- ══════════════════════════════════════════════════════════
(
  'Consumer Credit Law - Disclosure, Interest Caps and Borrower Rights',
  'finance',
  'Under Rwanda consumer credit regulations and BNR guidelines: A consumer credit agreement is a loan extended to an individual for personal, household or family purposes rather than for business. All consumer credit agreements must include full disclosure of: the total amount of credit; the Annual Percentage Rate (APR) including all fees, charges and interest; the repayment schedule; the total amount repayable; and the consequences of default. Pre-contractual information must be provided to the borrower before signing in plain language they can understand. The borrower has a right to a cooling-off period of at least seven (7) days after signing a consumer credit agreement within which they may withdraw without penalty. Usurious interest rates are prohibited; BNR publishes maximum lending rate guidelines and monitors compliance by financial institutions. Early repayment: a borrower has the right to repay all or part of a consumer credit early; early repayment penalties must be disclosed and are capped at one percent (1%) of the amount repaid early. A hire purchase agreement transfers possession of goods to the buyer immediately while ownership transfers only after the final instalment is paid. Default on hire purchase allows the seller to repossess the goods if the buyer has paid less than one third of the purchase price; if more than one third has been paid, the seller must obtain a court order to repossess. Credit bureaux operate in Rwanda and financial institutions report credit information to them; a borrower has the right to access and correct their credit report.',
  2018,
  'National Bank of Rwanda consumer credit regulations and BNR consumer protection guidelines'
),

-- ══════════════════════════════════════════════════════════
-- STATISTICS LAW
-- ══════════════════════════════════════════════════════════
(
  'Statistics Law - Official Statistics, National Institute of Statistics and Data Confidentiality',
  'administrative',
  'Under the law governing statistics in Rwanda: The National Institute of Statistics of Rwanda (NISR) is the official statistics agency responsible for collecting, processing, analysing and disseminating official statistics on the economic, social, demographic and environmental situation in Rwanda. Statistical activities of government institutions must be coordinated by NISR to ensure coherence, comparability and quality of official statistics. Major statistical exercises conducted by NISR include: the Population and Housing Census (conducted every ten years); the Household Living Conditions Survey (EICV); the Demographic and Health Survey (DHS); and agricultural and economic surveys. Statistical confidentiality: individual data collected for statistical purposes is strictly confidential and may not be disclosed to third parties including law enforcement agencies or tax authorities in identifiable form. NISR staff are bound by a professional oath of statistical secrecy. Microdata (anonymised individual-level data) may be released for research purposes under data access agreements. Official statistics must meet international standards of accuracy, impartiality, timeliness, comparability and transparency. Rwanda has endorsed the United Nations Fundamental Principles of Official Statistics. The Rwanda Statistical Law designates mandatory data providers — government entities and large enterprises — that are required to respond to official surveys.',
  2013,
  'Law governing statistics in Rwanda and the National Institute of Statistics of Rwanda (NISR)'
),

-- ══════════════════════════════════════════════════════════
-- CULTURAL HERITAGE LAW
-- ══════════════════════════════════════════════════════════
(
  'Cultural Heritage Law - Protection of Cultural Property, Museums and Export Controls',
  'administrative',
  'Under Rwandan cultural heritage laws: Cultural heritage includes both tangible heritage (historic buildings, archaeological sites, museums, artefacts, manuscripts) and intangible heritage (traditional knowledge, performing arts, cultural practices, oral traditions). The Rwanda Cultural Heritage Authority (RCHA) is responsible for identifying, documenting, preserving and promoting Rwandan cultural heritage. Archaeological sites and sites of historical importance are protected areas; excavation or development at these sites requires authorisation from the RCHA. The removal of any cultural property of historical or archaeological significance from Rwanda is prohibited without an export permit from the RCHA. Cultural property unlawfully exported from Rwanda may be claimed back under the UNESCO Convention on Illicit Traffic in Cultural Property. Museums holding Rwandan cultural objects have a duty to conserve and provide public access to the collections. Intangible cultural heritage: traditional knowledge and traditional cultural expressions including traditional medicine, seeds, crafts and performing arts are protected; their commercial exploitation by third parties without consent and benefit-sharing is prohibited. Genocide memorial sites are designated sites of historical memory protected and managed by the National Commission for the Fight against Genocide (CNLG); any construction, excavation or alteration at a genocide memorial site requires CNLG authorisation.',
  2015,
  'Rwanda cultural heritage laws and Rwanda Cultural Heritage Authority regulations'
),

-- ══════════════════════════════════════════════════════════
-- DATA PROTECTION — Extended provisions on Data Subject Rights
-- ══════════════════════════════════════════════════════════
(
  'Data Protection Law - Data Subject Rights, Cross-Border Transfers and DPO',
  'digital',
  'Under Law No. 058/2021 of 13/10/2021 on personal data protection and privacy in Rwanda: Data subjects have the following rights: (1) right of access — to obtain confirmation of whether their data is being processed and a copy of the data; (2) right to rectification — to have inaccurate data corrected; (3) right to erasure (right to be forgotten) — to have data deleted when it is no longer necessary or when consent is withdrawn; (4) right to restriction of processing; (5) right to data portability — to receive data in a structured, machine-readable format; (6) right to object to processing based on legitimate interests; and (7) right not to be subject to automated decision-making that produces significant legal effects without human review. A data controller must respond to a data subject request within thirty (30) days. Cross-border data transfers: personal data may only be transferred to a foreign country if that country provides an adequate level of data protection, or if appropriate safeguards are in place such as standard contractual clauses, or if the data subject has given explicit consent. Organisations that process personal data at large scale or that process sensitive data must appoint a Data Protection Officer (DPO) who is responsible for overseeing compliance and acting as the contact point for data subjects and the regulator. Mandatory data breach notification: a data controller who experiences a personal data breach that is likely to result in risk to data subjects must notify the regulator within seventy-two (72) hours of becoming aware of it.',
  2021,
  'Law No. 058/2021 of 13/10/2021 on personal data protection and privacy in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- ARCHIVES LAW
-- ══════════════════════════════════════════════════════════
(
  'Archives Law - Public Records, Access to Information and Preservation',
  'administrative',
  'Under Rwanda access to information and archives laws: Every citizen has the right to access public information held by government institutions subject to prescribed limitations. Public institutions must respond to information requests within fifteen (15) working days; the response period may be extended by fifteen (15) additional working days for complex requests. Information that may be withheld includes: national security classified information; personal information of third parties; commercial confidential information provided in confidence; and information the disclosure of which would prejudice law enforcement. A person denied information may appeal to the Rwanda Access to Information Commission. The National Archives of Rwanda are the official repository of public records of historical and administrative significance. Government institutions must transfer records to the National Archives according to prescribed retention schedules. Records designated as having permanent value must be preserved indefinitely. Records may not be destroyed without authorisation following proper appraisal procedures. The Rwanda Coding Centre is responsible for developing and maintaining the National Records and Archives system. Electronic records have the same legal validity as paper records if created and stored in a reliable system with audit trails. Freedom of information obligations apply to all public bodies, state-owned enterprises, and private organisations that perform public functions.',
  2013,
  'Rwanda access to information law and national archives regulations'
),

-- ══════════════════════════════════════════════════════════
-- INTELLECTUAL PROPERTY — Extended: Traditional Knowledge
-- ══════════════════════════════════════════════════════════
(
  'Traditional Knowledge Law - Protection of Traditional Medicine and Biodiversity Access',
  'intellectual_property',
  'Under Rwanda laws on access to genetic resources and traditional knowledge (in line with the Nagoya Protocol): Traditional knowledge means knowledge, innovations and practices of indigenous and local communities relevant to the conservation and sustainable use of biodiversity, including knowledge about traditional medicine, agricultural practices and natural resource management. Traditional knowledge holders have the right to: prior informed consent before their knowledge is accessed; equitable benefit-sharing from commercial applications of their knowledge; and attribution of the source of the knowledge. No person may access genetic resources (plants, animals, microorganisms) from Rwanda for research, development or commercial purposes without a prior informed consent agreement with the competent authority (REMA) and the relevant local communities. Access and benefit-sharing (ABS) agreements must be registered with REMA and must include provisions for: monetary benefits (royalties, upfront payments); non-monetary benefits (capacity building, technology transfer, joint research); and compliance with Rwandan national laws. Rwanda is a party to the Convention on Biological Diversity and the Nagoya Protocol on Access and Benefit-Sharing. Traditional medicine practitioners are recognised; their practices are documented and where safe and effective may be integrated into the formal health system. A person who appropriates traditional knowledge or genetic resources without proper ABS compliance commits an offence.',
  2016,
  'Rwanda laws on access to genetic resources and benefit sharing, Nagoya Protocol implementation in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CONSUMER PROTECTION — Extended: Product Liability
-- ══════════════════════════════════════════════════════════
(
  'Consumer Protection - Product Safety Standards, Recalls and Product Liability',
  'competition',
  'Under Law No. 11/2016 on competition and consumer protection and Rwanda Bureau of Standards regulations: The Rwanda Standards Board (RSB) is responsible for setting, publishing and enforcing product quality and safety standards. Mandatory standards apply to products in regulated categories including: food, beverages and agricultural products; electrical and electronic goods; construction materials; medical devices; and vehicles. Products subject to mandatory standards must bear the Rwanda Standards Mark (RSB Quality Mark) obtained after certification testing by an accredited laboratory. Importing or selling products that do not meet mandatory standards is prohibited and may result in: seizure and destruction of non-compliant products; a fine of RWF 500,000 to RWF 10,000,000; and suspension of the importer or trader licence. Product liability: a manufacturer, importer or seller of a defective product that causes personal injury or property damage is strictly liable to the victim for compensation without the victim needing to prove fault, only that the product was defective. A defective product means one that does not provide the safety a consumer is entitled to expect. Where a safety defect is discovered after products have been distributed, the supplier must conduct a product recall notifying all customers and replacing or refunding the product. Failure to conduct a required recall is an offence. The RSB operates a market surveillance programme conducting random testing of products on the market.',
  2016,
  'Law No. 11/2016 on competition and consumer protection in Rwanda, Rwanda Standards Board regulations'
);
