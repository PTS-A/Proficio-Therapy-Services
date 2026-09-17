const ExcelJS = require('exceljs');
const path = require('path');

async function generateRoadmapExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Proficio Therapy Services DevSecOps';
  workbook.lastModifiedBy = 'Proficio Automation Engineering';
  workbook.created = new Date();
  workbook.modified = new Date();

  const brandNavy = '1E293B';
  const brandTeal = '0F766E';
  const brandBlue = '2563EB';
  const headerFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };

  // ---------------------------------------------------------------------------
  // SHEET 1: INACTIVE & UNFINISHED FEATURES
  // ---------------------------------------------------------------------------
  const sheet1 = workbook.addWorksheet('Coded Inactive Features', {
    views: [{ showGridLines: true, state: 'frozen', ySplit: 1 }]
  });

  sheet1.columns = [
    { header: 'Feature ID', key: 'id', width: 14 },
    { header: 'Feature Name', key: 'name', width: 28 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Current Code Status', key: 'status', width: 22 },
    { header: 'Source Code Files / Routes', key: 'codeLocation', width: 35 },
    { header: 'Current Operational State', key: 'currentBehavior', width: 38 },
    { header: 'Details & Credentials Required From You', key: 'detailsRequired', width: 45 },
    { header: 'Exact Steps To Activate', key: 'activationSteps', width: 45 },
    { header: 'Compliance & Security Impact', key: 'compliance', width: 30 }
  ];

  const features = [
    {
      id: 'BOT-01',
      name: 'Automated Email Reminder Bot',
      category: 'Email & Communications',
      status: 'Fully Coded (Simulated)',
      codeLocation: 'server/automationEngine.ts\nserver.ts (/api/automations/*)\nsrc/components/automations/*',
      currentBehavior: 'Evaluates upcoming 30d, 14d, 7d, 1d credential expirations and CAQH dates. Currently writes logs to memory/database but simulates email dispatch because no live email API key is attached.',
      detailsRequired: '1. Resend API Key (re_...) OR SMTP credentials (host, port, user, pass).\n2. Verified sending domain (e.g. notifications@proficiotherapy.com).\n3. Confirmed sender display name and reply-to email.',
      activationSteps: '1. Sign up at Resend.com or use your corporate SMTP.\n2. Add DNS DKIM/SPF TXT records to your domain.\n3. Add RESEND_API_KEY and RESEND_FROM_EMAIL to environment variables.\n4. Enable the automated cron timer in server/automationEngine.ts.',
      compliance: 'HIPAA §164.312(e)(1) - TLS 1.3 encrypted transmission; prevents credential lapses and claim denials.'
    },
    {
      id: 'BOT-02',
      name: 'RPA Data Entry & CAQH / PAVE Sync',
      category: 'Data Integration',
      status: 'Scaffolded / Manual Upload Only',
      codeLocation: 'src/components/admin/DataImportView.tsx\nserver.ts (/api/migration/*)\nsrc/utils/entityValidation.ts',
      currentBehavior: 'Accepts bulk Excel/CSV manual uploads. Automated direct pull from CAQH ProView, California PAVE, or NPPES registry is not wired to headless scraping or automated API.',
      detailsRequired: '1. CAQH Direct Connect API partnership credentials OR automated robot SFTP inbox.\n2. PAVE portal organizational account credentials (for automated status check bot).\n3. Approved data dictionary mapping spreadsheet.',
      activationSteps: '1. Provide CAQH/PAVE access credentials or SFTP directory.\n2. Connect scheduled cron script (node-cron / Cloud Scheduler) to ingest clinician delta feeds daily.\n3. Configure NPPES public NPI API endpoint (free, no key required) for automated NPI registry lookup.',
      compliance: 'HIPAA §164.502 - Automated sanitization & role-based attribute filtering before ingestion.'
    },
    {
      id: 'AUTH-01',
      name: 'Google Workspace SSO & OAuth',
      category: 'Identity & Authentication',
      status: 'Coded with Dev Test Sandbox',
      codeLocation: 'server/authGate.ts\nserver.ts (/api/auth/google/*)\nsrc/components/auth/LoginPage.tsx',
      currentBehavior: 'Login page shows Google SSO button with simulation popup fallback. Handles local tokens and test user switching, but fails production OAuth exchange without Google Cloud credentials.',
      detailsRequired: '1. Google Cloud Console Project access.\n2. OAuth 2.0 Web Client ID & Client Secret.\n3. Authorized JavaScript Origins and Redirect URIs list for your production domain.\n4. Permitted Google Workspace domains (e.g. @ageslearningsolutions.com, @proficiotherapy.com).',
      activationSteps: '1. Create OAuth 2.0 Client in Google Cloud Console.\n2. Add Authorized Redirect URI: https://[YOUR_DOMAIN]/auth/callback.\n3. Supply GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.\n4. Set restrictToDomains to enforce corporate Google Workspace emails only.',
      compliance: 'HIPAA §164.312(a)(2)(i) - Centralized corporate identity, MFA enforcement, and instant deprovisioning.'
    },
    {
      id: 'SANCT-01',
      name: 'OIG LEIE & SAM.gov Exclusion Screener',
      category: 'Sanctions & Compliance',
      status: 'Coded with Local Data Match',
      codeLocation: 'server.ts (/api/compliance/exclusion-screen)\nsrc/components/providers/ProviderMaster.tsx',
      currentBehavior: 'Endpoint /api/compliance/exclusion-screen checks clinician names against an internal sample exclusion list and returns mock clearance verification.',
      detailsRequired: '1. SAM.gov public API Key (from beta.sam.gov / api.data.gov).\n2. Automated monthly OIG LEIE downloadable database file URL or daily delta feed.\n3. Compliance Officer email for adverse findings notification.',
      activationSteps: '1. Register for free SAM.gov data.gov API key.\n2. Configure backend cron to download official OIG monthly LEIE CSV into Supabase.\n3. Wire /api/compliance/exclusion-screen to query live database table and SAM.gov API.',
      compliance: 'Affordable Care Act §6501 & Social Security Act §1128 - Mandatory monthly exclusion checks for Medicaid/Medicare billing.'
    },
    {
      id: 'DB-01',
      name: 'Supabase Production Hardening & BAA',
      category: 'Database & Infrastructure',
      status: 'Connected / Development Anon Key',
      codeLocation: 'src/lib/supabase.ts\nsupabase/migrations/20260910000000_initial_schema.sql',
      currentBehavior: 'App is actively communicating with Supabase PostgreSQL (19 collections working, 0 errors). Runs with anon key fallback and permissive RLS.',
      detailsRequired: '1. Supabase Organization Admin login.\n2. Execution of Supabase HIPAA Business Associate Agreement (BAA) on Team/Enterprise tier.\n3. Production Service Role Secret Key.\n4. Custom database domain name (e.g. db.proficiotherapy.com).',
      activationSteps: '1. Sign BAA in Supabase dashboard under Security & Compliance.\n2. Enable strict RLS enforcement script (supabase/migrations/20260910000000_initial_schema.sql).\n3. Set SUPABASE_SECRET_KEY in server environment.\n4. Enable daily automated PITR (Point-in-Time Recovery) database backups.',
      compliance: 'HIPAA §164.504(e) - Executed BAA is a federal requirement for live ePHI storage.'
    }
  ];

  features.forEach((f) => {
    const row = sheet1.addRow(f);
    row.alignment = { vertical: 'top', wrapText: true };
    row.font = { name: 'Calibri', size: 10 };
  });

  sheet1.getRow(1).height = 28;
  sheet1.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + brandNavy } };
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // ---------------------------------------------------------------------------
  // SHEET 2: DOMAIN & PRODUCTION DEPLOYMENT STEPS
  // ---------------------------------------------------------------------------
  const sheet2 = workbook.addWorksheet('Domain & Production Migration', {
    views: [{ showGridLines: true, state: 'frozen', ySplit: 1 }]
  });

  sheet2.columns = [
    { header: 'Step #', key: 'step', width: 10 },
    { header: 'Deployment Phase', key: 'phase', width: 22 },
    { header: 'Action Item', key: 'action', width: 32 },
    { header: 'DNS Record Type', key: 'dnsType', width: 16 },
    { header: 'Host / Subdomain', key: 'host', width: 26 },
    { header: 'Target Value / Destination', key: 'target', width: 38 },
    { header: 'Detailed Instructions & Notes', key: 'notes', width: 50 },
    { header: 'Verification Command / URL', key: 'verify', width: 32 }
  ];

  const domainSteps = [
    {
      step: '1.0',
      phase: 'Domain Decision',
      action: 'Select Production Subdomain',
      dnsType: 'N/A',
      host: 'e.g. credentialing.proficiotherapy.com',
      target: 'Company DNS Registrar',
      notes: 'Choose a dedicated subdomain under your official domain (e.g. GoDaddy, Cloudflare, Route53, Namecheap). Recommended: credentialing.proficiotherapy.com or portal.proficiotherapy.com.',
      verify: 'whois proficiotherapy.com'
    },
    {
      step: '2.0',
      phase: 'Hosting Platform',
      action: 'Deploy Cloud Run Container',
      dnsType: 'N/A',
      host: 'Cloud Run Service',
      target: 'Google Cloud Platform (GCP)',
      notes: 'The application is already packaged with a unified Express + Vite production build (dist/server.cjs). Click Deploy to Cloud Run in AI Studio Settings OR deploy via GCP gcloud CLI with min instances=1, memory=1Gi, CPU=1.',
      verify: 'gcloud run services list'
    },
    {
      step: '3.0',
      phase: 'Domain Mapping',
      action: 'Map Custom Domain in GCP',
      dnsType: 'N/A',
      host: 'Custom Domains Tab',
      target: 'Cloud Run Domain Mappings',
      notes: 'In GCP Console -> Cloud Run -> Manage Custom Domains -> Add Mapping. Select your service and enter your domain (e.g. credentialing.proficiotherapy.com). GCP will provide the exact DNS records.',
      verify: 'GCP Cloud Run Console'
    },
    {
      step: '4.1',
      phase: 'DNS Configuration',
      action: 'Add Primary Routing Record',
      dnsType: 'CNAME',
      host: 'credentialing',
      target: 'ghs.googlehosted.com.',
      notes: 'If using a subdomain, add a CNAME pointing to Google Hosted services. If using an apex/root domain (@), add the 4 Google A records (216.239.32.21, 216.239.34.21, 216.239.36.21, 216.239.38.21).',
      verify: 'dig CNAME credentialing.proficiotherapy.com'
    },
    {
      step: '4.2',
      phase: 'DNS Configuration',
      action: 'Add Google Domain Verification',
      dnsType: 'TXT',
      host: '@ (root domain)',
      target: 'google-site-verification=...',
      notes: 'GCP generates a unique TXT token to prove domain ownership. Add this TXT record to your DNS zone.',
      verify: 'dig TXT proficiotherapy.com'
    },
    {
      step: '5.0',
      phase: 'SSL / TLS Certificate',
      action: 'Automatic Managed TLS Provisioning',
      dnsType: 'N/A',
      host: 'credentialing.proficiotherapy.com',
      target: 'Google Managed Certificate Authority',
      notes: 'GCP automatically issues and auto-renews a 2048-bit RSA / ECDSA SSL certificate via Let’s Encrypt / Google Trust Services within 15-60 minutes after DNS propagation.',
      verify: 'https://credentialing.proficiotherapy.com'
    },
    {
      step: '6.0',
      phase: 'Email Bot DNS',
      action: 'Configure Resend Email DNS',
      dnsType: 'TXT & MX',
      host: 'bounces / resend._domainkey',
      target: 'feedback-smtp.resend.com & DKIM key',
      notes: 'To ensure automated reminder emails do not hit spam or get rejected by clinic email servers, configure SPF, DKIM, and DMARC in Resend dashboard.',
      verify: 'resend.com/domains'
    },
    {
      step: '7.0',
      phase: 'Google SSO Domain',
      action: 'Update Authorized OAuth URIs',
      dnsType: 'N/A',
      host: 'Google Cloud Console',
      target: 'OAuth 2.0 Client Credentials',
      notes: 'Add your new production domain to Authorized JavaScript Origins: https://credentialing.proficiotherapy.com and Authorized Redirect URIs: https://credentialing.proficiotherapy.com/auth/callback.',
      verify: 'Test Google SSO on live domain'
    },
    {
      step: '8.0',
      phase: 'Final Cutover',
      action: 'Set Production Environment Variables',
      dnsType: 'N/A',
      host: 'Cloud Run Environment',
      target: 'Production Secrets',
      notes: 'Configure NODE_ENV=production, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SECRET_KEY, RESEND_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET in Cloud Run service configuration.',
      verify: 'curl -I https://credentialing.proficiotherapy.com/api/health'
    }
  ];

  domainSteps.forEach((s) => {
    const row = sheet2.addRow(s);
    row.alignment = { vertical: 'top', wrapText: true };
    row.font = { name: 'Calibri', size: 10 };
  });

  sheet2.getRow(1).height = 28;
  sheet2.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + brandTeal } };
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // ---------------------------------------------------------------------------
  // SHEET 3: REQUIRED CREDENTIALS & KEYS MATRIX
  // ---------------------------------------------------------------------------
  const sheet3 = workbook.addWorksheet('Required Keys & Secrets Matrix', {
    views: [{ showGridLines: true, state: 'frozen', ySplit: 1 }]
  });

  sheet3.columns = [
    { header: 'Key / Variable Name', key: 'varName', width: 28 },
    { header: 'Associated Feature', key: 'feature', width: 26 },
    { header: 'Source / Provider', key: 'provider', width: 22 },
    { header: 'Where / How To Obtain', key: 'howToObtain', width: 45 },
    { header: 'Cost Tier / Pricing', key: 'pricing', width: 20 },
    { header: 'Exposure Level', key: 'securityLevel', width: 18 },
    { header: 'Current Default / Fallback', key: 'fallback', width: 25 },
    { header: 'Consequence If Left Blank', key: 'impact', width: 35 }
  ];

  const keysMatrix = [
    {
      varName: 'RESEND_API_KEY',
      feature: 'Email Reminder Bot',
      provider: 'Resend.com',
      howToObtain: 'Create free account at https://resend.com -> API Keys -> Create Key (Full Access).',
      pricing: 'Free: 3,000 emails/mo. Pro: $20/mo.',
      securityLevel: 'Server Secret Only',
      fallback: 'In-memory simulator (logs to console/DB)',
      impact: 'Automated 30d/14d/7d/1d reminder emails will not physically reach clinicians.'
    },
    {
      varName: 'RESEND_FROM_EMAIL',
      feature: 'Email Reminder Bot',
      provider: 'Corporate Domain',
      howToObtain: 'Verify domain in Resend -> set e.g. "Proficio Credentialing <alerts@proficiotherapy.com>".',
      pricing: 'Included with domain',
      securityLevel: 'Server Public Config',
      fallback: 'onboarding@resend.dev',
      impact: 'Emails sent with default sender can only be delivered to the account owner email.'
    },
    {
      varName: 'GOOGLE_CLIENT_ID',
      feature: 'Google Workspace SSO',
      provider: 'Google Cloud Platform',
      howToObtain: 'GCP Console -> APIs & Services -> Credentials -> Create Credentials -> OAuth Client ID (Web).',
      pricing: 'Free',
      securityLevel: 'Client & Server Public',
      fallback: 'Mock / Simulated Sandbox Token',
      impact: 'Clinicians cannot click "Sign in with Google" using real corporate G-Suite accounts.'
    },
    {
      varName: 'GOOGLE_CLIENT_SECRET',
      feature: 'Google Workspace SSO',
      provider: 'Google Cloud Platform',
      howToObtain: 'Generated alongside GOOGLE_CLIENT_ID in Google Cloud Console.',
      pricing: 'Free',
      securityLevel: 'Server Secret Only',
      fallback: 'Mock Sandbox exchange',
      impact: 'Backend token verification will fail; users restricted to email/password authentication.'
    },
    {
      varName: 'SUPABASE_URL',
      feature: 'Database & Realtime Sync',
      provider: 'Supabase Cloud',
      howToObtain: 'Already configured: https://uqaiotacheqjvfbanxtp.supabase.co. For custom domain, set in Supabase Dashboard.',
      pricing: 'Active Instance',
      securityLevel: 'Client & Server Public',
      fallback: 'Default project URL in code',
      impact: 'App works, but relies on default URL fallback rather than explicit container environment.'
    },
    {
      varName: 'SUPABASE_ANON_KEY',
      feature: 'Database Client Access',
      provider: 'Supabase Cloud',
      howToObtain: 'Supabase Dashboard -> Project Settings -> API -> Project API Keys (anon / public).',
      pricing: 'Included',
      securityLevel: 'Client & Server Public',
      fallback: 'Default key in code',
      impact: 'Relies on bundled client fallback key.'
    },
    {
      varName: 'SUPABASE_SECRET_KEY',
      feature: 'Server Admin & BAA Operations',
      provider: 'Supabase Cloud',
      howToObtain: 'Supabase Dashboard -> Project Settings -> API -> Project API Keys (service_role / secret).',
      pricing: 'Included',
      securityLevel: 'Server Secret Only (CRITICAL)',
      fallback: 'None (service operations gated)',
      impact: 'Automated backend cron jobs cannot bypass RLS to clean up or run compliance reports.'
    },
    {
      varName: 'SAM_GOV_API_KEY',
      feature: 'Exclusion & Sanctions Bot',
      provider: 'SAM.gov / api.data.gov',
      howToObtain: 'Register at https://api.data.gov/signup for free federal API key.',
      pricing: 'Free (US Government)',
      securityLevel: 'Server Secret Only',
      fallback: 'Internal offline mock database',
      impact: 'Live federal sanctions screening requires manual login to OIG/SAM websites.'
    }
  ];

  keysMatrix.forEach((k) => {
    const row = sheet3.addRow(k);
    row.alignment = { vertical: 'top', wrapText: true };
    row.font = { name: 'Calibri', size: 10 };
  });

  sheet3.getRow(1).height = 28;
  sheet3.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + brandBlue } };
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // ---------------------------------------------------------------------------
  // SHEET 4: DATA ENTRY & CLINICIAN ONBOARDING INSTRUCTIONS
  // ---------------------------------------------------------------------------
  const sheet4 = workbook.addWorksheet('Data Ingestion & Onboarding', {
    views: [{ showGridLines: true, state: 'frozen', ySplit: 1 }]
  });

  sheet4.columns = [
    { header: 'Sequence', key: 'seq', width: 12 },
    { header: 'Data Domain', key: 'domain', width: 20 },
    { header: 'Source File / Format', key: 'source', width: 25 },
    { header: 'Required Mandatory Fields', key: 'mandatoryFields', width: 45 },
    { header: 'Automated Validation Rules', key: 'validation', width: 40 },
    { header: 'Instructions for Credentialing Team', key: 'instructions', width: 48 }
  ];

  const dataSteps = [
    {
      seq: 'Phase 1.1',
      domain: 'Legal Entities',
      source: 'Internal Corporate Records',
      mandatoryFields: 'Legal Name, Tax ID / EIN (XX-XXXXXXX), Type-2 NPI (10 digits), Taxonomy Code, W-9 on file status',
      validation: 'EIN must follow standard 9-digit format; NPI validated with Luhn algorithm check.',
      instructions: 'Enter all corporate child entities and DBAs under "Entities & Locations". Ensure Type-2 group NPIs are accurate before linking payers.'
    },
    {
      seq: 'Phase 1.2',
      domain: 'Practice Locations',
      source: 'Clinic Leases / Office Roster',
      mandatoryFields: 'Entity Link, Location Name, Physical Address, City, State, 5-Digit Zip, Phone, Service Types (ABA/Speech/OT)',
      validation: 'Zip code checked against US Postal standard; must link to existing parent legal entity.',
      instructions: 'Add both clinic centers and approved telehealth billing addresses. Payer contracts map specifically to these location IDs.'
    },
    {
      seq: 'Phase 1.3',
      domain: 'Payer Directory',
      source: 'Payer Contracts / Fee Schedules',
      mandatoryFields: 'Payer Name, Payer Type (Commercial/Medicaid), Average SLA Days, Submission Method (Portal/Availity/Email), CAQH/PAVE Required flags',
      validation: 'SLA turnaround days must be positive integer (typically 60-120 days).',
      instructions: 'Proficio already has 20 California & Regional payers seeded in Supabase (Kaiser, Medi-Cal, Blue Shield, Optum, etc.). Review contacts and portal URLs.'
    },
    {
      seq: 'Phase 2.1',
      domain: 'Employee Master',
      source: 'HRIS Export (ADP / Gusto / BambooHR)',
      mandatoryFields: 'First Name, Last Name, Email, Department, Role Title, Employment Status (Full-Time/Part-Time/Contractor), Start Date',
      validation: 'Work email must be unique; start date in YYYY-MM-DD format.',
      instructions: 'Can be imported via Excel template or entered manually in System Admin -> Data Import. Demo employees can be purged anytime.'
    },
    {
      seq: 'Phase 2.2',
      domain: 'Clinician / Provider Profiles',
      source: 'Clinician Dossier / CV',
      mandatoryFields: 'Type-1 Individual NPI (10 digits), Disciplines (ABA/Speech/OT), Provider Type (BCBA/SLP/OTR/L), License Number, State, License Expiration',
      validation: 'NPI-10 digit checksum; license expiration must be future date; CAQH ID 8-digit numeric.',
      instructions: 'Enter clinicians in "Providers Master". Ensure CAQH ID and re-attestation dates are recorded so the reminder bot can track the 120-day cycle.'
    },
    {
      seq: 'Phase 3.1',
      domain: 'Credentialing Applications',
      source: 'Active Payer Tracking Sheets',
      mandatoryFields: 'Provider ID, Payer ID, Legal Entity ID, Location ID, Application Stage, Submission Date, Assigned Specialist',
      validation: 'Foreign keys must match valid records; Stage must be one of 18 configured workflow stages.',
      instructions: 'Map every clinician to every payer they are actively being enrolled with. Enter initial submission date so SLA countdown clocks activate.'
    }
  ];

  dataSteps.forEach((d) => {
    const row = sheet4.addRow(d);
    row.alignment = { vertical: 'top', wrapText: true };
    row.font = { name: 'Calibri', size: 10 };
  });

  sheet4.getRow(1).height = 28;
  sheet4.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + brandNavy } };
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const outputPath = path.join(process.cwd(), 'docs', 'INACTIVE_FEATURES_AND_PRODUCTION_ACTIVATION_ROADMAP.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Successfully generated production roadmap workbook at: ${outputPath}`);
}

generateRoadmapExcel().catch((err) => {
  console.error('Error generating Excel roadmap:', err);
  process.exit(1);
});
