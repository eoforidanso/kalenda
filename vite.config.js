import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // './' for Capacitor native builds, '/' for web/PWA deployment
  base: process.env.MOBILE === 'true' ? './' : '/',
})
