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
  AlertCircle,
  Layers,
  Sparkles,
  Paperclip,
  Trash2,
  Copy,
  BellRing,
  AlertTriangle,
  Info,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCredentialing } from '../../context/CredentialingContext';
import { LegalEntity, Provider, Payer, ProviderPayerEnrollment } from '../../types';

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
    locations,
    records, 
    currentAccount,
    addToast,
    updateProviderCredentialing
  } = useCredentialing();

  // Top level entity selection: null means showing the Operating Entity selection screen
  // Otherwise: specific entity ID (e.g. 'ent-1', 'ent-pts-llc', 'ent-pstg-inc', 'ent-3')
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Three primary view states within the chosen entity:
  // 'hub': The 2 Full Screen Module Pages (Employee Directory & 360 Profiles vs Manage Insurances)
  // 'manage_employees': Dedicated page for Employee Directory & 360 Profiles
  // 'manage_insurances': Dedicated page for Manage Insurances
  const [entitySubView, setEntitySubView] = useState<'hub' | 'manage_employees' | 'manage_insurances'>('hub');

  // Search & discipline filter for employees
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');

  // Full Profile Card Modal state (for Manage Employees)
  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState<Provider | null>(null);

  // Profile modal active sub-tab: 'insurances' | '360_card' | 'documents' | 'notes'
  const [profileModalTab, setProfileModalTab] = useState<'insurances' | '360_card' | 'documents' | 'notes'>('insurances');

  // Employee 360 Full Edit Form State
  const [edit360Form, setEdit360Form] = useState<{
    firstName: string;
    lastName: string;
    credentials: string;
    disciplines: string[];
    providerType: string;
    npi: string;
    taxonomy: string;
    specialty: string;
    region: string;
    primaryEntityId: string;
    dba: string;
    employmentStatus: string;
    contractStatus: string;
    startDate: string;
    primaryLocationId: string;
    serviceTypes: string[];
    licenseNumber: string;
    licenseState: string;
    licenseExpiration: string;
    bcbaCertificationNumber: string;
    bcbaEffectiveDate: string;
    bcbaExpiryDate: string;
    rbtCertificationNumber: string;
    rbtEffectiveDate: string;
    rbtExpiryDate: string;
    role: string;
    utStateLicense: string;
    caqhId: string;
    caqhStatus: string;
    lastAttestationDate: string;
    nextAttestationDate: string;
    paveStatus: string;
    email: string;
    phone: string;
    contactAddress: string;
    notes: string;
  } | null>(null);

  const [isSaving360, setIsSaving360] = useState(false);

  // New Document Link Form in Profile Modal
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('License');
  const [isAddingDocLink, setIsAddingDocLink] = useState(false);

  // New Comment in Profile Modal
  const [profileCommentText, setProfileCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Manage Insurances State
  // Selected employee in Manage Insurances view (null means showing the Clinician Card Grid)
  const [selectedInsuranceEmployeeId, setSelectedInsuranceEmployeeId] = useState<string | null>(null);

  // Two tabs inside Manage Insurances for an employee:
  // Tab 1: 'assigned_status' (Each insurance assigned with Submitted, Pending, Approved, Not Applicable buttons)
  // Tab 2: 'approved_dates' (Insurance name, effective date, and expiry date)
  const [insuranceSubTab, setInsuranceSubTab] = useState<'assigned_status' | 'approved_dates'>('assigned_status');

  // Pending reminder editing fields per payer: { [payerId]: { date: string, time: string, email: string, isSaving: boolean } }
  const [pendingReminderInputs, setPendingReminderInputs] = useState<Record<string, { date: string; time: string; email: string; isSaving?: boolean }>>({});

  // Approved date editing fields per payer: { [payerId]: { startDate: string, expirationDate: string, isSaving?: boolean } }
  const [approvedDateInputs, setApprovedDateInputs] = useState<Record<string, { startDate: string; expirationDate: string; isSaving?: boolean }>>({});

  // Active Entity Object
  const activeEntity = entities.find((e) => e.id === selectedEntityId);

  // Helper to check provider entity affiliation
  const isProviderInEntity = (p: Provider, entityId: string): boolean => {
    return (
      p.primaryEntityId === entityId || 
      p.entityIds?.includes(entityId) || 
      (p as any).renderingEntityIds?.includes(entityId)
    );
  };

  const isAgesEntity = Boolean(
    selectedEntityId === 'ent-1' ||
    activeEntity?.id === 'ent-1' ||
    activeEntity?.dba?.toLowerCase().includes('ages') ||
    activeEntity?.name?.toLowerCase().includes('ages')
  );

  const isProviderRbt = (p: Provider) => {
    return (
      p.providerType === 'RBT' ||
      (p.disciplines && p.disciplines.includes('RBT')) ||
      (p.credentials && p.credentials.toLowerCase().includes('rbt')) ||
      Boolean((p as any).rbtCertificationNumber) ||
      Boolean((p as any).contractInfo?.rbtCertificationNumber)
    );
  };

  const isProviderBcba = (p: Provider) => {
    return (
      p.providerType === 'BCBA' ||
      (p.disciplines && p.disciplines.includes('ABA') && !isProviderRbt(p)) ||
      (p.credentials && p.credentials.toLowerCase().includes('bcba')) ||
      Boolean((p as any).bcbaCertificationNumber) ||
      Boolean((p as any).contractInfo?.bcbaCertificationNumber)
    );
  };

  // Filter providers belonging to selected entity
  const entityProviders = selectedEntityId 
    ? (providers || []).filter((p) => isProviderInEntity(p, selectedEntityId))
    : [];

  const agesBcbaCount = entityProviders.filter(isProviderBcba).length;
  const agesRbtCount = entityProviders.filter(isProviderRbt).length;

  const disciplineOptions = isAgesEntity
    ? (['ALL', 'BCBA', 'RBT'] as const)
    : (['ALL', 'ABA', 'Speech', 'OT'] as const);

  const filteredProviders = entityProviders.filter((p) => {
    if (selectedDiscipline !== 'ALL') {
      if (selectedDiscipline === 'RBT') {
        if (!isProviderRbt(p)) return false;
      } else if (selectedDiscipline === 'BCBA') {
        if (!isProviderBcba(p)) return false;
      } else {
        const hasDiscipline = (p.disciplines && p.disciplines.includes(selectedDiscipline as any)) || (p as any).discipline === selectedDiscipline;
        if (!hasDiscipline) return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${p.firstName} ${p.lastName}`.toLowerCase().includes(q);
      const matchNpi = p.npi?.toLowerCase().includes(q);
      const matchEmail = p.email?.toLowerCase().includes(q);
      const matchRbtCert = (p as any).rbtCertificationNumber?.toLowerCase().includes(q) ||
        (p as any).contractInfo?.rbtCertificationNumber?.toLowerCase().includes(q);
      const matchBcbaCert = (p as any).bcbaCertificationNumber?.toLowerCase().includes(q) ||
        (p as any).contractInfo?.bcbaCertificationNumber?.toLowerCase().includes(q);
      const matchLic = p.licenseNumber?.toLowerCase().includes(q);
      const matchRegion = (p as any).region?.toLowerCase().includes(q) ||
        (p as any).contractInfo?.region?.toLowerCase().includes(q);
      if (!matchName && !matchNpi && !matchEmail && !matchRbtCert && !matchBcbaCert && !matchLic && !matchRegion) return false;
    }
    return true;
  });

  // Selected employee in Manage Insurances (null when viewing clinician card grid)
  const activeInsuranceEmployee = selectedInsuranceEmployeeId 
    ? entityProviders.find((p) => p.id === selectedInsuranceEmployeeId) || null
    : null;

  // All active system payers (including any newly uploaded payers or payers from other entities)
  const allSystemPayers = (payers || []).filter((pyr) => pyr.active !== false);

  // Payers sorted so payers belonging to the selected entity appear first, followed by others
  const entityPayers = selectedEntityId
    ? [...allSystemPayers].sort((a, b) => {
        const aMatches = a.entityIds && a.entityIds.includes(selectedEntityId);
        const bMatches = b.entityIds && b.entityIds.includes(selectedEntityId);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return a.name.localeCompare(b.name);
      })
    : allSystemPayers;

  // Helper to get enrollment for an employee and payer
  const getEnrollment = (provider: Provider, payerId: string): ProviderPayerEnrollment | undefined => {
    return (provider.payerEnrollments || []).find((e) => e.payerId === payerId);
  };

  // Helper to determine effective status for a payer for a provider
  // Autopopulate rule: If a payer belongs to other entities and NOT this entity, default to 'Not Applicable'
  const getEffectivePayerStatus = (provider: Provider, payer: Payer): 'Submitted' | 'Pending' | 'Approved' | 'Not Applicable' | 'Not Enrolled' => {
    const enrollment = getEnrollment(provider, payer.id);
    if (enrollment?.status) return enrollment.status as any;
    if (enrollment?.approvalStatus) return enrollment.approvalStatus as any;

    // Autopopulate rule: If this insurance belongs to other entities but not this entity, mark as 'Not Applicable'
    if (selectedEntityId && payer.entityIds && payer.entityIds.length > 0 && !payer.entityIds.includes(selectedEntityId)) {
      return 'Not Applicable';
    }

    return 'Not Enrolled';
  };

  // Add Document Link to Employee
  const handleAddDocumentLink = async () => {
    if (!selectedProfileEmployee || !newDocTitle.trim() || !newDocUrl.trim()) {
      addToast('Please provide both document title and a valid URL/link.', 'error');
      return;
    }

    setIsAddingDocLink(true);
    try {
      const newDoc = {
        id: `doc-lnk-${Date.now()}`,
        title: newDocTitle.trim(),
        url: newDocUrl.trim().startsWith('http') ? newDocUrl.trim() : `https://${newDocUrl.trim()}`,
        category: newDocCategory,
        uploadedAt: new Date().toISOString().split('T')[0],
      };

      const existingLinks = selectedProfileEmployee.documentLinks || [];
      const updatedLinks = [newDoc, ...existingLinks];

      await updateProviderCredentialing(selectedProfileEmployee.id, {
        documentLinks: updatedLinks,
      });

      // Update local state
      const updatedEmployee = { ...selectedProfileEmployee, documentLinks: updatedLinks };
      setSelectedProfileEmployee(updatedEmployee);

      setNewDocTitle('');
      setNewDocUrl('');
      addToast(`Document link "${newDoc.title}" attached successfully.`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to attach document link', 'error');
    } finally {
      setIsAddingDocLink(false);
    }
  };

  // Delete Document Link
  const handleDeleteDocumentLink = async (docId: string) => {
    if (!selectedProfileEmployee) return;
    try {
      const updatedLinks = (selectedProfileEmployee.documentLinks || []).filter((d) => d.id !== docId);
      await updateProviderCredentialing(selectedProfileEmployee.id, {
        documentLinks: updatedLinks,
      });
      setSelectedProfileEmployee({ ...selectedProfileEmployee, documentLinks: updatedLinks });
      addToast('Document link removed.', 'info');
    } catch (err: any) {
      addToast('Failed to remove document link', 'error');
    }
  };

  // Post Comment on Profile Card
  const handlePostProfileComment = async () => {
    if (!selectedProfileEmployee || !profileCommentText.trim()) return;
    setIsPostingComment(true);
    try {
      const newComment = {
        id: `pcl-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        authorId: currentAccount?.id || 'system',
        authorName: currentAccount?.name || 'Credentialing Specialist',
        authorRole: currentAccount?.roleTitle || currentAccount?.systemRole || 'Credentialing Specialist',
        category: 'General',
        notes: profileCommentText.trim(),
      };

      const existingLogs = selectedProfileEmployee.commentLogs || [];
      const updatedLogs = [newComment, ...existingLogs];

      await updateProviderCredentialing(selectedProfileEmployee.id, {
        commentLogs: updatedLogs,
      });

      setSelectedProfileEmployee({ ...selectedProfileEmployee, commentLogs: updatedLogs });
      setProfileCommentText('');
      addToast('Note added to employee profile card.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to post note', 'error');
    } finally {
      setIsPostingComment(false);
    }
  };

  // Update Status for an Insurance (Submitted, Pending, Approved, Not Applicable)
  const handleSetInsuranceStatus = async (
    provider: Provider, 
    payer: Payer, 
    newStatus: 'Submitted' | 'Pending' | 'Approved' | 'Not Applicable'
  ) => {
    try {
      const existingEnrollments = provider.payerEnrollments || [];
      const existingEnrollment = existingEnrollments.find((e) => e.payerId === payer.id);

      let updatedEnrollments: ProviderPayerEnrollment[];

      if (existingEnrollment) {
        updatedEnrollments = existingEnrollments.map((e) => {
          if (e.payerId === payer.id) {
            return {
              ...e,
              status: newStatus,
              approvalStatus: newStatus,
              // If changing to approved, set default dates if empty
              startDate: newStatus === 'Approved' ? (e.startDate || new Date().toISOString().split('T')[0]) : e.startDate,
              expirationDate: newStatus === 'Approved' ? (e.expirationDate || new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0]) : e.expirationDate,
            };
          }
          return e;
        });
      } else {
        const newEnrollment: ProviderPayerEnrollment = {
          payerId: payer.id,
          payerName: payer.name,
          status: newStatus,
          approvalStatus: newStatus,
          startDate: newStatus === 'Approved' ? new Date().toISOString().split('T')[0] : undefined,
          expirationDate: newStatus === 'Approved' ? new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0] : undefined,
          reminderEmail: currentAccount?.email || 'credentialing@proficiotherapy.com',
          responsiblePerson: currentAccount?.name || 'Credentialing Specialist',
        };
        updatedEnrollments = [...existingEnrollments, newEnrollment];
      }

      await updateProviderCredentialing(provider.id, {
        payerEnrollments: updatedEnrollments,
      });

      // Synchronize active selected employee state if open in modal
      if (selectedProfileEmployee?.id === provider.id) {
        setSelectedProfileEmployee({
          ...selectedProfileEmployee,
          payerEnrollments: updatedEnrollments,
        });
      }

      addToast(`${payer.name} status updated to ${newStatus} for ${provider.firstName} ${provider.lastName}. Dashboard count updated.`, 'success');
    } catch (err: any) {
      addToast('Failed to update insurance status', 'error');
    }
  };

  // Schedule AESAS Reminder for Pending Insurance
  const handleSchedulePendingReminder = async (provider: Provider, payer: Payer) => {
    const inputKey = `${provider.id}_${payer.id}`;
    const inputs = pendingReminderInputs[inputKey] || {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '09:00',
      email: currentAccount?.email || 'credentialing@proficiotherapy.com',
    };

    if (!inputs.date || !inputs.time) {
      addToast('Please select both Date of Reminding and Time of getting email.', 'error');
      return;
    }

    setPendingReminderInputs((prev) => ({
      ...prev,
      [inputKey]: { ...inputs, isSaving: true },
    }));

    try {
      // 1. Update provider enrollment in database
      const existingEnrollments = provider.payerEnrollments || [];
      const updatedEnrollments = existingEnrollments.map((e) => {
        if (e.payerId === payer.id) {
          return {
            ...e,
            status: 'Pending' as const,
            approvalStatus: 'Pending' as const,
            reminderDate: inputs.date,
            reminderTime: inputs.time,
            reminderEmail: inputs.email || currentAccount?.email || 'credentialing@proficiotherapy.com',
            responsiblePerson: currentAccount?.name || 'Credentialing Specialist',
          };
        }
        return e;
      });

      await updateProviderCredentialing(provider.id, {
        payerEnrollments: updatedEnrollments,
      });

      if (selectedProfileEmployee?.id === provider.id) {
        setSelectedProfileEmployee({
          ...selectedProfileEmployee,
          payerEnrollments: updatedEnrollments,
        });
      }

      // 2. Register in AESAS Queue & trigger automated email via Resend API
      const aesasPayload = {
        templateCode: 'pending_reminder',
        recipientEmail: inputs.email || currentAccount?.email || 'credentialing@proficiotherapy.com',
        subject: `ACTION REQUIRED: Pending Insurance Enrollment Reminder — ${provider.firstName} ${provider.lastName} (${payer.name})`,
        scheduledDate: inputs.date,
        scheduledTime: inputs.time,
        employeeId: provider.id,
        employeeName: `${provider.firstName} ${provider.lastName}`,
        payerId: payer.id,
        payerName: payer.name,
        entityId: selectedEntityId || provider.primaryEntityId || 'ent-1',
        responsiblePerson: currentAccount?.name || 'Credentialing Specialist',
        createdBy: currentAccount?.name || 'Credentialing Lead',
        notes: `Automated alert registered by credentialing lead for ${inputs.date} at ${inputs.time}.`,
      };

      // Call AESAS API
      await fetch('/api/aesas/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aesasPayload),
      }).catch((e) => console.warn('AESAS queue schedule background error:', e));

      addToast(
        `AESAS Alert Registered: Reminder scheduled for ${inputs.date} at ${inputs.time}. Automated email will be dispatched to ${inputs.email || currentAccount?.email} via Resend.`,
        'success'
      );
    } catch (err: any) {
      addToast(err.message || 'Failed to schedule AESAS alert', 'error');
    } finally {
      setPendingReminderInputs((prev) => ({
        ...prev,
        [inputKey]: { ...inputs, isSaving: false },
      }));
    }
  };

  // Save Approved Validity Dates
  const handleSaveApprovedDates = async (provider: Provider, payerId: string, payerName: string) => {
    const inputKey = `${provider.id}_${payerId}`;
    const enrollment = getEnrollment(provider, payerId);
    const inputs = approvedDateInputs[inputKey] || {
      startDate: enrollment?.startDate || new Date().toISOString().split('T')[0],
      expirationDate: enrollment?.expirationDate || new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0],
    };

    if (!inputs.startDate || !inputs.expirationDate) {
      addToast('Please enter both Start Date and Expiration Date.', 'error');
      return;
    }

    setApprovedDateInputs((prev) => ({
      ...prev,
      [inputKey]: { ...inputs, isSaving: true },
    }));

    try {
      const existingEnrollments = provider.payerEnrollments || [];
      const updatedEnrollments = existingEnrollments.map((e) => {
        if (e.payerId === payerId) {
          return {
            ...e,
            status: 'Approved' as const,
            approvalStatus: 'Approved' as const,
            startDate: inputs.startDate,
            expirationDate: inputs.expirationDate,
            effectiveDate: inputs.startDate,
            recredentialingDueDate: inputs.expirationDate,
          };
        }
        return e;
      });

      await updateProviderCredentialing(provider.id, {
        payerEnrollments: updatedEnrollments,
      });

      if (selectedProfileEmployee?.id === provider.id) {
        setSelectedProfileEmployee({
          ...selectedProfileEmployee,
          payerEnrollments: updatedEnrollments,
        });
      }

      addToast(`Validity dates saved for ${payerName}: Effective ${inputs.startDate} through ${inputs.expirationDate}.`, 'success');
    } catch (err: any) {
      addToast('Failed to save dates', 'error');
    } finally {
      setApprovedDateInputs((prev) => ({
        ...prev,
        [inputKey]: { ...inputs, isSaving: false },
      }));
    }
  };

  // Open Employee Profile Modal with Insurances & 360 fields
  const handleOpenEmployeeProfile = (prov: Provider) => {
    setSelectedProfileEmployee(prov);
    setProfileModalTab('insurances'); // Opens immediately to insurances with the 4-way toggle!
    setEdit360Form({
      firstName: prov.firstName || '',
      lastName: prov.lastName || '',
      credentials: prov.credentials || '',
      disciplines: prov.disciplines && prov.disciplines.length > 0 ? prov.disciplines : [(prov as any).discipline || 'ABA'],
      providerType: prov.providerType || 'BCBA',
      npi: prov.npi || '',
      taxonomy: prov.taxonomy || '103K00000X',
      specialty: prov.specialty || '',
      region: prov.region || '',
      primaryEntityId: prov.primaryEntityId || prov.entityIds?.[0] || selectedEntityId || 'ent-1',
      dba: prov.dba || '',
      employmentStatus: prov.employmentStatus || 'Active',
      contractStatus: prov.contractStatus || 'W-2 Full-Time',
      startDate: prov.startDate || '',
      primaryLocationId: prov.primaryLocationId || prov.locationIds?.[0] || 'loc-1',
      serviceTypes: prov.serviceTypes || ['In-Clinic', 'In-Home'],
      licenseNumber: prov.licenseNumber || '',
      licenseState: prov.licenseState || 'CA',
      licenseExpiration: prov.licenseExpiration || '',
      bcbaCertificationNumber: prov.bcbaCertificationNumber || (prov as any).contractInfo?.bcbaCertificationNumber || '',
      bcbaEffectiveDate: prov.bcbaEffectiveDate || (prov as any).contractInfo?.bcbaEffectiveDate || '',
      bcbaExpiryDate: prov.bcbaExpiryDate || (prov as any).contractInfo?.bcbaExpiryDate || '',
      rbtCertificationNumber: (prov as any).rbtCertificationNumber || (prov as any).contractInfo?.rbtCertificationNumber || '',
      rbtEffectiveDate: (prov as any).rbtEffectiveDate || (prov as any).contractInfo?.rbtEffectiveDate || '',
      rbtExpiryDate: (prov as any).rbtExpiryDate || (prov as any).contractInfo?.rbtExpiryDate || '',
      role: (prov as any).role || (prov as any).contractInfo?.role || '',
      utStateLicense: prov.utStateLicense || (prov as any).contractInfo?.utStateLicense || (prov as any).contractInfo?.utahLicenseNumber || prov.utahLicenseNumber || '',
      caqhId: prov.caqhId || '',
      caqhStatus: prov.caqhStatus || 'Attested',
      lastAttestationDate: prov.lastAttestationDate || '',
      nextAttestationDate: prov.nextAttestationDate || '',
      paveStatus: prov.paveStatus || 'Approved',
      email: prov.email || '',
      phone: prov.phone || '',
      contactAddress: prov.contactAddress || '',
      notes: prov.notes || '',
    });
  };

  // Save changes made in the Employee 360 card
  const handleSave360Card = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileEmployee || !edit360Form) return;

    if (!edit360Form.firstName.trim() || !edit360Form.lastName.trim() || (!edit360Form.npi.trim() && edit360Form.providerType !== 'RBT')) {
      addToast('Please enter First Name and Last Name.', 'error');
      return;
    }

    setIsSaving360(true);
    try {
      const payload: Partial<Provider> = {
        ...edit360Form,
        entityIds: [edit360Form.primaryEntityId],
        locationIds: [edit360Form.primaryLocationId],
        contractInfo: {
          ...((selectedProfileEmployee as any).contractInfo || {}),
          rbtCertificationNumber: edit360Form.rbtCertificationNumber,
          rbtEffectiveDate: edit360Form.rbtEffectiveDate,
          rbtExpiryDate: edit360Form.rbtExpiryDate,
          role: edit360Form.role,
        },
      };

      await updateProviderCredentialing(selectedProfileEmployee.id, payload);
      const updated = {
        ...selectedProfileEmployee,
        ...payload,
      };
      setSelectedProfileEmployee(updated);
      addToast(`Employee 360 card successfully updated for ${edit360Form.firstName} ${edit360Form.lastName}.`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to update Employee 360 card', 'error');
    } finally {
      setIsSaving360(false);
    }
  };

  // Helper for Location Name
  const getLocationName = (locId?: string) => {
    if (!locId) return 'Primary Clinic';
    const loc = locations.find((l) => l.id === locId);
    return loc ? `${loc.name} (${loc.city}, ${loc.state})` : 'Primary Clinic';
  };

  // =========================================================================
  // VIEW 1: THREE ENTITIES SELECTION SCREEN (Initial State)
  // =========================================================================
  if (!selectedEntityId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-50 text-[#2B4C9D] rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Clinical Staff Portal
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Select an operating entity to manage active clinicians, inspect full credentialing profile cards, attach document links, and orchestrate insurance panel enrollments.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {providers.length} Total Clinicians Across {entities.length} Operating Entities
              </span>
            </div>
          </div>
        </div>

        {/* DYNAMIC ENTITY SELECTION CARDS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Operating Legal Entity
            </h2>
            <span className="text-xs text-slate-500">
              Click any entity to manage employees and insurances
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {entities.map((entity) => {
              const staffCount = providers.filter((p) => isProviderInEntity(p, entity.id)).length;
              const nameLower = (entity.legalName || entity.dba || '').toLowerCase();
              const isPstg = entity.id === 'ent-pstg-inc' || nameLower.includes('speech');
              const isPts = entity.id === 'ent-pts-llc' || (nameLower.includes('therapy services') && !nameLower.includes('speech'));
              const isAges = entity.id === 'ent-1' || nameLower.includes('ages');
              const isChild = entity.id === 'ent-3' || nameLower.includes("child");

              let badgeText = 'Multi-Disciplinary Care';
              let badgeBg = 'bg-blue-50 text-[#2B4C9D] border-blue-200';
              let disciplineText = 'Speech & OT Healthcare';
              let hoverBorder = 'hover:border-[#2B4C9D]';
              let actionColor = 'text-[#2B4C9D]';

              if (isAges) {
                badgeText = 'ABA & Autism Therapy';
                badgeBg = 'bg-orange-50 text-[#E86424] border-orange-200';
                disciplineText = 'Applied Behavior Analysis (ABA)';
                hoverBorder = 'hover:border-[#E86424]';
                actionColor = 'text-[#E86424]';
              } else if (isPstg) {
                badgeText = 'Speech & AAC Therapy';
                badgeBg = 'bg-blue-50 text-[#2B4C9D] border-blue-200';
                disciplineText = 'Speech-Language Pathology (SLP)';
                hoverBorder = 'hover:border-[#2B4C9D]';
                actionColor = 'text-[#2B4C9D]';
              } else if (isPts) {
                badgeText = 'Systemwide Therapy Services';
                badgeBg = 'bg-teal-50 text-teal-700 border-teal-200';
                disciplineText = 'Occupational Therapy (OT)';
                hoverBorder = 'hover:border-teal-600';
                actionColor = 'text-teal-700';
              } else if (isChild) {
                badgeText = 'Pediatric OT & PT';
                badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                disciplineText = 'Occupational Therapy (OT)';
                hoverBorder = 'hover:border-emerald-600';
                actionColor = 'text-emerald-700';
              }

              return (
                <div
                  key={entity.id}
                  onClick={() => {
                    setSelectedEntityId(entity.id);
                    setEntitySubView('hub');
                  }}
                  className={`bg-white rounded-3xl border-2 border-slate-200 ${hoverBorder} p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeBg} border`}>
                        {badgeText}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {staffCount} Clinicians
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {entity.dba || entity.legalName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono line-clamp-1">
                        {entity.legalName}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type 2 Org NPI:</span>
                        <span className="font-mono font-bold text-slate-800">{(entity as any).npiType2 || entity.npi || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Federal Tax ID (EIN):</span>
                        <span className="font-mono font-bold text-slate-800">{(entity as any).ein || entity.taxId || '—'}</span>
                      </div>
                      {entity.taxonomy && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Taxonomy:</span>
                          <span className="font-mono font-bold text-slate-800">{entity.taxonomy}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Discipline:</span>
                        <span className={`font-bold ${actionColor}`}>{disciplineText}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold ${actionColor}`}>
                    <span>Enter {entity.dba || entity.legalName} Portal</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: INSIDE AN ENTITY (Manage Employees OR Manage Insurances)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ========================================================================= */}
      {/* VIEW 2A: ENTITY 2-PAGE PORTAL SELECTION (HUB)                            */}
      {/* ========================================================================= */}
      {entitySubView === 'hub' && (
        <div className="space-y-6">
          {/* Top Banner with Entity Metadata & Back button */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedEntityId(null)}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to All Operating Entities</span>
                </button>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {activeEntity?.dba || activeEntity?.legalName || 'Operating Entity'}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#2B4C9D] border border-blue-200">
                    {activeEntity?.legalName}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                  Select a management module below to view clinician 360 dossiers or configure payer panel credentialing enrollments for this operating organization.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  EIN: {activeEntity?.taxId || 'Active'}
                </span>
                <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  NPI: {activeEntity?.npi || 'Type 2 Org'}
                </span>
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {entityProviders.length} Clinicians Roster
                </span>
              </div>
            </div>
          </div>

          {/* 2 FULL SCREEN PORTAL PAGES CARDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Management Module
              </h2>
              <span className="text-xs text-slate-500">
                Choose a workspace to manage clinical personnel or payer contracts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Employee Directory & 360 Profiles */}
              <div
                onClick={() => setEntitySubView('manage_employees')}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-[#2B4C9D] p-7 sm:p-8 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#2B4C9D] border border-blue-200 flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Clinical Personnel Portal</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {entityProviders.length} Clinicians
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#2B4C9D] transition-colors">
                      Employee Directory &amp; 360 Profiles
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                      Search, inspect, and update full clinician dossiers. Review active state licenses, CAQH ProView attestations, BCBA certifications, attach document links, and log credentialing audit notes.
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Roster Count:</span>
                      <span className="font-bold text-slate-800">
                        {isAgesEntity ? `${entityProviders.length} Active Staff (${agesBcbaCount} BCBAs, ${agesRbtCount} RBTs)` : `${entityProviders.length} Active Staff`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Clinical Disciplines:</span>
                      <span className="font-bold text-[#2B4C9D]">
                        {isAgesEntity ? 'BCBA • RBT (Registered Behavior Technician)' : (Array.from(new Set(entityProviders.flatMap(p => p.disciplines || [(p as any).discipline || 'Clinical']))).slice(0, 3).join(', ') || 'ABA, Speech, OT')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Profile Dossiers:</span>
                      <span className="font-bold text-slate-800">360 Cards &amp; Document Repositories</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-[#2B4C9D]">
                  <span className="group-hover:underline">Open Employee Directory &amp; 360 Profiles</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Manage Insurances */}
              <div
                onClick={() => {
                  setEntitySubView('manage_insurances');
                  setSelectedInsuranceEmployeeId(null);
                }}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-600 p-7 sm:p-8 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Payer Panels &amp; Credentialing</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {allSystemPayers.length} Insurances Monitored
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Manage Insurances
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                      Manage insurance panel enrollments across all clinicians. Configure 4-way approval toggles (Submitted, Pending, Approved, Not Applicable), set automated AESAS follow-up alerts via Resend, and audit effective &amp; expiration dates.
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Monitored Payers:</span>
                      <span className="font-bold text-slate-800">{allSystemPayers.length} Insurance Payers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Approval Controls:</span>
                      <span className="font-bold text-emerald-700">Submitted &bull; Pending &bull; Approved &bull; N/A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Automated Pipeline:</span>
                      <span className="font-bold text-slate-800">AESAS Email Reminders &amp; Validity Tracking</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-emerald-700">
                  <span className="group-hover:underline">Open Manage Insurances</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION A: MANAGE EMPLOYEES                                               */}
      {/* ========================================================================= */}
      {entitySubView === 'manage_employees' && (
        <div className="space-y-4">
          {/* Top Breadcrumb & Header for Employee Directory */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <button
              onClick={() => setEntitySubView('hub')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {activeEntity?.dba || 'Entity'} Portal</span>
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-slate-900">
                  Employee Directory &amp; 360 Profiles
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-[#2B4C9D] border border-blue-200 font-mono">
                  {activeEntity?.dba || 'Entity'}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {isAgesEntity ? `${entityProviders.length} Clinicians (${agesBcbaCount} BCBA, ${agesRbtCount} RBT)` : `${entityProviders.length} Clinicians Roster`}
              </span>
            </div>
          </div>
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px] flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeEntity?.dba || 'entity'} clinicians by name, NPI, or email...`}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 text-slate-800"
                />
              </div>

              {/* Discipline filter */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {disciplineOptions.map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setSelectedDiscipline(disc)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedDiscipline === disc ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {disc}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {onOpenNewApplication && (
                <button
                  onClick={onOpenNewApplication}
                  className="px-3.5 py-2 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Clinician</span>
                </button>
              )}
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No clinicians found for {activeEntity?.dba || 'this entity'} matching your search criteria.
              </div>
            ) : (
              filteredProviders.map((prov) => {
                const approvedEnrollments = (prov.payerEnrollments || []).filter((e) => e.status === 'Approved' || e.approvalStatus === 'Approved');
                const docCount = (prov.documentLinks || []).length;
                const commentCount = (prov.commentLogs || []).length;
                const isProvRbt = isProviderRbt(prov);
                const rbtCert = (prov as any).rbtCertificationNumber || (prov as any).contractInfo?.rbtCertificationNumber || prov.licenseNumber || '—';
                const rbtEff = (prov as any).rbtEffectiveDate || (prov as any).contractInfo?.rbtEffectiveDate || '—';
                const rbtExp = (prov as any).rbtExpiryDate || (prov as any).contractInfo?.rbtExpiryDate || prov.licenseExpiration || '—';
                const regionName = (prov as any).region || (prov as any).contractInfo?.region || getLocationName(prov.primaryLocationId);

                return (
                  <div
                    key={prov.id}
                    onClick={() => handleOpenEmployeeProfile(prov)}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#2B4C9D] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Clinician Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm shrink-0 ${
                            isProvRbt ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-blue-50 border border-blue-100 text-[#2B4C9D]'
                          }`}>
                            {(prov.firstName || '').charAt(0)}{(prov.lastName || '').charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2B4C9D] transition-colors">
                              {prov.firstName} {prov.lastName}
                            </h3>
                            {isProvRbt ? (
                              <div className="flex items-center space-x-1.5 mt-0.5">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  RBT
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium truncate">
                                  {regionName}
                                </span>
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-500 font-medium">
                                {prov.credentials || 'Clinician'} &bull; {prov.disciplines?.[0] || (prov as any).discipline || 'Clinical Staff'}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {prov.employmentStatus || 'Active'}
                        </span>
                      </div>

                      {/* Primary Location */}
                      <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-slate-600">
                        <div className="font-semibold text-slate-800 text-[11px] flex justify-between">
                          <span>{isProvRbt ? 'Region & Facility:' : 'Primary Location:'}</span>
                          {isProvRbt && <span className="text-amber-800 font-bold">{regionName}</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {getLocationName(prov.primaryLocationId)}
                        </p>
                      </div>

                      {/* Credentials Grid */}
                      {isProvRbt ? (
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[10px]">RBT Cert #:</span>
                            <span className="font-mono font-bold text-amber-900 truncate block">{rbtCert}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Classification:</span>
                            <span className="font-semibold text-slate-800 truncate block">Behavior Tech</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Effective Date:</span>
                            <span className="font-semibold text-slate-700 truncate block">{rbtEff}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Expiration Date:</span>
                            <span className="font-semibold text-slate-700">{rbtExp}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[10px]">NPI Number:</span>
                            <span className="font-mono font-bold text-slate-800">{prov.npi}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">CAQH ProView:</span>
                            <span className="font-mono font-bold text-slate-800">{prov.caqhId || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">State License:</span>
                            <span className="font-semibold text-slate-700 truncate block">{prov.licenseNumber || 'Active'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">License Expiry:</span>
                            <span className="font-semibold text-slate-700">{prov.licenseExpiration || '—'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer with Documents & Comments indicators */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-3 text-[11px]">
                        <span className="flex items-center space-x-1" title={`${docCount} document links attached`}>
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          <span>{docCount} Docs</span>
                        </span>
                        <span className="flex items-center space-x-1" title={`${commentCount} notes logged`}>
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{commentCount} Notes</span>
                        </span>
                        <span className="text-emerald-700 font-semibold" title={`${approvedEnrollments.length} approved insurances`}>
                          {approvedEnrollments.length} Approved
                        </span>
                      </div>

                      <span className="text-[#2B4C9D] font-bold text-[11px] group-hover:underline flex items-center space-x-1">
                        <span>Profile Card</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: MANAGE INSURANCES                                              */}
      {/* ========================================================================= */}
      {entitySubView === 'manage_insurances' && (
        <div className="space-y-4">
          {/* Top Header for Manage Insurances */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <button
              onClick={() => {
                setEntitySubView('hub');
                setSelectedInsuranceEmployeeId(null);
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {activeEntity?.dba || 'Entity'} Portal</span>
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-slate-900">
                  Manage Insurances &amp; Payer Panels
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  {activeEntity?.dba || 'Entity'}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {allSystemPayers.length} System Insurances Monitored
              </span>
            </div>
          </div>

          {activeInsuranceEmployee ? (
            <div className="space-y-4">
              {/* Back to Clinician Grid & Tab Navigation Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedInsuranceEmployeeId(null)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Clinicians List</span>
                </button>

                {/* TWO TABS: Assigned Status vs Approved Validity Dates */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                  <button
                    onClick={() => setInsuranceSubTab('assigned_status')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      insuranceSubTab === 'assigned_status'
                        ? 'bg-white text-[#2B4C9D] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Insurances Assigned &amp; Status
                  </button>
                  <button
                    onClick={() => setInsuranceSubTab('approved_dates')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      insuranceSubTab === 'approved_dates'
                        ? 'bg-white text-[#2B4C9D] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Approved Insurances &amp; Validity Dates
                  </button>
                </div>
              </div>

              {/* Active Clinician Banner */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2B4C9D] font-bold flex items-center justify-center text-sm shrink-0">
                    {(activeInsuranceEmployee.firstName || '').charAt(0)}{(activeInsuranceEmployee.lastName || '').charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {activeInsuranceEmployee.firstName} {activeInsuranceEmployee.lastName}, {activeInsuranceEmployee.credentials}
                    </h2>
                    <p className="text-xs text-slate-500">
                      NPI: <strong className="font-mono text-slate-700">{activeInsuranceEmployee.npi}</strong> &bull; Primary Location: {getLocationName(activeInsuranceEmployee.primaryLocationId)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
                    {activeEntity?.dba || 'Current Entity'}
                  </span>
                </div>
              </div>

              {/* TAB 1: INSURANCES ASSIGNED WITH 3 BUTTONS (Submitted, Pending, Approved) */}
              {insuranceSubTab === 'assigned_status' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Insurances Assigned to {activeInsuranceEmployee.firstName} {activeInsuranceEmployee.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Select a status for each insurance: <strong>Submitted</strong>, <strong>Pending</strong>, or <strong>Approved</strong>. Mark as Pending to configure automated AESAS reminders via Resend API.
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {entityPayers.map((payer) => {
                      const enrollment = getEnrollment(activeInsuranceEmployee, payer.id);
                      const currentStatus = getEffectivePayerStatus(activeInsuranceEmployee, payer);
                      const isOtherEntityPayer = Boolean(
                        selectedEntityId &&
                        payer.entityIds &&
                        payer.entityIds.length > 0 &&
                        !payer.entityIds.includes(selectedEntityId)
                      );
                      const inputKey = `${activeInsuranceEmployee.id}_${payer.id}`;
                      const pendingInput = pendingReminderInputs[inputKey] || {
                        date: enrollment?.reminderDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                        time: enrollment?.reminderTime || '09:00',
                        email: enrollment?.reminderEmail || currentAccount?.email || 'credentialing@proficiotherapy.com',
                      };

                      return (
                        <div key={payer.id} className="p-4.5 space-y-3 hover:bg-slate-50/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className="text-sm font-bold text-slate-900">{payer.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                  {payer.type}
                                </span>
                                {isOtherEntityPayer && (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-medium border border-slate-200">
                                    Other Entity Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Method: {payer.submissionMethod} &bull; Avg Turnaround: {payer.averageTatDays || 60} Days
                              </p>
                            </div>

                            {/* 4 STATUS BUTTONS: Submitted, Pending, Approved, Not Applicable */}
                            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleSetInsuranceStatus(activeInsuranceEmployee, payer, 'Submitted')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'Submitted'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                Submitted
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetInsuranceStatus(activeInsuranceEmployee, payer, 'Pending')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'Pending'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                Pending
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetInsuranceStatus(activeInsuranceEmployee, payer, 'Approved')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'Approved'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                Approved
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetInsuranceStatus(activeInsuranceEmployee, payer, 'Not Applicable')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'Not Applicable'
                                    ? 'bg-slate-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                Not Applicable
                              </button>
                            </div>
                          </div>

                          {/* IF NOT APPLICABLE */}
                          {currentStatus === 'Not Applicable' && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center space-x-2">
                              <Info className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>Not applicable for this clinician or entity — excluded from credentialing pipeline.</span>
                            </div>
                          )}

                          {/* IF PENDING IS CHECKED: DISPLAY DATE OF REMINDING & TIME OF GETTING EMAIL */}
                          {currentStatus === 'Pending' && (
                            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                                <BellRing className="w-4 h-4 text-amber-600" />
                                <span>Configure Automated AESAS Reminder (Resend API)</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Date of Reminding:
                                  </label>
                                  <input
                                    type="date"
                                    value={pendingInput.date}
                                    onChange={(e) => {
                                      setPendingReminderInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...pendingInput, date: e.target.value },
                                      }));
                                    }}
                                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Time of getting email:
                                  </label>
                                  <input
                                    type="time"
                                    value={pendingInput.time}
                                    onChange={(e) => {
                                      setPendingReminderInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...pendingInput, time: e.target.value },
                                      }));
                                    }}
                                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Recipient Specialist Email:
                                  </label>
                                  <input
                                    type="email"
                                    value={pendingInput.email}
                                    onChange={(e) => {
                                      setPendingReminderInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...pendingInput, email: e.target.value },
                                      }));
                                    }}
                                    placeholder="credentialing@proficiotherapy.com"
                                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[11px] text-amber-800">
                                  Resends automatically the next day until status is marked Approved.
                                </span>
                                <button
                                  type="button"
                                  disabled={pendingInput.isSaving}
                                  onClick={() => handleSchedulePendingReminder(activeInsuranceEmployee, payer)}
                                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{pendingInput.isSaving ? 'Scheduling Alert...' : 'Save & Register in AESAS'}</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* IF APPROVED: SHOW DATES OVERVIEW */}
                          {currentStatus === 'Approved' && (
                            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center space-x-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div>
                                  <span className="font-bold text-emerald-900">Approved &amp; Credentialed</span>
                                  <p className="text-[11px] text-emerald-700">
                                    Effective: <strong>{enrollment?.effectiveDate || enrollment?.startDate || 'Configured'}</strong> &bull; Expiration: <strong>{enrollment?.expirationDate || 'Configured'}</strong>
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => setInsuranceSubTab('approved_dates')}
                                className="text-emerald-800 font-bold hover:underline text-xs flex items-center space-x-1"
                              >
                                <span>View in Validity Dates Tab &rarr;</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: APPROVED INSURANCES & VALIDITY DATES (Effective Date and Expiration Date) */}
              {insuranceSubTab === 'approved_dates' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Approved Insurances &bull; {activeInsuranceEmployee.firstName} {activeInsuranceEmployee.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Displays every approved insurance for this clinician with Effective Date and Expiration Date.
                      </p>
                    </div>

                    <button
                      onClick={() => setInsuranceSubTab('assigned_status')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      &larr; Manage Statuses
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Insurance Payer</th>
                          <th className="py-3 px-4">Effective Date</th>
                          <th className="py-3 px-4">Expiration Date</th>
                          <th className="py-3 px-4 text-center">Validity Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(() => {
                          const approvedList = entityPayers.filter((pyr) => {
                            const status = getEffectivePayerStatus(activeInsuranceEmployee, pyr);
                            return status === 'Approved';
                          });

                          if (approvedList.length === 0) {
                            return (
                              <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                                  No approved insurances yet for this clinician. Switch to the &quot;Insurances Assigned &amp; Status&quot; tab and click <strong>Approved</strong> to add validity dates.
                                </td>
                              </tr>
                            );
                          }

                          return approvedList.map((payer) => {
                            const enr = getEnrollment(activeInsuranceEmployee, payer.id);
                            const inputKey = `${activeInsuranceEmployee.id}_${payer.id}`;
                            const dateInput = approvedDateInputs[inputKey] || {
                              startDate: enr?.effectiveDate || enr?.startDate || new Date().toISOString().split('T')[0],
                              expirationDate: enr?.expirationDate || new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0],
                            };

                            // Calculate status
                            const isExpired = enr?.expirationDate ? new Date(enr.expirationDate) < new Date() : false;

                            return (
                              <tr key={payer.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-slate-900">{payer.name}</div>
                                  <div className="text-[11px] text-slate-400">{payer.type}</div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <input
                                    type="date"
                                    value={dateInput.startDate}
                                    onChange={(e) => {
                                      setApprovedDateInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...dateInput, startDate: e.target.value },
                                      }));
                                    }}
                                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                </td>

                                <td className="py-3.5 px-4">
                                  <input
                                    type="date"
                                    value={dateInput.expirationDate}
                                    onChange={(e) => {
                                      setApprovedDateInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...dateInput, expirationDate: e.target.value },
                                      }));
                                    }}
                                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                </td>

                                <td className="py-3.5 px-4 text-center">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                                    isExpired 
                                      ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  }`}>
                                    {isExpired ? 'Expired / Recredentialing Due' : 'Active & Valid'}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    onClick={() => handleSaveApprovedDates(activeInsuranceEmployee, payer.id, payer.name)}
                                    disabled={dateInput.isSaving}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                                  >
                                    {dateInput.isSaving ? 'Saving...' : 'Update Dates'}
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* CLINICIAN CARD GRID FOR MANAGING INSURANCES (SAME AS 360 VIEW) */
            <div className="space-y-4">
              {/* Search & Discipline Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative min-w-[240px] flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${activeEntity?.dba || 'entity'} clinicians by name, NPI, or email...`}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                    />
                  </div>

                  {/* Discipline filter */}
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    {disciplineOptions.map((disc) => (
                      <button
                        key={disc}
                        onClick={() => setSelectedDiscipline(disc)}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          selectedDiscipline === disc ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {disc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{filteredProviders.length}</span>
                  <span>Clinicians in {activeEntity?.dba || 'Entity'}</span>
                </div>
              </div>

              {/* Grid of Clinician Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProviders.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                    No clinical personnel matched your search criteria in this entity.
                  </div>
                ) : (
                  filteredProviders.map((prov) => {
                    const isProvRbt = isProviderRbt(prov);
                    const rbtCert = (prov as any).rbtCertificationNumber || (prov as any).contractInfo?.rbtCertificationNumber || prov.licenseNumber || '—';
                    const regionName = (prov as any).region || (prov as any).contractInfo?.region || getLocationName(prov.primaryLocationId);

                    // Compute status counts for this provider using effective status
                    let approvedCount = 0;
                    let pendingCount = 0;
                    let submittedCount = 0;
                    let naCount = 0;

                    entityPayers.forEach((payer) => {
                      const status = getEffectivePayerStatus(prov, payer);
                      if (status === 'Approved') approvedCount++;
                      else if (status === 'Pending') pendingCount++;
                      else if (status === 'Submitted') submittedCount++;
                      else if (status === 'Not Applicable') naCount++;
                    });

                    return (
                      <div
                        key={prov.id}
                        onClick={() => setSelectedInsuranceEmployeeId(prov.id)}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3.5">
                          {/* Header with Avatar & Disciplines */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-11 h-11 rounded-full font-bold flex items-center justify-center text-sm border shrink-0 ${
                                isProvRbt ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                {(prov.firstName || '').charAt(0)}{(prov.lastName || '').charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  {prov.firstName} {prov.lastName}, {isProvRbt ? 'RBT' : (prov.credentials || 'Clinician')}
                                </h4>
                                <div className="flex items-center space-x-2 mt-0.5">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    isProvRbt ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {isProvRbt ? 'RBT' : (prov.disciplines?.[0] || (prov as any).discipline || 'Clinical')}
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    {isProvRbt ? regionName : getLocationName(prov.primaryLocationId)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* NPI & CAQH / RBT identifiers */}
                          {isProvRbt ? (
                            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[10px]">RBT Cert #:</span>
                                <span className="font-mono font-bold text-amber-900 truncate block">{rbtCert}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Region:</span>
                                <span className="font-semibold text-slate-800 truncate block">{regionName}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Individual NPI:</span>
                                <span className="font-mono font-bold text-slate-700">{prov.npi || '—'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">CAQH ProView ID:</span>
                                <span className="font-mono font-bold text-slate-700">{prov.caqhId || '—'}</span>
                              </div>
                            </div>
                          )}

                          {/* Insurance status summary pills */}
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                              Payer Enrollments Breakdown:
                            </div>
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {approvedCount} Approved
                              </span>
                              <span className="px-2 py-0.5 rounded-md font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {pendingCount} Pending
                              </span>
                              <span className="px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {submittedCount} Submitted
                              </span>
                              <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {naCount} N/A
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer CTA */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                          <span className="flex items-center space-x-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Manage Insurances &amp; Panel</span>
                          </span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FULL CLINICAL STAFF PROFILE & 360 CARD (4-WAY INSURANCE TOGGLE)   */}
      {/* ========================================================================= */}
      {selectedProfileEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[94vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#2B4C9D] font-bold flex items-center justify-center text-lg shadow-xs shrink-0">
                  {(selectedProfileEmployee.firstName || '').charAt(0)}{(selectedProfileEmployee.lastName || '').charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedProfileEmployee.firstName} {selectedProfileEmployee.lastName}, {selectedProfileEmployee.credentials}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedProfileEmployee.employmentStatus || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedProfileEmployee.providerType} &bull; {selectedProfileEmployee.disciplines?.join(', ') || (selectedProfileEmployee as any).discipline || 'Clinical Staff'} &bull; <span className="font-semibold text-slate-700">{activeEntity?.dba || 'Proficio Therapy'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProfileEmployee(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 MODAL TABS */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 overflow-x-auto scrollbar-none gap-1">
              <button
                type="button"
                onClick={() => setProfileModalTab('insurances')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  profileModalTab === 'insurances'
                    ? 'bg-white text-[#2B4C9D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#2B4C9D]" />
                <span>Insurances &amp; Credentialing Status</span>
                <span className="px-1.5 py-0.2 bg-blue-100 text-[#2B4C9D] rounded-full text-[10px] font-bold">
                  {(selectedProfileEmployee.payerEnrollments || []).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProfileModalTab('360_card')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  profileModalTab === '360_card'
                    ? 'bg-white text-[#2B4C9D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-4 h-4 text-[#2B4C9D]" />
                <span>Employee 360 Profile (Edit All Fields)</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileModalTab('documents')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  profileModalTab === 'documents'
                    ? 'bg-white text-[#2B4C9D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Paperclip className="w-4 h-4 text-[#2B4C9D]" />
                <span>Document Vault</span>
                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
                  {(selectedProfileEmployee.documentLinks || []).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProfileModalTab('notes')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  profileModalTab === 'notes'
                    ? 'bg-white text-[#2B4C9D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#2B4C9D]" />
                <span>Activity Notes</span>
                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
                  {(selectedProfileEmployee.commentLogs || []).length}
                </span>
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="overflow-y-auto space-y-6 pr-1 flex-1">
              {/* ================================================================= */}
              {/* TAB 1: INSURANCES & 4-WAY TOGGLE (Submitted, Pending, Approved, Not Applicable) */}
              {/* ================================================================= */}
              {profileModalTab === 'insurances' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-blue-50/60 border border-blue-200/70 rounded-2xl">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-[#2B4C9D]" />
                        <span>Insurances Assigned to {selectedProfileEmployee.firstName} {selectedProfileEmployee.lastName}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Toggle insurance status between <strong>Submitted</strong>, <strong>Pending</strong>, <strong>Approved</strong>, or <strong>Not Applicable</strong>. Dashboard KPIs update immediately.
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                      Entity: <span className="font-bold text-[#2B4C9D]">{activeEntity?.dba || 'Selected Entity'}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    {entityPayers.map((payer) => {
                      const enrollment = getEnrollment(selectedProfileEmployee, payer.id);
                      const currentStatus = enrollment?.status || enrollment?.approvalStatus || 'Not Enrolled';
                      const inputKey = `${selectedProfileEmployee.id}_${payer.id}`;
                      const pendingInput = pendingReminderInputs[inputKey] || {
                        date: enrollment?.reminderDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                        time: enrollment?.reminderTime || '09:00',
                        email: enrollment?.reminderEmail || currentAccount?.email || 'credentialing@proficiotherapy.com',
                      };
                      const dateInput = approvedDateInputs[inputKey] || {
                        startDate: enrollment?.startDate || new Date().toISOString().split('T')[0],
                        expirationDate: enrollment?.expirationDate || new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0],
                      };
                      const isExpired = enrollment?.expirationDate ? new Date(enrollment.expirationDate) < new Date() : false;

                      return (
                        <div key={payer.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-slate-900">{payer.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                  {payer.type}
                                </span>
                                {currentStatus === 'Approved' && (
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                                    isExpired ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  }`}>
                                    {isExpired ? 'Expired' : 'Active & Approved'}
                                  </span>
                                )}
                                {currentStatus === 'Not Applicable' && (
                                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600 border border-slate-300">
                                    Not Applicable
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Method: {payer.submissionMethod} &bull; Avg TAT: {payer.averageTatDays || 60} Days
                              </p>
                            </div>

                            {/* 4 STATUS BUTTONS: Submitted, Pending, Approved, Not Applicable */}
                            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleSetInsuranceStatus(selectedProfileEmployee, payer, 'Submitted')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'Submitted'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                Submitted
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetInsuranceStatus(selectedProfileEmployee, payer, 'Pending')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'Pending'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                Pending
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetInsuranceStatus(selectedProfileEmployee, payer, 'Approved')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'Approved'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                Approved
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetInsuranceStatus(selectedProfileEmployee, payer, 'Not Applicable')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentStatus === 'Not Applicable'
                                    ? 'bg-slate-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                Not Applicable
                              </button>
                            </div>
                          </div>

                          {/* IF NOT APPLICABLE */}
                          {currentStatus === 'Not Applicable' && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center space-x-2">
                              <Info className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>
                                This insurance is marked as <strong>Not Applicable</strong> for {selectedProfileEmployee.firstName} {selectedProfileEmployee.lastName} or {activeEntity?.dba || 'this entity'}. Excluded from credentialing pipeline and reminder alerts.
                              </span>
                            </div>
                          )}

                          {/* IF PENDING: CONFIGURE AUTOMATED AESAS REMINDER */}
                          {currentStatus === 'Pending' && (
                            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                                <BellRing className="w-4 h-4 text-amber-600" />
                                <span>Configure Automated AESAS Reminder (Resend API)</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Date of Reminding:
                                  </label>
                                  <input
                                    type="date"
                                    value={pendingInput.date}
                                    onChange={(e) => {
                                      setPendingReminderInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...pendingInput, date: e.target.value },
                                      }));
                                    }}
                                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Time of getting email:
                                  </label>
                                  <input
                                    type="time"
                                    value={pendingInput.time}
                                    onChange={(e) => {
                                      setPendingReminderInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...pendingInput, time: e.target.value },
                                      }));
                                    }}
                                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Recipient Email:
                                  </label>
                                  <input
                                    type="email"
                                    value={pendingInput.email}
                                    onChange={(e) => {
                                      setPendingReminderInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...pendingInput, email: e.target.value },
                                      }));
                                    }}
                                    placeholder="email@proficiotherapy.com"
                                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSchedulePendingReminder(selectedProfileEmployee, payer)}
                                  disabled={pendingInput.isSaving}
                                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
                                >
                                  <BellRing className="w-3.5 h-3.5" />
                                  <span>{pendingInput.isSaving ? 'Scheduling Alert...' : 'Schedule AESAS Alert'}</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* IF APPROVED: SHOW VALIDITY DATES */}
                          {currentStatus === 'Approved' && (
                            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Approved Credentialing Validity Dates</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  isExpired ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}>
                                  {isExpired ? 'Expired / Recredentialing Overdue' : 'Valid & Effective'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Effective Start Date:
                                  </label>
                                  <input
                                    type="date"
                                    value={dateInput.startDate}
                                    onChange={(e) => {
                                      setApprovedDateInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...dateInput, startDate: e.target.value },
                                      }));
                                    }}
                                    className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Expiration / Recredentialing Date:
                                  </label>
                                  <input
                                    type="date"
                                    value={dateInput.expirationDate}
                                    onChange={(e) => {
                                      setApprovedDateInputs((prev) => ({
                                        ...prev,
                                        [inputKey]: { ...dateInput, expirationDate: e.target.value },
                                      }));
                                    }}
                                    className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveApprovedDates(selectedProfileEmployee, payer.id, payer.name)}
                                  disabled={dateInput.isSaving}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{dateInput.isSaving ? 'Updating...' : 'Update Validity Dates'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB 2: EMPLOYEE 360 PROFILE (ALL FIELDS EDITABLE WITH DROPDOWNS) */}
              {/* ================================================================= */}
              {profileModalTab === '360_card' && edit360Form && (
                <form onSubmit={handleSave360Card} className="space-y-5">
                  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Employee 360 Master Record
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Update any field or dropdown below and click "Save 360 Changes" to persist across the system.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving360}
                      className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving360 ? 'Saving 360...' : 'Save 360 Changes'}</span>
                    </button>
                  </div>

                  {/* SECTION 1: PERSONAL & CLINICAL IDENTITY */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B4C9D]">
                      1. Personal &amp; Clinical Identity
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          First Name: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={edit360Form.firstName}
                          onChange={(e) => setEdit360Form({ ...edit360Form, firstName: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Last Name: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={edit360Form.lastName}
                          onChange={(e) => setEdit360Form({ ...edit360Form, lastName: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Professional Credentials:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.credentials}
                          onChange={(e) => setEdit360Form({ ...edit360Form, credentials: e.target.value })}
                          placeholder="e.g. BCBA, MS, OTR/L"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Provider Type / Role:
                        </label>
                        <select
                          value={edit360Form.providerType}
                          onChange={(e) => setEdit360Form({ ...edit360Form, providerType: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          <option value="BCBA">BCBA (Board Certified Behavior Analyst)</option>
                          <option value="BCaBA">BCaBA (Assistant Behavior Analyst)</option>
                          <option value="RBT">RBT (Registered Behavior Technician)</option>
                          <option value="SLP">SLP (Speech Language Pathologist)</option>
                          <option value="SLPA">SLPA (Speech Language Pathology Assistant)</option>
                          <option value="OT">OT (Occupational Therapist)</option>
                          <option value="OTA">OTA (Occupational Therapy Assistant)</option>
                          <option value="PT">PT (Physical Therapist)</option>
                          <option value="PTA">PTA (Physical Therapy Assistant)</option>
                          <option value="Psychologist">Licensed Psychologist</option>
                          <option value="LMFT">LMFT (Marriage & Family Therapist)</option>
                          <option value="LCSW">LCSW (Clinical Social Worker)</option>
                          <option value="Physician">Medical Physician (MD/DO)</option>
                          <option value="Other">Other Specialist</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Primary Discipline:
                        </label>
                        <select
                          value={edit360Form.disciplines[0] || 'ABA'}
                          onChange={(e) => setEdit360Form({ ...edit360Form, disciplines: [e.target.value] })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          <option value="ABA">ABA (Applied Behavior Analysis)</option>
                          <option value="Speech">Speech-Language Therapy</option>
                          <option value="OT">Occupational Therapy</option>
                          <option value="PT">Physical Therapy</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          10-Digit Individual NPI: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={10}
                          value={edit360Form.npi}
                          onChange={(e) => setEdit360Form({ ...edit360Form, npi: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Taxonomy Code:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.taxonomy}
                          onChange={(e) => setEdit360Form({ ...edit360Form, taxonomy: e.target.value })}
                          placeholder="e.g. 103K00000X"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Clinical Specialty:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.specialty}
                          onChange={(e) => setEdit360Form({ ...edit360Form, specialty: e.target.value })}
                          placeholder="e.g. Behavioral Analysis, Early Intervention"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Region / Territory:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.region}
                          onChange={(e) => setEdit360Form({ ...edit360Form, region: e.target.value })}
                          placeholder="e.g. Bay Area, Southern California, Salt Lake"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: ENTITY & EMPLOYMENT CLASSIFICATION */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B4C9D]">
                      2. Entity Affiliation &amp; Employment Status
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Primary Legal Entity:
                        </label>
                        <select
                          value={edit360Form.primaryEntityId}
                          onChange={(e) => setEdit360Form({ ...edit360Form, primaryEntityId: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          {entities.map((ent) => (
                            <option key={ent.id} value={ent.id}>
                              {ent.dba} ({ent.legalName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          DBA Rendering Name:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.dba}
                          onChange={(e) => setEdit360Form({ ...edit360Form, dba: e.target.value })}
                          placeholder="e.g. Proficio Therapy Services"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Employment Status:
                        </label>
                        <select
                          value={edit360Form.employmentStatus}
                          onChange={(e) => setEdit360Form({ ...edit360Form, employmentStatus: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Terminated">Terminated</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Contract Classification:
                        </label>
                        <select
                          value={edit360Form.contractStatus}
                          onChange={(e) => setEdit360Form({ ...edit360Form, contractStatus: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          <option value="W-2 Full-Time">W-2 Full-Time</option>
                          <option value="W-2 Part-Time">W-2 Part-Time</option>
                          <option value="1099 Contractor">1099 Contractor</option>
                          <option value="PRN / Per Diem">PRN / Per Diem</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Hire / Start Date:
                        </label>
                        <input
                          type="date"
                          value={edit360Form.startDate}
                          onChange={(e) => setEdit360Form({ ...edit360Form, startDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Primary Practice Location:
                        </label>
                        <select
                          value={edit360Form.primaryLocationId}
                          onChange={(e) => setEdit360Form({ ...edit360Form, primaryLocationId: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name} ({loc.city}, {loc.state})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: STATE LICENSES & CERTIFICATIONS */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B4C9D]">
                      3. State Licenses &amp; Board Certifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Primary State License Number:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.licenseNumber}
                          onChange={(e) => setEdit360Form({ ...edit360Form, licenseNumber: e.target.value })}
                          placeholder="e.g. BCBA-1-20-41589"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          License State:
                        </label>
                        <select
                          value={edit360Form.licenseState}
                          onChange={(e) => setEdit360Form({ ...edit360Form, licenseState: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          {['CA', 'UT', 'WA', 'AZ', 'NV', 'OR', 'TX', 'CO', 'NY', 'FL'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          License Expiration Date:
                        </label>
                        <input
                          type="date"
                          value={edit360Form.licenseExpiration}
                          onChange={(e) => setEdit360Form({ ...edit360Form, licenseExpiration: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          BACB Certification Number:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.bcbaCertificationNumber}
                          onChange={(e) => setEdit360Form({ ...edit360Form, bcbaCertificationNumber: e.target.value })}
                          placeholder="e.g. 1-20-41589"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          BACB Effective Date:
                        </label>
                        <input
                          type="date"
                          value={edit360Form.bcbaEffectiveDate}
                          onChange={(e) => setEdit360Form({ ...edit360Form, bcbaEffectiveDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          BACB Expiration Date:
                        </label>
                        <input
                          type="date"
                          value={edit360Form.bcbaExpiryDate}
                          onChange={(e) => setEdit360Form({ ...edit360Form, bcbaExpiryDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      {/* RBT Fields - Specifically for AGES entity */}
                      {(isAgesEntity || edit360Form.providerType === 'RBT') && (
                        <>
                          <div className="sm:col-span-full pt-2 pb-1 border-t border-slate-100 flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              AGES RBT Credentials
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Registered Behavior Technician Certification (Only for AGES)
                            </span>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              RBT Certification Number:
                            </label>
                            <input
                              type="text"
                              value={edit360Form.rbtCertificationNumber}
                              onChange={(e) => setEdit360Form({ ...edit360Form, rbtCertificationNumber: e.target.value })}
                              placeholder="e.g. RBT-21-17894"
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              RBT Effective Date:
                            </label>
                            <input
                              type="date"
                              value={edit360Form.rbtEffectiveDate}
                              onChange={(e) => setEdit360Form({ ...edit360Form, rbtEffectiveDate: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              RBT Expiration Date:
                            </label>
                            <input
                              type="date"
                              value={edit360Form.rbtExpiryDate}
                              onChange={(e) => setEdit360Form({ ...edit360Form, rbtExpiryDate: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Utah State License:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.utStateLicense}
                          onChange={(e) => setEdit360Form({ ...edit360Form, utStateLicense: e.target.value })}
                          placeholder="e.g. UT-DOPL-9842"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: CAQH PROVIEW & ATTESTATIONS */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B4C9D]">
                      4. CAQH ProView &amp; Attestation Status
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          CAQH ProView ID:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.caqhId}
                          onChange={(e) => setEdit360Form({ ...edit360Form, caqhId: e.target.value })}
                          placeholder="e.g. 18294710"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          CAQH Attestation Status:
                        </label>
                        <select
                          value={edit360Form.caqhStatus}
                          onChange={(e) => setEdit360Form({ ...edit360Form, caqhStatus: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          <option value="Attested">Attested &amp; Current</option>
                          <option value="In Review">In Review</option>
                          <option value="Expired">Expired / Needs Re-attestation</option>
                          <option value="Not Enrolled">Not Enrolled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Last Attestation Date:
                        </label>
                        <input
                          type="date"
                          value={edit360Form.lastAttestationDate}
                          onChange={(e) => setEdit360Form({ ...edit360Form, lastAttestationDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Next Attestation Due:
                        </label>
                        <input
                          type="date"
                          value={edit360Form.nextAttestationDate}
                          onChange={(e) => setEdit360Form({ ...edit360Form, nextAttestationDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Medi-Cal / PAVE Status:
                        </label>
                        <select
                          value={edit360Form.paveStatus}
                          onChange={(e) => setEdit360Form({ ...edit360Form, paveStatus: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          <option value="Approved">Approved</option>
                          <option value="In Review">In Review</option>
                          <option value="Pending">Pending Application</option>
                          <option value="Not Required">Not Required</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: DIRECT CONTACT DETAILS */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B4C9D]">
                      5. Direct Contact &amp; Clinical Notes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Direct Contact Email:
                        </label>
                        <input
                          type="email"
                          value={edit360Form.email}
                          onChange={(e) => setEdit360Form({ ...edit360Form, email: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Direct Phone Number:
                        </label>
                        <input
                          type="tel"
                          value={edit360Form.phone}
                          onChange={(e) => setEdit360Form({ ...edit360Form, phone: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Physical Address / Mailing Address:
                        </label>
                        <input
                          type="text"
                          value={edit360Form.contactAddress}
                          onChange={(e) => setEdit360Form({ ...edit360Form, contactAddress: e.target.value })}
                          placeholder="Street Address, Suite, City, State, Zip"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Clinical Notes &amp; Special Considerations:
                        </label>
                        <textarea
                          rows={3}
                          value={edit360Form.notes}
                          onChange={(e) => setEdit360Form({ ...edit360Form, notes: e.target.value })}
                          placeholder="Enter any internal notes, background, or onboarding instructions..."
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setProfileModalTab('insurances')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Back to Insurances
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving360}
                      className="px-6 py-2.5 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving360 ? 'Saving All Changes...' : 'Save 360 Changes'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ================================================================= */}
              {/* TAB 3: DOCUMENT LINKS ATTACH FIELD & VAULT                       */}
              {/* ================================================================= */}
              {profileModalTab === 'documents' && (
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-[#2B4C9D]" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Document Links &amp; Attachment Vault
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      {(selectedProfileEmployee.documentLinks || []).length} Attached Documents
                    </span>
                  </div>

                  {/* Form to attach document link */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-700">
                      Attach New Document Link (License, COI, W-9, CAQH PDF, Board Cert):
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          placeholder="Document Title (e.g. State License)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <input
                          type="url"
                          value={newDocUrl}
                          onChange={(e) => setNewDocUrl(e.target.value)}
                          placeholder="Document URL / Link (https://...)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <select
                          value={newDocCategory}
                          onChange={(e) => setNewDocCategory(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        >
                          <option value="License">License</option>
                          <option value="Insurance Policy">Insurance / COI</option>
                          <option value="Board Certification">Board Cert</option>
                          <option value="CAQH">CAQH Profile</option>
                          <option value="Tax Form">W-9 / Tax</option>
                          <option value="Other">Other Document</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={isAddingDocLink || !newDocTitle.trim() || !newDocUrl.trim()}
                        onClick={handleAddDocumentLink}
                        className="px-4 py-1.5 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingDocLink ? 'Attaching...' : 'Attach Document Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Attached Documents */}
                  <div className="space-y-2">
                    {(selectedProfileEmployee.documentLinks || []).length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No document links attached yet for this employee. Paste any Google Drive, Box, or cloud storage link above.
                      </div>
                    ) : (
                      (selectedProfileEmployee.documentLinks || []).map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <Paperclip className="w-4 h-4 text-[#2B4C9D] shrink-0" />
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 block truncate">{doc.title}</span>
                              <span className="text-[11px] text-slate-400 block truncate">
                                {doc.category || 'Document'} &bull; {doc.url}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#2B4C9D] rounded-lg border border-slate-200 text-xs font-semibold flex items-center space-x-1"
                            >
                              <span>Open Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => handleDeleteDocumentLink(doc.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Remove link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB 4: COMMENTS & NOTES LOG                                      */}
              {/* ================================================================= */}
              {profileModalTab === 'notes' && (
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-[#2B4C9D]" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Profile Notes &amp; Activity Log
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      {(selectedProfileEmployee.commentLogs || []).length} Notes Logged
                    </span>
                  </div>

                  {/* Input box for new note */}
                  <div className="flex gap-2">
                    <textarea
                      value={profileCommentText}
                      onChange={(e) => setProfileCommentText(e.target.value)}
                      placeholder="Type notes or credentialing update for this employee..."
                      rows={2}
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                    />
                    <button
                      disabled={isPostingComment || !profileCommentText.trim()}
                      onClick={handlePostProfileComment}
                      className="px-4 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isPostingComment ? 'Saving...' : 'Post Note'}</span>
                    </button>
                  </div>

                  {/* History of notes */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-100">
                    {(selectedProfileEmployee.commentLogs || []).length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl">
                        No comments logged yet for this employee.
                      </div>
                    ) : (
                      (selectedProfileEmployee.commentLogs || []).map((c) => (
                        <div key={c.id} className="pt-2 text-xs">
                          <div className="flex items-center justify-between text-slate-500 text-[11px]">
                            <span className="font-bold text-slate-800">{c.authorName} ({c.authorRole})</span>
                            <span>{c.timestamp}</span>
                          </div>
                          <p className="text-slate-700 mt-1">{c.notes}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <div className="text-[11px] text-slate-400">
                Employee ID: <span className="font-mono">{selectedProfileEmployee.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfileEmployee(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                Close Profile Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ClinicalStaffHub;
