const CACHE = 'legie1918-v1.2';
const ASSETS = ['/', '/index.html', '/styles.css', '/data.js', '/webgl.js', '/app.js', '/manifest.webmanifest', '/assets/hero.svg', '/assets/icon.svg', '/assets/icon-192.png'];
self.addEventListener('install', e => {e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate', e => {e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch', e => {const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/')||u.pathname.startsWith('/.netlify/')) return; e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{if(res.ok&&res.type==='basic'){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res;})));});
