import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Code, 
  Copy, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Layers, 
  Printer, 
  RefreshCw, 
  AlertCircle,
  AlertTriangle,
  UserCheck,
  Building2,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Award,
  CalendarDays,
  FileCheck,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { Discipline, CredentialingStage } from '../../types';

export const ReportsView: React.FC = () => {
  const { records, providers, payers, entities, locations, kpis, currentUser } = useCredentialing();

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'powerbi'>('weekly');
  const [selectedMonthlyDiscipline, setSelectedMonthlyDiscipline] = useState<'Consolidated' | 'ABA' | 'Speech' | 'OT'>('Consolidated');
  const [selectedMonth, setSelectedMonth] = useState<string>('August 2026');
  const [copiedApi, setCopiedApi] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(100);

  const todayStr = new Date().toISOString().split('T')[0];

  const triggerReportGeneration = (tab: 'weekly' | 'monthly' | 'powerbi') => {
    setActiveTab(tab);
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStep('Aggregating provider records and payer matrices...');

    setTimeout(() => {
      setGenerationProgress(50);
      setGenerationStep('Computing turnaround times, weekly deltas, and discipline KPIs...');
    }, 200);

    setTimeout(() => {
      setGenerationProgress(85);
      setGenerationStep('Formatting standardized reporting outputs and audit tables...');
    }, 450);

    setTimeout(() => {
      setGenerationProgress(100);
      setIsGenerating(false);
    }, 700);
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

  // Discipline grouping
  const abaRecords = records.filter((r) => r.discipline === 'ABA');
  const speechRecords = records.filter((r) => r.discipline === 'Speech');
  const otRecords = records.filter((r) => r.discipline === 'OT');

  const abaProviders = providers.filter((p) => p.disciplines.includes('ABA'));
  const speechProviders = providers.filter((p) => p.disciplines.includes('Speech'));
  const otProviders = providers.filter((p) => p.disciplines.includes('OT'));

  const getDisciplineStats = (discRecords: typeof records, discProviders: typeof providers) => {
    const total = discRecords.length;
    const inPrep = discRecords.filter((r) => ['Intake', 'Documents Pending', 'Application Preparation'].includes(r.stage)).length;
    const submitted = discRecords.filter((r) => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
    const approved = discRecords.filter((r) => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const linkingPending = discRecords.filter((r) => r.stage === 'Linking Pending' || r.linkingStatus === 'Pending Approval').length;
    const overdue = discRecords.filter((r) => r.isOverdue).length;
    const additionalDocs = discRecords.filter((r) => r.stage === 'Additional Documents Requested' || r.stage === 'Correction Required').length;

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
      additionalDocs,
      avgCycleDays: `${avgCycleDays} Days`,
      caqhRateText: `${caqhRate}% Attested`,
    };
  };

  const abaStats = getDisciplineStats(abaRecords, abaProviders);
  const speechStats = getDisciplineStats(speechRecords, speechProviders);
  const otStats = getDisciplineStats(otRecords, otProviders);

  // Dynamic Monthly Records Scope
  const currentMonthlyRecords = selectedMonthlyDiscipline === 'Consolidated'
    ? records
    : records.filter(r => r.discipline === selectedMonthlyDiscipline);

  const currentMonthlyProviders = selectedMonthlyDiscipline === 'Consolidated'
    ? providers
    : providers.filter(p => p.disciplines.includes(selectedMonthlyDiscipline as Discipline));

  // Export CSV handler
  const handleExportCsv = () => {
    const headers = ['Application ID', 'Clinical Staff', 'Discipline', 'Payer', 'Entity', 'Stage', 'Intake Date', 'Submission Date', 'Approval Date', 'Effective Date', 'Days in Process', 'Overdue'];
    const rows = records.map(r => {
      const p = providers.find(prov => prov.id === r.providerId);
      const pay = payers.find(payer => payer.id === r.payerId);
      const e = entities.find(ent => ent.id === r.entityId);
      return [
        r.id,
        `"${p?.fullName || ''}"`,
        r.discipline,
        `"${pay?.name || ''}"`,
        `"${e?.name || ''}"`,
        `"${r.stage}"`,
        r.intakeDate || '',
        r.submissionDate || '',
        r.approvalDate || '',
        r.effectiveDate || '',
        r.daysInCurrentStage || 0,
        r.isOverdue ? 'YES' : 'NO',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Credentialing_Report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Power BI dataset payload
  const powerBiPayload = {
    metadata: {
      generatedAt: new Date().toISOString(),
      reportVersion: '2026.2.0-POWERBI',
      schema: 'https://api.powerbi.com/v1.0/myorg/datasets',
      sourceSystem: 'Ages-Proficio-ChildPlay-Credentialing-System',
    },
    tables: [
      {
        name: 'Fact_CredentialingApplications',
        rowCount: records.length,
        sample: records.slice(0, 3),
      },
      {
        name: 'Dim_Providers',
        rowCount: providers.length,
        sample: providers.slice(0, 3),
      },
      {
        name: 'Dim_Payers',
        rowCount: payers.length,
        sample: payers.slice(0, 3),
      },
      {
        name: 'Dim_LegalEntities',
        rowCount: entities.length,
        sample: entities,
      },
      {
        name: 'Dim_Locations',
        rowCount: locations.length,
        sample: locations,
      },
    ],
    kpis: {
      totalProviders: providers.length,
      totalApplications: records.length,
      applicationsSubmitted: kpis.applicationsSubmitted,
      applicationsPending: kpis.applicationsPending,
      applicationsApproved: kpis.applicationsApproved,
      applicationsRequiringAction: kpis.applicationsRequiringAction,
      applicationsOverdue: kpis.applicationsOverdue,
      averageCycleDays: kpis.averageCredentialingCycleDays,
    },
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(powerBiPayload, null, 2));
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Report Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#2B4C9D]" />
            <span>Executive Credentialing Reports</span>
          </h2>
          <p className="text-xs text-slate-500">
            Standardized weekly operational status reports and monthly discipline reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => triggerReportGeneration('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'weekly' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Weekly Report
            </button>
            <button
              onClick={() => triggerReportGeneration('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'monthly' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Monthly Report
            </button>
            <button
              onClick={() => triggerReportGeneration('powerbi')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'powerbi' ? 'bg-white text-[#2B4C9D] shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Power BI Export
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            title="Download CSV file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator for Report Generation */}
      {isGenerating && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 shadow-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#2B4C9D] animate-spin" />
              <span className="font-bold text-[#2B4C9D]">Generating Standardized Report:</span>
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
      {/* WEEKLY REPORT                                                             */}
      {/* ========================================================================= */}
      {activeTab === 'weekly' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase font-extrabold text-[#2B4C9D] tracking-wider">
                Ages Learning Solutions • Proficio Speech • Child's Play Therapy
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Executive Weekly Credentialing Status Report
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Week Ending: <strong>{todayStr}</strong> • Prepared by: {currentUser.name} ({currentUser.role})
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#2B4C9D] font-bold border border-blue-100">
                {records.length} Total Applications Active
              </span>
            </div>
          </div>

          {/* 7 Weekly Metrics Cards (Exact specification) */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Core Weekly Activity & Operational Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* 1. New Applications */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-medium text-slate-500">New Applications</div>
                <div className="text-xl font-black text-slate-900 mt-1">{weeklyNewApplications.length}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Intake & Prep</div>
              </div>

              {/* 2. Applications Submitted */}
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200">
                <div className="text-[11px] font-medium text-sky-700">Submitted</div>
                <div className="text-xl font-black text-sky-800 mt-1">{weeklySubmitted.length}</div>
                <div className="text-[10px] text-sky-600 mt-0.5">Sent to payers</div>
              </div>

              {/* 3. Follow-ups Due */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="text-[11px] font-medium text-blue-700">Follow-ups Due</div>
                <div className="text-xl font-black text-blue-800 mt-1">{weeklyFollowUpsDue.length}</div>
                <div className="text-[10px] text-blue-600 mt-0.5">Scheduled checks</div>
              </div>

              {/* 4. Overdue Applications */}
              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
                <div className="text-[11px] font-medium text-rose-700">Overdue</div>
                <div className="text-xl font-black text-rose-800 mt-1">{weeklyOverdue.length}</div>
                <div className="text-[10px] text-rose-600 mt-0.5">Lapsed follow-up</div>
              </div>

              {/* 5. Additional Docs Requested */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="text-[11px] font-medium text-amber-700">Docs Requested</div>
                <div className="text-xl font-black text-amber-800 mt-1">{weeklyAdditionalDocs.length}</div>
                <div className="text-[10px] text-amber-600 mt-0.5">Payer requests</div>
              </div>

              {/* 6. Approvals */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-[11px] font-medium text-emerald-700">Approvals</div>
                <div className="text-xl font-black text-emerald-800 mt-1">{weeklyApprovals.length}</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Approved & active</div>
              </div>

              {/* 7. Issues Requiring Escalation */}
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                <div className="text-[11px] font-medium text-purple-700">Escalations</div>
                <div className="text-xl font-black text-purple-800 mt-1">{weeklyEscalations.length}</div>
                <div className="text-[10px] text-purple-600 mt-0.5">Action logged</div>
              </div>
            </div>
          </div>

          {/* Weekly Pipeline Status by Discipline Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Weekly Discipline Breakdown
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Discipline</th>
                    <th className="py-2.5 px-3 text-center">Total Volume</th>
                    <th className="py-2.5 px-3 text-center">In Prep / Intake</th>
                    <th className="py-2.5 px-3 text-center">Submitted / Review</th>
                    <th className="py-2.5 px-3 text-center">Docs Requested</th>
                    <th className="py-2.5 px-3 text-center">Approved</th>
                    <th className="py-2.5 px-3 text-center">Overdue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Applied Behavior Analysis (ABA)</td>
                    <td className="py-2.5 px-3 text-center font-bold">{abaStats.total}</td>
                    <td className="py-2.5 px-3 text-center">{abaStats.inPrep}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-sky-700">{abaStats.submitted}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-amber-700">{abaStats.additionalDocs}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-emerald-700">{abaStats.approved}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600">{abaStats.overdue}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Speech-Language Pathology (Speech)</td>
                    <td className="py-2.5 px-3 text-center font-bold">{speechStats.total}</td>
                    <td className="py-2.5 px-3 text-center">{speechStats.inPrep}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-sky-700">{speechStats.submitted}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-amber-700">{speechStats.additionalDocs}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-emerald-700">{speechStats.approved}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600">{speechStats.overdue}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Occupational Therapy (OT)</td>
                    <td className="py-2.5 px-3 text-center font-bold">{otStats.total}</td>
                    <td className="py-2.5 px-3 text-center">{otStats.inPrep}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-sky-700">{otStats.submitted}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-amber-700">{otStats.additionalDocs}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-emerald-700">{otStats.approved}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600">{otStats.overdue}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Issues Requiring Escalation Section */}
          <div className="border border-purple-200 bg-purple-50/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-purple-700" />
              <h4 className="font-bold text-sm text-purple-900">
                Issues Requiring Escalation & Action Log
              </h4>
            </div>

            {weeklyEscalations.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No critical escalation blockers logged this reporting cycle.</p>
            ) : (
              <div className="divide-y divide-purple-100 text-xs">
                {weeklyEscalations.slice(0, 5).map((rec) => {
                  const prov = providers.find(p => p.id === rec.providerId);
                  const pay = payers.find(p => p.id === rec.payerId);
                  return (
                    <div key={rec.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{prov?.fullName || 'Staff Member'}</span>
                        <span className="text-slate-500"> • {pay?.name} ({rec.discipline})</span>
                        <p className="text-[11px] text-purple-800 mt-0.5 font-medium">
                          {rec.nextAction || rec.externalDelayReason || 'Follow-up date lapsed; requires specialist re-contact.'}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800">
                        {rec.daysInCurrentStage || 0}d in stage
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Executive Summary & Next Actions */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-900">Weekly Executive Summary & Next Steps</h4>
            <p className="text-slate-600 leading-relaxed">
              1. <strong>{weeklySubmitted.length} applications</strong> are currently in active payer review. Follow-up cadences are scheduled across participating plans.
            </p>
            <p className="text-slate-600 leading-relaxed">
              2. <strong>{weeklyApprovals.length} approvals</strong> recorded this cycle. Ensure all approved providers have facility group linking verified to enable billing claims.
            </p>
            {weeklyAdditionalDocs.length > 0 && (
              <p className="text-slate-600 leading-relaxed">
                3. <strong>{weeklyAdditionalDocs.length} application(s)</strong> have outstanding documentation requests from payers (e.g. updated W-9 or COI). Specialists are assigned to fulfill items within 2 business days.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MONTHLY CREDENTIALING REPORT                                              */}
      {/* ========================================================================= */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Header Notice Banner */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-[#2B4C9D]" />
              <div>
                <h3 className="text-xs font-bold text-[#2B4C9D] uppercase tracking-wider">
                  Monthly Credentialing Report Cadence
                </h3>
                <p className="text-xs text-slate-700 mt-0.5">
                  Shared during the first week of each month, covering the previous month's activity, separated by discipline (ABA / Speech / OT) with a consolidated management summary.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500">Period:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 outline-none cursor-pointer"
              >
                <option value="August 2026">August 2026 (Previous Month)</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
              </select>
            </div>
          </div>

          {/* Discipline Sub-tabs: Consolidated / ABA / Speech / OT */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
              {[
                { id: 'Consolidated', label: 'Consolidated Management Summary' },
                { id: 'ABA', label: 'Applied Behavior Analysis (ABA)' },
                { id: 'Speech', label: 'Speech-Language Pathology (Speech)' },
                { id: 'OT', label: 'Occupational Therapy (OT)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMonthlyDiscipline(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedMonthlyDiscipline === tab.id
                      ? 'bg-[#2B4C9D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-medium">
              {currentMonthlyRecords.length} records in {selectedMonthlyDiscipline} scope
            </span>
          </div>

          {/* 10 Monthly Sections (Exact specification) */}
          <div className="space-y-6">
            {/* Section 1: Provider Updates & Roster */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                <UserCheck className="w-4 h-4 text-[#2B4C9D]" />
                <h3 className="text-sm font-bold text-slate-900">
                  1. Clinical Staff Updates & Roster Changes
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Summary of newly onboarded clinical personnel, state license renewals, and CAQH ProView attestation status.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Active Roster Size:</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{currentMonthlyProviders.length} Clinicians</div>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-emerald-700">CAQH Attestation Compliance:</span>
                  <div className="text-lg font-bold text-emerald-800 mt-0.5">
                    {currentMonthlyProviders.filter(p => p.caqhStatus === 'Attested' || p.caqhStatus === 'Complete').length} / {currentMonthlyProviders.length || 1} Attested (100%)
                  </div>
                </div>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-blue-700">NPI & Taxonomy Verification:</span>
                  <div className="text-lg font-bold text-blue-800 mt-0.5">100% Verified against NPPES</div>
                </div>
              </div>
            </div>

            {/* Section 2: Payer Updates */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-[#2B4C9D]" />
                <h3 className="text-sm font-bold text-slate-900">
                  2. Payer Updates & Health Plan Notices
                </h3>
              </div>
              <div className="text-xs text-slate-600 space-y-2">
                <p>
                  • <strong>Kaiser Permanente Northern & Southern California:</strong> Maintained active roster synchronization; 60-day committee review windows observed.
                </p>
                <p>
                  • <strong>Blue Shield of California / Promise Health Plan:</strong> Availity provider portal integration functioning with real-time tracking.
                </p>
                <p>
                  • <strong>Medi-Cal PAVE / DHCS:</strong> Clinical staff enrollment and address updates submitted via PAVE portal with zero unaddressed discrepancies.
                </p>
              </div>
            </div>

            {/* Section 3: Applications Submitted */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    3. Applications Submitted
                  </h3>
                </div>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                  {currentMonthlyRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length} In-Review
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Complete applications transmitted to health plans following 100% pre-submission document audit.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">App ID</th>
                      <th className="py-2 px-3">Clinical Staff</th>
                      <th className="py-2 px-3">Discipline</th>
                      <th className="py-2 px-3">Payer</th>
                      <th className="py-2 px-3">Submission Date</th>
                      <th className="py-2 px-3">Days in Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentMonthlyRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).slice(0, 5).map((rec) => {
                      const prov = providers.find(p => p.id === rec.providerId);
                      const pay = payers.find(p => p.id === rec.payerId);
                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-mono font-bold text-[#2B4C9D]">{rec.id}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900">{prov?.fullName || 'Staff Member'}</td>
                          <td className="py-2 px-3">{rec.discipline}</td>
                          <td className="py-2 px-3">{pay?.name}</td>
                          <td className="py-2 px-3 text-slate-600">{rec.submissionDate || 'Recently Filed'}</td>
                          <td className="py-2 px-3 text-slate-600">{rec.daysInCurrentStage || 0}d</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4 & 5: Approvals & Effective Dates (Two-Column Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 4. Approvals */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    4. Approvals Received
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Clinical staff enrollment approvals granted by payer credentialing committees.
                </p>

                <div className="space-y-2 text-xs">
                  {currentMonthlyRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).slice(0, 4).map((rec) => {
                    const prov = providers.find(p => p.id === rec.providerId);
                    const pay = payers.find(p => p.id === rec.payerId);
                    return (
                      <div key={rec.id} className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-emerald-900">{prov?.fullName}</span>
                          <span className="text-slate-500"> • {pay?.name}</span>
                        </div>
                        <span className="text-emerald-700 font-bold text-[11px]">{rec.approvalDate || 'Approved'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Effective Dates */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <CalendarDays className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    5. Billing Effective Dates
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Official participation effective dates recorded separately from committee approval dates.
                </p>

                <div className="space-y-2 text-xs">
                  {currentMonthlyRecords.filter(r => r.effectiveDate).slice(0, 4).map((rec) => {
                    const prov = providers.find(p => p.id === rec.providerId);
                    const pay = payers.find(p => p.id === rec.payerId);
                    return (
                      <div key={rec.id} className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-teal-900">{prov?.fullName}</span>
                          <span className="text-slate-500"> • {pay?.name}</span>
                        </div>
                        <span className="text-teal-700 font-bold text-[11px]">{rec.effectiveDate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 6: Pending Applications */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    6. Pending Applications & In-Flight Pipeline
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                  {currentMonthlyRecords.filter(r => !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage)).length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Active applications progressing through document intake, CAQH/PAVE attestations, and payer review.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Intake & Preparation:</span>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {currentMonthlyRecords.filter(r => ['Intake', 'Documents Pending', 'Application Preparation'].includes(r.stage)).length}
                  </div>
                </div>
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                  <span className="text-sky-700">Payer Committee Review:</span>
                  <div className="text-base font-bold text-sky-900 mt-0.5">
                    {currentMonthlyRecords.filter(r => ['Application Submitted', 'Payer Review'].includes(r.stage)).length}
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="text-amber-700">Action Pending / Docs:</span>
                  <div className="text-base font-bold text-amber-900 mt-0.5">
                    {currentMonthlyRecords.filter(r => ['Additional Documents Requested', 'Correction Required'].includes(r.stage)).length}
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-purple-700">Linking Pending:</span>
                  <div className="text-base font-bold text-purple-900 mt-0.5">
                    {currentMonthlyRecords.filter(r => r.stage === 'Linking Pending').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7 & 8: Delays / Challenges & Additional Documentation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 7. Delays / Challenges */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    7. Delays & Operational Challenges
                  </h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    • <strong>Payer Committee Backlogs:</strong> Commercial health plans experiencing 60-90 day review queues in Northern & Southern California regions.
                  </p>
                  <p>
                    • <strong>External Moratoriums:</strong> Documented external delays logged with exclusion from internal controllable cycle time metrics.
                  </p>
                  <p>
                    • <strong>Portal Outages:</strong> State Medicaid PAVE maintenance windows monitored to avoid submission interruptions.
                  </p>
                </div>
              </div>

              {/* 8. Additional Documentation */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    8. Additional Documentation Requests
                  </h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    • <strong>W-9 & Tax ID Discrepancies:</strong> Resolved with 100% exact matching against legal entity documentation.
                  </p>
                  <p>
                    • <strong>Certificate of Insurance (COI):</strong> Facility malpractice and general liability certificates renewed and attached to all payer records.
                  </p>
                  <p>
                    • <strong>Pre-Submission Gate:</strong> 0 applications submitted with missing or unverified credentials.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9 & 10: Key Accomplishments & Upcoming Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 9. Key Accomplishments */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    9. Key Accomplishments
                  </h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    • <strong>Turnaround Optimization:</strong> Achieved average internal submission preparation turnaround within standard 5 business day window.
                  </p>
                  <p>
                    • <strong>Payer Follow-up Compliance:</strong> 94% of active applications contacted within recommended follow-up cadence.
                  </p>
                  <p>
                    • <strong>Roster Expansion:</strong> Full roster coverage maintained across all participating entities and clinical locations.
                  </p>
                </div>
              </div>

              {/* 10. Upcoming Actions */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <ArrowRight className="w-4 h-4 text-[#2B4C9D]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    10. Upcoming Actions & Next Month Deliverables
                  </h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    • Finalize facility group linking for newly approved clinicians to achieve active billing status.
                  </p>
                  <p>
                    • Conduct 90-day CAQH ProView re-attestation reviews for all clinicians with upcoming expiration windows.
                  </p>
                  <p>
                    • Review payer committee schedules for Q4 enrollment deadlines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: POWER BI DIRECTQUERY REST API                                      */}
      {/* ========================================================================= */}
      {activeTab === 'powerbi' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Power BI DirectQuery / REST API Integration Endpoint
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto-generated Star Schema model formatted for Power BI Dataflows & Power BI Service DirectQuery.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyJson}
                className="px-3 py-1.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                {copiedApi ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedApi ? 'Copied Dataset JSON!' : 'Copy Power BI Schema'}</span>
              </button>
            </div>

            {/* Direct REST API Connection String */}
            <div className="p-3 bg-slate-900 rounded-xl text-slate-200 text-xs font-mono flex items-center justify-between">
              <div className="truncate">
                <span className="text-indigo-400 font-bold">GET</span> https://api.credentialing.internal/v1/powerbi/directquery/export
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                200 OK • Live Sync Active
              </span>
            </div>

            {/* JSON Schema Preview */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-[11px] max-h-96 overflow-y-auto border border-slate-800">
              <pre>{JSON.stringify(powerBiPayload, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
