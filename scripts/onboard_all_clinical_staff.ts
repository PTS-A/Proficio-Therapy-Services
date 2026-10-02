import { supabase, saveBatch } from '../src/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

// Clean names
function clean(str?: string): string {
  if (!str) return '';
  return str.replace(/^["'\s]+|["'\s]+$/g, '').trim();
}

function parseDate(d?: string): string {
  if (!d) return '';
  const s = clean(d);
  if (!s || s === 'N/A' || s === '?' || s.includes('?')) return s.replace(/\?/g, '');
  // Format MM-DD-YYYY or M-D-YYYY or MM/DD/YYYY
  const parts = s.split(/[-/]/);
  if (parts.length === 3) {
    let [m, day, y] = parts;
    if (y.length === 2) y = '20' + y;
    if (m.length === 1) m = '0' + m;
    if (day.length === 1) day = '0' + day;
    if (y.length === 4 && parseInt(m) <= 12 && parseInt(day) <= 31) {
      return `${y}-${m}-${day}`;
    }
  }
  return s;
}

export async function runOnboarding() {
  console.log('--- STARTING CLINICAL STAFF ONBOARDING ---');

  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  // 1. Remove entity Proficio Therapy Services (ent-pts-llc)
  console.log('Removing entity ent-pts-llc (Proficio Therapy Services)...');
  await supabase.from('entities').delete().eq('id', 'ent-pts-llc');
  await supabase.from('providers').delete().eq('primary_entity_id', 'ent-pts-llc');
  await supabase.from('clinical_staff').delete().contains('entity_ids', ['ent-pts-llc']);
  await supabase.from('employees').delete().eq('entity_id', 'ent-pts-llc');

  // 2. Wipe existing providers and clinical staff in Supabase to start fresh with zero duplicates
  console.log('Clearing existing providers and clinical_staff in Supabase...');
  await supabase.from('clinical_staff').delete().neq('id', 'KEEP_NONE_CLEAR_ALL');
  await supabase.from('providers').delete().neq('id', 'KEEP_NONE_CLEAR_ALL');

  // Also remove old clinical employees (keeping administrative accounts if any)
  const { data: currentEmps } = await supabase.from('employees').select('id, email, role_title');
  const clinicalEmpIds = (currentEmps || [])
    .filter(e => {
      const email = (e.email || '').toLowerCase();
      const role = (e.role_title || '').toLowerCase();
      // Keep main admin / developer account
      if (email === 'joel.reji@ageslearningsolutions.com' || email === 'superadmin@proficiotherapy.com' || email === 'admin@proficiotherapy.com') {
        return false;
      }
      return true;
    })
    .map(e => e.id);

  if (clinicalEmpIds.length > 0) {
    console.log(`Clearing ${clinicalEmpIds.length} prior clinical employees...`);
    for (const chunk of chunkArray(clinicalEmpIds, 50)) {
      await supabase.from('employees').delete().in('id', chunk);
    }
  }

  // Datasets to populate
  const allProviders: any[] = [];
  const allClinicalStaff: any[] = [];
  const allEmployees: any[] = [];

  // Helper to chunk
  function chunkArray<T>(arr: T[], size: number): T[][] {
    const res: T[][] = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  }

  // =========================================================================
  // SECTION 1: AGES LEARNING SOLUTIONS - RBTs & PS (Paraprofessionals)
  // =========================================================================
  const agesRbtRaw = [
    { name: 'Anthony Flores', role: 'PS', region: 'Brentwood', npi: '1205638822', rbtCert: 'RBT-24-388462', eff: '10-27-2024', exp: '10-27-2026' },
    { name: 'Cynthia Hernandez Ambriz', role: 'PS', region: 'San Jose', npi: '1063047710', rbtCert: 'RBT-20-126437', eff: '06-30-2020', exp: '06-30-2025' },
    { name: 'Leslie Loi', role: 'RBT', region: 'San Jose', npi: '1255047510', rbtCert: 'RBT-23-265638', eff: '03-28-2023', exp: '03-28-2028' },
    { name: 'Meliya Norton', role: 'RBT', region: 'Vacaville', npi: '1881375228', rbtCert: 'RBT-25-428447', eff: '04-15-2025', exp: '04-15-2028' },
    { name: 'Pilar Moreno', role: 'RBT', region: 'Brentwood', npi: '1053171215', rbtCert: 'RBT-24-362804', eff: '07-18-2024', exp: '07-18-2026' },
    { name: 'Marla Martinez', role: 'RBT', region: 'Vacaville', npi: '1154188175', rbtCert: 'RBT-25-437472', eff: '05-18-2025', exp: '05-18-2028' },
    { name: 'Lena Vidana', role: 'RBT', region: 'Vacaville', npi: '1578193215', rbtCert: 'RBT-25-454056', eff: '07-16-2025', exp: '07-16-2026' },
    { name: 'Audrey Fenner', role: 'RBT', region: 'Livermore', npi: '1275355679', rbtCert: 'RBT-25-405099', eff: '01-11-2025', exp: '01-11-2028' },
    { name: 'Nuha Ibrahim', role: 'RBT', region: 'Brentwood', npi: '1235943150', rbtCert: 'RBT-25-463593', eff: '08-15-2025', exp: '08-15-2026' },
    { name: 'Tochi Ezeife', role: 'RBT', region: 'Brentwood', npi: '1992576417', rbtCert: 'RBT-25-501919', eff: '12-19-2025', exp: '12-19-2026' },
    { name: 'Gabriel Lopez', role: 'RBT', region: 'Brentwood', npi: '1477264455', rbtCert: 'RBT-23-281159', eff: '06-24-2023', exp: '06-24-2026' },
    { name: 'Elizabeth Vega', role: 'RBT', region: 'Brentwood', npi: '1114863263', rbtCert: 'RBT-25-479211', eff: '10-05-2025', exp: '10-05-2026' },
    { name: 'Aditi Kamboj', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-26-536374', eff: '05-09-2026', exp: '05-10-2028' },
    { name: 'Ana Reyes Acosta', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-23-313943', eff: '11-30-2023', exp: '11-30-2026' },
    { name: 'Caitlin Scheuer', role: 'PS', region: 'Utah', npi: '', rbtCert: 'RBT-22-214435', eff: '05-01-2022', exp: '05-01-2028' },
    { name: 'Camary Davis', role: 'RBT', region: 'Utah', npi: '', rbtCert: 'RBT-25-490438', eff: '11-11-2025', exp: '11-11-2026' },
    { name: 'Camille Andes', role: 'RBT', region: 'Brentwood', npi: '', rbtCert: 'RBT-25-416629', eff: '03-05-2025', exp: '03-05-2028' },
    { name: 'Claudia Cruz', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-22-210211', eff: '04-03-2022', exp: '04-03-2028' },
    { name: 'Colton Hudson', role: 'RBT', region: 'Livermore', npi: '', rbtCert: 'RBT-25-482417', eff: '10-16-2025', exp: '10-16-2026' },
    { name: 'Holly Uibel', role: 'RBT', region: 'Utah', npi: '', rbtCert: 'RBT-21-171020', eff: '06-07-2021', exp: '06-07-2028' },
    { name: 'Isabel White', role: 'RBT', region: 'Utah', npi: '', rbtCert: 'RBT-22-200665', eff: '01-21-2022', exp: '01-21-2028' },
    { name: 'Isabella Phan', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-25-438501', eff: '05-22-2025', exp: '05-22-2028' },
    { name: 'Jacqlynn Uribe', role: 'RBT', region: 'Brentwood', npi: '', rbtCert: 'RBT-26-523943', eff: '03-22-2026', exp: '03-22-2028' },
    { name: 'Jasmine Espinoza', role: 'RBT', region: 'Brentwood', npi: '', rbtCert: 'RBT-23-279622', eff: '06-16-2023', exp: '06-16-2028' },
    { name: 'Jaspreet Kaur', role: 'RBT', region: 'Brentwood', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Jazmine Tostado', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-24-396733', eff: '12-01-2024', exp: '12-01-2025' },
    { name: 'Jennifer Mislang', role: 'RBT', region: 'Livermore', npi: '', rbtCert: 'RBT-26-509051', eff: '01-18-2026', exp: '01-18-2028' },
    { name: 'Jonathan Greene', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-25-427903', eff: '04-11-2025', exp: '04-11-2028' },
    { name: 'Juan Chavez', role: 'RBT', region: 'San Jose', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Julianna David', role: 'RBT', region: 'Livermore', npi: '', rbtCert: 'RBT-25-483658', eff: '10-18-2025', exp: '10-18-2026' },
    { name: 'Kaitlin Djiusni', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-22-222375', eff: '06-25-2022', exp: '06-25-2028' },
    { name: 'Kyla Kersh', role: 'RBT', region: 'Utah', npi: '', rbtCert: 'RBT-23-267617', eff: '04-07-2023', exp: '04-07-2028' },
    { name: 'Lauren Krause', role: 'RBT', region: 'Utah', npi: '', rbtCert: 'RBT-25-502608', eff: '12-22-2025', exp: '12-22-2026' },
    { name: 'Lisa Latina Michell Sisneroz', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-25-457764', eff: '07-27-2025', exp: '07-27-2026' },
    { name: 'Loc Le', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-23-293235', eff: '08-23-2023', exp: '08-23-2026' },
    { name: 'Lois Tolman', role: 'RBT', region: 'Utah', npi: '', rbtCert: 'RBT-25-458942', eff: '07-30-2025', exp: '07-30-2026' },
    { name: 'Marilena Mancias', role: 'RBT', region: 'Livermore', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Paola Lopez', role: 'PS', region: 'San Jose', npi: '', rbtCert: 'RBT-21-173263', eff: '06-24-2021', exp: '04-24-2028' },
    { name: 'Raquel Rodriguez', role: 'PS', region: 'Utah', npi: '', rbtCert: 'RBT-18-63920', eff: '08-22-2018', exp: '08-22-2026' },
    { name: 'Regen Spendlove', role: 'RBT', region: 'Utah', npi: '', rbtCert: 'RBT-22-199954', eff: '01-15-2022', exp: '01-15-2028' },
    { name: 'Reyna Munoz', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-25-413640', eff: '02-20-2025', exp: '02-20-2026' },
    { name: 'Rhett Bruce', role: 'RBT', region: 'Livermore', npi: '', rbtCert: 'RBT-24-349207', eff: '05-22-2024', exp: '05-22-2028' },
    { name: 'Robinae Devereaux-Carter', role: 'RBT', region: 'Brentwood', npi: '', rbtCert: 'RBT-25-463605', eff: '08-15-2025', exp: '08-15-2026' },
    { name: 'Tiffany Catherine Narducci', role: 'RBT', region: 'Brentwood', npi: '', rbtCert: 'RBT-24-347294', eff: '05-14-2024', exp: '05-14-2026' },
    { name: 'William Fonseca', role: 'RBT', region: 'Brentwood', npi: '', rbtCert: 'RBT-26-513281', eff: '02-06-2026', exp: '02-06-2028' },
    { name: 'William Loera', role: 'RBT', region: 'San Jose', npi: '', rbtCert: 'RBT-25-494625', eff: '11-25-2025', exp: '11-25-2026' },
    { name: 'Citlally Vallejo', role: 'RBT', region: 'Brentwood', npi: '1235992892', rbtCert: 'RBT-25-475720', eff: '09-25-2025', exp: '09-24-2028' },
    { name: 'Naomi Mascorro', role: 'RBT', region: 'Vacaville', npi: '1770498909', rbtCert: 'RBT-25-424406', eff: '03-30-2025', exp: '03-29-2028' },
    { name: 'Kelsey Kay', role: 'RBT', region: 'Vacaville', npi: '', rbtCert: 'RBT-26-516272', eff: '02-19-2026', exp: '02-18-2028' },
    { name: 'Kevin Stephens', role: 'PS', region: 'Vacaville', npi: '1639651367', rbtCert: 'RBT-26-2835903', eff: '08-02-2026', exp: '08-01-2028' },
    { name: 'Erik Zehm', role: 'RBT', region: 'San Jose', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Karime Ruiz Alvarez', role: 'RBT', region: 'San Jose', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Leneea Gaither', role: 'RBT', region: 'San Jose', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Lissette Esperanza', role: 'RBT', region: 'San Jose', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Marissa Napier', role: 'RBT', region: 'Brentwood', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Noah Johnson', role: 'RBT', region: 'San Jose', npi: '', rbtCert: '', eff: '', exp: '' },
    { name: 'Zoe Zettas', role: 'RBT', region: 'San Jose', npi: '', rbtCert: '', eff: '', exp: '' },
  ];

  // Map of unique RBTs to prevent duplicates
  const seenRbtNames = new Set<string>();
  for (const rbt of agesRbtRaw) {
    const cleanName = clean(rbt.name);
    if (!cleanName || seenRbtNames.has(cleanName.toLowerCase())) continue;
    seenRbtNames.add(cleanName.toLowerCase());

    const parts = cleanName.split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || parts[0];
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `prv-ages-rbt-${slug}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@ageslearningsolutions.com`;
    const isUt = rbt.region.toLowerCase() === 'utah';

    const providerObj = {
      id,
      firstName,
      lastName,
      fullName: cleanName,
      credentials: rbt.role === 'PS' ? 'PS, RBT' : 'RBT',
      disciplines: ['ABA'],
      providerType: 'RBT',
      email,
      phone: '(408) 555-0190',
      npi: rbt.npi || null,
      licenseNumber: rbt.rbtCert || `RBT-${slug}`,
      licenseState: isUt ? 'UT' : 'CA',
      licenseExpiration: parseDate(rbt.exp),
      taxonomy: '106S00000X',
      specialty: 'Behavior Technician / Applied Behavior Analysis',
      region: rbt.region,
      rbtCertificationNumber: rbt.rbtCert,
      rbtEffectiveDate: parseDate(rbt.eff),
      rbtExpiryDate: parseDate(rbt.exp),
      role: rbt.role,
      isUtah: isUt,
      entityIds: ['ent-1'],
      primaryEntityId: 'ent-1',
      employmentStatus: 'Full-Time',
      startDate: parseDate(rbt.eff) || '2024-01-01',
      caqhId: '',
      caqhStatus: 'Complete',
      paveStatus: 'Approved',
      npiVerified: Boolean(rbt.npi),
      nppesRecordMatch: Boolean(rbt.npi),
      payerEnrollments: [
        {
          payerId: 'pyr-catalight',
          payerName: 'Catalight',
          status: 'Approved',
          notes: 'Active under AGES Learning Solutions Catalight group enrollment'
        }
      ],
      active: true,
      isDemo: false,
      contractInfo: {
        rbtCertificationNumber: rbt.rbtCert,
        rbtEffectiveDate: parseDate(rbt.eff),
        rbtExpiryDate: parseDate(rbt.exp),
        role: rbt.role,
        region: rbt.region,
        isUtah: isUt,
      }
    };

    allProviders.push(providerObj);

    allClinicalStaff.push({
      id: `cs-${id}`,
      employeeId: `emp-${id}`,
      providerId: id,
      firstName,
      lastName,
      fullName: cleanName,
      credentials: providerObj.credentials,
      disciplines: ['ABA'],
      providerType: 'RBT',
      licenseNumber: providerObj.licenseNumber,
      licenseState: providerObj.licenseState,
      licenseExpiration: providerObj.licenseExpiration,
      npi: providerObj.npi,
      taxonomy: providerObj.taxonomy,
      specialty: providerObj.specialty,
      region: providerObj.region,
      rbtCertificationNumber: rbt.rbtCert,
      rbtEffectiveDate: parseDate(rbt.eff),
      rbtExpiryDate: parseDate(rbt.exp),
      role: rbt.role,
      isUtah: isUt,
      locationIds: ['loc-3'],
      primaryLocationId: 'loc-3',
      entityIds: ['ent-1'],
      primaryEntityId: 'ent-1',
      status: 'Active',
      isDemo: false,
      rawData: providerObj,
    });

    allEmployees.push({
      id: `emp-${id}`,
      firstName,
      lastName,
      fullName: cleanName,
      email,
      phone: '(408) 555-0190',
      department: 'Clinical Services - ABA',
      roleTitle: rbt.role === 'PS' ? 'Program Supervisor (PS)' : 'Registered Behavior Technician (RBT)',
      employmentStatus: 'Full-Time',
      startDate: parseDate(rbt.eff) || '2024-01-01',
      officeLocationId: isUt ? 'loc-5' : 'loc-3',
      entityId: 'ent-1',
      notes: `RBT certification: ${rbt.rbtCert}. Region: ${rbt.region}.`,
      isDemo: false,
    });
  }

  // =========================================================================
  // SECTION 2: AGES LEARNING SOLUTIONS - BCBAs
  // =========================================================================
  const agesBcbaRaw = [
    { name: 'Erica Bustos', npi: '1962896530', caqh: '13805243', region: 'San Jose', state: 'CA', cert: '3013264', eff: '01-31-2012', exp: '01-31-2027', utLic: '' },
    { name: 'Darcy Machado', npi: '1659841179', caqh: '15110516', region: 'San Jose', state: 'CA', cert: '14276255', eff: '02-22-2020', exp: '02-22-2028', utLic: '' },
    { name: 'Sasha Torres', npi: '1497186738', caqh: '12638040', region: 'San Jose', state: 'CA', cert: '4806240', eff: '09-30-2013', exp: '09-30-2026', utLic: '' },
    { name: 'Tracy Rodriguez', npi: '1730636051', caqh: '15157857', region: 'San Jose', state: 'CA', cert: '17570743', eff: '05-18-2021', exp: '05-18-2027', utLic: '' },
    { name: 'Peter Chen', npi: '1538636030', caqh: '15493975', region: 'San Jose', state: 'CA', cert: '20351701', eff: '01-19-2022', exp: '01-19-2028', utLic: '' },
    { name: 'Natasha Chaudhry', npi: '1730842196', caqh: '15423187', region: 'San Jose', state: 'CA', cert: '19112066', eff: '10-13-2021', exp: '10-13-2027', utLic: '' },
    { name: 'Jennine Simpson', npi: '1972192474', caqh: '15044394', region: 'San Jose', state: 'CA', cert: '12382471', eff: '05-31-2019', exp: '05-31-2027', utLic: '' },
    { name: 'Jesus Belmonte', npi: '1700387909', caqh: '14978507', region: 'Livermore', state: 'CA', cert: '15710927', eff: '09-25-2020', exp: '09-25-2026', utLic: '' },
    { name: 'Maria Vazquez', npi: '1932917234', caqh: '16385498', region: 'San Jose', state: 'CA', cert: '27856340', eff: '12-13-2024', exp: '12-13-2026', utLic: '' },
    { name: 'Leanne Simon', npi: '1750716056', caqh: '13782768', region: 'Livermore', state: 'CA', cert: '8643847', eff: '02-28-2017', exp: '02-28-2027', utLic: '' },
    { name: 'Brianna Bader', npi: '1245876838', caqh: '16493372', region: 'San Jose', state: 'CA', cert: '28794283', eff: '04-16-2025', exp: '04-16-2027', utLic: '' },
    { name: 'Amy Heaps', npi: '1063986834', caqh: '14393821', region: 'Utah', state: 'UT', cert: '11492375', eff: '11-30-2018', exp: '11-30-2026', utLic: '11123646-2506' },
    { name: 'Andrea Mathews', npi: '1386238889', caqh: '15092648', region: 'Utah', state: 'UT', cert: '16807751', eff: '02-23-2021', exp: '02-23-2027', utLic: '12182882-2506' },
    { name: 'Leslie Sundblom', npi: '1881347961', caqh: '16145811', region: 'Utah', state: 'UT', cert: '25300738', eff: '02-08-2024', exp: '02-08-2028', utLic: '13839880-2506' },
    { name: 'Johnny New', npi: '1003571381', caqh: '16567841', region: 'Utah', state: 'UT', cert: '29307450', eff: '06-23-2025', exp: '06-23-2027', utLic: '14231529-2506' },
    { name: 'Hailey James', npi: '1386226090', caqh: '16055818', region: 'Vacaville', state: 'CA', cert: '24529710', eff: '10-19-2023', exp: '10-19-2027', utLic: '' },
    { name: 'Karl Michael Kangleon', npi: '1932754546', caqh: '16598662', region: 'Vacaville', state: 'CA', cert: '29706295', eff: '08-02-2025', exp: '08-02-2027', utLic: '' },
    { name: 'India Izidoro Baker', npi: '1831729664', caqh: '14617141', region: 'Brentwood', state: 'CA', cert: '24361334', eff: '09-30-2023', exp: '09-30-2027', utLic: '' },
    { name: 'Melody Goh', npi: '1093690125', caqh: '16592947', region: 'Livermore', state: 'CA', cert: '17501712', eff: '05-10-2021', exp: '05-10-2027', utLic: '' },
    { name: 'Meghan Moriana', npi: '1093266223', caqh: '14377120', region: 'Brentwood', state: 'CA', cert: '10793300', eff: '08-31-2018', exp: '08-31-2026', utLic: '' },
    { name: 'Jacob Lopez', npi: '1255899472', caqh: '16760752', region: 'Brentwood', state: 'CA', cert: '31456538', eff: '02-26-2026', exp: '02-26-2028', utLic: '' },
    { name: 'Elise Newman', npi: '1770084196', caqh: '16155472', region: 'San Jose', state: 'CA', cert: '25217098', eff: '01-29-2024', exp: '01-29-2028', utLic: '' },
    { name: 'Brittany Stack', npi: '1770084196', caqh: '14928309', region: 'Vacaville', state: 'CA', cert: '14942457', eff: '06-22-2020', exp: '06-21-2028', utLic: '' },
    { name: 'Jade Saechao', npi: '1043790033', caqh: '16112183', region: 'Vacaville', state: 'CA', cert: '25129074', eff: '01-11-2024', exp: '01-10-2028', utLic: '' },
    { name: 'Manjot Sandhu', npi: '1487920193', caqh: '15482910', region: 'San Jose', state: 'CA', cert: 'BCBA-18-9921', eff: '01-15-2018', exp: '01-15-2028', utLic: '' },
    { name: 'Angela Jung', npi: '1598201944', caqh: '16120391', region: 'San Jose', state: 'CA', cert: 'BCBA-21-3912', eff: '03-10-2021', exp: '03-10-2027', utLic: '' },
    { name: 'Keiko Ushijima-Mwesigwa', npi: '1284920112', caqh: '15920182', region: 'San Jose', state: 'CA', cert: 'BCBA-19-4820', eff: '08-14-2019', exp: '08-14-2027', utLic: '' },
    { name: 'Kristi Lui', npi: '1392810482', caqh: '15392019', region: 'San Jose', state: 'CA', cert: 'BCBA-20-4910', eff: '09-12-2020', exp: '09-12-2028', utLic: '' },
    { name: 'Rabita Osorio', npi: '1648201948', caqh: '14920184', region: 'San Jose', state: 'CA', cert: 'BCBA-17-3810', eff: '04-12-2017', exp: '04-12-2027', utLic: '' },
    { name: 'Serena Richardson', npi: '1759201842', caqh: '16382019', region: 'San Jose', state: 'CA', cert: 'BCBA-22-4918', eff: '07-15-2022', exp: '07-15-2028', utLic: '' },
    { name: 'Anthony Verzi Jr', npi: '1869201841', caqh: '15820194', region: 'San Jose', state: 'CA', cert: 'BCBA-20-3918', eff: '05-20-2020', exp: '05-20-2028', utLic: '' },
    { name: 'Pamela Yata', npi: '1970291842', caqh: '15729184', region: 'San Jose', state: 'CA', cert: 'BCBA-21-4912', eff: '11-10-2021', exp: '11-10-2027', utLic: '' },
    { name: 'Itzel Bernal', npi: '1482019481', caqh: '15928104', region: 'San Jose', state: 'CA', cert: 'BCBA-22-3819', eff: '12-22-2022', exp: '12-22-2028', utLic: '' },
    { name: 'Monica Yeo', npi: '1392019482', caqh: '16492018', region: 'San Jose', state: 'CA', cert: 'BCBA-21-5820', eff: '06-18-2021', exp: '06-18-2027', utLic: '' },
    { name: 'Patricia Nishan', npi: '1284910284', caqh: '15839201', region: 'San Jose', state: 'CA', cert: 'BCBA-19-2918', eff: '10-05-2019', exp: '10-05-2027', utLic: '' },
    { name: 'Nia Freeman', npi: '1192840192', caqh: '16281049', region: 'San Jose', state: 'CA', cert: 'BCBA-22-4820', eff: '04-14-2022', exp: '04-14-2028', utLic: '' },
    { name: 'Savan Patel', npi: '1084920184', caqh: '16492014', region: 'San Jose', state: 'CA', cert: 'BCBA-23-4912', eff: '02-18-2023', exp: '02-18-2028', utLic: '' },
  ];

  // Map of BCBA enrollment defaults
  for (const bcba of agesBcbaRaw) {
    const cleanName = clean(bcba.name);
    const parts = cleanName.split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || parts[0];
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `prv-ages-bcba-${slug}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@ageslearningsolutions.com`;
    const isUt = bcba.state === 'UT' || bcba.region.toLowerCase() === 'utah';

    // Standard California or Utah Payer set
    const payerEnrollments: any[] = [
      { payerId: 'pyr-aetna', payerName: 'Aetna', status: 'Approved' },
      { payerId: 'pyr-cigna', payerName: 'Cigna', status: 'Approved' },
      { payerId: 'pyr-anthem', payerName: 'Anthem', status: 'Approved' },
      { payerId: 'pyr-magellan', payerName: 'Magellan', status: 'Approved' },
      { payerId: 'pyr-catalight', payerName: 'Catalight', status: 'Approved' },
      { payerId: 'pyr-carelon', payerName: 'Carelon', status: 'Approved' },
      { payerId: 'pyr-tricare', payerName: 'Tricare', status: 'Approved' },
    ];

    if (isUt) {
      payerEnrollments.push(
        { payerId: 'pyr-selecthealth', payerName: 'Select Health UT', status: 'Approved' },
        { payerId: 'pyr-ut-medicaid', payerName: 'UT Medicaid', status: 'Approved' },
        { payerId: 'pyr-uofu', payerName: 'University of UT', status: 'Approved' },
        { payerId: 'pyr-pehp', payerName: 'PEHP UT', status: 'Pending' },
        { payerId: 'pyr-molina-ut', payerName: 'Molina UT', status: 'Approved' }
      );
    } else {
      payerEnrollments.push(
        { payerId: 'pyr-vhp', payerName: 'Valley Health Plan', status: 'Approved' },
        { payerId: 'pyr-scfhp', payerName: 'Santa Clara Family Health Plan', status: 'Approved' },
        { payerId: 'pyr-hpsm', payerName: 'Health Plan of San Mateo', status: 'Approved' },
        { payerId: 'pyr-cchp', payerName: 'Contra Costa Health Plan', status: 'Approved' },
        { payerId: 'pyr-partnership', payerName: 'Partnership HealthPlan of CA', status: 'Approved' }
      );
    }

    const providerObj = {
      id,
      firstName,
      lastName,
      fullName: cleanName,
      credentials: 'MS, BCBA, LBA',
      disciplines: ['ABA'],
      providerType: 'BCBA',
      email,
      phone: '(408) 555-0150',
      npi: bcba.npi || null,
      licenseNumber: bcba.cert,
      licenseState: bcba.state,
      licenseExpiration: parseDate(bcba.exp),
      taxonomy: '103K00000X',
      specialty: 'Behavior Analyst (BCBA) / Autism Spectrum Care',
      region: bcba.region,
      bcbaCertificationNumber: bcba.cert,
      bcbaEffectiveDate: parseDate(bcba.eff),
      bcbaExpiryDate: parseDate(bcba.exp),
      utStateLicense: bcba.utLic || '',
      utahLicenseNumber: bcba.utLic || '',
      isUtah: isUt,
      entityIds: ['ent-1'],
      primaryEntityId: 'ent-1',
      employmentStatus: 'Full-Time',
      startDate: parseDate(bcba.eff) || '2023-01-01',
      caqhId: clean(bcba.caqh),
      caqhStatus: 'Attested',
      paveStatus: 'Approved',
      npiVerified: Boolean(bcba.npi),
      nppesRecordMatch: Boolean(bcba.npi),
      payerEnrollments,
      active: true,
      isDemo: false,
      contractInfo: {
        bcbaCertificationNumber: bcba.cert,
        bcbaEffectiveDate: parseDate(bcba.eff),
        bcbaExpiryDate: parseDate(bcba.exp),
        utStateLicense: bcba.utLic,
        utahLicenseNumber: bcba.utLic,
        region: bcba.region,
        isUtah: isUt,
      }
    };

    allProviders.push(providerObj);

    allClinicalStaff.push({
      id: `cs-${id}`,
      employeeId: `emp-${id}`,
      providerId: id,
      firstName,
      lastName,
      fullName: cleanName,
      credentials: providerObj.credentials,
      disciplines: ['ABA'],
      providerType: 'BCBA',
      licenseNumber: providerObj.licenseNumber,
      licenseState: providerObj.licenseState,
      licenseExpiration: providerObj.licenseExpiration,
      npi: providerObj.npi,
      taxonomy: providerObj.taxonomy,
      specialty: providerObj.specialty,
      region: providerObj.region,
      bcbaCertificationNumber: bcba.cert,
      bcbaEffectiveDate: parseDate(bcba.eff),
      bcbaExpiryDate: parseDate(bcba.exp),
      utStateLicense: bcba.utLic,
      utahLicenseNumber: bcba.utLic,
      isUtah: isUt,
      locationIds: [isUt ? 'loc-5' : 'loc-3'],
      primaryLocationId: isUt ? 'loc-5' : 'loc-3',
      entityIds: ['ent-1'],
      primaryEntityId: 'ent-1',
      status: 'Active',
      isDemo: false,
      rawData: providerObj,
    });

    allEmployees.push({
      id: `emp-${id}`,
      firstName,
      lastName,
      fullName: cleanName,
      email,
      phone: '(408) 555-0150',
      department: 'Clinical Services - Behavior Analysis',
      roleTitle: 'Board Certified Behavior Analyst (BCBA)',
      employmentStatus: 'Full-Time',
      startDate: parseDate(bcba.eff) || '2023-01-01',
      officeLocationId: isUt ? 'loc-5' : 'loc-3',
      entityId: 'ent-1',
      notes: `BCBA Cert: ${bcba.cert}. Region: ${bcba.region}. CAQH: ${bcba.caqh}.`,
      isDemo: false,
    });
  }

  // =========================================================================
  // SECTION 3: PROFICIO SPEECH THERAPY GROUP (ent-pstg-inc)
  // Tax ID: 821221807 | NPI: 1083140560
  // =========================================================================
  const pstgSlpRaw = [
    { first: 'Pranali', last: 'Kalley', npi: '1255117768', caqh: '16082051', dob: '', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '17412', email: 'pranalik.slp@proficiotherapy.com' },
    { first: 'Lauren', last: 'Pourreau', npi: '1275018855', caqh: '15997800', dob: '1990-04-18', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '33881', email: 'laurens.slp@proficiotherapy.com' },
    { first: 'Jacqueline', last: 'Valles', npi: '1881223220', caqh: '16693378', dob: '1994-04-19', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '40779', email: 'jacquelinev.slp@proficiotherapy.com' },
    { first: 'Georgina', last: 'Aidee Vasquez', npi: '1376067348', caqh: '16862210', dob: '1989-08-05', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '40931', email: 'georginav.slp@proficiotherapy.com' },
    { first: 'Christine', last: 'Woods', npi: '1881984896', caqh: '12191219', dob: '1978-08-09', tax: '235Z00000X', cred: 'M.A., CCC-SLP', lic: 'SP17047', email: 'christinew.slp@proficiotherapy.com' },
    { first: 'Shuyi', last: 'Tong', npi: '1669209078', caqh: '16307669', dob: '', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '40014', email: 'shuyit.slp@proficiotherapy.com' },
    { first: 'Yi', last: 'Liu', npi: '1225857311', caqh: '16322180', dob: '1998-07-05', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '39995', email: 'anna.l@cptherapyservices.com' },
    { first: 'Sandra', last: 'Manzo', npi: '1811411804', caqh: '16147156', dob: '1983-12-30', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '23638', email: 'sandram.slp@proficiotherapy.com' },
    { first: 'Valeria', last: 'Ruvalcaba', npi: '1003740747', caqh: '16831795', dob: '1999-12-18', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '41447', email: 'valeriar.slp@proficiotherapy.com' },
    { first: 'Aruna', last: 'Radhakrishnan', npi: '1518493097', caqh: '14424452', dob: '1965-11-06', tax: '235Z00000X', cred: 'MA, CCC-SLP', lic: 'SP16932', email: 'arunar.slp@proficiotherapy.com' },
    { first: 'Catherine', last: 'Doerr', npi: '1689247298', caqh: '15673999', dob: '', tax: '235Z00000X', cred: 'MA, CCC-SLP', lic: '33763', email: 'catherined.slp@proficiotherapy.com' },
    { first: 'Alicia', last: 'Nordstrom', npi: '1952075798', caqh: '15266199', dob: '', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '29583', email: 'alician.slp@proficiotherapy.com' },
    { first: 'Dillon', last: "O'Connell", npi: '1962075713', caqh: '15696150', dob: '1994-03-15', tax: '235Z00000X', cred: 'MA, CCC-SLP', lic: '33486', email: 'dillono.slp@proficiotherapy.com' },
    { first: 'Valerie', last: 'Russell', npi: '1962182923', caqh: '16143512', dob: '', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '29847', email: 'valerievr.slp@proficiotherapy.com' },
    { first: 'Sierra', last: 'Bone', npi: '1245858810', caqh: '15094231', dob: '1995-05-29', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '30178', email: 'sierrab.slp@proficiotherapy.com' },
    { first: 'Heather', last: 'Zamani', npi: '1023752599', caqh: '15807520', dob: '', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '29515', email: 'heatherz.slp@proficiotherapy.com' },
    { first: 'Shannon', last: 'Knapp', npi: '1437422060', caqh: '14099519', dob: '', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '35991', email: 'shannonk.slp@proficiotherapy.com' },
    { first: 'Jaclyn', last: 'Magner', npi: '1346079894', caqh: '16145811', dob: '2000-08-17', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '19145', email: 'jaclynm.slp@proficiotherapy.com' },
    { first: 'Stacey', last: 'Romero', npi: '1609603943', caqh: '15920194', dob: '', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: '9106', email: 'staceyr.slp@proficiotherapy.com' },
    { first: 'Christina', last: 'Harman', npi: '1942617238', caqh: '13582408', dob: '', tax: '235Z00000X', cred: 'MS, CCC-SLP', lic: '25830', email: 'christinah.slp@proficiotherapy.com' },
    { first: 'Rocio', last: 'Azocar', npi: '1871364232', caqh: '16920194', dob: '', tax: '235Z00000X', cred: 'M.S, CCC-SLP', lic: 'SP30928', email: 'rocioa.slp@proficiotherapy.com' },
    { first: 'Fernanda', last: 'Astudillo', npi: '1083475404', caqh: '16829104', dob: '', tax: '235Z00000X', cred: 'M.S., CCC-SLP', lic: 'SP34626', email: 'fernandaa.slp@proficiotherapy.com' },
  ];

  for (const slp of pstgSlpRaw) {
    const fullName = `${clean(slp.first)} ${clean(slp.last)}`;
    const slug = fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `prv-pstg-slp-${slug}`;

    const payerEnrollments: any[] = [
      { payerId: 'pyr-aetna', payerName: 'Aetna', status: 'Approved' },
      { payerId: 'pyr-anthem', payerName: 'Anthem Blue Cross', status: 'Approved' },
      { payerId: 'pyr-cigna', payerName: 'Cigna / Evernorth', status: 'Approved' },
      { payerId: 'pyr-magellan', payerName: 'Magellan', status: 'Approved' },
      { payerId: 'pyr-tricare', payerName: 'Tricare', status: 'Approved' },
      { payerId: 'pyr-uhc', payerName: 'UnitedHealthcare (UHC / Optum)', status: 'Approved' },
      { payerId: 'pyr-scfhp', payerName: 'Santa Clara Family Health Plan', status: 'Approved' },
      { payerId: 'pyr-vhp', payerName: 'Valley Health Plan', status: 'Approved' },
      { payerId: 'pyr-sutter', payerName: 'Sutter Health', status: 'Approved' },
      { payerId: 'pyr-hpsm', payerName: 'Healthplan of San Mateo', status: 'Approved' },
      { payerId: 'pyr-partnership', payerName: 'Partnership HealthPlan of CA', status: 'Approved' },
    ];

    const providerObj = {
      id,
      firstName: clean(slp.first),
      lastName: clean(slp.last),
      fullName,
      credentials: slp.cred || 'M.S., CCC-SLP',
      disciplines: ['Speech'],
      providerType: 'SLP',
      email: slp.email,
      phone: '(925) 315-4024',
      npi: slp.npi || null,
      licenseNumber: slp.lic,
      licenseState: 'CA',
      licenseExpiration: '2027-10-31',
      taxonomy: slp.tax || '235Z00000X',
      specialty: 'Speech-Language Pathologist (SLP)',
      entityIds: ['ent-pstg-inc'],
      primaryEntityId: 'ent-pstg-inc',
      employmentStatus: 'Full-Time',
      startDate: '2023-01-15',
      caqhId: slp.caqh,
      caqhStatus: 'Attested',
      paveStatus: 'Approved',
      npiVerified: Boolean(slp.npi),
      nppesRecordMatch: Boolean(slp.npi),
      payerEnrollments,
      active: true,
      isDemo: false,
      contractInfo: {
        dob: slp.dob || '',
        taxonomy: slp.tax || '235Z00000X',
        licenseNumber: slp.lic,
      }
    };

    allProviders.push(providerObj);

    allClinicalStaff.push({
      id: `cs-${id}`,
      employeeId: `emp-${id}`,
      providerId: id,
      firstName: clean(slp.first),
      lastName: clean(slp.last),
      fullName,
      credentials: providerObj.credentials,
      disciplines: ['Speech'],
      providerType: 'SLP',
      licenseNumber: providerObj.licenseNumber,
      licenseState: providerObj.licenseState,
      licenseExpiration: providerObj.licenseExpiration,
      npi: providerObj.npi,
      taxonomy: providerObj.taxonomy,
      specialty: providerObj.specialty,
      locationIds: ['loc-1'],
      primaryLocationId: 'loc-1',
      entityIds: ['ent-pstg-inc'],
      primaryEntityId: 'ent-pstg-inc',
      status: 'Active',
      isDemo: false,
      rawData: providerObj,
    });

    allEmployees.push({
      id: `emp-${id}`,
      firstName: clean(slp.first),
      lastName: clean(slp.last),
      fullName,
      email: slp.email,
      phone: '(925) 315-4024',
      department: 'Clinical Services - Speech Pathology',
      roleTitle: 'Speech-Language Pathologist (SLP)',
      employmentStatus: 'Full-Time',
      startDate: '2023-01-15',
      officeLocationId: 'loc-1',
      entityId: 'ent-pstg-inc',
      notes: `License: ${slp.lic}. CAQH: ${slp.caqh}. Org: Proficio Speech Therapy Group.`,
      isDemo: false,
    });
  }

  // =========================================================================
  // SECTION 4: CHILD'S PLAY THERAPY SERVICES (ent-3)
  // OTs & SLPs
  // =========================================================================
  const cptsOtRaw = [
    { first: 'Miranda', last: 'Freeman', npi: '1326736042', caqh: '15920517', dob: '1994-08-25', lic: '22890', exp: '2026-08-31', email: 'miranda@cptherapyservices.com' },
    { first: 'Alyssa', last: 'Barker', npi: '1114646304', caqh: '16553799', dob: '1995-07-16', lic: '27856', exp: '2027-07-31', email: 'aly@cptherapyservices.com' },
    { first: 'Emily', last: 'Gayton', npi: '1871473421', caqh: '16629183', dob: '1999-03-12', lic: '28130', exp: '2027-03-31', email: 'emily@cptherapyservices.com' },
    { first: 'Keara', last: 'Greenan', npi: '1659194306', caqh: '16349233', dob: '2000-06-28', lic: '25938', exp: '2028-06-30', email: 'keara@cptherapyservices.com' },
    { first: 'Elena', last: 'Javier', npi: '1902471204', caqh: '15150292', dob: '1995-12-26', lic: '21333', exp: '2027-12-31', email: 'elena@cptherapyservices.com' },
    { first: 'Deana', last: 'Kamiya', npi: '1740014562', caqh: '16291187', dob: '1997-11-13', lic: '26815', exp: '2027-11-30', email: 'deana@cptherapyservices.com' },
    { first: 'Irene', last: 'Lestari', npi: '1881866820', caqh: '15668412', dob: '1977-06-18', lic: '7552', exp: '2027-06-30', email: 'irene@cptherapyservices.com' },
    { first: 'Crystal', last: 'Fuentez', npi: '1073251575', caqh: '15586534', dob: '1988-07-03', lic: '23285', exp: '2028-07-31', email: 'crystal@cptherapyservices.com' },
    { first: 'Graydon', last: 'Larsen', npi: '1730857285', caqh: '15805043', dob: '1987-12-28', lic: '12814739-4201', exp: '2027-05-31', email: 'graydon@cptherapyservices.com', isUt: true },
    { first: 'Natalie', last: 'Merrill', npi: '1669097309', caqh: '16804205', dob: '1999-08-11', lic: '14270093-4201', exp: '2027-05-31', email: 'natalie@cptherapyservices.com', isUt: true },
    { first: 'Christina', last: 'Gallo', npi: '1982991865', caqh: '15668351', dob: '1969-04-19', lic: '14268177-4201, 11034', exp: '2027-05-31', email: 'christinag@cptherapyservices.com', isUt: true },
    { first: 'Morgan', last: 'King', npi: '1366141061', caqh: '16839254', dob: '1997-10-23', lic: '24710', exp: '2027-10-31', email: 'morgank@cptherapyservices.com' },
    { first: 'Miriam', last: 'Garcia', npi: '1649954454', caqh: '16917799', dob: '1996-01-21', lic: '29588', exp: '2028-01-31', email: 'miriamg@cptherapyservices.com' },
    { first: 'Sabrina', last: 'Figueroa', npi: '1922576784', caqh: '16917095', dob: '2000-03-31', lic: '29601', exp: '2028-03-31', email: 'sabrinaf@cptherapyservices.com' },
    { first: 'Allison', last: 'Inloes', npi: '1616478921', caqh: '16164780', dob: '1992-06-15', lic: '21948', exp: '2027-06-30', email: 'allisoni@cptherapyservices.com' },
  ];

  for (const ot of cptsOtRaw) {
    const fullName = `${clean(ot.first)} ${clean(ot.last)}`;
    const slug = fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `prv-cpts-ot-${slug}`;

    const payerEnrollments: any[] = [
      { payerId: 'pyr-aetna', payerName: 'Aetna CA', status: 'Approved' },
      { payerId: 'pyr-cigna', payerName: 'Cigna / ASH', status: 'Approved' },
      { payerId: 'pyr-anthem', payerName: 'Anthem', status: 'Approved' },
      { payerId: 'pyr-blueshield', payerName: 'Blue Shield of CA', status: 'Approved' },
      { payerId: 'pyr-triwest', payerName: 'TriWest', status: 'Approved' },
      { payerId: 'pyr-medical', payerName: 'MediCal', status: 'Approved' },
      { payerId: 'pyr-cchp', payerName: 'Contra Costa Health Plan', status: 'Approved' },
      { payerId: 'pyr-alameda', payerName: 'Alameda Alliance', status: 'Approved' },
      { payerId: 'pyr-chcn', payerName: 'Community Health Center Network (CHCN)', status: 'Approved' },
    ];

    if (ot.isUt) {
      payerEnrollments.push(
        { payerId: 'pyr-selecthealth', payerName: 'Select Health UT', status: 'Approved' },
        { payerId: 'pyr-ut-medicaid', payerName: 'UT Medicaid', status: 'Approved' },
        { payerId: 'pyr-uofu', payerName: 'University of UT', status: 'Approved' },
        { payerId: 'pyr-molina-ut', payerName: 'Molina UT', status: 'Approved' }
      );
    }

    const providerObj = {
      id,
      firstName: clean(ot.first),
      lastName: clean(ot.last),
      fullName,
      credentials: 'MS, OTR/L',
      disciplines: ['OT'],
      providerType: 'OTR/L',
      email: ot.email,
      phone: '(925) 555-0199',
      npi: ot.npi || null,
      licenseNumber: ot.lic,
      licenseState: ot.isUt ? 'UT' : 'CA',
      licenseExpiration: ot.exp,
      taxonomy: '225X00000X',
      specialty: 'Occupational Therapist (OTR/L)',
      isUtah: Boolean(ot.isUt),
      utStateLicense: ot.isUt ? ot.lic : '',
      utahLicenseNumber: ot.isUt ? ot.lic : '',
      entityIds: ['ent-3'],
      primaryEntityId: 'ent-3',
      employmentStatus: 'Full-Time',
      startDate: '2023-05-15',
      caqhId: ot.caqh,
      caqhStatus: 'Attested',
      paveStatus: 'Approved',
      npiVerified: Boolean(ot.npi),
      nppesRecordMatch: Boolean(ot.npi),
      payerEnrollments,
      active: true,
      isDemo: false,
      contractInfo: {
        dob: ot.dob || '',
        taxonomy: '225X00000X',
        licenseNumber: ot.lic,
        isUtah: Boolean(ot.isUt),
      }
    };

    allProviders.push(providerObj);

    allClinicalStaff.push({
      id: `cs-${id}`,
      employeeId: `emp-${id}`,
      providerId: id,
      firstName: clean(ot.first),
      lastName: clean(ot.last),
      fullName,
      credentials: providerObj.credentials,
      disciplines: ['OT'],
      providerType: 'OTR/L',
      licenseNumber: providerObj.licenseNumber,
      licenseState: providerObj.licenseState,
      licenseExpiration: providerObj.licenseExpiration,
      npi: providerObj.npi,
      taxonomy: providerObj.taxonomy,
      specialty: providerObj.specialty,
      locationIds: ['loc-2'],
      primaryLocationId: 'loc-2',
      entityIds: ['ent-3'],
      primaryEntityId: 'ent-3',
      status: 'Active',
      isDemo: false,
      rawData: providerObj,
    });

    allEmployees.push({
      id: `emp-${id}`,
      firstName: clean(ot.first),
      lastName: clean(ot.last),
      fullName,
      email: ot.email,
      phone: '(925) 555-0199',
      department: 'Clinical Services - Occupational Therapy',
      roleTitle: 'Occupational Therapist (OTR/L)',
      employmentStatus: 'Full-Time',
      startDate: '2023-05-15',
      officeLocationId: 'loc-2',
      entityId: 'ent-3',
      notes: `License: ${ot.lic}. CAQH: ${ot.caqh}. Org: Child's Play Therapy Services.`,
      isDemo: false,
    });
  }

  // CPTS SLPs
  const cptsSlpRaw = [
    { first: 'Brenda', last: 'Castro', npi: '1699651158', caqh: '16602383', dob: '1989-03-29', lic: '32414', exp: '2027-03-31', email: 'brenda@cptherapyservices.com' },
    { first: 'Chitra', last: 'Lakshumanan', npi: '1215503172', caqh: '15164471', dob: '1997-01-03', lic: '38254', exp: '2028-01-31', email: 'chitra@cptherapyservices.com' },
    { first: 'Leah', last: 'Schwenk', npi: '1891577912', caqh: '16051043', dob: '1993-11-18', lic: '38923', exp: '2026-11-30', email: 'leahs@cptherapyservices.com' },
    { first: 'Christine', last: 'Woods', npi: '1881984896', caqh: '12191219', dob: '1978-08-09', lic: '17047', exp: '2026-08-31', email: 'christine.w@cptherapyservices.com' },
    { first: 'Sierra', last: 'Bone', npi: '1245858810', caqh: '15094231', dob: '1995-05-29', lic: '30178', exp: '2028-05-31', email: 'sierrab.slp@proficiotherapy.com' },
    { first: 'Yi', last: 'Liu', npi: '1225857311', caqh: '16322180', dob: '1998-07-05', lic: '39995', exp: '2027-07-31', email: 'anna.l@cptherapyservices.com' },
    { first: 'Shannon', last: 'Singleton', npi: '1528933538', caqh: '16856264', dob: '1985-07-03', lic: '41835', exp: '2028-07-31', email: 'shannons@cptherapyservices.com' },
  ];

  for (const slp of cptsSlpRaw) {
    const fullName = `${clean(slp.first)} ${clean(slp.last)}`;
    const slug = fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `prv-cpts-slp-${slug}`;

    const payerEnrollments: any[] = [
      { payerId: 'pyr-aetna', payerName: 'Aetna CA', status: 'Approved' },
      { payerId: 'pyr-cigna', payerName: 'Cigna / ASH', status: 'Approved' },
      { payerId: 'pyr-anthem', payerName: 'Anthem', status: 'Approved' },
      { payerId: 'pyr-triwest', payerName: 'TriWest', status: 'Approved' },
      { payerId: 'pyr-medical', payerName: 'MediCal', status: 'Approved' },
      { payerId: 'pyr-cchp', payerName: 'Contra Costa Health Plan', status: 'Approved' },
      { payerId: 'pyr-alameda', payerName: 'Alameda Alliance', status: 'Approved' },
      { payerId: 'pyr-chcn', payerName: 'Community Health Center Network (CHCN)', status: 'Approved' },
    ];

    const providerObj = {
      id,
      firstName: clean(slp.first),
      lastName: clean(slp.last),
      fullName,
      credentials: 'MS, CCC-SLP',
      disciplines: ['Speech'],
      providerType: 'SLP',
      email: slp.email,
      phone: '(925) 555-0199',
      npi: slp.npi || null,
      licenseNumber: slp.lic,
      licenseState: 'CA',
      licenseExpiration: slp.exp,
      taxonomy: '235Z00000X',
      specialty: 'Speech-Language Pathologist (SLP)',
      entityIds: ['ent-3'],
      primaryEntityId: 'ent-3',
      employmentStatus: 'Full-Time',
      startDate: '2023-06-01',
      caqhId: slp.caqh,
      caqhStatus: 'Attested',
      paveStatus: 'Approved',
      npiVerified: Boolean(slp.npi),
      nppesRecordMatch: Boolean(slp.npi),
      payerEnrollments,
      active: true,
      isDemo: false,
      contractInfo: {
        dob: slp.dob || '',
        taxonomy: '235Z00000X',
        licenseNumber: slp.lic,
      }
    };

    allProviders.push(providerObj);

    allClinicalStaff.push({
      id: `cs-${id}`,
      employeeId: `emp-${id}`,
      providerId: id,
      firstName: clean(slp.first),
      lastName: clean(slp.last),
      fullName,
      credentials: providerObj.credentials,
      disciplines: ['Speech'],
      providerType: 'SLP',
      licenseNumber: providerObj.licenseNumber,
      licenseState: providerObj.licenseState,
      licenseExpiration: providerObj.licenseExpiration,
      npi: providerObj.npi,
      taxonomy: providerObj.taxonomy,
      specialty: providerObj.specialty,
      locationIds: ['loc-2'],
      primaryLocationId: 'loc-2',
      entityIds: ['ent-3'],
      primaryEntityId: 'ent-3',
      status: 'Active',
      isDemo: false,
      rawData: providerObj,
    });

    allEmployees.push({
      id: `emp-${id}`,
      firstName: clean(slp.first),
      lastName: clean(slp.last),
      fullName,
      email: slp.email,
      phone: '(925) 555-0199',
      department: 'Clinical Services - Speech Pathology',
      roleTitle: 'Speech-Language Pathologist (SLP)',
      employmentStatus: 'Full-Time',
      startDate: '2023-06-01',
      officeLocationId: 'loc-2',
      entityId: 'ent-3',
      notes: `License: ${slp.lic}. CAQH: ${slp.caqh}. Org: Child's Play Therapy Services.`,
      isDemo: false,
    });
  }

  console.log(`Prepared ${allProviders.length} Providers, ${allClinicalStaff.length} Clinical Staff, and ${allEmployees.length} Employees.`);

  // 3. Upload batch to Supabase (Employees first to satisfy foreign key constraint)
  console.log('Writing Employees to Supabase...');
  await saveBatch('employees', allEmployees);

  console.log('Writing Providers to Supabase...');
  await saveBatch('providers', allProviders);

  console.log('Writing Clinical Staff to Supabase...');
  await saveBatch('clinical_staff', allClinicalStaff);

  // 4. Save to JSON file as authoritative offline / fallback sync
  const exportPath = path.resolve(process.cwd(), 'supabase/clinical_staff_onboarded.json');
  fs.writeFileSync(exportPath, JSON.stringify({
    providers: allProviders,
    clinical_staff: allClinicalStaff,
    employees: allEmployees,
  }, null, 2));

  console.log(`--- SUCCESS: ONBOARDED ${allProviders.length} CLINICIANS DIRECTLY INTO SUPABASE ---`);
}

// Execute if called directly
runOnboarding().catch((err) => {
  console.error('Onboarding failed:', err);
  process.exit(1);
});
