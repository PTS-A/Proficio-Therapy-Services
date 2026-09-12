export type AccessLevel = 'ADMINISTRATOR' | 'USER';

export type SystemRole = 
  | 'Credentialing Specialist'
  | 'Credentialing Lead / Manager'
  | 'Provider'
  | 'HR/Operations'
  | 'Clinical Team'
  | 'Billing and Claims'
  | 'Leadership / Management'
  | 'System Administrator';

export type UserRole = 
  | 'Specialist' 
  | 'Manager' 
  | 'Leadership' 
  | 'Admin' 
  | 'Operations' 
  | 'HR' 
  | 'Billing' 
  | 'Clinical';

export interface AppAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  accessLevel: AccessLevel;
  systemRole?: SystemRole;
  roleTitle?: string;
  department?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  assignedDisciplines?: Discipline[];
  assignedEntities?: string[];
  permissions?: string[];
  status?: 'Active' | 'Inactive' | 'Pending Activation';
  assignedLocations?: string[];
  authProvider?: 'google' | 'password';
  googleId?: string;
  mustChangePasswordOnFirstLogin?: boolean;
  hasChangedInitialPassword?: boolean;
  isSuperAdmin?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accessLevel?: AccessLevel;
  avatar?: string;
  assignedDisciplines?: Discipline[];
  assignedEntities?: string[];
}

export type Discipline = 'ABA' | 'Speech' | 'OT';

export type ProviderType = 
  | 'BCBA' 
  | 'BCaBA'
  | 'RBT' 
  | 'ABA Therapist'
  | 'SLP' 
  | 'SLPA' 
  | 'OTR/L' 
  | 'COTA' 
  | 'Clinical Director';

export type EmploymentStatus = 'Full-Time' | 'Part-Time' | 'Contractor' | 'Inactive';

export type CAQHStatus = 'Initial' | 'Complete' | 'Attested' | 'Re-attestation Due' | 'Discrepancy';

export type PAVEStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Approved' | 'Returned' | 'Additional Docs Requested' | 'Not Required';

export interface Employee {
  id: string; // Unique Employee ID (e.g. "EMP-2026-001")
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  roleTitle: string;
  employmentStatus: 'Full-Time' | 'Part-Time' | 'Contractor' | 'Inactive';
  startDate: string;
  officeLocationId?: string;
  entityId?: string;
  notes?: string;
  isDemo?: boolean; // True if record is demo data, strictly isolated for admin@example.com
  ownerAccountEmail?: string; // Restricted to admin@example.com for demo records
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalStaff {
  id: string; // Unique Clinical Staff ID (e.g. "CS-2026-001")
  employeeId?: string; // Reference to Employee
  providerId?: string; // Reference to Provider
  firstName: string;
  lastName: string;
  fullName: string;
  credentials: string; // e.g. "MS, BCBA, LBA"
  disciplines: Discipline[]; // e.g. ["ABA"]
  providerType: ProviderType; // e.g. "BCBA"
  licenseNumber: string;
  licenseState: string;
  licenseExpiration?: string;
  npi?: string;
  isDemo?: boolean;
  ownerAccountEmail?: string;
  taxonomy?: string;
  specialty?: string;
  primaryLocationId?: string;
  locationIds: string[];
  entityIds: string[];
  caqhId?: string;
  paveStatus?: PAVEStatus;
  status: 'Active' | 'In Credentialing' | 'Pending Documents' | 'On Leave' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDocument {
  id: string; // Unique Document ID e.g. "DOC-2026-001"
  applicationId: string; // Reference to CredentialingApplication
  providerId?: string; // Reference to Provider
  clinicalStaffId?: string; // Reference to ClinicalStaff
  name: string;
  type: string;
  documentUrl: string;
  uploadDate: string;
  expirationDate?: string;
  verificationStatus?: 'Verified' | 'Pending Verification' | 'Expired' | 'Rejected';
  notes?: string;
}

export interface ApplicationComment {
  id: string; // Unique Comment ID e.g. "COM-2026-001"
  applicationId: string; // Reference to CredentialingApplication
  providerId?: string; // Reference to Provider
  authorId: string;
  authorName: string;
  authorRole?: string;
  commentText: string;
  dateCreated: string; // e.g. "September 6, 2026"
  timeCreated: string; // e.g. "6:30 PM"
  timestamp: string; // ISO 8601
}

export interface CredentialingApplication {
  id: string; // Unique Application ID e.g. "APP-2026-0042"
  providerId: string; // Reference to Provider
  clinicalStaffId?: string; // Reference to ClinicalStaff
  employeeId?: string; // Reference to Employee
  payerIds: string[]; // Reference to selected Payers
  payerId: string; // Primary payer for backward compatibility
  entityId: string;
  locationId: string;
  applicationType: ApplicationType;
  discipline: Discipline;
  stage: CredentialingStage;
  status: string;
  assignedSpecialistId: string;
  assignedSpecialistName: string;
  intakeDate: string;
  documentIds: string[]; // Reference to documents
  documentLinks: { id: string; name: string; url: string; type?: string; uploadDate?: string }[];
  commentIds: string[]; // Reference to comments
  comments?: ApplicationComment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 
    | 'State License'
    | 'Board Certification'
    | 'Degree / Diploma'
    | 'DEA Registration'
    | 'Malpractice Insurance / COI'
    | 'General Liability (GL)'
    | 'Workers Comp (WC)'
    | 'W-9 Form'
    | 'Curriculum Vitae (CV)'
    | 'Government ID'
    | 'Background Check / Fingerprinting'
    | 'Lease / Sublease Agreement'
    | 'Ownership / Control Disclosure'
    | 'Provider Agreement'
    | 'Payer-Specific Application'
    | 'Approval Letter'
    | 'Contract Document'
    | 'PAVE Proof'
    | 'Medicaid Enrollment Proof'
    | 'Other';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  expirationDate?: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Expired' | 'Rejected';
  verifiedBy?: string;
  verifiedDate?: string;
  entityId?: string;
  locationId?: string;
  providerId?: string;
  payerId?: string;
  notes?: string;
  documentUrl?: string; // Direct link or drive/cloud document URL
}

export interface ProviderCommentLog {
  id: string;
  timestamp: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  statusFrom?: string;
  statusTo?: string;
  comment: string;
  targetPerson?: string; // Whom the comment or action is directed to / assigned to
  category?: 'Status Update' | 'Follow-up' | 'Payer Review' | 'Document Missing' | 'Clinical Team' | 'General Note';
}

export interface ProviderContractInfo {
  contractNumber?: string;
  contractType?: 'Group Agreement' | 'Individual Agreement' | 'Amendment' | 'Fee-for-Service' | string;
  feeScheduleTier?: string;
  contractEffectiveDate?: string;
  recredentialingCycleYears?: number;
  notes?: string;
}

export interface ProviderPayerEnrollment {
  id?: string;
  payerId: string;
  payerName: string;
  status: 'In-Network' | 'Application In Progress' | 'In Progress' | 'Linked' | 'Pending Payer Review' | 'Pending Linking' | 'Approved / Active' | 'Re-credentialing' | 'Recredentialing Due' | 'Not Enrolled' | 'Terminated' | string;
  enrollmentStatus?: 'In-Network' | 'Application In Progress' | 'In Progress' | 'Linked' | 'Pending Payer Review' | 'Pending Linking' | 'Approved / Active' | 'Re-credentialing' | 'Recredentialing Due' | 'Not Enrolled' | 'Terminated' | string;
  effectiveDate?: string;
  recredentialingDate?: string;
  recredentialingDueDate?: string;
  providerIdNumber?: string;
  networkType?: string;
  applicationType?: ApplicationType | string;
  notes?: string;
}

export interface Provider {
  id: string;
  // 1. Basic Information
  npi: string;
  firstName: string;
  lastName: string;
  credentials: string; // e.g. "MS, BCBA, LBA"
  disciplines: Discipline[];
  providerType: ProviderType;
  email: string;
  phone: string;
  altPhone?: string;
  contactAddress?: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiration: string;
  taxonomy: string;
  specialty: string;

  // 2. Employment / Group Information
  entityIds: string[]; // Legal entities provider works under
  primaryEntityId?: string;
  dba?: string;
  employmentStatus: EmploymentStatus;
  contractStatus?: 'W-2 Full-Time' | 'W-2 Part-Time' | '1099 Contractor' | 'Independent Consultant' | string;
  startDate: string;
  groupAffiliation?: string;
  renderingProviderInfo?: string;

  // 3. Location Information
  primaryLocationId?: string;
  locationIds: string[]; // Locations provider renders services at
  additionalLocationIds?: string[];
  serviceTypes?: ServiceType[];
  locationEffectiveDate?: string;
  
  // 4. Credentialing Information
  caqhId: string;
  caqhStatus: CAQHStatus;
  lastAttestationDate?: string;
  nextAttestationDate?: string;
  paveStatus: PAVEStatus;
  medicaidId?: string;
  npiVerified: boolean;
  npiVerificationDate?: string;
  nppesRecordMatch: boolean;
  effectiveDate?: string;
  recredentialingDate?: string;
  contractInfo?: ProviderContractInfo;
  payerEnrollments?: ProviderPayerEnrollment[];
  
  documents: DocumentItem[];
  commentLogs?: ProviderCommentLog[];
  currentStatus?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PayerType = 
  | 'Commercial' 
  | 'Commercial insurance'
  | 'Medicaid'
  | 'Medicaid / Medi-Cal'
  | 'Medicaid Managed Care'
  | 'Medicaid / Commercial'
  | 'Regional'
  | 'Regional / Medicaid'
  | 'Regional / local health plans'
  | 'Regional Center / State'
  | 'Network'
  | 'Other behavioral health and therapy networks'
  | 'Tricare / Military'
  | 'Medicare Advantage'
  | 'Government' 
  | 'State program';

export interface PayerContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  portalOrDept?: string;
}

export interface Payer {
  id: string;
  name: string;
  type: PayerType;
  portalUrl?: string;
  statesServed: string[];
  contacts: PayerContact[];
  requiredDocuments: string[];
  requiredDocumentTypes?: string[];
  requiredFields: string[];
  averageTatDays: number; // e.g. 60 days
  followUpCadenceDays: number; // default 7-10 business days
  submissionMethod: string;
  requiresPave?: boolean;
  requiresCaqh?: boolean;
  requiresMedicaidId?: boolean;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  active: boolean;
}

export interface InsurancePolicyInfo {
  policyNumber: string;
  carrier: string;
  expirationDate: string;
  coverageAmount: string;
}

export interface LegalEntity {
  id: string;
  legalName: string;
  dba: string;
  ein: string;
  npiType2?: string;
  taxonomy?: string;
  ownershipDetails: string;
  w9OnFile: boolean;
  w9Year?: number;
  w9Date?: string;
  generalLiabilityPolicy: InsurancePolicyInfo | any;
  generalLiabilityExpiry?: string;
  workersCompPolicy: InsurancePolicyInfo | any;
  workersCompExpiry?: string;
  primaryContact: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

export type ServiceType = 'In-Clinic' | 'In-Home' | 'In-School' | 'Telehealth';

export type LocationType = 'Physical Clinic' | 'In-Home / Mobile' | 'School District' | 'Telehealth Virtual' | 'Satellite';

export interface Location {
  id: string;
  name: string;
  locationType?: LocationType;
  addressLine1?: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  zip: string;
  phone: string;
  entityId: string; // Associated legal entity
  dba: string;
  serviceTypes: ServiceType[];
  payerApplicability: string[]; // Payer IDs or 'All'
  leaseAgreementStatus: 'Active' | 'Sublease' | 'Missing' | 'Expired' | 'Not Applicable';
  leaseExpirationDate?: string;
  leaseExpiryDate?: string;
  effectiveDate: string;
  paveLocationStatus?: 'Approved' | 'Pending' | 'Not Required';
  paveStatus: 'Approved' | 'Pending' | 'Not Required';
  insuranceCoverageValid: boolean;
  locationApprovalStatus: 'Approved' | 'Pending' | 'Under Review';
  primaryContact?: string;
  countiesServed?: string[];
  serviceRadiusMiles?: number;
  notes?: string;
  active: boolean;
}

export type PracticeLocation = Location;

export type ApplicationType = 
  | 'New provider credentialing'
  | 'Initial credentialing'
  | 'Recredentialing'
  | 'Provider enrollment and participation'
  | 'Enrollment'
  | 'Re-enrollment'
  | 'Group addition'
  | 'Provider addition'
  | 'Provider address / location additions'
  | 'Location addition'
  | 'Provider linking'
  | 'Contracting'
  | 'Provider demographic updates'
  | 'Demographic update'
  | 'Taxonomy updates'
  | 'Taxonomy update'
  | 'Group affiliation and rendering provider enrollment'
  | 'Entity update';

export type CredentialingStage = 
  | 'Intake'
  | 'Documents Pending'
  | 'Documents Complete'
  | 'CAQH Pending'
  | 'PAVE Pending'
  | 'Application Preparation'
  | 'Application Submitted'
  | 'Payer Review'
  | 'Additional Documents Requested'
  | 'Correction Required'
  | 'Resubmitted'
  | 'Approved'
  | 'Linking Pending'
  | 'Linked'
  | 'Effective'
  | 'Closed / Not Contracted'
  | 'Recredentialing Due'
  | 'Overdue';

export type StageCategory = 
  | 'Pre-Submission' 
  | 'In-Review' 
  | 'Approval & Linking' 
  | 'Completed / Closed' 
  | 'Maintenance / Alert';

export interface StageConfig {
  id: string;
  name: CredentialingStage;
  category: StageCategory;
  description: string;
  slaTurnaroundTargetDays?: number;
  isSystemAssigned?: boolean;
  isMandatory?: boolean;
  order: number;
  badgeColor: string;
  isActive: boolean;
  allowedNextStages?: CredentialingStage[];
}

export interface FollowUpEntry {
  id: string;
  date: string;
  nextFollowUpDate: string;
  method: 'Portal' | 'Phone' | 'Email' | 'Mail' | 'Availity';
  contactPerson: string;
  referenceNumber: string;
  payerResponse: string;
  nextAction: string;
  isEscalated: boolean;
  escalatedTo?: string; // e.g. "Credentialing Manager & Leadership"
  specialistId: string;
  specialistName: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'Document' | 'Portal' | 'Validation' | 'Administrative' | 'Form';
  isRequired: boolean;
  isCompleted: boolean;
  completedDate?: string;
  completedBy?: string;
  notes?: string;
}

export interface ValidationIssue {
  id: string;
  field: string;
  severity: 'Error' | 'Warning';
  description: string;
  ruleReference: string; // e.g. "Section 5.10 Entity/DBA Match"
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
}

export type LinkingStatus = 'Not Applicable' | 'Pending Approval' | 'Linking In Progress' | 'Linked' | 'Rejected';

export type ContractStatus = 'Not Started' | 'In Negotiation' | 'Contract Executed' | 'Amendment Pending' | 'Terminated';

export interface CredentialingRecord {
  id: string; // unique application identifier (e.g. "APP-2026-0042")
  providerId: string;
  payerId: string;
  entityId: string;
  locationId: string;
  applicationType: ApplicationType;
  discipline: Discipline;
  stage: CredentialingStage;
  
  // Assigned Specialist
  assignedSpecialistId: string;
  assignedSpecialistName: string;

  // Key Dates
  intakeDate: string;
  documentsRequestedDate?: string;
  documentsReceivedDate?: string;
  documentsCompleteDate?: string;
  submissionDate?: string;
  targetTurnaroundDate?: string;
  approvalDate?: string;
  effectiveDate?: string; // Recorded separately from approval date per FR-006 & FR-014
  providerLinkDate?: string;
  revalidationDate?: string;
  expirationDate?: string;
  
  // Follow-up & Cycle Time Tracking (SLA-002, SLA-003)
  followUps: FollowUpEntry[];
  nextFollowUpDate?: string;
  lastFollowUpDate?: string;
  isOverdue: boolean;
  daysInCurrentStage: number;
  totalCycleDays: number;
  teamCycleDays?: number; // Days from intake to submission (team controllable)
  actualPayerTatDays?: number; // Days from submission to approval (payer controllable)
  externalDelayDays?: number; // Delays outside team control (payer freeze, backlog)
  externalDelayReason?: string;
  
  // Checklist & Requirements (SLA-005)
  checklist: ChecklistItem[];
  documents: DocumentItem[];
  
  // Entity & DBA Validation Engine (SLA-007)
  validationIssues: ValidationIssue[];
  validationOverridden?: {
    overriddenBy: string;
    date: string;
    reason: string;
  };
  
  // Provider Linking Tracker (FR-014)
  linkingStatus: LinkingStatus;
  linkEffectiveDate?: string;
  linkingNotes?: string;

  // Contracting Tracker (FR-030)
  contractStatus: ContractStatus;
  contractEffectiveDate?: string;
  contractDocumentId?: string;

  // PAVE / Medicaid tracking details (FR-012)
  paveTrackingNumber?: string;
  dhcsApprovalDate?: string;
  paveNotes?: string;

  // CAQH tracking details (FR-010)
  caqhStatusAtSubmission?: string;

  // General notes & logs
  rejectionReason?: string;
  correctiveAction?: string;
  notes?: string;
  auditTrail: AuditEntry[];

  // Database Relationship References (Section 5, 6, 7)
  clinicalStaffId?: string;
  employeeId?: string;
  payerIds?: string[];
  documentIds?: string[];
  documentLinks?: { id: string; name: string; url: string; type?: string; uploadDate?: string }[];
  commentIds?: string[];
  comments?: ApplicationComment[];
  applicationId?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface SLAItem {
  id: 'SLA-001' | 'SLA-002' | 'SLA-003' | 'SLA-004' | 'SLA-005' | 'SLA-006' | 'SLA-007';
  requirement: string;
  target: string;
  actual: string;
  status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  metricSummary: string;
  supportingKpi?: string;
}

export interface FY2026SLAStats {
  sla001_submissionEfficiency: {
    target: string;
    actualRate: number;
    eligibleSubmissions: number;
    submittedWithin5Days: number;
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  };
  sla002_followUpCadence: {
    target: string;
    actualRate: number;
    activeInReview: number;
    compliantCount: number;
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  };
  sla003_cycleTime: {
    target: string;
    teamCycleDays: number;
    actualPayerTatDays: number;
    totalCycleDays: number;
    excludedDelaysCount: number;
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  };
  sla004_trackingCoverage: {
    target: string;
    actualRate: number;
    totalTracked: number;
    totalRoster: number;
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  };
  sla005_preSubmissionDocCheck: {
    target: string;
    actualRate: number;
    zeroMissingSubmitted: boolean;
    blockedSubmissionsPrevented: number;
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  };
  sla006_approvalEffectiveDates: {
    target: string;
    actualRate: number;
    totalApproved: number;
    bothDatesRecorded: number;
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  };
  sla007_zeroExpiredSubmissions: {
    target: string;
    expiredSubmissionsCount: number;
    actualRate: number;
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  };
}

export interface KPIPerformanceStats {
  kpi1_submissionEfficiency: {
    title: string;
    target: string;
    rate: number;
    count: number;
    total: number;
    status: 'Exceeding' | 'On Track' | 'Action Needed';
  };
  kpi2_followUpCompliance: {
    title: string;
    target: string;
    rate: number;
    onTrack: number;
    total: number;
    status: 'Exceeding' | 'On Track' | 'Action Needed';
  };
  kpi3_cycleTime: {
    title: string;
    target: string;
    teamDays: number;
    payerTatDays: number;
    adjustedTotalDays: number;
    status: 'Exceeding' | 'On Track' | 'Action Needed';
  };
  kpi4_networkExpansion: {
    title: string;
    target: string;
    providersCredentialed: number;
    payersAdded: number;
    locationsAdded: number;
    newNetworksOpened: number;
    providersLinked: number;
    status: 'Exceeding' | 'On Track' | 'Action Needed';
  };
}

export interface KPIStats {
  totalProviders: number;
  totalApplications: number;
  applicationsSubmitted: number;
  applicationsPending: number;
  applicationsApproved: number;
  applicationsRequiringAction: number;
  applicationsOverdue: number;
  applicationsRejected: number;
  providersLinked: number;
  providersLinkingPending: number;
  averageCredentialingCycleDays: number;
  submissionEfficiencyRate: number; // target 95%
  followUpComplianceRate: number; // target 95%
  zeroExpiredSubmissionRate: number; // target 100%
  slaStats: FY2026SLAStats;
  kpiPerformance: KPIPerformanceStats;
  slaList: SLAItem[];
  agingBuckets: {
    under30: number;
    days31to60: number;
    days61to90: number;
    days91to120: number;
    over120: number;
  };
}

export interface SystemNotification {
  id: string;
  type: 
    | 'OVERDUE_FOLLOWUP'
    | 'ESCALATION'
    | 'CAQH_ATTESTATION'
    | 'LICENSE_EXPIRING'
    | 'MISSING_DOCS'
    | 'PAVE_ACTION'
    | 'APPROVAL_RECEIVED'
    | 'LINKING_PENDING'
    | 'RECREDENTIALING_DUE';
  title: string;
  message: string;
  timestamp: string;
  recordId?: string;
  providerId?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
}

export interface SavedFilter {
  id: string;
  name: string;
  discipline?: Discipline | 'All';
  payerId?: string;
  entityId?: string;
  locationId?: string;
  stage?: CredentialingStage | 'All';
  applicationType?: ApplicationType | 'All';
  specialistId?: string;
  isOverdueOnly?: boolean;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  affectsSla: boolean;
  type: 'Federal' | 'Corporate' | 'State';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  triggerEvent: string;
  subject: string;
  recipientRoles: string[];
  bodyTemplate: string;
  isActive: boolean;
}

export interface SystemSettings {
  slaSubmissionDays: number;
  slaFollowUpMinDays: number;
  slaFollowUpMaxDays: number;
  caqhReattestationDays: number;
  licenseExpAdvanceAlertDays: number;
  autoReminderPayerAging: boolean;
  autoEscalateOverdueFollowup: boolean;
  enableDailySummaryEmail: boolean;
  nppesAutoValidation: boolean;
}
