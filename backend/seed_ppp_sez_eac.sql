-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         PPP Law 14/2016, Special Economic Zones regulations,
--         EAC Treaty provisions, Double Taxation Agreements,
--         Free Zones Law, Biosafety Law 10/2016
-- Run this AFTER seed_legal_professions.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- PUBLIC-PRIVATE PARTNERSHIP LAW — Law No. 14/2016 of 02/05/2016
-- ══════════════════════════════════════════════════════════
(
  'PPP Law - Definition, Types and Approval of Public-Private Partnerships',
  'company',
  'Under Law No. 14/2016 on public private partnership in Rwanda: A Public-Private Partnership (PPP) is a contractual arrangement between a government entity and a private party for the delivery of public infrastructure or services, where the private party bears significant risk and management responsibility in exchange for remuneration linked to performance. Types of PPPs include: Build-Operate-Transfer (BOT) — private party builds, operates and transfers the asset to the Government after a defined period; Build-Own-Operate (BOO) — private party builds, owns and operates indefinitely; Concession — Government grants a private party the right to operate an existing public service for a defined period; and Management contracts — private party manages a public facility for a fee. PPP proposals originate from line ministries or public entities and must be submitted to the PPP Unit within the Ministry of Finance for technical and financial review. The PPP Unit assesses: value for money compared to traditional public procurement; fiscal affordability and risk to public finances; and the capacity of the private party. PPPs above a prescribed value threshold require approval by the Cabinet. The PPP contract must clearly allocate risks between the parties with the principle that risks should be borne by the party best able to manage them. The PPP contract must specify performance standards, payment mechanisms tied to performance, and government step-in rights.',
  2016,
  'Law No. 14/2016 of 02/05/2016 on public private partnership in Rwanda'
),
(
  'PPP Law - Procurement, Contract Management and Unsolicited Proposals',
  'company',
  'Under Law No. 14/2016: PPP contracts are awarded through competitive procurement following the Public Procurement Law unless an exception applies. The procurement process must be transparent, competitive and documented. The successful private partner is selected based on best value criteria combining technical and financial evaluation. The PPP contract is the primary document governing the relationship; it must include: the scope of works and services; the concession or contract period; the remuneration structure; performance standards and monitoring mechanisms; adjustment and renegotiation procedures; termination events and compensation; Government step-in rights in case of contractor failure; and dispute resolution mechanism. Unsolicited proposals: a private party may submit an unsolicited PPP proposal to the Government. If the Government accepts the proposal as having merit, it must run a competitive process; the original proposer may receive a development cost reimbursement and a matching right or bid bonus in the competitive process. Renegotiation of PPP contracts during their term is discouraged and must be approved by the PPP Unit to prevent opportunistic renegotiation. Terminated PPP contracts may result in Government compensation to the private party for unrecovered investments depending on the grounds for termination. PPP fiscal commitments and contingent liabilities must be disclosed in the budget and medium-term expenditure framework.',
  2016,
  'Law No. 14/2016 of 02/05/2016 on public private partnership in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- SPECIAL ECONOMIC ZONES — SEZ Law and RDB Regulations
-- ══════════════════════════════════════════════════════════
(
  'Special Economic Zones - Benefits, Requirements and Operations',
  'company',
  'Under Rwandan Special Economic Zone (SEZ) regulations administered by the Rwanda Development Board (RDB): Special Economic Zones are designated areas where businesses operate under a special regulatory and fiscal regime to attract investment, promote exports and create employment. Rwanda operates Free Trade Zones, Industrial Parks (including Kigali Special Economic Zone — KSEZ) and IT parks. Businesses operating within an SEZ benefit from: exemption from customs duties on imports of capital goods, raw materials and intermediate inputs used in production for export; a preferential Corporate Income Tax rate; simplified customs procedures and single-window clearance; access to serviced industrial land and shared infrastructure; expedited business registration and licensing through the RDB one-stop centre. An investor wishing to operate in an SEZ must apply to the RDB and sign an SEZ operating licence agreement specifying: the nature of activities; employment and investment commitments; performance milestones; and compliance with zone management rules. Goods produced in the SEZ for export are zero-rated for VAT purposes. Goods transferred from the SEZ to the domestic market are treated as imports and are subject to normal customs duties and taxes. An SEZ operator who fails to meet their export commitments or diverts goods to the domestic market without paying applicable duties is subject to penalties and may lose SEZ status.',
  2016,
  'Rwanda Special Economic Zones regulatory framework administered by RDB'
),

-- ══════════════════════════════════════════════════════════
-- EAC TREATY — East African Community
-- ══════════════════════════════════════════════════════════
(
  'EAC Treaty - Customs Union, Common Market and Free Movement',
  'company',
  'Rwanda is a Partner State of the East African Community (EAC) established by the Treaty of 1999 as amended. The EAC Customs Union (established 2005) provides for: a Common External Tariff (CET) on goods from outside the EAC; elimination of internal tariffs on goods traded between EAC Partner States; and common customs management through the EAC Customs Management Act (EACCMA). Under the EAC Common Market Protocol (in force 2010), the following freedoms are progressively implemented: free movement of goods — no internal tariffs or quantitative restrictions between Partner States; free movement of persons — EAC citizens may travel with national identity cards; right of residence for EAC citizens in any Partner State; free movement of services; free movement of capital; and right of establishment — EAC citizens and companies may establish businesses in any Partner State. To benefit from EAC tariff preferences, goods must meet the EAC Rules of Origin — they must be wholly produced in or have undergone sufficient transformation within the EAC as evidenced by a Certificate of Origin. A Rwandan company exporting goods to Kenya, Uganda, Tanzania, Burundi or South Sudan obtains an EAC Certificate of Origin from the RRA. The Northern Corridor (Rwanda-Uganda-Kenya) is a key trade route with harmonised standards and procedures.',
  2010,
  'EAC Treaty for Establishment of East African Community 1999 (as amended), EAC Customs Union Protocol, EAC Common Market Protocol'
),
(
  'EAC Treaty - Dispute Resolution, EAC Court of Justice and EAC Law Supremacy',
  'company',
  'Under the EAC Treaty: The East African Court of Justice (EACJ) is the judicial body of the EAC with jurisdiction over interpretation and application of the Treaty. The EACJ is composed of a First Instance Division and an Appellate Division. Any Partner State, the EAC Secretary General, or a legal or natural resident of a Partner State may refer to the EACJ a matter concerning the interpretation or application of the Treaty. The EACJ does not have general human rights jurisdiction except where human rights relate to a Treaty violation. EAC law (the Treaty, Protocols and the Acts of the EAC Summit and Council) has supremacy over domestic law of Partner States to the extent of inconsistency. Decisions of the EACJ are binding on Partner States, EAC institutions and persons in Partner States. Challenges to acts of Partner State governments that are inconsistent with the Treaty may be brought before the EACJ within two (2) months of the act complained of. The EAC Monetary Union Protocol aims at the eventual establishment of a single EAC currency; Partner States must progressively converge their macroeconomic policies. Rwanda complies with EAC obligations through domestication of EAC legislation and through the Rwanda Standards Board implementing EAC Standardisation, Quality Assurance, Metrology and Testing (SQMT) standards.',
  2010,
  'EAC Treaty for Establishment of East African Community 1999 (as amended), EAC Court of Justice Statute'
),

-- ══════════════════════════════════════════════════════════
-- DOUBLE TAXATION AND TAX TREATIES
-- ══════════════════════════════════════════════════════════
(
  'Double Taxation Agreements - Rwanda Tax Treaties and Withholding Tax Rates',
  'tax',
  'Rwanda has entered into Double Taxation Avoidance Agreements (DTAs) with several countries to prevent the same income from being taxed twice and to encourage investment and trade. Countries with which Rwanda has DTAs include: Belgium, Mauritius, Morocco, South Africa, Qatar, United Arab Emirates, Singapore, Barbados, Jersey, the Isle of Man, and Guernsey, among others. A DTA may reduce or eliminate withholding tax on: dividends (typically reduced to 5% or 10% for significant shareholdings and 10-15% for portfolio investments); interest (typically 10%); and royalties (typically 10%). Under a DTA, a foreign company that does not have a permanent establishment (PE) in Rwanda is generally not subject to corporate income tax in Rwanda on business profits. A PE is a fixed place of business through which a company carries on business — a branch, office, factory or site where services are rendered for more than a prescribed period. The OECD Model Tax Convention and UN Model Tax Convention inform the interpretation of Rwanda DTAs. Transfer pricing rules apply to transactions between related parties (companies in the same group) to ensure they are conducted at arm length prices and not used to shift profits to low-tax jurisdictions. The RRA may adjust transfer prices that do not comply with the arm length standard and impose additional tax and penalties.',
  2018,
  'Rwanda Double Taxation Avoidance Agreements and Income Tax Law provisions on international taxation'
),

-- ══════════════════════════════════════════════════════════
-- BIOSAFETY LAW — Law No. 10/2016 of 05/05/2016
-- ══════════════════════════════════════════════════════════
(
  'Biosafety Law - GMOs, Biotechnology Regulation and Risk Assessment',
  'environment',
  'Under Law No. 10/2016 on biosafety and biotechnology in Rwanda: The National Biosafety Authority (NBA) is responsible for regulating genetically modified organisms (GMOs) and biotechnology activities in Rwanda. Any research involving GMOs, contained use of GMOs, deliberate environmental release of GMOs, or importation of GMO food and feed for commercial use requires authorisation from the NBA. Applications must include a risk assessment evaluating: potential effects on human health; potential environmental impacts including effects on biodiversity; and socio-economic implications. The NBA reviews the application, may require additional information, consults the public and relevant technical experts, and makes a decision within ninety (90) days. The NBA may grant authorisation unconditionally, with conditions, or refuse. A certificate of approval from the NBA is required for customs clearance of GMO products. Labelling of GMO food products is mandatory: food containing more than one percent (1%) GMO content must be labelled as containing GMOs. Research institutions conducting biotechnology research must maintain contained laboratory conditions meeting prescribed biosafety levels. Rwanda is a party to the Cartagena Protocol on Biosafety which governs transboundary movement of living modified organisms. Any person who releases GMOs without authorisation or falsifies GMO assessments commits an offence punishable by imprisonment and significant fines.',
  2016,
  'Law No. 10/2016 of 05/05/2016 on biosafety and biotechnology in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- PLANT PROTECTION AND SEED LAW
-- ══════════════════════════════════════════════════════════
(
  'Plant Protection Law - Seed Registration, Pesticides and Phytosanitary Controls',
  'agriculture',
  'Under Rwandan plant protection laws and regulations: The Rwanda Agriculture and Animal Resources Development Board (RAB) is responsible for plant variety registration, seed certification and phytosanitary control. No crop variety may be commercially marketed in Rwanda unless it has been registered on the national variety list following performance trials demonstrating its agronomic value and suitability for Rwandan agro-ecological conditions. Seed must meet minimum germination rate, purity and moisture content standards set by RAB to be certified as quality declared seed for commercial sale. Only certified seed produced by licensed seed producers may be sold commercially. Pesticides and agrochemicals must be registered with RAB before importation or use in Rwanda; registration requires safety evaluation data including toxicology and environmental impact. Pesticides classified as highly hazardous (WHO Class Ia and Ib) are prohibited or subject to severe restrictions. Pesticide importers and distributors must be licensed. Farmers must use pesticides according to label instructions; misuse causing harm to people, animals or the environment is an offence. Phytosanitary certificates are required for import and export of plants, plant products and other regulated articles to prevent introduction and spread of plant pests and diseases. Rwanda is a member of the International Plant Protection Convention (IPPC).',
  2014,
  'Rwanda plant protection laws, seed certification regulations and phytosanitary framework'
),

-- ══════════════════════════════════════════════════════════
-- FISHERIES LAW
-- ══════════════════════════════════════════════════════════
(
  'Fisheries Law - Fishing Licences, Aquaculture and Conservation',
  'environment',
  'Under Rwandan fisheries laws and regulations: Rwanda manages its fisheries resources in lakes and rivers including Lake Kivu, Lake Burera, Lake Ruhondo and other water bodies. Commercial fishing requires a fishing licence issued by the competent authority specifying the water body, gear types permitted and fishing periods. Seasonal closed periods are established to protect fish spawning and juvenile fish; fishing during closed periods is prohibited. The use of destructive fishing methods including dynamite, poison and mosquito nets with mesh size below the prescribed minimum is prohibited and punishable by imprisonment and fines. Aquaculture (fish farming) is promoted as a means of increasing fish production; aquaculture operators must register and comply with water quality and environmental standards. The importation of live fish species not native to Rwandan waters requires an ecological risk assessment and permit from the environment authority to prevent introduction of invasive species. Rwanda cooperates with the Lake Victoria Fisheries Organisation and other regional bodies on shared fisheries management. The Lake Kivu fisheries are jointly managed with the Democratic Republic of Congo under a bilateral framework. Fishers organisations and cooperatives are encouraged to participate in fisheries management through co-management arrangements with the Government.',
  2013,
  'Rwanda fisheries laws and regulations on fishing, aquaculture and fisheries conservation'
);
