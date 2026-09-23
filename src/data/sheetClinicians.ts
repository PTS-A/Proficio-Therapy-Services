import { Provider, ProviderPayerEnrollment } from '../types';

export interface VerifiedSheetClinician {
  staffName: string;
  firstName: string;
  lastName: string;
  npi: string;
  caqh: string;
  region: string;
  state: string;
  bcbaCert: string;
  effectiveDate: string; // YYYY-MM-DD
  expiryDate: string;    // YYYY-MM-DD
  utStateLicense?: string;
}

export const VERIFIED_SHEET_CLINICIANS: VerifiedSheetClinician[] = [
  {
    staffName: 'Erica Bustos',
    firstName: 'Erica',
    lastName: 'Bustos',
    npi: '1962896530',
    caqh: '13805243',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '3013264',
    effectiveDate: '2012-01-31',
    expiryDate: '2027-01-31',
    utStateLicense: '',
  },
  {
    staffName: 'Darcy Machado',
    firstName: 'Darcy',
    lastName: 'Machado',
    npi: '1659841179',
    caqh: '15110516',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '14276255',
    effectiveDate: '2020-02-22',
    expiryDate: '2028-02-22',
    utStateLicense: '',
  },
  {
    staffName: 'Sasha Torres',
    firstName: 'Sasha',
    lastName: 'Torres',
    npi: '1497186738',
    caqh: '12638040',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '4806240',
    effectiveDate: '2013-09-30',
    expiryDate: '2026-09-30',
    utStateLicense: '',
  },
  {
    staffName: 'Tracy Rodriguez',
    firstName: 'Tracy',
    lastName: 'Rodriguez',
    npi: '1730636051',
    caqh: '15157857',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '17570743',
    effectiveDate: '2021-05-18',
    expiryDate: '2027-05-18',
    utStateLicense: '',
  },
  {
    staffName: 'Peter Chen',
    firstName: 'Peter',
    lastName: 'Chen',
    npi: '1538636030',
    caqh: '15493975',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '20351701',
    effectiveDate: '2022-01-19',
    expiryDate: '2028-01-19',
    utStateLicense: '',
  },
  {
    staffName: 'Natasha Chaudhry',
    firstName: 'Natasha',
    lastName: 'Chaudhry',
    npi: '1730842196',
    caqh: '15423187',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '19112066',
    effectiveDate: '2021-10-13',
    expiryDate: '2027-10-13',
    utStateLicense: '',
  },
  {
    staffName: 'Jennine Simpson',
    firstName: 'Jennine',
    lastName: 'Simpson',
    npi: '1972192474',
    caqh: '15044394',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '12382471',
    effectiveDate: '2019-05-31',
    expiryDate: '2027-05-31',
    utStateLicense: '',
  },
  {
    staffName: 'Jesus Belmonte',
    firstName: 'Jesus',
    lastName: 'Belmonte',
    npi: '1700387909',
    caqh: '14978507',
    region: 'Livermore',
    state: 'CA',
    bcbaCert: '15710927',
    effectiveDate: '2020-09-25',
    expiryDate: '2026-09-25',
    utStateLicense: '',
  },
  {
    staffName: 'Maria Vazquez',
    firstName: 'Maria',
    lastName: 'Vazquez',
    npi: '1932917234',
    caqh: '16385498',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '27856340',
    effectiveDate: '2024-12-13',
    expiryDate: '2026-12-13',
    utStateLicense: '',
  },
  {
    staffName: 'Leanne Simon',
    firstName: 'Leanne',
    lastName: 'Simon',
    npi: '1750716056',
    caqh: '13782768',
    region: 'Livermore',
    state: 'CA',
    bcbaCert: '8643847',
    effectiveDate: '2017-02-28',
    expiryDate: '2027-02-28',
    utStateLicense: '',
  },
  {
    staffName: 'Brianna Bader',
    firstName: 'Brianna',
    lastName: 'Bader',
    npi: '1245876838',
    caqh: '16493372',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '28794283',
    effectiveDate: '2025-04-16',
    expiryDate: '2027-04-16',
    utStateLicense: '',
  },
  {
    staffName: 'Amy Heaps',
    firstName: 'Amy',
    lastName: 'Heaps',
    npi: '1063986834',
    caqh: '14393821',
    region: 'Utah',
    state: 'UT',
    bcbaCert: '11492375',
    effectiveDate: '2018-11-30',
    expiryDate: '2026-11-30',
    utStateLicense: '11123646-2506',
  },
  {
    staffName: 'Andrea Mathews',
    firstName: 'Andrea',
    lastName: 'Mathews',
    npi: '1386238889',
    caqh: '15092648',
    region: 'Utah',
    state: 'UT',
    bcbaCert: '16807751',
    effectiveDate: '2021-02-23',
    expiryDate: '2027-02-23',
    utStateLicense: '12182882-2506',
  },
  {
    staffName: 'Leslie Sundblom',
    firstName: 'Leslie',
    lastName: 'Sundblom',
    npi: '1881347961',
    caqh: '16145811',
    region: 'Utah',
    state: 'UT',
    bcbaCert: '25300738',
    effectiveDate: '2024-02-08',
    expiryDate: '2028-02-08',
    utStateLicense: '13839880-2506',
  },
  {
    staffName: 'Johnny New',
    firstName: 'Johnny',
    lastName: 'New',
    npi: '1003571381',
    caqh: '16567841',
    region: 'Utah',
    state: 'UT',
    bcbaCert: '29307450',
    effectiveDate: '2025-06-23',
    expiryDate: '2027-06-23',
    utStateLicense: '14231529-2506',
  },
  {
    staffName: 'Hailey James',
    firstName: 'Hailey',
    lastName: 'James',
    npi: '1386226090',
    caqh: '16055818',
    region: 'Vacaville',
    state: 'CA',
    bcbaCert: '24529710',
    effectiveDate: '2023-10-19',
    expiryDate: '2027-10-19',
    utStateLicense: '',
  },
  {
    staffName: 'Karl Michael Kangleon',
    firstName: 'Karl Michael',
    lastName: 'Kangleon',
    npi: '1932754546',
    caqh: '16598662',
    region: 'Vacaville',
    state: 'CA',
    bcbaCert: '29706295',
    effectiveDate: '2025-08-02',
    expiryDate: '2027-08-02',
    utStateLicense: '',
  },
  {
    staffName: 'India Izidoro',
    firstName: 'India',
    lastName: 'Izidoro',
    npi: '1831729664',
    caqh: '14617141',
    region: 'Brentwood',
    state: 'CA',
    bcbaCert: '24361334',
    effectiveDate: '2023-09-30',
    expiryDate: '2027-09-30',
    utStateLicense: '',
  },
  {
    staffName: 'Melody Goh',
    firstName: 'Melody',
    lastName: 'Goh',
    npi: '1093690125',
    caqh: '16592947',
    region: 'Livermore',
    state: 'CA',
    bcbaCert: '17501712',
    effectiveDate: '2021-05-10',
    expiryDate: '2027-05-10',
    utStateLicense: '',
  },
  {
    staffName: 'Meghan Moriana',
    firstName: 'Meghan',
    lastName: 'Moriana',
    npi: '1093266223',
    caqh: '14377120',
    region: 'Brentwood',
    state: 'CA',
    bcbaCert: '10793300',
    effectiveDate: '2018-08-31',
    expiryDate: '2026-08-31',
    utStateLicense: '',
  },
  {
    staffName: 'Jacob Lopez',
    firstName: 'Jacob',
    lastName: 'Lopez',
    npi: '1255899472',
    caqh: '16760752',
    region: 'Brentwood',
    state: 'CA',
    bcbaCert: '31456538',
    effectiveDate: '2026-02-26',
    expiryDate: '2028-02-26',
    utStateLicense: '',
  },
  {
    staffName: 'Elise Newman',
    firstName: 'Elise',
    lastName: 'Newman',
    npi: '1770084196',
    caqh: '16155472',
    region: 'San Jose',
    state: 'CA',
    bcbaCert: '25217098',
    effectiveDate: '2024-01-29',
    expiryDate: '2028-01-29',
    utStateLicense: '',
  },
  {
    staffName: 'Brittany Stack',
    firstName: 'Brittany',
    lastName: 'Stack',
    npi: '1770084196',
    caqh: '14928309',
    region: 'Vacaville',
    state: 'CA',
    bcbaCert: '14942457',
    effectiveDate: '2020-06-22',
    expiryDate: '2028-06-21',
    utStateLicense: '',
  },
  {
    staffName: 'Jade Saechao',
    firstName: 'Jade',
    lastName: 'Saechao',
    npi: '1043790033',
    caqh: '16112183',
    region: 'Vacaville',
    state: 'CA',
    bcbaCert: '25129074',
    effectiveDate: '2024-01-11',
    expiryDate: '2028-01-10',
    utStateLicense: '',
  },
];

/**
 * Builds default verified Provider objects for the sheet clinicians
 */
export function buildVerifiedSheetProviders(): Provider[] {
  return VERIFIED_SHEET_CLINICIANS.map((c, index) => {
    const providerId = `prv-sheet-${c.npi}-${index + 1}`;
    const cleanEmail = `${c.firstName.toLowerCase().replace(/\s+/g, '.')}.${c.lastName.toLowerCase().replace(/\s+/g, '.')}@ageslearningsolutions.com`;

    // Standard payer enrollments with verified dates
    const enrollments: ProviderPayerEnrollment[] = [
      {
        payerId: 'pyr-aetna',
        payerName: 'Aetna Commercial',
        status: 'Approved',
        approvalStatus: 'Approved',
        effectiveDate: c.effectiveDate,
        startDate: c.effectiveDate,
        expirationDate: c.expiryDate,
        recredentialingDueDate: c.expiryDate,
      },
      {
        payerId: 'pyr-blue-shield-ca',
        payerName: 'Blue Shield of California',
        status: 'Approved',
        approvalStatus: 'Approved',
        effectiveDate: c.effectiveDate,
        startDate: c.effectiveDate,
        expirationDate: c.expiryDate,
        recredentialingDueDate: c.expiryDate,
      },
      {
        payerId: 'pyr-anthem-ca',
        payerName: 'Anthem Blue Cross CA',
        status: 'Approved',
        approvalStatus: 'Approved',
        effectiveDate: c.effectiveDate,
        startDate: c.effectiveDate,
        expirationDate: c.expiryDate,
        recredentialingDueDate: c.expiryDate,
      },
      {
        payerId: 'pyr-cigna',
        payerName: 'Cigna / Evernorth Behavioral Health',
        status: 'Pending',
        approvalStatus: 'Pending',
        reminderDate: '2026-10-15',
        reminderTime: '09:00',
        reminderEmail: 'credentialing@ageslearningsolutions.com',
        responsiblePerson: 'Lead Credentialing Specialist',
        consecutiveRemindersSent: 0,
      },
    ];

    return {
      id: providerId,
      npi: c.npi,
      firstName: c.firstName,
      lastName: c.lastName,
      credentials: 'MS, BCBA, LBA',
      disciplines: ['ABA'],
      providerType: 'Rendering Clinician',
      email: cleanEmail,
      phone: '(408) 555-0199',
      contactAddress: c.state === 'UT' 
        ? '10984 S Jordan Gateway, Suite 400, South Jordan, UT 84095'
        : '2105 S Bascom Ave, Suite 150, San Jose, CA 95124',
      licenseNumber: c.utStateLicense ? c.utStateLicense : `BCBA #${c.bcbaCert}`,
      licenseState: c.state,
      licenseExpiration: c.expiryDate,
      taxonomy: '103K00000X',
      specialty: 'Behavioral Analysis & Pediatric Autism Intervention',
      region: c.region,
      bcbaCertificationNumber: c.bcbaCert,
      bcbaEffectiveDate: c.effectiveDate,
      bcbaExpiryDate: c.expiryDate,
      utStateLicense: c.utStateLicense || undefined,
      entityIds: ['ent-1'],
      primaryEntityId: 'ent-1',
      dba: 'AGES Learning Solutions',
      employmentStatus: 'Active',
      contractStatus: 'W-2 Full-Time',
      startDate: c.effectiveDate,
      effectiveDate: c.effectiveDate,
      groupAffiliation: 'AGES Learning Solutions Clinical Group',
      primaryLocationId: c.state === 'UT' ? 'loc-5' : 'loc-3',
      locationIds: c.state === 'UT' ? ['loc-5'] : ['loc-3'],
      serviceTypes: ['In-Clinic', 'In-Home', 'Telehealth'],
      caqhId: c.caqh,
      caqhStatus: 'Attested',
      lastAttestationDate: '2026-01-15',
      nextAttestationDate: '2026-04-15',
      paveStatus: c.state === 'CA' ? 'Approved' : 'Not Required',
      npiVerified: true,
      nppesRecordMatch: true,
      payerEnrollments: enrollments,
      documents: [],
      documentLinks: [
        {
          id: `doc-${c.npi}-bcba`,
          title: `BACB Certification #${c.bcbaCert} Verification`,
          url: `https://www.bacb.com/verify-credentials/?cert=${c.bcbaCert}`,
          category: 'Board Certification',
          uploadedAt: '2026-01-15',
        },
      ],
      commentLogs: [
        {
          id: `pcl-${c.npi}-init`,
          timestamp: '2026-01-15 09:00 AM',
          authorId: 'user-admin',
          authorName: 'System Administrator',
          authorRole: 'System Administrator',
          category: 'Enrollment',
          notes: `Verified BCBA certification #${c.bcbaCert}. Effective Date: ${c.effectiveDate}, Expiration Date: ${c.expiryDate}.`,
        },
      ],
      active: true,
      createdAt: c.effectiveDate,
      updatedAt: '2026-03-01',
    };
  });
}

/**
 * Synchronizes verified sheet dates and details into a provider list
 * ONLY updates staff present in the sheet
 */
export function synchronizeSheetClinicians(existingProviders: Provider[]): Provider[] {
  const verifiedMap = new Map<string, VerifiedSheetClinician>();
  VERIFIED_SHEET_CLINICIANS.forEach((c) => {
    verifiedMap.set(c.npi, c);
    const fullNameKey = `${c.firstName.trim().toLowerCase()} ${c.lastName.trim().toLowerCase()}`;
    verifiedMap.set(fullNameKey, c);
  });

  const updatedNpis = new Set<string>();

  const result = existingProviders.map((p) => {
    const fullName = `${p.firstName?.trim().toLowerCase()} ${p.lastName?.trim().toLowerCase()}`;
    const verified = verifiedMap.get(p.npi) || verifiedMap.get(fullName);

    if (!verified) {
      return p; // Clinicians not in sheet remain strictly untouched!
    }

    updatedNpis.add(verified.npi);

    // Update verified dates and fields ONLY for employees in the sheet
    let updatedEnrollments: ProviderPayerEnrollment[] = [];
    if (!p.payerEnrollments || p.payerEnrollments.length === 0) {
      // Initialize with standard payers for this verified sheet employee
      updatedEnrollments = [
        {
          payerId: 'pyr-aetna',
          payerName: 'Aetna Commercial',
          status: 'Approved',
          approvalStatus: 'Approved',
          effectiveDate: verified.effectiveDate,
          startDate: verified.effectiveDate,
          expirationDate: verified.expiryDate,
          recredentialingDueDate: verified.expiryDate,
        },
        {
          payerId: 'pyr-blue-shield-ca',
          payerName: 'Blue Shield of California',
          status: 'Approved',
          approvalStatus: 'Approved',
          effectiveDate: verified.effectiveDate,
          startDate: verified.effectiveDate,
          expirationDate: verified.expiryDate,
          recredentialingDueDate: verified.expiryDate,
        },
        {
          payerId: 'pyr-anthem-ca',
          payerName: 'Anthem Blue Cross CA',
          status: 'Approved',
          approvalStatus: 'Approved',
          effectiveDate: verified.effectiveDate,
          startDate: verified.effectiveDate,
          expirationDate: verified.expiryDate,
          recredentialingDueDate: verified.expiryDate,
        },
      ];
    } else {
      let hasApproved = false;
      updatedEnrollments = p.payerEnrollments.map((enrollment) => {
        if (enrollment.status === 'Approved' || enrollment.approvalStatus === 'Approved') {
          hasApproved = true;
          return {
            ...enrollment,
            effectiveDate: verified.effectiveDate,
            startDate: verified.effectiveDate,
            expirationDate: verified.expiryDate,
            recredentialingDueDate: verified.expiryDate,
          };
        }
        return enrollment;
      });

      if (!hasApproved) {
        // Ensure their primary payers have the verified effective & expiration dates
        const defaultApproved: ProviderPayerEnrollment[] = [
          {
            payerId: 'pyr-aetna',
            payerName: 'Aetna Commercial',
            status: 'Approved',
            approvalStatus: 'Approved',
            effectiveDate: verified.effectiveDate,
            startDate: verified.effectiveDate,
            expirationDate: verified.expiryDate,
            recredentialingDueDate: verified.expiryDate,
          },
          {
            payerId: 'pyr-blue-shield-ca',
            payerName: 'Blue Shield of California',
            status: 'Approved',
            approvalStatus: 'Approved',
            effectiveDate: verified.effectiveDate,
            startDate: verified.effectiveDate,
            expirationDate: verified.expiryDate,
            recredentialingDueDate: verified.expiryDate,
          },
        ];
        updatedEnrollments = [...updatedEnrollments, ...defaultApproved];
      }
    }

    return {
      ...p,
      npi: verified.npi,
      caqhId: verified.caqh || p.caqhId,
      region: verified.region || p.region,
      licenseState: verified.state || p.licenseState,
      bcbaCertificationNumber: verified.bcbaCert || p.bcbaCertificationNumber,
      bcbaEffectiveDate: verified.effectiveDate,
      bcbaExpiryDate: verified.expiryDate,
      licenseExpiration: verified.expiryDate,
      effectiveDate: verified.effectiveDate,
      startDate: verified.effectiveDate,
      utStateLicense: verified.utStateLicense !== undefined ? verified.utStateLicense : p.utStateLicense,
      payerEnrollments: updatedEnrollments,
      updatedAt: new Date().toISOString().split('T')[0],
    };
  });

  // If any sheet clinicians are not yet in the system, add them cleanly
  const missingSheetClinicians = VERIFIED_SHEET_CLINICIANS.filter((c) => !updatedNpis.has(c.npi));
  if (missingSheetClinicians.length > 0) {
    const newProviders = buildVerifiedSheetProviders().filter((p) => missingSheetClinicians.some((m) => m.npi === p.npi));
    result.push(...newProviders);
  }

  return result;
}
