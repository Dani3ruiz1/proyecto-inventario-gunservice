import React from 'react';

/**
 * PUNTO 2 - Componente de clase (React.Component) con state y ciclo de vida.
 * Muestra un resumen del inventario y registra las fases del ciclo de vida en pantalla.
 */
export default class CatalogoClase extends React.Component {
  state = { eventos: [], segundos: 0 };

  registrar(texto) {
    this.setState((s) => ({ eventos: [...s.eventos, texto].slice(-5) }));
  }

  // MONTAJE: el componente ya está en el DOM -> ideal para timers o peticiones.
  componentDidMount() {
    this.registrar('componentDidMount: montado');
    this.temporizador = setInterval(() => this.setState((s) => ({ segundos: s.segundos + 1 })), 1000);
  }

  // ACTUALIZACIÓN: se llama tras cada re-render; se compara con las props anteriores.
  componentDidUpdate(prevProps) {
    if (prevProps.armas.length !== this.props.armas.length) {
      this.registrar(`componentDidUpdate: ahora hay ${this.props.armas.length} armas`);
    }
  }

  // DESMONTAJE: limpiar recursos para evitar fugas de memoria.
  componentWillUnmount() {
    clearInterval(this.temporizador);
  }

  render() {
    const total = this.props.armas.reduce((suma, a) => suma + a.stock, 0);
    return (
      <section>
        <h2>2a. Catálogo con componente de clase</h2>
        <p>
          Armas: <strong>{this.props.armas.length}</strong> · Unidades totales: <strong>{total}</strong> ·
          Tiempo montado: {this.state.segundos}s
        </p>
        <ul className="log">
          {this.state.eventos.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </section>
    );
  }
}
