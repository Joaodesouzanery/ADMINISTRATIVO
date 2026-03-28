import { useState } from 'react'
import { ContactCard } from './ContactCard'
import type { Contact, ContactPipelineStage, EntityType, ProductKey } from '../../types'
import { useCRMStore } from '../../store/crmStore'

const STAGES: { key: ContactPipelineStage; label: string; color: string }[] = [
  { key: 'new', label: 'Novo', color: '#94A3B8' },
  { key: 'contacted', label: 'Contatado', color: '#64D4E8' },
  { key: 'engaged', label: 'Engajado', color: '#F59E0B' },
  { key: 'proposal', label: 'Proposta', color: '#7DD4A8' },
  { key: 'closed', label: 'Fechado', color: '#22C55E' },
]

interface Props {
  contacts: Contact[]
  product: ProductKey
  filterType?: EntityType
  onEdit: (contact: Contact) => void
}

export function ContactPipeline({ contacts, product, filterType, onEdit }: Props) {
  const { moveContactStage, deleteContact } = useCRMStore()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<ContactPipelineStage | null>(null)

  const filtered = filterType ? contacts.filter((c) => c.type === filterType) : contacts

  function handleDrop(stage: ContactPipelineStage) {
    if (draggingId) {
      moveContactStage(draggingId, stage, product)
      setDraggingId(null)
      setDragOverStage(null)
    }
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const stageContacts = filtered.filter((c) => c.pipelineStage === stage.key)
        return (
          <div
            key={stage.key}
            className={`flex-shrink-0 w-64 bg-surface rounded-xl p-3 transition-colors ${dragOverStage === stage.key ? 'ring-2 ring-cyan-400' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage.key) }}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={() => handleDrop(stage.key)}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
              <h3 className="text-xs font-semibold text-navy-700 uppercase tracking-wide">{stage.label}</h3>
              <span className="ml-auto text-xs text-navy-400 bg-white rounded-full px-1.5 py-0.5">{stageContacts.length}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {stageContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={() => onEdit(contact)}
                  onDelete={() => deleteContact(contact.id, product)}
                  onDragStart={() => setDraggingId(contact.id)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
