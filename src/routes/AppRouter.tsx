import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { HomePage } from '../pages/public/HomePage';
import { CatalogPage } from '../pages/public/CatalogPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { PromotionsPage } from '../pages/public/PromotionsPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import {
  AdministracionAdminPage,
  AlertasAdminPage,
  BIAdminPage,
  CategoriasAdminPage,
  ClientesAdminPage,
  ConfiguracionAdminPage,
  DeliveryAdminPage,
  FinanzasAdminPage,
  InventarioAdminPage,
  PedidosAdminPage,
  ProduccionAdminPage,
  ProductosAdminPage,
  PromocionesAdminPage,
  RecetasAdminPage,
  ReportesAdminPage,
} from '../pages/admin/modules';
import { SystemHealthPage } from '../pages/admin/SystemHealthPage';
import { AdminLogin } from '../pages/admin/AdminLogin';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="productos" element={<CatalogPage />} />
          <Route path="producto/:id" element={<ProductDetailPage />} />
          <Route path="promociones" element={<PromotionsPage />} />
          <Route path="nosotros" element={<AboutPage />} />
          <Route path="contacto" element={<ContactPage />} />
        </Route>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="productos" element={<ProductosAdminPage />} />
            <Route path="categorias" element={<CategoriasAdminPage />} />
            <Route path="promociones" element={<PromocionesAdminPage />} />
            <Route path="pedidos" element={<PedidosAdminPage />} />
            <Route path="clientes" element={<ClientesAdminPage />} />
            <Route path="delivery" element={<DeliveryAdminPage />} />
            <Route path="produccion" element={<ProduccionAdminPage />} />
            <Route path="inventario" element={<InventarioAdminPage />} />
            <Route path="recetas" element={<RecetasAdminPage />} />
            <Route path="finanzas" element={<FinanzasAdminPage />} />
            <Route path="reportes" element={<ReportesAdminPage />} />
            <Route path="alertas" element={<AlertasAdminPage />} />
            <Route path="administracion" element={<AdministracionAdminPage />} />
            <Route path="bi" element={<BIAdminPage />} />
            <Route path="configuracion" element={<ConfiguracionAdminPage />} />
            <Route path="system-health" element={<SystemHealthPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
