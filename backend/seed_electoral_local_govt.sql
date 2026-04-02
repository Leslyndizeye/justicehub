-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Electoral Law 06/2018, Political Organisations Law 10/2013,
--         Decentralisation Law 87/2013, Disability Law 01/2007,
--         Education Law 27/2019, Microfinance Law 40/2008
-- Run this AFTER seed_agriculture_health_tourism.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- ELECTORAL LAW — Law No. 06/2018 of 07/03/2018
-- ══════════════════════════════════════════════════════════
(
  'Electoral Law - Right to Vote, Registration and Electoral Commission',
  'electoral',
  'Under Law No. 06/2018 governing elections in Rwanda: Every Rwandan citizen who has attained the age of eighteen (18) years has the right to vote in elections and referenda. Persons who are disqualified from voting include: persons who have been convicted of certain serious criminal offences and whose civil rights have been suspended; persons declared mentally incapacitated by a court. The National Electoral Commission (NEC) is the independent constitutional body responsible for organising and supervising all elections and referenda in Rwanda. Voter registration is conducted by the NEC through voter registration exercises. A voter must register in the cell where they are resident. The voter register is displayed publicly for verification and correction before each election. Election campaigns may only begin after the official campaign period declared by the NEC. Candidates must meet eligibility requirements including: Rwandan citizenship; minimum age of eighteen (18) years for local elections and twenty-one (21) years for national elections; not being disqualified by the Constitution or applicable law. The Constitution reserves thirty percent (30%) of seats in Parliament for women; in practice women hold significantly more than this minimum.',
  2018,
  'Law No. 06/2018 of 07/03/2018 governing elections in Rwanda'
),
(
  'Electoral Law - Campaign Conduct, Election Offences and Dispute Resolution',
  'electoral',
  'Under Law No. 06/2018: Electoral campaigns must respect principles of equality, fairness and non-discrimination. Prohibited conduct during campaigns includes: vote buying or offering gifts or money to influence voters; using public resources for campaign purposes; inciting violence, ethnic hatred or divisionism; making false statements about other candidates; and campaigning outside the official campaign period. All candidates have equal access to state media during the official campaign period. Electoral offences and penalties: vote buying or electoral corruption is punishable by imprisonment of two (2) to five (5) years and a fine of RWF 500,000 to RWF 5,000,000; interference with the freedom to vote is punishable by imprisonment of one (1) to three (3) years; ballot tampering or fraud is punishable by imprisonment of five (5) to ten (10) years. Electoral disputes including challenges to election results are filed with the Supreme Court for presidential elections, the High Court for parliamentary elections, and lower courts for local elections. An electoral dispute must be filed within three (3) days of the announcement of results. The court must decide electoral disputes within seven (7) days of filing. The court may annul elections and order a re-run where serious irregularities are proven.',
  2018,
  'Law No. 06/2018 of 07/03/2018 governing elections in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- POLITICAL ORGANISATIONS LAW — Law No. 10/2013 of 11/07/2013
-- ══════════════════════════════════════════════════════════
(
  'Political Organisations Law - Registration, Obligations and Prohibitions',
  'political',
  'Under Law No. 10/2013 on the organisation and functioning of political organisations in Rwanda: A political organisation must be registered with the Registrar General to acquire legal personality. Registration requirements include: a name and symbol that is not identical or confusingly similar to existing parties; statutes that comply with the Constitution and the law; a programme of political activities; proof of a minimum number of founding members spread across at least six (6) of the thirty (30) districts; and payment of registration fees. A political organisation must promote national unity and reconciliation and may not be based on ethnicity, religion, race or region. Political organisations are prohibited from: inciting divisionism, sectarianism or discrimination; receiving funding from foreign governments or foreign state-controlled entities; conducting military activities; and operating outside their registered mandate. Every political organisation must publish audited financial accounts annually. The Government allocates public funds to registered political organisations represented in Parliament based on their number of seats. Political organisations participate in the National Consultative Forum coordinated by the Forum of Political Parties. A political organisation that violates the law may be suspended by the Registrar General or dissolved by court order.',
  2013,
  'Law No. 10/2013 of 11/07/2013 on organisation and functioning of political organisations in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- DECENTRALISATION LAW — Law No. 87/2013 of 11/09/2013
-- ══════════════════════════════════════════════════════════
(
  'Decentralisation Law - Administrative Units, Local Councils and Powers',
  'administrative',
  'Under Law No. 87/2013 on decentralisation in Rwanda: Rwanda is divided into administrative units as follows: five (5) Provinces (four provinces and the City of Kigali); thirty (30) Districts; four hundred and sixteen (416) Sectors; two thousand one hundred and forty-eight (2,148) Cells; and approximately fourteen thousand (14,000) Villages (imidugudu). Each district has an elected District Council as the supreme decision-making body and a District Executive Committee responsible for day-to-day administration. The Mayor is elected by the District Council and heads the Executive Committee. Districts are legal entities with their own budgets, staff and service delivery responsibilities. Functions decentralised to districts include: primary and secondary education; primary health care; water and sanitation; local roads and infrastructure; land management; local economic development; and social protection. Districts may levy local taxes and fees as prescribed by law including land lease fees, local service taxes and market levies. Citizens participate in district governance through: community development committees (ubudehe); citizen satisfaction surveys; performance contracts (imihigo) between the President and district mayors; and public hearings on the district budget. A district that fails to meet its performance targets may have its leadership held accountable through the national performance management system.',
  2013,
  'Law No. 87/2013 of 11/09/2013 on decentralisation in Rwanda'
),
(
  'Decentralisation Law - Umushyikirano, Imihigo and Community Participation',
  'administrative',
  'Under Law No. 87/2013 and the Rwandan governance framework: Imihigo are performance contracts entered into between the President of Rwanda and district mayors at the beginning of each fiscal year. Imihigo set out specific measurable targets for service delivery and development. Districts are publicly evaluated and ranked on imihigo performance annually; results are published and used to hold local leadership accountable. The National Dialogue Council (Umushyikirano) is an annual event where leaders at all levels report to citizens on performance. Umugoroba wa Ntwari are weekly village-level community meetings where local governance issues and service delivery are discussed. Abunzi (community mediators) are committees established at cell and sector level to mediate civil and commercial disputes involving amounts below a prescribed threshold; parties must attempt Abunzi mediation before filing certain civil claims in court. Abunzi decisions are binding unless appealed to the Primary Court within thirty (30) days. The Community Development Committees (imirenge) coordinate community self-help activities including Umuganda, the compulsory monthly community work programme on the last Saturday of each month. Failure to participate in Umuganda without justification is subject to a fine at cell level.',
  2013,
  'Law No. 87/2013 of 11/09/2013 on decentralisation in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- DISABILITY RIGHTS LAW — Law No. 01/2007 of 20/01/2007
-- ══════════════════════════════════════════════════════════
(
  'Disability Law - Rights of Persons with Disabilities and Anti-Discrimination',
  'disability',
  'Under Law No. 01/2007 protecting and promoting the rights of persons with disabilities in Rwanda: A person with a disability has the same rights as any other citizen. Discrimination against a person on the basis of disability in employment, education, access to services or any other sphere of life is prohibited. Every person with a disability has the right to: free or subsidised medical and rehabilitation services; access to appropriate education in inclusive schools or special institutions; employment opportunities with reasonable accommodation; access to public buildings, transport and information; social protection including government grants; and participation in political and public life. Employers with more than ten (10) employees must make reasonable accommodations to employ persons with disabilities and must not dismiss or demote an employee solely because they acquired a disability. Public buildings, transport infrastructure and public services must be made accessible to persons with disabilities. The National Council of Persons with Disabilities (NCPD) is the body representing and advocating for the rights of persons with disabilities. Rwanda is a signatory to the UN Convention on the Rights of Persons with Disabilities (CRPD). Children with disabilities have the right to attend school in an inclusive environment with appropriate support; segregation in separate institutions is permitted only where inclusion is not feasible.',
  2007,
  'Law No. 01/2007 of 20/01/2007 protecting and promoting the rights of persons with disabilities in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- EDUCATION LAW — Law No. 27/2019 of 12/06/2019
-- ══════════════════════════════════════════════════════════
(
  'Education Law - Compulsory Education, School Types and Rights of Learners',
  'education',
  'Under Law No. 27/2019 on education in Rwanda: Every child of school age has the right to education. Basic education is compulsory for children aged six (6) to eighteen (18) years or until completion of secondary school, whichever comes first. Under the Twelve-Year Basic Education (12YBE) programme, the first nine (9) years of basic education (primary and lower secondary) are free. Government schools charge no tuition fees for basic education. Private schools must be registered with the Ministry of Education and must meet minimum standards for curriculum, staffing, facilities and safety. Religious organisations may operate faith-based schools subject to compliance with the national curriculum requirements. Education is provided in Kinyarwanda and English; French may be used as a medium of instruction. Schools are prohibited from expelling a student solely because the student is pregnant; a female student who becomes pregnant must be allowed to continue or return to school. Rights of learners include: access to quality education; freedom from corporal punishment; a safe and inclusive learning environment; and access to guidance and counselling services. Corporal punishment in schools is prohibited and a teacher who inflicts corporal punishment is subject to disciplinary action and criminal prosecution.',
  2019,
  'Law No. 27/2019 of 12/06/2019 on education in Rwanda'
),
(
  'Education Law - Higher Education, Academic Qualifications and Quality Assurance',
  'education',
  'Under Law No. 27/2019: Higher education institutions including universities, polytechnics, and vocational colleges must be accredited by the Rwanda Higher Education Council (HEC) before enrolling students or awarding qualifications. Unaccredited institutions that operate as if they are accredited commit an offence. Foreign qualifications must be recognised and equated by the HEC before being used for employment or further study in Rwanda. Academic fraud including the use of forged certificates, plagiarism and cheating in examinations is punishable by expulsion from the institution and criminal prosecution. The HEC sets minimum qualification standards for academic staff at each level of higher education. The Rwanda Polytechnic system provides technical and vocational education and training (TVET); TVET graduates receive nationally recognised certificates. Students in public higher education institutions pay tuition fees according to a means-tested bursary system administered by the Rwanda Education Board. The Government grants bursaries to students who excel in national examinations and qualify for public universities. Private scholarships and international bursaries are available to qualifying students. Higher education institutions must submit annual quality assurance reports to the HEC and undergo periodic external review.',
  2019,
  'Law No. 27/2019 of 12/06/2019 on education in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- MICROFINANCE LAW — Law No. 40/2008 of 26/08/2008
-- ══════════════════════════════════════════════════════════
(
  'Microfinance Law - Licensing, SACCOs and Financial Inclusion',
  'finance',
  'Under Law No. 40/2008 governing microfinance institutions in Rwanda: Microfinance institutions (MFIs) are financial institutions that provide savings, credit and other financial services to low-income individuals and small enterprises who do not have access to formal banking services. No person may operate a microfinance institution without a licence from the National Bank of Rwanda (BNR). Categories of licensed microfinance institutions include: Savings and Credit Cooperatives (SACCOs), credit-only MFIs, deposit-taking MFIs, and umbrella organisations. Every Sector in Rwanda has a SACCO established to provide financial services to the local community. SACCOs are member-owned cooperatives governed by their members through a General Assembly, Board of Directors and Supervisory Committee. BNR sets minimum capital requirements, liquidity ratios and governance standards for MFIs. MFIs are prohibited from charging usurious interest rates; BNR publishes reference rates and may cap interest rates for specific credit products. The Umbrella Organisation of SACCOs (UMURENGE SACCOs) provides shared services including IT, training and liquidity support to individual SACCOs. Mobile money services (MoMo) and agent banking are regulated by BNR under the payment systems regulatory framework as part of the national financial inclusion strategy. Over ninety percent (90%) of adult Rwandans are financially included through bank accounts, mobile money or SACCOs.',
  2008,
  'Law No. 40/2008 of 26/08/2008 governing microfinance activities in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- TRADE UNION LAW — Law No. 06/2016 of 30/03/2016
-- ══════════════════════════════════════════════════════════
(
  'Trade Union Law - Formation, Rights and Collective Bargaining',
  'labour',
  'Under Law No. 06/2016 on trade unions in Rwanda: Workers have the right to form and join trade unions of their choice without prior authorisation. A trade union must register with the Ministry responsible for labour by submitting: the union statutes; a list of founding members; names and qualifications of union leaders; and proof of a minimum number of members. The minimum membership required to form a trade union is fifty (50) members in the same sector or industry. A trade union acquires legal personality upon registration. Trade unions have the right to: represent their members in collective bargaining with employers; file complaints and represent members in labour disputes; negotiate Collective Bargaining Agreements (CBAs) on wages, working conditions, benefits and dispute resolution procedures. A CBA negotiated by a representative trade union and an employer or employer organisation is binding on all employees in the bargaining unit. The right to strike is recognised but is subject to conditions: workers must give at least ten (10) days written notice to the employer and the competent authority before a lawful strike; essential services workers have restricted strike rights; and a minimum service level must be maintained during strikes. Workers who participate in a lawful strike may not be dismissed or disciplined for doing so. The National Labour Council (Conseil National du Travail) is the tripartite consultative body comprising government, employer and worker representatives.',
  2016,
  'Law No. 06/2016 of 30/03/2016 on trade unions in Rwanda'
);
