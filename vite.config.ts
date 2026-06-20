import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages project site: https://thechosenmok.github.io/dev-spaces-agent-dash/
  base: command === 'build' ? '/dev-spaces-agent-dash/' : '/',
}))
