-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Child Protection Law 54/2011, Nationality Law 30/2008,
--         Civil Service Law 86/2013, Succession Law (Family Law 32/2016)
-- Run this AFTER seed_land_housing_gender.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- CHILD PROTECTION LAW — Law No. 54/2011 of 14/12/2011
-- ══════════════════════════════════════════════════════════
(
  'Child Protection Law - Rights of the Child and Parental Obligations',
  'child_rights',
  'Under Law No. 54/2011 relating to the rights and protection of the child in Rwanda: A child means every person below eighteen (18) years of age. Every child has the right to: life, name, nationality and identity; education; health care; protection from exploitation, abuse and neglect; play, leisure and participation in cultural activities; and express their views in matters affecting them, with those views given weight in accordance with their age and maturity. Parents and guardians have the primary obligation to ensure the welfare and best interests of the child. The best interests of the child are the paramount consideration in all decisions affecting children, whether by courts, administrative authorities, or private institutions. Parents may not deprive a child of education; failure to enrol a child in school is an offence. A child born out of wedlock has the same rights as a child born in wedlock. The State guarantees special protection to orphans, street children, children with disabilities, and children in armed conflict. Child labour that interferes with schooling, endangers health or development, or occurs in hazardous conditions is prohibited. Children under sixteen (16) years may not be employed in any formal employment.',
  2011,
  'Law No. 54/2011 of 14/12/2011 relating to the rights and protection of the child in Rwanda'
),
(
  'Child Protection Law - Child Abuse, Juvenile Justice and Adoption',
  'child_rights',
  'Under Law No. 54/2011: Physical, emotional, sexual abuse and neglect of a child are offences. Any person who knows or suspects child abuse must report it to the police, social welfare authorities or any public official. Failure to report known child abuse by a mandatory reporter is itself an offence. Sexual abuse of a child is punishable by imprisonment of fifteen (15) to twenty (20) years; aggravated sexual violence against a child carries life imprisonment. Physical abuse of a child causing serious harm is punishable by imprisonment of five (5) to ten (10) years. Child trafficking is punishable by imprisonment of fifteen (15) to twenty (20) years and a fine of RWF 10,000,000 to RWF 20,000,000. Juvenile justice: children in conflict with the law are handled by specialised child-friendly procedures; children below fourteen (14) years are not criminally responsible; children aged fourteen (14) to eighteen (18) are subject to reduced penalties and rehabilitation-focused sentences. Adoption of Rwandan children by Rwandan nationals or foreigners must be approved by the competent court after assessment by social welfare authorities. Intercountry adoption is permitted only as a last resort when no suitable family in Rwanda is available. The child must have been in foster care for at least six (6) months before adoption.',
  2011,
  'Law No. 54/2011 of 14/12/2011 relating to the rights and protection of the child in Rwanda'
),
(
  'Child Protection Law - Child Custody, Child Support and Street Children',
  'child_rights',
  'Under Law No. 54/2011: Both parents have equal rights and duties in respect of their children regardless of whether they are married. In case of separation, the court determines custody and access arrangements based on the best interests of the child. The non-custodial parent must pay child support in an amount determined by the court taking into account the financial capacity of both parents and the needs of the child. Failure to pay court-ordered child support is an offence punishable by imprisonment of one (1) to three (3) years. A parent who abducts a child in violation of a court custody order commits an offence. Social welfare centres must be established at district level to provide care and support to street children, orphans, children with disabilities and other vulnerable children. The Government provides a child development grant to the most vulnerable families with young children to support child nutrition and development. An unaccompanied or abandoned child must be placed in temporary care within forty-eight (48) hours of being found. All children in Rwanda regardless of citizenship status are entitled to free basic healthcare and access to primary education.',
  2011,
  'Law No. 54/2011 of 14/12/2011 relating to the rights and protection of the child in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- NATIONALITY LAW — Law No. 30/2008 of 25/07/2008 (as amended)
-- ══════════════════════════════════════════════════════════
(
  'Nationality Law - Acquisition, Dual Nationality and Naturalisation',
  'nationality',
  'Under Law No. 30/2008 relating to Rwandan nationality as amended: Rwandan nationality is acquired by birth, by descent, by marriage, or by naturalisation. A child acquires Rwandan nationality at birth if: at least one parent is a Rwandan national regardless of the place of birth; the child is born in Rwanda and both parents are unknown or stateless. Rwanda permits dual nationality — a Rwandan national who acquires a foreign nationality does not automatically lose Rwandan nationality. A foreign national may acquire Rwandan nationality by naturalisation if they: have been legally and continuously resident in Rwanda for at least five (5) years immediately preceding the application; are of good character and have no criminal convictions; are economically self-sufficient; have adequate knowledge of Kinyarwanda or another official language; and have formally renounced their previous nationality unless their country of origin permits dual nationality. A foreign spouse of a Rwandan national may apply for naturalisation after two (2) years of legal residence following the marriage. A person of Rwandan origin whose ancestors were Rwandan nationals may acquire nationality by declaration without the five-year residence requirement. Nationality certificates and passports are issued by the Directorate General of Immigration and Emigration.',
  2008,
  'Law No. 30/2008 of 25/07/2008 relating to Rwandan nationality, as amended'
),
(
  'Nationality Law - Loss of Nationality and Statelessness Prevention',
  'nationality',
  'Under Law No. 30/2008: A Rwandan national may lose nationality only by: voluntarily renouncing it in writing after acquiring a foreign nationality, where both nationalities are not permitted; or by a court judgment in cases of fraud in obtaining nationality, or where a naturalised citizen acts against national security within ten (10) years of naturalisation. A child who has Rwandan nationality cannot lose it before reaching the age of eighteen (18) years. Loss of nationality does not take effect if it would render the person stateless. A stateless person born in Rwanda or who has been resident in Rwanda for more than ten (10) years may apply for Rwandan nationality. Rwanda is a signatory to the 1954 Convention relating to the Status of Stateless Persons and the 1961 Convention on the Reduction of Statelessness. The Directorate General of Immigration decides on nationality applications; rejected applicants may appeal to the Minister within thirty (30) days and thereafter to the competent court. A person whose nationality is in doubt may apply to the competent authority for a determination of their nationality status.',
  2008,
  'Law No. 30/2008 of 25/07/2008 relating to Rwandan nationality, as amended'
),

-- ══════════════════════════════════════════════════════════
-- CIVIL SERVICE LAW — Law No. 86/2013 of 11/09/2013
-- ══════════════════════════════════════════════════════════
(
  'Civil Service Law - Recruitment, Probation and Employee Rights',
  'civil_service',
  'Under Law No. 86/2013 establishing the general statute for Rwanda public service: The public service is based on merit, transparency and equal opportunity. Recruitment to public service positions is through competitive examination or competitive selection based on qualifications and competence. All public service positions must be advertised publicly unless filled by internal competitive promotion. A newly recruited public servant serves a probation period of six (6) months, during which either party may terminate without notice. Upon successful completion of probation the officer is confirmed in post. Public servants are entitled to: a salary and allowances as set by the salary structure; annual leave of at least eighteen (18) working days per year; maternity leave of twelve (12) weeks and paternity leave of four (4) working days; sick leave with pay; training and career development opportunities; and protection from arbitrary dismissal. Public servants may not engage in any activity that creates a conflict of interest with their official duties without prior written authorisation. A public servant must declare any personal interest in a matter they are required to handle officially. The Rwanda Public Service Commission (RPSC) oversees public service recruitment, performance management and disciplinary standards.',
  2013,
  'Law No. 86/2013 of 11/09/2013 establishing the general statute for Rwanda public service'
),
(
  'Civil Service Law - Performance, Discipline and Termination',
  'civil_service',
  'Under Law No. 86/2013: Public servants are evaluated annually through a performance appraisal system. Performance ratings determine eligibility for promotion, bonuses and training opportunities. A public servant who receives a consistently poor performance rating may be terminated after being given an opportunity to improve. Disciplinary offences include: abandonment of post; repeated lateness or absenteeism; insubordination; disclosure of confidential information; corruption or fraud; and conduct unbecoming a public servant. Disciplinary procedures must be followed before any sanction is imposed: the officer must be notified in writing of the charges; given an opportunity to respond; and heard before a disciplinary committee. Disciplinary sanctions range in severity: warning; reprimand; suspension without pay for up to three (3) months; reduction in grade; and dismissal. Dismissal requires the most serious grounds including criminal conviction, fraud, or gross misconduct. A public servant dismissed has the right to appeal to the Public Service Commission within thirty (30) days and to court if still not satisfied. Public servants may not strike in essential services; trade union activity is regulated. Retirement age for public servants is sixty-five (65) years.',
  2013,
  'Law No. 86/2013 of 11/09/2013 establishing the general statute for Rwanda public service'
),

-- ══════════════════════════════════════════════════════════
-- SUCCESSION AND INHERITANCE — Law No. 32/2016 of 28/08/2016
-- (Part of Persons and Family Law — Articles on succession)
-- ══════════════════════════════════════════════════════════
(
  'Succession Law - Testate Succession and Wills',
  'succession',
  'Under Law No. 32/2016 governing persons and family in Rwanda, provisions on succession: A person may dispose of their property by will. A will must be in writing and signed by the testator or, if the testator cannot write, signed by a witness in their presence. A notarial will executed before a notary is the most secure form of will. A will may also be holographic — entirely handwritten, dated and signed by the testator. A testator may not disinherit their compulsory heirs (reserved heirs). The reserved portion of the estate that must pass to compulsory heirs is: one half (1/2) of the estate if the deceased leaves one child; two thirds (2/3) if there are two children; and three quarters (3/4) if there are three or more children. The surviving spouse is a compulsory heir entitled to a reserved portion of the matrimonial property. A testator may freely dispose of the portion of the estate that exceeds the reserved portion (the available quota). A will may be revoked at any time by the testator through a subsequent notarial act, a new will, or by physical destruction. A will becomes effective on the death of the testator. An executor named in a will is responsible for administering the estate in accordance with the testator wishes.',
  2016,
  'Law No. 32/2016 of 28/08/2016 governing persons and family in Rwanda — provisions on succession'
),
(
  'Succession Law - Intestate Succession and Heirs',
  'succession',
  'Under Law No. 32/2016 governing persons and family in Rwanda: Where a person dies without a valid will (intestate), the estate is distributed among legal heirs in the following order of priority: (1) the surviving spouse and descendants (children, grandchildren); (2) if no descendants, the surviving spouse and ascendants (parents); (3) if no spouse or ascendants, collateral relatives (siblings, nieces, nephews) up to the fourth degree. Children inherit equally regardless of gender and regardless of whether they were born in or out of wedlock. An adopted child has the same inheritance rights as a biological child. A surviving spouse inherits the matrimonial home and household contents in addition to their share of the estate to ensure they are not left homeless. If a person dies with no heirs, the estate passes to the State by bona vacantia (ownerless property). A spouse, child or other heir who caused the death of the deceased by homicide is excluded from inheriting. Inheritance rights must be claimed within five (5) years of the death of the deceased, failing which the right lapses. Estate administration including payment of debts, taxes and distribution to heirs is managed by the designated estate administrator or, if none, by the competent court.',
  2016,
  'Law No. 32/2016 of 28/08/2016 governing persons and family in Rwanda — provisions on intestate succession'
);
