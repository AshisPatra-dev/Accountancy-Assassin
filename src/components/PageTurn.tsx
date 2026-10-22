// ============================================================
// ACCOUNTANCY ASSASSIN — PageTurn 3D Transition Component
// Simulates turning the physical leaf of a heavy leather ledger.
// Uses perspective + rotateY with cubic-bezier(0.77, 0, 0.175, 1).
// Gracefully degrades to a calm opacity fade under reducedMotion.
// ============================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';

interface PageTurnProps {
  pageKey: string | number;
  direction?: 'forward' | 'backward';
  onComplete?: () => void;
  children: React.ReactNode;
}

export function PageTurn({
  pageKey,
  direction = 'forward',
  onComplete,
  children,
}: PageTurnProps) {
  const reducedMotion = useStore((s) => s.reducedMotion);

  // Easing specified in brief: cubic-bezier(0.77, 0, 0.175, 1)
  const bookEasing = [0.77, 0, 0.175, 1] as const;

  if (reducedMotion) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onAnimationComplete={onComplete}
          style={{ width: '100%' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  const isForward = direction === 'forward';

  return (
    <div
      className="page-turn-viewport"
      style={{
        perspective: 1400,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pageKey}
          initial={{
            opacity: 0,
            rotateY: isForward ? 45 : -45,
            transformOrigin: isForward ? 'left center' : 'right center',
          }}
          animate={{
            opacity: 1,
            rotateY: 0,
            transformOrigin: isForward ? 'left center' : 'right center',
          }}
          exit={{
            opacity: 0,
            rotateY: isForward ? -45 : 45,
            transformOrigin: isForward ? 'right center' : 'left center',
          }}
          transition={{
            duration: 0.4,
            ease: bookEasing,
          }}
          onAnimationComplete={onComplete}
          style={{
            width: '100%',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
