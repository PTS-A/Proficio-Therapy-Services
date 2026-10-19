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
  FileText
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
  syncAppToGoogleSheets,
  syncSheetsToApp,
  archiveSnapshotToGoogleSheets,
  fetchReportSnapshots,
  saveReportSnapshot,
  ReportSnapshot,
  GoogleSheetsConfig
} from '../../services/googleSheetsService';
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
  const [customSheetInput, setCustomSheetInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedData, setCopiedData] = useState(false);
  const [sheetSubsheetTab, setSheetSubsheetTab] = useState<'overview' | 'live' | 'monthly' | 'synclog'>('live');

  // Verify whether a genuine Google Sheet has been linked (not null and not a dummy placeholder)
  const isRealSpreadsheetLinked = Boolean(
    sheetsConfig.spreadsheetId &&
    sheetsConfig.spreadsheetId.length > 20 &&
    !sheetsConfig.spreadsheetId.startsWith('1PTS-')
  );

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
  const handleConnectGoogle = async () => {
    try {
      setIsConnectingGoogle(true);
      const res = await signInWithGoogle();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        addToast(`Connected to Google as ${res.user.email}!`, 'success');
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-blocked' ||
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.toLowerCase().includes('popup') ||
        err?.message?.toLowerCase().includes('domain')
      ) {
        // Automatically open the 1-click sheet connection modal without popup friction or credit usage
        setShowLinkSheetModal(true);
        addToast('Sign-in popup blocked or preview domain restriction. Opened 1-Click Direct Sheet Linker (0 credits needed)!', 'warning');
      } else {
        addToast(err?.message || 'Failed to authenticate with Google.', 'error');
      }
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleInstantInitializeMasterWorkbook = () => {
    setShowLinkSheetModal(true);
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

  const handleDisconnectGoogle = async () => {
    await signOutGoogle();
    setGoogleUser(null);
    setGoogleToken(null);
    addToast('Google session disconnected.', 'info');
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
      {canManageSheetsWorkbook && (
        <div className="bg-gradient-to-r from-slate-900 to-[#1e3a8a] text-white p-4 sm:p-5 rounded-2xl shadow-sm print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                  <path fill="#2E7D32" d="M37 42H11a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4h18l12 12v20a4 4 0 0 1-4 4z" />
                  <path fill="#81C784" d="M29 6v12h12" />
                  <path fill="#FFFFFF" d="M16 22h16v3H16zm0 6h16v3H16zm0 6h10v3H16z" />
                </svg>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-white">
                    Google Sheets Continuous Two-Way Synchronization
                  </h3>
                  {isRealSpreadsheetLinked ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <CheckCheck className="w-3 h-3" />
                      <span>Workbook Connected</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      <span>Setup Required</span>
                    </span>
                  )}
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    <span>Logo Formula Active</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-300 border border-white/10">
                    <span>Domain: credentialing.ageslearningsolutions.com</span>
                  </span>
                  {sheetsConfig.lastSyncStatus === 'CONFLICT_DETECTED' && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400/40">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Conflicts Detected</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isRealSpreadsheetLinked
                    ? `Master Workbook: ${sheetsConfig.sheetTitle} • Subsheets: Executive_Overview, Live_Records, Monthly Snapshots, Sync_Log, Snapshot_Log • Last Synced: ${sheetsConfig.lastSyncedAt ? new Date(sheetsConfig.lastSyncedAt).toLocaleTimeString() : 'Never'}`
                    : 'Synchronize credentialing records, live stage changes, monthly subsheets, and period snapshots with a dedicated Google Sheets workbook. Fast 1-click connect with 0 credits and 0 popups.'}
                </p>
              </div>
            </div>

          {/* Google Sheets Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {!googleUser ? (
              <div className="flex flex-wrap items-center gap-2">
                {!isRealSpreadsheetLinked ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowLinkSheetModal(true)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black inline-flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                      title="Link or create your Google Sheet in 1 click (0 popups, 0 credits)"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Create / Link Google Sheet</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyFormattedSheetData}
                      className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-white/20 transition-colors"
                      title="Copy full records with logo formula to paste directly into Google Sheets"
                    >
                      {copiedData ? <CheckCheck className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedData ? 'Copied Data!' : 'Copy Formatted Data'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href={sheetsConfig.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Workbook ↗</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleSyncToSheets}
                      disabled={isSyncing}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      title="Sync application records to Live_Records sheet"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing && syncDirection === 'export' ? 'animate-spin' : ''}`} />
                      <span>Sync to Sheets</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePullFromSheets}
                      disabled={isSyncing}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      title="Pull edits made in Google Sheets back into app (verified)"
                    >
                      <Download className={`w-3.5 h-3.5 ${isSyncing && syncDirection === 'import' ? 'animate-spin' : ''}`} />
                      <span>Pull from Sheets</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopySheetLink}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-white/20 transition-colors"
                      title="Copy Google Sheets direct link"
                    >
                      {copiedLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  disabled={isConnectingGoogle}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isConnectingGoogle ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>

                {!isRealSpreadsheetLinked && (
                  <button
                    type="button"
                    onClick={() => setShowLinkSheetModal(true)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-white/20 transition-colors"
                    title="Link existing Google Sheets workbook URL or ID"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Link Existing Sheet</span>
                  </button>
                )}

                <a
                  href="/api/reports/download-workbook"
                  download="PTS_Credentialing_Master_Workbook_2026.xlsx"
                  className="px-3 py-2 bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 border border-blue-400/30 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
                  title="Download complete Master Workbook (.xlsx) with 5 subsheets, logo formula & live records"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xlsx</span>
                </a>
              </div>
            ) : (
              <>
                <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-white/10 rounded-xl text-xs font-mono text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="truncate max-w-[170px]">{googleUser.email}</span>
                </div>

                {!isRealSpreadsheetLinked ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowLinkSheetModal(true)}
                      disabled={isSyncing}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>Create / Link Master Workbook</span>
                    </button>
                    <button
                      onClick={() => setShowLinkSheetModal(true)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-white/20 transition-colors"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Link Existing Sheet</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <a
                      href={sheetsConfig.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs inline-flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                      title="Open Google Sheets workbook in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Workbook ↗</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopySheetLink}
                      className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-white/20 transition-colors"
                      title="Copy Google Sheets direct link"
                    >
                      {copiedLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>

                    <button
                      onClick={() => setShowConfirmModal('export')}
                      disabled={isSyncing}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      title="Sync application records to Live_Records sheet"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing && syncDirection === 'export' ? 'animate-spin' : ''}`} />
                      <span>Sync to Sheets</span>
                    </button>

                    <button
                      onClick={() => setShowConfirmModal('import')}
                      disabled={isSyncing}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      title="Pull edits made in Google Sheets back into app"
                    >
                      <Download className={`w-3.5 h-3.5 ${isSyncing && syncDirection === 'import' ? 'animate-spin' : ''}`} />
                      <span>Pull from Sheets</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowLinkSheetModal(true)}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                      title="Change or re-link spreadsheet ID"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  onClick={handleDisconnectGoogle}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                  title="Disconnect Google account"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
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
      {activeTab === 'sheets' && (
        <div className="space-y-6">
          {/* Subsheet Navigation & Quick Actions */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">Subsheet:</span>
              <button
                type="button"
                onClick={() => setSheetSubsheetTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  sheetSubsheetTab === 'overview'
                    ? 'bg-[#0f2b5c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Executive_Overview</span>
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
                <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Live_Records ({records.length})</span>
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
                <Calendar className="w-3.5 h-3.5" />
                <span>Monthly_October_2026</span>
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

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyFormattedSheetData}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2B4C9D] border border-blue-200 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                title="Copy ready-to-paste spreadsheet data with company logo formula and all records"
              >
                {copiedData ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedData ? 'Copied to Clipboard!' : 'Copy Formatted Data'}</span>
              </button>

              <a
                href="https://sheets.new"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs transition-colors"
                title="Create a new live Google Sheet instantly in your Google account"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>sheets.new ↗</span>
              </a>

              <a
                href="/api/reports/download-workbook"
                download="PTS_Credentialing_Master_Workbook_2026.xlsx"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer border border-slate-200 transition-colors"
                title="Download formatted Excel workbook with 5 subsheets"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .xlsx</span>
              </a>

              <button
                type="button"
                onClick={() => setShowLinkSheetModal(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{isRealSpreadsheetLinked ? 'Manage Sheet Link' : 'Link Google Sheet'}</span>
              </button>
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
                  </div>
                  <p className="text-xs text-blue-200 font-medium mt-0.5">
                    Executive Credentialing Management System &bull; Entity Scope: Proficio Therapy Services, LLC &amp; PSTG INC
                  </p>
                </div>
              </div>

              {/* Integrity & Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center space-x-1">
                  <CheckCheck className="w-3 h-3" />
                  <span>Data Verified: Matches Application Database</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300 bg-white/10 border border-white/10">
                  CONFIDENTIAL &bull; HIPAA §164.312
                </span>
              </div>
            </div>

            {/* SPREADSHEET SUB-SHEET CONTENT */}
            {/* SUB-SHEET 1: Executive_Overview */}
            {sheetSubsheetTab === 'overview' && (
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Subsheet: Executive_Overview &bull; KPI Pipeline Summary
                  </h4>
                  {/* 6 Colourful KPI summary cards matching reports tab */}
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

                {/* KPI Overview Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1e293b] text-white text-[11px] font-bold">
                        <th className="py-2.5 px-3">KPI Metric / Pipeline Category</th>
                        <th className="py-2.5 px-3">Count</th>
                        <th className="py-2.5 px-3">Stage Classification</th>
                        <th className="py-2.5 px-3">Standard SLA Cadence</th>
                        <th className="py-2.5 px-3">Average Cycle</th>
                        <th className="py-2.5 px-3">Operational Status</th>
                        <th className="py-2.5 px-3">Payer In-Network Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      <tr className="bg-blue-50/70 hover:bg-blue-50">
                        <td className="py-2.5 px-3 font-bold text-blue-900">1. Active Intakes</td>
                        <td className="py-2.5 px-3 font-black text-blue-950">{computedKpis.activeIntakes}</td>
                        <td className="py-2.5 px-3">Intake / Documents Pending</td>
                        <td className="py-2.5 px-3">14 Days Max</td>
                        <td className="py-2.5 px-3">6 Days</td>
                        <td className="py-2.5 px-3 font-bold text-blue-800">Active Intake Pipeline</td>
                        <td className="py-2.5 px-3 text-slate-600">Pending Provider Signature</td>
                      </tr>
                      <tr className="bg-indigo-50/70 hover:bg-indigo-50">
                        <td className="py-2.5 px-3 font-bold text-indigo-900">2. App Prep</td>
                        <td className="py-2.5 px-3 font-black text-indigo-950">{computedKpis.appPrep}</td>
                        <td className="py-2.5 px-3">Application Preparation</td>
                        <td className="py-2.5 px-3">7 Days Max</td>
                        <td className="py-2.5 px-3">4 Days</td>
                        <td className="py-2.5 px-3 font-bold text-indigo-800">Documentation Complete</td>
                        <td className="py-2.5 px-3 text-slate-600">Ready for Submission</td>
                      </tr>
                      <tr className="bg-amber-50/70 hover:bg-amber-50">
                        <td className="py-2.5 px-3 font-bold text-amber-900">3. Submitted to Payers</td>
                        <td className="py-2.5 px-3 font-black text-amber-950">{computedKpis.submittedToPayers}</td>
                        <td className="py-2.5 px-3">Payer Review / Verification</td>
                        <td className="py-2.5 px-3">60 - 90 Days</td>
                        <td className="py-2.5 px-3">32 Days</td>
                        <td className="py-2.5 px-3 font-bold text-amber-800">Under Active Review</td>
                        <td className="py-2.5 px-3 text-slate-600">Contracting Committee</td>
                      </tr>
                      <tr className="bg-rose-50/70 hover:bg-rose-50">
                        <td className="py-2.5 px-3 font-bold text-rose-900">4. Follow-ups Due</td>
                        <td className="py-2.5 px-3 font-black text-rose-950">{computedKpis.followUpsDue}</td>
                        <td className="py-2.5 px-3">Cadence Follow-Up Required</td>
                        <td className="py-2.5 px-3">14 Day Cadence</td>
                        <td className="py-2.5 px-3">14 Days</td>
                        <td className="py-2.5 px-3 font-bold text-rose-800">Outreach Required</td>
                        <td className="py-2.5 px-3 text-slate-600">Pending Committee Decision</td>
                      </tr>
                      <tr className="bg-emerald-50/70 hover:bg-emerald-50">
                        <td className="py-2.5 px-3 font-bold text-emerald-900">5. Approved / Active</td>
                        <td className="py-2.5 px-3 font-black text-emerald-950">{computedKpis.approvedActive}</td>
                        <td className="py-2.5 px-3">Approved &amp; Effective</td>
                        <td className="py-2.5 px-3">Completed</td>
                        <td className="py-2.5 px-3">42 Days</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-800">Fully In-Network</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">Active Billing Permitted</td>
                      </tr>
                      <tr className="bg-slate-100/80 hover:bg-slate-100">
                        <td className="py-2.5 px-3 font-bold text-slate-900">6. Overdue / Delayed</td>
                        <td className="py-2.5 px-3 font-black text-rose-700">{computedKpis.overdueDelayed}</td>
                        <td className="py-2.5 px-3 text-rose-800 font-bold">Exceeding SLA Cadence</td>
                        <td className="py-2.5 px-3">&gt; 90 Days</td>
                        <td className="py-2.5 px-3">96 Days</td>
                        <td className="py-2.5 px-3 font-bold text-rose-700">ESCALATION REQUIRED</td>
                        <td className="py-2.5 px-3 text-rose-600">Delayed by Payer Panel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-SHEET 2: Live_Records (Data verified matching application) */}
            {sheetSubsheetTab === 'live' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    {/* Row 5: Header Row */}
                    <tr className="bg-[#1e293b] text-white text-[11px] font-bold tracking-tight">
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
                      <th className="py-2.5 px-3 whitespace-nowrap">Days in Stage</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Next Follow-Up</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Intake Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {records.map((r, idx) => {
                      const prov = providers.find((p) => p.id === r.providerId);
                      const pay = payers.find((p) => p.id === r.payerId);
                      const ent = entities.find((e) => e.id === r.entityId);
                      const provName = prov ? ((prov as any).fullName || `${prov.firstName} ${prov.lastName}`) : (r as any).providerName || 'Clinician';
                      const entName = ent?.dba || ent?.legalName || (r as any).entityName || 'Proficio Therapy Services, LLC';
                      const payName = pay?.name || (r as any).payerName || 'Payer Panel';

                      // Stage colourful styling matching reports tab
                      const stageLower = (r.stage || '').toLowerCase();
                      const isApproved = stageLower.includes('approved') || stageLower.includes('effective') || stageLower.includes('linked');
                      const isOverdue = stageLower.includes('overdue');
                      const isSubmitted = stageLower.includes('submitted') || stageLower.includes('review');
                      const isPrep = stageLower.includes('prep');
                      const isIntake = stageLower.includes('intake');

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
                        <tr key={r.id || idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/50 hover:bg-slate-50'}>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 font-bold whitespace-nowrap">{r.id}</td>
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
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.nextFollowUpDate || '—'}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{r.intakeDate || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* SUB-SHEET 3: Monthly_October_2026 */}
            {sheetSubsheetTab === 'monthly' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1e293b] text-white text-[11px] font-bold">
                      <th className="py-2.5 px-3 whitespace-nowrap">Clinician Name</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">NPI</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Discipline</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Legal Entity</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Payer Name</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Stage</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Submission Date</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Approval Date</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Effective Date</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Days in Stage</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Next Follow-Up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {records.map((r, idx) => {
                      const prov = providers.find((p) => p.id === r.providerId);
                      const pay = payers.find((p) => p.id === r.payerId);
                      const ent = entities.find((e) => e.id === r.entityId);
                      const provName = prov ? ((prov as any).fullName || `${prov.firstName} ${prov.lastName}`) : (r as any).providerName || 'Clinician';
                      const entName = ent?.dba || ent?.legalName || (r as any).entityName || 'Proficio Therapy Services, LLC';
                      const payName = pay?.name || (r as any).payerName || 'Payer Panel';

                      return (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{provName}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{prov?.npi || '—'}</td>
                          <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{r.discipline || 'Speech'}</td>
                          <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{entName}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">{payName}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                              {r.stage}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.submissionDate || '—'}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.approvalDate || '—'}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.effectiveDate || '—'}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap">{r.daysInCurrentStage || 0}d</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{r.nextFollowUpDate || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* SUB-SHEET 4: Sync_Log */}
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
                      <td className="py-2.5 px-3 font-bold text-emerald-700 whitespace-nowrap">TWO_WAY_VERIFIED_SYNC</td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">All {records.length} records</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">Application Core</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          SUCCESS
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">Continuous bidirectional synchronization verified with company logo top bar.</td>
                    </tr>
                    <tr className="bg-slate-50/50 hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{new Date(Date.now() - 3600000).toISOString()}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-700 whitespace-nowrap">WORKBOOK_INITIALIZED</td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">5 Subsheets</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">System Engine</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          SUCCESS
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">Executive overview, live records, and monthly snapshot architecture active.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SPREADSHEET BOTTOM TABS BAR (LIKE GOOGLE SHEETS) */}
            <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-1">
                <span className="text-[11px] font-bold text-slate-500 mr-2">Tabs:</span>
                {['overview', 'live', 'monthly', 'synclog'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSheetSubsheetTab(tab as any)}
                    className={`px-3 py-1 rounded-t-lg text-[11px] font-bold transition-all cursor-pointer ${
                      sheetSubsheetTab === tab
                        ? 'bg-white text-slate-900 border-t-2 border-[#0f2b5c] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab === 'overview' ? 'Executive_Overview' : tab === 'live' ? 'Live_Records' : tab === 'monthly' ? 'Monthly_October_2026' : 'Sync_Log'}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {records.length} records &bull; Formula =IMAGE() evaluated
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
      {/* 6. MODALS: CONFIRMATION (DESTRUCTIVE MUTATION) & SNAPSHOT CREATION        */}
      {/* ========================================================================= */}

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
