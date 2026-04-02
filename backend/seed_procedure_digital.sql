-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Criminal Procedure Law 30/2018, Cybercrimes Law 60/2018,
--         Electronic Transactions Law 36/2010, Telecommunications Law 24/2016
-- Run this AFTER seed_final_laws.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- CRIMINAL PROCEDURE LAW — Law No. 30/2018 of 02/06/2018
-- ══════════════════════════════════════════════════════════
(
  'Criminal Procedure - Rights of Suspects and Accused Persons',
  'criminal_procedure',
  'Under Law No. 30/2018 relating to the code of criminal procedure in Rwanda: Every person suspected of an offence has the right to: be informed promptly of the charges against them; remain silent and not be compelled to testify against themselves; be assisted by a lawyer of their choice; have a lawyer appointed by the State if they cannot afford one; be presumed innocent until proven guilty; and not be subjected to torture, cruel or degrading treatment. A suspect must be informed of these rights at the time of arrest in a language they understand. Evidence obtained through torture or violation of fundamental rights is inadmissible. No confession made outside the presence of a lawyer is admissible unless the suspect voluntarily waived that right in writing. The right to a lawyer applies from the moment of arrest. Detained persons have the right to communicate with family members and to receive medical care. Juvenile suspects must be handled separately from adult suspects and their cases dealt with by special procedures protecting their best interests.',
  2018,
  'Law No. 30/2018 of 02/06/2018 relating to the code of criminal procedure in Rwanda'
),
(
  'Criminal Procedure - Arrest, Detention and Bail',
  'criminal_procedure',
  'Under Law No. 30/2018: A person may be arrested with or without a warrant. Arrest without warrant is permitted when a person is caught committing an offence, when there is strong evidence of guilt and risk of flight, or in other circumstances provided by law. A person arrested by the police must be brought before the prosecutor within twenty-four (24) hours. The prosecutor may detain the suspect for up to seventy-two (72) hours for investigation purposes. To continue detention beyond seventy-two hours, the prosecutor must obtain a detention order from the court. Investigative detention ordered by the court may not exceed thirty (30) days initially and may be extended for additional periods not exceeding thirty (30) days each, up to a maximum of twelve (12) months for serious offences. Bail may be granted by the court taking into account: the nature and seriousness of the alleged offence; the risk of flight; the risk of interference with witnesses or evidence; and the personal circumstances of the accused. Bail conditions may include reporting obligations, surrender of travel documents, and surety. Unlawful detention entitles the detained person to compensation from the State.',
  2018,
  'Law No. 30/2018 of 02/06/2018 relating to the code of criminal procedure in Rwanda'
),
(
  'Criminal Procedure - Investigation, Prosecution and Trial',
  'criminal_procedure',
  'Under Law No. 30/2018: Criminal investigations are conducted by the Rwanda Investigation Bureau (RIB) under the supervision of the prosecution. Police officers and RIB investigators may search premises and seize evidence with a warrant issued by a court, or without a warrant in urgent circumstances when evidence may be destroyed. The prosecution decides whether to indict, discontinue proceedings, or divert the case to alternative dispute resolution. Cases involving serious offences are tried before the High Court; less serious offences before the Intermediate Court or Primary Court. The accused has the right to be tried within a reasonable time. The trial is conducted in public unless the court orders otherwise for reasons of public order, national security, or protection of victims. The prosecution bears the burden of proof beyond reasonable doubt. Witnesses may be examined and cross-examined. The court may order pre-sentence reports before passing sentence. A victim of crime has the right to participate in criminal proceedings and to claim civil reparation from the accused.',
  2018,
  'Law No. 30/2018 of 02/06/2018 relating to the code of criminal procedure in Rwanda'
),
(
  'Criminal Procedure - Plea Bargaining, Appeals and Sentence Reduction',
  'criminal_procedure',
  'Under Law No. 30/2018: The accused and the prosecution may agree on a guilty plea bargain reducing the charge or sentence in exchange for a guilty plea, cooperation with the investigation, or both. A plea agreement must be approved by the court, which verifies it was made voluntarily and that there is a factual basis for the plea. Sentence may be reduced by one third for a guilty plea entered before commencement of trial, and by one sixth for a guilty plea entered after commencement of trial. A person who cooperates with justice and provides information leading to the arrest of co-perpetrators may benefit from further sentence reduction. The time limit for lodging a criminal appeal is thirty (30) days from the date of judgment pronouncement, or from notification where the accused was absent. An appeal is suspensive of execution except for civil damages awarded to the victim. The appellate court may confirm, reduce, increase or quash the sentence. A convicted person who has served two thirds of their sentence may apply for conditional release.',
  2018,
  'Law No. 30/2018 of 02/06/2018 relating to the code of criminal procedure in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- CYBERCRIMES LAW — Law No. 60/2018 of 22/08/2018
-- ══════════════════════════════════════════════════════════
(
  'Cybercrimes Law - Computer Offences and Unauthorized Access',
  'criminal',
  'Under Law No. 60/2018 on prevention and punishment of cyber crimes in Rwanda: Unauthorized access to a computer system means accessing a computer or network without the permission of the owner or lawful user. Any person who intentionally and without authorization accesses or intercepts a computer system or data commits an offence punishable by imprisonment of six (6) months to two (2) years and a fine of RWF 500,000 to RWF 5,000,000. If the unauthorized access results in deletion, alteration, or suppression of data, the penalty is imprisonment of one (1) to three (3) years and a fine of RWF 1,000,000 to RWF 10,000,000. Any person who intentionally introduces a computer virus, malware or destructive program into a computer system commits an offence punishable by imprisonment of two (2) to five (5) years and a fine of RWF 2,000,000 to RWF 20,000,000. If the offence targets critical national infrastructure including government systems, financial systems, or public utilities, the penalty is doubled. Corporations found guilty of cybercrimes are liable to fines of ten (10) times the amounts applicable to individuals.',
  2018,
  'Law No. 60/2018 of 22/08/2018 on prevention and punishment of cyber crimes in Rwanda'
),
(
  'Cybercrimes Law - Cyberbullying, Online Fraud and Child Exploitation',
  'criminal',
  'Under Law No. 60/2018: Any person who uses a computer or electronic communication system to threaten, harass, intimidate or cause distress to another person commits cyberbullying, punishable by imprisonment of one (1) to three (3) years and a fine of RWF 500,000 to RWF 5,000,000. Computer fraud — using a computer to deceive another person for financial gain — is punishable by imprisonment of two (2) to five (5) years and a fine of RWF 2,000,000 to RWF 20,000,000, plus restitution of the fraudulently obtained amount. Identity theft committed through electronic means is punishable by imprisonment of one (1) to five (5) years and a fine of RWF 1,000,000 to RWF 10,000,000. Any person who produces, possesses, distributes or makes accessible online content depicting sexual exploitation of children commits an offence punishable by imprisonment of five (5) to ten (10) years and a fine of RWF 5,000,000 to RWF 50,000,000. Internet service providers have obligations to remove illegal content upon notification and to cooperate with law enforcement investigations within prescribed time limits.',
  2018,
  'Law No. 60/2018 of 22/08/2018 on prevention and punishment of cyber crimes in Rwanda'
),
(
  'Cybercrimes Law - Electronic Evidence and Jurisdiction',
  'criminal',
  'Under Law No. 60/2018: Electronic evidence including computer data, digital records, metadata and communication logs is admissible in criminal proceedings if its integrity and authenticity are established. Investigators may apply to the court for an order requiring service providers to preserve data urgently and to produce subscriber information, traffic data and content data. Service providers operating in Rwanda must retain traffic data for a minimum period as prescribed by regulations. Rwanda courts have jurisdiction over cybercrimes where: the offence was committed in Rwanda; the accused is a Rwandan national regardless of where the offence occurred; or the offence targeted systems or persons located in Rwanda. International cooperation in cybercrime investigations is conducted through mutual legal assistance treaties (MLATs) and through the Budapest Convention on Cybercrime frameworks. Offences committed against the security or defence systems of the State attract the most severe penalties under this law.',
  2018,
  'Law No. 60/2018 of 22/08/2018 on prevention and punishment of cyber crimes in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- ELECTRONIC TRANSACTIONS LAW — Law No. 36/2010 of 19/11/2010
-- ══════════════════════════════════════════════════════════
(
  'Electronic Transactions - E-Signatures, E-Contracts and Legal Validity',
  'digital',
  'Under Law No. 36/2010 on electronic messages, electronic signatures and electronic transactions in Rwanda: An electronic message has the same legal effect as a written document and is admissible as evidence in legal proceedings. An electronic signature has the same legal effect as a handwritten signature if it is reliably linked to the person signing, the data signed, and if the person had control of the signing method at the time of signing. A qualified electronic signature using a certificate issued by an accredited certification authority has a higher level of legal assurance. Electronic contracts are valid and enforceable; an offer and acceptance communicated by electronic message constitute a legally binding contract. An electronic contract is concluded at the place where the offeror has their place of business. Formation of an electronic contract cannot be denied legal effect solely because it was formed by automated systems without direct human intervention. E-commerce transactions must comply with consumer protection obligations including disclosure of merchant identity, full price disclosure, cancellation rights and data protection requirements. The regulatory authority for electronic signatures and certification is the Rwanda Utilities Regulatory Authority (RURA).',
  2010,
  'Law No. 36/2010 of 19/11/2010 on electronic messages, electronic signatures and electronic transactions in Rwanda'
),

-- ══════════════════════════════════════════════════════════
-- TELECOMMUNICATIONS LAW — Law No. 24/2016 of 18/06/2016
-- ══════════════════════════════════════════════════════════
(
  'Telecommunications Law - Licensing, Consumer Rights and RURA Powers',
  'telecommunications',
  'Under Law No. 24/2016 on telecommunications in Rwanda: No person may operate a telecommunications network or provide a telecommunications service without a licence issued by the Rwanda Utilities Regulatory Authority (RURA). Categories of licences include: individual licences for operators of significant market power; class licences for smaller providers; and general authorisations for certain services. RURA regulates interconnection between operators to ensure fair access and non-discrimination. RURA may set tariffs and quality of service standards that operators must comply with. Operators must provide universal service access including in rural and underserved areas; contributions to the Universal Service Fund are mandatory. Consumer rights in telecommunications include: the right to receive itemised billing; the right to number portability when changing operators; the right to be informed of all charges before subscribing; protection from unsolicited commercial communications; and the right to file complaints with RURA. RURA may impose fines of up to RWF 500,000,000 on operators who violate their licence conditions or fail to comply with RURA directives. A licence may be suspended or revoked for serious or repeated violations.',
  2016,
  'Law No. 24/2016 of 18/06/2016 on telecommunications in Rwanda'
);
