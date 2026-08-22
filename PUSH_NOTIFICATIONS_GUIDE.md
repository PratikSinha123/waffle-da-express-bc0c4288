# Push Notifications Setup Guide - Swiggy/Zomato Style

## Overview
This guide explains how to set up loud, high-priority push notifications in the Flutter admin app that bypass Do Not Disturb mode, just like Swiggy and Zomato.

---

## Current Implementation ✅

### Android Features
- **Priority**: Importance.max + Priority.max
- **Sound**: Custom order_chime.mp3 (loud bell/buzzer)
- **Vibration**: Aggressive pattern [0, 1000, 100, 1000, 100, 1500] ms
- **Full Screen Intent**: Yes (shows full-screen notification even when device is locked)
- **Category**: Alarm (bypasses DND on older Android versions)
- **Visibility**: Public (shows on lock screen)
- **Heads-up Notification**: Yes (floating notification at top)

### iOS Features
- **Interrupt Level**: Critical (bypasses Silent/DND mode)
- **Sound**: order_chime.wav
- **Alert**: Always shown
- **Badge**: Enabled
- **Provisional**: Not used (users must explicitly allow)

---

## Setup Instructions

### Step 1: Add Sound Files to Android

**File**: `waffle_express_admin/android/app/src/main/res/raw/order_chime.mp3`

Create or use a loud buzzer sound file. The file should be:
- **Format**: MP3
- **Duration**: 2-5 seconds
- **Volume**: Maximum (typically -3dB to 0dB)
- **Type**: Bell chime or buzzer sound

**Recommended**: Use a sound like:
- Swiggy order bell: High-pitched bell chime
- Zomato order ping: Melodic alert tone
- Alarm clock buzzer: Repetitive loud buzz

**How to add**:
```bash
# Create raw directory if it doesn't exist
mkdir -p android/app/src/main/res/raw

# Copy your MP3 file
cp order_chime.mp3 android/app/src/main/res/raw/
```

### Step 2: Add Sound File to iOS

**File**: `waffle_express_admin/ios/Runner/order_chime.wav`

Add the same sound as a WAV file for iOS:
- **Format**: WAV (uncompressed PCM)
- **Sample Rate**: 44100 Hz
- **Bit Depth**: 16-bit
- **Channels**: Mono or Stereo

**How to add**:
```bash
# Using ffmpeg to convert MP3 to WAV
ffmpeg -i order_chime.mp3 -acodec pcm_s16le -ar 44100 order_chime.wav

# Copy to iOS project
cp order_chime.wav ios/Runner/

# Add to Xcode:
# 1. Open ios/Runner.xcworkspace in Xcode
# 2. Drag order_chime.wav into the Runner project
# 3. Ensure it's added to Runner target
# 4. Copy items if needed
```

### Step 3: Update AndroidManifest.xml

Ensure these permissions are set:

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest ...>
    <!-- Required permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.VIBRATE" />
    
    <!-- Allow notifications to bypass Do Not Disturb -->
    <uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY" />
    
    <application
        ...
        android:usesCleartextTraffic="false"
    >
        <!-- FCM configuration -->
        <service
            android:name="com.google.firebase.messaging.cpp.BuiltinMessagingService"
            android:exported="false" />
    </application>
</manifest>
```

### Step 4: Update pubspec.yaml

Ensure dependencies are up to date:

```yaml
dependencies:
  firebase_core: ^4.12.1
  firebase_messaging: ^16.4.3
  flutter_local_notifications: ^22.2.0
  
dev_dependencies:
  flutter_lints: ^6.0.0
```

---

## Backend: Sending High-Priority FCM Messages

### Critical: FCM Message Structure

For push notifications to work with high priority, the FCM message **MUST** be sent correctly from your backend.

#### Wrong Way ❌
```json
{
  "to": "fcm_device_token",
  "notification": {
    "title": "New Order",
    "body": "Check dashboard"
  }
}
```

#### Correct Way ✅
```json
{
  "to": "fcm_device_token",
  "priority": "high",
  "time_to_live": 3600,
  "data": {
    "title": "🧇 NEW ORDER RECEIVED!",
    "body": "Order #12345",
    "order_id": "12345",
    "click_action": "FLUTTER_NOTIFICATION_CLICK"
  },
  "notification": {
    "title": "🧇 NEW ORDER RECEIVED!",
    "body": "Order #12345\nCustomer: John Doe",
    "sound": "default",
    "android_channel_id": "waffle_loud_order_alarm_v4"
  },
  "android": {
    "priority": "high",
    "notification": {
      "channel_id": "waffle_loud_order_alarm_v4",
      "sound": "order_chime",
      "default_sound": true,
      "notification_priority": "PRIORITY_MAX",
      "visibility": "PUBLIC"
    },
    "ttl": "3600s"
  },
  "apns": {
    "headers": {
      "apns-priority": "10",
      "apns-push-type": "alert"
    },
    "payload": {
      "aps": {
        "alert": {
          "title": "🧇 NEW ORDER RECEIVED!",
          "body": "Order #12345"
        },
        "badge": 1,
        "sound": "order_chime.wav",
        "category": "ORDER_ALERT",
        "mutable-content": 1,
        "interruption-level": "critical"
      }
    }
  }
}
```

### Node.js Example (Firebase Admin SDK)

```javascript
const admin = require('firebase-admin');

async function sendHighPriorityOrderNotification(deviceToken, order) {
  const message = {
    data: {
      title: '🧇 NEW ORDER RECEIVED!',
      body: `Order #${order.id}`,
      order_id: order.id,
      customer_name: order.customer_name,
      total: order.total.toString(),
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    },
    notification: {
      title: '🧇 NEW ORDER RECEIVED!',
      body: `Order #${order.id}\n₹${order.total} • ${order.order_type}`,
      imageUrl: 'https://your-cdn.com/order-icon.png' // Optional icon
    },
    android: {
      priority: 'high',
      notification: {
        channel_id: 'waffle_loud_order_alarm_v4',
        sound: 'order_chime',
        default_sound: true,
        notification_priority: 'PRIORITY_MAX',
        visibility: 'PUBLIC',
        ticker: '🧇 NEW ORDER!',
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      ttl: 3600
    },
    apns: {
      headers: {
        'apns-priority': '10',
        'apns-push-type': 'alert'
      },
      payload: {
        aps: {
          alert: {
            title: '🧇 NEW ORDER RECEIVED!',
            body: `Order #${order.id}`
          },
          badge: 1,
          sound: 'order_chime.wav',
          category: 'ORDER_ALERT',
          mutableContent: true,
          interruptionLevel: 'critical'
        }
      }
    },
    tokens: [deviceToken]
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`✅ High-priority notification sent: ${response.successCount} success`);
    return response;
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
    throw error;
  }
}
```

### Python Example (Firebase Admin SDK)

```python
from firebase_admin import messaging

def send_high_priority_order_notification(device_token, order):
    message = messaging.MulticastMessage(
        data={
            'title': '🧇 NEW ORDER RECEIVED!',
            'body': f"Order #{order['id']}",
            'order_id': order['id'],
            'customer_name': order['customer_name'],
            'total': str(order['total']),
            'click_action': 'FLUTTER_NOTIFICATION_CLICK'
        },
        notification=messaging.Notification(
            title='🧇 NEW ORDER RECEIVED!',
            body=f"Order #{order['id']}\n₹{order['total']} • {order['order_type']}"
        ),
        android=messaging.AndroidConfig(
            priority='high',
            notification=messaging.AndroidNotification(
                channel_id='waffle_loud_order_alarm_v4',
                sound='order_chime',
                default_sound=True,
                notification_priority='PRIORITY_MAX',
                visibility='PUBLIC',
                ticker='🧇 NEW ORDER!',
                click_action='FLUTTER_NOTIFICATION_CLICK'
            ),
            ttl=3600
        ),
        apns=messaging.APNSConfig(
            headers={
                'apns-priority': '10',
                'apns-push-type': 'alert'
            },
            payload=messaging.APNSPayload(
                aps=messaging.Aps(
                    alert=messaging.ApsAlert(
                        title='🧇 NEW ORDER RECEIVED!',
                        body=f"Order #{order['id']}"
                    ),
                    badge=1,
                    sound='order_chime.wav',
                    category='ORDER_ALERT',
                    mutable_content=True,
                    custom_data={'interruption_level': 'critical'}
                )
            )
        ),
        tokens=[device_token]
    )

    try:
        response = messaging.send_multicast(message)
        print(f'✅ Notification sent: {response.success_count} success')
        return response
    except Exception as e:
        print(f'❌ Failed to send notification: {e}')
        raise
```

---

## Testing High-Priority Notifications

### Test 1: Notification Service Test
```dart
// In main.dart or settings screen
ElevatedButton(
  onPressed: () {
    NotificationService.instance.showTestNotification();
  },
  child: const Text('Test High-Priority Notification'),
)
```

### Test 2: Force Permission Check
```dart
ElevatedButton(
  onPressed: () {
    NotificationService.instance.forceNotificationCheck();
  },
  child: const Text('Force Permission Check'),
)
```

### Test 3: Simulate Order Notification
```dart
ElevatedButton(
  onPressed: () {
    final testOrder = OrderModel(
      id: 'TEST123',
      customerName: 'Test Customer',
      phone: '9876543210',
      orderType: 'Delivery',
      items: [],
      total: 299,
      status: 'Order Received',
      createdAt: DateTime.now(),
    );
    NotificationService.instance.showOrderNotification(testOrder);
  },
  child: const Text('Test Order Notification'),
)
```

### Test 4: Firebase Cloud Messaging Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Cloud Messaging → Send your first message
4. Enter:
   - **Title**: 🧇 NEW ORDER RECEIVED!
   - **Body**: Order #TEST123
   - **Android channel**: waffle_loud_order_alarm_v4
   - **Priority**: High
5. Select your device token
6. Send and verify notification appears with sound

---

## Troubleshooting

### Notification Not Showing?

**Check 1: App has permissions**
```bash
# Run force check in app
NotificationService.instance.forceNotificationCheck();
```

**Check 2: Android notification channel exists**
```bash
# Check logcat
adb logcat | grep -i notification
```

**Check 3: FCM token is saved**
- Go to Firebase Console
- Cloud Messaging → Device Tokens
- Verify your device token exists

**Check 4: Sound file exists**
```bash
# Android
ls android/app/src/main/res/raw/order_chime.mp3

# iOS
ls ios/Runner/order_chime.wav
```

### Sound Not Playing?

1. **Check device volume**: Ensure device volume is not muted
2. **Check Do Not Disturb**: Disable DND mode
3. **Check notification settings**: Android > Apps > Waffle Da Admin > Notifications > Allow notifications
4. **Rebuild app**:
   ```bash
   flutter clean
   flutter pub get
   flutter run
   ```

### Still Not Working?

1. Check FCM message structure (see Backend section)
2. Ensure `priority: "high"` is set in FCM payload
3. Verify `android_channel_id: "waffle_loud_order_alarm_v4"` matches
4. Check if sound file is properly added to project
5. Test with Firebase Cloud Messaging Console

---

## Swiggy/Zomato Comparison

| Feature | Waffle Da | Swiggy | Zomato |
|---------|-----------|--------|--------|
| High Priority | ✅ Yes | ✅ Yes | ✅ Yes |
| Loud Sound | ✅ Custom chime | ✅ Bell chime | ✅ Alert tone |
| Vibration | ✅ Aggressive | ✅ Yes | ✅ Yes |
| Bypasses DND | ✅ Yes | ✅ Yes | ✅ Yes |
| Full-screen Alert | ✅ Yes | ✅ Yes | ✅ Yes |
| Lock Screen Show | ✅ Yes | ✅ Yes | ✅ Yes |
| Heads-up Notification | ✅ Yes | ✅ Yes | ✅ Yes |
| Works When Closed | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Summary Checklist

- [ ] Sound files added (order_chime.mp3 & order_chime.wav)
- [ ] AndroidManifest.xml updated with permissions
- [ ] pubspec.yaml dependencies up to date
- [ ] iOS XCode project has sound file
- [ ] Backend sending FCM with high priority
- [ ] Tested with Firebase Console
- [ ] Tested with app notifications
- [ ] Device notifications enabled
- [ ] Do Not Disturb mode disabled during testing
- [ ] FCM token saved to Supabase

---

## Next Steps

1. **Add notification sound file** to the project
2. **Verify FCM backend** is sending high-priority messages
3. **Test on real device** (emulator may not support all features)
4. **Configure notification settings** in Android Settings
5. **Monitor FCM delivery** in Firebase Console

---

## Support

If notifications still aren't working:
1. Enable Firebase debug mode: `adb shell setprop log.tag.FirebaseMessaging DEBUG`
2. Check logs: `adb logcat | grep -i firebase`
3. Verify FCM token: Check Supabase settings table
4. Test with manual Firebase Console message

