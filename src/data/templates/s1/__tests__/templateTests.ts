// ============================================================
// ACCOUNTANCY ASSASSIN — Template Engine Automated Unit Tests
// Runs at least 1,000 deterministic seeds per template across S1.
// Validates: isValid === true, debit = credit, positive valuations,
// valid date arithmetic, and no zero denominators.
// ============================================================

import { engine } from '@/lib/templateEngine';
import { S1_TEMPLATE_IDS } from '../index';

export interface TemplateTestSummary {
  templateId: string;
  totalSeeds: number;
  passed: number;
  failed: number;
  passRatePct: number;
  errors: string[];
}

export interface AllTestsReport {
  timestamp: string;
  totalTemplatesTested: number;
  totalSeedsTested: number;
  totalPassed: number;
  totalFailed: number;
  overallPassRatePct: number;
  results: TemplateTestSummary[];
}

/**
 * Runs 1,000 seeds for every registered Semester 1 template and compiles a comprehensive report.
 */
export function runAllS1Tests(seedCountPerTemplate: number = 1000): AllTestsReport {
  const summaries: TemplateTestSummary[] = [];
  let totalSeeds = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const tplId of S1_TEMPLATE_IDS) {
    const testResult = engine.test(tplId, seedCountPerTemplate);
    const passRatePct = Math.round((testResult.passed / seedCountPerTemplate) * 10000) / 100;

    summaries.push({
      templateId: tplId,
      totalSeeds: seedCountPerTemplate,
      passed: testResult.passed,
      failed: testResult.failed,
      passRatePct,
      errors: testResult.errors,
    });

    totalSeeds += seedCountPerTemplate;
    totalPassed += testResult.passed;
    totalFailed += testResult.failed;
  }

  const overallPassRatePct = Math.round((totalPassed / totalSeeds) * 10000) / 100;

  return {
    timestamp: new Date().toISOString(),
    totalTemplatesTested: S1_TEMPLATE_IDS.length,
    totalSeedsTested: totalSeeds,
    totalPassed,
    totalFailed,
    overallPassRatePct,
    results: summaries,
  };
}
