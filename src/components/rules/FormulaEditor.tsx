import { CheckCircle2, AlertCircle, Plus } from 'lucide-react'

interface FormulaEditorProps {
  formula: string
  isValid: boolean
  variables: { name: string; value: string }[]
  onFormulaChange?: (formula: string) => void
}

export function FormulaEditor({ formula, isValid, variables, onFormulaChange }: FormulaEditorProps) {
  return (
    <div className="space-y-3">
      {/* Formula input */}
      <div>
        <label className="block text-xs font-medium text-navy-600 mb-1">CONDIÇÕES</label>
        <textarea
          value={formula}
          onChange={(e) => onFormulaChange?.(e.target.value)}
          className="w-full bg-navy-50 border border-navy-200 rounded-lg px-3 py-2.5 text-sm font-mono text-navy-800 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
          rows={3}
          placeholder="$variável > valor"
        />
        <div className="flex items-center gap-1.5 mt-1.5">
          {isValid ? (
            <>
              <CheckCircle2 size={12} className="text-green-500" />
              <span className="text-[11px] text-green-600 font-medium">Condições válidas</span>
            </>
          ) : (
            <>
              <AlertCircle size={12} className="text-red-500" />
              <span className="text-[11px] text-red-600 font-medium">Condições inválidas</span>
            </>
          )}
          <button className="ml-auto text-[11px] bg-navy-100 text-navy-600 hover:bg-navy-200 px-2 py-0.5 rounded transition-colors">
            Confirmar
          </button>
        </div>
      </div>

      {/* Variables */}
      <div>
        <label className="block text-xs font-medium text-navy-600 mb-1.5">VARIÁVEIS</label>
        {variables.map((v, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2 py-1 rounded">
              ${v.name}
            </span>
            <span className="text-[10px] text-navy-400">=</span>
            <span className="text-xs text-navy-600 bg-navy-50 px-2 py-1 rounded border border-navy-100">
              {v.value}
            </span>
          </div>
        ))}
        <button className="flex items-center gap-1 text-xs text-navy-400 hover:text-cyan-500 transition-colors">
          <Plus size={12} />
          Adicionar variável
        </button>
      </div>
    </div>
  )
}
