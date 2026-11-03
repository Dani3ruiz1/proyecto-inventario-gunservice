// Cliente de la API REST (backend-express). En desarrollo, Vite redirige /api -> http://localhost:3000.
import { CATEGORIA_POR_ID, ID_POR_CATEGORIA } from '../data/inventarioMock.js';

const BASE = '/api/productos';

/** Traduce un producto de la API al modelo de la interfaz. */
export const desdeApi = (p) => ({
  idProducto: p.idProducto,
  sku: p.skuCodigo,
  nombre: p.nombreProducto,
  categoria: CATEGORIA_POR_ID[p.idCategoria] ?? 'Fogueo',
  existencia: p.existencia,
  tarifa: p.valorUnitarioVenta,
  costo: p.valorUnitarioCompra,
});

/** Traduce un activo de la interfaz al cuerpo JSON que espera la API. */
const haciaApi = (i) => ({
  skuCodigo: i.sku,
  nombreProducto: i.nombre,
  idCategoria: ID_POR_CATEGORIA[i.categoria] ?? 1,
  existencia: i.existencia,
  valorUnitarioVenta: i.tarifa,
  valorUnitarioCompra: i.costo,
});

async function pedir(url, opciones) {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opciones });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.detalles?.[0] ?? e.error ?? `Error HTTP ${r.status}`);
  }
  return r.status === 204 ? null : r.json();
}

export const listar = async () => (await pedir(BASE)).map(desdeApi);
export const crear = async (i) => desdeApi(await pedir(BASE, { method: 'POST', body: JSON.stringify(haciaApi(i)) }));
export const actualizar = async (i) =>
  desdeApi(await pedir(`${BASE}/${encodeURIComponent(i.sku)}`, { method: 'PUT', body: JSON.stringify(haciaApi(i)) }));
export const eliminar = (sku) => pedir(`${BASE}/${encodeURIComponent(sku)}`, { method: 'DELETE' });
