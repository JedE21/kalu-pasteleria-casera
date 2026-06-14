import { Link, NavLink, Outlet } from 'react-router-dom';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Button } from '../ui/Button';
import { whatsappLink } from '../../lib/utils';

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/promociones', label: 'Promociones' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export function PublicLayout() {
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
            <Button variant="ghost" className="hidden sm:inline-flex" icon={<ShoppingBag className="h-4 w-4" />}>Pedido rápido</Button>
            <a href={whatsappLink('51999555121', 'Hola Kalú, quiero hacer un pedido')} target="_blank" rel="noreferrer">
              <Button variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>WhatsApp</Button>
            </a>
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="border-t border-lavanda/70 bg-ciruela text-crema dark:border-white/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1fr_auto]">
          <BrandLogo />
          <div className="text-sm text-crema/75">Postres artesanales con sabor premium · Lima, Perú</div>
        </div>
      </footer>
    </div>
  );
}
