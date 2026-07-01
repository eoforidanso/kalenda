import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // './' for Capacitor native builds, '/kalenda/' for GitHub Pages, '/' for local dev
  base: process.env.MOBILE === 'true' ? './' : (process.env.GITHUB_PAGES === 'true' ? '/kalenda/' : '/'),
})
