import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Search,
  Filter,
  Layers,
  Save,
  X
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Payer, PayerType, SubmissionMethod } from '../../types';

export const AdminInsuranceManager: React.FC = () => {
  const { payers, entities, addPayer, updatePayer, deletePayer, addToast } = useCredentialing();

  // Form states for adding new insurance
  const [name, setName] = useState('');
  const [type, setType] = useState<PayerType>('Commercial');
  const [submissionMethod, setSubmissionMethod] = useState<SubmissionMethod>('Online Portal');
  const [averageTatDays, setAverageTatDays] = useState<number>(60);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>(() => entities.map((e) => e.id));

  // Sync when entities load from database
  useEffect(() => {
    if (entities.length > 0 && selectedEntityIds.length === 0) {
      setSelectedEntityIds(entities.map((e) => e.id));
    }
  }, [entities]);
  const [portalUrl, setPortalUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Inline editing state for existing payer TAT
  const [editingPayerId, setEditingPayerId] = useState<string | null>(null);
  const [editTatValue, setEditTatValue] = useState<number>(60);
  const [editEntityIds, setEditEntityIds] = useState<string[]>([]);

  const handleToggleEntity = (entityId: string) => {
    setSelectedEntityIds((prev) => 
      prev.includes(entityId) ? prev.filter((id) => id !== entityId) : [...prev, entityId]
    );
  };

  const handleCreateInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter an insurance name.', 'error');
      return;
    }
    if (selectedEntityIds.length === 0) {
      addToast('Please select at least one associated entity.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPayerData: Omit<Payer, 'id'> = {
        name: name.trim(),
        type,
        submissionMethod,
        averageTatDays: Number(averageTatDays) || 60,
        followUpCadenceDays: 7,
        entityIds: selectedEntityIds,
        statesServed: ['CA'],
        contacts: contactEmail.trim() ? [{ id: `c-${Date.now()}`, name: 'Provider Relations', role: 'Rep', email: contactEmail.trim(), phone: '' }] : [],
        requiredDocuments: ['State License', 'CAQH Attestation'],
        requiredFields: ['NPI', 'Taxonomy', 'License'],
        portalUrl: portalUrl.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        notes: notes.trim() || undefined,
        active: true,
      };

      addPayer(newPayerData);
      addToast(`Insurance "${name.trim()}" created successfully with ${averageTatDays} days average TAT.`, 'success');

      // Reset form
      setName('');
      setType('Commercial');
      setSubmissionMethod('Online Portal');
      setAverageTatDays(60);
      setSelectedEntityIds(entities.map((e) => e.id));
      setPortalUrl('');
      setContactEmail('');
      setNotes('');
    } catch (err: any) {
      addToast(err.message || 'Failed to create insurance', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (payer: Payer) => {
    setEditingPayerId(payer.id);
    setEditTatValue(payer.averageTatDays || 60);
    setEditEntityIds(payer.entityIds || []);
  };

  const handleSaveEdit = (payerId: string) => {
    try {
      updatePayer(payerId, {
        averageTatDays: Number(editTatValue) || 60,
        entityIds: editEntityIds,
      });
      setEditingPayerId(null);
      addToast('Insurance panel settings updated successfully.', 'success');
    } catch (err: any) {
      addToast('Failed to update insurance settings', 'error');
    }
  };

  const handleDelete = (payer: Payer) => {
    if (confirm(`Are you sure you want to remove ${payer.name} from the insurance roster?`)) {
      const res = deletePayer(payer.id);
      if (res.success) {
        addToast(`Insurance ${payer.name} removed.`, 'info');
      } else {
        addToast(res.error || 'Failed to delete insurance', 'error');
      }
    }
  };

  // Filtered Payers List
  const filteredPayers = (payers || []).filter((p) => {
    if (filterType !== 'ALL' && p.type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchType = p.type.toLowerCase().includes(q);
      if (!matchName && !matchType) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-[#2B4C9D] rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Insurance Panels &amp; TAT Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure insurance names, associate them across the 3 operating entities, and define benchmark Average Turnaround Time (TAT) in days.
            </p>
          </div>
        </div>
      </div>

      {/* FORM: ADD NEW INSURANCE NAME, ASSOCIATE ENTITIES, DEFINE AVERAGE TAT */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-[#2B4C9D]" />
            <h3 className="text-sm font-bold text-slate-900">Add New Insurance Panel</h3>
          </div>
          <span className="text-xs text-slate-400">All fields persist across clinical roster</span>
        </div>

        <form onSubmit={handleCreateInsurance} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Field 1: Insurance Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Insurance / Payer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aetna Commercial, Blue Shield CA"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-medium"
              />
            </div>

            {/* Field 2: Payer Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payer Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PayerType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
              >
                <option value="Commercial">Commercial</option>
                <option value="Medicaid Managed Care">Medicaid Managed Care</option>
                <option value="Regional Center">Regional Center</option>
                <option value="Medicare">Medicare</option>
                <option value="TRICARE">TRICARE</option>
              </select>
            </div>

            {/* Field 3: Average TAT Days */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Average TAT (Turnaround Time) <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-slate-400">Benchmark SLA</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={averageTatDays}
                  onChange={(e) => setAverageTatDays(parseInt(e.target.value) || 60)}
                  placeholder="e.g. 60"
                  className="w-full pl-3 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold pointer-events-none">
                  Days
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 4: Associated Operating Entities */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Associate with Entities <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {entities.map((ent) => {
                  const isChecked = selectedEntityIds.includes(ent.id);
                  return (
                    <button
                      key={ent.id}
                      type="button"
                      onClick={() => handleToggleEntity(ent.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-blue-50/80 border-[#2B4C9D] text-[#2B4C9D]'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{ent.dba || ent.legalName}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#2B4C9D] shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 5: Submission Method & Portal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Submission Channel
                </label>
                <select
                  value={submissionMethod}
                  onChange={(e) => setSubmissionMethod(e.target.value as SubmissionMethod)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                >
                  <option value="Online Portal">Online Portal</option>
                  <option value="Availity">Availity</option>
                  <option value="CAQH ProView">CAQH ProView</option>
                  <option value="Email">Email Direct</option>
                  <option value="Fax">Facsimile (Fax)</option>
                  <option value="Paper Mail">Paper Mail</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Portal URL or Rep Email (Optional)
                </label>
                <input
                  type="text"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  placeholder="https://provider.aetna.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Insurance...' : 'Add Insurance Panel'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* EXISTING INSURANCES LIST & TAT MANAGEMENT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-bold text-slate-900">
              Active Insurance Roster ({payers.length} Panels)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search insurance..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['ALL', 'Commercial', 'Medicaid Managed Care', 'Regional Center'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterType === t ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'ALL' ? 'All Types' : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Insurance Name &amp; Classification</th>
                <th className="py-3 px-4">Associated Entities</th>
                <th className="py-3 px-4 text-center">Average Turnaround (TAT)</th>
                <th className="py-3 px-4">Submission Method</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayers.map((payer) => {
                const isEditing = editingPayerId === payer.id;
                const payerEntities = (payer.entityIds || []).map((id) => entities.find((e) => e.id === id)?.dba || id);

                return (
                  <tr key={payer.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{payer.name}</div>
                      <div className="text-[11px] text-slate-400">{payer.type}</div>
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex flex-wrap gap-1">
                          {entities.map((ent) => {
                            const isChecked = editEntityIds.includes(ent.id);
                            return (
                              <button
                                key={ent.id}
                                type="button"
                                onClick={() => {
                                  setEditEntityIds((prev) => 
                                    prev.includes(ent.id) ? prev.filter((id) => id !== ent.id) : [...prev, ent.id]
                                  );
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                  isChecked
                                    ? 'bg-blue-100 text-[#2B4C9D] border-blue-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                {ent.dba || ent.legalName}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {payerEntities.length > 0 ? (
                            payerEntities.map((entName, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {entName}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">All Entities</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <div className="inline-flex items-center space-x-1">
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={editTatValue}
                            onChange={(e) => setEditTatValue(parseInt(e.target.value) || 60)}
                            className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 text-center"
                          />
                          <span className="text-[11px] text-slate-500">Days</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600" />
                          {payer.averageTatDays || 60} Days TAT
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <span className="text-xs">{payer.submissionMethod}</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => handleSaveEdit(payer.id)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                            title="Save"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPayerId(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => handleStartEdit(payer)}
                            className="p-1.5 text-slate-400 hover:text-[#2B4C9D] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit TAT & Entities"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(payer)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Insurance"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
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
export default AdminInsuranceManager;
