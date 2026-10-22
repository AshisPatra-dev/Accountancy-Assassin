// ============================================================
// ACCOUNTANCY ASSASSIN — Main App Root
// HashRouter (react-router-dom v6), i18n Context, Theme Synchronization,
// Reduced Motion enforcement, and TopBar/BottomNav Chrome.
// Routes: Shelf (/), SemesterMap (/semester/:semId),
// LessonPage (/semester/:semId/topic/:topicId/lesson/:lessonOrder).
// ============================================================

import React, { useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { useStore } from '@/store';
import { I18nProvider, useI18n } from '@/i18n';
import { Logo } from '@/components/Logo';
import { LanguageChip } from '@/components/LanguageChip';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomNav } from '@/components/BottomNav';
import { Shelf } from '@/screens/Shelf';
import { Practice } from '@/screens/Practice';
import { MockTests } from '@/screens/MockTests';
import { Profile } from '@/screens/Profile';

const SemesterMap = React.lazy(() => import('@/screens/SemesterMap'));
const LessonPage = React.lazy(() => import('@/screens/LessonPage'));

function TopBar() {
  const { t } = useI18n();

  return (
    <header className="top-bar">
      <Link to="/" className="top-bar-logo" aria-label={t('app.name')}>
        <Logo size={36} variant="full" />
        <div className="top-bar-branding">
          <span className="top-bar-title">
            ACCOUNTANCY <span>ASSASSIN</span>
          </span>
          <span className="top-bar-tagline">{t('app.tagline')}</span>
        </div>
      </Link>
      <div className="top-bar-controls">
        <LanguageChip variant="compact" />
        <ThemeToggle />
      </div>
    </header>
  );
}

function PageSuspenseFallback() {
  return (
    <div className="page-loader-screen">
      <div className="ledger-leaf-loader" />
    </div>
  );
}

function AppShell() {
  const { theme, language, reducedMotion, touchStreak } = useStore();

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply reduced-motion preference
  useEffect(() => {
    const isSystemReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldReduce = reducedMotion || isSystemReduced;

    document.documentElement.setAttribute(
      'data-reduced-motion',
      shouldReduce ? 'true' : 'false'
    );
  }, [reducedMotion]);

  // Apply language code to HTML tag for typography rules
  useEffect(() => {
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
  }, [language]);

  // Check in streak on app launch
  useEffect(() => {
    touchStreak();
  }, [touchStreak]);

  return (
    <div className="app-shell">
      <TopBar />
      <main className="page" id="main-content" tabIndex={-1}>
        <Suspense fallback={<PageSuspenseFallback />}>
          <Routes>
            <Route path="/" element={<Shelf />} />
            <Route path="/semester/:semId" element={<SemesterMap />} />
            <Route
              path="/semester/:semId/topic/:topicId/lesson/:lessonOrder"
              element={<LessonPage />}
            />
            <Route path="/practice" element={<Practice />} />
            <Route path="/mock-tests" element={<MockTests />} />
            <Route path="/mocks" element={<MockTests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Shelf />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);

  return (
    <I18nProvider language={language} onLanguageChange={setLanguage}>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </I18nProvider>
  );
}
