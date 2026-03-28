import { NavLink, useNavigate } from 'react-router-dom'
import { Kanban, FileText, Users, DollarSign, BarChart2, Network, ChevronLeft, ArrowLeftRight } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { useAppStore } from '../../store/appStore'
import { getProduct } from '../../config/products'
import type { ProductKey } from '../../config/products'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutKanban: Kanban,
  FileText,
  Users,
  DollarSign,
  BarChart2,
  Network,
}

interface SidebarProps {
  product: ProductKey
}

export function Sidebar({ product }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const navigate = useNavigate()
  const config = getProduct(product)
  const other: ProductKey = product === 'construdata' ? 'iris' : 'construdata'
  const otherConfig = getProduct(other)

  return (
    <aside
      className={`bg-navy-800 flex flex-col shadow-sidebar transition-all duration-300 shrink-0 ${
        sidebarOpen ? 'w-60' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center justify-between p-4 border-b border-navy-700 h-16`}>
        {sidebarOpen ? (
          <Logo size={32} showText />
        ) : (
          <Logo size={32} showText={false} />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
        >
          <ChevronLeft size={16} className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Product badge */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-b border-navy-700">
          <div className="bg-navy-700 rounded-lg px-3 py-2">
            <p className="text-cyan-400 font-semibold text-sm">{config.name}</p>
            <p className="text-navy-300 text-xs mt-0.5 truncate">{config.description}</p>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {config.modules.map((mod) => {
          const Icon = ICON_MAP[mod.icon]
          return (
            <NavLink
              key={mod.slug}
              to={`/${product}/${mod.slug}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                    : 'text-navy-300 hover:text-white hover:bg-navy-700'
                }`
              }
              title={!sidebarOpen ? mod.label : undefined}
            >
              <Icon size={18} />
              {sidebarOpen && <span className="truncate">{mod.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Switcher */}
      <div className="p-3 border-t border-navy-700">
        <button
          onClick={() => navigate(`/${other}/projetos`)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-navy-300 hover:text-white hover:bg-navy-700 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
          title={!sidebarOpen ? `Ir para ${otherConfig.name}` : undefined}
        >
          <ArrowLeftRight size={14} />
          {sidebarOpen && <span>Ir para {otherConfig.name}</span>}
        </button>
      </div>
    </aside>
  )
}
