import type { KanbanColumn, KanbanCard, Goal } from '../../types'

export const columns: KanbanColumn[] = [
  { id: 'col-1', title: 'Backlog',       color: '#9AAAC8', order: 0 },
  { id: 'col-2', title: 'Desenvolvimento', color: '#7DD4A8', order: 1 },
  { id: 'col-3', title: 'Teste / QA',    color: '#F59E0B', order: 2 },
  { id: 'col-4', title: 'Produção',      color: '#22C55E', order: 3 },
]

export const cards: KanbanCard[] = [
  { id: 'ti1', title: 'Pipeline de ingestão de dados', description: 'Construir ETL para fontes externas', priority: 'high', status: 'in_progress', columnId: 'col-2', dueDate: '2026-04-20', tags: ['ETL', 'Data'], assignee: 'Sofia R.', createdAt: '2026-03-01' },
  { id: 'ti2', title: 'Dashboard de inteligência mercadológica', priority: 'high', status: 'todo', columnId: 'col-1', dueDate: '2026-05-01', tags: ['BI', 'Dashboard'], assignee: 'Pedro N.', createdAt: '2026-03-10' },
  { id: 'ti3', title: 'Módulo de predição de demanda', priority: 'urgent', status: 'in_progress', columnId: 'col-2', dueDate: '2026-04-10', tags: ['ML', 'IA'], assignee: 'Sofia R.', createdAt: '2026-02-25' },
  { id: 'ti4', title: 'API de integração com ERP', priority: 'medium', status: 'review', columnId: 'col-3', dueDate: '2026-04-05', tags: ['API', 'ERP'], assignee: 'Lucas M.', createdAt: '2026-02-20' },
  { id: 'ti5', title: 'Relatórios automatizados', priority: 'low', status: 'done', columnId: 'col-4', dueDate: '2026-03-20', tags: ['Relatórios'], assignee: 'Pedro N.', createdAt: '2026-02-10' },
  { id: 'ti6', title: 'Segurança e autenticação OAuth2', priority: 'high', status: 'done', columnId: 'col-4', dueDate: '2026-03-15', tags: ['Segurança'], assignee: 'Lucas M.', createdAt: '2026-02-01' },
]

export const goals: Goal[] = [
  { id: 'gi1', title: 'Usuários ativos IRIS', target: 500, current: 312, unit: 'usuários', dueDate: '2026-06-30', status: 'on_track' },
  { id: 'gi2', title: 'Uptime plataforma', target: 99.9, current: 99.7, unit: '%', dueDate: '2026-12-31', status: 'on_track' },
  { id: 'gi3', title: 'Features lançadas Q2', target: 12, current: 3, unit: 'features', dueDate: '2026-06-30', status: 'at_risk' },
  { id: 'gi4', title: 'Receita ARR', target: 1000000, current: 640000, unit: 'R$', dueDate: '2026-12-31', status: 'on_track' },
]
