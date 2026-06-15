# Configurar Google Auth en Supabase para Kalú

Esta guía prepara el botón "Continuar con Google" del login admin.

## 1. Google Cloud Console

1. Entra a Google Cloud Console.
2. Crea o selecciona un proyecto.
3. Configura OAuth Consent Screen.
4. Crea credenciales OAuth Client ID.
5. En tipo de aplicación elige Web application.
6. Agrega Authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://kalushop.netlify.app`
7. Agrega Authorized redirect URIs usando el valor que Supabase muestra en Authentication > Providers > Google.

## 2. Supabase

1. Entra a Supabase Dashboard.
2. Ve a Authentication > Providers > Google.
3. Pega Client ID y Client Secret.
4. Activa el proveedor Google.
5. Revisa Site URL y Redirect URLs:
   - `http://localhost:5173`
   - `https://kalushop.netlify.app`
   - `https://kalushop.netlify.app/admin/dashboard`

## 3. Crear usuario admin

1. Crea el usuario desde Supabase Authentication.
2. Copia el `id` del usuario en `auth.users`.
3. Ejecuta `supabase/admin_auth_setup.sql`.
4. Inserta el registro admin:

```sql
insert into public.usuarios (id, auth_user_id, correo, email, nombres, rol, estado, activo)
values (
  'AUTH_USER_ID',
  'AUTH_USER_ID',
  'admin@kalu.pe',
  'admin@kalu.pe',
  'Admin Kalú',
  'admin',
  'activo',
  true
)
on conflict (id)
do update set rol = 'admin', estado = 'activo', activo = true;
```

Después del OAuth, `ProtectedAdminRoute` valida que el usuario autenticado tenga `rol = 'admin'` y `estado = 'activo'`.
