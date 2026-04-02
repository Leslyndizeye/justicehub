-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Law on Organization of Courts, Prosecution Law,
--         Court Fees Law, Organic Law on Judiciary, Legal Aid extended
-- Run this AFTER seed_specialized_laws.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- ORGANIZATION OF COURTS — Organic Law No. 03/2012/OL of 13/06/2012
-- ══════════════════════════════════════════════════════════
(
  'Organization of Courts - Court Structure, Jurisdiction and Composition',
  'civil_procedure',
  'Under the Organic Law No. 03/2012/OL on the organization, functioning and jurisdiction of courts in Rwanda (as amended): The Rwandan court system has four levels: (1) Primary Courts (Inkiko Zisumba) — established in each sector; handles minor criminal offences, civil matters below a prescribed value, and family matters at first instance; (2) Intermediate Courts (Inkiko Zihuza) — established in each district; handles appeals from Primary Courts and major civil, commercial, labour and administrative cases at first instance; (3) High Court (Urukiko Rukuru) — one national court with chambers including commercial, civil, criminal, labour, administrative and social chambers; handles appeals from Intermediate Courts and cases involving national officials at first instance; (4) Supreme Court (Urukiko Rw Ikirenga) — the highest court; handles appeals from the High Court, constitutional matters, cases involving the President and senior officials, and electoral disputes. The Military High Court handles military offences. Commercial disputes are handled by the Commercial Court which is a chamber of the High Court. The courts operate according to principles of independence, impartiality, openness and efficiency. Judges are appointed by the President on recommendation of the Supreme Council of the Judiciary. Judges are irremovable during their term except for gross misconduct determined by the Supreme Council of the Judiciary.',
  2012,
  'Organic Law No. 03/2012/OL of 13/06/2012 on organization, functioning and jurisdiction of courts in Rwanda'
),
(
  'Organization of Courts - Commercial Court, Labour Court and Specialized Chambers',
  'civil_procedure',
  'Under the court organization laws of Rwanda: The Commercial Court is a specialized chamber of the High Court with exclusive jurisdiction over: company law disputes; intellectual property disputes; banking, insurance and financial services disputes; international trade disputes; competition law cases; and other commercial matters above prescribed thresholds. Commercial cases are handled by judges with commercial law expertise. The Labour Court is a specialized chamber hearing employment disputes including wrongful dismissal, wage claims, and collective labour disputes. Cases before the Labour Court benefit from expedited procedures. The Administrative Court handles disputes between citizens and government bodies including challenges to administrative decisions, civil servant employment disputes, and State liability claims. The Special Chamber for International Crimes at the High Court handles genocide and war crimes cases. For cases exceeding their jurisdiction, lower courts must decline and refer to the appropriate court. Appeals may only be lodged against decisions on the merits; interlocutory decisions are generally not separately appealable except in specific circumstances. In exceptional circumstances a case of significant public importance or complexity may be referred to a higher court by the lower court for first instance determination. All judgments must be reasoned in writing and published.',
  2012,
  'Organic Law No. 03/2012/OL of 13/06/2012 on organization, functioning and jurisdiction of courts in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- PROSECUTION LAW — Organic Law No. 04/2012/OL of 15/06/2012
-- ══════════════════════════════════════════════════════════
(
  'Prosecution Law - Office of the Prosecutor General, Powers and Duties',
  'criminal_procedure',
  'Under the Organic Law governing the Office of the Prosecutor General in Rwanda: The National Public Prosecution Authority (NPPA) is an independent constitutional institution headed by the Prosecutor General. The NPPA is responsible for: prosecution of criminal offences before all courts; supervision of the legality of police investigations; execution of criminal judgments; and representation of the State in certain civil matters. The Prosecutor General is appointed by the President with the approval of the Senate and serves a non-renewable term of five (5) years. Prosecutors have the power to: direct the Rwanda Investigation Bureau (RIB) in criminal investigations; authorise or refuse detention of suspects beyond the twenty-four hour police custody period; decide whether to indict or discontinue prosecution; and negotiate plea bargains with accused persons. The prosecution may discontinue a case in the public interest even where there is sufficient evidence, taking into account: the seriousness of the offence; the interests of the victim; the prospects of rehabilitation; and the costs of prosecution. A victim of crime may file a private prosecution application if the prosecution refuses to indict. A complainant dissatisfied with a prosecution decision to discontinue may appeal to a senior prosecution authority. Prosecutors are bound by the principle of objectivity — they must disclose exculpatory evidence to the defence.',
  2012,
  'Organic Law No. 04/2012/OL of 15/06/2012 on organization, functioning and jurisdiction of the National Public Prosecution Authority'
),

-- ══════════════════════════════════════════════════════════
-- SUPREME COUNCIL OF THE JUDICIARY
-- ══════════════════════════════════════════════════════════
(
  'Judiciary Law - Supreme Council of the Judiciary and Judicial Independence',
  'civil_procedure',
  'Under the Organic Law on the Supreme Council of the Judiciary in Rwanda: The Supreme Council of the Judiciary (Conseil Superieur de la Magistrature) is the independent constitutional body responsible for: the appointment, assignment, promotion, transfer and discipline of judges; ensuring the independence of the judiciary; and managing the budget of the judiciary. The Supreme Council is composed of: the President of the Supreme Court who chairs it; judges of the Supreme Court; representatives of judges from lower courts; the Prosecutor General; and two representatives appointed by the President. A judge may only be removed from office by the Supreme Council after disciplinary proceedings in which the judge is heard. Grounds for removal include: gross professional misconduct; criminal conviction; incapacity; and abandonment of duties. A judge who is removed from office may appeal to the Supreme Court. The salaries and benefits of judges are set by law and may not be reduced during their term in office to guarantee their financial independence. Judicial ethics: judges must maintain impartiality, avoid conflicts of interest, maintain confidentiality of deliberations, and uphold the dignity of the judicial office. A judge must recuse themselves from a case where they have a personal interest or prior involvement. Citizens may file complaints against judicial conduct to the Supreme Council of the Judiciary.',
  2012,
  'Organic Law on the organization and functioning of the Supreme Council of the Judiciary in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- COURT FEES LAW
-- ══════════════════════════════════════════════════════════
(
  'Court Fees Law - Filing Fees, Exemptions and Recovery of Costs',
  'civil_procedure',
  'Under Rwandan court fees regulations: A party filing a civil, commercial, labour or administrative case must pay prescribed court fees at the time of filing. Court fees are calculated based on: a fixed filing fee; and a percentage of the value of the claim for monetary claims. The scale of fees is set by ministerial order and updated periodically. Failure to pay court fees results in the court registrar refusing to register the claim. Exemption from court fees applies to: persons who qualify for legal aid and demonstrate financial indigence; cases related to labour disputes below a prescribed claim value; family cases involving children including custody and child support; and other categories prescribed by law. The court may order the losing party to pay the winning party court costs including filing fees and reasonable legal representation costs. Costs are at the discretion of the court; in some categories of cases including family disputes, each party bears their own costs. Enforcement fees (bailiff fees) for executing judgments are paid by the judgment debtor in addition to the judgment amount. Court fees paid by a winning party are reimbursed by the losing party as part of the costs order. Court fee receipts must be kept by parties as proof of payment throughout proceedings.',
  2018,
  'Rwanda court fees regulations and ministerial orders on court fees'
),

-- ══════════════════════════════════════════════════════════
-- IECMS — INTEGRATED ELECTRONIC CASE MANAGEMENT SYSTEM
-- ══════════════════════════════════════════════════════════
(
  'IECMS - Electronic Court Filing, Case Management and E-Justice',
  'civil_procedure',
  'Under Rwandan e-justice laws and IECMS regulations: The Integrated Electronic Case Management System (IECMS) is the official digital platform for filing and managing court cases in Rwanda. All civil, commercial, labour and administrative cases must be filed electronically through the IECMS platform. Parties who do not have internet access may file at the court registry where staff assist with electronic filing. Submissions filed through IECMS have the same legal validity as paper filings. Case files including submissions, evidence, and court decisions are maintained electronically on IECMS. Parties and their advocates may access their case files, receive notifications, and track hearing dates through the platform. Service of court documents (summons, decisions) is effected electronically through IECMS or by SMS notification. The electronic timestamp on IECMS filings determines compliance with filing deadlines. Court fees are paid electronically through IECMS using mobile money, bank transfer or other approved payment methods. Hearings may be conducted by videoconference using IECMS infrastructure; videoconference hearings have the same legal validity as in-person hearings. The IECMS system is administered by the Rwanda Judiciary and access is available through the official courts portal. Cases filed before the implementation of IECMS continue under the previous paper-based system until concluded.',
  2019,
  'Rwanda Judiciary IECMS regulations and e-justice framework'
),

-- ══════════════════════════════════════════════════════════
-- NATIONAL HUMAN RIGHTS COMMISSION
-- ══════════════════════════════════════════════════════════
(
  'National Human Rights Commission - Mandate, Powers and Complaint Procedure',
  'administrative',
  'Under the law establishing the National Human Rights Commission (NHRC) of Rwanda: The NHRC is an independent constitutional institution with a mandate to: promote and protect human rights in Rwanda; receive and investigate complaints of human rights violations; monitor the compliance of laws and practices with international human rights standards; advise the Government on human rights matters; and conduct human rights education. The NHRC has the power to: summon persons and require production of documents; visit detention facilities, prisons and other places of deprivation of liberty without prior notice; refer cases of human rights violations to the prosecution; and make public recommendations. Any person who believes their human rights have been violated may file a complaint with the NHRC free of charge. The NHRC investigates the complaint, attempts mediation between the parties, and may refer unresolved matters to competent authorities. A government institution that fails to cooperate with an NHRC investigation may be reported to Parliament. The NHRC presents an annual report to Parliament on the human rights situation in Rwanda. The NHRC has Grade A status with the UN Global Alliance of National Human Rights Institutions (GANHRI), meaning it is fully compliant with the Paris Principles on the independence and effectiveness of national human rights institutions. Rwanda has ratified all major UN human rights conventions including the ICCPR, ICESCR, CAT, CEDAW, CRC and CRPD.',
  2007,
  'Organic Law establishing the National Human Rights Commission (NHRC) in Rwanda'
);
