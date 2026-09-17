import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { AccessLevel, AccessRequest, Discipline, SystemRole } from '../../types';
import { SYSTEM_ROLES } from '../../data/roleConfig';
import { isSuperAdmin } from '../../utils/rbac';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  AlertCircle, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Key, 
  UserPlus, 
  Sparkles,
  Layers,
  Crown
} from 'lucide-react';

interface AccessRequestsViewProps {
  onBackToDashboard: () => void;
  onNavigateToUsers?: () => void;
}

export const AccessRequestsView: React.FC<AccessRequestsViewProps> = ({ 
  onBackToDashboard, 
  onNavigateToUsers 
}) => {
  const { 
    currentAccount, 
    accessRequests, 
    approveAccessRequest, 
    denyAccessRequest, 
    refreshAccessRequests,
    entities, 
    locations 
  } = useCredentialing();

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'DENIED'>('PENDING');

  // Quick config draft state for each pending request: mapping requestId -> { accessLevel, systemRole, entityId, locationId, disciplines }
  const [requestDrafts, setRequestDrafts] = useState<Record<string, {
    accessLevel: AccessLevel;
    systemRole: SystemRole;
    entityId: string;
    locationId: string;
    assignedDisciplines: Discipline[];
  }>>({});

  // Pushed Page State: "if i approve just push a page to add all basic deetails"
  const [pushedRequest, setPushedRequest] = useState<AccessRequest | null>(null);
  const [onboardingFullName, setOnboardingFullName] = useState('');
  const [onboardingFirstName, setOnboardingFirstName] = useState('');
  const [onboardingLastName, setOnboardingLastName] = useState('');
  const [onboardingEmail, setOnboardingEmail] = useState('');
  const [onboardingPhone, setOnboardingPhone] = useState('');
  const [onboardingDepartment, setOnboardingDepartment] = useState('Credentialing & Operations');
  const [onboardingRole, setOnboardingRole] = useState<SystemRole>('Credentialing Specialist');
  const [onboardingRoleTitle, setOnboardingRoleTitle] = useState('Credentialing Specialist');
  const [onboardingAccessLevel, setOnboardingAccessLevel] = useState<AccessLevel>('USER');
  const [onboardingEntityId, setOnboardingEntityId] = useState(entities[0]?.id || 'ent-1');
  const [onboardingLocationId, setOnboardingLocationId] = useState(locations[0]?.id || 'loc-1');
  const [onboardingDisciplines, setOnboardingDisciplines] = useState<Discipline[]>(['ABA', 'Speech', 'OT']);
  const [onboardingPassword, setOnboardingPassword] = useState('proficio');
  const [onboardingPermissions, setOnboardingPermissions] = useState<string[]>([]);
  const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);

  // Deny modal / reason state
  const [denyingRequestId, setDenyingRequestId] = useState<string | null>(null);
  const [denialReasonInput, setDenialReasonInput] = useState('');
  const [isDenying, setIsDenying] = useState(false);

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isCurrentSuperAdmin = isSuperAdmin(currentAccount);

  // Helper to initialize or get draft for a request
  const getDraft = (req: AccessRequest) => {
    if (requestDrafts[req.id]) {
      return requestDrafts[req.id];
    }
    // Match requested role to system role or default
    let defaultRole: SystemRole = 'Credentialing Specialist';
    const match = SYSTEM_ROLES.find(r => 
      r.title.toLowerCase().includes((req.requestedRole || '').toLowerCase()) ||
      r.id.toLowerCase().includes((req.requestedRole || '').toLowerCase())
    );
    if (match) {
      defaultRole = match.id;
    }
    const roleDef = SYSTEM_ROLES.find(r => r.id === defaultRole) || SYSTEM_ROLES[0];

    const draft = {
      accessLevel: roleDef.defaultAccessLevel || 'USER',
      systemRole: defaultRole,
      entityId: req.entityId || entities[0]?.id || 'ent-1',
      locationId: req.locationId || locations[0]?.id || 'loc-1',
      assignedDisciplines: ['ABA', 'Speech', 'OT'] as Discipline[],
    };
    return draft;
  };

  const updateDraft = (requestId: string, updates: Partial<{
    accessLevel: AccessLevel;
    systemRole: SystemRole;
    entityId: string;
    locationId: string;
    assignedDisciplines: Discipline[];
  }>) => {
    setRequestDrafts(prev => {
      const existing = prev[requestId] || {
        accessLevel: 'USER' as AccessLevel,
        systemRole: 'Credentialing Specialist' as SystemRole,
        entityId: entities[0]?.id || 'ent-1',
        locationId: locations[0]?.id || 'loc-1',
        assignedDisciplines: ['ABA', 'Speech', 'OT'] as Discipline[],
      };
      return {
        ...prev,
        [requestId]: { ...existing, ...updates },
      };
    });
  };

  // Push Page to Add All Basic Details
  const handleInitiateApproval = (req: AccessRequest) => {
    const draft = getDraft(req);
    const names = req.fullName.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
    const roleDef = SYSTEM_ROLES.find(r => r.id === draft.systemRole) || SYSTEM_ROLES[0];

    setPushedRequest(req);
    setOnboardingFullName(req.fullName);
    setOnboardingFirstName(firstName);
    setOnboardingLastName(lastName);
    setOnboardingEmail(req.email);
    setOnboardingPhone(req.phone || '');
    setOnboardingDepartment(req.department || 'Credentialing & Operations');
    setOnboardingRole(draft.systemRole);
    setOnboardingRoleTitle(roleDef.title || draft.systemRole);
    setOnboardingAccessLevel(draft.accessLevel);
    setOnboardingEntityId(draft.entityId);
    setOnboardingLocationId(draft.locationId);
    setOnboardingDisciplines(draft.assignedDisciplines);
    setOnboardingPassword('proficio');
    setOnboardingPermissions([...roleDef.responsibilities]);
    setToastMessage(null);
  };

  // Finalize Approval & Save User Details
  const handleSaveOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushedRequest) return;

    if (!onboardingFullName.trim() || !onboardingEmail.trim()) {
      setToastMessage({ type: 'error', text: 'Full Name and Email Address are required.' });
      return;
    }

    setIsSavingOnboarding(true);
    setToastMessage(null);

    try {
      const res = await approveAccessRequest(pushedRequest.id, {
        fullName: onboardingFullName.trim(),
        firstName: onboardingFirstName.trim() || undefined,
        lastName: onboardingLastName.trim() || undefined,
        email: onboardingEmail.trim().toLowerCase(),
        phone: onboardingPhone.trim() || undefined,
        department: onboardingDepartment.trim(),
        systemRole: onboardingRole,
        roleTitle: onboardingRoleTitle.trim() || onboardingRole,
        accessLevel: onboardingAccessLevel,
        entityId: onboardingEntityId,
        locationId: onboardingLocationId,
        assignedDisciplines: onboardingDisciplines,
        permissions: onboardingPermissions,
        password: onboardingPassword.trim() || 'proficio',
      });

      setIsSavingOnboarding(false);

      if (res.success) {
        setToastMessage({
          type: 'success',
          text: `Access approved! ${onboardingFullName} is now registered with ${onboardingRole} (${onboardingAccessLevel}) privileges.`,
        });
        setPushedRequest(null);
        refreshAccessRequests();
      } else {
        setToastMessage({
          type: 'error',
          text: res.error || 'Failed to complete user approval.',
        });
      }
    } catch (err: any) {
      setIsSavingOnboarding(false);
      setToastMessage({
        type: 'error',
        text: err.message || 'An error occurred during user approval.',
      });
    }
  };

  // Confirm Denial
  const handleConfirmDenial = async () => {
    if (!denyingRequestId) return;
    setIsDenying(true);

    try {
      const res = await denyAccessRequest(
        denyingRequestId,
        denialReasonInput.trim() || 'Access denied by Super Administrator.'
      );

      setIsDenying(false);
      setDenyingRequestId(null);
      setDenialReasonInput('');

      if (res.success) {
        setToastMessage({
          type: 'success',
          text: 'Access request has been marked as Denied.',
        });
        refreshAccessRequests();
      } else {
        setToastMessage({
          type: 'error',
          text: res.error || 'Failed to deny access request.',
        });
      }
    } catch (err: any) {
      setIsDenying(false);
      setToastMessage({
        type: 'error',
        text: err.message || 'An error occurred while denying the request.',
      });
    }
  };

  // STRICT GOVERNANCE: If user is not superadmin, block completely
  if (!isCurrentSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Restricted to Super Administrator</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Employee access request governance, role level assignments, and user onboarding approvals are strictly limited to Super Administrator accounts.
          </p>
          <div className="mt-6">
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 bg-[#2B4C9D] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter requests
  const filteredRequests = accessRequests.filter((req) => {
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.fullName.toLowerCase().includes(q) ||
        req.email.toLowerCase().includes(q) ||
        (req.requestedRole && req.requestedRole.toLowerCase().includes(q)) ||
        (req.department && req.department.toLowerCase().includes(q)) ||
        (req.justification && req.justification.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingCount = accessRequests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = accessRequests.filter((r) => r.status === 'APPROVED').length;
  const deniedCount = accessRequests.filter((r) => r.status === 'DENIED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in duration-150 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center space-x-2">
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* PUSHED PAGE: "if i approve just push a page to add all basic deetails" */}
      {pushedRequest ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
          {/* Top Return Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPushedRequest(null)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Requests List</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Request Ref: {pushedRequest.id}
            </span>
          </div>

          {/* Main Onboarding Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit border border-emerald-200 mb-2">
                <Crown className="w-3.5 h-3.5" />
                <span>Super Administrator User Provisioning</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Add Basic Details &amp; Activate User
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure full employee profile, access level, and clinic permissions for <span className="font-semibold text-slate-800">{pushedRequest.fullName}</span> ({pushedRequest.email}).
              </p>
            </div>

            <form onSubmit={handleSaveOnboarding} className="space-y-6">
              {/* SECTION 1: Personal & Contact Information */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2B4C9D]"></span>
                  <span>1. Basic Personal &amp; Identity Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={onboardingFullName}
                      onChange={(e) => {
                        setOnboardingFullName(e.target.value);
                        const parts = e.target.value.split(' ');
                        setOnboardingFirstName(parts[0] || '');
                        setOnboardingLastName(parts.slice(1).join(' ') || '');
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={onboardingFirstName}
                      onChange={(e) => setOnboardingFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={onboardingLastName}
                      onChange={(e) => setOnboardingLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Corporate Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={onboardingEmail}
                        onChange={(e) => setOnboardingEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={onboardingPhone}
                        onChange={(e) => setOnboardingPhone(e.target.value)}
                        placeholder="(925) 456-7890"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Access Level & Role Assignment */}
              <div className="border-t border-slate-200 pt-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>2. Access Level &amp; System Role Governance</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Access Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Access Level
                    </label>
                    <div className="relative">
                      <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={onboardingAccessLevel}
                        onChange={(e) => setOnboardingAccessLevel(e.target.value as AccessLevel)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] cursor-pointer"
                      >
                        <option value="USER">USER (Standard Operations)</option>
                        <option value="ADMINISTRATOR">ADMINISTRATOR (Full Access)</option>
                      </select>
                    </div>
                  </div>

                  {/* System Role */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      System Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={onboardingRole}
                        onChange={(e) => {
                          const r = e.target.value as SystemRole;
                          setOnboardingRole(r);
                          const def = SYSTEM_ROLES.find(x => x.id === r);
                          if (def) {
                            setOnboardingRoleTitle(def.title);
                            setOnboardingAccessLevel(def.defaultAccessLevel);
                            setOnboardingPermissions([...def.responsibilities]);
                          }
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] cursor-pointer"
                      >
                        {SYSTEM_ROLES.map((r) => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={onboardingDepartment}
                        onChange={(e) => setOnboardingDepartment(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Entity, Clinic Location & Disciplines */}
              <div className="border-t border-slate-200 pt-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>3. Practice Entity, Clinic Location &amp; Disciplines</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Entity */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Assigned Legal Entity
                    </label>
                    <select
                      value={onboardingEntityId}
                      onChange={(e) => setOnboardingEntityId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] cursor-pointer"
                    >
                      {entities.map((e) => (
                        <option key={e.id} value={e.id}>{e.name || e.dba || e.legalName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Office / Clinic Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={onboardingLocationId}
                        onChange={(e) => setOnboardingLocationId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] cursor-pointer"
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

                {/* Disciplines */}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Assigned Disciplines
                  </label>
                  <div className="flex items-center space-x-4">
                    {(['ABA', 'Speech', 'OT'] as Discipline[]).map((disc) => (
                      <label key={disc} className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onboardingDisciplines.includes(disc)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setOnboardingDisciplines(prev => [...prev, disc]);
                            } else {
                              setOnboardingDisciplines(prev => prev.filter(d => d !== disc));
                            }
                          }}
                          className="rounded text-[#2B4C9D] focus:ring-[#2B4C9D]"
                        />
                        <span className="font-semibold">{disc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Credentials & Password Setup */}
              <div className="border-t border-slate-200 pt-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>4. Initial Password &amp; Google OAuth Authorization</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Initial Temporary Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={onboardingPassword}
                        onChange={(e) => setOnboardingPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Default: <code className="bg-slate-100 px-1 py-0.5 rounded">proficio</code>. User will be prompted to reset password on first manual sign-in.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-2.5 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Google OAuth Ready</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Once saved, this email will automatically pass all 10 Employee Access Control verification steps for instant Google Sign-In.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-200 pt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPushedRequest(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingOnboarding}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingOnboarding ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving &amp; Activating User...</span>
                    </div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save All Details &amp; Activate User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* MAIN REQUESTS LIST & REVIEW DASHBOARD */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-amber-700" />
                  <span>SUPERADMIN ACCESS GOVERNANCE</span>
                </span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                    {pendingCount} Pending Review
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-1.5">
                Employee Access Requests
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review unregistered employee access requests, determine access levels and system roles, and complete user onboarding.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {onNavigateToUsers && (
                <button
                  type="button"
                  onClick={onNavigateToUsers}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                  <span>User Roster</span>
                </button>
              )}
              <button
                type="button"
                onClick={onBackToDashboard}
                className="px-3 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>

          {/* Filters & Status Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Pills */}
            <div className="flex items-center space-x-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs w-fit">
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  statusFilter === 'PENDING'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Pending ({pendingCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('APPROVED')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  statusFilter === 'APPROVED'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Approved ({approvedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('DENIED')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  statusFilter === 'DENIED'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserX className="w-3.5 h-3.5 text-rose-500" />
                <span>Denied ({deniedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>All ({accessRequests.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, role..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] text-slate-900 shadow-xs"
              />
            </div>
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Access Requests Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                {statusFilter === 'PENDING'
                  ? 'All pending employee access requests have been reviewed and resolved.'
                  : 'No requests match your selected filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const draft = getDraft(req);
                const roleDef = SYSTEM_ROLES.find(r => r.id === draft.systemRole) || SYSTEM_ROLES[0];
                const entity = entities.find(e => e.id === (req.assignedEntityId || req.entityId || draft.entityId));
                const location = locations.find(l => l.id === (req.assignedLocationId || req.locationId || draft.locationId));

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-colors"
                  >
                    {/* Top Row: Applicant Info & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2B4C9D] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          {req.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-bold text-slate-900">{req.fullName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : req.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              {req.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-slate-800 font-medium">{req.email}</span>
                            </span>
                            {req.phone && (
                              <span className="flex items-center space-x-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{req.phone}</span>
                              </span>
                            )}
                            <span className="text-slate-400">&bull;</span>
                            <span className="text-[11px] text-slate-400">
                              Submitted: {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Department and Requested Role tags */}
                      <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#2B4C9D] border border-blue-200">
                          {req.requestedRole || 'Credentialing Specialist'}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs text-slate-600 bg-slate-50 border border-slate-200">
                          {req.department || 'Credentialing & Operations'}
                        </span>
                      </div>
                    </div>

                    {/* Justification note quote */}
                    {req.justification && (
                      <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">Reason for Request: </span>
                          <span className="text-slate-600">{req.justification}</span>
                        </div>
                      </div>
                    )}

                    {/* Pending Review Section: WHAT LEVEL OF ACCESS TO GIVE */}
                    {req.status === 'PENDING' ? (
                      <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                            <Shield className="w-4 h-4 text-[#2B4C9D]" />
                            <span>Select What Level of Access to Give</span>
                          </p>
                          <span className="text-[11px] text-[#2B4C9D] font-semibold">
                            Superadmin Approval Stage
                          </span>
                        </div>

                        {/* Interactive Level Selectors */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          {/* Access Level */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Access Level
                            </label>
                            <select
                              value={draft.accessLevel}
                              onChange={(e) => updateDraft(req.id, { accessLevel: e.target.value as AccessLevel })}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] cursor-pointer shadow-2xs"
                            >
                              <option value="USER">USER (Operational)</option>
                              <option value="ADMINISTRATOR">ADMINISTRATOR (Full)</option>
                            </select>
                          </div>

                          {/* System Role */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              System Role
                            </label>
                            <select
                              value={draft.systemRole}
                              onChange={(e) => {
                                const roleId = e.target.value as SystemRole;
                                const def = SYSTEM_ROLES.find(x => x.id === roleId);
                                updateDraft(req.id, { 
                                  systemRole: roleId,
                                  accessLevel: def ? def.defaultAccessLevel : draft.accessLevel
                                });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] cursor-pointer shadow-2xs"
                            >
                              {SYSTEM_ROLES.map((r) => (
                                <option key={r.id} value={r.id}>{r.title}</option>
                              ))}
                            </select>
                          </div>

                          {/* Assigned Legal Entity */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Assigned Entity
                            </label>
                            <select
                              value={draft.entityId}
                              onChange={(e) => updateDraft(req.id, { entityId: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] cursor-pointer shadow-2xs"
                            >
                              {entities.map((e) => (
                                <option key={e.id} value={e.id}>{e.name || e.dba || e.legalName}</option>
                              ))}
                            </select>
                          </div>

                          {/* Assigned Clinic Location */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Clinic Location
                            </label>
                            <select
                              value={draft.locationId}
                              onChange={(e) => updateDraft(req.id, { locationId: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] cursor-pointer shadow-2xs"
                            >
                              {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Action Buttons: APPROVE ACCESS (pushes details page) or DENY ACCESS */}
                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-indigo-100/80">
                          <button
                            type="button"
                            onClick={() => {
                              setDenyingRequestId(req.id);
                              setDenialReasonInput('');
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition-colors flex items-center space-x-1.5"
                          >
                            <UserX className="w-3.5 h-3.5 text-rose-600" />
                            <span>Deny Access</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInitiateApproval(req)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition-colors flex items-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Access &amp; Add Basic Details</span>
                          </button>
                        </div>
                      </div>
                    ) : req.status === 'APPROVED' ? (
                      /* Approved summary */
                      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-semibold">Approved by {req.reviewedBy || 'Super Administrator'}</span>
                            {req.reviewedAt && (
                              <span className="text-emerald-700 ml-1">
                                on {new Date(req.reviewedAt).toLocaleDateString()}
                              </span>
                            )}
                            <span className="text-slate-500 ml-2">
                              Granted: <span className="font-semibold text-emerald-950">{req.assignedSystemRole || 'Credentialing Specialist'}</span> ({req.assignedAccessLevel || 'USER'})
                            </span>
                          </div>
                        </div>
                        {entity && (
                          <span className="text-[11px] text-emerald-800 bg-white/70 px-2 py-0.5 rounded border border-emerald-200">
                            {entity.name || entity.dba}
                          </span>
                        )}
                      </div>
                    ) : (
                      /* Denied summary */
                      <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserX className="w-4 h-4 text-rose-600 shrink-0" />
                          <div>
                            <span className="font-semibold">Denied by {req.reviewedBy || 'Super Administrator'}</span>
                            {req.denialReason && (
                              <span className="text-rose-700 ml-1.5">&mdash; {req.denialReason}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Deny Confirmation Modal */}
      {denyingRequestId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 text-rose-700 font-bold">
                <UserX className="w-5 h-5" />
                <span className="text-sm">Deny System Access Request</span>
              </div>
              <button
                onClick={() => setDenyingRequestId(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to deny this access request? The applicant will not be enrolled and will remain unauthorized to log in.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Denial (Optional)
              </label>
              <textarea
                rows={2}
                value={denialReasonInput}
                onChange={(e) => setDenialReasonInput(e.target.value)}
                placeholder="e.g., Unverified contractor or missing corporate approval..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDenyingRequestId(null)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDenying}
                onClick={handleConfirmDenial}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center space-x-1.5"
              >
                {isDenying ? <span>Denying...</span> : <span>Confirm Denial</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
