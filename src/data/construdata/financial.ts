import type { Transaction, PayrollEntry } from '../../types'

export const transactions: Transaction[] = [
  { id: 'f1', description: 'Contrato Grupo Habitat Q1', type: 'income', amount: 125000, category: 'Contratos', date: '2026-03-01', paid: true },
  { id: 'f2', description: 'Licenças Software BIM', type: 'expense', amount: 8500, category: 'Software', date: '2026-03-05', paid: true },
  { id: 'f3', description: 'Consultoria Construtora Alves', type: 'income', amount: 45000, category: 'Consultoria', date: '2026-03-10', paid: true },
  { id: 'f4', description: 'Aluguel escritório', type: 'expense', amount: 6200, category: 'Infraestrutura', date: '2026-03-01', paid: true },
  { id: 'f5', description: 'Folha de pagamento Março', type: 'expense', amount: 52000, category: 'Folha', date: '2026-03-28', paid: false, dueDate: '2026-03-31' },
  { id: 'f6', description: 'Projeto Torre A - Parcela 2', type: 'income', amount: 78000, category: 'Projetos', date: '2026-03-15', paid: true },
  { id: 'f7', description: 'Marketing e publicidade', type: 'expense', amount: 4500, category: 'Marketing', date: '2026-03-20', paid: true },
  { id: 'f8', description: 'Manutenção equipamentos', type: 'expense', amount: 2800, category: 'Manutenção', date: '2026-03-22', paid: false, dueDate: '2026-04-05' },
  { id: 'f9', description: 'Serviços FC - Fev', type: 'income', amount: 32000, category: 'Contratos', date: '2026-02-28', paid: true },
  { id: 'f10', description: 'Impostos e taxas Q1', type: 'expense', amount: 18900, category: 'Impostos', date: '2026-03-25', paid: false, dueDate: '2026-03-31' },
]

export const payroll: PayrollEntry[] = [
  { id: 'p1', employee: 'Carlos Souza', role: 'Engenheiro Sênior', baseSalary: 12000, bonuses: 1500, deductions: 2100, netSalary: 11400, month: '2026-03', status: 'pending' },
  { id: 'p2', employee: 'Ana Martins', role: 'Arquiteta', baseSalary: 9500, bonuses: 800, deductions: 1650, netSalary: 8650, month: '2026-03', status: 'pending' },
  { id: 'p3', employee: 'João Pereira', role: 'Gestor de Projetos', baseSalary: 8000, bonuses: 600, deductions: 1380, netSalary: 7220, month: '2026-03', status: 'pending' },
  { id: 'p4', employee: 'Beatriz Lima', role: 'Especialista Legal', baseSalary: 10000, bonuses: 0, deductions: 1750, netSalary: 8250, month: '2026-03', status: 'pending' },
  { id: 'p5', employee: 'Rafael Torres', role: 'Supply Chain', baseSalary: 7500, bonuses: 400, deductions: 1300, netSalary: 6600, month: '2026-03', status: 'pending' },
]
