import { useState } from 'react'
import { Target, Plus, TrendingUp, CheckSquare, Trash2, RotateCcw } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import { KanbanBoard } from '../../components/kanban/KanbanBoard'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { Input, Select, Textarea } from '../../components/ui/Input'
import type { KanbanCard, Goal, Routine, RoutineFrequency } from '../../types'

const PRODUCT = 'construdata' as const

export function ProjectsTasksPage() {
  const { columns, cards, goals, routines, moveCard, addCard, deleteCard, updateCard, addGoal, addRoutine, deleteRoutine, toggleChecklistItem, addChecklistItem, deleteChecklistItem } = useTaskStore()
  const [tab, setTab] = useState<'kanban' | 'goals' | 'routines'>('kanban')
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null)
  const [addingGoal, setAddingGoal] = useState(false)
  const [goalForm, setGoalForm] = useState({ title: '', target: '', unit: '', dueDate: '', description: '' })

  const prodCards = cards[PRODUCT]
  const prodCols = columns[PRODUCT]
  const prodGoals = goals[PRODUCT]
  const prodRoutines = routines[PRODUCT]
  const [addingRoutine, setAddingRoutine] = useState(false)
  const [routineForm, setRoutineForm] = useState({ title: '', description: '', frequency: 'weekly' as RoutineFrequency, newItem: '' })
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null)

  const statusColor: Record<string, string> = {
    on_track: 'success', at_risk: 'warning', completed: 'info', delayed: 'danger'
  }
  const statusLabel: Record<string, string> = {
    on_track: 'No Prazo', at_risk: 'Em Risco', completed: 'Concluída', delayed: 'Atrasada'
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-3">
        <div className="flex bg-white rounded-xl border border-cyan-100 p-1 shadow-card">
          {(['kanban', 'goals', 'routines'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}
            >
              {t === 'kanban' ? 'Kanban' : t === 'goals' ? 'Metas e Objetivos' : 'Rotinas & Checklists'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'kanban' && (
        <KanbanBoard
          columns={prodCols}
          cards={prodCards}
          onMoveCard={(id, col) => moveCard(id, col, PRODUCT)}
          onAddCard={(c) => addCard(c, PRODUCT)}
          onDeleteCard={(id) => deleteCard(id, PRODUCT)}
          onEditCard={setEditingCard}
        />
      )}

      {tab === 'goals' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setAddingGoal(true)} size="sm">
              <Plus size={14} /> Nova Meta
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prodGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
              return (
                <Card key={goal.id}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-cyan-500" />
                      <h3 className="font-semibold text-navy-800 text-sm">{goal.title}</h3>
                    </div>
                    <Badge variant={statusColor[goal.status] as 'success' | 'warning' | 'info' | 'danger'}>
                      {statusLabel[goal.status]}
                    </Badge>
                  </div>
                  {goal.description && <p className="text-xs text-navy-400 mb-3">{goal.description}</p>}
                  <div className="flex items-end justify-between mb-1.5">
                    <span className="text-xs text-navy-500">
                      {typeof goal.current === 'number' && goal.unit === 'R$'
                        ? `R$ ${goal.current.toLocaleString('pt-BR')}`
                        : `${goal.current} ${goal.unit}`}
                      {' / '}
                      {goal.unit === 'R$' ? `R$ ${goal.target.toLocaleString('pt-BR')}` : `${goal.target} ${goal.unit}`}
                    </span>
                    <span className="text-sm font-bold text-navy-800">{pct}%</span>
                  </div>
                  <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: goal.status === 'completed' ? '#22C55E' : goal.status === 'at_risk' ? '#F59E0B' : '#64D4E8' }}
                    />
                  </div>
                  <p className="text-xs text-navy-400 mt-2 flex items-center gap-1">
                    <TrendingUp size={11} /> Prazo: {new Date(goal.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'routines' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setAddingRoutine(true)} size="sm"><Plus size={14} /> Nova Rotina</Button>
          </div>
          {prodRoutines.length === 0 && (
            <div className="py-16 text-center text-navy-400">
              <RotateCcw size={40} className="mx-auto mb-3 opacity-30" />
              <p>Nenhuma rotina criada ainda.</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prodRoutines.map((routine: Routine) => {
              const done = routine.items.filter((i) => i.done).length
              const total = routine.items.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              const freqLabel: Record<RoutineFrequency, string> = { daily: 'Diária', weekly: 'Semanal', monthly: 'Mensal' }
              const isExpanded = expandedRoutine === routine.id
              return (
                <Card key={routine.id}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 cursor-pointer" onClick={() => setExpandedRoutine(isExpanded ? null : routine.id)}>
                      <div className="flex items-center gap-2">
                        <CheckSquare size={15} className="text-cyan-500" />
                        <p className="font-semibold text-navy-800 text-sm">{routine.title}</p>
                      </div>
                      {routine.description && <p className="text-xs text-navy-400 mt-0.5 ml-5">{routine.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="info">{freqLabel[routine.frequency]}</Badge>
                      <button onClick={() => deleteRoutine(routine.id, PRODUCT)} className="p-1 rounded text-navy-300 hover:text-red-500"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-navy-500 shrink-0">{done}/{total}</span>
                  </div>
                  {isExpanded && (
                    <div className="space-y-1.5 mt-3 pt-3 border-t border-navy-50">
                      {routine.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 group">
                          <button onClick={() => toggleChecklistItem(routine.id, item.id, PRODUCT)} className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${item.done ? 'bg-cyan-400 border-cyan-400 text-white' : 'border-navy-200 hover:border-cyan-400'}`}>
                            {item.done && <span className="text-white text-xs leading-none">✓</span>}
                          </button>
                          <span className={`text-sm flex-1 ${item.done ? 'line-through text-navy-300' : 'text-navy-700'}`}>{item.label}</span>
                          <button onClick={() => deleteChecklistItem(routine.id, item.id, PRODUCT)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-navy-300 hover:text-red-500 transition-opacity"><Trash2 size={11} /></button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input
                          placeholder="Adicionar item..."
                          className="flex-1 text-sm px-2 py-1 border border-navy-100 rounded-lg outline-none focus:border-cyan-400 text-navy-800 placeholder-navy-400"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              addChecklistItem(routine.id, e.currentTarget.value.trim(), PRODUCT)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Edit card modal */}
      <Modal open={!!editingCard} onClose={() => setEditingCard(null)} title="Editar Tarefa">
        {editingCard && (
          <div className="space-y-3">
            <Input label="Título" defaultValue={editingCard.title} onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })} />
            <Textarea label="Descrição" defaultValue={editingCard.description} rows={3} onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })} />
            <Select label="Prioridade" defaultValue={editingCard.priority} onChange={(e) => setEditingCard({ ...editingCard, priority: e.target.value as KanbanCard['priority'] })}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </Select>
            <Input label="Responsável" defaultValue={editingCard.assignee} onChange={(e) => setEditingCard({ ...editingCard, assignee: e.target.value })} />
            <Input label="Data de entrega" type="date" defaultValue={editingCard.dueDate} onChange={(e) => setEditingCard({ ...editingCard, dueDate: e.target.value })} />
            <div className="flex gap-2 pt-2">
              <Button onClick={() => { updateCard(editingCard.id, editingCard, PRODUCT); setEditingCard(null) }}>Salvar</Button>
              <Button variant="secondary" onClick={() => setEditingCard(null)}>Cancelar</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add routine modal */}
      <Modal open={addingRoutine} onClose={() => setAddingRoutine(false)} title="Nova Rotina">
        <div className="space-y-3">
          <Input label="Título" value={routineForm.title} onChange={(e) => setRoutineForm({ ...routineForm, title: e.target.value })} />
          <Textarea label="Descrição" value={routineForm.description} rows={2} onChange={(e) => setRoutineForm({ ...routineForm, description: e.target.value })} />
          <Select label="Frequência" value={routineForm.frequency} onChange={(e) => setRoutineForm({ ...routineForm, frequency: e.target.value as RoutineFrequency })}>
            <option value="daily">Diária</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </Select>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => {
              if (!routineForm.title) return
              addRoutine({ title: routineForm.title, description: routineForm.description, frequency: routineForm.frequency, items: [] }, PRODUCT)
              setAddingRoutine(false)
              setRoutineForm({ title: '', description: '', frequency: 'weekly', newItem: '' })
            }}>Criar Rotina</Button>
            <Button variant="secondary" onClick={() => setAddingRoutine(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      {/* Add goal modal */}
      <Modal open={addingGoal} onClose={() => setAddingGoal(false)} title="Nova Meta">
        <div className="space-y-3">
          <Input label="Título" value={goalForm.title} onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })} />
          <Textarea label="Descrição" value={goalForm.description} rows={2} onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Meta (número)" type="number" value={goalForm.target} onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })} />
            <Input label="Unidade (ex: projetos, R$)" value={goalForm.unit} onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })} />
          </div>
          <Input label="Prazo" type="date" value={goalForm.dueDate} onChange={(e) => setGoalForm({ ...goalForm, dueDate: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={() => {
              if (!goalForm.title || !goalForm.target) return
              addGoal({ title: goalForm.title, description: goalForm.description, target: Number(goalForm.target), current: 0, unit: goalForm.unit, dueDate: goalForm.dueDate, status: 'on_track' }, PRODUCT)
              setAddingGoal(false)
              setGoalForm({ title: '', target: '', unit: '', dueDate: '', description: '' })
            }}>Criar Meta</Button>
            <Button variant="secondary" onClick={() => setAddingGoal(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
