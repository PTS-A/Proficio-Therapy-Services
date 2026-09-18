import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Discipline } from '../../types';
import { ProficioLogo } from '../common/ProficioLogo';
import { subscribeToSyncStatus, getSyncStatus, triggerGlobalSync } from '../../lib/supabase';
import { 
  canAccessTab, 
  isSuperAdmin, 
  canManageUsers, 
  canPerformBulkImport, 
  canEditSystemSettings 
} from '../../utils/rbac';
import { 
  Building2, 
  ChevronDown, 
  FileText, 
  Layers, 
  MapPin, 
  Plus, 
  Users, 
  Bell,
  Database,
  UserCog,
  UserPlus,
  UserCheck,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  User,
  BarChart3,
  Sliders,
  Settings,
  Clock,
  Mail,
  RefreshCw,
  Smartphone,
  Menu,
  X,
} from 'lucide-react';

export type ActiveTabType = 
  | 'dashboard' 
  | 'tracker' 
  | 'linking' 
  | 'providers' 
  | 'payers' 
  | 'locations'
  | 'entities' 
  | 'reports'
  | 'users'
  | 'new-user'
  | 'import'
  | 'settings'
  | 'automations'
  | 'access-requests'
  | 'security-center'
  | 'google-authenticator';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  onOpenNewApplication: () => void;
  onOpenAddProvider: () => void;
  onOpenNotificationDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewApplication,
  onOpenAddProvider,
  onOpenNotificationDrawer,
}) => {
  const { 
    currentAccount, 
    isAdmin, 
    logout, 
    notifications, 
    sessionSecondsLeft,
    pendingAccessRequestsCount,
    isMfaSoftwareWideEnabled,
  } = useCredentialing();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const syncStatus = useSyncExternalStore(subscribeToSyncStatus, getSyncStatus, getSyncStatus);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    try {
      await triggerGlobalSync();
    } finally {
      setTimeout(() => setIsManualSyncing(false), 500);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bare basics for daily operational workflows - de-cluttered and non-duplicated
  const allNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Layers },
    { id: 'tracker' as const, label: 'Applications', icon: FileText },
    { id: 'linking' as const, label: 'Staff Linking', icon: Building2 },
    { id: 'providers' as const, label: 'Clinical Staff', icon: Users },
    { id: 'locations' as const, label: 'Locations', icon: MapPin },
    { id: 'payers' as const, label: 'Payers', icon: ShieldCheck },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
  ];

  // Strictly filter navigation items so users only see assigned tabs
  const navItems = allNavItems.filter((item) => canAccessTab(currentAccount, item.id));

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 lg:space-x-5 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center focus:outline-none hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              title="Proficio Credentialing Hub Home"
            >
              <ProficioLogo variant="full" size="sm" className="h-8 sm:h-9 w-auto object-contain" />
            </button>

            {/* Clean Navigation Links - Bare basics only */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`h-9 flex items-center space-x-1.5 px-2.5 lg:px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-blue-50/80 text-[#2B4C9D] font-bold border border-blue-200/50 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2B4C9D]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions - Perfectly Aligned at 36px (h-9) Height */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Supabase Live Sync Indicator */}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={syncStatus.isSyncing || isManualSyncing}
              className="hidden xl:flex items-center space-x-1.5 h-9 px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] text-slate-600 font-medium transition-colors cursor-pointer shrink-0"
              title="Supabase Database Real-Time Sync Status (Click to force refresh)"
            >
              <RefreshCw className={`w-3 h-3 ${syncStatus.isSyncing || isManualSyncing ? 'animate-spin text-[#2B4C9D]' : 'text-slate-400'}`} />
              <span className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 rounded-full ${syncStatus.isSyncing || isManualSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span>{syncStatus.isSyncing || isManualSyncing ? 'Syncing...' : 'DB Synced'}</span>
              </span>
            </button>

            {/* Quick Add Application Button */}
            <button
              onClick={onOpenNewApplication}
              className="flex items-center space-x-1.5 h-9 px-3 sm:px-3.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Application</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotificationDrawer}
              className="h-9 w-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer relative shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* User Profile / Menu Pill */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center space-x-2 h-9 px-2.5 rounded-lg border transition-colors text-left cursor-pointer shrink-0 ${
                  activeTab === 'users' || activeTab === 'settings' || activeTab === 'import' || activeTab === 'google-authenticator' || activeTab === 'security-center' || activeTab === 'access-requests' || activeTab === 'automations'
                    ? 'bg-blue-50/80 border-[#2B4C9D]/40 text-[#2B4C9D]'
                    : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#2B4C9D] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {currentAccount?.name ? currentAccount.name.charAt(0) : 'A'}
                </div>
                <div className="hidden sm:block text-left max-w-[110px] truncate">
                  <p className="text-xs font-semibold text-slate-800 leading-none truncate">
                    {currentAccount?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-none mt-0.5 truncate">
                    {isAdmin ? 'Administrator' : 'Specialist'}
                  </p>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu -> Contains ALL admin & governance features in one consolidated place */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-68 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Account Header */}
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 truncate max-w-[150px]">{currentAccount?.name || 'User'}</p>
                      {currentAccount?.authProvider === 'google' && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200" title="Authenticated via Google OAuth">
                          Google
                        </span>
                      )}
                      {isSuperAdmin(currentAccount) && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          SUPER ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{currentAccount?.email || 'demo@proficiotherapy.com'}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded truncate max-w-[140px] ${
                        isSuperAdmin(currentAccount)
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : isAdmin
                          ? 'bg-indigo-50 text-[#2B4C9D] border border-indigo-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {currentAccount?.systemRole || (isAdmin ? 'Administrator' : 'Specialist')}
                      </span>
                      <div 
                        title="Session automatically logs out after 20 minutes of inactivity"
                        className={`flex items-center space-x-1 text-[10px] font-mono ${
                          sessionSecondsLeft < 120 ? 'text-rose-600 font-bold' : 'text-slate-400'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{Math.floor(sessionSecondsLeft / 60)}m {String(sessionSecondsLeft % 60).padStart(2, '0')}s</span>
                      </div>
                    </div>
                  </div>

                  {/* Governance & Admin Section Header */}
                  {(isSuperAdmin(currentAccount) || isAdmin) && (
                    <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Administration & Security
                    </div>
                  )}

                  {/* Subpage Links */}
                  <div className="py-1">
                    {/* Google Authenticator MFA - Logs & Telemetry */}
                    {(isSuperAdmin(currentAccount) || isAdmin) && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('google-authenticator');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'google-authenticator' ? 'bg-blue-50 text-[#2B4C9D] font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-[#2B4C9D]" />
                          <span>Google Authenticator (MFA)</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isMfaSoftwareWideEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isMfaSoftwareWideEnabled ? 'ENFORCED' : 'OFF'}
                        </span>
                      </button>
                    )}

                    {/* Security & Compliance Center */}
                    {(isSuperAdmin(currentAccount) || isAdmin) && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('security-center');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'security-center' ? 'bg-rose-50 text-rose-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <span>Security & Compliance Center</span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                          KILL SWITCH
                        </span>
                      </button>
                    )}

                    {/* Employee Access Requests */}
                    {(isSuperAdmin(currentAccount) || isAdmin) && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('access-requests');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'access-requests' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                          <span>Employee Access Requests</span>
                        </div>
                        {pendingAccessRequestsCount > 0 ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                            {pendingAccessRequestsCount}
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400">Queue</span>
                        )}
                      </button>
                    )}

                    {/* User Profiles & RBAC Access Control */}
                    {canManageUsers(currentAccount) && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('new-user');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'new-user' || activeTab === 'users' ? 'bg-indigo-50 text-[#2B4C9D] font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <UserPlus className="w-4 h-4 text-[#2B4C9D]" />
                          <span>User Profiles & Access Control</span>
                        </div>
                      </button>
                    )}

                    {/* Automated Deadline Emails */}
                    {canAccessTab(currentAccount, 'automations') && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('automations');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'automations' ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-purple-600" />
                          <span>Automated Deadline Emails</span>
                        </div>
                      </button>
                    )}

                    {/* Spreadsheet Bulk Ingestion */}
                    {canPerformBulkImport(currentAccount) && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('import');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'import' ? 'bg-indigo-50 text-[#2B4C9D] font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-emerald-600" />
                          <span>Import Excel / Ingestion</span>
                        </div>
                      </button>
                    )}

                    {/* System Settings & SLA Configuration */}
                    {canEditSystemSettings(currentAccount) && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('settings');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'settings' ? 'bg-indigo-50 text-[#2B4C9D] font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>System Settings & Configuration</span>
                        </div>
                      </button>
                    )}

                    {canAccessTab(currentAccount, 'automations') && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('automations');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'automations' ? 'bg-indigo-50 text-[#2B4C9D] font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-[#2B4C9D]" />
                          <span>Automated Deadline Emails</span>
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center space-x-2 font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 flex md:hidden items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="flex md:hidden flex-wrap items-center gap-1.5 py-2.5 border-t border-slate-100 bg-slate-50/70 px-1 animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-[#2B4C9D] font-bold border border-blue-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2B4C9D]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
