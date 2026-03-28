import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Client, Deal, ProductKey } from '../types'
import * as cdCrm from '../data/construdata/crm'
import * as irisCrm from '../data/iris/crm'

const uid = () => Math.random().toString(36).slice(2, 9)

interface CRMState {
  clients: Record<ProductKey, Client[]>
  deals: Record<ProductKey, Deal[]>
  addClient: (c: Omit<Client, 'id' | 'createdAt'>, p: ProductKey) => void
  updateClient: (id: string, patch: Partial<Client>, p: ProductKey) => void
  deleteClient: (id: string, p: ProductKey) => void
  addDeal: (d: Omit<Deal, 'id' | 'createdAt'>, p: ProductKey) => void
  updateDeal: (id: string, patch: Partial<Deal>, p: ProductKey) => void
  deleteDeal: (id: string, p: ProductKey) => void
}

export const useCRMStore = create<CRMState>()(
  persist(
    (set) => ({
      clients: { construdata: cdCrm.clients, iris: irisCrm.clients },
      deals: { construdata: cdCrm.deals, iris: irisCrm.deals },

      addClient: (c, p) => set((s) => ({ clients: { ...s.clients, [p]: [...s.clients[p], { ...c, id: uid(), createdAt: new Date().toISOString() }] } })),
      updateClient: (id, patch, p) => set((s) => ({ clients: { ...s.clients, [p]: s.clients[p].map((c) => c.id === id ? { ...c, ...patch } : c) } })),
      deleteClient: (id, p) => set((s) => ({ clients: { ...s.clients, [p]: s.clients[p].filter((c) => c.id !== id) } })),

      addDeal: (d, p) => set((s) => ({ deals: { ...s.deals, [p]: [...s.deals[p], { ...d, id: uid(), createdAt: new Date().toISOString() }] } })),
      updateDeal: (id, patch, p) => set((s) => ({ deals: { ...s.deals, [p]: s.deals[p].map((d) => d.id === id ? { ...d, ...patch } : d) } })),
      deleteDeal: (id, p) => set((s) => ({ deals: { ...s.deals, [p]: s.deals[p].filter((d) => d.id !== id) } })),
    }),
    { name: 'atlantico-crm' }
  )
)
