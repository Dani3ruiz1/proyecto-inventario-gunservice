const VISTAS = [
  { id: 'bodega', texto: 'Bodega' },
  { id: 'salidas', texto: 'Salidas' },
  { id: 'devoluciones', texto: 'Devoluciones' },
];

/**
 * Cabecera táctica: logotipo, estado de conexión con la API y navegación entre vistas.
 * @param {{vista:string, onVista:(id:string)=>void, online:boolean, pendientes:number}} props
 */
export default function Navbar({ vista, onVista, online, pendientes }) {
  return (
    <header className="gs-navbar">
      <div className="gs-logo">
        <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
          <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 2v8M16 22v8M2 16h8M22 16h8" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
        </svg>
        <span>GUN SERVICE <small>INTERNATIONAL S.A.S.</small></span>
      </div>

      <nav aria-label="Principal">
        {VISTAS.map((v) => (
          <button key={v.id} className={v.id === vista ? 'activo' : ''} onClick={() => onVista(v.id)}>
            {v.texto}
            {v.id === 'devoluciones' && pendientes > 0 && <span className="gs-contador">{pendientes}</span>}
          </button>
        ))}
      </nav>

      <span className={`gs-estado ${online ? 'online' : 'offline'}`} title={online ? 'Conectado a la API' : 'Sin API: datos locales'}>
        <i /> {online ? 'Online' : 'Offline'}
      </span>
    </header>
  );
}
