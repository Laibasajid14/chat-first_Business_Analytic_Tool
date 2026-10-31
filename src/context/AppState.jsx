import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  SIMULATED_NOW,
  dataSources,
  defaultFilter,
  runHistory as initialHistory,
  runPipeline,
} from '../data/mockData.js';

const AppStateContext = createContext(null);

const RUN_DURATION_MS = 2500;
const DASHBOARD_CONFIG_KEY = 'astera-studio-dashboard-config';
const DEFAULT_DASHBOARD_WIDGET_ORDER = ['revenue-time', 'region-revenue', 'category-sales'];
const DEFAULT_DASHBOARD_CONFIG = {
  hiddenDefaultChartIds: [],
  widgetOrder: DEFAULT_DASHBOARD_WIDGET_ORDER,
};

function readDashboardConfig() {
  try {
    const stored = window.localStorage.getItem(DASHBOARD_CONFIG_KEY);
    if (!stored) return DEFAULT_DASHBOARD_CONFIG;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed.hiddenDefaultChartIds) || !Array.isArray(parsed.widgetOrder)) {
      throw new Error('Stored dashboard configuration has an invalid shape.');
    }

    const widgetOrder = [...new Set(parsed.widgetOrder.filter((id) => DEFAULT_DASHBOARD_WIDGET_ORDER.includes(id)))];
    return {
      hiddenDefaultChartIds: [...new Set(parsed.hiddenDefaultChartIds.filter((id) => DEFAULT_DASHBOARD_WIDGET_ORDER.includes(id)))],
      widgetOrder: [...widgetOrder, ...DEFAULT_DASHBOARD_WIDGET_ORDER.filter((id) => !widgetOrder.includes(id))],
    };
  } catch (error) {
    console.error('Unable to load dashboard configuration from local storage.', error);
    return DEFAULT_DASHBOARD_CONFIG;
  }
}

function timeLabel() {
  const t = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `Today, ${t}`;
}

// Shared, in-memory state for the prototype: saved chat conversations,
// pinned insights, toasts and the simulated pipeline runs.
export function AppStateProvider({ children }) {
  const [pinned, setPinned] = useState([]);
  const [dashboardConfig, setDashboardConfig] = useState(readDashboardConfig);
  const [conversations, setConversations] = useState([]);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const [pipelineFilter, setPipelineFilter] = useState(defaultFilter); // config used by the last successful run
  const [mainRun, setMainRun] = useState({
    status: 'Succeeded',
    lastRun: SIMULATED_NOW.lastRun,
    freshness: SIMULATED_NOW.freshness,
    records: dataSources.upload.rows,
  });
  const [history, setHistory] = useState(initialHistory);

  const outputRows = useMemo(() => runPipeline(pipelineFilter), [pipelineFilter]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DASHBOARD_CONFIG_KEY, JSON.stringify(dashboardConfig));
    } catch (error) {
      console.error('Unable to save dashboard configuration to local storage.', error);
    }
  }, [dashboardConfig]);

  const addChatMessage = useCallback((message, conversationId) => {
    const id = conversationId ?? `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const updatedAt = Date.now();

    setConversations((list) => {
      const existing = list.find((conversation) => conversation.id === id);
      if (existing) {
        return [
          { ...existing, messages: [...existing.messages, message], updatedAt },
          ...list.filter((conversation) => conversation.id !== id),
        ];
      }

      if (message.role !== 'user') return list;

      const title = message.text.length > 48 ? `${message.text.slice(0, 47).trimEnd()}…` : message.text;
      return [{ id, title, messages: [message], updatedAt }, ...list];
    });

    return id;
  }, []);

  const showToast = useCallback((message, tone = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, tone, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const pinInsight = useCallback(
    (insight) => {
      if (pinned.some((p) => p.id === insight.id)) {
        showToast('Already pinned to the dashboard', 'info');
        return false;
      }
      setPinned((list) => [...list, { ...insight, pinnedAt: timeLabel() }]);
      showToast(`"${insight.title}" pinned to Dashboard`);
      return true;
    },
    [pinned, showToast],
  );

  const unpinInsight = useCallback((id) => setPinned((list) => list.filter((p) => p.id !== id)), []);

  const removeDashboardChart = useCallback((id) => {
    if (!DEFAULT_DASHBOARD_WIDGET_ORDER.includes(id)) return;
    setDashboardConfig((config) => ({
      ...config,
      hiddenDefaultChartIds: [...new Set([...config.hiddenDefaultChartIds, id])],
    }));
  }, []);

  const restoreDashboardChart = useCallback((id) => {
    if (!DEFAULT_DASHBOARD_WIDGET_ORDER.includes(id)) return;
    setDashboardConfig((config) => ({
      ...config,
      hiddenDefaultChartIds: config.hiddenDefaultChartIds.filter((chartId) => chartId !== id),
    }));
  }, []);

  const resetDashboard = useCallback(() => {
    setDashboardConfig(DEFAULT_DASHBOARD_CONFIG);
  }, []);

  // Simulated rerun of the main pipeline with an (optionally new) filter config.
  const rerunMain = useCallback(
    (filter = pipelineFilter) => {
      if (mainRun.status === 'Running') return;
      setMainRun((r) => ({ ...r, status: 'Running' }));
      setTimeout(() => {
        const label = timeLabel();
        const rows = runPipeline(filter);
        setPipelineFilter(filter);
        setMainRun({ status: 'Succeeded', lastRun: label, freshness: 'Updated just now', records: dataSources.upload.rows });
        setHistory((h) => [
          { id: `run-${1043 + h.length - initialHistory.length}`, started: label, duration: '2s', status: 'Succeeded', records: dataSources.upload.rows, output: rows.length, trigger: 'Manual' },
          ...h,
        ]);
        showToast(`Retail Sales Enrichment Pipeline succeeded · ${rows.length} rows published (simulated)`);
      }, RUN_DURATION_MS);
    },
    [mainRun.status, pipelineFilter, showToast],
  );

  const value = {
    pinned, pinInsight, unpinInsight,
    dashboardConfig, removeDashboardChart, restoreDashboardChart, resetDashboard,
    conversations, addChatMessage,
    toast, showToast,
    pipelineFilter, outputRows, mainRun, rerunMain, history,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export const useAppState = () => useContext(AppStateContext);
