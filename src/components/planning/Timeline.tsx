import type { PlanningGoal, PlanningHorizon } from '../../types'

const horizonColor: Record<PlanningHorizon, string> = {
  short: '#64D4E8',
  medium: '#F59E0B',
  long: '#7DD4A8',
}

const horizonLabel: Record<PlanningHorizon, string> = {
  short: 'Curto',
  medium: 'Médio',
  long: 'Longo',
}

interface TimelineProps {
  goals: PlanningGoal[]
}

export function Timeline({ goals }: TimelineProps) {
  if (goals.length === 0) return null

  const allDates = goals.flatMap((g) => [new Date(g.startDate).getTime(), new Date(g.endDate).getTime()])
  const minDate = Math.min(...allDates)
  const maxDate = Math.max(...allDates)
  const range = maxDate - minDate || 1

  // Generate month labels
  const months: { label: string; left: number }[] = []
  const start = new Date(minDate)
  start.setDate(1)
  const end = new Date(maxDate)
  while (start <= end) {
    const pos = ((start.getTime() - minDate) / range) * 100
    if (pos >= 0 && pos <= 100) {
      months.push({
        label: start.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        left: pos,
      })
    }
    start.setMonth(start.getMonth() + 1)
  }

  return (
    <div className="bg-white rounded-xl border border-cyan-100/50 shadow-card p-4 mt-4">
      <h3 className="text-sm font-semibold text-navy-800 mb-4">Linha do Tempo</h3>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        {(['short', 'medium', 'long'] as PlanningHorizon[]).map((h) => (
          <div key={h} className="flex items-center gap-1.5 text-xs text-navy-500">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: horizonColor[h] }} />
            {horizonLabel[h]} prazo
          </div>
        ))}
      </div>

      {/* Timeline area */}
      <div className="relative">
        {/* Month labels */}
        <div className="relative h-6 border-b border-navy-100 mb-2">
          {months.map((m, i) => (
            <span
              key={i}
              className="absolute text-[10px] text-navy-400 -translate-x-1/2"
              style={{ left: `${m.left}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="space-y-2">
          {goals.map((goal) => {
            const startPct = ((new Date(goal.startDate).getTime() - minDate) / range) * 100
            const endPct = ((new Date(goal.endDate).getTime() - minDate) / range) * 100
            const width = Math.max(endPct - startPct, 2)

            return (
              <div key={goal.id} className="relative h-8 group">
                <div
                  className="absolute h-7 rounded-md flex items-center px-2 overflow-hidden transition-opacity"
                  style={{
                    left: `${startPct}%`,
                    width: `${width}%`,
                    backgroundColor: horizonColor[goal.horizon],
                    opacity: goal.status === 'completed' ? 0.5 : 0.85,
                  }}
                >
                  <span className="text-[11px] font-medium text-white truncate drop-shadow-sm">
                    {goal.title}
                  </span>
                </div>
                {/* Tooltip on hover */}
                <div className="absolute hidden group-hover:block bg-navy-800 text-white text-xs rounded-lg px-3 py-2 z-10 -top-10 whitespace-nowrap shadow-lg" style={{ left: `${startPct}%` }}>
                  {goal.title} — {new Date(goal.startDate).toLocaleDateString('pt-BR')} a {new Date(goal.endDate).toLocaleDateString('pt-BR')}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
