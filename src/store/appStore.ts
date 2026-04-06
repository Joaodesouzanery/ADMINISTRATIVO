import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductKey } from '../config/products'

interface AppState {
  activeProduct: ProductKey | null
  sidebarOpen: boolean
  syncError: string | null
  lastSyncAt: string | null
  setActiveProduct: (p: ProductKey) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSyncError: (msg: string | null) => void
  setLastSyncAt: (iso: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeProduct: null,
      sidebarOpen: true,
      syncError: null,
      lastSyncAt: null,
      setActiveProduct: (p) => set({ activeProduct: p }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSyncError: (msg) => set({ syncError: msg }),
      setLastSyncAt: (iso) => set({ lastSyncAt: iso }),
    }),
    { name: 'atlantico-app', partialize: (s) => ({ activeProduct: s.activeProduct, sidebarOpen: s.sidebarOpen }) }
  )
)
