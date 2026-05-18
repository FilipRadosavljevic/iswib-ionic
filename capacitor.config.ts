import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iswib.app',
  appName: 'ISWiB',
  webDir: './www',
  server: {
    androidScheme: 'http',
  },
};

export default config;
