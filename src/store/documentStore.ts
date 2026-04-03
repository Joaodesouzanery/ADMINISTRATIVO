import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Document, ProductKey } from '../types'
import * as cdDocs from '../data/construdata/documents'
import * as irisDocs from '../data/iris/documents'

const uid = () => Math.random().toString(36).slice(2, 9)

interface DocumentState {
  documents: Record<ProductKey, Document[]>
  addDocument: (d: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, p: ProductKey) => void
  updateDocument: (id: string, patch: Partial<Document>, p: ProductKey) => void
  deleteDocument: (id: string, p: ProductKey) => void
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: { construdata: cdDocs.documents, iris: irisDocs.documents, padrao: [] },

      addDocument: (d, p) => set((s) => ({
        documents: {
          ...s.documents,
          [p]: [...s.documents[p], { ...d, id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
        },
      })),

      updateDocument: (id, patch, p) => set((s) => ({
        documents: {
          ...s.documents,
          [p]: s.documents[p].map((d) => d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d),
        },
      })),

      deleteDocument: (id, p) => set((s) => ({
        documents: { ...s.documents, [p]: s.documents[p].filter((d) => d.id !== id) },
      })),
    }),
    { name: 'atlantico-documents' }
  )
)
