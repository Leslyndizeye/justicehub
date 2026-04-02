-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Labour Law extended provisions, Occupational Safety Law,
--         Employment Agency Law, Social Protection Law,
--         Persons with Disabilities extended, Gender Law,
--         Land Reform extended, Customary Practices
-- Run this AFTER seed_ppp_sez_eac.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- LABOUR LAW — Extended provisions (Law No. 66/2018 of 30/08/2018)
-- ══════════════════════════════════════════════════════════
(
  'Labour Law - Working Hours, Overtime, Leave and Remuneration',
  'labour',
  'Under Law No. 66/2018 regulating labour in Rwanda: Normal working hours are eight (8) hours per day and forty-five (45) hours per week. Work performed beyond normal working hours constitutes overtime and must be remunerated at an increased rate: the first two hours of overtime on a working day at 130% of the normal hourly rate; subsequent overtime hours at 150%; overtime on rest days at 200%. Total working hours including overtime may not exceed twelve (12) hours in a day or sixty (60) hours in a week. Every employee is entitled to: one (1) rest day per week (Sunday by default unless otherwise agreed); eighteen (18) working days of paid annual leave per year after twelve months of continuous service; sick leave with full pay for the first three months and half pay for the next three months in any twelve-month period; maternity leave of twelve (12) weeks at full pay; paternity leave of four (4) working days at full pay. The minimum wage is set by Presidential Order and applies to all sectors. All wages must be paid in Rwandan Francs; payment in kind is permitted only for food and lodging and may not exceed twenty-five percent (25%) of the cash wage. Wage theft — an employer who fails to pay wages on the due date — commits an offence subject to administrative fines and the unpaid wages carry interest at the prescribed rate.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Termination of Employment, Severance and Unfair Dismissal',
  'labour',
  'Under Law No. 66/2018: An employment contract of indefinite duration may be terminated by either party by giving notice proportionate to the employee length of service: one (1) month notice for service of less than one (1) year; two (2) months notice for service of one (1) to five (5) years; three (3) months notice for service of more than five (5) years. Dismissal without notice is permitted only for gross misconduct including: theft; assault at the workplace; serious insubordination; sexual harassment; deliberate destruction of employer property; and intoxication at work. An employer who dismisses an employee must provide written reasons for the dismissal. An employee who is unfairly dismissed may file a complaint with the competent labour inspection officer or court within three (3) months of dismissal. Remedies for unfair dismissal include: reinstatement; or compensation equivalent to one (1) to six (6) months salary depending on length of service and seriousness of the violation. Severance pay is mandatory on termination of an indefinite contract by the employer for reasons other than gross misconduct: one month salary for each year of service, capped at six months. Redundancy (termination for economic reasons) requires prior consultation with worker representatives and notification to the labour inspection authority.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Workplace Safety, Occupational Health and Labour Inspection',
  'labour',
  'Under Law No. 66/2018 and occupational safety regulations: Every employer has the duty to provide a safe working environment including: safe premises and equipment; protective equipment appropriate to the nature of the work; training on workplace safety; and first aid facilities. Employers must conduct workplace risk assessments and implement measures to eliminate or reduce identified risks. Workplace accidents causing personal injury must be reported to the RSSB and the labour inspection within twenty-four (24) hours. An employee has the right to refuse to perform work that poses an imminent serious danger to their health or life without penalty. Specific regulations govern safety in: construction; mining; factories; chemical handling; and work at height. Child labour in hazardous conditions is prohibited under both the Labour Law and the Child Protection Law; children between fifteen (15) and eighteen (18) years may only perform light non-hazardous work during school holidays. The Labour Inspection Authority under the Ministry of Public Service and Labour conducts inspections of workplaces to verify compliance with labour law. Inspectors may: enter any workplace without prior notice; require production of employment records; interview workers in private; and issue compliance orders. An employer who obstructs a labour inspector commits an offence. Fines for labour law violations range from RWF 100,000 to RWF 5,000,000 per violation.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- GENDER AND FAMILY PROPERTY — Constitution and related laws
-- ══════════════════════════════════════════════════════════
(
  'Gender Law - Gender Equality, Women Rights and Matrimonial Property',
  'family',
  'Under the Constitution of Rwanda and related laws: Rwanda guarantees gender equality in all spheres of life. The Constitution reserves at least thirty percent (30%) of positions in all decision-making bodies for women; in practice Rwanda has consistently exceeded this minimum with women holding over fifty percent (50%) of Parliamentary seats — the highest proportion in the world. In matrimonial property, spouses have equal rights to property acquired during marriage regardless of which spouse earned the income. Neither spouse may sell, mortgage or otherwise dispose of the matrimonial home or other significant matrimonial property without the consent of the other spouse. Property owned by each spouse before marriage remains their separate property unless they agree to pool it. Upon divorce, matrimonial property (acquired during the marriage) is divided equally between the spouses unless the court finds that one spouse made no contribution. Inherited property and gifts received during marriage are treated as separate property of the recipient. A spouse who is not formally employed but contributes through homemaking, child care and other unpaid work is deemed to have contributed equally to the acquisition of matrimonial property. Rwanda prohibits marital property agreements that completely exclude one spouse from the matrimonial property acquired during the marriage.',
  2016,
  'Constitution of Rwanda 2003 (revised 2015) and Family Law No. 32/2016 provisions on matrimonial property and gender equality'
),

-- ══════════════════════════════════════════════════════════
-- SOCIAL PROTECTION — Vision 2020/2050 legal framework
-- ══════════════════════════════════════════════════════════
(
  'Social Protection Law - Ubudehe, VUP and Social Safety Nets',
  'social_security',
  'Under Rwanda social protection laws and policies: Rwanda implements a comprehensive social protection system targeting the most vulnerable citizens. Ubudehe is the national community categorisation system that classifies households by economic status from Category 1 (most vulnerable) to Category 5 (wealthy); the category determines eligibility for social protection benefits. The Vision Umurenge Programme (VUP) provides: direct support (cash transfers) to the most vulnerable households in Category 1; public works employment to Category 2 and 3 households; and financial services (small loans) to Category 3 and 4 households to support graduation out of poverty. The Community Based Health Insurance (Mutuelle de Sante) is subsidised by the Government for the poorest households; Category 1 households receive free health insurance. Primary and secondary school fees are waived for children from the poorest households under the Twelve-Year Basic Education programme. The Government provides free social housing (imidugudu) to homeless families and genocide survivors who lack shelter. Genocide survivors receive specific additional support including access to the Genocide Survivors Assistance Fund (FARG) for education, healthcare and housing. Social protection transfers are administered through the Irembo digital platform enabling direct payment to beneficiaries.',
  2013,
  'Rwanda Social Protection Law and Vision Umurenge Programme (VUP) regulatory framework'
),

-- ══════════════════════════════════════════════════════════
-- COMPETITION — Additional: Merger Control
-- ══════════════════════════════════════════════════════════
(
  'Competition Law - Merger Notification, Review and Remedies',
  'competition',
  'Under Law No. 11/2016 on competition and consumer protection: A merger or acquisition that meets prescribed thresholds must be notified to the Rwanda Development Board (RDB) before it is implemented. Notification thresholds are based on combined turnover of the merging parties or their market share in Rwanda. The notification must include: details of the parties; the structure of the proposed transaction; the rationale; and an assessment of competitive effects. The RDB reviews the notification and must decide within thirty (30) days of receiving a complete notification; the review period may be extended for complex cases. The RDB assesses whether the merger will substantially lessen competition by creating or strengthening a dominant position. The RDB may: approve the merger unconditionally; approve with behavioural conditions (e.g., supply obligations, price caps); approve with structural conditions (e.g., divestiture of assets or businesses); or block the merger. A merger implemented without notification or in violation of conditions is void. The RDB may fine parties for gun-jumping (implementing a merger before clearance) at up to ten percent (10%) of annual turnover. Third parties including competitors and customers may make representations to the RDB during a merger review. Mergers in the media sector are subject to additional review by RURA to prevent undue concentration of media ownership.',
  2016,
  'Law No. 11/2016 of 05/05/2016 on competition and consumer protection in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- LAND LAW — Additional provisions on mortgages and foreign ownership
-- ══════════════════════════════════════════════════════════
(
  'Land Law - Foreign Land Ownership, Concessions and Agricultural Restrictions',
  'land',
  'Under Law No. 43/2013 on land use and management in Rwanda: Foreign nationals and foreign-owned legal entities may hold land in Rwanda on leasehold terms only; they may not hold perpetual (unlimited) leases. The maximum leasehold period for foreigners is fifty (50) years, renewable. A foreign company that is partially owned by Rwandan nationals may access longer leasehold terms in proportion to the Rwandan ownership stake. Agricultural land may only be transferred to persons who will farm it productively; transfers to non-farmers must be approved by the district land authority. The fragmentation of agricultural land below the minimum plot size of one (1) hectare (in some areas two (2) hectares) is prohibited to prevent unviable subsistence plots. Land reserved for agricultural use in the land use master plan may not be converted to non-agricultural use without a formal land use change approval process. Land that has been idle and unproductive for more than two (2) years may be subject to a use notice from the district requiring the owner to put it into productive use; persistent non-compliance may lead to revocation of the lease. Rwandans in the diaspora may own and manage land in Rwanda subject to normal leasehold rules. Transactions involving more than five (5) hectares of agricultural land require approval from the Ministry responsible for agriculture to ensure food security objectives are not compromised.',
  2013,
  'Law No. 43/2013 of 16/06/2013 determining the use and management of land in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- FAMILY LAW — Additional: Divorce Grounds and Procedure
-- ══════════════════════════════════════════════════════════
(
  'Family Law - Grounds for Divorce, Procedure and Alimony',
  'family',
  'Under Law No. 32/2016 governing persons and family in Rwanda (as amended by Law No. 001/2020): Grounds for divorce include: mutual consent of spouses; irreconcilable differences making cohabitation impossible; adultery; physical or mental cruelty; willful desertion for more than one (1) year without valid reason; and imprisonment of one spouse for more than five (5) years. An application for divorce is filed before the court of the place of matrimonial domicile. The court must first attempt to reconcile the parties; if reconciliation fails, the court proceeds to hear the divorce case. A divorce judgment takes effect from the date it becomes final (after the appeal period expires). Alimony: the court may order one spouse to pay periodic financial support to the other spouse after divorce where that spouse cannot support themselves, taking into account: the duration of the marriage; the contribution of each spouse; the financial capacity of the paying spouse; and the needs of the receiving spouse. Alimony terminates if the receiving spouse remarries. Child support obligations continue after divorce until the child reaches the age of majority (eighteen years) or completes their education. Prenuptial agreements (marriage contracts) that have been duly notarised and registered are enforceable at divorce to determine how property is divided.',
  2020,
  'Law No. 32/2016 of 28/08/2016 governing persons and family, as amended by Law No. 001/2020'
),

-- ══════════════════════════════════════════════════════════
-- CONSTITUTIONAL LAW — Key principles and amendments
-- ══════════════════════════════════════════════════════════
(
  'Constitutional Law - Fundamental Rights, Constitutional Institutions and Judicial Review',
  'constitutional',
  'Under the Constitution of Rwanda 2003 as revised in 2015: The Constitution is the supreme law of Rwanda; any law or act inconsistent with it is void to the extent of the inconsistency. Fundamental rights guaranteed by the Constitution include: the right to life; freedom from torture and inhuman treatment; right to equality and non-discrimination; right to a fair trial; freedom of thought, conscience and religion; freedom of expression; freedom of association and assembly; right to property; right to education; right to health; and the right to a clean environment. Constitutional institutions include: the Presidency; Parliament (Chamber of Deputies and Senate); the Cabinet; the Supreme Court; the Constitutional Court (in the process of establishment); the Prosecutor General; the Auditor General; the Ombudsman; the National Electoral Commission; the National Human Rights Commission; the Gender Monitoring Office; and the National Commission for the Fight against Genocide (CNLG). Judicial review: any person may challenge the constitutionality of a law before the Supreme Court. The Supreme Court sits as the Constitutional Court until a separate Constitutional Court is established. A law declared unconstitutional is automatically repealed. Constitutional amendments require a two-thirds majority in each chamber of Parliament and approval by referendum if the amendment concerns fundamental rights, the republican form of government, or the unity of the Rwandan people.',
  2015,
  'Constitution of Rwanda 2003 as revised on 18/12/2015'
),

-- ══════════════════════════════════════════════════════════
-- PENAL CODE — Key general principles
-- ══════════════════════════════════════════════════════════
(
  'Penal Code - Criminal Liability, General Defences and Sentencing Principles',
  'criminal',
  'Under the Penal Code of Rwanda (Law No. 68/2018 of 30/08/2018): Criminal liability requires both a physical element (actus reus — the prohibited act or omission) and a mental element (mens rea — intent, recklessness or negligence as specified for each offence). A person who is mentally incapacitated at the time of the offence to such an extent that they cannot understand the wrongfulness of their act or control their behaviour is not criminally responsible but may be subject to compulsory treatment. Defences available under the Penal Code include: self-defence — a person may use proportionate force to defend themselves or another from an unjust attack; necessity — a person may commit a lesser harm to prevent a greater imminent harm that cannot otherwise be avoided; superior orders are not a complete defence but may mitigate penalty; and mistake of fact that negates the required mental element. Joint criminal enterprise: all persons who plan, order, incite, commit, or otherwise aid and abet an offence are equally guilty. Attempt to commit an offence is punishable at two thirds of the penalty for the completed offence. Sentencing principles: sentences must be proportionate to the seriousness of the offence and the culpability of the offender; the court must consider aggravating factors (premeditation, use of weapons, multiple victims, vulnerability of victim) and mitigating factors (first offence, remorse, cooperation with justice, restitution to the victim).',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code of Rwanda)'
);
