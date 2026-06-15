# Kalú Pastelería Casera

Plataforma web premium con vista pública, catálogo dinámico y dashboard administrativo conectado a Supabase.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Supabase JS
- React Router
- React Hook Form + Zod
- Recharts
- Lucide React
- Sonner

## Instalación

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

No uses `service_role` en el frontend. La app usa anon key y respeta RLS.

## Supabase

1. Ejecuta `supabase_master.sql` completo en el SQL Editor de Supabase.
2. Verifica que exista la RPC `get_schema_overview`.
3. Coloca URL y anon key en `.env`.
4. Abre `/admin/system-health` para validar tablas, vistas y columnas principales.

## Rutas públicas

- `/`
- `/productos`
- `/catalogo` (alias compatible)
- `/producto/:id`
- `/promociones`
- `/nosotros`
- `/contacto`

## Rutas admin

- `/admin`
- `/admin/login`
- `/admin/dashboard`
- `/admin/productos`
- `/admin/categorias`
- `/admin/promociones`
- `/admin/pedidos`
- `/admin/clientes`
- `/admin/delivery`
- `/admin/produccion`
- `/admin/inventario`
- `/admin/recetas`
- `/admin/finanzas`
- `/admin/reportes`
- `/admin/alertas`
- `/admin/administracion`
- `/admin/bi`
- `/admin/configuracion`
- `/admin/system-health`

## Build

```bash
npm run build
```

## Validación de nombres prohibidos

```bash
npm run lint:forbidden
```

El script revisa uso de tablas prohibidas en SQL y consultas frontend.

## Deploy Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
