// RetailCo mock data for Astera Studio.
// Everything here is fictional. KPIs and chart series are derived from the
// sales transactions below so that every number in the app stays consistent.

/* ------------------------------------------------------------------ */
/* Workspace & simulated clock                                         */
/* ------------------------------------------------------------------ */

export const workspace = {
  product: 'Astera Studio',
  company: 'RetailCo',
  user: { name: 'Sarah Mitchell', role: 'RetailCo Analyst', initials: 'SM' },
};

// The prototype runs against a fixed simulated "now" so labels stay coherent.
export const SIMULATED_NOW = {
  date: '2026-10-30',
  lastRun: 'Today, 10:30 AM',
  freshness: 'Updated 15 minutes ago',
  nextRun: 'Tomorrow, 12:00 AM',
};

/* ------------------------------------------------------------------ */
/* RetailCo Database (one connected database, several tables)          */
/* ------------------------------------------------------------------ */

export const stores = [
  { store_id: 'S-001', store_name: 'RetailCo Gulberg', city: 'Lahore', region: 'North', manager: 'Ayesha Khan', store_size_sqft: 18000 },
  { store_id: 'S-002', store_name: 'RetailCo Blue Area', city: 'Islamabad', region: 'North', manager: 'Bilal Ahmed', store_size_sqft: 14000 },
  { store_id: 'S-003', store_name: 'RetailCo Clifton', city: 'Karachi', region: 'South', manager: 'Sana Siddiqui', store_size_sqft: 22000 },
  { store_id: 'S-004', store_name: 'RetailCo Latifabad', city: 'Hyderabad', region: 'South', manager: 'Imran Memon', store_size_sqft: 12000 },
  { store_id: 'S-005', store_name: 'RetailCo D Ground', city: 'Faisalabad', region: 'Central', manager: 'Hira Javed', store_size_sqft: 15000 },
  { store_id: 'S-006', store_name: 'RetailCo Cantt', city: 'Multan', region: 'Central', manager: 'Usman Tariq', store_size_sqft: 11000 },
];

export const products = [
  { product_id: 'P-001', product_name: 'Wireless Earbuds', category: 'Electronics', unit_cost: 38, selling_price: 69 },
  { product_id: 'P-002', product_name: 'Smart Watch', category: 'Electronics', unit_cost: 104, selling_price: 179 },
  { product_id: 'P-003', product_name: 'Bluetooth Speaker', category: 'Electronics', unit_cost: 45, selling_price: 79 },
  { product_id: 'P-004', product_name: 'Air Fryer', category: 'Home Appliances', unit_cost: 64, selling_price: 109 },
  { product_id: 'P-005', product_name: 'Countertop Blender', category: 'Home Appliances', unit_cost: 33, selling_price: 59 },
  { product_id: 'P-006', product_name: 'Denim Jacket', category: 'Fashion', unit_cost: 29, selling_price: 64 },
  { product_id: 'P-007', product_name: 'Running Shoes', category: 'Fashion', unit_cost: 46, selling_price: 89 },
  { product_id: 'P-008', product_name: 'Organic Coffee Beans 1kg', category: 'Grocery', unit_cost: 11, selling_price: 18 },
  { product_id: 'P-009', product_name: 'Extra Virgin Olive Oil 1L', category: 'Grocery', unit_cost: 9, selling_price: 14 },
];

export const customers = Array.from({ length: 20 }, (_, i) => {
  const id = 101 + i;
  const segments = ['New', 'Regular', 'Loyal'];
  const month = String(1 + ((i * 5) % 12)).padStart(2, '0');
  return {
    customer_id: `C-${id}`,
    registration_date: `${i < 6 ? 2026 : 2025}-${month}-${String(3 + i).padStart(2, '0')}`,
    customer_segment: segments[i % 3],
  };
});

export const inventory = [
  { product_id: 'P-001', store_id: 'S-003', stock_quantity: 42, inventory_value: 1596, units_received: 60, units_sold: 18 },
  { product_id: 'P-002', store_id: 'S-003', stock_quantity: 14, inventory_value: 1456, units_received: 20, units_sold: 6 },
  { product_id: 'P-004', store_id: 'S-004', stock_quantity: 9, inventory_value: 576, units_received: 15, units_sold: 6 },
  { product_id: 'P-007', store_id: 'S-001', stock_quantity: 25, inventory_value: 1150, units_received: 30, units_sold: 5 },
  { product_id: 'P-006', store_id: 'S-005', stock_quantity: 31, inventory_value: 899, units_received: 35, units_sold: 4 },
  { product_id: 'P-008', store_id: 'S-002', stock_quantity: 0, inventory_value: 0, units_received: 24, units_sold: 24 },
  { product_id: 'P-009', store_id: 'S-006', stock_quantity: 48, inventory_value: 432, units_received: 60, units_sold: 12 },
  { product_id: 'P-003', store_id: 'S-001', stock_quantity: 0, inventory_value: 0, units_received: 10, units_sold: 10 },
];

export const marketing = [
  { campaign_id: 'M-201', campaign_name: 'October Tech Week', marketing_spend: 1800, acquired_customers: 6 },
  { campaign_id: 'M-202', campaign_name: 'Autumn Fashion Drop', marketing_spend: 950, acquired_customers: 4 },
  { campaign_id: 'M-203', campaign_name: 'Kitchen Upgrade Promo', marketing_spend: 700, acquired_customers: 3 },
];

export const dataSources = {
  database: {
    name: 'RetailCo Database',
    status: 'Connected',
    tables: ['Stores', 'Products', 'Customers', 'Inventory', 'Marketing'],
  },
  upload: { name: 'sales_october.xlsx', type: 'Uploaded Excel file', sheet: 'Sales', rows: 50 },
};

/* ------------------------------------------------------------------ */
/* Uploaded Excel source: sales_october.xlsx (sheet "Sales")           */
/* 50 raw rows. Two are invalid and removed by the "Filter Rows" step: */
/* T-0998 (September) and T-1049 (cancelled, zero revenue).            */
/* revenue = quantity × unit_price × (1 − discount)                    */
/* ------------------------------------------------------------------ */

export const salesTransactions = [
  {transaction_id: 'T-1001', date: '2026-10-01', store_id: 'S-003', product_id: 'P-001', customer_id: 'C-115', product: 'Wireless Earbuds', quantity: 3, unit_price: 69, discount: 0.05, revenue: 196.65},
  {transaction_id: 'T-1002', date: '2026-10-01', store_id: 'S-003', product_id: 'P-001', customer_id: 'C-110', product: 'Wireless Earbuds', quantity: 2, unit_price: 69, discount: 0, revenue: 138},
  {transaction_id: 'T-1003', date: '2026-10-02', store_id: 'S-003', product_id: 'P-005', customer_id: 'C-101', product: 'Countertop Blender', quantity: 2, unit_price: 59, discount: 0, revenue: 118},
  {transaction_id: 'T-1004', date: '2026-10-03', store_id: 'S-001', product_id: 'P-009', customer_id: 'C-116', product: 'Extra Virgin Olive Oil 1L', quantity: 6, unit_price: 14, discount: 0.1, revenue: 75.6},
  {transaction_id: 'T-1005', date: '2026-10-04', store_id: 'S-004', product_id: 'P-006', customer_id: 'C-108', product: 'Denim Jacket', quantity: 2, unit_price: 64, discount: 0, revenue: 128},
  {transaction_id: 'T-1006', date: '2026-10-04', store_id: 'S-001', product_id: 'P-006', customer_id: 'C-104', product: 'Denim Jacket', quantity: 2, unit_price: 64, discount: 0, revenue: 128},
  {transaction_id: 'T-1007', date: '2026-10-05', store_id: 'S-003', product_id: 'P-005', customer_id: 'C-120', product: 'Countertop Blender', quantity: 1, unit_price: 59, discount: 0, revenue: 59},
  {transaction_id: 'T-1008', date: '2026-10-06', store_id: 'S-001', product_id: 'P-005', customer_id: 'C-115', product: 'Countertop Blender', quantity: 1, unit_price: 59, discount: 0.15, revenue: 50.15},
  {transaction_id: 'T-1009', date: '2026-10-06', store_id: 'S-003', product_id: 'P-002', customer_id: 'C-114', product: 'Smart Watch', quantity: 2, unit_price: 179, discount: 0.15, revenue: 304.3},
  {transaction_id: 'T-1010', date: '2026-10-06', store_id: 'S-003', product_id: 'P-004', customer_id: 'C-117', product: 'Air Fryer', quantity: 1, unit_price: 109, discount: 0.1, revenue: 98.1},
  {transaction_id: 'T-1011', date: '2026-10-07', store_id: 'S-003', product_id: 'P-008', customer_id: 'C-113', product: 'Organic Coffee Beans 1kg', quantity: 2, unit_price: 18, discount: 0, revenue: 36},
  {transaction_id: 'T-1012', date: '2026-10-08', store_id: 'S-001', product_id: 'P-004', customer_id: 'C-103', product: 'Air Fryer', quantity: 1, unit_price: 109, discount: 0.05, revenue: 103.55},
  {transaction_id: 'T-0998', date: '2026-09-30', store_id: 'S-002', product_id: 'P-003', customer_id: 'C-104', product: 'Bluetooth Speaker', quantity: 1, unit_price: 79, discount: 0, revenue: 79},
  {transaction_id: 'T-1013', date: '2026-10-08', store_id: 'S-004', product_id: 'P-009', customer_id: 'C-114', product: 'Extra Virgin Olive Oil 1L', quantity: 3, unit_price: 14, discount: 0.1, revenue: 37.8},
  {transaction_id: 'T-1014', date: '2026-10-08', store_id: 'S-001', product_id: 'P-009', customer_id: 'C-110', product: 'Extra Virgin Olive Oil 1L', quantity: 4, unit_price: 14, discount: 0, revenue: 56},
  {transaction_id: 'T-1015', date: '2026-10-08', store_id: 'S-003', product_id: 'P-009', customer_id: 'C-115', product: 'Extra Virgin Olive Oil 1L', quantity: 3, unit_price: 14, discount: 0.1, revenue: 37.8},
  {transaction_id: 'T-1016', date: '2026-10-08', store_id: 'S-004', product_id: 'P-006', customer_id: 'C-107', product: 'Denim Jacket', quantity: 3, unit_price: 64, discount: 0.05, revenue: 182.4},
  {transaction_id: 'T-1017', date: '2026-10-09', store_id: 'S-002', product_id: 'P-003', customer_id: 'C-102', product: 'Bluetooth Speaker', quantity: 2, unit_price: 79, discount: 0.05, revenue: 150.1},
  {transaction_id: 'T-1018', date: '2026-10-10', store_id: 'S-005', product_id: 'P-005', customer_id: 'C-108', product: 'Countertop Blender', quantity: 2, unit_price: 59, discount: 0, revenue: 118},
  {transaction_id: 'T-1019', date: '2026-10-10', store_id: 'S-001', product_id: 'P-005', customer_id: 'C-106', product: 'Countertop Blender', quantity: 3, unit_price: 59, discount: 0, revenue: 177},
  {transaction_id: 'T-1020', date: '2026-10-11', store_id: 'S-005', product_id: 'P-004', customer_id: 'C-119', product: 'Air Fryer', quantity: 1, unit_price: 109, discount: 0, revenue: 109},
  {transaction_id: 'T-1021', date: '2026-10-12', store_id: 'S-001', product_id: 'P-001', customer_id: 'C-103', product: 'Wireless Earbuds', quantity: 2, unit_price: 69, discount: 0.1, revenue: 124.2},
  {transaction_id: 'T-1022', date: '2026-10-12', store_id: 'S-004', product_id: 'P-004', customer_id: 'C-102', product: 'Air Fryer', quantity: 1, unit_price: 109, discount: 0.1, revenue: 98.1},
  {transaction_id: 'T-1023', date: '2026-10-13', store_id: 'S-004', product_id: 'P-006', customer_id: 'C-107', product: 'Denim Jacket', quantity: 2, unit_price: 64, discount: 0, revenue: 128},
  {transaction_id: 'T-1024', date: '2026-10-14', store_id: 'S-001', product_id: 'P-006', customer_id: 'C-104', product: 'Denim Jacket', quantity: 1, unit_price: 64, discount: 0, revenue: 64},
  {transaction_id: 'T-1025', date: '2026-10-14', store_id: 'S-003', product_id: 'P-006', customer_id: 'C-108', product: 'Denim Jacket', quantity: 2, unit_price: 64, discount: 0.1, revenue: 115.2},
  {transaction_id: 'T-1026', date: '2026-10-15', store_id: 'S-001', product_id: 'P-003', customer_id: 'C-115', product: 'Bluetooth Speaker', quantity: 1, unit_price: 79, discount: 0, revenue: 79},
  {transaction_id: 'T-1027', date: '2026-10-16', store_id: 'S-004', product_id: 'P-006', customer_id: 'C-106', product: 'Denim Jacket', quantity: 2, unit_price: 64, discount: 0, revenue: 128},
  {transaction_id: 'T-1028', date: '2026-10-16', store_id: 'S-004', product_id: 'P-004', customer_id: 'C-108', product: 'Air Fryer', quantity: 1, unit_price: 109, discount: 0, revenue: 109},
  {transaction_id: 'T-1029', date: '2026-10-16', store_id: 'S-003', product_id: 'P-001', customer_id: 'C-108', product: 'Wireless Earbuds', quantity: 3, unit_price: 69, discount: 0, revenue: 207},
  {transaction_id: 'T-1030', date: '2026-10-16', store_id: 'S-003', product_id: 'P-005', customer_id: 'C-120', product: 'Countertop Blender', quantity: 1, unit_price: 59, discount: 0.15, revenue: 50.15},
  {transaction_id: 'T-1031', date: '2026-10-17', store_id: 'S-003', product_id: 'P-008', customer_id: 'C-118', product: 'Organic Coffee Beans 1kg', quantity: 3, unit_price: 18, discount: 0.05, revenue: 51.3},
  {transaction_id: 'T-1032', date: '2026-10-18', store_id: 'S-002', product_id: 'P-008', customer_id: 'C-114', product: 'Organic Coffee Beans 1kg', quantity: 6, unit_price: 18, discount: 0, revenue: 108},
  {transaction_id: 'T-1033', date: '2026-10-19', store_id: 'S-001', product_id: 'P-009', customer_id: 'C-120', product: 'Extra Virgin Olive Oil 1L', quantity: 2, unit_price: 14, discount: 0.1, revenue: 25.2},
  {transaction_id: 'T-1034', date: '2026-10-20', store_id: 'S-001', product_id: 'P-002', customer_id: 'C-104', product: 'Smart Watch', quantity: 1, unit_price: 179, discount: 0, revenue: 179},
  {transaction_id: 'T-1035', date: '2026-10-21', store_id: 'S-004', product_id: 'P-005', customer_id: 'C-105', product: 'Countertop Blender', quantity: 1, unit_price: 59, discount: 0.1, revenue: 53.1},
  {transaction_id: 'T-1036', date: '2026-10-22', store_id: 'S-001', product_id: 'P-004', customer_id: 'C-112', product: 'Air Fryer', quantity: 2, unit_price: 109, discount: 0, revenue: 218},
  {transaction_id: 'T-1037', date: '2026-10-23', store_id: 'S-001', product_id: 'P-005', customer_id: 'C-110', product: 'Countertop Blender', quantity: 2, unit_price: 59, discount: 0.15, revenue: 100.3},
  {transaction_id: 'T-1038', date: '2026-10-23', store_id: 'S-001', product_id: 'P-001', customer_id: 'C-113', product: 'Wireless Earbuds', quantity: 3, unit_price: 69, discount: 0, revenue: 207},
  {transaction_id: 'T-1039', date: '2026-10-24', store_id: 'S-006', product_id: 'P-004', customer_id: 'C-110', product: 'Air Fryer', quantity: 1, unit_price: 109, discount: 0, revenue: 109},
  {transaction_id: 'T-1040', date: '2026-10-25', store_id: 'S-002', product_id: 'P-006', customer_id: 'C-114', product: 'Denim Jacket', quantity: 2, unit_price: 64, discount: 0, revenue: 128},
  {transaction_id: 'T-1041', date: '2026-10-25', store_id: 'S-003', product_id: 'P-002', customer_id: 'C-110', product: 'Smart Watch', quantity: 2, unit_price: 179, discount: 0, revenue: 358},
  {transaction_id: 'T-1042', date: '2026-10-26', store_id: 'S-003', product_id: 'P-007', customer_id: 'C-113', product: 'Running Shoes', quantity: 3, unit_price: 89, discount: 0.05, revenue: 253.65},
  {transaction_id: 'T-1043', date: '2026-10-27', store_id: 'S-004', product_id: 'P-004', customer_id: 'C-117', product: 'Air Fryer', quantity: 1, unit_price: 109, discount: 0, revenue: 109},
  {transaction_id: 'T-1044', date: '2026-10-28', store_id: 'S-003', product_id: 'P-008', customer_id: 'C-115', product: 'Organic Coffee Beans 1kg', quantity: 6, unit_price: 18, discount: 0.05, revenue: 102.6},
  {transaction_id: 'T-1045', date: '2026-10-28', store_id: 'S-001', product_id: 'P-003', customer_id: 'C-113', product: 'Bluetooth Speaker', quantity: 2, unit_price: 79, discount: 0, revenue: 158},
  {transaction_id: 'T-1046', date: '2026-10-29', store_id: 'S-001', product_id: 'P-008', customer_id: 'C-110', product: 'Organic Coffee Beans 1kg', quantity: 3, unit_price: 18, discount: 0.15, revenue: 45.9},
  {transaction_id: 'T-1047', date: '2026-10-30', store_id: 'S-003', product_id: 'P-005', customer_id: 'C-110', product: 'Countertop Blender', quantity: 3, unit_price: 59, discount: 0, revenue: 177},
  {transaction_id: 'T-1048', date: '2026-10-30', store_id: 'S-002', product_id: 'P-005', customer_id: 'C-112', product: 'Countertop Blender', quantity: 2, unit_price: 59, discount: 0.05, revenue: 112.1},
  {transaction_id: 'T-1049', date: '2026-10-21', store_id: 'S-005', product_id: 'P-006', customer_id: 'C-112', product: 'Denim Jacket', quantity: 0, unit_price: 64, discount: 0, revenue: 0}
];

/* ------------------------------------------------------------------ */
/* Pipeline                                                            */
/* ------------------------------------------------------------------ */

export const filterColumns = ['Revenue', 'Quantity', 'Discount'];
export const filterConditions = ['Greater than', 'Greater than or equal to', 'Less than', 'Equal to'];

export const defaultFilter = { column: 'Revenue', condition: 'Greater than', value: 0 };

export const pipeline = {
  id: 'retail-sales-enrichment',
  name: 'Retail Sales Enrichment Pipeline',
  description: 'Cleans October sales, enriches them with RetailCo Database tables and publishes the dataset behind the RetailCo Overview dashboard.',
  owner: 'Sarah Mitchell',
  schedule: 'Daily at 12:00 AM',
  output: 'retail_sales_analytics',
};

export const pipelineSteps = [
  {
    id: 'read',
    number: 1,
    name: 'Read Excel File',
    icon: 'FileSpreadsheet',
    summary: 'Reads sales_october.xlsx, sheet "Sales".',
    config: { file: 'sales_october.xlsx', sheet: 'Sales', headerRow: 1 },
  },
  {
    id: 'filter',
    number: 2,
    name: 'Filter Rows',
    icon: 'Filter',
    summary: 'Keeps valid October 2026 transactions.',
    config: { dateRule: 'Date is within October 2026' },
  },
  {
    id: 'join',
    number: 3,
    name: 'Join with Database',
    icon: 'Database',
    summary: 'Enriches sales with Stores, Products and Customers.',
    config: {
      database: 'RetailCo Database',
      joins: [
        { table: 'Stores', key: 'store_id', adds: 'store_name, city, region' },
        { table: 'Products', key: 'product_id', adds: 'category, unit_cost' },
        { table: 'Customers', key: 'customer_id', adds: 'customer_segment' },
      ],
      joinType: 'Left Join',
    },
  },
  {
    id: 'transform',
    number: 4,
    name: 'Transform Data',
    icon: 'Calculator',
    summary: 'Calculates gross profit & margin, aggregates revenue.',
    config: {
      calculated: [
        { name: 'gross_profit', formula: 'Revenue − (Quantity × Unit Cost)' },
        { name: 'gross_margin', formula: 'Gross Profit ÷ Revenue × 100' },
      ],
      groupBy: ['Date', 'Region', 'Product Category'],
      aggregation: 'SUM(revenue), SUM(gross_profit), COUNT DISTINCT(transaction_id)',
    },
  },
  {
    id: 'output',
    number: 5,
    name: 'Output',
    icon: 'DatabaseZap',
    summary: 'Publishes retail_sales_analytics to the dashboard.',
    config: {
      name: 'retail_sales_analytics',
      destination: 'Analytics Dataset',
      columns: ['transaction_id', 'date', 'region', 'store_name', 'category', 'product', 'quantity', 'revenue', 'gross_profit', 'gross_margin'],
      feeds: 'RetailCo Overview dashboard',
    },
  },
];

export const runHistory = [
  { id: 'run-1042', started: 'Today, 10:30 AM', duration: '42s', status: 'Succeeded', records: 50, trigger: 'Manual' },
  { id: 'run-1041', started: 'Today, 12:00 AM', duration: '39s', status: 'Succeeded', records: 50, trigger: 'Schedule' },
  { id: 'run-1040', started: 'Oct 29, 12:00 AM', duration: '1m 05s', status: 'Failed', records: 0, trigger: 'Schedule', error: 'RetailCo Database connection timed out' },
  { id: 'run-1039', started: 'Oct 28, 12:00 AM', duration: '41s', status: 'Succeeded', records: 46, trigger: 'Schedule' },
  { id: 'run-1038', started: 'Oct 27, 12:00 AM', duration: '38s', status: 'Succeeded', records: 44, trigger: 'Schedule' },
];

// Other pipelines in the workspace, used to demonstrate every status.
export const otherPipelines = [
  { id: 'inventory-sync', name: 'Inventory Stock Sync', status: 'Running', detail: 'Started 2 min ago' },
  { id: 'marketing-attribution', name: 'Marketing Attribution', status: 'Failed', detail: 'Failed today, 9:12 AM · Marketing table schema changed' },
  { id: 'customer-segments', name: 'Customer Segment Refresh', status: 'Scheduled', detail: 'Runs today, 6:00 PM' },
];

/* ------------------------------------------------------------------ */
/* Dashboard filter options & previous-period baseline                 */
/* ------------------------------------------------------------------ */

export const dateRanges = [
  { key: 'month', label: 'This Month', start: '2026-10-01', end: '2026-10-30', prevLabel: 'vs September' },
  { key: '14d', label: 'Last 14 Days', start: '2026-10-17', end: '2026-10-30', prevStart: '2026-10-03', prevEnd: '2026-10-16', prevLabel: 'vs previous 14 days' },
  { key: '7d', label: 'Last 7 Days', start: '2026-10-24', end: '2026-10-30', prevStart: '2026-10-17', prevEnd: '2026-10-23', prevLabel: 'vs previous 7 days' },
];

export const regions = ['North', 'South', 'Central'];

// September has no transaction file in this prototype, so the month
// comparison uses this precomputed summary from the September run.
export const septemberSummary = {
  North: { revenue: 2050, orders: 17, grossProfit: 846 },
  South: { revenue: 2915, orders: 23, grossProfit: 1172 },
  Central: { revenue: 452, orders: 5, grossProfit: 181 },
};

export const CATEGORY_COLORS = {
  Electronics: '#2563eb',
  'Home Appliances': '#0d9488',
  Fashion: '#7c3aed',
  Grocery: '#d97706',
};

/* ------------------------------------------------------------------ */
/* Calculation helpers (shared by dashboard, chat and pipeline)        */
/* ------------------------------------------------------------------ */

const storeById = Object.fromEntries(stores.map((s) => [s.store_id, s]));
const productById = Object.fromEntries(products.map((p) => [p.product_id, p]));
const customerById = Object.fromEntries(customers.map((c) => [c.customer_id, c]));

const round2 = (n) => Math.round(n * 100) / 100;

const COLUMN_KEYS = { Revenue: 'revenue', Quantity: 'quantity', Discount: 'discount' };

// Step 2: Filter Rows. Discount is entered as a percentage in the UI.
export function applyPipelineFilter(rows, filter) {
  const key = COLUMN_KEYS[filter.column];
  const target = Number(filter.value) / (key === 'discount' ? 100 : 1);
  const test = {
    'Greater than': (v) => v > target,
    'Greater than or equal to': (v) => v >= target,
    'Less than': (v) => v < target,
    'Equal to': (v) => v === target,
  }[filter.condition];
  return rows.filter((r) => r.date.startsWith('2026-10') && test(r[key]));
}

// Steps 3 & 4: join reference tables and add calculated columns.
export function enrich(rows) {
  return rows.map((r) => {
    const store = storeById[r.store_id];
    const product = productById[r.product_id];
    const grossProfit = round2(r.revenue - r.quantity * product.unit_cost);
    return {
      ...r,
      store_name: store.store_name,
      city: store.city,
      region: store.region,
      category: product.category,
      unit_cost: product.unit_cost,
      customer_segment: customerById[r.customer_id]?.customer_segment,
      gross_profit: grossProfit,
      gross_margin: r.revenue ? round2((grossProfit / r.revenue) * 100) : 0,
    };
  });
}

// Full simulated pipeline run → retail_sales_analytics rows.
export function runPipeline(filter = defaultFilter) {
  return enrich(applyPipelineFilter(salesTransactions, filter));
}

export function selectRows(rows, { start, end, region = 'All Regions' }) {
  return rows.filter(
    (r) => r.date >= start && r.date <= end
      && (Array.isArray(region) ? region.includes(r.region) : region === 'All Regions' || r.region === region),
  );
}

export function computeKpis(rows) {
  const revenue = round2(rows.reduce((s, r) => s + r.revenue, 0));
  const grossProfit = round2(rows.reduce((s, r) => s + r.gross_profit, 0));
  const orders = new Set(rows.map((r) => r.transaction_id)).size;
  const units = rows.reduce((s, r) => s + r.quantity, 0);
  const listValue = rows.reduce((s, r) => s + r.quantity * r.unit_price, 0);
  return {
    revenue,
    orders,
    aov: orders ? revenue / orders : 0,
    grossProfit,
    margin: revenue ? (grossProfit / revenue) * 100 : 0,
    units,
    discountErosion: listValue ? ((listValue - revenue) / listValue) * 100 : 0,
  };
}

export function previousKpis(rows, range, region) {
  if (range.prevStart) return computeKpis(selectRows(rows, { start: range.prevStart, end: range.prevEnd, region }));
  const selectedRegions = Array.isArray(region)
    ? region
    : region === 'All Regions' ? [] : [region];
  const keys = Array.isArray(region)
    ? selectedRegions
    : region === 'All Regions' ? Object.keys(septemberSummary) : selectedRegions;
  const sum = (f) => keys.reduce((s, k) => s + septemberSummary[k][f], 0);
  const revenue = sum('revenue');
  const orders = sum('orders');
  const grossProfit = sum('grossProfit');
  return {
    revenue,
    orders,
    aov: orders ? revenue / orders : 0,
    margin: revenue ? (grossProfit / revenue) * 100 : 0,
  };
}

export function dailyRevenue(rows, start, end) {
  const out = [];
  const d = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (d <= last) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const total = rows.filter((r) => r.date === iso).reduce((s, r) => s + r.revenue, 0);
    out.push({ date: iso, label: `Oct ${d.getDate()}`, revenue: round2(total) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function groupSum(rows, key, names, field = 'revenue') {
  const totals = Object.fromEntries(names.map((n) => [n, 0]));
  rows.forEach((r) => {
    totals[r[key]] = (totals[r[key]] || 0) + r[field];
  });
  return Object.entries(totals).map(([name, value]) => ({ name, value: round2(value) }));
}

export const revenueByRegion = (rows) => groupSum(rows, 'region', ['North', 'South', 'Central']);
export const grossProfitByRegion = (rows) => groupSum(rows, 'region', ['North', 'South', 'Central'], 'gross_profit');
export const revenueByCategory = (rows) => groupSum(rows, 'category', Object.keys(CATEGORY_COLORS));
export const revenueByStore = (rows, region) =>
  groupSum(
    rows,
    'store_name',
    stores.filter((s) => !region
      || (Array.isArray(region) ? region.includes(s.region) : s.region === region))
      .map((s) => s.store_name),
  ).sort((a, b) => b.value - a.value);
export const revenueByProduct = (rows, category) =>
  groupSum(
    rows.filter((r) => !category || r.category === category),
    'product',
    products.filter((p) => !category || p.category === category).map((p) => p.product_name),
  ).sort((a, b) => b.value - a.value);

export function weeklyRevenue(rows) {
  const weeks = [
    { name: 'Oct 1–7', start: '2026-10-01', end: '2026-10-07' },
    { name: 'Oct 8–14', start: '2026-10-08', end: '2026-10-14' },
    { name: 'Oct 15–21', start: '2026-10-15', end: '2026-10-21' },
    { name: 'Oct 22–30', start: '2026-10-22', end: '2026-10-30' },
  ];
  return weeks.map((w) => ({
    name: w.name,
    value: round2(rows.filter((r) => r.date >= w.start && r.date <= w.end).reduce((s, r) => s + r.revenue, 0)),
  }));
}

// Secondary metrics. Only those supported by the available tables are calculated.
export function secondaryMetrics(rows, region) {
  const k = computeKpis(rows);
  const storeList = stores.filter((s) => region === 'All Regions' || s.region === region);
  const storeIds = new Set(storeList.map((s) => s.store_id));
  const inv = inventory.filter((i) => storeIds.has(i.store_id));
  const received = inv.reduce((s, i) => s + i.units_received, 0);
  const sold = inv.reduce((s, i) => s + i.units_sold, 0);
  const invValue = inv.reduce((s, i) => s + i.inventory_value, 0);
  const stockouts = inv.filter((i) => i.stock_quantity === 0).length;
  const sqft = storeList.reduce((s, st) => s + st.store_size_sqft, 0);
  const spend = marketing.reduce((s, m) => s + m.marketing_spend, 0);
  const acquired = marketing.reduce((s, m) => s + m.acquired_customers, 0);
  return [
    { group: 'Profitability', label: 'Gross profit', value: k.grossProfit, format: 'currency', note: 'Revenue − quantity × unit cost' },
    { group: 'Profitability', label: 'GMROI', value: invValue ? k.grossProfit / invValue : null, format: 'ratio', note: 'Gross profit ÷ inventory value on hand' },
    { group: 'Profitability', label: 'Discount erosion', value: k.discountErosion, format: 'percent', note: 'Discounts ÷ list-price sales' },
    { group: 'Customer', label: 'Units per transaction', value: k.orders ? k.units / k.orders : 0, format: 'decimal', note: 'Units sold ÷ unique orders' },
    { group: 'Customer', label: 'CAC', value: acquired ? spend / acquired : null, format: 'currency2', note: 'Marketing spend ÷ acquired customers (all regions)' },
    { group: 'Inventory', label: 'Sell-through', value: received ? (sold / received) * 100 : null, format: 'percent', note: 'Units sold ÷ units received' },
    { group: 'Inventory', label: 'Stockout rate', value: inv.length ? (stockouts / inv.length) * 100 : null, format: 'percent', note: 'Store-product lines with zero stock' },
    { group: 'Stores', label: 'Sales per sq ft', value: sqft ? k.revenue / sqft : 0, format: 'currency2', note: 'Revenue ÷ store floor area' },
  ];
}

/* ------------------------------------------------------------------ */
/* Chat                                                                */
/* ------------------------------------------------------------------ */

export const suggestedQuestions = [
  'Which region generated the highest revenue in October?',
  'Show me daily revenue for October.',
  'Which product category performed best?',
  'Compare revenue across stores.',
  'What is our gross profit by region?',
];

export const formatCurrency = (n, digits = 0) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

// Simulated assistant: maps a question to a predefined response template
// built from the same pipeline output the dashboard uses.
export function buildChatResponse(question, rows, lastInsight) {
  const q = question.toLowerCase();
  const total = rows.reduce((s, r) => s + r.revenue, 0);
  const share = (v) => `${((v / total) * 100).toFixed(1)}%`;
  const mentionedRegion = ['north', 'south', 'central'].find((r) => q.includes(r));

  if (lastInsight && /(bar|line|pie|donut)\s*(chart)?/.test(q) && /(change|switch|make|turn|as a|to a|show)/.test(q)) {
    const chartType = q.includes('bar') ? 'bar' : q.includes('line') ? 'line' : 'donut';
    return {
      text: `Done — I've redrawn "${lastInsight.title}" as a ${chartType === 'donut' ? 'donut' : chartType} chart. The underlying figures are unchanged.`,
      insight: { ...lastInsight, chartType, id: `${lastInsight.kind}-${chartType}`, changed: true },
    };
  }

  if (mentionedRegion && /(why|breakdown|break down|drill|stores? in|within)/.test(q)) {
    const region = mentionedRegion[0].toUpperCase() + mentionedRegion.slice(1);
    return drillDownResponse({ kind: 'region', region }, rows);
  }

  if (q.includes('profit')) {
    const data = grossProfitByRegion(rows);
    const top = [...data].sort((a, b) => b.value - a.value)[0];
    const gp = data.reduce((s, d) => s + d.value, 0);
    return {
      text: `${top.name} delivered the most gross profit in October (${formatCurrency(top.value)}). Across all regions, gross profit was ${formatCurrency(gp)}, a ${((gp / total) * 100).toFixed(1)}% gross margin.`,
      insight: {
        kind: 'profit-region', id: 'profit-region-bar', title: 'Gross Profit by Region', subtitle: 'October 2026 · Revenue − quantity × unit cost',
        chartType: 'bar', data,
        figures: data.map((d) => ({ label: d.name, value: formatCurrency(d.value) })),
      },
    };
  }

  if (/(daily|day|trend|over time|timeline)/.test(q)) {
    const data = dailyRevenue(rows, '2026-10-01', '2026-10-30').map((d) => ({ name: d.label, value: d.revenue }));
    const best = [...data].sort((a, b) => b.value - a.value)[0];
    return {
      text: `Daily revenue in October averaged ${formatCurrency(total / data.length)}. The strongest day was ${best.name} at ${formatCurrency(best.value)}.`,
      insight: {
        kind: 'daily', id: 'daily-line', title: 'Daily Revenue, October 2026', subtitle: 'Revenue after discounts, per day',
        chartType: 'line', data,
        figures: [
          { label: 'Total', value: formatCurrency(total) },
          { label: 'Daily average', value: formatCurrency(total / data.length) },
          { label: 'Peak day', value: `${best.name} · ${formatCurrency(best.value)}` },
        ],
      },
    };
  }

  if (/(category|categories|product)/.test(q)) {
    const data = revenueByCategory(rows).sort((a, b) => b.value - a.value);
    return {
      text: `${data[0].name} was the best-performing category, contributing ${share(data[0].value)} of October revenue. ${data[data.length - 1].name} contributed the least (${share(data[data.length - 1].value)}).`,
      insight: {
        kind: 'category', id: 'category-donut', title: 'Revenue by Product Category', subtitle: 'Share of October 2026 revenue',
        chartType: 'donut', data,
        figures: data.map((d) => ({ label: d.name, value: `${formatCurrency(d.value)} · ${share(d.value)}` })),
      },
    };
  }

  if (q.includes('store')) {
    const data = revenueByStore(rows);
    return {
      text: `${data[0].name} is RetailCo's top store this month with ${formatCurrency(data[0].value)} (${share(data[0].value)} of revenue). ${data[data.length - 1].name} is the smallest contributor.`,
      insight: {
        kind: 'store', id: 'store-bar', title: 'Revenue by Store', subtitle: 'October 2026, all regions',
        chartType: 'bar', data,
        figures: data.slice(0, 3).map((d) => ({ label: d.name, value: formatCurrency(d.value) })),
      },
    };
  }

  if (/(region|highest|best|top|compare)/.test(q)) {
    const data = revenueByRegion(rows);
    const top = [...data].sort((a, b) => b.value - a.value)[0];
    return {
      text: `${top.name} generated the highest revenue in October with ${formatCurrency(top.value)}, contributing the largest share (${share(top.value)}) of RetailCo's total sales.`,
      insight: {
        kind: 'region', id: 'region-bar', title: 'Revenue by Region', subtitle: 'October 2026 · Revenue after discounts',
        chartType: 'bar', data,
        figures: data.map((d) => ({ label: d.name, value: `${formatCurrency(d.value)} · ${share(d.value)}` })),
      },
    };
  }

  return {
    text: "I can answer questions about RetailCo revenue, orders, gross profit, regions, stores and product categories for October 2026. Try one of the suggestions below, or ask something like \"Why is South ahead?\"",
    showSuggestions: true,
  };
}

export function drillDownResponse(insight, rows) {
  if (insight.kind === 'daily') {
    const data = weeklyRevenue(rows);
    return {
      text: 'Here is October revenue rolled up by week, so you can see which part of the month drove the daily pattern.',
      insight: { kind: 'weekly', id: 'weekly-bar', title: 'Weekly Revenue, October 2026', subtitle: 'Drill-down of daily revenue', chartType: 'bar', data, figures: data.map((d) => ({ label: d.name, value: formatCurrency(d.value) })) },
    };
  }
  if (insight.kind === 'category') {
    const data = revenueByProduct(rows);
    return {
      text: `Breaking categories down to products: ${data[0].name} is the single largest revenue line at ${formatCurrency(data[0].value)}.`,
      insight: { kind: 'product', id: 'product-bar', title: 'Revenue by Product', subtitle: 'Drill-down of category revenue', chartType: 'bar', data, figures: data.slice(0, 3).map((d) => ({ label: d.name, value: formatCurrency(d.value) })) },
    };
  }
  const region = insight.region || [...revenueByRegion(rows)].sort((a, b) => b.value - a.value)[0].name;
  const regionRows = rows.filter((r) => r.region === region);
  const data = revenueByStore(regionRows, region);
  const cats = revenueByCategory(regionRows).sort((a, b) => b.value - a.value);
  const regionTotal = regionRows.reduce((s, r) => s + r.revenue, 0);
  return {
    text: `${region} revenue (${formatCurrency(regionTotal)}) is led by ${data[0].name}, which delivered ${formatCurrency(data[0].value)}. ${cats[0].name} is the strongest category in ${region}, at ${((cats[0].value / regionTotal) * 100).toFixed(0)}% of regional sales.`,
    insight: {
      kind: 'region-stores', region, id: `stores-${region}-bar`, title: `${region} Region: Revenue by Store`, subtitle: 'Drill-down · October 2026',
      chartType: 'bar', data,
      figures: [...data.map((d) => ({ label: d.name, value: formatCurrency(d.value) })), { label: `Top category`, value: cats[0].name }],
    },
  };
}
