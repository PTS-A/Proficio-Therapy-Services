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
  | 'users' 
  | 'new-user' 
  | 'import' 
  | 'settings';

/**
 * Checks if the account is a Super Admin.
 * Super Admin has full governance and is the ONLY user who can view stored user passwords.
 */
export const isSuperAdmin = (account: AppAccount | null | undefined): boolean => {
  if (!account) return false;
  if (account.isSuperAdmin === true) return true;
  if (account.systemRole === 'System Administrator') return true;
  const cleanEmail = account.email?.toLowerCase().trim();
  return cleanEmail === 'admin@example.com' || cleanEmail === 'superadmin@proficiotherapy.com';
};

/**
 * Super Admin ONLY: view cleartext or revealed user passwords.
 * Under strict security governance, no other system role or email may view passwords.
 */
export const canViewPasswords = (account: AppAccount | null | undefined): boolean => {
  return isSuperAdmin(account);
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
  if (isSuperAdmin(account)) {
    return [
      'dashboard',
      'tracker',
      'linking',
      'providers',
      'locations',
      'payers',
      'entities',
      'reports',
      'new-user',
      'users',
      'import',
      'settings'
    ];
  }

  const role: SystemRole = account.systemRole || 'Credentialing Specialist';

  switch (role) {
    case 'Credentialing Lead / Manager':
      return [
        'dashboard',
        'tracker',
        'linking',
        'providers',
        'locations',
        'payers',
        'entities',
        'reports'
      ];

    case 'Credentialing Specialist':
      return [
        'dashboard',
        'tracker',
        'linking',
        'providers',
        'locations',
        'payers'
      ];

    case 'Billing and Claims':
      return [
        'dashboard',
        'linking',
        'tracker',
        'payers',
        'reports'
      ];

    case 'HR/Operations':
      return [
        'dashboard',
        'providers',
        'locations',
        'entities',
        'tracker'
      ];

    case 'Clinical Team':
      return [
        'dashboard',
        'providers',
        'tracker',
        'reports'
      ];

    case 'Leadership / Management':
      return [
        'dashboard',
        'reports',
        'tracker',
        'linking',
        'payers'
      ];

    case 'Provider':
      return [
        'dashboard',
        'providers',
        'tracker'
      ];

    default:
      return ['dashboard', 'tracker', 'providers'];
  }
};

/**
 * Verifies if an account has permission to view a specific tab.
 */
export const canAccessTab = (account: AppAccount | null | undefined, tab: ActiveTabType): boolean => {
  if (!account) return false;
  const allowed = getAllowedTabs(account);
  // Map synonyms like 'users' -> 'new-user'
  if (tab === 'users' && allowed.includes('new-user')) return true;
  if (tab === 'new-user' && allowed.includes('users')) return true;
  return allowed.includes(tab);
};
