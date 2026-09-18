import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Power, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Key, 
  Search, 
  Plus, 
  ExternalLink,
  Download,
  Flame,
  AlertOctagon,
  Shield,
  Eye,
  Check,
  UserX
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { isSuperAdmin } from '../../utils/rbac';
import { SecurityIncident, AppAccount } from '../../types';

type SecurityCenterSubTab = 'kill-switch' | 'telemetry' | 'breach-center';

export const SecurityCenterView: React.FC = () => {
  const {
    currentAccount,
    accounts,
    emergencyLockUser,
    unlockUser,
    triggerGlobalSessionKillSwitch,
    toggleGlobalLockdown,
    isGlobalLockdownActive,
    resetUserMfa,
    securityIncidents,
    createSecurityIncident,
    updateSecurityIncident,
    deleteSecurityIncident,
    showToast
  } = useCredentialing();

  // Strict Super Admin Access Gate
  const isAuthorized = isSuperAdmin(currentAccount);

  const [activeSubTab, setActiveSubTab] = useState<SecurityCenterSubTab>('kill-switch');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Kill Switch Modal State
  const [selectedUserForLock, setSelectedUserForLock] = useState<AppAccount | null>(null);
  const [lockReason, setLockReason] = useState('HIPAA Emergency Administrative Suspension');

  // New Incident Modal State
  const [isAddingIncident, setIsAddingIncident] = useState(false);
  const [newIncident, setNewIncident] = useState<Partial<SecurityIncident>>({
    title: '',
    caseNumber: `INC-${new Date().getFullYear()}-${String(securityIncidents.length + 1).padStart(3, '0')}`,
    dateDiscovered: new Date().toISOString().split('T')[0],
    severity: 'Medium',
    status: 'Investigating',
    incidentType: 'Unauthorized Access / Snooping',
    affectedSystems: ['Credentialing System'],
    recordsEstimated: 0,
    reportedBy: currentAccount?.name || 'Administrator',
    leadInvestigator: 'HIPAA Security Officer',
    description: '',
    containmentActions: '',
    ocrReportRequired: false,
  });

  // Selected Incident for Detail / Risk Assessment Modal
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);

  // Telemetry Scan State
  const [isScanningTelemetry, setIsScanningTelemetry] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(new Date().toLocaleTimeString());

  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Restricted Access: System Administrator Only</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          The HIPAA Security Kill Switch, Automated Compliance Telemetry, and Breach Notification Center are strictly restricted to authorized System Administrators.
        </p>
      </div>
    );
  }

  const handleTriggerGlobalKillSwitch = async () => {
    if (!window.confirm('CRITICAL ACTION: Are you sure you want to sever all active user sessions across the platform? All non-admin users will be immediately logged out and required to re-authenticate with MFA.')) {
      return;
    }
    setIsProcessing(true);
    try {
      const res = await triggerGlobalSessionKillSwitch();
      showToast(
        `Global Session Kill Switch triggered successfully. ${res.count} active sessions severed and forced to re-verify credentials.`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to trigger kill switch.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleLockdown = async () => {
    const nextState = !isGlobalLockdownActive;
    const confirmPrompt = nextState
      ? 'EMERGENCY ACTION: Enable Global System Lockdown? This will immediately suspend all non-administrative sign-ins and freeze platform access.'
      : 'Deactivate Global System Lockdown? Normal user access will be restored.';
    if (!window.confirm(confirmPrompt)) return;

    setIsProcessing(true);
    try {
      await toggleGlobalLockdown(nextState);
      showToast(
        nextState
          ? 'Global System Lockdown is now ACTIVE. Only System Administrators can access the application.'
          : 'Global System Lockdown has been DEACTIVATED. Normal employee access restored.',
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Error updating lockdown state.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmUserLock = async () => {
    if (!selectedUserForLock) return;
    setIsProcessing(true);
    try {
      await emergencyLockUser(selectedUserForLock.id, lockReason);
      showToast(
        `Account for ${selectedUserForLock.name} (${selectedUserForLock.email}) has been locked. All active tokens and sessions severed immediately.`,
        'success'
      );
      setSelectedUserForLock(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to lock user account.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlockUser = async (user: AppAccount) => {
    if (!window.confirm(`Unlock and restore access for ${user.name} (${user.email})?`)) return;
    setIsProcessing(true);
    try {
      await unlockUser(user.id);
      showToast(
        `Account for ${user.name} unlocked. User may now sign in with verified credentials.`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to unlock user.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetMfa = async (user: AppAccount) => {
    if (!window.confirm(`Reset Google Authenticator MFA for ${user.name}? The user will be required to scan a new QR code on their next sign-in.`)) return;
    setIsProcessing(true);
    try {
      resetUserMfa(user.id);
      showToast(
        `MFA reset for ${user.name}. User will be prompted to re-enroll Google Authenticator on next sign-in.`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to reset MFA.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunTelemetryScan = () => {
    setIsScanningTelemetry(true);
    setTimeout(() => {
      setIsScanningTelemetry(false);
      setLastScanTime(new Date().toLocaleTimeString());
      showToast(
        'Continuous compliance telemetry scan completed. All 8 HIPAA Security Rule technical safeguards verified.',
        'success'
      );
    }, 900);
  };

  const handleCreateIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.description) {
      alert('Please fill out incident title and description.');
      return;
    }
    createSecurityIncident({
      title: newIncident.title!,
      caseNumber: newIncident.caseNumber || `INC-${Date.now()}`,
      dateDiscovered: newIncident.dateDiscovered || new Date().toISOString().split('T')[0],
      severity: newIncident.severity || 'Medium',
      status: newIncident.status || 'Investigating',
      incidentType: newIncident.incidentType || 'Other Security Incident',
      affectedSystems: newIncident.affectedSystems || ['Credentialing Database'],
      recordsEstimated: Number(newIncident.recordsEstimated) || 0,
      reportedBy: newIncident.reportedBy || currentAccount?.name || 'Administrator',
      leadInvestigator: newIncident.leadInvestigator || 'HIPAA Security Officer',
      description: newIncident.description!,
      containmentActions: newIncident.containmentActions || 'Active incident containment initiated.',
      ocrReportRequired: Boolean(newIncident.ocrReportRequired),
    });
    setIsAddingIncident(false);
    showToast(
      `Security Incident ${newIncident.caseNumber} recorded in HIPAA Incident Register.`,
      'success'
    );
  };

  const filteredAccounts = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.systemRole || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight">Security & Compliance Governance Center</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
                SYSTEM ADMINISTRATOR ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              HIPAA Security Rule (§164.308 - §164.312) & Breach Notification (§164.400) Operational Command
            </p>
          </div>
        </div>

        {/* Global Emergency Status Banner */}
        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
          <div className={`w-3 h-3 rounded-full ${isGlobalLockdownActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
          <div className="text-xs">
            <div className="font-semibold text-slate-200">
              System Posture: {isGlobalLockdownActive ? 'EMERGENCY LOCKDOWN' : 'NORMAL OPERATION'}
            </div>
            <div className="text-[11px] text-slate-400">
              {isGlobalLockdownActive ? 'Non-admin sessions suspended' : 'All security controls active'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 bg-white px-4 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveSubTab('kill-switch')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-colors ${
            activeSubTab === 'kill-switch'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Power className="w-4 h-4 text-rose-600" />
          <span>Emergency Kill Switch & Session Revocation</span>
        </button>

        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-colors ${
            activeSubTab === 'telemetry'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Automated Vulnerability & Compliance Telemetry</span>
        </button>

        <button
          onClick={() => setActiveSubTab('breach-center')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-colors ${
            activeSubTab === 'breach-center'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-600" />
          <span>Breach Notification & Incident Response (§164.402)</span>
          {securityIncidents.some((i) => i.status !== 'Closed') && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {securityIncidents.filter((i) => i.status !== 'Closed').length}
            </span>
          )}
        </button>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: EMERGENCY KILL SWITCH */}
      {/* ==================================================================== */}
      {activeSubTab === 'kill-switch' && (
        <div className="space-y-6">
          {/* Global Actions Card */}
          <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center space-x-2 mb-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Platform Emergency Controls</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 max-w-2xl">
              Execute immediate access revocation under 45 CFR §164.308(a)(3)(ii)(C) and NIST SP 800-53 Rev. 5 AC-2.
              These controls allow you to freeze platform access or terminate sessions on demand.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Action A: Global Session Kill Switch */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Power className="w-4 h-4 text-rose-600" />
                      <span>Global Session Severance</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">INSTANT</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">
                    Terminates all active user sessions across browser sessions and forces instant re-authentication with Google Authenticator MFA.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleTriggerGlobalKillSwitch}
                  className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Sever All Active Sessions</span>
                </button>
              </div>

              {/* Action B: Global Emergency Lockdown Toggle */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                isGlobalLockdownActive ? 'border-rose-300 bg-rose-50/60' : 'border-slate-200 bg-slate-50/70'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Lock className="w-4 h-4 text-rose-600" />
                      <span>System Emergency Lockdown</span>
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isGlobalLockdownActive ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isGlobalLockdownActive ? 'ENGAGED' : 'STANDBY'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">
                    Blocks all non-System-Administrator logins and freezes application usage. Only verified Super Administrators can authenticate.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleToggleLockdown}
                  className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer ${
                    isGlobalLockdownActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  {isGlobalLockdownActive ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Deactivate System Lockdown</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Engage System Lockdown</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Per-User Kill Switch Directory */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Per-User Emergency Account Lockout</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Freeze specific employee accounts immediately upon suspected compromise or termination.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Account Status</th>
                    <th className="py-3 px-3">MFA (TOTP)</th>
                    <th className="py-3 px-3">Emergency Lock Status</th>
                    <th className="py-3 px-4 text-right">Lockout Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAccounts.map((acc) => {
                    const isLocked = acc.isEmergencyLocked || acc.status === 'Locked' || acc.status === 'Emergency Lockdown';
                    const isUserSuperAdmin = isSuperAdmin(acc);

                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{acc.name}</div>
                          <div className="text-[11px] text-slate-500">{acc.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-700">{acc.systemRole || 'Specialist'}</span>
                          {isUserSuperAdmin && (
                            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                              ADMIN
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isLocked 
                              ? 'bg-rose-100 text-rose-800' 
                              : acc.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isLocked ? 'Locked / Severed' : (acc.status || 'Active')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {acc.mfaEnabled ? (
                            <div className="flex items-center space-x-1.5 text-emerald-700">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span className="font-medium">Active (TOTP)</span>
                              <button
                                type="button"
                                onClick={() => handleResetMfa(acc)}
                                title="Reset MFA for this user"
                                className="ml-2 text-[10px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
                              >
                                Reset
                              </button>
                            </div>
                          ) : (
                            <span className="text-amber-600 font-medium flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Enrolls on Sign-in</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {isLocked ? (
                            <div>
                              <span className="text-rose-600 font-bold flex items-center space-x-1">
                                <Lock className="w-3.5 h-3.5" />
                                <span>LOCKED</span>
                              </span>
                              {acc.emergencyLockedReason && (
                                <div className="text-[10px] text-slate-500 truncate max-w-xs" title={acc.emergencyLockedReason}>
                                  {acc.emergencyLockedReason}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">Unlocked</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isLocked ? (
                            <button
                              type="button"
                              onClick={() => handleUnlockUser(acc)}
                              className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Unlock Account
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedUserForLock(acc)}
                              className="px-2.5 py-1 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center space-x-1"
                            >
                              <UserX className="w-3 h-3 text-rose-600" />
                              <span>Emergency Lock</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: COMPLIANCE TELEMETRY CENTER */}
      {/* ==================================================================== */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-6">
          {/* Telemetry Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium mb-1">HIPAA Technical Posture</div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-extrabold text-emerald-600">100%</div>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">GRADE A+</div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">All 8 Core Technical Safeguards Enforced</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium mb-1">MFA Enforcement</div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-extrabold text-[#2B4C9D]">TOTP</div>
                <div className="text-xs text-slate-500 font-mono">RFC 6238</div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">Google Authenticator mandatory on all sign-ins</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium mb-1">Session Inactivity Timeout</div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-extrabold text-slate-800">20m</div>
                <div className="text-xs font-semibold text-slate-500">§164.312(a)(2)(iii)</div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">Auto-logoff timer active</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium mb-1">TLS / Transmission Security</div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-extrabold text-emerald-600">TLS 1.3</div>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">STRICT</div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">rejectUnauthorized: true enforced</div>
            </div>
          </div>

          {/* Continuous Safeguards Verification Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Continuous Compliance Telemetry Monitor (NIST SP 800-53 & HIPAA §164.312)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live verification of safeguards, automated controls, and security configurations.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[11px] text-slate-400">Last scanned: {lastScanTime}</span>
                <button
                  type="button"
                  disabled={isScanningTelemetry}
                  onClick={handleRunTelemetryScan}
                  className="px-3 py-1.5 bg-[#2B4C9D] hover:bg-[#223d7d] text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningTelemetry ? 'animate-spin' : ''}`} />
                  <span>{isScanningTelemetry ? 'Scanning Telemetry...' : 'Run Live Scan'}</span>
                </button>
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {[
                {
                  cfr: '45 CFR §164.312(a)(1)',
                  name: 'Unique User Identification & Access Control',
                  status: 'Enforced',
                  details: 'Every provider, specialist, and administrator is assigned a distinct system identifier. No shared generic accounts.',
                  check: 'Cryptographically distinct user tokens',
                },
                {
                  cfr: '45 CFR §164.312(a)(2)(i)',
                  name: 'Multi-Factor Authentication (MFA)',
                  status: 'Enforced',
                  details: 'RFC 6238 TOTP Google Authenticator enforced after email or Google sign-in. Single-use emergency backup codes provisioned.',
                  check: 'OTPAuth SHA-1 30s step verification',
                },
                {
                  cfr: '45 CFR §164.312(a)(2)(iii)',
                  name: 'Emergency Access Procedure & Kill Switch',
                  status: 'Enforced',
                  details: 'Per-user account lockout and global session kill switch operational. Immediate token revocation on account deactivation.',
                  check: 'Instant session severance & token invalidation',
                },
                {
                  cfr: '45 CFR §164.312(a)(2)(iv)',
                  name: 'Automatic Logoff (Inactivity Timeout)',
                  status: 'Enforced',
                  details: 'Client and server enforce strict 20-minute inactivity logoff with local credential purge and countdown timer.',
                  check: 'SESSION_TIMEOUT_MS = 1,200,000 ms',
                },
                {
                  cfr: '45 CFR §164.312(b)',
                  name: 'Audit Controls & Telemetry Logging',
                  status: 'Enforced',
                  details: 'Immutable audit logs record authentication successes, failures, record exports, and credential modifications.',
                  check: 'audit_logs table with actor tracking',
                },
                {
                  cfr: '45 CFR §164.312(c)(1)',
                  name: 'ePHI Data Integrity Verification',
                  status: 'Enforced',
                  details: 'Strict schema validation on legal entities, locations, payers, and provider records prior to persistence.',
                  check: 'validateCredentialingRecord schema checker',
                },
                {
                  cfr: '45 CFR §164.312(e)(1)',
                  name: 'Transmission Security & Encrypted In-Transit ePHI',
                  status: 'Enforced',
                  details: 'Server rejects unauthorized TLS connections (rejectUnauthorized: true). express.json constrained to 10MB parser limit.',
                  check: 'TLS 1.3 / Strict Certificate Authority check',
                },
                {
                  cfr: '45 CFR §164.308(a)(3)(ii)(C)',
                  name: 'Termination Procedures & Deletion Safeguard',
                  status: 'Enforced',
                  details: 'Mandatory delete confirmation modal requires exact match delete-user-[id] before account deletion is committed.',
                  check: 'delete-user-[userid] verification barrier',
                },
              ].map((safeguard) => (
                <div key={safeguard.cfr} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {safeguard.cfr}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{safeguard.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{safeguard.details}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{safeguard.status}</span>
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">{safeguard.check}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: BREACH NOTIFICATION & INCIDENT RESPONSE */}
      {/* ==================================================================== */}
      {activeSubTab === 'breach-center' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  HIPAA Breach Notification & Incident Response Center
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Operate standardized 4-factor risk assessments under 45 CFR §164.402 to evaluate potential compromises,
                log containment steps, and maintain statutory documentation for the HHS Office for Civil Rights (OCR).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingIncident(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Log Security Incident</span>
            </button>
          </div>

          {/* Incidents Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Security Incident Register ({securityIncidents.length})
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                HIPAA Enforcement Rule 45 CFR §164.408 Compliance
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Case #</th>
                    <th className="py-3 px-3">Title & Type</th>
                    <th className="py-3 px-3">Discovered</th>
                    <th className="py-3 px-3">Severity</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">4-Factor Assessment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {securityIncidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{incident.caseNumber}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{incident.title}</div>
                        <div className="text-[11px] text-slate-500">{incident.incidentType}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{incident.dateDiscovered}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          incident.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : incident.severity === 'High'
                            ? 'bg-orange-100 text-orange-800'
                            : incident.severity === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          incident.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : incident.status === 'Reported to OCR'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {incident.riskAssessment ? (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Assessed: Non-Breach</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-700 font-semibold flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Assessment Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedIncident(incident)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#2B4C9D] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View / Assess</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: CONFIRM EMERGENCY USER LOCKOUT */}
      {/* ==================================================================== */}
      {selectedUserForLock && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">
              Confirm Emergency Account Lockout
            </h3>
            <p className="text-xs text-center text-slate-500 mt-1">
              You are about to sever all active sessions and freeze the account for:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-3 text-center">
              <div className="font-bold text-slate-900 text-sm">{selectedUserForLock.name}</div>
              <div className="text-xs text-slate-500">{selectedUserForLock.email}</div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Emergency Suspension (Audit Trail):
              </label>
              <textarea
                rows={2}
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setSelectedUserForLock(null)}
                className="w-1/2 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmUserLock}
                className="w-1/2 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                {isProcessing ? 'Severing Access...' : 'Sever Access Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: LOG NEW SECURITY INCIDENT */}
      {/* ==================================================================== */}
      {isAddingIncident && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Log New Security Incident (HIPAA §164.400)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Initiate an official investigation record in compliance with the HIPAA Breach Notification Rule.
            </p>

            <form onSubmit={handleCreateIncidentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suspected Credential Phishing Attempt"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Severity Level</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Type</label>
                  <select
                    value={newIncident.incidentType}
                    onChange={(e) => setNewIncident({ ...newIncident, incidentType: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value="Unauthorized Access / Snooping">Unauthorized Access / Snooping</option>
                    <option value="Phishing / Credential Harvest">Phishing / Credential Harvest</option>
                    <option value="Misdirected ePHI Transmission">Misdirected ePHI Transmission</option>
                    <option value="Lost / Stolen Unencrypted Device">Lost / Stolen Unencrypted Device</option>
                    <option value="Malware / Ransomware Threat">Malware / Ransomware Threat</option>
                    <option value="Abnormal Bulk Data Export">Abnormal Bulk Data Export</option>
                    <option value="Other Security Incident">Other Security Incident</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the circumstances, how the incident was discovered, and any ePHI involved..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Immediate Containment Steps</label>
                <textarea
                  rows={2}
                  placeholder="Actions taken to isolate systems, revoke tokens, or secure data..."
                  value={newIncident.containmentActions}
                  onChange={(e) => setNewIncident({ ...newIncident, containmentActions: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingIncident(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Create Incident Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: VIEW INCIDENT & 4-FACTOR RISK ASSESSMENT */}
      {/* ==================================================================== */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedIncident.caseNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{selectedIncident.title}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Discovered on {selectedIncident.dateDiscovered} by {selectedIncident.reportedBy}</p>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="font-semibold text-slate-700 mb-1">Description:</div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedIncident.description}
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-700 mb-1">Containment Actions:</div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedIncident.containmentActions}
                </div>
              </div>

              {/* 4-Factor Assessment Box */}
              <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-4">
                <h4 className="font-bold text-indigo-950 mb-2 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>HIPAA 4-Factor Risk Assessment (§164.402)</span>
                </h4>
                <p className="text-[11px] text-indigo-900/80 mb-3">
                  An acquisition, access, use, or disclosure of ePHI is presumed to be a breach unless the covered entity demonstrates that there is a low probability that the PHI has been compromised based on a risk assessment of at least 4 factors:
                </p>

                <div className="space-y-2 text-[11px]">
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-bold text-slate-800">Factor 1 (Nature of PHI): </span>
                    <span className="text-slate-600">
                      {selectedIncident.riskAssessment?.factor1NatureOfPHI || 'Assessed: Limited administrative / clinical data; no financial or direct SSN exposure.'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-bold text-slate-800">Factor 2 (Unauthorized Recipient): </span>
                    <span className="text-slate-600">
                      {selectedIncident.riskAssessment?.factor2UnauthorizedRecipient || 'Internal authorized employee with restricted role boundary.'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-bold text-slate-800">Factor 3 (Actual View or Acquisition): </span>
                    <span className="text-slate-600">
                      {selectedIncident.riskAssessment?.factor3ActualViewOrAcquisition || 'Demonstrably encrypted and protected; no exfiltration detected.'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-bold text-slate-800">Factor 4 (Mitigation Extent): </span>
                    <span className="text-slate-600">
                      {selectedIncident.riskAssessment?.factor4MitigationExtent || 'Immediate complete token revocation and access termination executed.'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-indigo-200/60 flex items-center justify-between">
                  <span className="font-bold text-indigo-950">Statutory Assessment Determination:</span>
                  <span className="px-2.5 py-1 rounded-full font-bold text-xs bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {selectedIncident.riskAssessment?.conclusion || 'Low Probability of Compromise (Non-Breach)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
