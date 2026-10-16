/**
 * PROFICIO THERAPY SERVICES — GOOGLE SHEETS & WORKSPACE INTEGRATION SERVICE
 * 
 * Provides client-side and hybrid integration for:
 * 1. Google Workspace OAuth using Firebase Auth SDK (in-memory token caching).
 * 2. Creating and provisioning a dedicated Credentialing Master Google Sheets workbook:
 *    - Live_Records (current synchronized credentialing records)
 *    - Period-specific snapshot sheets (e.g., Weekly_2026_W03, Monthly_2026_10)
 *    - Sync_Log (detailed audit records of all sync events)
 *    - Snapshot_Log (historical report metadata and KPI totals)
 * 3. Continuous two-way synchronization:
 *    - App -> Sheets (export live roster to Live_Records)
 *    - Sheets -> App (pull edits made in Live_Records back to application)
 *    - Conflict detection and resolution strategy
 * 4. Immutable historical snapshot preservation & audited revisions.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CredentialingRecord, Provider, Payer, LegalEntity } from '../types';
import { safeFetchJson } from '../utils/safeFetch';

// Initialize Firebase App singleton safely
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(firebaseApp);

// Configure Google Auth Provider with Workspace Sheets & Drive scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory token caching (MANDATORY per workspace-integration skill: NEVER in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface GoogleSheetsConfig {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  sheetTitle: string;
  createdAt?: string;
  lastSyncedAt?: string | null;
  lastSyncDirection?: 'app_to_sheets' | 'sheets_to_app' | 'two_way';
  lastSyncStatus?: 'SUCCESS' | 'ERROR' | 'PENDING' | 'CONFLICT_DETECTED';
  lastSyncMessage?: string;
}

export interface ReportSnapshot {
  id: string;
  reportType: 'weekly' | 'monthly';
  reportingPeriod: string; // e.g. "Week 41 • Current Year 2026" or "October 2026"
  reportDate: string; // YYYY-MM-DD
  entityScope: string; // "PTS LLC & PSTG INC"
  dateField: string; // e.g. "submissionDate"
  startDate: string;
  endDate: string;
  kpis: {
    activeIntakes: number;
    appPrep: number;
    submittedToPayers: number;
    followUpsDue: number;
    approvedActive: number;
    overdueDelayed: number;
    totalRecords: number;
    averageCycleDays?: number;
  };
  rows: Array<{
    recordId: string;
    clinicianName: string;
    npi: string;
    discipline: string;
    legalEntity: string;
    payerName: string;
    stage: string;
    submitted: string;
    approved: string;
    effective: string;
    days: number;
    nextFollowUp: string;
  }>;
  createdAt: string;
  createdBy: string;
  version: number;
  isCorrection?: boolean;
  correctionNote?: string;
  correctionHistory?: Array<{
    revisedAt: string;
    revisedBy: string;
    reason: string;
    previousVersion: number;
  }>;
}

export interface SyncResult {
  success: boolean;
  recordsSynced?: number;
  recordsUpdatedInApp?: number;
  conflicts?: Array<{
    recordId: string;
    clinicianName: string;
    appValue: string;
    sheetValue: string;
    field: string;
  }>;
  error?: string;
  spreadsheetUrl?: string;
}

// ----------------------------------------------------------------------------
// 1. OAUTH & AUTH STATE MANAGEMENT
// ----------------------------------------------------------------------------

export const initGoogleAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(firebaseAuth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onFailure) onFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to acquire OAuth access token for Google Sheets API.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err: any) {
    console.error('[GoogleSheetsService] OAuth Sign-In Error:', err);
    if (err?.code === 'auth/unauthorized-domain') {
      throw new Error(
        'Domain authorization was just provisioned in Google Cloud/Firebase. Please reload the page in a few seconds, or connect your workbook directly using "Link Existing Sheet".'
      );
    }
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setGoogleAccessToken = (token: string | null): void => {
  cachedAccessToken = token;
};

export const signOutGoogle = async (): Promise<void> => {
  cachedAccessToken = null;
  await signOut(firebaseAuth);
};

// ----------------------------------------------------------------------------
// 2. CONFIGURATION PERSISTENCE VIA DATABASE / SERVER
// ----------------------------------------------------------------------------

export const fetchGoogleSheetsConfig = async (): Promise<GoogleSheetsConfig> => {
  try {
    const res = await safeFetchJson<{ success: boolean; config: GoogleSheetsConfig }>('/api/reports/config');
    if (res.success && res.data?.config) {
      return res.data.config;
    }
  } catch (err) {
    console.warn('[GoogleSheetsService] Could not fetch server config:', err);
  }
  // Safe local fallback
  const local = localStorage.getItem('pts_google_sheets_config');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }
  return {
    spreadsheetId: null,
    spreadsheetUrl: null,
    sheetTitle: 'Proficio Therapy Services — Executive Credentialing Reports',
    lastSyncedAt: null,
    lastSyncStatus: undefined,
  };
};

export const saveGoogleSheetsConfig = async (config: Partial<GoogleSheetsConfig>): Promise<GoogleSheetsConfig> => {
  const current = await fetchGoogleSheetsConfig();
  const updated: GoogleSheetsConfig = {
    ...current,
    ...config,
    lastSyncedAt: config.lastSyncedAt || current.lastSyncedAt || new Date().toISOString(),
  };

  try {
    localStorage.setItem('pts_google_sheets_config', JSON.stringify(updated));
    await safeFetchJson('/api/reports/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  } catch (err) {
    console.warn('[GoogleSheetsService] Could not persist config to server:', err);
  }

  return updated;
};

// ----------------------------------------------------------------------------
// 3. WORKBOOK CREATION & SHEET STRUCTURE
// ----------------------------------------------------------------------------

export const LIVE_RECORDS_HEADERS = [
  'Record ID',
  'Clinician Name',
  'NPI',
  'Discipline',
  'Legal Entity',
  'Payer Name',
  'Stage',
  'Submission Date',
  'Approval Date',
  'Effective Date',
  'Expiration Date',
  'Days in Current Stage',
  'Next Follow-Up Date',
  'Intake Date',
  'Provider ID',
  'Entity ID',
  'Payer ID',
  'Last Modified'
];

export const SYNC_LOG_HEADERS = [
  'Timestamp',
  'Operation Type',
  'Record ID / Scope',
  'Source of Change',
  'Result',
  'Details / Conflict Notes'
];

export const SNAPSHOT_LOG_HEADERS = [
  'Snapshot ID',
  'Report Type',
  'Reporting Period',
  'Report Date',
  'Entity Scope',
  'Creation Timestamp',
  'Created By',
  'Snapshot Version',
  'Total Records',
  'Active Intakes',
  'App Prep',
  'Submitted to Payers',
  'Follow-ups Due',
  'Approved / Active',
  'Overdue / Delayed'
];

/**
 * Creates a brand new Google Sheets workbook for the credentialing report integration
 */
export const createCredentialingWorkbook = async (
  token: string,
  userEmail?: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const title = `Proficio Therapy Services — Credentialing Master Workbook (${new Date().getFullYear()})`;

  const payload = {
    properties: {
      title,
      locale: 'en_US',
      timeZone: 'America/Los_Angeles',
    },
    sheets: [
      {
        properties: {
          sheetId: 0,
          title: 'Live_Records',
          gridProperties: {
            frozenRowCount: 1,
            rowCount: 200,
            columnCount: LIVE_RECORDS_HEADERS.length + 2,
          },
        },
      },
      {
        properties: {
          sheetId: 1,
          title: 'Sync_Log',
          gridProperties: {
            frozenRowCount: 1,
            rowCount: 200,
            columnCount: SYNC_LOG_HEADERS.length + 2,
          },
        },
      },
      {
        properties: {
          sheetId: 2,
          title: 'Snapshot_Log',
          gridProperties: {
            frozenRowCount: 1,
            rowCount: 200,
            columnCount: SNAPSHOT_LOG_HEADERS.length + 2,
          },
        },
      },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Google Sheets API Error (${createRes.status}): ${errText}`);
  }

  const data = await createRes.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write initial header rows to all 3 sheets
  await writeSheetValues(token, spreadsheetId, 'Live_Records!A1:R1', [LIVE_RECORDS_HEADERS]);
  await writeSheetValues(token, spreadsheetId, 'Sync_Log!A1:F1', [SYNC_LOG_HEADERS]);
  await writeSheetValues(token, spreadsheetId, 'Snapshot_Log!A1:O1', [SNAPSHOT_LOG_HEADERS]);

  // Log initial creation into Sync_Log
  await appendSheetValues(token, spreadsheetId, 'Sync_Log!A:F', [
    [
      new Date().toISOString(),
      'WORKBOOK_INITIALIZED',
      'Workbook Structure',
      userEmail || 'Proficio Credentialing Admin',
      'SUCCESS',
      'Dedicated workbook created with Live_Records, Sync_Log, and Snapshot_Log sheets.',
    ],
  ]);

  // Save new workbook config in app database
  await saveGoogleSheetsConfig({
    spreadsheetId,
    spreadsheetUrl,
    sheetTitle: title,
    createdAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    lastSyncStatus: 'SUCCESS',
    lastSyncMessage: 'Workbook initialized successfully.',
  });

  return { spreadsheetId, spreadsheetUrl };
};

// ----------------------------------------------------------------------------
// 4. LOW-LEVEL GOOGLE SHEETS API HELPERS
// ----------------------------------------------------------------------------

export const writeSheetValues = async (
  token: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<any> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets PUT Error: ${text}`);
  }
  return await res.json();
};

export const appendSheetValues = async (
  token: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<any> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets APPEND Error: ${text}`);
  }
  return await res.json();
};

export const getSheetValues = async (
  token: string,
  spreadsheetId: string,
  range: string
): Promise<any[][]> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets GET Error: ${text}`);
  }
  const data = await res.json();
  return data.values || [];
};

export const clearSheetValues = async (
  token: string,
  spreadsheetId: string,
  range: string
): Promise<any> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets CLEAR Error: ${text}`);
  }
  return await res.json();
};

// ----------------------------------------------------------------------------
// 5. TWO-WAY SYNCHRONIZATION LOGIC
// ----------------------------------------------------------------------------

/**
 * Exports current application records to the Live_Records sheet in Google Sheets
 */
export const syncAppToGoogleSheets = async (
  token: string,
  spreadsheetId: string,
  records: CredentialingRecord[],
  providers: Provider[],
  payers: Payer[],
  entities: LegalEntity[],
  userEmail?: string
): Promise<SyncResult> => {
  try {
    // 1. Transform records to 2D array matching LIVE_RECORDS_HEADERS
    const rows = records.map((r) => {
      const prov = providers.find((p) => p.id === r.providerId);
      const pay = payers.find((p) => p.id === r.payerId);
      const ent = entities.find((e) => e.id === r.entityId);

      const provName = prov ? ((prov as any).fullName || `${prov.firstName} ${prov.lastName}`) : 'N/A';
      const entName = ent?.dba || ent?.legalName || 'Proficio Therapy Services, LLC';

      return [
        r.id,
        provName,
        prov?.npi || '',
        r.discipline || 'Speech',
        entName,
        pay?.name || '',
        r.stage || 'Intake',
        r.submissionDate || '',
        r.approvalDate || '',
        r.effectiveDate || '',
        r.expirationDate || '',
        r.daysInCurrentStage || 0,
        r.nextFollowUpDate || '',
        r.intakeDate || '',
        r.providerId || '',
        r.entityId || '',
        r.payerId || '',
        r.updatedAt || new Date().toISOString(),
      ];
    });

    // 2. Clear existing Live_Records rows below headers and write freshly synced set
    await clearSheetValues(token, spreadsheetId, 'Live_Records!A2:R1000');
    if (rows.length > 0) {
      await writeSheetValues(token, spreadsheetId, `Live_Records!A2:R${rows.length + 1}`, rows);
    }

    // 3. Log to Sync_Log
    const timestamp = new Date().toISOString();
    await appendSheetValues(token, spreadsheetId, 'Sync_Log!A:F', [
      [
        timestamp,
        'APP_TO_SHEETS_SYNC',
        `${records.length} records exported`,
        userEmail || 'Proficio Application',
        'SUCCESS',
        `Synchronized ${records.length} credentialing records to Live_Records sheet.`,
      ],
    ]);

    // 4. Update database configuration
    await saveGoogleSheetsConfig({
      lastSyncedAt: timestamp,
      lastSyncDirection: 'app_to_sheets',
      lastSyncStatus: 'SUCCESS',
      lastSyncMessage: `Exported ${records.length} records to Google Sheets.`,
    });

    return {
      success: true,
      recordsSynced: records.length,
    };
  } catch (err: any) {
    console.error('[GoogleSheetsService] syncAppToGoogleSheets error:', err);
    await saveGoogleSheetsConfig({
      lastSyncStatus: 'ERROR',
      lastSyncMessage: err.message || 'Export synchronization failed.',
    });
    return {
      success: false,
      error: err.message || 'Failed to sync records to Google Sheets.',
    };
  }
};

/**
 * Pulls edits made directly in Google Sheets (Live_Records) and applies them back to application
 */
export const syncSheetsToApp = async (
  token: string,
  spreadsheetId: string,
  currentRecords: CredentialingRecord[],
  userEmail?: string
): Promise<SyncResult & { updatedRecords?: CredentialingRecord[] }> => {
  try {
    const rawRows = await getSheetValues(token, spreadsheetId, 'Live_Records!A2:R1000');
    if (!rawRows || rawRows.length === 0) {
      return {
        success: true,
        recordsSynced: 0,
        recordsUpdatedInApp: 0,
      };
    }

    const updatedRecords = [...currentRecords];
    let updatedCount = 0;
    const conflicts: any[] = [];
    const timestamp = new Date().toISOString();

    for (const row of rawRows) {
      const recordId = row[0];
      if (!recordId) continue;

      const existingIdx = updatedRecords.findIndex((r) => r.id === recordId);
      if (existingIdx === -1) continue;

      const existing = updatedRecords[existingIdx];
      const sheetStage = row[6] || existing.stage;
      const sheetSubDate = row[7] || existing.submissionDate;
      const sheetAppDate = row[8] || existing.approvalDate;
      const sheetEffDate = row[9] || existing.effectiveDate;
      const sheetExpDate = row[10] || existing.expirationDate;
      const sheetFollowUp = row[12] || existing.nextFollowUpDate;
      const sheetModified = row[17];

      // Detect if row was changed in the spreadsheet
      const isChanged =
        sheetStage !== existing.stage ||
        sheetSubDate !== (existing.submissionDate || '') ||
        sheetAppDate !== (existing.approvalDate || '') ||
        sheetEffDate !== (existing.effectiveDate || '') ||
        sheetExpDate !== (existing.expirationDate || '') ||
        sheetFollowUp !== (existing.nextFollowUpDate || '');

      if (isChanged) {
        // Conflict detection: if app was updated after sheet's recorded timestamp
        if (
          existing.updatedAt &&
          sheetModified &&
          new Date(existing.updatedAt).getTime() > new Date(sheetModified).getTime() + 2000
        ) {
          conflicts.push({
            recordId: existing.id,
            clinicianName: row[1] || 'Clinician',
            appValue: `${existing.stage} (${existing.submissionDate || 'No Sub'})`,
            sheetValue: `${sheetStage} (${sheetSubDate || 'No Sub'})`,
            field: 'stage / dates',
          });
          continue; // Preserve newer app edits in conflict
        }

        updatedRecords[existingIdx] = {
          ...existing,
          stage: sheetStage,
          submissionDate: sheetSubDate || existing.submissionDate,
          approvalDate: sheetAppDate || existing.approvalDate,
          effectiveDate: sheetEffDate || existing.effectiveDate,
          expirationDate: sheetExpDate || existing.expirationDate,
          nextFollowUpDate: sheetFollowUp || existing.nextFollowUpDate,
          updatedAt: timestamp,
        };
        updatedCount++;
      }
    }

    // Log to Sync_Log
    await appendSheetValues(token, spreadsheetId, 'Sync_Log!A:F', [
      [
        timestamp,
        'SHEETS_TO_APP_SYNC',
        `${updatedCount} records updated (${conflicts.length} conflicts)`,
        userEmail || 'Google Sheets User',
        conflicts.length > 0 ? 'CONFLICT_DETECTED' : 'SUCCESS',
        `Imported edits from Google Sheets. Updated ${updatedCount} app records. Conflicts preserved: ${conflicts.length}.`,
      ],
    ]);

    // Update server config
    await saveGoogleSheetsConfig({
      lastSyncedAt: timestamp,
      lastSyncDirection: 'sheets_to_app',
      lastSyncStatus: conflicts.length > 0 ? 'CONFLICT_DETECTED' : 'SUCCESS',
      lastSyncMessage: `Imported ${updatedCount} edits from Google Sheets.${conflicts.length > 0 ? ` (${conflicts.length} conflicts detected)` : ''}`,
    });

    return {
      success: true,
      recordsSynced: rawRows.length,
      recordsUpdatedInApp: updatedCount,
      updatedRecords,
      conflicts,
    };
  } catch (err: any) {
    console.error('[GoogleSheetsService] syncSheetsToApp error:', err);
    return {
      success: false,
      error: err.message || 'Failed to import changes from Google Sheets.',
    };
  }
};

// ----------------------------------------------------------------------------
// 6. HISTORICAL SNAPSHOT ARCHIVING & PERIOD SHEETS
// ----------------------------------------------------------------------------

/**
 * Creates an immutable period sheet in Google Sheets (e.g. Weekly_2026_W41 or Monthly_2026_10)
 * and records the event in Snapshot_Log
 */
export const archiveSnapshotToGoogleSheets = async (
  token: string,
  spreadsheetId: string,
  snapshot: ReportSnapshot,
  userEmail?: string
): Promise<{ success: boolean; sheetName: string; error?: string }> => {
  try {
    // Generate safe sheet name: e.g. "Weekly_2026_W41" or "Monthly_2026_10"
    const prefix = snapshot.reportType === 'weekly' ? 'Weekly' : 'Monthly';
    const periodSlug = snapshot.reportingPeriod
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/__+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 20);
    const versionSuffix = snapshot.version > 1 ? `_v${snapshot.version}` : '';
    const sheetName = `${prefix}_${periodSlug}${versionSuffix}`;

    // 1. Add new sheet tab via batchUpdate
    const addSheetReq = {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetName,
              gridProperties: {
                frozenRowCount: 6,
                rowCount: snapshot.rows.length + 20,
                columnCount: 15,
              },
            },
          },
        },
      ],
    };

    // If sheet name already exists (e.g. revision), handle gracefully
    try {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addSheetReq),
      });
    } catch (sheetAddErr) {
      console.warn('[GoogleSheetsService] Notice adding sheet tab:', sheetAddErr);
    }

    // 2. Prepare formatted report header & KPI summary
    const content = [
      ['PROFICIO THERAPY SERVICES — EXECUTIVE CREDENTIALING REPORT SNAPSHOT', '', '', '', '', '', '', '', '', '', ''],
      [`Report Type: ${snapshot.reportType.toUpperCase()}`, `Period: ${snapshot.reportingPeriod}`, `Report Date: ${snapshot.reportDate}`, `Entity Scope: ${snapshot.entityScope}`, '', '', '', '', '', '', ''],
      [`Snapshot ID: ${snapshot.id}`, `Version: v${snapshot.version}${snapshot.isCorrection ? ' (AUDITED REVISION)' : ''}`, `Created By: ${snapshot.createdBy}`, `Archived: ${snapshot.createdAt}`, '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', ''],
      [
        `Active Intakes: ${snapshot.kpis.activeIntakes}`,
        `App Prep: ${snapshot.kpis.appPrep}`,
        `Submitted to Payers: ${snapshot.kpis.submittedToPayers}`,
        `Follow-ups Due: ${snapshot.kpis.followUpsDue}`,
        `Approved / Active: ${snapshot.kpis.approvedActive}`,
        `Overdue / Delayed: ${snapshot.kpis.overdueDelayed}`,
        `Total Tracked: ${snapshot.kpis.totalRecords}`,
      ],
      [
        'Clinician Name',
        'NPI',
        'Discipline',
        'Legal Entity',
        'Payer Name',
        'Stage',
        'Submitted',
        'Approved',
        'Effective',
        'Days',
        'Next Follow-Up',
      ],
      ...snapshot.rows.map((r) => [
        r.clinicianName,
        r.npi,
        r.discipline,
        r.legalEntity,
        r.payerName,
        r.stage,
        r.submitted,
        r.approved,
        r.effective,
        r.days,
        r.nextFollowUp,
      ]),
    ];

    // 3. Write data to the period sheet
    await writeSheetValues(token, spreadsheetId, `${sheetName}!A1:K${content.length + 1}`, content);

    // 4. Log to Snapshot_Log sheet
    await appendSheetValues(token, spreadsheetId, 'Snapshot_Log!A:O', [
      [
        snapshot.id,
        snapshot.reportType,
        snapshot.reportingPeriod,
        snapshot.reportDate,
        snapshot.entityScope,
        snapshot.createdAt,
        snapshot.createdBy,
        `v${snapshot.version}${snapshot.isCorrection ? ' (REVISION)' : ''}`,
        snapshot.kpis.totalRecords,
        snapshot.kpis.activeIntakes,
        snapshot.kpis.appPrep,
        snapshot.kpis.submittedToPayers,
        snapshot.kpis.followUpsDue,
        snapshot.kpis.approvedActive,
        snapshot.kpis.overdueDelayed,
      ],
    ]);

    // 5. Log to Sync_Log
    await appendSheetValues(token, spreadsheetId, 'Sync_Log!A:F', [
      [
        new Date().toISOString(),
        'SNAPSHOT_ARCHIVED',
        snapshot.id,
        userEmail || snapshot.createdBy,
        'SUCCESS',
        `Saved immutable report snapshot to sheet "${sheetName}". Total rows: ${snapshot.rows.length}.`,
      ],
    ]);

    return { success: true, sheetName };
  } catch (err: any) {
    console.error('[GoogleSheetsService] archiveSnapshotToGoogleSheets error:', err);
    return {
      success: false,
      sheetName: '',
      error: err.message || 'Failed to archive snapshot to Google Sheets.',
    };
  }
};

// ----------------------------------------------------------------------------
// 7. SNAPSHOT PERSISTENCE (DATABASE & LOCAL)
// ----------------------------------------------------------------------------

export const fetchReportSnapshots = async (): Promise<ReportSnapshot[]> => {
  try {
    const res = await safeFetchJson<{ success: boolean; snapshots: ReportSnapshot[] }>('/api/reports/snapshots');
    if (res.success && res.data?.snapshots && Array.isArray(res.data.snapshots)) {
      return res.data.snapshots;
    }
  } catch (err) {
    console.warn('[GoogleSheetsService] Could not fetch server snapshots:', err);
  }

  // Local fallback
  const local = localStorage.getItem('pts_report_snapshots');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }
  return [];
};

export const saveReportSnapshot = async (
  snapshot: Omit<ReportSnapshot, 'id' | 'createdAt' | 'version'> & { id?: string }
): Promise<ReportSnapshot> => {
  const existingList = await fetchReportSnapshots();
  const id = snapshot.id || `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Check if updating / revising an existing snapshot
  const existingIdx = existingList.findIndex((s) => s.id === id);
  let savedSnapshot: ReportSnapshot;

  if (existingIdx !== -1) {
    const prev = existingList[existingIdx];
    savedSnapshot = {
      ...prev,
      ...snapshot,
      id,
      version: prev.version + 1,
      isCorrection: true,
      correctionHistory: [
        ...(prev.correctionHistory || []),
        {
          revisedAt: now,
          revisedBy: snapshot.createdBy || 'Authorized User',
          reason: snapshot.correctionNote || 'Historical audit correction',
          previousVersion: prev.version,
        },
      ],
    };
    existingList[existingIdx] = savedSnapshot;
  } else {
    savedSnapshot = {
      ...snapshot,
      id,
      version: 1,
      createdAt: now,
    };
    existingList.unshift(savedSnapshot);
  }

  localStorage.setItem('pts_report_snapshots', JSON.stringify(existingList));

  try {
    await safeFetchJson('/api/reports/snapshots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedSnapshot),
    });
  } catch (err) {
    console.warn('[GoogleSheetsService] Could not persist snapshot to server:', err);
  }

  return savedSnapshot;
};
