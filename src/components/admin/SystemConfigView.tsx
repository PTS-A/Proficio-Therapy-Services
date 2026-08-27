import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  ArrowLeft,
  Bell, 
  Check, 
  Clock, 
  Lock, 
  Save, 
  Settings, 
  ShieldAlert, 
  Sliders, 
  Users, 
  X,
  Building2,
  Calendar,
  Sparkles,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface SystemConfigViewProps {
  onBackToDashboard: () => void;
}

export const SystemConfigView: React.FC<SystemConfigViewProps> = ({ onBackToDashboard }) => {
  const { currentUser, currentAccount, isAdmin } = useCredentialing();

  const [slaSubmissionDays, setSlaSubmissionDays] = useState(5);
  const [slaFollowUpMinDays, setSlaFollowUpMinDays] = useState(7);
  const [slaFollowUpMaxDays, setSlaFollowUpMaxDays] = useState(10);
  const [caqhReattestationDays, setCaqhReattestationDays] = useState(120);
  const [licenseExpAdvanceAlertDays, setLicenseExpAdvanceAlertDays] = useState(60);
  const [autoReminderPayerAging, setAutoReminderPayerAging] = useState(true);
  const [autoEscalateOverdueFollowup, setAutoEscalateOverdueFollowup] = useState(true);
  const [enableDailySummaryEmail, setEnableDailySummaryEmail] = useState(false);
  const [nppesAutoValidation, setNppesAutoValidation] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const handleResetDefaults = () => {
    setSlaSubmissionDays(5);
    setSlaFollowUpMinDays(7);
    setSlaFollowUpMaxDays(10);
    setCaqhReattestationDays(120);
    setLicenseExpAdvanceAlertDays(60);
    setAutoReminderPayerAging(true);
    setAutoEscalateOverdueFollowup(true);
    setEnableDailySummaryEmail(false);
    setNppesAutoValidation(true);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Settings</span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-[#2B4C9D]">System Configuration</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              System Settings & SLA Policies
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">System SLA settings and alert policies successfully updated and synchronized!</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Target Thresholds Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-[#2B4C9D]" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Operational SLA Thresholds
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Initial Submission SLA Target</label>
                <span className="font-mono font-bold text-[#2B4C9D] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {slaSubmissionDays} Business Days
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Target turnaround from document completion to active payer portal filing.
              </p>
              <input
                type="range"
                min={1}
                max={15}
                value={slaSubmissionDays}
                onChange={(e) => setSlaSubmissionDays(Number(e.target.value))}
                className="w-full accent-[#2B4C9D] cursor-pointer"
              />
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Payer Follow-up Cycle Cadence</label>
                <span className="font-mono font-bold text-[#2B4C9D] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Every {slaFollowUpMinDays} - {slaFollowUpMaxDays} Days
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Recommended frequency for credentialing specialists to contact payer reps for status checks.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Minimum Days:</span>
                  <input
                    type="number"
                    min={3}
                    max={14}
                    value={slaFollowUpMinDays}
                    onChange={(e) => setSlaFollowUpMinDays(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs mt-1"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Maximum Days:</span>
                  <input
                    type="number"
                    min={7}
                    max={30}
                    value={slaFollowUpMaxDays}
                    onChange={(e) => setSlaFollowUpMaxDays(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">CAQH ProView Re-attestation Cadence</label>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {caqhReattestationDays} Days
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Standard industry standard mandate for re-certifying provider profiles on CAQH ProView.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">License Expiration Advance Warning</label>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {licenseExpAdvanceAlertDays} Days Before
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Days in advance to flag state license renewals on provider rosters and dashboards.
              </p>
            </div>
          </div>
        </div>

        {/* Automation & Escalation Policies Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-[#E86424]" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Alerts & Automated Policy Rules
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <input
                type="checkbox"
                id="autoAging"
                checked={autoReminderPayerAging}
                onChange={(e) => setAutoReminderPayerAging(e.target.checked)}
                className="mt-0.5 rounded text-[#2B4C9D] focus:ring-[#2B4C9D]"
              />
              <label htmlFor="autoAging" className="cursor-pointer">
                <span className="font-bold text-slate-800 block">Automatic Aging Escalation Alerts</span>
                <span className="text-[11px] text-slate-500">
                  Automatically generate high-priority dashboard alerts when a payer application crosses 60+ days without determination.
                </span>
              </label>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <input
                type="checkbox"
                id="autoEscalate"
                checked={autoEscalateOverdueFollowup}
                onChange={(e) => setAutoEscalateOverdueFollowup(e.target.checked)}
                className="mt-0.5 rounded text-[#2B4C9D] focus:ring-[#2B4C9D]"
              />
              <label htmlFor="autoEscalate" className="cursor-pointer">
                <span className="font-bold text-slate-800 block">Flag Overdue Follow-up Actions</span>
                <span className="text-[11px] text-slate-500">
                  Highlight application rows in red when the scheduled follow-up date has lapsed.
                </span>
              </label>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <input
                type="checkbox"
                id="nppesSync"
                checked={nppesAutoValidation}
                onChange={(e) => setNppesAutoValidation(e.target.checked)}
                className="mt-0.5 rounded text-[#2B4C9D] focus:ring-[#2B4C9D]"
              />
              <label htmlFor="nppesSync" className="cursor-pointer">
                <span className="font-bold text-slate-800 block">NPPES NPI Registry Auto-Validation</span>
                <span className="text-[11px] text-slate-500">
                  Validate 10-digit NPIs and taxonomy codes against CMS NPPES Registry during provider intake.
                </span>
              </label>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <input
                type="checkbox"
                id="dailySummary"
                checked={enableDailySummaryEmail}
                onChange={(e) => setEnableDailySummaryEmail(e.target.checked)}
                className="mt-0.5 rounded text-[#2B4C9D] focus:ring-[#2B4C9D]"
              />
              <label htmlFor="dailySummary" className="cursor-pointer">
                <span className="font-bold text-slate-800 block">Daily Executive Digest Email</span>
                <span className="text-[11px] text-slate-500">
                  Dispatch a 9:00 AM summary of approvals, pending linking, and expiring documents to team administrators.
                </span>
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All System Configurations</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
