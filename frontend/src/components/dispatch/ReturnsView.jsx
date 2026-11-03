import { useState } from 'react';

const CONDICIONES = ['Óptimo', 'Requiere mantenimiento'];

/** Fila de un despacho pendiente: permite registrar la inspección al recibirlo. */
function FilaDevolucion({ despacho, onRecibir }) {
  const [condicion, setCondicion] = useState(CONDICIONES[0]);
  const [notas, setNotas] = useState('');
  return (
    <tr>
      <td>{despacho.id}</td>
      <td>{despacho.sku} <small>×{despacho.cantidad}</small></td>
      <td>{despacho.set}</td>
      <td>
        <select value={condicion} onChange={(e) => setCondicion(e.target.value)} aria-label="Estado al recibir">
          {CONDICIONES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </td>
      <td><input value={notas} maxLength={120} placeholder="Observaciones" onChange={(e) => setNotas(e.target.value)} /></td>
      <td><button className="primario" onClick={() => onRecibir(despacho.id, condicion, notas)}>Recibir</button></td>
    </tr>
  );
}

/**
 * Vista "Devoluciones / Mantenimiento": control de estado al recibir un activo
 * y revisión técnica antes de volver a bodega.
 * @param {{despachos:Object[], activos:Object[], onRecibir:Function, onAprobar:Function}} props
 */
export default function ReturnsView({ despachos, activos, onRecibir, onAprobar }) {
  const pendientes = despachos.filter((d) => d.estado === 'En Set');
  const enRevision = activos.filter((a) => a.enMantenimiento > 0);

  return (
    <section>
      <h1>Devoluciones / Mantenimiento</h1>

      <h2>Pendientes de devolución</h2>
      {pendientes.length === 0
        ? <p className="gs-vacio">No hay armamento fuera de bodega.</p>
        : <div className="gs-tabla-wrap">
            <table className="gs-tabla">
              <thead><tr><th>#</th><th>Activo</th><th>Set</th><th>Estado al recibir</th><th>Notas</th><th /></tr></thead>
              <tbody>{pendientes.map((d) => <FilaDevolucion key={d.id} despacho={d} onRecibir={onRecibir} />)}</tbody>
            </table>
          </div>}

      <h2>Revisión técnica</h2>
      {enRevision.length === 0
        ? <p className="gs-vacio">No hay activos en revisión técnica.</p>
        : <ul className="gs-lista">
            {enRevision.map((a) => (
              <li key={a.sku}>
                <span><b>{a.sku}</b> · {a.nombre} — {a.enMantenimiento} en revisión</span>
                <button className="primario" onClick={() => onAprobar(a.sku)}>Aprobar revisión (1 u.)</button>
              </li>
            ))}
          </ul>}
    </section>
  );
}
