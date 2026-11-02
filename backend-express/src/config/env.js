/**
 * @file Variables de entorno de la aplicación.
 * Se leen de process.env (cargado con `node --env-file=.env`) y, si faltan,
 * se usan valores por defecto de desarrollo. Nunca se escriben credenciales en el código.
 */

/**
 * Configuración centralizada y de solo lectura.
 * @type {{port:number, db:{host:string, port:number, database:string, user:string, password:string}}}
 */
export const env = Object.freeze({
  port: Number(process.env.PORT) || 3000,
  db: Object.freeze({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME ?? 'gun_service_db',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
  }),
});
