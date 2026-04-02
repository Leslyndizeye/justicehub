-- Administrative Laws: Permits, Orders and Government Regulations
-- Covers: National Land Use Plan, Building Permits, Water Permits,
--         Environmental Permits, Business One-Stop Center, Government Procurement details,
--         Public Servants Statute, State Property, Presidential Orders framework,
--         Administrative Procedure, Service Delivery Standards
-- Run AFTER seed_financial_services_licensing.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- NATIONAL LAND USE MASTER PLAN
-- ══════════════════════════════════════════════════════════
(
  'National Land Use Master Plan - Zoning, Land Classification and Permitted Uses',
  'land',
  'Under the Rwanda National Land Use Master Plan and District Land Use Plans: Rwanda has a National Land Use and Development Master Plan dividing the country into land use zones with prescribed permitted uses. Main land use categories: (1) Agricultural land — reserved for crop production, livestock and agroforestry; development of non-agricultural uses on gazetted agricultural land requires degazettement by the competent authority; (2) Protected areas — national parks, forest reserves, wetlands and buffer zones where development is prohibited or strictly restricted; (3) Urban areas — cities, towns and planned growth centres with sub-zones for residential, commercial, industrial, institutional and mixed uses; (4) Industrial zones — designated areas for manufacturing, processing, logistics and heavy industry; (5) Infrastructure corridors — land reserved for roads, electricity transmission lines, water pipelines and railways. Land use decisions at district level must be consistent with the National Plan; a district may not approve development that contradicts the national zoning. Change of land use from one category to another requires: application to the Rwanda Land Management and Use Authority (RLMUA); environmental impact assessment where required; payment of conversion fees; and amendment of the cadastral records. Rwanda green hills policy: Rwanda prohibits residential and commercial construction on steep hillsides above a prescribed gradient to prevent landslides. Construction in the watershed protection zones around Kigali and other major towns requires special authorisation.',
  2020,
  'Rwanda National Land Use and Development Master Plan and RLMUA land use zoning regulations'
),

-- ══════════════════════════════════════════════════════════
-- BUILDING PERMITS PROCEDURE — DETAILED
-- ══════════════════════════════════════════════════════════
(
  'Building Permits Law - Application Process, Approval Timelines and Enforcement',
  'administrative',
  'Under Rwanda building permits regulations: A building permit is required before construction, extension, alteration, demolition or change of use of any building. The competent authority for issuing building permits is: the City of Kigali for projects within Kigali; the district for projects outside Kigali; and RURA or sector regulators for specialised infrastructure. Building permit application through Irembo e-government platform requires submission of: architectural plans signed by a registered architect; structural engineering drawings signed by a registered engineer; site plan showing plot boundaries and setbacks; environmental assessment where required; proof of land ownership or right to develop; and payment of permit fees calculated on the project value. Processing timelines: simple residential buildings — fourteen (14) working days; commercial and industrial buildings — twenty-one (21) working days; large or complex projects — thirty (30) working days. An application is deemed approved if the competent authority fails to respond within the prescribed period (deemed approval principle). Reasons must be given for any rejection. During construction, the permit holder must: display the permit on site; allow inspections by building control officers; and notify the authority at key construction stages for inspection. On completion, a certificate of occupancy is issued after final inspection confirming compliance with approved plans. Construction that deviates from approved plans without amendment permit is illegal and subject to demolition order. An illegal structure that cannot be regularised must be demolished at the owner cost.',
  2019,
  'Rwanda building permit regulations administered through Irembo and Rwanda Housing Authority standards'
),

-- ══════════════════════════════════════════════════════════
-- RDB ONE STOP CENTER BUSINESS SERVICES
-- ══════════════════════════════════════════════════════════
(
  'RDB One Stop Center - Business Registration, Investment Facilitation and Permits',
  'business',
  'Under the Rwanda Development Board (RDB) mandate: The RDB One Stop Center provides integrated business registration and investment facilitation services. Business registration services at RDB: company incorporation (same-day service); business name registration; investment certificate for qualifying investors; tax registration (TIN issuance) with RRA; social security registration with RSSB; import/export registration with RRA Customs. Rwanda ranks among the easiest countries in Africa to do business — company registration takes less than six hours online through the RDB online portal. Categories of business entities that can be registered: Public Limited Company (Plc); Private Limited Company (Ltd); Sole Proprietorship; Partnership; Branch of Foreign Company; Representative Office. Requirements for incorporating a Private Limited Company: minimum one shareholder (no minimum capital required for most sectors); completed registration form; identity documents of directors and shareholders; company statutes (optional for Ltd companies using standard statutes); and payment of registration fee (RWF 20,000). Sector-specific licences obtained at the One Stop Center: tourism operator licence; trading licence for foreign nationals; ICT operator licence; and transport operator licence. The Investment Certificate from RDB provides: access to investment incentives; expedited work permit processing for expatriate staff; eligibility for Public-Private Partnership opportunities; and recognition as a priority investor. The One Stop Center also facilitates: land lease agreements for investors; environmental clearance; and connection to utilities.',
  2010,
  'Rwanda Development Board One Stop Center mandate and business registration regulations'
),

-- ══════════════════════════════════════════════════════════
-- ENVIRONMENTAL PERMITS — DETAILED EIA PROCEDURE
-- ══════════════════════════════════════════════════════════
(
  'Environmental Permits - EIA Screening, Categories and REMA Approval Process',
  'environment',
  'Under Rwanda environmental impact assessment regulations: All projects are screened to determine EIA requirements. Project categories: Category A (significant adverse environmental impacts requiring full EIA — large infrastructure, mining, industrial facilities, dams, tourism in sensitive areas); Category B (limited impacts requiring limited environmental study); Category C (negligible impacts — no formal EIA required but must comply with environmental standards). The EIA process for Category A projects: developer submits EIA report prepared by a REMA-certified environmental expert; REMA conducts technical review (thirty days); public consultation including a public hearing in the project area; REMA issues environmental decision (approve, approve with conditions, or reject) within sixty (60) days of receiving a complete report. Environmental conditions attached to an approval are legally binding on the developer. Monitoring: the developer must prepare and submit environmental monitoring reports at prescribed intervals during construction and operation. REMA inspectors may visit the site at any time to verify compliance with conditions. An environmental clearance may be suspended or revoked if conditions are breached. Liability for environmental damage: a developer who causes environmental damage through breach of EIA conditions or unlawful activity is liable for the full cost of environmental restoration under the polluter pays principle. Strategic Environmental Assessments are required for national policies, development plans and programmes with significant environmental implications before adoption.',
  2018,
  'Rwanda Environmental Impact Assessment Law and REMA EIA procedures under Law No. 48/2018'
),

-- ══════════════════════════════════════════════════════════
-- ADMINISTRATIVE PROCEDURE — HOW CITIZENS CHALLENGE GOVT DECISIONS
-- ══════════════════════════════════════════════════════════
(
  'Administrative Procedure Law - Hierarchical Appeals and Administrative Justice',
  'administrative',
  'Under Rwanda administrative law and procedure: Before approaching an administrative court, a person aggrieved by an administrative decision must exhaust internal administrative remedies through hierarchical appeal. Hierarchical appeal procedure: a person who disagrees with a decision of a public servant at one level files an appeal to the superior of that official. The appeal must be filed within thirty (30) days of the decision. The superior must respond within thirty (30) days. If the response is unsatisfactory or no response is received, the aggrieved person may appeal further up the hierarchy or go to court. General principles of administrative decision-making that administrators must follow: legality (decisions must have a legal basis); procedural fairness (the affected person must be heard before an adverse decision is made); proportionality (the decision must not be more burdensome than necessary); non-discrimination (similar cases must be treated similarly); and timeliness (decisions must be made within prescribed timelines). An administrative decision that is silent (no decision made) for more than thirty (30) days on a matter where action was required is treated as a negative decision that can be challenged in court. Administrative courts apply these principles when reviewing decisions. Public authorities that persistently fail to make decisions within required timelines face accountability measures under the performance management system. Citizens who have been denied permits, approvals or registrations must receive written reasons stating the legal basis for the refusal.',
  2015,
  'Rwanda administrative law principles and administrative courts jurisdiction under Law No. 30/2018'
),

-- ══════════════════════════════════════════════════════════
-- STATE PROPERTY LAW
-- ══════════════════════════════════════════════════════════
(
  'State Property Law - Management, Disposal and Accountability for Government Assets',
  'public_finance',
  'Under Rwanda State Finance and Property Laws: State property includes all movable and immovable assets owned by the Government, public institutions and state enterprises. Categories of state property: immovable property (government buildings, land reserves, national parks, rivers and lakes); movable property (vehicles, equipment, furniture); and financial assets (shares in state enterprises, government investments, accounts receivable). Management of state property: each public institution must maintain an asset register of all property under its custody; the Accountant General at institutional level is responsible for the safekeeping of state assets. Disposal of state property must follow prescribed procedures: public auction for movable assets above a threshold; competitive tender for immovable property; and ministerial approval for strategic assets. State land that is no longer required for public purposes may be allocated for investment or other development purposes through a transparent process managed by RLMUA. Accountability: a public official who loses, damages, or misappropriates state property through negligence or deliberate action is personally liable for the value and may be required to make restitution. Write-off of state assets that are lost or damaged beyond economic repair requires approval from the Accountant General at the appropriate level. State vehicles may not be used for private purposes; misuse of government vehicles is a disciplinary offence. Annual asset verification must be conducted by each public institution and the results included in the annual financial statements.',
  2006,
  'Rwanda Law No. 37/2006 on state finances and property — provisions on management and accountability for state assets'
),

-- ══════════════════════════════════════════════════════════
-- PRESIDENTIAL ORDERS FRAMEWORK
-- ══════════════════════════════════════════════════════════
(
  'Presidential Orders - Types, Procedure and Legal Effect',
  'administrative',
  'Under the Rwanda Constitution and administrative laws: Presidential Orders (Iteka rya Perezida) are executive instruments issued by the President of the Republic pursuant to powers conferred by the Constitution or specific laws. Types of Presidential Orders: (1) Organic Presidential Orders — implementing provisions of Organic Laws; have a higher legal status than ordinary Presidential Orders; (2) Presidential Orders implementing specific laws — made within the scope of authority explicitly delegated by Parliament in a specific law; (3) Regulatory Presidential Orders — issued within the President general executive power to ensure implementation of laws. A Presidential Order must cite its legal basis; an Order that has no legal basis in the Constitution or a law is subject to challenge before the Supreme Court as unconstitutional. Presidential Orders are published in the Official Gazette of the Republic of Rwanda and come into force on the date of publication unless a later date is specified. Common subjects of Presidential Orders include: creating, dissolving or reorganising government institutions; appointing and dismissing senior officials including ministers, governors, commissioners, and ambassadors; setting salaries and conditions for constitutional office holders; approving international agreements; and granting pardons and amnesty. Prime Ministerial Orders (Iteka rya Minisitiri w Intebe) implement laws within the scope of the Prime Minister coordination function. Ministerial Orders (Iteka rya Minisitiri) implement laws within each minister sector competence.',
  2003,
  'Rwanda Constitution 2003 (as amended) and legal framework governing Presidential Orders, Prime Ministerial Orders and Ministerial Orders'
),

-- ══════════════════════════════════════════════════════════
-- SERVICE DELIVERY STANDARDS — CITIZEN SERVICE CHARTER
-- ══════════════════════════════════════════════════════════
(
  'Service Delivery Standards - Citizen Service Charters, Standards and Accountability',
  'administrative',
  'Under Rwanda service delivery standards and the Irembo e-government framework: Every public institution providing services to citizens must publish a Citizen Service Charter specifying: the name of each service offered; the eligibility requirements; the documents required from the applicant; the processing fee; and the maximum time within which the service will be delivered. Service charters are published on the institution website and at service delivery points. Service delivery timelines are legally binding and enforced through the performance management system. A citizen whose service request was not processed within the charter timeline has the right to: escalate to the institution head requesting priority processing; file a complaint with the Rwanda Governance Board (RGB) or the Office of the Ombudsman; and in cases of unjustified refusal, appeal to the administrative court. The Government of Rwanda measures service delivery performance annually through the citizen satisfaction survey conducted by the RGB; results are published and used to rank institutions. Common standards applicable to all public service delivery: no service may be denied without written reasons stating the legal basis; no informal payments may be demanded for services with official fees; complaints must be acknowledged within three (3) working days; all service counters must have a visible queue management system; and persons with disabilities and pregnant women must be given priority service. The Irembo platform provides a feedback mechanism for every completed transaction allowing citizens to rate the service.',
  2017,
  'Rwanda service delivery standards framework, Citizen Service Charters and RGB accountability mechanisms'
);
