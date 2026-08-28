import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { AccessLevel, AppAccount, Discipline, SystemRole } from '../../types';
import { SYSTEM_ROLES, SystemRoleDefinition } from '../../data/roleConfig';
import { 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
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
  EyeOff
} from 'lucide-react';

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
    entities 
  } = useCredentialing();

  const [activeSubTab, setActiveSubTab] = useState<'create' | 'roster' | 'matrix'>('create');
  
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
  const [selectedRole, setSelectedRole] = useState<SystemRole>('Credentialing Specialist');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('USER');
  const [department, setDepartment] = useState('Proficio Therapy Credentialing Hub');
  const [assignedDisciplines, setAssignedDisciplines] = useState<Discipline[]>(['ABA', 'Speech', 'OT']);
  const [assignedEntities, setAssignedEntities] = useState<string[]>(entities.map(e => e.id));
  const [customPermissions, setCustomPermissions] = useState<string[]>(
    SYSTEM_ROLES.find(r => r.id === 'Credentialing Specialist')?.responsibilities || []
  );

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selected role configuration
  const currentRoleDef = SYSTEM_ROLES.find(r => r.id === selectedRole) || SYSTEM_ROLES[0];

  // Handle role selection change
  const handleRoleChange = (roleId: SystemRole) => {
    setSelectedRole(roleId);
    const def = SYSTEM_ROLES.find(r => r.id === roleId);
    if (def) {
      setAccessLevel(def.defaultAccessLevel);
      setCustomPermissions([...def.responsibilities]);
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

  const togglePermission = (perm: string) => {
    setCustomPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const toggleDiscipline = (disc: Discipline) => {
    setAssignedDisciplines(prev => 
      prev.includes(disc) ? prev.filter(d => d !== disc) : [...prev, disc]
    );
  };

  const handleOpenCreateNew = () => {
    setIsEditing(false);
    setEditingAccountId(null);
    setName('');
    setEmail('');
    setPassword('');
    setSelectedRole('Credentialing Specialist');
    const defaultRole = SYSTEM_ROLES.find(r => r.id === 'Credentialing Specialist');
    setAccessLevel(defaultRole?.defaultAccessLevel || 'USER');
    setCustomPermissions(defaultRole ? [...defaultRole.responsibilities] : []);
    setDepartment('Proficio Therapy Credentialing Hub');
    setAssignedDisciplines(['ABA', 'Speech', 'OT']);
    setAssignedEntities(entities.map(e => e.id));
    setActiveSubTab('create');
    setToastMsg(null);
  };

  const handleOpenEdit = (acc: AppAccount) => {
    setIsEditing(true);
    setEditingAccountId(acc.id);
    setName(acc.name);
    setEmail(acc.email);
    setPassword(acc.password || '');
    const matchedRole = SYSTEM_ROLES.find(r => r.id === acc.systemRole || r.title === acc.roleTitle) || SYSTEM_ROLES[0];
    setSelectedRole((acc.systemRole as SystemRole) || matchedRole.id);
    setAccessLevel(acc.accessLevel);
    setDepartment(acc.department || 'Proficio Therapy Credentialing Hub');
    setAssignedDisciplines(acc.assignedDisciplines || ['ABA', 'Speech', 'OT']);
    setAssignedEntities(acc.assignedEntities || entities.map(e => e.id));
    setCustomPermissions(acc.permissions && acc.permissions.length > 0 ? acc.permissions : [...matchedRole.responsibilities]);
    setActiveSubTab('create');
    setToastMsg(null);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg(null);

    if (!name.trim() || !email.trim()) {
      setToastMsg({ type: 'error', text: 'Full Name and Email Address are required.' });
      return;
    }

    if (!editingAccountId && !password.trim()) {
      setToastMsg({ type: 'error', text: 'Please specify an initial password for the new user login.' });
      return;
    }

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
        permissions: customPermissions,
        status: 'Active'
      });
      setToastMsg({ type: 'success', text: `User login for ${name} (${selectedRole}) updated successfully.` });
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
        permissions: customPermissions,
        status: 'Active'
      });

      if (res.success) {
        setToastMsg({ type: 'success', text: `New user account "${name}" created with ${selectedRole} privileges.` });
        handleOpenCreateNew();
        setActiveSubTab('roster');
      } else {
        setToastMsg({ type: 'error', text: res.error || 'Failed to create user account.' });
      }
    }
  };

  const handleDeleteUser = (id: string) => {
    const res = deleteAccount(id);
    if (res.success) {
      setToastMsg({ type: 'success', text: 'User account removed.' });
      setDeleteConfirmId(null);
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Cannot delete system account.' });
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
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          toastMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex items-center space-x-2">
            {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="font-medium">{toastMsg.text}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 1: CREATE / EDIT USER LOGIN PAGE */}
      {/* ========================================================= */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Main Form Column */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSaveUser} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <UserCog className="w-4 h-4 text-[#2B4C9D]" />
                    <span>{isEditing ? `Editing User: ${name || 'User'}` : 'User Account Credentials & Profile'}</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Enter authentication details and assign organizational role.
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

              {/* Basic Details */}
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
              </div>

              {/* Password & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isEditing ? 'Password (Leave blank to keep existing)' : 'Login Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!isEditing}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isEditing ? '•••••••• (Unchanged)' : 'Enter initial secure password'}
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

              {/* System Role Selection Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select User Role Profile <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SYSTEM_ROLES.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => handleRoleChange(role.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-50/80 border-[#2B4C9D] ring-2 ring-[#2B4C9D]/30 shadow-xs'
                            : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">
                              {role.title}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {role.category}
                            </span>
                          </div>
                          {isSelected ? (
                            <span className="w-4 h-4 rounded-full bg-[#2B4C9D] text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${role.badgeColor}`}>
                            {role.defaultAccessLevel === 'ADMINISTRATOR' ? 'Admin Level' : 'Standard User'}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {role.responsibilities.length} Core Capabilities
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Administrative Security Privilege Override */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Access Level Privilege
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccessLevel('ADMINISTRATOR')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
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
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
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
                      Scoped operational access according to assigned role responsibilities and clinical disciplines.
                    </p>
                  </button>
                </div>
              </div>

              {/* Discipline Scoping */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Assigned Clinical Disciplines
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['ABA', 'Speech', 'OT'] as Discipline[]).map((disc) => {
                    const active = assignedDisciplines.includes(disc);
                    return (
                      <button
                        type="button"
                        key={disc}
                        onClick={() => toggleDiscipline(disc)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                          active
                            ? 'bg-[#2B4C9D] text-white border-[#2B4C9D]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{disc === 'ABA' ? 'Applied Behavior Analysis (ABA)' : disc === 'Speech' ? 'Speech-Language Pathology (Speech)' : 'Occupational Therapy (OT)'}</span>
                      </button>
                    );
                  })}
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
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Active Role Capabilities Preview & Customizer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Capabilities</span>
                  <h3 className="text-xs font-bold text-slate-900 mt-0.5 flex items-center space-x-1.5">
                    <span>{currentRoleDef.title} Scope</span>
                  </h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRoleDef.badgeColor}`}>
                  {customPermissions.length} Active
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {currentRoleDef.description}
              </p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    Role Responsibilities & Access Items:
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomPermissions([...currentRoleDef.responsibilities])}
                    className="text-[10px] text-[#2B4C9D] font-bold hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Reset Default</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {currentRoleDef.responsibilities.map((resp, idx) => {
                    const isGranted = customPermissions.includes(resp);
                    return (
                      <div
                        key={idx}
                        onClick={() => togglePermission(resp)}
                        className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start space-x-2.5 ${
                          isGranted
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950 font-medium'
                            : 'bg-slate-50/50 border-slate-200 text-slate-400 line-through'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center shrink-0 text-white ${
                          isGranted ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}>
                          {isGranted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-[11px] leading-snug flex-1">
                          {resp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-[#2B4C9D] space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-[#2B4C9D]" />
                  <span>Audit Trail & Role Compliance</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  Role assignments and custom permission modifications are recorded in the system audit log with timestamps and administrator ID.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 2: USER ACCOUNTS ROSTER */}
      {/* ========================================================= */}
      {activeSubTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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
                            • {activePermsCount} Active Capabilities
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
                        onClick={() => handleOpenEdit(acc)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-[#2B4C9D] rounded-xl text-xs font-semibold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Edit User and Permissions"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {!isCurrent && (
                        <>
                          {deleteConfirmId === acc.id ? (
                            <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-xl border border-rose-200">
                              <span className="text-[10px] text-rose-700 font-semibold px-1">Delete?</span>
                              <button
                                onClick={() => handleDeleteUser(acc.id)}
                                className="px-2 py-0.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-lg text-[10px] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(acc.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
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
    </div>
  );
};
