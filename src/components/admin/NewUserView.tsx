import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { AccessLevel, AppAccount, Discipline, SystemRole } from '../../types';
import { SYSTEM_ROLES, SystemRoleDefinition } from '../../data/roleConfig';
import { isSuperAdmin } from '../../utils/rbac';
import { revokeAllTokens, invalidateAllSessions } from '../../lib/supabase';
import { 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Key, 
  Layers, 
  Lock, 
  Mail, 
  Plus, 
  RefreshCw, 
  Search, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  User, 
  UserCheck, 
  UserCog, 
  UserPlus, 
  Users, 
  X,
  Edit2,
  Building2,
  Briefcase,
  Sliders,
  Eye,
  EyeOff,
  Crown,
  KeyRound,
  AlertTriangle
} from 'lucide-react';
import { AccessRequestsView } from './AccessRequestsView';

interface NewUserViewProps {
  onBackToDashboard: () => void;
}

export const NewUserView: React.FC<NewUserViewProps> = ({ onBackToDashboard }) => {
  const { 
    accounts, 
    currentAccount, 
    isAdmin, 
    createAccount, 
    sendOnboardingEmail,
    updateAccount, 
    deleteAccount,
    entities,
    pendingAccessRequestsCount,
    showToast
  } = useCredentialing();

  const [activeSubTab, setActiveSubTab] = useState<'create' | 'roster' | 'matrix' | 'requests'>('create');
  const [sendingEmailUserId, setSendingEmailUserId] = useState<string | null>(null);
  
  // Search & Filter in roster
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [accessFilter, setAccessFilter] = useState<'All' | AccessLevel>('All');

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mustChangePasswordOnFirstLogin, setMustChangePasswordOnFirstLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<SystemRole>('Credentialing Specialist');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('USER');
  const [department, setDepartment] = useState('Proficio Therapy Credentialing Hub');
  const [assignedDisciplines, setAssignedDisciplines] = useState<Discipline[]>(['ABA', 'Speech', 'OT']);
  const [assignedEntities, setAssignedEntities] = useState<string[]>(entities.map(e => e.id));

  // Granular Onboarding Permissions (Tick Boxes)
  // 1. Whose clinical staff data they can see [entity-entity control] -> assignedEntities
  // 2. What pages they can view -> allowedTabs
  // 3. Can they use the admin dashboard -> canAccessAdmin
  // 4. Can they use the dev dashboard -> canAccessDev
  // 5. Can they only view or can they also edit those data -> canEditData
  const [allowedTabs, setAllowedTabs] = useState<string[]>([
    'dashboard', 'tracker', 'providers', 'locations', 'payers', 'staff-approvals', 'clinical-portal', 'aesas', 'comments-roster', 'tickets'
  ]);
  const [canAccessAdmin, setCanAccessAdmin] = useState<boolean>(false);
  const [canAccessDev, setCanAccessDev] = useState<boolean>(false);
  const [canEditData, setCanEditData] = useState<boolean>(true);

  const [deleteTargetUser, setDeleteTargetUser] = useState<AppAccount | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const isCurrentSuperAdmin = isSuperAdmin(currentAccount);

  // Default pages resolver per role
  const getDefaultPagesForRole = (role: SystemRole): string[] => {
    switch (role) {
      case 'Credentialing Lead / Manager':
        return ['dashboard', 'tracker', 'providers', 'locations', 'payers', 'entities', 'reports', 'automations', 'admin-dashboard', 'staff-approvals', 'clinical-portal', 'aesas', 'comments-roster', 'tickets'];
      case 'Credentialing Specialist':
        return ['dashboard', 'tracker', 'providers', 'locations', 'payers', 'staff-approvals', 'clinical-portal', 'aesas', 'comments-roster', 'tickets'];
      case 'Billing and Claims':
        return ['dashboard', 'tracker', 'payers', 'reports', 'clinical-portal', 'comments-roster', 'tickets'];
      case 'HR/Operations':
        return ['dashboard', 'providers', 'locations', 'entities', 'tracker', 'clinical-portal', 'comments-roster', 'tickets'];
      case 'Clinical Team':
        return ['dashboard', 'providers', 'tracker', 'reports', 'clinical-portal', 'comments-roster', 'tickets'];
      case 'Leadership / Management':
        return ['dashboard', 'reports', 'tracker', 'payers', 'clinical-portal', 'aesas', 'comments-roster', 'tickets'];
      case 'Developer':
        return ['dashboard', 'tracker', 'providers', 'locations', 'payers', 'entities', 'reports', 'document-intake', 'admin-dashboard', 'clinical-portal', 'staff-approvals', 'aesas', 'comments-roster', 'tickets', 'dbms-manager'];
      case 'System Administrator':
        return ['dashboard', 'tracker', 'providers', 'locations', 'payers', 'entities', 'reports', 'document-intake', 'admin-dashboard', 'clinical-portal', 'staff-approvals', 'aesas', 'comments-roster', 'tickets', 'dbms-manager'];
      case 'Provider':
        return ['dashboard', 'providers', 'tracker', 'clinical-portal', 'tickets'];
      default:
        return ['dashboard', 'tracker', 'providers', 'clinical-portal', 'comments-roster', 'tickets'];
    }
  };

  // Available navigable pages for what pages they can view tick boxes
  const ALL_PAGES_OPTIONS: Array<{ id: string; label: string; description: string }> = [
    { id: 'dashboard', label: 'Management Dashboard', description: 'Real-time KPIs, expirations, turnaround times & operational metrics' },
    { id: 'providers', label: 'Clinical Staff Portal', description: 'Clinician profiles, licenses, 360 cards, and insurance panels' },
    { id: 'tracker', label: 'Credentialing Tracker', description: 'Pipeline stages, payer application statuses, and tracking grid' },
    { id: 'payers', label: 'Payer Master & Panels', description: 'Health plans, provider networks, requirements, and turnaround benchmarks' },
    { id: 'locations', label: 'Clinic Locations', description: 'Physical practice locations, service facilities & location NPIs' },
    { id: 'entities', label: 'Operating Legal Entities', description: 'Entity Tax IDs, corporate registrations & organizational hierarchy' },
    { id: 'reports', label: 'Reports & Analytics', description: 'Executive summaries, compliance audits, and legal entity breakdown' },
    { id: 'document-intake', label: 'AI Document Intake Hub', description: 'Automated document ingestion, OCR & clinician extraction' },
    { id: 'aesas', label: 'Deadline Automations / AESAS', description: 'Automated email alerts, 30/60/90-day SLA reminders & delivery logs' },
    { id: 'staff-approvals', label: 'Clinical Staff Approvals', description: 'Review and approve clinician documentation & license updates' },
    { id: 'comments-roster', label: 'Roster Notes & Comments', description: 'Internal team collaboration, clinician activity logs & notes' },
    { id: 'tickets', label: 'Staff Tickets & Bugs', description: 'Submit bug reports, technical support tickets & issue tracking' },
  ];

  // Selected role configuration
  const currentRoleDef = SYSTEM_ROLES.find(r => r.id === selectedRole) || SYSTEM_ROLES[0];

  // Handle role selection change
  const handleRoleChange = (roleId: SystemRole) => {
    setSelectedRole(roleId);
    const def = SYSTEM_ROLES.find(r => r.id === roleId);
    if (def) {
      setAccessLevel(def.defaultAccessLevel);
      if (!department || department === 'Proficio Therapy Credentialing Hub') {
        if (roleId === 'Billing and Claims') setDepartment('Revenue Cycle & Billing Operations');
        else if (roleId === 'HR/Operations') setDepartment('Human Resources & Staffing');
        else if (roleId === 'Clinical Team') setDepartment('Clinical Supervision & Quality');
        else if (roleId === 'Leadership / Management') setDepartment('Executive Leadership & Strategy');
        else if (roleId === 'Provider') setDepartment('Clinical Therapy Services');
        else if (roleId === 'System Administrator') setDepartment('IT & Compliance Governance');
        else setDepartment('Proficio Therapy Credentialing Hub');
      }

      // Automatically adjust granular settings to match role defaults (admin can still override via tick boxes)
      const defaultPages = getDefaultPagesForRole(roleId);
      setAllowedTabs(defaultPages);

      const isAdminRole = roleId === 'System Administrator' || roleId === 'Credentialing Lead / Manager' || def.defaultAccessLevel === 'ADMINISTRATOR';
      const isDevRole = roleId === 'Developer' || roleId === 'System Administrator';
      setCanAccessAdmin(isAdminRole);
      setCanAccessDev(isDevRole);

      const canEditByDefault = roleId === 'Credentialing Specialist' || roleId === 'Credentialing Lead / Manager' || roleId === 'System Administrator' || roleId === 'HR/Operations';
      setCanEditData(canEditByDefault);
    }
  };

  const toggleDiscipline = (disc: Discipline) => {
    setAssignedDisciplines(prev => 
      prev.includes(disc) ? prev.filter(d => d !== disc) : [...prev, disc]
    );
  };

  const toggleEntity = (entityId: string) => {
    setAssignedEntities(prev =>
      prev.includes(entityId) ? prev.filter(id => id !== entityId) : [...prev, entityId]
    );
  };

  const togglePage = (pageId: string) => {
    setAllowedTabs(prev =>
      prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
    );
  };

  const handleOpenCreateNew = () => {
    setIsEditing(false);
    setEditingAccountId(null);
    setName('');
    setEmail('');
    setPassword('');
    setMustChangePasswordOnFirstLogin(true);
    setSelectedRole('Credentialing Specialist');
    const defaultRole = SYSTEM_ROLES.find(r => r.id === 'Credentialing Specialist');
    setAccessLevel(defaultRole?.defaultAccessLevel || 'USER');
    setDepartment('Proficio Therapy Credentialing Hub');
    setAssignedDisciplines(['ABA', 'Speech', 'OT']);
    setAssignedEntities(entities.map(e => e.id));
    setAllowedTabs(['dashboard', 'tracker', 'providers', 'locations', 'payers', 'staff-approvals', 'clinical-portal', 'aesas', 'comments-roster', 'tickets']);
    setCanAccessAdmin(false);
    setCanAccessDev(false);
    setCanEditData(true);
    setActiveSubTab('create');
  };

  const handleOpenEdit = (acc: AppAccount) => {
    setIsEditing(true);
    setEditingAccountId(acc.id);
    setName(acc.name);
    setEmail(acc.email);
    setPassword(acc.password || '');
    setMustChangePasswordOnFirstLogin(acc.mustChangePasswordOnFirstLogin ?? true);
    const matchedRole = SYSTEM_ROLES.find(r => r.id === acc.systemRole || r.title === acc.roleTitle) || SYSTEM_ROLES[0];
    const roleId = (acc.systemRole as SystemRole) || matchedRole.id;
    setSelectedRole(roleId);
    setAccessLevel(acc.accessLevel);
    setDepartment(acc.department || 'Proficio Therapy Credentialing Hub');
    setAssignedDisciplines(acc.assignedDisciplines || ['ABA', 'Speech', 'OT']);
    setAssignedEntities(acc.assignedEntities && acc.assignedEntities.length > 0 ? acc.assignedEntities : entities.map(e => e.id));
    setAllowedTabs(acc.allowedTabs && acc.allowedTabs.length > 0 ? acc.allowedTabs : getDefaultPagesForRole(roleId));
    setCanAccessAdmin(acc.canAccessAdmin ?? (acc.accessLevel === 'ADMINISTRATOR' || acc.systemRole === 'System Administrator' || acc.systemRole === 'Credentialing Lead / Manager'));
    setCanAccessDev(acc.canAccessDev ?? (acc.systemRole === 'Developer' || acc.email?.toLowerCase().includes('dev@')));
    setCanEditData(acc.canEditData ?? (acc.accessLevel === 'ADMINISTRATOR' || roleId === 'Credentialing Specialist' || roleId === 'Credentialing Lead / Manager' || roleId === 'HR/Operations'));
    setActiveSubTab('create');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Full Name and Email Address are required.', 'error');
      return;
    }

    if (!editingAccountId && !password.trim()) {
      showToast('Please specify an initial password for the new user login.', 'error');
      return;
    }

    if (assignedEntities.length === 0) {
      showToast('Please select at least one operating entity under Clinical Staff Data Visibility.', 'error');
      return;
    }

    // Access capabilities are programmed directly within the role configuration in code
    const programmedPermissions = [...currentRoleDef.responsibilities];

    // Ensure admin tab is kept in sync if admin access is granted
    let finalAllowedTabs = [...allowedTabs];
    if (canAccessAdmin) {
      if (!finalAllowedTabs.includes('admin-dashboard')) finalAllowedTabs.push('admin-dashboard');
    } else {
      finalAllowedTabs = finalAllowedTabs.filter(t => t !== 'admin-dashboard');
    }
    if (canAccessDev) {
      if (!finalAllowedTabs.includes('dbms-manager')) finalAllowedTabs.push('dbms-manager');
    }

    const targetAccessLevel = canAccessAdmin ? 'ADMINISTRATOR' : accessLevel;
    const isSuper = Boolean(canAccessAdmin || selectedRole === 'System Administrator' || selectedRole === 'Developer');

    if (editingAccountId) {
      updateAccount(editingAccountId, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim() || 'proficio',
        accessLevel: targetAccessLevel,
        isSuperAdmin: isSuper,
        systemRole: selectedRole,
        roleTitle: currentRoleDef.title,
        department: department.trim(),
        assignedDisciplines,
        assignedEntities,
        allowedTabs: finalAllowedTabs,
        canAccessAdmin,
        canAccessDev,
        canEditData,
        permissions: programmedPermissions,
        mustChangePasswordOnFirstLogin,
        status: 'Active'
      });
      showToast(`User login for ${name} (${selectedRole}) updated with configured access policies.`, 'success');
      setIsEditing(false);
      setEditingAccountId(null);
      setActiveSubTab('roster');
    } else {
      const res = createAccount({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim() || 'proficio',
        accessLevel: targetAccessLevel,
        isSuperAdmin: isSuper,
        systemRole: selectedRole,
        roleTitle: currentRoleDef.title,
        department: department.trim(),
        assignedDisciplines,
        assignedEntities,
        allowedTabs: finalAllowedTabs,
        canAccessAdmin,
        canAccessDev,
        canEditData,
        permissions: programmedPermissions,
        mustChangePasswordOnFirstLogin,
        status: 'Active'
      });

      if (res.success) {
        showToast(`Account "${name}" created in database & AESAS onboarding email dispatched to ${email}!`, 'success');
        handleOpenCreateNew();
        setActiveSubTab('roster');
      } else {
        showToast(res.error || 'Failed to create user account.', 'error');
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    // HIPAA §164.308(a)(3)(ii)(C) Immediate Access Revocation & Session Termination
    await revokeAllTokens(id);
    await invalidateAllSessions(id);
    const res = deleteAccount(id);
    if (res.success) {
      showToast('User account removed and all sessions immediately revoked.', 'success');
    } else {
      showToast(res.error || 'Cannot delete system account.', 'error');
    }
  };

  const filteredAccounts = accounts.filter((a) => {
    if (accessFilter !== 'All' && a.accessLevel !== accessFilter) return false;
    if (roleFilter !== 'All') {
      const roleMatch = a.systemRole === roleFilter || a.roleTitle?.includes(roleFilter);
      if (!roleMatch) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.roleTitle && a.roleTitle.toLowerCase().includes(q)) ||
        (a.department && a.department.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Non-admin fallback
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">Administrator Privileges Required</h2>
          <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
            You are currently signed in as a standard specialist ({currentAccount?.email}). User login provisioning and role configuration require full administrator credentials.
          </p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#2B4C9D] shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Administration</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-[11px] font-bold text-[#2B4C9D] uppercase tracking-wider">Role-Based Access Control</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              New User Login & Role Provisioning
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create and provision user login credentials with role-specific permissions and responsibilities.
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs">
            <button
              onClick={() => {
                if (isEditing) handleOpenCreateNew();
                setActiveSubTab('create');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeSubTab === 'create'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#2B4C9D]" />
              <span>{isEditing ? 'Edit User Form' : 'Create User'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('roster')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeSubTab === 'roster'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>User Roster ({accounts.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('matrix')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeSubTab === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Role Permissions Matrix</span>
            </button>

            {isCurrentSuperAdmin && (
              <button
                type="button"
                onClick={() => setActiveSubTab('requests')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeSubTab === 'requests'
                    ? 'bg-amber-100 text-amber-900 shadow-xs'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Access Requests ({pendingAccessRequestsCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUBTAB 1: CREATE / EDIT USER LOGIN PAGE */}
      {/* ========================================================= */}
      {activeSubTab === 'create' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <form onSubmit={handleSaveUser} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <UserCog className="w-5 h-5 text-[#2B4C9D]" />
                  <span>{isEditing ? `Editing User: ${name || 'User'}` : 'User Account Credentials & Role Provisioning'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify user credentials and assign their organizational role. System access capabilities are programmed automatically based on the chosen role.
                </p>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleOpenCreateNew}
                  className="text-xs text-[#2B4C9D] hover:underline font-semibold"
                >
                  + Switch to New User Form
                </button>
              )}
            </div>

            {/* Basic Account Credentials */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-slate-400">
                1. Account Credentials & Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rachel Adams, MS, CCC-SLP"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rachel.adams@proficiotherapy.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isEditing ? 'Password (Leave blank to keep existing)' : 'Login Password *'}
                    </label>
                    {isCurrentSuperAdmin ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Super Admin Visible
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        Protected by Super Admin
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!isEditing}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isEditing ? (isCurrentSuperAdmin ? (password || '••••••••') : '•••••••• (Protected)') : 'Enter initial secure password'}
                      className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Division
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Proficio Credentialing Operations"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                    />
                  </div>
                </div>
              </div>

              {/* First-login password change policy checkbox */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="must-change-password-checkbox"
                  checked={mustChangePasswordOnFirstLogin}
                  onChange={(e) => setMustChangePasswordOnFirstLogin(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#2B4C9D] border-slate-300 rounded focus:ring-[#2B4C9D] cursor-pointer"
                />
                <label htmlFor="must-change-password-checkbox" className="text-xs text-slate-700 cursor-pointer select-none">
                  <span className="font-bold text-slate-900">Require password change upon first sign-on</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    When enabled, the user will be presented with a mandatory password update prompt upon logging in. Passwords remain viewable only by Super Administrator.
                  </p>
                </label>
              </div>

              {/* Automated AESAS Onboarding Welcome Email Notice */}
              {!isEditing && (
                <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/90 flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-[#2B4C9D] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-[#2B4C9D] flex items-center space-x-1.5">
                      <span>Automated AESAS Onboarding Email (Resend API)</span>
                      <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">Live Dispatch</span>
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Upon creation, the system updates the database and dispatches Template 1 ("Onboarding to System") with portal access URL, assigned system role, operating entity, and 1st login password.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* System Role Selection Dropdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label htmlFor="system-role-select" className="block text-xs font-bold text-slate-800">
                  2. Select System Role Profile <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  Role automatically determines access capabilities in code
                </span>
              </div>

              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  id="system-role-select"
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value as SystemRole)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] appearance-none cursor-pointer"
                >
                  {SYSTEM_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title} — {role.category} ({role.defaultAccessLevel === 'ADMINISTRATOR' ? 'Admin Access' : 'Standard User'})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>

              {/* Selected Role Summary Card */}
              {currentRoleDef && (
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{currentRoleDef.title}</span>
                      <span className="text-[10px] text-slate-500 font-medium">• {currentRoleDef.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {currentRoleDef.description}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRoleDef.badgeColor}`}>
                      {currentRoleDef.defaultAccessLevel === 'ADMINISTRATOR' ? 'Admin Level' : 'Standard User'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Programmed RBAC</span>
                  </div>
                </div>
              )}
            </div>

            {/* Administrative Security Privilege Override */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                3. Access Level Privilege
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAccessLevel('ADMINISTRATOR');
                    setCanAccessAdmin(true);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    accessLevel === 'ADMINISTRATOR'
                      ? 'border-[#2B4C9D] bg-indigo-50/70 text-[#2B4C9D] ring-1 ring-[#2B4C9D]'
                      : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2B4C9D]" />
                    <span>Administrator Access</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Can provision logins, manage master payer requirements, view all entities, and configure SLA workflows.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAccessLevel('USER');
                    setCanAccessAdmin(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    accessLevel === 'USER'
                      ? 'border-[#2B4C9D] bg-indigo-50/70 text-[#2B4C9D] ring-1 ring-[#2B4C9D]'
                      : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold text-xs">
                    <User className="w-3.5 h-3.5 text-slate-700" />
                    <span>Standard User Access</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Scoped operational access according to assigned system role profile.
                  </p>
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* 4. GRANULAR ONBOARDING PERMISSION CONTROLS (TICK BOXES) */}
            {/* ========================================================= */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-[#2B4C9D]" />
                    <span>4. Granular Onboarding Access Policies (Tick Box Controls)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Precisely control what clinical staff data, pages, dashboards, and edit capabilities this employee can use.
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-[#2B4C9D] border border-indigo-200 self-start sm:self-auto">
                  Configurable RBAC
                </span>
              </div>

              {/* 4A. WHOSE CLINICAL STAFF DATA THEY CAN SEE [ENTITY-ENTITY CONTROL] */}
              <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#2B4C9D]" />
                      <span>A. Clinical Staff Data Visibility [Entity-to-Entity Access Control]</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Check which operating entities' clinical staff data, licenses, and credentialing records this employee can see:
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setAssignedEntities(entities.map(e => e.id))}
                      className="text-[#2B4C9D] hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Select All 3 Entities
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setAssignedEntities([])}
                      className="text-slate-500 hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {entities.map((entity) => {
                    const isChecked = assignedEntities.includes(entity.id);
                    const nameLower = (entity.legalName || entity.dba || '').toLowerCase();
                    const isAges = entity.id === 'ent-1' || nameLower.includes('ages');
                    const isPstg = entity.id === 'ent-pstg-inc' || nameLower.includes('speech');
                    const isChild = entity.id === 'ent-3' || nameLower.includes('child');

                    return (
                      <label
                        key={entity.id}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'border-[#2B4C9D] bg-white ring-2 ring-[#2B4C9D]/10 shadow-xs'
                            : 'border-slate-200 bg-white/50 hover:bg-white text-slate-500'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleEntity(entity.id)}
                            className="mt-1 w-4 h-4 text-[#2B4C9D] rounded border-slate-300 focus:ring-[#2B4C9D] cursor-pointer"
                          />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-900 block leading-tight">
                              {entity.dba || entity.legalName}
                            </span>
                            <p className="text-[10px] text-slate-500">
                              {entity.legalName} &bull; TIN: {entity.taxId || '82-1221807'}
                            </p>
                            <div className="pt-1">
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                isAges ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                isPstg ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                {isAges ? 'ABA & Autism' : isPstg ? 'Speech Therapy' : 'OT & Speech'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {assignedEntities.length === 0 && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center space-x-1 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Warning: At least one operating entity must be checked so the employee can view clinical staff.</span>
                  </p>
                )}
              </div>

              {/* 4B. WHAT PAGES THEY CAN VIEW */}
              <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#2B4C9D]" />
                      <span>B. Page &amp; Navigation Permissions [What Pages They Can View]</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Check each page and module this employee is permitted to view in their navigation header:
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setAllowedTabs(ALL_PAGES_OPTIONS.map(p => p.id))}
                      className="text-[#2B4C9D] hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Select All Pages
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setAllowedTabs(getDefaultPagesForRole(selectedRole))}
                      className="text-[#2B4C9D] hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Role Default ({getDefaultPagesForRole(selectedRole).length})
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setAllowedTabs([])}
                      className="text-slate-500 hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {ALL_PAGES_OPTIONS.map((page) => {
                    const isChecked = allowedTabs.includes(page.id);
                    return (
                      <label
                        key={page.id}
                        className={`p-3 rounded-xl border flex items-start space-x-2.5 transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'border-[#2B4C9D] bg-white ring-1 ring-[#2B4C9D]/15 shadow-2xs'
                            : 'border-slate-200 bg-white/60 hover:bg-white text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePage(page.id)}
                          className="mt-0.5 w-4 h-4 text-[#2B4C9D] rounded border-slate-300 focus:ring-[#2B4C9D] cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">{page.label}</span>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{page.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4C & 4D: CAN THEY USE ADMIN DASHBOARD & DEV DASHBOARD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Admin Dashboard Tick Box */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  canAccessAdmin ? 'border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-300' : 'border-slate-200 bg-slate-50/80'
                }`}>
                  <label className="flex items-start space-x-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={canAccessAdmin}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setCanAccessAdmin(val);
                        if (val) {
                          setAccessLevel('ADMINISTRATOR');
                          if (!allowedTabs.includes('admin-dashboard')) {
                            setAllowedTabs(prev => [...prev, 'admin-dashboard']);
                          }
                        }
                      }}
                      className="mt-1 w-4 h-4 text-[#2B4C9D] rounded border-slate-300 focus:ring-[#2B4C9D] cursor-pointer shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                          <ShieldCheck className="w-4 h-4 text-[#2B4C9D]" />
                          <span>Can they use the Admin Dashboard</span>
                        </div>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                          canAccessAdmin ? 'bg-indigo-200 text-indigo-950 font-bold' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {canAccessAdmin ? 'AUTHORIZED' : 'LOCKED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        When checked, allows employee to enter the Admin Dashboard, manage users &amp; roles, approve access requests, and review audit telemetry.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Dev Dashboard Tick Box */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  canAccessDev ? 'border-purple-400 bg-purple-50/60 ring-1 ring-purple-300' : 'border-slate-200 bg-slate-50/80'
                }`}>
                  <label className="flex items-start space-x-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={canAccessDev}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setCanAccessDev(val);
                        if (val) {
                          setAllowedTabs(prev => {
                            const next = [...prev];
                            if (!next.includes('dbms-manager')) next.push('dbms-manager');
                            return next;
                          });
                        }
                      }}
                      className="mt-1 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-600 cursor-pointer shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                          <Key className="w-4 h-4 text-purple-700" />
                          <span>Can they use the Dev Dashboard</span>
                        </div>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                          canAccessDev ? 'bg-purple-200 text-purple-950 font-bold' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {canAccessDev ? 'AUTHORIZED' : 'LOCKED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        When checked, allows employee to access developer suites: DBMS Manager (SQL database console &amp; schema inspection) and engineering tools.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4E: VIEW-ONLY VS CAN EDIT DATA TICK BOX */}
              <div className={`p-4 rounded-2xl border transition-all ${
                canEditData ? 'border-emerald-400 bg-emerald-50/60 ring-1 ring-emerald-300' : 'border-amber-300 bg-amber-50/60 ring-1 ring-amber-200'
              }`}>
                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={canEditData}
                    onChange={(e) => setCanEditData(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Edit2 className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold text-slate-900">Can they only view or can they also edit those data</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        canEditData
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {canEditData ? 'CAN EDIT DATA (Read & Write)' : 'VIEW-ONLY (Read-Only Mode)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {canEditData
                        ? 'Checked = Write Permissions Enabled: Employee is authorized to update clinician profiles, modify payer application statuses, manage uploaded documents, and edit dates.'
                        : 'Unchecked = View-Only Mode: Employee can browse dashboards and records, but cannot edit, update, delete, or submit alterations to clinical or credentialing data.'}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#2B4C9D] hover:bg-[#203a7a] text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isEditing ? 'Save User Account Changes' : 'Create & Provision User Login'}</span>
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleOpenCreateNew}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 2: USER ACCOUNTS ROSTER */}
      {/* ========================================================= */}
      {activeSubTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Super Admin Access Notification Banner */}
          {isCurrentSuperAdmin && (
            <div className="px-5 py-3 bg-indigo-50/80 border-b border-indigo-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-indigo-950 font-semibold">
                <Crown className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Super Administrator Governance Active — Manage user account provisioning, role delegations, and security credentials with full audit tracking.</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200/60 text-indigo-900 border border-indigo-300 shrink-0">
                GOVERNANCE ACTIVE
              </span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, or role..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2B4C9D]"
                />
              </div>

              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
              >
                <option value="All">All Roles ({accounts.length})</option>
                {SYSTEM_ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>

              {/* Access level */}
              <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-xs">
                {(['All', 'ADMINISTRATOR', 'USER'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setAccessFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      accessFilter === lvl ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl === 'All' ? 'All Privileges' : lvl === 'ADMINISTRATOR' ? 'Admins' : 'Standard Users'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleOpenCreateNew}
              className="px-3 py-1.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer self-end sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Table / List */}
          <div className="divide-y divide-slate-100">
            {filteredAccounts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No users found matching current filter criteria.
              </div>
            ) : (
              filteredAccounts.map((acc) => {
                const isCurrent = currentAccount?.id === acc.id;
                const matchedRole = SYSTEM_ROLES.find(r => r.id === acc.systemRole || r.title === acc.roleTitle) || SYSTEM_ROLES[0];
                const activePermsCount = acc.permissions?.length ?? matchedRole.responsibilities.length;

                return (
                  <div key={acc.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs ${
                        acc.accessLevel === 'ADMINISTRATOR' ? 'bg-[#2B4C9D]' : 'bg-slate-600'
                      }`}>
                        {acc.name ? acc.name.charAt(0) : 'U'}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{acc.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#2B4C9D] border border-indigo-200">
                              Current Session
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${matchedRole.badgeColor}`}>
                            {matchedRole.title}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            acc.accessLevel === 'ADMINISTRATOR'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {acc.accessLevel === 'ADMINISTRATOR' ? 'Admin' : 'Standard'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                          <span className="flex items-center space-x-1 font-mono">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{acc.email}</span>
                          </span>
                          {acc.department && (
                            <span className="flex items-center space-x-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{acc.department}</span>
                            </span>
                          )}
                          <span className="text-slate-400 font-medium">
                            • {acc.status || 'Active'}
                          </span>
                        </div>

                        {/* First Sign-On Status & Password Audit Box */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {acc.mustChangePasswordOnFirstLogin ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center space-x-1">
                              <Key className="w-2.5 h-2.5 text-amber-600" />
                              <span>First Sign-on Password Change: Required</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-1">
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                              <span>First Sign-on Password: Completed</span>
                            </span>
                          )}

                          {/* Credential Status - Zero Knowledge Encrypted (HIPAA §164.308 / ISO A.8.5) */}
                          <div className="inline-flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="font-semibold text-slate-800">Credential:</span>
                            <span className="font-mono text-slate-600">Encrypted (Zero-Knowledge)</span>
                          </div>
                        </div>

                        {/* Configured Granular Permissions Indicators */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                          {/* Entity Control Badge */}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center space-x-1">
                            <Building2 className="w-2.5 h-2.5 text-[#2B4C9D]" />
                            <span>
                              Entities: {acc.assignedEntities && acc.assignedEntities.length > 0 
                                ? (acc.assignedEntities.length === entities.length ? 'All 3 Entities' : `${acc.assignedEntities.length} Selected`)
                                : 'All Entities'}
                            </span>
                          </span>

                          {/* Pages Allowed Badge */}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center space-x-1">
                            <Layers className="w-2.5 h-2.5 text-slate-500" />
                            <span>
                              Pages: {acc.allowedTabs && acc.allowedTabs.length > 0 ? `${acc.allowedTabs.length} Viewable` : 'Default Scope'}
                            </span>
                          </span>

                          {/* Admin Dashboard Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-flex items-center space-x-1 ${
                            acc.canAccessAdmin || acc.accessLevel === 'ADMINISTRATOR'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>Admin: {acc.canAccessAdmin || acc.accessLevel === 'ADMINISTRATOR' ? 'Yes' : 'No'}</span>
                          </span>

                          {/* Dev Dashboard Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-flex items-center space-x-1 ${
                            acc.canAccessDev || acc.systemRole === 'Developer'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            <Key className="w-2.5 h-2.5" />
                            <span>Dev: {acc.canAccessDev || acc.systemRole === 'Developer' ? 'Yes' : 'No'}</span>
                          </span>

                          {/* Edit vs View-Only Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-flex items-center space-x-1 ${
                            acc.canEditData !== false
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            <Edit2 className="w-2.5 h-2.5" />
                            <span>{acc.canEditData !== false ? 'Can Edit Data' : 'View-Only Access'}</span>
                          </span>
                        </div>

                        {acc.assignedDisciplines && (
                          <div className="flex items-center space-x-1 pt-0.5">
                            {acc.assignedDisciplines.map(d => (
                              <span key={d} className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end md:self-center">
                      <button
                        type="button"
                        onClick={async () => {
                          setSendingEmailUserId(acc.id);
                          const res = await sendOnboardingEmail(acc);
                          setSendingEmailUserId(null);
                          if (res.success) {
                            showToast(`AESAS Onboarding credentials email dispatched to ${acc.email}!`, 'success');
                          } else {
                            showToast(res.error || 'Failed to dispatch email.', 'error');
                          }
                        }}
                        disabled={sendingEmailUserId === acc.id}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2B4C9D] rounded-xl text-xs font-semibold inline-flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
                        title="Send AESAS Onboarding Email with 1st Login Credentials"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{sendingEmailUserId === acc.id ? 'Sending...' : 'Send Onboarding Email'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(acc)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-[#2B4C9D] rounded-xl text-xs font-semibold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Edit User and Permissions"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {!isCurrent && (
                        <button
                          onClick={() => {
                            setDeleteTargetUser(acc);
                            setDeleteConfirmationInput('');
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: ROLE PERMISSIONS MATRIX & CAPABILITIES */}
      {/* ========================================================= */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#2B4C9D]">
                Organizational Role-Based Access Control (RBAC) Specification
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                The 8 system roles define operational scopes, document handling authority, and reporting access.
              </p>
            </div>
            <button
              onClick={handleOpenCreateNew}
              className="px-3 py-1.5 bg-[#2B4C9D] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#203a7a] transition-all cursor-pointer"
            >
              + Create User for Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SYSTEM_ROLES.map((role) => (
              <div key={role.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{role.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${role.badgeColor}`}>
                        {role.defaultAccessLevel}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Category: {role.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {role.description}
                </p>

                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    In-Scope Responsibilities & Permissions ({role.responsibilities.length}):
                  </span>
                  <div className="space-y-1.5">
                    {role.responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2B4C9D] mt-1.5 shrink-0" />
                        <span className="leading-snug">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {accounts.filter(a => a.systemRole === role.id || a.roleTitle?.includes(role.id)).length} Active Users
                  </span>
                  <button
                    onClick={() => {
                      setSelectedRole(role.id);
                      handleRoleChange(role.id);
                      setActiveSubTab('create');
                    }}
                    className="text-xs text-[#2B4C9D] hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Provision User &rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 4: SUPER ADMIN ACCESS REQUEST APPROVAL WORKFLOW */}
      {/* ========================================================= */}
      {activeSubTab === 'requests' && isCurrentSuperAdmin && (
        <AccessRequestsView
          onBackToDashboard={onBackToDashboard}
          onNavigateToUsers={() => setActiveSubTab('roster')}
        />
      )}

      {/* ========================================================= */}
      {/* MANDATORY DELETE CONFIRMATION POPUP MODAL (delete-user-[userid]) */}
      {/* ========================================================= */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Confirm User Account Deletion</h3>
                  <p className="text-xs text-rose-600 font-semibold">45 CFR §164.308 Termination Procedures</p>
                </div>
              </div>

              <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 mb-4 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Account Name:</span>
                  <span className="text-slate-900 font-bold">{deleteTargetUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Email Address:</span>
                  <span className="text-slate-900 font-mono text-[11px]">{deleteTargetUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Role / Access:</span>
                  <span className="text-slate-900 font-semibold">{deleteTargetUser.systemRole || deleteTargetUser.accessLevel}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-rose-200/60">
                  <span className="text-slate-600 font-medium">User ID:</span>
                  <span className="text-indigo-700 font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-200">{deleteTargetUser.id}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                This action will permanently delete the user account and revoke all active sessions immediately. To confirm deletion, type:
              </p>

              <div className="mb-3">
                <span className="block font-mono font-bold text-rose-700 bg-rose-100/80 px-3 py-2 rounded-lg border border-rose-300 select-all text-center tracking-wider text-xs">
                  delete-user-{deleteTargetUser.id}
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Type the confirmation phrase exactly as shown:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationInput}
                  onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                  placeholder={`delete-user-${deleteTargetUser.id}`}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-rose-500 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteTargetUser(null);
                    setDeleteConfirmationInput('');
                  }}
                  disabled={isDeletingUser}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmationInput.trim() !== `delete-user-${deleteTargetUser.id}` || isDeletingUser}
                  onClick={async () => {
                    if (deleteConfirmationInput.trim() === `delete-user-${deleteTargetUser.id}`) {
                      setIsDeletingUser(true);
                      await handleDeleteUser(deleteTargetUser.id);
                      setIsDeletingUser(false);
                      setDeleteTargetUser(null);
                      setDeleteConfirmationInput('');
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  {isDeletingUser ? (
                    <span>Revoking & Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Permanently Delete User</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
