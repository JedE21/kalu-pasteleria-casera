import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import { AppRouter } from './routes/AppRouter';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
    <Toaster richColors position="top-right" />
  </React.StrictMode>,
);
