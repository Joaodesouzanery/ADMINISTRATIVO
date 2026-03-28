import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KanbanCard, KanbanColumn, Goal, Routine, ChecklistItem, ProductKey } from '../types'
import * as cdTasks from '../data/construdata/tasks'
import * as irisTasks from '../data/iris/tasks'

interface TaskState {
  columns: Record<ProductKey, KanbanColumn[]>
  cards: Record<ProductKey, KanbanCard[]>
  goals: Record<ProductKey, Goal[]>
  routines: Record<ProductKey, Routine[]>

  // Cards
  moveCard: (cardId: string, targetColumnId: string, product: ProductKey) => void
  addCard: (card: Omit<KanbanCard, 'id' | 'createdAt'>, product: ProductKey) => void
  updateCard: (id: string, patch: Partial<KanbanCard>, product: ProductKey) => void
  deleteCard: (id: string, product: ProductKey) => void

  // Goals
  addGoal: (goal: Omit<Goal, 'id'>, product: ProductKey) => void
  updateGoal: (id: string, patch: Partial<Goal>, product: ProductKey) => void
  deleteGoal: (id: string, product: ProductKey) => void

  // Routines
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>, product: ProductKey) => void
  updateRoutine: (id: string, patch: Partial<Routine>, product: ProductKey) => void
  deleteRoutine: (id: string, product: ProductKey) => void
  toggleChecklistItem: (routineId: string, itemId: string, product: ProductKey) => void
  addChecklistItem: (routineId: string, label: string, product: ProductKey) => void
  deleteChecklistItem: (routineId: string, itemId: string, product: ProductKey) => void
}

const uid = () => Math.random().toString(36).slice(2, 9)

const defaultRoutines: Routine[] = []

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      columns: { construdata: cdTasks.columns, iris: irisTasks.columns },
      cards: { construdata: cdTasks.cards, iris: irisTasks.cards },
      goals: { construdata: cdTasks.goals, iris: irisTasks.goals },
      routines: { construdata: defaultRoutines, iris: defaultRoutines },

      moveCard: (cardId, targetColumnId, product) =>
        set((s) => ({
          cards: {
            ...s.cards,
            [product]: s.cards[product].map((c) =>
              c.id === cardId ? { ...c, columnId: targetColumnId } : c
            ),
          },
        })),

      addCard: (card, product) =>
        set((s) => ({
          cards: {
            ...s.cards,
            [product]: [...s.cards[product], { ...card, id: uid(), createdAt: new Date().toISOString() }],
          },
        })),

      updateCard: (id, patch, product) =>
        set((s) => ({
          cards: {
            ...s.cards,
            [product]: s.cards[product].map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        })),

      deleteCard: (id, product) =>
        set((s) => ({
          cards: { ...s.cards, [product]: s.cards[product].filter((c) => c.id !== id) },
        })),

      addGoal: (goal, product) =>
        set((s) => ({
          goals: { ...s.goals, [product]: [...s.goals[product], { ...goal, id: uid() }] },
        })),

      updateGoal: (id, patch, product) =>
        set((s) => ({
          goals: {
            ...s.goals,
            [product]: s.goals[product].map((g) => (g.id === id ? { ...g, ...patch } : g)),
          },
        })),

      deleteGoal: (id, product) =>
        set((s) => ({
          goals: { ...s.goals, [product]: s.goals[product].filter((g) => g.id !== id) },
        })),

      addRoutine: (routine, product) =>
        set((s) => ({
          routines: {
            ...s.routines,
            [product]: [...s.routines[product], { ...routine, id: uid(), createdAt: new Date().toISOString() }],
          },
        })),

      updateRoutine: (id, patch, product) =>
        set((s) => ({
          routines: {
            ...s.routines,
            [product]: s.routines[product].map((r) => r.id === id ? { ...r, ...patch } : r),
          },
        })),

      deleteRoutine: (id, product) =>
        set((s) => ({
          routines: { ...s.routines, [product]: s.routines[product].filter((r) => r.id !== id) },
        })),

      toggleChecklistItem: (routineId, itemId, product) =>
        set((s) => ({
          routines: {
            ...s.routines,
            [product]: s.routines[product].map((r) =>
              r.id === routineId
                ? { ...r, items: r.items.map((item: ChecklistItem) => item.id === itemId ? { ...item, done: !item.done } : item) }
                : r
            ),
          },
        })),

      addChecklistItem: (routineId, label, product) =>
        set((s) => ({
          routines: {
            ...s.routines,
            [product]: s.routines[product].map((r) =>
              r.id === routineId
                ? { ...r, items: [...r.items, { id: uid(), label, done: false }] }
                : r
            ),
          },
        })),

      deleteChecklistItem: (routineId, itemId, product) =>
        set((s) => ({
          routines: {
            ...s.routines,
            [product]: s.routines[product].map((r) =>
              r.id === routineId
                ? { ...r, items: r.items.filter((item: ChecklistItem) => item.id !== itemId) }
                : r
            ),
          },
        })),
    }),
    { name: 'atlantico-tasks' }
  )
)
