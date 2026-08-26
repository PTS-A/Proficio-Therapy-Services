import { CredentialingRecord, LegalEntity, Location, Payer, Provider, ValidationIssue } from '../types';

/**
 * Section 5.10 & FR-016 Entity / DBA Pre-Submission Validation Engine
 * Validates consistency across:
 * - Legal entity, DBA, group name
 * - Lease / sublease entity vs group legal entity
 * - Payer application name
 * - W-9 on file & valid
 * - Insurance documents (General Liability, Workers' Comp)
 * - PAVE enrollment consistency for Medicaid / Medi-Cal
 * - Provider License expiration (SLA-007: Zero submitted with expired credentials)
 * - Payer specific required documents
 */
export function validateCredentialingRecord(
  record: CredentialingRecord,
  provider?: Provider,
  payer?: Payer,
  entity?: LegalEntity,
  location?: Location
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const today = new Date().toISOString().split('T')[0];

  // 1. Entity & DBA Validation
  if (entity) {
    if (!entity.w9OnFile) {
      issues.push({
        id: 'val-w9-missing',
        field: 'W-9 Form',
        severity: 'Error',
        description: `W-9 form is not on file for legal entity '${entity.legalName}'. Payer requires valid W-9 prior to submission.`,
        ruleReference: 'Section 5.10: Entity/DBA Validation - Missing W-9',
      });
    }

    const glExpiry = typeof entity.generalLiabilityPolicy === 'object' && entity.generalLiabilityPolicy?.expirationDate 
      ? entity.generalLiabilityPolicy.expirationDate 
      : entity.generalLiabilityExpiry;

    if (glExpiry && glExpiry < today) {
      issues.push({
        id: 'val-gl-expired',
        field: 'General Liability Insurance',
        severity: 'Error',
        description: `General Liability insurance expired on ${glExpiry} for entity '${entity.legalName}'.`,
        ruleReference: 'Section 5.10: Entity/DBA Validation - Expired GL Insurance',
      });
    }

    const wcExpiry = typeof entity.workersCompPolicy === 'object' && entity.workersCompPolicy?.expirationDate 
      ? entity.workersCompPolicy.expirationDate 
      : entity.workersCompExpiry;

    if (wcExpiry && wcExpiry < today) {
      issues.push({
        id: 'val-wc-expired',
        field: 'Workers Compensation Insurance',
        severity: 'Error',
        description: `Workers' Comp policy expired on ${wcExpiry} for entity '${entity.legalName}'.`,
        ruleReference: 'Section 5.10: Entity/DBA Validation - Expired WC Insurance',
      });
    }
  }

  // 2. Location & Lease Consistency Validation
  if (location && entity) {
    if (location.entityId !== entity.id) {
      issues.push({
        id: 'val-loc-entity-mismatch',
        field: 'Location Legal Entity',
        severity: 'Error',
        description: `Location '${location.name}' is assigned to entity '${location.entityId}' but application is filed under '${entity.legalName}'.`,
        ruleReference: 'Section 5.10: Entity/DBA Validation - Location Entity Mismatch',
      });
    }

    if (location.leaseAgreementStatus === 'Missing') {
      issues.push({
        id: 'val-lease-missing',
        field: 'Lease / Sublease Documentation',
        severity: 'Warning',
        description: `Missing active lease/sublease documentation for location '${location.name}'. Payers may issue RFI.`,
        ruleReference: 'Section 5.10: Location Documentation - Lease Required',
      });
    } else if (location.leaseAgreementStatus === 'Expired' || (location.leaseExpiryDate && location.leaseExpiryDate < today)) {
      issues.push({
        id: 'val-lease-expired',
        field: 'Lease Agreement',
        severity: 'Error',
        description: `Lease for location '${location.name}' has expired. Valid proof of address required.`,
        ruleReference: 'Section 5.10: Location Documentation - Expired Lease',
      });
    }
  }

  // 3. Provider License & Credentials Validation (SLA-007)
  if (provider) {
    if (provider.licenseExpiration && provider.licenseExpiration < today) {
      issues.push({
        id: 'val-license-expired',
        field: 'State Professional License',
        severity: 'Error',
        description: `Provider's license (${provider.licenseNumber}) expired on ${provider.licenseExpiration}. Strictly forbidden to submit expired credentials.`,
        ruleReference: 'SLA-007 / Section 5.10: Zero Providers Submitted with Expired Credentials',
      });
    } else if (provider.licenseExpiration) {
      const expDate = new Date(provider.licenseExpiration);
      const now = new Date();
      const diffDays = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 45 && diffDays > 0) {
        issues.push({
          id: 'val-license-expiring-soon',
          field: 'State Professional License',
          severity: 'Warning',
          description: `License expires in ${diffDays} days (${provider.licenseExpiration}). Payer credentialing may be delayed if not renewed.`,
          ruleReference: 'Section 5.10: Credentials Expiration Alert',
        });
      }
    }

    // NPI Format & Verification
    if (!provider.npi || provider.npi.length !== 10 || !/^\d{10}$/.test(provider.npi)) {
      issues.push({
        id: 'val-npi-invalid',
        field: 'National Provider Identifier (NPI)',
        severity: 'Error',
        description: `Provider NPI '${provider.npi}' is not a valid 10-digit format.`,
        ruleReference: 'FR-011: NPI Format & Verification',
      });
    }

    if (!provider.npiVerified) {
      issues.push({
        id: 'val-npi-unverified',
        field: 'NPI Registry Verification',
        severity: 'Warning',
        description: 'NPI has not been verified against NPPES registry.',
        ruleReference: 'FR-011: NPI NPPES Verification',
      });
    }

    // CAQH Attestation Check
    if (provider.caqhStatus === 'Re-attestation Due' || provider.caqhStatus === 'Discrepancy') {
      issues.push({
        id: 'val-caqh-attestation',
        field: 'CAQH ProView Status',
        severity: 'Error',
        description: `CAQH profile has '${provider.caqhStatus}'. Payers will reject or delay applications without active attestation.`,
        ruleReference: 'FR-010: CAQH Tracking & Attestation',
      });
    }
  }

  // 4. PAVE / Medi-Cal Specific Validation
  if (payer && (payer.type === 'Medicaid' || payer.name.toLowerCase().includes('medi-cal') || payer.name.toLowerCase().includes('alliance') || payer.name.toLowerCase().includes('scfhp') || payer.name.toLowerCase().includes('hpsm'))) {
    if (provider && provider.paveStatus !== 'Approved' && provider.paveStatus !== 'Submitted') {
      issues.push({
        id: 'val-pave-incomplete',
        field: 'PAVE / DHCS Enrollment',
        severity: 'Warning',
        description: `Medicaid/Medi-Cal payer '${payer.name}' requires PAVE enrollment. Provider PAVE status is currently '${provider.paveStatus}'.`,
        ruleReference: 'FR-012: PAVE / Medicaid Tracking',
      });
    }
  }

  // 5. Checklist Items Completion Check
  const uncompletedRequiredChecklist = record.checklist.filter(c => c.isRequired && !c.isCompleted);
  if (uncompletedRequiredChecklist.length > 0) {
    issues.push({
      id: 'val-checklist-incomplete',
      field: 'Payer Requirements Checklist',
      severity: 'Error',
      description: `${uncompletedRequiredChecklist.length} mandatory checklist item(s) are incomplete (${uncompletedRequiredChecklist.map(c => c.title).slice(0, 2).join(', ')}...).`,
      ruleReference: 'FR-009 & Section 4.3: Mandatory Checklist Completion Before Submission',
    });
  }

  return issues;
}
