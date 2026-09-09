const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const firebaseConfig = require('../firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function inspectAll() {
  const collections = ['employees', 'clinical_staff', 'providers', 'records', 'applications', 'users', 'documents', 'comments'];
  for (const col of collections) {
    try {
      const snap = await getDocs(collection(db, col));
      console.log(`=== Collection: ${col} (Count: ${snap.size}) ===`);
      snap.forEach((d) => {
        const data = d.data();
        console.log(`  [${d.id}] name: ${data.fullName || data.name || data.id} ${data.email || ''} employeeId: ${data.employeeId || ''}`);
      });
    } catch (err) {
      console.log(`Failed to fetch ${col}: ${err.message}`);
    }
  }
  process.exit(0);
}

inspectAll();
