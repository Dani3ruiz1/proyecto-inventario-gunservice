import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// open: true abre el navegador automáticamente al iniciar `npm run dev`.
export default defineConfig({ plugins: [react()], server: { port: 5173, open: true } });
