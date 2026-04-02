-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Excise Duty Law, Local Government Tax Law, Property Tax,
--         Stamp Duty, RRA enforcement, Transfer Pricing
-- Run this AFTER seed_courts_prosecution.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- EXCISE DUTY LAW — Law No. 017/2014 of 26/05/2014 (as amended)
-- ══════════════════════════════════════════════════════════
(
  'Excise Duty Law - Taxable Goods, Rates and Administration',
  'tax',
  'Under Rwandan Excise Duty Law: Excise duty is a consumption tax levied on specific goods manufactured in Rwanda or imported into Rwanda. Goods subject to excise duty and applicable rates include: beer and other fermented beverages — 60% of ex-factory or CIF price; wines and spirits — 70% of ex-factory or CIF price; tobacco products — 150% of ex-factory or CIF price plus a specific amount per 1,000 cigarettes; mineral water and soft drinks — 39% of ex-factory or CIF price; fuel (petrol, diesel, kerosene) — specific amounts per litre as prescribed by ministerial order; motor vehicles — rates varying by engine capacity and age; and mobile telephone airtime — 8% of the value of airtime sold. Excise duty is levied in addition to VAT. Local manufacturers of excisable goods must be licensed by RRA and must install approved fiscal meters or production monitoring systems. Excise duty on locally manufactured goods is payable monthly by the 15th of the following month. Excise duty on imports is collected at the point of importation together with customs duties and VAT. A manufacturer who under-declares production quantities or manipulates monitoring equipment commits a serious offence subject to criminal prosecution and the highest penalty rates under the Tax Procedures Law.',
  2014,
  'Rwanda Excise Duty Law No. 017/2014 of 26/05/2014 and amendments'
),
(
  'Excise Duty Law - Fuel Levy, Motor Vehicle Tax and Telecommunications Levy',
  'tax',
  'Under Rwanda excise duty and related levy laws: Fuel levy is charged on petrol, diesel and other motor fuels at specific amounts per litre set by ministerial order; the levy is included in the pump price paid by consumers. The fuel levy funds road maintenance through the Rwanda Transport Development Agency (RTDA). Motor vehicle registration fees and annual circulation tax are levied on all motor vehicles; rates vary by engine capacity, type of vehicle and age. A vehicle whose annual circulation tax is unpaid may not renew its road licence and is subject to detention by traffic police. Telecommunications levy: a 8% excise on airtime applies to all mobile telephone services. Additionally, a mobile money transaction levy applies to person-to-person mobile money transfers above RWF 1,000; specific rates are set by ministerial order. Hotel, restaurant and bar levy: a local development levy of 1% to 3% is charged by districts on hotel and restaurant services. Mineral water and soft drink levy: local manufacturers must affix revenue stamps or use approved fiscal metering. The East African Community partner states harmonise excise duty rates on certain goods through the EAC Excise Management Act to prevent cross-border smuggling of excisable goods.',
  2014,
  'Rwanda Excise Duty Law and related fuel, vehicle and telecommunications levies'
),

-- ══════════════════════════════════════════════════════════
-- LOCAL GOVERNMENT TAX LAW — Law No. 40/2016 of 08/09/2016
-- ══════════════════════════════════════════════════════════
(
  'Local Government Tax Law - District Taxes, Property Tax and Trading Licences',
  'tax',
  'Under Law No. 40/2016 on local government taxation in Rwanda: Districts are authorised to levy the following local taxes and fees: (1) Fixed asset tax (property tax) — levied on the value of immovable property (land and buildings) at prescribed rates; the annual property tax rate is generally 0.1% to 0.5% of the assessed value depending on the use category of the property; (2) Trading licence fees — all businesses operating in the district must obtain an annual trading licence; the fee is based on the nature and size of the business; (3) Motor vehicle registration fee supplement — districts collect a supplement to the national motor vehicle registration fees; (4) Market fees — fees charged to traders operating in district-run markets; (5) Slaughter fees — charged for each animal slaughtered in a district abattoir; (6) Land lease fees — payable to the district for occupying district-owned land. Property tax: the owner of immovable property must register it with the district and file an annual property tax return by 31 March. The assessed value is determined by the Rwanda Land Management and Use Authority (RLMUA). Property tax on owner-occupied residential homes below a threshold value is exempt. Local government revenues are supplemented by fiscal transfers from the national government. A district that collects more local revenue may retain a greater share; districts are ranked annually on revenue collection performance.',
  2016,
  'Law No. 40/2016 of 08/09/2016 on local government taxation in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- STAMP DUTY AND REGISTRATION FEES
-- ══════════════════════════════════════════════════════════
(
  'Stamp Duty and Registration Fees - Notarial Acts, Land Transfers and Share Transfers',
  'tax',
  'Under Rwandan stamp duty and registration fee regulations: Registration fees (droits d enregistrement) are charged on the registration of certain legal documents including: transfer of land and immovable property — at a rate of 2% of the transaction value; share transfers in companies — at a rate prescribed by ministerial order; notarial deeds constituting companies, partnerships and cooperatives — at prescribed flat rates based on the initial capital; mortgage registration fees — a percentage of the secured amount; and judgments in civil cases above a prescribed value. Registration of land transfers must be done within sixty (60) days of execution of the notarial deed; failure to register within this period results in a penalty surcharge. The registration fee is payable by the buyer or the party in whose favour the right is created unless the parties agree otherwise. Gifts of immovable property between spouses and between parents and children are subject to reduced registration fees. Inheritance transfers are subject to succession registration fees at reduced rates for direct heirs and at standard rates for distant relatives. Documents that are not registered within the prescribed period have reduced evidential value and may not be used as evidence in court without payment of the fee and penalty. Registration fees are collected by RRA and a portion is shared with districts.',
  2016,
  'Rwanda registration fees law and stamp duty regulations administered by RRA'
),

-- ══════════════════════════════════════════════════════════
-- TAX DISPUTES AND RRA ENFORCEMENT
-- ══════════════════════════════════════════════════════════
(
  'Tax Disputes - Tax Appeals Commission, RRA Enforcement and Taxpayer Rights',
  'tax',
  'Under Rwandan tax dispute resolution procedures: A taxpayer who disagrees with a tax assessment issued by RRA must first file an administrative objection with RRA within thirty (30) days of receiving the assessment. RRA must respond to the objection within sixty (60) days. If not satisfied with the RRA objection decision, the taxpayer may appeal to the Tax Appeals Commission (TAC) within thirty (30) days of the objection decision. The TAC is an independent quasi-judicial body with specialist tax and legal expertise. The TAC must decide within ninety (90) days of receiving the appeal. Further appeal from the TAC lies to the High Court commercial chamber within thirty (30) days. Filing an objection or TAC appeal does not automatically suspend payment of the assessed tax; the taxpayer must apply separately for suspension of payment pending the dispute. RRA enforcement powers: RRA may collect unpaid tax through administrative enforcement including: garnishing bank accounts and debts owed to the taxpayer; seizing and selling property; and placing a legal charge on immovable property. RRA may also issue a departure prohibition order preventing a taxpayer with outstanding tax debt from leaving Rwanda. Taxpayer rights: every taxpayer has the right to confidentiality of their tax information; to be treated with respect by RRA officers; to receive a receipt for all tax payments; and to receive a clear explanation of any assessment.',
  2016,
  'Rwanda Tax Procedures Law No. 016/2016 and Tax Appeals Commission regulations'
),

-- ══════════════════════════════════════════════════════════
-- TRANSFER PRICING AND INTERNATIONAL TAX
-- ══════════════════════════════════════════════════════════
(
  'Transfer Pricing Law - Related Party Transactions, Arm Length Standard and Penalties',
  'tax',
  'Under the Rwanda Income Tax Law and Transfer Pricing Regulations: Transfer pricing rules apply to transactions between associated enterprises (related parties within the same corporate group) to ensure that the prices used reflect arm length market prices and are not manipulated to shift profits to lower-tax jurisdictions. Transactions covered by transfer pricing rules include: sales of goods between related parties; provision of services; licensing of intellectual property; financial transactions including inter-company loans; and cost sharing arrangements. Taxpayers with related party transactions above prescribed thresholds must prepare and maintain transfer pricing documentation demonstrating compliance with the arm length standard. Documentation must be available for inspection by RRA upon request and must be submitted with the tax return if requested. The arm length standard is determined using the most appropriate method from: Comparable Uncontrolled Price (CUP); Cost Plus; Resale Price; Profit Split; or Transactional Net Margin Method (TNMM). RRA may adjust the transfer price to the arm length amount and impose additional income tax on the difference. The penalty for transfer pricing adjustments is: 20% of the additional tax where the adjustment results from differences in methodology; 100% where fraud or deliberate manipulation is found. Rwanda has a Mutual Agreement Procedure (MAP) under its double taxation agreements to resolve transfer pricing disputes with treaty partners.',
  2018,
  'Rwanda Income Tax Law transfer pricing provisions and RRA transfer pricing regulations'
),

-- ══════════════════════════════════════════════════════════
-- PENSION FOR PUBLIC SERVANTS — RAMA and Civil Servants Pension
-- ══════════════════════════════════════════════════════════
(
  'Civil Servants Pension and RAMA - Public Sector Health Insurance and Retirement',
  'social_security',
  'Under Rwanda public sector social protection laws: Rwanda has a Medical Insurance for Public Servants managed through RAMA (La Rwandaise d Assurance Maladie). All public servants and their immediate family members (spouse and children) are covered by RAMA health insurance. Contributions to RAMA are shared equally between the public servant and the Government as employer at prescribed rates. RAMA covers hospitalisation, outpatient treatment, dental care, optical care and prescription medicines at government, faith-based and some private health facilities. Pension for public servants: public servants contribute to the RSSB pension scheme on the same terms as private sector employees (5% employee + 5% employer). Public servants with long service (over twenty (20) years) may receive enhanced pension benefits. A public servant who retires at the statutory retirement age of sixty-five (65) years and has contributed for at least fifteen (15) years receives a monthly pension. A public servant dismissed for gross misconduct or criminal conviction may lose a portion of their pension rights depending on the circumstances. Medical evacuation insurance for senior officials is provided separately by the Government for treatment not available in Rwanda. Contributions deducted from public servant salaries must be remitted to RSSB and RAMA by the responsible accounting officer within the prescribed period; failure to remit is a financial offence.',
  2015,
  'Rwanda public sector health insurance (RAMA) and civil service pension regulations'
);
