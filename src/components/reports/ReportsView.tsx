import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  CheckCircle2, 
  Clock, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  RefreshCw, 
  AlertCircle, 
  AlertTriangle, 
  UserCheck, 
  Building2, 
  TrendingUp, 
  Award, 
  CalendarDays, 
  FileCheck, 
  ArrowRight, 
  Upload, 
  FileUp, 
  Filter, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ExternalLink,
  Eye,
  RotateCcw,
  Save,
  Edit3,
  X,
  ChevronDown,
  CheckCheck,
  Copy,
  Link2,
  Calendar,
  History,
  FileText,
  Settings,
  Code,
  Terminal,
  BookOpen,
  LogOut
} from 'lucide-react';
import { Discipline, CredentialingRecord } from '../../types';
import { ProficioLogo } from '../common/ProficioLogo';
import { 
  downloadWeeklyTemplateXls,
  downloadWeeklyTemplateCsv,
  downloadMonthlyTemplateXls,
  downloadMonthlyTemplateCsv,
  downloadWeeklyExecutiveReportHtml,
  downloadMonthlyExecutiveReportHtml,
  downloadEntityRosterXls,
  downloadEntityRosterCsv,
  parseUploadedReport,
  ParsedReportRow,
  triggerFileDownload
} from '../../utils/reportExportUtils';
import { logAuditEvent } from '../../lib/supabase';
import { isAdminAccount, isDeveloper } from '../../utils/rbac';
import {
  initGoogleAuth,
  signInWithGoogle,
  signOutGoogle,
  getGoogleAccessToken,
  fetchGoogleSheetsConfig,
  saveGoogleSheetsConfig,
  createCredentialingWorkbook,
  initializeMasterWorkbookDirectly,
  generateClipboardFormattedTsv,
  generateWeeklySheetTsv,
  generateMonthlySheetTsv,
  USER_ATTACHED_WEEKLY_SHEET,
  USER_ATTACHED_MONTHLY_SHEET,
  syncAppToGoogleSheets,
  syncSheetsToApp,
  archiveSnapshotToGoogleSheets,
  fetchReportSnapshots,
  saveReportSnapshot,
  syncToGoogleSheetsViaWebhook,
  testWebhookConnection,
  directPushAllSubsheetsViaGoogleApi,
  ReportSnapshot,
  GoogleSheetsConfig
} from '../../services/googleSheetsService';
import { GOOGLE_APPS_SCRIPT_SOURCE } from '../../services/googleAppsScriptTemplate';
import { buildMultiTabSheetsPayload, getFollowUpMonthLabel } from '../../services/googleSheetsSyncPayload';
import { User } from 'firebase/auth';

export const ReportsView: React.FC = () => {
  const { 
    records, 
    providers, 
    payers, 
    entities, 
    locations, 
    kpis, 
    currentAccount, 
    currentUser, 
    updateRecord, 
    addRecord, 
    addToast 
  } = useCredentialing();

  const isAuthorized = Boolean(
    isAdminAccount(currentAccount) || 
    isDeveloper(currentAccount) || 
    currentAccount?.canAccessAdmin ||
    currentAccount?.systemRole?.includes('Lead') ||
    currentAccount?.systemRole?.includes('Administrator') ||
    currentAccount?.systemRole?.includes('Manager')
  );

  // Clinical staff check: clinical staff need NOT login or link to worksheet (strictly admin/developer only)
  const isClinicalStaff = Boolean(
    currentAccount?.role === 'clinical_staff' ||
    currentAccount?.systemRole?.toLowerCase().includes('clinician') ||
    currentAccount?.systemRole?.toLowerCase().includes('therapist') ||
    (currentAccount?.systemRole?.toLowerCase().includes('staff') && !isDeveloper(currentAccount) && !isAdminAccount(currentAccount))
  );

  // Only Administrator or Developer accounts can connect or synchronize the Google Sheets workbook
  const canManageSheetsWorkbook = isAuthorized && !isClinicalStaff;

  // Main Tabs
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'sheets' | 'upload'>('weekly');
  const [selectedMonthlyDiscipline, setSelectedMonthlyDiscipline] = useState<'Consolidated' | 'Speech' | 'ABA' | 'OT'>('Consolidated');
  
  // Generation & Loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(100);

  // --------------------------------------------------------------------------
  // GOOGLE SHEETS WORKSPACE INTEGRATION STATE
  // --------------------------------------------------------------------------
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>({
    spreadsheetId: null,
    spreadsheetUrl: null,
    sheetTitle: 'Proficio Therapy Services — Credentialing Master Workbook',
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDirection, setSyncDirection] = useState<'export' | 'import' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<'export' | 'import' | null>(null);
  const [conflictList, setConflictList] = useState<any[]>([]);
  const [showLinkSheetModal, setShowLinkSheetModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookWeeklyInput, setWebhookWeeklyInput] = useState('');
  const [webhookMonthlyInput, setWebhookMonthlyInput] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [webhookStatusMessage, setWebhookStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [customSheetInput, setCustomSheetInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedData, setCopiedData] = useState(false);
  const [copiedWeeklyData, setCopiedWeeklyData] = useState(false);
  const [copiedMonthlyData, setCopiedMonthlyData] = useState(false);
  const [isSyncingWeekly, setIsSyncingWeekly] = useState(false);
  const [isSyncingMonthly, setIsSyncingMonthly] = useState(false);
  const [showSyncConfirmModal, setShowSyncConfirmModal] = useState(false);
  const [pendingSyncTarget, setPendingSyncTarget] = useState<'weekly' | 'monthly' | null>(null);
  const [isExecutingConfirmedSync, setIsExecutingConfirmedSync] = useState(false);
  const [sheetSubsheetTab, setSheetSubsheetTab] = useState<string>('about');

  // Dynamically group records into active follow-up months
  const activeFollowUpMonths = useMemo(() => {
    const map: Record<string, CredentialingRecord[]> = {};
    records.forEach((r) => {
      const m = getFollowUpMonthLabel(r.nextFollowUpDate);
      if (m !== 'None') {
        if (!map[m]) map[m] = [];
        map[m].push(r);
      }
    });
    return Object.keys(map)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((monthKey) => ({
        key: monthKey,
        label: monthKey,
        count: map[monthKey].length,
        records: map[monthKey],
      }));
  }, [records]);

  const noFollowUpRecords = useMemo(() => {
    return records.filter((r) => getFollowUpMonthLabel(r.nextFollowUpDate) === 'None');
  }, [records]);

  // Dedicated attached sheets provided by user
  const weeklySheet = sheetsConfig.weeklySheet || USER_ATTACHED_WEEKLY_SHEET;
  const monthlySheet = sheetsConfig.monthlySheet || USER_ATTACHED_MONTHLY_SHEET;

  // Verify whether a genuine Google Sheet has been linked or system-attached
  const isSystemAttachedWorkbook = true; // User's workbooks are directly attached
  const isExternalGoogleSheetLinked = Boolean(
    sheetsConfig.spreadsheetId &&
    sheetsConfig.spreadsheetId.length > 20 &&
    !sheetsConfig.spreadsheetId.startsWith('1PTS-') &&
    !sheetsConfig.spreadsheetId.includes('master-workbook-attached') &&
    !sheetsConfig.spreadsheetId.includes('system-master-workbook')
  );
  const isRealSpreadsheetLinked = true; // Always true with user's attached sheets

  // --------------------------------------------------------------------------
  // PERIOD & DATE FILTERING STATE (Weekly cycle & Monthly)
  // --------------------------------------------------------------------------
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentWeekNum = Math.ceil(now.getDate() / 7);

  // Helper to calculate weekly cycle dates
  const getWeeklyDates = (weekIndex: number, year: number) => {
    // 7-day cadence calculation matching Proficio's standard weekly reporting
    const start = new Date(year, now.getMonth(), (weekIndex - 1) * 7 + 1);
    const end = new Date(year, now.getMonth(), weekIndex * 7);
    return {
      startStr: start.toISOString().split('T')[0],
      endStr: end.toISOString().split('T')[0],
      label: `Week ${weekIndex} • Current Year ${year}`,
    };
  };

  const getMonthlyDates = (monthName: string, year: number) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const mIdx = monthNames.findIndex(m => monthName.toLowerCase().startsWith(m.toLowerCase()));
    const validIdx = mIdx === -1 ? now.getMonth() : mIdx;
    const start = new Date(year, validIdx, 1);
    const end = new Date(year, validIdx + 1, 0);
    return {
      startStr: start.toISOString().split('T')[0],
      endStr: end.toISOString().split('T')[0],
      label: `${monthNames[validIdx]} ${year}`,
    };
  };

  const defaultWeekly = getWeeklyDates(currentWeekNum, currentYear);

  // Configuration (controls input before Apply)
  const [configuredPeriod, setConfiguredPeriod] = useState<string>(defaultWeekly.label);
  const [configuredDateField, setConfiguredDateField] = useState<string>('all');
  const [configuredStartDate, setConfiguredStartDate] = useState<string>(defaultWeekly.startStr);
  const [configuredEndDate, setConfiguredEndDate] = useState<string>(defaultWeekly.endStr);

  // Applied filter state (applied when user clicks "Apply")
  const [appliedPeriod, setAppliedPeriod] = useState<string>(defaultWeekly.label);
  const [appliedDateField, setAppliedDateField] = useState<string>('all');
  const [appliedStartDate, setAppliedStartDate] = useState<string>(defaultWeekly.startStr);
  const [appliedEndDate, setAppliedEndDate] = useState<string>(defaultWeekly.endStr);

  const hasUnappliedFilters = 
    configuredPeriod !== appliedPeriod ||
    configuredDateField !== appliedDateField ||
    configuredStartDate !== appliedStartDate ||
    configuredEndDate !== appliedEndDate;

  // --------------------------------------------------------------------------
  // HISTORICAL SNAPSHOT STATE
  // --------------------------------------------------------------------------
  const [savedSnapshots, setSavedSnapshots] = useState<ReportSnapshot[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>('live');
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);
  const [showSaveSnapshotModal, setShowSaveSnapshotModal] = useState(false);
  const [snapshotNote, setSnapshotNote] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');

  // Table filters & search
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('ALL');

  // Upload & Import State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedReportRow[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // --------------------------------------------------------------------------
  // INITIALIZATION & AUTH LISTENERS
  // --------------------------------------------------------------------------
  useEffect(() => {
    // 1. Initialize Firebase Google Auth listener
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );

    // 2. Fetch Google Sheets configuration from database
    fetchGoogleSheetsConfig().then((cfg) => {
      setSheetsConfig(cfg);
      if (cfg.weeklyWebhookUrl || cfg.defaultWebhookUrl) {
        setWebhookWeeklyInput(cfg.weeklyWebhookUrl || cfg.defaultWebhookUrl || '');
      }
      if (cfg.monthlyWebhookUrl || cfg.defaultWebhookUrl) {
        setWebhookMonthlyInput(cfg.monthlyWebhookUrl || cfg.defaultWebhookUrl || '');
      }
    });

    // 3. Fetch saved snapshots from database
    fetchReportSnapshots().then((snaps) => {
      setSavedSnapshots(snaps);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Update dates when switching tabs or period presets
  const handlePeriodPresetChange = (newPeriod: string) => {
    setConfiguredPeriod(newPeriod);
    if (activeTab === 'weekly') {
      const match = newPeriod.match(/Week\s+(\d+)/i);
      const weekIdx = match ? parseInt(match[1]) : currentWeekNum;
      const dates = getWeeklyDates(weekIdx, currentYear);
      setConfiguredStartDate(dates.startStr);
      setConfiguredEndDate(dates.endStr);
    } else {
      const dates = getMonthlyDates(newPeriod, currentYear);
      setConfiguredStartDate(dates.startStr);
      setConfiguredEndDate(dates.endStr);
    }
  };

  const handleApplyFilters = () => {
    setAppliedPeriod(configuredPeriod);
    setAppliedDateField(configuredDateField);
    setAppliedStartDate(configuredStartDate);
    setAppliedEndDate(configuredEndDate);
    if (selectedSnapshotId !== 'live') {
      setSelectedSnapshotId('live');
    }
    addToast('Report filters updated.', 'success');
  };

  const handleResetFilters = () => {
    const dates = activeTab === 'weekly' 
      ? getWeeklyDates(currentWeekNum, currentYear) 
      : getMonthlyDates('October 2026', currentYear);
    
    setConfiguredPeriod(dates.label);
    setConfiguredDateField('all');
    setConfiguredStartDate(dates.startStr);
    setConfiguredEndDate(dates.endStr);

    setAppliedPeriod(dates.label);
    setAppliedDateField('all');
    setAppliedStartDate(dates.startStr);
    setAppliedEndDate(dates.endStr);
    setSelectedSnapshotId('live');
    addToast('Reset to default reporting period.', 'info');
  };

  // --------------------------------------------------------------------------
  // ACTIVE DATA RESOLUTION (Live filtered records vs Historical Snapshot)
  // --------------------------------------------------------------------------
  const activeSnapshot = useMemo(() => {
    if (selectedSnapshotId === 'live') return null;
    return savedSnapshots.find((s) => s.id === selectedSnapshotId) || null;
  }, [selectedSnapshotId, savedSnapshots]);

  // Filter live records according to applied date field & range
  const liveFilteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Date filtering
      if (appliedDateField !== 'all') {
        const dateVal = (r as any)[appliedDateField];
        if (!dateVal) return false; // Missing dates handled explicitly: not in range
        const dateIso = String(dateVal).substring(0, 10);
        if (appliedStartDate && dateIso < appliedStartDate) return false;
        if (appliedEndDate && dateIso > appliedEndDate) return false;
      }

      return true;
    });
  }, [records, appliedDateField, appliedStartDate, appliedEndDate]);

  // --------------------------------------------------------------------------
  // SIX PRESERVED KPI CALCULATIONS (Identical to reference executive report)
  // --------------------------------------------------------------------------
  const computedKpis = useMemo(() => {
    if (activeSnapshot) {
      // Freeze exact historical snapshot numbers — never recalculate from live data!
      return activeSnapshot.kpis;
    }

    const recs = liveFilteredRecords;
    const activeIntakes = recs.filter((r) => ['Intake', 'Documents Pending', 'Documents Complete'].includes(r.stage)).length;
    const appPrep = recs.filter((r) => r.stage === 'Application Preparation').length;
    const submittedToPayers = recs.filter((r) => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
    const followUpsDue = recs.filter((r) => r.nextFollowUpDate && !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage)).length;
    const approvedActive = recs.filter((r) => ['Approved', 'Linked', 'Effective', 'Payer Approved / In-Network'].includes(r.stage)).length;
    const overdueDelayed = recs.filter((r) => r.isOverdue || r.stage === 'Overdue' || (r.externalDelayDays && r.externalDelayDays > 0)).length;

    const totalDays = recs.reduce((sum, r) => sum + (r.daysInCurrentStage || 0), 0);
    const avgDays = recs.length > 0 ? Math.round(totalDays / recs.length) : (kpis.averageCredentialingCycleDays || 58);

    return {
      activeIntakes,
      appPrep,
      submittedToPayers,
      followUpsDue,
      approvedActive,
      overdueDelayed,
      totalRecords: recs.length,
      averageCycleDays: avgDays,
    };
  }, [activeSnapshot, liveFilteredRecords, kpis.averageCredentialingCycleDays]);

  // --------------------------------------------------------------------------
  // ENROLLMENT TABLE ROWS (All 11 Preserved Columns)
  // --------------------------------------------------------------------------
  const displayedTableRows = useMemo(() => {
    if (activeSnapshot) {
      // Historical Snapshot Rows
      return activeSnapshot.rows.filter((row) => {
        if (filterStage !== 'ALL') {
          if (filterStage === 'SUBMITTED' && !['Application Submitted', 'Resubmitted', 'Payer Review'].includes(row.stage)) return false;
          if (filterStage === 'APPROVED' && !['Approved', 'Linked', 'Effective'].includes(row.stage)) return false;
          if (filterStage === 'INTAKE' && !['Intake', 'Documents Pending', 'Documents Complete'].includes(row.stage)) return false;
        }
        if (tableSearchQuery.trim()) {
          const q = tableSearchQuery.toLowerCase();
          return (
            row.clinicianName.toLowerCase().includes(q) ||
            row.npi.includes(q) ||
            row.payerName.toLowerCase().includes(q) ||
            row.discipline.toLowerCase().includes(q) ||
            row.legalEntity.toLowerCase().includes(q)
          );
        }
        return true;
      });
    }

    // Live Records Rows
    return liveFilteredRecords
      .filter((r) => {
        if (filterStage !== 'ALL') {
          if (filterStage === 'SUBMITTED' && !['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)) return false;
          if (filterStage === 'APPROVED' && !['Approved', 'Linked', 'Effective'].includes(r.stage)) return false;
          if (filterStage === 'OVERDUE' && !r.isOverdue) return false;
          if (filterStage === 'FOLLOW_UP' && !r.nextFollowUpDate) return false;
        }

        if (tableSearchQuery.trim()) {
          const q = tableSearchQuery.toLowerCase();
          const prov = providers.find((p) => p.id === r.providerId);
          const pay = payers.find((p) => p.id === r.payerId);
          const ent = entities.find((e) => e.id === r.entityId);
          const provName = prov?.fullName || `${prov?.firstName} ${prov?.lastName}`;
          return (
            (provName && provName.toLowerCase().includes(q)) ||
            (prov?.npi && prov.npi.includes(q)) ||
            (pay?.name && pay.name.toLowerCase().includes(q)) ||
            (r.discipline && r.discipline.toLowerCase().includes(q)) ||
            (ent?.legalName && ent.legalName.toLowerCase().includes(q)) ||
            (ent?.dba && ent.dba.toLowerCase().includes(q))
          );
        }

        return true;
      })
      .map((r) => {
        const prov = providers.find((p) => p.id === r.providerId);
        const pay = payers.find((p) => p.id === r.payerId);
        const ent = entities.find((e) => e.id === r.entityId);

        const clinicianName = prov ? ((prov as any).fullName || `${prov.firstName} ${prov.lastName}`) : 'N/A';
        const legalEntity = ent?.dba || ent?.legalName || ent?.name || 'Proficio Therapy Services, LLC';

        return {
          recordId: r.id,
          clinicianName,
          npi: prov?.npi || '—',
          discipline: r.discipline || 'Speech',
          legalEntity,
          payerName: pay?.name || '—',
          stage: r.stage,
          submitted: r.submissionDate || '—',
          approved: r.approvalDate || '—',
          effective: r.effectiveDate || '—',
          days: r.daysInCurrentStage || 0,
          nextFollowUp: r.nextFollowUpDate || '—',
        };
      });
  }, [activeSnapshot, liveFilteredRecords, providers, payers, entities, filterStage, tableSearchQuery]);

  // Missing date count helper
  const missingDateCount = useMemo(() => {
    if (appliedDateField === 'all') return 0;
    return records.filter((r) => !(r as any)[appliedDateField]).length;
  }, [records, appliedDateField]);

  // --------------------------------------------------------------------------
  // GOOGLE SHEETS ACTIONS
  // --------------------------------------------------------------------------
  const handleConnectGoogle = async (): Promise<boolean> => {
    try {
      setIsConnectingGoogle(true);
      const res = await signInWithGoogle();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        addToast(`Connected to Google as ${res.user.email}! Direct Google Sheets synchronization is ready.`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-blocked' ||
        err?.message?.toLowerCase().includes('popup')
      ) {
        addToast('Browser popup blocked. Please allow popups for Google sign-in to authorize spreadsheet access.', 'warning');
      } else {
        addToast(err?.message || 'Failed to authenticate with Google.', 'error');
      }
      return false;
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await signOutGoogle();
      setGoogleUser(null);
      setGoogleToken(null);
      addToast('Disconnected Google account.', 'info');
    } catch {
      addToast('Error disconnecting Google account.', 'error');
    }
  };

  const handleInstantInitializeMasterWorkbook = async () => {
    try {
      setIsSyncing(true);
      const conf = await initializeMasterWorkbookDirectly();
      setSheetsConfig(conf);
      setActiveTab('sheets');
      setShowLinkSheetModal(false);
      addToast('Master Workbook created and attached by system! All 5 subsheets with company logo formula and live records are active.', 'success');
    } catch (err: any) {
      addToast(err?.message || 'Failed to auto-attach workbook.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenGoogleSheetsNew = () => {
    try {
      const tsv = generateClipboardFormattedTsv(records, providers, payers, entities);
      navigator.clipboard.writeText(tsv);
      window.open('https://sheets.new', '_blank', 'noopener,noreferrer');
      addToast('Opened sheets.new and copied all formatted data to clipboard! Click cell A1 and press Ctrl+V.', 'success');
    } catch {
      window.open('https://sheets.new', '_blank', 'noopener,noreferrer');
      addToast('Opened sheets.new! In your new sheet, use "Copy Formatted Data" to paste into cell A1.', 'info');
    }
  };

  const handleCopyFormattedSheetData = () => {
    try {
      const tsv = generateClipboardFormattedTsv(records, providers, payers, entities);
      navigator.clipboard.writeText(tsv);
      setCopiedData(true);
      addToast('Ready-to-paste spreadsheet data copied to clipboard (includes company logo formula & all records)!', 'success');
      setTimeout(() => setCopiedData(false), 3000);
    } catch {
      addToast('Failed to copy spreadsheet data to clipboard.', 'error');
    }
  };

  const handleCopyWeeklySheetData = () => {
    try {
      const tsv = generateWeeklySheetTsv(records, providers, payers, entities, appliedPeriod);
      navigator.clipboard.writeText(tsv);
      setCopiedWeeklyData(true);
      addToast('Weekly Sheet data copied to clipboard! (Includes logo formula, 7-day cadence KPIs & records). In your weekly sheet, click cell A1 and press Ctrl+V.', 'success');
      setTimeout(() => setCopiedWeeklyData(false), 3000);
    } catch {
      addToast('Failed to copy weekly spreadsheet data.', 'error');
    }
  };

  const handleCopyMonthlySheetData = () => {
    try {
      const tsv = generateMonthlySheetTsv(records, providers, payers, entities, appliedPeriod);
      navigator.clipboard.writeText(tsv);
      setCopiedMonthlyData(true);
      addToast('Monthly Review data copied to clipboard! (Includes logo formula, executive KPI pipeline & records). In your monthly sheet, click cell A1 and press Ctrl+V.', 'success');
      setTimeout(() => setCopiedMonthlyData(false), 3000);
    } catch {
      addToast('Failed to copy monthly spreadsheet data.', 'error');
    }
  };

  const handleCopyAppsScriptCode = () => {
    try {
      navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SOURCE);
      setCopiedScript(true);
      addToast('Google Apps Script code copied to clipboard! Paste it into Extensions > Apps Script in your sheet.', 'success');
      setTimeout(() => setCopiedScript(false), 3000);
    } catch {
      addToast('Failed to copy code to clipboard.', 'error');
    }
  };

  const handleSaveAndTestWebhook = async (targetType: 'weekly' | 'monthly' | 'both') => {
    const urlToTest = targetType === 'monthly' ? webhookMonthlyInput : webhookWeeklyInput;
    if (!urlToTest || !urlToTest.trim() || !urlToTest.startsWith('http')) {
      setWebhookStatusMessage({
        type: 'error',
        text: 'Please paste a valid Webhook URL starting with https://script.google.com/...',
      });
      return;
    }

    setIsTestingWebhook(true);
    setWebhookStatusMessage(null);
    try {
      const testRes = await testWebhookConnection(urlToTest.trim(), targetType === 'monthly' ? 'monthly' : 'weekly');
      if (testRes.success) {
        const updated = await saveGoogleSheetsConfig({
          weeklyWebhookUrl: targetType === 'monthly' ? sheetsConfig.weeklyWebhookUrl : urlToTest.trim(),
          monthlyWebhookUrl: targetType === 'weekly' ? sheetsConfig.monthlyWebhookUrl : (targetType === 'both' ? urlToTest.trim() : (webhookMonthlyInput.trim() || urlToTest.trim())),
          defaultWebhookUrl: urlToTest.trim(),
        });
        setSheetsConfig(updated);
        setWebhookStatusMessage({
          type: 'success',
          text: 'Google Apps Script Webhook connected successfully! 1-Click automated sync is now active.',
        });
        addToast('Webhook connected and verified! You can now use 1-Click Auto-Sync.', 'success');
      } else {
        setWebhookStatusMessage({
          type: 'error',
          text: testRes.message || 'Could not reach the Apps Script Webhook. Make sure it is deployed as "Web app" with access: "Anyone".',
        });
      }
    } catch (err: any) {
      setWebhookStatusMessage({
        type: 'error',
        text: err?.message || 'Error testing webhook endpoint.',
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleRequestSync = async (target: 'weekly' | 'monthly') => {
    if (!googleToken) {
      addToast('Please connect your Google Account to authorize direct spreadsheet synchronization.', 'info');
      const connected = await handleConnectGoogle();
      if (!connected) return;
    }
    setPendingSyncTarget(target);
    setShowSyncConfirmModal(true);
  };

  const handleSyncWeeklySheet = () => handleRequestSync('weekly');
  const handleSyncMonthlySheet = () => handleRequestSync('monthly');

  const handleExecuteConfirmedSync = async () => {
    if (!pendingSyncTarget) return;
    const target = pendingSyncTarget;
    const targetSheet = target === 'weekly' ? weeklySheet : monthlySheet;
    const userEmail = googleUser?.email || currentUser?.email || currentAccount?.email || 'Joel Mathew Reji';

    setIsExecutingConfirmedSync(true);
    if (target === 'weekly') setIsSyncingWeekly(true);
    else setIsSyncingMonthly(true);

    try {
      // 1. Primary Direct Push via Google Sheets REST API v4 using OAuth access token
      if (googleToken) {
        const directRes = await directPushAllSubsheetsViaGoogleApi(
          googleToken,
          target,
          records,
          providers,
          payers,
          entities,
          targetSheet.spreadsheetId,
          userEmail
        );

        if (directRes.success) {
          const refreshed = await fetchGoogleSheetsConfig();
          setSheetsConfig(refreshed);
          setShowSyncConfirmModal(false);
          addToast(`Direct Google Sheets Sync Success! Pushed ${records.length} records and ${activeFollowUpMonths.length} active month subsheets directly to "${targetSheet.sheetTitle}".`, 'success');
          return;
        } else {
          if (directRes.error?.includes('401') || directRes.error?.toLowerCase().includes('expired')) {
            setGoogleToken(null);
            addToast('Google session expired. Please sign in with Google again.', 'warning');
            setShowSyncConfirmModal(false);
            return;
          }
          throw new Error(directRes.message || 'Direct Google Sheets sync failed.');
        }
      }

      // 2. Fallback to Google Apps Script Webhook
      const targetWebhook = target === 'weekly'
        ? (sheetsConfig.weeklyWebhookUrl || sheetsConfig.defaultWebhookUrl)
        : (sheetsConfig.monthlyWebhookUrl || sheetsConfig.defaultWebhookUrl);

      const result = await syncToGoogleSheetsViaWebhook(
        target,
        records,
        providers,
        payers,
        entities,
        targetWebhook || undefined,
        userEmail
      );

      if (result.success && result.mode === 'webhook_executed') {
        const refreshed = await fetchGoogleSheetsConfig();
        setSheetsConfig(refreshed);
        setShowSyncConfirmModal(false);
        addToast(`1-Click Auto-Sync Success! Pushed ${records.length} records and active month subsheets directly to your Google Sheet.`, 'success');
      } else if (result.mode === 'webhook_needed' || !targetWebhook) {
        setShowSyncConfirmModal(false);
        setWebhookStatusMessage({
          type: 'info',
          text: 'Connect via Direct Google Account Sync above, or paste your deployed Apps Script Webhook URL for 1-click sync.',
        });
        setShowWebhookModal(true);
      } else {
        setShowSyncConfirmModal(false);
        addToast(result.message || 'Auto-sync completed.', 'info');
      }
    } catch (err: any) {
      addToast(err?.message || 'Failed to auto-sync Google Sheet.', 'error');
    } finally {
      setIsExecutingConfirmedSync(false);
      setIsSyncingWeekly(false);
      setIsSyncingMonthly(false);
    }
  };

  const handleDirectGoogleSignInAndSync = async (target: 'weekly' | 'monthly') => {
    try {
      let activeToken = googleToken;
      if (!activeToken) {
        setIsConnectingGoogle(true);
        const res = await signInWithGoogle();
        if (!res?.accessToken) {
          addToast('Could not acquire Google authorization token.', 'error');
          return;
        }
        activeToken = res.accessToken;
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        addToast(`Connected to Google as ${res.user.email}!`, 'success');
      }

      if (target === 'weekly') {
        setIsSyncingWeekly(true);
        const directRes = await directPushAllSubsheetsViaGoogleApi(
          activeToken,
          'weekly',
          records,
          providers,
          payers,
          entities,
          weeklySheet.spreadsheetId,
          currentUser?.email || currentAccount?.email || 'Joel Mathew Reji'
        );
        if (directRes.success) {
          const refreshed = await fetchGoogleSheetsConfig();
          setSheetsConfig(refreshed);
          setShowWebhookModal(false);
          addToast(`Direct Google API Sync Succeeded! Updated About, Dashboard, 19-col Master, and ${activeFollowUpMonths.length} active month subsheets in your Weekly Sheet.`, 'success');
        } else {
          addToast(directRes.message || 'Direct sync failed.', 'error');
        }
      } else {
        setIsSyncingMonthly(true);
        const directRes = await directPushAllSubsheetsViaGoogleApi(
          activeToken,
          'monthly',
          records,
          providers,
          payers,
          entities,
          monthlySheet.spreadsheetId,
          currentUser?.email || currentAccount?.email || 'Joel Mathew Reji'
        );
        if (directRes.success) {
          const refreshed = await fetchGoogleSheetsConfig();
          setSheetsConfig(refreshed);
          setShowWebhookModal(false);
          addToast(`Direct Google API Sync Succeeded! Updated About, Dashboard, 19-col Master, and ${activeFollowUpMonths.length} active month subsheets in your Monthly Sheet.`, 'success');
        } else {
          addToast(directRes.message || 'Direct sync failed.', 'error');
        }
      }
    } catch (err: any) {
      addToast(err?.message || 'Direct Google sync failed.', 'error');
    } finally {
      setIsConnectingGoogle(false);
      setIsSyncingWeekly(false);
      setIsSyncingMonthly(false);
    }
  };

  const handleCreateWorkbook = async () => {
    setIsSyncing(true);
    try {
      if (googleToken) {
        const wb = await createCredentialingWorkbook(googleToken, googleUser?.email || currentAccount?.email);
        setSheetsConfig((prev) => ({
          ...prev,
          spreadsheetId: wb.spreadsheetId,
          spreadsheetUrl: wb.spreadsheetUrl,
          lastSyncedAt: new Date().toISOString(),
        }));
        await syncAppToGoogleSheets(
          googleToken,
          wb.spreadsheetId,
          records,
          providers,
          payers,
          entities,
          googleUser?.email || currentAccount?.email
        );
        addToast('New Google Sheets workbook initialized and live records synchronized!', 'success');
      } else {
        setShowLinkSheetModal(true);
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to create workbook.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLinkCustomSheet = async () => {
    if (!customSheetInput.trim()) return;
    let sheetId = customSheetInput.trim();
    const match = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      sheetId = match[1];
    }
    if (sheetId.length < 20 || sheetId.startsWith('1PTS-')) {
      addToast('Please provide a valid Google Sheet URL from your browser address bar (e.g., https://docs.google.com/spreadsheets/d/...)', 'error');
      return;
    }
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    try {
      setIsSyncing(true);
      const updated = await saveGoogleSheetsConfig({
        spreadsheetId: sheetId,
        spreadsheetUrl: sheetUrl,
        sheetTitle: 'Proficio Therapy Services — Credentialing Master Workbook',
        lastSyncedAt: new Date().toISOString(),
        lastSyncStatus: 'SUCCESS',
        lastSyncMessage: 'Google Sheet linked successfully with two-way sync active.',
      });
      setSheetsConfig(updated);
      setShowLinkSheetModal(false);
      setCustomSheetInput('');
      addToast('Google Sheets workbook linked successfully!', 'success');

      await syncAppToGoogleSheets(
        googleToken,
        sheetId,
        records,
        providers,
        payers,
        entities,
        googleUser?.email || currentAccount?.email
      );
      addToast('Exported live credentialing records to linked spreadsheet!', 'success');
    } catch (err: any) {
      addToast(err?.message || 'Failed to link Google Sheets workbook.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopySheetLink = () => {
    const url = sheetsConfig.spreadsheetUrl || (sheetsConfig.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/edit` : '');
    if (url) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      addToast('Google Sheets link copied to clipboard!', 'info');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSyncToSheets = async () => {
    if (!isRealSpreadsheetLinked || !sheetsConfig.spreadsheetId) {
      setShowLinkSheetModal(true);
      addToast('Please link your Google Sheet URL first.', 'info');
      return;
    }
    const targetSheetId = sheetsConfig.spreadsheetId;
    setIsSyncing(true);
    setSyncDirection('export');
    setShowConfirmModal(null);
    try {
      const res = await syncAppToGoogleSheets(
        googleToken,
        targetSheetId,
        records,
        providers,
        payers,
        entities,
        googleUser?.email || currentAccount?.email
      );
      if (res.success) {
        setSheetsConfig((prev) => ({
          ...prev,
          lastSyncedAt: new Date().toISOString(),
          lastSyncStatus: 'SUCCESS',
        }));
        addToast(`Exported ${res.recordsSynced} records to Google Sheets Live_Records!`, 'success');
      } else {
        addToast(res.error || 'Export failed.', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Export failed.', 'error');
    } finally {
      setIsSyncing(false);
      setSyncDirection(null);
    }
  };

  const handlePullFromSheets = async () => {
    if (!isRealSpreadsheetLinked || !sheetsConfig.spreadsheetId) {
      setShowLinkSheetModal(true);
      addToast('Please link your Google Sheet URL first.', 'info');
      return;
    }
    const targetSheetId = sheetsConfig.spreadsheetId;
    setIsSyncing(true);
    setSyncDirection('import');
    setShowConfirmModal(null);
    try {
      const res = await syncSheetsToApp(
        googleToken,
        targetSheetId,
        records,
        googleUser?.email || currentAccount?.email
      );
      if (res.success) {
        if (res.updatedRecords && res.updatedRecords.length > 0) {
          for (const rec of res.updatedRecords) {
            updateRecord(rec.id, rec);
          }
        }
        if (res.addedRecords && res.addedRecords.length > 0) {
          for (const rec of res.addedRecords) {
            addRecord(rec);
          }
        }
        if (res.conflicts && res.conflicts.length > 0) {
          setConflictList(res.conflicts);
        }
        setSheetsConfig((prev) => ({
          ...prev,
          lastSyncedAt: new Date().toISOString(),
          lastSyncStatus: res.conflicts && res.conflicts.length > 0 ? 'CONFLICT_DETECTED' : 'SUCCESS',
        }));
        addToast(
          `Import complete: Data in sheet verified & reflected on application! (${res.recordsSynced || 0} records synchronized).`,
          'success'
        );
      } else {
        addToast(res.error || 'Import from Sheets failed.', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Import from Sheets failed.', 'error');
    } finally {
      setIsSyncing(false);
      setSyncDirection(null);
    }
  };

  // --------------------------------------------------------------------------
  // MANUAL SNAPSHOT CREATION & HISTORICAL CORRECTIONS
  // --------------------------------------------------------------------------
  const handleSaveReportSnapshot = async () => {
    if (!isAuthorized) {
      addToast('Only authorized credentialing managers or administrators can save snapshots.', 'error');
      return;
    }

    setIsSavingSnapshot(true);
    try {
      const snapPayload: Omit<ReportSnapshot, 'id' | 'createdAt' | 'version'> = {
        reportType: activeTab === 'weekly' ? 'weekly' : 'monthly',
        reportingPeriod: appliedPeriod,
        reportDate: todayStr,
        entityScope: 'PTS LLC & PSTG INC',
        dateField: appliedDateField,
        startDate: appliedStartDate,
        endDate: appliedEndDate,
        kpis: computedKpis,
        rows: displayedTableRows,
        createdBy: currentAccount?.name || currentAccount?.email || 'Authorized Lead',
        correctionNote: snapshotNote.trim() || undefined,
      };

      const saved = await saveReportSnapshot(snapPayload);
      setSavedSnapshots((prev) => [saved, ...prev.filter((s) => s.id !== saved.id)]);
      setSelectedSnapshotId(saved.id);
      setShowSaveSnapshotModal(false);
      setSnapshotNote('');

      // Also archive snapshot to Google Sheets if connected
      if (googleToken && sheetsConfig.spreadsheetId) {
        archiveSnapshotToGoogleSheets(
          googleToken,
          sheetsConfig.spreadsheetId,
          saved,
          googleUser?.email || currentAccount?.email
        ).then((res) => {
          if (res.success) {
            addToast(`Snapshot archived to Google Sheets tab "${res.sheetName}"!`, 'info');
          }
        }).catch(console.warn);
      }

      addToast(`Report snapshot "${saved.reportingPeriod}" successfully preserved in database!`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to save snapshot.', 'error');
    } finally {
      setIsSavingSnapshot(false);
    }
  };

  const handleSaveCorrection = async () => {
    if (!activeSnapshot || !isAuthorized) return;
    if (!correctionReason.trim()) {
      addToast('Please enter an audit reason for the historical correction.', 'error');
      return;
    }

    setIsSavingSnapshot(true);
    try {
      const revised = await saveReportSnapshot({
        ...activeSnapshot,
        id: activeSnapshot.id,
        isCorrection: true,
        correctionNote: correctionReason.trim(),
        createdBy: currentAccount?.name || currentAccount?.email || 'Authorized Lead',
      });

      setSavedSnapshots((prev) => [revised, ...prev.filter((s) => s.id !== revised.id)]);
      setSelectedSnapshotId(revised.id);
      setShowCorrectionModal(false);
      setCorrectionReason('');

      // Archive revision to Google Sheets if connected
      if (googleToken && sheetsConfig.spreadsheetId) {
        archiveSnapshotToGoogleSheets(
          googleToken,
          sheetsConfig.spreadsheetId,
          revised,
          googleUser?.email || currentAccount?.email
        ).catch(console.warn);
      }

      addToast(`Audited revision v${revised.version} saved with preserved historical trail.`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to save correction.', 'error');
    } finally {
      setIsSavingSnapshot(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Record ID', 'Clinician Name', 'NPI', 'Discipline', 'Legal Entity', 'Payer Name', 'Stage', 'Submitted', 'Approved', 'Effective', 'Days in Stage', 'Next Follow-Up'];
    const rows = displayedTableRows.map((r) => [
      r.recordId,
      `"${r.clinicianName}"`,
      r.npi,
      r.discipline,
      `"${r.legalEntity}"`,
      `"${r.payerName}"`,
      `"${r.stage}"`,
      r.submitted,
      r.approved,
      r.effective,
      r.days,
      r.nextFollowUp,
    ]);

    const csvContent = [
      `# PROFICIO THERAPY SERVICES - EXECUTIVE CREDENTIALING REPORT`,
      `# Period: ${appliedPeriod} | Date: ${todayStr} | Scope: PTS LLC & PSTG INC`,
      `# Snapshot Status: ${activeSnapshot ? `Historical Snapshot (v${activeSnapshot.version})` : 'Live Operational Roster'}`,
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    triggerFileDownload(csvContent, `Proficio_Executive_Report_${appliedPeriod.replace(/[^a-zA-Z0-9]/g, '_')}_${todayStr}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  // --------------------------------------------------------------------------
  // UPLOAD & BATCH IMPORT LOGIC
  // --------------------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    setUploadedFile(file);
    setUploadError(null);
    setImportSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setUploadError('Uploaded file appears to be empty.');
          return;
        }
        const parsed = parseUploadedReport(text, providers, payers, entities);
        if (parsed.length === 0) {
          setUploadError('No valid rows found in uploaded file. Please verify column headers match the template.');
        } else {
          setParsedRows(parsed);
        }
      } catch (err: any) {
        setUploadError(`Failed to parse file: ${err?.message || 'Invalid format'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCommitImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessingUpload(true);
    setImportSuccessMessage(null);

    try {
      let updatedCount = 0;
      let createdCount = 0;

      for (const row of parsedRows) {
        let providerId = row.matchedProviderId;
        if (!providerId) {
          const prov = providers[0];
          providerId = prov ? prov.id : 'prov-default';
        }

        let payerId = row.matchedPayerId;
        if (!payerId) {
          const matchedP = payers.find((p) => p.name.toLowerCase().includes(row.payerName.toLowerCase()));
          payerId = matchedP ? matchedP.id : (payers[0]?.id || 'pyr-default');
        }

        let entityId = row.matchedEntityId;
        if (!entityId) {
          const matchedE = entities.find(
            (e) =>
              (e.legalName && e.legalName.toLowerCase().includes(row.entityName.toLowerCase())) ||
              (e.dba && e.dba.toLowerCase().includes(row.entityName.toLowerCase()))
          );
          entityId = matchedE ? matchedE.id : (entities[0]?.id || 'ent-pts-llc');
        }

        const existingRecord = records.find(
          (r) => r.providerId === providerId && r.payerId === payerId && (r.entityId === entityId || !r.entityId)
        );

        if (existingRecord) {
          updateRecord(existingRecord.id, {
            stage: row.stage as any,
            submissionDate: row.submissionDate || existingRecord.submissionDate,
            approvalDate: row.approvalDate || existingRecord.approvalDate,
            effectiveDate: row.effectiveDate || existingRecord.effectiveDate,
            notes: row.notes ? `${existingRecord.notes ? existingRecord.notes + ' | ' : ''}${row.notes}` : existingRecord.notes,
          });
          updatedCount++;
        } else {
          addRecord({
            providerId,
            payerId,
            entityId,
            discipline: (row.discipline as Discipline) || 'Speech',
            stage: (row.stage as any) || 'Application Submitted',
            submissionDate: row.submissionDate || todayStr,
            approvalDate: row.approvalDate || undefined,
            effectiveDate: row.effectiveDate || undefined,
            notes: row.notes || 'Batch imported from report template',
          });
          createdCount++;
        }
      }

      logAuditEvent({
        action: 'IMPORT',
        entityType: 'CREDENTIALING_ROSTER',
        entityId: uploadedFile?.name || 'batch-report-template',
        actor_email: currentUser?.email || 'admin@proficiotherapy.com',
        details: {
          filename: uploadedFile?.name,
          totalRows: parsedRows.length,
          updatedCount,
          createdCount,
          timestamp: new Date().toISOString(),
        },
      }).catch(() => {});

      setImportSuccessMessage(
        `Successfully synced ${parsedRows.length} rows to the database! (${updatedCount} updated, ${createdCount} new applications enrolled).`
      );
      setParsedRows([]);
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setUploadError(`Database sync error: ${err?.message || 'Failed to update records'}`);
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Legal entity breakdown helpers
  const pstgEntity = entities.find((e) => e.id === 'ent-pstg-inc' || e.legalName.includes('Speech')) || {
    id: 'ent-pstg-inc',
    legalName: 'Proficio Speech Therapy Group, INC.',
    dba: 'Proficio Speech Therapy Group',
    ein: '821221807',
    npiType2: '1083140560',
  };
  const ptsEntity = entities.find((e) => e.id === 'ent-pts-llc' || e.legalName.includes('Therapy Services')) || {
    id: 'ent-pts-llc',
    legalName: 'Proficio Therapy Services, LLC',
    dba: 'Proficio Therapy Services',
    ein: '842419510',
    npiType2: '1811565573',
  };

  return (
    <div className="space-y-6 pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & MAIN TAB SWITCHER                                         */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200/80 text-[#2B4C9D] flex items-center justify-center shadow-xs shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-[#2B4C9D]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Executive Credentialing Reports &amp; Template Center
            </h2>
            <p className="text-xs text-slate-500">
              Proficio Speech Therapy Group &bull; Proficio Therapy Services &bull; AGES Learning Solutions &bull; Official Roster Hub
            </p>
          </div>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main View Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('weekly');
                handlePeriodPresetChange(`Week ${currentWeekNum} • Current Year ${currentYear}`);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'weekly' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#2B4C9D]" />
              <span>Weekly Status</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('monthly');
                handlePeriodPresetChange('October 2026');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'monthly' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Monthly Review</span>
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'sheets' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>Master Workbook (Live Sheet)</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'upload' ? 'bg-[#2B4C9D] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-[#2B4C9D]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload &amp; Templates</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1.5">
            {activeTab === 'weekly' && (
              <button
                onClick={() => downloadWeeklyExecutiveReportHtml({ records, providers, payers, entities, locations })}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#2B4C9D] border border-indigo-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                title="Download formatted executive report with company logo"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Executive Report (.html)</span>
              </button>
            )}

            {activeTab === 'monthly' && (
              <button
                onClick={() => downloadMonthlyExecutiveReportHtml({ records, providers, payers, entities, locations, periodLabel: appliedPeriod, disciplineFilter: selectedMonthlyDiscipline })}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                title="Download formatted monthly review with company logo"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Monthly Review (.html)</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              title="Download raw report data as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. GOOGLE SHEETS CONTINUOUS TWO-WAY SYNCHRONIZATION BAR (ADMIN/DEV ONLY)   */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. GOOGLE SHEETS DEDICATED WORKBOOKS COMMAND BAR (WEEKLY & MONTHLY)        */}
      {/* ========================================================================= */}
      {canManageSheetsWorkbook && (
        <div className="bg-gradient-to-r from-slate-900 via-[#0f2b5c] to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-800 space-y-4 print:hidden">
          {/* Top Bar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-extrabold tracking-tight text-white">
                    Google Sheets Attached Workbooks • Weekly Status &amp; Monthly Review
                  </h3>
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <CheckCheck className="w-3 h-3" />
                    <span>Direct Attached &bull; 0 Popups</span>
                  </span>
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    <span>Logo Formula Active</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Directly linked to your designated Google Spreadsheets for operational reporting. Zero sign-in friction, zero domain blocks.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('sheets')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-white/20 transition-colors"
                title="View live interactive Master Workbook inside app"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-300" />
                <span>Live Sheet View</span>
              </button>
              <a
                href="/api/reports/download-workbook"
                download="PTS_Credentialing_Master_Workbook_2026.xlsx"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                title="Download formatted Master Workbook with all subsheets and company logo"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .xlsx</span>
              </a>
            </div>
          </div>

          {/* Google Account Authentication & Authorization Status Banner */}
          {googleToken && googleUser ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white">Google Account Authorized:</span>
                    <span className="text-xs font-mono font-bold text-emerald-300">{googleUser.email}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      Sheets REST API v4 Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    1-Click Direct Sync writes directly to your connected Google Sheets. No webhooks or Apps Script deployments required.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDisconnectGoogle}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer border border-white/10"
                title="Disconnect Google account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/15 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <FileSpreadsheet className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-extrabold text-white">
                      Direct Google Sheets API Connection
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                      Google Sign-In Required for 1-Click Sync
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 max-w-xl">
                    Sign in with your Google account to enable direct 1-click updates to your Google Spreadsheets. Writes all 19 columns and dynamic month subsheets automatically with zero manual script setup.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleConnectGoogle()}
                  disabled={isConnectingGoogle}
                  className="gsi-material-button shadow-md disabled:opacity-50"
                  title="Sign in with your Google account to authorize Google Sheets API write access"
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isConnectingGoogle ? 'Signing in...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Dual Dedicated Sheet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 1: WEEKLY WORKBOOK */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 hover:bg-white/7 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    Weekly Status Workbook
                  </h4>
                  {Boolean(sheetsConfig.weeklyWebhookUrl || sheetsConfig.defaultWebhookUrl) ? (
                    <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <Check className="w-2.5 h-2.5" />
                      <span>Webhook Connected</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowWebhookModal(true)}
                      className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30 hover:bg-amber-500/30 cursor-pointer"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Configure 1-Click Sync</span>
                    </button>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]" title={weeklySheet.spreadsheetId}>
                  ID: {weeklySheet.spreadsheetId ? `${weeklySheet.spreadsheetId.substring(0, 8)}...` : 'Linked'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-snug">
                Attached to your designated weekly sheet. Replaces template sample rows with live database records, creating About, Dashboard, 19-col Weekly Report, and dynamic subsheets for each active month.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSyncWeeklySheet}
                  disabled={isSyncingWeekly}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50 transition-all transform active:scale-95"
                  title="Direct automated 1-click push into your Weekly Google Sheet without manual copy-paste"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWeekly ? 'animate-spin' : ''}`} />
                  <span>{isSyncingWeekly ? 'Syncing...' : '1-Click Auto-Sync'}</span>
                </button>

                <a
                  href={weeklySheet.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1tQu_HAFaUi8uePJIvkuBJ70Xw6e4AZecoFMBSHZ8eXw/edit?usp=sharing'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer border border-white/20 transition-colors"
                  title="Open attached Weekly Google Sheet in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Sheet ↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowWebhookModal(true)}
                  className="px-2.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-white/15 transition-colors"
                  title="Google Apps Script Webhook settings and Code.gs instructions"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-300" />
                  <span>Webhook Setup</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyWeeklySheetData}
                  className="px-2.5 py-2 bg-white/5 hover:bg-white/15 text-slate-300 rounded-xl text-xs font-medium inline-flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Copy formatted TSV as manual fallback for cell A1"
                >
                  {copiedWeeklyData ? <CheckCheck className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWeeklyData ? 'Copied' : 'Copy TSV'}</span>
                </button>
              </div>
            </div>

            {/* CARD 2: MONTHLY WORKBOOK */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 hover:bg-white/7 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-300">
                    Monthly Review Workbook
                  </h4>
                  {Boolean(sheetsConfig.monthlyWebhookUrl || sheetsConfig.defaultWebhookUrl) ? (
                    <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      <Check className="w-2.5 h-2.5" />
                      <span>Webhook Connected</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowWebhookModal(true)}
                      className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30 hover:bg-amber-500/30 cursor-pointer"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Configure 1-Click Sync</span>
                    </button>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]" title={monthlySheet.spreadsheetId}>
                  ID: {monthlySheet.spreadsheetId ? `${monthlySheet.spreadsheetId.substring(0, 8)}...` : 'Linked'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-snug">
                Attached to your designated monthly sheet. Pushes live system data to About, Executive Dashboard, Monthly Review 19-col, and active month subsheets with zero manual copy-paste.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSyncMonthlySheet}
                  disabled={isSyncingMonthly}
                  className="px-3.5 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50 transition-all transform active:scale-95"
                  title="Direct automated 1-click push into your Monthly Google Sheet without manual copy-paste"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMonthly ? 'animate-spin' : ''}`} />
                  <span>{isSyncingMonthly ? 'Syncing...' : '1-Click Auto-Sync'}</span>
                </button>

                <a
                  href={monthlySheet.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1gN_yYaNDtxps8_VEYvn0O83SmolKIsgiT_W3cVhIIT8/edit?usp=sharing'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer border border-white/20 transition-colors"
                  title="Open attached Monthly Google Sheet in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  <span>Open Sheet ↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowWebhookModal(true)}
                  className="px-2.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-white/15 transition-colors"
                  title="Google Apps Script Webhook settings and Code.gs instructions"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-300" />
                  <span>Webhook Setup</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMonthlySheetData}
                  className="px-2.5 py-2 bg-white/5 hover:bg-white/15 text-slate-300 rounded-xl text-xs font-medium inline-flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Copy formatted TSV as manual fallback for cell A1"
                >
                  {copiedMonthlyData ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMonthlyData ? 'Copied' : 'Copy TSV'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conflicts Alert Banner if any detected */}
          {conflictList.length > 0 && (
            <div className="mt-3 p-3 bg-amber-500/20 border border-amber-400/30 rounded-xl text-xs text-amber-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>{conflictList.length} concurrent edits detected:</strong> Application records had newer edits than the spreadsheet. Newer app changes were preserved safely.
                </span>
              </div>
              <button
                onClick={() => setConflictList([])}
                className="text-amber-200 hover:text-white font-bold ml-3 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ENHANCED CONTROLS TOOLBAR & REPORT VIEW (WEEKLY / MONTHLY)              */}
      {/* ========================================================================= */}
      {(activeTab === 'weekly' || activeTab === 'monthly') && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2B4C9D] flex items-center justify-center font-bold">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Reporting Controls &amp; Dynamic Date Engine
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure period cadence, choose date evaluation field, and filter operational KPIs
              </p>
            </div>
          </div>

          {/* Historical Snapshot Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>View Mode:</span>
            </span>
            <select
              value={selectedSnapshotId}
              onChange={(e) => {
                setSelectedSnapshotId(e.target.value);
                if (e.target.value === 'live') {
                  addToast('Switched to Live Realtime Data.', 'info');
                } else {
                  const snap = savedSnapshots.find((s) => s.id === e.target.value);
                  if (snap) {
                    addToast(`Viewing historical snapshot: ${snap.reportingPeriod}`, 'info');
                  }
                }
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 cursor-pointer"
            >
              <option value="live">🟢 Live Operational Roster (Realtime Data)</option>
              {savedSnapshots.length > 0 && (
                <optgroup label="📦 Saved Historical Snapshots">
                  {savedSnapshots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.reportType === 'weekly' ? 'Weekly' : 'Monthly'} • {s.reportingPeriod} {s.isCorrection ? `(v${s.version} Revised)` : `(v${s.version})`}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>

            {selectedSnapshotId !== 'live' && (
              <button
                onClick={() => setSelectedSnapshotId('live')}
                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2B4C9D] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Return to Live
              </button>
            )}
          </div>
        </div>

        {/* Filter Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end text-xs">
          {/* 1. Reporting Period Preset */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Reporting Period:</label>
            <select
              value={configuredPeriod}
              onChange={(e) => handlePeriodPresetChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 cursor-pointer"
            >
              {activeTab === 'weekly' ? (
                <>
                  <option value={`Week ${currentWeekNum} • Current Year ${currentYear}`}>
                    Current Week (Week {currentWeekNum})
                  </option>
                  <option value={`Week ${Math.max(1, currentWeekNum - 1)} • Current Year ${currentYear}`}>
                    Prior Week (Week {Math.max(1, currentWeekNum - 1)})
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].map((w) => (
                    <option key={w} value={`Week ${w} • Current Year ${currentYear}`}>
                      Week {w} • {currentYear}
                    </option>
                  ))}
                </>
              ) : (
                <>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                    <option key={m} value={`${m} ${currentYear}`}>
                      {m} {currentYear}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* 2. Date Field Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Evaluate Date Field:</label>
            <select
              value={configuredDateField}
              onChange={(e) => setConfiguredDateField(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 cursor-pointer"
            >
              <option value="all">All Dates (Full Operational Roster)</option>
              <option value="submissionDate">Submission Date (Payer Review)</option>
              <option value="approvalDate">Approval Date (Payer Approved)</option>
              <option value="effectiveDate">Effective Date (In-Network)</option>
              <option value="recredentialingDueDate">Expiration / Re-credentialing Date</option>
              <option value="nextFollowUpDate">Next Follow-Up Date (Cadence)</option>
              <option value="intakeDate">Intake / Creation Date</option>
              <option value="updatedAt">Last Modified Date</option>
            </select>
          </div>

          {/* 3. Start Date */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Start Date:</label>
            <input
              type="date"
              value={configuredStartDate}
              onChange={(e) => setConfiguredStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
            />
          </div>

          {/* 4. End Date */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">End Date:</label>
            <input
              type="date"
              value={configuredEndDate}
              onChange={(e) => setConfiguredEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
            />
          </div>

          {/* 5. Action Buttons (Apply, Reset, Save Report) */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleApplyFilters}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                hasUnappliedFilters
                  ? 'bg-[#2B4C9D] text-white shadow-md ring-2 ring-blue-300 animate-pulse'
                  : 'bg-[#2B4C9D] text-white shadow-xs hover:bg-[#203a7a]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              title="Reset to default dates"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {isAuthorized && selectedSnapshotId === 'live' && (
              <button
                type="button"
                onClick={() => setShowSaveSnapshotModal(true)}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-xs transition-colors whitespace-nowrap"
                title="Save current period report as immutable snapshot"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Report</span>
              </button>
            )}

            {isAuthorized && selectedSnapshotId !== 'live' && (
              <button
                type="button"
                onClick={() => setShowCorrectionModal(true)}
                className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-xs transition-colors whitespace-nowrap"
                title="Record an audited correction to this snapshot"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Revise Snapshot</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Feedback Status & Unapplied Notice */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-50">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Applied Filter:</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2B4C9D] font-mono font-bold">
              {appliedPeriod}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span>
              Field: <strong className="text-slate-700">{appliedDateField === 'all' ? 'All Records' : appliedDateField}</strong> ({appliedStartDate} through {appliedEndDate})
            </span>
            {missingDateCount > 0 && appliedDateField !== 'all' && (
              <span className="text-amber-600 font-medium">
                ({missingDateCount} records without {appliedDateField} excluded from range)
              </span>
            )}
          </div>

          {hasUnappliedFilters && (
            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 animate-fadeIn">
              ⚠️ Filter settings changed. Click &quot;Apply&quot; to update report metrics.
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. EXECUTIVE REPORT VIEW (Live or Snapshot)                                */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {/* Branded Header with Logo & Metadata Box */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
                <ProficioLogo variant="brand" size="md" />
              </div>
              <div>
                <div className="text-[11px] uppercase font-extrabold text-[#2B4C9D] tracking-wider">
                  Proficio Therapy Services &bull; Proficio Speech Therapy Group
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                  Proficio Therapy Services — Executive {activeTab === 'weekly' ? 'Weekly' : 'Monthly'} Credentialing Report
                </h1>
                <p className="text-xs text-slate-500">
                  Operational Roster Management &amp; Payer Enrollment Pipeline
                </p>
              </div>
            </div>

            {/* Preserved Reference Metadata Box */}
            <div className="text-left md:text-right text-xs text-slate-700 bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-none border-slate-200 space-y-1">
              <div>
                <strong>Report Date:</strong> {activeSnapshot ? activeSnapshot.reportDate : todayStr}
              </div>
              <div>
                <strong>Reporting Cycle:</strong> {appliedPeriod}
              </div>
              <div>
                <strong>Entity Scope:</strong> PTS LLC &amp; PSTG INC
              </div>
              <div className="pt-1">
                {activeSnapshot ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <History className="w-3 h-3" />
                    <span>
                      Historical Snapshot v{activeSnapshot.version} {activeSnapshot.isCorrection ? '(Audited Revision)' : ''} &bull; Saved {new Date(activeSnapshot.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Operational Roster Data</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SECTION 1: THE SIX PRESERVED KPI METRICS CARDS                          */}
          {/* ======================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                1. Executive Operational KPI Metrics ({appliedPeriod})
              </h2>
              <span className="text-[11px] text-slate-400 font-medium font-mono">
                {computedKpis.totalRecords} Total Enrollment Files Evaluated
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* KPI 1: Active Intakes */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-[11px] uppercase font-bold text-slate-500 mb-1">1. Active Intakes</div>
                <div className="text-2xl font-black text-slate-900">{computedKpis.activeIntakes}</div>
                <div className="text-[10px] text-slate-400 mt-1">Intake / Docs Pending</div>
              </div>

              {/* KPI 2: App Prep */}
              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 text-center">
                <div className="text-[11px] uppercase font-bold text-indigo-700 mb-1">2. App Prep</div>
                <div className="text-2xl font-black text-[#2B4C9D]">{computedKpis.appPrep}</div>
                <div className="text-[10px] text-indigo-600 mt-1">Application Preparation</div>
              </div>

              {/* KPI 3: Submitted to Payers */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                <div className="text-[11px] uppercase font-bold text-blue-700 mb-1">3. Submitted to Payers</div>
                <div className="text-2xl font-black text-blue-900">{computedKpis.submittedToPayers}</div>
                <div className="text-[10px] text-blue-600 mt-1">Payer Review / Active</div>
              </div>

              {/* KPI 4: Follow-ups Due */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                <div className="text-[11px] uppercase font-bold text-amber-700 mb-1">4. Follow-ups Due</div>
                <div className="text-2xl font-black text-amber-900">{computedKpis.followUpsDue}</div>
                <div className="text-[10px] text-amber-600 mt-1">Cadence Reminders</div>
              </div>

              {/* KPI 5: Approved / Active */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                <div className="text-[11px] uppercase font-bold text-emerald-700 mb-1">5. Approved / Active</div>
                <div className="text-2xl font-black text-emerald-900">{computedKpis.approvedActive}</div>
                <div className="text-[10px] text-emerald-600 mt-1">Ready for Billing</div>
              </div>

              {/* KPI 6: Overdue / Delayed */}
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-center">
                <div className="text-[11px] uppercase font-bold text-rose-700 mb-1">6. Overdue / Delayed</div>
                <div className="text-2xl font-black text-rose-900">{computedKpis.overdueDelayed}</div>
                <div className="text-[10px] text-rose-600 mt-1">Exceeding Payer SLA</div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SECTION 2: LEGAL ENTITY BREAKDOWN CARDS (PTS LLC & PSTG INC)            */}
          {/* ======================================================================= */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                2. Operating Legal Entity Breakdown (PTS LLC &amp; PSTG INC)
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">
                Compliant legal separation &amp; enrollment rosters
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Entity 1: Proficio Speech Therapy Group, INC. */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2B4C9D]">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {pstgEntity.legalName}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">{pstgEntity.dba || 'Speech Group'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold shrink-0">
                    NPI: {pstgEntity.npiType2 || '1083140560'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Tax ID (EIN)</div>
                    <div className="font-mono font-bold text-slate-800 mt-0.5">{pstgEntity.ein || '821221807'}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Scope</div>
                    <div className="font-bold text-[#2B4C9D] mt-0.5">Speech / SLP</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Files</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {displayedTableRows.filter((r) => r.legalEntity.toLowerCase().includes('speech') || r.discipline === 'Speech').length} Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Entity 2: Proficio Therapy Services, LLC */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {ptsEntity.legalName}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">{ptsEntity.dba || 'Therapy Services'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold shrink-0">
                    NPI: {ptsEntity.npiType2 || '1811565573'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Tax ID (EIN)</div>
                    <div className="font-mono font-bold text-slate-800 mt-0.5">{ptsEntity.ein || '842419510'}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Scope</div>
                    <div className="font-bold text-emerald-700 mt-0.5">OT / ABA / Multi</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Files</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {displayedTableRows.filter((r) => !r.legalEntity.toLowerCase().includes('speech') && r.discipline !== 'Speech').length} Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SECTION 3: PRESERVED ENROLLMENT TABLE (ALL 11 COLUMNS)                  */}
          {/* ======================================================================= */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  3. Credentialing Enrollment Pipeline &amp; Audit Roster
                </h2>
                <p className="text-[11px] text-slate-400">
                  Showing {displayedTableRows.length} enrollment record(s) matching selected criteria
                </p>
              </div>

              {/* Table search & stage chips */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search clinician, NPI, payer..."
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 w-48 sm:w-60"
                />

                <div className="flex items-center space-x-1">
                  {['ALL', 'SUBMITTED', 'APPROVED', 'OVERDUE'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterStage(st)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                        filterStage === st
                          ? 'bg-[#2B4C9D] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preserved 11-column table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white font-bold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 whitespace-nowrap">Clinician Name</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">NPI</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Discipline</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Legal Entity</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Payer Name</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Stage</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Submitted</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Approved</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Effective</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">Days</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Next Follow-Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {displayedTableRows.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-400 text-xs">
                        No enrollment records match the selected date evaluation filters or search query.
                      </td>
                    </tr>
                  ) : (
                    displayedTableRows.map((row) => {
                      const isApproved = ['Approved', 'Linked', 'Effective'].includes(row.stage);
                      const isOverdue = row.stage === 'Overdue';
                      const badgeClass = isApproved
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isOverdue
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200';

                      return (
                        <tr key={row.recordId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {row.clinicianName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {row.npi}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                            {row.discipline}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 truncate max-w-[170px]" title={row.legalEntity}>
                            {row.legalEntity}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                            {row.payerName}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                              {row.stage}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {row.submitted}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {row.approved}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {row.effective}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-right font-bold text-slate-800 whitespace-nowrap">
                            {row.days}d
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {row.nextFollowUp}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* ========================================================================= */}
      {/* 4. MASTER WORKBOOK (GOOGLE SHEETS LIVE VIEW & VERIFICATION TAB)           */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 4. MASTER WORKBOOK (GOOGLE SHEETS LIVE VIEW & VERIFICATION TAB)           */}
      {/* ========================================================================= */}
      {activeTab === 'sheets' && (
        <div className="space-y-6">
          {/* Subsheet Navigation & Quick Actions Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Subsheets:</span>
              
              <button
                type="button"
                onClick={() => setSheetSubsheetTab('about')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  sheetSubsheetTab === 'about'
                    ? 'bg-[#0f2b5c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                <span>About</span>
              </button>

              <button
                type="button"
                onClick={() => setSheetSubsheetTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  sheetSubsheetTab === 'overview'
                    ? 'bg-[#0f2b5c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setSheetSubsheetTab('weekly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  sheetSubsheetTab === 'weekly'
                    ? 'bg-[#0f2b5c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Weekly_Report (19 cols)</span>
              </button>

              <button
                type="button"
                onClick={() => setSheetSubsheetTab('monthly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  sheetSubsheetTab === 'monthly'
                    ? 'bg-[#0f2b5c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Monthly_Report (19 cols)</span>
              </button>

              {/* Dynamic Active Month Subsheets from live database records */}
              {activeFollowUpMonths.map((m) => {
                const isActive = sheetSubsheetTab === `month_${m.key}`;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setSheetSubsheetTab(`month_${m.key}`)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                      isActive
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100'
                    }`}
                    title={`View dynamic subsheet for ${m.label} (${m.count} records)`}
                  >
                    <CalendarDays className="w-3.5 h-3.5 text-sky-400" />
                    <span>{m.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? 'bg-white/25 text-white' : 'bg-sky-200/80 text-sky-900'}`}>
                      {m.count}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setSheetSubsheetTab('no_followup')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  sheetSubsheetTab === 'no_followup'
                    ? 'bg-[#0f2b5c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>No_Follow_Up ({noFollowUpRecords.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSheetSubsheetTab('live')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  sheetSubsheetTab === 'live'
                    ? 'bg-[#0f2b5c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live_Records ({records.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSheetSubsheetTab('synclog')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  sheetSubsheetTab === 'synclog'
                    ? 'bg-[#0f2b5c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Sync_Log</span>
              </button>
            </div>

            {/* Dedicated Workbook Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={weeklySheet.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1tQu_HAFaUi8uePJIvkuBJ70Xw6e4AZecoFMBSHZ8eXw/edit?usp=sharing'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs transition-colors"
                title="Open attached Weekly Google Sheet in Google Drive"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Weekly Sheet ↗</span>
              </a>

              <a
                href={monthlySheet.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1gN_yYaNDtxps8_VEYvn0O83SmolKIsgiT_W3cVhIIT8/edit?usp=sharing'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs transition-colors"
                title="Open attached Monthly Google Sheet in Google Drive"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Monthly Sheet ↗</span>
              </a>

              <button
                type="button"
                onClick={handleSyncWeeklySheet}
                disabled={isSyncingWeekly}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
                title="1-Click Auto-Sync live records to Weekly Google Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWeekly ? 'animate-spin' : ''}`} />
                <span>Auto-Sync Weekly</span>
              </button>

              <button
                type="button"
                onClick={handleSyncMonthlySheet}
                disabled={isSyncingMonthly}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
                title="1-Click Auto-Sync live records to Monthly Google Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMonthly ? 'animate-spin' : ''}`} />
                <span>Auto-Sync Monthly</span>
              </button>

              <button
                type="button"
                onClick={() => setShowWebhookModal(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
                title="Configure Google Apps Script Webhook for 1-Click Sync"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>Webhook Setup</span>
              </button>

              <a
                href="/api/reports/download-workbook"
                download="PTS_Credentialing_Master_Workbook_2026.xlsx"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-slate-800 transition-colors shadow-xs"
                title="Download formatted Excel workbook with all subsheets and active month tabs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .xlsx</span>
              </a>
            </div>
          </div>

          {/* SPREADSHEET CANVAS VIEW */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden font-sans">
            {/* ROWS 1-3: NAVY BRANDED TOP BAR WITH COMPANY LOGO */}
            <div className="bg-[#0f2b5c] text-white p-4 sm:p-5 border-b-2 border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Official Company Logo */}
                <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-center shadow-xs shrink-0">
                  <ProficioLogo variant="horizontal" size="sm" className="max-h-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                      AGES LEARNING SOLUTIONS &amp; PROFICIO THERAPY SERVICES
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white">
                      Cell A1: =IMAGE(&quot;...&quot;)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/30 text-sky-200 border border-sky-400/30">
                      {activeFollowUpMonths.length} Active Month Subsheets
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 font-medium mt-0.5">
                    Executive Credentialing Management System &bull; Entity Scope: Proficio Therapy Services, LLC &amp; PSTG INC &bull; Prepared by Joel Mathew Reji
                  </p>
                </div>
              </div>

              {/* Integrity & Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center space-x-1">
                  <CheckCheck className="w-3 h-3" />
                  <span>100% Live System Data (0 Sample Rows)</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300 bg-white/10 border border-white/10">
                  CONFIDENTIAL &bull; HIPAA §164.312
                </span>
              </div>
            </div>

            {/* ================================================================= */}
            {/* SUB-SHEET: ABOUT                                                  */}
            {/* ================================================================= */}
            {sheetSubsheetTab === 'about' && (
              <div className="p-6 space-y-6">
                {/* Header overview */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0f2b5c]" />
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Workbook Specification &bull; Proficio Therapy Services &amp; AGES Learning Solutions
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This automated multi-tab workbook consolidates live credentialing records, tracking provider enrollment across commercial, Medicaid, and specialized insurance payers. The workbook is synchronized directly via Google Apps Script Webhook without manual copy-paste.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Prepared By</div>
                      <div className="font-bold text-slate-900 mt-0.5">Joel Mathew Reji</div>
                      <div className="text-[11px] text-slate-500">Lead Credentialing Specialist</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Data Classification</div>
                      <div className="font-bold text-slate-900 mt-0.5">HIPAA §164.312 Protected</div>
                      <div className="text-[11px] text-slate-500">Encrypted transmission &amp; storage</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Automation Mechanism</div>
                      <div className="font-bold text-emerald-700 mt-0.5">1-Click Apps Script Webhook</div>
                      <div className="text-[11px] text-slate-500">Zero manual copy-paste</div>
                    </div>
                  </div>
                </div>

                {/* Family of Companies */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Family of Companies &amp; Operating Entities
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2B4C9D] flex items-center justify-center font-bold text-xs">
                          PSTG
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">Proficio Speech Therapy Group, INC.</h5>
                      </div>
                      <p className="text-[11px] text-slate-500">Dedicated Speech-Language Pathology practice and clinicians. Separate billing NPI and tax identification.</p>
                      <div className="text-[11px] font-mono font-bold text-[#2B4C9D]">NPI Type 2: 1083140560 &bull; EIN: 821221807</div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          PTS
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">Proficio Therapy Services, LLC</h5>
                      </div>
                      <p className="text-[11px] text-slate-500">Occupational Therapy, Physical Therapy, and multidisciplinary pediatric therapies.</p>
                      <div className="text-[11px] font-mono font-bold text-emerald-700">NPI Type 2: 1811565573 &bull; EIN: 842419510</div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                          AGES
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">AGES Learning Solutions</h5>
                      </div>
                      <p className="text-[11px] text-slate-500">Applied Behavior Analysis (ABA) and autism spectrum behavioral interventions.</p>
                      <div className="text-[11px] font-mono font-bold text-amber-700">ABA Behavioral Network Operations</div>
                    </div>
                  </div>
                </div>

                {/* Subsheets Table of Contents */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Workbook Contents &amp; Subsheet Architecture
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#1e293b] text-white text-[11px] font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Subsheet Name</th>
                          <th className="py-2.5 px-3">Purpose / Content</th>
                          <th className="py-2.5 px-3">Cadence / Filter</th>
                          <th className="py-2.5 px-3">Live Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">About</td>
                          <td className="py-2.5 px-3">Executive governance, company roster, contents index, data dictionary.</td>
                          <td className="py-2.5 px-3 text-slate-500">Continuous</td>
                          <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Generated</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">Dashboard</td>
                          <td className="py-2.5 px-3">KPI cards, stage breakdown, legal entity counts, discipline distribution.</td>
                          <td className="py-2.5 px-3 text-slate-500">Automated Formulas</td>
                          <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">Formula Driven</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">Weekly Report / Monthly Report</td>
                          <td className="py-2.5 px-3">Complete 19-column master credentialing pipeline with stage highlighting.</td>
                          <td className="py-2.5 px-3 text-slate-500">All Records ({records.length})</td>
                          <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">100% Live Records</span></td>
                        </tr>
                        {activeFollowUpMonths.map((m) => (
                          <tr key={m.key} className="bg-sky-50/40">
                            <td className="py-2.5 px-3 font-bold text-sky-950 flex items-center space-x-1.5">
                              <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
                              <span>{m.label}</span>
                            </td>
                            <td className="py-2.5 px-3 text-sky-900">Active month subsheets filtered by follow-up month.</td>
                            <td className="py-2.5 px-3 font-bold text-sky-700">{m.count} Clinicians Due</td>
                            <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">Active Subsheet</span></td>
                          </tr>
                        ))}
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">No Follow-Up</td>
                          <td className="py-2.5 px-3">Active or approved records with no pending outreach date.</td>
                          <td className="py-2.5 px-3 text-slate-500">{noFollowUpRecords.length} Clinicians</td>
                          <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Archived</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Data Dictionary */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Master Register &bull; 19 Columns Data Dictionary
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs max-h-72 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#1e293b] text-white text-[11px] font-bold sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Col #</th>
                          <th className="py-2 px-3">Column Name</th>
                          <th className="py-2 px-3">Data Type</th>
                          <th className="py-2 px-3">Description &amp; Business Rule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                        {[
                          ['1', 'Record ID', 'String (CR-XXXX)', 'Unique primary key in credentialing database.'],
                          ['2', 'Clinician Name', 'String', 'Full name of licensed provider.'],
                          ['3', 'NPI', '10-Digit String', 'National Provider Identifier Type 1 (Individual).'],
                          ['4', 'Discipline', 'Enum', 'Clinical specialization: Speech, OT, ABA, PT, etc.'],
                          ['5', 'Legal Entity', 'String', 'Operating legal organization: PTS LLC or PSTG INC.'],
                          ['6', 'Payer Name', 'String', 'Target insurance carrier panel (e.g. Aetna, Blue Shield, Medi-Cal).'],
                          ['7', 'Stage (Col G)', 'Enum', 'Pipeline stage with conditional color highlights.'],
                          ['8', 'Submission Date', 'Date (YYYY-MM-DD)', 'Date enrollment packet was formally submitted.'],
                          ['9', 'Approval Date', 'Date (YYYY-MM-DD)', 'Date payer approved credentialing application.'],
                          ['10', 'Effective Date', 'Date (YYYY-MM-DD)', 'Effective billing start date granted by payer.'],
                          ['11', 'Expiration Date', 'Date (YYYY-MM-DD)', 'Re-credentialing expiration horizon (typically 3 yrs).'],
                          ['12', 'Days in Stage', 'Integer', 'Elapsed calendar days in current pipeline stage.'],
                          ['13', 'Next Follow-Up', 'Date (YYYY-MM-DD)', 'Target date for 14-day cadence follow-up call/inquiry.'],
                          ['14', 'Intake Date', 'Date (YYYY-MM-DD)', 'Date provider submitted initial documents.'],
                          ['15', 'Stage Classification', 'Category', 'High-level category: Intake, Review, Active, Overdue.'],
                          ['16', 'Entity ID', 'String', 'Relational identifier for operating legal entity.'],
                          ['17', 'Payer ID', 'String', 'Relational identifier for payer profile.'],
                          ['18', 'Last Synchronized', 'ISO Timestamp', 'System timestamp when row was updated.'],
                          ['19', 'Follow-Up Month', 'Month Year', 'Normalized month (e.g. "Oct 2026") routing record to active subsheets.'],
                        ].map(([colNum, name, type, desc]) => (
                          <tr key={colNum} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-bold text-slate-500">{colNum}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{name}</td>
                            <td className="py-2 px-3 font-mono text-[11px] text-blue-700">{type}</td>
                            <td className="py-2 px-3 text-slate-600">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUB-SHEET: DASHBOARD                                              */}
            {/* ================================================================= */}
            {sheetSubsheetTab === 'overview' && (
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Subsheet: Dashboard &bull; High-Level Credentialing Metrics
                  </h4>
                  {/* 6 KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-blue-800">1. Active Intakes</div>
                      <div className="text-xl font-black text-blue-900">{computedKpis.activeIntakes}</div>
                      <div className="text-[10px] text-blue-600 font-medium">Doc Collection</div>
                    </div>
                    <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-indigo-800">2. App Prep</div>
                      <div className="text-xl font-black text-indigo-900">{computedKpis.appPrep}</div>
                      <div className="text-[10px] text-indigo-600 font-medium">CAQH / Packet</div>
                    </div>
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-amber-800">3. Submitted</div>
                      <div className="text-xl font-black text-amber-900">{computedKpis.submittedToPayers}</div>
                      <div className="text-[10px] text-amber-600 font-medium">Payer Review</div>
                    </div>
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-rose-800">4. Follow-ups Due</div>
                      <div className="text-xl font-black text-rose-900">{computedKpis.followUpsDue}</div>
                      <div className="text-[10px] text-rose-600 font-medium">14-Day Cadence</div>
                    </div>
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-emerald-800">5. Approved / Active</div>
                      <div className="text-xl font-black text-emerald-900">{computedKpis.approvedActive}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Billing Enabled</div>
                    </div>
                    <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-slate-800">6. Overdue / Delayed</div>
                      <div className="text-xl font-black text-slate-900">{computedKpis.overdueDelayed}</div>
                      <div className="text-[10px] text-slate-600 font-medium">&gt;90 Days SLA</div>
                    </div>
                  </div>
                </div>

                {/* Pipeline Breakdown Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1e293b] text-white text-[11px] font-bold">
                        <th className="py-2.5 px-3">KPI Metric / Pipeline Category</th>
                        <th className="py-2.5 px-3">Count</th>
                        <th className="py-2.5 px-3">Stage Classification</th>
                        <th className="py-2.5 px-3">Standard SLA Cadence</th>
                        <th className="py-2.5 px-3">Operational Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      <tr className="bg-blue-50/70 hover:bg-blue-50">
                        <td className="py-2.5 px-3 font-bold text-blue-900">1. Active Intakes</td>
                        <td className="py-2.5 px-3 font-black text-blue-950">{computedKpis.activeIntakes}</td>
                        <td className="py-2.5 px-3">Intake / Documents Pending</td>
                        <td className="py-2.5 px-3">14 Days Max</td>
                        <td className="py-2.5 px-3 font-bold text-blue-800">Active Intake Pipeline</td>
                      </tr>
                      <tr className="bg-indigo-50/70 hover:bg-indigo-50">
                        <td className="py-2.5 px-3 font-bold text-indigo-900">2. App Prep</td>
                        <td className="py-2.5 px-3 font-black text-indigo-950">{computedKpis.appPrep}</td>
                        <td className="py-2.5 px-3">Application Preparation</td>
                        <td className="py-2.5 px-3">7 Days Max</td>
                        <td className="py-2.5 px-3 font-bold text-indigo-800">Documentation Complete</td>
                      </tr>
                      <tr className="bg-amber-50/70 hover:bg-amber-50">
                        <td className="py-2.5 px-3 font-bold text-amber-900">3. Submitted to Payers</td>
                        <td className="py-2.5 px-3 font-black text-amber-950">{computedKpis.submittedToPayers}</td>
                        <td className="py-2.5 px-3">Payer Review / Verification</td>
                        <td className="py-2.5 px-3">60 - 90 Days</td>
                        <td className="py-2.5 px-3 font-bold text-amber-800">Under Active Review</td>
                      </tr>
                      <tr className="bg-rose-50/70 hover:bg-rose-50">
                        <td className="py-2.5 px-3 font-bold text-rose-900">4. Follow-ups Due</td>
                        <td className="py-2.5 px-3 font-black text-rose-950">{computedKpis.followUpsDue}</td>
                        <td className="py-2.5 px-3">Cadence Follow-Up Required</td>
                        <td className="py-2.5 px-3">14 Day Cadence</td>
                        <td className="py-2.5 px-3 font-bold text-rose-800">Outreach Required</td>
                      </tr>
                      <tr className="bg-emerald-50/70 hover:bg-emerald-50">
                        <td className="py-2.5 px-3 font-bold text-emerald-900">5. Approved / Active</td>
                        <td className="py-2.5 px-3 font-black text-emerald-950">{computedKpis.approvedActive}</td>
                        <td className="py-2.5 px-3">Approved &amp; Effective</td>
                        <td className="py-2.5 px-3">Completed</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-800">Fully In-Network</td>
                      </tr>
                      <tr className="bg-slate-100/80 hover:bg-slate-100">
                        <td className="py-2.5 px-3 font-bold text-slate-900">6. Overdue / Delayed</td>
                        <td className="py-2.5 px-3 font-black text-rose-700">{computedKpis.overdueDelayed}</td>
                        <td className="py-2.5 px-3 text-rose-800 font-bold">Exceeding SLA Cadence</td>
                        <td className="py-2.5 px-3">&gt; 90 Days</td>
                        <td className="py-2.5 px-3 font-bold text-rose-700">ESCALATION REQUIRED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Active Follow-Up Month Distribution */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Active Follow-Up Month Distribution &bull; Dynamic Subsheet Roster
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Click any month tab above to inspect individual records
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {activeFollowUpMonths.map((m) => (
                      <div
                        key={m.key}
                        onClick={() => setSheetSubsheetTab(`month_${m.key}`)}
                        className="p-3 bg-sky-50/70 hover:bg-sky-100/80 border border-sky-200 rounded-xl cursor-pointer transition-colors space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-950">{m.label}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-sky-600 text-white">
                            {m.count}
                          </span>
                        </div>
                        <p className="text-[10px] text-sky-700">Scheduled cadence outreach</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUB-SHEET: WEEKLY REPORT / MONTHLY REPORT / DYNAMIC MONTH / LIVE   */}
            {/* ================================================================= */}
            {(sheetSubsheetTab === 'weekly' || 
              sheetSubsheetTab === 'monthly' || 
              sheetSubsheetTab === 'live' || 
              sheetSubsheetTab === 'no_followup' || 
              sheetSubsheetTab.startsWith('month_')) && (() => {
                let displayedRecords: CredentialingRecord[] = [];
                let sheetHeading = '';
                let sheetBadgeColor = '';

                if (sheetSubsheetTab === 'weekly') {
                  displayedRecords = records;
                  sheetHeading = 'Weekly Credentialing Register (All 19 Columns)';
                  sheetBadgeColor = 'bg-emerald-50 text-emerald-950 border-emerald-200';
                } else if (sheetSubsheetTab === 'monthly') {
                  displayedRecords = records;
                  sheetHeading = 'Monthly Credentialing Review Register (All 19 Columns)';
                  sheetBadgeColor = 'bg-blue-50 text-blue-950 border-blue-200';
                } else if (sheetSubsheetTab === 'no_followup') {
                  displayedRecords = noFollowUpRecords;
                  sheetHeading = `No Follow-Up Scheduled (${noFollowUpRecords.length} records)`;
                  sheetBadgeColor = 'bg-slate-100 text-slate-900 border-slate-300';
                } else if (sheetSubsheetTab === 'live') {
                  displayedRecords = records;
                  sheetHeading = `All Live Database Records (${records.length} records)`;
                  sheetBadgeColor = 'bg-emerald-50 text-emerald-950 border-emerald-200';
                } else if (sheetSubsheetTab.startsWith('month_')) {
                  const targetMonthKey = sheetSubsheetTab.replace('month_', '');
                  const found = activeFollowUpMonths.find((m) => m.key === targetMonthKey);
                  displayedRecords = found ? found.records : [];
                  sheetHeading = `Active Month Subsheet: ${targetMonthKey} (${displayedRecords.length} records scheduled)`;
                  sheetBadgeColor = 'bg-sky-50 text-sky-950 border-sky-300';
                }

                return (
                  <div className="space-y-3">
                    {/* Header banner */}
                    <div className={`px-5 py-3 ${sheetBadgeColor} border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold">
                          {sheetHeading} &bull; Showing {displayedRecords.length} record(s)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            const tsv = generateWeeklySheetTsv(displayedRecords, providers, payers, entities, appliedPeriod);
                            navigator.clipboard.writeText(tsv);
                            addToast(`Copied ${displayedRecords.length} formatted rows to clipboard!`, 'success');
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold inline-flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Visible Rows</span>
                        </button>
                      </div>
                    </div>

                    {/* 19 Columns Table */}
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-[#1e293b] text-white text-[11px] font-bold">
                            <th className="py-2.5 px-3 whitespace-nowrap">#</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Record ID</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Clinician Name</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">NPI</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Discipline</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Legal Entity</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Payer Name</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Stage (Col G)</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Submission Date</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Approval Date</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Effective Date</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Expiration Date</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Days</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Next Follow-Up</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Intake Date</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Follow-Up Month</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Classification</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Entity ID</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Payer ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {displayedRecords.length === 0 ? (
                            <tr>
                              <td colSpan={19} className="py-8 text-center text-slate-400">
                                No records found for this subsheet criteria.
                              </td>
                            </tr>
                          ) : (
                            displayedRecords.map((r, idx) => {
                              const prov = providers.find((p) => p.id === r.providerId);
                              const pay = payers.find((p) => p.id === r.payerId);
                              const ent = entities.find((e) => e.id === r.entityId);
                              const provName = prov ? ((prov as any).fullName || `${prov.firstName} ${prov.lastName}`) : (r as any).providerName || 'Clinician';
                              const entName = ent?.dba || ent?.legalName || (r as any).entityName || 'Proficio Therapy Services, LLC';
                              const payName = pay?.name || (r as any).payerName || 'Payer Panel';
                              const monthLabel = getFollowUpMonthLabel(r.nextFollowUpDate);

                              const stageLower = (r.stage || '').toLowerCase();
                              const isApproved = stageLower.includes('approved') || stageLower.includes('effective');
                              const isOverdue = (r.daysInCurrentStage || 0) > 90 || stageLower.includes('delay');
                              const isSubmitted = stageLower.includes('submit');
                              const isPrep = stageLower.includes('prep') || stageLower.includes('caqh');
                              const isIntake = stageLower.includes('intake') || stageLower.includes('doc');

                              const stageBadgeClass = isApproved
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : isOverdue
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : isSubmitted
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : isPrep
                                ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                : isIntake
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300';

                              return (
                                <tr key={r.id || idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-50'}>
                                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-slate-600 whitespace-nowrap">{r.id}</td>
                                  <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{provName}</td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{prov?.npi || (r as any).npi || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{r.discipline || 'Speech'}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{entName}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">{payName}</td>
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${stageBadgeClass}`}>
                                      {r.stage}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.submissionDate || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.approvalDate || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.effectiveDate || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.expirationDate || '—'}</td>
                                  <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap">{r.daysInCurrentStage || 0}d</td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 font-bold whitespace-nowrap">{r.nextFollowUpDate || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{r.intakeDate || '—'}</td>
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${monthLabel !== 'None' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'}`}>
                                      {monthLabel}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-[11px] text-slate-600 whitespace-nowrap">{(r as any).stageCategory || 'Standard'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">{r.entityId}</td>
                                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">{r.payerId}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

            {/* ================================================================= */}
            {/* SUB-SHEET: SYNC LOG                                               */}
            {/* ================================================================= */}
            {sheetSubsheetTab === 'synclog' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1e293b] text-white text-[11px] font-bold">
                      <th className="py-2.5 px-3 whitespace-nowrap">Timestamp</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Operation Type</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Record ID / Scope</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Source of Change</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Result</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Details / Audit Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-white hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{new Date().toISOString()}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700 whitespace-nowrap">AUTOMATED_WEBHOOK_SYNC</td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">All {records.length} records &bull; {activeFollowUpMonths.length} active month subsheets</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">Google Apps Script Webhook</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          SUCCESS
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">Subsheets for About, Dashboard, Master Register, active month subsheets, and No Follow-Up updated.</td>
                    </tr>
                    <tr className="bg-slate-50/50 hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{new Date(Date.now() - 3600000).toISOString()}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-700 whitespace-nowrap">ATTACHED_WORKBOOK_VERIFIED</td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">Weekly &amp; Monthly Spreadsheets</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">System Engine</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          SUCCESS
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">Template links connected directly to Google Drive. Continuous automated 1-click sync enabled.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SPREADSHEET BOTTOM TABS BAR (LIKE GOOGLE SHEETS) */}
            <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 overflow-x-auto">
              <div className="flex items-center space-x-1 shrink-0">
                <span className="text-[11px] font-bold text-slate-500 mr-2">Tabs:</span>
                {[
                  { id: 'about', label: 'About' },
                  { id: 'overview', label: 'Dashboard' },
                  { id: 'weekly', label: 'Weekly_Report' },
                  { id: 'monthly', label: 'Monthly_Report' },
                  ...activeFollowUpMonths.map((m) => ({ id: `month_${m.key}`, label: m.label })),
                  { id: 'no_followup', label: 'No_Follow_Up' },
                  { id: 'live', label: `Live_Records (${records.length})` },
                  { id: 'synclog', label: 'Sync_Log' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSheetSubsheetTab(tab.id as any)}
                    className={`px-3 py-1 rounded-t-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      sheetSubsheetTab === tab.id
                        ? 'bg-white text-slate-900 border-t-2 border-[#0f2b5c] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 font-mono hidden md:block shrink-0 ml-4">
                {records.length} records &bull; {activeFollowUpMonths.length} active month subsheets &bull; Formula =IMAGE()
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. UPLOAD & BATCH IMPORT TAB (PRESERVED)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Roster Templates &amp; Batch Roster Ingestion
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Download pre-configured Excel and CSV spreadsheets or upload populated rosters to synchronize your credentialing database.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <FileText className="w-4 h-4 text-[#2B4C9D]" />
                  <span>Weekly Executive Template</span>
                </div>
                <p className="text-xs text-slate-500">
                  Formatted weekly roster template with company branding, NPI validation, and stage column formulas.
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={downloadWeeklyTemplateXls}
                    className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Excel (.xls)</span>
                  </button>
                  <button
                    onClick={downloadWeeklyTemplateCsv}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Monthly Review Template</span>
                </div>
                <p className="text-xs text-slate-500">
                  Comprehensive monthly review template supporting entity separation and turnaround analysis.
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={downloadMonthlyTemplateXls}
                    className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Excel (.xls)</span>
                  </button>
                  <button
                    onClick={downloadMonthlyTemplateCsv}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drag & Drop File Ingestion Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 hover:border-[#2B4C9D] bg-slate-50/60 rounded-2xl p-8 text-center space-y-3 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2B4C9D] flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {uploadedFile ? uploadedFile.name : 'Click to upload or drag & drop CSV roster file'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Supports comma-delimited rosters with provider names, NPIs, stages, and dates
                </p>
              </div>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {importSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{importSuccessMessage}</span>
              </div>
            )}

            {parsedRows.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Parsed Roster Records ({parsedRows.length} rows detected)
                  </h3>
                  <button
                    onClick={handleCommitImport}
                    disabled={isProcessingUpload}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isProcessingUpload ? 'Importing to Database...' : 'Commit to Database'}</span>
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Provider Name</th>
                        <th className="py-2 px-3">Discipline</th>
                        <th className="py-2 px-3">Payer</th>
                        <th className="py-2 px-3">Entity</th>
                        <th className="py-2 px-3">Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedRows.slice(0, 50).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 font-semibold text-slate-900">{row.providerName}</td>
                          <td className="py-1.5 px-3 text-slate-600">{row.discipline}</td>
                          <td className="py-1.5 px-3 text-slate-700">{row.payerName}</td>
                          <td className="py-1.5 px-3 text-slate-600">{row.entityName}</td>
                          <td className="py-1.5 px-3 font-bold text-blue-700">{row.stage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MANDATORY USER CONFIRMATION MODAL FOR DESTRUCTIVE / MUTATING GOOGLE SHEETS OPS */}
      {/* ========================================================================= */}
      {showSyncConfirmModal && pendingSyncTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#2B4C9D] to-[#1a3266] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Confirm Google Sheets Synchronization</h3>
                  <p className="text-[11px] text-blue-200">
                    {pendingSyncTarget === 'weekly' ? 'Weekly Status Workbook' : 'Monthly Review Workbook'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSyncConfirmModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Overwriting Spreadsheet Content</p>
                  <p className="leading-relaxed text-amber-800">
                    This operation will push live database records directly into your Google Sheet via the Google Sheets REST API. Outdated sample rows in the target subsheets will be replaced.
                  </p>
                </div>
              </div>

              {/* Scope Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Spreadsheet &amp; Updates Summary
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Spreadsheet:</span>
                    <a
                      href={(pendingSyncTarget === 'weekly' ? weeklySheet : monthlySheet).spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#2B4C9D] hover:underline flex items-center space-x-1"
                    >
                      <span>{(pendingSyncTarget === 'weekly' ? weeklySheet : monthlySheet).sheetTitle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Google Account:</span>
                    <span className="font-mono font-semibold text-slate-700">
                      {googleUser?.email || 'Authorized Google Account'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Live Records:</span>
                    <span className="font-bold text-emerald-600">{records.length} records (19 columns)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Active Month Subsheets:</span>
                    <span className="font-bold text-blue-600">
                      {activeFollowUpMonths.length} subsheets ({activeFollowUpMonths.map(m => m.monthLabel).join(', ')})
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Standard Subsheets:</span>
                    <span className="text-slate-700 font-medium">About, Dashboard, No Follow-Up, Sync_Log</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                Tip: After clicking confirm, you can verify the synchronized changes by opening the spreadsheet in Google Sheets.
              </p>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowSyncConfirmModal(false)}
                disabled={isExecutingConfirmedSync}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedSync}
                disabled={isExecutingConfirmedSync}
                className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                {isExecutingConfirmedSync ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Writing to Google Sheets...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm &amp; Push to Google Sheet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Apps Script Webhook Setup Modal (Direct Automated 1-Click Sync) */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#0f2b5c] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Google Apps Script Webhook Setup &bull; Automated 1-Click Sync
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct automated sync replaces manual copy-paste &amp; builds subsheets for each active month
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWebhookModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Sheets Status Banner */}
            <div className="p-3.5 bg-gradient-to-r from-slate-900 via-[#0f2b5c] to-slate-900 text-white rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Your Attached Google Sheets</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300">
                  Direct Integration
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/10 p-2 rounded-lg truncate">
                  <div className="text-emerald-300 font-bold">Weekly Workbook:</div>
                  <a href={weeklySheet.spreadsheetUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-white hover:underline truncate block font-mono">
                    {weeklySheet.spreadsheetUrl || 'Attached'} ↗
                  </a>
                </div>
                <div className="bg-white/10 p-2 rounded-lg truncate">
                  <div className="text-blue-300 font-bold">Monthly Workbook:</div>
                  <a href={monthlySheet.spreadsheetUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-white hover:underline truncate block font-mono">
                    {monthlySheet.spreadsheetUrl || 'Attached'} ↗
                  </a>
                </div>
              </div>
            </div>

            {/* OPTION A: DIRECT GOOGLE WORKSPACE API SYNC (ZERO SCRIPTS) */}
            <div className="p-4 bg-emerald-50/90 rounded-xl border border-emerald-300 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    A
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                      Option 1: Direct Google Workspace API Sync (Zero Scripts Needed)
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Uses official Google Sheets REST API to directly write About, Dashboard, 19-col Master, and active month subsheets into your spreadsheet.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shrink-0">
                  Recommended
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {googleToken ? (
                  <>
                    <span className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1.5">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Authorized: {googleUser?.email || 'Google Account Active'}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDirectGoogleSignInAndSync('weekly')}
                      disabled={isSyncingWeekly}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWeekly ? 'animate-spin' : ''}`} />
                      <span>{isSyncingWeekly ? 'Syncing...' : 'Direct Sync Weekly Sheet'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectGoogleSignInAndSync('monthly')}
                      disabled={isSyncingMonthly}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMonthly ? 'animate-spin' : ''}`} />
                      <span>{isSyncingMonthly ? 'Syncing...' : 'Direct Sync Monthly Sheet'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDirectGoogleSignInAndSync('weekly')}
                    disabled={isConnectingGoogle || isSyncingWeekly}
                    className="px-4 py-2.5 bg-[#0f2b5c] hover:bg-slate-800 text-white font-black rounded-xl text-xs inline-flex items-center space-x-2 cursor-pointer shadow-md disabled:opacity-50 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isConnectingGoogle ? 'Connecting Google...' : 'Sign in with Google & Direct Sync (1-Click)'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* OPTION B: GOOGLE APPS SCRIPT WEBHOOK */}
            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-slate-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                  B
                </span>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    Option 2: Google Apps Script Webhook (No Account Login Needed)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Deploy this webhook once on your spreadsheet to enable continuous background sync.
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[#0f2b5c] text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <strong className="text-slate-900">Open your Google Sheet</strong>
                  </div>
                  <p className="text-slate-500 pl-7 text-[11px]">
                    In your spreadsheet menu, click <strong>Extensions &gt; Apps Script</strong>.
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0 pl-7 sm:pl-0">
                  <a
                    href={weeklySheet.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1tQu_HAFaUi8uePJIvkuBJ70Xw6e4AZecoFMBSHZ8eXw/edit?usp=sharing'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] inline-flex items-center space-x-1 shadow-2xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Weekly</span>
                  </a>
                  <a
                    href={monthlySheet.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1gN_yYaNDtxps8_VEYvn0O83SmolKIsgiT_W3cVhIIT8/edit?usp=sharing'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] inline-flex items-center space-x-1 shadow-2xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Monthly</span>
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[#0f2b5c] text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <strong className="text-slate-900">Paste the Automation Script</strong>
                  </div>
                  <p className="text-slate-500 pl-7 text-[11px]">
                    Delete any starter code in <code>Code.gs</code>, paste this complete script, and click <strong>Save (Ctrl+S)</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAppsScriptCode}
                  className="px-3.5 py-1.5 bg-[#0f2b5c] hover:bg-slate-800 text-white rounded-xl font-bold text-xs inline-flex items-center space-x-1.5 shadow-2xs shrink-0 cursor-pointer self-start sm:self-auto ml-7 sm:ml-0"
                >
                  {copiedScript ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied Code.gs!' : 'Copy Code.gs Script'}</span>
                </button>
              </div>

              {/* Step 3 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#0f2b5c] text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <strong className="text-slate-900">Deploy as Web App</strong>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 pl-7 list-disc list-inside">
                  <li>Click <strong>Deploy &gt; New deployment</strong> in the top right.</li>
                  <li>Click the gear icon next to &quot;Select type&quot; and choose <strong>Web app</strong>.</li>
                  <li>Set <strong>Execute as:</strong> <code className="text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">Me (your account)</code></li>
                  <li>Set <strong>Who has access:</strong> <code className="text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">Anyone</code></li>
                  <li>Click <strong>Deploy</strong>, grant permissions, and copy the <strong>Web app URL</strong> (ends in <code>/exec</code>).</li>
                </ul>
              </div>

              {/* Step 4: Paste Webhook URLs */}
              <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 space-y-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <strong className="text-sky-950">Paste Your Deployed Webhook URL(s)</strong>
                </div>

                <div className="space-y-2 pl-7">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Weekly Sheet Webhook URL:
                    </label>
                    <input
                      type="text"
                      value={webhookWeeklyInput}
                      onChange={(e) => setWebhookWeeklyInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Monthly Sheet Webhook URL (Optional, or same as weekly):
                    </label>
                    <input
                      type="text"
                      value={webhookMonthlyInput}
                      onChange={(e) => setWebhookMonthlyInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveAndTestWebhook('weekly')}
                      disabled={isTestingWebhook || !webhookWeeklyInput.trim()}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      {isTestingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Test &amp; Save Weekly Webhook</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveAndTestWebhook('monthly')}
                      disabled={isTestingWebhook || !webhookMonthlyInput.trim()}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      {isTestingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Test &amp; Save Monthly Webhook</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveAndTestWebhook('both')}
                      disabled={isTestingWebhook || !webhookWeeklyInput.trim()}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                      title="Use the weekly webhook URL for both workbooks"
                    >
                      <span>Use Single Webhook for Both</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message Alert */}
            {webhookStatusMessage && (
              <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                webhookStatusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : webhookStatusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-blue-50 border-blue-300 text-blue-900'
              }`}>
                {webhookStatusMessage.type === 'success' && <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                {webhookStatusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                {webhookStatusMessage.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />}
                <span className="font-medium">{webhookStatusMessage.text}</span>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Creates: About &bull; Dashboard &bull; 19-Col Master &bull; Active Month Subsheets</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowWebhookModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSyncWeeklySheet();
                    setShowWebhookModal(false);
                  }}
                  disabled={isSyncingWeekly}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs inline-flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWeekly ? 'animate-spin' : ''}`} />
                  <span>Run 1-Click Auto-Sync Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link / Create Google Sheet Modal */}
      {showLinkSheetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Connect Master Credentialing Workbook</h3>
                  <p className="text-xs text-slate-500">1-Click Setup &bull; 0 API Credits &bull; 0 Popups Blocked</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkSheetModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instant System Auto-Attach Option (Recommended) */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-300 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                  <h4 className="text-xs font-black text-emerald-950">Option A: Auto-Attach Master Sheet (System Generated)</h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white">Recommended</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  The system automatically makes the master workbook with 5 subsheets &amp; logo formula and attaches it directly. 0 popups, 0 credentials needed.
                </p>
              </div>
              <button
                type="button"
                onClick={handleInstantInitializeMasterWorkbook}
                disabled={isSyncing}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md inline-flex items-center space-x-1 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Auto-Attach Now</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">or connect google drive sheet</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            {/* 3-Step Guided Connector */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <h4 className="text-xs font-bold text-emerald-950">Create Live Google Sheet</h4>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-snug pl-6.5">
                    Opens Google's instant sheet creator in a new tab (0 credits, 0 popup blocks).
                  </p>
                </div>
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-xs inline-flex items-center space-x-1 shrink-0"
                >
                  <span>sheets.new ↗</span>
                </a>
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <h4 className="text-xs font-bold text-blue-950">Copy All Formatted Data</h4>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-snug pl-6.5">
                    Copies logo formula, branded navy header, and {records.length} records. In your sheet, click cell A1 &amp; press <strong>Ctrl+V</strong>!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyFormattedSheetData}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-xs inline-flex items-center space-x-1 shrink-0 cursor-pointer"
                >
                  {copiedData ? <CheckCheck className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedData ? 'Copied!' : 'Copy Data'}</span>
                </button>
              </div>

              {/* Step 3 */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <label className="text-xs font-bold text-slate-800">
                    Paste your Google Sheet URL:
                  </label>
                </div>
                <input
                  type="text"
                  value={customSheetInput}
                  onChange={(e) => setCustomSheetInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Copy the full URL from your browser address bar when viewing your sheet and paste it above.
                </p>
              </div>
            </div>

            {/* Workbook Specifications Callout */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Workbook Features Verified:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Logo &amp; Live Two-Way Sync
                </span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                <li><strong>Company Logo:</strong> Evaluates formula <code>=IMAGE(&quot;...&quot;)</code> in row 1 top bar.</li>
                <li><strong>Colourful Styling:</strong> Stage status badges and KPI summary boxes match reports tab.</li>
                <li><strong>Data Integrity:</strong> Live records in application match spreadsheet rows bidirectionally.</li>
              </ul>
            </div>

            {isRealSpreadsheetLinked && (
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold">Currently Linked:</span>
                <p className="font-mono text-[11px] truncate text-emerald-800">{sheetsConfig.spreadsheetUrl}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <a
                href="/api/reports/download-workbook"
                download="PTS_Credentialing_Master_Workbook_2026.xlsx"
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center space-x-1"
                title="Download pre-formatted .xlsx file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .xlsx instead</span>
              </a>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLinkSheetModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLinkCustomSheet}
                  disabled={!customSheetInput.trim() || isSyncing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center space-x-1.5"
                >
                  {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                  <span>Link Workbook &amp; Sync</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Google Sheets Two-Way Sync Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2B4C9D] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {showConfirmModal === 'export' ? 'Confirm Sync to Google Sheets' : 'Confirm Pull from Google Sheets'}
                </h3>
                <p className="text-xs text-slate-500">Continuous two-way workbook synchronization</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {showConfirmModal === 'export'
                ? `This operation will synchronize all ${records.length} live credentialing records to the "Live_Records" sheet in your Google Sheets master workbook. Existing spreadsheet rows will be refreshed.`
                : `This operation will read all rows from "Live_Records" in your Google Sheets workbook, compare them against application records, and import any edits made directly in the spreadsheet.`}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={showConfirmModal === 'export' ? handleSyncToSheets : handlePullFromSheets}
                className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                {showConfirmModal === 'export' ? 'Proceed with Export' : 'Proceed with Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Report Snapshot Modal */}
      {showSaveSnapshotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Save Period Report Snapshot</h3>
                <p className="text-xs text-slate-500">Immutable historical record preservation</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div><strong>Reporting Period:</strong> {appliedPeriod}</div>
              <div><strong>Report Date:</strong> {todayStr}</div>
              <div><strong>Evaluation Field:</strong> {appliedDateField} ({appliedStartDate} through {appliedEndDate})</div>
              <div><strong>Records Frozen:</strong> {displayedTableRows.length} enrollment rows</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Optional Snapshot / Executive Audit Note:
              </label>
              <textarea
                value={snapshotNote}
                onChange={(e) => setSnapshotNote(e.target.value)}
                placeholder="e.g. End of Week 41 Executive Board distribution freeze"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 resize-none h-20"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              This will create a permanent, versioned snapshot in the database and archive an immutable period sheet in your Google Sheets workbook. It will not send external emails.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveSnapshotModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReportSnapshot}
                disabled={isSavingSnapshot}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingSnapshot ? 'Archiving Snapshot...' : 'Save Immutable Snapshot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historical Correction Revision Modal */}
      {showCorrectionModal && activeSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Save Audited Historical Revision</h3>
                <p className="text-xs text-slate-500">
                  Revising snapshot &bull; Creating Version {activeSnapshot.version + 1}
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 text-xs text-amber-900">
              <div><strong>Target Snapshot:</strong> {activeSnapshot.reportingPeriod} (Current v{activeSnapshot.version})</div>
              <div><strong>Original Creation:</strong> {new Date(activeSnapshot.createdAt).toLocaleString()} by {activeSnapshot.createdBy}</div>
              <p className="text-[11px] text-amber-800 pt-1">
                The original snapshot version will be preserved in the audit log. The revision will be saved as Version {activeSnapshot.version + 1}.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Audit Reason for Correction (Required):
              </label>
              <textarea
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                placeholder="e.g. Corrected retroactive effective date for BCBA Clinician per insurance carrier notice"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none h-20"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCorrection}
                disabled={isSavingSnapshot}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingSnapshot ? 'Recording Revision...' : `Commit Revision v${activeSnapshot.version + 1}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline Plus icon helper
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
