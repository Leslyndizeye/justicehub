-- Business Laws: Professional Services Licensing
-- Covers: Advocates Law, ICPAR, Engineers/Architects, Medical Practitioners,
--         Construction Companies, Real Estate Developers, Private Security
-- Run AFTER seed_missing_laws.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- ADVOCATES LAW — Law No. 83/2013 of 11/09/2013 (as amended)
-- ══════════════════════════════════════════════════════════
(
  'Advocates Law - Rwanda Bar Association, Admission and Professional Conduct',
  'legal_profession',
  'Under the Advocates Law in Rwanda: The Rwanda Bar Association (Barreau du Rwanda) is the professional body that regulates the legal profession. To be admitted to the Bar and practise as an advocate in Rwanda, a person must: hold a law degree from a recognised university; complete a one-year pupillage (practical training) under a senior advocate; pass the Bar admission examination administered by the Rwanda Bar Association; be of good character with no criminal convictions involving moral turpitude; and pay the prescribed admission and annual subscription fees. An advocate must maintain a practising certificate renewed annually. Foreign advocates may be admitted on reciprocity terms or for specific cases with Bar Association authorisation. Advocates have exclusive rights of audience before all courts in Rwanda except in cases where a party represents themselves. The Code of Professional Conduct for advocates requires: maintaining client confidentiality absolutely; avoiding conflicts of interest; not acquiring a financial interest in a case being litigated; charging only reasonable fees; and not engaging in touting or unauthorised advertising. Fee arrangements must be in writing; contingency fees (a percentage of what is recovered) are regulated and must be disclosed. An advocate who misappropriates client funds or bribes a judicial officer faces disbarment. The Bar Disciplinary Committee investigates complaints against advocates and may impose: warning; suspension from practice for up to two years; or disbarment. Disbarment decisions may be appealed to the Supreme Court.',
  2013,
  'Rwanda Advocates Law No. 83/2013 of 11/09/2013 and Rwanda Bar Association regulations'
),

-- ══════════════════════════════════════════════════════════
-- ICPAR — Institute of Certified Public Accountants of Rwanda
-- ══════════════════════════════════════════════════════════
(
  'Accountants Law - ICPAR, CPA Certification and Audit Firm Licensing',
  'business',
  'Under the law establishing the Institute of Certified Public Accountants of Rwanda (ICPAR): ICPAR is the professional body that regulates the accountancy profession in Rwanda. Membership categories: Associate member (ACPA) for students completing professional exams; Fellow member (FCPA) for experienced CPAs. To qualify as a CPA Rwanda, a candidate must: hold a recognised degree; complete prescribed professional examinations (ICPAR CPA programme aligned with IFAC standards); accumulate three years of relevant practical experience under a registered mentor; and pass the final competency assessment. Every practising accountant providing public accounting services including audit, tax advisory, and financial reporting must be a registered member of ICPAR with a valid practising certificate. Audit firms must be registered with ICPAR; registration requires: at least one FCPA as a partner; professional indemnity insurance; quality control systems; and compliance with International Standards on Auditing (ISA). Only ICPAR-registered audit firms may sign audit opinions on financial statements for public companies, banks, insurance companies and other regulated entities. Rwanda has adopted International Financial Reporting Standards (IFRS) for public interest entities and IFRS for SMEs for smaller companies. ICPAR regulates continuing professional development (CPD) — members must complete a minimum of forty (40) hours of CPD annually to maintain their practising certificate. Disciplinary proceedings against members are handled by the ICPAR Professional Conduct Committee.',
  2008,
  'Law establishing ICPAR and accountancy profession regulations in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- ENGINEERS AND ARCHITECTS — Professional Licensing
-- ══════════════════════════════════════════════════════════
(
  'Engineers and Architects Law - Professional Registration and Project Certification',
  'business',
  'Under Rwandan professional engineering and architecture laws: Engineers and architects practising professionally in Rwanda must be registered with the Rwanda Engineers Registration Board (RERB) and Rwanda Architects Registration Board respectively. Registration requirements: a recognised degree in engineering or architecture; prescribed period of supervised professional experience (typically two years); passing a professional competency assessment; and annual renewal of the practising certificate. Only registered engineers may sign and certify structural, civil, electrical, mechanical and other engineering designs submitted for building permits. Only registered architects may prepare and certify architectural plans for buildings above prescribed sizes. An engineer or architect who certifies substandard designs that result in structural failure is personally liable civilly and criminally. Foreign engineers and architects may practice in Rwanda on a project-specific basis with authorisation from the respective registration board provided they demonstrate equivalent qualifications. Consulting engineering and architecture firms must be registered as businesses with RDB and must have at least one registered professional as a partner or director. Engineers working in regulated sectors including electricity generation, dam construction, mining and oil and gas require additional sector-specific licences from RURA or the relevant sector regulator. The continuing professional development obligation requires registered engineers and architects to complete prescribed training hours annually. Professional indemnity insurance is compulsory for practising professionals.',
  2016,
  'Rwanda Engineers Registration Board and Architects Registration Board professional licensing regulations'
),

-- ══════════════════════════════════════════════════════════
-- MEDICAL PRACTITIONERS — Rwanda Medical Council
-- ══════════════════════════════════════════════════════════
(
  'Medical Practitioners Law - Rwanda Medical Council, Licensing and Professional Standards',
  'health',
  'Under Rwandan medical practitioners laws: The Rwanda Health Professions Councils regulate health professionals including medical doctors, nurses, midwives, laboratory technicians, physiotherapists, dentists, and other health cadres. A medical doctor must hold a degree in medicine from a recognised university, complete an internship of at least one year at an approved hospital, and register with the Rwanda Medical and Dental Council before practising. Registration requires: certified degree and internship certificates; proof of good standing from any prior jurisdiction; a certificate of good conduct; and payment of registration fees. The practising licence must be renewed annually. A doctor who has been away from clinical practice for more than two years must demonstrate continued competence before re-registration. Foreign-trained doctors may practise in Rwanda after assessment and registration with the Council; equivalency assessment may require additional examinations. The Medical Council investigates complaints of medical negligence, professional misconduct, and ethical violations. Sanctions range from: caution; conditions on practice; suspension; to permanent erasure from the register. A doctor erased from the register who continues to practise commits a criminal offence. Medical malpractice: a patient harmed by negligent medical treatment may sue for damages in civil court; the standard of care is that of a reasonably competent doctor in the same speciality. Medical confidentiality must be maintained except where disclosure is required by law or to prevent serious harm to a third party.',
  2016,
  'Rwanda Health Professions Councils laws and Rwanda Medical and Dental Council regulations'
),

-- ══════════════════════════════════════════════════════════
-- CONSTRUCTION COMPANIES LICENSING
-- ══════════════════════════════════════════════════════════
(
  'Construction Law - Contractor Classification, Licensing and Liability',
  'business',
  'Under Rwanda construction industry regulations: Construction contractors must be classified and registered with the Rwanda Construction Industry Federation and the Rwanda Development Board. The classification system categorises contractors by: the type of works (buildings, roads, water, electrical, mechanical); the financial capacity (minimum net worth and bank guarantees); technical capacity (equipment owned and professional staff); and track record of completed projects. Classification grades (typically 1 to 6 or A to F) determine the maximum contract value a contractor may undertake. A contractor who executes a contract beyond their classification level commits an offence and the contract may be voided. Foreign construction companies may operate in Rwanda if they establish a local entity, meet classification requirements, and comply with local content obligations including use of Rwandan subcontractors and labour. The construction contract must specify: scope of works; price; programme; quality standards; defects liability period; payment terms; variation procedures; and dispute resolution mechanism. The defects liability period is typically one (1) year for buildings and up to five (5) years for structural defects; the contractor must return and rectify defects notified during this period at no additional cost. A contractor who abandons a project without justification is liable for the cost of completion and forfeits their performance bond. The Rwanda Building Code sets minimum technical standards that all construction must meet. A contractor whose negligent construction causes injury or death faces criminal prosecution and civil liability for all losses.',
  2017,
  'Rwanda construction industry licensing regulations and Rwanda Construction Industry Federation standards'
),

-- ══════════════════════════════════════════════════════════
-- REAL ESTATE DEVELOPMENT
-- ══════════════════════════════════════════════════════════
(
  'Real Estate Development Law - Developer Registration, Off-Plan Sales and Consumer Protection',
  'business',
  'Under Rwandan real estate development laws: A real estate developer who sells residential or commercial units off-plan (before construction is completed) must: register the development project with the Rwanda Housing Authority (RHA); obtain all required planning and building permits before marketing; and open a dedicated escrow account into which buyer deposits are paid and from which funds are released only upon certified construction milestones. Off-plan sales contracts must disclose: the full specifications of the unit; the construction timeline with milestone dates; the consequences of project delays; the refund procedure if the project is not completed; and the dispute resolution mechanism. A developer who fails to complete a project within the agreed timeline must: refund all deposits with interest; or offer a revised completion schedule acceptable to the buyer. A developer who misappropriates buyers funds held in escrow commits a criminal offence of fraud punishable by imprisonment and a fine proportionate to the amount misappropriated. The RHA maintains a register of licensed real estate developers and approved projects. Only registered developers may market off-plan sales. Buyers of newly completed properties benefit from a structural warranty of ten (10) years against major structural defects — the developer bears this liability regardless of the identity of the builder. Real estate agents facilitating developer sales must disclose their agency relationship and their commission. Strata title (sectional title) for apartment buildings follows the Condominiums Law.',
  2018,
  'Rwanda Housing Authority real estate development regulations and consumer protection provisions for property buyers'
),

-- ══════════════════════════════════════════════════════════
-- PRIVATE SECURITY COMPANIES LAW
-- ══════════════════════════════════════════════════════════
(
  'Private Security Law - Licensing of Security Companies and Guards',
  'security',
  'Under Rwandan private security laws: Private security companies providing guarding, patrol, cash in transit, event security, and related services must be licensed by the Rwanda National Police (RNP). A private security company licence requires: registration as a company under the Companies Law; minimum paid-up capital as prescribed; a fit-and-proper assessment of directors and shareholders; criminal background checks for all security personnel; adequate training facilities or training agreements; and insurance covering liability for acts of security personnel. Security guards must hold individual licences issued after: completing a prescribed training programme covering security procedures, first aid, legal powers and limits, use of force principles, and customer relations; passing a competency assessment; and background vetting. A security guard has no greater powers of arrest than an ordinary citizen; a security guard who unlawfully detains or assaults a person is personally and criminally liable. Use of force by security guards is limited to reasonable and necessary force for self-defence or defence of others. Security companies may apply for authorisation for armed guards for high-risk operations such as cash in transit and VIP protection; armed guards must hold additional firearms training and authorisation. A security company that employs unlicensed guards or fails to supervise their conduct is jointly liable for harm caused by those guards. The RNP inspects security companies regularly and may revoke licences for serious violations.',
  2015,
  'Rwanda National Police private security companies licensing regulations'
),

-- ══════════════════════════════════════════════════════════
-- TRANSPORT FREIGHT AND LOGISTICS
-- ══════════════════════════════════════════════════════════
(
  'Freight and Logistics Law - Cargo Transport Licensing, Liability and Transit',
  'business',
  'Under Rwanda transport and logistics laws: Commercial freight transport operators carrying goods on public roads must hold a freight transport licence from the Rwanda Transport Development Agency (RTDA). The licence specifies: the category of goods that may be carried; the maximum vehicle weight and dimensions authorised; the route authorisation for international freight; and conditions for carrying dangerous goods. Dangerous goods (hazardous materials) transport requires a special permit and compliance with the ADR/African Annex regulations on packaging, labelling, marking, documentation and driver training. Cold chain transport for perishable food and pharmaceutical products requires vehicles with certified temperature control equipment. Freight forwarders and customs clearing agents must be licensed by RRA and must pass a professional examination on customs procedures. A customs clearing agent is jointly liable with the importer for customs duties on goods they clear; the agent must conduct due diligence on the accuracy of import declarations. Cargo liability: a carrier is liable for loss or damage to goods from the time of taking charge until delivery; the carrier may limit liability to prescribed amounts per kilogram unless higher value is declared. The carrier is not liable for inherent defects of goods, force majeure, or the fault of the shipper. Rwanda is a landlocked country and relies on the Northern Corridor (Mombasa-Kampala-Kigali) and Central Corridor (Dar es Salaam-Kigali) for international trade; transit procedures are governed by bilateral and EAC transit agreements.',
  2016,
  'Rwanda transport and logistics licensing laws and RTDA freight regulations'
),

-- ══════════════════════════════════════════════════════════
-- HOSPITALITY AND HOTEL REGULATION
-- ══════════════════════════════════════════════════════════
(
  'Hospitality Law - Hotel Classification, Operating Licences and Guest Rights',
  'business',
  'Under Rwanda tourism and hospitality laws: Hotels, lodges, guesthouses, serviced apartments, and other accommodation establishments must obtain an operating licence from the Rwanda Development Board (RDB) Tourism Division and a business licence from the district. RDB conducts classification assessments to assign star ratings (one to five stars for hotels) and grade ratings for other accommodation types. Classification is based on: physical facilities and room standards; food and beverage facilities; staff qualifications; service standards; safety and security measures; and environmental management practices. Only classified establishments may display or advertise their classification. A classified establishment must maintain the standards that earned its classification; reclassification inspections are conducted every two years. Health and safety requirements for accommodation establishments: fire safety plan and equipment; food safety compliance inspected by Rwanda FDA; swimming pool safety standards; electrical safety inspections; and structural safety certificates. Restaurants must hold a food establishment licence renewed annually; food handlers must hold valid food safety training certificates. Guest rights: a guest who is refused accommodation after a confirmed booking is entitled to compensation for the cost of alternative accommodation; discrimination against guests based on race, nationality, religion or disability is prohibited. Hotels must clearly display room rates including all taxes and service charges; hidden charges are prohibited. A hotel guest is not liable for loss of personal property not deposited with the hotel management unless the loss is caused by the hotel staff or inadequate security.',
  2019,
  'Rwanda Development Board tourism and hospitality licensing regulations and hotel classification standards'
);
