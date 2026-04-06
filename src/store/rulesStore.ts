import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Rule, Alert, RuleProposal, RuleConstraintType } from '../types'

interface RulesState {
  rules: Rule[]
  activeRuleId: string | null
  alerts: Alert[]
  proposals: RuleProposal[]
  setActiveRule: (id: string | null) => void
  addRule: (rule: Rule) => void
  updateRule: (id: string, updates: Partial<Rule>) => void
  removeRule: (id: string) => void
  toggleConstraint: (id: string, type: RuleConstraintType) => void
  resolveAlert: (id: string, resolution: string) => void
  addAlert: (alert: Alert) => void
  addProposal: (proposal: RuleProposal) => void
  updateProposalStatus: (id: string, status: RuleProposal['status'], reviewer?: string) => void
}

export const useRulesStore = create<RulesState>()(
  persist(
    (set) => ({
      rules: [],
      activeRuleId: null,
      alerts: [],
      proposals: [],

      setActiveRule: (id) => set({ activeRuleId: id }),

      addRule: (rule) =>
        set((s) => ({ rules: [...s.rules, rule] })),

      updateRule: (id, updates) =>
        set((s) => ({
          rules: s.rules.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)),
        })),

      removeRule: (id) =>
        set((s) => ({
          rules: s.rules.filter((r) => r.id !== id),
          activeRuleId: s.activeRuleId === id ? s.rules[0]?.id ?? null : s.activeRuleId,
        })),

      toggleConstraint: (id, type) =>
        set((s) => ({
          rules: s.rules.map((r) => (r.id === id ? { ...r, constraintType: type } : r)),
        })),

      resolveAlert: (id, resolution) =>
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === id
              ? { ...a, resolved: true, resolvedAt: new Date().toISOString(), resolution }
              : a
          ),
        })),

      addAlert: (alert) =>
        set((s) => ({ alerts: [...s.alerts, alert] })),

      addProposal: (proposal) =>
        set((s) => ({ proposals: [...s.proposals, proposal] })),

      updateProposalStatus: (id, status, reviewer) =>
        set((s) => ({
          proposals: s.proposals.map((p) =>
            p.id === id
              ? { ...p, status, reviewedAt: new Date().toISOString(), reviewer }
              : p
          ),
        })),
    }),
    { name: 'atlantico-rules-v2' }
  )
)
