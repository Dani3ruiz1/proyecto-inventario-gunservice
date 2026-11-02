/**
 * @file Enrutamiento HTTP del recurso /api/productos.
 */
import { Router } from 'express';
import * as productos from '../controllers/productoController.js';

/**
 * Router montado en `/api/productos` (ver app.js).
 * @type {import('express').Router}
 */
const router = Router();

router.get('/', productos.listar);          // GET    /api/productos
router.get('/:sku', productos.obtener);     // GET    /api/productos/:sku
router.post('/', productos.crear);          // POST   /api/productos
router.put('/:sku', productos.actualizar);  // PUT    /api/productos/:sku
router.delete('/:sku', productos.eliminar); // DELETE /api/productos/:sku

export default router;
