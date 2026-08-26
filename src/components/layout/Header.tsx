import React from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { UserRole, Discipline } from '../../types';
import { ProficioLogo } from '../common/ProficioLogo';
import { 
  Building2, 
  CheckCircle2, 
  ChevronDown, 
  FileText, 
  Layers, 
  MapPin, 
  Plus, 
  Search, 
  ShieldAlert, 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  UserCheck, 
  Users, 
  Bell,
  RefreshCw,
  Share2,
  Database
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'tracker' | 'linking' | 'providers' | 'payers' | 'entities' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'tracker' | 'linking' | 'providers' | 'payers' | 'entities' | 'reports') => void;
  onOpenNewApplication: () => void;
  onOpenAddProvider: () => void;
  onOpenNotificationDrawer: () => void;
  onOpenImportModal: () => void;
  onOpenConfigModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewApplication,
  onOpenAddProvider,
  onOpenNotificationDrawer,
  onOpenImportModal,
  onOpenConfigModal,
}) => {
  const { currentUser, switchRole, notifications, filters, setFilters, kpis, resetToDefaultData } = useCredentialing();
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roles: UserRole[] = [
    'Specialist',
    'Manager',
    'Leadership',
    'Admin',
    'Operations',
    'HR',
    'Billing',
    'Clinical',
  ];

  const handleDisciplineToggle = (disc: Discipline | 'All') => {
    setFilters((prev) => ({ ...prev, discipline: disc }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Branding & Status Strip */}
      <div className="bg-[#111E42] text-slate-200 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-semibold text-[#00A651]">
            <span className="h-2 w-2 rounded-full bg-[#00A651] animate-pulse"></span>
            <span>Proficio Therapy Credentialing & Enrollment System</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 hidden sm:inline">An EdTheory Affiliate • ABA • Speech (SLP) • OT</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-300 text-[11px]">
            <span className="text-[#F5A623] font-medium">Overdue SLA: {kpis.applicationsOverdue}</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-300">Submission SLA: {kpis.submissionEfficiencyRate}%</span>
          </div>
          
          <button 
            onClick={resetToDefaultData}
            title="Reset to clean initial BRD state"
            className="text-slate-400 hover:text-white flex items-center space-x-1 transition-colors text-[11px]"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Company Brand Logo & System Title */}
          <div className="flex items-center space-x-4">
            <ProficioLogo variant="full" size="md" />
            <div className="hidden lg:block h-8 w-px bg-slate-200" />
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-[#2B4C9D]">
                  Credentialing Hub
                </span>
                <span className="bg-[#EEF2FF] text-[#2B4C9D] text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#2B4C9D]/20">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Multi-Entity & Payer Enrollment Platform</p>
            </div>
          </div>

          {/* Search & Global Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Discipline Pills in Brand Colors */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              {(['All', 'ABA', 'Speech', 'OT'] as (Discipline | 'All')[]).map((disc) => (
                <button
                  key={disc}
                  onClick={() => handleDisciplineToggle(disc)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filters.discipline === disc
                      ? 'bg-white text-[#2B4C9D] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {disc === 'All' ? 'All Disciplines' : disc}
                </button>
              ))}
            </div>

            {/* Notification Bell */}
            <button
              id="header-notification-button"
              onClick={onOpenNotificationDrawer}
              className="relative p-2 rounded-lg text-slate-600 hover:text-[#2B4C9D] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications and SLA Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E86424] text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                id="header-role-dropdown-btn"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full bg-[#2B4C9D] text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.role[0]}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="leading-none text-slate-900 font-bold">{currentUser.role}</div>
                  <div className="text-[10px] text-slate-500 font-normal truncate max-w-[90px]">{currentUser.name}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Role-Based Access Simulation
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        currentUser.role === r ? 'bg-[#EEF2FF] text-[#2B4C9D] font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span>{r} View</span>
                      {currentUser.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#2B4C9D]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button: New Application with Proficio Brand Blue */}
            <button
              id="header-new-application-btn"
              onClick={onOpenNewApplication}
              className="flex items-center space-x-1.5 bg-[#2B4C9D] hover:bg-[#223E80] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs shadow-[#2B4C9D]/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs with Proficio Accent */}
        <nav className="flex space-x-1 border-t border-slate-100 overflow-x-auto py-1 scrollbar-none">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#EEF2FF] text-[#2B4C9D] border border-[#2B4C9D]/30 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#2B4C9D]" />
            <span>Management Dashboard</span>
          </button>

          <button
            id="nav-tab-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'tracker'
                ? 'bg-[#EEF2FF] text-[#2B4C9D] border border-[#2B4C9D]/30 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-[#2B4C9D]" />
            <span>Credentialing Pipeline</span>
            <span className="bg-[#2B4C9D] text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {kpis.totalApplications}
            </span>
          </button>

          <button
            id="nav-tab-linking"
            onClick={() => setActiveTab('linking')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'linking'
                ? 'bg-[#EEF2FF] text-[#2B4C9D] border border-[#2B4C9D]/30 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Share2 className="w-4 h-4 text-[#00A651]" />
            <span>Provider Linking & Contracting</span>
            {kpis.providersLinkingPending > 0 && (
              <span className="bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {kpis.providersLinkingPending} Pending
              </span>
            )}
          </button>

          <button
            id="nav-tab-providers"
            onClick={() => setActiveTab('providers')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'providers'
                ? 'bg-[#EEF2FF] text-[#2B4C9D] border border-[#2B4C9D]/30 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-[#2B4C9D]" />
            <span>Provider Master (360°)</span>
          </button>

          <button
            id="nav-tab-payers"
            onClick={() => setActiveTab('payers')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'payers'
                ? 'bg-[#EEF2FF] text-[#2B4C9D] border border-[#2B4C9D]/30 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#00A651]" />
            <span>Payer Master Directory</span>
          </button>

          <button
            id="nav-tab-entities"
            onClick={() => setActiveTab('entities')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'entities'
                ? 'bg-[#EEF2FF] text-[#2B4C9D] border border-[#2B4C9D]/30 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#E86424]" />
            <span>Entities & Locations</span>
          </button>

          <button
            id="nav-tab-reports"
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-[#EEF2FF] text-[#2B4C9D] border border-[#2B4C9D]/30 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-[#F5A623]" />
            <span>Reports & Power BI</span>
          </button>

          <div className="flex-1"></div>

          {/* Admin Tools shortcuts */}
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
            <button
              onClick={onOpenImportModal}
              title="Bulk Import Google Sheets / CSV"
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#2B4C9D] hover:bg-slate-100 text-xs flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Import</span>
            </button>
            <button
              onClick={onOpenConfigModal}
              title="System Settings & SLA Thresholds"
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#2B4C9D] hover:bg-slate-100 text-xs flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Config</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
