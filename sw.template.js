// Plantilla del service worker. build.mjs reemplaza la versión y la lista de archivos y genera dist/sw.js.
//
// Estrategia:
//   - Al instalarse guarda todos los archivos del sitio.
//   - Páginas: muestra al instante la versión guardada y, en segundo plano, descarga la nueva
//     (si no hay ninguna guardada, usa la red).
//   - Resto de archivos del sitio: primero lo guardado; si no está, la red.
//   - Cada compilación nueva cambia la versión y borra la caché anterior.
//   - Solo atiende las rutas del portafolio: otros proyectos publicados en el mismo dominio no se tocan.

const CACHE = 'portafolio-__VERSION__';
const PRECACHE = __PRECACHE__;
const ROOT = new URL('./', self.location).pathname;
const PRECACHE_PATHS = new Set(PRECACHE.map((path) => new URL(path, self.location).pathname));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const saveCopy = (request, response) => {
  if (response && response.ok) {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Solo se encarga del portafolio. Otras páginas del mismo dominio
  // (por ejemplo /propuesta-royal-kings/) van directo a la red, sin pasar por esta caché.
  const own = url.pathname === ROOT || url.pathname === `${ROOT}index.html` || PRECACHE_PATHS.has(url.pathname);
  if (!own) return;

  if (request.mode === 'navigate') {
    const network = fetch(request).then((response) => saveCopy('./', response));
    event.respondWith(
      caches.match('./').then((cached) => {
        if (cached) {
          event.waitUntil(network.catch(() => undefined));
          return cached;
        }
        return network;
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => saveCopy(request, response))),
  );
});
