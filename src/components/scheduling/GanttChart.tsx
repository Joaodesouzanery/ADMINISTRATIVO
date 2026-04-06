import { useMemo } from 'react'
import type { ScheduleTask, ScheduleResource, ScheduleOperator } from '../../types'

interface GanttChartProps {
  tasks: ScheduleTask[]
  resources: ScheduleResource[]
  operators: ScheduleOperator[]
}

function formatDate(d: Date) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function formatHour(d: Date) {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function GanttChart({ tasks, resources, operators }: GanttChartProps) {
  const { minDate, maxDate, totalHours, days } = useMemo(() => {
    if (tasks.length === 0) return { minDate: new Date(), maxDate: new Date(), totalHours: 1, days: [] }
    const starts = tasks.map((t) => new Date(t.startDate).getTime())
    const ends = tasks.map((t) => new Date(t.endDate).getTime())
    const min = new Date(Math.min(...starts))
    const max = new Date(Math.max(...ends))
    const hours = Math.max(1, (max.getTime() - min.getTime()) / (1000 * 60 * 60))
    const dayList: Date[] = []
    const d = new Date(min)
    d.setHours(0, 0, 0, 0)
    while (d <= max) {
      dayList.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    return { minDate: min, maxDate: max, totalHours: hours, days: dayList }
  }, [tasks])

  const getPosition = (dateStr: string) => {
    const t = new Date(dateStr).getTime()
    return ((t - minDate.getTime()) / (totalHours * 3600000)) * 100
  }

  const getWidth = (start: string, end: string) => {
    return getPosition(end) - getPosition(start)
  }

  const operatorMap = useMemo(() => {
    const map: Record<string, ScheduleOperator> = {}
    operators.forEach((op) => { map[op.id] = op })
    return map
  }, [operators])

  return (
    <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
      {/* Header with time scale */}
      <div className="flex border-b border-navy-100">
        <div className="w-40 shrink-0 bg-navy-50 px-3 py-2 text-xs font-semibold text-navy-600 border-r border-navy-100">
          Recurso
        </div>
        <div className="flex-1 relative" style={{ minWidth: '800px' }}>
          <div className="flex">
            {days.map((day, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[10px] font-medium text-navy-500 py-1 border-r border-navy-50"
              >
                {formatDate(day)}
              </div>
            ))}
          </div>
          <div className="flex border-t border-navy-50">
            {days.map((day, i) => (
              <div key={i} className="flex-1 flex">
                {[0, 6, 12, 18].map((h) => {
                  const d = new Date(day)
                  d.setHours(h)
                  return (
                    <div key={h} className="flex-1 text-center text-[9px] text-navy-300 py-0.5 border-r border-navy-50/50">
                      {formatHour(d)}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rows */}
      {resources.map((resource) => {
        const resourceTasks = tasks
          .filter((t) => t.resourceId === resource.id)
          .sort((a, b) => a.order - b.order)

        return (
          <div key={resource.id} className="flex border-b border-navy-50 hover:bg-surface-secondary/50 transition-colors group">
            <div className="w-40 shrink-0 px-3 py-3 border-r border-navy-100 flex items-start">
              <div>
                <p className="text-sm font-medium text-navy-800 truncate">{resource.name}</p>
                <p className="text-[10px] text-navy-400">{resource.location}</p>
              </div>
            </div>
            <div className="flex-1 relative py-2" style={{ minWidth: '800px', minHeight: '70px' }}>
              {resourceTasks.map((task) => {
                const left = getPosition(task.startDate)
                const width = getWidth(task.startDate, task.endDate)
                const taskOps = task.operatorIds.map((id) => operatorMap[id]).filter(Boolean)

                return (
                  <div
                    key={task.id}
                    className="absolute top-1 flex flex-col gap-0.5 cursor-pointer group/task"
                    style={{
                      left: `${left}%`,
                      width: `${Math.max(width, 1.5)}%`,
                    }}
                    title={`${task.label} (${task.phase})`}
                  >
                    <div
                      className="rounded px-1.5 py-1 text-[10px] font-medium text-white truncate shadow-sm hover:shadow-md transition-shadow"
                      style={{ backgroundColor: task.color }}
                    >
                      {task.label}
                    </div>
                    <div className="flex flex-wrap gap-0.5">
                      {taskOps.slice(0, 3).map((op) => (
                        <span
                          key={op.id}
                          className="text-[8px] px-1 py-0.5 rounded text-white font-medium truncate max-w-[60px]"
                          style={{ backgroundColor: op.color }}
                          title={op.name}
                        >
                          {op.name.split(' ')[0]}
                        </span>
                      ))}
                      {taskOps.length > 3 && (
                        <span className="text-[8px] px-1 py-0.5 rounded bg-navy-200 text-navy-600">
                          +{taskOps.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
