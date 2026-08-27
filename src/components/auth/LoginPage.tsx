import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Clock,
  ShieldCheck,
  UserCheck
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

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleDirectDemoLogin = (demoEmail: string, demoPass: string) => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      const res = login(demoEmail, demoPass);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Invalid credentials');
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

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-[#2B4C9D]" />
              <span>Quick Demo Accounts</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDirectDemoLogin('demo@proficiotherapy.com', 'proficio')}
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-[#2B4C9D] rounded-xl text-left transition-colors cursor-pointer"
              >
                <p className="text-xs font-bold text-slate-800">Admin Account</p>
                <p className="text-[10px] text-slate-500 font-mono">demo@proficiotherapy.com</p>
                <p className="text-[10px] text-[#2B4C9D] font-semibold mt-1">1-Click Sign In &rarr;</p>
              </button>

              <button
                type="button"
                onClick={() => handleDirectDemoLogin('sanjay.tom@ageslearningsolutions.com', 'user123')}
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-[#2B4C9D] rounded-xl text-left transition-colors cursor-pointer"
              >
                <p className="text-xs font-bold text-slate-800">Specialist Account</p>
                <p className="text-[10px] text-slate-500 font-mono">sanjay.tom@ages...</p>
                <p className="text-[10px] text-[#2B4C9D] font-semibold mt-1">1-Click Sign In &rarr;</p>
              </button>
            </div>
          </div>
        </div>

        {/* Security & Inactivity Policy Note */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>HIPAA compliant: 20-minute automatic inactivity logout</span>
        </div>
      </div>
    </div>
  );
};
