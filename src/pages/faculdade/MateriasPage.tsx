import { useState } from 'react'
import { Plus, Edit2, Trash2, BookOpen, Clock, MapPin, User } from 'lucide-react'
import { useFaculdadeStore, type Materia } from '../../store/faculdadeStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea } from '../../components/ui/Input'

const emptyForm = { nome: '', professor: '', horario: '', sala: '', cor: '#8B5CF6', notas: '' }

export function MateriasPage() {
  const { materias, atividades, addMateria, updateMateria, deleteMateria } = useFaculdadeStore()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Materia | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openEdit(m: Materia) {
    setEditing(m)
    setForm({ nome: m.nome, professor: m.professor ?? '', horario: m.horario ?? '', sala: m.sala ?? '', cor: m.cor, notas: m.notas ?? '' })
  }

  function save() {
    if (!form.nome) return
    if (editing) {
      updateMateria(editing.id, form)
      setEditing(null)
    } else {
      addMateria(form)
      setAdding(false)
    }
    setForm(emptyForm)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-navy-800">Matérias</h2>
          <p className="text-xs text-navy-400">{materias.length} disciplina{materias.length !== 1 ? 's' : ''} cadastrada{materias.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" onClick={() => { setForm(emptyForm); setAdding(true) }}><Plus size={14} /> Nova Matéria</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materias.map((m) => {
          const atv = atividades.filter((a) => a.materiaId === m.id)
          const pendentes = atv.filter((a) => !a.concluida).length
          const proxima = atv.filter((a) => !a.concluida).sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega))[0]
          return (
            <Card key={m.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.cor + '20' }}>
                    <BookOpen size={18} style={{ color: m.cor }} />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-800 text-sm">{m.nome}</p>
                    {m.professor && <p className="text-xs text-navy-400 flex items-center gap-1"><User size={10} /> {m.professor}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} className="p-1 rounded text-navy-300 hover:text-navy-700"><Edit2 size={12} /></button>
                  <button onClick={() => deleteMateria(m.id)} className="p-1 rounded text-navy-300 hover:text-red-500"><Trash2 size={12} /></button>
                </div>
              </div>
              {m.horario && <p className="text-xs text-navy-400 flex items-center gap-1 mb-1"><Clock size={10} /> {m.horario}</p>}
              {m.sala && <p className="text-xs text-navy-400 flex items-center gap-1 mb-2"><MapPin size={10} /> {m.sala}</p>}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-50">
                <span className="text-xs text-navy-400">{atv.length} atividade{atv.length !== 1 ? 's' : ''}</span>
                {pendentes > 0 && <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: m.cor + '20', color: m.cor }}>{pendentes} pendente{pendentes !== 1 ? 's' : ''}</span>}
              </div>
              {proxima && (
                <p className="text-xs text-navy-400 mt-1">Próxima: {proxima.titulo} — {new Date(proxima.dataEntrega).toLocaleDateString('pt-BR')}</p>
              )}
            </Card>
          )
        })}
        {materias.length === 0 && (
          <div className="col-span-3 py-16 text-center text-navy-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma matéria cadastrada.</p>
          </div>
        )}
      </div>

      <Modal open={adding || !!editing} onClose={() => { setAdding(false); setEditing(null) }} title={editing ? 'Editar Matéria' : 'Nova Matéria'}>
        <div className="space-y-3">
          <Input label="Nome da Matéria" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Professor" value={form.professor} onChange={(e) => setForm({ ...form, professor: e.target.value })} />
            <Input label="Cor" type="color" value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Horário" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} placeholder="Ex: Seg/Qua 10:00" />
            <Input label="Sala" value={form.sala} onChange={(e) => setForm({ ...form, sala: e.target.value })} />
          </div>
          <Textarea label="Notas / Observações" value={form.notas} rows={3} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={save}>Salvar</Button>
            <Button variant="secondary" onClick={() => { setAdding(false); setEditing(null) }}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
