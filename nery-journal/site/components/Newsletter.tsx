'use client'
import { useState } from 'react'

// Texto de consentimento: rascunho, deve ser revisado por advogado (LGPD) antes do lançamento.
const CONSENT_VERSION = 'v0-rascunho'
const CONSENT_TEXT = 'Concordo em receber notícias e comunicados do Nery Journal (Grupo Nery) por e-mail e posso cancelar a qualquer momento. Os dados serão tratados conforme a Política de Privacidade.'

export default function Newsletter({ variant }: { variant: 'button' | 'bar' | 'box' }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, consent: agree, consent_text: CONSENT_TEXT, consent_version: CONSENT_VERSION }) })
      const body = await res.json().catch(() => ({}))
      setMsg(res.ok ? 'Quase lá! Enviaremos um e-mail para confirmar sua inscrição.' : body.error ?? 'Não foi possível concluir agora.')
    } catch { setMsg('Sem conexão. Tente novamente.') }
    setBusy(false)
  }

  const modal = open && (
    <div className="modal-bg" role="dialog" aria-modal="true" aria-label="Receber newsletter" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="modal">
        <div className="art" aria-hidden="true"><span>nery journal</span></div>
        <form onSubmit={submit}>
          <button type="button" className="x" aria-label="Fechar" onClick={() => setOpen(false)}>×</button>
          <h2>Receba as notícias da construção no seu e-mail</h2>
          <input type="email" required placeholder="Insira um e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="chk"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />{CONSENT_TEXT}</label>
          <button className="btn accent" disabled={busy || !agree}>{busy ? 'Enviando…' : 'Enviar'}</button>
          <p className="msg" role="status">{msg}</p>
        </form>
      </div>
    </div>
  )

  if (variant === 'button') return <><button className="btn solid" onClick={() => setOpen(true)}>Receber newsletter</button>{modal}</>
  if (variant === 'box') return (
    <div className="signup">
      <h3>Receba as atualizações do setor</h3>
      <p>Notícias, indicadores e licitações de obras direto na sua caixa de entrada.</p>
      <button className="btn" onClick={() => setOpen(true)}>Cadastrar</button>
      {modal}
    </div>
  )
  if (hidden) return null
  return (
    <div className="bar" role="region" aria-label="Newsletter">
      <div className="wrap">
        <p><b>Assine a newsletter</b>Notícias, indicadores e licitações de obras com fonte e licença identificadas.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn solid" onClick={() => setOpen(true)}>Cadastrar</button>
          <button className="btn" onClick={() => setHidden(true)}>Fechar</button>
        </div>
      </div>
      {modal}
    </div>
  )
}
