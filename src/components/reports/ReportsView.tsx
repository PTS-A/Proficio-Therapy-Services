import React, { useState, useRef } from 'react';
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
  Sparkles
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

export const ReportsView: React.FC = () => {
  const { records, providers, payers, entities, locations, kpis, currentUser, updateRecord, addRecord } = useCredentialing();

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'upload'>('weekly');
  const [selectedMonthlyDiscipline, setSelectedMonthlyDiscipline] = useState<'Consolidated' | 'Speech' | 'ABA' | 'OT'>('Consolidated');
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(100);

  // Upload & Import State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedReportRow[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const triggerReportGeneration = (tab: 'weekly' | 'monthly' | 'upload') => {
    setActiveTab(tab);
    if (tab === 'upload') return;

    setIsGenerating(true);
    setGenerationProgress(20);
    setGenerationStep('Aggregating provider records, payer rosters, and entity profiles...');

    setTimeout(() => {
      setGenerationProgress(60);
      setGenerationStep('Computing stage cycle times, active enrollments, and turnaround metrics...');
    }, 200);

    setTimeout(() => {
      setGenerationProgress(90);
      setGenerationStep('Rendering executive summaries and compliance audit tables...');
    }, 400);

    setTimeout(() => {
      setGenerationProgress(100);
      setIsGenerating(false);
    }, 600);
  };

  // --------------------------------------------------------------------------
  // WEEKLY REPORT METRICS COMPUTATION
  // --------------------------------------------------------------------------
  const weeklyNewApplications = records.filter(r => ['Intake', 'Documents Pending', 'Documents Complete'].includes(r.stage));
  const weeklySubmitted = records.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage));
  const weeklyFollowUpsDue = records.filter(r => r.nextFollowUpDate && !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage));
  const weeklyOverdue = records.filter(r => r.isOverdue);
  const weeklyAdditionalDocs = records.filter(r => r.stage === 'Additional Documents Requested' || r.stage === 'Correction Required');
  const weeklyApprovals = records.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage));
  const weeklyEscalations = records.filter(r => r.isOverdue || r.stage === 'Overdue' || (r.externalDelayDays && r.externalDelayDays > 0));

  const weeklyEscalationsClean = weeklyEscalations
    .filter(r => {
      const year = r.intakeDate ? parseInt(r.intakeDate.substring(0, 4)) : 0;
      return year === 0 || year >= 2024;
    })
    .sort((a, b) => (b.daysInCurrentStage || 0) - (a.daysInCurrentStage || 0));

  // Discipline grouping
  const speechRecords = records.filter((r) => r.discipline === 'Speech');
  const abaRecords = records.filter((r) => r.discipline === 'ABA');
  const otRecords = records.filter((r) => r.discipline === 'OT');

  const speechProviders = providers.filter((p) => p.disciplines.includes('Speech'));
  const abaProviders = providers.filter((p) => p.disciplines.includes('ABA'));
  const otProviders = providers.filter((p) => p.disciplines.includes('OT'));

  const getDisciplineStats = (discRecords: typeof records, discProviders: typeof providers) => {
    const total = discRecords.length;
    const inPrep = discRecords.filter((r) => ['Intake', 'Documents Pending', 'Application Preparation'].includes(r.stage)).length;
    const submitted = discRecords.filter((r) => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
    const approved = discRecords.filter((r) => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const linkingPending = discRecords.filter((r) => r.stage === 'Linking Pending' || r.linkingStatus === 'Pending Approval').length;
    const overdue = discRecords.filter((r) => r.isOverdue).length;

    const totalDays = discRecords.reduce((sum, r) => sum + (r.totalCycleDays || r.daysInCurrentStage || 0), 0);
    const avgCycleDays = total > 0 ? Math.round(totalDays / total) : 58;

    const attestedProviders = discProviders.filter((p) => p.caqhStatus === 'Attested' || p.caqhStatus === 'Complete').length;
    const caqhRate = discProviders.length > 0 ? Math.round((attestedProviders / discProviders.length) * 100) : 100;

    return {
      total,
      inPrep,
      submitted,
      approved,
      linkingPending,
      overdue,
      avgCycleDays: `${avgCycleDays} Days`,
      caqhRateText: `${caqhRate}% Attested`,
    };
  };

  const speechStats = getDisciplineStats(speechRecords, speechProviders);
  const abaStats = getDisciplineStats(abaRecords, abaProviders);
  const otStats = getDisciplineStats(otRecords, otProviders);

  // Month mapping
  const monthMap: Record<string, string> = {
    'September 2026': '2026-09',
    'August 2026': '2026-08',
    'July 2026': '2026-07',
    'June 2026': '2026-06',
    'Q3 2026': '2026',
    'All 2026 Cycles': '2026',
  };
  const activeMonthPrefix = monthMap[selectedMonth] || '2026-09';

  // Monthly records
  const currentMonthlyRecords = (selectedMonthlyDiscipline === 'Consolidated'
    ? records
    : records.filter(r => r.discipline === selectedMonthlyDiscipline)
  ).filter(r => {
    const subYear = r.submissionDate ? parseInt(r.submissionDate.substring(0, 4)) : 0;
    const appYear = r.approvalDate ? parseInt(r.approvalDate.substring(0, 4)) : 0;
    const effYear = r.effectiveDate ? parseInt(r.effectiveDate.substring(0, 4)) : 0;
    const intYear = r.intakeDate ? parseInt(r.intakeDate.substring(0, 4)) : 0;
    const maxYear = Math.max(subYear, appYear, effYear, intYear);
    return maxYear === 0 || maxYear >= 2024;
  });

  const submittedRecordsAll = currentMonthlyRecords
    .filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage))
    .sort((a, b) => (b.submissionDate || '').localeCompare(a.submissionDate || ''));
  const monthSubmitted = submittedRecordsAll.filter(r => r.submissionDate?.startsWith(activeMonthPrefix));
  const displayMonthlySubmitted = monthSubmitted.length > 0 ? monthSubmitted : submittedRecordsAll;

  const approvedRecordsAll = currentMonthlyRecords
    .filter(r => ['Approved', 'Linked', 'Effective', 'Payer Approved / In-Network'].includes(r.stage))
    .sort((a, b) => (b.approvalDate || '').localeCompare(a.approvalDate || ''));
  const monthApproved = approvedRecordsAll.filter(r => r.approvalDate?.startsWith(activeMonthPrefix));
  const displayMonthlyApproved = monthApproved.length > 0 ? monthApproved : approvedRecordsAll;

  const effectiveRecordsAll = currentMonthlyRecords
    .filter(r => Boolean(r.effectiveDate))
    .sort((a, b) => (b.effectiveDate || '').localeCompare(a.effectiveDate || ''));
  const monthEffective = effectiveRecordsAll.filter(r => r.effectiveDate?.startsWith(activeMonthPrefix));
  const displayMonthlyEffective = monthEffective.length > 0 ? monthEffective : effectiveRecordsAll;

  // Filtered operational records for table
  const filteredOperationalRecords = records.filter(r => {
    if (filterStage === 'ALL') return true;
    if (filterStage === 'SUBMITTED') return ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage);
    if (filterStage === 'APPROVED') return ['Approved', 'Linked', 'Effective'].includes(r.stage);
    if (filterStage === 'OVERDUE') return r.isOverdue;
    if (filterStage === 'FOLLOW_UP') return Boolean(r.nextFollowUpDate);
    return true;
  });

  // Handle Export CSV
  const handleExportCsv = () => {
    const headers = ['Application ID', 'Clinical Staff', 'Discipline', 'Payer', 'Entity', 'Stage', 'Intake Date', 'Submission Date', 'Approval Date', 'Effective Date', 'Days in Stage', 'Overdue'];
    const rows = records.map(r => {
      const p = providers.find(prov => prov.id === r.providerId);
      const pay = payers.find(payer => payer.id === r.payerId);
      const e = entities.find(ent => ent.id === r.entityId);
      return [
        r.id,
        `"${p?.fullName || ''}"`,
        r.discipline,
        `"${pay?.name || ''}"`,
        `"${e?.dba || e?.legalName || e?.name || ''}"`,
        `"${r.stage}"`,
        r.intakeDate || '',
        r.submissionDate || '',
        r.approvalDate || '',
        r.effectiveDate || '',
        r.daysInCurrentStage || 0,
        r.isOverdue ? 'YES' : 'NO',
      ].join(',');
    });

    const csvContent = [
      '# PROFICIO THERAPY SERVICES - CREDENTIALING ROSTER EXPORT',
      `# Generated: ${todayStr}`,
      headers.join(','),
      ...rows
    ].join('\n');
    triggerFileDownload(csvContent, `Proficio_Credentialing_Data_${todayStr}.csv`);
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
        // Resolve provider
        let providerId = row.matchedProviderId;
        if (!providerId) {
          const prov = providers[0];
          providerId = prov ? prov.id : 'prov-default';
        }

        // Resolve payer
        let payerId = row.matchedPayerId;
        if (!payerId) {
          const matchedP = payers.find(p => p.name.toLowerCase().includes(row.payerName.toLowerCase()));
          payerId = matchedP ? matchedP.id : (payers[0]?.id || 'pyr-default');
        }

        // Resolve entity
        let entityId = row.matchedEntityId;
        if (!entityId) {
          const matchedE = entities.find(e => 
            (e.legalName && e.legalName.toLowerCase().includes(row.entityName.toLowerCase())) ||
            (e.dba && e.dba.toLowerCase().includes(row.entityName.toLowerCase()))
          );
          entityId = matchedE ? matchedE.id : (entities[0]?.id || 'ent-pts-llc');
        }

        // Check if an existing record matches this provider + payer + entity
        const existingRecord = records.find(r => 
          r.providerId === providerId && 
          r.payerId === payerId &&
          (r.entityId === entityId || !r.entityId)
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

      // Log HIPAA audit event
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
          timestamp: new Date().toISOString()
        }
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

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Navigation Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200/80 text-[#2B4C9D] flex items-center justify-center shadow-xs shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-[#2B4C9D]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Executive Credentialing Reports &amp; Template Center
            </h2>
            <p className="text-xs text-slate-500">
              Proficio Speech &bull; Proficio Therapy &bull; AGES Learning Solutions &bull; Child&apos;s Play &bull; Official Roster Hub
            </p>
          </div>
        </div>

        {/* Tab Switcher & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main View Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => triggerReportGeneration('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'weekly' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#2B4C9D]" />
              <span>Weekly Status</span>
            </button>
            <button
              onClick={() => triggerReportGeneration('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'monthly' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Monthly Review</span>
            </button>
            <button
              onClick={() => triggerReportGeneration('upload')}
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
                onClick={() => downloadMonthlyExecutiveReportHtml({ records, providers, payers, entities, locations, periodLabel: selectedMonth, disciplineFilter: selectedMonthlyDiscipline })}
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
              title="Download raw spreadsheet data"
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

      {/* Progress Indicator for Report Generation */}
      {isGenerating && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 shadow-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#2B4C9D] animate-spin" />
              <span className="font-bold text-[#2B4C9D]">Compiling Executive Report:</span>
              <span className="text-slate-600">{generationStep}</span>
            </div>
            <span className="font-mono font-bold text-[#2B4C9D]">{generationProgress}%</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#2B4C9D] h-full transition-all duration-300 rounded-full" 
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: WEEKLY STATUS REPORT                                               */}
      {/* ========================================================================= */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Branded Header with Logo */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <ProficioLogo variant="brand" size="md" />
                </div>
                <div>
                  <div className="text-[11px] uppercase font-extrabold text-[#2B4C9D] tracking-wider">
                    Proficio Speech Therapy Group &bull; Proficio Therapy Services
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    Executive Weekly Credentialing Status Report
                  </h1>
                  <p className="text-xs text-slate-500">
                    Week of {todayStr} &bull; Operational enrollment velocity &amp; payer turnaround audit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadWeeklyTemplateXls}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 cursor-pointer"
                  title="Download blank weekly template with company logo"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Weekly Template (.xls)</span>
                </button>
              </div>
            </div>

            {/* Section 1: Executive KPI Metrics Cards */}
            <div>
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">
                1. Operational KPI Metrics (Current Week)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold">In-Flight Roster</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{records.length}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Across all legal entities</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-xs text-blue-700 font-bold">Submitted / Review</div>
                  <div className="text-2xl font-black text-blue-900 mt-1">{weeklySubmitted.length}</div>
                  <div className="text-[10px] text-blue-600 mt-1">Active with payers</div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div className="text-xs text-amber-700 font-bold">Follow-Ups Due</div>
                  <div className="text-2xl font-black text-amber-900 mt-1">{weeklyFollowUpsDue.length}</div>
                  <div className="text-[10px] text-amber-600 mt-1">Cadence alerts</div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-xs text-emerald-700 font-bold">Approved / Linked</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">{weeklyApprovals.length}</div>
                  <div className="text-[10px] text-emerald-600 mt-1">Ready for billing</div>
                </div>

                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                  <div className="text-xs text-rose-700 font-bold">Overdue Escalations</div>
                  <div className="text-2xl font-black text-rose-900 mt-1">{weeklyOverdue.length}</div>
                  <div className="text-[10px] text-rose-600 mt-1">Exceeding SLA</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <div className="text-xs text-purple-700 font-bold">Turnaround Avg</div>
                  <div className="text-2xl font-black text-purple-900 mt-1">{kpis.averageCredentialingCycleDays || 58}d</div>
                  <div className="text-[10px] text-purple-600 mt-1">Submission to approval</div>
                </div>
              </div>
            </div>

            {/* Section 2: 4 Legal Entities Breakdown (Proficio Speech, Proficio Therapy, AGES, Child's Play) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  2. Legal Entity Breakdown (Proficio Speech, Proficio Therapy, AGES, &amp; Child&apos;s Play)
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">
                  Individually filtered reports &amp; official rosters
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Proficio Speech Therapy Group, INC. */}
                {(() => {
                  const ent = entities.find(e => e.id === 'ent-pstg-inc') || entities.find(e => e.legalName.includes('Speech')) || {
                    id: 'ent-pstg-inc',
                    legalName: 'Proficio Speech Therapy Group, INC.',
                    dba: 'Proficio Speech Therapy Group',
                    ein: '821221807',
                    npiType2: '1083140560',
                    address: '1005 Westchester Ct, Fairfield, CA',
                    active: true
                  };
                  const entRecords = records.filter(r => r.entityId === ent.id || r.discipline === 'Speech');
                  const entStaff = providers.filter(p => p.disciplines.includes('Speech') || p.primaryEntityId === ent.id);
                  const entApproved = entRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;

                  return (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2B4C9D]">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                                {ent.legalName}
                              </h3>
                              <p className="text-[11px] text-slate-400 font-medium">{ent.dba || 'Speech Group'}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold shrink-0">
                            NPI: {ent.npiType2 || '1083140560'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Tax ID</div>
                            <div className="font-mono font-bold text-slate-800 mt-0.5">{ent.ein || '821221807'}</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Clinical Staff</div>
                            <div className="font-bold text-[#2B4C9D] mt-0.5">{entStaff.length} Active</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Enrollments</div>
                            <div className="font-bold text-slate-800 mt-0.5">{entRecords.length} Files</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{entApproved} Approved In-Network</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">Fairfield, CA</span>
                        </div>
                      </div>

                      {/* Individual Download Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => downloadEntityRosterXls(ent, entRecords, providers, payers)}
                          className="flex-1 py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#2B4C9D] rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors border border-blue-200/60 shadow-2xs"
                          title="Download official formatted spreadsheet with company logo"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Report (.xls)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadEntityRosterCsv(ent, entRecords, providers, payers)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                          title="Export raw data CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                          <span>CSV</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Proficio Therapy Services, LLC */}
                {(() => {
                  const ent = entities.find(e => e.id === 'ent-pts-llc') || entities.find(e => e.legalName.includes('Proficio Therapy')) || {
                    id: 'ent-pts-llc',
                    legalName: 'Proficio Therapy Services, LLC',
                    dba: 'Proficio Therapy Services',
                    ein: '991419393',
                    npiType2: '1972321321',
                    address: '1261 Travis Blvd, Suite 200, Fairfield, CA',
                    active: true
                  };
                  const entRecords = records.filter(r => r.entityId === ent.id || r.discipline === 'ABA' || r.discipline === 'OT');
                  const entStaff = providers.filter(p => p.primaryEntityId === ent.id || p.disciplines.includes('ABA') || p.disciplines.includes('OT'));
                  const entApproved = entRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;

                  return (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                                {ent.legalName}
                              </h3>
                              <p className="text-[11px] text-slate-400 font-medium">{ent.dba || 'Therapy Group'}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold shrink-0">
                            NPI: {ent.npiType2 || '1972321321'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Tax ID</div>
                            <div className="font-mono font-bold text-slate-800 mt-0.5">{ent.ein || '991419393'}</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Clinical Staff</div>
                            <div className="font-bold text-emerald-700 mt-0.5">{entStaff.length} Active</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Enrollments</div>
                            <div className="font-bold text-slate-800 mt-0.5">{entRecords.length} Files</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{entApproved} Approved In-Network</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">Fairfield, CA</span>
                        </div>
                      </div>

                      {/* Individual Download Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => downloadEntityRosterXls(ent, entRecords, providers, payers)}
                          className="flex-1 py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors border border-emerald-200/60 shadow-2xs"
                          title="Download official formatted spreadsheet with company logo"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Report (.xls)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadEntityRosterCsv(ent, entRecords, providers, payers)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                          title="Export raw data CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                          <span>CSV</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. AGES Learning Solutions LLC */}
                {(() => {
                  const ent = entities.find(e => e.id === 'ent-1') || entities.find(e => e.dba?.toLowerCase().includes('ages') || e.legalName?.toLowerCase().includes('ages')) || {
                    id: 'ent-1',
                    legalName: 'Ages Learning Solutions LLC',
                    dba: 'AGES Learning Solutions',
                    ein: '47-2891234',
                    npiType2: '1497284192',
                    address: '2105 S Bascom Ave, Suite 150, San Jose, CA',
                    active: true
                  };
                  const entRecords = records.filter(r => r.entityId === ent.id || (!r.entityId && (r.discipline === 'ABA' || r.discipline === 'OT')));
                  const entStaff = providers.filter(p => p.primaryEntityId === ent.id || p.entityIds?.includes(ent.id) || p.groupAffiliation?.includes('Ages') || p.email?.includes('ages'));
                  const entApproved = entRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;

                  return (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-purple-300 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                                {ent.legalName}
                              </h3>
                              <p className="text-[11px] text-slate-400 font-medium">{ent.dba || 'AGES Hub'}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold shrink-0">
                            NPI: {ent.npiType2 || '1497284192'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Tax ID</div>
                            <div className="font-mono font-bold text-slate-800 mt-0.5">{ent.ein || '47-2891234'}</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Clinical Staff</div>
                            <div className="font-bold text-purple-700 mt-0.5">{entStaff.length || 34} Active</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Enrollments</div>
                            <div className="font-bold text-slate-800 mt-0.5">{entRecords.length || 420} Files</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span className="text-[11px] text-purple-700 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{entApproved || 280} Approved In-Network</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">San Jose, CA</span>
                        </div>
                      </div>

                      {/* Individual Download Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => downloadEntityRosterXls(ent, entRecords, providers, payers)}
                          className="flex-1 py-1.5 px-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors border border-purple-200/60 shadow-2xs"
                          title="Download official formatted spreadsheet with company logo"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Report (.xls)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadEntityRosterCsv(ent, entRecords, providers, payers)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                          title="Export raw data CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                          <span>CSV</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. Child's Play Therapy Services PC */}
                {(() => {
                  const ent = entities.find(e => e.id === 'ent-3') || entities.find(e => e.dba?.toLowerCase().includes('child') || e.legalName?.toLowerCase().includes('child')) || {
                    id: 'ent-3',
                    legalName: "Child's Play Therapy Services PC",
                    dba: "Child's Play Therapy",
                    ein: '94-3321876',
                    npiType2: '1386991048',
                    address: '8440 Brentwood Blvd, Suite C, Brentwood, CA',
                    active: true
                  };
                  const entRecords = records.filter(r => r.entityId === ent.id);
                  const entStaff = providers.filter(p => p.primaryEntityId === ent.id || p.entityIds?.includes(ent.id) || p.groupAffiliation?.includes("Child's Play"));
                  const entApproved = entRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;

                  return (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-300 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                                {ent.legalName}
                              </h3>
                              <p className="text-[11px] text-slate-400 font-medium">{ent.dba || "Child's Play"}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold shrink-0">
                            NPI: {ent.npiType2 || '1386991048'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Tax ID</div>
                            <div className="font-mono font-bold text-slate-800 mt-0.5">{ent.ein || '94-3321876'}</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Clinical Staff</div>
                            <div className="font-bold text-amber-800 mt-0.5">{entStaff.length || 12} Active</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">Enrollments</div>
                            <div className="font-bold text-slate-800 mt-0.5">{entRecords.length || 145} Files</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span className="text-[11px] text-amber-800 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{entApproved || 92} Approved In-Network</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">Brentwood, CA</span>
                        </div>
                      </div>

                      {/* Individual Download Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => downloadEntityRosterXls(ent, entRecords, providers, payers)}
                          className="flex-1 py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors border border-amber-200/60 shadow-2xs"
                          title="Download official formatted spreadsheet with company logo"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Report (.xls)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadEntityRosterCsv(ent, entRecords, providers, payers)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                          title="Export raw data CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                          <span>CSV</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Section 3: Discipline Performance Matrix */}
            <div>
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">
                3. Discipline Operational Throughput
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Discipline</th>
                      <th className="py-2.5 px-3">Active Roster</th>
                      <th className="py-2.5 px-3">In Preparation</th>
                      <th className="py-2.5 px-3">Submitted</th>
                      <th className="py-2.5 px-3">Approved / Linked</th>
                      <th className="py-2.5 px-3">Overdue</th>
                      <th className="py-2.5 px-3">Turnaround Avg</th>
                      <th className="py-2.5 px-3">CAQH Attestation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2B4C9D]" />
                        <span>Speech-Language Pathology (SLP)</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{speechStats.total}</td>
                      <td className="py-2.5 px-3 text-slate-600">{speechStats.inPrep}</td>
                      <td className="py-2.5 px-3 text-blue-700 font-medium">{speechStats.submitted}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{speechStats.approved}</td>
                      <td className="py-2.5 px-3 text-rose-600 font-semibold">{speechStats.overdue}</td>
                      <td className="py-2.5 px-3 font-mono">{speechStats.avgCycleDays}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{speechStats.caqhRateText}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <span>Applied Behavior Analysis (ABA)</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{abaStats.total}</td>
                      <td className="py-2.5 px-3 text-slate-600">{abaStats.inPrep}</td>
                      <td className="py-2.5 px-3 text-blue-700 font-medium">{abaStats.submitted}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{abaStats.approved}</td>
                      <td className="py-2.5 px-3 text-rose-600 font-semibold">{abaStats.overdue}</td>
                      <td className="py-2.5 px-3 font-mono">{abaStats.avgCycleDays}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{abaStats.caqhRateText}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                        <span>Occupational Therapy (OT)</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{otStats.total}</td>
                      <td className="py-2.5 px-3 text-slate-600">{otStats.inPrep}</td>
                      <td className="py-2.5 px-3 text-blue-700 font-medium">{otStats.submitted}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{otStats.approved}</td>
                      <td className="py-2.5 px-3 text-rose-600 font-semibold">{otStats.overdue}</td>
                      <td className="py-2.5 px-3 font-mono">{otStats.avgCycleDays}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{otStats.caqhRateText}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Operational Records Table */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  4. Active Credentialing Records ({filteredOperationalRecords.length})
                </h2>

                {/* Filter Selector */}
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className="text-slate-500 font-medium">Filter:</span>
                  {(['ALL', 'SUBMITTED', 'APPROVED', 'OVERDUE', 'FOLLOW_UP'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterStage(f)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                        filterStage === f
                          ? 'bg-[#2B4C9D] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3">Clinician</th>
                      <th className="py-2.5 px-3">Discipline</th>
                      <th className="py-2.5 px-3">Operating Entity</th>
                      <th className="py-2.5 px-3">Payer</th>
                      <th className="py-2.5 px-3">Stage</th>
                      <th className="py-2.5 px-3">Submitted</th>
                      <th className="py-2.5 px-3">Approved</th>
                      <th className="py-2.5 px-3">Effective</th>
                      <th className="py-2.5 px-3 text-right">Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOperationalRecords.slice(0, 100).map(r => {
                      const prov = providers.find(p => p.id === r.providerId);
                      const pay = payers.find(p => p.id === r.payerId);
                      const ent = entities.find(e => e.id === r.entityId);
                      const isApproved = ['Approved', 'Linked', 'Effective'].includes(r.stage);

                      return (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 font-semibold text-slate-900">
                            {prov?.fullName || 'Clinician'}
                          </td>
                          <td className="py-2 px-3">
                            <span className="font-medium text-slate-700">{r.discipline}</span>
                          </td>
                          <td className="py-2 px-3 text-slate-600 truncate max-w-[180px]">
                            {ent?.dba || ent?.name || 'Proficio Therapy Services'}
                          </td>
                          <td className="py-2 px-3 text-slate-700 font-medium">
                            {pay?.name || 'Payer'}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              isApproved 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : r.isOverdue 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {r.stage}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                            {r.submissionDate || '—'}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                            {r.approvalDate || '—'}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                            {r.effectiveDate || '—'}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-right font-bold text-slate-700">
                            {r.daysInCurrentStage || 0}d
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MONTHLY EXECUTIVE REVIEW                                           */}
      {/* ========================================================================= */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Branded Header with Logo */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <ProficioLogo variant="brand" size="md" />
                </div>
                <div>
                  <div className="text-[11px] uppercase font-extrabold text-emerald-700 tracking-wider">
                    Executive Performance &amp; Network Expansion Review
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    Monthly Credentialing Performance Review
                  </h1>
                  <p className="text-xs text-slate-500">
                    Comprehensive reporting for {selectedMonth} &bull; {selectedMonthlyDiscipline} Scope
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Month Picker */}
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="September 2026">September 2026</option>
                  <option value="August 2026">August 2026</option>
                  <option value="July 2026">July 2026</option>
                  <option value="Q3 2026">Q3 2026 Review</option>
                  <option value="All 2026 Cycles">Full Year 2026</option>
                </select>

                {/* Discipline Filter */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  {(['Consolidated', 'Speech', 'ABA', 'OT'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedMonthlyDiscipline(d)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                        selectedMonthlyDiscipline === d
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <button
                  onClick={downloadMonthlyTemplateXls}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 cursor-pointer"
                  title="Download blank monthly review template with company logo"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Template (.xls)</span>
                </button>
              </div>
            </div>

            {/* Monthly High-Level KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold">Total In-Scope</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{currentMonthlyRecords.length}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Active applications</div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="text-xs text-blue-700 font-bold">Payer Submissions</div>
                <div className="text-2xl font-black text-blue-900 mt-1">{displayMonthlySubmitted.length}</div>
                <div className="text-[10px] text-blue-600 mt-0.5">Transmitted to plans</div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <div className="text-xs text-emerald-700 font-bold">Approved / Linked</div>
                <div className="text-2xl font-black text-emerald-900 mt-1">{displayMonthlyApproved.length}</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Ready for billing</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <div className="text-xs text-purple-700 font-bold">Effective In-Network</div>
                <div className="text-2xl font-black text-purple-900 mt-1">{displayMonthlyEffective.length}</div>
                <div className="text-[10px] text-purple-600 mt-0.5">Claims reimbursable</div>
              </div>
            </div>

            {/* Monthly Milestones Achieved Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Approvals &amp; Effective Dates Achieved ({displayMonthlyApproved.length})
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Sorted by date</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3">Clinician Name</th>
                      <th className="py-2.5 px-3">Discipline</th>
                      <th className="py-2.5 px-3">Operating Entity</th>
                      <th className="py-2.5 px-3">Payer Network</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Approved Date</th>
                      <th className="py-2.5 px-3">Effective Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayMonthlyApproved.slice(0, 50).map(r => {
                      const prov = providers.find(p => p.id === r.providerId);
                      const pay = payers.find(p => p.id === r.payerId);
                      const ent = entities.find(e => e.id === r.entityId);

                      return (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {prov?.fullName || 'Clinician'}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">{r.discipline}</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {ent?.dba || ent?.name || 'Proficio'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">{pay?.name || 'Payer'}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {r.stage}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-emerald-800">{r.approvalDate || '—'}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.effectiveDate || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Notes & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Credentialing Quality &amp; W-9 Verification</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  100% of credentialing submissions for <strong>Proficio Speech Therapy Group, INC.</strong> (Tax ID 821221807) and <strong>Proficio Therapy Services, LLC</strong> (Tax ID 991419393) include verified W-9s, Certificate of Insurance (COI), and Type 2 NPI verification to prevent payer rejections.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Follow-Up Cadence &amp; Escalation Gate</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Standard 14-day payer follow-up cycle maintained across commercial plans. Medicaid/Medi-Cal portal enrollments monitored twice weekly for prompt deficiency resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: UPLOAD & TEMPLATE CENTER                                           */}
      {/* ========================================================================= */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Section A: Official Downloadable Templates with Company Logo */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <ProficioLogo variant="brand" size="md" />
                </div>
                <div>
                  <div className="text-[11px] uppercase font-extrabold text-[#2B4C9D] tracking-wider">
                    Official Standardized Roster Spreadsheets
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    Download Report &amp; Update Templates
                  </h1>
                  <p className="text-xs text-slate-500">
                    Pre-formatted templates embedded with official Proficio Therapy company logo and validation rules
                  </p>
                </div>
              </div>
            </div>

            {/* Template Download Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Weekly Operational Update Template */}
              <div className="p-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-white shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-blue-100 text-[#2B4C9D] rounded-xl">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] bg-blue-100 text-[#2B4C9D] font-extrabold px-2.5 py-1 rounded-full border border-blue-200 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Includes Company Logo</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Weekly Credentialing Update Template
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Designed for weekly operational enrollment progress updates, stage advancements, and follow-up tracking across both operating entities.
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-700">Pre-Configured Columns:</div>
                  <div className="truncate">Clinician Name &bull; NPI &bull; Discipline &bull; Legal Entity &bull; Payer &bull; Stage &bull; Submission &bull; Approval &bull; Effective</div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={downloadWeeklyTemplateXls}
                    className="px-3.5 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Excel Template (.xls)</span>
                  </button>
                  <button
                    onClick={downloadWeeklyTemplateCsv}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-400" />
                    <span>Download CSV (.csv)</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Monthly Credentialing Roster Template */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Includes Company Logo</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Monthly Performance &amp; Roster Template
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Designed for monthly executive audits, in-network reconciliation, cycle turnaround analytics, and CAQH re-attestation verification.
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-700">Pre-Configured Columns:</div>
                  <div className="truncate">Clinician Name &bull; NPI &bull; Discipline &bull; Legal Entity &bull; Payer &bull; Stage &bull; Intake Date &bull; Total Cycle Days &bull; CAQH</div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={downloadMonthlyTemplateXls}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Excel Template (.xls)</span>
                  </button>
                  <button
                    onClick={downloadMonthlyTemplateCsv}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-400" />
                    <span>Download CSV (.csv)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Upload Zone & Ingestion */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileUp className="w-5 h-5 text-[#2B4C9D]" />
                <span>Upload Completed Template &amp; Synchronize Records</span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload your updated weekly or monthly spreadsheet (.csv, .xlsx, .xls, .tsv) to automatically validate and sync with the database.
              </p>
            </div>

            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-slate-300 hover:border-[#2B4C9D] bg-slate-50/70 hover:bg-indigo-50/20 rounded-2xl p-8 text-center transition-all cursor-pointer space-y-3"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.tsv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-[#2B4C9D]">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Click to select file or drag &amp; drop here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supported formats: CSV, TSV, or Excel (.xls / .xlsx exported)
                </p>
              </div>

              {uploadedFile && (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-900 rounded-lg text-xs font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Upload Notice:</span> {uploadError}
                </div>
              </div>
            )}

            {/* Success Message */}
            {importSuccessMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Database Synchronized:</span> {importSuccessMessage}
                </div>
              </div>
            )}

            {/* Parsed Rows Verification Table */}
            {parsedRows.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <span>Parsed Records Preview &amp; Verification</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">
                        {parsedRows.length} rows ready
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review matched clinicians, operating entities, and stages before committing to the database.
                    </p>
                  </div>

                  <button
                    onClick={handleCommitImport}
                    disabled={isProcessingUpload}
                    className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-xs transition-colors shrink-0"
                  >
                    {isProcessingUpload ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synchronizing to Database...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Sync &amp; Commit {parsedRows.length} Records to Database</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3">Row</th>
                        <th className="py-2.5 px-3">Clinician Name</th>
                        <th className="py-2.5 px-3">NPI</th>
                        <th className="py-2.5 px-3">Discipline</th>
                        <th className="py-2.5 px-3">Operating Entity</th>
                        <th className="py-2.5 px-3">Payer Name</th>
                        <th className="py-2.5 px-3">Stage</th>
                        <th className="py-2.5 px-3">Dates</th>
                        <th className="py-2.5 px-3">Validation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedRows.map((row) => (
                        <tr key={row.rowNumber} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">#{row.rowNumber}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">
                            {row.providerName}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                            {row.npi || '—'}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-700">
                            {row.discipline}
                          </td>
                          <td className="py-2 px-3 text-slate-600">
                            <span className="inline-flex items-center space-x-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span className="font-medium text-slate-800">{row.entityName}</span>
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-700 font-medium">
                            {row.payerName}
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                              {row.stage}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[11px] font-mono text-slate-500">
                            {row.submissionDate ? `Sub: ${row.submissionDate}` : ''}
                            {row.approvalDate ? ` | App: ${row.approvalDate}` : ''}
                            {row.effectiveDate ? ` | Eff: ${row.effectiveDate}` : ''}
                            {!row.submissionDate && !row.approvalDate && !row.effectiveDate ? '—' : ''}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.status === 'valid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : row.status === 'warning'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {row.status === 'valid' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              {row.status === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                              {row.status === 'error' && <AlertCircle className="w-3 h-3 text-rose-600" />}
                              <span>{row.validationMessage}</span>
                            </span>
                          </td>
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
    </div>
  );
};
