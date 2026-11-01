var CACHE='familiequiz-v30';
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||r.url.indexOf('http')!==0)return;
  e.respondWith(fetch(r).then(function(res){
    if(res&&res.ok){var c=res.clone();caches.open(CACHE).then(function(ch){ch.put(r,c)})}
    return res;
  }).catch(function(){return caches.match(r)}));
});
