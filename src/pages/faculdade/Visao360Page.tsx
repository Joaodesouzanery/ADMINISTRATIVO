import { useFaculdadeStore } from '../../store/faculdadeStore'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { KPICard } from '../../components/ui/KPICard'
import { BookOpen, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react'

const tipoLabel: Record<string, string> = { prova: 'Prova', trabalho: 'Trabalho', lista: 'Lista', seminario: 'Seminário', outro: 'Outro' }
const tipoBadge: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'default'> = { prova: 'danger', trabalho: 'warning', lista: 'info', seminario: 'success', outro: 'default' }

export function Visao360Page() {
  const { materias, atividades } = useFaculdadeStore()

  const total = atividades.length
  const concluidas = atividades.filter((a) => a.concluida).length
  const pendentes = total - concluidas
  const now = new Date()
  const atrasadas = atividades.filter((a) => !a.concluida && new Date(a.dataEntrega) < now).length
  const proximas7d = atividades.filter((a) => {
    if (a.concluida) return false
    const d = new Date(a.dataEntrega)
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  }).sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega))

  // Media de notas por matéria
  const mediasPorMateria = materias.map((m) => {
    const atvsComNota = atividades.filter((a) => a.materiaId === m.id && a.nota !== undefined)
    if (atvsComNota.length === 0) return { materia: m, media: null, total: atividades.filter((a) => a.materiaId === m.id).length, concluidas: atividades.filter((a) => a.materiaId === m.id && a.concluida).length }
    const somaNotas = atvsComNota.reduce((s, a) => s + (a.nota ?? 0) * (a.peso ?? 1), 0)
    const somaPesos = atvsComNota.reduce((s, a) => s + (a.peso ?? 1), 0)
    return { materia: m, media: somaPesos > 0 ? somaNotas / somaPesos : null, total: atividades.filter((a) => a.materiaId === m.id).length, concluidas: atividades.filter((a) => a.materiaId === m.id && a.concluida).length }
  })

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-navy-800">Visão 360° — Panorama Acadêmico</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Matérias" value={materias.length} icon={<BookOpen size={18} />} color="#8B5CF6" />
        <KPICard title="Concluídas" value={concluidas} subtitle={`de ${total} atividades`} icon={<CheckCircle size={18} />} color="#10B981" />
        <KPICard title="Pendentes" value={pendentes} icon={<Clock size={18} />} color="#F59E0B" />
        <KPICard title="Atrasadas" value={atrasadas} icon={<AlertTriangle size={18} />} color="#EF4444" />
      </div>

      {/* Próximas 7 dias */}
      <Card>
        <h3 className="font-semibold text-navy-800 text-sm mb-3 flex items-center gap-2"><Clock size={15} className="text-purple-500" /> Próximos 7 dias</h3>
        {proximas7d.length === 0 && <p className="text-xs text-navy-400">Nenhuma atividade nos próximos 7 dias.</p>}
        <div className="space-y-2">
          {proximas7d.map((a) => {
            const materia = materias.find((m) => m.id === a.materiaId)
            const diasAte = Math.ceil((new Date(a.dataEntrega).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: materia?.cor ?? '#8B5CF6' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{a.titulo}</p>
                  <p className="text-xs text-navy-400">{materia?.nome ?? '—'}</p>
                </div>
                <Badge variant={tipoBadge[a.tipo]}>{tipoLabel[a.tipo]}</Badge>
                <span className={`text-xs font-medium ${diasAte <= 1 ? 'text-red-500' : diasAte <= 3 ? 'text-amber-500' : 'text-navy-400'}`}>
                  {diasAte === 0 ? 'Hoje' : diasAte === 1 ? 'Amanhã' : `${diasAte}d`}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Matérias overview */}
      <div>
        <h3 className="font-semibold text-navy-800 text-sm mb-3 flex items-center gap-2"><TrendingUp size={15} className="text-purple-500" /> Desempenho por Matéria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediasPorMateria.map(({ materia, media, total: t, concluidas: c }) => {
            const pct = t > 0 ? Math.round((c / t) * 100) : 0
            return (
              <Card key={materia.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: materia.cor + '20' }}>
                    <BookOpen size={14} style={{ color: materia.cor }} />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-800 text-sm">{materia.nome}</p>
                    {materia.professor && <p className="text-[10px] text-navy-400">{materia.professor}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-navy-500 mb-1">
                  <span>{c}/{t} concluídas</span>
                  <span className="font-bold text-navy-800">{pct}%</span>
                </div>
                <div className="h-2 bg-navy-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: materia.cor }} />
                </div>
                {media !== null && (
                  <p className="text-xs font-medium" style={{ color: media >= 7 ? '#10B981' : media >= 5 ? '#F59E0B' : '#EF4444' }}>
                    Média: {media.toFixed(1)}
                  </p>
                )}
                {media === null && <p className="text-xs text-navy-300">Sem notas</p>}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Atrasadas */}
      {atrasadas > 0 && (
        <Card>
          <h3 className="font-semibold text-red-600 text-sm mb-3 flex items-center gap-2"><AlertTriangle size={15} /> Atividades Atrasadas</h3>
          <div className="space-y-2">
            {atividades.filter((a) => !a.concluida && new Date(a.dataEntrega) < now).map((a) => {
              const materia = materias.find((m) => m.id === a.materiaId)
              const diasAtraso = Math.abs(Math.ceil((new Date(a.dataEntrega).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: materia?.cor ?? '#EF4444' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy-800">{a.titulo}</p>
                    <p className="text-xs text-navy-400">{materia?.nome ?? '—'}</p>
                  </div>
                  <span className="text-xs font-medium text-red-500">{diasAtraso}d atrasada</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
