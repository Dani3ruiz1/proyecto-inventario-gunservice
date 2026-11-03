import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Punto de entrada: React toma el <div id="root"> y renderiza el árbol de componentes.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
