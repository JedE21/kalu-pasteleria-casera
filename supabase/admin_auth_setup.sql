-- Kalú Pastelería Casera - Setup de Supabase Auth para administradores
-- Ejecutar después de supabase_master.sql.

create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  correo text,
  nombres text,
  rol text default 'cliente',
  estado text default 'activo',
  created_at timestamp with time zone default now()
);

-- Compatibilidad con el esquema maestro previo de Kalú.
alter table public.usuarios add column if not exists correo text;
alter table public.usuarios add column if not exists rol text default 'cliente';
alter table public.usuarios add column if not exists estado text default 'activo';
alter table public.usuarios add column if not exists auth_user_id uuid;
alter table public.usuarios add column if not exists email text;
alter table public.usuarios add column if not exists activo boolean default true;

update public.usuarios
set correo = coalesce(correo, email),
    estado = coalesce(estado, case when activo then 'activo' else 'inactivo' end)
where correo is null or estado is null;

alter table public.usuarios enable row level security;

drop policy if exists "usuarios_leen_su_registro" on public.usuarios;
drop policy if exists "admins_leen_usuarios" on public.usuarios;
drop policy if exists "admins_crean_usuarios" on public.usuarios;
drop policy if exists "admins_actualizan_usuarios" on public.usuarios;

create or replace function public.es_admin_actual()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios u
    where (u.id = auth.uid() or u.auth_user_id = auth.uid())
      and u.rol = 'admin'
      and coalesce(u.estado, 'activo') = 'activo'
      and coalesce(u.activo, true) = true
  );
$$;

create policy "usuarios_leen_su_registro"
on public.usuarios
for select
to authenticated
using (
  id = auth.uid()
  or auth_user_id = auth.uid()
);

create policy "admins_leen_usuarios"
on public.usuarios
for select
to authenticated
using (public.es_admin_actual());

create policy "admins_crean_usuarios"
on public.usuarios
for insert
to authenticated
with check (public.es_admin_actual());

create policy "admins_actualizan_usuarios"
on public.usuarios
for update
to authenticated
using (public.es_admin_actual())
with check (public.es_admin_actual());

-- Para crear el primer admin:
-- 1. Crea el usuario en Supabase Authentication.
-- 2. Copia su auth.users.id.
-- 3. Ejecuta:
-- insert into public.usuarios (id, auth_user_id, correo, email, nombres, rol, estado, activo)
-- values ('AUTH_USER_ID', 'AUTH_USER_ID', 'admin@kalu.pe', 'admin@kalu.pe', 'Admin Kalú', 'admin', 'activo', true)
-- on conflict (id) do update set rol = 'admin', estado = 'activo', activo = true;
