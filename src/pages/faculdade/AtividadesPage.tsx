import { useState } from 'react'
import { Plus, Edit2, Trash2, CheckCircle, Circle, ClipboardList } from 'lucide-react'
import { useFaculdadeStore, type AtividadeAcademica } from '../../store/faculdadeStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'

const tipoLabel: Record<string, string> = { prova: 'Prova', trabalho: 'Trabalho', lista: 'Lista', seminario: 'Seminário', outro: 'Outro' }
const tipoBadge: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'default'> = { prova: 'danger', trabalho: 'warning', lista: 'info', seminario: 'success', outro: 'default' }

const emptyForm = { materiaId: '', titulo: '', tipo: 'trabalho' as AtividadeAcademica['tipo'], descricao: '', dataEntrega: '', peso: '', nota: '', alertaDiasAntes: '' }

export function AtividadesPage() {
  const { materias, atividades, addAtividade, updateAtividade, deleteAtividade, toggleAtividade } = useFaculdadeStore()
  const [subTab, setSubTab] = useState<'pendentes' | 'concluidas'>('pendentes')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<AtividadeAcademica | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filterMateria, setFilterMateria] = useState('')

  const pendentes = atividades.filter((a) => !a.concluida).sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega))
  const concluidas = atividades.filter((a) => a.concluida).sort((a, b) => (b.concluidaEm ?? '').localeCompare(a.concluidaEm ?? ''))

  const list = (subTab === 'pendentes' ? pendentes : concluidas).filter((a) => !filterMateria || a.materiaId === filterMateria)

  function openEdit(a: AtividadeAcademica) {
    setEditing(a)
    setForm({ materiaId: a.materiaId, titulo: a.titulo, tipo: a.tipo, descricao: a.descricao ?? '', dataEntrega: a.dataEntrega, peso: a.peso ? String(a.peso) : '', nota: a.nota !== undefined ? String(a.nota) : '', alertaDiasAntes: a.alertaDiasAntes ? String(a.alertaDiasAntes) : '' })
  }

  function save() {
    if (!form.titulo || !form.materiaId || !form.dataEntrega) return
    const data = { materiaId: form.materiaId, titulo: form.titulo, tipo: form.tipo, descricao: form.descricao, dataEntrega: form.dataEntrega, peso: form.peso ? Number(form.peso) : undefined, nota: form.nota ? Number(form.nota) : undefined, alertaDiasAntes: form.alertaDiasAntes ? Number(form.alertaDiasAntes) : undefined }
    if (editing) {
      updateAtividade(editing.id, data)
      setEditing(null)
    } else {
      addAtividade(data)
      setAdding(false)
    }
    setForm(emptyForm)
  }

  function daysUntil(date: string) {
    const d = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (d < 0) return 'Atrasada'
    if (d === 0) return 'Hoje'
    if (d === 1) return 'Amanhã'
    return `${d} dias`
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg border border-navy-100 p-0.5">
            <button onClick={() => setSubTab('pendentes')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${subTab === 'pendentes' ? 'bg-navy-800 text-white' : 'text-navy-500'}`}>Pendentes ({pendentes.length})</button>
            <button onClick={() => setSubTab('concluidas')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${subTab === 'concluidas' ? 'bg-navy-800 text-white' : 'text-navy-500'}`}>Concluídas ({concluidas.length})</button>
          </div>
          <select value={filterMateria} onChange={(e) => setFilterMateria(e.target.value)} className="border border-navy-100 rounded-lg px-3 py-1.5 text-xs bg-white text-navy-700">
            <option value="">Todas as matérias</option>
            {materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </div>
        <Button size="sm" onClick={() => { setForm(emptyForm); setAdding(true) }}><Plus size={14} /> Nova Atividade</Button>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cyan-100/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-50 bg-surface">
              <th className="w-10 px-3 py-3" />
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Atividade</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Matéria</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Prazo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden xl:table-cell">Nota</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((a) => {
              const materia = materias.find((m) => m.id === a.materiaId)
              const prazo = daysUntil(a.dataEntrega)
              const isLate = prazo === 'Atrasada' && !a.concluida
              return (
                <tr key={a.id} className="border-b border-navy-50 hover:bg-surface/50 transition-colors">
                  <td className="px-3 py-3">
                    <button onClick={() => toggleAtividade(a.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${a.concluida ? 'bg-green-500 border-green-500 text-white' : 'border-navy-200 hover:border-purple-400'}`}>
                      {a.concluida && <span className="text-xs">✓</span>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className={`font-medium text-sm ${a.concluida ? 'line-through text-navy-300' : 'text-navy-800'}`}>{a.titulo}</p>
                    {a.descricao && <p className="text-xs text-navy-400 line-clamp-1">{a.descricao}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {materia && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: materia.cor }} />
                        <span className="text-xs text-navy-600">{materia.nome}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge variant={tipoBadge[a.tipo]}>{tipoLabel[a.tipo]}</Badge></td>
                  <td className="px-4 py-3 text-xs text-navy-500 hidden lg:table-cell">{new Date(a.dataEntrega).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs font-medium ${isLate ? 'text-red-500' : prazo === 'Hoje' ? 'text-amber-500' : 'text-navy-400'}`}>{prazo}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-navy-500 hidden xl:table-cell">{a.nota !== undefined ? a.nota : '—'}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded text-navy-400 hover:text-navy-800 hover:bg-surface"><Edit2 size={13} /></button>
                      <button onClick={() => deleteAtividade(a.id)} className="p-1.5 rounded text-navy-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {list.length === 0 && (
              <tr><td colSpan={8} className="py-12 text-center text-navy-400 text-sm"><ClipboardList size={32} className="mx-auto mb-2 opacity-30" />Nenhuma atividade.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={adding || !!editing} onClose={() => { setAdding(false); setEditing(null) }} title={editing ? 'Editar Atividade' : 'Nova Atividade'}>
        <div className="space-y-3">
          <Input label="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Matéria" value={form.materiaId} onChange={(e) => setForm({ ...form, materiaId: e.target.value })}>
              <option value="">Selecionar</option>
              {materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </Select>
            <Select label="Tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as AtividadeAcademica['tipo'] })}>
              <option value="prova">Prova</option><option value="trabalho">Trabalho</option><option value="lista">Lista</option><option value="seminario">Seminário</option><option value="outro">Outro</option>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Data" type="date" value={form.dataEntrega} onChange={(e) => setForm({ ...form, dataEntrega: e.target.value })} />
            <Input label="Peso" type="number" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
            <Input label="Nota" type="number" value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} />
          </div>
          <Select label="Alerta" value={form.alertaDiasAntes} onChange={(e) => setForm({ ...form, alertaDiasAntes: e.target.value })}>
            <option value="">Sem alerta</option><option value="1">1 dia antes</option><option value="3">3 dias antes</option><option value="7">7 dias antes</option>
          </Select>
          <Textarea label="Descrição" value={form.descricao} rows={2} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={save}>Salvar</Button>
            <Button variant="secondary" onClick={() => { setAdding(false); setEditing(null) }}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
