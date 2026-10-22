// ============================================================
// ACCOUNTANCY ASSASSIN — Interaction Component: MCQ
// Radio-button options, instant teal/crimson feedback,
// explanation reveal, and accessible 44px tap targets.
// ============================================================

import React, { useState } from 'react';

export interface MCQProps {
  question: string; // rendered as HTML (supports <b>, <em>)
  options: { id: string; text: string }[];
  correctId: string;
  hintText?: string;
  reasonText: string; // shown after any answer
  onResult: (correct: boolean, firstAttempt: boolean) => void;
  showHint?: boolean; // hint button visible (false during Strike)
}

export function MCQ({
  question,
  options,
  correctId,
  hintText,
  reasonText,
  onResult,
  showHint = true,
}: MCQProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (optionId: string) => {
    if (isAnswered) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSelectedId(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === correctId;
    onResult(isCorrect, newAttempts === 1);
  };

  const isCorrect = selectedId === correctId;

  return (
    <div className="interaction-card mcq-card" role="region" aria-label="Multiple Choice Question">
      <div
        className="mcq-question-text"
        dangerouslySetInnerHTML={{ __html: question }}
      />

      {showHint && hintText && (
        <div className="mcq-hint-container">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setHintVisible((v) => !v)}
            aria-expanded={hintVisible}
          >
            {hintVisible ? 'Hide Hint' : '💡 Need a Hint?'}
          </button>
          {hintVisible && (
            <div className="mcq-hint-box" role="note">
              <span>{hintText}</span>
            </div>
          )}
        </div>
      )}

      <div className="mcq-options-list" role="radiogroup" aria-label="Answer options">
        {options.map((opt) => {
          let stateClass = '';
          if (isAnswered) {
            if (opt.id === correctId) {
              stateClass = 'correct';
            } else if (opt.id === selectedId) {
              stateClass = 'wrong';
            } else {
              stateClass = 'dimmed';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selectedId === opt.id}
              disabled={isAnswered}
              className={`mcq-option ${stateClass}`}
              onClick={() => handleSelect(opt.id)}
            >
              <span className="mcq-option-badge">{opt.id}</span>
              <span className="mcq-option-label">{opt.text}</span>
              {isAnswered && opt.id === correctId && (
                <span className="mcq-feedback-icon" aria-label="Correct">✓</span>
              )}
              {isAnswered && opt.id === selectedId && opt.id !== correctId && (
                <span className="mcq-feedback-icon" aria-label="Wrong">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className={`mcq-feedback-banner ${isCorrect ? 'banner-correct' : 'banner-wrong'}`}
          role="status"
        >
          <div className="feedback-header">
            <strong>{isCorrect ? '✓ Correct Strike!' : '✗ Incorrect Strike.'}</strong>
          </div>
          <p className="feedback-reason">{reasonText}</p>
        </div>
      )}
    </div>
  );
}

export default MCQ;
