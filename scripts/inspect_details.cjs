const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const firebaseConfig = require('../firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function inspectDetails() {
  const provSnap = await getDocs(collection(db, 'providers'));
  console.log('--- PROVIDERS ---');
  provSnap.forEach(d => {
    const data = d.data();
    console.log(d.id, data.firstName, data.lastName, data.email, data.providerType);
  });

  const recSnap = await getDocs(collection(db, 'records'));
  console.log('--- RECORDS ---');
  recSnap.forEach(d => {
    const data = d.data();
    console.log(d.id, data.providerName, data.payerName, data.stage, data.applicationType);
  });
}

inspectDetails().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
