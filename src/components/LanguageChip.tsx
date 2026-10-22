// ============================================================
// ACCOUNTANCY ASSASSIN — Language Switcher Chip Group
// Offers quick selection between English, বাংলা (Bengali), and Mixed modes.
// ============================================================

import React from 'react';
import { useI18n, Language } from '@/i18n';

export interface LanguageChipProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function LanguageChip({ className = '', variant = 'compact' }: LanguageChipProps) {
  const { language, setLanguage, t } = useI18n();

  const options: { id: Language; labelKey: string; shortKey: string }[] = [
    { id: 'en', labelKey: 'lang.en', shortKey: 'lang.en.short' },
    { id: 'bn', labelKey: 'lang.bn', shortKey: 'lang.bn.short' },
    { id: 'mixed', labelKey: 'lang.mixed', shortKey: 'lang.mixed.short' },
  ];

  return (
    <div
      className={`lang-chip-group ${className}`}
      role="radiogroup"
      aria-label={t('lang.title')}
    >
      {options.map((opt) => {
        const isSelected = language === opt.id;
        const displayText = variant === 'full' ? t(opt.labelKey) : t(opt.shortKey);

        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`lang-chip ${isSelected ? 'active' : ''}`}
            onClick={() => setLanguage(opt.id)}
            title={t(opt.labelKey)}
          >
            {displayText}
          </button>
        );
      })}
    </div>
  );
}
