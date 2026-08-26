import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  Award, 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  FileText, 
  Filter, 
  Layers, 
  Link2, 
  ShieldAlert, 
  TrendingUp, 
  UserCheck, 
  Users,
  Activity,
  AlertCircle,
  Sparkles,
  Database,
  UserCog,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  HelpCircle,
  X
} from 'lucide-react';
import { Discipline } from '../../types';

interface ManagementDashboardProps {
  onSelectRecord: (recordId: string) => void;
  onSelectProvider: (providerId: string) => void;
  onNavigateToTracker: (discipline?: Discipline) => void;
  onNavigateToLinking: () => void;
  onOpenImportModal?: () => void;
  onOpenUserManagementModal?: () => void;
  onOpenAddProvider?: () => void;
}

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  onSelectRecord,
  onSelectProvider,
  onNavigateToTracker,
  onNavigateToLinking,
  onOpenImportModal,
  onOpenUserManagementModal,
  onOpenAddProvider,
}) => {
  const { 
    kpis, 
    records, 
    providers, 
    payers, 
    entities, 
    locations, 
    currentUser, 
    currentAccount, 
    isAdmin, 
    filters, 
    setFilters 
  } = useCredentialing();
  const [selectedDisciplineTab, setSelectedDisciplineTab] = useState<'All' | 'ABA' | 'Speech' | 'OT'>('All');
  const [showDemoGuide, setShowDemoGuide] = useState(true);

  // Filter records based on selected discipline tab for dashboard breakdown
  const activeRecords = selectedDisciplineTab === 'All' 
    ? records 
    : records.filter((r) => r.discipline === selectedDisciplineTab);

  // Aging Data for Recharts with Proficio Palette
  const agingChartData = [
    { name: '0-30 Days', count: kpis.agingBuckets.under30, fill: '#2B4C9D' },
    { name: '31-60 Days', count: kpis.agingBuckets.days31to60, fill: '#00A651' },
    { name: '61-90 Days', count: kpis.agingBuckets.days61to90, fill: '#F5A623' },
    { name: '91-120 Days', count: kpis.agingBuckets.days91to120, fill: '#E86424' },
    { name: '120+ Days', count: kpis.agingBuckets.over120, fill: '#DC2626' },
  ];

  // Discipline Breakdown with Proficio Color Accents
  const disciplineStats = [
    {
      discipline: 'ABA',
      title: 'Applied Behavior Analysis (BCBA)',
      total: records.filter((r) => r.discipline === 'ABA').length,
      approved: records.filter((r) => r.discipline === 'ABA' && ['Approved', 'Linked', 'Effective'].includes(r.stage)).length,
      inReview: records.filter((r) => r.discipline === 'ABA' && ['Application Submitted', 'Payer Review'].includes(r.stage)).length,
      overdue: records.filter((r) => r.discipline === 'ABA' && r.isOverdue).length,
      color: 'from-[#2B4C9D] to-[#1B3169]',
      badgeColor: 'bg-[#EEF2FF] text-[#2B4C9D] border-[#2B4C9D]/20',
    },
    {
      discipline: 'Speech',
      title: 'Speech-Language Pathology (SLP)',
      total: records.filter((r) => r.discipline === 'Speech').length,
      approved: records.filter((r) => r.discipline === 'Speech' && ['Approved', 'Linked', 'Effective'].includes(r.stage)).length,
      inReview: records.filter((r) => r.discipline === 'Speech' && ['Application Submitted', 'Payer Review'].includes(r.stage)).length,
      overdue: records.filter((r) => r.discipline === 'Speech' && r.isOverdue).length,
      color: 'from-[#00A651] to-[#047857]',
      badgeColor: 'bg-[#ECFDF5] text-[#00A651] border-[#00A651]/20',
    },
    {
      discipline: 'OT',
      title: 'Occupational Therapy (OTR/L)',
      total: records.filter((r) => r.discipline === 'OT').length,
      approved: records.filter((r) => r.discipline === 'OT' && ['Approved', 'Linked', 'Effective'].includes(r.stage)).length,
      inReview: records.filter((r) => r.discipline === 'OT' && ['Application Submitted', 'Payer Review'].includes(r.stage)).length,
      overdue: records.filter((r) => r.discipline === 'OT' && r.isOverdue).length,
      color: 'from-[#E86424] to-[#C2410C]',
      badgeColor: 'bg-[#FFF7ED] text-[#E86424] border-[#E86424]/20',
    },
  ];

  // Stage Distribution Donut Data
  const stagesCount: Record<string, number> = {};
  records.forEach((r) => {
    stagesCount[r.stage] = (stagesCount[r.stage] || 0) + 1;
  });

  const stagePieData = Object.entries(stagesCount).map(([name, value]) => ({
    name,
    value,
  }));

  const STAGE_COLORS: Record<string, string> = {
    'Intake': '#94A3B8',
    'Documents Pending': '#CBD5E1',
    'Documents Complete': '#93C5FD',
    'Application Preparation': '#60A5FA',
    'Application Submitted': '#2B4C9D',
    'Payer Review': '#1D4ED8',
    'Additional Documents Requested': '#F5A623',
    'Approved': '#00A651',
    'Linking Pending': '#E86424',
    'Linked': '#059669',
    'Effective': '#047857',
    'Recredentialing Due': '#D946EF',
    'Overdue': '#DC2626',
  };

  // Top urgent action items
  const overdueRecords = records.filter((r) => r.isOverdue);
  const linkingPendingRecords = records.filter((r) => r.stage === 'Linking Pending' || r.linkingStatus === 'Pending Approval');
  const expiringProviders = providers.filter((p) => {
    if (!p.licenseExpiration) return false;
    const expDate = new Date(p.licenseExpiration);
    const now = new Date();
    const diffDays = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 60 && diffDays > 0;
  });

  // Top Payers Table
  const topPayers = payers.slice(0, 8).map((payer) => {
    const payerRecords = records.filter((r) => r.payerId === payer.id);
    const approvedCount = payerRecords.filter((r) => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const pendingCount = payerRecords.filter((r) => !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage)).length;
    return {
      ...payer,
      totalApps: payerRecords.length,
      approvedCount,
      pendingCount,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner & Scope Context with Proficio Navy & Brand Accents */}
      <div className="bg-gradient-to-r from-[#111E42] via-[#1B3169] to-[#2B4C9D] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#00A651]/20 text-[#00A651] border border-[#00A651]/40">
                Proficio Therapy Executive Overview
              </span>
              <span className="text-slate-300 text-xs">• Active Role: {currentUser.role}</span>
            </div>
            <h2 className="text-2xl font-black mt-2 tracking-tight text-white">
              Provider Credentialing & Payer Enrollment Oversight
            </h2>
            <p className="text-sm text-slate-200 max-w-3xl mt-1 leading-relaxed">
              Standardized lifecycle management across <strong>Proficio Therapy (EdTheory)</strong>, <strong>Ages Learning Solutions</strong>, and <strong>Child's Play Therapy Services</strong> for 20+ commercial & Medicaid health plans.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onNavigateToTracker()}
              className="bg-[#00A651] hover:bg-[#059669] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-[#00A651]/30 transition-all cursor-pointer"
            >
              <span>View Active Pipeline</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SLA Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <div className="text-slate-400 flex items-center justify-between">
              <span>SLA-001: 5-Day Submission</span>
              <span className="text-[10px] font-semibold text-emerald-400">Target: 95%</span>
            </div>
            <div className="text-xl font-bold text-white mt-1 flex items-baseline space-x-1.5">
              <span>{kpis.submissionEfficiencyRate}%</span>
              <span className="text-xs text-emerald-400 font-semibold">✓ Compliant</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <div className="text-slate-400 flex items-center justify-between">
              <span>SLA-002: Follow-up Cadence</span>
              <span className="text-[10px] font-semibold text-sky-400">7-10 Days</span>
            </div>
            <div className="text-xl font-bold text-white mt-1 flex items-baseline space-x-1.5">
              <span>{kpis.followUpComplianceRate}%</span>
              <span className="text-xs text-sky-400 font-semibold">On Track</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <div className="text-slate-400 flex items-center justify-between">
              <span>SLA-003: Avg Credentialing Cycle</span>
              <span className="text-[10px] font-semibold text-amber-400">60-90 Days</span>
            </div>
            <div className="text-xl font-bold text-white mt-1 flex items-baseline space-x-1.5">
              <span>{kpis.averageCredentialingCycleDays} Days</span>
              <span className="text-xs text-slate-300 font-normal">Payer TAT</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <div className="text-slate-400 flex items-center justify-between">
              <span>SLA-007: Zero Expired Creds</span>
              <span className="text-[10px] font-semibold text-emerald-400">Target: Zero</span>
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1 flex items-baseline space-x-1.5">
              <span>100% Gated</span>
              <span className="text-xs text-emerald-300 font-semibold">Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Account & System Showcase Banner (Interactive Guide) */}
      {showDemoGuide && (
        <div className="bg-white border-2 border-[#2B4C9D]/30 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#EEF2FF] text-[#2B4C9D] rounded-xl border border-[#2B4C9D]/20">
                <Sparkles className="w-5 h-5 text-[#E86424]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black text-slate-900">
                    Administrator Demo Showcase — How This System Works
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active Demo Account: {currentAccount?.email || 'demo@proficiotherapy.com'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  This system replaces fragmented Excel tracking sheets with an enterprise multi-entity credentialing hub.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDemoGuide(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              title="Dismiss Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Feature 1: Two Access Levels */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-[#2B4C9D]" />
                <span>1. Role-Based Access Control</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                • <strong>ADMINISTRATOR:</strong> Full privileges to ADD, DELETE, MODIFY providers, import spreadsheets, and manage user accounts.<br />
                • <strong>USER:</strong> Operational staff access to process applications and track follow-ups.
              </p>
              {onOpenUserManagementModal && isAdmin && (
                <button
                  type="button"
                  onClick={onOpenUserManagementModal}
                  className="mt-1 text-[11px] text-[#2B4C9D] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span>Open User Management</span>
                </button>
              )}
            </div>

            {/* Feature 2: Excel Bulk Ingestion */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>2. Excel Spreadsheet Bulk Import</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Upload legacy `.xlsx` or `.csv` files for <strong>Provider Rosters</strong>, <strong>Applications Trackers</strong>, and <strong>Payers</strong>. Automatic field mapping and validation gating.
              </p>
              {onOpenImportModal && (
                <button
                  type="button"
                  onClick={onOpenImportModal}
                  className="mt-1 text-[11px] text-emerald-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Launch Excel Ingestion Tool</span>
                </button>
              )}
            </div>

            {/* Feature 3: Provider Master & Gated Controls */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <Users className="w-4 h-4 text-[#E86424]" />
                <span>3. Provider Master & 360° Management</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Add, modify, and delete clinical providers across <strong>ABA</strong>, <strong>Speech</strong>, and <strong>OT</strong>. Real-time NPPES NPI checks, CAQH attestation, and PAVE tracking.
              </p>
              {onOpenAddProvider && isAdmin && (
                <button
                  type="button"
                  onClick={onOpenAddProvider}
                  className="mt-1 text-[11px] text-[#E86424] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Provider Record</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div 
          onClick={() => onNavigateToTracker()}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Applications</span>
            <FileText className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{kpis.totalApplications}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 3 legal entities</div>
        </div>

        <div 
          onClick={() => {
            setFilters((prev) => ({ ...prev, stage: 'Application Submitted' }));
            onNavigateToTracker();
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Submitted to Payers</span>
            <Activity className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-sky-700 mt-2">{kpis.applicationsSubmitted}</div>
          <div className="text-[11px] text-slate-500 mt-1">Under formal review</div>
        </div>

        <div 
          onClick={() => {
            setFilters((prev) => ({ ...prev, stage: 'Approved' }));
            onNavigateToTracker();
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Approved Records</span>
            <CheckCircle className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{kpis.applicationsApproved}</div>
          <div className="text-[11px] text-slate-500 mt-1">{kpis.providersLinked} Fully Linked & Effective</div>
        </div>

        <div 
          onClick={() => onNavigateToLinking()}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Linking Pending (FR-014)</span>
            <Link2 className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{kpis.providersLinkingPending}</div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">Approved, billing pending</div>
        </div>

        <div 
          onClick={() => {
            setFilters((prev) => ({ ...prev, isOverdueOnly: true }));
            onNavigateToTracker();
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Overdue Follow-ups</span>
            <ShieldAlert className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{kpis.applicationsOverdue}</div>
          <div className="text-[11px] text-rose-700 font-bold mt-1">Requires Immediate Action</div>
        </div>

        <div 
          onClick={() => {
            setFilters((prev) => ({ ...prev, needsActionOnly: true }));
            onNavigateToTracker();
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Action Required</span>
            <AlertCircle className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-2">{kpis.applicationsRequiringAction}</div>
          <div className="text-[11px] text-slate-500 mt-1">RFIs, Recreds & Prep</div>
        </div>
      </div>

      {/* Discipline Segments (ABA, Speech, OT) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Discipline Breakdown & Performance</span>
            </h3>
            <p className="text-xs text-slate-500">Tracking progress by clinical specialty</p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['All', 'ABA', 'Speech', 'OT'] as ('All' | 'ABA' | 'Speech' | 'OT')[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedDisciplineTab(tab)}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedDisciplineTab === tab
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'All' ? 'All Disciplines' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {disciplineStats.map((d) => (
            <div
              key={d.discipline}
              onClick={() => onNavigateToTracker(d.discipline as Discipline)}
              className="bg-slate-50 hover:bg-white rounded-xl p-4 border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${d.badgeColor}`}>
                  {d.discipline}
                </span>
                <span className="text-xs font-semibold text-slate-500">{d.total} Applications</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mt-2 group-hover:text-sky-700 transition-colors">
                {d.title}
              </h4>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/60 text-center">
                <div className="bg-white p-2 rounded-lg border border-slate-200/50">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Approved</div>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5">{d.approved}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/50">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">In Review</div>
                  <div className="text-sm font-bold text-sky-600 mt-0.5">{d.inReview}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/50">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Overdue</div>
                  <div className={`text-sm font-bold mt-0.5 ${d.overdue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                    {d.overdue}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts & Aging Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Aging Analysis Bar Chart (Section 5.11.1) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Application Aging Analysis (Cycle Days)</span>
                </h3>
                <p className="text-xs text-slate-500">Distribution of active records by duration since intake</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Total: {kpis.totalApplications} Active
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-5 gap-2 text-center text-xs">
            {agingChartData.map((bucket) => (
              <div key={bucket.name} className="p-2 rounded-lg bg-slate-50">
                <div className="text-[11px] text-slate-500 font-medium">{bucket.name}</div>
                <div className="text-sm font-black text-slate-800 mt-0.5">{bucket.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Funnel / Donut Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-sky-600" />
                <span>Workflow Stage Distribution</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Standardized stages across all payer workflows</p>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stagePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stagePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
            {stagePieData.slice(0, 6).map((item) => (
              <div key={item.name} className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-50">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: STAGE_COLORS[item.name] || '#94a3b8' }}
                />
                <span className="text-[11px] text-slate-700 truncate flex-1">{item.name}</span>
                <span className="text-xs font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Center: Overdue Follow-ups & Expiring Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Queue & Follow-up Tracker */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Overdue Follow-up Queue (SLA Breach)</h3>
                <p className="text-xs text-slate-500">Automated escalations sent to Manager & Leadership</p>
              </div>
            </div>
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {overdueRecords.length} Overdue
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {overdueRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                <span>All scheduled follow-ups are up to date!</span>
              </div>
            ) : (
              overdueRecords.map((rec) => {
                const provider = providers.find((p) => p.id === rec.providerId);
                const payer = payers.find((p) => p.id === rec.payerId);

                return (
                  <div
                    key={rec.id}
                    onClick={() => onSelectRecord(rec.id)}
                    className="p-3 bg-rose-50/60 hover:bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-rose-950">{rec.id}</span>
                        <span className="text-xs font-semibold text-slate-800">
                          {provider?.firstName} {provider?.lastName}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                          {rec.discipline}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center space-x-2">
                        <span>Payer: <strong>{payer?.name}</strong></span>
                        <span>•</span>
                        <span className="text-rose-700 font-semibold">
                          Follow-up due: {rec.nextFollowUpDate}
                        </span>
                      </div>
                    </div>

                    <button className="bg-white hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0">
                      Log Follow-up
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Expiring Licenses & CAQH Attestation Deadlines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Credential Expiration & CAQH Monitor</h3>
                <p className="text-xs text-slate-500">Proactive alerts to maintain continuous in-network status</p>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {expiringProviders.length} Warning(s)
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {expiringProviders.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProvider(p.id)}
                className="p-3 bg-amber-50/60 hover:bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">
                      {p.firstName} {p.lastName}, {p.credentials}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200/60 text-amber-900">
                      {p.providerType}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center space-x-2">
                    <span>License: <strong>{p.licenseNumber}</strong></span>
                    <span>•</span>
                    <span className="text-amber-800 font-bold">
                      Expires: {p.licenseExpiration}
                    </span>
                  </div>
                </div>

                <button className="bg-white hover:bg-amber-600 hover:text-white text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0">
                  Update License
                </button>
              </div>
            ))}

            {providers.filter((p) => p.caqhStatus === 'Re-attestation Due').map((p) => (
              <div
                key={`caqh-${p.id}`}
                onClick={() => onSelectProvider(p.id)}
                className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">
                      {p.firstName} {p.lastName}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-200 text-sky-900">
                      CAQH Attestation Due
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    CAQH ID: <strong>{p.caqhId}</strong> • Profile attestation required immediately
                  </div>
                </div>

                <button className="bg-white hover:bg-sky-600 hover:text-white text-sky-800 border border-sky-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0">
                  Verify CAQH
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payer Performance & TAT Summary Table (Section 5.11.3) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Building className="w-4 h-4 text-sky-600" />
              <span>Payer Turnaround & Network Matrix (Top 8 Active)</span>
            </h3>
            <p className="text-xs text-slate-500">Configured SLA Turnaround Times vs Actual Submissions</p>
          </div>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Payer / Network</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Submission Method</th>
                <th className="py-2.5 px-3 text-center">Avg Target TAT</th>
                <th className="py-2.5 px-3 text-center">Active Apps</th>
                <th className="py-2.5 px-3 text-center">Approved</th>
                <th className="py-2.5 px-3 text-center">Pending Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topPayers.map((payer) => (
                <tr key={payer.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {payer.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {payer.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {payer.submissionMethod}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-800">
                    {payer.averageTatDays} Days
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                    {payer.totalApps}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                    {payer.approvedCount}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-sky-600">
                    {payer.pendingCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
