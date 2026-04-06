import { useEffect, useRef } from 'react'
import { isSupabaseEnabled } from '../lib/supabase'
import { fetchFromSupabase } from '../lib/supabaseSync'
import { useTaskStore } from '../store/taskStore'
import { useCRMStore } from '../store/crmStore'
import { useFinancialStore } from '../store/financialStore'
import { useDocumentStore } from '../store/documentStore'
import { useNotificationStore } from '../store/notificationStore'
import { useOrgStore } from '../store/orgStore'
import { useComercialStore } from '../store/comercialStore'
import { useFaculdadeStore, type Materia, type AtividadeAcademica } from '../store/faculdadeStore'
import type {
  ProductKey,
  KanbanCard,
  KanbanColumn,
  Goal,
  Routine,
  Task,
  PlanningGoal,
  Client,
  Deal,
  Contact,
  Transaction,
  PayrollEntry,
  FinancialOKR,
  Document,
  Notification,
  OrgNode,
  ComercialContact,
} from '../types'

/**
 * Loads ALL data from Supabase into Zustand stores on app startup.
 *
 * Behavior:
 * - Runs ONCE per product (tracked by a module-level Set) so navigating
 *   between products syncs each one the first time it mounts, while avoiding
 *   redundant fetches on tab switches within the same product.
 * - ALWAYS writes the fetched array to the store, even if empty — Supabase
 *   is the source of truth. localStorage is just an offline cache that can
 *   go stale.
 * - Faculdade data is fetched once per session (the module has no product
 *   discriminator — it's a single personal workspace).
 *
 * Called from `ProductLayout` which mounts whenever the user enters
 * `/construdata`, `/iris`, `/padrao`, or `/faculdade`.
 */

// Module-level tracking so a full page refresh re-syncs but tab switches
// within the same SPA session don't hammer the DB repeatedly.
const loadedProducts = new Set<ProductKey>()
let loadedFaculdade = false

export function useSupabaseSync(product: ProductKey) {
  // `tick` is here only to force the effect to re-run during hot reload
  // without relying on the stale Set from the previous module instance.
  const tick = useRef(0)

  useEffect(() => {
    if (!isSupabaseEnabled()) return
    if (loadedProducts.has(product)) return
    loadedProducts.add(product)
    tick.current++

    let cancelled = false

    async function loadAll() {
      console.log(`[supabase] Loading data for ${product}...`)

      // ─── Per-product tables ─────────────────────────────────────────
      const [
        cards,
        columns,
        goals,
        routines,
        tasks,
        planningGoals,
      ] = await Promise.all([
        fetchFromSupabase<KanbanCard>('kanban_cards', product),
        fetchFromSupabase<KanbanColumn>('kanban_columns', product),
        fetchFromSupabase<Goal>('goals', product),
        fetchFromSupabase<Routine>('routines', product),
        fetchFromSupabase<Task>('tasks', product),
        fetchFromSupabase<PlanningGoal>('planning_goals', product),
      ])
      if (cancelled) return

      // ALWAYS overwrite — no length guards. Supabase is source of truth.
      const taskState = useTaskStore.getState()
      useTaskStore.setState({
        cards: { ...taskState.cards, [product]: cards },
        columns: { ...taskState.columns, [product]: columns },
        goals: { ...taskState.goals, [product]: goals },
        routines: { ...taskState.routines, [product]: routines },
        tasks: { ...taskState.tasks, [product]: tasks },
        planningGoals: { ...taskState.planningGoals, [product]: planningGoals },
      })

      const [clients, deals, crmContacts] = await Promise.all([
        fetchFromSupabase<Client>('clients', product),
        fetchFromSupabase<Deal>('deals', product),
        fetchFromSupabase<Contact>('contacts', product),
      ])
      if (cancelled) return
      const crmState = useCRMStore.getState()
      useCRMStore.setState({
        clients: { ...crmState.clients, [product]: clients },
        deals: { ...crmState.deals, [product]: deals },
        contacts: { ...crmState.contacts, [product]: crmContacts },
      })

      const [transactions, payroll, okrs] = await Promise.all([
        fetchFromSupabase<Transaction>('transactions', product),
        fetchFromSupabase<PayrollEntry>('payroll', product),
        fetchFromSupabase<FinancialOKR>('financial_okrs', product),
      ])
      if (cancelled) return
      const finState = useFinancialStore.getState()
      useFinancialStore.setState({
        transactions: { ...finState.transactions, [product]: transactions },
        payroll: { ...finState.payroll, [product]: payroll },
        okrs: { ...finState.okrs, [product]: okrs },
      })

      const docs = await fetchFromSupabase<Document>('documents', product)
      if (cancelled) return
      const docState = useDocumentStore.getState()
      useDocumentStore.setState({
        documents: { ...docState.documents, [product]: docs },
      })

      const notifications = await fetchFromSupabase<Notification>('notifications', product)
      if (cancelled) return
      const notifState = useNotificationStore.getState()
      useNotificationStore.setState({
        notifications: { ...notifState.notifications, [product]: notifications },
      })

      const orgNodes = await fetchFromSupabase<OrgNode>('org_nodes', product)
      if (cancelled) return
      const orgState = useOrgStore.getState()
      useOrgStore.setState({
        nodes: { ...orgState.nodes, [product]: orgNodes },
      })

      // Comercial — when on Padrão, load contacts from ALL products so the
      // combined pipeline has everything. Otherwise just the current product.
      const productsForComercial: ProductKey[] =
        product === 'padrao' ? ['construdata', 'iris', 'padrao'] : [product]
      const comercialResults = await Promise.all(
        productsForComercial.map((p) => fetchFromSupabase<ComercialContact>('comercial_contacts', p))
      )
      if (cancelled) return
      const comState = useComercialStore.getState()
      const newComContacts = { ...comState.contacts }
      productsForComercial.forEach((p, i) => {
        newComContacts[p] = comercialResults[i]
      })
      useComercialStore.setState({ contacts: newComContacts })

      // ─── Faculdade (single workspace, not per-product) ──────────────
      // Only fetch once per session — first time any ProductLayout mounts.
      if (!loadedFaculdade) {
        loadedFaculdade = true
        const [materias, atividades] = await Promise.all([
          fetchFromSupabase<Materia>('faculdade_materias', 'faculdade'),
          fetchFromSupabase<AtividadeAcademica>('faculdade_atividades', 'faculdade'),
        ])
        if (cancelled) return
        useFaculdadeStore.setState({ materias, atividades })
      }

      console.log(`[supabase] Data loaded for ${product}`)
    }

    loadAll()

    return () => {
      cancelled = true
    }
  }, [product])
}
