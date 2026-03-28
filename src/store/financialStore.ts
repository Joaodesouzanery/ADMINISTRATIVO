import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, PayrollEntry, ProductKey } from '../types'
import * as cdFin from '../data/construdata/financial'
import * as irisFin from '../data/iris/financial'

const uid = () => Math.random().toString(36).slice(2, 9)

interface FinancialState {
  transactions: Record<ProductKey, Transaction[]>
  payroll: Record<ProductKey, PayrollEntry[]>
  addTransaction: (t: Omit<Transaction, 'id'>, p: ProductKey) => void
  updateTransaction: (id: string, patch: Partial<Transaction>, p: ProductKey) => void
  deleteTransaction: (id: string, p: ProductKey) => void
  updatePayroll: (id: string, patch: Partial<PayrollEntry>, p: ProductKey) => void
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      transactions: { construdata: cdFin.transactions, iris: irisFin.transactions },
      payroll: { construdata: cdFin.payroll, iris: irisFin.payroll },

      addTransaction: (t, p) => set((s) => ({ transactions: { ...s.transactions, [p]: [...s.transactions[p], { ...t, id: uid() }] } })),
      updateTransaction: (id, patch, p) => set((s) => ({ transactions: { ...s.transactions, [p]: s.transactions[p].map((t) => t.id === id ? { ...t, ...patch } : t) } })),
      deleteTransaction: (id, p) => set((s) => ({ transactions: { ...s.transactions, [p]: s.transactions[p].filter((t) => t.id !== id) } })),
      updatePayroll: (id, patch, p) => set((s) => ({ payroll: { ...s.payroll, [p]: s.payroll[p].map((e) => e.id === id ? { ...e, ...patch } : e) } })),
    }),
    { name: 'atlantico-financial' }
  )
)
