const CACHE_NAME = 'platespottr-cache-v1'
const urlsToCache = [
  '/',
  '/icons/logo.svg',
  '/icons/logo_x48.png',
  '/icons/logo_x96.png',
  '/icons/logo_x128.png',
  '/icons/logo_x192.png',
  '/icons/logo_x256.png',
  '/icons/logo_x512.png',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache)
    })
  )
})
self.addEventListener('activate', event => {
  console.log('[SW] Activated!', event)
})
