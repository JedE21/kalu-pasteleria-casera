import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AlertTriangle, BarChart3, Bike, Boxes, CakeSlice, ClipboardList, HeartPulse, LayoutDashboard, LineChart, LogOut, Megaphone, Moon, Settings, Shield, Users, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Button } from '../ui/Button';
import { SearchBar } from '../ui/SearchBar';
import { supabase } from '../../lib/supabaseClient';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/productos', label: 'Productos', icon: CakeSlice },
  { to: '/admin/categorias', label: 'Categorías', icon: BarChart3 },
  { to: '/admin/promociones', label: 'Promociones', icon: Megaphone },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/delivery', label: 'Delivery', icon: Bike },
  { to: '/admin/produccion', label: 'Producción', icon: Boxes },
  { to: '/admin/inventario', label: 'Inventario', icon: Boxes },
  { to: '/admin/recetas', label: 'Recetas y Costeo', icon: LineChart },
  { to: '/admin/finanzas', label: 'Finanzas', icon: Wallet },
  { to: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
  { to: '/admin/alertas', label: 'Alertas', icon: AlertTriangle },
  { to: '/admin/administracion', label: 'Administración', icon: Shield },
  { to: '/admin/bi', label: 'Business Intelligence', icon: LineChart },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
  { to: '/admin/system-health', label: 'System Health', icon: HeartPulse },
];

export function AdminLayout() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-transparent lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-lavanda/70 bg-crema/86 p-4 backdrop-blur dark:border-white/10 dark:bg-cacao/82 lg:sticky lg:top-0 lg:h-screen lg:overflow-auto lg:border-b-0 lg:border-r">
        <div className="mb-5 flex items-center justify-between">
          <BrandLogo />
        </div>
        <nav className="grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold ${isActive ? 'bg-morado text-white' : 'text-chocolate/75 hover:bg-lavanda/45 dark:text-crema/75 dark:hover:bg-white/10'}`}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-lavanda/70 bg-crema/78 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-cacao/78">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="m-0 text-xs font-extrabold uppercase text-morado dark:text-lila">Panel administrativo</p>
              <h1 className="m-0 text-xl font-extrabold text-ciruela dark:text-crema">Kalú Pastelería Casera</h1>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0 flex-1 md:w-72 md:flex-none"><SearchBar value="" onChange={() => undefined} placeholder="Buscar en el dashboard" /></div>
              <Button variant="ghost" className="h-10 w-10 px-0" icon={<Moon className="h-4 w-4" />} onClick={() => setDark((value) => !value)} title="Cambiar modo" />
              <Button variant="ghost" className="h-10 w-10 px-0" icon={<LogOut className="h-4 w-4" />} onClick={async () => { await supabase?.auth.signOut(); navigate('/admin/login'); }} title="Cerrar sesión" />
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
