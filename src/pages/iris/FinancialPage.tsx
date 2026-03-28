import { useState, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, DollarSign, AlertCircle, Plus, Check,
  Edit2, Trash2, Download, FileSpreadsheet, FileText as FilePDF,
  ChevronDown, Target, Calculator, LayoutList, BarChart2, Wallet
} from 'lucide-react'
import { useFinancialStore } from '../../store/financialStore'
import { useTaskStore } from '../../store/taskStore'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { KPICard } from '../../components/ui/KPICard'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { AreaChart, PieChart, LineChart } from '../../components/charts/Charts'
import { exportTransactionsToPDF, exportTransactionsToExcel } from '../../utils/exportFinancial'
import type { Transaction, TransactionType, RecurrenceType, FinancialOKR } from '../../types'

const PRODUCT = 'iris' as const

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  once: 'Avulso', daily: 'Diário', weekly: 'Semanal',
  monthly: 'Mensal', quarterly: 'Trimestral', annual: 'Anual',
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const emptyTx: Omit<Transaction, 'id' | 'createdAt'> = {
  description: '', type: 'income', amount: 0, category: '', date: '',
  paid: false, recurrence: 'once', notes: '',
}

type MainTab = 'dashboard' | 'transacoes' | 'calculadora'
type ProjTab = 'mensal' | 'semestral' | 'anual'

const fmt = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

export function FinancialPage() {
  const { transactions, payroll, okrs, addTransaction, updateTransaction, deleteTransaction, addOKR, deleteOKR, updateKeyResult, updatePayroll } = useFinancialStore()
  const { addGoal } = useTaskStore()

  const prodTx = transactions[PRODUCT]
  const prodPayroll = payroll[PRODUCT]
  const prodOKRs = okrs[PRODUCT]

  const [mainTab, setMainTab] = useState<MainTab>('dashboard')
  const [projTab, setProjTab] = useState<ProjTab>('mensal')
  const [exportOpen, setExportOpen] = useState(false)

  const [filterType, setFilterType] = useState<'all' | TransactionType>('all')
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'pending'>('all')
  const [filterRecurrence, setFilterRecurrence] = useState<'all' | RecurrenceType>('all')
  const [filterCategory, setFilterCategory] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [txModalOpen, setTxModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [txForm, setTxForm] = useState<Omit<Transaction, 'id' | 'createdAt'>>(emptyTx)

  const [okrModalOpen, setOkrModalOpen] = useState(false)
  const [okrForm, setOkrForm] = useState({ objective: '', period: '', status: 'on_track' as FinancialOKR['status'] })

  const [calcIncome, setCalcIncome] = useState('')
  const [calcExpenses, setCalcExpenses] = useState('')
  const [calcSavings, setCalcSavings] = useState('')
  const [calcItems, setCalcItems] = useState<{ desc: string; amount: string }[]>([{ desc: '', amount: '' }])
  const [installItem, setInstallItem] = useState('')
  const [installPrice, setInstallPrice] = useState('')
  const [installIncome, setInstallIncome] = useState('')
  const [installExpenses, setInstallExpenses] = useState('')

  const totalIncome = prodTx.filter((t) => t.type === 'income' && t.paid).reduce((s, t) => s + t.amount, 0)
  const totalExpense = prodTx.filter((t) => t.type === 'expense' && t.paid).reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense
  const pending = prodTx.filter((t) => !t.paid).reduce((s, t) => s + t.amount, 0)
  const mrr = prodTx.filter((t) => t.type === 'income' && t.recurrence === 'monthly' && t.paid).reduce((s, t) => s + t.amount, 0)

  const mrrData = MONTHS.map((label, i) => ({
    label,
    value: mrr + i * 18000 + Math.sin(i * 0.7) * 20000,
    value2: totalExpense / 12 + i * 3000,
  }))

  const incomeByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    prodTx.filter((t) => t.type === 'income').forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount })
    return Object.entries(map).map(([label, value]) => ({ label, value }))
  }, [prodTx])

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    prodTx.filter((t) => t.type === 'expense').forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount })
    return Object.entries(map).map(([label, value]) => ({ label, value }))
  }, [prodTx])

  const projectionData = useMemo(() => {
    const months = projTab === 'mensal' ? 12 : projTab === 'semestral' ? 6 : 24
    const monthlyNet = prodTx.filter((t) => t.recurrence === 'monthly').reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0)
    let cumulative = balance
    return Array.from({ length: months }, (_, i) => {
      cumulative += monthlyNet
      return { label: MONTHS[i % 12], value: Math.max(0, cumulative) }
    })
  }, [projTab, prodTx, balance])

  const filteredTx = useMemo(() => prodTx.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false
    if (filterPaid === 'paid' && !t.paid) return false
    if (filterPaid === 'pending' && t.paid) return false
    if (filterRecurrence !== 'all' && t.recurrence !== filterRecurrence) return false
    if (filterCategory && !t.category.toLowerCase().includes(filterCategory.toLowerCase())) return false
    if (dateFrom && t.date < dateFrom) return false
    if (dateTo && t.date > dateTo) return false
    return true
  }), [prodTx, filterType, filterPaid, filterRecurrence, filterCategory, dateFrom, dateTo])

  const filteredIncome = filteredTx.filter((t) => t.type === 'income' && t.paid).reduce((s, t) => s + t.amount, 0)
  const filteredExpense = filteredTx.filter((t) => t.type === 'expense' && t.paid).reduce((s, t) => s + t.amount, 0)

  const installmentOptions = useMemo(() => {
    const price = parseFloat(installPrice) || 0
    const income = parseFloat(installIncome) || 0
    const expenses = parseFloat(installExpenses) || 0
    const free = income - expenses
    if (!price || !income) return []
    return [
      { pct: 5, label: 'Conservadora', rating: '✅ Recomendado', color: 'text-green-600' },
      { pct: 10, label: 'Moderada', rating: '✅ Recomendado', color: 'text-green-600' },
      { pct: 15, label: 'Padrão', rating: '⚠️ Aceitável', color: 'text-amber-600' },
      { pct: 20, label: 'Agressiva', rating: '⚠️ Cuidado', color: 'text-amber-700' },
      { pct: 30, label: 'Máxima', rating: '❌ Arriscado', color: 'text-red-600' },
    ].map((t) => ({ ...t, monthlyPayment: (income * t.pct) / 100, months: Math.ceil(price / ((income * t.pct) / 100)), fits: (income * t.pct) / 100 <= free, free }))
  }, [installPrice, installIncome, installExpenses])

  function openAddTx() { setEditingTx(null); setTxForm(emptyTx); setTxModalOpen(true) }
  function openEditTx(t: Transaction) { setEditingTx(t); setTxForm({ description: t.description, type: t.type, amount: t.amount, category: t.category, date: t.date, dueDate: t.dueDate, paid: t.paid, recurrence: t.recurrence, notes: t.notes }); setTxModalOpen(true) }
  function saveTx() { if (!txForm.description || !txForm.date) return; if (editingTx) updateTransaction(editingTx.id, txForm, PRODUCT); else addTransaction(txForm, PRODUCT); setTxModalOpen(false) }

  const STATUS_COLOR: Record<string, string> = { on_track: 'success', at_risk: 'warning', completed: 'info' }
  const STATUS_LABEL: Record<string, string> = { on_track: 'No prazo', at_risk: 'Em risco', completed: 'Concluído' }

  const TABS: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={15} /> },
    { id: 'transacoes', label: 'Transações', icon: <LayoutList size={15} /> },
    { id: 'calculadora', label: 'Calculadora', icon: <Calculator size={15} /> },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white rounded-xl border border-cyan-100 p-1 shadow-card">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setMainTab(t.id)} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mainTab === t.id ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Button size="sm" variant="secondary" onClick={() => setExportOpen((o) => !o)}>
            <Download size={14} /> Exportar <ChevronDown size={12} />
          </Button>
          {exportOpen && (
            <div className="absolute right-0 top-9 bg-white border border-navy-100 rounded-xl shadow-modal z-20 py-1 w-44">
              <button onClick={() => { exportTransactionsToPDF(prodTx, prodPayroll, 'IRIS'); setExportOpen(false) }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-navy-700 hover:bg-surface">
                <FilePDF size={14} className="text-red-500" /> Exportar PDF
              </button>
              <button onClick={() => { exportTransactionsToExcel(prodTx, prodPayroll, 'IRIS'); setExportOpen(false) }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-navy-700 hover:bg-surface">
                <FileSpreadsheet size={14} className="text-green-600" /> Exportar Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DASHBOARD */}
      {mainTab === 'dashboard' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="MRR" value={fmt(mrr)} trend={18} icon={<TrendingUp size={18} />} />
            <KPICard title="Despesas" value={fmt(totalExpense)} trend={-5} icon={<TrendingDown size={18} />} color="#EF4444" />
            <KPICard title="Saldo" value={fmt(balance)} icon={<DollarSign size={18} />} color={balance >= 0 ? '#22C55E' : '#EF4444'} />
            <KPICard title="A Vencer" value={fmt(pending)} icon={<AlertCircle size={18} />} color="#F59E0B" />
          </div>

          <Card>
            <CardHeader title="Receita vs Despesa" subtitle="Crescimento MRR — 12 meses" />
            <AreaChart data={mrrData} />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader title="Receita por Categoria" />
              {incomeByCategory.length > 0 ? <PieChart data={incomeByCategory} /> : <p className="text-sm text-navy-400 py-8 text-center">Sem dados</p>}
            </Card>
            <Card>
              <CardHeader title="Despesas por Categoria" />
              {expenseByCategory.length > 0 ? <PieChart data={expenseByCategory} /> : <p className="text-sm text-navy-400 py-8 text-center">Sem dados</p>}
            </Card>
          </div>

          {/* OKRs */}
          <Card>
            <CardHeader title="OKRs Financeiros" subtitle="Objetivos e resultados-chave" action={<Button size="sm" onClick={() => setOkrModalOpen(true)}><Plus size={13} /> OKR</Button>} />
            {prodOKRs.length === 0 ? <p className="text-sm text-navy-400 py-4 text-center">Nenhum OKR cadastrado.</p> : (
              <div className="space-y-4">
                {prodOKRs.map((okr) => (
                  <div key={okr.id} className="border border-cyan-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target size={15} className="text-cyan-500 shrink-0" />
                        <p className="font-semibold text-navy-800 text-sm">{okr.objective}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <Badge variant={STATUS_COLOR[okr.status] as 'success' | 'warning' | 'info'}>{STATUS_LABEL[okr.status]}</Badge>
                        <span className="text-xs text-navy-400">{okr.period}</span>
                        <button onClick={() => deleteOKR(okr.id, PRODUCT)} className="p-1 rounded text-navy-300 hover:text-red-500"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div className="space-y-2 pl-5">
                      {okr.keyResults.map((kr) => {
                        const pct = Math.min(100, Math.round((kr.current / kr.target) * 100))
                        return (
                          <div key={kr.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-navy-600">{kr.description}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-navy-500">{kr.unit === 'R$' ? fmt(kr.current) : `${kr.current} ${kr.unit}`} / {kr.unit === 'R$' ? fmt(kr.target) : `${kr.target} ${kr.unit}`}</span>
                                <span className="text-xs font-bold text-navy-700">{pct}%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <input type="number" className="w-20 text-xs border border-navy-100 rounded px-1.5 py-0.5 outline-none focus:border-cyan-400" placeholder="Atual" defaultValue={kr.current} onBlur={(e) => updateKeyResult(okr.id, kr.id, { current: parseFloat(e.target.value) || 0 }, PRODUCT)} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Projections */}
          <Card>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-navy-800">Projeção de Saldo</h3>
                <p className="text-sm text-navy-400 mt-0.5">Baseado em MRR e recorrências</p>
              </div>
              <div className="flex bg-surface rounded-lg p-0.5 border border-cyan-100">
                {(['mensal', 'semestral', 'anual'] as ProjTab[]).map((t) => (
                  <button key={t} onClick={() => setProjTab(t)} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${projTab === t ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <LineChart data={projectionData} height={220} />
          </Card>

          {/* Payroll */}
          <Card>
            <CardHeader title="Folha P&D" subtitle={prodPayroll[0]?.month ?? ''} />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-50">
                  <th className="text-left py-2 text-xs font-semibold text-navy-500 uppercase">Colaborador</th>
                  <th className="text-left py-2 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Cargo</th>
                  <th className="text-right py-2 text-xs font-semibold text-navy-500 uppercase">Base</th>
                  <th className="text-right py-2 text-xs font-semibold text-navy-500 uppercase">Líquido</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {prodPayroll.map((e) => (
                  <tr key={e.id} className="border-b border-navy-50 hover:bg-surface/50">
                    <td className="py-2.5 font-medium text-navy-800">{e.employee}</td>
                    <td className="py-2.5 text-navy-500 hidden md:table-cell">{e.role}</td>
                    <td className="py-2.5 text-right text-navy-700">{fmt(e.baseSalary)}</td>
                    <td className="py-2.5 text-right font-bold text-navy-800">{fmt(e.netSalary)}</td>
                    <td className="py-2.5">
                      <button onClick={() => updatePayroll(e.id, { status: e.status === 'paid' ? 'pending' : 'paid' }, PRODUCT)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${e.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {e.status === 'paid' ? <><Check size={10} /> Pago</> : 'Pendente'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* TRANSAÇÕES */}
      {mainTab === 'transacoes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-cyan-100 shadow-card p-4 flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-navy-600 block mb-1">Tipo</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as 'all' | TransactionType)} className="border border-navy-100 rounded-lg px-2 py-1.5 text-sm bg-white outline-none text-navy-700">
                <option value="all">Todos</option><option value="income">Receita</option><option value="expense">Despesa</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-navy-600 block mb-1">Status</label>
              <select value={filterPaid} onChange={(e) => setFilterPaid(e.target.value as 'all' | 'paid' | 'pending')} className="border border-navy-100 rounded-lg px-2 py-1.5 text-sm bg-white outline-none text-navy-700">
                <option value="all">Todos</option><option value="paid">Pagos</option><option value="pending">Pendentes</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-navy-600 block mb-1">Recorrência</label>
              <select value={filterRecurrence} onChange={(e) => setFilterRecurrence(e.target.value as 'all' | RecurrenceType)} className="border border-navy-100 rounded-lg px-2 py-1.5 text-sm bg-white outline-none text-navy-700">
                <option value="all">Todas</option>
                {Object.entries(RECURRENCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-navy-600 block mb-1">Categoria</label>
              <input value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} placeholder="Filtrar..." className="border border-navy-100 rounded-lg px-2 py-1.5 text-sm bg-white outline-none focus:border-cyan-400 w-32 text-navy-800 placeholder-navy-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-600 block mb-1">De</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-navy-100 rounded-lg px-2 py-1.5 text-sm bg-white outline-none focus:border-cyan-400 text-navy-700" />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-600 block mb-1">Até</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-navy-100 rounded-lg px-2 py-1.5 text-sm bg-white outline-none focus:border-cyan-400 text-navy-700" />
            </div>
            <Button size="sm" onClick={openAddTx} className="ml-auto"><Plus size={14} /> Lançamento</Button>
          </div>

          <div className="bg-white rounded-xl shadow-card border border-cyan-100/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-50 bg-surface">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Descrição</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden lg:table-cell">Recorrência</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Valor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((t) => (
                  <tr key={t.id} className="border-b border-navy-50 hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 text-navy-600 text-xs whitespace-nowrap">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 font-medium text-navy-800">{t.description}</td>
                    <td className="px-4 py-3 text-navy-500 hidden md:table-cell">{t.category}</td>
                    <td className="px-4 py-3"><Badge variant={t.type === 'income' ? 'success' : 'danger'}>{t.type === 'income' ? 'Receita' : 'Despesa'}</Badge></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><Badge variant="default">{RECURRENCE_LABELS[t.recurrence]}</Badge></td>
                    <td className={`px-4 py-3 font-semibold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{t.type === 'income' ? '+' : '-'}{fmt(t.amount)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => updateTransaction(t.id, { paid: !t.paid }, PRODUCT)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${t.paid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {t.paid ? <><Check size={10} /> Pago</> : 'Pendente'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEditTx(t)} className="p-1.5 rounded text-navy-400 hover:text-navy-800 hover:bg-surface"><Edit2 size={12} /></button>
                        <button onClick={() => deleteTransaction(t.id, PRODUCT)} className="p-1.5 rounded text-navy-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-navy-100 bg-surface">
                  <td colSpan={5} className="px-4 py-3 text-xs font-semibold text-navy-600 uppercase">{filteredTx.length} lançamentos</td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-xs text-green-600 font-semibold">+{fmt(filteredIncome)}</div>
                    <div className="text-xs text-red-500 font-semibold">-{fmt(filteredExpense)}</div>
                    <div className={`text-sm font-bold ${filteredIncome - filteredExpense >= 0 ? 'text-navy-800' : 'text-red-600'}`}>{fmt(filteredIncome - filteredExpense)}</div>
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* CALCULADORA */}
      {mainTab === 'calculadora' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Calculadora de Orçamento" subtitle="Entenda como sua renda se distribui" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <Input label="Renda mensal (R$)" type="number" value={calcIncome} onChange={(e) => setCalcIncome(e.target.value)} placeholder="Ex: 20000" />
              <Input label="Despesas fixas mensais (R$)" type="number" value={calcExpenses} onChange={(e) => setCalcExpenses(e.target.value)} placeholder="Ex: 8000" />
              <Input label="Meta de poupança (R$)" type="number" value={calcSavings} onChange={(e) => setCalcSavings(e.target.value)} placeholder="Ex: 5000" />
            </div>
            {calcIncome && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Disponível', value: fmt(parseFloat(calcIncome) - parseFloat(calcExpenses || '0')), color: 'text-green-600' },
                    { label: '% Comprometida', value: `${Math.round((parseFloat(calcExpenses || '0') / parseFloat(calcIncome)) * 100)}%`, color: 'text-amber-600' },
                    { label: '% Poupança', value: `${Math.round((parseFloat(calcSavings || '0') / parseFloat(calcIncome)) * 100)}%`, color: 'text-cyan-600' },
                    { label: 'Margem Livre', value: fmt(parseFloat(calcIncome) - parseFloat(calcExpenses || '0') - parseFloat(calcSavings || '0')), color: 'text-navy-800' },
                  ].map((item) => (
                    <div key={item.label} className="bg-surface rounded-xl p-3 text-center border border-cyan-100">
                      <p className="text-xs text-navy-400 mb-1">{item.label}</p>
                      <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-navy-50 pt-4">
                  <p className="text-sm font-semibold text-navy-700 mb-3">Quanto custa X para mim?</p>
                  <div className="space-y-2">
                    {calcItems.map((item, i) => {
                      const amt = parseFloat(item.amount) || 0
                      const inc = parseFloat(calcIncome) || 1
                      const monthsToSave = calcSavings ? Math.ceil(amt / parseFloat(calcSavings)) : null
                      return (
                        <div key={i} className="flex items-center gap-2 flex-wrap">
                          <input value={item.desc} onChange={(e) => { const c = [...calcItems]; c[i].desc = e.target.value; setCalcItems(c) }} placeholder="O que deseja comprar..." className="flex-1 min-w-36 border border-navy-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-cyan-400 text-navy-800 placeholder-navy-400" />
                          <input type="number" value={item.amount} onChange={(e) => { const c = [...calcItems]; c[i].amount = e.target.value; setCalcItems(c) }} placeholder="R$" className="w-28 border border-navy-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-cyan-400 text-navy-800" />
                          {amt > 0 && (
                            <div className="flex gap-2 text-xs">
                              <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-full px-2 py-0.5">{((amt / inc) * 100).toFixed(1)}% da renda</span>
                              {monthsToSave && <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">{monthsToSave} mes{monthsToSave !== 1 ? 'es' : ''} poupando</span>}
                            </div>
                          )}
                          <button onClick={() => setCalcItems(calcItems.filter((_, j) => j !== i))} className="p-1 text-navy-300 hover:text-red-500"><Trash2 size={13} /></button>
                        </div>
                      )
                    })}
                    <Button variant="ghost" size="sm" onClick={() => setCalcItems([...calcItems, { desc: '', amount: '' }])}><Plus size={13} /> Adicionar item</Button>
                  </div>
                </div>
              </>
            )}
          </Card>

          <Card>
            <CardHeader title="Parcela Saudável" subtitle="Descubra a melhor forma de parcelar sua compra" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <Input label="O que deseja comprar?" value={installItem} onChange={(e) => setInstallItem(e.target.value)} placeholder="Ex: Servidor, Software..." />
              <Input label="Preço total (R$)" type="number" value={installPrice} onChange={(e) => setInstallPrice(e.target.value)} />
              <Input label="Renda mensal (R$)" type="number" value={installIncome} onChange={(e) => setInstallIncome(e.target.value)} />
              <Input label="Despesas fixas mensais (R$)" type="number" value={installExpenses} onChange={(e) => setInstallExpenses(e.target.value)} />
            </div>
            {installmentOptions.length > 0 && (
              <div className="space-y-3">
                {installItem && <p className="text-sm font-semibold text-navy-700">Opções para: <span className="text-cyan-600">{installItem}</span> — {fmt(parseFloat(installPrice))}</p>}
                <div className="flex items-center gap-2 text-sm text-navy-500 mb-2">
                  <Wallet size={14} className="text-cyan-500" />
                  Sobra livre: <span className="font-bold text-navy-800">{fmt((parseFloat(installIncome) || 0) - (parseFloat(installExpenses) || 0))}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy-50 bg-surface">
                        <th className="text-left px-3 py-2 text-xs font-semibold text-navy-500 uppercase">Modalidade</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-navy-500 uppercase">% Renda</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-navy-500 uppercase">Valor/mês</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-navy-500 uppercase">Parcelas</th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-navy-500 uppercase">Rating</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {installmentOptions.map((opt) => (
                        <tr key={opt.pct} className={`border-b border-navy-50 ${!opt.fits ? 'opacity-50' : 'hover:bg-surface/50'}`}>
                          <td className="px-3 py-2.5 font-medium text-navy-800">{opt.label}</td>
                          <td className="px-3 py-2.5 text-right text-navy-600">{opt.pct}%</td>
                          <td className="px-3 py-2.5 text-right font-semibold text-navy-800">{fmt(opt.monthlyPayment)}</td>
                          <td className="px-3 py-2.5 text-right text-navy-600">{opt.months}x</td>
                          <td className={`px-3 py-2.5 text-sm font-medium ${opt.color}`}>{opt.rating}</td>
                          <td className="px-3 py-2.5">
                            <Button size="sm" variant="ghost" onClick={() => addGoal({ title: `Poupar: ${installItem || 'Compra'}`, description: `Parcela ${opt.label}: ${fmt(opt.monthlyPayment)}/mês × ${opt.months}`, target: parseFloat(installPrice) || 0, current: 0, unit: 'R$', dueDate: new Date(Date.now() + opt.months * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), status: 'on_track' }, PRODUCT)} className="text-cyan-600 hover:bg-cyan-50 whitespace-nowrap text-xs">
                              + Meta
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* MODALS */}
      <Modal open={txModalOpen} onClose={() => setTxModalOpen(false)} title={editingTx ? 'Editar Lançamento' : 'Novo Lançamento'} size="lg">
        <div className="space-y-3">
          <Input label="Descrição" value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo" value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value as TransactionType })}>
              <option value="income">Receita</option><option value="expense">Despesa</option>
            </Select>
            <Select label="Recorrência" value={txForm.recurrence} onChange={(e) => setTxForm({ ...txForm, recurrence: e.target.value as RecurrenceType })}>
              {Object.entries(RECURRENCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Valor (R$)" type="number" value={txForm.amount || ''} onChange={(e) => setTxForm({ ...txForm, amount: parseFloat(e.target.value) || 0 })} />
            <Input label="Categoria" value={txForm.category} onChange={(e) => setTxForm({ ...txForm, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data" type="date" value={txForm.date} onChange={(e) => setTxForm({ ...txForm, date: e.target.value })} />
            <Input label="Vencimento (opcional)" type="date" value={txForm.dueDate ?? ''} onChange={(e) => setTxForm({ ...txForm, dueDate: e.target.value || undefined })} />
          </div>
          <Textarea label="Notas" value={txForm.notes ?? ''} rows={2} onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-navy-700">
            <input type="checkbox" checked={txForm.paid} onChange={(e) => setTxForm({ ...txForm, paid: e.target.checked })} className="rounded" />
            Já realizado / pago
          </label>
          <div className="flex gap-2 pt-2">
            <Button onClick={saveTx}>{editingTx ? 'Salvar' : 'Adicionar'}</Button>
            <Button variant="secondary" onClick={() => setTxModalOpen(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={okrModalOpen} onClose={() => setOkrModalOpen(false)} title="Novo OKR Financeiro">
        <div className="space-y-3">
          <Input label="Objetivo" value={okrForm.objective} onChange={(e) => setOkrForm({ ...okrForm, objective: e.target.value })} placeholder="Ex: Atingir ARR de R$ 5M" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Período" value={okrForm.period} onChange={(e) => setOkrForm({ ...okrForm, period: e.target.value })} placeholder="Ex: 2026" />
            <Select label="Status" value={okrForm.status} onChange={(e) => setOkrForm({ ...okrForm, status: e.target.value as FinancialOKR['status'] })}>
              <option value="on_track">No prazo</option><option value="at_risk">Em risco</option><option value="completed">Concluído</option>
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => { if (!okrForm.objective) return; addOKR({ objective: okrForm.objective, period: okrForm.period, status: okrForm.status, keyResults: [] }, PRODUCT); setOkrModalOpen(false); setOkrForm({ objective: '', period: '', status: 'on_track' }) }}>Criar OKR</Button>
            <Button variant="secondary" onClick={() => setOkrModalOpen(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
