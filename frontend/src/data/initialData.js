// Estado inicial en memoria. existencia = unidades disponibles en bodega;
// enSet = unidades alquiladas a un set; enMantenimiento = unidades en revisión técnica.
export const CATEGORIAS = ['Fogueo', 'Utilería', 'Accesorios'];

export const ACTIVOS_INICIALES = [
  { sku: 'ARM-FOG-001', nombre: 'Pistola de fogueo Beretta 92FS', categoria: 'Fogueo', existencia: 12, enSet: 0, enMantenimiento: 0, tarifa: 180000, costo: 120000 },
  { sku: 'ARM-FOG-002', nombre: 'Fusil de fogueo Colt M4A1', categoria: 'Fogueo', existencia: 6, enSet: 0, enMantenimiento: 0, tarifa: 350000, costo: 240000 },
  { sku: 'ARM-FOG-003', nombre: 'Pistola de fogueo Glock 17', categoria: 'Fogueo', existencia: 10, enSet: 0, enMantenimiento: 0, tarifa: 170000, costo: 110000 },
  { sku: 'ARM-FOG-004', nombre: 'Escopeta de fogueo Mossberg 500', categoria: 'Fogueo', existencia: 4, enSet: 0, enMantenimiento: 0, tarifa: 290000, costo: 195000 },
  { sku: 'ARM-FOG-005', nombre: 'Rifle de fogueo Remington 700', categoria: 'Fogueo', existencia: 3, enSet: 0, enMantenimiento: 0, tarifa: 380000, costo: 260000 },
];

export const COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
