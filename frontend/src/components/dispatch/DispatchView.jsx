import { useState } from 'react';

/**
 * Vista "Salidas / Cadena de Custodia": formulario de despacho a un set de grabación
 * y registro histórico de quién recibió cada activo y cuándo.
 * @param {{activos:Object[], despachos:Object[], skuInicial:string, onDespachar:Function}} props
 */
export default function DispatchView({ activos, despachos, skuInicial, onDespachar }) {
  const disponibles = activos.filter((a) => a.existencia > 0);
  const [form, setForm] = useState({ sku: skuInicial || '', cantidad: '1', set: '', responsable: '' });
  const [errores, setErrores] = useState({});

  const activo = activos.find((a) => a.sku === form.sku);
  const alCambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const alEnviar = (e) => {
    e.preventDefault();
    const err = {};
    const cant = Number(form.cantidad);
    if (!activo) err.sku = 'Seleccione un activo.';
    if (!Number.isInteger(cant) || cant < 1) err.cantidad = 'Mínimo 1 unidad.';
    else if (activo && cant > activo.existencia) err.cantidad = `Solo hay ${activo.existencia} disponibles.`;
    if (!form.set.trim()) err.set = 'Indique el set o producción.';
    if (!form.responsable.trim()) err.responsable = 'Indique quién recibe el armamento.';
    setErrores(err);
    if (Object.keys(err).length) return;
    onDespachar({ sku: form.sku, cantidad: cant, set: form.set.trim(), responsable: form.responsable.trim() });
    setForm({ sku: '', cantidad: '1', set: '', responsable: '' });
  };

  const err = (n) => errores[n] && <span className="gs-error">{errores[n]}</span>;

  return (
    <section>
      <h1>Salidas / Cadena de Custodia</h1>
      <form className="gs-form-panel" onSubmit={alEnviar} noValidate>
        <label>Activo
          <select name="sku" value={form.sku} onChange={alCambiar}>
            <option value="">— Seleccione —</option>
            {disponibles.map((a) => <option key={a.sku} value={a.sku}>{a.sku} · {a.nombre} ({a.existencia})</option>)}
          </select>{err('sku')}
        </label>
        <label>Cantidad
          <input name="cantidad" type="number" min="1" value={form.cantidad} onChange={alCambiar} />{err('cantidad')}
        </label>
        <label>Set de grabación
          <input name="set" maxLength={80} placeholder="Ej. Serie 'Frontera' - Set 3" value={form.set} onChange={alCambiar} />{err('set')}
        </label>
        <label>Responsable que recibe
          <input name="responsable" maxLength={60} value={form.responsable} onChange={alCambiar} />{err('responsable')}
        </label>
        <button type="submit" className="primario">Registrar salida</button>
      </form>

      <h2>Registro de custodia</h2>
      {despachos.length === 0
        ? <p className="gs-vacio">Aún no hay salidas registradas.</p>
        : <div className="gs-tabla-wrap">
            <table className="gs-tabla">
              <thead><tr><th>#</th><th>Fecha</th><th>Activo</th><th>Cant.</th><th>Set</th><th>Responsable</th><th>Estado</th></tr></thead>
              <tbody>
                {[...despachos].reverse().map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td><td>{d.fecha}</td><td>{d.sku}</td><td>{d.cantidad}</td><td>{d.set}</td><td>{d.responsable}</td>
                    <td><span className={`gs-estado ${d.estado === 'En Set' ? 'set' : 'ok'}`}>{d.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
    </section>
  );
}
