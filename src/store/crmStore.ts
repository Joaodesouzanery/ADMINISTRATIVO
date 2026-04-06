import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Client, Deal, Contact, ContactPipelineStage, ProductKey } from '../types'
import { insertToSupabase, updateInSupabase, deleteFromSupabase } from '../lib/supabaseSync'
import * as cdCrm from '../data/construdata/crm'
import * as irisCrm from '../data/iris/crm'

const uid = () => Math.random().toString(36).slice(2, 9)

interface CRMState {
  clients: Record<ProductKey, Client[]>
  deals: Record<ProductKey, Deal[]>
  contacts: Record<ProductKey, Contact[]>
  addClient: (c: Omit<Client, 'id' | 'createdAt'>, p: ProductKey) => void
  updateClient: (id: string, patch: Partial<Client>, p: ProductKey) => void
  deleteClient: (id: string, p: ProductKey) => void
  addDeal: (d: Omit<Deal, 'id' | 'createdAt'>, p: ProductKey) => void
  updateDeal: (id: string, patch: Partial<Deal>, p: ProductKey) => void
  deleteDeal: (id: string, p: ProductKey) => void
  addContact: (c: Omit<Contact, 'id' | 'createdAt'>, p: ProductKey) => void
  updateContact: (id: string, patch: Partial<Contact>, p: ProductKey) => void
  deleteContact: (id: string, p: ProductKey) => void
  moveContactStage: (id: string, stage: ContactPipelineStage, p: ProductKey) => void
}

export const useCRMStore = create<CRMState>()(
  persist(
    (set) => ({
      clients: { construdata: cdCrm.clients, iris: irisCrm.clients },
      deals: { construdata: cdCrm.deals, iris: irisCrm.deals },
      contacts: { construdata: [], iris: [] },

      addClient: (c, p) => { const n = { ...c, id: uid(), createdAt: new Date().toISOString() }; set((s) => ({ clients: { ...s.clients, [p]: [...s.clients[p], n] } })); insertToSupabase('clients', n, p) },
      updateClient: (id, patch, p) => { set((s) => ({ clients: { ...s.clients, [p]: s.clients[p].map((c) => c.id === id ? { ...c, ...patch } : c) } })); updateInSupabase('clients', id, patch) },
      deleteClient: (id, p) => { set((s) => ({ clients: { ...s.clients, [p]: s.clients[p].filter((c) => c.id !== id) } })); deleteFromSupabase('clients', id) },

      addDeal: (d, p) => { const n = { ...d, id: uid(), createdAt: new Date().toISOString() }; set((s) => ({ deals: { ...s.deals, [p]: [...s.deals[p], n] } })); insertToSupabase('deals', n, p) },
      updateDeal: (id, patch, p) => { set((s) => ({ deals: { ...s.deals, [p]: s.deals[p].map((d) => d.id === id ? { ...d, ...patch } : d) } })); updateInSupabase('deals', id, patch) },
      deleteDeal: (id, p) => { set((s) => ({ deals: { ...s.deals, [p]: s.deals[p].filter((d) => d.id !== id) } })); deleteFromSupabase('deals', id) },

      addContact: (c, p) => { const n = { ...c, id: uid(), createdAt: new Date().toISOString() }; set((s) => ({ contacts: { ...s.contacts, [p]: [...s.contacts[p], n] } })); insertToSupabase('contacts', n, p) },
      updateContact: (id, patch, p) => { set((s) => ({ contacts: { ...s.contacts, [p]: s.contacts[p].map((c) => c.id === id ? { ...c, ...patch } : c) } })); updateInSupabase('contacts', id, patch) },
      deleteContact: (id, p) => { set((s) => ({ contacts: { ...s.contacts, [p]: s.contacts[p].filter((c) => c.id !== id) } })); deleteFromSupabase('contacts', id) },
      moveContactStage: (id, stage, p) => { set((s) => ({ contacts: { ...s.contacts, [p]: s.contacts[p].map((c) => c.id === id ? { ...c, pipelineStage: stage } : c) } })); updateInSupabase('contacts', id, { pipelineStage: stage }) },
    }),
    { name: 'atlantico-crm' }
  )
)
