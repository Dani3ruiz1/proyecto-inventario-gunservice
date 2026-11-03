import { useState } from 'react';
import ReactVsJsx from './components/ReactVsJsx.jsx';
import CatalogoClase from './components/CatalogoClase.jsx';
import CatalogoFuncional from './components/CatalogoFuncional.jsx';
import FormularioActivo from './components/FormularioActivo.jsx';
import { ARMAS_INICIALES } from './data/armas.js';
import './styles.css'; // estilos propios del taller EV01

// Componente raíz: concentra el estado compartido (lista de armas) y lo reparte por props.
export default function TallerEV01() {
  const [armas, setArmas] = useState(ARMAS_INICIALES);
  const [verClase, setVerClase] = useState(true);

  return (
    <main>
      <h1>GUN SERVICE INTERNATIONAL S.A.S. · Taller de componentes React</h1>
      <ReactVsJsx />

      {/* onClick monta/desmonta el componente de clase para observar su ciclo de vida. */}
      <button onClick={() => setVerClase(!verClase)}>
        {verClase ? 'Desmontar' : 'Montar'} componente de clase
      </button>
      {verClase && <CatalogoClase armas={armas} />}

      <CatalogoFuncional armas={armas} />
      <FormularioActivo skusExistentes={armas.map((a) => a.sku)} onAgregar={(a) => setArmas([...armas, a])} />
    </main>
  );
}
