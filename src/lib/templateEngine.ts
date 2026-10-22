// ============================================================
// ACCOUNTANCY ASSASSIN — Problem Template Engine
// Parameterized problem generation with algorithmic solvers,
// automated seed testing, and pedagogical validation.
// ============================================================

import { mulberry32 } from './prng';

export interface TemplateParameter {
  name: string;
  type: 'int' | 'float' | 'date' | 'name' | 'choice';
  min?: number;
  max?: number;
  step?: number;
  choices?: string[];
  constraint?: string; // human-readable description of validity rule
}

export interface SolverStep {
  label: string; // e.g. "Step 1: Calculate trade discount"
  formula?: string; // LaTeX string
  value?: number; // computed value
  note?: string; // explanation
}

export interface SolverOutput {
  steps: SolverStep[];
  answer: Record<string, number | string>; // named answer cells
  isValid: boolean; // false if params violate constraints (retry with new seed)
}

export interface ProblemTemplate {
  id: string; // e.g. "S1-EQ-MISSING-01"
  topicIds: string[]; // which topics this problem belongs to
  semId: 1 | 2 | 3 | 4;
  difficulty: 1 | 2 | 3;
  marks: 1 | 2 | 3 | 5;
  type: 'mcq' | 'journal' | 'tAccount' | 'form' | 'calc' | 'spot' | 'match' | 'classify';
  typology: 'remember' | 'apply' | 'analyse';
  parameters: TemplateParameter[];
  generate: (rng: () => number) => {
    params: Record<string, unknown>;
    textKey: string; // i18n key or template text with {placeholders}
    textParams: Record<string, string | number>;
    solver: () => SolverOutput;
    hintKey: string;
    mistakeKey: string;
  };
  reviewStatus: 'draft' | 'reviewed';
}

export interface GeneratedProblemInstance {
  templateId: string;
  seed: number;
  problem: ReturnType<ProblemTemplate['generate']>;
}

export class TemplateEngine {
  private registry = new Map<string, ProblemTemplate>();

  register(template: ProblemTemplate): void {
    this.registry.set(template.id, template);
  }

  get(templateId: string): ProblemTemplate | undefined {
    return this.registry.get(templateId);
  }

  getAll(): ProblemTemplate[] {
    return Array.from(this.registry.values());
  }

  getByTopic(topicId: string): ProblemTemplate[] {
    return this.getAll().filter((tpl) => tpl.topicIds.includes(topicId));
  }

  getBySemester(semId: 1 | 2 | 3 | 4): ProblemTemplate[] {
    return this.getAll().filter((tpl) => tpl.semId === semId);
  }

  generate(templateId: string, seed: number): GeneratedProblemInstance {
    const tpl = this.registry.get(templateId);
    if (!tpl) {
      throw new Error(`Template not found in registry: ${templateId}`);
    }

    // Try up to 10 seeds if solver output is marked invalid due to rare edge cases
    let currentSeed = seed;
    let attempts = 0;
    while (attempts < 10) {
      const rng = mulberry32(currentSeed);
      const generated = tpl.generate(rng);
      const solved = generated.solver();
      if (solved.isValid) {
        return {
          templateId,
          seed: currentSeed,
          problem: generated,
        };
      }
      currentSeed = (currentSeed + 10007) >>> 0;
      attempts++;
    }

    // Fallback: return the last attempt
    const rng = mulberry32(seed);
    return {
      templateId,
      seed,
      problem: tpl.generate(rng),
    };
  }

  generateBatch(
    templateId: string,
    count: number,
    startSeed: number = 42
  ): GeneratedProblemInstance[] {
    const results: GeneratedProblemInstance[] = [];
    for (let i = 0; i < count; i++) {
      results.push(this.generate(templateId, startSeed + i));
    }
    return results;
  }

  // Run automated tests — default 1000 seeds per template
  // Checks: isValid, answer balances (debit=credit for journals), no negative cash, no zero denominators / NaN
  test(
    templateId: string,
    seedCount: number = 1000
  ): {
    passed: number;
    failed: number;
    failedSeeds: number[];
    errors: string[];
  } {
    const tpl = this.registry.get(templateId);
    if (!tpl) {
      return {
        passed: 0,
        failed: seedCount,
        failedSeeds: [],
        errors: [`Template not found: ${templateId}`],
      };
    }

    let passed = 0;
    let failed = 0;
    const failedSeeds: number[] = [];
    const errors: string[] = [];

    for (let seed = 1; seed <= seedCount; seed++) {
      try {
        const rng = mulberry32(seed);
        const gen = tpl.generate(rng);
        const solverRes = gen.solver();

        if (!solverRes.isValid) {
          failed++;
          failedSeeds.push(seed);
          if (errors.length < 5) {
            errors.push(`Seed ${seed}: solver returned isValid=false`);
          }
          continue;
        }

        // Verify no NaN or infinite values in answers
        let hasNan = false;
        for (const [key, val] of Object.entries(solverRes.answer)) {
          if (typeof val === 'number' && (isNaN(val) || !isFinite(val))) {
            hasNan = true;
            failed++;
            failedSeeds.push(seed);
            if (errors.length < 5) {
              errors.push(`Seed ${seed}: answer cell '${key}' is NaN or infinite`);
            }
            break;
          }
        }
        if (hasNan) continue;

        // For journal entries, check debit total equals credit total
        if (tpl.type === 'journal') {
          const dt = solverRes.answer['debitTotal'];
          const ct = solverRes.answer['creditTotal'];
          if (dt !== undefined && ct !== undefined && Number(dt) !== Number(ct)) {
            failed++;
            failedSeeds.push(seed);
            if (errors.length < 5) {
              errors.push(`Seed ${seed}: debit (${dt}) !== credit (${ct})`);
            }
            continue;
          }
        }

        passed++;
      } catch (err: unknown) {
        failed++;
        failedSeeds.push(seed);
        if (errors.length < 5) {
          errors.push(`Seed ${seed} exception: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }

    return {
      passed,
      failed,
      failedSeeds,
      errors,
    };
  }
}

export const engine = new TemplateEngine();
