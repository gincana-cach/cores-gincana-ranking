import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ba8e5be85a3a45e7aacb794e84805726',
  appName: 'gincana-2025',
  webDir: 'dist',
  server: {
    url: 'https://ba8e5be8-5a3a-45e7-aacb-794e84805726.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;