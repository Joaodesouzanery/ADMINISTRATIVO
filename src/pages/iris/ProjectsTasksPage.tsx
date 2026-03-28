import { useState } from 'react'
import { Target, Plus, TrendingUp, CheckSquare, Trash2, RotateCcw, CheckCircle, Circle, Edit2, FileDown, Calendar, Clock, MapPin } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import { KanbanBoard } from '../../components/kanban/KanbanBoard'
import { Timeline } from '../../components/planning/Timeline'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { exportTasksToPDF } from '../../utils/exportTasks'
import type { KanbanCard, Goal, Routine, RoutineFrequency, Task, Priority, PlanningGoal, PlanningHorizon, PlanningStatus } from '../../types'

const PRODUCT = 'iris' as const

const priorityBadge: Record<Priority, 'danger' | 'warning' | 'info' | 'default'> = { urgent: 'danger', high: 'warning', medium: 'info', low: 'default' }
const priorityLabel: Record<Priority, string> = { urgent: 'Urgente', high: 'Alta', medium: 'Média', low: 'Baixa' }
const horizonLabel: Record<PlanningHorizon, string> = { short: 'Curto Prazo', medium: 'Médio Prazo', long: 'Longo Prazo' }
const horizonBadge: Record<PlanningHorizon, 'info' | 'warning' | 'success'> = { short: 'info', medium: 'warning', long: 'success' }
const planStatusLabel: Record<PlanningStatus, string> = { not_started: 'Não Iniciado', in_progress: 'Em Andamento', completed: 'Concluído', cancelled: 'Cancelado' }
const planStatusBadge: Record<PlanningStatus, 'default' | 'info' | 'success' | 'danger'> = { not_started: 'default', in_progress: 'info', completed: 'success', cancelled: 'danger' }

const emptyTask = { title: '', description: '', priority: 'medium' as Priority, date: '', completionDate: '', tags: '', alertDaysBefore: '' }
const emptyPlan = { title: '', description: '', category: '', status: 'not_started' as PlanningStatus, horizon: 'short' as PlanningHorizon, startDate: '', endDate: '', okr: '', relatedProject: '' }

export function ProjectsTasksPage() {
  const store = useTaskStore()
  const { columns, cards, goals, routines, tasks, planningGoals, moveCard, addCard, deleteCard, updateCard, addGoal, addRoutine, deleteRoutine, toggleChecklistItem, addChecklistItem, deleteChecklistItem, addTask, updateTask, deleteTask, toggleTaskCompleted, addPlanningGoal, updatePlanningGoal, deletePlanningGoal } = store
  const [tab, setTab] = useState<'kanban' | 'tarefas' | 'planejamento' | 'goals' | 'routines'>('kanban')

  // Kanban
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null)
  const prodCards = cards[PRODUCT]
  const prodCols = columns[PRODUCT]

  // Goals
  const [addingGoal, setAddingGoal] = useState(false)
  const [goalForm, setGoalForm] = useState({ title: '', target: '', unit: '', dueDate: '', description: '' })
  const prodGoals = goals[PRODUCT]

  // Routines
  const [addingRoutine, setAddingRoutine] = useState(false)
  const [routineForm, setRoutineForm] = useState({ title: '', description: '', frequency: 'weekly' as RoutineFrequency, assignee: '', priority: 'medium' as Priority, dueDate: '', notes: '' })
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null)
  const prodRoutines = routines[PRODUCT]

  // Tasks
  const prodTasks = tasks[PRODUCT]
  const [taskSubTab, setTaskSubTab] = useState<'active' | 'completed'>('active')
  const [addingTask, setAddingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskForm, setTaskForm] = useState(emptyTask)
  const [reportRange, setReportRange] = useState({ start: '', end: '' })

  const activeTasks = prodTasks.filter((t) => !t.completed)
  const completedTasks = prodTasks.filter((t) => t.completed)

  function openEditTask(task: Task) {
    setEditingTask(task)
    setTaskForm({ title: task.title, description: task.description ?? '', priority: task.priority, date: task.date, completionDate: task.completionDate ?? '', tags: (task.tags ?? []).join(', '), alertDaysBefore: task.alertDaysBefore ? String(task.alertDaysBefore) : '' })
  }
  function saveTask() {
    const data = { title: taskForm.title, description: taskForm.description, priority: taskForm.priority, date: taskForm.date, completionDate: taskForm.completionDate || undefined, tags: taskForm.tags.split(',').map((t) => t.trim()).filter(Boolean), alertDaysBefore: taskForm.alertDaysBefore ? Number(taskForm.alertDaysBefore) : undefined }
    if (editingTask) {
      updateTask(editingTask.id, data, PRODUCT)
      setEditingTask(null)
    } else {
      addTask(data as Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>, PRODUCT)
      setAddingTask(false)
    }
    setTaskForm(emptyTask)
  }

  // Planning
  const prodPlans = planningGoals[PRODUCT]
  const [planFilter, setPlanFilter] = useState<PlanningHorizon | 'all'>('all')
  const [addingPlan, setAddingPlan] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlanningGoal | null>(null)
  const [planForm, setPlanForm] = useState(emptyPlan)
  const filteredPlans = prodPlans.filter((g) => planFilter === 'all' || g.horizon === planFilter)

  function openEditPlan(plan: PlanningGoal) {
    setEditingPlan(plan)
    setPlanForm({ title: plan.title, description: plan.description ?? '', category: plan.category, status: plan.status, horizon: plan.horizon, startDate: plan.startDate, endDate: plan.endDate, okr: plan.okr ?? '', relatedProject: plan.relatedProject ?? '' })
  }
  function savePlan() {
    const data = { title: planForm.title, description: planForm.description, category: planForm.category, status: planForm.status, horizon: planForm.horizon, startDate: planForm.startDate, endDate: planForm.endDate, okr: planForm.okr || undefined, relatedProject: planForm.relatedProject || undefined }
    if (editingPlan) {
      updatePlanningGoal(editingPlan.id, data, PRODUCT)
      setEditingPlan(null)
    } else {
      addPlanningGoal(data as Omit<PlanningGoal, 'id' | 'createdAt'>, PRODUCT)
      setAddingPlan(false)
    }
    setPlanForm(emptyPlan)
  }

  const statusColor: Record<string, string> = { on_track: 'success', at_risk: 'warning', completed: 'info', delayed: 'danger' }
  const statusLabel: Record<string, string> = { on_track: 'No Prazo', at_risk: 'Em Risco', completed: 'Concluída', delayed: 'Atrasada' }

  const tabs = [
    { key: 'kanban', label: 'Kanban' },
    { key: 'tarefas', label: 'Tarefas' },
    { key: 'planejamento', label: 'Planejamento' },
    { key: 'goals', label: 'Metas' },
    { key: 'routines', label: 'Rotinas' },
  ] as const

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="flex bg-white rounded-xl border border-cyan-100 p-1 shadow-card">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === t.key ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── KANBAN ─────────────────────────────────────────────────────── */}
      {tab === 'kanban' && (
        <KanbanBoard columns={prodCols} cards={prodCards} onMoveCard={(id, col) => moveCard(id, col, PRODUCT)} onAddCard={(c) => addCard(c, PRODUCT)} onDeleteCard={(id) => deleteCard(id, PRODUCT)} onEditCard={setEditingCard} />
      )}

      {/* ─── TAREFAS ────────────────────────────────────────────────────── */}
      {tab === 'tarefas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex bg-white rounded-lg border border-navy-100 p-0.5">
              <button onClick={() => setTaskSubTab('active')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${taskSubTab === 'active' ? 'bg-navy-800 text-white' : 'text-navy-500'}`}>Ativas ({activeTasks.length})</button>
              <button onClick={() => setTaskSubTab('completed')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${taskSubTab === 'completed' ? 'bg-navy-800 text-white' : 'text-navy-500'}`}>Concluídas ({completedTasks.length})</button>
            </div>
            <div className="flex items-center gap-2">
              <Input type="date" value={reportRange.start} onChange={(e) => setReportRange({ ...reportRange, start: e.target.value })} />
              <Input type="date" value={reportRange.end} onChange={(e) => setReportRange({ ...reportRange, end: e.target.value })} />
              <Button variant="secondary" size="sm" onClick={() => exportTasksToPDF(prodTasks, 'IRIS', reportRange.start && reportRange.end ? reportRange : undefined)}>
                <FileDown size={13} /> PDF
              </Button>
              <Button size="sm" onClick={() => { setTaskForm(emptyTask); setAddingTask(true) }}><Plus size={14} /> Nova Tarefa</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card border border-cyan-100/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-50 bg-surface">
                  <th className="w-10 px-3 py-3" />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Título</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Prioridade</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Conclusão</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden xl:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden xl:table-cell">Alerta</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {(taskSubTab === 'active' ? activeTasks : completedTasks).map((task) => (
                  <tr key={task.id} className="border-b border-navy-50 hover:bg-surface/50 transition-colors">
                    <td className="px-3 py-3">
                      <button onClick={() => toggleTaskCompleted(task.id, PRODUCT)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-navy-200 hover:border-cyan-400'}`}>
                        {task.completed && <span className="text-xs">✓</span>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`font-medium ${task.completed ? 'line-through text-navy-300' : 'text-navy-800'}`}>{task.title}</p>
                      {task.description && <p className="text-xs text-navy-400 mt-0.5 line-clamp-1">{task.description}</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><Badge variant={priorityBadge[task.priority]}>{priorityLabel[task.priority]}</Badge></td>
                    <td className="px-4 py-3 text-navy-500 text-xs hidden lg:table-cell">{new Date(task.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-navy-500 text-xs hidden lg:table-cell">{task.completionDate ? new Date(task.completionDate).toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex gap-1 flex-wrap">{task.tags?.slice(0, 3).map((t) => <Badge key={t} variant="default">{t}</Badge>)}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-navy-400 hidden xl:table-cell">{task.alertDaysBefore ? `${task.alertDaysBefore}d antes` : '—'}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEditTask(task)} className="p-1.5 rounded text-navy-400 hover:text-navy-800 hover:bg-surface"><Edit2 size={13} /></button>
                        <button onClick={() => deleteTask(task.id, PRODUCT)} className="p-1.5 rounded text-navy-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(taskSubTab === 'active' ? activeTasks : completedTasks).length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-navy-400 text-sm">{taskSubTab === 'active' ? 'Nenhuma tarefa ativa.' : 'Nenhuma tarefa concluída.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── PLANEJAMENTO ──────────────────────────────────────────────── */}
      {tab === 'planejamento' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              {(['all', 'short', 'medium', 'long'] as const).map((h) => (
                <button key={h} onClick={() => setPlanFilter(h)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${planFilter === h ? 'bg-navy-800 text-white' : 'bg-white text-navy-500 border border-navy-100 hover:text-navy-800'}`}>
                  {h === 'all' ? 'Todos' : horizonLabel[h]}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={() => { setPlanForm(emptyPlan); setAddingPlan(true) }}><Plus size={14} /> Novo Plano</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => (
              <Card key={plan.id}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={horizonBadge[plan.horizon]}>{horizonLabel[plan.horizon]}</Badge>
                      <Badge variant={planStatusBadge[plan.status]}>{planStatusLabel[plan.status]}</Badge>
                    </div>
                    <h3 className="font-semibold text-navy-800 text-sm">{plan.title}</h3>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => openEditPlan(plan)} className="p-1 rounded text-navy-300 hover:text-navy-700"><Edit2 size={12} /></button>
                    <button onClick={() => deletePlanningGoal(plan.id, PRODUCT)} className="p-1 rounded text-navy-300 hover:text-red-500"><Trash2 size={12} /></button>
                  </div>
                </div>
                {plan.description && <p className="text-xs text-navy-400 mb-2">{plan.description}</p>}
                {plan.category && <Badge variant="default">{plan.category}</Badge>}
                <div className="flex items-center gap-3 mt-3 text-xs text-navy-400">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(plan.startDate).toLocaleDateString('pt-BR')}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {new Date(plan.endDate).toLocaleDateString('pt-BR')}</span>
                </div>
                {plan.okr && <p className="text-xs text-cyan-600 mt-2 font-medium">OKR: {plan.okr}</p>}
                {plan.relatedProject && <p className="text-xs text-navy-400 mt-1">Projeto: {plan.relatedProject}</p>}
              </Card>
            ))}
            {filteredPlans.length === 0 && (
              <div className="col-span-3 py-16 text-center text-navy-400"><Clock size={40} className="mx-auto mb-3 opacity-30" /><p>Nenhum plano encontrado.</p></div>
            )}
          </div>

          <Timeline goals={filteredPlans} />
        </div>
      )}

      {/* ─── METAS ──────────────────────────────────────────────────────── */}
      {tab === 'goals' && (
        <div className="space-y-4">
          <div className="flex justify-end"><Button onClick={() => setAddingGoal(true)} size="sm"><Plus size={14} /> Nova Meta</Button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prodGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
              return (
                <Card key={goal.id}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2"><Target size={16} className="text-cyan-500" /><h3 className="font-semibold text-navy-800 text-sm">{goal.title}</h3></div>
                    <Badge variant={statusColor[goal.status] as 'success' | 'warning' | 'info' | 'danger'}>{statusLabel[goal.status]}</Badge>
                  </div>
                  {goal.description && <p className="text-xs text-navy-400 mb-3">{goal.description}</p>}
                  <div className="flex items-end justify-between mb-1.5">
                    <span className="text-xs text-navy-500">{goal.unit === 'R$' ? `R$ ${goal.current.toLocaleString('pt-BR')}` : `${goal.current} ${goal.unit}`}{' / '}{goal.unit === 'R$' ? `R$ ${goal.target.toLocaleString('pt-BR')}` : `${goal.target} ${goal.unit}`}</span>
                    <span className="text-sm font-bold text-navy-800">{pct}%</span>
                  </div>
                  <div className="h-2 bg-navy-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.status === 'completed' ? '#22C55E' : goal.status === 'at_risk' ? '#F59E0B' : '#64D4E8' }} /></div>
                  <p className="text-xs text-navy-400 mt-2 flex items-center gap-1"><TrendingUp size={11} /> Prazo: {new Date(goal.dueDate).toLocaleDateString('pt-BR')}</p>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── ROTINAS ────────────────────────────────────────────────────── */}
      {tab === 'routines' && (
        <div className="space-y-4">
          <div className="flex justify-end"><Button onClick={() => { setRoutineForm({ title: '', description: '', frequency: 'weekly', assignee: '', priority: 'medium', dueDate: '', notes: '' }); setAddingRoutine(true) }} size="sm"><Plus size={14} /> Nova Rotina</Button></div>
          {prodRoutines.length === 0 && (<div className="py-16 text-center text-navy-400"><RotateCcw size={40} className="mx-auto mb-3 opacity-30" /><p>Nenhuma rotina criada ainda.</p></div>)}
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
                      <div className="flex items-center gap-2"><CheckSquare size={15} className="text-cyan-500" /><p className="font-semibold text-navy-800 text-sm">{routine.title}</p></div>
                      {routine.description && <p className="text-xs text-navy-400 mt-0.5 ml-5">{routine.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {routine.priority && <Badge variant={priorityBadge[routine.priority]}>{priorityLabel[routine.priority]}</Badge>}
                      <Badge variant="info">{freqLabel[routine.frequency]}</Badge>
                      <button onClick={() => deleteRoutine(routine.id, PRODUCT)} className="p-1 rounded text-navy-300 hover:text-red-500"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  {routine.assignee && <p className="text-xs text-navy-400 mb-1">Responsável: {routine.assignee}</p>}
                  {routine.dueDate && <p className="text-xs text-navy-400 mb-1">Prazo: {new Date(routine.dueDate).toLocaleDateString('pt-BR')}</p>}
                  {routine.notes && <p className="text-xs text-navy-400 mb-2 italic">{routine.notes}</p>}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1.5 bg-navy-100 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                    <span className="text-xs text-navy-500 shrink-0">{done}/{total}</span>
                  </div>
                  {isExpanded && (
                    <div className="space-y-1.5 mt-3 pt-3 border-t border-navy-50">
                      {routine.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 group">
                          <button onClick={() => toggleChecklistItem(routine.id, item.id, PRODUCT)} className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${item.done ? 'bg-cyan-400 border-cyan-400 text-white' : 'border-navy-200 hover:border-cyan-400'}`}>{item.done && <span className="text-white text-xs leading-none">✓</span>}</button>
                          <span className={`text-sm flex-1 ${item.done ? 'line-through text-navy-300' : 'text-navy-700'}`}>{item.label}</span>
                          {item.assignee && <span className="text-[10px] text-navy-400">{item.assignee}</span>}
                          {item.priority && <Badge variant={priorityBadge[item.priority]}>{priorityLabel[item.priority]}</Badge>}
                          {item.dueDate && <span className="text-[10px] text-navy-400">{new Date(item.dueDate).toLocaleDateString('pt-BR')}</span>}
                          <button onClick={() => deleteChecklistItem(routine.id, item.id, PRODUCT)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-navy-300 hover:text-red-500 transition-opacity"><Trash2 size={11} /></button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input placeholder="Adicionar item..." className="flex-1 text-sm px-2 py-1 border border-navy-100 rounded-lg outline-none focus:border-cyan-400 text-navy-800 placeholder-navy-400" onKeyDown={(e) => { if (e.key === 'Enter' && e.currentTarget.value.trim()) { addChecklistItem(routine.id, e.currentTarget.value.trim(), PRODUCT); e.currentTarget.value = '' } }} />
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── MODALS ─────────────────────────────────────────────────────── */}

      {/* Edit kanban card */}
      <Modal open={!!editingCard} onClose={() => setEditingCard(null)} title="Editar Card Kanban">
        {editingCard && (
          <div className="space-y-3">
            <Input label="Título" defaultValue={editingCard.title} onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })} />
            <Textarea label="Descrição" defaultValue={editingCard.description} rows={3} onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Prioridade" defaultValue={editingCard.priority} onChange={(e) => setEditingCard({ ...editingCard, priority: e.target.value as Priority })}>
                <option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option><option value="urgent">Urgente</option>
              </Select>
              <Input label="Responsável" defaultValue={editingCard.assignee} onChange={(e) => setEditingCard({ ...editingCard, assignee: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Data de entrega" type="date" defaultValue={editingCard.dueDate} onChange={(e) => setEditingCard({ ...editingCard, dueDate: e.target.value })} />
              <Input label="Tags (vírgula)" defaultValue={(editingCard.tags ?? []).join(', ')} onChange={(e) => setEditingCard({ ...editingCard, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => { updateCard(editingCard.id, editingCard, PRODUCT); setEditingCard(null) }}>Salvar</Button>
              <Button variant="secondary" onClick={() => setEditingCard(null)}>Cancelar</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit task */}
      <Modal open={addingTask || !!editingTask} onClose={() => { setAddingTask(false); setEditingTask(null) }} title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}>
        <div className="space-y-3">
          <Input label="Título" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
          <Textarea label="Descrição" value={taskForm.description} rows={3} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Prioridade" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}>
              <option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option><option value="urgent">Urgente</option>
            </Select>
            <Select label="Alerta" value={taskForm.alertDaysBefore} onChange={(e) => setTaskForm({ ...taskForm, alertDaysBefore: e.target.value })}>
              <option value="">Sem alerta</option><option value="1">1 dia antes</option><option value="3">3 dias antes</option><option value="7">7 dias antes</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data" type="date" value={taskForm.date} onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })} />
            <Input label="Conclusão (prevista)" type="date" value={taskForm.completionDate} onChange={(e) => setTaskForm({ ...taskForm, completionDate: e.target.value })} />
          </div>
          <Input label="Tags (separar por vírgula)" value={taskForm.tags} onChange={(e) => setTaskForm({ ...taskForm, tags: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={() => { if (!taskForm.title || !taskForm.date) return; saveTask() }}>Salvar</Button>
            <Button variant="secondary" onClick={() => { setAddingTask(false); setEditingTask(null) }}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      {/* Add/Edit planning goal */}
      <Modal open={addingPlan || !!editingPlan} onClose={() => { setAddingPlan(false); setEditingPlan(null) }} title={editingPlan ? 'Editar Plano' : 'Novo Plano'} size="lg">
        <div className="space-y-3">
          <Input label="Título" value={planForm.title} onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })} />
          <Textarea label="Descrição" value={planForm.description} rows={2} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Categoria" value={planForm.category} onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })} />
            <Select label="Horizonte" value={planForm.horizon} onChange={(e) => setPlanForm({ ...planForm, horizon: e.target.value as PlanningHorizon })}>
              <option value="short">Curto Prazo</option><option value="medium">Médio Prazo</option><option value="long">Longo Prazo</option>
            </Select>
            <Select label="Status" value={planForm.status} onChange={(e) => setPlanForm({ ...planForm, status: e.target.value as PlanningStatus })}>
              <option value="not_started">Não Iniciado</option><option value="in_progress">Em Andamento</option><option value="completed">Concluído</option><option value="cancelled">Cancelado</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data Início" type="date" value={planForm.startDate} onChange={(e) => setPlanForm({ ...planForm, startDate: e.target.value })} />
            <Input label="Data Término" type="date" value={planForm.endDate} onChange={(e) => setPlanForm({ ...planForm, endDate: e.target.value })} />
          </div>
          <Textarea label="OKR" value={planForm.okr} rows={2} onChange={(e) => setPlanForm({ ...planForm, okr: e.target.value })} placeholder="Descreva o OKR relacionado..." />
          <Input label="Projeto Relacionado" value={planForm.relatedProject} onChange={(e) => setPlanForm({ ...planForm, relatedProject: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={() => { if (!planForm.title || !planForm.startDate || !planForm.endDate) return; savePlan() }}>Salvar</Button>
            <Button variant="secondary" onClick={() => { setAddingPlan(false); setEditingPlan(null) }}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      {/* Add routine */}
      <Modal open={addingRoutine} onClose={() => setAddingRoutine(false)} title="Nova Rotina">
        <div className="space-y-3">
          <Input label="Título" value={routineForm.title} onChange={(e) => setRoutineForm({ ...routineForm, title: e.target.value })} />
          <Textarea label="Descrição" value={routineForm.description} rows={2} onChange={(e) => setRoutineForm({ ...routineForm, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Frequência" value={routineForm.frequency} onChange={(e) => setRoutineForm({ ...routineForm, frequency: e.target.value as RoutineFrequency })}>
              <option value="daily">Diária</option><option value="weekly">Semanal</option><option value="monthly">Mensal</option>
            </Select>
            <Select label="Prioridade" value={routineForm.priority} onChange={(e) => setRoutineForm({ ...routineForm, priority: e.target.value as Priority })}>
              <option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option><option value="urgent">Urgente</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Responsável" value={routineForm.assignee} onChange={(e) => setRoutineForm({ ...routineForm, assignee: e.target.value })} />
            <Input label="Prazo" type="date" value={routineForm.dueDate} onChange={(e) => setRoutineForm({ ...routineForm, dueDate: e.target.value })} />
          </div>
          <Textarea label="Notas" value={routineForm.notes} rows={2} onChange={(e) => setRoutineForm({ ...routineForm, notes: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={() => {
              if (!routineForm.title) return
              addRoutine({ title: routineForm.title, description: routineForm.description, frequency: routineForm.frequency, items: [], assignee: routineForm.assignee || undefined, priority: routineForm.priority, dueDate: routineForm.dueDate || undefined, notes: routineForm.notes || undefined }, PRODUCT)
              setAddingRoutine(false)
            }}>Criar Rotina</Button>
            <Button variant="secondary" onClick={() => setAddingRoutine(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      {/* Add goal */}
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
              setAddingGoal(false); setGoalForm({ title: '', target: '', unit: '', dueDate: '', description: '' })
            }}>Criar Meta</Button>
            <Button variant="secondary" onClick={() => setAddingGoal(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
