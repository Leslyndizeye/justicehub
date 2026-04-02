-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Advocates Law 83/2013, Medical Practitioners Law, Accountancy Law 11/2018,
--         Bailiffs Law, Engineers/Architects Law, Veterinary Practitioners
-- Run this AFTER seed_aml_terrorism_narcotics.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- ADVOCATES / LEGAL PROFESSION LAW — Law No. 83/2013 of 11/09/2013
-- ══════════════════════════════════════════════════════════
(
  'Advocates Law - Admission to the Bar, Rights and Obligations of Lawyers',
  'legal_profession',
  'Under Law No. 83/2013 on the organisation of the legal profession in Rwanda: The Rwanda Bar Association (RBA) is the professional body that regulates the legal profession in Rwanda. To be admitted to the Bar and practice as an advocate, a person must: hold at least a bachelor degree in law from a recognised institution; complete a one-year professional pupillage under the supervision of a practicing advocate; pass the Bar admission examination administered by the RBA; be of good moral character and not have been convicted of a serious criminal offence; and take the professional oath before the Supreme Court. Only a registered advocate may represent clients in court proceedings above the Primary Court level. An advocate has the right to: freely and independently represent and advise their client; access their client in detention at all times including during police investigation; maintain professional secrecy concerning client information; and decline to represent a client without providing reasons. An advocate may not represent parties with conflicting interests in the same matter. Client funds received by an advocate must be held in a separate trust account and must not be mixed with the advocate personal funds. Advocates must carry professional indemnity insurance. The RBA sets the minimum fee schedules for legal services which advocates may not charge below.',
  2013,
  'Law No. 83/2013 of 11/09/2013 on the organisation of the legal profession in Rwanda'
),
(
  'Advocates Law - Professional Conduct, Discipline and Legal Ethics',
  'legal_profession',
  'Under Law No. 83/2013: Advocates must observe the following ethical obligations: loyalty to the client and the court; professional confidentiality — all information received from a client is privileged and may not be disclosed without consent except where disclosure is required to prevent a future crime or serious harm; candour — an advocate must not knowingly mislead the court; competence — an advocate must only take matters within their competence or associate with a more experienced colleague; and diligence — matters must be handled promptly without undue delay. An advocate who receives a client file has a duty not to abandon the representation without reasonable notice. Charging contingency fees (fees contingent on winning the case as a percentage of the award) are regulated and must comply with RBA guidelines. The RBA Disciplinary Committee handles complaints against advocates. Disciplinary sanctions include: warning; reprimand; suspension from practice for up to two (2) years; and striking off the roll (permanent removal from the Bar). An advocate struck off the roll may not practice law in any capacity. An advocate convicted of a crime involving dishonesty or moral turpitude is automatically suspended pending a disciplinary hearing and may be struck off. An advocate who misappropriates client funds is struck off and subject to criminal prosecution for theft or embezzlement.',
  2013,
  'Law No. 83/2013 of 11/09/2013 on the organisation of the legal profession in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- MEDICAL PRACTITIONERS LAW
-- ══════════════════════════════════════════════════════════
(
  'Medical Practitioners Law - Licensing, Medical Negligence and Professional Councils',
  'legal_profession',
  'Under Rwandan laws governing health professionals: The Rwanda Medical and Dental Council (RMDC) is the regulatory body for medical doctors, dentists and specialist practitioners. The Rwanda Allied Health Professions Council regulates nurses, midwives, laboratory technicians, physiotherapists and other allied health professionals. To obtain a practising licence, a health professional must: hold a recognised qualification in their field; register with the relevant council; and renew their licence annually by demonstrating continuing professional development (CPD) requirements. A health professional who practices without a valid licence commits an offence. Medical negligence occurs when a health professional fails to meet the standard of care expected of a reasonably competent professional in their field, causing harm to a patient. A patient harmed by medical negligence may bring a civil claim for damages against the practitioner and the health facility. The civil limitation period for medical negligence claims is three (3) years from when the patient knew or should have known of the harm and its cause. Criminal prosecution may also occur for gross negligence causing death. A health professional found guilty of serious professional misconduct by the council may be suspended or have their registration cancelled. Cancelled registration means the person can no longer practice in Rwanda until the council reinstates them.',
  2016,
  'Rwanda laws governing health professionals, Rwanda Medical and Dental Council regulations'
),

-- ══════════════════════════════════════════════════════════
-- ACCOUNTANCY LAW — Law No. 11/2018 of 05/03/2018
-- ══════════════════════════════════════════════════════════
(
  'Accountancy Law - Certified Accountants, Auditors and ICPAR',
  'legal_profession',
  'Under Law No. 11/2018 on accountancy and auditing in Rwanda: The Institute of Certified Public Accountants of Rwanda (ICPAR) is the professional body that regulates accountants and auditors in Rwanda. To be a Certified Public Accountant (CPA) in Rwanda, a person must: complete the prescribed professional examinations administered by ICPAR; have at least three (3) years of relevant practical experience; and be of good character. Only a registered CPA may: sign statutory audit reports; provide public assurance services; prepare financial statements for submission to the RRA as a professional accountant; and hold themselves out as a certified accountant or auditor. All companies above prescribed thresholds and all public institutions must have their annual financial statements audited by a registered CPA or CPA firm. Auditors must be independent of the entities they audit; an auditor may not audit a company in which they have a financial interest or with which they have a close personal relationship. Auditors have a duty to report to the competent authorities if they discover evidence of fraud, money laundering or serious irregularities that the management has not acted upon. A CPA who signs a false audit report is liable to criminal prosecution and removal from the ICPAR register. Financial statements prepared under IFRS or IPSAS as prescribed by ICPAR for different categories of entities.',
  2018,
  'Law No. 11/2018 of 05/03/2018 on accountancy and auditing in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- BAILIFF LAW
-- ══════════════════════════════════════════════════════════
(
  'Bailiffs Law - Enforcement of Judgments and Duties of Court Bailiffs',
  'civil_procedure',
  'Under Rwandan laws governing professional bailiffs: A court bailiff (huissier de justice) is a public officer authorised to enforce court judgments and orders, serve legal documents, and perform distraints and public auctions. To practice as a professional bailiff a person must: hold a law degree; complete a traineeship period; pass the professional examination; and be appointed by ministerial order. Only a professional bailiff may carry out compulsory enforcement of court judgments including: seizure and sale of property; eviction of tenants under a court order; service of summons and other court documents; and preparation of official reports on the condition of property. A bailiff must proceed with enforcement promptly after receiving a mandate from the winning party and must give the debtor a required notice period before executing a seizure. The bailiff prepares an official record (process-verbal) of each enforcement act which has full evidential value in court proceedings. A bailiff must maintain a separate ledger of all funds collected on behalf of clients and remit them promptly. Bailiffs are liable for losses caused by improper or negligent enforcement. Excessive or abusive enforcement by a bailiff may be challenged before the court that issued the judgment. A bailiff who misappropriates funds collected during enforcement is subject to criminal prosecution and removal from office.',
  2014,
  'Rwanda laws governing professional bailiffs and enforcement of court judgments'
),

-- ══════════════════════════════════════════════════════════
-- ENGINEERS AND ARCHITECTS LAW
-- ══════════════════════════════════════════════════════════
(
  'Engineers and Architects Law - Professional Registration and Liability',
  'legal_profession',
  'Under Rwandan laws governing engineering and architecture: Engineers and architects must be registered with the Rwanda Engineers and Architects Council (REAC) before practising professionally. Registration requires: a recognised degree in engineering or architecture; supervised practical experience of at least two (2) years; passing the professional competency assessment; and payment of registration fees. Only a registered engineer or architect may: sign and certify engineering or architectural drawings; provide professional engineering or architectural certification required for building permits; supervise construction works; and hold themselves out as a professional engineer or architect. An engineer or architect is personally liable for: defects in designs or specifications they certified; structural failures arising from their negligence; and losses caused by certifying works they did not properly inspect. The limitation period for claims against engineers and architects for latent construction defects is ten (10) years from completion of construction. Engineers and architects must maintain professional indemnity insurance. Specialisations requiring separate registration endorsements include: civil, structural, electrical, mechanical, chemical and geotechnical engineering. REAC investigates complaints and may impose disciplinary sanctions including suspension and removal from the register for professional misconduct. Practicing without registration is punishable by a fine and prohibition from continuing the practice.',
  2017,
  'Rwanda laws governing engineering and architectural practice, REAC regulations'
),

-- ══════════════════════════════════════════════════════════
-- PRISONS / CORRECTIONAL SERVICE LAW
-- ══════════════════════════════════════════════════════════
(
  'Prisons Law - Rights of Prisoners and Rwanda Correctional Service',
  'criminal_procedure',
  'Under the law governing the Rwanda Correctional Service: The Rwanda Correctional Service (RCS) manages prisons and is responsible for the custody, rehabilitation and reintegration of convicted offenders. The RCS operates under the Ministry of Justice. The fundamental rights of prisoners include: the right to humane treatment and freedom from torture, degrading treatment and physical abuse; the right to adequate food, water, shelter, clothing and medical care; the right to communicate with family and legal counsel; the right to practice their religion; and the right to make complaints about their treatment. Solitary confinement may only be imposed as a disciplinary measure and for a limited period with medical supervision. Prisoners retain their civil rights except those restricted by the sentence including liberty and certain political rights. Rwanda implements prison labour programmes and vocational training to prepare prisoners for reintegration. Good behaviour during imprisonment may result in remission of part of the sentence. A prisoner who has served at least half of their sentence may apply for conditional release (parole) which is subject to conditions and supervision. Community service is an alternative to imprisonment for minor offences; it must be performed without remuneration under supervision of the RCS. Juvenile offenders are held separately from adults in rehabilitation centres focussed on education and reintegration rather than punishment.',
  2013,
  'Law governing the Rwanda Correctional Service and management of prisoners in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- WITNESS AND WHISTLE-BLOWER PROTECTION
-- ══════════════════════════════════════════════════════════
(
  'Witness Protection Law - Protection of Witnesses, Victims and Informants',
  'criminal_procedure',
  'Under Rwandan laws on witness and victim protection: Witnesses in criminal proceedings who face serious threats to their safety may be placed under witness protection. Witness protection measures include: non-disclosure of identity and address in court proceedings; use of video testimony or screens during testimony; relocation; change of identity; and physical security arrangements. A request for witness protection is made by the prosecution, the witness, or their legal representative to the competent authority. The cost of witness protection is borne by the State. A person who threatens, intimidates, bribes or causes harm to a witness or victim to prevent or punish their testimony commits an offence punishable by imprisonment of five (5) to ten (10) years. Whistle-blower protection: a person who reports corruption, fraud or other wrongdoing in good faith to the Ombudsman, prosecution or other competent authority is protected from retaliation including dismissal, demotion, harassment and civil suits related to the report. An employer who retaliates against a whistle-blower commits an offence. Rwanda encourages citizens to report corruption through the Irembo digital platform and through the Ombudsman. Anonymous reporting is permitted; anonymous reports are investigated where there is sufficient specific information. The identity of a whistle-blower is protected and may only be disclosed with their consent or by court order.',
  2018,
  'Rwanda laws on witness protection, victim protection and whistle-blower protection'
);
