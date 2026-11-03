export const VISTAS = [
  { id: 'inventario', texto: 'Inventario / Armamento' },
  { id: 'salidas', texto: 'Salidas / Cadena de Custodia' },
  { id: 'devoluciones', texto: 'Devoluciones / Mantenimiento' },
];

/**
 * Selector de módulos en forma de pestañas accesibles (role="tablist").
 * @param {{vista:string, onCambiar:(id:string)=>void, pendientes:number}} props
 *        `pendientes` = unidades fuera de bodega, mostradas como contador en Devoluciones.
 */
export default function ViewSwitcher({ vista, onCambiar, pendientes }) {
  return (
    <div className="gs-tabs" role="tablist" aria-label="Módulos">
      {VISTAS.map((v) => (
        <button key={v.id} role="tab" aria-selected={v.id === vista}
                className={v.id === vista ? 'activa' : ''} onClick={() => onCambiar(v.id)}>
          {v.texto}
          {v.id === 'devoluciones' && pendientes > 0 && <span className="gs-badge">{pendientes}</span>}
        </button>
      ))}
    </div>
  );
}
