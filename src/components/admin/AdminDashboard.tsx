import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Settings, 
  Mail, 
  Database, 
  Key, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { NewUserView } from './NewUserView';
import { AccessRequestsView } from './AccessRequestsView';
import { SecurityCenterView } from './SecurityCenterView';
import { GoogleAuthenticatorView } from './GoogleAuthenticatorView';
import { AutomationDashboardView } from '../automations/AutomationDashboardView';
import { DataImportView } from './DataImportView';
import { SystemConfigView } from './SystemConfigView';
import { StaffApprovalsView } from './StaffApprovalsView';
import { AdminInsuranceManager } from './AdminInsuranceManager';

export type AdminSubSection = 
  | 'overview'
  | 'approvals'
  | 'users'
  | 'access-requests'
  | 'insurances'
  | 'security'
  | 'mfa'
  | 'automations'
  | 'import'
  | 'settings';

interface AdminDashboardProps {
  onBackToApp?: () => void;
  initialSection?: AdminSubSection;
  onNavigateToTracker?: () => void;
  onNavigateToProviders?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToApp,
  initialSection = 'overview',
  onNavigateToTracker,
  onNavigateToProviders,
}) => {
  const { 
    currentAccount, 
    accounts, 
    accessRequests, 
    staffChangeRequests, 
    pendingAccessRequestsCount 
  } = useCredentialing();

  const [activeSection, setActiveSection] = useState<AdminSubSection>(initialSection);

  const pendingApprovalsCount = (staffChangeRequests || []).filter(r => r.status === 'PENDING').length;
  const pendingRequestsCount = (accessRequests || []).filter(r => r.status === 'PENDING').length;
  const totalUsers = (accounts || []).length;

  const adminTabs = [
    {
      id: 'overview' as const,
      label: 'Admin Overview',
      icon: Layers,
      count: null,
      description: 'System-wide governance summary & health metrics',
    },
    {
      id: 'approvals' as const,
      label: 'Clinical Approvals',
      icon: CheckCircle2,
      count: pendingApprovalsCount,
      badgeColor: 'bg-amber-500 text-white',
      description: 'Review clinical staff profile & document submissions',
    },
    {
      id: 'users' as const,
      label: 'User Management',
      icon: Users,
      count: totalUsers,
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: 'Directory, roles, disciplines & provisioning',
    },
    {
      id: 'access-requests' as const,
      label: 'Access Requests',
      icon: UserCheck,
      count: pendingRequestsCount,
      badgeColor: 'bg-blue-600 text-white',
      description: 'Prospective & onboarding employee gate requests',
    },
    {
      id: 'insurances' as const,
      label: 'Insurance & TATs',
      icon: ShieldCheck,
      count: null,
      description: 'Add insurance panels, associate entities & benchmark TAT',
    },
    {
      id: 'security' as const,
      label: 'Security & HIPAA',
      icon: ShieldCheck,
      count: null,
      description: 'Audit logs, encryption verification & lockouts',
    },
    {
      id: 'mfa' as const,
      label: 'Google Authenticator MFA',
      icon: Key,
      count: null,
      description: 'MFA enforcement, reset tokens & TOTP telemetry',
    },
    {
      id: 'automations' as const,
      label: 'Deadline Automations',
      icon: Mail,
      count: null,
      description: 'Scheduled email reminders & SLA alerts',
    },
    {
      id: 'import' as const,
      label: 'Spreadsheet Ingestion',
      icon: Database,
      count: null,
      description: 'Bulk CSV / Excel clinical staff and roster import',
    },
    {
      id: 'settings' as const,
      label: 'System Settings',
      icon: Settings,
      count: null,
      description: 'Workflow stages, SLA targets & payer defaults',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <ShieldCheck className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Administrative &amp; Governance Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              Consolidated governance hub for User Management, Clinical Approvals, Security &amp; HIPAA Compliance, Access Requests, and System Configuration.
            </p>
          </div>

          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer self-start md:self-auto border border-white/15"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
          )}
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div 
            onClick={() => setActiveSection('approvals')}
            className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Pending Approvals</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">{pendingApprovalsCount}</p>
            <p className="text-[11px] text-amber-300 font-medium mt-0.5">Clinical change reviews</p>
          </div>

          <div 
            onClick={() => setActiveSection('access-requests')}
            className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Access Requests</span>
              <UserCheck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">{pendingRequestsCount}</p>
            <p className="text-[11px] text-blue-300 font-medium mt-0.5">Awaiting onboarding</p>
          </div>

          <div 
            onClick={() => setActiveSection('users')}
            className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Active Users</span>
              <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">{totalUsers}</p>
            <p className="text-[11px] text-indigo-300 font-medium mt-0.5">Roster accounts</p>
          </div>

          <div 
            onClick={() => setActiveSection('security')}
            className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Security Status</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">Compliant</p>
            <p className="text-[11px] text-emerald-300 font-medium mt-0.5">HIPAA &amp; ISO 27001</p>
          </div>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1.5 min-w-max">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Sub-Section */}
      <div className="transition-all duration-200">
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {adminTabs.filter(t => t.id !== 'overview').map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveSection(card.id)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-700 flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      {typeof card.count === 'number' && card.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${card.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                          {card.count} {card.count === 1 ? 'item' : 'items'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                        {card.label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2B4C9D] group-hover:text-indigo-700">
                    <span>Manage section</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeSection === 'approvals' && (
          <StaffApprovalsView onBackToOverview={() => setActiveSection('overview')} />
        )}

        {activeSection === 'users' && (
          <NewUserView onBackToDashboard={() => setActiveSection('overview')} />
        )}

        {activeSection === 'access-requests' && (
          <AccessRequestsView 
            onBackToDashboard={() => setActiveSection('overview')} 
            onNavigateToUsers={() => setActiveSection('users')}
          />
        )}

        {activeSection === 'insurances' && (
          <AdminInsuranceManager />
        )}

        {activeSection === 'security' && (
          <SecurityCenterView />
        )}

        {activeSection === 'mfa' && (
          <GoogleAuthenticatorView onBackToDashboard={() => setActiveSection('overview')} />
        )}

        {activeSection === 'automations' && (
          <AutomationDashboardView />
        )}

        {activeSection === 'import' && (
          <DataImportView
            onBackToDashboard={() => setActiveSection('overview')}
            onNavigateToTracker={onNavigateToTracker}
            onNavigateToProviders={onNavigateToProviders}
          />
        )}

        {activeSection === 'settings' && (
          <SystemConfigView onBackToDashboard={() => setActiveSection('overview')} />
        )}
      </div>
    </div>
  );
};
