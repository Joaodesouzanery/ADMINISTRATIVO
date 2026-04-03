import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification, ProductKey } from '../types'

const uid = () => Math.random().toString(36).slice(2, 9)

interface NotificationState {
  notifications: Record<ProductKey, Notification[]>
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>, product: ProductKey) => void
  markAsRead: (id: string, product: ProductKey) => void
  markAllAsRead: (product: ProductKey) => void
  deleteNotification: (id: string, product: ProductKey) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: { construdata: [], iris: [], padrao: [] },

      addNotification: (n, product) =>
        set((s) => ({
          notifications: {
            ...s.notifications,
            [product]: [
              { ...n, id: uid(), read: false, createdAt: new Date().toISOString() },
              ...s.notifications[product],
            ].slice(0, 50), // keep last 50
          },
        })),

      markAsRead: (id, product) =>
        set((s) => ({
          notifications: {
            ...s.notifications,
            [product]: s.notifications[product].map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          },
        })),

      markAllAsRead: (product) =>
        set((s) => ({
          notifications: {
            ...s.notifications,
            [product]: s.notifications[product].map((n) => ({ ...n, read: true })),
          },
        })),

      deleteNotification: (id, product) =>
        set((s) => ({
          notifications: {
            ...s.notifications,
            [product]: s.notifications[product].filter((n) => n.id !== id),
          },
        })),
    }),
    { name: 'atlantico-notifications' }
  )
)
