-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Land Tenure Law 43/2013, Rent Restriction Law 10/2016,
--         Gender-Based Violence Law 59/2008, Legal Aid Law 61/2016,
--         Genocide Ideology Law 84/2013, Penal Code selected provisions,
--         Administrative Courts Law 30/2018bis
-- Run this AFTER seed_competition_resources.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- RENT / TENANCY LAW — Law No. 10/2016 of 05/05/2016
-- ══════════════════════════════════════════════════════════
(
  'Tenancy Law - Lease Agreements, Rights and Obligations of Parties',
  'tenancy',
  'Under Law No. 10/2016 on lease of premises in Rwanda: A lease agreement for residential or commercial premises must be in writing and registered with the competent authority. The lease must specify: the identity of the parties; a description of the premises; the amount of rent; the lease period; and the obligations of each party regarding maintenance, repairs, utilities and deposit. A security deposit may not exceed three (3) months rent and must be returned within one (1) month of the end of the lease unless deductions are justified in writing. Rent increases are subject to the notice requirement of at least three (3) months and must be justified. A tenant cannot be evicted without a court order except where the lease has expired and the tenant refuses to vacate. A landlord who cuts off utilities or changes locks to force a tenant out without a court order commits an unlawful act and the tenant may obtain an emergency court order for restoration. The tenant must maintain the premises in good condition and may not sublet without the landlord written consent unless the lease permits it. Disputes between landlords and tenants are referred to the court of first instance and the court may order specific performance, damages or termination of the lease.',
  2016,
  'Law No. 10/2016 of 05/05/2016 on lease of premises in Rwanda'
),
(
  'Tenancy Law - Eviction, Notice Periods and Dispute Resolution',
  'tenancy',
  'Under Law No. 10/2016: A landlord may terminate a lease by giving the tenant written notice of: one (1) month for a monthly lease; three (3) months for a lease of six (6) months to one (1) year; and six (6) months for a lease of more than one (1) year. A lease may be terminated immediately by the landlord if the tenant: fails to pay rent for three (3) consecutive months; causes serious damage to the premises; uses the premises for illegal activities; or sublets without authorisation. A tenant may terminate a lease by giving the required notice period or immediately if the landlord: fails to maintain the premises in a habitable condition; fails to make agreed repairs; or unlawfully interferes with the tenant quiet enjoyment. Eviction proceedings must be brought before the competent court. The court may award the tenant a period of grace for payment of rent arrears before ordering eviction. A landlord who obtains a court eviction order must arrange for enforcement by the court bailiff; self-help eviction is prohibited. Commercial tenants who have operated in premises for more than three (3) years have a right to lease renewal which can only be denied with compensation for loss of goodwill.',
  2016,
  'Law No. 10/2016 of 05/05/2016 on lease of premises in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- GENDER-BASED VIOLENCE LAW — Law No. 59/2008 of 10/09/2008
-- ══════════════════════════════════════════════════════════
(
  'Gender-Based Violence Law - Definition, Protection Orders and Offences',
  'family',
  'Under Law No. 59/2008 on prevention and punishment of gender-based violence in Rwanda: Gender-based violence (GBV) means any act or omission that causes or is likely to cause physical, sexual, psychological or economic harm to a person based on their gender. Forms of GBV covered include: domestic violence; sexual violence; sexual harassment; forced marriage; marital rape; exploitation; and denial of resources or opportunities based on gender. A victim of GBV may apply to the court for a protection order without the need to file criminal charges first. A protection order may prohibit the abuser from: contacting or approaching the victim; remaining in the shared home; and using or threatening violence. Violating a protection order is a criminal offence punishable by imprisonment of one (1) to three (3) years. Spousal rape committed within marriage is recognised as an offence under this law. Penalties for GBV offences: sexual violence is punishable by imprisonment of five (5) to ten (10) years; aggravated forms (against minors, using weapons, committed by multiple perpetrators) are punishable by life imprisonment. Domestic violence causing bodily harm is punishable by imprisonment of two (2) to five (5) years. Economic deprivation or denial of resources within the family is punishable by imprisonment of six (6) months to two (2) years.',
  2008,
  'Law No. 59/2008 of 10/09/2008 on prevention and punishment of gender-based violence in Rwanda'
),
(
  'Gender-Based Violence Law - Support Services, Reporting and Victim Rights',
  'family',
  'Under Law No. 59/2008: Victims of gender-based violence have the right to: medical care and psychosocial support at no cost; legal assistance including access to legal aid; protection from retaliation; and confidentiality of their identity and personal information. Health facilities must examine and treat GBV victims and document injuries. Medical certificates issued by health professionals are admissible as evidence in criminal and civil proceedings. Social workers, health professionals, teachers and any person working with children are mandatory reporters and must report suspected GBV against children to the authorities. Failure by a mandatory reporter to report known or suspected GBV against a child is a punishable offence. The Isange One Stop Centres established in major hospitals provide integrated services to GBV victims including medical treatment, police statements, legal aid, psychosocial support and temporary shelter. The National Women Council and local nyumbakumi leaders are designated community entry points for reporting GBV. A perpetrator ordered by the court to pay compensation to the victim who fails to pay is subject to compulsory enforcement proceedings.',
  2008,
  'Law No. 59/2008 of 10/09/2008 on prevention and punishment of gender-based violence in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- GENOCIDE IDEOLOGY LAW — Law No. 84/2013 of 11/09/2013
-- ══════════════════════════════════════════════════════════
(
  'Genocide Ideology Law - Definition, Offences and Penalties',
  'criminal',
  'Under Law No. 84/2013 relating to the crime of genocide ideology and other related offences in Rwanda: Genocide ideology means any deliberate act committed in public whether through spoken word, written materials, video, images, gestures or any other means aimed at propagating a genocidal ideology or promoting the crime of genocide. The following constitute offences: (1) genocide ideology — punishable by imprisonment of ten (10) to twenty-five (25) years; (2) incitement to discrimination — punishable by imprisonment of five (5) to nine (9) years; (3) incitement to sectarianism based on ethnicity, region or origin — punishable by imprisonment of five (5) to nine (9) years; (4) trivialising the genocide against the Tutsi or justifying its commission — punishable by imprisonment of five (5) to nine (9) years. If the offence is committed by a media organ, the media organ may be closed for a period of six (6) months to one (1) year. If committed by a foreigner, expulsion may be ordered in addition to imprisonment. A legal entity convicted of genocide ideology offences may be dissolved and its assets confiscated. These offences are imprescriptible — they do not become statute-barred by the passage of time.',
  2013,
  'Law No. 84/2013 of 11/09/2013 relating to the crime of genocide ideology and other related offences in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- LEGAL AID LAW — Law No. 61/2016 of 15/12/2016
-- ══════════════════════════════════════════════════════════
(
  'Legal Aid Law - Entitlement, Providers and Services',
  'legal_aid',
  'Under Law No. 61/2016 on legal aid in Rwanda: Legal aid means free legal assistance provided to persons who cannot afford the costs of legal representation or access to legal services. Persons entitled to legal aid include: persons deprived of liberty awaiting trial who lack financial means; persons facing criminal charges for serious offences carrying imprisonment of more than two (2) years; children in conflict with the law; victims of serious crimes including sexual violence and GBV; and persons who are vulnerable due to poverty, disability, mental illness or other circumstances. Legal aid services include: legal advice and counselling; preparation of legal documents; representation before courts, tribunals and administrative bodies; and alternative dispute resolution assistance. Legal aid providers include: the Rwanda Bar Association through its pro bono programme; University law clinics; accredited civil society organisations; and the Legal Aid Forum. The National Legal Aid Coordinating Committee coordinates legal aid policy and resource allocation. The Government allocates a budget for legal aid to ensure its effective delivery. Any person denied legal aid may request review of the decision by the legal aid provider management. Quality standards for legal aid providers are set and monitored by the competent authority.',
  2016,
  'Law No. 61/2016 of 15/12/2016 on legal aid in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- LAND REGISTRATION AND TENURE — Law No. 43/2013 of 16/06/2013
-- ══════════════════════════════════════════════════════════
(
  'Land Law - Land Tenure System, Registration and Certificates',
  'land',
  'Under Law No. 43/2013 determining the use and management of land in Rwanda: All land in Rwanda belongs to the State. Citizens and legal entities may hold land under leasehold tenure. Long-term leaseholds of up to ninety-nine (99) years are granted to Rwandan nationals and legal entities. Foreign nationals and foreign-owned companies may hold leaseholds of up to fifty (50) years. Every parcel of land must be registered in the National Land Register maintained by the Rwanda Land Management and Use Authority (RLMUA). A land title (certificate of land occupation) is issued to the registered holder and constitutes conclusive evidence of the right to use and occupy the land. Transfer of land rights must be registered to be effective against third parties. Any transaction involving land including sale, mortgage, gift, lease or partition must be executed before a notary and registered. Customary land rights that were recognised during the national land registration process are converted to formal leaseholds. Land rights of women and men are equal; a married woman has an equal right with her husband to land acquired during marriage. Co-ownership of land by spouses must be reflected in the land certificate.',
  2013,
  'Law No. 43/2013 of 16/06/2013 determining the use and management of land in Rwanda'
),
(
  'Land Law - Land Use Zoning, Subdivision and Disputes',
  'land',
  'Under Law No. 43/2013: Land use in Rwanda is governed by a national land use master plan and district land use plans approved by the relevant authorities. Land is classified into use zones including: agricultural land, industrial zones, commercial zones, residential areas, conservation areas, and infrastructure corridors. A landowner must use the land in conformity with its designated use category. Subdivision of land is regulated and must be authorised to prevent excessive fragmentation. The minimum plot sizes for agricultural and residential land are prescribed by ministerial order. Land disputes between neighbours over boundaries, access rights or ownership are first referred to the Cell Land Committee for mediation. If mediation fails, the dispute is referred to the Sector Land Committee and thereafter to the competent court. A squatter who has occupied land in good faith and made improvements for a continuous period of at least ten (10) years without objection may apply for regularisation of their occupation rights. The expropriation of land for public interest follows the procedures established in the Expropriation Law No. 32/2015. Illegal occupation of government land or protected areas is punishable by eviction and fines.',
  2013,
  'Law No. 43/2013 of 16/06/2013 determining the use and management of land in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- ADMINISTRATIVE COURTS — Law No. 30/2018 of 02/06/2018
-- ══════════════════════════════════════════════════════════
(
  'Administrative Courts - Jurisdiction and Challenging Government Decisions',
  'administrative',
  'Under Law No. 30/2018 relating to the jurisdiction of administrative courts in Rwanda: Administrative courts have exclusive jurisdiction over disputes between private persons and public bodies, including: challenges to the legality of administrative decisions; claims for compensation against the State for unlawful acts of public servants; contractual disputes involving public entities; and disputes relating to the status of civil servants. A person who is aggrieved by an administrative decision must first exhaust internal administrative remedies (hierarchical appeal) before approaching the administrative court. The time limit for challenging an administrative decision before court is three (3) months from the date of notification of the final administrative decision or expiry of the deadline for the authority to respond. Administrative courts may: annul an unlawful decision; order the administration to take a required action; and award compensation for damage caused by unlawful administrative action. The State is vicariously liable for unlawful acts of its servants committed in the exercise of official duties. Public servants who commit intentional unlawful acts causing harm to citizens may be personally liable in addition to the State. Appeals against decisions of administrative courts of first instance lie to the High Court administrative chamber.',
  2018,
  'Law No. 30/2018 of 02/06/2018 relating to the jurisdiction of administrative courts in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- COMPANY LAW — Additional entries on Governance and Insolvency
-- ══════════════════════════════════════════════════════════
(
  'Company Law - Director Duties, Liability and Corporate Governance',
  'company',
  'Under Law No. 17/2018 of 13/04/2018 relating to companies in Rwanda: Directors of a company owe fiduciary duties to the company including: duty of loyalty — to act in the best interests of the company and avoid conflicts of interest; duty of care — to act with the skill and diligence of a reasonably prudent person in their position; and duty of confidentiality. A director who has a personal interest in a transaction involving the company must disclose that interest and may not vote on the matter. A director who breaches their duties is personally liable to the company for any resulting loss. Shareholders holding at least ten percent (10%) of shares may bring a derivative action on behalf of the company against a director for breach of duties. Company directors are jointly and severally liable for debts incurred by the company when they knew or ought to have known the company was insolvent but continued trading. The Board of Directors must meet at least four (4) times a year. Resolutions of the Board require a quorum and majority as specified in the company statutes. Minutes of Board meetings are legal records of decisions taken. A director who acts beyond their authority (ultra vires) may be personally liable for the resulting obligations.',
  2018,
  'Law No. 17/2018 of 13/04/2018 relating to companies in Rwanda'
),
(
  'Company Law - Insolvency, Liquidation and Creditor Protection',
  'company',
  'Under Law No. 17/2018 relating to companies in Rwanda: A company is insolvent when it is unable to pay its debts as they fall due or when its liabilities exceed its assets. An insolvent company may be placed under judicial administration (receivership) by court order to attempt rescue of the business, or may be wound up (liquidated). A creditor owed a debt that a company cannot pay may apply to the court for a winding-up order after serving a demand notice and waiting twenty-one (21) days without payment. The court may appoint a liquidator who takes control of the company, realises its assets, and distributes proceeds to creditors in the prescribed order of priority: secured creditors first; then preferential creditors including unpaid employee wages and tax debts up to prescribed limits; then unsecured creditors ratably. A company director who transfers assets or makes preferential payments to connected persons within six (6) months before insolvency to defeat creditors commits a fraudulent act and the transaction may be set aside by the court. Upon completion of liquidation the company is deregistered. A company may be voluntarily wound up by special resolution of shareholders when solvent; the voluntary liquidation procedure is simpler and does not require court supervision.',
  2018,
  'Law No. 17/2018 of 13/04/2018 relating to companies in Rwanda'
);
