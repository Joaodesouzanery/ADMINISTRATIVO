import { GripVertical, Edit2, Trash2, Mail, Phone } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { Contact, EntityType } from '../../types'

const typeLabel: Record<EntityType, string> = { contact: 'Contato', partner: 'Parceiro' }
const typeBadge: Record<EntityType, 'info' | 'success'> = { contact: 'info', partner: 'success' }

interface Props {
  contact: Contact
  onEdit: () => void
  onDelete: () => void
  onDragStart: () => void
}

export function ContactCard({ contact, onEdit, onDelete, onDragStart }: Props) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white rounded-lg p-3 shadow-card border border-cyan-100/50 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-navy-800 text-sm truncate">{contact.name}</p>
          {contact.company && <p className="text-xs text-navy-400">{contact.company}</p>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1 rounded text-navy-300 hover:text-navy-700"><Edit2 size={12} /></button>
          <button onClick={onDelete} className="p-1 rounded text-navy-300 hover:text-red-500"><Trash2 size={12} /></button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={typeBadge[contact.type]}>{typeLabel[contact.type]}</Badge>
        {contact.project && <Badge variant="default">{contact.project}</Badge>}
      </div>
      {(contact.email || contact.phone) && (
        <div className="flex items-center gap-3 mt-2 text-xs text-navy-400">
          {contact.email && <span className="flex items-center gap-1 truncate"><Mail size={10} /> {contact.email}</span>}
          {contact.phone && <span className="flex items-center gap-1"><Phone size={10} /> {contact.phone}</span>}
        </div>
      )}
      {contact.observations && <p className="text-xs text-navy-400 mt-1 line-clamp-2 italic">{contact.observations}</p>}
    </div>
  )
}
