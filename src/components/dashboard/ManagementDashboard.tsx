import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight, 
  AlertCircle,
  Plus,
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Discipline, CredentialingStage } from '../../types';

interface ManagementDashboardProps {
  onSelectRecord?: (recordId: string) => void;
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
  onOpenAddProvider,
}) => {
  const { 
    kpis, 
    records, 
    providers, 
    payers, 
    entities, 
    filters, 
    setFilters 
  } = useCredentialing();

  const [selectedDisciplineTab, setSelectedDisciplineTab] = useState<'All' | 'ABA' | 'Speech' | 'OT'>('All');

  // Filter records based on selected discipline tab
  const activeRecords = selectedDisciplineTab === 'All' 
    ? records 
    : records.filter(r => r.discipline === selectedDisciplineTab);

  const urgentRecords = activeRecords.filter(r => 
    r.isOverdue || r.stage === 'Action Required' || r.stage === 'Overdue'
  ).slice(0, 5);

  const recentRecords = [...activeRecords]
    .sort((a, b) => new Date(b.updatedAt || b.intakeDate).getTime() - new Date(a.updatedAt || a.intakeDate).getTime())
    .slice(0, 6);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Discipline Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Credentialing Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor provider enrollment, payer turnaround times, and linking status.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Discipline Selector */}
          <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            {(['All', 'ABA', 'Speech', 'OT'] as const).map((disc) => (
              <button
                key={disc}
                onClick={() => {
                  setSelectedDisciplineTab(disc);
                  setFilters(prev => ({ ...prev, discipline: disc }));
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDisciplineTab === disc
                    ? 'bg-[#2B4C9D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {disc === 'All' ? 'All Disciplines' : disc}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigateToTracker()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs"
          >
            <span>All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Clean Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Active Applications */}
        <div 
          onClick={() => onNavigateToTracker()} 
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Applications</span>
            <div className="p-2 bg-indigo-50 text-[#2B4C9D] rounded-xl group-hover:bg-[#2B4C9D] group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {kpis.activeApplications}
            </span>
            <span className="text-xs text-slate-500">
              in enrollment pipeline
            </span>
          </div>
        </div>

        {/* Metric 2: Total Clinical Providers */}
        <div 
          onClick={() => onSelectProvider('')} 
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Provider Roster</span>
            <div className="p-2 bg-emerald-50 text-[#00A651] rounded-xl group-hover:bg-[#00A651] group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {providers.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              100% NPI Verified
            </span>
          </div>
        </div>

        {/* Metric 3: Pending Provider Linking */}
        <div 
          onClick={onNavigateToLinking} 
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Facility Linking</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {kpis.pendingLinking}
            </span>
            <span className="text-xs text-amber-600 font-medium">
              Facility group ties
            </span>
          </div>
        </div>

        {/* Metric 4: Urgent & Overdue */}
        <div 
          onClick={() => onNavigateToTracker()} 
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Attention Required</span>
            <div className={`p-2 rounded-xl transition-colors ${
              kpis.applicationsOverdue > 0 ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' : 'bg-slate-50 text-slate-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-bold tracking-tight ${
              kpis.applicationsOverdue > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {kpis.applicationsOverdue}
            </span>
            <span className="text-xs text-slate-500">
              SLA overdue items
            </span>
          </div>
        </div>
      </div>

      {/* Streamlined Pipeline Stages Flow */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#2B4C9D]" />
            <h2 className="text-sm font-bold text-slate-900">
              Application Pipeline Stages
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {activeRecords.length} total active records
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

      {/* Two Column Layout: Action Items & Entity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Attention / Action Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#E86424]" />
              <h2 className="text-sm font-bold text-slate-900">
                Action Required & Follow-up Due
              </h2>
            </div>
            <button
              onClick={() => onNavigateToTracker()}
              className="text-xs text-[#2B4C9D] font-medium hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
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
              Entities & Coverage
            </h2>
          </div>

          {/* Legal Entities List */}
          <div className="space-y-3 pt-1">
            {entities.map((entity) => {
              const entityRecs = records.filter(r => r.entityId === entity.id);
              const pct = records.length > 0 ? Math.round((entityRecs.length / records.length) * 100) : 0;

              return (
                <div key={entity.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate">{entity.name}</span>
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
              <span className="text-[#E86424] font-medium">ABA Therapy: {records.filter(r => r.discipline === 'ABA').length}</span>
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
              Latest provider enrollment and payer status changes.
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
                <th className="py-3 px-4">Provider</th>
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
                      {rec.agingDays}d
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
  );
};
