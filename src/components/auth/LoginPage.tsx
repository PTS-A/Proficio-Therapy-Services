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
  X,
  Copy,
  Check,
  ExternalLink,
  Key,
  UserPlus
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { ProficioLogo } from '../common/ProficioLogo';
import { RequestAccessPage } from './RequestAccessPage';
import { MfaVerificationView } from './MfaVerificationView';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, sessionTimeoutMessage, pendingMfaAccount, cancelMfa } = useCredentialing();

  if (pendingMfaAccount) {
    return (
      <MfaVerificationView
        account={pendingMfaAccount}
        onCancel={cancelMfa}
      />
    );
  }
  
  // Request Access Page State (for unregistered users)
  const [showRequestAccess, setShowRequestAccess] = useState(false);
  const [requestAccessEmail, setRequestAccessEmail] = useState('');

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showProviderSetupHelp, setShowProviderSetupHelp] = useState(false);
  const [showGoogleAccountPicker, setShowGoogleAccountPicker] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Access Control Verification Result Modal
  const [denialDetails, setDenialDetails] = useState<{
    step?: number;
    stepName?: string;
    code?: string;
    reason: string;
    email?: string;
  } | null>(null);

  if (showRequestAccess) {
    return (
      <RequestAccessPage
        initialEmail={requestAccessEmail}
        onBackToLogin={() => setShowRequestAccess(false)}
      />
    );
  }

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

    // Listen for broadcast messages from OAuth popup if used
    try {
      const channel = new BroadcastChannel('cred_auth_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          window.location.reload();
        } else if (event.data?.type === 'OAUTH_AUTH_DENIED') {
          setDenialDetails({
            step: event.data.details?.step || 2,
            stepName: event.data.details?.stepName || 'Employee Check',
            code: event.data.details?.code || 'ACCESS_DENIED',
            reason: event.data.details?.reason || 'Access denied.',
            email: event.data.email,
          });
        }
      };
      return () => {
        channel.close();
      };
    } catch {}
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDenialDetails(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Invalid email or password. Please try again.');
      }
    }, 200);
  };

  const handleGoogleSignInClick = async (emailToUse?: string) => {
    setError(null);
    setDenialDetails(null);
    setShowProviderSetupHelp(false);

    const targetEmail = (emailToUse || email.trim()).toLowerCase();

    // If no email was specified, open the Google corporate account picker
    if (!targetEmail) {
      setShowGoogleAccountPicker(true);
      return;
    }

    setShowGoogleAccountPicker(false);
    setIsGoogleLoading(true);

    try {
      const res = await loginWithGoogle(targetEmail, 'popup');
      setIsGoogleLoading(false);

      if (!res.success) {
        if (res.step && res.step > 0) {
          setDenialDetails({
            step: res.step,
            stepName: res.stepName || 'Employee Access Control',
            code: res.code || 'ACCESS_DENIED',
            reason: res.error || 'Access Denied by corporate security gate.',
            email: targetEmail,
          });
        } else if (res.error?.includes('provider is not enabled') || res.error?.includes('Unsupported provider')) {
          setShowProviderSetupHelp(true);
        } else {
          setError(res.error || 'Failed to authenticate corporate identity.');
        }
      }
    } catch (err: any) {
      setIsGoogleLoading(false);
      setError('An error occurred during authentication: ' + (err.message || 'Unknown error'));
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

        {/* Google Workspace Account Selection Modal */}
        {showGoogleAccountPicker && (
          <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-xl text-xs space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sign in with Google</h3>
                  <p className="text-[11px] text-slate-500">Choose an account for Proficio Credentialing Hub</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleAccountPicker(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* Account 1: Joel Reji (Super Administrator) */}
              <button
                type="button"
                id="google-account-joel-reji"
                onClick={() => handleGoogleSignInClick('joel.reji@ageslearningsolutions.com')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  JR
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 truncate">
                      Joel Reji
                    </p>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                      Super Admin &bull; Owner
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    joel.reji@ageslearningsolutions.com
                  </p>
                </div>
              </button>

              {/* Account 2: Proficio Administrator */}
              <button
                type="button"
                id="google-account-admin-proficio"
                onClick={() => handleGoogleSignInClick('admin@proficiotherapy.com')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-[#2B4C9D] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  PA
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-900 truncate">
                      Proficio Administrator
                    </p>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                      System Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    admin@proficiotherapy.com
                  </p>
                </div>
              </button>
            </div>

            {/* Custom Google Workspace Input */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-[11px] font-medium text-slate-600">
                Or enter another corporate Google account:
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="name@ageslearningsolutions.com"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-indigo-400 focus:bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customGoogleEmail.trim()) {
                      e.preventDefault();
                      handleGoogleSignInClick(customGoogleEmail.trim());
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail.trim()}
                  onClick={() => handleGoogleSignInClick(customGoogleEmail.trim())}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg cursor-pointer transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Live OAuth Popup Option */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">External Provider:</span>
              <button
                type="button"
                onClick={async () => {
                  setShowGoogleAccountPicker(false);
                  setIsGoogleLoading(true);
                  try {
                    const res = await loginWithGoogle(undefined, 'popup');
                    setIsGoogleLoading(false);
                    if (!res.success) {
                      if (res.error?.includes('provider is not enabled') || res.error?.includes('Unsupported provider')) {
                        setShowProviderSetupHelp(true);
                      } else {
                        setError(res.error || 'Live OAuth verification failed.');
                      }
                    }
                  } catch (e: any) {
                    setIsGoogleLoading(false);
                    setError(e.message || 'OAuth error');
                  }
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer underline flex items-center space-x-1"
              >
                <span>Launch Supabase Live OAuth Popup</span>
                <ExternalLink className="w-3 h-3" />
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
                To enable live Google OAuth sign-in, follow these 3 quick steps in your Supabase Dashboard:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-slate-700 pt-1">
                <li>
                  Go to <span className="font-semibold text-slate-900">Authentication</span> &rarr; <span className="font-semibold text-slate-900">Providers</span> &rarr; <span className="font-semibold text-slate-900">Google</span> in your Supabase Dashboard.
                </li>
                <li>
                  Toggle <span className="font-semibold text-emerald-700">&ldquo;Enable Google provider&rdquo;</span> to <span className="font-semibold text-emerald-700">ON</span>.
                </li>
                <li>
                  In your <span className="font-semibold text-slate-900">Google Cloud Console</span> (APIs &amp; Services &rarr; Credentials), add this Callback URL to your OAuth 2.0 Web Client:
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
                <li>
                  Paste the <span className="font-semibold text-slate-900">Client ID</span> and <span className="font-semibold text-slate-900">Client Secret</span> into Supabase and click <span className="font-semibold text-slate-900">Save</span>.
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
                <ExternalLink className="w-3.5 h-3.5" />
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
              Enter your corporate email and password or authenticate with Google.
            </p>
          </div>

          {/* Standard Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Email / Password Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@proficiotherapy.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 focus:border-[#2B4C9D] transition-all text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-2.5 px-4 bg-[#2B4C9D] hover:bg-[#203a7a] active:bg-[#1a2f64] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Official Google OAuth Button */}
          <div>
            <button
              type="button"
              id="google-signin-button"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleSignInClick}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <div className="flex items-center space-x-2 text-slate-600">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-[#2B4C9D] rounded-full animate-spin"></div>
                  <span>Connecting to Google OAuth...</span>
                </div>
              ) : (
                <>
                  {/* Official Google G Logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span className="text-slate-800 font-semibold text-sm">
                    Sign in with Google
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Micro security note */}
          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Enterprise Authentication &bull; Supabase Database</span>
          </div>

          {/* Unregistered User Access Request Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Not registered in the system?{' '}
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
