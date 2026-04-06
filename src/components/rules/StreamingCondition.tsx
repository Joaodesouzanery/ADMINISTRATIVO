import { useMemo } from 'react'
import { X, Eye } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea, ResponsiveContainer } from 'recharts'
import type { StreamingConditionConfig } from '../../types'
import { FormulaEditor } from './FormulaEditor'

interface StreamingConditionProps {
  condition: StreamingConditionConfig
  onRemove?: () => void
}

export function StreamingCondition({ condition, onRemove }: StreamingConditionProps) {
  const chartData = useMemo(() => {
    const data = []
    const baseDate = new Date('2025-01-15')
    for (let i = 0; i < 60; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)
      const val = Math.sin(i * 0.3) * 8 + Math.random() * 4 - 2
      data.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: parseFloat(val.toFixed(2)),
        threshold: 5,
      })
    }
    return data
  }, [])

  const triggeredRanges = useMemo(() => {
    const ranges: { start: number; end: number }[] = []
    let startIdx: number | null = null
    chartData.forEach((d, i) => {
      if (d.value > 5) {
        if (startIdx === null) startIdx = i
      } else {
        if (startIdx !== null) {
          ranges.push({ start: startIdx, end: i - 1 })
          startIdx = null
        }
      }
    })
    if (startIdx !== null) ranges.push({ start: startIdx, end: chartData.length - 1 })
    return ranges
  }, [chartData])

  return (
    <div className="border border-navy-100 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-navy-50 border-b border-navy-100">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">⚡ Condição de Streaming</span>
          <span className="text-navy-300">▾</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-[11px] text-cyan-600 hover:text-cyan-700 font-medium bg-cyan-50 px-2.5 py-1 rounded-lg transition-colors">
            <Eye size={12} />
            Visualizar intervalos de trigger
          </button>
          {onRemove && (
            <button onClick={onRemove} className="p-1 text-navy-300 hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Type selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-navy-600">USANDO</label>
          <div className="bg-white border border-navy-200 rounded-lg px-3 py-1.5 text-sm text-navy-700 flex items-center gap-1">
            {condition.type === 'formula_threshold' ? 'Limiar de fórmula' :
             condition.type === 'anomaly_detection' ? 'Detecção de anomalia' :
             'Correspondência de padrão'}
            <span className="text-navy-300 ml-1">▾</span>
          </div>
        </div>

        {/* Formula editor */}
        <FormulaEditor
          formula={condition.formula}
          isValid={condition.isValid}
          variables={condition.variables}
        />

        {/* Trigger / Recover */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-navy-600 mb-1 block">ACIONAR USANDO</label>
            <div className="bg-white border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-700 flex items-center gap-2">
              <span className="text-green-500">●</span>
              {condition.triggerAction}
              <span className="text-navy-300 ml-auto">▾</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-600 mb-1 block">RECUPERAR USANDO</label>
            <div className="bg-white border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-700 flex items-center gap-2">
              <span className="text-blue-500">●</span>
              {condition.recoverAction}
              <span className="text-navy-300 ml-auto">▾</span>
            </div>
          </div>
        </div>

        {/* Chart preview */}
        <div className="bg-navy-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-400 rounded-sm" />
                <span className="text-[10px] text-navy-500">fx {condition.variables[0]?.name ?? 'valor'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-400 rounded-sm" />
                <span className="text-[10px] text-navy-500">Intervalos acionados</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EBF3" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#9AAAC8" interval={9} />
              <YAxis tick={{ fontSize: 9 }} stroke="#9AAAC8" />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #C5CCDF' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <ReferenceLine y={5} stroke="#EF4444" strokeDasharray="5 5" label={{ value: '5.0', position: 'left', fontSize: 9 }} />
              {triggeredRanges.map((range, i) => (
                <ReferenceArea
                  key={i}
                  x1={chartData[range.start]?.date}
                  x2={chartData[range.end]?.date}
                  fill="#EF4444"
                  fillOpacity={0.15}
                />
              ))}
              <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
