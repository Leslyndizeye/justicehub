-- Financial Services Business Licensing Laws
-- Covers: Forex Bureaus, Money Transfer, Credit Reference, Pension Funds,
--         Leasing, Factoring, Mobile Banking, Investment Advisors,
--         Collective Investment Schemes, Financial Consumer Protection
-- Run AFTER seed_diplomatic_eac.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- FOREX BUREAUS
-- ══════════════════════════════════════════════════════════
(
  'Forex Bureau Law - Licensing, Exchange Rates and Compliance',
  'finance',
  'Under BNR regulations governing foreign exchange bureaus in Rwanda: A forex bureau is a licensed entity that buys and sells foreign currencies for Rwandan francs at retail. No person may operate a foreign exchange business without a forex bureau licence from the National Bank of Rwanda (BNR). Licence requirements: minimum paid-up capital as prescribed by BNR; a physical business premises meeting BNR standards; approved security systems including CCTV; fit-and-proper owners and managers; AML/CFT compliance programme; and annual licence renewal. A forex bureau must display exchange rates prominently and apply the displayed rates to all customers; overcharging a customer above the displayed rate is prohibited. The BNR sets a permitted spread between buying and selling rates; bureaus operating outside the permitted spread face sanctions. Transactions above a prescribed threshold (typically equivalent to USD 1,000 or RWF 1,500,000) must be verified by requiring customer identification and recording the transaction. Suspicious transactions must be reported to the Financial Intelligence Unit (FIU). A forex bureau must record all transactions electronically and retain records for five (5) years. A forex bureau may not accept deposits from the public or provide credit. BNR inspects forex bureaus regularly; operating without a licence or after licence revocation is punishable by a fine of RWF 10,000,000 to RWF 50,000,000 and closure. The forex bureau sector is monitored as part of Rwanda foreign exchange market surveillance.',
  2014,
  'National Bank of Rwanda forex bureau licensing regulations and foreign exchange control framework'
),

-- ══════════════════════════════════════════════════════════
-- MONEY TRANSFER OPERATORS
-- ══════════════════════════════════════════════════════════
(
  'Money Transfer Law - Remittance Services, Licensing and Consumer Protection',
  'finance',
  'Under BNR payment systems regulations governing money transfer operators (MTOs) in Rwanda: A money transfer operator is an entity that transfers funds between senders and receivers within Rwanda (domestic remittance) or across borders (international remittance). MTOs must be licensed by BNR as payment service providers. International MTOs operating in Rwanda include Western Union, MoneyGram, World Remit, and mobile money-based cross-border services. MTOs must comply with AML/CFT requirements including: customer identification for all transactions above prescribed thresholds; transaction monitoring; filing suspicious transaction reports with the FIU; and screening customers against sanctions lists. Transaction limits are set by BNR for each tier of customer KYC: basic identification (mobile number only) has lower limits; full KYC (national ID + proof of address) enables higher limits. Exchange rates applied to international transfers must be disclosed to the sender before the transaction is completed including all fees and the exchange rate; the recipient must receive the amount as disclosed. A sender has a right to cancel an international transfer within thirty (30) minutes of sending if the funds have not yet been collected. MTOs must ensure funds are available for collection within the timeframe disclosed to the sender. Rwanda encourages remittances from the diaspora as a significant source of foreign exchange; remittance providers are required to offer competitive rates and low fees as part of financial inclusion policy.',
  2018,
  'BNR payment systems regulations governing money transfer operators and remittance services in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CREDIT REFERENCE BUREAU
-- ══════════════════════════════════════════════════════════
(
  'Credit Reference Law - Credit Bureau, Credit Scoring and Borrower Rights',
  'finance',
  'Under BNR regulations on credit reference bureaus in Rwanda: A credit reference bureau (CRB) collects, processes and provides credit information on borrowers to assist lenders in making credit decisions. BNR licences credit reference bureaus operating in Rwanda. All regulated financial institutions — banks, microfinance institutions, SACCOs, insurance companies and mobile money lenders — are required to submit credit information on their borrowers to the licensed CRB on a monthly basis. Credit information submitted includes: identity of the borrower; loan amounts and outstanding balances; repayment history (on-time, late, or defaulted); and any written-off accounts. A borrower has the right to: access their own credit report once per year free of charge; request correction of inaccurate information; know that their credit information was accessed by a lender. A lender that refuses credit solely on the basis of an inaccurate CRB entry must assist the borrower to correct the record. Negative credit information (late payments and defaults) may be retained on the CRB for a maximum of five (5) years from the date the debt was settled. A person who provides false information to obtain credit, or who fraudulently manipulates CRB records, commits an offence. Credit scoring: CRBs provide credit scores based on repayment history enabling lenders to price credit risk; a good credit score enables borrowers to access better loan terms. The CRB framework is designed to increase financial inclusion by enabling lenders to extend credit to persons without collateral based on demonstrated repayment behaviour.',
  2012,
  'BNR credit reference bureau regulations in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- LEASING AND FACTORING LAW
-- ══════════════════════════════════════════════════════════
(
  'Leasing and Factoring Law - Financial Leasing, Asset Financing and Invoice Discounting',
  'finance',
  'Under BNR regulations on leasing and factoring companies in Rwanda: A financial lease is an arrangement whereby a lessor (finance company) purchases an asset at the request of the lessee and allows the lessee to use it for a prescribed period in exchange for periodic payments; the lessee bears the economic risks and benefits of ownership. Financial leasing companies must be licensed by BNR. Uses of financial leasing in Rwanda: equipment leasing for businesses; vehicle leasing for corporates and SMEs; agricultural machinery leasing; and ICT equipment leasing. The lessee may at the end of the lease term purchase the asset at a residual value specified in the lease agreement. The asset remains the property of the lessor until the final payment is made; if the lessee defaults, the lessor may repossess the asset. Registration of financial leases: to protect against third-party claims, a financial lease of movable assets must be registered in the collateral registry maintained by the Registrar General. Operating lease (short-term equipment rental) is available from non-licensed entities. Factoring: a factoring company purchases trade receivables (unpaid invoices) from businesses at a discount, providing immediate cash flow; the factoring company collects payment from the debtors. Invoice discounting is similar but the seller retains control of collecting the debts. Factoring companies must be registered with BNR. The Instructions of the Registrar General on Finance Lease Agreement Registration (Instructions No. 1/2021) govern the formal registration requirements.',
  2021,
  'BNR leasing and factoring company regulations and Registrar General Instructions No. 1/2021 on finance lease registration'
),

-- ══════════════════════════════════════════════════════════
-- COLLECTIVE INVESTMENT SCHEMES
-- ══════════════════════════════════════════════════════════
(
  'Collective Investment Schemes - Unit Trusts, Investment Funds and CMA Regulation',
  'finance',
  'Under the Capital Market Authority (CMA) regulations on collective investment schemes (CIS) in Rwanda: A collective investment scheme pools money from multiple investors to invest in a diversified portfolio managed by a professional fund manager. Types of CIS regulated in Rwanda: unit trusts (open-ended funds where investors buy and sell units daily at the current net asset value); closed-end funds (listed on the RSE with a fixed number of shares); and Real Estate Investment Trusts (REITs). A CIS must be approved by the CMA before it may be offered to the public. The fund manager must hold a CMA investment management licence; the custodian of fund assets must be a licensed bank or custodian. A prospectus approved by the CMA must be published before a public offer of CIS units. Key investor protections in CIS: fund assets must be held by the custodian separately from the manager own assets — they are protected in the manager insolvency; the CMA mandates independent valuation of CIS assets; fees must be disclosed in the prospectus; investors in open-ended funds may redeem their units within prescribed periods. A fund manager who misappropriates client funds or churns the portfolio for excessive commission commits an offence. The CMA may appoint a receiver for a fund whose manager has failed. Pension funds and insurance companies are the primary institutional investors in Rwandan CIS. The Rwanda Stock Exchange lists some closed-end funds and REITs providing liquidity to investors.',
  2016,
  'Capital Market Authority regulations on collective investment schemes in Rwanda and CMA Guidelines on Real Estate Investment Trusts'
),

-- ══════════════════════════════════════════════════════════
-- PENSION FUND MANAGEMENT
-- ══════════════════════════════════════════════════════════
(
  'Pension Fund Regulation - Private Pension Schemes, Trustee Duties and BNR Oversight',
  'finance',
  'Under BNR regulations on private pension funds in Rwanda: In addition to the mandatory RSSB public pension scheme, private occupational pension schemes and personal retirement savings plans are regulated by BNR. An employer may establish a private occupational pension scheme for employees as a supplement to RSSB. Private pension schemes must be registered with BNR. A pension fund is managed by a Board of Trustees who have fiduciary duties to act in the best interests of scheme members. Trustees must: invest scheme assets prudently in accordance with the investment policy and BNR prescribed investment limits; maintain proper accounts; appoint a licensed fund manager and custodian; conduct annual audits by an approved auditor; and provide members with annual benefit statements. Investment limits for pension funds: minimum percentage in government securities; maximum exposure to equities; maximum single-issuer exposure; and prohibition on investing in related-party assets above prescribed limits. A pension fund that is under-funded (where liabilities exceed assets) must have a recovery plan approved by BNR. Member rights: each member has a right to know the value of their accrued benefits; to receive benefits when eligible; and to transfer accrued benefits if they change employers (portability). Pension benefits are protected from creditor claims — a pension fund cannot be attached to satisfy the personal debts of the employer or members. Voluntary personal pension savings products (retirement annuities) may be offered by licensed insurers and fund managers.',
  2015,
  'BNR private pension fund regulations and RSSB Law on occupational pension schemes in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- FINANCIAL CONSUMER PROTECTION DETAILED
-- ══════════════════════════════════════════════════════════
(
  'Financial Consumer Protection - Disclosure, Fair Treatment and BNR Complaint Handling',
  'finance',
  'Under BNR financial consumer protection regulations: All BNR-regulated financial institutions must implement a Financial Consumer Protection Framework covering: transparent disclosure of all product terms, fees, interest rates and risks before the customer commits; fair and non-deceptive marketing; responsible lending (assessment of borrower ability to repay before extending credit); data privacy and confidentiality of customer financial information; and effective complaint handling. Responsible lending requirements: a lender must not approve a loan where repayment instalments exceed thirty-three percent (33%) of the borrower net monthly income; over-indebtedness that results from irresponsible lending by the institution may require the institution to restructure the loan. Loan documentation: every loan must be supported by a written agreement setting out: the principal amount; interest rate (expressed as an Annual Percentage Rate); fees; repayment schedule; consequences of default; and the right to prepay. Financial institutions are prohibited from charging prepayment penalties on consumer loans. A borrower who is experiencing financial difficulty has the right to request loan restructuring; the financial institution must consider the request in good faith. Complaint escalation: a customer whose complaint is not resolved by the financial institution within fifteen (15) working days may escalate to the BNR Consumer Protection Unit. BNR may investigate, mediate and order financial institutions to provide remedies including refunds and compensation. Persistent or systemic violations of consumer protection requirements may result in public sanctions and fines.',
  2019,
  'BNR Financial Consumer Protection Regulations and guidelines for regulated financial institutions in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- INVESTMENT ADVISORS AND FUND MANAGERS
-- ══════════════════════════════════════════════════════════
(
  'Investment Advisory Law - Licensing of Investment Advisors, Portfolio Managers and Brokers',
  'finance',
  'Under Capital Market Authority (CMA) regulations on capital market intermediaries in Rwanda: Persons providing investment advisory services, managing client portfolios, or dealing in securities on behalf of clients must be licensed by the CMA as capital market intermediaries. Categories of capital market licences: stockbroker (buying and selling securities on behalf of clients on the Rwanda Stock Exchange); dealer (trading securities on own account); investment advisor (providing advice on investments for fees); portfolio manager (managing discretionary investment portfolios); custodian (holding client securities and assets); and collective investment scheme manager. Licensing requirements for individuals: relevant qualification in finance, investments or law; minimum years of experience; passing the CMA licensing examination; and clean compliance record. Licensing requirements for firms: minimum capital requirements; fit-and-proper assessment of key persons; compliance systems; segregation of client assets; and professional indemnity insurance. Conduct of business rules: an investment advisor must make a suitability assessment before recommending any investment — the advice must be suitable for the client investment objectives, risk tolerance and financial situation. An advisor who recommends unsuitable investments is liable for resulting losses. Churning (excessive trading in a client account to generate commissions) is prohibited. Conflicts of interest must be disclosed to the client. Client funds and securities must be segregated from the firm own assets at all times and may not be used for the firm own purposes. Best execution: brokers must execute client orders at the best available price.',
  2016,
  'Capital Market Authority licensing regulations for investment advisors, portfolio managers and securities dealers in Rwanda'
);
