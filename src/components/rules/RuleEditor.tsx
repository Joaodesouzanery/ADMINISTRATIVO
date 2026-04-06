import { Plus, RotateCcw, Trash2, Users, ChevronDown } from 'lucide-react'
import type { Rule, RuleConstraintType } from '../../types'
import { ObjectHierarchy } from './ObjectHierarchy'
import { ConditionBuilder } from './ConditionBuilder'
import { StreamingCondition } from './StreamingCondition'

interface RuleEditorProps {
  rule: Rule
  onUpdate: (updates: Partial<Rule>) => void
  onDelete: () => void
  onReset: () => void
  onSubmit: () => void
}

export function RuleEditor({ rule, onUpdate, onDelete, onReset, onSubmit }: RuleEditorProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-navy-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <span className="text-white text-sm">📋</span>
          </div>
          <h2 className="text-lg font-semibold text-navy-800">Editando Regra</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-800 bg-white border border-navy-200 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={14} />
            Criar nova
            <ChevronDown size={12} />
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-800 bg-white border border-navy-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            Resetar
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 bg-white border border-red-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
            Excluir
          </button>
          <button
            onClick={onSubmit}
            className="flex items-center gap-1.5 text-sm font-semibold text-navy-800 bg-cyan-400 hover:bg-cyan-300 px-4 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <Users size={14} />
            Submeter alterações
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">Nome da regra *</label>
          <input
            type="text"
            value={rule.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-800 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium text-navy-600">Descrição da regra *</label>
            <span className="text-[10px] text-navy-400 bg-navy-50 px-1.5 py-0.5 rounded">Editado</span>
          </div>
          <input
            type="text"
            value={rule.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-800 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Object hierarchy */}
        <ObjectHierarchy nodes={rule.objectNodes} />

        {/* Condition builder */}
        <ConditionBuilder filters={rule.conditionFilters} />

        {/* Rule output */}
        <div className="border border-navy-100 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-navy-50 border-b border-navy-100">
            <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">➡️ Saída da Regra</span>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-navy-600 mb-1 block">COM MAPEAMENTO DE COLUNAS</label>
              <div className="bg-white border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-700 flex items-center gap-1">
                📋 {rule.outputMapping}
                <span className="text-navy-300 ml-auto">▾</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-navy-600 mb-1 block">Constraint *</label>
              <div className="flex items-center gap-2">
                <select
                  value={rule.constraintType}
                  onChange={(e) => onUpdate({ constraintType: e.target.value as RuleConstraintType })}
                  className="border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-800 focus:border-cyan-400 focus:outline-none transition-colors bg-white flex-1"
                >
                  <option value="HARD">HARD</option>
                  <option value="SOFT">SOFT</option>
                </select>
                <button className="p-1.5 text-navy-300 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
                <label className="flex items-center gap-1.5 text-xs text-navy-500">
                  <span>Usar valor estático</span>
                  <div className="w-8 h-4 bg-cyan-400 rounded-full relative cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Streaming condition */}
        {rule.streamingCondition && (
          <StreamingCondition condition={rule.streamingCondition} />
        )}
      </div>
    </div>
  )
}
