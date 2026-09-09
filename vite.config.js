import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  // Relative base so the build works on GitHub Pages project sites
  // (e.g. https://madb0i.github.io/Portfolio/) and on custom domains.
  base: './',
});
