import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CredentialingProvider, useCredentialing } from './context/CredentialingContext';
import { Header, ActiveTabType } from './components/layout/Header';
import { ManagementDashboard } from './components/dashboard/ManagementDashboard';
import { CredentialingTracker } from './components/tracker/CredentialingTracker';
import { RecordDetailModal } from './components/tracker/RecordDetailModal';
import { ProviderMaster } from './components/providers/ProviderMaster';
import { PayerMaster } from './components/payers/PayerMaster';
import { EntityLocationMaster } from './components/entities/EntityLocationMaster';
import { LocationsMaster } from './components/locations/LocationsMaster';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { NewApplicationModal } from './components/modals/NewApplicationModal';
import { NewUserView } from './components/admin/NewUserView';
import { DataImportView } from './components/admin/DataImportView';
import { SystemConfigView } from './components/admin/SystemConfigView';
import { AutomationDashboardView } from './components/automations/AutomationDashboardView';
import { AccessRequestsView } from './components/admin/AccessRequestsView';
import { SecurityCenterView } from './components/admin/SecurityCenterView';
import { GoogleAuthenticatorView } from './components/admin/GoogleAuthenticatorView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StaffApprovalsView } from './components/admin/StaffApprovalsView';
import { ClinicalStaffHub } from './components/clinical/ClinicalStaffHub';
import { ClinicalStaffPortal } from './components/clinical/ClinicalStaffPortal';
import { CommentsRosterView } from './components/clinical/CommentsRosterView';
import { AesasAlertsView } from './components/automations/AesasAlertsView';
import { SmartDocumentIntakeHub } from './components/intake/SmartDocumentIntakeHub';
import { DbmsManagerView } from './components/admin/DbmsManagerView';
import { TicketManagementView } from './components/dev/TicketManagementView';
import { NemotronEditSystemView } from './components/dev/NemotronEditSystemView';
import { DeveloperHubView } from './components/dev/DeveloperHubView';
import { LoginPage } from './components/auth/LoginPage';
import { ForcePasswordChangeModal } from './components/auth/ForcePasswordChangeModal';
import { ToastContainer } from './components/common/ToastContainer';
import { Discipline } from './types';
import { canAccessTab, getAllowedTabs } from './utils/rbac';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState<boolean>(false);

  const { setFilters, currentAccount, isAuthenticatingOAuth } = useCredentialing();

  // Enforce RBAC navigation constraints: if current activeTab is not allowed, fallback to first authorized tab
  React.useEffect(() => {
    if (currentAccount && !canAccessTab(currentAccount, activeTab)) {
      const allowed = getAllowedTabs(currentAccount);
      if (allowed.length > 0) {
        setActiveTab(allowed[0]);
      }
    }
  }, [currentAccount, activeTab]);

  // If redirect authentication is actively validating tokens or session
  if (isAuthenticatingOAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg border border-slate-200 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 animate-spin text-[#2B4C9D]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Verifying Authorization</h3>
          <p className="text-sm text-slate-500">Validating employee status, organization affiliation, and access permissions...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, display the clean dedicated Login Page
  if (!currentAccount) {
    return <LoginPage />;
  }

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
  };

  const handleSelectProvider = (providerId: string) => {
    setSelectedProviderId(providerId);
    setActiveTab('providers');
  };

  const handleNavigateToTracker = (
    discipline?: Discipline,
    statusCategory?: 'All' | 'Approved' | 'Pending' | 'Requiring Action' | 'Overdue'
  ) => {
    setFilters((prev) => ({
      ...prev,
      ...(discipline ? { discipline } : {}),
      statusCategory: statusCategory || 'All',
      stage: 'All',
      isOverdueOnly: statusCategory === 'Overdue',
      needsActionOnly: false,
    }));
    setActiveTab('tracker');
  };

  const handleNavigateToLinking = () => {
    setActiveTab('tracker');
  };

  const handleOpenAddProvider = () => {
    setSelectedProviderId(null);
    setActiveTab('providers');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 selection:bg-[#2B4C9D] selection:text-white">
      {/* Sleek Minimalist Header with Dropdown navigating directly to Subpages */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewApplication={() => setIsNewAppModalOpen(true)}
        onOpenAddProvider={handleOpenAddProvider}
        onOpenNotificationDrawer={() => setIsNotificationOpen(true)}
      />

      {/* Main Subpage Container with Fluid Page Transitions */}
      <main className="flex-1 w-full pb-12 overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {activeTab === 'dashboard' && (
              <ManagementDashboard
                onSelectRecord={handleSelectRecord}
                onSelectProvider={handleSelectProvider}
                onNavigateToTracker={handleNavigateToTracker}
                onNavigateToLocations={() => setActiveTab('locations')}
                onOpenAddProvider={handleOpenAddProvider}
              />
            )}

        {activeTab === 'tracker' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <CredentialingTracker
              onSelectRecord={handleSelectRecord}
              onOpenNewApplication={() => setIsNewAppModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="pt-2">
            <ClinicalStaffHub
              onSelectProviderId={(pId) => handleSelectProvider(pId)}
              onOpenNewApplication={() => setIsNewAppModalOpen(true)}
              onNavigateToIntake={() => setActiveTab('document-intake')}
            />
          </div>
        )}

        {/* Dedicated Subpage: Clinical Staff Self-Service Profile Portal */}
        {activeTab === 'clinical-portal' && (
          <div className="pt-2">
            <ClinicalStaffPortal onBackToApp={() => setActiveTab('dashboard')} />
          </div>
        )}

        {/* Dedicated Subpage: Consolidated Admin Dashboard */}
        {activeTab === 'admin-dashboard' && (
          <div className="pt-2">
            <AdminDashboard
              onBackToApp={() => setActiveTab('dashboard')}
              onNavigateToTracker={() => setActiveTab('tracker')}
              onNavigateToProviders={() => setActiveTab('providers')}
            />
          </div>
        )}

        {/* Dedicated Subpage: Clinical Staff Approvals Queue */}
        {activeTab === 'staff-approvals' && (
          <div className="pt-2">
            <AdminDashboard
              initialSection="approvals"
              onBackToApp={() => setActiveTab('dashboard')}
              onNavigateToTracker={() => setActiveTab('tracker')}
              onNavigateToProviders={() => setActiveTab('providers')}
            />
          </div>
        )}

        {activeTab === 'payers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <PayerMaster
              onSelectPayerApplications={(payerId) => {
                setFilters((prev) => ({ ...prev, payerId }));
                setActiveTab('tracker');
              }}
            />
          </div>
        )}

        {activeTab === 'locations' && (
          <LocationsMaster
            onSelectRecord={handleSelectRecord}
            onNavigateToStaff={(locationId) => {
              if (locationId) {
                setFilters((prev) => ({ ...prev, locationId }));
              }
              setActiveTab('providers');
            }}
            onNavigateToTracker={(locationId) => {
              if (locationId) {
                setFilters((prev) => ({ ...prev, locationId }));
              }
              setActiveTab('tracker');
            }}
          />
        )}

        {activeTab === 'entities' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <EntityLocationMaster />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <ReportsView />
          </div>
        )}

        {/* Dedicated Tab: AI-Powered Unified Clinical Document Intake Hub */}
        {activeTab === 'document-intake' && (
          <div className="pt-2">
            <SmartDocumentIntakeHub />
          </div>
        )}

        {/* Dedicated Tab: Unified Comments & Notes Roster */}
        {activeTab === 'comments-roster' && (
          <div className="pt-2">
            <CommentsRosterView />
          </div>
        )}

        {/* Dedicated Tab: AESAS (Automated Email Sending Alert System) */}
        {activeTab === 'aesas' && (
          <div className="pt-2">
            <AesasAlertsView />
          </div>
        )}

        {/* Dedicated Subpage: User & Access Management / New User */}
        {(activeTab === 'new-user' || activeTab === 'users') && (
          <NewUserView
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* Dedicated Subpage: Spreadsheet Bulk Ingestion */}
        {activeTab === 'import' && (
          <DataImportView
            onBackToDashboard={() => setActiveTab('dashboard')}
            onNavigateToTracker={() => setActiveTab('tracker')}
            onNavigateToProviders={() => setActiveTab('providers')}
          />
        )}

        {/* Dedicated Subpage: System Settings & SLA */}
        {activeTab === 'settings' && (
          <SystemConfigView
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* Dedicated Subpage: Automated Credential Deadline Reminder System */}
        {activeTab === 'automations' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <AutomationDashboardView />
          </div>
        )}

        {/* Dedicated Subpage: Access Requests (Super Administrator Governance) */}
        {activeTab === 'access-requests' && (
          <AccessRequestsView
            onBackToDashboard={() => setActiveTab('dashboard')}
            onNavigateToUsers={() => setActiveTab('new-user')}
          />
        )}

        {/* Dedicated Subpage: Security & Compliance Governance Center (Super Administrator Only) */}
        {activeTab === 'security-center' && (
          <SecurityCenterView />
        )}

        {/* Dedicated Subpage: Google Authenticator MFA Governance, Telemetry & Logs */}
        {activeTab === 'google-authenticator' && (
          <GoogleAuthenticatorView
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* Dedicated Dev Tab: Developer Center (DBMS Manager, Nemotron AI Edit, Ticket Management, Clinical Staff Monitor) */}
        {activeTab === 'developer' && (
          <DeveloperHubView
            onOpenNewApplication={() => setIsNewAppModalOpen(true)}
            onSelectProvider={(pId) => handleSelectProvider(pId)}
            onNavigateToIntake={() => setActiveTab('document-intake')}
          />
        )}

        {/* Dedicated Tab: Supabase Live DBMS Manager (DEV Profile / Admin) */}
        {activeTab === 'dbms-manager' && (
          <DeveloperHubView
            initialSubTab="dbms-manager"
            onOpenNewApplication={() => setIsNewAppModalOpen(true)}
            onSelectProvider={(pId) => handleSelectProvider(pId)}
            onNavigateToIntake={() => setActiveTab('document-intake')}
          />
        )}

        {/* Dedicated Tab: Ticket Management (DEV ONLY) */}
        {activeTab === 'tickets' && (
          <DeveloperHubView
            initialSubTab="tickets"
            onOpenNewApplication={() => setIsNewAppModalOpen(true)}
            onSelectProvider={(pId) => handleSelectProvider(pId)}
            onNavigateToIntake={() => setActiveTab('document-intake')}
          />
        )}

        {/* Dedicated Tab: NVIDIA Nemotron Edit System (DEV Profile / Admin) */}
        {activeTab === 'nemotron-edit' && (
          <DeveloperHubView
            initialSubTab="nemotron-edit"
            onOpenNewApplication={() => setIsNewAppModalOpen(true)}
            onSelectProvider={(pId) => handleSelectProvider(pId)}
            onNavigateToIntake={() => setActiveTab('document-intake')}
          />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Record Detail Workspace Modal */}
      {selectedRecordId && (
        <RecordDetailModal
          recordId={selectedRecordId}
          onClose={() => setSelectedRecordId(null)}
          onSelectProvider={(pId) => {
            setSelectedRecordId(null);
            handleSelectProvider(pId);
          }}
        />
      )}

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onSelectRecord={handleSelectRecord}
        onSelectProvider={handleSelectProvider}
      />

      {/* New Application Intake Modal */}
      <NewApplicationModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onSelectRecord={handleSelectRecord}
        onNavigateToLinking={handleNavigateToLinking}
        onNavigateToProviders={(pId) => {
          if (pId) setSelectedProviderId(pId);
          setActiveTab('providers');
        }}
      />

      {/* Mandatory First Sign-On Password Setup Modal */}
      <ForcePasswordChangeModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Proficio Credentialing Application Error">
      <CredentialingProvider>
        <ErrorBoundary fallbackTitle="Proficio Workspace View Error">
          <MainContent />
        </ErrorBoundary>
        <ToastContainer />
      </CredentialingProvider>
    </ErrorBoundary>
  );
};

export default App;
