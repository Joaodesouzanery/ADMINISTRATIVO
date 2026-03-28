import { MoreHorizontal, Calendar, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'
import type { KanbanCard, Priority } from '../../types'
import { Badge } from '../ui/Badge'

const priorityConfig: Record<Priority, { label: string; variant: 'danger' | 'warning' | 'info' | 'default'; border: string }> = {
  urgent: { label: 'Urgente', variant: 'danger',  border: 'border-l-red-500' },
  high:   { label: 'Alta',    variant: 'warning', border: 'border-l-amber-500' },
  medium: { label: 'Média',   variant: 'info',    border: 'border-l-cyan-500' },
  low:    { label: 'Baixa',   variant: 'default', border: 'border-l-navy-200' },
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

  const subtasksDone = card.subtasks?.filter((s) => s.done).length ?? 0
  const subtasksTotal = card.subtasks?.length ?? 0

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`bg-white rounded-lg p-3 shadow-card border border-cyan-100/50 border-l-4 ${p.border} cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group`}
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

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {card.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-surface rounded text-[10px] text-navy-500 font-medium">{tag}</span>
          ))}
          {card.tags.length > 3 && <span className="text-[10px] text-navy-400">+{card.tags.length - 3}</span>}
        </div>
      )}

      {/* Subtask progress */}
      {subtasksTotal > 0 && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 bg-navy-100 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${(subtasksDone / subtasksTotal) * 100}%` }} />
          </div>
          <span className="text-[10px] text-navy-400">{subtasksDone}/{subtasksTotal}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
        <Badge variant={p.variant}>{p.label}</Badge>
        <div className="flex items-center gap-2">
          {card.dueDate && (
            <span className="flex items-center gap-1 text-xs text-navy-400">
              <Calendar size={11} />
              {new Date(card.dueDate).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      {card.assignee && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="w-5 h-5 rounded-full bg-navy-800 flex items-center justify-center">
            <span className="text-[9px] text-cyan-400 font-bold">{card.assignee.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</span>
          </div>
          <p className="text-xs text-navy-400">{card.assignee}</p>
        </div>
      )}
    </div>
  )
}
