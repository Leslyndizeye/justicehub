-- Security and Criminal Laws: Major gaps in coverage
-- Covers: Rwanda National Police, Defence Forces, Prisons, Drug Control,
--         Trafficking in Persons, Money Laundering, Terrorism, Firearms,
--         Private Investigations, Witness Protection
-- Run AFTER seed_professional_business_licensing.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- RWANDA NATIONAL POLICE LAW
-- ══════════════════════════════════════════════════════════
(
  'Rwanda National Police Law - Mandate, Powers and Accountability',
  'security',
  'Under the Organic Law governing the Rwanda National Police (RNP): The Rwanda National Police is the national civilian police force responsible for: maintaining public order and security; preventing, detecting and investigating crime; enforcing laws and court orders; protecting persons and property; border security at entry points; traffic management and road safety enforcement; and performing other functions assigned by law. Police officers have powers to: stop and search persons and vehicles where there is reasonable suspicion of crime; arrest persons with or without a warrant in circumstances specified by law; enter premises with a warrant or in urgent circumstances; seize evidence; detain suspects for up to twenty-four (24) hours before handing to the prosecutor; and use reasonable force when necessary and proportionate. A police officer who abuses their powers is personally liable and faces criminal prosecution and disciplinary dismissal. Citizens have the right to: know the identity of a police officer dealing with them (officers must display their badge number); file complaints against police conduct with the Inspector General of Police or the Rwanda National Police Complaints Bureau; receive a copy of any statement they give to police; and be treated with dignity regardless of the circumstances of arrest. The Inspector General of Police is appointed by the President and is accountable to Parliament. Community policing: the RNP partners with communities through neighbourhood watch programmes, community policing committees and the Inkingi ya Umutekano (security pillars) framework. The RNP maintains specialised units including the Criminal Investigations Department (CID), Anti-Terrorism Unit, and Traffic Police.',
  2018,
  'Organic Law governing the Rwanda National Police and RNP operational regulations'
),

-- ══════════════════════════════════════════════════════════
-- RWANDA DEFENCE FORCES LAW
-- ══════════════════════════════════════════════════════════
(
  'Rwanda Defence Forces Law - Military Organisation, Discipline and Civilian Relations',
  'security',
  'Under the Organic Law governing the Rwanda Defence Forces (RDF): The Rwanda Defence Forces are the national armed forces responsible for: defending the territorial integrity and sovereignty of Rwanda; supporting civil authorities in maintenance of order when requested; participating in peacekeeping operations; and contributing to national development. The RDF is composed of the Rwanda Army, Rwanda Air Force, and Rwanda Reserve Force. The President of Rwanda is the Commander-in-Chief of the RDF. The Chief of Defence Staff commands the RDF on behalf of the President. A member of the RDF is subject to military law and the Code of Military Justice in addition to civilian law. Military courts have jurisdiction over military offences including desertion, insubordination, and offences committed in the course of military duty. Civilian offences committed by military personnel may be tried by civilian or military courts depending on the nature of the offence. The RDF may not be deployed on the territory of Rwanda for operations against civilians except upon declaration of a state of emergency by the President with parliamentary approval. Rules of engagement for operations inside and outside Rwanda comply with international humanitarian law including the Geneva Conventions. Peacekeeping: Rwanda is one of the largest contributors of troops to UN and African Union peacekeeping missions globally. Military personnel deployed on peacekeeping operations are subject to the UN Code of Conduct and the laws of the host country in addition to Rwandan military law.',
  2018,
  'Organic Law governing the Rwanda Defence Forces and Rwanda military law'
),

-- ══════════════════════════════════════════════════════════
-- PRISONS AND CORRECTIONAL SERVICES
-- ══════════════════════════════════════════════════════════
(
  'Prisons Law - Rwanda Correctional Service, Prisoner Rights and Rehabilitation',
  'criminal_procedure',
  'Under Rwanda prisons law: The Rwanda Correctional Service (RCS) manages all prisons and detention facilities and is responsible for the custody, welfare, rehabilitation and reintegration of prisoners. Prisoner rights guaranteed by law: the right to humane treatment and physical safety; adequate food, water, clothing and medical care; access to legal counsel; the right to communicate with family members and receive visits; the right to practice religion; access to education and vocational training programmes; and the right to file complaints about their treatment. Torture, cruel or degrading treatment of prisoners is absolutely prohibited and constitutes a criminal offence. A prisoner who is mistreated may file a complaint with the RCS Inspector, the Prison Visitor (an independent oversight role), or the National Human Rights Commission. Solitary confinement may only be used as a disciplinary measure for a maximum of fifteen (15) consecutive days and never for pregnant women or persons with mental illness. Rehabilitation programmes in Rwandan prisons include: primary and secondary education; vocational and technical skills training; psychosocial counselling; agricultural production; and small industry. Rwanda prison farms produce significant agricultural output and engage prisoners in productive work. Remand prisoners (awaiting trial) must be separated from convicted prisoners. Juvenile offenders must be detained in separate facilities from adults. Conditional release (parole) after serving half the sentence is available to well-behaved prisoners. The Itorero re-integration programme prepares prisoners for successful return to their communities.',
  2013,
  'Rwanda Correctional Service Law and prisoners rights regulations in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- NARCOTIC DRUGS AND PSYCHOTROPIC SUBSTANCES LAW
-- ══════════════════════════════════════════════════════════
(
  'Drug Control Law - Narcotic Drugs, Psychotropic Substances and Precursor Chemicals',
  'criminal',
  'Under Rwanda drug control laws: The production, manufacture, importation, exportation, transit, distribution, sale, possession and use of narcotic drugs and psychotropic substances are controlled. Scheduled substances are listed in annexes to the law aligned with the UN 1961 Single Convention on Narcotic Drugs, the 1971 Convention on Psychotropic Substances, and the 1988 Convention against Illicit Traffic. Licensed medical and pharmaceutical activities involving controlled substances require authorisation from the Rwanda FDA and must maintain strict records. A person who: traffics, sells, distributes or supplies narcotic drugs commits an offence punishable by imprisonment of ten (10) to twenty (20) years and a fine of RWF 5,000,000 to RWF 50,000,000. Aggravated trafficking — involving quantities above prescribed thresholds, use of minors, or trafficking near schools — is punishable by life imprisonment. A person found in possession of narcotic drugs for personal use (small quantities) may be prosecuted or diverted to a drug rehabilitation programme at the discretion of the prosecution. Cultivation of cannabis (Ikinyafurika) is prohibited except under licence for industrial hemp. A person who knowingly allows their premises to be used for drug activities commits the same offence as the primary offender. Proceeds of drug trafficking are subject to confiscation regardless of who holds them. Rwanda cooperates internationally on drug enforcement through INTERPOL and bilateral law enforcement agreements. The national drug control policy is coordinated by the Ministry of Health with enforcement by the RNP and RIB.',
  2019,
  'Rwanda narcotic drugs and psychotropic substances control law'
),

-- ══════════════════════════════════════════════════════════
-- TRAFFICKING IN PERSONS LAW
-- ══════════════════════════════════════════════════════════
(
  'Anti-Trafficking Law - Definition, Offences, Victim Protection and Penalties',
  'criminal',
  'Under Rwanda law on preventing and penalising trafficking in persons: Trafficking in persons means the recruitment, transportation, transfer, harbouring or receipt of persons by means of threat, force, coercion, abduction, fraud, deception, abuse of power, or payment to a person having control over another, for the purpose of exploitation. Exploitation includes: sexual exploitation; forced labour; slavery or practices similar to slavery; servitude; removal of organs; and forced participation in criminal activities. The consent of the victim to the intended exploitation is irrelevant if any of the prohibited means were used. A child trafficked for any purpose is a victim regardless of whether prohibited means were used — consent of the child or parent is no defence. Penalties: trafficking in adults is punishable by imprisonment of fifteen (15) to twenty (20) years and a fine of RWF 10,000,000 to RWF 30,000,000. Trafficking in children or trafficking for organ removal is punishable by life imprisonment. Aggravating circumstances (use of weapons, trafficking by an official, trafficking victims across borders) increase penalties. Victim protection: trafficking victims are not prosecuted for offences committed as a direct consequence of being trafficked (including illegal entry, prostitution, or drug carrying). Victims are entitled to: shelter in a certified safe house; medical and psychosocial support; legal representation; a reflection period before being required to cooperate with investigations; and compensation from the trafficker ordered by the court. Rwanda has established a National Committee to Fight against Trafficking in Persons coordinating government and NGO responses.',
  2018,
  'Rwanda anti-trafficking in persons law and victim protection regulations'
),

-- ══════════════════════════════════════════════════════════
-- ANTI-MONEY LAUNDERING AND COUNTER-TERRORISM FINANCING
-- ══════════════════════════════════════════════════════════
(
  'AML/CFT Law - Money Laundering, Terrorism Financing and Financial Intelligence Unit',
  'criminal',
  'Under Rwanda Law No. 006/2013 on anti-money laundering and combating terrorism financing and related offences: Money laundering is the process of concealing or disguising the illegal origin of proceeds of crime to make them appear legitimate. The offence of money laundering covers: converting, transferring or concealing criminal proceeds; acquiring, possessing or using property knowing it is from crime; and assisting any person to evade the consequences of their criminal conduct. Money laundering is punishable by imprisonment of seven (7) to ten (10) years and a fine of twice the value of the laundered proceeds or RWF 10,000,000, whichever is greater. Terrorism financing means providing or collecting funds with the intention or knowledge they will be used to carry out a terrorist act. Terrorism financing is punishable by imprisonment of ten (10) to fifteen (15) years regardless of whether the terrorist act actually occurs. Reporting institutions (banks, insurance companies, forex bureaus, real estate agents, lawyers, accountants, casinos) must: conduct Know Your Customer (KYC) verification; monitor transactions for suspicious patterns; file Suspicious Transaction Reports (STRs) with the Financial Intelligence Unit (FIU) within twenty-four (24) hours of detecting suspicion; and maintain transaction records for ten (10) years. A reporting institution that fails to file an STR when required commits an offence. The Financial Intelligence Unit (FIU) is an autonomous body that receives, analyses and disseminates financial intelligence to law enforcement. All cash transactions above RWF 2,000,000 must be reported to the FIU.',
  2013,
  'Rwanda Law No. 006/2013 on anti-money laundering and combating terrorism financing'
),

-- ══════════════════════════════════════════════════════════
-- COUNTER-TERRORISM LAW
-- ══════════════════════════════════════════════════════════
(
  'Counter-Terrorism Law - Definition, Offences and Penalties',
  'criminal',
  'Under Rwanda counter-terrorism laws: A terrorist act means any act intended to intimidate a population, compel a government or international organisation to take or refrain from an action, or destabilise the fundamental structures of a country, where the act involves: serious violence against persons; serious damage to property; interference with essential services or infrastructure; or threat to use biological, chemical, nuclear or radiological weapons. Offences under counter-terrorism law: committing a terrorist act (life imprisonment); financing terrorism (10 to 15 years); recruitment for a terrorist organisation (10 to 20 years); providing training for terrorism (10 to 15 years); membership of a terrorist organisation (5 to 10 years); inciting terrorism through speeches, publications or online content (5 to 10 years); and failing to report knowledge of a planned terrorist act (1 to 3 years). A terrorist organisation is one designated as such by the competent authority or recognised as such by the UN Security Council. Rwandan courts have jurisdiction over terrorism offences committed in Rwanda, against Rwandan citizens abroad, against Rwandan interests, or by Rwandan nationals anywhere. The Rwanda Investigation Bureau (RIB) Anti-Terrorism Unit has special powers including covert surveillance with judicial authorisation. Assets of terrorist organisations and individuals are frozen and confiscated. Rwanda cooperates internationally on counter-terrorism through the UN Counter-Terrorism Committee, INTERPOL and bilateral cooperation agreements.',
  2018,
  'Rwanda counter-terrorism law and related security provisions'
),

-- ══════════════════════════════════════════════════════════
-- FIREARMS AND WEAPONS LAW
-- ══════════════════════════════════════════════════════════
(
  'Firearms Law - Ownership, Licensing and Penalties for Illegal Weapons',
  'criminal',
  'Under Rwanda firearms control laws: The possession, manufacture, importation, exportation, sale, transfer, use and carrying of firearms and ammunition in Rwanda are strictly controlled. A civilian may possess a firearm only with a valid firearms licence issued by the Rwanda National Police. Licence requirements: minimum age of twenty-one (21) years; no criminal record; mental fitness assessment; secure storage facilities at home; completion of firearms safety training; and payment of licence fees. Categories of firearms civilians may obtain licences for: pistols and revolvers for personal protection; shotguns for hunting. Military and assault weapons are reserved for the military and police — civilians may not possess them. A licensed firearm must be carried concealed and may only be used in genuine self-defence; displaying a firearm to intimidate others without justification is an offence. Reporting requirements: a lost or stolen firearm must be reported to police within twenty-four (24) hours. Criminal penalties: possession of an unlicensed firearm is punishable by imprisonment of five (5) to ten (10) years; armed robbery carries fifteen (15) to twenty (20) years; use of a firearm to commit murder carries life imprisonment. A firearm licence may be revoked by the police for: conviction of any criminal offence; domestic violence; mental illness; and other disqualifying grounds. Arms dealers (importers and retailers of firearms) must hold a commercial firearms dealer licence from the RNP and maintain detailed records of all transactions.',
  2013,
  'Rwanda firearms and weapons control law and Rwanda National Police firearms licensing regulations'
),

-- ══════════════════════════════════════════════════════════
-- WITNESS PROTECTION LAW
-- ══════════════════════════════════════════════════════════
(
  'Witness Protection Law - Protection of Witnesses and Vulnerable Persons in Criminal Proceedings',
  'criminal_procedure',
  'Under Rwanda witness protection laws: Witnesses, victims and informants in criminal proceedings who face a risk to their safety as a result of their participation may apply for protective measures. The Witness and Victim Protection Programme is administered by the National Public Prosecution Authority (NPPA) in cooperation with the Rwanda National Police. Protective measures available include: relocation to a safe location within or outside Rwanda; change of identity; provision of personal security; anonymity in court proceedings (the witness testifies using a pseudonym or behind a screen); voice and image distortion for media coverage; and other measures determined by the competent authority. A court may order that the identity of a protected witness not be disclosed to the accused or defence counsel if disclosure would create a serious risk to the witness, provided the accused has a sufficient opportunity to challenge the witness evidence. The prosecution must disclose to the court any protective measures in place so the court can assess the reliability of the evidence. It is a criminal offence to: reveal the identity of a protected witness; threaten or harm a witness; obstruct a witness from testifying; or retaliate against a witness after testimony. Intimidation of witnesses in proceedings for serious crimes carries imprisonment of five (5) to ten (10) years. A witness who gives false testimony (perjury) in criminal proceedings is punishable by imprisonment of one (1) to five (5) years and a fine.',
  2018,
  'Rwanda witness protection and victim support laws and NPPA witness protection programme'
);
