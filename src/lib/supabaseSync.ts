import { supabase, isSupabaseEnabled } from './supabase'
import { useAppStore } from '../store/appStore'
import type { ProductKey } from '../types'

// Generic helpers to sync Zustand stores ↔ Supabase tables.
// When Supabase is not configured (no env vars), these are no-ops —
// the app falls back to localStorage-only via Zustand persist.
// When any call errors, the message is pushed to useAppStore.syncError
// so the Topbar SyncStatus indicator can turn red and surface the problem.

type AnyRecord = Record<string, unknown>

export interface SyncResult {
  ok: boolean
  error?: string
}

function snakeToCamel(obj: AnyRecord): AnyRecord {
  const result: AnyRecord = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    result[camelKey] = value
  }
  return result
}

function camelToSnake(obj: AnyRecord): AnyRecord {
  const result: AnyRecord = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
    // Convert undefined to null so Supabase clears the field
    result[snakeKey] = value === undefined ? null : value
  }
  return result
}

function reportError(op: string, table: string, message: string) {
  console.warn(`[supabase] ${op} ${table} error:`, message)
  try {
    useAppStore.getState().setSyncError(`${op} ${table}: ${message}`)
  } catch {
    // appStore not ready — ignore
  }
}

function reportSuccess() {
  try {
    const { syncError, setSyncError, setLastSyncAt } = useAppStore.getState()
    setLastSyncAt(new Date().toISOString())
    // Clear any stale error on success
    if (syncError) setSyncError(null)
  } catch {
    // ignore
  }
}

/** Fetch all rows for a product from a Supabase table */
export async function fetchFromSupabase<T>(table: string, product: ProductKey | null = null): Promise<T[]> {
  if (!isSupabaseEnabled() || !supabase) return []
  let query = supabase.from(table).select('*').order('created_at', { ascending: true })
  if (product !== null) query = query.eq('product', product)
  const { data, error } = await query
  if (error) {
    reportError('fetch', table, error.message)
    return []
  }
  reportSuccess()
  return (data ?? []).map((row) => snakeToCamel(row as AnyRecord) as T)
}

/** Insert a row into Supabase */
export async function insertToSupabase(table: string, record: AnyRecord, product: ProductKey): Promise<SyncResult> {
  if (!isSupabaseEnabled() || !supabase) return { ok: true }
  const row = { ...camelToSnake(record), product }
  const { error } = await supabase.from(table).insert(row)
  if (error) {
    reportError('insert', table, error.message)
    return { ok: false, error: error.message }
  }
  reportSuccess()
  return { ok: true }
}

/** Update a row in Supabase by id */
export async function updateInSupabase(table: string, id: string, patch: AnyRecord): Promise<SyncResult> {
  if (!isSupabaseEnabled() || !supabase) return { ok: true }
  const row = camelToSnake(patch)
  delete row.id // never update PK
  delete row.product // never change product
  const { error } = await supabase.from(table).update(row).eq('id', id)
  if (error) {
    reportError('update', table, error.message)
    return { ok: false, error: error.message }
  }
  reportSuccess()
  return { ok: true }
}

/** Delete a row from Supabase by id */
export async function deleteFromSupabase(table: string, id: string): Promise<SyncResult> {
  if (!isSupabaseEnabled() || !supabase) return { ok: true }
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) {
    reportError('delete', table, error.message)
    return { ok: false, error: error.message }
  }
  reportSuccess()
  return { ok: true }
}
