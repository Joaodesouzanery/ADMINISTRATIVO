import { useState } from 'react'
import { Mail, Phone, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { Contact, EntityType, ProductKey } from '../../types'
import { useCRMStore } from '../../store/crmStore'

const stageLabel: Record<string, string> = { new: 'Novo', contacted: 'Contatado', engaged: 'Engajado', proposal: 'Proposta', closed: 'Fechado' }
const typeLabel: Record<EntityType, string> = { contact: 'Contato', partner: 'Parceiro' }
const typeBadge: Record<EntityType, 'info' | 'success'> = { contact: 'info', partner: 'success' }

interface Props {
  contacts: Contact[]
  product: ProductKey
  onEdit: (contact: Contact) => void
}

export function CombinedView({ contacts, product, onEdit }: Props) {
  const { deleteContact } = useCRMStore()
  const [filter, setFilter] = useState<EntityType | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = contacts
    .filter((c) => filter === 'all' || c.type === filter)
    .filter((c) => `${c.name} ${c.company ?? ''} ${c.email ?? ''}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-3 pr-3 py-2 text-sm border border-navy-100 rounded-lg bg-white outline-none focus:border-cyan-400 text-navy-800 placeholder-navy-400 w-52" />
        <div className="flex bg-white rounded-lg border border-navy-100 p-0.5">
          {(['all', 'contact', 'partner'] as const).map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filter === t ? 'bg-navy-800 text-white' : 'text-navy-500'}`}>
              {t === 'all' ? 'Todos' : typeLabel[t] + 's'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cyan-100/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-50 bg-surface">
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Nome</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Empresa</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Contato</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Estágio</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-navy-50 hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy-800">{c.name}</p>
                  {c.project && <p className="text-xs text-navy-400">{c.project}</p>}
                </td>
                <td className="px-4 py-3"><Badge variant={typeBadge[c.type]}>{typeLabel[c.type]}</Badge></td>
                <td className="px-4 py-3 text-navy-500 hidden md:table-cell">{c.company ?? '—'}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-col gap-0.5 text-xs text-navy-400">
                    {c.email && <span className="flex items-center gap-1"><Mail size={10} /> {c.email}</span>}
                    {c.phone && <span className="flex items-center gap-1"><Phone size={10} /> {c.phone}</span>}
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="default">{stageLabel[c.pipelineStage]}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(c)} className="p-1.5 rounded text-navy-400 hover:text-navy-800 hover:bg-surface"><Edit2 size={13} /></button>
                    <button onClick={() => deleteContact(c.id, product)} className="p-1.5 rounded text-navy-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-navy-400 text-sm">Nenhum registro encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
