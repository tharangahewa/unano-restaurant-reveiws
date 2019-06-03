var staticCacheName = 'reviews-v5'

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'restaurant.html',
        'js/main.js',
        'js/dbhelper.js',
        'js/image_helper.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
        'https://use.fontawesome.com/releases/v5.8.2/css/all.css'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('reviews-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    //always match the url without the parameters 
    caches.match(event.request.url.split('?')[0]).then(function(response) {
      return response || fetch(event.request);
    })
  );
});