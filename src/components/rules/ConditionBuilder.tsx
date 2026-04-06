import { Plus, ToggleLeft, Eye } from 'lucide-react'
import type { RuleConditionFilter } from '../../types'

interface ConditionBuilderProps {
  filters: RuleConditionFilter[]
}

const OPERATORS = [
  'igual a', 'diferente de', 'maior que', 'menor que',
  'contém', 'não contém', 'relativo a', 'sobrepõe',
  'pelo menos', 'no máximo',
]

export function ConditionBuilder({ filters }: ConditionBuilderProps) {
  return (
    <div className="border border-navy-100 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-navy-50 border-b border-navy-100">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">🔍 Filtro de Colunas</span>
          <span className="text-navy-300">▾</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-[10px] text-navy-500 hover:text-cyan-600 transition-colors">
            <ToggleLeft size={12} />
            Negar filtro
          </button>
          <button className="flex items-center gap-1 text-[10px] text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
            <Eye size={12} />
            Visualizar resultados
          </button>
        </div>
      </div>

      {/* Condition rows */}
      <div className="p-4 space-y-2">
        {filters.map((filter, index) => (
          <div key={filter.id} className="flex items-center gap-2 flex-wrap">
            {index > 0 && filter.logicalOp && (
              <span className="text-[10px] font-bold text-navy-400 bg-navy-50 px-2 py-0.5 rounded">
                {filter.logicalOp}
              </span>
            )}
            <span className="text-xs font-semibold text-navy-500 bg-navy-50 px-2 py-1 rounded uppercase">
              {filter.field}
            </span>
            <span className="text-xs text-cyan-600 font-medium bg-cyan-50 px-2 py-1 rounded cursor-pointer hover:bg-cyan-100 transition-colors">
              {filter.operator}
            </span>
            <span className="text-xs text-navy-700 bg-white border border-navy-200 px-2 py-1 rounded">
              {filter.value}
            </span>
          </div>
        ))}

        <button className="flex items-center gap-1 text-xs text-navy-400 hover:text-cyan-500 mt-2 transition-colors">
          <Plus size={12} />
          Adicionar condição
        </button>
      </div>
    </div>
  )
}
