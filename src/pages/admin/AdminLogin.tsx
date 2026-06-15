import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BrandLogo } from '../../components/layout/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Field, Input } from '../../components/ui/Input';
import { supabase, supabaseConfig } from '../../lib/supabaseClient';

function friendlySupabaseError(message: string | undefined) {
  if (message?.toLowerCase().includes('invalid path specified')) {
    return 'La URL de Supabase está mal configurada. En Netlify, VITE_SUPABASE_URL debe ser solo algo como https://xxxx.supabase.co, sin /rest/v1 ni /auth/v1.';
  }
  return message ?? 'No se pudo iniciar sesión.';
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function verifyAdmin(userId: string) {
    if (!supabase) return false;
    const { data, error } = await (supabase as any)
      .from('usuarios')
      .select('id, auth_user_id, email, correo, rol, estado, activo')
      .or(`id.eq.${userId},auth_user_id.eq.${userId}`)
      .maybeSingle();
    if (error || !data) return false;
    return data.rol === 'admin' && (data.estado === 'activo' || data.activo === true);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabaseConfig.isConfigured || !supabase) {
      toast.error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para iniciar sesión.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: correo, password });
    if (error || !data.user) {
      toast.error(friendlySupabaseError(error?.message));
      setLoading(false);
      return;
    }
    const allowed = await verifyAdmin(data.user.id);
    if (!allowed) {
      await supabase.auth.signOut();
      toast.error('Acceso denegado. Esta cuenta no tiene permisos de administrador.');
      setLoading(false);
      return;
    }
    toast.success('Bienvenida/o al panel de Kalú.');
    navigate('/admin/dashboard', { replace: true });
  }

  async function handleGoogle() {
    if (!supabaseConfig.isConfigured || !supabase) {
      toast.error('Configura Supabase Auth antes de usar Google.');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin/dashboard`,
      },
    });
    if (error) toast.error('Google Auth aún no está configurado correctamente en Supabase.');
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="grid gap-6 p-6">
          <BrandLogo />
          <div>
            <p className="m-0 text-xs font-extrabold uppercase text-morado dark:text-lila">Acceso administrador</p>
            <h1 className="m-0 mt-1 text-2xl font-extrabold text-ciruela dark:text-crema">Panel Kalú</h1>
            <p className="m-0 mt-2 text-sm text-chocolate/70 dark:text-crema/70">Ingresa con correo y contraseña de Supabase Auth.</p>
          </div>
          <form className="grid gap-4" onSubmit={handleLogin}>
            <Field label="Correo">
              <Input type="email" value={correo} onChange={(event) => setCorreo(event.target.value)} required placeholder="admin@kalu.pe" />
            </Field>
            <Field label="Contraseña">
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="••••••••" />
            </Field>
            <Button disabled={loading} icon={<Lock className="h-4 w-4" />}>{loading ? 'Validando...' : 'Iniciar sesión'}</Button>
          </form>
          <Button variant="ghost" icon={<Mail className="h-4 w-4" />} onClick={() => void handleGoogle()}>Continuar con Google</Button>
          <div className="flex items-start gap-2 rounded-md bg-dorado/10 p-3 text-xs text-chocolate/75 dark:text-crema/75">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-morado" />
            Google queda preparado, pero Supabase debe tener el proveedor activo y el usuario debe existir como admin en `public.usuarios`.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
