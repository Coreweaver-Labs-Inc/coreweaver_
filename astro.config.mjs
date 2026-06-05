import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://coreweaverlabs.com',
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['lauhqmibfaglnvyhfyfz.supabase.co'],
  },
  build: {
    assets: '_assets',
  },
});
