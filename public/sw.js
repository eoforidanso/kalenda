/**
 * Kalenda Service Worker — v2
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Route                  │ Strategy                          │
 * ├─────────────────────────┼───────────────────────────────────┤
 * │  Hashed JS/CSS bundles  │ Cache-first (immutable)           │
 * │  Icons, fonts, images   │ Cache-first (long-lived assets)   │
 * │  index.html, manifest   │ Stale-while-revalidate            │
 * │  /api/*                 │ Network-first + cached fallback   │
 * │  /uploads/* (photos)    │ Cache-first (user content)        │
 * │  Navigation (SPA)       │ Stale-while-revalidate → shell    │
 * └─────────────────────────┴───────────────────────────────────┘
 */

const CACHE_VERSION = 'v2';
const SHELL_CACHE   = `kalenda-shell-${CACHE_VERSION}`;
const IMAGE_CACHE   = `kalenda-images-${CACHE_VERSION}`;
const DATA_CACHE    = `kalenda-data-${CACHE_VERSION}`;
const ALL_CACHES    = [SHELL_CACHE, IMAGE_CACHE, DATA_CACHE];

// API response max-age before network-first bypass (5 minutes)
const API_MAX_AGE_MS = 5 * 60 * 1000;

// Files to pre-cache on install (app shell)
const SHELL_ASSETS = [
  './',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** True if the URL looks like a Vite-hashed immutable asset (e.g. assets/index-A1B2C3.js) */
function isHashedAsset(url) {
  return /\/assets\/[^/]+-[0-9a-f]{8,}\.(js|css|woff2?|ttf|otf)$/i.test(url.pathname);
}

/** True if this is a browser navigation request (HTML page) */
function isNavigation(request) {
  return request.mode === 'navigate';
}

/** Stamp a cached response with the time it was stored */
function stampedResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cached-at', Date.now().toString());
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

/** How old (ms) is a cached response based on sw-cached-at header */
function cacheAge(response) {
  const at = response?.headers?.get('sw-cached-at');
  return at ? Date.now() - Number(at) : Infinity;
}

// ─── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !ALL_CACHES.includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── Fetch router ────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept GET over http(s)
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // 1. API — Network-first, stale cached fallback after max-age
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstWithCache(request));
    return;
  }

  // 2. Uploaded photos — Cache-first (user content, immutable by ID)
  if (url.pathname.startsWith('/uploads/')) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // 3. Vite hashed bundles + fonts — Cache-first (content-addressed, never change)
  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  // 4. HTML navigation + manifest + icons — Stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ─── Strategy: Cache-First ───────────────────────────────────────────────────
// Serve from cache immediately. Fetch + cache only on miss.
// Best for: immutable assets (hashed JS/CSS), uploaded photos.
async function cacheFirst(request, cacheName = SHELL_CACHE) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Asset unavailable offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// ─── Strategy: Stale-While-Revalidate ────────────────────────────────────────
// Return cached version immediately (fast), then fetch + update cache in the
// background so the NEXT visit gets fresh content.
// Best for: HTML shell, manifest, icons — things that rarely change but must
// eventually update.
async function staleWhileRevalidate(request) {
  const cache  = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);

  // Always kick off a background revalidation
  const revalidate = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  // Serve stale immediately if we have it
  if (cached) return cached;

  // Nothing cached yet — wait for network
  const fresh = await revalidate;
  if (fresh) return fresh;

  // SPA fallback: serve the shell for any navigation
  if (isNavigation(request)) {
    const shell = await cache.match('./') ?? await cache.match('./index.html');
    if (shell) return shell;
  }

  return new Response('Kalenda is unavailable offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' },
  });
}

// ─── Strategy: Network-First with Cached Fallback ────────────────────────────
// Always try the network. On success, update the cache.
// If the cached copy is fresh enough (< API_MAX_AGE_MS), serve it while
// the network request runs (avoids waterfalls on slow connections).
// On network failure, serve whatever is cached.
// Best for: /api/ endpoints.
async function networkFirstWithCache(request) {
  const cache  = await caches.open(DATA_CACHE);
  const cached = await cache.match(request);
  const age    = cacheAge(cached);

  // Start network fetch immediately
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, stampedResponse(response.clone()));
      return response;
    })
    .catch(() => null);

  // If cache is very fresh, return it while network updates in background
  if (cached && age < API_MAX_AGE_MS) return cached;

  // Otherwise wait for network
  const network = await networkPromise;
  if (network) return network;

  // Network failed — return stale cache with a warning header if we have it
  if (cached) {
    const offlineHeaders = new Headers(cached.headers);
    offlineHeaders.set('x-sw-offline', 'true');
    return new Response(cached.body, {
      status: cached.status,
      statusText: cached.statusText,
      headers: offlineHeaders,
    });
  }

  return new Response(
    JSON.stringify({ success: false, error: 'You are offline. Please reconnect.' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } },
  );
}

// ─── Push Notifications ──────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { data = { title: 'Kalenda', body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Kalenda', {
      body:    data.body   ?? '',
      icon:    data.icon   ?? './icon-192.png',
      badge:   './icon-192.png',
      tag:     data.tag    ?? 'kalenda-notification',
      data:    data.data   ?? {},
      vibrate: [200, 100, 200],
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url ?? './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(targetUrl) && 'focus' in c);
      if (existing) return existing.focus();
      return self.clients.openWindow(targetUrl);
    }),
  );
});
