import { useRef, useState } from 'react'
import type { KanbanCard, KanbanColumn } from '../../types'
import { KanbanColumnComp } from './KanbanColumn'

interface KanbanBoardProps {
  columns: KanbanColumn[]
  cards: KanbanCard[]
  onMoveCard: (cardId: string, targetColumnId: string) => void
  onAddCard: (card: Omit<KanbanCard, 'id' | 'createdAt'>) => void
  onDeleteCard: (id: string) => void
  onEditCard: (card: KanbanCard) => void
}

export function KanbanBoard({ columns, cards, onMoveCard, onAddCard, onDeleteCard, onEditCard }: KanbanBoardProps) {
  const dragCardId = useRef<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  const handleDragStart = (cardId: string) => { dragCardId.current = cardId }

  const handleDrop = (columnId: string) => {
    if (dragCardId.current) {
      onMoveCard(dragCardId.current, columnId)
      dragCardId.current = null
    }
    setDragOverCol(null)
  }

  const sorted = [...columns].sort((a, b) => a.order - b.order)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {sorted.map((col) => {
        const colCards = cards.filter((c) => c.columnId === col.id)
        return (
          <KanbanColumnComp
            key={col.id}
            column={col}
            cards={colCards}
            isDragOver={dragOverCol === col.id}
            onDragStart={handleDragStart}
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id) }}
            onDrop={() => handleDrop(col.id)}
            onDragLeave={() => setDragOverCol(null)}
            onAddCard={(c) => onAddCard({ ...c, columnId: col.id })}
            onDeleteCard={onDeleteCard}
            onEditCard={onEditCard}
          />
        )
      })}
    </div>
  )
}
