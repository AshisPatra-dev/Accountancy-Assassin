// ============================================================
// ACCOUNTANCY ASSASSIN — Application Entry Point
// Self-hosted fonts (@fontsource), service worker registration,
// and React root mounting. Zero CDN dependencies at runtime.
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ── Self-hosted font imports (No runtime CDN requests) ────
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/600.css';
import '@fontsource/newsreader/700.css';
import '@fontsource/hind-siliguri/400.css';
import '@fontsource/hind-siliguri/500.css';
import '@fontsource/hind-siliguri/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

// ── Global Design System CSS ────
import './index.css';

// ── PWA Service Worker Registration ────
import { registerPwaServiceWorker } from './lib/pwa';

// OWNER-CONFIRM: Base path for GitHub Pages deployment
const BASE_PATH = import.meta.env.BASE_URL || '/accountancy-assassin/';
registerPwaServiceWorker(BASE_PATH);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
