-- Additional Rwanda legal documents for RAG database
-- SOURCE: Official PDFs — Immigration Law 57/2018, Procurement Law 62/2018,
--         IP Law 31/2009, Environment Law 48/2018, Notaries Law 13bis/2014
-- Run this AFTER seed_investment_procedure.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- IMMIGRATION LAW — Law No. 57/2018 of 13/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Immigration Law - Visas: Types and Requirements',
  'immigration',
  'Under Law No. 57/2018, three categories of visas are issued to foreigners entering Rwanda: (1) Entry visa — granted to a foreigner wishing to enter Rwanda for a short stay not exceeding thirty (30) days, renewable once for a maximum of thirty (30) additional days; (2) Transit visa — granted to a foreigner passing through Rwanda to a third country, valid for a maximum of seventy-two (72) hours; (3) Tourist visa — granted to a foreigner visiting Rwanda for tourism purposes, valid for thirty (30) days and renewable. Visas are issued by Rwandan embassies and consulates abroad, at border posts, or through the online immigration portal. A foreigner who enters Rwanda without a valid visa or entry authorisation commits an offence punishable by imprisonment of fifteen (15) days to six (6) months and a fine of FRW 500,000 to FRW 1,000,000.',
  2018,
  'Law No. 57/2018 of 13/08/2018 on immigration and emigration in Rwanda'
),
(
  'Immigration Law - Residence Permits for Foreigners',
  'immigration',
  'Under Law No. 57/2018, a foreigner wishing to reside in Rwanda must obtain a residence permit. Two main categories exist: (1) Temporary residence permit — issued for a period not exceeding two (2) years and renewable, granted to foreigners employed in Rwanda, investors, students, refugees and others with lawful reason to reside; (2) Permanent residence permit — issued to a foreigner who has legally and continuously resided in Rwanda for at least five (5) years, or who has invested a prescribed minimum capital in Rwanda, or who is a spouse of a Rwandan national. A holder of a permanent residence permit has the same rights as a Rwandan citizen regarding access to social services, except for political rights. Residence permits are issued by the Directorate General of Immigration and Emigration. A foreigner who resides in Rwanda without a valid residence permit commits an offence punishable by imprisonment of one (1) month to six (6) months and a fine of FRW 100,000 to FRW 500,000.',
  2018,
  'Law No. 57/2018 of 13/08/2018 on immigration and emigration in Rwanda'
),
(
  'Immigration Law - Work Permits and Employer Obligations',
  'immigration',
  'Under Law No. 57/2018, a foreigner who wishes to work in Rwanda must obtain a work permit issued by the Directorate General of Immigration and Emigration in collaboration with the Ministry in charge of labour. An employer who intends to recruit a foreign employee must demonstrate that the required skills are not available locally. The employer must apply for the work permit on behalf of the prospective employee. The work permit is issued for a period not exceeding two (2) years and is renewable. An employer who employs a foreigner without a valid work permit commits an offence punishable by a fine of FRW 1,000,000 to FRW 3,000,000 for each employee without a permit. A foreigner who works without a valid work permit commits an offence punishable by imprisonment of fifteen (15) days to three (3) months and a fine of FRW 200,000 to FRW 1,000,000. The RDB one-stop centre facilitates work permit applications for investors and their foreign employees.',
  2018,
  'Law No. 57/2018 of 13/08/2018 on immigration and emigration in Rwanda'
),
(
  'Immigration Law - Deportation, Expulsion and Prohibited Persons',
  'immigration',
  'Under Law No. 57/2018, the Minister in charge of immigration may order the deportation of a foreigner who: entered Rwanda illegally; was admitted on the basis of false documents or misrepresentation; has been convicted of an offence in Rwanda; is considered a threat to national security, public order or public health; has become a burden on public funds. A foreigner subject to a deportation order is detained and removed from Rwanda at the cost of the carrier that brought them. A deported foreigner is prohibited from re-entering Rwanda for a period specified in the deportation order. A foreigner who re-enters Rwanda after deportation without authorisation commits an offence punishable by imprisonment of six (6) months to two (2) years and a fine of FRW 1,000,000 to FRW 3,000,000. An airline or carrier that brings a passenger without valid travel documents commits an offence punishable by a fine of FRW 500,000 per passenger.',
  2018,
  'Law No. 57/2018 of 13/08/2018 on immigration and emigration in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- PUBLIC PROCUREMENT LAW — Law No. 62/2018 of 25/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Public Procurement - Methods of Procurement (Articles 20 to 40)',
  'procurement',
  'Under Law No. 62/2018, the following procurement methods are used in Rwanda: (1) Open competitive bidding — the standard method, open to all eligible bidders through public advertisement; (2) Restricted bidding — used when goods, works or services are available from a limited number of bidders or when costs of open bidding are disproportionate to contract value; (3) Request for quotations — used for readily available standard goods or simple services below prescribed thresholds; (4) Direct procurement — used in emergency situations, when only one supplier exists, or for follow-on contracts; (5) Framework agreement — used for repetitive procurement needs over a defined period; (6) Community participation — used for labour-intensive works where local community involvement is appropriate; (7) Design contest — used for procurement of plans or designs; (8) Electronic reverse auction — used as a supplement to other methods. The Rwanda Public Procurement Authority (RPPA) sets thresholds for each procurement method and issues standard bidding documents.',
  2018,
  'Law No. 62/2018 of 25/08/2018 on public procurement in Rwanda'
),
(
  'Public Procurement - Complaints, Appeals and Review',
  'procurement',
  'Under Law No. 62/2018, any bidder who considers that they have been harmed by a breach of procurement rules may file a complaint. A complaint must first be filed with the procuring entity within seven (7) working days of the act or omission giving rise to the complaint. The procuring entity must respond within seven (7) working days. If not satisfied, the bidder may appeal to the Rwanda Public Procurement Authority (RPPA) within seven (7) working days of receiving the procuring entity decision or expiry of the response period. The RPPA must decide within fourteen (14) working days. Further appeal may be lodged with the competent court. During the complaint process, the procuring entity may suspend the procurement process. A contract signed in violation of procurement rules is null and void. Public officials who interfere in the complaint process or retaliate against a complainant are subject to disciplinary and criminal sanctions.',
  2018,
  'Law No. 62/2018 of 25/08/2018 on public procurement in Rwanda'
),
(
  'Public Procurement - Debarment and Criminal Penalties',
  'procurement',
  'Under Law No. 62/2018, the RPPA may debar a supplier, contractor or consultant from participating in public procurement for a period of five (5) years for: submitting false documents; engaging in corrupt, fraudulent, collusive or coercive practices; failing to perform a contract without justification; refusal to sign a contract after award. Debarment for seven (7) years applies for: bribery of a procurement official; bid rigging or price fixing; misrepresentation regarding qualifications. A debarred entity is published on the RPPA website and excluded from all public procurement in Rwanda for the debarment period. Criminal penalties under the law: any person who solicits or accepts a bribe in relation to public procurement is liable to imprisonment of five (5) to ten (10) years and a fine of FRW 2,000,000 to FRW 10,000,000. A public official convicted of procurement fraud loses their right to hold public office for a period of ten (10) years.',
  2018,
  'Law No. 62/2018 of 25/08/2018 on public procurement in Rwanda'
),
(
  'Public Procurement - Evaluation, Award and Contract Management',
  'procurement',
  'Under Law No. 62/2018, bids are evaluated by a bid evaluation committee appointed by the accounting officer. Evaluation is based on pre-disclosed criteria: for goods and works — lowest evaluated price among substantially responsive bids; for consultancy services — quality and cost-based selection. The procuring entity publishes a notice of best evaluated bidder and allows a standstill period of five (5) working days during which complaints may be filed before contract signing. Contracts must be signed within the validity period of bids. The procuring entity must monitor contract performance and maintain complete procurement records for at least ten (10) years. Contract modifications are permitted only for unforeseen circumstances and must not change the fundamental nature of the contract. Contract variations exceeding fifteen percent (15%) of the original contract value require approval from the RPPA.',
  2018,
  'Law No. 62/2018 of 25/08/2018 on public procurement in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- INTELLECTUAL PROPERTY LAW — Law No. 31/2009 of 26/10/2009
-- ══════════════════════════════════════════════════════════
(
  'Intellectual Property - Patents: Requirements and Duration',
  'intellectual_property',
  'Under Law No. 31/2009, a patent may be granted for any invention that is new, involves an inventive step and is industrially applicable. An invention is new if it does not form part of the state of the art. An invention involves an inventive step if, having regard to the prior art, it would not have been obvious to a person skilled in the relevant field. A patent application must be filed with the Rwanda Development Board (RDB) and must contain: a description of the invention; one or more claims; an abstract; and drawings where applicable. A granted patent confers on its owner the exclusive right to exploit the patented invention in Rwanda for a period of twenty (20) years from the filing date, subject to payment of annual maintenance fees. After expiry, the invention enters the public domain. Compulsory licences may be granted in cases of national emergency, public non-commercial use, or where the patent holder fails to work the patent in Rwanda without legitimate reason.',
  2009,
  'Law No. 31/2009 of 26/10/2009 on the protection of intellectual property in Rwanda'
),
(
  'Intellectual Property - Trademarks: Registration and Protection',
  'intellectual_property',
  'Under Law No. 31/2009, a trademark is any sign capable of distinguishing the goods or services of one enterprise from those of another. Signs registrable as trademarks include: words, letters, numerals, devices, labels, colours and combinations thereof. A trademark application is filed with the Rwanda Development Board (RDB). Registration is refused if the mark is: contrary to public order or morality; identical or confusingly similar to an existing registered mark for the same goods or services; descriptive of the goods or services; deceptive as to origin, quality or nature. A registered trademark confers the exclusive right to use the mark in Rwanda for a period of ten (10) years from the filing date. Registration is renewable indefinitely for successive ten-year periods upon payment of the renewal fee. The owner of a registered trademark may grant licences to third parties. An unregistered trademark may be protected under the law of unfair competition.',
  2009,
  'Law No. 31/2009 of 26/10/2009 on the protection of intellectual property in Rwanda'
),
(
  'Intellectual Property - Copyright: Works Protected and Duration',
  'intellectual_property',
  'Under Law No. 31/2009, copyright protects original literary, artistic and scientific works including: books, articles and other writings; computer programs; musical compositions; dramatic works; cinematographic works; paintings, drawings and sculptures; photographs; maps, plans and technical drawings. Copyright protection arises automatically upon creation — no registration is required. The author of a work has both economic rights (reproduction, distribution, public performance, translation, adaptation) and moral rights (right of attribution, right of integrity). Economic rights last for the life of the author plus fifty (50) years after death. For works of joint authorship, the fifty-year period runs from the death of the last surviving author. For works made by an employer, copyright vests in the employer unless otherwise agreed. Moral rights are perpetual and inalienable. Works of Rwandan cultural heritage in the public domain are administered by the Government.',
  2009,
  'Law No. 31/2009 of 26/10/2009 on the protection of intellectual property in Rwanda'
),
(
  'Intellectual Property - Enforcement and Criminal Penalties',
  'intellectual_property',
  'Under Law No. 31/2009, the owner of an intellectual property right may institute civil proceedings for: infringement of the right; seizure and destruction of infringing goods; damages for losses suffered. The court may order: cessation of the infringing act; payment of damages; seizure, forfeiture and destruction of infringing goods and materials used in their production; publication of the judgment. Criminal penalties for IP infringement: any person who intentionally infringes a copyright or related right commits an offence punishable by a fine of FRW 50,000 to FRW 50,000,000; for counterfeiting registered trademarks or patents, the fine is FRW 500,000 to FRW 500,000,000 and imprisonment of one (1) to ten (10) years; repeat offenders face double penalties. Border measures allow customs authorities to detain suspected counterfeit and pirated goods at the request of the right holder.',
  2009,
  'Law No. 31/2009 of 26/10/2009 on the protection of intellectual property in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- ENVIRONMENT LAW — Law No. 48/2018 of 13/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Environment Law - Environmental Impact Assessment (EIA)',
  'environment',
  'Under Law No. 48/2018, any project, plan or programme likely to have a significant effect on the environment must undergo an Environmental Impact Assessment (EIA) before implementation. The Rwanda Environment Management Authority (REMA) is responsible for reviewing and approving EIA reports. Categories of projects requiring EIA include: large infrastructure works; mining and quarrying operations; industrial facilities; agricultural projects above a specified scale; energy generation plants; waste treatment and disposal facilities; projects in or near protected areas or wetlands. The developer must submit an EIA report prepared by a certified environmental expert. REMA reviews the report and holds a public consultation. REMA may approve the project with or without conditions, request additional information, or reject the project. No competent authority may issue a permit for a project requiring EIA without prior REMA clearance. A project implemented without the required EIA is subject to suspension and penalties.',
  2018,
  'Law No. 48/2018 of 13/08/2018 on environment in Rwanda'
),
(
  'Environment Law - Wetlands, Protected Areas and Biodiversity',
  'environment',
  'Under Law No. 48/2018, wetlands are protected areas of national importance. No person may drain, fill, excavate or carry out any activity that degrades a wetland without authorisation from the competent authority. Buffer zones are established around wetlands and protected areas within which development is restricted. Activities prohibited in protected areas include: clearing of vegetation; hunting, trapping or capturing of wildlife; introduction of alien invasive species; extraction of natural resources without authorisation. Rwanda is a signatory to the Convention on Biological Diversity and the Ramsar Convention on Wetlands. REMA and the Rwanda Forestry Authority (RFA) jointly manage biodiversity conservation. Any person who unlawfully destroys or degrades a protected wetland, forest or biodiversity area commits an offence punishable by imprisonment of two (2) to five (5) years and a fine of FRW 5,000,000 to FRW 50,000,000.',
  2018,
  'Law No. 48/2018 of 13/08/2018 on environment in Rwanda'
),
(
  'Environment Law - Pollution Control and Waste Management',
  'environment',
  'Under Law No. 48/2018, no person may discharge, emit or deposit any pollutant into the environment in quantities or concentrations that exceed prescribed standards. Industrial and commercial operators must obtain environmental permits specifying emission limits and waste management requirements. Hazardous waste must be managed, stored, transported, treated and disposed of in accordance with prescribed procedures. The import, export, transit and disposal of hazardous waste are regulated in accordance with the Basel Convention. Criminal penalties for pollution offences: any person who illegally trades in, imports or dumps hazardous or toxic waste commits an offence punishable by imprisonment of seven (7) to ten (10) years and a fine of FRW 100,000,000 to FRW 200,000,000. A company convicted of the same offence is liable to a fine of FRW 500,000,000 to FRW 1,000,000,000 and may be ordered to cease operations. Persons responsible for oil spills or chemical contamination must bear the full cost of remediation.',
  2018,
  'Law No. 48/2018 of 13/08/2018 on environment in Rwanda'
),
(
  'Environment Law - Climate Change and Enforcement',
  'environment',
  'Under Law No. 48/2018, Rwanda commits to reducing greenhouse gas emissions and adapting to climate change in accordance with its Nationally Determined Contribution (NDC) under the Paris Agreement. Sector ministries must integrate climate change considerations into their policies and investment plans. REMA coordinates national climate change policy and reports to the UNFCCC. For enforcement: REMA environmental inspectors have the power to enter premises, take samples, inspect records and issue compliance orders. A compliance order must specify the violation, the corrective action required and the deadline for compliance. Failure to comply with a compliance order within the specified period constitutes an offence. REMA may seal premises or equipment causing unlawful pollution pending remediation. Appeals against REMA decisions may be filed with the Minister within thirty (30) days and thereafter with the competent court.',
  2018,
  'Law No. 48/2018 of 13/08/2018 on environment in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- NOTARIES LAW — Law No. 13bis/2014 of 21/05/2014
-- ══════════════════════════════════════════════════════════
(
  'Notaries Law - Qualifications and Appointment of Notaries',
  'notary',
  'Under Law No. 13bis/2014, a notary is a public officer appointed by the Minister in charge of justice to authenticate legal documents and perform other notarial acts. To be appointed as a notary in Rwanda, a person must: be a Rwandan national; hold at least a bachelor degree in law; have completed a professional training programme in notarial practice; have practiced as a trainee notary for at least two (2) years under the supervision of a practicing notary; pass the notarial aptitude examination administered by the Rwanda Bar Association; be of good moral character and not have been convicted of an offence involving moral turpitude. The Minister appoints notaries to specific notarial offices by ministerial order. The number and geographical distribution of notarial offices is determined by the Minister based on the needs of the population. A notary cannot practice in more than one notarial office.',
  2014,
  'Law No. 13bis/2014 of 21/05/2014 relating to the organisation and functioning of notariat in Rwanda'
),
(
  'Notaries Law - Notarial Acts: Authenticity and Effects',
  'notary',
  'Under Law No. 13bis/2014, notarial acts are authentic instruments that have full probative value and are enforceable without further court action. A notarial act is authentic if it: was drawn up by a competent notary in the territory of that notary jurisdiction; followed the prescribed form; bears the notary seal and signature. Documents that must be executed before a notary include: marriage contracts; gifts inter vivos of immovable property; constitutive acts of companies and amendments thereto; mortgages and property charges; wills of certain types; sales of immovable property; powers of attorney for real estate transactions. A notarial act is void if: the notary was not competent or not impartial; mandatory formalities were omitted; the parties lacked legal capacity. A void notarial act may still be valid as a private document if signed by the parties. Copies and extracts of notarial acts are issued only to the parties, their successors, or persons authorised by the parties or a competent court.',
  2014,
  'Law No. 13bis/2014 of 21/05/2014 relating to the organisation and functioning of notariat in Rwanda'
),
(
  'Notaries Law - Disciplinary Sanctions and Professional Conduct',
  'notary',
  'Under Law No. 13bis/2014, notaries are subject to professional discipline for breaches of their duties and obligations. The disciplinary authority for notaries is the disciplinary chamber of the Rwanda Bar Association. Sanctions available in order of severity: (1) Warning — for minor violations or first offences; (2) Reprimand — for repeated minor violations or moderate violations; (3) Suspension — temporary prohibition from practicing notarial activities for a period of one (1) month to two (2) years for serious violations; (4) Definitive removal from the notarial register — for the most serious violations including: conviction for a criminal offence; repeated serious breaches of professional obligations; fraudulent conduct in the exercise of notarial duties; misappropriation of client funds. A notary who is definitively removed is prohibited from practicing as a notary again. The Minister in charge of justice may temporarily suspend a notary pending disciplinary proceedings where the public interest requires it.',
  2014,
  'Law No. 13bis/2014 of 21/05/2014 relating to the organisation and functioning of notariat in Rwanda'
);
