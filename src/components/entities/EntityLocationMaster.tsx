import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { LegalEntity, PracticeLocation, ServiceType } from '../../types';
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
  X,
  FileSpreadsheet,
  Calendar,
  Check
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
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    entityId: entities[0]?.id || 'ent-1',
    dba: entities[0]?.dba || '',
    serviceTypes: ['In-Clinic', 'In-Home'] as ServiceType[],
    payerApplicability: ['All'] as string[],
    leaseAgreementStatus: 'Active' as PracticeLocation['leaseAgreementStatus'],
    leaseExpiryDate: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    paveStatus: 'Approved' as PracticeLocation['paveStatus'],
    insuranceCoverageValid: true,
    locationApprovalStatus: 'Approved' as PracticeLocation['locationApprovalStatus'],
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
      npiType2: e.npiType2 || '',
      taxonomy: e.taxonomy || '103K00000X',
      w9OnFile: e.w9OnFile,
      w9Year: e.w9Year || 2026,
      glPolicyNumber: e.generalLiabilityPolicy?.policyNumber || '',
      glExpirationDate: e.generalLiabilityPolicy?.expirationDate || '',
      wcPolicyNumber: e.workersCompPolicy?.policyNumber || '',
      wcExpirationDate: e.workersCompPolicy?.expirationDate || '',
    });
    setIsEntityModalOpen(true);
  };

  const handleOpenLocationAdd = () => {
    setEditingLocation(null);
    const defaultEntity = entities[0] || null;
    setLocationForm({
      name: '',
      address: '',
      city: '',
      state: 'CA',
      zip: '',
      entityId: defaultEntity?.id || 'ent-1',
      dba: defaultEntity?.dba || '',
      serviceTypes: ['In-Clinic', 'In-Home'],
      payerApplicability: ['All'],
      leaseAgreementStatus: 'Active',
      leaseExpiryDate: '2028-12-31',
      effectiveDate: new Date().toISOString().split('T')[0],
      paveStatus: 'Approved',
      insuranceCoverageValid: true,
      locationApprovalStatus: 'Approved',
      phone: '',
      primaryContact: '',
    });
    setIsLocationModalOpen(true);
  };

  const handleOpenLocationEdit = (loc: PracticeLocation) => {
    setEditingLocation(loc);
    setLocationForm({
      name: loc.name,
      address: loc.address || loc.addressLine1 || '',
      city: loc.city,
      state: loc.state,
      zip: loc.zip || loc.zipCode || '',
      entityId: loc.entityId,
      dba: loc.dba || '',
      serviceTypes: loc.serviceTypes || ['In-Clinic'],
      payerApplicability: loc.payerApplicability || ['All'],
      leaseAgreementStatus: loc.leaseAgreementStatus || 'Active',
      leaseExpiryDate: loc.leaseExpiryDate || loc.leaseExpirationDate || '',
      effectiveDate: loc.effectiveDate || '',
      paveStatus: loc.paveStatus || loc.paveLocationStatus || 'Approved',
      insuranceCoverageValid: loc.insuranceCoverageValid !== undefined ? loc.insuranceCoverageValid : true,
      locationApprovalStatus: loc.locationApprovalStatus || 'Approved',
      phone: loc.phone || '',
      primaryContact: loc.primaryContact || '',
    });
    setIsLocationModalOpen(true);
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
        ownershipDetails: 'Clinical Services Practice Group',
        primaryContact: 'Practice Credentialing Administrator',
        email: 'credentialing@practice.com',
        phone: '(555) 019-2830',
        address: 'Administrative Headquarters',
        active: true,
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

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationForm.name || !locationForm.address || !locationForm.city) return;

    const chosenEntity = entities.find(ent => ent.id === locationForm.entityId);

    const payload = {
      name: locationForm.name,
      address: locationForm.address,
      addressLine1: locationForm.address,
      city: locationForm.city,
      state: locationForm.state,
      zip: locationForm.zip,
      zipCode: locationForm.zip,
      entityId: locationForm.entityId,
      dba: locationForm.dba || chosenEntity?.dba || '',
      serviceTypes: locationForm.serviceTypes,
      payerApplicability: locationForm.payerApplicability,
      leaseAgreementStatus: locationForm.leaseAgreementStatus,
      leaseExpiryDate: locationForm.leaseExpiryDate,
      leaseExpirationDate: locationForm.leaseExpiryDate,
      effectiveDate: locationForm.effectiveDate,
      paveStatus: locationForm.paveStatus,
      paveLocationStatus: locationForm.paveStatus,
      insuranceCoverageValid: locationForm.insuranceCoverageValid,
      locationApprovalStatus: locationForm.locationApprovalStatus,
      phone: locationForm.phone,
      primaryContact: locationForm.primaryContact,
      active: true,
    };

    if (editingLocation) {
      updateLocation(editingLocation.id, payload);
    } else {
      const created = addLocation(payload);
      setSelectedLocation(created);
    }
    setIsLocationModalOpen(false);
  };

  const toggleServiceType = (st: ServiceType) => {
    setLocationForm(prev => {
      const exists = prev.serviceTypes.includes(st);
      return {
        ...prev,
        serviceTypes: exists 
          ? prev.serviceTypes.filter(s => s !== st)
          : [...prev.serviceTypes, st]
      };
    });
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-sky-600" />
            <span>Legal Entity & Practice Location Directory</span>
          </h2>
          <p className="text-xs text-slate-500">
            Multi-entity architecture for Ages Learning Solutions LLC, Proficio Speech Therapy Group INC, and Child's Play Therapy Services PC with full W-9, lease, and insurance match tracking.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('entities')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'entities'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Legal Entities ({entities.length})
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'locations'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Practice Locations ({locations.length})
            </button>
          </div>

          <button
            onClick={activeTab === 'entities' ? handleOpenEntityAdd : handleOpenLocationAdd}
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
                    className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
                    title="Edit Entity"
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
                    <span className="font-mono font-bold text-slate-800">{entity.npiType2 || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxonomy:</span>
                    <span className="font-mono text-slate-800">{entity.taxonomy || '103K00000X'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">W-9 Form:</span>
                    <span className="font-bold text-emerald-600">✓ On File ({entity.w9Year || '2026'})</span>
                  </div>
                </div>

                {/* Insurance Policies (Section 5.10 compliance) */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">General Liability (GL)</span>
                      <span className="text-slate-500 font-mono text-[10px]">
                        Exp: {entity.generalLiabilityPolicy?.expirationDate || entity.generalLiabilityExpiry || 'Current'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {entity.generalLiabilityPolicy?.carrier || 'Carrier on file'} • Policy #{entity.generalLiabilityPolicy?.policyNumber || entity.generalLiabilityPolicy || 'N/A'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Workers' Comp (WC)</span>
                      <span className="text-slate-500 font-mono text-[10px]">
                        Exp: {entity.workersCompPolicy?.expirationDate || entity.workersCompExpiry || 'Current'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {entity.workersCompPolicy?.carrier || 'Carrier on file'} • Policy #{entity.workersCompPolicy?.policyNumber || entity.workersCompPolicy || 'N/A'}
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
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {loc.id.toUpperCase()}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          loc.locationApprovalStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {loc.locationApprovalStatus || 'Approved'}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 mt-1.5">{loc.name}</h3>
                      <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{loc.address || loc.addressLine1}, {loc.city}, {loc.state} {loc.zip || loc.zipCode}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenLocationEdit(loc)}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
                      title="Edit Location"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Entity & DBA Match Details */}
                  <div className="mt-3 p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs">
                    <div className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">Associated Legal Entity & DBA</div>
                    <div className="font-bold text-slate-900 mt-0.5">{locEntity?.legalName || loc.entityId}</div>
                    <div className="text-xs text-sky-700 font-semibold mt-0.5">DBA: {loc.dba || locEntity?.dba || 'N/A'}</div>
                  </div>

                  {/* Service Types */}
                  <div className="mt-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service Delivery Types</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(loc.serviceTypes || []).map((st) => (
                        <span key={st} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operational & Compliance Attributes */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Effective Date:</span>
                      <span className="font-semibold text-slate-800">{loc.effectiveDate || '2023-01-01'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Lease / Sublease:</span>
                      <span className="font-semibold text-slate-800 flex items-center space-x-1">
                        <span>{loc.leaseAgreementStatus}</span>
                        {(loc.leaseExpiryDate || loc.leaseExpirationDate) && (
                          <span className="text-[10px] text-slate-500">({loc.leaseExpiryDate || loc.leaseExpirationDate})</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">PAVE Status:</span>
                      <span className={`font-bold ${
                        (loc.paveStatus || loc.paveLocationStatus) === 'Approved' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {loc.paveStatus || loc.paveLocationStatus || 'Approved'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Insurance Docs (GL, WC):</span>
                      <span className={`font-bold flex items-center space-x-1 ${
                        loc.insuranceCoverageValid ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{loc.insuranceCoverageValid ? 'Verified On-File' : 'Action Required'}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payer Applicability:</span>
                      <span className="font-semibold text-slate-700">
                        {Array.isArray(loc.payerApplicability) ? loc.payerApplicability.join(', ') : 'All Payers'}
                      </span>
                    </div>
                    {loc.phone && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Contact / Phone:</span>
                        <span className="text-slate-700 font-medium">{loc.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Enrolled Applications:</span>
                  <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">{locRecords.length} Records</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Add Entity Modal */}
      {isEntityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingEntity ? 'Edit Legal Entity Parameters' : 'Create Legal Entity'}
                </h3>
                <p className="text-[11px] text-slate-500">Entity Master supports W-9, lease entity, and group naming configuration.</p>
              </div>
              <button onClick={() => setIsEntityModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
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
                  placeholder="e.g. AGES Learning Solutions"
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
                    placeholder="GL-XXXXXX"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Workers' Comp Policy #</label>
                  <input
                    type="text"
                    value={entityForm.wcPolicyNumber}
                    onChange={(e) => setEntityForm({ ...entityForm, wcPolicyNumber: e.target.value })}
                    placeholder="WC-XXXXXX"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">WC Expiration Date</label>
                  <input
                    type="date"
                    value={entityForm.wcExpirationDate}
                    onChange={(e) => setEntityForm({ ...entityForm, wcExpirationDate: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEntityModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer"
                >
                  {editingEntity ? 'Save Changes' : 'Create Entity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit/Add Location Modal (Section 5.9 Full Coverage) */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white p-6 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingLocation ? 'Edit Practice Location' : 'Add New Practice Location'}
                </h3>
                <p className="text-[11px] text-slate-500">Configure address, entity match, lease documentation, service types, and PAVE status.</p>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="font-semibold text-slate-700">Location / Center Name *</label>
                <input
                  type="text"
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                  placeholder="e.g. Livermore Clinic, Vacaville Satellite Clinic, South Jordan Center"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  required
                />
              </div>

              {/* Entity & DBA Match */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Associated Legal Entity *</label>
                  <select
                    value={locationForm.entityId}
                    onChange={(e) => {
                      const newEntId = e.target.value;
                      const matchEnt = entities.find(ent => ent.id === newEntId);
                      setLocationForm({
                        ...locationForm,
                        entityId: newEntId,
                        dba: matchEnt?.dba || locationForm.dba
                      });
                    }}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                    required
                  >
                    {entities.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.legalName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Doing Business As (DBA)</label>
                  <input
                    type="text"
                    value={locationForm.dba}
                    onChange={(e) => setLocationForm({ ...locationForm, dba: e.target.value })}
                    placeholder="e.g. AGES Learning Solutions"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Address info */}
              <div>
                <label className="font-semibold text-slate-700">Physical Address *</label>
                <input
                  type="text"
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                  placeholder="Street address and Suite/Floor"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">City *</label>
                  <input
                    type="text"
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    placeholder="City"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">State *</label>
                  <input
                    type="text"
                    value={locationForm.state}
                    onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                    placeholder="CA"
                    maxLength={2}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Zip Code</label>
                  <input
                    type="text"
                    value={locationForm.zip}
                    onChange={(e) => setLocationForm({ ...locationForm, zip: e.target.value })}
                    placeholder="94551"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Service Types */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Service Delivery Types (Multi-Select)</label>
                <div className="flex flex-wrap gap-2">
                  {(['In-Clinic', 'In-Home', 'In-School', 'Telehealth'] as ServiceType[]).map((st) => {
                    const isSelected = locationForm.serviceTypes.includes(st);
                    return (
                      <button
                        type="button"
                        key={st}
                        onClick={() => toggleServiceType(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{st}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lease & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Lease Agreement</label>
                  <select
                    value={locationForm.leaseAgreementStatus}
                    onChange={(e) => setLocationForm({ ...locationForm, leaseAgreementStatus: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="Active">Active Lease</option>
                    <option value="Sublease">Active Sublease</option>
                    <option value="Not Applicable">Not Applicable (In-Home / Mobile)</option>
                    <option value="Missing">Pending / Missing</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Lease Expiry Date</label>
                  <input
                    type="date"
                    value={locationForm.leaseExpiryDate}
                    onChange={(e) => setLocationForm({ ...locationForm, leaseExpiryDate: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Effective Date</label>
                  <input
                    type="date"
                    value={locationForm.effectiveDate}
                    onChange={(e) => setLocationForm({ ...locationForm, effectiveDate: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* PAVE & Insurance Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">PAVE Status</label>
                  <select
                    value={locationForm.paveStatus}
                    onChange={(e) => setLocationForm({ ...locationForm, paveStatus: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Not Required">Not Required</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Location Approval</label>
                  <select
                    value={locationForm.locationApprovalStatus}
                    onChange={(e) => setLocationForm({ ...locationForm, locationApprovalStatus: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Insurance Docs (GL, WC)</label>
                  <select
                    value={locationForm.insuranceCoverageValid ? 'true' : 'false'}
                    onChange={(e) => setLocationForm({ ...locationForm, insuranceCoverageValid: e.target.value === 'true' })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="true">Verified On-File</option>
                    <option value="false">Missing / Pending</option>
                  </select>
                </div>
              </div>

              {/* Phone & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Location Phone</label>
                  <input
                    type="text"
                    value={locationForm.phone}
                    onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                    placeholder="(925) 447-2000"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Payer Applicability</label>
                  <input
                    type="text"
                    value={Array.isArray(locationForm.payerApplicability) ? locationForm.payerApplicability.join(', ') : 'All'}
                    onChange={(e) => setLocationForm({ ...locationForm, payerApplicability: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="All (or specific payer names)"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer"
                >
                  {editingLocation ? 'Save Location Changes' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

