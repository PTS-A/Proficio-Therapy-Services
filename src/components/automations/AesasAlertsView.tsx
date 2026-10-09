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
  Info,
  Edit3,
  Save,
  RotateCcw,
  Copy,
  Check,
  Eye,
  Code2,
  X,
  ChevronDown,
  ChevronUp
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
  id?: string;
  code: string;
  name: string;
  to?: string;
  cc?: string;
  subject: string;
  body?: string;
  purpose?: string;
  description?: string;
  updatedAt?: string;
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
  const [ccRoster, setCcRoster] = useState<string[]>([]);
  const [newCcEmail, setNewCcEmail] = useState('');
  const [isSavingCc, setIsSavingCc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Template Editor State
  const [editingTemplate, setEditingTemplate] = useState<AesasTemplate | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    subject: string;
    cc: string;
    body: string;
    description: string;
  }>({ name: '', subject: '', cc: '', body: '', description: '' });
  const [editorTab, setEditorTab] = useState<'editor' | 'preview'>('editor');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isResettingTemplate, setIsResettingTemplate] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [expandedPreviewCode, setExpandedPreviewCode] = useState<string | null>(null);

  // Merge tag variables catalogue per template type
  const TEMPLATE_VARIABLES: Record<string, { tag: string; label: string }[]> = {
    onboarding: [
      { tag: '{employee_name}', label: 'Employee Full Name' },
      { tag: '{employee_email}', label: 'Primary Login Email' },
      { tag: '{role_title}', label: 'Assigned System Role' },
      { tag: '{entity_name}', label: 'Operating Entity' },
      { tag: '{temporary_password}', label: 'Initial Password' },
      { tag: '{portal_url}', label: 'Access Portal URL' },
    ],
    pending_reminder: [
      { tag: '{employee_name}', label: 'Clinician Name' },
      { tag: '{payer_name}', label: 'Insurance Payer' },
      { tag: '{entity_name}', label: 'Operating Entity' },
      { tag: '{location_name}', label: 'Clinic Location' },
      { tag: '{reminder_datetime}', label: 'Scheduled Alert Date/Time' },
      { tag: '{days_pending}', label: 'Days Pending Count' },
      { tag: '{responsible_person}', label: 'Coordinator in Charge' },
    ],
    recredentialing: [
      { tag: '{employee_name}', label: 'Clinician Name' },
      { tag: '{npi_number}', label: 'Type 1 NPI Number' },
      { tag: '{payer_name}', label: 'Insurance Payer' },
      { tag: '{entity_name}', label: 'Operating Entity' },
      { tag: '{expiration_date}', label: 'Expiration Date' },
      { tag: '{recred_cycle_stage}', label: 'Cycle Stage (30d/7d/Daily)' },
    ],
    test: [
      { tag: '{current_timestamp}', label: 'Dispatch Timestamp' },
      { tag: '{admin_name}', label: 'Target Admin Name' },
      { tag: '{admin_email}', label: 'Target Admin Email' },
    ],
  };

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

  const handleOpenEdit = (tpl: AesasTemplate) => {
    setEditingTemplate(tpl);
    setEditForm({
      name: tpl.name || '',
      subject: tpl.subject || '',
      cc: tpl.cc || '',
      body: tpl.body || '',
      description: tpl.description || tpl.purpose || '',
    });
    setEditorTab('editor');
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    if (!editForm.name.trim() || !editForm.subject.trim()) {
      addToast('Template name and subject cannot be empty.', 'error');
      return;
    }
    setIsSavingTemplate(true);
    try {
      const targetId = editingTemplate.id || editingTemplate.code;
      const res = await fetch(`/api/aesas/templates/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update template');
      }
      setTemplates((prev) =>
        prev.map((t) => (t.id === targetId || t.code === targetId ? { ...t, ...data.template } : t))
      );
      addToast(`Template "${editForm.name}" updated successfully!`, 'success');
      setEditingTemplate(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to update template', 'error');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleResetTemplate = async () => {
    if (!editingTemplate) return;
    if (!window.confirm(`Reset template "${editingTemplate.name}" to its original factory default?`)) {
      return;
    }
    setIsResettingTemplate(true);
    try {
      const targetId = editingTemplate.id || editingTemplate.code;
      const res = await fetch(`/api/aesas/templates/${targetId}/reset`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reset template');
      }
      setTemplates((prev) =>
        prev.map((t) => (t.id === targetId || t.code === targetId ? { ...t, ...data.template } : t))
      );
      setEditForm({
        name: data.template.name || '',
        subject: data.template.subject || '',
        cc: data.template.cc || '',
        body: data.template.body || '',
        description: data.template.description || '',
      });
      addToast('Template reset to factory default!', 'info');
    } catch (err: any) {
      addToast(err.message || 'Failed to reset template', 'error');
    } finally {
      setIsResettingTemplate(false);
    }
  };

  const handleCopyTag = (tag: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(tag).catch(() => {});
    }
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1800);
  };

  const handleInsertTag = (tag: string) => {
    setEditForm((prev) => ({
      ...prev,
      body: prev.body + (prev.body.endsWith(' ') || prev.body.endsWith('\n') ? '' : ' ') + tag,
    }));
    handleCopyTag(tag);
  };

  const getRenderedPreview = (subject: string, body: string) => {
    const sampleData: Record<string, string> = {
      '{employee_name}': 'Dr. Jennifer Martinez, BCBA-D',
      '{employee_email}': 'jennifer.martinez@ageslearningsolutions.com',
      '{role_title}': 'Lead Clinical Supervisor',
      '{entity_name}': 'AGES Learning Solutions',
      '{location_name}': 'San Jose Regional Clinic (Suite 200)',
      '{payer_name}': 'Kaiser Permanente Northern California',
      '{temporary_password}': 'Proficio#2026!Sec',
      '{portal_url}': 'https://credentialing.ageslearningsolutions.com/login',
      '{expiration_date}': '2026-12-31',
      '{recred_cycle_stage}': '30-Day Advance Advisory',
      '{reminder_datetime}': '2026-10-15 08:00 AM PST',
      '{days_pending}': '42',
      '{responsible_person}': 'Marcus Chen (Credentialing Lead)',
      '{npi_number}': '1982736450',
      '{current_timestamp}': new Date().toLocaleString(),
      '{admin_name}': currentAccount?.name || 'System Administrator',
      '{admin_email}': currentAccount?.email || 'admin@proficiotherapy.com',
    };

    let renderedSub = subject;
    let renderedBody = body;
    for (const [tag, val] of Object.entries(sampleData)) {
      renderedSub = renderedSub.replaceAll(tag, val);
      renderedBody = renderedBody.replaceAll(tag, val);
    }
    return { subject: renderedSub, body: renderedBody };
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
            Sender: <strong className="text-slate-600">{status?.senderEmail || 'mail@credentialing.ageslearningsolutions.com'}</strong>
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

            {ccRoster.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">No Preprogrammed CC Recipients</p>
                <p className="text-[11px] text-slate-400">
                  Preprogrammed emails have been removed. Only email addresses explicitly added by an administrator or developer will receive automated carbon copies.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
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
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm('Clear all emails from the CC distribution roster?')) {
                        setCcRoster([]);
                        try {
                          await fetch('/api/aesas/cc-roster', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ccRoster: [] }),
                          });
                          addToast('All CC recipients cleared.', 'info');
                        } catch {}
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear All ({ccRoster.length})
                  </button>
                </div>
              </div>
            )}

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
              <span className="text-[11px] font-semibold text-[#2B4C9D] bg-blue-50 px-2 py-0.5 rounded-md">
                Customizable &bull; Live Resend Engine
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Select any notification template below to customize its subject line, email copy, and routing merge tags. Changes apply instantly to all live automations.
            </p>

            <div className="space-y-3">
              {templates.map((tpl) => {
                const isExpanded = expandedPreviewCode === tpl.code;
                const variables = TEMPLATE_VARIABLES[tpl.code] || [];
                return (
                  <div
                    key={tpl.code}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="font-bold text-slate-900 truncate text-[13px]">{tpl.name}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#2B4C9D] font-bold shrink-0">
                          {tpl.code}
                        </span>
                        {tpl.updatedAt && (
                          <span className="hidden sm:inline-block text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded shrink-0">
                            Customized
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpandedPreviewCode(isExpanded ? null : tpl.code)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
                          title="Toggle inline body preview"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>{isExpanded ? 'Hide' : 'Preview'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(tpl)}
                          className="px-3 py-1 bg-[#2B4C9D] hover:bg-[#223E80] text-white rounded-lg text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Template</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">{tpl.purpose || tpl.description}</p>

                    <div className="text-[11px] text-slate-500 font-sans bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <span className="font-semibold text-slate-700 shrink-0">Subject:</span>
                        <span className="text-slate-800 font-medium break-all">{tpl.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                        <span><strong>To:</strong> {tpl.to || '{employee_email}'}</span>
                        <span>&bull;</span>
                        <span><strong>CC:</strong> {tpl.cc ? tpl.cc : (tpl.code === 'onboarding' ? 'Confidential (Excluded from CC)' : 'Programmed CC Roster')}</span>
                      </div>
                    </div>

                    {/* Inline Expandable Body Preview */}
                    {isExpanded && (
                      <div className="pt-1.5 border-t border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                          <span>Template Body Content:</span>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(tpl)}
                            className="text-[#2B4C9D] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Modify this copy</span>
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto custom-scrollbar border border-slate-800">
                          {tpl.body || '(Empty body)'}
                        </pre>
                        {variables.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] text-slate-400 font-semibold self-center">Merge Tags:</span>
                            {variables.map((v) => (
                              <span
                                key={v.tag}
                                className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono text-[10px]"
                                title={v.label}
                              >
                                {v.tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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

      {/* Edit AESAS Notification Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2B4C9D]/10 text-[#2B4C9D] flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">Edit Notification Template</h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#2B4C9D] font-bold">
                      {editingTemplate.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Customize email copy, subject lines, and dynamic merge tags dispatched by AESAS
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Mode Switcher */}
                <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditorTab('editor')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                      editorTab === 'editor'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                      editorTab === 'preview'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Live Preview</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {editorTab === 'editor' ? (
                <div className="space-y-4">
                  {/* Template Name & Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Template Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                        placeholder="e.g. 1. Onboarding to System"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">System Code</label>
                      <input
                        type="text"
                        value={editingTemplate.code}
                        disabled
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700">Email Subject Line</label>
                      <span className="text-[10px] text-slate-400">Supports merge tags like &#123;employee_name&#125;</span>
                    </div>
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-sans"
                      placeholder="Email subject..."
                    />
                  </div>

                  {/* CC Addresses */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700">Carbon Copy (CC) Recipients</label>
                      <span className="text-[10px] text-slate-400">Comma-separated email addresses</span>
                    </div>
                    <input
                      type="text"
                      value={editForm.cc}
                      onChange={(e) => setEditForm({ ...editForm, cc: e.target.value })}
                      disabled={editingTemplate.code === 'onboarding'}
                      className={`w-full px-3 py-2 border rounded-xl text-xs ${
                        editingTemplate.code === 'onboarding'
                          ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20'
                      }`}
                      placeholder={editingTemplate.code === 'onboarding' ? 'Excluded from CC (confidential credentials notice)' : 'e.g. credentialing-head@proficiotherapy.com, compliance@proficiotherapy.com'}
                    />
                    {editingTemplate.code === 'onboarding' && (
                      <p className="text-[10px] text-amber-600">
                        Notice: Onboarding credentials contain temporary passwords and are dispatched strictly to the recipient only per security policy.
                      </p>
                    )}
                  </div>

                  {/* Merge Tags Quick Selector */}
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#2B4C9D] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Dynamic Merge Tags (Click to Insert into Body &bull; Copies to Clipboard)</span>
                      </span>
                      {copiedTag && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded animate-fadeIn">
                          Copied &amp; Inserted {copiedTag}!
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(TEMPLATE_VARIABLES[editingTemplate.code] || []).map((v) => (
                        <button
                          key={v.tag}
                          type="button"
                          onClick={() => handleInsertTag(v.tag)}
                          className="px-2 py-1 bg-white hover:bg-blue-100/70 border border-blue-200 rounded-lg text-[11px] font-mono text-[#2B4C9D] font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-2xs hover:scale-102"
                          title={`Click to insert ${v.label}`}
                        >
                          <span>{v.tag}</span>
                          <span className="text-[9px] font-sans text-slate-500 font-normal">({v.label})</span>
                          {copiedTag === v.tag ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 text-blue-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700">Email Message Body</label>
                      <span className="text-[10px] text-slate-400">{editForm.body.length} characters &bull; Text / Markdown Format</span>
                    </div>
                    <textarea
                      rows={12}
                      value={editForm.body}
                      onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                      className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/50 custom-scrollbar whitespace-pre"
                      placeholder="Email body copy..."
                    />
                  </div>

                  {/* Template Description */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Template Description / Trigger Note</label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                      placeholder="Brief note about when this email is sent..."
                    />
                  </div>
                </div>
              ) : (
                /* Live Preview Mode */
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800 mb-0.5">Sample Rendered Preview</p>
                    <p className="text-[11px] text-slate-500">
                      This shows how your email will appear to clinical and administrative recipients with mock employee and credentialing details substituted.
                    </p>
                  </div>

                  {/* Rendered Email Client Mockup */}
                  {(() => {
                    const rendered = getRenderedPreview(editForm.subject, editForm.body);
                    return (
                      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden text-xs">
                        {/* Email Header */}
                        <div className="p-4 bg-slate-100/80 border-b border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-slate-800">
                            <div>
                              <strong className="text-slate-900">From:</strong> AGES &amp; Proficio Credentialing &lt;mail@credentialing.ageslearningsolutions.com&gt;
                            </div>
                            <span className="text-[10px] text-slate-400">Via Resend API</span>
                          </div>
                          <div className="text-slate-700">
                            <strong className="text-slate-900">To:</strong> dr.jennifer.martinez@ageslearningsolutions.com
                          </div>
                          {editForm.cc && editingTemplate.code !== 'onboarding' && (
                            <div className="text-slate-600 text-[11px]">
                              <strong className="text-slate-900">CC:</strong> {editForm.cc}
                            </div>
                          )}
                          <div className="pt-2 text-[13px] font-bold text-slate-900 border-t border-slate-200/60">
                            Subject: {rendered.subject}
                          </div>
                        </div>

                        {/* Email Body */}
                        <div className="p-5 font-sans leading-relaxed text-slate-800 whitespace-pre-wrap bg-white">
                          {rendered.body}
                        </div>

                        {/* Email Footer Disclaimer */}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                          Confidential Medical Credentialing Notice &bull; HIPAA &sect;164.530 &bull; Automated Email Sending Alert System (AESAS)
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
              <button
                type="button"
                onClick={handleResetTemplate}
                disabled={isResettingTemplate || isSavingTemplate}
                className="px-3 py-1.5 text-slate-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                title="Restore default template text"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResettingTemplate ? 'animate-spin' : ''}`} />
                <span>{isResettingTemplate ? 'Resetting...' : 'Reset to Default'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  disabled={isSavingTemplate}
                  className="px-4 py-1.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  disabled={isSavingTemplate || !editForm.name.trim() || !editForm.subject.trim()}
                  className="px-5 py-1.5 bg-[#2B4C9D] hover:bg-[#223E80] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingTemplate ? 'Saving Changes...' : 'Save Template'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AesasAlertsView;
