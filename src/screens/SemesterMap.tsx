// ============================================================
// ACCOUNTANCY ASSASSIN — Semester Map Screen
// Physical account book opening interface. Ruled-ledger paper
// background with double red margin lines and brass ornaments.
// Displays Units, Mark Allocations, Hours, and Topic unlock rows.
// Handles Track selection for Semesters 3 & 4.
// ============================================================

import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SYLLABUS, SemesterMeta, UnitMeta, TopicMeta } from '@/data/syllabus';
import { useProgressStore, TopicStatus } from '@/store/progress';
import { useStore } from '@/store';
import { useI18n } from '@/i18n';
import { TrackSelector } from '@/components/TrackSelector';

export function SemesterMap() {
  const { semId: rawSemId } = useParams<{ semId: string }>();
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { tracks } = useStore();
  const { topics: progressTopics, initSemester, getTopicStatus } = useProgressStore();

  const semId = (Number(rawSemId) || 1) as 1 | 2 | 3 | 4;
  const semester: SemesterMeta | undefined = SYLLABUS[semId];

  const trackKey = semId === 3 ? 's3' : semId === 4 ? 's4' : null;
  const chosenTrack = trackKey ? tracks[trackKey].chosen : null;

  // Initialise semester topics on mount
  useEffect(() => {
    if (semester) {
      initSemester(semId, chosenTrack || undefined);
    }
  }, [semId, chosenTrack, initSemester, semester]);

  if (!semester) {
    return (
      <div className="semester-map-error page-container">
        <h2>{t('semester.notFound') || 'Semester volume not found.'}</h2>
        <Link to="/" className="btn btn-secondary">
          ← {t('nav.shelf')}
        </Link>
      </div>
    );
  }

  // Calculate semester completion percentage
  const totalTopics = useMemo(() => {
    return semester.units.reduce((acc, u) => {
      if (u.trackRequired && chosenTrack && u.trackRequired !== chosenTrack) {
        return acc;
      }
      return acc + u.topics.length;
    }, 0);
  }, [semester, chosenTrack]);

  const completedTopics = useMemo(() => {
    return semester.units.reduce((acc, u) => {
      if (u.trackRequired && chosenTrack && u.trackRequired !== chosenTrack) {
        return acc;
      }
      return (
        acc +
        u.topics.filter((top) => {
          const st = getTopicStatus(top.id);
          return st === 'mastered';
        }).length
      );
    }, 0);
  }, [semester, chosenTrack, getTopicStatus]);

  const semPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleTopicClick = (topic: TopicMeta, status: TopicStatus, isDisabledTrack: boolean) => {
    if (status === 'locked' || isDisabledTrack) return;
    const prog = progressTopics[topic.id];
    const nextLesson = Math.min((prog?.lessonsCompleted ?? 0) + 1, topic.lessonCount);
    navigate(`/semester/${semId}/topic/${topic.id}/lesson/${nextLesson}`);
  };

  return (
    <div className="semester-map-page">
      {/* ── Ruled Ledger Book Canvas ── */}
      <div className="ledger-book-wrap ruled-paper">
        {/* Book Left Brass Spine Edge accent */}
        <div className="ledger-book-spine-edge" aria-hidden="true" />

        {/* ── Top Header Bar ── */}
        <header className="ledger-map-header">
          <div className="ledger-header-nav">
            <button
              type="button"
              className="btn-back-shelf"
              onClick={() => navigate('/')}
              aria-label={t('nav.shelf')}
            >
              <span className="back-arrow" aria-hidden="true">
                ←
              </span>
              <span className="back-label">{t('nav.shelf')}</span>
            </button>
            <div className="ledger-header-badges">
              <span className="badge-marks">
                {semester.totalMarks} {t('semMap.marks') || 'Marks'}
              </span>
              <span className="badge-format">
                {semester.examFormat === 'mcq'
                  ? t('semMap.formatMcq') || 'MCQ Blueprint'
                  : t('semMap.formatWritten') || 'Descriptive Written'}
              </span>
            </div>
          </div>

          <div className="ledger-title-block">
            <span className="ledger-class-eyebrow">
              {semId <= 2 ? t('shelf.vol.class11') : t('shelf.vol.class12')} · WBCHSE
            </span>
            <h1 className="ledger-sem-heading">
              {language === 'bn' ? t(`sem.${semId}.title`) : semester.title}
            </h1>
          </div>

          {/* Progress summary ribbon */}
          <div className="ledger-summary-strip">
            <div className="ledger-summary-metrics">
              <span className="metrics-count">
                <strong>{completedTopics}</strong> / {totalTopics}{' '}
                {t('shelf.vol.topics', { n: totalTopics })}
              </span>
              <span className="metrics-percent num">{semPercentage}%</span>
            </div>
            <div className="ledger-meter-track" role="progressbar" aria-valuenow={semPercentage}>
              <div className="ledger-meter-fill" style={{ width: `${semPercentage}%` }} />
            </div>
          </div>

          {/* Brass Divider Ornament */}
          <div className="brass-divider" aria-hidden="true">
            <span className="brass-gem" />
          </div>
        </header>

        {/* ── Track Selector for S3 & S4 before Unit 3 ── */}
        {(semId === 3 || semId === 4) && (
          <section className="map-track-section card" style={{ margin: '16px 20px 24px 60px' }}>
            <TrackSelector sem={semId} />
          </section>
        )}

        {/* ── Units & Topics Sections ── */}
        <div className="ledger-units-container">
          {semester.units.map((unit: UnitMeta) => {
            const isTrackUnit = Boolean(unit.trackRequired);
            const isChosenTrack = unit.trackRequired === chosenTrack;
            const isOtherTrack = isTrackUnit && chosenTrack !== null && !isChosenTrack;
            const isNoTrackSelected = isTrackUnit && chosenTrack === null;

            return (
              <section
                key={unit.id}
                className={`unit-ledger-section ${isOtherTrack ? 'other-track' : ''}`}
                aria-labelledby={`unit-heading-${unit.id}`}
              >
                {/* Unit Header Row */}
                <div className="unit-header-row">
                  <div className="unit-title-group">
                    <span className="unit-id-pill">{unit.id}</span>
                    <h2 id={`unit-heading-${unit.id}`} className="unit-name">
                      {language === 'bn' ? unit.titleBn : unit.title}
                    </h2>
                  </div>
                  <div className="unit-meta-tags">
                    <span className="unit-tag-marks">
                      {unit.marks} {t('semMap.marks') || 'Marks'}
                    </span>
                    <span className="unit-tag-hours">
                      {unit.hours} {t('semMap.hours') || 'Hrs'}
                    </span>
                    {isOtherTrack && (
                      <span className="unit-tag-disabled">
                        {t('semMap.notYourTrack') || 'Alternative Track'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Notice if track not yet chosen */}
                {isNoTrackSelected && (
                  <div className="track-unselected-hint">
                    <em>
                      {t('track.chooseHint') ||
                        'Select a track above to unlock this unit.'}
                    </em>
                  </div>
                )}

                {/* Topics Vertical List */}
                <div className="topics-list" role="list">
                  {unit.topics.map((topic: TopicMeta) => {
                    const status = getTopicStatus(topic.id);
                    const progress = progressTopics[topic.id];
                    const isMastered = status === 'mastered';
                    const isInProgress = status === 'in_progress';
                    const isOpen = status === 'open';
                    const isLocked = status === 'locked' || isNoTrackSelected;
                    const isDisabledTrack = isOtherTrack || isNoTrackSelected;

                    const completedCount = progress?.lessonsCompleted ?? 0;

                    return (
                      <motion.div
                        key={topic.id}
                        role="listitem"
                        className={`topic-row status-${status} ${
                          isDisabledTrack ? 'disabled-track' : ''
                        }`}
                        onClick={() => handleTopicClick(topic, status, isDisabledTrack)}
                        whileHover={
                          !isDisabledTrack && !isLocked
                            ? { x: 3, transition: { duration: 0.15 } }
                            : undefined
                        }
                        tabIndex={!isDisabledTrack && !isLocked ? 0 : -1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleTopicClick(topic, status, isDisabledTrack);
                          }
                        }}
                        aria-disabled={isLocked || isDisabledTrack}
                        aria-label={`${topic.id}: ${topic.title} — ${status}`}
                      >
                        {/* Left Topic Order / Code */}
                        <div className="topic-col-id">
                          <span className="topic-code num">{topic.id.split('-').pop()}</span>
                          <span className="topic-type-tag" title={topic.type}>
                            {topic.type === 'T'
                              ? 'Theory'
                              : topic.type === 'N'
                              ? 'Num'
                              : 'Mix'}
                          </span>
                        </div>

                        {/* Center Topic Title & Progress */}
                        <div className="topic-col-content">
                          <span className="topic-title">
                            {language === 'bn' ? topic.titleBn : topic.title}
                          </span>

                          {isInProgress && (
                            <div className="topic-inline-progress">
                              <span className="progress-fraction num">
                                {completedCount} / {topic.lessonCount}{' '}
                                {t('semMap.lessons') || 'lessons'}
                              </span>
                              <div className="topic-micro-bar">
                                <div
                                  className="topic-micro-fill"
                                  style={{
                                    width: `${(completedCount / topic.lessonCount) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Status Indicator Icon */}
                        <div className="topic-col-status">
                          {isMastered && (
                            <div
                              className="stamp-mastered"
                              title={t('shelf.vol.mastered') || 'Mastered'}
                            >
                              <span className="stamp-icon">✓</span>
                            </div>
                          )}
                          {isInProgress && (
                            <span className="arrow-in-progress" aria-hidden="true">
                              →
                            </span>
                          )}
                          {isOpen && (
                            <span className="arrow-open" aria-hidden="true">
                              →
                            </span>
                          )}
                          {isLocked && (
                            <span className="icon-locked" aria-hidden="true">
                              🔒
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SemesterMap;
