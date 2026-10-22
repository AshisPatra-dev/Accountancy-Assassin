// ============================================================
// ACCOUNTANCY ASSASSIN — Problem Templates: Subsidiary Books
// S1-PB-TRADEDISC-01 (Purchases Book), S1-SB-TRADEDISC-01 (Sales Book)
// Credit transactions with trade discount, invoice amounts, periodic totals.
// ============================================================

import { ProblemTemplate, engine } from '@/lib/templateEngine';
import { randInt, randFrom, randRound } from '@/lib/prng';
import { formatINR } from '@/lib/format';

interface BookEntry {
  partyName: string;
  itemsDesc: string;
  grossAmount: number;
  discountPct: number;
  discountAmount: number;
  netAmount: number;
}

// ── 1. S1-PB-TRADEDISC-01: Purchases Book ─────────────────────
export const S1_PB_TRADEDISC_01: ProblemTemplate = {
  id: 'S1-PB-TRADEDISC-01',
  topicIds: ['S1-U2-T09'],
  semId: 1,
  difficulty: 2,
  marks: 3,
  type: 'form',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'entryCount', type: 'int', min: 4, max: 5 },
  ],
  generate: (rng) => {
    const suppliers = [
      'Ghoshal & Bros, Siliguri',
      'Mukherjee Textiles, Shantipur',
      'Mallick Stationers, College Street',
      'Banerjee Paper Mart, Howrah',
      'Dutta Spices, Posta Bazar',
    ];

    const count = 4;
    const entries: BookEntry[] = [];
    let grandTotal = 0;

    for (let i = 0; i < count; i++) {
      const partyName = suppliers[i % suppliers.length];
      const gross = randRound(rng, 10000, 50000, 1000);
      const discountPct = randFrom(rng, [5, 10, 15, 20]);
      const discountAmount = Math.round((gross * discountPct) / 100);
      const netAmount = gross - discountAmount;
      grandTotal += netAmount;

      entries.push({
        partyName,
        itemsDesc: `Goods invoiced at ${formatINR(gross)} less ${discountPct}% trade discount`,
        grossAmount: gross,
        discountPct,
        discountAmount,
        netAmount,
      });
    }

    const textKey =
      'From the following credit transactions, prepare the Purchases Book and compute the total monthly purchases figure:\n' +
      entries
        .map(
          (e, idx) =>
            `${idx + 1}. Purchased from ${e.partyName}: gross amount ${formatINR(e.grossAmount)}, trade discount ${e.discountPct}%.`
        )
        .join('\n');

    const textParams = {
      grandTotalStr: formatINR(grandTotal),
    };

    const solver = () => {
      const isValid = grandTotal > 0 && entries.every((e) => e.netAmount > 0);
      const steps = entries.map((e, idx) => ({
        label: `Transaction ${idx + 1}: ${e.partyName}`,
        formula: `\\text{Net} = ${formatINR(e.grossAmount)} - (${formatINR(e.grossAmount)} \\times ${e.discountPct}\\%) = ${formatINR(e.netAmount)}`,
        value: e.netAmount,
        note: `Trade discount of ${formatINR(e.discountAmount)} is deducted; net amount entered in Details/Total column.`,
      }));

      steps.push({
        label: `Total Purchases for the period transferred to Purchases Account (Dr.)`,
        formula: `\\text{Total} = ${entries.map((e) => formatINR(e.netAmount)).join(' + ')} = ${formatINR(grandTotal)}`,
        value: grandTotal,
        note: 'Purchases Book monthly total is posted to the Debit side of Purchases Account in the Ledger.',
      });

      const answerCells: Record<string, number | string> = {
        totalPurchases: grandTotal,
        targetValue: grandTotal,
      };

      entries.forEach((e, idx) => {
        answerCells[`row_${idx}_net`] = e.netAmount;
      });

      return {
        isValid,
        steps,
        answer: answerCells,
      };
    };

    return {
      params: { entries, grandTotal },
      textKey,
      textParams,
      solver,
      hintKey: 'Compute each supplier\'s net invoice price by deducting trade discount. Sum all net amounts.',
      mistakeKey: 'Cash purchases and purchases of fixed assets are NOT entered in the Purchases Book.',
    };
  },
};

// ── 2. S1-SB-TRADEDISC-01: Sales Book ─────────────────────────
export const S1_SB_TRADEDISC_01: ProblemTemplate = {
  id: 'S1-SB-TRADEDISC-01',
  topicIds: ['S1-U2-T10'],
  semId: 1,
  difficulty: 2,
  marks: 3,
  type: 'form',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'entryCount', type: 'int', min: 4, max: 5 },
  ],
  generate: (rng) => {
    const customers = [
      'Ananda Store, Asansol',
      'Chakraborty Emporium, Burdwan',
      'Saha Departmental, Malda',
      'Roy General Store, Jalpaiguri',
      'Basu & Co., Midnapore',
    ];

    const count = 4;
    const entries: BookEntry[] = [];
    let grandTotal = 0;

    for (let i = 0; i < count; i++) {
      const partyName = customers[i % customers.length];
      const gross = randRound(rng, 12000, 60000, 1000);
      const discountPct = randFrom(rng, [5, 10, 15, 20]);
      const discountAmount = Math.round((gross * discountPct) / 100);
      const netAmount = gross - discountAmount;
      grandTotal += netAmount;

      entries.push({
        partyName,
        itemsDesc: `Credit sale invoiced at ${formatINR(gross)} less ${discountPct}% trade discount`,
        grossAmount: gross,
        discountPct,
        discountAmount,
        netAmount,
      });
    }

    const textKey =
      'Enter the following credit sales into the Sales Book and determine the total amount to be credited to the Sales Account:\n' +
      entries
        .map(
          (e, idx) =>
            `${idx + 1}. Sold on credit to ${e.partyName}: List price ${formatINR(e.grossAmount)}, Trade discount ${e.discountPct}%.`
        )
        .join('\n');

    const textParams = {
      grandTotalStr: formatINR(grandTotal),
    };

    const solver = () => {
      const isValid = grandTotal > 0 && entries.every((e) => e.netAmount > 0);
      const steps = entries.map((e, idx) => ({
        label: `Invoice ${idx + 1}: ${e.partyName}`,
        formula: `\\text{Net Amount} = ${formatINR(e.grossAmount)} - (${formatINR(e.grossAmount)} \\times ${e.discountPct}\\%) = ${formatINR(e.netAmount)}`,
        value: e.netAmount,
        note: `Trade discount is not separately shown in the ledger; net invoice is entered.`,
      }));

      steps.push({
        label: `Total Sales Book transferred to Sales Account (Cr.)`,
        formula: `\\text{Total Credit} = ${entries.map((e) => formatINR(e.netAmount)).join(' + ')} = ${formatINR(grandTotal)}`,
        value: grandTotal,
        note: 'Sales Book monthly total is credited to Sales Account in the Ledger.',
      });

      const answerCells: Record<string, number | string> = {
        totalSales: grandTotal,
        targetValue: grandTotal,
      };

      entries.forEach((e, idx) => {
        answerCells[`row_${idx}_net`] = e.netAmount;
      });

      return {
        isValid,
        steps,
        answer: answerCells,
      };
    };

    return {
      params: { entries, grandTotal },
      textKey,
      textParams,
      solver,
      hintKey: 'Only credit sales of goods are recorded in the Sales Book at net amount after trade discount.',
      mistakeKey: 'Cash sales are recorded in the Cash Book; credit sale of old furniture goes to Journal Proper.',
    };
  },
};

// Register all templates in engine
engine.register(S1_PB_TRADEDISC_01);
engine.register(S1_SB_TRADEDISC_01);
