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
  Database,
  UserCog,
  UserPlus,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  User,
  BarChart3,
  Sliders,
  Settings,
  Clock,
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
  | 'settings';

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
  } = useCredentialing();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Layers },
    { id: 'tracker' as const, label: 'Applications', icon: FileText },
    { id: 'linking' as const, label: 'Staff Linking', icon: Building2 },
    { id: 'providers' as const, label: 'Clinical Staff', icon: Users },
    { id: 'locations' as const, label: 'Locations', icon: MapPin },
    { id: 'payers' as const, label: 'Payers', icon: ShieldCheck },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
    { id: 'new-user' as const, label: 'Users & RBAC', icon: UserPlus },
  ];

  // Strictly filter navigation items so users only see assigned tabs
  const navItems = allNavItems.filter((item) => canAccessTab(currentAccount, item.id));

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="text-left focus:outline-none py-1 hover:opacity-95 transition-opacity cursor-pointer"
            >
              <ProficioLogo variant="full" size="md" />
            </button>

            {/* Clean Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2B4C9D]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Add Application Button */}
            <button
              onClick={onOpenNewApplication}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Application</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotificationDrawer}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {/* User Profile / Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center space-x-2 p-1.5 pl-2 rounded-lg border transition-colors text-left cursor-pointer ${
                  activeTab === 'users' || activeTab === 'settings' || activeTab === 'import'
                    ? 'bg-indigo-50/70 border-[#2B4C9D]/30'
                    : 'hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#2B4C9D] text-white flex items-center justify-center text-[10px] font-bold">
                  {currentAccount?.name ? currentAccount.name.charAt(0) : 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-none">
                    {currentAccount?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                    {isAdmin ? 'Administrator' : 'Specialist'}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Dropdown Menu -> Links to dedicated subpages */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{currentAccount?.name || 'User'}</p>
                      {currentAccount?.authProvider === 'google' && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1" title="Authenticated via Google OAuth & Employee Access Control">
                          <span>Google Verified</span>
                        </span>
                      )}
                      {isSuperAdmin(currentAccount) && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          SUPER ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{currentAccount?.email || 'demo@proficiotherapy.com'}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded truncate max-w-[140px] ${
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

                  {/* Subpage Links */}
                  <div className="py-1">
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
                          <span>User Profiles & Passwords</span>
                        </div>
                      </button>
                    )}

                    {canAccessTab(currentAccount, 'locations') && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('locations');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'locations' ? 'bg-indigo-50 text-[#2B4C9D] font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-[#2B4C9D]" />
                          <span>Clinic & Practice Locations</span>
                        </div>
                      </button>
                    )}

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
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>System Settings & Configuration</span>
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
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
