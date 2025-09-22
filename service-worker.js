// Increment this version whenever you update your site
const CACHE_NAME = 'dashboard-cache-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css?v=1.0.2',
  './script.js?v=1.0.2',
  './favicon.ico'
];

// Install event - caching static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event - serve cached assets first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      // Optional: try network first for index.html to ensure latest UI
      if (event.request.url.endsWith('index.html')) {
        return fetch(event.request).catch(() => cachedRes);
      }
      return cachedRes || fetch(event.request);
    })
  );
});
