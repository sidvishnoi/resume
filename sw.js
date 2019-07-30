// @ts-check
const __version = "42849ae";
const CACHE = "resume#" + __version;

const sw = /** @type {ServiceWorkerGlobalScope} */ (self);

sw.addEventListener("install", () => sw.skipWaiting());

sw.addEventListener("fetch", async event => {
  if (new URL(event.request.url).hostname !== location.hostname) {
    return;
  }

  event.respondWith(
    caches
      .open(CACHE)
      .then(cache => cache.match(event.request))
      .then(cached => {
        if (event.request.headers.get("content-type") !== "text/html") {
          return cached || fetchAndCache(event.request);
        } else {
          // return cached response immediately and meanwhile pull
          // a network response and store that in the cache for next time.
          const networked = fetchAndCache(event.request);
          return cached || networked;
        }
      }),
  );

  /** @param {FetchEvent['request']} request */
  async function fetchAndCache(request) {
    const response = await fetch(request);
    const cacheCopy = response.clone();
    const cache = await caches.open(CACHE);
    await cache.put(request, cacheCopy);
    return response;
  }
});

sw.addEventListener("activate", async () => {
  const keys = await caches.keys();
  const toDelete = keys.filter(key => key !== CACHE);
  await Promise.all(toDelete.map(key => caches.delete(key)));
});

async function requestRefresh() {
  const clients = await sw.clients.matchAll();
  clients.forEach(client => client.postMessage("refresh"));
}
