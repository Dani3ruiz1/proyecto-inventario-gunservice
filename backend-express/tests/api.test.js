/**
 * @file Pruebas de integración de la API contra la base de datos real (gun_service_db).
 * Usa el runner nativo de Node (`node:test`) y fetch; crea y elimina el SKU de prueba.
 * Ejecutar con `npm test` (requiere MySQL activo y las variables DB_* definidas).
 */
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';
import { pool } from '../src/config/database.js';

const servidor = crearApp().listen(0);
const base = `http://localhost:${servidor.address().port}/api/productos`;
const SKU = 'TEST-API-001';
const cuerpo = { skuCodigo: SKU, nombreProducto: 'Pistola de prueba', existencia: 3,
                 valorUnitarioVenta: 100000, valorUnitarioCompra: 60000 };

/** Envía una petición JSON y devuelve estado + cuerpo. */
async function peticion(metodo, ruta = '', datos) {
  const r = await fetch(base + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: datos ? JSON.stringify(datos) : undefined,
  });
  return { estado: r.status, json: r.status === 204 ? null : await r.json() };
}

after(async () => {
  await pool.query('DELETE FROM producto WHERE sku_codigo = ?', [SKU]); // limpieza por si falla algo
  servidor.close();
  await pool.end();
});

test('CRUD completo de /api/productos', async () => {
  await pool.query('DELETE FROM producto WHERE sku_codigo = ?', [SKU]);

  const creado = await peticion('POST', '', cuerpo);
  assert.equal(creado.estado, 201);
  assert.equal(creado.json.skuCodigo, SKU);

  assert.equal((await peticion('POST', '', cuerpo)).estado, 409, 'SKU repetido');
  assert.equal((await peticion('POST', '', { ...cuerpo, skuCodigo: 'X', existencia: -1 })).estado, 400);

  const lista = await peticion('GET');
  assert.equal(lista.estado, 200);
  assert.ok(lista.json.some((p) => p.skuCodigo === SKU));

  const nuevo = { ...cuerpo, nombreProducto: 'Pistola editada', existencia: 9, valorUnitarioVenta: 120000 };
  const act = await peticion('PUT', `/${SKU}`, nuevo);
  assert.equal(act.estado, 200);
  assert.equal(act.json.existencia, 9);

  assert.equal((await peticion('GET', `/${SKU}`)).json.nombreProducto, 'Pistola editada');
  assert.equal((await peticion('DELETE', `/${SKU}`)).estado, 204);
  assert.equal((await peticion('GET', `/${SKU}`)).estado, 404);
  assert.equal((await peticion('DELETE', `/${SKU}`)).estado, 404);
});
