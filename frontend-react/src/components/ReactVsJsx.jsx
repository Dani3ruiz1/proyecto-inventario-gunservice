import React, { useState } from 'react';

/**
 * PUNTO 1 - React vs JSX.
 * React es la biblioteca (estado + renderizado reactivo); JSX es la sintaxis que
 * Babel/Vite transforma en llamadas a React.createElement. Ambos bloques generan el mismo DOM.
 */
export default function ReactVsJsx() {
  const [unidades, setUnidades] = useState(5);

  // Sin JSX: React "puro".
  const sinJsx = React.createElement(
    'p',
    { className: 'demo' },
    'Sin JSX (createElement): ',
    React.createElement('strong', null, unidades),
    ' unidades en bodega'
  );

  // Con JSX: sintaxis declarativa, describe QUÉ se ve, no CÓMO manipular el DOM.
  const conJsx = (
    <p className="demo">
      Con JSX: <strong>{unidades}</strong> unidades en bodega
    </p>
  );

  return (
    <section>
      <h2>1. React vs JSX</h2>
      {sinJsx}
      {conJsx}
      {/* Renderizado reactivo: setUnidades cambia el estado y React re-renderiza sólo lo necesario. */}
      <button onClick={() => setUnidades(unidades + 1)}>+1 unidad</button>{' '}
      <button onClick={() => setUnidades(Math.max(0, unidades - 1))}>-1 unidad</button>
    </section>
  );
}
