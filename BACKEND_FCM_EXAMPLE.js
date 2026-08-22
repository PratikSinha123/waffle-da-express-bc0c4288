/**
 * WAFFLE DA EXPRESS - HIGH-PRIORITY FCM NOTIFICATION HANDLER
 *
 * This file shows how to send high-priority push notifications
 * to the Waffle Da admin app when new orders arrive.
 *
 * Setup:
 * 1. Install Firebase Admin SDK: npm install firebase-admin
 * 2. Download service account key from Firebase Console
 * 3. Set environment variable: GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
 * 4. Update FCM token retrieval method based on your backend
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'your-firebase-project-id',
});

/**
 * Send high-priority order notification to admin app
 * @param {string} adminFcmToken - FCM device token of admin app
 * @param {Object} order - Order object with details
 * @returns {Promise<string>} - Message ID if successful
 */
async function sendHighPriorityOrderNotification(adminFcmToken, order) {
  try {
    // Build the high-priority FCM message
    const message = {
      // Data payload (received in FCM background handler)
      data: {
        title: '🧇 NEW ORDER RECEIVED!',
        body: `Order #${order.id}`,
        order_id: order.id,
        customer_name: order.customer_name,
        phone: order.phone,
        address: order.address || '',
        order_type: order.order_type || 'Delivery', // 'Delivery' or 'Pickup'
        total: order.total.toString(),
        items_count: (order.items?.length || 0).toString(),
        subtotal: (order.subtotal || 0).toString(),
        delivery_fee: (order.delivery_fee || 0).toString(),
        payment_method: order.payment_method || 'Cash On Delivery',
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        timestamp: new Date().toISOString(),
      },

      // Notification payload (shown in foreground on Android)
      notification: {
        title: '🧇 NEW ORDER RECEIVED!',
        body: `Order #${order.id}\n${order.customer_name} • ₹${order.total} • ${order.order_type}`,
      },

      // ========== ANDROID CONFIGURATION - CRITICAL ==========
      android: {
        // HIGH PRIORITY - will be delivered with minimal delay
        priority: 'high',
        notification: {
          // Must match channel_id in notification_service.dart
          channel_id: 'waffle_loud_order_alarm_v4',

          // Use custom sound file (order_chime.mp3)
          sound: 'order_chime',
          default_sound: true,

          // Maximum notification priority
          notification_priority: 'PRIORITY_MAX',

          // Show on lock screen
          visibility: 'PUBLIC',

          // Ticker message (shows in status bar)
          ticker: '🧇 NEW ORDER!',

          // Category for system alerts
          category: 'alarm', // Bypasses Do Not Disturb

          // Show as heads-up notification
          click_action: 'FLUTTER_NOTIFICATION_CLICK',

          // Color for notification
          color: '#f59e0b', // Amber - Waffle Da brand color

          // Keep notification in drawer
          tag: 'order_notification',
        },
        // Time to live: 1 hour
        ttl: 3600,
        // Allow direct boot devices
        direct_boot_ok: true,
      },

      // ========== iOS CONFIGURATION - CRITICAL ==========
      apns: {
        // Critical priority headers (bypasses Silent mode & DND)
        headers: {
          // Priority 10 = Maximum priority
          'apns-priority': '10',
          // Push type for alert notification
          'apns-push-type': 'alert',
          // Your app's bundle ID (update this!)
          'apns-topic': 'com.waffleda.admin',
        },
        payload: {
          aps: {
            // Alert details
            alert: {
              title: '🧇 NEW ORDER RECEIVED!',
              body: `Order #${order.id}\n${order.customer_name}`,
              subtitle: `₹${order.total} • ${order.order_type}`,
            },
            // Show badge number
            badge: 1,
            // Play custom sound
            sound: 'order_chime.wav',
            // Notification category (matches iOS configuration)
            category: 'ORDER_ALERT',
            // Allow app to modify notification
            'mutable-content': true,
            // Critical alert level (bypasses Silent mode)
            'interruption-level': 'critical',
            // Thread identifier for grouping
            'thread-id': 'orders',
            // Custom sound volume
            'sound-critical': 1,
            // Keep notification in Notification Center
            'remove-critical-alert-setting': false,
          },
        },
      },

      // ========== WEB PUSH CONFIGURATION ==========
      webpush: {
        notification: {
          title: '🧇 NEW ORDER RECEIVED!',
          body: `Order #${order.id} from ${order.customer_name}`,
          icon: 'https://your-cdn.com/waffle-da-icon-192.png',
          badge: 'https://your-cdn.com/waffle-da-badge-72.png',
          tag: 'order-notification',
          // Keep notification until user dismisses
          requireInteraction: true,
          // Show priority
          priority: 'high',
        },
        // Click behavior
        fcmOptions: {
          link: 'https://your-domain.com/admin/orders',
        },
      },

      // Send to specific device token
      token: adminFcmToken,
    };

    // Send the message
    console.log(`📤 Sending high-priority notification for order #${order.id}...`);
    const response = await admin.messaging().send(message);

    console.log(`✅ Notification sent successfully!`);
    console.log(`   Message ID: ${response}`);
    console.log(`   Order: #${order.id}`);
    console.log(`   Customer: ${order.customer_name}`);
    console.log(`   Amount: ₹${order.total}`);

    return response;
  } catch (error) {
    console.error(`❌ Failed to send notification:`, error);
    throw error;
  }
}

/**
 * Send notification to multiple admin devices
 * (e.g., all devices of all admin users)
 */
async function sendNotificationToAllAdmins(order) {
  try {
    // Get FCM tokens from your database
    // Example: const tokens = await getAdminFcmTokens();
    const tokens = [
      // Add FCM tokens here
      'device_token_1',
      'device_token_2',
    ];

    if (tokens.length === 0) {
      console.log('⚠️  No admin FCM tokens found');
      return;
    }

    // Send to all admin devices at once
    const responses = await admin.messaging().sendMulticast({
      tokens,
      data: {
        title: '🧇 NEW ORDER RECEIVED!',
        body: `Order #${order.id}`,
        order_id: order.id,
        customer_name: order.customer_name,
        total: order.total.toString(),
      },
      notification: {
        title: '🧇 NEW ORDER RECEIVED!',
        body: `Order #${order.id}\n${order.customer_name} • ₹${order.total}`,
      },
      android: {
        priority: 'high',
        notification: {
          channel_id: 'waffle_loud_order_alarm_v4',
          sound: 'order_chime',
          notification_priority: 'PRIORITY_MAX',
        },
      },
      apns: {
        headers: {
          'apns-priority': '10',
          'apns-push-type': 'alert',
        },
        payload: {
          aps: {
            alert: {
              title: '🧇 NEW ORDER RECEIVED!',
              body: `Order #${order.id}`,
            },
            sound: 'order_chime.wav',
            'interruption-level': 'critical',
          },
        },
      },
    });

    console.log(`✅ Sent to ${responses.successCount} devices`);
    if (responses.failureCount > 0) {
      console.log(`⚠️  Failed for ${responses.failureCount} devices`);
      responses.responses.forEach((r, i) => {
        if (!r.success) {
          console.log(`   Token ${i}: ${r.error?.message}`);
        }
      });
    }

    return responses;
  } catch (error) {
    console.error('❌ Error sending to multiple admins:', error);
    throw error;
  }
}

/**
 * Send via topic subscription (if admin app subscribes to topic)
 */
async function sendNotificationByTopic(order) {
  try {
    const message = {
      data: {
        title: '🧇 NEW ORDER RECEIVED!',
        order_id: order.id,
        customer_name: order.customer_name,
        total: order.total.toString(),
      },
      notification: {
        title: '🧇 NEW ORDER RECEIVED!',
        body: `Order #${order.id} from ${order.customer_name}`,
      },
      android: {
        priority: 'high',
        notification: {
          channel_id: 'waffle_loud_order_alarm_v4',
          sound: 'order_chime',
          notification_priority: 'PRIORITY_MAX',
        },
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
        payload: {
          aps: {
            alert: { title: '🧇 NEW ORDER!' },
            sound: 'order_chime.wav',
            'interruption-level': 'critical',
          },
        },
      },
      topic: 'admin_orders', // Topic name (must match app subscription)
    };

    const response = await admin.messaging().send(message);
    console.log(`✅ Notification sent to topic 'admin_orders': ${response}`);
    return response;
  } catch (error) {
    console.error('❌ Topic notification failed:', error);
    throw error;
  }
}

// ========== USAGE EXAMPLES ==========

// Example 1: Send to single admin
async function exampleSingleAdmin() {
  const adminToken = 'admin_fcm_token_here';
  const order = {
    id: '12345',
    customer_name: 'John Doe',
    phone: '9876543210',
    address: '123 Main St',
    order_type: 'Delivery',
    items: ['Chocolate Waffle', 'Cold Coffee'],
    subtotal: 180,
    delivery_fee: 40,
    total: 220,
    payment_method: 'UPI',
    created_at: new Date().toISOString(),
  };

  try {
    await sendHighPriorityOrderNotification(adminToken, order);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Send to multiple admins
async function exampleMultipleAdmins() {
  const order = {
    id: '12346',
    customer_name: 'Jane Smith',
    phone: '9876543211',
    order_type: 'Pickup',
    total: 150,
  };

  try {
    await sendNotificationToAllAdmins(order);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: Send via topic
async function exampleTopic() {
  const order = {
    id: '12347',
    customer_name: 'Bob Johnson',
    total: 300,
  };

  try {
    await sendNotificationByTopic(order);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Export for use in your application
module.exports = {
  sendHighPriorityOrderNotification,
  sendNotificationToAllAdmins,
  sendNotificationByTopic,
};

// ========== INTEGRATION POINTS ==========
/*
 *
 * Integrate this into your order creation endpoint:
 *
 * POST /api/orders (or similar)
 *
 * router.post('/api/orders', async (req, res) => {
 *   try {
 *     // Create order in database
 *     const order = await createOrderInDatabase(req.body);
 *
 *     // Get admin FCM token from settings
 *     const adminToken = await getAdminFcmToken();
 *
 *     // Send HIGH-PRIORITY notification
 *     await sendHighPriorityOrderNotification(adminToken, order);
 *
 *     // Emit WebSocket event for live dashboard
 *     io.emit('new_order', order);
 *
 *     res.json({ success: true, order });
 *   } catch (error) {
 *     console.error('Order creation failed:', error);
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 *
 */
