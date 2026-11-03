import { CATEGORIAS } from '../../data/inventarioMock.js';

/**
 * Búsqueda en tiempo real (onChange en cada tecla) por SKU o texto y filtro por categoría.
 * Es un componente controlado: el estado vive en App.
 */
export default function ItemFilter({ texto, categoria, onTexto, onCategoria, visibles, total }) {
  return (
    <div className="gs-filtro">
      <input
        type="search"
        placeholder="Buscar por SKU o nombre..."
        aria-label="Buscar por SKU o nombre"
        value={texto}
        onChange={(e) => onTexto(e.target.value)}
      />
      <select aria-label="Categoría" value={categoria} onChange={(e) => onCategoria(e.target.value)}>
        <option value="">Todas las categorías</option>
        {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <span className="gs-resultado">{visibles} de {total} activos</span>
    </div>
  );
}
