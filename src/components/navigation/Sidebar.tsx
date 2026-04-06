import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Kanban, FileText, Users, DollarSign, BarChart2, Network, ChevronLeft, ArrowLeftRight, CalendarRange, ShieldAlert, BookOpen, CalendarDays, ClipboardList, LayoutDashboard } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { useAppStore } from '../../store/appStore'
import { getProduct, PRODUCTS } from '../../config/products'
import type { ProductKey } from '../../config/products'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutKanban: Kanban,
  FileText,
  Users,
  DollarSign,
  BarChart2,
  Network,
  CalendarRange,
  ShieldAlert,
  BookOpen,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
}

interface SidebarProps {
  product: ProductKey
}

export function Sidebar({ product }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const navigate = useNavigate()
  const config = getProduct(product)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const otherProducts = PRODUCTS.filter((p) => p.key !== product)

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
      <div className="p-3 border-t border-navy-700 relative">
        <button
          onClick={() => setSwitcherOpen(!switcherOpen)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-navy-300 hover:text-white hover:bg-navy-700 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
          title={!sidebarOpen ? 'Trocar produto' : undefined}
        >
          <ArrowLeftRight size={14} />
          {sidebarOpen && <span>Trocar produto</span>}
        </button>
        {switcherOpen && (
          <div className={`absolute bottom-full mb-1 bg-navy-700 border border-navy-600 rounded-lg shadow-modal overflow-hidden z-30 ${sidebarOpen ? 'left-3 right-3' : 'left-12 w-48'}`}>
            {otherProducts.map((p) => {
              const defaultSlug = p.modules[0]?.slug ?? 'projetos'
              return (
                <button
                  key={p.key}
                  onClick={() => { navigate(`/${p.key}/${defaultSlug}`); setSwitcherOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-navy-200 hover:text-white hover:bg-navy-600 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="font-medium">{p.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
