// ============================================================
// ACCOUNTANCY ASSASSIN — Micro-Lesson Presentation Engine
// 3D Ruled-Paper Page Turn animations, KaTeX formula typesetting,
// Glossary interactive triggers in Mixed mode, and Strike prompt.
// ============================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import { getTopic, TopicMeta } from '@/data/syllabus';
import { MicroLesson, ContentBlock } from '@/data/lessonSchema';
import { loadTopicLessons } from '@/data/contentLoader';
import { useProgressStore } from '@/store/progress';
import { useStore } from '@/store';
import { useI18n } from '@/i18n';
import { PageTurn } from '@/components/PageTurn';
import { GlossaryPopup } from '@/components/GlossaryPopup';

function KaTeXFormula({ latex, caption }: { latex: string; caption?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch {
        if (containerRef.current) containerRef.current.innerText = latex;
      }
    }
  }, [latex]);

  return (
    <div className="formula-box card">
      <div ref={containerRef} className="katex-display" />
      {caption && <span className="formula-caption">{caption}</span>}
    </div>
  );
}

export function LessonPage() {
  const { semId: rawSemId, topicId, lessonOrder: rawLessonOrder } = useParams<{
    semId: string;
    topicId: string;
    lessonOrder: string;
  }>();

  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { completeMicroLesson, recordStrike } = useProgressStore();
  const addStudySeconds = useStore((s) => s.addStudySeconds);

  const semId = (Number(rawSemId) || 1) as 1 | 2 | 3 | 4;
  const currentOrder = Number(rawLessonOrder) || 1;

  const [lessons, setLessons] = useState<MicroLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [turnDirection, setTurnDirection] = useState<'forward' | 'backward'>('forward');
  const [showStrikePrompt, setShowStrikePrompt] = useState(false);

  // Glossary popup state
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);
  const [glossaryAnchor, setGlossaryAnchor] = useState<DOMRect | null>(null);

  // Load lessons for this topic
  useEffect(() => {
    let isMounted = true;
    if (topicId) {
      setLoading(true);
      loadTopicLessons(topicId).then((loaded) => {
        if (isMounted) {
          setLessons(loaded);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [topicId]);

  // Track study time
  useEffect(() => {
    const timer = setInterval(() => {
      addStudySeconds(5);
    }, 5000);
    return () => clearInterval(timer);
  }, [addStudySeconds]);

  const topicMeta: TopicMeta | undefined = topicId ? getTopic(topicId) : undefined;
  const currentLesson: MicroLesson | undefined = lessons.find((l) => l.order === currentOrder);
  const totalLessons = lessons.length || topicMeta?.lessonCount || 12;

  // Track completed lesson
  useEffect(() => {
    if (topicId && currentLesson) {
      completeMicroLesson(topicId, currentLesson.order);
    }
  }, [topicId, currentLesson, completeMicroLesson]);

  const handlePrev = () => {
    if (currentOrder > 1) {
      setTurnDirection('backward');
      navigate(`/semester/${semId}/topic/${topicId}/lesson/${currentOrder - 1}`);
    }
  };

  const handleNext = () => {
    if (currentOrder < totalLessons) {
      setTurnDirection('forward');
      navigate(`/semester/${semId}/topic/${topicId}/lesson/${currentOrder + 1}`);
    } else {
      // Completed last lesson!
      if (topicId) {
        completeMicroLesson(topicId, totalLessons);
      }
      setShowStrikePrompt(true);
    }
  };

  const handleGlossaryClick = (termId: string, e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveGlossaryTerm(termId);
    setGlossaryAnchor(rect);
  };

  // Helper to render text with glossary term highlighting in Mixed mode
  const renderTextWithGlossary = (text: string, glossaryTerms?: string[]) => {
    if (!glossaryTerms || glossaryTerms.length === 0 || language !== 'mixed') {
      return text;
    }

    // Match terms
    const termMap: Record<string, string> = {
      accounting: 'Accounting',
      transaction: 'Transaction',
      journal: 'Journal',
      ledger: 'Ledger',
      'trial-balance': 'Trial Balance',
      'cash-book': 'Cash Book',
    };

    const searchPatterns = glossaryTerms
      .map((termId) => {
        const word = termMap[termId] || termId;
        return { termId, word };
      })
      .filter((p) => text.toLowerCase().includes(p.word.toLowerCase()));

    if (searchPatterns.length === 0) return text;

    // Split text by first match
    const parts: React.ReactNode[] = [];
    let remaining = text;

    for (const { termId, word } of searchPatterns) {
      const idx = remaining.toLowerCase().indexOf(word.toLowerCase());
      if (idx !== -1) {
        const before = remaining.substring(0, idx);
        const match = remaining.substring(idx, idx + word.length);
        remaining = remaining.substring(idx + word.length);

        if (before) parts.push(before);
        parts.push(
          <span
            key={`${termId}-${idx}`}
            className="glossary-term-highlight"
            onClick={(e) => handleGlossaryClick(termId, e)}
            role="button"
            tabIndex={0}
            title={`${word} — Tap for definition`}
          >
            {match}
          </span>
        );
      }
    }
    if (remaining) parts.push(remaining);

    return parts;
  };

  const renderBlock = (block: ContentBlock, idx: number) => {
    switch (block.type) {
      case 'text': {
        const content = t(block.key);
        const renderedText = renderTextWithGlossary(content, currentLesson?.glossaryTerms);

        if (block.style === 'rule-box') {
          return (
            <div key={idx} className="rule-box card ruled-paper">
              <div className="rule-box-header">
                <span className="rule-box-brass-tag">
                  {t('lesson.keyRules') || 'KEY RULES'}
                </span>
              </div>
              <div className={`rule-box-body ${language === 'bn' ? 'bengali-text' : ''}`}>
                {renderedText}
              </div>
            </div>
          );
        }

        if (block.style === 'callout') {
          return (
            <aside
              key={idx}
              className={`lesson-callout card ${language === 'bn' ? 'bengali-text' : ''}`}
            >
              {renderedText}
            </aside>
          );
        }

        return (
          <p
            key={idx}
            className={`lesson-paragraph ${language === 'bn' ? 'bengali-text' : ''}`}
          >
            {renderedText}
          </p>
        );
      }

      case 'formula': {
        const caption = block.caption ? t(block.caption) : undefined;
        return <KaTeXFormula key={idx} latex={block.latex} caption={caption} />;
      }

      case 'table': {
        return (
          <div key={idx} className="lesson-table-wrap card">
            <table className="ledger-table">
              <thead>
                <tr>
                  {block.headers.map((hKey, hIdx) => (
                    <th key={hIdx}>{t(hKey)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cellKey, cIdx) => (
                      <td
                        key={cIdx}
                        className={cIdx === 0 ? 'table-cell-bold' : ''}
                      >
                        {renderTextWithGlossary(t(cellKey), currentLesson?.glossaryTerms)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'list': {
        const isNumbered = block.style === 'numbered';
        const ListTag = isNumbered ? 'ol' : 'ul';
        return (
          <ListTag
            key={idx}
            className={`lesson-list ${isNumbered ? 'numbered-list' : 'bullet-list'}`}
          >
            {block.items.map((itemKey, itemIdx) => (
              <li
                key={itemIdx}
                className={language === 'bn' ? 'bengali-text' : ''}
              >
                {renderTextWithGlossary(t(itemKey), currentLesson?.glossaryTerms)}
              </li>
            ))}
          </ListTag>
        );
      }

      case 'animation_hook': {
        return (
          <div key={idx} className="animation-hook-placeholder card">
            <div className="animation-hook-icon" aria-hidden="true">
              🎬
            </div>
            <div className="animation-hook-text">
              <strong>Animation: {block.animationId}</strong>
              <p>{t('lesson.animationComingSoon') || 'Visual breakdown coming in Phase 8.'}</p>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const progressFraction = (currentOrder / totalLessons) * 100;

  if (loading) {
    return (
      <div className="lesson-loading-state page-container">
        <div className="ledger-leaf-loader" />
        <p>{t('lesson.loading') || 'Unsealing micro-lesson...'}</p>
      </div>
    );
  }

  return (
    <div className="lesson-screen">
      {/* ── Top Bar ── */}
      <header className="lesson-top-bar">
        <div className="lesson-top-controls">
          <button
            type="button"
            className="btn-back-topic"
            onClick={() => navigate(`/semester/${semId}`)}
            aria-label="Back to Semester Map"
          >
            ←
          </button>
          <div className="lesson-topic-info">
            <span className="lesson-topic-id num">{topicId}</span>
            <h2 className="lesson-topic-title">
              {topicMeta ? (language === 'bn' ? topicMeta.titleBn : topicMeta.title) : topicId}
            </h2>
          </div>
          <div className="lesson-counter-pill num">
            L{String(currentOrder).padStart(2, '0')} / {totalLessons}
          </div>
        </div>

        {/* Teal Fill Progress Line */}
        <div
          className="lesson-progress-bar-track"
          role="progressbar"
          aria-valuenow={progressFraction}
        >
          <div
            className="lesson-progress-bar-fill"
            style={{ width: `${progressFraction}%` }}
          />
        </div>
      </header>

      {/* ── Main Lesson Page 3D Viewport ── */}
      <main className="lesson-content-viewport">
        <PageTurn pageKey={currentOrder} direction={turnDirection}>
          <article className="lesson-page-canvas ruled-paper">
            {/* Red margin guideline spacer */}
            <div className="ruled-page-content">
              {/* Lesson kind & title banner */}
              <div className="lesson-title-banner">
                <span className="lesson-kind-badge">
                  {currentLesson?.kind.toUpperCase() || 'THEORY'}
                </span>
                <h1 className="lesson-heading">
                  {currentLesson ? t(currentLesson.titleKey) : `Lesson ${currentOrder}`}
                </h1>
                {currentLesson?.minutes && (
                  <span className="lesson-time-estimate">
                    ⏱ {currentLesson.minutes} {t('lesson.minutes') || 'min read'}
                  </span>
                )}
              </div>

              {/* Render content blocks */}
              <div className="lesson-blocks-flow">
                {currentLesson?.blocks.map((block, idx) => renderBlock(block, idx))}
              </div>
            </div>
          </article>
        </PageTurn>
      </main>

      {/* ── Bottom Navigation Controls ── */}
      <footer className="lesson-bottom-nav">
        <button
          type="button"
          className="btn btn-secondary btn-nav-prev"
          onClick={handlePrev}
          disabled={currentOrder <= 1}
        >
          ← {t('lesson.prev') || 'Previous'}
        </button>

        <button
          type="button"
          className="btn btn-primary btn-nav-next"
          onClick={handleNext}
        >
          {currentOrder >= totalLessons
            ? t('lesson.complete') || 'Complete Lesson'
            : `${t('lesson.next') || 'Next'} →`}
        </button>
      </footer>

      {/* ── Glossary Popup Modal ── */}
      {activeGlossaryTerm && (
        <GlossaryPopup
          termId={activeGlossaryTerm}
          anchorRect={glossaryAnchor}
          onClose={() => {
            setActiveGlossaryTerm(null);
            setGlossaryAnchor(null);
          }}
        />
      )}

      {/* ── Strike Prompt Overlay ── */}
      {showStrikePrompt && (
        <div className="strike-prompt-overlay" role="dialog" aria-modal="true">
          <div className="strike-prompt-card card">
            <div className="strike-prompt-icon" aria-hidden="true">
              🎯
            </div>
            <h3 className="strike-prompt-title">
              {t('strike.prompt.title') || 'Topic Mastered! Ready for the Strike?'}
            </h3>
            <p className="strike-prompt-desc">
              {t('strike.prompt.desc') ||
                '10 rapid-fire exam questions to lock in this topic. Score 80%+ to earn your Gold Seal.'}
            </p>
            <div className="strike-prompt-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (topicId) {
                    recordStrike(topicId, 0.9); // Practice strike test demonstration
                  }
                  navigate(`/semester/${semId}`);
                }}
              >
                {t('strike.prompt.now') || 'Strike Now'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowStrikePrompt(false);
                  navigate(`/semester/${semId}`);
                }}
              >
                {t('strike.prompt.later') || 'Later'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonPage;
