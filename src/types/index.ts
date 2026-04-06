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
  subtasks?: Subtask[]
  contactId?: string
}

export interface Subtask {
  id: string
  label: string
  done: boolean
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

// ─── Routines / Checklists ────────────────────────────────────────────────────
export type RoutineFrequency = 'daily' | 'weekly' | 'monthly'

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
  assignee?: string
  priority?: Priority
  dueDate?: string
  notes?: string
}

export interface Routine {
  id: string
  title: string
  description?: string
  frequency: RoutineFrequency
  items: ChecklistItem[]
  assignee?: string
  priority?: Priority
  dueDate?: string
  notes?: string
  createdAt: string
}

// ─── Standalone Tasks ────────────────────────────────────────────────────────
export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  date: string
  completionDate?: string
  tags?: string[]
  completed: boolean
  completedAt?: string
  createdAt: string
  alertDaysBefore?: number
  contactId?: string
}

// ─── Planning ────────────────────────────────────────────────────────────────
export type PlanningHorizon = 'short' | 'medium' | 'long'
export type PlanningStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled'

export interface PlanningGoal {
  id: string
  title: string
  description?: string
  category: string
  status: PlanningStatus
  horizon: PlanningHorizon
  startDate: string
  endDate: string
  okr?: string
  relatedProject?: string
  createdAt: string
}

// ─── Notifications ───────────────────────────────────────────────────────────
export interface Notification {
  id: string
  type: 'task_deadline' | 'planning_deadline' | 'general'
  title: string
  message: string
  referenceId?: string
  read: boolean
  createdAt: string
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

// ─── Comercial Module ────────────────────────────────────────────────────────
export type ComercialStage =
  | 'prospeccao'
  | 'apresentacao'
  | 'negociacao'
  | 'fechamento'
  | 'pos_venda'

export interface ComercialContact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  role?: string
  stage: ComercialStage
  value?: number
  notes?: string
  createdAt: string
}

// ─── CRM Contacts / Partners ─────────────────────────────────────────────────
export type ContactPipelineStage = 'new' | 'contacted' | 'engaged' | 'proposal' | 'closed'
export type EntityType = 'contact' | 'partner'

export interface Contact {
  id: string
  type: EntityType
  name: string
  email?: string
  phone?: string
  company?: string
  project?: string
  pipelineStage: ContactPipelineStage
  observations?: string
  linkedTaskIds?: string[]
  createdAt: string
}

// ─── Organograma ─────────────────────────────────────────────────────────────
export type OrgNodeType = 'company' | 'department' | 'person' | 'client' | 'associate'

export interface OrgNode {
  id: string
  parentId: string | null
  label: string
  type: OrgNodeType
  role?: string
  email?: string
  phone?: string
  createdAt: string
}

// ─── Financial ───────────────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense'
export type RecurrenceType = 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'

export interface Transaction {
  id: string
  description: string
  type: TransactionType
  amount: number
  category: string
  date: string
  dueDate?: string
  paid: boolean
  recurrence: RecurrenceType
  notes?: string
  createdAt: string
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

export interface OKRKeyResult {
  id: string
  description: string
  target: number
  current: number
  unit: string
}

export interface FinancialOKR {
  id: string
  objective: string
  keyResults: OKRKeyResult[]
  period: string
  status: 'on_track' | 'at_risk' | 'completed'
}

// ─── Scheduling (Agenda Dinâmica) ────────────────────────────────────────────
export type ScheduleTaskPhase =
  | 'mobilização'
  | 'perfuração'
  | 'desmobilização'
  | 'movimentação'
  | 'bombeamento'
  | 'flowback'
  | 'manutenção'
  | 'inspeção'
  | 'setup'

export interface ScheduleOperator {
  id: string
  name: string
  color: string
  role?: string
  certifications?: string[]
}

export interface ScheduleResource {
  id: string
  name: string
  type: 'equipe' | 'equipamento' | 'local'
  location?: string
  status: 'ativo' | 'inativo' | 'manutenção'
}

export interface ScheduleTask {
  id: string
  resourceId: string
  label: string
  phase: ScheduleTaskPhase
  startDate: string
  endDate: string
  operatorIds: string[]
  color: string
  order: number
}

export interface ScheduleKPI {
  outputGlobal: number
  receitaProjetadaAntes: number
  receitaProjetadaDepois: number
  variacaoPercentual: number
  totalEquipe: number
}

export interface ScheduleScenario {
  id: string
  name: string
  isNew?: boolean
  resources: ScheduleResource[]
  tasks: ScheduleTask[]
  operators: ScheduleOperator[]
  kpi: ScheduleKPI
}

// ─── Rules & Alerting (Regras e Alertas) ─────────────────────────────────────
export type RuleConstraintType = 'HARD' | 'SOFT'
export type RuleStatus = 'ativa' | 'inativa' | 'rascunho'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type ProposalStatus = 'pendente' | 'aprovada' | 'rejeitada'

export interface RuleObjectNode {
  id: string
  label: string
  type: string
  parentId: string | null
}

export interface RuleConditionFilter {
  id: string
  field: string
  operator: string
  value: string
  logicalOp?: 'E' | 'OU'
}

export interface StreamingConditionConfig {
  type: 'formula_threshold' | 'anomaly_detection' | 'pattern_match'
  formula: string
  isValid: boolean
  variables: { name: string; value: string }[]
  triggerAction: string
  recoverAction: string
}

export interface Rule {
  id: string
  name: string
  description: string
  author: string
  createdAt: string
  updatedAt: string
  status: RuleStatus
  objectNodes: RuleObjectNode[]
  conditionFilters: RuleConditionFilter[]
  constraintType: RuleConstraintType
  outputMapping: string
  streamingCondition?: StreamingConditionConfig
}

export interface Alert {
  id: string
  ruleId: string
  ruleName: string
  severity: AlertSeverity
  message: string
  triggeredAt: string
  resolvedAt?: string
  resolved: boolean
  resolution?: string
}

export interface RuleProposal {
  id: string
  ruleId: string
  ruleName: string
  author: string
  description: string
  status: ProposalStatus
  createdAt: string
  reviewedAt?: string
  reviewer?: string
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface ChartDataPoint {
  label: string
  value: number
  value2?: number
}
