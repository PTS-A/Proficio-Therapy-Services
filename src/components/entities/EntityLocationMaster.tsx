import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { LegalEntity, PracticeLocation } from '../../types';
import { 
  AlertTriangle, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  FileCheck, 
  FileText, 
  MapPin, 
  Phone, 
  Plus, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  X 
} from 'lucide-react';

export const EntityLocationMaster: React.FC = () => {
  const { entities, locations, addEntity, updateEntity, addLocation, updateLocation, records } = useCredentialing();

  const [activeTab, setActiveTab] = useState<'entities' | 'locations'>('entities');
  const [selectedEntity, setSelectedEntity] = useState<LegalEntity | null>(entities[0] || null);
  const [selectedLocation, setSelectedLocation] = useState<PracticeLocation | null>(locations[0] || null);

  // Entity Modal
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<LegalEntity | null>(null);
  const [entityForm, setEntityForm] = useState({
    legalName: '',
    dba: '',
    ein: '',
    npiType2: '',
    taxonomy: '103K00000X',
    w9OnFile: true,
    w9Year: 2026,
    glPolicyNumber: '',
    glExpirationDate: '',
    wcPolicyNumber: '',
    wcExpirationDate: '',
  });

  // Location Modal
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<PracticeLocation | null>(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    addressLine1: '',
    city: '',
    state: 'CA',
    zipCode: '',
    entityId: 'ent-1',
    serviceTypes: ['In-Clinic', 'In-Home'] as PracticeLocation['serviceTypes'],
    leaseAgreementStatus: 'Active' as PracticeLocation['leaseAgreementStatus'],
    leaseExpirationDate: '',
    paveLocationStatus: 'Approved' as PracticeLocation['paveLocationStatus'],
    phone: '',
    primaryContact: '',
  });

  const handleOpenEntityAdd = () => {
    setEditingEntity(null);
    setEntityForm({
      legalName: '',
      dba: '',
      ein: '',
      npiType2: '',
      taxonomy: '103K00000X',
      w9OnFile: true,
      w9Year: 2026,
      glPolicyNumber: '',
      glExpirationDate: '',
      wcPolicyNumber: '',
      wcExpirationDate: '',
    });
    setIsEntityModalOpen(true);
  };

  const handleOpenEntityEdit = (e: LegalEntity) => {
    setEditingEntity(e);
    setEntityForm({
      legalName: e.legalName,
      dba: e.dba,
      ein: e.ein,
      npiType2: e.npiType2,
      taxonomy: e.taxonomy,
      w9OnFile: e.w9OnFile,
      w9Year: e.w9Year,
      glPolicyNumber: e.generalLiabilityPolicy.policyNumber,
      glExpirationDate: e.generalLiabilityPolicy.expirationDate,
      wcPolicyNumber: e.workersCompPolicy.policyNumber,
      wcExpirationDate: e.workersCompPolicy.expirationDate,
    });
    setIsEntityModalOpen(true);
  };

  const handleSaveEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityForm.legalName || !entityForm.ein) return;

    if (editingEntity) {
      updateEntity(editingEntity.id, {
        legalName: entityForm.legalName,
        dba: entityForm.dba,
        ein: entityForm.ein,
        npiType2: entityForm.npiType2,
        taxonomy: entityForm.taxonomy,
        w9OnFile: entityForm.w9OnFile,
        w9Year: entityForm.w9Year,
        generalLiabilityPolicy: {
          ...editingEntity.generalLiabilityPolicy,
          policyNumber: entityForm.glPolicyNumber,
          expirationDate: entityForm.glExpirationDate,
        },
        workersCompPolicy: {
          ...editingEntity.workersCompPolicy,
          policyNumber: entityForm.wcPolicyNumber,
          expirationDate: entityForm.wcExpirationDate,
        },
      });
    } else {
      const created = addEntity({
        legalName: entityForm.legalName,
        dba: entityForm.dba,
        ein: entityForm.ein,
        npiType2: entityForm.npiType2,
        taxonomy: entityForm.taxonomy,
        w9OnFile: entityForm.w9OnFile,
        w9Year: entityForm.w9Year,
        generalLiabilityPolicy: {
          policyNumber: entityForm.glPolicyNumber,
          carrier: 'Hartford Underwriters Insurance',
          expirationDate: entityForm.glExpirationDate,
          coverageAmount: '$2,000,000 / $4,000,000',
        },
        workersCompPolicy: {
          policyNumber: entityForm.wcPolicyNumber,
          carrier: 'State Compensation Insurance Fund',
          expirationDate: entityForm.wcExpirationDate,
          coverageAmount: '$1,000,000 Statutory',
        },
      });
      setSelectedEntity(created);
    }
    setIsEntityModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-sky-600" />
            <span>FR-004 & FR-005: Legal Entity & Practice Location Directory</span>
          </h2>
          <p className="text-xs text-slate-500">
            Multi-entity architecture for Ages Learning Solutions, Proficio, and Child's Play with W-9, lease, and insurance tracking.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('entities')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'entities'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Legal Entities ({entities.length})
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'locations'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Practice Locations ({locations.length})
            </button>
          </div>

          <button
            onClick={activeTab === 'entities' ? handleOpenEntityAdd : () => setIsLocationModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'entities' ? 'Entity' : 'Location'}</span>
          </button>
        </div>
      </div>

      {/* SECTION A: LEGAL ENTITY DIRECTORY */}
      {activeTab === 'entities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {entities.map((entity) => {
            const entityLocations = locations.filter((l) => l.entityId === entity.id);
            const entityRecords = records.filter((r) => r.entityId === entity.id);
            const isSelected = selectedEntity?.id === entity.id;

            return (
              <div
                key={entity.id}
                onClick={() => setSelectedEntity(entity)}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all cursor-pointer ${
                  isSelected ? 'border-sky-400 ring-2 ring-sky-100 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      ID: {entity.id}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-1.5">{entity.legalName}</h3>
                    <div className="text-xs text-sky-700 font-semibold mt-0.5">DBA: {entity.dba}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEntityEdit(entity);
                    }}
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Entity Parameters */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Federal EIN:</span>
                    <span className="font-mono font-bold text-slate-800">{entity.ein}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type 2 Group NPI:</span>
                    <span className="font-mono font-bold text-slate-800">{entity.npiType2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxonomy:</span>
                    <span className="font-mono text-slate-800">{entity.taxonomy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">W-9 Form:</span>
                    <span className="font-bold text-emerald-600">✓ On File ({entity.w9Year})</span>
                  </div>
                </div>

                {/* Insurance Policies (Section 5.10 compliance) */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">General Liability</span>
                      <span className="text-slate-500 font-mono text-[10px]">Exp: {entity.generalLiabilityPolicy.expirationDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {entity.generalLiabilityPolicy.carrier} • Policy #{entity.generalLiabilityPolicy.policyNumber}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Workers' Compensation</span>
                      <span className="text-slate-500 font-mono text-[10px]">Exp: {entity.workersCompPolicy.expirationDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {entity.workersCompPolicy.carrier} • Policy #{entity.workersCompPolicy.policyNumber}
                    </div>
                  </div>
                </div>

                {/* Locations & Records count */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{entityLocations.length} Clinics / Locations</span>
                  <span className="font-bold text-sky-700">{entityRecords.length} Active Applications</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION B: LOCATION DIRECTORY */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {locations.map((loc) => {
            const locEntity = entities.find((e) => e.id === loc.entityId);
            const locRecords = records.filter((r) => r.locationId === loc.id);

            return (
              <div
                key={loc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {loc.id.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-1.5">{loc.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{loc.addressLine1}, {loc.city}, {loc.state} {loc.zipCode}</span>
                    </div>
                  </div>
                </div>

                {/* Entity Assignment */}
                <div className="mt-3 p-2 rounded-lg bg-sky-50/60 border border-sky-100 text-xs">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Assigned Legal Entity:</span>
                  <div className="font-bold text-sky-900 mt-0.5">{locEntity?.legalName}</div>
                </div>

                {/* Service Types */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {loc.serviceTypes.map((st) => (
                    <span key={st} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {st}
                    </span>
                  ))}
                </div>

                {/* Lease & PAVE Status (Section 5.10 cross-check) */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Lease / Sublease:</span>
                    <span className="font-bold text-slate-800">
                      {loc.leaseAgreementStatus} (Exp: {loc.leaseExpirationDate || 'N/A'})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">PAVE Location Status:</span>
                    <span className={`font-bold ${loc.paveLocationStatus === 'Approved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {loc.paveLocationStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Primary Contact:</span>
                    <span className="text-slate-700">{loc.primaryContact} ({loc.phone})</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Enrolled Applications:</span>
                  <span className="font-bold text-sky-700">{locRecords.length} Records</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Entity Modal */}
      {isEntityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingEntity ? 'Edit Legal Entity Parameters' : 'Create Legal Entity (Section 5.8)'}
              </h3>
              <button onClick={() => setIsEntityModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntity} className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="font-semibold text-slate-700">Legal Entity Name (Exact W-9 Match)</label>
                <input
                  type="text"
                  value={entityForm.legalName}
                  onChange={(e) => setEntityForm({ ...entityForm, legalName: e.target.value })}
                  placeholder="e.g. Ages Learning Solutions LLC"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Doing Business As (DBA)</label>
                <input
                  type="text"
                  value={entityForm.dba}
                  onChange={(e) => setEntityForm({ ...entityForm, dba: e.target.value })}
                  placeholder="e.g. Ages Learning Center"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Federal EIN (9-Digits)</label>
                  <input
                    type="text"
                    value={entityForm.ein}
                    onChange={(e) => setEntityForm({ ...entityForm, ein: e.target.value })}
                    placeholder="XX-XXXXXXX"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Type 2 Group NPI</label>
                  <input
                    type="text"
                    value={entityForm.npiType2}
                    onChange={(e) => setEntityForm({ ...entityForm, npiType2: e.target.value })}
                    placeholder="10-digit NPI"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">General Liability Policy #</label>
                  <input
                    type="text"
                    value={entityForm.glPolicyNumber}
                    onChange={(e) => setEntityForm({ ...entityForm, glPolicyNumber: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">GL Expiration Date</label>
                  <input
                    type="date"
                    value={entityForm.glExpirationDate}
                    onChange={(e) => setEntityForm({ ...entityForm, glExpirationDate: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEntityModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
