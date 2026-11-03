import { useEffect, useState } from 'react';
import { CATEGORIAS } from '../../data/inventarioMock.js';

const PATRON_SKU = /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/;

/** Valida los campos del formulario (texto) y devuelve un objeto { campo: mensaje }. */
function validar(f, skusExistentes, editando) {
  const e = {};
  const sku = f.sku.trim();
  if (sku.length < 5 || sku.length > 30 || !PATRON_SKU.test(sku)) {
    e.sku = 'De 5 a 30 caracteres: letras, números y guiones (ej. ARM-FOG-006).';
  } else if (!editando && skusExistentes.includes(sku)) {
    e.sku = 'Ese SKU ya existe.';
  }
  if (!f.nombre.trim() || f.nombre.length > 100) e.nombre = 'Obligatorio, máximo 100 caracteres.';
  if (f.existencia === '' || !Number.isInteger(Number(f.existencia)) || Number(f.existencia) < 0) {
    e.existencia = 'Debe ser un entero mayor o igual a 0.';
  }
  if (!(Number(f.tarifa) > 0)) e.tarifa = 'La tarifa debe ser mayor a 0.';
  if (!(Number(f.costo) > 0)) e.costo = 'El costo debe ser mayor a 0.';
  return e;
}

/**
 * Ventana modal para registrar (item = null) o modificar un activo.
 * Formulario controlado: onChange actualiza el estado y onSubmit valida antes de guardar.
 * Se monta con `key` distinta por activo, así el estado inicial siempre corresponde al activo abierto.
 */
export default function ItemFormModal({ item, skusExistentes, onGuardar, onCerrar }) {
  const editando = item !== null;
  const [form, setForm] = useState(
    editando
      ? { ...item, existencia: String(item.existencia), tarifa: String(item.tarifa), costo: String(item.costo) }
      : { sku: '', nombre: '', categoria: CATEGORIAS[0], existencia: '', tarifa: '', costo: '' }
  );
  const [errores, setErrores] = useState({});

  // Escape cierra la ventana.
  useEffect(() => {
    const alTeclear = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [onCerrar]);

  const alCambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const alEnviar = (e) => {
    e.preventDefault(); // evita la recarga de la página
    const problemas = validar(form, skusExistentes, editando);
    setErrores(problemas);
    if (Object.keys(problemas).length) return;
    onGuardar({
      ...item,
      sku: form.sku.trim(),
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      existencia: Number(form.existencia),
      tarifa: Number(form.tarifa),
      costo: Number(form.costo),
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
      <form className="gs-modal" role="dialog" aria-modal="true" aria-label={editando ? 'Editar activo' : 'Registrar activo'}
            onClick={(e) => e.stopPropagation()} onSubmit={alEnviar} noValidate>
        <h2>{editando ? `Editar ${item.sku}` : 'Registrar nuevo activo'}</h2>
        {campo('sku', 'SKU', { readOnly: editando, maxLength: 30, placeholder: 'ARM-FOG-006' })}
        {campo('nombre', 'Nombre', { maxLength: 100 })}
        <label>
          Categoría
          <select name="categoria" value={form.categoria} onChange={alCambiar}>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <div className="gs-fila">
          {campo('existencia', 'Existencia', { type: 'number', min: 0, step: 1 })}
          {campo('tarifa', 'Tarifa de alquiler', { type: 'number', min: 0, step: 'any' })}
          {campo('costo', 'Costo de compra', { type: 'number', min: 0, step: 'any' })}
        </div>
        <div className="gs-modal__acciones">
          <button type="button" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className="primario">{editando ? 'Guardar cambios' : 'Registrar'}</button>
        </div>
      </form>
    </div>
  );
}
