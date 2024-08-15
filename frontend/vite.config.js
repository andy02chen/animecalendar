import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth':"http://localhost:5000",
      '/api':"http://localhost:5000",
      '/oauth':"http://localhost:5000",
      '/test':"http://localhost:5000",
      '/guest':"http://localhost:5000",
      '/':{
        target: "http://localhost:5000",
        bypass: (req) => {
          if (req.url !== '/') {
            return req.url;
          }
        }
      }
    }
  },
  plugins: [react()]
})
