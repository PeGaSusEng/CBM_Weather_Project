import React from "react";
import  ReactDOM  from "react-dom/client";
import App from './pages/App';
import './pages/index';

const container = document.getElementById('root')!;
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
