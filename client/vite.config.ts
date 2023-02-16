import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [
    svelte({
      prebundleSvelteLibraries: true,
    }),
  ],
  server: {
    proxy: {
      '/api': `http://${process.env.PROXY_IP}:3000`,
      '/auth': `http://${process.env.PROXY_IP}:3000`,
      '/static': `http://${process.env.PROXY_IP}:3000`
    }
  },
});
