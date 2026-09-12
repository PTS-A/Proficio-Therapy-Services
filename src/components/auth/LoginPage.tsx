import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserX,
  Building2,
  MapPin,
  CheckCircle2,
  XCircle,
  X,
  Copy,
  Check,
  ExternalLink,
  Key
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { ProficioLogo } from '../common/ProficioLogo';
import { fetchTestAccounts, TestAccountsData } from '../../services/authService';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, sessionTimeoutMessage } = useCredentialing();
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showProviderSetupHelp, setShowProviderSetupHelp] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Access Control Verification Result Modal
  const [denialDetails, setDenialDetails] = useState<{
    step?: number;
    stepName?: string;
    code?: string;
    reason: string;
    email?: string;
  } | null>(null);

  // Testing Drawer State
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [testAccounts, setTestAccounts] = useState<TestAccountsData | null>(null);
  const [customTestEmail, setCustomTestEmail] = useState('');

  useEffect(() => {
    fetchTestAccounts().then((data) => {
      if (data) setTestAccounts(data);
    });

    // Check for access control denial stored by OAuth callback
    const storedDenial = localStorage.getItem('cred_oauth_denial');
    if (storedDenial) {
      try {
        const parsed = JSON.parse(storedDenial);
        setDenialDetails({
          step: parsed.step || 2,
          stepName: parsed.stepName || 'Employee Check',
          code: parsed.code || 'ACCESS_DENIED',
          reason: parsed.reason || 'Access denied by Employee Access Control.',
          email: parsed.account?.email || 'Google Account',
        });
      } catch {}
      localStorage.removeItem('cred_oauth_denial');
    }

    // Clean up any query parameters from URL
    if (window.location.search.includes('denied') || window.location.search.includes('oauth_error')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

  const handleGoogleSignInClick = async (emailOverride?: string, preferredFlow: 'popup' | 'redirect' = 'redirect') => {
    setError(null);
    setDenialDetails(null);
    setIsGoogleLoading(true);

    try {
      const res = await loginWithGoogle(emailOverride, preferredFlow);
      setIsGoogleLoading(false);

      if (!res.success) {
        if (res.step && res.step < 10) {
          // Dedicated Access Control Denial Modal
          setDenialDetails({
            step: res.step,
            stepName: res.stepName,
            code: res.code,
            reason: res.error || 'Access Denied: Employee Access Control validation failed.',
            email: emailOverride || 'Google Account',
          });
        } else if (
          res.error?.includes('Unsupported provider') || 
          res.error?.includes('provider is not enabled') ||
          res.error === 'PROVIDER_NOT_ENABLED'
        ) {
          setShowProviderSetupHelp(true);
        } else {
          setError(res.error || 'Failed to authenticate via Google OAuth.');
        }
      }
    } catch (err: any) {
      setIsGoogleLoading(false);
      setError('An error occurred during Google sign in: ' + (err.message || 'Unknown error'));
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-lg space-y-5">
        {/* Large Brand Image Header */}
        <div className="text-center flex flex-col items-center">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xs border border-slate-200/90 w-full flex justify-center items-center">
            <ProficioLogo
              variant="full"
              size="2xl"
              className="max-w-full"
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

        {/* Employee Access Control Denial Alert Modal */}
        {denialDetails && (
          <div className="p-4 bg-rose-50/95 border border-rose-300 rounded-2xl shadow-xs text-xs text-rose-900 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 text-rose-800 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-sm">Employee Access Control &bull; Access Denied</span>
              </div>
              <button 
                onClick={() => setDenialDetails(null)}
                className="text-rose-400 hover:text-rose-700 cursor-pointer p-0.5"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-rose-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Authorization Step {denialDetails.step} of 10:</span>
                <span className="font-semibold text-rose-700">{denialDetails.stepName}</span>
              </div>
              <p className="text-xs font-semibold text-rose-950">{denialDetails.reason}</p>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                Security Code: {denialDetails.code || 'ACCESS_DENIED'} &bull; Identity: {denialDetails.email}
              </div>
            </div>

            <div className="text-[11px] text-rose-800 flex items-center justify-between">
              <span>Contact IT Governance or HR Department for profile resolution.</span>
              <button
                onClick={() => setDenialDetails(null)}
                className="font-semibold text-rose-700 hover:underline cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </div>
        )}

        {/* Google OAuth Provider Setup Instructions Modal */}
        {showProviderSetupHelp && (
          <div className="p-5 bg-amber-50/95 border border-amber-300 rounded-2xl shadow-sm text-xs text-amber-950 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <Key className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm">Enable Google Provider in Supabase Dashboard</span>
              </div>
              <button 
                onClick={() => setShowProviderSetupHelp(false)}
                className="text-amber-500 hover:text-amber-800 cursor-pointer p-0.5"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-2">
              <p className="font-semibold text-amber-900">
                Supabase returned: <code className="text-[11px] bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded font-mono">Unsupported provider: provider is not enabled</code>
              </p>
              <p className="text-slate-600 leading-relaxed">
                To enable live Google OAuth popups, follow these 3 quick steps in your Supabase Dashboard:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-slate-700 pt-1">
                <li>
                  Go to <span className="font-semibold text-slate-900">Authentication</span> &rarr; <span className="font-semibold text-slate-900">Providers</span> &rarr; <span className="font-semibold text-slate-900">Google</span> in your Supabase Dashboard.
                </li>
                <li>
                  Toggle <span className="font-semibold text-emerald-700">"Enable Google provider"</span> to <span className="font-semibold text-emerald-700">ON</span>.
                </li>
                <li>
                  In your <span className="font-semibold text-slate-900">Google Cloud Console</span> (APIs &amp; Services &rarr; Credentials), add this exact Callback URL to your OAuth 2.0 Web Client:
                  <div className="mt-1.5 flex items-center space-x-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
                    <span className="flex-1 truncate">https://uqaiotacheqjvfbanxtp.supabase.co/auth/v1/callback</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('https://uqaiotacheqjvfbanxtp.supabase.co/auth/v1/callback', 'callback')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-sans font-medium text-slate-700 flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      {copiedField === 'callback' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'callback' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </li>
                <li>
                  Paste the <span className="font-semibold text-slate-900">Client ID</span> and <span className="font-semibold text-slate-900">Client Secret</span> into Supabase and click <span className="font-semibold text-slate-900">Save</span>.
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              <a
                href="https://supabase.com/dashboard/project/uqaiotacheqjvfbanxtp/auth/providers"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Open Supabase Auth Providers</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowProviderSetupHelp(false);
                  setShowTestPanel(true);
                }}
                className="w-full sm:w-auto px-3 py-2 bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-950 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
              >
                <span>Test Corporate Employee Login Now &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Sign In to Credentialing Hub
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authenticate with your verified company Google account or enter credentials.
            </p>
          </div>

          {/* Standard Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* SCRIPT 2: Continue with Google Button (Direct Same-Page Authentication) */}
          <div className="space-y-3">
            <button
              type="button"
              id="google-signin-button"
              disabled={isGoogleLoading || isLoading}
              onClick={() => handleGoogleSignInClick(undefined, 'redirect')}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isGoogleLoading ? (
                <div className="flex items-center space-x-2 text-slate-600">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-[#2B4C9D] rounded-full animate-spin"></div>
                  <span>Signing in with Google...</span>
                </div>
              ) : (
                <>
                  {/* Authentic Official Google G Logo */}
                  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="text-slate-800 font-semibold text-sm">Continue with Google</span>
                </>
              )}
            </button>

            {/* Micro security note */}
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enterprise Identity &bull; Enforces 10-step employee access control</span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              or sign in with email
            </span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>

          {/* Traditional Sign In Form */}
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
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
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

          {/* Test Employee Access Control Interactive Drawer (For Testing Script 2 Scenarios) */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowTestPanel(!showTestPanel)}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#2B4C9D]" />
                <span>Test Google OAuth &amp; Access Control Scenarios</span>
              </div>
              {showTestPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTestPanel && (
              <div className="mt-3 p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-4 text-xs">
                <div>
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-bold mb-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Authorized Company Google Accounts (Success)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Click to authenticate through Google OAuth with active enrolled employees:
                  </p>
                  <div className="space-y-1.5">
                    {testAccounts?.authorizedAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => handleGoogleSignInClick(acc.email)}
                        className="w-full p-2 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                            <span>{acc.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-normal">
                              {acc.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                            <span>{acc.email}</span>
                            <span>&bull;</span>
                            <span>{acc.location}</span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 opacity-60 group-hover:opacity-100 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-1.5 text-rose-700 font-bold mb-1.5">
                    <UserX className="w-3.5 h-3.5" />
                    <span>Security Denial Test Cases (10-Step Chain Enforcement)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Click to test and verify rejection at specific access control gates:
                  </p>
                  <div className="space-y-1.5">
                    {testAccounts?.negativeTestCases.map((neg) => (
                      <button
                        key={neg.email}
                        type="button"
                        onClick={() => handleGoogleSignInClick(neg.email)}
                        className="w-full p-2 bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                            <span>{neg.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded font-normal">
                              {neg.expectedStep}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            <span>{neg.email}</span> &bull; <span className="text-rose-600 font-medium">{neg.expectedResult}</span>
                          </div>
                        </div>
                        <XCircle className="w-4 h-4 text-rose-600 opacity-60 group-hover:opacity-100 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Google Email Tester */}
                <div className="pt-2 border-t border-slate-200/80">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Test Arbitrary Google Email Verification:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={customTestEmail}
                      onChange={(e) => setCustomTestEmail(e.target.value)}
                      placeholder="e.g. employee@proficiotherapy.com"
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#2B4C9D]"
                    />
                    <button
                      type="button"
                      disabled={!customTestEmail.includes('@')}
                      onClick={() => handleGoogleSignInClick(customTestEmail)}
                      className="px-3 py-1.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enterprise Security Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Proficio Therapy Services &bull; Credentialing &amp; Payer Enrollment Portal
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Protected by Supabase PostgreSQL RLS &bull; Google OAuth Identity Verification
          </p>
        </div>
      </div>
    </div>
  );
};
