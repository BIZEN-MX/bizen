import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bizen.app',
  appName: 'BIZEN',
  webDir: 'dist',
  server: {
    // Production: Point to your live server
    url: 'https://bizen.mx',
    cleartext: false // Use HTTPS
  },
  // For local development, uncomment this and comment out the server config above:
  // server: {
  //   url: 'http://localhost:3004',
  //   cleartext: true
  // }
};

export default config;
