import { useLocation } from 'react-router-dom'
import { User } from 'lucide-react'
import { getProduct, MODULES } from '../../config/products'
import type { ProductKey } from '../../config/products'
import { NotificationBell } from '../notifications/NotificationBell'

interface TopbarProps {
  product: ProductKey
}

export function Topbar({ product }: TopbarProps) {
  const location = useLocation()
  const slug = location.pathname.split('/').pop()
  const module = MODULES.find((m) => m.slug === slug)
  const config = getProduct(product)

  return (
    <header className="h-16 bg-white border-b border-cyan-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-navy-800">{module?.label ?? 'Dashboard'}</h1>
        <p className="text-xs text-navy-400">{config.fullName}</p>
      </div>
      <div className="flex items-center gap-3">
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
  )
}
