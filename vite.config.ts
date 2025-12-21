import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {

      base: "/Eco-Wave/", 

      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // This fixes the "process is not defined" crash
        'process.env': {
           API_KEY: env.GEMINI_API_KEY,
           GEMINI_API_KEY: env.GEMINI_API_KEY
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
