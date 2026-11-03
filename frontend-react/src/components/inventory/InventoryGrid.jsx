import ItemCard from './ItemCard.jsx';

/**
 * Cuadrícula reactiva (CSS grid auto-fill) que renderiza una ItemCard por activo.
 * Si la lista está vacía muestra un mensaje en lugar de una cuadrícula vacía.
 */
export default function InventoryGrid({ items, onAlquilar, onEditar, onEliminar }) {
  if (items.length === 0) {
    return <p className="gs-vacio">No hay activos que coincidan con la búsqueda.</p>;
  }
  return (
    <div className="gs-grid">
      {items.map((item) => (
        <ItemCard key={item.sku} item={item} onAlquilar={onAlquilar} onEditar={onEditar} onEliminar={onEliminar} />
      ))}
    </div>
  );
}
