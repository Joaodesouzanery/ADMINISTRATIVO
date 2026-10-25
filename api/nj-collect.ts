// Vercel Function: coleta diária de dados abertos para a pauta do Nery Journal.
// Chamada pelo Vercel Cron (ver vercel.json). Exige CRON_SECRET (o Vercel envia "Authorization: Bearer <CRON_SECRET>").
// Variáveis: SUPABASE_URL (ou VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET.
import { createClient } from '@supabase/supabase-js'
import { COLLECTORS } from './_nj/sources'

interface Req { method?: string; headers: Record<string, string | string[] | undefined>; query?: Record<string, string | string[] | undefined> }
interface Res { status(code: number): Res; json(body: unknown): void }

export default async function handler(req: Req, res: Res) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes' })
  const db = createClient(url, key, { auth: { persistSession: false } })

  const only = typeof req.query?.source === 'string' ? req.query.source : null
  const ids = Object.keys(COLLECTORS).filter((id) => !only || id === only)

  const report: Record<string, { ok: boolean; collected: number; error?: string }> = {}
  for (const id of ids) {
    const result = await COLLECTORS[id]()
    let error = result.error
    if (result.items.length) {
      // ignoreDuplicates: não sobrescreve status/edição de itens já vistos.
      const { error: dbErr } = await db.from('nj_pauta_items').upsert(result.items, { onConflict: 'source_id,external_id', ignoreDuplicates: true })
      if (dbErr) error = `${error ? error + ' | ' : ''}supabase: ${dbErr.message}`
    }
    report[id] = { ok: result.ok && !error, collected: result.items.length, error }
  }
  return res.status(200).json({ ran_at: new Date().toISOString(), report })
}
