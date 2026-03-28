import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useOrgStore } from '../../store/orgStore'
import { OrgChart } from '../../components/org/OrgChart'
import { OrgNodeForm } from '../../components/org/OrgNodeForm'
import { Button } from '../../components/ui/Button'
import type { OrgNode, OrgNodeType } from '../../types'

const PRODUCT = 'iris' as const
const emptyForm = { label: '', type: 'person' as OrgNodeType, role: '', email: '', phone: '', parentId: '' }

export function OrgChartPage() {
  const { nodes, addNode, updateNode, deleteNode } = useOrgStore()
  const prodNodes = nodes[PRODUCT]
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<OrgNode | null>(null)
  const [form, setForm] = useState(emptyForm)

  function handleAdd(parentId: string | null) {
    setForm({ ...emptyForm, parentId: parentId ?? '' })
    setAdding(true)
  }

  function handleEdit(node: OrgNode) {
    setEditing(node)
    setForm({ label: node.label, type: node.type, role: node.role ?? '', email: node.email ?? '', phone: node.phone ?? '', parentId: node.parentId ?? '' })
  }

  function save() {
    if (!form.label) return
    const data = { label: form.label, type: form.type, role: form.role || undefined, email: form.email || undefined, phone: form.phone || undefined, parentId: form.parentId || null }
    if (editing) {
      updateNode(editing.id, data, PRODUCT)
      setEditing(null)
    } else {
      addNode(data as Omit<OrgNode, 'id' | 'createdAt'>, PRODUCT)
      setAdding(false)
    }
    setForm(emptyForm)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-navy-800">Organograma</h2>
          <p className="text-xs text-navy-400">Hierarquia da empresa, clientes e associados</p>
        </div>
        <Button size="sm" onClick={() => handleAdd(null)}><Plus size={14} /> Adicionar Nó</Button>
      </div>

      <OrgChart nodes={prodNodes} onAdd={handleAdd} onEdit={handleEdit} onDelete={(id) => deleteNode(id, PRODUCT)} />

      <OrgNodeForm
        open={adding || !!editing}
        onClose={() => { setAdding(false); setEditing(null) }}
        title={editing ? 'Editar Nó' : 'Novo Nó'}
        form={form}
        setForm={setForm}
        onSave={save}
        nodes={prodNodes}
      />
    </div>
  )
}
