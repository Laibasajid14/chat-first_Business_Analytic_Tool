import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Check, DollarSign, Eye, EyeOff, Layers, MessageSquareText, Percent, Receipt,
  RotateCcw, Settings2, ShoppingCart, X,
} from 'lucide-react';
import KpiCard from '../components/KpiCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import InsightChart from '../components/InsightChart.jsx';
import { useAppState } from '../context/AppState.jsx';
import {
  CATEGORY_COLORS, computeKpis, dailyRevenue, dateRanges, formatCurrency, pipeline,
  previousKpis, regions, revenueByCategory, revenueByProduct, revenueByRegion, revenueByStore,
  selectRows, weeklyRevenue,
} from '../data/mockData.js';

const pct = (cur, prev) => (prev ? Number((((cur - prev) / prev) * 100).toFixed(1)) : 0);

const DEFAULT_DASHBOARD_CHARTS = [
  { id: 'revenue-time', title: 'Revenue Over Time', kind: 'daily' },
  { id: 'region-revenue', title: 'Revenue by Region', kind: 'region' },
  { id: 'category-sales', title: 'Sales by Product Category', kind: 'category' },
];

function DrillDownModal({ drill, onClose }) {
  if (!drill) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drill-title"
        className="animate-sheet max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Drill down</p>
            <h2 id="drill-title" className="mt-1 text-lg font-semibold">{drill.title}</h2>
            <p className="text-sm text-muted">{drill.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close drill down" className="grid size-11 place-items-center rounded-lg hover:bg-slate-100">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">
          <InsightChart data={drill.data} type="bar" height={260} horizontal={drill.data.length > 4} valueLabel={drill.valueLabel ?? 'Revenue'} />
        </div>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th className="py-2 font-medium">{drill.dimension}</th>
              <th className="py-2 text-right font-medium">{drill.valueLabel ?? 'Revenue'}</th>
              <th className="py-2 text-right font-medium">Share</th>
            </tr>
          </thead>
          <tbody>
            {drill.data.map((d) => (
              <tr key={d.name} className="border-b border-line/70 last:border-0">
                <td className="py-2">{d.name}</td>
                <td className="py-2 text-right tabular-nums">{formatCurrency(d.value, 2)}</td>
                <td className="py-2 text-right tabular-nums text-muted">{drill.total ? ((d.value / drill.total) * 100).toFixed(1) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomizeDashboardModal({
  visibleDefaults,
  hiddenDefaults,
  pinned,
  onRemoveDefault,
  onRestoreDefault,
  onUnpin,
  onReset,
  onClose,
}) {
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
        aria-labelledby="customize-dashboard-title"
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <h2 id="customize-dashboard-title" className="text-base font-semibold">Customize Dashboard</h2>
            <p className="text-xs text-muted">Choose which charts appear in your dashboard grid.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dashboard customization" className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-slate-100">
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>
        <div className="space-y-5 overflow-y-auto p-4">
          <section aria-labelledby="displayed-charts-title">
            <h3 id="displayed-charts-title" className="text-sm font-semibold">Currently displayed</h3>
            {visibleDefaults.length === 0 && pinned.length === 0 ? (
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-muted">No charts are currently displayed.</p>
            ) : (
              <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
                {visibleDefaults.map((chart) => (
                  <li key={chart.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="min-w-0 truncate text-sm">{chart.title}</span>
                    <button type="button" onClick={() => onRemoveDefault(chart.id)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-red-700 hover:bg-red-50">
                      <EyeOff className="size-4" aria-hidden="true" /> Remove
                    </button>
                  </li>
                ))}
                {pinned.map((insight) => (
                  <li key={insight.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="min-w-0 truncate text-sm">{insight.title}<span className="ml-1.5 text-xs text-muted">Pinned</span></span>
                    <button type="button" onClick={() => onUnpin(insight.id)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-red-700 hover:bg-red-50">
                      <EyeOff className="size-4" aria-hidden="true" /> Unpin
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="available-charts-title">
            <h3 id="available-charts-title" className="text-sm font-semibold">Available default charts</h3>
            {hiddenDefaults.length === 0 ? (
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-muted">All default charts are displayed.</p>
            ) : (
              <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
                {hiddenDefaults.map((chart) => (
                  <li key={chart.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="min-w-0 truncate text-sm">{chart.title}</span>
                    <button type="button" onClick={() => onRestoreDefault(chart.id)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-blue-700 hover:bg-blue-50">
                      <Eye className="size-4" aria-hidden="true" /> Restore
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3">
          <button type="button" onClick={onReset} className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium hover:bg-slate-50">
            <RotateCcw className="size-4" aria-hidden="true" /> Reset dashboard
          </button>
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
            <Check className="size-4" aria-hidden="true" /> Done
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    outputRows, mainRun, pinned, unpinInsight, showToast,
    dashboardConfig, removeDashboardChart, restoreDashboardChart, resetDashboard,
  } = useAppState();
  const [rangeKey, setRangeKey] = useState('month');
  const [region, setRegion] = useState('All Regions');
  const [refreshing, setRefreshing] = useState(false);
  const [drill, setDrill] = useState(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const range = dateRanges.find((r) => r.key === rangeKey);
  const rows = useMemo(() => selectRows(outputRows, { ...range, region }), [outputRows, range, region]);
  const kpis = useMemo(() => computeKpis(rows), [rows]);
  const prev = useMemo(() => previousKpis(outputRows, range, region), [outputRows, range, region]);
  const daily = useMemo(() => dailyRevenue(rows, range.start, range.end), [rows, range]);
  // Region chart ignores the region filter so the comparison stays meaningful; the selected region is highlighted.
  const regionData = useMemo(() => revenueByRegion(selectRows(outputRows, { ...range })), [outputRows, range]);
  const categoryData = useMemo(() => revenueByCategory(rows), [rows]);

  const scope = `${range.label}${region !== 'All Regions' ? ` · ${region}` : ''}`;

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast(`Dashboard reloaded from ${pipeline.output} (last pipeline run: ${mainRun.lastRun})`, 'info');
    }, 700);
  };

  const openDrill = (kind, selectedRegion = region) => {
    if (kind === 'daily') {
      const data = weeklyRevenue(rows).filter((w) => w.value > 0);
      setDrill({ title: 'Revenue by Week', subtitle: scope, dimension: 'Week', data, total: kpis.revenue });
    } else if (kind === 'region') {
      const data = revenueByStore(selectRows(outputRows, { ...range, region: selectedRegion }), selectedRegion === 'All Regions' ? undefined : selectedRegion);
      setDrill({ title: `Revenue by Store${selectedRegion !== 'All Regions' ? ` · ${selectedRegion}` : ''}`, subtitle: range.label, dimension: 'Store', data, total: data.reduce((s, d) => s + d.value, 0) });
    } else {
      const data = revenueByProduct(rows);
      setDrill({ title: 'Revenue by Product', subtitle: scope, dimension: 'Product', data, total: kpis.revenue });
    }
  };

  const openPinnedDrill = (insight) => {
    if (insight.kind === 'daily') {
      openDrill('daily');
    } else if (insight.kind === 'region' || insight.kind === 'region-stores') {
      openDrill('region', insight.region ?? region);
    } else if (insight.kind === 'category') {
      openDrill('category');
    } else {
      const data = insight.data.map((point) => ({ name: point.name ?? point.label, value: Number(point.value) || 0 }));
      setDrill({
        title: insight.title,
        subtitle: 'Pinned insight details',
        dimension: 'Item',
        data,
        total: data.reduce((sum, point) => sum + point.value, 0),
        valueLabel: insight.kind === 'profit-region' ? 'Gross profit' : 'Revenue',
      });
    }
  };

  const chatAction = { label: 'Ask in Chat', icon: MessageSquareText, onClick: () => navigate('/chat') };
  const hiddenDefaultIds = new Set(dashboardConfig.hiddenDefaultChartIds);
  const orderedDefaults = dashboardConfig.widgetOrder
    .map((id) => DEFAULT_DASHBOARD_CHARTS.find((chart) => chart.id === id))
    .filter((chart) => chart && !hiddenDefaultIds.has(chart.id));
  const hiddenDefaults = DEFAULT_DASHBOARD_CHARTS.filter((chart) => hiddenDefaultIds.has(chart.id));
  const removeDefaultAction = (chart) => ({
    label: 'Remove from Dashboard',
    icon: EyeOff,
    destructive: true,
    onClick: () => {
      removeDashboardChart(chart.id);
      showToast(`${chart.title} removed from Dashboard`, 'info');
    },
  });
  const defaultActions = (chart) => [
    removeDefaultAction(chart),
    chatAction,
    { label: 'Drill Down', icon: Layers, onClick: () => openDrill(chart.kind) },
  ];

  const renderDefaultChart = (chart) => {
    if (chart.id === 'revenue-time') {
      return (
        <ChartCard key={chart.id} title={chart.title} subtitle={`Daily revenue after discounts · ${scope}`} actions={defaultActions(chart)}>
          <div role="img" aria-label={`Line chart of daily revenue, ${scope}. Total ${formatCurrency(kpis.revenue)}.`}>
            <InsightChart data={daily} type="line" xKey="label" yKey="revenue" height={180} />
          </div>
        </ChartCard>
      );
    }

    if (chart.id === 'region-revenue') {
      return (
        <ChartCard key={chart.id} title={chart.title} subtitle={`${range.label} · North, South and Central`} actions={defaultActions(chart)}>
          <div role="img" aria-label={`Bar chart of revenue by region: ${regionData.map((item) => `${item.name} ${formatCurrency(item.value)}`).join(', ')}`}>
            <InsightChart data={regionData.map((item) => ({ ...item, dim: region !== 'All Regions' && item.name !== region }))} type="bar" height={190} />
          </div>
          {region !== 'All Regions' && <p className="mt-2 text-xs text-muted">Showing all regions for comparison; KPIs are filtered to {region}.</p>}
        </ChartCard>
      );
    }

    return (
      <ChartCard key={chart.id} title={chart.title} subtitle={`Revenue contribution · ${scope}`} actions={defaultActions(chart)}>
        <div role="img" aria-label={`Donut chart of revenue by category: ${categoryData.map((item) => `${item.name} ${formatCurrency(item.value)}`).join(', ')}`}>
          <InsightChart data={categoryData} type="donut" height={190} />
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
          {categoryData.map((category) => (
            <li key={category.name} className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2 py-1.5">
              <span className="flex min-w-0 items-center gap-1.5"><span className="size-2 shrink-0 rounded-full" style={{ background: CATEGORY_COLORS[category.name] }} /> <span className="truncate">{category.name}</span></span>
              <span className="font-semibold tabular-nums">{kpis.revenue ? ((category.value / kpis.revenue) * 100).toFixed(0) : 0}%</span>
            </li>
          ))}
        </ul>
      </ChartCard>
    );
  };

  const chartCards = [
    ...orderedDefaults.map(renderDefaultChart),
    ...pinned.map((insight) => (
      <ChartCard
        key={`pinned-${insight.id}`}
        title={insight.title}
        subtitle={`Pinned from Chat · ${insight.pinnedAt}`}
        actions={[
          {
            label: 'Unpin / Remove from Dashboard',
            icon: EyeOff,
            destructive: true,
            onClick: () => {
              unpinInsight(insight.id);
              showToast('Insight removed from Dashboard', 'info');
            },
          },
          chatAction,
          { label: 'Drill Down', icon: Layers, onClick: () => openPinnedDrill(insight) },
        ]}
      >
        <div role="img" aria-label={`${insight.chartType} chart: ${insight.title}`}>
          <InsightChart data={insight.data} type={insight.chartType} height={190} valueLabel={insight.kind === 'profit-region' ? 'Gross profit' : 'Revenue'} />
        </div>
      </ChartCard>
    )),
  ];

  return (
    <div className="pb-bottom-nav mx-auto max-w-[1200px] px-4 pt-3 sm:px-6 lg:px-8 lg:pt-4">
      {/* Header */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">RetailCo Overview</h1>
            <p className="mt-0.5 text-sm text-muted">Sales performance and operational insights</p>
          </div>
          <button type="button" onClick={() => setCustomizeOpen(true)} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium shadow-sm hover:bg-slate-50">
            <Settings2 className="size-4" aria-hidden="true" /> Customize Dashboard
          </button>
        </div>
        <div className="w-full xl:w-auto">
          <FilterBar
            range={rangeKey}
            onRangeChange={setRangeKey}
            rangeOptions={dateRanges.map((r) => ({ value: r.key, label: r.label }))}
            region={region}
            onRegionChange={setRegion}
            regionOptions={regions.map((r) => ({ value: r, label: r }))}
            onRefresh={refresh}
            refreshing={refreshing}
          />
        </div>
      </div>

      {/* Compact pipeline health summary */}
      <section className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border border-line bg-white px-3 py-2.5" aria-label="Pipeline health">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="truncate text-sm font-medium text-ink">{pipeline.name}</span>
          <StatusBadge status={mainRun.status} />
          <span className="text-xs text-muted">Last successful update: {mainRun.freshness}</span>
        </div>
        <Link to="/pipelines/retail-sales-enrichment" className="inline-flex h-9 shrink-0 items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
          View Pipeline <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      {/* KPIs */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Total Revenue" icon={DollarSign} value={formatCurrency(kpis.revenue)} change={pct(kpis.revenue, prev.revenue)} changeLabel={range.prevLabel} />
        <KpiCard label="Total Orders" icon={ShoppingCart} value={kpis.orders.toLocaleString()} change={pct(kpis.orders, prev.orders)} changeLabel={range.prevLabel} />
        <KpiCard label="Avg Order Value" icon={Receipt} value={formatCurrency(kpis.aov, 2)} change={pct(kpis.aov, prev.aov)} changeLabel={range.prevLabel} />
        <KpiCard label="Gross Margin" icon={Percent} value={`${kpis.margin.toFixed(1)}%`} change={Number((kpis.margin - prev.margin).toFixed(1))} unit=" pts" changeLabel={range.prevLabel} />
      </div>

      {/* Unified default and pinned chart grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Dashboard charts">
        {chartCards}
      </div>

      <DrillDownModal drill={drill} onClose={() => setDrill(null)} />
      {customizeOpen && (
        <CustomizeDashboardModal
          visibleDefaults={orderedDefaults}
          hiddenDefaults={hiddenDefaults}
          pinned={pinned}
          onRemoveDefault={(id) => {
            removeDashboardChart(id);
            showToast(`${DEFAULT_DASHBOARD_CHARTS.find((chart) => chart.id === id)?.title} removed from Dashboard`, 'info');
          }}
          onRestoreDefault={(id) => {
            restoreDashboardChart(id);
            showToast(`${DEFAULT_DASHBOARD_CHARTS.find((chart) => chart.id === id)?.title} restored`, 'info');
          }}
          onUnpin={(id) => {
            unpinInsight(id);
            showToast('Insight removed from Dashboard', 'info');
          }}
          onReset={() => {
            resetDashboard();
            showToast('Dashboard reset to its default charts', 'info');
          }}
          onClose={() => setCustomizeOpen(false)}
        />
      )}
    </div>
  );
}
