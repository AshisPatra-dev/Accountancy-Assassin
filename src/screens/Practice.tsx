// ============================================================
// ACCOUNTANCY ASSASSIN — Practice Screen (Phase 1 Shell)
// Targeted drill selection by semester and unit.
// ============================================================

import React, { useState } from 'react';
import { useI18n } from '@/i18n';

interface UnitCardData {
  id: string;
  unitNum: number;
  semester: 1 | 2 | 3 | 4;
  titleKey: string;
  marksWeight: number;
  questionsTotal: number;
  completed: number;
}

const SAMPLE_UNITS: UnitCardData[] = [
  {
    id: 's1-u1',
    unitNum: 1,
    semester: 1,
    titleKey: 'sem.1.title',
    marksWeight: 10,
    questionsTotal: 25,
    completed: 0,
  },
  {
    id: 's1-u2',
    unitNum: 2,
    semester: 1,
    titleKey: 'sem.2.title',
    marksWeight: 15,
    questionsTotal: 40,
    completed: 0,
  },
  {
    id: 's2-u1',
    unitNum: 1,
    semester: 2,
    titleKey: 'sem.3.title',
    marksWeight: 20,
    questionsTotal: 35,
    completed: 0,
  },
  {
    id: 's2-u2',
    unitNum: 2,
    semester: 2,
    titleKey: 'sem.4.title',
    marksWeight: 15,
    questionsTotal: 30,
    completed: 0,
  },
];

export function Practice() {
  const { t } = useI18n();
  const [activeSem, setActiveSem] = useState<1 | 2 | 3 | 4>(1);

  const filteredUnits = SAMPLE_UNITS.filter((u) => u.semester === activeSem);

  return (
    <div className="practice-screen page-container">
      <header className="screen-header">
        <h1 className="screen-title">{t('practice.title')}</h1>
        <p className="screen-subtitle">{t('practice.subtitle')}</p>
      </header>

      {/* Semester Filter Tabs */}
      <div className="filter-pill-row" role="tablist" aria-label="Select Semester">
        {([1, 2, 3, 4] as const).map((sem) => (
          <button
            key={sem}
            type="button"
            role="tab"
            aria-selected={activeSem === sem}
            className={`filter-pill ${activeSem === sem ? 'active' : ''}`}
            onClick={() => setActiveSem(sem)}
          >
            {t(`shelf.vol.sem${sem}`)}
          </button>
        ))}
      </div>

      {/* Phase 2 Coming Soon Notice */}
      <div className="card ruled-paper banner-notice">
        <span className="banner-badge">Phase 2 Drill Engine</span>
        <h3 style={{ fontFamily: 'Newsreader, serif', margin: '6px 0' }}>
          {t('practice.unitSelect')}
        </h3>
        <p className="text-muted" style={{ fontSize: '0.88rem' }}>
          {t('practice.comingSoon')}
        </p>
      </div>

      {/* Unit Drill Cards List */}
      <div className="unit-card-grid">
        {filteredUnits.map((u) => (
          <div key={u.id} className="unit-card card">
            <div className="unit-card-header">
              <span className="unit-number-tag">UNIT {u.unitNum}</span>
              <span className="unit-marks-tag">{u.marksWeight} MARKS</span>
            </div>
            <h2 className="unit-card-title">{t(u.titleKey)}</h2>
            <div className="unit-meta-row">
              <span className="unit-q-count">
                {u.questionsTotal} Questions · MCQ & Calculations
              </span>
            </div>
            <div className="unit-card-footer">
              <button type="button" className="btn btn-secondary btn-sm" disabled>
                {t('shelf.daily.button')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
