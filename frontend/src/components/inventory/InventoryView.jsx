import { useMemo, useState } from 'react';
import ItemCard from './ItemCard.jsx';
import { CATEGORIAS } from '../../data/initialData.js';

/**
 * Vista "Inventario / Armamento": buscador reactivo (SKU o nombre), filtro por categoría
 * y cuadrícula de tarjetas. El texto y la categoría son estado local de esta vista.
 * @param {{activos:Object[], onNuevo:Function, onEditar:Function, onDespachar:Function}} props
 */
export default function InventoryView({ activos, onNuevo, onEditar, onDespachar }) {
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('');

  const visibles = useMemo(() => {
    const t = texto.trim().toLowerCase();
    return activos.filter(
      (a) => (!categoria || a.categoria === categoria) && (a.sku.toLowerCase().includes(t) || a.nombre.toLowerCase().includes(t))
    );
  }, [activos, texto, categoria]);

  return (
    <section>
      <div className="gs-titulo">
        <h1>Inventario / Armamento</h1>
        <button className="primario" onClick={onNuevo}>+ Registrar activo</button>
      </div>

      <div className="gs-filtro">
        <input type="search" placeholder="Buscar por SKU o nombre..." aria-label="Buscar por SKU o nombre"
               value={texto} onChange={(e) => setTexto(e.target.value)} />
        <select aria-label="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="gs-contador">{visibles.length} de {activos.length}</span>
      </div>

      {visibles.length === 0
        ? <p className="gs-vacio">No hay activos que coincidan con la búsqueda.</p>
        : <div className="gs-grid">
            {visibles.map((a) => <ItemCard key={a.sku} activo={a} onEditar={onEditar} onDespachar={onDespachar} />)}
          </div>}
    </section>
  );
}
