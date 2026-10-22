// ============================================================
// ACCOUNTANCY ASSASSIN — i18n Context & Provider
// Supports: English ('en'), বাংলা ('bn'), Mixed ('mixed'), and extensible for Hindi ('hi')
// Structured so new languages can be added to catalogs without code changes.
// ============================================================

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { en } from './en';
import { bn } from './bn';
import { mixed } from './mixed';

export type Language = 'en' | 'bn' | 'mixed' | 'hi';

export type TranslationDictionary = Record<string, string>;

// Language catalog registry — Hindi ('hi') stubbed so it can be populated with zero code changes
const catalogs: Record<Language, TranslationDictionary> = {
  en,
  bn,
  mixed,
  hi: en, // Fallback to English until Hindi translations are loaded
};

export interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Pure translation function for use outside React tree if needed.
 */
export function translate(
  lang: Language,
  key: string,
  vars?: Record<string, string | number>
): string {
  const dictionary = catalogs[lang] || catalogs.en;
  let text = dictionary[key];
  if (text === undefined || text === '') {
    text = catalogs.en[key] ?? key;
  }

  if (vars) {
    Object.entries(vars).forEach(([k, val]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(val));
    });
  }

  return text;
}

interface I18nProviderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  children: ReactNode;
}

export function I18nProvider({ language, onLanguageChange, children }: I18nProviderProps) {
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      return translate(language, key, vars);
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage: onLanguageChange, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Provide a fail-safe fallback instead of throwing if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key: string, vars?: Record<string, string | number>) => translate('en', key, vars),
    };
  }
  return ctx;
}
