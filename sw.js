// sw.js - Service Worker dengan Sistem Auto-Update Pintar
const CACHE_NAME = 'apotek-cache-v1';

// Senarai fail yang perlu disimpan (Asas)
const urlsToCache = ['./', 'index.html']; 

self.addEventListener('install', (event) => {
    // Memaksa Service Worker baru terus aktif tanpa menunggu tab ditutup
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Memadam cache lama...');
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Strategi: Ambil data dari internet dahulu, jika offline baru ambil dari cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});