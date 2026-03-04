// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://KeryxDesign.github.io',
  base: '/keryx-design',
  integrations: [
    tailwind(),
    react(),
    sitemap(),
  ],
});
