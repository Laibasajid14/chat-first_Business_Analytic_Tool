# Astera Studio: RetailCo Analytics Prototype

Astera Studio is a chat-first analytics product. This is a clickable, responsive frontend prototype of it. The active workspace belongs to **RetailCo**, a fictional retail company. The prototype has three connected experiences:

1. **Chat** (`/chat`): ask a question in plain English and get a short answer, a chart, key figures, and actions (Pin to Dashboard, Drill Down, View Pipeline).
2. **Dashboard** (`/dashboard`): four compact KPIs, date and region filters, a compact pipeline health summary, and one customizable chart grid combining default charts with insights pinned from Chat.
3. **Pipeline detail** (`/pipelines/retail-sales-enrichment`): the five-step *Retail Sales Enrichment Pipeline*. You can inspect and edit steps, preview up to six records, rerun the pipeline, and view the three most recent runs or open the complete run history.

> **Everything is simulated.** There is no backend, database, authentication or LLM. Chat answers come from predefined templates. Pipeline runs are timers in React state. All figures are calculated in the browser from the fictional data in `src/data/mockData.js`.

## Features

- **Consistent data.** The KPIs, charts, chat answers and pipeline preview are all calculated from the same 50 sales rows in `sales_october.xlsx`. The *Filter Rows* step removes two of them (a September row and a cancelled zero-revenue row), leaving 48. The rows are joined to the Stores, Products and Customers tables of the RetailCo Database.
- **Working dashboard filters.** Date range (This Month / Last 14 Days / Last 7 Days) and region (All / North / South / Central) both recalculate the KPIs and charts.
- **Chart drill-downs.** Drill Down opens weekly, per-store or per-product breakdowns.
- **Chat.** Suggested questions, free-text input (Enter sends), a typing indicator and a sidebar history of conversations that can be reopened or continued. Use **New conversation** to start a separate chat. It also handles follow-ups such as *"Change this to a bar chart"* and *"Why is South ahead?"*.
- **Pinning.** Pin to Dashboard adds the chart to the unified dashboard grid without duplicates and shows a confirmation toast. Pinned charts stay in place as you move between pages and can be removed from the dashboard.
- **Dashboard customization.** Default charts and pinned insights share one responsive grid. Use each chart's action menu to remove it, or use **Customize Dashboard** to restore hidden default charts or reset the default layout. Hidden default chart settings persist after a browser refresh.
- **Pipeline editing.** Change the Filter Rows condition (for example Revenue > 100) or the join type, then Apply or Cancel. **Rerun** shows *Running* and then *Succeeded*, updates the last-run time and run history, and the dashboard uses the new output.
- **All four statuses** (Running, Succeeded, Failed, Scheduled) appear. Failed pipelines have a working **Rerun** button.
- **Responsive layouts:**
  - **Desktop (≥1024px):** full sidebar. At 1280px and wider, the pipeline step editor sits in a right-hand panel.
  - **Tablet (768–1023px):** compact icon sidebar, two-column KPIs, and a horizontally scrolling workflow.
  - **Mobile (<768px):** bottom navigation, vertical numbered pipeline step cards, and a full-screen step editor.

## Tech stack

React 19 · Vite 8 · JavaScript · Tailwind CSS 4 (`@tailwindcss/vite`) · React Router DOM 7 · Recharts 3 · Lucide React · xlsx (only used to generate the sample workbook)

## Folder structure

```
astera-studio/
  public/data/sales_october.xlsx      sample source workbook (sheet "Sales")
  scripts/generateSampleWorkbook.mjs  writes the workbook from mockData.js
  src/
    components/
      layout/ AppShell.jsx, Sidebar.jsx, BottomNav.jsx, navItems.js
      KpiCard.jsx  ChartCard.jsx  StatusBadge.jsx  FilterBar.jsx
      ChatMessage.jsx  PipelineStepCard.jsx  InsightChart.jsx
    context/AppState.jsx   shared state: pins, chat history, toasts, simulated runs
    data/mockData.js       all fictional data + calculation helpers + chat templates
    pages/ DashboardPage.jsx  ChatPage.jsx  PipelinePage.jsx
    App.jsx  main.jsx  index.css
  index.html  package.json  vite.config.js  README.md  DESIGN_NOTES.md
```

Two small files were added to the suggested structure. `InsightChart.jsx` is a shared Recharts renderer used by the dashboard, chat and pinned cards. `context/AppState.jsx` holds the shared state.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
```

```bash
npm run dev
```

Then open the URL that Vite prints (usually http://localhost:5173). The root `/` redirects to `/dashboard`.

## Production build

```bash
npm run build
```

```bash
npm run preview
```

## Regenerate the sample workbook (optional)

```bash
npm run generate:workbook
```

## Suggested walkthrough

1. On the Dashboard, compare regions: South leads and Central lags.
2. Open **Chat** and ask *"Which region generated the highest revenue in October?"* → **Pin to Dashboard**.
3. Type *"Change this to a line chart"*, then press **Drill Down** to see revenue by store.
4. Select **View Pipeline** and click **Filter Rows**. Set the value to `100` and choose **Apply Changes**, then **Rerun now**.
5. Return to the Dashboard. The KPIs now use the new pipeline output, and the pinned insight is still there.

## Known limitations

- The data is a small fictional sample (48 valid orders), so the totals are much smaller than a real retailer's.
- September comparison figures are a precomputed summary, because no September file is included.
- The app does not parse the workbook at runtime.
- Chat only recognises keyword-based intents.
- Chat history and other app state are kept in memory and reset after a page reload.
