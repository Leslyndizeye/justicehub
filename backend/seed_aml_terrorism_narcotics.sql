-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         AML/CFT Law 47/2018, Counter-Terrorism Law 46/2018,
--         Narcotics Law 50/2018, Human Trafficking Law 51/2018
-- Run this AFTER seed_contracts_property_disputes.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- ANTI-MONEY LAUNDERING LAW — Law No. 47/2018 of 13/08/2018
-- ══════════════════════════════════════════════════════════
(
  'AML Law - Definition of Money Laundering and Reporting Obligations',
  'criminal',
  'Under Law No. 47/2018 on prevention and punishment of money laundering and financing of terrorism in Rwanda: Money laundering means any act of concealing, disguising or converting proceeds of a crime to make them appear to come from a legitimate source. The three stages of money laundering are placement (introducing illicit funds into the financial system), layering (disguising the trail through complex transactions) and integration (re-introducing the laundered money as legitimate funds). Reporting entities subject to AML obligations include: banks and financial institutions; insurance companies; accountants and auditors; lawyers handling client funds; real estate agents and notaries; casinos and gaming operators; and dealers in high-value goods including vehicles, jewelry and art. Reporting entities must implement: Customer Due Diligence (CDD) and Know Your Customer (KYC) procedures; enhanced due diligence for high-risk customers including politically exposed persons (PEPs); ongoing monitoring of transactions; and record keeping for a minimum of ten (10) years. A Suspicious Transaction Report (STR) must be filed with the Financial Intelligence Unit (FIU) of the National Bank of Rwanda within twenty-four (24) hours of a transaction being identified as suspicious. The tipping-off prohibition: it is a criminal offence to inform a customer that an STR has been filed or that they are under investigation for money laundering.',
  2018,
  'Law No. 47/2018 of 13/08/2018 on prevention and punishment of money laundering and financing of terrorism in Rwanda'
),
(
  'AML Law - Penalties, Asset Confiscation and International Cooperation',
  'criminal',
  'Under Law No. 47/2018: Any person convicted of money laundering is liable to imprisonment of seven (7) to fifteen (15) years and a fine of three (3) to five (5) times the value of the laundered funds. Aggravated money laundering — committed by a public official, committed within a criminal organisation, or involving proceeds of terrorism — carries imprisonment of fifteen (15) to twenty (20) years. A legal entity convicted of money laundering is liable to a fine of five (5) to ten (10) times the value of the laundered funds and may be dissolved. Asset confiscation: the court must order confiscation of all proceeds and instruments of money laundering and all property of equivalent value where the direct proceeds cannot be found. A civil forfeiture proceeding may be brought against assets without requiring a criminal conviction where there is sufficient evidence that the assets are proceeds of crime. The FIU is the central body for receiving, analysing and disseminating financial intelligence. Rwanda is a member of the Eastern and Southern Africa Anti-Money Laundering Group (ESAAMLG) and implements FATF (Financial Action Task Force) standards. International mutual legal assistance requests for tracing, freezing and confiscating assets are processed through the Office of the Attorney General.',
  2018,
  'Law No. 47/2018 of 13/08/2018 on prevention and punishment of money laundering and financing of terrorism in Rwanda'
),
(
  'AML Law - Financing of Terrorism and Targeted Financial Sanctions',
  'criminal',
  'Under Law No. 47/2018: Financing of terrorism means providing or collecting funds with the knowledge or intention that they will be used wholly or partly to carry out a terrorist act or to support a terrorist organisation. Financing of terrorism is an offence regardless of whether the underlying terrorist act is actually committed. Penalty: imprisonment of fifteen (15) to twenty-five (25) years and a fine of five (5) to ten (10) times the value of the funds involved. Targeted financial sanctions: all natural persons, legal entities, and organisations on the UN Security Council Consolidated List and the national terrorism list are subject to asset freezing without prior notice. Any person who holds assets of a listed person must immediately freeze them and report to the FIU. Dealing with frozen assets is prohibited. Delisting applications may be made to the competent authority. Proliferation financing — financing the development of weapons of mass destruction — is subject to the same sanctions and penalties as terrorism financing. Reporting entities must screen all customers and counterparties against the UN Consolidated List and national lists before any transaction.',
  2018,
  'Law No. 47/2018 of 13/08/2018 on prevention and punishment of money laundering and financing of terrorism in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- COUNTER-TERRORISM LAW — Law No. 46/2018 of 13/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Counter-Terrorism Law - Definition of Terrorism and Terrorist Offences',
  'criminal',
  'Under Law No. 46/2018 on prevention and punishment of terrorism in Rwanda: Terrorism means any act aimed at intimidating a population, destabilising or destroying the fundamental structures of a country, an international organisation or compelling a Government to take or abstain from taking an action, by using violence causing death, serious bodily harm, kidnapping, holding hostages, destroying property, hijacking means of transport, or using weapons of mass destruction. Acts constituting terrorism include: bomb attacks; hijacking of aircraft, ships or other means of transport; attacks on heads of state; use of biological, chemical, nuclear or radiological weapons; cyberattacks on critical infrastructure; and armed attacks on civilians. Planning, facilitating, financing, recruiting for or providing material support to terrorism are all separate offences. A person convicted of carrying out a terrorist act is liable to life imprisonment. Participation in a terrorist organisation is punishable by imprisonment of fifteen (15) to twenty (20) years. Financing or providing material support to terrorism carries imprisonment of fifteen (15) to twenty-five (25) years. Recruiting persons into a terrorist organisation is punishable by imprisonment of ten (10) to fifteen (15) years. A person who has information about a planned terrorist act and fails to report it to the authorities commits an offence punishable by imprisonment of two (2) to five (5) years.',
  2018,
  'Law No. 46/2018 of 13/08/2018 on prevention and punishment of terrorism in Rwanda'
),
(
  'Counter-Terrorism Law - Investigation Powers, Detention and Asset Confiscation',
  'criminal',
  'Under Law No. 46/2018: The investigation of terrorism offences is conducted by the Rwanda Investigation Bureau (RIB) in close cooperation with the National Intelligence and Security Service (NISS). Special investigative techniques authorised for terrorism cases include: covert surveillance; interception of communications with judicial authorisation; undercover operations; and controlled delivery. A person suspected of terrorism may be held in investigative detention for up to thirty (30) days initially, with extensions authorised by the court for a maximum total of twelve (12) months before trial. The court may issue a freezing order against the assets of a terrorism suspect at any stage of the investigation. All assets belonging to a convicted terrorist are subject to confiscation including assets acquired during the ten (10) years prior to the offence where legitimate source cannot be proven. A deradicalization and rehabilitation programme exists for persons who voluntarily renounce terrorism and cooperate with the authorities; such persons may benefit from reduced sentences. Rwanda cooperates with international counter-terrorism mechanisms including UN Security Council sanctions committees, Interpol and regional security organisations. A person designated as a terrorist on the national list may appeal the designation to the competent court within thirty (30) days.',
  2018,
  'Law No. 46/2018 of 13/08/2018 on prevention and punishment of terrorism in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- NARCOTICS LAW — Law No. 50/2018 of 13/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Narcotics Law - Controlled Substances, Possession and Trafficking',
  'criminal',
  'Under Law No. 50/2018 on prevention and punishment of narcotic drugs and psychotropic substances offences in Rwanda: Narcotic drugs and psychotropic substances are classified in schedules based on their abuse potential and therapeutic value. Controlled substances include: cannabis (marijuana), heroin, cocaine, methamphetamine, MDMA (ecstasy), and other scheduled substances. Unauthorised possession of a controlled substance for personal use is punishable by imprisonment of two (2) to five (5) years and a fine of RWF 500,000 to RWF 5,000,000. Drug trafficking — possession with intent to supply, selling, distributing, importing or exporting controlled substances — is punishable by imprisonment of ten (10) to twenty (20) years and a fine of five (5) to ten (10) times the street value of the drugs seized. Aggravated trafficking committed by: a person in a position of authority; using minors to traffic drugs; trafficking near schools or places of worship; or trafficking within a criminal organisation — carries imprisonment of twenty (20) years to life. Precursor chemicals used in the manufacture of controlled substances are also regulated; unauthorised possession or trading in precursors is an offence. Drug users who voluntarily report to health authorities for treatment benefit from a reduced penalty and priority access to rehabilitation services.',
  2018,
  'Law No. 50/2018 of 13/08/2018 on prevention and punishment of narcotic drugs and psychotropic substances offences in Rwanda'
),
(
  'Narcotics Law - Drug Manufacturing, Asset Confiscation and Treatment',
  'criminal',
  'Under Law No. 50/2018: Unlicensed manufacture, production or processing of controlled substances is punishable by imprisonment of fifteen (15) to twenty-five (25) years and a fine of ten (10) to twenty (20) times the value of the drugs manufactured. A person who knowingly provides premises for drug use or drug dealing commits an offence punishable by imprisonment of five (5) to ten (10) years. The court must order confiscation of all drugs, equipment, proceeds and property used in or derived from drug offences. Where confiscated proceeds cannot be directly identified, a value equivalent order may be made against other property of the offender. Drug offences involving volumes above prescribed threshold quantities are treated as large-scale trafficking. No time limit applies to the prosecution of serious drug trafficking offences — they are imprescriptible. The National Commission for the Fight against Drugs (NCFD) coordinates prevention, treatment and rehabilitation programmes. Drug dependence treatment centres are established by the Government and operate voluntarily or by court referral. A court may order a convicted drug user to undergo compulsory treatment in lieu of or in addition to imprisonment where this is in the interests of rehabilitation.',
  2018,
  'Law No. 50/2018 of 13/08/2018 on prevention and punishment of narcotic drugs and psychotropic substances offences in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- HUMAN TRAFFICKING LAW — Law No. 51/2018 of 13/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Human Trafficking Law - Definition, Offences and Victim Protection',
  'criminal',
  'Under Law No. 51/2018 on prevention and punishment of trafficking in persons and smuggling of migrants in Rwanda: Trafficking in persons means the recruitment, transportation, transfer, harbouring or receipt of persons by means of threat, force, coercion, abduction, fraud, deception, abuse of power or exploitation of vulnerability, for the purpose of exploitation. Exploitation includes: sexual exploitation; forced labour; slavery and servitude; forced criminality; forced marriage; and removal of organs. Consent of the victim is irrelevant where any of the prohibited means were used. Trafficking of children is an aggravated offence regardless of whether any prohibited means were used. Penalties: trafficking of adults is punishable by imprisonment of fifteen (15) to twenty (20) years; trafficking of children is punishable by imprisonment of twenty (20) years to life. Aggravating circumstances including use of violence, trafficking across borders, or trafficking within an organised criminal group, increase penalties to life imprisonment. A victim of trafficking is not criminally liable for offences committed as a direct consequence of being trafficked. Victims must be provided with: immediate shelter, medical and psychological support; legal assistance; a reflection and recovery period before being required to cooperate with investigation; and protection from retaliation. The National Committee against Trafficking in Persons coordinates the national anti-trafficking response.',
  2018,
  'Law No. 51/2018 of 13/08/2018 on prevention and punishment of trafficking in persons and smuggling of migrants in Rwanda'
);
