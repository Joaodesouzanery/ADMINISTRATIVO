import { Plus } from 'lucide-react'
import type { RuleObjectNode } from '../../types'

interface ObjectHierarchyProps {
  nodes: RuleObjectNode[]
}

export function ObjectHierarchy({ nodes }: ObjectHierarchyProps) {
  const roots = nodes.filter((n) => !n.parentId)
  const getChildren = (parentId: string) => nodes.filter((n) => n.parentId === parentId)

  const renderNode = (node: RuleObjectNode, depth: number) => {
    const children = getChildren(node.id)
    return (
      <div key={node.id} className="flex flex-col items-start">
        {depth > 0 && (
          <div className="flex items-center ml-8">
            <div className="w-px h-4 bg-navy-200" />
          </div>
        )}
        <div
          className="flex items-center gap-2 border border-navy-200 rounded-lg px-4 py-2.5 bg-white hover:border-cyan-300 transition-colors cursor-pointer shadow-sm"
          style={{ marginLeft: `${depth * 48}px` }}
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold ${
            node.type === 'assignment' ? 'bg-blue-500' :
            node.type === 'operator' ? 'bg-indigo-500' :
            node.type === 'task' ? 'bg-green-500' :
            'bg-purple-500'
          }`}>
            {node.type === 'assignment' ? '📋' :
             node.type === 'operator' ? '👤' :
             node.type === 'task' ? '📌' : '📦'}
          </div>
          <span className="text-sm font-medium text-navy-700">{node.label}</span>
          <span className="text-navy-300 ml-1">▾</span>
        </div>

        {children.length > 0 && (
          <div className="flex flex-col">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}

        {/* Add button connector */}
        <div className="flex items-center" style={{ marginLeft: `${(depth + 1) * 48}px` }}>
          <div className="w-px h-3 bg-navy-200 ml-4" />
        </div>
        <button
          className="flex items-center gap-1 text-navy-300 hover:text-cyan-500 transition-colors ml-4"
          style={{ marginLeft: `${(depth + 1) * 48}px` }}
        >
          <Plus size={12} />
        </button>
      </div>
    )
  }

  return (
    <div className="py-3 space-y-1">
      {roots.map((root) => renderNode(root, 0))}
    </div>
  )
}
