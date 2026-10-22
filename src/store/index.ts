// ============================================================
// ACCOUNTANCY ASSASSIN — Zustand Store (Phase 1 Amendment)
// Added: Track selection with 20% coverage lock + Change track action.
// Language, theme, streak, semester progress, reduced motion,
// 5-day backup reminders.
// Persisted via IndexedDB with localStorage fallback (src/lib/storage.ts).
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storageAdapter } from '@/lib/storage';
import { Language } from '@/i18n';

export type Theme    = 'night' | 'day';
export type TrackKey = 'analysis' | 'computer' | null;

export interface SemesterProgress {
  topicsTotal: number;
  topicsCompleted: number;
  percentage: number;
  isStarted: boolean;
  isMastered: boolean;
}

export interface StreakState {
  days: number;
  lastDate: string; // YYYY-MM-DD
}

export interface BackupState {
  lastBackupDate: string | null;
  daysActiveSinceBackup: number;
  showBackupNudge: boolean;
}

// Track state for Semester 3 and 4 Unit 3
export interface TrackState {
  /** Chosen track (null = not yet chosen) */
  chosen: TrackKey;
  /**
   * Coverage in the chosen track's Unit 3 (0–1).
   * When this reaches 0.20 (20%), the track is locked and cannot be changed.
   */
  coverage: number;
  /**
   * Whether the track is locked (coverage >= 20%).
   * Derived value; stored for convenience. Always recomputed on load.
   */
  locked: boolean;
}

export interface AppStoreState {
  // Appearance & Localization
  language: Language;
  theme: Theme;
  reducedMotion: boolean;

  // Study Streak
  streak: StreakState;

  // Semester Progress
  semesterProgress: Record<1 | 2 | 3 | 4, SemesterProgress>;

  // Track selection for Unit 3 (Sems 3 & 4 share the same track choice)
  // OWNER-CONFIRM: brief says "same track rule as Sem 3 applies" for Sem 4.
  tracks: {
    s3: TrackState;
    s4: TrackState;
  };

  // Study Metrics
  studySeconds: number;

  // Backup & Storage Alert
  backup: BackupState;

  // ── Actions ──────────────────────────────────────────────
  setLanguage:   (lang: Language)       => void;
  setTheme:      (theme: Theme)         => void;
  toggleTheme:   ()                     => void;
  setReducedMotion: (reduced: boolean)  => void;
  touchStreak:   ()                     => void;

  /**
   * Choose or change a track for a given semester (3 or 4).
   * Returns 'ok'        – track set successfully
   *         'locked'    – coverage >= 20%, change not allowed
   *         'no_change' – same track already active
   */
  setTrack: (sem: 3 | 4, track: 'analysis' | 'computer') => 'ok' | 'locked' | 'no_change';

  /**
   * Update the Unit 3 coverage for a semester. Called each time the student
   * completes a topic in Unit 3 of the chosen track.
   * Automatically locks the track when coverage reaches 20%.
   */
  updateTrackCoverage: (sem: 3 | 4, completedTopics: number, totalTopics: number) => void;

  updateSemesterProgress: (sem: 1 | 2 | 3 | 4, completedCount: number) => void;
  recordBackup:      ()           => void;
  dismissBackupNudge: ()          => void;
  addStudySeconds:   (sec: number) => void;
  resetStore:        ()           => void;
}

// ── Initial state ────────────────────────────────────────────

const initialSemProgress: Record<1 | 2 | 3 | 4, SemesterProgress> = {
  1: { topicsTotal: 44, topicsCompleted: 0, percentage: 0, isStarted: false, isMastered: false },
  2: { topicsTotal: 39, topicsCompleted: 0, percentage: 0, isStarted: false, isMastered: false },
  3: { topicsTotal: 34, topicsCompleted: 0, percentage: 0, isStarted: false, isMastered: false },
  4: { topicsTotal: 31, topicsCompleted: 0, percentage: 0, isStarted: false, isMastered: false },
};

const initialTrackState = (): TrackState => ({
  chosen:   null,
  coverage: 0,
  locked:   false,
});

const initialBackupState: BackupState = {
  lastBackupDate:         null,
  daysActiveSinceBackup:  0,
  showBackupNudge:        false,
};

/** LOCK_THRESHOLD: coverage fraction at which the track becomes permanent */
const LOCK_THRESHOLD = 0.20; // 20%

function getTodayString():     string { return new Date().toISOString().slice(0, 10); }
function getYesterdayString(): string {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ── Store ────────────────────────────────────────────────────

export const useStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      language:      'mixed',  // Default: Mixed mode
      theme:         'night',  // Night Ledger default
      reducedMotion: false,

      streak: { days: 1, lastDate: getTodayString() },

      semesterProgress: initialSemProgress,

      tracks: {
        s3: initialTrackState(),
        s4: initialTrackState(),
      },

      studySeconds: 0,
      backup: initialBackupState,

      // ── Appearance ──────────────────────────────────────
      setLanguage:      (lang)    => set({ language: lang }),
      setTheme:         (theme)   => set({ theme }),
      toggleTheme:      ()        => set((s) => ({ theme: s.theme === 'night' ? 'day' : 'night' })),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

      // ── Streak ──────────────────────────────────────────
      touchStreak: () => {
        const today     = getTodayString();
        const yesterday = getYesterdayString();
        const { streak, backup } = get();

        if (streak.lastDate === today) return; // Already touched today

        const newDays       = streak.lastDate === yesterday ? streak.days + 1 : 1;
        const newDaysActive = backup.daysActiveSinceBackup + 1;

        // Storage warning: nudge every 5 days of use
        set({
          streak: { days: newDays, lastDate: today },
          backup: {
            ...backup,
            daysActiveSinceBackup: newDaysActive,
            showBackupNudge:       newDaysActive >= 5,
          },
        });
      },

      // ── Track selection (20% lock rule) ─────────────────
      setTrack: (sem, track) => {
        const key    = sem === 3 ? 's3' : 's4';
        const tracks = get().tracks;
        const current = tracks[key];

        if (current.locked) return 'locked';
        if (current.chosen === track) return 'no_change';

        set((s) => ({
          tracks: {
            ...s.tracks,
            [key]: {
              // Reset coverage when switching before lock
              chosen:   track,
              coverage: 0,
              locked:   false,
            },
          },
        }));
        return 'ok';
      },

      updateTrackCoverage: (sem, completedTopics, totalTopics) => {
        const key = sem === 3 ? 's3' : 's4';
        const coverage = totalTopics > 0 ? completedTopics / totalTopics : 0;
        const locked   = coverage >= LOCK_THRESHOLD;

        set((s) => ({
          tracks: {
            ...s.tracks,
            [key]: {
              ...s.tracks[key],
              coverage,
              locked,
            },
          },
        }));
      },

      // ── Semester Progress ────────────────────────────────
      updateSemesterProgress: (sem, completedCount) =>
        set((s) => {
          const current = s.semesterProgress[sem];
          const clamped = Math.min(Math.max(completedCount, 0), current.topicsTotal);
          const pct     = Math.round((clamped / current.topicsTotal) * 100);
          return {
            semesterProgress: {
              ...s.semesterProgress,
              [sem]: {
                ...current,
                topicsCompleted: clamped,
                percentage:      pct,
                isStarted:       clamped > 0,
                isMastered:      clamped >= current.topicsTotal,
              },
            },
          };
        }),

      // ── Backup ──────────────────────────────────────────
      recordBackup: () =>
        set({
          backup: {
            lastBackupDate:         new Date().toISOString(),
            daysActiveSinceBackup:  0,
            showBackupNudge:        false,
          },
        }),

      dismissBackupNudge: () =>
        set((s) => ({ backup: { ...s.backup, showBackupNudge: false } })),

      addStudySeconds: (sec) =>
        set((s) => ({ studySeconds: s.studySeconds + sec })),

      // ── Reset ────────────────────────────────────────────
      resetStore: () =>
        set({
          language:         'mixed',
          theme:            'night',
          reducedMotion:    false,
          streak:           { days: 1, lastDate: getTodayString() },
          semesterProgress: initialSemProgress,
          tracks:           { s3: initialTrackState(), s4: initialTrackState() },
          studySeconds:     0,
          backup:           initialBackupState,
        }),
    }),
    {
      name:    'accountancy_assassin_storage',
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);
