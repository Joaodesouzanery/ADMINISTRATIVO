import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Document, ProductKey } from '../types'
import { insertToSupabase, updateInSupabase, deleteFromSupabase } from '../lib/supabaseSync'

const uid = () => Math.random().toString(36).slice(2, 9)
const emptyByProduct = <T,>(): Record<ProductKey, T[]> => ({ construdata: [], iris: [], padrao: [], faculdade: [] })

interface DocumentState {
  documents: Record<ProductKey, Document[]>
  addDocument: (d: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, p: ProductKey) => void
  updateDocument: (id: string, patch: Partial<Document>, p: ProductKey) => void
  deleteDocument: (id: string, p: ProductKey) => void
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: emptyByProduct<Document>(),

      addDocument: (d, p) => {
        const n = { ...d, id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        set((s) => ({ documents: { ...s.documents, [p]: [...s.documents[p], n] } }))
        insertToSupabase('documents', n, p)
      },

      updateDocument: (id, patch, p) => {
        const patchWithDate = { ...patch, updatedAt: new Date().toISOString() }
        set((s) => ({ documents: { ...s.documents, [p]: s.documents[p].map((d) => d.id === id ? { ...d, ...patchWithDate } : d) } }))
        updateInSupabase('documents', id, patchWithDate)
      },

      deleteDocument: (id, p) => {
        set((s) => ({ documents: { ...s.documents, [p]: s.documents[p].filter((d) => d.id !== id) } }))
        deleteFromSupabase('documents', id)
      },
    }),
    { name: 'atlantico-documents-v2' }
  )
)
