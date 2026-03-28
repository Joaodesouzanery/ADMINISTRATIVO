import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon?: ReactNode
  color?: string
}

export function KPICard({ title, value, subtitle, trend, icon, color = '#64D4E8' }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card border border-cyan-100/50 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-navy-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-navy-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-navy-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-navy-400'}`}>
              {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
              <span>{trend > 0 ? '+' : ''}{trend}% vs mês anterior</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
