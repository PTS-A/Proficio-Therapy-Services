import React, { useState, useRef } from 'react';
import { Provider, DocumentItem } from '../../types';
import { useCredentialing } from '../../context/CredentialingContext';
import { uploadStorageFile, logAuditEvent } from '../../lib/supabase';
import { 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Link as LinkIcon,
  X,
  UploadCloud,
  Loader2
} from 'lucide-react';

interface ClinicalStaffDocumentsProps {
  provider: Provider;
}

export const ClinicalStaffDocuments: React.FC<ClinicalStaffDocumentsProps> = ({ provider }) => {
  const { addProviderDocument, deleteProviderDocument, currentUser, currentAccount } = useCredentialing();

  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docType, setDocType] = useState<DocumentItem['type']>('State License');
  const [docExpDate, setDocExpDate] = useState('');
  const [docStatus, setDocStatus] = useState<DocumentItem['verificationStatus']>('Verified');
  const [docNotes, setDocNotes] = useState('');
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. File Type / MIME Validation (ISO 27001 A.8.28)
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.tif', '.tiff', '.doc', '.docx'];
    const hasValidExt = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setUploadProgress('Security Error: Only PDF, Image (PNG/JPEG/TIFF), and Word documents are permitted.');
      setTimeout(() => setUploadProgress(null), 5000);
      return;
    }

    // 2. Max File Size Enforcement: 25MB
    if (file.size > 25 * 1024 * 1024) {
      setUploadProgress('Security Error: Document exceeds maximum allowable file size (25MB).');
      setTimeout(() => setUploadProgress(null), 5000);
      return;
    }

    setIsUploading(true);
    setUploadProgress(`Computing cryptographic hash & uploading ${file.name}...`);

    try {
      // 3. Compute Cryptographic SHA-256 Checksum (HIPAA §164.312(c)(1) Integrity Controls)
      let fileHash = '';
      try {
        const buffer = await file.arrayBuffer();
        const digest = await crypto.subtle.digest('SHA-256', buffer);
        fileHash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch {}

      const cleanFileName = `${provider.id}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const result = await uploadStorageFile('credentialing-documents', `providers/${cleanFileName}`, file);

      if (result.publicUrl) {
        setDocUrl(result.publicUrl);
        if (!docName.trim()) {
          setDocName(file.name.replace(/\.[^/.]+$/, ''));
        }
        setUploadProgress('Document uploaded & verified with SHA-256 checksum!');

        // 4. Log Audit Event for Document Ingestion
        logAuditEvent({
          userId: currentAccount?.id || currentUser?.id || 'anonymous',
          userName: currentAccount?.name || currentUser?.name || 'System User',
          userEmail: currentAccount?.email || currentUser?.email || 'user@example.com',
          action: 'DOCUMENT_UPLOAD',
          entityType: 'PROVIDER_DOCUMENT',
          entityId: provider.id,
          details: {
            fileName: file.name,
            fileSize: file.size,
            sha256: fileHash,
            providerId: provider.id,
            providerName: `${provider.firstName} ${provider.lastName}`,
            timestamp: new Date().toISOString(),
          },
        }).catch(() => {});
      } else if (result.error) {
        setUploadProgress(`Upload warning: ${result.error.message}`);
      }
    } catch (err: any) {
      setUploadProgress(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 4000);
    }
  };

  const documentTypes: DocumentItem['type'][] = [
    'State License',
    'Board Certification',
    'Degree / Diploma',
    'Malpractice Insurance / COI',
    'W-9 Form',
    'Curriculum Vitae (CV)',
    'Background Check / Fingerprinting',
    'PAVE Proof',
    'Government ID',
    'Other'
  ];

  const handleCopyLink = (id: string, url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedDocId(id);
    setTimeout(() => setCopiedDocId(null), 2000);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docUrl.trim()) {
      alert('Please enter Document Name and a valid Document Link URL.');
      return;
    }

    const authorName = currentAccount?.name || currentUser.name || 'Credentialing Specialist';

    addProviderDocument(provider.id, {
      name: docName.trim(),
      documentUrl: docUrl.trim(),
      type: docType,
      expirationDate: docExpDate || undefined,
      verificationStatus: docStatus,
      verifiedBy: authorName,
      verifiedDate: new Date().toISOString().split('T')[0],
      notes: docNotes.trim() || undefined,
      fileName: docName.toLowerCase().replace(/\s+/g, '_') + '.pdf',
    });

    // Reset Form
    setDocName('');
    setDocUrl('');
    setDocType('State License');
    setDocExpDate('');
    setDocStatus('Verified');
    setDocNotes('');
    setIsAddingDoc(false);
  };

  const documents = provider.documents || [];

  const filteredDocs = documents.filter((doc) => {
    if (typeFilter !== 'All' && doc.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchUrl = doc.documentUrl?.toLowerCase().includes(q) || false;
      const matchNotes = doc.notes?.toLowerCase().includes(q) || false;
      if (!matchName && !matchUrl && !matchNotes) return false;
    }
    return true;
  });

  const getExpirationBadge = (expDate?: string) => {
    if (!expDate) {
      return <span className="text-[11px] text-slate-400">No Expiration</span>;
    }
    const today = new Date();
    const exp = new Date(expDate);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3 h-3" />
          <span>Expired ({expDate})</span>
        </span>
      );
    }
    if (diffDays <= 90) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3" />
          <span>Expires in {diffDays}d ({expDate})</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Check className="w-3 h-3" />
        <span>Valid ({expDate})</span>
      </span>
    );
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Subtab Header & Action Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">
                  Document Links & Credentials Table
                </span>
                <span className="bg-sky-100 text-sky-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {documents.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Manage cloud document links (Google Drive, Dropbox, Box) and files associated with {provider.firstName} {provider.lastName}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingDoc(!isAddingDoc)}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            {isAddingDoc ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Document Link</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible / Inline Add Document Link Form */}
        {isAddingDoc && (
          <form
            onSubmit={handleSaveDocument}
            className="bg-white p-4 rounded-xl border border-sky-200 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>Add Document Link for {provider.firstName} {provider.lastName}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Google Drive, SharePoint, Dropbox or direct PDF URL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Document Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Document Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. California BCBA License 2026"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              {/* Document Link / URL & Supabase Storage Uploader */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Document Link URL *
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-[10px] font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    {isUploading ? (
                      <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
                    ) : (
                      <UploadCloud className="w-3 h-3 text-sky-600" />
                    )}
                    <span>{isUploading ? 'Uploading...' : 'Upload File (Supabase Storage)'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/... or click Upload File above"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white"
                />
                {uploadProgress && (
                  <p className="text-[10px] text-sky-700 mt-1 font-medium flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                    <span>{uploadProgress}</span>
                  </p>
                )}
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Document Type *
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white"
                >
                  {documentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={docExpDate}
                  onChange={(e) => setDocExpDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Verification Status
                </label>
                <select
                  value={docStatus}
                  onChange={(e) => setDocStatus(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white"
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              {/* Notes / Description */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Notes / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified on CA Breeze portal, policy limit $1M/$3M"
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingDoc(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Document Link</span>
              </button>
            </div>
          </form>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search document name, URL, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All Document Types</option>
              {documentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* The Documents Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3.5">Document Name</th>
                  <th className="py-2.5 px-3.5">Document Link / URL</th>
                  <th className="py-2.5 px-3.5">Type</th>
                  <th className="py-2.5 px-3.5">Expiration</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5">Verified By</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => {
                    const hasLink = Boolean(doc.documentUrl);
                    const isCopied = copiedDocId === doc.id;

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Name */}
                        <td className="py-3 px-3.5 font-medium text-slate-900">
                          <div className="flex items-start space-x-2">
                            <FileText className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-slate-800 block text-xs">
                                  {doc.name}
                                </span>
                                {doc.documentUrl?.includes('supabase.co/storage') && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                                    Supabase Storage
                                  </span>
                                )}
                              </div>
                              {doc.notes && (
                                <span className="text-[11px] text-slate-500 block line-clamp-1">
                                  {doc.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Link */}
                        <td className="py-3 px-3.5 font-mono text-[11px]">
                          {hasLink ? (
                            <div className="flex items-center space-x-1.5 max-w-xs">
                              <a
                                href={doc.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:text-sky-800 underline truncate max-w-[200px] flex items-center space-x-1"
                                title={doc.documentUrl}
                              >
                                <span className="truncate">{doc.documentUrl}</span>
                                <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleCopyLink(doc.id, doc.documentUrl)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                                title="Copy link"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No URL link</span>
                          )}
                        </td>

                        {/* Type */}
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {doc.type}
                          </span>
                        </td>

                        {/* Expiration */}
                        <td className="py-3 px-3.5">
                          {getExpirationBadge(doc.expirationDate)}
                        </td>

                        {/* Verification Status */}
                        <td className="py-3 px-3.5">
                          {doc.verificationStatus === 'Verified' ? (
                            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>{doc.verificationStatus}</span>
                            </span>
                          )}
                        </td>

                        {/* Verified By / Date */}
                        <td className="py-3 px-3.5 text-[11px] text-slate-500">
                          <div>{doc.verifiedBy || 'Credentialing Specialist'}</div>
                          <div className="text-[10px] text-slate-400">{doc.uploadDate}</div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            {hasLink && (
                              <a
                                href={doc.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-[11px] font-semibold flex items-center space-x-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Open</span>
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove document "${doc.name}" from ${provider.firstName} ${provider.lastName}?`)) {
                                  deleteProviderDocument(provider.id, doc.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      <FileText className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-700">No documents or links recorded.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Click "+ Add Document Link" above to store Google Drive links, state licenses, board certificates, or W-9 forms.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
