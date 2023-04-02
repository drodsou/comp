import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    fs: {
      strict: false,    // allow vite dev server to access @fs urls above its web root
    },
  },
  resolve:{
    alias:{
      '@root' : path.resolve(__dirname, '../..')
    },
  },
})
