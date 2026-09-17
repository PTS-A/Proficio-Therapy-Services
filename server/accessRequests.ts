import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface ServerAccessRequest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  requestedRole?: string;
  entityId?: string;
  locationId?: string;
  justification?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  denialReason?: string;
  assignedAccessLevel?: 'ADMINISTRATOR' | 'USER';
  assignedSystemRole?: string;
  assignedRoleTitle?: string;
  assignedDepartment?: string;
  assignedEntityId?: string;
  assignedLocationId?: string;
  assignedDisciplines?: string[];
}

export interface BasicOnboardingDetails {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  department: string;
  systemRole: string;
  roleTitle?: string;
  accessLevel: 'ADMINISTRATOR' | 'USER';
  entityId: string;
  locationId: string;
  assignedDisciplines: string[];
  permissions?: string[];
  password?: string;
  reviewedBy?: string;
}

let inMemoryRequests: ServerAccessRequest[] = [];

function getSupabaseClient(): SupabaseClient | null {
  const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://uqaiotacheqjvfbanxtp.supabase.co';
  const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!cleanUrl || !key) return null;
  return createClient(cleanUrl, key);
}

export async function fetchAllAccessRequests(): Promise<ServerAccessRequest[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('system_config')
        .select('config_data')
        .eq('id', 'access_requests')
        .maybeSingle();

      if (!error && data && data.config_data && Array.isArray(data.config_data.requests)) {
        inMemoryRequests = data.config_data.requests;
        return inMemoryRequests;
      }
    } catch (err) {
      console.warn('[AccessRequests] Supabase fetch error, using in-memory cache:', err);
    }
  }
  return inMemoryRequests;
}

async function persistAccessRequests(requests: ServerAccessRequest[]): Promise<void> {
  inMemoryRequests = requests;
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb
        .from('system_config')
        .upsert({
          id: 'access_requests',
          config_data: { requests },
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      console.error('[AccessRequests] Supabase persist error:', err);
    }
  }
}

export async function submitNewAccessRequest(data: {
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  requestedRole?: string;
  entityId?: string;
  locationId?: string;
  justification?: string;
}): Promise<ServerAccessRequest> {
  const cleanEmail = (data.email || '').trim().toLowerCase();
  const cleanName = (data.fullName || '').trim();

  if (!cleanEmail || !cleanName) {
    throw new Error('Full Name and Email Address are required.');
  }

  const currentList = await fetchAllAccessRequests();

  // Check if an active pending request already exists for this email
  const existingPending = currentList.find(
    (r) => r.email.toLowerCase() === cleanEmail && r.status === 'PENDING'
  );

  if (existingPending) {
    // Update existing pending request with latest details
    existingPending.fullName = cleanName;
    existingPending.phone = data.phone?.trim() || existingPending.phone;
    existingPending.department = data.department || existingPending.department;
    existingPending.requestedRole = data.requestedRole || existingPending.requestedRole;
    existingPending.entityId = data.entityId || existingPending.entityId;
    existingPending.locationId = data.locationId || existingPending.locationId;
    existingPending.justification = data.justification || existingPending.justification;
    existingPending.createdAt = new Date().toISOString();

    await persistAccessRequests(currentList);
    return existingPending;
  }

  const newRequest: ServerAccessRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    fullName: cleanName,
    email: cleanEmail,
    phone: data.phone?.trim(),
    department: data.department || 'Credentialing & Operations',
    requestedRole: data.requestedRole || 'Credentialing Specialist',
    entityId: data.entityId || 'ent-1',
    locationId: data.locationId || 'loc-1',
    justification: data.justification || 'New employee requesting Credentialing Portal access.',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  currentList.unshift(newRequest);
  await persistAccessRequests(currentList);
  return newRequest;
}

export async function approveAndOnboardAccessRequest(
  requestId: string,
  details: BasicOnboardingDetails
): Promise<{ request: ServerAccessRequest; employeeId: string; userId: string }> {
  const list = await fetchAllAccessRequests();
  const index = list.findIndex((r) => r.id === requestId);

  if (index === -1) {
    throw new Error(`Access request with ID "${requestId}" not found.`);
  }

  const cleanEmail = details.email.trim().toLowerCase();
  const cleanName = details.fullName.trim();
  const names = cleanName.split(' ');
  const firstName = details.firstName || names[0] || 'Employee';
  const lastName = details.lastName || (names.length > 1 ? names.slice(1).join(' ') : 'Staff');

  const empId = `emp-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`;
  const userId = `acc-${Date.now()}`;

  const sb = getSupabaseClient();
  if (sb) {
    // 1. Provision / Upsert into employees table for Employee Access Control gate
    const { error: empError } = await sb.from('employees').upsert({
      id: empId,
      first_name: firstName,
      last_name: lastName,
      full_name: cleanName,
      email: cleanEmail,
      phone: details.phone || null,
      department: details.department || 'Credentialing & Operations',
      role_title: details.roleTitle || details.systemRole || 'Credentialing Specialist',
      employment_status: 'Active',
      entity_id: details.entityId || 'ent-1',
      office_location_id: details.locationId || 'loc-1',
      is_demo: false,
      raw_profile: {
        accessLevel: details.accessLevel || 'USER',
        systemRole: details.systemRole || 'Credentialing Specialist',
        assignedDisciplines: details.assignedDisciplines || ['ABA', 'Speech', 'OT'],
        assignedEntities: [details.entityId || 'ent-1'],
        assignedLocations: [details.locationId || 'loc-1'],
      },
      updated_at: new Date().toISOString(),
    });

    if (empError) {
      console.error('[AccessRequests] Failed to upsert employee record:', empError);
    }

    // 2. Provision / Upsert into users table
    const isSuperAdminUser = details.systemRole === 'System Administrator';
    const { error: userError } = await sb.from('users').upsert({
      id: userId,
      email: cleanEmail,
      name: cleanName,
      full_name: cleanName,
      access_level: details.accessLevel || 'USER',
      system_role: details.systemRole,
      role: details.systemRole,
      role_title: details.roleTitle || details.systemRole,
      department: details.department,
      assigned_disciplines: details.assignedDisciplines || ['ABA', 'Speech', 'OT'],
      assigned_entities: [details.entityId || 'ent-1'],
      permissions: details.permissions || [
        'Provider intake and document verification',
        'CAQH, NPI coordination, PAVE, Medicaid enrollment',
        'Payer applications and follow-ups',
        'Approval and effective-date tracking',
        'Updating credentialing records and monthly reporting',
      ],
      status: 'Active',
      is_active: true,
      is_super_admin: isSuperAdminUser,
      must_change_password: true,
      has_changed_password: false,
      updated_at: new Date().toISOString(),
    });

    if (userError) {
      console.error('[AccessRequests] Failed to upsert user record:', userError);
    }

    // 3. Insert immutable audit trail entry in Supabase audit_logs
    try {
      await sb.from('audit_logs').insert({
        actor_email: details.reviewedBy || 'Super Administrator',
        action: 'APPROVE',
        table_name: 'users',
        record_id: userId,
        new_values: {
          email: cleanEmail,
          fullName: cleanName,
          systemRole: details.systemRole,
          accessLevel: details.accessLevel,
          department: details.department,
          employeeId: empId,
          approvedAt: new Date().toISOString(),
        },
      });
    } catch (auditErr) {
      console.warn('[AccessRequests] Audit log notice:', auditErr);
    }

    // 4. Insert notification into Supabase system_notifications
    try {
      await sb.from('system_notifications').insert({
        type: 'ACCESS_REQUEST_APPROVED',
        title: `Access Request Approved: ${cleanName}`,
        message: `${cleanName} (${cleanEmail}) was approved and onboarded as ${details.systemRole} by ${details.reviewedBy || 'Super Administrator'}.`,
        severity: 'info',
        recipient_email: cleanEmail,
        is_read: false,
      });
    } catch (notifErr) {
      console.warn('[AccessRequests] Notification notice:', notifErr);
    }
  }

  // Update Access Request
  list[index].status = 'APPROVED';
  list[index].reviewedAt = new Date().toISOString();
  list[index].reviewedBy = details.reviewedBy || 'Super Administrator';
  list[index].assignedAccessLevel = details.accessLevel;
  list[index].assignedSystemRole = details.systemRole;
  list[index].assignedRoleTitle = details.roleTitle || details.systemRole;
  list[index].assignedDepartment = details.department;
  list[index].assignedEntityId = details.entityId;
  list[index].assignedLocationId = details.locationId;
  list[index].assignedDisciplines = details.assignedDisciplines;

  await persistAccessRequests(list);

  return {
    request: list[index],
    employeeId: empId,
    userId,
  };
}

export async function denyAccessRequest(
  requestId: string,
  denialReason: string = 'Access denied by Super Administrator.',
  reviewedBy: string = 'Super Administrator'
): Promise<ServerAccessRequest> {
  const list = await fetchAllAccessRequests();
  const index = list.findIndex((r) => r.id === requestId);

  if (index === -1) {
    throw new Error(`Access request with ID "${requestId}" not found.`);
  }

  list[index].status = 'DENIED';
  list[index].denialReason = denialReason;
  list[index].reviewedAt = new Date().toISOString();
  list[index].reviewedBy = reviewedBy;

  await persistAccessRequests(list);
  return list[index];
}
