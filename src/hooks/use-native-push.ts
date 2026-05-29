import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Registers the device for FCM push notifications on native platforms.
 * - Requests permission
 * - Registers with FCM
 * - Saves the FCM token to Supabase `push_subscriptions` table
 * - Shows in-app toasts when notifications arrive while app is open
 */
export const useNativePush = () => {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      registerPush();
    }

    // Cleanup listeners on unmount
    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);

  const registerPush = async () => {
    try {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Push notification permission denied');
        return;
      }

      await PushNotifications.register();

      // Handle successful registration — save FCM token
      await PushNotifications.addListener('registration', async (token) => {
        console.log('✅ FCM token received:', token.value);

        // Save the FCM token to Supabase for push delivery
        const { error } = await supabase.from('push_subscriptions').upsert({
          endpoint: token.value,   // FCM token as endpoint
          p256dh: 'fcm_token',     // Flag to distinguish from web push
          auth: 'native',          // Mark as native platform
        }, { onConflict: 'endpoint' });

        if (error) {
          console.error('Error saving FCM token:', error);
        } else {
          console.log('✅ FCM token saved to Supabase');
        }
      });

      // Handle registration errors
      await PushNotifications.addListener('registrationError', (error) => {
        console.error('FCM registration error:', JSON.stringify(error));
      });

      // Handle push received while app is in FOREGROUND
      // Show a Zomato/Swiggy-style in-app toast banner
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('📱 Push received in foreground:', JSON.stringify(notification));

        // Show in-app toast notification (like Zomato's order banner)
        toast(notification.title || '🔔 New Notification', {
          description: notification.body || '',
          duration: 6000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #FF8C00, #FFA500)',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
          },
        });
      });

      // Handle notification tap (app opened from notification)
      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('📱 Push action performed:', JSON.stringify(notification));

        // Navigate to orders page when notification is tapped
        const data = notification.notification?.data;
        if (data?.orderId) {
          window.location.href = '/admin/orders';
        }
      });

    } catch (err) {
      console.error('Push setup error:', err);
    }
  };
};
