// ============================================================
// ACCOUNTANCY ASSASSIN — Problem Templates: Accounting Equation
// S1-EQ-MISSING-01, S1-EQ-MISSING-02, S1-EQ-TXSEQ-01
// Rigorous algorithmic solvers verifying Assets = Capital + Liabilities.
// ============================================================

import { ProblemTemplate, engine } from '@/lib/templateEngine';
import { randInt, randFrom, randRound } from '@/lib/prng';
import { formatINR } from '@/lib/format';

export const BENGALI_NAMES = [
  'Rahim',
  'Karim',
  'Supriya',
  'Mohan',
  'Fatema',
  'Arjun',
  'Priya',
  'Ratan',
  'Sita',
  'Anwar',
] as const;

export const BUSINESS_TYPES = [
  'tea stall',
  'kirana shop',
  'tailor shop',
  'school canteen',
  'pharmacy',
] as const;

// ── 1. S1-EQ-MISSING-01: Basic Equation Missing Figure ───────
export const S1_EQ_MISSING_01: ProblemTemplate = {
  id: 'S1-EQ-MISSING-01',
  topicIds: ['S1-U2-T02', 'S1-U2-T03'],
  semId: 1,
  difficulty: 1,
  marks: 1,
  type: 'calc',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'ownerName', type: 'name' },
    { name: 'businessType', type: 'choice', choices: [...BUSINESS_TYPES] },
    { name: 'missingVariable', type: 'choice', choices: ['assets', 'liabilities', 'capital'] },
    { name: 'capital', type: 'int', min: 10000, max: 300000, step: 1000 },
    { name: 'liabilities', type: 'int', min: 5000, max: 200000, step: 1000 },
  ],
  generate: (rng) => {
    const ownerName = randFrom(rng, BENGALI_NAMES);
    const businessType = randFrom(rng, BUSINESS_TYPES);
    const capital = randRound(rng, 20000, 300000, 1000);
    const liabilities = randRound(rng, 5000, 200000, 1000);
    const assets = capital + liabilities;
    const missingVariable = randFrom(rng, ['assets', 'liabilities', 'capital'] as const);

    const textKey =
      missingVariable === 'assets'
        ? '{ownerName} operates a {businessType}. The business has Capital of {capitalStr} and Liabilities of {liabilitiesStr}. Compute the Total Assets of the business.'
        : missingVariable === 'capital'
        ? '{ownerName} operates a {businessType}. The Total Assets are {assetsStr} and outside Liabilities are {liabilitiesStr}. Compute the Capital of {ownerName}.'
        : '{ownerName} operates a {businessType}. Total Assets are {assetsStr} and Capital is {capitalStr}. Compute the outside Liabilities of the enterprise.';

    const textParams = {
      ownerName,
      businessType,
      assetsStr: formatINR(assets),
      capitalStr: formatINR(capital),
      liabilitiesStr: formatINR(liabilities),
    };

    const solver = () => {
      let missingValue = 0;
      let formula = '';
      let label = '';

      if (missingVariable === 'assets') {
        missingValue = capital + liabilities;
        formula = '\\text{Assets} = \\text{Capital} + \\text{Liabilities}';
        label = `Step 1: Assets = ${formatINR(capital)} + ${formatINR(liabilities)} = ${formatINR(missingValue)}`;
      } else if (missingVariable === 'capital') {
        missingValue = assets - liabilities;
        formula = '\\text{Capital} = \\text{Assets} - \\text{Liabilities}';
        label = `Step 1: Capital = ${formatINR(assets)} - ${formatINR(liabilities)} = ${formatINR(missingValue)}`;
      } else {
        missingValue = assets - capital;
        formula = '\\text{Liabilities} = \\text{Assets} - \\text{Capital}';
        label = `Step 1: Liabilities = ${formatINR(assets)} - ${formatINR(capital)} = ${formatINR(missingValue)}`;
      }

      const isValid = assets >= 0 && capital >= 0 && liabilities >= 0 && assets === capital + liabilities;

      return {
        isValid,
        steps: [
          {
            label: 'The Fundamental Accounting Equation: Assets = Capital + Liabilities',
            formula: '\\text{Assets} = \\text{Capital} + \\text{Liabilities}',
            note: 'The total resources owned by a business must always equal the claims against those resources.',
          },
          {
            label,
            formula,
            value: missingValue,
            note: `Therefore, the required ${missingVariable} figure is ${formatINR(missingValue)}.`,
          },
        ],
        answer: {
          [missingVariable]: missingValue,
          targetValue: missingValue,
        },
      };
    };

    return {
      params: { ownerName, businessType, missingVariable, assets, capital, liabilities },
      textKey,
      textParams,
      solver,
      hintKey: 'Recall the fundamental identity: Assets = Capital + Liabilities.',
      mistakeKey: 'Do not add liabilities to assets. Liabilities must be subtracted from assets to find capital.',
    };
  },
};

// ── 2. S1-EQ-MISSING-02: Extended Accounting Equation Missing Figure ──
export const S1_EQ_MISSING_02: ProblemTemplate = {
  id: 'S1-EQ-MISSING-02',
  topicIds: ['S1-U2-T02', 'S1-U2-T03'],
  semId: 1,
  difficulty: 2,
  marks: 2,
  type: 'calc',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'ownerName', type: 'name' },
    { name: 'businessType', type: 'choice', choices: [...BUSINESS_TYPES] },
    { name: 'missingVariable', type: 'choice', choices: ['assets', 'capital', 'drawings', 'profit'] },
  ],
  generate: (rng) => {
    const ownerName = randFrom(rng, BENGALI_NAMES);
    const businessType = randFrom(rng, BUSINESS_TYPES);
    const initialCapital = randRound(rng, 50000, 300000, 5000);
    const revenue = randRound(rng, 20000, 150000, 2000);
    const expenses = randRound(rng, 10000, Math.floor(revenue * 0.75), 1000);
    const profit = revenue - expenses;
    const drawings = randRound(rng, 2000, Math.floor(profit * 0.6), 1000);
    const liabilities = randRound(rng, 10000, 100000, 1000);
    const closingCapital = initialCapital + profit - drawings;
    const assets = liabilities + closingCapital;

    const missingVariable = randFrom(rng, ['assets', 'capital', 'drawings', 'profit'] as const);

    const textKey =
      missingVariable === 'assets'
        ? '{ownerName} started a {businessType} with Capital of {capitalStr}. During the year, Revenue was {revStr}, Expenses were {expStr}, Drawings were {drawStr}, and closing Liabilities stood at {liabStr}. Compute the closing Total Assets.'
        : missingVariable === 'capital'
        ? '{ownerName} operates a {businessType}. At year end, Assets are {assetStr}, Liabilities are {liabStr}, Net Profit earned during the year was {profitStr}, and Drawings amounted to {drawStr}. Compute the Opening Capital.'
        : missingVariable === 'drawings'
        ? 'In {ownerName}\'s {businessType}, Opening Capital was {capitalStr}, Net Profit was {profitStr}, Liabilities were {liabStr}, and closing Assets were {assetStr}. Determine the total Drawings made by {ownerName}.'
        : 'For {ownerName}\'s {businessType}, Opening Capital was {capitalStr}, Drawings were {drawStr}, closing Liabilities were {liabStr}, and closing Assets were {assetStr}. Compute the Net Profit earned during the accounting period.';

    const textParams = {
      ownerName,
      businessType,
      capitalStr: formatINR(initialCapital),
      revStr: formatINR(revenue),
      expStr: formatINR(expenses),
      drawStr: formatINR(drawings),
      liabStr: formatINR(liabilities),
      assetStr: formatINR(assets),
      profitStr: formatINR(profit),
    };

    const solver = () => {
      let targetValue = 0;
      const steps = [];

      if (missingVariable === 'assets') {
        targetValue = assets;
        steps.push({
          label: 'Step 1: Compute Net Profit = Revenue - Expenses',
          formula: `\\text{Net Profit} = ${formatINR(revenue)} - ${formatINR(expenses)} = ${formatINR(profit)}`,
          value: profit,
        });
        steps.push({
          label: 'Step 2: Closing Capital = Opening Capital + Profit - Drawings',
          formula: `\\text{Closing Capital} = ${formatINR(initialCapital)} + ${formatINR(profit)} - ${formatINR(drawings)} = ${formatINR(closingCapital)}`,
          value: closingCapital,
        });
        steps.push({
          label: 'Step 3: Closing Assets = Closing Capital + Liabilities',
          formula: `\\text{Assets} = ${formatINR(closingCapital)} + ${formatINR(liabilities)} = ${formatINR(targetValue)}`,
          value: targetValue,
        });
      } else if (missingVariable === 'capital') {
        targetValue = initialCapital;
        steps.push({
          label: 'Step 1: Compute Closing Capital = Assets - Liabilities',
          formula: `\\text{Closing Capital} = ${formatINR(assets)} - ${formatINR(liabilities)} = ${formatINR(closingCapital)}`,
          value: closingCapital,
        });
        steps.push({
          label: 'Step 2: Opening Capital = Closing Capital - Profit + Drawings',
          formula: `\\text{Opening Capital} = ${formatINR(closingCapital)} - ${formatINR(profit)} + ${formatINR(drawings)} = ${formatINR(targetValue)}`,
          value: targetValue,
        });
      } else if (missingVariable === 'drawings') {
        targetValue = drawings;
        steps.push({
          label: 'Step 1: Compute Closing Capital = Assets - Liabilities',
          formula: `\\text{Closing Capital} = ${formatINR(assets)} - ${formatINR(liabilities)} = ${formatINR(closingCapital)}`,
          value: closingCapital,
        });
        steps.push({
          label: 'Step 2: Drawings = (Opening Capital + Profit) - Closing Capital',
          formula: `\\text{Drawings} = (${formatINR(initialCapital)} + ${formatINR(profit)}) - ${formatINR(closingCapital)} = ${formatINR(targetValue)}`,
          value: targetValue,
        });
      } else {
        targetValue = profit;
        steps.push({
          label: 'Step 1: Compute Closing Capital = Assets - Liabilities',
          formula: `\\text{Closing Capital} = ${formatINR(assets)} - ${formatINR(liabilities)} = ${formatINR(closingCapital)}`,
          value: closingCapital,
        });
        steps.push({
          label: 'Step 2: Profit = Closing Capital + Drawings - Opening Capital',
          formula: `\\text{Profit} = ${formatINR(closingCapital)} + ${formatINR(drawings)} - ${formatINR(initialCapital)} = ${formatINR(targetValue)}`,
          value: targetValue,
        });
      }

      const isValid =
        assets >= 0 &&
        initialCapital >= 0 &&
        liabilities >= 0 &&
        closingCapital >= 0 &&
        drawings >= 0 &&
        profit >= 0 &&
        assets === liabilities + closingCapital;

      return {
        isValid,
        steps,
        answer: {
          [missingVariable]: targetValue,
          targetValue,
        },
      };
    };

    return {
      params: { ownerName, businessType, missingVariable, initialCapital, revenue, expenses, drawings, liabilities, assets },
      textKey,
      textParams,
      solver,
      hintKey: 'Extended Equation: Assets = Liabilities + Opening Capital + (Revenue - Expenses) - Drawings.',
      mistakeKey: 'Remember that Drawings reduce Capital, while Net Profit increases Capital.',
    };
  },
};

// ── 3. S1-EQ-TXSEQ-01: Sequential Transaction Application ────
export const S1_EQ_TXSEQ_01: ProblemTemplate = {
  id: 'S1-EQ-TXSEQ-01',
  topicIds: ['S1-U2-T02', 'S1-U2-T03'],
  semId: 1,
  difficulty: 3,
  marks: 3,
  type: 'calc',
  typology: 'analyse',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'ownerName', type: 'name' },
    { name: 'businessType', type: 'choice', choices: [...BUSINESS_TYPES] },
  ],
  generate: (rng) => {
    const ownerName = randFrom(rng, BENGALI_NAMES);
    const businessType = randFrom(rng, BUSINESS_TYPES);

    // Initial Investment
    const c1 = randRound(rng, 50000, 200000, 5000);
    // Credit purchase of goods
    const goodsCredit = randRound(rng, 15000, 50000, 2000);
    // Cash sale of goods costing goodsCost for salePrice (goodsCost must be <= 70% of goodsCredit)
    const goodsCost = randRound(rng, 4000, Math.floor(goodsCredit * 0.7), 1000);
    const profitMargin = randRound(rng, 2000, 10000, 1000);
    const salePrice = goodsCost + profitMargin;
    // Payment of salary/rent expense
    const expense = randRound(rng, 2000, 10000, 1000);
    // Drawings by proprietor
    const drawings = randRound(rng, 1000, 5000, 500);

    const textKey =
      'Trace the impact on the Accounting Equation for {ownerName}\'s {businessType}:\n' +
      '1. Started business with cash {c1Str}\n' +
      '2. Purchased goods on credit from Ghosh & Co. for {goodsCreditStr}\n' +
      '3. Sold goods costing {goodsCostStr} for cash {salePriceStr}\n' +
      '4. Paid shop expenses of {expenseStr} in cash\n' +
      '5. Withdrew cash of {drawingsStr} for personal use.\n' +
      'Compute the final Total Assets of the business.';

    const textParams = {
      ownerName,
      businessType,
      c1Str: formatINR(c1),
      goodsCreditStr: formatINR(goodsCredit),
      goodsCostStr: formatINR(goodsCost),
      salePriceStr: formatINR(salePrice),
      expenseStr: formatINR(expense),
      drawingsStr: formatINR(drawings),
    };

    const solver = () => {
      // Step 1: Capital cash c1
      let cash = c1;
      let stock = 0;
      let liabilities = 0;
      let capital = c1;

      // Step 2: Credit purchase
      stock += goodsCredit;
      liabilities += goodsCredit;

      // Step 3: Cash sale
      cash += salePrice;
      stock -= goodsCost;
      capital += profitMargin; // profit increases capital

      // Step 4: Expense
      cash -= expense;
      capital -= expense;

      // Step 5: Drawings
      cash -= drawings;
      capital -= drawings;

      const totalAssets = cash + stock;

      const isValid =
        cash >= 0 &&
        stock >= 0 &&
        liabilities >= 0 &&
        capital >= 0 &&
        totalAssets === liabilities + capital;

      return {
        isValid,
        steps: [
          {
            label: 'Transaction 1: Started business with cash',
            note: `Assets (Cash +${formatINR(c1)}) = Liabilities (₹0) + Capital (+${formatINR(c1)})`,
            formula: `\\text{Assets: } ${formatINR(c1)} = \\text{Liabilities: } 0 + \\text{Capital: } ${formatINR(c1)}`,
          },
          {
            label: 'Transaction 2: Credit purchase of stock',
            note: `Assets (Stock +${formatINR(goodsCredit)}) = Liabilities (Creditors +${formatINR(goodsCredit)})`,
            formula: `\\text{Assets: } ${formatINR(c1 + goodsCredit)} = \\text{Liabilities: } ${formatINR(goodsCredit)} + \\text{Capital: } ${formatINR(c1)}`,
          },
          {
            label: 'Transaction 3: Cash sale of goods at profit',
            note: `Cash +${formatINR(salePrice)}, Stock -${formatINR(goodsCost)}, Capital +${formatINR(profitMargin)} (Profit)`,
            formula: `\\text{Assets: } ${formatINR(c1 + goodsCredit + profitMargin)} = \\text{Liabilities: } ${formatINR(goodsCredit)} + \\text{Capital: } ${formatINR(c1 + profitMargin)}`,
          },
          {
            label: 'Transaction 4: Payment of expense',
            note: `Cash -${formatINR(expense)}, Capital -${formatINR(expense)}`,
          },
          {
            label: 'Transaction 5: Cash Drawings for personal use',
            note: `Cash -${formatINR(drawings)}, Capital -${formatINR(drawings)}`,
          },
          {
            label: `Final Equilibrium Verification: Assets = ${formatINR(totalAssets)}, Liabilities = ${formatINR(liabilities)}, Capital = ${formatINR(capital)}`,
            formula: `\\text{Assets (${formatINR(totalAssets)})} = \\text{Liabilities (${formatINR(liabilities)})} + \\text{Capital (${formatINR(capital)})}`,
            value: totalAssets,
          },
        ],
        answer: {
          finalAssets: totalAssets,
          finalCapital: capital,
          finalLiabilities: liabilities,
          finalCash: cash,
          finalStock: stock,
          targetValue: totalAssets,
        },
      };
    };

    return {
      params: { ownerName, businessType, c1, goodsCredit, goodsCost, salePrice, expense, drawings },
      textKey,
      textParams,
      solver,
      hintKey: 'Track Cash and Stock separately. Sales at profit increase Cash, reduce Stock, and increase Capital.',
      mistakeKey: 'Do not forget that profit (Sale price - Cost) belongs to the owner and is added to Capital.',
    };
  },
};

// Register all templates in engine
engine.register(S1_EQ_MISSING_01);
engine.register(S1_EQ_MISSING_02);
engine.register(S1_EQ_TXSEQ_01);
