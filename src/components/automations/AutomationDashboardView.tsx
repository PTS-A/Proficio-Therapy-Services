import React, { useState, useEffect } from 'react';
import {
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Play,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Eye,
  X,
  FileText,
  Search,
  Check,
  Calendar,
  User,
  Zap,
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { AutomationRule, AutomationExecutionLog, DeadlineEvaluationReport } from '../../types';
import {
  fetchAutomationStatus,
  fetchAutomationRules,
  saveAutomationRule,
  deleteAutomationRule,
  fetchAutomationExecutions,
  runDeadlineCheck,
  sendTestReminder,
  AutomationSystemStatus,
} from '../../services/automationService';

export const AutomationDashboardView: React.FC = () => {
  const { currentAccount, records, clinicalStaff } = useCredentialing();

  // State
  const [status, setStatus] = useState<AutomationSystemStatus | null>(null);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [executions, setExecutions] = useState<AutomationExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastReport, setLastReport] = useState<DeadlineEvaluationReport | null>(null);

  // Filters & Tabs
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'executions' | 'test'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<AutomationRule> | null>(null);
  const [viewingExecution, setViewingExecution] = useState<AutomationExecutionLog | null>(null);

  // Test Send State
  const [testRuleId, setTestRuleId] = useState<string>('');
  const [testRecordId, setTestRecordId] = useState<string>('');
  const [testTargetEmail, setTestTargetEmail] = useState<string>(currentAccount?.email || '');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [st, rl, ex] = await Promise.all([
        fetchAutomationStatus(),
        fetchAutomationRules(),
        fetchAutomationExecutions(100),
      ]);
      setStatus(st);
      setRules(rl);
      setExecutions(ex);
      if (rl.length > 0 && !testRuleId) {
        setTestRuleId(rl[0].id);
      }
      if (records.length > 0 && !testRecordId) {
        setTestRecordId(records[0].id);
      }
    } catch (err) {
      console.error('Failed to load automation data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [records]);

  // Execute manual deadline check
  const handleTriggerCheck = async (dryRun: boolean) => {
    setIsExecuting(true);
    setLastReport(null);
    try {
      const res = await runDeadlineCheck({ dryRun });
      if (res.success && res.report) {
        setLastReport(res.report);
        // Refresh executions & status
        const [ex, st] = await Promise.all([
          fetchAutomationExecutions(100),
          fetchAutomationStatus(),
        ]);
        setExecutions(ex);
        setStatus(st);
      }
    } catch (err: any) {
      console.error('Trigger check failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Save rule
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule || !editingRule.name) return;

    try {
      const res = await saveAutomationRule(editingRule);
      if (res.success) {
        setIsEditModalOpen(false);
        setEditingRule(null);
        await loadData();
      } else {
        alert('Failed to save rule: ' + (res.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Delete rule
  const handleDeleteRule = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this automation rule?')) return;
    try {
      const res = await deleteAutomationRule(id);
      if (res.success) {
        await loadData();
      }
    } catch (err: any) {
      alert('Failed to delete rule: ' + err.message);
    }
  };

  // Toggle rule active
  const handleToggleRule = async (rule: AutomationRule) => {
    try {
      await saveAutomationRule({
        ...rule,
        isActive: !rule.isActive,
      });
      await loadData();
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  // Send Test Reminder
  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRuleId || !testRecordId || !testTargetEmail) return;

    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await sendTestReminder(testRuleId, testRecordId, testTargetEmail.trim());
      if (res.success) {
        setTestResult({
          success: true,
          message: `Test email dispatched successfully! Log ID: ${res.log?.id || 'recorded'}. Status: ${res.log?.deliveryStatus.toUpperCase()}`,
        });
        const [ex, st] = await Promise.all([
          fetchAutomationExecutions(100),
          fetchAutomationStatus(),
        ]);
        setExecutions(ex);
        setStatus(st);
      } else {
        setTestResult({
          success: false,
          message: res.error || 'Failed to dispatch test email',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Unknown network error',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Filtered executions
  const filteredExecutions = executions.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emailSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.idempotencyKey.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || item.deliveryStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / System Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2B4C9D]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Automated Credential Deadline Reminder System
                </h1>
                <p className="text-xs text-slate-500">
                  Production Resend email delivery engine with automatic cadence checks & idempotency logs
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                status?.resend.configured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${status?.resend.configured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span>{status?.resend.configured ? 'Resend API Active' : 'Resend Simulation Mode'}</span>
              </span>

              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                <Send className="w-3.5 h-3.5 text-slate-400" />
                <span>From: <strong className="font-semibold text-slate-900">{status?.resend.fromEmail || 'credentials@proficiotherapy.com'}</strong></span>
              </span>

              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Cron: Every 6 Hours</span>
              </span>

              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Duplicate Guarantee</span>
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={isExecuting}
              onClick={() => handleTriggerCheck(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              title="Runs deadline check without sending emails"
            >
              <Play className="w-3.5 h-3.5 text-slate-600" />
              <span>{isExecuting ? 'Evaluating...' : 'Dry Run Check'}</span>
            </button>

            <button
              type="button"
              disabled={isExecuting}
              onClick={() => handleTriggerCheck(false)}
              className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] active:bg-[#182c5f] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              title="Runs deadline check and dispatches emails via Resend"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{isExecuting ? 'Processing...' : 'Run Deadline Check Now'}</span>
            </button>

            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
              title="Refresh logs & status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#2B4C9D]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Active Rules</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {status?.activeRulesCount || 0}
              <span className="text-xs font-normal text-slate-500 ml-1">/ {status?.totalRulesCount || 0} total</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Total Executions Logged</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {status?.totalExecutionsLogged || executions.length}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Delivery Status</div>
            <div className="text-xl font-bold text-emerald-600 mt-0.5 flex items-center space-x-1">
              <span>{status?.resend.mode === 'LIVE_DELIVERY' ? 'Live Resend' : 'Simulated'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Last Execution</div>
            <div className="text-sm font-semibold text-slate-800 mt-1 truncate">
              {status?.lastExecution ? new Date(status.lastExecution).toLocaleString() : 'Ready to run'}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Execution Report Banner (if just run) */}
      {lastReport && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-2xl border border-blue-200 p-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-700" />
              <h3 className="text-sm font-bold text-blue-900">
                Deadline Check Execution Report {lastReport.dryRun ? '(Dry Run / Simulation)' : '(Live Dispatched)'}
              </h3>
            </div>
            <span className="text-xs text-blue-700 font-medium">
              {new Date(lastReport.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Records Checked</div>
              <div className="text-base font-bold text-slate-900">{lastReport.totalRecordsChecked}</div>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Upcoming Deadlines</div>
              <div className="text-base font-bold text-amber-600">{lastReport.upcomingDeadlinesFound}</div>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Emails Sent</div>
              <div className="text-base font-bold text-emerald-600">{lastReport.emailsSent}</div>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Simulated</div>
              <div className="text-base font-bold text-blue-600">{lastReport.emailsSimulated}</div>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Duplicates Blocked</div>
              <div className="text-base font-bold text-indigo-600">{lastReport.duplicatesPrevented}</div>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Failures</div>
              <div className="text-base font-bold text-rose-600">{lastReport.failures}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('rules')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'rules'
                ? 'bg-[#2B4C9D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Automation Rules ({rules.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('executions')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'executions'
                ? 'bg-[#2B4C9D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Execution &amp; Idempotency Logs ({executions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('test')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'test'
                ? 'bg-[#2B4C9D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Test Email Dispatcher
          </button>
        </div>

        {activeSubTab === 'rules' && (
          <button
            type="button"
            onClick={() => {
              setEditingRule({
                name: '',
                eventType: 'CREDENTIAL_EXPIRATION',
                targetType: 'credentialing_records',
                daysBefore: [90, 60, 30, 14, 7],
                recipientRoles: ['assigned_specialist', 'manager'],
                customRecipientEmails: [],
                emailSubjectTemplate: 'Action Required: {{provider_name}} credential expires in {{days_remaining}} days',
                emailBodyTemplate: 'Hello,\n\nPlease be advised that {{provider_name}}\'s credentialing record for {{payer_name}} will expire on {{expiration_date}} ({{days_remaining}} days remaining).\n\nPlease verify documentation and initiate renewal.\n\nThank you,\nProficio Credentialing Team',
                isActive: true,
              });
              setIsEditModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Rule</span>
          </button>
        )}
      </div>

      {/* TAB 1: RULES LIST */}
      {activeSubTab === 'rules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  rule.isActive ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 bg-slate-50/50 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {rule.eventType.replace(/_/g, ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleRule(rule)}
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                        rule.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{rule.name}</h3>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] font-medium block">Reminder Cadence (Days Before):</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.daysBefore.map((day) => (
                          <span
                            key={day}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              day <= 7
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : day <= 30
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {day === 0 ? 'Day of Expiration' : `${day}d`}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] font-medium block">Recipients:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.recipientRoles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize"
                          >
                            {role.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {rule.customRecipientEmails?.length > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            +{rule.customRecipientEmails.length} custom
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 text-[11px] font-medium block">Subject Template:</span>
                      <div className="text-[11px] font-mono text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-200 truncate mt-0.5">
                        {rule.emailSubjectTemplate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Target: {rule.targetType}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRule(rule);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Rule"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EXECUTION & IDEMPOTENCY LOGS */}
      {activeSubTab === 'executions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by provider, recipient email, subject, or idempotency key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
              >
                <option value="all">All Statuses</option>
                <option value="sent">Sent / Delivered</option>
                <option value="simulated">Simulated</option>
                <option value="failed">Failed</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Provider / Staff</th>
                  <th className="py-3 px-4">Expiration Date</th>
                  <th className="py-3 px-4">Cadence</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Executed At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExecutions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Mail className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <div className="font-semibold">No execution records found</div>
                      <div className="text-[11px]">Run a deadline check or send a test email to view execution logs.</div>
                    </td>
                  </tr>
                ) : (
                  filteredExecutions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.providerName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.expirationDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.daysBefore <= 7
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.daysBefore <= 30
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {item.daysBefore === 0 ? 'Day of Expiration' : `${item.daysBefore}d remaining`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-medium truncate max-w-[180px]">{item.recipientEmail}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{item.recipientRole.replace(/_/g, ' ')}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate" title={item.emailSubject}>
                        {item.emailSubject}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          item.deliveryStatus === 'sent' || item.deliveryStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.deliveryStatus === 'simulated'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.deliveryStatus === 'sent' || item.deliveryStatus === 'delivered'
                              ? 'bg-emerald-500'
                              : item.deliveryStatus === 'simulated'
                              ? 'bg-blue-500'
                              : 'bg-rose-500'
                          }`}></span>
                          <span className="capitalize">{item.deliveryStatus}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(item.executedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingExecution(item)}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEST EMAIL DISPATCHER */}
      {activeSubTab === 'test' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Interactive Test Reminder Dispatcher
              </h2>
              <p className="text-xs text-slate-500">
                Generate and dispatch a verified credential deadline notice to test Resend delivery and email formatting.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Automation Rule
              </label>
              <select
                value={testRuleId}
                onChange={(e) => setTestRuleId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
              >
                {rules.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.eventType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Credentialing Record (for Expiration Date &amp; Provider Metadata)
              </label>
              <select
                value={testRecordId}
                onChange={(e) => setTestRecordId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
              >
                {records.slice(0, 30).map((rec) => (
                  <option key={rec.id} value={rec.id}>
                    {rec.providerName} &bull; {rec.payerName} (Exp: {rec.recredentialingDueDate || rec.applicationSubmissionDate || 'Active'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Recipient Email Address
              </label>
              <input
                type="email"
                required
                value={testTargetEmail}
                onChange={(e) => setTestTargetEmail(e.target.value)}
                placeholder="you@proficiotherapy.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Enter your email address to receive the generated notice via Resend immediately.
              </span>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSendingTest}
                className="px-5 py-2.5 bg-[#2B4C9D] hover:bg-[#203a7a] active:bg-[#182c5f] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingTest ? 'Dispatching Test Email...' : 'Send Live Test Email via Resend'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INSPECT EXECUTION MODAL */}
      {viewingExecution && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Execution &amp; Email Inspector</h3>
                <p className="text-xs text-slate-500">Idempotency Key: {viewingExecution.idempotencyKey}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingExecution(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Provider / Staff</span>
                  <span className="font-bold text-slate-900">{viewingExecution.providerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Recipient</span>
                  <span className="font-bold text-slate-900">{viewingExecution.recipientEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Expiration Date</span>
                  <span className="font-bold text-slate-900">{viewingExecution.expirationDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Delivery Status</span>
                  <span className="font-bold text-emerald-600 uppercase">{viewingExecution.deliveryStatus}</span>
                </div>
                {viewingExecution.resendId && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Resend Message ID</span>
                    <span className="font-mono text-slate-700">{viewingExecution.resendId}</span>
                  </div>
                )}
                {viewingExecution.errorMessage && (
                  <div className="col-span-2 text-rose-600">
                    <span className="text-rose-400 block text-[10px] uppercase font-semibold">Delivery Error</span>
                    <span>{viewingExecution.errorMessage}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">Rendered Email Subject:</span>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900">
                  {viewingExecution.emailSubject}
                </div>
              </div>

              {viewingExecution.emailBody && (
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Rendered Email Body Content:</span>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {viewingExecution.emailBody}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingExecution(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT RULE MODAL */}
      {isEditModalOpen && editingRule && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingRule.id ? 'Edit Automation Rule' : 'Create Automation Rule'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  value={editingRule.name || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  placeholder="e.g., 90-Day Advance Expiration Reminder"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={editingRule.eventType || 'CREDENTIAL_EXPIRATION'}
                    onChange={(e) => setEditingRule({ ...editingRule, eventType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                  >
                    <option value="CREDENTIAL_EXPIRATION">Credential Expiration</option>
                    <option value="RECREDENTIAL_DUE">Recredentialing Due</option>
                    <option value="LICENSE_EXPIRATION">License Expiration</option>
                    <option value="CAQH_REATTESTATION">CAQH Re-attestation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Table
                  </label>
                  <select
                    value={editingRule.targetType || 'credentialing_records'}
                    onChange={(e) => setEditingRule({ ...editingRule, targetType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                  >
                    <option value="credentialing_records">Credentialing Records</option>
                    <option value="clinical_staff">Clinical Staff / Providers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cadence (Days Before Expiration, comma separated)
                </label>
                <input
                  type="text"
                  value={editingRule.daysBefore?.join(', ') || ''}
                  onChange={(e) => {
                    const days = e.target.value
                      .split(',')
                      .map((d) => parseInt(d.trim(), 10))
                      .filter((n) => !isNaN(n));
                    setEditingRule({ ...editingRule, daysBefore: days });
                  }}
                  placeholder="90, 60, 30, 14, 7, 0"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: 90, 60, 30, 14, 7 (Enter 0 for day of expiration)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Roles
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    { id: 'assigned_specialist', label: 'Assigned Specialist' },
                    { id: 'manager', label: 'Credentialing Manager' },
                    { id: 'employee', label: 'Provider / Employee' },
                    { id: 'hr', label: 'HR Director' },
                  ].map((role) => {
                    const isSelected = editingRule.recipientRoles?.includes(role.id as any);
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          const currentRoles = editingRule.recipientRoles || [];
                          if (isSelected) {
                            setEditingRule({
                              ...editingRule,
                              recipientRoles: currentRoles.filter((r) => r !== role.id),
                            });
                          } else {
                            setEditingRule({
                              ...editingRule,
                              recipientRoles: [...currentRoles, role.id as any],
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-blue-50 text-[#2B4C9D] border-blue-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#2B4C9D]" />}
                        <span>{role.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Subject Template
                </label>
                <input
                  type="text"
                  required
                  value={editingRule.emailSubjectTemplate || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, emailSubjectTemplate: e.target.value })}
                  placeholder="Action Required: {{provider_name}} credential expires in {{days_remaining}} days"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Body Template (Variables: {'{{provider_name}}, {{payer_name}}, {{days_remaining}}, {{expiration_date}}'})
                </label>
                <textarea
                  rows={4}
                  value={editingRule.emailBodyTemplate || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, emailBodyTemplate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="rule-active-toggle"
                  checked={editingRule.isActive ?? true}
                  onChange={(e) => setEditingRule({ ...editingRule, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-[#2B4C9D] focus:ring-[#2B4C9D]"
                />
                <label htmlFor="rule-active-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Rule is active and will evaluate automatically during scheduled runs
                </label>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Automation Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
