// ============================================================
// ACCOUNTANCY ASSASSIN — Problem Templates: Bills of Exchange
// S1-BILL-DUEDATE-01, S1-BILL-DUEDATE-02, S1-BILL-DISC-01,
// S1-BILL-ENTRIES-01, S1-BILL-DISHONOUR-01
// Adheres strictly to Negotiable Instruments Act 1881 & WBCHSE rules.
// 3 days of grace on time bills; zero grace on bills at sight.
// ============================================================

import { ProblemTemplate, engine } from '@/lib/templateEngine';
import { randInt, randFrom, randRound } from '@/lib/prng';
import { formatINR, formatDate, addMonths, addDays } from '@/lib/format';

// ── 1. S1-BILL-DUEDATE-01: Time Bill Maturity (with 3 Days Grace) ──
export const S1_BILL_DUEDATE_01: ProblemTemplate = {
  id: 'S1-BILL-DUEDATE-01',
  topicIds: ['S1-U4-T02'],
  semId: 1,
  difficulty: 1,
  marks: 1,
  type: 'calc',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'termType', type: 'choice', choices: ['months', 'days'] },
    { name: 'termValue', type: 'int', min: 1, max: 4 },
  ],
  generate: (rng) => {
    // Generate clean base date in 2025
    const month = randInt(rng, 0, 7); // Jan to Aug
    const day = randInt(rng, 1, 20); // 1 to 20 to avoid month overflow
    const billDate = new Date(2025, month, day);

    const termType = randFrom(rng, ['months', 'days'] as const);
    let nominalDueDate: Date;
    let maturityDate: Date;
    let termText = '';

    if (termType === 'months') {
      const monthsCount = randFrom(rng, [1, 2, 3]);
      termText = `${monthsCount} month${monthsCount > 1 ? 's' : ''}`;
      nominalDueDate = addMonths(billDate, monthsCount);
      maturityDate = addDays(nominalDueDate, 3);
    } else {
      const daysCount = randFrom(rng, [30, 60, 90]);
      termText = `${daysCount} days`;
      nominalDueDate = addDays(billDate, daysCount);
      maturityDate = addDays(nominalDueDate, 3);
    }

    const billDateStr = formatDate(billDate);
    const nominalDateStr = formatDate(nominalDueDate);
    const maturityDateStr = formatDate(maturityDate);

    const textKey =
      'A bill of exchange is drawn on {billDateStr} with a term of {termText} after date. Determine the date of maturity allowing the statutory days of grace.';

    const textParams = {
      billDateStr,
      termText,
      nominalDateStr,
      maturityDateStr,
    };

    const solver = () => {
      const isValid = maturityDate.getTime() > billDate.getTime();
      return {
        isValid,
        steps: [
          {
            label: 'Rule: 3 Days of Grace (Section 22, Negotiable Instruments Act 1881)',
            note: 'Every promissory note or bill of exchange not expressed to be payable on demand or at sight is at maturity on the third day after the day on which it is expressed to be payable.',
          },
          {
            label: `Nominal Due Date = ${billDateStr} + ${termText} = ${nominalDateStr}`,
            formula: `\\text{Nominal Due Date} = ${nominalDateStr}`,
          },
          {
            label: `Add 3 Days of Grace: ${nominalDateStr} + 3 days = ${maturityDateStr}`,
            formula: `\\text{Maturity Date} = ${maturityDateStr}`,
          },
        ],
        answer: {
          maturityDate: maturityDateStr,
          targetValue: maturityDateStr,
          nominalDueDate: nominalDateStr,
          graceDays: 3,
        },
      };
    };

    return {
      params: { billDate: billDateStr, termText, maturityDate: maturityDateStr },
      textKey,
      textParams,
      solver,
      hintKey: 'First find the nominal date by adding the term, then add exactly 3 days of grace.',
      mistakeKey: 'Do not forget the 3 days of grace. A 2-month bill from Jan 10 matures on March 13, not March 10.',
    };
  },
};

// ── 2. S1-BILL-DUEDATE-02: Bill at Sight (Zero Grace Days) ─────
export const S1_BILL_DUEDATE_02: ProblemTemplate = {
  id: 'S1-BILL-DUEDATE-02',
  topicIds: ['S1-U4-T02'],
  semId: 1,
  difficulty: 1,
  marks: 1,
  type: 'mcq',
  typology: 'remember',
  reviewStatus: 'reviewed',
  parameters: [],
  generate: (rng) => {
    const drawee = randFrom(rng, ['Pradeep Roy', 'Nirmal Ghosh', 'Tapan Das', 'Goutam Dey']);
    const date = new Date(2025, randInt(rng, 1, 9), randInt(rng, 5, 25));
    const dateStr = formatDate(date);

    const textKey =
      'A bill of exchange payable "at sight" is presented to {drawee} for payment on {dateStr}. How many days of grace are allowed, and when is the bill due for payment?';

    const textParams = {
      drawee,
      dateStr,
    };

    const solver = () => {
      return {
        isValid: true,
        steps: [
          {
            label: 'Rule: No Grace Days for Demand / At Sight Bills',
            note: 'Under Section 22 of the Negotiable Instruments Act 1881, no days of grace are allowed on bills payable at sight, on presentment, or on demand. They are due immediately upon presentation.',
          },
        ],
        answer: {
          graceDays: 0,
          dueOn: dateStr,
          targetValue: 'Zero grace days; due immediately on presentation',
        },
      };
    };

    return {
      params: { drawee, dateStr },
      textKey,
      textParams,
      solver,
      hintKey: 'Bills payable "at sight" or "on demand" carry 0 days of grace.',
      mistakeKey: 'Grace days apply only to time bills (after date / after sight), never to bills payable at sight.',
    };
  },
};

// ── 3. S1-BILL-DISC-01: Discounting Bill with Bank ────────────
export const S1_BILL_DISC_01: ProblemTemplate = {
  id: 'S1-BILL-DISC-01',
  topicIds: ['S1-U4-T03', 'S1-U4-T05'],
  semId: 1,
  difficulty: 2,
  marks: 2,
  type: 'calc',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'faceValue', type: 'int', min: 10000, max: 100000, step: 5000 },
    { name: 'discountRate', type: 'int', min: 10, max: 15, step: 1 },
    { name: 'unexpiredDays', type: 'choice', choices: ['73', '146', '219'] },
  ],
  generate: (rng) => {
    const faceValue = randRound(rng, 20000, 100000, 5000);
    const discountRate = randFrom(rng, [10, 12, 15]);
    // 73 days = 1/5 yr, 146 days = 2/5 yr, 219 days = 3/5 yr for exact division
    const unexpiredDays = randFrom(rng, [73, 146]);

    const discountAmount = Math.round((faceValue * discountRate * unexpiredDays) / (100 * 365));
    const netProceeds = faceValue - discountAmount;

    const textKey =
      'A merchant holds a bill of exchange of face value {faceValueStr}. The bill is discounted with the bank at {discountRate}% per annum, {unexpiredDays} days before its maturity. Calculate the Bank Discount and the Net Proceeds credited to the merchant\'s account.';

    const textParams = {
      faceValueStr: formatINR(faceValue),
      discountRate,
      unexpiredDays,
      discountAmountStr: formatINR(discountAmount),
      netProceedsStr: formatINR(netProceeds),
    };

    const solver = () => {
      const isValid = netProceeds > 0 && discountAmount > 0 && faceValue > discountAmount;
      return {
        isValid,
        steps: [
          {
            label: 'Formula for Bank Discounting',
            formula: '\\text{Bank Discount} = \\text{Face Value} \\times \\frac{\\text{Rate}}{100} \\times \\frac{\\text{Unexpired Days}}{365}',
            note: 'The bank charges interest for the unexpired duration of the bill.',
          },
          {
            label: `Calculate Discount: ${formatINR(faceValue)} × ${discountRate}% × ${unexpiredDays}/365 = ${formatINR(discountAmount)}`,
            formula: `\\text{Discount} = ${formatINR(faceValue)} \\times \\frac{${discountRate}}{100} \\times \\frac{${unexpiredDays}}{365} = ${formatINR(discountAmount)}`,
            value: discountAmount,
          },
          {
            label: `Calculate Net Proceeds: ${formatINR(faceValue)} - ${formatINR(discountAmount)} = ${formatINR(netProceeds)}`,
            formula: `\\text{Net Proceeds} = \\text{Face Value} - \\text{Discount} = ${formatINR(netProceeds)}`,
            value: netProceeds,
          },
        ],
        answer: {
          discountAmount,
          netProceeds,
          targetValue: netProceeds,
        },
      };
    };

    return {
      params: { faceValue, discountRate, unexpiredDays, discountAmount, netProceeds },
      textKey,
      textParams,
      solver,
      hintKey: 'Bank Discount = Face Value × Rate% × (Days / 365). Net Proceeds = Face Value - Discount.',
      mistakeKey: 'Do not forget the time factor (days/365). The discount rate is per annum.',
    };
  },
};

// ── 4. S1-BILL-ENTRIES-01: Complete Bill Cycle (Honoured) ─────
export const S1_BILL_ENTRIES_01: ProblemTemplate = {
  id: 'S1-BILL-ENTRIES-01',
  topicIds: ['S1-U4-T04'],
  semId: 1,
  difficulty: 2,
  marks: 3,
  type: 'journal',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'amount', type: 'int', min: 10000, max: 60000, step: 2000 },
  ],
  generate: (rng) => {
    const drawer = 'Sunil';
    const drawee = 'Alok';
    const amount = randRound(rng, 10000, 60000, 2000);

    const textKey =
      '{drawer} sells goods to {drawee} for {amountStr} and draws a 3-month bill on {drawee}. {drawee} accepts the bill and returns it. On maturity, the bill is duly honoured by {drawee}. State the journal entries in the books of {drawer} (Drawer).';

    const textParams = {
      drawer,
      drawee,
      amountStr: formatINR(amount),
    };

    const solver = () => {
      const isValid = amount > 0;
      return {
        isValid,
        steps: [
          {
            label: 'Entry 1: Sale of goods on credit',
            formula: `\\text{Dr. } ${drawee} \\; ${formatINR(amount)} \\quad \\text{to Sales A/c } ${formatINR(amount)}`,
          },
          {
            label: 'Entry 2: Receiving the accepted bill',
            formula: `\\text{Dr. Bills Receivable A/c } ${formatINR(amount)} \\quad \\text{to } ${drawee} \\; ${formatINR(amount)}`,
          },
          {
            label: 'Entry 3: Bill honoured on maturity',
            formula: `\\text{Dr. Bank / Cash A/c } ${formatINR(amount)} \\quad \\text{to Bills Receivable A/c } ${formatINR(amount)}`,
            value: amount,
          },
        ],
        answer: {
          debitTotal: amount * 3,
          creditTotal: amount * 3,
          billAmount: amount,
          targetValue: amount,
        },
      };
    };

    return {
      params: { drawer, drawee, amount },
      textKey,
      textParams,
      solver,
      hintKey: 'In drawer\'s books: (1) Drawee Dr to Sales, (2) B/R Dr to Drawee, (3) Cash/Bank Dr to B/R.',
      mistakeKey: 'When the bill is honoured, credit Bills Receivable Account, not Drawee (Drawee\'s personal account was already credited when bill was received).',
    };
  },
};

// ── 5. S1-BILL-DISHONOUR-01: Bill Dishonoured with Noting Charges ──
export const S1_BILL_DISHONOUR_01: ProblemTemplate = {
  id: 'S1-BILL-DISHONOUR-01',
  topicIds: ['S1-U4-T07'],
  semId: 1,
  difficulty: 3,
  marks: 3,
  type: 'journal',
  typology: 'analyse',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'faceValue', type: 'int', min: 10000, max: 50000, step: 2000 },
    { name: 'notingCharges', type: 'int', min: 100, max: 500, step: 50 },
  ],
  generate: (rng) => {
    const drawer = 'Ramesh';
    const drawee = 'Bikash';
    const faceValue = randRound(rng, 10000, 50000, 2000);
    const notingCharges = randRound(rng, 100, 500, 50);
    const totalRecoverable = faceValue + notingCharges;

    const textKey =
      '{drawer} holds a bill of exchange for {faceValueStr} accepted by {drawee}. On maturity, the bill is dishonoured. {drawer} pays {notingChargesStr} in cash as noting charges to the Notary Public. Give the journal entry in {drawer}\'s books upon dishonour.';

    const textParams = {
      drawer,
      drawee,
      faceValueStr: formatINR(faceValue),
      notingChargesStr: formatINR(notingCharges),
      totalRecoverableStr: formatINR(totalRecoverable),
    };

    const solver = () => {
      const isValid = faceValue > 0 && notingCharges > 0 && totalRecoverable === faceValue + notingCharges;
      return {
        isValid,
        steps: [
          {
            label: 'Rule: Dishonour and Recovery of Noting Charges',
            note: 'On dishonour, the Drawee is again debited for the full amount (face value + noting charges paid). Bills Receivable is credited for the face value, and Cash is credited for the noting charges disbursed.',
          },
          {
            label: `Journal Entry in ${drawer}'s Books:`,
            formula: `\\text{Dr. } ${drawee} \\; ${formatINR(totalRecoverable)} \\quad \\text{to B/R } ${formatINR(faceValue)} \\quad \\text{to Cash } ${formatINR(notingCharges)}`,
            value: totalRecoverable,
          },
        ],
        answer: {
          debitAccount: `${drawee} Account`,
          debitAmount: totalRecoverable,
          creditAccount1: 'Bills Receivable Account',
          creditAmount1: faceValue,
          creditAccount2: 'Cash Account',
          creditAmount2: notingCharges,
          debitTotal: totalRecoverable,
          creditTotal: faceValue + notingCharges,
          targetValue: totalRecoverable,
        },
      };
    };

    return {
      params: { drawer, drawee, faceValue, notingCharges, totalRecoverable },
      textKey,
      textParams,
      solver,
      hintKey: 'Debit Drawee for the full amount (Bill + Noting Charges). Credit B/R for face value, Credit Cash for noting charges.',
      mistakeKey: 'In the drawer\'s books, noting charges are NOT debited to "Noting Charges Account". They are charged directly to the defaulting drawee.',
    };
  },
};

// Register all templates in engine
engine.register(S1_BILL_DUEDATE_01);
engine.register(S1_BILL_DUEDATE_02);
engine.register(S1_BILL_DISC_01);
engine.register(S1_BILL_ENTRIES_01);
engine.register(S1_BILL_DISHONOUR_01);
