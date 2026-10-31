// Generates public/data/sales_october.xlsx from the same transactions the app uses.
// Run with: npm run generate:workbook
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';
import { salesTransactions } from '../src/data/mockData.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'public/data/sales_october.xlsx');

const header = ['transaction_id', 'date', 'store_id', 'product_id', 'customer_id', 'product', 'quantity', 'unit_price', 'discount', 'revenue'];
const sheet = XLSX.utils.json_to_sheet(salesTransactions, { header });
sheet['!cols'] = header.map((h) => ({ wch: h === 'product' ? 28 : Math.max(12, h.length + 2) }));

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, sheet, 'Sales');

mkdirSync(dirname(outFile), { recursive: true });
XLSX.writeFile(workbook, outFile);
console.log(`Wrote ${salesTransactions.length} rows to ${outFile}`);
