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
  | 'comments-roster';

/**
 * Checks if the account is a Super Admin.
 * Super Admin has full governance over role allocations, user management, and system settings.
 */
export const isSuperAdmin = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
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
  if (isSuperAdmin(account)) return true;
  if (account.accessLevel === 'ADMINISTRATOR') return true;
  if (account.systemRole === 'System Administrator') return true;
  return false;
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
 * Returns the exact list of allowed navigation tabs for a given system role.
 * Ensures strict constraints so accounts cannot view or navigate to unassigned sections.
 */
export const getAllowedTabs = (account: AppAccount | null | undefined): ActiveTabType[] => {
  if (!account) return [];

  // Super Admin / System Administrator has complete access
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
      'comments-roster'
    ];
  }

  const role: SystemRole = account.systemRole || 'Credentialing Specialist';

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
        'document-intake',
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
        'document-intake',
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
        'document-intake',
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
        'document-intake',
        'clinical-portal',
        'comments-roster'
      ];

    case 'Clinical Team':
      return [
        'dashboard',
        'providers',
        'tracker',
        'reports',
        'document-intake',
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
  if (tab === 'access-requests' || tab === 'security-center' || tab === 'google-authenticator') {
    return isSuperAdmin(account) || isAdminAccount(account);
  }
  if (tab === 'admin-dashboard') {
    return isSuperAdmin(account) || isAdminAccount(account) || account.systemRole === 'Credentialing Lead / Manager';
  }
  if (tab === 'staff-approvals') {
    return isSuperAdmin(account) || isAdminAccount(account) || account.systemRole === 'Credentialing Lead / Manager' || account.systemRole === 'Credentialing Specialist';
  }
  if (tab === 'aesas') {
    // Accessible and editable by all credentialing employees like head and lead and System administrator only
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
  if (tab === 'users' && allowed.includes('new-user')) return true;
  if (tab === 'new-user' && allowed.includes('users')) return true;
  return allowed.includes(tab);
};
