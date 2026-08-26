export type AccessLevel = 'ADMINISTRATOR' | 'USER';

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
  roleTitle?: string;
  department?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
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
  | 'SLP' 
  | 'OTR/L' 
  | 'SLPA' 
  | 'COTA' 
  | 'RBT' 
  | 'Clinical Director';

export type EmploymentStatus = 'Full-Time' | 'Part-Time' | 'Contractor' | 'Inactive';

export type CAQHStatus = 'Initial' | 'Complete' | 'Attested' | 'Re-attestation Due' | 'Discrepancy';

export type PAVEStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Approved' | 'Returned' | 'Additional Docs Requested' | 'Not Required';

export interface DocumentItem {
  id: string;
  name: string;
  type: 
    | 'State License'
    | 'DEA Registration'
    | 'Malpractice Insurance / COI'
    | 'General Liability (GL)'
    | 'Workers Comp (WC)'
    | 'W-9 Form'
    | 'Curriculum Vitae (CV)'
    | 'Board Certification'
    | 'Lease / Sublease Agreement'
    | 'Ownership / Control Disclosure'
    | 'Provider Agreement'
    | 'Payer-Specific Application'
    | 'Approval Letter'
    | 'Contract Document'
    | 'PAVE Proof'
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
}

export interface Provider {
  id: string;
  npi: string;
  firstName: string;
  lastName: string;
  credentials: string; // e.g. "MS, BCBA, LBA"
  disciplines: Discipline[];
  providerType: ProviderType;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiration: string;
  taxonomy: string;
  specialty: string;
  employmentStatus: EmploymentStatus;
  startDate: string;
  entityIds: string[]; // Legal entities provider works under
  locationIds: string[]; // Locations provider renders services at
  renderingProviderInfo?: string;
  groupAffiliation?: string;
  
  // Credentialing Master fields
  caqhId: string;
  caqhStatus: CAQHStatus;
  lastAttestationDate?: string;
  nextAttestationDate?: string;
  paveStatus: PAVEStatus;
  medicaidId?: string;
  npiVerified: boolean;
  npiVerificationDate?: string;
  nppesRecordMatch: boolean;
  
  documents: DocumentItem[];
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PayerType = 
  | 'Commercial' 
  | 'Medicaid Managed Care'
  | 'Regional Center / State'
  | 'Tricare / Military'
  | 'Medicare Advantage'
  | 'Medicaid' 
  | 'Regional' 
  | 'Government' 
  | 'Network' 
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

export interface Location {
  id: string;
  name: string;
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
  leaseAgreementStatus: 'Active' | 'Sublease' | 'Missing' | 'Expired';
  leaseExpirationDate?: string;
  leaseExpiryDate?: string;
  effectiveDate: string;
  paveLocationStatus?: 'Approved' | 'Pending' | 'Not Required';
  paveStatus: 'Approved' | 'Pending' | 'Not Required';
  insuranceCoverageValid: boolean;
  locationApprovalStatus: 'Approved' | 'Pending' | 'Under Review';
  primaryContact?: string;
  active: boolean;
}

export type PracticeLocation = Location;

export type ApplicationType = 
  | 'Initial credentialing'
  | 'Recredentialing'
  | 'Enrollment'
  | 'Re-enrollment'
  | 'Group addition'
  | 'Provider addition'
  | 'Location addition'
  | 'Provider linking'
  | 'Contracting'
  | 'Demographic update'
  | 'Taxonomy update'
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
  submissionDate?: string;
  targetTurnaroundDate?: string;
  approvalDate?: string;
  effectiveDate?: string; // Recorded separately from approval date per FR-006 & FR-014
  providerLinkDate?: string;
  revalidationDate?: string;
  expirationDate?: string;
  
  // Follow-up Tracking
  followUps: FollowUpEntry[];
  nextFollowUpDate?: string;
  lastFollowUpDate?: string;
  isOverdue: boolean;
  daysInCurrentStage: number;
  totalCycleDays: number;
  
  // Checklist & Requirements
  checklist: ChecklistItem[];
  documents: DocumentItem[];
  
  // Entity & DBA Validation Engine
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
  
  createdAt: string;
  updatedAt: string;
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
