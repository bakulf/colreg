import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages serves a project site from /<repo>/, not from the root, so the
 * build needs that prefix baked into every asset URL. The workflow sets
 * BASE_PATH; locally it is unset and the site is served from /.
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
});
