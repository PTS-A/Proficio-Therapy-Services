import React, { useState } from 'react';
import { Provider, ApplicationType } from '../../types';
import { useCredentialing } from '../../context/CredentialingContext';
import { ClinicalStaffComments } from './ClinicalStaffComments';
import { ClinicalStaffDocuments } from './ClinicalStaffDocuments';
import { 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Briefcase, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Tag, 
  ExternalLink, 
  ChevronRight, 
  Share2, 
  Sparkles,
  Link2,
  X,
  Printer,
  Edit3
} from 'lucide-react';

interface ClinicalStaffReviewPageProps {
  providerId: string;
  onBackToDirectory: () => void;
  onEditProvider: (provider: Provider) => void;
  onSelectRecord?: (recordId: string) => void;
}

export const ClinicalStaffReviewPage: React.FC<ClinicalStaffReviewPageProps> = ({
  providerId,
  onBackToDirectory,
  onEditProvider,
  onSelectRecord,
}) => {
  const { 
    providers, 
    payers, 
    entities, 
    locations, 
    users, 
    currentUser, 
    addRecord, 
    updateProvider,
    records,
    addProviderCommentLog
  } = useCredentialing();

  const provider = providers.find((p) => p.id === providerId);

  // Active subtab on review page: 'data' | 'comments' | 'documents'
  const [activeReviewTab, setActiveReviewTab] = useState<'overview' | 'comments' | 'documents'>('overview');

  // Inline Quick Link Form State
  const [isLinkingExpanded, setIsLinkingExpanded] = useState(true);
  const [linkPayerId, setLinkPayerId] = useState(payers[0]?.id || '');
  const [linkEntityId, setLinkEntityId] = useState(provider?.primaryEntityId || entities[0]?.id || '');
  const [linkLocationId, setLinkLocationId] = useState(provider?.primaryLocationId || locations[0]?.id || '');
  const [linkAppType, setLinkAppType] = useState<ApplicationType>('Provider linking');
  const [linkStatus, setLinkStatus] = useState<'Linked' | 'Pending Approval' | 'In Progress'>('Linked');
  const [linkEffectiveDate, setLinkEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [linkSpecialistId, setLinkSpecialistId] = useState(users[0]?.id || currentUser.id);
  const [linkNotes, setLinkNotes] = useState('');
  const [linkSuccessMessage, setLinkSuccessMessage] = useState<string | null>(null);

  if (!provider) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
        <p className="text-slate-600 font-semibold">Clinical staff member not found.</p>
        <button
          onClick={onBackToDirectory}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700"
        >
          Return to Clinical Staff Directory
        </button>
      </div>
    );
  }

  const primaryEntity = entities.find((e) => e.id === provider.primaryEntityId);
  const primaryLoc = locations.find((l) => l.id === provider.primaryLocationId);

  const handleCreateProviderLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkPayerId || !linkEntityId || !linkLocationId) {
      alert('Please select Payer, Entity, and Location.');
      return;
    }

    const selectedPayer = payers.find((p) => p.id === linkPayerId);
    const selectedEntity = entities.find((e) => e.id === linkEntityId);

    // 1. Create a new Credentialing / Linking Record in system
    const newRecord = addRecord({
      providerId: provider.id,
      payerId: linkPayerId,
      entityId: linkEntityId,
      locationId: linkLocationId,
      applicationType: linkAppType,
      discipline: provider.disciplines?.[0] || 'ABA',
      specialistId: linkSpecialistId,
      currentStage: linkStatus === 'Linked' ? 'STAGE_8_LINK_EFFECTIVE' : 'STAGE_4_PACKET_SUBMITTED',
      linkEffectiveDate: linkStatus === 'Linked' ? linkEffectiveDate : undefined,
      submissionDate: new Date().toISOString().split('T')[0],
      approvalDate: linkStatus === 'Linked' ? linkEffectiveDate : undefined,
    });

    // 2. Update Provider's payerEnrollments
    const newEnrollment = {
      payerId: linkPayerId,
      payerName: selectedPayer?.name || 'Insurance Payer',
      status: linkStatus === 'Linked' ? ('In-Network' as const) : ('Application In Progress' as const),
      effectiveDate: linkStatus === 'Linked' ? linkEffectiveDate : '',
      providerIdNumber: `${selectedPayer?.name.substring(0, 3).toUpperCase()}-${provider.npi.substring(5)}`,
    };

    const existingEnrollments = provider.payerEnrollments || [];
    const updatedEnrollments = [...existingEnrollments, newEnrollment];

    updateProvider(provider.id, {
      payerEnrollments: updatedEnrollments,
    });

    // 3. Log into Comment Section
    addProviderCommentLog(provider.id, {
      comment: `Linked with payer ${selectedPayer?.name} under ${selectedEntity?.name}. Status: ${linkStatus}. Effective: ${linkEffectiveDate}.`,
      targetPerson: `${provider.firstName} ${provider.lastName} (Clinical Staff)`,
      statusFrom: provider.currentStatus || 'Active',
      statusTo: 'Payer Linking',
      category: 'Payer Review',
    });

    setLinkSuccessMessage(`Successfully linked with ${selectedPayer?.name}! Record created.`);
    setLinkNotes('');
    setTimeout(() => setLinkSuccessMessage(null), 4000);
  };

  const payerEnrollments = provider.payerEnrollments || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Staff Directory</span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Clinical Staff Profile /</span>
              <span className="text-xs font-bold text-slate-800">
                {provider.firstName} {provider.lastName}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <span>{provider.firstName} {provider.lastName}</span>
              {provider.credentials && (
                <span className="text-sm font-semibold text-slate-500">
                  ({provider.credentials})
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onEditProvider(provider)}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Inputted Data</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Summary</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLinkingExpanded(true)}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Link with Providers</span>
          </button>
        </div>
      </div>

      {/* Success Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-5 rounded-2xl border border-emerald-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  Clinical Staff Record Successfully Saved
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Ready for Linking
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Review all currently inputted clinical data below. Next, use the <strong>"+ Link with Providers"</strong> card to link this clinician to participating payer contracts and entities.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-emerald-200/80">
              <span className="text-slate-400 block text-[10px]">NPI Number</span>
              <span className="font-mono font-bold text-slate-800">{provider.npi}</span>
            </div>
            <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-emerald-200/80">
              <span className="text-slate-400 block text-[10px]">Role / Type</span>
              <span className="font-bold text-sky-800">{provider.providerType}</span>
            </div>
            <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-emerald-200/80">
              <span className="text-slate-400 block text-[10px]">Current Status</span>
              <span className="font-bold text-emerald-800">{provider.currentStatus || 'Active'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 PROMINENT PLACE WITH PLUS SIGN TO LINK WITH PROVIDERS 🌟 */}
      <section className="bg-white rounded-2xl border-2 border-sky-300 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base tracking-wide">
                  Link with Providers & Insurance Networks
                </h3>
                <span className="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                  {payerEnrollments.length} Linked
                </span>
              </div>
              <p className="text-xs text-sky-100">
                Connect {provider.firstName} {provider.lastName} with legal practice entities and participating insurance payer networks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLinkingExpanded(!isLinkingExpanded)}
            className="px-4 py-2 bg-white hover:bg-sky-50 text-sky-800 rounded-xl text-xs font-black flex items-center space-x-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-sky-700 stroke-[3]" />
            <span>{isLinkingExpanded ? 'Hide Linking Form' : '+ Link with Providers'}</span>
          </button>
        </div>

        {/* Feedback message */}
        {linkSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{linkSuccessMessage}</span>
          </div>
        )}

        {/* Expanded Linking Panel */}
        {isLinkingExpanded && (
          <form
            onSubmit={handleCreateProviderLink}
            className="p-5 bg-sky-50/40 border-b border-sky-100 space-y-4"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-b border-slate-200/80 pb-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Create New Provider / Payer Contract Link</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Select Payer */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Insurance Payer Network *
                </label>
                <select
                  required
                  value={linkPayerId}
                  onChange={(e) => setLinkPayerId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                >
                  {payers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Entity */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Legal Practice Entity *
                </label>
                <select
                  required
                  value={linkEntityId}
                  onChange={(e) => setLinkEntityId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                >
                  {entities.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Location */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Practice Location *
                </label>
                <select
                  required
                  value={linkLocationId}
                  onChange={(e) => setLinkLocationId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.city}, {loc.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* Application / Linking Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Linking Type *
                </label>
                <select
                  value={linkAppType}
                  onChange={(e) => setLinkAppType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Provider linking">Provider linking (Roster)</option>
                  <option value="Initial Credentialing">Initial Credentialing</option>
                  <option value="Location Addition">Location Addition</option>
                  <option value="Re-credentialing">Re-credentialing</option>
                </select>
              </div>

              {/* Link Status */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Enrollment Status *
                </label>
                <select
                  value={linkStatus}
                  onChange={(e) => setLinkStatus(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Linked">Linked (Active In-Network)</option>
                  <option value="Pending Approval">Pending Payer Approval</option>
                  <option value="In Progress">Application In Progress</option>
                </select>
              </div>

              {/* Effective Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Effective Date *
                </label>
                <input
                  type="date"
                  required
                  value={linkEffectiveDate}
                  onChange={(e) => setLinkEffectiveDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Assigned Specialist */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Assigned Specialist
                </label>
                <select
                  value={linkSpecialistId}
                  onChange={(e) => setLinkSpecialistId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-black text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Confirm Provider Link</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Live List of Linked Payers & Providers */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Current Payer & Entity Linkings for {provider.firstName} {provider.lastName}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {payerEnrollments.length} active participating contracts
            </span>
          </div>

          {payerEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {payerEnrollments.map((enr, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2 hover:border-sky-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        {enr.payerName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ID: {enr.providerIdNumber || 'PENDING'}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        enr.status === 'In-Network'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {enr.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Effective: {enr.effectiveDate || 'Pending'}</span>
                    {enr.recredentialingDate && (
                      <span className="text-[10px] text-slate-400">
                        Due: {enr.recredentialingDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 space-y-2">
              <Link2 className="w-6 h-6 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No payers or providers linked yet.</p>
              <p className="text-[11px]">
                Click the <strong>"+ Link with Providers"</strong> button above to connect this clinical staff member to insurance plans.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Review Page Navigation Subtabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveReviewTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeReviewTab === 'overview'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Current Inputted Clinical Data</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReviewTab('comments')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeReviewTab === 'comments'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Comments & Status Logs</span>
          <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {provider.commentLogs?.length || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReviewTab('documents')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeReviewTab === 'documents'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Document Links Table</span>
          <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {provider.documents?.length || 0}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: CURRENT INPUTTED DATA (4 Domains) */}
      {activeReviewTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Basic & Licensure */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-900 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>1. Basic & Licensure Information</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                NPI Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Full Name</span>
                <span className="font-bold text-slate-800">
                  {provider.firstName} {provider.lastName} {provider.credentials}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">10-Digit NPI</span>
                <span className="font-mono font-bold text-slate-800">{provider.npi}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Provider Type & Discipline</span>
                <span className="font-semibold text-slate-800">
                  {provider.providerType} ({provider.disciplines?.join(', ')})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">State License #</span>
                <span className="font-bold text-slate-800">
                  {provider.licenseNumber || 'N/A'} ({provider.licenseState})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">License Expiration</span>
                <span className="font-semibold text-slate-800">
                  {provider.licenseExpiration || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Taxonomy Code</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {provider.taxonomy || 'Standard Behavioral'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Clinical Specialty</span>
                <span className="text-slate-700 font-medium">
                  {provider.specialty || 'Pediatric Early Intervention'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Email Address</span>
                <span className="text-slate-700">{provider.email || 'N/A'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Phone Number</span>
                <span className="text-slate-700">{provider.phone || 'N/A'}</span>
              </div>

              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Contact Address</span>
                <span className="text-slate-600 text-[11px]">
                  {provider.contactAddress || 'Corporate Headquarters'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Employment & Group Affiliation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-900 text-xs flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-sky-600" />
                <span>2. Employment & Group Information</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {provider.employmentStatus || 'Full-Time'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Primary Entity</span>
                <span className="font-bold text-slate-800">
                  {primaryEntity?.name || 'AGES Learning Solutions'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">DBA Name</span>
                <span className="font-semibold text-slate-700">
                  {provider.dba || primaryEntity?.dba || 'AGES Group'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Contract Classification</span>
                <span className="font-semibold text-slate-800">
                  {provider.contractStatus || 'W-2 Full-Time'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Start Date</span>
                <span className="font-semibold text-slate-800">
                  {provider.startDate || 'Current'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Group Affiliation</span>
                <span className="text-slate-700">
                  {provider.groupAffiliation || 'Participating Clinic Group'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Rendering Clinician Notes</span>
                <span className="text-slate-600 text-[11px]">
                  {provider.renderingProviderInfo || 'Individual Rendering Clinician under Group NPI'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Practice Locations & Modalities */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-900 text-xs flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>3. Practice Locations & Modalities</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                {provider.serviceTypes?.length || 1} Modalities
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Primary Location</span>
                <span className="font-bold text-slate-800">
                  {primaryLoc?.name || 'San Jose Clinic'} ({primaryLoc?.address}, {primaryLoc?.city})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] mb-1">Service Delivery Modalities</span>
                <div className="flex flex-wrap gap-1.5">
                  {(provider.serviceTypes && provider.serviceTypes.length > 0
                    ? provider.serviceTypes
                    : ['In-Clinic', 'In-Home', 'Telehealth']
                  ).map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Location Effective Date</span>
                <span className="text-slate-700">{provider.locationEffectiveDate || 'Current'}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Credentialing & Registry Identifiers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-900 text-xs flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>4. Credentialing & Registry Status</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {provider.caqhStatus || 'Attested'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">CAQH ProView ID</span>
                <span className="font-mono font-bold text-slate-800">
                  {provider.caqhId || 'Pending'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">CAQH Status</span>
                <span className="font-bold text-slate-800">{provider.caqhStatus || 'Attested'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Last Attestation</span>
                <span className="text-slate-700">{provider.lastAttestationDate || 'Recent'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Next Attestation Due</span>
                <span className="font-semibold text-amber-700">
                  {provider.nextAttestationDate || 'In 120 Days'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">PAVE Medicaid Status</span>
                <span className="font-bold text-slate-800">{provider.paveStatus || 'Submitted'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Medicaid ID</span>
                <span className="font-mono text-slate-700">{provider.medicaidId || 'PENDING'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: COMMENTS & STATUS LOGS */}
      {activeReviewTab === 'comments' && (
        <ClinicalStaffComments provider={provider} />
      )}

      {/* SUBTAB 3: DOCUMENT LINKS TABLE */}
      {activeReviewTab === 'documents' && (
        <ClinicalStaffDocuments provider={provider} />
      )}
    </div>
  );
};
