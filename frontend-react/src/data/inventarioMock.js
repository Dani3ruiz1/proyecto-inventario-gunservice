// Datos de respaldo (modo Offline). Los 5 primeros coinciden con la tabla `producto` de gun_service_db.
export const CATEGORIAS = ['Fogueo', 'Utilería', 'Accesorios'];

// id_categoria de la base de datos -> nombre mostrado en la interfaz.
export const CATEGORIA_POR_ID = { 1: 'Fogueo', 2: 'Utilería', 3: 'Accesorios' };
export const ID_POR_CATEGORIA = { Fogueo: 1, Utilería: 2, Accesorios: 3 };

export const INVENTARIO_MOCK = [
  { sku: 'ARM-FOG-001', nombre: 'Pistola de fogueo Beretta 92FS (utilería escénica)', categoria: 'Fogueo', existencia: 12, tarifa: 180000, costo: 120000 },
  { sku: 'ARM-FOG-002', nombre: 'Fusil de fogueo M4 Carbine (utilería escénica)', categoria: 'Fogueo', existencia: 6, tarifa: 350000, costo: 240000 },
  { sku: 'ARM-FOG-003', nombre: 'Revólver de fogueo Colt Python 357 (utilería escénica)', categoria: 'Fogueo', existencia: 8, tarifa: 160000, costo: 105000 },
  { sku: 'ARM-FOG-004', nombre: 'Escopeta de fogueo Remington 870 (utilería escénica)', categoria: 'Fogueo', existencia: 4, tarifa: 290000, costo: 195000 },
  { sku: 'ARM-FOG-005', nombre: 'Subfusil de fogueo HK MP5 (utilería escénica)', categoria: 'Fogueo', existencia: 5, tarifa: 320000, costo: 215000 },
];
