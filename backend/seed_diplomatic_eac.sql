-- Diplomatic, Consular and International Laws
-- Covers: EAC Treaty, Double Taxation Agreements, Vienna Conventions,
--         COMESA, African Union, UN Conventions, Bilateral Treaties,
--         Consular Services, Diplomatic Privileges
-- Run AFTER seed_security_criminal_extended.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- EAC TREATY AND COMMON MARKET
-- ══════════════════════════════════════════════════════════
(
  'EAC Treaty - East African Community Integration, Free Trade and Common Market',
  'international',
  'Rwanda is a founding member of the East African Community (EAC) established by the Treaty of Arusha 1999 with Kenya, Uganda, Tanzania, Burundi and South Sudan (and subsequently DRC and Somalia). The EAC integration pillars are: (1) Customs Union — the EAC Customs Union Protocol creates a single customs territory; goods originating from EAC Partner States circulate duty-free within the Community; a Common External Tariff (CET) applies to goods from outside the EAC (0% raw materials, 10% intermediate goods, 25% finished goods). (2) Common Market — the EAC Common Market Protocol guarantees the free movement of goods, persons, labour, services and capital among Partner States. EAC citizens have the right to work and reside in any Partner State without a work permit; professional qualifications are mutually recognised. (3) Monetary Union — the EAC is working toward a single currency and monetary union. (4) Political Federation — the long-term goal of a federated East African political community. EAC law: decisions and regulations of EAC organs have direct effect in Partner States where provided; Partner States must implement EAC Protocols through domestic legislation. The EAC Court of Justice resolves disputes between Partner States and hears cases by legal and natural persons against EAC organs. The EACCMA (East African Community Customs Management Act) is the primary instrument governing customs in the EAC Customs Union and applies directly in Rwanda.',
  2000,
  'Treaty for the Establishment of the East African Community 1999 and EAC Protocols as ratified and implemented by Rwanda'
),
(
  'EAC Common Market - Free Movement of Workers, Right of Establishment and Services',
  'international',
  'Under the EAC Common Market Protocol ratified by Rwanda: Free movement of workers: EAC citizens have the right to seek and take up employment in any Partner State without a work permit; they are entitled to the same working conditions as nationals; their professional qualifications are mutually recognised across Partner States. Employers in Rwanda may freely hire EAC nationals without immigration formalities applicable to third-country nationals. Right of establishment: EAC companies and entrepreneurs have the right to set up businesses in any Partner State on the same terms as domestic investors; they may not be discriminated against in licensing, permits or government procurement solely on the basis of nationality. Free movement of services: service providers from EAC Partner States may provide cross-border services in Rwanda without the restrictions that apply to non-EAC providers in most regulated sectors. Free movement of capital: EAC citizens and companies may invest in any Partner State; restrictions on capital transfers between Partner States are being progressively eliminated. Social security portability: EAC workers who move between Partner States should have their social security contributions and benefits recognised in the destination state under bilateral social security agreements. Mutual recognition of academic qualifications: degrees and professional qualifications recognised in one EAC Partner State are recognised across the Community in specified professions including medicine, law, engineering and accountancy.',
  2010,
  'EAC Common Market Protocol 2010 as ratified and implemented by Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- DOUBLE TAXATION AGREEMENTS
-- ══════════════════════════════════════════════════════════
(
  'Double Taxation Agreements - Rwanda Tax Treaties and Withholding Tax Rates',
  'international',
  'Rwanda has concluded Double Taxation Agreements (DTAs) with several countries to prevent income from being taxed twice and to promote cross-border investment. Countries with which Rwanda has ratified DTAs include: Mauritius, Belgium, Luxembourg, Morocco, South Africa, Singapore, Jersey, Qatar, Barbados, United Arab Emirates, Netherlands, and others. DTAs typically provide: reduced withholding tax rates on dividends, interest and royalties paid across borders (rates vary by treaty — commonly 5-15% on dividends, 10% on interest, 10% on royalties compared to the standard 15% domestic rate); exemption or credit relief for business profits taxed at source; permanent establishment rules determining when foreign business profits are taxable in Rwanda; anti-abuse provisions preventing treaty shopping; and mutual agreement procedures for resolving double taxation disputes between tax authorities. To benefit from a DTA reduced rate, the recipient of Rwandan-sourced income must provide a valid tax residency certificate from their country. Rwanda applies the OECD Model Tax Convention as a reference for treaty interpretation. DTA benefits are denied where the principal purpose of an arrangement is to obtain treaty benefits without genuine economic substance (principal purpose test). Rwanda is working toward joining the OECD Inclusive Framework on BEPS (Base Erosion and Profit Shifting) and implementing minimum standards including Country-by-Country Reporting for large multinationals.',
  2015,
  'Rwanda Double Taxation Agreements as ratified and the Income Tax Law international provisions'
),

-- ══════════════════════════════════════════════════════════
-- VIENNA CONVENTION ON DIPLOMATIC RELATIONS
-- ══════════════════════════════════════════════════════════
(
  'Diplomatic Relations Law - Vienna Convention, Diplomatic Immunity and Privileges',
  'international',
  'Rwanda applies the Vienna Convention on Diplomatic Relations 1961 governing the establishment and functions of diplomatic missions. Diplomatic missions: a foreign State may establish an embassy in Rwanda with the consent of Rwanda; the head of mission (Ambassador) is accredited to the Rwandan Government by presenting credentials to the President. Diplomatic agents (the Ambassador and diplomatic staff) enjoy full immunity from criminal jurisdiction in Rwanda — they cannot be arrested, detained or prosecuted regardless of the alleged offence. Diplomatic immunity is not personal privilege; it belongs to the sending State and may be waived by the sending State. Administrative and technical staff of the mission have immunity from criminal jurisdiction for acts performed in the course of their duties. Diplomatic premises are inviolable — Rwandan authorities may not enter the embassy without consent. Diplomatic bags and communications are inviolable. A diplomat who commits a serious criminal offence may be declared persona non grata by Rwanda requiring the sending State to recall them. A person who is persona non grata and fails to leave Rwanda loses diplomatic immunity and may be prosecuted. Consular officers have more limited immunities — functional immunity covering acts performed in their official capacity only, not personal immunity. The Vienna Convention on Consular Relations 1963 governs consular functions including: issuing visas, authenticating documents, protecting nationals, and facilitating trade and cultural relations.',
  1964,
  'Vienna Convention on Diplomatic Relations 1961 and Vienna Convention on Consular Relations 1963 as ratified and applied by Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- COMESA MEMBERSHIP
-- ══════════════════════════════════════════════════════════
(
  'COMESA Membership - Common Market for Eastern and Southern Africa Trade Benefits',
  'international',
  'Rwanda is a member of the Common Market for Eastern and Southern Africa (COMESA) established by the COMESA Treaty 1993. COMESA creates a free trade area among member states with preferential tariffs and the goal of eliminating internal tariffs. Key COMESA benefits for Rwanda: preferential tariffs on goods traded between COMESA member states; simplified trade documentation through the COMESA Certificate of Origin; the COMESA Simplified Trade Regime (STR) facilitating cross-border trade by small-scale traders with goods valued below a prescribed threshold; the COMESA Regional Investment Agency promoting investment across member states; the COMESA Court of Justice resolving trade disputes. COMESA overlap with EAC: Rwanda is a member of both the EAC Customs Union and COMESA; where the two regimes overlap, Rwanda applies the EAC Customs Union as the more deeply integrated framework. The COMESA Free Trade Area covers goods produced in member states meeting COMESA Rules of Origin (typically 35% value-addition or change in tariff heading). Export documentation: Rwandan exporters to other COMESA countries must obtain a Certificate of Origin from RRA to benefit from preferential rates. Rwanda participates in the Africa Continental Free Trade Area (AfCFTA) which creates a single African market — the AfCFTA progressively reduces tariffs on goods and services traded across the continent.',
  1994,
  'COMESA Treaty 1993 as ratified by Rwanda and EAC-COMESA overlap framework'
),

-- ══════════════════════════════════════════════════════════
-- INTERNATIONAL HUMAN RIGHTS TREATIES
-- ══════════════════════════════════════════════════════════
(
  'International Human Rights Treaties - Rwanda Ratifications and Domestic Application',
  'international',
  'Rwanda has ratified all major international human rights treaties. Key treaties and their domestic application: (1) International Covenant on Civil and Political Rights (ICCPR) — guarantees civil and political rights including right to life, freedom from torture, fair trial, freedom of expression, and political participation; Rwanda submitted its periodic reports to the UN Human Rights Committee. (2) International Covenant on Economic, Social and Cultural Rights (ICESCR) — guarantees rights to work, education, health, and adequate standard of living. (3) Convention Against Torture (CAT) — prohibits torture absolutely; Rwanda has an independent mechanism to investigate torture allegations. (4) Convention on the Elimination of All Forms of Discrimination Against Women (CEDAW) — requires equal rights for women in all spheres; Rwanda has one of the highest proportions of women in Parliament globally exceeding 60%. (5) Convention on the Rights of the Child (CRC) — comprehensive child rights framework. (6) Convention on the Rights of Persons with Disabilities (CRPD). (7) African Charter on Human and Peoples Rights — regional human rights treaty with enforcement through the African Court on Human and Peoples Rights. International treaties ratified by Rwanda take effect in domestic law upon publication in the Official Gazette. Where a treaty conflicts with domestic law, the treaty prevails except where it conflicts with the Constitution.',
  2003,
  'International human rights treaties ratified by Rwanda and their domestic application under the Constitution'
),

-- ══════════════════════════════════════════════════════════
-- CONSULAR SERVICES LAW
-- ══════════════════════════════════════════════════════════
(
  'Consular Services Law - Rwanda Consulates Abroad and Foreign Consulates in Rwanda',
  'international',
  'Under Rwandan laws governing consular affairs: The Ministry of Foreign Affairs oversees Rwanda consular services abroad and the management of foreign consular posts in Rwanda. Rwandan consular services available to Rwandan nationals abroad: emergency travel documents for nationals whose passports are lost or stolen; notarisation and authentication of documents; registering births, deaths and marriages of Rwandans abroad; providing assistance to Rwandan nationals arrested abroad; facilitating emergency repatriation; issuing visas to foreign nationals wishing to visit Rwanda. Rwandan nationals abroad retain their rights under Rwandan law and may be assisted by Rwandan consular officers. Foreign consular officers in Rwanda: foreign governments may establish consulates in Rwanda with Rwandan Government approval; consular officers perform functions for their nationals in Rwanda including issuing travel documents, providing notarial services and assisting nationals in contact with Rwandan authorities. When a foreign national is arrested in Rwanda, the police must promptly notify the consular post of their country unless the national objects; the consular officer has the right to visit and communicate with their national. Rwandan nationals studying, working or residing abroad must register with the nearest Rwandan embassy or consulate; registration facilitates emergency assistance and electoral participation for diaspora.',
  2016,
  'Rwanda Ministry of Foreign Affairs consular services regulations and Vienna Convention on Consular Relations as applied in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- EXTRADITION LAW
-- ══════════════════════════════════════════════════════════
(
  'Extradition Law - Surrender of Fugitives and Mutual Legal Assistance',
  'international',
  'Under Rwanda extradition laws: Extradition is the process by which Rwanda surrenders a person to a foreign State for prosecution or to serve a sentence, or receives a person from a foreign State. Rwanda extradites based on: bilateral extradition treaties; the EAC Extradition Protocol; multilateral conventions (for specific crimes such as terrorism, drug trafficking and corruption); or reciprocity in the absence of a treaty. Conditions for extradition: the offence must be punishable under both Rwandan law and the law of the requesting State (dual criminality); the offence must not be a political offence; the person must not face the death penalty or torture in the requesting State unless assurances are given; the prosecution must not be time-barred; and the person must not have already been tried in Rwanda for the same offence. Rwanda does not extradite Rwandan nationals but will prosecute them domestically for offences committed abroad. A fugitive arrested in Rwanda for extradition has the right to: be informed of the request and the charges; apply to court to challenge the extradition; and be represented by a lawyer. The High Court reviews extradition requests and determines whether the legal conditions are met. Mutual Legal Assistance (MLA): Rwanda cooperates with foreign States in gathering and sharing evidence for criminal proceedings, freezing and confiscating assets, and serving documents through the NPPA under bilateral MLA treaties and multilateral conventions.',
  2011,
  'Rwanda extradition law and mutual legal assistance framework'
);
