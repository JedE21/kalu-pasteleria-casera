import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import { AppRouter } from './routes/AppRouter';
import { CartProvider } from './context/CartContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </CartProvider>
  </React.StrictMode>,
);
