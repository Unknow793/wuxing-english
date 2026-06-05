const CACHE = 'wuxing-english-v1';
const ASSETS = [
  'index.html',
  'css/style.css',
  'js/data.js',
  'js/speech.js',
  'js/app.js',
  'data_enriched.json',
  'manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
