const CACHE_NAME = 'boun-gpa-cache-v2';
const BASE = self.location.pathname.replace(/sw\.js$/, '');
const path = (p) => (p.startsWith('http') ? p : BASE + p.replace(/^\//, ''));
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/site.webmanifest',
  '/assets/favicon/favicon-32x32.png',
  '/assets/favicon/favicon-16x16.png',
  '/assets/favicon/apple-touch-icon.png',
  '/assets/favicon/android-chrome-192x192.png',
  '/assets/favicon/android-chrome-512x512.png'
].map(path);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          try {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          } catch {}
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});