import { useFinancialStore } from '../../store/financialStore'
import { useTaskStore } from '../../store/taskStore'
import { useCRMStore } from '../../store/crmStore'
import { Card, CardHeader } from '../../components/ui/Card'
import { KPICard } from '../../components/ui/KPICard'
import { AreaChart, BarChart, PieChart } from '../../components/charts/Charts'
import { TrendingUp, Users, Kanban, DollarSign } from 'lucide-react'

const PRODUCT = 'construdata' as const

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function AnalyticsPage() {
  const { transactions } = useFinancialStore()
  const { cards } = useTaskStore()
  const { clients, deals } = useCRMStore()

  const prodTx = transactions[PRODUCT]
  const prodCards = cards[PRODUCT]
  const prodClients = clients[PRODUCT]
  const prodDeals = deals[PRODUCT]

  const totalIncome = prodTx.filter((t) => t.type === 'income' && t.paid).reduce((s, t) => s + t.amount, 0)
  const doneTasks = prodCards.filter((c) => c.columnId === 'col-4').length
  const activeClients = prodClients.filter((c) => c.status === 'active' || c.status === 'partner').length
  const wonValue = prodDeals.filter((d) => d.stage === 'won').reduce((s, d) => s + d.value, 0)

  // Revenue chart (mock 12 months)
  const revenueData = MONTHS.map((label, i) => ({
    label,
    value: 80000 + Math.sin(i * 0.8) * 40000 + i * 8000,
    value2: 40000 + Math.cos(i * 0.6) * 15000 + i * 3000,
  }))

  // Tasks by status
  const tasksByStatus = [
    { label: 'Backlog', value: prodCards.filter((c) => c.columnId === 'col-1').length },
    { label: 'Em Progresso', value: prodCards.filter((c) => c.columnId === 'col-2').length },
    { label: 'Revisão', value: prodCards.filter((c) => c.columnId === 'col-3').length },
    { label: 'Concluído', value: prodCards.filter((c) => c.columnId === 'col-4').length },
  ]

  // Deals by stage
  const dealsByStage = [
    { label: 'Lead', value: prodDeals.filter((d) => d.stage === 'lead').length },
    { label: 'Qualificado', value: prodDeals.filter((d) => d.stage === 'qualified').length },
    { label: 'Proposta', value: prodDeals.filter((d) => d.stage === 'proposal').length },
    { label: 'Negociação', value: prodDeals.filter((d) => d.stage === 'negotiation').length },
    { label: 'Ganho', value: prodDeals.filter((d) => d.stage === 'won').length },
  ].filter((d) => d.value > 0)

  // Client segments
  const segments = prodClients.reduce<Record<string, number>>((acc, c) => {
    acc[c.segment ?? 'Outros'] = (acc[c.segment ?? 'Outros'] ?? 0) + 1
    return acc
  }, {})
  const segmentData = Object.entries(segments).map(([label, value]) => ({ label, value }))

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Receita Realizada" value={`R$ ${(totalIncome / 1000).toFixed(0)}k`} subtitle="Mês atual" trend={12} icon={<DollarSign size={18} />} />
        <KPICard title="Clientes Ativos" value={activeClients} subtitle="Incluindo parceiros" trend={5} icon={<Users size={18} />} />
        <KPICard title="Tarefas Concluídas" value={doneTasks} subtitle="Total no board" icon={<Kanban size={18} />} />
        <KPICard title="Negócios Ganhos" value={`R$ ${(wonValue / 1000).toFixed(0)}k`} subtitle="Valor acumulado" trend={8} icon={<TrendingUp size={18} />} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Receita vs Despesa" subtitle="Últimos 12 meses" />
          <AreaChart data={revenueData} />
        </Card>
        <Card>
          <CardHeader title="Tarefas por Status" />
          <BarChart data={tasksByStatus} />
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Pipeline por Estágio" />
          <PieChart data={dealsByStage} />
        </Card>
        <Card>
          <CardHeader title="Clientes por Segmento" />
          <PieChart data={segmentData} />
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader title="Lançamentos Recentes" />
        <div className="space-y-2">
          {prodTx.slice(0, 6).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-navy-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-navy-800">{t.description}</p>
                <p className="text-xs text-navy-400">{t.category} · {new Date(t.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}R$ {t.amount.toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
