// Auto-generated production credentialing pipeline records from verified clinical staff matrices
import { CredentialingRecord } from '../types';

export const INITIAL_CREDENTIALING_RECORDS: CredentialingRecord[] = [
  {
    "id": "APP-2026-0001",
    "providerId": "prv-ages-rbt-anthony-flores",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0001-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0001-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0001-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0001-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0001-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0001-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0001-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Anthony Flores with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0001-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0002",
    "providerId": "prv-ages-rbt-cynthia-hernandez-ambriz",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0002-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0002-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0002-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0002-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0002-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0002-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0002-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Cynthia Hernandez Ambriz with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0002-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0002-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0003",
    "providerId": "prv-ages-rbt-leslie-loi",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0003-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0003-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0003-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0003-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0003-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0003-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0003-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Leslie Loi with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0003-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0003-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0004",
    "providerId": "prv-ages-rbt-meliya-norton",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0004-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0004-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0004-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0004-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0004-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0004-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0004-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Meliya Norton with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0004-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0004-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0005",
    "providerId": "prv-ages-rbt-pilar-moreno",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0005-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0005-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0005-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0005-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0005-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0005-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0005-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Pilar Moreno with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0005-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0005-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0006",
    "providerId": "prv-ages-rbt-marla-martinez",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0006-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0006-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0006-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0006-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0006-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0006-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0006-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Marla Martinez with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0006-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0006-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0007",
    "providerId": "prv-ages-rbt-lena-vidana",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0007-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0007-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0007-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0007-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0007-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0007-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0007-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Lena Vidana with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0007-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0007-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0008",
    "providerId": "prv-ages-rbt-audrey-fenner",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0008-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0008-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0008-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0008-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0008-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0008-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0008-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Audrey Fenner with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0008-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0009",
    "providerId": "prv-ages-rbt-nuha-ibrahim",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0009-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0009-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0009-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0009-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0009-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0009-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0009-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Nuha Ibrahim with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0009-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0009-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0010",
    "providerId": "prv-ages-rbt-tochi-ezeife",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0010-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0010-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0010-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0010-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0010-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0010-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0010-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Tochi Ezeife with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0010-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0010-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0011",
    "providerId": "prv-ages-rbt-gabriel-lopez",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0011-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0011-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0011-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0011-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0011-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0011-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0011-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Gabriel Lopez with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0011-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0011-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0012",
    "providerId": "prv-ages-rbt-elizabeth-vega",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0012-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0012-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0012-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0012-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0012-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0012-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0012-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Elizabeth Vega with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0012-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0012-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0013",
    "providerId": "prv-ages-rbt-aditi-kamboj",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0013-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0013-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0013-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0013-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0013-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0013-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0013-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Aditi Kamboj with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0013-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0013-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0014",
    "providerId": "prv-ages-rbt-ana-reyes-acosta",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0014-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0014-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0014-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0014-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0014-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0014-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0014-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Ana Reyes Acosta with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0014-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0014-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0015",
    "providerId": "prv-ages-rbt-caitlin-scheuer",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0015-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0015-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0015-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0015-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0015-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0015-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0015-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Caitlin Scheuer with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0015-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0016",
    "providerId": "prv-ages-rbt-camary-davis",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0016-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0016-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0016-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0016-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0016-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0016-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0016-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Camary Davis with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0016-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0016-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0017",
    "providerId": "prv-ages-rbt-camille-andes",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0017-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0017-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0017-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0017-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0017-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0017-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0017-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Camille Andes with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0017-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0017-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0018",
    "providerId": "prv-ages-rbt-claudia-cruz",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0018-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0018-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0018-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0018-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0018-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0018-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0018-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Claudia Cruz with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0018-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0018-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0019",
    "providerId": "prv-ages-rbt-colton-hudson",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0019-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0019-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0019-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0019-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0019-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0019-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0019-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Colton Hudson with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0019-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0019-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0020",
    "providerId": "prv-ages-rbt-holly-uibel",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0020-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0020-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0020-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0020-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0020-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0020-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0020-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Holly Uibel with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0020-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0020-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0021",
    "providerId": "prv-ages-rbt-isabel-white",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0021-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0021-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0021-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0021-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0021-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0021-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0021-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Isabel White with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0021-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0021-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0022",
    "providerId": "prv-ages-rbt-isabella-phan",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0022-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0022-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0022-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0022-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0022-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0022-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0022-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Isabella Phan with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0022-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0023",
    "providerId": "prv-ages-rbt-jacqlynn-uribe",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0023-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0023-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0023-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0023-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0023-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0023-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0023-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Jacqlynn Uribe with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0023-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0023-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0024",
    "providerId": "prv-ages-rbt-jasmine-espinoza",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0024-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0024-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0024-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0024-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0024-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0024-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0024-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Jasmine Espinoza with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0024-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0024-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0025",
    "providerId": "prv-ages-rbt-jaspreet-kaur",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0025-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0025-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0025-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0025-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0025-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0025-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0025-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Jaspreet Kaur with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0025-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0025-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0026",
    "providerId": "prv-ages-rbt-jazmine-tostado",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0026-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0026-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0026-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0026-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0026-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0026-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0026-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Jazmine Tostado with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0026-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0026-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0027",
    "providerId": "prv-ages-rbt-jennifer-mislang",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0027-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0027-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0027-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0027-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0027-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0027-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0027-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Jennifer Mislang with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0027-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0027-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0028",
    "providerId": "prv-ages-rbt-jonathan-greene",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0028-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0028-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0028-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0028-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0028-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0028-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0028-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Jonathan Greene with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0028-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0028-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0029",
    "providerId": "prv-ages-rbt-juan-chavez",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0029-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0029-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0029-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0029-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0029-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0029-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0029-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Juan Chavez with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0029-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0030",
    "providerId": "prv-ages-rbt-julianna-david",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0030-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0030-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0030-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0030-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0030-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0030-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0030-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Julianna David with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0030-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0030-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0031",
    "providerId": "prv-ages-rbt-kaitlin-djiusni",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0031-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0031-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0031-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0031-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0031-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0031-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0031-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Kaitlin Djiusni with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0031-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0031-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0032",
    "providerId": "prv-ages-rbt-kyla-kersh",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0032-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0032-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0032-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0032-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0032-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0032-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0032-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Kyla Kersh with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0032-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0032-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0033",
    "providerId": "prv-ages-rbt-lauren-krause",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0033-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0033-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0033-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0033-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0033-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0033-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0033-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Lauren Krause with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0033-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0033-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0034",
    "providerId": "prv-ages-rbt-lisa-latina-michell-sisneroz",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0034-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0034-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0034-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0034-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0034-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0034-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0034-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Lisa Latina Michell Sisneroz with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0034-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0034-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0035",
    "providerId": "prv-ages-rbt-loc-le",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0035-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0035-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0035-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0035-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0035-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0035-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0035-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Loc Le with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0035-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0035-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0036",
    "providerId": "prv-ages-rbt-lois-tolman",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0036-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0036-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0036-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0036-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0036-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0036-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0036-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Lois Tolman with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0036-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0037",
    "providerId": "prv-ages-rbt-marilena-mancias",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0037-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0037-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0037-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0037-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0037-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0037-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0037-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Marilena Mancias with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0037-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0037-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0038",
    "providerId": "prv-ages-rbt-paola-lopez",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0038-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0038-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0038-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0038-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0038-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0038-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0038-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Paola Lopez with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0038-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0038-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0039",
    "providerId": "prv-ages-rbt-raquel-rodriguez",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0039-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0039-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0039-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0039-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0039-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0039-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0039-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Raquel Rodriguez with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0039-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0039-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0040",
    "providerId": "prv-ages-rbt-regen-spendlove",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0040-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0040-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0040-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0040-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0040-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0040-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0040-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Regen Spendlove with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0040-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0040-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0041",
    "providerId": "prv-ages-rbt-reyna-munoz",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0041-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0041-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0041-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0041-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0041-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0041-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0041-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Reyna Munoz with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0041-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0041-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0042",
    "providerId": "prv-ages-rbt-rhett-bruce",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0042-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0042-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0042-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0042-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0042-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0042-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0042-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Rhett Bruce with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0042-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0042-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0043",
    "providerId": "prv-ages-rbt-robinae-devereaux-carter",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0043-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0043-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0043-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0043-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0043-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0043-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0043-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Robinae Devereaux-Carter with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0043-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0044",
    "providerId": "prv-ages-rbt-tiffany-catherine-narducci",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0044-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0044-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0044-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0044-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0044-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0044-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0044-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Tiffany Catherine Narducci with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0044-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0044-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0045",
    "providerId": "prv-ages-rbt-william-fonseca",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0045-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0045-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0045-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0045-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0045-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0045-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0045-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for William Fonseca with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0045-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0045-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0046",
    "providerId": "prv-ages-rbt-william-loera",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0046-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0046-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0046-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0046-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0046-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0046-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0046-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for William Loera with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0046-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0046-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0047",
    "providerId": "prv-ages-rbt-citlally-vallejo",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0047-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0047-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0047-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0047-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0047-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0047-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0047-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Citlally Vallejo with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0047-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0047-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0048",
    "providerId": "prv-ages-rbt-naomi-mascorro",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0048-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0048-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0048-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0048-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0048-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0048-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0048-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Naomi Mascorro with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0048-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0048-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0049",
    "providerId": "prv-ages-rbt-kelsey-kay",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0049-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0049-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0049-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0049-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0049-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0049-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0049-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Kelsey Kay with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0049-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0049-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0050",
    "providerId": "prv-ages-rbt-kevin-stephens",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0050-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0050-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0050-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0050-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0050-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0050-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0050-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Kevin Stephens with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0050-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0051",
    "providerId": "prv-ages-rbt-erik-zehm",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0051-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0051-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0051-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0051-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0051-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0051-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0051-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Erik Zehm with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0051-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0051-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0052",
    "providerId": "prv-ages-rbt-karime-ruiz-alvarez",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0052-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0052-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0052-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0052-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0052-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0052-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0052-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Karime Ruiz Alvarez with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0052-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0052-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0053",
    "providerId": "prv-ages-rbt-leneea-gaither",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0053-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0053-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0053-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0053-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0053-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0053-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0053-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Leneea Gaither with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0053-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0053-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0054",
    "providerId": "prv-ages-rbt-lissette-esperanza",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0054-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0054-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0054-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0054-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0054-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0054-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0054-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Lissette Esperanza with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0054-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0054-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0055",
    "providerId": "prv-ages-rbt-marissa-napier",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0055-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0055-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0055-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0055-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0055-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0055-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0055-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Marissa Napier with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0055-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0055-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0056",
    "providerId": "prv-ages-rbt-noah-johnson",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Linked",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0056-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Approved and rostered under Catalight ABA network contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and rostered under Catalight ABA network contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0056-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0056-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0056-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0056-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0056-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and rostered under Catalight ABA network contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0056-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Noah Johnson with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0056-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Linked",
        "notes": "Approved and rostered under Catalight ABA network contract."
      },
      {
        "id": "aud-APP-2026-0056-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Catalight (Easterseals / Behavioral Health). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0057",
    "providerId": "prv-ages-rbt-zoe-zettas",
    "payerId": "pyr-catalight",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0057-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-18",
        "method": "Portal",
        "contactPerson": "Catalight (Easterseals / Behavioral Health) Provider Relations Analyst",
        "referenceNumber": "REF-CAT-2026",
        "payerResponse": "Catalight technician roster submitted and pending acknowledgment.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "nextFollowUpDate": "2026-10-18",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0057-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0057-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0057-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0057-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0057-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Catalight technician roster submitted and pending acknowledgment.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0057-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Zoe Zettas with Catalight (Easterseals / Behavioral Health)."
      },
      {
        "id": "aud-APP-2026-0057-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Catalight technician roster submitted and pending acknowledgment."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0058",
    "providerId": "prv-ages-bcba-erica-bustos",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0058-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0058-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0058-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0058-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0058-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0058-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0058-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Erica Bustos with Aetna."
      },
      {
        "id": "aud-APP-2026-0058-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0058-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0059",
    "providerId": "prv-ages-bcba-manjot-sandhu",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0059-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0059-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0059-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0059-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0059-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0059-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0059-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Manjot Sandhu with Aetna."
      },
      {
        "id": "aud-APP-2026-0059-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0059-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0060",
    "providerId": "prv-ages-bcba-natasha-chaudhry",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0060-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0060-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0060-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0060-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0060-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0060-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0060-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Natasha Chaudhry with Aetna."
      },
      {
        "id": "aud-APP-2026-0060-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0060-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0061",
    "providerId": "prv-ages-bcba-peter-chen",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0061-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0061-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0061-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0061-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0061-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0061-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0061-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Peter Chen with Aetna."
      },
      {
        "id": "aud-APP-2026-0061-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0061-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0062",
    "providerId": "prv-ages-bcba-angela-jung",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0062-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0062-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0062-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0062-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0062-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0062-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0062-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Angela Jung with Aetna."
      },
      {
        "id": "aud-APP-2026-0062-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0062-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0063",
    "providerId": "prv-ages-bcba-angela-jung",
    "payerId": "pyr-tricare",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0063-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-16",
        "method": "Portal",
        "contactPerson": "Tricare (West Region / HNFS) Provider Relations Analyst",
        "referenceNumber": "REF-TRI-2026",
        "payerResponse": "Application under active payer committee review with Tricare (West Region / HNFS).",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application under active payer committee review with Tricare (West Region / HNFS)."
      }
    ],
    "nextFollowUpDate": "2026-10-16",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0063-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0063-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0063-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0063-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0063-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application under active payer committee review with Tricare (West Region / HNFS).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0063-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Angela Jung with Tricare (West Region / HNFS)."
      },
      {
        "id": "aud-APP-2026-0063-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Application under active payer committee review with Tricare (West Region / HNFS)."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0064",
    "providerId": "prv-ages-bcba-keiko-ushijima-mwesigwa",
    "payerId": "pyr-bsc",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0064-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Blue Shield of California Provider Relations Analyst",
        "referenceNumber": "REF-BLU-2026",
        "payerResponse": "Approved and contracted with Blue Shield of California.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Blue Shield of California."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0064-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0064-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0064-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0064-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0064-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Blue Shield of California.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0064-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Keiko Ushijima-Mwesigwa with Blue Shield of California."
      },
      {
        "id": "aud-APP-2026-0064-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Blue Shield of California."
      },
      {
        "id": "aud-APP-2026-0064-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Blue Shield of California. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0065",
    "providerId": "prv-ages-bcba-keiko-ushijima-mwesigwa",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0065-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-16",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Application under active payer committee review with Aetna.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application under active payer committee review with Aetna."
      }
    ],
    "nextFollowUpDate": "2026-10-16",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0065-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0065-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0065-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0065-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0065-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application under active payer committee review with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0065-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Keiko Ushijima-Mwesigwa with Aetna."
      },
      {
        "id": "aud-APP-2026-0065-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Application under active payer committee review with Aetna."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0066",
    "providerId": "prv-ages-bcba-keiko-ushijima-mwesigwa",
    "payerId": "pyr-contra-costa",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Overdue",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-05-01",
    "documentsRequestedDate": "2026-05-01",
    "documentsReceivedDate": "2026-05-01",
    "documentsCompleteDate": "2026-05-01",
    "submissionDate": "2026-05-12",
    "targetTurnaroundDate": "2026-07-20",
    "followUps": [
      {
        "id": "fu-APP-2026-0066-1",
        "date": "2026-05-28",
        "nextFollowUpDate": "2026-07-15",
        "method": "Portal",
        "contactPerson": "Contra Costa Health Plan (CCHP) Provider Relations Analyst",
        "referenceNumber": "REF-CON-2026",
        "payerResponse": "Contra Costa Health Plan committee backlog. Scheduled follow-up lapsed on 07/15/2026.",
        "nextAction": "Escalation call to Provider Relations supervisor.",
        "isEscalated": true,
        "escalatedTo": "Centralized Credentialing Lead",
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Contra Costa Health Plan committee backlog. Scheduled follow-up lapsed on 07/15/2026."
      }
    ],
    "nextFollowUpDate": "2026-07-15",
    "lastFollowUpDate": "2026-05-28",
    "isOverdue": true,
    "daysInCurrentStage": 52,
    "totalCycleDays": 98,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0066-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0066-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0066-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0066-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0066-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Contra Costa Health Plan committee backlog. Scheduled follow-up lapsed on 07/15/2026.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0066-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-01 09:30",
        "notes": "Intake initialized for Keiko Ushijima-Mwesigwa with Contra Costa Health Plan (CCHP)."
      },
      {
        "id": "aud-APP-2026-0066-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-12 11:00",
        "previousValue": "Intake",
        "newValue": "Overdue",
        "notes": "Contra Costa Health Plan committee backlog. Scheduled follow-up lapsed on 07/15/2026."
      }
    ],
    "createdAt": "2026-05-01",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "APP-2026-0067",
    "providerId": "prv-ages-bcba-kristi-lui",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0067-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0067-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0067-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0067-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0067-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0067-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0067-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Kristi Lui with Aetna."
      },
      {
        "id": "aud-APP-2026-0067-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0067-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0068",
    "providerId": "prv-ages-bcba-kristi-lui",
    "payerId": "pyr-tricare",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0068-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-16",
        "method": "Portal",
        "contactPerson": "Tricare (West Region / HNFS) Provider Relations Analyst",
        "referenceNumber": "REF-TRI-2026",
        "payerResponse": "Application under active payer committee review with Tricare (West Region / HNFS).",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application under active payer committee review with Tricare (West Region / HNFS)."
      }
    ],
    "nextFollowUpDate": "2026-10-16",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0068-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0068-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0068-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0068-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0068-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application under active payer committee review with Tricare (West Region / HNFS).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0068-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Kristi Lui with Tricare (West Region / HNFS)."
      },
      {
        "id": "aud-APP-2026-0068-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Application under active payer committee review with Tricare (West Region / HNFS)."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0069",
    "providerId": "prv-ages-bcba-darcy-machado",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0069-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0069-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0069-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0069-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0069-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0069-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0069-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Darcy Machado with Aetna."
      },
      {
        "id": "aud-APP-2026-0069-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0069-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0070",
    "providerId": "prv-ages-bcba-hailey-james",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0070-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0070-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0070-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0070-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0070-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0070-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0070-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Hailey James with Aetna."
      },
      {
        "id": "aud-APP-2026-0070-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0070-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0071",
    "providerId": "prv-ages-bcba-hailey-james",
    "payerId": "pyr-bsc",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0071-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-16",
        "method": "Portal",
        "contactPerson": "Blue Shield of California Provider Relations Analyst",
        "referenceNumber": "REF-BLU-2026",
        "payerResponse": "Application under active payer committee review with Blue Shield of California.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application under active payer committee review with Blue Shield of California."
      }
    ],
    "nextFollowUpDate": "2026-10-16",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0071-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0071-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0071-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0071-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0071-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application under active payer committee review with Blue Shield of California.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0071-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Hailey James with Blue Shield of California."
      },
      {
        "id": "aud-APP-2026-0071-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Application under active payer committee review with Blue Shield of California."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0072",
    "providerId": "prv-ages-bcba-hailey-james",
    "payerId": "pyr-cigna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Overdue",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-05-01",
    "documentsRequestedDate": "2026-05-01",
    "documentsReceivedDate": "2026-05-01",
    "documentsCompleteDate": "2026-05-01",
    "submissionDate": "2026-05-12",
    "targetTurnaroundDate": "2026-07-20",
    "followUps": [
      {
        "id": "fu-APP-2026-0072-1",
        "date": "2026-05-28",
        "nextFollowUpDate": "2026-06-25",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "License copy sent on 05/17/2026. 30 business day TAT lapsed since 06/25/2026. Call ref# RIZC06252026.",
        "nextAction": "Escalation call to Provider Relations supervisor.",
        "isEscalated": true,
        "escalatedTo": "Centralized Credentialing Lead",
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "License copy sent on 05/17/2026. 30 business day TAT lapsed since 06/25/2026. Call ref# RIZC06252026."
      }
    ],
    "nextFollowUpDate": "2026-06-25",
    "lastFollowUpDate": "2026-05-28",
    "isOverdue": true,
    "daysInCurrentStage": 52,
    "totalCycleDays": 98,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0072-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0072-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0072-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0072-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0072-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "License copy sent on 05/17/2026. 30 business day TAT lapsed since 06/25/2026. Call ref# RIZC06252026.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0072-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-01 09:30",
        "notes": "Intake initialized for Hailey James with Cigna."
      },
      {
        "id": "aud-APP-2026-0072-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-12 11:00",
        "previousValue": "Intake",
        "newValue": "Overdue",
        "notes": "License copy sent on 05/17/2026. 30 business day TAT lapsed since 06/25/2026. Call ref# RIZC06252026."
      }
    ],
    "createdAt": "2026-05-01",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "APP-2026-0073",
    "providerId": "prv-ages-bcba-elise-newman",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0073-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0073-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0073-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0073-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0073-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0073-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0073-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Elise Newman with Aetna."
      },
      {
        "id": "aud-APP-2026-0073-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0073-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0074",
    "providerId": "prv-ages-bcba-elise-newman",
    "payerId": "pyr-cigna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0074-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-16",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Application under active payer committee review with Cigna.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application under active payer committee review with Cigna."
      }
    ],
    "nextFollowUpDate": "2026-10-16",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0074-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0074-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0074-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0074-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0074-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application under active payer committee review with Cigna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0074-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Elise Newman with Cigna."
      },
      {
        "id": "aud-APP-2026-0074-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Application under active payer committee review with Cigna."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0075",
    "providerId": "prv-ages-bcba-jacob-lopez",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0075-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0075-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0075-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0075-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0075-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0075-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0075-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Jacob Lopez with Aetna."
      },
      {
        "id": "aud-APP-2026-0075-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0075-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0076",
    "providerId": "prv-ages-bcba-jacob-lopez",
    "payerId": "pyr-scfhp",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0076-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-16",
        "method": "Portal",
        "contactPerson": "SCFHP (Santa Clara Family Health Plan) Provider Relations Analyst",
        "referenceNumber": "REF-SCF-2026",
        "payerResponse": "Application under active payer committee review with SCFHP (Santa Clara Family Health Plan).",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application under active payer committee review with SCFHP (Santa Clara Family Health Plan)."
      }
    ],
    "nextFollowUpDate": "2026-10-16",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0076-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0076-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0076-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0076-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0076-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application under active payer committee review with SCFHP (Santa Clara Family Health Plan).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0076-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Jacob Lopez with SCFHP (Santa Clara Family Health Plan)."
      },
      {
        "id": "aud-APP-2026-0076-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Application under active payer committee review with SCFHP (Santa Clara Family Health Plan)."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0077",
    "providerId": "prv-ages-bcba-jacob-lopez",
    "payerId": "pyr-bsc",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Overdue",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-05-01",
    "documentsRequestedDate": "2026-05-01",
    "documentsReceivedDate": "2026-05-01",
    "documentsCompleteDate": "2026-05-01",
    "submissionDate": "2026-05-12",
    "targetTurnaroundDate": "2026-07-20",
    "followUps": [
      {
        "id": "fu-APP-2026-0077-1",
        "date": "2026-05-28",
        "nextFollowUpDate": "2026-06-12",
        "method": "Portal",
        "contactPerson": "Blue Shield of California Provider Relations Analyst",
        "referenceNumber": "REF-BLU-2026",
        "payerResponse": "Jacob's application in 4th stage. Req Id 73861165. Follow-up lapsed since 06/12/2026.",
        "nextAction": "Escalation call to Provider Relations supervisor.",
        "isEscalated": true,
        "escalatedTo": "Centralized Credentialing Lead",
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Jacob's application in 4th stage. Req Id 73861165. Follow-up lapsed since 06/12/2026."
      }
    ],
    "nextFollowUpDate": "2026-06-12",
    "lastFollowUpDate": "2026-05-28",
    "isOverdue": true,
    "daysInCurrentStage": 52,
    "totalCycleDays": 98,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0077-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0077-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0077-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0077-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0077-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Jacob's application in 4th stage. Req Id 73861165. Follow-up lapsed since 06/12/2026.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0077-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-01 09:30",
        "notes": "Intake initialized for Jacob Lopez with Blue Shield of California."
      },
      {
        "id": "aud-APP-2026-0077-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-12 11:00",
        "previousValue": "Intake",
        "newValue": "Overdue",
        "notes": "Jacob's application in 4th stage. Req Id 73861165. Follow-up lapsed since 06/12/2026."
      }
    ],
    "createdAt": "2026-05-01",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "APP-2026-0078",
    "providerId": "prv-ages-bcba-brittany-stack",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0078-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0078-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0078-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0078-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0078-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0078-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0078-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Brittany Stack with Aetna."
      },
      {
        "id": "aud-APP-2026-0078-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0078-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0079",
    "providerId": "prv-ages-bcba-brittany-stack",
    "payerId": "pyr-scfhp",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0079-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-16",
        "method": "Portal",
        "contactPerson": "SCFHP (Santa Clara Family Health Plan) Provider Relations Analyst",
        "referenceNumber": "REF-SCF-2026",
        "payerResponse": "Application under active payer committee review with SCFHP (Santa Clara Family Health Plan).",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application under active payer committee review with SCFHP (Santa Clara Family Health Plan)."
      }
    ],
    "nextFollowUpDate": "2026-10-16",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0079-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0079-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0079-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0079-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0079-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application under active payer committee review with SCFHP (Santa Clara Family Health Plan).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0079-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Brittany Stack with SCFHP (Santa Clara Family Health Plan)."
      },
      {
        "id": "aud-APP-2026-0079-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Application under active payer committee review with SCFHP (Santa Clara Family Health Plan)."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0080",
    "providerId": "prv-ages-bcba-brittany-stack",
    "payerId": "pyr-bsc",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Overdue",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-05-01",
    "documentsRequestedDate": "2026-05-01",
    "documentsReceivedDate": "2026-05-01",
    "documentsCompleteDate": "2026-05-01",
    "submissionDate": "2026-05-12",
    "targetTurnaroundDate": "2026-07-20",
    "followUps": [
      {
        "id": "fu-APP-2026-0080-1",
        "date": "2026-05-28",
        "nextFollowUpDate": "2026-06-12",
        "method": "Portal",
        "contactPerson": "Blue Shield of California Provider Relations Analyst",
        "referenceNumber": "REF-BLU-2026",
        "payerResponse": "Follow up due 06/12/2026. Lapsed without response.",
        "nextAction": "Escalation call to Provider Relations supervisor.",
        "isEscalated": true,
        "escalatedTo": "Centralized Credentialing Lead",
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Follow up due 06/12/2026. Lapsed without response."
      }
    ],
    "nextFollowUpDate": "2026-06-12",
    "lastFollowUpDate": "2026-05-28",
    "isOverdue": true,
    "daysInCurrentStage": 52,
    "totalCycleDays": 98,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0080-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0080-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0080-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0080-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0080-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Follow up due 06/12/2026. Lapsed without response.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0080-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-01 09:30",
        "notes": "Intake initialized for Brittany Stack with Blue Shield of California."
      },
      {
        "id": "aud-APP-2026-0080-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-12 11:00",
        "previousValue": "Intake",
        "newValue": "Overdue",
        "notes": "Follow up due 06/12/2026. Lapsed without response."
      }
    ],
    "createdAt": "2026-05-01",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "APP-2026-0081",
    "providerId": "prv-ages-bcba-jade-saechao",
    "payerId": "pyr-ubh",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0081-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "UBH (United Behavioral Health / Optum) Provider Relations Analyst",
        "referenceNumber": "REF-UBH-2026",
        "payerResponse": "Approved and contracted with UBH (United Behavioral Health / Optum).",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with UBH (United Behavioral Health / Optum)."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0081-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0081-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0081-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0081-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0081-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with UBH (United Behavioral Health / Optum).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0081-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Jade Saechao with UBH (United Behavioral Health / Optum)."
      },
      {
        "id": "aud-APP-2026-0081-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with UBH (United Behavioral Health / Optum)."
      },
      {
        "id": "aud-APP-2026-0081-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from UBH (United Behavioral Health / Optum). Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0082",
    "providerId": "prv-ages-bcba-jade-saechao",
    "payerId": "pyr-cigna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0082-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-16",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Application under active payer committee review with Cigna.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application under active payer committee review with Cigna."
      }
    ],
    "nextFollowUpDate": "2026-10-16",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0082-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0082-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0082-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0082-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0082-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application under active payer committee review with Cigna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0082-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Jade Saechao with Cigna."
      },
      {
        "id": "aud-APP-2026-0082-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Application under active payer committee review with Cigna."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0083",
    "providerId": "prv-ages-bcba-jade-saechao",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Overdue",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-05-01",
    "documentsRequestedDate": "2026-05-01",
    "documentsReceivedDate": "2026-05-01",
    "documentsCompleteDate": "2026-05-01",
    "submissionDate": "2026-05-12",
    "targetTurnaroundDate": "2026-07-20",
    "followUps": [
      {
        "id": "fu-APP-2026-0083-1",
        "date": "2026-05-28",
        "nextFollowUpDate": "2026-07-20",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Initial submission follow-up lapsed beyond 60 business days.",
        "nextAction": "Escalation call to Provider Relations supervisor.",
        "isEscalated": true,
        "escalatedTo": "Centralized Credentialing Lead",
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Initial submission follow-up lapsed beyond 60 business days."
      }
    ],
    "nextFollowUpDate": "2026-07-20",
    "lastFollowUpDate": "2026-05-28",
    "isOverdue": true,
    "daysInCurrentStage": 52,
    "totalCycleDays": 98,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0083-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0083-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0083-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0083-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0083-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Initial submission follow-up lapsed beyond 60 business days.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0083-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-01 09:30",
        "notes": "Intake initialized for Jade Saechao with Aetna."
      },
      {
        "id": "aud-APP-2026-0083-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-12 11:00",
        "previousValue": "Intake",
        "newValue": "Overdue",
        "notes": "Initial submission follow-up lapsed beyond 60 business days."
      }
    ],
    "createdAt": "2026-05-01",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "APP-2026-0084",
    "providerId": "prv-ages-bcba-sasha-torres",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0084-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0084-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0084-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0084-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0084-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0084-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0084-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Sasha Torres with Aetna."
      },
      {
        "id": "aud-APP-2026-0084-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0084-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0085",
    "providerId": "prv-ages-bcba-sasha-torres",
    "payerId": "pyr-medical",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Additional Documents Requested",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0085-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-09",
        "method": "Portal",
        "contactPerson": "Medi-Cal (DHCS) Provider Relations Analyst",
        "referenceNumber": "REF-MED-2026",
        "payerResponse": "Application pending signature from clinician before submission to state portal.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application pending signature from clinician before submission to state portal."
      }
    ],
    "nextFollowUpDate": "2026-10-09",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0085-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0085-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0085-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0085-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0085-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Application pending signature from clinician before submission to state portal.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0085-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Sasha Torres with Medi-Cal (DHCS)."
      },
      {
        "id": "aud-APP-2026-0085-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Additional Documents Requested",
        "notes": "Application pending signature from clinician before submission to state portal."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0086",
    "providerId": "prv-ages-bcba-brianna-bader",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0086-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0086-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0086-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0086-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0086-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0086-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0086-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Brianna Bader with Aetna."
      },
      {
        "id": "aud-APP-2026-0086-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0086-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0087",
    "providerId": "prv-ages-bcba-brianna-bader",
    "payerId": "pyr-medical",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Additional Documents Requested",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0087-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-09",
        "method": "Portal",
        "contactPerson": "Medi-Cal (DHCS) Provider Relations Analyst",
        "referenceNumber": "REF-MED-2026",
        "payerResponse": "Application pending clinician signature.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application pending clinician signature."
      }
    ],
    "nextFollowUpDate": "2026-10-09",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0087-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0087-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0087-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0087-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0087-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Application pending clinician signature.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0087-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Brianna Bader with Medi-Cal (DHCS)."
      },
      {
        "id": "aud-APP-2026-0087-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Additional Documents Requested",
        "notes": "Application pending clinician signature."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0088",
    "providerId": "prv-ages-bcba-meghan-moriana",
    "payerId": "pyr-aetna",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0088-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Approved and contracted with Aetna.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Approved and contracted with Aetna."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0088-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0088-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0088-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0088-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0088-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Approved and contracted with Aetna.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0088-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Meghan Moriana with Aetna."
      },
      {
        "id": "aud-APP-2026-0088-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Approved and contracted with Aetna."
      },
      {
        "id": "aud-APP-2026-0088-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0089",
    "providerId": "prv-ages-bcba-meghan-moriana",
    "payerId": "pyr-partnership",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Additional Documents Requested",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0089-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-09",
        "method": "Portal",
        "contactPerson": "Partnership HealthPlan of California Provider Relations Analyst",
        "referenceNumber": "REF-PAR-2026",
        "payerResponse": "Didn't receive clinician signature yet for Partnership credentialing packet.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Didn't receive clinician signature yet for Partnership credentialing packet."
      }
    ],
    "nextFollowUpDate": "2026-10-09",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0089-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0089-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0089-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0089-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0089-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Didn't receive clinician signature yet for Partnership credentialing packet.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0089-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Meghan Moriana with Partnership HealthPlan of California."
      },
      {
        "id": "aud-APP-2026-0089-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Additional Documents Requested",
        "notes": "Didn't receive clinician signature yet for Partnership credentialing packet."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0090",
    "providerId": "prv-ages-bcba-amy-heaps",
    "payerId": "pyr-selecthealth",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0090-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "SelectHealth Provider Relations Analyst",
        "referenceNumber": "REF-SEL-2026",
        "payerResponse": "All Utah BCBAs contracted under commercial plan.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "All Utah BCBAs contracted under commercial plan."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0090-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0090-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0090-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0090-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0090-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "All Utah BCBAs contracted under commercial plan.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0090-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Amy Heaps with SelectHealth."
      },
      {
        "id": "aud-APP-2026-0090-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "All Utah BCBAs contracted under commercial plan."
      },
      {
        "id": "aud-APP-2026-0090-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from SelectHealth. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0091",
    "providerId": "prv-ages-bcba-amy-heaps",
    "payerId": "pyr-utmedicaid",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Additional Documents Requested",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0091-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-11",
        "method": "Portal",
        "contactPerson": "Utah Medicaid Provider Relations Analyst",
        "referenceNumber": "REF-UTA-2026",
        "payerResponse": "Roster submitted to UT Medicaid. Commercial approved, awaiting state Medicaid account linking.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Roster submitted to UT Medicaid. Commercial approved, awaiting state Medicaid account linking."
      }
    ],
    "nextFollowUpDate": "2026-10-11",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0091-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0091-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0091-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0091-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0091-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Roster submitted to UT Medicaid. Commercial approved, awaiting state Medicaid account linking.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0091-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Amy Heaps with Utah Medicaid."
      },
      {
        "id": "aud-APP-2026-0091-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Additional Documents Requested",
        "notes": "Roster submitted to UT Medicaid. Commercial approved, awaiting state Medicaid account linking."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0092",
    "providerId": "prv-ages-bcba-andrea-mathews",
    "payerId": "pyr-selecthealth",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0092-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "SelectHealth Provider Relations Analyst",
        "referenceNumber": "REF-SEL-2026",
        "payerResponse": "All Utah BCBAs contracted under commercial plan.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "All Utah BCBAs contracted under commercial plan."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0092-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0092-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0092-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0092-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0092-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "All Utah BCBAs contracted under commercial plan.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0092-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Andrea Mathews with SelectHealth."
      },
      {
        "id": "aud-APP-2026-0092-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "All Utah BCBAs contracted under commercial plan."
      },
      {
        "id": "aud-APP-2026-0092-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from SelectHealth. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0093",
    "providerId": "prv-ages-bcba-andrea-mathews",
    "payerId": "pyr-utmedicaid",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0093-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-20",
        "method": "Portal",
        "contactPerson": "Utah Medicaid Provider Relations Analyst",
        "referenceNumber": "REF-UTA-2026",
        "payerResponse": "Application in active Utah Medicaid queue.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application in active Utah Medicaid queue."
      }
    ],
    "nextFollowUpDate": "2026-10-20",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0093-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0093-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0093-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0093-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0093-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application in active Utah Medicaid queue.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0093-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Andrea Mathews with Utah Medicaid."
      },
      {
        "id": "aud-APP-2026-0093-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Application in active Utah Medicaid queue."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0094",
    "providerId": "prv-ages-bcba-leslie-sundblom",
    "payerId": "pyr-selecthealth",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0094-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "SelectHealth Provider Relations Analyst",
        "referenceNumber": "REF-SEL-2026",
        "payerResponse": "All Utah BCBAs contracted under commercial plan.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "All Utah BCBAs contracted under commercial plan."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0094-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0094-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0094-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0094-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0094-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "All Utah BCBAs contracted under commercial plan.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0094-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Leslie Sundblom with SelectHealth."
      },
      {
        "id": "aud-APP-2026-0094-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "All Utah BCBAs contracted under commercial plan."
      },
      {
        "id": "aud-APP-2026-0094-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from SelectHealth. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0095",
    "providerId": "prv-ages-bcba-leslie-sundblom",
    "payerId": "pyr-utmedicaid",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0095-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-20",
        "method": "Portal",
        "contactPerson": "Utah Medicaid Provider Relations Analyst",
        "referenceNumber": "REF-UTA-2026",
        "payerResponse": "Application in active Utah Medicaid queue.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application in active Utah Medicaid queue."
      }
    ],
    "nextFollowUpDate": "2026-10-20",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0095-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0095-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0095-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0095-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0095-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application in active Utah Medicaid queue.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0095-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Leslie Sundblom with Utah Medicaid."
      },
      {
        "id": "aud-APP-2026-0095-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Application in active Utah Medicaid queue."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0096",
    "providerId": "prv-ages-bcba-johnny-new",
    "payerId": "pyr-selecthealth",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0096-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "SelectHealth Provider Relations Analyst",
        "referenceNumber": "REF-SEL-2026",
        "payerResponse": "All Utah BCBAs contracted under commercial plan.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "All Utah BCBAs contracted under commercial plan."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0096-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0096-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0096-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0096-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0096-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "All Utah BCBAs contracted under commercial plan.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0096-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Johnny New with SelectHealth."
      },
      {
        "id": "aud-APP-2026-0096-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "All Utah BCBAs contracted under commercial plan."
      },
      {
        "id": "aud-APP-2026-0096-3",
        "action": "Approval Logged",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from SelectHealth. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0097",
    "providerId": "prv-ages-bcba-johnny-new",
    "payerId": "pyr-utmedicaid",
    "entityId": "ent-1",
    "locationId": "loc-3",
    "applicationType": "Initial credentialing",
    "discipline": "ABA",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cred-spec",
    "assignedSpecialistName": "Centralized Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0097-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-20",
        "method": "Portal",
        "contactPerson": "Utah Medicaid Provider Relations Analyst",
        "referenceNumber": "REF-UTA-2026",
        "payerResponse": "Application in active Utah Medicaid queue.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cred-spec",
        "specialistName": "Centralized Credentialing Specialist",
        "notes": "Application in active Utah Medicaid queue."
      }
    ],
    "nextFollowUpDate": "2026-10-20",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0097-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0097-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0097-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0097-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0097-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Application in active Utah Medicaid queue.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0097-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Johnny New with Utah Medicaid."
      },
      {
        "id": "aud-APP-2026-0097-2",
        "action": "Stage Transitioned",
        "userId": "usr-cred-spec",
        "userName": "Centralized Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Application in active Utah Medicaid queue."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0098",
    "providerId": "prv-pstg-slp-lauren-pourreau",
    "payerId": "pyr-aetna",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Approved",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0098-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0098-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0098-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0098-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0098-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0098-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0098-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Lauren Pourreau with Aetna."
      },
      {
        "id": "aud-APP-2026-0098-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      },
      {
        "id": "aud-APP-2026-0098-3",
        "action": "Approval Logged",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0099",
    "providerId": "prv-pstg-slp-lauren-pourreau",
    "payerId": "pyr-anthem",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0099-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-19",
        "method": "Portal",
        "contactPerson": "Anthem Provider Relations Analyst",
        "referenceNumber": "REF-ANT-2026",
        "payerResponse": "Roster submitted to payer under group practice location. Application in process.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "nextFollowUpDate": "2026-10-19",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0099-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0099-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0099-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0099-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0099-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Roster submitted to payer under group practice location. Application in process.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0099-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Lauren Pourreau with Anthem."
      },
      {
        "id": "aud-APP-2026-0099-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0100",
    "providerId": "prv-pstg-slp-aruna-radhakrishnan",
    "payerId": "pyr-aetna",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Approved",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0100-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0100-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0100-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0100-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0100-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0100-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0100-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Aruna Radhakrishnan with Aetna."
      },
      {
        "id": "aud-APP-2026-0100-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      },
      {
        "id": "aud-APP-2026-0100-3",
        "action": "Approval Logged",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0101",
    "providerId": "prv-pstg-slp-aruna-radhakrishnan",
    "payerId": "pyr-vhp",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0101-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-19",
        "method": "Portal",
        "contactPerson": "VHP (Valley Health Plan) Provider Relations Analyst",
        "referenceNumber": "REF-VHP-2026",
        "payerResponse": "Roster submitted to payer under group practice location. Application in process.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "nextFollowUpDate": "2026-10-19",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0101-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0101-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0101-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0101-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0101-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Roster submitted to payer under group practice location. Application in process.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0101-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Aruna Radhakrishnan with VHP (Valley Health Plan)."
      },
      {
        "id": "aud-APP-2026-0101-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0102",
    "providerId": "prv-pstg-slp-christine-woods",
    "payerId": "pyr-aetna",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Approved",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0102-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0102-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0102-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0102-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0102-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0102-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0102-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Christine Woods with Aetna."
      },
      {
        "id": "aud-APP-2026-0102-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      },
      {
        "id": "aud-APP-2026-0102-3",
        "action": "Approval Logged",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0103",
    "providerId": "prv-pstg-slp-christine-woods",
    "payerId": "pyr-vhp",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0103-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-19",
        "method": "Portal",
        "contactPerson": "VHP (Valley Health Plan) Provider Relations Analyst",
        "referenceNumber": "REF-VHP-2026",
        "payerResponse": "Roster submitted to payer under group practice location. Application in process.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "nextFollowUpDate": "2026-10-19",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0103-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0103-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0103-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0103-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0103-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Roster submitted to payer under group practice location. Application in process.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0103-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Christine Woods with VHP (Valley Health Plan)."
      },
      {
        "id": "aud-APP-2026-0103-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0104",
    "providerId": "prv-pstg-slp-catherine-doerr",
    "payerId": "pyr-aetna",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Approved",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0104-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0104-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0104-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0104-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0104-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0104-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0104-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Catherine Doerr with Aetna."
      },
      {
        "id": "aud-APP-2026-0104-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      },
      {
        "id": "aud-APP-2026-0104-3",
        "action": "Approval Logged",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0105",
    "providerId": "prv-pstg-slp-catherine-doerr",
    "payerId": "pyr-anthem",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0105-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-19",
        "method": "Portal",
        "contactPerson": "Anthem Provider Relations Analyst",
        "referenceNumber": "REF-ANT-2026",
        "payerResponse": "Roster submitted to payer under group practice location. Application in process.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "nextFollowUpDate": "2026-10-19",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0105-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0105-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0105-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0105-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0105-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Roster submitted to payer under group practice location. Application in process.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0105-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Catherine Doerr with Anthem."
      },
      {
        "id": "aud-APP-2026-0105-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0106",
    "providerId": "prv-pstg-slp-dillon-o-connell",
    "payerId": "pyr-aetna",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Approved",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0106-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0106-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0106-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0106-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0106-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0106-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560).",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0106-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Dillon O'Connell with Aetna."
      },
      {
        "id": "aud-APP-2026-0106-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Credentialed under Proficio Speech Therapy Group (Tax ID 821221807, NPI 1083140560)."
      },
      {
        "id": "aud-APP-2026-0106-3",
        "action": "Approval Logged",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Aetna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0107",
    "providerId": "prv-pstg-slp-dillon-o-connell",
    "payerId": "pyr-anthem",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Payer Review",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0107-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-19",
        "method": "Portal",
        "contactPerson": "Anthem Provider Relations Analyst",
        "referenceNumber": "REF-ANT-2026",
        "payerResponse": "Roster submitted to payer under group practice location. Application in process.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "nextFollowUpDate": "2026-10-19",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0107-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0107-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0107-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0107-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0107-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Roster submitted to payer under group practice location. Application in process.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0107-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Dillon O'Connell with Anthem."
      },
      {
        "id": "aud-APP-2026-0107-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Payer Review",
        "notes": "Roster submitted to payer under group practice location. Application in process."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0108",
    "providerId": "prv-pstg-slp-heather-zamani",
    "payerId": "pyr-anthem",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Additional Documents Requested",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0108-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-12",
        "method": "Portal",
        "contactPerson": "Anthem Provider Relations Analyst",
        "referenceNumber": "REF-ANT-2026",
        "payerResponse": "Heather's application is waiting for clinician signature.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Heather's application is waiting for clinician signature."
      }
    ],
    "nextFollowUpDate": "2026-10-12",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0108-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0108-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0108-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0108-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0108-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Heather's application is waiting for clinician signature.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0108-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Heather Zamani with Anthem."
      },
      {
        "id": "aud-APP-2026-0108-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Additional Documents Requested",
        "notes": "Heather's application is waiting for clinician signature."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0109",
    "providerId": "prv-pstg-slp-jaclyn-magner",
    "payerId": "pyr-anthem",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Correction Required",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0109-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-12",
        "method": "Portal",
        "contactPerson": "Anthem Provider Relations Analyst",
        "referenceNumber": "REF-ANT-2026",
        "payerResponse": "Unable to credential due to temporary license. Awaiting full state license issuance.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Unable to credential due to temporary license. Awaiting full state license issuance."
      }
    ],
    "nextFollowUpDate": "2026-10-12",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0109-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0109-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0109-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0109-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0109-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Unable to credential due to temporary license. Awaiting full state license issuance.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0109-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Jaclyn Magner with Anthem."
      },
      {
        "id": "aud-APP-2026-0109-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Correction Required",
        "notes": "Unable to credential due to temporary license. Awaiting full state license issuance."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0110",
    "providerId": "prv-pstg-slp-shuyi-tong",
    "payerId": "pyr-anthem",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Additional Documents Requested",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0110-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-12",
        "method": "Portal",
        "contactPerson": "Anthem Provider Relations Analyst",
        "referenceNumber": "REF-ANT-2026",
        "payerResponse": "Temporary license holding application. State board follow-up required.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Temporary license holding application. State board follow-up required."
      }
    ],
    "nextFollowUpDate": "2026-10-12",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0110-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0110-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0110-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0110-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0110-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Temporary license holding application. State board follow-up required.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0110-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Shuyi Tong with Anthem."
      },
      {
        "id": "aud-APP-2026-0110-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Additional Documents Requested",
        "notes": "Temporary license holding application. State board follow-up required."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0111",
    "providerId": "prv-pstg-slp-pranali-kalley",
    "payerId": "pyr-aetna",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Additional Documents Requested",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0111-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-12",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Submitted half in portal on 05/21/2024; waiting for more information from provider.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Submitted half in portal on 05/21/2024; waiting for more information from provider."
      }
    ],
    "nextFollowUpDate": "2026-10-12",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0111-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0111-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0111-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0111-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0111-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Submitted half in portal on 05/21/2024; waiting for more information from provider.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0111-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Pranali Kalley with Aetna."
      },
      {
        "id": "aud-APP-2026-0111-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Additional Documents Requested",
        "notes": "Submitted half in portal on 05/21/2024; waiting for more information from provider."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0112",
    "providerId": "prv-pstg-slp-sierra-bone",
    "payerId": "pyr-uhc",
    "entityId": "ent-pstg-inc",
    "locationId": "loc-1",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Additional Documents Requested",
    "assignedSpecialistId": "usr-pstg-spec",
    "assignedSpecialistName": "Proficio Credentialing Specialist",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0112-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-12",
        "method": "Portal",
        "contactPerson": "UnitedHealthcare (UHC) Provider Relations Analyst",
        "referenceNumber": "REF-UNI-2026",
        "payerResponse": "Already credentialed in another group. Need practice location change and W-9 sent to network_physicalhealth@optum.com.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-pstg-spec",
        "specialistName": "Proficio Credentialing Specialist",
        "notes": "Already credentialed in another group. Need practice location change and W-9 sent to network_physicalhealth@optum.com."
      }
    ],
    "nextFollowUpDate": "2026-10-12",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0112-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0112-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0112-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0112-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0112-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Already credentialed in another group. Need practice location change and W-9 sent to network_physicalhealth@optum.com.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0112-1",
        "action": "Created Credentialing Record",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Sierra Bone with UnitedHealthcare (UHC)."
      },
      {
        "id": "aud-APP-2026-0112-2",
        "action": "Stage Transitioned",
        "userId": "usr-pstg-spec",
        "userName": "Proficio Credentialing Specialist",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Additional Documents Requested",
        "notes": "Already credentialed in another group. Need practice location change and W-9 sent to network_physicalhealth@optum.com."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0113",
    "providerId": "prv-cpts-ot-alyssa-barker",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0113-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0113-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0113-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0113-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0113-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0113-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0113-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Alyssa Barker with Cigna."
      },
      {
        "id": "aud-APP-2026-0113-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0113-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0114",
    "providerId": "prv-cpts-ot-alyssa-barker",
    "payerId": "pyr-aetna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0114-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0114-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0114-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0114-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0114-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0114-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0114-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Alyssa Barker with Aetna."
      },
      {
        "id": "aud-APP-2026-0114-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0115",
    "providerId": "prv-cpts-ot-miranda-freeman",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0115-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0115-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0115-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0115-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0115-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0115-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0115-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Miranda Freeman with Cigna."
      },
      {
        "id": "aud-APP-2026-0115-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0115-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0116",
    "providerId": "prv-cpts-ot-miranda-freeman",
    "payerId": "pyr-aetna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0116-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0116-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0116-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0116-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0116-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0116-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0116-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Miranda Freeman with Aetna."
      },
      {
        "id": "aud-APP-2026-0116-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0117",
    "providerId": "prv-cpts-ot-emily-gayton",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0117-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0117-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0117-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0117-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0117-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0117-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0117-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Emily Gayton with Cigna."
      },
      {
        "id": "aud-APP-2026-0117-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0117-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0118",
    "providerId": "prv-cpts-ot-emily-gayton",
    "payerId": "pyr-aetna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0118-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0118-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0118-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0118-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0118-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0118-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0118-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Emily Gayton with Aetna."
      },
      {
        "id": "aud-APP-2026-0118-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0119",
    "providerId": "prv-cpts-ot-keara-greenan",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0119-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0119-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0119-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0119-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0119-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0119-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0119-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Keara Greenan with Cigna."
      },
      {
        "id": "aud-APP-2026-0119-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0119-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0120",
    "providerId": "prv-cpts-ot-keara-greenan",
    "payerId": "pyr-aetna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0120-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0120-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0120-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0120-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0120-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0120-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0120-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Keara Greenan with Aetna."
      },
      {
        "id": "aud-APP-2026-0120-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0121",
    "providerId": "prv-cpts-ot-allison-inloes",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0121-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0121-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0121-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0121-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0121-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0121-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0121-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Allison Inloes with Cigna."
      },
      {
        "id": "aud-APP-2026-0121-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0121-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0122",
    "providerId": "prv-cpts-ot-allison-inloes",
    "payerId": "pyr-aetna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0122-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0122-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0122-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0122-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0122-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0122-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0122-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Allison Inloes with Aetna."
      },
      {
        "id": "aud-APP-2026-0122-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0123",
    "providerId": "prv-cpts-ot-crystal-fuentez",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0123-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0123-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0123-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0123-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0123-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0123-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0123-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Crystal Fuentez with Cigna."
      },
      {
        "id": "aud-APP-2026-0123-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0123-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0124",
    "providerId": "prv-cpts-ot-crystal-fuentez",
    "payerId": "pyr-aetna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0124-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0124-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0124-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0124-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0124-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0124-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0124-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Crystal Fuentez with Aetna."
      },
      {
        "id": "aud-APP-2026-0124-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0125",
    "providerId": "prv-cpts-slp-brenda-castro",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0125-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0125-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0125-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0125-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0125-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0125-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0125-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Brenda Castro with Cigna."
      },
      {
        "id": "aud-APP-2026-0125-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0125-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0126",
    "providerId": "prv-cpts-slp-brenda-castro",
    "payerId": "pyr-aetna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "Speech",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0126-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0126-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0126-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0126-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0126-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0126-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0126-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Brenda Castro with Aetna."
      },
      {
        "id": "aud-APP-2026-0126-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0127",
    "providerId": "prv-cpts-ot-christina-gallo",
    "payerId": "pyr-aetna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Correction Required",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-15",
    "documentsRequestedDate": "2026-08-15",
    "documentsReceivedDate": "2026-08-15",
    "documentsCompleteDate": "2026-08-15",
    "submissionDate": "2026-08-26",
    "targetTurnaroundDate": "2026-11-25",
    "followUps": [
      {
        "id": "fu-APP-2026-0127-1",
        "date": "2026-10-01",
        "nextFollowUpDate": "2026-10-10",
        "method": "Portal",
        "contactPerson": "Aetna Provider Relations Analyst",
        "referenceNumber": "REF-AET-2026",
        "payerResponse": "IRS document has old legal name. Send updated IRS form reflecting new legal name of group.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "IRS document has old legal name. Send updated IRS form reflecting new legal name of group."
      }
    ],
    "nextFollowUpDate": "2026-10-10",
    "lastFollowUpDate": "2026-10-01",
    "isOverdue": false,
    "daysInCurrentStage": 10,
    "totalCycleDays": 45,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0127-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": false
      },
      {
        "id": "chk-APP-2026-0127-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0127-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0127-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0127-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": false
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "IRS document has old legal name. Send updated IRS form reflecting new legal name of group.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0127-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-15 09:30",
        "notes": "Intake initialized for Christina Gallo with Aetna."
      },
      {
        "id": "aud-APP-2026-0127-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-26 11:00",
        "previousValue": "Intake",
        "newValue": "Correction Required",
        "notes": "IRS document has old legal name. Send updated IRS form reflecting new legal name of group."
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-10-01"
  },
  {
    "id": "APP-2026-0128",
    "providerId": "prv-cpts-ot-christina-gallo",
    "payerId": "pyr-selecthealth",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Overdue",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-05-01",
    "documentsRequestedDate": "2026-05-01",
    "documentsReceivedDate": "2026-05-01",
    "documentsCompleteDate": "2026-05-01",
    "submissionDate": "2026-05-12",
    "targetTurnaroundDate": "2026-07-20",
    "followUps": [
      {
        "id": "fu-APP-2026-0128-1",
        "date": "2026-05-28",
        "nextFollowUpDate": "2026-06-30",
        "method": "Portal",
        "contactPerson": "SelectHealth Provider Relations Analyst",
        "referenceNumber": "REF-SEL-2026",
        "payerResponse": "Therapy services panel currently closed. Only Care/Choice available. Meeting pending with Select Health.",
        "nextAction": "Escalation call to Provider Relations supervisor.",
        "isEscalated": true,
        "escalatedTo": "Centralized Credentialing Lead",
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Therapy services panel currently closed. Only Care/Choice available. Meeting pending with Select Health."
      }
    ],
    "nextFollowUpDate": "2026-06-30",
    "lastFollowUpDate": "2026-05-28",
    "isOverdue": true,
    "daysInCurrentStage": 52,
    "totalCycleDays": 98,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0128-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0128-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0128-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0128-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0128-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Pending Approval",
    "contractStatus": "Contract Executed",
    "notes": "Therapy services panel currently closed. Only Care/Choice available. Meeting pending with Select Health.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0128-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-01 09:30",
        "notes": "Intake initialized for Christina Gallo with SelectHealth."
      },
      {
        "id": "aud-APP-2026-0128-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-12 11:00",
        "previousValue": "Intake",
        "newValue": "Overdue",
        "notes": "Therapy services panel currently closed. Only Care/Choice available. Meeting pending with Select Health."
      }
    ],
    "createdAt": "2026-05-01",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "APP-2026-0129",
    "providerId": "prv-cpts-ot-graydon-larsen",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0129-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0129-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0129-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0129-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0129-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0129-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0129-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Graydon Larsen with Cigna."
      },
      {
        "id": "aud-APP-2026-0129-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0129-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0130",
    "providerId": "prv-cpts-ot-graydon-larsen",
    "payerId": "pyr-regenceut",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0130-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Regence Utah Provider Relations Analyst",
        "referenceNumber": "REF-REG-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0130-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0130-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0130-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0130-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0130-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0130-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Graydon Larsen with Regence Utah."
      },
      {
        "id": "aud-APP-2026-0130-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  },
  {
    "id": "APP-2026-0131",
    "providerId": "prv-cpts-ot-natalie-merrill",
    "payerId": "pyr-cigna",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Approved",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-02-10",
    "documentsRequestedDate": "2026-02-10",
    "documentsReceivedDate": "2026-02-10",
    "documentsCompleteDate": "2026-02-10",
    "submissionDate": "2026-02-20",
    "targetTurnaroundDate": "2026-05-15",
    "approvalDate": "2026-05-20",
    "effectiveDate": "2026-05-20",
    "providerLinkDate": "2026-05-20",
    "linkEffectiveDate": "2026-05-20",
    "revalidationDate": "2029-06-30",
    "followUps": [
      {
        "id": "fu-APP-2026-0131-1",
        "date": "2026-05-15",
        "nextFollowUpDate": "",
        "method": "Portal",
        "contactPerson": "Cigna Provider Relations Analyst",
        "referenceNumber": "REF-CIG-2026",
        "payerResponse": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
        "nextAction": "Roster confirmed active.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      }
    ],
    "lastFollowUpDate": "2026-05-15",
    "isOverdue": false,
    "daysInCurrentStage": 65,
    "totalCycleDays": 78,
    "teamCycleDays": 6,
    "actualPayerTatDays": 52,
    "checklist": [
      {
        "id": "chk-APP-2026-0131-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0131-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0131-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0131-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0131-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Linked",
    "contractStatus": "Contract Executed",
    "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0131-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-10 09:30",
        "notes": "Intake initialized for Natalie Merrill with Cigna."
      },
      {
        "id": "aud-APP-2026-0131-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-02-20 11:00",
        "previousValue": "Intake",
        "newValue": "Approved",
        "notes": "Active with Child's Play Therapy Services (CPTS) under ancillary group contract."
      },
      {
        "id": "aud-APP-2026-0131-3",
        "action": "Approval Logged",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-05-20 14:00",
        "previousValue": "Payer Review",
        "newValue": "Approved",
        "notes": "Official approval confirmation received from Cigna. Effective Date: 2026-05-20."
      }
    ],
    "createdAt": "2026-02-10",
    "updatedAt": "2026-05-15"
  },
  {
    "id": "APP-2026-0132",
    "providerId": "prv-cpts-ot-natalie-merrill",
    "payerId": "pyr-regenceut",
    "entityId": "ent-3",
    "locationId": "loc-2",
    "applicationType": "Initial credentialing",
    "discipline": "OT",
    "stage": "Application Submitted",
    "assignedSpecialistId": "usr-cpts-spec",
    "assignedSpecialistName": "Child's Play Credentialing Coordinator",
    "intakeDate": "2026-08-10",
    "documentsRequestedDate": "2026-08-10",
    "documentsReceivedDate": "2026-08-10",
    "documentsCompleteDate": "2026-08-10",
    "submissionDate": "2026-08-20",
    "targetTurnaroundDate": "2026-11-15",
    "followUps": [
      {
        "id": "fu-APP-2026-0132-1",
        "date": "2026-09-28",
        "nextFollowUpDate": "2026-10-22",
        "method": "Portal",
        "contactPerson": "Regence Utah Provider Relations Analyst",
        "referenceNumber": "REF-REG-2026",
        "payerResponse": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
        "nextAction": "Follow-up per SLA cadence.",
        "isEscalated": false,
        "specialistId": "usr-cpts-spec",
        "specialistName": "Child's Play Credentialing Coordinator",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "nextFollowUpDate": "2026-10-22",
    "lastFollowUpDate": "2026-09-28",
    "isOverdue": false,
    "daysInCurrentStage": 18,
    "totalCycleDays": 42,
    "teamCycleDays": 6,
    "checklist": [
      {
        "id": "chk-APP-2026-0132-1",
        "title": "CAQH Profile Attestation Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0132-2",
        "title": "W-9 & Corporate Entity Matching Checked",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0132-3",
        "title": "Malpractice Insurance (COI) Uploaded",
        "category": "Document",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0132-4",
        "title": "State Professional License Primary Source Verified",
        "category": "Validation",
        "isRequired": true,
        "isCompleted": true
      },
      {
        "id": "chk-APP-2026-0132-5",
        "title": "Availity / Payer Roster Form Generated",
        "category": "Form",
        "isRequired": true,
        "isCompleted": true
      }
    ],
    "documents": [],
    "validationIssues": [],
    "linkingStatus": "Not Applicable",
    "contractStatus": "Contract Executed",
    "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA.",
    "auditTrail": [
      {
        "id": "aud-APP-2026-0132-1",
        "action": "Created Credentialing Record",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-10 09:30",
        "notes": "Intake initialized for Natalie Merrill with Regence Utah."
      },
      {
        "id": "aud-APP-2026-0132-2",
        "action": "Stage Transitioned",
        "userId": "usr-cpts-spec",
        "userName": "Child's Play Credentialing Coordinator",
        "timestamp": "2026-08-20 11:00",
        "previousValue": "Intake",
        "newValue": "Application Submitted",
        "notes": "Credentialing application handled through Preferred Therapy / portal. Processing within SLA."
      }
    ],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-09-28"
  }
];
