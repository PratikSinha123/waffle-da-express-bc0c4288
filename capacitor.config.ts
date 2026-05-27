import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.waffleda.admin',
  appName: 'Waffle Da Admin',
  webDir: 'dist',
  server: {
    url: 'https://www.waffleda.in/admin',
    cleartext: true
  }
};

export default config;
