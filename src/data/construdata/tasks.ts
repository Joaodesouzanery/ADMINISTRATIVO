import type { KanbanColumn, KanbanCard, Goal } from '../../types'

export const columns: KanbanColumn[] = [
  { id: 'col-1', title: 'Backlog',      color: '#9AAAC8', order: 0 },
  { id: 'col-2', title: 'Em Progresso', color: '#64D4E8', order: 1 },
  { id: 'col-3', title: 'Revisão',      color: '#F59E0B', order: 2 },
  { id: 'col-4', title: 'Concluído',    color: '#22C55E', order: 3 },
]

export const cards: KanbanCard[] = [
  { id: 't1', title: 'Modelagem BIM - Torre A', description: 'Criar modelo completo no Revit', priority: 'high', status: 'in_progress', columnId: 'col-2', dueDate: '2026-04-15', tags: ['BIM', 'Revit'], assignee: 'Carlos S.', createdAt: '2026-03-01' },
  { id: 't2', title: 'Relatório de fundações', description: 'Consolidar laudos geotécnicos', priority: 'urgent', status: 'review', columnId: 'col-3', dueDate: '2026-04-01', tags: ['Estrutura'], assignee: 'Ana M.', createdAt: '2026-03-05' },
  { id: 't3', title: 'Orçamento pavimentação', priority: 'medium', status: 'todo', columnId: 'col-1', dueDate: '2026-04-20', tags: ['Orçamento'], assignee: 'João P.', createdAt: '2026-03-10' },
  { id: 't4', title: 'Aprovação CREA', priority: 'urgent', status: 'todo', columnId: 'col-1', dueDate: '2026-03-30', tags: ['Legal'], assignee: 'Beatriz L.', createdAt: '2026-03-12' },
  { id: 't5', title: 'Cronograma físico-financeiro', priority: 'high', status: 'done', columnId: 'col-4', dueDate: '2026-03-20', tags: ['Planejamento'], assignee: 'Carlos S.', createdAt: '2026-02-20' },
  { id: 't6', title: 'Integração com fornecedores', priority: 'low', status: 'todo', columnId: 'col-1', dueDate: '2026-05-01', tags: ['Supply Chain'], assignee: 'Rafael T.', createdAt: '2026-03-15' },
  { id: 't7', title: 'Revisão de plantas arquitetônicas', priority: 'high', status: 'in_progress', columnId: 'col-2', dueDate: '2026-04-10', tags: ['Arquitetura'], assignee: 'Ana M.', createdAt: '2026-03-08' },
  { id: 't8', title: 'Manual de construção v2.0', priority: 'medium', status: 'done', columnId: 'col-4', dueDate: '2026-03-15', tags: ['Documentação'], assignee: 'João P.', createdAt: '2026-02-28' },
]

export const goals: Goal[] = [
  { id: 'g1', title: 'Projetos entregues Q1', description: 'Total de projetos concluídos no 1º trimestre', target: 8, current: 5, unit: 'projetos', dueDate: '2026-03-31', status: 'on_track' },
  { id: 'g2', title: 'Receita mensal', description: 'Meta de faturamento mensal', target: 250000, current: 187000, unit: 'R$', dueDate: '2026-03-31', status: 'at_risk' },
  { id: 'g3', title: 'Satisfação clientes', description: 'NPS médio dos clientes', target: 85, current: 78, unit: 'pontos NPS', dueDate: '2026-03-31', status: 'on_track' },
  { id: 'g4', title: 'Novos contratos', description: 'Contratos assinados no trimestre', target: 15, current: 15, unit: 'contratos', dueDate: '2026-03-31', status: 'completed' },
]
