import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  FileText, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Send, 
  HelpCircle,
  Clock,
  Check,
  X
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Provider } from '../../types';

interface ClinicalStaffPortalProps {
  onBackToApp?: () => void;
}

export const ClinicalStaffPortal: React.FC<ClinicalStaffPortalProps> = ({ onBackToApp }) => {
  const { 
    currentAccount, 
    providers, 
    entities, 
    submitStaffChangeRequest, 
    staffChangeRequests, 
    addToast 
  } = useCredentialing();

  // Find the matching clinician profile for the logged in account
  const clinician: Provider | undefined = (providers || []).find(
    (p) => p.email?.toLowerCase().trim() === currentAccount?.email?.toLowerCase().trim()
  ) || providers[0]; // fallback for preview/testing

  const matchedEntity = entities.find(
    (e) => e.id === clinician?.primaryEntityId || e.id === 'ent-1'
  );

  // Form State
  const [phone, setPhone] = useState(clinician?.phone || '');
  const [contactAddress, setContactAddress] = useState(clinician?.contactAddress || '');
  const [npi, setNpi] = useState(clinician?.npi || '');
  const [caqhId, setCaqhId] = useState(clinician?.caqhId || '');
  const [taxonomyCode, setTaxonomyCode] = useState(clinician?.taxonomy || '');
  const [primaryLicenseNumber, setPrimaryLicenseNumber] = useState(clinician?.licenseNumber || '');
  const [primaryLicenseExpiry, setPrimaryLicenseExpiry] = useState(clinician?.licenseExpiration || '');
  
  // Utah Staff state
  const [isUtahStaff, setIsUtahStaff] = useState(
    Boolean((clinician as any)?.utahLicenseNumber || (clinician as any)?.serviceState === 'UT')
  );
  const [utahLicenseNumber, setUtahLicenseNumber] = useState((clinician as any)?.utahLicenseNumber || '');
  const [utahLicenseExpiry, setUtahLicenseExpiry] = useState((clinician as any)?.utahLicenseExpiry || '');

  // Documents links submitted to credentialing staff
  const [documentLinks, setDocumentLinks] = useState<Array<{ title: string; url: string; category?: string }>>([]);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('State License');
  const [notes, setNotes] = useState('');

  // Confirmation dialog ("Are you sure?")
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if clinician changes
  useEffect(() => {
    if (clinician) {
      setPhone(clinician.phone || '');
      setContactAddress(clinician.contactAddress || '');
      setNpi(clinician.npi || '');
      setCaqhId(clinician.caqhId || '');
      setTaxonomyCode(clinician.taxonomy || '');
      setPrimaryLicenseNumber(clinician.licenseNumber || '');
      setPrimaryLicenseExpiry(clinician.licenseExpiration || '');
      const hasUt = Boolean((clinician as any)?.utahLicenseNumber || (clinician as any)?.serviceState === 'UT');
      setIsUtahStaff(hasUt);
      setUtahLicenseNumber((clinician as any)?.utahLicenseNumber || '');
      setUtahLicenseExpiry((clinician as any)?.utahLicenseExpiry || '');
    }
  }, [clinician]);

  // Check if there is an active pending request for this clinician
  const activePendingRequest = (staffChangeRequests || []).find(
    (r) => r.employeeEmail?.toLowerCase() === currentAccount?.email?.toLowerCase() && r.status === 'PENDING'
  );

  const handleAddDocumentLink = () => {
    if (!newDocTitle.trim() || !newDocUrl.trim()) {
      addToast('Please provide both document title and a valid web link.', 'warning');
      return;
    }
    setDocumentLinks((prev) => [
      ...prev,
      { title: newDocTitle.trim(), url: newDocUrl.trim(), category: newDocCategory },
    ]);
    setNewDocTitle('');
    setNewDocUrl('');
  };

  const handleRemoveDocLink = (index: number) => {
    setDocumentLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    try {
      const changes: any = {
        phone: phone !== clinician?.phone ? phone : undefined,
        contactAddress: contactAddress !== clinician?.contactAddress ? contactAddress : undefined,
        npi: npi !== clinician?.npi ? npi : undefined,
        caqhId: caqhId !== clinician?.caqhId ? caqhId : undefined,
        taxonomy: taxonomyCode !== clinician?.taxonomy ? taxonomyCode : undefined,
        licenseNumber: primaryLicenseNumber !== clinician?.licenseNumber ? primaryLicenseNumber : undefined,
        licenseExpiration: primaryLicenseExpiry !== clinician?.licenseExpiration ? primaryLicenseExpiry : undefined,
        utahLicenseNumber: isUtahStaff ? utahLicenseNumber : undefined,
        utahLicenseExpiry: isUtahStaff ? utahLicenseExpiry : undefined,
        documentLinks: documentLinks.length > 0 ? documentLinks : undefined,
        notes: notes.trim() || undefined,
      };

      const previousValues: Record<string, any> = {
        phone: clinician?.phone || '',
        contactAddress: clinician?.contactAddress || '',
        npi: clinician?.npi || '',
        caqhId: clinician?.caqhId || '',
        taxonomy: clinician?.taxonomy || '',
        licenseNumber: clinician?.licenseNumber || '',
        licenseExpiration: clinician?.licenseExpiration || '',
        utahLicenseNumber: (clinician as any)?.utahLicenseNumber || '',
        utahLicenseExpiry: (clinician as any)?.utahLicenseExpiry || '',
      };

      const res = await submitStaffChangeRequest({
        providerId: clinician?.id || '',
        employeeEmail: currentAccount?.email || '',
        employeeName: currentAccount?.name || `${clinician?.firstName} ${clinician?.lastName}`,
        entityId: clinician?.primaryEntityId || 'ent-1',
        changes,
        previousValues,
      });

      if (res.success) {
        setShowConfirmModal(false);
        setDocumentLinks([]);
        setNotes('');
        addToast('Your profile changes and documents have been submitted to Credentialing Specialists & System Admins for review!', 'success');
      } else {
        addToast(res.error || 'Failed to submit request', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl text-white shrink-0">
              {currentAccount?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold">{currentAccount?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white">
                  Clinical Staff
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                {currentAccount?.email} &bull; {matchedEntity?.legalName || 'AGES Learning Solutions'}
              </p>
            </div>
          </div>

          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer self-start sm:self-auto border border-white/20"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Pending status notification banner */}
      {activePendingRequest && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Pending Change Request Under Review</p>
            <p className="text-amber-700 mt-0.5">
              You submitted profile updates on {new Date(activePendingRequest.requestedAt).toLocaleDateString()}. The Credentialing Specialist and System Admin team are reviewing your submission. You can still submit additional updates or documents below.
            </p>
          </div>
        </div>
      )}

      {/* Main Profile Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Clinical Staff Profile &amp; Credentialing Information
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            As a Clinical Staff member, core identity fields are locked for security. You can update your IDs, state license numbers, contact details, and upload document links for credentialing review.
          </p>
        </div>

        {/* SECTION 1: LOCKED FIELDS */}
        <div className="space-y-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Locked Profile Fields (Managed by Credentialing Administration)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Clinician Full Name</span>
              <div className="flex items-center justify-between mt-1 text-slate-700 font-semibold">
                <span>{clinician?.firstName} {clinician?.lastName}</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Approved Company Email</span>
              <div className="flex items-center justify-between mt-1 text-slate-700 font-semibold font-mono">
                <span>{clinician?.email || currentAccount?.email}</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Legal Healthcare Entity</span>
              <div className="flex items-center justify-between mt-1 text-slate-700 font-semibold">
                <span>{matchedEntity?.legalName}</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Clinical Discipline &amp; Provider Type</span>
              <div className="flex items-center justify-between mt-1 text-slate-700 font-semibold">
                <span>{clinician?.disciplines?.[0] || 'ABA'} &bull; {clinician?.providerType || 'BCBA'}</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: EDITABLE IDENTIFIERS & CONTACT INFO */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Editable Identifiers &amp; Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(925) 555-0199"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                National Provider Identifier (NPI)
              </label>
              <input
                type="text"
                maxLength={10}
                value={npi}
                onChange={(e) => setNpi(e.target.value)}
                placeholder="10-digit NPI number"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CAQH Provider ID
              </label>
              <input
                type="text"
                value={caqhId}
                onChange={(e) => setCaqhId(e.target.value)}
                placeholder="CAQH ID number"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Taxonomy Code
              </label>
              <input
                type="text"
                value={taxonomyCode}
                onChange={(e) => setTaxonomyCode(e.target.value)}
                placeholder="e.g. 103K00000X"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mailing / Contact Address
              </label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="Street address, City, State, Zip"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: LICENSURE (PRIMARY & UTAH LICENSE) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            State Licensure &amp; Certifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary State License Number
              </label>
              <input
                type="text"
                value={primaryLicenseNumber}
                onChange={(e) => setPrimaryLicenseNumber(e.target.value)}
                placeholder="e.g. 1-22-67890"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary License Expiration Date
              </label>
              <input
                type="date"
                value={primaryLicenseExpiry}
                onChange={(e) => setPrimaryLicenseExpiry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
              />
            </div>
          </div>

          {/* Utah Employee Checkbox & Utah License Fields */}
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200/80 space-y-3">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isUtahStaff}
                onChange={(e) => setIsUtahStaff(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
              />
              <span className="text-xs font-bold text-purple-950">
                Are you a Utah Employee / Rendering Clinician in Utah?
              </span>
            </label>

            {isUtahStaff && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-200/60">
                <div>
                  <label className="block text-xs font-semibold text-purple-900 mb-1">
                    Utah License Number
                  </label>
                  <input
                    type="text"
                    value={utahLicenseNumber}
                    onChange={(e) => setUtahLicenseNumber(e.target.value)}
                    placeholder="e.g. UT-991823-BA"
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-900 mb-1">
                    Utah License Expiration Date
                  </label>
                  <input
                    type="date"
                    value={utahLicenseExpiry}
                    onChange={(e) => setUtahLicenseExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: DOCUMENTS TO SEND TO CREDENTIALING STAFF */}
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Documents for Credentialing Staff
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Put links to documents you want to send to the credentialing staff (e.g. Google Drive, Dropbox, Box, or cloud storage link).
            </p>
          </div>

          {/* Add link form */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. 2026 Utah License Certificate"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Category
                </label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                >
                  <option value="State License">State License</option>
                  <option value="Utah State License">Utah State License</option>
                  <option value="Board Certification">Board Certification</option>
                  <option value="Malpractice Insurance / COI">Malpractice Insurance / COI</option>
                  <option value="Degree Diploma">Degree Diploma</option>
                  <option value="CV / Resume">CV / Resume</option>
                  <option value="W-9 Form">W-9 Form</option>
                  <option value="Other">Other Document</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Document Web Link (URL)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newDocUrl}
                    onChange={(e) => setNewDocUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddDocumentLink}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of document links to submit */}
            {documentLinks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600">Links Attached to this Submission:</span>
                {documentLinks.map((doc, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold shrink-0">
                        {doc.category}
                      </span>
                      <span className="font-semibold text-slate-900 truncate">{doc.title}</span>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:underline inline-flex items-center space-x-1 text-[11px] truncate shrink-0 ml-2"
                      >
                        <span>Open Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocLink(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: NOTES FOR CREDENTIALING TEAM */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Comments for Credentialing Specialist
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any context, effective date expectations, or notes for the credentialing specialist here..."
            rows={2}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
          />
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Protected by Supabase Governance &bull; Multi-Tier Review</span>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Submit Changes for Approval</span>
          </button>
        </div>
      </div>

      {/* "Are You Sure?" Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Are You Sure You Want to Submit?
                </h3>
                <p className="text-xs text-slate-500">
                  Verification &amp; Governance Check
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                Your updates will be submitted to the <strong>Credentialing Specialist</strong> and <strong>System Administrator</strong> team for formal review.
              </p>
              <p>
                Once approved, all changes and document links will automatically synchronize directly into the <strong>Supabase</strong> database and update your active credentialing profile.
              </p>
              {documentLinks.length > 0 && (
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-900 font-medium">
                  Attached Documents: <strong>{documentLinks.length} document links</strong> will be sent to credentialing staff.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Go Back &amp; Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitRequest}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Yes, Submit for Approval'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
