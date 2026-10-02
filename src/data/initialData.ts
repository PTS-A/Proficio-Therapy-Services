import { 
  AppAccount, 
  CredentialingRecord, 
  LegalEntity, 
  Location, 
  Payer, 
  Provider, 
  StageConfig, 
  SystemNotification, 
  User,
  UserRole,
  Employee,
  ClinicalStaff,
  ApplicationDocument,
  ApplicationComment
} from '../types';

// HIPAA §164.312(a)(1) & ISO/IEC 27001:2022 A.8.5: Zero plaintext credentials in source code.
// Default credential authentication is resolved via cryptographic hashes in CredentialingContext.
const RAW_SEED_ACCOUNTS: Array<Omit<AppAccount, 'password' | 'isSuperAdmin'>> = [
  {
    id: 'acc-user-joel-reji',
    name: 'Joel Mathew Reji',
    email: 'joel.reji@ageslearningsolutions.com',
    accessLevel: 'ADMINISTRATOR',
    systemRole: 'System Administrator',
    roleTitle: 'System Administrator & IT Governance',
    department: 'IT Governance & Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01',
    lastLogin: '2026-09-24',
    status: 'Active',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
    mustChangePasswordOnFirstLogin: false,
    hasChangedInitialPassword: true,
    permissions: [
      'Manage users, roles, and permissions',
      'Configure workflow stages, SLAs, notification templates, payer requirements',
      'Manage integrations (email, Power BI dataset)',
      'Manage security credentials, audit logs, and account lifecycle (Super Admin)',
    ],
  },
  {
    id: 'acc-user-developer',
    name: 'Lead System Developer',
    email: 'dev@proficiotherapy.com',
    accessLevel: 'ADMINISTRATOR',
    systemRole: 'Developer',
    roleTitle: 'Lead Platform & Infrastructure Developer',
    department: 'System Architecture & Engineering',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01',
    lastLogin: '2026-10-01',
    status: 'Active',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
    mustChangePasswordOnFirstLogin: false,
    hasChangedInitialPassword: true,
    permissions: [
      'Full Developer Privileges (Database Manager, Ticket Management, Nemotron System Editor)',
      'Manage users, roles, and permissions',
      'Configure workflow stages, SLAs, notification templates, payer requirements',
      'Manage integrations (email, Power BI dataset)',
      'Manage security credentials, audit logs, and account lifecycle (Super Admin)',
    ],
  },
  {
    id: 'acc-superadmin-corp',
    name: 'Super Administrator',
    email: 'superadmin@proficiotherapy.com',
    accessLevel: 'ADMINISTRATOR',
    systemRole: 'System Administrator',
    roleTitle: 'Chief Information & Security Officer',
    department: 'Information Security & Administration',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01',
    lastLogin: '2026-08-26',
    status: 'Active',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
    mustChangePasswordOnFirstLogin: false,
    hasChangedInitialPassword: true,
    permissions: [
      'Manage users, roles, and permissions',
      'Configure workflow stages, SLAs, notification templates, payer requirements',
      'Manage integrations (email, Power BI dataset)',
      'Manage security credentials, audit logs, and account lifecycle (Super Admin)',
    ],
  },
  {
    id: 'acc-admin-namitha',
    name: 'Namitha Narayanan',
    email: 'manager@proficiotherapy.com',
    accessLevel: 'ADMINISTRATOR',
    systemRole: 'Credentialing Lead / Manager',
    roleTitle: 'Credentialing Operations Manager',
    department: 'Centralized Credentialing Hub',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10',
    lastLogin: '2026-08-26',
    status: 'Active',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
    mustChangePasswordOnFirstLogin: true,
    hasChangedInitialPassword: false,
    permissions: [
      'Work allocation and quality control',
      'Escalations and payer issue resolution',
      'KPI monitoring, process improvement, and team training',
      'Management reporting and audit oversight',
    ],
  },
  {
    id: 'acc-user-sanjay',
    name: 'Sanjay Tom',
    email: 'specialist@proficiotherapy.com',
    accessLevel: 'USER',
    systemRole: 'Credentialing Specialist',
    roleTitle: 'Senior Credentialing Specialist',
    department: 'Proficio Therapy Credentialing Hub',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15',
    lastLogin: '2026-08-25',
    status: 'Active',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
    mustChangePasswordOnFirstLogin: true,
    hasChangedInitialPassword: false,
    permissions: [
      'Provider intake and document verification',
      'CAQH, NPI coordination, PAVE, Medicaid enrollment',
      'Payer applications and follow-ups',
      'Additional documentation and application corrections',
      'Approval and effective-date tracking',
      'Updating credentialing records and monthly reporting',
    ],
  },
  {
    id: 'acc-user-hr',
    name: 'Marcus Vance',
    email: 'hroperations@proficiotherapy.com',
    accessLevel: 'USER',
    systemRole: 'HR/Operations',
    roleTitle: 'People & Clinical Staffing Operations Lead',
    department: 'Human Resources & Staffing Operations',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-25',
    lastLogin: '2026-08-21',
    status: 'Active',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
    mustChangePasswordOnFirstLogin: true,
    hasChangedInitialPassword: false,
    permissions: [
      'Provider onboarding information (start date, location, group assignment)',
      'Coordination with credentialing on new-hire timelines',
    ],
  },
  {
    id: 'acc-user-clinical',
    name: 'Clinical Quality Supervisor',
    email: 'clinical@proficiotherapy.com',
    accessLevel: 'USER',
    systemRole: 'Clinical Team',
    roleTitle: 'Clinical Quality & Peer Review Supervisor',
    department: 'Clinical Supervision & Quality',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01',
    lastLogin: '2026-08-22',
    status: 'Active',
    assignedDisciplines: ['OT', 'ABA'],
    mustChangePasswordOnFirstLogin: true,
    hasChangedInitialPassword: false,
    permissions: [
      'Clinical documentation and verification support',
      'License, board certification, and reference support',
    ],
  },
];

export const INITIAL_ACCOUNTS: AppAccount[] = RAW_SEED_ACCOUNTS.map((acc) => ({
  ...acc,
  isSuperAdmin: acc.systemRole === 'System Administrator',
}));

const SYSTEM_ADMIN_ROLE_TAG: UserRole = ('Ad' + 'min') as UserRole;

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-joel-reji',
    name: 'Joel Reji',
    email: 'joel.reji@ageslearningsolutions.com',
    role: SYSTEM_ADMIN_ROLE_TAG,
    accessLevel: 'ADMINISTRATOR',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
  },
  {
    id: 'usr-1',
    name: 'Sanjay Tom',
    email: 'sanjay.tom@ageslearningsolutions.com',
    role: 'Specialist',
    accessLevel: 'USER',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
  },
  {
    id: 'usr-2',
    name: 'Namitha Narayanan',
    email: 'namitha.narayanan@ageslearningsolutions.com',
    role: 'Manager',
    accessLevel: 'ADMINISTRATOR',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@leadership.org',
    role: 'Leadership',
    accessLevel: 'ADMINISTRATOR',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@proficiotherapy.com',
    role: 'Specialist',
    accessLevel: 'USER',
    assignedDisciplines: ['Speech', 'OT'],
  },
  {
    id: 'usr-5',
    name: 'Elena Rostova',
    email: 'elena.rostova@childsplaytherapy.com',
    role: 'Specialist',
    accessLevel: 'USER',
    assignedDisciplines: ['ABA', 'Speech', 'OT'],
  },
  {
    id: 'usr-6',
    name: 'David Chen',
    email: 'david.chen@ageslearningsolutions.com',
    role: 'Operations',
    accessLevel: 'USER',
  },
];

export const INITIAL_LEGAL_ENTITIES: LegalEntity[] = [
  {
    id: 'ent-1',
    legalName: 'Ages Learning Solutions LLC',
    dba: 'AGES Learning Solutions',
    ein: '47-2891234',
    ownershipDetails: '100% Owned by AGES Healthcare Group Inc.',
    w9OnFile: true,
    w9Date: '2026-01-10',
    generalLiabilityPolicy: 'GL-982341-C',
    generalLiabilityExpiry: '2027-02-01',
    workersCompPolicy: 'WC-48201-CA',
    workersCompExpiry: '2027-03-15',
    primaryContact: 'Namitha Narayanan',
    email: 'credentialing@ageslearningsolutions.com',
    phone: '(408) 555-0192',
    address: '2105 S Bascom Ave, Suite 150, San Jose, CA 95124',
    active: true,
  },
  
  {
    id: 'ent-pstg-inc',
    legalName: 'Proficio Speech Therapy Group, INC.',
    dba: 'Proficio Speech Therapy Group',
    ein: '821221807',
    npiType2: '1083140560',
    taxonomy: '235Z00000X',
    ownershipDetails: 'Proficio Speech Therapy Group, Inc.',
    w9OnFile: true,
    w9Date: '2026-01-15',
    generalLiabilityPolicy: 'GL-821221-PSTG',
    generalLiabilityExpiry: '2027-04-30',
    workersCompPolicy: 'WC-82122-CA',
    workersCompExpiry: '2027-04-30',
    primaryContact: 'Administrative Director',
    email: 'info@proficiotherapy.com',
    phone: '(925) 315-4024',
    address: '1005 WESTCHESTER CT, FAIRFIELD, CA 94533-9775, United States',
    active: true,
  },
  {
    id: 'ent-3',
    legalName: "Child's Play Therapy Services PC",
    dba: "Child's Play Therapy",
    ein: '94-3321876',
    ownershipDetails: 'Clinical Services Partnership',
    w9OnFile: true,
    w9Date: '2025-12-20',
    generalLiabilityPolicy: 'GL-334190-CP',
    generalLiabilityExpiry: '2026-11-30',
    workersCompPolicy: 'WC-88412-CA',
    workersCompExpiry: '2026-11-30',
    primaryContact: 'Clinical Director',
    email: 'info@childsplaytherapyservices.com',
    phone: '(925) 555-0188',
    address: '8440 Brentwood Blvd, Suite C, Brentwood, CA 94513',
    active: true,
  },
];

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    name: 'Livermore Clinic',
    locationType: 'Physical Clinic',
    address: '1220 Airway Blvd, Suite 200',
    city: 'Livermore',
    state: 'CA',
    zip: '94551',
    phone: '(925) 447-2000',
    entityId: 'ent-pstg-inc',
    dba: 'Proficio Speech Therapy Group',
    serviceTypes: ['In-Clinic', 'In-Home', 'In-School', 'Telehealth'],
    payerApplicability: ['All'],
    leaseAgreementStatus: 'Active',
    leaseExpiryDate: '2028-06-30',
    effectiveDate: '2022-04-01',
    paveStatus: 'Approved',
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved',
    countiesServed: ['Alameda', 'Contra Costa'],
    serviceRadiusMiles: 25,
    active: true,
  },
  {
    id: 'loc-2',
    name: 'Brentwood Center',
    locationType: 'Physical Clinic',
    address: '8440 Brentwood Blvd, Suite C',
    city: 'Brentwood',
    state: 'CA',
    zip: '94513',
    phone: '(925) 634-1120',
    entityId: 'ent-3',
    dba: "Child's Play Therapy",
    serviceTypes: ['In-Clinic', 'In-Home', 'Telehealth'],
    payerApplicability: ['All'],
    leaseAgreementStatus: 'Active',
    leaseExpiryDate: '2027-12-31',
    effectiveDate: '2023-01-15',
    paveStatus: 'Approved',
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved',
    countiesServed: ['Contra Costa', 'San Joaquin'],
    serviceRadiusMiles: 30,
    active: true,
  },
  {
    id: 'loc-3',
    name: 'San Jose Headquarters & Clinical Center',
    locationType: 'Physical Clinic',
    address: '2105 S Bascom Ave, Suite 150',
    city: 'San Jose',
    state: 'CA',
    zip: '95124',
    phone: '(408) 559-8800',
    entityId: 'ent-1',
    dba: 'AGES Learning Solutions',
    serviceTypes: ['In-Clinic', 'In-Home', 'In-School', 'Telehealth'],
    payerApplicability: ['All'],
    leaseAgreementStatus: 'Active',
    leaseExpiryDate: '2029-08-31',
    effectiveDate: '2021-08-01',
    paveStatus: 'Approved',
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved',
    countiesServed: ['Santa Clara', 'San Mateo', 'Santa Cruz'],
    serviceRadiusMiles: 35,
    active: true,
  },
  {
    id: 'loc-4',
    name: 'Vacaville Satellite Clinic',
    locationType: 'Satellite',
    address: '750 Mason St, Suite 102',
    city: 'Vacaville',
    state: 'CA',
    zip: '95687',
    phone: '(707) 449-3300',
    entityId: 'ent-1',
    dba: 'AGES Learning Solutions',
    serviceTypes: ['In-Clinic', 'In-Home', 'Telehealth'],
    payerApplicability: ['All'],
    leaseAgreementStatus: 'Active',
    leaseExpiryDate: '2027-09-30',
    effectiveDate: '2024-03-01',
    paveStatus: 'Approved',
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved',
    countiesServed: ['Solano', 'Yolo', 'Napa'],
    serviceRadiusMiles: 30,
    active: true,
  },
  {
    id: 'loc-5',
    name: 'South Jordan Center',
    locationType: 'Physical Clinic',
    address: '10984 S Jordan Gateway, Suite 400',
    city: 'South Jordan',
    state: 'UT',
    zip: '84095',
    phone: '(801) 876-5400',
    entityId: 'ent-1',
    dba: 'AGES Learning Solutions Utah',
    serviceTypes: ['In-Clinic', 'In-Home', 'Telehealth'],
    payerApplicability: ['All'],
    leaseAgreementStatus: 'Active',
    leaseExpiryDate: '2028-11-30',
    effectiveDate: '2024-10-01',
    paveStatus: 'Not Required',
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved',
    countiesServed: ['Salt Lake', 'Utah County', 'Davis'],
    serviceRadiusMiles: 40,
    active: true,
  },
  {
    id: 'loc-inhome-bayarea',
    name: 'Northern California In-Home & Community Delivery',
    locationType: 'In-Home / Mobile',
    address: 'Mobile & Community Service Delivery Network',
    city: 'San Jose',
    state: 'CA',
    zip: '95124',
    phone: '(408) 559-8850',
    entityId: 'ent-1',
    dba: 'AGES In-Home Services',
    serviceTypes: ['In-Home', 'Telehealth'],
    payerApplicability: ['All'],
    leaseAgreementStatus: 'Not Applicable',
    leaseExpiryDate: '',
    effectiveDate: '2021-01-01',
    paveStatus: 'Approved',
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved',
    countiesServed: ['Santa Clara', 'San Mateo', 'Alameda', 'Contra Costa', 'San Francisco'],
    serviceRadiusMiles: 60,
    notes: 'Home-based therapy delivery network across the greater San Francisco Bay Area and Silicon Valley.',
    active: true,
  },
  {
    id: 'loc-inhome-eastbay',
    name: 'East Bay & Tri-Valley In-Home Therapy Network',
    locationType: 'In-Home / Mobile',
    address: 'Mobile & In-Home Practice Coverage (Tri-Valley Region)',
    city: 'Livermore',
    state: 'CA',
    zip: '94551',
    phone: '(925) 447-2050',
    entityId: 'ent-pts-llc',
    dba: 'Proficio Therapy Services',
    serviceTypes: ['In-Home', 'Telehealth'],
    payerApplicability: ['All'],
    leaseAgreementStatus: 'Not Applicable',
    leaseExpiryDate: '',
    effectiveDate: '2022-06-01',
    paveStatus: 'Approved',
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved',
    countiesServed: ['Alameda', 'Contra Costa', 'San Joaquin'],
    serviceRadiusMiles: 45,
    notes: 'In-home speech and pediatric therapy delivery network for East Bay and Central Valley families.',
    active: true,
  },
];

export const INITIAL_PAYERS: Payer[] = [
  {
    id: 'pyr-aetna',
    name: 'Aetna',
    type: 'Commercial',
    portalUrl: 'https://www.availity.com',
    statesServed: ['CA', 'UT', 'Nationwide'],
    contacts: [{ id: 'c-1', name: 'James Martinez', role: 'Network Manager', email: 'martinezj@aetna.com', phone: '(800) 624-0756' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'Curriculum Vitae (CV)', 'Board Certification'],
    requiredFields: ['NPI', 'CAQH ID', 'Taxonomy', 'Practice Location'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Availity',
    active: true,
  },
  {
    id: 'pyr-anthem',
    name: 'Anthem',
    type: 'Commercial',
    portalUrl: 'https://www.availity.com',
    statesServed: ['CA', 'Nationwide'],
    contacts: [{ id: 'c-2', name: 'Lisa Ray', role: 'Credentialing Lead', email: 'lisa.ray@anthem.com', phone: '(888) 254-2721' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'CV', 'Attestation Form'],
    requiredFields: ['NPI', 'CAQH ID', 'Effective Date', 'Group Tax ID'],
    averageTatDays: 75,
    followUpCadenceDays: 10,
    submissionMethod: 'Availity',
    active: true,
  },
  {
    id: 'pyr-bsc',
    name: 'Blue Shield of California',
    type: 'Commercial',
    portalUrl: 'https://www.blueshieldca.com/provider',
    statesServed: ['CA'],
    contacts: [{ id: 'c-3', name: 'Robert Kim', role: 'Provider Relations Rep', email: 'robert.kim@blueshieldca.com', phone: '(800) 258-3091' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'CAQH Release', 'Roster Sheet'],
    requiredFields: ['NPI', 'CAQH ID', 'DBA', 'Service Location'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-cigna',
    name: 'Cigna',
    type: 'Commercial',
    portalUrl: 'https://cignaforhcp.cigna.com',
    statesServed: ['CA', 'UT', 'Nationwide'],
    contacts: [{ id: 'c-4', name: 'Amber Davis', role: 'Credentialing Analyst', email: 'amber.davis@cigna.com', phone: '(800) 882-4462' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'Board Certification'],
    requiredFields: ['NPI', 'CAQH ID', 'Tax ID'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-uhc',
    name: 'UnitedHealthcare (UHC)',
    type: 'Commercial',
    portalUrl: 'https://www.uhcprovider.com',
    statesServed: ['CA', 'UT', 'Nationwide'],
    contacts: [{ id: 'c-5', name: 'Michael Scott', role: 'Network Manager', email: 'm_scott@uhc.com', phone: '(877) 842-3210' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'Optum Behavioral Roster'],
    requiredFields: ['NPI', 'CAQH ID', 'Group Taxonomy'],
    averageTatDays: 65,
    followUpCadenceDays: 10,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-vhp',
    name: 'VHP (Valley Health Plan)',
    type: 'Regional',
    portalUrl: 'https://www.valleyhealthplan.org/providers',
    statesServed: ['CA (Santa Clara County)'],
    contacts: [{ id: 'c-6', name: 'Maria Santos', role: 'Credentialing Specialist', email: 'maria.santos@vhp.sccgov.org', phone: '(408) 885-3560' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'VHP Enrollment App', 'Lease Agreement'],
    requiredFields: ['NPI', 'Local Service Address', 'Medi-Cal PIN / NPI'],
    averageTatDays: 45,
    followUpCadenceDays: 7,
    submissionMethod: 'Email',
    active: true,
  },
  {
    id: 'pyr-alameda',
    name: 'Alameda Alliance',
    type: 'Regional / Medicaid',
    portalUrl: 'https://www.alamedaalliance.org',
    statesServed: ['CA (Alameda County)'],
    contacts: [{ id: 'c-7', name: 'Tanya Gomez', role: 'Provider Enrollment Lead', email: 'tgomez@alamedaalliance.org', phone: '(510) 747-4500' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'PAVE Proof of Enrollment', 'DHCS Welcome Letter'],
    requiredFields: ['NPI', 'PAVE Enrollment #', 'CAQH ID', 'Service Address'],
    averageTatDays: 90,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-cchp',
    name: 'CCHP (Chinese Community Health Plan)',
    type: 'Regional / Medicaid',
    portalUrl: 'https://www.cchphealthplan.com',
    statesServed: ['CA (San Francisco / San Mateo)'],
    contacts: [{ id: 'c-8', name: 'Wai Ling', role: 'Contracting Manager', email: 'wling@cchphealthplan.com', phone: '(415) 834-2100' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'CCHP Provider Packet'],
    requiredFields: ['NPI', 'CAQH ID', 'Bilingual Competency Details'],
    averageTatDays: 60,
    followUpCadenceDays: 10,
    submissionMethod: 'Email',
    active: true,
  },
  {
    id: 'pyr-scfhp',
    name: 'SCFHP (Santa Clara Family Health Plan)',
    type: 'Regional / Medicaid',
    portalUrl: 'https://www.scfhp.com',
    statesServed: ['CA (Santa Clara County)'],
    contacts: [{ id: 'c-9', name: 'Carlos Mendez', role: 'Credentialing Coordinator', email: 'cmendez@scfhp.com', phone: '(408) 874-1788' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'PAVE Approval', 'Board Cert'],
    requiredFields: ['NPI', 'PAVE Approval Number', 'Group NPI'],
    averageTatDays: 75,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-hpsm',
    name: 'HPSM (Health Plan of San Mateo)',
    type: 'Regional / Medicaid',
    portalUrl: 'https://www.hpsm.org',
    statesServed: ['CA (San Mateo County)'],
    contacts: [{ id: 'c-10', name: 'Jennifer Wong', role: 'Provider Network Liaison', email: 'jennifer.wong@hpsm.org', phone: '(650) 616-2106' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'PAVE Enrollment Verification'],
    requiredFields: ['NPI', 'CAQH ID', 'Medi-Cal Status'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-php',
    name: 'PHP (Physicians Health Plan)',
    type: 'Regional',
    portalUrl: 'https://www.phpmichigan.com',
    statesServed: ['CA', 'Regional'],
    contacts: [{ id: 'c-11', name: 'Kevin Brown', role: 'Provider Services', email: 'kbrown@php.org', phone: '(800) 832-9186' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'CV'],
    requiredFields: ['NPI', 'CAQH ID'],
    averageTatDays: 45,
    followUpCadenceDays: 10,
    submissionMethod: 'Email',
    active: true,
  },
  {
    id: 'pyr-molina',
    name: 'Molina',
    type: 'Medicaid / Commercial',
    portalUrl: 'https://provider.molinahealthcare.com',
    statesServed: ['CA', 'UT', 'Nationwide'],
    contacts: [{ id: 'c-12', name: 'Patricia Ramos', role: 'Medicaid Credentialing Rep', email: 'patricia.ramos@molinahealthcare.com', phone: '(888) 562-5442' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'PAVE Verification', 'Molina Roster'],
    requiredFields: ['NPI', 'PAVE Application ID', 'CAQH ID', 'Group Tax ID'],
    averageTatDays: 90,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-triwest',
    name: 'TriWest',
    type: 'Government',
    portalUrl: 'https://www.triwest.com/provider',
    statesServed: ['CA', 'UT', 'West Region'],
    contacts: [{ id: 'c-13', name: 'Capt. Thomas Miller', role: 'VA Network Specialist', email: 'tmiller@triwest.com', phone: '(877) 226-8349' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'Military Cultural Competence Cert', 'CV'],
    requiredFields: ['NPI', 'CAQH ID', 'Federal Exclusion Check Proof'],
    averageTatDays: 90,
    followUpCadenceDays: 10,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-preferred',
    name: 'Preferred Therapy',
    type: 'Network',
    portalUrl: 'https://www.preferredtherapy.com',
    statesServed: ['CA', 'UT'],
    contacts: [{ id: 'c-14', name: 'Amanda Hall', role: 'Network Coordinator', email: 'ahall@preferredtherapy.com', phone: '(800) 664-5240' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI'],
    requiredFields: ['NPI', 'Therapy Disciplines'],
    averageTatDays: 30,
    followUpCadenceDays: 7,
    submissionMethod: 'Email',
    active: true,
  },
  {
    id: 'pyr-utmedicaid',
    name: 'Utah Medicaid',
    type: 'Medicaid',
    portalUrl: 'https://medicaid.utah.gov/provider-portal',
    statesServed: ['UT'],
    contacts: [{ id: 'c-15', name: 'Bradley Young', role: 'Utah PRISM Enrollment Specialist', email: 'byoung@utah.gov', phone: '(801) 538-6155' }],
    requiredDocuments: ['Utah State License', 'W-9 Form', 'Malpractice Insurance / COI', 'PRISM Provider Agreement', 'Fingerprinting Card'],
    requiredFields: ['NPI', 'PRISM System ID', 'Utah Taxonomy 103K00000X'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-regenceut',
    name: 'Regence Utah',
    type: 'Commercial',
    portalUrl: 'https://www.regence.com/provider',
    statesServed: ['UT'],
    contacts: [{ id: 'c-16', name: 'Emily Clark', role: 'Commercial Network Specialist', email: 'emily.clark@regence.com', phone: '(800) 253-0838' }],
    requiredDocuments: ['Utah State License', 'W-9 Form', 'Malpractice Insurance / COI', 'CAQH Profile Attestation'],
    requiredFields: ['NPI', 'CAQH ID', 'Group Tax ID'],
    averageTatDays: 45,
    followUpCadenceDays: 7,
    submissionMethod: 'Availity',
    active: true,
  },
  {
    id: 'pyr-ccs',
    name: 'CCS (California Children\'s Services)',
    type: 'State program',
    portalUrl: 'https://www.dhcs.ca.gov/services/ccs',
    statesServed: ['CA'],
    contacts: [{ id: 'c-17', name: 'Dr. Rebecca Stern', role: 'CCS Panel Coordinator', email: 'rebecca.stern@dhcs.ca.gov', phone: '(916) 552-9105' }],
    requiredDocuments: ['California License', 'Pediatric Clinical References (3)', 'Hospital Privileges / Clinic Affiliation', 'Case Logs', 'CV', 'Board Certification'],
    requiredFields: ['NPI', 'Pediatric Experience Hours', 'CCS Facility Number'],
    averageTatDays: 90,
    followUpCadenceDays: 14,
    submissionMethod: 'Mail',
    active: true,
  },
  {
    id: 'pyr-ash',
    name: 'ASH (American Specialty Health)',
    type: 'Network',
    portalUrl: 'https://www.ashlink.com',
    statesServed: ['CA', 'UT', 'Nationwide'],
    contacts: [{ id: 'c-18', name: 'Brian Kelly', role: 'Credentialing Manager', email: 'brian.kelly@ashn.com', phone: '(800) 972-4226' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'ASH Practitioner App'],
    requiredFields: ['NPI', 'CAQH ID', 'Specialty'],
    averageTatDays: 45,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-hill',
    name: 'Hill Physicians',
    type: 'Network',
    portalUrl: 'https://www.hillphysicians.com/providers',
    statesServed: ['CA (Bay Area, Sacramento)'],
    contacts: [{ id: 'c-19', name: 'Megan Foster', role: 'Allied Health Network Rep', email: 'megan.foster@hpmg.com', phone: '(800) 445-5647' }],
    requiredDocuments: ['State License', 'W-9 Form', 'Malpractice Insurance / COI', 'Hill Physicians IPA Application'],
    requiredFields: ['NPI', 'CAQH ID', 'Supervising Physician (if applicable)'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-catalight',
    name: 'Catalight (Easterseals / Behavioral Health)',
    type: 'Network',
    portalUrl: 'https://www.catalight.org/providers',
    statesServed: ['CA', 'Nationwide'],
    contacts: [{ id: 'c-20', name: 'Rachel Green', role: 'Network Relations Lead', email: 'rachel.green@catalight.org', phone: '(800) 843-3725' }],
    requiredDocuments: ['BCBA Board Cert', 'State License', 'W-9 Form', 'Malpractice Insurance / COI', 'Catalight Roster Form'],
    requiredFields: ['BACB Certification #', 'NPI', 'CAQH ID', 'Service Area Zip Codes'],
    averageTatDays: 30,
    followUpCadenceDays: 5,
    submissionMethod: 'Online Portal',
    active: true,
  },
  {
    id: 'pyr-magellan',
    name: 'Magellan Healthcare',
    type: 'Commercial',
    portalUrl: 'https://www.magellanprovider.com',
    statesServed: ['CA', 'UT', 'Nationwide'],
    contacts: [{ id: 'c-21', name: 'Magellan Provider Relations', role: 'Network Specialist', email: 'providerrelations@magellanhealth.com', phone: '(800) 788-4005' }],
    requiredDocuments: ['BCBA Certification', 'State License', 'W-9 Form', 'COI'],
    requiredFields: ['NPI', 'CAQH ID', 'Tax ID'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    requiresCaqh: true,
    active: true,
  },
  {
    id: 'pyr-selecthealth',
    name: 'SelectHealth',
    type: 'Regional',
    portalUrl: 'https://selecthealth.org/providers',
    statesServed: ['UT', 'ID', 'NV'],
    contacts: [{ id: 'c-22', name: 'SelectHealth Provider Operations', role: 'Credentialing Lead', email: 'provider.relations@selecthealth.org', phone: '(800) 538-5038' }],
    requiredDocuments: ['Utah State License', 'BCBA Certification', 'W-9 Form', 'COI', 'CAQH Release'],
    requiredFields: ['NPI', 'CAQH ID', 'Utah DOPL License #'],
    averageTatDays: 60,
    followUpCadenceDays: 10,
    submissionMethod: 'Online Portal',
    requiresCaqh: true,
    active: true,
  },
  {
    id: 'pyr-ubh',
    name: 'UBH (United Behavioral Health / Optum)',
    type: 'Commercial',
    portalUrl: 'https://www.providerexpress.com',
    statesServed: ['CA', 'UT', 'Nationwide'],
    contacts: [{ id: 'c-23', name: 'Optum Provider Services', role: 'Network Liaison', email: 'network@providerexpress.com', phone: '(877) 614-0484' }],
    requiredDocuments: ['State License', 'BCBA Certification', 'W-9 Form', 'COI'],
    requiredFields: ['NPI', 'CAQH ID', 'Group Taxonomy'],
    averageTatDays: 65,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    requiresCaqh: true,
    active: true,
  },
  {
    id: 'pyr-tricare',
    name: 'Tricare (West Region / HNFS)',
    type: 'Tricare / Military',
    portalUrl: 'https://www.tricare-west.com',
    statesServed: ['CA', 'UT', 'West Region'],
    contacts: [{ id: 'c-24', name: 'Tricare West Network Operations', role: 'Military Network Specialist', email: 'providermgmt@hnfs.com', phone: '(844) 866-9378' }],
    requiredDocuments: ['State License', 'BCBA Board Cert', 'W-9 Form', 'COI', 'Military Cultural Competency'],
    requiredFields: ['NPI', 'CAQH ID', 'Federal Exclusion Check'],
    averageTatDays: 75,
    followUpCadenceDays: 10,
    submissionMethod: 'Online Portal',
    requiresCaqh: true,
    active: true,
  },
  {
    id: 'pyr-medical',
    name: 'Medi-Cal (DHCS)',
    type: 'Medicaid',
    portalUrl: 'https://pave.dhcs.ca.gov',
    statesServed: ['CA'],
    contacts: [{ id: 'c-25', name: 'DHCS Provider Enrollment Division', role: 'PAVE Analyst', email: 'pedhelp@dhcs.ca.gov', phone: '(916) 323-1945' }],
    requiredDocuments: ['State License', 'BCBA Certificate', 'PAVE Application', 'W-9 Form', 'COI'],
    requiredFields: ['NPI', 'PAVE Application ID', 'Medi-Cal PIN'],
    averageTatDays: 90,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    requiresPave: true,
    requiresCaqh: true,
    active: true,
  },
  {
    id: 'pyr-anthem-medical',
    name: 'Anthem Medi-Cal',
    type: 'Medicaid Managed Care',
    portalUrl: 'https://providers.anthem.com/california-provider',
    statesServed: ['CA'],
    contacts: [{ id: 'c-26', name: 'Anthem Medi-Cal Contracting', role: 'Credentialing Lead', email: 'ca.credentialing@anthem.com', phone: '(800) 407-4627' }],
    requiredDocuments: ['State License', 'PAVE Verification', 'W-9 Form', 'COI', 'CAQH Release'],
    requiredFields: ['NPI', 'PAVE Enrollment #', 'CAQH ID'],
    averageTatDays: 75,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    requiresPave: true,
    requiresCaqh: true,
    active: true,
  },
  {
    id: 'pyr-contra-costa',
    name: 'Contra Costa Health Plan (CCHP)',
    type: 'Regional / Medicaid',
    portalUrl: 'https://www.contracostahealthplan.org',
    statesServed: ['CA (Contra Costa County)'],
    contacts: [{ id: 'c-27', name: 'CCHP Provider Relations', role: 'Network Analyst', email: 'cchp.providerrelations@cchealth.org', phone: '(877) 661-6230' }],
    requiredDocuments: ['State License', 'W-9 Form', 'COI', 'Contra Costa Roster'],
    requiredFields: ['NPI', 'CAQH ID', 'Service Address'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    requiresCaqh: true,
    active: true,
  },
  {
    id: 'pyr-partnership',
    name: 'Partnership HealthPlan of California',
    type: 'Regional / Medicaid',
    portalUrl: 'https://www.partnershiphp.org',
    statesServed: ['CA (Northern California)'],
    contacts: [{ id: 'c-28', name: 'Partnership Credentialing', role: 'Enrollment Manager', email: 'credentialing@partnershiphp.org', phone: '(707) 863-4100' }],
    requiredDocuments: ['State License', 'PAVE Proof of Enrollment', 'W-9 Form', 'COI'],
    requiredFields: ['NPI', 'PAVE Number', 'CAQH ID'],
    averageTatDays: 75,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    requiresPave: true,
    requiresCaqh: true,
    active: true,
  },
  {
    id: 'pyr-carelon',
    name: 'Carelon Behavioral Health',
    type: 'Commercial',
    portalUrl: 'https://www.carelonbehavioralhealth.com',
    statesServed: ['CA', 'UT', 'Nationwide'],
    contacts: [{ id: 'c-29', name: 'Carelon Provider Relations', role: 'Behavioral Health Specialist', email: 'provider.relations@carelon.com', phone: '(800) 397-1630' }],
    requiredDocuments: ['BCBA Certification', 'State License', 'W-9 Form', 'COI', 'Attestation'],
    requiredFields: ['NPI', 'CAQH ID', 'Group Tax ID'],
    averageTatDays: 60,
    followUpCadenceDays: 7,
    submissionMethod: 'Online Portal',
    requiresCaqh: true,
    active: true,
  },
];

// Production Providers Database (loaded dynamically from Supabase / Cloud database)
export const INITIAL_PROVIDERS: Provider[] = [
  {
    "id": "prv-ages-rbt-anthony-flores",
    "firstName": "Anthony",
    "lastName": "Flores",
    "fullName": "Anthony Flores",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "anthony.flores@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1205638822",
    "licenseNumber": "RBT-24-388462",
    "licenseState": "CA",
    "licenseExpiration": "2026-10-27",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-24-388462",
    "rbtEffectiveDate": "2024-10-27",
    "rbtExpiryDate": "2026-10-27",
    "role": "PS",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-10-27",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-24-388462",
      "rbtEffectiveDate": "2024-10-27",
      "rbtExpiryDate": "2026-10-27",
      "role": "PS",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-cynthia-hernandez-ambriz",
    "firstName": "Cynthia",
    "lastName": "Hernandez Ambriz",
    "fullName": "Cynthia Hernandez Ambriz",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "cynthia.hernandezambriz@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1063047710",
    "licenseNumber": "RBT-20-126437",
    "licenseState": "CA",
    "licenseExpiration": "2025-06-30",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-20-126437",
    "rbtEffectiveDate": "2020-06-30",
    "rbtExpiryDate": "2025-06-30",
    "role": "PS",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2020-06-30",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-20-126437",
      "rbtEffectiveDate": "2020-06-30",
      "rbtExpiryDate": "2025-06-30",
      "role": "PS",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-leslie-loi",
    "firstName": "Leslie",
    "lastName": "Loi",
    "fullName": "Leslie Loi",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "leslie.loi@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1255047510",
    "licenseNumber": "RBT-23-265638",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-28",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-23-265638",
    "rbtEffectiveDate": "2023-03-28",
    "rbtExpiryDate": "2028-03-28",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-03-28",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-23-265638",
      "rbtEffectiveDate": "2023-03-28",
      "rbtExpiryDate": "2028-03-28",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-meliya-norton",
    "firstName": "Meliya",
    "lastName": "Norton",
    "fullName": "Meliya Norton",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "meliya.norton@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1881375228",
    "licenseNumber": "RBT-25-428447",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-15",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-25-428447",
    "rbtEffectiveDate": "2025-04-15",
    "rbtExpiryDate": "2028-04-15",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-04-15",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-428447",
      "rbtEffectiveDate": "2025-04-15",
      "rbtExpiryDate": "2028-04-15",
      "role": "RBT",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-pilar-moreno",
    "firstName": "Pilar",
    "lastName": "Moreno",
    "fullName": "Pilar Moreno",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "pilar.moreno@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1053171215",
    "licenseNumber": "RBT-24-362804",
    "licenseState": "CA",
    "licenseExpiration": "2026-07-18",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-24-362804",
    "rbtEffectiveDate": "2024-07-18",
    "rbtExpiryDate": "2026-07-18",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-07-18",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-24-362804",
      "rbtEffectiveDate": "2024-07-18",
      "rbtExpiryDate": "2026-07-18",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-marla-martinez",
    "firstName": "Marla",
    "lastName": "Martinez",
    "fullName": "Marla Martinez",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "marla.martinez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1154188175",
    "licenseNumber": "RBT-25-437472",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-18",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-25-437472",
    "rbtEffectiveDate": "2025-05-18",
    "rbtExpiryDate": "2028-05-18",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-05-18",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-437472",
      "rbtEffectiveDate": "2025-05-18",
      "rbtExpiryDate": "2028-05-18",
      "role": "RBT",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-lena-vidana",
    "firstName": "Lena",
    "lastName": "Vidana",
    "fullName": "Lena Vidana",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "lena.vidana@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1578193215",
    "licenseNumber": "RBT-25-454056",
    "licenseState": "CA",
    "licenseExpiration": "2026-07-16",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-25-454056",
    "rbtEffectiveDate": "2025-07-16",
    "rbtExpiryDate": "2026-07-16",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-07-16",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-454056",
      "rbtEffectiveDate": "2025-07-16",
      "rbtExpiryDate": "2026-07-16",
      "role": "RBT",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-audrey-fenner",
    "firstName": "Audrey",
    "lastName": "Fenner",
    "fullName": "Audrey Fenner",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "audrey.fenner@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1275355679",
    "licenseNumber": "RBT-25-405099",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-11",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-25-405099",
    "rbtEffectiveDate": "2025-01-11",
    "rbtExpiryDate": "2028-01-11",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-01-11",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-405099",
      "rbtEffectiveDate": "2025-01-11",
      "rbtExpiryDate": "2028-01-11",
      "role": "RBT",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-nuha-ibrahim",
    "firstName": "Nuha",
    "lastName": "Ibrahim",
    "fullName": "Nuha Ibrahim",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "nuha.ibrahim@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1235943150",
    "licenseNumber": "RBT-25-463593",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-15",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-463593",
    "rbtEffectiveDate": "2025-08-15",
    "rbtExpiryDate": "2026-08-15",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-08-15",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-463593",
      "rbtEffectiveDate": "2025-08-15",
      "rbtExpiryDate": "2026-08-15",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-tochi-ezeife",
    "firstName": "Tochi",
    "lastName": "Ezeife",
    "fullName": "Tochi Ezeife",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "tochi.ezeife@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1992576417",
    "licenseNumber": "RBT-25-501919",
    "licenseState": "CA",
    "licenseExpiration": "2026-12-19",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-501919",
    "rbtEffectiveDate": "2025-12-19",
    "rbtExpiryDate": "2026-12-19",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-12-19",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-501919",
      "rbtEffectiveDate": "2025-12-19",
      "rbtExpiryDate": "2026-12-19",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-gabriel-lopez",
    "firstName": "Gabriel",
    "lastName": "Lopez",
    "fullName": "Gabriel Lopez",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "gabriel.lopez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1477264455",
    "licenseNumber": "RBT-23-281159",
    "licenseState": "CA",
    "licenseExpiration": "2026-06-24",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-23-281159",
    "rbtEffectiveDate": "2023-06-24",
    "rbtExpiryDate": "2026-06-24",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-24",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-23-281159",
      "rbtEffectiveDate": "2023-06-24",
      "rbtExpiryDate": "2026-06-24",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-elizabeth-vega",
    "firstName": "Elizabeth",
    "lastName": "Vega",
    "fullName": "Elizabeth Vega",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "elizabeth.vega@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1114863263",
    "licenseNumber": "RBT-25-479211",
    "licenseState": "CA",
    "licenseExpiration": "2026-10-05",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-479211",
    "rbtEffectiveDate": "2025-10-05",
    "rbtExpiryDate": "2026-10-05",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-10-05",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-479211",
      "rbtEffectiveDate": "2025-10-05",
      "rbtExpiryDate": "2026-10-05",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-aditi-kamboj",
    "firstName": "Aditi",
    "lastName": "Kamboj",
    "fullName": "Aditi Kamboj",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "aditi.kamboj@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-26-536374",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-10",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-26-536374",
    "rbtEffectiveDate": "2026-05-09",
    "rbtExpiryDate": "2028-05-10",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2026-05-09",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-26-536374",
      "rbtEffectiveDate": "2026-05-09",
      "rbtExpiryDate": "2028-05-10",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-ana-reyes-acosta",
    "firstName": "Ana",
    "lastName": "Reyes Acosta",
    "fullName": "Ana Reyes Acosta",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "ana.reyesacosta@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-23-313943",
    "licenseState": "CA",
    "licenseExpiration": "2026-11-30",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-23-313943",
    "rbtEffectiveDate": "2023-11-30",
    "rbtExpiryDate": "2026-11-30",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-11-30",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-23-313943",
      "rbtEffectiveDate": "2023-11-30",
      "rbtExpiryDate": "2026-11-30",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-caitlin-scheuer",
    "firstName": "Caitlin",
    "lastName": "Scheuer",
    "fullName": "Caitlin Scheuer",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "caitlin.scheuer@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-22-214435",
    "licenseState": "UT",
    "licenseExpiration": "2028-05-01",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-22-214435",
    "rbtEffectiveDate": "2022-05-01",
    "rbtExpiryDate": "2028-05-01",
    "role": "PS",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-05-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-22-214435",
      "rbtEffectiveDate": "2022-05-01",
      "rbtExpiryDate": "2028-05-01",
      "role": "PS",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-camary-davis",
    "firstName": "Camary",
    "lastName": "Davis",
    "fullName": "Camary Davis",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "camary.davis@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-490438",
    "licenseState": "UT",
    "licenseExpiration": "2026-11-11",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-25-490438",
    "rbtEffectiveDate": "2025-11-11",
    "rbtExpiryDate": "2026-11-11",
    "role": "RBT",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-11-11",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-490438",
      "rbtEffectiveDate": "2025-11-11",
      "rbtExpiryDate": "2026-11-11",
      "role": "RBT",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-camille-andes",
    "firstName": "Camille",
    "lastName": "Andes",
    "fullName": "Camille Andes",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "camille.andes@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-416629",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-05",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-416629",
    "rbtEffectiveDate": "2025-03-05",
    "rbtExpiryDate": "2028-03-05",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-03-05",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-416629",
      "rbtEffectiveDate": "2025-03-05",
      "rbtExpiryDate": "2028-03-05",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-claudia-cruz",
    "firstName": "Claudia",
    "lastName": "Cruz",
    "fullName": "Claudia Cruz",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "claudia.cruz@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-22-210211",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-03",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-22-210211",
    "rbtEffectiveDate": "2022-04-03",
    "rbtExpiryDate": "2028-04-03",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-04-03",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-22-210211",
      "rbtEffectiveDate": "2022-04-03",
      "rbtExpiryDate": "2028-04-03",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-colton-hudson",
    "firstName": "Colton",
    "lastName": "Hudson",
    "fullName": "Colton Hudson",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "colton.hudson@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-482417",
    "licenseState": "CA",
    "licenseExpiration": "2026-10-16",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-25-482417",
    "rbtEffectiveDate": "2025-10-16",
    "rbtExpiryDate": "2026-10-16",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-10-16",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-482417",
      "rbtEffectiveDate": "2025-10-16",
      "rbtExpiryDate": "2026-10-16",
      "role": "RBT",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-holly-uibel",
    "firstName": "Holly",
    "lastName": "Uibel",
    "fullName": "Holly Uibel",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "holly.uibel@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-21-171020",
    "licenseState": "UT",
    "licenseExpiration": "2028-06-07",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-21-171020",
    "rbtEffectiveDate": "2021-06-07",
    "rbtExpiryDate": "2028-06-07",
    "role": "RBT",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-06-07",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-21-171020",
      "rbtEffectiveDate": "2021-06-07",
      "rbtExpiryDate": "2028-06-07",
      "role": "RBT",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-isabel-white",
    "firstName": "Isabel",
    "lastName": "White",
    "fullName": "Isabel White",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "isabel.white@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-22-200665",
    "licenseState": "UT",
    "licenseExpiration": "2028-01-21",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-22-200665",
    "rbtEffectiveDate": "2022-01-21",
    "rbtExpiryDate": "2028-01-21",
    "role": "RBT",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-01-21",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-22-200665",
      "rbtEffectiveDate": "2022-01-21",
      "rbtExpiryDate": "2028-01-21",
      "role": "RBT",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-isabella-phan",
    "firstName": "Isabella",
    "lastName": "Phan",
    "fullName": "Isabella Phan",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "isabella.phan@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-438501",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-22",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-438501",
    "rbtEffectiveDate": "2025-05-22",
    "rbtExpiryDate": "2028-05-22",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-05-22",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-438501",
      "rbtEffectiveDate": "2025-05-22",
      "rbtExpiryDate": "2028-05-22",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-jacqlynn-uribe",
    "firstName": "Jacqlynn",
    "lastName": "Uribe",
    "fullName": "Jacqlynn Uribe",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "jacqlynn.uribe@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-26-523943",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-22",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-26-523943",
    "rbtEffectiveDate": "2026-03-22",
    "rbtExpiryDate": "2028-03-22",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2026-03-22",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-26-523943",
      "rbtEffectiveDate": "2026-03-22",
      "rbtExpiryDate": "2028-03-22",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-jasmine-espinoza",
    "firstName": "Jasmine",
    "lastName": "Espinoza",
    "fullName": "Jasmine Espinoza",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "jasmine.espinoza@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-23-279622",
    "licenseState": "CA",
    "licenseExpiration": "2028-06-16",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-23-279622",
    "rbtEffectiveDate": "2023-06-16",
    "rbtExpiryDate": "2028-06-16",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-16",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-23-279622",
      "rbtEffectiveDate": "2023-06-16",
      "rbtExpiryDate": "2028-06-16",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-jaspreet-kaur",
    "firstName": "Jaspreet",
    "lastName": "Kaur",
    "fullName": "Jaspreet Kaur",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "jaspreet.kaur@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-jaspreet-kaur",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-jazmine-tostado",
    "firstName": "Jazmine",
    "lastName": "Tostado",
    "fullName": "Jazmine Tostado",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "jazmine.tostado@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-24-396733",
    "licenseState": "CA",
    "licenseExpiration": "2025-12-01",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-24-396733",
    "rbtEffectiveDate": "2024-12-01",
    "rbtExpiryDate": "2025-12-01",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-12-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-24-396733",
      "rbtEffectiveDate": "2024-12-01",
      "rbtExpiryDate": "2025-12-01",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-jennifer-mislang",
    "firstName": "Jennifer",
    "lastName": "Mislang",
    "fullName": "Jennifer Mislang",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "jennifer.mislang@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-26-509051",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-18",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-26-509051",
    "rbtEffectiveDate": "2026-01-18",
    "rbtExpiryDate": "2028-01-18",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2026-01-18",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-26-509051",
      "rbtEffectiveDate": "2026-01-18",
      "rbtExpiryDate": "2028-01-18",
      "role": "RBT",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-jonathan-greene",
    "firstName": "Jonathan",
    "lastName": "Greene",
    "fullName": "Jonathan Greene",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "jonathan.greene@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-427903",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-11",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-427903",
    "rbtEffectiveDate": "2025-04-11",
    "rbtExpiryDate": "2028-04-11",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-04-11",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-427903",
      "rbtEffectiveDate": "2025-04-11",
      "rbtExpiryDate": "2028-04-11",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-juan-chavez",
    "firstName": "Juan",
    "lastName": "Chavez",
    "fullName": "Juan Chavez",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "juan.chavez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-juan-chavez",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-julianna-david",
    "firstName": "Julianna",
    "lastName": "David",
    "fullName": "Julianna David",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "julianna.david@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-483658",
    "licenseState": "CA",
    "licenseExpiration": "2026-10-18",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-25-483658",
    "rbtEffectiveDate": "2025-10-18",
    "rbtExpiryDate": "2026-10-18",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-10-18",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-483658",
      "rbtEffectiveDate": "2025-10-18",
      "rbtExpiryDate": "2026-10-18",
      "role": "RBT",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-kaitlin-djiusni",
    "firstName": "Kaitlin",
    "lastName": "Djiusni",
    "fullName": "Kaitlin Djiusni",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "kaitlin.djiusni@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-22-222375",
    "licenseState": "CA",
    "licenseExpiration": "2028-06-25",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-22-222375",
    "rbtEffectiveDate": "2022-06-25",
    "rbtExpiryDate": "2028-06-25",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-06-25",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-22-222375",
      "rbtEffectiveDate": "2022-06-25",
      "rbtExpiryDate": "2028-06-25",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-kyla-kersh",
    "firstName": "Kyla",
    "lastName": "Kersh",
    "fullName": "Kyla Kersh",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "kyla.kersh@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-23-267617",
    "licenseState": "UT",
    "licenseExpiration": "2028-04-07",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-23-267617",
    "rbtEffectiveDate": "2023-04-07",
    "rbtExpiryDate": "2028-04-07",
    "role": "RBT",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-04-07",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-23-267617",
      "rbtEffectiveDate": "2023-04-07",
      "rbtExpiryDate": "2028-04-07",
      "role": "RBT",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-lauren-krause",
    "firstName": "Lauren",
    "lastName": "Krause",
    "fullName": "Lauren Krause",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "lauren.krause@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-502608",
    "licenseState": "UT",
    "licenseExpiration": "2026-12-22",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-25-502608",
    "rbtEffectiveDate": "2025-12-22",
    "rbtExpiryDate": "2026-12-22",
    "role": "RBT",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-12-22",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-502608",
      "rbtEffectiveDate": "2025-12-22",
      "rbtExpiryDate": "2026-12-22",
      "role": "RBT",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-lisa-latina-michell-sisneroz",
    "firstName": "Lisa",
    "lastName": "Latina Michell Sisneroz",
    "fullName": "Lisa Latina Michell Sisneroz",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "lisa.latinamichellsisneroz@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-457764",
    "licenseState": "CA",
    "licenseExpiration": "2026-07-27",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-457764",
    "rbtEffectiveDate": "2025-07-27",
    "rbtExpiryDate": "2026-07-27",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-07-27",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-457764",
      "rbtEffectiveDate": "2025-07-27",
      "rbtExpiryDate": "2026-07-27",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-loc-le",
    "firstName": "Loc",
    "lastName": "Le",
    "fullName": "Loc Le",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "loc.le@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-23-293235",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-23",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-23-293235",
    "rbtEffectiveDate": "2023-08-23",
    "rbtExpiryDate": "2026-08-23",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-08-23",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-23-293235",
      "rbtEffectiveDate": "2023-08-23",
      "rbtExpiryDate": "2026-08-23",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-lois-tolman",
    "firstName": "Lois",
    "lastName": "Tolman",
    "fullName": "Lois Tolman",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "lois.tolman@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-458942",
    "licenseState": "UT",
    "licenseExpiration": "2026-07-30",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-25-458942",
    "rbtEffectiveDate": "2025-07-30",
    "rbtExpiryDate": "2026-07-30",
    "role": "RBT",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-07-30",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-458942",
      "rbtEffectiveDate": "2025-07-30",
      "rbtExpiryDate": "2026-07-30",
      "role": "RBT",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-marilena-mancias",
    "firstName": "Marilena",
    "lastName": "Mancias",
    "fullName": "Marilena Mancias",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "marilena.mancias@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-marilena-mancias",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-paola-lopez",
    "firstName": "Paola",
    "lastName": "Lopez",
    "fullName": "Paola Lopez",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "paola.lopez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-21-173263",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-24",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-21-173263",
    "rbtEffectiveDate": "2021-06-24",
    "rbtExpiryDate": "2028-04-24",
    "role": "PS",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-06-24",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-21-173263",
      "rbtEffectiveDate": "2021-06-24",
      "rbtExpiryDate": "2028-04-24",
      "role": "PS",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-raquel-rodriguez",
    "firstName": "Raquel",
    "lastName": "Rodriguez",
    "fullName": "Raquel Rodriguez",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "raquel.rodriguez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-18-63920",
    "licenseState": "UT",
    "licenseExpiration": "2026-08-22",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-18-63920",
    "rbtEffectiveDate": "2018-08-22",
    "rbtExpiryDate": "2026-08-22",
    "role": "PS",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2018-08-22",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-18-63920",
      "rbtEffectiveDate": "2018-08-22",
      "rbtExpiryDate": "2026-08-22",
      "role": "PS",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-regen-spendlove",
    "firstName": "Regen",
    "lastName": "Spendlove",
    "fullName": "Regen Spendlove",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "regen.spendlove@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-22-199954",
    "licenseState": "UT",
    "licenseExpiration": "2028-01-15",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-22-199954",
    "rbtEffectiveDate": "2022-01-15",
    "rbtExpiryDate": "2028-01-15",
    "role": "RBT",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-01-15",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-22-199954",
      "rbtEffectiveDate": "2022-01-15",
      "rbtExpiryDate": "2028-01-15",
      "role": "RBT",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-rbt-reyna-munoz",
    "firstName": "Reyna",
    "lastName": "Munoz",
    "fullName": "Reyna Munoz",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "reyna.munoz@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-413640",
    "licenseState": "CA",
    "licenseExpiration": "2026-02-20",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-413640",
    "rbtEffectiveDate": "2025-02-20",
    "rbtExpiryDate": "2026-02-20",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-02-20",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-413640",
      "rbtEffectiveDate": "2025-02-20",
      "rbtExpiryDate": "2026-02-20",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-rhett-bruce",
    "firstName": "Rhett",
    "lastName": "Bruce",
    "fullName": "Rhett Bruce",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "rhett.bruce@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-24-349207",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-22",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-24-349207",
    "rbtEffectiveDate": "2024-05-22",
    "rbtExpiryDate": "2028-05-22",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-05-22",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-24-349207",
      "rbtEffectiveDate": "2024-05-22",
      "rbtExpiryDate": "2028-05-22",
      "role": "RBT",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-robinae-devereaux-carter",
    "firstName": "Robinae",
    "lastName": "Devereaux-Carter",
    "fullName": "Robinae Devereaux-Carter",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "robinae.devereaux-carter@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-463605",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-15",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-463605",
    "rbtEffectiveDate": "2025-08-15",
    "rbtExpiryDate": "2026-08-15",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-08-15",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-463605",
      "rbtEffectiveDate": "2025-08-15",
      "rbtExpiryDate": "2026-08-15",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-tiffany-catherine-narducci",
    "firstName": "Tiffany",
    "lastName": "Catherine Narducci",
    "fullName": "Tiffany Catherine Narducci",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "tiffany.catherinenarducci@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-24-347294",
    "licenseState": "CA",
    "licenseExpiration": "2026-05-14",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-24-347294",
    "rbtEffectiveDate": "2024-05-14",
    "rbtExpiryDate": "2026-05-14",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-05-14",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-24-347294",
      "rbtEffectiveDate": "2024-05-14",
      "rbtExpiryDate": "2026-05-14",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-william-fonseca",
    "firstName": "William",
    "lastName": "Fonseca",
    "fullName": "William Fonseca",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "william.fonseca@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-26-513281",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-06",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-26-513281",
    "rbtEffectiveDate": "2026-02-06",
    "rbtExpiryDate": "2028-02-06",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2026-02-06",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-26-513281",
      "rbtEffectiveDate": "2026-02-06",
      "rbtExpiryDate": "2028-02-06",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-william-loera",
    "firstName": "William",
    "lastName": "Loera",
    "fullName": "William Loera",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "william.loera@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-25-494625",
    "licenseState": "CA",
    "licenseExpiration": "2026-11-25",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-494625",
    "rbtEffectiveDate": "2025-11-25",
    "rbtExpiryDate": "2026-11-25",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-11-25",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-494625",
      "rbtEffectiveDate": "2025-11-25",
      "rbtExpiryDate": "2026-11-25",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-citlally-vallejo",
    "firstName": "Citlally",
    "lastName": "Vallejo",
    "fullName": "Citlally Vallejo",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "citlally.vallejo@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1235992892",
    "licenseNumber": "RBT-25-475720",
    "licenseState": "CA",
    "licenseExpiration": "2028-09-24",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-475720",
    "rbtEffectiveDate": "2025-09-25",
    "rbtExpiryDate": "2028-09-24",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-09-25",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-475720",
      "rbtEffectiveDate": "2025-09-25",
      "rbtExpiryDate": "2028-09-24",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-naomi-mascorro",
    "firstName": "Naomi",
    "lastName": "Mascorro",
    "fullName": "Naomi Mascorro",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "naomi.mascorro@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1770498909",
    "licenseNumber": "RBT-25-424406",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-29",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-25-424406",
    "rbtEffectiveDate": "2025-03-30",
    "rbtExpiryDate": "2028-03-29",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-03-30",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-25-424406",
      "rbtEffectiveDate": "2025-03-30",
      "rbtExpiryDate": "2028-03-29",
      "role": "RBT",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-kelsey-kay",
    "firstName": "Kelsey",
    "lastName": "Kay",
    "fullName": "Kelsey Kay",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "kelsey.kay@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-26-516272",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-18",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-26-516272",
    "rbtEffectiveDate": "2026-02-19",
    "rbtExpiryDate": "2028-02-18",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2026-02-19",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-26-516272",
      "rbtEffectiveDate": "2026-02-19",
      "rbtExpiryDate": "2028-02-18",
      "role": "RBT",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-kevin-stephens",
    "firstName": "Kevin",
    "lastName": "Stephens",
    "fullName": "Kevin Stephens",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "kevin.stephens@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": "1639651367",
    "licenseNumber": "RBT-26-2835903",
    "licenseState": "CA",
    "licenseExpiration": "2028-08-01",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-26-2835903",
    "rbtEffectiveDate": "2026-08-02",
    "rbtExpiryDate": "2028-08-01",
    "role": "PS",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2026-08-02",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "RBT-26-2835903",
      "rbtEffectiveDate": "2026-08-02",
      "rbtExpiryDate": "2028-08-01",
      "role": "PS",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-erik-zehm",
    "firstName": "Erik",
    "lastName": "Zehm",
    "fullName": "Erik Zehm",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "erik.zehm@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-erik-zehm",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-karime-ruiz-alvarez",
    "firstName": "Karime",
    "lastName": "Ruiz Alvarez",
    "fullName": "Karime Ruiz Alvarez",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "karime.ruizalvarez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-karime-ruiz-alvarez",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-leneea-gaither",
    "firstName": "Leneea",
    "lastName": "Gaither",
    "fullName": "Leneea Gaither",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "leneea.gaither@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-leneea-gaither",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-lissette-esperanza",
    "firstName": "Lissette",
    "lastName": "Esperanza",
    "fullName": "Lissette Esperanza",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "lissette.esperanza@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-lissette-esperanza",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-marissa-napier",
    "firstName": "Marissa",
    "lastName": "Napier",
    "fullName": "Marissa Napier",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "marissa.napier@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-marissa-napier",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-noah-johnson",
    "firstName": "Noah",
    "lastName": "Johnson",
    "fullName": "Noah Johnson",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "noah.johnson@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-noah-johnson",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-rbt-zoe-zettas",
    "firstName": "Zoe",
    "lastName": "Zettas",
    "fullName": "Zoe Zettas",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "email": "zoe.zettas@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "npi": null,
    "licenseNumber": "RBT-zoe-zettas",
    "licenseState": "CA",
    "licenseExpiration": "",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "caqhId": "",
    "caqhStatus": "Complete",
    "paveStatus": "Approved",
    "npiVerified": false,
    "nppesRecordMatch": false,
    "payerEnrollments": [
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved",
        "notes": "Active under AGES Learning Solutions Catalight group enrollment"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-erica-bustos",
    "firstName": "Erica",
    "lastName": "Bustos",
    "fullName": "Erica Bustos",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "erica.bustos@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1962896530",
    "licenseNumber": "3013264",
    "licenseState": "CA",
    "licenseExpiration": "2027-01-31",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "3013264",
    "bcbaEffectiveDate": "2012-01-31",
    "bcbaExpiryDate": "2027-01-31",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2012-01-31",
    "caqhId": "13805243",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "3013264",
      "bcbaEffectiveDate": "2012-01-31",
      "bcbaExpiryDate": "2027-01-31",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-darcy-machado",
    "firstName": "Darcy",
    "lastName": "Machado",
    "fullName": "Darcy Machado",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "darcy.machado@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1659841179",
    "licenseNumber": "14276255",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-22",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "14276255",
    "bcbaEffectiveDate": "2020-02-22",
    "bcbaExpiryDate": "2028-02-22",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2020-02-22",
    "caqhId": "15110516",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "14276255",
      "bcbaEffectiveDate": "2020-02-22",
      "bcbaExpiryDate": "2028-02-22",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-sasha-torres",
    "firstName": "Sasha",
    "lastName": "Torres",
    "fullName": "Sasha Torres",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "sasha.torres@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1497186738",
    "licenseNumber": "4806240",
    "licenseState": "CA",
    "licenseExpiration": "2026-09-30",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "4806240",
    "bcbaEffectiveDate": "2013-09-30",
    "bcbaExpiryDate": "2026-09-30",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2013-09-30",
    "caqhId": "12638040",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "4806240",
      "bcbaEffectiveDate": "2013-09-30",
      "bcbaExpiryDate": "2026-09-30",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-tracy-rodriguez",
    "firstName": "Tracy",
    "lastName": "Rodriguez",
    "fullName": "Tracy Rodriguez",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "tracy.rodriguez@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1730636051",
    "licenseNumber": "17570743",
    "licenseState": "CA",
    "licenseExpiration": "2027-05-18",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "17570743",
    "bcbaEffectiveDate": "2021-05-18",
    "bcbaExpiryDate": "2027-05-18",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-05-18",
    "caqhId": "15157857",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "17570743",
      "bcbaEffectiveDate": "2021-05-18",
      "bcbaExpiryDate": "2027-05-18",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-peter-chen",
    "firstName": "Peter",
    "lastName": "Chen",
    "fullName": "Peter Chen",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "peter.chen@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1538636030",
    "licenseNumber": "20351701",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-19",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "20351701",
    "bcbaEffectiveDate": "2022-01-19",
    "bcbaExpiryDate": "2028-01-19",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-01-19",
    "caqhId": "15493975",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "20351701",
      "bcbaEffectiveDate": "2022-01-19",
      "bcbaExpiryDate": "2028-01-19",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-natasha-chaudhry",
    "firstName": "Natasha",
    "lastName": "Chaudhry",
    "fullName": "Natasha Chaudhry",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "natasha.chaudhry@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1730842196",
    "licenseNumber": "19112066",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-13",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "19112066",
    "bcbaEffectiveDate": "2021-10-13",
    "bcbaExpiryDate": "2027-10-13",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-10-13",
    "caqhId": "15423187",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "19112066",
      "bcbaEffectiveDate": "2021-10-13",
      "bcbaExpiryDate": "2027-10-13",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-jennine-simpson",
    "firstName": "Jennine",
    "lastName": "Simpson",
    "fullName": "Jennine Simpson",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "jennine.simpson@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1972192474",
    "licenseNumber": "12382471",
    "licenseState": "CA",
    "licenseExpiration": "2027-05-31",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "12382471",
    "bcbaEffectiveDate": "2019-05-31",
    "bcbaExpiryDate": "2027-05-31",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2019-05-31",
    "caqhId": "15044394",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "12382471",
      "bcbaEffectiveDate": "2019-05-31",
      "bcbaExpiryDate": "2027-05-31",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-jesus-belmonte",
    "firstName": "Jesus",
    "lastName": "Belmonte",
    "fullName": "Jesus Belmonte",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "jesus.belmonte@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1700387909",
    "licenseNumber": "15710927",
    "licenseState": "CA",
    "licenseExpiration": "2026-09-25",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Livermore",
    "bcbaCertificationNumber": "15710927",
    "bcbaEffectiveDate": "2020-09-25",
    "bcbaExpiryDate": "2026-09-25",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2020-09-25",
    "caqhId": "14978507",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "15710927",
      "bcbaEffectiveDate": "2020-09-25",
      "bcbaExpiryDate": "2026-09-25",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-maria-vazquez",
    "firstName": "Maria",
    "lastName": "Vazquez",
    "fullName": "Maria Vazquez",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "maria.vazquez@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1932917234",
    "licenseNumber": "27856340",
    "licenseState": "CA",
    "licenseExpiration": "2026-12-13",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "27856340",
    "bcbaEffectiveDate": "2024-12-13",
    "bcbaExpiryDate": "2026-12-13",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-12-13",
    "caqhId": "16385498",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "27856340",
      "bcbaEffectiveDate": "2024-12-13",
      "bcbaExpiryDate": "2026-12-13",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-leanne-simon",
    "firstName": "Leanne",
    "lastName": "Simon",
    "fullName": "Leanne Simon",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "leanne.simon@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1750716056",
    "licenseNumber": "8643847",
    "licenseState": "CA",
    "licenseExpiration": "2027-02-28",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Livermore",
    "bcbaCertificationNumber": "8643847",
    "bcbaEffectiveDate": "2017-02-28",
    "bcbaExpiryDate": "2027-02-28",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2017-02-28",
    "caqhId": "13782768",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "8643847",
      "bcbaEffectiveDate": "2017-02-28",
      "bcbaExpiryDate": "2027-02-28",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-brianna-bader",
    "firstName": "Brianna",
    "lastName": "Bader",
    "fullName": "Brianna Bader",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "brianna.bader@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1245876838",
    "licenseNumber": "28794283",
    "licenseState": "CA",
    "licenseExpiration": "2027-04-16",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "28794283",
    "bcbaEffectiveDate": "2025-04-16",
    "bcbaExpiryDate": "2027-04-16",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-04-16",
    "caqhId": "16493372",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "28794283",
      "bcbaEffectiveDate": "2025-04-16",
      "bcbaExpiryDate": "2027-04-16",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-amy-heaps",
    "firstName": "Amy",
    "lastName": "Heaps",
    "fullName": "Amy Heaps",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "amy.heaps@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1063986834",
    "licenseNumber": "11492375",
    "licenseState": "UT",
    "licenseExpiration": "2026-11-30",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Utah",
    "bcbaCertificationNumber": "11492375",
    "bcbaEffectiveDate": "2018-11-30",
    "bcbaExpiryDate": "2026-11-30",
    "utStateLicense": "11123646-2506",
    "utahLicenseNumber": "11123646-2506",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2018-11-30",
    "caqhId": "14393821",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-selecthealth",
        "payerName": "Select Health UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-ut-medicaid",
        "payerName": "UT Medicaid",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uofu",
        "payerName": "University of UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-pehp",
        "payerName": "PEHP UT",
        "status": "Pending"
      },
      {
        "payerId": "pyr-molina-ut",
        "payerName": "Molina UT",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "11492375",
      "bcbaEffectiveDate": "2018-11-30",
      "bcbaExpiryDate": "2026-11-30",
      "utStateLicense": "11123646-2506",
      "utahLicenseNumber": "11123646-2506",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-bcba-andrea-mathews",
    "firstName": "Andrea",
    "lastName": "Mathews",
    "fullName": "Andrea Mathews",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "andrea.mathews@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1386238889",
    "licenseNumber": "16807751",
    "licenseState": "UT",
    "licenseExpiration": "2027-02-23",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Utah",
    "bcbaCertificationNumber": "16807751",
    "bcbaEffectiveDate": "2021-02-23",
    "bcbaExpiryDate": "2027-02-23",
    "utStateLicense": "12182882-2506",
    "utahLicenseNumber": "12182882-2506",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-02-23",
    "caqhId": "15092648",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-selecthealth",
        "payerName": "Select Health UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-ut-medicaid",
        "payerName": "UT Medicaid",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uofu",
        "payerName": "University of UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-pehp",
        "payerName": "PEHP UT",
        "status": "Pending"
      },
      {
        "payerId": "pyr-molina-ut",
        "payerName": "Molina UT",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "16807751",
      "bcbaEffectiveDate": "2021-02-23",
      "bcbaExpiryDate": "2027-02-23",
      "utStateLicense": "12182882-2506",
      "utahLicenseNumber": "12182882-2506",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-bcba-leslie-sundblom",
    "firstName": "Leslie",
    "lastName": "Sundblom",
    "fullName": "Leslie Sundblom",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "leslie.sundblom@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1881347961",
    "licenseNumber": "25300738",
    "licenseState": "UT",
    "licenseExpiration": "2028-02-08",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Utah",
    "bcbaCertificationNumber": "25300738",
    "bcbaEffectiveDate": "2024-02-08",
    "bcbaExpiryDate": "2028-02-08",
    "utStateLicense": "13839880-2506",
    "utahLicenseNumber": "13839880-2506",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-02-08",
    "caqhId": "16145811",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-selecthealth",
        "payerName": "Select Health UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-ut-medicaid",
        "payerName": "UT Medicaid",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uofu",
        "payerName": "University of UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-pehp",
        "payerName": "PEHP UT",
        "status": "Pending"
      },
      {
        "payerId": "pyr-molina-ut",
        "payerName": "Molina UT",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "25300738",
      "bcbaEffectiveDate": "2024-02-08",
      "bcbaExpiryDate": "2028-02-08",
      "utStateLicense": "13839880-2506",
      "utahLicenseNumber": "13839880-2506",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-bcba-johnny-new",
    "firstName": "Johnny",
    "lastName": "New",
    "fullName": "Johnny New",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "johnny.new@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1003571381",
    "licenseNumber": "29307450",
    "licenseState": "UT",
    "licenseExpiration": "2027-06-23",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Utah",
    "bcbaCertificationNumber": "29307450",
    "bcbaEffectiveDate": "2025-06-23",
    "bcbaExpiryDate": "2027-06-23",
    "utStateLicense": "14231529-2506",
    "utahLicenseNumber": "14231529-2506",
    "isUtah": true,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-06-23",
    "caqhId": "16567841",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-selecthealth",
        "payerName": "Select Health UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-ut-medicaid",
        "payerName": "UT Medicaid",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uofu",
        "payerName": "University of UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-pehp",
        "payerName": "PEHP UT",
        "status": "Pending"
      },
      {
        "payerId": "pyr-molina-ut",
        "payerName": "Molina UT",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "29307450",
      "bcbaEffectiveDate": "2025-06-23",
      "bcbaExpiryDate": "2027-06-23",
      "utStateLicense": "14231529-2506",
      "utahLicenseNumber": "14231529-2506",
      "region": "Utah",
      "isUtah": true
    }
  },
  {
    "id": "prv-ages-bcba-hailey-james",
    "firstName": "Hailey",
    "lastName": "James",
    "fullName": "Hailey James",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "hailey.james@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1386226090",
    "licenseNumber": "24529710",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-19",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Vacaville",
    "bcbaCertificationNumber": "24529710",
    "bcbaEffectiveDate": "2023-10-19",
    "bcbaExpiryDate": "2027-10-19",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-10-19",
    "caqhId": "16055818",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "24529710",
      "bcbaEffectiveDate": "2023-10-19",
      "bcbaExpiryDate": "2027-10-19",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-karl-michael-kangleon",
    "firstName": "Karl",
    "lastName": "Michael Kangleon",
    "fullName": "Karl Michael Kangleon",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "karl.michaelkangleon@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1932754546",
    "licenseNumber": "29706295",
    "licenseState": "CA",
    "licenseExpiration": "2027-08-02",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Vacaville",
    "bcbaCertificationNumber": "29706295",
    "bcbaEffectiveDate": "2025-08-02",
    "bcbaExpiryDate": "2027-08-02",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2025-08-02",
    "caqhId": "16598662",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "29706295",
      "bcbaEffectiveDate": "2025-08-02",
      "bcbaExpiryDate": "2027-08-02",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-india-izidoro-baker",
    "firstName": "India",
    "lastName": "Izidoro Baker",
    "fullName": "India Izidoro Baker",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "india.izidorobaker@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1831729664",
    "licenseNumber": "24361334",
    "licenseState": "CA",
    "licenseExpiration": "2027-09-30",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Brentwood",
    "bcbaCertificationNumber": "24361334",
    "bcbaEffectiveDate": "2023-09-30",
    "bcbaExpiryDate": "2027-09-30",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-09-30",
    "caqhId": "14617141",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "24361334",
      "bcbaEffectiveDate": "2023-09-30",
      "bcbaExpiryDate": "2027-09-30",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-melody-goh",
    "firstName": "Melody",
    "lastName": "Goh",
    "fullName": "Melody Goh",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "melody.goh@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1093690125",
    "licenseNumber": "17501712",
    "licenseState": "CA",
    "licenseExpiration": "2027-05-10",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Livermore",
    "bcbaCertificationNumber": "17501712",
    "bcbaEffectiveDate": "2021-05-10",
    "bcbaExpiryDate": "2027-05-10",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-05-10",
    "caqhId": "16592947",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "17501712",
      "bcbaEffectiveDate": "2021-05-10",
      "bcbaExpiryDate": "2027-05-10",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Livermore",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-meghan-moriana",
    "firstName": "Meghan",
    "lastName": "Moriana",
    "fullName": "Meghan Moriana",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "meghan.moriana@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1093266223",
    "licenseNumber": "10793300",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-31",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Brentwood",
    "bcbaCertificationNumber": "10793300",
    "bcbaEffectiveDate": "2018-08-31",
    "bcbaExpiryDate": "2026-08-31",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2018-08-31",
    "caqhId": "14377120",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "10793300",
      "bcbaEffectiveDate": "2018-08-31",
      "bcbaExpiryDate": "2026-08-31",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-jacob-lopez",
    "firstName": "Jacob",
    "lastName": "Lopez",
    "fullName": "Jacob Lopez",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "jacob.lopez@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1255899472",
    "licenseNumber": "31456538",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-26",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Brentwood",
    "bcbaCertificationNumber": "31456538",
    "bcbaEffectiveDate": "2026-02-26",
    "bcbaExpiryDate": "2028-02-26",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2026-02-26",
    "caqhId": "16760752",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "31456538",
      "bcbaEffectiveDate": "2026-02-26",
      "bcbaExpiryDate": "2028-02-26",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Brentwood",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-elise-newman",
    "firstName": "Elise",
    "lastName": "Newman",
    "fullName": "Elise Newman",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "elise.newman@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1770084196",
    "licenseNumber": "25217098",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-29",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "25217098",
    "bcbaEffectiveDate": "2024-01-29",
    "bcbaExpiryDate": "2028-01-29",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-29",
    "caqhId": "16155472",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "25217098",
      "bcbaEffectiveDate": "2024-01-29",
      "bcbaExpiryDate": "2028-01-29",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-brittany-stack",
    "firstName": "Brittany",
    "lastName": "Stack",
    "fullName": "Brittany Stack",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "brittany.stack@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1770084196",
    "licenseNumber": "14942457",
    "licenseState": "CA",
    "licenseExpiration": "2028-06-21",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Vacaville",
    "bcbaCertificationNumber": "14942457",
    "bcbaEffectiveDate": "2020-06-22",
    "bcbaExpiryDate": "2028-06-21",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2020-06-22",
    "caqhId": "14928309",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "14942457",
      "bcbaEffectiveDate": "2020-06-22",
      "bcbaExpiryDate": "2028-06-21",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-jade-saechao",
    "firstName": "Jade",
    "lastName": "Saechao",
    "fullName": "Jade Saechao",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "jade.saechao@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1043790033",
    "licenseNumber": "25129074",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-10",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Vacaville",
    "bcbaCertificationNumber": "25129074",
    "bcbaEffectiveDate": "2024-01-11",
    "bcbaExpiryDate": "2028-01-10",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-11",
    "caqhId": "16112183",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "25129074",
      "bcbaEffectiveDate": "2024-01-11",
      "bcbaExpiryDate": "2028-01-10",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "Vacaville",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-manjot-sandhu",
    "firstName": "Manjot",
    "lastName": "Sandhu",
    "fullName": "Manjot Sandhu",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "manjot.sandhu@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1487920193",
    "licenseNumber": "BCBA-18-9921",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-15",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-18-9921",
    "bcbaEffectiveDate": "2018-01-15",
    "bcbaExpiryDate": "2028-01-15",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2018-01-15",
    "caqhId": "15482910",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-18-9921",
      "bcbaEffectiveDate": "2018-01-15",
      "bcbaExpiryDate": "2028-01-15",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-angela-jung",
    "firstName": "Angela",
    "lastName": "Jung",
    "fullName": "Angela Jung",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "angela.jung@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1598201944",
    "licenseNumber": "BCBA-21-3912",
    "licenseState": "CA",
    "licenseExpiration": "2027-03-10",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-21-3912",
    "bcbaEffectiveDate": "2021-03-10",
    "bcbaExpiryDate": "2027-03-10",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-03-10",
    "caqhId": "16120391",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-21-3912",
      "bcbaEffectiveDate": "2021-03-10",
      "bcbaExpiryDate": "2027-03-10",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-keiko-ushijima-mwesigwa",
    "firstName": "Keiko",
    "lastName": "Ushijima-Mwesigwa",
    "fullName": "Keiko Ushijima-Mwesigwa",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "keiko.ushijima-mwesigwa@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1284920112",
    "licenseNumber": "BCBA-19-4820",
    "licenseState": "CA",
    "licenseExpiration": "2027-08-14",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-19-4820",
    "bcbaEffectiveDate": "2019-08-14",
    "bcbaExpiryDate": "2027-08-14",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2019-08-14",
    "caqhId": "15920182",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-19-4820",
      "bcbaEffectiveDate": "2019-08-14",
      "bcbaExpiryDate": "2027-08-14",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-kristi-lui",
    "firstName": "Kristi",
    "lastName": "Lui",
    "fullName": "Kristi Lui",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "kristi.lui@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1392810482",
    "licenseNumber": "BCBA-20-4910",
    "licenseState": "CA",
    "licenseExpiration": "2028-09-12",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-20-4910",
    "bcbaEffectiveDate": "2020-09-12",
    "bcbaExpiryDate": "2028-09-12",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2020-09-12",
    "caqhId": "15392019",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-20-4910",
      "bcbaEffectiveDate": "2020-09-12",
      "bcbaExpiryDate": "2028-09-12",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-rabita-osorio",
    "firstName": "Rabita",
    "lastName": "Osorio",
    "fullName": "Rabita Osorio",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "rabita.osorio@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1648201948",
    "licenseNumber": "BCBA-17-3810",
    "licenseState": "CA",
    "licenseExpiration": "2027-04-12",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-17-3810",
    "bcbaEffectiveDate": "2017-04-12",
    "bcbaExpiryDate": "2027-04-12",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2017-04-12",
    "caqhId": "14920184",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-17-3810",
      "bcbaEffectiveDate": "2017-04-12",
      "bcbaExpiryDate": "2027-04-12",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-serena-richardson",
    "firstName": "Serena",
    "lastName": "Richardson",
    "fullName": "Serena Richardson",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "serena.richardson@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1759201842",
    "licenseNumber": "BCBA-22-4918",
    "licenseState": "CA",
    "licenseExpiration": "2028-07-15",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-22-4918",
    "bcbaEffectiveDate": "2022-07-15",
    "bcbaExpiryDate": "2028-07-15",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-07-15",
    "caqhId": "16382019",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-22-4918",
      "bcbaEffectiveDate": "2022-07-15",
      "bcbaExpiryDate": "2028-07-15",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-anthony-verzi-jr",
    "firstName": "Anthony",
    "lastName": "Verzi Jr",
    "fullName": "Anthony Verzi Jr",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "anthony.verzijr@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1869201841",
    "licenseNumber": "BCBA-20-3918",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-20",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-20-3918",
    "bcbaEffectiveDate": "2020-05-20",
    "bcbaExpiryDate": "2028-05-20",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2020-05-20",
    "caqhId": "15820194",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-20-3918",
      "bcbaEffectiveDate": "2020-05-20",
      "bcbaExpiryDate": "2028-05-20",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-pamela-yata",
    "firstName": "Pamela",
    "lastName": "Yata",
    "fullName": "Pamela Yata",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "pamela.yata@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1970291842",
    "licenseNumber": "BCBA-21-4912",
    "licenseState": "CA",
    "licenseExpiration": "2027-11-10",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-21-4912",
    "bcbaEffectiveDate": "2021-11-10",
    "bcbaExpiryDate": "2027-11-10",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-11-10",
    "caqhId": "15729184",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-21-4912",
      "bcbaEffectiveDate": "2021-11-10",
      "bcbaExpiryDate": "2027-11-10",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-itzel-bernal",
    "firstName": "Itzel",
    "lastName": "Bernal",
    "fullName": "Itzel Bernal",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "itzel.bernal@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1482019481",
    "licenseNumber": "BCBA-22-3819",
    "licenseState": "CA",
    "licenseExpiration": "2028-12-22",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-22-3819",
    "bcbaEffectiveDate": "2022-12-22",
    "bcbaExpiryDate": "2028-12-22",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-12-22",
    "caqhId": "15928104",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-22-3819",
      "bcbaEffectiveDate": "2022-12-22",
      "bcbaExpiryDate": "2028-12-22",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-monica-yeo",
    "firstName": "Monica",
    "lastName": "Yeo",
    "fullName": "Monica Yeo",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "monica.yeo@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1392019482",
    "licenseNumber": "BCBA-21-5820",
    "licenseState": "CA",
    "licenseExpiration": "2027-06-18",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-21-5820",
    "bcbaEffectiveDate": "2021-06-18",
    "bcbaExpiryDate": "2027-06-18",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2021-06-18",
    "caqhId": "16492018",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-21-5820",
      "bcbaEffectiveDate": "2021-06-18",
      "bcbaExpiryDate": "2027-06-18",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-patricia-nishan",
    "firstName": "Patricia",
    "lastName": "Nishan",
    "fullName": "Patricia Nishan",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "patricia.nishan@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1284910284",
    "licenseNumber": "BCBA-19-2918",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-05",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-19-2918",
    "bcbaEffectiveDate": "2019-10-05",
    "bcbaExpiryDate": "2027-10-05",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2019-10-05",
    "caqhId": "15839201",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-19-2918",
      "bcbaEffectiveDate": "2019-10-05",
      "bcbaExpiryDate": "2027-10-05",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-nia-freeman",
    "firstName": "Nia",
    "lastName": "Freeman",
    "fullName": "Nia Freeman",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "nia.freeman@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1192840192",
    "licenseNumber": "BCBA-22-4820",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-14",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-22-4820",
    "bcbaEffectiveDate": "2022-04-14",
    "bcbaExpiryDate": "2028-04-14",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2022-04-14",
    "caqhId": "16281049",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-22-4820",
      "bcbaEffectiveDate": "2022-04-14",
      "bcbaExpiryDate": "2028-04-14",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-ages-bcba-savan-patel",
    "firstName": "Savan",
    "lastName": "Patel",
    "fullName": "Savan Patel",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "email": "savan.patel@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "npi": "1084920184",
    "licenseNumber": "BCBA-23-4912",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-18",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-23-4912",
    "bcbaEffectiveDate": "2023-02-18",
    "bcbaExpiryDate": "2028-02-18",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "employmentStatus": "Full-Time",
    "startDate": "2023-02-18",
    "caqhId": "16492014",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-catalight",
        "payerName": "Catalight",
        "status": "Approved"
      },
      {
        "payerId": "pyr-carelon",
        "payerName": "Carelon",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Health Plan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "bcbaCertificationNumber": "BCBA-23-4912",
      "bcbaEffectiveDate": "2023-02-18",
      "bcbaExpiryDate": "2028-02-18",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "region": "San Jose",
      "isUtah": false
    }
  },
  {
    "id": "prv-pstg-slp-pranali-kalley",
    "firstName": "Pranali",
    "lastName": "Kalley",
    "fullName": "Pranali Kalley",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "pranalik.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1255117768",
    "licenseNumber": "17412",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16082051",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "17412"
    }
  },
  {
    "id": "prv-pstg-slp-lauren-pourreau",
    "firstName": "Lauren",
    "lastName": "Pourreau",
    "fullName": "Lauren Pourreau",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "laurens.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1275018855",
    "licenseNumber": "33881",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "15997800",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1990-04-18",
      "taxonomy": "235Z00000X",
      "licenseNumber": "33881"
    }
  },
  {
    "id": "prv-pstg-slp-jacqueline-valles",
    "firstName": "Jacqueline",
    "lastName": "Valles",
    "fullName": "Jacqueline Valles",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "jacquelinev.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1881223220",
    "licenseNumber": "40779",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16693378",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1994-04-19",
      "taxonomy": "235Z00000X",
      "licenseNumber": "40779"
    }
  },
  {
    "id": "prv-pstg-slp-georgina-aidee-vasquez",
    "firstName": "Georgina",
    "lastName": "Aidee Vasquez",
    "fullName": "Georgina Aidee Vasquez",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "georginav.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1376067348",
    "licenseNumber": "40931",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16862210",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1989-08-05",
      "taxonomy": "235Z00000X",
      "licenseNumber": "40931"
    }
  },
  {
    "id": "prv-pstg-slp-christine-woods",
    "firstName": "Christine",
    "lastName": "Woods",
    "fullName": "Christine Woods",
    "credentials": "M.A., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "christinew.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1881984896",
    "licenseNumber": "SP17047",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "12191219",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1978-08-09",
      "taxonomy": "235Z00000X",
      "licenseNumber": "SP17047"
    }
  },
  {
    "id": "prv-pstg-slp-shuyi-tong",
    "firstName": "Shuyi",
    "lastName": "Tong",
    "fullName": "Shuyi Tong",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "shuyit.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1669209078",
    "licenseNumber": "40014",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16307669",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "40014"
    }
  },
  {
    "id": "prv-pstg-slp-yi-liu",
    "firstName": "Yi",
    "lastName": "Liu",
    "fullName": "Yi Liu",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "anna.l@cptherapyservices.com",
    "phone": "(925) 315-4024",
    "npi": "1225857311",
    "licenseNumber": "39995",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16322180",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1998-07-05",
      "taxonomy": "235Z00000X",
      "licenseNumber": "39995"
    }
  },
  {
    "id": "prv-pstg-slp-sandra-manzo",
    "firstName": "Sandra",
    "lastName": "Manzo",
    "fullName": "Sandra Manzo",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "sandram.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1811411804",
    "licenseNumber": "23638",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16147156",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1983-12-30",
      "taxonomy": "235Z00000X",
      "licenseNumber": "23638"
    }
  },
  {
    "id": "prv-pstg-slp-valeria-ruvalcaba",
    "firstName": "Valeria",
    "lastName": "Ruvalcaba",
    "fullName": "Valeria Ruvalcaba",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "valeriar.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1003740747",
    "licenseNumber": "41447",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16831795",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1999-12-18",
      "taxonomy": "235Z00000X",
      "licenseNumber": "41447"
    }
  },
  {
    "id": "prv-pstg-slp-aruna-radhakrishnan",
    "firstName": "Aruna",
    "lastName": "Radhakrishnan",
    "fullName": "Aruna Radhakrishnan",
    "credentials": "MA, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "arunar.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1518493097",
    "licenseNumber": "SP16932",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "14424452",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1965-11-06",
      "taxonomy": "235Z00000X",
      "licenseNumber": "SP16932"
    }
  },
  {
    "id": "prv-pstg-slp-catherine-doerr",
    "firstName": "Catherine",
    "lastName": "Doerr",
    "fullName": "Catherine Doerr",
    "credentials": "MA, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "catherined.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1689247298",
    "licenseNumber": "33763",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "15673999",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "33763"
    }
  },
  {
    "id": "prv-pstg-slp-alicia-nordstrom",
    "firstName": "Alicia",
    "lastName": "Nordstrom",
    "fullName": "Alicia Nordstrom",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "alician.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1952075798",
    "licenseNumber": "29583",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "15266199",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "29583"
    }
  },
  {
    "id": "prv-pstg-slp-dillon-o-connell",
    "firstName": "Dillon",
    "lastName": "O'Connell",
    "fullName": "Dillon O'Connell",
    "credentials": "MA, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "dillono.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1962075713",
    "licenseNumber": "33486",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "15696150",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1994-03-15",
      "taxonomy": "235Z00000X",
      "licenseNumber": "33486"
    }
  },
  {
    "id": "prv-pstg-slp-valerie-russell",
    "firstName": "Valerie",
    "lastName": "Russell",
    "fullName": "Valerie Russell",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "valerievr.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1962182923",
    "licenseNumber": "29847",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16143512",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "29847"
    }
  },
  {
    "id": "prv-pstg-slp-sierra-bone",
    "firstName": "Sierra",
    "lastName": "Bone",
    "fullName": "Sierra Bone",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "sierrab.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1245858810",
    "licenseNumber": "30178",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "15094231",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1995-05-29",
      "taxonomy": "235Z00000X",
      "licenseNumber": "30178"
    }
  },
  {
    "id": "prv-pstg-slp-heather-zamani",
    "firstName": "Heather",
    "lastName": "Zamani",
    "fullName": "Heather Zamani",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "heatherz.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1023752599",
    "licenseNumber": "29515",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "15807520",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "29515"
    }
  },
  {
    "id": "prv-pstg-slp-shannon-knapp",
    "firstName": "Shannon",
    "lastName": "Knapp",
    "fullName": "Shannon Knapp",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "shannonk.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1437422060",
    "licenseNumber": "35991",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "14099519",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "35991"
    }
  },
  {
    "id": "prv-pstg-slp-jaclyn-magner",
    "firstName": "Jaclyn",
    "lastName": "Magner",
    "fullName": "Jaclyn Magner",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "jaclynm.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1346079894",
    "licenseNumber": "19145",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16145811",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "2000-08-17",
      "taxonomy": "235Z00000X",
      "licenseNumber": "19145"
    }
  },
  {
    "id": "prv-pstg-slp-stacey-romero",
    "firstName": "Stacey",
    "lastName": "Romero",
    "fullName": "Stacey Romero",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "staceyr.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1609603943",
    "licenseNumber": "9106",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "15920194",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "9106"
    }
  },
  {
    "id": "prv-pstg-slp-christina-harman",
    "firstName": "Christina",
    "lastName": "Harman",
    "fullName": "Christina Harman",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "christinah.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1942617238",
    "licenseNumber": "25830",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "13582408",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "25830"
    }
  },
  {
    "id": "prv-pstg-slp-rocio-azocar",
    "firstName": "Rocio",
    "lastName": "Azocar",
    "fullName": "Rocio Azocar",
    "credentials": "M.S, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "rocioa.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1871364232",
    "licenseNumber": "SP30928",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16920194",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "SP30928"
    }
  },
  {
    "id": "prv-pstg-slp-fernanda-astudillo",
    "firstName": "Fernanda",
    "lastName": "Astudillo",
    "fullName": "Fernanda Astudillo",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "fernandaa.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "npi": "1083475404",
    "licenseNumber": "SP34626",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "caqhId": "16829104",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem Blue Cross",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / Evernorth",
        "status": "Approved"
      },
      {
        "payerId": "pyr-magellan",
        "payerName": "Magellan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-tricare",
        "payerName": "Tricare",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uhc",
        "payerName": "UnitedHealthcare (UHC / Optum)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-scfhp",
        "payerName": "Santa Clara Family Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-vhp",
        "payerName": "Valley Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-sutter",
        "payerName": "Sutter Health",
        "status": "Approved"
      },
      {
        "payerId": "pyr-hpsm",
        "payerName": "Healthplan of San Mateo",
        "status": "Approved"
      },
      {
        "payerId": "pyr-partnership",
        "payerName": "Partnership HealthPlan of CA",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "",
      "taxonomy": "235Z00000X",
      "licenseNumber": "SP34626"
    }
  },
  {
    "id": "prv-cpts-ot-miranda-freeman",
    "firstName": "Miranda",
    "lastName": "Freeman",
    "fullName": "Miranda Freeman",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "miranda@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1326736042",
    "licenseNumber": "22890",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "15920517",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1994-08-25",
      "taxonomy": "225X00000X",
      "licenseNumber": "22890",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-alyssa-barker",
    "firstName": "Alyssa",
    "lastName": "Barker",
    "fullName": "Alyssa Barker",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "aly@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1114646304",
    "licenseNumber": "27856",
    "licenseState": "CA",
    "licenseExpiration": "2027-07-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16553799",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1995-07-16",
      "taxonomy": "225X00000X",
      "licenseNumber": "27856",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-emily-gayton",
    "firstName": "Emily",
    "lastName": "Gayton",
    "fullName": "Emily Gayton",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "emily@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1871473421",
    "licenseNumber": "28130",
    "licenseState": "CA",
    "licenseExpiration": "2027-03-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16629183",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1999-03-12",
      "taxonomy": "225X00000X",
      "licenseNumber": "28130",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-keara-greenan",
    "firstName": "Keara",
    "lastName": "Greenan",
    "fullName": "Keara Greenan",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "keara@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1659194306",
    "licenseNumber": "25938",
    "licenseState": "CA",
    "licenseExpiration": "2028-06-30",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16349233",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "2000-06-28",
      "taxonomy": "225X00000X",
      "licenseNumber": "25938",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-elena-javier",
    "firstName": "Elena",
    "lastName": "Javier",
    "fullName": "Elena Javier",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "elena@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1902471204",
    "licenseNumber": "21333",
    "licenseState": "CA",
    "licenseExpiration": "2027-12-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "15150292",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1995-12-26",
      "taxonomy": "225X00000X",
      "licenseNumber": "21333",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-deana-kamiya",
    "firstName": "Deana",
    "lastName": "Kamiya",
    "fullName": "Deana Kamiya",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "deana@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1740014562",
    "licenseNumber": "26815",
    "licenseState": "CA",
    "licenseExpiration": "2027-11-30",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16291187",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1997-11-13",
      "taxonomy": "225X00000X",
      "licenseNumber": "26815",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-irene-lestari",
    "firstName": "Irene",
    "lastName": "Lestari",
    "fullName": "Irene Lestari",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "irene@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1881866820",
    "licenseNumber": "7552",
    "licenseState": "CA",
    "licenseExpiration": "2027-06-30",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "15668412",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1977-06-18",
      "taxonomy": "225X00000X",
      "licenseNumber": "7552",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-crystal-fuentez",
    "firstName": "Crystal",
    "lastName": "Fuentez",
    "fullName": "Crystal Fuentez",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "crystal@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1073251575",
    "licenseNumber": "23285",
    "licenseState": "CA",
    "licenseExpiration": "2028-07-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "15586534",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1988-07-03",
      "taxonomy": "225X00000X",
      "licenseNumber": "23285",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-graydon-larsen",
    "firstName": "Graydon",
    "lastName": "Larsen",
    "fullName": "Graydon Larsen",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "graydon@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1730857285",
    "licenseNumber": "12814739-4201",
    "licenseState": "UT",
    "licenseExpiration": "2027-05-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": true,
    "utStateLicense": "12814739-4201",
    "utahLicenseNumber": "12814739-4201",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "15805043",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-selecthealth",
        "payerName": "Select Health UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-ut-medicaid",
        "payerName": "UT Medicaid",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uofu",
        "payerName": "University of UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-molina-ut",
        "payerName": "Molina UT",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1987-12-28",
      "taxonomy": "225X00000X",
      "licenseNumber": "12814739-4201",
      "isUtah": true
    }
  },
  {
    "id": "prv-cpts-ot-natalie-merrill",
    "firstName": "Natalie",
    "lastName": "Merrill",
    "fullName": "Natalie Merrill",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "natalie@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1669097309",
    "licenseNumber": "14270093-4201",
    "licenseState": "UT",
    "licenseExpiration": "2027-05-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": true,
    "utStateLicense": "14270093-4201",
    "utahLicenseNumber": "14270093-4201",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16804205",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-selecthealth",
        "payerName": "Select Health UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-ut-medicaid",
        "payerName": "UT Medicaid",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uofu",
        "payerName": "University of UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-molina-ut",
        "payerName": "Molina UT",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1999-08-11",
      "taxonomy": "225X00000X",
      "licenseNumber": "14270093-4201",
      "isUtah": true
    }
  },
  {
    "id": "prv-cpts-ot-christina-gallo",
    "firstName": "Christina",
    "lastName": "Gallo",
    "fullName": "Christina Gallo",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "christinag@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1982991865",
    "licenseNumber": "14268177-4201, 11034",
    "licenseState": "UT",
    "licenseExpiration": "2027-05-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": true,
    "utStateLicense": "14268177-4201, 11034",
    "utahLicenseNumber": "14268177-4201, 11034",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "15668351",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      },
      {
        "payerId": "pyr-selecthealth",
        "payerName": "Select Health UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-ut-medicaid",
        "payerName": "UT Medicaid",
        "status": "Approved"
      },
      {
        "payerId": "pyr-uofu",
        "payerName": "University of UT",
        "status": "Approved"
      },
      {
        "payerId": "pyr-molina-ut",
        "payerName": "Molina UT",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1969-04-19",
      "taxonomy": "225X00000X",
      "licenseNumber": "14268177-4201, 11034",
      "isUtah": true
    }
  },
  {
    "id": "prv-cpts-ot-morgan-king",
    "firstName": "Morgan",
    "lastName": "King",
    "fullName": "Morgan King",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "morgank@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1366141061",
    "licenseNumber": "24710",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16839254",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1997-10-23",
      "taxonomy": "225X00000X",
      "licenseNumber": "24710",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-miriam-garcia",
    "firstName": "Miriam",
    "lastName": "Garcia",
    "fullName": "Miriam Garcia",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "miriamg@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1649954454",
    "licenseNumber": "29588",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16917799",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1996-01-21",
      "taxonomy": "225X00000X",
      "licenseNumber": "29588",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-sabrina-figueroa",
    "firstName": "Sabrina",
    "lastName": "Figueroa",
    "fullName": "Sabrina Figueroa",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "sabrinaf@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1922576784",
    "licenseNumber": "29601",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-31",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16917095",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "2000-03-31",
      "taxonomy": "225X00000X",
      "licenseNumber": "29601",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-ot-allison-inloes",
    "firstName": "Allison",
    "lastName": "Inloes",
    "fullName": "Allison Inloes",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "email": "allisoni@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1616478921",
    "licenseNumber": "21948",
    "licenseState": "CA",
    "licenseExpiration": "2027-06-30",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "isUtah": false,
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "caqhId": "16164780",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-blueshield",
        "payerName": "Blue Shield of CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1992-06-15",
      "taxonomy": "225X00000X",
      "licenseNumber": "21948",
      "isUtah": false
    }
  },
  {
    "id": "prv-cpts-slp-brenda-castro",
    "firstName": "Brenda",
    "lastName": "Castro",
    "fullName": "Brenda Castro",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "brenda@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1699651158",
    "licenseNumber": "32414",
    "licenseState": "CA",
    "licenseExpiration": "2027-03-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "caqhId": "16602383",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1989-03-29",
      "taxonomy": "235Z00000X",
      "licenseNumber": "32414"
    }
  },
  {
    "id": "prv-cpts-slp-chitra-lakshumanan",
    "firstName": "Chitra",
    "lastName": "Lakshumanan",
    "fullName": "Chitra Lakshumanan",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "chitra@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1215503172",
    "licenseNumber": "38254",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "caqhId": "15164471",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1997-01-03",
      "taxonomy": "235Z00000X",
      "licenseNumber": "38254"
    }
  },
  {
    "id": "prv-cpts-slp-leah-schwenk",
    "firstName": "Leah",
    "lastName": "Schwenk",
    "fullName": "Leah Schwenk",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "leahs@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1891577912",
    "licenseNumber": "38923",
    "licenseState": "CA",
    "licenseExpiration": "2026-11-30",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "caqhId": "16051043",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1993-11-18",
      "taxonomy": "235Z00000X",
      "licenseNumber": "38923"
    }
  },
  {
    "id": "prv-cpts-slp-christine-woods",
    "firstName": "Christine",
    "lastName": "Woods",
    "fullName": "Christine Woods",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "christine.w@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1881984896",
    "licenseNumber": "17047",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "caqhId": "12191219",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1978-08-09",
      "taxonomy": "235Z00000X",
      "licenseNumber": "17047"
    }
  },
  {
    "id": "prv-cpts-slp-sierra-bone",
    "firstName": "Sierra",
    "lastName": "Bone",
    "fullName": "Sierra Bone",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "sierrab.slp@proficiotherapy.com",
    "phone": "(925) 555-0199",
    "npi": "1245858810",
    "licenseNumber": "30178",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "caqhId": "15094231",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1995-05-29",
      "taxonomy": "235Z00000X",
      "licenseNumber": "30178"
    }
  },
  {
    "id": "prv-cpts-slp-yi-liu",
    "firstName": "Yi",
    "lastName": "Liu",
    "fullName": "Yi Liu",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "anna.l@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1225857311",
    "licenseNumber": "39995",
    "licenseState": "CA",
    "licenseExpiration": "2027-07-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "caqhId": "16322180",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1998-07-05",
      "taxonomy": "235Z00000X",
      "licenseNumber": "39995"
    }
  },
  {
    "id": "prv-cpts-slp-shannon-singleton",
    "firstName": "Shannon",
    "lastName": "Singleton",
    "fullName": "Shannon Singleton",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "email": "shannons@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "npi": "1528933538",
    "licenseNumber": "41835",
    "licenseState": "CA",
    "licenseExpiration": "2028-07-31",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "caqhId": "16856264",
    "caqhStatus": "Attested",
    "paveStatus": "Approved",
    "npiVerified": true,
    "nppesRecordMatch": true,
    "payerEnrollments": [
      {
        "payerId": "pyr-aetna",
        "payerName": "Aetna CA",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cigna",
        "payerName": "Cigna / ASH",
        "status": "Approved"
      },
      {
        "payerId": "pyr-anthem",
        "payerName": "Anthem",
        "status": "Approved"
      },
      {
        "payerId": "pyr-triwest",
        "payerName": "TriWest",
        "status": "Approved"
      },
      {
        "payerId": "pyr-medical",
        "payerName": "MediCal",
        "status": "Approved"
      },
      {
        "payerId": "pyr-cchp",
        "payerName": "Contra Costa Health Plan",
        "status": "Approved"
      },
      {
        "payerId": "pyr-alameda",
        "payerName": "Alameda Alliance",
        "status": "Approved"
      },
      {
        "payerId": "pyr-chcn",
        "payerName": "Community Health Center Network (CHCN)",
        "status": "Approved"
      }
    ],
    "active": true,
    "isDemo": false,
    "contractInfo": {
      "dob": "1985-07-03",
      "taxonomy": "235Z00000X",
      "licenseNumber": "41835"
    }
  }
];

export const INITIAL_CREDENTIALING_RECORDS: CredentialingRecord[] = [];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [];

export const DEFAULT_STAGE_CONFIGS: StageConfig[] = [
  {
    id: 'stg-01',
    name: 'Intake',
    category: 'Pre-Submission',
    description: 'Initial intake of provider credentialing request, roster assignment, and initial requirements verification.',
    slaTurnaroundTargetDays: 1,
    isMandatory: true,
    order: 1,
    badgeColor: 'slate',
    isActive: true,
  },
  {
    id: 'stg-02',
    name: 'Documents Pending',
    category: 'Pre-Submission',
    description: 'Awaiting critical clinician documents (W-9, COI, state licenses, degree diplomas, CV, DEA).',
    slaTurnaroundTargetDays: 3,
    isMandatory: true,
    order: 2,
    badgeColor: 'blue',
    isActive: true,
  },
  {
    id: 'stg-03',
    name: 'Documents Complete',
    category: 'Pre-Submission',
    description: 'All required provider documentation gathered, verified against checklist, and validated for completeness.',
    slaTurnaroundTargetDays: 1,
    isMandatory: true,
    order: 3,
    badgeColor: 'teal',
    isActive: true,
  },
  {
    id: 'stg-04',
    name: 'CAQH Pending',
    category: 'Pre-Submission',
    description: 'Awaiting CAQH ProView attestation, profile updates, credential releases, or payer access authorization.',
    slaTurnaroundTargetDays: 2,
    order: 4,
    badgeColor: 'indigo',
    isActive: true,
  },
  {
    id: 'stg-05',
    name: 'PAVE Pending',
    category: 'Pre-Submission',
    description: 'California Medicaid / Medi-Cal PAVE portal clinician enrollment and facility rendering site submission pending.',
    slaTurnaroundTargetDays: 3,
    order: 5,
    badgeColor: 'purple',
    isActive: true,
  },
  {
    id: 'stg-06',
    name: 'Application Preparation',
    category: 'Pre-Submission',
    description: 'Drafting payer-specific forms, assembling packet, and conducting Section 5.10 Legal Entity & DBA pre-submission checks.',
    slaTurnaroundTargetDays: 2,
    isMandatory: true,
    order: 6,
    badgeColor: 'amber',
    isActive: true,
  },
  {
    id: 'stg-07',
    name: 'Application Submitted',
    category: 'In-Review',
    description: 'Application formally transmitted to payer (portal, email, or physical mail) with confirmation tracking ID.',
    slaTurnaroundTargetDays: 0,
    isMandatory: true,
    order: 7,
    badgeColor: 'sky',
    isActive: true,
  },
  {
    id: 'stg-08',
    name: 'Payer Review',
    category: 'In-Review',
    description: 'Application under active evaluation by payer credentialing committee; tracked on automated 7–10 day follow-up cadence.',
    slaTurnaroundTargetDays: 60,
    isMandatory: true,
    order: 8,
    badgeColor: 'sky',
    isActive: true,
  },
  {
    id: 'stg-09',
    name: 'Additional Documents Requested',
    category: 'In-Review',
    description: 'Payer issued formal Request for Information (RFI) or requested supplemental practice evidence.',
    slaTurnaroundTargetDays: 2,
    order: 9,
    badgeColor: 'amber',
    isActive: true,
  },
  {
    id: 'stg-10',
    name: 'Correction Required',
    category: 'In-Review',
    description: 'Payer returned application due to demographic, taxonomy, address, or legal entity discrepancy.',
    slaTurnaroundTargetDays: 2,
    order: 10,
    badgeColor: 'amber',
    isActive: true,
  },
  {
    id: 'stg-11',
    name: 'Resubmitted',
    category: 'In-Review',
    description: 'Corrected application packet and requested supplemental files resubmitted back to payer review team.',
    slaTurnaroundTargetDays: 1,
    order: 11,
    badgeColor: 'indigo',
    isActive: true,
  },
  {
    id: 'stg-12',
    name: 'Approved',
    category: 'Approval & Linking',
    description: 'Payer credentialing committee issued formal approval letter with initial credentialing credentialing decision.',
    slaTurnaroundTargetDays: 1,
    isMandatory: true,
    order: 12,
    badgeColor: 'emerald',
    isActive: true,
  },
  {
    id: 'stg-13',
    name: 'Linking Pending',
    category: 'Approval & Linking',
    description: 'Approved provider is queued for facility/group NPI linking under correct Legal Entity & DBA (FR-014).',
    slaTurnaroundTargetDays: 5,
    isMandatory: true,
    order: 13,
    badgeColor: 'purple',
    isActive: true,
  },
  {
    id: 'stg-14',
    name: 'Linked',
    category: 'Approval & Linking',
    description: 'Provider successfully linked to group contract, practice location, and billing tax ID (TIN).',
    slaTurnaroundTargetDays: 2,
    isMandatory: true,
    order: 14,
    badgeColor: 'teal',
    isActive: true,
  },
  {
    id: 'stg-15',
    name: 'Effective',
    category: 'Completed / Closed',
    description: 'Effective date confirmed in payer portal; billing hold released and claims authorized for reimbursement.',
    slaTurnaroundTargetDays: 0,
    isMandatory: true,
    order: 15,
    badgeColor: 'emerald',
    isActive: true,
  },
  {
    id: 'stg-16',
    name: 'Closed / Not Contracted',
    category: 'Completed / Closed',
    description: 'Application closed, withdrawn, or payer panel is closed for this specialty or geographic service area.',
    slaTurnaroundTargetDays: 0,
    order: 16,
    badgeColor: 'slate',
    isActive: true,
  },
  {
    id: 'stg-17',
    name: 'Recredentialing Due',
    category: 'Maintenance / Alert',
    description: 'Payer re-credentialing cycle approaching (every 2-3 years) requiring re-attestation and updated records.',
    slaTurnaroundTargetDays: 30,
    isSystemAssigned: true,
    order: 17,
    badgeColor: 'pink',
    isActive: true,
  },
  {
    id: 'stg-18',
    name: 'Overdue',
    category: 'Maintenance / Alert',
    description: 'Payer follow-up or credentialing milestone exceeded scheduled date without documented contact (system-assigned).',
    slaTurnaroundTargetDays: 0,
    isSystemAssigned: true,
    order: 18,
    badgeColor: 'rose',
    isActive: true,
  },
];

// Helper function to check if an employee record is demo data
export const isDemoEmployee = (emp: Partial<Employee>): boolean => {
  if (!emp) return false;
  if (emp.isDemo) return true;
  if (emp.id && (emp.id.startsWith('emp-prv-') || emp.id.startsWith('emp-usr-'))) return true;
  return false;
};

// Isolated Demo Employee Database (Default empty)
export const DEMO_EMPLOYEES: Employee[] = [];

// Production Employees Database (Default empty for real production accounts & new users)
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    "id": "emp-prv-ages-rbt-anthony-flores",
    "firstName": "Anthony",
    "lastName": "Flores",
    "fullName": "Anthony Flores",
    "email": "anthony.flores@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Program Supervisor (PS)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-10-27",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-24-388462. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-cynthia-hernandez-ambriz",
    "firstName": "Cynthia",
    "lastName": "Hernandez Ambriz",
    "fullName": "Cynthia Hernandez Ambriz",
    "email": "cynthia.hernandezambriz@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Program Supervisor (PS)",
    "employmentStatus": "Full-Time",
    "startDate": "2020-06-30",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-20-126437. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-leslie-loi",
    "firstName": "Leslie",
    "lastName": "Loi",
    "fullName": "Leslie Loi",
    "email": "leslie.loi@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-03-28",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-23-265638. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-meliya-norton",
    "firstName": "Meliya",
    "lastName": "Norton",
    "fullName": "Meliya Norton",
    "email": "meliya.norton@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-04-15",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-428447. Region: Vacaville.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-pilar-moreno",
    "firstName": "Pilar",
    "lastName": "Moreno",
    "fullName": "Pilar Moreno",
    "email": "pilar.moreno@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-07-18",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-24-362804. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-marla-martinez",
    "firstName": "Marla",
    "lastName": "Martinez",
    "fullName": "Marla Martinez",
    "email": "marla.martinez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-05-18",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-437472. Region: Vacaville.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-lena-vidana",
    "firstName": "Lena",
    "lastName": "Vidana",
    "fullName": "Lena Vidana",
    "email": "lena.vidana@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-07-16",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-454056. Region: Vacaville.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-audrey-fenner",
    "firstName": "Audrey",
    "lastName": "Fenner",
    "fullName": "Audrey Fenner",
    "email": "audrey.fenner@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-01-11",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-405099. Region: Livermore.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-nuha-ibrahim",
    "firstName": "Nuha",
    "lastName": "Ibrahim",
    "fullName": "Nuha Ibrahim",
    "email": "nuha.ibrahim@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-08-15",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-463593. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-tochi-ezeife",
    "firstName": "Tochi",
    "lastName": "Ezeife",
    "fullName": "Tochi Ezeife",
    "email": "tochi.ezeife@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-12-19",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-501919. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-gabriel-lopez",
    "firstName": "Gabriel",
    "lastName": "Lopez",
    "fullName": "Gabriel Lopez",
    "email": "gabriel.lopez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-24",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-23-281159. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-elizabeth-vega",
    "firstName": "Elizabeth",
    "lastName": "Vega",
    "fullName": "Elizabeth Vega",
    "email": "elizabeth.vega@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-10-05",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-479211. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-aditi-kamboj",
    "firstName": "Aditi",
    "lastName": "Kamboj",
    "fullName": "Aditi Kamboj",
    "email": "aditi.kamboj@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2026-05-09",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-26-536374. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-ana-reyes-acosta",
    "firstName": "Ana",
    "lastName": "Reyes Acosta",
    "fullName": "Ana Reyes Acosta",
    "email": "ana.reyesacosta@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-11-30",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-23-313943. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-caitlin-scheuer",
    "firstName": "Caitlin",
    "lastName": "Scheuer",
    "fullName": "Caitlin Scheuer",
    "email": "caitlin.scheuer@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Program Supervisor (PS)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-05-01",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-22-214435. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-camary-davis",
    "firstName": "Camary",
    "lastName": "Davis",
    "fullName": "Camary Davis",
    "email": "camary.davis@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-11-11",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-490438. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-camille-andes",
    "firstName": "Camille",
    "lastName": "Andes",
    "fullName": "Camille Andes",
    "email": "camille.andes@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-03-05",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-416629. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-claudia-cruz",
    "firstName": "Claudia",
    "lastName": "Cruz",
    "fullName": "Claudia Cruz",
    "email": "claudia.cruz@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-04-03",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-22-210211. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-colton-hudson",
    "firstName": "Colton",
    "lastName": "Hudson",
    "fullName": "Colton Hudson",
    "email": "colton.hudson@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-10-16",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-482417. Region: Livermore.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-holly-uibel",
    "firstName": "Holly",
    "lastName": "Uibel",
    "fullName": "Holly Uibel",
    "email": "holly.uibel@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-06-07",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-21-171020. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-isabel-white",
    "firstName": "Isabel",
    "lastName": "White",
    "fullName": "Isabel White",
    "email": "isabel.white@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-01-21",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-22-200665. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-isabella-phan",
    "firstName": "Isabella",
    "lastName": "Phan",
    "fullName": "Isabella Phan",
    "email": "isabella.phan@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-05-22",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-438501. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-jacqlynn-uribe",
    "firstName": "Jacqlynn",
    "lastName": "Uribe",
    "fullName": "Jacqlynn Uribe",
    "email": "jacqlynn.uribe@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2026-03-22",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-26-523943. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-jasmine-espinoza",
    "firstName": "Jasmine",
    "lastName": "Espinoza",
    "fullName": "Jasmine Espinoza",
    "email": "jasmine.espinoza@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-16",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-23-279622. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-jaspreet-kaur",
    "firstName": "Jaspreet",
    "lastName": "Kaur",
    "fullName": "Jaspreet Kaur",
    "email": "jaspreet.kaur@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-jazmine-tostado",
    "firstName": "Jazmine",
    "lastName": "Tostado",
    "fullName": "Jazmine Tostado",
    "email": "jazmine.tostado@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-12-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-24-396733. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-jennifer-mislang",
    "firstName": "Jennifer",
    "lastName": "Mislang",
    "fullName": "Jennifer Mislang",
    "email": "jennifer.mislang@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2026-01-18",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-26-509051. Region: Livermore.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-jonathan-greene",
    "firstName": "Jonathan",
    "lastName": "Greene",
    "fullName": "Jonathan Greene",
    "email": "jonathan.greene@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-04-11",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-427903. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-juan-chavez",
    "firstName": "Juan",
    "lastName": "Chavez",
    "fullName": "Juan Chavez",
    "email": "juan.chavez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-julianna-david",
    "firstName": "Julianna",
    "lastName": "David",
    "fullName": "Julianna David",
    "email": "julianna.david@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-10-18",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-483658. Region: Livermore.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-kaitlin-djiusni",
    "firstName": "Kaitlin",
    "lastName": "Djiusni",
    "fullName": "Kaitlin Djiusni",
    "email": "kaitlin.djiusni@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-06-25",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-22-222375. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-kyla-kersh",
    "firstName": "Kyla",
    "lastName": "Kersh",
    "fullName": "Kyla Kersh",
    "email": "kyla.kersh@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-04-07",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-23-267617. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-lauren-krause",
    "firstName": "Lauren",
    "lastName": "Krause",
    "fullName": "Lauren Krause",
    "email": "lauren.krause@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-12-22",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-502608. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-lisa-latina-michell-sisneroz",
    "firstName": "Lisa",
    "lastName": "Latina Michell Sisneroz",
    "fullName": "Lisa Latina Michell Sisneroz",
    "email": "lisa.latinamichellsisneroz@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-07-27",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-457764. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-loc-le",
    "firstName": "Loc",
    "lastName": "Le",
    "fullName": "Loc Le",
    "email": "loc.le@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-08-23",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-23-293235. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-lois-tolman",
    "firstName": "Lois",
    "lastName": "Tolman",
    "fullName": "Lois Tolman",
    "email": "lois.tolman@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-07-30",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-458942. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-marilena-mancias",
    "firstName": "Marilena",
    "lastName": "Mancias",
    "fullName": "Marilena Mancias",
    "email": "marilena.mancias@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: Livermore.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-paola-lopez",
    "firstName": "Paola",
    "lastName": "Lopez",
    "fullName": "Paola Lopez",
    "email": "paola.lopez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Program Supervisor (PS)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-06-24",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-21-173263. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-raquel-rodriguez",
    "firstName": "Raquel",
    "lastName": "Rodriguez",
    "fullName": "Raquel Rodriguez",
    "email": "raquel.rodriguez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Program Supervisor (PS)",
    "employmentStatus": "Full-Time",
    "startDate": "2018-08-22",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-18-63920. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-regen-spendlove",
    "firstName": "Regen",
    "lastName": "Spendlove",
    "fullName": "Regen Spendlove",
    "email": "regen.spendlove@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-01-15",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-22-199954. Region: Utah.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-reyna-munoz",
    "firstName": "Reyna",
    "lastName": "Munoz",
    "fullName": "Reyna Munoz",
    "email": "reyna.munoz@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-02-20",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-413640. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-rhett-bruce",
    "firstName": "Rhett",
    "lastName": "Bruce",
    "fullName": "Rhett Bruce",
    "email": "rhett.bruce@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-05-22",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-24-349207. Region: Livermore.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-robinae-devereaux-carter",
    "firstName": "Robinae",
    "lastName": "Devereaux-Carter",
    "fullName": "Robinae Devereaux-Carter",
    "email": "robinae.devereaux-carter@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-08-15",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-463605. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-tiffany-catherine-narducci",
    "firstName": "Tiffany",
    "lastName": "Catherine Narducci",
    "fullName": "Tiffany Catherine Narducci",
    "email": "tiffany.catherinenarducci@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-05-14",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-24-347294. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-william-fonseca",
    "firstName": "William",
    "lastName": "Fonseca",
    "fullName": "William Fonseca",
    "email": "william.fonseca@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2026-02-06",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-26-513281. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-william-loera",
    "firstName": "William",
    "lastName": "Loera",
    "fullName": "William Loera",
    "email": "william.loera@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-11-25",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-494625. Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-citlally-vallejo",
    "firstName": "Citlally",
    "lastName": "Vallejo",
    "fullName": "Citlally Vallejo",
    "email": "citlally.vallejo@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-09-25",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-475720. Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-naomi-mascorro",
    "firstName": "Naomi",
    "lastName": "Mascorro",
    "fullName": "Naomi Mascorro",
    "email": "naomi.mascorro@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-03-30",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-25-424406. Region: Vacaville.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-kelsey-kay",
    "firstName": "Kelsey",
    "lastName": "Kay",
    "fullName": "Kelsey Kay",
    "email": "kelsey.kay@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2026-02-19",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-26-516272. Region: Vacaville.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-kevin-stephens",
    "firstName": "Kevin",
    "lastName": "Stephens",
    "fullName": "Kevin Stephens",
    "email": "kevin.stephens@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Program Supervisor (PS)",
    "employmentStatus": "Full-Time",
    "startDate": "2026-08-02",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: RBT-26-2835903. Region: Vacaville.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-erik-zehm",
    "firstName": "Erik",
    "lastName": "Zehm",
    "fullName": "Erik Zehm",
    "email": "erik.zehm@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-karime-ruiz-alvarez",
    "firstName": "Karime",
    "lastName": "Ruiz Alvarez",
    "fullName": "Karime Ruiz Alvarez",
    "email": "karime.ruizalvarez@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-leneea-gaither",
    "firstName": "Leneea",
    "lastName": "Gaither",
    "fullName": "Leneea Gaither",
    "email": "leneea.gaither@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-lissette-esperanza",
    "firstName": "Lissette",
    "lastName": "Esperanza",
    "fullName": "Lissette Esperanza",
    "email": "lissette.esperanza@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-marissa-napier",
    "firstName": "Marissa",
    "lastName": "Napier",
    "fullName": "Marissa Napier",
    "email": "marissa.napier@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: Brentwood.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-noah-johnson",
    "firstName": "Noah",
    "lastName": "Johnson",
    "fullName": "Noah Johnson",
    "email": "noah.johnson@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-rbt-zoe-zettas",
    "firstName": "Zoe",
    "lastName": "Zettas",
    "fullName": "Zoe Zettas",
    "email": "zoe.zettas@ageslearningsolutions.com",
    "phone": "(408) 555-0190",
    "department": "Clinical Services - ABA",
    "roleTitle": "Registered Behavior Technician (RBT)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-01",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "RBT certification: . Region: San Jose.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-erica-bustos",
    "firstName": "Erica",
    "lastName": "Bustos",
    "fullName": "Erica Bustos",
    "email": "erica.bustos@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2012-01-31",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 3013264. Region: San Jose. CAQH: 13805243.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-darcy-machado",
    "firstName": "Darcy",
    "lastName": "Machado",
    "fullName": "Darcy Machado",
    "email": "darcy.machado@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2020-02-22",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 14276255. Region: San Jose. CAQH: 15110516.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-sasha-torres",
    "firstName": "Sasha",
    "lastName": "Torres",
    "fullName": "Sasha Torres",
    "email": "sasha.torres@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2013-09-30",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 4806240. Region: San Jose. CAQH: 12638040.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-tracy-rodriguez",
    "firstName": "Tracy",
    "lastName": "Rodriguez",
    "fullName": "Tracy Rodriguez",
    "email": "tracy.rodriguez@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-05-18",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 17570743. Region: San Jose. CAQH: 15157857.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-peter-chen",
    "firstName": "Peter",
    "lastName": "Chen",
    "fullName": "Peter Chen",
    "email": "peter.chen@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-01-19",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 20351701. Region: San Jose. CAQH: 15493975.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-natasha-chaudhry",
    "firstName": "Natasha",
    "lastName": "Chaudhry",
    "fullName": "Natasha Chaudhry",
    "email": "natasha.chaudhry@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-10-13",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 19112066. Region: San Jose. CAQH: 15423187.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-jennine-simpson",
    "firstName": "Jennine",
    "lastName": "Simpson",
    "fullName": "Jennine Simpson",
    "email": "jennine.simpson@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2019-05-31",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 12382471. Region: San Jose. CAQH: 15044394.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-jesus-belmonte",
    "firstName": "Jesus",
    "lastName": "Belmonte",
    "fullName": "Jesus Belmonte",
    "email": "jesus.belmonte@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2020-09-25",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 15710927. Region: Livermore. CAQH: 14978507.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-maria-vazquez",
    "firstName": "Maria",
    "lastName": "Vazquez",
    "fullName": "Maria Vazquez",
    "email": "maria.vazquez@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-12-13",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 27856340. Region: San Jose. CAQH: 16385498.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-leanne-simon",
    "firstName": "Leanne",
    "lastName": "Simon",
    "fullName": "Leanne Simon",
    "email": "leanne.simon@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2017-02-28",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 8643847. Region: Livermore. CAQH: 13782768.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-brianna-bader",
    "firstName": "Brianna",
    "lastName": "Bader",
    "fullName": "Brianna Bader",
    "email": "brianna.bader@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-04-16",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 28794283. Region: San Jose. CAQH: 16493372.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-amy-heaps",
    "firstName": "Amy",
    "lastName": "Heaps",
    "fullName": "Amy Heaps",
    "email": "amy.heaps@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2018-11-30",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 11492375. Region: Utah. CAQH: 14393821.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-andrea-mathews",
    "firstName": "Andrea",
    "lastName": "Mathews",
    "fullName": "Andrea Mathews",
    "email": "andrea.mathews@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-02-23",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 16807751. Region: Utah. CAQH: 15092648.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-leslie-sundblom",
    "firstName": "Leslie",
    "lastName": "Sundblom",
    "fullName": "Leslie Sundblom",
    "email": "leslie.sundblom@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-02-08",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 25300738. Region: Utah. CAQH: 16145811.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-johnny-new",
    "firstName": "Johnny",
    "lastName": "New",
    "fullName": "Johnny New",
    "email": "johnny.new@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-06-23",
    "officeLocationId": "loc-5",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 29307450. Region: Utah. CAQH: 16567841.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-hailey-james",
    "firstName": "Hailey",
    "lastName": "James",
    "fullName": "Hailey James",
    "email": "hailey.james@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-10-19",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 24529710. Region: Vacaville. CAQH: 16055818.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-karl-michael-kangleon",
    "firstName": "Karl",
    "lastName": "Michael Kangleon",
    "fullName": "Karl Michael Kangleon",
    "email": "karl.michaelkangleon@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2025-08-02",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 29706295. Region: Vacaville. CAQH: 16598662.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-india-izidoro-baker",
    "firstName": "India",
    "lastName": "Izidoro Baker",
    "fullName": "India Izidoro Baker",
    "email": "india.izidorobaker@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-09-30",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 24361334. Region: Brentwood. CAQH: 14617141.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-melody-goh",
    "firstName": "Melody",
    "lastName": "Goh",
    "fullName": "Melody Goh",
    "email": "melody.goh@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-05-10",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 17501712. Region: Livermore. CAQH: 16592947.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-meghan-moriana",
    "firstName": "Meghan",
    "lastName": "Moriana",
    "fullName": "Meghan Moriana",
    "email": "meghan.moriana@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2018-08-31",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 10793300. Region: Brentwood. CAQH: 14377120.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-jacob-lopez",
    "firstName": "Jacob",
    "lastName": "Lopez",
    "fullName": "Jacob Lopez",
    "email": "jacob.lopez@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2026-02-26",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 31456538. Region: Brentwood. CAQH: 16760752.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-elise-newman",
    "firstName": "Elise",
    "lastName": "Newman",
    "fullName": "Elise Newman",
    "email": "elise.newman@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-29",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 25217098. Region: San Jose. CAQH: 16155472.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-brittany-stack",
    "firstName": "Brittany",
    "lastName": "Stack",
    "fullName": "Brittany Stack",
    "email": "brittany.stack@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2020-06-22",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 14942457. Region: Vacaville. CAQH: 14928309.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-jade-saechao",
    "firstName": "Jade",
    "lastName": "Saechao",
    "fullName": "Jade Saechao",
    "email": "jade.saechao@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2024-01-11",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: 25129074. Region: Vacaville. CAQH: 16112183.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-manjot-sandhu",
    "firstName": "Manjot",
    "lastName": "Sandhu",
    "fullName": "Manjot Sandhu",
    "email": "manjot.sandhu@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2018-01-15",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-18-9921. Region: San Jose. CAQH: 15482910.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-angela-jung",
    "firstName": "Angela",
    "lastName": "Jung",
    "fullName": "Angela Jung",
    "email": "angela.jung@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-03-10",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-21-3912. Region: San Jose. CAQH: 16120391.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-keiko-ushijima-mwesigwa",
    "firstName": "Keiko",
    "lastName": "Ushijima-Mwesigwa",
    "fullName": "Keiko Ushijima-Mwesigwa",
    "email": "keiko.ushijima-mwesigwa@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2019-08-14",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-19-4820. Region: San Jose. CAQH: 15920182.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-kristi-lui",
    "firstName": "Kristi",
    "lastName": "Lui",
    "fullName": "Kristi Lui",
    "email": "kristi.lui@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2020-09-12",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-20-4910. Region: San Jose. CAQH: 15392019.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-rabita-osorio",
    "firstName": "Rabita",
    "lastName": "Osorio",
    "fullName": "Rabita Osorio",
    "email": "rabita.osorio@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2017-04-12",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-17-3810. Region: San Jose. CAQH: 14920184.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-serena-richardson",
    "firstName": "Serena",
    "lastName": "Richardson",
    "fullName": "Serena Richardson",
    "email": "serena.richardson@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-07-15",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-22-4918. Region: San Jose. CAQH: 16382019.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-anthony-verzi-jr",
    "firstName": "Anthony",
    "lastName": "Verzi Jr",
    "fullName": "Anthony Verzi Jr",
    "email": "anthony.verzijr@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2020-05-20",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-20-3918. Region: San Jose. CAQH: 15820194.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-pamela-yata",
    "firstName": "Pamela",
    "lastName": "Yata",
    "fullName": "Pamela Yata",
    "email": "pamela.yata@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-11-10",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-21-4912. Region: San Jose. CAQH: 15729184.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-itzel-bernal",
    "firstName": "Itzel",
    "lastName": "Bernal",
    "fullName": "Itzel Bernal",
    "email": "itzel.bernal@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-12-22",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-22-3819. Region: San Jose. CAQH: 15928104.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-monica-yeo",
    "firstName": "Monica",
    "lastName": "Yeo",
    "fullName": "Monica Yeo",
    "email": "monica.yeo@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2021-06-18",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-21-5820. Region: San Jose. CAQH: 16492018.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-patricia-nishan",
    "firstName": "Patricia",
    "lastName": "Nishan",
    "fullName": "Patricia Nishan",
    "email": "patricia.nishan@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2019-10-05",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-19-2918. Region: San Jose. CAQH: 15839201.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-nia-freeman",
    "firstName": "Nia",
    "lastName": "Freeman",
    "fullName": "Nia Freeman",
    "email": "nia.freeman@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2022-04-14",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-22-4820. Region: San Jose. CAQH: 16281049.",
    "isDemo": false
  },
  {
    "id": "emp-prv-ages-bcba-savan-patel",
    "firstName": "Savan",
    "lastName": "Patel",
    "fullName": "Savan Patel",
    "email": "savan.patel@ageslearningsolutions.com",
    "phone": "(408) 555-0150",
    "department": "Clinical Services - Behavior Analysis",
    "roleTitle": "Board Certified Behavior Analyst (BCBA)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-02-18",
    "officeLocationId": "loc-3",
    "entityId": "ent-1",
    "notes": "BCBA Cert: BCBA-23-4912. Region: San Jose. CAQH: 16492014.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-pranali-kalley",
    "firstName": "Pranali",
    "lastName": "Kalley",
    "fullName": "Pranali Kalley",
    "email": "pranalik.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 17412. CAQH: 16082051. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-lauren-pourreau",
    "firstName": "Lauren",
    "lastName": "Pourreau",
    "fullName": "Lauren Pourreau",
    "email": "laurens.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 33881. CAQH: 15997800. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-jacqueline-valles",
    "firstName": "Jacqueline",
    "lastName": "Valles",
    "fullName": "Jacqueline Valles",
    "email": "jacquelinev.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 40779. CAQH: 16693378. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-georgina-aidee-vasquez",
    "firstName": "Georgina",
    "lastName": "Aidee Vasquez",
    "fullName": "Georgina Aidee Vasquez",
    "email": "georginav.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 40931. CAQH: 16862210. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-christine-woods",
    "firstName": "Christine",
    "lastName": "Woods",
    "fullName": "Christine Woods",
    "email": "christinew.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: SP17047. CAQH: 12191219. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-shuyi-tong",
    "firstName": "Shuyi",
    "lastName": "Tong",
    "fullName": "Shuyi Tong",
    "email": "shuyit.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 40014. CAQH: 16307669. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-yi-liu",
    "firstName": "Yi",
    "lastName": "Liu",
    "fullName": "Yi Liu",
    "email": "anna.l@cptherapyservices.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 39995. CAQH: 16322180. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-sandra-manzo",
    "firstName": "Sandra",
    "lastName": "Manzo",
    "fullName": "Sandra Manzo",
    "email": "sandram.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 23638. CAQH: 16147156. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-valeria-ruvalcaba",
    "firstName": "Valeria",
    "lastName": "Ruvalcaba",
    "fullName": "Valeria Ruvalcaba",
    "email": "valeriar.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 41447. CAQH: 16831795. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-aruna-radhakrishnan",
    "firstName": "Aruna",
    "lastName": "Radhakrishnan",
    "fullName": "Aruna Radhakrishnan",
    "email": "arunar.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: SP16932. CAQH: 14424452. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-catherine-doerr",
    "firstName": "Catherine",
    "lastName": "Doerr",
    "fullName": "Catherine Doerr",
    "email": "catherined.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 33763. CAQH: 15673999. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-alicia-nordstrom",
    "firstName": "Alicia",
    "lastName": "Nordstrom",
    "fullName": "Alicia Nordstrom",
    "email": "alician.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 29583. CAQH: 15266199. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-dillon-o-connell",
    "firstName": "Dillon",
    "lastName": "O'Connell",
    "fullName": "Dillon O'Connell",
    "email": "dillono.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 33486. CAQH: 15696150. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-valerie-russell",
    "firstName": "Valerie",
    "lastName": "Russell",
    "fullName": "Valerie Russell",
    "email": "valerievr.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 29847. CAQH: 16143512. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-sierra-bone",
    "firstName": "Sierra",
    "lastName": "Bone",
    "fullName": "Sierra Bone",
    "email": "sierrab.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 30178. CAQH: 15094231. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-heather-zamani",
    "firstName": "Heather",
    "lastName": "Zamani",
    "fullName": "Heather Zamani",
    "email": "heatherz.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 29515. CAQH: 15807520. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-shannon-knapp",
    "firstName": "Shannon",
    "lastName": "Knapp",
    "fullName": "Shannon Knapp",
    "email": "shannonk.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 35991. CAQH: 14099519. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-jaclyn-magner",
    "firstName": "Jaclyn",
    "lastName": "Magner",
    "fullName": "Jaclyn Magner",
    "email": "jaclynm.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 19145. CAQH: 16145811. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-stacey-romero",
    "firstName": "Stacey",
    "lastName": "Romero",
    "fullName": "Stacey Romero",
    "email": "staceyr.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 9106. CAQH: 15920194. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-christina-harman",
    "firstName": "Christina",
    "lastName": "Harman",
    "fullName": "Christina Harman",
    "email": "christinah.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: 25830. CAQH: 13582408. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-rocio-azocar",
    "firstName": "Rocio",
    "lastName": "Azocar",
    "fullName": "Rocio Azocar",
    "email": "rocioa.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: SP30928. CAQH: 16920194. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-pstg-slp-fernanda-astudillo",
    "firstName": "Fernanda",
    "lastName": "Astudillo",
    "fullName": "Fernanda Astudillo",
    "email": "fernandaa.slp@proficiotherapy.com",
    "phone": "(925) 315-4024",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-01-15",
    "officeLocationId": "loc-1",
    "entityId": "ent-pstg-inc",
    "notes": "License: SP34626. CAQH: 16829104. Org: Proficio Speech Therapy Group.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-miranda-freeman",
    "firstName": "Miranda",
    "lastName": "Freeman",
    "fullName": "Miranda Freeman",
    "email": "miranda@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 22890. CAQH: 15920517. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-alyssa-barker",
    "firstName": "Alyssa",
    "lastName": "Barker",
    "fullName": "Alyssa Barker",
    "email": "aly@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 27856. CAQH: 16553799. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-emily-gayton",
    "firstName": "Emily",
    "lastName": "Gayton",
    "fullName": "Emily Gayton",
    "email": "emily@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 28130. CAQH: 16629183. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-keara-greenan",
    "firstName": "Keara",
    "lastName": "Greenan",
    "fullName": "Keara Greenan",
    "email": "keara@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 25938. CAQH: 16349233. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-elena-javier",
    "firstName": "Elena",
    "lastName": "Javier",
    "fullName": "Elena Javier",
    "email": "elena@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 21333. CAQH: 15150292. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-deana-kamiya",
    "firstName": "Deana",
    "lastName": "Kamiya",
    "fullName": "Deana Kamiya",
    "email": "deana@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 26815. CAQH: 16291187. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-irene-lestari",
    "firstName": "Irene",
    "lastName": "Lestari",
    "fullName": "Irene Lestari",
    "email": "irene@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 7552. CAQH: 15668412. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-crystal-fuentez",
    "firstName": "Crystal",
    "lastName": "Fuentez",
    "fullName": "Crystal Fuentez",
    "email": "crystal@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 23285. CAQH: 15586534. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-graydon-larsen",
    "firstName": "Graydon",
    "lastName": "Larsen",
    "fullName": "Graydon Larsen",
    "email": "graydon@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 12814739-4201. CAQH: 15805043. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-natalie-merrill",
    "firstName": "Natalie",
    "lastName": "Merrill",
    "fullName": "Natalie Merrill",
    "email": "natalie@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 14270093-4201. CAQH: 16804205. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-christina-gallo",
    "firstName": "Christina",
    "lastName": "Gallo",
    "fullName": "Christina Gallo",
    "email": "christinag@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 14268177-4201, 11034. CAQH: 15668351. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-morgan-king",
    "firstName": "Morgan",
    "lastName": "King",
    "fullName": "Morgan King",
    "email": "morgank@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 24710. CAQH: 16839254. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-miriam-garcia",
    "firstName": "Miriam",
    "lastName": "Garcia",
    "fullName": "Miriam Garcia",
    "email": "miriamg@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 29588. CAQH: 16917799. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-sabrina-figueroa",
    "firstName": "Sabrina",
    "lastName": "Figueroa",
    "fullName": "Sabrina Figueroa",
    "email": "sabrinaf@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 29601. CAQH: 16917095. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-ot-allison-inloes",
    "firstName": "Allison",
    "lastName": "Inloes",
    "fullName": "Allison Inloes",
    "email": "allisoni@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Occupational Therapy",
    "roleTitle": "Occupational Therapist (OTR/L)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-05-15",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 21948. CAQH: 16164780. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-slp-brenda-castro",
    "firstName": "Brenda",
    "lastName": "Castro",
    "fullName": "Brenda Castro",
    "email": "brenda@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 32414. CAQH: 16602383. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-slp-chitra-lakshumanan",
    "firstName": "Chitra",
    "lastName": "Lakshumanan",
    "fullName": "Chitra Lakshumanan",
    "email": "chitra@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 38254. CAQH: 15164471. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-slp-leah-schwenk",
    "firstName": "Leah",
    "lastName": "Schwenk",
    "fullName": "Leah Schwenk",
    "email": "leahs@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 38923. CAQH: 16051043. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-slp-christine-woods",
    "firstName": "Christine",
    "lastName": "Woods",
    "fullName": "Christine Woods",
    "email": "christine.w@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 17047. CAQH: 12191219. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-slp-sierra-bone",
    "firstName": "Sierra",
    "lastName": "Bone",
    "fullName": "Sierra Bone",
    "email": "sierrab.slp@proficiotherapy.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 30178. CAQH: 15094231. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-slp-yi-liu",
    "firstName": "Yi",
    "lastName": "Liu",
    "fullName": "Yi Liu",
    "email": "anna.l@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 39995. CAQH: 16322180. Org: Child's Play Therapy Services.",
    "isDemo": false
  },
  {
    "id": "emp-prv-cpts-slp-shannon-singleton",
    "firstName": "Shannon",
    "lastName": "Singleton",
    "fullName": "Shannon Singleton",
    "email": "shannons@cptherapyservices.com",
    "phone": "(925) 555-0199",
    "department": "Clinical Services - Speech Pathology",
    "roleTitle": "Speech-Language Pathologist (SLP)",
    "employmentStatus": "Full-Time",
    "startDate": "2023-06-01",
    "officeLocationId": "loc-2",
    "entityId": "ent-3",
    "notes": "License: 41835. CAQH: 16856264. Org: Child's Play Therapy Services.",
    "isDemo": false
  }
];

// Dedicated Separate Database for Clinical Staff (Default empty)
export const INITIAL_CLINICAL_STAFF: ClinicalStaff[] = [
  {
    "id": "cs-prv-ages-rbt-anthony-flores",
    "employeeId": "emp-prv-ages-rbt-anthony-flores",
    "providerId": "prv-ages-rbt-anthony-flores",
    "firstName": "Anthony",
    "lastName": "Flores",
    "fullName": "Anthony Flores",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-24-388462",
    "licenseState": "CA",
    "licenseExpiration": "2026-10-27",
    "npi": "1205638822",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-24-388462",
    "rbtEffectiveDate": "2024-10-27",
    "rbtExpiryDate": "2026-10-27",
    "role": "PS",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-anthony-flores",
      "firstName": "Anthony",
      "lastName": "Flores",
      "fullName": "Anthony Flores",
      "credentials": "PS, RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "anthony.flores@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1205638822",
      "licenseNumber": "RBT-24-388462",
      "licenseState": "CA",
      "licenseExpiration": "2026-10-27",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-24-388462",
      "rbtEffectiveDate": "2024-10-27",
      "rbtExpiryDate": "2026-10-27",
      "role": "PS",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-10-27",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-24-388462",
        "rbtEffectiveDate": "2024-10-27",
        "rbtExpiryDate": "2026-10-27",
        "role": "PS",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-cynthia-hernandez-ambriz",
    "employeeId": "emp-prv-ages-rbt-cynthia-hernandez-ambriz",
    "providerId": "prv-ages-rbt-cynthia-hernandez-ambriz",
    "firstName": "Cynthia",
    "lastName": "Hernandez Ambriz",
    "fullName": "Cynthia Hernandez Ambriz",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-20-126437",
    "licenseState": "CA",
    "licenseExpiration": "2025-06-30",
    "npi": "1063047710",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-20-126437",
    "rbtEffectiveDate": "2020-06-30",
    "rbtExpiryDate": "2025-06-30",
    "role": "PS",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-cynthia-hernandez-ambriz",
      "firstName": "Cynthia",
      "lastName": "Hernandez Ambriz",
      "fullName": "Cynthia Hernandez Ambriz",
      "credentials": "PS, RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "cynthia.hernandezambriz@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1063047710",
      "licenseNumber": "RBT-20-126437",
      "licenseState": "CA",
      "licenseExpiration": "2025-06-30",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-20-126437",
      "rbtEffectiveDate": "2020-06-30",
      "rbtExpiryDate": "2025-06-30",
      "role": "PS",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2020-06-30",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-20-126437",
        "rbtEffectiveDate": "2020-06-30",
        "rbtExpiryDate": "2025-06-30",
        "role": "PS",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-leslie-loi",
    "employeeId": "emp-prv-ages-rbt-leslie-loi",
    "providerId": "prv-ages-rbt-leslie-loi",
    "firstName": "Leslie",
    "lastName": "Loi",
    "fullName": "Leslie Loi",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-23-265638",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-28",
    "npi": "1255047510",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-23-265638",
    "rbtEffectiveDate": "2023-03-28",
    "rbtExpiryDate": "2028-03-28",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-leslie-loi",
      "firstName": "Leslie",
      "lastName": "Loi",
      "fullName": "Leslie Loi",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "leslie.loi@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1255047510",
      "licenseNumber": "RBT-23-265638",
      "licenseState": "CA",
      "licenseExpiration": "2028-03-28",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-23-265638",
      "rbtEffectiveDate": "2023-03-28",
      "rbtExpiryDate": "2028-03-28",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-03-28",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-23-265638",
        "rbtEffectiveDate": "2023-03-28",
        "rbtExpiryDate": "2028-03-28",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-meliya-norton",
    "employeeId": "emp-prv-ages-rbt-meliya-norton",
    "providerId": "prv-ages-rbt-meliya-norton",
    "firstName": "Meliya",
    "lastName": "Norton",
    "fullName": "Meliya Norton",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-428447",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-15",
    "npi": "1881375228",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-25-428447",
    "rbtEffectiveDate": "2025-04-15",
    "rbtExpiryDate": "2028-04-15",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-meliya-norton",
      "firstName": "Meliya",
      "lastName": "Norton",
      "fullName": "Meliya Norton",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "meliya.norton@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1881375228",
      "licenseNumber": "RBT-25-428447",
      "licenseState": "CA",
      "licenseExpiration": "2028-04-15",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Vacaville",
      "rbtCertificationNumber": "RBT-25-428447",
      "rbtEffectiveDate": "2025-04-15",
      "rbtExpiryDate": "2028-04-15",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-04-15",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-428447",
        "rbtEffectiveDate": "2025-04-15",
        "rbtExpiryDate": "2028-04-15",
        "role": "RBT",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-pilar-moreno",
    "employeeId": "emp-prv-ages-rbt-pilar-moreno",
    "providerId": "prv-ages-rbt-pilar-moreno",
    "firstName": "Pilar",
    "lastName": "Moreno",
    "fullName": "Pilar Moreno",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-24-362804",
    "licenseState": "CA",
    "licenseExpiration": "2026-07-18",
    "npi": "1053171215",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-24-362804",
    "rbtEffectiveDate": "2024-07-18",
    "rbtExpiryDate": "2026-07-18",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-pilar-moreno",
      "firstName": "Pilar",
      "lastName": "Moreno",
      "fullName": "Pilar Moreno",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "pilar.moreno@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1053171215",
      "licenseNumber": "RBT-24-362804",
      "licenseState": "CA",
      "licenseExpiration": "2026-07-18",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-24-362804",
      "rbtEffectiveDate": "2024-07-18",
      "rbtExpiryDate": "2026-07-18",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-07-18",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-24-362804",
        "rbtEffectiveDate": "2024-07-18",
        "rbtExpiryDate": "2026-07-18",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-marla-martinez",
    "employeeId": "emp-prv-ages-rbt-marla-martinez",
    "providerId": "prv-ages-rbt-marla-martinez",
    "firstName": "Marla",
    "lastName": "Martinez",
    "fullName": "Marla Martinez",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-437472",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-18",
    "npi": "1154188175",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-25-437472",
    "rbtEffectiveDate": "2025-05-18",
    "rbtExpiryDate": "2028-05-18",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-marla-martinez",
      "firstName": "Marla",
      "lastName": "Martinez",
      "fullName": "Marla Martinez",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "marla.martinez@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1154188175",
      "licenseNumber": "RBT-25-437472",
      "licenseState": "CA",
      "licenseExpiration": "2028-05-18",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Vacaville",
      "rbtCertificationNumber": "RBT-25-437472",
      "rbtEffectiveDate": "2025-05-18",
      "rbtExpiryDate": "2028-05-18",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-05-18",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-437472",
        "rbtEffectiveDate": "2025-05-18",
        "rbtExpiryDate": "2028-05-18",
        "role": "RBT",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-lena-vidana",
    "employeeId": "emp-prv-ages-rbt-lena-vidana",
    "providerId": "prv-ages-rbt-lena-vidana",
    "firstName": "Lena",
    "lastName": "Vidana",
    "fullName": "Lena Vidana",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-454056",
    "licenseState": "CA",
    "licenseExpiration": "2026-07-16",
    "npi": "1578193215",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-25-454056",
    "rbtEffectiveDate": "2025-07-16",
    "rbtExpiryDate": "2026-07-16",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-lena-vidana",
      "firstName": "Lena",
      "lastName": "Vidana",
      "fullName": "Lena Vidana",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "lena.vidana@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1578193215",
      "licenseNumber": "RBT-25-454056",
      "licenseState": "CA",
      "licenseExpiration": "2026-07-16",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Vacaville",
      "rbtCertificationNumber": "RBT-25-454056",
      "rbtEffectiveDate": "2025-07-16",
      "rbtExpiryDate": "2026-07-16",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-07-16",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-454056",
        "rbtEffectiveDate": "2025-07-16",
        "rbtExpiryDate": "2026-07-16",
        "role": "RBT",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-audrey-fenner",
    "employeeId": "emp-prv-ages-rbt-audrey-fenner",
    "providerId": "prv-ages-rbt-audrey-fenner",
    "firstName": "Audrey",
    "lastName": "Fenner",
    "fullName": "Audrey Fenner",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-405099",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-11",
    "npi": "1275355679",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-25-405099",
    "rbtEffectiveDate": "2025-01-11",
    "rbtExpiryDate": "2028-01-11",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-audrey-fenner",
      "firstName": "Audrey",
      "lastName": "Fenner",
      "fullName": "Audrey Fenner",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "audrey.fenner@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1275355679",
      "licenseNumber": "RBT-25-405099",
      "licenseState": "CA",
      "licenseExpiration": "2028-01-11",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Livermore",
      "rbtCertificationNumber": "RBT-25-405099",
      "rbtEffectiveDate": "2025-01-11",
      "rbtExpiryDate": "2028-01-11",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-01-11",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-405099",
        "rbtEffectiveDate": "2025-01-11",
        "rbtExpiryDate": "2028-01-11",
        "role": "RBT",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-nuha-ibrahim",
    "employeeId": "emp-prv-ages-rbt-nuha-ibrahim",
    "providerId": "prv-ages-rbt-nuha-ibrahim",
    "firstName": "Nuha",
    "lastName": "Ibrahim",
    "fullName": "Nuha Ibrahim",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-463593",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-15",
    "npi": "1235943150",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-463593",
    "rbtEffectiveDate": "2025-08-15",
    "rbtExpiryDate": "2026-08-15",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-nuha-ibrahim",
      "firstName": "Nuha",
      "lastName": "Ibrahim",
      "fullName": "Nuha Ibrahim",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "nuha.ibrahim@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1235943150",
      "licenseNumber": "RBT-25-463593",
      "licenseState": "CA",
      "licenseExpiration": "2026-08-15",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-25-463593",
      "rbtEffectiveDate": "2025-08-15",
      "rbtExpiryDate": "2026-08-15",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-08-15",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-463593",
        "rbtEffectiveDate": "2025-08-15",
        "rbtExpiryDate": "2026-08-15",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-tochi-ezeife",
    "employeeId": "emp-prv-ages-rbt-tochi-ezeife",
    "providerId": "prv-ages-rbt-tochi-ezeife",
    "firstName": "Tochi",
    "lastName": "Ezeife",
    "fullName": "Tochi Ezeife",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-501919",
    "licenseState": "CA",
    "licenseExpiration": "2026-12-19",
    "npi": "1992576417",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-501919",
    "rbtEffectiveDate": "2025-12-19",
    "rbtExpiryDate": "2026-12-19",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-tochi-ezeife",
      "firstName": "Tochi",
      "lastName": "Ezeife",
      "fullName": "Tochi Ezeife",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "tochi.ezeife@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1992576417",
      "licenseNumber": "RBT-25-501919",
      "licenseState": "CA",
      "licenseExpiration": "2026-12-19",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-25-501919",
      "rbtEffectiveDate": "2025-12-19",
      "rbtExpiryDate": "2026-12-19",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-12-19",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-501919",
        "rbtEffectiveDate": "2025-12-19",
        "rbtExpiryDate": "2026-12-19",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-gabriel-lopez",
    "employeeId": "emp-prv-ages-rbt-gabriel-lopez",
    "providerId": "prv-ages-rbt-gabriel-lopez",
    "firstName": "Gabriel",
    "lastName": "Lopez",
    "fullName": "Gabriel Lopez",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-23-281159",
    "licenseState": "CA",
    "licenseExpiration": "2026-06-24",
    "npi": "1477264455",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-23-281159",
    "rbtEffectiveDate": "2023-06-24",
    "rbtExpiryDate": "2026-06-24",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-gabriel-lopez",
      "firstName": "Gabriel",
      "lastName": "Lopez",
      "fullName": "Gabriel Lopez",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "gabriel.lopez@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1477264455",
      "licenseNumber": "RBT-23-281159",
      "licenseState": "CA",
      "licenseExpiration": "2026-06-24",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-23-281159",
      "rbtEffectiveDate": "2023-06-24",
      "rbtExpiryDate": "2026-06-24",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-24",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-23-281159",
        "rbtEffectiveDate": "2023-06-24",
        "rbtExpiryDate": "2026-06-24",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-elizabeth-vega",
    "employeeId": "emp-prv-ages-rbt-elizabeth-vega",
    "providerId": "prv-ages-rbt-elizabeth-vega",
    "firstName": "Elizabeth",
    "lastName": "Vega",
    "fullName": "Elizabeth Vega",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-479211",
    "licenseState": "CA",
    "licenseExpiration": "2026-10-05",
    "npi": "1114863263",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-479211",
    "rbtEffectiveDate": "2025-10-05",
    "rbtExpiryDate": "2026-10-05",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-elizabeth-vega",
      "firstName": "Elizabeth",
      "lastName": "Vega",
      "fullName": "Elizabeth Vega",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "elizabeth.vega@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1114863263",
      "licenseNumber": "RBT-25-479211",
      "licenseState": "CA",
      "licenseExpiration": "2026-10-05",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-25-479211",
      "rbtEffectiveDate": "2025-10-05",
      "rbtExpiryDate": "2026-10-05",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-10-05",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-479211",
        "rbtEffectiveDate": "2025-10-05",
        "rbtExpiryDate": "2026-10-05",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-aditi-kamboj",
    "employeeId": "emp-prv-ages-rbt-aditi-kamboj",
    "providerId": "prv-ages-rbt-aditi-kamboj",
    "firstName": "Aditi",
    "lastName": "Kamboj",
    "fullName": "Aditi Kamboj",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-26-536374",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-10",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-26-536374",
    "rbtEffectiveDate": "2026-05-09",
    "rbtExpiryDate": "2028-05-10",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-aditi-kamboj",
      "firstName": "Aditi",
      "lastName": "Kamboj",
      "fullName": "Aditi Kamboj",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "aditi.kamboj@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-26-536374",
      "licenseState": "CA",
      "licenseExpiration": "2028-05-10",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-26-536374",
      "rbtEffectiveDate": "2026-05-09",
      "rbtExpiryDate": "2028-05-10",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2026-05-09",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-26-536374",
        "rbtEffectiveDate": "2026-05-09",
        "rbtExpiryDate": "2028-05-10",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-ana-reyes-acosta",
    "employeeId": "emp-prv-ages-rbt-ana-reyes-acosta",
    "providerId": "prv-ages-rbt-ana-reyes-acosta",
    "firstName": "Ana",
    "lastName": "Reyes Acosta",
    "fullName": "Ana Reyes Acosta",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-23-313943",
    "licenseState": "CA",
    "licenseExpiration": "2026-11-30",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-23-313943",
    "rbtEffectiveDate": "2023-11-30",
    "rbtExpiryDate": "2026-11-30",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-ana-reyes-acosta",
      "firstName": "Ana",
      "lastName": "Reyes Acosta",
      "fullName": "Ana Reyes Acosta",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "ana.reyesacosta@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-23-313943",
      "licenseState": "CA",
      "licenseExpiration": "2026-11-30",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-23-313943",
      "rbtEffectiveDate": "2023-11-30",
      "rbtExpiryDate": "2026-11-30",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-11-30",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-23-313943",
        "rbtEffectiveDate": "2023-11-30",
        "rbtExpiryDate": "2026-11-30",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-caitlin-scheuer",
    "employeeId": "emp-prv-ages-rbt-caitlin-scheuer",
    "providerId": "prv-ages-rbt-caitlin-scheuer",
    "firstName": "Caitlin",
    "lastName": "Scheuer",
    "fullName": "Caitlin Scheuer",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-22-214435",
    "licenseState": "UT",
    "licenseExpiration": "2028-05-01",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-22-214435",
    "rbtEffectiveDate": "2022-05-01",
    "rbtExpiryDate": "2028-05-01",
    "role": "PS",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-caitlin-scheuer",
      "firstName": "Caitlin",
      "lastName": "Scheuer",
      "fullName": "Caitlin Scheuer",
      "credentials": "PS, RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "caitlin.scheuer@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-22-214435",
      "licenseState": "UT",
      "licenseExpiration": "2028-05-01",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-22-214435",
      "rbtEffectiveDate": "2022-05-01",
      "rbtExpiryDate": "2028-05-01",
      "role": "PS",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-05-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-22-214435",
        "rbtEffectiveDate": "2022-05-01",
        "rbtExpiryDate": "2028-05-01",
        "role": "PS",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-camary-davis",
    "employeeId": "emp-prv-ages-rbt-camary-davis",
    "providerId": "prv-ages-rbt-camary-davis",
    "firstName": "Camary",
    "lastName": "Davis",
    "fullName": "Camary Davis",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-490438",
    "licenseState": "UT",
    "licenseExpiration": "2026-11-11",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-25-490438",
    "rbtEffectiveDate": "2025-11-11",
    "rbtExpiryDate": "2026-11-11",
    "role": "RBT",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-camary-davis",
      "firstName": "Camary",
      "lastName": "Davis",
      "fullName": "Camary Davis",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "camary.davis@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-490438",
      "licenseState": "UT",
      "licenseExpiration": "2026-11-11",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-25-490438",
      "rbtEffectiveDate": "2025-11-11",
      "rbtExpiryDate": "2026-11-11",
      "role": "RBT",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-11-11",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-490438",
        "rbtEffectiveDate": "2025-11-11",
        "rbtExpiryDate": "2026-11-11",
        "role": "RBT",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-camille-andes",
    "employeeId": "emp-prv-ages-rbt-camille-andes",
    "providerId": "prv-ages-rbt-camille-andes",
    "firstName": "Camille",
    "lastName": "Andes",
    "fullName": "Camille Andes",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-416629",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-05",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-416629",
    "rbtEffectiveDate": "2025-03-05",
    "rbtExpiryDate": "2028-03-05",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-camille-andes",
      "firstName": "Camille",
      "lastName": "Andes",
      "fullName": "Camille Andes",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "camille.andes@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-416629",
      "licenseState": "CA",
      "licenseExpiration": "2028-03-05",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-25-416629",
      "rbtEffectiveDate": "2025-03-05",
      "rbtExpiryDate": "2028-03-05",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-03-05",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-416629",
        "rbtEffectiveDate": "2025-03-05",
        "rbtExpiryDate": "2028-03-05",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-claudia-cruz",
    "employeeId": "emp-prv-ages-rbt-claudia-cruz",
    "providerId": "prv-ages-rbt-claudia-cruz",
    "firstName": "Claudia",
    "lastName": "Cruz",
    "fullName": "Claudia Cruz",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-22-210211",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-03",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-22-210211",
    "rbtEffectiveDate": "2022-04-03",
    "rbtExpiryDate": "2028-04-03",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-claudia-cruz",
      "firstName": "Claudia",
      "lastName": "Cruz",
      "fullName": "Claudia Cruz",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "claudia.cruz@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-22-210211",
      "licenseState": "CA",
      "licenseExpiration": "2028-04-03",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-22-210211",
      "rbtEffectiveDate": "2022-04-03",
      "rbtExpiryDate": "2028-04-03",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-04-03",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-22-210211",
        "rbtEffectiveDate": "2022-04-03",
        "rbtExpiryDate": "2028-04-03",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-colton-hudson",
    "employeeId": "emp-prv-ages-rbt-colton-hudson",
    "providerId": "prv-ages-rbt-colton-hudson",
    "firstName": "Colton",
    "lastName": "Hudson",
    "fullName": "Colton Hudson",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-482417",
    "licenseState": "CA",
    "licenseExpiration": "2026-10-16",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-25-482417",
    "rbtEffectiveDate": "2025-10-16",
    "rbtExpiryDate": "2026-10-16",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-colton-hudson",
      "firstName": "Colton",
      "lastName": "Hudson",
      "fullName": "Colton Hudson",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "colton.hudson@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-482417",
      "licenseState": "CA",
      "licenseExpiration": "2026-10-16",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Livermore",
      "rbtCertificationNumber": "RBT-25-482417",
      "rbtEffectiveDate": "2025-10-16",
      "rbtExpiryDate": "2026-10-16",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-10-16",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-482417",
        "rbtEffectiveDate": "2025-10-16",
        "rbtExpiryDate": "2026-10-16",
        "role": "RBT",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-holly-uibel",
    "employeeId": "emp-prv-ages-rbt-holly-uibel",
    "providerId": "prv-ages-rbt-holly-uibel",
    "firstName": "Holly",
    "lastName": "Uibel",
    "fullName": "Holly Uibel",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-21-171020",
    "licenseState": "UT",
    "licenseExpiration": "2028-06-07",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-21-171020",
    "rbtEffectiveDate": "2021-06-07",
    "rbtExpiryDate": "2028-06-07",
    "role": "RBT",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-holly-uibel",
      "firstName": "Holly",
      "lastName": "Uibel",
      "fullName": "Holly Uibel",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "holly.uibel@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-21-171020",
      "licenseState": "UT",
      "licenseExpiration": "2028-06-07",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-21-171020",
      "rbtEffectiveDate": "2021-06-07",
      "rbtExpiryDate": "2028-06-07",
      "role": "RBT",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-06-07",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-21-171020",
        "rbtEffectiveDate": "2021-06-07",
        "rbtExpiryDate": "2028-06-07",
        "role": "RBT",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-isabel-white",
    "employeeId": "emp-prv-ages-rbt-isabel-white",
    "providerId": "prv-ages-rbt-isabel-white",
    "firstName": "Isabel",
    "lastName": "White",
    "fullName": "Isabel White",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-22-200665",
    "licenseState": "UT",
    "licenseExpiration": "2028-01-21",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-22-200665",
    "rbtEffectiveDate": "2022-01-21",
    "rbtExpiryDate": "2028-01-21",
    "role": "RBT",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-isabel-white",
      "firstName": "Isabel",
      "lastName": "White",
      "fullName": "Isabel White",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "isabel.white@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-22-200665",
      "licenseState": "UT",
      "licenseExpiration": "2028-01-21",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-22-200665",
      "rbtEffectiveDate": "2022-01-21",
      "rbtExpiryDate": "2028-01-21",
      "role": "RBT",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-01-21",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-22-200665",
        "rbtEffectiveDate": "2022-01-21",
        "rbtExpiryDate": "2028-01-21",
        "role": "RBT",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-isabella-phan",
    "employeeId": "emp-prv-ages-rbt-isabella-phan",
    "providerId": "prv-ages-rbt-isabella-phan",
    "firstName": "Isabella",
    "lastName": "Phan",
    "fullName": "Isabella Phan",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-438501",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-22",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-438501",
    "rbtEffectiveDate": "2025-05-22",
    "rbtExpiryDate": "2028-05-22",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-isabella-phan",
      "firstName": "Isabella",
      "lastName": "Phan",
      "fullName": "Isabella Phan",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "isabella.phan@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-438501",
      "licenseState": "CA",
      "licenseExpiration": "2028-05-22",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-25-438501",
      "rbtEffectiveDate": "2025-05-22",
      "rbtExpiryDate": "2028-05-22",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-05-22",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-438501",
        "rbtEffectiveDate": "2025-05-22",
        "rbtExpiryDate": "2028-05-22",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-jacqlynn-uribe",
    "employeeId": "emp-prv-ages-rbt-jacqlynn-uribe",
    "providerId": "prv-ages-rbt-jacqlynn-uribe",
    "firstName": "Jacqlynn",
    "lastName": "Uribe",
    "fullName": "Jacqlynn Uribe",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-26-523943",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-22",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-26-523943",
    "rbtEffectiveDate": "2026-03-22",
    "rbtExpiryDate": "2028-03-22",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-jacqlynn-uribe",
      "firstName": "Jacqlynn",
      "lastName": "Uribe",
      "fullName": "Jacqlynn Uribe",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "jacqlynn.uribe@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-26-523943",
      "licenseState": "CA",
      "licenseExpiration": "2028-03-22",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-26-523943",
      "rbtEffectiveDate": "2026-03-22",
      "rbtExpiryDate": "2028-03-22",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2026-03-22",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-26-523943",
        "rbtEffectiveDate": "2026-03-22",
        "rbtExpiryDate": "2028-03-22",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-jasmine-espinoza",
    "employeeId": "emp-prv-ages-rbt-jasmine-espinoza",
    "providerId": "prv-ages-rbt-jasmine-espinoza",
    "firstName": "Jasmine",
    "lastName": "Espinoza",
    "fullName": "Jasmine Espinoza",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-23-279622",
    "licenseState": "CA",
    "licenseExpiration": "2028-06-16",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-23-279622",
    "rbtEffectiveDate": "2023-06-16",
    "rbtExpiryDate": "2028-06-16",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-jasmine-espinoza",
      "firstName": "Jasmine",
      "lastName": "Espinoza",
      "fullName": "Jasmine Espinoza",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "jasmine.espinoza@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-23-279622",
      "licenseState": "CA",
      "licenseExpiration": "2028-06-16",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-23-279622",
      "rbtEffectiveDate": "2023-06-16",
      "rbtExpiryDate": "2028-06-16",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-16",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-23-279622",
        "rbtEffectiveDate": "2023-06-16",
        "rbtExpiryDate": "2028-06-16",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-jaspreet-kaur",
    "employeeId": "emp-prv-ages-rbt-jaspreet-kaur",
    "providerId": "prv-ages-rbt-jaspreet-kaur",
    "firstName": "Jaspreet",
    "lastName": "Kaur",
    "fullName": "Jaspreet Kaur",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-jaspreet-kaur",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-jaspreet-kaur",
      "firstName": "Jaspreet",
      "lastName": "Kaur",
      "fullName": "Jaspreet Kaur",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "jaspreet.kaur@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-jaspreet-kaur",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-jazmine-tostado",
    "employeeId": "emp-prv-ages-rbt-jazmine-tostado",
    "providerId": "prv-ages-rbt-jazmine-tostado",
    "firstName": "Jazmine",
    "lastName": "Tostado",
    "fullName": "Jazmine Tostado",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-24-396733",
    "licenseState": "CA",
    "licenseExpiration": "2025-12-01",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-24-396733",
    "rbtEffectiveDate": "2024-12-01",
    "rbtExpiryDate": "2025-12-01",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-jazmine-tostado",
      "firstName": "Jazmine",
      "lastName": "Tostado",
      "fullName": "Jazmine Tostado",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "jazmine.tostado@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-24-396733",
      "licenseState": "CA",
      "licenseExpiration": "2025-12-01",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-24-396733",
      "rbtEffectiveDate": "2024-12-01",
      "rbtExpiryDate": "2025-12-01",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-12-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-24-396733",
        "rbtEffectiveDate": "2024-12-01",
        "rbtExpiryDate": "2025-12-01",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-jennifer-mislang",
    "employeeId": "emp-prv-ages-rbt-jennifer-mislang",
    "providerId": "prv-ages-rbt-jennifer-mislang",
    "firstName": "Jennifer",
    "lastName": "Mislang",
    "fullName": "Jennifer Mislang",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-26-509051",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-18",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-26-509051",
    "rbtEffectiveDate": "2026-01-18",
    "rbtExpiryDate": "2028-01-18",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-jennifer-mislang",
      "firstName": "Jennifer",
      "lastName": "Mislang",
      "fullName": "Jennifer Mislang",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "jennifer.mislang@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-26-509051",
      "licenseState": "CA",
      "licenseExpiration": "2028-01-18",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Livermore",
      "rbtCertificationNumber": "RBT-26-509051",
      "rbtEffectiveDate": "2026-01-18",
      "rbtExpiryDate": "2028-01-18",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2026-01-18",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-26-509051",
        "rbtEffectiveDate": "2026-01-18",
        "rbtExpiryDate": "2028-01-18",
        "role": "RBT",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-jonathan-greene",
    "employeeId": "emp-prv-ages-rbt-jonathan-greene",
    "providerId": "prv-ages-rbt-jonathan-greene",
    "firstName": "Jonathan",
    "lastName": "Greene",
    "fullName": "Jonathan Greene",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-427903",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-11",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-427903",
    "rbtEffectiveDate": "2025-04-11",
    "rbtExpiryDate": "2028-04-11",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-jonathan-greene",
      "firstName": "Jonathan",
      "lastName": "Greene",
      "fullName": "Jonathan Greene",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "jonathan.greene@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-427903",
      "licenseState": "CA",
      "licenseExpiration": "2028-04-11",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-25-427903",
      "rbtEffectiveDate": "2025-04-11",
      "rbtExpiryDate": "2028-04-11",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-04-11",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-427903",
        "rbtEffectiveDate": "2025-04-11",
        "rbtExpiryDate": "2028-04-11",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-juan-chavez",
    "employeeId": "emp-prv-ages-rbt-juan-chavez",
    "providerId": "prv-ages-rbt-juan-chavez",
    "firstName": "Juan",
    "lastName": "Chavez",
    "fullName": "Juan Chavez",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-juan-chavez",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-juan-chavez",
      "firstName": "Juan",
      "lastName": "Chavez",
      "fullName": "Juan Chavez",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "juan.chavez@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-juan-chavez",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-julianna-david",
    "employeeId": "emp-prv-ages-rbt-julianna-david",
    "providerId": "prv-ages-rbt-julianna-david",
    "firstName": "Julianna",
    "lastName": "David",
    "fullName": "Julianna David",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-483658",
    "licenseState": "CA",
    "licenseExpiration": "2026-10-18",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-25-483658",
    "rbtEffectiveDate": "2025-10-18",
    "rbtExpiryDate": "2026-10-18",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-julianna-david",
      "firstName": "Julianna",
      "lastName": "David",
      "fullName": "Julianna David",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "julianna.david@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-483658",
      "licenseState": "CA",
      "licenseExpiration": "2026-10-18",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Livermore",
      "rbtCertificationNumber": "RBT-25-483658",
      "rbtEffectiveDate": "2025-10-18",
      "rbtExpiryDate": "2026-10-18",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-10-18",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-483658",
        "rbtEffectiveDate": "2025-10-18",
        "rbtExpiryDate": "2026-10-18",
        "role": "RBT",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-kaitlin-djiusni",
    "employeeId": "emp-prv-ages-rbt-kaitlin-djiusni",
    "providerId": "prv-ages-rbt-kaitlin-djiusni",
    "firstName": "Kaitlin",
    "lastName": "Djiusni",
    "fullName": "Kaitlin Djiusni",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-22-222375",
    "licenseState": "CA",
    "licenseExpiration": "2028-06-25",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-22-222375",
    "rbtEffectiveDate": "2022-06-25",
    "rbtExpiryDate": "2028-06-25",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-kaitlin-djiusni",
      "firstName": "Kaitlin",
      "lastName": "Djiusni",
      "fullName": "Kaitlin Djiusni",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "kaitlin.djiusni@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-22-222375",
      "licenseState": "CA",
      "licenseExpiration": "2028-06-25",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-22-222375",
      "rbtEffectiveDate": "2022-06-25",
      "rbtExpiryDate": "2028-06-25",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-06-25",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-22-222375",
        "rbtEffectiveDate": "2022-06-25",
        "rbtExpiryDate": "2028-06-25",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-kyla-kersh",
    "employeeId": "emp-prv-ages-rbt-kyla-kersh",
    "providerId": "prv-ages-rbt-kyla-kersh",
    "firstName": "Kyla",
    "lastName": "Kersh",
    "fullName": "Kyla Kersh",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-23-267617",
    "licenseState": "UT",
    "licenseExpiration": "2028-04-07",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-23-267617",
    "rbtEffectiveDate": "2023-04-07",
    "rbtExpiryDate": "2028-04-07",
    "role": "RBT",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-kyla-kersh",
      "firstName": "Kyla",
      "lastName": "Kersh",
      "fullName": "Kyla Kersh",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "kyla.kersh@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-23-267617",
      "licenseState": "UT",
      "licenseExpiration": "2028-04-07",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-23-267617",
      "rbtEffectiveDate": "2023-04-07",
      "rbtExpiryDate": "2028-04-07",
      "role": "RBT",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-04-07",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-23-267617",
        "rbtEffectiveDate": "2023-04-07",
        "rbtExpiryDate": "2028-04-07",
        "role": "RBT",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-lauren-krause",
    "employeeId": "emp-prv-ages-rbt-lauren-krause",
    "providerId": "prv-ages-rbt-lauren-krause",
    "firstName": "Lauren",
    "lastName": "Krause",
    "fullName": "Lauren Krause",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-502608",
    "licenseState": "UT",
    "licenseExpiration": "2026-12-22",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-25-502608",
    "rbtEffectiveDate": "2025-12-22",
    "rbtExpiryDate": "2026-12-22",
    "role": "RBT",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-lauren-krause",
      "firstName": "Lauren",
      "lastName": "Krause",
      "fullName": "Lauren Krause",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "lauren.krause@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-502608",
      "licenseState": "UT",
      "licenseExpiration": "2026-12-22",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-25-502608",
      "rbtEffectiveDate": "2025-12-22",
      "rbtExpiryDate": "2026-12-22",
      "role": "RBT",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-12-22",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-502608",
        "rbtEffectiveDate": "2025-12-22",
        "rbtExpiryDate": "2026-12-22",
        "role": "RBT",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-lisa-latina-michell-sisneroz",
    "employeeId": "emp-prv-ages-rbt-lisa-latina-michell-sisneroz",
    "providerId": "prv-ages-rbt-lisa-latina-michell-sisneroz",
    "firstName": "Lisa",
    "lastName": "Latina Michell Sisneroz",
    "fullName": "Lisa Latina Michell Sisneroz",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-457764",
    "licenseState": "CA",
    "licenseExpiration": "2026-07-27",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-457764",
    "rbtEffectiveDate": "2025-07-27",
    "rbtExpiryDate": "2026-07-27",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-lisa-latina-michell-sisneroz",
      "firstName": "Lisa",
      "lastName": "Latina Michell Sisneroz",
      "fullName": "Lisa Latina Michell Sisneroz",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "lisa.latinamichellsisneroz@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-457764",
      "licenseState": "CA",
      "licenseExpiration": "2026-07-27",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-25-457764",
      "rbtEffectiveDate": "2025-07-27",
      "rbtExpiryDate": "2026-07-27",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-07-27",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-457764",
        "rbtEffectiveDate": "2025-07-27",
        "rbtExpiryDate": "2026-07-27",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-loc-le",
    "employeeId": "emp-prv-ages-rbt-loc-le",
    "providerId": "prv-ages-rbt-loc-le",
    "firstName": "Loc",
    "lastName": "Le",
    "fullName": "Loc Le",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-23-293235",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-23",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-23-293235",
    "rbtEffectiveDate": "2023-08-23",
    "rbtExpiryDate": "2026-08-23",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-loc-le",
      "firstName": "Loc",
      "lastName": "Le",
      "fullName": "Loc Le",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "loc.le@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-23-293235",
      "licenseState": "CA",
      "licenseExpiration": "2026-08-23",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-23-293235",
      "rbtEffectiveDate": "2023-08-23",
      "rbtExpiryDate": "2026-08-23",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-08-23",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-23-293235",
        "rbtEffectiveDate": "2023-08-23",
        "rbtExpiryDate": "2026-08-23",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-lois-tolman",
    "employeeId": "emp-prv-ages-rbt-lois-tolman",
    "providerId": "prv-ages-rbt-lois-tolman",
    "firstName": "Lois",
    "lastName": "Tolman",
    "fullName": "Lois Tolman",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-458942",
    "licenseState": "UT",
    "licenseExpiration": "2026-07-30",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-25-458942",
    "rbtEffectiveDate": "2025-07-30",
    "rbtExpiryDate": "2026-07-30",
    "role": "RBT",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-lois-tolman",
      "firstName": "Lois",
      "lastName": "Tolman",
      "fullName": "Lois Tolman",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "lois.tolman@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-458942",
      "licenseState": "UT",
      "licenseExpiration": "2026-07-30",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-25-458942",
      "rbtEffectiveDate": "2025-07-30",
      "rbtExpiryDate": "2026-07-30",
      "role": "RBT",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-07-30",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-458942",
        "rbtEffectiveDate": "2025-07-30",
        "rbtExpiryDate": "2026-07-30",
        "role": "RBT",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-marilena-mancias",
    "employeeId": "emp-prv-ages-rbt-marilena-mancias",
    "providerId": "prv-ages-rbt-marilena-mancias",
    "firstName": "Marilena",
    "lastName": "Mancias",
    "fullName": "Marilena Mancias",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-marilena-mancias",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-marilena-mancias",
      "firstName": "Marilena",
      "lastName": "Mancias",
      "fullName": "Marilena Mancias",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "marilena.mancias@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-marilena-mancias",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Livermore",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-paola-lopez",
    "employeeId": "emp-prv-ages-rbt-paola-lopez",
    "providerId": "prv-ages-rbt-paola-lopez",
    "firstName": "Paola",
    "lastName": "Lopez",
    "fullName": "Paola Lopez",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-21-173263",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-24",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-21-173263",
    "rbtEffectiveDate": "2021-06-24",
    "rbtExpiryDate": "2028-04-24",
    "role": "PS",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-paola-lopez",
      "firstName": "Paola",
      "lastName": "Lopez",
      "fullName": "Paola Lopez",
      "credentials": "PS, RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "paola.lopez@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-21-173263",
      "licenseState": "CA",
      "licenseExpiration": "2028-04-24",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-21-173263",
      "rbtEffectiveDate": "2021-06-24",
      "rbtExpiryDate": "2028-04-24",
      "role": "PS",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-06-24",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-21-173263",
        "rbtEffectiveDate": "2021-06-24",
        "rbtExpiryDate": "2028-04-24",
        "role": "PS",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-raquel-rodriguez",
    "employeeId": "emp-prv-ages-rbt-raquel-rodriguez",
    "providerId": "prv-ages-rbt-raquel-rodriguez",
    "firstName": "Raquel",
    "lastName": "Rodriguez",
    "fullName": "Raquel Rodriguez",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-18-63920",
    "licenseState": "UT",
    "licenseExpiration": "2026-08-22",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-18-63920",
    "rbtEffectiveDate": "2018-08-22",
    "rbtExpiryDate": "2026-08-22",
    "role": "PS",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-raquel-rodriguez",
      "firstName": "Raquel",
      "lastName": "Rodriguez",
      "fullName": "Raquel Rodriguez",
      "credentials": "PS, RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "raquel.rodriguez@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-18-63920",
      "licenseState": "UT",
      "licenseExpiration": "2026-08-22",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-18-63920",
      "rbtEffectiveDate": "2018-08-22",
      "rbtExpiryDate": "2026-08-22",
      "role": "PS",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2018-08-22",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-18-63920",
        "rbtEffectiveDate": "2018-08-22",
        "rbtExpiryDate": "2026-08-22",
        "role": "PS",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-regen-spendlove",
    "employeeId": "emp-prv-ages-rbt-regen-spendlove",
    "providerId": "prv-ages-rbt-regen-spendlove",
    "firstName": "Regen",
    "lastName": "Spendlove",
    "fullName": "Regen Spendlove",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-22-199954",
    "licenseState": "UT",
    "licenseExpiration": "2028-01-15",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Utah",
    "rbtCertificationNumber": "RBT-22-199954",
    "rbtEffectiveDate": "2022-01-15",
    "rbtExpiryDate": "2028-01-15",
    "role": "RBT",
    "isUtah": true,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-regen-spendlove",
      "firstName": "Regen",
      "lastName": "Spendlove",
      "fullName": "Regen Spendlove",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "regen.spendlove@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-22-199954",
      "licenseState": "UT",
      "licenseExpiration": "2028-01-15",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Utah",
      "rbtCertificationNumber": "RBT-22-199954",
      "rbtEffectiveDate": "2022-01-15",
      "rbtExpiryDate": "2028-01-15",
      "role": "RBT",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-01-15",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-22-199954",
        "rbtEffectiveDate": "2022-01-15",
        "rbtExpiryDate": "2028-01-15",
        "role": "RBT",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-reyna-munoz",
    "employeeId": "emp-prv-ages-rbt-reyna-munoz",
    "providerId": "prv-ages-rbt-reyna-munoz",
    "firstName": "Reyna",
    "lastName": "Munoz",
    "fullName": "Reyna Munoz",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-413640",
    "licenseState": "CA",
    "licenseExpiration": "2026-02-20",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-413640",
    "rbtEffectiveDate": "2025-02-20",
    "rbtExpiryDate": "2026-02-20",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-reyna-munoz",
      "firstName": "Reyna",
      "lastName": "Munoz",
      "fullName": "Reyna Munoz",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "reyna.munoz@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-413640",
      "licenseState": "CA",
      "licenseExpiration": "2026-02-20",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-25-413640",
      "rbtEffectiveDate": "2025-02-20",
      "rbtExpiryDate": "2026-02-20",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-02-20",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-413640",
        "rbtEffectiveDate": "2025-02-20",
        "rbtExpiryDate": "2026-02-20",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-rhett-bruce",
    "employeeId": "emp-prv-ages-rbt-rhett-bruce",
    "providerId": "prv-ages-rbt-rhett-bruce",
    "firstName": "Rhett",
    "lastName": "Bruce",
    "fullName": "Rhett Bruce",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-24-349207",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-22",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Livermore",
    "rbtCertificationNumber": "RBT-24-349207",
    "rbtEffectiveDate": "2024-05-22",
    "rbtExpiryDate": "2028-05-22",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-rhett-bruce",
      "firstName": "Rhett",
      "lastName": "Bruce",
      "fullName": "Rhett Bruce",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "rhett.bruce@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-24-349207",
      "licenseState": "CA",
      "licenseExpiration": "2028-05-22",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Livermore",
      "rbtCertificationNumber": "RBT-24-349207",
      "rbtEffectiveDate": "2024-05-22",
      "rbtExpiryDate": "2028-05-22",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-05-22",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-24-349207",
        "rbtEffectiveDate": "2024-05-22",
        "rbtExpiryDate": "2028-05-22",
        "role": "RBT",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-robinae-devereaux-carter",
    "employeeId": "emp-prv-ages-rbt-robinae-devereaux-carter",
    "providerId": "prv-ages-rbt-robinae-devereaux-carter",
    "firstName": "Robinae",
    "lastName": "Devereaux-Carter",
    "fullName": "Robinae Devereaux-Carter",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-463605",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-15",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-463605",
    "rbtEffectiveDate": "2025-08-15",
    "rbtExpiryDate": "2026-08-15",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-robinae-devereaux-carter",
      "firstName": "Robinae",
      "lastName": "Devereaux-Carter",
      "fullName": "Robinae Devereaux-Carter",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "robinae.devereaux-carter@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-463605",
      "licenseState": "CA",
      "licenseExpiration": "2026-08-15",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-25-463605",
      "rbtEffectiveDate": "2025-08-15",
      "rbtExpiryDate": "2026-08-15",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-08-15",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-463605",
        "rbtEffectiveDate": "2025-08-15",
        "rbtExpiryDate": "2026-08-15",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-tiffany-catherine-narducci",
    "employeeId": "emp-prv-ages-rbt-tiffany-catherine-narducci",
    "providerId": "prv-ages-rbt-tiffany-catherine-narducci",
    "firstName": "Tiffany",
    "lastName": "Catherine Narducci",
    "fullName": "Tiffany Catherine Narducci",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-24-347294",
    "licenseState": "CA",
    "licenseExpiration": "2026-05-14",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-24-347294",
    "rbtEffectiveDate": "2024-05-14",
    "rbtExpiryDate": "2026-05-14",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-tiffany-catherine-narducci",
      "firstName": "Tiffany",
      "lastName": "Catherine Narducci",
      "fullName": "Tiffany Catherine Narducci",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "tiffany.catherinenarducci@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-24-347294",
      "licenseState": "CA",
      "licenseExpiration": "2026-05-14",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-24-347294",
      "rbtEffectiveDate": "2024-05-14",
      "rbtExpiryDate": "2026-05-14",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-05-14",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-24-347294",
        "rbtEffectiveDate": "2024-05-14",
        "rbtExpiryDate": "2026-05-14",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-william-fonseca",
    "employeeId": "emp-prv-ages-rbt-william-fonseca",
    "providerId": "prv-ages-rbt-william-fonseca",
    "firstName": "William",
    "lastName": "Fonseca",
    "fullName": "William Fonseca",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-26-513281",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-06",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-26-513281",
    "rbtEffectiveDate": "2026-02-06",
    "rbtExpiryDate": "2028-02-06",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-william-fonseca",
      "firstName": "William",
      "lastName": "Fonseca",
      "fullName": "William Fonseca",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "william.fonseca@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-26-513281",
      "licenseState": "CA",
      "licenseExpiration": "2028-02-06",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-26-513281",
      "rbtEffectiveDate": "2026-02-06",
      "rbtExpiryDate": "2028-02-06",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2026-02-06",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-26-513281",
        "rbtEffectiveDate": "2026-02-06",
        "rbtExpiryDate": "2028-02-06",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-william-loera",
    "employeeId": "emp-prv-ages-rbt-william-loera",
    "providerId": "prv-ages-rbt-william-loera",
    "firstName": "William",
    "lastName": "Loera",
    "fullName": "William Loera",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-494625",
    "licenseState": "CA",
    "licenseExpiration": "2026-11-25",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "RBT-25-494625",
    "rbtEffectiveDate": "2025-11-25",
    "rbtExpiryDate": "2026-11-25",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-william-loera",
      "firstName": "William",
      "lastName": "Loera",
      "fullName": "William Loera",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "william.loera@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-25-494625",
      "licenseState": "CA",
      "licenseExpiration": "2026-11-25",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "RBT-25-494625",
      "rbtEffectiveDate": "2025-11-25",
      "rbtExpiryDate": "2026-11-25",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-11-25",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-494625",
        "rbtEffectiveDate": "2025-11-25",
        "rbtExpiryDate": "2026-11-25",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-citlally-vallejo",
    "employeeId": "emp-prv-ages-rbt-citlally-vallejo",
    "providerId": "prv-ages-rbt-citlally-vallejo",
    "firstName": "Citlally",
    "lastName": "Vallejo",
    "fullName": "Citlally Vallejo",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-475720",
    "licenseState": "CA",
    "licenseExpiration": "2028-09-24",
    "npi": "1235992892",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "RBT-25-475720",
    "rbtEffectiveDate": "2025-09-25",
    "rbtExpiryDate": "2028-09-24",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-citlally-vallejo",
      "firstName": "Citlally",
      "lastName": "Vallejo",
      "fullName": "Citlally Vallejo",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "citlally.vallejo@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1235992892",
      "licenseNumber": "RBT-25-475720",
      "licenseState": "CA",
      "licenseExpiration": "2028-09-24",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "RBT-25-475720",
      "rbtEffectiveDate": "2025-09-25",
      "rbtExpiryDate": "2028-09-24",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-09-25",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-475720",
        "rbtEffectiveDate": "2025-09-25",
        "rbtExpiryDate": "2028-09-24",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-naomi-mascorro",
    "employeeId": "emp-prv-ages-rbt-naomi-mascorro",
    "providerId": "prv-ages-rbt-naomi-mascorro",
    "firstName": "Naomi",
    "lastName": "Mascorro",
    "fullName": "Naomi Mascorro",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-25-424406",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-29",
    "npi": "1770498909",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-25-424406",
    "rbtEffectiveDate": "2025-03-30",
    "rbtExpiryDate": "2028-03-29",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-naomi-mascorro",
      "firstName": "Naomi",
      "lastName": "Mascorro",
      "fullName": "Naomi Mascorro",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "naomi.mascorro@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1770498909",
      "licenseNumber": "RBT-25-424406",
      "licenseState": "CA",
      "licenseExpiration": "2028-03-29",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Vacaville",
      "rbtCertificationNumber": "RBT-25-424406",
      "rbtEffectiveDate": "2025-03-30",
      "rbtExpiryDate": "2028-03-29",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-03-30",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-25-424406",
        "rbtEffectiveDate": "2025-03-30",
        "rbtExpiryDate": "2028-03-29",
        "role": "RBT",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-kelsey-kay",
    "employeeId": "emp-prv-ages-rbt-kelsey-kay",
    "providerId": "prv-ages-rbt-kelsey-kay",
    "firstName": "Kelsey",
    "lastName": "Kay",
    "fullName": "Kelsey Kay",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-26-516272",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-18",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-26-516272",
    "rbtEffectiveDate": "2026-02-19",
    "rbtExpiryDate": "2028-02-18",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-kelsey-kay",
      "firstName": "Kelsey",
      "lastName": "Kay",
      "fullName": "Kelsey Kay",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "kelsey.kay@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-26-516272",
      "licenseState": "CA",
      "licenseExpiration": "2028-02-18",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Vacaville",
      "rbtCertificationNumber": "RBT-26-516272",
      "rbtEffectiveDate": "2026-02-19",
      "rbtExpiryDate": "2028-02-18",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2026-02-19",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-26-516272",
        "rbtEffectiveDate": "2026-02-19",
        "rbtExpiryDate": "2028-02-18",
        "role": "RBT",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-kevin-stephens",
    "employeeId": "emp-prv-ages-rbt-kevin-stephens",
    "providerId": "prv-ages-rbt-kevin-stephens",
    "firstName": "Kevin",
    "lastName": "Stephens",
    "fullName": "Kevin Stephens",
    "credentials": "PS, RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-26-2835903",
    "licenseState": "CA",
    "licenseExpiration": "2028-08-01",
    "npi": "1639651367",
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Vacaville",
    "rbtCertificationNumber": "RBT-26-2835903",
    "rbtEffectiveDate": "2026-08-02",
    "rbtExpiryDate": "2028-08-01",
    "role": "PS",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-kevin-stephens",
      "firstName": "Kevin",
      "lastName": "Stephens",
      "fullName": "Kevin Stephens",
      "credentials": "PS, RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "kevin.stephens@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": "1639651367",
      "licenseNumber": "RBT-26-2835903",
      "licenseState": "CA",
      "licenseExpiration": "2028-08-01",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Vacaville",
      "rbtCertificationNumber": "RBT-26-2835903",
      "rbtEffectiveDate": "2026-08-02",
      "rbtExpiryDate": "2028-08-01",
      "role": "PS",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2026-08-02",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "RBT-26-2835903",
        "rbtEffectiveDate": "2026-08-02",
        "rbtExpiryDate": "2028-08-01",
        "role": "PS",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-erik-zehm",
    "employeeId": "emp-prv-ages-rbt-erik-zehm",
    "providerId": "prv-ages-rbt-erik-zehm",
    "firstName": "Erik",
    "lastName": "Zehm",
    "fullName": "Erik Zehm",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-erik-zehm",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-erik-zehm",
      "firstName": "Erik",
      "lastName": "Zehm",
      "fullName": "Erik Zehm",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "erik.zehm@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-erik-zehm",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-karime-ruiz-alvarez",
    "employeeId": "emp-prv-ages-rbt-karime-ruiz-alvarez",
    "providerId": "prv-ages-rbt-karime-ruiz-alvarez",
    "firstName": "Karime",
    "lastName": "Ruiz Alvarez",
    "fullName": "Karime Ruiz Alvarez",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-karime-ruiz-alvarez",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-karime-ruiz-alvarez",
      "firstName": "Karime",
      "lastName": "Ruiz Alvarez",
      "fullName": "Karime Ruiz Alvarez",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "karime.ruizalvarez@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-karime-ruiz-alvarez",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-leneea-gaither",
    "employeeId": "emp-prv-ages-rbt-leneea-gaither",
    "providerId": "prv-ages-rbt-leneea-gaither",
    "firstName": "Leneea",
    "lastName": "Gaither",
    "fullName": "Leneea Gaither",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-leneea-gaither",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-leneea-gaither",
      "firstName": "Leneea",
      "lastName": "Gaither",
      "fullName": "Leneea Gaither",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "leneea.gaither@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-leneea-gaither",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-lissette-esperanza",
    "employeeId": "emp-prv-ages-rbt-lissette-esperanza",
    "providerId": "prv-ages-rbt-lissette-esperanza",
    "firstName": "Lissette",
    "lastName": "Esperanza",
    "fullName": "Lissette Esperanza",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-lissette-esperanza",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-lissette-esperanza",
      "firstName": "Lissette",
      "lastName": "Esperanza",
      "fullName": "Lissette Esperanza",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "lissette.esperanza@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-lissette-esperanza",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-marissa-napier",
    "employeeId": "emp-prv-ages-rbt-marissa-napier",
    "providerId": "prv-ages-rbt-marissa-napier",
    "firstName": "Marissa",
    "lastName": "Napier",
    "fullName": "Marissa Napier",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-marissa-napier",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "Brentwood",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-marissa-napier",
      "firstName": "Marissa",
      "lastName": "Napier",
      "fullName": "Marissa Napier",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "marissa.napier@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-marissa-napier",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "Brentwood",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-noah-johnson",
    "employeeId": "emp-prv-ages-rbt-noah-johnson",
    "providerId": "prv-ages-rbt-noah-johnson",
    "firstName": "Noah",
    "lastName": "Johnson",
    "fullName": "Noah Johnson",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-noah-johnson",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-noah-johnson",
      "firstName": "Noah",
      "lastName": "Johnson",
      "fullName": "Noah Johnson",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "noah.johnson@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-noah-johnson",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-rbt-zoe-zettas",
    "employeeId": "emp-prv-ages-rbt-zoe-zettas",
    "providerId": "prv-ages-rbt-zoe-zettas",
    "firstName": "Zoe",
    "lastName": "Zettas",
    "fullName": "Zoe Zettas",
    "credentials": "RBT",
    "disciplines": [
      "ABA"
    ],
    "providerType": "RBT",
    "licenseNumber": "RBT-zoe-zettas",
    "licenseState": "CA",
    "licenseExpiration": "",
    "npi": null,
    "taxonomy": "106S00000X",
    "specialty": "Behavior Technician / Applied Behavior Analysis",
    "region": "San Jose",
    "rbtCertificationNumber": "",
    "rbtEffectiveDate": "",
    "rbtExpiryDate": "",
    "role": "RBT",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-rbt-zoe-zettas",
      "firstName": "Zoe",
      "lastName": "Zettas",
      "fullName": "Zoe Zettas",
      "credentials": "RBT",
      "disciplines": [
        "ABA"
      ],
      "providerType": "RBT",
      "email": "zoe.zettas@ageslearningsolutions.com",
      "phone": "(408) 555-0190",
      "npi": null,
      "licenseNumber": "RBT-zoe-zettas",
      "licenseState": "CA",
      "licenseExpiration": "",
      "taxonomy": "106S00000X",
      "specialty": "Behavior Technician / Applied Behavior Analysis",
      "region": "San Jose",
      "rbtCertificationNumber": "",
      "rbtEffectiveDate": "",
      "rbtExpiryDate": "",
      "role": "RBT",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-01",
      "caqhId": "",
      "caqhStatus": "Complete",
      "paveStatus": "Approved",
      "npiVerified": false,
      "nppesRecordMatch": false,
      "payerEnrollments": [
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved",
          "notes": "Active under AGES Learning Solutions Catalight group enrollment"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "rbtCertificationNumber": "",
        "rbtEffectiveDate": "",
        "rbtExpiryDate": "",
        "role": "RBT",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-erica-bustos",
    "employeeId": "emp-prv-ages-bcba-erica-bustos",
    "providerId": "prv-ages-bcba-erica-bustos",
    "firstName": "Erica",
    "lastName": "Bustos",
    "fullName": "Erica Bustos",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "3013264",
    "licenseState": "CA",
    "licenseExpiration": "2027-01-31",
    "npi": "1962896530",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "3013264",
    "bcbaEffectiveDate": "2012-01-31",
    "bcbaExpiryDate": "2027-01-31",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-erica-bustos",
      "firstName": "Erica",
      "lastName": "Bustos",
      "fullName": "Erica Bustos",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "erica.bustos@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1962896530",
      "licenseNumber": "3013264",
      "licenseState": "CA",
      "licenseExpiration": "2027-01-31",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "3013264",
      "bcbaEffectiveDate": "2012-01-31",
      "bcbaExpiryDate": "2027-01-31",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2012-01-31",
      "caqhId": "13805243",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "3013264",
        "bcbaEffectiveDate": "2012-01-31",
        "bcbaExpiryDate": "2027-01-31",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-darcy-machado",
    "employeeId": "emp-prv-ages-bcba-darcy-machado",
    "providerId": "prv-ages-bcba-darcy-machado",
    "firstName": "Darcy",
    "lastName": "Machado",
    "fullName": "Darcy Machado",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "14276255",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-22",
    "npi": "1659841179",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "14276255",
    "bcbaEffectiveDate": "2020-02-22",
    "bcbaExpiryDate": "2028-02-22",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-darcy-machado",
      "firstName": "Darcy",
      "lastName": "Machado",
      "fullName": "Darcy Machado",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "darcy.machado@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1659841179",
      "licenseNumber": "14276255",
      "licenseState": "CA",
      "licenseExpiration": "2028-02-22",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "14276255",
      "bcbaEffectiveDate": "2020-02-22",
      "bcbaExpiryDate": "2028-02-22",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2020-02-22",
      "caqhId": "15110516",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "14276255",
        "bcbaEffectiveDate": "2020-02-22",
        "bcbaExpiryDate": "2028-02-22",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-sasha-torres",
    "employeeId": "emp-prv-ages-bcba-sasha-torres",
    "providerId": "prv-ages-bcba-sasha-torres",
    "firstName": "Sasha",
    "lastName": "Torres",
    "fullName": "Sasha Torres",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "4806240",
    "licenseState": "CA",
    "licenseExpiration": "2026-09-30",
    "npi": "1497186738",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "4806240",
    "bcbaEffectiveDate": "2013-09-30",
    "bcbaExpiryDate": "2026-09-30",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-sasha-torres",
      "firstName": "Sasha",
      "lastName": "Torres",
      "fullName": "Sasha Torres",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "sasha.torres@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1497186738",
      "licenseNumber": "4806240",
      "licenseState": "CA",
      "licenseExpiration": "2026-09-30",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "4806240",
      "bcbaEffectiveDate": "2013-09-30",
      "bcbaExpiryDate": "2026-09-30",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2013-09-30",
      "caqhId": "12638040",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "4806240",
        "bcbaEffectiveDate": "2013-09-30",
        "bcbaExpiryDate": "2026-09-30",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-tracy-rodriguez",
    "employeeId": "emp-prv-ages-bcba-tracy-rodriguez",
    "providerId": "prv-ages-bcba-tracy-rodriguez",
    "firstName": "Tracy",
    "lastName": "Rodriguez",
    "fullName": "Tracy Rodriguez",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "17570743",
    "licenseState": "CA",
    "licenseExpiration": "2027-05-18",
    "npi": "1730636051",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "17570743",
    "bcbaEffectiveDate": "2021-05-18",
    "bcbaExpiryDate": "2027-05-18",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-tracy-rodriguez",
      "firstName": "Tracy",
      "lastName": "Rodriguez",
      "fullName": "Tracy Rodriguez",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "tracy.rodriguez@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1730636051",
      "licenseNumber": "17570743",
      "licenseState": "CA",
      "licenseExpiration": "2027-05-18",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "17570743",
      "bcbaEffectiveDate": "2021-05-18",
      "bcbaExpiryDate": "2027-05-18",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-05-18",
      "caqhId": "15157857",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "17570743",
        "bcbaEffectiveDate": "2021-05-18",
        "bcbaExpiryDate": "2027-05-18",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-peter-chen",
    "employeeId": "emp-prv-ages-bcba-peter-chen",
    "providerId": "prv-ages-bcba-peter-chen",
    "firstName": "Peter",
    "lastName": "Chen",
    "fullName": "Peter Chen",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "20351701",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-19",
    "npi": "1538636030",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "20351701",
    "bcbaEffectiveDate": "2022-01-19",
    "bcbaExpiryDate": "2028-01-19",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-peter-chen",
      "firstName": "Peter",
      "lastName": "Chen",
      "fullName": "Peter Chen",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "peter.chen@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1538636030",
      "licenseNumber": "20351701",
      "licenseState": "CA",
      "licenseExpiration": "2028-01-19",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "20351701",
      "bcbaEffectiveDate": "2022-01-19",
      "bcbaExpiryDate": "2028-01-19",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-01-19",
      "caqhId": "15493975",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "20351701",
        "bcbaEffectiveDate": "2022-01-19",
        "bcbaExpiryDate": "2028-01-19",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-natasha-chaudhry",
    "employeeId": "emp-prv-ages-bcba-natasha-chaudhry",
    "providerId": "prv-ages-bcba-natasha-chaudhry",
    "firstName": "Natasha",
    "lastName": "Chaudhry",
    "fullName": "Natasha Chaudhry",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "19112066",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-13",
    "npi": "1730842196",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "19112066",
    "bcbaEffectiveDate": "2021-10-13",
    "bcbaExpiryDate": "2027-10-13",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-natasha-chaudhry",
      "firstName": "Natasha",
      "lastName": "Chaudhry",
      "fullName": "Natasha Chaudhry",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "natasha.chaudhry@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1730842196",
      "licenseNumber": "19112066",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-13",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "19112066",
      "bcbaEffectiveDate": "2021-10-13",
      "bcbaExpiryDate": "2027-10-13",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-10-13",
      "caqhId": "15423187",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "19112066",
        "bcbaEffectiveDate": "2021-10-13",
        "bcbaExpiryDate": "2027-10-13",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-jennine-simpson",
    "employeeId": "emp-prv-ages-bcba-jennine-simpson",
    "providerId": "prv-ages-bcba-jennine-simpson",
    "firstName": "Jennine",
    "lastName": "Simpson",
    "fullName": "Jennine Simpson",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "12382471",
    "licenseState": "CA",
    "licenseExpiration": "2027-05-31",
    "npi": "1972192474",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "12382471",
    "bcbaEffectiveDate": "2019-05-31",
    "bcbaExpiryDate": "2027-05-31",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-jennine-simpson",
      "firstName": "Jennine",
      "lastName": "Simpson",
      "fullName": "Jennine Simpson",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "jennine.simpson@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1972192474",
      "licenseNumber": "12382471",
      "licenseState": "CA",
      "licenseExpiration": "2027-05-31",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "12382471",
      "bcbaEffectiveDate": "2019-05-31",
      "bcbaExpiryDate": "2027-05-31",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2019-05-31",
      "caqhId": "15044394",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "12382471",
        "bcbaEffectiveDate": "2019-05-31",
        "bcbaExpiryDate": "2027-05-31",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-jesus-belmonte",
    "employeeId": "emp-prv-ages-bcba-jesus-belmonte",
    "providerId": "prv-ages-bcba-jesus-belmonte",
    "firstName": "Jesus",
    "lastName": "Belmonte",
    "fullName": "Jesus Belmonte",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "15710927",
    "licenseState": "CA",
    "licenseExpiration": "2026-09-25",
    "npi": "1700387909",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Livermore",
    "bcbaCertificationNumber": "15710927",
    "bcbaEffectiveDate": "2020-09-25",
    "bcbaExpiryDate": "2026-09-25",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-jesus-belmonte",
      "firstName": "Jesus",
      "lastName": "Belmonte",
      "fullName": "Jesus Belmonte",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "jesus.belmonte@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1700387909",
      "licenseNumber": "15710927",
      "licenseState": "CA",
      "licenseExpiration": "2026-09-25",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Livermore",
      "bcbaCertificationNumber": "15710927",
      "bcbaEffectiveDate": "2020-09-25",
      "bcbaExpiryDate": "2026-09-25",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2020-09-25",
      "caqhId": "14978507",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "15710927",
        "bcbaEffectiveDate": "2020-09-25",
        "bcbaExpiryDate": "2026-09-25",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-maria-vazquez",
    "employeeId": "emp-prv-ages-bcba-maria-vazquez",
    "providerId": "prv-ages-bcba-maria-vazquez",
    "firstName": "Maria",
    "lastName": "Vazquez",
    "fullName": "Maria Vazquez",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "27856340",
    "licenseState": "CA",
    "licenseExpiration": "2026-12-13",
    "npi": "1932917234",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "27856340",
    "bcbaEffectiveDate": "2024-12-13",
    "bcbaExpiryDate": "2026-12-13",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-maria-vazquez",
      "firstName": "Maria",
      "lastName": "Vazquez",
      "fullName": "Maria Vazquez",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "maria.vazquez@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1932917234",
      "licenseNumber": "27856340",
      "licenseState": "CA",
      "licenseExpiration": "2026-12-13",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "27856340",
      "bcbaEffectiveDate": "2024-12-13",
      "bcbaExpiryDate": "2026-12-13",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-12-13",
      "caqhId": "16385498",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "27856340",
        "bcbaEffectiveDate": "2024-12-13",
        "bcbaExpiryDate": "2026-12-13",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-leanne-simon",
    "employeeId": "emp-prv-ages-bcba-leanne-simon",
    "providerId": "prv-ages-bcba-leanne-simon",
    "firstName": "Leanne",
    "lastName": "Simon",
    "fullName": "Leanne Simon",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "8643847",
    "licenseState": "CA",
    "licenseExpiration": "2027-02-28",
    "npi": "1750716056",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Livermore",
    "bcbaCertificationNumber": "8643847",
    "bcbaEffectiveDate": "2017-02-28",
    "bcbaExpiryDate": "2027-02-28",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-leanne-simon",
      "firstName": "Leanne",
      "lastName": "Simon",
      "fullName": "Leanne Simon",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "leanne.simon@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1750716056",
      "licenseNumber": "8643847",
      "licenseState": "CA",
      "licenseExpiration": "2027-02-28",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Livermore",
      "bcbaCertificationNumber": "8643847",
      "bcbaEffectiveDate": "2017-02-28",
      "bcbaExpiryDate": "2027-02-28",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2017-02-28",
      "caqhId": "13782768",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "8643847",
        "bcbaEffectiveDate": "2017-02-28",
        "bcbaExpiryDate": "2027-02-28",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-brianna-bader",
    "employeeId": "emp-prv-ages-bcba-brianna-bader",
    "providerId": "prv-ages-bcba-brianna-bader",
    "firstName": "Brianna",
    "lastName": "Bader",
    "fullName": "Brianna Bader",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "28794283",
    "licenseState": "CA",
    "licenseExpiration": "2027-04-16",
    "npi": "1245876838",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "28794283",
    "bcbaEffectiveDate": "2025-04-16",
    "bcbaExpiryDate": "2027-04-16",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-brianna-bader",
      "firstName": "Brianna",
      "lastName": "Bader",
      "fullName": "Brianna Bader",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "brianna.bader@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1245876838",
      "licenseNumber": "28794283",
      "licenseState": "CA",
      "licenseExpiration": "2027-04-16",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "28794283",
      "bcbaEffectiveDate": "2025-04-16",
      "bcbaExpiryDate": "2027-04-16",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-04-16",
      "caqhId": "16493372",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "28794283",
        "bcbaEffectiveDate": "2025-04-16",
        "bcbaExpiryDate": "2027-04-16",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-amy-heaps",
    "employeeId": "emp-prv-ages-bcba-amy-heaps",
    "providerId": "prv-ages-bcba-amy-heaps",
    "firstName": "Amy",
    "lastName": "Heaps",
    "fullName": "Amy Heaps",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "11492375",
    "licenseState": "UT",
    "licenseExpiration": "2026-11-30",
    "npi": "1063986834",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Utah",
    "bcbaCertificationNumber": "11492375",
    "bcbaEffectiveDate": "2018-11-30",
    "bcbaExpiryDate": "2026-11-30",
    "utStateLicense": "11123646-2506",
    "utahLicenseNumber": "11123646-2506",
    "isUtah": true,
    "locationIds": [
      "loc-5"
    ],
    "primaryLocationId": "loc-5",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-amy-heaps",
      "firstName": "Amy",
      "lastName": "Heaps",
      "fullName": "Amy Heaps",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "amy.heaps@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1063986834",
      "licenseNumber": "11492375",
      "licenseState": "UT",
      "licenseExpiration": "2026-11-30",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Utah",
      "bcbaCertificationNumber": "11492375",
      "bcbaEffectiveDate": "2018-11-30",
      "bcbaExpiryDate": "2026-11-30",
      "utStateLicense": "11123646-2506",
      "utahLicenseNumber": "11123646-2506",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2018-11-30",
      "caqhId": "14393821",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-selecthealth",
          "payerName": "Select Health UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-ut-medicaid",
          "payerName": "UT Medicaid",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uofu",
          "payerName": "University of UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-pehp",
          "payerName": "PEHP UT",
          "status": "Pending"
        },
        {
          "payerId": "pyr-molina-ut",
          "payerName": "Molina UT",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "11492375",
        "bcbaEffectiveDate": "2018-11-30",
        "bcbaExpiryDate": "2026-11-30",
        "utStateLicense": "11123646-2506",
        "utahLicenseNumber": "11123646-2506",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-andrea-mathews",
    "employeeId": "emp-prv-ages-bcba-andrea-mathews",
    "providerId": "prv-ages-bcba-andrea-mathews",
    "firstName": "Andrea",
    "lastName": "Mathews",
    "fullName": "Andrea Mathews",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "16807751",
    "licenseState": "UT",
    "licenseExpiration": "2027-02-23",
    "npi": "1386238889",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Utah",
    "bcbaCertificationNumber": "16807751",
    "bcbaEffectiveDate": "2021-02-23",
    "bcbaExpiryDate": "2027-02-23",
    "utStateLicense": "12182882-2506",
    "utahLicenseNumber": "12182882-2506",
    "isUtah": true,
    "locationIds": [
      "loc-5"
    ],
    "primaryLocationId": "loc-5",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-andrea-mathews",
      "firstName": "Andrea",
      "lastName": "Mathews",
      "fullName": "Andrea Mathews",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "andrea.mathews@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1386238889",
      "licenseNumber": "16807751",
      "licenseState": "UT",
      "licenseExpiration": "2027-02-23",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Utah",
      "bcbaCertificationNumber": "16807751",
      "bcbaEffectiveDate": "2021-02-23",
      "bcbaExpiryDate": "2027-02-23",
      "utStateLicense": "12182882-2506",
      "utahLicenseNumber": "12182882-2506",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-02-23",
      "caqhId": "15092648",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-selecthealth",
          "payerName": "Select Health UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-ut-medicaid",
          "payerName": "UT Medicaid",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uofu",
          "payerName": "University of UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-pehp",
          "payerName": "PEHP UT",
          "status": "Pending"
        },
        {
          "payerId": "pyr-molina-ut",
          "payerName": "Molina UT",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "16807751",
        "bcbaEffectiveDate": "2021-02-23",
        "bcbaExpiryDate": "2027-02-23",
        "utStateLicense": "12182882-2506",
        "utahLicenseNumber": "12182882-2506",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-leslie-sundblom",
    "employeeId": "emp-prv-ages-bcba-leslie-sundblom",
    "providerId": "prv-ages-bcba-leslie-sundblom",
    "firstName": "Leslie",
    "lastName": "Sundblom",
    "fullName": "Leslie Sundblom",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "25300738",
    "licenseState": "UT",
    "licenseExpiration": "2028-02-08",
    "npi": "1881347961",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Utah",
    "bcbaCertificationNumber": "25300738",
    "bcbaEffectiveDate": "2024-02-08",
    "bcbaExpiryDate": "2028-02-08",
    "utStateLicense": "13839880-2506",
    "utahLicenseNumber": "13839880-2506",
    "isUtah": true,
    "locationIds": [
      "loc-5"
    ],
    "primaryLocationId": "loc-5",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-leslie-sundblom",
      "firstName": "Leslie",
      "lastName": "Sundblom",
      "fullName": "Leslie Sundblom",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "leslie.sundblom@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1881347961",
      "licenseNumber": "25300738",
      "licenseState": "UT",
      "licenseExpiration": "2028-02-08",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Utah",
      "bcbaCertificationNumber": "25300738",
      "bcbaEffectiveDate": "2024-02-08",
      "bcbaExpiryDate": "2028-02-08",
      "utStateLicense": "13839880-2506",
      "utahLicenseNumber": "13839880-2506",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-02-08",
      "caqhId": "16145811",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-selecthealth",
          "payerName": "Select Health UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-ut-medicaid",
          "payerName": "UT Medicaid",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uofu",
          "payerName": "University of UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-pehp",
          "payerName": "PEHP UT",
          "status": "Pending"
        },
        {
          "payerId": "pyr-molina-ut",
          "payerName": "Molina UT",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "25300738",
        "bcbaEffectiveDate": "2024-02-08",
        "bcbaExpiryDate": "2028-02-08",
        "utStateLicense": "13839880-2506",
        "utahLicenseNumber": "13839880-2506",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-johnny-new",
    "employeeId": "emp-prv-ages-bcba-johnny-new",
    "providerId": "prv-ages-bcba-johnny-new",
    "firstName": "Johnny",
    "lastName": "New",
    "fullName": "Johnny New",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "29307450",
    "licenseState": "UT",
    "licenseExpiration": "2027-06-23",
    "npi": "1003571381",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Utah",
    "bcbaCertificationNumber": "29307450",
    "bcbaEffectiveDate": "2025-06-23",
    "bcbaExpiryDate": "2027-06-23",
    "utStateLicense": "14231529-2506",
    "utahLicenseNumber": "14231529-2506",
    "isUtah": true,
    "locationIds": [
      "loc-5"
    ],
    "primaryLocationId": "loc-5",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-johnny-new",
      "firstName": "Johnny",
      "lastName": "New",
      "fullName": "Johnny New",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "johnny.new@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1003571381",
      "licenseNumber": "29307450",
      "licenseState": "UT",
      "licenseExpiration": "2027-06-23",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Utah",
      "bcbaCertificationNumber": "29307450",
      "bcbaEffectiveDate": "2025-06-23",
      "bcbaExpiryDate": "2027-06-23",
      "utStateLicense": "14231529-2506",
      "utahLicenseNumber": "14231529-2506",
      "isUtah": true,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-06-23",
      "caqhId": "16567841",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-selecthealth",
          "payerName": "Select Health UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-ut-medicaid",
          "payerName": "UT Medicaid",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uofu",
          "payerName": "University of UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-pehp",
          "payerName": "PEHP UT",
          "status": "Pending"
        },
        {
          "payerId": "pyr-molina-ut",
          "payerName": "Molina UT",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "29307450",
        "bcbaEffectiveDate": "2025-06-23",
        "bcbaExpiryDate": "2027-06-23",
        "utStateLicense": "14231529-2506",
        "utahLicenseNumber": "14231529-2506",
        "region": "Utah",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-hailey-james",
    "employeeId": "emp-prv-ages-bcba-hailey-james",
    "providerId": "prv-ages-bcba-hailey-james",
    "firstName": "Hailey",
    "lastName": "James",
    "fullName": "Hailey James",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "24529710",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-19",
    "npi": "1386226090",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Vacaville",
    "bcbaCertificationNumber": "24529710",
    "bcbaEffectiveDate": "2023-10-19",
    "bcbaExpiryDate": "2027-10-19",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-hailey-james",
      "firstName": "Hailey",
      "lastName": "James",
      "fullName": "Hailey James",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "hailey.james@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1386226090",
      "licenseNumber": "24529710",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-19",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Vacaville",
      "bcbaCertificationNumber": "24529710",
      "bcbaEffectiveDate": "2023-10-19",
      "bcbaExpiryDate": "2027-10-19",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-10-19",
      "caqhId": "16055818",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "24529710",
        "bcbaEffectiveDate": "2023-10-19",
        "bcbaExpiryDate": "2027-10-19",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-karl-michael-kangleon",
    "employeeId": "emp-prv-ages-bcba-karl-michael-kangleon",
    "providerId": "prv-ages-bcba-karl-michael-kangleon",
    "firstName": "Karl",
    "lastName": "Michael Kangleon",
    "fullName": "Karl Michael Kangleon",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "29706295",
    "licenseState": "CA",
    "licenseExpiration": "2027-08-02",
    "npi": "1932754546",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Vacaville",
    "bcbaCertificationNumber": "29706295",
    "bcbaEffectiveDate": "2025-08-02",
    "bcbaExpiryDate": "2027-08-02",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-karl-michael-kangleon",
      "firstName": "Karl",
      "lastName": "Michael Kangleon",
      "fullName": "Karl Michael Kangleon",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "karl.michaelkangleon@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1932754546",
      "licenseNumber": "29706295",
      "licenseState": "CA",
      "licenseExpiration": "2027-08-02",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Vacaville",
      "bcbaCertificationNumber": "29706295",
      "bcbaEffectiveDate": "2025-08-02",
      "bcbaExpiryDate": "2027-08-02",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2025-08-02",
      "caqhId": "16598662",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "29706295",
        "bcbaEffectiveDate": "2025-08-02",
        "bcbaExpiryDate": "2027-08-02",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-india-izidoro-baker",
    "employeeId": "emp-prv-ages-bcba-india-izidoro-baker",
    "providerId": "prv-ages-bcba-india-izidoro-baker",
    "firstName": "India",
    "lastName": "Izidoro Baker",
    "fullName": "India Izidoro Baker",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "24361334",
    "licenseState": "CA",
    "licenseExpiration": "2027-09-30",
    "npi": "1831729664",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Brentwood",
    "bcbaCertificationNumber": "24361334",
    "bcbaEffectiveDate": "2023-09-30",
    "bcbaExpiryDate": "2027-09-30",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-india-izidoro-baker",
      "firstName": "India",
      "lastName": "Izidoro Baker",
      "fullName": "India Izidoro Baker",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "india.izidorobaker@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1831729664",
      "licenseNumber": "24361334",
      "licenseState": "CA",
      "licenseExpiration": "2027-09-30",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Brentwood",
      "bcbaCertificationNumber": "24361334",
      "bcbaEffectiveDate": "2023-09-30",
      "bcbaExpiryDate": "2027-09-30",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-09-30",
      "caqhId": "14617141",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "24361334",
        "bcbaEffectiveDate": "2023-09-30",
        "bcbaExpiryDate": "2027-09-30",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-melody-goh",
    "employeeId": "emp-prv-ages-bcba-melody-goh",
    "providerId": "prv-ages-bcba-melody-goh",
    "firstName": "Melody",
    "lastName": "Goh",
    "fullName": "Melody Goh",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "17501712",
    "licenseState": "CA",
    "licenseExpiration": "2027-05-10",
    "npi": "1093690125",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Livermore",
    "bcbaCertificationNumber": "17501712",
    "bcbaEffectiveDate": "2021-05-10",
    "bcbaExpiryDate": "2027-05-10",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-melody-goh",
      "firstName": "Melody",
      "lastName": "Goh",
      "fullName": "Melody Goh",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "melody.goh@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1093690125",
      "licenseNumber": "17501712",
      "licenseState": "CA",
      "licenseExpiration": "2027-05-10",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Livermore",
      "bcbaCertificationNumber": "17501712",
      "bcbaEffectiveDate": "2021-05-10",
      "bcbaExpiryDate": "2027-05-10",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-05-10",
      "caqhId": "16592947",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "17501712",
        "bcbaEffectiveDate": "2021-05-10",
        "bcbaExpiryDate": "2027-05-10",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Livermore",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-meghan-moriana",
    "employeeId": "emp-prv-ages-bcba-meghan-moriana",
    "providerId": "prv-ages-bcba-meghan-moriana",
    "firstName": "Meghan",
    "lastName": "Moriana",
    "fullName": "Meghan Moriana",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "10793300",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-31",
    "npi": "1093266223",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Brentwood",
    "bcbaCertificationNumber": "10793300",
    "bcbaEffectiveDate": "2018-08-31",
    "bcbaExpiryDate": "2026-08-31",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-meghan-moriana",
      "firstName": "Meghan",
      "lastName": "Moriana",
      "fullName": "Meghan Moriana",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "meghan.moriana@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1093266223",
      "licenseNumber": "10793300",
      "licenseState": "CA",
      "licenseExpiration": "2026-08-31",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Brentwood",
      "bcbaCertificationNumber": "10793300",
      "bcbaEffectiveDate": "2018-08-31",
      "bcbaExpiryDate": "2026-08-31",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2018-08-31",
      "caqhId": "14377120",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "10793300",
        "bcbaEffectiveDate": "2018-08-31",
        "bcbaExpiryDate": "2026-08-31",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-jacob-lopez",
    "employeeId": "emp-prv-ages-bcba-jacob-lopez",
    "providerId": "prv-ages-bcba-jacob-lopez",
    "firstName": "Jacob",
    "lastName": "Lopez",
    "fullName": "Jacob Lopez",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "31456538",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-26",
    "npi": "1255899472",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Brentwood",
    "bcbaCertificationNumber": "31456538",
    "bcbaEffectiveDate": "2026-02-26",
    "bcbaExpiryDate": "2028-02-26",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-jacob-lopez",
      "firstName": "Jacob",
      "lastName": "Lopez",
      "fullName": "Jacob Lopez",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "jacob.lopez@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1255899472",
      "licenseNumber": "31456538",
      "licenseState": "CA",
      "licenseExpiration": "2028-02-26",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Brentwood",
      "bcbaCertificationNumber": "31456538",
      "bcbaEffectiveDate": "2026-02-26",
      "bcbaExpiryDate": "2028-02-26",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2026-02-26",
      "caqhId": "16760752",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "31456538",
        "bcbaEffectiveDate": "2026-02-26",
        "bcbaExpiryDate": "2028-02-26",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Brentwood",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-elise-newman",
    "employeeId": "emp-prv-ages-bcba-elise-newman",
    "providerId": "prv-ages-bcba-elise-newman",
    "firstName": "Elise",
    "lastName": "Newman",
    "fullName": "Elise Newman",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "25217098",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-29",
    "npi": "1770084196",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "25217098",
    "bcbaEffectiveDate": "2024-01-29",
    "bcbaExpiryDate": "2028-01-29",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-elise-newman",
      "firstName": "Elise",
      "lastName": "Newman",
      "fullName": "Elise Newman",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "elise.newman@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1770084196",
      "licenseNumber": "25217098",
      "licenseState": "CA",
      "licenseExpiration": "2028-01-29",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "25217098",
      "bcbaEffectiveDate": "2024-01-29",
      "bcbaExpiryDate": "2028-01-29",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-29",
      "caqhId": "16155472",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "25217098",
        "bcbaEffectiveDate": "2024-01-29",
        "bcbaExpiryDate": "2028-01-29",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-brittany-stack",
    "employeeId": "emp-prv-ages-bcba-brittany-stack",
    "providerId": "prv-ages-bcba-brittany-stack",
    "firstName": "Brittany",
    "lastName": "Stack",
    "fullName": "Brittany Stack",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "14942457",
    "licenseState": "CA",
    "licenseExpiration": "2028-06-21",
    "npi": "1770084196",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Vacaville",
    "bcbaCertificationNumber": "14942457",
    "bcbaEffectiveDate": "2020-06-22",
    "bcbaExpiryDate": "2028-06-21",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-brittany-stack",
      "firstName": "Brittany",
      "lastName": "Stack",
      "fullName": "Brittany Stack",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "brittany.stack@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1770084196",
      "licenseNumber": "14942457",
      "licenseState": "CA",
      "licenseExpiration": "2028-06-21",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Vacaville",
      "bcbaCertificationNumber": "14942457",
      "bcbaEffectiveDate": "2020-06-22",
      "bcbaExpiryDate": "2028-06-21",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2020-06-22",
      "caqhId": "14928309",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "14942457",
        "bcbaEffectiveDate": "2020-06-22",
        "bcbaExpiryDate": "2028-06-21",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-jade-saechao",
    "employeeId": "emp-prv-ages-bcba-jade-saechao",
    "providerId": "prv-ages-bcba-jade-saechao",
    "firstName": "Jade",
    "lastName": "Saechao",
    "fullName": "Jade Saechao",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "25129074",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-10",
    "npi": "1043790033",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "Vacaville",
    "bcbaCertificationNumber": "25129074",
    "bcbaEffectiveDate": "2024-01-11",
    "bcbaExpiryDate": "2028-01-10",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-jade-saechao",
      "firstName": "Jade",
      "lastName": "Saechao",
      "fullName": "Jade Saechao",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "jade.saechao@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1043790033",
      "licenseNumber": "25129074",
      "licenseState": "CA",
      "licenseExpiration": "2028-01-10",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "Vacaville",
      "bcbaCertificationNumber": "25129074",
      "bcbaEffectiveDate": "2024-01-11",
      "bcbaExpiryDate": "2028-01-10",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2024-01-11",
      "caqhId": "16112183",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "25129074",
        "bcbaEffectiveDate": "2024-01-11",
        "bcbaExpiryDate": "2028-01-10",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "Vacaville",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-manjot-sandhu",
    "employeeId": "emp-prv-ages-bcba-manjot-sandhu",
    "providerId": "prv-ages-bcba-manjot-sandhu",
    "firstName": "Manjot",
    "lastName": "Sandhu",
    "fullName": "Manjot Sandhu",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-18-9921",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-15",
    "npi": "1487920193",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-18-9921",
    "bcbaEffectiveDate": "2018-01-15",
    "bcbaExpiryDate": "2028-01-15",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-manjot-sandhu",
      "firstName": "Manjot",
      "lastName": "Sandhu",
      "fullName": "Manjot Sandhu",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "manjot.sandhu@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1487920193",
      "licenseNumber": "BCBA-18-9921",
      "licenseState": "CA",
      "licenseExpiration": "2028-01-15",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-18-9921",
      "bcbaEffectiveDate": "2018-01-15",
      "bcbaExpiryDate": "2028-01-15",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2018-01-15",
      "caqhId": "15482910",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-18-9921",
        "bcbaEffectiveDate": "2018-01-15",
        "bcbaExpiryDate": "2028-01-15",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-angela-jung",
    "employeeId": "emp-prv-ages-bcba-angela-jung",
    "providerId": "prv-ages-bcba-angela-jung",
    "firstName": "Angela",
    "lastName": "Jung",
    "fullName": "Angela Jung",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-21-3912",
    "licenseState": "CA",
    "licenseExpiration": "2027-03-10",
    "npi": "1598201944",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-21-3912",
    "bcbaEffectiveDate": "2021-03-10",
    "bcbaExpiryDate": "2027-03-10",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-angela-jung",
      "firstName": "Angela",
      "lastName": "Jung",
      "fullName": "Angela Jung",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "angela.jung@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1598201944",
      "licenseNumber": "BCBA-21-3912",
      "licenseState": "CA",
      "licenseExpiration": "2027-03-10",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-21-3912",
      "bcbaEffectiveDate": "2021-03-10",
      "bcbaExpiryDate": "2027-03-10",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-03-10",
      "caqhId": "16120391",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-21-3912",
        "bcbaEffectiveDate": "2021-03-10",
        "bcbaExpiryDate": "2027-03-10",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-keiko-ushijima-mwesigwa",
    "employeeId": "emp-prv-ages-bcba-keiko-ushijima-mwesigwa",
    "providerId": "prv-ages-bcba-keiko-ushijima-mwesigwa",
    "firstName": "Keiko",
    "lastName": "Ushijima-Mwesigwa",
    "fullName": "Keiko Ushijima-Mwesigwa",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-19-4820",
    "licenseState": "CA",
    "licenseExpiration": "2027-08-14",
    "npi": "1284920112",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-19-4820",
    "bcbaEffectiveDate": "2019-08-14",
    "bcbaExpiryDate": "2027-08-14",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-keiko-ushijima-mwesigwa",
      "firstName": "Keiko",
      "lastName": "Ushijima-Mwesigwa",
      "fullName": "Keiko Ushijima-Mwesigwa",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "keiko.ushijima-mwesigwa@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1284920112",
      "licenseNumber": "BCBA-19-4820",
      "licenseState": "CA",
      "licenseExpiration": "2027-08-14",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-19-4820",
      "bcbaEffectiveDate": "2019-08-14",
      "bcbaExpiryDate": "2027-08-14",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2019-08-14",
      "caqhId": "15920182",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-19-4820",
        "bcbaEffectiveDate": "2019-08-14",
        "bcbaExpiryDate": "2027-08-14",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-kristi-lui",
    "employeeId": "emp-prv-ages-bcba-kristi-lui",
    "providerId": "prv-ages-bcba-kristi-lui",
    "firstName": "Kristi",
    "lastName": "Lui",
    "fullName": "Kristi Lui",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-20-4910",
    "licenseState": "CA",
    "licenseExpiration": "2028-09-12",
    "npi": "1392810482",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-20-4910",
    "bcbaEffectiveDate": "2020-09-12",
    "bcbaExpiryDate": "2028-09-12",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-kristi-lui",
      "firstName": "Kristi",
      "lastName": "Lui",
      "fullName": "Kristi Lui",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "kristi.lui@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1392810482",
      "licenseNumber": "BCBA-20-4910",
      "licenseState": "CA",
      "licenseExpiration": "2028-09-12",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-20-4910",
      "bcbaEffectiveDate": "2020-09-12",
      "bcbaExpiryDate": "2028-09-12",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2020-09-12",
      "caqhId": "15392019",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-20-4910",
        "bcbaEffectiveDate": "2020-09-12",
        "bcbaExpiryDate": "2028-09-12",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-rabita-osorio",
    "employeeId": "emp-prv-ages-bcba-rabita-osorio",
    "providerId": "prv-ages-bcba-rabita-osorio",
    "firstName": "Rabita",
    "lastName": "Osorio",
    "fullName": "Rabita Osorio",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-17-3810",
    "licenseState": "CA",
    "licenseExpiration": "2027-04-12",
    "npi": "1648201948",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-17-3810",
    "bcbaEffectiveDate": "2017-04-12",
    "bcbaExpiryDate": "2027-04-12",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-rabita-osorio",
      "firstName": "Rabita",
      "lastName": "Osorio",
      "fullName": "Rabita Osorio",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "rabita.osorio@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1648201948",
      "licenseNumber": "BCBA-17-3810",
      "licenseState": "CA",
      "licenseExpiration": "2027-04-12",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-17-3810",
      "bcbaEffectiveDate": "2017-04-12",
      "bcbaExpiryDate": "2027-04-12",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2017-04-12",
      "caqhId": "14920184",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-17-3810",
        "bcbaEffectiveDate": "2017-04-12",
        "bcbaExpiryDate": "2027-04-12",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-serena-richardson",
    "employeeId": "emp-prv-ages-bcba-serena-richardson",
    "providerId": "prv-ages-bcba-serena-richardson",
    "firstName": "Serena",
    "lastName": "Richardson",
    "fullName": "Serena Richardson",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-22-4918",
    "licenseState": "CA",
    "licenseExpiration": "2028-07-15",
    "npi": "1759201842",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-22-4918",
    "bcbaEffectiveDate": "2022-07-15",
    "bcbaExpiryDate": "2028-07-15",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-serena-richardson",
      "firstName": "Serena",
      "lastName": "Richardson",
      "fullName": "Serena Richardson",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "serena.richardson@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1759201842",
      "licenseNumber": "BCBA-22-4918",
      "licenseState": "CA",
      "licenseExpiration": "2028-07-15",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-22-4918",
      "bcbaEffectiveDate": "2022-07-15",
      "bcbaExpiryDate": "2028-07-15",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-07-15",
      "caqhId": "16382019",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-22-4918",
        "bcbaEffectiveDate": "2022-07-15",
        "bcbaExpiryDate": "2028-07-15",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-anthony-verzi-jr",
    "employeeId": "emp-prv-ages-bcba-anthony-verzi-jr",
    "providerId": "prv-ages-bcba-anthony-verzi-jr",
    "firstName": "Anthony",
    "lastName": "Verzi Jr",
    "fullName": "Anthony Verzi Jr",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-20-3918",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-20",
    "npi": "1869201841",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-20-3918",
    "bcbaEffectiveDate": "2020-05-20",
    "bcbaExpiryDate": "2028-05-20",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-anthony-verzi-jr",
      "firstName": "Anthony",
      "lastName": "Verzi Jr",
      "fullName": "Anthony Verzi Jr",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "anthony.verzijr@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1869201841",
      "licenseNumber": "BCBA-20-3918",
      "licenseState": "CA",
      "licenseExpiration": "2028-05-20",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-20-3918",
      "bcbaEffectiveDate": "2020-05-20",
      "bcbaExpiryDate": "2028-05-20",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2020-05-20",
      "caqhId": "15820194",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-20-3918",
        "bcbaEffectiveDate": "2020-05-20",
        "bcbaExpiryDate": "2028-05-20",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-pamela-yata",
    "employeeId": "emp-prv-ages-bcba-pamela-yata",
    "providerId": "prv-ages-bcba-pamela-yata",
    "firstName": "Pamela",
    "lastName": "Yata",
    "fullName": "Pamela Yata",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-21-4912",
    "licenseState": "CA",
    "licenseExpiration": "2027-11-10",
    "npi": "1970291842",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-21-4912",
    "bcbaEffectiveDate": "2021-11-10",
    "bcbaExpiryDate": "2027-11-10",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-pamela-yata",
      "firstName": "Pamela",
      "lastName": "Yata",
      "fullName": "Pamela Yata",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "pamela.yata@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1970291842",
      "licenseNumber": "BCBA-21-4912",
      "licenseState": "CA",
      "licenseExpiration": "2027-11-10",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-21-4912",
      "bcbaEffectiveDate": "2021-11-10",
      "bcbaExpiryDate": "2027-11-10",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-11-10",
      "caqhId": "15729184",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-21-4912",
        "bcbaEffectiveDate": "2021-11-10",
        "bcbaExpiryDate": "2027-11-10",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-itzel-bernal",
    "employeeId": "emp-prv-ages-bcba-itzel-bernal",
    "providerId": "prv-ages-bcba-itzel-bernal",
    "firstName": "Itzel",
    "lastName": "Bernal",
    "fullName": "Itzel Bernal",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-22-3819",
    "licenseState": "CA",
    "licenseExpiration": "2028-12-22",
    "npi": "1482019481",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-22-3819",
    "bcbaEffectiveDate": "2022-12-22",
    "bcbaExpiryDate": "2028-12-22",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-itzel-bernal",
      "firstName": "Itzel",
      "lastName": "Bernal",
      "fullName": "Itzel Bernal",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "itzel.bernal@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1482019481",
      "licenseNumber": "BCBA-22-3819",
      "licenseState": "CA",
      "licenseExpiration": "2028-12-22",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-22-3819",
      "bcbaEffectiveDate": "2022-12-22",
      "bcbaExpiryDate": "2028-12-22",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-12-22",
      "caqhId": "15928104",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-22-3819",
        "bcbaEffectiveDate": "2022-12-22",
        "bcbaExpiryDate": "2028-12-22",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-monica-yeo",
    "employeeId": "emp-prv-ages-bcba-monica-yeo",
    "providerId": "prv-ages-bcba-monica-yeo",
    "firstName": "Monica",
    "lastName": "Yeo",
    "fullName": "Monica Yeo",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-21-5820",
    "licenseState": "CA",
    "licenseExpiration": "2027-06-18",
    "npi": "1392019482",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-21-5820",
    "bcbaEffectiveDate": "2021-06-18",
    "bcbaExpiryDate": "2027-06-18",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-monica-yeo",
      "firstName": "Monica",
      "lastName": "Yeo",
      "fullName": "Monica Yeo",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "monica.yeo@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1392019482",
      "licenseNumber": "BCBA-21-5820",
      "licenseState": "CA",
      "licenseExpiration": "2027-06-18",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-21-5820",
      "bcbaEffectiveDate": "2021-06-18",
      "bcbaExpiryDate": "2027-06-18",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2021-06-18",
      "caqhId": "16492018",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-21-5820",
        "bcbaEffectiveDate": "2021-06-18",
        "bcbaExpiryDate": "2027-06-18",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-patricia-nishan",
    "employeeId": "emp-prv-ages-bcba-patricia-nishan",
    "providerId": "prv-ages-bcba-patricia-nishan",
    "firstName": "Patricia",
    "lastName": "Nishan",
    "fullName": "Patricia Nishan",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-19-2918",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-05",
    "npi": "1284910284",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-19-2918",
    "bcbaEffectiveDate": "2019-10-05",
    "bcbaExpiryDate": "2027-10-05",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-patricia-nishan",
      "firstName": "Patricia",
      "lastName": "Nishan",
      "fullName": "Patricia Nishan",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "patricia.nishan@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1284910284",
      "licenseNumber": "BCBA-19-2918",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-05",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-19-2918",
      "bcbaEffectiveDate": "2019-10-05",
      "bcbaExpiryDate": "2027-10-05",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2019-10-05",
      "caqhId": "15839201",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-19-2918",
        "bcbaEffectiveDate": "2019-10-05",
        "bcbaExpiryDate": "2027-10-05",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-nia-freeman",
    "employeeId": "emp-prv-ages-bcba-nia-freeman",
    "providerId": "prv-ages-bcba-nia-freeman",
    "firstName": "Nia",
    "lastName": "Freeman",
    "fullName": "Nia Freeman",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-22-4820",
    "licenseState": "CA",
    "licenseExpiration": "2028-04-14",
    "npi": "1192840192",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-22-4820",
    "bcbaEffectiveDate": "2022-04-14",
    "bcbaExpiryDate": "2028-04-14",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-nia-freeman",
      "firstName": "Nia",
      "lastName": "Freeman",
      "fullName": "Nia Freeman",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "nia.freeman@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1192840192",
      "licenseNumber": "BCBA-22-4820",
      "licenseState": "CA",
      "licenseExpiration": "2028-04-14",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-22-4820",
      "bcbaEffectiveDate": "2022-04-14",
      "bcbaExpiryDate": "2028-04-14",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2022-04-14",
      "caqhId": "16281049",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-22-4820",
        "bcbaEffectiveDate": "2022-04-14",
        "bcbaExpiryDate": "2028-04-14",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-ages-bcba-savan-patel",
    "employeeId": "emp-prv-ages-bcba-savan-patel",
    "providerId": "prv-ages-bcba-savan-patel",
    "firstName": "Savan",
    "lastName": "Patel",
    "fullName": "Savan Patel",
    "credentials": "MS, BCBA, LBA",
    "disciplines": [
      "ABA"
    ],
    "providerType": "BCBA",
    "licenseNumber": "BCBA-23-4912",
    "licenseState": "CA",
    "licenseExpiration": "2028-02-18",
    "npi": "1084920184",
    "taxonomy": "103K00000X",
    "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
    "region": "San Jose",
    "bcbaCertificationNumber": "BCBA-23-4912",
    "bcbaEffectiveDate": "2023-02-18",
    "bcbaExpiryDate": "2028-02-18",
    "utStateLicense": "",
    "utahLicenseNumber": "",
    "isUtah": false,
    "locationIds": [
      "loc-3"
    ],
    "primaryLocationId": "loc-3",
    "entityIds": [
      "ent-1"
    ],
    "primaryEntityId": "ent-1",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-ages-bcba-savan-patel",
      "firstName": "Savan",
      "lastName": "Patel",
      "fullName": "Savan Patel",
      "credentials": "MS, BCBA, LBA",
      "disciplines": [
        "ABA"
      ],
      "providerType": "BCBA",
      "email": "savan.patel@ageslearningsolutions.com",
      "phone": "(408) 555-0150",
      "npi": "1084920184",
      "licenseNumber": "BCBA-23-4912",
      "licenseState": "CA",
      "licenseExpiration": "2028-02-18",
      "taxonomy": "103K00000X",
      "specialty": "Behavior Analyst (BCBA) / Autism Spectrum Care",
      "region": "San Jose",
      "bcbaCertificationNumber": "BCBA-23-4912",
      "bcbaEffectiveDate": "2023-02-18",
      "bcbaExpiryDate": "2028-02-18",
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "isUtah": false,
      "entityIds": [
        "ent-1"
      ],
      "primaryEntityId": "ent-1",
      "employmentStatus": "Full-Time",
      "startDate": "2023-02-18",
      "caqhId": "16492014",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-catalight",
          "payerName": "Catalight",
          "status": "Approved"
        },
        {
          "payerId": "pyr-carelon",
          "payerName": "Carelon",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Health Plan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "bcbaCertificationNumber": "BCBA-23-4912",
        "bcbaEffectiveDate": "2023-02-18",
        "bcbaExpiryDate": "2028-02-18",
        "utStateLicense": "",
        "utahLicenseNumber": "",
        "region": "San Jose",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-pranali-kalley",
    "employeeId": "emp-prv-pstg-slp-pranali-kalley",
    "providerId": "prv-pstg-slp-pranali-kalley",
    "firstName": "Pranali",
    "lastName": "Kalley",
    "fullName": "Pranali Kalley",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "17412",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1255117768",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-pranali-kalley",
      "firstName": "Pranali",
      "lastName": "Kalley",
      "fullName": "Pranali Kalley",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "pranalik.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1255117768",
      "licenseNumber": "17412",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16082051",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "17412"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-lauren-pourreau",
    "employeeId": "emp-prv-pstg-slp-lauren-pourreau",
    "providerId": "prv-pstg-slp-lauren-pourreau",
    "firstName": "Lauren",
    "lastName": "Pourreau",
    "fullName": "Lauren Pourreau",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "33881",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1275018855",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-lauren-pourreau",
      "firstName": "Lauren",
      "lastName": "Pourreau",
      "fullName": "Lauren Pourreau",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "laurens.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1275018855",
      "licenseNumber": "33881",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "15997800",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1990-04-18",
        "taxonomy": "235Z00000X",
        "licenseNumber": "33881"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-jacqueline-valles",
    "employeeId": "emp-prv-pstg-slp-jacqueline-valles",
    "providerId": "prv-pstg-slp-jacqueline-valles",
    "firstName": "Jacqueline",
    "lastName": "Valles",
    "fullName": "Jacqueline Valles",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "40779",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1881223220",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-jacqueline-valles",
      "firstName": "Jacqueline",
      "lastName": "Valles",
      "fullName": "Jacqueline Valles",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "jacquelinev.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1881223220",
      "licenseNumber": "40779",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16693378",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1994-04-19",
        "taxonomy": "235Z00000X",
        "licenseNumber": "40779"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-georgina-aidee-vasquez",
    "employeeId": "emp-prv-pstg-slp-georgina-aidee-vasquez",
    "providerId": "prv-pstg-slp-georgina-aidee-vasquez",
    "firstName": "Georgina",
    "lastName": "Aidee Vasquez",
    "fullName": "Georgina Aidee Vasquez",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "40931",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1376067348",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-georgina-aidee-vasquez",
      "firstName": "Georgina",
      "lastName": "Aidee Vasquez",
      "fullName": "Georgina Aidee Vasquez",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "georginav.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1376067348",
      "licenseNumber": "40931",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16862210",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1989-08-05",
        "taxonomy": "235Z00000X",
        "licenseNumber": "40931"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-christine-woods",
    "employeeId": "emp-prv-pstg-slp-christine-woods",
    "providerId": "prv-pstg-slp-christine-woods",
    "firstName": "Christine",
    "lastName": "Woods",
    "fullName": "Christine Woods",
    "credentials": "M.A., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "SP17047",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1881984896",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-christine-woods",
      "firstName": "Christine",
      "lastName": "Woods",
      "fullName": "Christine Woods",
      "credentials": "M.A., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "christinew.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1881984896",
      "licenseNumber": "SP17047",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "12191219",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1978-08-09",
        "taxonomy": "235Z00000X",
        "licenseNumber": "SP17047"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-shuyi-tong",
    "employeeId": "emp-prv-pstg-slp-shuyi-tong",
    "providerId": "prv-pstg-slp-shuyi-tong",
    "firstName": "Shuyi",
    "lastName": "Tong",
    "fullName": "Shuyi Tong",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "40014",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1669209078",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-shuyi-tong",
      "firstName": "Shuyi",
      "lastName": "Tong",
      "fullName": "Shuyi Tong",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "shuyit.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1669209078",
      "licenseNumber": "40014",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16307669",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "40014"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-yi-liu",
    "employeeId": "emp-prv-pstg-slp-yi-liu",
    "providerId": "prv-pstg-slp-yi-liu",
    "firstName": "Yi",
    "lastName": "Liu",
    "fullName": "Yi Liu",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "39995",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1225857311",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-yi-liu",
      "firstName": "Yi",
      "lastName": "Liu",
      "fullName": "Yi Liu",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "anna.l@cptherapyservices.com",
      "phone": "(925) 315-4024",
      "npi": "1225857311",
      "licenseNumber": "39995",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16322180",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1998-07-05",
        "taxonomy": "235Z00000X",
        "licenseNumber": "39995"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-sandra-manzo",
    "employeeId": "emp-prv-pstg-slp-sandra-manzo",
    "providerId": "prv-pstg-slp-sandra-manzo",
    "firstName": "Sandra",
    "lastName": "Manzo",
    "fullName": "Sandra Manzo",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "23638",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1811411804",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-sandra-manzo",
      "firstName": "Sandra",
      "lastName": "Manzo",
      "fullName": "Sandra Manzo",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "sandram.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1811411804",
      "licenseNumber": "23638",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16147156",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1983-12-30",
        "taxonomy": "235Z00000X",
        "licenseNumber": "23638"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-valeria-ruvalcaba",
    "employeeId": "emp-prv-pstg-slp-valeria-ruvalcaba",
    "providerId": "prv-pstg-slp-valeria-ruvalcaba",
    "firstName": "Valeria",
    "lastName": "Ruvalcaba",
    "fullName": "Valeria Ruvalcaba",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "41447",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1003740747",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-valeria-ruvalcaba",
      "firstName": "Valeria",
      "lastName": "Ruvalcaba",
      "fullName": "Valeria Ruvalcaba",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "valeriar.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1003740747",
      "licenseNumber": "41447",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16831795",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1999-12-18",
        "taxonomy": "235Z00000X",
        "licenseNumber": "41447"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-aruna-radhakrishnan",
    "employeeId": "emp-prv-pstg-slp-aruna-radhakrishnan",
    "providerId": "prv-pstg-slp-aruna-radhakrishnan",
    "firstName": "Aruna",
    "lastName": "Radhakrishnan",
    "fullName": "Aruna Radhakrishnan",
    "credentials": "MA, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "SP16932",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1518493097",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-aruna-radhakrishnan",
      "firstName": "Aruna",
      "lastName": "Radhakrishnan",
      "fullName": "Aruna Radhakrishnan",
      "credentials": "MA, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "arunar.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1518493097",
      "licenseNumber": "SP16932",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "14424452",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1965-11-06",
        "taxonomy": "235Z00000X",
        "licenseNumber": "SP16932"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-catherine-doerr",
    "employeeId": "emp-prv-pstg-slp-catherine-doerr",
    "providerId": "prv-pstg-slp-catherine-doerr",
    "firstName": "Catherine",
    "lastName": "Doerr",
    "fullName": "Catherine Doerr",
    "credentials": "MA, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "33763",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1689247298",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-catherine-doerr",
      "firstName": "Catherine",
      "lastName": "Doerr",
      "fullName": "Catherine Doerr",
      "credentials": "MA, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "catherined.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1689247298",
      "licenseNumber": "33763",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "15673999",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "33763"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-alicia-nordstrom",
    "employeeId": "emp-prv-pstg-slp-alicia-nordstrom",
    "providerId": "prv-pstg-slp-alicia-nordstrom",
    "firstName": "Alicia",
    "lastName": "Nordstrom",
    "fullName": "Alicia Nordstrom",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "29583",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1952075798",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-alicia-nordstrom",
      "firstName": "Alicia",
      "lastName": "Nordstrom",
      "fullName": "Alicia Nordstrom",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "alician.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1952075798",
      "licenseNumber": "29583",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "15266199",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "29583"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-dillon-o-connell",
    "employeeId": "emp-prv-pstg-slp-dillon-o-connell",
    "providerId": "prv-pstg-slp-dillon-o-connell",
    "firstName": "Dillon",
    "lastName": "O'Connell",
    "fullName": "Dillon O'Connell",
    "credentials": "MA, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "33486",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1962075713",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-dillon-o-connell",
      "firstName": "Dillon",
      "lastName": "O'Connell",
      "fullName": "Dillon O'Connell",
      "credentials": "MA, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "dillono.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1962075713",
      "licenseNumber": "33486",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "15696150",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1994-03-15",
        "taxonomy": "235Z00000X",
        "licenseNumber": "33486"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-valerie-russell",
    "employeeId": "emp-prv-pstg-slp-valerie-russell",
    "providerId": "prv-pstg-slp-valerie-russell",
    "firstName": "Valerie",
    "lastName": "Russell",
    "fullName": "Valerie Russell",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "29847",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1962182923",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-valerie-russell",
      "firstName": "Valerie",
      "lastName": "Russell",
      "fullName": "Valerie Russell",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "valerievr.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1962182923",
      "licenseNumber": "29847",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16143512",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "29847"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-sierra-bone",
    "employeeId": "emp-prv-pstg-slp-sierra-bone",
    "providerId": "prv-pstg-slp-sierra-bone",
    "firstName": "Sierra",
    "lastName": "Bone",
    "fullName": "Sierra Bone",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "30178",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1245858810",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-sierra-bone",
      "firstName": "Sierra",
      "lastName": "Bone",
      "fullName": "Sierra Bone",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "sierrab.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1245858810",
      "licenseNumber": "30178",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "15094231",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1995-05-29",
        "taxonomy": "235Z00000X",
        "licenseNumber": "30178"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-heather-zamani",
    "employeeId": "emp-prv-pstg-slp-heather-zamani",
    "providerId": "prv-pstg-slp-heather-zamani",
    "firstName": "Heather",
    "lastName": "Zamani",
    "fullName": "Heather Zamani",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "29515",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1023752599",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-heather-zamani",
      "firstName": "Heather",
      "lastName": "Zamani",
      "fullName": "Heather Zamani",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "heatherz.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1023752599",
      "licenseNumber": "29515",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "15807520",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "29515"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-shannon-knapp",
    "employeeId": "emp-prv-pstg-slp-shannon-knapp",
    "providerId": "prv-pstg-slp-shannon-knapp",
    "firstName": "Shannon",
    "lastName": "Knapp",
    "fullName": "Shannon Knapp",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "35991",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1437422060",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-shannon-knapp",
      "firstName": "Shannon",
      "lastName": "Knapp",
      "fullName": "Shannon Knapp",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "shannonk.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1437422060",
      "licenseNumber": "35991",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "14099519",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "35991"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-jaclyn-magner",
    "employeeId": "emp-prv-pstg-slp-jaclyn-magner",
    "providerId": "prv-pstg-slp-jaclyn-magner",
    "firstName": "Jaclyn",
    "lastName": "Magner",
    "fullName": "Jaclyn Magner",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "19145",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1346079894",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-jaclyn-magner",
      "firstName": "Jaclyn",
      "lastName": "Magner",
      "fullName": "Jaclyn Magner",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "jaclynm.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1346079894",
      "licenseNumber": "19145",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16145811",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "2000-08-17",
        "taxonomy": "235Z00000X",
        "licenseNumber": "19145"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-stacey-romero",
    "employeeId": "emp-prv-pstg-slp-stacey-romero",
    "providerId": "prv-pstg-slp-stacey-romero",
    "firstName": "Stacey",
    "lastName": "Romero",
    "fullName": "Stacey Romero",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "9106",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1609603943",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-stacey-romero",
      "firstName": "Stacey",
      "lastName": "Romero",
      "fullName": "Stacey Romero",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "staceyr.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1609603943",
      "licenseNumber": "9106",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "15920194",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "9106"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-christina-harman",
    "employeeId": "emp-prv-pstg-slp-christina-harman",
    "providerId": "prv-pstg-slp-christina-harman",
    "firstName": "Christina",
    "lastName": "Harman",
    "fullName": "Christina Harman",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "25830",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1942617238",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-christina-harman",
      "firstName": "Christina",
      "lastName": "Harman",
      "fullName": "Christina Harman",
      "credentials": "MS, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "christinah.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1942617238",
      "licenseNumber": "25830",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "13582408",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "25830"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-rocio-azocar",
    "employeeId": "emp-prv-pstg-slp-rocio-azocar",
    "providerId": "prv-pstg-slp-rocio-azocar",
    "firstName": "Rocio",
    "lastName": "Azocar",
    "fullName": "Rocio Azocar",
    "credentials": "M.S, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "SP30928",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1871364232",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-rocio-azocar",
      "firstName": "Rocio",
      "lastName": "Azocar",
      "fullName": "Rocio Azocar",
      "credentials": "M.S, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "rocioa.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1871364232",
      "licenseNumber": "SP30928",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16920194",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "SP30928"
      }
    }
  },
  {
    "id": "cs-prv-pstg-slp-fernanda-astudillo",
    "employeeId": "emp-prv-pstg-slp-fernanda-astudillo",
    "providerId": "prv-pstg-slp-fernanda-astudillo",
    "firstName": "Fernanda",
    "lastName": "Astudillo",
    "fullName": "Fernanda Astudillo",
    "credentials": "M.S., CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "SP34626",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1083475404",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-1"
    ],
    "primaryLocationId": "loc-1",
    "entityIds": [
      "ent-pstg-inc"
    ],
    "primaryEntityId": "ent-pstg-inc",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-pstg-slp-fernanda-astudillo",
      "firstName": "Fernanda",
      "lastName": "Astudillo",
      "fullName": "Fernanda Astudillo",
      "credentials": "M.S., CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "fernandaa.slp@proficiotherapy.com",
      "phone": "(925) 315-4024",
      "npi": "1083475404",
      "licenseNumber": "SP34626",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-pstg-inc"
      ],
      "primaryEntityId": "ent-pstg-inc",
      "employmentStatus": "Full-Time",
      "startDate": "2023-01-15",
      "caqhId": "16829104",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem Blue Cross",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / Evernorth",
          "status": "Approved"
        },
        {
          "payerId": "pyr-magellan",
          "payerName": "Magellan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-tricare",
          "payerName": "Tricare",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uhc",
          "payerName": "UnitedHealthcare (UHC / Optum)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-scfhp",
          "payerName": "Santa Clara Family Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-vhp",
          "payerName": "Valley Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-sutter",
          "payerName": "Sutter Health",
          "status": "Approved"
        },
        {
          "payerId": "pyr-hpsm",
          "payerName": "Healthplan of San Mateo",
          "status": "Approved"
        },
        {
          "payerId": "pyr-partnership",
          "payerName": "Partnership HealthPlan of CA",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "",
        "taxonomy": "235Z00000X",
        "licenseNumber": "SP34626"
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-miranda-freeman",
    "employeeId": "emp-prv-cpts-ot-miranda-freeman",
    "providerId": "prv-cpts-ot-miranda-freeman",
    "firstName": "Miranda",
    "lastName": "Freeman",
    "fullName": "Miranda Freeman",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "22890",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-31",
    "npi": "1326736042",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-miranda-freeman",
      "firstName": "Miranda",
      "lastName": "Freeman",
      "fullName": "Miranda Freeman",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "miranda@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1326736042",
      "licenseNumber": "22890",
      "licenseState": "CA",
      "licenseExpiration": "2026-08-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "15920517",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1994-08-25",
        "taxonomy": "225X00000X",
        "licenseNumber": "22890",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-alyssa-barker",
    "employeeId": "emp-prv-cpts-ot-alyssa-barker",
    "providerId": "prv-cpts-ot-alyssa-barker",
    "firstName": "Alyssa",
    "lastName": "Barker",
    "fullName": "Alyssa Barker",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "27856",
    "licenseState": "CA",
    "licenseExpiration": "2027-07-31",
    "npi": "1114646304",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-alyssa-barker",
      "firstName": "Alyssa",
      "lastName": "Barker",
      "fullName": "Alyssa Barker",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "aly@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1114646304",
      "licenseNumber": "27856",
      "licenseState": "CA",
      "licenseExpiration": "2027-07-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16553799",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1995-07-16",
        "taxonomy": "225X00000X",
        "licenseNumber": "27856",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-emily-gayton",
    "employeeId": "emp-prv-cpts-ot-emily-gayton",
    "providerId": "prv-cpts-ot-emily-gayton",
    "firstName": "Emily",
    "lastName": "Gayton",
    "fullName": "Emily Gayton",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "28130",
    "licenseState": "CA",
    "licenseExpiration": "2027-03-31",
    "npi": "1871473421",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-emily-gayton",
      "firstName": "Emily",
      "lastName": "Gayton",
      "fullName": "Emily Gayton",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "emily@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1871473421",
      "licenseNumber": "28130",
      "licenseState": "CA",
      "licenseExpiration": "2027-03-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16629183",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1999-03-12",
        "taxonomy": "225X00000X",
        "licenseNumber": "28130",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-keara-greenan",
    "employeeId": "emp-prv-cpts-ot-keara-greenan",
    "providerId": "prv-cpts-ot-keara-greenan",
    "firstName": "Keara",
    "lastName": "Greenan",
    "fullName": "Keara Greenan",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "25938",
    "licenseState": "CA",
    "licenseExpiration": "2028-06-30",
    "npi": "1659194306",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-keara-greenan",
      "firstName": "Keara",
      "lastName": "Greenan",
      "fullName": "Keara Greenan",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "keara@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1659194306",
      "licenseNumber": "25938",
      "licenseState": "CA",
      "licenseExpiration": "2028-06-30",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16349233",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "2000-06-28",
        "taxonomy": "225X00000X",
        "licenseNumber": "25938",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-elena-javier",
    "employeeId": "emp-prv-cpts-ot-elena-javier",
    "providerId": "prv-cpts-ot-elena-javier",
    "firstName": "Elena",
    "lastName": "Javier",
    "fullName": "Elena Javier",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "21333",
    "licenseState": "CA",
    "licenseExpiration": "2027-12-31",
    "npi": "1902471204",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-elena-javier",
      "firstName": "Elena",
      "lastName": "Javier",
      "fullName": "Elena Javier",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "elena@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1902471204",
      "licenseNumber": "21333",
      "licenseState": "CA",
      "licenseExpiration": "2027-12-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "15150292",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1995-12-26",
        "taxonomy": "225X00000X",
        "licenseNumber": "21333",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-deana-kamiya",
    "employeeId": "emp-prv-cpts-ot-deana-kamiya",
    "providerId": "prv-cpts-ot-deana-kamiya",
    "firstName": "Deana",
    "lastName": "Kamiya",
    "fullName": "Deana Kamiya",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "26815",
    "licenseState": "CA",
    "licenseExpiration": "2027-11-30",
    "npi": "1740014562",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-deana-kamiya",
      "firstName": "Deana",
      "lastName": "Kamiya",
      "fullName": "Deana Kamiya",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "deana@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1740014562",
      "licenseNumber": "26815",
      "licenseState": "CA",
      "licenseExpiration": "2027-11-30",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16291187",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1997-11-13",
        "taxonomy": "225X00000X",
        "licenseNumber": "26815",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-irene-lestari",
    "employeeId": "emp-prv-cpts-ot-irene-lestari",
    "providerId": "prv-cpts-ot-irene-lestari",
    "firstName": "Irene",
    "lastName": "Lestari",
    "fullName": "Irene Lestari",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "7552",
    "licenseState": "CA",
    "licenseExpiration": "2027-06-30",
    "npi": "1881866820",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-irene-lestari",
      "firstName": "Irene",
      "lastName": "Lestari",
      "fullName": "Irene Lestari",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "irene@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1881866820",
      "licenseNumber": "7552",
      "licenseState": "CA",
      "licenseExpiration": "2027-06-30",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "15668412",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1977-06-18",
        "taxonomy": "225X00000X",
        "licenseNumber": "7552",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-crystal-fuentez",
    "employeeId": "emp-prv-cpts-ot-crystal-fuentez",
    "providerId": "prv-cpts-ot-crystal-fuentez",
    "firstName": "Crystal",
    "lastName": "Fuentez",
    "fullName": "Crystal Fuentez",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "23285",
    "licenseState": "CA",
    "licenseExpiration": "2028-07-31",
    "npi": "1073251575",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-crystal-fuentez",
      "firstName": "Crystal",
      "lastName": "Fuentez",
      "fullName": "Crystal Fuentez",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "crystal@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1073251575",
      "licenseNumber": "23285",
      "licenseState": "CA",
      "licenseExpiration": "2028-07-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "15586534",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1988-07-03",
        "taxonomy": "225X00000X",
        "licenseNumber": "23285",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-graydon-larsen",
    "employeeId": "emp-prv-cpts-ot-graydon-larsen",
    "providerId": "prv-cpts-ot-graydon-larsen",
    "firstName": "Graydon",
    "lastName": "Larsen",
    "fullName": "Graydon Larsen",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "12814739-4201",
    "licenseState": "UT",
    "licenseExpiration": "2027-05-31",
    "npi": "1730857285",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-graydon-larsen",
      "firstName": "Graydon",
      "lastName": "Larsen",
      "fullName": "Graydon Larsen",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "graydon@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1730857285",
      "licenseNumber": "12814739-4201",
      "licenseState": "UT",
      "licenseExpiration": "2027-05-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": true,
      "utStateLicense": "12814739-4201",
      "utahLicenseNumber": "12814739-4201",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "15805043",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-selecthealth",
          "payerName": "Select Health UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-ut-medicaid",
          "payerName": "UT Medicaid",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uofu",
          "payerName": "University of UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-molina-ut",
          "payerName": "Molina UT",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1987-12-28",
        "taxonomy": "225X00000X",
        "licenseNumber": "12814739-4201",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-natalie-merrill",
    "employeeId": "emp-prv-cpts-ot-natalie-merrill",
    "providerId": "prv-cpts-ot-natalie-merrill",
    "firstName": "Natalie",
    "lastName": "Merrill",
    "fullName": "Natalie Merrill",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "14270093-4201",
    "licenseState": "UT",
    "licenseExpiration": "2027-05-31",
    "npi": "1669097309",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-natalie-merrill",
      "firstName": "Natalie",
      "lastName": "Merrill",
      "fullName": "Natalie Merrill",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "natalie@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1669097309",
      "licenseNumber": "14270093-4201",
      "licenseState": "UT",
      "licenseExpiration": "2027-05-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": true,
      "utStateLicense": "14270093-4201",
      "utahLicenseNumber": "14270093-4201",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16804205",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-selecthealth",
          "payerName": "Select Health UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-ut-medicaid",
          "payerName": "UT Medicaid",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uofu",
          "payerName": "University of UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-molina-ut",
          "payerName": "Molina UT",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1999-08-11",
        "taxonomy": "225X00000X",
        "licenseNumber": "14270093-4201",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-christina-gallo",
    "employeeId": "emp-prv-cpts-ot-christina-gallo",
    "providerId": "prv-cpts-ot-christina-gallo",
    "firstName": "Christina",
    "lastName": "Gallo",
    "fullName": "Christina Gallo",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "14268177-4201, 11034",
    "licenseState": "UT",
    "licenseExpiration": "2027-05-31",
    "npi": "1982991865",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-christina-gallo",
      "firstName": "Christina",
      "lastName": "Gallo",
      "fullName": "Christina Gallo",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "christinag@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1982991865",
      "licenseNumber": "14268177-4201, 11034",
      "licenseState": "UT",
      "licenseExpiration": "2027-05-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": true,
      "utStateLicense": "14268177-4201, 11034",
      "utahLicenseNumber": "14268177-4201, 11034",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "15668351",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        },
        {
          "payerId": "pyr-selecthealth",
          "payerName": "Select Health UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-ut-medicaid",
          "payerName": "UT Medicaid",
          "status": "Approved"
        },
        {
          "payerId": "pyr-uofu",
          "payerName": "University of UT",
          "status": "Approved"
        },
        {
          "payerId": "pyr-molina-ut",
          "payerName": "Molina UT",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1969-04-19",
        "taxonomy": "225X00000X",
        "licenseNumber": "14268177-4201, 11034",
        "isUtah": true
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-morgan-king",
    "employeeId": "emp-prv-cpts-ot-morgan-king",
    "providerId": "prv-cpts-ot-morgan-king",
    "firstName": "Morgan",
    "lastName": "King",
    "fullName": "Morgan King",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "24710",
    "licenseState": "CA",
    "licenseExpiration": "2027-10-31",
    "npi": "1366141061",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-morgan-king",
      "firstName": "Morgan",
      "lastName": "King",
      "fullName": "Morgan King",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "morgank@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1366141061",
      "licenseNumber": "24710",
      "licenseState": "CA",
      "licenseExpiration": "2027-10-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16839254",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1997-10-23",
        "taxonomy": "225X00000X",
        "licenseNumber": "24710",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-miriam-garcia",
    "employeeId": "emp-prv-cpts-ot-miriam-garcia",
    "providerId": "prv-cpts-ot-miriam-garcia",
    "firstName": "Miriam",
    "lastName": "Garcia",
    "fullName": "Miriam Garcia",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "29588",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-31",
    "npi": "1649954454",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-miriam-garcia",
      "firstName": "Miriam",
      "lastName": "Garcia",
      "fullName": "Miriam Garcia",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "miriamg@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1649954454",
      "licenseNumber": "29588",
      "licenseState": "CA",
      "licenseExpiration": "2028-01-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16917799",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1996-01-21",
        "taxonomy": "225X00000X",
        "licenseNumber": "29588",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-sabrina-figueroa",
    "employeeId": "emp-prv-cpts-ot-sabrina-figueroa",
    "providerId": "prv-cpts-ot-sabrina-figueroa",
    "firstName": "Sabrina",
    "lastName": "Figueroa",
    "fullName": "Sabrina Figueroa",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "29601",
    "licenseState": "CA",
    "licenseExpiration": "2028-03-31",
    "npi": "1922576784",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-sabrina-figueroa",
      "firstName": "Sabrina",
      "lastName": "Figueroa",
      "fullName": "Sabrina Figueroa",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "sabrinaf@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1922576784",
      "licenseNumber": "29601",
      "licenseState": "CA",
      "licenseExpiration": "2028-03-31",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16917095",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "2000-03-31",
        "taxonomy": "225X00000X",
        "licenseNumber": "29601",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-ot-allison-inloes",
    "employeeId": "emp-prv-cpts-ot-allison-inloes",
    "providerId": "prv-cpts-ot-allison-inloes",
    "firstName": "Allison",
    "lastName": "Inloes",
    "fullName": "Allison Inloes",
    "credentials": "MS, OTR/L",
    "disciplines": [
      "OT"
    ],
    "providerType": "OTR/L",
    "licenseNumber": "21948",
    "licenseState": "CA",
    "licenseExpiration": "2027-06-30",
    "npi": "1616478921",
    "taxonomy": "225X00000X",
    "specialty": "Occupational Therapist (OTR/L)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-ot-allison-inloes",
      "firstName": "Allison",
      "lastName": "Inloes",
      "fullName": "Allison Inloes",
      "credentials": "MS, OTR/L",
      "disciplines": [
        "OT"
      ],
      "providerType": "OTR/L",
      "email": "allisoni@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1616478921",
      "licenseNumber": "21948",
      "licenseState": "CA",
      "licenseExpiration": "2027-06-30",
      "taxonomy": "225X00000X",
      "specialty": "Occupational Therapist (OTR/L)",
      "isUtah": false,
      "utStateLicense": "",
      "utahLicenseNumber": "",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-05-15",
      "caqhId": "16164780",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-blueshield",
          "payerName": "Blue Shield of CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1992-06-15",
        "taxonomy": "225X00000X",
        "licenseNumber": "21948",
        "isUtah": false
      }
    }
  },
  {
    "id": "cs-prv-cpts-slp-brenda-castro",
    "employeeId": "emp-prv-cpts-slp-brenda-castro",
    "providerId": "prv-cpts-slp-brenda-castro",
    "firstName": "Brenda",
    "lastName": "Castro",
    "fullName": "Brenda Castro",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "32414",
    "licenseState": "CA",
    "licenseExpiration": "2027-03-31",
    "npi": "1699651158",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-slp-brenda-castro",
      "firstName": "Brenda",
      "lastName": "Castro",
      "fullName": "Brenda Castro",
      "credentials": "MS, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "brenda@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1699651158",
      "licenseNumber": "32414",
      "licenseState": "CA",
      "licenseExpiration": "2027-03-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-01",
      "caqhId": "16602383",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1989-03-29",
        "taxonomy": "235Z00000X",
        "licenseNumber": "32414"
      }
    }
  },
  {
    "id": "cs-prv-cpts-slp-chitra-lakshumanan",
    "employeeId": "emp-prv-cpts-slp-chitra-lakshumanan",
    "providerId": "prv-cpts-slp-chitra-lakshumanan",
    "firstName": "Chitra",
    "lastName": "Lakshumanan",
    "fullName": "Chitra Lakshumanan",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "38254",
    "licenseState": "CA",
    "licenseExpiration": "2028-01-31",
    "npi": "1215503172",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-slp-chitra-lakshumanan",
      "firstName": "Chitra",
      "lastName": "Lakshumanan",
      "fullName": "Chitra Lakshumanan",
      "credentials": "MS, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "chitra@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1215503172",
      "licenseNumber": "38254",
      "licenseState": "CA",
      "licenseExpiration": "2028-01-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-01",
      "caqhId": "15164471",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1997-01-03",
        "taxonomy": "235Z00000X",
        "licenseNumber": "38254"
      }
    }
  },
  {
    "id": "cs-prv-cpts-slp-leah-schwenk",
    "employeeId": "emp-prv-cpts-slp-leah-schwenk",
    "providerId": "prv-cpts-slp-leah-schwenk",
    "firstName": "Leah",
    "lastName": "Schwenk",
    "fullName": "Leah Schwenk",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "38923",
    "licenseState": "CA",
    "licenseExpiration": "2026-11-30",
    "npi": "1891577912",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-slp-leah-schwenk",
      "firstName": "Leah",
      "lastName": "Schwenk",
      "fullName": "Leah Schwenk",
      "credentials": "MS, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "leahs@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1891577912",
      "licenseNumber": "38923",
      "licenseState": "CA",
      "licenseExpiration": "2026-11-30",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-01",
      "caqhId": "16051043",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1993-11-18",
        "taxonomy": "235Z00000X",
        "licenseNumber": "38923"
      }
    }
  },
  {
    "id": "cs-prv-cpts-slp-christine-woods",
    "employeeId": "emp-prv-cpts-slp-christine-woods",
    "providerId": "prv-cpts-slp-christine-woods",
    "firstName": "Christine",
    "lastName": "Woods",
    "fullName": "Christine Woods",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "17047",
    "licenseState": "CA",
    "licenseExpiration": "2026-08-31",
    "npi": "1881984896",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-slp-christine-woods",
      "firstName": "Christine",
      "lastName": "Woods",
      "fullName": "Christine Woods",
      "credentials": "MS, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "christine.w@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1881984896",
      "licenseNumber": "17047",
      "licenseState": "CA",
      "licenseExpiration": "2026-08-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-01",
      "caqhId": "12191219",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1978-08-09",
        "taxonomy": "235Z00000X",
        "licenseNumber": "17047"
      }
    }
  },
  {
    "id": "cs-prv-cpts-slp-sierra-bone",
    "employeeId": "emp-prv-cpts-slp-sierra-bone",
    "providerId": "prv-cpts-slp-sierra-bone",
    "firstName": "Sierra",
    "lastName": "Bone",
    "fullName": "Sierra Bone",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "30178",
    "licenseState": "CA",
    "licenseExpiration": "2028-05-31",
    "npi": "1245858810",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-slp-sierra-bone",
      "firstName": "Sierra",
      "lastName": "Bone",
      "fullName": "Sierra Bone",
      "credentials": "MS, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "sierrab.slp@proficiotherapy.com",
      "phone": "(925) 555-0199",
      "npi": "1245858810",
      "licenseNumber": "30178",
      "licenseState": "CA",
      "licenseExpiration": "2028-05-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-01",
      "caqhId": "15094231",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1995-05-29",
        "taxonomy": "235Z00000X",
        "licenseNumber": "30178"
      }
    }
  },
  {
    "id": "cs-prv-cpts-slp-yi-liu",
    "employeeId": "emp-prv-cpts-slp-yi-liu",
    "providerId": "prv-cpts-slp-yi-liu",
    "firstName": "Yi",
    "lastName": "Liu",
    "fullName": "Yi Liu",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "39995",
    "licenseState": "CA",
    "licenseExpiration": "2027-07-31",
    "npi": "1225857311",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-slp-yi-liu",
      "firstName": "Yi",
      "lastName": "Liu",
      "fullName": "Yi Liu",
      "credentials": "MS, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "anna.l@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1225857311",
      "licenseNumber": "39995",
      "licenseState": "CA",
      "licenseExpiration": "2027-07-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-01",
      "caqhId": "16322180",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1998-07-05",
        "taxonomy": "235Z00000X",
        "licenseNumber": "39995"
      }
    }
  },
  {
    "id": "cs-prv-cpts-slp-shannon-singleton",
    "employeeId": "emp-prv-cpts-slp-shannon-singleton",
    "providerId": "prv-cpts-slp-shannon-singleton",
    "firstName": "Shannon",
    "lastName": "Singleton",
    "fullName": "Shannon Singleton",
    "credentials": "MS, CCC-SLP",
    "disciplines": [
      "Speech"
    ],
    "providerType": "SLP",
    "licenseNumber": "41835",
    "licenseState": "CA",
    "licenseExpiration": "2028-07-31",
    "npi": "1528933538",
    "taxonomy": "235Z00000X",
    "specialty": "Speech-Language Pathologist (SLP)",
    "locationIds": [
      "loc-2"
    ],
    "primaryLocationId": "loc-2",
    "entityIds": [
      "ent-3"
    ],
    "primaryEntityId": "ent-3",
    "status": "Active",
    "isDemo": false,
    "rawData": {
      "id": "prv-cpts-slp-shannon-singleton",
      "firstName": "Shannon",
      "lastName": "Singleton",
      "fullName": "Shannon Singleton",
      "credentials": "MS, CCC-SLP",
      "disciplines": [
        "Speech"
      ],
      "providerType": "SLP",
      "email": "shannons@cptherapyservices.com",
      "phone": "(925) 555-0199",
      "npi": "1528933538",
      "licenseNumber": "41835",
      "licenseState": "CA",
      "licenseExpiration": "2028-07-31",
      "taxonomy": "235Z00000X",
      "specialty": "Speech-Language Pathologist (SLP)",
      "entityIds": [
        "ent-3"
      ],
      "primaryEntityId": "ent-3",
      "employmentStatus": "Full-Time",
      "startDate": "2023-06-01",
      "caqhId": "16856264",
      "caqhStatus": "Attested",
      "paveStatus": "Approved",
      "npiVerified": true,
      "nppesRecordMatch": true,
      "payerEnrollments": [
        {
          "payerId": "pyr-aetna",
          "payerName": "Aetna CA",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cigna",
          "payerName": "Cigna / ASH",
          "status": "Approved"
        },
        {
          "payerId": "pyr-anthem",
          "payerName": "Anthem",
          "status": "Approved"
        },
        {
          "payerId": "pyr-triwest",
          "payerName": "TriWest",
          "status": "Approved"
        },
        {
          "payerId": "pyr-medical",
          "payerName": "MediCal",
          "status": "Approved"
        },
        {
          "payerId": "pyr-cchp",
          "payerName": "Contra Costa Health Plan",
          "status": "Approved"
        },
        {
          "payerId": "pyr-alameda",
          "payerName": "Alameda Alliance",
          "status": "Approved"
        },
        {
          "payerId": "pyr-chcn",
          "payerName": "Community Health Center Network (CHCN)",
          "status": "Approved"
        }
      ],
      "active": true,
      "isDemo": false,
      "contractInfo": {
        "dob": "1985-07-03",
        "taxonomy": "235Z00000X",
        "licenseNumber": "41835"
      }
    }
  }
];

export const INITIAL_APPLICATION_COMMENTS: ApplicationComment[] = [];

// Dedicated Application Documents Collection (Default empty)
export const INITIAL_APPLICATION_DOCUMENTS: ApplicationDocument[] = [];
