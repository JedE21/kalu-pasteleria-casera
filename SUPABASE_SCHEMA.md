# Kalú Pastelería Casera - Esquema Supabase

Este documento describe el contrato de datos definido en `supabase_master.sql`. El frontend debe usar exactamente estos nombres de tablas y columnas.

## Reglas generales

- Ejecuta primero `supabase_master.sql` completo en Supabase antes de conectar el frontend.
- Todas las tablas usan `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`.
- Las tablas operativas tienen `created_at` y, cuando se actualizan, `updated_at`.
- `productos.margen` es una columna generada: `precio_venta - costo_unitario`.
- Todas las tablas tienen RLS activado.
- Todas las tablas necesarias para el dashboard tienen política `SELECT` con prefijo `lectura_dashboard_`.
- No se usan tablas operativas con nombres en inglés como `sales`, `orders`, `products`, `inventory` o `customers`.

## Tablas por módulo

| Módulo dashboard | Tablas | Uso principal |
| --- | --- | --- |
| Usuarios, roles y permisos | `roles`, `permisos`, `rol_permisos`, `usuarios` | Control de perfiles, permisos por módulo y usuarios internos. |
| Empresa y sucursales | `configuracion_empresa`, `sucursales` | Datos comerciales, contacto, colores, moneda y puntos de operación. |
| Clientes y direcciones | `clientes`, `direcciones_clientes` | Registro de clientes, teléfonos, notas y direcciones de entrega. |
| Catálogo | `categorias`, `subcategorias`, `productos`, `variantes_productos`, `imagenes_productos`, `etiquetas`, `producto_etiquetas` | Catálogo público y administrativo, precios, costos, margen, imágenes y etiquetas. |
| Promociones | `promociones`, `reglas_promocion` | Cupones, descuentos, envío gratis y reglas por monto/categoría/producto. |
| Pedidos | `pedidos`, `detalle_pedidos` | Cabecera de pedido, estado, canal, totales y productos vendidos. |
| Pagos | `metodos_pago`, `pagos` | Métodos como Yape, Plin, tarjeta y estado de cobro por pedido. |
| Finanzas | `ingresos`, `gastos` | Flujo financiero diario, ventas registradas y egresos operativos. |
| Proveedores y compras | `proveedores`, `compras`, `detalle_compras` | Abastecimiento, órdenes de compra y líneas por insumo. |
| Insumos e inventario | `insumos`, `movimientos_inventario` | Stock actual, stock mínimo, costos y entradas/salidas/ajustes. |
| Producción | `producciones` | Lotes planificados, en proceso o terminados por producto y sucursal. |
| Recetas y costeo | `recetas`, `detalle_recetas` | Fórmulas por producto, rendimiento, insumos, merma y costo estimado. |
| Delivery | `repartidores`, `entregas` | Asignación de repartidores, estados de entrega, costo y distancia. |
| Alertas y notificaciones | `alertas`, `notificaciones` | Avisos de stock bajo, pedidos, pagos, producción y mensajes internos. |
| Métricas dashboard | `metricas_dashboard` | Indicadores diarios precalculados para tarjetas y gráficos. |
| Predicciones ventas | `predicciones_ventas` | Estimaciones por producto y fecha objetivo. |

## Vistas

| Vista | Uso |
| --- | --- |
| `vista_pedidos_detalle` | Lista resumida de pedidos con cliente, teléfono, sucursal e items. |
| `vista_costeo_productos` | Precios, costos, margen y margen porcentual por producto. |
| `vista_resumen_dashboard` | Totales rápidos para ventas, pedidos, clientes, gastos, alertas e insumos bajos. |

## RPC

### `get_schema_overview()`

Devuelve tablas y vistas públicas con columnas, tipos de datos, nulabilidad y valores por defecto. El frontend puede usarla para validar que el contrato existe antes de pintar módulos.

```sql
SELECT * FROM get_schema_overview();
```

## Consultas ejemplo

### Resumen del dashboard

```sql
SELECT *
FROM vista_resumen_dashboard;
```

### Productos con margen generado

```sql
SELECT nombre, precio_venta, costo_unitario, margen
FROM productos
ORDER BY margen DESC;
```

### Catálogo con imágenes principales

```sql
SELECT
  p.id,
  p.nombre,
  p.precio_venta,
  p.margen,
  c.nombre AS categoria,
  i.url AS imagen_url
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN imagenes_productos i ON i.producto_id = p.id AND i.principal = true
WHERE p.disponible = true
ORDER BY p.destacado DESC, p.nombre;
```

### Pedidos con cliente y cantidad de items

```sql
SELECT codigo, estado, canal, cliente, cliente_telefono, total, items, fecha_entrega
FROM vista_pedidos_detalle
ORDER BY created_at DESC;
```

### Insumos con stock bajo

```sql
SELECT nombre, unidad_medida, stock_actual, stock_minimo
FROM insumos
WHERE stock_actual <= stock_minimo
ORDER BY nombre;
```

### Ventas diarias para gráfico

```sql
SELECT fecha, ventas_totales, pedidos_totales, ticket_promedio
FROM metricas_dashboard
ORDER BY fecha;
```

### Entregas activas

```sql
SELECT e.estado, e.direccion_entrega, e.distrito, e.costo, r.nombres, r.telefono
FROM entregas e
LEFT JOIN repartidores r ON r.id = e.repartidor_id
WHERE e.estado IN ('pendiente', 'asignada', 'recogida')
ORDER BY e.created_at DESC;
```

### Predicciones por producto

```sql
SELECT p.nombre, pv.fecha_objetivo, pv.cantidad_estimada, pv.ingreso_estimado, pv.confianza
FROM predicciones_ventas pv
LEFT JOIN productos p ON p.id = pv.producto_id
ORDER BY pv.fecha_objetivo, p.nombre;
```
