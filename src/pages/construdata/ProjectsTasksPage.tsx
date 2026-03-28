import { useState } from 'react'
import { Target, Plus, TrendingUp } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import { KanbanBoard } from '../../components/kanban/KanbanBoard'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { Input, Select, Textarea } from '../../components/ui/Input'
import type { KanbanCard, Goal } from '../../types'

const PRODUCT = 'construdata' as const

export function ProjectsTasksPage() {
  const { columns, cards, goals, moveCard, addCard, deleteCard, updateCard, addGoal } = useTaskStore()
  const [tab, setTab] = useState<'kanban' | 'goals'>('kanban')
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null)
  const [addingGoal, setAddingGoal] = useState(false)
  const [goalForm, setGoalForm] = useState({ title: '', target: '', unit: '', dueDate: '', description: '' })

  const prodCards = cards[PRODUCT]
  const prodCols = columns[PRODUCT]
  const prodGoals = goals[PRODUCT]

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
          {(['kanban', 'goals'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}
            >
              {t === 'kanban' ? 'Kanban' : 'Metas e Objetivos'}
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
