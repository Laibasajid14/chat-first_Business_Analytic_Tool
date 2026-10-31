import { Calculator, ChevronRight, Database, DatabaseZap, FileSpreadsheet, Filter } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export const STEP_ICONS = { FileSpreadsheet, Filter, Database, Calculator, DatabaseZap };

// variant "node": compact desktop/tablet workflow node.
// variant "card": full-width mobile step card.
export default function PipelineStepCard({ step, status, selected, onSelect, variant = 'node', meta, edited }) {
  const Icon = STEP_ICONS[step.icon];
  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={() => onSelect(step.id)}
        className="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-4 text-left shadow-sm active:bg-slate-50"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">{step.number}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-semibold text-ink">{step.name}</span>
            <StatusBadge status={status} />
          </span>
          <span className="mt-1 block text-sm text-muted">{step.summary}</span>
          {meta && <span className="mt-1 block text-xs font-medium text-slate-500">{meta}</span>}
          {edited && <span className="mt-1 block text-xs font-medium text-amber-700">Edited · rerun to apply</span>}
        </span>
        <ChevronRight className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(step.id)}
      aria-pressed={selected}
      className={`relative flex w-40 shrink-0 flex-col rounded-xl border bg-white p-3.5 text-left shadow-sm transition-colors ${
        selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-line hover:border-slate-300'
      }`}
    >
      <span className="flex items-center justify-between">
        <span className={`grid size-9 place-items-center rounded-lg ${selected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold text-slate-400">Step {step.number}</span>
      </span>
      <span className="mt-3 text-sm font-semibold leading-snug text-ink">{step.name}</span>
      {meta && <span className="mt-0.5 text-xs text-muted">{meta}</span>}
      <span className="mt-3"><StatusBadge status={status} /></span>
      {edited && <span className="absolute -top-2 right-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">Edited</span>}
    </button>
  );
}
