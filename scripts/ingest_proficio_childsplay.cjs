/**
 * Ingestion Script for Proficio Speech Therapy Group, Inc.,
 * Proficio Therapy Services, LLC, and Child's Play Therapy Services
 * Single Source of Truth: Supabase PostgreSQL
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const raw = process.env.VITE_SUPABASE_URL;
const clean = raw.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const key = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(clean, key);

// Payer ID resolver helper based on normalized name
async function getPayerMap() {
  const { data: payers } = await sb.from('payers').select('id, name');
  const map = {};
  payers.forEach(p => {
    map[p.name.toLowerCase().trim()] = p.id;
  });
  return { payers, map };
}

function resolvePayerId(payerMap, name) {
  const n = name.toLowerCase().trim();
  if (payerMap[n]) return payerMap[n];
  if (n === 'uhc' || n.includes('unitedhealth') || n.includes('united healthcare')) return payerMap['unitedhealthcare (uhc)'];
  if (n === 'ut medicaid' || n.includes('utah medicaid')) return payerMap['utah medicaid'];
  if (n.includes('aetna')) return payerMap['aetna'];
  if (n.includes('cigna')) return payerMap['cigna'] || payerMap['ash (american specialty health)'];
  if (n.includes('blue shield') || n.includes('bsc')) return payerMap['blue shield of california'];
  if (n.includes('anthem medi-cal') || n.includes('anthem medical')) return payerMap['anthem medi-cal'];
  if (n.includes('anthem')) return payerMap['anthem'];
  if (n.includes('valley health') || n.includes('vhp')) return payerMap['vhp (valley health plan)'];
  if (n.includes('select') || n.includes('selecthealth')) return payerMap['selecthealth'];
  if (n.includes('ubh') || n.includes('optum') || n.includes('united behavioral')) return payerMap['ubh (united behavioral health / optum)'];
  if (n.includes('santa clara') || n.includes('scfhp')) return payerMap['scfhp (santa clara family health plan)'];
  if (n.includes('triwest')) return payerMap['triwest'];
  if (n.includes('tricare')) return payerMap['tricare (west region / hnfs)'];
  if (n.includes('united medi-cal')) return payerMap['united medi-cal (optum)'] || payerMap['medi-cal (dhcs)'];
  if (n.includes('medi-cal') || n.includes('medical')) return payerMap['medi-cal (dhcs)'];
  if (n.includes('san mateo') || n.includes('hpsm')) return payerMap['hpsm (health plan of san mateo)'];
  if (n.includes('contra costa') || n.includes('cchp')) return payerMap['contra costa health plan (cchp)'];
  if (n.includes('alameda alliance') || n.includes('alameda')) return payerMap['alameda alliance'];
  if (n.includes('partnership')) return payerMap['partnership healthplan of california'];
  if (n.includes('catalight')) return payerMap['catalight (easterseals / behavioral health)'];
  if (n.includes('carelon')) return payerMap['carelon behavioral health'];
  if (n.includes('magellan')) return payerMap['magellan healthcare'];
  if (n.includes('sutter')) return payerMap['sutter health'];
  if (n.includes('vivant')) return payerMap['vivant health'];
  if (n.includes('chcn')) return payerMap['chcn (community health center network)'];
  if (n.includes('san joaquin') || n.includes('hpsj')) return payerMap['health plan of san joaquin (hpsj)'];
  if (n.includes('wellcare')) return payerMap['wellcare'];
  if (n.includes('pehp')) return payerMap['pehp (public employees health program)'];
  if (n.includes('university of ut') || n.includes('uuhp')) return payerMap['university of utah health plans'];
  if (n.includes('regence')) return payerMap['regence utah'];
  if (n.includes('molina')) return payerMap['molina'];
  if (n.includes('ash')) return payerMap['ash (american specialty health)'];
  if (n.includes('hill')) return payerMap['hill physicians'];
  return null;
}

function parseStatus(val) {
  if (!val) return { stage: 'Application Intake & Triage', status: 'In Progress', approved: false };
  const s = val.toLowerCase().trim();
  if (s.startsWith('yes') || s.startsWith('credentialed') || s.includes('got effective')) {
    return { stage: 'Payer Approved / In-Network', status: 'Approved', approved: true };
  }
  if (s.startsWith('pending') || s.includes('in process') || s.includes('under review') || s.includes('waiting')) {
    return { stage: 'Payer Review', status: 'In Progress', approved: false };
  }
  if (s.startsWith('in progress')) {
    return { stage: 'Payer Review', status: 'In Progress', approved: false };
  }
  if (s.startsWith('submitted') || s.includes('application submitted')) {
    return { stage: 'Application Submitted', status: 'In Progress', approved: false };
  }
  if (s.startsWith('not initiated') || s.startsWith('no')) {
    return { stage: 'Application Intake & Triage', status: 'In Progress', approved: false };
  }
  if (s === 'n/a' || s === 'not applicable') {
    return { stage: 'Application Intake & Triage', status: 'Not Applicable', approved: false };
  }
  return { stage: 'Payer Review', status: 'In Progress', approved: false };
}

async function run() {
  console.log('--- Starting Ingestion of Proficio & Child\'s Play Data ---');
  const { payers, map: payerMap } = await getPayerMap();

  // 1. PSTGINC Providers Data
  const pstgProviders = [
    { firstName: 'Pranali', lastName: 'Kalley', npi: '1255117768', caqhId: '16082051', dob: '', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '17412', email: 'pranalik.slp@proficiotherapy.com' },
    { firstName: 'Lauren', lastName: 'Pourreau', npi: '1275018855', caqhId: '15997800', dob: '1990-04-18', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '33881', email: 'laurens.slp@proficiotherapy.com' },
    { firstName: 'Jacqueline', lastName: 'Valles', npi: '1881223220', caqhId: '16693378', dob: '1994-04-19', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '40779', email: 'jacquelinev.slp@proficiotherapy.com' },
    { firstName: 'Georgina', lastName: 'Vasquez', npi: '1376067348', caqhId: '16862210', dob: '1989-08-05', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '40931', email: 'georginav.slp@proficiotherapy.com' },
    { firstName: 'Christine', lastName: 'Woods', npi: '1881984896', caqhId: '12191219', dob: '1978-08-09', taxonomy: '235Z00000X', credentials: 'M.A., CCC-SLP', licenseNumber: 'SP17047', email: 'christinew.slp@proficiotherapy.com' },
    { firstName: 'Shuyi', lastName: 'Tong', npi: '1669209078', caqhId: '16307669', dob: '', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '40014', email: 'shuyit.slp@proficiotherapy.com' },
    { firstName: 'Yi', lastName: 'Liu', npi: '1225857311', caqhId: '16322180', dob: '1998-07-05', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '39995', email: 'anna.l@cptherapyservices.com' },
    { firstName: 'Sandra', lastName: 'Manzo', npi: '1811411804', caqhId: '16147156', dob: '1983-12-30', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '23638', email: 'sandram.slp@proficiotherapy.com' },
    { firstName: 'Valeria', lastName: 'Ruvalcaba', npi: '1003740747', caqhId: '16831795', dob: '1999-12-18', taxonomy: '235Z00000X', credentials: 'M.S., CCC-SLP', licenseNumber: '41447', email: 'valeriar.slp@proficiotherapy.com' },
    { firstName: 'Aruna', lastName: 'Radhakrishnan', npi: '1518493097', caqhId: '14424452', dob: '1965-11-06', taxonomy: '235Z00000X', credentials: 'MA, CCC-SLP', licenseNumber: 'SP16932', email: 'arunar.slp@proficiotherapy.com' },
    { firstName: 'Catherine', lastName: 'Doerr', npi: '1689247298', caqhId: '15673999', dob: '', taxonomy: '235Z00000X', credentials: 'MA, CCC-SLP', licenseNumber: '33763', email: 'catherined.slp@proficiotherapy.com' },
    { firstName: 'Alicia', lastName: 'Nordstrom', npi: '1952075798', caqhId: '15266199', dob: '', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '29583', email: 'alician.slp@proficiotherapy.com' },
    { firstName: 'Dillon', lastName: 'O\'Connell', npi: '1962075713', caqhId: '15696150', dob: '1994-03-15', taxonomy: '235Z00000X', credentials: 'MA, CCC-SLP', licenseNumber: '33486', email: 'dillono.slp@proficiotherapy.com' },
    { firstName: 'Valerie', lastName: 'Russell', npi: '1962182923', caqhId: '16143512', dob: '', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '29847', email: 'valerievr.slp@proficiotherapy.com' },
    { firstName: 'Sierra', lastName: 'Bone', npi: '1245858810', caqhId: '15094231', dob: '1995-05-29', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '30178', email: 'sierrab.slp@proficiotherapy.com' },
    { firstName: 'Heather', lastName: 'Zamani', npi: '1023752599', caqhId: '15807520', dob: '', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '29515', email: 'heatherz.slp@proficiotherapy.com' },
    { firstName: 'Shannon', lastName: 'Knapp', npi: '1437422060', caqhId: '14099519', dob: '', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '35991', email: 'shannonk.slp@proficiotherapy.com' },
    { firstName: 'Jaclyn', lastName: 'Magner', npi: '1346079894', caqhId: '16145811', dob: '2000-08-17', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '19145', email: 'jaclynm.slp@proficiotherapy.com' },
    { firstName: 'Stacey', lastName: 'Romero', npi: '1609603943', caqhId: '', dob: '', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: '9106', email: 'staceyr.slp@proficiotherapy.com' },
    { firstName: 'Christina', lastName: 'Harman', npi: '1942617238', caqhId: '13582408', dob: '', taxonomy: '235Z00000X', credentials: 'MS, CCC-SLP', licenseNumber: '25830', email: 'christinah.slp@proficiotherapy.com' },
    { firstName: 'Rocio', lastName: 'Azocar', npi: '1871364232', caqhId: '', dob: '', taxonomy: '235Z00000X', credentials: 'M.S, CCC-SLP', licenseNumber: 'SP30928', email: 'rocioa.slp@proficiotherapy.com' },
    { firstName: 'Fernanda', lastName: 'Astudillo', npi: '1083475404', caqhId: '', dob: '', taxonomy: '235Z00000X', credentials: 'SLP', licenseNumber: 'SP34626', email: 'fernandaa.slp@proficiotherapy.com' }
  ];

  // PSTGINC Matrix Statuses
  const pstgMatrixStatuses = {
    'Lauren Pourreau': { Aetna: 'Yes', Cigna: 'Yes', 'Blue Shield of (CA)': 'Yes', Anthem: 'In Progress', 'Valley Health Plan': 'Pending', UHC: 'Not Initiated', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Yes', MediCal: 'Yes', 'Health Plan Of  San Mateo': 'Pending', 'Contra Costa Health Plan': 'In Progress', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'Yes', ASH: 'Pending' },
    'Aruna Radhakrishnan': { Aetna: 'Yes', Cigna: 'Yes', 'Blue Shield of (CA)': 'Yes', Anthem: 'Yes', 'Valley Health Plan': 'Pending', UHC: 'Yes', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Yes', MediCal: 'Yes', 'Health Plan Of  San Mateo': 'Pending', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'Yes', ASH: 'Pending' },
    'Catherine Doerr': { Aetna: 'Yes', Cigna: 'Yes', 'Blue Shield of (CA)': 'Yes', Anthem: 'Pending', 'Valley Health Plan': 'Pending', UHC: 'Yes', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Yes', MediCal: 'Yes', 'Health Plan Of  San Mateo': 'Pending', 'Contra Costa Health Plan': 'Pending', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'In Progress', ASH: 'Pending' },
    'Christine Woods': { Aetna: 'Yes', Cigna: 'Yes', 'Blue Shield of (CA)': 'Yes', Anthem: 'Yes', 'Valley Health Plan': 'Pending', UHC: 'Yes', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Yes', MediCal: 'Yes', 'Health Plan Of  San Mateo': 'Pending', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'In Progress', ASH: 'Pending' },
    'Dillon O\'Connell': { Aetna: 'Yes', Cigna: 'Yes', 'Blue Shield of (CA)': 'Yes', Anthem: 'Pending', 'Valley Health Plan': 'Pending', UHC: 'Yes', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Yes', MediCal: 'Yes', 'Health Plan Of  San Mateo': 'Pending', 'Contra Costa Health Plan': 'Pending', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'Yes', ASH: 'Pending' },
    'Sierra Bone': { Aetna: 'Yes', Cigna: 'Yes', 'Blue Shield of (CA)': 'Yes', Anthem: 'Pending', 'Valley Health Plan': 'Pending', UHC: 'Yes', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Yes', MediCal: 'Yes', 'Health Plan Of  San Mateo': 'Pending', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'Yes', ASH: 'Pending' },
    'Heather Zamani': { Aetna: 'Yes', Cigna: 'Yes', 'Blue Shield of (CA)': 'Yes', Anthem: 'In Progress', 'Valley Health Plan': 'Pending', UHC: 'Yes', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Yes', MediCal: 'Yes', 'Health Plan Of  San Mateo': 'Pending', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'Yes', ASH: 'Pending' },
    'Shannon Knapp': { Aetna: 'Yes', Cigna: 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Pending', 'Valley Health Plan': 'Pending', UHC: 'Yes', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Pending', MediCal: 'Yes', 'Health Plan Of  San Mateo': 'In Progress', 'Contra Costa Health Plan': 'In Progress', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'In Progress', ASH: 'Pending' },
    'Jaclyn Magner': { Aetna: 'In Progress', Cigna: 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'In Progress', 'Valley Health Plan': 'Pending', UHC: 'Yes', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Not Initiated', MediCal: 'Not Initiated', 'Health Plan Of  San Mateo': 'In Progress', 'Contra Costa Health Plan': 'In Progress', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'Not Initiated', ASH: 'Not Initiated' },
    'Shuyi Tong': { Aetna: 'In Progress', Cigna: 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'In Progress', 'Valley Health Plan': 'Pending', UHC: 'Pending', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Not Initiated', MediCal: 'Not Initiated', 'Health Plan Of  San Mateo': 'In Progress', 'Contra Costa Health Plan': 'In Progress', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'Not Initiated', ASH: 'Not Initiated' },
    'Yi Liu': { Aetna: 'In Progress', Cigna: 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'In Progress', 'Valley Health Plan': 'Pending', UHC: 'In Progress', 'Santa Clara Family Health Plan': 'Not Initiated', TriWest: 'Not Initiated', MediCal: 'Not Initiated', 'Health Plan Of  San Mateo': 'In Progress', 'Contra Costa Health Plan': 'In Progress', 'Partnership Healthplan of CA': 'Pending', 'Sutter Health': 'In Progress', 'Health Plan of San Joaquin': 'In Progress', 'Vivant Health': 'Not Initiated', ASH: 'Not Initiated' }
  };

  // 2. PTSLLC Provider Data
  const ptsProviders = [
    { firstName: 'Sheel', lastName: 'Mehata', npi: '1306146907', caqhId: '16487278', dob: '1985-04-16', taxonomy: '225X00000X', credentials: 'OTR/L', licenseNumber: 'OT-CA-16487', email: 'sheelm.ot@proficiotherapy.com' }
  ];

  const ptsMatrixStatuses = {
    'Sheel Mehata': {
      Aetna: 'Application submitted on 04/30/25',
      Cigna: 'application can be submitted through ASH',
      'Blue Shield of California': 'need to submit LOI and RA-02 form',
      Anthem: 'An Avality account, credentialled but pending verification',
      'ASH (American Specialty Health)': 'Initial request was submitted on 04/30/25',
      'Valley Health Plan': 'inital roster submitted'
    }
  };

  // 3. Child's Play Providers Data
  const cptsProviders = [
    { firstName: 'Miranda', lastName: 'Freeman', npi: '1326736042', caqhId: '15920517', dob: '1994-08-25', licenseNumber: '22890', licenseExpiration: '2026-08-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'miranda@cptherapyservices.com', isUtah: false },
    { firstName: 'Alyssa', lastName: 'Barker', npi: '1114646304', caqhId: '16553799', dob: '1995-07-16', licenseNumber: '27856', licenseExpiration: '2027-07-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'aly@cptherapyservices.com', isUtah: false },
    { firstName: 'Emily', lastName: 'Gayton', npi: '1871473421', caqhId: '16629183', dob: '1999-03-12', licenseNumber: '28130', licenseExpiration: '2027-03-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'emily@cptherapyservices.com', isUtah: false },
    { firstName: 'Keara', lastName: 'Greenan', npi: '1659194306', caqhId: '16349233', dob: '2000-06-28', licenseNumber: '25938', licenseExpiration: '2028-06-30', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'keara@cptherapyservices.com', isUtah: false },
    { firstName: 'Elena', lastName: 'Javier', npi: '1902471204', caqhId: '15150292', dob: '1995-12-26', licenseNumber: '21333', licenseExpiration: '2027-12-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'elena@cptherapyservices.com', isUtah: false },
    { firstName: 'Deana', lastName: 'Kamiya', npi: '1740014562', caqhId: '16291187', dob: '1997-11-13', licenseNumber: '26815', licenseExpiration: '2027-11-30', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'deana@cptherapyservices.com', isUtah: false },
    { firstName: 'Irene', lastName: 'Lestari', npi: '1881866820', caqhId: '15668412', dob: '1977-06-18', licenseNumber: '7552', licenseExpiration: '2027-06-30', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'irene@cptherapyservices.com', isUtah: false },
    { firstName: 'Crystal', lastName: 'Fuentez', npi: '1073251575', caqhId: '15586534', dob: '1988-07-03', licenseNumber: '23285', licenseExpiration: '2028-07-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'crystal@cptherapyservices.com', isUtah: false },
    { firstName: 'Graydon', lastName: 'Larsen', npi: '1730857285', caqhId: '15805043', dob: '1987-12-28', licenseNumber: '12814739-4201', licenseExpiration: '2027-05-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'graydon@cptherapyservices.com', isUtah: true, utahLicenseNumber: '12814739-4201' },
    { firstName: 'Natalie', lastName: 'Merrill', npi: '1669097309', caqhId: '16804205', dob: '1999-08-11', licenseNumber: '14270093-4201', licenseExpiration: '2027-05-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'natalie@cptherapyservices.com', isUtah: true, utahLicenseNumber: '14270093-4201' },
    { firstName: 'Christina', lastName: 'Gallo', npi: '1982991865', caqhId: '15668351', dob: '1969-04-19', licenseNumber: '14268177-4201, 11034', licenseExpiration: '2027-05-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'christina.gallo@cptherapyservices.com', isUtah: true, utahLicenseNumber: '14268177-4201' },
    { firstName: 'Morgan', lastName: 'King', npi: '1366141061', caqhId: '16839254', dob: '1997-10-23', licenseNumber: '24710', licenseExpiration: '2027-10-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'morgank.ot@cptherapyservices.com', isUtah: false },
    { firstName: 'Miriam', lastName: 'Garcia', npi: '1649954454', caqhId: '16917799', dob: '1996-01-21', licenseNumber: '29588', licenseExpiration: '2028-01-31', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'miriamg.ot@cptherapyservices.com', isUtah: false },
    { firstName: 'Sabrina', lastName: 'Figueroa', npi: '1922576784', caqhId: '16917095', dob: '2000-03-31', licenseNumber: '29601', licenseExpiration: '', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'sabrinaf.ot@cptherapyservices.com', isUtah: false },
    { firstName: 'Allison', lastName: 'Inloes', npi: '1616478001', caqhId: '', dob: '', licenseNumber: '1616478', licenseExpiration: '', taxonomy: '225X00000X', credentials: 'OT', providerType: 'OT', email: 'allisoni.ot@cptherapyservices.com', isUtah: false },
    // SLPs
    { firstName: 'Brenda', lastName: 'Castro', npi: '1699651158', caqhId: '16602383', dob: '1989-03-29', licenseNumber: '32414', licenseExpiration: '2027-03-31', taxonomy: '235Z00000X', credentials: 'SLP', providerType: 'SLP', email: 'brenda@cptherapyservices.com', isUtah: false },
    { firstName: 'Chitra', lastName: 'Lakshumanan', npi: '1215503172', caqhId: '15164471', dob: '1997-01-03', licenseNumber: '38254', licenseExpiration: '2028-01-31', taxonomy: '235Z00000X', credentials: 'SLP', providerType: 'SLP', email: 'chitra@cptherapyservices.com', isUtah: false },
    { firstName: 'Leah', lastName: 'Schwenk', npi: '1891577912', caqhId: '16051043', dob: '1993-11-18', licenseNumber: '38923', licenseExpiration: '2026-11-30', taxonomy: '235Z00000X', credentials: 'SLP', providerType: 'SLP', email: 'leahs.slp@cptherapyservices.com', isUtah: false },
    { firstName: 'Christine', lastName: 'Woods', npi: '1881984896', caqhId: '12191219', dob: '1978-08-09', licenseNumber: '17047', licenseExpiration: '2026-08-31', taxonomy: '235Z00000X', credentials: 'SLP', providerType: 'SLP', email: 'christine.w@cptherapyservices.com', isUtah: false },
    { firstName: 'Sierra', lastName: 'Bone', npi: '1245858810', caqhId: '15094231', dob: '1995-05-29', licenseNumber: '30178', licenseExpiration: '2028-05-31', taxonomy: '235Z00000X', credentials: 'SLP', providerType: 'SLP', email: 'sierrab.slp@proficiotherapy.com', isUtah: false },
    { firstName: 'Yi', lastName: 'Liu', npi: '1225857311', caqhId: '16322180', dob: '1998-07-05', licenseNumber: '39995', licenseExpiration: '2027-07-31', taxonomy: '235Z00000X', credentials: 'SLP', providerType: 'SLP', email: 'anna.l@cptherapyservices.com', isUtah: false },
    { firstName: 'Shannon', lastName: 'Singleton', npi: '1528933538', caqhId: '16856264', dob: '1985-07-03', licenseNumber: '41835', licenseExpiration: '2028-07-31', taxonomy: '235Z00000X', credentials: 'SLP', providerType: 'SLP', email: 'shannons.slp@cptherapyservices.com', isUtah: false }
  ];

  const cptsMatrixStatuses = {
    'Miranda Freeman': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Alyssa Barker': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Emily Gayton': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Keara Greenan': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Allison Inloes': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Elena Javier': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Deana Kamiya': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Irene Lestari': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Crystal Fuentez': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Morgan King': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'In Progress', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Pending', 'Partnership Healthplan of CA': 'pending', 'Hill Physician Group': 'In Progress', 'Alameda Alliance': 'Yes', CHCN: 'In Progress' },
    // UT OTs
    'Christina Gallo': { 'Aetna UT': 'Pending', 'Cigna/ ASH': 'Pending', 'Regence of UT': 'Pending', SelectHealth: 'Pending', 'Molina  UT': 'Pending', 'UT Medicaid': 'Pending', 'University of UT': 'Pending' },
    'Graydon Larsen': { 'Aetna UT': 'Not Initiated', 'Cigna/ ASH': 'Yes', 'Regence of UT': 'Pending', SelectHealth: 'Pending', 'Molina  UT': 'Yes', 'UT Medicaid': 'Yes', 'University of UT': 'Pending' },
    'Natalie Merrill': { 'Aetna UT': 'Not Initiated', 'Cigna/ ASH': 'Yes', 'Regence of UT': 'Pending', SelectHealth: 'Pending', 'Molina  UT': 'Yes', 'UT Medicaid': 'Yes', 'University of UT': 'Pending' },
    // SLPs
    'Brenda Castro': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Hill Physician Group': 'Pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Chitra Lakshumanan': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Hill Physician Group': 'Pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Leah Schwenk': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Partnership Healthplan of CA': 'pending', 'Hill Physician Group': 'Pending', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Christine Woods': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', 'Santa Clara Family Health Plan': 'Pending', 'Contra Costa Health Plan': 'Yes', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Yi Liu': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', MediCal: 'Yes', 'Contra Costa Health Plan': 'Yes', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Sierra Bone': { 'Aetna CA': 'In Progress', 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Pending', 'Santa Clara Family Health Plan': 'Pending', 'Contra Costa Health Plan': 'Yes', 'Alameda Alliance': 'Yes', CHCN: 'Yes' },
    'Shannon Singleton': { 'Cigna/ ASH': 'Yes', 'Blue Shield of (CA)': 'Pending', Anthem: 'Yes', 'Santa Clara Family Health Plan': 'Pending', 'Contra Costa Health Plan': 'Pending', 'Alameda Alliance': 'Pending' }
  };

  const providersToUpsert = [];
  const recordsToUpsert = [];

  // Function to process provider & generate credentialing records
  async function processProviderGroup(providers, entityId, defaultDiscipline, defaultType, matrixStatuses, idPrefix) {
    for (const p of providers) {
      const fullName = `${p.firstName} ${p.lastName}`.trim();
      const provId = `${idPrefix}-${p.npi || p.lastName.toLowerCase()}`;
      
      const disc = p.disciplines || (p.providerType === 'OT' ? ['OT'] : [defaultDiscipline]);
      const pType = p.providerType || defaultType;

      const providerObj = {
        id: provId,
        npi: p.npi || '',
        first_name: p.firstName,
        last_name: p.lastName,
        credentials: p.credentials || (pType === 'SLP' ? 'CCC-SLP' : (pType === 'OT' ? 'OTR/L' : 'BCBA')),
        disciplines: disc,
        provider_type: pType,
        email: p.email || `${p.firstName.toLowerCase()}.${p.lastName.toLowerCase()}@proficiotherapy.com`,
        phone: p.phone || '(925) 315-4024',
        license_number: p.licenseNumber || '',
        license_state: p.isUtah ? 'UT' : 'CA',
        license_expiration: p.licenseExpiration || '2027-12-31',
        entity_ids: [entityId],
        location_ids: [],
        caqh_id: p.caqhId || '',
        caqh_status: p.caqhId ? 'Attested' : 'Incomplete',
        pave_status: 'Approved',
        contract_info: {
          notes: `Ingested from ${entityId} Matrix & Roster.`,
          dob: p.dob || '',
          taxonomy: p.taxonomy || (pType === 'SLP' ? '235Z00000X' : '225X00000X'),
          isUtah: Boolean(p.isUtah),
          utahLicenseNumber: p.utahLicenseNumber || ''
        },
        payer_enrollments: [],
        is_demo: false,
        owner_email: 'joel.reji@ageslearningsolutions.com',
        active: true
      };

      // Determine statuses from matrix
      const matrix = matrixStatuses[fullName] || matrixStatuses[`${p.firstName} ${p.lastName}`] || {};
      const payerEntries = Object.entries(matrix);

      for (const [payerColName, statusVal] of payerEntries) {
        const resolvedPayerId = resolvePayerId(payerMap, payerColName);
        if (!resolvedPayerId) {
          console.warn(`[Unresolved Payer] ${payerColName} for ${fullName}`);
          continue;
        }

        const { stage, status, approved } = parseStatus(statusVal);
        const payerObj = payers.find(pyr => pyr.id === resolvedPayerId);
        const payerDisplayName = payerObj ? payerObj.name : payerColName;

        providerObj.payer_enrollments.push({
          id: `enr-${provId}-${resolvedPayerId}`,
          payerId: resolvedPayerId,
          payerName: payerDisplayName,
          status: approved ? 'Approved' : 'In Progress',
          enrollmentStatus: approved ? 'Approved' : 'In Progress',
          effectiveDate: approved ? '2024-01-01' : null,
          recredentialingDueDate: approved ? '2027-01-01' : null,
          notes: `Matrix Status: ${statusVal}`
        });

        const recordId = `rec-${provId}-${resolvedPayerId}`;
        recordsToUpsert.push({
          id: recordId,
          provider_id: provId,
          payer_id: resolvedPayerId,
          entity_id: entityId,
          location_id: null,
          discipline: disc[0],
          application_type: 'Initial Credentialing',
          stage: stage,
          status: status,
          intake_date: '2024-01-15',
          submission_date: '2024-02-01',
          approval_date: approved ? '2024-06-01' : null,
          effective_date: approved ? '2024-06-01' : null,
          expiration_date: approved ? '2027-06-01' : '2027-12-31',
          recredential_due_date: '2027-06-01',
          is_overdue: false,
          cycle_days: 45,
          linking_status: approved ? 'Linked' : 'In Review',
          contract_status: 'W-2 Clinical Staff',
          is_demo: false,
          owner_email: 'joel.reji@ageslearningsolutions.com',
          raw_record: {
            id: recordId,
            providerId: provId,
            payerId: resolvedPayerId,
            entityId: entityId,
            discipline: disc[0],
            stage: stage,
            status: status,
            notes: `Matrix: ${statusVal}`,
            applicationType: 'Initial Credentialing',
            isDemo: false
          }
        });
      }

      providersToUpsert.push(providerObj);
    }
  }

  // Process PSTGINC
  await processProviderGroup(pstgProviders, 'ent-pstg-inc', 'Speech', 'SLP', pstgMatrixStatuses, 'prv-pstg');
  console.log(`PSTGINC: Added ${pstgProviders.length} providers`);

  // Process PTSLLC
  await processProviderGroup(ptsProviders, 'ent-pts-llc', 'OT', 'OT', ptsMatrixStatuses, 'prv-pts');
  console.log(`PTSLLC: Added ${ptsProviders.length} providers`);

  // Process Child's Play
  await processProviderGroup(cptsProviders, 'ent-3', 'OT', 'OT', cptsMatrixStatuses, 'prv-cpts');
  console.log(`CPTS: Added ${cptsProviders.length} providers`);

  console.log(`Total new providers to upsert: ${providersToUpsert.length}`);
  console.log(`Total new credentialing records to upsert: ${recordsToUpsert.length}`);

  // Batch upsert providers
  for (let i = 0; i < providersToUpsert.length; i += 25) {
    const chunk = providersToUpsert.slice(i, i + 25);
    const { error } = await sb.from('providers').upsert(chunk);
    if (error) {
      console.error('Error upserting providers chunk:', error);
    } else {
      console.log(`Upserted providers chunk ${i} - ${i + chunk.length}`);
    }
  }

  // Batch upsert credentialing records
  for (let i = 0; i < recordsToUpsert.length; i += 50) {
    const chunk = recordsToUpsert.slice(i, i + 50);
    const { error } = await sb.from('credentialing_records').upsert(chunk);
    if (error) {
      console.error('Error upserting credentialing_records chunk:', error);
    } else {
      console.log(`Upserted records chunk ${i} - ${i + chunk.length}`);
    }
  }

  // Reconcile and report counts
  const { count: totalProv } = await sb.from('providers').select('*', { count: 'exact', head: true });
  const { count: totalRec } = await sb.from('credentialing_records').select('*', { count: 'exact', head: true });
  console.log(`=== Ingestion Complete ===`);
  console.log(`Final Database Provider Count: ${totalProv}`);
  console.log(`Final Database Credentialing Record Count: ${totalRec}`);
}

run().catch(console.error);
