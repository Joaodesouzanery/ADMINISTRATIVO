import { Button } from '../ui/Button'
import { Input, Select } from '../ui/Input'
import { Modal } from '../ui/Modal'
import type { OrgNode, OrgNodeType } from '../../types'

const nodeTypeLabel: Record<OrgNodeType, string> = {
  company: 'Empresa', department: 'Departamento', person: 'Pessoa', client: 'Cliente', associate: 'Associado',
}

interface Props {
  open: boolean
  onClose: () => void
  title: string
  form: { label: string; type: OrgNodeType; role: string; email: string; phone: string; parentId: string }
  setForm: (f: Props['form']) => void
  onSave: () => void
  nodes: OrgNode[]
}

export function OrgNodeForm({ open, onClose, title, form, setForm, onSave, nodes }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-3">
        <Input label="Nome / Título" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as OrgNodeType })}>
            {Object.entries(nodeTypeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Input label="Cargo / Função" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <Select label="Nó Pai" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
          <option value="">(Raiz — sem pai)</option>
          {nodes.map((n) => <option key={n.id} value={n.id}>{n.label} ({nodeTypeLabel[n.type]})</option>)}
        </Select>
        <div className="flex gap-2 pt-2">
          <Button onClick={onSave}>Salvar</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  )
}
