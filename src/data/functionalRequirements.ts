import { UserRole } from '../types';

export interface FunctionalRequirement {
  id: string; // e.g. "FR-001"
  priority: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  stakeholders: string[]; // e.g. ['Specialist', 'Manager', 'Admin', 'Operations', 'HR', 'Billing', 'Clinical', 'Finance', 'Leadership', 'Provider', 'All users']
  module: 'Auth & Access' | 'Providers' | 'Payers' | 'Entities' | 'Locations' | 'Credentialing' | 'Linking & Contracting' | 'Documents' | 'Workflows & SLAs' | 'Reports & BI' | 'Admin & System' | 'Provider Portal';
  targetTab?: string;
  features: string[];
}

export const FUNCTIONAL_REQUIREMENTS: FunctionalRequirement[] = [
  {
    id: 'FR-001',
    priority: 1,
    title: 'User Login & Access',
    description: 'Users log in with organization email and password. Role-based access (Specialist, Manager, Leadership, Admin, Operations, HR, Billing, Clinical, Finance, Provider). Reset / forgot password flow via email. Optional SSO (Google Workspace / Microsoft 365).',
    stakeholders: ['All users', 'Specialist', 'Manager', 'Leadership', 'Admin', 'Operations', 'HR', 'Billing', 'Clinical', 'Finance', 'Provider'],
    module: 'Auth & Access',
    targetTab: 'new-user',
    features: [
      'Email & Password authentication with session storage',
      '8+ Role-based access profiles with tailored navigation and permissions',
      'Password reset request workflow with security verification',
      'Google Workspace & Microsoft 365 SSO integration readiness'
    ]
  },
  {
    id: 'FR-002',
    priority: 1,
    title: 'Provider Master',
    description: 'Create, edit, deactivate providers. Capture the full provider information set (Section 5.6). Support multiple disciplines per provider (ABA / Speech / OT). Support providers linked to multiple entities and locations. Full audit trail of changes.',
    stakeholders: ['Specialist', 'Manager', 'Admin'],
    module: 'Providers',
    targetTab: 'providers',
    features: [
      'Centralized Provider Master directory with search & filters',
      'Multi-discipline support (ABA, Speech-Language, Occupational Therapy)',
      'Multi-entity and multi-location clinic affiliations per clinician',
      'CAQH, NPI, PAVE, and state license lifecycle tracking',
      'Complete field-level audit trail on every update'
    ]
  },
  {
    id: 'FR-003',
    priority: 1,
    title: 'Payer Master',
    description: 'Create, edit, deactivate payers (see Section 5.7 for the initial 20+ payer list). Capture payer name, type (commercial / Medicaid / regional), portal URL, states served, contacts. Configure payer-specific document and field requirements. Configure payer average TAT for SLA tracking. Payer list remains configurable — new payers added without a code change.',
    stakeholders: ['Manager', 'Admin'],
    module: 'Payers',
    targetTab: 'payers',
    features: [
      '20+ Pre-configured commercial, Medicaid, and regional payers',
      'Payer portal URLs, contact rosters, and submission methods',
      'Payer-specific document and data requirements matrix',
      'Configurable average TAT (e.g. 45/60/90 days) for SLA tracking',
      'Dynamic creation of new payers without code deployment'
    ]
  },
  {
    id: 'FR-004',
    priority: 1,
    title: 'Entity Master',
    description: 'Maintain a master of supported legal entities (see Section 5.8). Capture legal name, DBA, EIN, ownership / control details, W-9, insurance. Link entities to providers, locations, and payer applications. Entity list configurable to support future entities.',
    stakeholders: ['Manager', 'Admin', 'Finance'],
    module: 'Entities',
    targetTab: 'entities',
    features: [
      'Master repository of legal operating entities and DBAs',
      'EIN, Type-2 NPI, ownership and organizational disclosure tracking',
      'W-9, General Liability, and Workers Comp policy expiration dates',
      'Direct mapping to provider rosters and clinic locations'
    ]
  },
  {
    id: 'FR-005',
    priority: 1,
    title: 'Location Master',
    description: 'Maintain a master of service locations (Section 5.9). Capture address, entity, DBA, service type (in-clinic / in-home / in-school), payer applicability, effective date, lease / sublease documentation, insurance, PAVE status, location approval. Support multiple locations per entity.',
    stakeholders: ['Manager', 'Admin', 'Operations'],
    module: 'Locations',
    targetTab: 'locations',
    features: [
      'Master directory of clinic and service delivery locations',
      'Service modalities (In-Clinic, In-Home, In-School, Telehealth)',
      'Lease/sublease agreement tracking and expiration alerts',
      'Location PAVE status and payer applicability mapping'
    ]
  },
  {
    id: 'FR-006',
    priority: 1,
    title: 'Credentialing Record',
    description: 'The credentialing record grain is Provider × Payer × Entity × Location × Application Type. Capture all key dates: submitted, documents requested / received, follow-up date(s), approval, effective, expiration / revalidation, provider link date. Support both new credentialing and recredentialing. Full audit trail per record.',
    stakeholders: ['Specialist', 'Manager'],
    module: 'Credentialing',
    targetTab: 'tracker',
    features: [
      '4-way combination grain: Provider × Payer × Entity × Location',
      'Comprehensive key date timestamps (Intake, Submitted, Follow-up, Approval, Effective)',
      'Initial credentialing and periodic recredentialing workflows',
      'Full chronological timeline and immutable audit logs'
    ]
  },
  {
    id: 'FR-007',
    priority: 1,
    title: 'Application Type Handling',
    description: 'Support all application types defined in Section 5.5 (Initial credentialing, Recredentialing, Enrollment, Re-enrollment, Group addition, Provider addition, Location addition, Provider linking, Contracting, Demographic update, Taxonomy update, Entity update). Each type has a configurable required-fields and required-documents set.',
    stakeholders: ['Specialist', 'Manager', 'Admin'],
    module: 'Credentialing',
    targetTab: 'tracker',
    features: [
      '12+ Standard application types fully supported',
      'Dynamic required-fields checklist per application type',
      'Specialized document requirements per application category',
      'Dedicated handling for demographic & taxonomy updates'
    ]
  },
  {
    id: 'FR-008',
    priority: 1,
    title: 'Standardized Stage Workflow',
    description: 'Configurable, standardized stages per Section 5.4. Stage changes logged with user and timestamp. System auto-transitions (e.g., to Overdue) triggered by rules.',
    stakeholders: ['Specialist', 'Manager', 'Admin'],
    module: 'Workflows & SLAs',
    targetTab: 'tracker',
    features: [
      '15+ Standard lifecycle stages from Intake to Effective',
      'Automated rule-based stage transitions (e.g. Auto-Overdue)',
      'User-attributed stage change logging with timestamps',
      'Visual progress stepper with current stage duration counters'
    ]
  },
  {
    id: 'FR-009',
    priority: 1,
    title: 'Credentialing Checklist',
    description: 'Automated checklist per record on creation. Checklist items derived from payer × application-type requirements. System prevents transition to "Application Submitted" if required items missing.',
    stakeholders: ['Specialist', 'Manager'],
    module: 'Credentialing',
    targetTab: 'tracker',
    features: [
      'Auto-generated itemized checklist tailored to payer & discipline',
      'Validation gate blocking submission if required items incomplete',
      'One-click item completion with user stamping',
      'Real-time checklist completeness percentage indicator'
    ]
  },
  {
    id: 'FR-010',
    priority: 1,
    title: 'CAQH Tracking',
    description: 'Track CAQH ID, profile completion status, attestation date, next attestation date. Track CAQH discrepancies and correction requests with credentialing-team verification. Alert on upcoming re-attestation (configurable lead time). Document CAQH issues in provider credentialing history.',
    stakeholders: ['Specialist', 'Manager'],
    module: 'Providers',
    targetTab: 'providers',
    features: [
      'CAQH ProView ID, status (Attested, Discrepancy, Re-attestation Due)',
      '120-day re-attestation countdown clock and warning alerts',
      'Discrepancy flag and correction tracking log',
      'Integration gate requiring valid CAQH before commercial submission'
    ]
  },
  {
    id: 'FR-011',
    priority: 1,
    title: 'NPI Verification',
    description: 'Capture and validate NPI format. Record NPI verification date and outcome (NPPES lookup performed by specialist).',
    stakeholders: ['Specialist'],
    module: 'Providers',
    targetTab: 'providers',
    features: [
      '10-digit Luhn algorithm format validation for Type-1 and Type-2 NPIs',
      'NPPES registry lookup verification record & timestamp',
      'Taxonomy code alignment for ABA (103K00000X), Speech (235Z00000X), OT (225X00000X)',
      'Mismatch detection against provider legal name'
    ]
  },
  {
    id: 'FR-012',
    priority: 1,
    title: 'PAVE / Medicaid Tracking',
    description: 'Track PAVE application (group, individual provider, location addition), PAVE proof, submission date, returned application, additional documentation requested, resubmission date. Track DHCS approval and Medicaid effective date. Alert on additional documentation requests from PAVE.',
    stakeholders: ['Specialist', 'Manager'],
    module: 'Credentialing',
    targetTab: 'tracker',
    features: [
      'California PAVE enrollment tracking for Medi-Cal & DHCS',
      'Package types: Group enrollment, Individual clinician, Location addition',
      'State deficiency / additional doc request logging & resubmission tracking',
      'DHCS approval letter capture and Medicaid ID recording'
    ]
  },
  {
    id: 'FR-013',
    priority: 1,
    title: 'Payer Enrollment Tracking',
    description: 'Track commercial and regional payer enrollments across the full payer list (Section 5.7). Payer-specific data fields configurable via payer master. Track submission, follow-up, response, approval, and effective dates per payer.',
    stakeholders: ['Specialist', 'Manager'],
    module: 'Credentialing',
    targetTab: 'tracker',
    features: [
      'Commercial, Medicaid, Regional Center, and Tricare enrollment tracking',
      'Payer-specific submission methods (Availity, CAQH roster, direct portal, paper)',
      'Structured tracking of submission reference IDs and payer case numbers',
      'SLA countdown timers benchmarked against payer average TAT'
    ]
  },
  {
    id: 'FR-014',
    priority: 1,
    title: 'Provider Linking',
    description: 'Link providers to groups, entities, locations, and payers. Track linking status and link effective date separately from credentialing approval date. Report on providers approved but not yet linked.',
    stakeholders: ['Specialist', 'Manager', 'Operations', 'Billing'],
    module: 'Linking & Contracting',
    targetTab: 'linking',
    features: [
      'Dedicated Provider Linking & Group Affiliation hub',
      'Explicit separation between Credentialing Approval Date and Link Effective Date',
      '"Hold Billing" guard flags preventing claims submission before group linking',
      'Approved-not-linked backlog report for Billing & Operations coordination'
    ]
  },
  {
    id: 'FR-015',
    priority: 1,
    title: 'Document Management',
    description: 'Upload documents against provider, entity, location, or credentialing records (license, DEA, malpractice, GL, WC, W-9, CV, board certification, lease / sublease, ownership documents, provider agreements, payer-specific forms, approval letters, contract documents). Each document tracks: type, upload date, expiration date, provider, payer, location, entity, verification status, notes, responsible team member. Automatic flagging of missing, expired, expiring-soon, payer-requested, and pending-submission documents. Prevent submission when required document is missing or expired.',
    stakeholders: ['Specialist', 'Manager', 'Finance'],
    module: 'Documents',
    targetTab: 'tracker',
    features: [
      'Document repository across Provider, Entity, Location, and Application scopes',
      'Expiration tracking with proactive 180, 120, 90, 60, 30-day countdowns',
      'Automated validation checks blocking submission of expired documents',
      'Verification status (Verified, Pending, Expired, Rejected) with reviewer stamps'
    ]
  },
  {
    id: 'FR-016',
    priority: 1,
    title: 'Entity / DBA Validation',
    description: 'Before allowing submission, system validates consistency across: legal entity, DBA, group name, lease / sublease entity, payer application name, W-9, insurance documents, PAVE enrollment (Section 5.10). Discrepancies are flagged and must be resolved or overridden with justification.',
    stakeholders: ['Specialist', 'Manager', 'Finance'],
    module: 'Credentialing',
    targetTab: 'tracker',
    features: [
      'Cross-entity consistency engine (Legal Name, DBA, EIN, W-9, PAVE)',
      'Automated discrepancy flags (e.g. DBA mismatch between lease and W-9)',
      'Mandatory resolution or supervisor justification override requirement',
      'Full audit trail of validation overrides and notes'
    ]
  },
  {
    id: 'FR-017',
    priority: 1,
    title: 'Follow-up Scheduling',
    description: 'Each record supports one or multiple follow-up dates. Default cadence 7–10 business days after submission (configurable per payer). Capture: next follow-up date, last follow-up date, follow-up method, contact person, reference number, payer response, next action, escalation flag. Notes recorded against every follow-up. Ownership assigned to a credentialing specialist.',
    stakeholders: ['Specialist', 'Manager'],
    module: 'Workflows & SLAs',
    targetTab: 'tracker',
    features: [
      'Multi-entry follow-up log per application record',
      'Configurable 7–10 business-day follow-up cadence calculation',
      'Detailed capture: method (Phone, Portal, Email, Availity), contact, ref#, notes',
      'One-click supervisor escalation flag and next-action scheduling'
    ]
  },
  {
    id: 'FR-018',
    priority: 1,
    title: 'Automated Overdue Detection',
    description: 'On the scheduled follow-up date, system notifies the assigned specialist by email and in-app. If no update by the follow-up date, item auto-moves to Overdue. Overdue items highlighted in dashboards and searchable via filters.',
    stakeholders: ['Specialist', 'Manager', 'Leadership'],
    module: 'Workflows & SLAs',
    targetTab: 'tracker',
    features: [
      'Automated follow-up due date comparison engine',
      'Automatic status elevation to Overdue when follow-up window lapses',
      'Prominent red badge alerts and dedicated Overdue filter in tracker',
      'Executive dashboard overdue counters and aging analysis'
    ]
  },
  {
    id: 'FR-019',
    priority: 1,
    title: 'Escalation Emails',
    description: 'When an item becomes Overdue, escalation emails triggered to Credentialing Manager and Executive Sponsor. Reminder emails at a configurable cadence until updated. Ensures no credentialing application remains unattended.',
    stakeholders: ['Manager', 'Leadership'],
    module: 'Workflows & SLAs',
    targetTab: 'tracker',
    features: [
      'Automated supervisor escalation dispatch on SLA breach',
      'Executive sponsor alert routing for prolonged payer stalls',
      'In-app escalation banner and email notification queue',
      'Audit log entry of escalation timestamp and recipient list'
    ]
  },
  {
    id: 'FR-020',
    priority: 1,
    title: 'Notifications & Alerts',
    description: 'Automatic notifications for: new assignment, missing documents, document expiration, CAQH attestation due, PAVE action required, application submission deadline, follow-up due / overdue, additional documents requested, application rejection, approval received, effective date received, recredentialing due. Delivered by email and, where appropriate, on the in-app dashboard.',
    stakeholders: ['All users', 'Specialist', 'Manager', 'Leadership', 'Admin', 'Operations', 'HR', 'Billing', 'Clinical', 'Finance', 'Provider'],
    module: 'Workflows & SLAs',
    targetTab: 'dashboard',
    features: [
      'Real-time in-app notification bell with category filters and unread badges',
      '12 Automated notification triggers covering every milestone & risk event',
      'Quick deep-link navigation directly to affected application or provider',
      'Email simulation preview with recipient routing'
    ]
  },
  {
    id: 'FR-021',
    priority: 1,
    title: 'Search & Filters',
    description: 'Search / filter by: provider, NPI, discipline, payer, entity, location, application type, application stage, submission date, effective date, credentialing specialist, follow-up date, expiration date, overdue status. Saved filters supported.',
    stakeholders: ['All users', 'Specialist', 'Manager', 'Leadership', 'Admin', 'Operations', 'HR', 'Billing', 'Clinical', 'Finance'],
    module: 'Credentialing',
    targetTab: 'tracker',
    features: [
      'Multi-dimensional search across provider names, NPIs, and application IDs',
      '10+ facet filters (Discipline, Payer, Entity, Location, Stage, Type, Specialist)',
      'Saved custom filter presets for rapid workflow access',
      'Instant clearing and active filter pill tags'
    ]
  },
  {
    id: 'FR-022',
    priority: 1,
    title: 'Dashboards',
    description: 'Real-time dashboards (Section 5.11) covering overall, by discipline, by payer, by specialist, by location. Role-aware (Specialist / Manager / Leadership).',
    stakeholders: ['Manager', 'Leadership', 'Specialist'],
    module: 'Reports & BI',
    targetTab: 'dashboard',
    features: [
      'Executive KPI cards: Active volume, approvals, in-review, overdue, linking',
      'Discipline breakdown tabs (ABA, Speech, Occupational Therapy)',
      'Stage progression breakdown, aging buckets (<30, 31-60, 61-90, 91-120, >120d)',
      'Specialist workload distribution and turnaround efficiency metrics'
    ]
  },
  {
    id: 'FR-023',
    priority: 2,
    title: 'Reports (Weekly & Monthly)',
    description: 'Weekly report: new applications, applications submitted, follow-ups due, overdue applications, additional documents requested, approvals, escalations. Monthly credentialing report shared in the first week of each month covering the previous month; separated by discipline (ABA / Speech / OT) with a consolidated management summary. Exportable to Excel and PDF; scheduled email delivery.',
    stakeholders: ['Manager', 'Leadership'],
    module: 'Reports & BI',
    targetTab: 'reports',
    features: [
      'Weekly Operational Status report generator',
      'Monthly Discipline-Specific credentialing review (ABA / Speech / OT)',
      'Consolidated executive management summary with trend charts',
      'One-click export to CSV, Excel format, and printable report layout'
    ]
  },
  {
    id: 'FR-024',
    priority: 1,
    title: 'Power BI Integration',
    description: 'Data exposed to Power BI via secured API or shared dataset. Power BI dashboards display weekly progress, monthly performance, pending / overdue credentialing, approval trends, specialist productivity, payer performance, executive KPI summary.',
    stakeholders: ['Leadership', 'Admin'],
    module: 'Reports & BI',
    targetTab: 'reports',
    features: [
      'Secured JSON data endpoint and shared dataset export for Power BI',
      'Pre-configured schema mapping for Power BI Desktop & Service',
      'Real-time dataset download for direct import into BI semantic models',
      'Automated refresh token and API integration specifications'
    ]
  },
  {
    id: 'FR-025',
    priority: 1,
    title: 'Audit Trail',
    description: 'Complete, immutable audit trail — user, timestamp, action, previous value, updated value, notes. Records every document upload, application submission, follow-up, stage change. Searchable and exportable by admins. Retention ≥ 7 years.',
    stakeholders: ['Manager', 'Admin', 'Leadership'],
    module: 'Admin & System',
    targetTab: 'tracker',
    features: [
      'Immutable chronological event log on every provider and application record',
      'User attribution, exact timestamps, before-value and after-value capture',
      'Dedicated audit trail tab within application detail modals',
      'Exportable audit log files compliant with HIPAA 7-year retention guidelines'
    ]
  },
  {
    id: 'FR-026',
    priority: 1,
    title: 'User & Role Management',
    description: 'Admin creates, edits, activates, deactivates users. Role-based permissions for all defined roles. Assign specialists to disciplines, payers, or entities.',
    stakeholders: ['Admin'],
    module: 'Admin & System',
    targetTab: 'new-user',
    features: [
      'Admin user provisioning, profile editing, and deactivation',
      'Role assignment across 8+ specialized organizational profiles',
      'Discipline (ABA/Speech/OT) and Legal Entity operational scoping',
      'Custom fine-grained capability toggles per user account'
    ]
  },
  {
    id: 'FR-027',
    priority: 2,
    title: 'Configuration Management',
    description: 'Admin configures stages, SLA thresholds, follow-up cadence, notification templates, payer requirements matrix, entity master, location master. Configuration changes logged in audit trail.',
    stakeholders: ['Admin'],
    module: 'Admin & System',
    targetTab: 'config',
    features: [
      'System configuration panel for SLA turnaround thresholds',
      'Default follow-up cadence settings (7-10 business days)',
      'Notification email template customization',
      'Payer requirements matrix editor with audit logging'
    ]
  },
  {
    id: 'FR-028',
    priority: 2,
    title: 'Data Import / Migration',
    description: 'Bulk import of provider, payer, entity, location, and credentialing data from Google Sheets. Validation report for failed rows. Import retained for future onboarding of new providers, entities, or payers.',
    stakeholders: ['Admin'],
    module: 'Admin & System',
    targetTab: 'import',
    features: [
      'CSV / Google Sheets bulk import parser with schema mapping',
      'Pre-import validation engine detecting missing NPIs and format errors',
      'Detailed import results report with error rows and successfully loaded items',
      'Reusable import templates for continuous operational onboarding'
    ]
  },
  {
    id: 'FR-029',
    priority: 1,
    title: 'Recredentialing Monitoring',
    description: 'Track recredentialing cycles per payer. Auto-create a recredentialing record ahead of revalidation date (configurable lead time). Prevent credentialing lapse via proactive alerts and dashboards.',
    stakeholders: ['Specialist', 'Manager'],
    module: 'Credentialing',
    targetTab: 'tracker',
    features: [
      '36-Month commercial recredentialing countdown clock',
      'Proactive 180-day and 90-day recredentialing reminder flags',
      'One-click cloning of initial record into a new Recredentialing application',
      'Revalidation due date tracking in executive reports and dashboards'
    ]
  },
  {
    id: 'FR-030',
    priority: 2,
    title: 'Contracting Tracking (separate from Credentialing)',
    description: 'Track contract status per payer / entity — credentialing, contracting, and provider linking treated as distinct activities. Store contract documents and effective dates.',
    stakeholders: ['Manager', 'Leadership', 'Finance'],
    module: 'Linking & Contracting',
    targetTab: 'linking',
    features: [
      'Dedicated Contracting Status tab per Payer × Entity relationship',
      'Contract status tracking (In Negotiation, Executed, Amendment Pending)',
      'Contract document upload and contract effective date recording',
      'Strict operational separation between health plan contract and clinician credentialing'
    ]
  },
  {
    id: 'FR-031',
    priority: 3,
    title: 'Business-Days Calculation',
    description: 'All SLA / follow-up calculations use business days. Holiday calendar configurable by admin.',
    stakeholders: ['Admin'],
    module: 'Admin & System',
    targetTab: 'config',
    features: [
      'Business-day calculation logic excluding weekends (Saturday/Sunday)',
      'Configurable Federal and corporate holiday calendar',
      'Accurate SLA aging countdowns based exclusively on working business days',
      'Admin holiday editor to add custom organizational closure dates'
    ]
  },
  {
    id: 'FR-032',
    priority: 5,
    title: 'Payer Portal API Integration (Future — Phase 5)',
    description: 'Future scope: direct integration with CAQH, PAVE, and payer portals for automated status pulls and submissions, subject to API availability.',
    stakeholders: ['Specialist', 'Manager'],
    module: 'Provider Portal',
    targetTab: 'tracker',
    features: [
      'API gateway stub architecture for CAQH ProView direct sync',
      'PAVE / DHCS automated status polling interface',
      'Availity & Payer clearinghouse electronic claim & roster sync readiness',
      'Phase 5 automated status webhook listener'
    ]
  },
  {
    id: 'FR-033',
    priority: 5,
    title: 'Provider Self-Service Portal (Future)',
    description: 'Future scope: secure portal for providers to upload documents and respond to information requests directly.',
    stakeholders: ['Provider'],
    module: 'Provider Portal',
    targetTab: 'providers',
    features: [
      'Dedicated Provider Portal workspace view for individual clinicians',
      'Clinician direct document upload for state licenses, DEA, and malpractice insurance',
      'One-click CAQH attestation confirmation and credential verification',
      'Direct response channel for credentialing team information requests'
    ]
  }
];

export interface StakeholderRoleScope {
  roleId: string;
  roleName: string;
  category: string;
  primaryResponsibilities: string;
  assignedFRIds: string[];
  keyModules: string[];
  defaultAccessLevel: 'ADMINISTRATOR' | 'USER';
  permissionSummary: string;
  uiCapabilities: string[];
}

export const STAKEHOLDER_ROLE_SCOPES: StakeholderRoleScope[] = [
  {
    roleId: 'Specialist',
    roleName: 'Credentialing Specialist',
    category: 'Credentialing Operations',
    primaryResponsibilities: 'Day-to-day provider intake, document primary source verification, payer application packet creation, follow-ups, and approvals.',
    assignedFRIds: ['FR-001', 'FR-002', 'FR-006', 'FR-007', 'FR-008', 'FR-009', 'FR-010', 'FR-011', 'FR-012', 'FR-013', 'FR-014', 'FR-015', 'FR-016', 'FR-017', 'FR-018', 'FR-020', 'FR-021', 'FR-022', 'FR-029', 'FR-032'],
    keyModules: ['Provider Master', 'Credentialing Tracker', 'Document Repository', 'Follow-up Scheduler', 'CAQH & PAVE'],
    defaultAccessLevel: 'USER',
    permissionSummary: 'Full operational create, edit, upload, follow-up, and status transition rights for assigned provider files.',
    uiCapabilities: [
      'Create & edit provider records and documents',
      'Manage credentialing trackers (4-way combinations)',
      'Perform NPPES NPI format and taxonomy verifications',
      'Execute CAQH and PAVE state enrollment tracking',
      'Log follow-ups, payer responses, and reference IDs',
      'Advance records through stages with checklist validation',
      'Capture Approval, Effective, and Retroactive dates'
    ]
  },
  {
    roleId: 'Manager',
    roleName: 'Credentialing Lead / Manager',
    category: 'Operational Leadership',
    primaryResponsibilities: 'Team throughput oversight, work allocation, SLA turnaround compliance, payer escalation handling, and quality assurance.',
    assignedFRIds: ['FR-001', 'FR-002', 'FR-003', 'FR-004', 'FR-005', 'FR-006', 'FR-007', 'FR-008', 'FR-009', 'FR-010', 'FR-012', 'FR-013', 'FR-014', 'FR-015', 'FR-016', 'FR-017', 'FR-018', 'FR-019', 'FR-020', 'FR-021', 'FR-022', 'FR-023', 'FR-025', 'FR-029', 'FR-030', 'FR-032'],
    keyModules: ['Management Dashboard', 'All Trackers', 'Payer Master', 'Entity & Location Master', 'Escalations', 'Reports'],
    defaultAccessLevel: 'ADMINISTRATOR',
    permissionSummary: 'Full supervisory authority across all provider files, entities, locations, payers, and weekly/monthly reporting.',
    uiCapabilities: [
      'View & supervise all specialists and provider records',
      'Configure payer requirements, average TAT, and follow-up cadences',
      'Override Entity/DBA validation discrepancies with justification',
      'Receive & resolve automated SLA breach escalation alerts',
      'Generate weekly & monthly executive credentialing reports',
      'Audit stage transitions and compliance histories',
      'Manage Provider Linking and Payer Contracting statuses'
    ]
  },
  {
    roleId: 'Leadership',
    roleName: 'Leadership / Management',
    category: 'Executive & Strategic Oversight',
    primaryResponsibilities: 'Strategic health plan contracting, in-network rate expansion, executive KPI reviews, and resource allocation.',
    assignedFRIds: ['FR-001', 'FR-018', 'FR-019', 'FR-020', 'FR-021', 'FR-022', 'FR-023', 'FR-024', 'FR-025', 'FR-030'],
    keyModules: ['Executive Dashboards', 'Power BI Integration', 'Monthly Reports', 'Contracting Hub', 'Audit Log Viewer'],
    defaultAccessLevel: 'ADMINISTRATOR',
    permissionSummary: 'Executive read access to all metrics, Power BI datasets, contracting records, and escalation alerts.',
    uiCapabilities: [
      'Real-time multi-dimensional executive KPI dashboards',
      'Discipline-specific performance breakdowns (ABA, Speech, OT)',
      'Export datasets directly to Microsoft Power BI semantic models',
      'Review high-level monthly credentialing summaries',
      'Track health plan contracting milestones and effective dates',
      'Audit log access for governance and regulatory compliance'
    ]
  },
  {
    roleId: 'Admin',
    roleName: 'System Administrator',
    category: 'IT & System Governance',
    primaryResponsibilities: 'User identity provisioning, security roles, system configuration, SLA thresholds, data migrations, and integrations.',
    assignedFRIds: ['FR-001', 'FR-002', 'FR-003', 'FR-004', 'FR-005', 'FR-007', 'FR-008', 'FR-024', 'FR-025', 'FR-026', 'FR-027', 'FR-028', 'FR-031'],
    keyModules: ['User Management', 'System Config', 'Data Import / Migration', 'Power BI API', 'Audit Logs'],
    defaultAccessLevel: 'ADMINISTRATOR',
    permissionSummary: 'Complete system control over accounts, configuration, data import/export, and security governance.',
    uiCapabilities: [
      'Create, edit, activate, and deactivate user accounts',
      'Configure RBAC permissions and operational scopes',
      'Manage system stages, SLA thresholds, and holiday calendars',
      'Execute bulk Google Sheets / CSV data migrations with validation',
      'Manage Power BI API tokens and integration endpoints',
      'Export complete 7-year immutable audit log records'
    ]
  },
  {
    roleId: 'Operations',
    roleName: 'HR/Operations',
    category: 'People & Resource Operations',
    primaryResponsibilities: 'Coordinates provider hire dates, clinic location assignments, legal entity affiliations, and onboarding timelines.',
    assignedFRIds: ['FR-001', 'FR-005', 'FR-014', 'FR-020', 'FR-021'],
    keyModules: ['Provider Master', 'Location Master', 'Provider Linking Tracker', 'Notifications'],
    defaultAccessLevel: 'USER',
    permissionSummary: 'Read-and-coordinate access for clinician onboarding, location readiness, and provider linking status.',
    uiCapabilities: [
      'Track provider onboarding start dates and clinic assignments',
      'Monitor provider credentialing progress for upcoming new hires',
      'Inspect clinic location approvals and lease documentation',
      'Review provider-to-group linking status to prepare clinic rosters',
      'Receive automated notifications for approved provider milestones'
    ]
  },
  {
    roleId: 'HR',
    roleName: 'Human Resources (HR)',
    category: 'People Operations',
    primaryResponsibilities: 'Coordinates clinician background checks, state license verifications, degree attestations, and employment agreements.',
    assignedFRIds: ['FR-001', 'FR-002', 'FR-015', 'FR-020', 'FR-021'],
    keyModules: ['Provider Master', 'Document Upload', 'Notifications'],
    defaultAccessLevel: 'USER',
    permissionSummary: 'Clinician profile access for onboarding documentation, background checks, and license verification.',
    uiCapabilities: [
      'Review incoming clinician credentialing documentation',
      'Upload HR onboarding documents (W-9, CV, background checks, degrees)',
      'Monitor license expiration countdown alerts for active staff',
      'Coordinate with credentialing on clinician start date milestones'
    ]
  },
  {
    roleId: 'Billing',
    roleName: 'Billing and Claims',
    category: 'Revenue Cycle Management',
    primaryResponsibilities: 'Monitors payer effective dates, billing provider NPI linking status, retroactive claim windows, and denial resolution.',
    assignedFRIds: ['FR-001', 'FR-014', 'FR-020', 'FR-021'],
    keyModules: ['Provider Linking Tracker', 'Effective Date Directory', 'Payer Master', 'Notifications'],
    defaultAccessLevel: 'USER',
    permissionSummary: 'Focused read-only visibility into payer effective dates, retroactive dates, and "Hold Billing" flags.',
    uiCapabilities: [
      'Access real-time directory of In-Network and Effective providers',
      'Inspect exact Payer Effective Dates and Retroactive coverage periods',
      'Verify Provider Linking status before submitting therapy claims',
      'Prevent claim rejections via "Hold Billing" status alerts',
      'Coordinate with credentialing on payer denial resolution'
    ]
  },
  {
    roleId: 'Clinical',
    roleName: 'Clinical Team',
    category: 'Clinical Governance',
    primaryResponsibilities: 'Assists with discipline scope of practice (ABA, Speech, OT), supervisor agreements, and clinical reference verifications.',
    assignedFRIds: ['FR-001', 'FR-002', 'FR-020', 'FR-021'],
    keyModules: ['Provider Master', 'Discipline Directory', 'Notifications'],
    defaultAccessLevel: 'USER',
    permissionSummary: 'Clinical staff visibility into discipline scopes, board certifications (BCBA, SLP, OTR/L), and supervisor pairings.',
    uiCapabilities: [
      'Review clinical credentials and board certifications',
      'Verify taxonomy codes match clinical service specialties',
      'Confirm clinical supervision agreements for BCaBA, RBT, and assistants',
      'Track discipline-level active provider counts'
    ]
  },
  {
    roleId: 'Finance',
    roleName: 'Finance / Legal & Compliance',
    category: 'Financial & Corporate Governance',
    primaryResponsibilities: 'Validates legal entity DBAs, corporate EINs, W-9 accuracy, general liability insurance, and payer contract terms.',
    assignedFRIds: ['FR-001', 'FR-004', 'FR-015', 'FR-016', 'FR-030'],
    keyModules: ['Entity Master', 'Entity/DBA Validation', 'Contracting Hub', 'Document Repository'],
    defaultAccessLevel: 'USER',
    permissionSummary: 'Corporate legal entity, W-9, insurance policy, and health plan contracting management.',
    uiCapabilities: [
      'Manage legal entities, corporate EINs, and Type-2 NPI records',
      'Upload and verify annual W-9 forms, GL, and Workers Comp policies',
      'Perform Entity/DBA consistency validations across payer contracts',
      'Track health plan contract status and negotiated effective dates'
    ]
  },
  {
    roleId: 'Provider',
    roleName: 'Rendering Practitioner / Clinician',
    category: 'Clinical Staff & Rendering Providers',
    primaryResponsibilities: 'Practitioner profile management, CAQH attestation updates, license renewals, and credentialing information responses.',
    assignedFRIds: ['FR-001', 'FR-020', 'FR-033'],
    keyModules: ['Provider Portal', 'My Credentials', 'CAQH Tracker', 'Document Upload'],
    defaultAccessLevel: 'USER',
    permissionSummary: 'Self-service portal access to view individual credentialing progress and submit renewed licenses.',
    uiCapabilities: [
      'View real-time credentialing and in-network status per payer',
      'Submit renewed state licenses, DEA certificates, and malpractice insurance',
      'Review CAQH attestation status and upcoming 120-day deadlines',
      'Respond directly to credentialing team information requests'
    ]
  }
];
