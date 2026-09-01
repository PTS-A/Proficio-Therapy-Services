import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';

export const ForcePasswordChangeModal: React.FC = () => {
  const { currentAccount, changePassword } = useCredentialing();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no current account or password change not required, do not render
  if (!currentAccount || !currentAccount.mustChangePasswordOnFirstLogin) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNew = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (cleanNew.length < 6) {
      setError('New password must be at least 6 characters in length.');
      return;
    }

    if (cleanNew === 'admin' || cleanNew === 'proficio' || cleanNew === 'user123') {
      setError('Please choose a unique custom password rather than a default system placeholder.');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setError('Passwords do not match. Please verify and re-enter.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = changePassword(cleanNew);
      setIsSubmitting(false);
      if (!res.success) {
        setError(res.error || 'Failed to update password. Please try again.');
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#2B4C9D] to-[#1d3570] p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <KeyRound className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                First Sign-On Password Setup
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Security Governance: Mandatory credential update required
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* User & Role Badge */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#2B4C9D] text-white font-bold flex items-center justify-center text-xs">
                {currentAccount.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-none">
                  {currentAccount.name}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  {currentAccount.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#2B4C9D] border border-indigo-200">
                {currentAccount.systemRole || 'Specialist'}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Assigned Role</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed">
            Welcome to the centralized credentialing portal. To safeguard clinician licenses, payer contracts, and healthcare records, you must replace your initial temporary password with a personalized password.
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                New Private Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start space-x-2 text-[11px] text-blue-900">
              <ShieldCheck className="w-4 h-4 text-[#2B4C9D] shrink-0 mt-0.5" />
              <span>
                <strong>Confidentiality Policy:</strong> Your account is constrained strictly to your assigned system role. Password visibility and credential audits are restricted exclusively to the <strong>Super Administrator</strong>.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <span>Securing Account...</span>
              ) : (
                <>
                  <span>Save Password & Access Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
