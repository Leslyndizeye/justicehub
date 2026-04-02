-- Additional Rwanda legal documents for RAG database
-- SOURCE: Training knowledge from official laws —
--         Aviation Law, Housing Law, Postal Services Law,
--         Disaster Management Law, NISS Law, Fire Safety
-- Run this AFTER seed_revenue_local_tax.sql

INSERT INTO legal_documents (title, category, content, year, source) VALUES

-- ══════════════════════════════════════════════════════════
-- CIVIL AVIATION LAW — Rwanda Civil Aviation regulations
-- ══════════════════════════════════════════════════════════
(
  'Aviation Law - RCAA, Aircraft Licensing and Passenger Rights',
  'transport',
  'Under Rwandan civil aviation laws and regulations: The Rwanda Civil Aviation Authority (RCAA) is the regulatory body for civil aviation in Rwanda. Rwanda implements the Chicago Convention on International Civil Aviation and ICAO Standards and Recommended Practices (SARPs). Aircraft operating in Rwandan airspace must be registered with the RCAA and hold a Certificate of Airworthiness. Pilots and aviation personnel must hold valid licences and ratings issued or validated by the RCAA. Airlines operating scheduled services to and from Rwanda must obtain an air operators certificate (AOC) from the RCAA. Air transport agreements (bilateral air services agreements) govern routes, frequencies and commercial rights between Rwanda and other countries. The Kigali International Airport (KIA) is the main international airport; the Rwanda Airports Company (RAC) manages Rwanda airports. Air passenger rights in Rwanda and under EAC frameworks include: the right to compensation and assistance for flight cancellation; long delays; and denied boarding (bumping) when the flight is overbooked. Dangerous goods on aircraft are regulated strictly; undeclared hazardous materials in checked or carry-on luggage attract criminal prosecution and aviation security penalties. Drone operations (unmanned aerial vehicles) require registration with the RCAA and must comply with airspace restrictions; commercial drone operations require a remote pilot licence. Aviation security is managed by RCAA in cooperation with the Rwanda National Police.',
  2017,
  'Rwanda Civil Aviation Authority regulations and international civil aviation conventions as applied in Rwanda'
),
(
  'Aviation Law - Accident Investigation, Liability and Air Cargo',
  'transport',
  'Under Rwandan aviation laws: Aircraft accident and serious incident investigations are conducted by the Accident Investigation Bureau (AIB), an independent body separate from the RCAA, to ensure that investigations are not influenced by regulatory or commercial interests. Investigation reports are for safety improvement purposes only and may not be used to apportion civil or criminal liability. Liability for air passenger injuries and baggage damage is governed by the Montreal Convention 1999 for international flights: the carrier is liable up to prescribed limits (approximately SDR 128,821 per passenger for bodily injury; SDR 1,288 per kilogram for cargo) unless the carrier proves it took all reasonable measures or that the damage was caused by the passenger. For domestic flights, Rwanda applies its own liability rules. Air cargo transportation requires an air waybill documenting the consignment. Customs formalities for air cargo are handled by RRA at the airport cargo terminal. Perishable cargo such as flowers, vegetables and live animals are given priority clearance. The Kigali Logistics Platform is a designated special zone at the airport facilitating air cargo for the region. Loss or damage to cargo must be reported to the carrier within specified time limits: seven (7) days for damage to checked baggage; fourteen (14) days for cargo damage; and twenty-one (21) days for delay claims.',
  2017,
  'Montreal Convention 1999 as applied in Rwanda and RCAA cargo regulations'
),

-- ══════════════════════════════════════════════════════════
-- AFFORDABLE HOUSING LAW — Rwanda Housing Authority
-- ══════════════════════════════════════════════════════════
(
  'Housing Law - Affordable Housing, Rwanda Housing Authority and Construction Standards',
  'administrative',
  'Under Rwandan housing laws and Rwanda Housing Authority (RHA) mandate: The Rwanda Housing Authority is responsible for: developing and enforcing building regulations and construction standards; promoting affordable housing; managing and regulating social housing; and ensuring housing quality and safety. All buildings must be constructed in accordance with the National Building Code which sets minimum standards for: structural integrity; fire safety including fire exits, fire detection and suppression systems; sanitation and hygiene facilities; electrical installations; natural lighting and ventilation; and accessibility for persons with disabilities. A building may not be occupied until the local authority has issued a certificate of occupancy confirming it meets the approved plans and building standards. Affordable housing policy: the Government promotes affordable housing through: subsidised housing plots for low-income families; government mortgage guarantees; tax incentives for developers of low-cost housing; and partnerships with private developers under affordable housing PPP schemes. Rent controls: certain categories of government-provided housing have regulated rents. Social housing allocated by the Government must be occupied personally by the beneficiary and may not be sublet or sold without Government approval. Informal settlements (unplanned housing in urban areas) are subject to resettlement and upgrading programmes; residents being relocated receive alternative land and construction support.',
  2017,
  'Rwanda Housing Authority mandate, National Building Code and affordable housing policy framework'
),

-- ══════════════════════════════════════════════════════════
-- POSTAL SERVICES LAW
-- ══════════════════════════════════════════════════════════
(
  'Postal Services Law - Rwanda Post, Courier Licensing and Universal Service',
  'telecommunications',
  'Under Rwandan postal services laws: The Rwanda Post (Rwanda na Poste) is the national postal operator providing universal postal services across Rwanda. Rwanda Post provides: letter mail services; parcel services; money order services; and postbox services. The universal service obligation requires Rwanda Post to provide basic postal services to all areas of Rwanda including remote and rural areas at affordable and uniform rates regardless of cost. Commercial courier and express delivery services are provided by licensed operators in addition to Rwanda Post. Courier companies must obtain a licence from RURA to operate in Rwanda. RURA regulates: quality of service standards; complaint handling; and competition in the postal market. International postal services are governed by the Universal Postal Union (UPU) Convention to which Rwanda is a signatory. Customs regulations apply to international parcels and postal items containing goods: items above prescribed value thresholds are subject to customs duties and VAT on importation. Items sent by post containing prohibited goods (narcotics, weapons, counterfeit goods) are subject to seizure and criminal prosecution of the sender. The RURA may impose fines on postal and courier operators that fail to meet quality of service standards or operate without a licence.',
  2013,
  'Rwanda postal services laws and RURA postal regulations'
),

-- ══════════════════════════════════════════════════════════
-- DISASTER MANAGEMENT LAW
-- ══════════════════════════════════════════════════════════
(
  'Disaster Management Law - Disaster Risk Reduction, Emergency Response and MIDIMAR',
  'administrative',
  'Under Rwanda disaster management laws and policies: The Rwanda Emergency Management Authority (REMA — not to be confused with the environmental authority) / Ministry of Disaster Management and Refugee Affairs (MIDIMAR) is responsible for: disaster risk reduction; emergency preparedness; disaster response coordination; and recovery. Rwanda is vulnerable to natural disasters including landslides (particularly in the Western and Northern Provinces), floods, earthquakes (due to proximity to the Albertine Rift), and volcanic activity from Nyiragongo volcano near the DRC border. The National Disaster Management Plan provides the framework for multi-sectoral emergency response. District Disaster Management Committees are established in all districts to coordinate local response. Early warning systems for floods, landslides and extreme weather are operated in partnership with the Rwanda Meteorology Agency (Meteo Rwanda). Construction in high-risk zones including flood plains, steep hillsides and volcanic exclusion zones is prohibited or strictly regulated. Persons in high-risk zones may be compulsorily relocated for their safety with compensation. During a declared state of disaster, the Government may requisition private property, restrict movement, and mobilise emergency resources. International humanitarian assistance during disasters is coordinated through the OCHA cluster system. Rwanda hosts a large refugee population and MIDIMAR coordinates with UNHCR on refugee emergency response.',
  2012,
  'Rwanda disaster management laws and Rwanda Emergency Management Authority regulatory framework'
),

-- ══════════════════════════════════════════════════════════
-- FIRE SAFETY LAW
-- ══════════════════════════════════════════════════════════
(
  'Fire Safety Law - Fire Prevention, Inspections and Building Fire Standards',
  'administrative',
  'Under Rwandan fire safety laws and regulations: The Rwanda National Police Fire Brigade and district fire services are responsible for fire prevention and emergency firefighting. All commercial, industrial and public assembly buildings above a prescribed size must have a fire safety plan approved by the fire authority. Mandatory fire safety requirements for buildings include: fire detection systems (smoke detectors and fire alarms); fire suppression systems (sprinklers in high-rise and large public buildings); clearly marked and unobstructed fire exits; fire extinguishers of appropriate type and number; emergency lighting; and fire safety signage. Regular fire safety inspections of commercial premises are conducted by the fire authority. A building found to have serious fire safety deficiencies may be ordered to close until rectified. Owners and managers of buildings who fail to maintain fire safety equipment or obstruct a fire safety inspection commit an offence. Factories and industrial facilities handling flammable materials must comply with additional fire and explosion prevention standards. A fire safety certificate is required before a commercial building may be occupied. Following a major fire, an investigation is conducted to determine the cause; criminal charges may be filed for arson or criminal negligence causing death or destruction of property. Insurance companies may require a fire safety inspection before issuing fire insurance for commercial properties.',
  2015,
  'Rwanda fire safety regulations and Rwanda National Police Fire Brigade standards'
),

-- ══════════════════════════════════════════════════════════
-- NATIONAL INTELLIGENCE AND SECURITY SERVICE LAW
-- ══════════════════════════════════════════════════════════
(
  'Intelligence Law - NISS Mandate, Oversight and Legal Safeguards',
  'criminal_procedure',
  'Under the law governing the National Intelligence and Security Service (NISS) of Rwanda: The NISS is the national intelligence agency responsible for: gathering foreign and domestic intelligence relevant to national security; counterintelligence (identifying and neutralising foreign intelligence threats); counter-terrorism intelligence; cybersecurity intelligence; and advising the Government on national security matters. The NISS operates under the Presidency. NISS personnel have no powers of arrest; when evidence of a criminal offence is obtained, it is referred to the Rwanda Investigation Bureau (RIB) or the Rwanda National Police for investigation and prosecution. Interception of communications for intelligence purposes requires judicial authorisation in the form of an interception warrant issued by a designated judge. The warrant must specify the target, the means of interception, the duration and the specific intelligence purpose. Unauthorised interception of communications by NISS or other entities is an offence. Oversight: the NISS is subject to parliamentary oversight through the Senate Security Committee which reviews NISS activities in closed sessions. The NISS budget is appropriated by Parliament as part of the national defence and security budget. Information collected by NISS is classified at appropriate levels; unauthorised disclosure of classified intelligence is a serious criminal offence. NISS personnel are subject to strict security vetting and are bound by a lifelong obligation of secrecy regarding intelligence sources, methods and operations.',
  2012,
  'Rwanda law governing the National Intelligence and Security Service (NISS)'
),

-- ══════════════════════════════════════════════════════════
-- NATIONAL UNITY AND RECONCILIATION
-- ══════════════════════════════════════════════════════════
(
  'National Unity and Reconciliation Law - NURC Mandate and Reconciliation Programmes',
  'administrative',
  'Under the Organic Law establishing the National Unity and Reconciliation Commission (NURC) of Rwanda: The NURC is an independent constitutional institution established to facilitate national healing, unity and reconciliation following the 1994 genocide against the Tutsi and decades of ethnic divisions. The NURC mandate includes: studying the causes of conflicts in Rwanda and developing strategies to prevent their recurrence; initiating, supporting and coordinating programmes that promote reconciliation; fighting ideology and practices that lead to discrimination; carrying out a civic education programme; and monitoring the state of unity and reconciliation. Key NURC programmes include: Ingando (solidarity camps) — civic education and reconciliation retreats attended by diverse groups including university students, ex-combatants, released prisoners and community leaders; Itorero ry Igihugu — a national values and civic education framework; and community dialogue forums bringing together survivors, perpetrators and communities. The promotion of national identity (Ndi Umunyarwanda — I am Rwandan) as a unifying identity transcending ethnic categories is a core element of reconciliation policy. Divisionism and ethnic discrimination are treated as serious offences under the Genocide Ideology Law. The NURC conducts annual surveys measuring progress in reconciliation and national cohesion. Rwanda experiences a high level of social cohesion measured by trust, security and willingness to work together across community groups.',
  2007,
  'Organic Law establishing the National Unity and Reconciliation Commission (NURC) in Rwanda'
);
