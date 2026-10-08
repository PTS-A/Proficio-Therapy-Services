import { AppAccount, SystemRole } from '../types';

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
  | 'nemotron-edit'
  | 'dbms-manager'
  | 'developer';

/**
 * Checks if the account is a Developer profile.
 * Developer profile has full administrator accesses plus developer-exclusive tool suites.
 */
export const isDeveloper = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
  if (account.canAccessDev === true) return true;
  if (account.canAccessDev === false) return false;
  if (account.systemRole === 'Developer') return true;
  if (account.roleTitle?.toLowerCase().includes('dev') || account.email?.toLowerCase().includes('dev@')) return true;
  return false;
};

/**
 * Checks if the account is a Super Admin.
 * Super Admin has full governance over role allocations, user management, and system settings.
 */
export const isSuperAdmin = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
  if (isDeveloper(account)) return true;
  if (account.isSuperAdmin === true) return true;
  if (account.systemRole === 'System Administrator') return true;
  if (
    account.accessLevel === 'ADMINISTRATOR' && 
    (account.permissions?.some(p => p.toLowerCase().includes('super admin')) ||
     account.roleTitle?.includes('Governance') ||
     account.roleTitle?.includes('Security Officer'))
  ) {
    return true;
  }
  return false;
};

/**
 * Checks if the account has administrator privileges.
 */
export const isAdminAccount = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
  if (account.canAccessAdmin === true) return true;
  if (account.canAccessAdmin === false && !isSuperAdmin(account)) return false;
  if (isDeveloper(account)) return true;
  if (isSuperAdmin(account)) return true;
  if (account.accessLevel === 'ADMINISTRATOR') return true;
  if (account.systemRole === 'System Administrator') return true;
  return false;
};

/**
 * Verifies if an account has permission to edit clinical & credentialing data.
 * Respects canEditData (View-Only vs Can Edit) configured during onboarding.
 */
export const canUserEdit = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
  if (isSuperAdmin(account) || isDeveloper(account)) return true;
  if (typeof account.canEditData === 'boolean') {
    return account.canEditData;
  }
  return (
    account.accessLevel === 'ADMINISTRATOR' ||
    account.systemRole === 'Credentialing Lead / Manager' ||
    account.systemRole === 'Credentialing Specialist' ||
    account.systemRole === 'HR/Operations'
  );
};

export const canAccessDbmsManager = (account: AppAccount | null | undefined): boolean => {
  return isAdminAccount(account) || isDeveloper(account);
};

export const canAccessNemotronEdit = (account: AppAccount | null | undefined): boolean => {
  return isAdminAccount(account) || isDeveloper(account);
};

/**
 * Password Security Governance (HIPAA §164.308(a)(5)(ii)(D) & ISO/IEC 27001:2022 A.8.5):
 * User passwords must never be stored in reversible format or viewable by any user (including Super Admins).
 * Zero-knowledge credential hashing is enforced system-wide.
 */
export const canViewPasswords = (_account: AppAccount | null | undefined): boolean => {
  return false;
};

/**
 * Check if the user is authorized to manage user accounts & RBAC provisioning.
 */
export const canManageUsers = (account: AppAccount | null | undefined): boolean => {
  return isSuperAdmin(account);
};

/**
 * Check if the user is authorized to configure system SLAs & workflow settings.
 */
export const canEditSystemSettings = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
  return isSuperAdmin(account);
};

/**
 * Check if the user is authorized to perform bulk spreadsheet ingestion.
 */
export const canPerformBulkImport = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
  return isSuperAdmin(account) || account.systemRole === 'Credentialing Lead / Manager';
};

/**
 * Check if the user can approve/verify applications.
 */
export const canApproveApplications = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
  return isSuperAdmin(account) || account.systemRole === 'Credentialing Lead / Manager';
};

/**
 * Checks if an account has permission to view clinical staff data for a specific entity.
 * Supports granular entity-to-entity access controls configured during onboarding.
 */
export const canViewEntity = (account: AppAccount | null | undefined, entityId: string): boolean => {
  if (!account) return false;
  if (isSuperAdmin(account) || isDeveloper(account)) return true;
  if (!account.assignedEntities || account.assignedEntities.length === 0) return true;
  const norm = (id: string) => (id === 'ent-2' ? 'ent-pstg-inc' : id);
  return account.assignedEntities.some((id) => norm(id) === norm(entityId));
};

/**
 * Checks if an account has permission to view a specific clinician provider.
 * Enforces entity-entity visibility constraints.
 */
export const canViewProvider = (account: AppAccount | null | undefined, provider: { primaryEntityId?: string; entityIds?: string[] }): boolean => {
  if (!account) return false;
  if (isSuperAdmin(account) || isDeveloper(account)) return true;
  if (!account.assignedEntities || account.assignedEntities.length === 0) return true;
  const norm = (id?: string) => (id === 'ent-2' ? 'ent-pstg-inc' : id || '');
  const userEntities = new Set(account.assignedEntities.map(norm));
  if (provider.primaryEntityId && userEntities.has(norm(provider.primaryEntityId))) return true;
  if (provider.entityIds?.some((id) => userEntities.has(norm(id)))) return true;
  return false;
};

/**
 * Returns the exact list of allowed navigation tabs for a given system role.
 * Ensures strict constraints so accounts cannot view or navigate to unassigned sections.
 */
export const getAllowedTabs = (account: AppAccount | null | undefined): ActiveTabType[] => {
  if (!account) return [];
  const role: SystemRole = account.systemRole || 'Credentialing Specialist';

  // If explicit granular allowedTabs are configured, strictly honor them
  if (Array.isArray(account.allowedTabs) && account.allowedTabs.length > 0 && !isSuperAdmin(account)) {
    const customTabs = [...account.allowedTabs] as ActiveTabType[];
    if (account.canAccessAdmin && !customTabs.includes('admin-dashboard')) {
      customTabs.push('admin-dashboard');
    }
    if (account.canAccessDev) {
      if (!customTabs.includes('dbms-manager')) customTabs.push('dbms-manager');
      if (!customTabs.includes('nemotron-edit')) customTabs.push('nemotron-edit');
    }
    return customTabs;
  }

  // Developer Profile: Access to engineering tools and Developer Center + Admin Dashboard & Credentialing operations
  if (role === 'Developer' || isDeveloper(account)) {
    return [
      'developer',
      'dashboard',
      'tracker',
      'providers',
      'locations',
      'payers',
      'entities',
      'reports',
      'document-intake',
      'clinical-portal',
      'aesas',
      'comments-roster',
      'tickets',
      'nemotron-edit',
      'dbms-manager',
      'admin-dashboard',
      'users',
      'new-user',
      'settings',
      'automations',
      'access-requests',
      'security-center',
      'staff-approvals',
    ];
  }

  // Super Admin / System Administrator: Full administrative and clinical governance (no dev items)
  if (isSuperAdmin(account) || isAdminAccount(account)) {
    return [
      'dashboard',
      'tracker',
      'providers',
      'locations',
      'payers',
      'entities',
      'reports',
      'document-intake',
      'new-user',
      'users',
      'import',
      'settings',
      'automations',
      'access-requests',
      'security-center',
      'google-authenticator',
      'admin-dashboard',
      'clinical-portal',
      'staff-approvals',
      'aesas',
      'comments-roster',
    ];
  }

  switch (role) {
    case 'Credentialing Lead / Manager':
      return [
        'dashboard',
        'tracker',
        'providers',
        'locations',
        'payers',
        'entities',
        'reports',
        'automations',
        'admin-dashboard',
        'staff-approvals',
        'clinical-portal',
        'aesas',
        'comments-roster'
      ];

    case 'Credentialing Specialist':
      return [
        'dashboard',
        'tracker',
        'providers',
        'locations',
        'payers',
        'staff-approvals',
        'clinical-portal',
        'aesas',
        'comments-roster'
      ];

    case 'Billing and Claims':
      return [
        'dashboard',
        'tracker',
        'payers',
        'reports',
        'clinical-portal',
        'comments-roster'
      ];

    case 'HR/Operations':
      return [
        'dashboard',
        'providers',
        'locations',
        'entities',
        'tracker',
        'clinical-portal',
        'comments-roster'
      ];

    case 'Clinical Team':
      return [
        'dashboard',
        'providers',
        'tracker',
        'reports',
        'clinical-portal',
        'comments-roster'
      ];

    case 'Leadership / Management':
      return [
        'dashboard',
        'reports',
        'tracker',
        'payers',
        'clinical-portal',
        'aesas',
        'comments-roster'
      ];

    case 'Provider':
      return [
        'dashboard',
        'providers',
        'tracker',
        'clinical-portal'
      ];

    default:
      return ['dashboard', 'tracker', 'providers', 'clinical-portal', 'comments-roster'];
  }
};

/**
 * Verifies if an account has permission to view a specific tab.
 */
export const canAccessTab = (account: AppAccount | null | undefined, tab: ActiveTabType): boolean => {
  if (!account) return false;

  // 1. Dev Tools Access Control (Dev Tab only, not accessible by anyone other than dev)
  if (tab === 'developer' || tab === 'dbms-manager' || tab === 'nemotron-edit' || tab === 'tickets') {
    if (account.canAccessDev === true) return true;
    if (account.canAccessDev === false) return false;
    return isDeveloper(account) || isSuperAdmin(account);
  }

  // 2. Admin Dashboard Access Control (canAccessAdmin tick box)
  if (tab === 'admin-dashboard') {
    if (account.canAccessAdmin === true) return true;
    if (account.canAccessAdmin === false && !isSuperAdmin(account) && !isDeveloper(account)) return false;
    return isSuperAdmin(account) || isAdminAccount(account) || isDeveloper(account) || account.systemRole === 'Credentialing Lead / Manager';
  }

  // 3. Super Admin & Governance Tabs
  if (tab === 'access-requests' || tab === 'security-center' || tab === 'google-authenticator' || tab === 'users' || tab === 'new-user' || tab === 'settings' || tab === 'automations') {
    if (account.canAccessAdmin === false && !isSuperAdmin(account) && !isDeveloper(account)) return false;
    return isSuperAdmin(account) || isAdminAccount(account) || isDeveloper(account);
  }

  // 4. Granular Page Permissions (what pages they can view tick boxes)
  if (Array.isArray(account.allowedTabs) && account.allowedTabs.length > 0 && !isDeveloper(account) && !isSuperAdmin(account)) {
    if (account.allowedTabs.includes(tab)) return true;
    if ((tab as string) === 'users' && account.allowedTabs.includes('new-user')) return true;
    if ((tab as string) === 'new-user' && account.allowedTabs.includes('users')) return true;
    return false;
  }

  // 5. Default Role-Based Access Mapping
  if (tab === 'document-intake') {
    return isAdminAccount(account) || isDeveloper(account);
  }
  if (tab === 'staff-approvals') {
    return isSuperAdmin(account) || isAdminAccount(account) || account.systemRole === 'Credentialing Lead / Manager' || account.systemRole === 'Credentialing Specialist';
  }
  if (tab === 'aesas') {
    const isHeadOrLead = (account.roleTitle && /head|lead|director|manager/i.test(account.roleTitle)) ||
      account.systemRole === 'Credentialing Lead / Manager' ||
      account.systemRole === 'Leadership / Management';
    return isSuperAdmin(account) || isAdminAccount(account) || Boolean(isHeadOrLead);
  }
  if (tab === 'comments-roster') {
    return true;
  }
  if (tab === 'clinical-portal') {
    return true;
  }
  const allowed = getAllowedTabs(account);
  // Map synonyms like 'users' -> 'new-user'
  if ((tab as string) === 'users' && allowed.includes('new-user')) return true;
  if ((tab as string) === 'new-user' && allowed.includes('users')) return true;
  return allowed.includes(tab);
};
