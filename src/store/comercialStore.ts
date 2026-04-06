import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ComercialContact, ComercialStage, ProductKey } from '../types'
import { insertToSupabase, updateInSupabase, deleteFromSupabase } from '../lib/supabaseSync'

const uid = () => Math.random().toString(36).slice(2, 9)

interface ComercialState {
  contacts: Record<ProductKey, ComercialContact[]>
  addContact: (c: Omit<ComercialContact, 'id' | 'createdAt'>, p: ProductKey) => void
  updateContact: (id: string, patch: Partial<ComercialContact>, p: ProductKey) => void
  deleteContact: (id: string, p: ProductKey) => void
  moveStage: (id: string, stage: ComercialStage, p: ProductKey) => void
}

export const useComercialStore = create<ComercialState>()(
  persist(
    (set) => ({
      contacts: { construdata: [], iris: [], padrao: [], faculdade: [] },

      addContact: (c, p) => {
        const n = { ...c, id: uid(), createdAt: new Date().toISOString() }
        set((s) => ({ contacts: { ...s.contacts, [p]: [...s.contacts[p], n] } }))
        insertToSupabase('comercial_contacts', n, p)
      },

      updateContact: (id, patch, p) => {
        set((s) => ({
          contacts: {
            ...s.contacts,
            [p]: s.contacts[p].map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        }))
        updateInSupabase('comercial_contacts', id, patch)
      },

      deleteContact: (id, p) => {
        set((s) => ({
          contacts: { ...s.contacts, [p]: s.contacts[p].filter((c) => c.id !== id) },
        }))
        deleteFromSupabase('comercial_contacts', id)
      },

      moveStage: (id, stage, p) => {
        set((s) => ({
          contacts: {
            ...s.contacts,
            [p]: s.contacts[p].map((c) => (c.id === id ? { ...c, stage } : c)),
          },
        }))
        updateInSupabase('comercial_contacts', id, { stage })
      },
    }),
    { name: 'atlantico-comercial' }
  )
)
