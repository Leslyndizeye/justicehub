-- CORRECTIONS AND UPDATES — Replace outdated law entries with 2024 versions
-- Run this AFTER all previous seed files
-- This file: DELETES old entries, INSERTS corrected/updated versions

-- ══════════════════════════════════════════════════════════
-- STEP 1: Remove outdated entries superseded by 2024 laws
-- ══════════════════════════════════════════════════════════

DELETE FROM legal_documents WHERE source LIKE '%31/2009%' AND category = 'intellectual_property';
DELETE FROM legal_documents WHERE source LIKE '%32/2016%' AND category IN ('family', 'succession');
DELETE FROM legal_documents WHERE source LIKE '%13/2014%' AND category = 'immigration' AND title LIKE '%Refugee%';
DELETE FROM legal_documents WHERE title LIKE '%Education Law%' AND year = 2019;

-- ══════════════════════════════════════════════════════════
-- STEP 2: Insert updated 2024 versions
-- ══════════════════════════════════════════════════════════

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ──────────────────────────────────────────────────────────
-- INTELLECTUAL PROPERTY LAW — Law No. 055/2024 of 20/06/2024
-- (Replaces Law No. 31/2009)
-- ──────────────────────────────────────────────────────────
(
  'Intellectual Property Law 2024 - Patents: Requirements, Duration and Compulsory Licences',
  'intellectual_property',
  'Under Law No. 055/2024 on protection of intellectual property in Rwanda (replacing Law 31/2009): A patent may be granted for any invention that is new, involves an inventive step, and is industrially applicable. Novelty means the invention does not form part of the state of the art globally. An inventive step means the invention would not be obvious to a person skilled in the relevant field. Patent applications are filed with the Rwanda Intellectual Property Authority (RIPA) under the Rwanda Development Board (RDB). The application must contain a full description enabling a skilled person to reproduce the invention, claims defining the scope of protection, an abstract, and drawings where necessary. A granted patent confers the exclusive right to exploit the invention in Rwanda for twenty (20) years from the filing date, subject to annual maintenance fees. After expiry the invention enters the public domain. Compulsory licences may be granted by the competent authority in cases of: national emergency or extreme urgency; public non-commercial use; anti-competitive practices by the patent holder; or failure to work the patent in Rwanda within four (4) years of filing or three (3) years of grant without legitimate reason. Rwanda is a member of the Patent Cooperation Treaty (PCT) and the African Regional Intellectual Property Organisation (ARIPO).',
  2024,
  'Law No. 055/2024 of 20/06/2024 on protection of intellectual property in Rwanda'
),
(
  'Intellectual Property Law 2024 - Trademarks, Copyright and Digital Rights',
  'intellectual_property',
  'Under Law No. 055/2024: Trademark protection covers any sign capable of distinguishing goods or services — words, logos, colours, shapes, sounds and combinations. Registration with RIPA gives exclusive rights for ten (10) years, renewable indefinitely. Well-known marks are protected even without registration in Rwanda. Copyright protects original literary, artistic and scientific works including software, databases and digital content automatically upon creation without registration. The author holds economic rights (reproduction, distribution, communication to the public, making available online) and moral rights (attribution, integrity). Economic rights last for the life of the author plus fifty (50) years. For digital and online environments: the right of making available to the public covers streaming, downloading and any on-demand access to works via internet or digital networks. Internet service providers benefit from safe harbour protection if they act as mere conduits and promptly remove infringing content on notification. Related rights protect performers, phonogram producers, and broadcasters for fifty (50) years from performance or publication. Collective management organisations (CMOs) are licensed by RIPA to collect and distribute royalties on behalf of right holders. Enforcement: civil damages, criminal penalties of RWF 500,000 to RWF 500,000,000 and imprisonment of one (1) to ten (10) years for wilful infringement at commercial scale. Border measures allow seizure of counterfeit and pirated goods at customs.',
  2024,
  'Law No. 055/2024 of 20/06/2024 on protection of intellectual property in Rwanda'
),
(
  'Intellectual Property Law 2024 - Industrial Designs, Geographical Indications and Trade Secrets',
  'intellectual_property',
  'Under Law No. 055/2024: Industrial design protection covers the ornamental or aesthetic aspect of a product. Registration at RIPA gives exclusive rights for five (5) years from filing, renewable twice for a maximum of fifteen (15) years. Unregistered designs may be protected against slavish copying for three (3) years. Geographical indications (GIs) identify products originating from a specific territory with qualities or reputation attributable to that origin. Rwanda has registered GIs for premium products including Rwandan single-origin coffee and Rwandan tea. Using a GI for products not meeting the specification or misusing the designation of origin is an offence. Trade secrets are confidential business information giving competitive advantage. Misappropriation by improper means including espionage, breach of contract or electronic intrusion is actionable civilly and criminally. Utility models protecting minor innovations are granted for ten (10) years. Plant varieties developed by breeders are protected under a plant breeders rights regime aligned with UPOV. RIPA is the national authority for all IP registration, enforcement coordination and international IP treaty obligations. Rwanda is a signatory to the Berne Convention, Paris Convention, Madrid Protocol on trademarks, and the TRIPS Agreement under the WTO. Disputes about IP rights are resolved by the Commercial Court as specialised IP jurisdiction.',
  2024,
  'Law No. 055/2024 of 20/06/2024 on protection of intellectual property in Rwanda'
),

-- ──────────────────────────────────────────────────────────
-- PERSONS AND FAMILY LAW — Law No. 071/2024 of 26/06/2024
-- (Replaces Law No. 32/2016)
-- ──────────────────────────────────────────────────────────
(
  'Persons and Family Law 2024 - Marriage: Formation, Requirements and Consent',
  'family',
  'Under Law No. 071/2024 governing persons and family in Rwanda (replacing Law 32/2016): Marriage is a civil institution formed through the free and full consent of two persons before the competent civil registrar. No religious or customary ceremony has legal effect without prior civil registration. Requirements for a valid civil marriage: both parties must be at least eighteen (18) years of age; full and free consent of both parties; absence of a prior undissolved marriage (monogamy); no prohibited degree of consanguinity or affinity; and declaration before the civil registrar in the presence of two witnesses. The civil registrar verifies the identity and capacity of both parties before celebrating the marriage. A marriage celebrated by coercion, fraud or mistake as to the identity of the spouse may be annulled. Publication of banns (public notice of intended marriage) must be posted for fifteen (15) days before the celebration to allow objections. A marriage may be contracted by proxy only in exceptional circumstances and requires prior authorisation. Foreign nationals marrying in Rwanda must produce a certificate of celibacy from their country of origin. Rwandan nationals marrying abroad must register the marriage with the competent Rwandan authority within three (3) months of return. The civil register of marriages is the conclusive legal record of a marriage; customary or religious evidence alone is not sufficient.',
  2024,
  'Law No. 071/2024 of 26/06/2024 governing persons and family in Rwanda'
),
(
  'Persons and Family Law 2024 - Matrimonial Property, Divorce and Separation',
  'family',
  'Under Law No. 071/2024: Matrimonial property regime: spouses may choose their property regime in a marriage contract executed before a notary before the wedding. In the absence of a marriage contract, the default regime is community of acquests — all property acquired during marriage is jointly owned equally by both spouses. Property owned before marriage and property received by inheritance or gift during marriage remains personal property of each spouse unless brought into community. Either spouse may manage and dispose of community property for ordinary acts; major disposals including sale of immovable property require consent of both spouses. Divorce: spouses may divorce by mutual consent before a notary if they agree on all consequences including property division, child custody and support. Contested divorce is filed before the Primary Court. Grounds for contested divorce include: irretrievable breakdown of marriage; abandonment for more than two (2) years; cruel or degrading treatment; and serious neglect of family obligations. The court may order a six-month reconciliation period before pronouncing divorce. Financial consequences of divorce: community property is divided equally unless the court adjusts the share based on contributions and needs. A financially dependent spouse may be awarded maintenance for a defined period. Parental authority over children is exercised jointly by both parents after divorce; the court determines residence and visiting rights in the best interests of the child.',
  2024,
  'Law No. 071/2024 of 26/06/2024 governing persons and family in Rwanda'
),
(
  'Persons and Family Law 2024 - Parental Authority, Child Support and Legal Persons',
  'family',
  'Under Law No. 071/2024: Parental authority is exercised jointly by both parents during and after marriage. Each parent has the right and duty to: maintain and educate the child; protect the child health and safety; represent the child in legal acts; and manage the child property in the child interest. A parent who seriously fails in parental duties may have parental authority suspended or removed by court order. Child support: both parents must contribute to the maintenance, education and healthcare of their children in proportion to their respective financial capacities. The court fixes child support amounts upon separation, divorce or at any time on application. Child support is automatically indexed to inflation. A parent who persistently defaults on court-ordered child support faces imprisonment and automatic deduction of support from salary or income. Legal capacity: every natural person acquires full legal capacity at eighteen (18) years. Minors are represented by parents or a guardian. A mentally incapacitated adult may be placed under guardianship by court order; the guardian acts in the person interest but must obtain court approval for major decisions. Persons Law provisions include: rules on domicile and residence for legal purposes; civil status documentation (birth, marriage, death certificates); procedures for correction of civil status records; and declaration of absence and presumption of death for persons missing for more than seven (7) years.',
  2024,
  'Law No. 071/2024 of 26/06/2024 governing persons and family in Rwanda'
),
(
  'Persons and Family Law 2024 - Succession: Testate and Intestate Inheritance',
  'succession',
  'Under Law No. 071/2024: Succession is governed by the law of the last domicile of the deceased for movable property and by the law of the location of the property for immovable property. Testate succession: a person may dispose of their property by will in notarial, holographic (handwritten and signed), or witnessed written form. The reserved portion of the estate that must pass to compulsory heirs (children and surviving spouse) is: one half (1/2) for one child; two thirds (2/3) for two children; three quarters (3/4) for three or more children. The surviving spouse is entitled to retain the matrimonial home and is a compulsory heir. The remainder beyond reserved portions is the freely disposable quota. A will may be revoked by a subsequent notarial act, new will, or physical destruction. Intestate succession order: (1) descendants (children equally regardless of gender or marital status of parents); (2) surviving spouse and ascendants; (3) collateral relatives to the fourth degree. A child born outside marriage inherits equally with children born in marriage. An adopted child has full inheritance rights. A person who caused the death of the deceased is excluded from inheriting. Inheritance rights prescribe five (5) years from the date of death or from when the heir became aware of the death. Estate debts must be paid before distribution to heirs; heirs are not personally liable for debts beyond the estate assets.',
  2024,
  'Law No. 071/2024 of 26/06/2024 governing persons and family in Rwanda — succession provisions'
),

-- ──────────────────────────────────────────────────────────
-- REFUGEES LAW — Law No. 042/2024
-- (Replaces Law No. 13/2014)
-- ──────────────────────────────────────────────────────────
(
  'Refugees Law 2024 - Recognition, Rights and Obligations of Refugees',
  'immigration',
  'Under Law No. 042/2024 governing refugees and applicants for refugee status in Rwanda (replacing Law 13/2014): A refugee is a person outside their country of nationality unable or unwilling to return due to well-founded fear of persecution based on race, religion, nationality, membership of a particular social group, or political opinion, or due to serious threats arising from generalised violence, foreign aggression or massive human rights violations. An asylum seeker must apply for refugee status to the Refugee Eligibility Committee (REC) upon or shortly after arrival. The REC determines refugee status through individual assessment. The principle of non-refoulement is absolute — no person may be returned to a country where they face a real risk to their life or freedom. A recognised refugee has the right to: reside legally in Rwanda; work and engage in business with a permit; access education and healthcare; obtain travel documents; access courts; and receive the same treatment as nationals regarding social services. Rwanda practices a progressive refugee policy including the right to freedom of movement, the right to work, and pathways to long-term residency. Rwanda has hosted large refugee populations from DRC and Burundi. The Rwanda Governance Board (RGB) manages refugee status determination and durable solutions. Revocation of refugee status occurs when a person re-establishes in their country of origin, obtains protection of a third country, or is excluded on security or serious crime grounds.',
  2024,
  'Law No. 042/2024 governing refugees and applicants for refugee status in Rwanda'
),
(
  'Refugees Law 2024 - Exclusion, Cessation and Refugee Camps Management',
  'immigration',
  'Under Law No. 042/2024: Exclusion from refugee status applies to persons who: have committed a crime against peace, a war crime or a crime against humanity; have committed a serious non-political crime outside Rwanda before admission; or are guilty of acts contrary to the purposes and principles of the United Nations. A refugee who commits a serious crime in Rwanda may have their status revoked and face prosecution under Rwandan law. Asylum seekers and refugees must: respect Rwandan laws and regulations; not engage in activities threatening national security or public order; not engage in political activities against their country of origin or other countries from Rwanda; and present themselves when requested by competent authorities. Refugee camps and settlements are managed by the RGB in cooperation with UNHCR and partner organisations. Rwanda operates an urban refugee policy allowing refugees to live in cities and rural areas rather than being confined to camps. Rwanda has signed refugee integration framework agreements allowing long-staying refugees a pathway to permanent residency and citizenship. A rejected asylum seeker who has exhausted appeal remedies is subject to deportation but may not be returned to a country where they face persecution. Voluntary repatriation is facilitated when the country of origin is considered safe; no refugee may be compelled to return. Rwanda receives emergency evacuees from other African countries under African Union frameworks including the Emergency Transit Mechanism (ETM).',
  2024,
  'Law No. 042/2024 governing refugees and applicants for refugee status in Rwanda'
),

-- ──────────────────────────────────────────────────────────
-- EDUCATION LAW — Law No. 10/2021 of 09/09/2021
-- (Updates Law No. 27/2019)
-- ──────────────────────────────────────────────────────────
(
  'Education Law 2021 - Organisation of Education System and Governance',
  'education',
  'Under Law No. 10/2021 on the organisation of education in Rwanda: Education in Rwanda is organised into five levels: early childhood development (ECD) for children aged 0 to 6; basic education covering nine (9) years of primary and lower secondary; upper secondary education of three (3) years; technical and vocational education and training (TVET); and higher education. Basic education (primary and lower secondary, nine years) is free and compulsory for all Rwandan children. The Twelve Year Basic Education (12YBE) policy extends free government-supported education through upper secondary. The Ministry of Education (MINEDUC) sets national curriculum, qualification frameworks, standards and policy. The Rwanda Education Board (REB) implements curriculum, manages national examinations, and coordinates teacher development. The Rwanda Higher Education Council (HEC) accredits and regulates universities and higher education institutions. The Rwanda Polytechnic (RP) manages technical and vocational colleges across the country. Private schools and universities must be accredited before enrolling students. Language of instruction: Kinyarwanda in early years; English as the primary medium from primary onwards; French available as an additional language. Academic freedom at university level is guaranteed. The National Curriculum Development Centre develops and reviews curricula aligned with national development priorities. Education quality assurance is conducted through the Rwanda Education Quality Monitoring body.',
  2021,
  'Law No. 10/2021 of 09/09/2021 on the organisation of education in Rwanda'
),
(
  'Education Law 2021 - Teachers, Learner Rights and Examination Standards',
  'education',
  'Under Law No. 10/2021: Teaching is a regulated profession. Teachers at public schools must hold qualifications approved by the competent authority and must be registered with the Rwanda Education Board. Teacher training is provided through the University of Rwanda College of Education and teacher training colleges. Teachers are civil servants governed by the Teachers Statute which sets conditions of service, probation, promotion, discipline and retirement. A teacher who subjects a learner to corporal punishment, sexual abuse or any form of degrading treatment is subject to immediate disciplinary dismissal and criminal prosecution. Learner rights: every learner has the right to quality education; a safe, inclusive, non-discriminatory learning environment; access to adequate facilities; and to be free from bullying, abuse, and discrimination. A female student who becomes pregnant must be allowed to continue studying or to return after giving birth; expulsion on grounds of pregnancy is prohibited. National examinations are administered by REB for Primary Leaving Examinations (P6), Senior 3 examinations and National Examinations at the end of Senior 6. Examination irregularities including cheating, impersonation and leaking of papers are criminal offences punishable by disqualification, fines and imprisonment. Certificates and academic qualifications obtained through fraud are null and void. Foreign qualifications must be recognised by HEC before use in Rwanda.',
  2021,
  'Law No. 10/2021 of 09/09/2021 on the organisation of education in Rwanda'
),

-- ──────────────────────────────────────────────────────────
-- CIVIL PROCEDURE — Amendments by Law No. 007/2023
-- ──────────────────────────────────────────────────────────
(
  'Civil Procedure Law 2023 Amendment - Key Changes to Law No. 22/2018',
  'civil_procedure',
  'Law No. 007/2023 of 22/01/2024 amended Law No. 22/2018 on civil, commercial, labour and administrative procedure in Rwanda. Key amendments: Electronic filing through IECMS is now mandatory for all civil, commercial and administrative cases; paper filing is only permitted in exceptional circumstances approved by the court registrar. Time limits for certain procedural steps have been adjusted to reflect the IECMS digital environment. Service of process electronically through IECMS notifications is now the primary method of service; physical service is secondary. The pre-trial conference procedure has been strengthened — courts must conduct mandatory case management conferences to narrow issues, promote settlement and set hearing timetables before trial. Summary judgment procedure has been clarified: a party may apply for summary judgment where there is no genuine dispute of fact and the claim is clear on the law. Appeals: the time limit for filing an appeal remains thirty (30) days from notification of the judgment. However, requests for copies of judgments toll the appeal period and must be provided within prescribed timelines. Mediation: courts must refer appropriate cases to court-connected mediation before proceeding to trial; refusal to participate in court-ordered mediation without good cause may be considered in costs orders. Expert witnesses: courts may appoint independent court experts in technical cases; party-appointed experts must meet qualification standards set by the Supreme Court.',
  2023,
  'Law No. 007/2023 of 22/01/2024 amending Law No. 22/2018 on civil, commercial, labour and administrative procedure in Rwanda'
),

-- ──────────────────────────────────────────────────────────
-- COURTS JURISDICTION — Amendment by Law No. 041/2024
-- ──────────────────────────────────────────────────────────
(
  'Courts Jurisdiction 2024 Amendment - Changes to Court Jurisdiction Thresholds',
  'civil_procedure',
  'Law No. 041/2024 of 19/04/2024 amended Law No. 30/2018 determining the jurisdiction of courts in Rwanda. Key changes: The monetary jurisdiction thresholds for Primary Courts, Intermediate Courts and the High Court have been revised upward to reflect economic changes and reduce congestion at higher courts. Primary Courts now have expanded jurisdiction over civil and commercial matters up to revised thresholds. The Commercial Court chamber at the High Court has exclusive jurisdiction over all commercial matters above prescribed thresholds regardless of the parties locations. A new provision clarifies that electronic commerce disputes and disputes arising from digital platform transactions fall within commercial jurisdiction. Arbitration-related court applications including applications to set aside awards and applications for recognition and enforcement are exclusively handled by the High Court commercial chamber. The administrative court jurisdiction is clarified: disputes about the application of public procurement rules must be resolved through the RPPA complaint mechanism before any court filing. Labour disputes: the Labour Court at the Intermediate Court level handles all employment disputes; matters involving senior public servants remain with the High Court. Family cases including divorce, child custody and succession are assigned to the Primary Court as first instance regardless of the value involved, to improve access for families. Cases pending before courts under the old thresholds continue under the previous rules until concluded.',
  2024,
  'Law No. 041/2024 of 19/04/2024 amending Law No. 30/2018 determining the jurisdiction of courts in Rwanda'
),

-- ──────────────────────────────────────────────────────────
-- JUDICIARY ORGANISATION — Amendment by Law No. 074/2024
-- ──────────────────────────────────────────────────────────
(
  'Judiciary Law 2024 Amendment - Digital Courts and Case Management Reforms',
  'civil_procedure',
  'Law No. 074/2024 of 29/11/2024 amended Law No. 012/2018 on the organisation and functioning of the judiciary in Rwanda. Key amendments: The judiciary is mandated to fully digitalise court operations through the Integrated Electronic Case Management System (IECMS). All courts must conduct hearings in a manner compatible with digital evidence and electronic submissions. Videoconference hearings are expressly authorised for all categories of cases subject to consent of the parties or court order; videoconference hearings have full legal validity. The use of artificial intelligence tools for case management, research support and scheduling is permitted subject to oversight by the Supreme Court. The position of Technology Court Officer is established in each court to manage digital systems and support parties with limited digital access. Judicial performance: each judge is subject to annual performance evaluation on case clearance rates, quality of judgments, and adherence to procedural timelines; results inform promotions and resource allocation. A party whose case exceeds prescribed time limits may apply to the President of the court for an accelerated hearing order. Publication of judgments: all judgments except those in camera are published on the official courts digital portal within thirty (30) days of pronouncement. Interpretation services must be provided by the court at no cost to parties who do not speak the language of the proceedings.',
  2024,
  'Law No. 074/2024 of 29/11/2024 amending Law No. 012/2018 on organisation and functioning of the judiciary in Rwanda'
);
