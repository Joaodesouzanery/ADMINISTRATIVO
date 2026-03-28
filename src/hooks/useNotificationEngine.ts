import { useEffect, useRef } from 'react'
import { useTaskStore } from '../store/taskStore'
import { useNotificationStore } from '../store/notificationStore'
import type { ProductKey } from '../types'

export function useNotificationEngine(product: ProductKey) {
  const tasks = useTaskStore((s) => s.tasks[product])
  const planningGoals = useTaskStore((s) => s.planningGoals[product])
  const notifications = useNotificationStore((s) => s.notifications[product])
  const addNotification = useNotificationStore((s) => s.addNotification)
  const checkedRef = useRef(new Set<string>())

  useEffect(() => {
    function check() {
      const now = new Date()
      const existingRefs = new Set(notifications.map((n) => n.referenceId))

      // Check tasks with alerts
      tasks.forEach((task) => {
        if (task.completed || !task.alertDaysBefore || !task.completionDate) return
        const key = `task-${task.id}`
        if (existingRefs.has(key) || checkedRef.current.has(key)) return

        const due = new Date(task.completionDate)
        const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntil <= task.alertDaysBefore && daysUntil >= 0) {
          checkedRef.current.add(key)
          addNotification(
            {
              type: 'task_deadline',
              title: `Tarefa próxima do prazo`,
              message: `"${task.title}" vence em ${daysUntil === 0 ? 'hoje' : `${daysUntil} dia${daysUntil > 1 ? 's' : ''}`}.`,
              referenceId: key,
            },
            product
          )
        }
      })

      // Check planning goals near endDate
      planningGoals.forEach((goal) => {
        if (goal.status === 'completed' || goal.status === 'cancelled') return
        const key = `plan-${goal.id}`
        if (existingRefs.has(key) || checkedRef.current.has(key)) return

        const due = new Date(goal.endDate)
        const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntil <= 7 && daysUntil >= 0) {
          checkedRef.current.add(key)
          addNotification(
            {
              type: 'planning_deadline',
              title: `Meta de planejamento próxima`,
              message: `"${goal.title}" termina em ${daysUntil === 0 ? 'hoje' : `${daysUntil} dia${daysUntil > 1 ? 's' : ''}`}.`,
              referenceId: key,
            },
            product
          )
        }
      })
    }

    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [tasks, planningGoals, notifications, addNotification, product])
}
