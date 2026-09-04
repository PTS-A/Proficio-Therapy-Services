import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, collection, getDocs, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Auto-authenticate anonymously if not already signed in to satisfy rule checks
export async function ensureAuth() {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (err) {
    console.warn('[Firebase Auth] Anonymous sign-in notice:', err);
  }
}

// Validate connection to Firestore
export async function testConnection(): Promise<boolean> {
  try {
    await ensureAuth();
    await getDocFromServer(doc(db, '__health__', 'ping'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Client is offline or database initializing.');
      return false;
    }
    // Ping doc might not exist, but connecting to server succeeds without offline error
    return true;
  }
}

// Generic Firestore Helpers
export async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  try {
    await ensureAuth();
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const results: T[] = [];
    snapshot.forEach((d) => {
      results.push(d.data() as T);
    });
    return results;
  } catch (err) {
    console.error(`[Firestore] Failed to fetch collection ${collectionName}:`, err);
    throw err;
  }
}

export async function saveDocument<T extends Record<string, any>>(collectionName: string, docId: string, data: T): Promise<void> {
  try {
    await ensureAuth();
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.error(`[Firestore] Failed to save doc in ${collectionName}/${docId}:`, err);
    throw err;
  }
}

export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  try {
    await ensureAuth();
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`[Firestore] Failed to delete doc in ${collectionName}/${docId}:`, err);
    throw err;
  }
}

export async function saveBatch<T extends { id: string }>(collectionName: string, items: T[]): Promise<void> {
  if (!items || items.length === 0) return;
  try {
    await ensureAuth();
    // Firestore batches are limited to 500 operations
    const chunkSize = 450;
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach((item) => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item, { merge: true });
      });
      await batch.commit();
    }
  } catch (err) {
    console.error(`[Firestore] Failed to batch save in ${collectionName}:`, err);
    throw err;
  }
}
