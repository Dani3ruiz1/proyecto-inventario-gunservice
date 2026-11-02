/**
 * @file Script de arranque: verifica la conexión a MySQL y levanta el servidor HTTP.
 * Ejecutar con `npm start`.
 */
import { env } from './config/env.js';
import { verificarConexion, pool } from './config/database.js';
import { crearApp } from './app.js';

try {
  await verificarConexion();
} catch (e) {
  console.error(`[ERROR] No fue posible conectarse a MySQL (${env.db.database}): ${e.message}`);
  process.exit(1);
}

console.log(`[OK] Conexión a MySQL verificada: ${env.db.user}@${env.db.host}:${env.db.port}/${env.db.database}`);

const servidor =crearApp().listen(env.port, () => {
  console.log(`API de Gun Service International en http://localhost:${env.port}/api/productos`);
});

// Cierre ordenado con Ctrl+C: deja de aceptar peticiones y libera el pool de MySQL.
process.on('SIGINT', () => servidor.close(() => pool.end().then(() => process.exit(0))));
