// ============================================================
// ACCOUNTANCY ASSASSIN — Interaction Component: DragJournal
// Drag-and-drop / tap-to-place journal entry construction.
// Verifies Dr = Cr, exact account assignment, and amount matching.
// ============================================================

import React, { useState } from 'react';
import { parseAmount, formatINR } from '@/lib/format';

export interface DragJournalProps {
  accounts: string[]; // pool of account names to drag/tap from
  correctDebits: { account: string; amount: number }[];
  correctCredits: { account: string; amount: number }[];
  narration: string;
  onResult: (correct: boolean, firstAttempt: boolean) => void;
}

interface PlacedLine {
  id: string;
  account: string;
  amountStr: string;
}

export function DragJournal({
  accounts,
  correctDebits,
  correctCredits,
  narration,
  onResult,
}: DragJournalProps) {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [debitLines, setDebitLines] = useState<PlacedLine[]>([]);
  const [creditLines, setCreditLines] = useState<PlacedLine[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChipClick = (acc: string) => {
    if (submitted) return;
    setSelectedChip((curr) => (curr === acc ? null : acc));
  };

  const addLineToZone = (side: 'Dr' | 'Cr', account: string) => {
    const newLine: PlacedLine = {
      id: `${side}-${Date.now()}-${Math.random()}`,
      account,
      amountStr: '',
    };
    if (side === 'Dr') {
      setDebitLines((prev) => [...prev, newLine]);
    } else {
      setCreditLines((prev) => [...prev, newLine]);
    }
    setSelectedChip(null);
    setErrorMessage(null);
  };

  const removeLine = (side: 'Dr' | 'Cr', id: string) => {
    if (submitted) return;
    if (side === 'Dr') {
      setDebitLines((prev) => prev.filter((l) => l.id !== id));
    } else {
      setCreditLines((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const updateAmount = (side: 'Dr' | 'Cr', id: string, val: string) => {
    if (submitted) return;
    if (side === 'Dr') {
      setDebitLines((prev) =>
        prev.map((l) => (l.id === id ? { ...l, amountStr: val } : l))
      );
    } else {
      setCreditLines((prev) =>
        prev.map((l) => (l.id === id ? { ...l, amountStr: val } : l))
      );
    }
  };

  const handleSubmit = () => {
    const currentAttempt = attempts + 1;
    setAttempts(currentAttempt);

    // Parse amounts
    const drSum = debitLines.reduce((s, l) => s + parseAmount(l.amountStr), 0);
    const crSum = creditLines.reduce((s, l) => s + parseAmount(l.amountStr), 0);

    if (drSum <= 0 || crSum <= 0) {
      setErrorMessage('Please enter valid positive amounts for both debit and credit entries.');
      return;
    }

    if (drSum !== crSum) {
      setErrorMessage(
        `Equilibrium failure: Total Debits (${formatINR(drSum)}) do not equal Total Credits (${formatINR(crSum)}).`
      );
      return;
    }

    // Validate debit lines against correctDebits
    let correct = true;
    if (debitLines.length !== correctDebits.length || creditLines.length !== correctCredits.length) {
      correct = false;
    } else {
      // Check each debit
      for (const req of correctDebits) {
        const found = debitLines.find(
          (l) => l.account.toLowerCase().includes(req.account.toLowerCase()) || req.account.toLowerCase().includes(l.account.toLowerCase())
        );
        if (!found || parseAmount(found.amountStr) !== req.amount) {
          correct = false;
          break;
        }
      }
      // Check each credit
      for (const req of correctCredits) {
        const found = creditLines.find(
          (l) => l.account.toLowerCase().includes(req.account.toLowerCase()) || req.account.toLowerCase().includes(l.account.toLowerCase())
        );
        if (!found || parseAmount(found.amountStr) !== req.amount) {
          correct = false;
          break;
        }
      }
    }

    setSubmitted(true);
    setIsSuccess(correct);
    if (!correct) {
      setErrorMessage('Account titles or amounts on Dr/Cr sides do not match the transaction requirements.');
    } else {
      setErrorMessage(null);
    }

    onResult(correct, currentAttempt === 1);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div className="interaction-card drag-journal-card" role="region" aria-label="Journal Entry Builder">
      <div className="journal-narration-box">
        <span className="narration-tag">TRANSACTION</span>
        <p className="narration-text">{narration}</p>
      </div>

      {/* Account Pool */}
      <div className="account-pool-section">
        <div className="pool-label">
          {selectedChip
            ? `Selected: "${selectedChip}" — Now tap Dr. Zone or Cr. Zone below`
            : 'Tap an account to select, then assign to Dr. or Cr. side:'}
        </div>
        <div className="account-chips-row">
          {accounts.map((acc) => (
            <button
              key={acc}
              type="button"
              className={`account-chip ${selectedChip === acc ? 'selected' : ''}`}
              onClick={() => handleChipClick(acc)}
              disabled={submitted}
            >
              {acc}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Table Zones */}
      <div className="journal-zones-container">
        {/* Debit Zone */}
        <div
          className={`drag-zone debit-zone ${selectedChip ? 'zone-active' : ''}`}
          onClick={() => {
            if (selectedChip) addLineToZone('Dr', selectedChip);
          }}
        >
          <div className="zone-header">
            <span className="zone-title">DEBIT (Dr.)</span>
            {selectedChip && <span className="zone-hint">+ Tap to Add</span>}
          </div>
          <div className="zone-lines">
            {debitLines.length === 0 && (
              <div className="zone-empty-msg">No debit accounts placed yet.</div>
            )}
            {debitLines.map((line) => (
              <div key={line.id} className="journal-line-row">
                <span className="line-account-name">{line.account}</span>
                <div className="line-amount-input-wrap">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="text"
                    className="tabular-nums line-amount-input"
                    placeholder="0"
                    value={line.amountStr}
                    onChange={(e) => updateAmount('Dr', line.id, e.target.value)}
                    disabled={submitted}
                  />
                </div>
                {!submitted && (
                  <button
                    type="button"
                    className="btn-remove-line"
                    onClick={() => removeLine('Dr', line.id)}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Credit Zone */}
        <div
          className={`drag-zone credit-zone ${selectedChip ? 'zone-active' : ''}`}
          onClick={() => {
            if (selectedChip) addLineToZone('Cr', selectedChip);
          }}
        >
          <div className="zone-header">
            <span className="zone-title">CREDIT (Cr.)</span>
            {selectedChip && <span className="zone-hint">+ Tap to Add</span>}
          </div>
          <div className="zone-lines">
            {creditLines.length === 0 && (
              <div className="zone-empty-msg">No credit accounts placed yet.</div>
            )}
            {creditLines.map((line) => (
              <div key={line.id} className="journal-line-row credit-line">
                <span className="line-account-name">To {line.account}</span>
                <div className="line-amount-input-wrap">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="text"
                    className="tabular-nums line-amount-input"
                    placeholder="0"
                    value={line.amountStr}
                    onChange={(e) => updateAmount('Cr', line.id, e.target.value)}
                    disabled={submitted}
                  />
                </div>
                {!submitted && (
                  <button
                    type="button"
                    className="btn-remove-line"
                    onClick={() => removeLine('Cr', line.id)}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mcq-feedback-banner banner-wrong" role="alert">
          {errorMessage}
        </div>
      )}

      {submitted && isSuccess && (
        <div className="mcq-feedback-banner banner-correct" role="status">
          ✓ Accurate Journal Entry! Debits and Credits are in perfect equilibrium.
        </div>
      )}

      <div className="journal-actions-row">
        {!submitted ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={debitLines.length === 0 || creditLines.length === 0}
          >
            Verify Journal Entry
          </button>
        ) : (
          !isSuccess && (
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Edit & Try Again
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default DragJournal;
