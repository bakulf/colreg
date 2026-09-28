/**
 * Registers the service worker, and tells the app when a new version is
 * ready so it can offer a reload instead of swapping code mid-quiz.
 *
 * Only in a production build: in development Vite serves modules on the fly
 * and a worker caching them would get in the way.
 */
type Apply = () => void;

let ready: Apply | null = null;
const listeners = new Set<(apply: Apply | null) => void>();

function onUpdate(apply: Apply): void {
  ready = apply;
  for (const l of listeners) l(apply);
}

/** Calls back with a function that reloads onto the new version, once one is waiting. */
export function subscribeToUpdate(listener: (apply: Apply | null) => void): () => void {
  listeners.add(listener);
  listener(ready);
  return () => listeners.delete(listener);
}

export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  const base = import.meta.env.BASE_URL;
  let applying = false;

  // The new worker takes control after it is told to; reload onto it then,
  // and only then — the first install also changes controller, and that must
  // not reload a page someone has just opened.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (applying) window.location.reload();
  });

  const offer = (worker: ServiceWorker) =>
    onUpdate(() => {
      applying = true;
      worker.postMessage('skip-waiting');
    });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .then((registration) => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          offer(registration.waiting);
        }
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) offer(worker);
          });
        });
        // An app left open on a phone for days should still hear about
        // updates, not only on the next cold start.
        setInterval(() => void registration.update(), 60 * 60 * 1000);
      })
      .catch(() => {
        // No worker means no offline use, not a broken app.
      });
  });

  // Installed to the home screen, ask the browser not to evict the progress
  // in localStorage under storage pressure. Not asked in a plain tab, where
  // some browsers turn it into a permission prompt on first visit.
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) void navigator.storage?.persist?.();
}
