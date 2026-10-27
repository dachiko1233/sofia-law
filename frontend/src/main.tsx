import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './i18n';
import './index.css';

// Always open at the top (Hero) on load/refresh. Without this the browser
// restores the previous scroll position (e.g. the Contact section) after the
// page finishes loading, overriding our scroll-to-top.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
