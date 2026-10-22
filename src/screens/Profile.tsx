// ============================================================
// ACCOUNTANCY ASSASSIN — Profile Screen (Dossier & Settings)
// Student rank standing, appearance preferences, reduced-motion toggle,
// offline data export/import, and privacy guarantee statement.
// ============================================================

import React, { useRef, useState } from 'react';
import { useStore } from '@/store';
import { useI18n } from '@/i18n';
import { LanguageChip } from '@/components/LanguageChip';
import { ThemeToggle } from '@/components/ThemeToggle';
import { exportBackup, importBackup } from '@/lib/storage';

export function Profile() {
  const { streak, studySeconds, reducedMotion, setReducedMotion, resetStore, recordBackup } =
    useStore();
  const { t } = useI18n();

  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Export progress as JSON file
  const handleExport = async () => {
    try {
      const dataStr = await exportBackup();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `accountancy-assassin-vault-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      recordBackup();
      showToast(t('storage.backup.success'));
    } catch {
      showToast('Export failed.');
    }
  };

  // Import JSON file
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importBackup(text);
      if (res.success) {
        showToast(t('storage.backup.importSuccess'));
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast(t('storage.backup.importFailed'));
      }
    } catch {
      showToast(t('storage.backup.importFailed'));
    }
  };

  // Confirm and reset progress
  const handleReset = () => {
    if (window.confirm(t('profile.settings.resetConfirm'))) {
      resetStore();
      showToast('Progress reset.');
    }
  };

  const studyMinutes = Math.round(studySeconds / 60);

  return (
    <div className="profile-screen page-container">
      <header className="screen-header">
        <h1 className="screen-title">{t('profile.title')}</h1>
        <p className="screen-subtitle">{t('profile.subtitle')}</p>
      </header>

      {toast && (
        <div className="toast-notice" role="status">
          ✓ {toast}
        </div>
      )}

      {/* ── Student Assassin Standing ── */}
      <section className="card dossier-card ruled-paper">
        <div className="dossier-header">
          <div className="dossier-seal-badge stamp">
            AA
          </div>
          <div className="dossier-info">
            <h2 className="dossier-rank-title">{t('profile.rank.operative')}</h2>
            <p className="dossier-rank-sub">{t('profile.rank.sub')}</p>
          </div>
        </div>

        <div className="dossier-stats-grid">
          <div className="dossier-stat-box">
            <span className="stat-label">{t('profile.stats.streak')}</span>
            <span className="stat-value num">{streak.days}d</span>
          </div>
          <div className="dossier-stat-box">
            <span className="stat-label">{t('profile.stats.time')}</span>
            <span className="stat-value num">{studyMinutes}m</span>
          </div>
          <div className="dossier-stat-box">
            <span className="stat-label">{t('profile.stats.mastery')}</span>
            <span className="stat-value num">Tier 3</span>
          </div>
        </div>
      </section>

      {/* ── Ledger Settings & Preferences ── */}
      <section className="settings-section">
        <h2 className="settings-header">{t('profile.settings.title')}</h2>

        <div className="card settings-card">
          {/* Language Row */}
          <div className="settings-row">
            <div className="settings-meta">
              <span className="settings-label">{t('lang.title')}</span>
            </div>
            <LanguageChip variant="full" />
          </div>

          <div className="divider" />

          {/* Theme Row */}
          <div className="settings-row">
            <div className="settings-meta">
              <span className="settings-label">{t('theme.toggle')}</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="divider" />

          {/* Reduced Motion Toggle */}
          <div className="settings-row">
            <div className="settings-meta">
              <span className="settings-label">{t('profile.settings.reducedMotion')}</span>
              <span className="settings-hint">{t('profile.settings.reducedMotionSub')}</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                aria-label={t('profile.settings.reducedMotion')}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </section>

      {/* ── Offline Data Vault & Backup ── */}
      <section className="data-vault-section">
        <h2 className="settings-header">{t('profile.settings.backup')}</h2>

        <div className="card settings-card">
          <p className="text-muted" style={{ fontSize: '0.86rem', marginBottom: '14px' }}>
            {t('privacy.statement')}
          </p>

          <div className="data-actions-row">
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
              📥 {t('profile.settings.export')}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              📤 {t('profile.settings.import')}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={handleImportFile}
            />
          </div>

          <div className="divider" />

          <div>
            <button
              type="button"
              className="btn btn-crimson-outline btn-sm"
              onClick={handleReset}
            >
              ⚠ {t('profile.settings.reset')}
            </button>
          </div>
        </div>
      </section>

      {/* ── Privacy & Board Statement Footer ── */}
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
