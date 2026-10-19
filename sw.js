/* Polski Szlak – Service Worker (übernommen aus GeoQuest sw.js, Phase 589-Muster):
   Seitenaufrufe network-first (immer aktuell), offline aus dem Cache. Version bei jedem Release erhöhen. */
var CACHE_NAME = 'polski-szlak-v1-10';
var ASSETS = ['./', './index.html', './impressum.html', './datenschutz.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return Promise.allSettled(ASSETS.map(function (u) { return cache.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || !/^https?:/.test(e.request.url)) return;
  if (e.request.url.indexOf('supabase.') >= 0) return; /* Geräte-Abgleich: nie aus dem Cache */
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(function (r) {
      if (r && r.status === 200) { var c = r.clone(); caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, c).catch(function () {}); }); }
      return r;
    }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (cached) {
    return cached || fetch(e.request).then(function (r) {
      if (r && r.status === 200 && (e.request.url.indexOf(self.location.origin) === 0 || /fonts\.(gstatic|googleapis)\.com/.test(e.request.url))) {
        var c = r.clone(); caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, c).catch(function () {}); });
      }
      return r;
    });
  }));
});
