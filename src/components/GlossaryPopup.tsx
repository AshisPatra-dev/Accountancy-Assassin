// ============================================================
// ACCOUNTANCY ASSASSIN — GlossaryPopup Component
// Rendered via React portal near the tapped term in Mixed mode.
// Features Bengali translation, needsReview badge, definition,
// contextual example sentence, and smooth scale-in animation.
// ============================================================

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GLOSSARY, GlossaryEntry } from '@/data/glossary';
import { useI18n } from '@/i18n';
import { useStore } from '@/store';

interface GlossaryPopupProps {
  termId: string;
  anchorRect: DOMRect | null;
  onClose: () => void;
}

export function GlossaryPopup({ termId, anchorRect, onClose }: GlossaryPopupProps) {
  const { t, language } = useI18n();
  const reducedMotion = useStore((s) => s.reducedMotion);
  const cardRef = useRef<HTMLDivElement>(null);

  const entry: GlossaryEntry | undefined = GLOSSARY.find(
    (g) => g.id.toLowerCase() === termId.toLowerCase()
  );

  // Close on outside click or escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!entry || !anchorRect) return null;

  // Compute position relative to viewport
  const popupWidth = Math.min(320, window.innerWidth - 32);
  let left = anchorRect.left + anchorRect.width / 2 - popupWidth / 2;
  // Viewport bounds clamp
  if (left < 16) left = 16;
  if (left + popupWidth > window.innerWidth - 16) {
    left = window.innerWidth - 16 - popupWidth;
  }

  // Vertical placement: place below if space, otherwise above
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const placeAbove = spaceBelow < 220 && anchorRect.top > 220;
  const top = placeAbove
    ? anchorRect.top - 8 // adjusted with transform translate-y
    : anchorRect.bottom + 8;

  const definition = language === 'bn' ? entry.definitionBn : entry.definitionEn;
  const example = language === 'bn' ? entry.exampleBn : entry.exampleEn;

  return createPortal(
    <AnimatePresence>
      <div
        className="glossary-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <motion.div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-label={entry.termEn}
          className="glossary-popup card"
          initial={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.9, y: placeAbove ? 6 : -6 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.92, y: placeAbove ? 4 : -4 }
          }
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: placeAbove ? undefined : top,
            bottom: placeAbove ? window.innerHeight - anchorRect.top + 8 : undefined,
            left,
            width: popupWidth,
            zIndex: 9999,
            padding: '16px 18px',
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--border-brass)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
            borderRadius: 8,
          }}
        >
          {/* Top Bar with English term, badge, and close button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 8,
              gap: 8,
            }}
          >
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  color: 'var(--text)',
                  fontWeight: 700,
                  fontFamily: 'Newsreader, Georgia, serif',
                }}
              >
                {entry.termEn}
              </h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 3,
                }}
              >
                <span
                  className="bengali-text"
                  style={{
                    fontSize: '1rem',
                    color: 'var(--teal-light)',
                    fontWeight: 600,
                  }}
                >
                  {entry.termBn}
                </span>
                {entry.needsReview && (
                  <span
                    className="unreviewed-badge"
                    style={{
                      fontSize: '0.66rem',
                      padding: '1px 6px',
                      borderRadius: 4,
                      border: '1px solid var(--border-brass)',
                      color: 'var(--brass-light)',
                      backgroundColor: 'rgba(184, 146, 63, 0.1)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('glossary.unreviewedBadge') || 'Unreviewed'}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close glossary popup"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                fontSize: '1.4rem',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: 1,
                minHeight: 44,
                minWidth: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Definition */}
          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--text)',
              lineHeight: 1.55,
              margin: '0 0 10px 0',
            }}
          >
            {definition}
          </p>

          {/* Example Box */}
          <div
            style={{
              backgroundColor: 'var(--surface-2)',
              borderLeft: '3px solid var(--teal)',
              padding: '8px 10px',
              borderRadius: '0 4px 4px 0',
              fontSize: '0.78rem',
              color: 'var(--muted)',
              lineHeight: 1.45,
            }}
          >
            <strong style={{ color: 'var(--teal-light)', display: 'block', marginBottom: 2 }}>
              {language === 'bn' ? 'উদাহরণ:' : 'Example:'}
            </strong>
            <span>{example}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
