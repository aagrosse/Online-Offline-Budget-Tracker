const FILES_TO_CACHE = [
    "/",
    "index.html",
    "/assets/css/style.css",
    "index.js",
    "db.js"
  ]
  
  const PRECACHE = 'precache-v1';
  const RUNTIME = 'runtime';
  
  self.addEventListener("install", event => {
    event.waitUntil(
      caches.open(PRECACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
  self.addEventListener("activate", event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
  });

  self.addEventListener("fetch", function (event) {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match(event.request).then(function (response) {
          if (response) {
            return response;
          } else if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/index.html");
          }
        });
      })
    );
  });