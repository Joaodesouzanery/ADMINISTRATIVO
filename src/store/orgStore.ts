import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OrgNode, ProductKey } from '../types'
import { insertToSupabase, updateInSupabase, deleteFromSupabase } from '../lib/supabaseSync'

const uid = () => Math.random().toString(36).slice(2, 9)

interface OrgState {
  nodes: Record<ProductKey, OrgNode[]>
  addNode: (node: Omit<OrgNode, 'id' | 'createdAt'>, product: ProductKey) => void
  updateNode: (id: string, patch: Partial<OrgNode>, product: ProductKey) => void
  deleteNode: (id: string, product: ProductKey) => void
  moveNode: (id: string, newParentId: string | null, product: ProductKey) => void
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      nodes: { construdata: [], iris: [] },

      addNode: (node, product) => {
        const n = { ...node, id: uid(), createdAt: new Date().toISOString() }
        set((s) => ({ nodes: { ...s.nodes, [product]: [...s.nodes[product], n] } }))
        insertToSupabase('org_nodes', n, product)
      },

      updateNode: (id, patch, product) => {
        set((s) => ({ nodes: { ...s.nodes, [product]: s.nodes[product].map((n) => n.id === id ? { ...n, ...patch } : n) } }))
        updateInSupabase('org_nodes', id, patch)
      },

      deleteNode: (id, product) =>
        set((s) => {
          const toDelete = new Set<string>()
          const findDescendants = (parentId: string) => {
            toDelete.add(parentId)
            s.nodes[product].filter((n) => n.parentId === parentId).forEach((n) => findDescendants(n.id))
          }
          findDescendants(id)
          // Delete all from Supabase (cascade handles children, but be safe)
          toDelete.forEach((nodeId) => deleteFromSupabase('org_nodes', nodeId))
          return { nodes: { ...s.nodes, [product]: s.nodes[product].filter((n) => !toDelete.has(n.id)) } }
        }),

      moveNode: (id, newParentId, product) => {
        set((s) => ({ nodes: { ...s.nodes, [product]: s.nodes[product].map((n) => n.id === id ? { ...n, parentId: newParentId } : n) } }))
        updateInSupabase('org_nodes', id, { parentId: newParentId })
      },
    }),
    { name: 'atlantico-org' }
  )
)
