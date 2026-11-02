import { useState } from 'react';
import { formatoCOP } from '../events/manejadores.js';

/**
 * Componente funcional presentacional con eventos de ratón.
 * - onMouseEnter / onMouseLeave: efecto de "inspección" (resalta y muestra detalle).
 * - onClick: selecciona el arma (el padre decide qué hacer con ella).
 */
export default function TarjetaArma({ arma, seleccionada, onSeleccionar }) {
  const [inspeccionando, setInspeccionando] = useState(false);

  const clases = ['tarjeta', inspeccionando && 'inspeccion', seleccionada && 'seleccionada']
    .filter(Boolean)
    .join(' ');

  return (
    <article
      className={clases}
      onMouseEnter={() => setInspeccionando(true)}
      onMouseLeave={() => setInspeccionando(false)}
      onClick={() => onSeleccionar(arma.sku)}
    >
      <h3>{arma.nombre}</h3>
      <p className="sku">{arma.sku} · {arma.categoria}</p>
      {/* Renderizado condicional: el detalle sólo existe mientras el mouse está encima. */}
      {inspeccionando && (
        <p className="detalle">Existencia: {arma.stock} · Tarifa: {formatoCOP(arma.tarifa)}</p>
      )}
    </article>
  );
}
