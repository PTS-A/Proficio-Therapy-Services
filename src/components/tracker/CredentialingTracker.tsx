import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  ApplicationType, 
  CredentialingRecord, 
  CredentialingStage, 
  Discipline 
} from '../../types';
import { 
  AlertCircle, 
  AlertTriangle, 
  ArrowUpDown, 
  Bookmark, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  Eye, 
  Filter, 
  Grid, 
  Layers, 
  Link2, 
  ListFilter, 
  Plus, 
  RefreshCw, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Table, 
  UserCheck, 
  X 
} from 'lucide-react';
import { AdminApproveModal } from '../modals/AdminApproveModal';

interface CredentialingTrackerProps {
  onSelectRecord: (recordId: string) => void;
  onOpenNewApplication: () => void;
}

export const CredentialingTracker: React.FC<CredentialingTrackerProps> = ({
  onSelectRecord,
  onOpenNewApplication,
}) => {
  const {
    records,
    providers,
    payers,
    entities,
    locations,
    users,
    isAdmin,
    filters,
    setFilters,
    resetFilters,
    savedFilters,
    saveCurrentFilter,
    applySavedFilter,
    getFilteredRecords,
    stageConfigs,
  } = useCredentialing();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [saveFilterModalOpen, setSaveFilterModalOpen] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [adminApproveRecord, setAdminApproveRecord] = useState<CredentialingRecord | null>(null);

  const filteredRecords = getFilteredRecords();

  const STAGES: CredentialingStage[] = stageConfigs?.map((s) => s.name) || [
    'Intake',
    'Documents Pending',
    'Documents Complete',
    'CAQH Pending',
    'PAVE Pending',
    'Application Preparation',
    'Application Submitted',
    'Payer Review',
    'Additional Documents Requested',
    'Correction Required',
    'Resubmitted',
    'Approved',
    'Linking Pending',
    'Linked',
    'Effective',
    'Closed / Not Contracted',
    'Recredentialing Due',
    'Overdue',
  ];

  const APPLICATION_TYPES: ApplicationType[] = [
    'Initial credentialing',
    'Recredentialing',
    'Enrollment',
    'Re-enrollment',
    'Group addition',
    'Provider addition',
    'Location addition',
    'Provider linking',
    'Contracting',
    'Demographic update',
    'Taxonomy update',
    'Entity update',
  ];

  const getStageBadge = (stage: CredentialingStage, isOverdue: boolean) => {
    if (isOverdue || stage === 'Overdue') {
      return (
        <span className="inline-flex items-center space-x-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
          <ShieldAlert className="w-3 h-3 text-rose-700" />
          <span>{stage === 'Overdue' ? 'Overdue' : 'Overdue Follow-up'}</span>
        </span>
      );
    }

    switch (stage) {
      case 'Approved':
      case 'Linked':
      case 'Effective':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>{stage}</span>
          </span>
        );
      case 'Linking Pending':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
            <Link2 className="w-3 h-3 text-purple-700" />
            <span>Linking Pending</span>
          </span>
        );
      case 'CAQH Pending':
        return (
          <span className="inline-flex items-center space-x-1 bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
            <Layers className="w-3 h-3 text-indigo-700" />
            <span>CAQH Pending</span>
          </span>
        );
      case 'PAVE Pending':
        return (
          <span className="inline-flex items-center space-x-1 bg-violet-100 text-violet-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
            <Layers className="w-3 h-3 text-violet-700" />
            <span>PAVE Pending</span>
          </span>
        );
      case 'Resubmitted':
        return (
          <span className="inline-flex items-center space-x-1 bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
            <Clock className="w-3 h-3 text-indigo-700" />
            <span>Resubmitted</span>
          </span>
        );
      case 'Additional Documents Requested':
      case 'Correction Required':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            <span>{stage}</span>
          </span>
        );
      case 'Application Submitted':
      case 'Payer Review':
        return (
          <span className="inline-flex items-center space-x-1 bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-sky-200">
            <Clock className="w-3 h-3 text-sky-700" />
            <span>{stage}</span>
          </span>
        );
      case 'Recredentialing Due':
        return (
          <span className="inline-flex items-center space-x-1 bg-pink-100 text-pink-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-pink-200">
            <Calendar className="w-3 h-3 text-pink-700" />
            <span>Recredentialing Due</span>
          </span>
        );
      case 'Closed / Not Contracted':
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-200 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-300">
            <span>Closed / Not Contracted</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
            <span>{stage}</span>
          </span>
        );
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Application ID',
      'Provider Name',
      'NPI',
      'Discipline',
      'Payer Name',
      'Legal Entity',
      'Location',
      'Application Type',
      'Stage',
      'Intake Date',
      'Submission Date',
      'Next Follow-up Date',
      'Approval Date',
      'Effective Date',
      'Linking Status',
      'Assigned Specialist',
    ];

    const rows = filteredRecords.map((r) => {
      const provider = providers.find((p) => p.id === r.providerId);
      const payer = payers.find((p) => p.id === r.payerId);
      const entity = entities.find((e) => e.id === r.entityId);
      const location = locations.find((l) => l.id === r.locationId);

      return [
        `"${r.id}"`,
        `"${provider?.firstName || ''} ${provider?.lastName || ''}"`,
        `"${provider?.npi || ''}"`,
        `"${r.discipline}"`,
        `"${payer?.name || ''}"`,
        `"${entity?.legalName || ''}"`,
        `"${location?.name || ''}"`,
        `"${r.applicationType}"`,
        `"${r.stage}"`,
        `"${r.intakeDate}"`,
        `"${r.submissionDate || ''}"`,
        `"${r.nextFollowUpDate || ''}"`,
        `"${r.approvalDate || ''}"`,
        `"${r.effectiveDate || ''}"`,
        `"${r.linkingStatus}"`,
        `"${r.assignedSpecialistName}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Credentialing_Tracker_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#2B4C9D]" />
              <span>Provider × Payer Credentialing Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500">
              Showing <strong>{filteredRecords.length}</strong> of {records.length} applications
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-[#2B4C9D] shadow-xs font-bold' : 'text-slate-600'
                }`}
                title="Table View"
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-white text-[#2B4C9D] shadow-xs font-bold' : 'text-slate-600'
                }`}
                title="Kanban Board View"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            {/* Export */}
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* New Application */}
            <button
              onClick={onOpenNewApplication}
              className="bg-[#2B4C9D] hover:bg-[#223E80] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Free text search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search provider, NPI, payer, or APP-ID..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Discipline filter */}
          <div>
            <select
              value={filters.discipline}
              onChange={(e) => setFilters((prev) => ({ ...prev, discipline: e.target.value as Discipline | 'All' }))}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            >
              <option value="All">All Disciplines</option>
              <option value="ABA">ABA (Behavior Analysis)</option>
              <option value="Speech">Speech Therapy (SLP)</option>
              <option value="OT">Occupational Therapy (OT)</option>
            </select>
          </div>

          {/* Payer Filter */}
          <div>
            <select
              value={filters.payerId}
              onChange={(e) => setFilters((prev) => ({ ...prev, payerId: e.target.value }))}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Payers ({payers.length})</option>
              {payers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={filters.stage}
              onChange={(e) => setFilters((prev) => ({ ...prev, stage: e.target.value as CredentialingStage | 'All' }))}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            >
              <option value="All">All Workflow Stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Legal Entity Filter */}
          <div>
            <select
              value={filters.entityId}
              onChange={(e) => setFilters((prev) => ({ ...prev, entityId: e.target.value }))}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Legal Entities (3)</option>
              {entities.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.legalName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter Chips & Saved Filter Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, isOverdueOnly: !prev.isOverdueOnly }))}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                filters.isOverdueOnly
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Overdue Follow-ups</span>
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, needsActionOnly: !prev.needsActionOnly }))}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                filters.needsActionOnly
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Needs Attention / RFI</span>
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, linkingPendingOnly: !prev.linkingPendingOnly }))}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                filters.linkingPendingOnly
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Linking Pending</span>
            </button>

            {(filters.searchQuery ||
              filters.discipline !== 'All' ||
              filters.payerId !== 'All' ||
              filters.stage !== 'All' ||
              filters.entityId !== 'All' ||
              filters.isOverdueOnly ||
              filters.needsActionOnly ||
              filters.linkingPendingOnly) && (
              <button
                onClick={resetFilters}
                className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 underline text-xs ml-2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Saved Filters Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[11px]">Saved Views:</span>
            {savedFilters.map((sf) => (
              <button
                key={sf.id}
                onClick={() => applySavedFilter(sf)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700 transition-colors"
              >
                {sf.name}
              </button>
            ))}
            <button
              onClick={() => setSaveFilterModalOpen(true)}
              className="text-sky-600 hover:text-sky-800 text-[11px] font-semibold flex items-center space-x-0.5"
            >
              <Bookmark className="w-3 h-3" />
              <span>Save Current</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Filter Modal */}
      {saveFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white p-5 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Save Current Filter Preset</h3>
            <p className="text-xs text-slate-500 mt-1">Name this view for quick 1-click access later.</p>
            <input
              type="text"
              placeholder="e.g. My Urgent ABA Overdues"
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
              className="w-full mt-3 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setSaveFilterModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newFilterName.trim()) {
                    saveCurrentFilter(newFilterName.trim());
                    setNewFilterName('');
                    setSaveFilterModalOpen(false);
                  }
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg"
              >
                Save Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: DATA TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-3">Provider</th>
                  <th className="py-3 px-3">Discipline</th>
                  <th className="py-3 px-3">Payer & Type</th>
                  <th className="py-3 px-3">Legal Entity & Location</th>
                  <th className="py-3 px-3">Application Type</th>
                  <th className="py-3 px-3">Stage & SLA Status</th>
                  <th className="py-3 px-3">Next Follow-up</th>
                  <th className="py-3 px-3">Validation</th>
                  <th className="py-3 px-3">Specialist</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400">
                      No credentialing records match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => {
                    const provider = providers.find((p) => p.id === rec.providerId);
                    const payer = payers.find((p) => p.id === rec.payerId);
                    const entity = entities.find((e) => e.id === rec.entityId);
                    const location = locations.find((l) => l.id === rec.locationId);

                    const errorCount = rec.validationIssues.filter((i) => i.severity === 'Error').length;
                    const warningCount = rec.validationIssues.filter((i) => i.severity === 'Warning').length;

                    return (
                      <tr
                        key={rec.id}
                        onClick={() => onSelectRecord(rec.id)}
                        className={`hover:bg-sky-50/40 transition-colors cursor-pointer ${
                          rec.isOverdue ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        {/* ID */}
                        <td className="py-3 px-4 font-mono font-bold text-sky-700 whitespace-nowrap">
                          {rec.id}
                        </td>

                        {/* Provider */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-bold text-slate-900">
                            {provider ? `${provider.firstName} ${provider.lastName}` : 'Unknown Provider'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            NPI: {provider?.npi}
                          </div>
                        </td>

                        {/* Discipline */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.discipline === 'ABA'
                                ? 'bg-sky-100 text-sky-800'
                                : rec.discipline === 'Speech'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {rec.discipline}
                          </span>
                        </td>

                        {/* Payer */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{payer?.name}</div>
                          <div className="text-[10px] text-slate-400">{payer?.type}</div>
                        </td>

                        {/* Entity & Location */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="text-slate-800 font-medium truncate max-w-[160px]" title={entity?.legalName}>
                            {entity?.dba || entity?.legalName}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {location?.name} ({location?.city}, {location?.state})
                          </div>
                        </td>

                        {/* Application Type */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                          {rec.applicationType}
                        </td>

                        {/* Stage Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {getStageBadge(rec.stage, rec.isOverdue)}
                        </td>

                        {/* Next Follow-up */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {rec.nextFollowUpDate ? (
                            <div className="flex items-center space-x-1">
                              <span className={`font-semibold ${rec.isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                                {rec.nextFollowUpDate}
                              </span>
                              {rec.isOverdue && (
                                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">None Scheduled</span>
                          )}
                        </td>

                        {/* Entity / DBA Validation Status (FR-016) */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {errorCount > 0 ? (
                            <span className="inline-flex items-center space-x-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>{errorCount} Error{errorCount > 1 ? 's' : ''}</span>
                            </span>
                          ) : warningCount > 0 ? (
                            <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>{warningCount} Warning</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Validated</span>
                            </span>
                          )}
                        </td>

                        {/* Specialist */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                          {rec.assignedSpecialistName}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            {isAdmin && !['Approved', 'Linked', 'Effective'].includes(rec.stage) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAdminApproveRecord(rec);
                                }}
                                className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 text-xs font-bold border border-emerald-200"
                                title="Admin: Fast-Track Verify & Approve"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="hidden sm:inline">Approve</span>
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectRecord(rec.id);
                              }}
                              className="text-sky-600 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Open Credentialing Workspace"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: KANBAN PIPELINE */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {[
            { id: 'intake', title: '1. Intake & Prep', stages: ['Intake', 'Documents Pending', 'Documents Complete', 'Application Preparation'] },
            { id: 'submitted', title: '2. Submitted / Payer Review', stages: ['Application Submitted', 'Payer Review', 'Resubmitted'] },
            { id: 'action', title: '3. Action Required / RFI', stages: ['Additional Documents Requested', 'Correction Required'] },
            { id: 'linking', title: '4. Linking Pending', stages: ['Approved', 'Linking Pending'] },
            { id: 'effective', title: '5. Linked & Effective', stages: ['Linked', 'Effective'] },
          ].map((column) => {
            const colRecords = filteredRecords.filter((r) => column.stages.includes(r.stage));

            return (
              <div key={column.id} className="bg-slate-100/70 p-3 rounded-2xl border border-slate-200 flex flex-col max-h-[750px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
                  <h3 className="text-xs font-bold text-slate-800">{column.title}</h3>
                  <span className="bg-white text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                    {colRecords.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {colRecords.map((rec) => {
                    const provider = providers.find((p) => p.id === rec.providerId);
                    const payer = payers.find((p) => p.id === rec.payerId);
                    const entity = entities.find((e) => e.id === rec.entityId);

                    return (
                      <div
                        key={rec.id}
                        onClick={() => onSelectRecord(rec.id)}
                        className={`p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer ${
                          rec.isOverdue ? 'border-rose-300 ring-1 ring-rose-200' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-sky-700">{rec.id}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              rec.discipline === 'ABA'
                                ? 'bg-sky-100 text-sky-800'
                                : rec.discipline === 'Speech'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {rec.discipline}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-1.5">
                          {provider?.firstName} {provider?.lastName}
                        </h4>

                        <div className="text-[11px] text-slate-600 mt-1">
                          Payer: <strong className="text-slate-800">{payer?.name}</strong>
                        </div>

                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {entity?.dba || entity?.legalName}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          {getStageBadge(rec.stage, rec.isOverdue)}
                          <div className="flex items-center space-x-1">
                            {isAdmin && !['Approved', 'Linked', 'Effective'].includes(rec.stage) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAdminApproveRecord(rec);
                                }}
                                className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded text-[9px] font-bold border border-emerald-200"
                                title="Admin: Approve"
                              >
                                Approve
                              </button>
                            )}
                            <span className="text-slate-400 font-medium">{rec.assignedSpecialistName.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Approve Modal */}
      {adminApproveRecord && (
        <AdminApproveModal
          isOpen={!!adminApproveRecord}
          onClose={() => setAdminApproveRecord(null)}
          record={adminApproveRecord}
        />
      )}
    </div>
  );
};
