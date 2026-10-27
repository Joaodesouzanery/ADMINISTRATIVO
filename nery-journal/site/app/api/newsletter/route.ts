import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Grava o pedido de inscrição (dupla confirmação por e-mail ainda não implementada: sem provedor de e-mail configurado).
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; consent?: boolean; consent_text?: string; consent_version?: string } | null
  const email = body?.email?.trim().toLowerCase() ?? ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  if (!body?.consent || !body.consent_text) return NextResponse.json({ error: 'É preciso aceitar o consentimento.' }, { status: 400 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: 'A newsletter ainda não está configurada.' }, { status: 503 })

  const db = createClient(url, key, { auth: { persistSession: false } })
  const { error } = await db.from('nj_subscribers').upsert(
    { email, sector: 'construcao', consent_text: body.consent_text, consent_version: body.consent_version ?? 'v0' },
    { onConflict: 'email,sector', ignoreDuplicates: true },
  )
  if (error) return NextResponse.json({ error: 'Não foi possível salvar agora.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
