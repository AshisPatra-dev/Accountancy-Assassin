// ============================================================
// ACCOUNTANCY ASSASSIN — Interaction Component: CalcInput
// Numerical value input with optional popover calculator,
// tolerance check, working notes reveal, and INR formatting.
// ============================================================

import React, { useState } from 'react';
import { parseAmount, formatINR } from '@/lib/format';

export interface CalcInputProps {
  question: string;
  unit?: string; // e.g. "₹" or "days" or "%"
  correctValue: number;
  tolerance?: number; // default 0.5 (allow ±0.5)
  hintText?: string;
  workingNote?: string; // shown after wrong attempt
  showCalculator?: boolean;
  onResult: (correct: boolean, firstAttempt: boolean) => void;
}

export function CalcInput({
  question,
  unit = '₹',
  correctValue,
  tolerance = 0.5,
  hintText,
  workingNote,
  showCalculator = true,
  onResult,
}: CalcInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');

  // Mini calculator state
  const handleCalcBtn = (btn: string) => {
    if (btn === 'C') {
      setCalcDisplay('0');
    } else if (btn === '=') {
      try {
        // Safe evaluation of standard 4-op expression
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (btn === 'Insert') {
      setInputValue(calcDisplay);
      setCalcOpen(false);
    } else {
      setCalcDisplay((prev) => (prev === '0' || prev === 'Error' ? btn : prev + btn));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitted) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const parsed = parseAmount(inputValue);
    const diff = Math.abs(parsed - correctValue);
    const correct = diff <= tolerance;

    setSubmitted(true);
    setIsCorrect(correct);
    onResult(correct, nextAttempts === 1);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="interaction-card calc-input-card" role="region" aria-label="Calculation Input">
      <div className="calc-question-text" dangerouslySetInnerHTML={{ __html: question }} />

      {hintText && !submitted && (
        <div className="calc-hint-note">
          <span className="hint-icon">💡</span> {hintText}
        </div>
      )}

      <form onSubmit={handleSubmit} className="calc-input-form">
        <div className="input-group-large">
          {unit === '₹' && <span className="unit-badge currency-badge">₹</span>}
          <input
            type="text"
            className={`large-num-input tabular-nums ${
              submitted ? (isCorrect ? 'input-correct' : 'input-wrong') : ''
            }`}
            placeholder="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={submitted}
            autoFocus
          />
          {unit !== '₹' && <span className="unit-badge suffix-badge">{unit}</span>}
        </div>

        <div className="calc-action-bar">
          {showCalculator && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setCalcOpen((o) => !o)}
            >
              🧮 {calcOpen ? 'Close Calculator' : 'Calculator'}
            </button>
          )}

          {!submitted ? (
            <button type="submit" className="btn btn-primary" disabled={!inputValue.trim()}>
              Submit Solution
            </button>
          ) : (
            !isCorrect && (
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Try Recalculating
              </button>
            )
          )}
        </div>
      </form>

      {/* Mini 4-operation Calculator popover */}
      {calcOpen && (
        <div className="mini-calculator card">
          <div className="mini-calc-display tabular-nums">{calcDisplay}</div>
          <div className="mini-calc-keypad">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+'].map(
              (k) => (
                <button
                  key={k}
                  type="button"
                  className="calc-btn"
                  onClick={() => handleCalcBtn(k)}
                >
                  {k}
                </button>
              )
            )}
            <button
              type="button"
              className="calc-btn calc-btn-eq"
              onClick={() => handleCalcBtn('=')}
            >
              =
            </button>
            <button
              type="button"
              className="calc-btn calc-btn-insert"
              onClick={() => handleCalcBtn('Insert')}
            >
              Insert
            </button>
          </div>
        </div>
      )}

      {/* Feedback Banner & Working Notes */}
      {submitted && (
        <div
          className={`mcq-feedback-banner ${isCorrect ? 'banner-correct' : 'banner-wrong'}`}
          role="status"
        >
          <div className="feedback-header">
            <strong>
              {isCorrect
                ? '✓ Precision Calculation!'
                : `✗ Missed Target. Expected: ${
                    unit === '₹' ? formatINR(correctValue) : `${correctValue} ${unit}`
                  }`}
            </strong>
          </div>
          {workingNote && (
            <div className="calc-working-note">
              <strong>Working Note / Accounting Logic:</strong>
              <p>{workingNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalcInput;
