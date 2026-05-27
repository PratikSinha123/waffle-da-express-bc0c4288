import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.waffleda.admin',
  appName: 'Waffle Da Admin',
  webDir: 'dist',
  server: {
    // We use the root URL to avoid 404s, our App.tsx will auto-redirect to /admin for the APK
    url: 'https://www.waffleda.in',
    cleartext: true
  }
};

export default config;
