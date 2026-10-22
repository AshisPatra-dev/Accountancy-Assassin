// ============================================================
// ACCOUNTANCY ASSASSIN — Problem Templates: Reserves and Provisions
// S1-RES-CLASSIFY-01 (Classification of Reserves & Provisions)
// S1-RES-PROVISION-01 (Computation of Provision for Doubtful Debts)
// Strict distinction between Charge against Profit and Appropriation.
// ============================================================

import { ProblemTemplate, engine } from '@/lib/templateEngine';
import { randInt, randFrom, randRound } from '@/lib/prng';
import { formatINR } from '@/lib/format';

export interface ReserveScenario {
  description: string;
  classification:
    | 'General Reserve'
    | 'Specific Reserve'
    | 'Capital Reserve'
    | 'Revenue Reserve'
    | 'Secret Reserve'
    | 'Provision';
  explanation: string;
}

const RESERVE_SCENARIOS: ReserveScenario[] = [
  {
    description: 'An amount set aside out of divisible profits for future expansion and strengthening financial position without any specific condition.',
    classification: 'General Reserve',
    explanation: 'A general reserve is a revenue reserve created for general future contingencies and is free for dividend distribution.',
  },
  {
    description: 'An amount appropriated from profit specifically earmarked to redeem debentures upon maturity.',
    classification: 'Specific Reserve',
    explanation: 'A reserve created for a named, predetermined purpose (e.g. Debenture Redemption Reserve) is a Specific Reserve.',
  },
  {
    description: 'Capital profit realized on the sale of an old office building transferred to a reserve.',
    classification: 'Capital Reserve',
    explanation: 'Profits arising from capital transactions (e.g. sale of fixed assets, share premium) form Capital Reserves and cannot be distributed as normal dividends.',
  },
  {
    description: 'An estimated amount charged against profit to provide for a known liability whose exact amount cannot be determined with substantial accuracy.',
    classification: 'Provision',
    explanation: 'A provision is a charge against profit (debit to Profit & Loss Account) to meet a known liability or diminution in asset value.',
  },
  {
    description: 'A reserve created by intentionally writing down fixed assets below their true value or exaggerating liabilities, omitted from the Balance Sheet.',
    classification: 'Secret Reserve',
    explanation: 'A secret reserve is hidden from the balance sheet by undervaluation of assets or overstatement of liabilities.',
  },
  {
    description: 'Retention of normal operating profits earned in the ordinary course of business available for distribution.',
    classification: 'Revenue Reserve',
    explanation: 'Revenue reserves represent retained undistributed trading profits of the company.',
  },
];

// ── 1. S1-RES-CLASSIFY-01: Classification of Reserves ─────────
export const S1_RES_CLASSIFY_01: ProblemTemplate = {
  id: 'S1-RES-CLASSIFY-01',
  topicIds: ['S1-U3-T01', 'S1-U3-T03'],
  semId: 1,
  difficulty: 1,
  marks: 1,
  type: 'classify',
  typology: 'remember',
  reviewStatus: 'reviewed',
  parameters: [],
  generate: (rng) => {
    const sc = randFrom(rng, RESERVE_SCENARIOS);

    const textKey =
      'Identify whether the following is a Provision, General Reserve, Specific Reserve, Capital Reserve, Revenue Reserve, or Secret Reserve:\n"{scenarioDesc}"';

    const textParams = {
      scenarioDesc: sc.description,
      classification: sc.classification,
    };

    const solver = () => {
      return {
        isValid: true,
        steps: [
          {
            label: `Correct Category: ${sc.classification}`,
            note: sc.explanation,
          },
        ],
        answer: {
          classification: sc.classification,
          targetValue: sc.classification,
        },
      };
    };

    return {
      params: { description: sc.description, classification: sc.classification },
      textKey,
      textParams,
      solver,
      hintKey: 'Check whether it is a charge for a known liability (Provision) or an appropriation of profit (Reserve).',
      mistakeKey: 'Provisions are charges against profit; reserves are appropriations of divisible profit.',
    };
  },
};

// ── 2. S1-RES-PROVISION-01: Compute Provision for Bad Debts ──
export const S1_RES_PROVISION_01: ProblemTemplate = {
  id: 'S1-RES-PROVISION-01',
  topicIds: ['S1-U3-T01', 'S1-U3-T02'],
  semId: 1,
  difficulty: 1,
  marks: 1,
  type: 'calc',
  typology: 'apply',
  reviewStatus: 'reviewed',
  parameters: [
    { name: 'grossDebtors', type: 'int', min: 20000, max: 200000, step: 5000 },
    { name: 'provisionRate', type: 'int', min: 5, max: 10, step: 5 },
  ],
  generate: (rng) => {
    const grossDebtors = randRound(rng, 40000, 200000, 5000);
    const furtherBadDebts = randRound(rng, 1000, 5000, 1000);
    const provisionRate = randFrom(rng, [5, 10]);

    const netDebtors = grossDebtors - furtherBadDebts;
    const requiredProvision = Math.round((netDebtors * provisionRate) / 100);

    const textKey =
      'Sundry Debtors on 31st March stand at {grossDebtorsStr}. Further bad debts of {furtherBadDebtsStr} are to be written off. Calculate the Provision for Doubtful Debts to be maintained at {provisionRate}% on net good debtors.';

    const textParams = {
      grossDebtorsStr: formatINR(grossDebtors),
      furtherBadDebtsStr: formatINR(furtherBadDebts),
      provisionRate,
      netDebtorsStr: formatINR(netDebtors),
      requiredProvisionStr: formatINR(requiredProvision),
    };

    const solver = () => {
      const isValid = netDebtors > 0 && requiredProvision > 0 && grossDebtors > furtherBadDebts;
      return {
        isValid,
        steps: [
          {
            label: 'Step 1: Compute Net Debtors after Bad Debts',
            formula: `\\text{Net Debtors} = ${formatINR(grossDebtors)} - ${formatINR(furtherBadDebts)} = ${formatINR(netDebtors)}`,
            value: netDebtors,
            note: 'Further bad debts must be deducted first before calculating provision on remaining debtors.',
          },
          {
            label: `Step 2: Calculate Provision at ${provisionRate}% on Net Debtors`,
            formula: `\\text{Provision} = ${formatINR(netDebtors)} \\times \\frac{${provisionRate}}{100} = ${formatINR(requiredProvision)}`,
            value: requiredProvision,
          },
        ],
        answer: {
          netDebtors,
          requiredProvision,
          targetValue: requiredProvision,
        },
      };
    };

    return {
      params: { grossDebtors, furtherBadDebts, provisionRate, netDebtors, requiredProvision },
      textKey,
      textParams,
      solver,
      hintKey: 'Deduct further bad debts from Sundry Debtors first; calculate the provision percentage on the remaining net balance.',
      mistakeKey: 'Do not calculate provision on gross debtors before deducting further bad debts.',
    };
  },
};

// Register all templates in engine
engine.register(S1_RES_CLASSIFY_01);
engine.register(S1_RES_PROVISION_01);
