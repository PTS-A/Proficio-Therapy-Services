import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Discipline, EmploymentStatus, Provider, ProviderType } from '../../types';
import { 
  AlertCircle, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  FileText, 
  Layers, 
  Mail, 
  MapPin, 
  Phone, 
  Plus, 
  Search, 
  ShieldCheck, 
  Trash2, 
  UserCheck, 
  Users, 
  X 
} from 'lucide-react';

interface ProviderMasterProps {
  onSelectRecord: (recordId: string) => void;
  selectedProviderId?: string | null;
  onClearSelectedProvider?: () => void;
}

export const ProviderMaster: React.FC<ProviderMasterProps> = ({
  onSelectRecord,
  selectedProviderId,
  onClearSelectedProvider,
}) => {
  const {
    providers,
    records,
    payers,
    entities,
    locations,
    addProvider,
    updateProvider,
    deleteProvider,
  } = useCredentialing();

  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState<Discipline | 'All'>('All');
  const [activeProfileId, setActiveProfileId] = useState<string | null>(selectedProviderId || providers[0]?.id || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  // New / Edit Provider Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    credentials: '',
    npi: '',
    email: '',
    phone: '',
    disciplines: ['ABA'] as Discipline[],
    providerType: 'BCBA' as ProviderType,
    licenseNumber: '',
    licenseState: 'CA',
    licenseExpiration: '',
    taxonomy: '103K00000X',
    specialty: '',
    employmentStatus: 'Full-Time' as EmploymentStatus,
    startDate: new Date().toISOString().split('T')[0],
    entityIds: ['ent-1'],
    locationIds: ['loc-3'],
    caqhId: '',
    caqhStatus: 'Attested' as any,
    paveStatus: 'Approved' as any,
    medicaidId: '',
    npiVerified: true,
  });

  const filteredProviders = providers.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${p.firstName} ${p.lastName}`.toLowerCase().includes(q);
      const matchNpi = p.npi.includes(q);
      const matchLic = p.licenseNumber.toLowerCase().includes(q);
      if (!matchName && !matchNpi && !matchLic) return false;
    }
    if (disciplineFilter !== 'All' && !p.disciplines.includes(disciplineFilter)) return false;
    return true;
  });

  const activeProvider = providers.find((p) => p.id === (activeProfileId || selectedProviderId)) || filteredProviders[0];

  const handleOpenAdd = () => {
    setEditingProvider(null);
    setFormData({
      firstName: '',
      lastName: '',
      credentials: 'MS, BCBA',
      npi: '',
      email: '',
      phone: '',
      disciplines: ['ABA'],
      providerType: 'BCBA',
      licenseNumber: '',
      licenseState: 'CA',
      licenseExpiration: '',
      taxonomy: '103K00000X',
      specialty: 'Applied Behavior Analysis',
      employmentStatus: 'Full-Time',
      startDate: new Date().toISOString().split('T')[0],
      entityIds: ['ent-1'],
      locationIds: ['loc-3'],
      caqhId: '',
      caqhStatus: 'Attested',
      paveStatus: 'Approved',
      medicaidId: '',
      npiVerified: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Provider) => {
    setEditingProvider(p);
    setFormData({
      firstName: p.firstName,
      lastName: p.lastName,
      credentials: p.credentials,
      npi: p.npi,
      email: p.email,
      phone: p.phone,
      disciplines: p.disciplines,
      providerType: p.providerType,
      licenseNumber: p.licenseNumber,
      licenseState: p.licenseState,
      licenseExpiration: p.licenseExpiration,
      taxonomy: p.taxonomy,
      specialty: p.specialty,
      employmentStatus: p.employmentStatus,
      startDate: p.startDate,
      entityIds: p.entityIds,
      locationIds: p.locationIds,
      caqhId: p.caqhId,
      caqhStatus: p.caqhStatus,
      paveStatus: p.paveStatus,
      medicaidId: p.medicaidId || '',
      npiVerified: p.npiVerified,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.npi) return;

    if (editingProvider) {
      updateProvider(editingProvider.id, {
        ...formData,
        nppesRecordMatch: true,
      });
    } else {
      const created = addProvider({
        ...formData,
        nppesRecordMatch: true,
        active: true,
      });
      setActiveProfileId(created.id);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-sky-600" />
            <span>FR-002: Provider Master & 360° Profiles</span>
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive credentials, CAQH attestation, PAVE tracking, and linked entities across ABA, Speech, and OT.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#2B4C9D] hover:bg-[#223E80] text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Provider</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Provider List & Filters (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          {/* Search & Discipline Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search provider name, NPI, or license..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {(['All', 'ABA', 'Speech', 'OT'] as (Discipline | 'All')[]).map((disc) => (
                <button
                  key={disc}
                  onClick={() => setDisciplineFilter(disc)}
                  className={`flex-1 py-1 rounded-md transition-all ${
                    disciplineFilter === disc
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {disc}
                </button>
              ))}
            </div>
          </div>

          {/* Provider List */}
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
            {filteredProviders.map((p) => {
              const isSelected = activeProvider?.id === p.id;
              const providerRecords = records.filter((r) => r.providerId === p.id);
              const approvedCount = providerRecords.filter((r) => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;

              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProfileId(p.id)}
                  className={`py-3 px-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/80 border border-sky-200 shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900">
                      {p.firstName} {p.lastName}, {p.credentials}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.disciplines.includes('ABA')
                          ? 'bg-sky-100 text-sky-800'
                          : p.disciplines.includes('Speech')
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {p.providerType}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2">
                    <span className="font-mono">NPI: {p.npi}</span>
                    <span>•</span>
                    <span>{p.licenseState} Lic: {p.licenseNumber}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{providerRecords.length} Applications ({approvedCount} Approved)</span>
                    <span className={`font-semibold ${p.caqhStatus === 'Attested' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      CAQH: {p.caqhStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Provider 360 Profile (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {activeProvider ? (
            <>
              {/* Profile Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-500/20">
                    {activeProvider.firstName[0]}{activeProvider.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {activeProvider.firstName} {activeProvider.lastName}, {activeProvider.credentials}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span className="font-medium text-sky-700">{activeProvider.specialty}</span>
                      <span>•</span>
                      <span>{activeProvider.employmentStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(activeProvider)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Provider"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${activeProvider.firstName} ${activeProvider.lastName}?`)) {
                        deleteProvider(activeProvider.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Provider"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Master Credentialing Verifications Strip (FR-010, FR-011, FR-012) */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                {/* NPI & NPPES Check */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 flex items-center justify-between">
                    <span>NPI (10-Digit)</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="font-mono font-bold text-slate-900 mt-1">{activeProvider.npi}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">NPPES Registry Verified</div>
                </div>

                {/* CAQH ProView Status */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 flex items-center justify-between">
                    <span>CAQH ProView</span>
                    <span className="text-[10px] font-mono">#{activeProvider.caqhId}</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{activeProvider.caqhStatus}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Next: {activeProvider.nextAttestationDate || 'N/A'}</div>
                </div>

                {/* PAVE / Medicaid Status */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 flex items-center justify-between">
                    <span>PAVE / Medi-Cal</span>
                    <span className="text-[10px] font-bold text-sky-700">DHCS</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{activeProvider.paveStatus}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Medicaid ID: {activeProvider.medicaidId || 'Pending'}</div>
                </div>
              </div>

              {/* Professional License & Taxonomy Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>Professional Licensure & Taxonomy</span>
                  <span className="text-slate-500 font-normal">Start Date: {activeProvider.startDate}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400">License Number</span>
                    <div className="font-bold text-slate-800">{activeProvider.licenseNumber} ({activeProvider.licenseState})</div>
                  </div>
                  <div>
                    <span className="text-slate-400">License Expiration</span>
                    <div className="font-bold text-slate-800">{activeProvider.licenseExpiration}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Taxonomy Code</span>
                    <div className="font-mono text-slate-800">{activeProvider.taxonomy}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Group Affiliation</span>
                    <div className="text-slate-800">{activeProvider.groupAffiliation || 'Ages Learning Solutions'}</div>
                  </div>
                </div>
              </div>

              {/* Active Payer Applications for this Provider */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-2">
                  Active Payer Enrollments & Applications
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {records
                    .filter((r) => r.providerId === activeProvider.id)
                    .map((rec) => {
                      const payer = payers.find((p) => p.id === rec.payerId);
                      return (
                        <div
                          key={rec.id}
                          onClick={() => onSelectRecord(rec.id)}
                          className="p-3 bg-white hover:bg-sky-50/50 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[10px] font-bold text-sky-700">{rec.id}</span>
                              <span className="font-bold text-slate-900">{payer?.name}</span>
                              <span className="text-slate-400 text-[10px]">({rec.applicationType})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Stage: <strong>{rec.stage}</strong> • Next Follow-up: {rec.nextFollowUpDate || 'None'}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              rec.stage === 'Approved' || rec.stage === 'Linked'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rec.isOverdue
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {rec.stage}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a provider to view 360° profile.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Provider Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProvider ? 'Edit Provider Master Record' : 'Create New Provider Master Record (Section 5.6)'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProvider} className="space-y-4 text-xs mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Credentials</label>
                  <input
                    type="text"
                    placeholder="e.g. MS, BCBA, LBA"
                    value={formData.credentials}
                    onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">10-Digit NPI</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="10 digit NPI"
                    value={formData.npi}
                    onChange={(e) => setFormData({ ...formData, npi: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Discipline</label>
                  <select
                    value={formData.disciplines[0]}
                    onChange={(e) => setFormData({ ...formData, disciplines: [e.target.value as Discipline] })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="ABA">ABA (Applied Behavior Analysis)</option>
                    <option value="Speech">Speech Therapy (SLP)</option>
                    <option value="OT">Occupational Therapy (OT)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Provider Type</label>
                  <select
                    value={formData.providerType}
                    onChange={(e) => setFormData({ ...formData, providerType: e.target.value as ProviderType })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="BCBA">BCBA</option>
                    <option value="SLP">SLP</option>
                    <option value="OTR/L">OTR/L</option>
                    <option value="SLPA">SLPA</option>
                    <option value="COTA">COTA</option>
                    <option value="RBT">RBT</option>
                    <option value="Clinical Director">Clinical Director</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">License Number</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">License State</label>
                  <input
                    type="text"
                    value={formData.licenseState}
                    onChange={(e) => setFormData({ ...formData, licenseState: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">License Expiration</label>
                  <input
                    type="date"
                    value={formData.licenseExpiration}
                    onChange={(e) => setFormData({ ...formData, licenseExpiration: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">CAQH ID</label>
                  <input
                    type="text"
                    value={formData.caqhId}
                    onChange={(e) => setFormData({ ...formData, caqhId: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">CAQH Status</label>
                  <select
                    value={formData.caqhStatus}
                    onChange={(e) => setFormData({ ...formData, caqhStatus: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Attested">Attested (Active)</option>
                    <option value="Complete">Complete (Pending Attestation)</option>
                    <option value="Re-attestation Due">Re-attestation Due</option>
                    <option value="Initial">Initial Draft</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">PAVE / Medi-Cal Status</label>
                  <select
                    value={formData.paveStatus}
                    onChange={(e) => setFormData({ ...formData, paveStatus: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Submitted">Submitted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Not Required">Not Required</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
                >
                  Save Provider Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
