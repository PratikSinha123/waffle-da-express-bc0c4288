// Service Worker for Push Notifications
self.addEventListener("push", (event) => {
  let data = { title: "🧇 New Order!", body: "A new order has been placed." };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  // 10 seconds of continuous vibration pattern (200ms on, 100ms off repeating)
  const vibratePattern = [];
  for (let i = 0; i < 33; i++) {
    vibratePattern.push(200, 100);
  }
  vibratePattern.push(200); // ends with vibrate

  const options = {
    body: data.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: vibratePattern,
    tag: "new-order",
    renotify: true,
    requireInteraction: true,
    silent: false,
    data: { orderId: data.orderId, url: "/admin" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/admin";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/admin") && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
