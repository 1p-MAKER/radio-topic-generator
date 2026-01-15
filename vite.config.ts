import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/trends': {
        target: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trends/, ''),
      },
      '/api/yahoo': {
        target: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      },
    },
  },
})
