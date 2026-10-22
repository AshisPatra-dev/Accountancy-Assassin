// ============================================================
// ACCOUNTANCY ASSASSIN — Semester 1 Template Suite
// Central barrel exporting all S1 templates and auto-registering.
// ============================================================

export * from './accountingEquation';
export * from './journalEntries';
export * from './specialBooks';
export * from './bills';
export * from './errors';
export * from './reserves';

export const S1_TEMPLATE_IDS = [
  'S1-EQ-MISSING-01',
  'S1-EQ-MISSING-02',
  'S1-EQ-TXSEQ-01',
  'S1-JNL-SIMPLE-01',
  'S1-JNL-COMPOUND-01',
  'S1-JNL-CREDIT-01',
  'S1-JNL-CASHDISCOUNT-01',
  'S1-JNL-FIXEDASSET-01',
  'S1-JNL-DRAWINGS-01',
  'S1-PB-TRADEDISC-01',
  'S1-SB-TRADEDISC-01',
  'S1-BILL-DUEDATE-01',
  'S1-BILL-DUEDATE-02',
  'S1-BILL-DISC-01',
  'S1-BILL-ENTRIES-01',
  'S1-BILL-DISHONOUR-01',
  'S1-ERR-CLASSIFY-01',
  'S1-ERR-RECTIFY-01',
  'S1-RES-CLASSIFY-01',
  'S1-RES-PROVISION-01',
] as const;
