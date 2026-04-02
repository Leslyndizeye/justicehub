-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Law of Obligations (Civil Code), Mortgage Law, Construction Law,
--         Conciliation Law (Abunzi), Ombudsman Law, Refugees Law,
--         Payment Systems Law, Consumer Credit Law
-- Run this AFTER seed_electoral_local_govt.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- LAW OF OBLIGATIONS / CONTRACTS — Civil Code Book III
-- ══════════════════════════════════════════════════════════
(
  'Contract Law - Formation, Validity and Performance of Contracts',
  'civil',
  'Under the Rwandan Civil Code and Law of Obligations: A contract is an agreement between two or more persons creating legally binding obligations. For a contract to be valid it must have: (1) consent — the free and informed agreement of the parties; (2) capacity — the parties must have legal capacity to contract (adults of sound mind; minors and persons under guardianship require representative consent); (3) a lawful object — the subject matter must not be contrary to law, public order or morality; (4) a cause — a legitimate reason for the obligation. Consent is vitiated and the contract may be annulled if obtained by: error going to the essence of the contract; fraud — deliberate misrepresentation inducing consent; or duress — illegitimate pressure depriving a party of free choice. A contract must be performed in good faith. A party who fails to perform their contractual obligation without justification is in breach and is liable to: perform specifically if ordered by the court; pay damages for the loss caused by the breach; and pay late payment interest from the date of default. Damages for breach of contract cover the actual loss suffered and the profit lost (loss of opportunity), provided they were foreseeable at the time of contracting. Contracts may be terminated by: mutual agreement; expiry; fundamental breach; frustration due to supervening impossibility; or court order.',
  2019,
  'Rwanda Civil Code and Law of Obligations as applied in Rwanda'
),
(
  'Contract Law - Electronic Contracts, Agency, Penalty Clauses and Limitation',
  'civil',
  'Under the Rwandan law of obligations: An agent acting within the scope of their authority binds the principal; an agent who acts beyond their authority is personally liable unless the principal ratifies the act. A power of attorney must be in notarial form for transactions requiring notarisation (such as real estate transactions). A penalty clause in a contract sets in advance the damages payable for a specified breach; courts may reduce a grossly excessive penalty clause. Unfair terms in consumer contracts — terms not individually negotiated that create a significant imbalance to the detriment of the consumer — may be declared null and void by a court. Standard form contracts must be clear and accessible; any ambiguity in a standard form contract is interpreted against the party who drafted it. The general limitation period for contractual claims in Rwanda is ten (10) years from the date the cause of action arose. The limitation period for commercial claims between traders is five (5) years. For tort claims (civil wrongs) the limitation period is generally three (3) years from the date the aggrieved party knew or ought to have known of the harm and the responsible person. A limitation period may be interrupted by filing a court claim, by acknowledgment of the debt by the debtor, or by part payment.',
  2019,
  'Rwanda Civil Code and Law of Obligations as applied in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- MORTGAGE AND SECURED TRANSACTIONS — Land Law provisions
-- ══════════════════════════════════════════════════════════
(
  'Mortgage Law - Registration, Enforcement and Priority of Mortgages',
  'land',
  'Under Rwandan law, a mortgage (hypotheque) is a real security interest registered against immovable property (land and buildings) to secure a debt. A mortgage must be created by notarial deed and registered in the National Land Register to be enforceable against third parties. The mortgage is registered against the title of the mortgaged property and is noted on the land certificate. Priority between competing mortgages is determined by the date of registration — the earlier registered mortgage has priority. The mortgage follows the property and is enforceable against any subsequent owner. Upon default by the debtor, the mortgagee (lender) may apply to the court for an order to sell the mortgaged property at public auction to recover the debt. The proceeds of the auction are applied in order: costs of sale; registered taxes and levies; mortgages in order of their registered priority; and any surplus is returned to the former owner. A debtor may discharge the mortgage by paying the secured debt in full; the mortgagee must then execute a discharge deed to be registered to release the mortgage. Movable assets may be pledged as security; the pledge must be registered in the collateral registry to be effective against third parties. Rwanda has a modern collateral registry enabling lenders to take security over movable assets including vehicles, equipment and receivables.',
  2013,
  'Rwanda Land Law No. 43/2013 and related mortgage and secured transactions provisions'
),

-- ══════════════════════════════════════════════════════════
-- ABUNZI (COMMUNITY MEDIATORS) LAW — Law No. 02/2010 of 09/06/2010
-- ══════════════════════════════════════════════════════════
(
  'Abunzi Law - Jurisdiction, Procedure and Enforcement of Decisions',
  'civil_procedure',
  'Under Law No. 02/2010 establishing the organisation and functioning of Abunzi committee in Rwanda: Abunzi (mediation committees) are community-based dispute resolution bodies established at cell and sector levels. The Abunzi committee at cell level has jurisdiction over civil and commercial disputes where the value in dispute does not exceed RWF 3,000,000. The Abunzi at sector level hears appeals from cell-level decisions and disputes of a higher value up to RWF 5,000,000. Certain categories of disputes must be referred to Abunzi before going to court including: land boundary disputes between neighbours; family disputes including child support and inheritance; and small commercial disputes. A party who files a court case without first attempting Abunzi mediation in matters that are within Abunzi jurisdiction will have their case rejected by the court registrar. Abunzi procedures: after receiving a complaint, the Abunzi committee invites both parties; the committee attempts to facilitate an amicable resolution; if the parties reach agreement, the Abunzi records a settlement decision which is signed by the parties and the committee. An Abunzi decision agreed by the parties has the force of a court judgment and may be enforced through the court. If mediation fails, the Abunzi issues a report and the parties may proceed to court. An Abunzi decision may be appealed to the Primary Court within thirty (30) days.',
  2010,
  'Law No. 02/2010 of 09/06/2010 on the organisation and functioning of Abunzi Committee in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- OMBUDSMAN LAW — Law No. 25/2003 of 15/08/2003 (as amended)
-- ══════════════════════════════════════════════════════════
(
  'Ombudsman Law - Mandate, Asset Declarations and Anti-Corruption Role',
  'administrative',
  'Under the Ombudsman Law as amended: The Office of the Ombudsman is an independent constitutional institution responsible for: investigating complaints by citizens against public servants and public institutions; fighting injustice, corruption and maladministration in public and private institutions; receiving and verifying asset declarations of public officials; and promoting transparency and accountability in governance. Any citizen may file a complaint with the Ombudsman free of charge without first exhausting administrative remedies. The Ombudsman investigates the complaint and may: recommend corrective action by the responsible institution; recommend disciplinary action against errant officials; or refer criminal matters to the prosecution. Asset declarations: all public officials above a prescribed level including the President, ministers, parliament members, judges, military officers above a certain rank, and senior civil servants must declare their assets annually to the Ombudsman. The declaration must cover: all movable and immovable assets; financial assets including bank accounts and investments; debts; and any business interests. The Ombudsman verifies the accuracy of declarations and investigates discrepancies. A public official who makes a false or incomplete asset declaration commits an offence punishable by imprisonment and a fine. The Ombudsman publishes an annual report to Parliament on the state of corruption, injustice and maladministration in Rwanda.',
  2003,
  'Organic Law on the Organisation and Functioning of the Office of the Ombudsman in Rwanda, as amended'
),

-- ══════════════════════════════════════════════════════════
-- REFUGEES LAW — Law No. 13/2014 of 21/05/2014
-- ══════════════════════════════════════════════════════════
(
  'Refugees Law - Recognition, Rights and Obligations of Refugees',
  'immigration',
  'Under Law No. 13/2014 relating to refugees in Rwanda: A refugee is a person who is outside their country of nationality and is unable or unwilling to return due to a well-founded fear of persecution based on race, religion, nationality, membership of a particular social group, or political opinion, or due to serious threats arising from generalised violence, foreign aggression, internal conflict or massive violation of human rights. A person seeking refugee status must apply to the Refugee Eligibility Committee (REC) which assesses the application and makes a determination. An asylum seeker has the right not to be returned to a country where their life or freedom would be threatened (non-refoulement). A recognised refugee has the right to: reside in Rwanda; work and engage in business activities; access education, health care and other public services; possess identity documents; and access courts and legal processes. A refugee has the duty to: respect Rwandan laws and regulations; not engage in activities contrary to national security; and present themselves when required by the competent authority. Rwanda has hosted large refugee populations particularly from the Democratic Republic of Congo and Burundi. The Rwanda Governance Board manages refugee policy and the UNHCR operates in partnership with the Government. A refugee status may be revoked if the person has voluntarily re-established themselves in their country of origin or obtained the protection of another country.',
  2014,
  'Law No. 13/2014 of 21/05/2014 relating to refugees in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CONSTRUCTION AND URBAN PLANNING
-- ══════════════════════════════════════════════════════════
(
  'Urban Planning and Construction - Building Permits and Zoning',
  'administrative',
  'Under Rwandan urban planning and construction laws and regulations: All construction activities including erection of new buildings, extensions, alterations and demolition require a building permit from the competent authority (the district where the construction is located, or the City of Kigali authority for projects within Kigali). A building permit application must include: architectural plans prepared and signed by a registered architect; structural engineering drawings signed by a registered engineer; proof of ownership or right to use the land; an environmental impact assessment where required; and payment of prescribed fees. Buildings must be constructed in conformity with the approved plans; deviations require amended permit approval. Construction in a designated zone must comply with the permitted use for that zone — residential buildings are not permitted in industrial zones and vice versa. The Rwanda Housing Authority (RHA) and district authorities enforce urban planning and building standards through inspection. An illegally constructed building (built without a permit or in violation of the approved plans) may be ordered to be demolished at the owner cost. A contractor who constructs a building that subsequently collapses due to structural defects is liable for damages and criminal prosecution. Professionals including architects, engineers and contractors who sign off on substandard construction face disciplinary action and personal liability.',
  2019,
  'Rwandan urban planning laws and construction regulations'
),

-- ══════════════════════════════════════════════════════════
-- PAYMENT SYSTEMS LAW — BNR Payment Systems Regulation
-- ══════════════════════════════════════════════════════════
(
  'Payment Systems Law - Mobile Money, Digital Payments and BNR Oversight',
  'finance',
  'Under the National Bank of Rwanda (BNR) Payment Systems Regulatory Framework: BNR is the competent authority for regulating and supervising payment systems and payment service providers in Rwanda. Payment service providers including mobile money operators, payment aggregators, switch operators and electronic money issuers must be licensed by BNR. Mobile money services are provided by licensed telecommunications operators and must be operated through a separate financial subsidiary maintaining a float account in trust for customers. The float (trust) account holding customer mobile money balances must be maintained at a licensed bank and is protected in the event of the operator insolvency. Electronic money: a customer who holds electronic money (mobile money, prepaid cards) is a creditor of the issuer for the stored value; the issuer must maintain backing assets of at least 100% of outstanding electronic money liabilities. Payment service providers must implement Know Your Customer (KYC) procedures proportionate to the risk and transaction limits of each account tier. Customer funds must not be used for proprietary investments by the payment service provider. Interoperability between mobile money platforms and between mobile money and bank accounts is mandated by BNR to promote financial inclusion. A payment service provider that misappropriates customer funds commits an offence punishable by imprisonment of five (5) to ten (10) years and forfeiture of assets.',
  2018,
  'National Bank of Rwanda Payment Systems Regulatory Framework and related BNR regulations'
),

-- ══════════════════════════════════════════════════════════
-- INTELLECTUAL PROPERTY — Additional: Plant Breeders Rights
-- ══════════════════════════════════════════════════════════
(
  'Intellectual Property - Industrial Designs, Trade Secrets and Geographical Indications',
  'intellectual_property',
  'Under Law No. 31/2009 on intellectual property: An industrial design means the ornamental or aesthetic aspect of a product including its shape, pattern, colour or combination thereof. Industrial design registration gives the owner the exclusive right to use the design for a period of five (5) years from the filing date, renewable for successive five-year periods up to a maximum of fifteen (15) years. A trade secret is any confidential business information that gives a competitive advantage — business formulae, manufacturing processes, customer lists or commercial strategies. Trade secrets are protected without registration; misappropriation of trade secrets by improper means including industrial espionage, breach of confidentiality or theft is actionable both civilly and criminally. A geographical indication (GI) identifies goods as originating from a specific region with qualities attributable to that region — Rwandan coffee (such as Bourbon coffee from specific regions) and Rwandan tea may be protected as geographical indications. Rwanda coffee and tea can be registered as geographical indications to protect their premium market identity and prevent misuse of the origin designation. Utility models (petty patents) provide protection for minor innovations with a simpler registration procedure and a shorter protection period of ten (10) years for devices with practical utility.',
  2009,
  'Law No. 31/2009 of 26/10/2009 on the protection of intellectual property in Rwanda'
);
