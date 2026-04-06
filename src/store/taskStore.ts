import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KanbanCard, KanbanColumn, Goal, Routine, ChecklistItem, Task, PlanningGoal, ProductKey } from '../types'
import { insertToSupabase, updateInSupabase, deleteFromSupabase } from '../lib/supabaseSync'
import * as cdTasks from '../data/construdata/tasks'
import * as irisTasks from '../data/iris/tasks'

interface TaskState {
  columns: Record<ProductKey, KanbanColumn[]>
  cards: Record<ProductKey, KanbanCard[]>
  goals: Record<ProductKey, Goal[]>
  routines: Record<ProductKey, Routine[]>
  tasks: Record<ProductKey, Task[]>
  planningGoals: Record<ProductKey, PlanningGoal[]>

  moveCard: (cardId: string, targetColumnId: string, product: ProductKey) => void
  addCard: (card: Omit<KanbanCard, 'id' | 'createdAt'>, product: ProductKey) => void
  updateCard: (id: string, patch: Partial<KanbanCard>, product: ProductKey) => void
  deleteCard: (id: string, product: ProductKey) => void

  addGoal: (goal: Omit<Goal, 'id'>, product: ProductKey) => void
  updateGoal: (id: string, patch: Partial<Goal>, product: ProductKey) => void
  deleteGoal: (id: string, product: ProductKey) => void

  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>, product: ProductKey) => void
  updateRoutine: (id: string, patch: Partial<Routine>, product: ProductKey) => void
  deleteRoutine: (id: string, product: ProductKey) => void
  toggleChecklistItem: (routineId: string, itemId: string, product: ProductKey) => void
  addChecklistItem: (routineId: string, label: string, product: ProductKey) => void
  deleteChecklistItem: (routineId: string, itemId: string, product: ProductKey) => void

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>, product: ProductKey) => void
  updateTask: (id: string, patch: Partial<Task>, product: ProductKey) => void
  deleteTask: (id: string, product: ProductKey) => void
  toggleTaskCompleted: (id: string, product: ProductKey) => void

  addPlanningGoal: (goal: Omit<PlanningGoal, 'id' | 'createdAt'>, product: ProductKey) => void
  updatePlanningGoal: (id: string, patch: Partial<PlanningGoal>, product: ProductKey) => void
  deletePlanningGoal: (id: string, product: ProductKey) => void
}

const uid = () => Math.random().toString(36).slice(2, 9)
const defaultRoutines: Routine[] = []

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      columns: { construdata: cdTasks.columns, iris: irisTasks.columns, padrao: [], faculdade: [] },
      cards: { construdata: cdTasks.cards, iris: irisTasks.cards, padrao: [], faculdade: [] },
      goals: { construdata: cdTasks.goals, iris: irisTasks.goals, padrao: [], faculdade: [] },
      routines: { construdata: defaultRoutines, iris: defaultRoutines, padrao: [], faculdade: [] },
      tasks: { construdata: [], iris: [], padrao: [], faculdade: [] },
      planningGoals: { construdata: [], iris: [], padrao: [], faculdade: [] },

      // ─── Cards ──────────────────────────────────────────────────────
      moveCard: (cardId, targetColumnId, product) => {
        set((s) => ({
          cards: { ...s.cards, [product]: s.cards[product].map((c) => c.id === cardId ? { ...c, columnId: targetColumnId } : c) },
        }))
        updateInSupabase('kanban_cards', cardId, { columnId: targetColumnId })
      },

      addCard: (card, product) => {
        const newCard = { ...card, id: uid(), createdAt: new Date().toISOString() }
        set((s) => ({ cards: { ...s.cards, [product]: [...s.cards[product], newCard] } }))
        insertToSupabase('kanban_cards', newCard, product)
      },

      updateCard: (id, patch, product) => {
        set((s) => ({ cards: { ...s.cards, [product]: s.cards[product].map((c) => c.id === id ? { ...c, ...patch } : c) } }))
        updateInSupabase('kanban_cards', id, patch)
      },

      deleteCard: (id, product) => {
        set((s) => ({ cards: { ...s.cards, [product]: s.cards[product].filter((c) => c.id !== id) } }))
        deleteFromSupabase('kanban_cards', id)
      },

      // ─── Goals ──────────────────────────────────────────────────────
      addGoal: (goal, product) => {
        const newGoal = { ...goal, id: uid() }
        set((s) => ({ goals: { ...s.goals, [product]: [...s.goals[product], newGoal] } }))
        insertToSupabase('goals', newGoal, product)
      },

      updateGoal: (id, patch, product) => {
        set((s) => ({ goals: { ...s.goals, [product]: s.goals[product].map((g) => g.id === id ? { ...g, ...patch } : g) } }))
        updateInSupabase('goals', id, patch)
      },

      deleteGoal: (id, product) => {
        set((s) => ({ goals: { ...s.goals, [product]: s.goals[product].filter((g) => g.id !== id) } }))
        deleteFromSupabase('goals', id)
      },

      // ─── Routines ───────────────────────────────────────────────────
      addRoutine: (routine, product) => {
        const newRoutine = { ...routine, id: uid(), createdAt: new Date().toISOString() }
        set((s) => ({ routines: { ...s.routines, [product]: [...s.routines[product], newRoutine] } }))
        insertToSupabase('routines', newRoutine, product)
      },

      updateRoutine: (id, patch, product) => {
        set((s) => ({ routines: { ...s.routines, [product]: s.routines[product].map((r) => r.id === id ? { ...r, ...patch } : r) } }))
        updateInSupabase('routines', id, patch)
      },

      deleteRoutine: (id, product) => {
        set((s) => ({ routines: { ...s.routines, [product]: s.routines[product].filter((r) => r.id !== id) } }))
        deleteFromSupabase('routines', id)
      },

      toggleChecklistItem: (routineId, itemId, product) =>
        set((s) => {
          const newRoutines = s.routines[product].map((r) =>
            r.id === routineId
              ? { ...r, items: r.items.map((item: ChecklistItem) => item.id === itemId ? { ...item, done: !item.done } : item) }
              : r
          )
          const updated = newRoutines.find((r) => r.id === routineId)
          if (updated) updateInSupabase('routines', routineId, { items: updated.items })
          return { routines: { ...s.routines, [product]: newRoutines } }
        }),

      addChecklistItem: (routineId, label, product) =>
        set((s) => {
          const newRoutines = s.routines[product].map((r) =>
            r.id === routineId ? { ...r, items: [...r.items, { id: uid(), label, done: false }] } : r
          )
          const updated = newRoutines.find((r) => r.id === routineId)
          if (updated) updateInSupabase('routines', routineId, { items: updated.items })
          return { routines: { ...s.routines, [product]: newRoutines } }
        }),

      deleteChecklistItem: (routineId, itemId, product) =>
        set((s) => {
          const newRoutines = s.routines[product].map((r) =>
            r.id === routineId ? { ...r, items: r.items.filter((item: ChecklistItem) => item.id !== itemId) } : r
          )
          const updated = newRoutines.find((r) => r.id === routineId)
          if (updated) updateInSupabase('routines', routineId, { items: updated.items })
          return { routines: { ...s.routines, [product]: newRoutines } }
        }),

      // ─── Tasks ──────────────────────────────────────────────────────
      addTask: (task, product) => {
        const newTask = { ...task, id: uid(), completed: false, createdAt: new Date().toISOString() }
        set((s) => ({ tasks: { ...s.tasks, [product]: [...s.tasks[product], newTask] } }))
        insertToSupabase('tasks', newTask, product)
      },

      updateTask: (id, patch, product) => {
        set((s) => ({ tasks: { ...s.tasks, [product]: s.tasks[product].map((t) => t.id === id ? { ...t, ...patch } : t) } }))
        updateInSupabase('tasks', id, patch)
      },

      deleteTask: (id, product) => {
        set((s) => ({ tasks: { ...s.tasks, [product]: s.tasks[product].filter((t) => t.id !== id) } }))
        deleteFromSupabase('tasks', id)
      },

      toggleTaskCompleted: (id, product) =>
        set((s) => {
          const newTasks = s.tasks[product].map((t) =>
            t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } : t
          )
          const updated = newTasks.find((t) => t.id === id)
          if (updated) updateInSupabase('tasks', id, { completed: updated.completed, completedAt: updated.completedAt })
          return { tasks: { ...s.tasks, [product]: newTasks } }
        }),

      // ─── Planning Goals ─────────────────────────────────────────────
      addPlanningGoal: (goal, product) => {
        const newGoal = { ...goal, id: uid(), createdAt: new Date().toISOString() }
        set((s) => ({ planningGoals: { ...s.planningGoals, [product]: [...s.planningGoals[product], newGoal] } }))
        insertToSupabase('planning_goals', newGoal, product)
      },

      updatePlanningGoal: (id, patch, product) => {
        set((s) => ({ planningGoals: { ...s.planningGoals, [product]: s.planningGoals[product].map((g) => g.id === id ? { ...g, ...patch } : g) } }))
        updateInSupabase('planning_goals', id, patch)
      },

      deletePlanningGoal: (id, product) => {
        set((s) => ({ planningGoals: { ...s.planningGoals, [product]: s.planningGoals[product].filter((g) => g.id !== id) } }))
        deleteFromSupabase('planning_goals', id)
      },
    }),
    { name: 'atlantico-tasks' }
  )
)
