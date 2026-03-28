import type { Transaction, PayrollEntry, FinancialOKR } from '../../types'

export const transactions: Transaction[] = [
  { id: 'if1', description: 'MRR TechBrasil - Março', type: 'income', amount: 80000, category: 'Assinaturas', date: '2026-03-01', paid: true, recurrence: 'monthly', createdAt: '2026-03-01' },
  { id: 'if2', description: 'MRR Banco Meridional - Março', type: 'income', amount: 200000, category: 'Assinaturas', date: '2026-03-01', paid: true, recurrence: 'monthly', createdAt: '2026-03-01' },
  { id: 'if3', description: 'Infraestrutura Cloud AWS', type: 'expense', amount: 35000, category: 'Infraestrutura', date: '2026-03-05', paid: true, recurrence: 'monthly', createdAt: '2026-03-05' },
  { id: 'if4', description: 'MRR Logística Rápida - Março', type: 'income', amount: 40000, category: 'Assinaturas', date: '2026-03-01', paid: true, recurrence: 'monthly', createdAt: '2026-03-01' },
  { id: 'if5', description: 'Folha P&D Março', type: 'expense', amount: 78000, category: 'Folha', date: '2026-03-28', paid: false, dueDate: '2026-03-31', recurrence: 'monthly', createdAt: '2026-03-28' },
  { id: 'if6', description: 'Ferramentas DevOps', type: 'expense', amount: 12000, category: 'Software', date: '2026-03-10', paid: true, recurrence: 'monthly', createdAt: '2026-03-10' },
  { id: 'if7', description: 'Suporte Técnico Q1', type: 'income', amount: 25000, category: 'Serviços', date: '2026-03-15', paid: true, recurrence: 'quarterly', createdAt: '2026-03-15' },
]

export const payroll: PayrollEntry[] = [
  { id: 'ip1', employee: 'Sofia Ribeiro', role: 'Lead Data Scientist', baseSalary: 18000, bonuses: 2000, deductions: 3100, netSalary: 16900, month: '2026-03', status: 'pending' },
  { id: 'ip2', employee: 'Pedro Nunes', role: 'Engenheiro de Software Sr.', baseSalary: 16000, bonuses: 1500, deductions: 2750, netSalary: 14750, month: '2026-03', status: 'pending' },
  { id: 'ip3', employee: 'Lucas Mendes', role: 'DevOps Engineer', baseSalary: 14000, bonuses: 1000, deductions: 2400, netSalary: 12600, month: '2026-03', status: 'pending' },
]

export const okrs: FinancialOKR[] = [
  {
    id: 'iokr1',
    objective: 'Atingir ARR de R$ 5M até dezembro 2026',
    period: '2026',
    status: 'on_track',
    keyResults: [
      { id: 'ikr1', description: 'MRR acima de R$ 420k até Jun/26', target: 420000, current: 345000, unit: 'R$ MRR' },
      { id: 'ikr2', description: 'Adicionar 3 novos clientes enterprise', target: 3, current: 1, unit: 'clientes' },
      { id: 'ikr3', description: 'Churn rate abaixo de 2%', target: 2, current: 1.2, unit: '% churn' },
    ],
  },
  {
    id: 'iokr2',
    objective: 'Manter margem operacional acima de 60%',
    period: 'Q2 2026',
    status: 'on_track',
    keyResults: [
      { id: 'ikr4', description: 'Custo de infraestrutura/receita < 10%', target: 10, current: 9.7, unit: '%' },
      { id: 'ikr5', description: 'Automatizar 5 processos manuais', target: 5, current: 2, unit: 'processos' },
    ],
  },
]
