import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { ComercialPipeline } from './ComercialPipeline'
import { EstruturaComercial } from './EstruturaComercial'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { useComercialStore } from '../../store/comercialStore'
import type { ComercialContact, ComercialStage, ProductKey } from '../../types'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  stage: 'prospeccao' as ComercialStage,
  value: '',
  notes: '',
}

const SOURCE_LABELS: Record<ProductKey, string> = {
  construdata: 'ConstruData',
  iris: 'IRIS',
  padrao: 'Padrão',
  faculdade: 'Faculdade',
}

interface Props {
  product: ProductKey
  combinedProducts?: ProductKey[]
  subtitle?: string
}

export function ComercialModule({ product, combinedProducts, subtitle }: Props) {
  const { contacts, addContact, updateContact } = useComercialStore()
  const [tab, setTab] = useState<'contatos' | 'estrutura'>('contatos')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<ComercialContact | null>(null)
  const [form, setForm] = useState(emptyForm)

  // In combined mode, flatten contacts from all listed products
  const displayedContacts = useMemo(() => {
    if (combinedProducts) {
      return combinedProducts.flatMap((p) => contacts[p] ?? [])
    }
    return contacts[product] ?? []
  }, [combinedProducts, contacts, product])

  // In combined mode, track which product each contact belongs to
  const productByContactId = useMemo(() => {
    const map = new Map<string, ProductKey>()
    if (combinedProducts) {
      combinedProducts.forEach((p) => {
        ;(contacts[p] ?? []).forEach((c) => map.set(c.id, p))
      })
    }
    return map
  }, [combinedProducts, contacts])

  function openEdit(c: ComercialContact) {
    setEditing(c)
    setForm({
      name: c.name,
      email: c.email ?? '',
      phone: c.phone ?? '',
      company: c.company ?? '',
      role: c.role ?? '',
      stage: c.stage,
      value: c.value !== undefined ? String(c.value) : '',
      notes: c.notes ?? '',
    })
  }

  function save() {
    if (!form.name) return
    const data = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      company: form.company || undefined,
      role: form.role || undefined,
      stage: form.stage,
      value: form.value ? Number(form.value) : undefined,
      notes: form.notes || undefined,
    }
    if (editing) {
      const p = productByContactId.get(editing.id) ?? product
      updateContact(editing.id, data, p)
      setEditing(null)
    } else {
      addContact(data, product)
      setAdding(false)
    }
    setForm(emptyForm)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white rounded-xl border border-cyan-100 p-1 shadow-card">
          <button
            onClick={() => setTab('contatos')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'contatos' ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}
          >
            Contatos
          </button>
          <button
            onClick={() => setTab('estrutura')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'estrutura' ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}
          >
            Estrutura Comercial
          </button>
        </div>
        {tab === 'contatos' && (
          <Button size="sm" onClick={() => { setForm(emptyForm); setAdding(true) }}>
            <Plus size={14} /> Novo Contato
          </Button>
        )}
      </div>

      {tab === 'contatos' && (
        <>
          {subtitle && <p className="text-xs text-navy-400">{subtitle}</p>}
          <ComercialPipeline
            contacts={displayedContacts}
            product={product}
            onEdit={openEdit}
            getProductOf={combinedProducts ? (id) => productByContactId.get(id) ?? product : undefined}
            sourceLabels={combinedProducts ? SOURCE_LABELS : undefined}
          />
        </>
      )}

      {tab === 'estrutura' && <EstruturaComercial />}

      <Modal
        open={adding || !!editing}
        onClose={() => { setAdding(false); setEditing(null); setForm(emptyForm) }}
        title={editing ? 'Editar Contato' : 'Novo Contato'}
        size="lg"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Cargo" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Empresa / Órgão" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Input label="Valor Potencial (R$)" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <Select label="Fase do Funil" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as ComercialStage })}>
            <option value="prospeccao">1. Prospecção e Qualificação</option>
            <option value="apresentacao">2. Apresentação e Proposta</option>
            <option value="negociacao">3. Negociação</option>
            <option value="fechamento">4. Fechamento / Documentação</option>
            <option value="pos_venda">5. Suporte e Pós-venda</option>
          </Select>
          <Textarea
            label="Observações"
            value={form.notes}
            rows={3}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div className="flex gap-2 pt-2">
            <Button onClick={save}>Salvar</Button>
            <Button variant="secondary" onClick={() => { setAdding(false); setEditing(null); setForm(emptyForm) }}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
