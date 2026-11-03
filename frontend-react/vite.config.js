import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // En desarrollo, las llamadas a /api se reenvían a la API Express (backend-express, puerto 3000).
  server: { proxy: { '/api': 'http://localhost:3000' } },
});
