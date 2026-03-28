import { useState } from 'react'
import { Plus, Search, Users, Trash2, Edit2 } from 'lucide-react'
import { useCRMStore } from '../../store/crmStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import type { Client, Deal, ClientStatus, DealStage } from '../../types'

const PRODUCT = 'iris' as const

const statusBadge: Record<ClientStatus, 'success' | 'info' | 'default' | 'warning'> = { active: 'success', partner: 'info', prospect: 'warning', inactive: 'default' }
const statusLabel: Record<ClientStatus, string> = { active: 'Ativo', partner: 'Parceiro', prospect: 'Prospecto', inactive: 'Inativo' }
const stageLabel: Record<DealStage, string> = { lead: 'Lead', qualified: 'Qualificado', proposal: 'Proposta', negotiation: 'Negociação', won: 'Ganho', lost: 'Perdido' }
const stageBadge: Record<DealStage, 'default' | 'info' | 'warning' | 'success' | 'danger'> = { lead: 'default', qualified: 'info', proposal: 'warning', negotiation: 'default', won: 'success', lost: 'danger' }

const emptyClient = { name: '', company: '', email: '', phone: '', status: 'prospect' as ClientStatus, segment: '', notes: '' }
const emptyDeal = { title: '', clientId: '', clientName: '', stage: 'lead' as DealStage, value: '', probability: '', expectedClose: '' }

export function CRMPage() {
  const { clients, deals, addClient, deleteClient, updateClient, addDeal, deleteDeal, updateDeal } = useCRMStore()
  const [tab, setTab] = useState<'clients' | 'pipeline'>('clients')
  const [search, setSearch] = useState('')
  const [addingClient, setAddingClient] = useState(false)
  const [addingDeal, setAddingDeal] = useState(false)
  const [clientForm, setClientForm] = useState(emptyClient)
  const [dealForm, setDealForm] = useState(emptyDeal)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const prodClients = clients[PRODUCT]
  const prodDeals = deals[PRODUCT]

  const filteredClients = prodClients.filter((c) => `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(search.toLowerCase()))
  const totalPipeline = prodDeals.reduce((s, d) => s + (d.stage !== 'lost' ? d.value * d.probability / 100 : 0), 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><p className="text-xs text-navy-400 font-medium">Total Clientes</p><p className="text-2xl font-bold text-navy-800 mt-1">{prodClients.length}</p></Card>
        <Card><p className="text-xs text-navy-400 font-medium">Ativos</p><p className="text-2xl font-bold text-navy-800 mt-1">{prodClients.filter((c) => c.status === 'active').length}</p></Card>
        <Card><p className="text-xs text-navy-400 font-medium">Pipeline</p><p className="text-2xl font-bold text-navy-800 mt-1">R$ {(totalPipeline / 1000).toFixed(0)}k</p></Card>
        <Card><p className="text-xs text-navy-400 font-medium">Ganhos</p><p className="text-2xl font-bold text-navy-800 mt-1">{prodDeals.filter((d) => d.stage === 'won').length}</p></Card>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex bg-white rounded-xl border border-cyan-100 p-1 shadow-card">
          {(['clients', 'pipeline'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}>
              {t === 'clients' ? 'Clientes' : 'Pipeline'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-8 pr-3 py-2 text-sm border border-navy-100 rounded-lg bg-white outline-none focus:border-cyan-400 text-navy-800 placeholder-navy-400 w-44" />
          </div>
          <Button size="sm" onClick={() => tab === 'clients' ? setAddingClient(true) : setAddingDeal(true)}>
            <Plus size={14} /> {tab === 'clients' ? 'Cliente' : 'Negócio'}
          </Button>
        </div>
      </div>

      {tab === 'clients' && (
        <div className="bg-white rounded-xl shadow-card border border-cyan-100/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-50 bg-surface">
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Nome / Empresa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Segmento</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Valor</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => (
                <tr key={c.id} className="border-b border-navy-50 hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center"><Users size={12} className="text-navy-500" /></div>
                      <div>
                        <p className="font-medium text-navy-800">{c.name}</p>
                        <p className="text-xs text-navy-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={statusBadge[c.status]}>{statusLabel[c.status]}</Badge></td>
                  <td className="px-4 py-3 text-navy-500 hidden lg:table-cell">{c.segment}</td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    {c.value ? <span className="font-medium text-navy-700">R$ {c.value.toLocaleString('pt-BR')}</span> : <span className="text-navy-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEditingClient(c)} className="p-1.5 rounded text-navy-400 hover:text-navy-800 hover:bg-surface"><Edit2 size={13} /></button>
                      <button onClick={() => deleteClient(c.id, PRODUCT)} className="p-1.5 rounded text-navy-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prodDeals.map((deal) => (
            <Card key={deal.id}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-navy-800 text-sm">{deal.title}</p>
                  <p className="text-xs text-navy-400 mt-0.5">{deal.clientName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={stageBadge[deal.stage]}>{stageLabel[deal.stage]}</Badge>
                  <button onClick={() => setEditingDeal(deal)} className="p-1 rounded text-navy-300 hover:text-navy-700"><Edit2 size={13} /></button>
                  <button onClick={() => deleteDeal(deal.id, PRODUCT)} className="p-1 rounded text-navy-300 hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div><p className="text-xs text-navy-400">Valor</p><p className="font-bold text-navy-800">R$ {deal.value.toLocaleString('pt-BR')}</p></div>
                <div><p className="text-xs text-navy-400">Probabilidade</p><p className="font-bold text-navy-800">{deal.probability}%</p></div>
                <div><p className="text-xs text-navy-400">Fechamento</p><p className="font-medium text-navy-700 text-sm">{new Date(deal.expectedClose).toLocaleDateString('pt-BR')}</p></div>
              </div>
              <div className="mt-3">
                <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${deal.probability}%` }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={addingClient} onClose={() => setAddingClient(false)} title="Novo Cliente">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} />
            <Input label="Empresa" value={clientForm.company} onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })} />
          </div>
          <Input label="Email" type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Telefone" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} />
            <Select label="Status" value={clientForm.status} onChange={(e) => setClientForm({ ...clientForm, status: e.target.value as ClientStatus })}>
              <option value="prospect">Prospecto</option><option value="active">Ativo</option><option value="partner">Parceiro</option><option value="inactive">Inativo</option>
            </Select>
          </div>
          <Input label="Segmento" value={clientForm.segment} onChange={(e) => setClientForm({ ...clientForm, segment: e.target.value })} />
          <Textarea label="Notas" value={clientForm.notes} rows={2} onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={() => { if (!clientForm.name || !clientForm.email) return; addClient(clientForm, PRODUCT); setAddingClient(false); setClientForm(emptyClient) }}>Salvar</Button>
            <Button variant="secondary" onClick={() => setAddingClient(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editingClient} onClose={() => setEditingClient(null)} title="Editar Cliente">
        {editingClient && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nome" defaultValue={editingClient.name} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} />
              <Input label="Empresa" defaultValue={editingClient.company} onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })} />
            </div>
            <Select label="Status" defaultValue={editingClient.status} onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value as ClientStatus })}>
              <option value="prospect">Prospecto</option><option value="active">Ativo</option><option value="partner">Parceiro</option><option value="inactive">Inativo</option>
            </Select>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => { updateClient(editingClient.id, editingClient, PRODUCT); setEditingClient(null) }}>Salvar</Button>
              <Button variant="secondary" onClick={() => setEditingClient(null)}>Cancelar</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Deal Modal */}
      <Modal open={!!editingDeal} onClose={() => setEditingDeal(null)} title="Editar Negócio">
        {editingDeal && (
          <div className="space-y-3">
            <Input label="Título" value={editingDeal.title} onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Estágio" value={editingDeal.stage} onChange={(e) => setEditingDeal({ ...editingDeal, stage: e.target.value as DealStage })}>
                {Object.entries(stageLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
              <Input label="Probabilidade (%)" type="number" value={String(editingDeal.probability)} onChange={(e) => setEditingDeal({ ...editingDeal, probability: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Valor (R$)" type="number" value={String(editingDeal.value)} onChange={(e) => setEditingDeal({ ...editingDeal, value: Number(e.target.value) })} />
              <Input label="Fechamento" type="date" value={editingDeal.expectedClose} onChange={(e) => setEditingDeal({ ...editingDeal, expectedClose: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => { updateDeal(editingDeal.id, editingDeal, PRODUCT); setEditingDeal(null) }}>Salvar</Button>
              <Button variant="secondary" onClick={() => setEditingDeal(null)}>Cancelar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={addingDeal} onClose={() => setAddingDeal(false)} title="Novo Negócio">
        <div className="space-y-3">
          <Input label="Título" value={dealForm.title} onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })} />
          <Select label="Cliente" value={dealForm.clientId} onChange={(e) => {
            const c = prodClients.find((x) => x.id === e.target.value)
            setDealForm({ ...dealForm, clientId: e.target.value, clientName: c?.name ?? '' })
          }}>
            <option value="">Selecionar cliente</option>
            {prodClients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Estágio" value={dealForm.stage} onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value as DealStage })}>
              {Object.entries(stageLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
            <Input label="Probabilidade (%)" type="number" value={dealForm.probability} onChange={(e) => setDealForm({ ...dealForm, probability: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Valor (R$)" type="number" value={dealForm.value} onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })} />
            <Input label="Fechamento" type="date" value={dealForm.expectedClose} onChange={(e) => setDealForm({ ...dealForm, expectedClose: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => {
              if (!dealForm.title || !dealForm.clientId) return
              addDeal({ title: dealForm.title, clientId: dealForm.clientId, clientName: dealForm.clientName, stage: dealForm.stage, value: Number(dealForm.value), probability: Number(dealForm.probability), expectedClose: dealForm.expectedClose }, PRODUCT)
              setAddingDeal(false); setDealForm(emptyDeal)
            }}>Salvar</Button>
            <Button variant="secondary" onClick={() => setAddingDeal(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
