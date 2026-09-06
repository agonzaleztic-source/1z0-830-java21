/* ============================================================
   Service worker.

   Cachea la app entera en la primera visita para que funcione
   sin conexión: en el metro, en el avión, donde sea.

   IMPORTANTE: sube el número de VERSION cada vez que cambies
   cualquier archivo. Si no, el navegador no detectará que este
   archivo ha cambiado y seguirá sirviendo la copia vieja.

   Este service worker YA NO se activa solo (nada de skipWaiting
   automático): se queda a la espera hasta que main.js le manda
   el mensaje SKIP_WAITING, que solo ocurre cuando el usuario
   pulsa "Actualizar" en el aviso de versión nueva. Así no le
   cambiamos el código bajo los pies a una pestaña abierta.
   ============================================================ */
const VERSION = 'v7';
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
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if(e.data === 'SKIP_WAITING') self.skipWaiting();
});

/* Primero la caché; si no está, red. Solo se guarda en caché una
   respuesta correcta (res.ok) del propio origen: nunca una externa,
   nunca un error, nunca una respuesta opaca de la que no se puede
   comprobar el estado. */
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const mismoOrigen = new URL(e.request.url).origin === self.location.origin;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if(mismoOrigen && res.ok){
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
      }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
