import { Settings, Undo2, Redo2, RotateCcw, Send } from 'lucide-react'
import type { ScheduleOperator, ScheduleResource } from '../../types'

interface OperatorBarProps {
  operators: ScheduleOperator[]
  resources: ScheduleResource[]
  onSubmit?: () => void
  onReset?: () => void
}

export function OperatorBar({ operators, resources, onSubmit, onReset }: OperatorBarProps) {
  return (
    <div className="bg-white border border-navy-100 rounded-xl overflow-hidden">
      {/* Operator badges row */}
      <div className="px-4 py-2 border-b border-navy-50 flex flex-wrap gap-1.5">
        {operators.map((op) => (
          <span
            key={op.id}
            className="text-[10px] px-2 py-1 rounded font-medium text-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: op.color }}
            title={`${op.name} — ${op.role}`}
          >
            {op.name}
          </span>
        ))}
      </div>

      {/* Resource row */}
      <div className="px-4 py-2 border-b border-navy-50 flex flex-wrap gap-1.5">
        {resources.map((r) => (
          <span
            key={r.id}
            className="text-[10px] px-2 py-1 rounded border border-navy-200 text-navy-600 font-medium bg-navy-50"
          >
            {r.name}
          </span>
        ))}
      </div>

      {/* Action bar */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="text-[11px] text-navy-500 hover:text-navy-700 flex items-center gap-1 transition-colors">
            <span>≡ Changelog</span>
          </button>
          <button className="text-[11px] text-navy-500 hover:text-navy-700 flex items-center gap-1 transition-colors">
            <span>↓ Não Alocados</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="p-1.5 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded transition-colors" title="Configurações">
            <Settings size={14} />
          </button>
          <button className="p-1.5 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded transition-colors" title="Desfazer">
            <Undo2 size={14} />
          </button>
          <button className="p-1.5 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded transition-colors" title="Refazer">
            <Redo2 size={14} />
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-navy-600 hover:bg-navy-50 rounded-lg border border-navy-200 transition-colors"
          >
            <RotateCcw size={12} />
            Resetar
          </button>
          <button
            onClick={onSubmit}
            className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold bg-cyan-400 text-navy-800 rounded-lg hover:bg-cyan-300 transition-colors shadow-sm"
          >
            <Send size={12} />
            Submeter
          </button>
        </div>
      </div>
    </div>
  )
}
