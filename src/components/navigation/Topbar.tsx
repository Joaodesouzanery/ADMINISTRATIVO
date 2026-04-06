import { useLocation } from 'react-router-dom'
import { User, AlertCircle, X } from 'lucide-react'
import { getProduct } from '../../config/products'
import type { ProductKey } from '../../config/products'
import { NotificationBell } from '../notifications/NotificationBell'
import { SyncStatus } from './SyncStatus'
import { useAppStore } from '../../store/appStore'

interface TopbarProps {
  product: ProductKey
}

export function Topbar({ product }: TopbarProps) {
  const location = useLocation()
  const slug = location.pathname.split('/').pop()
  const config = getProduct(product)
  const module = config.modules.find((m) => m.slug === slug)
  const syncError = useAppStore((s) => s.syncError)
  const setSyncError = useAppStore((s) => s.setSyncError)

  return (
    <>
      <header className="h-16 bg-white border-b border-cyan-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-navy-800">{module?.label ?? 'Dashboard'}</h1>
          <p className="text-xs text-navy-400">{config.fullName}</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncStatus />
          <NotificationBell product={product} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center">
              <User size={16} className="text-cyan-400" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-navy-800">Admin</p>
              <p className="text-xs text-navy-400">Atlântico</p>
            </div>
          </div>
        </div>
      </header>

      {syncError && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center gap-3">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-red-800">Erro de sincronização com o Supabase</p>
            <p className="text-xs text-red-600 truncate">{syncError}</p>
          </div>
          <button
            onClick={() => setSyncError(null)}
            className="shrink-0 p-1 rounded text-red-400 hover:text-red-700 hover:bg-red-100"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  )
}
