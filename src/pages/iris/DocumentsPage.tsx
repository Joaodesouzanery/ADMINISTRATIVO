// Re-uses same UI as ConstruData documents but with IRIS product key
import { useState } from 'react'
import { Plus, FileText, FileCheck2, BarChart, Bot, Search, Trash2, Eye, Edit2 } from 'lucide-react'
import { useDocumentStore } from '../../store/documentStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import type { Document, DocType } from '../../types'

const PRODUCT = 'iris' as const

const typeConfig: Record<DocType, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
  document: { label: 'Documento', icon: FileText,   color: 'text-navy-500' },
  contract: { label: 'Contrato',  icon: FileCheck2, color: 'text-cyan-600' },
  report:   { label: 'Relatório', icon: BarChart,   color: 'text-amber-600' },
  prompt:   { label: 'Prompt IA', icon: Bot,        color: 'text-green-600' },
}
const typeBadge: Record<DocType, 'default' | 'info' | 'warning' | 'success'> = {
  document: 'default', contract: 'info', report: 'warning', prompt: 'success'
}

export function DocumentsPage() {
  const { documents, addDocument, updateDocument, deleteDocument } = useDocumentStore()
  const docs = documents[PRODUCT]
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<DocType | 'all'>('all')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Document | null>(null)
  const [viewing, setViewing] = useState<Document | null>(null)
  const [form, setForm] = useState({ title: '', type: 'document' as DocType, category: '', content: '', version: '1.0', tags: '' })

  function openEdit(doc: Document) {
    setEditing(doc)
    setForm({ title: doc.title, type: doc.type, category: doc.category, content: doc.content ?? '', version: doc.version, tags: (doc.tags ?? []).join(', ') })
  }
  function saveEdit() {
    if (!editing || !form.title) return
    updateDocument(editing.id, { title: form.title, type: form.type, category: form.category, content: form.content, version: form.version, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }, PRODUCT)
    setEditing(null)
  }

  const filtered = docs.filter((d) => {
    return (d.title.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase())) && (filterType === 'all' || d.type === filterType)
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar documentos..." className="w-full pl-9 pr-4 py-2 text-sm border border-navy-100 rounded-lg bg-white outline-none focus:border-cyan-400 text-navy-800 placeholder-navy-400" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as DocType | 'all')} className="border border-navy-100 rounded-lg px-3 py-2 text-sm bg-white outline-none text-navy-700">
          <option value="all">Todos os tipos</option>
          <option value="document">Documentos</option>
          <option value="contract">Contratos</option>
          <option value="report">Relatórios</option>
          <option value="prompt">Prompts IA</option>
        </select>
        <Button size="sm" onClick={() => setAdding(true)}><Plus size={14} /> Novo</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const { label, icon: Icon, color } = typeConfig[doc.type]
          return (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <Icon size={18} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy-800 text-sm truncate">{doc.title}</p>
                  <p className="text-xs text-navy-400 mt-0.5">{doc.category} · v{doc.version}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge variant={typeBadge[doc.type]}>{label}</Badge>
                {doc.tags?.slice(0, 2).map((t) => <Badge key={t} variant="default">{t}</Badge>)}
              </div>
              <p className="text-xs text-navy-400 mt-2">Atualizado: {new Date(doc.updatedAt).toLocaleDateString('pt-BR')}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => setViewing(doc)}><Eye size={13} /> Ver</Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(doc)}><Edit2 size={13} /> Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => deleteDocument(doc.id, PRODUCT)} className="text-red-500 hover:bg-red-50"><Trash2 size={13} /></Button>
              </div>
            </Card>
          )
        })}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Novo Documento" size="lg">
        <div className="space-y-3">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DocType })}>
              <option value="document">Documento</option><option value="contract">Contrato</option><option value="report">Relatório</option><option value="prompt">Prompt IA</option>
            </Select>
            <Input label="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Versão" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
            <Input label="Tags (vírgula)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <Textarea label="Conteúdo" value={form.content} rows={5} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={() => {
              if (!form.title) return
              addDocument({ title: form.title, type: form.type, category: form.category, content: form.content, version: form.version, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }, PRODUCT)
              setAdding(false); setForm({ title: '', type: 'document', category: '', content: '', version: '1.0', tags: '' })
            }}>Salvar</Button>
            <Button variant="secondary" onClick={() => setAdding(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar Documento" size="lg">
        <div className="space-y-3">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DocType })}>
              <option value="document">Documento</option><option value="contract">Contrato</option><option value="report">Relatório</option><option value="prompt">Prompt IA</option>
            </Select>
            <Input label="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Versão" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
            <Input label="Tags (vírgula)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <Textarea label="Conteúdo" value={form.content} rows={5} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button onClick={saveEdit}>Salvar</Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title ?? ''} size="lg">
        {viewing && (
          <div className="space-y-3">
            <div className="flex gap-3 flex-wrap">
              <Badge variant={typeBadge[viewing.type]}>{typeConfig[viewing.type].label}</Badge>
              <Badge variant="default">{viewing.category}</Badge>
              <Badge variant="default">v{viewing.version}</Badge>
            </div>
            {viewing.content && <div className="bg-surface rounded-lg p-4"><pre className="text-sm text-navy-700 whitespace-pre-wrap font-sans">{viewing.content}</pre></div>}
          </div>
        )}
      </Modal>
    </div>
  )
}
