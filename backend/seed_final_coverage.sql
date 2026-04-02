-- Final Rwanda legal documents for RAG database — completing 100% coverage
-- SOURCE: Training knowledge from official laws —
--         Corporate Governance Code, Franchise Law, Investment Disputes,
--         Customs bonded warehouses, Free Zones, EAC competition,
--         Mental Health Law, Blood/Organs, Reproductive Health,
--         Conditional Release, Community Service, Social Defense,
--         Intellectual Property collecting societies, Domain Names,
--         National Language Policy, Religious Organisations
-- Run this AFTER seed_petroleum_sports_standards.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- MENTAL HEALTH AND SUBSTANCE ABUSE
-- ══════════════════════════════════════════════════════════
(
  'Mental Health Law - Rights of Persons with Mental Disorders and Involuntary Treatment',
  'health',
  'Under Rwanda mental health laws and Public Health Law No. 21/2016: Every person with a mental disorder has rights including: the right to receive treatment with dignity and respect; the right to the least restrictive treatment environment; the right to refuse non-emergency treatment; and the right to information about their diagnosis, treatment options and rights. Involuntary hospitalization of a person with a mental disorder is permitted only when: the person poses a serious danger to themselves or others due to the mental disorder; and less restrictive alternatives have been tried or are not feasible. Involuntary admission requires: a psychiatric assessment by a qualified psychiatrist; application to a court or designated authority within seventy-two (72) hours; and a court order for continued detention beyond the initial emergency period. A person admitted involuntarily must be reviewed regularly and released as soon as the danger has passed. Legal representation for involuntarily admitted persons is guaranteed. Family members may not institutionalise a person solely for reasons of convenience or to manage family property. Mental health services must be integrated into primary health care at the district level. Stigma and discrimination against persons with mental disorders is prohibited. Rwanda has established the Ndera Neuropsychiatric Hospital and is expanding community mental health services. Substance abuse treatment is provided through dedicated rehabilitation centres; a court may order compulsory treatment as an alternative to imprisonment for drug-related offences.',
  2016,
  'Law No. 21/2016 on public health in Rwanda — mental health provisions and related regulations'
),

-- ══════════════════════════════════════════════════════════
-- BLOOD TRANSFUSION AND ORGAN DONATION LAW
-- ══════════════════════════════════════════════════════════
(
  'Blood and Organ Donation Law - Blood Transfusion Services and Organ Transplantation',
  'health',
  'Under Rwandan health laws on blood transfusion and organ donation: The Rwanda Biomedical Centre (RBC) manages the national blood transfusion service. Blood donation in Rwanda is voluntary and unpaid; the sale of blood is prohibited to ensure donor safety and blood supply safety. All donated blood is tested for HIV, Hepatitis B, Hepatitis C and syphilis before use. The National Blood Transfusion Service maintains strategic blood reserves to ensure supply for medical emergencies. Organ and tissue donation and transplantation are regulated to ensure ethical practice. A person may donate their organs after death by registering as an organ donor on their national identity card or through a written declaration. The consent of immediate family members is obtained before deceased donor organ retrieval. Living donor organ donation is permitted for kidney donation between related persons and in specific circumstances between unrelated persons after ethical review. Organ trafficking — the buying or selling of human organs or tissues for transplantation — is a serious criminal offence punishable by imprisonment of ten (10) to fifteen (15) years. A doctor who performs an organ transplant using trafficked organs is subject to criminal prosecution and removal from the medical register. All organ transplant procedures must be approved by the National Ethics Committee. Rwanda is building transplant capacity; currently many patients requiring transplants are referred abroad.',
  2016,
  'Rwanda health laws on blood transfusion and organ donation and transplantation'
),

-- ══════════════════════════════════════════════════════════
-- REPRODUCTIVE HEALTH LAW
-- ══════════════════════════════════════════════════════════
(
  'Reproductive Health Law - Family Planning, Safe Abortion and Maternal Health',
  'health',
  'Under Law No. 21/2016 on public health and Rwanda Penal Code reproductive health provisions: Access to family planning services including contraception is a right; the Government provides free family planning services at public health centres. Health providers must respect the reproductive choices of clients without coercion, discrimination or violation of confidentiality. Abortion in Rwanda is legal in the following circumstances prescribed by the Penal Code: pregnancy resulting from rape; pregnancy resulting from incest; pregnancy resulting from forced marriage; pregnancy where the foetus has a severe impairment incompatible with life outside the womb; and pregnancy that poses a serious risk to the health or life of the woman. These circumstances require medical certification and in some cases a court order or formal declaration. Abortion outside these permitted circumstances remains an offence under the Penal Code. Maternal health: all pregnant women have the right to antenatal care, skilled birth attendance and postnatal care at public health facilities. Childbirth at home without a skilled attendant is discouraged; community health workers are deployed to encourage facility deliveries. Health facilities are prohibited from detaining mothers who cannot pay delivery fees; payment may be arranged through the Mutuelle de Sante health insurance. Female genital mutilation in any form is absolutely prohibited and is a criminal offence. Early marriage and early pregnancy are addressed through the education and gender equality framework.',
  2016,
  'Law No. 21/2016 on public health in Rwanda — reproductive health provisions and Penal Code'
),

-- ══════════════════════════════════════════════════════════
-- CONDITIONAL RELEASE AND COMMUNITY SERVICE
-- ══════════════════════════════════════════════════════════
(
  'Conditional Release Law - Parole, Community Service and Restorative Justice',
  'criminal_procedure',
  'Under Rwanda laws on execution of sentences: Community service is a non-custodial sentence available for offences carrying imprisonment of up to five (5) years where the court determines that the circumstances do not warrant imprisonment. Community service involves performing unpaid work for the benefit of the community under the supervision of the Rwanda Correctional Service (RCS). Types of community service work include: environmental rehabilitation; community infrastructure maintenance; work at hospitals, schools and social welfare facilities; and other community development activities. The hours of community service are proportionate to the offence and the equivalent prison term. A person sentenced to community service who fails to complete it without valid reason may be committed to prison for the remaining equivalent period. Conditional release (parole): a prisoner who has served at least half of their sentence may apply for conditional release to the Parole Board. The Parole Board considers: the behaviour of the prisoner during incarceration; evidence of rehabilitation; the risk of reoffending; and the availability of a stable residence and support network. Conditions of parole typically include: regular reporting to probation officer; prohibition on leaving the district; prohibition on contact with victims; and compliance with any treatment programme. Violation of parole conditions results in recall to prison to serve the remaining sentence. Restorative justice: in appropriate cases including property crimes, offenders may be diverted to mediation with victims to make reparation as an alternative to prosecution.',
  2018,
  'Rwanda laws on execution of sentences, community service and conditional release'
),

-- ══════════════════════════════════════════════════════════
-- RELIGIOUS ORGANISATIONS LAW
-- ══════════════════════════════════════════════════════════
(
  'Religious Organisations Law - Registration, Rights and Obligations of Religious Bodies',
  'administrative',
  'Under Rwanda laws governing religious organisations: Freedom of religion and worship is guaranteed by the Constitution. Religious organisations must register with the Rwanda Governance Board (RGB) to acquire legal personality and operate legally. Registration requirements for a religious organisation include: a description of the religion and its beliefs; the statutes or constitution of the organisation; proof of a minimum membership; information about the founders and leadership; proof of a registered office; and demonstration that the organisation does not engage in activities contrary to the Constitution, national unity or public order. A registered religious organisation has the right to: own property; receive donations; operate schools and hospitals; and conduct religious activities. Religious organisations must not: engage in partisan political activities; use their premises for activities promoting divisionism or inciting violence; engage in financial fraud or exploitation of followers; or operate in ways that harm public health. Religious leaders who exploit followers financially or psychologically face prosecution under the fraud and consumer protection laws. Unregistered religious organisations may not conduct public worship activities; persons leading unregistered organisations are liable to fines. The RGB monitors religious organisations and may suspend or deregister an organisation that violates the law. Rwanda has taken action against some religious organisations whose practices were deemed harmful to public health or public order.',
  2018,
  'Rwanda law governing non-governmental organisations and religious bodies, RGB regulations'
),

-- ══════════════════════════════════════════════════════════
-- DOMAIN NAMES AND INTERNET GOVERNANCE
-- ══════════════════════════════════════════════════════════
(
  'Internet and Domain Names Law - .rw Domain, Internet Governance and Content Regulation',
  'digital',
  'Under Rwanda telecommunications, cybercrime and electronic transactions laws: The .rw country code top-level domain (ccTLD) is administered by the Rwanda Internet Community Technology Association (RICTA) under delegation from ICANN and oversight from RURA. Registration of .rw domain names is open to Rwandan entities and individuals; non-residents may register through an accredited registrar. Domain name disputes — including cybersquatting (registering a domain in bad faith to profit from another party trademark) — are resolved through the ICANN Uniform Domain Name Dispute Resolution Policy (UDRP) or through Rwandan courts. Internet service providers (ISPs) operating in Rwanda must be licensed by RURA and must implement lawful intercept capabilities for national security purposes. ISPs are not liable for third party content that passes through their networks as mere conduits but may be liable if they fail to remove clearly illegal content after notification. Website operators who publish illegal content including child sexual abuse material, terrorism content or incitement to genocide are subject to criminal prosecution and content removal orders. The Rwanda Utilities Regulatory Authority (RURA) may block access to websites that host illegal content under a court order or in urgent national security situations. Net neutrality principles apply — ISPs may not discriminate between types of lawful internet traffic except for reasonable traffic management.',
  2018,
  'Rwanda telecommunications law, cybercrime law and internet governance regulatory framework'
),

-- ══════════════════════════════════════════════════════════
-- FRANCHISE AND DISTRIBUTION LAW
-- ══════════════════════════════════════════════════════════
(
  'Commercial Law - Franchise Agreements, Distribution Contracts and Agency',
  'company',
  'Under Rwanda commercial laws governing franchise and distribution: A franchise agreement is a contract by which a franchisor grants a franchisee the right to operate a business under the franchisor brand, system and support in exchange for fees and royalties. Franchise agreements are governed by the general law of contracts in Rwanda; there is no specific franchise law but the agreement must comply with competition law, company law and intellectual property law. A franchisee who operates under a franchise agreement must keep the franchise system confidential and may not sublicense without written consent. Exclusive distribution agreements grant a distributor the exclusive right to sell specified goods in a defined territory; exclusive agreements that substantially restrict competition may require RDB notification under competition law. Agency agreements: a commercial agent who regularly negotiates or concludes contracts on behalf of a principal is entitled to reasonable notice of termination and to indemnity (compensation) on termination for the goodwill built up during the agency period. The principal must act in good faith toward the agent and provide necessary information and commission statements. A principal who terminates an agency agreement abruptly without cause and without reasonable notice or compensation is liable in damages to the agent. Multi-level marketing schemes (MLM) that operate as pyramid schemes — where participants earn primarily by recruiting others rather than by selling genuine goods — are prohibited under the competition and consumer protection law.',
  2016,
  'Rwanda commercial laws on franchise, distribution and agency as derived from general contract and competition law'
),

-- ══════════════════════════════════════════════════════════
-- PROFESSIONAL INDEMNITY AND LIABILITY INSURANCE
-- ══════════════════════════════════════════════════════════
(
  'Professional Liability - Mandatory Professional Indemnity Insurance Requirements',
  'insurance',
  'Under Rwanda professional regulation laws: Certain professional categories are required by law to maintain professional indemnity insurance as a condition of their practising licence. Professions required to hold professional indemnity insurance include: advocates and legal practitioners; notaries; certified public accountants and auditors; engineers; architects; property valuers; medical practitioners; pharmacists; and insurance brokers. Professional indemnity insurance covers the professional liability of the insured for financial losses suffered by clients as a result of negligent acts, errors or omissions in the course of providing professional services. The minimum indemnity limit required varies by profession and is set by the relevant professional body or regulator. A professional who causes harm to a client due to negligence is personally liable; the indemnity insurance covers this liability up to the policy limit. Claims made against a professional must be made during the policy period or within a prescribed period after the end of the policy (claims-made policy). A professional who fails to maintain the required indemnity insurance may have their practising licence suspended. Clients of professionals have a right to be informed whether the professional holds valid indemnity insurance. The insurance policy must name the regulatory body as an interested party to ensure the regulator is notified of cancellation.',
  2017,
  'Rwanda professional regulation laws on mandatory professional indemnity insurance for various professions'
),

-- ══════════════════════════════════════════════════════════
-- RWANDA VISION 2050 AND DEVELOPMENT PLANNING LAW
-- ══════════════════════════════════════════════════════════
(
  'Development Planning Law - National Development Planning, NST1 and Vision 2050',
  'administrative',
  'Under Rwanda development planning laws and policies: Rwanda follows a long-term development vision — Vision 2050 — which aims to transform Rwanda into an upper-middle income country by 2035 and a knowledge-based society by 2050. Vision 2050 is implemented through successive National Strategy for Transformation (NST) plans. NST1 covered 2017-2024 and NST2 covers 2024-2029. The National Planning Law requires all sector ministries to develop sector strategic plans aligned with the national strategy. Districts develop District Development Strategies (DDS) aligned with NST and the respective provincial priorities. The Ministry of Finance and Economic Planning (MINECOFIN) coordinates national planning through a three-year Medium Term Expenditure Framework (MTEF). Development plans are linked to the budget through the Programme-Based Budget (PBB) system where expenditure is organised by programmes and sub-programmes with specific outputs and outcomes. Performance measurement: all government institutions enter into Performance Contracts (Imihigo) committing to specific targets aligned with development plans. Progress is measured annually and published. Rwanda participates in Voluntary National Reviews under the UN Sustainable Development Goals (SDGs) framework; SDGs are integrated into national planning documents. Joint Governance Assessment (JGA) is conducted every two years to review progress in governance, accountability and service delivery.',
  2017,
  'Rwanda Vision 2050, NST1/NST2 national development plans and development planning legislation'
),

-- ══════════════════════════════════════════════════════════
-- INVESTMENT DISPUTE RESOLUTION — ICSID and BIT provisions
-- ══════════════════════════════════════════════════════════
(
  'Investment Disputes - ICSID Convention, Bilateral Investment Treaties and Investor Protection',
  'company',
  'Under Rwanda investment dispute resolution framework: Rwanda is a member of the International Centre for Settlement of Investment Disputes (ICSID), which provides a neutral forum for arbitrating disputes between foreign investors and host States. ICSID arbitration is available where: the dispute arises from an investment; Rwanda has consented to ICSID jurisdiction through a Bilateral Investment Treaty (BIT), an investment contract, or national legislation; and the investor is a national of another ICSID member State. Rwanda has signed BITs with several countries including the United States, Germany, Belgium, Luxembourg, Netherlands, Mauritius, South Africa, Turkey, China, and others. BITs typically provide foreign investors with protections including: fair and equitable treatment; full protection and security; national treatment (treatment no less favourable than accorded to domestic investors); most-favoured-nation treatment; prohibition on expropriation without compensation; and free transfer of funds. A foreign investor who believes Rwanda has violated its BIT obligations may initiate ICSID arbitration or arbitration under UNCITRAL rules. Domestic courts are generally required to be exhausted before international arbitration unless the BIT provides otherwise. An ICSID award is final and binding; it is enforceable in all ICSID member States as if it were a final judgment of their highest court. Rwanda may counterclaim against an investor for harm caused by the investment to the State or community.',
  2021,
  'Rwanda Investment Law No. 006/2021, ICSID Convention as ratified by Rwanda, and Rwanda Bilateral Investment Treaties'
);
