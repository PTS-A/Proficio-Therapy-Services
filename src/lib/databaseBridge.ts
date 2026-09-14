/**
 * PROFICIO THERAPY SERVICES — DATABASE BRIDGE
 * Supabase PostgreSQL is the sole, active production database provider.
 * All connections, queries, real-time subscriptions, and mutations operate exclusively via Supabase.
 */

import * as supabaseLib from './supabase';

export type BackendProvider = 'supabase';

const STORAGE_KEY_PROVIDER = 'pts_active_backend_provider';

let activeProvider: BackendProvider = 'supabase';

// Ensure Supabase is locked in storage
if (typeof localStorage !== 'undefined') {
  localStorage.setItem(STORAGE_KEY_PROVIDER, 'supabase');
}

export function getActiveBackendProvider(): BackendProvider {
  return 'supabase';
}

export function setActiveBackendProvider(_provider: string): void {
  activeProvider = 'supabase';
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PROVIDER, 'supabase');
  }
  console.log(`[DatabaseBridge] Backend provider locked to: supabase`);
}

export async function testConnection(): Promise<boolean> {
  const res = await supabaseLib.testConnection();
  return res.ok;
}

export async function drainMutationQueue(): Promise<void> {
  return Promise.resolve();
}

export async function checkBackendHealth(): Promise<{
  supabase: { ok: boolean; message: string; mode: string };
  activeProvider: BackendProvider;
}> {
  const sbStatus = await supabaseLib.testConnection();

  return {
    supabase: sbStatus,
    activeProvider: 'supabase',
  };
}

/**
 * Unified saveDocument:
 * Dispatches exclusively to Supabase.
 */
export async function saveDocument<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  await supabaseLib.saveDocument(collectionName, docId, data);
}

/**
 * Unified deleteDocument:
 * Deletes exclusively from Supabase.
 */
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  await supabaseLib.deleteDocument(collectionName, docId);
}

/**
 * Unified fetchCollection:
 * Reads exclusively from Supabase.
 */
export async function fetchCollection<T = any>(collectionName: string): Promise<T[]> {
  return supabaseLib.fetchCollection<T>(collectionName);
}

/**
 * Unified saveBatch:
 * Batch persists exclusively to Supabase.
 */
export async function saveBatch<T extends { id: string }>(collectionName: string, items: T[]): Promise<void> {
  await supabaseLib.saveBatch(collectionName, items);
}

/**
 * Unified subscribeToCollection:
 * Listens in real-time exclusively from Supabase.
 */
export function subscribeToCollection<T = any>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  onError?: (err: any) => void
): () => void {
  return supabaseLib.subscribeToCollection<T>(collectionName, onUpdate, onError);
}

/**
 * Unified sync status listener
 */
export function subscribeToSyncStatus(listener: (status: any) => void): () => void {
  return supabaseLib.subscribeToSyncStatus(listener);
}

export async function ensureAuth(): Promise<void> {
  return supabaseLib.ensureAuth();
}

