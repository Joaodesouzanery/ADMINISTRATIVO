import { useState } from 'react'
import { Mail, Phone, Building2, Edit2, Trash2, DollarSign } from 'lucide-react'
import type { ComercialContact, ComercialStage, ProductKey } from '../../types'
import { useComercialStore } from '../../store/comercialStore'

const STAGES: { key: ComercialStage; label: string; color: string; shortLabel: string }[] = [
  { key: 'prospeccao',   label: '1. Prospecção e Qualificação',  shortLabel: 'Prospecção',    color: '#64D4E8' },
  { key: 'apresentacao', label: '2. Apresentação e Proposta',    shortLabel: 'Apresentação',  color: '#F59E0B' },
  { key: 'negociacao',   label: '3. Negociação',                 shortLabel: 'Negociação',    color: '#8B5CF6' },
  { key: 'fechamento',   label: '4. Fechamento / Documentação',  shortLabel: 'Fechamento',    color: '#10B981' },
  { key: 'pos_venda',    label: '5. Suporte e Pós-venda',        shortLabel: 'Pós-venda',     color: '#06B6D4' },
]

interface Props {
  contacts: ComercialContact[]
  product: ProductKey
  onEdit: (c: ComercialContact) => void
  getProductOf?: (id: string) => ProductKey
  sourceLabels?: Record<ProductKey, string>
}

export function ComercialPipeline({ contacts, product, onEdit, getProductOf, sourceLabels }: Props) {
  const { moveStage, deleteContact } = useComercialStore()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<ComercialStage | null>(null)

  function handleDrop(stage: ComercialStage) {
    if (!draggingId) return
    const p = getProductOf ? getProductOf(draggingId) : product
    moveStage(draggingId, stage, p)
    setDraggingId(null)
    setDragOver(null)
  }

  function handleDelete(id: string) {
    const p = getProductOf ? getProductOf(id) : product
    deleteContact(id, p)
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const stageContacts = contacts.filter((c) => c.stage === stage.key)
        const totalValue = stageContacts.reduce((s, c) => s + (c.value ?? 0), 0)
        return (
          <div
            key={stage.key}
            className={`flex-shrink-0 w-72 bg-surface rounded-xl p-3 transition-colors ${dragOver === stage.key ? 'ring-2 ring-cyan-400' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(stage.key) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(stage.key)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
              <h3 className="text-xs font-semibold text-navy-700 uppercase tracking-wide flex-1 truncate">{stage.label}</h3>
              <span className="text-xs text-navy-400 bg-white rounded-full px-2 py-0.5 shrink-0">{stageContacts.length}</span>
            </div>
            {totalValue > 0 && (
              <p className="text-[10px] text-navy-400 mb-2">Total: R$ {totalValue.toLocaleString('pt-BR')}</p>
            )}
            <div className="space-y-2 min-h-[120px]">
              {stageContacts.map((c) => {
                const source = getProductOf ? getProductOf(c.id) : null
                return (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={() => setDraggingId(c.id)}
                    className="bg-white rounded-lg p-3 shadow-card border border-cyan-100/50 cursor-grab active:cursor-grabbing group hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy-800 text-sm truncate">{c.name}</p>
                        {c.company && (
                          <p className="text-xs text-navy-400 truncate flex items-center gap-1">
                            <Building2 size={10} /> {c.company}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => onEdit(c)} className="p-1 rounded text-navy-300 hover:text-navy-700">
                          <Edit2 size={11} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1 rounded text-navy-300 hover:text-red-500">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>

                    {c.role && <p className="text-xs text-navy-500 mb-1 truncate">{c.role}</p>}

                    {(c.email || c.phone) && (
                      <div className="flex flex-col gap-0.5 text-[10px] text-navy-400 mt-1">
                        {c.email && (
                          <span className="truncate flex items-center gap-1">
                            <Mail size={9} /> {c.email}
                          </span>
                        )}
                        {c.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={9} /> {c.phone}
                          </span>
                        )}
                      </div>
                    )}

                    {c.value !== undefined && c.value > 0 && (
                      <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1">
                        <DollarSign size={10} /> R$ {c.value.toLocaleString('pt-BR')}
                      </p>
                    )}

                    {source && sourceLabels && (
                      <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-navy-100 text-navy-600 uppercase tracking-wide">
                        {sourceLabels[source] ?? source}
                      </span>
                    )}
                  </div>
                )
              })}
              {stageContacts.length === 0 && (
                <div className="text-[10px] text-navy-300 text-center py-6">Arraste um contato para cá</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
