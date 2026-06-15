import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoadingState } from '../components/ui/States';
import { supabase, supabaseConfig } from '../lib/supabaseClient';

interface AdminCheck {
  allowed: boolean;
  loading: boolean;
}

export function ProtectedAdminRoute() {
  const location = useLocation();
  const [state, setState] = useState<AdminCheck>({ allowed: false, loading: true });

  useEffect(() => {
    let mounted = true;

    async function verify() {
      if (!supabaseConfig.isConfigured || !supabase) {
        if (mounted) setState({ allowed: false, loading: false });
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        if (mounted) setState({ allowed: false, loading: false });
        return;
      }

      const { data, error } = await (supabase as any)
        .from('usuarios')
        .select('id, auth_user_id, email, correo, rol, estado, activo')
        .or(`id.eq.${user.id},auth_user_id.eq.${user.id}`)
        .maybeSingle();

      if (error || !data) {
        await supabase.auth.signOut();
        toast.error('Acceso denegado. Esta cuenta no tiene permisos de administrador.');
        if (mounted) setState({ allowed: false, loading: false });
        return;
      }

      const isAdmin = data.rol === 'admin';
      const isActive = data.estado === 'activo' || data.activo === true;
      if (!isAdmin || !isActive) {
        await supabase.auth.signOut();
        toast.error('Acceso denegado. Esta cuenta no tiene permisos de administrador.');
        if (mounted) setState({ allowed: false, loading: false });
        return;
      }

      if (mounted) setState({ allowed: true, loading: false });
    }

    void verify();
    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) return <main className="mx-auto max-w-3xl px-4 py-10"><LoadingState label="Validando sesión de administrador..." /></main>;
  if (!state.allowed) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
