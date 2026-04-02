-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Public Health Law 21/2016, Insurance Law 52/2008,
--         Social Security Law 45/2010, Cooperative Law 67/2018, NGO Law 04/2012
-- Run this AFTER seed_procedure_digital.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- PUBLIC HEALTH LAW — Law No. 21/2016 of 02/06/2016
-- ══════════════════════════════════════════════════════════
(
  'Public Health Law - Health Rights, Obligations and Disease Control',
  'health',
  'Under Law No. 21/2016 relating to public health in Rwanda: Every person has the right to access health services without discrimination. Health services providers must treat patients with dignity and respect. Patients have the right to give informed consent before any medical treatment and to refuse treatment. Medical confidentiality must be maintained; health information may only be disclosed with patient consent or as required by law. The State has the obligation to prevent, control and eradicate communicable diseases. The Ministry of Health may declare a public health emergency and impose measures including quarantine, isolation, compulsory examination and treatment where necessary to control communicable diseases. Any person who knowingly exposes another person to a communicable disease or violates prescribed prevention and control measures commits an offence. Mandatory vaccination programmes may be established for certain diseases by ministerial order. Health care facilities must meet minimum standards for staffing, equipment and sanitation established by the Ministry of Health. The Rwanda Food and Drugs Authority (FDA) oversees the safety and quality of medicines, medical devices and food products.',
  2016,
  'Law No. 21/2016 of 02/06/2016 relating to public health in Rwanda'
),
(
  'Public Health Law - Reproductive Health, Mental Health and Penalties',
  'health',
  'Under Law No. 21/2016: Reproductive health services including family planning, antenatal care, safe delivery and postnatal care must be made accessible by health facilities. Female genital mutilation is prohibited and constitutes a criminal offence punishable under the Penal Code. Abortion is regulated and permitted only in circumstances defined by law including cases of rape, incest, forced marriage, foetal impairment incompatible with life, or risk to the health of the mother. Mental health services must be integrated into the general health system. A person with a mental disorder cannot be confined against their will except by order of a competent court upon medical recommendation and must receive appropriate care and treatment. Health care workers must report cases of suspected child abuse, domestic violence, sexual assault and other notifiable conditions to the relevant authorities. Penalties under the public health law: operating a health facility without a licence is punishable by a fine of RWF 500,000 to RWF 5,000,000 and closure of the facility; providing health services without appropriate professional qualifications is punishable by imprisonment and fines.',
  2016,
  'Law No. 21/2016 of 02/06/2016 relating to public health in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- INSURANCE LAW — Law No. 52/2008 of 10/09/2008
-- ══════════════════════════════════════════════════════════
(
  'Insurance Law - Licensing, Classes of Insurance and BNR Supervision',
  'insurance',
  'Under Law No. 52/2008 on insurance regulation and supervision in Rwanda: No person may carry on insurance business in Rwanda without a licence issued by the National Bank of Rwanda (BNR). Classes of insurance regulated include: life insurance; non-life insurance covering property, liability and motor; health insurance; microinsurance; and reinsurance. A company licensed for life insurance may not also carry on non-life insurance in the same entity. Minimum capital requirements are set by BNR regulation: commercial insurers must meet higher thresholds than microinsurers. Insurers must at all times maintain adequate technical reserves to cover their underwriting liabilities. BNR exercises prudential supervision and may conduct on-site inspections, require production of records and financial statements, and issue binding directives. BNR may revoke an insurance licence where the insurer is insolvent, fails to meet capital requirements, or engages in conduct prejudicial to policyholders. All insurance intermediaries including brokers and agents must be licensed by BNR. Operating insurance business without a licence is punishable by imprisonment and heavy fines.',
  2008,
  'Law No. 52/2008 of 10/09/2008 on insurance regulation and supervision in Rwanda'
),
(
  'Insurance Law - Compulsory Insurance, Policy Disputes and Consumer Protection',
  'insurance',
  'Under Law No. 52/2008: Third party motor vehicle insurance (TPV) is compulsory for all motor vehicles used on public roads in Rwanda. Vehicle owners who fail to maintain valid third party insurance commit an offence punishable by a fine and impoundment of the vehicle. The Fonds de Garantie Automobile covers victims of accidents caused by uninsured or unidentified vehicles. Insurers must pay valid claims within a reasonable period; unjustified delay in settling claims is subject to interest and regulatory sanction. An insurer may not refuse a claim without providing written reasons. A policyholder may refer a disputed claim to BNR if not satisfied with the insurer response. Community-based health insurance (Mutuelle de Sante) operates under a separate framework providing universal health coverage through community contributions and government subsidies. Insurers must maintain client confidentiality and may not disclose personal information without consent except as required by law. Policy documents must be written in plain language and the key terms must be explained to the policyholder before signing.',
  2008,
  'Law No. 52/2008 of 10/09/2008 on insurance regulation and supervision in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- SOCIAL SECURITY LAW — Law No. 45/2010 of 14/12/2010 (as amended)
-- ══════════════════════════════════════════════════════════
(
  'Social Security - Pension Contributions and Benefits (RSSB)',
  'social_security',
  'Under Law No. 45/2010 establishing the Rwanda Social Security Board (RSSB): The RSSB administers pension, occupational hazards, and medical schemes for employees in Rwanda. Pension contributions are mandatory for all employees in formal employment: the contribution rate is five percent (5%) of gross salary from the employee and five percent (5%) from the employer, totalling ten percent (10%) of gross salary. Self-employed persons may contribute voluntarily. Contributions must be remitted to RSSB by the 15th of the month following the month of deduction. An employer who fails to deduct or remit contributions is liable for the full amount plus interest at a rate prescribed by RSSB and administrative penalties. Pension benefits: an employee who has reached the retirement age of sixty (60) years and contributed for at least fifteen (15) years is entitled to a monthly pension. The pension amount is calculated based on years of contribution and the average salary during the contribution period. Survivors of a deceased contributor are entitled to survivors pension. An employee who contributed for less than fifteen years at retirement age is entitled to a lump sum refund of their contributions with interest.',
  2010,
  'Law No. 45/2010 of 14/12/2010 establishing the Rwanda Social Security Board (RSSB), as amended'
),
(
  'Social Security - Occupational Hazards and Medical Insurance',
  'social_security',
  'Under Law No. 45/2010 and RSSB regulations: The occupational hazards scheme provides compensation to employees injured at work or who contract an occupational disease. Employer contribution to the occupational hazards scheme is between one percent (1%) and three percent (3%) of gross payroll depending on the risk category of the industry. A worker who suffers a workplace injury is entitled to: free medical treatment; temporary incapacity allowance equal to a percentage of average salary during recovery; permanent incapacity pension if the injury results in long-term disability; and death benefit to dependants in case of fatal accidents. Employers must report workplace accidents to RSSB within seventy-two (72) hours. The medical insurance scheme (community-based health insurance, Mutuelle de Sante) is administered in partnership with RSSB and provides health coverage to the population. Private sector formal employees are covered by RSSB medical insurance with contributions shared between employer and employee. RSSB invests social security funds in accordance with investment guidelines approved by its Board of Directors to ensure long-term fund sustainability.',
  2010,
  'Law No. 45/2010 of 14/12/2010 establishing the Rwanda Social Security Board (RSSB), as amended'
),

-- ══════════════════════════════════════════════════════════
-- COOPERATIVE LAW — Law No. 67/2018 of 30/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Cooperative Law - Formation, Membership and Governance',
  'cooperative',
  'Under Law No. 67/2018 on cooperatives in Rwanda: A cooperative is an autonomous association of persons voluntarily united to meet their common economic, social and cultural needs through a jointly owned and democratically controlled enterprise. A cooperative may be formed by a minimum of fifteen (15) founding members who adopt statutes and register with the competent authority. The statutes must specify: the name, objectives and registered office of the cooperative; conditions for admission and exclusion of members; rights and obligations of members; capital contribution requirements; governance structure; and distribution of surplus. Cooperative principles include: voluntary and open membership; democratic member control (one member one vote); member economic participation; autonomy and independence; education and training; cooperation among cooperatives; and concern for community. Governance bodies: the General Assembly (supreme authority); the Board of Directors (executive management); and the Supervisory Committee (internal audit). The General Assembly must meet at least once a year. Decisions on major matters require a qualified majority of two thirds of members. A member may resign from a cooperative subject to a notice period and subject to meeting outstanding obligations.',
  2018,
  'Law No. 67/2018 of 30/08/2018 on cooperatives in Rwanda'
),
(
  'Cooperative Law - Finance, Surplus Distribution and Dissolution',
  'cooperative',
  'Under Law No. 67/2018: The capital of a cooperative consists of members share contributions. Shares are transferable only between members unless the statutes provide otherwise. A cooperative must allocate from its annual surplus: at least fifteen percent (15%) to the statutory reserve fund until it equals the share capital; a portion to the education and training fund; and may distribute the remainder to members in proportion to their transactions with the cooperative (patronage refund). Cooperatives must maintain proper accounting records and have their accounts audited annually. Cooperatives with more than one hundred (100) members or significant assets must have accounts audited by a certified external auditor. A cooperative may be dissolved voluntarily by decision of two thirds of members at a General Assembly, or involuntarily by court order upon application of the competent authority for serious violations of the law. Upon dissolution the assets remaining after payment of debts are transferred to another cooperative with similar objectives or to the cooperative development fund. Cooperatives are supervised by the Ministry responsible for cooperatives in collaboration with the Rwanda Cooperative Agency (RCA).',
  2018,
  'Law No. 67/2018 of 30/08/2018 on cooperatives in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- NGO LAW — Law No. 04/2012 of 17/02/2012 (as amended)
-- ══════════════════════════════════════════════════════════
(
  'NGO Law - Registration, Operations and Reporting Requirements',
  'ngo',
  'Under Law No. 04/2012 governing non-profit organisations in Rwanda (as amended): Non-profit organisations (NPOs) including national and international NGOs, associations and foundations must register with the competent authority to obtain legal personality. A national NGO registers with the Rwanda Governance Board (RGB). An international NGO must register with the Ministry of Foreign Affairs and obtain an agreement governing its operations in Rwanda. Registration requires: notarized statutes; identity documents of founding members and leaders; a description of objectives and activities; a three-year activity plan and budget; and proof of lawful source of funds. An NPO is non-partisan and must not engage in activities contrary to national unity, public order or national security. NPOs must maintain financial records, prepare annual financial reports and submit them to the competent authority. An NPO that receives foreign funding must disclose the source, amount and intended use. Annual reports including activities undertaken and financial statements must be filed within three (3) months of the end of the financial year. Failure to file annual reports may result in suspension of operations. An NPO may be dissolved by court order for serious violations of its obligations or if it becomes inactive for two (2) consecutive years.',
  2012,
  'Law No. 04/2012 of 17/02/2012 governing non-profit organisations in Rwanda, as amended'
);
