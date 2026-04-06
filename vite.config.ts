import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load env file from the root directory
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
      plugins: [react()],
      define: {
        // This allows your code to use process.env.GEMINI_API_KEY
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Since your files are in the root, @ points to root
          '@': path.resolve(__dirname, './'),
        }
      },
      build: {
        outDir: 'dist',
      }
    };
});
