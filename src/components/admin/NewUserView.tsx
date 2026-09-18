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
    updateAccount, 
    deleteAccount,
    entities,
    pendingAccessRequestsCount,
    showToast
  } = useCredentialing();

  const [activeSubTab, setActiveSubTab] = useState<'create' | 'roster' | 'matrix' | 'requests'>('create');
  
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

  const [deleteTargetUser, setDeleteTargetUser] = useState<AppAccount | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const isCurrentSuperAdmin = isSuperAdmin(currentAccount);

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
    setSelectedRole((acc.systemRole as SystemRole) || matchedRole.id);
    setAccessLevel(acc.accessLevel);
    setDepartment(acc.department || 'Proficio Therapy Credentialing Hub');
    setAssignedDisciplines(acc.assignedDisciplines || ['ABA', 'Speech', 'OT']);
    setAssignedEntities(acc.assignedEntities || entities.map(e => e.id));
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

    // Access capabilities are programmed directly within the role configuration in code
    const programmedPermissions = [...currentRoleDef.responsibilities];

    if (editingAccountId) {
      updateAccount(editingAccountId, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim() || 'proficio',
        accessLevel,
        systemRole: selectedRole,
        roleTitle: currentRoleDef.title,
        department: department.trim(),
        assignedDisciplines,
        assignedEntities,
        permissions: programmedPermissions,
        mustChangePasswordOnFirstLogin,
        status: 'Active'
      });
      showToast(`User login for ${name} (${selectedRole}) updated successfully.`, 'success');
      setIsEditing(false);
      setEditingAccountId(null);
      setActiveSubTab('roster');
    } else {
      const res = createAccount({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim() || 'proficio',
        accessLevel,
        systemRole: selectedRole,
        roleTitle: currentRoleDef.title,
        department: department.trim(),
        assignedDisciplines,
        assignedEntities,
        permissions: programmedPermissions,
        mustChangePasswordOnFirstLogin,
        status: 'Active'
      });

      if (res.success) {
        showToast(`New user account "${name}" created with ${selectedRole} privileges.`, 'success');
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
                  onClick={() => setAccessLevel('ADMINISTRATOR')}
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
                  onClick={() => setAccessLevel('USER')}
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
