import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { ProficioLogo } from '../common/ProficioLogo';
import { 
  UserPlus, 
  Mail, 
  User, 
  Phone, 
  Building2, 
  Briefcase, 
  MapPin, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Clock
} from 'lucide-react';

interface RequestAccessPageProps {
  initialEmail?: string;
  onBackToLogin: () => void;
}

export const RequestAccessPage: React.FC<RequestAccessPageProps> = ({ 
  initialEmail = '', 
  onBackToLogin 
}) => {
  const { submitAccessRequest, entities, locations } = useCredentialing();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Credentialing & Operations');
  const [requestedRole, setRequestedRole] = useState('Credentialing Specialist');
  const [entityId, setEntityId] = useState(entities[0]?.id || 'ent-1');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-1');
  const [justification, setJustification] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid corporate email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitAccessRequest({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        department,
        requestedRole,
        entityId,
        locationId,
        justification: justification.trim() || 'New team member requesting Credentialing Portal access.',
      });

      setIsSubmitting(false);

      if (res.success && res.request) {
        setSubmittedRequestId(res.request.id);
      } else {
        setError(res.error || 'Failed to submit access request. Please try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'An unexpected error occurred while submitting your request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-lg space-y-5">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div className="p-4 sm:p-5 bg-white rounded-2xl shadow-xs border border-slate-200/90 w-full flex justify-center items-center">
            <ProficioLogo variant="full" size="2xl" className="max-w-full" />
          </div>
        </div>

        {/* Form Card or Submitted Success Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-5">
          {submittedRequestId ? (
            <div className="space-y-5 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                  Request Pending Super Administrator Review
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Access Request Submitted!
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-slate-800">{fullName}</span>. Your system access request has been securely routed to the Super Administrator.
                </p>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500 border-b border-slate-200/70 pb-2">
                  <span>Reference ID:</span>
                  <span className="font-mono font-semibold text-slate-800">{submittedRequestId}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Email:</span>
                  <span className="font-medium text-slate-900">{email}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Department:</span>
                  <span className="font-medium text-slate-900">{department}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Requested Role:</span>
                  <span className="font-medium text-slate-900">{requestedRole}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Status:</span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Pending Superadmin Approval</span>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 text-left space-y-1">
                <p className="font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2B4C9D]" />
                  <span>Next Steps</span>
                </p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  The Super Administrator will review your identity, assign your designated access level and clinical permissions, and activate your account. You will then be able to log in using Google OAuth or your corporate email.
                </p>
              </div>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-2.5 px-4 bg-[#2B4C9D] hover:bg-[#203a7a] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2B4C9D] border border-blue-200 mb-1.5">
                    <UserPlus className="w-3 h-3" />
                    <span>Employee &amp; Staff Registration</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Request System Access
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Not registered in the system? Submit your details for Superadmin review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer p-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Joel Mathew Reji"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@ageslearningsolutions.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(925) 456-7890"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900 cursor-pointer"
                    >
                      <option value="Credentialing & Operations">Credentialing &amp; Operations</option>
                      <option value="Clinical Therapy Services">Clinical Therapy Services</option>
                      <option value="Revenue Cycle & Billing">Revenue Cycle &amp; Billing</option>
                      <option value="Human Resources & Staffing">Human Resources &amp; Staffing</option>
                      <option value="Executive Leadership">Executive Leadership</option>
                      <option value="IT & Compliance Governance">IT &amp; Compliance</option>
                    </select>
                  </div>
                </div>

                {/* Requested Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requested Role
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={requestedRole}
                      onChange={(e) => setRequestedRole(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900 cursor-pointer"
                    >
                      <option value="Credentialing Specialist">Credentialing Specialist</option>
                      <option value="Credentialing Lead / Manager">Credentialing Lead / Manager</option>
                      <option value="Clinical Director / Supervisor">Clinical Director / Supervisor</option>
                      <option value="Billing and Claims Specialist">Billing &amp; Claims Specialist</option>
                      <option value="HR / Operations Coordinator">HR / Operations Coordinator</option>
                      <option value="Provider / Therapist">Provider / Therapist</option>
                      <option value="System Administrator">System Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Practice Entity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Practice Entity
                  </label>
                  <select
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900 cursor-pointer"
                  >
                    {entities.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.name || ent.dba || ent.legalName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Office / Clinic Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900 cursor-pointer"
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

              {/* Justification / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Access Request
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <textarea
                    rows={2}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Briefly state your job function and why you need access..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-request-access-button"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#2B4C9D] hover:bg-[#203a7a] active:bg-[#1a2f64] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Request...</span>
                  </div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Request Access</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Already have an account? <span className="font-semibold text-[#2B4C9D]">Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Enterprise Security Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Proficio Therapy Services &bull; Credentialing &amp; Payer Enrollment Portal
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Super Administrator Role Governance &bull; ISO/IEC 27001 Access Control
          </p>
        </div>
      </div>
    </div>
  );
};
