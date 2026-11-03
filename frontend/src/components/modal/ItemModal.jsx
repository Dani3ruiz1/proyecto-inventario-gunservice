import { useEffect, useState } from 'react';
import { CATEGORIAS } from '../../data/initialData.js';

const PATRON_SKU = /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/;

/** Valida el formulario y devuelve { campo: mensaje } (vacío si todo es correcto). */
function validar(f, skusExistentes, editando) {
  const e = {};
  const sku = f.sku.trim();
  if (sku.length < 5 || sku.length > 30 || !PATRON_SKU.test(sku)) e.sku = 'De 5 a 30 caracteres: letras, números y guiones.';
  else if (!editando && skusExistentes.includes(sku)) e.sku = 'Ese SKU ya existe.';
  if (!f.nombre.trim() || f.nombre.length > 100) e.nombre = 'Obligatorio, máximo 100 caracteres.';
  if (f.existencia === '' || !Number.isInteger(Number(f.existencia)) || Number(f.existencia) < 0) e.existencia = 'Entero mayor o igual a 0.';
  if (!(Number(f.tarifa) > 0)) e.tarifa = 'La tarifa debe ser mayor a 0.';
  if (!(Number(f.costo) > 0)) e.costo = 'El costo debe ser mayor a 0.';
  return e;
}

/**
 * Modal para registrar (activo = null) o editar un activo táctico.
 * Formulario controlado con validación en onSubmit; Escape o clic fuera lo cierran.
 * @param {{activo:Object|null, skusExistentes:string[], onGuardar:Function, onCerrar:Function}} props
 */
export default function ItemModal({ activo, skusExistentes, onGuardar, onCerrar }) {
  const editando = activo !== null;
  const [form, setForm] = useState(
    editando
      ? { ...activo, existencia: String(activo.existencia), tarifa: String(activo.tarifa), costo: String(activo.costo) }
      : { sku: '', nombre: '', categoria: CATEGORIAS[0], existencia: '', tarifa: '', costo: '' }
  );
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const alTeclear = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [onCerrar]);

  const alCambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const alEnviar = (e) => {
    e.preventDefault();
    const problemas = validar(form, skusExistentes, editando);
    setErrores(problemas);
    if (Object.keys(problemas).length) return;
    onGuardar({
      enSet: 0, enMantenimiento: 0, ...activo,
      sku: form.sku.trim(), nombre: form.nombre.trim(), categoria: form.categoria,
      existencia: Number(form.existencia), tarifa: Number(form.tarifa), costo: Number(form.costo),
    });
  };

  const campo = (name, etiqueta, props = {}) => (
    <label className={errores[name] ? 'invalido' : ''}>
      {etiqueta}
      <input name={name} value={form[name]} onChange={alCambiar} {...props} />
      {errores[name] && <span className="gs-error">{errores[name]}</span>}
    </label>
  );

  return (
    <div className="gs-overlay" onClick={onCerrar}>
      <form className="gs-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={alEnviar} noValidate>
        <h2>{editando ? `Editar ${activo.sku}` : 'Registrar nuevo activo táctico'}</h2>
        {campo('sku', 'SKU', { readOnly: editando, maxLength: 30, placeholder: 'ARM-FOG-006' })}
        {campo('nombre', 'Nombre', { maxLength: 100 })}
        <label>Categoría
          <select name="categoria" value={form.categoria} onChange={alCambiar}>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <div className="gs-fila">
          {campo('existencia', 'Existencia', { type: 'number', min: 0, step: 1 })}
          {campo('tarifa', 'Tarifa alquiler', { type: 'number', min: 0, step: 'any' })}
          {campo('costo', 'Costo compra', { type: 'number', min: 0, step: 'any' })}
        </div>
        <div className="gs-modal__acciones">
          <button type="button" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className="primario">{editando ? 'Guardar cambios' : 'Registrar'}</button>
        </div>
      </form>
    </div>
  );
}
