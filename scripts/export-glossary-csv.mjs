// Script: generate glossary CSV for teacher review
// Run: node scripts/export-glossary-csv.mjs
// Output: glossary-teacher-review.csv (in project root)

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = join(__dir, '..');

// Since this is a TypeScript source file we copy the data manually here.
// In CI this could be generated via ts-node or tsx.
const glossary = [
  { id: 'accounting',            termEn: 'Accounting',                termBn: 'হিসাবশাস্ত্র',       semester: 1, unit: 1, category: 'fundamental' },
  { id: 'transaction',           termEn: 'Transaction',               termBn: 'লেনদেন',              semester: 1, unit: 1, category: 'fundamental' },
  { id: 'journal',               termEn: 'Journal',                   termBn: 'জাবেদা',              semester: 1, unit: 2, category: 'fundamental' },
  { id: 'ledger',                termEn: 'Ledger',                    termBn: 'খতিয়ান',              semester: 1, unit: 2, category: 'fundamental' },
  { id: 'trial-balance',         termEn: 'Trial Balance',             termBn: 'রেওয়ামিল',            semester: 1, unit: 2, category: 'statement'   },
  { id: 'cash-book',             termEn: 'Cash Book',                 termBn: 'নগদান বই',            semester: 2, unit: 1, category: 'fundamental' },
  { id: 'balance-sheet',         termEn: 'Balance Sheet',             termBn: 'উদ্বৃত্তপত্র',        semester: 2, unit: 2, category: 'statement'   },
  { id: 'debit',                 termEn: 'Debit',                     termBn: 'ডেবিট (দেনা)',        semester: 1, unit: 2, category: 'fundamental' },
  { id: 'credit',                termEn: 'Credit',                    termBn: 'ক্রেডিট (পাওনা)',    semester: 1, unit: 2, category: 'fundamental' },
  { id: 'capital',               termEn: 'Capital',                   termBn: 'মূলধন',               semester: 1, unit: 1, category: 'fundamental' },
  { id: 'drawings',              termEn: 'Drawings',                  termBn: 'উত্তোলন',             semester: 1, unit: 1, category: 'fundamental' },
  { id: 'assets',                termEn: 'Assets',                    termBn: 'সম্পদ',               semester: 1, unit: 1, category: 'fundamental' },
  { id: 'liabilities',           termEn: 'Liabilities',               termBn: 'দায়',                 semester: 1, unit: 1, category: 'fundamental' },
  { id: 'debtor',                termEn: 'Debtor',                    termBn: 'দেনাদার',             semester: 1, unit: 1, category: 'fundamental' },
  { id: 'creditor',              termEn: 'Creditor',                  termBn: 'পাওনাদার',            semester: 1, unit: 1, category: 'fundamental' },
  { id: 'depreciation',         termEn: 'Depreciation',              termBn: 'অবচয়',               semester: 2, unit: 1, category: 'fundamental' },
  { id: 'narration',             termEn: 'Narration',                 termBn: 'বিবরণ',               semester: 1, unit: 2, category: 'fundamental' },
  { id: 'voucher',               termEn: 'Voucher',                   termBn: 'ভাউচার',              semester: 1, unit: 2, category: 'fundamental' },
  { id: 'reserve',               termEn: 'Reserve',                   termBn: 'সঞ্চিতি',             semester: 1, unit: 3, category: 'fundamental' },
  { id: 'provision',             termEn: 'Provision',                 termBn: 'সংস্থান',             semester: 1, unit: 3, category: 'fundamental' },
  { id: 'bill-of-exchange',      termEn: 'Bill of Exchange',          termBn: 'বিনিময় বিল',         semester: 1, unit: 4, category: 'fundamental' },
  { id: 'partnership',           termEn: 'Partnership',               termBn: 'অংশীদারি কারবার',    semester: 3, unit: 1, category: 'partnership' },
  { id: 'goodwill',              termEn: 'Goodwill',                  termBn: 'সুনাম',               semester: 3, unit: 1, category: 'partnership' },
  { id: 'debenture',             termEn: 'Debenture',                 termBn: 'ঋণপত্র',              semester: 3, unit: 2, category: 'company'     },
  { id: 'share',                 termEn: 'Share',                     termBn: 'শেয়ার',              semester: 3, unit: 2, category: 'company'     },
  { id: 'cash-flow-statement',   termEn: 'Cash Flow Statement',       termBn: 'নগদ প্রবাহ বিবরণী',  semester: 4, unit: 1, category: 'statement'   },
];

// CSV header
const cols = [
  'ID',
  'English Term',
  'Bengali Term (needsReview)',
  'Semester',
  'Unit',
  'Category',
  'Teacher: Correct Bengali?',
  'Teacher: Corrected Term',
  'Teacher: Notes',
  'Teacher: Approved? (yes/no)',
];

const escapeCSV = (v) => {
  const s = String(v ?? '');
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s;
};

const rows = [
  cols.join(','),
  ...glossary.map((g) =>
    [
      g.id,
      g.termEn,
      g.termBn,
      g.semester,
      g.unit,
      g.category,
      '',   // Teacher: Correct Bengali?
      '',   // Teacher: Corrected Term
      '',   // Teacher: Notes
      'no', // Teacher: Approved? (default no)
    ]
      .map(escapeCSV)
      .join(',')
  ),
].join('\n');

const outPath = join(root, 'glossary-teacher-review.csv');
writeFileSync(outPath, '\uFEFF' + rows, 'utf-8'); // BOM for Excel compatibility
console.log(`✓ Written ${glossary.length} terms to: ${outPath}`);
