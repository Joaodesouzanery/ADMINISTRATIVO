import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { PRODUCTS } from '../config/products'
import { ArrowRight, Kanban, FileText, Users, DollarSign, BarChart2 } from 'lucide-react'

const MODULE_ICONS = [Kanban, FileText, Users, DollarSign, BarChart2]

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <Logo size={40} showText />
        <div className="text-navy-300 text-sm">Plataforma Administrativa</div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            Selecione um produto para continuar
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Bem-vindo à Atlântico
          </h1>
          <p className="text-navy-300 text-lg max-w-lg">
            Plataforma administrativa central para todos os seus produtos e projetos.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {PRODUCTS.map((product) => (
            <button
              key={product.key}
              onClick={() => navigate(`/${product.key}/projetos`)}
              className="group bg-navy-700/50 backdrop-blur border border-navy-600 hover:border-cyan-400/40 rounded-2xl p-7 text-left transition-all duration-200 hover:bg-navy-700/80 hover:shadow-kpi"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-cyan-400/10 rounded-lg px-2.5 py-1 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: product.color }} />
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Atlântico</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{product.name}</h2>
                  <p className="text-navy-300 text-sm mt-1">{product.description}</p>
                </div>
                <ArrowRight size={20} className="text-navy-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all mt-1" />
              </div>

              {/* Modules preview */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.modules.map((mod, i) => {
                  const Icon = MODULE_ICONS[i]
                  return (
                    <div key={mod.slug} className="flex items-center gap-1.5 bg-navy-800/60 rounded-lg px-2.5 py-1.5">
                      <Icon size={12} className="text-cyan-400" />
                      <span className="text-xs text-navy-300">{mod.label}</span>
                    </div>
                  )
                })}
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-navy-400 text-xs mt-12">
          Atlântico © {new Date().getFullYear()} · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
