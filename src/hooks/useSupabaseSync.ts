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
import type { ProductKey, KanbanCard, KanbanColumn, Goal, Routine, Task, PlanningGoal, Client, Deal, Contact, Transaction, PayrollEntry, FinancialOKR, Document, Notification, OrgNode, ComercialContact } from '../types'

/**
 * Loads all data from Supabase into Zustand stores on app startup.
 * Called once per product layout mount.
 * Zustand persist (localStorage) acts as offline cache;
 * Supabase is the source of truth when available.
 */
export function useSupabaseSync(product: ProductKey) {
  const loaded = useRef(false)

  useEffect(() => {
    if (!isSupabaseEnabled() || loaded.current) return
    loaded.current = true

    async function loadAll() {
      console.log(`[supabase] Loading data for ${product}...`)

      // Task store
      const [cards, columns, goals, routines, tasks, planningGoals] = await Promise.all([
        fetchFromSupabase<KanbanCard>('kanban_cards', product),
        fetchFromSupabase<KanbanColumn>('kanban_columns', product),
        fetchFromSupabase<Goal>('goals', product),
        fetchFromSupabase<Routine>('routines', product),
        fetchFromSupabase<Task>('tasks', product),
        fetchFromSupabase<PlanningGoal>('planning_goals', product),
      ])

      const taskStore = useTaskStore.getState()
      if (cards.length > 0) useTaskStore.setState({ cards: { ...taskStore.cards, [product]: cards } })
      if (columns.length > 0) useTaskStore.setState({ columns: { ...taskStore.columns, [product]: columns } })
      if (goals.length > 0) useTaskStore.setState({ goals: { ...taskStore.goals, [product]: goals } })
      if (routines.length > 0) useTaskStore.setState({ routines: { ...taskStore.routines, [product]: routines } })
      if (tasks.length > 0) useTaskStore.setState({ tasks: { ...taskStore.tasks, [product]: tasks } })
      if (planningGoals.length > 0) useTaskStore.setState({ planningGoals: { ...taskStore.planningGoals, [product]: planningGoals } })

      // CRM store
      const [clients, deals, contacts] = await Promise.all([
        fetchFromSupabase<Client>('clients', product),
        fetchFromSupabase<Deal>('deals', product),
        fetchFromSupabase<Contact>('contacts', product),
      ])

      const crmStore = useCRMStore.getState()
      if (clients.length > 0) useCRMStore.setState({ clients: { ...crmStore.clients, [product]: clients } })
      if (deals.length > 0) useCRMStore.setState({ deals: { ...crmStore.deals, [product]: deals } })
      if (contacts.length > 0) useCRMStore.setState({ contacts: { ...crmStore.contacts, [product]: contacts } })

      // Financial store
      const [transactions, payroll, okrs] = await Promise.all([
        fetchFromSupabase<Transaction>('transactions', product),
        fetchFromSupabase<PayrollEntry>('payroll', product),
        fetchFromSupabase<FinancialOKR>('financial_okrs', product),
      ])

      const finStore = useFinancialStore.getState()
      if (transactions.length > 0) useFinancialStore.setState({ transactions: { ...finStore.transactions, [product]: transactions } })
      if (payroll.length > 0) useFinancialStore.setState({ payroll: { ...finStore.payroll, [product]: payroll } })
      if (okrs.length > 0) useFinancialStore.setState({ okrs: { ...finStore.okrs, [product]: okrs } })

      // Document store
      const docs = await fetchFromSupabase<Document>('documents', product)
      if (docs.length > 0) {
        const docStore = useDocumentStore.getState()
        useDocumentStore.setState({ documents: { ...docStore.documents, [product]: docs } })
      }

      // Notification store
      const notifications = await fetchFromSupabase<Notification>('notifications', product)
      if (notifications.length > 0) {
        const notifStore = useNotificationStore.getState()
        useNotificationStore.setState({ notifications: { ...notifStore.notifications, [product]: notifications } })
      }

      // Org store
      const orgNodes = await fetchFromSupabase<OrgNode>('org_nodes', product)
      if (orgNodes.length > 0) {
        const orgStore = useOrgStore.getState()
        useOrgStore.setState({ nodes: { ...orgStore.nodes, [product]: orgNodes } })
      }

      // Comercial store — for Padrão, load contacts from all three products
      // so the combined pipeline has the full picture
      const productsToLoadComercial: ProductKey[] = product === 'padrao'
        ? ['construdata', 'iris', 'padrao']
        : [product]

      const comercialResults = await Promise.all(
        productsToLoadComercial.map((p) => fetchFromSupabase<ComercialContact>('comercial_contacts', p))
      )
      const comStore = useComercialStore.getState()
      const newComContacts = { ...comStore.contacts }
      productsToLoadComercial.forEach((p, i) => {
        if (comercialResults[i].length > 0) newComContacts[p] = comercialResults[i]
      })
      useComercialStore.setState({ contacts: newComContacts })

      console.log(`[supabase] Data loaded for ${product}`)
    }

    loadAll()
  }, [product])
}
