// Lógica pura de los eventos: no depende de React, por eso es fácil de probar y reutilizar.
// Los componentes sólo "conectan" el evento sintético con estas funciones.

/** onChange: filtra por texto (SKU o nombre) y por categoría. */
export function filtrarArmas(armas, texto, categoria) {
  const t = texto.trim().toLowerCase();
  return armas.filter(
    (a) =>
      (categoria === 'Todas' || a.categoria === categoria) &&
      (a.sku.toLowerCase().includes(t) || a.nombre.toLowerCase().includes(t))
  );
}

/** onSubmit: valida los campos del formulario; devuelve un mensaje de error o null. */
export function validarActivo(f) {
  if (!/^[A-Z]{3}-[A-Z]{3}-\d{3}$/.test(f.sku)) return 'El SKU debe tener el formato AAA-AAA-000.';
  if (!f.nombre.trim()) return 'El nombre es obligatorio.';
  if (!(Number(f.stock) >= 0) || f.stock === '') return 'La existencia debe ser un número mayor o igual a 0.';
  if (!(Number(f.tarifa) > 0)) return 'La tarifa debe ser mayor a 0.';
  return null;
}

/** onSubmit: convierte los valores del formulario (texto) en un activo con tipos correctos. */
export function crearActivo(f) {
  return {
    sku: f.sku.trim(),
    nombre: f.nombre.trim(),
    categoria: f.categoria,
    stock: Number(f.stock),
    tarifa: Number(f.tarifa),
  };
}

export const formatoCOP = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
