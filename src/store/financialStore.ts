import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, PayrollEntry, FinancialOKR, OKRKeyResult, ProductKey } from '../types'
import * as cdFin from '../data/construdata/financial'
import * as irisFin from '../data/iris/financial'

const uid = () => Math.random().toString(36).slice(2, 9)

interface FinancialState {
  transactions: Record<ProductKey, Transaction[]>
  payroll: Record<ProductKey, PayrollEntry[]>
  okrs: Record<ProductKey, FinancialOKR[]>

  // Transactions
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>, p: ProductKey) => void
  updateTransaction: (id: string, patch: Partial<Transaction>, p: ProductKey) => void
  deleteTransaction: (id: string, p: ProductKey) => void

  // Payroll
  updatePayroll: (id: string, patch: Partial<PayrollEntry>, p: ProductKey) => void

  // OKRs
  addOKR: (okr: Omit<FinancialOKR, 'id'>, p: ProductKey) => void
  updateOKR: (id: string, patch: Partial<FinancialOKR>, p: ProductKey) => void
  deleteOKR: (id: string, p: ProductKey) => void
  updateKeyResult: (okrId: string, krId: string, patch: Partial<OKRKeyResult>, p: ProductKey) => void
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      transactions: { construdata: cdFin.transactions, iris: irisFin.transactions },
      payroll: { construdata: cdFin.payroll, iris: irisFin.payroll },
      okrs: { construdata: cdFin.okrs, iris: irisFin.okrs },

      addTransaction: (t, p) => set((s) => ({
        transactions: {
          ...s.transactions,
          [p]: [...s.transactions[p], { ...t, id: uid(), createdAt: new Date().toISOString() }],
        },
      })),

      updateTransaction: (id, patch, p) => set((s) => ({
        transactions: {
          ...s.transactions,
          [p]: s.transactions[p].map((t) => t.id === id ? { ...t, ...patch } : t),
        },
      })),

      deleteTransaction: (id, p) => set((s) => ({
        transactions: { ...s.transactions, [p]: s.transactions[p].filter((t) => t.id !== id) },
      })),

      updatePayroll: (id, patch, p) => set((s) => ({
        payroll: {
          ...s.payroll,
          [p]: s.payroll[p].map((e) => e.id === id ? { ...e, ...patch } : e),
        },
      })),

      addOKR: (okr, p) => set((s) => ({
        okrs: { ...s.okrs, [p]: [...s.okrs[p], { ...okr, id: uid() }] },
      })),

      updateOKR: (id, patch, p) => set((s) => ({
        okrs: {
          ...s.okrs,
          [p]: s.okrs[p].map((o) => o.id === id ? { ...o, ...patch } : o),
        },
      })),

      deleteOKR: (id, p) => set((s) => ({
        okrs: { ...s.okrs, [p]: s.okrs[p].filter((o) => o.id !== id) },
      })),

      updateKeyResult: (okrId, krId, patch, p) => set((s) => ({
        okrs: {
          ...s.okrs,
          [p]: s.okrs[p].map((o) =>
            o.id === okrId
              ? { ...o, keyResults: o.keyResults.map((kr) => kr.id === krId ? { ...kr, ...patch } : kr) }
              : o
          ),
        },
      })),
    }),
    { name: 'atlantico-financial' }
  )
)
