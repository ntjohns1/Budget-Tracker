const CACHE_NAME = "static-cache-v2";
const FILES_TO_CACHE = [
  "/",
  "index.html",
  "index.js",
  "service-worker.js",
  "manifest.webmanifest",
  "/assets/styles.css",
  "/assets/db.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.pngets/css/style.css",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
];

// install
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// activate
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function (evt) {
  const { request } = evt
  if (request.method === 'GET') {
    evt.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(evt.request).then(response => {
          return response || fetch(evt.request);
        });
      })
    );
  }
});
