/**
 * Developer Telemetry & Real-Time System Observability Service
 * Tracks user online presence, activity stream, system health, and client error capture.
 * Strictly zero mock data — all metrics come from live server events and real sessions.
 */

export interface OnlineUserSession {
  sessionId: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  currentTab: string;
  currentAction?: string;
  lastHeartbeat: number;
  firstSeen: number;
  ip: string;
  userAgent: string;
  status: 'Online' | 'Idle' | 'Offline';
  elapsedSeconds: number;
  sessionDurationMinutes: number;
}

export interface SystemHealthData {
  status: 'OPERATIONAL' | 'DEGRADED';
  uptimeSeconds: number;
  uptimeFormatted: string;
  serverPlatform: string;
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
  metrics: {
    totalRequestsHandled: number;
    totalErrorsCaught: number;
    averageLatencyMs: number;
    errorRatePct: number;
    activeHeartbeats: number;
  };
  services: Array<{
    name: string;
    status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
    latencyMs: number;
    port?: number;
    description: string;
  }>;
  timestamp: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  email: string;
  name: string;
  action: string;
  tab?: string;
  ip?: string;
}

export interface TelemetryErrorItem {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  path?: string;
  status?: number;
  userEmail?: string;
  severity: 'CRITICAL' | 'ERROR' | 'WARNING';
  resolved: boolean;
}

class TelemetryClient {
  private heartbeatInterval: any = null;
  private currentUser: { email: string; name: string; role: string; id?: string } | null = null;
  private currentTab: string = 'dashboard';
  private sessionId: string = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  private isListeningGlobalErrors: boolean = false;

  init() {
    if (typeof window === 'undefined' || this.isListeningGlobalErrors) return;

    // Attach global window error listeners to capture real unhandled errors
    window.addEventListener('error', (event) => {
      this.reportClientError({
        message: event.message || 'Uncaught Script Error',
        stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
        path: window.location.pathname,
        severity: 'ERROR',
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      this.reportClientError({
        message: `Unhandled Promise Rejection: ${reason?.message || String(reason)}`,
        stack: reason?.stack || '',
        path: window.location.pathname,
        severity: 'ERROR',
      });
    });

    this.isListeningGlobalErrors = true;
  }

  setCurrentUser(user: { email: string; name: string; role: string; id?: string } | null) {
    this.currentUser = user;
    if (user) {
      this.sendHeartbeat();
      this.startHeartbeatLoop();
    } else {
      this.stopHeartbeatLoop();
    }
  }

  setCurrentTab(tab: string, actionDesc?: string) {
    this.currentTab = tab;
    if (this.currentUser) {
      this.sendHeartbeat(actionDesc || `Navigated to ${tab}`);
    }
  }

  recordAction(action: string) {
    if (this.currentUser) {
      this.sendHeartbeat(action);
    }
  }

  private startHeartbeatLoop() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    // Send heartbeat every 12 seconds
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 12000);
  }

  private stopHeartbeatLoop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private async sendHeartbeat(action?: string) {
    if (!this.currentUser?.email) return;
    try {
      await fetch('/api/dev/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.currentUser.id,
          email: this.currentUser.email,
          name: this.currentUser.name,
          role: this.currentUser.role,
          currentTab: this.currentTab,
          action,
        }),
      });
    } catch {}
  }

  async reportClientError(error: { message: string; stack?: string; path?: string; severity?: 'CRITICAL' | 'ERROR' | 'WARNING' }) {
    try {
      await fetch('/api/dev/telemetry/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          path: error.path || window.location.pathname,
          userEmail: this.currentUser?.email || 'Guest Client',
          severity: error.severity || 'ERROR',
        }),
      });
    } catch {}
  }

  async fetchActiveUsers(): Promise<{ users: OnlineUserSession[]; totalOnlineCount: number; totalIdleCount: number }> {
    try {
      const res = await fetch('/api/dev/telemetry/active-users');
      if (!res.ok) throw new Error('Failed to fetch active users');
      return await res.json();
    } catch {
      return { users: [], totalOnlineCount: 0, totalIdleCount: 0 };
    }
  }

  async fetchSystemHealth(): Promise<SystemHealthData | null> {
    try {
      const res = await fetch('/api/dev/telemetry/system-health');
      if (!res.ok) throw new Error('Failed to fetch system health');
      return await res.json();
    } catch {
      return null;
    }
  }

  async fetchActivityFeed(): Promise<ActivityFeedItem[]> {
    try {
      const res = await fetch('/api/dev/telemetry/activity-feed');
      if (!res.ok) return [];
      const data = await res.json();
      return data.activities || [];
    } catch {
      return [];
    }
  }

  async fetchErrors(): Promise<{ errors: TelemetryErrorItem[]; unresolvedCount: number; criticalCount: number }> {
    try {
      const res = await fetch('/api/dev/telemetry/errors');
      if (!res.ok) return { errors: [], unresolvedCount: 0, criticalCount: 0 };
      return await res.json();
    } catch {
      return { errors: [], unresolvedCount: 0, criticalCount: 0 };
    }
  }

  async resolveError(id: string): Promise<boolean> {
    try {
      const res = await fetch('/api/dev/telemetry/resolve-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async clearResolvedErrors(): Promise<boolean> {
    try {
      const res = await fetch('/api/dev/telemetry/clear-resolved-errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async triggerDiagnosticTestError(message?: string): Promise<boolean> {
    try {
      const res = await fetch('/api/dev/telemetry/test-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message || 'Diagnostic Verification: Live test exception dispatched by developer',
          userEmail: this.currentUser?.email || 'dev@ageslearningsolutions.com',
          path: window.location.pathname,
          severity: 'ERROR',
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const telemetry = new TelemetryClient();
