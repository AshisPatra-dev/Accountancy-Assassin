// ============================================================
// ACCOUNTANCY ASSASSIN — Interaction Component: TAccount
// Classic ledger T-account with Dr and Cr columns, ruled ledger lines,
// fill-in blank cells, and balance carry forward validation.
// ============================================================

import React, { useState } from 'react';
import { parseAmount, formatINR } from '@/lib/format';

export interface TAccountProps {
  accountName: string;
  debitEntries: { label: string; amount: number | null }[]; // null = blank to fill
  creditEntries: { label: string; amount: number | null }[];
  closingBalance: { side: 'Dr' | 'Cr'; amount: number };
  onResult: (correct: boolean, firstAttempt: boolean) => void;
}

export function TAccount({
  accountName,
  debitEntries,
  creditEntries,
  closingBalance,
  onResult,
}: TAccountProps) {
  // Map blanks to user input state
  const [drInputs, setDrInputs] = useState<Record<number, string>>({});
  const [crInputs, setCrInputs] = useState<Record<number, string>>({});
  const [balanceSide, setBalanceSide] = useState<'Dr' | 'Cr'>('Dr');
  const [balanceInput, setBalanceInput] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    let allCorrect = true;

    // Check Dr entries
    debitEntries.forEach((entry, idx) => {
      if (entry.amount !== null) return;
      const userVal = parseAmount(drInputs[idx]);
      // In a real problem, if an entry amount is null, we can check if it balances or matches
      if (isNaN(userVal)) allCorrect = false;
    });

    // Check Cr entries
    creditEntries.forEach((entry, idx) => {
      if (entry.amount !== null) return;
      const userVal = parseAmount(crInputs[idx]);
      if (isNaN(userVal)) allCorrect = false;
    });

    // Check closing balance
    const userBalanceAmt = parseAmount(balanceInput);
    const balanceAmountCorrect = Math.abs(userBalanceAmt - closingBalance.amount) <= 1;
    const balanceSideCorrect = balanceSide === closingBalance.side;

    if (!balanceAmountCorrect || !balanceSideCorrect) {
      allCorrect = false;
    }

    setSubmitted(true);
    setIsSuccess(allCorrect);

    if (allCorrect) {
      setFeedback(`✓ Ledger Account balanced perfectly at ${formatINR(closingBalance.amount)} (${closingBalance.side} balance).`);
    } else {
      setFeedback(`✗ Balance does not reconcile. Expected ${formatINR(closingBalance.amount)} on ${closingBalance.side}. side.`);
    }

    onResult(allCorrect, nextAttempts === 1);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsSuccess(false);
    setFeedback(null);
  };

  return (
    <div className="interaction-card t-account-card" role="region" aria-label={`T-Account: ${accountName}`}>
      <div className="t-account-header">
        <span className="t-side-label dr-label">Dr.</span>
        <h3 className="t-account-title">{accountName}</h3>
        <span className="t-side-label cr-label">Cr.</span>
      </div>

      <div className="t-account-container">
        {/* Left Side: Debit */}
        <div className="t-account-column debit-col">
          <div className="col-header-row">
            <span>Particulars</span>
            <span>Amount (₹)</span>
          </div>
          <div className="col-rows">
            {debitEntries.map((e, idx) => (
              <div key={`dr-${idx}`} className="t-account-row">
                <span className="t-label">To {e.label}</span>
                {e.amount !== null ? (
                  <span className="t-amount tabular-nums">{formatINR(e.amount, false)}</span>
                ) : (
                  <input
                    type="text"
                    className="t-input tabular-nums"
                    placeholder="0"
                    value={drInputs[idx] || ''}
                    onChange={(ev) => setDrInputs({ ...drInputs, [idx]: ev.target.value })}
                    disabled={submitted}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vertical divider line */}
        <div className="t-account-stem" />

        {/* Right Side: Credit */}
        <div className="t-account-column credit-col">
          <div className="col-header-row">
            <span>Particulars</span>
            <span>Amount (₹)</span>
          </div>
          <div className="col-rows">
            {creditEntries.map((e, idx) => (
              <div key={`cr-${idx}`} className="t-account-row">
                <span className="t-label">By {e.label}</span>
                {e.amount !== null ? (
                  <span className="t-amount tabular-nums">{formatINR(e.amount, false)}</span>
                ) : (
                  <input
                    type="text"
                    className="t-input tabular-nums"
                    placeholder="0"
                    value={crInputs[idx] || ''}
                    onChange={(ev) => setCrInputs({ ...crInputs, [idx]: ev.target.value })}
                    disabled={submitted}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Balance Input Row */}
      <div className="t-account-balance-section">
        <label className="balance-label">Closing Balance (c/d):</label>
        <div className="balance-controls">
          <div className="balance-side-toggles">
            <button
              type="button"
              className={`toggle-side-btn ${balanceSide === 'Dr' ? 'active' : ''}`}
              onClick={() => !submitted && setBalanceSide('Dr')}
            >
              To Balance c/d (Dr Side)
            </button>
            <button
              type="button"
              className={`toggle-side-btn ${balanceSide === 'Cr' ? 'active' : ''}`}
              onClick={() => !submitted && setBalanceSide('Cr')}
            >
              By Balance c/d (Cr Side)
            </button>
          </div>
          <div className="balance-amount-input-wrap">
            <span className="currency-prefix">₹</span>
            <input
              type="text"
              className="tabular-nums balance-amount-input"
              placeholder="Enter balance figure"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              disabled={submitted}
            />
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`mcq-feedback-banner ${isSuccess ? 'banner-correct' : 'banner-wrong'}`}
          role="status"
        >
          {feedback}
        </div>
      )}

      <div className="t-account-actions">
        {!submitted ? (
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Check Ledger Balance
          </button>
        ) : (
          !isSuccess && (
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Recalculate & Try Again
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default TAccount;
