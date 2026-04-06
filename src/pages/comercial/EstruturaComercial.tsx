import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Building2, BarChart3, Users, Target, DollarSign, Megaphone, Shield, Briefcase, TrendingUp } from 'lucide-react'

const FUNNEL = [
  {
    n: 1, stage: 'Prospecção', role: 'BDR',
    desc: 'Identificação de potenciais clientes (prefeituras, empresas) que se encaixam no ICP.',
    b2g: 'Identificação de contato chave e necessidade inicial.',
    b2b: 'Identificação de contato chave e necessidade inicial.',
  },
  {
    n: 2, stage: 'Qualificação (SQL)', role: 'SDR/BDR',
    desc: 'Validação da oportunidade: Budget, Authority, Need, Timeline (BANT).',
    b2g: 'Reunião agendada com decisor e confirmação de BANT.',
    b2b: 'Reunião agendada com decisor e confirmação de BANT.',
  },
  {
    n: 3, stage: 'Descoberta / Diagnóstico', role: 'AE',
    desc: 'Entendimento aprofundado das dores, desafios e objetivos do cliente.',
    b2g: 'Documento de levantamento de necessidades assinado/validado.',
    b2b: 'Documento de levantamento de necessidades assinado/validado.',
  },
  {
    n: 4, stage: 'Demonstração / POC', role: 'AE',
    desc: 'Apresentação da solução focando em como ela resolve as dores específicas do cliente. POC se necessário.',
    b2g: 'Cliente engajado na demo/POC, feedback positivo e solicitação de proposta.',
    b2b: 'Cliente engajado na demo/POC, feedback positivo e solicitação de proposta.',
  },
  {
    n: 5, stage: 'Proposta / Negociação', role: 'AE',
    desc: 'Elaboração e apresentação da proposta comercial. Negociação de termos e condições.',
    b2g: 'Proposta formalmente apresentada e em discussão.',
    b2b: 'Proposta formalmente apresentada e em discussão.',
  },
  {
    n: 6, stage: 'Apoio à Licitação (B2G)', role: 'AE + Jurídico',
    desc: 'Auxílio na elaboração do Termo de Referência (TR) e acompanhamento do processo licitatório.',
    b2g: 'Edital publicado com requisitos alinhados à solução.',
    b2b: 'N/A',
  },
  {
    n: 7, stage: 'Fechamento', role: 'AE',
    desc: 'Assinatura do contrato.',
    b2g: 'Contrato assinado.',
    b2b: 'Contrato assinado.',
  },
  {
    n: 8, stage: 'Onboarding / Implementação', role: 'CSM',
    desc: 'Configuração da plataforma, treinamento da equipe do cliente.',
    b2g: 'Cliente com acesso à plataforma e treinamento inicial concluído.',
    b2b: 'Cliente com acesso à plataforma e treinamento inicial concluído.',
  },
  {
    n: 9, stage: 'Sucesso do Cliente', role: 'CSM',
    desc: 'Acompanhamento contínuo, garantia de adoção, identificação de upsell / cross-sell.',
    b2g: 'Cliente satisfeito, uso contínuo da plataforma, renovação de contrato.',
    b2b: 'Cliente satisfeito, uso contínuo da plataforma, renovação de contrato.',
  },
]

const KPIS = [
  { title: 'Taxa de Conversão MQL → SQL', desc: 'Leads qualificados pelo marketing que viram oportunidades.', target: '30–40%' },
  { title: 'Taxa de Conversão SQL → Win', desc: 'Oportunidades qualificadas que fecham.', target: '20–25%' },
  { title: 'Ciclo de Venda (dias)', desc: 'Tempo médio do primeiro contato ao fechamento.', target: 'B2B: 60d · B2G: 180d' },
  { title: 'Ticket Médio (R$)', desc: 'Valor médio por contrato assinado.', target: 'Varia por segmento' },
  { title: 'CAC', desc: 'Custo de Aquisição de Cliente.', target: '< 1/3 do LTV' },
  { title: 'LTV', desc: 'Lifetime Value do cliente.', target: '> 3× CAC' },
  { title: 'Pipeline Velocity', desc: '(# oportunidades × ticket × win rate) / ciclo de venda.', target: 'Crescimento mensal' },
  { title: 'Churn Anual', desc: 'Clientes perdidos vs base total.', target: '< 10%' },
  { title: 'Net Revenue Retention', desc: 'Crescimento da base existente (upsell − churn).', target: '> 110%' },
]

const COMISSAO = [
  { role: 'BDR — Business Development', base: 'Fixo', variavel: 'R$ 150–300 por MQL qualificado aceito', kpi: 'MQLs gerados / mês' },
  { role: 'SDR — Sales Development',    base: 'Fixo', variavel: 'R$ 300–600 por SQL entregue e aceito pelo AE', kpi: 'SQLs entregues / mês' },
  { role: 'AE — Account Executive',     base: 'Fixo', variavel: '8–12% sobre MRR fechado (acelerador acima da meta)', kpi: 'MRR novo / trimestre' },
  { role: 'CSM — Customer Success',     base: 'Fixo', variavel: 'Bônus trimestral por NRR > 110% + 5% sobre upsell', kpi: 'NRR, NPS, taxa de adoção' },
  { role: 'Sales Leader',               base: 'Fixo', variavel: 'Bônus sobre bateção de meta agregada do time', kpi: 'Meta do time' },
]

type SubTab = 'comparativo' | 'funil' | 'stack' | 'kpis' | 'comissao'

export function EstruturaComercial() {
  const [subTab, setSubTab] = useState<SubTab>('comparativo')

  const tabs: { key: SubTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { key: 'comparativo', label: 'Comparativo',  icon: BarChart3 },
    { key: 'funil',       label: 'Funil',        icon: Target },
    { key: 'stack',       label: 'Stack B2G',    icon: Shield },
    { key: 'kpis',        label: 'KPIs',         icon: TrendingUp },
    { key: 'comissao',    label: 'Comissão',     icon: DollarSign },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-navy-800">Estrutura Comercial</h2>
        <p className="text-xs text-navy-400">Referência estratégica — playbooks, funil, KPIs e comissionamento.</p>
      </div>

      <div className="flex bg-white rounded-xl border border-cyan-100 p-1 shadow-card overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${subTab === t.key ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}
            >
              <Icon size={14} /> {t.label}
            </button>
          )
        })}
      </div>

      {subTab === 'comparativo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Building2 size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-navy-800">B2G — Governo</h3>
                <p className="text-xs text-navy-400">Business to Government</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-navy-600">
              <li>• Ciclo de venda longo (6–18 meses)</li>
              <li>• Necessidade de apoio em licitação</li>
              <li>• Stakeholders políticos e técnicos</li>
              <li>• Formalismo e compliance elevados</li>
              <li>• Ticket alto, renovação por mandato</li>
              <li>• Processo via edital / termo de referência</li>
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Briefcase size={20} className="text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-navy-800">B2B — Empresas</h3>
                <p className="text-xs text-navy-400">Business to Business</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-navy-600">
              <li>• Ciclo de venda médio (1–6 meses)</li>
              <li>• Decisão mais direta (C-level)</li>
              <li>• Stakeholders técnicos e operacionais</li>
              <li>• Foco em ROI e eficiência</li>
              <li>• Ticket variável, renovação anual</li>
              <li>• Contrato MSA / SaaS padrão</li>
            </ul>
          </Card>
        </div>
      )}

      {subTab === 'funil' && (
        <div className="space-y-3">
          {FUNNEL.map((step) => (
            <Card key={step.n}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-navy-800 text-cyan-400 flex items-center justify-center font-bold text-lg shrink-0">
                  {step.n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-navy-800">{step.stage}</h3>
                    <Badge variant="info">{step.role}</Badge>
                  </div>
                  <p className="text-sm text-navy-500 mb-3">{step.desc}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <p className="text-xs font-semibold text-amber-700 mb-1">🏛 B2G</p>
                      <p className="text-xs text-navy-600">{step.b2g}</p>
                    </div>
                    <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-lg">
                      <p className="text-xs font-semibold text-cyan-700 mb-1">🏢 B2B</p>
                      <p className="text-xs text-navy-600">{step.b2b}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {subTab === 'stack' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-navy-800 mb-2 flex items-center gap-2">
              <Megaphone size={16} className="text-amber-600" /> Mensagem Central
            </h3>
            <p className="text-base font-semibold text-amber-700 mb-3">Resiliência, Transparência e Eficiência Pública</p>
            <p className="text-sm text-navy-600 mb-2">
              <strong>Foco:</strong> Não venda software, venda a capacidade de proteger vidas, otimizar recursos públicos e garantir a continuidade dos serviços em momentos de crise.
            </p>
            <p className="text-sm text-navy-600">
              <strong>Linguagem:</strong> Formal, técnica, alinhada com terminologia governamental (LGPD, e-PING, Plano Diretor, Defesa Civil).
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2">
                <Users size={16} className="text-cyan-600" /> Stakeholders
              </h3>
              <ul className="space-y-1.5 text-sm text-navy-600">
                <li>• Secretários (Planejamento, Obras, Defesa Civil, Meio Ambiente)</li>
                <li>• Prefeitos e Vereadores</li>
                <li>• Diretores de TI</li>
                <li>• Procuradores</li>
              </ul>
            </Card>
            <Card>
              <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2">
                <Megaphone size={16} className="text-cyan-600" /> Canais de Prospecção
              </h3>
              <ul className="space-y-1.5 text-sm text-navy-600">
                <li>• Eventos governamentais (congressos de municípios)</li>
                <li>• Workshops com associações (CNM, FNP)</li>
                <li>• Publicações acadêmicas (UnB)</li>
                <li>• Webinars sobre gestão de riscos e cidades inteligentes</li>
              </ul>
            </Card>
          </div>

          <Card>
            <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2">
              <Target size={16} className="text-cyan-600" /> Qualificação Adicional
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-sm font-semibold text-navy-800">Engajamento Político</p>
                <p className="text-xs text-navy-500">Há vontade política para investir em tecnologia e resiliência?</p>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-sm font-semibold text-navy-800">Maturidade Digital</p>
                <p className="text-xs text-navy-500">Qual o nível de digitalização atual do município?</p>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-sm font-semibold text-navy-800">Histórico de Crises</p>
                <p className="text-xs text-navy-500">O município já enfrentou desastres que justifiquem urgência?</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-cyan-600" /> Abordagem de Vendas
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-sm font-semibold text-navy-800">Venda Consultiva</p>
                <p className="text-xs text-navy-500">Reuniões de diagnóstico aprofundadas.</p>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-sm font-semibold text-navy-800">Demonstração de Valor</p>
                <p className="text-xs text-navy-500">Cases de sucesso com ROI social e econômico.</p>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-sm font-semibold text-navy-800">Apoio à Licitação</p>
                <p className="text-xs text-navy-500">Suporte técnico para elaboração do TR.</p>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-sm font-semibold text-navy-800">Negociação</p>
                <p className="text-xs text-navy-500">Flexibilidade em modelos de precificação e prazos.</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {subTab === 'kpis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {KPIS.map((k) => (
            <Card key={k.title}>
              <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide mb-1">KPI</p>
              <h3 className="font-bold text-navy-800 text-sm mb-2">{k.title}</h3>
              <p className="text-xs text-navy-500 mb-3">{k.desc}</p>
              <div className="pt-2 border-t border-navy-50">
                <p className="text-xs text-navy-400">Meta</p>
                <p className="text-sm font-semibold text-navy-800">{k.target}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {subTab === 'comissao' && (
        <div className="space-y-3">
          <Card>
            <p className="text-sm text-navy-600">
              Modelo de comissionamento por papel na cadeia comercial. Base + variável calibrada para incentivar cada etapa do funil.
            </p>
          </Card>
          {COMISSAO.map((c) => (
            <Card key={c.role}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-bold text-navy-800 mb-1">{c.role}</h3>
                  <p className="text-xs text-navy-400">KPI principal: {c.kpi}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default">Base: {c.base}</Badge>
                  <Badge variant="success">{c.variavel}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
