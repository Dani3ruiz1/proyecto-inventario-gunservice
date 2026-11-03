import { COP } from '../../data/initialData.js';

/** Silueta SVG usada como imagen del activo. */
function Silueta() {
  return (
    <svg viewBox="0 0 120 60" aria-hidden="true">
      <path d="M8 22h70l8-8h22v10h-14l-6 6H64l-6 22H40l5-22H8z" fill="currentColor" />
    </svg>
  );
}

/** Estado visible del activo según dónde están sus unidades. */
function estadoDe(a) {
  if (a.enSet > 0) return { clase: 'set', texto: `Alquilado / En Set (${a.enSet})` };
  if (a.enMantenimiento > 0) return { clase: 'rev', texto: `En revisión (${a.enMantenimiento})` };
  return { clase: 'ok', texto: 'Disponible' };
}

/**
 * Tarjeta de un activo táctico.
 * @param {{activo:Object, onEditar:Function, onDespachar:Function}} props
 */
export default function ItemCard({ activo, onEditar, onDespachar }) {
  const estado = estadoDe(activo);
  return (
    <article className="gs-card">
      <div className="gs-card__img"><Silueta /><span className="gs-etiqueta">{activo.categoria}</span></div>
      <div className="gs-card__cuerpo">
        <p className="gs-sku">{activo.sku}</p>
        <h3>{activo.nombre}</h3>
        <p><span className={`gs-estado ${estado.clase}`}>{estado.texto}</span></p>
        <p className="gs-datos">En bodega: <b>{activo.existencia}</b></p>
        <p className="gs-tarifa">{COP.format(activo.tarifa)} <small>/ alquiler</small></p>
      </div>
      <div className="gs-card__acciones">
        <button className="primario" disabled={activo.existencia <= 0} onClick={() => onDespachar(activo.sku)}>Despachar</button>
        <button onClick={() => onEditar(activo)}>Editar</button>
      </div>
    </article>
  );
}
