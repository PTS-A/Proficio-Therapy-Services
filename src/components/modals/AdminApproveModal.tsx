import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Calendar,
  Building2,
  UserCheck,
  AlertTriangle,
  X,
  Layers,
  Sparkles,
  Link2,
  Lock
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { CredentialingRecord } from '../../types';

interface AdminApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: CredentialingRecord | null;
  recordsToApprove?: CredentialingRecord[];
  onSuccess?: () => void;
}

export const AdminApproveModal: React.FC<AdminApproveModalProps> = ({
  isOpen,
  onClose,
  record,
  recordsToApprove,
  onSuccess,
}) => {
  const {
    adminVerifyAndApproveApplication,
    adminBatchApproveApplications,
    providers,
    payers,
    entities,
    locations,
    currentUser,
    isAdmin,
  } = useCredentialing();

  const todayStr = new Date().toISOString().split('T')[0];

  const targetRecords = recordsToApprove && recordsToApprove.length > 0
    ? recordsToApprove
    : record ? [record] : [];

  const isBatch = targetRecords.length > 1;

  const [approvalDate, setApprovalDate] = useState<string>(todayStr);
  const [effectiveDate, setEffectiveDate] = useState<string>(todayStr);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [autoVerifyDocs, setAutoVerifyDocs] = useState<boolean>(true);
  const [autoCompleteChecklist, setAutoCompleteChecklist] = useState<boolean>(true);
  const [autoLink, setAutoLink] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || targetRecords.length === 0) return null;

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (isBatch) {
        const ids = targetRecords.map((r) => r.id);
        const res = adminBatchApproveApplications(ids, {
          approvalDate,
          effectiveDate,
          notes: notes.trim() || undefined,
          autoLink,
        });

        if (res.errors.length > 0 && res.successCount === 0) {
          setErrorMsg(`Failed to approve applications: ${res.errors.join(', ')}`);
          setIsSubmitting(false);
          return;
        }

        setSuccessMsg(`Successfully verified and approved ${res.successCount} application(s)!`);
        setTimeout(() => {
          setIsSubmitting(false);
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      } else {
        const targetId = targetRecords[0].id;
        const res = adminVerifyAndApproveApplication(targetId, {
          approvalDate,
          effectiveDate,
          referenceNumber: referenceNumber.trim() || undefined,
          notes: notes.trim() || undefined,
          autoLink,
        });

        if (!res.success) {
          setErrorMsg(res.error || 'Failed to verify and approve application.');
          setIsSubmitting(false);
          return;
        }

        setSuccessMsg(`Application ${targetId} verified and approved successfully!`);
        setTimeout(() => {
          setIsSubmitting(false);
          if (onSuccess) onSuccess();
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during admin approval.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B365D] via-[#2B4C9D] to-[#3B6FD8] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  Admin Authority Sign-Off
                </span>
                <span className="text-xs text-white/70">
                  By {currentUser.name} ({currentUser.role || 'Admin'})
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                {isBatch
                  ? `Verify & Approve ${targetRecords.length} Pending Applications`
                  : `Verify & Approve Application: ${targetRecords[0].id}`}
              </h2>
            </div>
          </div>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleApprove} className="p-6 space-y-5 text-xs text-slate-700">
          {/* Target Summary Cards */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5 text-xs">
                <Layers className="w-4 h-4 text-[#2B4C9D]" />
                <span>Target Application{targetRecords.length > 1 ? 's' : ''} ({targetRecords.length})</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Ready for Verification
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {targetRecords.map((rec) => {
                const prov = providers.find((p) => p.id === rec.providerId);
                const pyr = payers.find((p) => p.id === rec.payerId);
                const ent = entities.find((e) => e.id === rec.entityId);
                const loc = locations.find((l) => l.id === rec.locationId);

                return (
                  <div
                    key={rec.id}
                    className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#2B4C9D]">{rec.id}</span>
                        <span className="font-semibold text-slate-900">
                          {prov ? `${prov.firstName} ${prov.lastName}` : 'Staff Member'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">NPI: {prov?.npi}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            rec.discipline === 'ABA'
                              ? 'bg-sky-100 text-sky-800'
                              : rec.discipline === 'Speech'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {rec.discipline}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                        <span>Payer: <strong className="text-slate-700">{pyr?.name}</strong></span>
                        <span>•</span>
                        <span>Entity: <strong className="text-slate-700">{ent?.dba || ent?.legalName}</strong></span>
                        <span>•</span>
                        <span>Location: <strong className="text-slate-700">{loc?.name || 'Primary'}</strong></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[10.5px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        Current: {rec.stage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Payer Approval Date <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                value={approvalDate}
                onChange={(e) => setApprovalDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#2B4C9D] focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Date officially approved by the payer</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Billing Effective Date <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#2B4C9D] focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Date when claims can be billed in-network</p>
            </div>
          </div>

          {!isBatch && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payer Approval / Contract Reference # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. BCBS-APPR-2026-88192 or CAQH-CONF-001"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#2B4C9D] focus:outline-none font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Verification Notes & Justification (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Payer approval letter verified in portal. All primary source documents validated."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#2B4C9D] focus:outline-none resize-none"
            />
          </div>

          {/* Automated Admin Actions */}
          <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-3.5 space-y-2.5">
            <h4 className="text-xs font-bold text-sky-900 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Automated Verification Enforcements</span>
            </h4>

            <div className="space-y-2 pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoVerifyDocs}
                  onChange={(e) => setAutoVerifyDocs(e.target.checked)}
                  className="rounded text-[#2B4C9D] focus:ring-[#2B4C9D] h-4 w-4"
                />
                <span className="text-xs text-slate-700">
                  <strong>Auto-Verify Attached Documents:</strong> Mark all pending certificates, licenses, and attestation forms as officially verified.
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoCompleteChecklist}
                  onChange={(e) => setAutoCompleteChecklist(e.target.checked)}
                  className="rounded text-[#2B4C9D] focus:ring-[#2B4C9D] h-4 w-4"
                />
                <span className="text-xs text-slate-700">
                  <strong>Complete Checklist Requirements:</strong> Sign off on all payer credentialing checklist items.
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoLink}
                  onChange={(e) => setAutoLink(e.target.checked)}
                  className="rounded text-[#2B4C9D] focus:ring-[#2B4C9D] h-4 w-4"
                />
                <span className="text-xs text-slate-700">
                  <strong>Activate Staff Linking & In-Network Status:</strong> Advance application directly to <strong className="text-emerald-700 font-bold">Linked / Effective</strong> and update clinical staff directory enrollments.
                </span>
              </label>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Action logged in immutable audit trail</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Verifying & Approving...'
                    : isBatch
                    ? `Verify & Approve ${targetRecords.length} Applications`
                    : 'Verify & Approve Application'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
