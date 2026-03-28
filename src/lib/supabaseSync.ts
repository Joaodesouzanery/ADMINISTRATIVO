import { supabase, isSupabaseEnabled } from './supabase'
import type { ProductKey } from '../types'

// Generic helpers to sync Zustand stores ↔ Supabase tables.
// When Supabase is not configured (no env vars), these are no-ops —
// the app falls back to localStorage-only via Zustand persist.

type AnyRecord = Record<string, unknown>

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
    result[snakeKey] = value
  }
  return result
}

/** Fetch all rows for a product from a Supabase table */
export async function fetchFromSupabase<T>(table: string, product: ProductKey): Promise<T[]> {
  if (!isSupabaseEnabled() || !supabase) return []
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: true })
  if (error) {
    console.warn(`[supabase] fetch ${table} error:`, error.message)
    return []
  }
  return (data ?? []).map((row) => snakeToCamel(row as AnyRecord) as T)
}

/** Insert a row into Supabase */
export async function insertToSupabase(table: string, record: AnyRecord, product: ProductKey): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return
  const row = { ...camelToSnake(record), product }
  const { error } = await supabase.from(table).insert(row)
  if (error) console.warn(`[supabase] insert ${table} error:`, error.message)
}

/** Update a row in Supabase by id */
export async function updateInSupabase(table: string, id: string, patch: AnyRecord): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return
  const row = camelToSnake(patch)
  delete row.id // never update PK
  delete row.product // never change product
  const { error } = await supabase.from(table).update(row).eq('id', id)
  if (error) console.warn(`[supabase] update ${table} error:`, error.message)
}

/** Delete a row from Supabase by id */
export async function deleteFromSupabase(table: string, id: string): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) console.warn(`[supabase] delete ${table} error:`, error.message)
}
