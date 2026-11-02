/**
 * @file Controlador de productos: lógica de negocio y persistencia (CRUD) en MySQL.
 * Todas las consultas usan parámetros (`?`) para prevenir inyección SQL.
 */
import { pool } from '../config/database.js';
import { desdeFila, validarProducto } from '../models/Producto.js';

const COLUMNAS =
  'id_producto, id_categoria, sku_codigo, nombre_producto, existencia, valor_unitario_venta, valor_unitario_compra';

/**
 * Envuelve un controlador async para que cualquier error llegue al
 * middleware de errores (Express 4 no captura promesas rechazadas por sí solo).
 *
 * @param {(req: import('express').Request, res: import('express').Response) => Promise<void>} fn controlador async
 * @returns {import('express').RequestHandler} manejador compatible con Express
 */
const conManejoDeErrores = (fn) => (req, res, next) => fn(req, res).catch(next);

/**
 * Busca un producto por SKU.
 *
 * @param {string} sku código SKU
 * @returns {Promise<import('../models/Producto.js').Producto|null>} producto o null si no existe
 */
async function buscarPorSku(sku) {
  const [filas] = await pool.query(`SELECT ${COLUMNAS} FROM producto WHERE sku_codigo = ?`, [sku]);
  return filas.length ? desdeFila(filas[0]) : null;
}

/**
 * GET /api/productos — lista todo el inventario (200).
 */
export const listar = conManejoDeErrores(async (req, res) => {
  const [filas] = await pool.query(`SELECT ${COLUMNAS} FROM producto ORDER BY id_producto`);
  res.json(filas.map(desdeFila));
});

/**
 * GET /api/productos/:sku — devuelve un producto (200) o 404 si no existe.
 */
export const obtener = conManejoDeErrores(async (req, res) => {
  const producto = await buscarPorSku(req.params.sku);
  if (!producto) {
    return res.status(404).json({ error: `No existe el producto ${req.params.sku}.` });
  }
  res.json(producto);
});

/**
 * POST /api/productos — registra un producto.
 * Responde 201 con el producto creado, 400 si los datos son inválidos
 * o 409 si el SKU ya existe.
 */
export const crear = conManejoDeErrores(async (req, res) => {
  const { errores, datos } = validarProducto(req.body, true);
  if (errores.length) {
    return res.status(400).json({ error: 'Datos inválidos.', detalles: errores });
  }
  if (await buscarPorSku(datos.skuCodigo)) {
    return res.status(409).json({ error: `El SKU ${datos.skuCodigo} ya existe.` });
  }

  await pool.query(
    `INSERT INTO producto (id_categoria, sku_codigo, nombre_producto, existencia,
                           valor_unitario_venta, valor_unitario_compra)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [datos.idCategoria, datos.skuCodigo, datos.nombreProducto, datos.existencia,
     datos.valorUnitarioVenta, datos.valorUnitarioCompra]
  );
  res.status(201).location(`/api/productos/${encodeURIComponent(datos.skuCodigo)}`)
    .json(await buscarPorSku(datos.skuCodigo));
});

/**
 * PUT /api/productos/:sku — reemplaza los datos de un producto (el SKU no cambia).
 * Responde 200 con el producto actualizado, 400 si los datos son inválidos o 404 si no existe.
 */
export const actualizar = conManejoDeErrores(async (req, res) => {
  const sku = req.params.sku;
  const { errores, datos } = validarProducto(req.body, false);
  if (errores.length) {
    return res.status(400).json({ error: 'Datos inválidos.', detalles: errores });
  }
  if (!(await buscarPorSku(sku))) {
    return res.status(404).json({ error: `No existe el producto ${sku}.` });
  }

  await pool.query(
    `UPDATE producto SET nombre_producto = ?, existencia = ?,
            valor_unitario_venta = ?, valor_unitario_compra = ?
     WHERE sku_codigo = ?`,
    [datos.nombreProducto, datos.existencia, datos.valorUnitarioVenta, datos.valorUnitarioCompra, sku]
  );
  res.json(await buscarPorSku(sku));
});

/**
 * DELETE /api/productos/:sku — elimina un producto.
 * Responde 204 sin cuerpo, o 404 si no existe.
 */
export const eliminar = conManejoDeErrores(async (req, res) => {
  const [resultado] = await pool.query('DELETE FROM producto WHERE sku_codigo = ?', [req.params.sku]);
  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: `No existe el producto ${req.params.sku}.` });
  }
  res.status(204).end();
});
