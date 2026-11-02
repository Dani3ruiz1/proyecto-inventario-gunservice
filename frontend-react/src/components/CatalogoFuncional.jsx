import { useEffect, useMemo, useState } from 'react';
import BarraFiltros from './BarraFiltros.jsx';
import TarjetaArma from './TarjetaArma.jsx';
import { filtrarArmas } from '../events/manejadores.js';

/**
 * PUNTO 2 - Componente funcional moderno con Hooks.
 * useState: estado local · useMemo: cálculo derivado · useEffect: efecto secundario.
 */
export default function CatalogoFuncional({ armas }) {
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [seleccion, setSeleccion] = useState(null);

  // Sólo recalcula cuando cambian las dependencias.
  const visibles = useMemo(() => filtrarArmas(armas, texto, categoria), [armas, texto, categoria]);

  // Equivale a componentDidUpdate: se ejecuta cuando cambia la selección.
  useEffect(() => {
    document.title = seleccion ? `Seleccionada: ${seleccion}` : 'Gun Service International - Taller React';
  }, [seleccion]);

  return (
    <section>
      <h2>2b. Catálogo con componente funcional + Hooks</h2>
      <BarraFiltros texto={texto} categoria={categoria} onTexto={setTexto} onCategoria={setCategoria} />
      <p>{visibles.length} de {armas.length} armas</p>
      <div className="rejilla">
        {visibles.map((a) => (
          <TarjetaArma key={a.sku} arma={a} seleccionada={a.sku === seleccion} onSeleccionar={setSeleccion} />
        ))}
      </div>
    </section>
  );
}
