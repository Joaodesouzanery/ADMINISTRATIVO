import { Plus, ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { ScheduleScenario } from '../../types'

interface ScenarioSelectorProps {
  scenarios: ScheduleScenario[]
  activeScenarioId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
}

export function ScenarioSelector({ scenarios, activeScenarioId, onSelect, onAdd, onRemove }: ScenarioSelectorProps) {
  const [open, setOpen] = useState(false)
  const active = scenarios.find((s) => s.id === activeScenarioId)

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-white border border-navy-200 rounded-lg px-4 py-2 text-sm font-medium text-navy-800 hover:border-cyan-400 transition-colors"
        >
          <span>{active?.name ?? 'Selecionar Cenário'}</span>
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-navy-200 rounded-lg shadow-modal z-20 min-w-[200px]">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-surface transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  s.id === activeScenarioId ? 'bg-cyan-50 text-cyan-700 font-medium' : 'text-navy-700'
                }`}
              >
                <span onClick={() => { onSelect(s.id); setOpen(false) }} className="flex-1 flex items-center gap-2">
                  {s.isNew && (
                    <span className="bg-cyan-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NOVO</span>
                  )}
                  {s.name}
                </span>
                {scenarios.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(s.id) }}
                    className="p-1 text-navy-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 bg-cyan-400 text-navy-800 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-cyan-300 transition-colors shadow-sm"
      >
        <Plus size={14} />
        Criar
      </button>
    </div>
  )
}
