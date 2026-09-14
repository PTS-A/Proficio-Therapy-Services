-- ============================================================================
-- PROFICIO THERAPY SERVICES: CLEAN SKELETON PURGE SCRIPT FOR SUPABASE
-- Run this in your Supabase SQL Editor to wipe all fake data and leave only
-- the empty application skeleton (entities, locations, payers, stage configs, users).
-- ============================================================================

BEGIN;

-- Temporarily disable FK constraints during purge
SET session_replication_role = 'replica';

-- 1. PURGE ALL FAKE AND OPERATIONAL DATA
TRUNCATE TABLE public.credentialing_records CASCADE;
TRUNCATE TABLE public.applications CASCADE;
TRUNCATE TABLE public.application_follow_ups CASCADE;
TRUNCATE TABLE public.application_documents CASCADE;
TRUNCATE TABLE public.application_comments CASCADE;
TRUNCATE TABLE public.clinical_staff CASCADE;
TRUNCATE TABLE public.providers CASCADE;
TRUNCATE TABLE public.employees CASCADE;
TRUNCATE TABLE public.system_notifications CASCADE;

-- Re-enable constraints
SET session_replication_role = 'origin';

COMMIT;

-- Verification queries (all should return 0 rows):
SELECT 'credentialing_records' AS table_name, COUNT(*) AS remaining_rows FROM public.credentialing_records
UNION ALL
SELECT 'providers', COUNT(*) FROM public.providers
UNION ALL
SELECT 'clinical_staff', COUNT(*) FROM public.clinical_staff
UNION ALL
SELECT 'employees', COUNT(*) FROM public.employees
UNION ALL
SELECT 'system_notifications', COUNT(*) FROM public.system_notifications;

-- Skeleton verification (these master tables will retain the structural skeleton):
SELECT 'entities' AS skeleton_table, COUNT(*) AS skeleton_rows FROM public.entities
UNION ALL
SELECT 'locations', COUNT(*) FROM public.locations
UNION ALL
SELECT 'payers', COUNT(*) FROM public.payers
UNION ALL
SELECT 'stage_configs', COUNT(*) FROM public.stage_configs
UNION ALL
SELECT 'users', COUNT(*) FROM public.users;
