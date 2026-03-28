import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, AlertCircle, Check } from 'lucide-react'
import { useFinancialStore } from '../../store/financialStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Input'
import type { TransactionType } from '../../types'

const PRODUCT = 'iris' as const
const emptyForm = { description: '', type: 'income' as TransactionType, amount: '', category: '', date: '', dueDate: '', paid: false }

export function FinancialPage() {
  const { transactions, payroll, addTransaction, updateTransaction, deleteTransaction, updatePayroll } = useFinancialStore()
  const [tab, setTab] = useState<'transactions' | 'payroll'>('transactions')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const prodTx = transactions[PRODUCT]
  const prodPayroll = payroll[PRODUCT]

  const totalIncome = prodTx.filter((t) => t.type === 'income' && t.paid).reduce((s, t) => s + t.amount, 0)
  const totalExpense = prodTx.filter((t) => t.type === 'expense' && t.paid).reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense
  const pending = prodTx.filter((t) => !t.paid).reduce((s, t) => s + t.amount, 0)
  const fmt = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><div className="flex items-center gap-2 mb-1"><TrendingUp size={16} className="text-green-500" /><p className="text-xs text-navy-400 font-medium">Receita</p></div><p className="text-xl font-bold text-green-600">{fmt(totalIncome)}</p></Card>
        <Card><div className="flex items-center gap-2 mb-1"><TrendingDown size={16} className="text-red-500" /><p className="text-xs text-navy-400 font-medium">Despesas</p></div><p className="text-xl font-bold text-red-500">{fmt(totalExpense)}</p></Card>
        <Card><div className="flex items-center gap-2 mb-1"><DollarSign size={16} className="text-cyan-500" /><p className="text-xs text-navy-400 font-medium">Saldo</p></div><p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(balance)}</p></Card>
        <Card><div className="flex items-center gap-2 mb-1"><AlertCircle size={16} className="text-amber-500" /><p className="text-xs text-navy-400 font-medium">A Vencer</p></div><p className="text-xl font-bold text-amber-600">{fmt(pending)}</p></Card>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white rounded-xl border border-cyan-100 p-1 shadow-card">
          {(['transactions', 'payroll'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-navy-800 text-white' : 'text-navy-500 hover:text-navy-800'}`}>
              {t === 'transactions' ? 'Lançamentos' : 'Folha P&D'}
            </button>
          ))}
        </div>
        {tab === 'transactions' && <Button size="sm" onClick={() => setAdding(true)}><Plus size={14} /> Lançamento</Button>}
      </div>

      {tab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-card border border-cyan-100/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-50 bg-surface">
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Descrição</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Tipo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Valor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {prodTx.map((t) => (
                <tr key={t.id} className="border-b border-navy-50 hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium text-navy-800">{t.description}</td>
                  <td className="px-4 py-3"><Badge variant={t.type === 'income' ? 'success' : 'danger'}>{t.type === 'income' ? 'Receita' : 'Despesa'}</Badge></td>
                  <td className={`px-4 py-3 font-semibold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{t.type === 'income' ? '+' : '-'}{fmt(t.amount)}</td>
                  <td className="px-4 py-3 text-navy-500 hidden md:table-cell">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => updateTransaction(t.id, { paid: !t.paid }, PRODUCT)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${t.paid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {t.paid ? <><Check size={11} /> Pago</> : 'Pendente'}
                    </button>
                  </td>
                  <td className="px-4 py-3"><button onClick={() => deleteTransaction(t.id, PRODUCT)} className="p-1.5 rounded text-navy-300 hover:text-red-500 hover:bg-red-50">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'payroll' && (
        <div className="bg-white rounded-xl shadow-card border border-cyan-100/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-50 bg-surface">
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Colaborador</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase hidden md:table-cell">Cargo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Salário Base</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Líquido</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {prodPayroll.map((e) => (
                <tr key={e.id} className="border-b border-navy-50 hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium text-navy-800">{e.employee}</td>
                  <td className="px-4 py-3 text-navy-500 hidden md:table-cell">{e.role}</td>
                  <td className="px-4 py-3 text-right text-navy-700">{fmt(e.baseSalary)}</td>
                  <td className="px-4 py-3 text-right font-bold text-navy-800">{fmt(e.netSalary)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => updatePayroll(e.id, { status: e.status === 'paid' ? 'pending' : 'paid' }, PRODUCT)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${e.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {e.status === 'paid' ? <><Check size={11} /> Pago</> : 'Pendente'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Novo Lançamento">
        <div className="space-y-3">
          <Input label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}>
              <option value="income">Receita</option><option value="expense">Despesa</option>
            </Select>
            <Input label="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Valor (R$)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Input label="Data" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-navy-700">
            <input type="checkbox" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })} className="rounded" />
            Já realizado/pago
          </label>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => {
              if (!form.description || !form.amount || !form.date) return
              addTransaction({ description: form.description, type: form.type, amount: Number(form.amount), category: form.category, date: form.date, paid: form.paid }, PRODUCT)
              setAdding(false); setForm(emptyForm)
            }}>Salvar</Button>
            <Button variant="secondary" onClick={() => setAdding(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
