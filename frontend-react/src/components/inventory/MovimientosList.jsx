/**
 * Lista de movimientos de bodega.
 * - modo "salidas": historial de todos los despachos.
 * - modo "devoluciones": solo los pendientes, con botón para registrar el regreso.
 * @param {{modo:'salidas'|'devoluciones', movimientos:Object[], onDevolver:Function}} props
 */
export default function MovimientosList({ modo, movimientos, onDevolver }) {
  const lista = modo === 'devoluciones' ? movimientos.filter((m) => !m.devuelto) : movimientos;

  if (lista.length === 0) {
    return <p className="gs-vacio">{modo === 'devoluciones' ? 'No hay devoluciones pendientes.' : 'Aún no se han registrado salidas.'}</p>;
  }
  return (
    <div className="gs-tabla-wrap">
      <table className="gs-tabla">
        <thead>
          <tr><th>#</th><th>SKU</th><th>Activo</th><th>Salida</th><th>Estado</th>{modo === 'devoluciones' && <th />}</tr>
        </thead>
        <tbody>
          {lista.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.sku}</td>
              <td>{m.nombre}</td>
              <td>{m.fecha}</td>
              <td><span className={`gs-disp ${m.devuelto ? 'ok' : 'bajo'}`}>{m.devuelto ? 'Devuelto' : 'En alquiler'}</span></td>
              {modo === 'devoluciones' && (
                <td><button className="primario" onClick={() => onDevolver(m)}>Registrar devolución</button></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
