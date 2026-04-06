import { useState, useRef, useEffect } from 'react'
import { Check, Cloud, CloudOff, AlertCircle, X } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { isSupabaseEnabled } from '../../lib/supabase'

export function SyncStatus() {
  const syncError = useAppStore((s) => s.syncError)
  const lastSyncAt = useAppStore((s) => s.lastSyncAt)
  const setSyncError = useAppStore((s) => s.setSyncError)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const enabled = isSupabaseEnabled()

  let state: 'ok' | 'disabled' | 'error'
  if (!enabled) state = 'disabled'
  else if (syncError) state = 'error'
  else state = 'ok'

  const config = {
    ok: {
      color: 'bg-green-500',
      ring: 'ring-green-400/30',
      Icon: Check,
      label: 'Salvo na nuvem',
      detail: lastSyncAt
        ? `Última sincronização: ${new Date(lastSyncAt).toLocaleTimeString('pt-BR')}`
        : 'Conectado ao Supabase — seus dados são salvos automaticamente.',
    },
    disabled: {
      color: 'bg-navy-400',
      ring: 'ring-navy-300/30',
      Icon: CloudOff,
      label: 'Modo local',
      detail: 'Supabase não configurado. Dados salvos apenas neste navegador. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel para sincronizar.',
    },
    error: {
      color: 'bg-red-500 animate-pulse',
      ring: 'ring-red-400/30',
      Icon: AlertCircle,
      label: 'Erro de sincronização',
      detail: syncError ?? 'Erro desconhecido',
    },
  }[state]

  const Icon = config.Icon

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors text-navy-500 hover:text-navy-800`}
        title={config.label}
      >
        <div className="relative">
          <Cloud size={18} />
          <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white ${config.color}`} />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-modal border border-cyan-100/50 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-navy-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg ${config.color} bg-opacity-20 flex items-center justify-center`}>
                <Icon size={14} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-navy-800">{config.label}</h3>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded text-navy-300 hover:text-navy-700">
              <X size={14} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-navy-600 leading-relaxed">{config.detail}</p>

            {state === 'error' && (
              <button
                onClick={() => setSyncError(null)}
                className="w-full text-xs bg-navy-800 text-white rounded-lg py-2 font-medium hover:bg-navy-700 transition-colors"
              >
                Dispensar erro
              </button>
            )}

            {state === 'ok' && lastSyncAt && (
              <div className="text-[10px] text-navy-400 pt-2 border-t border-navy-50">
                <p>Dados sincronizados com o Supabase em tempo real.</p>
                <p className="mt-1">Você pode abrir em outro dispositivo e verá os mesmos dados.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
