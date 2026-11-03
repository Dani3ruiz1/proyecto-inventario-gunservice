import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import ItemFilter from './components/inventory/ItemFilter.jsx';
import InventoryGrid from './components/inventory/InventoryGrid.jsx';
import MovimientosList from './components/inventory/MovimientosList.jsx';
import ItemFormModal from './components/forms/ItemFormModal.jsx';
import { INVENTARIO_MOCK } from './data/inventarioMock.js';
import * as api from './services/api.js';
import './styles/gun.css';

/**
 * Componente raíz y "estado global simulado": concentra los activos, los movimientos
 * (salidas/devoluciones) y los filtros, y los reparte a los submódulos por props.
 *
 * Si la API (backend-express) responde, cada operación se persiste en MySQL (modo Online);
 * si no, trabaja con datos locales iguales a los de la base (modo Offline).
 */
export default function App() {
  const [items, setItems] = useState([]);
  const [online, setOnline] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [movimientos, setMovimientos] = useState([]);
  const [vista, setVista] = useState('bodega');
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modal, setModal] = useState(false); // false = cerrado · { item: null } = nuevo · { item } = edición
  const [aviso, setAviso] = useState(null);

  // Carga inicial: API si está disponible, de lo contrario datos de respaldo.
  useEffect(() => {
    api.listar()
      .then((datos) => { setItems(datos); setOnline(true); })
      .catch(() => { setItems(INVENTARIO_MOCK); setOnline(false); })
      .finally(() => setCargando(false));
  }, []);

  /** Muestra un mensaje temporal al usuario. */
  const notificar = (texto, tipo = 'ok') => {
    setAviso({ texto, tipo });
    setTimeout(() => setAviso(null), 3500);
  };

  /** Ejecuta la operación en la API (si hay conexión); si falla, avisa y no cambia el estado. */
  const persistir = async (operacion) => {
    try {
      return { ok: true, valor: online ? await operacion() : undefined };
    } catch (e) {
      notificar(e.message, 'error');
      return { ok: false };
    }
  };

  // Filtrado derivado: se recalcula solo cuando cambian los activos o los filtros.
  const visibles = useMemo(() => {
    const t = texto.trim().toLowerCase();
    return items.filter(
      (i) => (!categoria || i.categoria === categoria) && (i.sku.toLowerCase().includes(t) || i.nombre.toLowerCase().includes(t))
    );
  }, [items, texto, categoria]);

  const guardar = async (datos) => {
    const editando = Boolean(modal.item);
    const r = await persistir(() => (editando ? api.actualizar(datos) : api.crear(datos)));
    if (!r.ok) return;
    const guardado = r.valor ?? datos;
    setItems((lista) => (editando ? lista.map((i) => (i.sku === guardado.sku ? guardado : i)) : [...lista, guardado]));
    setModal(false);
    notificar(editando ? `Activo ${guardado.sku} actualizado.` : `Activo ${guardado.sku} registrado.`);
  };

  const eliminar = async (item) => {
    if (!window.confirm(`¿Eliminar ${item.sku}?`)) return;
    const r = await persistir(() => api.eliminar(item.sku));
    if (!r.ok) return;
    setItems((lista) => lista.filter((i) => i.sku !== item.sku));
    notificar(`Activo ${item.sku} eliminado.`);
  };

  /** Despacha una unidad: baja la existencia y registra la salida. */
  const alquilar = async (item) => {
    const actualizado = { ...item, existencia: item.existencia - 1 };
    const r = await persistir(() => api.actualizar(actualizado));
    if (!r.ok) return;
    setItems((lista) => lista.map((i) => (i.sku === item.sku ? actualizado : i)));
    setMovimientos((m) => [...m, { id: m.length + 1, sku: item.sku, nombre: item.nombre, fecha: new Date().toLocaleString('es-CO'), devuelto: false }]);
    notificar(`Salida registrada: ${item.sku}.`);
  };

  /** Registra la devolución: sube la existencia y marca el movimiento. */
  const devolver = async (mov) => {
    const item = items.find((i) => i.sku === mov.sku);
    if (item) {
      const actualizado = { ...item, existencia: item.existencia + 1 };
      const r = await persistir(() => api.actualizar(actualizado));
      if (!r.ok) return;
      setItems((lista) => lista.map((i) => (i.sku === item.sku ? actualizado : i)));
    }
    setMovimientos((m) => m.map((x) => (x.id === mov.id ? { ...x, devuelto: true } : x)));
    notificar(`Devolución registrada: ${mov.sku}.`);
  };

  const pendientes = movimientos.filter((m) => !m.devuelto).length;

  return (
    <>
      <Navbar vista={vista} onVista={setVista} online={online} pendientes={pendientes} />
      <main className="gs-main">
        {aviso && <div className={`gs-aviso ${aviso.tipo}`} role="status">{aviso.texto}</div>}

        {vista === 'bodega' && (
          <>
            <div className="gs-titulo">
              <h1>Bodega · Inventario táctico</h1>
              <button className="primario" onClick={() => setModal({ item: null })}>+ Registrar activo</button>
            </div>
            <ItemFilter texto={texto} categoria={categoria} onTexto={setTexto} onCategoria={setCategoria}
                        visibles={visibles.length} total={items.length} />
            {cargando
              ? <p className="gs-vacio">Cargando inventario...</p>
              : <InventoryGrid items={visibles} onAlquilar={alquilar} onEditar={(item) => setModal({ item })} onEliminar={eliminar} />}
          </>
        )}

        {vista === 'salidas' && (
          <>
            <h1>Salidas · Historial de despachos</h1>
            <MovimientosList modo="salidas" movimientos={movimientos} />
          </>
        )}

        {vista === 'devoluciones' && (
          <>
            <h1>Devoluciones pendientes</h1>
            <MovimientosList modo="devoluciones" movimientos={movimientos} onDevolver={devolver} />
          </>
        )}
      </main>

      {modal && (
        <ItemFormModal
          key={modal.item?.sku ?? 'nuevo'}
          item={modal.item}
          skusExistentes={items.map((i) => i.sku)}
          onGuardar={guardar}
          onCerrar={() => setModal(false)}
        />
      )}
    </>
  );
}
