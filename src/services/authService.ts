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
 * Initiates the Google OAuth popup flow or direct verification
 */
export async function initiateGoogleSignIn(
  emailOverride?: string,
  preferredFlow: 'popup' | 'redirect' = 'redirect'
): Promise<{ success: boolean; data?: VerificationResponse; error?: string }> {
  // If an explicit email was specified (e.g. from the test account switcher or direct prompt)
  if (emailOverride) {
    const result = await verifyEmployeeWithServer(emailOverride);
    if (!result.authorized) {
      return { success: false, error: result.reason, data: result };
    }
    return { success: true, data: result };
  }

  // Create unique OAuth session ID for cross-window, cross-tab, and cross-iframe synchronization
  const sessionId = 'oauth_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);

  // Pre-register session on server bridge
  fetch('/api/auth/session/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  }).catch(() => {});

  const redirectUrl = `${window.location.origin}/auth/callback?session_id=${sessionId}`;
  const authUrl = `https://uqaiotacheqjvfbanxtp.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}&prompt=select_account`;

  if (preferredFlow === 'redirect') {
    window.location.href = authUrl;
    return { success: false, error: 'Redirecting to Google Sign-In...' };
  }

  // Calculate geometry coordinates safely without NaN
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : (window.screenX || 0);
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : (window.screenY || 0);
  const screenWidth = window.innerWidth || (window.screen && window.screen.width) || 1024;
  const screenHeight = window.innerHeight || (window.screen && window.screen.height) || 768;
  const width = 500;
  const height = 650;
  const left = Math.max(0, Math.floor(dualScreenLeft + (screenWidth - width) / 2));
  const top = Math.max(0, Math.floor(dualScreenTop + (screenHeight - height) / 2));

  // Open the OAuth provider URL directly in popup synchronously during user click
  const popup = window.open(
    authUrl,
    'google_oauth_popup',
    `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
  );

  if (!popup) {
    // If popup was blocked by browser, fallback to direct redirect
    window.location.href = authUrl;
    return { success: false, error: 'Redirecting to Google Sign-In...' };
  }

  localStorage.removeItem('cred_oauth_denial');
  const startTime = Date.now();

  // Listen for popup callback message, server session completion, BroadcastChannel, or storage sync
  const oauthResult = await new Promise<{ 
    email?: string; 
    account?: any; 
    denial?: any; 
    error?: string 
  }>((resolve) => {
    let resolved = false;
    let channel: BroadcastChannel | null = null;

    const closePopupSafely = () => {
      try {
        if (popup && !popup.closed) {
          popup.close();
        }
      } catch (e) {}
      try {
        window.focus();
      } catch (e) {}
    };

    const cleanup = () => {
      resolved = true;
      clearTimeout(timeout);
      clearInterval(pollInterval);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
      if (channel) {
        try { channel.close(); } catch (e) {}
      }
      closePopupSafely();
    };

    // Listen on BroadcastChannel
    try {
      channel = new BroadcastChannel('cred_auth_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          cleanup();
          resolve({ email: event.data.email, account: event.data.account });
        } else if (event.data?.type === 'OAUTH_AUTH_DENIED') {
          cleanup();
          resolve({ denial: event.data.details, error: event.data.details?.reason });
        } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
          cleanup();
          resolve({ error: event.data.error || 'Authentication failed.' });
        }
      };
    } catch (e) {}

    const timeout = setTimeout(() => {
      if (!resolved) {
        cleanup();
        resolve({ error: 'Authentication window timed out. Please try again.' });
      }
    }, 90000);

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        cleanup();
        resolve({ email: event.data.email, account: event.data.account });
      } else if (event.data?.type === 'OAUTH_AUTH_DENIED') {
        cleanup();
        resolve({ denial: event.data.details, error: event.data.details?.reason });
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        cleanup();
        resolve({ error: event.data.error || 'Authentication failed.' });
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'cred_current_account' && event.newValue) {
        try {
          const acc = JSON.parse(event.newValue);
          if (acc && acc.email) {
            cleanup();
            resolve({ email: acc.email, account: acc });
          }
        } catch {}
      } else if (event.key === 'cred_oauth_denial' && event.newValue) {
        try {
          const denial = JSON.parse(event.newValue);
          cleanup();
          resolve({ denial, error: denial.reason });
        } catch {}
      }
    };

    // Polling server session status, localStorage, and popup closure status
    const pollInterval = setInterval(async () => {
      if (resolved) return;

      // 1. Check Server Session Bridge (reaches across iframe/tab boundaries)
      try {
        const statusRes = await fetch(`/api/auth/session/status?sessionId=${encodeURIComponent(sessionId)}`);
        if (statusRes.ok) {
          const sessionData = await statusRes.json();
          if (sessionData && sessionData.status === 'authorized' && sessionData.account) {
            cleanup();
            resolve({ email: sessionData.account.email, account: sessionData.account });
            return;
          } else if (sessionData && sessionData.status === 'denied') {
            cleanup();
            resolve({ denial: sessionData.details, error: sessionData.error || 'Access Denied' });
            return;
          }
        }
      } catch (e) {}

      // 2. Check Local Storage
      const saved = localStorage.getItem('cred_current_account');
      const lastActive = parseInt(localStorage.getItem('cred_last_activity') || '0', 10);
      if (saved && (!lastActive || lastActive >= startTime - 5000)) {
        try {
          const acc = JSON.parse(saved);
          if (acc && acc.email) {
            cleanup();
            resolve({ email: acc.email, account: acc });
            return;
          }
        } catch {}
      }

      const denialSaved = localStorage.getItem('cred_oauth_denial');
      if (denialSaved) {
        try {
          const denial = JSON.parse(denialSaved);
          cleanup();
          resolve({ denial, error: denial.reason });
          return;
        } catch {}
      }

      // 3. Check if user manually closed popup
      if (popup.closed) {
        setTimeout(async () => {
          if (!resolved) {
            // Final server session check
            try {
              const finalRes = await fetch(`/api/auth/session/status?sessionId=${encodeURIComponent(sessionId)}`);
              if (finalRes.ok) {
                const sessionData = await finalRes.json();
                if (sessionData && sessionData.status === 'authorized' && sessionData.account) {
                  cleanup();
                  resolve({ email: sessionData.account.email, account: sessionData.account });
                  return;
                }
              }
            } catch (e) {}

            const finalSaved = localStorage.getItem('cred_current_account');
            if (finalSaved) {
              try {
                const acc = JSON.parse(finalSaved);
                cleanup();
                resolve({ email: acc.email, account: acc });
                return;
              } catch {}
            }
            const finalDenial = localStorage.getItem('cred_oauth_denial');
            if (finalDenial) {
              try {
                const denial = JSON.parse(finalDenial);
                cleanup();
                resolve({ denial, error: denial.reason });
                return;
              } catch {}
            }
            cleanup();
            resolve({ error: 'Authentication window was closed. Click Continue with Google to try again.' });
          }
        }, 500);
      }
    }, 250);

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
  });

      if (oauthResult.denial) {
        return {
          success: false,
          error: oauthResult.denial.reason || 'Access Denied: Employee Access Control validation failed.',
          data: oauthResult.denial,
        };
      }

      if (oauthResult.account) {
        return {
          success: true,
          data: {
            authorized: true,
            step: 10,
            stepName: 'Application Access',
            code: 'AUTHORIZED',
            reason: 'Authorized employee access granted.',
            account: oauthResult.account,
          },
        };
      }

      if (oauthResult.email) {
        const result = await verifyEmployeeWithServer(oauthResult.email);
        if (!result.authorized) {
          return { success: false, error: result.reason, data: result };
        }
        return { success: true, data: result };
      }

      if (oauthResult.error) {
        return { success: false, error: oauthResult.error };
      }

      return {
        success: false,
        error: 'Authentication did not complete.',
      };
    }
