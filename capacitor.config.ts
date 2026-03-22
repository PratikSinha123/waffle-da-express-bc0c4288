import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.baef903a1fe6481abc92245d2ff3e66d',
  appName: 'Waffle Da Admin',
  webDir: 'dist',
  server: {
    url: 'https://waffle-da-express.lovable.app/admin?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
