import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { AccessLevel, AppAccount } from '../../types';
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Key, 
  Mail, 
  Plus, 
  Search, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  User, 
  UserCheck, 
  UserCog, 
  UserPlus, 
  Users, 
  X,
  Edit2,
  Building2,
  Lock
} from 'lucide-react';

interface UserManagementViewProps {
  onBackToDashboard: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ onBackToDashboard }) => {
  const { accounts, currentAccount, isAdmin, createAccount, updateAccount, deleteAccount, switchAccount } = useCredentialing();

  const [searchQuery, setSearchQuery] = useState('');
  const [accessFilter, setAccessFilter] = useState<'All' | AccessLevel>('All');
  
  // Create / Edit Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('USER');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // If not admin, show clear restricted access message
  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">Administrator Privileges Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            You are currently signed in as a standard user ({currentAccount?.email}). User account provisioning and role assignments require full administrative credentials.
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

  const handleOpenCreate = () => {
    setIsEditing(true);
    setEditingAccountId(null);
    setName('');
    setEmail('');
    setPassword('');
    setAccessLevel('USER');
    setRoleTitle('Credentialing Specialist');
    setDepartment('Proficio Therapy Credentialing Hub');
    setMsg(null);
  };

  const handleOpenEdit = (acc: AppAccount) => {
    setIsEditing(true);
    setEditingAccountId(acc.id);
    setName(acc.name);
    setEmail(acc.email);
    setPassword(acc.password || '');
    setAccessLevel(acc.accessLevel);
    setRoleTitle(acc.roleTitle || '');
    setDepartment(acc.department || '');
    setMsg(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!name.trim() || !email.trim()) {
      setMsg({ type: 'error', text: 'Name and Email are mandatory fields.' });
      return;
    }

    if (editingAccountId) {
      // Update existing
      updateAccount(editingAccountId, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password || 'proficio',
        accessLevel,
        roleTitle: roleTitle.trim(),
        department: department.trim(),
      });
      setMsg({ type: 'success', text: `Account for ${name} updated successfully.` });
      setIsEditing(false);
    } else {
      // Create new
      const res = createAccount({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password || 'proficio',
        accessLevel,
        roleTitle: roleTitle.trim(),
        department: department.trim(),
      });

      if (res.success) {
        setMsg({ type: 'success', text: `New account ${name} (${accessLevel}) created successfully.` });
        setIsEditing(false);
      } else {
        setMsg({ type: 'error', text: res.error || 'Failed to create user account.' });
      }
    }
  };

  const handleDelete = (id: string) => {
    const res = deleteAccount(id);
    if (res.success) {
      setMsg({ type: 'success', text: 'User account removed.' });
      setDeleteConfirmId(null);
    } else {
      setMsg({ type: 'error', text: res.error || 'Cannot delete this account.' });
    }
  };

  const filteredAccounts = accounts.filter((a) => {
    if (accessFilter !== 'All' && a.accessLevel !== accessFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || (a.roleTitle && a.roleTitle.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-6">
      {/* Subpage Header Breadcrumb */}
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
              <span className="text-xs font-semibold text-slate-400">Settings / Administration</span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-[#2B4C9D]">User Management</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              User & Access Management
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {!isEditing && (
            <button
              onClick={handleOpenCreate}
              className="px-3.5 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create New User</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex items-center space-x-2">
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Form (if active) + Account Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create / Edit Form Card */}
        {isEditing && (
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <UserCog className="w-4 h-4 text-[#2B4C9D]" />
                <span>{editingAccountId ? 'Edit User Credentials' : 'Provision New System User'}</span>
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jessica Williams, OTR/L"
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jessica@proficiotherapy.com"
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {editingAccountId ? 'Password (Leave blank to keep existing)' : 'Initial Password *'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingAccountId ? '••••••••' : 'Enter login password'}
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Job Title</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Credentialing Lead, SLP Supervisor"
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Division</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Proficio Therapy Operations"
                  className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Access Role Privilege Level *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccessLevel('ADMINISTRATOR')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      accessLevel === 'ADMINISTRATOR'
                        ? 'border-[#2B4C9D] bg-indigo-50/60 text-[#2B4C9D] ring-1 ring-[#2B4C9D]'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2B4C9D]" />
                      <span>Administrator</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                      Full access to user administration, roster ingestion, configuration, and deletions.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccessLevel('USER')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      accessLevel === 'USER'
                        ? 'border-[#2B4C9D] bg-indigo-50/60 text-[#2B4C9D] ring-1 ring-[#2B4C9D]'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-xs">
                      <User className="w-3.5 h-3.5 text-slate-700" />
                      <span>Standard User</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                      Manage credentialing pipeline, providers, payers, documents, and reporting.
                    </p>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white font-semibold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  {editingAccountId ? 'Save Changes' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User Roster List */}
        <div className={`${isEditing ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden`}>
          {/* Controls bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or role..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2B4C9D]"
                />
              </div>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
                {(['All', 'ADMINISTRATOR', 'USER'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setAccessFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      accessFilter === lvl ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {lvl === 'All' ? 'All Roles' : lvl === 'ADMINISTRATOR' ? 'Admins' : 'Users'}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-semibold text-slate-400">
              Showing {filteredAccounts.length} user accounts
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="divide-y divide-slate-100">
            {filteredAccounts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No users found matching current criteria.
              </div>
            ) : (
              filteredAccounts.map((acc) => {
                const isCurrent = currentAccount?.id === acc.id;
                const isSystemAccount = acc.email.toLowerCase() === 'demo@proficiotherapy.com' || acc.email.toLowerCase() === 'admin@example.com';

                return (
                  <div key={acc.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                        acc.accessLevel === 'ADMINISTRATOR' ? 'bg-[#2B4C9D]' : 'bg-slate-600'
                      }`}>
                        {acc.name ? acc.name.charAt(0) : 'U'}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{acc.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#2B4C9D] border border-indigo-200">
                              Current Session
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            acc.accessLevel === 'ADMINISTRATOR'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {acc.accessLevel === 'ADMINISTRATOR' ? 'Administrator' : 'Standard User'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center space-x-1 font-mono">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{acc.email}</span>
                          </span>
                          {acc.roleTitle && (
                            <span>• {acc.roleTitle}</span>
                          )}
                          {acc.department && (
                            <span>• {acc.department}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenEdit(acc)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-medium inline-flex items-center space-x-1 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {!isSystemAccount && !isCurrent && (
                        <>
                          {deleteConfirmId === acc.id ? (
                            <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                              <span className="text-[10px] text-rose-700 font-semibold px-1">Delete?</span>
                              <button
                                onClick={() => handleDelete(acc.id)}
                                className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(acc.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium inline-flex items-center space-x-1 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
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
      </div>
    </div>
  );
};
