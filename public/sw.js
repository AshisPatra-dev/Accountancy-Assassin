// ============================================================
// ACCOUNTANCY ASSASSIN — Service Worker
// Precaches app shell, caches semester content chunks lazily.
// Works completely offline with zero external network dependencies.
// ============================================================

const CACHE_VERSION = 'aa-v1.0.0';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const CONTENT_CACHE = `${CACHE_VERSION}-content`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Pre-cached App Shell Assets
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
];

// Install Event: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[SW] Precache failed:', err);
      })
  );
});

// Activate Event: Clear Stale Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !name.startsWith(CACHE_VERSION))
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event: Routing & Caching Strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle HTTP/HTTPS requests
  if (!url.protocol.startsWith('http')) return;

  // 1. Semester content chunks (e.g., /content/sem1.json): Cache-First lazy caching
  if (url.pathname.includes('/content/sem') && url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.open(CONTENT_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return new Response(JSON.stringify({ error: 'Content unavailable offline' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
          });
        }
      })
    );
    return;
  }

  // 2. Static bundled assets (js, css, fonts, svg, woff2): Cache-First
  if (
    url.pathname.match(/\.(js|css|woff2|woff|ttf|svg|png|jpg|webp)$/) ||
    url.pathname.includes('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Navigation / HTML requests: Stale-While-Revalidate with fallback to index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(SHELL_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(async () => {
          const cachedNavigate = await caches.match(request);
          if (cachedNavigate) return cachedNavigate;
          const fallbackShell = await caches.match('./index.html');
          return fallbackShell || Response.error();
        })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request).catch(async () => {
      const fallback = await caches.match(request);
      return fallback || Response.error();
    })
  );
});
