import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, Bell } from 'lucide-react'
import { useFaculdadeStore, type AtividadeAcademica } from '../../store/faculdadeStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'

const tipoLabel: Record<string, string> = { prova: 'Prova', trabalho: 'Trabalho', lista: 'Lista', seminario: 'Seminário', outro: 'Outro' }
const tipoBadge: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'default'> = { prova: 'danger', trabalho: 'warning', lista: 'info', seminario: 'success', outro: 'default' }
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const emptyForm = { materiaId: '', titulo: '', tipo: 'prova' as AtividadeAcademica['tipo'], descricao: '', dataEntrega: '', peso: '', alertaDiasAntes: '' }

export function CalendarioPage() {
  const { materias, atividades, addAtividade } = useFaculdadeStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = useMemo(() => {
    const arr: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) arr.push(null)
    for (let i = 1; i <= daysInMonth; i++) arr.push(i)
    return arr
  }, [firstDay, daysInMonth])

  function getActivitiesForDay(day: number): AtividadeAcademica[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return atividades.filter((a) => a.dataEntrega === dateStr)
  }

  function save() {
    if (!form.titulo || !form.materiaId || !form.dataEntrega) return
    addAtividade({
      ...form,
      peso: form.peso ? Number(form.peso) : undefined,
      alertaDiasAntes: form.alertaDiasAntes ? Number(form.alertaDiasAntes) : undefined,
    })
    setAdding(false)
    setForm(emptyForm)
  }

  const selectedDateStr = selectedDay ? `${year}-${String(month + 1).padStart(2, '0')}-${selectedDay.padStart(2, '0')}` : null
  const selectedActivities = selectedDay ? getActivitiesForDay(Number(selectedDay)) : []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-800">Calendário Acadêmico</h2>
        <Button size="sm" onClick={() => { setForm(emptyForm); setAdding(true) }}><Plus size={14} /> Nova Atividade</Button>
      </div>

      <Card>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded-lg hover:bg-surface text-navy-500"><ChevronLeft size={18} /></button>
          <h3 className="font-semibold text-navy-800">{MONTHS[month]} {year}</h3>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-surface text-navy-500"><ChevronRight size={18} /></button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d) => <div key={d} className="text-center text-xs font-semibold text-navy-400 py-1">{d}</div>)}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) return <div key={i} />
            const acts = getActivitiesForDay(day)
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
            const isSelected = selectedDay === String(day)
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(String(day))}
                className={`relative p-2 rounded-lg text-sm transition-colors min-h-[60px] flex flex-col items-start
                  ${isToday ? 'bg-purple-100 font-bold text-purple-700' : 'hover:bg-surface text-navy-700'}
                  ${isSelected ? 'ring-2 ring-purple-400' : ''}
                `}
              >
                <span className="text-xs">{day}</span>
                <div className="flex flex-wrap gap-0.5 mt-1">
                  {acts.slice(0, 3).map((a) => {
                    const materia = materias.find((m) => m.id === a.materiaId)
                    return <div key={a.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: materia?.cor ?? '#8B5CF6' }} title={a.titulo} />
                  })}
                  {acts.length > 3 && <span className="text-[8px] text-navy-400">+{acts.length - 3}</span>}
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Selected day details */}
      {selectedDay && (
        <Card>
          <h3 className="font-semibold text-navy-800 text-sm mb-3">
            {Number(selectedDay)} de {MONTHS[month]} — {selectedActivities.length} atividade{selectedActivities.length !== 1 ? 's' : ''}
          </h3>
          {selectedActivities.length === 0 && <p className="text-xs text-navy-400">Nenhuma atividade neste dia.</p>}
          <div className="space-y-2">
            {selectedActivities.map((a) => {
              const materia = materias.find((m) => m.id === a.materiaId)
              return (
                <div key={a.id} className={`flex items-center gap-3 p-3 rounded-lg border ${a.concluida ? 'bg-green-50 border-green-100' : 'bg-white border-navy-50'}`}>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: materia?.cor ?? '#8B5CF6' }} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${a.concluida ? 'line-through text-navy-300' : 'text-navy-800'}`}>{a.titulo}</p>
                    <p className="text-xs text-navy-400">{materia?.nome ?? '—'}</p>
                  </div>
                  <Badge variant={tipoBadge[a.tipo]}>{tipoLabel[a.tipo]}</Badge>
                  {a.alertaDiasAntes && <Bell size={12} className="text-amber-500" />}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Add modal */}
      <Modal open={adding} onClose={() => setAdding(false)} title="Nova Atividade">
        <div className="space-y-3">
          <Input label="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Matéria" value={form.materiaId} onChange={(e) => setForm({ ...form, materiaId: e.target.value })}>
              <option value="">Selecionar</option>
              {materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </Select>
            <Select label="Tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as AtividadeAcademica['tipo'] })}>
              <option value="prova">Prova</option>
              <option value="trabalho">Trabalho</option>
              <option value="lista">Lista</option>
              <option value="seminario">Seminário</option>
              <option value="outro">Outro</option>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Data" type="date" value={form.dataEntrega} onChange={(e) => setForm({ ...form, dataEntrega: e.target.value })} />
            <Input label="Peso" type="number" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} placeholder="Ex: 2.0" />
            <Select label="Alerta" value={form.alertaDiasAntes} onChange={(e) => setForm({ ...form, alertaDiasAntes: e.target.value })}>
              <option value="">Sem alerta</option>
              <option value="1">1 dia antes</option>
              <option value="3">3 dias antes</option>
              <option value="7">7 dias antes</option>
            </Select>
          </div>
          <Textarea label="Descrição" value={form.descricao} rows={2} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={save}>Salvar</Button>
            <Button variant="secondary" onClick={() => setAdding(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
