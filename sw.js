/* service worker: deixa o jogo abrir sem internet depois da primeira visita.
   o jogo vem da rede quando ha conexao (para pegar atualizacoes) e do cache quando nao ha.
   ao mudar a lista de arquivos, suba a versao para descartar o cache antigo */
const VERSAO = 'fundo-v1';
const ARQUIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const FONTES = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  /* fontes: o que ja esta guardado serve na hora, e a copia se renova por tras */
  if (FONTES.indexOf(url.hostname) >= 0) {
    e.respondWith(caches.open(VERSAO).then(c => c.match(req).then(salvo => {
      const rede = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => salvo);
      return salvo || rede;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  /* arquivos do jogo: rede primeiro, cache se estiver sem conexao */
  e.respondWith(fetch(req).then(r => {
    if (r.ok) { const copia = r.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); }
    return r;
  }).catch(() => caches.match(req, { ignoreSearch: true })
    .then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined))));
});
