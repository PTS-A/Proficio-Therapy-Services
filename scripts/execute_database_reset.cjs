const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, writeBatch } = require('firebase/firestore');
const firebaseConfig = require('../firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetDatabase() {
  console.log('=== STARTING DATABASE RESET & DEMO ISOLATION ===');

  // 1. Fetch current providers and records
  const provSnap = await getDocs(collection(db, 'providers'));
  console.log(`Found ${provSnap.size} existing providers in production collection.`);

  const recSnap = await getDocs(collection(db, 'records'));
  console.log(`Found ${recSnap.size} existing records in production collection.`);

  const staffSnap = await getDocs(collection(db, 'clinical_staff'));
  console.log(`Found ${staffSnap.size} existing clinical_staff in production collection.`);

  const docSnap = await getDocs(collection(db, 'documents'));
  console.log(`Found ${docSnap.size} existing documents in production collection.`);

  const comSnap = await getDocs(collection(db, 'comments'));
  console.log(`Found ${comSnap.size} existing comments in production collection.`);

  // 2. Archive demo data to isolated admin-only collections for admin@example.com
  console.log('\n--- Isolating demo data into admin-only collections (demo_providers, demo_records, demo_clinical_staff) ---');

  for (const d of provSnap.docs) {
    const data = d.data();
    await setDoc(doc(db, 'demo_providers', d.id), {
      ...data,
      isDemo: true,
      ownerAccountEmail: 'admin@example.com',
      isolatedFor: 'admin@example.com'
    });
  }
  console.log(`Copied ${provSnap.size} providers to isolated "demo_providers" collection.`);

  for (const d of recSnap.docs) {
    const data = d.data();
    await setDoc(doc(db, 'demo_records', d.id), {
      ...data,
      isDemo: true,
      ownerAccountEmail: 'admin@example.com',
      isolatedFor: 'admin@example.com'
    });
  }
  console.log(`Copied ${recSnap.size} records to isolated "demo_records" collection.`);

  for (const d of staffSnap.docs) {
    const data = d.data();
    await setDoc(doc(db, 'demo_clinical_staff', d.id), {
      ...data,
      isDemo: true,
      ownerAccountEmail: 'admin@example.com',
      isolatedFor: 'admin@example.com'
    });
  }
  console.log(`Copied ${staffSnap.size} clinical staff to isolated "demo_clinical_staff" collection.`);

  // 3. Remove incorrect/demo data from production collections
  console.log('\n--- Purging demo data from production collections (providers, records, clinical_staff, documents, comments) ---');

  for (const d of provSnap.docs) {
    await deleteDoc(doc(db, 'providers', d.id));
    console.log(`  Removed demo provider [${d.id}] from production "providers"`);
  }

  for (const d of recSnap.docs) {
    await deleteDoc(doc(db, 'records', d.id));
    console.log(`  Removed demo record [${d.id}] from production "records"`);
  }

  for (const d of staffSnap.docs) {
    await deleteDoc(doc(db, 'clinical_staff', d.id));
    console.log(`  Removed demo clinical staff [${d.id}] from production "clinical_staff"`);
  }

  for (const d of docSnap.docs) {
    await deleteDoc(doc(db, 'documents', d.id));
    console.log(`  Removed document [${d.id}] from production "documents"`);
  }

  for (const d of comSnap.docs) {
    await deleteDoc(doc(db, 'comments', d.id));
    console.log(`  Removed comment [${d.id}] from production "comments"`);
  }

  // 4. Verify preserved structural configuration and real user accounts
  console.log('\n--- Verifying Preserved Application Structure ---');
  const userSnap = await getDocs(collection(db, 'users'));
  console.log(`Preserved ${userSnap.size} User Accounts:`);
  userSnap.forEach(u => console.log(`  - ${u.id}: ${u.data().name} (${u.data().email}) [${u.data().systemRole}]`));

  const payerSnap = await getDocs(collection(db, 'payers'));
  console.log(`Preserved ${payerSnap.size} Payers: ${payerSnap.docs.map(p => p.id).join(', ')}`);

  const entitySnap = await getDocs(collection(db, 'entities'));
  console.log(`Preserved ${entitySnap.size} Legal Entities: ${entitySnap.docs.map(e => e.id).join(', ')}`);

  const locSnap = await getDocs(collection(db, 'locations'));
  console.log(`Preserved ${locSnap.size} Practice Locations: ${locSnap.docs.map(l => l.id).join(', ')}`);

  const stageSnap = await getDocs(collection(db, 'stage_configs'));
  console.log(`Preserved ${stageSnap.size} Workflow Stage Configs.`);

  const configSnap = await getDocs(collection(db, 'system_config'));
  console.log(`Preserved ${configSnap.size} System Config docs (settings, holidays, templates).`);

  const demoEmpSnap = await getDocs(collection(db, 'demo_employees'));
  console.log(`Preserved ${demoEmpSnap.size} Demo Employees in isolated "demo_employees" collection for admin@example.com.`);

  console.log('\n=== DATABASE RESET COMPLETE: Production collections are clean and empty. Admin demo data is isolated. ===');
}

resetDatabase().then(() => process.exit(0)).catch(err => {
  console.error('Reset error:', err);
  process.exit(1);
});
