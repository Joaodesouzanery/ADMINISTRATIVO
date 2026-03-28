import type { Transaction, PayrollEntry, FinancialOKR } from '../../types'

export const transactions: Transaction[] = [
  { id: 'f1', description: 'Contrato Grupo Habitat Q1', type: 'income', amount: 125000, category: 'Contratos', date: '2026-03-01', paid: true, recurrence: 'quarterly', createdAt: '2026-03-01' },
  { id: 'f2', description: 'Licenças Software BIM', type: 'expense', amount: 8500, category: 'Software', date: '2026-03-05', paid: true, recurrence: 'monthly', createdAt: '2026-03-05' },
  { id: 'f3', description: 'Consultoria Construtora Alves', type: 'income', amount: 45000, category: 'Consultoria', date: '2026-03-10', paid: true, recurrence: 'once', createdAt: '2026-03-10' },
  { id: 'f4', description: 'Aluguel escritório', type: 'expense', amount: 6200, category: 'Infraestrutura', date: '2026-03-01', paid: true, recurrence: 'monthly', createdAt: '2026-03-01' },
  { id: 'f5', description: 'Folha de pagamento Março', type: 'expense', amount: 52000, category: 'Folha', date: '2026-03-28', paid: false, dueDate: '2026-03-31', recurrence: 'monthly', createdAt: '2026-03-28' },
  { id: 'f6', description: 'Projeto Torre A - Parcela 2', type: 'income', amount: 78000, category: 'Projetos', date: '2026-03-15', paid: true, recurrence: 'monthly', createdAt: '2026-03-15' },
  { id: 'f7', description: 'Marketing e publicidade', type: 'expense', amount: 4500, category: 'Marketing', date: '2026-03-20', paid: true, recurrence: 'monthly', createdAt: '2026-03-20' },
  { id: 'f8', description: 'Manutenção equipamentos', type: 'expense', amount: 2800, category: 'Manutenção', date: '2026-03-22', paid: false, dueDate: '2026-04-05', recurrence: 'once', createdAt: '2026-03-22' },
  { id: 'f9', description: 'Serviços FC - Fev', type: 'income', amount: 32000, category: 'Contratos', date: '2026-02-28', paid: true, recurrence: 'monthly', createdAt: '2026-02-28' },
  { id: 'f10', description: 'Impostos e taxas Q1', type: 'expense', amount: 18900, category: 'Impostos', date: '2026-03-25', paid: false, dueDate: '2026-03-31', recurrence: 'quarterly', createdAt: '2026-03-25' },
]

export const payroll: PayrollEntry[] = [
  { id: 'p1', employee: 'Carlos Souza', role: 'Engenheiro Sênior', baseSalary: 12000, bonuses: 1500, deductions: 2100, netSalary: 11400, month: '2026-03', status: 'pending' },
  { id: 'p2', employee: 'Ana Martins', role: 'Arquiteta', baseSalary: 9500, bonuses: 800, deductions: 1650, netSalary: 8650, month: '2026-03', status: 'pending' },
  { id: 'p3', employee: 'João Pereira', role: 'Gestor de Projetos', baseSalary: 8000, bonuses: 600, deductions: 1380, netSalary: 7220, month: '2026-03', status: 'pending' },
  { id: 'p4', employee: 'Beatriz Lima', role: 'Especialista Legal', baseSalary: 10000, bonuses: 0, deductions: 1750, netSalary: 8250, month: '2026-03', status: 'pending' },
  { id: 'p5', employee: 'Rafael Torres', role: 'Supply Chain', baseSalary: 7500, bonuses: 400, deductions: 1300, netSalary: 6600, month: '2026-03', status: 'pending' },
]

export const okrs: FinancialOKR[] = [
  {
    id: 'okr1',
    objective: 'Aumentar receita total em 20% no Q2 2026',
    period: 'Q2 2026',
    status: 'on_track',
    keyResults: [
      { id: 'kr1', description: 'Fechar 3 novos contratos acima de R$ 100k', target: 3, current: 1, unit: 'contratos' },
      { id: 'kr2', description: 'Expandir receita de consultoria para R$ 200k', target: 200000, current: 45000, unit: 'R$' },
      { id: 'kr3', description: 'Renovar 80% dos contratos existentes', target: 80, current: 50, unit: '%' },
    ],
  },
  {
    id: 'okr2',
    objective: 'Reduzir despesas operacionais em 10%',
    period: 'Q2 2026',
    status: 'at_risk',
    keyResults: [
      { id: 'kr4', description: 'Renegociar contratos de software', target: 15, current: 5, unit: '% redução' },
      { id: 'kr5', description: 'Eliminar gastos não essenciais', target: 20000, current: 4500, unit: 'R$ economizados' },
    ],
  },
]
