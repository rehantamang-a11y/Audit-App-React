const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/)
);

export function register(config) {
  // The service worker is only registered in production builds.
  // To test offline behaviour locally, run `npm run build` and serve the
  // build folder with a static server (e.g. `npx serve -s build`).
  // Running `npm start` will never activate the service worker by design.
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) return;

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      isLocalhost ? checkValidServiceWorker(swUrl, config) : registerValidSW(swUrl, config);
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl).then((registration) => {
    registration.onupdatefound = () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.onstatechange = () => {
        if (worker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            config?.onUpdate?.(registration);
          } else {
            config?.onReady?.(registration);
          }
        }
      };
    };
  }).catch((err) => console.error('SW registration error:', err));
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'navigation' } })
    .then((res) => {
      const ct = res.headers.get('content-type');
      if (res.status === 404 || (ct && !ct.includes('javascript'))) {
        navigator.serviceWorker.ready.then((r) => r.unregister()).then(() => window.location.reload());
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => console.log('Offline — app running from cache'));
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((r) => r.unregister()).catch(console.error);
  }
}
