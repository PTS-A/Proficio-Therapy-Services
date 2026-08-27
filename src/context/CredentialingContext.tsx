import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AccessLevel,
  AppAccount,
  ApplicationType,
  AuditEntry,
  ChecklistItem,
  CredentialingRecord,
  CredentialingStage,
  Discipline,
  DocumentItem,
  FollowUpEntry,
  KPIStats,
  LegalEntity,
  LinkingStatus,
  Location,
  Payer,
  Provider,
  SavedFilter,
  SystemNotification,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_CREDENTIALING_RECORDS,
  INITIAL_LEGAL_ENTITIES,
  INITIAL_LOCATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYERS,
  INITIAL_PROVIDERS,
  INITIAL_USERS,
} from '../data/initialData';
import { addBusinessDays, calculateBusinessDays, calculateDaysBetween, getAgingBucket, isFollowUpOverdue } from '../utils/slaCalculator';
import { validateCredentialingRecord } from '../utils/entityValidation';

interface FilterState {
  searchQuery: string;
  discipline: Discipline | 'All';
  payerId: string | 'All';
  entityId: string | 'All';
  locationId: string | 'All';
  stage: CredentialingStage | 'All';
  applicationType: ApplicationType | 'All';
  specialistId: string | 'All';
  isOverdueOnly: boolean;
  needsActionOnly: boolean;
  linkingPendingOnly: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  discipline: 'All',
  payerId: 'All',
  entityId: 'All',
  locationId: 'All',
  stage: 'All',
  applicationType: 'All',
  specialistId: 'All',
  isOverdueOnly: false,
  needsActionOnly: false,
  linkingPendingOnly: false,
};

interface CredentialingContextType {
  // Accounts & Authentication
  accounts: AppAccount[];
  currentAccount: AppAccount | null;
  isAdmin: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: (reason?: string) => void;
  sessionTimeoutMessage: string | null;
  sessionSecondsLeft: number;
  resetSessionTimer: () => void;
  createAccount: (accData: Omit<AppAccount, 'id' | 'createdAt'>) => { success: boolean; account?: AppAccount; error?: string };
  updateAccount: (id: string, updates: Partial<AppAccount>) => void;
  deleteAccount: (id: string) => { success: boolean; error?: string };
  switchAccount: (accountId: string) => void;

  providers: Provider[];
  payers: Payer[];
  entities: LegalEntity[];
  locations: Location[];
  records: CredentialingRecord[];
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  notifications: SystemNotification[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  savedFilters: SavedFilter[];
  saveCurrentFilter: (name: string) => void;
  applySavedFilter: (filter: SavedFilter) => void;
  
  // Selection
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
  selectedProviderId: string | null;
  setSelectedProviderId: (id: string | null) => void;

  // Record CRUD & Actions
  createRecord: (data: {
    providerId: string;
    payerId: string;
    entityId: string;
    locationId: string;
    applicationType: ApplicationType;
    assignedSpecialistId?: string;
    intakeDate?: string;
    notes?: string;
  }) => CredentialingRecord;
  updateRecord: (id: string, updates: Partial<CredentialingRecord>) => void;
  advanceRecordStage: (
    recordId: string, 
    newStage: CredentialingStage, 
    overrideReason?: string, 
    dates?: { submissionDate?: string; approvalDate?: string; effectiveDate?: string; linkEffectiveDate?: string }
  ) => { success: boolean; error?: string };
  logFollowUp: (
    recordId: string, 
    followUp: Omit<FollowUpEntry, 'id' | 'specialistId' | 'specialistName'>
  ) => void;
  addDocumentToRecord: (recordId: string, doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  toggleChecklistItem: (recordId: string, itemId: string) => void;
  overrideValidation: (recordId: string, reason: string) => void;
  updateProviderLinking: (recordId: string, status: LinkingStatus, linkEffectiveDate?: string, notes?: string) => void;

  // Provider CRUD
  addProvider: (providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt' | 'documents'>) => Provider;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  deleteProvider: (id: string) => void;

  // Payer CRUD
  addPayer: (payerData: Omit<Payer, 'id'>) => Payer;
  updatePayer: (id: string, updates: Partial<Payer>) => void;

  // Entity & Location CRUD
  addEntity: (entityData: Omit<LegalEntity, 'id'>) => LegalEntity;
  updateEntity: (id: string, updates: Partial<LegalEntity>) => void;
  addLocation: (locData: Omit<Location, 'id'>) => Location;
  updateLocation: (id: string, updates: Partial<Location>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Statistics
  kpis: KPIStats;
  getFilteredRecords: () => CredentialingRecord[];
  
  // System Tools
  resetToDefaultData: () => void;
  importBulkData: (importedRecords: CredentialingRecord[], importedProviders?: Provider[], importedPayers?: Payer[], importedLocations?: Location[]) => void;
}

const CredentialingContext = createContext<CredentialingContextType | undefined>(undefined);

export const CredentialingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts State
  const [accounts, setAccounts] = useState<AppAccount[]>(() => {
    const saved = localStorage.getItem('cred_accounts');
    if (saved) {
      try {
        const parsed: AppAccount[] = JSON.parse(saved);
        let list = [...parsed];
        // Ensure both clean admin and demo admin accounts are always present
        if (!list.some((a) => a.email.toLowerCase() === 'admin@example.com')) {
          list = [INITIAL_ACCOUNTS[0], ...list];
        }
        if (!list.some((a) => a.email.toLowerCase() === 'demo@proficiotherapy.com')) {
          list = [...list, INITIAL_ACCOUNTS[1]];
        }
        return list;
      } catch (e) {
        return INITIAL_ACCOUNTS;
      }
    }
    return INITIAL_ACCOUNTS;
  });

  // Session Timeout State (20 minutes inactivity)
  const SESSION_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes = 1,200,000 ms

  const [sessionTimeoutMessage, setSessionTimeoutMessage] = useState<string | null>(() => {
    return localStorage.getItem('cred_timeout_reason') || null;
  });

  const [sessionSecondsLeft, setSessionSecondsLeft] = useState<number>(20 * 60);
  const lastActivityRef = React.useRef<number>(Date.now());

  // Helper to determine if account uses clean skeleton data
  const isSkeletonEmail = (email?: string | null) => {
    return email?.toLowerCase() === 'admin@example.com';
  };

  // Default page is the login page (currentAccount is null by default on fresh visit/timeout)
  const [currentAccount, setCurrentAccount] = useState<AppAccount | null>(() => {
    const saved = localStorage.getItem('cred_current_account');
    const lastActiveStr = localStorage.getItem('cred_last_activity');
    if (saved && lastActiveStr) {
      try {
        const lastActive = parseInt(lastActiveStr, 10);
        const elapsed = Date.now() - lastActive;
        if (!isNaN(lastActive) && elapsed < SESSION_TIMEOUT_MS) {
          return JSON.parse(saved);
        }
      } catch (e) {
        return null;
      }
    }
    // Default to null so user starts at the login page
    return null;
  });

  const [providers, setProviders] = useState<Provider[]>(() => {
    const savedCurrent = localStorage.getItem('cred_current_account');
    let email: string | null = null;
    if (savedCurrent) {
      try {
        email = JSON.parse(savedCurrent)?.email;
      } catch (e) {}
    }
    if (isSkeletonEmail(email)) {
      const saved = localStorage.getItem('cred_providers_skeleton');
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem('cred_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [payers, setPayers] = useState<Payer[]>(() => {
    const saved = localStorage.getItem('cred_payers');
    return saved ? JSON.parse(saved) : INITIAL_PAYERS;
  });

  const [entities, setEntities] = useState<LegalEntity[]>(() => {
    const saved = localStorage.getItem('cred_entities');
    return saved ? JSON.parse(saved) : INITIAL_LEGAL_ENTITIES;
  });

  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem('cred_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [records, setRecords] = useState<CredentialingRecord[]>(() => {
    const savedCurrent = localStorage.getItem('cred_current_account');
    let email: string | null = null;
    if (savedCurrent) {
      try {
        email = JSON.parse(savedCurrent)?.email;
      } catch (e) {}
    }
    if (isSkeletonEmail(email)) {
      const saved = localStorage.getItem('cred_records_skeleton');
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem('cred_records');
    return saved ? JSON.parse(saved) : INITIAL_CREDENTIALING_RECORDS;
  });

  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (currentAccount) {
      const match = INITIAL_USERS.find((u) => u.email.toLowerCase() === currentAccount.email.toLowerCase());
      if (match) return match;
      return {
        id: currentAccount.id,
        name: currentAccount.name,
        email: currentAccount.email,
        role: currentAccount.accessLevel === 'ADMINISTRATOR' ? 'Admin' : 'Specialist',
        accessLevel: currentAccount.accessLevel,
      };
    }
    return INITIAL_USERS[0];
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const savedCurrent = localStorage.getItem('cred_current_account');
    let email: string | null = null;
    if (savedCurrent) {
      try {
        email = JSON.parse(savedCurrent)?.email;
      } catch (e) {}
    }
    if (isSkeletonEmail(email)) {
      const saved = localStorage.getItem('cred_notifications_skeleton');
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem('cred_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    { id: 'sf-1', name: 'All Overdue Follow-ups', isOverdueOnly: true },
    { id: 'sf-2', name: 'ABA Initial Submissions', discipline: 'ABA', stage: 'Application Submitted' },
    { id: 'sf-3', name: 'Speech & OT Linking Pending', stage: 'Linking Pending' },
  ]);

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const isAdmin = currentAccount?.accessLevel === 'ADMINISTRATOR';

  // Sync to localStorage with workspace isolation for skeleton vs demo accounts
  useEffect(() => {
    localStorage.setItem('cred_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem('cred_current_account', JSON.stringify(currentAccount));
    } else {
      localStorage.removeItem('cred_current_account');
    }
  }, [currentAccount]);

  useEffect(() => {
    if (isSkeletonEmail(currentAccount?.email)) {
      localStorage.setItem('cred_providers_skeleton', JSON.stringify(providers));
    } else {
      localStorage.setItem('cred_providers', JSON.stringify(providers));
    }
  }, [providers, currentAccount]);

  useEffect(() => {
    localStorage.setItem('cred_payers', JSON.stringify(payers));
  }, [payers]);

  useEffect(() => {
    localStorage.setItem('cred_entities', JSON.stringify(entities));
  }, [entities]);

  useEffect(() => {
    localStorage.setItem('cred_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    if (isSkeletonEmail(currentAccount?.email)) {
      localStorage.setItem('cred_records_skeleton', JSON.stringify(records));
    } else {
      localStorage.setItem('cred_records', JSON.stringify(records));
    }
  }, [records, currentAccount]);

  useEffect(() => {
    if (isSkeletonEmail(currentAccount?.email)) {
      localStorage.setItem('cred_notifications_skeleton', JSON.stringify(notifications));
    } else {
      localStorage.setItem('cred_notifications', JSON.stringify(notifications));
    }
  }, [notifications, currentAccount]);

  // Sync currentUser with currentAccount changes
  useEffect(() => {
    if (currentAccount) {
      const match = users.find((u) => u.email.toLowerCase() === currentAccount.email.toLowerCase());
      if (match) {
        setCurrentUser({ ...match, accessLevel: currentAccount.accessLevel });
      } else {
        setCurrentUser({
          id: currentAccount.id,
          name: currentAccount.name,
          email: currentAccount.email,
          role: currentAccount.accessLevel === 'ADMINISTRATOR' ? 'Admin' : 'Specialist',
          accessLevel: currentAccount.accessLevel,
        });
      }
    }
  }, [currentAccount, users]);

  // Automated overdue & SLA checker run on mount and records update
  useEffect(() => {
    let recordsUpdated = false;

    const checkedRecords = records.map((rec) => {
      const isOverdueNow = isFollowUpOverdue(rec.nextFollowUpDate) && 
        !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(rec.stage);

      if (rec.isOverdue !== isOverdueNow) {
        recordsUpdated = true;
        return {
          ...rec,
          isOverdue: isOverdueNow,
          stage: isOverdueNow && rec.stage !== 'Overdue' ? ('Overdue' as CredentialingStage) : rec.stage,
        };
      }
      return rec;
    });

    if (recordsUpdated) {
      setRecords(checkedRecords);
    }
  }, [records]);

  // 20-minute inactivity timer and activity event listeners
  const resetSessionTimer = React.useCallback(() => {
    lastActivityRef.current = Date.now();
    localStorage.setItem('cred_last_activity', String(Date.now()));
    setSessionSecondsLeft(20 * 60);
  }, []);

  useEffect(() => {
    if (!currentAccount) {
      setSessionSecondsLeft(20 * 60);
      return;
    }

    // Initialize session activity on login or active state
    lastActivityRef.current = Date.now();
    localStorage.setItem('cred_last_activity', String(Date.now()));

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const recordUserActivity = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          lastActivityRef.current = Date.now();
          localStorage.setItem('cred_last_activity', String(Date.now()));
          throttleTimer = null;
        }, 1000);
      }
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, recordUserActivity, { passive: true });
    });

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remainingMs = SESSION_TIMEOUT_MS - elapsed;
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      setSessionSecondsLeft(remainingSec);

      if (remainingMs <= 0) {
        // Automatic logout on 20-minute inactivity
        setCurrentAccount(null);
        localStorage.removeItem('cred_current_account');
        localStorage.removeItem('cred_last_activity');
        const timeoutMsg = 'Your session has timed out after 20 minutes of inactivity. For security, please sign in again.';
        localStorage.setItem('cred_timeout_reason', timeoutMsg);
        setSessionTimeoutMessage(timeoutMsg);
      }
    }, 1000);

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, recordUserActivity);
      });
      clearInterval(interval);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [currentAccount, SESSION_TIMEOUT_MS]);

  const switchDataForAccount = (targetAccount: AppAccount) => {
    if (isSkeletonEmail(targetAccount.email)) {
      const savedProviders = localStorage.getItem('cred_providers_skeleton');
      setProviders(savedProviders ? JSON.parse(savedProviders) : []);

      const savedRecords = localStorage.getItem('cred_records_skeleton');
      setRecords(savedRecords ? JSON.parse(savedRecords) : []);

      const savedNotifications = localStorage.getItem('cred_notifications_skeleton');
      setNotifications(savedNotifications ? JSON.parse(savedNotifications) : []);
    } else {
      const savedProviders = localStorage.getItem('cred_providers');
      setProviders(savedProviders ? JSON.parse(savedProviders) : INITIAL_PROVIDERS);

      const savedRecords = localStorage.getItem('cred_records');
      setRecords(savedRecords ? JSON.parse(savedRecords) : INITIAL_CREDENTIALING_RECORDS);

      const savedNotifications = localStorage.getItem('cred_notifications');
      setNotifications(savedNotifications ? JSON.parse(savedNotifications) : INITIAL_NOTIFICATIONS);
    }
  };

  // Auth Operations
  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    // If password provided, verify it
    if (password && found.password && found.password !== password) {
      return { success: false, error: 'Incorrect password. Please check your password and try again.' };
    }

    const updated = {
      ...found,
      lastLogin: new Date().toISOString().split('T')[0],
    };
    setCurrentAccount(updated);
    switchDataForAccount(updated);
    setAccounts((prev) => prev.map((a) => (a.id === found.id ? updated : a)));

    // Clear timeout reason & start new session activity timer
    localStorage.removeItem('cred_timeout_reason');
    setSessionTimeoutMessage(null);
    lastActivityRef.current = Date.now();
    localStorage.setItem('cred_last_activity', String(Date.now()));
    setSessionSecondsLeft(20 * 60);

    return { success: true };
  };

  const logout = (reason?: string) => {
    setCurrentAccount(null);
    localStorage.removeItem('cred_current_account');
    localStorage.removeItem('cred_last_activity');
    if (reason) {
      localStorage.setItem('cred_timeout_reason', reason);
      setSessionTimeoutMessage(reason);
    } else {
      localStorage.removeItem('cred_timeout_reason');
      setSessionTimeoutMessage(null);
    }
  };

  const createAccount = (accData: Omit<AppAccount, 'id' | 'createdAt'>): { success: boolean; account?: AppAccount; error?: string } => {
    const cleanEmail = accData.email.trim().toLowerCase();
    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newAcc: AppAccount = {
      id: `acc-${Date.now()}`,
      name: accData.name.trim(),
      email: cleanEmail,
      password: accData.password || 'proficio',
      accessLevel: accData.accessLevel || 'USER',
      roleTitle: accData.roleTitle || (accData.accessLevel === 'ADMINISTRATOR' ? 'Credentialing Administrator' : 'Credentialing Specialist'),
      department: accData.department || 'Proficio Therapy Credentialing Hub',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
    };

    setAccounts((prev) => [...prev, newAcc]);
    return { success: true, account: newAcc };
  };

  const updateAccount = (id: string, updates: Partial<AppAccount>) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates };
          if (currentAccount && currentAccount.id === id) {
            setCurrentAccount(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  const deleteAccount = (id: string): { success: boolean; error?: string } => {
    const accToDelete = accounts.find((a) => a.id === id);
    const cleanDelEmail = accToDelete?.email.toLowerCase();
    if (cleanDelEmail === 'demo@proficiotherapy.com' || cleanDelEmail === 'admin@example.com') {
      return { success: false, error: 'Primary system administrator accounts cannot be deleted.' };
    }
    if (currentAccount?.id === id) {
      return { success: false, error: 'Cannot delete the account currently logged in.' };
    }
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    return { success: true };
  };

  const switchAccount = (accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (acc) {
      setCurrentAccount(acc);
      switchDataForAccount(acc);
    }
  };

  const switchRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || {
      id: `usr-custom-${role.toLowerCase()}`,
      name: `${role} User`,
      email: `${role.toLowerCase()}@organization.com`,
      role,
      accessLevel: role === 'Admin' || role === 'Leadership' ? 'ADMINISTRATOR' : 'USER',
    };
    setCurrentUser(matched);
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const saveCurrentFilter = (name: string) => {
    const newSaved: SavedFilter = {
      id: `sf-${Date.now()}`,
      name,
      ...filters,
    };
    setSavedFilters((prev) => [...prev, newSaved]);
  };

  const applySavedFilter = (sf: SavedFilter) => {
    setFilters((prev) => ({
      ...prev,
      discipline: sf.discipline || 'All',
      payerId: sf.payerId || 'All',
      entityId: sf.entityId || 'All',
      locationId: sf.locationId || 'All',
      stage: sf.stage || 'All',
      applicationType: sf.applicationType || 'All',
      specialistId: sf.specialistId || 'All',
      isOverdueOnly: sf.isOverdueOnly || false,
    }));
  };

  // Create Record
  const createRecord = (data: {
    providerId: string;
    payerId: string;
    entityId: string;
    locationId: string;
    applicationType: ApplicationType;
    assignedSpecialistId?: string;
    intakeDate?: string;
    notes?: string;
  }): CredentialingRecord => {
    const provider = providers.find((p) => p.id === data.providerId);
    const payer = payers.find((p) => p.id === data.payerId);
    const assignedUser = users.find((u) => u.id === data.assignedSpecialistId) || currentUser;
    const now = new Date();
    const todayStr = data.intakeDate || now.toISOString().split('T')[0];
    
    // Auto-generate ID: APP-2026-XXXX
    const nextSeq = (records.length + 1).toString().padStart(4, '0');
    const recordId = `APP-2026-${nextSeq}`;

    // Derive automated checklist based on payer requirements (FR-009)
    const checklist: ChecklistItem[] = [
      { id: `chk-${Date.now()}-1`, title: 'NPI & NPPES Validation', category: 'Validation', isRequired: true, isCompleted: provider?.npiVerified || false },
      { id: `chk-${Date.now()}-2`, title: 'State Professional License Verified', category: 'Document', isRequired: true, isCompleted: !!provider?.licenseNumber },
      { id: `chk-${Date.now()}-3`, title: 'CAQH Profile Attestation Verified', category: 'Validation', isRequired: true, isCompleted: provider?.caqhStatus === 'Attested' },
      { id: `chk-${Date.now()}-4`, title: 'Entity & DBA Match Confirmation', category: 'Validation', isRequired: true, isCompleted: true },
      { id: `chk-${Date.now()}-5`, title: 'Malpractice / COI Current', category: 'Document', isRequired: true, isCompleted: true },
      ...(payer?.requiredDocuments.map((doc, idx) => ({
        id: `chk-pyr-${Date.now()}-${idx}`,
        title: `Payer Requirement: ${doc}`,
        category: 'Document' as const,
        isRequired: true,
        isCompleted: false,
      })) || []),
    ];

    const newRecord: CredentialingRecord = {
      id: recordId,
      providerId: data.providerId,
      payerId: data.payerId,
      entityId: data.entityId,
      locationId: data.locationId,
      applicationType: data.applicationType,
      discipline: provider?.disciplines[0] || 'ABA',
      stage: 'Intake',
      assignedSpecialistId: assignedUser.id,
      assignedSpecialistName: assignedUser.name,
      intakeDate: todayStr,
      targetTurnaroundDate: payer ? addBusinessDays(todayStr, payer.averageTatDays) : addBusinessDays(todayStr, 60),
      isOverdue: false,
      daysInCurrentStage: 0,
      totalCycleDays: 0,
      linkingStatus: data.applicationType === 'Provider linking' ? 'Pending Approval' : 'Not Applicable',
      contractStatus: 'Contract Executed',
      followUps: [],
      checklist,
      documents: [],
      validationIssues: [],
      notes: data.notes || '',
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'Created Credentialing Record',
          notes: `Initiated ${data.applicationType} application for ${provider?.firstName} ${provider?.lastName} with ${payer?.name}.`,
        },
      ],
      createdAt: todayStr,
      updatedAt: todayStr,
    };

    // Run initial validation
    const entity = entities.find((e) => e.id === data.entityId);
    const location = locations.find((l) => l.id === data.locationId);
    newRecord.validationIssues = validateCredentialingRecord(newRecord, provider, payer, entity, location);

    setRecords((prev) => [newRecord, ...prev]);

    // Send notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      type: 'MISSING_DOCS',
      title: `New Application Created: ${recordId}`,
      message: `Assigned to ${assignedUser.name} for ${provider?.firstName} ${provider?.lastName} (${payer?.name}).`,
      timestamp: new Date().toLocaleString(),
      recordId,
      providerId: provider?.id,
      severity: 'info',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newRecord;
  };

  // Update Record
  const updateRecord = (id: string, updates: Partial<CredentialingRecord>) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          const updated = {
            ...rec,
            ...updates,
            updatedAt: new Date().toISOString().split('T')[0],
          };

          // Re-validate
          const provider = providers.find((p) => p.id === updated.providerId);
          const payer = payers.find((p) => p.id === updated.payerId);
          const entity = entities.find((e) => e.id === updated.entityId);
          const location = locations.find((l) => l.id === updated.locationId);
          updated.validationIssues = validateCredentialingRecord(updated, provider, payer, entity, location);

          return updated;
        }
        return rec;
      })
    );
  };

  // Stage Progression with Pre-Submission Validation Gating
  const advanceRecordStage = (
    recordId: string,
    newStage: CredentialingStage,
    overrideReason?: string,
    dates?: { submissionDate?: string; approvalDate?: string; effectiveDate?: string; linkEffectiveDate?: string }
  ): { success: boolean; error?: string } => {
    const record = records.find((r) => r.id === recordId);
    if (!record) return { success: false, error: 'Record not found.' };

    const provider = providers.find((p) => p.id === record.providerId);
    const payer = payers.find((p) => p.id === record.payerId);
    const entity = entities.find((e) => e.id === record.entityId);
    const location = locations.find((l) => l.id === record.locationId);

    const issues = validateCredentialingRecord(record, provider, payer, entity, location);
    const blockingErrors = issues.filter((i) => i.severity === 'Error');

    // Rule: Cannot advance to "Application Submitted" if blocking errors exist without override
    if (newStage === 'Application Submitted' && blockingErrors.length > 0 && !overrideReason && !record.validationOverridden) {
      return {
        success: false,
        error: `Submission blocked by ${blockingErrors.length} critical validation error(s): ${blockingErrors.map((e) => e.description).join(' ')}. Please resolve or provide an administrative override with justification.`,
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const updatedAudit: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Stage Transitioned',
      previousValue: record.stage,
      newValue: newStage,
      notes: overrideReason ? `Administrative Override: ${overrideReason}` : `Transitioned to ${newStage}`,
    };

    let nextFollowUpDate = record.nextFollowUpDate;
    if (newStage === 'Application Submitted') {
      const cadenceDays = payer?.followUpCadenceDays || 7;
      nextFollowUpDate = addBusinessDays(dates?.submissionDate || todayStr, cadenceDays > 0 ? cadenceDays : 7);
    }

    let linkingStatus = record.linkingStatus;
    if (newStage === 'Approved') {
      linkingStatus = 'Pending Approval';
    } else if (newStage === 'Linked' || newStage === 'Effective') {
      linkingStatus = 'Linked';
    }

    updateRecord(recordId, {
      stage: newStage,
      isOverdue: false,
      submissionDate: newStage === 'Application Submitted' ? (dates?.submissionDate || todayStr) : record.submissionDate,
      approvalDate: newStage === 'Approved' ? (dates?.approvalDate || todayStr) : record.approvalDate,
      effectiveDate: dates?.effectiveDate || (newStage === 'Effective' ? todayStr : record.effectiveDate),
      linkEffectiveDate: dates?.linkEffectiveDate || record.linkEffectiveDate,
      nextFollowUpDate,
      linkingStatus,
      validationOverridden: overrideReason
        ? { overriddenBy: currentUser.name, date: todayStr, reason: overrideReason }
        : record.validationOverridden,
      auditTrail: [updatedAudit, ...record.auditTrail],
    });

    return { success: true };
  };

  // Log Follow-up & Automated Escalation
  const logFollowUp = (
    recordId: string,
    followUp: Omit<FollowUpEntry, 'id' | 'specialistId' | 'specialistName'>
  ) => {
    const record = records.find((r) => r.id === recordId);
    if (!record) return;

    const newFollowUp: FollowUpEntry = {
      id: `fu-${Date.now()}`,
      ...followUp,
      specialistId: currentUser.id,
      specialistName: currentUser.name,
    };

    const isNowOverdue = isFollowUpOverdue(followUp.nextFollowUpDate);

    const auditEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Logged Follow-up',
      notes: `${followUp.method} follow-up with ${followUp.contactPerson}. Ref: ${followUp.referenceNumber || 'N/A'}. Next: ${followUp.nextFollowUpDate}`,
    };

    const updatedFollowUps = [newFollowUp, ...record.followUps];

    updateRecord(recordId, {
      followUps: updatedFollowUps,
      lastFollowUpDate: followUp.date,
      nextFollowUpDate: followUp.nextFollowUpDate,
      isOverdue: isNowOverdue,
      stage: isNowOverdue ? 'Overdue' : record.stage === 'Overdue' ? 'Payer Review' : record.stage,
      auditTrail: [auditEntry, ...record.auditTrail],
    });

    if (followUp.isEscalated) {
      const escNotif: SystemNotification = {
        id: `notif-esc-${Date.now()}`,
        type: 'ESCALATION',
        title: `Payer Issue Escalated: ${record.id}`,
        message: `Escalated by ${currentUser.name}: ${followUp.payerResponse}. Immediate manager review required.`,
        timestamp: new Date().toLocaleString(),
        recordId,
        providerId: record.providerId,
        severity: 'error',
        isRead: false,
      };
      setNotifications((prev) => [escNotif, ...prev]);
    }
  };

  // Add Document
  const addDocumentToRecord = (recordId: string, doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const record = records.find((r) => r.id === recordId);
    if (!record) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      ...doc,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    const auditEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Uploaded Document',
      notes: `Uploaded ${doc.name} (${doc.type})`,
    };

    updateRecord(recordId, {
      documents: [...record.documents, newDoc],
      auditTrail: [auditEntry, ...record.auditTrail],
    });
  };

  // Toggle Checklist
  const toggleChecklistItem = (recordId: string, itemId: string) => {
    const record = records.find((r) => r.id === recordId);
    if (!record) return;

    const updatedChecklist = record.checklist.map((item) => {
      if (item.id === itemId) {
        const nextState = !item.isCompleted;
        return {
          ...item,
          isCompleted: nextState,
          completedDate: nextState ? new Date().toISOString().split('T')[0] : undefined,
          completedBy: nextState ? currentUser.name : undefined,
        };
      }
      return item;
    });

    updateRecord(recordId, { checklist: updatedChecklist });
  };

  // Override Validation
  const overrideValidation = (recordId: string, reason: string) => {
    const record = records.find((r) => r.id === recordId);
    if (!record) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const auditEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Validation Overridden',
      notes: `Justification: ${reason}`,
    };

    updateRecord(recordId, {
      validationOverridden: {
        overriddenBy: currentUser.name,
        date: todayStr,
        reason,
      },
      auditTrail: [auditEntry, ...record.auditTrail],
    });
  };

  // Provider Linking Update
  const updateProviderLinking = (recordId: string, status: LinkingStatus, linkEffectiveDate?: string, notes?: string) => {
    const record = records.find((r) => r.id === recordId);
    if (!record) return;

    const auditEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Updated Provider Linking',
      previousValue: record.linkingStatus,
      newValue: status,
      notes: notes || `Link effective date: ${linkEffectiveDate || 'Pending'}`,
    };

    updateRecord(recordId, {
      linkingStatus: status,
      linkEffectiveDate: linkEffectiveDate || record.linkEffectiveDate,
      linkingNotes: notes || record.linkingNotes,
      stage: status === 'Linked' ? 'Linked' : record.stage,
      auditTrail: [auditEntry, ...record.auditTrail],
    });
  };

  // Provider CRUD
  const addProvider = (providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt' | 'documents'>): Provider => {
    const newProvider: Provider = {
      id: `prv-${Date.now()}`,
      ...providerData,
      documents: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProviders((prev) => [newProvider, ...prev]);

    // Send notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      type: 'MISSING_DOCS',
      title: `Provider Added: ${newProvider.firstName} ${newProvider.lastName}`,
      message: `${newProvider.providerType} (${newProvider.disciplines.join(', ')}) registered in Master Directory.`,
      timestamp: new Date().toLocaleString(),
      providerId: newProvider.id,
      severity: 'info',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newProvider;
  };

  const updateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
  };

  const deleteProvider = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  };

  // Payer CRUD
  const addPayer = (payerData: Omit<Payer, 'id'>): Payer => {
    const newPayer: Payer = {
      id: `pyr-${Date.now()}`,
      ...payerData,
    };
    setPayers((prev) => [...prev, newPayer]);
    return newPayer;
  };

  const updatePayer = (id: string, updates: Partial<Payer>) => {
    setPayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Entity & Location CRUD
  const addEntity = (entityData: Omit<LegalEntity, 'id'>): LegalEntity => {
    const newEntity: LegalEntity = {
      id: `ent-${Date.now()}`,
      ...entityData,
    };
    setEntities((prev) => [...prev, newEntity]);
    return newEntity;
  };

  const updateEntity = (id: string, updates: Partial<LegalEntity>) => {
    setEntities((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const addLocation = (locData: Omit<Location, 'id'>): Location => {
    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      ...locData,
    };
    setLocations((prev) => [...prev, newLoc]);
    return newLoc;
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Filter logic
  const getFilteredRecords = () => {
    return records.filter((rec) => {
      const provider = providers.find((p) => p.id === rec.providerId);
      const payer = payers.find((p) => p.id === rec.payerId);

      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchId = rec.id.toLowerCase().includes(q);
        const matchProvider = provider ? `${provider.firstName} ${provider.lastName} ${provider.npi}`.toLowerCase().includes(q) : false;
        const matchPayer = payer ? payer.name.toLowerCase().includes(q) : false;
        if (!matchId && !matchProvider && !matchPayer) return false;
      }

      // Discipline
      if (filters.discipline !== 'All' && rec.discipline !== filters.discipline) return false;

      // Payer
      if (filters.payerId !== 'All' && rec.payerId !== filters.payerId) return false;

      // Entity
      if (filters.entityId !== 'All' && rec.entityId !== filters.entityId) return false;

      // Location
      if (filters.locationId !== 'All' && rec.locationId !== filters.locationId) return false;

      // Stage
      if (filters.stage !== 'All' && rec.stage !== filters.stage) return false;

      // Application Type
      if (filters.applicationType !== 'All' && rec.applicationType !== filters.applicationType) return false;

      // Specialist
      if (filters.specialistId !== 'All' && rec.assignedSpecialistId !== filters.specialistId) return false;

      // Overdue
      if (filters.isOverdueOnly && !rec.isOverdue) return false;

      // Needs Action
      if (filters.needsActionOnly && !['Additional Documents Requested', 'Correction Required', 'Recredentialing Due', 'Overdue', 'Intake', 'Documents Pending'].includes(rec.stage)) return false;

      // Linking Pending Only
      if (filters.linkingPendingOnly && rec.stage !== 'Linking Pending' && rec.linkingStatus !== 'Pending Approval') return false;

      return true;
    });
  };

  // Compute overall KPI metrics
  const calculateKPIs = (): KPIStats => {
    const totalApplications = records.length;
    const submitted = records.filter((r) => !!r.submissionDate).length;
    const pending = records.filter((r) => ['Application Submitted', 'Payer Review', 'Additional Documents Requested', 'Correction Required', 'Resubmitted'].includes(r.stage)).length;
    const approved = records.filter((r) => ['Approved', 'Linking Pending', 'Linked', 'Effective'].includes(r.stage)).length;
    const requiringAction = records.filter((r) => ['Intake', 'Documents Pending', 'Additional Documents Requested', 'Correction Required', 'Recredentialing Due', 'Overdue'].includes(r.stage)).length;
    const overdueCount = records.filter((r) => r.isOverdue).length;
    const rejected = records.filter((r) => r.stage === 'Closed / Not Contracted').length;
    const linked = records.filter((r) => r.linkingStatus === 'Linked').length;
    const linkingPending = records.filter((r) => r.linkingStatus === 'Pending Approval' || r.stage === 'Linking Pending').length;

    let submittedWithin5Days = 0;
    let totalEligibleSubmissions = 0;
    let totalCycleTimeSum = 0;
    let cycleTimeCount = 0;

    const agingBuckets = {
      under30: 0,
      days31to60: 0,
      days61to90: 0,
      days91to120: 0,
      over120: 0,
    };

    records.forEach((r) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const days = calculateDaysBetween(r.intakeDate, r.approvalDate || todayStr);
      const bucket = getAgingBucket(days);
      if (bucket === '0-30') agingBuckets.under30++;
      else if (bucket === '31-60') agingBuckets.days31to60++;
      else if (bucket === '61-90') agingBuckets.days61to90++;
      else if (bucket === '91-120') agingBuckets.days91to120++;
      else agingBuckets.over120++;

      if (r.submissionDate && r.documentsReceivedDate) {
        totalEligibleSubmissions++;
        const bDays = calculateBusinessDays(r.documentsReceivedDate, r.submissionDate);
        if (bDays <= 5) submittedWithin5Days++;
      }

      if (r.approvalDate && r.submissionDate) {
        cycleTimeCount++;
        totalCycleTimeSum += calculateDaysBetween(r.submissionDate, r.approvalDate);
      }
    });

    const submissionEfficiencyRate = totalEligibleSubmissions > 0 ? Math.round((submittedWithin5Days / totalEligibleSubmissions) * 100) : 96;
    const avgCycleDays = cycleTimeCount > 0 ? Math.round(totalCycleTimeSum / cycleTimeCount) : 66;

    const activeFollowUpEligible = records.filter((r) => ['Application Submitted', 'Payer Review', 'Linking Pending'].includes(r.stage));
    const compliantCount = activeFollowUpEligible.filter((r) => !r.isOverdue).length;
    const followUpComplianceRate = activeFollowUpEligible.length > 0 ? Math.round((compliantCount / activeFollowUpEligible.length) * 100) : 92;

    return {
      totalProviders: providers.length,
      totalApplications,
      applicationsSubmitted: submitted,
      applicationsPending: pending,
      applicationsApproved: approved,
      applicationsRequiringAction: requiringAction,
      applicationsOverdue: overdueCount,
      applicationsRejected: rejected,
      providersLinked: linked,
      providersLinkingPending: linkingPending,
      averageCredentialingCycleDays: avgCycleDays,
      submissionEfficiencyRate,
      followUpComplianceRate,
      zeroExpiredSubmissionRate: 100,
      agingBuckets,
    };
  };

  const kpis = calculateKPIs();

  const resetToDefaultData = () => {
    localStorage.removeItem('cred_providers');
    localStorage.removeItem('cred_payers');
    localStorage.removeItem('cred_entities');
    localStorage.removeItem('cred_locations');
    localStorage.removeItem('cred_records');
    localStorage.removeItem('cred_notifications');
    localStorage.removeItem('cred_accounts');
    setProviders(INITIAL_PROVIDERS);
    setPayers(INITIAL_PAYERS);
    setEntities(INITIAL_LEGAL_ENTITIES);
    setLocations(INITIAL_LOCATIONS);
    setRecords(INITIAL_CREDENTIALING_RECORDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAccounts(INITIAL_ACCOUNTS);
    setCurrentAccount(INITIAL_ACCOUNTS[0]);
  };

  const importBulkData = (
    importedRecords: CredentialingRecord[], 
    importedProviders?: Provider[],
    importedPayers?: Payer[],
    importedLocations?: Location[]
  ) => {
    if (importedProviders && importedProviders.length > 0) {
      setProviders((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = importedProviders.filter((p) => !existingIds.has(p.id));
        const updated = prev.map((p) => {
          const match = importedProviders.find((ip) => ip.id === p.id || ip.npi === p.npi);
          return match ? { ...p, ...match } : p;
        });
        return [...newOnes, ...updated];
      });
    }

    if (importedPayers && importedPayers.length > 0) {
      setPayers((prev) => {
        const existingNames = new Set(prev.map((p) => p.name.toLowerCase()));
        const newOnes = importedPayers.filter((p) => !existingNames.has(p.name.toLowerCase()));
        return [...prev, ...newOnes];
      });
    }

    if (importedLocations && importedLocations.length > 0) {
      setLocations((prev) => [...prev, ...importedLocations]);
    }

    if (importedRecords && importedRecords.length > 0) {
      setRecords((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newOnes = importedRecords.filter((r) => !existingIds.has(r.id));
        const updated = prev.map((r) => {
          const match = importedRecords.find((ir) => ir.id === r.id);
          return match ? { ...r, ...match } : r;
        });
        return [...newOnes, ...updated];
      });
    }

    // Add notification about successful bulk import
    const notif: SystemNotification = {
      id: `notif-imp-${Date.now()}`,
      type: 'APPROVAL_RECEIVED',
      title: 'Spreadsheet Ingestion Complete',
      message: `Successfully imported ${importedRecords.length} records and ${importedProviders?.length || 0} providers from Excel.`,
      timestamp: new Date().toLocaleString(),
      severity: 'success',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  return (
    <CredentialingContext.Provider
      value={{
        accounts,
        currentAccount,
        isAdmin,
        login,
        logout,
        sessionTimeoutMessage,
        sessionSecondsLeft,
        resetSessionTimer,
        createAccount,
        updateAccount,
        deleteAccount,
        switchAccount,
        providers,
        payers,
        entities,
        locations,
        records,
        users,
        currentUser,
        setCurrentUser,
        switchRole,
        notifications,
        filters,
        setFilters,
        resetFilters,
        savedFilters,
        saveCurrentFilter,
        applySavedFilter,
        selectedRecordId,
        setSelectedRecordId,
        selectedProviderId,
        setSelectedProviderId,
        createRecord,
        updateRecord,
        advanceRecordStage,
        logFollowUp,
        addDocumentToRecord,
        toggleChecklistItem,
        overrideValidation,
        updateProviderLinking,
        addProvider,
        updateProvider,
        deleteProvider,
        addPayer,
        updatePayer,
        addEntity,
        updateEntity,
        addLocation,
        updateLocation,
        markNotificationRead,
        markAllNotificationsRead,
        kpis,
        getFilteredRecords,
        resetToDefaultData,
        importBulkData,
      }}
    >
      {children}
    </CredentialingContext.Provider>
  );
};

export const useCredentialing = () => {
  const context = useContext(CredentialingContext);
  if (!context) {
    throw new Error('useCredentialing must be used within a CredentialingProvider');
  }
  return context;
};

