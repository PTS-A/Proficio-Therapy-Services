import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  Discipline, 
  EmploymentStatus, 
  Provider, 
  ProviderType, 
  ServiceType,
  CAQHStatus,
  PAVEStatus,
  ProviderContractInfo,
  ProviderPayerEnrollment,
  ApplicationType
} from '../../types';
import { 
  AlertCircle, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  ExternalLink, 
  FileSpreadsheet, 
  FileText, 
  Layers, 
  Mail, 
  MapPin, 
  Phone, 
  Plus, 
  Search, 
  ShieldCheck, 
  Trash2, 
  Users, 
  X,
  Check,
  Briefcase,
  Award,
  FileCheck,
  MessageSquare,
  Paperclip,
  ChevronRight
} from 'lucide-react';

import { ClinicalStaffComments } from './ClinicalStaffComments';
import { ClinicalStaffDocuments } from './ClinicalStaffDocuments';
import { ClinicalStaffReviewPage } from './ClinicalStaffReviewPage';

interface ProviderMasterProps {
  onSelectRecord: (recordId: string) => void;
  selectedProviderId?: string | null;
  onClearSelectedProvider?: () => void;
  onNavigateToLinking?: () => void;
  onNavigateToTracker?: () => void;
}

type ProfileTab = 'basic' | 'employment' | 'location' | 'credentialing' | 'comments' | 'documents' | 'applications';
type ModalTab = 'basic' | 'employment' | 'location' | 'credentialing';

export const ProviderMaster: React.FC<ProviderMasterProps> = ({
  onSelectRecord,
  selectedProviderId,
  onClearSelectedProvider,
  onNavigateToLinking,
  onNavigateToTracker,
}) => {
  const {
    providers,
    records,
    payers,
    entities,
    locations,
    users,
    currentUser,
    addProvider,
    updateProvider,
    deleteProvider,
    addProviderCommentLog,
    createRecord,
    isAdmin,
  } = useCredentialing();

  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState<Discipline | 'All'>('All');
  const [activeProfileId, setActiveProfileId] = useState<string | null>(selectedProviderId || providers[0]?.id || null);
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('basic');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>('basic');
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [deleteConfirmProvider, setDeleteConfirmProvider] = useState<Provider | null>(null);

  // Newly Added Staff Banner & Quick Link state
  const [newlyAddedProviderId, setNewlyAddedProviderId] = useState<string | null>(null);
  const [isReviewPageActive, setIsReviewPageActive] = useState<boolean>(false);
  const [reviewingStaffId, setReviewingStaffId] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkPayerId, setLinkPayerId] = useState<string>('');
  const [linkEntityId, setLinkEntityId] = useState<string>('');
  const [linkLocationId, setLinkLocationId] = useState<string>('');
  const [linkAppType, setLinkAppType] = useState<ApplicationType>('Provider linking');
  const [linkSpecialistId, setLinkSpecialistId] = useState<string>('');
  const [linkStatus, setLinkStatus] = useState<'Linked' | 'Pending Approval' | 'In Progress'>('Linked');
  const [linkEffectiveDate, setLinkEffectiveDate] = useState<string>('');
  const [linkNotes, setLinkNotes] = useState<string>('');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccessMsg, setLinkSuccessMsg] = useState<string | null>(null);
  const [linkSuccessRecordId, setLinkSuccessRecordId] = useState<string | null>(null);

  // Form State covering all 4 Core Domains
  const [formData, setFormData] = useState<{
    // 1. Basic Information
    firstName: string;
    lastName: string;
    credentials: string;
    disciplines: Discipline[];
    providerType: ProviderType;
    npi: string;
    licenseNumber: string;
    licenseState: string;
    licenseExpiration: string;
    taxonomy: string;
    specialty: string;
    email: string;
    phone: string;
    altPhone: string;
    contactAddress: string;

    // 2. Employment / Group Information
    entityIds: string[];
    primaryEntityId: string;
    dba: string;
    employmentStatus: EmploymentStatus;
    contractStatus: string;
    startDate: string;
    groupAffiliation: string;
    renderingProviderInfo: string;

    // 3. Location Information
    primaryLocationId: string;
    locationIds: string[];
    additionalLocationIds: string[];
    serviceTypes: ServiceType[];
    locationEffectiveDate: string;

    // 4. Credentialing Information
    caqhId: string;
    caqhStatus: CAQHStatus;
    lastAttestationDate: string;
    nextAttestationDate: string;
    paveStatus: PAVEStatus;
    medicaidId: string;
    npiVerified: boolean;
    effectiveDate: string;
    recredentialingDate: string;
    contractInfo: ProviderContractInfo;
    payerEnrollments: ProviderPayerEnrollment[];
    notes: string;
  }>({
    firstName: '',
    lastName: '',
    credentials: 'MS, BCBA, LBA',
    disciplines: ['ABA'],
    providerType: 'BCBA',
    npi: '',
    licenseNumber: '',
    licenseState: 'CA',
    licenseExpiration: '',
    taxonomy: '103K00000X (Behavior Analyst)',
    specialty: 'Pediatric Applied Behavior Analysis',
    email: '',
    phone: '',
    altPhone: '',
    contactAddress: '',

    entityIds: [entities[0]?.id || 'ent-1'],
    primaryEntityId: entities[0]?.id || 'ent-1',
    dba: entities[0]?.dba || 'AGES Learning Solutions',
    employmentStatus: 'Full-Time',
    contractStatus: 'W-2 Full-Time',
    startDate: new Date().toISOString().split('T')[0],
    groupAffiliation: 'AGES Learning Solutions Clinical Group',
    renderingProviderInfo: 'Type 1 Rendering Clinician providing direct therapy and clinical assessments.',

    primaryLocationId: locations[0]?.id || 'loc-3',
    locationIds: [locations[0]?.id || 'loc-3'],
    additionalLocationIds: [],
    serviceTypes: ['In-Clinic', 'In-Home', 'In-School', 'Telehealth'],
    locationEffectiveDate: new Date().toISOString().split('T')[0],

    caqhId: '',
    caqhStatus: 'Attested',
    lastAttestationDate: new Date().toISOString().split('T')[0],
    nextAttestationDate: '',
    paveStatus: 'Approved',
    medicaidId: '',
    npiVerified: true,
    effectiveDate: new Date().toISOString().split('T')[0],
    recredentialingDate: '',
    contractInfo: {
      contractNumber: '',
      contractType: 'Group Agreement',
      feeScheduleTier: 'Tier 1 Standard',
      contractEffectiveDate: new Date().toISOString().split('T')[0],
      recredentialingCycleYears: 3,
      notes: ''
    },
    payerEnrollments: [],
    notes: '',
  });

  const filteredProviders = providers.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${p.firstName} ${p.lastName}`.toLowerCase().includes(q);
      const matchNpi = p.npi.includes(q);
      const matchLic = p.licenseNumber?.toLowerCase().includes(q);
      const matchCaqh = p.caqhId?.includes(q);
      const matchSpec = p.specialty?.toLowerCase().includes(q);
      if (!matchName && !matchNpi && !matchLic && !matchCaqh && !matchSpec) return false;
    }
    if (disciplineFilter !== 'All' && !p.disciplines.includes(disciplineFilter)) return false;
    return true;
  });

  const activeProvider = providers.find((p) => p.id === (activeProfileId || selectedProviderId)) || filteredProviders[0];

  const handleOpenAdd = () => {
    setEditingProvider(null);
    setModalTab('basic');
    const defaultEntity = entities[0];
    const defaultLocation = locations[0];

    setFormData({
      firstName: '',
      lastName: '',
      credentials: 'MS, BCBA',
      disciplines: ['ABA'],
      providerType: 'BCBA',
      npi: '',
      licenseNumber: '',
      licenseState: 'CA',
      licenseExpiration: '',
      taxonomy: '103K00000X (Behavior Analyst)',
      specialty: 'Pediatric Applied Behavior Analysis',
      email: '',
      phone: '',
      altPhone: '',
      contactAddress: defaultLocation ? `${defaultLocation.address}, ${defaultLocation.city}, ${defaultLocation.state} ${defaultLocation.zip}` : '',

      entityIds: defaultEntity ? [defaultEntity.id] : ['ent-1'],
      primaryEntityId: defaultEntity ? defaultEntity.id : 'ent-1',
      dba: defaultEntity?.dba || 'AGES Learning Solutions',
      employmentStatus: 'Full-Time',
      contractStatus: 'W-2 Full-Time',
      startDate: new Date().toISOString().split('T')[0],
      groupAffiliation: defaultEntity?.legalName || 'AGES Learning Solutions Clinical Group',
      renderingProviderInfo: 'Type 1 Rendering Clinician billed under group Type 2 NPI.',

      primaryLocationId: defaultLocation ? defaultLocation.id : 'loc-3',
      locationIds: defaultLocation ? [defaultLocation.id] : ['loc-3'],
      additionalLocationIds: [],
      serviceTypes: ['In-Clinic', 'In-Home', 'Telehealth'],
      locationEffectiveDate: new Date().toISOString().split('T')[0],

      caqhId: '',
      caqhStatus: 'Attested',
      lastAttestationDate: new Date().toISOString().split('T')[0],
      nextAttestationDate: '',
      paveStatus: 'Approved',
      medicaidId: '',
      npiVerified: true,
      effectiveDate: new Date().toISOString().split('T')[0],
      recredentialingDate: '',
      contractInfo: {
        contractNumber: '',
        contractType: 'Group Agreement',
        feeScheduleTier: 'Tier 1 Standard',
        contractEffectiveDate: new Date().toISOString().split('T')[0],
        recredentialingCycleYears: 3,
        notes: ''
      },
      payerEnrollments: [
        { payerId: 'pyr-aetna', payerName: 'Aetna', status: 'In-Network', effectiveDate: '2025-01-01', recredentialingDate: '2028-01-01', providerIdNumber: '' },
        { payerId: 'pyr-cigna', payerName: 'Cigna', status: 'In-Network', effectiveDate: '2025-01-01', recredentialingDate: '2028-01-01', providerIdNumber: '' }
      ],
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Provider) => {
    setEditingProvider(p);
    setModalTab('basic');
    setFormData({
      firstName: p.firstName,
      lastName: p.lastName,
      credentials: p.credentials || '',
      disciplines: p.disciplines || ['ABA'],
      providerType: p.providerType || 'BCBA',
      npi: p.npi,
      licenseNumber: p.licenseNumber || '',
      licenseState: p.licenseState || 'CA',
      licenseExpiration: p.licenseExpiration || '',
      taxonomy: p.taxonomy || '103K00000X',
      specialty: p.specialty || '',
      email: p.email || '',
      phone: p.phone || '',
      altPhone: p.altPhone || '',
      contactAddress: p.contactAddress || '',

      entityIds: p.entityIds || ['ent-1'],
      primaryEntityId: p.primaryEntityId || p.entityIds?.[0] || 'ent-1',
      dba: p.dba || '',
      employmentStatus: p.employmentStatus || 'Full-Time',
      contractStatus: p.contractStatus || (p.employmentStatus === 'Contractor' ? '1099 Contractor' : 'W-2 Full-Time'),
      startDate: p.startDate || '',
      groupAffiliation: p.groupAffiliation || '',
      renderingProviderInfo: p.renderingProviderInfo || '',

      primaryLocationId: p.primaryLocationId || p.locationIds?.[0] || 'loc-3',
      locationIds: p.locationIds || ['loc-3'],
      additionalLocationIds: p.additionalLocationIds || [],
      serviceTypes: p.serviceTypes || ['In-Clinic', 'In-Home', 'Telehealth'],
      locationEffectiveDate: p.locationEffectiveDate || p.startDate || '',

      caqhId: p.caqhId || '',
      caqhStatus: p.caqhStatus || 'Attested',
      lastAttestationDate: p.lastAttestationDate || '',
      nextAttestationDate: p.nextAttestationDate || '',
      paveStatus: p.paveStatus || 'Approved',
      medicaidId: p.medicaidId || '',
      npiVerified: p.npiVerified !== undefined ? p.npiVerified : true,
      effectiveDate: p.effectiveDate || '',
      recredentialingDate: p.recredentialingDate || '',
      contractInfo: p.contractInfo || {
        contractNumber: '',
        contractType: 'Group Agreement',
        feeScheduleTier: 'Tier 1 Standard',
        contractEffectiveDate: p.startDate || '',
        recredentialingCycleYears: 3,
        notes: ''
      },
      payerEnrollments: p.payerEnrollments || [],
      notes: p.notes || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.npi) {
      alert('Please fill in Provider First Name, Last Name, and 10-Digit NPI.');
      return;
    }

    const payload = {
      ...formData,
      nppesRecordMatch: true,
      npiVerificationDate: new Date().toISOString().split('T')[0],
      active: true,
    };

    if (editingProvider) {
      updateProvider(editingProvider.id, payload);
      setNewlyAddedProviderId(null);
    } else {
      const created = addProvider(payload);
      setActiveProfileId(created.id);
      setActiveProfileTab('basic');
      setNewlyAddedProviderId(created.id);
      setReviewingStaffId(created.id);
      setIsReviewPageActive(true);
      setLinkSuccessMsg(null);
    }

    setIsAddModalOpen(false);
  };

  const handleOpenLinkModal = (providerToLink?: Provider) => {
    const target = providerToLink || activeProvider;
    if (!target) return;
    setLinkPayerId(payers[0]?.id || '');
    setLinkEntityId(target.primaryEntityId || target.entityIds?.[0] || entities[0]?.id || '');
    setLinkLocationId(target.primaryLocationId || target.locationIds?.[0] || locations[0]?.id || '');
    setLinkAppType('Provider linking');
    setLinkSpecialistId(users[0]?.id || currentUser.id);
    setLinkStatus('Linked');
    setLinkEffectiveDate(new Date().toISOString().split('T')[0]);
    setLinkNotes('');
    setLinkError(null);
    setIsLinkModalOpen(true);
  };

  const handleQuickLinkProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProvider) {
      setLinkError('No active clinical staff member selected.');
      return;
    }
    if (!linkPayerId) {
      setLinkError('Please select a Payer / Insurance Network to link with.');
      return;
    }

    const payer = payers.find((p) => p.id === linkPayerId);
    const entity = entities.find((e) => e.id === linkEntityId) || entities[0];
    const location = locations.find((l) => l.id === linkLocationId) || locations[0];
    const assignedUser = users.find((u) => u.id === linkSpecialistId) || users[0] || currentUser;
    const today = new Date().toISOString().split('T')[0];
    const effDate = linkEffectiveDate || today;

    // 1. Create formal Credentialing/Linking Record with linking status so it appears in trackers
    const newRecord = createRecord({
      providerId: activeProvider.id,
      payerId: linkPayerId,
      entityId: entity?.id || 'ent-1',
      locationId: location?.id || 'loc-1',
      applicationType: linkAppType,
      discipline: activeProvider.disciplines[0] || 'ABA',
      stage: linkStatus === 'Linked' ? 'Linked' : 'Linking Pending',
      linkingStatus: linkStatus === 'Linked' ? 'Linked' : 'Pending Approval',
      linkEffectiveDate: effDate,
      contractStatus: 'Contract Executed',
      contractEffectiveDate: effDate,
      assignedSpecialistId: assignedUser.id,
      assignedSpecialistName: assignedUser.name,
      notes: linkNotes || `Linked clinical staff member ${activeProvider.firstName} ${activeProvider.lastName} with ${entity?.dba || entity?.legalName || 'Group'} & ${payer?.name || 'Payer'}.`,
    });

    // 2. Atomically update provider payer enrollments and entity affiliations
    const existingEnrollments = activeProvider.payerEnrollments || [];
    const matchIdx = existingEnrollments.findIndex((e) => e.payerId === linkPayerId);
    const updatedEnrollments = [...existingEnrollments];
    if (matchIdx >= 0) {
      updatedEnrollments[matchIdx] = {
        ...updatedEnrollments[matchIdx],
        status: linkStatus === 'Linked' ? 'In-Network' : 'Application In Progress',
        applicationType: linkAppType,
        effectiveDate: effDate,
        payerName: payer?.name || updatedEnrollments[matchIdx].payerName,
      };
    } else {
      updatedEnrollments.push({
        payerId: linkPayerId,
        payerName: payer?.name || 'Payer Network',
        status: linkStatus === 'Linked' ? 'In-Network' : 'Application In Progress',
        applicationType: linkAppType,
        effectiveDate: effDate,
      });
    }

    const currentEntityIds = activeProvider.entityIds || [];
    const updatedEntityIds = (entity && !currentEntityIds.includes(entity.id))
      ? [...currentEntityIds, entity.id]
      : currentEntityIds;

    updateProvider(activeProvider.id, {
      payerEnrollments: updatedEnrollments,
      entityIds: updatedEntityIds,
      primaryEntityId: activeProvider.primaryEntityId || entity?.id,
      renderingProviderInfo: activeProvider.renderingProviderInfo || `Type 1 Rendering Clinician affiliated with ${entity?.legalName || 'Group'}.`,
    });

    // 3. Log audit comment in status logs
    addProviderCommentLog(activeProvider.id, {
      comment: `Linked staff member with ${entity?.dba || entity?.legalName || 'Practice'} and ${payer?.name || 'Payer'} (${linkAppType}). Status: ${linkStatus}. Effective: ${effDate}.`,
      statusTo: linkStatus === 'Linked' ? 'Linked' : 'In Progress',
      category: 'Payer Review',
      targetPerson: assignedUser.name,
    });

    setLinkSuccessRecordId(newRecord?.id || null);
    setLinkSuccessMsg(`Successfully linked ${activeProvider.firstName} ${activeProvider.lastName} with ${entity?.dba || entity?.legalName} & ${payer?.name}! Record ${newRecord?.id || ''} created.`);
    setIsLinkModalOpen(false);
    setLinkNotes('');
    setLinkError(null);
  };

  const toggleDiscipline = (d: Discipline) => {
    setFormData(prev => {
      const exists = prev.disciplines.includes(d);
      if (exists && prev.disciplines.length === 1) return prev; // Keep at least one
      return {
        ...prev,
        disciplines: exists ? prev.disciplines.filter(x => x !== d) : [...prev.disciplines, d]
      };
    });
  };

  const toggleLocation = (locId: string) => {
    setFormData(prev => {
      const exists = prev.locationIds.includes(locId);
      if (exists && prev.locationIds.length === 1) return prev; // Keep at least one
      const updated = exists ? prev.locationIds.filter(id => id !== locId) : [...prev.locationIds, locId];
      return {
        ...prev,
        locationIds: updated,
        primaryLocationId: updated.includes(prev.primaryLocationId) ? prev.primaryLocationId : updated[0]
      };
    });
  };

  const toggleServiceType = (st: ServiceType) => {
    setFormData(prev => {
      const exists = prev.serviceTypes.includes(st);
      return {
        ...prev,
        serviceTypes: exists ? prev.serviceTypes.filter(x => x !== st) : [...prev.serviceTypes, st]
      };
    });
  };

  // Helper for License Expiry Badge
  const getLicenseStatusBadge = (expirationDate: string) => {
    if (!expirationDate) return null;
    const now = new Date();
    const exp = new Date(expirationDate);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center space-x-1"><AlertTriangle className="w-3 h-3" /><span>Expired</span></span>;
    } else if (diffDays <= 90) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Expiring in {diffDays}d</span></span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>Active ({diffDays}d left)</span></span>;
  };

  if (isReviewPageActive && reviewingStaffId) {
    return (
      <ClinicalStaffReviewPage
        providerId={reviewingStaffId}
        onBackToDirectory={() => setIsReviewPageActive(false)}
        onEditProvider={(p) => {
          setIsReviewPageActive(false);
          handleOpenEdit(p);
        }}
        onSelectRecord={onSelectRecord}
      />
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-sky-600" />
            <span>Clinical Staff Directory & 360° Profile</span>
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive capture of Basic Info, Employment/Group Affiliation, Multi-Location Delivery, CAQH, PAVE, and Payer Contracts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#2B4C9D] hover:bg-[#223E80] text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Clinical Staff</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Provider List & Filters (4.5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          {/* Search & Discipline Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, NPI, license, CAQH, specialty..."
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
                  className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
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
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto pr-1">
            {filteredProviders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No Clinical Staff Records</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Add a new provider or staff member to get started.</p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-3 inline-flex items-center space-x-1 px-3 py-1.5 bg-[#2B4C9D] text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Provider</span>
                </button>
              </div>
            ) : (
              filteredProviders.map((p) => {
                const isSelected = activeProvider?.id === p.id;

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
                      <span className="font-mono font-semibold">NPI: {p.npi}</span>
                      <span>•</span>
                      <span>{p.licenseState} Lic: {p.licenseNumber}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-medium text-slate-700">
                        {p.groupAffiliation || 'Ages Learning Solutions'}
                      </span>
                      <span className={`font-semibold px-2 py-0.2 rounded-md ${
                        p.caqhStatus === 'Attested' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        CAQH: {p.caqhStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Provider 360 Profile (7.5 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {activeProvider ? (
            <>
              {/* Profile Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3.5">
                  <div className="h-13 w-13 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-sky-600/20">
                    {activeProvider.firstName[0]}{activeProvider.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-black text-slate-900">
                        {activeProvider.firstName} {activeProvider.lastName}
                      </h3>
                      <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                        {activeProvider.credentials}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                      <span className="font-semibold text-slate-700">{activeProvider.providerType}</span>
                      <span>•</span>
                      <span className="text-sky-700 font-medium">{activeProvider.specialty}</span>
                      <span>•</span>
                      <span className="text-slate-600 font-semibold">{activeProvider.employmentStatus} ({activeProvider.contractStatus || 'W-2'})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setReviewingStaffId(activeProvider.id);
                      setIsReviewPageActive(true);
                    }}
                    className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-bold transition-all border border-sky-200 flex items-center space-x-1 cursor-pointer"
                    title="Open Dedicated Clinical Review & Provider Linking Page"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Review & Link Page</span>
                  </button>
                  <button
                    onClick={() => handleOpenLinkModal(activeProvider)}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
                    title="Link this Clinical Staff member with Practice Entities and Payer Networks"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Link with Providers</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(activeProvider)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title={isAdmin ? "Edit Clinical Staff Record (Administrator Access)" : "Edit Staff Details"}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (!isAdmin) {
                        alert("Deleting staff records requires ADMINISTRATOR access level.");
                        return;
                      }
                      setDeleteConfirmProvider(activeProvider);
                    }}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isAdmin
                        ? 'text-rose-500 hover:bg-rose-50'
                        : 'text-slate-300 hover:text-slate-400 cursor-not-allowed'
                    }`}
                    title={isAdmin ? "Delete Staff Member (Administrator Only)" : "Deleting staff requires Administrator access"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Newly Added Clinical Staff Confirmation & Quick Link Callout */}
              {newlyAddedProviderId === activeProvider.id && (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in slide-in-from-top duration-300">
                  <div className="flex items-start sm:items-center space-x-2.5">
                    <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold">Clinical Staff Member Successfully Created!</p>
                      <p className="text-emerald-700 text-[11px] mt-0.5">
                        You are viewing the current inputted data for <strong>{activeProvider.firstName} {activeProvider.lastName}</strong>. Link them with payers/provider networks below to start credentialing enrollment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setReviewingStaffId(activeProvider.id);
                        setIsReviewPageActive(true);
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer text-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open Review & Linking Page</span>
                    </button>
                    <button
                      onClick={() => handleOpenLinkModal(activeProvider)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Link with Providers</span>
                    </button>
                    <button
                      onClick={() => setNewlyAddedProviderId(null)}
                      className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                      title="Dismiss notice"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Success notification for linking */}
              {linkSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{linkSuccessMsg}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    {linkSuccessRecordId && (
                      <button
                        onClick={() => onSelectRecord(linkSuccessRecordId)}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer"
                      >
                        View Record
                      </button>
                    )}
                    {onNavigateToLinking && (
                      <button
                        onClick={onNavigateToLinking}
                        className="px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] shadow-xs cursor-pointer"
                      >
                        View in Staff Linking
                      </button>
                    )}
                    <button 
                      onClick={() => { setLinkSuccessMsg(null); setLinkSuccessRecordId(null); }} 
                      className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Navigation for Provider Record Detail */}
              <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setActiveProfileTab('basic')}
                  className={`px-3.5 py-2 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activeProfileTab === 'basic'
                      ? 'border-sky-600 text-sky-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1. Basic & Licensure</span>
                </button>
                <button
                  onClick={() => setActiveProfileTab('employment')}
                  className={`px-3.5 py-2 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activeProfileTab === 'employment'
                      ? 'border-sky-600 text-sky-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>2. Employment & Group</span>
                </button>
                <button
                  onClick={() => setActiveProfileTab('location')}
                  className={`px-3.5 py-2 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activeProfileTab === 'location'
                      ? 'border-sky-600 text-sky-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>3. Location Info</span>
                </button>
                <button
                  onClick={() => setActiveProfileTab('credentialing')}
                  className={`px-3.5 py-2 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activeProfileTab === 'credentialing'
                      ? 'border-sky-600 text-sky-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>4. Credentialing & CAQH</span>
                </button>
                <button
                  onClick={() => setActiveProfileTab('comments')}
                  className={`px-3.5 py-2 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activeProfileTab === 'comments'
                      ? 'border-sky-600 text-sky-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Comments & Status Logs ({(activeProvider.commentLogs || []).length})</span>
                </button>
                <button
                  onClick={() => setActiveProfileTab('documents')}
                  className={`px-3.5 py-2 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activeProfileTab === 'documents'
                      ? 'border-sky-600 text-sky-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Document Links ({(activeProvider.documents || []).length})</span>
                </button>
                <button
                  onClick={() => setActiveProfileTab('applications')}
                  className={`px-3.5 py-2 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activeProfileTab === 'applications'
                      ? 'border-sky-600 text-sky-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Payer Enrollments ({records.filter(r => r.providerId === activeProvider.id).length})</span>
                </button>
              </div>

              {/* TAB 1: BASIC INFORMATION */}
              {activeProfileTab === 'basic' && (
                <div className="space-y-4 pt-1">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-sky-600" />
                        <span>Professional Licensure & Taxonomy</span>
                      </span>
                      {getLicenseStatusBadge(activeProvider.licenseExpiration)}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">10-Digit NPI</span>
                        <div className="font-mono font-bold text-slate-900 mt-0.5 flex items-center space-x-1">
                          <span>{activeProvider.npi}</span>
                          <a
                            href={`https://npiregistry.cms.hhs.gov/search?number=${activeProvider.npi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-800 inline-flex items-center"
                            title="Verify in CMS NPPES Registry"
                          >
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-0.5 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 inline" />
                          <span>NPPES Registry Match</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">License Number</span>
                        <div className="font-bold text-slate-800 mt-0.5">
                          {activeProvider.licenseNumber} ({activeProvider.licenseState})
                        </div>
                        <span className="text-[10px] text-slate-500">State: {activeProvider.licenseState}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">License Expiration</span>
                        <div className="font-bold text-slate-800 mt-0.5">{activeProvider.licenseExpiration}</div>
                        <span className="text-[10px] text-slate-500">Board renewal cycle</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Discipline & Type</span>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {(activeProvider.disciplines || []).join(', ') || 'General Practice'} • {activeProvider.providerType}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Taxonomy Code</span>
                        <div className="font-mono text-slate-800 font-bold mt-0.5">{activeProvider.taxonomy}</div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Clinical Specialty</span>
                        <div className="font-semibold text-slate-800 mt-0.5">{activeProvider.specialty}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center space-x-1.5">
                      <Mail className="w-4 h-4 text-sky-600" />
                      <span>Contact Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Email Address</span>
                          <a href={`mailto:${activeProvider.email}`} className="text-sky-700 font-semibold hover:underline">
                            {activeProvider.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Phone Number</span>
                          <span className="text-slate-800 font-semibold">{activeProvider.phone}</span>
                          {activeProvider.altPhone && (
                            <span className="text-slate-500 text-[10px] block">Alt: {activeProvider.altPhone}</span>
                          )}
                        </div>
                      </div>

                      {activeProvider.contactAddress && (
                        <div className="sm:col-span-2 flex items-start space-x-2 pt-1 border-t border-slate-100">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Practice / Mailing Address</span>
                            <span className="text-slate-800 font-medium">{activeProvider.contactAddress}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dedicated Section: Linked Providers, Group Entities & Payer Networks */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs space-y-3">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-900 font-bold">Linked Providers, Group Entities & Payers</span>
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                              {records.filter(r => r.providerId === activeProvider.id).length + (activeProvider.payerEnrollments || []).length} Active Link(s)
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-normal block">
                            Practice group affiliations, Type 2 Group NPI linkages, and enrolled insurance networks
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenLinkModal(activeProvider)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                        title="Link this Clinical Staff member with Practice Entities or Payer Networks"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Link with Providers</span>
                      </button>
                    </div>

                    {/* Table of Linked Providers / Payers */}
                    {(() => {
                      const staffRecords = records.filter(r => r.providerId === activeProvider.id);
                      const staffEnrollments = activeProvider.payerEnrollments || [];

                      if (staffRecords.length === 0 && staffEnrollments.length === 0) {
                        return (
                          <div className="p-6 text-center border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
                            <Building2 className="w-8 h-8 mx-auto text-emerald-600/50 mb-1.5" />
                            <p className="font-bold text-slate-800 text-xs">No Providers or Payers Linked Yet</p>
                            <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-0.5 mb-3">
                              Click the plus sign below to link <strong>{activeProvider.firstName} {activeProvider.lastName}</strong> with practice group entities, billing providers, and insurance payer networks.
                            </p>
                            <button
                              type="button"
                              onClick={() => handleOpenLinkModal(activeProvider)}
                              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Link with Providers</span>
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                              <tr>
                                <th className="px-3 py-2">Practice Provider / Entity</th>
                                <th className="px-3 py-2">Payer / Health Plan</th>
                                <th className="px-3 py-2">Application Type</th>
                                <th className="px-3 py-2">Linking Status</th>
                                <th className="px-3 py-2">Effective Date</th>
                                <th className="px-3 py-2 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {staffRecords.map((rec) => {
                                const payer = payers.find(p => p.id === rec.payerId);
                                const entity = entities.find(e => e.id === rec.entityId);
                                return (
                                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2 font-semibold text-slate-900">
                                      <div className="flex items-center space-x-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>{entity?.dba || entity?.legalName || 'AGES Learning Solutions'}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-mono pl-5">EIN: {entity?.ein || '47-2891234'}</div>
                                    </td>
                                    <td className="px-3 py-2 font-medium text-slate-800">
                                      <div className="font-semibold text-sky-800">{payer?.name || 'Payer Network'}</div>
                                      <div className="text-[10px] text-slate-400">{payer?.type || (Array.isArray((payer as any)?.lob) ? (payer as any).lob.join(', ') : 'Commercial / Medicaid')}</div>
                                    </td>
                                    <td className="px-3 py-2 text-slate-600">
                                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                                        {rec.applicationType}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2">
                                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                        rec.linkingStatus === 'Linked' || rec.stage === 'Approved' || rec.stage === 'Effective'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}>
                                        {rec.linkingStatus || rec.stage}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-slate-600 font-mono text-[11px]">
                                      {rec.linkEffectiveDate || rec.contractEffectiveDate || rec.approvalDate || 'Pending'}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                      <button
                                        type="button"
                                        onClick={() => onSelectRecord(rec.id)}
                                        className="text-sky-600 hover:text-sky-800 font-bold hover:underline cursor-pointer text-[11px] inline-flex items-center space-x-0.5"
                                      >
                                        <span>View Details</span>
                                        <ChevronRight className="w-3 h-3" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                              {/* Direct enrollments without a record yet */}
                              {staffEnrollments
                                .filter(e => !staffRecords.some(r => r.payerId === e.payerId))
                                .map((enr, idx) => (
                                  <tr key={`enr-${idx}`} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2 font-semibold text-slate-900">
                                      <div className="flex items-center space-x-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>Primary Practice Group</span>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 font-medium text-slate-800">
                                      <div className="font-semibold text-sky-800">{enr.payerName}</div>
                                    </td>
                                    <td className="px-3 py-2 text-slate-600">
                                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                                        {enr.applicationType || 'Direct Enrollment'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2">
                                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                                        {enr.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-slate-600 font-mono text-[11px]">
                                      {enr.effectiveDate || 'Active'}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                      <span className="text-[10px] text-slate-400 font-semibold">Enrolled</span>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* TAB 2: EMPLOYMENT / GROUP INFORMATION */}
              {activeProfileTab === 'employment' && (
                <div className="space-y-4 pt-1">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <Briefcase className="w-4 h-4 text-sky-600" />
                        <span>Employment & Group Affiliation Master</span>
                      </span>
                      <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Start Date: {activeProvider.startDate}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Group / Legal Entity</span>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {entities.find(e => e.id === (activeProvider.primaryEntityId || activeProvider.entityIds[0]))?.legalName || activeProvider.groupAffiliation}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          EIN: {entities.find(e => e.id === (activeProvider.primaryEntityId || activeProvider.entityIds[0]))?.ein || '47-2891234'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Doing Business As (DBA)</span>
                        <div className="font-bold text-sky-900 mt-0.5">
                          {activeProvider.dba || entities.find(e => e.id === (activeProvider.primaryEntityId || activeProvider.entityIds[0]))?.dba || 'AGES Learning Solutions'}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Employment / Contract Status</span>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {activeProvider.employmentStatus} • {activeProvider.contractStatus || 'W-2 Full-Time'}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Group Affiliation</span>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {activeProvider.groupAffiliation || 'Ages Learning Solutions Clinical Group'}
                        </div>
                      </div>

                      <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Rendering Provider Information</span>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 mt-1">
                          {activeProvider.renderingProviderInfo || 'Type 1 Rendering Provider. Claims billed under Group Type 2 NPI.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Affiliated Entities Multi-Match */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 mb-2">Affiliated Legal Entities ({activeProvider.entityIds.length})</div>
                    <div className="space-y-1.5">
                      {activeProvider.entityIds.map(entId => {
                        const ent = entities.find(e => e.id === entId);
                        return (
                          <div key={entId} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                            <div>
                              <span className="font-bold text-slate-800">{ent?.legalName || entId}</span>
                              <span className="text-slate-500 text-[10px] ml-2">DBA: {ent?.dba || 'N/A'}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              W-9 On File ({ent?.w9Year || '2026'})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LOCATION INFORMATION */}
              {activeProfileTab === 'location' && (
                <div className="space-y-4 pt-1">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-sky-600" />
                        <span>Practice Locations & Service Delivery</span>
                      </span>
                      <span className="text-slate-500 font-semibold text-[11px]">
                        Location Effective: {activeProvider.locationEffectiveDate || activeProvider.startDate}
                      </span>
                    </div>

                    {/* Primary Location */}
                    {(() => {
                      const primLoc = locations.find(l => l.id === (activeProvider.primaryLocationId || activeProvider.locationIds[0]));
                      return (
                        <div className="p-3 bg-white rounded-xl border border-sky-200 shadow-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="bg-sky-600 text-white font-bold px-2 py-0.5 rounded-md text-[10px]">
                                Primary Location
                              </span>
                              <span className="font-bold text-slate-900 text-xs">{primLoc?.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              PAVE: {primLoc?.paveStatus || 'Approved'}
                            </span>
                          </div>
                          <div className="text-slate-600 mt-1 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{primLoc?.address || primLoc?.addressLine1}, {primLoc?.city}, {primLoc?.state} {primLoc?.zip || primLoc?.zipCode}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Service Types */}
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                        Approved Service Delivery Types
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(activeProvider.serviceTypes || ['In-Clinic', 'In-Home', 'Telehealth']).map(st => (
                          <span key={st} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-800 shadow-xs flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{st}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* All Service Locations */}
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-2">
                        All Assigned Service Locations ({activeProvider.locationIds.length})
                      </span>
                      <div className="space-y-2">
                        {activeProvider.locationIds.map(locId => {
                          const loc = locations.find(l => l.id === locId);
                          if (!loc) return null;
                          const isPrim = loc.id === (activeProvider.primaryLocationId || activeProvider.locationIds[0]);

                          return (
                            <div key={locId} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                              <div>
                                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                                  <span>{loc.name}</span>
                                  {isPrim && <span className="text-[9px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-sm font-bold">Primary</span>}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {loc.address || loc.addressLine1}, {loc.city}, {loc.state} {loc.zip || loc.zipCode}
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold">
                                Lease: {loc.leaseAgreementStatus}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CREDENTIALING INFORMATION */}
              {activeProfileTab === 'credentialing' && (
                <div className="space-y-4 pt-1">
                  {/* Master Verifications Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* CAQH ProView Status */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-slate-500 flex items-center justify-between text-[11px]">
                        <span className="font-bold">CAQH ProView</span>
                        <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold">#{activeProvider.caqhId || 'N/A'}</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1.5 flex items-center space-x-1">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                          activeProvider.caqhStatus === 'Attested' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {activeProvider.caqhStatus}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Next Attestation: <strong>{activeProvider.nextAttestationDate || 'Due Quarterly'}</strong>
                      </div>
                    </div>

                    {/* PAVE Medi-Cal */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-slate-500 flex items-center justify-between text-[11px]">
                        <span className="font-bold">PAVE / Medi-Cal</span>
                        <span className="font-bold text-[10px] text-sky-700">DHCS CA</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                          activeProvider.paveStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {activeProvider.paveStatus}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Medicaid ID: <strong>{activeProvider.medicaidId || 'Pending DHCS'}</strong>
                      </div>
                    </div>

                    {/* Effective & Recred Dates */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-slate-500 flex items-center justify-between text-[11px]">
                        <span className="font-bold">Credentialing Cycle</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="text-[11px] text-slate-700 mt-1">
                        Effective: <strong>{activeProvider.effectiveDate || activeProvider.startDate}</strong>
                      </div>
                      <div className="text-[11px] text-amber-700 mt-0.5">
                        Recred Due: <strong>{activeProvider.recredentialingDate || '3-Year Cycle'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Contract Information */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center space-x-1.5">
                      <FileCheck className="w-4 h-4 text-sky-600" />
                      <span>Contract Information & Fee Schedule</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contract Number</span>
                        <div className="font-mono font-bold text-slate-800 mt-0.5">
                          {activeProvider.contractInfo?.contractNumber || 'CNT-GRP-2024'}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contract Type</span>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {activeProvider.contractInfo?.contractType || 'Group Participating Agreement'}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Fee Schedule Tier</span>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {activeProvider.contractInfo?.feeScheduleTier || 'Tier 1 Standard'}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contract Effective Date</span>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {activeProvider.contractInfo?.contractEffectiveDate || activeProvider.startDate}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Recredentialing Cycle</span>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {activeProvider.contractInfo?.recredentialingCycleYears || 3} Years
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contract Notes</span>
                        <div className="text-slate-600 text-[11px] mt-0.5 truncate">
                          {activeProvider.contractInfo?.notes || 'Active master agreement'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payer Enrollment Directory */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                        <span>Payer Enrollment Information Matrix</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {(activeProvider.payerEnrollments || []).length} Configured Payers
                      </span>
                    </div>

                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
                      {(activeProvider.payerEnrollments && activeProvider.payerEnrollments.length > 0) ? (
                        activeProvider.payerEnrollments.map((pe, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-slate-900">{pe.payerName}</div>
                              <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                                {pe.providerIdNumber && <span>PIN: <strong>{pe.providerIdNumber}</strong></span>}
                                {pe.effectiveDate && <span>• Eff: {pe.effectiveDate}</span>}
                                {pe.recredentialingDate && <span>• Recred: {pe.recredentialingDate}</span>}
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              pe.status === 'In-Network' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {pe.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-slate-400 text-center text-xs">
                          No direct payer enrollment records configured yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: COMMENTS & STATUS LOGS WITH MULTI-STAFF COLLABORATION */}
              {activeProfileTab === 'comments' && (
                <ClinicalStaffComments provider={activeProvider} />
              )}

              {/* TAB 6: DOCUMENT LINKS & CREDENTIAL REPOSITORY */}
              {activeProfileTab === 'documents' && (
                <ClinicalStaffDocuments provider={activeProvider} />
              )}

              {/* TAB 7: ACTIVE PAYER APPLICATIONS (from Credentialing Engine) */}
              {activeProfileTab === 'applications' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900">
                      Active Credentialing Applications for {activeProvider.firstName} {activeProvider.lastName}
                    </h4>
                    <span className="text-[10px] text-slate-500">Click any application to open detail view</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                    {records
                      .filter((r) => r.providerId === activeProvider.id)
                      .map((rec) => {
                        const payer = payers.find((p) => p.id === rec.payerId);
                        return (
                          <div
                            key={rec.id}
                            onClick={() => onSelectRecord(rec.id)}
                            className="p-3.5 bg-white hover:bg-sky-50/50 flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">{rec.id}</span>
                                <span className="font-bold text-slate-900">{payer?.name}</span>
                                <span className="text-slate-400 text-[10px]">({rec.applicationType})</span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2">
                                <span>Stage: <strong className="text-slate-800">{rec.stage}</strong></span>
                                <span>•</span>
                                <span>Target TAT: {rec.targetTurnaroundDate || '60 days'}</span>
                                <span>•</span>
                                <span>Next Follow-up: {rec.nextFollowUpDate || 'None scheduled'}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                rec.stage === 'Approved' || rec.stage === 'Linked' || rec.stage === 'Effective'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : rec.isOverdue
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}>
                                {rec.stage}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    {records.filter((r) => r.providerId === activeProvider.id).length === 0 && (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No active credentialing applications for this provider yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <h4 className="text-xs font-bold text-slate-700">No Clinical Staff Member Selected</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                {providers.length === 0 
                  ? "Your database is clean and ready. Add your first clinical staff member to begin tracking 360° credentialing profiles."
                  : "Select a provider from the roster on the left to view comprehensive credentials, license attestations, and active applications."}
              </p>
              {providers.length === 0 && (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#2B4C9D] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Provider</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Complete Add / Edit Provider Modal with 4 Category Tabs */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white p-6 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingProvider ? 'Edit Clinical Staff Record' : 'Add New Clinical Staff Record'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Capture Basic Info, Employment/Group Affiliation, Practice Locations, CAQH & Credentialing.
                </p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mt-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalTab('basic')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  modalTab === 'basic' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                1. Basic Info
              </button>
              <button
                type="button"
                onClick={() => setModalTab('employment')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  modalTab === 'employment' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                2. Employment & Group
              </button>
              <button
                type="button"
                onClick={() => setModalTab('location')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  modalTab === 'location' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                3. Locations
              </button>
              <button
                type="button"
                onClick={() => setModalTab('credentialing')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  modalTab === 'credentialing' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                4. Credentialing & Contracts
              </button>
            </div>

            <form onSubmit={handleSaveProvider} className="space-y-4 text-xs mt-4">
              {/* MODAL TAB 1: BASIC INFORMATION */}
              {modalTab === 'basic' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="e.g. Ashley"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="e.g. Vanderbilt"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Credentials *</label>
                      <input
                        type="text"
                        placeholder="e.g. MS, BCBA, LBA"
                        value={formData.credentials}
                        onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">10-Digit NPI *</label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="10 digit Individual NPI"
                        value={formData.npi}
                        onChange={(e) => setFormData({ ...formData, npi: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Discipline</label>
                      <div className="flex space-x-1 mt-1">
                        {(['ABA', 'Speech', 'OT'] as Discipline[]).map(d => {
                          const isSel = formData.disciplines.includes(d);
                          return (
                            <button
                              type="button"
                              key={d}
                              onClick={() => toggleDiscipline(d)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                isSel ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Provider Type *</label>
                      <select
                        value={formData.providerType}
                        onChange={(e) => setFormData({ ...formData, providerType: e.target.value as ProviderType })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer font-medium"
                      >
                        <optgroup label="Applied Behavior Analysis (ABA)">
                          <option value="BCBA">BCBA (Board Certified Behavior Analyst)</option>
                          <option value="BCaBA">BCaBA (Assistant Behavior Analyst)</option>
                          <option value="RBT">RBT (Registered Behavior Technician)</option>
                          <option value="ABA Therapist">ABA Therapist</option>
                          <option value="Clinical Director">Clinical Director</option>
                        </optgroup>
                        <optgroup label="Speech-Language Pathology (Speech)">
                          <option value="SLP">SLP (Speech-Language Pathologist)</option>
                          <option value="SLPA">SLPA (Speech-Language Pathology Assistant)</option>
                        </optgroup>
                        <optgroup label="Occupational Therapy (OT)">
                          <option value="OTR/L">OTR/L (Occupational Therapist)</option>
                          <option value="COTA">COTA (Occupational Therapy Assistant)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">License Number *</label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="e.g. LBA-CA-9021"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">License State *</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={formData.licenseState}
                        onChange={(e) => setFormData({ ...formData, licenseState: e.target.value.toUpperCase() })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-mono"
                        placeholder="CA"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">License Expiration Date *</label>
                      <input
                        type="date"
                        value={formData.licenseExpiration}
                        onChange={(e) => setFormData({ ...formData, licenseExpiration: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Taxonomy Code & Title</label>
                      <input
                        type="text"
                        value={formData.taxonomy}
                        onChange={(e) => setFormData({ ...formData, taxonomy: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                        placeholder="103K00000X (Behavior Analyst)"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Specialty</label>
                      <input
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="e.g. Pediatric Autism Spectrum & Early Intervention"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="provider@practice.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Phone Number *</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="(408) 555-0129"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL TAB 2: EMPLOYMENT & GROUP INFORMATION */}
              {modalTab === 'employment' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Primary Group / Legal Entity *</label>
                      <select
                        value={formData.primaryEntityId}
                        onChange={(e) => {
                          const entId = e.target.value;
                          const chosen = entities.find(ent => ent.id === entId);
                          setFormData({
                            ...formData,
                            primaryEntityId: entId,
                            entityIds: Array.from(new Set([entId, ...formData.entityIds])),
                            dba: chosen?.dba || formData.dba,
                            groupAffiliation: chosen?.legalName || formData.groupAffiliation
                          });
                        }}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                        required
                      >
                        {entities.map(ent => (
                          <option key={ent.id} value={ent.id}>{ent.legalName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Doing Business As (DBA)</label>
                      <input
                        type="text"
                        value={formData.dba}
                        onChange={(e) => setFormData({ ...formData, dba: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                        placeholder="e.g. AGES Learning Solutions"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Employment Status</label>
                      <select
                        value={formData.employmentStatus}
                        onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contractor">Contractor (1099)</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Contract Classification</label>
                      <select
                        value={formData.contractStatus}
                        onChange={(e) => setFormData({ ...formData, contractStatus: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="W-2 Full-Time">W-2 Full-Time</option>
                        <option value="W-2 Part-Time">W-2 Part-Time</option>
                        <option value="1099 Contractor">1099 Independent Contractor</option>
                        <option value="Independent Consultant">Independent Consultant</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Clinical Start Date *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Group Affiliation Name</label>
                    <input
                      type="text"
                      value={formData.groupAffiliation}
                      onChange={(e) => setFormData({ ...formData, groupAffiliation: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      placeholder="e.g. AGES Learning Solutions Clinical Group"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Rendering Provider Information</label>
                    <textarea
                      rows={2}
                      value={formData.renderingProviderInfo}
                      onChange={(e) => setFormData({ ...formData, renderingProviderInfo: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      placeholder="e.g. Renders ABA clinical supervisory services & direct assessments. Type 1 Rendering NPI under Group Type 2 NPI."
                    />
                  </div>
                </div>
              )}

              {/* MODAL TAB 3: LOCATION INFORMATION */}
              {modalTab === 'location' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Primary Practice Location *
                    </label>
                    <select
                      value={formData.primaryLocationId}
                      onChange={(e) => {
                        const newPrim = e.target.value;
                        const targetLoc = locations.find(l => l.id === newPrim);
                        let updatedServices = [...formData.serviceTypes];
                        if (targetLoc?.serviceTypes?.includes('In-Home') && !updatedServices.includes('In-Home')) {
                          updatedServices.push('In-Home');
                        }
                        setFormData({
                          ...formData,
                          primaryLocationId: newPrim,
                          serviceTypes: updatedServices,
                          locationIds: Array.from(new Set([newPrim, ...formData.locationIds]))
                        });
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                      required
                    >
                      {locations.map(loc => {
                        const isInHome = loc.locationType === 'In-Home / Mobile' || loc.serviceTypes?.includes('In-Home');
                        return (
                          <option key={loc.id} value={loc.id}>
                            {isInHome ? '🏠 [In-Home / Mobile] ' : '🏥 [Clinic] '}
                            {loc.name} ({loc.city}, {loc.state})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">
                      Service Delivery Types (Multi-Select)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['In-Clinic', 'In-Home', 'In-School', 'Telehealth'] as ServiceType[]).map(st => {
                        const isSel = formData.serviceTypes.includes(st);
                        return (
                          <button
                            type="button"
                            key={st}
                            onClick={() => toggleServiceType(st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                              isSel 
                                ? st === 'In-Home' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-sky-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSel && <Check className="w-3.5 h-3.5" />}
                            <span>{st}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">
                        All Assigned Service Locations (Multi-Select)
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formData.locationIds.length} of {locations.length} selected
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {locations.map(loc => {
                        const isChecked = formData.locationIds.includes(loc.id);
                        const isInHome = loc.locationType === 'In-Home / Mobile' || loc.serviceTypes?.includes('In-Home');
                        return (
                          <div
                            key={loc.id}
                            onClick={() => toggleLocation(loc.id)}
                            className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                              isChecked 
                                ? isInHome 
                                  ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20' 
                                  : 'bg-white border-sky-500 shadow-xs ring-1 ring-sky-500/20' 
                                : 'bg-slate-100/60 border-transparent text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center space-x-1.5">
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                  isInHome ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                                }`}>
                                  {isInHome ? 'In-Home' : 'Clinic'}
                                </span>
                                <span className="font-bold text-slate-900 truncate">{loc.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                                {loc.city}, {loc.state} {loc.countiesServed && loc.countiesServed.length > 0 ? `• ${loc.countiesServed.slice(0, 2).join(', ')}` : ''}
                              </div>
                            </div>
                            {isChecked && (
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isInHome ? 'text-emerald-600' : 'text-sky-600'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Location Effective Date</label>
                    <input
                      type="date"
                      value={formData.locationEffectiveDate}
                      onChange={(e) => setFormData({ ...formData, locationEffectiveDate: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* MODAL TAB 4: CREDENTIALING & CONTRACTS */}
              {modalTab === 'credentialing' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">CAQH ProView ID</label>
                      <input
                        type="text"
                        value={formData.caqhId}
                        onChange={(e) => setFormData({ ...formData, caqhId: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                        placeholder="8-digit ID"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">CAQH Status</label>
                      <select
                        value={formData.caqhStatus}
                        onChange={(e) => setFormData({ ...formData, caqhStatus: e.target.value as any })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="Attested">Attested (Active)</option>
                        <option value="Complete">Complete (Pending Attestation)</option>
                        <option value="Re-attestation Due">Re-attestation Due</option>
                        <option value="Initial">Initial Draft</option>
                        <option value="Discrepancy">Discrepancy</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">PAVE / Medi-Cal Status</label>
                      <select
                        value={formData.paveStatus}
                        onChange={(e) => setFormData({ ...formData, paveStatus: e.target.value as any })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Submitted">Submitted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Additional Docs Requested">Additional Docs Requested</option>
                        <option value="Returned">Returned for Corrections</option>
                        <option value="Not Required">Not Required</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Medicaid / Medi-Cal ID</label>
                      <input
                        type="text"
                        placeholder="e.g. MED-CA-9921"
                        value={formData.medicaidId}
                        onChange={(e) => setFormData({ ...formData, medicaidId: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Credentialing Effective Date</label>
                      <input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Next Recredentialing Date</label>
                      <input
                        type="date"
                        value={formData.recredentialingDate}
                        onChange={(e) => setFormData({ ...formData, recredentialingDate: e.target.value })}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Contract Information Group */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="font-bold text-slate-900 text-xs">Contract Parameters</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700">Contract Number</label>
                        <input
                          type="text"
                          value={formData.contractInfo.contractNumber || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            contractInfo: { ...formData.contractInfo, contractNumber: e.target.value }
                          })}
                          placeholder="e.g. CNT-AGES-2024"
                          className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Contract Type</label>
                        <input
                          type="text"
                          value={formData.contractInfo.contractType || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            contractInfo: { ...formData.contractInfo, contractType: e.target.value }
                          })}
                          placeholder="Group Agreement"
                          className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Fee Schedule Tier</label>
                        <input
                          type="text"
                          value={formData.contractInfo.feeScheduleTier || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            contractInfo: { ...formData.contractInfo, feeScheduleTier: e.target.value }
                          })}
                          placeholder="Tier 1 Standard"
                          className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex space-x-1">
                  {modalTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === 'employment') setModalTab('basic');
                        if (modalTab === 'location') setModalTab('employment');
                        if (modalTab === 'credentialing') setModalTab('location');
                      }}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer font-semibold"
                    >
                      ← Previous Section
                    </button>
                  )}
                  {modalTab !== 'credentialing' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === 'basic') setModalTab('employment');
                        if (modalTab === 'employment') setModalTab('location');
                        if (modalTab === 'location') setModalTab('credentialing');
                      }}
                      className="px-3 py-1.5 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg cursor-pointer font-semibold"
                    >
                      Next Section →
                    </button>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#2B4C9D] hover:bg-[#223E80] rounded-lg shadow-xs cursor-pointer"
                  >
                    {editingProvider ? 'Save Staff Record' : 'Create Staff Record'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Clinical Staff with Provider/Payer Modal */}
      {isLinkModalOpen && activeProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Link Clinical Staff with Providers & Payers</h3>
                  <p className="text-[11px] text-emerald-100">
                    {activeProvider.firstName} {activeProvider.lastName} ({activeProvider.credentials}) • NPI: {activeProvider.npi}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickLinkProvider} className="p-5 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[11px] text-emerald-900">
                <strong>Credentialing & Provider Linking:</strong> Select the practice group entity and insurance payer network to establish rendering clinician linkage, generate enrollment tracking records, and update status logs.
              </div>

              {linkError && (
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-800 text-[11px] font-semibold flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{linkError}</span>
                </div>
              )}

              {/* 1. Practice Provider Group / Legal Entity */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Practice Provider / Legal Entity *
                </label>
                <select
                  value={linkEntityId}
                  onChange={(e) => setLinkEntityId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  required
                >
                  <option value="">-- Select Practice Entity --</option>
                  {entities.map((entity) => (
                    <option key={entity.id} value={entity.id}>
                      {entity.dba || entity.legalName} (EIN: {entity.ein})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Payer / Health Plan Network */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payer / Insurance Network to Link *
                </label>
                <select
                  value={linkPayerId}
                  onChange={(e) => setLinkPayerId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  required
                >
                  <option value="">-- Select Payer / Network --</option>
                  {payers.map((payer) => (
                    <option key={payer.id} value={payer.id}>
                      {payer.name} ({payer.type || (Array.isArray((payer as any)?.lob) ? (payer as any).lob.join(', ') : 'Commercial')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 3. Practice Location */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rendering Location
                  </label>
                  <select
                    value={linkLocationId}
                    onChange={(e) => setLinkLocationId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">-- Primary / All Locations --</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.city}, {loc.state})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Application / Link Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Link / Application Type
                  </label>
                  <select
                    value={linkAppType}
                    onChange={(e) => setLinkAppType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Provider linking">Provider Group Linking</option>
                    <option value="Initial credentialing">Initial Credentialing</option>
                    <option value="Re-credentialing">Re-credentialing</option>
                    <option value="Demographic update">Demographic / Roster Update</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 5. Linking Status */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Initial Linking Status
                  </label>
                  <select
                    value={linkStatus}
                    onChange={(e) => setLinkStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Linked">Linked (Active / Effective)</option>
                    <option value="Pending Approval">Pending Approval / Roster</option>
                    <option value="In Progress">Application In Progress</option>
                  </select>
                </div>

                {/* 6. Effective Date */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={linkEffectiveDate}
                    onChange={(e) => setLinkEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 7. Assigned Specialist */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Credentialing Specialist
                </label>
                <select
                  value={linkSpecialistId}
                  onChange={(e) => setLinkSpecialistId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Link Notes / Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={linkNotes}
                  onChange={(e) => setLinkNotes(e.target.value)}
                  placeholder="e.g. Added to Group Type 2 roster, portal enrollment submitted..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save & Link Provider</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center space-x-3 text-red-600 mb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Confirm Staff Removal</h3>
            </div>
            
            <p className="text-slate-600 mb-4">
              Are you sure you want to permanently delete <strong>{deleteConfirmProvider.firstName} {deleteConfirmProvider.lastName} ({deleteConfirmProvider.credentials})</strong> from the Clinical Staff Roster?
            </p>
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] mb-4">
              <strong>Admin Notice:</strong> This will remove the staff member's linked roster records and affiliations across all legal entities.
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProvider(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProvider(deleteConfirmProvider.id);
                  setDeleteConfirmProvider(null);
                  if (activeProfileId === deleteConfirmProvider.id) {
                    setActiveProfileId(providers.find(p => p.id !== deleteConfirmProvider.id)?.id || null);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Permanently Delete Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
