// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jorgelealdev.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  },
  build: {
    inlineStylesheets: 'always' // Inlinar todo el CSS para eliminar bloqueo de renderización
  },
  compressHTML: true
});
