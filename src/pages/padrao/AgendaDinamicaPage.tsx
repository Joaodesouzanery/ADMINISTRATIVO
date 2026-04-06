import { useState, useMemo } from 'react'
import { BarChart3, Calendar, Map, Users, TrendingUp, Zap, Eye, Target, Lightbulb, Link, Settings2, ArrowRight, MousePointerClick, GitBranch, MessageSquare, Clock, Gauge } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSchedulingStore } from '../../store/schedulingStore'
import { ScenarioSelector } from '../../components/scheduling/ScenarioSelector'
import { GanttChart } from '../../components/scheduling/GanttChart'
import { ScheduleGrid } from '../../components/scheduling/ScheduleGrid'
import { ResourcePanel } from '../../components/scheduling/ResourcePanel'
import { OperatorBar } from '../../components/scheduling/OperatorBar'
import { Card } from '../../components/ui/Card'

type ViewTab = 'cronograma' | 'gantt' | 'mapa'

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function AgendaDinamicaPage() {
  const { scenarios, activeScenarioId, setActiveScenario, addScenario, removeScenario } = useSchedulingStore()
  const [viewTab, setViewTab] = useState<ViewTab>('gantt')

  const scenario = useMemo(
    () => scenarios.find((s) => s.id === activeScenarioId) ?? scenarios[0],
    [scenarios, activeScenarioId]
  )

  const revenueData = useMemo(() => {
    if (!scenario) return []
    const base = scenario.kpi.receitaProjetadaAntes / 30
    return Array.from({ length: 30 }, (_, i) => ({
      day: `Dia ${i + 1}`,
      antes: Math.round(base + Math.sin(i * 0.5) * base * 0.15 + Math.random() * base * 0.05),
      depois: Math.round(base * (1 + scenario.kpi.variacaoPercentual / 100) + Math.sin(i * 0.5 + 0.3) * base * 0.12 + Math.random() * base * 0.05),
    }))
  }, [scenario])

  if (!scenario) return <div className="p-6 text-navy-500">Nenhum cenário disponível.</div>

  const handleAddScenario = () => {
    const id = `scenario-${Date.now()}`
    addScenario({
      id,
      name: `Cenário ${scenarios.length + 1}`,
      isNew: true,
      resources: scenario.resources,
      operators: scenario.operators,
      tasks: [],
      kpi: { outputGlobal: 0, receitaProjetadaAntes: 0, receitaProjetadaDepois: 0, variacaoPercentual: 0, totalEquipe: 0 },
    })
    setActiveScenario(id)
  }

  const tabs: { key: ViewTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { key: 'cronograma', label: 'Cronograma', icon: Calendar },
    { key: 'gantt', label: 'Gráfico Gantt', icon: BarChart3 },
    { key: 'mapa', label: 'Mapa', icon: Map },
  ]

  return (
    <div className="space-y-6">
      {/* Header: Scenarios + Evaluate */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-sm text-navy-500 hover:text-navy-700 flex items-center gap-1 transition-colors">
            ← Rascunhos de Cenários
          </button>
          <ScenarioSelector
            scenarios={scenarios}
            activeScenarioId={activeScenarioId}
            onSelect={setActiveScenario}
            onAdd={handleAddScenario}
            onRemove={removeScenario}
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-navy-200 rounded-lg px-4 py-2 text-sm font-medium text-navy-700 hover:border-cyan-400 transition-colors">
          <TrendingUp size={14} className="text-cyan-500" />
          Avaliar Impacto de <span className="font-semibold">{scenario.name}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-white border-cyan-200">
          <div className="flex items-center gap-2 mb-1">
            <Gauge size={16} className="text-cyan-600" />
            <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">Saída Global</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{scenario.kpi.outputGlobal.toFixed(3)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-medium text-navy-400 uppercase tracking-wider mb-1">Receita Projetada (Antes)</p>
          <p className="text-xl font-bold text-navy-800">{formatCurrency(scenario.kpi.receitaProjetadaAntes)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-medium text-navy-400 uppercase tracking-wider mb-1">Receita Projetada (Depois)</p>
          <p className="text-xl font-bold text-navy-800">{formatCurrency(scenario.kpi.receitaProjetadaDepois)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-medium text-navy-400 uppercase tracking-wider mb-1">Variação Projetada</p>
          <p className={`text-xl font-bold ${scenario.kpi.variacaoPercentual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {scenario.kpi.variacaoPercentual >= 0 ? '+' : ''}{scenario.kpi.variacaoPercentual.toFixed(2)}%
          </p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-navy-500" />
            <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">Equipe</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{scenario.kpi.totalEquipe}</p>
        </Card>
      </div>

      {/* Revenue chart */}
      <Card className="p-4">
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EBF3" />
            <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#9AAAC8" interval={4} />
            <YAxis tick={{ fontSize: 9 }} stroke="#9AAAC8" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
            <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => formatCurrency(Number(v))} />
            <Area type="monotone" dataKey="antes" stroke="#9AAAC8" fill="#E8EBF3" fillOpacity={0.3} strokeWidth={1} />
            <Area type="monotone" dataKey="depois" stroke="#22C55E" fill="#22C55E" fillOpacity={0.15} strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* View tabs */}
      <div className="flex items-center gap-1 bg-white rounded-lg border border-navy-100 p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setViewTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewTab === tab.key
                  ? 'bg-cyan-400 text-navy-800 shadow-sm'
                  : 'text-navy-500 hover:text-navy-700 hover:bg-navy-50'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Schedule content */}
      <div className="flex gap-4">
        <ResourcePanel
          resources={scenario.resources}
          operators={scenario.operators}
        />
        <div className="flex-1 space-y-4 overflow-x-auto">
          {viewTab === 'gantt' && (
            <GanttChart
              tasks={scenario.tasks}
              resources={scenario.resources}
              operators={scenario.operators}
            />
          )}
          {viewTab === 'cronograma' && (
            <ScheduleGrid
              tasks={scenario.tasks}
              resources={scenario.resources}
              operators={scenario.operators}
            />
          )}
          {viewTab === 'mapa' && (
            <Card className="p-8 flex flex-col items-center justify-center min-h-[300px]">
              <Map size={48} className="text-navy-200 mb-4" />
              <p className="text-navy-400 text-sm">Visualização de mapa — posição dos recursos</p>
              <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
                {scenario.resources.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
                    <Map size={14} className="text-cyan-500" />
                    <div>
                      <p className="text-xs font-medium text-navy-700">{r.name}</p>
                      <p className="text-[10px] text-navy-400">{r.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Operator bar */}
      <OperatorBar operators={scenario.operators} resources={scenario.resources} />

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* Explanatory sections */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {/* How it works */}
      <div className="mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-2">Como Funciona</h2>
          <p className="text-navy-500 max-w-2xl mx-auto">
            A Agenda Dinâmica permite planejar, otimizar e executar cronogramas complexos
            com visibilidade total de impacto e colaboração em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              icon: Link,
              title: 'Conectar',
              description: 'Estabeleça uma visão operacional comum em tempo real para toda a sua organização, integrando todos os dados e modelos relevantes com conectores prontos para uso.',
              color: 'from-blue-500 to-blue-600',
            },
            {
              step: '2',
              icon: Settings2,
              title: 'Definir',
              description: 'Codifique restrições, encadeie dependências e defina o comportamento ideal. Configure lógica temporal e condicional de forma visual e intuitiva.',
              color: 'from-purple-500 to-purple-600',
            },
            {
              step: '3',
              icon: Target,
              title: 'Otimizar',
              description: 'Apresente limitações e oportunidades de ações para equipes em toda a sua organização, avaliando impactos antes da implementação.',
              color: 'from-green-500 to-green-600',
            },
            {
              step: '4',
              icon: Lightbulb,
              title: 'Aprender',
              description: 'Visualize e interrogue intervenções em planos de longo prazo. Avalie decisões passadas para planejar o futuro e construir resiliência.',
              color: 'from-amber-500 to-amber-600',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.step} className="p-5 hover:shadow-kpi transition-shadow">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-navy-400 bg-navy-50 w-5 h-5 rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold text-navy-800">{item.title}</h3>
                </div>
                <p className="text-sm text-navy-500 leading-relaxed">{item.description}</p>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-navy-800 mb-6">Funcionalidades Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: MousePointerClick,
              title: 'Formulação Point-and-Click',
              description: 'Codifique suas restrições operacionais e defina o comportamento permitido e ideal em cronogramas com uma interface visual de baixo código. Configure lógica temporal e condicional diretamente na interface.',
            },
            {
              icon: Eye,
              title: 'Visibilidade Total de Impacto',
              description: 'Visualize conflitos e dependências de todas as ações (reais e propostas), permitindo avaliar impactos em processos cruzados antes da implementação e determinar alternativas viáveis durante interrupções.',
            },
            {
              icon: Zap,
              title: 'Triggers Condicionais',
              description: 'Configure lógica condicional complexa para acionar ações automaticamente em resposta a mudanças no cronograma, propagando impactos em sistemas e equipes distintas.',
            },
            {
              icon: MessageSquare,
              title: 'Colaboração em Interface Comum',
              description: 'Permita que diversos perfis de usuário — de operadores a cientistas de dados — interajam com todas as facetas do agendamento com UIs personalizáveis e interoperabilidade com plataformas externas.',
            },
            {
              icon: Clock,
              title: 'Planejamento Cross-Horizonte',
              description: 'Resolva conflitos entre planos de curto e longo prazo para atingir KPIs do negócio usando um Gráfico Gantt estilo arrastar e soltar com simulador integrado.',
            },
            {
              icon: GitBranch,
              title: 'Otimização',
              description: 'Integre com solucionadores externos de terceiros via APIs ou construa motores de recomendação personalizados para planos dinâmicos de longo prazo e para identificar oportunidades incrementais em tempo real.',
            },
          ].map((feat) => {
            const Icon = feat.icon
            return (
              <Card key={feat.title} className="p-5 hover:shadow-kpi transition-shadow">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-cyan-600" />
                </div>
                <h3 className="text-sm font-semibold text-navy-800 mb-2">{feat.title}</h3>
                <p className="text-xs text-navy-500 leading-relaxed">{feat.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
