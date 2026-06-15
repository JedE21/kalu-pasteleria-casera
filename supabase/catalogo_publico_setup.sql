-- Kalú Pastelería Casera - Catálogo público administrable
-- Ejecutar después de supabase_master.sql y supabase/admin_auth_setup.sql.

alter table public.productos drop constraint if exists productos_nombre_key;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'productos',
  'productos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "imagenes_productos_publicas" on storage.objects;
drop policy if exists "admins_suben_imagenes_productos" on storage.objects;
drop policy if exists "admins_actualizan_imagenes_productos" on storage.objects;
drop policy if exists "admins_eliminan_imagenes_productos" on storage.objects;

create policy "imagenes_productos_publicas"
on storage.objects
for select
using (bucket_id = 'productos');

create policy "admins_suben_imagenes_productos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'productos' and public.es_admin_actual());

create policy "admins_actualizan_imagenes_productos"
on storage.objects
for update
to authenticated
using (bucket_id = 'productos' and public.es_admin_actual())
with check (bucket_id = 'productos' and public.es_admin_actual());

create policy "admins_eliminan_imagenes_productos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'productos' and public.es_admin_actual());

drop policy if exists "admins_crean_productos" on public.productos;
drop policy if exists "admins_actualizan_productos" on public.productos;
drop policy if exists "admins_eliminan_productos" on public.productos;
drop policy if exists "admins_crean_imagenes_productos" on public.imagenes_productos;
drop policy if exists "admins_actualizan_imagenes_productos" on public.imagenes_productos;
drop policy if exists "admins_eliminan_imagenes_productos" on public.imagenes_productos;

create policy "admins_crean_productos"
on public.productos
for insert
to authenticated
with check (public.es_admin_actual());

create policy "admins_actualizan_productos"
on public.productos
for update
to authenticated
using (public.es_admin_actual())
with check (public.es_admin_actual());

create policy "admins_eliminan_productos"
on public.productos
for delete
to authenticated
using (public.es_admin_actual());

create policy "admins_crean_imagenes_productos"
on public.imagenes_productos
for insert
to authenticated
with check (public.es_admin_actual());

create policy "admins_actualizan_imagenes_productos"
on public.imagenes_productos
for update
to authenticated
using (public.es_admin_actual())
with check (public.es_admin_actual());

create policy "admins_eliminan_imagenes_productos"
on public.imagenes_productos
for delete
to authenticated
using (public.es_admin_actual());

insert into public.categorias (nombre, descripcion, icono, orden, activa)
values
('Cuchareables', 'Postres personales listos para disfrutar en Ica.', 'cup-soda', 1, true),
('Tortas 1/4 kg', 'Porciones generosas y combinaciones dúo.', 'cake-slice', 2, true),
('Tortas 1 kg', 'Tortas enteras y combinadas para compartir.', 'cake-slice', 3, true),
('Tortas personalizadas', 'Diseños para eventos, cumpleaños y celebraciones.', 'sparkles', 4, true),
('Bocaditos', 'Dulces pequeños para acompañar cualquier momento.', 'cookie', 5, true)
on conflict (nombre) do update
set descripcion = excluded.descripcion,
    icono = excluded.icono,
    orden = excluded.orden,
    activa = true;

with catalogo(categoria_nombre, nombre, slug, descripcion, precio_venta, costo_unitario, destacado, tiempo_preparacion_min) as (
  values
  ('Cuchareables', 'Torta de Chocolate con Fudge Casero', 'cuch-chocolate-fudge', 'Cuchareable de chocolate intenso con fudge casero.', 7.00, 3.20, true, 45),
  ('Cuchareables', 'Torta Sublime con Maní', 'cuch-sublime-mani', 'Cuchareable inspirado en Sublime, con maní y crema suave.', 7.00, 3.10, false, 45),
  ('Cuchareables', 'Cheesecake de Maracuyá', 'cuch-cheesecake-maracuya', 'Cheesecake cremoso con maracuyá fresco.', 7.00, 3.25, true, 45),
  ('Cuchareables', 'Carrot Cake', 'cuch-carrot-cake', 'Bizcocho especiado de zanahoria con cobertura cremosa.', 7.00, 3.00, false, 45),
  ('Cuchareables', 'Tres Leches', 'cuch-tres-leches', 'Clásico tres leches húmedo y delicado.', 7.00, 2.90, false, 45),
  ('Cuchareables', 'Torta de Chocoteja con Pecanas', 'cuch-chocoteja-pecanas', 'Chocolate, manjar y pecanas en formato cuchareable.', 7.00, 3.30, false, 45),
  ('Cuchareables', 'Torta de Pistacho', 'cuch-pistacho', 'Cuchareable premium de pistacho. No aplica a la promo.', 8.00, 4.10, false, 45),
  ('Tortas 1/4 kg', 'Torta de Chocolate con Fudge Casero', 'cuarto-chocolate-fudge', 'Torta 1/4 kg de chocolate con fudge casero.', 12.00, 5.20, false, 60),
  ('Tortas 1/4 kg', 'Torta Sublime con Maní', 'cuarto-sublime-mani', 'Torta 1/4 kg con chocolate y maní.', 12.00, 5.30, false, 60),
  ('Tortas 1/4 kg', 'Cheesecake de Maracuyá', 'cuarto-cheesecake-maracuya', 'Torta 1/4 kg con maracuyá natural.', 12.00, 5.40, false, 60),
  ('Tortas 1/4 kg', 'Carrot Cake', 'cuarto-carrot-cake', 'Torta 1/4 kg de carrot cake.', 12.00, 5.10, false, 60),
  ('Tortas 1/4 kg', 'Tres Leches', 'cuarto-tres-leches', 'Torta 1/4 kg tres leches.', 12.00, 5.00, false, 60),
  ('Tortas 1/4 kg', 'Torta de Pistacho', 'cuarto-pistacho', 'Torta 1/4 kg sabor pistacho.', 12.00, 6.10, false, 60),
  ('Tortas 1/4 kg', 'Torta de Chocoteja con Pecanas', 'cuarto-chocoteja-pecanas', 'Torta 1/4 kg con pecanas.', 12.00, 5.60, false, 60),
  ('Tortas 1/4 kg', 'Torta de Chocolate con Fudge Casero + Torta Sublime con Maní', 'cuarto-duo-chocolate-sublime', 'Combinación dúo en 1/4 kg.', 12.00, 5.40, false, 60),
  ('Tortas 1/4 kg', 'Torta de Chocolate con Fudge Casero + Torta de Chocoteja con Pecanas', 'cuarto-duo-chocolate-chocoteja', 'Combinación dúo en 1/4 kg.', 12.00, 5.60, false, 60),
  ('Tortas 1/4 kg', 'Torta de Chocolate con Fudge Casero + Cheesecake de Maracuyá', 'cuarto-duo-chocolate-cheesecake', 'Combinación dúo en 1/4 kg.', 12.00, 5.60, false, 60),
  ('Tortas 1/4 kg', 'Torta de Chocolate con Fudge Casero + Tres Leches', 'cuarto-duo-chocolate-tres-leches', 'Combinación dúo en 1/4 kg.', 12.00, 5.30, false, 60),
  ('Tortas 1 kg', 'Torta de Chocolate con Fudge Casero', 'kilo-chocolate-fudge', 'Torta 1 kg de chocolate con fudge casero.', 28.00, 12.80, false, 120),
  ('Tortas 1 kg', 'Tres Leches', 'kilo-tres-leches', 'Torta 1 kg tres leches.', 28.00, 12.40, false, 120),
  ('Tortas 1 kg', 'Torta de Chocoteja con Pecanas', 'kilo-chocoteja-pecanas', 'Torta 1 kg con pecanas.', 28.00, 13.40, false, 120),
  ('Tortas 1 kg', 'Torta de Chocolate con Fudge Casero + Tres Leches', 'kilo-combo-chocolate-tres-leches', 'Torta 1 kg combinada.', 30.00, 13.80, false, 120),
  ('Tortas 1 kg', 'Torta de Chocolate con Fudge Casero + Cheesecake de Maracuyá', 'kilo-combo-chocolate-cheesecake', 'Torta 1 kg combinada.', 30.00, 14.00, false, 120),
  ('Tortas 1 kg', 'Torta de Chocolate con Fudge Casero + Torta de Chocoteja con Pecanas', 'kilo-combo-chocolate-chocoteja', 'Torta 1 kg combinada.', 30.00, 14.20, false, 120),
  ('Tortas 1 kg', 'Torta de Chocolate con Fudge Casero + Tres Leches + Cheesecake de Maracuyá', 'kilo-combo-triple', 'Torta 1 kg combinada de tres sabores.', 30.00, 14.30, true, 120),
  ('Tortas 1 kg', 'Torta de Chocolate con Fudge Casero + Tres Leches + Cheesecake de Maracuyá + Torta de Chocoteja con Pecanas', 'kilo-combo-cuatro', 'Torta 1 kg combinada de cuatro sabores.', 30.00, 14.60, false, 120),
  ('Tortas personalizadas', 'Tortas Personalizadas para Eventos', 'personalizadas-eventos', 'Diseños especiales para cumpleaños, bautizos, baby shower, aniversarios, graduaciones, temáticas infantiles, eventos corporativos y diseños personalizados. Precio según diseño, tamaño y decoración.', 0.00, 0.00, false, 180),
  ('Bocaditos', 'Alfajores de Maicena', 'boc-alfajores-maicena', 'Alfajor suave de maicena con relleno dulce.', 2.50, 1.00, true, 45),
  ('Bocaditos', 'Pye de Manzana', 'boc-pye-manzana', 'Pye casero con manzana especiada.', 4.50, 1.90, false, 60),
  ('Bocaditos', 'Keke de Pecana', 'boc-keke-pecana', 'Keke individual con pecanas.', 3.00, 1.20, false, 45),
  ('Bocaditos', 'Keke de Plátano', 'boc-keke-platano', 'Keke casero de plátano.', 3.00, 1.10, false, 45)
)
insert into public.productos (categoria_id, nombre, slug, descripcion, precio_venta, costo_unitario, stock_minimo, disponible, destacado, tiempo_preparacion_min)
select c.id, catalogo.nombre, catalogo.slug, catalogo.descripcion, catalogo.precio_venta, catalogo.costo_unitario, 0, true, catalogo.destacado, catalogo.tiempo_preparacion_min
from catalogo
join public.categorias c on c.nombre = catalogo.categoria_nombre
on conflict (slug) do update
set categoria_id = excluded.categoria_id,
    nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    precio_venta = excluded.precio_venta,
    costo_unitario = excluded.costo_unitario,
    disponible = true,
    destacado = excluded.destacado,
    tiempo_preparacion_min = excluded.tiempo_preparacion_min;

with imagenes(slug, url, alt_text) as (
  values
  ('cuch-chocolate-fudge', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80', 'Torta de chocolate con fudge Kalú'),
  ('cuch-cheesecake-maracuya', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80', 'Cheesecake de maracuyá Kalú'),
  ('kilo-combo-triple', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80', 'Torta combinada Kalú'),
  ('boc-alfajores-maicena', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80', 'Alfajores de maicena Kalú')
)
insert into public.imagenes_productos (producto_id, url, alt_text, orden, principal)
select p.id, imagenes.url, imagenes.alt_text, 1, true
from imagenes
join public.productos p on p.slug = imagenes.slug
where not exists (
  select 1
  from public.imagenes_productos ip
  where ip.producto_id = p.id and ip.principal = true
);

do $$
begin
  begin
    alter publication supabase_realtime add table public.productos;
  exception
    when duplicate_object then null;
    when undefined_object then null;
  end;

  begin
    alter publication supabase_realtime add table public.imagenes_productos;
  exception
    when duplicate_object then null;
    when undefined_object then null;
  end;

  begin
    alter publication supabase_realtime add table public.categorias;
  exception
    when duplicate_object then null;
    when undefined_object then null;
  end;
end $$;
