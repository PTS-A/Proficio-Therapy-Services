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

// Authoritative Whitelist Domains for Google OAuth & Sheets Synchronization
export const APPROVED_WHITELIST_DOMAINS = [
  'https://credentialing.ageslearningsolutions.com',
  'credentialing.ageslearningsolutions.com',
  'https://pts-credentialing-1da61.firebaseapp.com',
  'https://pts-credentialing-1da61.web.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

// Production Company Logo Formula for Google Sheets (Row 1 Top Bar)
export const COMPANY_LOGO_SHEET_FORMULA =
  '=IMAGE("https://credentialing.ageslearningsolutions.com/Proficio-Therapy-Horizontal.png", 4, 38, 145)';

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
        'Domain authorization restriction: The approved default domain is https://credentialing.ageslearningsolutions.com/. If running on an alternate preview origin, add this origin in Firebase Console > Authentication > Settings > Authorized domains, or simply use "Link Existing Sheet" to connect your Google Sheet directly.'
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

export const MONTHLY_RECORD_HEADERS = [
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
  'Days in Stage',
  'Next Follow-Up'
];

/**
 * Standard branded top bar with official company logo formula for Google Sheets
 * Evaluates =IMAGE("...") in cell A1 and positions metadata in rows 1-3
 */
export const getBrandedTopBarValues = (
  subsheetTitle: string,
  lastUpdatedStr?: string
): (string | number)[][] => {
  const dateStr = lastUpdatedStr || new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  return [
    [
      COMPANY_LOGO_SHEET_FORMULA,
      'AGES LEARNING SOLUTIONS & PROFICIO THERAPY SERVICES',
      '',
      '',
      'Executive Credentialing Management System',
      '',
      '',
      '',
      'CONFIDENTIAL — HIPAA §164.312',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ],
    [
      '',
      'Entity Scope: Proficio Therapy Services, LLC & PSTG INC',
      '',
      '',
      `Subsheet: ${subsheetTitle}`,
      '',
      '',
      '',
      'Two-Way Synchronized Application Master',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ],
    [
      '',
      'Generated for AGES Executive Reporting • Continuous Sync Engine',
      '',
      '',
      `Last Synchronized: ${dateStr}`,
      '',
      '',
      '',
      'Domain: https://credentialing.ageslearningsolutions.com/',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] // Row 4 spacer
  ];
};

/**
 * Formats Google Sheets tab: Freezes top 5 rows, sets dark navy top bar, and sets header styling
 */
export const formatSheetHeaderAndTopBar = async (
  token: string,
  spreadsheetId: string,
  sheetId: number,
  columnCount: number = 18
): Promise<void> => {
  try {
    const requests = [
      // Freeze rows 1-5 (Top bar + Header)
      {
        updateSheetProperties: {
          properties: {
            sheetId,
            gridProperties: {
              frozenRowCount: 5,
            },
          },
          fields: 'gridProperties.frozenRowCount',
        },
      },
      // Format rows 1-3 (Navy blue branded top bar)
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 3,
            startColumnIndex: 0,
            endColumnIndex: columnCount,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.059, green: 0.169, blue: 0.361 }, // #0f2b5c
              textFormat: {
                foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                bold: true,
                fontSize: 10,
              },
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)',
        },
      },
      // Format row 5 (Header row)
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 4,
            endRowIndex: 5,
            startColumnIndex: 0,
            endColumnIndex: columnCount,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.118, green: 0.161, blue: 0.231 }, // #1e293b
              textFormat: {
                foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                bold: true,
                fontSize: 10,
              },
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)',
        },
      },
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
  } catch (err) {
    console.warn('[GoogleSheetsService] formatSheetHeaderAndTopBar notice:', err);
  }
};

/**
 * Creates a brand new Google Sheets workbook for the credentialing report integration
 * Populates Executive_Overview, Live_Records, Current Month Subsheet, Sync_Log, and Snapshot_Log
 * with Company Logo in the top bar of all subsheets!
 */
export const createCredentialingWorkbook = async (
  token: string,
  userEmail?: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const currentYear = new Date().getFullYear();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[new Date().getMonth()];
  const currentMonthSheetTitle = `Monthly_${currentMonthName}_${currentYear}`;

  const title = `Proficio Therapy Services — Credentialing Master Workbook (${currentYear})`;

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
          title: 'Executive_Overview',
          gridProperties: {
            frozenRowCount: 5,
            rowCount: 100,
            columnCount: 18,
          },
        },
      },
      {
        properties: {
          sheetId: 1,
          title: 'Live_Records',
          gridProperties: {
            frozenRowCount: 5,
            rowCount: 300,
            columnCount: LIVE_RECORDS_HEADERS.length + 2,
          },
        },
      },
      {
        properties: {
          sheetId: 2,
          title: currentMonthSheetTitle,
          gridProperties: {
            frozenRowCount: 5,
            rowCount: 200,
            columnCount: MONTHLY_RECORD_HEADERS.length + 2,
          },
        },
      },
      {
        properties: {
          sheetId: 3,
          title: 'Sync_Log',
          gridProperties: {
            frozenRowCount: 5,
            rowCount: 300,
            columnCount: SYNC_LOG_HEADERS.length + 2,
          },
        },
      },
      {
        properties: {
          sheetId: 4,
          title: 'Snapshot_Log',
          gridProperties: {
            frozenRowCount: 5,
            rowCount: 300,
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

  // 1. Write Branded Top Bar with Company Logo formula to all 5 sheets
  const nowIso = new Date().toISOString();
  await writeSheetValues(token, spreadsheetId, 'Executive_Overview!A1:R4', getBrandedTopBarValues('Executive_Overview', nowIso));
  await writeSheetValues(token, spreadsheetId, 'Live_Records!A1:R4', getBrandedTopBarValues('Live_Records', nowIso));
  await writeSheetValues(token, spreadsheetId, `${currentMonthSheetTitle}!A1:R4`, getBrandedTopBarValues(currentMonthSheetTitle, nowIso));
  await writeSheetValues(token, spreadsheetId, 'Sync_Log!A1:R4', getBrandedTopBarValues('Sync_Log', nowIso));
  await writeSheetValues(token, spreadsheetId, 'Snapshot_Log!A1:R4', getBrandedTopBarValues('Snapshot_Log', nowIso));

  // 2. Write Table Column Headers at row 5 on all sheets
  await writeSheetValues(token, spreadsheetId, 'Executive_Overview!A5:L5', [[
    'Metric / KPI Category',
    'Total Active',
    'Speech Pathology',
    'Applied Behavior Analysis (ABA)',
    'Occupational Therapy (OT)',
    'PTS LLC',
    'PSTG INC',
    'In-Network Status',
    'Overdue Alerts',
    'Cycle Days Avg',
    'Last Calculated',
    'Notes'
  ]]);
  await writeSheetValues(token, spreadsheetId, 'Live_Records!A5:R5', [LIVE_RECORDS_HEADERS]);
  await writeSheetValues(token, spreadsheetId, `${currentMonthSheetTitle}!A5:L5`, [MONTHLY_RECORD_HEADERS]);
  await writeSheetValues(token, spreadsheetId, 'Sync_Log!A5:F5', [SYNC_LOG_HEADERS]);
  await writeSheetValues(token, spreadsheetId, 'Snapshot_Log!A5:O5', [SNAPSHOT_LOG_HEADERS]);

  // 3. Format header styling and top bar for all 5 sheets
  await formatSheetHeaderAndTopBar(token, spreadsheetId, 0, 18);
  await formatSheetHeaderAndTopBar(token, spreadsheetId, 1, LIVE_RECORDS_HEADERS.length);
  await formatSheetHeaderAndTopBar(token, spreadsheetId, 2, MONTHLY_RECORD_HEADERS.length);
  await formatSheetHeaderAndTopBar(token, spreadsheetId, 3, SYNC_LOG_HEADERS.length);
  await formatSheetHeaderAndTopBar(token, spreadsheetId, 4, SNAPSHOT_LOG_HEADERS.length);

  // 4. Log initial creation into Sync_Log
  await appendSheetValues(token, spreadsheetId, 'Sync_Log!A:F', [
    [
      new Date().toISOString(),
      'WORKBOOK_INITIALIZED',
      'Workbook Structure',
      userEmail || 'Proficio Credentialing Admin',
      'SUCCESS',
      `Dedicated workbook created with Company Logo top bar and subsheets: Executive_Overview, Live_Records, ${currentMonthSheetTitle}, Sync_Log, and Snapshot_Log.`,
    ],
  ]);

  // 5. Save new workbook config in app database
  await saveGoogleSheetsConfig({
    spreadsheetId,
    spreadsheetUrl,
    sheetTitle: title,
    createdAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    lastSyncStatus: 'SUCCESS',
    lastSyncMessage: `Workbook initialized with company logo top bar & ${currentMonthSheetTitle} subsheet.`,
  });

  return { spreadsheetId, spreadsheetUrl };
};

/**
 * Ensures a monthly subsheet exists in the workbook for the given month/year
 * If missing, automatically creates the subsheet, injects company logo top bar,
 * sets column headers, populates records, and formats styling!
 */
export const ensureMonthlySubsheet = async (
  token: string,
  spreadsheetId: string,
  year?: number,
  month?: number,
  records: CredentialingRecord[] = [],
  providers: Provider[] = [],
  payers: Payer[] = [],
  entities: LegalEntity[] = [],
  userEmail?: string
): Promise<{ sheetName: string; created: boolean }> => {
  const now = new Date();
  const targetYear = year || now.getFullYear();
  const targetMonth = typeof month === 'number' ? month : now.getMonth() + 1;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[targetMonth - 1];
  const sheetName = `Monthly_${monthName}_${targetYear}`;

  try {
    // Check if sheet tab already exists
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    let sheetExists = false;
    let nextSheetId = 100;
    if (metaRes.ok) {
      const meta = await metaRes.json();
      const existingSheets = meta.sheets || [];
      nextSheetId = existingSheets.length + 10;
      sheetExists = existingSheets.some((s: any) => s.properties?.title === sheetName);
    }

    if (!sheetExists) {
      // Add new monthly subsheet tab
      const addReq = {
        requests: [
          {
            addSheet: {
              properties: {
                sheetId: nextSheetId,
                title: sheetName,
                gridProperties: {
                  frozenRowCount: 5,
                  rowCount: Math.max(records.length + 20, 100),
                  columnCount: MONTHLY_RECORD_HEADERS.length + 2,
                },
              },
            },
          },
        ],
      };

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addReq),
      });

      // Write Company Logo top bar and headers
      await writeSheetValues(token, spreadsheetId, `${sheetName}!A1:R4`, getBrandedTopBarValues(sheetName));
      await writeSheetValues(token, spreadsheetId, `${sheetName}!A5:L5`, [MONTHLY_RECORD_HEADERS]);
      await formatSheetHeaderAndTopBar(token, spreadsheetId, nextSheetId, MONTHLY_RECORD_HEADERS.length);

      // Populate monthly records if available
      if (records.length > 0) {
        const rows = records.map((r) => {
          const prov = providers.find((p) => p.id === r.providerId);
          const pay = payers.find((p) => p.id === r.payerId);
          const ent = entities.find((e) => e.id === r.entityId);
          const provName = prov ? ((prov as any).fullName || `${prov.firstName} ${prov.lastName}`) : 'N/A';
          const entName = ent?.dba || ent?.legalName || 'Proficio Therapy Services, LLC';

          return [
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
          ];
        });

        await writeSheetValues(token, spreadsheetId, `${sheetName}!A6:L${rows.length + 5}`, rows);
      }

      // Log into Sync_Log
      await appendSheetValues(token, spreadsheetId, 'Sync_Log!A:F', [
        [
          new Date().toISOString(),
          'MONTHLY_SUBSHEET_CREATED',
          sheetName,
          userEmail || 'Automated System',
          'SUCCESS',
          `Created monthly subsheet "${sheetName}" with company logo top bar and ${records.length} records.`,
        ],
      ]);

      return { sheetName, created: true };
    }

    return { sheetName, created: false };
  } catch (err: any) {
    console.warn(`[GoogleSheetsService] ensureMonthlySubsheet for ${sheetName}:`, err);
    return { sheetName, created: false };
  }
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

    // 2. Ensure branded top bar with company logo and column headers at row 5
    await writeSheetValues(token, spreadsheetId, 'Live_Records!A1:R4', getBrandedTopBarValues('Live_Records', new Date().toISOString()));
    await writeSheetValues(token, spreadsheetId, 'Live_Records!A5:R5', [LIVE_RECORDS_HEADERS]);

    // Clear existing Live_Records rows below headers and write freshly synced set
    await clearSheetValues(token, spreadsheetId, 'Live_Records!A6:R1000');
    if (rows.length > 0) {
      await writeSheetValues(token, spreadsheetId, `Live_Records!A6:R${rows.length + 5}`, rows);
    }

    // Automatically ensure the current month subsheet exists and has the latest roster
    await ensureMonthlySubsheet(token, spreadsheetId, undefined, undefined, records, providers, payers, entities, userEmail);

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

    // 2. Prepare formatted report header with company logo top bar & KPI summary
    const content = [
      [COMPANY_LOGO_SHEET_FORMULA, 'AGES LEARNING SOLUTIONS & PROFICIO THERAPY SERVICES', '', '', 'Executive Credentialing Report Snapshot', '', '', '', 'CONFIDENTIAL — HIPAA §164.312', '', ''],
      ['', `Report Type: ${snapshot.reportType.toUpperCase()}`, `Period: ${snapshot.reportingPeriod}`, `Report Date: ${snapshot.reportDate}`, `Entity Scope: ${snapshot.entityScope}`, '', '', '', 'Domain: https://credentialing.ageslearningsolutions.com/', '', ''],
      ['', `Snapshot ID: ${snapshot.id}`, `Version: v${snapshot.version}${snapshot.isCorrection ? ' (AUDITED REVISION)' : ''}`, `Created By: ${snapshot.createdBy}`, `Archived: ${snapshot.createdAt}`, '', '', '', 'Status: Locked Historical Record', '', ''],
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
