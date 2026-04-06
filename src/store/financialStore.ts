import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, PayrollEntry, FinancialOKR, OKRKeyResult, ProductKey } from '../types'
import { insertToSupabase, updateInSupabase, deleteFromSupabase } from '../lib/supabaseSync'
import * as cdFin from '../data/construdata/financial'
import * as irisFin from '../data/iris/financial'

const uid = () => Math.random().toString(36).slice(2, 9)

interface FinancialState {
  transactions: Record<ProductKey, Transaction[]>
  payroll: Record<ProductKey, PayrollEntry[]>
  okrs: Record<ProductKey, FinancialOKR[]>
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>, p: ProductKey) => void
  updateTransaction: (id: string, patch: Partial<Transaction>, p: ProductKey) => void
  deleteTransaction: (id: string, p: ProductKey) => void
  updatePayroll: (id: string, patch: Partial<PayrollEntry>, p: ProductKey) => void
  addOKR: (okr: Omit<FinancialOKR, 'id'>, p: ProductKey) => void
  updateOKR: (id: string, patch: Partial<FinancialOKR>, p: ProductKey) => void
  deleteOKR: (id: string, p: ProductKey) => void
  updateKeyResult: (okrId: string, krId: string, patch: Partial<OKRKeyResult>, p: ProductKey) => void
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      transactions: { construdata: cdFin.transactions, iris: irisFin.transactions, padrao: [], faculdade: [] },
      payroll: { construdata: cdFin.payroll, iris: irisFin.payroll, padrao: [], faculdade: [] },
      okrs: { construdata: cdFin.okrs, iris: irisFin.okrs, padrao: [], faculdade: [] },

      addTransaction: (t, p) => {
        const n = { ...t, id: uid(), createdAt: new Date().toISOString() }
        set((s) => ({ transactions: { ...s.transactions, [p]: [...s.transactions[p], n] } }))
        insertToSupabase('transactions', n, p)
      },
      updateTransaction: (id, patch, p) => {
        set((s) => ({ transactions: { ...s.transactions, [p]: s.transactions[p].map((t) => t.id === id ? { ...t, ...patch } : t) } }))
        updateInSupabase('transactions', id, patch)
      },
      deleteTransaction: (id, p) => {
        set((s) => ({ transactions: { ...s.transactions, [p]: s.transactions[p].filter((t) => t.id !== id) } }))
        deleteFromSupabase('transactions', id)
      },

      updatePayroll: (id, patch, p) => {
        set((s) => ({ payroll: { ...s.payroll, [p]: s.payroll[p].map((e) => e.id === id ? { ...e, ...patch } : e) } }))
        updateInSupabase('payroll', id, patch)
      },

      addOKR: (okr, p) => {
        const n = { ...okr, id: uid() }
        set((s) => ({ okrs: { ...s.okrs, [p]: [...s.okrs[p], n] } }))
        insertToSupabase('financial_okrs', n, p)
      },
      updateOKR: (id, patch, p) => {
        set((s) => ({ okrs: { ...s.okrs, [p]: s.okrs[p].map((o) => o.id === id ? { ...o, ...patch } : o) } }))
        updateInSupabase('financial_okrs', id, patch)
      },
      deleteOKR: (id, p) => {
        set((s) => ({ okrs: { ...s.okrs, [p]: s.okrs[p].filter((o) => o.id !== id) } }))
        deleteFromSupabase('financial_okrs', id)
      },

      updateKeyResult: (okrId, krId, patch, p) =>
        set((s) => {
          const newOkrs = s.okrs[p].map((o) =>
            o.id === okrId ? { ...o, keyResults: o.keyResults.map((kr) => kr.id === krId ? { ...kr, ...patch } : kr) } : o
          )
          const updated = newOkrs.find((o) => o.id === okrId)
          if (updated) updateInSupabase('financial_okrs', okrId, { keyResults: updated.keyResults })
          return { okrs: { ...s.okrs, [p]: newOkrs } }
        }),
    }),
    { name: 'atlantico-financial' }
  )
)
