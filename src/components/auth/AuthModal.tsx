import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { AccessLevel, AppAccount } from '../../types';
import { ProficioLogo } from '../common/ProficioLogo';
import { 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  User, 
  UserPlus, 
  Users, 
  X,
  AlertCircle,
  ArrowRight,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isForceLogin?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isForceLogin = false,
}) => {
  const { currentAccount, accounts, login, createAccount, switchAccount } = useCredentialing();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAccessLevel, setRegAccessLevel] = useState<AccessLevel>('USER');
  const [regRoleTitle, setRegRoleTitle] = useState('Credentialing Specialist');
  const [regDepartment, setRegDepartment] = useState('Proficio Therapy Hub');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const res = login(email, password);
    if (res.success) {
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        if (onClose) onClose();
      }, 500);
    } else {
      setError(res.error || 'Failed to login.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regName.trim() || !regEmail.trim()) {
      setError('Name and Email are required.');
      return;
    }

    const res = createAccount({
      name: regName,
      email: regEmail,
      password: regPassword || 'proficio',
      accessLevel: regAccessLevel,
      roleTitle: regRoleTitle,
      department: regDepartment,
    });

    if (res.success && res.account) {
      login(regEmail, regPassword || 'proficio');
      setSuccessMsg(`Account created successfully as ${regAccessLevel}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        if (onClose) onClose();
      }, 600);
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('demo@proficiotherapy.com');
    setPassword('proficio');
    const res = login('demo@proficiotherapy.com', 'proficio');
    if (res.success) {
      setSuccessMsg('Logged in as Administrator (demo@proficiotherapy.com)');
      setTimeout(() => {
        setSuccessMsg(null);
        if (onClose) onClose();
      }, 500);
    }
  };

  const handleQuickStandardUser = () => {
    setEmail('sanjay.tom@ageslearningsolutions.com');
    setPassword('user123');
    const res = login('sanjay.tom@ageslearningsolutions.com', 'user123');
    if (res.success) {
      setSuccessMsg('Logged in as Standard User (Sanjay Tom)');
      setTimeout(() => {
        setSuccessMsg(null);
        if (onClose) onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#111E42] text-white p-6 relative">
          {!isForceLogin && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white rounded-xl shadow-xs inline-flex">
              <ProficioLogo variant="icon" size="sm" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center space-x-2">
                <span>Proficio Therapy Credentialing Hub</span>
              </h2>
              <p className="text-xs text-slate-300">An EdTheory Affiliate • Account Access & Security</p>
            </div>
          </div>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="bg-[#EEF2FF] border-b border-[#2B4C9D]/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#2B4C9D] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E86424]" />
              <span>One-Click Access for Evaluation</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
              demo@proficiotherapy.com / proficio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="flex items-center justify-between p-2.5 bg-[#2B4C9D] hover:bg-[#223E80] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-2 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <div>
                  <div className="font-bold flex items-center space-x-1">
                    <span>Demo Administrator</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-1 rounded">ALL ACCESS</span>
                  </div>
                  <div className="text-[10px] text-slate-300">Full Edit, Delete, Import & Config</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              type="button"
              onClick={handleQuickStandardUser}
              className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-2 text-left">
                <User className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Standard User</div>
                  <div className="text-[10px] text-slate-500">Specialist Pipeline Operations</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-3 font-bold text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'login'
                ? 'border-[#2B4C9D] text-[#2B4C9D] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In with Account
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-3 font-bold text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'register'
                ? 'border-[#2B4C9D] text-[#2B4C9D] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. demo@proficiotherapy.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (e.g. proficio)"
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Default credentials: <strong>demo@proficiotherapy.com</strong> / password: <strong>proficio</strong>
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2B4C9D] hover:bg-[#223E80] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Log In to Credentialing Hub</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. rachel@proficiotherapy.com"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Default: proficio"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Access Level *</label>
                  <select
                    value={regAccessLevel}
                    onChange={(e) => setRegAccessLevel(e.target.value as AccessLevel)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D] font-bold"
                  >
                    <option value="ADMINISTRATOR">ADMINISTRATOR (Full Edit, Delete & Import)</option>
                    <option value="USER">USER (Standard Pipeline Operations)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role Title</label>
                  <input
                    type="text"
                    value={regRoleTitle}
                    onChange={(e) => setRegRoleTitle(e.target.value)}
                    placeholder="e.g. Credentialing Lead"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. EdTheory Credentialing Hub"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                <strong>Access Level Summary:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li><strong>ADMINISTRATOR:</strong> Can ADD, DELETE, MODIFY providers, import fragmented Excel sheets, manage users, and bypass validation blocks.</li>
                  <li><strong>USER:</strong> Standard access to view rosters, submit applications, log follow-ups, and review pipeline records.</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00A651] hover:bg-[#008f45] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Log In</span>
                </button>
              </div>
            </form>
          )}

          {/* Existing Accounts Switcher List */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Available Accounts on this System:
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => {
                    switchAccount(acc.id);
                    if (onClose) onClose();
                  }}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    currentAccount?.id === acc.id
                      ? 'bg-[#EEF2FF] border-[#2B4C9D] text-[#2B4C9D]'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      acc.accessLevel === 'ADMINISTRATOR' ? 'bg-[#2B4C9D]' : 'bg-slate-600'
                    }`}>
                      {acc.name[0]}
                    </div>
                    <div>
                      <div className="font-bold">{acc.name}</div>
                      <div className="text-[10px] text-slate-500">{acc.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      acc.accessLevel === 'ADMINISTRATOR'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {acc.accessLevel}
                    </span>
                    {currentAccount?.id === acc.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#2B4C9D]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
