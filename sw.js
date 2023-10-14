const cacheAppName = "cache-app-v2";
const cacheDynamicName = "cache-dynamic";
const assetsUrls = ["/", "/js/index.js", "/offline.html"];

self.addEventListener("install", async (evt) => {
  const cache = await caches.open(cacheAppName);

  await cache.addAll(assetsUrls);
});

self.addEventListener("activate", async () => {
  console.log("activate");
  const cacheNames = await caches.keys();
  console.log(cacheNames);
  await Promise.all([
    cacheNames
      .filter((name) => name !== cacheAppName)
      .filter((name) => name !== cacheDynamicName)
      .map((name) => {
        caches.delete(name);
      }),
  ]);
});

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
};

const networkFirst = async (request) => {
  const cache = await caches.open(cacheDynamicName);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    console.log("error");
    return cached ?? (await caches.match("/offline.html"));
  }
};

self.addEventListener("fetch", (evt) => {
  const { request } = evt;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    evt.respondWith(cacheFirst(evt.request));
  } else {
    evt.respondWith(networkFirst(evt.request));
  }
});
