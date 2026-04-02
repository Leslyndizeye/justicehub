-- Additional Rwanda legal documents for RAG database
-- SOURCE: Official PDFs — Investment Law 006/2021, Civil Procedure Law 22/2018
-- Run this AFTER seed_legal_docs.sql and seed_additional_laws.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- INVESTMENT LAW — Law No. 006/2021 of 05/02/2021
-- ══════════════════════════════════════════════════════════
(
  'Investment Law - Purpose and Definitions',
  'company',
  'Law No. 006/2021 promotes and facilitates investment in Rwanda. Key definitions: Investment means the commitment of capital or resources for the purpose of conducting business or generating returns. Investor means a local or foreign person who invests in Rwanda. Strategic investment means an investment approved as such by the competent authority based on its significant contribution to national development. The Rwanda Development Board (RDB) is the organ in charge of investment promotion in Rwanda. Capital means wealth in the form of tangible or intangible assets used for investment purposes.',
  2021,
  'Law No. 006/2021 of 05/02/2021 on investment promotion and facilitation in Rwanda'
),
(
  'Investment Law - Investor Rights and Guarantees',
  'company',
  'Under Law No. 006/2021, investors in Rwanda are guaranteed the following rights: (1) the right to own property in accordance with relevant laws; (2) protection against expropriation except for public interest and upon prior payment of fair compensation; (3) the right to transfer funds abroad including profits, dividends, fees, loan repayments and proceeds from sale of investment, subject to relevant laws; (4) the right to employ foreign personnel when the required skills are not locally available, subject to relevant laws on immigration; (5) equal treatment with domestic investors in accordance with the law; (6) access to justice before Rwandan courts and arbitration for dispute resolution. These guarantees apply to both local and foreign investors.',
  2021,
  'Law No. 006/2021 of 05/02/2021 on investment promotion and facilitation in Rwanda'
),
(
  'Investment Law - Investment Registration and RDB',
  'company',
  'Under Law No. 006/2021, investors must register their investments with the Rwanda Development Board (RDB). The RDB is the primary government agency responsible for facilitating investment in Rwanda. Registration provides investors with access to incentives and facilitation services. The RDB provides a one-stop centre for investment services including business registration, licences, visas and work permits. RDB may grant investment certificates to qualifying investors. The RDB evaluates applications for strategic investment status based on the investment value, job creation, technology transfer and contribution to priority sectors.',
  2021,
  'Law No. 006/2021 of 05/02/2021 on investment promotion and facilitation in Rwanda'
),
(
  'Investment Law - Investment Incentives and Priority Sectors',
  'company',
  'Under Law No. 006/2021, investors in priority sectors may qualify for investment incentives. Priority sectors in Rwanda include: manufacturing, agriculture and agro-processing, tourism, ICT and innovation, energy, affordable housing, financial services, and export-oriented businesses. Incentives available to qualifying investors may include: tax holidays, reduced corporate income tax rates, customs duty exemptions on capital goods and raw materials, and expedited processing of permits and licences. The specific incentives are determined by the relevant tax and customs laws. Strategic investors may benefit from additional incentives negotiated with the Government through an investment agreement.',
  2021,
  'Law No. 006/2021 of 05/02/2021 on investment promotion and facilitation in Rwanda'
),
(
  'Investment Law - Foreign Investment and Employment of Expatriates',
  'company',
  'Under Law No. 006/2021, foreign investors have the right to invest in Rwanda on equal terms with domestic investors, except where specific sectors are reserved for Rwandan nationals under relevant laws. Foreign investors may employ foreign personnel when the required skills are not available locally, subject to immigration laws and work permit requirements. An investor who employs foreign personnel must demonstrate efforts to train and develop local personnel to replace them. Expatriate employees are required to obtain valid work permits and resident permits in accordance with immigration laws. Profits and dividends earned by foreign investors may be transferred abroad in freely convertible currency subject to relevant laws.',
  2021,
  'Law No. 006/2021 of 05/02/2021 on investment promotion and facilitation in Rwanda'
),
(
  'Investment Law - Dispute Resolution for Investors',
  'company',
  'Under Law No. 006/2021, disputes between investors and the Government of Rwanda or between investors shall be resolved through: (1) amicable settlement through negotiation; (2) mediation or conciliation; (3) arbitration in accordance with the relevant arbitration law or international arbitration rules where agreed; (4) competent Rwandan courts. Where an investment agreement exists between the investor and the Government, dispute resolution shall follow the mechanism provided in that agreement. Rwanda is a signatory to the International Centre for Settlement of Investment Disputes (ICSID) Convention which provides for international arbitration of investment disputes.',
  2021,
  'Law No. 006/2021 of 05/02/2021 on investment promotion and facilitation in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CIVIL PROCEDURE LAW — Law No. 22/2018 of 29/04/2018
-- ══════════════════════════════════════════════════════════
(
  'Civil Procedure - Admissibility and Filing a Claim (Articles 3, 7, 20 and 23)',
  'civil_procedure',
  'Under Law No. 22/2018: A claim is admissible in court only if the claimant has standing, interest and capacity to sue (Article 3). A claimant or his or her counsel files a claim by submitting submissions through an approved electronic means — primarily through the IECMS system (Article 20). The submission instituting proceedings must indicate: the court to which the case is referred; the full identity of the claimant and respondent; the subject-matter and its value; the nature of the claim; the list of matters at issue; details of each element of the claim, evidence and legal basis; and the signature or fingerprint of the claimant or representative (Article 23). The claimant must pay court fees unless exempted.',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Grounds for Refusal to Register a Claim (Article 21)',
  'civil_procedure',
  'Under Article 21 of Law No. 22/2018, the court registrar cannot register a claim if the claimant: does not pay court fees (unless exempted); files a claim outside the court jurisdiction; fails to provide full identity of parties; files without compliance with time limits; appeals against a decision that is not subject to appeal; files a second appeal on urgent applications; appeals against a final judgement; files an appeal beyond the time limit; has no standing, capacity or interest to sue; files a claim that must first be heard by the Abunzi Committee; or has not proved that mandatory amicable settlement was attempted and failed. A registrar who refuses to register must give written reasons. The refusal can be appealed to the court president within five (5) days and the president decides within five (5) days.',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Pretrial Conference and Conciliation (Articles 24 to 29)',
  'civil_procedure',
  'Under Law No. 22/2018: All cases must be subject to a pretrial conference before hearing, except summary cases (Article 24). The court registrar prepares a draft pretrial conference report and invites parties within fifteen (15) days of receipt. The report indicates: identity of parties; subject-matter; admissibility issues; list of facts; allegations and evidence of each party. During the pretrial conference, the registrar asks parties if they agree to conciliation. If parties reach conciliation, the registrar prepares a conciliation decision signed by the registrar and president of the court. A conciliation decision is not subject to appeal and an enforcement order is immediately affixed for immediate enforcement. If parties fail to reach conciliation, the registrar notifies them of the date and time of hearing.',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Time Limits and Deadlines (Articles 16, 49, 148 and 275)',
  'civil_procedure',
  'Under Law No. 22/2018: Any case referred to court must be decided within six (6) months from the date the claim is referred (Article 16). A case may be adjourned for unforeseen reasons but not more than twice (Article 17). Summons lasts for eight (8) full working days from the date of service. For persons with unknown domicile in Rwanda but known address abroad, the summons period is two (2) months; for persons with completely unknown domicile, three (3) months. The time limit for lodging an appeal is thirty (30) days from the date the judgement was rendered, or from the date the party received notification if not present at pronouncement (Article 148). Public holidays and weekends are not included in computing time limits. If the last day falls on a public holiday, the limit extends to the next working day.',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Default Judgment and Opposition (Articles 54 to 59 and 142 to 146)',
  'civil_procedure',
  'Under Law No. 22/2018: If the claimant fails to appear without valid reason, the respondent may apply for removal of the case or for hearing on the merits (Article 54). If the respondent fails to appear, the claimant may apply for adjournment or hearing in the respondent absence (Article 56). If none of the legally summoned parties appears, the court may adjourn or remove the case from the list (Article 59). A party ordered to appear in person who fails to do so pays a civil fine of FRW 20,000 to FRW 200,000. Opposition seeks to have a default judgement reviewed and is filed before the court that rendered the judgement (Article 142). Opposition is accepted only when the respondent did not receive summons or received them too late. Opposition must be filed within thirty (30) days from the date the party was notified of the default judgement. Filing opposition suspends execution of the default judgement.',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Burden of Proof and Evidence (Articles 12 and 170)',
  'civil_procedure',
  'Under Law No. 22/2018: The claimant must prove the claim, failing which the respondent wins the case. A party who alleges discharge from an obligation must justify the cause of its extinction (Article 12). No party can be tried except after having been heard or summoned (Article 13). In general, no documents may be deposited with the court after the pretrial conference. However, if a new and relevant document or fact is discovered, the party may present it to the court before the hearing closes. A final judgement may be revised for the following reasons: fraud by one of the parties; when the judgement was based on forged or falsified documents recognised as such after the judgement; when new evidence is found that the losing party could not access before the judgement; or when the judgement was based on a procedural act done without permission (Article 170).',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Appeals (Articles 147 to 160)',
  'civil_procedure',
  'Under Law No. 22/2018: The following have the capacity to appeal: a party who was claimant or respondent; a party who intervened in the case; a party on whose behalf the case was heard (Article 147). A party who voluntarily complied with a judgement loses the right to appeal except for matters of public order. The time limit for appeal is thirty (30) days from pronouncement of judgement (Article 148). An appeal is filed with the appellate court in the same form as an ordinary claim and must indicate the grounds for appeal and relief sought. No new claims are admissible at appeal level unless they are incidental claims directly related to original claims. An appeal stays execution of a judgement unless the judgement is subject to provisional execution. The appellate court adjudicates within the limits of the appeal and may confirm, set aside or modify the lower court judgement.',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Enforcement of Judgements (Articles 241 to 253)',
  'civil_procedure',
  'Under Law No. 22/2018: Enforcement orders include: judgements rendered by courts; decisions of judges; arbitral awards; resolutions of Abunzi committees; contracts certified by a notary; and authentic foreign judgements bearing the exequatur formula by a competent Rwandan judicial authority (Article 241). Within thirty (30) days from when a judgement becomes final, the losing party may contact the winning party to agree on execution. The debtor must disclose property from which payment may result (Article 247). If no agreement is reached within thirty (30) days, the winning party requests compulsory execution from the court bailiff. The bailiff makes a statement of seizure within ten (10) working days. The bailiff must publish a notice of public auction within forty-eight (48) hours after approving the value of property to be auctioned. Foreign judgements are not enforceable in Rwanda unless rendered enforceable by a competent Rwandan court through the exequatur procedure (Article 250).',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
);
