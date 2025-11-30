const CACHE_NAME = 'flexspace-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://aframe.io/releases/1.5.0/aframe.min.js',
    'https://cdn.jsdelivr.net/gh/aframevr/aframe-ar/dist/aframe-ar.min.js',
    // 预缓存 AR 模型，确保离线可用
    'https://cdn.jsdelivr.net/gh/aframevr/aframe/examples/showcase/asset-management/models/robot.gltf',
    'https://cdn.jsdelivr.net/gh/aframevr/aframe/examples/showcase/asset-management/models/cubes.gltf'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
