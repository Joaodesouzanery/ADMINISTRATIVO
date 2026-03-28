import type { Client, Deal } from '../../types'

export const clients: Client[] = [
  { id: 'ic1', name: 'TechBrasil S.A.', company: 'TechBrasil S.A.', email: 'contato@techbrasil.com', phone: '(11) 3456-7890', status: 'active', segment: 'Tecnologia', value: 960000, createdAt: '2025-03-01' },
  { id: 'ic2', name: 'Banco Meridional', company: 'Banco Meridional', email: 'ti@bancomeridional.com.br', phone: '(21) 2345-6789', status: 'partner', segment: 'Financeiro', value: 2400000, createdAt: '2025-01-15' },
  { id: 'ic3', name: 'Logística Rápida', company: 'Logística Rápida Ltda.', email: 'dados@logisticarapida.com', phone: '(31) 9876-5432', status: 'active', segment: 'Logística', value: 480000, createdAt: '2025-07-20' },
  { id: 'ic4', name: 'Varejo Digital', company: 'Varejo Digital ME', email: 'ceo@varejodigital.io', phone: '(41) 98765-4321', status: 'prospect', segment: 'Varejo', value: 0, createdAt: '2026-03-01' },
]

export const deals: Deal[] = [
  { id: 'id1', title: 'Expansão IRIS Analytics - TechBrasil', clientId: 'ic1', clientName: 'TechBrasil S.A.', stage: 'negotiation', value: 360000, probability: 80, expectedClose: '2026-04-30', createdAt: '2026-02-01' },
  { id: 'id2', title: 'Módulo Risk IRIS - Meridional', clientId: 'ic2', clientName: 'Banco Meridional', stage: 'proposal', value: 800000, probability: 60, expectedClose: '2026-05-31', createdAt: '2026-02-20' },
  { id: 'id3', title: 'IRIS Logística - Rápida', clientId: 'ic3', clientName: 'Logística Rápida', stage: 'won', value: 240000, probability: 100, expectedClose: '2026-03-01', createdAt: '2026-01-15' },
  { id: 'id4', title: 'Demo IRIS - Varejo Digital', clientId: 'ic4', clientName: 'Varejo Digital', stage: 'lead', value: 60000, probability: 15, expectedClose: '2026-07-01', createdAt: '2026-03-05' },
]
