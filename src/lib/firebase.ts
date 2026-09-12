import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Unsubscribe
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  saveDocument as saveSupabaseDocument, 
  deleteDocument as deleteSupabaseDocument, 
  saveBatch as saveSupabaseBatch 
} from './supabase';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if configured
export const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)')
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// SKILL: Firestore Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('[Firestore Error Details]', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let authAttempted = false;
let authAvailable = true;

// Auto-authenticate anonymously if not already signed in
export async function ensureAuth() {
  if (authAttempted && !authAvailable) return;
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
      authAvailable = true;
    }
  } catch (err: any) {
    authAttempted = true;
    authAvailable = false;
    if (err?.code !== 'auth/configuration-not-found' && err?.code !== 'auth/admin-restricted-operation') {
      console.warn('[Firebase Auth] Notice:', err?.message || err);
    }
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
    return true;
  }
}

// ----------------------------------------------------------------------------
// Offline Mutation Queue & Automatic Persistent Synchronization Engine
// ----------------------------------------------------------------------------
export interface QueuedMutation {
  id: string;
  collectionName: string;
  docId: string;
  action: 'set' | 'delete';
  data?: any;
  timestamp: number;
  retries: number;
}

const QUEUE_STORAGE_KEY = 'pts_cred_mutation_queue_v1';
let isDrainingQueue = false;
type QueueStatusListener = (pendingCount: number, isSyncing: boolean) => void;
const queueListeners: Set<QueueStatusListener> = new Set();

export function subscribeToSyncStatus(listener: QueueStatusListener): () => void {
  queueListeners.add(listener);
  listener(getQueuedMutations().length, isDrainingQueue);
  return () => {
    queueListeners.delete(listener);
  };
}

function notifyQueueStatus() {
  const pending = getQueuedMutations().length;
  queueListeners.forEach((l) => l(pending, isDrainingQueue));
}

export function getQueuedMutations(): QueuedMutation[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueuedMutations(queue: QueuedMutation[]) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    notifyQueueStatus();
  } catch (e) {
    console.error('[SyncEngine] Failed to write mutation queue to storage:', e);
  }
}

/**
 * Enqueue a mutation with coalescing (if the document is already in queue,
 * overwrite it with the latest data to prevent redundant or stale writes).
 */
export function enqueueMutation(mutation: Omit<QueuedMutation, 'id' | 'timestamp' | 'retries'>) {
  const queue = getQueuedMutations();
  const existingIdx = queue.findIndex(
    (m) => m.collectionName === mutation.collectionName && m.docId === mutation.docId
  );

  const newEntry: QueuedMutation = {
    ...mutation,
    id: `mut-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    retries: 0,
  };

  if (existingIdx !== -1) {
    // Replace with latest mutation state
    queue[existingIdx] = newEntry;
  } else {
    queue.push(newEntry);
  }

  saveQueuedMutations(queue);
  // Trigger immediate drain in background
  drainMutationQueue().catch(console.error);
}

/**
 * Drains the mutation queue sequentially to Google Cloud Firestore.
 */
export async function drainMutationQueue(): Promise<void> {
  if (isDrainingQueue) return;
  const queue = getQueuedMutations();
  if (queue.length === 0) return;

  isDrainingQueue = true;
  notifyQueueStatus();

  try {
    await ensureAuth();

    while (queue.length > 0) {
      const item = queue[0];
      try {
        const docRef = doc(db, item.collectionName, item.docId);
        if (item.action === 'set') {
          await setDoc(docRef, item.data, { merge: true });
        } else if (item.action === 'delete') {
          await deleteDoc(docRef);
        }
        // Successfully persisted! Remove from queue
        queue.shift();
        saveQueuedMutations(queue);
      } catch (err: any) {
        console.warn(`[SyncEngine] Retry queued item ${item.collectionName}/${item.docId}:`, err?.message || err);
        item.retries += 1;
        // If permanent fatal permission error, log and remove to prevent clogging
        if (err?.code === 'permission-denied') {
          console.error(`[SyncEngine] Permission denied for ${item.collectionName}/${item.docId}, dropping from queue.`);
          queue.shift();
          saveQueuedMutations(queue);
        } else {
          // Temporary network failure or offline - stop draining until next cycle
          saveQueuedMutations(queue);
          break;
        }
      }
    }
  } finally {
    isDrainingQueue = false;
    notifyQueueStatus();
  }
}

// Background worker: drain every 3.5 seconds, on 'online', and on window focus
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[SyncEngine] Network restored (online event). Draining queue...');
    drainMutationQueue().catch(console.error);
  });
  window.addEventListener('focus', () => {
    drainMutationQueue().catch(console.error);
  });
  setInterval(() => {
    if (getQueuedMutations().length > 0) {
      drainMutationQueue().catch(console.error);
    }
  }, 3500);
}

// ----------------------------------------------------------------------------
// Real-Time Database Persistence Operations
// ----------------------------------------------------------------------------

/**
 * Persists a document immediately to Firestore.
 * If network fails or client is offline, it is safely queued and retried automatically.
 */
export async function saveDocument<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  const docPath = `${collectionName}/${docId}`;
  try {
    await ensureAuth();
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });

    // If there was a queued mutation for this doc, remove it since we just succeeded
    const queue = getQueuedMutations();
    const filtered = queue.filter((m) => !(m.collectionName === collectionName && m.docId === docId));
    if (filtered.length !== queue.length) {
      saveQueuedMutations(filtered);
    }

    // Shadow replication to Supabase target (non-blocking)
    saveSupabaseDocument(collectionName, docId, data).catch((err) => {
      console.debug('[Supabase Shadow] sync notice:', err);
    });
  } catch (err: any) {
    console.warn(`[SyncEngine] Immediate write to ${docPath} deferred to resilient offline queue:`, err?.message || err);
    // Queue mutation for guaranteed persistence
    enqueueMutation({
      collectionName,
      docId,
      action: 'set',
      data,
    });
  }
}

/**
 * Deletes a document immediately from Firestore.
 * If network fails, queued for background retry.
 */
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  const docPath = `${collectionName}/${docId}`;
  try {
    await ensureAuth();
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);

    const queue = getQueuedMutations();
    const filtered = queue.filter((m) => !(m.collectionName === collectionName && m.docId === docId));
    if (filtered.length !== queue.length) {
      saveQueuedMutations(filtered);
    }

    // Shadow deletion in Supabase target (non-blocking)
    deleteSupabaseDocument(collectionName, docId).catch((err) => {
      console.debug('[Supabase Shadow] delete notice:', err);
    });
  } catch (err: any) {
    console.warn(`[SyncEngine] Immediate delete from ${docPath} deferred to resilient offline queue:`, err?.message || err);
    enqueueMutation({
      collectionName,
      docId,
      action: 'delete',
    });
  }
}

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
    handleFirestoreError(err, OperationType.GET, collectionName);
    return [];
  }
}

export async function saveBatch<T extends { id: string }>(collectionName: string, items: T[]): Promise<void> {
  if (!items || items.length === 0) return;
  try {
    await ensureAuth();
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

    // Shadow batch replication to Supabase target (non-blocking)
    saveSupabaseBatch(collectionName, items).catch((err) => {
      console.debug('[Supabase Shadow] batch notice:', err);
    });
  } catch (err) {
    console.warn(`[SyncEngine] Batch write failed for ${collectionName}, queuing individual records:`, err);
    items.forEach((item) => {
      enqueueMutation({
        collectionName,
        docId: item.id,
        action: 'set',
        data: item,
      });
    });
  }
}

/**
 * Real-time collection listener using onSnapshot with mandatory error handling.
 */
export function subscribeToCollection<T>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colRef = collection(db, collectionName);
  return onSnapshot(
    colRef,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const items: T[] = [];
      snapshot.forEach((d) => items.push(d.data() as T));
      onUpdate(items);
    },
    (error) => {
      console.warn(`[SyncEngine] onSnapshot notice for ${collectionName}:`, error.message);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, collectionName);
      } catch (e) {
        // Suppress uncaught throws to keep subscription handler intact
      }
    }
  );
}
