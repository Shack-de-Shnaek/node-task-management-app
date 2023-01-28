import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { ViteMinifyPlugin } from 'vite-plugin-minify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    ViteMinifyPlugin({})
  ],
  server: {
    proxy: {
      '/api': 'http://192.168.100.13:3000',
      '/auth': 'http://192.168.100.13:3000',
      '/static': 'http://192.168.100.13:3000'
    }
  },
});
