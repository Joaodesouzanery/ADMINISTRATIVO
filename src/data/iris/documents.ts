import type { Document } from '../../types'

export const documents: Document[] = [
  { id: 'idoc1', title: 'Arquitetura de Sistema IRIS v4.0', type: 'document', category: 'Técnico', version: '4.0', createdAt: '2026-02-01', updatedAt: '2026-03-10', tags: ['Arquitetura', 'Técnico'] },
  { id: 'idoc2', title: 'SLA - TechBrasil S.A.', type: 'contract', category: 'Contratos', version: '1.2', createdAt: '2025-03-01', updatedAt: '2026-03-01', tags: ['SLA', 'Ativo'] },
  { id: 'idoc3', title: 'Relatório de Performance Q1 2026', type: 'report', category: 'Relatórios', version: '1.0', createdAt: '2026-03-25', updatedAt: '2026-03-25', tags: ['Performance', 'Q1'] },
  { id: 'idoc4', title: 'Prompt: Análise Preditiva de Churn', type: 'prompt', category: 'IA - Analytics', content: 'Analise os seguintes dados de uso da plataforma e identifique clientes em risco de churn nos próximos 90 dias. Dados: {dados_uso}. Forneça: score de risco, principais indicadores e ações recomendadas.', version: '2.0', createdAt: '2026-01-15', updatedAt: '2026-02-20', tags: ['IA', 'Churn'] },
  { id: 'idoc5', title: 'Prompt: Geração de Insights de Mercado', type: 'prompt', category: 'IA - Mercado', content: 'Com base nos dados de mercado a seguir, gere insights estratégicos sobre tendências, oportunidades e ameaças para o setor de {setor}. Dados: {dados_mercado}.', version: '1.1', createdAt: '2026-02-05', updatedAt: '2026-03-01', tags: ['IA', 'Mercado'] },
  { id: 'idoc6', title: 'Manual de Integração API IRIS', type: 'document', category: 'Documentação', version: '3.2', createdAt: '2025-08-01', updatedAt: '2026-02-15', tags: ['API', 'Integração'] },
]
