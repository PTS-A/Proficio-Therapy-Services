-- ============================================================================
-- PROFICIO THERAPY SERVICES — SUPABASE POSTGRESQL SCHEMA MIGRATION
-- Migration: 20260910000000_initial_schema.sql
-- Description: Core relational schema, RLS policies, audit logging, and indexes.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENTITIES / ORGANIZATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.entities (
    id TEXT PRIMARY KEY,
    legal_name TEXT NOT NULL,
    dba TEXT,
    ein TEXT,
    npi_type_2 TEXT,
    taxonomy TEXT,
    ownership_details TEXT,
    w9_on_file BOOLEAN DEFAULT true,
    general_liability_policy TEXT,
    workers_comp_policy TEXT,
    primary_contact TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. LOCATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locations (
    id TEXT PRIMARY KEY,
    entity_id TEXT REFERENCES public.entities(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    location_type TEXT DEFAULT 'CLINIC',
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    phone TEXT,
    service_types TEXT[] DEFAULT '{}',
    payer_applicability TEXT[] DEFAULT '{}',
    lease_status TEXT,
    pave_status TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. PAYERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    portal_url TEXT,
    states_served TEXT[] DEFAULT '{}',
    contacts JSONB DEFAULT '[]'::jsonb,
    required_documents TEXT[] DEFAULT '{}',
    average_tat_days INTEGER DEFAULT 60,
    follow_up_cadence_days INTEGER DEFAULT 14,
    submission_method TEXT DEFAULT 'PORTAL',
    requires_pave BOOLEAN DEFAULT false,
    requires_caqh BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. APPLICATION USERS / PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    auth_user_id UUID, -- References auth.users(id) when Supabase Auth user is created
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    full_name TEXT,
    access_level TEXT NOT NULL DEFAULT 'USER', -- 'ADMINISTRATOR' or 'USER'
    system_role TEXT NOT NULL DEFAULT 'CREDENTIALING_SPECIALIST',
    role TEXT,
    role_title TEXT,
    department TEXT,
    avatar_url TEXT,
    assigned_disciplines TEXT[] DEFAULT '{}',
    assigned_entities TEXT[] DEFAULT '{}',
    permissions JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'SUSPENDED'
    is_active BOOLEAN DEFAULT true,
    must_change_password BOOLEAN DEFAULT false,
    has_changed_password BOOLEAN DEFAULT true,
    is_super_admin BOOLEAN DEFAULT false,
    password_hash TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure backwards-compatibility if table already existed in earlier session
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ----------------------------------------------------------------------------
-- 5. EMPLOYEES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    department TEXT,
    role_title TEXT,
    employment_status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'ONBOARDING', 'SUSPENDED', 'TERMINATED'
    start_date DATE,
    office_location_id TEXT REFERENCES public.locations(id) ON DELETE SET NULL,
    entity_id TEXT REFERENCES public.entities(id) ON DELETE SET NULL,
    is_demo BOOLEAN DEFAULT false,
    owner_email TEXT, -- e.g. 'admin@example.com' for demo records
    raw_profile JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. PROVIDERS (CLINICIANS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.providers (
    id TEXT PRIMARY KEY,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    npi TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    credentials TEXT,
    disciplines TEXT[] DEFAULT '{}',
    provider_type TEXT,
    email TEXT,
    phone TEXT,
    license_number TEXT,
    license_state TEXT,
    license_expiration DATE,
    entity_ids TEXT[] DEFAULT '{}',
    location_ids TEXT[] DEFAULT '{}',
    caqh_id TEXT,
    caqh_status TEXT,
    caqh_reattestation_date DATE,
    pave_status TEXT,
    pave_enrollment_id TEXT,
    contract_info JSONB DEFAULT '{}'::jsonb,
    payer_enrollments JSONB DEFAULT '[]'::jsonb,
    is_demo BOOLEAN DEFAULT false,
    owner_email TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. CLINICAL STAFF (CREDENTIALING / ONBOARDING VIEW OF EMPLOYEES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clinical_staff (
    id TEXT PRIMARY KEY,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
    provider_id TEXT REFERENCES public.providers(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    credentials TEXT,
    disciplines TEXT[] DEFAULT '{}',
    provider_type TEXT,
    license_number TEXT,
    license_state TEXT,
    license_expiration DATE,
    npi TEXT,
    caqh_id TEXT,
    pave_status TEXT,
    status TEXT DEFAULT 'ACTIVE',
    is_demo BOOLEAN DEFAULT false,
    owner_email TEXT,
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. STAGE CONFIGURATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stage_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    sla_turnaround_target_days INTEGER DEFAULT 14,
    display_order INTEGER DEFAULT 1,
    badge_color TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. CREDENTIALING RECORDS / APPLICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.credentialing_records (
    id TEXT PRIMARY KEY,
    provider_id TEXT REFERENCES public.providers(id) ON DELETE CASCADE,
    payer_id TEXT REFERENCES public.payers(id) ON DELETE RESTRICT,
    entity_id TEXT REFERENCES public.entities(id) ON DELETE SET NULL,
    location_id TEXT REFERENCES public.locations(id) ON DELETE SET NULL,
    clinical_staff_id TEXT REFERENCES public.clinical_staff(id) ON DELETE SET NULL,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    assigned_specialist_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    application_type TEXT DEFAULT 'INITIAL', -- 'INITIAL', 'RECREDENTIALING', 'ROSTER_UPDATE'
    discipline TEXT,
    stage TEXT NOT NULL DEFAULT 'Intake',
    status TEXT NOT NULL DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'APPROVED', 'DENIED', 'WITHDRAWN', 'EXPIRED'
    intake_date DATE DEFAULT CURRENT_DATE,
    submission_date DATE,
    approval_date DATE,
    effective_date DATE,
    expiration_date DATE,
    recredential_due_date DATE,
    is_overdue BOOLEAN DEFAULT false,
    cycle_days INTEGER DEFAULT 0,
    linking_status TEXT DEFAULT 'PENDING',
    contract_status TEXT DEFAULT 'NOT_APPLICABLE',
    is_demo BOOLEAN DEFAULT false,
    owner_email TEXT,
    raw_record JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alias table / view for applications
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY REFERENCES public.credentialing_records(id) ON DELETE CASCADE,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. APPLICATION FOLLOW-UPS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.application_follow_ups (
    id TEXT PRIMARY KEY,
    record_id TEXT NOT NULL REFERENCES public.credentialing_records(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    next_follow_up_date DATE,
    method TEXT DEFAULT 'PHONE',
    contact_person TEXT,
    reference_number TEXT,
    payer_response TEXT,
    next_action TEXT,
    is_escalated BOOLEAN DEFAULT false,
    specialist_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. APPLICATION DOCUMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.application_documents (
    id TEXT PRIMARY KEY,
    record_id TEXT REFERENCES public.credentialing_records(id) ON DELETE CASCADE,
    provider_id TEXT REFERENCES public.providers(id) ON DELETE CASCADE,
    clinical_staff_id TEXT REFERENCES public.clinical_staff(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT,
    document_url TEXT,
    storage_path TEXT,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    verification_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    expiration_date DATE,
    is_demo BOOLEAN DEFAULT false,
    owner_email TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. APPLICATION COMMENTS / COLLABORATION NOTES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.application_comments (
    id TEXT PRIMARY KEY,
    record_id TEXT REFERENCES public.credentialing_records(id) ON DELETE CASCADE,
    provider_id TEXT REFERENCES public.providers(id) ON DELETE CASCADE,
    author_id TEXT,
    author_name TEXT NOT NULL,
    author_role TEXT,
    comment_text TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true,
    is_demo BOOLEAN DEFAULT false,
    owner_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 13. SYSTEM NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_notifications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT DEFAULT 'INFO', -- 'INFO', 'WARNING', 'ERROR', 'SUCCESS'
    record_id TEXT REFERENCES public.credentialing_records(id) ON DELETE CASCADE,
    provider_id TEXT REFERENCES public.providers(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    recipient_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 14. SYSTEM CONFIGURATION, HOLIDAYS & TEMPLATES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_config (
    id TEXT PRIMARY KEY, -- 'settings', 'holidays', 'templates'
    config_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 15. AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT,
    actor_email TEXT,
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'SUSPEND', etc.
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protect audit logs from modification or deletion
CREATE OR REPLACE FUNCTION protect_audit_logs()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit log entries cannot be modified or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_audit_logs ON public.audit_logs;
CREATE TRIGGER trg_protect_audit_logs
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION protect_audit_logs();

-- ----------------------------------------------------------------------------
-- 16. AUTOMATIC UPDATED_AT TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_entities_updated_at ON public.entities;
CREATE TRIGGER trg_entities_updated_at BEFORE UPDATE ON public.entities FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_locations_updated_at ON public.locations;
CREATE TRIGGER trg_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_payers_updated_at ON public.payers;
CREATE TRIGGER trg_payers_updated_at BEFORE UPDATE ON public.payers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_employees_updated_at ON public.employees;
CREATE TRIGGER trg_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_providers_updated_at ON public.providers;
CREATE TRIGGER trg_providers_updated_at BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_clinical_staff_updated_at ON public.clinical_staff;
CREATE TRIGGER trg_clinical_staff_updated_at BEFORE UPDATE ON public.clinical_staff FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_credentialing_records_updated_at ON public.credentialing_records;
CREATE TRIGGER trg_credentialing_records_updated_at BEFORE UPDATE ON public.credentialing_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_application_documents_updated_at ON public.application_documents;
CREATE TRIGGER trg_application_documents_updated_at BEFORE UPDATE ON public.application_documents FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 17. PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_employees_entity ON public.employees(entity_id);
CREATE INDEX IF NOT EXISTS idx_employees_location ON public.employees(office_location_id);
CREATE INDEX IF NOT EXISTS idx_employees_demo ON public.employees(is_demo, owner_email);

CREATE INDEX IF NOT EXISTS idx_providers_npi ON public.providers(npi);
CREATE INDEX IF NOT EXISTS idx_providers_demo ON public.providers(is_demo, owner_email);

CREATE INDEX IF NOT EXISTS idx_clinical_staff_employee ON public.clinical_staff(employee_id);
CREATE INDEX IF NOT EXISTS idx_clinical_staff_provider ON public.clinical_staff(provider_id);
CREATE INDEX IF NOT EXISTS idx_clinical_staff_demo ON public.clinical_staff(is_demo, owner_email);

CREATE INDEX IF NOT EXISTS idx_records_provider ON public.credentialing_records(provider_id);
CREATE INDEX IF NOT EXISTS idx_records_payer ON public.credentialing_records(payer_id);
CREATE INDEX IF NOT EXISTS idx_records_stage ON public.credentialing_records(stage);
CREATE INDEX IF NOT EXISTS idx_records_demo ON public.credentialing_records(is_demo, owner_email);

CREATE INDEX IF NOT EXISTS idx_documents_record ON public.application_documents(record_id);
CREATE INDEX IF NOT EXISTS idx_documents_provider ON public.application_documents(provider_id);

CREATE INDEX IF NOT EXISTS idx_comments_record ON public.application_comments(record_id);
CREATE INDEX IF NOT EXISTS idx_comments_provider ON public.application_comments(provider_id);

CREATE INDEX IF NOT EXISTS idx_audit_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_logs(created_at);

-- ----------------------------------------------------------------------------
-- 18. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentialing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper to check if current caller is super admin or admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'email' = 'admin@example.com'
        OR (auth.jwt() ->> 'role') = 'service_role'
        OR (auth.jwt() -> 'app_metadata' ->> 'is_super_admin')::boolean IS TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public/Reference data policies: accessible to all authenticated users
DROP POLICY IF EXISTS entities_policy ON public.entities;
CREATE POLICY entities_policy ON public.entities FOR ALL USING (true);

DROP POLICY IF EXISTS locations_policy ON public.locations;
CREATE POLICY locations_policy ON public.locations FOR ALL USING (true);

DROP POLICY IF EXISTS payers_policy ON public.payers;
CREATE POLICY payers_policy ON public.payers FOR ALL USING (true);

DROP POLICY IF EXISTS stage_configs_policy ON public.stage_configs;
CREATE POLICY stage_configs_policy ON public.stage_configs FOR ALL USING (true);

DROP POLICY IF EXISTS system_config_policy ON public.system_config;
CREATE POLICY system_config_policy ON public.system_config FOR ALL USING (true);

DROP POLICY IF EXISTS users_policy ON public.users;
CREATE POLICY users_policy ON public.users FOR ALL USING (true);

-- Employees Demo Isolation Policy:
-- Normal employees are visible to all users. Demo employees are strictly restricted to admin@example.com
DROP POLICY IF EXISTS employees_select_policy ON public.employees;
CREATE POLICY employees_select_policy ON public.employees
    FOR SELECT USING (
        is_demo IS FALSE
        OR (auth.jwt() ->> 'email' = 'admin@example.com')
        OR public.is_admin()
    );

DROP POLICY IF EXISTS employees_modify_policy ON public.employees;
CREATE POLICY employees_modify_policy ON public.employees
    FOR ALL USING (
        is_demo IS FALSE
        OR (auth.jwt() ->> 'email' = 'admin@example.com')
        OR public.is_admin()
    );

-- Providers Demo Isolation Policy
DROP POLICY IF EXISTS providers_policy ON public.providers;
CREATE POLICY providers_policy ON public.providers
    FOR ALL USING (
        is_demo IS FALSE
        OR (auth.jwt() ->> 'email' = 'admin@example.com')
        OR public.is_admin()
    );

-- Clinical Staff Demo Isolation Policy
DROP POLICY IF EXISTS clinical_staff_policy ON public.clinical_staff;
CREATE POLICY clinical_staff_policy ON public.clinical_staff
    FOR ALL USING (
        is_demo IS FALSE
        OR (auth.jwt() ->> 'email' = 'admin@example.com')
        OR public.is_admin()
    );

-- Credentialing Records Demo Isolation Policy
DROP POLICY IF EXISTS records_policy ON public.credentialing_records;
CREATE POLICY records_policy ON public.credentialing_records
    FOR ALL USING (
        is_demo IS FALSE
        OR (auth.jwt() ->> 'email' = 'admin@example.com')
        OR public.is_admin()
    );

DROP POLICY IF EXISTS applications_policy ON public.applications;
CREATE POLICY applications_policy ON public.applications
    FOR ALL USING (true);

DROP POLICY IF EXISTS follow_ups_policy ON public.application_follow_ups;
CREATE POLICY follow_ups_policy ON public.application_follow_ups
    FOR ALL USING (true);

DROP POLICY IF EXISTS documents_policy ON public.application_documents;
CREATE POLICY documents_policy ON public.application_documents
    FOR ALL USING (
        is_demo IS FALSE
        OR (auth.jwt() ->> 'email' = 'admin@example.com')
        OR public.is_admin()
    );

DROP POLICY IF EXISTS comments_policy ON public.application_comments;
CREATE POLICY comments_policy ON public.application_comments
    FOR ALL USING (
        is_demo IS FALSE
        OR (auth.jwt() ->> 'email' = 'admin@example.com')
        OR public.is_admin()
    );

DROP POLICY IF EXISTS notifications_policy ON public.system_notifications;
CREATE POLICY notifications_policy ON public.system_notifications
    FOR ALL USING (true);

-- Audit log: anyone authenticated can insert audit logs, only admins can view
DROP POLICY IF EXISTS audit_insert_policy ON public.audit_logs;
CREATE POLICY audit_insert_policy ON public.audit_logs
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS audit_select_policy ON public.audit_logs;
CREATE POLICY audit_select_policy ON public.audit_logs
    FOR SELECT USING (public.is_admin());
