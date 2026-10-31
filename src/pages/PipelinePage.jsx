import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, CalendarClock, ChevronRight, Database,
  FileSpreadsheet, LayoutDashboard, MessageSquareText, Play, RotateCw, Table2, X,
} from 'lucide-react';
import PipelineStepCard, { STEP_ICONS } from '../components/PipelineStepCard.jsx';
import DropdownSelect from '../components/DropdownSelect.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAppState } from '../context/AppState.jsx';
import {
  SIMULATED_NOW, applyPipelineFilter, dataSources, filterColumns, filterConditions, formatCurrency,
  pipeline, pipelineSteps, salesTransactions,
} from '../data/mockData.js';

const sameFilter = (a, b) => a.column === b.column && a.condition === b.condition && Number(a.value) === Number(b.value);

/* ---------- small form primitives ---------- */

function Field({ label, children, hint }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function ReadOnly({ label, value, icon: Icon }) {
  return (
    <Field label={label}>
      <div className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-slate-50 px-3 text-sm text-ink">
        {Icon && <Icon className="size-4 shrink-0 text-slate-400" aria-hidden="true" />}
        <span className="min-w-0 break-words">{value}</span>
      </div>
    </Field>
  );
}

const inputCls = 'h-11 w-full rounded-lg border border-line bg-white px-3 text-[16px] text-ink shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:text-sm';

/* ---------- step configuration editor (shared by panel and mobile sheet) ---------- */

function StepEditor({ step, draft, onApply, onCancel, outputCount, mobile }) {
  const [form, setForm] = useState(draft);
  useEffect(() => setForm(draft), [draft, step.id]);
  useEffect(() => {
    if (!mobile) return undefined;

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousDocumentOverflow = documentElement.style.overflow;
    body.style.overflow = 'hidden';
    documentElement.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [mobile]);

  const editable = step.id === 'filter' || step.id === 'join';
  const dirty = !sameFilter(form.filter, draft.filter) || form.joinType !== draft.joinType;
  const previewCount = useMemo(() => applyPipelineFilter(salesTransactions, { ...form.filter, value: form.filter.value === '' ? 0 : form.filter.value }).length, [form.filter]);
  const setFilter = (patch) => setForm((f) => ({ ...f, filter: { ...f.filter, ...patch } }));

  let body;
  if (step.id === 'read') {
    body = (
      <>
        <ReadOnly label="File" value={step.config.file} icon={FileSpreadsheet} />
        <div className="grid grid-cols-2 gap-3">
          <ReadOnly label="Sheet name" value={step.config.sheet} />
          <ReadOnly label="Header row" value={step.config.headerRow} />
        </div>
        <p className="text-sm text-muted">Uploaded Excel source · {dataSources.upload.rows} rows · 10 columns (transaction_id … revenue).</p>
      </>
    );
  } else if (step.id === 'filter') {
    body = (
      <>
        <ReadOnly label="Condition 1 (fixed)" value={step.config.dateRule} icon={CalendarClock} />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">AND condition 2</p>
        <Field label="Column">
          <DropdownSelect
            id="filter-column"
            label="Filter column"
            value={form.filter.column}
            options={filterColumns.map((column) => ({ value: column, label: column }))}
            onChange={(column) => setFilter({ column })}
            buttonClassName="text-[16px] md:text-sm"
          />
        </Field>
        <Field label="Condition">
          <DropdownSelect
            id="filter-condition"
            label="Filter condition"
            value={form.filter.condition}
            options={filterConditions.map((condition) => ({ value: condition, label: condition }))}
            onChange={(condition) => setFilter({ condition })}
            buttonClassName="text-[16px] md:text-sm"
          />
        </Field>
        <Field label={`Value${form.filter.column === 'Revenue' ? ' ($)' : form.filter.column === 'Discount' ? ' (%)' : ''}`}>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            className={inputCls}
            value={form.filter.value}
            onChange={(e) => setFilter({ value: e.target.value === '' ? '' : Number(e.target.value) })}
            aria-label="Filter value"
          />
        </Field>
        <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-900">
          <span className="font-semibold">{previewCount}</span> of {salesTransactions.length} rows match these conditions
          {previewCount === 0 && <span className="mt-1 block text-xs text-red-700">No rows would reach the dashboard with this filter.</span>}
        </div>
      </>
    );
  } else if (step.id === 'join') {
    body = (
      <>
        <ReadOnly label="Database" value={step.config.database} icon={Database} />
        <Field label="Join type" hint={form.joinType === 'Inner Join' ? 'Inner Join keeps only rows with a match in every table.' : 'Left Join keeps every sales row, even if a lookup has no match.'}>
          <DropdownSelect
            id="join-type"
            label="Join type"
            value={form.joinType}
            options={[
              { value: 'Left Join', label: 'Left Join' },
              { value: 'Inner Join', label: 'Inner Join' },
            ]}
            onChange={(joinType) => setForm((f) => ({ ...f, joinType }))}
            buttonClassName="text-[16px] md:text-sm"
          />
        </Field>
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Tables & join keys</span>
          <ul className="divide-y divide-line rounded-lg border border-line">
            {step.config.joins.map((j) => (
              <li key={j.table} className="flex flex-col gap-0.5 px-3 py-2.5 text-sm">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium">{j.table}</span>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{j.key}</code>
                </span>
                <span className="text-xs text-muted">Adds {j.adds}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-muted">Each sales row looks up its store, product and customer by ID in RetailCo Database, adding region, category and unit cost. All IDs in the sample data match, so both join types return the same rows.</p>
      </>
    );
  } else if (step.id === 'transform') {
    body = (
      <>
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Calculated columns</span>
          <ul className="space-y-2">
            {step.config.calculated.map((c) => (
              <li key={c.name} className="rounded-lg border border-line px-3 py-2.5">
                <code className="text-xs font-semibold text-blue-700">{c.name}</code>
                <p className="text-sm">{c.formula}</p>
              </li>
            ))}
          </ul>
        </div>
        <ReadOnly label="Group by" value={step.config.groupBy.join(', ')} />
        <ReadOnly label="Aggregation" value={step.config.aggregation} />
        <p className="text-sm text-muted">Example: 2 × Air Fryer at $109 → revenue $218, cost 2 × $64 = $128, gross profit $90, margin 41.3%.</p>
      </>
    );
  } else {
    body = (
      <>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ReadOnly label="Output name" value={step.config.name} icon={Table2} />
          <ReadOnly label="Destination" value={step.config.destination} />
        </div>
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Output columns</span>
          <div className="flex flex-wrap gap-1.5">
            {step.config.columns.map((c) => <code key={c} className="rounded-md bg-slate-100 px-2 py-1 text-xs">{c}</code>)}
          </div>
        </div>
        <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
          <LayoutDashboard className="size-4 shrink-0" aria-hidden="true" /> Feeds the {step.config.feeds} · {outputCount} rows published
        </p>
      </>
    );
  }

  const Icon = STEP_ICONS[step.icon];
  const header = (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700"><Icon className="size-5" aria-hidden="true" /></span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted">Step {step.number} of {pipelineSteps.length}</p>
        <h2 id="step-editor-title" className="text-base font-semibold leading-tight">{step.name}</h2>
      </div>
    </div>
  );

  const actions = editable ? (
    <>
      <button type="button" onClick={() => { setForm(draft); onCancel(); }} className="h-12 flex-1 rounded-lg border border-line bg-white px-4 text-sm font-medium hover:bg-slate-50 md:h-11 md:flex-none">Cancel</button>
      <button
        type="button"
        disabled={(!dirty && !mobile) || form.filter.value === ''}
        onClick={() => onApply(form)}
        className="h-12 flex-1 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300 md:h-11 md:flex-none"
      >
        Apply Changes
      </button>
    </>
  ) : (
    mobile && <button type="button" onClick={onCancel} className="h-12 flex-1 rounded-lg border border-line bg-white px-4 text-sm font-medium">Close</button>
  );

  if (mobile) {
    return (
      <div className="animate-sheet fixed inset-0 z-50 flex flex-col bg-white md:hidden" role="dialog" aria-modal="true" aria-labelledby="step-editor-title">
        <div className="flex items-center gap-2 border-b border-line px-2 py-2">
          <button type="button" onClick={() => { setForm(draft); onCancel(); }} className="grid size-11 place-items-center rounded-lg hover:bg-slate-100" aria-label="Back to pipeline steps">
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          {header}
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          <p className="text-sm text-muted">{step.summary}</p>
          {body}
          {!editable && <p className="text-xs text-muted">This step is read-only in the prototype.</p>}
        </div>
        <div className="flex gap-3 border-t border-line bg-white px-4 pt-3" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>{actions}</div>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-white shadow-sm" aria-labelledby="step-editor-title">
      <div className="flex items-start justify-between gap-3 border-b border-line p-3">
        {header}
        <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">{editable ? 'Editable' : 'Read-only'}</span>
      </div>
      <div className="space-y-3 p-3">
        <p className="text-sm text-muted">{step.summary}</p>
        {body}
      </div>
      {editable && <div className="flex justify-end gap-2 border-t border-line p-3">{actions}</div>}
    </section>
  );
}

function RunHistoryModal({ history, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center sm:p-6" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-runs-title"
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-2xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <h2 id="all-runs-title" className="text-base font-semibold">All Pipeline Runs</h2>
            <p className="text-xs text-muted">{history.length} runs · most recent first</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close run history" className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-slate-100">
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>
        <ul className="divide-y divide-line overflow-y-auto">
          {history.map((run) => (
            <li key={run.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{run.started} <span className="font-normal text-muted">· {run.trigger}</span></p>
                <p className="break-words text-xs text-muted">
                  {run.status === 'Failed' ? run.error : `${run.records} rows read${run.output !== undefined ? ` · ${run.output} published` : ''} · ${run.duration}`}
                </p>
              </div>
              <StatusBadge status={run.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ---------- page ---------- */

export default function PipelinePage() {
  const { mainRun, rerunMain, history, outputRows, pipelineFilter, showToast } = useAppState();
  const [selectedId, setSelectedId] = useState('filter');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAllRuns, setShowAllRuns] = useState(false);
  const [appliedJoin, setAppliedJoin] = useState('Left Join');
  const [draft, setDraft] = useState({ filter: pipelineFilter, joinType: appliedJoin });

  const running = mainRun.status === 'Running';
  const pending = !sameFilter(draft.filter, pipelineFilter) || draft.joinType !== appliedJoin;
  const selected = pipelineSteps.find((s) => s.id === selectedId);
  const stepStatus = running ? 'Running' : 'Succeeded';

  const stepMeta = {
    read: `${dataSources.upload.rows} rows read`,
    filter: `${outputRows.length} rows kept`,
    join: '3 tables joined',
    transform: '2 calculated columns',
    output: `${outputRows.length} rows published`,
  };
  const edited = { filter: !sameFilter(draft.filter, pipelineFilter), join: draft.joinType !== appliedJoin };

  const select = (id) => { setSelectedId(id); setMobileOpen(true); };

  const apply = (form) => {
    setDraft(form);
    setMobileOpen(false);
    const changed = !sameFilter(form.filter, pipelineFilter) || form.joinType !== appliedJoin;
    showToast(changed ? 'Changes applied. Rerun the pipeline to publish them.' : 'No changes to apply', 'info');
  };

  const rerun = () => {
    rerunMain(draft.filter);
    setAppliedJoin(draft.joinType);
  };

  const discard = () => { setDraft({ filter: pipelineFilter, joinType: appliedJoin }); showToast('Pending changes discarded', 'info'); };

  const previewRows = outputRows.slice(0, 6);
  const recentRuns = history.slice(0, 3);
  const latestFailure = history.find((h) => h.status === 'Failed');

  return (
    <div className="pb-bottom-nav mx-auto max-w-[1400px] px-4 pt-3 sm:px-6 lg:px-8 lg:pt-4">
      {/* Breadcrumb / back navigation */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-1 text-sm text-muted">
        <Link to="/dashboard" className="inline-flex h-8 items-center gap-1 hover:text-ink"><ArrowLeft className="size-4" aria-hidden="true" /> Dashboard</Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span>Pipelines</span>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="font-medium text-ink">Retail Sales Enrichment</span>
      </nav>

      {/* Header */}
      <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{pipeline.name}</h1>
            <StatusBadge status={mainRun.status} size="lg" />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted">{pipeline.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/chat" className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-medium shadow-sm hover:bg-slate-50">
            <MessageSquareText className="size-4" aria-hidden="true" /> Ask in Chat
          </Link>
          <button type="button" onClick={rerun} disabled={running} className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400">
            {running ? <RotateCw className="size-4 animate-spin" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {running ? 'Running…' : pending ? 'Rerun with changes' : 'Run now'}
          </button>
        </div>
      </div>

      {/* Run facts */}
      <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-line bg-white px-3 py-2.5 text-sm">
        <div className="flex min-w-0 items-baseline gap-1.5">
          <dt className="shrink-0 text-xs text-muted">Last run</dt>
          <dd className="font-medium">{mainRun.lastRun}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="shrink-0 text-xs text-muted">Records processed</dt>
          <dd className="font-medium tabular-nums">{mainRun.records} read · {outputRows.length} out</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="shrink-0 text-xs text-muted">Schedule</dt>
          <dd className="font-medium">{pipeline.schedule}</dd>
        </div>
        <div className="hidden items-baseline gap-1.5 xl:flex">
          <dt className="shrink-0 text-xs text-muted">Next scheduled run</dt>
          <dd className="font-medium">{SIMULATED_NOW.nextRun}</dd>
        </div>
      </dl>

      {/* Pending changes banner */}
      {pending && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              Configuration changed
              {edited.filter && <> · Filter: <strong>{draft.filter.column} {draft.filter.condition.toLowerCase()} {draft.filter.value}</strong></>}
              {edited.join && <> · Join: <strong>{draft.joinType}</strong></>}. Rerun to update the dashboard dataset.
            </span>
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={discard} className="h-10 rounded-lg border border-amber-300 bg-white px-3 text-sm font-medium hover:bg-amber-100">Discard</button>
            <button type="button" onClick={rerun} disabled={running} className="h-10 rounded-lg bg-amber-600 px-3 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60">Rerun now</button>
          </div>
        </div>
      )}

      {/* Sources */}
      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-line bg-white px-3 py-2 text-sm">
        <span className="inline-flex min-w-0 items-center gap-2">
          <FileSpreadsheet className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span className="font-medium">{dataSources.upload.name}</span>
          <span className="text-xs text-muted">Excel · {dataSources.upload.rows} rows</span>
        </span>
        <span className="inline-flex min-w-0 flex-wrap items-center gap-2">
          <Database className="size-4 shrink-0 text-blue-600" aria-hidden="true" />
          <span className="font-medium">{dataSources.database.name}</span>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Connected</span>
          <span className="text-xs text-muted">{dataSources.database.tables.join(', ')}</span>
        </span>
      </div>

      {/* Workflow: horizontal (tablet/desktop) */}
      <section className="mt-3 hidden rounded-xl border border-line bg-white p-3 shadow-sm md:block" aria-label="Pipeline workflow">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Workflow</h2>
          <p className="text-xs text-muted">Select a step to view its configuration</p>
        </div>
        <div className="scrollbar-thin overflow-x-auto rounded-lg bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] p-3">
          <ol className="flex w-max items-center">
            {pipelineSteps.map((step, i) => (
              <Fragment key={step.id}>
                <li>
                  <PipelineStepCard step={step} status={stepStatus} selected={selectedId === step.id} onSelect={setSelectedId} meta={stepMeta[step.id]} edited={edited[step.id]} />
                </li>
                {i < pipelineSteps.length - 1 && (
                  <li aria-hidden="true" className="flex w-8 items-center">
                    <span className={`h-0.5 flex-1 ${running ? 'bg-blue-400' : 'bg-slate-300'}`} />
                    <ArrowRight className={`-ml-1.5 size-4 ${running ? 'text-blue-400' : 'text-slate-400'}`} />
                  </li>
                )}
              </Fragment>
            ))}
          </ol>
        </div>
      </section>

      <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          {/* Workflow: vertical numbered cards (mobile) */}
          <section className="md:hidden" aria-label="Pipeline steps">
            <h2 className="mb-2 text-[15px] font-semibold">Steps</h2>
            <ol className="flex flex-col">
              {pipelineSteps.map((step, i) => (
                <li key={step.id}>
                  <PipelineStepCard variant="card" step={step} status={stepStatus} onSelect={select} meta={stepMeta[step.id]} edited={edited[step.id]} />
                  {i < pipelineSteps.length - 1 && (
                    <div className="flex h-6 justify-start pl-[2.15rem]" aria-hidden="true">
                      <ArrowDown className="size-4 self-center text-slate-400" />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* Config panel below canvas on tablet / small desktop */}
          <div className="hidden md:block xl:hidden">
            <StepEditor step={selected} draft={draft} onApply={apply} onCancel={() => {}} outputCount={outputRows.length} />
          </div>

          {/* Data preview */}
          <section className="rounded-xl border border-line bg-white shadow-sm" aria-labelledby="preview-title">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 pb-2">
              <div>
                <h2 id="preview-title" className="text-[15px] font-semibold">Data Preview</h2>
                <p className="text-xs text-muted">{pipeline.output} · first {previewRows.length} of {outputRows.length} rows</p>
              </div>
            </div>
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-y border-line bg-slate-50 text-xs text-muted">
                  <tr>
                    {['transaction_id', 'date', 'region', 'store_name', 'category', 'quantity', 'revenue', 'gross_profit'].map((h) => (
                      <th key={h} className={`px-4 py-2 font-medium ${['quantity', 'revenue', 'gross_profit'].includes(h) ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {previewRows.map((r) => (
                    <tr key={r.transaction_id} className="border-b border-line/70 last:border-0">
                      <td className="px-4 py-2 font-mono text-xs">{r.transaction_id}</td>
                      <td className="px-4 py-2">{r.date}</td>
                      <td className="px-4 py-2">{r.region}</td>
                      <td className="px-4 py-2">{r.store_name}</td>
                      <td className="px-4 py-2">{r.category}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{r.quantity}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(r.revenue, 2)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(r.gross_profit, 2)}</td>
                    </tr>
                  ))}
                  {previewRows.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-6 text-center text-muted">No rows passed the current filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Run history */}
          <section className="rounded-xl border border-line bg-white shadow-sm" aria-labelledby="history-title">
            <div className="flex items-center justify-between gap-3 p-3">
              <div>
                <h2 id="history-title" className="text-[15px] font-semibold">Run History</h2>
                <p className="text-xs text-muted">Most recent first{latestFailure ? ` · last failure: ${latestFailure.started}` : ''}</p>
              </div>
              {history.length > 3 && (
                <button type="button" onClick={() => setShowAllRuns(true)} className="inline-flex h-10 shrink-0 items-center rounded-lg border border-line px-3 text-sm font-medium text-blue-700 hover:bg-blue-50">
                  View all
                </button>
              )}
            </div>
            <ul className="divide-y divide-line border-t border-line">
              {running && (
                <li className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div><p className="text-sm font-medium">Manual run</p><p className="text-xs text-muted">Started just now</p></div>
                  <StatusBadge status="Running" />
                </li>
              )}
              {recentRuns.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{h.started} <span className="font-normal text-muted">· {h.trigger}</span></p>
                    <p className="truncate text-xs text-muted">
                      {h.status === 'Failed' ? h.error : `${h.records} rows read${h.output !== undefined ? ` · ${h.output} published` : ''} · ${h.duration}`}
                    </p>
                  </div>
                  <StatusBadge status={h.status} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right column (desktop ≥1280px): configuration */}
        <aside className="min-w-0">
          <div className="hidden xl:block">
            <StepEditor step={selected} draft={draft} onApply={apply} onCancel={() => {}} outputCount={outputRows.length} />
          </div>
 
        </aside>
      </div>

      {/* Mobile full-screen editor */}
      {mobileOpen && (
        <StepEditor mobile step={selected} draft={draft} onApply={apply} onCancel={() => setMobileOpen(false)} outputCount={outputRows.length} />
      )}
      {showAllRuns && <RunHistoryModal history={history} onClose={() => setShowAllRuns(false)} />}
    </div>
  );
}
