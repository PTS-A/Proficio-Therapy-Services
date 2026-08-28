import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  CredentialingStage, 
  DocumentItem, 
  FollowUpEntry, 
  LinkingStatus 
} from '../../types';
import { 
  AlertCircle, 
  AlertTriangle, 
  ArrowRight, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Eye, 
  FileCheck, 
  FilePlus, 
  FileText, 
  History, 
  Link2, 
  MessageSquare, 
  Phone, 
  Plus, 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  UserCheck, 
  Users, 
  X,
  CheckSquare
} from 'lucide-react';
import { addBusinessDays } from '../../utils/slaCalculator';
import { AdminApproveModal } from '../modals/AdminApproveModal';

interface RecordDetailModalProps {
  recordId: string;
  onClose: () => void;
  onSelectProvider: (providerId: string) => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  recordId,
  onClose,
  onSelectProvider,
}) => {
  const {
    records,
    providers,
    payers,
    entities,
    locations,
    currentUser,
    isAdmin,
    stageConfigs,
    advanceRecordStage,
    logFollowUp,
    addDocumentToRecord,
    toggleChecklistItem,
    overrideValidation,
    updateProviderLinking,
    updateRecord,
    adminVerifyDocument,
    adminVerifyAllDocuments,
    adminCompleteAllChecklist,
  } = useCredentialing();

  const record = records.find((r) => r.id === recordId);
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'followups' | 'documents' | 'linking' | 'audit'>('overview');
  const [isAdminApproveModalOpen, setIsAdminApproveModalOpen] = useState(false);

  // Stage advance state
  const [targetStage, setTargetStage] = useState<CredentialingStage | ''>('');
  const [overrideReason, setOverrideReason] = useState('');
  const [transitionError, setTransitionError] = useState<string | null>(null);

  // New Follow-up State
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [followUpMethod, setFollowUpMethod] = useState<'Portal' | 'Phone' | 'Email' | 'Mail' | 'Availity'>('Portal');
  const [contactPerson, setContactPerson] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [payerResponse, setPayerResponse] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(addBusinessDays(new Date().toISOString().split('T')[0], 7));
  const [isEscalated, setIsEscalated] = useState(false);

  // New Document Upload State
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentItem['type']>('Payer-Specific Application');
  const [docExpiry, setDocExpiry] = useState('');

  // Linking State
  const [newLinkingStatus, setNewLinkingStatus] = useState<LinkingStatus>(record?.linkingStatus || 'Pending Approval');
  const [linkEffectiveDate, setLinkEffectiveDate] = useState(record?.linkEffectiveDate || '');

  // Override State
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [customOverrideNote, setCustomOverrideNote] = useState('');

  if (!record) return null;

  const provider = providers.find((p) => p.id === record.providerId);
  const payer = payers.find((p) => p.id === record.payerId);
  const entity = entities.find((e) => e.id === record.entityId);
  const location = locations.find((l) => l.id === record.locationId);

  const STAGES_SEQUENCE: CredentialingStage[] = [
    'Intake',
    'Documents Complete',
    'Application Submitted',
    'Payer Review',
    'Approved',
    'Linking Pending',
    'Linked',
    'Effective',
  ];

  const handleStageTransition = (stage: CredentialingStage) => {
    setTransitionError(null);
    const res = advanceRecordStage(record.id, stage, overrideReason || undefined);
    if (!res.success) {
      setTransitionError(res.error || 'Failed to advance stage');
    } else {
      setTargetStage('');
      setOverrideReason('');
    }
  };

  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerResponse.trim() || !contactPerson.trim()) return;

    logFollowUp(record.id, {
      date: followUpDate,
      nextFollowUpDate,
      method: followUpMethod,
      contactPerson,
      referenceNumber,
      payerResponse,
      nextAction,
      isEscalated,
      escalatedTo: isEscalated ? 'Credentialing Manager & Leadership' : undefined,
    });

    setPayerResponse('');
    setContactPerson('');
    setReferenceNumber('');
    setNextAction('');
    setIsEscalated(false);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addDocumentToRecord(record.id, {
      name: docName,
      type: docType,
      fileName: `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.2 MB',
      expirationDate: docExpiry || undefined,
      verificationStatus: 'Verified',
      verifiedBy: currentUser.name,
      verifiedDate: new Date().toISOString().split('T')[0],
      providerId: provider?.id,
      payerId: payer?.id,
      entityId: entity?.id,
      locationId: location?.id,
    });

    setDocName('');
    setDocExpiry('');
  };

  const errorIssues = record.validationIssues.filter((i) => i.severity === 'Error');
  const warningIssues = record.validationIssues.filter((i) => i.severity === 'Warning');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-600/30 text-sky-400 border border-sky-500/30">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700/50">
                  {record.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    record.discipline === 'ABA'
                      ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                      : record.discipline === 'Speech'
                      ? 'bg-teal-400/20 text-teal-300 border border-teal-400/40'
                      : 'bg-purple-400/20 text-purple-300 border border-purple-400/40'
                  }`}
                >
                  {record.discipline}
                </span>
                <span className="text-slate-400 text-xs">• {record.applicationType}</span>
              </div>

              <h2 className="text-lg font-black text-white mt-1 flex items-center space-x-2">
                <span>{provider?.firstName} {provider?.lastName}, {provider?.credentials}</span>
                <span className="text-slate-400 font-normal text-sm">→ {payer?.name}</span>
              </h2>

              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                <span>Entity: <strong>{entity?.dba || entity?.legalName}</strong></span>
                <span>•</span>
                <span>Location: <strong>{location?.name}</strong></span>
                <span>•</span>
                <span>Specialist: <strong>{record.assignedSpecialistName}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Timeline Stepper Strip */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 min-w-max">
              {STAGES_SEQUENCE.map((st, idx) => {
                const isCurrent = record.stage === st;
                const isPassed = STAGES_SEQUENCE.indexOf(record.stage as any) > idx;

                return (
                  <div key={st} className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleStageTransition(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-sky-600 text-white shadow-xs'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3 text-emerald-700" /> : <span className="text-[10px]">{idx + 1}</span>}
                      <span>{st}</span>
                    </button>
                    {idx < STAGES_SEQUENCE.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Stage Transition Dropdown for all 18 Standardized Stages */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Stage:</span>
              <select
                value={record.stage}
                onChange={(e) => handleStageTransition(e.target.value as CredentialingStage)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-800 focus:ring-1 focus:ring-sky-500 cursor-pointer shadow-2xs"
              >
                {['Pre-Submission', 'In-Review', 'Approval & Linking', 'Completed / Closed', 'Maintenance / Alert'].map((category) => {
                  const categoryStages = (stageConfigs || []).filter((s) => s.category === category && s.isActive);
                  if (categoryStages.length === 0) return null;
                  return (
                    <optgroup key={category} label={category}>
                      {categoryStages.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>
          </div>

          {transitionError && (
            <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>Stage Transition Gated:</strong> {transitionError}
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Validation', icon: ShieldCheck },
            { id: 'checklist', label: 'Payer Checklist', icon: CheckCircle2, count: (record.checklist || []).length },
            { id: 'followups', label: 'Follow-ups & SLA', icon: Clock, count: (record.followUps || []).length },
            { id: 'linking', label: 'Provider Linking', icon: Link2 },
            { id: 'documents', label: 'Document Vault', icon: FileText, count: (record.documents || []).length },
            { id: 'audit', label: 'Audit Trail', icon: History, count: (record.auditTrail || []).length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-sky-600 text-sky-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
          {/* TAB 1: OVERVIEW & ENTITY/DBA VALIDATION */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* ADMIN VERIFICATION & APPROVAL FAST-TRACK STATION */}
              {isAdmin && (
                <div className={`p-4 rounded-2xl border transition-all ${
                  ['Approved', 'Linked', 'Effective'].includes(record.stage)
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-xs'
                    : 'bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 border-indigo-200 shadow-xs'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-xl shadow-xs ${
                        ['Approved', 'Linked', 'Effective'].includes(record.stage)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2B4C9D] text-white'
                      }`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-200">
                            Administrator Authority
                          </span>
                          <span className="text-xs text-slate-600">
                            Reviewing as <strong>{currentUser.name}</strong>
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {['Approved', 'Linked', 'Effective'].includes(record.stage)
                            ? `Application Officially Verified & Approved`
                            : `Admin Fast-Track: Verify & Approve Application`}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {['Approved', 'Linked', 'Effective'].includes(record.stage)
                            ? `Payer approval recorded on ${record.approvalDate || 'N/A'}. Billing effective date: ${record.effectiveDate || 'Active'}. Linking status: ${record.linkingStatus}.`
                            : `One-click administrative verification: sign off on attached credentials, satisfy checklist gates, and grant formal payer approval.`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
                      {!['Approved', 'Linked', 'Effective'].includes(record.stage) ? (
                        <button
                          onClick={() => setIsAdminApproveModalOpen(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Approve Application</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsAdminApproveModalOpen(true)}
                          className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 border border-slate-200 transition-colors cursor-pointer"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Re-verify / Update Sign-Off</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5.10 ENTITY / DBA VALIDATION WIDGET */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Entity & DBA Pre-Submission Validation Check
                      </h3>
                      <p className="text-xs text-slate-500">
                        Automated verification of Legal Entity, DBA, W-9, Insurance, Lease, and NPI
                      </p>
                    </div>
                  </div>

                  {record.validationIssues.length === 0 ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>100% Validated</span>
                    </span>
                  ) : errorIssues.length > 0 ? (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errorIssues.length} Critical Issue(s)</span>
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{warningIssues.length} Warning(s)</span>
                    </span>
                  )}
                </div>

                {/* Validation Issues Listing */}
                {(record.validationIssues || []).length > 0 ? (
                  <div className="mt-4 space-y-2.5">
                    {(record.validationIssues || []).map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-3 rounded-xl border flex items-start space-x-3 ${
                          issue.severity === 'Error'
                            ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                            : 'bg-amber-50/80 border-amber-200 text-amber-900'
                        }`}
                      >
                        {issue.severity === 'Error' ? (
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{issue.field}</span>
                            <span className="text-[10px] uppercase font-bold opacity-75">{issue.ruleReference}</span>
                          </div>
                          <p className="mt-1 leading-relaxed">{issue.description}</p>
                        </div>
                      </div>
                    ))}

                    {/* Administrative Override Box (FR-016) */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      {record.validationOverridden ? (
                        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                          <div className="font-bold flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Administrative Override Active</span>
                          </div>
                          <p className="mt-1 text-indigo-700">
                            Approved by: <strong>{record.validationOverridden.overriddenBy}</strong> on {record.validationOverridden.date}
                          </p>
                          <p className="mt-0.5 italic">"{record.validationOverridden.reason}"</p>
                        </div>
                      ) : (
                        <div>
                          {!showOverrideInput ? (
                            <button
                              onClick={() => setShowOverrideInput(true)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
                            >
                              + Override Validation Warnings with Justification (Manager / Admin)
                            </button>
                          ) : (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                              <label className="font-bold text-slate-800">
                                Override Justification (Stored in permanent audit trail):
                              </label>
                              <textarea
                                value={customOverrideNote}
                                onChange={(e) => setCustomOverrideNote(e.target.value)}
                                placeholder="State reason for proceeding despite validation warnings (e.g. Landlord sublease amendment pending in parallel)..."
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                                rows={2}
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setShowOverrideInput(false)}
                                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    if (customOverrideNote.trim()) {
                                      overrideValidation(record.id, customOverrideNote.trim());
                                      setShowOverrideInput(false);
                                    }
                                  }}
                                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded"
                                >
                                  Confirm Override
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">All Entity, Location & License Validations Passed</div>
                      <p className="text-emerald-700 mt-0.5">
                        Legal Entity name, DBA, W-9, Insurance policies, and NPI format match payer submission requirements.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Details & Dates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Application Information */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Application Parameters
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400">Application Type</span>
                      <div className="font-bold text-slate-800 mt-0.5">{record.applicationType}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Current Stage</span>
                      <div className="font-bold text-sky-700 mt-0.5">{record.stage}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Legal Entity</span>
                      <div className="font-semibold text-slate-800 mt-0.5">{entity?.legalName}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">DBA</span>
                      <div className="font-semibold text-slate-800 mt-0.5">{entity?.dba}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Service Location</span>
                      <div className="font-semibold text-slate-800 mt-0.5">{location?.name}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Payer Submission Method</span>
                      <div className="font-semibold text-slate-800 mt-0.5">{payer?.submissionMethod}</div>
                    </div>
                  </div>
                </div>

                {/* Dates Tracking (FR-006) */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Key Credentialing Milestones
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400">Intake Date</span>
                      <div className="font-bold text-slate-800 mt-0.5">{record.intakeDate}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Submitted Date</span>
                      <div className="font-semibold text-slate-800 mt-0.5">{record.submissionDate || 'Pending Submission'}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Payer Approval Date</span>
                      <div className="font-semibold text-emerald-600 mt-0.5">{record.approvalDate || 'Pending Approval'}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Effective Date (Separate)</span>
                      <div className="font-bold text-emerald-700 mt-0.5">{record.effectiveDate || 'Pending'}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Next Follow-up Due</span>
                      <div className={`font-bold mt-0.5 ${record.isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                        {record.nextFollowUpDate || 'None'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Target TAT Date</span>
                      <div className="font-semibold text-slate-800 mt-0.5">{record.targetTurnaroundDate || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYER CHECKLIST (FR-009) */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Payer-Specific Requirements Checklist ({payer?.name})
                    </h3>
                    <p className="text-xs text-slate-500">
                      All required items must be completed before submission to prevent rejections.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-lg">
                      {(record.checklist || []).filter((c) => c.isCompleted).length} / {(record.checklist || []).length} Completed
                    </span>
                    {isAdmin && (record.checklist || []).some(c => !c.isCompleted) && (
                      <button
                        onClick={() => adminCompleteAllChecklist(record.id)}
                        className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                        title="Mark all items as verified and completed"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Complete All (Admin)</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-slate-100 mt-3">
                  {(record.checklist || []).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(record.id, item.id)}
                      className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={item.isCompleted}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <div>
                          <div className={`text-xs font-semibold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.title}
                          </div>
                          {item.notes && <div className="text-[11px] text-amber-600 mt-0.5">{item.notes}</div>}
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400">
                        {item.isCompleted && (
                          <span>Completed by {item.completedBy || 'Specialist'} on {item.completedDate}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FOLLOW-UPS & SLA ESCALATIONS (FR-017, FR-018, FR-019) */}
          {activeTab === 'followups' && (
            <div className="space-y-6">
              {/* Follow-up Logging Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Log Payer Follow-Up Touchpoint</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Standard cadence is 7–10 business days. Escalations trigger notifications to Manager and Leadership.
                </p>

                <form onSubmit={handleSaveFollowUp} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Follow-up Date</label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Method</label>
                      <select
                        value={followUpMethod}
                        onChange={(e) => setFollowUpMethod(e.target.value as any)}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Portal">Online Portal</option>
                        <option value="Availity">Availity Portal</option>
                        <option value="Phone">Phone Call</option>
                        <option value="Email">Email Communication</option>
                        <option value="Mail">Certified Mail</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Contact Person / Dept</label>
                      <input
                        type="text"
                        placeholder="e.g. Tanya Gomez / Provider Relations"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Reference / Ticket #</label>
                      <input
                        type="text"
                        placeholder="e.g. REF-2026-88192"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">Next Follow-up Date (SLA Target)</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="date"
                          value={nextFollowUpDate}
                          onChange={(e) => setNextFollowUpDate(e.target.value)}
                          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setNextFollowUpDate(addBusinessDays(followUpDate, 7))}
                          className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold whitespace-nowrap"
                        >
                          +7 Biz Days
                        </button>
                        <button
                          type="button"
                          onClick={() => setNextFollowUpDate(addBusinessDays(followUpDate, 10))}
                          className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold whitespace-nowrap"
                        >
                          +10 Biz Days
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Payer Response & Current Status</label>
                    <textarea
                      placeholder="e.g. Application is with credentialing committee; expected approval by month end."
                      value={payerResponse}
                      onChange={(e) => setPayerResponse(e.target.value)}
                      rows={2}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Next Action to Take</label>
                    <input
                      type="text"
                      placeholder="e.g. Re-verify committee approval status on Availity"
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-rose-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEscalated}
                        onChange={(e) => setIsEscalated(e.target.checked)}
                        className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Flag as Escalation (Trigger Manager & Leadership Alert)</span>
                    </label>

                    <button
                      type="submit"
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Log Follow-up</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Follow-up History Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Follow-up History & Activity Log ({(record.followUps || []).length})
                </h3>

                <div className="space-y-3">
                  {(record.followUps || []).length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No follow-ups logged yet. Record first interaction above.
                    </div>
                  ) : (
                    (record.followUps || []).map((fu) => (
                      <div
                        key={fu.id}
                        className={`p-3.5 rounded-xl border text-xs ${
                          fu.isEscalated ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{fu.date}</span>
                            <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-semibold">
                              {fu.method}
                            </span>
                            {fu.referenceNumber && (
                              <span className="font-mono text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                                Ref: {fu.referenceNumber}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">{fu.specialistName}</span>
                        </div>

                        <p className="text-slate-800 mt-2 font-medium">"{fu.payerResponse}"</p>

                        {fu.nextAction && (
                          <div className="mt-1.5 text-slate-600">
                            <strong>Next Action:</strong> {fu.nextAction} (Due: <strong>{fu.nextFollowUpDate}</strong>)
                          </div>
                        )}

                        {fu.isEscalated && (
                          <div className="mt-2 text-rose-700 font-bold text-[11px] flex items-center space-x-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Escalated to: {fu.escalatedTo}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROVIDER LINKING (FR-014) & CONTRACTING (FR-030) */}
          {activeTab === 'linking' && (
            <div className="space-y-6">
              {/* Provider Linking Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                  <Link2 className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Provider-to-Group Linking Management
                    </h3>
                    <p className="text-xs text-slate-500">
                      Linking connects credentialed providers to billing group NPIs and locations inside payer systems.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">Linking Status</label>
                    <select
                      value={newLinkingStatus}
                      onChange={(e) => setNewLinkingStatus(e.target.value as any)}
                      className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="Not Applicable">Not Applicable</option>
                      <option value="Pending Approval">Pending Approval / Queue</option>
                      <option value="Linking In Progress">Linking In Progress</option>
                      <option value="Linked">Linked (Ready for Claims Billing)</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Link Effective Date</label>
                    <input
                      type="date"
                      value={linkEffectiveDate}
                      onChange={(e) => setLinkEffectiveDate(e.target.value)}
                      className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      updateProviderLinking(record.id, newLinkingStatus, linkEffectiveDate);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Update Linking Status</span>
                  </button>
                </div>
              </div>

              {/* Contracting Tracker */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Payer Contracting Tracking (Distinct from Credentialing)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tracks overarching payer agreement status and contract execution terms.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Contract Status</span>
                    <div className="font-bold text-slate-900 mt-1">{record.contractStatus}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Contract Effective Date</span>
                    <div className="font-bold text-emerald-600 mt-1">{record.contractEffectiveDate || 'Active Master Agreement'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENT VAULT (FR-015) */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Document Upload Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-sky-600" />
                  <span>Upload & Attach Credentialing Document</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Licenses, Malpractice COI, W-9, PAVE Proof, and Payer Application Forms.
                </p>

                <form onSubmit={handleAddDocument} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 2026 COI Certificate"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="State License">State License</option>
                      <option value="Malpractice Insurance / COI">Malpractice Insurance / COI</option>
                      <option value="W-9 Form">W-9 Form</option>
                      <option value="Curriculum Vitae (CV)">Curriculum Vitae (CV)</option>
                      <option value="Board Certification">Board Certification</option>
                      <option value="Lease / Sublease Agreement">Lease / Sublease Agreement</option>
                      <option value="Payer-Specific Application">Payer-Specific Application</option>
                      <option value="Approval Letter">Approval Letter</option>
                      <option value="PAVE Proof">PAVE Proof</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Expiration Date (if applicable)</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="date"
                        value={docExpiry}
                        onChange={(e) => setDocExpiry(e.target.value)}
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        type="submit"
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs whitespace-nowrap cursor-pointer"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Document List */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Attached Documents ({(record.documents || []).length + (provider?.documents?.length || 0)})
                  </h3>
                  {isAdmin && (record.documents || []).some(d => d.verificationStatus !== 'Verified') && (
                    <button
                      onClick={() => adminVerifyAllDocuments(record.id)}
                      className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                      title="Verify all pending documents"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verify All Documents (Admin)</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100">
                  {[...(record.documents || []), ...(provider?.documents || [])].map((doc) => (
                    <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-sky-50 text-sky-600 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{doc.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {doc.type} • {doc.fileSize} • Uploaded {doc.uploadDate}
                            {doc.verifiedBy && ` • Verified by ${doc.verifiedBy}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {doc.expirationDate && (
                          <span className="text-[11px] font-semibold text-slate-600 mr-1">
                            Exp: {doc.expirationDate}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            doc.verificationStatus === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : doc.verificationStatus === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {doc.verificationStatus}
                        </span>

                        {isAdmin && (
                          <div className="flex items-center space-x-1 ml-2">
                            {doc.verificationStatus !== 'Verified' && (
                              <button
                                onClick={() => adminVerifyDocument(record.id, doc.id, 'Verified')}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold rounded cursor-pointer transition-colors"
                                title="Mark Verified"
                              >
                                Verify
                              </button>
                            )}
                            {doc.verificationStatus !== 'Rejected' && (
                              <button
                                onClick={() => adminVerifyDocument(record.id, doc.id, 'Rejected')}
                                className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10.5px] font-medium rounded border border-rose-200 cursor-pointer transition-colors"
                                title="Reject Document"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT TRAIL (FR-025) */}
          {activeTab === 'audit' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Immutable Credentialing Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">
                    Retained for ≥ 7 years per regulatory and HIPAA compliance requirements.
                  </p>
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {(record.auditTrail || []).length} Entries
                </span>
              </div>

              <div className="space-y-3">
                {(record.auditTrail || []).map((entry) => (
                  <div key={entry.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono">{entry.timestamp}</span>
                      <span className="font-bold text-slate-700">{entry.userName}</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{entry.action}</div>
                    {entry.notes && <p className="text-slate-600 mt-0.5">{entry.notes}</p>}
                    {entry.previousValue && entry.newValue && (
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                        <span>{entry.previousValue}</span>
                        <ArrowRight className="w-3 h-3 inline" />
                        <span className="font-semibold text-slate-800">{entry.newValue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => onSelectProvider(provider!.id)}
            className="text-sky-700 hover:text-sky-900 font-bold flex items-center space-x-1"
          >
            <UserCheck className="w-4 h-4" />
            <span>Open Provider 360 Profile ({provider?.firstName} {provider?.lastName})</span>
          </button>

          <div className="flex items-center space-x-2">
            {isAdmin && !['Approved', 'Linked', 'Effective'].includes(record.stage) && (
              <button
                onClick={() => setIsAdminApproveModalOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Approve</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
            >
              Close Workspace
            </button>
          </div>
        </div>
      </div>

      {/* Admin Approval Modal */}
      {isAdminApproveModalOpen && (
        <AdminApproveModal
          isOpen={isAdminApproveModalOpen}
          onClose={() => setIsAdminApproveModalOpen(false)}
          record={record}
        />
      )}
    </div>
  );
};
