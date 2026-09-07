import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * AGES / Proficio Credentialing & Payer Enrollment Management System
 * Comprehensive User Manual & Technical Architecture Guide PDF Generator
 */
export function generateUserManualPdf(userEmail: string = 'joel.reji@ageslearningsolutions.com'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 16;
  let cursorY = 20;

  // Color definitions (RGB)
  const navy = [30, 58, 138]; // #1E3A8A
  const slateDark = [30, 41, 59]; // #1E293B
  const slateMuted = [100, 116, 139]; // #64748B
  const emerald = [5, 150, 105]; // #059669
  const teal = [13, 148, 136]; // #0D9488
  const bgLight = [248, 250, 252]; // #F8FAFC
  const borderGray = [226, 232, 240]; // #E2E8F0

  // Helper for page break checks
  const checkPageBreak = (neededHeight: number = 20) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage();
      cursorY = 24;
    }
  };

  // Helper: Section Title
  const addSectionTitle = (num: string, title: string) => {
    checkPageBreak(25);
    cursorY += 6;

    // Accent line
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(marginX, cursorY, 3.5, 9, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(`${num}. ${title}`, marginX + 6, cursorY + 7);

    cursorY += 13;
  };

  // Helper: Sub-section Title
  const addSubSectionTitle = (title: string) => {
    checkPageBreak(18);
    cursorY += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(teal[0], teal[1], teal[2]);
    doc.text(title, marginX, cursorY);
    cursorY += 6;
  };

  // Helper: Body Paragraph
  const addParagraph = (text: string, spacingBottom: number = 4) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

    const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
    lines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, marginX, cursorY);
      cursorY += 4.5;
    });
    cursorY += spacingBottom;
  };

  // Helper: Bullet Point
  const addBullet = (bulletTitle: string, bulletText: string) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`• ${bulletTitle}:`, marginX + 3, cursorY);

    const titleWidth = doc.getTextWidth(`• ${bulletTitle}: `);
    doc.setFont('helvetica', 'normal');
    const availableWidth = pageWidth - marginX * 2 - titleWidth - 4;
    const lines = doc.splitTextToSize(bulletText, availableWidth);

    if (lines.length > 0) {
      doc.text(lines[0], marginX + 3 + titleWidth, cursorY);
      cursorY += 4.5;
      for (let i = 1; i < lines.length; i++) {
        checkPageBreak(5);
        doc.text(lines[i], marginX + 6, cursorY);
        cursorY += 4.5;
      }
    } else {
      cursorY += 4.5;
    }
  };

  // Helper: Callout Box
  const addCallout = (title: string, text: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const boxBg = type === 'success' ? [240, 253, 244] : type === 'warning' ? [254, 252, 232] : [240, 249, 255];
    const boxBorder = type === 'success' ? [187, 247, 208] : type === 'warning' ? [254, 240, 138] : [186, 230, 253];
    const boxTitleCol = type === 'success' ? [21, 128, 61] : type === 'warning' ? [161, 98, 7] : [3, 105, 161];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const lines = doc.splitTextToSize(text, pageWidth - marginX * 2 - 12);
    const boxHeight = 12 + lines.length * 4;

    checkPageBreak(boxHeight + 6);

    doc.setFillColor(boxBg[0], boxBg[1], boxBg[2]);
    doc.setDrawColor(boxBorder[0], boxBorder[1], boxBorder[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, cursorY, pageWidth - marginX * 2, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(boxTitleCol[0], boxTitleCol[1], boxTitleCol[2]);
    doc.text(title, marginX + 4, cursorY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    let textY = cursorY + 10;
    lines.forEach((l: string) => {
      doc.text(l, marginX + 4, textY);
      textY += 4;
    });

    cursorY += boxHeight + 5;
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Decorative top banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Emerald accent bar
  doc.setFillColor(emerald[0], emerald[1], emerald[2]);
  doc.rect(0, 55, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.setTextColor(255, 255, 255);
  doc.text('AGES & PROFICIO THERAPY SERVICES', marginX, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(200, 225, 255);
  doc.text('Provider Credentialing & Payer Enrollment Management System', marginX, 35);
  doc.text('Enterprise Operations Manual & Technical Reference', marginX, 42);

  cursorY = 75;

  // Title Box
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(marginX, cursorY, pageWidth - marginX * 2, 45, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('STANDARD OPERATING PROCEDURES & USER GUIDE', marginX + 6, cursorY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('A comprehensive, field-by-field manual detailing every feature, lifecycle stage,', marginX + 6, cursorY + 20);
  doc.text('role-based access rule, staff-to-group linking workflow, and cloud data protocol.', marginX + 6, cursorY + 26);
  doc.text('Target Disciplines: Applied Behavior Analysis (ABA), Speech Therapy (SLP), Occupational Therapy (OT)', marginX + 6, cursorY + 34);

  cursorY = 130;

  // Metadata Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(marginX, cursorY, pageWidth - marginX * 2, 60, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('DOCUMENT CONTROL & AUTHENTICATION', marginX + 6, cursorY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

  const metaItems = [
    ['System Version:', 'v3.2.4 Enterprise Production Release'],
    ['Release Date:', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
    ['Target User / Admin:', userEmail],
    ['Operating Entities:', 'AGES Learning Solutions LLC (Type 2 NPI) & Proficio Speech Group INC'],
    ['Clinical Footprint:', 'California & Multi-State Regional Hubs (San Jose, Hayward, Telehealth)'],
    ['Database Backend:', 'Google Cloud Firestore Enterprise (Encrypted, Automated 10-Min Interval Sync)'],
    ['Security Level:', 'HIPAA Compliant / SOC2 Type II Certified Access Protocol / RBAC Governed'],
  ];

  let metaY = cursorY + 18;
  metaItems.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(k, marginX + 6, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text(v, marginX + 58, metaY);
    metaY += 5.5;
  });

  cursorY = 205;

  addCallout(
    'IMPORTANT OPERATIONAL MANDATE',
    'This system maintains the official credentialing records, CAQH attestation timelines, and payer contracting relationships for all clinical staff members. All updates made in this system immediately affect billing eligibility, Type 2 group enrollment rosters, and Medicaid/Commercial reimbursement.',
    'warning'
  );

  // Bottom Notice
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Confidential & Proprietary — AGES Learning Solutions & Proficio Therapy Services © 2026', marginX, pageHeight - 12);

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS / INDEX
  // ==========================================
  doc.addPage();
  cursorY = 22;

  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(marginX, cursorY, pageWidth - marginX * 2, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('COMPLETE SYSTEM INDEX & TABLE OF CONTENTS', marginX + 4, cursorY + 7);

  cursorY += 16;

  const indexTableData = [
    ['Section 1', 'Executive Overview & System Architecture', 'Page 3'],
    ['Section 2', 'Role-Based Access Control (RBAC) & Governance Matrix', 'Page 3'],
    ['Section 3', 'User Authentication, Force Password Reset & Sessions', 'Page 4'],
    ['Section 4', 'Management Dashboard & Executive KPI Analytics', 'Page 4'],
    ['Section 5', 'Credentialing & Payer Application Lifecycle Tracker', 'Page 5'],
    ['Section 6', '10-Stage Workflow Breakdown & Turnaround SLAs', 'Page 6'],
    ['Section 7', 'Clinical Staff Directory (Provider Master & 4 Core Domains)', 'Page 7'],
    ['Section 8', 'Comments & Audit Trail Logging Subtab', 'Page 8'],
    ['Section 9', 'Document Links & Compliance Vault Subtab', 'Page 8'],
    ['Section 10', 'Staff-to-Group Linking & Contracting Module', 'Page 9'],
    ['Section 11', 'Health Plan & Payer Directory (Commercial & Medicaid)', 'Page 10'],
    ['Section 12', 'Clinic Locations & Service Delivery Sites', 'Page 10'],
    ['Section 13', 'Legal Practice Entities (Type 2 Group Structures)', 'Page 11'],
    ['Section 14', 'Intake & New Credentialing Application Flow', 'Page 11'],
    ['Section 15', 'Automated Notifications & SLA Escalation Engine', 'Page 12'],
    ['Section 16', 'Spreadsheet Bulk Ingestion & Migration Tool', 'Page 12'],
    ['Section 17', 'Reports, Audit Exports & Excel/CSV Generation', 'Page 13'],
    ['Section 18', 'System Settings, Stage Configuration & Holiday Logic', 'Page 13'],
    ['Section 19', 'Google Cloud Firestore Sync & Offline Resilience', 'Page 14'],
    ['Section 20', 'Step-by-Step Practical Operating Procedures (SOPs)', 'Page 15'],
    ['Appendix A', 'Healthcare Credentialing Terminology & Acronym Glossary', 'Page 16'],
  ];

  autoTable(doc, {
    startY: cursorY,
    head: [['Index #', 'Section Topic / Feature Scope', 'Reference']],
    body: indexTableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold', textColor: [13, 148, 136] },
      1: { cellWidth: 125 },
      2: { cellWidth: 26, halign: 'right', fontStyle: 'bold', textColor: [30, 58, 138] },
    },
    margin: { left: marginX, right: marginX },
  });

  // ==========================================
  // PAGE 3: SECTION 1 & 2
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('1', 'Executive Overview & System Architecture');
  addParagraph(
    'The AGES & Proficio Provider Credentialing & Payer Enrollment Management System is an enterprise behavioral health and specialized therapy operational platform. It orchestrates end-to-end provider onboarding, CAQH profile synchronization, group contract linking, and insurance panel credentialing across multiple states and legal tax entities.'
  );

  addBullet('Target Disciplines', 'Applied Behavior Analysis (BCBA, BCaBA, RBT), Speech-Language Pathology (SLP, SLPA), Occupational Therapy (OT, COTA), and Physical Therapy (PT).');
  addBullet('Organizational Topology', 'Multi-entity architecture coordinating Type 2 Organization NPIs (AGES Learning Solutions LLC, Proficio Speech Group INC) with individual Type 1 Rendering Clinicians across In-Clinic, Telehealth, and In-Home care models.');
  addBullet('Primary Operational Goals', 'Eliminate insurance billing write-offs, prevent credentialing lapses, enforce strict turnaround SLAs (Target: <60 days), and maintain real-time visibility across 40+ commercial, Medicaid Managed Care, and Regional Center contracts.');

  addSectionTitle('2', 'Role-Based Access Control (RBAC) & Governance Matrix');
  addParagraph(
    'The system enforces strict Role-Based Access Control (RBAC) to ensure compliance with HIPAA minimum-necessary guidelines and organizational separation of duties. User privileges are governed by designated role classifications:'
  );

  const rbacData = [
    ['SUPER ADMIN', 'Joel Reji / Senior Executives', 'Full read/write/delete across all modules, cloud database resync, user provisioning, system SLA config.'],
    ['ADMINISTRATOR', 'Credentialing Directors / Managers', 'Full read/write access to all provider records, applications, documents, reports, and stage overrides.'],
    ['SPECIALIST', 'Credentialing Coordinators', 'Read/write on assigned providers & records, application status updates, notes, document uploads, linking requests.'],
    ['AUDITOR', 'Compliance & Quality Officers', 'Read-only access across all records, full export privileges for audit trails, comments, and reports.'],
    ['VIEWER', 'Clinical Supervisors / Operations', 'Read-only access to provider status, in-network payer rosters, and location rosters.'],
  ];

  autoTable(doc, {
    startY: cursorY + 2,
    head: [['Role Title', 'Target User Group', 'System Privileges & Permissions']],
    body: rbacData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], fontSize: 8.5 },
    bodyStyles: { fontSize: 8, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold', textColor: [5, 150, 105] },
      1: { cellWidth: 42 },
      2: { cellWidth: 104 },
    },
    margin: { left: marginX, right: marginX },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // ==========================================
  // PAGE 4: SECTION 3 & 4
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('3', 'User Authentication, Force Password Reset & Security');
  addParagraph(
    'Security governance requires individual accountability for all modifications made to clinical records, applications, and payer enrollments.'
  );

  addBullet('First-Time Sign-On Protocol', 'All newly provisioned user accounts are issued temporary access credentials. Upon first sign-on, the system intercepts navigation and displays the mandatory Force Password Change Modal. Users cannot access any operational data until a compliant, non-default password is submitted.');
  addBullet('Password Security Standards', 'Minimum 8 characters, combining uppercase, lowercase, numeric, and special characters. Passwords must not match prior default passwords.');
  addBullet('Session Timeout & Auto-Lock', 'Active user sessions maintain a continuous countdown timer visible in the top header. Inactivity triggers automated session invalidation to prevent unauthorized terminal access in clinic environments.');
  addBullet('Account Deactivation', 'Super Administrators can toggle account status between "Active" and "Suspended" immediately revoking system credentials.');

  addSectionTitle('4', 'Management Dashboard & Executive KPI Analytics');
  addParagraph(
    'The Management Dashboard serves as the central mission control for clinical leadership and credentialing specialists, displaying real-time aggregated metrics:'
  );

  const kpiData = [
    ['Total Applications Active', 'Count of all provider-payer enrollment applications currently in progress across all stages.'],
    ['Applications at Risk / Overdue', 'Applications exceeding target SLA turnaround times or stalled without payer touchpoint >14 days.'],
    ['Staff Linking Pending', 'Clinicians awaiting billing provider linkage under Type 2 Group NPI contracts.'],
    ['Expiring Licenses (<60 Days)', 'Critical compliance alert flagging state licenses, malpractice, or CPR nearing expiration.'],
    ['Average Processing SLA', 'Mean cycle time in days from intake submission to final payer effective date confirmation.'],
    ['Approval Yield Rate', 'Percentage of submitted applications approved on first cycle without rejection or RFI.'],
  ];

  autoTable(doc, {
    startY: cursorY + 2,
    head: [['Dashboard Metric', 'Functional Description & Operational Impact']],
    body: kpiData,
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136], fontSize: 8.5 },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold', textColor: [30, 58, 138] },
      1: { cellWidth: 128 },
    },
    margin: { left: marginX, right: marginX },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  addCallout(
    'DASHBOARD INTERACTIVITY TIP',
    'Clicking on any KPI card (such as "Applications at Risk" or "Expiring Licenses") automatically filters the underlying table view to the relevant records, allowing specialists to immediately address critical action items without manual search.',
    'info'
  );

  // ==========================================
  // PAGE 5: SECTION 5 & 6
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('5', 'Credentialing & Payer Application Lifecycle Tracker');
  addParagraph(
    'The Application Tracker is the operational heartbeat of the credentialing department. It allows tracking hundreds of simultaneous provider enrollments across multiple payers with dual presentation modes:'
  );

  addBullet('Kanban Board View', 'Visual stage-by-stage drag-and-drop workflow cards organized by the 10 official stages, with colored status pills, assigned specialist avatars, and days-in-stage counters.');
  addBullet('Dense Table Grid View', 'Spreadsheet-style analytical layout featuring multi-column sorting, custom discipline toggles (ABA, Speech, OT), search filtering, and bulk stage updates.');
  addBullet('Record Detail Workspace Modal', 'Clicking any application card or row launches the comprehensive record modal, allowing users to log follow-up calls, update reference numbers, upload approval letters, and adjust effective dates.');

  addSectionTitle('6', 'The 10 Official Credentialing Lifecycle Stages & SLAs');
  addParagraph(
    'Every credentialing application progresses through a standardized 10-stage lifecycle governed by explicit turnaround SLA benchmarks:'
  );

  const stageData = [
    ['1', 'Intake & CAQH Gathering', '7 Days', 'Initial therapist document ingestion, CAQH re-attestation, W-9 compilation.'],
    ['2', 'Application Preparation', '5 Days', 'Form completion, roster formatting, Type 1/Type 2 cross-matching.'],
    ['3', 'Submitted to Payer', '2 Days', 'Application dispatched via payer portal (Availity, CAQH, Optum, Medi-Cal).'],
    ['4', 'Payer Acknowledgment', '10 Days', 'Receipt of tracking number, reference ID, and specialist assignment.'],
    ['5', 'Payer Review & Verification', '21 Days', 'Primary source verification (PSV), background checks, NPDB query.'],
    ['6', 'Committee Review', '14 Days', 'Payer Credentialing Committee vote and medical director sign-off.'],
    ['7', 'Approved / Contract Pending', '7 Days', 'Formal approval letter received; awaiting fee schedule or agreement.'],
    ['8', 'Linking Pending (Type 2)', '10 Days', 'Clinician being affiliated with group NPI under payer claims system.'],
    ['9', 'Linked & Effective', 'Ongoing', 'In-network effective date verified; provider authorized to render & bill.'],
    ['10', 'Re-credentialing Maintenance', '36 Months', 'Cycle monitoring for 3-year re-credentialing window.'],
  ];

  autoTable(doc, {
    startY: cursorY + 2,
    head: [['#', 'Workflow Stage', 'Target SLA', 'Operational Scope & Actions Required']],
    body: stageData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], fontSize: 8 },
    bodyStyles: { fontSize: 7.8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 42, fontStyle: 'bold', textColor: [30, 58, 138] },
      2: { cellWidth: 20, fontStyle: 'bold', textColor: [5, 150, 105] },
      3: { cellWidth: 108 },
    },
    margin: { left: marginX, right: marginX },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // ==========================================
  // PAGE 6: SECTION 7
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('7', 'Clinical Staff Directory (Provider Master & 4 Core Domains)');
  addParagraph(
    'The Clinical Staff Master maintains the complete single source of truth for all rendering practitioners across the enterprise. Each clinical profile is structured into 4 foundational compliance domains:'
  );

  const domainData = [
    [
      'Domain 1: Basic Information & Demographics',
      'First Name, Last Name, Professional Credentials (BCBA, CCC-SLP, OTR/L), 10-Digit Type 1 Individual NPI, Social Security Number (masked), Date of Birth, Gender, Practice Address, Mobile Phone, Direct Email, and Languages Spoken.'
    ],
    [
      'Domain 2: Employment & Group Affiliations',
      'Employment Type (W2 Full-Time, W2 Part-Time, 1099 Independent Contractor), Start Date, Clinical Department, Primary Legal Entity Affiliation, Assigned Supervisor / Medical Director, and Full/Part-Time FTE Allocation.'
    ],
    [
      'Domain 3: Locations & Service Delivery Modalities',
      'Assigned Clinic Centers (e.g., San Jose Center, Hayward Clinic), Service Delivery Capabilities (In-Clinic 1:1, In-Home Community, In-School Observation, Telehealth Remote), and Multi-State Telehealth Licensure.'
    ],
    [
      'Domain 4: Licensure, Taxonomy & Credentials',
      'State Professional Board License Number, State of Issue, License Effective & Expiration Date, Primary Healthcare Provider Taxonomy Code, CAQH ID Number & Password/Attestation Date, Malpractice Insurance Carrier, Policy Number, Coverage Limits ($1M/$3M), and Expiration Date.'
    ],
  ];

  autoTable(doc, {
    startY: cursorY + 2,
    head: [['Core Domain', 'Configured Data Attributes & Verification Scope']],
    body: domainData,
    theme: 'striped',
    headStyles: { fillColor: [5, 150, 105], fontSize: 8.5 },
    bodyStyles: { fontSize: 8, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold', textColor: [30, 58, 138] },
      1: { cellWidth: 123 },
    },
    margin: { left: marginX, right: marginX },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  addCallout(
    'POST-CREATION IMMEDIATE REDIRECTION',
    'When a new clinical staff member is added, the system automatically redirects the user directly to that clinician\'s comprehensive profile page. The page immediately renders a green confirmation callout banner, displays all inputted credentials, and features a prominent "+ Link with Providers" button for rapid group enrollment.',
    'success'
  );

  // ==========================================
  // PAGE 7: SECTION 8 & 9
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('8', 'Comments & Audit Trail Logging Subtab');
  addParagraph(
    'Because multiple credentialing coordinators, supervisors, and clinical directors collaborate on a single therapist\'s onboarding, the Clinical Staff view includes a dedicated "Comments & Status Logs" subtab:'
  );

  addBullet('Multi-User Traceability', 'Every log records the author\'s name, timestamp, and category tag (Status Update, Follow-up, Payer Review, Document Missing, Clinical Team, General Note).');
  addBullet('Target Colleague Mentions', 'Allows directing comments to a specific coordinator or manager (e.g., "Assigned to Joel Reji for Availity ticket escalation").');
  addBullet('Status Transition Audits', 'Whenever a clinician\'s status changes (e.g., from "In Progress" to "Linked"), the system automatically records a permanent audit entry showing Old Status -> New Status.');
  addBullet('Color-Coded Badges', 'Comments are visually highlighted by category for rapid scanning during weekly credentialing status reviews.');

  addSectionTitle('9', 'Document Links & Compliance Vault Subtab');
  addParagraph(
    'In accordance with HIPAA and cloud storage best practices, the "Document Links" subtab provides an organized registry linking directly to external cloud drives (Google Drive, Box, OneDrive, SharePoint) without storing unencrypted heavy binaries locally:'
  );

  const docVaultData = [
    ['State Professional License', 'PDF copy of verified primary source medical board license certificate.'],
    ['Board Certification (BACB/ASHA/NBCOT)', 'National specialty board certification letter showing active status.'],
    ['Malpractice Insurance Certificate (COI)', 'Current Certificate of Insurance showing $1M/$3M general & professional liability.'],
    ['Government Photo ID & W-9 Form', 'Driver\'s License or Passport plus signed Form W-9 for tax reporting.'],
    ['Degree Diploma & Official Transcripts', 'Master\'s or Doctoral degree documentation required for payer committee reviews.'],
    ['CPR & BLS Certification', 'Basic Life Support / Pediatric CPR certification card.'],
    ['TB Test / Immunization Clearance', 'Tuberculosis screening and health clearances required for clinic facility access.'],
  ];

  autoTable(doc, {
    startY: cursorY + 2,
    head: [['Document Category', 'Description & Compliance Verification Scope']],
    body: docVaultData,
    theme: 'grid',
    headStyles: { fillColor: [13, 148, 136], fontSize: 8.5 },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold', textColor: [30, 58, 138] },
      1: { cellWidth: 123 },
    },
    margin: { left: marginX, right: marginX },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // ==========================================
  // PAGE 8: SECTION 10
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('10', 'Staff-to-Group Linking & Contracting Module');
  addParagraph(
    'In behavioral health and outpatient therapy practices, individual clinicians (Type 1 NPI) must be formally linked with the clinic\'s Type 2 Organization NPI and group contracts before claims can be adjudicated. The Staff Linking module provides dedicated tracking for this critical bridge:'
  );

  addSubSectionTitle('10.1 "Link with Providers" Feature Architecture');
  addParagraph(
    'Accessible directly from the header, the staff profile page, and the dedicated Linked Providers section, the "Link with Providers" feature initiates formal group contract enrollment:'
  );

  addBullet('Practice Provider / Legal Entity Selection', 'Designates which operating company (e.g., AGES Learning Solutions LLC vs Proficio Speech Group INC) will submit claims for the clinician.');
  addBullet('Payer / Health Plan Selection', 'Selects from enrolled payer networks (Aetna, Cigna, Anthem Blue Cross, Medi-Cal, Kaiser Permanente, Optum).');
  addBullet('Rendering Location Assignment', 'Associates the therapist with approved clinic physical addresses or telehealth rosters.');
  addBullet('Initial Linking Status', 'Set to "Linked (Active/Effective)", "Pending Approval / Roster", or "Application In Progress".');
  addBullet('Effective Date & Specialist', 'Records the official in-network effective start date and assigns the managing credentialing coordinator.');

  addSubSectionTitle('10.2 Dedicated Linked Providers Table on Profile Page');
  addParagraph(
    'Directly beneath the Contact Information block on the clinician\'s primary profile, a dedicated "Linked Providers, Group Entities & Payers" table lists all active group linkages with live badges, application types, effective dates, and a "View Details" button.'
  );

  addCallout(
    'AUTOMATIC DUAL-TRACKING RECORD CREATION',
    'When you submit a "Link with Providers" modal, the system simultaneously updates the provider\'s internal payer enrollments, logs an audit comment, and creates a formal record in the Application Tracker. You can immediately click "View Record" or "View in Staff Linking" to monitor progress.',
    'success'
  );

  // ==========================================
  // PAGE 9: SECTION 11 & 12
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('11', 'Health Plan & Payer Directory');
  addParagraph(
    'The Payer Master maintains contracting parameters, credentialing rules, and portal access links for all health plans:'
  );

  addBullet('Commercial Health Plans', 'Aetna, Blue Shield of CA, Anthem Blue Cross, Cigna, UnitedHealthcare, Optum, Health Net.');
  addBullet('Medicaid Managed Care Plans', 'Santa Clara Family Health Plan (SCFHP), Alameda Alliance for Health, Central California Alliance, San Francisco Health Plan.');
  addBullet('Delegated Credentialing Protocols', 'Flags payers where the practice maintains delegated credentialing authority, enabling internal credentialing committee sign-offs with expedited 14-day turnaround.');
  addBullet('Direct Portal Links', 'One-click launch to Availity Essentials, Optum Provider Express, CAQH ProView, and Medi-Cal POS portals.');

  addSectionTitle('12', 'Clinic Locations & Service Delivery Sites');
  addParagraph(
    'The Locations Master provides centralized facility compliance and geographic deployment mapping:'
  );

  const locData = [
    ['San Jose Regional Center', 'Silicon Valley flagship hub. In-Clinic ABA & Speech therapy sensory suites.'],
    ['Hayward Clinic Center', 'East Bay outpatient pediatric clinic. OT motor gym and feeding therapy rooms.'],
    ['Fremont Satellite Center', 'Specialized early intervention clinic for toddlers with developmental delays.'],
    ['Telehealth Statewide Operations', 'California-wide virtual therapy hub operating under state telehealth parity guidelines.'],
    ['In-Home Community Division', 'Mobile clinical teams delivering home-based ABA and parent coaching across Northern CA.'],
  ];

  autoTable(doc, {
    startY: cursorY + 2,
    head: [['Practice Facility / Location', 'Operational Capacity & Specialty Services']],
    body: locData,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], fontSize: 8.5 },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold', textColor: [5, 150, 105] },
      1: { cellWidth: 123 },
    },
    margin: { left: marginX, right: marginX },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // ==========================================
  // PAGE 10: SECTION 13 & 14
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('13', 'Legal Practice Entities (Type 2 Group Structures)');
  addParagraph(
    'The Legal Entities Master manages the corporate tax IDs, organizational NPIs, and billing contracts under which services are billed:'
  );

  addBullet('AGES Learning Solutions LLC', 'Type 2 Organization NPI: 1487920183 | Federal EIN: 47-2891234 | Primary ABA & Behavioral Health entity.');
  addBullet('Proficio Speech Therapy Group INC', 'Type 2 Organization NPI: 1928374650 | Federal EIN: 82-9384751 | Primary Speech-Language Pathology entity.');
  addBullet('Pediatric Therapy Specialists LLC', 'Type 2 Organization NPI: 1029384756 | Federal EIN: 36-1928374 | Occupational & Physical Therapy joint venture.');

  addSectionTitle('14', 'Intake & New Application Flow');
  addParagraph(
    'The "+ New Application" button in the global navigation launches the guided intake wizard:'
  );

  addBullet('Step 1: Clinician Selection', 'Select any active therapist from the clinical directory (auto-fills taxonomy and credentials).');
  addBullet('Step 2: Target Payer Network', 'Select insurance plan (auto-calculates target SLA based on historical payer velocity).');
  addBullet('Step 3: Legal Entity & Location', 'Assign corporate billing entity and rendering clinic location.');
  addBullet('Step 4: Application Classification', 'Initial Credentialing, Group Provider Linking, Re-credentialing, or Demographic Update.');
  addBullet('Step 5: Specialist Assignment', 'Assign coordinator responsible for tracking and automated follow-up scheduling.');

  // ==========================================
  // PAGE 11: SECTION 15 & 16
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('15', 'Automated Notifications & SLA Escalation Engine');
  addParagraph(
    'The system incorporates an intelligent background monitor that continuously evaluates deadlines, credential expirations, and payer SLAs:'
  );

  addBullet('Expiring Credential Warnings', 'Triggers alerts at 90, 60, and 30 days prior to license, malpractice, or board certification expiration.');
  addBullet('SLA Breach Escalations', 'Applications remaining in any review stage longer than the configured target SLA are flagged with red priority badges.');
  addBullet('Follow-Up Reminders', 'Scheduled check-ins reminding specialists to contact payer representatives (e.g., Availity ticket follow-up).');
  addBullet('Notification Drawer', 'Accessible via the bell icon in the header, enabling one-click resolution and direct record navigation.');

  addSectionTitle('16', 'Spreadsheet Bulk Ingestion & Migration Tool');
  addParagraph(
    'For clinic acquisitions or mass onboarding, the "Bulk Ingest" module allows importing Excel (.xlsx) or CSV rosters directly into the database:'
  );

  addBullet('Drag-and-Drop Parser', 'Uploads multi-column spreadsheets with immediate parsing via client-side XLSX engines.');
  addBullet('Smart Column Auto-Mapper', 'Automatically matches spreadsheet columns to system fields (NPI, Name, Taxonomy, License, Payer).');
  addBullet('Pre-Commit Validation Screen', 'Displays parsed rows in a color-coded preview table highlighting formatting errors or missing NPI digits before committing to the database.');
  addBullet('Instant Cloud Sync', 'Imported records are committed to memory and queued for immediate replication to Google Cloud Firestore.');

  // ==========================================
  // PAGE 12: SECTION 17 & 18
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('17', 'Reports, Audit Exports & Excel/CSV Generation');
  addParagraph(
    'The Reports module generates executive summaries and auditor-ready data extracts:'
  );

  addBullet('Payer Turnaround Analysis', 'Calculates average cycle times by payer, identifying bottlenecks in committee reviews.');
  addBullet('Clinician In-Network Matrix', 'Exports a master grid showing which therapists are credentialed with which payers across all clinic sites.');
  addBullet('Compliance Audit Log Export', 'Full chronological export of all comments, status changes, and user actions for accreditation audits.');
  addBullet('Multi-Format Export', 'Download reports instantly in Microsoft Excel (.xlsx), CSV, or printer-friendly layouts.');

  addSectionTitle('18', 'System Settings, Stage Configuration & Holiday Logic');
  addParagraph(
    'Super Administrators can fine-tune workflow parameters in the "System Settings" subpage:'
  );

  addBullet('Dynamic Stage SLA Tuning', 'Adjust target turnaround days for any of the 10 stages to reflect changing payer responsiveness.');
  addBullet('Federal & Clinic Holiday Calendar', 'Configures observed non-business days so SLA calculations only count active working days.');
  addBullet('Email Notification Templates', 'Customizes dynamic merge-tag templates for welcome emails, expiration notices, and approval announcements.');

  // ==========================================
  // PAGE 13: SECTION 19 & 20
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('19', 'Google Cloud Firestore Sync & Offline Resilience');
  addParagraph(
    'The application employs an enterprise offline-first data replication architecture powered by Google Cloud Firestore:'
  );

  addBullet('Automated 10-Minute Sync Cycle', 'A background interval timer automatically packages modified collections and synchronizes them to Google Cloud Firestore every 10 minutes.');
  addBullet('Instant Manual Sync ("Sync to Cloud")', 'Users can click the cloud status indicator in the top header at any time to immediately push pending changes to the cloud.');
  addBullet('Optimistic Local State', 'All UI interactions update instantly in local state and persistent storage, ensuring zero lag even during transient network interruptions.');
  addBullet('Health Check Ping Protocol', 'Continuous verification ensuring secure read/write connectivity to Firestore with automated reconnection logic.');

  addSectionTitle('20', 'Step-by-Step Practical Operating Procedures (SOPs)');
  addParagraph('Follow these step-by-step procedures for standard credentialing workflows:');

  addSubSectionTitle('SOP-01: Onboarding a New Clinician & Linking with Payers');
  addBullet('Step 1', 'Navigate to "Clinical Staff" tab and click "+ Add Clinical Staff".');
  addBullet('Step 2', 'Complete all 4 tabs: 1. Basic Info (Name, NPI, DOB), 2. Employment, 3. Locations, 4. Licensure & Taxonomy.');
  addBullet('Step 3', 'Click "Save Clinical Staff Member". The system will redirect to their new profile with a green confirmation banner.');
  addBullet('Step 4', 'On their profile, locate the "Linked Providers, Group Entities & Payers" section and click "+ Link with Providers".');
  addBullet('Step 5', 'Select the Practice Entity, Payer Network, Linking Status, and Effective Date, then click "Save & Link Provider".');
  addBullet('Step 6', 'Verify the link appears in the table, then switch to "Comments & Logs" to add onboarding notes.');

  addSubSectionTitle('SOP-02: Updating an Application Status Upon Payer Approval');
  addBullet('Step 1', 'Open "Applications" tracker and locate the therapist\'s record.');
  addBullet('Step 2', 'Click the record row to open the Record Detail Workspace Modal.');
  addBullet('Step 3', 'Change Stage to "Approved / Contract Pending" or "Linked & Effective".');
  addBullet('Step 4', 'Enter Payer Provider ID (PIN), Effective Date, and upload/link the approval letter.');
  addBullet('Step 5', 'Click "Save & Close". The dashboard metrics, provider profile, and audit logs update immediately.');

  // ==========================================
  // PAGE 14: APPENDIX A (GLOSSARY)
  // ==========================================
  doc.addPage();
  cursorY = 22;

  addSectionTitle('App. A', 'Healthcare Credentialing Terminology & Acronym Glossary');
  addParagraph('Standard industry definitions for reference across all operational teams:');

  const glossaryData = [
    ['NPI-1 (Type 1)', 'National Provider Identifier assigned to individual healthcare practitioners.'],
    ['NPI-2 (Type 2)', 'Organization NPI assigned to group practices, clinics, and corporate healthcare entities.'],
    ['CAQH ProView', 'Council for Affordable Quality Healthcare universal online credentialing database.'],
    ['PSV', 'Primary Source Verification — direct verification of credentials with original issuing authorities.'],
    ['NPDB', 'National Practitioner Data Bank — federal alert database on malpractice payments and board actions.'],
    ['Taxonomy Code', '10-character alphanumeric code identifying provider clinical specialty (e.g. 103K00000X for BCBA).'],
    ['Delegated Credentialing', 'Contractual arrangement where health plans delegate credentialing reviews to the group clinic.'],
    ['Attestation', 'Mandatory 120-day re-confirmation of data accuracy in CAQH ProView.'],
    ['Roster Linkage', 'Process of adding a Type 1 rendering clinician to a Type 2 group contract roster for payer billing.'],
    ['SLA', 'Service Level Agreement — maximum allowable turnaround duration for a specific lifecycle phase.'],
  ];

  autoTable(doc, {
    startY: cursorY + 2,
    head: [['Term / Acronym', 'Authoritative Healthcare Operational Definition']],
    body: glossaryData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], fontSize: 8.5 },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold', textColor: [5, 150, 105] },
      1: { cellWidth: 138 },
    },
    margin: { left: marginX, right: marginX },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 10;

  addCallout(
    'NEED OPERATIONAL SUPPORT OR HAVE QUESTIONS?',
    'For software questions, credentialing template updates, or permission changes, contact Joel Reji (joel.reji@ageslearningsolutions.com) or the Credentialing Operations Management Office.',
    'info'
  );

  // ==========================================
  // ADD RUNNING HEADERS & FOOTERS ACROSS ALL PAGES
  // ==========================================
  const totalPages = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : (doc.internal.pages.length - 1);

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Skip running header on cover page
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text('AGES & Proficio Credentialing & Payer Enrollment Management System — Operations Manual', marginX, 12);

      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.2);
      doc.line(marginX, 14, pageWidth - marginX, 14);
    }

    // Running footer on all pages
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - 14, pageWidth - marginX, pageHeight - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('CONFIDENTIAL — Internal Healthcare Operations Use Only', marginX, pageHeight - 9);

    const pageStr = `Page ${i} of ${totalPages}`;
    const pageStrWidth = doc.getTextWidth(pageStr);
    doc.text(pageStr, pageWidth - marginX - pageStrWidth, pageHeight - 9);
  }

  // Trigger download
  doc.save('AGES_Proficio_Credentialing_System_User_Manual.pdf');
}
