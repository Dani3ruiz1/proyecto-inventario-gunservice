/**
 * @file Aplicación Express: middlewares, rutas y manejo centralizado de errores.
 * Se separa de server.js para poder probarla sin abrir un puerto fijo.
 */
import express from 'express';
import productoRoutes from './routes/productoRoutes.js';

/**
 * Crea la aplicación Express.
 *
 * @returns {import('express').Express} aplicación configurada
 */
export function crearApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/salud', (req, res) => res.json({ estado: 'ok' }));
  app.use('/api/productos', productoRoutes);

  // 404 para rutas desconocidas.
  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

  // Errores no controlados (JSON mal formado, fallos de MySQL, etc.).
  // Se deben declarar 4 parámetros para que Express lo reconozca como manejador de errores.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'El cuerpo no es un JSON válido.' });
    }
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  });

  return app;
}
