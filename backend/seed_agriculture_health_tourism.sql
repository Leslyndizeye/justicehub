-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Agriculture Law 09/2013, Food Safety Law 01/2016,
--         Pharmacy Law 12/2019, Tourism Law 06/2019,
--         Customs Law 13/2014, Capital Markets Law 06/2016
-- Run this AFTER seed_child_nationality_civil_service.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- AGRICULTURE LAW — Law No. 09/2013 of 01/03/2013
-- ══════════════════════════════════════════════════════════
(
  'Agriculture Law - Land Use for Agriculture, Crop Intensification and Support',
  'agriculture',
  'Under Law No. 09/2013 on agriculture in Rwanda: Agricultural land must be used productively in accordance with the national land use master plan and district crop plans. The Government implements the Crop Intensification Programme (CIP) which designates priority crops for each agro-ecological zone and provides subsidised inputs including seeds, fertilisers and pesticides to farmers. Farmers are organised into cooperatives to access inputs, credit, extension services and markets. The Rwanda Agriculture and Animal Resources Development Board (RAB) provides agricultural research, extension and advisory services. Irrigation infrastructure is developed and managed by the Government to reduce dependence on rain-fed agriculture. Agricultural land must not be fragmented below the minimum plot size prescribed by ministerial order. A person who neglects or abandons agricultural land to the extent that it becomes unproductive may be required by the competent authority to cultivate the land or lose the right to use it. Export of agricultural produce is regulated by the National Agricultural Export Development Board (NAEB) which sets quality standards, promotes Rwandan agricultural exports and manages certification. Organic and sustainable farming practices are promoted and may qualify for certification and market premiums.',
  2013,
  'Law No. 09/2013 of 01/03/2013 on agriculture in Rwanda'
),
(
  'Agriculture Law - Animal Resources, Veterinary Services and Livestock',
  'agriculture',
  'Under Law No. 09/2013 and related regulations on animal resources: Animal husbandry activities including keeping of livestock, poultry and aquaculture are regulated to ensure food safety and animal welfare. Livestock owners must comply with vaccination programmes for priority diseases including foot and mouth disease, rabies, Newcastle disease in poultry and others designated by the competent authority. A livestock owner who fails to present animals for compulsory vaccination commits an offence. Animal movement across district boundaries requires a veterinary movement permit to control disease spread. Slaughter of animals for human consumption must take place in approved slaughterhouses meeting hygiene standards; clandestine slaughter is prohibited. The Rwanda Agriculture and Animal Resources Development Board (RAB) oversees veterinary services, animal disease surveillance and livestock improvement. Import and export of live animals, animal products and genetic material require phytosanitary and veterinary certificates. Aquaculture — fish farming in rivers, lakes and artificial ponds — is promoted under a specific legal framework requiring permits from the competent authority. Any person who intentionally introduces an animal disease into Rwanda or spreads a notifiable disease commits an offence punishable by imprisonment and fines.',
  2013,
  'Law No. 09/2013 of 01/03/2013 on agriculture in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- FOOD SAFETY LAW — Law No. 01/2016 of 11/01/2016
-- ══════════════════════════════════════════════════════════
(
  'Food Safety Law - Registration of Food Products and Rwanda FDA',
  'health',
  'Under Law No. 01/2016 on food safety in Rwanda: The Rwanda Food and Drugs Authority (Rwanda FDA) is responsible for ensuring the safety and quality of food products, medicines, medical devices and cosmetics on the Rwandan market. No food product may be imported, manufactured, processed, packaged or sold commercially in Rwanda without prior registration with Rwanda FDA. Registration requires submission of: product composition and formulation; safety and quality test results from accredited laboratories; labelling samples; manufacturing facility information; and applicable fees. Registration is valid for five (5) years and must be renewed. Food labelling requirements: all packaged food must carry labels in at least one official language of Rwanda including: product name; list of ingredients; net quantity; manufacturing date; expiry date; storage conditions; name and address of manufacturer; and nutritional information for health claims. Food additives, preservatives and colourings are permitted only if on the approved list and within prescribed limits. Genetically modified organisms (GMOs) used in food must be declared on the label and are subject to specific safety assessment before approval. Rwanda FDA may order a recall of unsafe food products, seal premises and impose fines for violations.',
  2016,
  'Law No. 01/2016 of 11/01/2016 on food safety in Rwanda'
),
(
  'Food Safety Law - Food Business Operators, Penalties and Import Controls',
  'health',
  'Under Law No. 01/2016: All food business operators including manufacturers, importers, distributors and retailers must obtain a food business licence from Rwanda FDA. Food handlers and processors must comply with Good Manufacturing Practice (GMP) and Good Hygiene Practice (GHP) standards. Rwanda FDA inspectors may enter and inspect any food premises, take samples and require production of records at any time. Imported food products must be accompanied by a valid certificate of analysis from a recognised laboratory and a phytosanitary or veterinary certificate where applicable. Rwanda FDA may reject or destroy imported food that does not meet safety or quality standards at the importer cost. Penalties for food safety violations: selling food that is unfit for human consumption is punishable by imprisonment of one (1) to three (3) years and a fine of RWF 500,000 to RWF 5,000,000; for a manufacturer or importer, the fine is RWF 2,000,000 to RWF 20,000,000. Fraudulently misrepresenting the composition, date, origin or quality of food is punishable by imprisonment of two (2) to five (5) years. A food business operator convicted of a serious food safety offence may be permanently prohibited from operating in the food industry.',
  2016,
  'Law No. 01/2016 of 11/01/2016 on food safety in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- PHARMACY LAW — Law No. 12/2019 of 05/09/2019
-- ══════════════════════════════════════════════════════════
(
  'Pharmacy Law - Pharmacist Licensing, Dispensing and Drug Regulation',
  'health',
  'Under Law No. 12/2019 on pharmacy practice in Rwanda: A pharmacist must hold a degree in pharmacy from a recognised institution, be registered with the Rwanda Health Professional Councils, and hold a valid practising licence issued annually. Only a registered pharmacist may own, manage or operate a pharmacy. A pharmacy must be supervised in person by a licensed pharmacist during all hours of operation. Medicines classified as prescription drugs may only be dispensed on presentation of a valid prescription from a licensed medical practitioner. A pharmacist who dispenses a prescription medicine without a prescription commits an offence. The Rwanda FDA maintains a national list of registered medicines; no medicine may be imported, manufactured, sold or distributed in Rwanda unless it is on the registered list. Counterfeit, falsified or substandard medicines are subject to seizure and destruction, and the persons responsible face imprisonment of five (5) to ten (10) years and a fine of RWF 5,000,000 to RWF 50,000,000. Community drug shops (small medicine sellers in rural areas) may be operated by non-pharmacists with a limited licence covering only non-prescription essential medicines and must be supervised by a qualified pharmacist at prescribed intervals.',
  2019,
  'Law No. 12/2019 of 05/09/2019 on pharmacy practice in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- TOURISM LAW — Law No. 06/2019 of 14/02/2019
-- ══════════════════════════════════════════════════════════
(
  'Tourism Law - Tourism Licensing, Classification and Tourist Rights',
  'tourism',
  'Under Law No. 06/2019 on tourism in Rwanda: The Rwanda Development Board (RDB) is the competent authority for tourism regulation, promotion and development. Tourism enterprises including hotels, lodges, guesthouses, tour operators, travel agents, car rental companies and hospitality training institutions must be licensed by the RDB. Accommodation establishments are classified into categories (one star to five star for hotels; basic, standard and superior for guesthouses) based on facilities, services and quality standards assessed by RDB inspectors. Only establishments that have been officially classified may use their classification in marketing. Tour operators who lead visitors in national parks, on mountain gorilla treks or on other wildlife experiences must hold a specific tour operator licence and employ certified guides. Gorilla trekking permits are issued by RDB; a visitor who enters a national park or approaches wildlife without a permit commits an offence punishable by fines and ban from park access. Tourist rights: visitors have the right to accurate information about services and prices; to receive services as advertised; and to file complaints with RDB. A tourism enterprise that engages in fraudulent practices against tourists may have its licence revoked. The RDB promotes community-based tourism to ensure local communities benefit from wildlife and nature tourism.',
  2019,
  'Law No. 06/2019 of 14/02/2019 on tourism in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CUSTOMS LAW — Law No. 13/2014 of 21/05/2014 (EAC Customs Management Act)
-- ══════════════════════════════════════════════════════════
(
  'Customs Law - Import and Export Procedures, Declarations and Duties',
  'customs',
  'Rwanda applies the East African Community Customs Management Act (EACCMA) and the EAC Common External Tariff (CET). All goods imported into or exported from Rwanda must be declared to Rwanda Revenue Authority (RRA) Customs at the point of entry or exit. Importers must submit an import declaration (Single Goods Declaration) through the ASCUDA electronic customs system specifying: description, quantity, weight, value, origin and tariff classification of goods. Customs duty is calculated on the customs value which is based on the transaction value of the goods (CIF — cost, insurance and freight). The EAC Common External Tariff rates are: 0% for raw materials and capital goods; 10% for intermediate goods; and 25% for finished consumer goods. Goods from EAC Partner States (Kenya, Uganda, Tanzania, Burundi, South Sudan) are exempt from customs duty under the EAC Customs Union. A Certificates of Origin is required to benefit from preferential tariff rates under trade agreements. Authorised Economic Operators (AEOs) certified by RRA benefit from expedited customs clearance. Perishable goods, pharmaceutical products and other priority goods benefit from fast-track clearance procedures.',
  2014,
  'EAC Customs Management Act as applied in Rwanda, and Rwanda customs regulations under RRA'
),
(
  'Customs Law - Prohibited Goods, Smuggling Penalties and Post-Clearance Audit',
  'customs',
  'Under Rwanda customs law: Goods absolutely prohibited from importation include: narcotics and controlled substances without authorisation; counterfeit goods; pirated goods; goods bearing false marks of origin; obscene materials; and any goods prohibited by specific Rwandan laws. Goods conditionally prohibited require special permits before importation including: firearms and ammunition; explosives; pharmaceuticals; chemicals; endangered species and related products; used vehicles above a prescribed age limit. Smuggling means importing or exporting goods without declaring them or making a false declaration to evade customs duties. Penalties for smuggling and customs fraud: seizure and forfeiture of the smuggled goods and the means of transport used; a fine of three (3) to ten (10) times the value of duties evaded; and imprisonment of one (1) to five (5) years. For goods absolutely prohibited, the penalty is doubled. Post-clearance audit: RRA customs may audit the records of importers, exporters and customs agents for up to five (5) years after customs clearance to verify the accuracy of declarations. An importer who under-declares the value of goods is liable for the additional duties plus interest at 1.5% per month and penalties.',
  2014,
  'EAC Customs Management Act as applied in Rwanda, and Rwanda customs regulations under RRA'
),

-- ══════════════════════════════════════════════════════════
-- CAPITAL MARKETS LAW — Law No. 06/2016 of 05/05/2016
-- ══════════════════════════════════════════════════════════
(
  'Capital Markets Law - CMA, Securities Exchange and Listing Requirements',
  'finance',
  'Under Law No. 06/2016 on capital markets in Rwanda: The Capital Market Authority (CMA) is the regulatory and supervisory body for capital markets in Rwanda. The Rwanda Stock Exchange (RSE) is the licensed securities exchange. Companies that wish to list on the RSE must apply to both the RSE and the CMA and meet listing requirements including: minimum capital; a prescribed number of shareholders; audited financial statements for a minimum of three years; and a prospectus approved by the CMA. A prospectus for a public offering of securities must contain all material information enabling investors to make an informed investment decision. Issuers must publish a prospectus and submit it to the CMA for approval before making any public offering of securities. Market intermediaries including stockbrokers, investment advisers, collective investment schemes and custodians must be licensed by the CMA. Unlicensed dealing in securities is punishable by a fine of RWF 50,000,000 to RWF 200,000,000 and imprisonment of two (2) to five (5) years. Listed companies must make continuous disclosures of any material information that may affect the price of their securities. Annual audited financial statements must be published within three (3) months of the end of the financial year.',
  2016,
  'Law No. 06/2016 of 05/05/2016 on capital markets in Rwanda'
),
(
  'Capital Markets Law - Insider Trading, Market Manipulation and Investor Protection',
  'finance',
  'Under Law No. 06/2016: Insider trading means buying or selling securities using material non-public information obtained through a privileged relationship with the issuer. Insider trading is prohibited and punishable by a fine of two (2) to five (5) times the profit made or loss avoided and imprisonment of two (2) to seven (7) years. Market manipulation including spreading false information to affect securities prices, wash trading, and circular trading is prohibited and carries the same penalties. The CMA may investigate suspected market misconduct and has powers to: compel production of records and information; freeze assets pending investigation; refer cases for prosecution; and impose administrative sanctions including fines, suspension and revocation of licences. Investor protection measures include: mandatory segregation of client funds from broker own funds; investor compensation fund to compensate investors for losses caused by licensed intermediary default; cooling-off period for investors in collective investment schemes; and prohibition of misleading marketing materials. Shareholders of a listed company who hold at least five percent (5%) of shares must disclose their holding to the CMA; changes in holding above prescribed thresholds must be notified within three (3) business days. A takeover offer for a listed company must be made to all shareholders on equal terms.',
  2016,
  'Law No. 06/2016 of 05/05/2016 on capital markets in Rwanda'
);
