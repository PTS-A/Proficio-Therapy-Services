import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Mail, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Play, 
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { isAdminAccount, isDeveloper } from '../../utils/rbac';

interface AesasStatus {
  service: string;
  resendConfigured: boolean;
  resendApiKeySet: boolean;
  mode: 'live' | 'simulation';
  senderEmail: string;
  queueSize: number;
  totalSent: number;
  totalFailed: number;
  lastCheckTimestamp: string;
}

interface AesasTemplate {
  code: string;
  name: string;
  purpose?: string;
  description?: string;
  subject: string;
  variables?: string[];
}

interface AesasQueueItem {
  id: string;
  templateCode: string;
  recipientEmail: string;
  subject: string;
  scheduledDate: string;
  scheduledTime: string;
  employeeId?: string;
  employeeName?: string;
  payerId?: string;
  payerName?: string;
  entityId?: string;
  responsiblePerson?: string;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  lastAttemptAt?: string;
  error?: string;
}

export const AesasAlertsView: React.FC = () => {
  const { currentAccount, addToast } = useCredentialing();
  const isDevOrAdmin = isDeveloper(currentAccount) || isAdminAccount(currentAccount);

  const [status, setStatus] = useState<AesasStatus | null>(null);
  const [templates, setTemplates] = useState<AesasTemplate[]>([]);
  const [queue, setQueue] = useState<AesasQueueItem[]>([]);
  const [ccRoster, setCcRoster] = useState<string[]>([
    'credentialing-head@proficiotherapy.com',
    'admin@proficiotherapy.com',
    'superadmin@proficiotherapy.com',
    'manager@proficiotherapy.com',
  ]);
  const [newCcEmail, setNewCcEmail] = useState('');
  const [isSavingCc, setIsSavingCc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Test form state
  const [testTemplateCode, setTestTemplateCode] = useState<string>('pending_reminder');
  const [testRecipientEmail, setTestRecipientEmail] = useState<string>(
    currentAccount?.email || 'credentialing@proficiotherapy.com'
  );
  const [testEmployeeName, setTestEmployeeName] = useState<string>('Ashley Vanderbilt, BCBA');
  const [testPayerName, setTestPayerName] = useState<string>('Blue Shield of California');

  // Load AESAS data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resStatus, resTemplates, resQueue, resCc] = await Promise.all([
        fetch('/api/aesas/status').then((r) => r.json()).catch(() => null),
        fetch('/api/aesas/templates').then((r) => r.json()).catch(() => ({ templates: [] })),
        fetch('/api/aesas/queue').then((r) => r.json()).catch(() => ({ queue: [] })),
        fetch('/api/aesas/cc-roster').then((r) => r.json()).catch(() => null),
      ]);

      if (resStatus) setStatus(resStatus);
      if (resTemplates?.templates) setTemplates(resTemplates.templates);
      if (resQueue?.queue) setQueue(resQueue.queue);
      if (resCc?.ccRoster && Array.isArray(resCc.ccRoster)) setCcRoster(resCc.ccRoster);
    } catch (err) {
      console.warn('Failed to load AESAS data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCcEmail = async () => {
    const emailToAdd = newCcEmail.trim().toLowerCase();
    if (!emailToAdd || !emailToAdd.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    if (ccRoster.includes(emailToAdd)) {
      addToast('Email is already on the CC roster.', 'info');
      return;
    }
    const updated = [...ccRoster, emailToAdd];
    setCcRoster(updated);
    setNewCcEmail('');
    await persistCcRoster(updated);
  };

  const handleRemoveCcEmail = async (emailToRemove: string) => {
    const updated = ccRoster.filter(e => e.toLowerCase() !== emailToRemove.toLowerCase());
    setCcRoster(updated);
    await persistCcRoster(updated);
  };

  const persistCcRoster = async (roster: string[]) => {
    setIsSavingCc(true);
    try {
      const res = await fetch('/api/aesas/cc-roster', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ccRoster: roster }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Programmed CC roster updated successfully.', 'success');
      } else {
        addToast('Notice: CC roster updated locally.', 'info');
      }
    } catch (err) {
      addToast('Notice: CC roster updated locally.', 'info');
    } finally {
      setIsSavingCc(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Dispatch queue now
  const handleProcessQueue = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/aesas/process', { method: 'POST' });
      const data = await res.json();
      addToast(`AESAS Queue Processed: ${data.processedCount || 0} alerts dispatched via Resend.`, 'success');
      await loadData();
    } catch (err: any) {
      addToast(err.message || 'Failed to process AESAS queue', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Dispatch 1st of month expiration digest
  const handleTriggerMonthlyDigest = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/aesas/expirations/digest', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        addToast('AESAS Monthly Expirations Digest dispatched to all active staff and programmed CC roster via Resend!', 'success');
        await loadData();
      } else {
        addToast(data.error || 'Failed to dispatch digest', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to dispatch digest', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Send Test Email
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipientEmail.trim()) {
      addToast('Please enter a recipient email.', 'error');
      return;
    }

    setIsSendingTest(true);
    try {
      const payload = {
        templateCode: testTemplateCode,
        recipientEmail: testRecipientEmail.trim(),
        employeeName: testEmployeeName.trim(),
        payerName: testPayerName.trim(),
        responsiblePerson: currentAccount?.name || 'Credentialing Specialist',
      };

      const res = await fetch('/api/aesas/test-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        addToast(
          `Test email dispatched via Resend API to ${testRecipientEmail}! Message ID: ${data.messageId || 'SENT'}`,
          'success'
        );
      } else {
        addToast(data.error || 'Failed to dispatch email', 'error');
      }
      await loadData();
    } catch (err: any) {
      addToast(err.message || 'Error sending test email', 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  // Delete / Cancel queue item
  const handleDeleteQueueItem = async (itemId: string) => {
    try {
      await fetch(`/api/aesas/queue/${itemId}`, { method: 'DELETE' });
      addToast('Alert item removed from AESAS queue.', 'info');
      setQueue((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      addToast('Failed to cancel alert', 'error');
    }
  };

  // Clear Entire AESAS Queue
  const handleClearEntireQueue = async () => {
    try {
      const res = await fetch('/api/aesas/queue', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setQueue([]);
        addToast('All scheduled emails cleared from AESAS queue.', 'success');
        await loadData();
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to clear AESAS queue', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-blue-50 text-[#2B4C9D] rounded-2xl">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                AESAS &bull; Automated Email Sending Alert System
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Enterprise notification engine powered by the Resend API. Automatically dispatches pending reminder alerts, re-credentialing warnings, and onboarding notices.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh AESAS telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {isDevOrAdmin && (
            <>
              <button
                onClick={handleTriggerMonthlyDigest}
                disabled={isProcessing}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                title="Dispatches the 1st of month expiration digest via AESAS"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Monthly Digest</span>
              </button>

              <button
                onClick={handleProcessQueue}
                disabled={isProcessing}
                className="px-4 py-2.5 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isProcessing ? 'Processing Queue...' : 'Dispatch Queue Now'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Engine Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Engine Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Resend API Pipeline</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              status?.resendConfigured ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-[#2B4C9D]'
            }`}>
              {status?.mode === 'live' ? 'LIVE (Resend API)' : 'ACTIVE (Simulated/Dev)'}
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {status?.resendConfigured ? 'Connected' : 'Ready'}
          </div>
          <p className="text-[11px] text-slate-400">
            Sender: <strong className="text-slate-600">{status?.senderEmail || 'alerts@credentialing.proficiotherapy.com'}</strong>
          </p>
        </div>

        {/* Card 2: Queued Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending in Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600">
            {queue.filter((q) => q.status === 'pending').length} Alerts
          </div>
          <p className="text-[11px] text-slate-400">Scheduled for automated delivery</p>
        </div>

        {/* Card 3: Successfully Dispatched */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Dispatched Emails</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600">
            {status?.totalSent || queue.filter((q) => q.status === 'sent').length} Sent
          </div>
          <p className="text-[11px] text-slate-400">Verified by Resend mail server</p>
        </div>

        {/* Card 4: Daily Retry Logic */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Automation Rule</span>
            <Zap className="w-4 h-4 text-[#E86424]" />
          </div>
          <div className="text-base font-bold text-slate-900">
            Daily Auto-Resend
          </div>
          <p className="text-[11px] text-slate-400">Repeats every morning until approved</p>
        </div>
      </div>

      {/* Grid: Templates and Live Test Trigger (Admin & Dev Profile Only) */}
      {isDevOrAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Test Trigger Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4 text-[#2B4C9D]" />
              <h2 className="text-sm font-bold text-slate-900">
                Trigger Live Test Email via Resend
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Resend Sandbox
            </span>
          </div>

          <form onSubmit={handleSendTestEmail} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Email Template:
              </label>
              <select
                value={testTemplateCode}
                onChange={(e) => setTestTemplateCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-medium"
              >
                <option value="pending_reminder">Pending Insurance Reminder (Daily Alert)</option>
                <option value="onboarding_welcome">Clinician Onboarding &amp; Document Intake</option>
                <option value="recredentialing_due">Re-credentialing &amp; Expiration Notice</option>
                <option value="test_alert">System Diagnostics Test Alert</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Recipient Specialist / Clinician Email:
              </label>
              <input
                type="email"
                required
                value={testRecipientEmail}
                onChange={(e) => setTestRecipientEmail(e.target.value)}
                placeholder="credentialing@proficiotherapy.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Employee Name:
                </label>
                <input
                  type="text"
                  value={testEmployeeName}
                  onChange={(e) => setTestEmployeeName(e.target.value)}
                  placeholder="e.g. Ashley Vanderbilt, BCBA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payer / Insurance:
                </label>
                <input
                  type="text"
                  value={testPayerName}
                  onChange={(e) => setTestPayerName(e.target.value)}
                  placeholder="e.g. Blue Shield CA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">Resend Engine Integration:</div>
              <p>Dispatches through Resend REST API endpoints with HTML template styling, professional branding, and real-time deliverability logs.</p>
            </div>

            <button
              type="submit"
              disabled={isSendingTest}
              className="w-full py-2.5 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingTest ? 'Dispatching via Resend...' : 'Send Test Alert Now'}</span>
            </button>
          </form>
        </div>

        {/* Templates & CC Roster Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Programmed CC Roster Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#2B4C9D]" />
                <h2 className="text-sm font-bold text-slate-900">
                  Programmed CC Distribution Roster ({ccRoster.length} Active)
                </h2>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Auto-CC on Alerts &amp; Digests
              </span>
            </div>

            <p className="text-xs text-slate-500">
              These verified email addresses are automatically carbon-copied on all AESAS monthly expiration digests, daily 7-day countdown notices, and individual re-credentialing alerts.
            </p>

            <div className="flex flex-wrap gap-2">
              {ccRoster.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-xs font-medium text-[#2B4C9D]"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCcEmail(email)}
                    disabled={isSavingCc}
                    className="text-blue-400 hover:text-rose-600 transition-colors cursor-pointer text-xs ml-0.5 font-bold"
                    title="Remove from CC roster"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="email"
                value={newCcEmail}
                onChange={(e) => setNewCcEmail(e.target.value)}
                placeholder="Add compliance email (e.g. lead@proficiotherapy.com)..."
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCcEmail();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCcEmail}
                disabled={isSavingCc || !newCcEmail.trim()}
                className="px-3.5 py-1.5 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                Add to CC
              </button>
            </div>
          </div>

          {/* Templates Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#2B4C9D]" />
              <h2 className="text-sm font-bold text-slate-900">
                Pre-Configured AESAS Notification Templates (4 Templates)
              </h2>
            </div>
            <span className="text-xs text-slate-400">Automated HTML formatting</span>
          </div>

          <div className="space-y-3">
            {templates.map((tpl) => (
              <div
                key={tpl.code}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{tpl.name}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#2B4C9D] font-bold">
                    {tpl.code}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{tpl.purpose || tpl.description}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Subject: <span className="text-slate-700 font-sans font-medium">{tpl.subject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Scheduled Alert Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#2B4C9D]" />
            <h3 className="text-sm font-bold text-slate-900">
              AESAS Scheduled Alerts Queue ({queue.length} Total Items)
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            {queue.length > 0 && (
              <button
                onClick={handleClearEntireQueue}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Scheduled Emails</span>
              </button>
            )}
            <span className="text-xs text-slate-400">
              Reminders registered by credentialing leads from the Clinical Staff portal
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Template / Subject</th>
                <th className="py-3 px-4">Clinician &amp; Payer</th>
                <th className="py-3 px-4">Scheduled Date &amp; Time</th>
                <th className="py-3 px-4">Recipient Email</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No scheduled alerts in the queue. Mark an insurance as <strong>Pending</strong> in the Clinical Staff portal to schedule automated alerts.
                  </td>
                </tr>
              ) : (
                queue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 truncate max-w-[220px]">{item.subject}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.templateCode}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.employeeName || 'Clinician'}</div>
                      <div className="text-[11px] text-slate-500">{item.payerName || 'Insurance'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.scheduledDate}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.scheduledTime}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                      {item.recipientEmail}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'sent'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'failed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteQueueItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Cancel Alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AesasAlertsView;
