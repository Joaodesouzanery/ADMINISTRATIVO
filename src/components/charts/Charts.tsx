import {
  AreaChart as ReArea, Area, BarChart as ReBar, Bar,
  PieChart as RePie, Pie, Cell, LineChart as ReLine, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#64D4E8', '#0D1B3E', '#22C55E', '#F59E0B', '#7DD4A8', '#EF4444']

interface ChartProps {
  data: Record<string, unknown>[]
  height?: number
}

export function AreaChart({ data, height = 260 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReArea data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EBF6FA" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4E6B9E' }} />
        <YAxis tick={{ fontSize: 11, fill: '#4E6B9E' }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #D6F4F9' }} />
        <Area type="monotone" dataKey="value" stroke="#64D4E8" fill="#D6F4F9" strokeWidth={2} name="Receita" />
        {data[0]?.value2 !== undefined && (
          <Area type="monotone" dataKey="value2" stroke="#0D1B3E" fill="#C5CCDF" strokeWidth={2} name="Despesa" />
        )}
      </ReArea>
    </ResponsiveContainer>
  )
}

export function BarChart({ data, height = 260 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBar data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EBF6FA" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4E6B9E' }} />
        <YAxis tick={{ fontSize: 11, fill: '#4E6B9E' }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Bar dataKey="value" fill="#64D4E8" radius={[4, 4, 0, 0]} name="Tarefas" />
      </ReBar>
    </ResponsiveContainer>
  )
}

export function PieChart({ data, height = 260 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePie margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend />
      </RePie>
    </ResponsiveContainer>
  )
}

export function LineChart({ data, height = 260 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLine data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EBF6FA" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4E6B9E' }} />
        <YAxis tick={{ fontSize: 11, fill: '#4E6B9E' }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Line type="monotone" dataKey="value" stroke="#64D4E8" strokeWidth={2} dot={{ fill: '#64D4E8', r: 4 }} name="Valor" />
      </ReLine>
    </ResponsiveContainer>
  )
}
