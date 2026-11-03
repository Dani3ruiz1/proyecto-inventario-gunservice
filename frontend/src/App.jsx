import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import ViewSwitcher, { VISTAS } from './components/layout/ViewSwitcher.jsx';
import InventoryView from './components/inventory/InventoryView.jsx';
import DispatchView from './components/dispatch/DispatchView.jsx';
import ReturnsView from './components/dispatch/ReturnsView.jsx';
import ItemModal from './components/modal/ItemModal.jsx';
import { ACTIVOS_INICIALES } from './data/initialData.js';
import './styles/app.css';

/** Lee la vista desde el hash de la URL (#inventario, #salidas, #devoluciones). */
const vistaDesdeHash = () => {
  const id = window.location.hash.slice(1);
  return VISTAS.some((v) => v.id === id) ? id : 'inventario';
};

/**
 * Componente raíz. Todo el estado vive en memoria: activos, historial de despachos
 * y la ventana modal. Las pestañas se sincronizan con el hash de la URL.
 */
export default function App() {
  const [vista, setVista] = useState(vistaDesdeHash);
  const [activos, setActivos] = useState(ACTIVOS_INICIALES);
  const [despachos, setDespachos] = useState([]);
  const [modal, setModal] = useState(false); // false = cerrado · { activo: null } = nuevo · { activo } = edición
  const [skuDespacho, setSkuDespacho] = useState('');
  const [aviso, setAviso] = useState(null);

  // Botones atrás/adelante del navegador.
  useEffect(() => {
    const alCambiarHash = () => setVista(vistaDesdeHash());
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, []);

  const irA = (id) => { window.location.hash = id; };
  const notificar = (texto) => { setAviso(texto); setTimeout(() => setAviso(null), 3500); };

  /** Aplica un cambio a un activo por SKU. */
  const modificar = (sku, cambio) => setActivos((lista) => lista.map((a) => (a.sku === sku ? { ...a, ...cambio(a) } : a)));

  const guardarActivo = (datos) => {
    const existe = activos.some((a) => a.sku === datos.sku);
    setActivos((lista) => (existe ? lista.map((a) => (a.sku === datos.sku ? datos : a)) : [...lista, datos]));
    setModal(false);
    notificar(existe ? `Activo ${datos.sku} actualizado.` : `Activo ${datos.sku} registrado.`);
  };

  /** Salida: pasa unidades de bodega a "En Set" y deja constancia en la cadena de custodia. */
  const despachar = ({ sku, cantidad, set, responsable }) => {
    modificar(sku, (a) => ({ existencia: a.existencia - cantidad, enSet: a.enSet + cantidad }));
    setDespachos((d) => [...d, { id: d.length + 1, sku, cantidad, set, responsable, fecha: new Date().toLocaleString('es-CO'), estado: 'En Set' }]);
    setSkuDespacho('');
    notificar(`Salida registrada: ${cantidad} × ${sku} → ${set}.`);
  };

  /** Devolución: según la inspección, vuelve a bodega o pasa a revisión técnica. */
  const recibir = (id, condicion, notas) => {
    const d = despachos.find((x) => x.id === id);
    const optimo = condicion === 'Óptimo';
    modificar(d.sku, (a) => ({
      enSet: a.enSet - d.cantidad,
      ...(optimo ? { existencia: a.existencia + d.cantidad } : { enMantenimiento: a.enMantenimiento + d.cantidad }),
    }));
    setDespachos((lista) => lista.map((x) => (x.id === id ? { ...x, estado: optimo ? 'Devuelto' : 'En revisión', notas } : x)));
    notificar(optimo ? `${d.sku} devuelto a bodega.` : `${d.sku} enviado a revisión técnica.`);
  };

  const aprobarRevision = (sku) => {
    modificar(sku, (a) => ({ enMantenimiento: a.enMantenimiento - 1, existencia: a.existencia + 1 }));
    notificar(`Revisión aprobada: 1 unidad de ${sku} vuelve a bodega.`);
  };

  const total = activos.reduce((s, a) => s + a.existencia, 0);
  const enSet = activos.reduce((s, a) => s + a.enSet, 0);
  const enMantenimiento = activos.reduce((s, a) => s + a.enMantenimiento, 0);

  return (
    <>
      <Navbar total={total} enSet={enSet} enMantenimiento={enMantenimiento} />
      <ViewSwitcher vista={vista} onCambiar={irA} pendientes={enSet + enMantenimiento} />
      <main className="gs-main">
        {aviso && <div className="gs-aviso" role="status">{aviso}</div>}

        {vista === 'inventario' && (
          <InventoryView activos={activos} onNuevo={() => setModal({ activo: null })} onEditar={(activo) => setModal({ activo })}
                         onDespachar={(sku) => { setSkuDespacho(sku); irA('salidas'); }} />
        )}
        {vista === 'salidas' && <DispatchView activos={activos} despachos={despachos} skuInicial={skuDespacho} onDespachar={despachar} />}
        {vista === 'devoluciones' && <ReturnsView despachos={despachos} activos={activos} onRecibir={recibir} onAprobar={aprobarRevision} />}
      </main>

      {modal && (
        <ItemModal key={modal.activo?.sku ?? 'nuevo'} activo={modal.activo} skusExistentes={activos.map((a) => a.sku)}
                   onGuardar={guardarActivo} onCerrar={() => setModal(false)} />
      )}
    </>
  );
}
