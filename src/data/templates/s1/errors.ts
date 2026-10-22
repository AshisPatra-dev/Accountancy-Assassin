// ============================================================
// ACCOUNTANCY ASSASSIN — Problem Templates: Accounting Errors
// S1-ERR-CLASSIFY-01 (Classification of Errors)
// S1-ERR-RECTIFY-01 (Rectification Journal Entries)
// Omission, Commission, Principle, Compensating Errors.
// ============================================================

import { ProblemTemplate, engine } from '@/lib/templateEngine';
import { randInt, randFrom, randRound } from '@/lib/prng';
import { formatINR } from '@/lib/format';

export interface ErrorScenario {
  description: string;
  category: 'Omission' | 'Commission' | 'Principle' | 'Compensating';
  explanation: string;
}

const ERROR_SCENARIOS: ErrorScenario[] = [
  {
    description: 'Credit purchase of raw materials worth {amtStr} was completely omitted from the Purchases Book.',
    category: 'Omission',
    explanation: 'A transaction that is completely left out of the books of original entry is an Error of Complete Omission.',
  },
  {
    description: 'Wages of {amtStr} paid for the installation of new machinery was debited to Wages Account.',
    category: 'Principle',
    explanation: 'Treating capital expenditure as revenue expenditure violates accounting principles, constituting an Error of Principle.',
  },
  {
    description: 'Purchases of goods worth {amtStr} from Ghosh Traders was entered in the Purchases Book as {wrongAmtStr}.',
    category: 'Commission',
    explanation: 'Writing an incorrect figure in a book of original entry is a clerical Error of Commission.',
  },
  {
    description: 'Cash received from Mohan {amtStr} was posted to the credit of Sohan\'s account.',
    category: 'Commission',
    explanation: 'Posting to the wrong personal account on the correct side is an Error of Commission.',
  },
  {
    description: 'An undercasting of ₹500 in the Sales Book is counterbalanced by an undercasting of ₹500 in the Purchases Return Book.',
    category: 'Compensating',
    explanation: 'When one mistake neutralizes the effect of another independent mistake, it is a Compensating Error.',
  },
  {
    description: 'Purchase of office furniture for {amtStr} was entered into the Purchases Book.',
    category: 'Principle',
    explanation: 'Entering a fixed asset purchase in the Purchases Book (reserved for resale goods) is an Error of Principle.',
  },
];

// ── 1. S1-ERR-CLASSIFY-01: Classify Error ─────────────────────
export const S1_ERR_CLASSIFY_01: ProblemTemplate = {
  id: 'S1-ERR-CLASSIFY-01',
  topicIds: ['S1-U2-T14'],
  semId: 1,
  difficulty: 1,
  marks: 1,
  type: 'classify',
  typology: 'remember',
  reviewStatus: 'reviewed',
  parameters: [],
  generate: (rng) => {
    const sc = randFrom(rng, ERROR_SCENARIOS);
    const amt = randRound(rng, 2000, 25000, 500);
    const wrongAmt = amt - 500;

    const formattedDesc = sc.description
      .replace('{amtStr}', formatINR(amt))
      .replace('{wrongAmtStr}', formatINR(wrongAmt));

    const textKey =
      'Classify the following accounting error: "{errorDescription}"';

    const textParams = {
      errorDescription: formattedDesc,
      category: sc.category,
    };

    const solver = () => {
      return {
        isValid: true,
        steps: [
          {
            label: `Error Classification: Error of ${sc.category}`,
            note: sc.explanation,
          },
        ],
        answer: {
          category: sc.category,
          targetValue: sc.category,
        },
      };
    };

    return {
      params: { description: formattedDesc, category: sc.category },
      textKey,
      textParams,
      solver,
      hintKey: 'Check whether the error is a clerical slip (commission), total omission, or fundamental rule violation (principle).',
      mistakeKey: 'Confusing Error of Principle with Error of Commission: Principle involves capital vs revenue distinction.',
    };
  },
};

// ── 2. S1-ERR-RECTIFY-01: Rectifying Journal Entry ────────────
export const S1_ERR_RECTIFY_01: ProblemTemplate = {
  id: 'S1-ERR-RECTIFY-01',
  topicIds: ['S1-U2-T15'],
  semId: 1,
  difficulty: 2,
  marks: 2,
  type: 'journal',
  typology: 'analyse',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'amount', type: 'int', min: 2000, max: 40000, step: 1000 },
    { name: 'type', type: 'choice', choices: ['machinery_wages', 'furniture_purchases', 'wrong_account'] },
  ],
  generate: (rng) => {
    const amount = randRound(rng, 2000, 40000, 1000);
    const caseType = randFrom(rng, ['machinery_wages', 'furniture_purchases', 'wrong_account'] as const);

    let textKey = '';
    let debitAccount = '';
    let creditAccount = '';
    let wrongEntryDesc = '';
    let correctEntryDesc = '';

    if (caseType === 'machinery_wages') {
      textKey = 'Wages of {amountStr} paid for installing new machinery was wrongly debited to Wages Account. Give the rectifying journal entry.';
      debitAccount = 'Machinery Account';
      creditAccount = 'Wages Account';
      wrongEntryDesc = `Dr. Wages A/c ${formatINR(amount)}, Cr. Cash A/c ${formatINR(amount)}`;
      correctEntryDesc = `Dr. Machinery A/c ${formatINR(amount)}, Cr. Cash A/c ${formatINR(amount)}`;
    } else if (caseType === 'furniture_purchases') {
      textKey = 'Purchased office furniture for {amountStr} from Roy & Co., but wrongly passed through the Purchases Book. Pass the rectifying entry.';
      debitAccount = 'Furniture Account';
      creditAccount = 'Purchases Account';
      wrongEntryDesc = `Dr. Purchases A/c ${formatINR(amount)}, Cr. Roy & Co. ${formatINR(amount)}`;
      correctEntryDesc = `Dr. Furniture A/c ${formatINR(amount)}, Cr. Roy & Co. ${formatINR(amount)}`;
    } else {
      textKey = 'Goods of {amountStr} sold on credit to Ramesh was wrongly debited to Rajesh\'s account. Give the rectifying entry.';
      debitAccount = 'Ramesh Account';
      creditAccount = 'Rajesh Account';
      wrongEntryDesc = `Dr. Rajesh ${formatINR(amount)}, Cr. Sales A/c ${formatINR(amount)}`;
      correctEntryDesc = `Dr. Ramesh ${formatINR(amount)}, Cr. Sales A/c ${formatINR(amount)}`;
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
            label: '1. What was the WRONG entry recorded?',
            note: wrongEntryDesc,
          },
          {
            label: '2. What was the CORRECT entry that should have been made?',
            note: correctEntryDesc,
          },
          {
            label: `3. Rectification: Debit ${debitAccount} ${formatINR(amount)}, Credit ${creditAccount} ${formatINR(amount)}`,
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
          targetValue: amount,
          narration: 'Being rectification of wrong debit',
        },
      };
    };

    return {
      params: { amount, caseType, debitAccount, creditAccount },
      textKey,
      textParams,
      solver,
      hintKey: 'Reverse the wrong account that was wrongly debited/credited, and give debit/credit to the true account.',
      mistakeKey: 'Do not touch the account that was correctly recorded (e.g. Cash or Creditor). Only rectify the wrong leg.',
    };
  },
};

// Register all templates in engine
engine.register(S1_ERR_CLASSIFY_01);
engine.register(S1_ERR_RECTIFY_01);
