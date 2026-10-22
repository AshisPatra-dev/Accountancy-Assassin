// ============================================================
// ACCOUNTANCY ASSASSIN — Topic Progress Zustand Store
// Persisted store tracking micro-lesson progress, strike scores,
// and topic unlock state across all semesters.
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storageAdapter } from '@/lib/storage';
import { SYLLABUS, getTopic, TopicMeta } from '@/data/syllabus';

export type TopicStatus = 'locked' | 'open' | 'in_progress' | 'mastered';

export interface TopicProgress {
  topicId: string;
  status: TopicStatus;
  lessonsCompleted: number; // how many micro-lessons done
  lessonCount: number;
  strikeScore: number | null; // 0-1, null if not attempted
  strikePassed: boolean; // score >= 0.80
  lastAccessedAt: string | null; // ISO
}

export interface ProgressStoreState {
  topics: Record<string, TopicProgress>;

  // Initialise a semester's topics (called when a volume is first opened)
  initSemester: (semId: 1 | 2 | 3 | 4, track?: 'analysis' | 'computer') => void;

  // Mark a micro-lesson completed (lessonIndex is 1-based order, e.g. 1..12)
  completeMicroLesson: (topicId: string, lessonIndex: number) => void;

  // Record a Strike attempt
  recordStrike: (topicId: string, score: number) => void;

  // Get the status of a topic (with dynamic unlock logic)
  getTopicStatus: (topicId: string) => TopicStatus;
}

export const useProgressStore = create<ProgressStoreState>()(
  persist(
    (set, get) => ({
      topics: {},

      initSemester: (semId, _track) => {
        const semester = SYLLABUS[semId];
        if (!semester) return;

        set((state) => {
          const nextTopics = { ...state.topics };

          for (const unit of semester.units) {
            // Sort topics by order
            const sortedTopics = [...unit.topics].sort((a, b) => a.order - b.order);

            for (let i = 0; i < sortedTopics.length; i++) {
              const topic = sortedTopics[i];
              if (!nextTopics[topic.id]) {
                const isFirstInUnit = topic.order === 1;
                nextTopics[topic.id] = {
                  topicId: topic.id,
                  status: isFirstInUnit ? 'open' : 'locked',
                  lessonsCompleted: 0,
                  lessonCount: topic.lessonCount,
                  strikeScore: null,
                  strikePassed: false,
                  lastAccessedAt: null,
                };
              }
            }
          }

          return { topics: nextTopics };
        });
      },

      completeMicroLesson: (topicId, lessonIndex) => {
        const topicMeta = getTopic(topicId);
        const lessonCount = topicMeta?.lessonCount ?? 12;

        set((state) => {
          const current = state.topics[topicId] || {
            topicId,
            status: 'open',
            lessonsCompleted: 0,
            lessonCount,
            strikeScore: null,
            strikePassed: false,
            lastAccessedAt: null,
          };

          const newCompleted = Math.max(
            current.lessonsCompleted,
            Math.min(lessonIndex, lessonCount)
          );

          const isMastered = current.strikePassed && newCompleted >= lessonCount;
          const newStatus: TopicStatus = isMastered
            ? 'mastered'
            : newCompleted > 0
            ? 'in_progress'
            : current.status;

          const updatedTopics: Record<string, TopicProgress> = {
            ...state.topics,
            [topicId]: {
              ...current,
              lessonsCompleted: newCompleted,
              status: newStatus,
              lastAccessedAt: new Date().toISOString(),
            },
          };

          // If at least 1 lesson completed, unlock next topic in the unit
          if (newCompleted >= 1 && topicMeta) {
            const sem = SYLLABUS[topicMeta.semId];
            const unit = sem?.units.find((u) => u.id === topicMeta.unitId);
            if (unit) {
              const nextTopic = unit.topics.find((t) => t.order === topicMeta.order + 1);
              if (nextTopic) {
                const nextExisting = updatedTopics[nextTopic.id];
                if (!nextExisting) {
                  updatedTopics[nextTopic.id] = {
                    topicId: nextTopic.id,
                    status: 'open',
                    lessonsCompleted: 0,
                    lessonCount: nextTopic.lessonCount,
                    strikeScore: null,
                    strikePassed: false,
                    lastAccessedAt: null,
                  };
                } else if (nextExisting.status === 'locked') {
                  updatedTopics[nextTopic.id] = {
                    ...nextExisting,
                    status: 'open',
                  };
                }
              }
            }
          }

          return { topics: updatedTopics };
        });
      },

      recordStrike: (topicId, score) => {
        set((state) => {
          const current = state.topics[topicId];
          const passed = score >= 0.8;
          const meta = getTopic(topicId);
          const count = meta?.lessonCount ?? (current?.lessonCount ?? 12);
          const completed = current?.lessonsCompleted ?? 0;

          const newStatus: TopicStatus =
            passed && completed >= count
              ? 'mastered'
              : completed > 0
              ? 'in_progress'
              : 'open';

          return {
            topics: {
              ...state.topics,
              [topicId]: {
                topicId,
                status: newStatus,
                lessonsCompleted: completed,
                lessonCount: count,
                strikeScore: score,
                strikePassed: passed,
                lastAccessedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      getTopicStatus: (topicId) => {
        const { topics } = get();
        const current = topics[topicId];

        if (current) {
          if (current.strikePassed && current.lessonsCompleted >= current.lessonCount) {
            return 'mastered';
          }
          if (current.lessonsCompleted > 0) {
            return 'in_progress';
          }
          if (current.status === 'open') {
            return 'open';
          }
        }

        // Check unlock rule dynamically
        const meta = getTopic(topicId);
        if (!meta) return current?.status ?? 'locked';

        // Order 1 is always open
        if (meta.order === 1) return 'open';

        // Check previous topic in the same unit
        const sem = SYLLABUS[meta.semId];
        const unit = sem?.units.find((u) => u.id === meta.unitId);
        if (unit) {
          const prevTopic = unit.topics.find((t) => t.order === meta.order - 1);
          if (prevTopic) {
            const prevProgress = topics[prevTopic.id];
            if (
              prevProgress &&
              (prevProgress.lessonsCompleted >= 1 ||
                prevProgress.status === 'in_progress' ||
                prevProgress.status === 'mastered')
            ) {
              return 'open';
            }
          }
        }

        return current?.status ?? 'locked';
      },
    }),
    {
      name: 'accountancy_assassin_topic_progress',
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);
