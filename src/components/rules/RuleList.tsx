import { ShieldAlert, ShieldCheck, FileEdit } from 'lucide-react'
import type { Rule } from '../../types'

interface RuleListProps {
  rules: Rule[]
  activeRuleId: string | null
  onSelect: (id: string) => void
}

const STATUS_ICONS = {
  ativa: ShieldCheck,
  inativa: ShieldAlert,
  rascunho: FileEdit,
}

const STATUS_COLORS = {
  ativa: 'text-blue-500',
  inativa: 'text-navy-300',
  rascunho: 'text-amber-500',
}

export function RuleList({ rules, activeRuleId, onSelect }: RuleListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-navy-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-navy-800">Regras ({rules.length})</h3>
        </div>
        <div className="mt-2 flex gap-1">
          <button className="text-[10px] font-medium text-navy-500 hover:text-cyan-600 bg-navy-50 hover:bg-cyan-50 px-2 py-1 rounded transition-colors">
            Filtros de Regra
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rules.map((rule) => {
          const Icon = STATUS_ICONS[rule.status]
          const isActive = rule.id === activeRuleId

          return (
            <button
              key={rule.id}
              onClick={() => onSelect(rule.id)}
              className={`w-full text-left px-4 py-3 border-b border-navy-50 transition-colors ${
                isActive
                  ? 'bg-cyan-50/50 border-l-2 border-l-cyan-400'
                  : 'hover:bg-surface-secondary border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon size={16} className={`mt-0.5 shrink-0 ${STATUS_COLORS[rule.status]}`} />
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-cyan-700' : 'text-navy-800'}`}>
                    {rule.name}
                  </p>
                  <p className="text-[11px] text-navy-400 mt-0.5">
                    Autor · {rule.author}
                  </p>
                  <p className="text-[10px] text-navy-300 mt-0.5">
                    Criado em · {new Date(rule.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
