import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle2, Clock, Shield, FlaskConical, GitPullRequest, Plug, Brain, Quote, ChevronDown, ChevronUp, XCircle, Info } from 'lucide-react'
import { useRulesStore } from '../../store/rulesStore'
import { RuleList } from '../../components/rules/RuleList'
import { RuleEditor } from '../../components/rules/RuleEditor'
import { Card } from '../../components/ui/Card'
import type { Alert as AlertType, RuleProposal } from '../../types'

type SideTab = 'regras' | 'alertas' | 'propostas'

const SEVERITY_CONFIG = {
  critical: { label: 'Crítico', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  warning: { label: 'Atenção', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertTriangle },
  info: { label: 'Info', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Bell },
}

const PROPOSAL_STATUS_CONFIG = {
  pendente: { label: 'Pendente', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  aprovada: { label: 'Aprovada', color: 'bg-green-50 text-green-600 border-green-200' },
  rejeitada: { label: 'Rejeitada', color: 'bg-red-50 text-red-600 border-red-200' },
}

export function RegrasAlertasPage() {
  const {
    rules, activeRuleId, alerts, proposals,
    setActiveRule, updateRule, removeRule, resolveAlert,
  } = useRulesStore()
  const [sideTab, setSideTab] = useState<SideTab>('regras')
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)

  const activeRule = rules.find((r) => r.id === activeRuleId)
  const unresolvedAlerts = alerts.filter((a) => !a.resolved)
  const pendingProposals = proposals.filter((p) => p.status === 'pendente')

  const sideTabs: { key: SideTab; label: string; count?: number }[] = [
    { key: 'regras', label: 'Regras' },
    { key: 'alertas', label: 'Alertas', count: unresolvedAlerts.length },
    { key: 'propostas', label: 'Propostas', count: pendingProposals.length },
  ]

  return (
    <div className="space-y-6">
      {/* Local-only warning */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-amber-800">Armazenamento local apenas</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Regras e alertas deste módulo são salvos apenas neste navegador por enquanto.
            Eles não sincronizam entre dispositivos nem são persistidos na nuvem.
          </p>
        </div>
      </div>

      {/* Main two-panel layout */}
      <div className="flex gap-0 bg-white rounded-xl border border-navy-100 overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Left panel */}
        <div className="w-80 shrink-0 border-r border-navy-100 flex flex-col">
          {/* Tab selector */}
          <div className="flex border-b border-navy-100">
            {sideTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSideTab(tab.key)}
                className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors relative ${
                  sideTab === tab.key
                    ? 'text-cyan-600 border-b-2 border-cyan-400'
                    : 'text-navy-500 hover:text-navy-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {sideTab === 'regras' && (
              <RuleList rules={rules} activeRuleId={activeRuleId} onSelect={setActiveRule} />
            )}

            {sideTab === 'alertas' && (
              <div className="p-3 space-y-2">
                {alerts.map((alert) => {
                  const config = SEVERITY_CONFIG[alert.severity]
                  const Icon = config.icon
                  const isExpanded = expandedAlert === alert.id

                  return (
                    <div
                      key={alert.id}
                      className={`border rounded-lg overflow-hidden transition-colors ${
                        alert.resolved ? 'opacity-60 border-navy-100' : `border-l-4 ${config.color}`
                      }`}
                    >
                      <button
                        onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                        className="w-full text-left px-3 py-2.5 flex items-start gap-2"
                      >
                        {alert.resolved ? (
                          <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <Icon size={14} className="mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-navy-700 truncate">{alert.ruleName}</p>
                          <p className="text-[10px] text-navy-400 mt-0.5">
                            {new Date(alert.triggeredAt).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {isExpanded ? <ChevronUp size={12} className="text-navy-300" /> : <ChevronDown size={12} className="text-navy-300" />}
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-navy-50">
                          <p className="text-[11px] text-navy-600 leading-relaxed">{alert.message}</p>
                          {alert.resolved && alert.resolution && (
                            <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1">
                              <CheckCircle2 size={10} />
                              {alert.resolution}
                            </p>
                          )}
                          {!alert.resolved && (
                            <button
                              onClick={() => resolveAlert(alert.id, 'Resolvido manualmente')}
                              className="mt-2 text-[10px] text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                            >
                              Marcar como resolvido
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {sideTab === 'propostas' && (
              <div className="p-3 space-y-2">
                {proposals.map((prop) => {
                  const statusConfig = PROPOSAL_STATUS_CONFIG[prop.status]
                  return (
                    <div key={prop.id} className="border border-navy-100 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-navy-700">{prop.ruleName}</p>
                          <p className="text-[10px] text-navy-400 mt-0.5">por {prop.author}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-navy-500 mt-2 leading-relaxed">{prop.description}</p>
                      <p className="text-[10px] text-navy-300 mt-1.5">
                        {new Date(prop.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — Rule editor */}
        <div className="flex-1 overflow-hidden">
          {activeRule ? (
            <RuleEditor
              rule={activeRule}
              onUpdate={(updates) => updateRule(activeRule.id, updates)}
              onDelete={() => removeRule(activeRule.id)}
              onReset={() => {}}
              onSubmit={() => {}}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-navy-400">
              <div className="text-center">
                <Shield size={48} className="mx-auto mb-3 text-navy-200" />
                <p className="text-sm">Selecione uma regra para editar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* Explanatory sections */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {/* Header */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-navy-800 mb-2">
          Regras & Alertas em Tempo Real
        </h2>
        <p className="text-navy-500 max-w-2xl mx-auto">
          Crie alertas conscientes de objetos com regras feitas pelos seus especialistas.
          Conecte alertas a ações em toda a sua organização de forma integrada.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Shield,
            title: 'Criação Flexível de Regras',
            description: 'As entradas das regras podem ser conjuntos de dados, objetos da ontologia da sua organização e séries temporais. Seus usuários não-técnicos criam regras dentro de uma representação intuitiva do seu negócio.',
          },
          {
            icon: FlaskConical,
            title: 'Backtesting em Dados Históricos',
            description: 'Use dados históricos para realizar backtesting de regras potenciais e faça o deploy para produção com confiança, validando o comportamento antes da implementação.',
          },
          {
            icon: GitPullRequest,
            title: 'Propostas de Regras',
            description: 'Aplique princípios de desenvolvimento de software para propor e atualizar regras em um framework de pull request, permitindo múltiplas solicitações simultâneas de mudança, cada uma revisável e monitorável.',
          },
          {
            icon: Plug,
            title: 'Integrações Avançadas',
            description: 'As regras podem gerar alertas na plataforma e integrar com softwares de terceiros (ex: resposta a incidentes) para exibir alertas via SMS e outros métodos, garantindo que cheguem aos tomadores de decisão.',
          },
          {
            icon: Brain,
            title: 'Resolução de Alertas por Modelo',
            description: 'O sistema captura o histórico de todas as decisões tomadas com base em alertas e alimenta modelos, permitindo sugestões inteligentes de remediação ou ação automática, reduzindo o tempo de resposta.',
          },
          {
            icon: Clock,
            title: 'Monitoramento em Tempo Real',
            description: 'Configure condições de streaming com limiares de fórmulas para detectar tendências ou eventos ao longo de semanas ou meses, identificados a partir de seus dados de streaming em tempo real.',
          },
        ].map((feat) => {
          const Icon = feat.icon
          return (
            <Card key={feat.title} className="p-5 hover:shadow-kpi transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                <Icon size={18} className="text-amber-600" />
              </div>
              <h3 className="text-sm font-semibold text-navy-800 mb-2">{feat.title}</h3>
              <p className="text-xs text-navy-500 leading-relaxed">{feat.description}</p>
            </Card>
          )
        })}
      </div>

      {/* Testimonial */}
      <Card className="p-6 bg-gradient-to-r from-navy-800 to-navy-700 border-navy-600">
        <div className="flex items-start gap-4">
          <Quote size={32} className="text-cyan-400 shrink-0 opacity-60" />
          <div>
            <p className="text-sm text-navy-100 leading-relaxed italic">
              "Precisávamos de um sistema para destacar tendências ou eventos ao longo de semanas ou meses,
              identificáveis a partir dos nossos dados de streaming. Já temos mais de 100 regras configuradas,
              permitindo vigilância eficiente de múltiplos aspectos da operação que compreende mais de 100
              itens de equipamento. A flexibilidade e a abordagem visual de baixo código tornaram a adoção
              e implantação muito mais fáceis."
            </p>
            <p className="text-xs text-cyan-400 mt-3 font-medium">
              — Gerente de Produto Principal, Empresa de Energia
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
