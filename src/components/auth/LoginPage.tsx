import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import fullLogoImg from '../../assets/images/proficio_brand_logo_1787774889684.jpg';

export const LoginPage: React.FC = () => {
  const { login, sessionTimeoutMessage } = useCredentialing();
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Invalid email or password.');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        {/* Prominent Large Brand Image Header */}
        <div className="text-center flex flex-col items-center">
          <div className="p-4 sm:p-5 bg-white rounded-2xl shadow-xs border border-slate-200/90 w-full flex justify-center items-center">
            <img
              src={fullLogoImg}
              alt="Proficio Therapy - An EdTheory Affiliate"
              referrerPolicy="no-referrer"
              className="h-24 sm:h-28 w-auto max-w-full object-contain select-none"
            />
          </div>
        </div>

        {/* 20-Minute Session Timeout Alert */}
        {sessionTimeoutMessage && (
          <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-900 shadow-xs">
            <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold">Session Timed Out</p>
              <p className="text-amber-800 mt-0.5">{sessionTimeoutMessage}</p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Sign In to Credentialing Hub
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials to access the provider & payer tracking portal.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@proficiotherapy.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Role Profile Quick-Select & Constraint Inspector */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Test System Role Profiles & Constraints
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">8 Profiles</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Click any profile below to populate credentials and test role-restricted tab constraints and first-login password updates:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {[
              {
                role: 'Super Administrator',
                email: 'superadmin@proficiotherapy.com',
                pw: 'superadmin123',
                badge: 'bg-amber-50 text-amber-900 border-amber-200',
                scope: 'Full Access & View Passwords',
              },
              {
                role: 'Credentialing Lead',
                email: 'manager@proficiotherapy.com',
                pw: 'proficioadmin',
                badge: 'bg-blue-50 text-blue-800 border-blue-200',
                scope: 'Workflow & User Admin',
              },
              {
                role: 'Credentialing Specialist',
                email: 'specialist@proficiotherapy.com',
                pw: 'user123',
                badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                scope: 'Apps, Providers, Linking',
              },
              {
                role: 'Billing & Claims',
                email: 'billing@proficiotherapy.com',
                pw: 'user123',
                badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
                scope: 'Linking, Payers, Reports',
              },
              {
                role: 'HR/Operations',
                email: 'hroperations@proficiotherapy.com',
                pw: 'user123',
                badge: 'bg-violet-50 text-violet-800 border-violet-200',
                scope: 'Providers, Locations, Entities',
              },
              {
                role: 'Clinical Team',
                email: 'clinical@proficiotherapy.com',
                pw: 'user123',
                badge: 'bg-teal-50 text-teal-800 border-teal-200',
                scope: 'Clinical Staff & Reports',
              },
              {
                role: 'Leadership / Mgmt',
                email: 'leadership@proficiotherapy.com',
                pw: 'proficio',
                badge: 'bg-purple-50 text-purple-800 border-purple-200',
                scope: 'Reports & Dashboard',
              },
              {
                role: 'Rendering Provider',
                email: 'provider@proficiotherapy.com',
                pw: 'user123',
                badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
                scope: 'Self Profile & Apps',
              },
            ].map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => {
                  setEmail(p.email);
                  setPassword(p.pw);
                  setError(null);
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-[#2B4C9D]/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 group-hover:text-[#2B4C9D] truncate">
                    {p.role}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${p.badge}`}>
                    {p.scope}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                  {p.email}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
