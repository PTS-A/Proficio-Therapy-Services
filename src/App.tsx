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
import { Discipline } from './types';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  const { setFilters } = useCredentialing();

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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenNewApplication={() => setIsNewAppModalOpen(true)}
        onOpenImport={() => setIsImportModalOpen(true)}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <ManagementDashboard
            onSelectRecord={handleSelectRecord}
            onSelectProvider={handleSelectProvider}
            onNavigateToTracker={handleNavigateToTracker}
            onNavigateToLinking={handleNavigateToLinking}
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

      {/* Data Import Modal (FR-028) */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* System Configuration Modal (FR-027, FR-031) */}
      <SystemConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
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
