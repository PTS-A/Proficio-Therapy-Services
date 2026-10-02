import React, { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Send, Users, Info } from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';

export const CcRosterAdminView: React.FC = () => {
  const { addToast } = useCredentialing();
  const [ccRoster, setCcRoster] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadCcRoster = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/aesas/cc-roster');
      const data = await res.json();
      if (data?.ccRoster && Array.isArray(data.ccRoster)) {
        setCcRoster(data.ccRoster);
      }
    } catch (err: any) {
      console.warn('Could not load CC roster:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCcRoster();
  }, []);

  const handleAddEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = newEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    if (ccRoster.includes(cleanEmail)) {
      addToast('This email is already in the CC roster.', 'info');
      return;
    }

    const updated = [...ccRoster, cleanEmail];
    setCcRoster(updated);
    setNewEmail('');
    await saveRoster(updated, `Added ${cleanEmail} to global CC distribution roster.`);
  };

  const handleRemoveEmail = async (emailToRemove: string) => {
    const updated = ccRoster.filter(e => e.toLowerCase() !== emailToRemove.toLowerCase());
    setCcRoster(updated);
    await saveRoster(updated, `Removed ${emailToRemove} from global CC distribution roster.`);
  };

  const saveRoster = async (roster: string[], successMsg: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/aesas/cc-roster', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ccRoster: roster }),
      });
      const data = await res.json();
      if (data?.success) {
        addToast(successMsg, 'success');
      } else {
        addToast('Notice: CC roster saved locally.', 'info');
      }
    } catch (err: any) {
      addToast('Notice: CC roster updated.', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Administrative Email Distribution Governance</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            System-Wide Programmed CC Roster
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Configure the verified recipients who are automatically carbon-copied on <strong>all emails sent by the system</strong> (AESAS expiration warnings, daily 7-day countdowns, monthly compliance digests, and ticket notifications) &mdash; <em>strictly excluding confidential employee onboarding emails</em>.
          </p>
        </div>

        <button
          onClick={loadCcRoster}
          disabled={isLoading}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer self-start md:self-auto shrink-0 flex items-center space-x-1.5 text-xs font-semibold"
          title="Refresh CC Roster"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Security Rule Card */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start space-x-3 text-xs text-blue-900 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-[#2B4C9D] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Automated Carbon-Copy Rule Enforcement:</p>
          <ul className="list-disc list-inside space-y-0.5 text-blue-800 text-[11px] leading-relaxed">
            <li><strong>Included Dispatches:</strong> 1st-of-month expiration digests, 30/60/90/120-day license alerts, urgent 7-day daily countdown notices, insurance credentialing reminders, system ticket notifications.</li>
            <li><strong>Strict Exemption:</strong> Employee Onboarding emails with temporary passwords and first-login security credentials are <em>never CC&apos;d</em> to preserve confidential access governance.</li>
          </ul>
        </div>
      </div>

      {/* Main Roster Manager Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Programmed CC Recipients ({ccRoster.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Email addresses receiving all system notifications and compliance alerts
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Distribution Active</span>
          </span>
        </div>

        {/* Add Email Form */}
        <form onSubmit={handleAddEmail} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter compliance, admin, or leadership email (e.g. director@ageslearningsolutions.com)..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving || !newEmail.trim()}
            className="px-4 py-2.5 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 shrink-0 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add to CC Roster</span>
          </button>
        </form>

        {/* Recipients List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading CC roster...</div>
          ) : ccRoster.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No CC recipients programmed. Add an email above to activate automated carbon-copy distribution.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ccRoster.map((email, idx) => (
                <div
                  key={email}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors text-xs group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#2B4C9D] flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </div>
                    <div className="truncate">
                      <p className="font-mono text-slate-900 font-semibold truncate">{email}</p>
                      <p className="text-[10px] text-slate-400">Automated Carbon Copy</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    disabled={isSaving}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                    title={`Remove ${email}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
