import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://coreweaverlabs.com',
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['4321-it9ijedi8aaz3pcrhza1r-11b62ccf.us3.manus.computer'],
    },
  },
  image: {
    domains: ['lauhqmibfaglnvyhfyfz.supabase.co'],
  },
  build: {
    assets: '_assets',
  },
});
