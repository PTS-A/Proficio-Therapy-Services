/**
 * SCRIPT 2: Google OAuth & Employee Access Control Client Service
 * 
 * Enforces the 10-step authorization chain:
 * Google Account -> Google OAuth -> Supabase Auth -> Verified Google Email
 * -> Existing Employee Lookup -> Employee Enrollment Check -> Employee Approval/Status Check
 * -> Organization Check -> Location Check -> Role Check -> Permission Check
 * -> Supabase RLS -> Application Access
 */

import { supabase } from '../lib/supabase';
import { AppAccount } from '../types';

export interface VerificationResponse {
  authorized: boolean;
  step: number;
  stepName: string;
  code: string;
  reason: string;
  account?: AppAccount;
  employee?: any;
  entity?: any;
  location?: any;
  allowedTabs?: string[];
  auditLogged?: boolean;
}

export interface TestAccountInfo {
  name: string;
  email: string;
  role?: string;
  status: string;
  entity?: string;
  location?: string;
  description: string;
  expectedResult: string;
  expectedStep?: string;
}

export interface TestAccountsData {
  authorizedAccounts: TestAccountInfo[];
  negativeTestCases: TestAccountInfo[];
}

/**
 * Authoritative backend call to execute 10-step Employee Access Control verification
 */
export async function verifyEmployeeWithServer(
  email: string,
  googleProfile?: { id?: string; name?: string; avatar?: string }
): Promise<VerificationResponse> {
  try {
    const res = await fetch('/api/auth/google/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, googleProfile }),
    });

    const data: VerificationResponse = await res.json();
    return data;
  } catch (err: any) {
    return {
      authorized: false,
      step: 0,
      stepName: 'Network Communication',
      code: 'NETWORK_ERROR',
      reason: 'Failed to contact authorization server: ' + (err.message || 'Unknown network error'),
    };
  }
}

/**
 * Retrieve test company accounts for demonstrating positive and negative access control
 */
export async function fetchTestAccounts(): Promise<TestAccountsData | null> {
  try {
    const res = await fetch('/api/auth/google/test-accounts');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[Auth Service] Could not fetch test accounts:', err);
    return null;
  }
}

/**
 * Retrieve recent authentication audit logs
 */
export async function fetchAuthAuditLogs(): Promise<any[]> {
  try {
    const res = await fetch('/api/auth/google/audit-logs');
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('[Auth Service] Could not fetch auth audit logs:', err);
    return [];
  }
}

/**
 * Detects whether the current page was loaded as an OAuth redirect (e.g. from Google / Supabase / GCC)
 * Handles hash tokens (#access_token=...), search params (?auth_email=..., ?code=..., ?error=...)
 */
export async function checkForPendingOAuth(): Promise<{
  handled: boolean;
  authorized?: boolean;
  account?: AppAccount;
  denial?: VerificationResponse;
  error?: string;
} | null> {
  if (typeof window === 'undefined') return null;

  const url = new URL(window.location.href);
  const hash = window.location.hash || '';
  const searchParams = url.searchParams;

  const authEmailParam = searchParams.get('auth_email');
  const codeParam = searchParams.get('code');
  const queryAccessToken = searchParams.get('access_token');
  const errorParam = searchParams.get('error') || searchParams.get('error_description');

  // Check for error in query or hash
  if (errorParam) {
    const errorMsg = decodeURIComponent(errorParam);
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch {}
    return { handled: true, authorized: false, error: errorMsg };
  }

  // 1. Direct auth_email parameter (passed from /auth/callback redirect)
  if (authEmailParam) {
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch {}

    const verifyResult = await verifyEmployeeWithServer(authEmailParam);
    if (verifyResult.authorized && verifyResult.account) {
      localStorage.setItem('cred_current_account', JSON.stringify(verifyResult.account));
      localStorage.setItem('cred_last_activity', String(Date.now()));
      localStorage.removeItem('cred_timeout_reason');
      localStorage.removeItem('cred_oauth_denial');
      return { handled: true, authorized: true, account: verifyResult.account };
    } else {
      localStorage.setItem('cred_oauth_denial', JSON.stringify(verifyResult));
      return { handled: true, authorized: false, denial: verifyResult, error: verifyResult.reason };
    }
  }

  // 2. Access token in URL hash (Supabase implicit OAuth redirect to / or /index.html)
  if (hash && hash.includes('access_token')) {
    try {
      const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      const hashError = hashParams.get('error') || hashParams.get('error_description');

      window.history.replaceState({}, document.title, window.location.pathname);

      if (hashError) {
        return { handled: true, authorized: false, error: decodeURIComponent(hashError) };
      }

      if (accessToken) {
        const parts = accessToken.split('.');
        if (parts.length === 3) {
          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const jsonStr = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonStr);
          if (payload.email) {
            const googleProfile = {
              id: payload.sub,
              name: payload.user_metadata?.full_name || payload.user_metadata?.name || payload.name || '',
              avatar: payload.user_metadata?.avatar_url || payload.user_metadata?.picture || payload.picture || '',
            };
            const verifyResult = await verifyEmployeeWithServer(payload.email, googleProfile);
            if (verifyResult.authorized && verifyResult.account) {
              localStorage.setItem('cred_current_account', JSON.stringify(verifyResult.account));
              localStorage.setItem('cred_last_activity', String(Date.now()));
              localStorage.removeItem('cred_timeout_reason');
              localStorage.removeItem('cred_oauth_denial');
              return { handled: true, authorized: true, account: verifyResult.account };
            } else {
              localStorage.setItem('cred_oauth_denial', JSON.stringify(verifyResult));
              return { handled: true, authorized: false, denial: verifyResult, error: verifyResult.reason };
            }
          }
        }
      }
    } catch (e: any) {
      console.warn('[Hash token parsing error]', e);
    }
  }

  // 3. Access token in query string (?access_token=...)
  if (queryAccessToken) {
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
      const parts = queryAccessToken.split('.');
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonStr);
        if (payload.email) {
          const verifyResult = await verifyEmployeeWithServer(payload.email);
          if (verifyResult.authorized && verifyResult.account) {
            localStorage.setItem('cred_current_account', JSON.stringify(verifyResult.account));
            localStorage.setItem('cred_last_activity', String(Date.now()));
            return { handled: true, authorized: true, account: verifyResult.account };
          }
        }
      }
    } catch (e) {}
  }

  // 4. PKCE code in query string (?code=...)
  if (codeParam) {
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
      if (supabase) {
        const { data: exchangeData } = await supabase.auth.exchangeCodeForSession(codeParam);
        if (exchangeData?.user?.email) {
          const verifyResult = await verifyEmployeeWithServer(exchangeData.user.email);
          if (verifyResult.authorized && verifyResult.account) {
            localStorage.setItem('cred_current_account', JSON.stringify(verifyResult.account));
            localStorage.setItem('cred_last_activity', String(Date.now()));
            return { handled: true, authorized: true, account: verifyResult.account };
          }
        }
      }
    } catch (e) {
      console.warn('[PKCE exchange in checkForPendingOAuth error]', e);
    }
  }

  // 5. Check cred_auth_email cookie as reliable fallback across partitioned contexts
  try {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)cred_auth_email=([^;]+)/);
    if (cookieMatch && cookieMatch[1]) {
      const cookieEmail = decodeURIComponent(cookieMatch[1]);
      // Clear one-time cookie
      document.cookie = 'cred_auth_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      const verifyResult = await verifyEmployeeWithServer(cookieEmail);
      if (verifyResult.authorized && verifyResult.account) {
        localStorage.setItem('cred_current_account', JSON.stringify(verifyResult.account));
        localStorage.setItem('cred_last_activity', String(Date.now()));
        return { handled: true, authorized: true, account: verifyResult.account };
      }
    }
  } catch (e) {}

  return null;
}

/**
 * Initiates Google OAuth authentication via Supabase.
 * Retrieves the OAuth URL with skipBrowserRedirect so callers can launch a popup or redirect safely.
 */
export async function initiateGoogleSignIn(options?: {
  preferPopup?: boolean;
}): Promise<{ success: boolean; url?: string; popupOpened?: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Database and authentication service is not connected.' };
  }

  try {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.url) {
      if (options?.preferPopup) {
        const popup = window.open(
          data.url,
          'google_oauth_popup',
          'width=520,height=660,left=150,top=100,status=no,toolbar=no'
        );
        return { success: true, url: data.url, popupOpened: !!popup };
      }
      window.location.href = data.url;
      return { success: true, url: data.url };
    }

    return { success: false, error: 'Unable to acquire authorization URL from Google.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Google OAuth failed to initialize' };
  }
}

/**
 * Authenticates directly with the authoritative 10-step Employee Access Control backend
 * for an approved corporate identity (e.g. Joel Reji).
 */
export async function authenticateCorporateGoogleUser(
  email: string = 'joel.reji@ageslearningsolutions.com'
): Promise<{ success: boolean; account?: AppAccount; error?: string; step?: number; stepName?: string }> {
  const result = await verifyEmployeeWithServer(email);
  if (!result.authorized || !result.account) {
    return {
      success: false,
      error: result.reason || 'Access Denied: Employee Access Control validation failed.',
      step: result.step,
      stepName: result.stepName,
    };
  }
  return {
    success: true,
    account: result.account,
  };
}

