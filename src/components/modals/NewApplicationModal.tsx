import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  ApplicationType, 
  Discipline, 
  ProviderType,
  CAQHStatus, 
  PAVEStatus, 
  ServiceType,
  ContractStatus,
  LinkingStatus,
  CredentialingStage,
  ProviderPayerEnrollment
} from '../../types';
import { 
  AlertCircle, 
  Building, 
  Check, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  FilePlus, 
  FileText, 
  Layers, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Trash2, 
  User, 
  Users, 
  X,
  CreditCard,
  Briefcase,
  Award,
  Sparkles,
  Calendar,
  ChevronRight,
  Info,
  Building2,
  Phone,
  Mail
} from 'lucide-react';
import { addBusinessDays } from '../../utils/slaCalculator';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (recordId: string) => void;
}

type TabType = 'workflow' | 'basic' | 'licensure' | 'employment' | 'location' | 'credentialing' | 'caqh_payer';

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
}) => {
  const {
    payers,
    entities,
    locations,
    users,
    addProvider,
    createRecord,
    currentUser,
  } = useCredentialing();

  const [activeTab, setActiveTab] = useState<TabType>('workflow');

  // Workflow Core Setup Fields
  const [selectedEntityId, setSelectedEntityId] = useState<string>(entities[0]?.id || 'ent-1');
  const [assignedSpecialistId, setAssignedSpecialistId] = useState<string>(currentUser.id);
  const [intakeDate, setIntakeDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [applicationNotes, setApplicationNotes] = useState<string>('');
  const [initialStage, setInitialStage] = useState<CredentialingStage>('Intake');
  const [initialLinkingStatus, setInitialLinkingStatus] = useState<LinkingStatus>('Pending Approval');
  const [initialContractStatus, setInitialContractStatus] = useState<ContractStatus>('Contract Executed');

  // New Clinical Staff Full Profile State (initialized fresh for typing a new clinician)
  const [staffForm, setStaffForm] = useState({
    // 1. Basic Information
    firstName: '',
    lastName: '',
    credentials: 'MS, BCBA, LBA',
    disciplines: ['ABA'] as Discipline[],
    providerType: 'BCBA' as ProviderType,
    npi: '',
    npiVerified: true,
    email: '',
    phone: '',
    altPhone: '',
    contactAddress: '',
    specialty: 'Pediatric Applied Behavior Analysis',
    taxonomy: '103K00000X (Behavior Analyst)',

    // 2. Licensure
    licenseNumber: '',
    licenseState: 'CA',
    licenseExpiration: '',

    // 3. Employment & Group Info
    primaryEntityId: entities[0]?.id || 'ent-1',
    entityIds: [entities[0]?.id || 'ent-1'],
    dba: entities[0]?.dba || 'AGES Learning Solutions',
    employmentStatus: 'Full-Time' as 'Full-Time' | 'Part-Time' | 'Contractor' | 'Inactive',
    contractStatus: 'W-2 Full-Time',
    startDate: new Date().toISOString().split('T')[0],
    groupAffiliation: entities[0]?.legalName || 'AGES Learning Solutions Clinical Group',
    renderingProviderInfo: 'Type 1 Rendering Clinician billed under group Type 2 NPI.',

    // 4. Location Information (One person can be in multiple service locations)
    primaryLocationId: locations[0]?.id || 'loc-3',
    locationIds: [locations[0]?.id || 'loc-3'],
    serviceTypes: ['In-Clinic', 'In-Home', 'Telehealth'] as ServiceType[],
    locationEffectiveDate: new Date().toISOString().split('T')[0],

    // 5. Credentialing Details & Contracts
    caqhId: '',
    caqhStatus: 'Attested' as CAQHStatus,
    lastAttestationDate: new Date().toISOString().split('T')[0],
    nextAttestationDate: '',
    paveStatus: 'Approved' as PAVEStatus,
    paveTrackingNumber: '',
    dhcsApprovalDate: '',
    paveNotes: '',
    medicaidId: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    recredentialingDate: '',
    contractNumber: '',
    contractType: 'Group Agreement',
    feeScheduleTier: 'Tier 1 Standard',

    // 6. Multi-Insurance Enrollments (One staff can be registered with multiple insurances)
    payerEnrollments: [
      {
        id: `enr-${Date.now()}-1`,
        payerId: payers[0]?.id || 'pyr-1',
        payerName: payers[0]?.name || 'Aetna Commercial & Medicaid',
        status: 'In Progress',
        enrollmentStatus: 'In Progress',
        applicationType: 'Initial credentialing' as ApplicationType,
        effectiveDate: new Date().toISOString().split('T')[0],
        recredentialingDueDate: addBusinessDays(new Date().toISOString().split('T')[0], 730),
        providerIdNumber: '',
        notes: 'Group participating agreement intake.',
      },
    ] as ProviderPayerEnrollment[],
  });

  if (!isOpen) return null;

  const currentEntity = entities.find((e) => e.id === selectedEntityId) || entities[0];
  const currentLocation = locations.find((l) => l.id === staffForm.primaryLocationId) || locations[0];
  const currentSpecialist = users.find((u) => u.id === assignedSpecialistId) || currentUser;

  // Toggle discipline
  const toggleDiscipline = (disc: Discipline) => {
    setStaffForm((prev) => {
      const exists = prev.disciplines.includes(disc);
      const updated = exists ? prev.disciplines.filter(d => d !== disc) : [...prev.disciplines, disc];
      return { ...prev, disciplines: updated.length > 0 ? updated : [disc] };
    });
  };

  // Toggle service type
  const toggleServiceType = (st: ServiceType) => {
    setStaffForm((prev) => {
      const exists = prev.serviceTypes.includes(st);
      const updated = exists ? prev.serviceTypes.filter(s => s !== st) : [...prev.serviceTypes, st];
      return { ...prev, serviceTypes: updated.length > 0 ? updated : [st] };
    });
  };

  // Toggle location assignment (multiple service locations)
  const toggleLocation = (locId: string) => {
    setStaffForm((prev) => {
      const exists = prev.locationIds.includes(locId);
      const updated = exists ? prev.locationIds.filter(id => id !== locId) : [...prev.locationIds, locId];
      const validUpdated = updated.length > 0 ? updated : [locId];
      return {
        ...prev,
        locationIds: validUpdated,
        primaryLocationId: validUpdated.includes(prev.primaryLocationId) ? prev.primaryLocationId : validUpdated[0],
      };
    });
  };

  // Toggle entity assignment
  const toggleEntity = (entId: string) => {
    setStaffForm((prev) => {
      const exists = prev.entityIds.includes(entId);
      const updated = exists ? prev.entityIds.filter(id => id !== entId) : [...prev.entityIds, entId];
      const validUpdated = updated.length > 0 ? updated : [entId];
      return {
        ...prev,
        entityIds: validUpdated,
        primaryEntityId: validUpdated.includes(prev.primaryEntityId) ? prev.primaryEntityId : validUpdated[0],
      };
    });
  };

  // Multi-Insurance Enrollment Handlers
  const handleTogglePayer = (payerId: string) => {
    const payer = payers.find(p => p.id === payerId);
    if (!payer) return;

    setStaffForm((prev) => {
      const existingIdx = prev.payerEnrollments.findIndex(e => e.payerId === payerId);
      if (existingIdx >= 0) {
        // Remove if more than 1
        if (prev.payerEnrollments.length <= 1) {
          return prev; // keep at least one
        }
        return {
          ...prev,
          payerEnrollments: prev.payerEnrollments.filter((_, i) => i !== existingIdx),
        };
      } else {
        // Add new enrollment for this insurance
        const newEnrollment: ProviderPayerEnrollment = {
          id: `enr-${Date.now()}-${payerId}`,
          payerId: payer.id,
          payerName: payer.name,
          status: 'In Progress',
          enrollmentStatus: 'In Progress',
          applicationType: 'Initial credentialing',
          effectiveDate: new Date().toISOString().split('T')[0],
          recredentialingDueDate: addBusinessDays(new Date().toISOString().split('T')[0], 730),
          providerIdNumber: '',
          notes: `${payer.name} participating provider application.`,
        };
        return {
          ...prev,
          payerEnrollments: [...prev.payerEnrollments, newEnrollment],
        };
      }
    });
  };

  const handleAddPayerEnrollment = () => {
    // Find a payer not yet in enrollments, or default to first
    const availablePayer = payers.find(p => !staffForm.payerEnrollments.some(e => e.payerId === p.id)) || payers[0];
    const newEnrollment: ProviderPayerEnrollment = {
      id: `enr-${Date.now()}`,
      payerId: availablePayer?.id || 'pyr-1',
      payerName: availablePayer?.name || 'Insurance Network',
      status: 'In Progress',
      enrollmentStatus: 'In Progress',
      applicationType: 'Initial credentialing',
      effectiveDate: new Date().toISOString().split('T')[0],
      recredentialingDueDate: addBusinessDays(new Date().toISOString().split('T')[0], 730),
      providerIdNumber: '',
      notes: 'Participating network application.',
    };

    setStaffForm((prev) => ({
      ...prev,
      payerEnrollments: [...prev.payerEnrollments, newEnrollment],
    }));
  };

  const handleUpdatePayerEnrollment = (index: number, updates: Partial<ProviderPayerEnrollment>) => {
    setStaffForm((prev) => {
      const updatedList = [...prev.payerEnrollments];
      updatedList[index] = { ...updatedList[index], ...updates };
      return { ...prev, payerEnrollments: updatedList };
    });
  };

  const handleDeletePayerEnrollment = (index: number) => {
    setStaffForm((prev) => {
      if (prev.payerEnrollments.length <= 1) return prev;
      return {
        ...prev,
        payerEnrollments: prev.payerEnrollments.filter((_, i) => i !== index),
      };
    });
  };

  // Quick enroll in top commercial payers
  const handleEnrollAllCommercial = () => {
    const commercialPayers = payers.slice(0, 5);
    const newEnrollments: ProviderPayerEnrollment[] = commercialPayers.map(p => ({
      id: `enr-${Date.now()}-${p.id}`,
      payerId: p.id,
      payerName: p.name,
      status: 'In Progress',
      enrollmentStatus: 'In Progress',
      applicationType: 'Initial credentialing',
      effectiveDate: new Date().toISOString().split('T')[0],
      recredentialingDueDate: addBusinessDays(new Date().toISOString().split('T')[0], 730),
      providerIdNumber: '',
      notes: `${p.name} commercial & managed care packet.`,
    }));

    setStaffForm(prev => ({
      ...prev,
      payerEnrollments: newEnrollments,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const firstNameClean = staffForm.firstName.trim() || 'New';
    const lastNameClean = staffForm.lastName.trim() || 'Clinical Staff';
    const emailClean = staffForm.email.trim() || `${firstNameClean.toLowerCase()}.${lastNameClean.toLowerCase()}@ageslearning.com`;
    const npiClean = staffForm.npi.trim() || `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    // 1. Create the new Clinical Staff Member in Provider Directory
    const createdProvider = addProvider({
      firstName: firstNameClean,
      lastName: lastNameClean,
      credentials: staffForm.credentials || 'MS, BCBA',
      disciplines: staffForm.disciplines,
      providerType: staffForm.providerType,
      npi: npiClean,
      npiVerified: staffForm.npiVerified,
      email: emailClean,
      phone: staffForm.phone || '(408) 555-0100',
      altPhone: staffForm.altPhone,
      contactAddress: staffForm.contactAddress,
      specialty: staffForm.specialty || 'Applied Behavior Analysis',
      taxonomy: staffForm.taxonomy || '103K00000X',
      licenseNumber: staffForm.licenseNumber || `CA-${staffForm.providerType}-${Math.floor(10000 + Math.random() * 90000)}`,
      licenseState: staffForm.licenseState,
      licenseExpiration: staffForm.licenseExpiration || new Date(Date.now() + 730 * 86400000).toISOString().split('T')[0],
      primaryEntityId: selectedEntityId,
      entityIds: staffForm.entityIds.length > 0 ? staffForm.entityIds : [selectedEntityId],
      dba: staffForm.dba,
      employmentStatus: staffForm.employmentStatus,
      contractStatus: staffForm.contractStatus,
      startDate: staffForm.startDate,
      groupAffiliation: staffForm.groupAffiliation,
      renderingProviderInfo: staffForm.renderingProviderInfo,
      primaryLocationId: staffForm.primaryLocationId,
      locationIds: staffForm.locationIds.length > 0 ? staffForm.locationIds : [staffForm.primaryLocationId],
      serviceTypes: staffForm.serviceTypes,
      locationEffectiveDate: staffForm.locationEffectiveDate,
      caqhId: staffForm.caqhId || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      caqhStatus: staffForm.caqhStatus,
      lastAttestationDate: staffForm.lastAttestationDate,
      nextAttestationDate: staffForm.nextAttestationDate,
      paveStatus: staffForm.paveStatus,
      medicaidId: staffForm.medicaidId,
      effectiveDate: staffForm.effectiveDate,
      recredentialingDate: staffForm.recredentialingDate,
      contractInfo: {
        contractNumber: staffForm.contractNumber || `GRP-${Math.floor(10000 + Math.random() * 90000)}`,
        contractType: staffForm.contractType,
        feeScheduleTier: staffForm.feeScheduleTier,
        contractEffectiveDate: staffForm.startDate,
        recredentialingCycleYears: 3,
        notes: applicationNotes,
      },
      payerEnrollments: staffForm.payerEnrollments,
    });

    // 2. Create Credentialing Records for each enrolled insurance network
    const createdRecordIds: string[] = [];

    if (staffForm.payerEnrollments.length > 0) {
      staffForm.payerEnrollments.forEach((enr) => {
        const rec = createRecord({
          providerId: createdProvider.id,
          payerId: enr.payerId,
          entityId: selectedEntityId,
          locationId: staffForm.primaryLocationId,
          applicationType: enr.applicationType || 'Initial credentialing',
          discipline: staffForm.disciplines[0] || 'ABA',
          stage: initialStage,
          assignedSpecialistId: currentSpecialist.id,
          intakeDate,
          notes: applicationNotes || `New clinical staff onboarding for ${firstNameClean} ${lastNameClean} with ${enr.payerName}.`,
          linkingStatus: initialLinkingStatus,
          linkEffectiveDate: staffForm.effectiveDate,
          contractStatus: initialContractStatus,
          contractEffectiveDate: staffForm.startDate,
          paveTrackingNumber: staffForm.paveTrackingNumber,
          dhcsApprovalDate: staffForm.dhcsApprovalDate,
          paveNotes: staffForm.paveNotes,
          caqhStatusAtSubmission: staffForm.caqhStatus,
        });
        createdRecordIds.push(rec.id);
      });
    } else {
      // Fallback default record
      const rec = createRecord({
        providerId: createdProvider.id,
        payerId: payers[0]?.id || 'pyr-1',
        entityId: selectedEntityId,
        locationId: staffForm.primaryLocationId,
        applicationType: 'Initial credentialing',
        discipline: staffForm.disciplines[0] || 'ABA',
        stage: initialStage,
        assignedSpecialistId: currentSpecialist.id,
        intakeDate,
        notes: applicationNotes,
        linkingStatus: initialLinkingStatus,
        linkEffectiveDate: staffForm.effectiveDate,
        contractStatus: initialContractStatus,
        contractEffectiveDate: staffForm.startDate,
        paveTrackingNumber: staffForm.paveTrackingNumber,
        dhcsApprovalDate: staffForm.dhcsApprovalDate,
        paveNotes: staffForm.paveNotes,
        caqhStatusAtSubmission: staffForm.caqhStatus,
      });
      createdRecordIds.push(rec.id);
    }

    onClose();
    if (createdRecordIds.length > 0) {
      onSelectRecord(createdRecordIds[0]);
    }
  };

  const tabs: { id: TabType; label: string; icon: any; badge?: string }[] = [
    { id: 'workflow', label: '1. Workflow & Staff Setup', icon: Layers },
    { id: 'basic', label: '2. Basic Info & Contact', icon: User },
    { id: 'licensure', label: '3. Licensure & NPI', icon: Award },
    { id: 'employment', label: '4. Employment & Group', icon: Briefcase },
    { id: 'location', label: '5. Locations & Modalities', icon: MapPin, badge: `${staffForm.locationIds.length}` },
    { id: 'credentialing', label: '6. Credentialing Details', icon: ShieldCheck },
    { id: 'caqh_payer', label: '7. Multi-Insurance Enrollments', icon: CreditCard, badge: `${staffForm.payerEnrollments.length}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold">New Clinical Staff Application & Full Profile Intake</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  New Staff Registration
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Type the clinical staff's name and register them with multiple service locations and insurance networks
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 pt-2 flex items-center space-x-1 overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-sky-700 border-sky-600 shadow-xs'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 text-xs flex flex-col justify-between">
          
          {/* TAB 1: WORKFLOW & STAFF SETUP */}
          {activeTab === 'workflow' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl flex items-start space-x-3 text-sky-900">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold">Step 1: Type New Clinical Staff Details & Assign Group Entity</div>
                  <div className="text-sky-800 text-[11px] mt-0.5">
                    Enter the new clinician's name and primary credentials below. One staff member can practice across <strong>multiple service locations</strong> (configured in Tab 5) and be registered with <strong>multiple insurance networks</strong> (configured in Tab 7).
                  </div>
                </div>
              </div>

              {/* Direct Name & Credentials Input (New Staff Intake) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Clinical Staff Member Identification *</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    New Clinical Hire Intake
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">First Name *</label>
                    <input
                      type="text"
                      value={staffForm.firstName}
                      onChange={(e) => setStaffForm({ ...staffForm, firstName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. Jessica"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={staffForm.lastName}
                      onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. Taylor"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Credentials / Degrees</label>
                    <input
                      type="text"
                      value={staffForm.credentials}
                      onChange={(e) => setStaffForm({ ...staffForm, credentials: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                      placeholder="MS, BCBA, LBA, LMFT"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Primary Discipline</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['ABA', 'SLP', 'OT', 'PT', 'Mental Health'] as Discipline[]).map(disc => {
                        const isSel = staffForm.disciplines.includes(disc);
                        return (
                          <button
                            type="button"
                            key={disc}
                            onClick={() => toggleDiscipline(disc)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-sky-700 text-white shadow-xs' 
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isSel && <Check className="w-3 h-3" />}
                            <span>{disc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Staff Role / Provider Type</label>
                    <select
                      value={staffForm.providerType}
                      onChange={(e) => setStaffForm({ ...staffForm, providerType: e.target.value as ProviderType })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <option value="BCBA">BCBA (Board Certified Behavior Analyst)</option>
                      <option value="BCaBA">BCaBA (Assistant Behavior Analyst)</option>
                      <option value="RBT">RBT (Registered Behavior Technician)</option>
                      <option value="SLP">SLP (Speech-Language Pathologist)</option>
                      <option value="SLPA">SLPA (Speech Assistant)</option>
                      <option value="OT">OT (Occupational Therapist)</option>
                      <option value="OTA">OTA (Occupational Therapy Assistant)</option>
                      <option value="PT">PT (Physical Therapist)</option>
                      <option value="PTA">PTA (Physical Therapist Assistant)</option>
                      <option value="LMFT">LMFT (Marriage & Family Therapist)</option>
                      <option value="LCSW">LCSW (Clinical Social Worker)</option>
                      <option value="LPCC">LPCC (Clinical Counselor)</option>
                      <option value="Psychologist">Licensed Psychologist</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Legal Entity Assignment */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Primary Billing Legal Entity *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Tax ID (TIN): <strong>{currentEntity?.taxId}</strong> • DBA: <strong>{currentEntity?.dba || 'None'}</strong>
                  </span>
                </div>
                <select
                  value={selectedEntityId}
                  onChange={(e) => {
                    setSelectedEntityId(e.target.value);
                    setStaffForm(prev => ({ ...prev, primaryEntityId: e.target.value }));
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer"
                  required
                >
                  {entities.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.dba || ent.legalName} (NPI-2: {ent.npiType2})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignment, Intake Date, Initial Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <label className="font-bold text-slate-800">Assigned Specialist</label>
                  <select
                    value={assignedSpecialistId}
                    onChange={(e) => setAssignedSpecialistId(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs cursor-pointer font-medium"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <label className="font-bold text-slate-800">Intake Date</label>
                  <input
                    type="date"
                    value={intakeDate}
                    onChange={(e) => setIntakeDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                    required
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <label className="font-bold text-slate-800">Initial Workflow Stage</label>
                  <select
                    value={initialStage}
                    onChange={(e) => setInitialStage(e.target.value as CredentialingStage)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs cursor-pointer font-medium"
                  >
                    <option value="Intake">Intake (New)</option>
                    <option value="Documents Complete">Documents Complete</option>
                    <option value="Application Submitted">Application Submitted</option>
                    <option value="Payer Review">Payer Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Linking Pending">Linking Pending</option>
                    <option value="Linked">Linked</option>
                    <option value="Effective">Effective</option>
                  </select>
                </div>
              </div>

              {/* Multi-Insurance & Multi-Location Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setActiveTab('location')}
                  className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-emerald-600 text-white rounded-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900">Service Locations ({staffForm.locationIds.length})</div>
                      <div className="text-[10px] text-emerald-700">One clinician in multiple clinic/home locations</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </div>

                <div 
                  onClick={() => setActiveTab('caqh_payer')}
                  className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-sky-100/60 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-sky-600 text-white rounded-lg">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sky-900">Insurance Networks ({staffForm.payerEnrollments.length})</div>
                      <div className="text-[10px] text-sky-700">Registered across multiple payer networks</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sky-600" />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Intake Notes / Clinical Staff Scope</label>
                <textarea
                  rows={2}
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="e.g. New BCBA hire joining clinical practice to provide clinic & home ABA services. Priority onboarding for regional health plans."
                />
              </div>
            </div>
          )}

          {/* TAB 2: BASIC INFORMATION & CONTACT */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>Clinical Staff Basic Demographics & Contact Information</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    value={staffForm.firstName}
                    onChange={(e) => setStaffForm({ ...staffForm, firstName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    placeholder="e.g. Jessica"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={staffForm.lastName}
                    onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    placeholder="e.g. Taylor"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Credentials / Degrees</label>
                  <input
                    type="text"
                    value={staffForm.credentials}
                    onChange={(e) => setStaffForm({ ...staffForm, credentials: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    placeholder="MS, BCBA, LBA, LMFT"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Disciplines (Multi-Select)</label>
                  <div className="flex flex-wrap gap-2">
                    {(['ABA', 'SLP', 'OT', 'PT', 'Mental Health'] as Discipline[]).map(disc => {
                      const isSel = staffForm.disciplines.includes(disc);
                      return (
                        <button
                          type="button"
                          key={disc}
                          onClick={() => toggleDiscipline(disc)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-sky-700 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSel && <Check className="w-3.5 h-3.5" />}
                          <span>{disc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Staff Role / Provider Type</label>
                  <select
                    value={staffForm.providerType}
                    onChange={(e) => setStaffForm({ ...staffForm, providerType: e.target.value as ProviderType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <option value="BCBA">BCBA (Board Certified Behavior Analyst)</option>
                    <option value="BCaBA">BCaBA (Board Certified Assistant Behavior Analyst)</option>
                    <option value="RBT">RBT (Registered Behavior Technician)</option>
                    <option value="SLP">SLP (Speech-Language Pathologist)</option>
                    <option value="SLPA">SLPA (Speech-Language Pathology Assistant)</option>
                    <option value="OT">OT (Occupational Therapist)</option>
                    <option value="OTA">OTA (Occupational Therapy Assistant)</option>
                    <option value="PT">PT (Physical Therapist)</option>
                    <option value="PTA">PTA (Physical Therapist Assistant)</option>
                    <option value="LMFT">LMFT (Licensed Marriage & Family Therapist)</option>
                    <option value="LCSW">LCSW (Licensed Clinical Social Worker)</option>
                    <option value="LPCC">LPCC (Licensed Professional Clinical Counselor)</option>
                    <option value="Psychologist">Licensed Psychologist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Primary Clinical Specialty</label>
                  <input
                    type="text"
                    value={staffForm.specialty}
                    onChange={(e) => setStaffForm({ ...staffForm, specialty: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    placeholder="Pediatric Applied Behavior Analysis"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Healthcare Taxonomy Code</label>
                  <input
                    type="text"
                    value={staffForm.taxonomy}
                    onChange={(e) => setStaffForm({ ...staffForm, taxonomy: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    placeholder="103K00000X (Behavior Analyst)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    placeholder="jessica.taylor@ageslearning.com"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    placeholder="(408) 555-0129"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Alternate Phone</label>
                  <input
                    type="text"
                    value={staffForm.altPhone}
                    onChange={(e) => setStaffForm({ ...staffForm, altPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    placeholder="(408) 555-0199"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Residential / Contact Address</label>
                <input
                  type="text"
                  value={staffForm.contactAddress}
                  onChange={(e) => setStaffForm({ ...staffForm, contactAddress: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="Street address, City, State ZIP"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LICENSURE & NPI */}
          {activeTab === 'licensure' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-sky-600" />
                  <span>State Licensure & National Provider Identifier (NPI Type 1)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-bold text-slate-800 block">Type 1 Individual NPI *</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={staffForm.npi}
                    onChange={(e) => setStaffForm({ ...staffForm, npi: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold tracking-wider"
                    placeholder="10-digit Individual NPI (e.g. 1982746192)"
                    required
                  />
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="npiVerifiedCheck"
                      checked={staffForm.npiVerified}
                      onChange={(e) => setStaffForm({ ...staffForm, npiVerified: e.target.checked })}
                      className="rounded text-sky-600 cursor-pointer"
                    />
                    <label htmlFor="npiVerifiedCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                      NPI Verified with NPPES Registry
                    </label>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-bold text-slate-800 block">State Professional License *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold">License Number</span>
                      <input
                        type="text"
                        value={staffForm.licenseNumber}
                        onChange={(e) => setStaffForm({ ...staffForm, licenseNumber: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                        placeholder="e.g. CA-BCBA-98214"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold">State</span>
                      <select
                        value={staffForm.licenseState}
                        onChange={(e) => setStaffForm({ ...staffForm, licenseState: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        {['CA', 'WA', 'OR', 'TX', 'AZ', 'NV', 'CO', 'FL', 'NY', 'IL'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold">License Expiration Date *</span>
                    <input
                      type="date"
                      value={staffForm.licenseExpiration}
                      onChange={(e) => setStaffForm({ ...staffForm, licenseExpiration: e.target.value })}
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EMPLOYMENT & GROUP INFORMATION */}
          {activeTab === 'employment' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-sky-600" />
                  <span>Employment Classification & Group Legal Entity Affiliations</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Primary Group / Legal Entity *</label>
                  <select
                    value={staffForm.primaryEntityId}
                    onChange={(e) => {
                      const entId = e.target.value;
                      const chosen = entities.find(ent => ent.id === entId);
                      setStaffForm({
                        ...staffForm,
                        primaryEntityId: entId,
                        entityIds: Array.from(new Set([entId, ...staffForm.entityIds])),
                        dba: chosen?.dba || staffForm.dba,
                        groupAffiliation: chosen?.legalName || staffForm.groupAffiliation,
                      });
                      setSelectedEntityId(entId);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                    required
                  >
                    {entities.map(ent => (
                      <option key={ent.id} value={ent.id}>{ent.legalName} (DBA: {ent.dba})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Doing Business As (DBA)</label>
                  <input
                    type="text"
                    value={staffForm.dba}
                    onChange={(e) => setStaffForm({ ...staffForm, dba: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    placeholder="e.g. AGES Learning Solutions"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Employment Status</label>
                  <select
                    value={staffForm.employmentStatus}
                    onChange={(e) => setStaffForm({ ...staffForm, employmentStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contractor">Contractor (1099)</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contract Classification</label>
                  <select
                    value={staffForm.contractStatus}
                    onChange={(e) => setStaffForm({ ...staffForm, contractStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="W-2 Full-Time">W-2 Full-Time</option>
                    <option value="W-2 Part-Time">W-2 Part-Time</option>
                    <option value="1099 Contractor">1099 Independent Contractor</option>
                    <option value="Independent Consultant">Independent Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Clinical Start Date *</label>
                  <input
                    type="date"
                    value={staffForm.startDate}
                    onChange={(e) => setStaffForm({ ...staffForm, startDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Group Affiliation Name</label>
                <input
                  type="text"
                  value={staffForm.groupAffiliation}
                  onChange={(e) => setStaffForm({ ...staffForm, groupAffiliation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="e.g. AGES Learning Solutions Clinical Group"
                />
              </div>
            </div>
          )}

          {/* TAB 5: MULTI-LOCATION & SERVICE MODALITIES */}
          {activeTab === 'location' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>Multiple Service Locations & Practice Areas</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    One clinical staff member can be assigned across multiple physical clinics and in-home/mobile regional coverage territories
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {staffForm.locationIds.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Location Assignment Effective Date</label>
                  <input
                    type="date"
                    value={staffForm.locationEffectiveDate}
                    onChange={(e) => setStaffForm({ ...staffForm, locationEffectiveDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Service Delivery Types (Multi-Select)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['In-Clinic', 'In-Home', 'In-School', 'Telehealth'] as ServiceType[]).map(st => {
                      const isSel = staffForm.serviceTypes.includes(st);
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
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">
                    Assign All Active Service Locations (Click to Check / Uncheck)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {staffForm.locationIds.length} of {locations.length} clinics / regions selected
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {locations.map(loc => {
                    const isChecked = staffForm.locationIds.includes(loc.id);
                    const isInHome = loc.locationType === 'In-Home / Mobile' || loc.serviceTypes?.includes('In-Home');
                    return (
                      <div
                        key={loc.id}
                        onClick={() => toggleLocation(loc.id)}
                        className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isChecked 
                            ? isInHome 
                              ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20' 
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
            </div>
          )}

          {/* TAB 6: CREDENTIALING & CONTRACTS */}
          {activeTab === 'credentialing' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>CAQH ProView, PAVE / Medicaid, & Contract Parameters</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">CAQH ProView ID</label>
                  <input
                    type="text"
                    value={staffForm.caqhId}
                    onChange={(e) => setStaffForm({ ...staffForm, caqhId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                    placeholder="8-digit ID (e.g. 18920194)"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">CAQH Profile Status</label>
                  <select
                    value={staffForm.caqhStatus}
                    onChange={(e) => setStaffForm({ ...staffForm, caqhStatus: e.target.value as CAQHStatus })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer font-semibold"
                  >
                    <option value="Attested">Attested (Active)</option>
                    <option value="Complete">Complete (Pending Attestation)</option>
                    <option value="Re-attestation Due">Re-attestation Due</option>
                    <option value="Initial">Initial Draft</option>
                    <option value="Discrepancy">Discrepancy</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PAVE / Medi-Cal Status</label>
                  <select
                    value={staffForm.paveStatus}
                    onChange={(e) => setStaffForm({ ...staffForm, paveStatus: e.target.value as PAVEStatus })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer font-semibold"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Medicaid / Medi-Cal ID</label>
                  <input
                    type="text"
                    placeholder="e.g. MED-CA-9921"
                    value={staffForm.medicaidId}
                    onChange={(e) => setStaffForm({ ...staffForm, medicaidId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Credentialing Effective Date</label>
                  <input
                    type="date"
                    value={staffForm.effectiveDate}
                    onChange={(e) => setStaffForm({ ...staffForm, effectiveDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Next Recredentialing Due Date</label>
                  <input
                    type="date"
                    value={staffForm.recredentialingDate}
                    onChange={(e) => setStaffForm({ ...staffForm, recredentialingDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* PAVE Tracking Details */}
              <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200 space-y-2.5">
                <div className="font-bold text-sky-900 text-xs">PAVE / State Medicaid Application Tracking</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-600 font-semibold">PAVE Tracking #</span>
                    <input
                      type="text"
                      value={staffForm.paveTrackingNumber}
                      onChange={(e) => setStaffForm({ ...staffForm, paveTrackingNumber: e.target.value })}
                      placeholder="e.g. PAVE-2026-90412"
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 font-semibold">DHCS Approval Date</span>
                    <input
                      type="date"
                      value={staffForm.dhcsApprovalDate}
                      onChange={(e) => setStaffForm({ ...staffForm, dhcsApprovalDate: e.target.value })}
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 font-semibold">PAVE Notes</span>
                    <input
                      type="text"
                      value={staffForm.paveNotes}
                      onChange={(e) => setStaffForm({ ...staffForm, paveNotes: e.target.value })}
                      placeholder="e.g. Rendering revalidation approved"
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-900 text-xs">Contract Parameters</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contract Number</label>
                    <input
                      type="text"
                      value={staffForm.contractNumber}
                      onChange={(e) => setStaffForm({ ...staffForm, contractNumber: e.target.value })}
                      placeholder="e.g. CNT-AGES-2024"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contract Type</label>
                    <input
                      type="text"
                      value={staffForm.contractType}
                      onChange={(e) => setStaffForm({ ...staffForm, contractType: e.target.value })}
                      placeholder="Group Agreement"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Fee Schedule Tier</label>
                    <input
                      type="text"
                      value={staffForm.feeScheduleTier}
                      onChange={(e) => setStaffForm({ ...staffForm, feeScheduleTier: e.target.value })}
                      placeholder="Tier 1 Standard"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MULTI-INSURANCE ENROLLMENTS */}
          {activeTab === 'caqh_payer' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>Multiple Insurance Network Registrations</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    One clinical staff member can be registered across multiple health plans, commercial payers, and Medicaid networks
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleEnrollAllCommercial}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                  >
                    Quick Add Top 5 Payers
                  </button>
                  <button
                    type="button"
                    onClick={handleAddPayerEnrollment}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Insurance</span>
                  </button>
                </div>
              </div>

              {/* Multi-Insurance Quick Selector Grid */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 text-xs">
                  Available Insurance Networks (Click to Enable / Disable for this Staff)
                </label>
                <div className="flex flex-wrap gap-2">
                  {payers.map((pyr) => {
                    const isEnrolled = staffForm.payerEnrollments.some(e => e.payerId === pyr.id);
                    return (
                      <button
                        type="button"
                        key={pyr.id}
                        onClick={() => handleTogglePayer(pyr.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                          isEnrolled
                            ? 'bg-sky-700 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isEnrolled && <Check className="w-3.5 h-3.5" />}
                        <span>{pyr.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Payer Enrollments Detail Matrix */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {staffForm.payerEnrollments.map((enr, idx) => (
                  <div key={enr.id || idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">#{idx + 1}</span>
                        <select
                          value={enr.payerId}
                          onChange={(e) => {
                            const pId = e.target.value;
                            const pName = payers.find(p => p.id === pId)?.name || 'Payer';
                            handleUpdatePayerEnrollment(idx, { payerId: pId, payerName: pName });
                          }}
                          className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                        >
                          {payers.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                          ))}
                        </select>
                      </div>
                      
                      {staffForm.payerEnrollments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeletePayerEnrollment(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200 cursor-pointer"
                          title="Remove Enrollment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <span className="text-[10px] text-slate-500 font-medium">Application / Action Type</span>
                        <select
                          value={enr.applicationType || 'Initial credentialing'}
                          onChange={(e) => handleUpdatePayerEnrollment(idx, { applicationType: e.target.value as ApplicationType })}
                          className="w-full mt-0.5 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                        >
                          <option value="Initial credentialing">Initial credentialing</option>
                          <option value="New provider credentialing">New provider credentialing</option>
                          <option value="Recredentialing">Recredentialing (Cycle)</option>
                          <option value="Provider linking">Provider linking (Rendering to Group)</option>
                          <option value="Provider enrollment and participation">Enrollment & Participation</option>
                          <option value="Provider demographic updates">Demographic updates</option>
                          <option value="Provider address / location additions">Location additions</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-medium">Enrollment Status</span>
                        <select
                          value={enr.enrollmentStatus}
                          onChange={(e) => handleUpdatePayerEnrollment(idx, { enrollmentStatus: e.target.value as any })}
                          className="w-full mt-0.5 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Approved / Active">Approved / Active</option>
                          <option value="Pending Linking">Pending Linking</option>
                          <option value="Recredentialing Due">Recredentialing Due</option>
                          <option value="Terminated">Terminated</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-medium">Provider ID / PIN (if issued)</span>
                        <input
                          type="text"
                          value={enr.providerIdNumber || ''}
                          onChange={(e) => handleUpdatePayerEnrollment(idx, { providerIdNumber: e.target.value })}
                          placeholder="e.g. PRV-994812"
                          className="w-full mt-0.5 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Controls & Submit */}
          <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              {activeTab !== 'workflow' && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1].id);
                    }
                  }}
                  className="px-3.5 py-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer font-semibold"
                >
                  ← Back
                </button>
              )}
              {activeTab !== 'caqh_payer' && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1].id);
                    }
                  }}
                  className="px-3.5 py-2 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl cursor-pointer font-bold flex items-center space-x-1"
                >
                  <span>Next: {tabs[tabs.findIndex(t => t.id === activeTab) + 1]?.label}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20 cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Register Staff & Create Applications</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
