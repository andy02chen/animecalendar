import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
//       cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
//     },
//     proxy: {
//       '/auth':"https://localhost:5000",
//       '/api':"https://localhost:5000",
//       '/oauth':"https://localhost:5000",
//       '/test':"https://localhost:5000",
//       '/guest':"https://localhost:5000",
//       '/':{
//         target: "https://localhost:5000",
//         bypass: (req) => {
//           if (req.url !== '/') {
//             return req.url;
//           }
//         }
//       }
//     }
//   },
//   plugins: [react()]
// })

export default defineConfig({
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
  plugins: [react()]
});
