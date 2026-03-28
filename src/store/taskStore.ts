import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KanbanCard, KanbanColumn, Goal, ProductKey } from '../types'
import * as cdTasks from '../data/construdata/tasks'
import * as irisTasks from '../data/iris/tasks'

interface TaskState {
  columns: Record<ProductKey, KanbanColumn[]>
  cards: Record<ProductKey, KanbanCard[]>
  goals: Record<ProductKey, Goal[]>
  moveCard: (cardId: string, targetColumnId: string, product: ProductKey) => void
  addCard: (card: Omit<KanbanCard, 'id' | 'createdAt'>, product: ProductKey) => void
  updateCard: (id: string, patch: Partial<KanbanCard>, product: ProductKey) => void
  deleteCard: (id: string, product: ProductKey) => void
  addGoal: (goal: Omit<Goal, 'id'>, product: ProductKey) => void
  updateGoal: (id: string, patch: Partial<Goal>, product: ProductKey) => void
  deleteGoal: (id: string, product: ProductKey) => void
}

const uid = () => Math.random().toString(36).slice(2, 9)

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      columns: { construdata: cdTasks.columns, iris: irisTasks.columns },
      cards: { construdata: cdTasks.cards, iris: irisTasks.cards },
      goals: { construdata: cdTasks.goals, iris: irisTasks.goals },

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
          cards: {
            ...s.cards,
            [product]: s.cards[product].filter((c) => c.id !== id),
          },
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
    }),
    { name: 'atlantico-tasks' }
  )
)
