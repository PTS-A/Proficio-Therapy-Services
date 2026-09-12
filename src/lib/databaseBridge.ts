/**
 * PROFICIO THERAPY SERVICES — UNIFIED DATABASE BRIDGE
 * Transparent switching and dual-engine orchestration between Google Firebase and Supabase.
 * Default: 'firebase' (100% stable primary with shadow replication to Supabase).
 */

import * as firebaseLib from './firebase';
import * as supabaseLib from './supabase';

export type BackendProvider = 'supabase' | 'firebase';

const STORAGE_KEY_PROVIDER = 'pts_active_backend_provider';

let activeProvider: BackendProvider = (
  (typeof localStorage !== 'undefined' && (localStorage.getItem(STORAGE_KEY_PROVIDER) as BackendProvider)) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DATA_PROVIDER as BackendProvider) ||
  'supabase'
);

// Flag to indicate whether Firebase is suspended / decommissioned
export const isFirebaseDecommissioned = true;

export function getActiveBackendProvider(): BackendProvider {
  return activeProvider;
}

export function setActiveBackendProvider(provider: BackendProvider): void {
  activeProvider = provider;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PROVIDER, provider);
  }
  console.log(`[DatabaseBridge] Switched active backend provider to: ${provider}`);
}

export async function testConnection(): Promise<boolean> {
  if (activeProvider === 'supabase') {
    const res = await supabaseLib.testConnection();
    return res.ok;
  }
  return firebaseLib.testConnection();
}

export async function drainMutationQueue(): Promise<void> {
  if (activeProvider === 'supabase') {
    return Promise.resolve();
  }
  return firebaseLib.drainMutationQueue();
}

export async function checkBackendHealth(): Promise<{
  firebase: { ok: boolean; message: string; suspended: boolean };
  supabase: { ok: boolean; message: string; mode: string };
  activeProvider: BackendProvider;
}> {
  let fbStatus = { 
    ok: true, 
    message: isFirebaseDecommissioned ? 'Firebase suspended / decommissioned in favor of Supabase.' : 'Google Cloud Firestore is online.',
    suspended: isFirebaseDecommissioned 
  };
  
  if (!isFirebaseDecommissioned) {
    try {
      await firebaseLib.ensureAuth();
    } catch (err: any) {
      fbStatus = { ok: false, message: err?.message || 'Firebase error', suspended: false };
    }
  }

  const sbStatus = await supabaseLib.testConnection();

  return {
    firebase: fbStatus,
    supabase: sbStatus,
    activeProvider,
  };
}

/**
 * Unified saveDocument:
 * Dispatches to active provider and ensures shadow consistency.
 */
export async function saveDocument<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  if (activeProvider === 'supabase') {
    await supabaseLib.saveDocument(collectionName, docId, data);
    if (!isFirebaseDecommissioned) {
      firebaseLib.saveDocument(collectionName, docId, data).catch(() => {});
    }
  } else {
    await firebaseLib.saveDocument(collectionName, docId, data);
  }
}

/**
 * Unified deleteDocument:
 * Deletes from active provider.
 */
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  if (activeProvider === 'supabase') {
    await supabaseLib.deleteDocument(collectionName, docId);
    if (!isFirebaseDecommissioned) {
      firebaseLib.deleteDocument(collectionName, docId).catch(() => {});
    }
  } else {
    await firebaseLib.deleteDocument(collectionName, docId);
  }
}

/**
 * Unified fetchCollection:
 * Reads from active provider.
 */
export async function fetchCollection<T = any>(collectionName: string): Promise<T[]> {
  if (activeProvider === 'supabase') {
    return supabaseLib.fetchCollection<T>(collectionName);
  }
  return firebaseLib.fetchCollection<T>(collectionName);
}

/**
 * Unified saveBatch:
 * Batch persists to active provider.
 */
export async function saveBatch<T extends { id: string }>(collectionName: string, items: T[]): Promise<void> {
  if (activeProvider === 'supabase') {
    await supabaseLib.saveBatch(collectionName, items);
    if (!isFirebaseDecommissioned) {
      firebaseLib.saveBatch(collectionName, items).catch(() => {});
    }
  } else {
    await firebaseLib.saveBatch(collectionName, items);
  }
}

/**
 * Unified subscribeToCollection:
 * Listens in real-time from active provider.
 */
export function subscribeToCollection<T = any>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  onError?: (err: any) => void
): () => void {
  if (activeProvider === 'supabase') {
    return supabaseLib.subscribeToCollection<T>(collectionName, onUpdate, onError);
  }
  return firebaseLib.subscribeToCollection<T>(collectionName, onUpdate, onError);
}

/**
 * Unified sync status listener
 */
export function subscribeToSyncStatus(listener: (status: any) => void): () => void {
  if (activeProvider === 'supabase') {
    return supabaseLib.subscribeToSyncStatus(listener);
  }
  return firebaseLib.subscribeToSyncStatus(listener);
}

export async function ensureAuth(): Promise<void> {
  if (activeProvider === 'supabase') {
    return supabaseLib.ensureAuth();
  }
  return firebaseLib.ensureAuth();
}
