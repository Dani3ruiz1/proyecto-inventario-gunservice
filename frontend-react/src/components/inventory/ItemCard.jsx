const COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

/** Estado de disponibilidad según las unidades en bodega. */
function disponibilidad(existencia) {
  if (existencia <= 0) return { clase: 'agotado', texto: 'Agotado' };
  if (existencia <= 5) return { clase: 'bajo', texto: `Pocas unidades (${existencia})` };
  return { clase: 'ok', texto: `Disponible (${existencia})` };
}

/** Silueta SVG usada como imagen del activo (la base de datos no almacena fotos). */
function Silueta() {
  return (
    <svg viewBox="0 0 120 60" aria-hidden="true">
      <path d="M8 22h70l8-8h22v10h-14l-6 6H64l-6 22H40l5-22H8z" fill="currentColor" />
    </svg>
  );
}

/**
 * Tarjeta de un activo táctico con sus acciones.
 * @param {{item:Object, onAlquilar:Function, onEditar:Function, onEliminar:Function}} props
 */
export default function ItemCard({ item, onAlquilar, onEditar, onEliminar }) {
  const disp = disponibilidad(item.existencia);
  return (
    <article className="gs-card">
      <div className="gs-card__img" data-cat={item.categoria}>
        <Silueta />
        <span className="gs-etiqueta">{item.categoria}</span>
      </div>
      <div className="gs-card__cuerpo">
        <p className="gs-sku">{item.sku}</p>
        <h3>{item.nombre}</h3>
        <p className={`gs-disp ${disp.clase}`}>{disp.texto}</p>
        <p className="gs-tarifa">{COP.format(item.tarifa)} <small>/ alquiler</small></p>
      </div>
      <div className="gs-card__acciones">
        <button className="primario" disabled={item.existencia <= 0} onClick={() => onAlquilar(item)}>Alquilar</button>
        <button onClick={() => onEditar(item)}>Editar</button>
        <button className="peligro" onClick={() => onEliminar(item)}>Eliminar</button>
      </div>
    </article>
  );
}
