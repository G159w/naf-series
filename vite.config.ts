import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const target = 'es2022';

export default defineConfig({
  build: {
    target
  },
  esbuild: {
    target
  },
  optimizeDeps: {
    esbuildOptions: {
      target
    }
  },
  plugins: [sveltekit()]
});
