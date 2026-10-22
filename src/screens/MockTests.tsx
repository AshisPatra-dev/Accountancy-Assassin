// ============================================================
// ACCOUNTANCY ASSASSIN — Mock Tests Screen (Phase 1 Shell)
// Timed exam simulations following the official WBCHSE blueprint.
// ============================================================

import React from 'react';
import { useI18n } from '@/i18n';

interface MockExamCard {
  id: string;
  semester: 1 | 2 | 3 | 4;
  titleKey: string;
  classKey: string;
  marks: number;
  durationMin: number;
  mcqCount: number;
  caseCount: number;
}

const MOCK_EXAMS: MockExamCard[] = [
  {
    id: 'mock-sem1',
    semester: 1,
    titleKey: 'shelf.vol.sem1',
    classKey: 'shelf.vol.class11',
    marks: 40,
    durationMin: 80,
    mcqCount: 25,
    caseCount: 3,
  },
  {
    id: 'mock-sem2',
    semester: 2,
    titleKey: 'shelf.vol.sem2',
    classKey: 'shelf.vol.class11',
    marks: 40,
    durationMin: 80,
    mcqCount: 25,
    caseCount: 3,
  },
  {
    id: 'mock-sem3',
    semester: 3,
    titleKey: 'shelf.vol.sem3',
    classKey: 'shelf.vol.class12',
    marks: 40,
    durationMin: 80,
    mcqCount: 20,
    caseCount: 4,
  },
  {
    id: 'mock-sem4',
    semester: 4,
    titleKey: 'shelf.vol.sem4',
    classKey: 'shelf.vol.class12',
    marks: 40,
    durationMin: 80,
    mcqCount: 20,
    caseCount: 4,
  },
];

export function MockTests() {
  const { t } = useI18n();

  return (
    <div className="mocks-screen page-container">
      <header className="screen-header">
        <h1 className="screen-title">{t('mock.title')}</h1>
        <p className="screen-subtitle">{t('mock.subtitle')}</p>
      </header>

      {/* Blueprint Overview Card */}
      <div className="card ruled-paper banner-notice">
        <div className="blueprint-header-row">
          <span className="banner-badge">WBCHSE Official Pattern</span>
          <span className="blueprint-stamp stamp">40 MARKS</span>
        </div>
        <h3 style={{ fontFamily: 'Newsreader, serif', margin: '8px 0 4px' }}>
          {t('mock.semBlueprint')}
        </h3>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          {t('mock.comingSoon')}
        </p>
      </div>

      {/* Mock Exam Papers Grid */}
      <div className="mocks-grid">
        {MOCK_EXAMS.map((exam) => (
          <div key={exam.id} className="card mock-paper-card">
            <div className="mock-card-top">
              <span className="mock-class-tag">{t(exam.classKey)}</span>
              <span className="mock-duration-badge">⏱ {exam.durationMin} MINS</span>
            </div>
            <h2 className="mock-exam-title">{t(exam.titleKey)} Full Mock</h2>
            <div className="mock-breakdown-row">
              <span className="mock-stat-item">
                <strong>{exam.marks}</strong> Total Marks
              </span>
              <span className="mock-stat-item">
                <strong>{exam.mcqCount}</strong> MCQs
              </span>
              <span className="mock-stat-item">
                <strong>{exam.caseCount}</strong> Calculations
              </span>
            </div>
            <div className="mock-card-action">
              <button type="button" className="btn btn-secondary btn-sm" disabled>
                Locked (Phase 3)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
