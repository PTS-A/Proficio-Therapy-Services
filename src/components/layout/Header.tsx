import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { ProficioLogo } from '../common/ProficioLogo';
import { 
  canAccessTab, 
  isSuperAdmin, 
  isDeveloper,
  isAdminAccount
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
  Smartphone,
  Menu,
  X,
  ChevronRight,
  MessageSquare,
  BellRing,
  Sparkles,
  Database,
  Cpu,
  Terminal,
  Activity,
  CreditCard,
  Code2,
  LifeBuoy,
  Search,
  Check,
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
  | 'comments-roster'
  | 'tickets'
  | 'dbms-manager'
  | 'developer';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  onOpenNewApplication: () => void;
  onOpenAddProvider: () => void;
  onOpenNotificationDrawer: () => void;
  devDashboardMode?: 'system' | 'credentialing';
  setDevDashboardMode?: (mode: 'system' | 'credentialing') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewApplication,
  onOpenNotificationDrawer,
  devDashboardMode = 'system',
  setDevDashboardMode,
}) => {
  const { 
    currentAccount, 
    isAdmin, 
    logout, 
    notifications, 
    sessionSecondsLeft,
    pendingAccessRequestsCount,
    staffChangeRequests,
  } = useCredentialing();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const pendingStaffCount = (staffChangeRequests || []).filter(r => r.status === 'PENDING').length;
  const totalPendingBadges = pendingStaffCount + pendingAccessRequestsCount;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset dropdown search when menu closes
  useEffect(() => {
    if (!userMenuOpen) {
      setDropdownSearch('');
    }
  }, [userMenuOpen]);

  const isDevUser = isDeveloper(currentAccount);

  // Clean primary operational tabs for the header bar
  const headerCoreItems = [
    { 
      id: 'dashboard' as const, 
      label: (isDevUser && devDashboardMode === 'system') ? 'System Telemetry' : 'Dashboard', 
      icon: (isDevUser && devDashboardMode === 'system') ? Terminal : Layers 
    },
    { id: 'tracker' as const, label: 'Tracker', icon: FileText },
    { id: 'providers' as const, label: 'Clinical Staff', icon: Users },
  ].filter(item => canAccessTab(currentAccount, item.id));

  // Catalog of all application modules organized for the profile dropdown
  const allModulesCatalog = useMemo(() => {
    return [
      // Credentialing Operations & Directories
      {
        id: 'dashboard' as const,
        category: 'operations',
        label: 'Credentialing Dashboard',
        icon: Layers,
        description: 'Pipeline KPIs, metrics & stages',
        action: () => {
          setDevDashboardMode?.('credentialing');
          setActiveTab('dashboard');
        },
      },
      {
        id: 'tracker' as const,
        category: 'operations',
        label: 'Credentialing Tracker',
        icon: FileText,
        description: 'Kanban pipeline & lifecycle table',
        action: () => setActiveTab('tracker'),
      },
      {
        id: 'providers' as const,
        category: 'operations',
        label: 'Clinical Staff Master',
        icon: Users,
        description: 'Clinicians, licenses & credentials',
        action: () => setActiveTab('providers'),
      },
      {
        id: 'document-intake' as const,
        category: 'operations',
        label: 'Smart Document Intake',
        icon: Sparkles,
        description: 'AI OCR & automated credential parsing',
        action: () => setActiveTab('document-intake'),
      },
      {
        id: 'payers' as const,
        category: 'operations',
        label: 'Insurance Payers',
        icon: CreditCard,
        description: 'Payers directory & plan linkages',
        action: () => setActiveTab('payers'),
      },
      {
        id: 'locations' as const,
        category: 'operations',
        label: 'Clinic Locations',
        icon: MapPin,
        description: 'Practice sites, addresses & clinics',
        action: () => setActiveTab('locations'),
      },
      {
        id: 'entities' as const,
        category: 'operations',
        label: 'Legal Entities',
        icon: Building2,
        description: 'Corporate tax IDs & group structures',
        action: () => setActiveTab('entities'),
      },
      {
        id: 'comments-roster' as const,
        category: 'operations',
        label: 'Comments & Notes Roster',
        icon: MessageSquare,
        description: 'Unified application communications',
        action: () => setActiveTab('comments-roster'),
      },
      {
        id: 'aesas' as const,
        category: 'operations',
        label: 'AESAS Alert Engine',
        icon: BellRing,
        description: 'Automated email sending alerts',
        action: () => setActiveTab('aesas'),
      },
      {
        id: 'reports' as const,
        category: 'operations',
        label: 'Reports & Analytics',
        icon: BarChart3,
        description: 'Turnaround metrics & custom exports',
        action: () => setActiveTab('reports'),
      },
      {
        id: 'clinical-portal' as const,
        category: 'operations',
        label: 'Clinical Staff Portal',
        icon: User,
        description: 'Provider self-service credential intake',
        action: () => setActiveTab('clinical-portal'),
      },

      // Administration & Governance
      {
        id: 'admin-dashboard' as const,
        category: 'admin',
        label: 'Admin Dashboard',
        icon: ShieldCheck,
        description: 'Central governance & management hub',
        action: () => setActiveTab('admin-dashboard'),
        badge: totalPendingBadges > 0 ? totalPendingBadges : undefined,
      },
      {
        id: 'new-user' as const,
        category: 'admin',
        label: 'User & Access Management',
        icon: UserPlus,
        description: 'Staff accounts, roles & permissions',
        action: () => setActiveTab('new-user'),
      },
      {
        id: 'staff-approvals' as const,
        category: 'admin',
        label: 'Staff Approvals Queue',
        icon: UserCheck,
        description: 'Profile change review requests',
        action: () => setActiveTab('staff-approvals'),
        badge: pendingStaffCount > 0 ? pendingStaffCount : undefined,
      },
      {
        id: 'access-requests' as const,
        category: 'admin',
        label: 'Access Requests Governance',
        icon: UserCog,
        description: 'Pending portal permission approvals',
        action: () => setActiveTab('access-requests'),
        badge: pendingAccessRequestsCount > 0 ? pendingAccessRequestsCount : undefined,
      },
      {
        id: 'security-center' as const,
        category: 'admin',
        label: 'Security & Compliance',
        icon: ShieldAlert,
        description: 'Security policies, audit logs & controls',
        action: () => setActiveTab('security-center'),
      },
      {
        id: 'settings' as const,
        category: 'admin',
        label: 'System Settings & SLA',
        icon: Settings,
        description: 'Thresholds, stages & organization SLA',
        action: () => setActiveTab('settings'),
      },
      {
        id: 'import' as const,
        category: 'admin',
        label: 'Bulk Spreadsheet Import',
        icon: Sliders,
        description: 'CSV / Excel mass ingestion tool',
        action: () => setActiveTab('import'),
      },
      {
        id: 'automations' as const,
        category: 'admin',
        label: 'Automated Reminders',
        icon: Clock,
        description: 'Scheduled credentialing workflows',
        action: () => setActiveTab('automations'),
      },
      {
        id: 'google-authenticator' as const,
        category: 'admin',
        label: 'Google Authenticator MFA',
        icon: Smartphone,
        description: 'Two-factor auth status & audit logs',
        action: () => setActiveTab('google-authenticator'),
      },

      // Developer & Engineering Tools
      {
        id: 'developer' as const,
        category: 'dev',
        label: 'Developer Hub',
        icon: Cpu,
        description: 'Engineering consoles, tools & logs',
        action: () => setActiveTab('developer'),
      },
      {
        id: 'dbms-manager' as const,
        category: 'dev',
        label: 'Live DBMS Manager',
        icon: Database,
        description: 'Supabase Postgres tables & live queries',
        action: () => setActiveTab('dbms-manager'),
      },
      {
        id: 'tickets' as const,
        category: 'dev',
        label: 'System Support Tickets',
        icon: LifeBuoy,
        description: 'Engineering & support issue tracker',
        action: () => setActiveTab('tickets'),
      },
    ];
  }, [totalPendingBadges, pendingStaffCount, pendingAccessRequestsCount, setActiveTab, setDevDashboardMode]);

  // Filter modules user is permitted to access
  const accessibleModules = useMemo(() => {
    return allModulesCatalog.filter(m => canAccessTab(currentAccount, m.id));
  }, [allModulesCatalog, currentAccount]);

  // Filter modules based on search query in the profile dropdown
  const filteredModules = useMemo(() => {
    if (!dropdownSearch.trim()) return accessibleModules;
    const q = dropdownSearch.toLowerCase().trim();
    return accessibleModules.filter(m => 
      m.label.toLowerCase().includes(q) || 
      m.description.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)
    );
  }, [accessibleModules, dropdownSearch]);

  // Determine current active module info (especially if it is not in the headerCoreItems)
  const isCoreTabActive = headerCoreItems.some(item => item.id === activeTab);
  const currentActiveModule = allModulesCatalog.find(m => m.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Left: Logo & Clean Minimal Navigation */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            {/* Brand Logo */}
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center focus:outline-none hover:opacity-90 transition-opacity cursor-pointer shrink-0 py-1"
              title="Proficio Credentialing Hub Home"
            >
              <ProficioLogo variant="horizontal" size="sm" className="h-7 sm:h-8 w-auto object-contain" />
            </button>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-slate-200 hidden md:block shrink-0" />

            {/* Clean Desktop Navigation: Only Primary Operational Essentials */}
            <nav className="hidden md:flex items-center space-x-1 min-w-0">
              {headerCoreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'dashboard' && isDevUser) {
                        // Keep current mode or allow quick switch
                      }
                      setActiveTab(item.id);
                    }}
                    className={`h-9 flex items-center space-x-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-blue-50 text-[#2B4C9D] border border-blue-200/80 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2B4C9D]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              {/* Active Secondary / Governance Module Pill (Shows neatly when user is on a module opened from the profile dropdown) */}
              {!isCoreTabActive && currentActiveModule && (
                <div className="flex items-center space-x-1.5 h-9 px-3 rounded-lg text-xs font-bold bg-indigo-50/80 text-indigo-900 border border-indigo-200/70 shadow-2xs">
                  <currentActiveModule.icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate max-w-[140px] xl:max-w-[200px]">{currentActiveModule.label}</span>
                </div>
              )}
            </nav>
          </div>

          {/* Right: Quick Action, Notifications, & Comprehensive Profile Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Quick "New Application" CTA (Operational Credentialing) */}
            {!isDevUser && (
              <button
                onClick={onOpenNewApplication}
                className="flex items-center space-x-1.5 h-9 px-3 sm:px-3.5 bg-[#2B4C9D] hover:bg-[#203a7a] active:bg-[#1a2f64] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer shrink-0"
                title="Create New Credentialing Application"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Application</span>
              </button>
            )}

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

            {/* User Profile / Menu Trigger */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center space-x-2 h-9 px-2.5 rounded-lg border transition-all text-left cursor-pointer shrink-0 ${
                  userMenuOpen || !isCoreTabActive
                    ? 'bg-blue-50/90 border-[#2B4C9D]/40 text-[#2B4C9D]'
                    : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
                title="Account, Modules & Governance Menu"
              >
                <div className="w-6 h-6 rounded-full bg-[#2B4C9D] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
                  {currentAccount?.name ? currentAccount.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left max-w-[100px] lg:max-w-[130px] truncate">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate">
                    {currentAccount?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate">
                    {isDevUser ? 'Developer' : isSuperAdmin(currentAccount) ? 'Super Admin' : isAdmin ? 'Administrator' : 'Specialist'}
                  </p>
                </div>
                {totalPendingBadges > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white shrink-0 sm:hidden" />
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Scrollable Comprehensive Profile Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[min(84vh,630px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  
                  {/* Sticky Top: User Account Header & Session Status */}
                  <div className="p-3.5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2B4C9D] to-indigo-800 text-white flex items-center justify-center text-sm font-bold shadow-xs shrink-0">
                          {currentAccount?.name ? currentAccount.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                            {currentAccount?.name || 'User'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {currentAccount?.email || ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 space-y-1">
                        {isSuperAdmin(currentAccount) && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 leading-none">
                            SUPER ADMIN
                          </span>
                        )}
                        {currentAccount?.authProvider === 'google' && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 leading-none">
                            Google SSO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role Pill & Live Inactivity Timer */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded truncate max-w-[160px] ${
                        isSuperAdmin(currentAccount)
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : isDevUser
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : isAdmin
                          ? 'bg-indigo-50 text-[#2B4C9D] border border-indigo-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {currentAccount?.systemRole || (isAdmin ? 'Administrator' : 'Specialist')}
                      </span>

                      <div 
                        title="Session automatically logs out after 20 minutes of inactivity"
                        className={`flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded ${
                          sessionSecondsLeft < 120 
                            ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' 
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{Math.floor(sessionSecondsLeft / 60)}m {String(sessionSecondsLeft % 60).padStart(2, '0')}s</span>
                      </div>
                    </div>

                    {/* Quick Search / Filter Input */}
                    <div className="mt-2.5 relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={dropdownSearch}
                        onChange={(e) => setDropdownSearch(e.target.value)}
                        placeholder="Search modules, tools, directories..."
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-lg border border-transparent focus:border-blue-400 focus:outline-none transition-all"
                      />
                      {dropdownSearch && (
                        <button
                          type="button"
                          onClick={() => setDropdownSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scrollable Body: All Modules Cleanly Categorized */}
                  <div className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-3 custom-scrollbar">
                    
                    {/* When Search is active: Filtered flat list */}
                    {dropdownSearch.trim() ? (
                      <div className="space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Search Results ({filteredModules.length})
                        </div>
                        {filteredModules.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No modules found matching &ldquo;{dropdownSearch}&rdquo;
                          </div>
                        ) : (
                          filteredModules.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  item.action();
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                                  isActive
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold border border-blue-200/80'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    isActive ? 'bg-blue-100 text-[#2B4C9D]' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold leading-tight truncate">{item.label}</p>
                                    <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">{item.description}</p>
                                  </div>
                                </div>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white shrink-0">
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Section 1: Developer Perspectives & Engineering Suite (Dev Accounts) */}
                        {isDevUser && (
                          <div className="rounded-xl border border-purple-200/80 bg-gradient-to-b from-purple-50/50 via-white to-white p-2.5 space-y-2">
                            <div className="flex items-center justify-between px-1 text-[10px] font-bold text-purple-900 uppercase tracking-wider">
                              <span className="flex items-center space-x-1.5">
                                <Activity className="w-3.5 h-3.5 text-purple-600" />
                                <span>Developer Perspective Switcher</span>
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-100 text-purple-700">DEV MODE</span>
                            </div>

                            {/* Perspective Cards */}
                            <div className="grid grid-cols-1 gap-1">
                              {/* 1. Admin Dashboard View */}
                              <button
                                type="button"
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('admin-dashboard');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer border ${
                                  activeTab === 'admin-dashboard'
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                                    activeTab === 'admin-dashboard' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                                  }`}>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="truncate">
                                    <p className="text-xs font-bold leading-tight">Admin Dashboard View</p>
                                    <p className={`text-[10px] leading-tight ${activeTab === 'admin-dashboard' ? 'text-indigo-200' : 'text-slate-500'}`}>
                                      Users, settings, security &amp; approvals
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'admin-dashboard' ? 'text-indigo-300' : 'text-slate-400'}`} />
                              </button>

                              {/* 2. Credentialing Staff Operations View */}
                              <button
                                type="button"
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setDevDashboardMode?.('credentialing');
                                  setActiveTab('dashboard');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer border ${
                                  activeTab === 'dashboard' && devDashboardMode === 'credentialing'
                                    ? 'bg-[#2B4C9D] text-white border-[#2B4C9D] shadow-2xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                                    activeTab === 'dashboard' && devDashboardMode === 'credentialing' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    <Layers className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="truncate">
                                    <p className="text-xs font-bold leading-tight">Credentialing Staff View</p>
                                    <p className={`text-[10px] leading-tight ${activeTab === 'dashboard' && devDashboardMode === 'credentialing' ? 'text-blue-100' : 'text-slate-500'}`}>
                                      KPIs, applications, pipeline &amp; tracker
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'dashboard' && devDashboardMode === 'credentialing' ? 'text-blue-200' : 'text-slate-400'}`} />
                              </button>

                              {/* 3. Developer System Telemetry View */}
                              <button
                                type="button"
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setDevDashboardMode?.('system');
                                  setActiveTab('dashboard');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer border ${
                                  activeTab === 'dashboard' && devDashboardMode === 'system'
                                    ? 'bg-purple-950 text-white border-purple-950 shadow-2xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                                    activeTab === 'dashboard' && devDashboardMode === 'system' ? 'bg-purple-400/20 text-purple-200' : 'bg-purple-50 text-purple-700'
                                  }`}>
                                    <Terminal className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="truncate">
                                    <p className="text-xs font-bold leading-tight">System Telemetry &amp; Health</p>
                                    <p className={`text-[10px] leading-tight ${activeTab === 'dashboard' && devDashboardMode === 'system' ? 'text-purple-200' : 'text-slate-500'}`}>
                                      Live DB latency, sessions &amp; errors
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'dashboard' && devDashboardMode === 'system' ? 'text-purple-200' : 'text-slate-400'}`} />
                              </button>
                            </div>

                            {/* Engineering Hub Links */}
                            <div className="pt-2 border-t border-purple-100">
                              <p className="px-1 pb-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Engineering Modules</p>
                              <div className="grid grid-cols-2 gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('developer');
                                  }}
                                  className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'developer' ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                  <span className="text-[11px] truncate">Developer Hub</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('dbms-manager');
                                  }}
                                  className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'dbms-manager' ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="text-[11px] truncate">DBMS Manager</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('tickets');
                                  }}
                                  className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'tickets' ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <LifeBuoy className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span className="text-[11px] truncate">System Tickets</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Section 2: Administration & Governance */}
                        {(isAdminAccount(currentAccount) || canAccessTab(currentAccount, 'admin-dashboard') || isSuperAdmin(currentAccount)) && (
                          <div className="space-y-1">
                            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                              <span>Administration &amp; Governance</span>
                              {totalPendingBadges > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                                  {totalPendingBadges} Pending
                                </span>
                              )}
                            </div>

                            {/* Admin Hub Main Card */}
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                setActiveTab('admin-dashboard');
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer border ${
                                activeTab === 'admin-dashboard'
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                  : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  activeTab === 'admin-dashboard' ? 'bg-white/10 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-1.5">
                                    <p className="text-xs font-bold leading-tight truncate">Admin Dashboard</p>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  </div>
                                  <p className={`text-[10px] leading-tight truncate mt-0.5 ${
                                    activeTab === 'admin-dashboard' ? 'text-slate-300' : 'text-slate-500'
                                  }`}>
                                    Central Governance &amp; Controls
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'admin-dashboard' ? 'text-slate-300' : 'text-slate-400'}`} />
                            </button>

                            {/* Sub-tools list */}
                            <div className="space-y-0.5 pt-1">
                              {canAccessTab(currentAccount, 'new-user') && (
                                <button
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('new-user');
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'new-user' || activeTab === 'users'
                                      ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <UserPlus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span className="text-xs truncate">User &amp; Team Management</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">Accounts</span>
                                </button>
                              )}

                              {canAccessTab(currentAccount, 'staff-approvals') && (
                                <button
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('staff-approvals');
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'staff-approvals'
                                      ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    <span className="text-xs truncate">Clinical Approvals Queue</span>
                                  </div>
                                  {pendingStaffCount > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white shrink-0">
                                      {pendingStaffCount}
                                    </span>
                                  )}
                                </button>
                              )}

                              {canAccessTab(currentAccount, 'access-requests') && (
                                <button
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('access-requests');
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'access-requests'
                                      ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <UserCog className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span className="text-xs truncate">Access Requests</span>
                                  </div>
                                  {pendingAccessRequestsCount > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white shrink-0">
                                      {pendingAccessRequestsCount}
                                    </span>
                                  )}
                                </button>
                              )}

                              {canAccessTab(currentAccount, 'security-center') && (
                                <button
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('security-center');
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'security-center'
                                      ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span className="text-xs truncate">Security &amp; Compliance Center</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">Policies</span>
                                </button>
                              )}

                              {canAccessTab(currentAccount, 'settings') && (
                                <button
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('settings');
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'settings'
                                      ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <Settings className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                    <span className="text-xs truncate">System Settings &amp; SLA</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">Config</span>
                                </button>
                              )}

                              {canAccessTab(currentAccount, 'import') && (
                                <button
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('import');
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'import'
                                      ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <Sliders className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                                    <span className="text-xs truncate">Bulk Spreadsheet Import</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">CSV/XLS</span>
                                </button>
                              )}

                              {canAccessTab(currentAccount, 'automations') && (
                                <button
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setActiveTab('automations');
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeTab === 'automations'
                                      ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                    <span className="text-xs truncate">Automated Reminders</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">Workflows</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Section 3: Credentialing Operations & Directories */}
                        <div className="space-y-1">
                          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Credentialing Operations &amp; Directories
                          </div>

                          <div className="space-y-0.5">
                            {/* Dashboard */}
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                setDevDashboardMode?.('credentialing');
                                setActiveTab('dashboard');
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                activeTab === 'dashboard' && devDashboardMode !== 'system'
                                  ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="text-xs truncate">Credentialing Dashboard</span>
                              </div>
                              <span className="text-[10px] text-slate-400">KPIs</span>
                            </button>

                            {/* Tracker */}
                            {canAccessTab(currentAccount, 'tracker') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('tracker');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'tracker'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="text-xs truncate">Credentialing Tracker</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Kanban</span>
                              </button>
                            )}

                            {/* Clinical Staff */}
                            {canAccessTab(currentAccount, 'providers') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('providers');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'providers'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <Users className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                                  <span className="text-xs truncate">Clinical Staff Master</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Roster</span>
                              </button>
                            )}

                            {/* Smart Intake */}
                            {canAccessTab(currentAccount, 'document-intake') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('document-intake');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'document-intake'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span className="text-xs truncate">Smart Document Intake</span>
                                </div>
                                <span className="text-[9px] px-1 py-0.2 bg-amber-50 text-amber-700 rounded font-semibold">AI OCR</span>
                              </button>
                            )}

                            {/* Payers */}
                            {canAccessTab(currentAccount, 'payers') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('payers');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'payers'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <CreditCard className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                  <span className="text-xs truncate">Insurance Payers</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Plans</span>
                              </button>
                            )}

                            {/* Locations */}
                            {canAccessTab(currentAccount, 'locations') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('locations');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'locations'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  <span className="text-xs truncate">Clinic Locations</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Sites</span>
                              </button>
                            )}

                            {/* Legal Entities */}
                            {canAccessTab(currentAccount, 'entities') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('entities');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'entities'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="text-xs truncate">Legal Entities</span>
                                </div>
                                <span className="text-[10px] text-slate-400">TINs</span>
                              </button>
                            )}

                            {/* Comments Roster */}
                            {canAccessTab(currentAccount, 'comments-roster') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('comments-roster');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'comments-roster'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                  <span className="text-xs truncate">Comments &amp; Notes Roster</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Notes</span>
                              </button>
                            )}

                            {/* AESAS Alerts */}
                            {canAccessTab(currentAccount, 'aesas') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('aesas');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'aesas'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <BellRing className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span className="text-xs truncate">AESAS Alert Engine</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Emails</span>
                              </button>
                            )}

                            {/* Reports */}
                            {canAccessTab(currentAccount, 'reports') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('reports');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'reports'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <BarChart3 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                  <span className="text-xs truncate">Reports &amp; Analytics</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Metrics</span>
                              </button>
                            )}

                            {/* Clinical Portal */}
                            {canAccessTab(currentAccount, 'clinical-portal') && (
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveTab('clinical-portal');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  activeTab === 'clinical-portal'
                                    ? 'bg-blue-50 text-[#2B4C9D] font-bold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                  <span className="text-xs truncate">Clinical Staff Portal</span>
                                </div>
                                <span className="text-[10px] text-slate-400">Self-service</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Sticky Bottom: Active Page indicator & Clean Log Out button */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 truncate max-w-[170px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="truncate">{currentActiveModule?.label || 'Online'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="px-3 py-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 active:bg-rose-100 rounded-lg flex items-center space-x-1.5 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation Drawer Toggle (< md) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 flex md:hidden items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer shrink-0"
              title="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-150 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 px-2">
              {headerCoreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-[#2B4C9D] border border-blue-200 shadow-2xs font-bold'
                        : 'text-slate-700 bg-slate-50 border border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2B4C9D]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Quick Profile / All Modules button in Mobile view */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUserMenuOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>All Modules &amp; Tools...</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
