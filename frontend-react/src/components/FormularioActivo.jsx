import { useState } from 'react';
import { CATEGORIAS } from '../data/armas.js';
import { validarActivo, crearActivo } from '../events/manejadores.js';

const VACIO = { sku: '', nombre: '', categoria: 'Pistola', stock: '', tarifa: '' };

/**
 * PUNTO 3 - onSubmit y onChange en un formulario controlado.
 * Se usa preventDefault() para que el navegador no recargue la página.
 */
export default function FormularioActivo({ onAgregar, skusExistentes }) {
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState(null);

  // Un solo onChange para todos los campos, identificados por su atributo name.
  const alCambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const alEnviar = (e) => {
    e.preventDefault();
    const problema = validarActivo(form) || (skusExistentes.includes(form.sku.trim()) ? 'Ese SKU ya existe.' : null);
    if (problema) return setError(problema);
    onAgregar(crearActivo(form));
    setForm(VACIO);
    setError(null);
  };

  return (
    <section>
      <h2>3. Agregar activo táctico (onSubmit)</h2>
      <form onSubmit={alEnviar} className="formulario">
        <input name="sku" placeholder="SKU (ARM-FOG-006)" value={form.sku} onChange={alCambiar} />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={alCambiar} />
        <select name="categoria" value={form.categoria} onChange={alCambiar}>
          {CATEGORIAS.filter((c) => c !== 'Todas').map((c) => <option key={c}>{c}</option>)}
        </select>
        <input name="stock" type="number" min="0" placeholder="Existencia" value={form.stock} onChange={alCambiar} />
        <input name="tarifa" type="number" min="0" placeholder="Tarifa" value={form.tarifa} onChange={alCambiar} />
        <button type="submit">Agregar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
