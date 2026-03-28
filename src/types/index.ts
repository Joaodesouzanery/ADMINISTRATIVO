export type { ProductKey } from '../config/products'

// ─── Tasks ───────────────────────────────────────────────────────────────────
export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

export interface KanbanCard {
  id: string
  title: string
  description?: string
  priority: Priority
  status: TaskStatus
  columnId: string
  dueDate?: string
  tags?: string[]
  assignee?: string
  createdAt: string
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  order: number
}

export interface Goal {
  id: string
  title: string
  description?: string
  target: number
  current: number
  unit: string
  dueDate: string
  status: 'on_track' | 'at_risk' | 'completed' | 'delayed'
}

// ─── Documents ───────────────────────────────────────────────────────────────
export type DocType = 'document' | 'contract' | 'report' | 'prompt'

export interface Document {
  id: string
  title: string
  type: DocType
  category: string
  content?: string
  fileUrl?: string
  version: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

// ─── CRM ─────────────────────────────────────────────────────────────────────
export type ClientStatus = 'prospect' | 'active' | 'inactive' | 'partner'
export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'

export interface Client {
  id: string
  name: string
  company?: string
  email: string
  phone?: string
  status: ClientStatus
  segment?: string
  value?: number
  createdAt: string
  notes?: string
}

export interface Deal {
  id: string
  title: string
  clientId: string
  clientName: string
  stage: DealStage
  value: number
  probability: number
  expectedClose: string
  createdAt: string
}

// ─── Financial ───────────────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  description: string
  type: TransactionType
  amount: number
  category: string
  date: string
  dueDate?: string
  paid: boolean
  notes?: string
}

export interface PayrollEntry {
  id: string
  employee: string
  role: string
  baseSalary: number
  bonuses: number
  deductions: number
  netSalary: number
  month: string
  status: 'pending' | 'paid'
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface ChartDataPoint {
  label: string
  value: number
  value2?: number
}
