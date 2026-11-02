/**
 * @file Entidad de armamento táctico/escénico (tabla `producto`) y su validación.
 */

/** Categoría por defecto de los registros nuevos (1 = Armas de Fogueo). */
export const CATEGORIA_POR_DEFECTO = 1;

/**
 * @typedef {Object} Producto
 * @property {number} idProducto           Identificador autoincremental.
 * @property {number} idCategoria          Identificador de la categoría.
 * @property {string} skuCodigo            Código SKU único.
 * @property {string} nombreProducto       Nombre descriptivo.
 * @property {number} existencia           Unidades en bodega (entero >= 0).
 * @property {number} valorUnitarioVenta   Tarifa de venta/alquiler (>= 0).
 * @property {number} valorUnitarioCompra  Valor de compra (>= 0).
 */

/**
 * Convierte una fila de MySQL (snake_case) en un Producto (camelCase).
 * mysql2 devuelve los DECIMAL como texto, por eso se convierten a número.
 *
 * @param {Object} fila fila devuelta por la consulta SQL
 * @returns {Producto} producto listo para serializar como JSON
 */
export function desdeFila(fila) {
  return {
    idProducto: fila.id_producto,
    idCategoria: fila.id_categoria,
    skuCodigo: fila.sku_codigo,
    nombreProducto: fila.nombre_producto,
    existencia: Number(fila.existencia),
    valorUnitarioVenta: Number(fila.valor_unitario_venta),
    valorUnitarioCompra: Number(fila.valor_unitario_compra),
  };
}

/**
 * Valida el cuerpo de una petición POST/PUT.
 *
 * @param {Object} cuerpo       cuerpo JSON recibido
 * @param {boolean} [incluirSku=true] si es true exige `skuCodigo` (POST);
 *        en PUT el SKU viene en la URL y no se modifica.
 * @returns {{errores: string[], datos: Omit<Producto,'idProducto'>}}
 *          lista de errores (vacía si todo es válido) y los datos normalizados
 */
export function validarProducto(cuerpo, incluirSku = true) {
  const b = cuerpo ?? {};
  const errores = [];

  const sku = typeof b.skuCodigo === 'string' ? b.skuCodigo.trim() : '';
  if (incluirSku && (!sku || sku.length > 30)) {
    errores.push('skuCodigo es obligatorio (texto de 1 a 30 caracteres).');
  }

  const nombre = typeof b.nombreProducto === 'string' ? b.nombreProducto.trim() : '';
  if (!nombre || nombre.length > 100) {
    errores.push('nombreProducto es obligatorio (texto de 1 a 100 caracteres).');
  }

  if (!Number.isInteger(b.existencia) || b.existencia < 0) {
    errores.push('existencia debe ser un entero mayor o igual a 0.');
  }
  for (const campo of ['valorUnitarioVenta', 'valorUnitarioCompra']) {
    if (typeof b[campo] !== 'number' || !Number.isFinite(b[campo]) || b[campo] < 0) {
      errores.push(`${campo} debe ser un número mayor o igual a 0.`);
    }
  }

  return {
    errores,
    datos: {
      idCategoria: Number.isInteger(b.idCategoria) ? b.idCategoria : CATEGORIA_POR_DEFECTO,
      skuCodigo: sku,
      nombreProducto: nombre,
      existencia: b.existencia,
      valorUnitarioVenta: b.valorUnitarioVenta,
      valorUnitarioCompra: b.valorUnitarioCompra,
    },
  };
}
