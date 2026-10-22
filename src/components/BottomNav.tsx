// ============================================================
// ACCOUNTANCY ASSASSIN — Bottom Navigation
// Four core tabs: Shelf (Home), Practice, Mock Tests, Profile
// Fixed bottom dock with tactile ledger styling.
// ============================================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '@/i18n';

interface TabItem {
  path: string;
  labelKey: string;
  icon: (active: boolean) => React.ReactNode;
}

export function BottomNav() {
  const { t } = useI18n();

  const tabs: TabItem[] = [
    {
      path: '/',
      labelKey: 'nav.shelf',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {/* Bookshelf volumes */}
          <rect x="3" y="18" width="18" height="2.5" rx="1" fill={active ? 'var(--brass)' : 'none'} stroke={active ? 'var(--brass)' : 'currentColor'} />
          <path d="M5 18V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12" fill={active ? 'rgba(164,22,26,0.3)' : 'none'} stroke={active ? 'var(--brass)' : 'currentColor'} />
          <path d="M9 18V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14" fill={active ? 'rgba(30,43,106,0.3)' : 'none'} stroke={active ? 'var(--brass)' : 'currentColor'} />
          <path d="M13 18V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11" fill={active ? 'rgba(27,67,44,0.3)' : 'none'} stroke={active ? 'var(--brass)' : 'currentColor'} />
        </svg>
      ),
    },
    {
      path: '/practice',
      labelKey: 'nav.practice',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {/* Nib & journal entry line */}
          <path d="M12 20h9" stroke={active ? 'var(--brass)' : 'currentColor'} />
          <path
            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
            fill={active ? 'rgba(184,146,63,0.2)' : 'none'}
            stroke={active ? 'var(--brass)' : 'currentColor'}
          />
          <circle cx="16.5" cy="5.5" r="0.5" fill={active ? 'var(--crimson)' : 'currentColor'} />
        </svg>
      ),
    },
    {
      path: '/mock-tests',
      labelKey: 'nav.mockTests',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {/* Clipboard with stopwatch stamp */}
          <rect x="4" y="3" width="16" height="18" rx="2" stroke={active ? 'var(--brass)' : 'currentColor'} fill={active ? 'rgba(184,146,63,0.1)' : 'none'} />
          <path d="M8 7h8M8 11h8M8 15h4" stroke={active ? 'var(--brass)' : 'currentColor'} />
          <circle cx="17" cy="16" r="3.5" fill="var(--surface)" stroke={active ? 'var(--crimson)' : 'currentColor'} strokeWidth="1.4" />
          <path d="M17 14.5v1.5l1 1" stroke={active ? 'var(--crimson)' : 'currentColor'} strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      path: '/profile',
      labelKey: 'nav.profile',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {/* Assassin Seal / Crest badge */}
          <circle cx="12" cy="8" r="4" fill={active ? 'rgba(184,146,63,0.2)' : 'none'} stroke={active ? 'var(--brass)' : 'currentColor'} />
          <path d="M5 20c0-3.8 3.1-7 7-7s7 3.2 7 7" stroke={active ? 'var(--brass)' : 'currentColor'} />
          <circle cx="12" cy="8" r="1.5" fill={active ? 'var(--crimson)' : 'currentColor'} />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main Navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              {tab.icon(isActive)}
              <span>{t(tab.labelKey)}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
