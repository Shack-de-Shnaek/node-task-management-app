import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/api': 'http://192.168.100.13:3000',
      '/auth': 'http://192.168.100.13:3000',
      '/static': 'http://192.168.100.13:3000'
    }
  },
});
