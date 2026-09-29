import React, { useState, useRef, useEffect } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Discipline } from '../../types';
import { ProficioLogo } from '../common/ProficioLogo';
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
  Smartphone,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  MessageSquare,
  BellRing,
  Sparkles,
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
  | 'document-intake'
  | 'users' 
  | 'new-user' 
  | 'import' 
  | 'settings' 
  | 'automations' 
  | 'access-requests' 
  | 'security-center' 
  | 'google-authenticator' 
  | 'admin-dashboard' 
  | 'clinical-portal' 
  | 'staff-approvals'
  | 'aesas'
  | 'comments-roster';

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
    staffChangeRequests,
  } = useCredentialing();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary operational tabs
  const coreNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Layers },
    { id: 'providers' as const, label: 'Clinical Staff', icon: Users },
  ];

  // Secondary operational tabs
  const secondaryNavItems = [
    { id: 'document-intake' as const, label: 'Smart Intake', icon: Sparkles },
    { id: 'payers' as const, label: 'Payers', icon: ShieldCheck },
    { id: 'locations' as const, label: 'Locations', icon: MapPin },
    { id: 'comments-roster' as const, label: 'Comments Roster', icon: MessageSquare },
    { id: 'aesas' as const, label: 'AESAS Alerts', icon: BellRing },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
  ];

  // All navigation items for mobile drawer
  const allNavItems = [...coreNavItems, ...secondaryNavItems];

  // Strictly filter navigation items so users only see assigned tabs
  const filteredCoreItems = coreNavItems.filter((item) => canAccessTab(currentAccount, item.id));
  const filteredSecondaryItems = secondaryNavItems.filter((item) => canAccessTab(currentAccount, item.id));
  const navItems = allNavItems.filter((item) => canAccessTab(currentAccount, item.id));

  // Determine if active tab is in secondary items
  const activeSecondaryItem = filteredSecondaryItems.find((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Left: Logo & Brand + Sleek Navigation Tabs */}
          <div className="flex items-center space-x-3 lg:space-x-5 min-w-0">
            {/* Logo */}
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center focus:outline-none hover:opacity-90 transition-opacity cursor-pointer shrink-0 py-1"
              title="Proficio Credentialing Hub Home"
            >
              <ProficioLogo variant="horizontal" size="sm" className="h-7 sm:h-8 w-auto object-contain" />
            </button>

            {/* Subtle Vertical Divider */}
            <div className="h-6 w-px bg-slate-200 hidden lg:block shrink-0" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 min-w-0">
              {filteredCoreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`h-9 flex items-center space-x-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-blue-50 text-[#2B4C9D] border border-blue-200/80 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2B4C9D]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              {/* On XL+ screens, show secondary items inline */}
              <div className="hidden xl:flex items-center space-x-1">
                {filteredSecondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`h-9 flex items-center space-x-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-blue-50 text-[#2B4C9D] border border-blue-200/80 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2B4C9D]' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* On LG screens (1024px-1279px), show secondary items inside sleek More dropdown */}
              {filteredSecondaryItems.length > 0 && (
                <div className="relative xl:hidden" ref={moreMenuRef}>
                  <button
                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                    className={`h-9 flex items-center space-x-1 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      activeSecondaryItem
                        ? 'bg-blue-50 text-[#2B4C9D] border border-blue-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                    }`}
                  >
                    <span>{activeSecondaryItem ? activeSecondaryItem.label : 'More'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${moreMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {moreMenuOpen && (
                    <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                      {filteredSecondaryItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setMoreMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 flex items-center space-x-2 transition-colors cursor-pointer ${
                              isActive ? 'bg-blue-50 text-[#2B4C9D] font-bold' : 'hover:bg-slate-50 text-slate-700'
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
              )}
            </nav>
          </div>

          {/* Right: Actions (New Application, Bell, User Profile, Mobile Toggle) */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Quick Add Application Button */}
            <button
              onClick={onOpenNewApplication}
              className="flex items-center space-x-1.5 h-9 px-3.5 bg-[#2B4C9D] hover:bg-[#203a7a] active:bg-[#1a2f64] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer shrink-0"
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
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* User Profile / Menu Pill */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center space-x-2 h-9 px-2.5 rounded-lg border transition-colors text-left cursor-pointer shrink-0 ${
                  activeTab === 'users' || activeTab === 'settings' || activeTab === 'import' || activeTab === 'google-authenticator' || activeTab === 'security-center' || activeTab === 'access-requests' || activeTab === 'automations' || activeTab === 'admin-dashboard'
                    ? 'bg-blue-50/90 border-[#2B4C9D]/40 text-[#2B4C9D]'
                    : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#2B4C9D] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {currentAccount?.name ? currentAccount.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left max-w-[110px] xl:max-w-[140px] truncate">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate">
                    {currentAccount?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate">
                    {isAdmin ? 'Administrator' : 'Specialist'}
                  </p>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu -> Contains ALL admin & governance features in one consolidated place */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
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
                    <p className="text-[11px] text-slate-500 truncate">{currentAccount?.email || ''}</p>
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

                  {/* ELEGANT ADMIN DASHBOARD BUTTON UNDERNEATH PROFILE */}
                  {(isSuperAdmin(currentAccount) || isAdmin || canManageUsers(currentAccount)) && (
                    <div className="p-2 border-b border-slate-100 bg-slate-50/70">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('admin-dashboard');
                        }}
                        className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 text-white rounded-xl shadow-xs transition-all cursor-pointer group border border-indigo-900/40"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-bold leading-tight">Admin Dashboard</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            </div>
                            <p className="text-[10px] text-slate-300 leading-tight mt-0.5">All Admin &amp; Governance Tools</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          {((staffChangeRequests || []).filter(r => r.status === 'PENDING').length + pendingAccessRequestsCount) > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                              {((staffChangeRequests || []).filter(r => r.status === 'PENDING').length + pendingAccessRequestsCount)}
                            </span>
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    </div>
                  )}

                  {/* CLINICAL STAFF SELF-SERVICE PORTAL ACCESS */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setActiveTab('clinical-portal');
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                        activeTab === 'clinical-portal' 
                          ? 'bg-blue-50 text-[#2B4C9D] font-bold' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-xs font-semibold">My Clinical Profile</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Self-service</span>
                    </button>
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

            {/* Mobile / Tablet Menu Toggle Button (< lg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 flex lg:hidden items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="flex lg:hidden flex-wrap items-center gap-1.5 py-3 border-t border-slate-100 bg-slate-50/80 px-2 rounded-b-xl animate-in slide-in-from-top-2 duration-150">
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
