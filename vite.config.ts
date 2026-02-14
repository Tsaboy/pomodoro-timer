import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pomodoro-timer/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
