import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { AccessLevel, AppAccount } from '../../types';
import { 
  AlertCircle, 
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
  X 
} from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setIsEditing(true);
    setEditingAccountId(null);
    setName('');
    setEmail('');
    setPassword('proficio');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#111E42] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#2B4C9D] rounded-xl text-white">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center space-x-2">
                <span>System User & Account Access Management</span>
                <span className="bg-[#00A651] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ADMINISTRATOR PRIVILEGES
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Add, delete, modify user accounts, and assign permissions (ADMINISTRATOR / USER)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Message */}
        {msg && (
          <div className={`p-3 text-xs flex items-center space-x-2 border-b ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Top Controls & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user by name, email, or role..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                />
              </div>

              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value as any)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white font-medium"
              >
                <option value="All">All Access Levels</option>
                <option value="ADMINISTRATOR">ADMINISTRATOR Only</option>
                <option value="USER">USER Only</option>
              </select>
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-[#2B4C9D] hover:bg-[#223E80] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New User Account</span>
            </button>
          </div>

          {/* Form Modal for Add/Edit */}
          {isEditing && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-[#2B4C9D]" />
                  <span>{editingAccountId ? 'Edit User Account' : 'Create New System Account'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Jessica Miller"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#2B4C9D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. jessica@proficiotherapy.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#2B4C9D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Access Level *</label>
                    <select
                      value={accessLevel}
                      onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-[#2B4C9D] focus:ring-2 focus:ring-[#2B4C9D]"
                    >
                      <option value="ADMINISTRATOR">ADMINISTRATOR (Full Access)</option>
                      <option value="USER">USER (Standard Operations)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. proficio"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#2B4C9D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Role Title</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Lead Enrollment Specialist"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#2B4C9D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department / Organization</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Ages Learning Solutions / Proficio Therapy"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#2B4C9D]"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00A651] hover:bg-[#008f45] text-white font-bold rounded-xl shadow-xs"
                  >
                    {editingAccountId ? 'Save Changes' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Accounts Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">User & Email</th>
                  <th className="px-4 py-3">Access Level</th>
                  <th className="px-4 py-3">Role & Department</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2.5">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                          acc.accessLevel === 'ADMINISTRATOR' ? 'bg-[#2B4C9D]' : 'bg-slate-600'
                        }`}>
                          {acc.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                            <span>{acc.name}</span>
                            {acc.id === currentAccount?.id && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                YOU
                              </span>
                            )}
                            {acc.email.toLowerCase() === 'demo@proficiotherapy.com' && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                                PRIMARY DEMO
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{acc.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {acc.accessLevel === 'ADMINISTRATOR' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EEF2FF] text-[#2B4C9D] border border-[#2B4C9D]/30">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#2B4C9D]" />
                          <span>ADMINISTRATOR</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>USER</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{acc.roleTitle || 'Specialist'}</div>
                      <div className="text-[11px] text-slate-500">{acc.department || 'Proficio Therapy'}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {acc.lastLogin || acc.createdAt}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {acc.id !== currentAccount?.id && (
                          <button
                            onClick={() => switchAccount(acc.id)}
                            title="Switch session to this user"
                            className="px-2 py-1 bg-slate-100 hover:bg-[#EEF2FF] text-slate-700 hover:text-[#2B4C9D] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Switch To
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEdit(acc)}
                          className="p-1.5 text-slate-600 hover:text-[#2B4C9D] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Account Details"
                        >
                          <UserCog className="w-4 h-4" />
                        </button>

                        {acc.email.toLowerCase() !== 'demo@proficiotherapy.com' && acc.id !== currentAccount?.id && (
                          <button
                            onClick={() => setDeleteConfirmId(acc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirmId && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-900">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>Are you sure you want to permanently delete this user account?</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
