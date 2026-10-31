import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { CATEGORY_COLORS, formatCurrency } from '../data/mockData.js';

const PALETTE = ['#2563eb', '#0d9488', '#7c3aed', '#d97706', '#db2777', '#475569', '#16a34a', '#0891b2', '#9333ea'];
const colorFor = (name, i) => CATEGORY_COLORS[name] ?? PALETTE[i % PALETTE.length];

const axisProps = { tick: { fill: '#64748b', fontSize: 12 }, axisLine: false, tickLine: false };
const yMoney = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`);

function MoneyTooltip({ active, payload, label, valueLabel }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-ink">{label ?? payload[0].name}</p>
      <p className="mt-0.5 text-muted">
        {valueLabel}: <span className="font-semibold text-ink tabular-nums">{formatCurrency(payload[0].value, 2)}</span>
      </p>
    </div>
  );
}

// Renders a { name, value } series as a line, bar or donut chart.
export default function InsightChart({ data, type = 'bar', height = 260, valueLabel = 'Revenue', xKey = 'name', yKey = 'value', horizontal }) {
  const isHorizontal = horizontal ?? (type === 'bar' && data.length > 4 && data.some((d) => String(d[xKey]).length > 10));
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#eef2f6" vertical={false} />
          <XAxis dataKey={xKey} {...axisProps} interval="preserveStartEnd" minTickGap={18} />
          <YAxis {...axisProps} tickFormatter={yMoney} width={52} />
          <Tooltip content={<MoneyTooltip valueLabel={valueLabel} />} cursor={{ stroke: '#cbd5e1' }} />
          <Line isAnimationActive={false} type="monotone" dataKey={yKey} name={valueLabel} stroke="#2563eb" strokeWidth={2.25} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (type === 'donut') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie isAnimationActive={false} data={data} dataKey={yKey} nameKey={xKey} innerRadius="55%" outerRadius="80%" paddingAngle={2} stroke="none">
            {data.map((d, i) => <Cell key={d[xKey]} fill={colorFor(d[xKey], i)} />)}
          </Pie>
          <Tooltip content={<MoneyTooltip valueLabel={valueLabel} />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#475569' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (isHorizontal) {
    return (
      <ResponsiveContainer width="100%" height={Math.max(height, data.length * 34)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#eef2f6" horizontal={false} />
          <XAxis type="number" {...axisProps} tickFormatter={yMoney} />
          <YAxis type="category" dataKey={xKey} {...axisProps} width={128} tick={{ fill: '#475569', fontSize: 11 }} />
          <Tooltip content={<MoneyTooltip valueLabel={valueLabel} />} cursor={{ fill: '#f1f5f9' }} />
          <Bar isAnimationActive={false} dataKey={yKey} name={valueLabel} radius={[0, 4, 4, 0]} maxBarSize={22}>
            {data.map((d, i) => <Cell key={d[xKey]} fill={d.dim ? '#bfdbfe' : colorFor(d[xKey], 0)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#eef2f6" vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} interval={data.length > 12 ? 'preserveStartEnd' : 0} minTickGap={8} />
        <YAxis {...axisProps} tickFormatter={yMoney} width={52} />
        <Tooltip content={<MoneyTooltip valueLabel={valueLabel} />} cursor={{ fill: '#f1f5f9' }} />
        <Bar isAnimationActive={false} dataKey={yKey} name={valueLabel} radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((d, i) => <Cell key={d[xKey]} fill={d.dim ? '#bfdbfe' : colorFor(d[xKey], 0)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
