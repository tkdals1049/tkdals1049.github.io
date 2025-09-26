---
layout: compress
permalink: '/sw.js'
# PWA service worker
---

self.importScripts('{{ "/assets/js/data/swcache.js" | relative_url }}');

const cacheName = 'chirpy-{{ "now" | date: "%Y%m%d.%H%M%S" }}';

function verifyDomain(url) {
    for (const domain of allowedDomains) {
        const regex = RegExp(`^http(s)?:\/\/${domain}\/`);
        if (regex.test(url)) {
            return true;
        }
    }

    return false;
}

function isExcluded(url) {
    for (const item of denyUrls) {
        if (url === item) {
            return true;
        }
    }
    return false;
}

  self.addEventListener("install", (event) => {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    self.registration
      .unregister()
      .then(() => self.clients.matchAll())
      .then((clients) => {
        clients.forEach((client) => {
          if (client.url && "navigate" in client) {
            client.navigate(client.url);
          }
        });
      });
  });