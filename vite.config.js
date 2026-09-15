import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// VITE_BASE: subruta en la que se sirve (GitHub Pages la sirve en /calculadora/).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
})
