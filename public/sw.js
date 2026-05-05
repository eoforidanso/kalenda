/**
 * Kalenda Service Worker
 * Strategy:
 *   - App shell (HTML, JS, CSS, icons) → Cache-first, update in background
 *   - API calls (/api/)               → Network-first, offline JSON fallback
 *   - Image uploads (/uploads/)       → Cache-first (photos don't change)
 *   - Everything else                 → Network-first, fall back to cache
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE   = `kalenda-shell-${CACHE_VERSION}`;
const IMAGE_CACHE   = `kalenda-images-${CACHE_VERSION}`;
const ALL_CACHES    = [SHELL_CACHE, IMAGE_CACHE];

// Files to pre-cache on install (app shell)
const SHELL_ASSETS = [
  './',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
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

// ─── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET over http(s)
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // ── API calls: network-first, offline JSON response ──
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstApi(request));
    return;
  }

  // ── Uploaded photos: cache-first (immutable content) ──
  if (url.pathname.startsWith('/uploads/')) {
    event.respondWith(cacheFirstImage(request));
    return;
  }

  // ── App shell & static assets: cache-first, refresh in background ──
  event.respondWith(cacheFirstWithRefresh(request));
});

// ─── Strategies ─────────────────────────────────────────────────────────────

async function networkFirstApi(request) {
  try {
    return await fetch(request);
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'You are offline. Please reconnect.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

async function cacheFirstImage(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Image unavailable offline', { status: 503 });
  }
}

async function cacheFirstWithRefresh(request) {
  const cache  = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);

  // Start a background fetch to keep cache fresh
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  // Return cached immediately; if nothing cached, wait for network
  if (cached) return cached;

  const network = await networkFetch;
  if (network) return network;

  // Last resort: return cached index.html for SPA navigation
  const shell = await cache.match('./') || await cache.match('./index.html');
  if (shell) return shell;

  return new Response('Kalenda is unavailable offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' },
  });
}

// ─── Push Notifications ─────────────────────────────────────────────────────
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
