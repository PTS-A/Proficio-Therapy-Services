import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface ServerStaffChangeRequest {
  id: string;
  providerId: string;
  employeeEmail: string;
  employeeName: string;
  entityId: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  changes: {
    phone?: string;
    contactAddress?: string;
    npi?: string;
    caqhId?: string;
    taxonomyCode?: string;
    primaryLicenseNumber?: string;
    primaryLicenseExpiry?: string;
    utahLicenseNumber?: string;
    utahLicenseExpiry?: string;
    documentLinks?: Array<{ title: string; url: string; category?: string }>;
    notes?: string;
  };
  previousValues: Record<string, any>;
}

export interface ServerClinicalStaffComment {
  id: string;
  entityId: string;
  providerId?: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

let inMemoryChangeRequests: ServerStaffChangeRequest[] = [];
let inMemoryComments: ServerClinicalStaffComment[] = [
  {
    id: 'comm-init-1',
    entityId: 'ent-1',
    authorId: 'acc-admin-namitha',
    authorName: 'Namitha Narayanan',
    authorRole: 'Credentialing Lead / Manager',
    authorEmail: 'manager@proficiotherapy.com',
    content: 'AGES Learning Solutions Q3 credentialing review cycle started. Ensuring all BCBAs have updated CAQH attestations and current BACB certificates on file.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'comm-init-2',
    entityId: 'ent-2',
    authorId: 'acc-user-sanjay',
    authorName: 'Sanjay Tom',
    authorRole: 'Credentialing Specialist',
    authorEmail: 'specialist@proficiotherapy.com',
    content: 'Proficio Therapy Services: Aetna & Blue Shield CA linking packages submitted for SLPs and OT team members. Tracking 45-day turnaround.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'comm-init-3',
    entityId: 'ent-3',
    authorId: 'acc-admin-namitha',
    authorName: 'Namitha Narayanan',
    authorRole: 'Credentialing Lead / Manager',
    authorEmail: 'manager@proficiotherapy.com',
    content: "Child's Play Therapy Services: New Brentwood facility insurance roster synchronized. Followed up on Kaiser and CCHP credentialing status.",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

function getSupabaseClient(): SupabaseClient | null {
  const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://uqaiotacheqjvfbanxtp.supabase.co';
  const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!cleanUrl || !key) return null;
  return createClient(cleanUrl, key);
}

export async function fetchAllChangeRequests(): Promise<ServerStaffChangeRequest[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('system_config')
        .select('config_data')
        .eq('id', 'staff_change_requests')
        .maybeSingle();

      if (!error && data?.config_data?.requests && Array.isArray(data.config_data.requests)) {
        inMemoryChangeRequests = data.config_data.requests;
        return inMemoryChangeRequests;
      }
    } catch (err) {
      console.warn('[ClinicalStaff] Supabase fetch change requests error, using in-memory cache:', err);
    }
  }
  return inMemoryChangeRequests;
}

export async function persistChangeRequests(requests: ServerStaffChangeRequest[]): Promise<void> {
  inMemoryChangeRequests = requests;
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('system_config').upsert({
        id: 'staff_change_requests',
        config_data: { requests },
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[ClinicalStaff] Supabase persist change requests error:', err);
    }
  }
}

export async function fetchAllComments(): Promise<ServerClinicalStaffComment[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('system_config')
        .select('config_data')
        .eq('id', 'clinical_staff_comments')
        .maybeSingle();

      if (!error && data?.config_data?.comments && Array.isArray(data.config_data.comments)) {
        inMemoryComments = data.config_data.comments;
        return inMemoryComments;
      }
    } catch (err) {
      console.warn('[ClinicalStaff] Supabase fetch comments error, using in-memory cache:', err);
    }
  }
  return inMemoryComments;
}

export async function persistComments(comments: ServerClinicalStaffComment[]): Promise<void> {
  inMemoryComments = comments;
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('system_config').upsert({
        id: 'clinical_staff_comments',
        config_data: { comments },
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[ClinicalStaff] Supabase persist comments error:', err);
    }
  }
}
