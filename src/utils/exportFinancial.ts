import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { Transaction, PayrollEntry } from '../types'

const RECURRENCE_LABEL: Record<string, string> = {
  once: 'Avulso', daily: 'Diário', weekly: 'Semanal',
  monthly: 'Mensal', quarterly: 'Trimestral', annual: 'Anual',
}

const fmt = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

// ─── PDF ─────────────────────────────────────────────────────────────────────
export function exportTransactionsToPDF(
  transactions: Transaction[],
  payroll: PayrollEntry[],
  product: string
): void {
  const doc = new jsPDF()
  const now = new Date().toLocaleDateString('pt-BR')

  // Header
  doc.setFillColor(13, 27, 62)
  doc.rect(0, 0, 210, 28, 'F')
  doc.setTextColor(100, 212, 232)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Atlântico', 14, 12)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Relatório Financeiro — ${product}`, 14, 20)
  doc.setTextColor(180, 200, 220)
  doc.text(`Gerado em: ${now}`, 150, 20)

  // KPIs
  const totalIncome = transactions.filter((t) => t.type === 'income' && t.paid).reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense' && t.paid).reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  doc.setTextColor(0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumo', 14, 38)

  const kpis = [
    ['Receita Realizada', fmt(totalIncome)],
    ['Despesas Pagas', fmt(totalExpense)],
    ['Saldo', fmt(balance)],
  ]
  autoTable(doc, {
    startY: 42,
    head: [['Métrica', 'Valor']],
    body: kpis,
    theme: 'striped',
    headStyles: { fillColor: [13, 27, 62], textColor: [100, 212, 232] },
    margin: { left: 14, right: 14 },
  })

  // Transactions table
  const afterKPI = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Lançamentos', 14, afterKPI)

  const txRows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('pt-BR'),
    t.description,
    t.category,
    t.type === 'income' ? 'Receita' : 'Despesa',
    RECURRENCE_LABEL[t.recurrence] ?? t.recurrence,
    fmt(t.amount),
    t.paid ? 'Pago' : 'Pendente',
  ])

  autoTable(doc, {
    startY: afterKPI + 4,
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Recorrência', 'Valor', 'Status']],
    body: txRows,
    theme: 'striped',
    headStyles: { fillColor: [13, 27, 62], textColor: [100, 212, 232], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  })

  // Payroll table on new page if needed
  if (payroll.length > 0) {
    doc.addPage()
    doc.setFillColor(13, 27, 62)
    doc.rect(0, 0, 210, 18, 'F')
    doc.setTextColor(100, 212, 232)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Folha de Pagamento', 14, 12)

    const payrollRows = payroll.map((e) => [
      e.employee,
      e.role,
      fmt(e.baseSalary),
      fmt(e.bonuses),
      fmt(e.deductions),
      fmt(e.netSalary),
      e.status === 'paid' ? 'Pago' : 'Pendente',
    ])

    autoTable(doc, {
      startY: 24,
      head: [['Colaborador', 'Cargo', 'Salário Base', 'Bônus', 'Descontos', 'Líquido', 'Status']],
      body: payrollRows,
      theme: 'striped',
      headStyles: { fillColor: [13, 27, 62], textColor: [100, 212, 232], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    })
  }

  doc.save(`atlantico-financeiro-${product.toLowerCase()}-${now.replace(/\//g, '-')}.pdf`)
}

// ─── Excel ────────────────────────────────────────────────────────────────────
export function exportTransactionsToExcel(
  transactions: Transaction[],
  payroll: PayrollEntry[],
  product: string
): void {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Transactions
  const txData = [
    ['Data', 'Criado em', 'Descrição', 'Categoria', 'Tipo', 'Recorrência', 'Valor (R$)', 'Status', 'Notas'],
    ...transactions.map((t) => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      new Date(t.createdAt).toLocaleDateString('pt-BR'),
      t.description,
      t.category,
      t.type === 'income' ? 'Receita' : 'Despesa',
      RECURRENCE_LABEL[t.recurrence] ?? t.recurrence,
      t.amount,
      t.paid ? 'Pago' : 'Pendente',
      t.notes ?? '',
    ]),
  ]
  const txSheet = XLSX.utils.aoa_to_sheet(txData)
  txSheet['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 35 }, { wch: 18 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 25 }]
  XLSX.utils.book_append_sheet(wb, txSheet, 'Lançamentos')

  // Sheet 2: Summary by category
  const incomeByCategory: Record<string, number> = {}
  const expenseByCategory: Record<string, number> = {}
  transactions.forEach((t) => {
    if (t.type === 'income') incomeByCategory[t.category] = (incomeByCategory[t.category] ?? 0) + t.amount
    else expenseByCategory[t.category] = (expenseByCategory[t.category] ?? 0) + t.amount
  })
  const summaryData = [
    ['Categoria', 'Receita (R$)', 'Despesa (R$)'],
    ...Array.from(new Set([...Object.keys(incomeByCategory), ...Object.keys(expenseByCategory)])).map((cat) => [
      cat, incomeByCategory[cat] ?? 0, expenseByCategory[cat] ?? 0
    ]),
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 20 }, { wch: 16 }, { wch: 16 }]
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Por Categoria')

  // Sheet 3: Payroll
  if (payroll.length > 0) {
    const payrollData = [
      ['Colaborador', 'Cargo', 'Salário Base', 'Bônus', 'Descontos', 'Líquido', 'Mês', 'Status'],
      ...payroll.map((e) => [e.employee, e.role, e.baseSalary, e.bonuses, e.deductions, e.netSalary, e.month, e.status === 'paid' ? 'Pago' : 'Pendente']),
    ]
    const payrollSheet = XLSX.utils.aoa_to_sheet(payrollData)
    payrollSheet['!cols'] = [{ wch: 25 }, { wch: 28 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(wb, payrollSheet, 'Folha de Pagamento')
  }

  const now = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
  XLSX.writeFile(wb, `atlantico-financeiro-${product.toLowerCase()}-${now}.xlsx`)
}
