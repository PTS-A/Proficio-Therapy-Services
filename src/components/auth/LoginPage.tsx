import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock,
  ArrowRight, 
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  X,
  Copy,
  Check,
  Key,
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { initiateGoogleSignIn } from '../../services/authService';
import { ProficioLogo } from '../common/ProficioLogo';
import { RequestAccessPage } from './RequestAccessPage';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, sessionTimeoutMessage } = useCredentialing();

  // Request Access Page State (for unregistered users)
  const [showRequestAccess, setShowRequestAccess] = useState(false);
  const [requestAccessEmail, setRequestAccessEmail] = useState('');

  // Authentication Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
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
    if (window.location.search.includes('denied') || window.location.search.includes('oauth_error') || window.location.search.includes('403')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (showRequestAccess) {
    return (
      <RequestAccessPage
        initialEmail={requestAccessEmail}
        onBackToLogin={() => setShowRequestAccess(false)}
      />
    );
  }

  // Email + Password Sign In Handler
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDenialDetails(null);
    setShowProviderSetupHelp(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your corporate email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      const res = login(cleanEmail, password);
      setIsPasswordSubmitting(false);

      if (!res.success) {
        setError(res.error || 'Incorrect email or password. Please verify your credentials.');
      }
      // On success, login sets pendingMfaAccount in CredentialingContext, routing directly to MfaVerificationView
    } catch (err: any) {
      setIsPasswordSubmitting(false);
      setError('An error occurred during authentication: ' + (err?.message || 'Unknown error'));
    }
  };

  // Google OAuth SSO Sign In Handler (Redirects to Google SSO Account Chooser)
  const handleGoogleSignIn = async () => {
    setError(null);
    setDenialDetails(null);
    setShowProviderSetupHelp(false);
    setIsGoogleLoading(true);

    try {
      // Launch standard Google OAuth flow to prompt user with the Google Account Selector
      const res = await initiateGoogleSignIn({ preferPopup: false });
      if (!res.success) {
        setIsGoogleLoading(false);
        setError(res.error || 'Failed to initialize Google Single Sign-On.');
      }
      // If success, user's browser is navigated to Google's SSO page to select email
    } catch (err: any) {
      setIsGoogleLoading(false);
      setError('An error occurred during authentication: ' + (err?.message || 'Unknown error'));
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        {/* Brand Image Header */}
        <div className="text-center flex flex-col items-center">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xs border border-slate-200/90 w-full flex justify-center items-center">
            <ProficioLogo
              variant="full"
              size="2xl"
              className="max-w-full"
            />
          </div>
        </div>

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

            <div className="text-[11px] text-rose-800 flex items-center justify-between pt-1">
              <span>Unregistered staff or need portal access?</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  id="denial-request-access-button"
                  onClick={() => {
                    setRequestAccessEmail(denialDetails.email || email);
                    setShowRequestAccess(true);
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold cursor-pointer transition-colors flex items-center space-x-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Request Access</span>
                </button>
                <button
                  onClick={() => setDenialDetails(null)}
                  className="font-semibold text-rose-700 hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google OAuth Provider Setup Help Modal */}
        {showProviderSetupHelp && (
          <div className="p-5 bg-amber-50/95 border border-amber-300 rounded-2xl shadow-sm text-xs text-amber-950 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <Key className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm">Google OAuth Provider Setup</span>
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
                Supabase OAuth Provider: <code className="text-[11px] bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded font-mono">provider is not enabled</code>
              </p>
              <p className="text-slate-600 leading-relaxed">
                To configure live Google OAuth redirect, toggle the Google provider ON in your Supabase Auth dashboard and register your Google Cloud Client credentials:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-slate-700 pt-1">
                <li>
                  Go to <span className="font-semibold text-slate-900">Authentication</span> &rarr; <span className="font-semibold text-slate-900">Providers</span> &rarr; <span className="font-semibold text-slate-900">Google</span> in Supabase.
                </li>
                <li>
                  Toggle <span className="font-semibold text-emerald-700">&ldquo;Enable Google provider&rdquo;</span> to <span className="font-semibold text-emerald-700">ON</span>.
                </li>
                <li>
                  Authorized redirect URI:
                  <div className="mt-1.5 flex items-center space-x-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
                    <span className="flex-1 truncate">https://uqaiotacheqjvfbanxtp.supabase.co/auth/v1/callback</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('https://uqaiotacheqjvfbanxtp.supabase.co/auth/v1/callback', 'callback')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer transition-colors"
                      title="Copy URL"
                    >
                      {copiedField === 'callback' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
              </ol>
            </div>

            <div className="flex items-center justify-end pt-1">
              <a
                href="https://supabase.com/dashboard/project/uqaiotacheqjvfbanxtp/auth/providers"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Open Supabase Auth Providers</span>
              </a>
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
              Sign in using your corporate email and password or Google Single Sign-On, followed by Google Authenticator MFA.
            </p>
          </div>

          {/* Standard Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Email & Password Authentication Form */}
          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] transition-all text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Email/Password Sign In Submit Button */}
            <button
              type="submit"
              id="email-signin-button"
              disabled={isPasswordSubmitting || isGoogleLoading}
              className="w-full py-2.5 px-4 bg-[#2B4C9D] hover:bg-[#1a2f64] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isPasswordSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Clean Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2.5 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Official Google Sign-In Button */}
          <button
            type="button"
            id="google-signin-button"
            onClick={() => handleGoogleSignIn()}
            disabled={isGoogleLoading || isPasswordSubmitting}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isGoogleLoading ? (
              <div className="flex items-center space-x-2 text-slate-600">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-[#2B4C9D] rounded-full animate-spin"></div>
                <span>Validating Google Corporate SSO...</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span className="text-slate-800 font-bold text-sm">
                  Sign in with Google
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {/* Unregistered User Access Request Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Not yet registered in company roster?{' '}
              <button
                type="button"
                id="request-access-button"
                onClick={() => {
                  setRequestAccessEmail(email);
                  setShowRequestAccess(true);
                }}
                className="text-[#2B4C9D] hover:text-[#1a2f64] font-bold hover:underline cursor-pointer inline-flex items-center space-x-1"
              >
                <span>Request Access</span>
              </button>
            </p>
          </div>
        </div>

        {/* Enterprise Security Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            AGES &bull; Proficio Therapy &bull; Child&apos;s Play Therapy
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            HIPAA Compliant &bull; 10-Step Authorization Chain &bull; Google Authenticator MFA
          </p>
        </div>
      </div>
    </div>
  );
};

