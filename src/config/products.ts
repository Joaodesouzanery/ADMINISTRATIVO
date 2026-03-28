export type ProductKey = 'construdata' | 'iris'

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
]

export const getProduct = (key: ProductKey) => PRODUCTS.find(p => p.key === key)!
