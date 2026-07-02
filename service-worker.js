/**
 * BOUN GPA Calculator - Service Worker
 * Enables offline functionality and caching
 */

// Bump this version when deploying changes to force cache refresh for returning visitors
const CACHE_NAME = 'boun-pusula-v3.0.0';
const OFFLINE_URL = '/boun-gpa-calculator/index.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/boun-gpa-calculator/',
    '/boun-gpa-calculator/index.html',
    '/boun-gpa-calculator/styles.css',
    '/boun-gpa-calculator/src/main.js',
    '/boun-gpa-calculator/src/state.js',
    '/boun-gpa-calculator/src/i18n.js',
    '/boun-gpa-calculator/src/grades.js',
    '/boun-gpa-calculator/src/gpa.js',
    '/boun-gpa-calculator/src/ui.js',
    '/boun-gpa-calculator/src/charts.js',
    '/boun-gpa-calculator/src/features.js',
    '/boun-gpa-calculator/src/store.js',
    '/boun-gpa-calculator/src/pusula-utils.js',
    '/boun-gpa-calculator/src/campus-seed.js',
    '/boun-gpa-calculator/src/schedule.js',
    '/boun-gpa-calculator/src/planner.js',
    '/boun-gpa-calculator/src/notes.js',
    '/boun-gpa-calculator/src/campus.js',
    '/boun-gpa-calculator/src/gradeGuide.js',
    '/boun-gpa-calculator/src/home.js',
    '/boun-gpa-calculator/site.webmanifest',
    '/boun-gpa-calculator/assets/images/boun-logo.png',
    '/boun-gpa-calculator/assets/favicon/favicon.ico',
    '/boun-gpa-calculator/assets/favicon/favicon-32x32.png',
    '/boun-gpa-calculator/assets/favicon/favicon-16x16.png',
    '/boun-gpa-calculator/assets/favicon/apple-touch-icon.png',
    '/boun-gpa-calculator/assets/favicon/android-chrome-192x192.png',
    '/boun-gpa-calculator/assets/favicon/android-chrome-512x512.png'
];

// External resources to cache on first request
const RUNTIME_CACHE_URLS = [
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
    'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap'
];

// Install event - precache assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching app shell...');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('[SW] Precaching complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Precaching failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName !== CACHE_NAME)
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Claiming clients...');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle navigation requests (HTML pages)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return caches.match(OFFLINE_URL);
                })
        );
        return;
    }
    
    // Handle API/CDN requests with network-first strategy
    if (url.hostname !== location.hostname) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the response
                    if (response.ok && RUNTIME_CACHE_URLS.some(cacheUrl => request.url.includes(cacheUrl))) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }
    
    // Handle static assets with cache-first strategy
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached response and update cache in background
                    event.waitUntil(
                        fetch(request)
                            .then((response) => {
                                if (response.ok) {
                                    caches.open(CACHE_NAME)
                                        .then((cache) => cache.put(request, response));
                                }
                            })
                            .catch(() => {})
                    );
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => cache.put(request, responseClone));
                        }
                        return response;
                    });
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Push notifications (not currently active — no push subscriptions are created in the app)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'BOUN GPA Hesaplayıcı',
            icon: '/boun-gpa-calculator/assets/favicon/android-chrome-192x192.png',
            badge: '/boun-gpa-calculator/assets/favicon/favicon-32x32.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'BOUN GPA', options)
        );
    }
});
