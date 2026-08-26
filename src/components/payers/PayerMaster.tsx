import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Payer, PayerType } from '../../types';
import { 
  AlertCircle, 
  Building, 
  Clock, 
  Edit3, 
  ExternalLink, 
  FileCheck, 
  Globe, 
  Mail, 
  MapPin, 
  Phone, 
  Plus, 
  Search, 
  ShieldCheck, 
  Trash2, 
  X 
} from 'lucide-react';

interface PayerMasterProps {
  onSelectPayerApplications?: (payerId: string) => void;
}

export const PayerMaster: React.FC<PayerMasterProps> = ({ onSelectPayerApplications }) => {
  const { payers, records, addPayer, updatePayer, deletePayer } = useCredentialing();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<PayerType | 'All'>('All');
  const [selectedPayer, setSelectedPayer] = useState<Payer | null>(payers[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayer, setEditingPayer] = useState<Payer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Commercial' as PayerType,
    submissionMethod: 'Online Portal',
    portalUrl: '',
    averageTatDays: 60,
    requiresPave: false,
    requiresCaqh: true,
    requiresMedicaidId: false,
    followUpCadenceDays: 10,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    statesServed: ['CA'],
  });

  const filteredPayers = payers.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchType = p.type.toLowerCase().includes(q);
      if (!matchName && !matchType) return false;
    }
    if (typeFilter !== 'All' && p.type !== typeFilter) return false;
    return true;
  });

  const activePayer = selectedPayer || filteredPayers[0];

  const handleOpenAdd = () => {
    setEditingPayer(null);
    setFormData({
      name: '',
      type: 'Commercial',
      submissionMethod: 'Online Portal',
      portalUrl: 'https://',
      averageTatDays: 60,
      requiresPave: false,
      requiresCaqh: true,
      requiresMedicaidId: false,
      followUpCadenceDays: 10,
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      statesServed: ['CA'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Payer) => {
    setEditingPayer(p);
    setFormData({
      name: p.name,
      type: p.type,
      submissionMethod: p.submissionMethod,
      portalUrl: p.portalUrl || '',
      averageTatDays: p.averageTatDays,
      requiresPave: p.requiresPave,
      requiresCaqh: p.requiresCaqh,
      requiresMedicaidId: p.requiresMedicaidId,
      followUpCadenceDays: p.followUpCadenceDays,
      contactName: p.contactName || '',
      contactEmail: p.contactEmail || '',
      contactPhone: p.contactPhone || '',
      statesServed: p.statesServed,
    });
    setIsModalOpen(true);
  };

  const handleSavePayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingPayer) {
      updatePayer(editingPayer.id, formData);
    } else {
      const created = addPayer({
        ...formData,
        requiredDocumentTypes: ['State License', 'Malpractice Insurance / COI', 'W-9 Form', 'CAQH ProView Profile'],
      });
      setSelectedPayer(created);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Building className="w-5 h-5 text-sky-600" />
            <span>FR-003: Payer Master Directory (20+ Configured Networks)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Standardized TATs, portals, submission methods, and specific credentialing checklist requirements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Payer</span>
        </button>
      </div>

      {/* 2-Column Master Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Payer List & Filters */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search payer name, type, or portal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
              {(['All', 'Commercial', 'Medicaid Managed Care', 'Regional Center / State', 'Tricare / Military'] as (PayerType | 'All')[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                    typeFilter === t
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
            {filteredPayers.map((p) => {
              const isSelected = activePayer?.id === p.id;
              const payerApps = records.filter((r) => r.payerId === p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPayer(p)}
                  className={`py-3 px-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/80 border border-sky-200 shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900">{p.name}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {p.type}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>TAT: <strong>{p.averageTatDays} days</strong></span>
                    <span>Method: <strong>{p.submissionMethod}</strong></span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{payerApps.length} active applications</span>
                    <span>States: {p.statesServed.join(', ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Payer Details & Checklist Requirements */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {activePayer ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-600/20">
                    {activePayer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{activePayer.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span className="font-medium text-sky-700">{activePayer.type}</span>
                      <span>•</span>
                      <span>Serving: {activePayer.statesServed.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(activePayer)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Payer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${activePayer.name}?`)) {
                        deletePayer(activePayer.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Payer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service SLA & Submission Matrix */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 flex items-center justify-between">
                    <span>Target TAT</span>
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{activePayer.averageTatDays} Business Days</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Follow-up: Every {activePayer.followUpCadenceDays}d</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 flex items-center justify-between">
                    <span>Submission</span>
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{activePayer.submissionMethod}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{activePayer.portalUrl || 'N/A'}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 flex items-center justify-between">
                    <span>Prerequisites</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="font-bold text-slate-900 mt-1">
                    {activePayer.requiresPave ? 'PAVE & CAQH' : activePayer.requiresCaqh ? 'CAQH ProView' : 'Direct App'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {activePayer.requiresMedicaidId ? 'Requires State Medicaid ID' : 'Commercial Standards'}
                  </div>
                </div>
              </div>

              {/* Contact Information & Portal Access */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>Provider Relations & Credentialing Contacts</span>
                  {activePayer.portalUrl && (
                    <a
                      href={activePayer.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:text-sky-800 flex items-center space-x-1"
                    >
                      <span>Open Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400">Contact / Dept</span>
                    <div className="font-semibold text-slate-800">{activePayer.contactName || 'Provider Enrollment Team'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Email</span>
                    <div className="font-semibold text-slate-800">{activePayer.contactEmail || 'credentialing@payer.com'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone</span>
                    <div className="font-semibold text-slate-800">{activePayer.contactPhone || '(800) 555-0199'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Payer ID / Network Code</span>
                    <div className="font-mono text-slate-800">{activePayer.id.toUpperCase()}</div>
                  </div>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-sky-600" />
                  <span>Mandatory Document Types for Clean Submission</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {activePayer.requiredDocumentTypes.map((docType) => (
                    <div key={docType} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                      <span className="text-slate-700 font-medium">{docType}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a payer to view details.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Payer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPayer ? 'Edit Payer Configuration' : 'Add New Payer Network (Section 5.7)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayer} className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="font-semibold text-slate-700">Payer Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Blue Shield of California"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Payer Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PayerType })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Medicaid Managed Care">Medicaid Managed Care</option>
                    <option value="Regional Center / State">Regional Center / State</option>
                    <option value="Tricare / Military">Tricare / Military</option>
                    <option value="Medicare Advantage">Medicare Advantage</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Submission Method</label>
                  <input
                    type="text"
                    value={formData.submissionMethod}
                    onChange={(e) => setFormData({ ...formData, submissionMethod: e.target.value })}
                    placeholder="e.g. Availity Portal"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Average TAT (Days)</label>
                  <input
                    type="number"
                    value={formData.averageTatDays}
                    onChange={(e) => setFormData({ ...formData, averageTatDays: parseInt(e.target.value) || 60 })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Follow-up Cadence (Days)</label>
                  <input
                    type="number"
                    value={formData.followUpCadenceDays}
                    onChange={(e) => setFormData({ ...formData, followUpCadenceDays: parseInt(e.target.value) || 10 })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Portal URL</label>
                <input
                  type="text"
                  value={formData.portalUrl}
                  onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                  placeholder="https://provider.blueshieldca.com"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="flex items-center space-x-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.requiresCaqh}
                    onChange={(e) => setFormData({ ...formData, requiresCaqh: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>Requires CAQH ProView Attestation</span>
                </label>

                <label className="flex items-center space-x-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.requiresPave}
                    onChange={(e) => setFormData({ ...formData, requiresPave: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>Requires Medi-Cal PAVE Enrollment</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
                >
                  Save Payer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
