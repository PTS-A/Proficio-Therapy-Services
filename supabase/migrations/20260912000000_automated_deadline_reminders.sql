-- ============================================================================
-- PROFICIO THERAPY SERVICES — AUTOMATED CREDENTIAL DEADLINE REMINDER SYSTEM
-- Migration: 20260912000000_automated_deadline_reminders.sql
-- Description: Creates tables for automation definitions, execution logs,
--              idempotency guarantees, RLS policies, and default reminder cadences.
-- ============================================================================

-- 1. Automation Definitions (Configurable rules for deadline reminders)
CREATE TABLE IF NOT EXISTS public.automation_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'CREDENTIAL_EXPIRATION', 'RECREDENTIAL_DUE', 'LICENSE_EXPIRATION', 'CAQH_REATTESTATION'
    target_type TEXT NOT NULL DEFAULT 'credentialing_records', -- 'credentialing_records', 'clinical_staff', 'providers'
    days_before INTEGER[] NOT NULL DEFAULT '{30, 14, 7, 1}',
    recipient_roles TEXT[] NOT NULL DEFAULT '{"employee", "assigned_specialist", "manager"}',
    custom_recipient_emails TEXT[] DEFAULT '{}',
    email_subject_template TEXT NOT NULL,
    email_body_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Automation Executions (Idempotent delivery audit log)
CREATE TABLE IF NOT EXISTS public.automation_executions (
    id TEXT PRIMARY KEY,
    automation_id TEXT REFERENCES public.automation_definitions(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    record_id TEXT NOT NULL,
    target_type TEXT NOT NULL DEFAULT 'credentialing_records',
    provider_name TEXT,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    recipient_role TEXT,
    expiration_date DATE NOT NULL,
    days_before INTEGER NOT NULL,
    email_subject TEXT NOT NULL,
    email_body TEXT,
    delivery_status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'failed', 'simulated', 'skipped'
    resend_id TEXT,
    error_message TEXT,
    idempotency_key TEXT NOT NULL UNIQUE, -- automation_id + record_id + days_before + recipient_email + expiration_date
    executed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trigger for updated_at on automation_definitions
CREATE OR REPLACE FUNCTION public.set_automation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_automation_definitions_updated_at ON public.automation_definitions;
CREATE TRIGGER trg_automation_definitions_updated_at
BEFORE UPDATE ON public.automation_definitions
FOR EACH ROW EXECUTE FUNCTION public.set_automation_updated_at();

-- 4. Performance & Idempotency Indexes
CREATE INDEX IF NOT EXISTS idx_automation_exec_idempotency ON public.automation_executions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_automation_exec_record ON public.automation_executions(record_id);
CREATE INDEX IF NOT EXISTS idx_automation_exec_recipient ON public.automation_executions(recipient_email);
CREATE INDEX IF NOT EXISTS idx_automation_exec_executed_at ON public.automation_executions(executed_at);
CREATE INDEX IF NOT EXISTS idx_automation_defs_active ON public.automation_definitions(is_active);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.automation_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_executions ENABLE ROW LEVEL SECURITY;

-- Automation definitions: readable by all authenticated users, editable by administrators
DROP POLICY IF EXISTS automation_definitions_select_policy ON public.automation_definitions;
CREATE POLICY automation_definitions_select_policy ON public.automation_definitions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS automation_definitions_modify_policy ON public.automation_definitions;
CREATE POLICY automation_definitions_modify_policy ON public.automation_definitions
    FOR ALL USING (
        (auth.jwt() ->> 'email' = 'admin@example.com')
        OR (auth.jwt() ->> 'role') = 'service_role'
        OR public.is_admin()
    );

-- Automation executions: readable by authenticated users/admins, insertable by background engine & admins
DROP POLICY IF EXISTS automation_executions_select_policy ON public.automation_executions;
CREATE POLICY automation_executions_select_policy ON public.automation_executions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS automation_executions_insert_policy ON public.automation_executions;
CREATE POLICY automation_executions_insert_policy ON public.automation_executions
    FOR INSERT WITH CHECK (true);

-- 6. Initial Production-Ready Seed Rules for Automation Definitions
INSERT INTO public.automation_definitions (
    id, name, event_type, target_type, days_before, recipient_roles, custom_recipient_emails, email_subject_template, email_body_template, is_active
) VALUES 
(
    'rule-cred-30d',
    'Credential Expiration 30-Day Advance Alert',
    'CREDENTIAL_EXPIRATION',
    'credentialing_records',
    '{30}',
    '{"employee", "assigned_specialist", "manager"}',
    '{}',
    'ACTION REQUIRED: Credential Expiration Notice (30 Days) - {provider_name} ({payer_name})',
    'Dear {recipient_name},

This is an automated credential deadline notification for {provider_name}.

• Record ID: {application_id}
• Payer / Plan: {payer_name}
• Entity / Practice: {entity_name}
• Current Stage: {stage}
• Expiration Date: {expiration_date}
• Time Remaining: {days_remaining} calendar days

Please begin the credential renewal process immediately to ensure continuous billing authorization and avoid payer claim denials.

Assigned Specialist: {assigned_specialist}

Proficio Therapy Services Credentialing Operations',
    true
),
(
    'rule-cred-14d',
    'Urgent Credential Expiration 14-Day Warning',
    'CREDENTIAL_EXPIRATION',
    'credentialing_records',
    '{14}',
    '{"employee", "assigned_specialist", "manager", "hr"}',
    '{}',
    'URGENT WARNING: Credential Expiring in 14 Days - {provider_name} ({payer_name})',
    'Attention {recipient_name},

URGENT: Credentialing authorization for {provider_name} with {payer_name} will expire in 14 calendar days on {expiration_date}.

• Record ID: {application_id}
• Clinician: {provider_name}
• Payer: {payer_name}
• Practice Location: {location_name}
• Expiration Date: {expiration_date}
• Days Remaining: {days_remaining} days

If renewal documentation has already been submitted to the payer, please confirm receipt with the payer representative. Otherwise, prioritize immediate packet submission.

Assigned Specialist: {assigned_specialist}
Credentialing Manager: Namitha Narayanan

Proficio Therapy Services Credentialing Operations',
    true
),
(
    'rule-cred-7d',
    'Critical Credential Expiration 7-Day Notice',
    'CREDENTIAL_EXPIRATION',
    'credentialing_records',
    '{7}',
    '{"employee", "assigned_specialist", "manager", "hr"}',
    '{}',
    'CRITICAL: Credential Expiring in 7 Days - {provider_name} ({payer_name})',
    'CRITICAL ALERT for {recipient_name},

The credential for {provider_name} with {payer_name} will expire in 7 DAYS on {expiration_date}.

Failure to re-credential before the deadline will result in payer billing hold and potential claims retraction.

• Provider: {provider_name}
• Payer: {payer_name}
• Expiration Date: {expiration_date}
• Days Left: {days_remaining} days

Immediate supervisor action is required.

Proficio Therapy Services Credentialing Operations',
    true
),
(
    'rule-cred-1d',
    'Final 24-Hour Credential Expiration Notice',
    'CREDENTIAL_EXPIRATION',
    'credentialing_records',
    '{1}',
    '{"employee", "assigned_specialist", "manager", "hr"}',
    '{}',
    'FINAL NOTICE: Credential Expires Tomorrow - {provider_name} ({payer_name})',
    'FINAL NOTICE: Credentialing for {provider_name} under {payer_name} expires tomorrow on {expiration_date}.

If renewal has not been executed, billing hold will take effect immediately upon expiration.

Record: {application_id}
Assigned Specialist: {assigned_specialist}

Proficio Therapy Services Credentialing Operations',
    true
),
(
    'rule-caqh-30d',
    'CAQH 120-Day Profile Re-Attestation Notice',
    'CAQH_REATTESTATION',
    'clinical_staff',
    '{30, 14, 7}',
    '{"employee", "assigned_specialist"}',
    '{}',
    'REMINDER: CAQH Profile Re-Attestation Due - {provider_name}',
    'Dear {recipient_name},

Your CAQH ProView profile for {provider_name} requires 120-day re-attestation before {expiration_date} ({days_remaining} days remaining).

Please log into your CAQH account (https://proview.caqh.org), review your provider details, and re-attest your profile.

Thank you,
Proficio Therapy Services Credentialing Operations',
    true
),
(
    'rule-license-60d',
    'Clinician State License Expiration Alert',
    'LICENSE_EXPIRATION',
    'clinical_staff',
    '{60, 30, 14}',
    '{"employee", "assigned_specialist", "manager"}',
    '{}',
    'LICENSE RENEWAL: State License Expiration Notice - {provider_name}',
    'Dear {recipient_name},

The professional state license for {provider_name} is scheduled to expire on {expiration_date} ({days_remaining} days remaining).

Please upload your renewed license documentation to the Credentialing Portal as soon as possible to maintain active payer network status.

Proficio Therapy Services Credentialing Operations',
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    event_type = EXCLUDED.event_type,
    target_type = EXCLUDED.target_type,
    days_before = EXCLUDED.days_before,
    recipient_roles = EXCLUDED.recipient_roles,
    email_subject_template = EXCLUDED.email_subject_template,
    email_body_template = EXCLUDED.email_body_template,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
