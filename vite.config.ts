import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/trends': {
        target: 'https://trends.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trends/, '/trends/trendingsearches/daily/rss?geo=JP'),
      },
      '/api/yahoo-domestic': {
        target: 'https://news.yahoo.co.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo-domestic/, '/rss/topics/domestic.xml'),
      },
      '/api/yahoo-world': {
        target: 'https://news.yahoo.co.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo-world/, '/rss/topics/world.xml'),
      },
      '/api/yahoo-business': {
        target: 'https://news.yahoo.co.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo-business/, '/rss/topics/business.xml'),
      },
      '/api/yahoo-ent': {
        target: 'https://news.yahoo.co.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo-ent/, '/rss/topics/entertainment.xml'),
      },
      '/api/yahoo-sports': {
        target: 'https://news.yahoo.co.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo-sports/, '/rss/topics/sports.xml'),
      },
      '/api/yahoo-science': {
        target: 'https://news.yahoo.co.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo-science/, '/rss/topics/science.xml'),
      },
      '/api/yahoo-it': {
        target: 'https://news.yahoo.co.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo-it/, '/rss/topics/it.xml'),
      },
      '/api/yahoo': {
        target: 'https://news.yahoo.co.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, '/rss/topics/top-picks.xml'),
      },
    },
  },
})
