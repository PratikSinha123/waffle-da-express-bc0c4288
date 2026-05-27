import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

export const useNativePush = () => {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      registerPush();
    }
  }, []);

  const registerPush = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.error('User denied permissions!');
      return;
    }

    await PushNotifications.register();

    await PushNotifications.addListener('registration', async (token) => {
      console.log('Push registration success, token: ' + token.value);

      // Save the FCM token to Supabase for the cafe owner
      // We can use the same push_subscriptions table or a dedicated one
      const { error } = await supabase.from('push_subscriptions').upsert({
        endpoint: token.value, // Using token as endpoint for native
        p256dh: 'fcm_token',   // Flag it as FCM
        auth: 'native',
      }, { onConflict: 'endpoint' });

      if (error) console.error('Error saving native push token:', error);
    });

    await PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
    });
  };
};
