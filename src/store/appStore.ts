import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductKey } from '../config/products'

interface AppState {
  activeProduct: ProductKey | null
  sidebarOpen: boolean
  setActiveProduct: (p: ProductKey) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeProduct: null,
      sidebarOpen: true,
      setActiveProduct: (p) => set({ activeProduct: p }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    { name: 'atlantico-app', partialize: (s) => ({ activeProduct: s.activeProduct, sidebarOpen: s.sidebarOpen }) }
  )
)
