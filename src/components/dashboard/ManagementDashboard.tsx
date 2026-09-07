import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  TrendingUp, 
  ChevronRight, 
  AlertCircle,
  Users,
  Layers,
  ArrowRight,
  UserCheck,
  Briefcase,
  AlertTriangle,
  XCircle,
  BarChart3,
  Calendar,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Discipline, CredentialingStage } from '../../types';

interface ManagementDashboardProps {
  onSelectRecord?: (recordId: string) => void;
  onSelectProvider: (providerId: string) => void;
  onNavigateToTracker: (discipline?: Discipline) => void;
  onNavigateToLinking: () => void;
  onNavigateToLocations?: () => void;
  onOpenAddProvider?: () => void;
}

type DashboardViewTab = 'overall' | 'discipline' | 'payer' | 'specialist' | 'location';

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  onSelectRecord,
  onSelectProvider,
  onNavigateToTracker,
  onNavigateToLinking,
  onNavigateToLocations,
  onOpenAddProvider,
}) => {
  const { 
    kpis, 
    records, 
    providers, 
    payers, 
    entities, 
    locations, 
    users,
    filters, 
    setFilters,
    currentAccount
  } = useCredentialing();

  const [activeTab, setActiveTab] = useState<DashboardViewTab>('overall');
  const [selectedDisciplineTab, setSelectedDisciplineTab] = useState<'All' | 'ABA' | 'Speech' | 'OT'>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedAgingFilter, setSelectedAgingFilter] = useState<string | null>(null);

  // Filter records based on selected discipline tab
  const activeRecords = selectedDisciplineTab === 'All' 
    ? records 
    : records.filter(r => r.discipline === selectedDisciplineTab);

  const urgentRecords = activeRecords.filter(r => 
    r.isOverdue || r.stage === 'Action Required' || r.stage === 'Overdue' || r.stage === 'Additional Documents Requested' || r.stage === 'Correction Required'
  ).slice(0, 6);

  const recentRecords = [...activeRecords]
    .sort((a, b) => new Date(b.updatedAt || b.intakeDate).getTime() - new Date(a.updatedAt || a.intakeDate).getTime())
    .slice(0, 8);

  // Pipeline stages count
  const stageCounts: Record<CredentialingStage, number> = {
    'Intake': 0,
    'Documents Pending': 0,
    'Documents Complete': 0,
    'CAQH Pending': 0,
    'PAVE Pending': 0,
    'Application Preparation': 0,
    'Application Submitted': 0,
    'Payer Review': 0,
    'Additional Documents Requested': 0,
    'Correction Required': 0,
    'Resubmitted': 0,
    'Approved': 0,
    'Linking Pending': 0,
    'Linked': 0,
    'Effective': 0,
    'Closed / Not Contracted': 0,
    'Recredentialing Due': 0,
    'Overdue': 0,
  };

  activeRecords.forEach(r => {
    if (stageCounts[r.stage] !== undefined) {
      stageCounts[r.stage]++;
    }
  });

  const getStageBadgeColor = (stage: CredentialingStage) => {
    switch (stage) {
      case 'Effective':
      case 'Linked':
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Additional Documents Requested':
      case 'Correction Required':
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Application Submitted':
      case 'Resubmitted':
      case 'Payer Review':
        return 'bg-indigo-50 text-[#2B4C9D] border-indigo-200';
      case 'Linking Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDisciplinePill = (disc: Discipline) => {
    switch (disc) {
      case 'ABA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-[#E86424] border border-orange-200">ABA</span>;
      case 'Speech':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#2B4C9D] border border-blue-200">Speech</span>;
      case 'OT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#00A651] border border-emerald-200">OT</span>;
      default:
        return null;
    }
  };

  const displayName = currentAccount?.name || 'User';

  // -------------------------------------------------------------
  // 5.11.2 BY DISCIPLINE COMPUTATIONS
  // -------------------------------------------------------------
  const disciplinesList: Discipline[] = ['ABA', 'Speech', 'OT'];
  const disciplineStats = disciplinesList.map((disc) => {
    const discRecords = records.filter(r => r.discipline === disc);
    const discProviders = providers.filter(p => p.disciplines.includes(disc));
    const submitted = discRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
    const pending = discRecords.filter(r => ['Intake', 'Documents Pending', 'Documents Complete', 'CAQH Pending', 'PAVE Pending', 'Application Preparation', 'Linking Pending'].includes(r.stage)).length;
    const approved = discRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const requiringAction = discRecords.filter(r => ['Action Required', 'Additional Documents Requested', 'Correction Required', 'Overdue', 'Recredentialing Due'].includes(r.stage) || r.isOverdue).length;
    const overdue = discRecords.filter(r => r.isOverdue).length;
    const rejected = discRecords.filter(r => r.stage === 'Closed / Not Contracted').length;
    
    const cycleSum = discRecords.reduce((sum, r) => sum + (r.totalCycleDays || r.daysInCurrentStage || 0), 0);
    const avgCycle = discRecords.length > 0 ? Math.round(cycleSum / discRecords.length) : 0;
    const caqhAttested = discProviders.filter(p => p.caqhStatus === 'Attested' || p.caqhStatus === 'Complete').length;
    const caqhPct = discProviders.length > 0 ? Math.round((caqhAttested / discProviders.length) * 100) : 0;

    return {
      discipline: disc,
      name: disc === 'ABA' ? 'Applied Behavior Analysis (ABA)' : disc === 'Speech' ? 'Speech-Language Pathology (Speech)' : 'Occupational Therapy (OT)',
      totalProviders: discProviders.length,
      totalApplications: discRecords.length,
      submitted,
      pending,
      approved,
      requiringAction,
      overdue,
      rejected,
      avgCycleDays: avgCycle || 58,
      caqhAttestationPct: caqhPct,
      records: discRecords,
    };
  });

  // -------------------------------------------------------------
  // 5.11.3 BY PAYER COMPUTATIONS
  // -------------------------------------------------------------
  const payerStats = payers.map((payer) => {
    const payerRecords = records.filter(r => r.payerId === payer.id);
    const submitted = payerRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
    const pending = payerRecords.filter(r => ['Intake', 'Documents Pending', 'Documents Complete', 'CAQH Pending', 'PAVE Pending', 'Application Preparation', 'Payer Review', 'Additional Documents Requested', 'Correction Required', 'Linking Pending'].includes(r.stage)).length;
    const approved = payerRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const rejected = payerRecords.filter(r => r.stage === 'Closed / Not Contracted').length;
    
    const tatDays = payer.averageTatDays || 60;
    const overdueCount = payerRecords.filter(r => r.isOverdue).length;

    return {
      payer,
      totalApplications: payerRecords.length,
      submitted,
      pending,
      approved,
      rejected,
      averageTurnaroundDays: tatDays,
      overdueCount,
      records: payerRecords,
    };
  });

  // -------------------------------------------------------------
  // 5.11.4 BY SPECIALIST COMPUTATIONS
  // -------------------------------------------------------------
  // Extract unique specialists from records + accounts/users
  const specialistNames = Array.from(new Set([
    ...records.map(r => r.assignedSpecialistName).filter(Boolean),
    ...users.filter(u => u.role === 'Specialist' || u.role === 'Admin' || u.role === 'Manager').map(u => u.name),
  ]));

  const specialistStats = specialistNames.map((name, idx) => {
    const assignedRecords = records.filter(r => r.assignedSpecialistName === name);
    const completed = assignedRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const pending = assignedRecords.filter(r => !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage)).length;
    const overdue = assignedRecords.filter(r => r.isOverdue).length;
    const followUpsDue = assignedRecords.filter(r => r.nextFollowUpDate && !['Approved', 'Linked', 'Effective'].includes(r.stage)).length;

    return {
      id: `spec-${idx}`,
      name: name || 'Unassigned Specialist',
      assignedCount: assignedRecords.length,
      completed,
      pending,
      overdue,
      followUpsDue,
      records: assignedRecords,
      workloadPct: records.length > 0 ? Math.round((assignedRecords.length / records.length) * 100) : 0,
    };
  });

  // -------------------------------------------------------------
  // 5.11.5 BY LOCATION COMPUTATIONS
  // -------------------------------------------------------------
  const locationStats = locations.map((loc) => {
    const locRecords = records.filter(r => r.locationId === loc.id);
    const credentialedProviders = new Set(
      locRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).map(r => r.providerId)
    ).size;
    const pendingProviders = new Set(
      locRecords.filter(r => !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage)).map(r => r.providerId)
    ).size;

    const coveredPayers = new Set(
      locRecords.filter(r => ['Approved', 'Linked', 'Effective', 'Application Submitted', 'Payer Review'].includes(r.stage)).map(r => r.payerId)
    ).size;

    return {
      location: loc,
      totalApplications: locRecords.length,
      credentialedProviders,
      pendingProviders,
      payerCoverageCount: coveredPayers,
      isRecentAddition: !loc.effectiveDate || new Date(loc.effectiveDate).getFullYear() >= 2025,
      records: locRecords,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Section Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Management Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-[#2B4C9D] border border-indigo-100">
              {currentAccount?.accessLevel === 'ADMINISTRATOR' ? 'Administrator' : 'Specialist'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive oversight &bull; Real-time tracking across overall metrics, disciplines, payers, specialists, and locations.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold gap-1">
            <button
              onClick={() => setActiveTab('overall')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'overall'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overall</span>
            </button>

            <button
              onClick={() => setActiveTab('discipline')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'discipline'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>By Discipline</span>
            </button>

            <button
              onClick={() => setActiveTab('payer')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'payer'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>By Payer</span>
            </button>

            <button
              onClick={() => setActiveTab('specialist')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'specialist'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>By Specialist</span>
            </button>

            <button
              onClick={() => setActiveTab('location')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'location'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>By Location</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MANAGEMENT DASHBOARD — OVERALL VIEW                                   */}
      {/* ========================================================================= */}
      {activeTab === 'overall' && (
        <div className="space-y-6">
          {/* Discipline Filter Pills for Overall Tab */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500">Filter Scope:</span>
              <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs">
                {(['All', 'ABA', 'Speech', 'OT'] as const).map((disc) => (
                  <button
                    key={disc}
                    onClick={() => {
                      setSelectedDisciplineTab(disc);
                      setFilters(prev => ({ ...prev, discipline: disc }));
                    }}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      selectedDisciplineTab === disc
                        ? 'bg-slate-900 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {disc === 'All' ? 'All Disciplines' : disc}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigateToTracker()}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs"
            >
              <span>Open Master Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: 10 Overall Management KPI Cards (Exact specification) */}
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Overall Credentialing Pipeline Metrics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {/* 1. Total Providers */}
              <div 
                onClick={() => onSelectProvider('')} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Total Clinical Staff</span>
                  <div className="p-1.5 bg-blue-50 text-[#2B4C9D] rounded-lg group-hover:bg-[#2B4C9D] group-hover:text-white transition-colors">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedDisciplineTab === 'All' 
                      ? providers.length 
                      : providers.filter(p => p.disciplines.includes(selectedDisciplineTab)).length}
                  </span>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">Clinical roster</p>
                </div>
              </div>

              {/* 2. Total Applications */}
              <div 
                onClick={() => onNavigateToTracker()} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Total Applications</span>
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {activeRecords.length}
                  </span>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">All lifecycle stages</p>
                </div>
              </div>

              {/* 3. Applications Submitted */}
              <div 
                onClick={() => onNavigateToTracker()} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Applications Submitted</span>
                  <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-sky-700 tracking-tight">
                    {activeRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length}
                  </span>
                  <p className="text-[10.5px] text-sky-600/80 mt-0.5">In payer portals</p>
                </div>
              </div>

              {/* 4. Applications Pending */}
              <div 
                onClick={() => onNavigateToTracker()} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Applications Pending</span>
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-amber-700 tracking-tight">
                    {activeRecords.filter(r => ['Intake', 'Documents Pending', 'Documents Complete', 'CAQH Pending', 'PAVE Pending', 'Application Preparation', 'Linking Pending'].includes(r.stage)).length}
                  </span>
                  <p className="text-[10.5px] text-amber-600/80 mt-0.5">Pre-submission & linking</p>
                </div>
              </div>

              {/* 5. Applications Approved */}
              <div 
                onClick={() => onNavigateToTracker()} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Applications Approved</span>
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-emerald-700 tracking-tight">
                    {activeRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length}
                  </span>
                  <p className="text-[10.5px] text-emerald-600/80 mt-0.5">Approved & active</p>
                </div>
              </div>

              {/* 6. Applications Requiring Action */}
              <div 
                onClick={() => onNavigateToTracker()} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Requiring Action</span>
                  <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-orange-700 tracking-tight">
                    {activeRecords.filter(r => ['Action Required', 'Additional Documents Requested', 'Correction Required', 'Overdue', 'Recredentialing Due'].includes(r.stage) || r.isOverdue).length}
                  </span>
                  <p className="text-[10.5px] text-orange-600/80 mt-0.5">Action pending</p>
                </div>
              </div>

              {/* 7. Applications Overdue */}
              <div 
                onClick={() => onNavigateToTracker()} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Applications Overdue</span>
                  <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-2xl font-bold tracking-tight ${activeRecords.filter(r => r.isOverdue).length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeRecords.filter(r => r.isOverdue).length}
                  </span>
                  <p className="text-[10.5px] text-rose-600/80 mt-0.5">Lapsed follow-up date</p>
                </div>
              </div>

              {/* 8. Applications Rejected */}
              <div 
                onClick={() => onNavigateToTracker()} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Applications Rejected</span>
                  <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-slate-600 group-hover:text-white transition-colors">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-700 tracking-tight">
                    {activeRecords.filter(r => r.stage === 'Closed / Not Contracted').length}
                  </span>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">Closed / not contracted</p>
                </div>
              </div>

              {/* 9. Average Credentialing Cycle */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Average Credentialing Cycle</span>
                  <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-teal-700 tracking-tight">
                    {kpis.averageCredentialingCycleDays || 58} <span className="text-xs font-normal text-slate-500">Days</span>
                  </span>
                  <p className="text-[10.5px] text-teal-600/80 mt-0.5">Submission to approval</p>
                </div>
              </div>

              {/* 10. Provider Linking Rate */}
              <div 
                onClick={onNavigateToLinking} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Facility Group Linking</span>
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-purple-700 tracking-tight">
                    {kpis.providersLinked} <span className="text-xs font-normal text-slate-500">Linked</span>
                  </span>
                  <p className="text-[10.5px] text-purple-600/80 mt-0.5">{kpis.providersLinkingPending} pending link</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1.1: Aging Analysis (30 / 60 / 90 / 120+ days) (Exact specification) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#2B4C9D]" />
                  <span>Aging Analysis (30 / 60 / 90 / 120+ Days)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Turnaround tracking and queue distribution across standard payer processing windows.
                </p>
              </div>

              {selectedAgingFilter && (
                <button
                  onClick={() => setSelectedAgingFilter(null)}
                  className="text-xs text-[#2B4C9D] hover:underline font-semibold"
                >
                  Clear Aging Filter
                </button>
              )}
            </div>

            {/* Aging Bucket Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { 
                  id: '0-30', 
                  label: '0–30 Days', 
                  subtext: 'Fresh Submissions', 
                  count: kpis.agingBuckets.under30, 
                  color: 'text-emerald-700 bg-emerald-50/70 border-emerald-200 hover:border-emerald-400',
                  badge: 'bg-emerald-100 text-emerald-800'
                },
                { 
                  id: '31-60', 
                  label: '31–60 Days', 
                  subtext: 'Standard Review', 
                  count: kpis.agingBuckets.days31to60, 
                  color: 'text-sky-700 bg-sky-50/70 border-sky-200 hover:border-sky-400',
                  badge: 'bg-sky-100 text-sky-800'
                },
                { 
                  id: '61-90', 
                  label: '61–90 Days', 
                  subtext: 'Approaching SLA', 
                  count: kpis.agingBuckets.days61to90, 
                  color: 'text-amber-700 bg-amber-50/70 border-amber-200 hover:border-amber-400',
                  badge: 'bg-amber-100 text-amber-800'
                },
                { 
                  id: '91-120', 
                  label: '91–120 Days', 
                  subtext: 'Critical Aging', 
                  count: kpis.agingBuckets.days91to120, 
                  color: 'text-orange-700 bg-orange-50/70 border-orange-200 hover:border-orange-400',
                  badge: 'bg-orange-100 text-orange-800'
                },
                { 
                  id: '120+', 
                  label: '120+ Days', 
                  subtext: 'Urgent Escalation', 
                  count: kpis.agingBuckets.over120, 
                  color: 'text-rose-700 bg-rose-50/70 border-rose-200 hover:border-rose-400',
                  badge: 'bg-rose-100 text-rose-800'
                },
              ].map((bucket) => {
                const pct = activeRecords.length > 0 ? Math.round((bucket.count / activeRecords.length) * 100) : 0;
                const isSelected = selectedAgingFilter === bucket.id;

                return (
                  <div
                    key={bucket.id}
                    onClick={() => setSelectedAgingFilter(isSelected ? null : bucket.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${bucket.color} ${
                      isSelected ? 'ring-2 ring-offset-1 ring-[#2B4C9D] shadow-xs' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{bucket.label}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${bucket.badge}`}>{pct}%</span>
                    </div>
                    <div className="text-2xl font-bold tracking-tight mt-1">{bucket.count}</div>
                    <p className="text-[10.5px] opacity-80 mt-0.5">{bucket.subtext}</p>
                    
                    {/* Visual bar inside each card */}
                    <div className="w-full bg-slate-200/60 h-1 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-1 rounded-full bg-current" 
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline Stage Breakdown Flow */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#2B4C9D]" />
                <h2 className="text-sm font-bold text-slate-900">
                  Application Lifecycle Pipeline
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {activeRecords.length} active applications in workspace
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: 'Intake & Docs', count: stageCounts['Intake'] + stageCounts['Documents Pending'] + stageCounts['Documents Complete'], color: 'text-slate-700 bg-slate-50 border-slate-200' },
                { label: 'Preparation', count: stageCounts['Application Preparation'] + stageCounts['CAQH Pending'] + stageCounts['PAVE Pending'], color: 'text-blue-700 bg-blue-50/60 border-blue-200' },
                { label: 'Submitted', count: stageCounts['Application Submitted'] + stageCounts['Resubmitted'], color: 'text-indigo-700 bg-indigo-50/60 border-indigo-200' },
                { label: 'Payer Review', count: stageCounts['Payer Review'] + stageCounts['Additional Documents Requested'] + stageCounts['Correction Required'], color: 'text-purple-700 bg-purple-50/60 border-purple-200' },
                { label: 'Approved', count: stageCounts['Approved'], color: 'text-emerald-700 bg-emerald-50/60 border-emerald-200' },
                { label: 'Linked / Effective', count: stageCounts['Linked'] + stageCounts['Effective'] + stageCounts['Linking Pending'], color: 'text-teal-700 bg-teal-50/60 border-teal-200' },
              ].map((st, i) => (
                <div 
                  key={i} 
                  onClick={() => onNavigateToTracker()} 
                  className={`p-3 rounded-xl border text-center cursor-pointer hover:shadow-xs transition-all ${st.color}`}
                >
                  <p className="text-lg font-bold tracking-tight">{st.count}</p>
                  <p className="text-[11px] font-medium mt-0.5 truncate">{st.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Required & Recent Activity Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Action Required & Follow-up Due */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-[#E86424]" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Applications Requiring Action & Follow-ups Due
                  </h2>
                </div>
                <button
                  onClick={() => onNavigateToTracker()}
                  className="text-xs text-[#2B4C9D] font-medium hover:underline flex items-center space-x-1"
                >
                  <span>View in tracker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {urgentRecords.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-medium text-slate-600">All follow-ups are up to date</p>
                  <p className="text-[11px] mt-0.5">No overdue actions in the current filter selection.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {urgentRecords.map((rec) => {
                    const prov = providers.find(p => p.id === rec.providerId);
                    const pay = payers.find(p => p.id === rec.payerId);
                    return (
                      <div 
                        key={rec.id} 
                        onClick={() => onNavigateToTracker()}
                        className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-slate-900">
                              {prov?.fullName || 'Unknown Provider'}
                            </span>
                            {getDisciplinePill(rec.discipline)}
                            <span className="text-[11px] text-slate-500">
                              • {pay?.name || 'Payer'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {rec.nextAction || 'Pending payer status verification'}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStageBadgeColor(rec.stage)}`}>
                            {rec.stage}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Col: Entity & Discipline Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#2B4C9D]" />
                <h2 className="text-sm font-bold text-slate-900">
                  Entity Breakdown
                </h2>
              </div>

              {/* Legal Entities List */}
              <div className="space-y-3 pt-1">
                {(entities || []).map((entity) => {
                  const entityRecs = (records || []).filter(r => r.entityId === entity.id);
                  const pct = (records || []).length > 0 ? Math.round((entityRecs.length / records.length) * 100) : 0;

                  return (
                    <div key={entity.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700 truncate">{entity.legalName || entity.dba || entity.id}</span>
                        <span className="text-slate-500 font-semibold">{entityRecs.length} apps</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#2B4C9D] h-1.5 rounded-full" 
                          style={{ width: `${Math.max(5, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-3 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Discipline Distribution</p>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-[#E86424] font-medium">ABA: {records.filter(r => r.discipline === 'ABA').length}</span>
                  <span className="text-[#2B4C9D] font-medium">Speech: {records.filter(r => r.discipline === 'Speech').length}</span>
                  <span className="text-[#00A651] font-medium">OT: {records.filter(r => r.discipline === 'OT').length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Application Updates
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest provider enrollment and payer status changes across all entities.
                </p>
              </div>

              <button
                onClick={() => onNavigateToTracker()}
                className="text-xs font-semibold text-[#2B4C9D] hover:underline flex items-center space-x-1"
              >
                <span>View all tracker records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Clinical Staff</th>
                    <th className="py-3 px-4">Discipline</th>
                    <th className="py-3 px-4">Payer</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Current Stage</th>
                    <th className="py-3 px-4">Aging</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentRecords.map((rec) => {
                    const prov = providers.find(p => p.id === rec.providerId);
                    const pay = payers.find(p => p.id === rec.payerId);
                    const ent = entities.find(e => e.id === rec.entityId);

                    return (
                      <tr 
                        key={rec.id} 
                        onClick={() => onNavigateToTracker()}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {prov?.fullName || 'Unknown Provider'}
                        </td>
                        <td className="py-3 px-4">
                          {getDisciplinePill(rec.discipline)}
                        </td>
                        <td className="py-3 px-4">
                          {pay?.name || 'Payer'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 truncate max-w-[150px]">
                          {ent?.shortName || ent?.name || 'Entity'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStageBadgeColor(rec.stage)}`}>
                            {rec.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {rec.daysInCurrentStage || 0}d
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-[#2B4C9D] hover:underline font-semibold text-xs">
                            Open
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BY DISCIPLINE VIEW (ABA / Speech / OT)                                     */}
      {/* ========================================================================= */}
      {activeTab === 'discipline' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#2B4C9D]" />
                <span>Credentialing Metrics by Discipline</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted breakdown for Applied Behavior Analysis (ABA), Speech-Language Pathology (Speech), and Occupational Therapy (OT).
              </p>
            </div>
          </div>

          {/* 3 Discipline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {disciplineStats.map((stat) => (
              <div 
                key={stat.discipline} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{stat.name}</h3>
                    <span className="text-[11px] text-slate-500">{stat.totalProviders} Active Staff</span>
                  </div>
                  {getDisciplinePill(stat.discipline)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Total Applications</span>
                    <span className="text-lg font-bold text-slate-900">{stat.totalApplications}</span>
                  </div>
                  <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                    <span className="text-sky-700 text-[11px] block">Submitted / Review</span>
                    <span className="text-lg font-bold text-sky-800">{stat.submitted}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 text-[11px] block">Approved / Effective</span>
                    <span className="text-lg font-bold text-emerald-800">{stat.approved}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-amber-700 text-[11px] block">Pending / Prep</span>
                    <span className="text-lg font-bold text-amber-800">{stat.pending}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Average Cycle Time:</span>
                    <span className="font-bold text-slate-900">{stat.avgCycleDays} Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Requiring Action / Overdue:</span>
                    <span className={`font-bold ${stat.requiringAction > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {stat.requiringAction}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">CAQH Attestation Compliance:</span>
                    <span className="font-bold text-emerald-600">{stat.caqhAttestationPct}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToTracker(stat.discipline)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Filter Tracker for {stat.discipline}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Discipline Detailed Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Discipline Performance Comparison Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cross-discipline operational metrics, turnaround times, and linking readiness.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Discipline</th>
                    <th className="py-3 px-4 text-center">Clinicians</th>
                    <th className="py-3 px-4 text-center">Total Apps</th>
                    <th className="py-3 px-4 text-center">Submitted</th>
                    <th className="py-3 px-4 text-center">Pending</th>
                    <th className="py-3 px-4 text-center">Approved</th>
                    <th className="py-3 px-4 text-center">Action Req.</th>
                    <th className="py-3 px-4 text-center">Avg Cycle</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disciplineStats.map((stat) => (
                    <tr key={stat.discipline} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          {getDisciplinePill(stat.discipline)}
                          <span>{stat.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold">{stat.totalProviders}</td>
                      <td className="py-3.5 px-4 text-center font-bold">{stat.totalApplications}</td>
                      <td className="py-3.5 px-4 text-center text-sky-700 font-semibold">{stat.submitted}</td>
                      <td className="py-3.5 px-4 text-center text-amber-700 font-semibold">{stat.pending}</td>
                      <td className="py-3.5 px-4 text-center text-emerald-700 font-semibold">{stat.approved}</td>
                      <td className="py-3.5 px-4 text-center text-rose-600 font-bold">{stat.requiringAction}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">{stat.avgCycleDays}d</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onNavigateToTracker(stat.discipline)}
                          className="text-[#2B4C9D] hover:underline font-semibold"
                        >
                          View Tracker
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BY PAYER VIEW                                                             */}
      {/* ========================================================================= */}
      {activeTab === 'payer' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#2B4C9D]" />
                <span>Credentialing by Health Plan / Payer</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring submitted, pending, approved, and rejected volumes with historical average turnaround (TAT).
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search payer name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-[#2B4C9D] outline-none"
              />
            </div>
          </div>

          {/* Payers Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Health Plan / Payer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Submitted</th>
                    <th className="py-3 px-4 text-center">Pending</th>
                    <th className="py-3 px-4 text-center">Approved</th>
                    <th className="py-3 px-4 text-center">Rejected</th>
                    <th className="py-3 px-4 text-center">Avg Turnaround</th>
                    <th className="py-3 px-4 text-center">Overdue</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payerStats
                    .filter(p => !searchFilter || p.payer.name.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map((stat) => (
                      <tr key={stat.payer.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{stat.payer.name}</div>
                          <span className="text-[10.5px] text-slate-400">
                            {stat.payer.submissionMethod || 'Online Portal'} • Follow-up every {stat.payer.followUpCadenceDays || 7}d
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 text-slate-700">
                            {stat.payer.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-sky-700">
                          {stat.submitted}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-amber-700">
                          {stat.pending}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-emerald-700">
                          {stat.approved}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-500 font-semibold">
                          {stat.rejected}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                          {stat.averageTurnaroundDays} Days
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {stat.overdueCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              {stat.overdueCount} Overdue
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setFilters(prev => ({ ...prev, payerId: stat.payer.id }));
                              onNavigateToTracker();
                            }}
                            className="text-[#2B4C9D] hover:underline font-semibold inline-flex items-center space-x-1"
                          >
                            <span>View Apps</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BY SPECIALIST VIEW                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'specialist' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-[#2B4C9D]" />
                <span>Credentialing Specialist Workload & Pipeline</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specialist accountability &bull; Assigned applications, completed, pending, overdue, and scheduled follow-ups.
              </p>
            </div>
          </div>

          {/* Specialist Workload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialistStats.map((spec) => (
              <div 
                key={spec.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{spec.name}</h3>
                    <span className="text-[11px] text-slate-500">{spec.workloadPct}% of total workspace volume</span>
                  </div>
                  <div className="p-2 bg-indigo-50 text-[#2B4C9D] rounded-xl font-bold text-xs">
                    {spec.assignedCount} Apps
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 text-[11px] block">Completed (Approved)</span>
                    <span className="text-lg font-bold text-emerald-800">{spec.completed}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-amber-700 text-[11px] block">Pending in Pipeline</span>
                    <span className="text-lg font-bold text-amber-800">{spec.pending}</span>
                  </div>
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
                    <span className="text-rose-700 text-[11px] block">Overdue Follow-ups</span>
                    <span className={`text-lg font-bold ${spec.overdue > 0 ? 'text-rose-700' : 'text-slate-700'}`}>{spec.overdue}</span>
                  </div>
                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="text-blue-700 text-[11px] block">Follow-ups Due</span>
                    <span className="text-lg font-bold text-blue-800">{spec.followUpsDue}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToTracker()}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>View Specialist Queue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Specialist Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Specialist Production & Queue Audit
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Specialist / Owner</th>
                    <th className="py-3 px-4 text-center">Assigned Applications</th>
                    <th className="py-3 px-4 text-center">Completed</th>
                    <th className="py-3 px-4 text-center">Pending</th>
                    <th className="py-3 px-4 text-center">Overdue</th>
                    <th className="py-3 px-4 text-center">Follow-ups Due</th>
                    <th className="py-3 px-4 text-right">Workload Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {specialistStats.map((spec) => (
                    <tr key={spec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {spec.name}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">{spec.assignedCount}</td>
                      <td className="py-3.5 px-4 text-center text-emerald-700 font-semibold">{spec.completed}</td>
                      <td className="py-3.5 px-4 text-center text-amber-700 font-semibold">{spec.pending}</td>
                      <td className="py-3.5 px-4 text-center text-rose-600 font-bold">{spec.overdue}</td>
                      <td className="py-3.5 px-4 text-center text-blue-700 font-semibold">{spec.followUpsDue}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-semibold text-slate-700">{spec.workloadPct}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BY LOCATION VIEW                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#2B4C9D]" />
                <span>Credentialing by Clinical Location & In-Home Network</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Facility & in-home readiness &bull; Credentialed staff, pending staff, payer coverage, and location additions.
              </p>
            </div>
            {onNavigateToLocations && (
              <button
                onClick={onNavigateToLocations}
                className="px-3.5 py-1.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Manage & Add Locations</span>
              </button>
            )}
          </div>

          {/* Locations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Clinic / Practice Location</th>
                    <th className="py-3 px-4">Address / Entity</th>
                    <th className="py-3 px-4 text-center">Credentialed Staff</th>
                    <th className="py-3 px-4 text-center">Pending Staff</th>
                    <th className="py-3 px-4 text-center">Payer Coverage</th>
                    <th className="py-3 px-4 text-center">Location Addition Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {locationStats.map((stat) => (
                    <tr key={stat.location.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{stat.location.name}</div>
                        <span className="text-[10.5px] text-slate-400">
                          {stat.location.serviceTypes?.join(', ') || 'In-Clinic & Telehealth'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                        <div>{stat.location.address || `${stat.location.city}, ${stat.location.state}`}</div>
                        <span className="text-[10.5px] text-slate-400">{stat.location.dba || 'Primary Facility'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                        {stat.credentialedProviders}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-amber-700">
                        {stat.pendingProviders}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2B4C9D] font-bold text-[11px] border border-blue-100">
                          {stat.payerCoverageCount} Payers Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {stat.location.locationApprovalStatus || 'Approved / Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, locationId: stat.location.id }));
                            onNavigateToTracker();
                          }}
                          className="text-[#2B4C9D] hover:underline font-semibold inline-flex items-center space-x-1"
                        >
                          <span>View Roster</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
