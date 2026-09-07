# Healthcare Credentialing & Provider Linking Management System
## Master Technical & Functional Specification Document

**Operating Entities:**
- **Ages Learning Solutions** (Applied Behavior Analysis / ABA)
- **Proficio Speech Therapy** (Speech-Language Pathology / SLP)
- **Child’s Play Therapy** (Occupational Therapy / OT)

**Document Version:** 2026.3.0  
**Classification:** Confidential • Internal Engineering & Operational Master Specification  
**Project Lead:** Joel Reji (joel.reji@ageslearningsolutions.com)  
**Author:** Healthcare Engineering & Credentialing Operations Team  
**Downloadable File Locations in Workspace:**
- PDF Format: `/docs/CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.pdf` (and root `/CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.pdf`)
- Standalone HTML Format: `/docs/CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.html` (and root `/CREDENTIALING_SYSTEM_MASTER_DOCUMENTATION.html`)

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
- **Atomic Backend Persistence:** Executes transaction creating linked records across `employees`, `clinical_staff`, `providers`, `applications`, `documents`, and `comments`.
- **Review Summary:** Formatted overview displaying profile, credential, and document details.
- **Prominent Provider Linking Section (+):** Dedicated linking panel with a plus sign button to establish billing TIN affiliations and facility location NPIs.

### 4.5 Post-Approval Release & Re-Credentialing Cycles
- **Billing Release Verification:** Clinicians transition to "Linked / Billing Released" only when both Payer Approval and Group Linking are confirmed.
- **Automated Clocks:** Initiates 120-day CAQH attestation countdown and 90-day license renewal alerting.

---

## 5.0 Database Architecture, Schemas & Data Models

### 5.1 Entity Relationship Model Overview
```text
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
```

### 5.2 Master Data Dictionary

| Collection | Field Name | Data Type | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| **employees** | `id` | string | Regex: `^[a-zA-Z0-9_-]{1,64}$` | Primary key HR employee identifier |
| **employees** | `email` | string | Valid RFC 5322 email | Clinician corporate email |
| **clinical_staff** | `employeeId` | string | References `employees.id` | Foreign key linking clinical profile to HR |
| **clinical_staff** | `npi` | string | 10-digit numeric | Type 1 Individual NPI |
| **clinical_staff** | `caqhId` | string | 8-digit numeric | CAQH ProView identifier |
| **providers** | `clinicalStaffId` | string | References `clinical_staff.id` | Foreign key linking roster to staff |
| **applications** | `providerId` | string | References `providers.id` | Target clinician |
| **applications** | `payerId` | string | References `payers.id` | Target health plan |
| **applications** | `stage` | string | Enum (7 stages) | Lifecycle stage in pipeline |
| **applications** | `agingDays` | number | Integer >= 0 | Days elapsed since submission |
| **documents** | `fileUrl` | string | Valid URL | Cloud link to verification document |
| **comments** | `timestamp` | string | ISO 8601 UTC | Timestamp of audit entry |

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
All document reads and writes validate document identifier paths using regex: `isValidId(id)` preventing directory traversal or path injection.

---

## 10.0 Non-Functional & Operational Requirements
- **Performance & Latency:** Client-side transitions < 50ms; database writes < 250ms.
- **Durability & Recovery:** Multi-tier storage with zero unpersisted data loss and full CSV/JSON export capability.
- **HIPAA & PII Compliance:** Encryption in transit and at rest; no unencrypted PHI/PII transmission.

---

## 11.0 Implementation Roadmap & Integration Blueprint
- **Phase 1 (Current):** 100% complete coverage for all daily credentialing, 4-step intake, facility group linking, executive dashboards, and 5.11 compliance reports.
- **Phase 2 (Q3 2026):** Automated AI Document OCR for License & Insurance Extraction.
- **Phase 3 (Q4 2026):** Direct CAQH ProView B2B Gateway & Outbound Automated Payer Follow-up Bots.
- **Phase 4 (2027):** Headless Medi-Cal PAVE RPA Submission Bot.

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
