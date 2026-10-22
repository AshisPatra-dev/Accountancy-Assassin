import { createServer } from 'vite';

async function main() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { runAllS1Tests } = await server.ssrLoadModule('./src/data/templates/s1/__tests__/templateTests.ts');
    console.log('Running 1,000 seeds per template across all S1 templates...');
    const report = runAllS1Tests(1000);
    console.log(`\n========================================`);
    console.log(`TEMPLATES TESTED: ${report.totalTemplatesTested}`);
    console.log(`TOTAL SEEDS:     ${report.totalSeedsTested}`);
    console.log(`TOTAL PASSED:    ${report.totalPassed}`);
    console.log(`TOTAL FAILED:    ${report.totalFailed}`);
    console.log(`OVERALL PASS %:  ${report.overallPassRatePct}%`);
    console.log(`========================================\n`);

    for (const r of report.results) {
      console.log(`• ${r.templateId.padEnd(25)} ${r.passed}/${r.totalSeeds} (${r.passRatePct}%) ${r.failed > 0 ? 'FAIL: ' + r.errors.join('; ') : '✓'}`);
    }

    if (report.totalFailed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Error running template tests:', err);
    process.exit(1);
  } finally {
    await server.close();
  }
}

main();
