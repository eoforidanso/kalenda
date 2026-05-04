import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// MOBILE=true builds with base './' for Capacitor; default uses '/kalenda/' for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: process.env.MOBILE === 'true' ? './' : '/kalenda/',
})
