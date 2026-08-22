import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as admin from "https://www.gstatic.com/firebaselibs/express/firebase-admin/12.0.0/firebase-admin.js";

// Initialize Firebase Admin (ensure FIREBASE_SERVICE_ACCOUNT env var is set)
const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT") || "{}");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

interface OrderNotificationPayload {
  fcm_token?: string;
  order_id: string;
  customer_name: string;
  phone: string;
  order_type: string;
  total: number;
  items_count: number;
}

serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload: OrderNotificationPayload = await req.json();

    // Validate required fields
    if (!payload.order_id || !payload.fcm_token) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: order_id, fcm_token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build high-priority FCM message
    const message = {
      data: {
        title: "🧇 NEW ORDER RECEIVED!",
        body: `Order #${payload.order_id}`,
        order_id: payload.order_id,
        customer_name: payload.customer_name,
        phone: payload.phone,
        order_type: payload.order_type,
        total: payload.total.toString(),
        items_count: payload.items_count.toString(),
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        timestamp: new Date().toISOString(),
      },
      notification: {
        title: "🧇 NEW ORDER RECEIVED!",
        body: `Order #${payload.order_id}\n${payload.customer_name} • ₹${payload.total} • ${payload.order_type}`,
      },
      // Android configuration - HIGH PRIORITY
      android: {
        priority: "high",
        notification: {
          channel_id: "waffle_loud_order_alarm_v4",
          sound: "order_chime",
          default_sound: true,
          notification_priority: "PRIORITY_MAX",
          visibility: "PUBLIC",
          ticker: "🧇 NEW ORDER!",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          tag: "order_notification",
          color: "#f59e0b", // Amber color (Waffle Da brand)
        },
        ttl: 3600, // 1 hour TTL
        direct_boot_ok: true,
      },
      // iOS configuration - CRITICAL INTERRUPT
      apns: {
        headers: {
          "apns-priority": "10", // Highest priority
          "apns-push-type": "alert",
          "apns-topic": "com.waffleda.admin", // Replace with your bundle ID
        },
        payload: {
          aps: {
            alert: {
              title: "🧇 NEW ORDER RECEIVED!",
              body: `Order #${payload.order_id}`,
              "launch-image": "",
              "loc-key": "new_order",
            },
            badge: 1,
            sound: "order_chime.wav",
            category: "ORDER_ALERT",
            "mutable-content": 1,
            "interruption-level": "critical", // Bypass Silent/DND
            "thread-id": "orders",
            "custom-data": {
              order_id: payload.order_id,
              timestamp: new Date().toISOString(),
            },
          },
        },
      },
      // Webpush configuration (if web admin is used)
      webpush: {
        notification: {
          title: "🧇 NEW ORDER RECEIVED!",
          body: `Order #${payload.order_id}`,
          icon: "https://your-cdn.com/waffle-da-icon.png",
          badge: "https://your-cdn.com/waffle-da-badge.png",
          tag: "order-notification",
          requireInteraction: true,
        },
      },
    };

    // Send message via Firebase Cloud Messaging
    console.log(`📤 Sending high-priority notification for order #${payload.order_id}`);

    const response = await admin.messaging().send(message);

    console.log(`✅ Message sent successfully: ${response}`);

    return new Response(
      JSON.stringify({
        success: true,
        message_id: response,
        order_id: payload.order_id,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error sending notification:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
