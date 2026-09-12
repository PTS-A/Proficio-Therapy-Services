const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');
const firebaseConfig = require('../firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function inspect() {
  console.log('Connecting to Firestore...');

  const collectionsToCheck = [
    'users',
    'providers',
    'records',
    'clinical_staff',
    'employees',
    'demo_employees',
    'documents',
    'comments',
    'payers',
    'entities',
    'locations',
    'stage_configs',
    'system_config'
  ];

  for (const col of collectionsToCheck) {
    try {
      const snap = await getDocs(collection(db, col));
      console.log(`Collection "${col}": ${snap.size} documents`);
      snap.docs.forEach((doc) => {
        const data = doc.data();
        const label = data.name || data.email || data.title || (data.firstName ? `${data.firstName} ${data.lastName}` : doc.id);
        console.log(`  - [${doc.id}]: ${label}`);
      });
    } catch (e) {
      console.error(`Error fetching collection ${col}:`, e.message);
    }
  }
}

inspect().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
