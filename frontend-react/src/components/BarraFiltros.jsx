import { CATEGORIAS } from '../data/armas.js';

/**
 * Controles del catálogo.
 * - onChange: input controlado (el valor vive en el estado del padre).
 * - onClick: botones de filtro por categoría.
 */
export default function BarraFiltros({ texto, categoria, onTexto, onCategoria }) {
  return (
    <div className="filtros">
      <input
        type="search"
        placeholder="Buscar por SKU o nombre..."
        value={texto}
        onChange={(e) => onTexto(e.target.value)}
      />
      {CATEGORIAS.map((c) => (
        <button key={c} className={c === categoria ? 'activo' : ''} onClick={() => onCategoria(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}
