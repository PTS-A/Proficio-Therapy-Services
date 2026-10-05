import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Cpu, 
  Ticket, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Layers,
  ArrowRight,
  Code2,
  RefreshCw,
  Server
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { isDeveloper, isSuperAdmin } from '../../utils/rbac';
import { DbmsManagerView } from '../admin/DbmsManagerView';
import { NemotronEditSystemView } from './NemotronEditSystemView';
import { TicketManagementView } from './TicketManagementView';
import { ClinicalStaffHub } from '../clinical/ClinicalStaffHub';

export type DevSubTab = 'clinical-staff' | 'dbms-manager' | 'nemotron-edit' | 'tickets';

interface DeveloperHubViewProps {
  initialSubTab?: DevSubTab;
  onOpenNewApplication?: () => void;
  onSelectProvider?: (id: string) => void;
  onNavigateToIntake?: () => void;
}

export const DeveloperHubView: React.FC<DeveloperHubViewProps> = ({
  initialSubTab = 'clinical-staff',
  onOpenNewApplication,
  onSelectProvider,
  onNavigateToIntake,
}) => {
  const { currentAccount, providers, clinicalStaff, entities } = useCredentialing();
  const [activeDevSubTab, setActiveDevSubTab] = useState<DevSubTab>(initialSubTab);

  const isDevAuthorized = isDeveloper(currentAccount) || currentAccount?.canAccessDev === true || isSuperAdmin(currentAccount);

  // Security barrier: Non-developers cannot access
  if (!isDevAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="bg-white rounded-3xl border border-rose-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-2xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Developer Credentials Required</h2>
          <p className="text-xs text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
            The Developer Tab (DBMS Manager, Nemotron AI Edit, and Ticket Management) is restricted exclusively to Developer profile accounts. Your current profile ({currentAccount?.email || 'Guest'}) does not have developer privileges.
          </p>
        </div>
      </div>
    );
  }

  // Developer navigation items: only the dev tab features + what clinical staff is showing
  const devNavItems = [
    {
      id: 'clinical-staff' as const,
      label: 'Clinical Staff',
      icon: Users,
      description: 'Live clinical staff directory, credentials, and entity mapping',
      count: (clinicalStaff || []).length || (providers || []).length,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'dbms-manager' as const,
      label: 'DBMS Manager',
      icon: Database,
      description: 'Direct Supabase PostgreSQL live table inspector & query console',
      count: null,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'nemotron-edit' as const,
      label: 'Nemotron AI Edit',
      icon: Cpu,
      description: 'NVIDIA Nemotron prompt code editor & atomic system savepoints',
      count: null,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'tickets' as const,
      label: 'Ticket Management',
      icon: Ticket,
      description: 'Internal developer issue tracking, bugs, and resolution triage',
      count: null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
  ];

  return (
    <div className="w-full pb-12">
      {/* Dev Tab Top Header — shows only the dev tab features + what clinical staff is showing */}
      <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-16 z-30">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
            {/* Left: Dev identity badge */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold tracking-tight text-white">Developer Center</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                    Dev Profile Only
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Engineering workspace: DBMS SQL, Nemotron AI, Tickets &amp; Clinical Staff Monitor
                </p>
              </div>
            </div>

            {/* Right: The Dev Tab Navigation Buttons */}
            <div className="flex items-center overflow-x-auto gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
              {devNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeDevSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveDevSubTab(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.count !== null && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-purple-900/60 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dev Workspace Content */}
      <div className="w-full">
        {activeDevSubTab === 'clinical-staff' && (
          <div className="pt-2">
            <ClinicalStaffHub
              onSelectProviderId={onSelectProvider}
              onOpenNewApplication={onOpenNewApplication}
              onNavigateToIntake={onNavigateToIntake}
            />
          </div>
        )}

        {activeDevSubTab === 'dbms-manager' && (
          <div className="pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DbmsManagerView />
          </div>
        )}

        {activeDevSubTab === 'nemotron-edit' && (
          <div className="pt-4">
            <NemotronEditSystemView />
          </div>
        )}

        {activeDevSubTab === 'tickets' && (
          <div className="pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TicketManagementView />
          </div>
        )}
      </div>
    </div>
  );
};
