import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Wrench, Users, Eye } from 'lucide-react'
import type { ScheduleResource, ScheduleOperator } from '../../types'

interface ResourcePanelProps {
  resources: ScheduleResource[]
  operators: ScheduleOperator[]
  timestamp?: string
}

export function ResourcePanel({ resources, operators, timestamp }: ResourcePanelProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <div className="w-10 bg-white border border-navy-100 rounded-xl flex flex-col items-center py-3 shrink-0">
        <button onClick={() => setCollapsed(false)} className="p-1 text-navy-400 hover:text-cyan-500 transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border border-navy-100 rounded-xl shrink-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-navy-100 bg-navy-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-navy-700">Legenda</span>
          <span className="text-xs text-navy-400">Buscar</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed(true)} className="p-1 text-navy-400 hover:text-navy-600">
            <ChevronLeft size={12} />
          </button>
        </div>
      </div>

      {/* Time indicator */}
      <div className="px-3 py-2 border-b border-navy-50">
        <p className="text-[10px] text-navy-400 font-medium">
          {timestamp ?? new Date().toLocaleDateString('pt-BR')}
        </p>
        <p className="text-[10px] text-navy-300">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        <button className="text-[10px] text-cyan-600 hover:text-cyan-700 font-medium mt-0.5 flex items-center gap-1">
          <Eye size={10} />
          Ver Mais Recente →
        </button>
      </div>

      {/* Objects */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-2">Objetos</p>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-navy-700">
            <Wrench size={12} className="text-red-500" />
            <span>Recursos</span>
            <span className="ml-auto text-[10px] text-navy-400">{resources.length}</span>
          </div>

          {resources.map((r) => (
            <div key={r.id} className="flex items-center gap-2 pl-5 text-[11px] text-navy-600">
              <MapPin size={10} className="text-navy-300" />
              <span className="truncate">{r.name}</span>
              <span className={`ml-auto text-[9px] px-1 py-0.5 rounded font-medium ${
                r.status === 'ativo' ? 'bg-green-50 text-green-600' :
                r.status === 'manutenção' ? 'bg-amber-50 text-amber-600' :
                'bg-red-50 text-red-600'
              }`}>
                {r.status}
              </span>
            </div>
          ))}

          <div className="flex items-center gap-2 text-xs text-navy-700 mt-3">
            <Users size={12} className="text-blue-500" />
            <span>Operadores</span>
            <span className="ml-auto text-[10px] text-navy-400">{operators.length}</span>
          </div>

          {operators.slice(0, 8).map((op) => (
            <div key={op.id} className="flex items-center gap-2 pl-5 text-[11px] text-navy-600">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: op.color }} />
              <span className="truncate">{op.name}</span>
            </div>
          ))}
          {operators.length > 8 && (
            <p className="pl-5 text-[10px] text-navy-400">+{operators.length - 8} mais...</p>
          )}
        </div>
      </div>
    </div>
  )
}
