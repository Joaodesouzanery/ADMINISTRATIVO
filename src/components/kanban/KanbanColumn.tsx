import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { KanbanCard, KanbanColumn } from '../../types'
import { KanbanCardComp } from './KanbanCard'

interface Props {
  column: KanbanColumn
  cards: KanbanCard[]
  isDragOver: boolean
  onDragStart: (id: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: () => void
  onDragLeave: () => void
  onAddCard: (card: Omit<KanbanCard, 'id' | 'createdAt' | 'columnId'>) => void
  onDeleteCard: (id: string) => void
  onEditCard: (card: KanbanCard) => void
}

export function KanbanColumnComp({ column, cards, isDragOver, onDragStart, onDragOver, onDrop, onDragLeave, onAddCard, onDeleteCard, onEditCard }: Props) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = () => {
    if (!newTitle.trim()) return
    onAddCard({ title: newTitle.trim(), priority: 'medium', status: 'todo' })
    setNewTitle('')
    setAdding(false)
  }

  return (
    <div
      className={`flex flex-col w-72 shrink-0 rounded-xl transition-colors ${isDragOver ? 'kanban-drag-over' : 'bg-surface-secondary'}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="font-semibold text-sm text-navy-700">{column.title}</span>
          <span className="text-xs bg-navy-100 text-navy-500 px-1.5 py-0.5 rounded-full">{cards.length}</span>
        </div>
        <button onClick={() => setAdding(true)} className="p-1 rounded text-navy-400 hover:text-navy-800 hover:bg-white transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 px-2 pb-2 min-h-[60px] flex-1">
        {cards.map((card) => (
          <KanbanCardComp
            key={card.id}
            card={card}
            onDragStart={() => onDragStart(card.id)}
            onDelete={() => onDeleteCard(card.id)}
            onEdit={() => onEditCard(card)}
          />
        ))}

        {adding && (
          <div className="bg-white rounded-lg p-2 shadow-card border border-cyan-200">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
              placeholder="Título da tarefa..."
              className="w-full text-sm outline-none text-navy-800 placeholder-navy-300"
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleAdd} className="text-xs bg-cyan-400 text-navy-800 px-2 py-1 rounded font-medium hover:bg-cyan-300">Adicionar</button>
              <button onClick={() => { setAdding(false); setNewTitle('') }} className="text-xs text-navy-400 hover:text-navy-700">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
