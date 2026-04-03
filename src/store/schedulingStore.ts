import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ScheduleScenario } from '../types'
import { initialScenarios } from '../data/padrao/scheduling'

interface SchedulingState {
  scenarios: ScheduleScenario[]
  activeScenarioId: string
  setActiveScenario: (id: string) => void
  addScenario: (scenario: ScheduleScenario) => void
  removeScenario: (id: string) => void
  updateTask: (scenarioId: string, taskId: string, updates: Partial<ScheduleScenario['tasks'][0]>) => void
  reorderTask: (scenarioId: string, taskId: string, newOrder: number) => void
}

export const useSchedulingStore = create<SchedulingState>()(
  persist(
    (set) => ({
      scenarios: initialScenarios,
      activeScenarioId: 'scenario-1',

      setActiveScenario: (id) => set({ activeScenarioId: id }),

      addScenario: (scenario) =>
        set((s) => ({ scenarios: [...s.scenarios, scenario] })),

      removeScenario: (id) =>
        set((s) => ({
          scenarios: s.scenarios.filter((sc) => sc.id !== id),
          activeScenarioId: s.activeScenarioId === id ? s.scenarios[0]?.id ?? '' : s.activeScenarioId,
        })),

      updateTask: (scenarioId, taskId, updates) =>
        set((s) => ({
          scenarios: s.scenarios.map((sc) =>
            sc.id === scenarioId
              ? {
                  ...sc,
                  tasks: sc.tasks.map((t) =>
                    t.id === taskId ? { ...t, ...updates } : t
                  ),
                }
              : sc
          ),
        })),

      reorderTask: (scenarioId, taskId, newOrder) =>
        set((s) => ({
          scenarios: s.scenarios.map((sc) =>
            sc.id === scenarioId
              ? {
                  ...sc,
                  tasks: sc.tasks.map((t) =>
                    t.id === taskId ? { ...t, order: newOrder } : t
                  ),
                }
              : sc
          ),
        })),
    }),
    { name: 'atlantico-scheduling' }
  )
)
