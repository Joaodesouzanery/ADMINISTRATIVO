import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification, ProductKey } from '../types'
import { insertToSupabase, updateInSupabase, deleteFromSupabase } from '../lib/supabaseSync'

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
      notifications: { construdata: [], iris: [] },

      addNotification: (n, product) => {
        const newN = { ...n, id: uid(), read: false, createdAt: new Date().toISOString() }
        set((s) => ({
          notifications: {
            ...s.notifications,
            [product]: [newN, ...s.notifications[product]].slice(0, 50),
          },
        }))
        insertToSupabase('notifications', newN, product)
      },

      markAsRead: (id, product) => {
        set((s) => ({
          notifications: { ...s.notifications, [product]: s.notifications[product].map((n) => n.id === id ? { ...n, read: true } : n) },
        }))
        updateInSupabase('notifications', id, { read: true })
      },

      markAllAsRead: (product) =>
        set((s) => {
          s.notifications[product].forEach((n) => { if (!n.read) updateInSupabase('notifications', n.id, { read: true }) })
          return { notifications: { ...s.notifications, [product]: s.notifications[product].map((n) => ({ ...n, read: true })) } }
        }),

      deleteNotification: (id, product) => {
        set((s) => ({ notifications: { ...s.notifications, [product]: s.notifications[product].filter((n) => n.id !== id) } }))
        deleteFromSupabase('notifications', id)
      },
    }),
    { name: 'atlantico-notifications' }
  )
)
