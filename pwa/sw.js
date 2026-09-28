/*
 * The service worker. A template: the build replaces the two placeholders with
 * the exact list of files it emitted and a hash of their contents, so every
 * deploy is a new worker with a new cache and nothing stale survives it.
 *
 * Strategy: everything the app needs is precached at install, and served from
 * the cache first. The files are content-hashed, so a cached file is never out
 * of date — a new build simply has different names. Navigation always gets
 * the cached index.html, which is what makes a cold start work with no
 * network at all.
 *
 * A new worker waits rather than taking over, until the page asks it to: the
 * app shows a "new version" prompt, so an update never swaps the code under a
 * quiz in progress.
 */

const VERSION = __VERSION__;
const PRECACHE = __PRECACHE__;
const CACHE = `colreg-${VERSION}`;

const scoped = (path) => new URL(path, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map(scoped))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k.startsWith('colreg-') && k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // ignoreVary: servers send Vary (Origin, Accept-Encoding), and module
  // scripts are requested with an Origin header the precache request did not
  // have, so honouring Vary would miss every script. The files are
  // content-hashed, so there is only ever one right answer for a URL.
  const match = { ignoreVary: true };
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(scoped('index.html'), match).then((cached) => cached ?? fetch(request)),
    );
    return;
  }
  event.respondWith(caches.match(request, match).then((cached) => cached ?? fetch(request)));
});
