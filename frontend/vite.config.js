import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
      rejectUnauthorized: false,
    },
    proxy: {
      '/auth': {
        target: "https://localhost:5000",
        secure: false,
        changeOrigin: true
      },
      '/api': {
        target: "https://localhost:5000",
        secure: false,
        changeOrigin: true
      },
      '/oauth': {
        target: "https://localhost:5000",
        secure: false,
        changeOrigin: true
      },
      '/test': {
        target: "https://localhost:5000",
        secure: false,
        changeOrigin: true
      },
      '/guest': {
        target: "https://localhost:5000",
        secure: false,
        changeOrigin: true
      },
      '/': {
        target: "https://localhost:5000",
        secure: false,
        changeOrigin: true,
        bypass: (req) => {
          if (req.url !== '/') {
            return req.url;
          }
        }
      }
    }
  },
  plugins: [
    react(),
    visualizer({ // Add the bundle analyzer
      open: false, // Automatically open the stats file in your browser
      filename: 'bundle-stats.html', // Name of the stats file
      gzipSize: true, // Include gzipped sizes
      brotliSize: true, // Include Brotli sizes
    })
  ]
});
