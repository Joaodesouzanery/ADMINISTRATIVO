import type { Document } from '../../types'

export const documents: Document[] = [
  { id: 'doc1', title: 'Contrato Prestação de Serviços - Grupo Habitat', type: 'contract', category: 'Contratos', version: '2.1', createdAt: '2026-01-10', updatedAt: '2026-02-15', tags: ['Contrato', 'Ativo'] },
  { id: 'doc2', title: 'Manual BIM ConstruData v3.0', type: 'document', category: 'Manuais', version: '3.0', createdAt: '2025-12-01', updatedAt: '2026-03-01', tags: ['BIM', 'Manual'] },
  { id: 'doc3', title: 'Relatório Técnico - Torre A', type: 'report', category: 'Relatórios', version: '1.0', createdAt: '2026-03-15', updatedAt: '2026-03-15', tags: ['Torre A', 'Técnico'] },
  { id: 'doc4', title: 'NDA - Construtora Alves', type: 'contract', category: 'Contratos', version: '1.0', createdAt: '2025-06-01', updatedAt: '2025-06-01', tags: ['NDA', 'Confidencial'] },
  { id: 'doc5', title: 'Prompt: Análise de Viabilidade Construtiva', type: 'prompt', category: 'IA - Engenharia', content: 'Analise a viabilidade técnica e financeira do seguinte projeto de construção, considerando: normas ABNT, custos de material na região, prazo de execução e retorno sobre investimento. Projeto: {projeto}', version: '1.2', createdAt: '2026-02-10', updatedAt: '2026-03-05', tags: ['IA', 'Engenharia'] },
  { id: 'doc6', title: 'Prompt: Geração de Cronograma', type: 'prompt', category: 'IA - Planejamento', content: 'Crie um cronograma físico-financeiro detalhado para obra de {tipo} com {área}m², prazo de {meses} meses e orçamento de R$ {valor}. Considere: etapas de construção, marcos, riscos e contingências.', version: '1.0', createdAt: '2026-01-20', updatedAt: '2026-01-20', tags: ['IA', 'Planejamento'] },
  { id: 'doc7', title: 'Política de Segurança do Trabalho', type: 'document', category: 'Políticas', version: '4.0', createdAt: '2025-01-15', updatedAt: '2026-01-15', tags: ['Segurança', 'RH'] },
  { id: 'doc8', title: 'Proposta Comercial - Duarte Engenharia', type: 'document', category: 'Comercial', version: '1.0', createdAt: '2026-03-01', updatedAt: '2026-03-05', tags: ['Proposta', 'Comercial'] },
]
