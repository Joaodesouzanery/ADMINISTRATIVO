import { MoreHorizontal, Calendar, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'
import type { KanbanCard, Priority } from '../../types'
import { Badge } from '../ui/Badge'

const priorityConfig: Record<Priority, { label: string; variant: 'danger' | 'warning' | 'info' | 'default' }> = {
  urgent: { label: 'Urgente', variant: 'danger' },
  high:   { label: 'Alta',    variant: 'warning' },
  medium: { label: 'Média',   variant: 'info' },
  low:    { label: 'Baixa',   variant: 'default' },
}

interface Props {
  card: KanbanCard
  onDragStart: () => void
  onDelete: () => void
  onEdit: () => void
}

export function KanbanCardComp({ card, onDragStart, onDelete, onEdit }: Props) {
  const [menu, setMenu] = useState(false)
  const p = priorityConfig[card.priority]

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white rounded-lg p-3 shadow-card border border-cyan-100/50 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-navy-800 leading-snug flex-1">{card.title}</p>
        <div className="relative">
          <button
            onClick={() => setMenu((m) => !m)}
            className="p-0.5 rounded text-navy-300 hover:text-navy-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal size={14} />
          </button>
          {menu && (
            <div className="absolute right-0 top-6 bg-white shadow-modal border border-navy-100 rounded-lg z-10 py-1 w-32">
              <button onClick={() => { onEdit(); setMenu(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-navy-700 hover:bg-surface">
                <Edit2 size={12} /> Editar
              </button>
              <button onClick={() => { onDelete(); setMenu(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">
                <Trash2 size={12} /> Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {card.description && (
        <p className="text-xs text-navy-400 mt-1 line-clamp-2">{card.description}</p>
      )}

      <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
        <Badge variant={p.variant}>{p.label}</Badge>
        {card.dueDate && (
          <span className="flex items-center gap-1 text-xs text-navy-400">
            <Calendar size={11} />
            {new Date(card.dueDate).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>

      {card.assignee && (
        <p className="text-xs text-navy-400 mt-1.5">{card.assignee}</p>
      )}
    </div>
  )
}
