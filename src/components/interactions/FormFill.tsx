// ============================================================
// ACCOUNTANCY ASSASSIN — Interaction Component: FormFill
// Multi-column editable tabular forms for subsidiary books,
// trial balances, and ledger summaries. Supports partial cell grading.
// ============================================================

import React, { useState } from 'react';
import { parseAmount, formatINR } from '@/lib/format';

export interface FormFillProps {
  title: string; // e.g. "Purchases Book"
  columns: string[];
  rows: { label: string; cells: (number | string | null)[] }[]; // null = blank
  totals?: (number | null)[];
  expectedCells?: Record<string, number | string>; // key: `${rowIndex}-${colIndex}` or `total-${colIndex}`
  onResult: (score: number, maxScore: number, firstAttempt: boolean) => void;
}

export function FormFill({
  title,
  columns,
  rows,
  totals,
  expectedCells = {},
  onResult,
}: FormFillProps) {
  const [cellInputs, setCellInputs] = useState<Record<string, string>>({});
  const [totalInputs, setTotalInputs] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [cellResults, setCellResults] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState(0);

  const handleCellChange = (rIdx: number, cIdx: number, val: string) => {
    if (submitted) return;
    setCellInputs((prev) => ({ ...prev, [`${rIdx}-${cIdx}`]: val }));
  };

  const handleTotalChange = (cIdx: number, val: string) => {
    if (submitted) return;
    setTotalInputs((prev) => ({ ...prev, [cIdx]: val }));
  };

  const handleSubmit = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    let score = 0;
    let maxScore = 0;
    const results: Record<string, boolean> = {};

    // Check blank row cells
    rows.forEach((row, rIdx) => {
      row.cells.forEach((expectedVal, cIdx) => {
        if (expectedVal === null) {
          maxScore++;
          const key = `${rIdx}-${cIdx}`;
          const userVal = cellInputs[key] || '';
          const target = expectedCells[key];

          let isMatch = false;
          if (target !== undefined) {
            if (typeof target === 'number') {
              isMatch = Math.abs(parseAmount(userVal) - target) <= 1;
            } else {
              isMatch = userVal.trim().toLowerCase() === String(target).trim().toLowerCase();
            }
          } else {
            // Default check against parseAmount if user entered something
            isMatch = parseAmount(userVal) > 0;
          }

          results[key] = isMatch;
          if (isMatch) score++;
        }
      });
    });

    // Check blank total cells
    if (totals) {
      totals.forEach((expTotal, cIdx) => {
        if (expTotal !== null && expTotal !== undefined) {
          maxScore++;
          const key = `total-${cIdx}`;
          const userTotal = parseAmount(totalInputs[cIdx]);
          const isMatch = Math.abs(userTotal - expTotal) <= 1;
          results[key] = isMatch;
          if (isMatch) score++;
        }
      });
    }

    if (maxScore === 0) maxScore = 1;

    setCellResults(results);
    setSubmitted(true);
    onResult(score, maxScore, nextAttempts === 1);
  };

  const handleReset = () => {
    setSubmitted(false);
    setCellResults({});
  };

  return (
    <div className="interaction-card form-fill-card" role="region" aria-label={`Accounting Form: ${title}`}>
      <div className="form-fill-header">
        <h3 className="form-fill-title">{title}</h3>
      </div>

      <div className="table-responsive">
        <table className="form-fill-table">
          <thead>
            <tr>
              <th scope="col" className="col-particulars">Particulars / Details</th>
              {columns.map((col, idx) => (
                <th key={idx} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="row-label">{row.label}</td>
                {row.cells.map((cell, cIdx) => {
                  const key = `${rIdx}-${cIdx}`;
                  if (cell !== null) {
                    return (
                      <td key={cIdx} className="tabular-nums cell-static">
                        {typeof cell === 'number' ? formatINR(cell, false) : cell}
                      </td>
                    );
                  }

                  const res = cellResults[key];
                  const stateClass = submitted ? (res ? 'cell-correct' : 'cell-wrong') : '';

                  return (
                    <td key={cIdx} className="cell-editable">
                      <input
                        type="text"
                        className={`tabular-nums form-cell-input ${stateClass}`}
                        placeholder="0"
                        value={cellInputs[key] || ''}
                        onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                        disabled={submitted}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}

            {totals && (
              <tr className="totals-row">
                <td className="totals-label">TOTAL</td>
                {totals.map((tot, cIdx) => {
                  const key = `total-${cIdx}`;
                  if (tot === null) {
                    return <td key={cIdx} className="cell-empty" />;
                  }

                  const res = cellResults[key];
                  const stateClass = submitted ? (res ? 'cell-correct' : 'cell-wrong') : '';

                  return (
                    <td key={cIdx} className="cell-total-input">
                      <input
                        type="text"
                        className={`tabular-nums form-cell-input total-input ${stateClass}`}
                        placeholder="Total"
                        value={totalInputs[cIdx] || ''}
                        onChange={(e) => handleTotalChange(cIdx, e.target.value)}
                        disabled={submitted}
                      />
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="form-fill-actions">
        {!submitted ? (
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Validate Table Calculations
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Re-enter Values
          </button>
        )}
      </div>
    </div>
  );
}

export default FormFill;
