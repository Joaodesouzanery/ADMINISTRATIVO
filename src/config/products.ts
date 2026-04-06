export type ProductKey = 'construdata' | 'iris' | 'padrao' | 'faculdade'

export interface ModuleConfig {
  slug: string
  label: string
  icon: string
  description: string
}

export interface ProductConfig {
  key: ProductKey
  name: string
  fullName: string
  color: string
  description: string
  modules: ModuleConfig[]
}

export const MODULES: ModuleConfig[] = [
  { slug: 'projetos',    label: 'Projetos e Tarefas',   icon: 'LayoutKanban',   description: 'Kanban, metas e rotinas' },
  { slug: 'documentos',  label: 'Documentos',            icon: 'FileText',       description: 'Docs, contratos e prompts' },
  { slug: 'crm',         label: 'CRM e Mercado',         icon: 'Users',          description: 'Clientes, leads e prospecção' },
  { slug: 'financeiro',  label: 'Financeiro',            icon: 'DollarSign',     description: 'Controle financeiro e folha' },
  { slug: 'relatorios',  label: 'Relatórios',            icon: 'BarChart2',      description: 'Dashboards e analytics' },
  { slug: 'organograma', label: 'Organograma',            icon: 'Network',        description: 'Hierarquia e organização' },
  { slug: 'comercial',   label: 'Comercial',             icon: 'Briefcase',      description: 'Pipeline, funil e playbook comercial' },
]

export const PADRAO_MODULES: ModuleConfig[] = [
  { slug: 'agenda',    label: 'Agenda Dinâmica',  icon: 'CalendarRange', description: 'Agendamento dinâmico e planejamento' },
  { slug: 'regras',    label: 'Regras e Alertas', icon: 'ShieldAlert',   description: 'Regras e alertas em tempo real' },
  { slug: 'comercial', label: 'Comercial',        icon: 'Briefcase',     description: 'Pipeline geral (ConstruData + IRIS)' },
]

export const FACULDADE_MODULES: ModuleConfig[] = [
  { slug: 'materias',   label: 'Matérias',           icon: 'BookOpen',      description: 'Disciplinas e informações' },
  { slug: 'calendario', label: 'Calendário',         icon: 'CalendarDays',  description: 'Provas, atividades e datas' },
  { slug: 'atividades', label: 'Atividades',         icon: 'ClipboardList', description: 'Trabalhos, listas e entregas' },
  { slug: 'visao360',   label: 'Visão 360°',         icon: 'LayoutDashboard', description: 'Panorama geral de tudo' },
]

export const PRODUCTS: ProductConfig[] = [
  {
    key: 'construdata',
    name: 'ConstruData',
    fullName: 'Atlântico ConstruData',
    color: '#64D4E8',
    description: 'Gestão inteligente para o setor da construção civil',
    modules: MODULES,
  },
  {
    key: 'iris',
    name: 'IRIS',
    fullName: 'Atlântico IRIS',
    color: '#7DD4A8',
    description: 'Plataforma de inteligência e dados empresariais',
    modules: MODULES,
  },
  {
    key: 'padrao',
    name: 'Padrão',
    fullName: 'Atlântico Padrão',
    color: '#F59E0B',
    description: 'Módulo administrativo geral com agendamento dinâmico e alertas',
    modules: PADRAO_MODULES,
  },
  {
    key: 'faculdade',
    name: 'Faculdade',
    fullName: 'Atlântico Faculdade',
    color: '#8B5CF6',
    description: 'Gestão acadêmica: matérias, provas, atividades e alertas',
    modules: FACULDADE_MODULES,
  },
]

export const getProduct = (key: ProductKey) => PRODUCTS.find(p => p.key === key)!
