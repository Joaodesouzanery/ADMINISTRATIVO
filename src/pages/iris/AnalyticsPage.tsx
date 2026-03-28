import { useFinancialStore } from '../../store/financialStore'
import { useTaskStore } from '../../store/taskStore'
import { useCRMStore } from '../../store/crmStore'
import { Card, CardHeader } from '../../components/ui/Card'
import { KPICard } from '../../components/ui/KPICard'
import { BarChart, PieChart, LineChart } from '../../components/charts/Charts'
import { TrendingUp, Users, Kanban, DollarSign } from 'lucide-react'

const PRODUCT = 'iris' as const
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
  const mrr = prodTx.filter((t) => t.type === 'income' && t.category === 'Assinaturas' && t.paid).reduce((s, t) => s + t.amount, 0)

  const mrrData = MONTHS.map((label, i) => ({
    label,
    value: 200000 + i * 18000 + Math.sin(i * 0.7) * 30000,
  }))

  const tasksByStatus = [
    { label: 'Backlog', value: prodCards.filter((c) => c.columnId === 'col-1').length },
    { label: 'Dev', value: prodCards.filter((c) => c.columnId === 'col-2').length },
    { label: 'QA', value: prodCards.filter((c) => c.columnId === 'col-3').length },
    { label: 'Produção', value: prodCards.filter((c) => c.columnId === 'col-4').length },
  ]

  const dealsByStage = [
    { label: 'Lead', value: prodDeals.filter((d) => d.stage === 'lead').length },
    { label: 'Qualificado', value: prodDeals.filter((d) => d.stage === 'qualified').length },
    { label: 'Proposta', value: prodDeals.filter((d) => d.stage === 'proposal').length },
    { label: 'Ganho', value: prodDeals.filter((d) => d.stage === 'won').length },
  ].filter((d) => d.value > 0)

  const uptimeData = MONTHS.map((label) => ({
    label,
    value: 99.5 + Math.random() * 0.45,
  }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="MRR" value={`R$ ${(mrr / 1000).toFixed(0)}k`} subtitle="Receita mensal recorrente" trend={18} icon={<DollarSign size={18} />} />
        <KPICard title="Clientes Ativos" value={activeClients} subtitle="Incluindo parceiros" trend={12} icon={<Users size={18} />} />
        <KPICard title="Features em Produção" value={doneTasks} subtitle="Deployadas" icon={<Kanban size={18} />} />
        <KPICard title="ARR Projetado" value={`R$ ${(totalIncome * 12 / 1000000).toFixed(1)}M`} subtitle="Anualizado" trend={22} icon={<TrendingUp size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Crescimento MRR" subtitle="Últimos 12 meses" />
          <LineChart data={mrrData} />
        </Card>
        <Card>
          <CardHeader title="Tarefas por Status" />
          <BarChart data={tasksByStatus} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Pipeline por Estágio" />
          <PieChart data={dealsByStage} />
        </Card>
        <Card>
          <CardHeader title="Uptime da Plataforma (%)" subtitle="Meta: 99.9%" />
          <LineChart data={uptimeData} />
        </Card>
      </div>

      <Card>
        <CardHeader title="Últimas Transações" />
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
