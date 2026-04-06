import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { insertToSupabase, updateInSupabase, deleteFromSupabase } from '../lib/supabaseSync'

const uid = () => Math.random().toString(36).slice(2, 9)

export interface Materia {
  id: string
  nome: string
  professor?: string
  horario?: string
  sala?: string
  cor: string
  notas?: string
  createdAt: string
}

export interface AtividadeAcademica {
  id: string
  materiaId: string
  titulo: string
  tipo: 'prova' | 'trabalho' | 'lista' | 'seminario' | 'outro'
  descricao?: string
  dataEntrega: string
  concluida: boolean
  concluidaEm?: string
  nota?: number
  peso?: number
  alertaDiasAntes?: number
  createdAt: string
}

interface FaculdadeState {
  materias: Materia[]
  atividades: AtividadeAcademica[]

  addMateria: (m: Omit<Materia, 'id' | 'createdAt'>) => void
  updateMateria: (id: string, patch: Partial<Materia>) => void
  deleteMateria: (id: string) => void

  addAtividade: (a: Omit<AtividadeAcademica, 'id' | 'createdAt' | 'concluida'>) => void
  updateAtividade: (id: string, patch: Partial<AtividadeAcademica>) => void
  deleteAtividade: (id: string) => void
  toggleAtividade: (id: string) => void
}

const CORES = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#6366F1', '#14B8A6']

export const useFaculdadeStore = create<FaculdadeState>()(
  persist(
    (set) => ({
      materias: [],
      atividades: [],

      addMateria: (m) => {
        const n = { ...m, id: uid(), cor: m.cor || CORES[Math.floor(Math.random() * CORES.length)], createdAt: new Date().toISOString() }
        set((s) => ({ materias: [...s.materias, n] }))
        insertToSupabase('faculdade_materias', n, 'faculdade')
      },
      updateMateria: (id, patch) => {
        set((s) => ({ materias: s.materias.map((m) => m.id === id ? { ...m, ...patch } : m) }))
        updateInSupabase('faculdade_materias', id, patch)
      },
      deleteMateria: (id) => {
        set((s) => ({
          materias: s.materias.filter((m) => m.id !== id),
          atividades: s.atividades.filter((a) => a.materiaId !== id),
        }))
        deleteFromSupabase('faculdade_materias', id)
      },

      addAtividade: (a) => {
        const n = { ...a, id: uid(), concluida: false, createdAt: new Date().toISOString() }
        set((s) => ({ atividades: [...s.atividades, n] }))
        insertToSupabase('faculdade_atividades', n, 'faculdade')
      },
      updateAtividade: (id, patch) => {
        set((s) => ({ atividades: s.atividades.map((a) => a.id === id ? { ...a, ...patch } : a) }))
        updateInSupabase('faculdade_atividades', id, patch)
      },
      deleteAtividade: (id) => {
        set((s) => ({ atividades: s.atividades.filter((a) => a.id !== id) }))
        deleteFromSupabase('faculdade_atividades', id)
      },
      toggleAtividade: (id) =>
        set((s) => {
          const updated = s.atividades.map((a) =>
            a.id === id ? { ...a, concluida: !a.concluida, concluidaEm: !a.concluida ? new Date().toISOString() : undefined } : a
          )
          const item = updated.find((a) => a.id === id)
          if (item) updateInSupabase('faculdade_atividades', id, { concluida: item.concluida, concluidaEm: item.concluidaEm })
          return { atividades: updated }
        }),
    }),
    { name: 'atlantico-faculdade-v2' }
  )
)
