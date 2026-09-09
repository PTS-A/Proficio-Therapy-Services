const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, updateDoc } = require('firebase/firestore');
const firebaseConfig = require('../firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo employee IDs and emails
const DEMO_EMPLOYEE_IDS = [
  'emp-prv-1',
  'emp-prv-2',
  'emp-prv-3',
  'emp-prv-4',
  'emp-prv-5',
  'emp-prv-6',
  'emp-prv-954093',
  'emp-usr-1',
  'emp-usr-2',
  'emp-usr-6'
];

async function migrate() {
  console.log('--- Starting Demo Employee Database Migration ---');
  console.log('Project:', firebaseConfig.projectId);

  // 1. Fetch current employees
  const empSnap = await getDocs(collection(db, 'employees'));
  console.log(`Found ${empSnap.size} total employee documents in "employees" collection.`);

  let migratedCount = 0;
  let deletedFromMainCount = 0;

  for (const docSnap of empSnap.docs) {
    const data = docSnap.data();
    const id = docSnap.id;

    const isDemo = DEMO_EMPLOYEE_IDS.includes(id) || 
                   id.startsWith('emp-prv-') || 
                   id.startsWith('emp-usr-') ||
                   (data.notes && data.notes.includes('Direct clinical staff employed'));

    if (isDemo) {
      console.log(`Migrating demo employee [${id}] (${data.fullName}) to "demo_employees" collection...`);
      
      const demoRecord = {
        ...data,
        isDemo: true,
        ownerAccountEmail: 'admin@example.com',
        migratedAt: new Date().toISOString(),
      };

      // 1. Write to isolated demo_employees collection
      await setDoc(doc(db, 'demo_employees', id), demoRecord);
      migratedCount++;

      // 2. Remove from main production employees collection
      await deleteDoc(doc(db, 'employees', id));
      deletedFromMainCount++;
      console.log(`  -> Removed [${id}] from main "employees" collection.`);
    }
  }

  console.log(`Successfully migrated ${migratedCount} demo employees to "demo_employees".`);
  console.log(`Successfully removed ${deletedFromMainCount} demo employees from "employees".`);

  // 3. Check and clean any orphaned references in clinical_staff for non-admin accounts
  const csSnap = await getDocs(collection(db, 'clinical_staff'));
  console.log(`Checking ${csSnap.size} clinical_staff documents for orphaned demo references...`);
  for (const csDoc of csSnap.docs) {
    const data = csDoc.data();
    if (data.employeeId && DEMO_EMPLOYEE_IDS.includes(data.employeeId)) {
      // If it's a demo clinical staff, mark with isDemo and ownerAccountEmail
      console.log(`Marking clinical_staff [${csDoc.id}] (${data.fullName}) with demo metadata...`);
      await updateDoc(doc(db, 'clinical_staff', csDoc.id), {
        isDemo: true,
        ownerAccountEmail: 'admin@example.com'
      });
    }
  }

  // 4. Verify post-migration state
  const remainingEmpSnap = await getDocs(collection(db, 'employees'));
  console.log(`Remaining documents in main "employees" collection: ${remainingEmpSnap.size}`);
  remainingEmpSnap.forEach((d) => {
    console.log(`  Production Employee: [${d.id}] ${d.data().fullName} (${d.data().email})`);
  });

  const demoSnap = await getDocs(collection(db, 'demo_employees'));
  console.log(`Total documents in isolated "demo_employees" collection: ${demoSnap.size}`);
  demoSnap.forEach((d) => {
    console.log(`  Demo Employee (admin@example.com only): [${d.id}] ${d.data().fullName} (${d.data().email})`);
  });

  console.log('--- Migration completed successfully ---');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
