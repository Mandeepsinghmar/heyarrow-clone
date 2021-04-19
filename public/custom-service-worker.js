/* eslint-disable */
let client;

self.addEventListener('push', (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: 'https://storage.googleapis.com/heyarrow/logo/arrow.png',
    data,
  });
  if (client) {
    client.postMessage({
      msg: data.message,
      user: data.data
    });
  }
});

self.addEventListener('fetch', (event) => {
  event.waitUntil(async function () {
    if (!event.clientId) return;
    client = await clients.get(event.clientId);
  }());
});

self.addEventListener('notificationclick', function(e) {
  const { notification } = e;
  const { origin } = e.currentTarget;

  e.waitUntil(clients.matchAll().then(function(clis) {
    var client = clis.find(function(c) {
      c.visibilityState === 'visible';
    });
    if (client !== undefined) {
      client.navigate(`${origin}/chats/users/${notification.data.data.senderId}`);
      client.focus();
    } else {
      // there are no visible windows. Open one.
      clients.openWindow(`${origin}/chats/users/${notification.data.data.senderId}`);
      e.notification.close();
    }
  }));
});
