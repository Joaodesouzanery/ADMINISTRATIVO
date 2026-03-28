import { Button } from '../ui/Button'
import { Input, Select, Textarea } from '../ui/Input'
import { Modal } from '../ui/Modal'
import type { Contact, EntityType, ContactPipelineStage } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  form: {
    name: string; email: string; phone: string; company: string; project: string
    type: EntityType; pipelineStage: ContactPipelineStage; observations: string
  }
  setForm: (f: Props['form']) => void
  onSave: () => void
}

export function ContactForm({ open, onClose, title, form, setForm, onSave }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EntityType })}>
            <option value="contact">Contato</option>
            <option value="partner">Parceiro</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input label="Projeto" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} />
        </div>
        <Select label="Estágio" value={form.pipelineStage} onChange={(e) => setForm({ ...form, pipelineStage: e.target.value as ContactPipelineStage })}>
          <option value="new">Novo</option>
          <option value="contacted">Contatado</option>
          <option value="engaged">Engajado</option>
          <option value="proposal">Proposta</option>
          <option value="closed">Fechado</option>
        </Select>
        <Textarea label="Observações" value={form.observations} rows={3} onChange={(e) => setForm({ ...form, observations: e.target.value })} />
        <div className="flex gap-2 pt-2">
          <Button onClick={onSave}>Salvar</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  )
}
