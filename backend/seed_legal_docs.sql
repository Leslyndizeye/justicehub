-- Run this in Supabase SQL Editor to seed the Rwanda legal documents database
-- SOURCE: Official PDFs — Constitution (2003 rev.2015), Land Law 27/2021,
--         Labour Law 66/2018, Company Law 007/2021, Penal Code 68/2018,
--         Data Protection Law 058/2021, Family Law

-- Clear existing data first
DELETE FROM legal_documents;

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- CONSTITUTION OF THE REPUBLIC OF RWANDA (2003 revised 2015)
-- ══════════════════════════════════════════════════════════
(
  'Constitution - Preamble and Foundational Principles',
  'constitution',
  'We, the People of Rwanda, committed to building a State governed by the rule of law, based on the respect for human rights, freedom and on the principle of equality of all Rwandans before the law as well as equality between men and women. Committed further to building a State based on consensual and pluralistic democracy founded on power sharing, national unity and reconciliation, good governance, development, social justice, tolerance and resolution of problems through dialogue. Committed to preventing and punishing the crime of genocide, fighting genocide negationism and revisionism, eradicating genocide ideology and all its manifestations, divisionism and discrimination based on ethnicity, region or any other ground.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to Life and Physical Integrity',
  'constitution',
  'Every person has an inherent right to life. No person shall be arbitrarily deprived of life. The death penalty is abolished. Every person has the right to physical and mental integrity. No person shall be subjected to torture, physical abuse, cruel, inhuman or degrading treatment or punishment. No person shall be subjected to medical or scientific experiments without his or her free and informed consent.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to Equality and Non-Discrimination',
  'constitution',
  'All persons are equal before the law. No person shall be discriminated against on grounds of ethnic origin, family or ancestry, clan, skin colour or race, sex, region, economic categories, religion or faith, opinion, culture, language, social status, physical or mental disability or any other form of discrimination. Any propaganda, law or practice which discriminates on the grounds of ethnicity, religion, race or sex is prohibited.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to Liberty and Security of Person',
  'constitution',
  'Every person has the right to liberty and security of person. No person shall be subjected to arbitrary arrest or detention. No person shall be deprived of his or her liberty except in circumstances and in accordance with procedures established by law. Any person who is arrested shall be informed at the time of arrest of the reasons for his or her arrest and shall be promptly informed of any charges against him or her. Any person arrested or detained shall be brought before a judicial officer without undue delay.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to a Fair Trial',
  'constitution',
  'Every person shall have the right to have his or her case heard by a competent, independent and impartial court or tribunal. Every person charged with a criminal offence shall have the right to be presumed innocent until proven guilty by a competent court or tribunal. No person shall be compelled to testify against himself or herself or to confess to a criminal offence. The right of defence is guaranteed in all courts and before all administrative authorities. A person has a right to be assisted by a lawyer of his or her choice.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to Property',
  'constitution',
  'Every person has the right to private property, whether personal or acquired in association with others. The right to property may not be interfered with except in cases of public utility or interest and only in circumstances and in accordance with procedures established by law, and subject to fair and prior compensation.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Freedom of Expression and Press',
  'constitution',
  'Freedom of thought, opinion, conscience, religion, expression and press is guaranteed by the State. Freedom of the press and freedom of information are recognised and guaranteed by the State. Freedom of expression and freedom of information shall not prejudice public order and good morals, the right of every citizen to honour and dignity and the security of the State. Conditions for exercising these freedoms are determined by law.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to Education',
  'constitution',
  'Every Rwandan has the right to education. Basic education is compulsory and free in public schools as provided for by law. The conditions for exercising this right are determined by law. Special provisions for persons with disabilities in education shall be determined by law.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to Work and Favourable Working Conditions',
  'constitution',
  'Every person has the right to work. Every person has the right to free choice of employment. Every person has the right to just, equitable and satisfactory conditions of work. Every person has the right to equal pay for equal work. Every person has the right to form trade unions and to join a trade union of his or her choice. Every worker has the right to rest and to enjoy paid leave.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to Health and Social Security',
  'constitution',
  'Every person has the right to the highest attainable standard of health. The State has the duty to mobilise resources and put in place facilities to ensure good health and access to medical care for all Rwandans. Every person has the right to social security. The conditions for the implementation of these rights are determined by law.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Right to Privacy',
  'constitution',
  'The privacy of any person, his or her family, home and correspondence shall not be interfered with. The inviolability of the home and the secrecy of correspondence and private communications shall be guaranteed. A search may only be carried out by virtue of a warrant issued by a competent judicial authority, except in cases of flagrante delicto.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Marriage and Family',
  'constitution',
  'The family is the natural foundation of Rwandan society. The State has the duty to protect the family. Marriage is only contracted between a man and a woman. No person may be married without his or her free and full consent. Spouses have equal rights and responsibilities at the time of marriage, during marriage and at dissolution of marriage. Parents have the right and duty to raise and care for their children. Children have the right to be protected by their family, society and the State.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Gender Equality',
  'constitution',
  'The State shall ensure equal rights for women and men and guarantee women equal rights with men in matters of civil, political, economic, social and cultural rights as established by this Constitution, other laws and international conventions ratified by Rwanda. The State shall take special measures to ensure the elimination of inequalities and discrimination against women. Women shall be granted at least thirty per cent of the posts in decision-making organs.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Rights of the Child',
  'constitution',
  'Every child has the right to life from the moment of conception. Every child has the right to a name and nationality from birth. Every child has the right to be protected from all forms of discrimination and violence. Child labour is prohibited. Every child has the right to special protection and care from the family, society and the State.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Judiciary Independence',
  'constitution',
  'The judiciary is independent and only subject to the Constitution and the law. Judges shall have no other masters than the law and their conscience. The judiciary shall not be subject to executive or legislative control. The judiciary has jurisdiction in all cases submitted to it. Any act by a public authority interfering with the course of justice is prohibited.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Hierarchy of Courts',
  'constitution',
  'The courts of Rwanda are: the Supreme Court; the High Court; the Intermediate Courts; the Primary Courts; Military courts. The Supreme Court is the highest court in Rwanda. The decisions of the Supreme Court are not subject to appeal. The Supreme Court shall be the final interpreter of the Constitution. Commercial courts and Gacaca courts may be established by law.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),
(
  'Constitution - Nationality',
  'constitution',
  'Rwandan nationality is acquired by birth or by naturalisation. Every person born of a Rwandan father or mother is Rwandan by birth. No Rwandan shall be deprived of his or her Rwandan nationality. A Rwandan may hold dual nationality. The conditions and modalities of acquiring, retaining, losing and renouncing Rwandan nationality are determined by law.',
  2015,
  'Constitution of the Republic of Rwanda of 2003 revised in 2015'
),

-- ══════════════════════════════════════════════════════════
-- LAND LAW — Law No. 27/2021 of 10/06/2021
-- ══════════════════════════════════════════════════════════
(
  'Land Law - Purpose and Land as Common Heritage',
  'land',
  'Law No. 27/2021 determines modalities of acquisition, registration, allocation, possession, transfer, management and use of land. Land is part of the common heritage of all Rwandans, the ancestors, present and future generations. Without prejudice to recognised rights of people, the State has absolute power to manage all lands situated in its national territorial boundaries which it exercises in the general interest. The State is the sole authority to grant rights of tenure and use of land.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Equal Right to Land and Non-Discrimination',
  'land',
  'Any form of discrimination in relation to access to land and enjoyment of real rights to land is prohibited. The land rights of spouses depend on the type of matrimonial regime of their choice. A Rwandan is entitled to freehold tenure. Private individual land subject to freehold cannot exceed two (2) hectares per person unless an Order of the Minister authorises otherwise.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Emphyteutic Lease and Freehold Tenure',
  'land',
  'A person who acquired land through inheritance, succession, purchase, donation, exchange, land sharing or legal grant by competent authorities, owns it in one of the following tenure modalities: (1) emphyteutic lease; (2) freehold. Lands are allocated by the State in form of emphyteutic lease and land concession. The emphyteutic lease and land concession period does not exceed ninety-nine (99) years which may be renewed. When the emphyteutic lease period expires, the lease period for a Rwandan is renewed automatically.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Foreigners Rights on Land',
  'land',
  'Without prejudice to other provisions, a foreigner has rights to: (1) an emphyteutic lease; (2) a land concession. The rights are only allocated for investment purposes. A Presidential Order may approve grant of a freehold title to a foreigner for exceptional circumstances of strategic national interest. Foreigners cannot hold freehold land as a general rule and may only lease land for investment.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Land Registration and Certificate',
  'land',
  'A person has an obligation to register his or her land property. The State has also an obligation to register its land property. A certificate of land registration is an original copy of the land register bearing a signature of the registrar of the land titles. It may be issued in an electronic or print format. The certificate of land registration constitutes conclusive evidence of the land related rights whenever their acquisition is lawful. The content of the land register and other deeds related to land rights approved by the registrar of land titles are authentic.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Transfer of Land Rights',
  'land',
  'Land rights may be transferred between persons through: succession, donation, inheritance, lease, sale, sub-lease, exchange, mortgage, concession, or any other transfer means in conformity with the law. A transfer of land rights, before it is carried out, requires consent of all persons registered on the land title. Transfer of land rights jointly held by spouses requires approval by both of them, even if one spouse is not registered on the land title. A transfer of land rights is valid only upon its registration in the land register.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Formation of Land Transfer Contract',
  'land',
  'The contract of land rights transfer done in writing is signed by transferee and transferor of land rights, approved and witnessed by the signature of the notary competent in land matters or any other notary recognised by the chief registrar of land titles. The transfer contract may be done electronically through digital signature of both parties granted by the competent organ. A transfer of land rights is valid only upon its registration in the land register.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - State Lands in Public Domain',
  'land',
  'State lands in public domain consist of all lands intended to be used by the general public or reserved for State services and national environmental protection. These include: lands occupied by lakes or rivers; lands on the banks of lakes or rivers; national forests, national parks, protected swamps; national roads and their boundaries; lands reserved for public State activities; lands reserved for public cemeteries; lands on which memorial sites of the genocide against the Tutsi are built. Lands in public domain of the State are inalienable except for lands on which memorial sites of the genocide against the Tutsi are built which cannot be transferred at all.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Expropriation for Public Interest',
  'land',
  'The State has power to expropriate a person from his or her property due to public interest upon prior payment of fair compensation. The State grants the right to free ownership of land and protects the land rights holder from being dispossessed of the land whether totally or partially, except in case of expropriation in the public interest in accordance with relevant laws. In case activities under or above the land cause any loss to the holder of land rights, he or she is given fair compensation.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Prescription of Land Rights',
  'land',
  'A person who owns land continuously and uninterruptedly, publicly and unequivocally for thirty (30) years from the date of acquisition of the land, may acquire the land rights by prescription. However, the sub-lease beneficiary cannot acquire rights from prescription. There is no prescription of land right among members of the same family. A person who, through fraudulent means, acquired vacant, escheat or any other person land, cannot invoke prescription even if he or she has possessed the land for a period longer than thirty years.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Obligations of Land Rights Holder',
  'land',
  'A holder of land rights has obligations of protection, conservation and exploitation of land in accordance with its intended use. A holder of land rights has an obligation to exploit the land by increasing its value and in a productive way in accordance with its nature and intended use. A holder of land rights has the obligation to pay land tax and fees in accordance with relevant laws. A holder of land rights must not obstruct underground activities or those in the space above his or her land when the activities are of public interest and are done in accordance with relevant laws.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Termination of Land Ownership Contract',
  'land',
  'The State may, after issuing to the land owner a written notice of ninety (90) days, terminate the land ownership contract if the lessee has not complied with the land ownership contract obligations. However, the State cannot terminate the land ownership contract if the land owner has presented reasonable grounds for non-compliance. An Order of the Minister determines modalities for terminating a land ownership contract.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Land Use Planning and Master Plan',
  'land',
  'The use of land is guided by the land use master plan of the area where the land is located. The fundamental principles governing use of land include: sustainable development for current and future generations; gender considerations; minimising excessive use of land, energy and natural resources; prioritising higher population density in urban and rural areas; preventing urban sprawl; maximising mixed zoning and integrated land uses. A permit related to land use is granted in accordance with the land use and development master plan. Any permit granted in contradiction with the master plan is null and void.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Offenses and Penalties',
  'land',
  'The following are criminal offences under Land Law No. 27/2021: (1) Using a land title for unlawful purposes — imprisonment of 5 to 7 years and a fine of 2 to 4 times the value of the land; (2) Providing false information for land allocation — imprisonment of 1 to 3 months and a fine of FRW 200,000 to FRW 500,000; (3) Obstructing public underground or space activities — imprisonment of 1 to 3 months and a fine of FRW 100,000 to FRW 300,000; (4) Self-allocation of State land rights — imprisonment of 3 to 6 months and a fine of 3 to 5 times the value of the land. Fines are multiplied by ten (10) for offences committed by legal entities.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Administrative Fines',
  'land',
  'Administrative fines under Land Law No. 27/2021: Non-compliance with the land use and development master plan attracts an administrative fine of not less than one million Rwandan francs (FRW 1,000,000) but not more than three million Rwandan francs (FRW 3,000,000). Infringement of regulations on land titles and registry maintenance by registrars attracts a fine of FRW 500,000 to FRW 1,000,000. The institution in charge of land use and management, the City of Kigali and Districts have powers to impose administrative fines. Administrative fines are deposited in the public treasury.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),
(
  'Land Law - Dispute Resolution on Land Boundaries',
  'land',
  'A person who claims for cancellation of a decision on disputes related to systematic land registration and land boundaries submits the claim to the District with legal personality or the City of Kigali where the land is located. The District takes a decision within thirty (30) days. If not satisfied or if no decision is given, the person may appeal to the institution in charge of land management and use within thirty (30) days. That institution issues its decision within forty-five (45) days. Its decision is final for administrative review. If not appealed to court within thirty (30) days of notification, the decision bears an enforcement order.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- LABOUR LAW — Law No. 66/2018 of 30/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Labour Law - Scope and Application',
  'employment',
  'Law No. 66/2018 regulating labour in Rwanda applies to: (1) employment relations based on an employment contract in the private sector; (2) employment relations in the public service unless otherwise provided by public service statutes; (3) apprentices and interns; (4) self-employed persons regarding occupational health and safety; (5) informal sector employees regarding health and safety, right to form trade unions, right to salary, minimum wage, right to leave, social security, protection against workplace discrimination, protection from forced labour, and prohibited forms of work for children.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Prohibition of Forced Labour and Discrimination',
  'employment',
  'Forced labour is prohibited in Rwanda. Forced labour means any work or service which is exacted from any person under threat of punishment and for which the person has not offered himself or herself voluntarily. Discrimination in employment is prohibited. No employer shall discriminate against an employee or job applicant on grounds of race, ethnicity, tribe, clan, colour, sex, pregnancy, marital status, family responsibilities, disability, religion, opinion, social origin, or any other form of discrimination.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Employment Contract Requirements',
  'employment',
  'An employment contract is an agreement between an employer and an employee by which one person undertakes to provide services to another under conditions of subordination, in exchange for remuneration. An employment contract may be for a definite period or an indefinite period. An employment contract must be written when it is for a period exceeding three (3) months. The contract must specify: identity of parties, nature of work, place of work, duration where applicable, remuneration, working hours, and notice period. Verbal employment contracts for less than three months are recognised.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Probationary Period',
  'employment',
  'An employment contract may contain a probationary clause. The probationary period may not exceed three (3) months for workers and six (6) months for management staff. The probationary period must be expressly stated in writing. During the probationary period, either party may terminate the contract without notice and without compensation, unless otherwise agreed. The probationary period may not be renewed except by a new contract for a new position.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Working Hours and Overtime',
  'employment',
  'The normal working hours shall not exceed forty-five (45) hours per week. The Minister determines, by Order, how working hours are distributed throughout the week. Work performed beyond the normal working hours constitutes overtime. Overtime must be compensated at a rate higher than the normal rate as determined by an Order of the Minister. Certain categories of workers may have different working hours determined by a Prime Minister Order. Night work and work on public holidays may be subject to additional compensation as provided by ministerial order.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Annual Leave',
  'employment',
  'Every employee is entitled to paid annual leave. The minimum duration of annual leave is eighteen (18) working days per year for an employee who has worked for at least twelve (12) consecutive months with the same employer. An employee who has not completed twelve months of service is entitled to leave proportional to the period of service. Leave may be taken at a time agreed upon between employer and employee. An employer may not replace annual leave with a cash payment except upon termination of the employment contract.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Maternity and Paternity Leave',
  'employment',
  'A female employee is entitled to maternity leave of twelve (12) weeks, of which at least six (6) weeks shall be taken after delivery. During maternity leave, the employee is entitled to full pay. An employer is prohibited from terminating the employment of a female employee on grounds of pregnancy, maternity leave or nursing. A male employee is entitled to paternity leave of four (4) working days following the birth of his child, with full pay.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Remuneration and Minimum Wage',
  'employment',
  'Every employee has the right to receive remuneration for work performed. Salary must be paid at regular intervals not exceeding one month. Deductions from salary may only be made with the written consent of the employee or as required by law such as tax and social security contributions. The Minister may, by Order, fix minimum wages for specific categories of employment. An employer shall not pay a salary below the minimum wage fixed for a given category. Equal pay for equal work of equal value is required regardless of sex.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Termination of Employment by Employer',
  'employment',
  'An employer may terminate an employment contract of indefinite duration only for valid reasons related to: the employee conduct (serious or repeated misconduct), capacity (inability to perform), or the operational requirements of the business (redundancy or economic reasons). Prior to termination, the employer must give the employee an opportunity to be heard. The required notice period depends on length of service. Termination without valid reason entitles the employee to severance pay. The employer must give the reason for termination in writing.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Notice Period for Termination',
  'employment',
  'The notice period for termination of an employment contract depends on the length of service and shall not be less than: (1) one month for an employee with less than one year of service; (2) two months for an employee with one to five years of service; (3) three months for an employee with more than five years of service. An employer who terminates an employment contract without observing the notice period shall pay the employee a sum equal to the salary the employee would have earned during the notice period.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Serious Misconduct and Summary Dismissal',
  'employment',
  'An employer may terminate an employment contract without notice or compensation in the case of serious misconduct by the employee. Serious misconduct includes: acts of violence, theft or fraud in the workplace, serious breach of professional obligations, deliberate damage to employer property, serious insubordination, sexual harassment, and any other act that makes it impossible to continue the employment relationship. The employer must inform the employee of the grounds for dismissal in writing.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Severance Pay',
  'employment',
  'An employee whose employment is terminated by the employer without valid reason is entitled to severance pay. An employee who resigns is not entitled to severance pay unless the resignation is due to the employer serious breach of obligations. Severance pay is calculated based on the employee length of service and average monthly salary. The Minister determines by Order the modalities of calculating severance pay. In cases of redundancy, the employer must select employees for dismissal based on objective criteria and consult with employee representatives.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Workplace Health and Safety',
  'employment',
  'Every employer has the obligation to ensure the safety and health of employees at the workplace. The employer must identify, assess and eliminate or minimise risks in the workplace. The employer must provide appropriate personal protective equipment free of charge. The employer must train employees on health and safety procedures. An employee has the right to remove himself or herself from a work situation which presents an imminent and serious danger to his or her life or health, without suffering any adverse consequences. The employer is liable to compensate an employee for injuries sustained in the course of employment.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Trade Unions and Collective Bargaining',
  'employment',
  'Every employee has the right to form or join a trade union of his or her choice. No person may be compelled to join or not to join a trade union. Employers shall not discriminate against employees on the basis of trade union membership. Trade unions have the right to represent their members in collective bargaining with employers. Collective agreements negotiated between employers and trade unions are binding on both parties. The right to strike is recognised subject to the conditions established by law.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Child Labour Prohibition',
  'employment',
  'The minimum age for admission to employment or work is sixteen (16) years. No child under the age of sixteen (16) shall be engaged in any form of employment or work. Light work that does not affect the health or development of a child and does not interfere with school attendance may be permitted for children from the age of thirteen (13) years. Hazardous work is prohibited for persons under the age of eighteen (18) years. Employers found employing children below the minimum age are subject to criminal penalties.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Labour Inspectorate and Dispute Resolution',
  'employment',
  'The Labour Inspectorate is responsible for monitoring compliance with labour law. Labour inspectors have the right to enter workplaces, examine records and interview employees. An employer who obstructs a labour inspector commits an offence. Labour disputes shall first be submitted to the Labour Inspectorate for conciliation. If conciliation fails, the dispute may be referred to the competent court. An employee who believes they have been unfairly dismissed may contest the dismissal before the Labour Inspectorate and subsequently before court.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),
(
  'Labour Law - Social Security Contributions',
  'employment',
  'Both employer and employee are required to make social security contributions in accordance with relevant laws governing social security in Rwanda. Social security contributions cover benefits including retirement pension, invalidity pension, survivors pension, and occupational injuries and diseases. Deductions from salary for social security are made by the employer and remitted to the competent social security authority. Employers who fail to remit social security contributions are subject to penalties under the relevant law.',
  2018,
  'Law No. 66/2018 of 30/08/2018 regulating labour in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- PENAL CODE — Law No. 68/2018 of 30/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Penal Code - Classification of Offences',
  'criminal',
  'Under Law No. 68/2018, offences are classified by gravity: (1) Felony — punishable by imprisonment for more than five (5) years or life imprisonment; (2) Misdemeanour — punishable by imprisonment of not less than six (6) months and not more than five (5) years; (3) Petty offence — punishable only by imprisonment of less than six (6) months, a fine or community service. Fixed-term imprisonment is imposed for at least one day and at most twenty-five (25) years. No punishment without law: no one can be held guilty of an act that did not constitute an offence under national or international law at the time it was committed.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Murder and Homicide (Articles 107 and 111)',
  'criminal',
  'Under Article 107 of Law No. 68/2018: A person who intentionally kills another person commits murder. Upon conviction, he or she is liable to life imprisonment. Under Article 111: Any person who kills another as a result of clumsiness, carelessness, inattention or negligence but without intent to kill commits manslaughter. Upon conviction, the penalty is imprisonment of not less than six (6) months and not more than two (2) years and a fine of not less than FRW 500,000 and not more than FRW 2,000,000, or only one of these penalties.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Torture (Articles 112 and 113)',
  'criminal',
  'Under Articles 112 and 113 of Law No. 68/2018: Torture means any act by which severe pain or suffering, whether physical or mental, is intentionally inflicted on a person for purposes such as obtaining information, a confession, punishing, intimidating or coercing. Any person convicted of torture is liable to imprisonment of not less than twenty (20) years and not more than twenty-five (25) years. The crime of torture is imprescriptible. If torture results in an incurable illness, permanent incapacity, mutilation of a key body organ, death, or is committed by a public official in the exercise of duties, the penalty is life imprisonment.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Rape and Child Defilement (Articles 133 and 134)',
  'criminal',
  'Under Article 134 of Law No. 68/2018: Rape is committed when a person causes another to perform sexual acts without consent by use of force, threats, trickery or by use of authority. Upon conviction, the penalty is imprisonment of not less than ten (10) years but not more than fifteen (15) years and a fine of FRW 1,000,000 to FRW 2,000,000. The penalty is life imprisonment if rape was committed by more than one person, resulted in death of the victim, or was committed on a relative up to the second level. Under Article 133: Child defilement of a child under fourteen (14) years is punishable by life imprisonment that cannot be mitigated by any circumstances.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Domestic Violence and Sexual Violence Against Spouse (Articles 137 and 147)',
  'criminal',
  'Under Article 137 of Law No. 68/2018: A person who commits physical and sexual violence on his or her spouse commits an offence. Upon conviction, he or she is liable to imprisonment of not less than three (3) years but not more than five (5) years. Under Article 147: Any person who harasses a spouse with the intention of preventing him or her from living a peaceful life commits an offence, liable to imprisonment of not less than one (1) year and not more than two (2) years and a fine of FRW 200,000 to FRW 300,000. Victims of domestic violence may seek a protection order from the court.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Theft and Robbery (Articles 166 to 170)',
  'criminal',
  'Under Articles 166 to 170 of Law No. 68/2018: Simple theft is punishable by imprisonment of not less than one (1) year and not more than two (2) years and a fine of FRW 1,000,000 to FRW 2,000,000. The penalty doubles for aggravated theft (by burglary, at night, by civil servant, by more than one person). Theft with violence or threats is punishable by imprisonment of not less than five (5) years and not more than seven (7) years. If violence results in death, the penalty is imprisonment of not less than twenty (20) years and not more than twenty-five (25) years. Armed robbery is punishable by imprisonment of not less than ten (10) years and not more than fifteen (15) years; life imprisonment if it causes death or is committed by an organised gang.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Fraud, Extortion and Breach of Trust (Articles 171, 174 and 176)',
  'criminal',
  'Under Article 174 of Law No. 68/2018: Fraud — obtaining property by deception, false names or qualifications — is punishable by imprisonment of not less than two (2) years and not more than three (3) years and a fine of FRW 3,000,000 to FRW 5,000,000. Under Article 176: Breach of trust — misappropriating an item entrusted — is punishable by imprisonment of not less than three (3) years and not more than five (5) years and a fine of FRW 500,000 to FRW 1,000,000. Under Article 171: Extortion by violence or coercion is punishable by imprisonment of not less than three (3) years and not more than five (5) years and a fine of FRW 3,000,000 to FRW 5,000,000.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Forgery and False Documents (Article 276)',
  'criminal',
  'Under Article 276 of Law No. 68/2018: Any person who forges or alters documents by forged signature or fingerprint, falsifying documents or signatures, or impersonation commits an offence. Upon conviction, the penalty is imprisonment of not less than five (5) years but not more than seven (7) years and a fine of FRW 3,000,000 to FRW 5,000,000. If forgery is committed by a public servant or person in charge of public service, the penalty is imprisonment of not less than seven (7) years and not more than ten (10) years and a fine of FRW 2,000,000 to FRW 3,000,000.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Privacy and Unlawful Interception (Articles 155 to 160)',
  'criminal',
  'Under Articles 155 to 160 of Law No. 68/2018: Violation of domicile (unlawful entry) is punishable by imprisonment of two (2) to six (6) months and a fine. Secretly listening to, recording, or disclosing private conversations without authorisation is punishable by imprisonment of not less than six (6) months and not more than one (1) year and a fine of FRW 1,000,000 to FRW 2,000,000. Recording, intercepting or disclosing telecommunications without authorisation is punishable by imprisonment of not less than one (1) year and not more than two (2) years and a fine of FRW 1,000,000 to FRW 3,000,000. Collection of personal information in computers in bad faith is punishable by imprisonment of six (6) months to one (1) year and a fine of FRW 1,000,000 to FRW 2,000,000.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - False Testimony and Obstruction of Justice (Articles 243 to 255)',
  'criminal',
  'Under Article 255 of Law No. 68/2018: Any person who deliberately gives false testimony before judicial organs commits an offence. Upon conviction, the penalty is imprisonment of not less than one (1) year and not more than three (3) years and a fine of FRW 500,000 to FRW 1,000,000. Under Article 244: Any person who fails to assist a person in danger while in a position to do so commits an offence, punishable by imprisonment of not less than one (1) year and not more than three (3) years. Under Article 243: Failure to report a known felony or misdemeanour is punishable by imprisonment of six (6) months to one (1) year.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),
(
  'Penal Code - Bigamy and Desertion of Marital Home (Articles 139 and 141)',
  'criminal',
  'Under Article 141 of Law No. 68/2018: Any person who enters into a marriage contract while the previous one is still valid commits bigamy. Upon conviction, the penalty is imprisonment of not less than one (1) year and not more than two (2) years and a fine of FRW 300,000 to FRW 500,000. Under Article 139: A spouse who, without serious reasons, deserts the marital home for more than two (2) months and evades obligations commits an offence, punishable by imprisonment of not less than three (3) months and not more than six (6) months.',
  2018,
  'Law No. 68/2018 of 30/08/2018 determining offences and penalties in general (Penal Code)'
),

-- ══════════════════════════════════════════════════════════
-- COMPANY LAW — Law No. 007/2021 of 05/02/2021
-- ══════════════════════════════════════════════════════════
(
  'Company Law - Incorporation Requirements',
  'company',
  'Under Law No. 007/2021, a company is incorporated if it fulfils the following essential requirements: (1) having a name; (2) having one or more shareholders; (3) in the case of a company limited by shares, having one or more shares; (4) having one or more directors, at least one of whom must be ordinarily resident in Rwanda. A company incorporated under this Law has its own legal personality separate from that of its shareholders. Registration of a company with the Registrar General is compulsory. The Registrar General issues a certificate of incorporation stating the company registered name, registered code, type, and date of incorporation.',
  2021,
  'Law No. 007/2021 of 05/02/2021 governing companies in Rwanda'
),
(
  'Company Law - Types of Companies',
  'company',
  'Under Law No. 007/2021, companies are grouped into the following types: (1) a company limited by shares; (2) a company limited by guarantee; (3) a company limited by shares and by guarantee; (4) an unlimited company; (5) a protected cell company. Companies fall into two categories: private company and public company. A private company must end its name with "Private limited company" or "Ltd". A public company must end its name with "Public limited company" or "Plc". A private company restricts the right to transfer its shares, limits shareholders to one hundred (100), and prohibits public invitation to subscribe for shares.',
  2021,
  'Law No. 007/2021 of 05/02/2021 governing companies in Rwanda'
),
(
  'Company Law - Directors Duties and Liability',
  'company',
  'Under Law No. 007/2021, directors of a company in Rwanda have duties including: avoiding conflicts of interest; acting with due care, skill and diligence; not misusing company assets or confidential information; disclosing interests in transactions. A company or guarantor of an obligation of a company cannot assert against a person dealing with the company that the articles of association have not been complied with or that a named director is not duly appointed. Directors may be held personally liable for losses caused by breach of their duties.',
  2021,
  'Law No. 007/2021 of 05/02/2021 governing companies in Rwanda'
),
(
  'Company Law - Company Name and Registration',
  'company',
  'Under Law No. 007/2021: Every company must have its full name clearly stated in a conspicuous position outside its registered office. The Registrar General will not reserve or register a name that would contravene any law, is misleading, goes against good morals, or is identical or nearly identical to an existing company name. An application for company name reservation is valid for three (3) months renewable only once. A company must have a registered office in Rwanda at all times. All communications, notices and service of legal proceedings on the company may be addressed to the registered office.',
  2021,
  'Law No. 007/2021 of 05/02/2021 governing companies in Rwanda'
),
(
  'Company Law - Shares and Shareholders Rights',
  'company',
  'Under Law No. 007/2021: Shares in a company are personal property and are not in the nature of immovable property. Different classes of shares may be issued including ordinary, redeemable, preferential, and shares with special or limited voting rights. Shareholders of a private company have pre-emption rights to acquire newly-issued shares pro rata to existing holdings. A company cannot allot a share to any person if the allotment imposes new liability on that person unless that person consents in writing. Shares may be paid for in cash, promissory notes, contracts for future services, or moveable or immoveable property.',
  2021,
  'Law No. 007/2021 of 05/02/2021 governing companies in Rwanda'
),
(
  'Company Law - Dissolution and Liquidation',
  'company',
  'Under Law No. 007/2021: A company in Rwanda may be dissolved voluntarily by shareholders resolution or involuntarily by court order. Grounds for court-ordered dissolution include insolvency, failure to commence operations, deadlock among shareholders, and persistent violation of the law. Upon dissolution, a liquidator is appointed to wind up the affairs of the company, realise its assets, pay its creditors, and distribute any remaining assets to shareholders. The company ceases to exist upon completion of liquidation and removal from the register of companies.',
  2021,
  'Law No. 007/2021 of 05/02/2021 governing companies in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- DATA PROTECTION — Law No. 058/2021 of 13/10/2021
-- ══════════════════════════════════════════════════════════
(
  'Data Protection - Purpose, Scope and Definitions',
  'data_protection',
  'Law No. 058/2021 aims at the protection of personal data and privacy and determines their processing. The Law applies to: processing of personal data by electronic or non-electronic means using automated or non-automated platforms; data controllers, processors, or third parties established or residing in Rwanda; those not established in Rwanda but processing personal data of data subjects located within Rwanda. Personal data means any information relating to an identified or identifiable natural person. Sensitive personal data means information revealing a person race, health status, criminal records, medical records, social origin, religious or philosophical beliefs, political opinion, genetic or biometric information, sexual life or family details.',
  2021,
  'Law No. 058/2021 of 13/10/2021 on the protection of personal data and privacy in Rwanda'
),
(
  'Data Protection - Rights of Data Subjects',
  'data_protection',
  'Under Law No. 058/2021, every person has the right to privacy and protection of their personal data. Data subjects have the following rights: (1) right to be informed about processing of their personal data; (2) right of access to personal data held about them; (3) right to rectification of inaccurate or incomplete data; (4) right to erasure of data where there is no lawful basis for continued processing; (5) right to object to processing; (6) right to data portability. Personal data may only be collected and processed with the consent of the data subject or on another lawful basis provided by law.',
  2021,
  'Law No. 058/2021 of 13/10/2021 on the protection of personal data and privacy in Rwanda'
),
(
  'Data Protection - Obligations of Data Controllers',
  'data_protection',
  'Under Law No. 058/2021, organisations that collect and process personal data in Rwanda are classified as data controllers and must register with the Rwanda Utilities Regulatory Authority (RURA). Data controllers must: process data lawfully, fairly and transparently; collect data for specified, explicit and legitimate purposes only; not process data incompatible with those purposes; ensure data accuracy; not keep data longer than necessary; implement appropriate security measures. Cross-border transfers of personal data are regulated and may require approval from RURA. Data controllers must notify RURA and affected data subjects of any personal data breach without undue delay.',
  2021,
  'Law No. 058/2021 of 13/10/2021 on the protection of personal data and privacy in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- FAMILY LAW
-- ══════════════════════════════════════════════════════════
(
  'Family Law - Marriage Requirements and Civil Registration',
  'family',
  'For a marriage to be legally valid in Rwanda, both parties must be at least twenty-one (21) years of age. Marriage requires the free and full consent of both parties. The marriage must be celebrated before a civil registrar. Religious and customary ceremonies do not by themselves constitute a legally recognised marriage under Rwandan law. The marriage must be registered in the civil registry to be legally valid. Bigamy is prohibited. A person who is already married cannot contract another marriage.',
  2016,
  'Law governing persons and family in Rwanda'
),
(
  'Family Law - Matrimonial Property Regimes',
  'family',
  'Rwandan law provides for different matrimonial property regimes. Spouses may choose between: (1) community of property — all assets acquired during the marriage are jointly owned; (2) separation of property — each spouse retains individual ownership of their assets; (3) limited community of property. In the absence of a specific matrimonial agreement, the default regime is community of property. The matrimonial regime must be declared at the time of marriage registration. A change of matrimonial regime requires court authorisation.',
  2016,
  'Law governing persons and family in Rwanda'
),
(
  'Family Law - Divorce Grounds and Procedure',
  'family',
  'Divorce may be granted in Rwanda on grounds including: mutual consent of both spouses, irretrievable breakdown of the marriage, adultery, cruelty or domestic violence, prolonged separation, and abandonment. Divorce proceedings are conducted before the competent court. The court considers the welfare of any children of the marriage when making orders. Divorce by mutual consent requires that both parties appear before the court. A divorce decree is final only when pronounced by the court.',
  2016,
  'Law governing persons and family in Rwanda'
),
(
  'Family Law - Child Custody and Best Interests of the Child',
  'family',
  'In matters of child custody following separation or divorce, the paramount consideration is the best interests of the child. The court may award custody to either parent or both parents jointly. The non-custodial parent retains the right to maintain contact with the child unless the court determines contact is contrary to the child interests. Child support is determined based on the financial capacity of the parents and the needs of the child. Court orders on custody and support may be varied upon material change in circumstances.',
  2016,
  'Law governing persons and family in Rwanda'
),
(
  'Family Law - Inheritance and Equal Rights',
  'family',
  'Under Rwandan law, children have equal inheritance rights regardless of gender. A surviving spouse has the right to inherit from the deceased spouse. Inheritance occurs through a valid written will or through the rules of intestate succession. Rwandan law abolished discrimination in inheritance based on sex, ensuring daughters and sons have equal rights to family property. A will must comply with legal formalities to be valid. In the absence of a valid will, the estate is distributed according to the order of succession established by law.',
  2016,
  'Law governing persons and family in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CIVIL PROCEDURE AND COURT SYSTEM
-- ══════════════════════════════════════════════════════════
(
  'Civil Procedure - Filing a Civil Claim',
  'civil_procedure',
  'A civil claim in Rwanda is initiated by filing a written plaint with the competent court. The plaint must include: the identity of the parties; a statement of facts; the legal basis of the claim; and the relief sought. The claimant must pay the prescribed court fees at the time of filing. The defendant is then served with summons and given an opportunity to file a defence. Proceedings may also be initiated through the Integrated Electronic Case Management System (IECMS).',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Jurisdiction of Courts',
  'civil_procedure',
  'Rwanda has a hierarchy of courts: (1) Primary Courts — handle minor civil and criminal matters; (2) Intermediate Courts — handle more serious matters and appeals from Primary Courts; (3) High Court — handles serious cases and appeals from Intermediate Courts; (4) Supreme Court — the highest court, handles constitutional matters and final appeals. The Commercial High Court handles commercial disputes. Military courts handle matters involving military personnel. The Supreme Court decisions are not subject to appeal.',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'Civil Procedure - Alternative Dispute Resolution and Abunzi',
  'civil_procedure',
  'Rwanda encourages alternative dispute resolution including mediation, arbitration, and Abunzi (community mediators). Abunzi committees operate at the cell and sector level and handle certain civil and family disputes before they proceed to court. Use of Abunzi is mandatory for certain categories of disputes before approaching the courts. Arbitration is commonly used in commercial disputes and is governed by the law on arbitration. Mediation may be conducted at any stage of proceedings with the consent of both parties.',
  2018,
  'Law No. 22/2018 of 29/04/2018 relating to civil, commercial, labour and administrative procedure in Rwanda'
),
(
  'IECMS - Electronic Court Filing System',
  'civil_procedure',
  'The Integrated Electronic Case Management System (IECMS) allows lawyers and parties to file court documents electronically, track case progress, and receive notifications. All registered advocates in Rwanda are required to use IECMS. Self-represented litigants may also use the system. Documents filed through IECMS have the same legal validity as paper filings. Access is available through the Rwanda judiciary portal. The system covers all courts in Rwanda.',
  2019,
  'Rwanda Judiciary - IECMS Guidelines'
),

-- ══════════════════════════════════════════════════════════
-- TENANCY
-- ══════════════════════════════════════════════════════════
(
  'Tenancy Law - Rights and Obligations of Landlord and Tenant',
  'tenancy',
  'A lease agreement creates rights and obligations for both landlord and tenant. The landlord is obliged to: provide the property in a habitable condition; maintain the structure; ensure the tenant has peaceful enjoyment. The tenant is obliged to: pay rent on time; use the property for its intended purpose; maintain the property in good condition; not sublet without landlord consent unless permitted by the lease. Either party may terminate the lease in accordance with its terms and applicable law.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda and related tenancy provisions'
),
(
  'Tenancy Law - Eviction Procedures',
  'tenancy',
  'A landlord cannot evict a tenant without following lawful procedure. The landlord must give written notice of termination in accordance with the lease terms and the law. If the tenant refuses to vacate, the landlord must seek a court order for eviction. Self-help evictions including changing locks, removing belongings, or cutting utilities without a court order are unlawful and may expose the landlord to liability. A tenant facing unlawful eviction may apply to the court for an urgent order.',
  2021,
  'Law No. 27/2021 of 10/06/2021 governing land in Rwanda and related tenancy provisions'
),

-- ══════════════════════════════════════════════════════════
-- ACCESS TO JUSTICE AND LEGAL AID
-- ══════════════════════════════════════════════════════════
(
  'Legal Aid - Access to Legal Representation',
  'access_to_justice',
  'Rwanda provides legal aid to persons who cannot afford legal representation. The Rwanda Bar Association coordinates legal aid services through its legal aid clinics. Legal aid may be available for criminal matters, civil matters involving fundamental rights, and cases involving vulnerable persons including children and persons with disabilities. Citizens can approach the Rwanda Bar Association, legal aid clinics, or the Rwanda Legal Aid Forum for assistance. Legal aid services are available in all Districts.',
  2023,
  'Rwanda Legal Aid Policy and Rwanda Bar Association guidelines'
),
(
  'Rwanda Bar Association - Advocate Registration',
  'access_to_justice',
  'Legal practitioners in Rwanda must be registered with the Rwanda Bar Association to practice law. To be admitted as an advocate, a person must: hold a recognised law degree; complete the required practical training; pass the bar examination; and be admitted to the roll of advocates by the Bar Association. Practising law without registration as an advocate is a criminal offence. The Bar Association is responsible for the discipline of advocates and may suspend or disbar members for professional misconduct.',
  2023,
  'Rwanda Bar Association Registration Requirements'
);
