// ============================================================
// ACCOUNTANCY ASSASSIN — Problem Templates: Journal Entries
// S1-JNL-SIMPLE-01, S1-JNL-COMPOUND-01, S1-JNL-CREDIT-01,
// S1-JNL-CASHDISCOUNT-01, S1-JNL-FIXEDASSET-01, S1-JNL-DRAWINGS-01
// Strict adherence to WBCHSE journal conventions and rules.
// ============================================================

import { ProblemTemplate, engine } from '@/lib/templateEngine';
import { randInt, randFrom, randRound } from '@/lib/prng';
import { formatINR } from '@/lib/format';
import { BENGALI_NAMES } from './accountingEquation';

export interface JournalLine {
  account: string;
  side: 'Dr' | 'Cr';
  amount: number;
}

// ── 1. S1-JNL-SIMPLE-01: Simple Journal Entry ─────────────────
export const S1_JNL_SIMPLE_01: ProblemTemplate = {
  id: 'S1-JNL-SIMPLE-01',
  topicIds: ['S1-U2-T05', 'S1-U2-T06'],
  semId: 1,
  difficulty: 1,
  marks: 1,
  type: 'journal',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'amount', type: 'int', min: 1000, max: 50000, step: 500 },
    { name: 'scenario', type: 'choice', choices: ['rent_paid', 'commission_received', 'cash_sales'] },
  ],
  generate: (rng) => {
    const amount = randRound(rng, 1000, 50000, 500);
    const scenario = randFrom(rng, ['rent_paid', 'commission_received', 'cash_sales'] as const);

    let textKey = '';
    let debitAccount = '';
    let creditAccount = '';
    let narration = '';

    if (scenario === 'rent_paid') {
      textKey = 'Paid shop rent of {amountStr} in cash to landlord.';
      debitAccount = 'Rent Account';
      creditAccount = 'Cash Account';
      narration = 'Being rent paid in cash';
    } else if (scenario === 'commission_received') {
      textKey = 'Received commission of {amountStr} in cash.';
      debitAccount = 'Cash Account';
      creditAccount = 'Commission Received Account';
      narration = 'Being commission received in cash';
    } else {
      textKey = 'Sold goods for cash amounting to {amountStr}.';
      debitAccount = 'Cash Account';
      creditAccount = 'Sales Account';
      narration = 'Being goods sold for cash';
    }

    const textParams = {
      amountStr: formatINR(amount),
    };

    const solver = () => {
      const isValid = amount > 0;
      return {
        isValid,
        steps: [
          {
            label: `Identify Accounts: ${debitAccount} (Nominal/Real) and ${creditAccount} (Real/Nominal)`,
            note: `Debit what comes in / all expenses; Credit what goes out / all incomes.`,
          },
          {
            label: `Journal Entry: Dr. ${debitAccount} ${formatINR(amount)} | Cr. ${creditAccount} ${formatINR(amount)}`,
            formula: `\\text{Dr. } ${debitAccount} \\; ${formatINR(amount)} \\quad \\text{to } ${creditAccount} \\; ${formatINR(amount)}`,
            value: amount,
          },
        ],
        answer: {
          debitAccount,
          debitAmount: amount,
          creditAccount,
          creditAmount: amount,
          debitTotal: amount,
          creditTotal: amount,
          narration,
        },
      };
    };

    return {
      params: { amount, scenario, debitAccount, creditAccount },
      textKey,
      textParams,
      solver,
      hintKey: 'Identify whether the transaction is an expense payment or receipt. Debit increases expenses/assets.',
      mistakeKey: 'Do not debit Cash when paying expenses; Cash goes out, so Cash Account must be credited.',
    };
  },
};

// ── 2. S1-JNL-COMPOUND-01: Compound Journal Entry ─────────────
export const S1_JNL_COMPOUND_01: ProblemTemplate = {
  id: 'S1-JNL-COMPOUND-01',
  topicIds: ['S1-U2-T06', 'S1-U2-T07'],
  semId: 1,
  difficulty: 2,
  marks: 2,
  type: 'journal',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'scenario', type: 'choice', choices: ['salaries_and_rent', 'cash_bank_sales'] },
  ],
  generate: (rng) => {
    const amt1 = randRound(rng, 5000, 30000, 500);
    const amt2 = randRound(rng, 3000, 20000, 500);
    const totalAmt = amt1 + amt2;
    const scenario = randFrom(rng, ['salaries_and_rent', 'cash_bank_sales'] as const);

    let textKey = '';
    let debits: { account: string; amount: number }[] = [];
    let credits: { account: string; amount: number }[] = [];
    let narration = '';

    if (scenario === 'salaries_and_rent') {
      textKey = 'Paid Salaries {amt1Str} and Office Rent {amt2Str} by cash on the same date.';
      debits = [
        { account: 'Salaries Account', amount: amt1 },
        { account: 'Rent Account', amount: amt2 },
      ];
      credits = [{ account: 'Cash Account', amount: totalAmt }];
      narration = 'Being salaries and rent paid in cash';
    } else {
      textKey = 'Sold goods for {totalAmtStr}, receiving {amt1Str} in cash and the balance {amt2Str} by cheque deposited into bank.';
      debits = [
        { account: 'Cash Account', amount: amt1 },
        { account: 'Bank Account', amount: amt2 },
      ];
      credits = [{ account: 'Sales Account', amount: totalAmt }];
      narration = 'Being goods sold for cash and cheque';
    }

    const textParams = {
      amt1Str: formatINR(amt1),
      amt2Str: formatINR(amt2),
      totalAmtStr: formatINR(totalAmt),
    };

    const solver = () => {
      const debitTotal = debits.reduce((s, d) => s + d.amount, 0);
      const creditTotal = credits.reduce((s, c) => s + c.amount, 0);
      const isValid = debitTotal === creditTotal && debitTotal > 0;

      return {
        isValid,
        steps: [
          {
            label: 'Compound Entry Analysis',
            note: 'When two or more transactions of the same nature occur on the same date, they are combined into one compound journal entry.',
          },
          {
            label: `Verify Equality: Total Debits = ${formatINR(debitTotal)} must equal Total Credits = ${formatINR(creditTotal)}`,
            value: debitTotal,
          },
        ],
        answer: {
          debitTotal,
          creditTotal,
          narration,
          firstDebitAcc: debits[0].account,
          firstDebitAmt: debits[0].amount,
          secondDebitAcc: debits.length > 1 ? debits[1].account : '',
          secondDebitAmt: debits.length > 1 ? debits[1].amount : 0,
        },
      };
    };

    return {
      params: { amt1, amt2, totalAmt, scenario },
      textKey,
      textParams,
      solver,
      hintKey: 'In a compound entry, ensure the sum of all debits strictly equals the sum of all credits.',
      mistakeKey: 'Check that every debit and credit line has its exact individual amount.',
    };
  },
};

// ── 3. S1-JNL-CREDIT-01: Credit Purchase with Trade Discount ─
export const S1_JNL_CREDIT_01: ProblemTemplate = {
  id: 'S1-JNL-CREDIT-01',
  topicIds: ['S1-U2-T07', 'S1-U2-T08'],
  semId: 1,
  difficulty: 2,
  marks: 2,
  type: 'journal',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'listPrice', type: 'int', min: 10000, max: 100000, step: 1000 },
    { name: 'tradeDiscountPct', type: 'int', min: 5, max: 25, step: 5 },
    { name: 'supplierName', type: 'name' },
  ],
  generate: (rng) => {
    const listPrice = randRound(rng, 10000, 100000, 1000);
    const tradeDiscountPct = randFrom(rng, [5, 10, 15, 20, 25]);
    const supplierName = randFrom(rng, ['Sen Brothers', 'Bose & Co.', 'Chatterjee Enterprises', 'Das & Sons']);

    const tradeDiscountAmt = Math.round((listPrice * tradeDiscountPct) / 100);
    const netAmount = listPrice - tradeDiscountAmt;

    const textKey =
      'Purchased goods from {supplierName} of catalogue list price {listPriceStr} at {tradeDiscountPct}% trade discount on credit.';

    const textParams = {
      supplierName,
      listPriceStr: formatINR(listPrice),
      tradeDiscountPct,
      tradeDiscountAmtStr: formatINR(tradeDiscountAmt),
      netAmountStr: formatINR(netAmount),
    };

    const solver = () => {
      const isValid = netAmount > 0 && tradeDiscountAmt >= 0 && listPrice > 0;
      return {
        isValid,
        steps: [
          {
            label: 'Rule on Trade Discount: Never recorded in the books of account',
            note: 'Trade discount is deducted directly on the invoice. Purchases are recorded at the Net Invoice Price only.',
          },
          {
            label: `Calculate Trade Discount: ${tradeDiscountPct}% of ${formatINR(listPrice)} = ${formatINR(tradeDiscountAmt)}`,
            formula: `\\text{Trade Discount} = ${formatINR(listPrice)} \\times ${tradeDiscountPct}\\% = ${formatINR(tradeDiscountAmt)}`,
            value: tradeDiscountAmt,
          },
          {
            label: `Compute Net Recorded Amount: ${formatINR(listPrice)} - ${formatINR(tradeDiscountAmt)} = ${formatINR(netAmount)}`,
            formula: `\\text{Net Amount} = ${formatINR(listPrice)} - ${formatINR(tradeDiscountAmt)} = ${formatINR(netAmount)}`,
            value: netAmount,
          },
          {
            label: `Journal Entry: Dr. Purchases A/c ${formatINR(netAmount)} | Cr. ${supplierName} A/c ${formatINR(netAmount)}`,
            formula: `\\text{Dr. Purchases A/c } ${formatINR(netAmount)} \\quad \\text{to } ${supplierName} \\text{ A/c } ${formatINR(netAmount)}`,
          },
        ],
        answer: {
          debitAccount: 'Purchases Account',
          debitAmount: netAmount,
          creditAccount: `${supplierName} Account`,
          creditAmount: netAmount,
          debitTotal: netAmount,
          creditTotal: netAmount,
          tradeDiscountAmt,
          netAmount,
          narration: `Being goods purchased from ${supplierName} less ${tradeDiscountPct}% trade discount`,
        },
      };
    };

    return {
      params: { listPrice, tradeDiscountPct, supplierName, tradeDiscountAmt, netAmount },
      textKey,
      textParams,
      solver,
      hintKey: 'Golden rule: Trade discount is deducted from catalog price and NEVER shown as a separate account.',
      mistakeKey: 'Do not open a "Trade Discount Account". Only Cash Discount is recorded in the ledger.',
    };
  },
};

// ── 4. S1-JNL-CASHDISCOUNT-01: Cash Payment with Cash Discount Allowed ──
export const S1_JNL_CASHDISCOUNT_01: ProblemTemplate = {
  id: 'S1-JNL-CASHDISCOUNT-01',
  topicIds: ['S1-U2-T07', 'S1-U2-T08'],
  semId: 1,
  difficulty: 2,
  marks: 2,
  type: 'journal',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'dueAmount', type: 'int', min: 10000, max: 60000, step: 1000 },
    { name: 'cashDiscountPct', type: 'int', min: 2, max: 5, step: 1 },
    { name: 'creditorName', type: 'name' },
  ],
  generate: (rng) => {
    const dueAmount = randRound(rng, 10000, 60000, 1000);
    const cashDiscountPct = randFrom(rng, [2, 3, 4, 5]);
    const creditorName = randFrom(rng, ['Mondal Traders', 'Ghosh Supplies', 'Banerjee & Sons']);

    const discountReceived = Math.round((dueAmount * cashDiscountPct) / 100);
    const cashPaid = dueAmount - discountReceived;

    const textKey =
      'Paid cash to creditor {creditorName} in full settlement of their due account of {dueAmountStr}, receiving {cashDiscountPct}% cash discount.';

    const textParams = {
      creditorName,
      dueAmountStr: formatINR(dueAmount),
      cashDiscountPct,
      cashPaidStr: formatINR(cashPaid),
      discountReceivedStr: formatINR(discountReceived),
    };

    const solver = () => {
      const isValid = cashPaid + discountReceived === dueAmount && cashPaid > 0 && discountReceived > 0;
      return {
        isValid,
        steps: [
          {
            label: 'Rule: Cash Discount Received is an Income/Gain',
            note: 'When paying a creditor less than the book debt in full settlement, the creditor is debited for the full debt, Cash is credited for the amount paid, and Discount Received Account is credited.',
          },
          {
            label: `Calculate Discount Received: ${cashDiscountPct}% of ${formatINR(dueAmount)} = ${formatINR(discountReceived)}`,
            formula: `\\text{Discount} = ${formatINR(dueAmount)} \\times ${cashDiscountPct}\\% = ${formatINR(discountReceived)}`,
            value: discountReceived,
          },
          {
            label: `Cash Paid = ${formatINR(dueAmount)} - ${formatINR(discountReceived)} = ${formatINR(cashPaid)}`,
            value: cashPaid,
          },
          {
            label: `Journal Entry: Dr. ${creditorName} A/c ${formatINR(dueAmount)} | Cr. Cash A/c ${formatINR(cashPaid)} | Cr. Discount Received A/c ${formatINR(discountReceived)}`,
          },
        ],
        answer: {
          debitAccount: `${creditorName} Account`,
          debitAmount: dueAmount,
          creditAccount1: 'Cash Account',
          creditAmount1: cashPaid,
          creditAccount2: 'Discount Received Account',
          creditAmount2: discountReceived,
          debitTotal: dueAmount,
          creditTotal: cashPaid + discountReceived,
          cashPaid,
          discountReceived,
          narration: `Being cash paid to ${creditorName} and discount received`,
        },
      };
    };

    return {
      params: { dueAmount, cashDiscountPct, creditorName, cashPaid, discountReceived },
      textKey,
      textParams,
      solver,
      hintKey: 'Debit the creditor with the full debt discharged ({dueAmountStr}). Credit Cash for cash paid, and Credit Discount Received for the rebate.',
      mistakeKey: 'Discount Received is an income (nominal account) and must be credited, not debited.',
    };
  },
};

// ── 5. S1-JNL-FIXEDASSET-01: Purchase of Fixed Asset (Cash + Cheque) ──
export const S1_JNL_FIXEDASSET_01: ProblemTemplate = {
  id: 'S1-JNL-FIXEDASSET-01',
  topicIds: ['S1-U2-T07', 'S1-U2-T08'],
  semId: 1,
  difficulty: 2,
  marks: 2,
  type: 'journal',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'assetName', type: 'choice', choices: ['Machinery', 'Office Furniture', 'Delivery Van'] },
  ],
  generate: (rng) => {
    const assetName = randFrom(rng, ['Machinery', 'Office Furniture', 'Delivery Van'] as const);
    const totalCost = randRound(rng, 30000, 150000, 2000);
    const cashPart = randRound(rng, 10000, Math.floor(totalCost * 0.5), 1000);
    const bankPart = totalCost - cashPart;

    const textKey =
      'Purchased {assetName} for {totalCostStr}. Paid {cashPartStr} immediately in cash and issued a bank cheque for the remaining balance {bankPartStr}.';

    const textParams = {
      assetName,
      totalCostStr: formatINR(totalCost),
      cashPartStr: formatINR(cashPart),
      bankPartStr: formatINR(bankPart),
    };

    const solver = () => {
      const isValid = cashPart + bankPart === totalCost && totalCost > 0;
      return {
        isValid,
        steps: [
          {
            label: 'Rule: Fixed assets must be debited to their specific Asset Account, NOT to Purchases Account',
            note: 'Purchases Account is strictly reserved for goods bought for resale. Capital expenditures are debited to the specific Asset Account.',
          },
          {
            label: `Journal Entry: Dr. ${assetName} Account ${formatINR(totalCost)} | Cr. Cash Account ${formatINR(cashPart)} | Cr. Bank Account ${formatINR(bankPart)}`,
            formula: `\\text{Dr. } ${assetName} \\; ${formatINR(totalCost)} \\quad \\text{to Cash } ${formatINR(cashPart)} \\quad \\text{to Bank } ${formatINR(bankPart)}`,
          },
        ],
        answer: {
          debitAccount: `${assetName} Account`,
          debitAmount: totalCost,
          creditAccount1: 'Cash Account',
          creditAmount1: cashPart,
          creditAccount2: 'Bank Account',
          creditAmount2: bankPart,
          debitTotal: totalCost,
          creditTotal: cashPart + bankPart,
          narration: `Being ${assetName.toLowerCase()} purchased, payment made partly by cash and partly by cheque`,
        },
      };
    };

    return {
      params: { assetName, totalCost, cashPart, bankPart },
      textKey,
      textParams,
      solver,
      hintKey: 'Never debit "Purchases Account" for furniture or machinery. Debit the specific asset name.',
      mistakeKey: 'Debiting Purchases Account for a fixed asset is an Error of Principle.',
    };
  },
};

// ── 6. S1-JNL-DRAWINGS-01: Drawings of Cash & Goods ──────────
export const S1_JNL_DRAWINGS_01: ProblemTemplate = {
  id: 'S1-JNL-DRAWINGS-01',
  topicIds: ['S1-U2-T07', 'S1-U2-T08'],
  semId: 1,
  difficulty: 1,
  marks: 1,
  type: 'journal',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'ownerName', type: 'name' },
  ],
  generate: (rng) => {
    const ownerName = randFrom(rng, BENGALI_NAMES);
    const cashWithdrawn = randRound(rng, 2000, 15000, 500);
    const goodsWithdrawn = randRound(rng, 1000, 10000, 500);
    const totalDrawings = cashWithdrawn + goodsWithdrawn;

    const textKey =
      'Proprietor {ownerName} withdrew {cashWithdrawnStr} in cash and goods costing {goodsWithdrawnStr} from the shop for domestic/personal use.';

    const textParams = {
      ownerName,
      cashWithdrawnStr: formatINR(cashWithdrawn),
      goodsWithdrawnStr: formatINR(goodsWithdrawn),
      totalDrawingsStr: formatINR(totalDrawings),
    };

    const solver = () => {
      const isValid = totalDrawings === cashWithdrawn + goodsWithdrawn && totalDrawings > 0;
      return {
        isValid,
        steps: [
          {
            label: 'Rule: Goods withdrawn for personal use reduce Purchases Account at cost',
            note: 'When goods are taken by the owner, no sale occurs; instead, available purchases are reduced. Hence, Purchases Account is credited at cost price.',
          },
          {
            label: `Journal Entry: Dr. Drawings Account ${formatINR(totalDrawings)} | Cr. Cash Account ${formatINR(cashWithdrawn)} | Cr. Purchases Account ${formatINR(goodsWithdrawn)}`,
            formula: `\\text{Dr. Drawings } ${formatINR(totalDrawings)} \\quad \\text{to Cash } ${formatINR(cashWithdrawn)} \\quad \\text{to Purchases } ${formatINR(goodsWithdrawn)}`,
          },
        ],
        answer: {
          debitAccount: 'Drawings Account',
          debitAmount: totalDrawings,
          creditAccount1: 'Cash Account',
          creditAmount1: cashWithdrawn,
          creditAccount2: 'Purchases Account',
          creditAmount2: goodsWithdrawn,
          debitTotal: totalDrawings,
          creditTotal: cashWithdrawn + goodsWithdrawn,
          narration: `Being cash and goods withdrawn by ${ownerName} for personal use`,
        },
      };
    };

    return {
      params: { ownerName, cashWithdrawn, goodsWithdrawn, totalDrawings },
      textKey,
      textParams,
      solver,
      hintKey: 'When goods are taken for personal use, credit Purchases Account (at cost), never Sales Account.',
      mistakeKey: 'Do not credit Sales Account. Goods taken for domestic consumption are not sales.',
    };
  },
};

// Register all templates in engine
engine.register(S1_JNL_SIMPLE_01);
engine.register(S1_JNL_COMPOUND_01);
engine.register(S1_JNL_CREDIT_01);
engine.register(S1_JNL_CASHDISCOUNT_01);
engine.register(S1_JNL_FIXEDASSET_01);
engine.register(S1_JNL_DRAWINGS_01);
