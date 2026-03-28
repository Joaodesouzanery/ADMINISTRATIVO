import type { Transaction, PayrollEntry } from '../../types'

export const transactions: Transaction[] = [
  { id: 'if1', description: 'MRR TechBrasil - Março', type: 'income', amount: 80000, category: 'Assinaturas', date: '2026-03-01', paid: true },
  { id: 'if2', description: 'MRR Banco Meridional - Março', type: 'income', amount: 200000, category: 'Assinaturas', date: '2026-03-01', paid: true },
  { id: 'if3', description: 'Infraestrutura Cloud AWS', type: 'expense', amount: 35000, category: 'Infraestrutura', date: '2026-03-05', paid: true },
  { id: 'if4', description: 'MRR Logística Rápida - Março', type: 'income', amount: 40000, category: 'Assinaturas', date: '2026-03-01', paid: true },
  { id: 'if5', description: 'Folha P&D Março', type: 'expense', amount: 78000, category: 'Folha', date: '2026-03-28', paid: false, dueDate: '2026-03-31' },
  { id: 'if6', description: 'Ferramentas DevOps', type: 'expense', amount: 12000, category: 'Software', date: '2026-03-10', paid: true },
  { id: 'if7', description: 'Suporte Técnico Q1', type: 'income', amount: 25000, category: 'Serviços', date: '2026-03-15', paid: true },
]

export const payroll: PayrollEntry[] = [
  { id: 'ip1', employee: 'Sofia Ribeiro', role: 'Lead Data Scientist', baseSalary: 18000, bonuses: 2000, deductions: 3100, netSalary: 16900, month: '2026-03', status: 'pending' },
  { id: 'ip2', employee: 'Pedro Nunes', role: 'Engenheiro de Software Sr.', baseSalary: 16000, bonuses: 1500, deductions: 2750, netSalary: 14750, month: '2026-03', status: 'pending' },
  { id: 'ip3', employee: 'Lucas Mendes', role: 'DevOps Engineer', baseSalary: 14000, bonuses: 1000, deductions: 2400, netSalary: 12600, month: '2026-03', status: 'pending' },
]
