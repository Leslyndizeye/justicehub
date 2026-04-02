-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Income Tax Law 016/2018, VAT Law 037/2012, Tax Procedures Law 016/2016,
--         Arbitration Law 005/2008, Banking Law 47/2017, Mining Law 17/2020
-- Run this AFTER seed_more_laws.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- INCOME TAX LAW — Law No. 016/2018 of 13/04/2018
-- ══════════════════════════════════════════════════════════
(
  'Income Tax - Individual (PAYE) Tax Rates',
  'tax',
  'Under Law No. 016/2018 on Direct Taxes on Income, individual employment income is taxed under a progressive Pay-As-You-Earn (PAYE) schedule. Annual taxable income brackets and rates: income from RWF 0 to RWF 360,000 is taxed at 0%; income from RWF 360,001 to RWF 1,200,000 is taxed at 20%; income above RWF 1,200,000 is taxed at 30%. Monthly PAYE equivalent brackets: RWF 0 to RWF 30,000 at 0%; RWF 30,001 to RWF 100,000 at 20%; above RWF 100,000 at 30%. Article 9 governs tax on employment income; Article 10 sets out the graduated rates. Employers must file and pay PAYE monthly by the 15th of the following month. Rental income earned by individuals is subject to a flat rate of 20% on gross rental income (Article 25). Capital gains from asset disposal are included in taxable income and taxed at the applicable rate.',
  2018,
  'Law No. 016/2018 of 13/04/2018 on direct taxes on income in Rwanda'
),
(
  'Income Tax - Corporate Income Tax (CIT) Rates and Deductions',
  'tax',
  'Under Law No. 016/2018, the standard Corporate Income Tax (CIT) rate is 30% (Article 29). Preferential rates apply in specific cases: newly listed companies on the Rwanda Stock Exchange pay 25% for five years; companies with annual turnover below RWF 50 million may qualify for the simplified small business regime; qualifying investors under the investment code may benefit from 0% or 15% rates for approved periods. Deductible business expenses are governed by Articles 18 to 24 and include: staff costs, depreciation, interest, and operating expenses. Thin capitalisation rule: the debt-to-equity ratio must not exceed 4:1 and interest deductions on excess debt are disallowed. Prescribed depreciation rates include: buildings 5%, computers 50%, vehicles 25%, other equipment 25%. Dividends received by a resident company from another resident company are exempt from tax (participation exemption, Article 17). Annual CIT return is due by 31 March of the following tax year. Quarterly advance tax installments are due: 25% by 30 June, 25% by 30 September, 25% by 31 December, and balance on filing.',
  2018,
  'Law No. 016/2018 of 13/04/2018 on direct taxes on income in Rwanda'
),
(
  'Income Tax - Withholding Tax Obligations',
  'tax',
  'Under Law No. 016/2018, withholding tax (WHT) applies at a standard rate of 15% to the following payments: dividends paid to residents and non-residents; interest paid to residents and non-residents; royalties paid to residents and non-residents; service fees paid to non-residents; technical and management fees; payments to unregistered suppliers; lottery and gaming winnings; and rental income paid by legal entities to individuals (Articles 51 to 58). The withholder must file a WHT return and remit the tax by the 15th of the month following payment. A person who fails to withhold becomes personally liable for the unwithheld tax plus a 20% penalty. WHT is a final tax for non-residents and for certain passive income categories. Every person carrying on business in Rwanda must register with the Rwanda Revenue Authority (RRA) (Article 6). Tax registration is a prerequisite for obtaining business licences and government contracts.',
  2018,
  'Law No. 016/2018 of 13/04/2018 on direct taxes on income in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- VAT LAW — Law No. 037/2012 of 09/11/2012 (as amended)
-- ══════════════════════════════════════════════════════════
(
  'VAT Law - Registration, Rates, Zero-Rated and Exempt Supplies',
  'tax',
  'Under Law No. 037/2012 on Value Added Tax: The standard VAT rate is 18% applied to all taxable supplies and imports (Article 12). Compulsory VAT registration is required when annual taxable turnover exceeds or is expected to exceed RWF 20,000,000; the taxpayer must apply within seven (7) days of exceeding the threshold (Article 5). Voluntary registration is available for persons below the threshold (Article 6). Zero-rated supplies (0% VAT, input tax creditable) include: exports of goods and services; international transport; approved drugs and medical equipment; approved agricultural inputs including fertilisers, seeds and pesticides; supplies to diplomatic missions; solar energy equipment; and approved educational materials (Article 14). VAT-exempt supplies (no VAT charged, no input tax credit) include: financial services; formal educational services; medical and health services; residential property; domestic passenger transport; agricultural produce unprocessed; and veterinary services (Article 15). Monthly VAT returns are due by the 15th of the following month (Article 24). Exporters and zero-rated suppliers are entitled to a refund within 30 days of application (Article 29). Input VAT must be claimed within three (3) years of the tax period it arose.',
  2012,
  'Law No. 037/2012 of 09/11/2012 on value added tax in Rwanda, as amended'
),

-- ══════════════════════════════════════════════════════════
-- TAX PROCEDURES LAW — Law No. 016/2016 of 02/05/2016
-- ══════════════════════════════════════════════════════════
(
  'Tax Procedures - Penalties, Assessments and Objections',
  'tax',
  'Under Law No. 016/2016 on Tax Procedures: Late filing penalty is RWF 100,000 per month of delay for the first six months, then RWF 200,000 per month thereafter. Failure to register for tax carries a penalty of RWF 500,000. Failure to issue a tax invoice attracts a penalty of 10% of the invoice amount with a minimum of RWF 100,000. Late payment interest accrues at 1.5% per month on unpaid tax, compounded monthly (Article 32). Understatement penalties: 10% for negligent understatement; 20% for substantial understatement exceeding 25% of correct tax; 40% for gross understatement exceeding 50%; 100% for fraud or intentional tax evasion. Failure to maintain required records attracts a penalty of RWF 200,000 to RWF 500,000. All taxpayers must keep books and records for ten (10) years (Article 15). Tax invoices must be issued within five (5) days of supply and must contain: supplier name, taxpayer identification number (TIN), date, description of supply, taxable value, and VAT amount. RRA may issue an assessment within five (5) years of the end of the tax period or ten (10) years in cases of fraud. A taxpayer may object to an assessment within thirty (30) days of receiving it. If the objection is rejected, further appeal lies to the Tax Appeals Commission within thirty (30) days, then to the High Court.',
  2016,
  'Law No. 016/2016 of 02/05/2016 on tax procedures in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- ARBITRATION LAW — Law No. 005/2008 of 14/02/2008
-- ══════════════════════════════════════════════════════════
(
  'Arbitration Law - Arbitration Agreement and Jurisdiction',
  'arbitration',
  'Under Law No. 005/2008 governing arbitration in Rwanda: Any person with legal capacity to contract may refer a civil or commercial dispute to arbitration (Article 3). Matters of public order, family status, criminal law and certain administrative matters are excluded from arbitration (Article 4). An arbitration agreement must be in writing, either as a clause in a contract or as a standalone submission agreement (Article 5). The arbitration clause is independent from the main contract — invalidity of the main contract does not automatically invalidate the arbitration clause (Article 7). If a party commences court proceedings on a matter covered by an arbitration agreement, the court must, on request, refer the matter to arbitration unless the agreement is null and void (Article 8). The arbitral tribunal may rule on its own jurisdiction including objections as to the existence or validity of the arbitration agreement — this is the Kompetenz-Kompetenz principle (Article 21). A plea of lack of jurisdiction must be raised no later than submission of the statement of defence (Article 22). The tribunal may grant interim or conservatory measures unless the parties agree otherwise (Article 23).',
  2008,
  'Law No. 005/2008 of 14/02/2008 governing arbitration in Rwanda'
),
(
  'Arbitration Law - Appointment of Arbitrators and Conduct of Proceedings',
  'arbitration',
  'Under Law No. 005/2008: The parties are free to agree on the number of arbitrators; failing agreement, the tribunal consists of three (3) arbitrators (Article 11). Each party appoints one arbitrator; the two co-arbitrators appoint the presiding arbitrator. If a party fails to appoint within thirty (30) days of being requested, or the arbitrators fail to agree within thirty (30) days, the competent court makes the appointment (Article 12). Any person regardless of nationality may serve as arbitrator (Article 13). An arbitrator may be challenged if circumstances give rise to justifiable doubts about impartiality or independence (Article 14). Parties must be treated equally and each given a full opportunity to present their case (Article 24). The seat of arbitration is agreed by the parties; failing agreement, determined by the tribunal (Article 26). Proceedings commence on the date the respondent receives the request for arbitration (Article 27). The tribunal decides whether to hold hearings or proceed on documents only; parties must receive advance notice of any hearing (Article 30). If the claimant fails to submit a statement of claim without cause, the tribunal terminates proceedings; if the respondent fails to submit a defence, the tribunal continues without treating the failure as an admission (Article 31).',
  2008,
  'Law No. 005/2008 of 14/02/2008 governing arbitration in Rwanda'
),
(
  'Arbitration Law - Awards, Setting Aside and Enforcement',
  'arbitration',
  'Under Law No. 005/2008: In multi-member tribunals, decisions are by majority vote; if no majority forms on quantum, the presiding arbitrator decides alone (Article 38). The award must be in writing, signed, and state reasons unless the parties agree otherwise (Article 39). A signed copy is delivered to each party (Article 41). Within thirty (30) days of receipt of an award, a party may request correction of computational or typographical errors, interpretation of a specific point, or an additional award on claims omitted (Article 45). The only recourse against an arbitral award is an application to set aside before the competent court (Article 49). An award may be set aside only if the applicant proves: a party lacked capacity; the agreement is invalid; a party was not given proper notice or was unable to present their case; the award exceeds the scope of submission; the tribunal composition or procedure was irregular; the dispute is not arbitrable under Rwandan law; or the award conflicts with Rwandan public policy (Article 50). The application for setting aside must be made within three (3) months of receiving the award (Article 51). An arbitral award, irrespective of the country where it was made, shall be recognised and enforced upon application to the competent court (Article 56). Rwanda is a signatory to the New York Convention (1958) on Recognition and Enforcement of Foreign Arbitral Awards (Article 60). Once recognised, an award is enforced in the same manner as a Rwandan court judgment (Article 61).',
  2008,
  'Law No. 005/2008 of 14/02/2008 governing arbitration in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- BANKING LAW — Law No. 47/2017 of 23/09/2017
-- ══════════════════════════════════════════════════════════
(
  'Banking Law - Licensing Requirements and Minimum Capital',
  'banking',
  'Under Law No. 47/2017 governing the organisation of banking in Rwanda: No person may carry on banking business without a licence issued by the National Bank of Rwanda (BNR). Banking business includes accepting deposits from the public, granting credit, money transfers, issuing payment instruments, foreign exchange operations, and financial leasing (Articles 4 to 20). Licence application requirements include: a three-year business plan; proof of identity and fit-and-proper documentation for all shareholders holding 5% or more, directors and senior management; articles of incorporation; evidence of minimum paid-up capital; information on the group structure and ultimate beneficial owners; an anti-money laundering compliance plan; and technical and operational infrastructure details. BNR must respond to a complete licence application within ninety (90) days. Licences are non-transferable. The minimum paid-up capital for a commercial bank is RWF 5,000,000,000 (five billion Rwandan francs). Banks must maintain a capital adequacy ratio (CAR) of at least 15% aligned with Basel II/III standards. The large exposure limit is 25% of regulatory capital per single counterparty. No person may acquire 10% or more of shares in a bank without prior BNR approval; acquiring a controlling interest requires BNR approval.',
  2017,
  'Law No. 47/2017 of 23/09/2017 governing the organisation of banking in Rwanda'
),
(
  'Banking Law - BNR Supervisory Powers and Prohibited Activities',
  'banking',
  'Under Law No. 47/2017: BNR has the right to conduct on-site examinations of any licensed institution at any time with or without prior notice (Articles 55 to 90). Banks must submit regular prudential returns and financial statements to BNR monthly, quarterly and annually. BNR may issue directives requiring corrective action, impose conditions on or restrict operations, appoint a conservator or administrator for a failing bank, or revoke a licence where the institution obtained its licence by fraud, fails to meet capital requirements, becomes insolvent, or has not commenced operations within twelve (12) months. BNR may remove and replace directors or senior managers who fail the fit-and-proper test. Prohibited activities for licensed banks include: conducting business outside the scope of their licence without BNR approval; acquiring equity stakes in non-financial companies beyond BNR limits; extending unsecured credit to related parties beyond prescribed thresholds; paying dividends when minimum capital requirements are not met; using customer deposits for speculative investments; and directly trading in goods and commodities. Banks must have a Board of Directors with a majority of independent directors, and the roles of Board Chairman and Chief Executive Officer must be held by different individuals. External auditors must be BNR-approved and must rotate after a maximum of five (5) years.',
  2017,
  'Law No. 47/2017 of 23/09/2017 governing the organisation of banking in Rwanda'
),
(
  'Banking Law - Penalties for Unlicensed Banking and Consumer Protection',
  'banking',
  'Under Law No. 47/2017, operating banking business without a licence is a criminal offence (Articles 95 to 100). Penalties for individuals: a fine of RWF 50,000,000 to RWF 200,000,000 and/or imprisonment of two (2) to ten (10) years. Penalties for legal entities: a fine of RWF 100,000,000 to RWF 500,000,000; the entity may also be dissolved by court order. Each day the unlicensed activity continues constitutes a separate offence. Officers and directors who knowingly participate in unlicensed banking are personally liable to the same penalties. Consumer protection provisions (Articles 41 to 54): banks must provide customers with clear written terms and conditions before entering any agreement; the Annual Percentage Rate and all fees must be disclosed upfront; interest rates and charges must be displayed at branches and on the bank website. Rwanda operates a Deposit Guarantee Fund to which all licensed deposit-taking institutions must contribute. Banks are prohibited from engaging in unfair, deceptive or abusive practices. Banks must maintain confidentiality of customer information and may not disclose it to third parties without consent or legal requirement. Banks must establish internal complaint resolution mechanisms; unresolved complaints may be escalated to BNR Consumer Protection Unit. Banks are designated as reporting institutions under Rwanda AML/CFT law and must conduct Know Your Customer (KYC) procedures and report suspicious transactions to the Financial Intelligence Unit. Records must be kept for a minimum of ten (10) years.',
  2017,
  'Law No. 47/2017 of 23/09/2017 governing the organisation of banking in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- MINING LAW — Law No. 17/2020 of 07/10/2020
-- ══════════════════════════════════════════════════════════
(
  'Mining Law - Types of Licences and Duration',
  'mining',
  'Under Law No. 17/2020 governing mining and quarry operations in Rwanda: The following categories of mining licences are issued by the competent authority: (1) Reconnaissance permit — granted for preliminary survey of mineral resources, non-exclusive, valid for one (1) year and renewable; (2) Exploration licence — granted for detailed investigation of mineral deposits, valid for three (3) years and renewable for two additional periods of two (2) years each; (3) Artisanal mining licence — granted to individual miners using manual methods in designated artisanal mining zones, valid for one (1) to two (2) years and renewable; (4) Small-scale mining licence — granted for mechanised but limited-area operations, valid for five (5) years and renewable; (5) Large-scale mining licence — granted for major industrial operations, valid for ten (10) to twenty-five (25) years and renewable; (6) Quarry licence — granted for extraction of construction materials such as sand, gravel and stone. Applications for mining licences must be submitted to the Rwanda Mines, Petroleum and Gas Board (RMB). Priority is given to the first qualified applicant for a given area. Transfer or encumbrance of a mining licence requires prior approval from the competent authority.',
  2020,
  'Law No. 17/2020 of 07/10/2020 governing mining and quarry operations in Rwanda'
),
(
  'Mining Law - Environmental Obligations, Royalties and Revenue Sharing',
  'mining',
  'Under Law No. 17/2020: An Environmental Impact Assessment (EIA) approved by REMA is required before commencement of small-scale and large-scale mining operations. Every mining licence holder must prepare and implement a mine closure and rehabilitation plan approved by the competent authority. An environmental rehabilitation bond or deposit must be lodged before operations commence. Miners are required to restore land disturbed by mining activities to an acceptable environmental standard at the end of operations. Royalties are payable to the Government on all minerals produced and are calculated as a percentage of gross revenue or value at the point of export. Royalty rates vary by mineral type and are specified in the applicable regulations. Revenue sharing arrangements provide for a portion of mining revenues to benefit local government (districts) and affected communities. Mining companies with large-scale licences must negotiate a Development Agreement with the Government setting out additional obligations on local content, community development, and revenue sharing. All minerals extracted are the property of the State until legally transferred to a licensed entity.',
  2020,
  'Law No. 17/2020 of 07/10/2020 governing mining and quarry operations in Rwanda'
),
(
  'Mining Law - Penalties for Illegal Mining and Export of Minerals',
  'mining',
  'Under Law No. 17/2020: Any person who carries out mining or quarrying operations without a valid licence commits an offence. Penalties for unlicensed mining: imprisonment and heavy fines, with all equipment and minerals extracted subject to confiscation by the State. Any person who exports minerals without the required export permit or who misrepresents the type, quantity or value of exported minerals commits an offence punishable by imprisonment and fines proportional to the value of the minerals concerned. Minerals exported in violation of the law are confiscated and the proceeds deposited in the State Treasury. A licence holder who fails to pay royalties within the prescribed period is liable to interest on the unpaid amount and may have their licence suspended or revoked. Trading in minerals purchased from unlicensed artisanal miners is prohibited; licensed dealers must maintain records of all mineral purchases and make them available for inspection. The Rwanda Mines, Petroleum and Gas Board (RMB) has inspection powers and may enter mining sites at any time to verify compliance. Licence holders who obstruct an inspector commit a separate criminal offence.',
  2020,
  'Law No. 17/2020 of 07/10/2020 governing mining and quarry operations in Rwanda'
);
