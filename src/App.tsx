import React, { useState } from 'react';
import { CredentialingProvider, useCredentialing } from './context/CredentialingContext';
import { Header } from './components/layout/Header';
import { ManagementDashboard } from './components/dashboard/ManagementDashboard';
import { CredentialingTracker } from './components/tracker/CredentialingTracker';
import { RecordDetailModal } from './components/tracker/RecordDetailModal';
import { ProviderMaster } from './components/providers/ProviderMaster';
import { PayerMaster } from './components/payers/PayerMaster';
import { EntityLocationMaster } from './components/entities/EntityLocationMaster';
import { LinkingContractingTracker } from './components/linking/LinkingContractingTracker';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { NewApplicationModal } from './components/modals/NewApplicationModal';
import { DataImportModal } from './components/admin/DataImportModal';
import { SystemConfigModal } from './components/admin/SystemConfigModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserManagementModal } from './components/admin/UserManagementModal';
import { Discipline } from './types';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracker' | 'linking' | 'providers' | 'payers' | 'entities' | 'reports'>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState<boolean>(false);

  const { setFilters, currentAccount } = useCredentialing();

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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800 selection:bg-[#2B4C9D] selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewApplication={() => setIsNewAppModalOpen(true)}
        onOpenAddProvider={handleOpenAddProvider}
        onOpenNotificationDrawer={() => setIsNotificationOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenUserManagementModal={() => setIsUserManagementOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <ManagementDashboard
            onSelectRecord={handleSelectRecord}
            onSelectProvider={handleSelectProvider}
            onNavigateToTracker={handleNavigateToTracker}
            onNavigateToLinking={handleNavigateToLinking}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenUserManagementModal={() => setIsUserManagementOpen(true)}
            onOpenAddProvider={handleOpenAddProvider}
          />
        )}

        {activeTab === 'tracker' && (
          <CredentialingTracker
            onSelectRecord={handleSelectRecord}
            onOpenNewApplication={() => setIsNewAppModalOpen(true)}
          />
        )}

        {activeTab === 'providers' && (
          <ProviderMaster
            onSelectRecord={handleSelectRecord}
            selectedProviderId={selectedProviderId}
            onClearSelectedProvider={() => setSelectedProviderId(null)}
          />
        )}

        {activeTab === 'payers' && (
          <PayerMaster
            onSelectPayerApplications={(payerId) => {
              setFilters((prev) => ({ ...prev, payerId }));
              setActiveTab('tracker');
            }}
          />
        )}

        {activeTab === 'entities' && <EntityLocationMaster />}

        {activeTab === 'linking' && (
          <LinkingContractingTracker onSelectRecord={handleSelectRecord} />
        )}

        {activeTab === 'reports' && <ReportsView />}
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
      />

      {/* Data Import Modal (Excel .xlsx / CSV parser) */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* System Configuration Modal */}
      <SystemConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Auth / Account Switch Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User & Provider Access Management Modal (Admin) */}
      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CredentialingProvider>
      <MainApp />
    </CredentialingProvider>
  );
}
