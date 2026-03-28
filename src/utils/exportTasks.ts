import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Task } from '../types'

const PRIORITY_LABEL: Record<string, string> = {
  low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente',
}

export function exportTasksToPDF(
  tasks: Task[],
  product: string,
  dateRange?: { start: string; end: string }
): void {
  let filtered = tasks
  if (dateRange) {
    filtered = tasks.filter((t) => {
      const d = t.completionDate ?? t.date
      return d >= dateRange.start && d <= dateRange.end
    })
  }

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
  doc.text(`Relatório de Tarefas — ${product}`, 14, 20)
  doc.setTextColor(180, 200, 220)
  doc.text(`Gerado em: ${now}`, 150, 20)

  // Summary
  const total = filtered.length
  const completed = filtered.filter((t) => t.completed).length
  const pending = total - completed

  doc.setTextColor(0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumo', 14, 38)

  const kpis = [
    ['Total de Tarefas', String(total)],
    ['Concluídas', String(completed)],
    ['Pendentes', String(pending)],
  ]

  if (dateRange) {
    kpis.push(['Período', `${new Date(dateRange.start).toLocaleDateString('pt-BR')} a ${new Date(dateRange.end).toLocaleDateString('pt-BR')}`])
  }

  autoTable(doc, {
    startY: 42,
    head: [['Métrica', 'Valor']],
    body: kpis,
    theme: 'striped',
    headStyles: { fillColor: [13, 27, 62], textColor: [100, 212, 232] },
    margin: { left: 14, right: 14 },
  })

  // Tasks table
  const afterKPI = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
  doc.setFont('helvetica', 'bold')
  doc.text('Tarefas', 14, afterKPI)

  const rows = filtered.map((t) => [
    t.title,
    PRIORITY_LABEL[t.priority] ?? t.priority,
    new Date(t.date).toLocaleDateString('pt-BR'),
    t.completionDate ? new Date(t.completionDate).toLocaleDateString('pt-BR') : '—',
    (t.tags ?? []).join(', ') || '—',
    t.completed ? 'Concluída' : 'Pendente',
    t.description ?? '—',
  ])

  autoTable(doc, {
    startY: afterKPI + 4,
    head: [['Título', 'Prioridade', 'Data', 'Conclusão', 'Tags', 'Status', 'Descrição']],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [13, 27, 62], textColor: [100, 212, 232], fontSize: 7 },
    bodyStyles: { fontSize: 7 },
    columnStyles: { 6: { cellWidth: 40 } },
    margin: { left: 14, right: 14 },
  })

  doc.save(`atlantico-tarefas-${product.toLowerCase()}-${now.replace(/\//g, '-')}.pdf`)
}
