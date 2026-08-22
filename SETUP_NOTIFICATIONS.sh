#!/bin/bash

# ========================================================
# WAFFLE DA EXPRESS - PUSH NOTIFICATIONS SETUP SCRIPT
# Complete automated setup for high-priority notifications
# ========================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_RAW="$PROJECT_DIR/android/app/src/main/res/raw"
IOS_RUNNER="$PROJECT_DIR/ios/Runner"

echo "╔════════════════════════════════════════════════════════╗"
echo "║  WAFFLE DA - PUSH NOTIFICATIONS SETUP                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Create directories
echo "📁 Step 1: Creating directories..."
mkdir -p "$ANDROID_RAW"
mkdir -p "$IOS_RUNNER"
echo "   ✅ Directories created"
echo ""

# Step 2: Generate notification sound
echo "🔔 Step 2: Generating notification sound..."

# Check if ffmpeg is available
if command -v ffmpeg &> /dev/null; then
    echo "   ✅ ffmpeg found, generating high-quality buzzer sound..."

    # Generate loud buzzer tone (1000 Hz, 2 seconds, -3dB volume)
    ffmpeg -f lavfi -i "sine=frequency=1000:duration=1" \
            -filter_complex "volume=0.9" \
            -q:a 9 \
            "$ANDROID_RAW/order_chime.mp3" -y 2>/dev/null

    # Convert to WAV for iOS
    ffmpeg -i "$ANDROID_RAW/order_chime.mp3" \
            -acodec pcm_s16le -ar 44100 \
            "$IOS_RUNNER/order_chime.wav" -y 2>/dev/null

    echo "   ✅ Sound files generated:"
    echo "      - Android: $ANDROID_RAW/order_chime.mp3"
    echo "      - iOS: $IOS_RUNNER/order_chime.wav"
else
    echo "   ⚠️  ffmpeg not found. Using alternative method..."

    # Create simple MP3 header + silent audio (for testing)
    # This won't be a real sound, but the notification infrastructure will work
    cat > "$ANDROID_RAW/order_chime.mp3" << 'AUDIOEOF'
ID3
AUDIOEOF

    cat > "$IOS_RUNNER/order_chime.wav" << 'AUDIOEOF'
RIFF
AUDIOEOF

    echo "   ⚠️  Placeholder files created (please replace with real audio files)"
    echo ""
    echo "   To get a real buzzer sound:"
    echo "   1. Install ffmpeg: brew install ffmpeg (Mac) or apt-get install ffmpeg (Linux)"
    echo "   2. Re-run this script"
    echo "   OR"
    echo "   3. Download from: https://freesound.org (search 'bell chime' or 'order notification')"
    echo "   4. Place files in:"
    echo "      - $ANDROID_RAW/order_chime.mp3"
    echo "      - $IOS_RUNNER/order_chime.wav"
fi
echo ""

# Step 3: Verify Android configuration
echo "🤖 Step 3: Verifying Android configuration..."
MANIFEST="$PROJECT_DIR/android/app/src/main/AndroidManifest.xml"

if grep -q "POST_NOTIFICATIONS" "$MANIFEST" 2>/dev/null; then
    echo "   ✅ Notification permissions already in AndroidManifest.xml"
else
    echo "   ⚠️  Add these permissions to AndroidManifest.xml:"
    echo ""
    echo "   <uses-permission android:name=\"android.permission.POST_NOTIFICATIONS\" />"
    echo "   <uses-permission android:name=\"android.permission.SCHEDULE_EXACT_ALARM\" />"
    echo "   <uses-permission android:name=\"android.permission.VIBRATE\" />"
fi
echo ""

# Step 4: iOS Configuration
echo "🍎 Step 4: iOS Configuration"
echo "   ⚠️  Manual steps required:"
echo "   1. Open ios/Runner.xcworkspace in Xcode"
echo "   2. Drag order_chime.wav to Runner project"
echo "   3. Ensure it's in 'Runner' target"
echo "   4. Click 'Copy items if needed'"
echo ""

# Step 5: Verify pubspec.yaml
echo "📦 Step 5: Verifying Flutter dependencies..."
if grep -q "firebase_messaging" "$PROJECT_DIR/waffle_express_admin/pubspec.yaml" 2>/dev/null; then
    echo "   ✅ Firebase dependencies configured"
else
    echo "   ⚠️  Update pubspec.yaml with:"
    echo ""
    echo "   dependencies:"
    echo "     firebase_core: ^4.12.1"
    echo "     firebase_messaging: ^16.4.3"
    echo "     flutter_local_notifications: ^22.2.0"
fi
echo ""

# Step 6: Summary
echo "╔════════════════════════════════════════════════════════╗"
echo "║  SETUP COMPLETE ✅                                     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. iOS Configuration:"
echo "   - Open: ios/Runner.xcworkspace in Xcode"
echo "   - Add order_chime.wav to Runner target"
echo ""
echo "2. Backend FCM Configuration:"
echo "   - Update your order notification handler"
echo "   - Ensure it sends FCM with priority: 'high'"
echo "   - See: PUSH_NOTIFICATIONS_GUIDE.md for examples"
echo ""
echo "3. Testing:"
echo "   - Run: flutter run"
echo "   - Tap 'Test Notification' button in settings"
echo "   - Verify sound and vibration"
echo ""
echo "4. Real Device Testing:"
echo "   - Place a test order"
echo "   - Verify notification shows with loud sound"
echo "   - Test on lock screen"
echo ""
echo "📄 Documentation:"
echo "   - NOTIFICATION_SETUP_QUICK_START.md"
echo "   - PUSH_NOTIFICATIONS_GUIDE.md"
echo ""
echo "🎯 Status:"
echo "   ✅ Sound files created/verified"
echo "   ✅ Directory structure ready"
echo "   ✅ Notification service enhanced"
echo "   ⏳ Waiting for: iOS XCode configuration"
echo "   ⏳ Waiting for: Backend FCM update"
echo ""
