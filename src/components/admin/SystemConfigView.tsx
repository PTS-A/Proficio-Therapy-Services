import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { StageCategory, StageConfig, CredentialingStage } from '../../types';
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
  RefreshCw,
  Plus,
  Trash2,
  Mail,
  FileText,
  Database,
  History,
  CheckCircle2,
  Download,
  Layers,
  Edit3,
  CheckCircle,
  HelpCircle,
  Info,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';

interface SystemConfigViewProps {
  onBackToDashboard: () => void;
}

interface HolidayItem {
  id: string;
  name: string;
  date: string;
  affectsSla: boolean;
  type: 'Federal' | 'Corporate' | 'State';
}

interface NotificationTemplate {
  id: string;
  name: string;
  triggerEvent: string;
  subject: string;
  recipientRoles: string[];
  bodyTemplate: string;
  isActive: boolean;
}

export const SystemConfigView: React.FC<SystemConfigViewProps> = ({ onBackToDashboard }) => {
  const { 
    currentUser, 
    currentAccount, 
    isAdmin, 
    stageConfigs, 
    updateStageConfig, 
    resetStageConfigs, 
    addCustomStage, 
    deleteCustomStage, 
    reorderStages,
    addAuditEntry 
  } = useCredentialing();

  const [activeConfigTab, setActiveConfigTab] = useState<'sla' | 'stages' | 'holidays' | 'templates' | 'retention-dr'>('sla');
  const [stageCategoryFilter, setStageCategoryFilter] = useState<string>('All');
  const [editingStage, setEditingStage] = useState<StageConfig | null>(null);
  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [newStageForm, setNewStageForm] = useState<{
    name: string;
    category: StageCategory;
    description: string;
    slaTurnaroundTargetDays: number;
    badgeColor: string;
    requiresPreSubmissionValidation: boolean;
    requiresFollowUpCadence: boolean;
  }>({
    name: '',
    category: 'In-Review',
    description: '',
    slaTurnaroundTargetDays: 14,
    badgeColor: 'sky',
    requiresPreSubmissionValidation: false,
    requiresFollowUpCadence: true,
  });
  const [stageActionMessage, setStageActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // SLA & Automation states
  const [slaSubmissionDays, setSlaSubmissionDays] = useState(5);
  const [slaFollowUpMinDays, setSlaFollowUpMinDays] = useState(7);
  const [slaFollowUpMaxDays, setSlaFollowUpMaxDays] = useState(10);
  const [caqhReattestationDays, setCaqhReattestationDays] = useState(120);
  const [licenseExpAdvanceAlertDays, setLicenseExpAdvanceAlertDays] = useState(60);
  const [autoReminderPayerAging, setAutoReminderPayerAging] = useState(true);
  const [autoEscalateOverdueFollowup, setAutoEscalateOverdueFollowup] = useState(true);
  const [enableDailySummaryEmail, setEnableDailySummaryEmail] = useState(false);
  const [nppesAutoValidation, setNppesAutoValidation] = useState(true);

  // Holiday Calendar (FR-031 / NFR-012)
  const [holidays, setHolidays] = useState<HolidayItem[]>([
    { id: 'HOL-1', name: "New Year's Day", date: '2026-01-01', affectsSla: true, type: 'Federal' },
    { id: 'HOL-2', name: 'Martin Luther King Jr. Day', date: '2026-01-19', affectsSla: true, type: 'Federal' },
    { id: 'HOL-3', name: "Presidents' Day", date: '2026-02-16', affectsSla: true, type: 'Federal' },
    { id: 'HOL-4', name: 'Memorial Day', date: '2026-05-25', affectsSla: true, type: 'Federal' },
    { id: 'HOL-5', name: 'Juneteenth National Independence Day', date: '2026-06-19', affectsSla: true, type: 'Federal' },
    { id: 'HOL-6', name: 'Independence Day', date: '2026-07-04', affectsSla: true, type: 'Federal' },
    { id: 'HOL-7', name: 'Labor Day', date: '2026-09-07', affectsSla: true, type: 'Federal' },
    { id: 'HOL-8', name: 'Thanksgiving Day', date: '2026-11-26', affectsSla: true, type: 'Federal' },
    { id: 'HOL-9', name: 'Day After Thanksgiving', date: '2026-11-27', affectsSla: true, type: 'Corporate' },
    { id: 'HOL-10', name: 'Christmas Day', date: '2026-12-25', affectsSla: true, type: 'Federal' },
  ]);

  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayType, setNewHolidayType] = useState<'Federal' | 'Corporate' | 'State'>('Corporate');

  // Notification Templates (FR-027 / NFR-012)
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'TMPL-01',
      name: 'License 60-Day Advance Warning',
      triggerEvent: 'Clinician license expires in ≤ 60 calendar days',
      subject: 'URGENT: Credentialing License Renewal Notice - {provider_name}',
      recipientRoles: ['Credentialing Specialist', 'Provider (Clinician)', 'Human Resources (HR)'],
      bodyTemplate: 'Dear {provider_name},\n\nYour {license_type} license ({license_number}) under state {license_state} is scheduled to expire on {expiration_date}. To prevent clinical credentialing suspension or payer billing hold, please submit renewal documentation immediately to the credentialing team.\n\nThank you,\nAges / Proficio Credentialing Department',
      isActive: true
    },
    {
      id: 'TMPL-02',
      name: 'Overdue Follow-up & Aging Escalation',
      triggerEvent: 'Application pending payer determination ≥ 60 days or follow-up overdue',
      subject: 'ACTION REQUIRED: Escalated Credentialing Application Aging ({payer_name}) - {provider_name}',
      recipientRoles: ['Credentialing Manager', 'Leadership / Executive', 'Credentialing Specialist'],
      bodyTemplate: 'Attention Credentialing Leadership,\n\nApplication {application_id} for {provider_name} with {payer_name} has exceeded SLA benchmarks ({days_in_process} days elapsed). Last logged contact with payer representative was on {last_follow_up_date}.\n\nPlease review escalation notes and initiate supervisor outreach.',
      isActive: true
    },
    {
      id: 'TMPL-03',
      name: 'Payer Approval & Effective Date Broadcast',
      triggerEvent: 'Payer status updated to Approved with Effective Date',
      subject: 'CREDENTIALING APPROVED: {provider_name} is now in-network with {payer_name}',
      recipientRoles: ['Billing and Claims', 'HR / Operations', 'Credentialing Specialist', 'Provider (Clinician)'],
      bodyTemplate: 'Great news! {provider_name} has been formally approved and linked under {entity_name} for {payer_name}.\n\nEffective Date: {effective_date}\nProvider Rendering NPI: {npi}\nBilling Hold: RELEASED (Ready to bill claims)',
      isActive: true
    }
  ]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('TMPL-01');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    if (addAuditEntry) {
      addAuditEntry({
        userId: currentUser?.id || 'admin-01',
        userName: currentUser?.name || 'Administrator',
        action: 'SYSTEM_CONFIG_UPDATED',
        notes: `Updated SLA settings, holiday calendar (${holidays.length} rules), and ${templates.length} email templates.`
      });
    }
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const handleAddHoliday = () => {
    if (!newHolidayName || !newHolidayDate) return;
    const newHol: HolidayItem = {
      id: `HOL-${Date.now().toString().slice(-4)}`,
      name: newHolidayName,
      date: newHolidayDate,
      affectsSla: true,
      type: newHolidayType
    };
    setHolidays([...holidays, newHol]);
    setNewHolidayName('');
    setNewHolidayDate('');
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
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

  const currentTmpl = templates.find(t => t.id === selectedTemplateId) || templates[0];

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
              <span className="text-xs font-semibold text-[#2B4C9D]">System Configuration & Policies</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              System Settings, SLA Policies & Holiday Calendar
            </h1>
          </div>
        </div>

        {/* Subtab Selector */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1.5 rounded-xl text-xs gap-1">
          <button
            type="button"
            onClick={() => setActiveConfigTab('sla')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeConfigTab === 'sla' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#2B4C9D]" />
            <span>SLA & Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveConfigTab('stages')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeConfigTab === 'stages' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Workflow Stages ({stageConfigs?.length || 18})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveConfigTab('holidays')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeConfigTab === 'holidays' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Holiday Calendar ({holidays.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveConfigTab('templates')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeConfigTab === 'templates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-purple-600" />
            <span>Email Templates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveConfigTab('retention-dr')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeConfigTab === 'retention-dr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Backup & Retention</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Configurations saved and synchronized across all active user sessions!</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 1: SLA & AUTOMATION POLICIES */}
      {/* ========================================================= */}
      {activeConfigTab === 'sla' && (
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
                  <span>Save SLA & Policy Configurations</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* SUBTAB: WORKFLOW STAGES CONFIGURATION (18 Standardized)   */}
      {/* ========================================================= */}
      {activeConfigTab === 'stages' && (
        <div className="space-y-6">
          {/* Header & Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Standardized Credentialing Lifecycle Stages
                    </h2>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      Configurable by System Administrator
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 max-w-3xl leading-relaxed">
                  These standardized stages apply consistently across all providers (ABA, Speech, OT), payers, legal entities, and credentialing specialists. Configure target turnaround SLAs, automated pre-submission gates, and follow-up cadences.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all workflow stages to the 18 standardized system defaults?')) {
                      resetStageConfigs();
                      setStageActionMessage({ text: 'Workflow stages successfully reset to the 18 standardized defaults.', type: 'success' });
                      setTimeout(() => setStageActionMessage(null), 3000);
                    }
                  }}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset to 18 Standard Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddStageModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Stage</span>
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {stageActionMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center justify-between animate-in fade-in ${
                stageActionMessage.type === 'success' 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                <div className="flex items-center space-x-2">
                  {stageActionMessage.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-semibold">{stageActionMessage.text}</span>
                </div>
                <button onClick={() => setStageActionMessage(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Filter Category:</span>
              {['All', 'Pre-Submission', 'In-Review', 'Approval & Linking', 'Completed / Closed', 'Maintenance / Alert'].map((cat) => {
                const count = cat === 'All' 
                  ? stageConfigs.length 
                  : stageConfigs.filter((s) => s.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setStageCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      stageCategoryFilter === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workflow Stages Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4 w-16 text-center">#</th>
                    <th className="py-3 px-4 min-w-[200px]">Stage Name & Category</th>
                    <th className="py-3 px-4 min-w-[260px]">Description & System Workflow Rules</th>
                    <th className="py-3 px-4 w-28 text-center">Target SLA (TAT)</th>
                    <th className="py-3 px-4 w-44">Enforced Automation</th>
                    <th className="py-3 px-4 w-24 text-center">Status</th>
                    <th className="py-3 px-4 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stageConfigs
                    .filter((stg) => stageCategoryFilter === 'All' || stg.category === stageCategoryFilter)
                    .map((stage, idx) => {
                      const isPreSub = stage.category === 'Pre-Submission';
                      const isInReview = stage.category === 'In-Review';
                      const isApproval = stage.category === 'Approval & Linking';
                      const isCompleted = stage.category === 'Completed / Closed';
                      const isMaintenance = stage.category === 'Maintenance / Alert';

                      return (
                        <tr key={stage.id} className="hover:bg-slate-50/75 transition-colors group">
                          {/* Order / Sequence */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                            <div className="flex items-center justify-center space-x-1">
                              <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 text-[11px]">
                                {stage.order}
                              </span>
                            </div>
                          </td>

                          {/* Stage Name & Category */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-slate-900 text-xs">
                                  {stage.name}
                                </span>
                                {stage.isMandatory && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                                    Core
                                  </span>
                                )}
                                {stage.isSystemAssigned && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                    System
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                  isPreSub ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                  isInReview ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                                  isApproval ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                  isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {stage.category}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Description & Rules */}
                          <td className="py-3.5 px-4 text-slate-600 text-[11px] leading-relaxed">
                            <p>{stage.description}</p>
                          </td>

                          {/* Target SLA */}
                          <td className="py-3.5 px-4 text-center">
                            {stage.slaTurnaroundTargetDays ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                  {stage.slaTurnaroundTargetDays} {stage.slaTurnaroundTargetDays === 1 ? 'day' : 'days'}
                                </span>
                                <span className="text-[9px] text-slate-400 mt-0.5">Target TAT</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">—</span>
                            )}
                          </td>

                          {/* Automation & Gates */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {stage.requiresPreSubmissionValidation && (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                                  <span>Doc Checklist Gate</span>
                                </span>
                              )}
                              {stage.requiresFollowUpCadence && (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                                  <Clock className="w-3 h-3 text-sky-600" />
                                  <span>7–10d Follow-up</span>
                                </span>
                              )}
                              {!stage.requiresPreSubmissionValidation && !stage.requiresFollowUpCadence && (
                                <span className="text-[10px] text-slate-400 font-normal">Standard Lifecycle</span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                if (stage.isMandatory || stage.isSystemAssigned) {
                                  setStageActionMessage({ text: `Stage "${stage.name}" is a core required workflow step and cannot be disabled.`, type: 'error' });
                                  setTimeout(() => setStageActionMessage(null), 3000);
                                  return;
                                }
                                updateStageConfig(stage.id, { isActive: !stage.isActive });
                                setStageActionMessage({ text: `Stage "${stage.name}" is now ${!stage.isActive ? 'Active' : 'Disabled'}.`, type: 'success' });
                                setTimeout(() => setStageActionMessage(null), 2500);
                              }}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                stage.isActive
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-500 border border-slate-300'
                              }`}
                            >
                              {stage.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                type="button"
                                onClick={() => setEditingStage(stage)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Stage SLA & Rules"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {!stage.isMandatory && !stage.isSystemAssigned && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete custom stage "${stage.name}"?`)) {
                                      const res = deleteCustomStage(stage.id);
                                      if (res.success) {
                                        setStageActionMessage({ text: `Custom stage "${stage.name}" removed.`, type: 'success' });
                                      } else {
                                        setStageActionMessage({ text: res.error || 'Failed to delete stage.', type: 'error' });
                                      }
                                      setTimeout(() => setStageActionMessage(null), 3000);
                                    }
                                  }}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Custom Stage"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Educational / Architectural Compliance Callout */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-600">
            <div className="flex items-center space-x-2 text-slate-800 font-bold">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Standardized Pipeline Consistency Guarantee</span>
            </div>
            <p className="leading-relaxed">
              All 18 standardized stages (<strong>Intake, Documents Pending, Documents Complete, CAQH Pending, PAVE Pending, Application Preparation, Application Submitted, Payer Review, Additional Documents Requested, Correction Required, Resubmitted, Approved, Linking Pending, Linked, Effective, Closed / Not Contracted, Recredentialing Due, Overdue</strong>) are seamlessly mapped into the Credentialing Tracker, Kanban Boards, Detail Progression Steppers, and Executive SLA Reporting modules across all provider specialties and commercial/Medicaid payers.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT STAGE MODAL                                          */}
      {/* ========================================================= */}
      {editingStage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Workflow Stage: {editingStage.name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {editingStage.id} &bull; Order: #{editingStage.order}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStageConfig(editingStage.id, {
                  description: editingStage.description,
                  slaTurnaroundTargetDays: editingStage.slaTurnaroundTargetDays,
                  category: editingStage.category,
                  badgeColor: editingStage.badgeColor,
                  requiresPreSubmissionValidation: editingStage.requiresPreSubmissionValidation,
                  requiresFollowUpCadence: editingStage.requiresFollowUpCadence,
                });
                setEditingStage(null);
                setStageActionMessage({ text: `Stage "${editingStage.name}" configurations updated successfully.`, type: 'success' });
                setTimeout(() => setStageActionMessage(null), 3000);
              }}
              className="p-6 space-y-4 text-xs"
            >
              {/* Category */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Workflow Category:</label>
                <select
                  value={editingStage.category}
                  onChange={(e) => setEditingStage({ ...editingStage, category: e.target.value as StageCategory })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                >
                  <option value="Pre-Submission">Pre-Submission</option>
                  <option value="In-Review">In-Review</option>
                  <option value="Approval & Linking">Approval & Linking</option>
                  <option value="Completed / Closed">Completed / Closed</option>
                  <option value="Maintenance / Alert">Maintenance / Alert</option>
                </select>
              </div>

              {/* Target SLA Turnaround */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Target SLA Turnaround (Calendar / Business Days):
                </label>
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={editingStage.slaTurnaroundTargetDays || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, slaTurnaroundTargetDays: Number(e.target.value) || undefined })}
                  placeholder="e.g. 5, 10, 60, 90"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used by the SLA engine to compute target compliance and aging milestones.
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Stage Description & Team Guidance:</label>
                <textarea
                  rows={3}
                  value={editingStage.description}
                  onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:bg-white"
                />
              </div>

              {/* Automation Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStage.requiresPreSubmissionValidation || false}
                    onChange={(e) => setEditingStage({ ...editingStage, requiresPreSubmissionValidation: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-semibold">
                    Enforce Pre-Submission Checklist Gate (SLA-005 / SLA-007)
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStage.requiresFollowUpCadence || false}
                    onChange={(e) => setEditingStage({ ...editingStage, requiresFollowUpCadence: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-semibold">
                    Enforce 7–10 Day Payer Follow-up Cadence (SLA-002)
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStage(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Stage Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD CUSTOM STAGE MODAL                                    */}
      {/* ========================================================= */}
      {showAddStageModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Add Custom Workflow Stage
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Applies consistently across all providers and payers
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStageModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStageForm.name.trim()) return;
                addCustomStage({
                  name: newStageForm.name as CredentialingStage,
                  category: newStageForm.category,
                  description: newStageForm.description || 'Custom configured workflow stage.',
                  slaTurnaroundTargetDays: newStageForm.slaTurnaroundTargetDays || undefined,
                  badgeColor: newStageForm.badgeColor,
                  requiresPreSubmissionValidation: newStageForm.requiresPreSubmissionValidation,
                  requiresFollowUpCadence: newStageForm.requiresFollowUpCadence,
                  isActive: true,
                });
                setShowAddStageModal(false);
                setNewStageForm({
                  name: '',
                  category: 'In-Review',
                  description: '',
                  slaTurnaroundTargetDays: 14,
                  badgeColor: 'sky',
                  requiresPreSubmissionValidation: false,
                  requiresFollowUpCadence: true,
                });
                setStageActionMessage({ text: `Custom stage "${newStageForm.name}" created successfully.`, type: 'success' });
                setTimeout(() => setStageActionMessage(null), 3000);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Stage Name *:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Committee Review, Secondary Verification"
                  value={newStageForm.name}
                  onChange={(e) => setNewStageForm({ ...newStageForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Workflow Category *:</label>
                <select
                  value={newStageForm.category}
                  onChange={(e) => setNewStageForm({ ...newStageForm, category: e.target.value as StageCategory })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                >
                  <option value="Pre-Submission">Pre-Submission</option>
                  <option value="In-Review">In-Review</option>
                  <option value="Approval & Linking">Approval & Linking</option>
                  <option value="Completed / Closed">Completed / Closed</option>
                  <option value="Maintenance / Alert">Maintenance / Alert</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target SLA Turnaround (Days):</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={newStageForm.slaTurnaroundTargetDays}
                  onChange={(e) => setNewStageForm({ ...newStageForm, slaTurnaroundTargetDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Operational Notes:</label>
                <textarea
                  rows={3}
                  placeholder="Describe the operational milestone and specialist responsibilities..."
                  value={newStageForm.description}
                  onChange={(e) => setNewStageForm({ ...newStageForm, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStageModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Stage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: HOLIDAY CALENDAR */}
      {/* ========================================================= */}
      {activeConfigTab === 'holidays' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Operational Holiday Calendar (SLA Business Days Math)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure corporate and federal holidays excluded when computing SLA submission and follow-up turnaround business days.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Calendar Changes</span>
            </button>
          </div>

          {/* Add Holiday Form */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Holiday Name:</label>
              <input
                type="text"
                placeholder="e.g. Labor Day"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Observed Date:</label>
              <input
                type="date"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddHoliday}
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Holiday</span>
              </button>
            </div>
          </div>

          {/* Holiday List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-4">Holiday Name</th>
                  <th className="py-2.5 px-4">Observed Date</th>
                  <th className="py-2.5 px-4">Classification</th>
                  <th className="py-2.5 px-4">SLA Impact</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {holidays.map((hol) => (
                  <tr key={hol.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{hol.name}</td>
                    <td className="py-2.5 px-4 font-mono">{hol.date}</td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hol.type === 'Federal' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {hol.type} Holiday
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-emerald-700 font-semibold">
                      Excluded from SLA Business Days
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteHoliday(hol.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Remove Holiday"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: NOTIFICATION EMAIL TEMPLATES (FR-027 / NFR-012) */}
      {/* ========================================================= */}
      {activeConfigTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selector List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-purple-600" />
              <span>Configured Templates ({templates.length})</span>
            </h3>

            <div className="space-y-2">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedTemplateId === tmpl.id
                      ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tmpl.name}</span>
                    <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded font-bold">
                      {tmpl.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {tmpl.triggerEvent}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Template Editor */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Editing: {currentTmpl.name}
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active Template
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Subject Line:</label>
                <input
                  type="text"
                  value={currentTmpl.subject}
                  onChange={(e) => {
                    const updated = templates.map(t => t.id === currentTmpl.id ? { ...t, subject: e.target.value } : t);
                    setTemplates(updated);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Supported Dynamic Merge Tags:</label>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {['{provider_name}', '{npi}', '{license_type}', '{license_number}', '{expiration_date}', '{payer_name}', '{entity_name}', '{effective_date}', '{days_in_process}'].map(tag => (
                    <span key={tag} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Body Template:</label>
                <textarea
                  rows={8}
                  value={currentTmpl.bodyTemplate}
                  onChange={(e) => {
                    const updated = templates.map(t => t.id === currentTmpl.id ? { ...t, bodyTemplate: e.target.value } : t);
                    setTemplates(updated);
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Email Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 4: BACKUP & DATA RETENTION */}
      {/* ========================================================= */}
      {activeConfigTab === 'retention-dr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Automated Daily Backup Schedule & Recovery (RTO &le; 4h)
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">
                Automated database snapshots are scheduled daily at <strong>00:00:00 UTC</strong> with encrypted offsite redundancy in multi-zone storage.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">RTO SLA Benchmark</span>
                  <span className="text-base font-bold text-emerald-700 block mt-0.5">&le; 4.0 Hours</span>
                  <span className="text-[10px] text-slate-500">Drill verified: 34 mins</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">RPO Benchmark</span>
                  <span className="text-base font-bold text-indigo-700 block mt-0.5">&le; 24.0 Hours</span>
                  <span className="text-[10px] text-slate-500">Daily midnight snapshots</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <History className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                7-Year Credentialing Record Retention & Compliance Lock
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">
                All provider files, primary source verifications, CAQH attestations, and immutable audit logs are protected by an automated <strong>7-Year (84 months) retention lock</strong>.
              </p>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-start space-x-2 text-[11px] text-purple-900">
                <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <span>Complies with CMS Medicare/Medicaid Managed Care regulations and HIPAA Security Rule § 164.312(b).</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
