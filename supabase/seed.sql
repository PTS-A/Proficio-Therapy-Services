-- ============================================================================
-- PROFICIO THERAPY SERVICES: SUPABASE SEED DATA (MIGRATED FROM FIREBASE)
-- Generated on: 2026-09-10T11:14:14.026Z
-- Total Records Migrated: 103
-- ============================================================================

SET session_replication_role = 'replica';

-- Entities (3)
INSERT INTO public.entities (id, legal_name, dba, ein, npi_type_2, taxonomy, ownership_details, primary_contact, email, phone, address, active)
VALUES ('ent-1', 'Ages Learning Solutions LLC', 'AGES Learning Solutions', '47-2891234', NULL, NULL, '100% Owned by AGES Healthcare Group Inc.', 'Namitha Narayanan', 'credentialing@ageslearningsolutions.com', '(408) 555-0192', '2105 S Bascom Ave, Suite 150, San Jose, CA 95124', true)
ON CONFLICT (id) DO UPDATE SET legal_name = EXCLUDED.legal_name, updated_at = NOW();

INSERT INTO public.entities (id, legal_name, dba, ein, npi_type_2, taxonomy, ownership_details, primary_contact, email, phone, address, active)
VALUES ('ent-2', 'Proficio Speech Therapy Group INC', 'Proficio Speech Therapy', '82-4198271', NULL, NULL, 'Physician & Clinician Owned Professional Corp', 'Elena Rostova', 'admin@proficiotherapy.com', '(925) 555-0144', '1220 Airway Blvd, Suite 200, Livermore, CA 94551', true)
ON CONFLICT (id) DO UPDATE SET legal_name = EXCLUDED.legal_name, updated_at = NOW();

INSERT INTO public.entities (id, legal_name, dba, ein, npi_type_2, taxonomy, ownership_details, primary_contact, email, phone, address, active)
VALUES ('ent-3', 'Child''s Play Therapy Services PC', 'Child''s Play Therapy', '94-3321876', NULL, NULL, 'Clinical Services Partnership', 'Sarah Jenkins', 'info@childsplaytherapyservices.com', '(925) 555-0188', '8440 Brentwood Blvd, Suite C, Brentwood, CA 94513', true)
ON CONFLICT (id) DO UPDATE SET legal_name = EXCLUDED.legal_name, updated_at = NOW();

-- Locations (7)
INSERT INTO public.locations (id, entity_id, name, location_type, address, city, state, zip, phone, lease_status, pave_status, active)
VALUES ('loc-1', 'ent-2', 'Livermore Clinic', 'Physical Clinic', '1220 Airway Blvd, Suite 200', 'Livermore', 'CA', '94551', '(925) 447-2000', NULL, 'Approved', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.locations (id, entity_id, name, location_type, address, city, state, zip, phone, lease_status, pave_status, active)
VALUES ('loc-2', 'ent-3', 'Brentwood Center', 'Physical Clinic', '8440 Brentwood Blvd, Suite C', 'Brentwood', 'CA', '94513', '(925) 634-1120', NULL, 'Approved', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.locations (id, entity_id, name, location_type, address, city, state, zip, phone, lease_status, pave_status, active)
VALUES ('loc-3', 'ent-1', 'San Jose Headquarters & Clinical Center', 'Physical Clinic', '2105 S Bascom Ave, Suite 150', 'San Jose', 'CA', '95124', '(408) 559-8800', NULL, 'Approved', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.locations (id, entity_id, name, location_type, address, city, state, zip, phone, lease_status, pave_status, active)
VALUES ('loc-4', 'ent-1', 'Vacaville Satellite Clinic', 'Satellite', '750 Mason St, Suite 102', 'Vacaville', 'CA', '95687', '(707) 449-3300', NULL, 'Approved', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.locations (id, entity_id, name, location_type, address, city, state, zip, phone, lease_status, pave_status, active)
VALUES ('loc-5', 'ent-1', 'South Jordan Center', 'Physical Clinic', '10984 S Jordan Gateway, Suite 400', 'South Jordan', 'UT', '84095', '(801) 876-5400', NULL, 'Not Required', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.locations (id, entity_id, name, location_type, address, city, state, zip, phone, lease_status, pave_status, active)
VALUES ('loc-inhome-bayarea', 'ent-1', 'Northern California In-Home & Community Delivery', 'In-Home / Mobile', 'Mobile & Community Service Delivery Network', 'San Jose', 'CA', '95124', '(408) 559-8850', NULL, 'Approved', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.locations (id, entity_id, name, location_type, address, city, state, zip, phone, lease_status, pave_status, active)
VALUES ('loc-inhome-eastbay', 'ent-2', 'East Bay & Tri-Valley In-Home Therapy Network', 'In-Home / Mobile', 'Mobile & In-Home Practice Coverage (Tri-Valley Region)', 'Livermore', 'CA', '94551', '(925) 447-2050', NULL, 'Approved', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

-- Payers (20)
INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-aetna', 'Aetna', 'Commercial', 'https://www.availity.com', 60, 7, 'Availity', false, true, '[{"role":"Network Manager","name":"James Martinez","email":"martinezj@aetna.com","phone":"(800) 624-0756","id":"c-1"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-alameda', 'Alameda Alliance', 'Regional / Medicaid', 'https://www.alamedaalliance.org', 90, 7, 'Online Portal', false, true, '[{"role":"Provider Enrollment Lead","email":"tgomez@alamedaalliance.org","phone":"(510) 747-4500","name":"Tanya Gomez","id":"c-7"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-anthem', 'Anthem', 'Commercial', 'https://www.availity.com', 75, 10, 'Availity', false, true, '[{"phone":"(888) 254-2721","id":"c-2","name":"Lisa Ray","role":"Credentialing Lead","email":"lisa.ray@anthem.com"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-ash', 'ASH (American Specialty Health)', 'Network', 'https://www.ashlink.com', 45, 7, 'Online Portal', false, true, '[{"role":"Credentialing Manager","phone":"(800) 972-4226","id":"c-18","name":"Brian Kelly","email":"brian.kelly@ashn.com"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-bsc', 'Blue Shield of California', 'Commercial', 'https://www.blueshieldca.com/provider', 60, 7, 'Online Portal', false, true, '[{"role":"Provider Relations Rep","email":"robert.kim@blueshieldca.com","name":"Robert Kim","id":"c-3","phone":"(800) 258-3091"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-catalight', 'Catalight (Easterseals / Behavioral Health)', 'Network', 'https://www.catalight.org/providers', 30, 5, 'Online Portal', false, true, '[{"role":"Network Relations Lead","email":"rachel.green@catalight.org","phone":"(800) 843-3725","name":"Rachel Green","id":"c-20"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-cchp', 'CCHP (Chinese Community Health Plan)', 'Regional / Medicaid', 'https://www.cchphealthplan.com', 60, 10, 'Email', false, true, '[{"phone":"(415) 834-2100","email":"wling@cchphealthplan.com","name":"Wai Ling","role":"Contracting Manager","id":"c-8"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-ccs', 'CCS (California Children''s Services)', 'State program', 'https://www.dhcs.ca.gov/services/ccs', 90, 14, 'Mail', false, true, '[{"phone":"(916) 552-9105","id":"c-17","name":"Dr. Rebecca Stern","email":"rebecca.stern@dhcs.ca.gov","role":"CCS Panel Coordinator"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-cigna', 'Cigna', 'Commercial', 'https://cignaforhcp.cigna.com', 60, 7, 'Online Portal', false, true, '[{"email":"amber.davis@cigna.com","name":"Amber Davis","phone":"(800) 882-4462","role":"Credentialing Analyst","id":"c-4"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-hill', 'Hill Physicians', 'Network', 'https://www.hillphysicians.com/providers', 60, 7, 'Online Portal', false, true, '[{"id":"c-19","phone":"(800) 445-5647","name":"Megan Foster","email":"megan.foster@hpmg.com","role":"Allied Health Network Rep"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-hpsm', 'HPSM (Health Plan of San Mateo)', 'Regional / Medicaid', 'https://www.hpsm.org', 60, 7, 'Online Portal', false, true, '[{"phone":"(650) 616-2106","id":"c-10","email":"jennifer.wong@hpsm.org","role":"Provider Network Liaison","name":"Jennifer Wong"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-molina', 'Molina', 'Medicaid / Commercial', 'https://provider.molinahealthcare.com', 90, 7, 'Online Portal', false, true, '[{"id":"c-12","phone":"(888) 562-5442","email":"patricia.ramos@molinahealthcare.com","role":"Medicaid Credentialing Rep","name":"Patricia Ramos"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-php', 'PHP (Physicians Health Plan)', 'Regional', 'https://www.phpmichigan.com', 45, 10, 'Email', false, true, '[{"email":"kbrown@php.org","name":"Kevin Brown","phone":"(800) 832-9186","id":"c-11","role":"Provider Services"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-preferred', 'Preferred Therapy', 'Network', 'https://www.preferredtherapy.com', 30, 7, 'Email', false, true, '[{"role":"Network Coordinator","name":"Amanda Hall","email":"ahall@preferredtherapy.com","phone":"(800) 664-5240","id":"c-14"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-regenceut', 'Regence Utah', 'Commercial', 'https://www.regence.com/provider', 45, 7, 'Availity', false, true, '[{"id":"c-16","phone":"(800) 253-0838","role":"Commercial Network Specialist","name":"Emily Clark","email":"emily.clark@regence.com"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-scfhp', 'SCFHP (Santa Clara Family Health Plan)', 'Regional / Medicaid', 'https://www.scfhp.com', 75, 7, 'Online Portal', false, true, '[{"id":"c-9","name":"Carlos Mendez","phone":"(408) 874-1788","email":"cmendez@scfhp.com","role":"Credentialing Coordinator"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-triwest', 'TriWest', 'Government', 'https://www.triwest.com/provider', 90, 10, 'Online Portal', false, true, '[{"role":"VA Network Specialist","phone":"(877) 226-8349","id":"c-13","email":"tmiller@triwest.com","name":"Capt. Thomas Miller"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-uhc', 'UnitedHealthcare (UHC)', 'Commercial', 'https://www.uhcprovider.com', 65, 10, 'Online Portal', false, true, '[{"role":"Network Manager","email":"m_scott@uhc.com","phone":"(877) 842-3210","name":"Michael Scott","id":"c-5"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-utmedicaid', 'Utah Medicaid', 'Medicaid', 'https://medicaid.utah.gov/provider-portal', 60, 7, 'Online Portal', false, true, '[{"id":"c-15","role":"Utah PRISM Enrollment Specialist","phone":"(801) 538-6155","name":"Bradley Young","email":"byoung@utah.gov"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)
VALUES ('pyr-vhp', 'VHP (Valley Health Plan)', 'Regional', 'https://www.valleyhealthplan.org/providers', 45, 7, 'Email', false, true, '[{"id":"c-6","phone":"(408) 885-3560","name":"Maria Santos","email":"maria.santos@vhp.sccgov.org","role":"Credentialing Specialist"}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

-- Users (10)
INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-1788700393824', 'joel.reji@ageslearningsolutions.com', 'Joel Mathew Reji', 'Joel Mathew Reji', 'USER', 'Credentialing Specialist', 'Credentialing Specialist', 'Credentialing Specialist', 'Proficio Therapy Credentialing Hub', '["Provider intake and document verification","CAQH, NPI coordination, PAVE, Medicaid enrollment","Payer applications and follow-ups","Additional documentation and application corrections","Approval and effective-date tracking","Updating credentialing records and monthly reporting","W-9 and group financial information required by payers","Manage discipline, payer, entity, and location master data"]'::jsonb, 'Active', true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-admin-clean', 'admin@example.com', 'Administrator', 'Administrator', 'ADMINISTRATOR', 'System Administrator', 'System Administrator', 'System Administrator & IT Governance', 'Executive IT & Compliance Governance', '["Manage users, roles, and permissions","Configure workflow stages, SLAs, notification templates, payer requirements","Manage integrations (email, Power BI dataset)","View system-wide stored user passwords (Super Admin Exclusive)"]'::jsonb, 'Active', true, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-admin-leadership', 'leadership@proficiotherapy.com', 'Katherine Holmes', 'Katherine Holmes', 'ADMINISTRATOR', 'Leadership / Management', 'Leadership / Management', 'Director of Strategic Contracting & Growth', 'Executive Leadership & Strategy', '["Strategic decisions, contracting decisions, and rate negotiations","Payer network expansion and entity / location approvals","Resource allocation","Reviewing credentialing KPIs and escalations"]'::jsonb, 'Active', true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-admin-namitha', 'manager@proficiotherapy.com', 'Namitha Narayanan', 'Namitha Narayanan', 'ADMINISTRATOR', 'Credentialing Lead / Manager', 'Credentialing Lead / Manager', 'Credentialing Operations Manager', 'Centralized Credentialing Hub', '["Work allocation and quality control","Escalations and payer issue resolution","KPI monitoring, process improvement, and team training","Management reporting and audit oversight"]'::jsonb, 'Active', true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-superadmin-corp', 'superadmin@proficiotherapy.com', 'Super Administrator', 'Super Administrator', 'ADMINISTRATOR', 'System Administrator', 'System Administrator', 'Chief Information & Security Officer', 'Information Security & Administration', '["Manage users, roles, and permissions","Configure workflow stages, SLAs, notification templates, payer requirements","Manage integrations (email, Power BI dataset)","View system-wide stored user passwords (Super Admin Exclusive)"]'::jsonb, 'Active', true, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-user-billing', 'billing@proficiotherapy.com', 'David Patel', 'David Patel', 'USER', 'Billing and Claims', 'Billing and Claims', 'Revenue Cycle & Claims Linkage Analyst', 'Revenue Cycle & Billing Operations', '["Payer contract financial coordination","Coordinate with credentialling team regarding denials."]'::jsonb, 'Active', true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-user-clinical', 'clinical@proficiotherapy.com', 'Sarah Jenkins, MS, OTR/L', 'Sarah Jenkins, MS, OTR/L', 'USER', 'Clinical Team', 'Clinical Team', 'Clinical Quality & Peer Review Supervisor', 'Clinical Supervision & Quality', '["Clinical documentation and verification support","License, board certification, and reference support"]'::jsonb, 'Active', true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-user-hr', 'hroperations@proficiotherapy.com', 'Marcus Vance', 'Marcus Vance', 'USER', 'HR/Operations', 'HR/Operations', 'People & Clinical Staffing Operations Lead', 'Human Resources & Staffing Operations', '["Provider onboarding information (start date, location, group assignment)","Coordination with credentialing on new-hire timelines"]'::jsonb, 'Active', true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-user-provider', 'provider@proficiotherapy.com', 'Dr. Rachel Green, MS, CCC-SLP', 'Dr. Rachel Green, MS, CCC-SLP', 'USER', 'Provider', 'Provider', 'Licensed Speech-Language Pathologist (Rendering Clinician)', 'Clinical Therapy Services', '["Providing accurate information and completing required forms","Maintaining CAQH profile","Providing licenses / certifications / requested documents","Responding to credentialing requests"]'::jsonb, 'Active', true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, permissions, status, is_active, is_super_admin)
VALUES ('acc-user-sanjay', 'specialist@proficiotherapy.com', 'Sanjay Tom', 'Sanjay Tom', 'USER', 'Credentialing Specialist', 'Credentialing Specialist', 'Senior Credentialing Specialist', 'Proficio Therapy Credentialing Hub', '["Provider intake and document verification","CAQH, NPI coordination, PAVE, Medicaid enrollment","Payer applications and follow-ups","Additional documentation and application corrections","Approval and effective-date tracking","Updating credentialing records and monthly reporting"]'::jsonb, 'Active', true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();

-- Stage Configs (18)
INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-01', 'Intake', 'Pre-Submission', 1, 1, 'slate', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-02', 'Documents Pending', 'Pre-Submission', 3, 2, 'blue', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-03', 'Documents Complete', 'Pre-Submission', 1, 3, 'teal', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-04', 'CAQH Pending', 'Pre-Submission', 2, 4, 'indigo', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-05', 'PAVE Pending', 'Pre-Submission', 3, 5, 'purple', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-06', 'Application Preparation', 'Pre-Submission', 2, 6, 'amber', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-07', 'Application Submitted', 'In-Review', 14, 7, 'sky', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-08', 'Payer Review', 'In-Review', 60, 8, 'sky', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-09', 'Additional Documents Requested', 'In-Review', 2, 9, 'amber', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-10', 'Correction Required', 'In-Review', 2, 10, 'amber', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-11', 'Resubmitted', 'In-Review', 1, 11, 'indigo', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-12', 'Approved', 'Approval & Linking', 1, 12, 'emerald', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-13', 'Linking Pending', 'Approval & Linking', 5, 13, 'purple', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-14', 'Linked', 'Approval & Linking', 2, 14, 'teal', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-15', 'Effective', 'Completed / Closed', 14, 15, 'emerald', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-16', 'Closed / Not Contracted', 'Completed / Closed', 14, 16, 'slate', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-17', 'Recredentialing Due', 'Maintenance / Alert', 30, 17, 'pink', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.stage_configs (id, name, category, sla_turnaround_target_days, display_order, badge_color, is_active)
VALUES ('stg-18', 'Overdue', 'Maintenance / Alert', 14, 18, 'rose', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- System Config (3)
INSERT INTO public.system_config (id, config_data)
VALUES ('holidays', '{"id":"holidays","items":[{"type":"Federal","name":"New Year''s Day","date":"2026-01-01","affectsSla":true,"id":"HOL-1"},{"id":"HOL-2","type":"Federal","name":"Martin Luther King Jr. Day","date":"2026-01-19","affectsSla":true},{"id":"HOL-3","affectsSla":true,"type":"Federal","name":"Presidents'' Day","date":"2026-02-16"},{"id":"HOL-4","affectsSla":true,"type":"Federal","name":"Memorial Day","date":"2026-05-25"},{"name":"Juneteenth National Independence Day","date":"2026-06-19","type":"Federal","affectsSla":true,"id":"HOL-5"},{"id":"HOL-6","affectsSla":true,"name":"Independence Day","date":"2026-07-04","type":"Federal"},{"type":"Federal","affectsSla":true,"name":"Labor Day","date":"2026-09-07","id":"HOL-7"},{"id":"HOL-8","type":"Federal","affectsSla":true,"date":"2026-11-26","name":"Thanksgiving Day"},{"date":"2026-11-27","name":"Day After Thanksgiving","type":"Corporate","affectsSla":true,"id":"HOL-9"},{"affectsSla":true,"type":"Federal","id":"HOL-10","name":"Christmas Day","date":"2026-12-25"}]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET config_data = EXCLUDED.config_data, updated_at = NOW();

INSERT INTO public.system_config (id, config_data)
VALUES ('settings', '{"id":"settings","slaFollowUpMaxDays":10,"autoReminderPayerAging":true,"enableDailySummaryEmail":false,"autoEscalateOverdueFollowup":true,"slaFollowUpMinDays":7,"caqhReattestationDays":120,"nppesAutoValidation":true,"slaSubmissionDays":5,"licenseExpAdvanceAlertDays":60}'::jsonb)
ON CONFLICT (id) DO UPDATE SET config_data = EXCLUDED.config_data, updated_at = NOW();

INSERT INTO public.system_config (id, config_data)
VALUES ('templates', '{"id":"templates","items":[{"isActive":true,"recipientRoles":["Credentialing Specialist","Provider (Clinician)","Human Resources (HR)"],"name":"License 60-Day Advance Warning","bodyTemplate":"Dear {provider_name},\n\nYour {license_type} license ({license_number}) under state {license_state} is scheduled to expire on {expiration_date}. To prevent clinical credentialing suspension or payer billing hold, please submit renewal documentation immediately to the credentialing team.\n\nThank you,\nAges / Proficio Credentialing Department","id":"TMPL-01","subject":"URGENT: Credentialing License Renewal Notice - {provider_name}","triggerEvent":"Clinician license expires in ≤ 60 calendar days"},{"triggerEvent":"Application pending payer determination ≥ 60 days or follow-up overdue","isActive":true,"name":"Overdue Follow-up & Aging Escalation","id":"TMPL-02","recipientRoles":["Credentialing Manager","Leadership / Executive","Credentialing Specialist"],"bodyTemplate":"Attention Credentialing Leadership,\n\nApplication {application_id} for {provider_name} with {payer_name} has exceeded SLA benchmarks ({days_in_process} days elapsed). Last logged contact with payer representative was on {last_follow_up_date}.\n\nPlease review escalation notes and initiate supervisor outreach.","subject":"ACTION REQUIRED: Escalated Credentialing Application Aging ({payer_name}) - {provider_name}"},{"name":"Payer Approval & Effective Date Broadcast","subject":"CREDENTIALING APPROVED: {provider_name} is now in-network with {payer_name}","isActive":true,"recipientRoles":["Billing and Claims","HR / Operations","Credentialing Specialist","Provider (Clinician)"],"bodyTemplate":"Great news! {provider_name} has been formally approved and linked under {entity_name} for {payer_name}.\n\nEffective Date: {effective_date}\nProvider Rendering NPI: {npi}\nBilling Hold: RELEASED (Ready to bill claims)","id":"TMPL-03","triggerEvent":"Payer status updated to Approved with Effective Date"}]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET config_data = EXCLUDED.config_data, updated_at = NOW();

-- ============================================================================
-- SKELETON-ONLY PERSISTENCE GUARANTEE (ZERO FAKE DATA)
-- Operational tables left empty for production usage.
-- ============================================================================

TRUNCATE TABLE public.credentialing_records CASCADE;
TRUNCATE TABLE public.clinical_staff CASCADE;
TRUNCATE TABLE public.providers CASCADE;
TRUNCATE TABLE public.employees CASCADE;
TRUNCATE TABLE public.system_notifications CASCADE;

SET session_replication_role = 'origin';
