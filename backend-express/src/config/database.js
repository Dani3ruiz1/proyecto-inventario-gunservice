/**
 * @file Conexión a MySQL (gun_service_db).
 * Usa un pool de conexiones de mysql2/promise: reutiliza conexiones entre
 * peticiones y soporta consultas concurrentes (a diferencia de una conexión única).
 */
import mysql from 'mysql2/promise';
import { env } from './env.js';

/**
 * Pool compartido por toda la aplicación.
 * @type {import('mysql2/promise').Pool}
 */
export const pool = mysql.createPool({
  ...env.db,
  waitForConnections: true,
  connectionLimit: 10,
});

/**
 * Verifica que la base de datos responda. Se usa al arrancar el servidor
 * para fallar rápido si las credenciales o el servicio MySQL son incorrectos.
 *
 * @returns {Promise<void>} se resuelve si la consulta de prueba funciona
 * @throws {Error} si no es posible conectarse a MySQL
 */
export async function verificarConexion() {
  await pool.query('SELECT 1');
}
