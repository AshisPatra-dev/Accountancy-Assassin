// ============================================================
// ACCOUNTANCY ASSASSIN — TrackSelector component
// Renders inside Settings (Profile screen).
// Allows switching the Unit 3 track until 20% coverage is reached.
// After lock, shows the locked track with a brass badge.
// ============================================================

import React, { useState } from 'react';
import { useStore, TrackKey } from '@/store';
import { useI18n } from '@/i18n';

interface TrackSelectorProps {
  sem: 3 | 4;
}

export function TrackSelector({ sem }: TrackSelectorProps) {
  const { tracks, setTrack } = useStore();
  const { t } = useI18n();
  const key   = sem === 3 ? 's3' : 's4';
  const state = tracks[key];

  const [pendingTrack, setPendingTrack] = useState<'analysis' | 'computer' | null>(null);
  const [confirmOpen,  setConfirmOpen]  = useState(false);

  const coveragePct = Math.round(state.coverage * 100);

  const handleSelect = (track: 'analysis' | 'computer') => {
    if (state.locked) return;
    if (state.chosen === track) return; // no-op

    if (state.chosen !== null) {
      // Already started a different track — ask for confirmation
      setPendingTrack(track);
      setConfirmOpen(true);
    } else {
      // First choice — no confirmation needed
      setTrack(sem, track);
    }
  };

  const confirmChange = () => {
    if (!pendingTrack) return;
    setTrack(sem, pendingTrack);
    setPendingTrack(null);
    setConfirmOpen(false);
  };

  const cancelChange = () => {
    setPendingTrack(null);
    setConfirmOpen(false);
  };

  const trackLabel = (track: 'analysis' | 'computer') =>
    track === 'analysis'
      ? t('track.analysis')    // "Analysis of Financial Statements"
      : t('track.computer');   // "Computerized Accounts"

  const trackDescription = (track: 'analysis' | 'computer') =>
    track === 'analysis'
      ? t('track.analysis.desc')
      : t('track.computer.desc');

  return (
    <div className="track-selector" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="settings-label">
          {t('track.title')} — {t('track.sem', { sem })}
        </span>
        {state.locked && (
          <span className="unreviewed-badge" style={{ color: 'var(--brass)', borderColor: 'var(--border-brass)' }}>
            {t('track.locked')}
          </span>
        )}
        {!state.locked && state.chosen && (
          <span style={{ fontSize: '0.72rem', color: 'var(--teal)', fontFamily: 'JetBrains Mono, monospace' }}>
            {coveragePct}% — {t('track.lockWarning', { pct: 20 - coveragePct })}%
          </span>
        )}
      </div>

      {/* Track option cards */}
      {(['analysis', 'computer'] as const).map((track) => {
        const isChosen   = state.chosen === track;
        const isDisabled = state.locked && !isChosen;

        return (
          <button
            key={track}
            type="button"
            onClick={() => handleSelect(track)}
            disabled={isDisabled}
            aria-pressed={isChosen}
            style={{
              textAlign: 'left',
              padding: '14px 16px',
              borderRadius: 6,
              border: isChosen
                ? '1.5px solid var(--teal)'
                : '1px solid var(--border)',
              background: isChosen
                ? 'var(--teal-dim)'
                : 'var(--surface-2)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.5 : 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <span style={{
              fontWeight: 700,
              fontSize: '0.92rem',
              color: isChosen ? 'var(--teal-light)' : 'var(--text)',
            }}>
              {isChosen && '▶ '}{trackLabel(track)}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              {trackDescription(track)}
            </span>
          </button>
        );
      })}

      {/* Lock explanation */}
      {state.locked && (
        <p style={{ fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
          {t('track.lockedExplain')}
        </p>
      )}
      {!state.locked && !state.chosen && (
        <p style={{ fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
          {t('track.chooseHint')}
        </p>
      )}

      {/* Confirmation modal */}
      {confirmOpen && (
        <div className="track-confirm-overlay" role="dialog" aria-modal="true"
             aria-labelledby="track-confirm-title">
          <div className="track-confirm-card">
            <h3 className="track-confirm-title" id="track-confirm-title">
              {t('track.confirm.title')}
            </h3>
            <p className="track-confirm-body">
              {t('track.confirm.body', {
                from: trackLabel(state.chosen as 'analysis' | 'computer'),
                to:   trackLabel(pendingTrack!),
              })}
              {' '}
              {t('track.confirm.resetWarning')}
            </p>
            <div className="track-confirm-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={cancelChange}
              >
                {t('track.confirm.cancel')}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={confirmChange}
              >
                {t('track.confirm.proceed')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
