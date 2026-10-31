import { ArrowRight, Bot, Layers, Pin, PinOff, RefreshCcw, Workflow } from 'lucide-react';
import InsightChart from './InsightChart.jsx';

function ActionButton({ icon: Icon, children, ...props }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-default disabled:opacity-60"
      {...props}
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </button>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3" aria-live="polite">
      <Avatar />
      <div className="rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 shadow-sm">
        <span className="sr-only">Assistant is analysing…</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          {[0, 150, 300].map((d) => (
            <span key={d} className="size-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d}ms` }} />
          ))}
          <span className="ml-2 text-xs text-muted">Querying retail_sales_analytics…</span>
        </span>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-600 text-white" aria-hidden="true">
      <Bot className="size-4" />
    </span>
  );
}

export default function ChatMessage({ message, onSuggestion, suggestions, onPin, isPinned, onDrillDown, onViewPipeline }) {
  if (message.role === 'user') {
    return (
      <div className="animate-fade-up flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm sm:max-w-[70%]">{message.text}</p>
      </div>
    );
  }

  const { insight } = message;
  return (
    <div className="animate-fade-up flex items-start gap-3">
      <Avatar />
      <div className="min-w-0 flex-1 sm:max-w-[640px]">
        <p className="sr-only">Assistant:</p>
        <div className="rounded-2xl rounded-tl-sm border border-line bg-white p-4 shadow-sm">
          <p className="text-sm leading-relaxed text-ink">{message.text}</p>

          {insight && (
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <p className="text-xs text-muted">{insight.subtitle}</p>
                </div>
                {insight.changed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    <RefreshCcw className="size-3" aria-hidden="true" /> Chart updated to {insight.chartType}
                  </span>
                )}
              </div>
              <div className="mt-3" role="img" aria-label={`${insight.chartType} chart: ${insight.title}`}>
                <InsightChart data={insight.data} type={insight.chartType} height={230} valueLabel={insight.kind === 'profit-region' ? 'Gross profit' : 'Revenue'} />
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {insight.figures.map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs">
                    <dt className="truncate text-muted">{f.label}</dt>
                    <dd className="shrink-0 font-semibold tabular-nums text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {message.showSuggestions && suggestions && (
            <div className="mt-3 flex flex-col gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSuggestion(s)}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-left text-sm text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                >
                  {s}
                  <ArrowRight className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>

        {insight && (
          <div className="mt-2 flex flex-wrap gap-2">
            <ActionButton icon={isPinned ? PinOff : Pin} onClick={() => onPin(insight)} aria-pressed={isPinned}>
              {isPinned ? 'Pinned' : 'Pin to Dashboard'}
            </ActionButton>
            <ActionButton icon={Layers} onClick={() => onDrillDown(insight)}>Drill Down</ActionButton>
            <ActionButton icon={Workflow} onClick={onViewPipeline}>View Pipeline</ActionButton>
          </div>
        )}
      </div>
    </div>
  );
}
