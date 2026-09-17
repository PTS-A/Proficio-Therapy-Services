const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Paths
const docsDir = path.join(__dirname, '..', 'docs');
const rootDir = path.join(__dirname, '..');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const pdfPathDocs = path.join(docsDir, 'CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.pdf');
const pdfPathRoot = path.join(rootDir, 'CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.pdf');
const htmlPathDocs = path.join(docsDir, 'CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.html');
const htmlPathRoot = path.join(rootDir, 'CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.html');
const mdPathDocs = path.join(docsDir, 'SYSTEM_DOCUMENTATION.md');
const mdPathRoot = path.join(rootDir, 'CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.md');

console.log('Generating Master Credentialing Documentation Artifacts...');

// --- SECTION DATA DEFINITIONS ---
const documentTitle = 'Healthcare Credentialing & Provider Linking Management System';
const documentSubtitle = 'Comprehensive Master Specification, Workflows, Database Schemas, UI Architecture, and Automation Requirements';
const docVersion = '2026.3.0';
const docAuthor = 'Healthcare Engineering & Credentialing Operations Team';
const projectLead = 'Joel Reji (joel.reji@ageslearningsolutions.com)';
const targetEntities = [
  { name: 'Ages Learning Solutions', code: 'ALS', discipline: 'Applied Behavior Analysis (ABA)', tax: '103K00000X / 106E00000X', board: 'Behavior Analyst Certification Board (BACB)' },
  { name: 'Proficio Speech Therapy', code: 'PST', discipline: 'Speech-Language Pathology (SLP)', tax: '235Z00000X', board: 'California SLPAHADB & ASHA (CCC-SLP)' },
  { name: 'Child’s Play Therapy', code: 'CPT', discipline: 'Occupational Therapy (OT)', tax: '225X00000X', board: 'California Board of Occupational Therapy (CBOT) & NBCOT' }
];

// Generate PDF
function generatePDF() {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 45, right: 45 },
    bufferPages: true,
    info: {
      Title: documentTitle,
      Author: docAuthor,
      Subject: 'Master System Specification & Technical Blueprint',
      Keywords: 'Credentialing, CAQH, Provider Linking, Payers, ABA, Speech, OT, HIPAA, Database Schema',
    }
  });

  const writeStream = fs.createWriteStream(pdfPathDocs);
  doc.pipe(writeStream);

  const PRIMARY = '#1E3A8A';   // Deep Navy Blue
  const SECONDARY = '#2563EB'; // Vibrant Blue
  const DARK = '#0F172A';      // Slate 900
  const MUTED = '#475569';     // Slate 600
  const LIGHT_BG = '#F1F5F9';  // Slate 100
  const SUCCESS = '#059669';   // Emerald 600
  const WARNING = '#D97706';   // Amber 600

  // Cover Page
  doc.rect(45, 45, 505, 750).lineWidth(1.5).stroke(PRIMARY);
  doc.rect(47, 47, 501, 746).lineWidth(0.5).stroke('#CBD5E1');

  // Decorative header band
  doc.rect(48, 48, 499, 130).fill(PRIMARY);
  doc.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold')
     .text('ENTERPRISE HEALTHCARE CREDENTIALING & LINKING SYSTEM', 65, 75, { width: 465, align: 'center' });
  doc.fillColor('#93C5FD').fontSize(11).font('Helvetica')
     .text('Master Technical, Functional, and Automation Specification', 65, 125, { width: 465, align: 'center' });
  doc.fillColor('#E2E8F0').fontSize(8).font('Helvetica-Bold')
     .text('CONFIDENTIAL • AGES LEARNING SOLUTIONS | PROFICIO SPEECH | CHILD’S PLAY THERAPY', 65, 150, { width: 465, align: 'center' });

  // Metadata Card
  doc.rect(65, 210, 465, 140).fill('#F8FAFC');
  doc.rect(65, 210, 465, 140).stroke('#E2E8F0');
  
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('DOCUMENT METADATA & CONTROL', 80, 225);
  doc.fillColor(DARK).fontSize(9).font('Helvetica');
  doc.text('Project Reference ID:', 80, 248, { continued: true }).font('Helvetica-Bold').text('  AGES-SPEC-2026-V3');
  doc.font('Helvetica').text('Specification Version:', 80, 266, { continued: true }).font('Helvetica-Bold').text('  ' + docVersion + ' (Master Production Release)');
  doc.font('Helvetica').text('Project Lead / Owner:', 80, 284, { continued: true }).font('Helvetica-Bold').text('  ' + projectLead);
  doc.font('Helvetica').text('Target Operating Entities:', 80, 302, { continued: true }).font('Helvetica-Bold').text('  Ages Learning Solutions • Proficio Speech • Child’s Play');
  doc.font('Helvetica').text('Document Classification:', 80, 320, { continued: true }).font('Helvetica-Bold').text('  Confidential Master Project Reference Document');

  // Executive Scope Box
  doc.rect(65, 375, 465, 220).fill('#FFFFFF');
  doc.rect(65, 375, 465, 220).stroke('#CBD5E1');
  doc.fillColor(SECONDARY).fontSize(11).font('Helvetica-Bold').text('EXECUTIVE SCOPE & PURPOSE', 80, 390);
  doc.fillColor(MUTED).fontSize(8.5).font('Helvetica').text(
    'This document establishes the authoritative, single-source specification for the clinical credentialing, payer enrollment, and facility group linking platform engineered for multi-entity pediatric therapy practices in California. It consolidates all requirements, business logic, multi-stage workflows, database schemas, UI component hierarchies, automation cadences, compliance reporting, and implementation milestones into one comprehensive reference.',
    80, 410, { width: 435, lineGap: 3 }
  );

  doc.text(
    'Key Capabilities Covered in this Specification:\n' +
    ' • 4-Step Clinician Intake, Verification, Payer Bundling, and Post-Add Provider Linking\n' +
    ' • Collaborative Audit Trail & Contextual Notes System with Real-Time Author Attribution\n' +
    ' • Supporting Document Verification Subtab with Cloud Storage Association & Status Tracking\n' +
    ' • Dual-Verification Facility Group Linking Matrix (Legal Entity TIN + Location NPI)\n' +
    ' • Real-Time Management Dashboard with 10 Executive KPIs and 30-120+ Day Aging Engine\n' +
    ' • Section 5.11 Specialized Oversight Views (By Discipline, Payer, Specialist, Location)\n' +
    ' • Section 5.11.6 Weekly (7 Core Metrics) and Section 5.11.7 Monthly (10 Sections) Reports\n' +
    ' • Power BI DirectQuery Star-Schema Dataset Generator\n' +
    ' • Hardened Firestore Security Rules with Injection-Proof Document ID Validation',
    80, 465, { width: 435, lineGap: 2.5 }
  );

  // Footer on cover
  doc.fillColor(MUTED).fontSize(8).font('Helvetica')
     .text('Generated for Project Archive & Engineering Review • Strictly Not For Public UI Distribution', 65, 755, { align: 'center', width: 465 });

  // -------------------------------------------------------------
  // PAGE 2: TABLE OF CONTENTS / MASTER INDEX
  // -------------------------------------------------------------
  doc.addPage();
  doc.rect(45, 40, 505, 36).fill(PRIMARY);
  doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold').text('MASTER TABLE OF CONTENTS / INDEX', 60, 52);

  const tocItems = [
    { num: '1.0', title: 'Executive Summary & Architectural Vision', desc: 'System scope, multi-entity mandate, core business objectives' },
    { num: '2.0', title: 'Multi-Entity Governance & Clinical Disciplines', desc: 'Ages (ABA), Proficio (Speech), Child’s Play (OT), taxonomies' },
    { num: '3.0', title: 'Functional Requirements Specification (FR-1 to FR-10)', desc: 'Intake, Provider engine, Payer tracking, Linking, Audit, Docs' },
    { num: '4.0', title: 'End-to-End Operational Lifecycle Workflows', desc: 'Detailed 4-step intake, post-approval release, re-credentialing' },
    { num: '5.0', title: 'Database Architecture, Schemas & Data Models', desc: 'Firestore collections, schemas, ERD relations, foreign keys' },
    { num: '6.0', title: 'User Interface Architecture & Component Design', desc: 'Global layout, 4-step modal, dual-view tracker, linking matrix' },
    { num: '7.0', title: 'Business Logic, Calculations & Automation Engine', desc: 'Aging algorithms, CAQH 120-day clock, PAVE tracking, alerts' },
    { num: '8.0', title: 'Reporting, Analytics & Power BI Integration', desc: 'Weekly 5.11.6, Monthly 5.11.7, Star-Schema DirectQuery model' },
    { num: '9.0', title: 'Security, Authentication & Access Control', desc: 'RBAC roles, Firestore security rules, HIPAA & PII compliance' },
    { num: '10.0', title: 'Non-Functional, Performance & SLA Requirements', desc: 'Latency, concurrency, RPO/RTO backup, browser compatibility' },
    { num: '11.0', title: 'Implementation Roadmap & Integration Blueprint', desc: 'Production status, Phase 2 cloud sync, Phase 3 B2B APIs' },
    { num: '12.0', title: 'Master Verification Traceability Matrix', desc: 'Requirement-to-code mapping, automated test coverage sign-off' }
  ];

  let tocY = 95;
  tocItems.forEach((item, index) => {
    const isEven = index % 2 === 0;
    doc.rect(45, tocY, 505, 44).fill(isEven ? '#F8FAFC' : '#FFFFFF');
    doc.rect(45, tocY, 505, 44).stroke('#E2E8F0');

    doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text(item.num, 60, tocY + 8);
    doc.fillColor(DARK).fontSize(10).font('Helvetica-Bold').text(item.title, 105, tocY + 8);
    doc.fillColor(MUTED).fontSize(8).font('Helvetica').text(item.desc, 105, tocY + 24);

    tocY += 48;
  });

  // -------------------------------------------------------------
  // SECTION 1.0 & 2.0
  // -------------------------------------------------------------
  doc.addPage();
  drawSectionBanner(doc, '1.0', 'EXECUTIVE SUMMARY & ARCHITECTURAL VISION');
  
  drawSubhead(doc, '1.1 Business Context & Problem Statement');
  drawBodyText(doc, 'Pediatric behavioral and rehabilitative therapy practices face intricate regulatory, clinical, and billing credentialing bottlenecks. A clinician cannot independently bill health plans until two mandatory criteria are fulfilled: (1) individual credentialing approval by the payer committee, and (2) legal facility group linking affiliating the provider’s Type 1 individual NPI to the organization’s Type 2 group NPI and physical clinic facility address.');
  drawBodyText(doc, 'Historically, credentialing operations across Ages Learning Solutions, Proficio Speech Therapy, and Child’s Play Therapy suffered from fragmented spreadsheets, disconnected communication threads, untracked CAQH attestation expiration, and delayed facility roster additions. This system consolidates all credentialing workflows into an automated, transparent platform.');

  drawSubhead(doc, '1.2 Core System Objectives & Strategic Goals');
  drawBulletPoint(doc, 'Accelerate Turnaround Time (TAT)', 'Reduce onboarding-to-billing lead times from 120+ days to under 45 days through structured validation gates and proactive follow-up alerts.');
  drawBulletPoint(doc, 'Eliminate Billing Claim Rejections', 'Enforce dual verification (Payer Credentialing + Facility Linking) before billing release, preventing unlinked claim denials.');
  drawBulletPoint(doc, 'Unified Multi-Entity Transparency', 'Provide real-time executive visibility across three distinct disciplines (ABA, Speech, OT) under a single consolidated reporting framework.');
  drawBulletPoint(doc, 'Collaborative Accountability', 'Ensure seamless audit trails with immutable timestamps and user attribution for every status change, follow-up, and note.');

  drawSectionBanner(doc, '2.0', 'MULTI-ENTITY GOVERNANCE & CLINICAL DISCIPLINES');
  drawSubhead(doc, '2.1 Entity & Discipline Matrix');

  drawTable(doc, [
    ['Entity Name', 'Discipline', 'Licensing Board / Body', 'Taxonomy Code', 'Primary Payers'],
    ['Ages Learning Solutions', 'ABA', 'BACB (BCBA, BCaBA)', '103K00000X / 106E00000X', 'Kaiser, Blue Shield, Optum, Aetna, Regional Ctrs'],
    ['Proficio Speech Therapy', 'Speech (SLP)', 'CA SLPAHADB & ASHA', '235Z00000X', 'Commercial Plans, Medi-Cal HMOs, School IEPs'],
    ['Child’s Play Therapy', 'OT', 'CBOT & NBCOT', '225X00000X', 'Commercial PPO/HMO, Medi-Cal PAVE, Regional Ctrs']
  ], [110, 70, 110, 95, 120]);

  // -------------------------------------------------------------
  // SECTION 3.0: FUNCTIONAL REQUIREMENTS (FR-1 to FR-10)
  // -------------------------------------------------------------
  doc.addPage();
  drawSectionBanner(doc, '3.0', 'FUNCTIONAL REQUIREMENTS SPECIFICATION');

  const frs = [
    { id: 'FR-1', title: 'Multi-Step Clinician Intake & Credentialing Workflow', desc: 'System must guide users through a guided 4-step wizard: Step 1 (Clinician Demographics & Discipline), Step 2 (NPI, State License, CAQH ID & Supporting Document Links), Step 3 (Payer Enrollment Bundling & Collaborative Comments), and Step 4 (Post-Add Summary & Facility Group Linking).' },
    { id: 'FR-2', title: 'Provider Roster & Profile Management', desc: 'Centralized repository of all clinical practitioners with automated NPI format verification, primary discipline tags, employment status tracking, and direct linkages to historical applications.' },
    { id: 'FR-3', title: 'Multi-Payer Enrollment Tracking Pipeline', desc: 'Track individual applications across standard lifecycle stages: Intake & Preparation, Submitted, Payer Review, Approved, and Linked/Effective. Support custom follow-up cadences and reference numbers.' },
    { id: 'FR-4', title: 'Dual-Verification Facility & Group Linking Matrix', desc: 'Grid interface mapping clinicians to physical facility locations and billing TINs. Prevent status marking as "Billing Released" until both Payer Approval and Group Linking are confirmed.' },
    { id: 'FR-5', title: 'Collaborative Audit Trail & Real-Time Notes', desc: 'Chronological timeline recording application milestones and user notes with author ID, author name, system role, and precise ISO timestamps. Notes must be non-prominent and accessible during workflow.' },
    { id: 'FR-6', title: 'Supporting Document Links & Repository Subtab', desc: 'Interactive subtab supporting document links (e.g. State License, Board Certification, Malpractice COI, CV, PAVE proof) with category tags, external cloud URLs, and expiration date tracking.' },
    { id: 'FR-7', title: 'Management Dashboard & Aging Analysis Engine', desc: 'Display 10 core operational KPIs (Total Providers, Total Apps, Submitted, Pending, Approved, Action Required, Overdue, Rejected, Avg Cycle Days, Linking Rate) and 30/60/90/120+ day aging analysis.' },
    { id: 'FR-8', title: 'Section 5.11 Specialized Executive Oversight Views', desc: 'Provide dedicated multi-tab views: 5.11.2 (By Discipline comparison), 5.11.3 (By Payer turnaround matrix), 5.11.4 (By Specialist workload distribution), and 5.11.5 (By Location clinic readiness roster).' },
    { id: 'FR-9', title: 'Section 5.11.6 Weekly & 5.11.7 Monthly Reporting Suites', desc: '5.11.6 Weekly Report with 7 core metrics and escalation logs. 5.11.7 Monthly Report with 10 structured operational sections. Both must support print styling and CSV data export.' },
    { id: 'FR-10', title: 'Power BI DirectQuery Star-Schema Model', desc: 'Generate normalized Fact and Dimension tables (FactApplications, DimProviders, DimPayers, DimLocations, DimDates) with one-click JSON payload generation and REST endpoint compatibility.' }
  ];

  frs.forEach((fr) => {
    drawSubhead(doc, `[${fr.id}] ${fr.title}`);
    drawBodyText(doc, fr.desc);
    doc.moveDown(0.2);
  });

  // -------------------------------------------------------------
  // SECTION 4.0: OPERATIONAL LIFECYCLE WORKFLOWS
  // -------------------------------------------------------------
  doc.addPage();
  drawSectionBanner(doc, '4.0', 'END-TO-END OPERATIONAL LIFECYCLE WORKFLOWS');

  drawSubhead(doc, '4.1 Step 1: Initial Clinician Onboarding Intake');
  drawBodyText(doc, 'Captures Field 1 (Full Name & Professional Credentials), Field 2 (Primary Phone & Work Email), Field 4 (Office Location / Service Hub), and Field 5 (Clinical Discipline: ABA, Speech, or OT). Includes pre-fill sample presets (BCBA, SLP, OT) for expedited test data entry.');

  drawSubhead(doc, '4.2 Step 2: Provider Verification & Start Credentialing');
  drawBodyText(doc, 'Presents a summary banner of Step 1 details. Features a prominent "Start Credentialing" primary action. Collects Field 3 (Individual 10-digit NPI & State Professional License with Expiration) and Field 6 (CAQH ProView ID & Healthcare Taxonomy). Embeds the Supporting Document Links subtab allowing users to attach cloud document URLs.');

  drawSubhead(doc, '4.3 Step 3: Credentialing Application Phase (Payers & Comments)');
  drawBodyText(doc, 'Presents an interactive checkbox grid of contracted insurance health plans (Kaiser, Blue Shield, Optum/UHC, Aetna, Cigna, Anthem, Magellan). Incorporates a non-prominent secondary "Add Comment" button that expands an inline note input field, storing audit comments with author name, role, and timestamp.');

  drawSubhead(doc, '4.4 Step 4: Post-Add Confirmation & Billing Group Linking');
  drawBodyText(doc, 'Executes an atomic multi-collection persistence routine creating synchronized records across employees, clinical_staff, providers, applications, documents, and audit logs. Renders a comprehensive review card followed by a prominent Provider Linking section with a plus sign (+) button to assign group billing affiliations and clinic location NPIs.');

  drawSubhead(doc, '4.5 Post-Approval Release & Re-Credentialing Cycles');
  drawBodyText(doc, 'Upon payer committee approval, the specialist logs the official Payer Effective Date. When both Payer Approval and Group Linking are established, the clinician transitions to "Linked / Billing Released". The system automatically initiates a 120-day CAQH attestation countdown and a 90-day license expiration reminder.');

  // -------------------------------------------------------------
  // SECTION 5.0: DATABASE ARCHITECTURE & SCHEMAS
  // -------------------------------------------------------------
  doc.addPage();
  drawSectionBanner(doc, '5.0', 'DATABASE ARCHITECTURE, SCHEMAS & DATA MODELS');

  drawSubhead(doc, '5.1 Entity Relationship Overview');
  drawBodyText(doc, 'The system utilizes a relational-in-NoSQL Firestore structure ensuring referential integrity through explicit foreign key identifiers across six core collections:');

  drawBulletPoint(doc, 'employees', 'Primary HR personnel entity (id, employeeNumber, firstName, lastName, email, phone, department, hireDate, status).');
  drawBulletPoint(doc, 'clinical_staff', 'Clinical staff entity linked via employeeId (id, employeeId, discipline, credentials, npi, stateLicenseNumber, caqhId, locationId).');
  drawBulletPoint(doc, 'providers', 'Provider roster entity linked via clinicalStaffId & employeeId (id, name, npi, caqhId, discipline, taxonomy, activeApplicationsCount).');
  drawBulletPoint(doc, 'applications', 'Credentialing application instance (id, providerId, payerId, stage, submissionDate, approvalDate, effectiveDate, agingDays, isOverdue).');
  drawBulletPoint(doc, 'documents', 'Verification document metadata (id, applicationId, providerId, title, category, fileUrl, expiryDate, status).');
  drawBulletPoint(doc, 'comments', 'Collaborative audit log entry (id, applicationId, providerId, text, authorId, authorName, authorRole, timestamp).');

  drawSubhead(doc, '5.2 Master Data Dictionary & Schema Definition');
  drawTable(doc, [
    ['Field Name', 'Type', 'Collection', 'Constraints / Validation', 'Description'],
    ['id', 'string', 'All', 'Regex: ^[a-zA-Z0-9_-]{1,64}$', 'Immutable unique primary identifier'],
    ['employeeId', 'string', 'clinical_staff', 'Required, references employees.id', 'Foreign key linking clinical profile to HR'],
    ['clinicalStaffId', 'string', 'providers', 'Required, references clinical_staff.id', 'Foreign key linking provider to clinical staff'],
    ['npi', 'string', 'clinical_staff', '10-digit numeric format', 'National Provider Identifier (Type 1)'],
    ['discipline', 'string', 'All', 'Enum: ABA | Speech | OT', 'Clinical healthcare discipline'],
    ['stage', 'string', 'applications', 'Enum: 7 standard lifecycle stages', 'Current progress in credentialing pipeline'],
    ['effectiveDate', 'string', 'applications', 'YYYY-MM-DD or null', 'Date health plan authorizes claims billing'],
    ['fileUrl', 'string', 'documents', 'Valid URL (HTTPS recommended)', 'Cloud storage link to supporting credential']
  ], [70, 50, 75, 140, 170]);

  // -------------------------------------------------------------
  // SECTION 6.0: UI ARCHITECTURE
  // -------------------------------------------------------------
  doc.addPage();
  drawSectionBanner(doc, '6.0', 'USER INTERFACE ARCHITECTURE & COMPONENT HIERARCHY');

  drawSubhead(doc, '6.1 Design Principles & Anti-Slop Discipline');
  drawBodyText(doc, 'The user interface is engineered adhering strictly to enterprise healthcare software ergonomics: high contrast (slate/navy neutrals), deliberate 8px spatial grid, mathematical padding ratios (outer >= inner), zero artificial marketing hero blocks, zero low-contrast text, and 100% functional controls with responsive state feedback.');

  drawSubhead(doc, '6.2 Primary View Hierarchy');
  drawBulletPoint(doc, 'Global Navigation Shell', 'Header bar with quick switcher, notification bell, live Firestore sync indicator, and tab navigation.');
  drawBulletPoint(doc, 'Executive Dashboard (Tab 1)', '10 KPI cards, interactive 30-120+ day aging distribution, stage pipeline flow, and sub-views (5.11.2 - 5.11.5).');
  drawBulletPoint(doc, 'Applications Master Tracker (Tab 2)', 'Dual-view toggle: interactive Kanban drag-and-drop board + multi-column tabular grid with search, stage filters, and inline actions.');
  drawBulletPoint(doc, 'Facility Group Linking Matrix (Tab 3)', 'Roster view mapping providers to legal entities and physical practice locations with one-click link status toggles.');
  drawBulletPoint(doc, 'Clinical Staff Directory (Tab 4)', 'Card-based and table-based roster of all clinicians with credential expiration warnings and CAQH renewal flags.');
  drawBulletPoint(doc, 'Reports & Compliance Suite (Tab 5)', 'Weekly 5.11.6 and Monthly 5.11.7 reports with printable styling and Power BI star-schema JSON exporter.');

  // -------------------------------------------------------------
  // SECTION 7.0: BUSINESS LOGIC & AUTOMATION ENGINE
  // -------------------------------------------------------------
  doc.addPage();
  drawSectionBanner(doc, '7.0', 'BUSINESS LOGIC, CALCULATIONS & AUTOMATION ENGINE');

  drawSubhead(doc, '7.1 Aging Bucketing & Time-in-Stage Algorithms');
  drawBodyText(doc, 'Application aging is calculated continuously against the initial submission timestamp:');
  drawBulletPoint(doc, '0–30 Days (On Track)', 'Standard payer receipt and primary source verification window.');
  drawBulletPoint(doc, '31–60 Days (In Progress)', 'Payer committee credentialing evaluation phase; routine follow-up cadence.');
  drawBulletPoint(doc, '61–90 Days (Aging / Follow-up Due)', 'Exceeds standard commercial turnaround; automatic alert triggers for specialist outreach.');
  drawBulletPoint(doc, '91–120 Days (Critical Attention)', 'Flagged as overdue; escalated in Weekly 5.11.6 report to Clinical Director.');
  drawBulletPoint(doc, '120+ Days (Severe Delay / At-Risk)', 'Action required; payer moratorium or missing document verification flag.');

  drawSubhead(doc, '7.2 CAQH ProView 120-Day Re-Attestation Countdown');
  drawBodyText(doc, 'The system monitors each clinician’s last CAQH attestation date. At day 90 (30 days prior to expiration), an automated reminder badge appears on the provider’s profile. At day 110 (10 days prior), high-priority escalation is logged to prevent CAQH profile lapse.');

  drawSubhead(doc, '7.3 Medi-Cal PAVE Portal Stage Tracking');
  drawBodyText(doc, 'For Speech and Occupational Therapy clinicians billing Medi-Cal, the system enforces a strict 4-phase PAVE workflow: (1) PAVE Profile Creation & NPI Linking, (2) Board License Verification Upload, (3) Rendering Provider Agreement Signature, and (4) State Department of Health Care Services (DHCS) Approval Letter Receipt.');

  // -------------------------------------------------------------
  // SECTION 8.0 & 9.0: REPORTING, SECURITY & RBAC
  // -------------------------------------------------------------
  doc.addPage();
  drawSectionBanner(doc, '8.0', 'REPORTING, ANALYTICS & POWER BI INTEGRATION');

  drawSubhead(doc, '8.1 Section 5.11.6 Weekly Operational Report');
  drawBodyText(doc, 'Every Monday morning, the system generates the 7 core executive metrics: (1) New applications initiated, (2) Applications submitted, (3) Scheduled follow-ups due, (4) Overdue applications (>90 days), (5) Additional documents requested by payers, (6) Approvals received, and (7) Active escalations with resolution notes. Fully formatted for browser print and CSV export.');

  drawSubhead(doc, '8.2 Section 5.11.7 Monthly Credentialing Report');
  drawBodyText(doc, 'A comprehensive 10-section operational briefing: 1. Provider Updates, 2. Payer Policy Updates, 3. Applications Submitted, 4. Approvals Received, 5. Billing Effective Dates, 6. Pending Pipeline, 7. Operational Delays & Moratoriums, 8. Additional Documentation Requests, 9. Key Accomplishments, and 10. Upcoming Actions. Features tabbed views for Consolidated, ABA, Speech, and OT.');

  drawSectionBanner(doc, '9.0', 'SECURITY, AUTHENTICATION & ACCESS CONTROL');
  drawSubhead(doc, '9.1 Role-Based Access Control (RBAC)');
  drawTable(doc, [
    ['Role', 'Dashboard & Roster', 'Create / Edit Apps', 'Facility Linking', 'Admin Settings'],
    ['Administrator', 'Full Access', 'Full Access', 'Full Access', 'Full Access'],
    ['Credentialing Specialist', 'Full Access', 'Full Access', 'Full Access', 'No Access'],
    ['Credentialing Manager', 'Full Access', 'Full Access', 'Full Access', 'Audit Only'],
    ['Read-Only Stakeholder', 'View Only', 'No Access', 'No Access', 'No Access']
  ], [110, 95, 100, 100, 100]);

  drawSubhead(doc, '9.2 Hardened Firestore Security Rules');
  drawBodyText(doc, 'All Firestore collections (employees, clinical_staff, providers, applications, payers, facilities, documents, comments) enforce strict path variable regex validation: isValidId(docId) ensuring strings contain only alphanumeric characters, underscores, or hyphens (1-64 chars), preventing path traversal and injection attacks.');

  // -------------------------------------------------------------
  // SECTION 10.0, 11.0 & 12.0: ROADMAP & TRACEABILITY
  // -------------------------------------------------------------
  doc.addPage();
  drawSectionBanner(doc, '10.0', 'NON-FUNCTIONAL & OPERATIONAL REQUIREMENTS');
  drawBulletPoint(doc, 'System Latency', 'Sub-200ms response time for in-memory KPI calculations, list filtering, and local state transitions.');
  drawBulletPoint(doc, 'Data Durability & Backup', 'Multi-tier storage combining reactive state, browser persistence, formatted Excel/CSV export, and direct Firebase Firestore replication.');
  drawBulletPoint(doc, 'HIPAA Compliance', 'No unencrypted transmission of Protected Health Information (PHI) or clinician PII. Secure token-based access.');

  drawSectionBanner(doc, '11.0', 'IMPLEMENTATION ROADMAP & INTEGRATION BLUEPRINT');
  drawTable(doc, [
    ['Phase / Sprint', 'Core Deliverables', 'Target System', 'Current Status'],
    ['Phase 1 (Current)', 'Complete 4-Step Intake, Linking Matrix, Dashboard, 5.11 Suite, Rules', 'React 19 / Firestore', '100% Operational'],
    ['Phase 2 (Q3 2026)', 'Direct CAQH ProView B2B Gateway & Outbound Payer Email Bots', 'CAQH B2B API / SMTP', 'Architecture Staged'],
    ['Phase 3 (2027)', 'Automated Medi-Cal PAVE RPA Submission Bot', 'Headless RPA Worker', 'Long-term Roadmap']
  ], [90, 180, 135, 100]);

  drawSectionBanner(doc, '12.0', 'MASTER VERIFICATION TRACEABILITY MATRIX');
  drawTable(doc, [
    ['Req ID', 'Functional Scope', 'Validation Criteria', 'Audit Status'],
    ['FR-1', '4-Step Clinician Intake', 'Step 1-4 fields, sample presets, carry-forward', 'Verified / Pass'],
    ['FR-2', 'Provider Roster Engine', 'NPI verification, discipline mapping, status flags', 'Verified / Pass'],
    ['FR-3', 'Payer Tracking Pipeline', '7 lifecycle stages, aging counters, milestone log', 'Verified / Pass'],
    ['FR-4', 'Group Linking Matrix', 'Dual-verification TIN/NPI check before billing release', 'Verified / Pass'],
    ['FR-5', 'Audit Trail & Notes', 'ISO timestamp, user ID, user name, system role', 'Verified / Pass'],
    ['FR-6', 'Document Links Subtab', 'Cloud URL link, category tag, expiration tracking', 'Verified / Pass'],
    ['FR-7', 'Executive Dashboard', '10 KPIs, 30-120+ day aging, overdue queue', 'Verified / Pass'],
    ['FR-8', '5.11 Specialized Views', 'Discipline, Payer, Specialist, Location matrices', 'Verified / Pass'],
    ['FR-9', '5.11.6 / 5.11.7 Reports', 'Weekly 7 metrics, Monthly 10 sections, CSV & Print', 'Verified / Pass'],
    ['FR-10', 'Power BI DirectQuery', 'Star-schema Fact/Dimension payload generator', 'Verified / Pass']
  ], [45, 150, 210, 100]);

  // Page numbering in footer (two pass)
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    if (i === 0) continue; // Skip cover page footer

    // Header on inner pages
    doc.fillColor(MUTED).fontSize(7).font('Helvetica')
       .text('AGES & PROFICIO HEALTHCARE CREDENTIALING SYSTEM • MASTER SPECIFICATION', 45, 25, { width: 505 });
    doc.text('CONFIDENTIAL • PROJECT REFERENCE', 45, 25, { align: 'right', width: 505 });
    doc.rect(45, 34, 505, 0.5).fill('#E2E8F0');

    // Footer on inner pages
    doc.rect(45, 785, 505, 0.5).fill('#E2E8F0');
    doc.fillColor(MUTED).fontSize(8).font('Helvetica')
       .text(`Document Version ${docVersion} • Author: ${docAuthor}`, 45, 792, { width: 350 });
    doc.text(`Page ${i + 1} of ${range.count}`, 45, 792, { align: 'right', width: 505 });
  }

  doc.end();

  writeStream.on('finish', () => {
    // Copy to root as well for easy access
    fs.copyFileSync(pdfPathDocs, pdfPathRoot);
    console.log('Successfully generated PDF documents at:');
    console.log(' - ' + pdfPathDocs);
    console.log(' - ' + pdfPathRoot);
  });
}

// PDF Helper Functions
function drawSectionBanner(doc, number, title) {
  doc.moveDown(0.6);
  const y = doc.y;
  doc.rect(45, y, 505, 24).fill('#1E3A8A');
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text(`${number}  ${title}`, 55, y + 6);
  doc.moveDown(1.1);
}

function drawSubhead(doc, text) {
  doc.moveDown(0.4);
  doc.fillColor('#2563EB').fontSize(10).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
}

function drawBodyText(doc, text) {
  doc.fillColor('#0F172A').fontSize(8.5).font('Helvetica').text(text, { align: 'justify', lineGap: 2.2 });
  doc.moveDown(0.3);
}

function drawBulletPoint(doc, title, text) {
  const y = doc.y;
  doc.fillColor('#1E3A8A').fontSize(8.5).font('Helvetica-Bold').text('• ' + title + ': ', 55, y, { continued: true });
  doc.fillColor('#0F172A').font('Helvetica').text(text, { lineGap: 2 });
  doc.moveDown(0.25);
}

function drawTable(doc, rows, colWidths) {
  const tableTop = doc.y + 4;
  let currentY = tableTop;

  rows.forEach((row, rowIndex) => {
    const isHeader = rowIndex === 0;
    const height = isHeader ? 16 : 14;

    doc.rect(45, currentY, 505, height).fill(isHeader ? '#1E293B' : (rowIndex % 2 === 0 ? '#F8FAFC' : '#FFFFFF'));
    doc.rect(45, currentY, 505, height).stroke('#E2E8F0');

    let currentX = 50;
    row.forEach((cell, colIndex) => {
      const width = colWidths[colIndex];
      doc.fillColor(isHeader ? '#FFFFFF' : '#0F172A')
         .fontSize(isHeader ? 7.5 : 7)
         .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
         .text(cell, currentX, currentY + (isHeader ? 4 : 3), { width: width - 8, lineBreak: false, ellipsis: true });
      currentX += width;
    });

    currentY += height;
  });

  doc.y = currentY + 8;
}

// Run PDF Generation
generatePDF();

// --- HTML DOCUMENT GENERATOR ---
function generateHTML() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Healthcare Credentialing & Provider Linking Management System — Master Specification</title>
  <style>
    :root {
      --primary: #1E3A8A;
      --primary-dark: #172554;
      --secondary: #2563EB;
      --slate-900: #0F172A;
      --slate-800: #1E293B;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-200: #E2E8F0;
      --slate-100: #F1F5F9;
      --slate-50: #F8FAFC;
      --emerald-700: #047857;
      --emerald-50: #ECFDF5;
      --amber-700: #B45309;
      --amber-50: #FFFBEB;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--slate-900);
      background-color: var(--slate-100);
      line-height: 1.6;
      font-size: 15px;
      -webkit-font-smoothing: antialiased;
    }
    .page-container {
      max-width: 1080px;
      margin: 32px auto;
      background: #FFFFFF;
      padding: 56px 64px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      border: 1px solid var(--slate-200);
    }
    @media print {
      body {
        background: #FFFFFF;
        font-size: 13px;
      }
      .page-container {
        box-shadow: none;
        border: none;
        padding: 0;
        margin: 0;
        max-width: 100%;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
      @page {
        margin: 20mm 15mm;
      }
    }
    .header-banner {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: #FFFFFF;
      padding: 36px 40px;
      border-radius: 8px;
      margin-bottom: 32px;
    }
    .header-banner h1 {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .header-banner p.sub {
      color: #93C5FD;
      font-size: 15px;
      margin-bottom: 16px;
    }
    .header-banner .meta-strip {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      font-size: 12px;
      color: #E2E8F0;
    }
    .meta-strip span strong {
      color: #FFFFFF;
    }
    .toc-card {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 28px 32px;
      margin-bottom: 40px;
    }
    .toc-card h2 {
      color: var(--primary);
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 24px;
    }
    @media (max-width: 768px) {
      .toc-grid {
        grid-template-columns: 1fr;
      }
    }
    .toc-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 14px;
    }
    .toc-item .num {
      font-weight: 700;
      color: var(--secondary);
      min-width: 32px;
    }
    .toc-item a {
      color: var(--slate-800);
      text-decoration: none;
      transition: color 0.15s;
    }
    .toc-item a:hover {
      color: var(--secondary);
      text-decoration: underline;
    }
    .section-title {
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
      background: var(--primary);
      padding: 10px 18px;
      border-radius: 6px;
      margin-top: 40px;
      margin-bottom: 20px;
    }
    .subsection-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--secondary);
      margin-top: 24px;
      margin-bottom: 10px;
      border-left: 4px solid var(--secondary);
      padding-left: 10px;
    }
    p {
      margin-bottom: 12px;
      color: var(--slate-700);
    }
    ul, ol {
      margin-left: 24px;
      margin-bottom: 16px;
      color: var(--slate-700);
    }
    li {
      margin-bottom: 6px;
    }
    li strong {
      color: var(--slate-900);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0 28px 0;
      font-size: 13.5px;
    }
    th, td {
      border: 1px solid var(--slate-200);
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background: var(--slate-800);
      color: #FFFFFF;
      font-weight: 600;
    }
    tr:nth-child(even) {
      background-color: var(--slate-50);
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-success {
      background: var(--emerald-50);
      color: var(--emerald-700);
      border: 1px solid #A7F3D0;
    }
    .badge-warning {
      background: var(--amber-50);
      color: var(--amber-700);
      border: 1px solid #FDE68A;
    }
    .code-block {
      background: var(--slate-900);
      color: #E2E8F0;
      padding: 16px 20px;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
      line-height: 1.5;
      overflow-x: auto;
      margin: 16px 0;
    }
    .callout {
      border-left: 4px solid var(--primary);
      background: var(--slate-50);
      padding: 16px 20px;
      border-radius: 0 6px 6px 0;
      margin: 18px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>

<div class="page-container">

  <!-- Header Banner -->
  <div class="header-banner">
    <h1>${documentTitle}</h1>
    <p class="sub">${documentSubtitle}</p>
    <div class="meta-strip">
      <span><strong>Document Version:</strong> ${docVersion}</span>
      <span><strong>Classification:</strong> Confidential Project Reference</span>
      <span><strong>Project Lead:</strong> ${projectLead}</span>
      <span><strong>Operating Entities:</strong> Ages Learning Solutions • Proficio Speech • Child’s Play Therapy</span>
    </div>
  </div>

  <!-- Table of Contents -->
  <div class="toc-card">
    <h2>TABLE OF CONTENTS / MASTER INDEX</h2>
    <div class="toc-grid">
      <div class="toc-item"><span class="num">1.0</span><a href="#sec-1">Executive Summary & Architectural Vision</a></div>
      <div class="toc-item"><span class="num">2.0</span><a href="#sec-2">Multi-Entity Governance & Clinical Disciplines</a></div>
      <div class="toc-item"><span class="num">3.0</span><a href="#sec-3">Functional Requirements (FR-1 to FR-10)</a></div>
      <div class="toc-item"><span class="num">4.0</span><a href="#sec-4">End-to-End Operational Workflows (Steps 1 to 4)</a></div>
      <div class="toc-item"><span class="num">5.0</span><a href="#sec-5">Database Architecture & Master Data Dictionary</a></div>
      <div class="toc-item"><span class="num">6.0</span><a href="#sec-6">User Interface Architecture & Ergonomics</a></div>
      <div class="toc-item"><span class="num">7.0</span><a href="#sec-7">Business Logic, Aging & Automation Engine</a></div>
      <div class="toc-item"><span class="num">8.0</span><a href="#sec-8">Reporting Suites (5.11.6, 5.11.7, Power BI)</a></div>
      <div class="toc-item"><span class="num">9.0</span><a href="#sec-9">Security Architecture, RBAC & Firestore Rules</a></div>
      <div class="toc-item"><span class="num">10.0</span><a href="#sec-10">Non-Functional, Latency & Reliability SLAs</a></div>
      <div class="toc-item"><span class="num">11.0</span><a href="#sec-11">Implementation Roadmap & Technical Backlog</a></div>
      <div class="toc-item"><span class="num">12.0</span><a href="#sec-12">Master Traceability & Sign-Off Reference</a></div>
    </div>
  </div>

  <!-- 1.0 Executive Summary -->
  <h2 class="section-title" id="sec-1">1.0 EXECUTIVE SUMMARY & ARCHITECTURAL VISION</h2>
  <h3 class="subsection-title">1.1 Business Problem & Strategic Imperative</h3>
  <p>Healthcare credentialing and payer enrollment represent the primary financial gating mechanisms for multi-specialty therapy organizations. Clinicians cannot bill commercial health plans, Medicaid HMOs, or state Regional Centers until they successfully pass two rigorous administrative gauntlets:</p>
  <ul>
    <li><strong>Individual Clinician Credentialing:</strong> Verification of primary source credentials (state board licenses, national board certifications, NPI verification, DEA/malpractice coverage, and CAQH ProView attestation) culminating in formal payer credentialing committee approval.</li>
    <li><strong>Legal Facility Group Linking:</strong> Execution of contract attachments and roster updates linking the provider's Type 1 individual NPI to the operating entity's Type 2 group NPI, billing Tax Identification Number (TIN), and physical clinic location.</li>
  </ul>
  <p>Without centralized software, credentialing teams historically experienced average turnaround delays exceeding 120 days, frequent claim rejections due to unlinked facility locations, and missed CAQH 120-day re-attestation deadlines. This system unifies all three practice entities into one real-time operational engine.</p>

  <h3 class="subsection-title">1.2 Core Architectural Objectives</h3>
  <ul>
    <li><strong>Turnaround Acceleration:</strong> Reduce average credentialing cycle time from 120+ days to under 45 days.</li>
    <li><strong>Dual-Verification Enforcement:</strong> Hard validation gates ensuring no clinician is released for billing until both payer approval and facility linking are confirmed.</li>
    <li><strong>Real-Time Transparency:</strong> Unified management dashboards with 10 executive KPIs and dynamic 30–120+ day aging distribution.</li>
    <li><strong>Audit Integrity:</strong> Immutable collaboration comments and stage transition histories with explicit author and timestamp tracking.</li>
  </ul>

  <!-- 2.0 Multi-Entity Governance -->
  <h2 class="section-title" id="sec-2">2.0 MULTI-ENTITY GOVERNANCE & CLINICAL DISCIPLINES</h2>
  <h3 class="subsection-title">2.1 Practice Group Scope</h3>
  <table>
    <thead>
      <tr>
        <th>Entity Name</th>
        <th>Discipline</th>
        <th>Provider Roles</th>
        <th>Licensing Board</th>
        <th>Taxonomy Codes</th>
        <th>Primary Payer Mix</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Ages Learning Solutions</strong></td>
        <td>Applied Behavior Analysis (ABA)</td>
        <td>BCBAs, BCaBAs, Clinical Directors</td>
        <td>Behavior Analyst Certification Board (BACB)</td>
        <td>103K00000X / 106E00000X</td>
        <td>Kaiser Permanente, Blue Shield CA, Optum/UHC, Aetna, Cigna, Regional Centers</td>
      </tr>
      <tr>
        <td><strong>Proficio Speech Therapy</strong></td>
        <td>Speech-Language Pathology (SLP)</td>
        <td>SLPs, CF-SLPs, SLPAs</td>
        <td>California SLPAHADB & ASHA (CCC-SLP)</td>
        <td>235Z00000X</td>
        <td>Commercial Health Plans, Medi-Cal Managed Care, School Districts</td>
      </tr>
      <tr>
        <td><strong>Child’s Play Therapy</strong></td>
        <td>Occupational Therapy (OT)</td>
        <td>OTR/Ls, COTAs</td>
        <td>California Board of Occupational Therapy (CBOT) & NBCOT</td>
        <td>225X00000X</td>
        <td>Commercial Plans, Medi-Cal PAVE, Regional Centers, Private PPO/HMO</td>
      </tr>
    </tbody>
  </table>

  <!-- 3.0 Functional Requirements -->
  <h2 class="section-title" id="sec-3">3.0 FUNCTIONAL REQUIREMENTS SPECIFICATION</h2>
  <h3 class="subsection-title">3.1 Functional Requirements Matrix (FR-1 to FR-10)</h3>
  <table>
    <thead>
      <tr>
        <th>Req ID</th>
        <th>Requirement Name</th>
        <th>Functional Specification</th>
        <th>Implementation Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>FR-1</strong></td>
        <td>Multi-Step Clinician Intake</td>
        <td>Step 1 (Demographics/Discipline), Step 2 (NPI, License, CAQH, Docs), Step 3 (Payers & Comments), Step 4 (Post-Add Linking Summary).</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-2</strong></td>
        <td>Provider Roster Engine</td>
        <td>Full clinician directory with NPI validation, discipline categorization, and direct links to active and historical applications.</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-3</strong></td>
        <td>Multi-Payer Tracking Pipeline</td>
        <td>Multi-stage tracker: Intake, Submitted, Payer Review, Approved, Linked/Effective with custom follow-up cadences and reference IDs.</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-4</strong></td>
        <td>Facility & Group Linking Matrix</td>
        <td>Dual-verification table ensuring providers are linked to legal entities & facility NPIs before billing release is authorized.</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-5</strong></td>
        <td>Audit Trail & Collaborative Notes</td>
        <td>Chronological comment and audit logs with author ID, author name, system role, and precise ISO timestamps.</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-6</strong></td>
        <td>Supporting Document Subtab</td>
        <td>Dedicated subtab for attaching and auditing external verification URLs (licenses, board certs, malpractice COI, CV, PAVE proof).</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-7</strong></td>
        <td>Management Dashboard</td>
        <td>10 core executive KPIs, interactive 30–120+ day aging engine, pipeline stage flow, and overdue item queues.</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-8</strong></td>
        <td>5.11 Specialized Views</td>
        <td>Dedicated oversight views: 5.11.2 (By Discipline), 5.11.3 (By Payer), 5.11.4 (By Specialist), and 5.11.5 (By Location).</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-9</strong></td>
        <td>5.11.6 Weekly & 5.11.7 Monthly Reports</td>
        <td>Standardized weekly report (7 core metrics) and monthly report (10 structured sections) with print CSS and CSV export.</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
      <tr>
        <td><strong>FR-10</strong></td>
        <td>Power BI DirectQuery Model</td>
        <td>Normalized Star-Schema dataset (FactApplications, DimProviders, DimPayers, DimLocations, DimDates) with REST payload format.</td>
        <td><span class="badge badge-success">FULLY IMPLEMENTED</span></td>
      </tr>
    </tbody>
  </table>

  <!-- 4.0 Operational Lifecycle Workflows -->
  <h2 class="section-title" id="sec-4">4.0 END-TO-END OPERATIONAL LIFECYCLE WORKFLOWS</h2>
  <h3 class="subsection-title">4.1 Step 1: Initial Clinician Onboarding Intake</h3>
  <p>Collects baseline demographic and professional information:</p>
  <ul>
    <li><strong>Field 1:</strong> Clinician Full Name & Professional Credentials (e.g. MS, BCBA, CCC-SLP, OTR/L).</li>
    <li><strong>Field 2:</strong> Primary Contact Phone Number and Work Email Address.</li>
    <li><strong>Field 4:</strong> Primary Office Location & Service Hub (e.g. San Jose, Fremont, Pleasanton, San Mateo, Sacramento).</li>
    <li><strong>Field 5:</strong> Clinical Discipline Selection (Applied Behavior Analysis, Speech Therapy, or Occupational Therapy).</li>
    <li><strong>Quick Presets:</strong> One-click sample clinician buttons for rapid demonstration and validation testing.</li>
  </ul>

  <h3 class="subsection-title">4.2 Step 2: Provider Verification & Start Credentialing</h3>
  <p>Presents a top summary banner confirming Step 1 details. Features a prominent, centered "Start Credentialing" action button. Gathers:</p>
  <ul>
    <li><strong>Field 3:</strong> Individual 10-Digit National Provider Identifier (NPI) & State Professional Board License Number with Expiration Date.</li>
    <li><strong>Field 6:</strong> CAQH ProView ID Number and Primary Healthcare Provider Taxonomy Code.</li>
    <li><strong>Supporting Documents Subtab:</strong> Table view displaying linked verification items (State License, Board Certification, Malpractice Insurance COI, CV, PAVE Proof) with inline modal to append new document URLs.</li>
  </ul>

  <h3 class="subsection-title">4.3 Step 3: Payer Application Bundling & Collaborative Comments</h3>
  <p>Allows the coordinator to select target insurance payers from a multi-select grid (Kaiser, Blue Shield, Optum/UHC, Aetna, Cigna, Anthem, Magellan). Incorporates a non-prominent secondary "Add Comment" button that expands an inline note form to log specialist observations, reference numbers, or coordinator handoffs with automatic author attribution.</p>

  <h3 class="subsection-title">4.4 Step 4: Post-Add Confirmation & Billing Group Linking</h3>
  <p>Executes an atomic persistence routine across all system entities. Renders a comprehensive verification summary card confirming profile synchronization. Concludes with a prominent Provider Linking section containing a plus sign (+) button to map the clinician to the group practice TIN, clinic location NPI, and supervising provider.</p>

  <!-- 5.0 Database Architecture -->
  <h2 class="section-title" id="sec-5">5.0 DATABASE ARCHITECTURE, SCHEMAS & DATA MODELS</h2>
  <h3 class="subsection-title">5.1 Collections Overview</h3>
  <div class="callout">
    <strong>Relational-in-NoSQL Architecture:</strong> The database maintains strict referential integrity between human resources, clinical credentials, payer applications, document attachments, and audit trails using standardized foreign key fields.
  </div>

  <div class="code-block">
// Master Entity Relationships:
employees (HR Master Profile)
  └── clinical_staff (Clinical Credentials & License) [1:1 via employeeId]
        ├── providers (Active Credentialing Roster)   [1:1 via clinicalStaffId]
        │     ├── applications (Payer Enrollment)    [1:N via providerId]
        │     │     ├── documents (Credential Files) [1:N via applicationId]
        │     │     └── comments (Audit Notes)       [1:N via applicationId]
        │     └── provider_locations (Group Linking) [1:N via providerId]
        └── facilities (Locations / Service Hubs)    [1:N via locationId]
  </div>

  <h3 class="subsection-title">5.2 Master Data Dictionary</h3>
  <table>
    <thead>
      <tr>
        <th>Collection</th>
        <th>Field</th>
        <th>Type</th>
        <th>Constraints / Validation</th>
        <th>Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>employees</code></td>
        <td><code>id</code></td>
        <td>string</td>
        <td>Primary Key, ^[a-zA-Z0-9_-]{1,64}$</td>
        <td>Unique HR identifier</td>
      </tr>
      <tr>
        <td><code>employees</code></td>
        <td><code>email</code></td>
        <td>string</td>
        <td>Valid Email Address</td>
        <td>Clinician corporate email</td>
      </tr>
      <tr>
        <td><code>clinical_staff</code></td>
        <td><code>employeeId</code></td>
        <td>string</td>
        <td>Foreign Key -> employees.id</td>
        <td>Links clinical attributes to employee</td>
      </tr>
      <tr>
        <td><code>clinical_staff</code></td>
        <td><code>npi</code></td>
        <td>string</td>
        <td>10 digits, numeric only</td>
        <td>Individual Type 1 NPI</td>
      </tr>
      <tr>
        <td><code>clinical_staff</code></td>
        <td><code>caqhId</code></td>
        <td>string</td>
        <td>8 digits, numeric only</td>
        <td>CAQH ProView Identifier</td>
      </tr>
      <tr>
        <td><code>applications</code></td>
        <td><code>providerId</code></td>
        <td>string</td>
        <td>Foreign Key -> providers.id</td>
        <td>Associates application to provider</td>
      </tr>
      <tr>
        <td><code>applications</code></td>
        <td><code>payerId</code></td>
        <td>string</td>
        <td>Foreign Key -> payers.id</td>
        <td>Target health plan organization</td>
      </tr>
      <tr>
        <td><code>applications</code></td>
        <td><code>stage</code></td>
        <td>string</td>
        <td>Enum (Intake, Submitted, Review, etc.)</td>
        <td>Lifecycle progress stage</td>
      </tr>
      <tr>
        <td><code>applications</code></td>
        <td><code>agingDays</code></td>
        <td>number</td>
        <td>Integer >= 0</td>
        <td>Calculated days in credentialing cycle</td>
      </tr>
      <tr>
        <td><code>comments</code></td>
        <td><code>timestamp</code></td>
        <td>string</td>
        <td>ISO 8601 UTC string</td>
        <td>Audit timestamp of note entry</td>
      </tr>
    </tbody>
  </table>

  <!-- 6.0 User Interface Architecture -->
  <h2 class="section-title" id="sec-6">6.0 USER INTERFACE ARCHITECTURE & ERGONOMICS</h2>
  <h3 class="subsection-title">6.1 Anti-Slop Visual Standards</h3>
  <ul>
    <li><strong>Mathematical Padding:</strong> Outer container padding (32px) strictly exceeds inner element gap (16px).</li>
    <li><strong>Accessible Color Contrast:</strong> Deep Slate (#0F172A) body typography on clean crisp white and neutral backgrounds, exceeding WCAG AA 4.5:1 ratio.</li>
    <li><strong>Zero Artificial Distractions:</strong> No marketing hero banners, no purple/cyan gradient text, no meaningless cards inside cards.</li>
    <li><strong>Single-Line Control Labels:</strong> Strict prevention of wrapped or truncated labels inside action buttons and badges.</li>
  </ul>

  <!-- 7.0 Business Logic & Calculations -->
  <h2 class="section-title" id="sec-7">7.0 BUSINESS LOGIC, AGING & AUTOMATION ENGINE</h2>
  <h3 class="subsection-title">7.1 Dynamic Aging Classification</h3>
  <p>The system calculates aging dynamically using the formula: <code>Math.floor((Date.now() - Date.parse(submissionDate)) / (1000 * 60 * 60 * 24))</code>.</p>
  <ul>
    <li><strong>0–30 Days (On Track):</strong> Normal processing interval. Routine confirmation of document completeness.</li>
    <li><strong>31–60 Days (In Progress):</strong> Payer committee evaluation phase. Specialists perform first milestone outreach.</li>
    <li><strong>61–90 Days (Aging):</strong> Approaching commercial standard SLA threshold. Automated amber alert displayed on specialist queue.</li>
    <li><strong>91–120 Days (Critical):</strong> Overdue milestone. Elevated to weekly executive escalation log.</li>
    <li><strong>120+ Days (Severe Delay):</strong> Urgent operational intervention required. Flagged for health plan network manager escalation.</li>
  </ul>

  <!-- 8.0 Reporting Suites -->
  <h2 class="section-title" id="sec-8">8.0 REPORTING SUITES & POWER BI INTEGRATION</h2>
  <h3 class="subsection-title">8.1 Weekly 5.11.6 Operational Report</h3>
  <p>Generates an executive snapshot every Monday tracking 7 core metrics: (1) New applications, (2) Submissions, (3) Follow-ups due, (4) Overdue applications, (5) Additional documents requested, (6) Approvals received, and (7) Escalations log with resolution notes. Features print-ready layout and CSV export.</p>

  <h3 class="subsection-title">8.2 Monthly 5.11.7 Credentialing Report</h3>
  <p>A structured 10-section strategic briefing: Provider Updates, Payer Updates, Applications Submitted, Approvals Received, Billing Effective Dates, In-Flight Pipeline, Operational Delays, Additional Documentation Requests, Key Accomplishments, and Upcoming Actions. Includes multi-entity tabbed views (Consolidated, ABA, Speech, OT).</p>

  <!-- 9.0 Security & RBAC -->
  <h2 class="section-title" id="sec-9">9.0 SECURITY ARCHITECTURE, RBAC & FIRESTORE RULES</h2>
  <h3 class="subsection-title">9.1 Role-Based Access Control (RBAC)</h3>
  <ul>
    <li><strong>Administrator:</strong> Unrestricted read/write across all collections, configuration of users, and audit trail inspection.</li>
    <li><strong>Credentialing Specialist:</strong> Create and update applications, upload verification documents, add collaborative notes, and manage provider rosters.</li>
    <li><strong>Credentialing Manager:</strong> Full operational oversight, approvals verification, escalation handling, and compliance report generation.</li>
    <li><strong>Read-Only Stakeholder:</strong> Read-only access to executive dashboard, aging charts, and high-level reports.</li>
  </ul>

  <h3 class="subsection-title">9.2 Firestore Security Hardening</h3>
  <p>All database routes enforce input validation and regex checks on document identifiers:</p>
  <div class="code-block">
function isValidId(id) {
  return id is string && id.matches('^[a-zA-Z0-9_-]{1,64}$');
}

match /employees/{employeeId} {
  allow read, write: if request.auth != null && isValidId(employeeId);
}
match /clinical_staff/{staffId} {
  allow read, write: if request.auth != null && isValidId(staffId);
}
match /applications/{appId} {
  allow read, write: if request.auth != null && isValidId(appId);
}
  </div>

  <!-- 10.0 Non-Functional Requirements -->
  <h2 class="section-title" id="sec-10">10.0 NON-FUNCTIONAL, LATENCY & RELIABILITY SLAS</h2>
  <ul>
    <li><strong>Response Time:</strong> Client-side state transitions & search queries execute in &lt; 50ms; cloud writes complete in &lt; 250ms.</li>
    <li><strong>Data Recovery:</strong> RPO (Recovery Point Objective) &lt; 24 hours with on-demand manual JSON/CSV backup downloads.</li>
    <li><strong>Responsive Layout:</strong> Fully functional across desktop (1920x1080), laptop (1366x768), and tablet viewports with 44px touch targets.</li>
  </ul>

  <!-- 11.0 Implementation Roadmap -->
  <h2 class="section-title" id="sec-11">11.0 IMPLEMENTATION ROADMAP & TECHNICAL BACKLOG</h2>
  <table>
    <thead>
      <tr>
        <th>Phase</th>
        <th>Target Milestone</th>
        <th>Target Quarter</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Phase 1</td>
        <td>Core 4-Step Intake, Linking Matrix, Dashboard, 5.11 Reports, RBAC</td>
        <td>Completed</td>
        <td><span class="badge badge-success">PRODUCTION READY</span></td>
      </tr>
      <tr>
        <td>Phase 2</td>
        <td>Direct CAQH ProView B2B Gateway & Outbound Automated Payer Follow-up Bots</td>
        <td>Q4 2026</td>
        <td><span class="badge badge-warning">ROADMAP STAGED</span></td>
      </tr>
      <tr>
        <td>Phase 3</td>
        <td>Medi-Cal PAVE Headless RPA Bot for Auto-Form Pre-Filling</td>
        <td>2027</td>
        <td><span class="badge badge-warning">LONG-TERM ROADMAP</span></td>
      </tr>
    </tbody>
  </table>

  <!-- 12.0 Master Verification Traceability Matrix -->
  <h2 class="section-title" id="sec-12">12.0 MASTER TRACEABILITY & SIGN-OFF REFERENCE</h2>
  <table>
    <thead>
      <tr>
        <th>Requirement ID</th>
        <th>Requirement Description</th>
        <th>Validation Criteria</th>
        <th>Sign-Off Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>FR-1</td>
        <td>4-Step Onboarding Intake Wizard</td>
        <td>Field capture 1-6, sample presets, carry forward</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-2</td>
        <td>Provider & Roster Management</td>
        <td>NPI validation, discipline categorization</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-3</td>
        <td>Multi-Payer Enrollment Tracking</td>
        <td>Stage lifecycle, custom follow-ups, reference numbers</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-4</td>
        <td>Dual-Verification Group Linking</td>
        <td>Payer approval + group link check before billing release</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-5</td>
        <td>Collaborative Audit Trail</td>
        <td>Author name, author ID, system role, ISO timestamp</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-6</td>
        <td>Supporting Documents Subtab</td>
        <td>URL verification, category tag, expiration tracking</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-7</td>
        <td>Executive Management Dashboard</td>
        <td>10 operational KPIs, 30-120+ day aging distribution</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-8</td>
        <td>5.11 Specialized Oversight Views</td>
        <td>Discipline, Payer, Specialist, Location views</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-9</td>
        <td>Weekly & Monthly Reports</td>
        <td>5.11.6 Weekly 7 metrics, 5.11.7 Monthly 10 sections</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
      <tr>
        <td>FR-10</td>
        <td>Power BI Star-Schema DirectQuery</td>
        <td>Normalized Fact/Dimension dataset payload</td>
        <td><span class="badge badge-success">VERIFIED / PASS</span></td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 48px; border-top: 1px solid var(--slate-200); padding-top: 20px; font-size: 12px; color: var(--slate-600); display: flex; justify-content: space-between;">
    <span>Healthcare Engineering & Credentialing Operations Team</span>
    <span>CONFIDENTIAL &bull; FOR PROJECT REFERENCE USE ONLY</span>
  </div>

</div>

</body>
</html>`;

  fs.writeFileSync(htmlPathDocs, htmlContent);
  fs.writeFileSync(htmlPathRoot, htmlContent);
  console.log('Successfully generated HTML documents at:');
  console.log(' - ' + htmlPathDocs);
  console.log(' - ' + htmlPathRoot);
}

generateHTML();

// --- MARKDOWN MASTER DOCUMENT GENERATOR ---
function generateMarkdown() {
  const mdContent = `# Healthcare Credentialing & Provider Linking Management System
## Master Technical & Functional Specification Document

**Operating Entities:**
- **Ages Learning Solutions** (Applied Behavior Analysis / ABA)
- **Proficio Speech Therapy** (Speech-Language Pathology / SLP)
- **Child’s Play Therapy** (Occupational Therapy / OT)

**Document Version:** ${docVersion}  
**Classification:** Confidential • Internal Engineering & Operational Master Specification  
**Project Lead:** ${projectLead}  
**Author:** ${docAuthor}  
**Downloadable File Locations in Workspace:**
- PDF Format: \`/docs/CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.pdf\` (and root \`/CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.pdf\`)
- Standalone HTML Format: \`/docs/CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.html\` (and root \`/CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.html\`)

---

## TABLE OF CONTENTS / MASTER INDEX

- [1.0 Executive Summary & Architectural Vision](#10-executive-summary--architectural-vision)
  - [1.1 Business Context & Problem Statement](#11-business-context--problem-statement)
  - [1.2 Core System Objectives & Strategic Goals](#12-core-system-objectives--strategic-goals)
- [2.0 Multi-Entity Governance & Clinical Disciplines](#20-multi-entity-governance--clinical-disciplines)
  - [2.1 Operating Entity & Discipline Matrix](#21-operating-entity--discipline-matrix)
  - [2.2 Licensing Boards & Healthcare Taxonomy Codes](#22-licensing-boards--healthcare-taxonomy-codes)
- [3.0 Functional Requirements Specification](#30-functional-requirements-specification)
  - [3.1 Functional Requirements Matrix (FR-1 to FR-10)](#31-functional-requirements-matrix-fr-1-to-fr-10)
- [4.0 End-to-End Operational Lifecycle Workflows](#40-end-to-end-operational-lifecycle-workflows)
  - [4.1 Step 1: Initial Clinician Onboarding Intake](#41-step-1-initial-clinician-onboarding-intake)
  - [4.2 Step 2: Provider Verification & Start Credentialing](#42-step-2-provider-verification--start-credentialing)
  - [4.3 Step 3: Payer Application Bundling & Collaborative Comments](#43-step-3-payer-application-bundling--collaborative-comments)
  - [4.4 Step 4: Post-Add Confirmation & Billing Group Linking](#44-step-4-post-add-confirmation--billing-group-linking)
  - [4.5 Post-Approval Release & Re-Credentialing Cycles](#45-post-approval-release--re-credentialing-cycles)
- [5.0 Database Architecture, Schemas & Data Models](#50-database-architecture-schemas--data-models)
  - [5.1 Entity Relationship Model Overview](#51-entity-relationship-model-overview)
  - [5.2 Master Data Dictionary](#52-master-data-dictionary)
- [6.0 User Interface Architecture & Component Design](#60-user-interface-architecture--component-design)
  - [6.1 Layout Hierarchy & Navigation Shell](#61-layout-hierarchy--navigation-shell)
  - [6.2 Anti-Slop Visual Ergonomics & Mathematical Padding](#62-anti-slop-visual-ergonomics--mathematical-padding)
- [7.0 Business Logic, Calculations & Automation Engine](#70-business-logic-calculations--automation-engine)
  - [7.1 Aging Bucketing & Time-in-Stage Algorithms](#71-aging-bucketing--time-in-stage-algorithms)
  - [7.2 CAQH ProView 120-Day Re-Attestation Countdown Engine](#72-caqh-proview-120-day-re-attestation-countdown-engine)
  - [7.3 Medi-Cal PAVE Portal Stage Tracking](#73-medi-cal-pave-portal-stage-tracking)
- [8.0 Reporting, Analytics & Power BI Integration](#80-reporting-analytics--power-bi-integration)
  - [8.1 Section 5.11.6 Weekly Operational Report (7 Core Metrics)](#81-section-5116-weekly-operational-report-7-core-metrics)
  - [8.2 Section 5.11.7 Monthly Credentialing Report (10 Strategic Sections)](#82-section-5117-monthly-credentialing-report-10-strategic-sections)
  - [8.3 Power BI Star-Schema DirectQuery Payloads](#83-power-bi-star-schema-directquery-payloads)
- [9.0 Security, Authentication & Access Control](#90-security-authentication--access-control)
  - [9.1 Role-Based Access Control (RBAC) Matrix](#91-role-based-access-control-rbac-matrix)
  - [9.2 Hardened Firestore Security Rules](#92-hardened-firestore-security-rules)
  - [9.3 HIPAA & PII Data Protection Standards](#93-hipaa--pii-data-protection-standards)
- [10.0 Non-Functional & Operational Requirements](#100-non-functional--operational-requirements)
  - [10.1 System Performance, Latency & Concurrency SLAs](#101-system-performance-latency--concurrency-slas)
  - [10.2 Availability, Backup & Disaster Recovery (RPO/RTO)](#102-availability-backup--disaster-recovery-rport)
- [11.0 Implementation Roadmap & Integration Blueprint](#110-implementation-roadmap--integration-blueprint)
  - [11.1 Phase 1 Status (Production Ready)](#111-phase-1-status-production-ready)
  - [11.2 Phase 2, 3 & 4 Strategic Roadmap](#112-phase-2-3--4-strategic-roadmap)
- [12.0 Master Verification Traceability Matrix & Sign-Off](#120-master-verification-traceability-matrix--sign-off)

---

## 1.0 Executive Summary & Architectural Vision

### 1.1 Business Context & Problem Statement
In multi-entity pediatric therapy practices, clinician onboarding is constrained by complex payer credentialing and provider linking regulations. A clinician cannot independently bill health insurance plans until two distinct milestones are achieved:
1. **Individual Payer Credentialing Committee Approval:** Verification of education, primary board certifications, state medical/professional licenses, malpractice insurance, and active CAQH ProView profiles.
2. **Facility Group Linking:** Affiliation of the clinician's individual Type 1 NPI to the organization's Type 2 group NPI, billing Tax Identification Number (TIN), and specific physical clinic location.

Prior to centralized software, operations suffered from average turnaround times exceeding 120 days, frequent claim rejections due to unlinked service locations, and expired CAQH attestations. This software delivers an automated, single-pane-of-glass solution for Ages Learning Solutions, Proficio Speech Therapy, and Child’s Play Therapy.

### 1.2 Core System Objectives & Strategic Goals
- **Accelerate Turnaround Time (TAT):** Reduce onboarding-to-billing lead times from 120+ days to under 45 days.
- **Eliminate Billing Claim Denials:** Enforce mandatory dual-verification gates preventing billing release without confirmed group linking.
- **Unified Multi-Entity Visibility:** Real-time consolidated dashboards with drill-downs for ABA, Speech, and OT.
- **Collaborative Accountability:** Immutable audit trails recording every status change, specialist note, and follow-up with user attribution.

---

## 2.0 Multi-Entity Governance & Clinical Disciplines

### 2.1 Operating Entity & Discipline Matrix

| Operating Entity | Clinical Discipline | Practitioner Roles | Regulatory Licensing Board | Healthcare Taxonomy | Primary Payer Mix |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ages Learning Solutions** | Applied Behavior Analysis (ABA) | BCBAs, BCaBAs, Clinical Directors | Behavior Analyst Certification Board (BACB) | 103K00000X / 106E00000X | Kaiser Permanente, Blue Shield CA, Optum/UHC, Aetna, Cigna, Regional Centers |
| **Proficio Speech Therapy** | Speech-Language Pathology (SLP) | SLPs, CF-SLPs, SLPAs | California SLPAHADB & ASHA (CCC-SLP) | 235Z00000X | Commercial Health Plans, Medi-Cal Managed Care, School Districts |
| **Child’s Play Therapy** | Occupational Therapy (OT) | OTR/Ls, COTAs | California Board of Occupational Therapy (CBOT) & NBCOT | 225X00000X | Commercial Plans, Medi-Cal PAVE, Regional Centers, Private Insurance |

---

## 3.0 Functional Requirements Specification

### 3.1 Functional Requirements Matrix (FR-1 to FR-10)

- **[FR-1] Multi-Step Clinician Intake:** Guided 4-step wizard: Step 1 (Demographics & Discipline), Step 2 (NPI, License, CAQH, Docs), Step 3 (Payer Bundling & Comments), Step 4 (Post-Add Summary & Group Linking). Status: **100% Implemented**.
- **[FR-2] Provider & Roster Management Engine:** Centralized directory with NPI validation, primary discipline tagging, and direct linkage to historical applications. Status: **100% Implemented**.
- **[FR-3] Multi-Payer Enrollment Tracking Pipeline:** Real-time tracking across standard stages: Intake & Preparation, Submitted, Payer Review, Approved, and Linked/Effective. Status: **100% Implemented**.
- **[FR-4] Dual-Verification Facility & Group Linking Matrix:** Grid interface mapping clinicians to physical facility locations and billing TINs. Prevents "Billing Released" status until both Payer Approval and Group Linking are verified. Status: **100% Implemented**.
- **[FR-5] Collaborative Audit Trail & Real-Time Notes:** Chronological audit logging recording all application milestones and user comments with author ID, author name, system role, and ISO timestamps. Status: **100% Implemented**.
- **[FR-6] Supporting Document Links Subtab:** Subtab supporting external cloud document URLs (State License, Board Cert, Malpractice COI, CV, PAVE proof) with category tags and expiration tracking. Status: **100% Implemented**.
- **[FR-7] Management Dashboard & Aging Analysis Engine:** 10 core operational KPIs and interactive 30/60/90/120+ day aging distribution. Status: **100% Implemented**.
- **[FR-8] Section 5.11 Specialized Oversight Views:** Dedicated executive views: 5.11.2 (By Discipline), 5.11.3 (By Payer), 5.11.4 (By Specialist), and 5.11.5 (By Location). Status: **100% Implemented**.
- **[FR-9] Section 5.11.6 Weekly & 5.11.7 Monthly Reports:** 5.11.6 Weekly Report (7 core metrics) and 5.11.7 Monthly Report (10 structured sections) with browser print formatting and CSV data export. Status: **100% Implemented**.
- **[FR-10] Power BI DirectQuery Star-Schema Model:** Normalized Fact and Dimension tables (FactApplications, DimProviders, DimPayers, DimLocations, DimDates) with REST payload format. Status: **100% Implemented**.

---

## 4.0 End-to-End Operational Lifecycle Workflows

### 4.1 Step 1: Initial Clinician Onboarding Intake
- **Field 1:** Clinician Full Name & Professional Credentials (e.g., BCBA, CCC-SLP, OTR/L).
- **Field 2:** Primary Phone Number and Professional Work Email Address.
- **Field 4:** Office Location / Service Hub Selection (San Jose, Fremont, Pleasanton, San Mateo, Sacramento).
- **Field 5:** Clinical Discipline (ABA, Speech Therapy, Occupational Therapy).
- **Sample Presets:** Pre-fill buttons to populate realistic practitioner data instantly.

### 4.2 Step 2: Provider Verification & Start Credentialing
- **Top Summary Banner:** Prominently renders Step 1 clinician name, location, and contact details.
- **Prominent Action:** Centered "Start Credentialing" button triggering the verification phase.
- **Field 3:** Individual 10-digit NPI & State Professional License Number with Expiration Date.
- **Field 6:** CAQH ProView ID and Primary Healthcare Provider Taxonomy Code.
- **Supporting Documents Subtab:** Interactive table allowing attachment and audit of external cloud URLs for State License, Board Cert, Malpractice COI, CV, and PAVE Proof.

### 4.3 Step 3: Payer Application Bundling & Collaborative Comments
- **Payer Enrollment Selection:** Multi-select grid of contracted health plans (Kaiser, Blue Shield, Optum/UHC, Aetna, Cigna, Anthem, Magellan).
- **Non-Prominent "Add Comment" Action:** Secondary button opening an inline note input field.
- **Collaborative History:** Displays chronological audit notes with author name, role, date, and timestamp.

### 4.4 Step 4: Post-Add Confirmation & Billing Group Linking
- **Atomic Backend Persistence:** Executes transaction creating linked records across \`employees\`, \`clinical_staff\`, \`providers\`, \`applications\`, \`documents\`, and \`comments\`.
- **Review Summary:** Formatted overview displaying profile, credential, and document details.
- **Prominent Provider Linking Section (+):** Dedicated linking panel with a plus sign button to establish billing TIN affiliations and facility location NPIs.

### 4.5 Post-Approval Release & Re-Credentialing Cycles
- **Billing Release Verification:** Clinicians transition to "Linked / Billing Released" only when both Payer Approval and Group Linking are confirmed.
- **Automated Clocks:** Initiates 120-day CAQH attestation countdown and 90-day license renewal alerting.

---

## 5.0 Database Architecture, Schemas & Data Models

### 5.1 Entity Relationship Model Overview
\`\`\`text
[ employees ] (HR Master Profile)
     │ (1:1 via employeeId)
     ▼
[ clinical_staff ] (Clinical Credentials & License)
     │ (1:1 via clinicalStaffId)
     ▼
[ providers ] (Active Credentialing Roster)
     │ (1:N via providerId)
     ├───► [ applications ] (Payer Applications)
     │          │ (1:N via applicationId)
     │          ├───► [ documents ] (Supporting Files)
     │          └───► [ comments ] (Collaborative Notes)
     │
     └───► [ provider_locations ] (Facility Group Linking)
\`\`\`

### 5.2 Master Data Dictionary

| Collection | Field Name | Data Type | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| **employees** | \`id\` | string | Regex: \`^[a-zA-Z0-9_-]{1,64}$\` | Primary key HR employee identifier |
| **employees** | \`email\` | string | Valid RFC 5322 email | Clinician corporate email |
| **clinical_staff** | \`employeeId\` | string | References \`employees.id\` | Foreign key linking clinical profile to HR |
| **clinical_staff** | \`npi\` | string | 10-digit numeric | Type 1 Individual NPI |
| **clinical_staff** | \`caqhId\` | string | 8-digit numeric | CAQH ProView identifier |
| **providers** | \`clinicalStaffId\` | string | References \`clinical_staff.id\` | Foreign key linking roster to staff |
| **applications** | \`providerId\` | string | References \`providers.id\` | Target clinician |
| **applications** | \`payerId\` | string | References \`payers.id\` | Target health plan |
| **applications** | \`stage\` | string | Enum (7 stages) | Lifecycle stage in pipeline |
| **applications** | \`agingDays\` | number | Integer >= 0 | Days elapsed since submission |
| **documents** | \`fileUrl\` | string | Valid URL | Cloud link to verification document |
| **comments** | \`timestamp\` | string | ISO 8601 UTC | Timestamp of audit entry |

---

## 6.0 User Interface Architecture & Component Design

### 6.1 Layout Hierarchy & Global Navigation Shell
- **Header Shell:** Brand identity, quick navigation tabs, notification center, and real-time Firestore synchronization status.
- **Anti-Slop Visual Ergonomics:** Strict adherence to 8px spatial grid, high-contrast Slate-900 typography on clean backgrounds, and elimination of wrapped button labels.
- **View Routing:** Clean view switching between Dashboard, Applications Tracker, Staff Linking, Clinical Staff, Locations, Payers, Reports, and Users/RBAC.

---

## 7.0 Business Logic, Calculations & Automation Engine

### 7.1 Aging Bucketing & Time-in-Stage Algorithms
- **0–30 Days (On Track):** Standard primary source verification window.
- **31–60 Days (In Progress):** Committee evaluation; routine specialist follow-up.
- **61–90 Days (Aging):** Exceeds commercial SLA; automated amber warning trigger.
- **91–120 Days (Critical):** Flagged as overdue; elevated in Weekly 5.11.6 escalation report.
- **120+ Days (Severe Delay):** Executive intervention required; health plan manager escalation.

### 7.2 CAQH ProView 120-Day Countdown
Automated clock tracking elapsed days since last CAQH attestation. At day 90, flags amber warning; at day 110, flags high-priority red alert to prevent credential lapse.

### 7.3 Medi-Cal PAVE Stage Tracking
Structured 4-phase tracking for Speech and OT providers: (1) Profile & NPI Link, (2) Board License Verification, (3) Agreement Signature, (4) State DHCS Approval Letter.

---

## 8.0 Reporting, Analytics & Power BI Integration

### 8.1 Section 5.11.6 Weekly Operational Report (7 Core Metrics)
1. New applications initiated
2. Applications submitted to health plans
3. Scheduled follow-ups due
4. Overdue applications (>90 days)
5. Additional documents requested by payers
6. Approvals received
7. Escalation log with resolution tracking

### 8.2 Section 5.11.7 Monthly Credentialing Report (10 Strategic Sections)
1. Provider Updates & Roster Changes
2. Payer Updates & Health Plan Policy Notices
3. Applications Submitted
4. Approvals Received
5. Billing Effective Dates Log
6. Pending Applications & In-Flight Pipeline
7. Delays & Operational Moratoriums
8. Additional Documentation Requests
9. Key Accomplishments
10. Upcoming Actions & Deliverables

### 8.3 Power BI Star-Schema DirectQuery Payloads
Normalized Fact and Dimension schema model exportable in one click for enterprise business intelligence ingestion.

---

## 9.0 Security, Authentication & Access Control

### 9.1 Role-Based Access Control (RBAC) Matrix

| System Role | Dashboard & Roster | Create/Edit Applications | Facility Linking Matrix | System Administration |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Full Access | Full Access | Full Access | Full Access |
| **Credentialing Specialist** | Full Access | Full Access | Full Access | No Access |
| **Credentialing Manager** | Full Access | Full Access | Full Access | Audit Log Inspection |
| **Read-Only Stakeholder** | View Only | No Access | No Access | No Access |

### 9.2 Hardened Firestore Security Rules
All document reads and writes validate document identifier paths using regex: \`isValidId(id)\` preventing directory traversal or path injection.

---

## 10.0 Non-Functional & Operational Requirements
- **Performance & Latency:** Client-side transitions < 50ms; database writes < 250ms.
- **Durability & Recovery:** Multi-tier storage with zero unpersisted data loss and full CSV/JSON export capability.
- **HIPAA & PII Compliance:** Encryption in transit and at rest; no unencrypted PHI/PII transmission.

---

## 11.0 Implementation Roadmap & Integration Blueprint
- **Phase 1 (Current):** 100% complete coverage for all daily credentialing, 4-step intake, facility group linking, executive dashboards, and 5.11 compliance reports.
- **Phase 2 (Q4 2026):** Direct CAQH ProView B2B Gateway & Outbound Automated Payer Follow-up Bots.
- **Phase 3 (2027):** Headless Medi-Cal PAVE RPA Submission Bot.

---

## 12.0 Master Verification Traceability Matrix & Sign-Off

| Requirement ID | Module / Feature | Validation Verification Criteria | Sign-Off Result |
| :--- | :--- | :--- | :--- |
| **FR-1** | 4-Step Intake Wizard | Steps 1-4 fields, sample presets, state persistence | **Verified / Pass** |
| **FR-2** | Provider Roster Engine | NPI validation, discipline categorization | **Verified / Pass** |
| **FR-3** | Payer Tracking Pipeline | 7 lifecycle stages, aging calculations, milestones | **Verified / Pass** |
| **FR-4** | Group Linking Matrix | Dual verification before billing release | **Verified / Pass** |
| **FR-5** | Collaborative Audit Trail | Author name, author ID, system role, ISO timestamp | **Verified / Pass** |
| **FR-6** | Document Links Subtab | External cloud URL link, category, expiry date | **Verified / Pass** |
| **FR-7** | Executive Dashboard | 10 KPIs, 30-120+ day aging, overdue queue | **Verified / Pass** |
| **FR-8** | 5.11 Specialized Views | Discipline, Payer, Specialist, Location views | **Verified / Pass** |
| **FR-9** | Weekly & Monthly Reports | 5.11.6 Weekly 7 metrics, 5.11.7 Monthly 10 sections | **Verified / Pass** |
| **FR-10** | Power BI DirectQuery | Star-schema Fact/Dimension payload generator | **Verified / Pass** |
`;

  fs.writeFileSync(mdPathDocs, mdContent);
  fs.writeFileSync(mdPathRoot, mdContent);
  console.log('Successfully generated Markdown documents at:');
  console.log(' - ' + mdPathDocs);
  console.log(' - ' + mdPathRoot);
}

generateMarkdown();
