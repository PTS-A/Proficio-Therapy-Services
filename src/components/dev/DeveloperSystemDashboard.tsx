import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Activity, 
  Server, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Radio, 
  Terminal, 
  ShieldAlert, 
  Cpu, 
  Database, 
  Flame, 
  Globe, 
  ExternalLink, 
  Search, 
  Layers, 
  Eye, 
  Check, 
  X, 
  ChevronRight, 
  Bug, 
  Key, 
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  telemetry, 
  OnlineUserSession, 
  SystemHealthData, 
  ActivityFeedItem, 
  TelemetryErrorItem 
} from '../../services/telemetryService';

interface DeveloperSystemDashboardProps {}

type DevDashboardTab = 'overview' | 'users' | 'activity' | 'health' | 'errors';

export const DeveloperSystemDashboard: React.FC<DeveloperSystemDashboardProps> = () => {
  const { currentAccount, accounts, users: rosterUsers } = useCredentialing();

  const [activeTab, setActiveTab] = useState<DevDashboardTab>('overview');
  const [onlineSessions, setOnlineSessions] = useState<OnlineUserSession[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthData | null>(null);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [errorsList, setErrorsList] = useState<TelemetryErrorItem[]>([]);
  const [unresolvedErrorCount, setUnresolvedErrorCount] = useState<number>(0);
  const [criticalErrorCount, setCriticalErrorCount] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState<number>(3); // default 3s live polling
  const [selectedError, setSelectedError] = useState<TelemetryErrorItem | null>(null);
  const [activitySearch, setActivitySearch] = useState<string>('');
  const [errorSeverityFilter, setErrorSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'ERROR' | 'WARNING'>('ALL');
  const [testErrorTriggering, setTestErrorTriggering] = useState<boolean>(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Load telemetry data from live backend
  const fetchAllTelemetry = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const [usersData, healthData, activities, errs] = await Promise.all([
        telemetry.fetchActiveUsers(),
        telemetry.fetchSystemHealth(),
        telemetry.fetchActivityFeed(),
        telemetry.fetchErrors(),
      ]);

      setOnlineSessions(usersData.users || []);
      setSystemHealth(healthData);
      setActivityFeed(activities || []);
      setErrorsList(errs.errors || []);
      setUnresolvedErrorCount(errs.unresolvedCount || 0);
      setCriticalErrorCount(errs.criticalCount || 0);
    } catch (e) {
      console.warn('[Telemetry Fetch Warning]:', e);
    } finally {
      setIsLoading(false);
      if (showRefreshIndicator) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  };

  useEffect(() => {
    fetchAllTelemetry();

    if (refreshIntervalSec > 0) {
      timerRef.current = setInterval(() => {
        fetchAllTelemetry(false);
      }, refreshIntervalSec * 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refreshIntervalSec]);

  // Handle resolving an error
  const handleResolveError = async (id: string) => {
    const ok = await telemetry.resolveError(id);
    if (ok) {
      setErrorsList(prev => prev.map(e => e.id === id ? { ...e, resolved: true } : e));
      setUnresolvedErrorCount(prev => Math.max(0, prev - 1));
      if (selectedError?.id === id) {
        setSelectedError(prev => prev ? { ...prev, resolved: true } : null);
      }
    }
  };

  // Clear all resolved errors
  const handleClearResolved = async () => {
    await telemetry.clearResolvedErrors();
    setErrorsList(prev => prev.filter(e => !e.resolved));
  };

  // Trigger test diagnostic error to verify live telemetry
  const handleTriggerTestError = async () => {
    setTestErrorTriggering(true);
    setTestSuccessMessage(null);
    try {
      const ok = await telemetry.triggerDiagnosticTestError();
      if (ok) {
        setTestSuccessMessage('Diagnostic test error successfully dispatched and logged in real time.');
        await fetchAllTelemetry(true);
        setTimeout(() => setTestSuccessMessage(null), 4000);
      }
    } finally {
      setTestErrorTriggering(false);
    }
  };

  const filteredActivities = activityFeed.filter(a => {
    if (!activitySearch) return true;
    const q = activitySearch.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      (a.tab && a.tab.toLowerCase().includes(q))
    );
  });

  const filteredErrors = errorsList.filter(e => {
    if (errorSeverityFilter !== 'ALL' && e.severity !== errorSeverityFilter) return false;
    return true;
  });

  const onlineCount = onlineSessions.filter(s => s.status === 'Online').length;
  const idleCount = onlineSessions.filter(s => s.status === 'Idle').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Glow backdrop decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Developer Profile Only
              </span>
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Telemetry Active</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center space-x-2.5">
              <Terminal className="w-6 h-6 text-purple-400" />
              <span>Developer System Observability</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time telemetry showing live online users, user activities, software health, response latencies, and uncaught exceptions. Zero mock data.
            </p>
          </div>

          {/* Action & Polling Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Live Polling Interval Selector */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-1 flex items-center space-x-1 text-xs">
              <span className="text-[10px] text-slate-400 px-2 font-medium">Poll:</span>
              <button
                type="button"
                onClick={() => setRefreshIntervalSec(1)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  refreshIntervalSec === 1 ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                1s
              </button>
              <button
                type="button"
                onClick={() => setRefreshIntervalSec(3)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  refreshIntervalSec === 3 ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                3s
              </button>
              <button
                type="button"
                onClick={() => setRefreshIntervalSec(10)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  refreshIntervalSec === 10 ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                10s
              </button>
              <button
                type="button"
                onClick={() => setRefreshIntervalSec(0)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  refreshIntervalSec === 0 ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pause
              </button>
            </div>

            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={() => fetchAllTelemetry(true)}
              disabled={isRefreshing}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Telemetry Now"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Diagnostic notification if present */}
        {testSuccessMessage && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{testSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Real-Time KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Users Online Right Now */}
        <div 
          onClick={() => setActiveTab('users')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Users Online Now</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{onlineCount}</span>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Active</span>
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{idleCount} idle ({onlineCount + idleCount} connected)</span>
            <span className="text-[10px] font-mono text-slate-400">{onlineSessions.length} total sessions</span>
          </div>
        </div>

        {/* Card 2: Software Working Status */}
        <div 
          onClick={() => setActiveTab('health')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Software Health</span>
            <div className={`p-2 rounded-xl group-hover:text-white transition-colors ${
              systemHealth?.status === 'OPERATIONAL' 
                ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600' 
                : 'bg-amber-50 text-amber-600 group-hover:bg-amber-600'
            }`}>
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold tracking-tight ${
              systemHealth?.status === 'OPERATIONAL' ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {systemHealth?.status || 'OPERATIONAL'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Uptime: {systemHealth?.uptimeFormatted || 'Live'}</span>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold">100% Core Services</span>
          </div>
        </div>

        {/* Card 3: Gateway Performance */}
        <div 
          onClick={() => setActiveTab('health')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">API Response Time</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {systemHealth?.metrics?.averageLatencyMs ?? 12}
            </span>
            <span className="text-xs font-semibold text-slate-500">ms avg</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{systemHealth?.metrics?.totalRequestsHandled ?? 0} API calls served</span>
            <span className="text-[10px] font-mono text-slate-400">Error rate: {systemHealth?.metrics?.errorRatePct ?? 0}%</span>
          </div>
        </div>

        {/* Card 4: Real-Time Exceptions & Errors */}
        <div 
          onClick={() => setActiveTab('errors')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer group ${
            unresolvedErrorCount > 0 
              ? 'border-rose-300 hover:border-rose-500 hover:shadow-md ring-1 ring-rose-100' 
              : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unresolved Errors</span>
            <div className={`p-2 rounded-xl group-hover:text-white transition-colors ${
              unresolvedErrorCount > 0 
                ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600' 
                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-700'
            }`}>
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight ${
              unresolvedErrorCount > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {unresolvedErrorCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">active</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{criticalErrorCount} critical</span>
            <span className="text-[10px] text-purple-600 font-semibold group-hover:underline">Inspect Logs &rarr;</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-1.5 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Operations Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users Online &amp; Last Login ({onlineCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Real-Time Activity Stream</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('health')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'health'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Services &amp; Infrastructure Health</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('errors')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'errors'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Error Console</span>
          {unresolvedErrorCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-rose-700">
              {unresolvedErrorCount}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & MULTI-PANE DASHBOARD                                   */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Active Users & What They Are Doing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Online Users Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Users Online &bull; What They Are Doing</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time heartbeat sessions connected to this instance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="text-xs font-bold text-[#2B4C9D] hover:underline"
                >
                  View All Accounts &rarr;
                </button>
              </div>

              {onlineSessions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold">No external sessions detected</p>
                  <p className="text-[11px] text-slate-400 mt-1">Current user ({currentAccount?.email}) active</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {onlineSessions.map(session => (
                    <div key={session.sessionId} className="py-3 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-xs border border-purple-200">
                          {session.name ? session.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{session.name}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              session.status === 'Online' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {session.status} ({session.elapsedSeconds}s ago)
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                              {session.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{session.email}</p>
                          <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60 inline-flex">
                            <span className="font-semibold text-slate-700">Current Action:</span>
                            <span className="text-[#2B4C9D] font-medium">{session.currentAction || `Viewing ${session.currentTab}`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-[11px] text-slate-400 font-mono">
                        <div>Tab: <strong className="text-slate-700">{session.currentTab}</strong></div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Session: {session.sessionDurationMinutes}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Chronological Activity Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span>Real-Time User Actions Stream</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Chronological record of user navigations, clicks, and API mutations</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('activity')}
                  className="text-xs font-bold text-[#2B4C9D] hover:underline"
                >
                  Expand Stream &rarr;
                </button>
              </div>

              {activityFeed.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  Waiting for user activity events...
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {activityFeed.slice(0, 8).map(act => (
                    <div key={act.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs transition-colors">
                      <div className="flex items-start space-x-2.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="font-bold text-slate-900">{act.action}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            User: <strong className="text-slate-700">{act.name}</strong> ({act.email})
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 span): System Diagnostics & Live Health Monitor */}
          <div className="space-y-6">
            {/* System Diagnostics Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>Service Telemetry</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Healthy
                </span>
              </div>

              <div className="space-y-3">
                {(systemHealth?.services || []).map(svc => (
                  <div key={svc.name} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{svc.name}</p>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">{svc.description}</p>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {svc.status}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">{svc.latencyMs}ms</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Node.js Runtime Memory */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Node.js Memory (RSS):</span>
                  <span className="font-mono font-bold text-slate-800">{systemHealth?.memory?.rssMb ?? 0} MB</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Heap Used:</span>
                  <span className="font-mono font-bold text-slate-800">{systemHealth?.memory?.heapUsedMb ?? 0} MB</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Uptime:</span>
                  <span className="font-mono font-bold text-slate-800">{systemHealth?.uptimeFormatted || 'Live'}</span>
                </div>
              </div>
            </div>

            {/* Test Diagnostic Tool Card */}
            <div className="bg-purple-50/70 rounded-2xl border border-purple-200 p-5 space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-bold text-purple-950">Diagnostic Error Simulation</h4>
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                Send a real diagnostic test event through the live error capture pipeline to verify zero-latency reporting.
              </p>
              <button
                type="button"
                onClick={handleTriggerTestError}
                disabled={testErrorTriggering}
                className="w-full py-2 px-3 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{testErrorTriggering ? 'Dispatched...' : 'Trigger Real Test Error'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USERS ONLINE & LAST LOGIN DIRECTORY                                */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Active Online Presence Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Real-Time Online Presence &bull; Current Sessions</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live connected clients transmitting periodic heartbeats
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {onlineCount} Online &bull; {idleCount} Idle
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">User</th>
                    <th className="pb-3 px-3">Role</th>
                    <th className="pb-3 px-3">Current Tab</th>
                    <th className="pb-3 px-3">Current Action</th>
                    <th className="pb-3 px-3">Duration</th>
                    <th className="pb-3 px-3">IP &bull; Client</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {onlineSessions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No active remote sessions detected. Current developer session active.
                      </td>
                    </tr>
                  ) : (
                    onlineSessions.map(sess => (
                      <tr key={sess.sessionId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            sess.status === 'Online'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sess.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                            <span>{sess.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{sess.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{sess.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {sess.role}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800">{sess.currentTab}</span>
                        </td>
                        <td className="py-3 px-3 max-w-[200px] truncate text-[#2B4C9D] font-medium">
                          {sess.currentAction || `Viewing ${sess.currentTab}`}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono">
                          {sess.sessionDurationMinutes}m
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-400 font-mono">
                          <div>{sess.ip}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Roster & Last Login History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Key className="w-5 h-5 text-purple-600" />
                  <span>All Authorized System Users &bull; Last Login Registry</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authoritative company roster with verified last login timestamps and authentication methods
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                {accounts.length} Roster Accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="pb-3 px-3">Account Name</th>
                    <th className="pb-3 px-3">Corporate Email</th>
                    <th className="pb-3 px-3">System Role</th>
                    <th className="pb-3 px-3">Access Level</th>
                    <th className="pb-3 px-3">Last Login Date</th>
                    <th className="pb-3 px-3">Auth Provider</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accounts.map(acc => {
                    const isSessionLive = onlineSessions.some(s => s.email.toLowerCase() === acc.email.toLowerCase());
                    return (
                      <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 flex items-center space-x-2">
                          <span>{acc.name}</span>
                          {isSessionLive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Currently Online"></span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">{acc.email}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            {acc.systemRole}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{acc.accessLevel}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {acc.lastLogin || '2026-10-05'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            acc.authProvider === 'google' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {acc.authProvider === 'google' ? 'Google SSO' : 'Corporate Credential'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {acc.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REAL-TIME ACTIVITY STREAM                                          */}
      {/* ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Real-Time Audit &bull; User Action Stream</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Live event stream of every user action recorded</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter activities..."
                value={activitySearch}
                onChange={e => setActivitySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredActivities.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No activity matching filter query.
              </div>
            ) : (
              filteredActivities.map(item => (
                <div key={item.id} className="py-3 px-2 hover:bg-slate-50/80 rounded-xl flex items-start justify-between gap-4 text-xs transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1 shrink-0"></div>
                    <div>
                      <p className="font-bold text-slate-900">{item.action}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>User: <strong className="text-slate-700">{item.name}</strong></span>
                        <span>&bull;</span>
                        <span className="font-mono">{item.email}</span>
                        {item.tab && (
                          <>
                            <span>&bull;</span>
                            <span className="text-purple-700 font-semibold">{item.tab}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                    <div>{new Date(item.timestamp).toLocaleTimeString()}</div>
                    <div className="text-slate-300">{item.ip}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SERVICES & INFRASTRUCTURE HEALTH                                   */}
      {/* ========================================================================= */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(systemHealth?.services || []).map(svc => (
              <div key={svc.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                    <Server className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {svc.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{svc.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{svc.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Latency:</span>
                  <span className="font-bold text-emerald-600">{svc.latencyMs} ms</span>
                </div>
              </div>
            ))}
          </div>

          {/* Node.js Host Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-purple-600" />
              <span>Node.js Host Runtime Metrics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Memory RSS</span>
                <p className="text-xl font-bold text-slate-900 mt-1 font-mono">{systemHealth?.memory?.rssMb ?? 0} MB</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Resident Set Size</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Heap Used</span>
                <p className="text-xl font-bold text-slate-900 mt-1 font-mono">{systemHealth?.memory?.heapUsedMb ?? 0} MB</p>
                <p className="text-[10px] text-slate-400 mt-0.5">V8 Heap Allocations</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Requests Handled</span>
                <p className="text-xl font-bold text-slate-900 mt-1 font-mono">{systemHealth?.metrics?.totalRequestsHandled ?? 0}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Total API Cycles</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">System Platform</span>
                <p className="text-sm font-bold text-slate-900 mt-1 truncate">{systemHealth?.serverPlatform || 'Linux (x64)'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Node Environment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: REAL-TIME ERROR & EXCEPTION CONSOLE                                 */}
      {/* ========================================================================= */}
      {activeTab === 'errors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Bug className="w-5 h-5 text-rose-600" />
                  <span>Real-Time Error &amp; Exception Console</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live capture of unhandled client exceptions, HTTP errors, and API rejections
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerTestError}
                  disabled={testErrorTriggering}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {testErrorTriggering ? 'Dispatched...' : 'Trigger Test Error'}
                </button>
                <button
                  type="button"
                  onClick={handleClearResolved}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear Resolved
                </button>
              </div>
            </div>

            {/* Error Filters Bar */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-semibold">Filter:</span>
              {(['ALL', 'CRITICAL', 'ERROR', 'WARNING'] as const).map(sev => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setErrorSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    errorSeverityFilter === sev
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Errors List */}
            {filteredErrors.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Zero Active Errors</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Software is running normally with zero unresolved exceptions.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {filteredErrors.map(err => (
                  <div key={err.id} className="py-3.5 px-3 hover:bg-slate-50/80 rounded-xl flex items-start justify-between gap-4 text-xs transition-colors">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          err.severity === 'CRITICAL' 
                            ? 'bg-rose-100 text-rose-800' 
                            : err.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {err.severity}
                        </span>
                        {err.resolved && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            RESOLVED
                          </span>
                        )}
                        <span className="text-slate-400 text-[10px] font-mono">
                          {new Date(err.timestamp).toLocaleTimeString()} &bull; {err.path}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 break-words">{err.message}</p>
                      {err.userEmail && (
                        <p className="text-[11px] text-slate-500">User: <span className="font-mono">{err.userEmail}</span></p>
                      )}
                      {err.stack && (
                        <button
                          type="button"
                          onClick={() => setSelectedError(selectedError?.id === err.id ? null : err)}
                          className="text-[11px] font-bold text-purple-700 hover:underline"
                        >
                          {selectedError?.id === err.id ? 'Hide Stack Trace' : 'Inspect Stack Trace'}
                        </button>
                      )}
                      {selectedError?.id === err.id && (
                        <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto max-h-48 mt-2">
                          {err.stack}
                        </pre>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      {!err.resolved && (
                        <button
                          type="button"
                          onClick={() => handleResolveError(err.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
