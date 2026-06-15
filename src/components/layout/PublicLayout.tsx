import { Link, NavLink, Outlet } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Music2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Button } from '../ui/Button';
import { whatsappLink } from '../../lib/utils';
import { officialWhatsapp, pickupPoints } from '../../config/kaluCatalog';
import { useCart } from '../../context/CartContext';
import { CartDrawer } from '../public/CartDrawer';

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/promociones', label: 'Promociones' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export function PublicLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-lavanda/70 bg-crema/88 backdrop-blur dark:border-white/10 dark:bg-cacao/88">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" aria-label="Kalú Pastelería Casera"><BrandLogo /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-md px-3 py-2 text-sm font-bold ${isActive ? 'bg-lavanda/70 text-morado dark:bg-white/10 dark:text-lila' : 'text-chocolate/75 hover:bg-lavanda/40 dark:text-crema/75 dark:hover:bg-white/10'}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="relative hidden sm:inline-flex" icon={<ShoppingBag className="h-4 w-4" />} onClick={() => setCartOpen(true)}>
              Carrito {count ? `(${count})` : ''}
            </Button>
            <a href={whatsappLink(officialWhatsapp, 'Hola Kalú, quiero hacer un pedido en Ica')} target="_blank" rel="noreferrer">
              <Button variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>WhatsApp</Button>
            </a>
          </div>
        </div>
      </header>
      <Outlet />
      <button className="fixed bottom-4 right-4 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-morado px-5 text-sm font-extrabold text-white shadow-glow md:hidden" onClick={() => setCartOpen(true)}>
        <ShoppingBag className="h-5 w-5" /> {count}
      </button>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <footer className="border-t border-lavanda/70 bg-ciruela text-crema dark:border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-crema/75">Postres, tortas y bocaditos en Ica. Pastelería casera premium con pedidos programados, recojo en puntos de venta y delivery.</p>
            <p className="text-sm font-bold text-crema">Atención según disponibilidad y pedidos programados.</p>
          </div>
          <div>
            <h3 className="m-0 mb-3 text-sm font-extrabold uppercase text-lila">Puntos de venta</h3>
            <div className="grid gap-3 text-sm text-crema/75">
              {pickupPoints.map((point) => (
                <a key={point.id} className="hover:text-white" href={point.mapa} target="_blank" rel="noreferrer">
                  <strong className="block text-crema">{point.nombre}</strong>
                  {point.direccion}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="m-0 mb-3 text-sm font-extrabold uppercase text-lila">Redes y contacto</h3>
            <div className="grid gap-2 text-sm">
              <a className="inline-flex items-center gap-2 text-crema/80 hover:text-white" href="https://wa.me/51912888898" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> +51 912 888 898</a>
              <a className="inline-flex items-center gap-2 text-crema/80 hover:text-white" href="#" aria-label="Facebook"><Facebook className="h-4 w-4" /> Facebook</a>
              <a className="inline-flex items-center gap-2 text-crema/80 hover:text-white" href="#" aria-label="TikTok"><Music2 className="h-4 w-4" /> TikTok</a>
              <a className="inline-flex items-center gap-2 text-crema/80 hover:text-white" href="#" aria-label="Instagram"><Instagram className="h-4 w-4" /> Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
