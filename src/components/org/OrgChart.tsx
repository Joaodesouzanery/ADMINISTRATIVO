import { Plus, Edit2, Trash2, Building2, User, Users, Briefcase, Network } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { OrgNode, OrgNodeType } from '../../types'

const typeConfig: Record<OrgNodeType, { label: string; color: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  company:    { label: 'Empresa',      color: 'bg-navy-800',   icon: Building2 },
  department: { label: 'Departamento', color: 'bg-cyan-500',   icon: Network },
  person:     { label: 'Pessoa',       color: 'bg-green-500',  icon: User },
  client:     { label: 'Cliente',      color: 'bg-amber-500',  icon: Briefcase },
  associate:  { label: 'Associado',    color: 'bg-purple-500', icon: Users },
}

interface Props {
  nodes: OrgNode[]
  onAdd: (parentId: string | null) => void
  onEdit: (node: OrgNode) => void
  onDelete: (id: string) => void
}

function OrgNodeComp({ node, children, onAdd, onEdit, onDelete }: {
  node: OrgNode
  children: OrgNode[]
  onAdd: (parentId: string | null) => void
  onEdit: (node: OrgNode) => void
  onDelete: (id: string) => void
  allNodes: OrgNode[]
}) {
  const config = typeConfig[node.type]
  const Icon = config.icon
  const childNodes = children.filter((n) => n.parentId === node.id)

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <div className="relative bg-white rounded-xl shadow-card border border-cyan-100/50 p-3 min-w-[180px] max-w-[220px] group hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-7 h-7 rounded-lg ${config.color} flex items-center justify-center`}>
            <Icon size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-navy-800 text-xs truncate">{node.label}</p>
            {node.role && <p className="text-[10px] text-navy-400 truncate">{node.role}</p>}
          </div>
        </div>
        <Badge variant="default">{config.label}</Badge>

        {/* Actions on hover */}
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onAdd(node.id)} className="w-5 h-5 rounded-full bg-cyan-400 text-white flex items-center justify-center shadow-sm hover:bg-cyan-500"><Plus size={10} /></button>
          <button onClick={() => onEdit(node)} className="w-5 h-5 rounded-full bg-navy-600 text-white flex items-center justify-center shadow-sm hover:bg-navy-700"><Edit2 size={10} /></button>
          <button onClick={() => onDelete(node.id)} className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600"><Trash2 size={10} /></button>
        </div>
      </div>

      {/* Children */}
      {childNodes.length > 0 && (
        <>
          {/* Vertical line down */}
          <div className="w-px h-6 bg-navy-200" />
          {/* Horizontal connector + children */}
          <div className="relative flex gap-4">
            {/* Horizontal line across */}
            {childNodes.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-navy-200" style={{ width: `calc(100% - 180px)` }} />
            )}
            {childNodes.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-navy-200" />
                <OrgNodeComp node={child} children={children} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} allNodes={children} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function OrgChart({ nodes, onAdd, onEdit, onDelete }: Props) {
  const roots = nodes.filter((n) => !n.parentId)

  if (nodes.length === 0) {
    return (
      <div className="py-20 text-center text-navy-400">
        <Network size={48} className="mx-auto mb-3 opacity-30" />
        <p className="mb-4">Nenhum nó no organograma.</p>
        <button onClick={() => onAdd(null)} className="px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors inline-flex items-center gap-2">
          <Plus size={14} /> Adicionar Raiz
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-8">
      <div className="flex gap-8 justify-center min-w-fit pt-4">
        {roots.map((root) => (
          <OrgNodeComp key={root.id} node={root} children={nodes} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} allNodes={nodes} />
        ))}
      </div>
    </div>
  )
}
