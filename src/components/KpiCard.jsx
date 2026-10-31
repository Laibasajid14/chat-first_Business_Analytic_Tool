import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function KpiCard({ label, value, change, unit = '%', changeLabel, icon: Icon }) {
  const positive = change >= 0;
  return (
    <div className="rounded-xl border border-line bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        {Icon && (
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xl font-semibold tracking-tight text-ink tabular-nums sm:text-2xl">{value}</p>
      <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs">
        <span className={`inline-flex items-center font-semibold ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {positive ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
          {change > 0 ? '+' : ''}{change}{unit}
        </span>
        <span className="text-muted">{changeLabel}</span>
      </p>
    </div>
  );
}
