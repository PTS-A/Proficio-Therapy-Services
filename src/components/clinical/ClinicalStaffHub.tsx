import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  Award,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { LegalEntity, Provider, Payer, ClinicalStaffComment } from '../../types';

interface ClinicalStaffHubProps {
  onSelectProviderId?: (providerId: string) => void;
  onOpenNewApplication?: () => void;
}

export const ClinicalStaffHub: React.FC<ClinicalStaffHubProps> = ({
  onSelectProviderId,
  onOpenNewApplication,
}) => {
  const { 
    entities, 
    providers, 
    payers, 
    records, 
    currentAccount,
    addToast,
    clinicalComments,
    addClinicalComment,
    updateProviderCredentialing
  } = useCredentialing();

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'matrix' | 'comments'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');

  // Edit provider credentialing modal
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [providerPayerStates, setProviderPayerStates] = useState<Record<string, { status: string; effectiveDate?: string }>>({});
  const [isSavingProvider, setIsSavingProvider] = useState(false);

  // New comment box
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) || null;

  // Filter providers belonging to selected entity
  const entityProviders = (providers || []).filter((p) => {
    if (!selectedEntityId) return true;
    return (
      p.primaryEntityId === selectedEntityId || 
      p.entityIds?.includes(selectedEntityId) || 
      (p as any).renderingEntityIds?.includes(selectedEntityId)
    );
  });

  const filteredProviders = entityProviders.filter((p) => {
    if (selectedDiscipline !== 'ALL') {
      const hasDiscipline = (p.disciplines && p.disciplines.includes(selectedDiscipline as any)) || (p as any).discipline === selectedDiscipline;
      if (!hasDiscipline) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${p.firstName} ${p.lastName}`.toLowerCase().includes(q);
      const matchNpi = p.npi?.toLowerCase().includes(q);
      const matchEmail = p.email?.toLowerCase().includes(q);
      if (!matchName && !matchNpi && !matchEmail) return false;
    }
    return true;
  });

  // Calculate credentialed payers for a provider from records and provider profiles
  const getProviderCredentialedPayers = (providerId: string): string[] => {
    const credRecords = (records || []).filter(
      (r) => r.providerId === providerId && (r.status === 'Approved' || r.stageId === 'stg-08' || r.stageId === 'stg-09')
    );
    const fromRecords = credRecords.map((r) => r.payerId);
    const provider = providers.find((p) => p.id === providerId);
    const fromProfile = (provider as any)?.credentialedPayerIds || [];
    return Array.from(new Set([...fromRecords, ...fromProfile]));
  };

  const handleOpenEditProvider = (provider: Provider) => {
    setEditingProvider(provider);
    const credentialedList = getProviderCredentialedPayers(provider.id);
    const initialMap: Record<string, { status: string; effectiveDate?: string }> = {};

    payers.forEach((pyr) => {
      const isCred = credentialedList.includes(pyr.id);
      const rec = records.find((r) => r.providerId === provider.id && r.payerId === pyr.id);
      initialMap[pyr.id] = {
        status: isCred ? 'Credentialed' : rec?.status || 'Not Enrolled',
        effectiveDate: rec?.effectiveDate || '',
      };
    });

    setProviderPayerStates(initialMap);
  };

  const handleSaveProviderCredentials = async () => {
    if (!editingProvider) return;
    setIsSavingProvider(true);
    try {
      const credentialedPayerIds = Object.entries(providerPayerStates)
        .filter(([_, state]: [string, any]) => state?.status === 'Credentialed')
        .map(([payerId]) => payerId);

      await updateProviderCredentialing(editingProvider.id, {
        credentialedPayerIds,
        payerEnrollments: providerPayerStates,
      });

      addToast(`Updated insurance credentialing roster for ${editingProvider.firstName} ${editingProvider.lastName}.`, 'success');
      setEditingProvider(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to update credentials in Supabase', 'error');
    } finally {
      setIsSavingProvider(false);
    }
  };

  const handlePostComment = async () => {
    if (!newCommentText.trim() || !selectedEntityId) return;
    setIsPostingComment(true);
    try {
      await addClinicalComment({
        entityId: selectedEntityId,
        authorId: currentAccount?.id || 'system',
        authorName: currentAccount?.name || 'Credentialing Specialist',
        authorRole: currentAccount?.roleTitle || currentAccount?.systemRole || 'Credentialing Specialist',
        authorEmail: currentAccount?.email || '',
        content: newCommentText.trim(),
      });
      setNewCommentText('');
      addToast('Credentialing comment recorded successfully.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to post note', 'error');
    } finally {
      setIsPostingComment(false);
    }
  };

  const entityComments = (clinicalComments || []).filter(
    (c) => c.entityId === selectedEntityId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* If No Entity is Selected: Show the 3 Entities Greeting Screen */}
      {!selectedEntityId ? (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-200 backdrop-blur-xs mb-3">
                <Users className="w-3.5 h-3.5 text-blue-300" />
                <span>Multi-Entity Clinical Governance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Clinical Staff &amp; Healthcare Entities
              </h1>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Welcome to the Centralized Clinical Roster. Select an entity below to review employee rosters, insurance credentialing statuses, cross-payer matrices, and staff notes.
              </p>
            </div>
          </div>

          {/* 3 Entity Greeting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entities.map((entity) => {
              const entityProvidersList = (providers || []).filter(
                (p) => p.primaryEntityId === entity.id || p.renderingEntityIds?.includes(entity.id)
              );
              const entityRecords = (records || []).filter(
                (r) => r.entityId === entity.id
              );
              const activeCount = entityRecords.filter((r) => r.status === 'Approved').length;

              return (
                <div
                  key={entity.id}
                  onClick={() => setSelectedEntityId(entity.id)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold">
                        Active Entity
                      </span>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                        {entity.legalName}
                      </h2>
                      {entity.dba && entity.dba !== entity.legalName && (
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">
                          DBA: {entity.dba}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {entity.id === 'ent-1'
                          ? 'Silicon Valley & Northern California Applied Behavior Analysis (ABA) Network.'
                          : entity.id === 'ent-2'
                          ? 'Pediatric Speech-Language Pathology & Occupational Therapy Clinical Hub.'
                          : 'Comprehensive Pediatric & Sensory Integration Clinical Practice.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-slate-400 text-[11px] block">Clinicians</span>
                        <span className="text-base font-bold text-slate-800">{entityProvidersList.length}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-slate-400 text-[11px] block">Insurances Linked</span>
                        <span className="text-base font-bold text-emerald-600">{activeCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2B4C9D] group-hover:text-indigo-700">
                    <span>View Roster &amp; Insurance Matrix</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Entity Detail Workspace */
        <div className="space-y-6">
          {/* Entity Top Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedEntityId(null)}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
                  title="Back to All Entities"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-slate-900">
                      {selectedEntity?.legalName}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      {selectedEntity?.dba}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-3">
                    <span>EIN: <strong className="font-mono text-slate-700">{selectedEntity?.ein || '94-XXXXXXX'}</strong></span>
                    <span>&bull;</span>
                    <span>Contact: <strong className="text-slate-700">{selectedEntity?.primaryContact || 'Credentialing Office'}</strong></span>
                    <span>&bull;</span>
                    <span>Phone: <strong className="text-slate-700">{selectedEntity?.phone || '(925) 555-0100'}</strong></span>
                  </p>
                </div>
              </div>

              {/* Quick switch to another entity */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {entities.map((e) => (
                    <option key={e.id} value={e.id}>{e.dba || e.legalName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Entity Navigation Tabs */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveSubTab('roster')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSubTab === 'roster'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Employee Roster ({entityProviders.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('matrix')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSubTab === 'matrix'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Insurance Credentialing Matrix ({payers.length} Payers)</span>
              </button>

              <button
                onClick={() => setActiveSubTab('comments')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSubTab === 'comments'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Credentialing Notes &amp; Comments ({entityComments.length})</span>
              </button>
            </div>
          </div>

          {/* SUBTAB 1: EMPLOYEE ROSTER */}
          {activeSubTab === 'roster' && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative min-w-[220px] flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search clinicians by name, NPI, or email..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                    />
                  </div>

                  {/* Discipline selector */}
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    {(['ALL', 'ABA', 'Speech', 'OT'] as const).map((disc) => (
                      <button
                        key={disc}
                        onClick={() => setSelectedDiscipline(disc)}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          selectedDiscipline === disc ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {disc}
                      </button>
                    ))}
                  </div>
                </div>

                {onOpenNewApplication && (
                  <button
                    onClick={onOpenNewApplication}
                    className="px-3.5 py-2 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Credentialing Application</span>
                  </button>
                )}
              </div>

              {/* Roster Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Clinician</th>
                        <th className="py-3 px-4">Discipline / Role</th>
                        <th className="py-3 px-4">NPI &amp; CAQH</th>
                        <th className="py-3 px-4">State Licenses</th>
                        <th className="py-3 px-4">Insurances Linked</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProviders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            No clinicians found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProviders.map((prov) => {
                          const credPayers = getProviderCredentialedPayers(prov.id);

                          return (
                            <tr key={prov.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                                    {prov.firstName.charAt(0)}{prov.lastName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{prov.firstName} {prov.lastName}</p>
                                    <p className="text-[11px] text-slate-500">{prov.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  (prov.disciplines?.[0] || (prov as any).discipline) === 'ABA'
                                    ? 'bg-blue-100 text-blue-800'
                                    : (prov.disciplines?.[0] || (prov as any).discipline) === 'Speech'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {prov.disciplines?.[0] || (prov as any).discipline || 'ABA'} &bull; {prov.providerType}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px]">
                                <div>NPI: {prov.npi || '—'}</div>
                                <div className="text-slate-400">CAQH: {prov.caqhId || '—'}</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <div className="font-medium text-slate-800">
                                    {prov.bcbaCertificationNumber ? (
                                      <span>BCBA: <span className="font-mono font-semibold">{prov.bcbaCertificationNumber}</span></span>
                                    ) : (
                                      <span>{prov.licenseState || 'CA'}: <span className="font-mono">{prov.licenseNumber || 'Verified'}</span></span>
                                    )}
                                  </div>
                                  {(prov.licenseState === 'UT' || prov.region?.toLowerCase() === 'utah' || Boolean(prov.utStateLicense)) && (prov.utStateLicense || (prov as any).utahLicenseNumber) && (
                                    <div className="text-[11px] text-amber-800 font-medium flex items-center space-x-1">
                                      <span className="bg-amber-100/80 px-1 rounded text-[10px] font-bold">UT</span>
                                      <span className="font-mono">{prov.utStateLicense || (prov as any).utahLicenseNumber}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center space-x-1.5">
                                  <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-xs">
                                    {credPayers.length} Credentialed
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProvider(prov)}
                                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Manage Insurances</span>
                                </button>
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
          )}

          {/* SUBTAB 2: CROSS-INSURANCE MATRIX */}
          {activeSubTab === 'matrix' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Comprehensive Insurance Credentialing Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time matrix of all clinicians across {payers.length} contracted insurance payers. Click &ldquo;Edit&rdquo; on any clinician row to adjust credentialing status.
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Credentialed / Linked</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    <span>Not Linked</span>
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-3 px-4 sticky left-0 z-20 bg-slate-50 min-w-[200px] shadow-xs">
                          Clinician
                        </th>
                        {payers.map((payer) => (
                          <th key={payer.id} className="py-3 px-3 text-center min-w-[110px] whitespace-nowrap">
                            <span className="block truncate" title={payer.name}>{payer.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{payer.type}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProviders.map((prov) => {
                        const credPayers = getProviderCredentialedPayers(prov.id);

                        return (
                          <tr key={prov.id} className="hover:bg-slate-50/80 transition-colors">
                            <td 
                              onClick={() => handleOpenEditProvider(prov)}
                              className="py-3 px-4 sticky left-0 z-10 bg-white hover:bg-indigo-50/50 cursor-pointer shadow-xs border-r border-slate-100"
                            >
                              <div className="font-bold text-slate-900 truncate">{prov.firstName} {prov.lastName}</div>
                              <div className="text-[11px] text-slate-400">{prov.disciplines?.[0] || (prov as any).discipline || 'ABA'} &bull; {prov.providerType}</div>
                            </td>

                            {payers.map((payer) => {
                              const isCredentialed = credPayers.includes(payer.id);
                              return (
                                <td 
                                  key={payer.id} 
                                  onClick={() => handleOpenEditProvider(prov)}
                                  className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100/60 transition-colors"
                                  title={`${prov.firstName} ${prov.lastName} &bull; ${payer.name}: ${isCredentialed ? 'Credentialed' : 'Not Credentialed'}`}
                                >
                                  {isCredentialed ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 font-bold">&mdash;</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: COMMENTS & NOTES */}
          {activeSubTab === 'comments' && (
            <div className="space-y-5">
              {/* Input text box for credentialing staff */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Add Credentialing Note for {selectedEntity?.dba || selectedEntity?.legalName}</span>
                </div>
                <p className="text-xs text-slate-500">
                  Credentialing staff can input their notes, operational reminders, and payer audit follow-ups here. Notes are persisted in the database.
                </p>

                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Type credentialing notes, payer enrollment status updates, or follow-up tasks here..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Posting as: <strong className="text-slate-600">{currentAccount?.name || 'Credentialing Specialist'}</strong>
                  </span>
                  <button
                    type="button"
                    disabled={isPostingComment || !newCommentText.trim()}
                    onClick={handlePostComment}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isPostingComment ? 'Saving...' : 'Post Credentialing Note'}</span>
                  </button>
                </div>
              </div>

              {/* Comments History List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  Notes Log ({entityComments.length})
                </h3>

                {entityComments.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500">No notes recorded yet for this entity.</p>
                  </div>
                ) : (
                  entityComments.map((comment) => (
                    <div 
                      key={comment.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {comment.authorName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{comment.authorName}</span>
                            <span className="text-slate-400 ml-1.5 text-[11px]">({comment.authorRole})</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap pl-9 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Provider Credentialing Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  {editingProvider.firstName.charAt(0)}{editingProvider.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Manage Credentialing &bull; {editingProvider.firstName} {editingProvider.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingProvider.disciplines?.[0] || (editingProvider as any).discipline || 'ABA'} &bull; NPI: <strong className="font-mono text-slate-700">{editingProvider.npi}</strong> &bull; CAQH: <strong className="font-mono text-slate-700">{editingProvider.caqhId || '—'}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProvider(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 shrink-0">
              Toggle which insurance payers this clinician is actively credentialed with. Saving updates the employee roster in Supabase.
            </div>

            {/* Payers checklist */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {payers.map((payer) => {
                const currentStatus = providerPayerStates[payer.id]?.status || 'Not Enrolled';
                const isCred = currentStatus === 'Credentialed';

                return (
                  <div
                    key={payer.id}
                    onClick={() => {
                      setProviderPayerStates((prev) => ({
                        ...prev,
                        [payer.id]: {
                          ...prev[payer.id],
                          status: isCred ? 'Not Enrolled' : 'Credentialed',
                        },
                      }));
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                      isCred
                        ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isCred ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isCred && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{payer.name}</p>
                        <p className="text-[11px] text-slate-500">{payer.type} &bull; {payer.submissionMethod}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isCred ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isCred ? 'Credentialed' : 'Not Credentialed'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                disabled={isSavingProvider}
                onClick={() => setEditingProvider(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingProvider}
                onClick={handleSaveProviderCredentials}
                className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSavingProvider ? 'Updating Supabase...' : 'Save & Update Supabase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
