import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The Three.js chunk is loaded on demand for the 3D mark, so it is allowed to exceed the default budget.
    chunkSizeWarningLimit: 600,
  },
});
