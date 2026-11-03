/**
 * Cabecera táctica: logotipo y resumen del inventario en tiempo real.
 * @param {{total:number, enSet:number, enMantenimiento:number}} props
 */
export default function Navbar({ total, enSet, enMantenimiento }) {
  return (
    <header className="gs-navbar">
      <div className="gs-logo">
        <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true">
          <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 2v8M16 22v8M2 16h8M22 16h8" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
        </svg>
        <div>GUN SERVICE <small>INTERNATIONAL S.A.S. · UTILERÍA ESCÉNICA</small></div>
      </div>
      <ul className="gs-resumen" aria-label="Resumen del inventario">
        <li><b>{total}</b> en bodega</li>
        <li><b>{enSet}</b> en set</li>
        <li><b>{enMantenimiento}</b> en revisión</li>
      </ul>
    </header>
  );
}
