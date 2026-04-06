import { useMemo } from 'react'
import type { ScheduleTask, ScheduleResource, ScheduleOperator } from '../../types'
import { Info } from 'lucide-react'

interface ScheduleGridProps {
  tasks: ScheduleTask[]
  resources: ScheduleResource[]
  operators: ScheduleOperator[]
}

export function ScheduleGrid({ tasks, resources, operators }: ScheduleGridProps) {
  const operatorMap = useMemo(() => {
    const map: Record<string, ScheduleOperator> = {}
    operators.forEach((op) => { map[op.id] = op })
    return map
  }, [operators])

  const { days } = useMemo(() => {
    if (tasks.length === 0) return { days: [] }
    const starts = tasks.map((t) => new Date(t.startDate).getTime())
    const ends = tasks.map((t) => new Date(t.endDate).getTime())
    const min = new Date(Math.min(...starts))
    const max = new Date(Math.max(...ends))
    const dayList: string[] = []
    const d = new Date(min)
    d.setHours(0, 0, 0, 0)
    while (d <= max) {
      dayList.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }))
      d.setDate(d.getDate() + 1)
    }
    return { days: dayList }
  }, [tasks])

  return (
    <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
      <div className="px-4 py-2 bg-navy-50 border-b border-navy-100 flex items-center gap-2">
        <span className="text-xs font-semibold text-navy-600">Permitido</span>
        <span className="bg-navy-200 text-navy-600 text-[10px] font-bold px-1.5 py-0.5 rounded">{resources.length}</span>
      </div>

      {resources.map((resource) => {
        const resourceTasks = tasks
          .filter((t) => t.resourceId === resource.id)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

        return (
          <div key={resource.id} className="border-b border-navy-50">
            <div className="flex items-start gap-3 px-4 py-3">
              <div className="flex items-center gap-1.5 shrink-0 pt-1">
                <Info size={12} className="text-navy-300" />
                <span className="text-sm font-medium text-navy-800">{resource.name}</span>
              </div>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {resourceTasks.map((task) => {
                  const taskOps = task.operatorIds.map((id) => operatorMap[id]).filter(Boolean)
                  return (
                    <div key={task.id} className="flex flex-col gap-1">
                      <div
                        className="rounded px-2 py-1.5 text-xs font-medium text-white shadow-sm min-w-[80px]"
                        style={{ backgroundColor: task.color }}
                      >
                        {task.label}
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {taskOps.map((op) => (
                          <span
                            key={op.id}
                            className="text-[9px] px-1.5 py-0.5 rounded border font-medium truncate"
                            style={{
                              borderColor: op.color,
                              color: op.color,
                              backgroundColor: `${op.color}10`,
                            }}
                          >
                            {op.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}

      {/* Timeline footer */}
      <div className="px-4 py-2 bg-navy-50 border-t border-navy-100">
        <div className="flex gap-4">
          {days.map((day, i) => (
            <span key={i} className="text-[10px] text-navy-400 font-medium">{day}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
