import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X, Check, Copy } from 'lucide-react';
import { Provider } from '../../types';

interface DeleteStaffSafetyModalProps {
  isOpen: boolean;
  staff: Provider | null;
  onClose: () => void;
  onConfirmDelete: (staffId: string) => void;
}

export const DeleteStaffSafetyModal: React.FC<DeleteStaffSafetyModalProps> = ({
  isOpen,
  staff,
  onClose,
  onConfirmDelete,
}) => {
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Generate the required confirmation phrase: delete-firstname-lastname
  const rawFirst = (staff?.firstName || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const rawLast = (staff?.lastName || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const targetPhrase = rawFirst && rawLast 
    ? `delete-${rawFirst}-${rawLast}` 
    : `delete-${(staff?.fullName || 'staff').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

  useEffect(() => {
    if (isOpen) {
      setTypedConfirmation('');
      setCopied(false);
      setIsDeleting(false);
    }
  }, [isOpen, staff]);

  if (!isOpen || !staff) return null;

  const isMatch = typedConfirmation.trim().toLowerCase() === targetPhrase.toLowerCase();

  const handleCopy = () => {
    navigator.clipboard?.writeText(targetPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!isMatch || isDeleting) return;
    setIsDeleting(true);
    onConfirmDelete(staff.id);
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950">Confirm Staff Removal</h3>
              <p className="text-xs text-rose-700">Strict Safety Confirmation Required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700">
            You are about to permanently delete <strong>{staff.firstName} {staff.lastName} {staff.credentials ? `(${staff.credentials})` : ''}</strong> from the clinical roster.
          </p>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <span>Warning: This action cannot be undone.</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Deleting this clinician will remove their profile, credentials, and affiliations across all operating entities.
            </p>
          </div>

          {/* Typing confirmation instruction */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-slate-700">
              To proceed, please type <span className="font-mono font-bold text-rose-600">{targetPhrase}</span> below:
            </label>

            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 flex items-center justify-between select-all">
                <span>{targetPhrase}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 text-[11px] cursor-pointer"
                  title="Copy confirmation phrase"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="relative mt-2">
              <input
                type="text"
                autoFocus
                value={typedConfirmation}
                onChange={(e) => setTypedConfirmation(e.target.value)}
                placeholder={`Type "${targetPhrase}"`}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono transition-all outline-none ${
                  isMatch 
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-2 ring-emerald-500/20' 
                    : typedConfirmation.length > 0 
                    ? 'border-rose-400 bg-rose-50/20 text-slate-900 ring-2 ring-rose-500/10'
                    : 'border-slate-300 focus:border-[#2B4C9D] focus:ring-2 focus:ring-blue-500/10'
                }`}
              />
              {isMatch && (
                <div className="absolute right-3 top-3 text-emerald-600 flex items-center space-x-1 text-xs font-bold">
                  <Check className="w-4 h-4" />
                  <span>Matched</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isMatch || isDeleting}
            onClick={handleConfirm}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer ${
              isMatch && !isDeleting
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Permanently Delete Staff Member'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
