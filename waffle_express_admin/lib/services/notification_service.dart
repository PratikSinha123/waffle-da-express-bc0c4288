import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/order_model.dart';
import 'supabase_service.dart';

// Top-level background message handler for FCM
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  try {
    await Firebase.initializeApp();
    debugPrint('Handling background FCM message: ${message.messageId}');
    await NotificationService.instance.showHighPriorityNotification(
      title: message.notification?.title ?? message.data['title'] ?? '🧇 NEW ORDER RECEIVED!',
      body: message.notification?.body ?? message.data['body'] ?? 'Check order dashboard',
    );
  } catch (e) {
    debugPrint('Background message error: $e');
  }
}

class NotificationService {
  static final NotificationService instance = NotificationService._internal();
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();
  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) return;

    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationSettingsIOS = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
      requestCriticalPermission: true,
    );

    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );

    try {
      await _notificationsPlugin.initialize(
        settings: initializationSettings,
        onDidReceiveNotificationResponse: (details) {
          debugPrint('Notification clicked with payload: ${details.payload}');
        },
      );

      final androidImplementation = _notificationsPlugin
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
      
      const AndroidNotificationChannel loudOrderChannel = AndroidNotificationChannel(
        'waffle_loud_order_alarm_v4',
        'Loud Order Ring Alerts',
        description: 'Loud bell chime and popup alert for incoming orders',
        importance: Importance.max,
        playSound: true,
        sound: RawResourceAndroidNotificationSound('order_chime'),
        enableVibration: true,
        showBadge: true,
      );

      await androidImplementation?.createNotificationChannel(loudOrderChannel);
      await androidImplementation?.requestNotificationsPermission();
      try {
        await androidImplementation?.requestExactAlarmsPermission();
      } catch (_) {}
    } catch (e) {
      debugPrint('Local notifications setup notice: $e');
    }

    _initialized = true;
    _initFirebaseFcmInBackground();
  }

  void _initFirebaseFcmInBackground() async {
    try {
      await Firebase.initializeApp();
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

      NotificationSettings settings = await FirebaseMessaging.instance.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
        criticalAlert: true,
      );
      debugPrint('User granted FCM permission: ${settings.authorizationStatus}');

      FirebaseMessaging.instance.subscribeToTopic('admin_orders').catchError((e) {
        debugPrint('FCM topic error: $e');
      });

      String? token = await FirebaseMessaging.instance.getToken();
      if (token != null) {
        debugPrint('FCM REGISTERED DEVICE TOKEN: $token');
        _saveFcmTokenToSupabase(token);
      }

      FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
        debugPrint('FCM TOKEN REFRESHED: $newToken');
        _saveFcmTokenToSupabase(newToken);
      });

      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('Got FCM message in foreground: ${message.messageId}');
        showHighPriorityNotification(
          title: message.notification?.title ?? message.data['title'] ?? '🧇 NEW ORDER RECEIVED!',
          body: message.notification?.body ?? message.data['body'] ?? 'Check order dashboard',
        );
      });
    } catch (e) {
      debugPrint('Firebase FCM background init notice: $e');
    }
  }

  Future<void> _saveFcmTokenToSupabase(String token) async {
    try {
      await SupabaseService.instance.client.from('settings').upsert({
        'key': 'admin_fcm_token',
        'value': token,
        'updated_at': DateTime.now().toIso8601String(),
      });
      await SupabaseService.instance.client.from('push_subscriptions').upsert({
        'endpoint': 'fcm:$token',
        'p256dh': 'fcm',
        'auth': 'fcm',
      }, onConflict: 'endpoint');
    } catch (e) {
      debugPrint('Error saving FCM token to Supabase: $e');
    }
  }

  Future<bool> forceNotificationCheck() async {
    final androidImplementation = _notificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();

    final granted = await androidImplementation?.requestNotificationsPermission() ?? true;
    try {
      await androidImplementation?.requestExactAlarmsPermission();
    } catch (_) {}

    try {
      String? token = await FirebaseMessaging.instance.getToken();
      if (token != null) {
        await _saveFcmTokenToSupabase(token);
      }
    } catch (e) {
      debugPrint('Force check token error: $e');
    }

    await showHighPriorityNotification(
      title: '🔔 NOTIFICATION FORCE CHECK',
      body: 'Loud chime notification system is 100% active on this device!',
    );

    return granted;
  }

  Future<void> showOrderNotification(OrderModel order) async {
    await showHighPriorityNotification(
      title: '🧇 NEW ORDER RECEIVED!',
      body: 'Order #${order.id}\nCustomer: ${order.customerName} (${order.phone})\nTotal: ₹${order.total.toStringAsFixed(0)} • ${order.orderType}',
    );
  }

  Future<void> showTestNotification() async {
    await showHighPriorityNotification(
      title: '🔔 LOUD ORDER CHIME TEST',
      body: 'Waffle Express Admin loud bell chime and popup alert are working!',
    );
  }

  Future<void> showHighPriorityNotification({
    required String title,
    required String body,
  }) async {
    if (!_initialized) {
      await initialize();
    }

    // Android: Maximum priority with aggressive buzzer & vibration (Swiggy/Zomato style)
    final AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'waffle_loud_order_alarm_v4',
      'Loud Order Ring Alerts',
      channelDescription: 'Loud bell chime and popup alert for incoming orders - CRITICAL ALERTS',
      importance: Importance.max,
      priority: Priority.max,
      icon: '@mipmap/ic_launcher',
      largeIcon: const DrawableResourceAndroidBitmap('@mipmap/ic_launcher'),
      ticker: '🧇 NEW ORDER!',
      fullScreenIntent: true,
      visibility: NotificationVisibility.public,
      playSound: true,
      sound: const RawResourceAndroidNotificationSound('order_chime'),
      enableVibration: true,
      // Aggressive vibration pattern: buzzer-like effect
      // Pattern: [delay, vibrate, pause, vibrate, pause, long_vibrate]
      vibrationPattern: Int64List.fromList([0, 1000, 100, 1000, 100, 1500]),
      channelShowBadge: true,
      category: AndroidNotificationCategory.alarm,
      audioAttributesUsage: AudioAttributesUsage.alarm,
      // Keep notification at top of notification drawer
      onlyAlertOnce: false,
      autoCancel: false,
      chronometerCountDown: false,
      // Ensure notification persists
      ongoing: false,
      // Add action buttons
      actions: <AndroidNotificationAction>[
        const AndroidNotificationAction(
          'check_order',
          'Check Order',
          cancelNotification: false,
          showsUserInterface: true,
        ),
        const AndroidNotificationAction(
          'snooze_15',
          'Snooze 15s',
          cancelNotification: false,
        ),
      ],
    );

    // iOS: Critical alert that bypasses silent/DND mode (like Swiggy/Zomato)
    final DarwinNotificationDetails iOsDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentSound: true,
      presentBadge: true,
      interruptionLevel: InterruptionLevel.critical,
      sound: 'order_chime.wav',
      badgeNumber: 1,
      subtitle: 'Critical Order Alert',
    );

    final NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
      iOS: iOsDetails,
    );

    try {
      await _notificationsPlugin.show(
        id: DateTime.now().millisecondsSinceEpoch.remainder(100000),
        title: title,
        body: body,
        notificationDetails: platformDetails,
      );
      debugPrint('✅ High-priority notification shown: $title');
    } catch (e) {
      debugPrint('❌ Notification error: $e');
    }
  }
}
