-- Additional Rwanda legal documents for RAG database
-- SOURCE: Official PDFs — Anti-Corruption Law 54/2018, Expropriation Law 32/2015,
--         Family Law 32/2016 (as amended by Law 001/2020)
-- Run this AFTER seed_legal_docs.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- ANTI-CORRUPTION LAW — Law No. 54/2018 of 13/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Anti-Corruption Law - Purpose, Scope and Definition of Corruption',
  'criminal',
  'Law No. 54/2018 aims at preventing and punishing corruption in public organs, civil society, private institutions and international organizations operating or wishing to operate in Rwanda. Corruption means any act performed or caused to be performed in public organs, private institutions, civil society and international organizations, which is aimed at soliciting, receiving or offering an illicit benefit in order to unlawfully obtain illicit enrichment or a given favor to unlawfully render a service or carry out an activity. Corruption is reflected in the following acts: soliciting, accepting or offering illegal benefit; soliciting, promising or offering sexual favors; making a decision based on favoritism, friendship, hatred or nepotism; influence peddling; illicit enrichment; embezzlement; using public property for unintended purposes; demanding or receiving undue or excessive money; abuse of functions; appropriation of unlawful favors. The offence of corruption is imprescriptible.',
  2018,
  'Law No. 54/2018 of 13/08/2018 on fighting against corruption in Rwanda'
),
(
  'Anti-Corruption Law - Soliciting or Accepting Illegal Benefit (Article 4)',
  'criminal',
  'Under Article 4 of Law No. 54/2018: Any person who solicits, accepts or receives, by any means, an illegal benefit for himself or herself or another person or accepts a promise in order to render or omit a service under his or her mandate or uses his or her position to render or omit a service commits an offence. Upon conviction, the penalty is imprisonment for a term of more than five (5) years but not more than seven (7) years with a fine of three (3) to five (5) times the value of the illegal benefit solicited or received. If the act is committed in order to perform an act contrary to law, the penalty is imprisonment of more than seven (7) years and not more than ten (10) years with a fine of three (3) to five (5) times the value of the illegal benefit. The same penalties apply to a person who offers or promises to offer an illegal benefit.',
  2018,
  'Law No. 54/2018 of 13/08/2018 on fighting against corruption in Rwanda'
),
(
  'Anti-Corruption Law - Corruption by Judges and Court Officers (Article 5)',
  'criminal',
  'Under Article 5 of Law No. 54/2018: Any judge or arbitrator who receives or solicits an illegal benefit commits an offence. Upon conviction, the penalty is imprisonment of not less than ten (10) years but not more than twelve (12) years and a fine of three (3) to five (5) times the value of the illegal benefit solicited. Any court registrar, prosecutor, advocate, State attorney, professional bailiff, court judgment review officer, investigator or expert in court who solicits or receives an illicit benefit commits an offence. Upon conviction, the penalty is imprisonment of more than seven (7) years but not more than ten (10) years with a fine of three (3) to five (5) times the value of the illegal benefit received or solicited.',
  2018,
  'Law No. 54/2018 of 13/08/2018 on fighting against corruption in Rwanda'
),
(
  'Anti-Corruption Law - Influence Peddling and Sexual Corruption (Articles 6 and 7)',
  'criminal',
  'Under Article 6 of Law No. 54/2018: Any person who solicits, accepts or promises a sexual favor or subjects another person to such favor in order to render or omit a service commits an offence. Penalty: imprisonment of more than five (5) years and not more than seven (7) years with a fine of FRW 1,000,000 to FRW 2,000,000. If the sexual favor was done to perform a service contrary to law, the penalty is imprisonment of more than seven (7) years and not more than ten (10) years with a fine of FRW 2,000,000 to FRW 3,000,000. Under Article 7: Any person who exerts influence in making a decision for personal benefit or another person benefit commits an offence. Penalty: imprisonment of more than five (5) years and not more than seven (7) years with a fine of FRW 3,000,000 to FRW 5,000,000.',
  2018,
  'Law No. 54/2018 of 13/08/2018 on fighting against corruption in Rwanda'
),
(
  'Anti-Corruption Law - Illicit Enrichment and Embezzlement (Articles 9 and 10)',
  'criminal',
  'Under Article 9 of Law No. 54/2018: Any person who cannot justify the source of his or her assets compared with his or her lawful income commits illicit enrichment. Upon conviction, the penalty is imprisonment of not less than seven (7) years but not more than ten (10) years with a fine of three (3) to five (5) times the value of the property whose legal source cannot be justified. Under Article 10: Any person — whether public servant, company officer, cooperative agent, or any other agent — who embezzles for personal interests property, funds or securities entrusted to him or her by virtue of office commits embezzlement. Upon conviction, the penalty is imprisonment of not less than seven (7) years but not more than ten (10) years and a fine of three (3) to five (5) times the value of the embezzled property.',
  2018,
  'Law No. 54/2018 of 13/08/2018 on fighting against corruption in Rwanda'
),
(
  'Anti-Corruption Law - Abuse of Functions and Nepotism (Articles 8 and 15)',
  'criminal',
  'Under Article 8 of Law No. 54/2018: Any person in charge of providing services to people who makes a decision based on favoritism, friendship, hatred, acquaintances or nepotism commits an offence. Penalty: imprisonment of more than five (5) years but not more than seven (7) years with a fine of FRW 1,000,000 to FRW 2,000,000. Under Article 15: Any public servant or person holding public office who abuses his or her position and performs or omits an act in violation of laws for the purpose of obtaining an illegal benefit commits an offence. Penalty: imprisonment of not less than seven (7) years but not more than ten (10) years and a fine of FRW 5,000,000 to FRW 10,000,000. When a person in a leadership position commits any of the offences under Articles 4 to 16, they are liable to the maximum penalty for that offence.',
  2018,
  'Law No. 54/2018 of 13/08/2018 on fighting against corruption in Rwanda'
),
(
  'Anti-Corruption Law - Corporate Liability, Confiscation and Exemptions (Articles 18 to 20)',
  'criminal',
  'Under Article 18 of Law No. 54/2018: Companies, cooperatives, institutions and organisations with legal personality convicted of corruption are liable to a fine of seven (7) to ten (10) times the value of the illicit benefit received, accepted, solicited, given or promised. Under Article 19: A person who gives or receives an illegal benefit with the aim of helping justice organs to get evidence for corruption is not considered as having committed an offence if he or she informs the judicial organs before the occurrence of the act. There is no criminal liability for a person who informs justice organs before the commencement of criminal investigation by providing information and evidence. Under Article 20: If the defendant is found guilty of corruption, the court orders the confiscation of property or proceeds resulting from the offence.',
  2018,
  'Law No. 54/2018 of 13/08/2018 on fighting against corruption in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- EXPROPRIATION LAW — Law No. 32/2015 of 11/06/2015
-- ══════════════════════════════════════════════════════════
(
  'Expropriation Law - Purpose, Definitions and Powers (Articles 1 to 3)',
  'land',
  'Law No. 32/2015 determines procedures relating to expropriation in the public interest. Expropriation in the public interest means an act based on power of Government, public institutions and local administrative entities with legal personality to remove a person from his or her property in the public interest after fair compensation. Fair compensation means an indemnity equivalent to the value of land and the activities performed thereon given to the person to be expropriated, calculated in consideration of market prices as well as compensation for disturbance due to expropriation. Only the Government shall order expropriation in the public interest. Expropriation shall be carried out only in the public interest and with prior and fair compensation. No person shall hinder the implementation of the program of expropriation in the public interest on pretext of self-centred interests.',
  2015,
  'Law No. 32/2015 of 11/06/2015 relating to expropriation in the public interest in Rwanda'
),
(
  'Expropriation Law - Activities of Public Interest (Articles 5 and 6)',
  'land',
  'Under Article 5 of Law No. 32/2015, activities of public interest include: roads and railway lines; water pipes and public reservoirs; water dams; electric lines; airports and airfields; hospitals, health centres, dispensaries and other public health related buildings; schools and other related buildings; Government administrative buildings; markets; cemeteries; genocide memorial sites; activities to implement land use and development master plans; minerals and other natural resources in the public domain. Under Article 6: The initiator of an act aimed at the implementation of land use and development master plans shall first negotiate with owners of assets affected by the project. In case negotiations fail, formalities related to expropriation in the public interest shall be followed. The price or value of assets affected must be paid by the initiator before any commencement of activities.',
  2015,
  'Law No. 32/2015 of 11/06/2015 relating to expropriation in the public interest in Rwanda'
),
(
  'Expropriation Law - Procedure and Application Requirements (Articles 10 and 11)',
  'land',
  'Under Article 10 of Law No. 32/2015, the application for expropriation in the public interest must contain: the nature of the project; indication that the project aims at the public interest; the master plan of land where the project will be carried out; a document indicating the project has no detrimental effect on the environment; a document confirming availability of funds for fair compensation; an explanatory note detailing that such land suits the project; minutes indicating that the concerned population was sensitized about the project; a study indicating consequences on living conditions of persons to be expropriated. Under Article 11: The relevant committee shall consider the relevance of the project within a period not exceeding thirty (30) days after receiving the request and shall conduct a consultative meeting with the population where the land is located.',
  2015,
  'Law No. 32/2015 of 11/06/2015 relating to expropriation in the public interest in Rwanda'
),
(
  'Expropriation Law - Right to Contest and Appeal (Articles 18 and 33)',
  'land',
  'Under Article 18 of Law No. 32/2015: Any person affected by the decision on expropriation in the public interest has the right to request review of the decision before the organ directly higher than the one having taken the decision. The appeal must be made within thirty (30) days from the day of the publication of the decision. The authority before which the appeal is made must decide within thirty (30) days of receiving the request. Under Article 33: Any person to be expropriated who is not satisfied with the assessed value may, within seven (7) days after approval of the valuation report, indicate in writing grounds for dissatisfaction and engage at their own expense a certified valuer for counter-assessment within ten (10) days. If still not satisfied, the person can refer the matter to the competent court within fifteen (15) days from signing the minutes indicating points of disagreement.',
  2015,
  'Law No. 32/2015 of 11/06/2015 relating to expropriation in the public interest in Rwanda'
),
(
  'Expropriation Law - Valuation, Fair Compensation and Payment (Articles 27 to 38)',
  'land',
  'Under Law No. 32/2015: Properties subject to valuation for fair compensation include: land; activities carried out on land for its efficient management; and compensation for disruption due to expropriation. The compensation for disruption caused by expropriation shall be equivalent to five percent (5%) of the total value of the expropriated property. Fair compensation must be paid before the expropriated person relocates. The approved fair compensation shall be paid within a period not exceeding one hundred and twenty (120) days from the day of its approval. If fair compensation is not paid within that period, expropriation shall become null and void. Subsequent to receiving fair compensation, the expropriated person shall have a period not exceeding one hundred and twenty (120) days to relocate. An expropriator that retracts the project after valuation or fails to pay within the deadline shall pay an additional compensation of five percent (5%).',
  2015,
  'Law No. 32/2015 of 11/06/2015 relating to expropriation in the public interest in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- FAMILY LAW — Law No. 32/2016 of 28/08/2016 (as amended by Law 001/2020)
-- ══════════════════════════════════════════════════════════
(
  'Family Law - Legal Marriage Requirements (Article 166 as amended)',
  'family',
  'Under Article 166 of Law No. 32/2016 as amended by Law No. 001/2020: Civil monogamous marriage contracted upon mutual consent before the public administration is the only recognised marriage. Such a marriage is publicly officiated by the civil registrar of the domicile or residence of one of the intending spouses. Rwandan nationals residing abroad register and contract their marriage in the Rwandan embassy in their country of residence. Religious and customary ceremonies do not by themselves constitute a legally recognised marriage. The marriage must be registered in the civil registry to be legally valid. Bigamy is prohibited — a person who enters into a marriage contract while the previous one is still valid commits an offence under Article 141 of the Penal Code punishable by imprisonment of one to two years.',
  2020,
  'Law No. 32/2016 of 28/08/2016 governing persons and family, as amended by Law No. 001/2020 of 02/02/2020'
),
(
  'Family Law - Divorce Effects and Child Custody (Articles 239 and 243 as amended)',
  'family',
  'Under Article 239 of Law No. 32/2016 as amended by Law No. 001/2020: If a judgment of divorce becomes final, the chief registrar of the court that rendered the final judgment or the spouses must serve it on the civil registrar within two (2) months from delivery of the judgment. The extract of the judgment is entered in the margin of both the marriage record and birth records of spouses. Under Article 243: Custody of children is awarded to the spouse who obtains divorce. The other spouse has the right to visit, talk to, or be visited by the children. The court, on its own motion or upon application, may order that child custody be granted to the other spouse or any third party, taking account of the best interests of the children. The court may also order shared custody between both spouses if it is in the best interests of the children. Measures ordered by the court are always provisional and may be revoked upon application by any interested party.',
  2020,
  'Law No. 32/2016 of 28/08/2016 governing persons and family, as amended by Law No. 001/2020 of 02/02/2020'
),
(
  'Family Law - Birth Registration Requirements (Articles 100 to 105 as amended)',
  'family',
  'Under Articles 100 to 105 of Law No. 32/2016 as amended by Law No. 001/2020: Every child is declared immediately after birth in the health facility where he or she was born upon presentation of a medical birth certificate. In case the child was not born in a health facility, the declaration is made within thirty (30) days after the birth date. The declaration of birth is made by the child father or mother. In case both are not available, the declaration is made by a person they have authorised or any person exercising parental authority or a close relative. Everyone has the right to be given a copy or extract of his or her birth record. The ascendants and descendants of a person, spouse, guardian or legal representative are allowed to be issued with such a copy. No other person may be issued with a copy without the permission of the holder or a competent court.',
  2020,
  'Law No. 32/2016 of 28/08/2016 governing persons and family, as amended by Law No. 001/2020 of 02/02/2020'
),
(
  'Family Law - Death Registration and Effects on Marriage (Articles 106 and 215 as amended)',
  'family',
  'Under Article 106 of Law No. 32/2016 as amended by Law No. 001/2020: The declaration of death is done in the health facility where the death occurred upon presentation of a certificate of death issued by a medical professional. Any person who declares a death occurring in a place other than a health facility does so within thirty (30) days after the date of death upon presentation of a death certificate issued by the competent authority in the presence of two (2) witnesses aged at least eighteen (18) years. Under Article 215: The death of one of the spouses dissolves marriage. A widowed spouse has the right to remarry.',
  2020,
  'Law No. 32/2016 of 28/08/2016 governing persons and family, as amended by Law No. 001/2020 of 02/02/2020'
);
