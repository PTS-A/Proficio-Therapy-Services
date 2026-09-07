import React, { useState } from 'react';
import { CredentialingProvider, useCredentialing } from './context/CredentialingContext';
import { Header, ActiveTabType } from './components/layout/Header';
import { ManagementDashboard } from './components/dashboard/ManagementDashboard';
import { CredentialingTracker } from './components/tracker/CredentialingTracker';
import { RecordDetailModal } from './components/tracker/RecordDetailModal';
import { ProviderMaster } from './components/providers/ProviderMaster';
import { PayerMaster } from './components/payers/PayerMaster';
import { EntityLocationMaster } from './components/entities/EntityLocationMaster';
import { LocationsMaster } from './components/locations/LocationsMaster';
import { LinkingContractingTracker } from './components/linking/LinkingContractingTracker';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { NewApplicationModal } from './components/modals/NewApplicationModal';
import { UserManagementView } from './components/admin/UserManagementView';
import { NewUserView } from './components/admin/NewUserView';
import { DataImportView } from './components/admin/DataImportView';
import { SystemConfigView } from './components/admin/SystemConfigView';
import { LoginPage } from './components/auth/LoginPage';
import { ForcePasswordChangeModal } from './components/auth/ForcePasswordChangeModal';
import { Discipline } from './types';
import { canAccessTab, getAllowedTabs } from './utils/rbac';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState<boolean>(false);

  const { setFilters, currentAccount } = useCredentialing();

  // Enforce RBAC navigation constraints: if current activeTab is not allowed, fallback to first authorized tab
  React.useEffect(() => {
    if (currentAccount && !canAccessTab(currentAccount, activeTab)) {
      const allowed = getAllowedTabs(currentAccount);
      if (allowed.length > 0) {
        setActiveTab(allowed[0]);
      }
    }
  }, [currentAccount, activeTab]);

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

  const handleNavigateToTracker = (discipline?: Discipline) => {
    if (discipline) {
      setFilters((prev) => ({ ...prev, discipline }));
    }
    setActiveTab('tracker');
  };

  const handleNavigateToLinking = () => {
    setActiveTab('linking');
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

      {/* Main Subpage Container */}
      <main className="flex-1 w-full pb-12">
        {activeTab === 'dashboard' && (
          <ManagementDashboard
            onSelectRecord={handleSelectRecord}
            onSelectProvider={handleSelectProvider}
            onNavigateToTracker={handleNavigateToTracker}
            onNavigateToLinking={handleNavigateToLinking}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <ProviderMaster
              onSelectRecord={handleSelectRecord}
              selectedProviderId={selectedProviderId}
              onClearSelectedProvider={() => setSelectedProviderId(null)}
              onNavigateToLinking={() => setActiveTab('linking')}
              onNavigateToTracker={() => setActiveTab('tracker')}
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

        {activeTab === 'linking' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <LinkingContractingTracker onSelectRecord={handleSelectRecord} />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <ReportsView />
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
    <CredentialingProvider>
      <MainContent />
    </CredentialingProvider>
  );
};

export default App;
