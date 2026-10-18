import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Proxy API calls to the Express backend so the browser only ever talks to
// the dev server origin (no CORS / cookie-origin mismatch in development).
const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:5000',
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Bundle the app's entry dependencies up front. This avoids a second
  // optimizer pass (and page reload) when a route first imports them.
  optimizeDeps: {
    include: [
      'react',
      'react-dom/client',
      'react-router-dom',
      'react-router-hash-link',
      'react-hot-toast',
      'lucide-react',
      'react-icons',
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: apiProxy,
    warmup: {
      clientFiles: [
        './src/main.jsx',
        './src/App.jsx',
        './src/routes/AppRoutes.jsx',
        './src/context/AuthContext.jsx',
        './src/context/ThemeContext.jsx',
      ],
    },
  },
  preview: {
    strictPort: true,
    proxy: apiProxy,
  },
})
