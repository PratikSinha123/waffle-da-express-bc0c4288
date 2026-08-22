# Push Notifications - Quick Start Guide

## 🔔 The Problem
Current notifications might be silent or low-priority. We need **LOUD**, **HIGH-PRIORITY** notifications that:
- ✅ Bypass Do Not Disturb mode
- ✅ Play loud buzzer sound
- ✅ Vibrate aggressively
- ✅ Show full-screen alert (even on lock screen)
- ✅ Work when app is closed

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Add Sound File to Android (1 min)

Find or download a loud buzzer/bell sound MP3 file (2-5 seconds, max volume)

Options:
- **Swiggy style**: High-pitched bell chime
- **Zomato style**: Melodic alert tone  
- **Generic**: Alarm buzzer sound

Then copy to your project:
```bash
# Navigate to your Flutter project
cd waffle_express_admin

# Create raw directory if needed
mkdir -p android/app/src/main/res/raw

# Add your MP3 file
cp /path/to/your/order_chime.mp3 android/app/src/main/res/raw/
```

### Step 2: Add Sound File to iOS (2 min)

Convert the MP3 to WAV:
```bash
# Install ffmpeg if you don't have it
# Mac: brew install ffmpeg
# Ubuntu: sudo apt-get install ffmpeg
# Windows: Download from ffmpeg.org

ffmpeg -i order_chime.mp3 -acodec pcm_s16le -ar 44100 order_chime.wav

# Copy to iOS project
cp order_chime.wav ios/Runner/
```

Then add to Xcode:
1. Open `ios/Runner.xcworkspace` in Xcode
2. Drag `order_chime.wav` to the Runner project
3. Ensure it's checked in the "Runner" target
4. Click "Copy items if needed"

### Step 3: Verify App Permissions (1 min)

The Flutter app will ask for notification permissions on first launch.

**On Android**:
- Tap "Allow" when prompted for notifications
- Go to Settings > Apps > Waffle Da Admin > Notifications
- Enable "Allow notifications"

**On iOS**:
- Tap "Allow" when prompted
- Go to Settings > Waffle Da Admin > Notifications
- Enable "Alerts"

### Step 4: Update Backend FCM Messages (1 min)

Your backend (Node.js, Python, etc.) MUST send FCM with HIGH PRIORITY.

**Critical**: The FCM payload MUST include:
```json
{
  "priority": "high",
  "android": {
    "priority": "high",
    "notification": {
      "channel_id": "waffle_loud_order_alarm_v4",
      "sound": "order_chime"
    }
  }
}
```

See [PUSH_NOTIFICATIONS_GUIDE.md](./PUSH_NOTIFICATIONS_GUIDE.md) for full examples.

### Step 5: Test It! (1 min)

Run the app:
```bash
cd waffle_express_admin
flutter run
```

**Test 1: App-Level Test**
```dart
// Add this button to your Settings or Main page
ElevatedButton(
  onPressed: () {
    NotificationService.instance.showTestNotification();
  },
  child: const Text('🔔 Test Loud Notification'),
)
```

**Test 2: Firebase Console Test**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Cloud Messaging → Send your first message
3. Fill in:
   - Title: `🧇 NEW ORDER RECEIVED!`
   - Body: `Order #12345`
   - Android channel: `waffle_loud_order_alarm_v4`
   - Priority: `High`
4. Select your device
5. Click "Send"

**Expected Result**:
- 📢 **Loud buzzer/bell sound plays**
- 📳 **Device vibrates aggressively**
- 📱 **Full-screen notification appears** (even on lock screen)
- 🔔 **Notification badge shows**

---

## 🔧 Troubleshooting

### Issue: No sound or vibration
**Solution**: 
1. Check device volume is NOT muted (check side buttons)
2. Disable Do Not Disturb mode
3. Verify sound file exists: `android/app/src/main/res/raw/order_chime.mp3`
4. Rebuild: `flutter clean && flutter pub get && flutter run`

### Issue: Notification not showing at all
**Solution**:
1. Check permissions: Settings > Apps > Waffle Da Admin > Notifications > Allow
2. Verify FCM token is saved (check Supabase admin panel)
3. Ensure backend is sending with `priority: "high"`
4. Check Firebase Console for delivery status

### Issue: Only works when app is open
**Solution**:
Your backend is NOT sending high-priority FCM. Update your FCM code to include:
```json
{
  "priority": "high",
  "time_to_live": 3600,
  "android": { "priority": "high" }
}
```

### Issue: Android shows notification but iOS doesn't
**Solution**:
1. Verify sound file exists: `ios/Runner/order_chime.wav`
2. Add to Xcode target (see Step 2)
3. Rebuild iOS app: `flutter clean && flutter run -d iphone`

---

## 📋 Implementation Checklist

- [ ] **Sound files added**
  - [ ] `android/app/src/main/res/raw/order_chime.mp3` exists
  - [ ] `ios/Runner/order_chime.wav` exists & added to Xcode
  
- [ ] **Permissions set**
  - [ ] Android: Notifications permission allowed
  - [ ] iOS: Notifications permission allowed
  - [ ] Do Not Disturb disabled on test device
  - [ ] Device volume NOT muted
  
- [ ] **Backend updated**
  - [ ] FCM messages include `"priority": "high"`
  - [ ] FCM includes `"android": { "priority": "high" }`
  - [ ] FCM includes correct channel_id
  
- [ ] **Tests passed**
  - [ ] Test notification shows with sound
  - [ ] Firebase Console test works
  - [ ] Full-screen alert appears on lock screen
  - [ ] Aggressive vibration works
  
- [ ] **Real order tested**
  - [ ] Placed a test order
  - [ ] Received high-priority notification
  - [ ] Sound and vibration confirmed

---

## 📱 What Users Will Experience

### Android
1. 📢 Loud buzzer sound plays (even in DND mode)
2. 📳 Phone vibrates 3 times aggressively
3. 📱 Full-screen alert appears (shows over lock screen)
4. 🔔 Notification appears in notification drawer
5. 🎯 Can tap to open order details

### iOS  
1. 📢 Loud bell sound plays (even in Silent mode)
2. 📳 Phone vibrates
3. 📱 Banner notification appears at top
4. 🔔 Notification shows on lock screen
5. 🎯 Can swipe to view order details

---

## 🎯 Key Points

| Feature | Status |
|---------|--------|
| **High Priority** | ✅ Configured |
| **Loud Sound** | ✅ Custom audio |
| **Vibration** | ✅ Aggressive pattern |
| **Bypasses DND** | ✅ Yes (Critical on iOS) |
| **Full-screen Alert** | ✅ Yes |
| **Works When Closed** | ✅ Yes |
| **Lock Screen Show** | ✅ Yes |
| **Heads-up Alert** | ✅ Yes |

---

## 📞 Support

**If notifications still don't work after setup:**

1. Check `PUSH_NOTIFICATIONS_GUIDE.md` for detailed troubleshooting
2. Verify FCM message structure in backend code
3. Test with Firebase Cloud Messaging Console
4. Enable Firebase debug logging:
   ```bash
   adb shell setprop log.tag.FirebaseMessaging DEBUG
   adb logcat | grep -i firebase
   ```

---

## 🚀 Result

After following this guide, your Waffle Da admin will receive notifications **exactly like Swiggy and Zomato**:
- 🔔 Loud buzzer when order arrives
- 📱 Shows on lock screen even if phone is locked
- 📳 Aggressive vibration pattern
- 🎯 Clear call-to-action buttons

**No more missing orders!** 🎉

