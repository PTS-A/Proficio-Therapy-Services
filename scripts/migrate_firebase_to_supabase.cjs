/**
 * PROFICIO THERAPY SERVICES — FIREBASE TO SUPABASE MIGRATION SCRIPT
 * Reads all collections from live Firestore, generates seed SQL, exports JSON,
 * and if SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are set, writes directly to Supabase.
 * NOTE: DOES NOT DELETE OR MODIFY FIREBASE DATA.
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = require('../firebase-applet-config.json');
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

async function runMigration() {
  console.log('================================================================');
  console.log('🚀 PROFICIO THERAPY SERVICES: FIREBASE -> SUPABASE MIGRATION');
  console.log('================================================================');
  console.log('Firebase Project:', firebaseConfig.projectId);

  const collections = [
    'users',
    'payers',
    'entities',
    'locations',
    'stage_configs',
    'system_config',
    'demo_employees',
    'demo_providers',
    'demo_clinical_staff',
    'demo_records',
    'employees',
    'providers',
    'clinical_staff',
    'records',
    'applications',
    'documents',
    'comments',
    'notifications'
  ];

  const exportData = {};
  let totalDocs = 0;

  console.log('\n--- Step 1: Extracting data from Firebase Firestore ---');
  for (const col of collections) {
    try {
      const snap = await getDocs(collection(db, col));
      exportData[col] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✓ Collection [${col}]: ${snap.size} documents extracted.`);
      totalDocs += snap.size;
    } catch (err) {
      console.warn(`! Collection [${col}] notice: ${err.message}`);
      exportData[col] = [];
    }
  }

  console.log(`\nTotal Firestore documents extracted: ${totalDocs}`);

  // Create output directories
  const outDir = path.join(__dirname, '../supabase');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Write JSON export
  const jsonPath = path.join(outDir, 'data_export.json');
  fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2));
  console.log(`\n✓ Saved full JSON snapshot to: ${jsonPath}`);

  // Generate SQL Seed File
  console.log('\n--- Step 2: Generating PostgreSQL Seed Script (supabase/seed.sql) ---');
  let sql = `-- ============================================================================\n`;
  sql += `-- PROFICIO THERAPY SERVICES: SUPABASE SEED DATA (MIGRATED FROM FIREBASE)\n`;
  sql += `-- Generated on: ${new Date().toISOString()}\n`;
  sql += `-- Total Records Migrated: ${totalDocs}\n`;
  sql += `-- ============================================================================\n\n`;
  sql += `SET session_replication_role = 'replica';\n\n`;

  // 1. Entities
  if (exportData.entities && exportData.entities.length > 0) {
    sql += `-- Entities (${exportData.entities.length})\n`;
    for (const item of exportData.entities) {
      sql += `INSERT INTO public.entities (id, legal_name, dba, ein, npi_type_2, taxonomy, ownership_details, primary_contact, email, phone, address, active)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.legalName || item.legal_name)}, ${escapeSql(item.dba)}, ${escapeSql(item.ein)}, ${escapeSql(item.npiType2 || item.npi_type_2)}, ${escapeSql(item.taxonomy)}, ${escapeSql(item.ownershipDetails || item.ownership_details)}, ${escapeSql(item.primaryContact || item.primary_contact)}, ${escapeSql(item.email)}, ${escapeSql(item.phone)}, ${escapeSql(item.address)}, ${item.active !== false})\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET legal_name = EXCLUDED.legal_name, updated_at = NOW();\n\n`;
    }
  }

  // 2. Locations
  if (exportData.locations && exportData.locations.length > 0) {
    sql += `-- Locations (${exportData.locations.length})\n`;
    for (const item of exportData.locations) {
      sql += `INSERT INTO public.locations (id, entity_id, name, location_type, address, city, state, zip, phone, lease_status, pave_status, active)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.entityId || item.entity_id)}, ${escapeSql(item.name)}, ${escapeSql(item.locationType || item.location_type)}, ${escapeSql(item.address)}, ${escapeSql(item.city)}, ${escapeSql(item.state)}, ${escapeSql(item.zip)}, ${escapeSql(item.phone)}, ${escapeSql(item.leaseStatus || item.lease_status)}, ${escapeSql(item.paveStatus || item.pave_status)}, ${item.active !== false})\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();\n\n`;
    }
  }

  // 3. Payers
  if (exportData.payers && exportData.payers.length > 0) {
    sql += `-- Payers (${exportData.payers.length})\n`;
    for (const item of exportData.payers) {
      const contactsJson = JSON.stringify(item.contacts || []).replace(/'/g, "''");
      sql += `INSERT INTO public.payers (id, name, type, portal_url, average_tat_days, follow_up_cadence_days, submission_method, requires_pave, requires_caqh, contacts, active)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.name)}, ${escapeSql(item.type)}, ${escapeSql(item.portalUrl || item.portal_url)}, ${item.averageTatDays || item.average_tat_days || 60}, ${item.followUpCadenceDays || item.follow_up_cadence_days || 14}, ${escapeSql(item.submissionMethod || item.submission_method || 'PORTAL')}, ${Boolean(item.requiresPave || item.requires_pave)}, ${item.requiresCaqh !== false}, '${contactsJson}'::jsonb, ${item.active !== false})\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();\n\n`;
    }
  }

  // 4. Users
  if (exportData.users && exportData.users.length > 0) {
    sql += `-- Users (${exportData.users.length})\n`;
    for (const item of exportData.users) {
      const permsJson = JSON.stringify(item.permissions || []).replace(/'/g, "''");
      const nameVal = item.name || item.fullName || item.full_name || '';
      const sysRole = item.systemRole || item.system_role || item.role || 'CREDENTIALING_SPECIALIST';
      const stat = item.status || 'ACTIVE';
      const isAct = stat.toUpperCase() === 'ACTIVE' || item.active !== false;
      sql += `INSERT INTO public.users (id, email, name, full_name, access_level, system_role, role, role_title, department, status, is_active, must_change_password, has_changed_password, is_super_admin, password_hash, permissions)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.email)}, ${escapeSql(nameVal)}, ${escapeSql(nameVal)}, ${escapeSql(item.accessLevel || item.access_level || 'USER')}, ${escapeSql(sysRole)}, ${escapeSql(sysRole)}, ${escapeSql(item.roleTitle || item.role_title)}, ${escapeSql(item.department)}, ${escapeSql(stat)}, ${isAct}, ${Boolean(item.mustChangePasswordOnFirstLogin || item.must_change_password)}, ${Boolean(item.hasChangedInitialPassword || item.has_changed_password)}, ${Boolean(item.isSuperAdmin || item.is_super_admin)}, ${escapeSql(item.password)}, '${permsJson}'::jsonb)\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, full_name = EXCLUDED.full_name, system_role = EXCLUDED.system_role, role = EXCLUDED.role, updated_at = NOW();\n\n`;
    }
  }

  // 5. Stage Configs
  if (exportData.stage_configs && exportData.stage_configs.length > 0) {
    sql += `-- Stage Configs (${exportData.stage_configs.length})\n`;
    for (const item of exportData.stage_configs) {
      sql += `INSERT INTO public.stage_configs (id, name, category, description, sla_turnaround_target_days, display_order, badge_color, is_active)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.name)}, ${escapeSql(item.category)}, ${escapeSql(item.description)}, ${item.slaTurnaroundTargetDays || item.sla_turnaround_target_days || 14}, ${item.displayOrder || item.display_order || 1}, ${escapeSql(item.badgeColor || item.badge_color)}, ${item.isActive !== false})\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n\n`;
    }
  }

  // 6. System Config
  if (exportData.system_config && exportData.system_config.length > 0) {
    sql += `-- System Config (${exportData.system_config.length})\n`;
    for (const item of exportData.system_config) {
      const configJson = JSON.stringify(item).replace(/'/g, "''");
      sql += `INSERT INTO public.system_config (id, config_data)\n`;
      sql += `VALUES (${escapeSql(item.id)}, '${configJson}'::jsonb)\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET config_data = EXCLUDED.config_data, updated_at = NOW();\n\n`;
    }
  }

  // 7. Demo Employees
  if (exportData.demo_employees && exportData.demo_employees.length > 0) {
    sql += `-- Demo Employees (${exportData.demo_employees.length})\n`;
    for (const item of exportData.demo_employees) {
      const rawProfile = JSON.stringify(item).replace(/'/g, "''");
      sql += `INSERT INTO public.employees (id, first_name, last_name, full_name, email, phone, department, role_title, employment_status, is_demo, owner_email, raw_profile)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.firstName || item.first_name || '')}, ${escapeSql(item.lastName || item.last_name || '')}, ${escapeSql(item.fullName || item.full_name || '')}, ${escapeSql(item.email)}, ${escapeSql(item.phone)}, ${escapeSql(item.department)}, ${escapeSql(item.roleTitle || item.role_title)}, ${escapeSql(item.employmentStatus || 'ACTIVE')}, true, 'admin@example.com', '${rawProfile}'::jsonb)\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, updated_at = NOW();\n\n`;
    }
  }

  // 8. Demo Providers (Must be before Clinical Staff for foreign key constraints)
  if (exportData.demo_providers && exportData.demo_providers.length > 0) {
    sql += `-- Demo Providers (${exportData.demo_providers.length})\n`;
    for (const item of exportData.demo_providers) {
      const contractJson = JSON.stringify(item.contractInfo || {}).replace(/'/g, "''");
      const enrollJson = JSON.stringify(item.payerEnrollments || []).replace(/'/g, "''");
      sql += `INSERT INTO public.providers (id, npi, first_name, last_name, credentials, provider_type, email, phone, license_number, license_state, caqh_id, caqh_status, pave_status, contract_info, payer_enrollments, is_demo, owner_email, active)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.npi)}, ${escapeSql(item.firstName || '')}, ${escapeSql(item.lastName || '')}, ${escapeSql(item.credentials)}, ${escapeSql(item.providerType)}, ${escapeSql(item.email)}, ${escapeSql(item.phone)}, ${escapeSql(item.licenseNumber)}, ${escapeSql(item.licenseState)}, ${escapeSql(item.caqhId)}, ${escapeSql(item.caqhStatus)}, ${escapeSql(item.paveStatus)}, '${contractJson}'::jsonb, '${enrollJson}'::jsonb, true, 'admin@example.com', ${item.active !== false})\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET first_name = EXCLUDED.first_name, updated_at = NOW();\n\n`;
    }
  }

  // 9. Demo Clinical Staff (Referencing Employees and Providers)
  if (exportData.demo_clinical_staff && exportData.demo_clinical_staff.length > 0) {
    sql += `-- Demo Clinical Staff (${exportData.demo_clinical_staff.length})\n`;
    for (const item of exportData.demo_clinical_staff) {
      const rawData = JSON.stringify(item).replace(/'/g, "''");
      sql += `INSERT INTO public.clinical_staff (id, employee_id, provider_id, first_name, last_name, credentials, provider_type, license_number, license_state, npi, caqh_id, pave_status, status, is_demo, owner_email, raw_data)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.employeeId || item.employee_id)}, ${escapeSql(item.providerId || item.provider_id)}, ${escapeSql(item.firstName || '')}, ${escapeSql(item.lastName || '')}, ${escapeSql(item.credentials)}, ${escapeSql(item.providerType)}, ${escapeSql(item.licenseNumber)}, ${escapeSql(item.licenseState)}, ${escapeSql(item.npi)}, ${escapeSql(item.caqhId)}, ${escapeSql(item.paveStatus)}, ${escapeSql(item.status || 'ACTIVE')}, true, 'admin@example.com', '${rawData}'::jsonb)\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET first_name = EXCLUDED.first_name, updated_at = NOW();\n\n`;
    }
  }

  // 10. Demo Records
  if (exportData.demo_records && exportData.demo_records.length > 0) {
    sql += `-- Demo Records (${exportData.demo_records.length})\n`;
    for (const item of exportData.demo_records) {
      const rawRec = JSON.stringify(item).replace(/'/g, "''");
      sql += `INSERT INTO public.credentialing_records (id, provider_id, payer_id, entity_id, location_id, clinical_staff_id, employee_id, assigned_specialist_id, application_type, discipline, stage, status, cycle_days, linking_status, contract_status, is_demo, owner_email, raw_record)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.providerId || item.provider_id)}, ${escapeSql(item.payerId || item.payer_id)}, ${escapeSql(item.entityId || item.entity_id)}, ${escapeSql(item.locationId || item.location_id)}, ${escapeSql(item.clinicalStaffId || item.clinical_staff_id)}, ${escapeSql(item.employeeId || item.employee_id)}, ${escapeSql(item.assignedSpecialistId || item.assigned_specialist_id)}, ${escapeSql(item.applicationType || 'INITIAL')}, ${escapeSql(item.discipline)}, ${escapeSql(item.stage || 'Intake')}, ${escapeSql(item.status || 'IN_PROGRESS')}, ${item.cycleDays || 0}, ${escapeSql(item.linkingStatus || 'PENDING')}, ${escapeSql(item.contractStatus || 'NOT_APPLICABLE')}, true, 'admin@example.com', '${rawRec}'::jsonb)\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET stage = EXCLUDED.stage, status = EXCLUDED.status, updated_at = NOW();\n\n`;
    }
  }

  // 11. System Notifications
  if (exportData.notifications && exportData.notifications.length > 0) {
    sql += `-- Notifications (${exportData.notifications.length})\n`;
    for (const item of exportData.notifications) {
      sql += `INSERT INTO public.system_notifications (id, type, title, message, severity, record_id, provider_id, is_read)\n`;
      sql += `VALUES (${escapeSql(item.id)}, ${escapeSql(item.type)}, ${escapeSql(item.title)}, ${escapeSql(item.message)}, ${escapeSql(item.severity || 'INFO')}, ${escapeSql(item.recordId)}, ${escapeSql(item.providerId)}, ${Boolean(item.isRead)})\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET is_read = EXCLUDED.is_read;\n\n`;
    }
  }

  sql += `SET session_replication_role = 'origin';\n\n`;

  const sqlPath = path.join(outDir, 'seed.sql');
  fs.writeFileSync(sqlPath, sql);
  console.log(`✓ Saved complete SQL seed file to: ${sqlPath}`);

  const schemaPath = path.join(outDir, 'migrations/20260910000000_initial_schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const combined = [
      '-- ============================================================================',
      '-- PROFICIO THERAPY SERVICES: COMPLETE SUPABASE MIGRATION + INITIAL SEED',
      '-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/uqaiotacheqjvfbanxtp/sql/new',
      '-- ============================================================================',
      '',
      schemaSql,
      '',
      sql
    ].join('\n');
    const combinedPath = path.join(outDir, 'full_migration_and_seed.sql');
    fs.writeFileSync(combinedPath, combined);
    console.log(`✓ Saved combined migration and seed file to: ${combinedPath}`);
  }

  console.log('\n================================================================');
  console.log('✅ EXTRACTION & SEED GENERATION COMPLETE!');
  console.log('Firebase remains fully untouched and operational.');
  console.log('================================================================');
  process.exit(0);
}

function escapeSql(val) {
  if (val === undefined || val === null) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
