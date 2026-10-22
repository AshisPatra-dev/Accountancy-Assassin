// ============================================================
// ACCOUNTANCY ASSASSIN — Shelf (Home) Screen
// 3D Bookshelf with 4 physical Ledger Volumes:
// - Sem 1: Deep Crimson Cloth (Class XI)
// - Sem 2: Indigo Cloth (Class XI)
// - Sem 3: Forest Green Cloth (Class XII)
// - Sem 4: Charcoal + Brass Cloth (Class XII)
// Untouched volumes display physical cord binding.
// Includes 3D tilt effects, ruled-line streak ruler,
// Continue Card, Daily Strike Card, and 5-day backup nudge.
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { useI18n } from '@/i18n';
import { exportBackup } from '@/lib/storage';

interface LedgerVolumeConfig {
  sem: 1 | 2 | 3 | 4;
  titleKey: string;
  classKey: string;
  clothColor: string;
  clothAccent: string;
  width: number;
  height: number;
  spinePattern: string;
  topics: number;
}

const VOLUMES: LedgerVolumeConfig[] = [
  {
    sem: 1,
    titleKey: 'shelf.vol.sem1',
    classKey: 'shelf.vol.class11',
    clothColor: '#781519',
    clothAccent: '#A4161A',
    width: 72,
    height: 196,
    spinePattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08), transparent 70%)',
    topics: 44,
  },
  {
    sem: 2,
    titleKey: 'shelf.vol.sem2',
    classKey: 'shelf.vol.class11',
    clothColor: '#1A245C',
    clothAccent: '#27388A',
    width: 70,
    height: 184,
    spinePattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.07), transparent 70%)',
    topics: 39,
  },
  {
    sem: 3,
    titleKey: 'shelf.vol.sem3',
    classKey: 'shelf.vol.class12',
    clothColor: '#143D24',
    clothAccent: '#1F5C37',
    width: 74,
    height: 192,
    spinePattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08), transparent 70%)',
    topics: 34,
  },
  {
    sem: 4,
    titleKey: 'shelf.vol.sem4',
    classKey: 'shelf.vol.class12',
    clothColor: '#1A1C22',
    clothAccent: '#B8923F',
    width: 72,
    height: 188,
    spinePattern: 'radial-gradient(circle at 50% 30%, rgba(216,185,100,0.12), transparent 70%)',
    topics: 31,
  },
];

export function Shelf() {
  const navigate = useNavigate();
  const { streak, semesterProgress, backup, recordBackup, dismissBackupNudge, reducedMotion } =
    useStore();
  const { t } = useI18n();

  const [hoveredSem, setHoveredSem] = useState<number | null>(null);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  // Handle backup download
  const handleBackupNow = async () => {
    try {
      const backupJson = await exportBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `accountancy-assassin-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      recordBackup();
      setBackupNotice(t('storage.backup.success'));
      setTimeout(() => setBackupNotice(null), 4000);
    } catch (err) {
      console.error('Backup error:', err);
    }
  };

  const todayFormatted = React.useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  return (
    <div className="shelf-page">
      {/* ── Storage Warning / 5-Day Backup Nudge ── */}
      {backup.showBackupNudge && (
        <aside className="storage-nudge" role="alert" aria-live="polite">
          <div className="storage-nudge-content">
            <span className="storage-nudge-icon" aria-hidden="true">
              🛡️
            </span>
            <div className="storage-nudge-text">
              <strong>{t('storage.nudge.title')}</strong>
              <p>{t('storage.nudge.desc')}</p>
            </div>
          </div>
          <div className="storage-nudge-actions">
            <button
              type="button"
              className="btn btn-brass btn-sm"
              onClick={handleBackupNow}
            >
              {t('storage.nudge.backupNow')}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={dismissBackupNudge}
            >
              {t('storage.nudge.dismiss')}
            </button>
          </div>
        </aside>
      )}

      {backupNotice && (
        <div className="toast-notice" role="status">
          ✓ {backupNotice}
        </div>
      )}

      {/* ── 3D Ledger Bookshelf Hero ── */}
      <section className="shelf-hero" aria-label={t('shelf.hero.title')}>
        <div className="shelf-hero-header">
          <h1 className="shelf-title">{t('shelf.hero.title')}</h1>
          <p className="shelf-subtitle">{t('shelf.hero.subtitle')}</p>
        </div>

        {/* 3D Viewport Scene */}
        <div className="shelf-scene">
          <div className={`shelf-3d ${reducedMotion ? 'reduced-motion' : ''}`}>
            {VOLUMES.map((vol) => {
              const progress = semesterProgress[vol.sem];
              const isHovered = hoveredSem === vol.sem;
              const isSelected = selectedSem === vol.sem;
              const isUntouched = !progress.isStarted;

              return (
                <div
                  key={vol.sem}
                  className={`vol-container ${isHovered ? 'hovered' : ''} ${
                    isSelected ? 'selected' : ''
                  }`}
                  onMouseEnter={() => !reducedMotion && setHoveredSem(vol.sem)}
                  onMouseLeave={() => !reducedMotion && setHoveredSem(null)}
                  onClick={() => navigate(`/semester/${vol.sem}`)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isSelected}
                  aria-label={`${t(vol.titleKey)} — ${t(vol.classKey)} — ${
                    isUntouched ? t('shelf.vol.notStarted') : `${progress.percentage}%`
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/semester/${vol.sem}`);
                    }
                  }}
                >
                  {/* Physical 3D Book Spine */}
                  <div
                    className="vol-spine"
                    style={{
                      width: `${vol.width}px`,
                      height: `${vol.height}px`,
                      backgroundColor: vol.clothColor,
                      backgroundImage: `${vol.spinePattern}, var(--leather-texture)`,
                    }}
                  >
                    {/* Brass corner brackets */}
                    <span className="vol-corner tl" aria-hidden="true" />
                    <span className="vol-corner tr" aria-hidden="true" />
                    <span className="vol-corner bl" aria-hidden="true" />
                    <span className="vol-corner br" aria-hidden="true" />

                    {/* Untouched Cord Binding */}
                    {isUntouched && (
                      <div className="vol-cord-wrap" title={t('shelf.vol.cord')}>
                        <div className="vol-cord-vertical" />
                        <div className="vol-cord-horizontal top" />
                        <div className="vol-cord-horizontal bot" />
                        <div className="vol-cord-seal">
                          <span className="cord-knot" />
                        </div>
                      </div>
                    )}

                    {/* In-Progress Ribbon Bookmark */}
                    {!isUntouched && !progress.isMastered && (
                      <div className="vol-ribbon" title={t('shelf.vol.inProgress')} />
                    )}

                    {/* Mastered Wax / Brass Stamp */}
                    {progress.isMastered && (
                      <div className="vol-mastery-stamp" title={t('shelf.vol.mastered')}>
                        <span>✓</span>
                      </div>
                    )}

                    {/* Embossed Vertical Spine Typography */}
                    <div className="vol-spine-typography" aria-hidden="true">
                      <span className="vol-spine-class">{t(vol.classKey)}</span>
                      <span className="vol-spine-title">{t(vol.titleKey)}</span>
                      <span className="vol-spine-topics">{vol.topics} TOPICS</span>
                    </div>

                    {/* Right Book Joint / Page Edge 3D Illusion */}
                    <div className="vol-spine-depth" />
                  </div>

                  {/* Volume Label & Progress Pill below volume */}
                  <div className="vol-footer-tag">
                    <span className="vol-badge-text">
                      {isUntouched
                        ? t('shelf.vol.notStarted')
                        : `${progress.percentage}%`}
                    </span>
                    <div className="vol-ruled-meter">
                      <div
                        className="vol-ruled-fill"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Solid Mahogany / Brass Bookshelf Ledge */}
            <div className="shelf-board" aria-hidden="true">
              <div className="shelf-board-brass-strip" />
            </div>
          </div>
        </div>

        {/* Selected Volume Detail Card (Accessible Quick Action) */}
        {selectedSem && (
          <motion.div
            className="selected-vol-panel card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="selected-vol-header">
              <div>
                <span className="selected-vol-eyebrow">
                  {t(VOLUMES[selectedSem - 1].classKey)}
                </span>
                <h3 className="selected-vol-name">
                  {t(`sem.${selectedSem}.title`)}
                </h3>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedSem(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="selected-vol-desc">
              {semesterProgress[selectedSem as 1 | 2 | 3 | 4].isStarted
                ? `${semesterProgress[selectedSem as 1 | 2 | 3 | 4].topicsCompleted} / ${
                    VOLUMES[selectedSem - 1].topics
                  } ${t('shelf.vol.topics', { n: VOLUMES[selectedSem - 1].topics })}`
                : t('shelf.vol.cord')}
            </p>
            <div className="selected-vol-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (selectedSem) {
                    navigate(`/semester/${selectedSem}`);
                  }
                }}
              >
                {t('shelf.vol.open')}
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* ── Day Streak Section (Ruled Ledger Line) ── */}
      <section className="streak-section" aria-label={t('shelf.streak.label')}>
        <div className="streak-card card ruled-paper">
          <div className="streak-top-row">
            <div className="streak-left">
              <span className="streak-eyebrow">{t('shelf.streak.label')}</span>
              <p className="streak-quote">{t('shelf.streak.keepGoing')}</p>
            </div>
            <div className="streak-digits" aria-live="polite">
              <span className="num streak-number">{streak.days}</span>
              <span className="streak-unit">{t('shelf.streak.days', { n: streak.days })}</span>
            </div>
          </div>

          {/* Calibrated Ledger Ruler with 7-Day Tick Marks */}
          <div
            className="streak-ruler-track"
            role="progressbar"
            aria-valuenow={streak.days}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${streak.days} days streak`}
          >
            <div
              className="streak-ruler-bar"
              style={{ width: `${Math.min((streak.days / 50) * 100, 100)}%` }}
            />
            {/* 7-day milestone ticks */}
            <div className="streak-ticks" aria-hidden="true">
              {[7, 14, 21, 28, 35, 42, 49].map((milestone) => (
                <div
                  key={milestone}
                  className={`streak-tick ${streak.days >= milestone ? 'reached' : ''}`}
                  style={{ left: `${(milestone / 50) * 100}%` }}
                >
                  <span className="streak-tick-label">{milestone}d</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Action Cards ── */}
      <section className="quick-actions-section" aria-label="Action Cards">
        {/* Continue Reading / Active Unit Card */}
        <motion.div
          className="continue-card card"
          whileHover={reducedMotion ? {} : { translateY: -2 }}
          transition={{ duration: 0.18 }}
        >
          <div className="continue-card-content">
            <span className="continue-card-eyebrow">
              {t('shelf.continue.eyebrow')}
            </span>
            <h2 className="continue-card-title">
              {t('shelf.continue.unit')}
            </h2>
            <p className="continue-card-sub">
              {t('shelf.continue.detail')}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              navigate('/semester/1');
            }}
          >
            {t('shelf.continue.button')} →
          </button>
        </motion.div>

        {/* Daily Practice / Daily Strike Card */}
        <motion.div
          className="daily-strike-card card"
          whileHover={reducedMotion ? {} : { translateY: -2 }}
          transition={{ duration: 0.18 }}
        >
          <div className="daily-strike-icon-box" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--brass)"
              strokeWidth="2"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="daily-strike-info">
            <div className="daily-strike-title-row">
              <h2 className="daily-strike-title">{t('shelf.daily.title')}</h2>
              <span className="badge-tag">{t('shelf.daily.tag')}</span>
            </div>
            <p className="daily-strike-sub">
              {todayFormatted} · {t('shelf.daily.subtitle')}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              useStore.getState().touchStreak();
            }}
          >
            {t('shelf.daily.button')}
          </button>
        </motion.div>
      </section>

      {/* ── Shelf Footer: Privacy Statement & Board Disclaimer ── */}
      <footer className="shelf-footer" role="contentinfo">
        <div className="divider-brass" />
        <p className="privacy-statement">
          🔒 {t('privacy.statement')}
        </p>
        <p className="board-disclaimer">
          {t('privacy.disclaimer')}
        </p>
      </footer>
    </div>
  );
}
