import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  ShieldAlert, 
  ArrowRight, 
  Building2, 
  FileText, 
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { StaffChangeRequest } from '../../types';

interface StaffApprovalsViewProps {
  onBackToOverview?: () => void;
}

export const StaffApprovalsView: React.FC<StaffApprovalsViewProps> = ({ onBackToOverview }) => {
  const { 
    staffChangeRequests, 
    reviewStaffChangeRequest, 
    entities, 
    currentAccount,
    addToast 
  } = useCredentialing();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'DENIED'>('PENDING');
  const [filterEntity, setFilterEntity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<StaffChangeRequest | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'DENY'>('APPROVE');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requests = staffChangeRequests || [];

  const filteredRequests = requests.filter((req) => {
    if (filterStatus !== 'ALL' && req.status !== filterStatus) return false;
    if (filterEntity !== 'ALL' && req.entityId !== filterEntity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.employeeName?.toLowerCase().includes(q);
      const matchEmail = req.employeeEmail?.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }
    return true;
  });

  const getEntityName = (entId: string) => {
    const ent = entities.find((e) => e.id === entId);
    return ent ? ent.legalName : entId;
  };

  const handleOpenReview = (req: StaffChangeRequest, action: 'APPROVE' | 'DENY') => {
    setSelectedRequest(req);
    setReviewAction(action);
    setReviewNotes('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      const success = await reviewStaffChangeRequest(
        selectedRequest.id,
        reviewAction,
        reviewNotes.trim() || (reviewAction === 'APPROVE' ? 'Approved by Credentialing Authority' : 'Denied by Credentialing Authority'),
        currentAccount?.name || 'Credentialing Specialist'
      );
      if (success) {
        addToast(
          reviewAction === 'APPROVE' 
            ? `Successfully approved and committed profile changes to Supabase for ${selectedRequest.employeeName}.` 
            : `Denied change request for ${selectedRequest.employeeName}.`,
          reviewAction === 'APPROVE' ? 'success' : 'info'
        );
        setReviewModalOpen(false);
        setSelectedRequest(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <span>Clinical Staff Change Approvals</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Credentialing Lead &amp; Administrator Governance: Review clinician-submitted profile changes, license updates, and documents before synchronizing to Supabase.
          </p>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{requests.filter(r => r.status === 'PENDING').length} Pending</span>
          </span>
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{requests.filter(r => r.status === 'APPROVED').length} Approved</span>
          </span>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by clinician name or email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {(['ALL', 'PENDING', 'APPROVED', 'DENIED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === st ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Entity filter */}
        <div className="min-w-[180px]">
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Entities (3)</option>
            {entities.map((e) => (
              <option key={e.id} value={e.id}>{e.dba || e.legalName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Change Requests Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {filterStatus === 'PENDING' 
                ? 'All clinical staff profile updates and document links are currently up to date.' 
                : 'No change requests match your selected filters.'}
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const hasLicenseChanges = req.changes.primaryLicenseNumber || req.changes.primaryLicenseExpiry;
            const hasUtahChanges = req.changes.utahLicenseNumber || req.changes.utahLicenseExpiry;
            const hasDocLinks = req.changes.documentLinks && req.changes.documentLinks.length > 0;
            const isPending = req.status === 'PENDING';

            return (
              <div 
                key={req.id} 
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs p-5 transition-all space-y-4"
              >
                {/* Header line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {(req.employeeName || 'C').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900">{req.employeeName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span>{req.employeeEmail}</span>
                        <span>&bull;</span>
                        <span className="flex items-center space-x-1 text-slate-600">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{getEntityName(req.entityId)}</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-400">
                    <span className="flex items-center space-x-1 sm:justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Requested: {new Date(req.requestedAt).toLocaleDateString()}</span>
                    </span>
                    {req.reviewedBy && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Reviewed by <span className="font-semibold">{req.reviewedBy}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Diff Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Phone */}
                  {req.changes.phone && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Contact Phone</span>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="line-through text-slate-400">{req.previousValues?.phone || 'None'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-slate-900">{req.changes.phone}</span>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {req.changes.contactAddress && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Mailing / Contact Address</span>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="line-through text-slate-400 truncate">{req.previousValues?.contactAddress || 'None'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900 truncate">{req.changes.contactAddress}</span>
                      </div>
                    </div>
                  )}

                  {/* NPI */}
                  {req.changes.npi && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">NPI Number</span>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="line-through text-slate-400">{req.previousValues?.npi || 'None'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold font-mono text-slate-900">{req.changes.npi}</span>
                      </div>
                    </div>
                  )}

                  {/* CAQH */}
                  {req.changes.caqhId && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">CAQH Provider ID</span>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="line-through text-slate-400">{req.previousValues?.caqhId || 'None'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold font-mono text-slate-900">{req.changes.caqhId}</span>
                      </div>
                    </div>
                  )}

                  {/* Primary License */}
                  {hasLicenseChanges && (
                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs">
                      <span className="text-indigo-900 font-semibold">Primary State License &amp; Expiry</span>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="line-through text-slate-400">{req.previousValues?.primaryLicenseNumber || 'None'}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-bold text-slate-900">{req.changes.primaryLicenseNumber || req.previousValues?.primaryLicenseNumber}</span>
                        </div>
                        {req.changes.primaryLicenseExpiry && (
                          <div className="text-[11px] text-indigo-700">
                            Expires: <span className="font-bold">{req.changes.primaryLicenseExpiry}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Utah License (for Utah employees) */}
                  {hasUtahChanges && (
                    <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-xs">
                      <span className="text-purple-900 font-semibold">Utah State License (Utah Staff)</span>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="line-through text-slate-400">{req.previousValues?.utahLicenseNumber || 'None'}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-bold text-slate-900">{req.changes.utahLicenseNumber}</span>
                        </div>
                        {req.changes.utahLicenseExpiry && (
                          <div className="text-[11px] text-purple-700">
                            Expires: <span className="font-bold">{req.changes.utahLicenseExpiry}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Document links submitted */}
                {hasDocLinks && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Documents Submitted for Credentialing Staff:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {req.changes.documentLinks!.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 flex items-center justify-between text-xs text-slate-800 group transition-colors"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                            <span className="font-medium truncate">{doc.title || `Document ${idx + 1}`}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clinician Notes */}
                {req.changes.notes && (
                  <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-900">Clinician Note: </span>
                      <span>{req.changes.notes}</span>
                    </div>
                  </div>
                )}

                {/* Review Notes (if already reviewed) */}
                {req.reviewNotes && (
                  <div className="text-xs text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-700">Review Note: </span>
                    <span>{req.reviewNotes}</span>
                  </div>
                )}

                {/* Action buttons (only for pending) */}
                {isPending && (
                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReview(req, 'DENY')}
                      className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Deny</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenReview(req, 'APPROVE')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve &amp; Commit to Supabase</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation & Review Modal */}
      {reviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                {reviewAction === 'APPROVE' ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {reviewAction === 'APPROVE' ? 'Confirm Approval & Supabase Sync' : 'Deny Change Request'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedRequest.employeeName} &bull; {selectedRequest.employeeEmail}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {reviewAction === 'APPROVE'
                ? 'Approving this request will immediately apply the changes to the provider profile and synchronize them to the Supabase database. Any submitted document links will be merged into the existing documents roster.'
                : 'Please state the reason for denying this change request so the clinical staff member can take corrective action.'}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {reviewAction === 'APPROVE' ? 'Approval Notes (Optional)' : 'Denial Reason (Required)'}
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={
                  reviewAction === 'APPROVE'
                    ? 'e.g. Verified license status against state board.'
                    : 'e.g. Missing expiration date on license document.'
                }
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setReviewModalOpen(false)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || (reviewAction === 'DENY' && !reviewNotes.trim())}
                onClick={handleSubmitReview}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 ${
                  reviewAction === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isSubmitting ? 'Processing...' : reviewAction === 'APPROVE' ? 'Confirm & Apply Changes' : 'Confirm Denial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
