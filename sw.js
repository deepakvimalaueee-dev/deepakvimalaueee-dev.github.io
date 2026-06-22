const CACHE = 'workoutpro-v4';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      // Cache core files
      await c.addAll(['./index.html','./manifest.json','./icon-192.png','./icon-512.png']);
      // Cache all GIFs
      const gifs = [
        'bench_press','incline_bench','incline_db','cable_fly','squat','hack_squat',
        'deadlift','rdl','ohp','lateral_raise','front_raise','pullup','cable_row',
        'barbell_row','db_row','lunge','leg_curl','leg_extension','leg_press',
        'calf_raise','hip_thrust','dips','tricep_pushdown','overhead_tricep',
        'bicep_curl','hammer_curl','cable_crunch','arnold_press','lat_pulldown',
        'face_pull','sumo_deadlift'
      ];
      return c.addAll(gifs.map(g => `./gifs/${g}.gif`));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
