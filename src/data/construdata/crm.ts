import type { Client, Deal } from '../../types'

export const clients: Client[] = [
  { id: 'c1', name: 'Ricardo Alves', company: 'Construtora Alves & Filhos', email: 'ricardo@alvesfilhos.com.br', phone: '(11) 98765-4321', status: 'active', segment: 'Construção Civil', value: 450000, createdAt: '2025-06-01', notes: 'Cliente premium, contrato anual.' },
  { id: 'c2', name: 'Fernanda Costa', company: 'Incorporadora FC', email: 'fernanda@incorporadorafc.com', phone: '(21) 97654-3210', status: 'active', segment: 'Incorporação', value: 780000, createdAt: '2025-08-15' },
  { id: 'c3', name: 'Grupo Habitat', company: 'Grupo Habitat S.A.', email: 'contato@grupohabitat.com', phone: '(31) 96543-2109', status: 'partner', segment: 'Real Estate', value: 1200000, createdAt: '2025-01-10' },
  { id: 'c4', name: 'Marcos Duarte', company: 'Duarte Engenharia', email: 'marcos@duarteeng.com', phone: '(41) 95432-1098', status: 'prospect', segment: 'Engenharia', value: 0, createdAt: '2026-02-20' },
  { id: 'c5', name: 'Luciana Ferreira', company: 'LF Projetos', email: 'luciana@lfprojetos.com', phone: '(51) 94321-0987', status: 'inactive', segment: 'Projetos', value: 95000, createdAt: '2024-11-05' },
  { id: 'c6', name: 'André Nascimento', company: 'Nascimento Construtora', email: 'andre@nascimentoconstrutora.com', phone: '(85) 93210-9876', status: 'active', segment: 'Construção Civil', value: 320000, createdAt: '2025-10-30' },
]

export const deals: Deal[] = [
  { id: 'd1', title: 'Sistema BIM - Construtora Alves', clientId: 'c1', clientName: 'Ricardo Alves', stage: 'negotiation', value: 180000, probability: 75, expectedClose: '2026-04-30', createdAt: '2026-02-01' },
  { id: 'd2', title: 'Gestão de Obras - FC', clientId: 'c2', clientName: 'Fernanda Costa', stage: 'proposal', value: 95000, probability: 50, expectedClose: '2026-05-15', createdAt: '2026-02-15' },
  { id: 'd3', title: 'Parceria Estratégica - Habitat', clientId: 'c3', clientName: 'Grupo Habitat', stage: 'won', value: 500000, probability: 100, expectedClose: '2026-03-01', createdAt: '2026-01-10' },
  { id: 'd4', title: 'Consultoria Inicial - Duarte', clientId: 'c4', clientName: 'Marcos Duarte', stage: 'qualified', value: 25000, probability: 30, expectedClose: '2026-06-01', createdAt: '2026-03-01' },
  { id: 'd5', title: 'Renovação Contrato - Nascimento', clientId: 'c6', clientName: 'André Nascimento', stage: 'lead', value: 340000, probability: 20, expectedClose: '2026-07-01', createdAt: '2026-03-10' },
]
