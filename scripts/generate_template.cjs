const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Ensure docs directory exists
const docsDir = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const workbook = XLSX.utils.book_new();

// -------------------------------------------------------------
// Sheet 1: README & INSTRUCTIONS
// -------------------------------------------------------------
const readmeData = [
  ['PROVIDER CREDENTIALING & PAYER ENROLLMENT MANAGEMENT SYSTEM'],
  ['DATA IMPORT & PRODUCTION MASTER TEMPLATE (INTERNAL DEVELOPMENT ONLY)'],
  [''],
  ['PURPOSE & USAGE GUIDELINES:'],
  ['1. This Excel template provides the authoritative schema structure for bulk importing organizational, clinical, payer, employee, and application records into the Google Cloud Firestore database.'],
  ['2. All fields correspond exactly to the production TypeScript interfaces (LegalEntity, PracticeLocation, Payer, Employee, ClinicalStaff, CredentialingRecord, AppAccount).'],
  ['3. DO NOT import this file into the webapp bundle or public directory. This is an internal configuration file to be completed by leadership and ingested via server-side migration.'],
  ['4. Rows beginning with "[EXAMPLE - DO NOT IMPORT]" are illustrative guidance rows. Replace or delete them before final ingestion.'],
  [''],
  ['SHEET BREAKDOWN & RELATIONSHIP ORDER:'],
  ['Sheet Name', 'Description', 'Required Relationships / Foreign Keys'],
  ['Entities_Organizations', 'Legal entities, Tax IDs, Type 2 NPIs, and group ownership', 'Primary root entity (no parent)'],
  ['Practice_Locations', 'Physical clinic locations, in-home regions, and telehealth hubs', 'References Entity_ID from Entities_Organizations'],
  ['Payers_Insurance', 'Commercial, Medicaid, Regional center, and Tricare health plans', 'Independent master catalog'],
  ['Employees_Master', 'General company employee roster (all staff)', 'References Location_ID and Entity_ID'],
  ['ClinicalStaff_Providers', 'Clinical providers, BCBAs, SLPs, OTR/Ls, licenses, NPIs, CAQH', 'References Employee_ID, Entity_ID, and Location_ID'],
  ['Credentialing_Applications', 'Individual payer credentialing records and lifecycle tracking', 'References Provider_ID, Payer_ID, Entity_ID, Location_ID'],
  ['System_Users_Accounts', 'User accounts with Role-Based Access Control (RBAC)', 'Independent authentication profiles'],
  [''],
  ['DATA FORMATTING STANDARDS:'],
  ['Data Type', 'Accepted Format', 'Example'],
  ['Dates', 'ISO 8601 (YYYY-MM-DD)', '2026-03-15'],
  ['Boolean', 'TRUE or FALSE (uppercase)', 'TRUE'],
  ['Disciplines', 'ABA, Speech, OT (comma-separated if multiple)', 'ABA, Speech'],
  ['Provider Types', 'BCBA, BCaBA, RBT, SLP, SLPA, OTR/L, COTA, Clinical Director', 'BCBA'],
  ['Workflow Stages', 'Intake, Documents Pending, Documents Complete, CAQH Pending, PAVE Pending, Application Preparation, Application Submitted, Payer Review, Additional Documents Requested, Correction Required, Resubmitted, Approved, Linking Pending, Linked, Effective, Closed / Not Contracted, Recredentialing Due, Overdue', 'Approved'],
  ['Application Types', 'Initial credentialing, New provider credentialing, Recredentialing, Location addition, Provider linking, Group addition, Demographic update', 'Initial credentialing'],
  ['System Roles', 'Credentialing Specialist, Credentialing Lead / Manager, Provider, HR/Operations, Clinical Team, Billing and Claims, Leadership / Management, System Administrator', 'Credentialing Specialist']
];

const wsReadme = XLSX.utils.aoa_to_sheet(readmeData);
wsReadme['!cols'] = [{ wch: 32 }, { wch: 75 }, { wch: 50 }];
XLSX.utils.book_append_sheet(workbook, wsReadme, 'README_Instructions');

// -------------------------------------------------------------
// Sheet 2: Entities_Organizations
// -------------------------------------------------------------
const entitiesHeaders = [
  'Entity_ID',
  'Legal_Name',
  'DBA_Name',
  'EIN_Tax_ID',
  'Type2_NPI',
  'Taxonomy_Code',
  'Ownership_Details',
  'W9_On_File',
  'Primary_Contact_Name',
  'Contact_Email',
  'Contact_Phone',
  'Physical_Address',
  'Is_Active'
];

const entitiesData = [
  entitiesHeaders,
  [
    '[FIELD DEFINITION]',
    'Unique Entity Identifier (e.g. ent-1)',
    'Full Registered Legal Corporate Name',
    'Doing Business As (DBA) Trade Name',
    'Federal Employer Identification Number (XX-XXXXXXX)',
    '10-digit Group / Organizational Type 2 NPI',
    '10-character Healthcare Provider Taxonomy Code',
    'Ownership & Operational Control Description',
    'W-9 Form Signed and on File (TRUE / FALSE)',
    'Primary Organizational Signatory or Contact',
    'Primary Invoicing / Credentialing Notification Email',
    'Primary Corporate Telephone Number',
    'Registered Headquarters Physical Mailing Address',
    'Active Operational Status (TRUE / FALSE)'
  ],
  [
    '[REQUIRED?]',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'OPTIONAL',
    'REQUIRED',
    'OPTIONAL',
    'REQUIRED',
    'OPTIONAL',
    'OPTIONAL',
    'REQUIRED'
  ],
  [
    '[EXAMPLE 1]',
    'ent-1',
    'Ages Learning Solutions Inc.',
    'Ages Learning Solutions',
    '94-3829104',
    '1982736450',
    '251S00000X',
    'Private Corporation - California Registered C-Corp',
    'TRUE',
    'Dr. Director',
    'credentialing@ageslearningsolutions.com',
    '(866) 555-2437',
    '123 Corporate Parkway, Suite 400, San Jose, CA 95128',
    'TRUE'
  ],
  [
    '[EXAMPLE 2]',
    'ent-2',
    'Proficio Speech & Learning Group LLC',
    'Proficio Therapy',
    '82-4910293',
    '1847392018',
    '251S00000X',
    'Professional Limited Liability Company',
    'TRUE',
    'Operations Director',
    'admin@proficiotherapy.com',
    '(510) 555-8921',
    '456 Grand Avenue, Suite 200, Oakland, CA 94610',
    'TRUE'
  ],
  ['', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '']
];

const wsEntities = XLSX.utils.aoa_to_sheet(entitiesData);
wsEntities['!cols'] = [
  { wch: 15 }, { wch: 35 }, { wch: 25 }, { wch: 18 }, { wch: 16 }, { wch: 18 },
  { wch: 40 }, { wch: 12 }, { wch: 25 }, { wch: 38 }, { wch: 18 }, { wch: 45 }, { wch: 12 }
];
XLSX.utils.book_append_sheet(workbook, wsEntities, 'Entities_Organizations');

// -------------------------------------------------------------
// Sheet 3: Practice_Locations
// -------------------------------------------------------------
const locationsHeaders = [
  'Location_ID',
  'Location_Name',
  'Location_Type',
  'Legal_Entity_ID',
  'DBA_Name',
  'Address_Street',
  'City',
  'State',
  'Zip_Code',
  'Phone',
  'Service_Types',
  'Lease_Status',
  'PAVE_Location_Status',
  'Is_Active'
];

const locationsData = [
  locationsHeaders,
  [
    '[FIELD DEFINITION]',
    'Unique Location Identifier (e.g. loc-1)',
    'Clinical Center / Site Name',
    'Physical Clinic | In-Home / Mobile | School District | Telehealth Virtual | Satellite',
    'Foreign Key to Entities_Organizations Entity_ID',
    'Site-specific DBA if different from Entity',
    'Physical Clinic / Billing Street Address',
    'City',
    '2-Letter US State Code',
    '5-Digit Postal ZIP Code',
    'Location Reception / Clinic Phone',
    'Comma-separated: In-Clinic, In-Home, In-School, Telehealth',
    'Active | Sublease | Missing | Expired | Not Applicable',
    'Approved | Pending | Not Required',
    'Active Clinical Service Status (TRUE / FALSE)'
  ],
  [
    '[REQUIRED?]',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'OPTIONAL',
    'REQUIRED'
  ],
  [
    '[EXAMPLE 1]',
    'loc-1',
    'Livermore Clinic',
    'Physical Clinic',
    'ent-1',
    'Ages Learning Solutions - Livermore',
    '1576 2nd Street, Suite C',
    'Livermore',
    'CA',
    '94550',
    '(925) 555-0120',
    'In-Clinic, In-Home',
    'Active',
    'Approved',
    'TRUE'
  ],
  [
    '[EXAMPLE 2]',
    'loc-inhome-bayarea',
    'Northern California In-Home Network',
    'In-Home / Mobile',
    'ent-1',
    'Ages Learning Solutions Community',
    'Serving Alameda, Santa Clara & Contra Costa Counties',
    'San Jose',
    'CA',
    '95128',
    '(866) 555-2437',
    'In-Home, Telehealth',
    'Not Applicable',
    'Approved',
    'TRUE'
  ],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '']
];

const wsLocations = XLSX.utils.aoa_to_sheet(locationsData);
wsLocations['!cols'] = [
  { wch: 20 }, { wch: 35 }, { wch: 22 }, { wch: 18 }, { wch: 30 }, { wch: 35 },
  { wch: 18 }, { wch: 8 }, { wch: 10 }, { wch: 16 }, { wch: 25 }, { wch: 16 }, { wch: 22 }, { wch: 12 }
];
XLSX.utils.book_append_sheet(workbook, wsLocations, 'Practice_Locations');

// -------------------------------------------------------------
// Sheet 4: Payers_Insurance
// -------------------------------------------------------------
const payersHeaders = [
  'Payer_ID',
  'Payer_Name',
  'Payer_Type',
  'States_Served',
  'Submission_Method',
  'Average_TAT_Days',
  'Follow_Up_Cadence_Days',
  'Requires_CAQH',
  'Requires_PAVE',
  'Requires_Medicaid_ID',
  'Portal_URL',
  'Contact_Name',
  'Contact_Email',
  'Contact_Phone',
  'Notes',
  'Is_Active'
];

const payersData = [
  payersHeaders,
  [
    '[FIELD DEFINITION]',
    'Unique Payer Identifier (e.g. pyr-aetna)',
    'Full Health Plan / Insurance Company Name',
    'Commercial | Medicaid | Regional | Tricare / Military | Medicare Advantage | Government',
    'Comma-separated 2-letter state codes (e.g. CA, UT)',
    'Portal | Availity | Email | Mail | Fax',
    'Expected Turnaround Time in Days (integer)',
    'Standard Follow-up Interval in Days (integer)',
    'Requires active attested CAQH profile (TRUE / FALSE)',
    'Requires California PAVE enrollment (TRUE / FALSE)',
    'Requires state Medicaid Rendering ID (TRUE / FALSE)',
    'Provider Portal or Claims Submission URL',
    'Payer Provider Relations Representative Name',
    'Payer Credentialing Inquiries Email',
    'Payer Provider Enrollment Phone Number',
    'Special roster submission requirements or tips',
    'Active Payer Status (TRUE / FALSE)'
  ],
  [
    '[REQUIRED?]',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL',
    'REQUIRED'
  ],
  [
    '[EXAMPLE 1]',
    'pyr-aetna',
    'Aetna',
    'Commercial',
    'CA, UT',
    'Availity',
    60,
    7,
    'TRUE',
    'FALSE',
    'FALSE',
    'https://www.availity.com',
    'Provider Relations Team',
    'credentialing@aetna.com',
    '(800) 624-0756',
    'Requires CAQH release and group Type 2 NPI roster.',
    'TRUE'
  ],
  [
    '[EXAMPLE 2]',
    'pyr-medicaid',
    'Medi-Cal (California Medicaid)',
    'Medicaid',
    'CA',
    'Portal',
    90,
    14,
    'FALSE',
    'TRUE',
    'TRUE',
    'https://pave.dhcs.ca.gov',
    'DHCS Provider Enrollment Division',
    'pave@dhcs.ca.gov',
    '(916) 636-1200',
    'PAVE profile approval required before billing Medicaid rosters.',
    'TRUE'
  ],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
];

const wsPayers = XLSX.utils.aoa_to_sheet(payersData);
wsPayers['!cols'] = [
  { wch: 16 }, { wch: 32 }, { wch: 18 }, { wch: 15 }, { wch: 18 }, { wch: 16 },
  { wch: 22 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 25 },
  { wch: 30 }, { wch: 18 }, { wch: 45 }, { wch: 12 }
];
XLSX.utils.book_append_sheet(workbook, wsPayers, 'Payers_Insurance');

// -------------------------------------------------------------
// Sheet 5: Employees_Master
// -------------------------------------------------------------
const employeesHeaders = [
  'Employee_ID',
  'First_Name',
  'Last_Name',
  'Full_Name',
  'Email',
  'Phone',
  'Department',
  'Role_Title',
  'Employment_Status',
  'Start_Date',
  'Primary_Location_ID',
  'Legal_Entity_ID',
  'Notes'
];

const employeesData = [
  employeesHeaders,
  [
    '[FIELD DEFINITION]',
    'Unique Employee ID (e.g. EMP-2026-001)',
    'First Name',
    'Last Name',
    'Calculated or Full Name (e.g. Jane Doe)',
    'Corporate Work Email Address',
    'Contact Phone Number',
    'Department (Clinical | Operations | Billing | Administration)',
    'Official Job Title',
    'Full-Time | Part-Time | Contractor | Inactive',
    'Employment Start Date (YYYY-MM-DD)',
    'Foreign Key to Practice_Locations Location_ID',
    'Foreign Key to Entities_Organizations Entity_ID',
    'General HR or Onboarding Notes'
  ],
  [
    '[REQUIRED?]',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL'
  ],
  [
    '[EXAMPLE 1]',
    'EMP-2026-001',
    'Jane',
    'Doe',
    'Jane Doe',
    'jane.doe@ageslearning.com',
    '(408) 555-0199',
    'Clinical',
    'Board Certified Behavior Analyst (BCBA)',
    'Full-Time',
    '2026-01-15',
    'loc-1',
    'ent-1',
    'Standard clinical onboarding in progress.'
  ],
  ['', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '']
];

const wsEmployees = XLSX.utils.aoa_to_sheet(employeesData);
wsEmployees['!cols'] = [
  { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 32 }, { wch: 18 },
  { wch: 18 }, { wch: 35 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 40 }
];
XLSX.utils.book_append_sheet(workbook, wsEmployees, 'Employees_Master');

// -------------------------------------------------------------
// Sheet 6: ClinicalStaff_Providers
// -------------------------------------------------------------
const providersHeaders = [
  'Provider_ID',
  'Employee_ID',
  'First_Name',
  'Last_Name',
  'Professional_Credentials',
  'Disciplines',
  'Provider_Type',
  'Individual_NPI',
  'State_License_Number',
  'License_State',
  'License_Expiration_Date',
  'Taxonomy_Code',
  'Clinical_Specialty',
  'CAQH_Provider_ID',
  'CAQH_Status',
  'PAVE_Status',
  'Primary_Entity_ID',
  'Primary_Location_ID',
  'Employment_Status',
  'Start_Date',
  'Contact_Email',
  'Contact_Phone',
  'Is_Active'
];

const providersData = [
  providersHeaders,
  [
    '[FIELD DEFINITION]',
    'Unique Provider Identifier (e.g. prov-101 or CS-001)',
    'Foreign Key to Employees_Master Employee_ID (if linked)',
    'Legal First Name',
    'Legal Last Name',
    'Degrees and Professional Designations (e.g. MS, BCBA, LBA)',
    'Comma-separated: ABA, Speech, OT',
    'BCBA | BCaBA | RBT | SLP | SLPA | OTR/L | COTA',
    '10-Digit National Provider Identifier (Type 1 Individual)',
    'Professional State License / Registration Number',
    '2-Letter US State Code issuing license',
    'License Expiration Date (YYYY-MM-DD)',
    '10-Character Healthcare Taxonomy Code (e.g. 103K00000X)',
    'Clinical Specialty (e.g. Applied Behavior Analysis, Speech-Language Pathology)',
    '8-Digit CAQH Provider ProView ID',
    'Initial | Complete | Attested | Re-attestation Due | Discrepancy',
    'Not Started | In Progress | Submitted | Approved | Not Required',
    'Foreign Key to Entities_Organizations Entity_ID',
    'Foreign Key to Practice_Locations Location_ID',
    'Full-Time | Part-Time | Contractor',
    'Provider Employment Start Date (YYYY-MM-DD)',
    'Provider Direct Contact Email',
    'Provider Direct Contact Phone',
    'Active Provider Roster Status (TRUE / FALSE)'
  ],
  [
    '[REQUIRED?]',
    'REQUIRED',
    'OPTIONAL',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED'
  ],
  [
    '[EXAMPLE 1]',
    'prov-101',
    'EMP-2026-001',
    'Jane',
    'Doe',
    'MS, BCBA, LBA',
    'ABA',
    'BCBA',
    '1487652391',
    'LBA-CA-94821',
    'CA',
    '2028-10-31',
    '103K00000X',
    'Applied Behavior Analysis',
    '18492041',
    'Attested',
    'Approved',
    'ent-1',
    'loc-1',
    'Full-Time',
    '2026-01-15',
    'jane.doe@ageslearning.com',
    '(408) 555-0199',
    'TRUE'
  ],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
];

const wsProviders = XLSX.utils.aoa_to_sheet(providersData);
wsProviders['!cols'] = [
  { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 24 }, { wch: 14 },
  { wch: 14 }, { wch: 16 }, { wch: 22 }, { wch: 12 }, { wch: 22 }, { wch: 16 },
  { wch: 28 }, { wch: 18 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 20 },
  { wch: 16 }, { wch: 15 }, { wch: 30 }, { wch: 18 }, { wch: 12 }
];
XLSX.utils.book_append_sheet(workbook, wsProviders, 'ClinicalStaff_Providers');

// -------------------------------------------------------------
// Sheet 7: Credentialing_Applications
// -------------------------------------------------------------
const appsHeaders = [
  'Application_ID',
  'Provider_ID',
  'Payer_ID',
  'Legal_Entity_ID',
  'Practice_Location_ID',
  'Application_Type',
  'Discipline',
  'Workflow_Stage',
  'Assigned_Specialist_Name',
  'Intake_Date',
  'Submission_Date',
  'Target_Turnaround_Date',
  'Approval_Date',
  'Effective_Date',
  'Provider_Link_Date',
  'Linking_Status',
  'Contract_Status',
  'Notes'
];

const appsData = [
  appsHeaders,
  [
    '[FIELD DEFINITION]',
    'Unique Application ID (e.g. APP-2026-0001)',
    'Foreign Key to ClinicalStaff_Providers Provider_ID',
    'Foreign Key to Payers_Insurance Payer_ID',
    'Foreign Key to Entities_Organizations Entity_ID',
    'Foreign Key to Practice_Locations Location_ID',
    'Initial credentialing | New provider credentialing | Recredentialing | Location addition | Provider linking',
    'ABA | Speech | OT',
    'Intake | Documents Pending | Documents Complete | CAQH Pending | PAVE Pending | Application Preparation | Application Submitted | Payer Review | Additional Documents Requested | Approved | Linking Pending | Linked | Effective | Overdue',
    'Assigned Credentialing Specialist Name',
    'Application Initiation / Intake Date (YYYY-MM-DD)',
    'Official Submission to Payer Date (YYYY-MM-DD)',
    'Expected SLA Completion Target Date (YYYY-MM-DD)',
    'Formal Payer Approval / Credentialing Committee Date (YYYY-MM-DD)',
    'Contract / In-Network Effective Billing Date (YYYY-MM-DD)',
    'Date Provider Linked to Group Roster / Portal (YYYY-MM-DD)',
    'Not Applicable | Pending Approval | Linking In Progress | Linked',
    'Not Started | In Negotiation | Contract Executed',
    'Application status notes, tracking numbers, or follow-up details'
  ],
  [
    '[REQUIRED?]',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'REQUIRED',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL',
    'OPTIONAL'
  ],
  [
    '[EXAMPLE 1]',
    'APP-2026-0001',
    'prov-101',
    'pyr-aetna',
    'ent-1',
    'loc-1',
    'Initial credentialing',
    'ABA',
    'Application Submitted',
    'Joel Mathew Reji',
    '2026-02-01',
    '2026-02-14',
    '2026-04-15',
    '',
    '',
    '',
    'Pending Approval',
    'In Negotiation',
    'Application submitted via Availity. Tracking ref #AET-994821.'
  ],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
];

const wsApps = XLSX.utils.aoa_to_sheet(appsData);
wsApps['!cols'] = [
  { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 22 }, { wch: 25 },
  { wch: 14 }, { wch: 25 }, { wch: 25 }, { wch: 14 }, { wch: 16 }, { wch: 22 },
  { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 20 }, { wch: 18 }, { wch: 45 }
];
XLSX.utils.book_append_sheet(workbook, wsApps, 'Credentialing_Applications');

// -------------------------------------------------------------
// Sheet 8: System_Users_Accounts
// -------------------------------------------------------------
const usersHeaders = [
  'Account_ID',
  'Full_Name',
  'Email',
  'Access_Level',
  'System_Role',
  'Department',
  'Status'
];

const usersData = [
  usersHeaders,
  [
    '[FIELD DEFINITION]',
    'Unique Account Identifier (e.g. acc-001)',
    'User Full Legal Name',
    'User Corporate Login Email Address (Must be unique)',
    'ADMINISTRATOR | USER',
    'Credentialing Specialist | Credentialing Lead / Manager | Provider | HR/Operations | Clinical Team | Billing and Claims | Leadership / Management | System Administrator',
    'Department Assignment (e.g. Credentialing, Operations, Clinical, Billing)',
    'Active | Inactive | Pending Activation'
  ],
  [
    '[REQUIRED?]',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'REQUIRED',
    'OPTIONAL',
    'REQUIRED'
  ],
  [
    '[EXAMPLE 1]',
    'acc-001',
    'Joel Mathew Reji',
    'joel.reji@ageslearningsolutions.com',
    'USER',
    'Credentialing Specialist',
    'Credentialing Operations',
    'Active'
  ],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '']
];

const wsUsers = XLSX.utils.aoa_to_sheet(usersData);
wsUsers['!cols'] = [
  { wch: 16 }, { wch: 25 }, { wch: 38 }, { wch: 18 }, { wch: 32 }, { wch: 25 }, { wch: 16 }
];
XLSX.utils.book_append_sheet(workbook, wsUsers, 'System_Users_Accounts');

// Write out the Excel file to docs/DATA_IMPORT_TEMPLATE.xlsx
const targetPath = path.join(docsDir, 'DATA_IMPORT_TEMPLATE.xlsx');
XLSX.writeFile(workbook, targetPath);
console.log(`Successfully generated production template at: ${targetPath}`);
