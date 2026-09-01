/* ============================================================
   Service worker.

   Cachea la app entera en la primera visita para que funcione
   sin conexión: en el metro, en el avión, donde sea.

   IMPORTANTE: sube el número de VERSION cada vez que cambies
   cualquier archivo. Si no, el navegador seguirá sirviendo la
   copia vieja y no verás tus cambios.
   ============================================================ */
const VERSION = 'v3';
const CACHE = '1z0830-' + VERSION;

const ARCHIVOS = [
  '.',
  'index.html',
  'css/styles.css',
  'js/storage.js',
  'js/data.js',
  'js/questions.js',
  'js/theory.js',
  'js/app.js',
  'js/main.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Primero la caché; si no está, red. La app no depende de nada externo. */
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
