import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    fs: {
      strict: false,    // allow vite dev server to access @fs urls above its web root
    },
  },
})
