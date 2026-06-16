-- Kalú Pastelería Casera - Fix rápido para RLS de categorías
-- Ejecuta este archivo si el dashboard muestra:
-- categorias: new row violates row-level security policy for table "categorias"

create or replace function public.es_admin_actual()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios u
    left join public.roles r on r.id = u.rol_id
    where (u.id = auth.uid() or u.auth_user_id = auth.uid())
      and (
        u.rol = 'admin'
        or lower(coalesce(r.nombre, '')) in ('admin', 'administrador', 'administradora')
      )
      and coalesce(u.estado, 'activo') = 'activo'
      and coalesce(u.activo, true) = true
  );
$$;

alter table public.categorias enable row level security;

drop policy if exists "admins_crean_categorias" on public.categorias;
drop policy if exists "admins_actualizan_categorias" on public.categorias;
drop policy if exists "admins_eliminan_categorias" on public.categorias;

create policy "admins_crean_categorias"
on public.categorias
for insert
to authenticated
with check (public.es_admin_actual());

create policy "admins_actualizan_categorias"
on public.categorias
for update
to authenticated
using (public.es_admin_actual())
with check (public.es_admin_actual());

create policy "admins_eliminan_categorias"
on public.categorias
for delete
to authenticated
using (public.es_admin_actual());

insert into public.categorias (nombre, descripcion, icono, orden, activa)
values ('Kekes', 'Kekes caseros de pecana, plátano y sabores de temporada.', 'cake', 6, true)
on conflict (nombre) do update
set descripcion = excluded.descripcion,
    icono = excluded.icono,
    orden = excluded.orden,
    activa = true;
