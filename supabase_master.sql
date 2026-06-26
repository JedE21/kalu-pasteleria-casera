-- Kalú Pastelería Casera - Script SQL maestro para Supabase
-- Ejecutar completo en el SQL Editor de Supabase.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP VIEW IF EXISTS vista_resumen_dashboard;
DROP VIEW IF EXISTS vista_costeo_productos;
DROP VIEW IF EXISTS vista_pedidos_detalle;

DROP TABLE IF EXISTS notificaciones;
DROP TABLE IF EXISTS alertas;
DROP TABLE IF EXISTS predicciones_ventas;
DROP TABLE IF EXISTS metricas_dashboard;
DROP TABLE IF EXISTS entregas;
DROP TABLE IF EXISTS repartidores;
DROP TABLE IF EXISTS detalle_recetas;
DROP TABLE IF EXISTS recetas;
DROP TABLE IF EXISTS producciones;
DROP TABLE IF EXISTS detalle_compras;
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS movimientos_inventario;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS gastos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS ingresos;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS metodos_pago;
DROP TABLE IF EXISTS detalle_pedidos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS reglas_promocion;
DROP TABLE IF EXISTS promociones;
DROP TABLE IF EXISTS producto_etiquetas;
DROP TABLE IF EXISTS etiquetas;
DROP TABLE IF EXISTS imagenes_productos;
DROP TABLE IF EXISTS variantes_productos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS subcategorias;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS direcciones_clientes;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS configuracion_empresa;
DROP TABLE IF EXISTS sucursales;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS rol_permisos;
DROP TABLE IF EXISTS permisos;
DROP TABLE IF EXISTS roles;

DROP FUNCTION IF EXISTS get_schema_overview();
DROP FUNCTION IF EXISTS actualizar_updated_at();

CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE permisos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  nombre text NOT NULL,
  modulo text NOT NULL,
  descripcion text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rol_permisos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rol_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permiso_id uuid NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rol_id, permiso_id)
);

CREATE TABLE usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE,
  rol_id uuid REFERENCES roles(id) ON DELETE SET NULL,
  nombres text NOT NULL,
  apellidos text,
  email text NOT NULL UNIQUE,
  telefono text,
  avatar_url text,
  activo boolean NOT NULL DEFAULT true,
  ultimo_acceso timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sucursales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  direccion text NOT NULL,
  distrito text NOT NULL,
  ciudad text NOT NULL DEFAULT 'Lima',
  telefono text,
  horario_atencion text,
  latitud numeric(10, 7),
  longitud numeric(10, 7),
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE configuracion_empresa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sucursal_id uuid REFERENCES sucursales(id) ON DELETE SET NULL,
  nombre_comercial text NOT NULL,
  razon_social text,
  ruc text,
  email_contacto text,
  telefono_contacto text,
  whatsapp text,
  moneda text NOT NULL DEFAULT 'PEN',
  igv_porcentaje numeric(5, 2) NOT NULL DEFAULT 18.00,
  direccion_principal text,
  logo_url text,
  color_primario text NOT NULL DEFAULT '#d96f8a',
  color_secundario text NOT NULL DEFAULT '#6b3f2a',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombres text NOT NULL,
  apellidos text,
  documento_tipo text,
  documento_numero text,
  email text,
  telefono text,
  fecha_nacimiento date,
  notas text,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE direcciones_clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  etiqueta text NOT NULL DEFAULT 'Principal',
  direccion text NOT NULL,
  referencia text,
  distrito text NOT NULL,
  ciudad text NOT NULL DEFAULT 'Lima',
  latitud numeric(10, 7),
  longitud numeric(10, 7),
  principal boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  descripcion text,
  icono text,
  orden integer NOT NULL DEFAULT 0,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subcategorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text,
  orden integer NOT NULL DEFAULT 0,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (categoria_id, nombre)
);

CREATE TABLE productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  subcategoria_id uuid REFERENCES subcategorias(id) ON DELETE SET NULL,
  nombre text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  descripcion text,
  precio_venta numeric(10, 2) NOT NULL CHECK (precio_venta >= 0),
  costo_unitario numeric(10, 2) NOT NULL DEFAULT 0 CHECK (costo_unitario >= 0),
  margen numeric(10, 2) GENERATED ALWAYS AS (precio_venta - costo_unitario) STORED,
  stock_actual integer NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo integer NOT NULL DEFAULT 0,
  oferta_activa boolean NOT NULL DEFAULT false,
  oferta_precio numeric(10, 2) CHECK (oferta_precio IS NULL OR oferta_precio >= 0),
  oferta_fecha_fin timestamptz,
  disponible boolean NOT NULL DEFAULT true,
  destacado boolean NOT NULL DEFAULT false,
  tiempo_preparacion_min integer NOT NULL DEFAULT 60,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE variantes_productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  sku text UNIQUE,
  precio_adicional numeric(10, 2) NOT NULL DEFAULT 0,
  costo_adicional numeric(10, 2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (producto_id, nombre)
);

CREATE TABLE imagenes_productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  orden integer NOT NULL DEFAULT 0,
  principal boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE etiquetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  color text NOT NULL DEFAULT '#d96f8a',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE producto_etiquetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  etiqueta_id uuid NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (producto_id, etiqueta_id)
);

CREATE TABLE promociones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  codigo text UNIQUE,
  tipo text NOT NULL DEFAULT 'promocion' CHECK (tipo IN ('promocion', 'oferta')),
  tipo_descuento text NOT NULL CHECK (tipo_descuento IN ('porcentaje', 'monto_fijo', 'envio_gratis')),
  valor numeric(10, 2) NOT NULL DEFAULT 0,
  fecha_inicio timestamptz NOT NULL,
  fecha_fin timestamptz NOT NULL,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (fecha_fin > fecha_inicio)
);

CREATE TABLE reglas_promocion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promocion_id uuid NOT NULL REFERENCES promociones(id) ON DELETE CASCADE,
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE,
  categoria_id uuid REFERENCES categorias(id) ON DELETE CASCADE,
  monto_minimo numeric(10, 2) NOT NULL DEFAULT 0,
  cantidad_minima integer NOT NULL DEFAULT 1,
  limite_usos integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  direccion_cliente_id uuid REFERENCES direcciones_clientes(id) ON DELETE SET NULL,
  sucursal_id uuid REFERENCES sucursales(id) ON DELETE SET NULL,
  usuario_id uuid REFERENCES usuarios(id) ON DELETE SET NULL,
  promocion_id uuid REFERENCES promociones(id) ON DELETE SET NULL,
  codigo text NOT NULL UNIQUE,
  canal text NOT NULL DEFAULT 'web' CHECK (canal IN ('web', 'whatsapp', 'tienda', 'instagram', 'telefono')),
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'preparacion', 'listo', 'en_camino', 'entregado', 'cancelado')),
  subtotal numeric(10, 2) NOT NULL DEFAULT 0,
  descuento numeric(10, 2) NOT NULL DEFAULT 0,
  costo_delivery numeric(10, 2) NOT NULL DEFAULT 0,
  total numeric(10, 2) NOT NULL DEFAULT 0,
  notas text,
  fecha_entrega timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE detalle_pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id uuid REFERENCES productos(id) ON DELETE SET NULL,
  variante_producto_id uuid REFERENCES variantes_productos(id) ON DELETE SET NULL,
  nombre_producto text NOT NULL,
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  costo_unitario numeric(10, 2) NOT NULL DEFAULT 0,
  subtotal numeric(10, 2) NOT NULL CHECK (subtotal >= 0),
  personalizacion text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metodos_pago (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  descripcion text,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pagos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES pedidos(id) ON DELETE SET NULL,
  metodo_pago_id uuid REFERENCES metodos_pago(id) ON DELETE SET NULL,
  monto numeric(10, 2) NOT NULL CHECK (monto >= 0),
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'fallido', 'reembolsado')),
  referencia text,
  fecha_pago timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ingresos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES pedidos(id) ON DELETE SET NULL,
  pago_id uuid REFERENCES pagos(id) ON DELETE SET NULL,
  categoria text NOT NULL DEFAULT 'venta',
  descripcion text NOT NULL,
  monto numeric(10, 2) NOT NULL CHECK (monto >= 0),
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE gastos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id uuid,
  categoria text NOT NULL,
  descripcion text NOT NULL,
  monto numeric(10, 2) NOT NULL CHECK (monto >= 0),
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  comprobante_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE proveedores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  contacto text,
  telefono text,
  email text,
  direccion text,
  ruc text,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gastos
  ADD CONSTRAINT gastos_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL;

CREATE TABLE insumos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id uuid REFERENCES proveedores(id) ON DELETE SET NULL,
  nombre text NOT NULL UNIQUE,
  unidad_medida text NOT NULL,
  costo_unitario numeric(10, 4) NOT NULL DEFAULT 0,
  stock_actual numeric(12, 3) NOT NULL DEFAULT 0,
  stock_minimo numeric(12, 3) NOT NULL DEFAULT 0,
  perecible boolean NOT NULL DEFAULT false,
  fecha_vencimiento date,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE movimientos_inventario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insumo_id uuid NOT NULL REFERENCES insumos(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('entrada', 'salida', 'ajuste')),
  cantidad numeric(12, 3) NOT NULL CHECK (cantidad > 0),
  costo_unitario numeric(10, 4),
  motivo text NOT NULL,
  referencia text,
  fecha timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id uuid REFERENCES proveedores(id) ON DELETE SET NULL,
  usuario_id uuid REFERENCES usuarios(id) ON DELETE SET NULL,
  codigo text NOT NULL UNIQUE,
  estado text NOT NULL DEFAULT 'recibida' CHECK (estado IN ('borrador', 'solicitada', 'recibida', 'cancelada')),
  subtotal numeric(10, 2) NOT NULL DEFAULT 0,
  igv numeric(10, 2) NOT NULL DEFAULT 0,
  total numeric(10, 2) NOT NULL DEFAULT 0,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE detalle_compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compra_id uuid NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  insumo_id uuid REFERENCES insumos(id) ON DELETE SET NULL,
  cantidad numeric(12, 3) NOT NULL CHECK (cantidad > 0),
  costo_unitario numeric(10, 4) NOT NULL CHECK (costo_unitario >= 0),
  subtotal numeric(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE producciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid REFERENCES productos(id) ON DELETE SET NULL,
  usuario_id uuid REFERENCES usuarios(id) ON DELETE SET NULL,
  sucursal_id uuid REFERENCES sucursales(id) ON DELETE SET NULL,
  codigo text NOT NULL UNIQUE,
  cantidad_planificada integer NOT NULL CHECK (cantidad_planificada > 0),
  cantidad_obtenida integer NOT NULL DEFAULT 0 CHECK (cantidad_obtenida >= 0),
  estado text NOT NULL DEFAULT 'planificada' CHECK (estado IN ('planificada', 'en_proceso', 'terminada', 'cancelada')),
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE recetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  rendimiento integer NOT NULL DEFAULT 1 CHECK (rendimiento > 0),
  instrucciones text,
  costo_estimado numeric(10, 2) NOT NULL DEFAULT 0,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (producto_id, nombre)
);

CREATE TABLE detalle_recetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receta_id uuid NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  insumo_id uuid NOT NULL REFERENCES insumos(id) ON DELETE RESTRICT,
  cantidad numeric(12, 3) NOT NULL CHECK (cantidad > 0),
  unidad_medida text NOT NULL,
  merma_porcentaje numeric(5, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (receta_id, insumo_id)
);

CREATE TABLE repartidores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombres text NOT NULL,
  apellidos text,
  telefono text NOT NULL,
  documento text,
  vehiculo text NOT NULL DEFAULT 'moto',
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE entregas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  repartidor_id uuid REFERENCES repartidores(id) ON DELETE SET NULL,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'asignada', 'recogida', 'entregada', 'fallida')),
  direccion_entrega text NOT NULL,
  distrito text NOT NULL,
  costo numeric(10, 2) NOT NULL DEFAULT 0,
  distancia_km numeric(8, 2),
  fecha_asignacion timestamptz,
  fecha_entrega timestamptz,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE alertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('stock_bajo', 'pedido_retrasado', 'pago_pendiente', 'produccion', 'sistema')),
  titulo text NOT NULL,
  mensaje text NOT NULL,
  nivel text NOT NULL DEFAULT 'info' CHECK (nivel IN ('info', 'advertencia', 'critica')),
  leida boolean NOT NULL DEFAULT false,
  referencia_tabla text,
  referencia_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notificaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  mensaje text NOT NULL,
  canal text NOT NULL DEFAULT 'dashboard' CHECK (canal IN ('dashboard', 'email', 'whatsapp')),
  enviada boolean NOT NULL DEFAULT false,
  leida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metricas_dashboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha date NOT NULL UNIQUE,
  ventas_totales numeric(10, 2) NOT NULL DEFAULT 0,
  pedidos_totales integer NOT NULL DEFAULT 0,
  ticket_promedio numeric(10, 2) NOT NULL DEFAULT 0,
  clientes_nuevos integer NOT NULL DEFAULT 0,
  gastos_totales numeric(10, 2) NOT NULL DEFAULT 0,
  utilidad_estimada numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE predicciones_ventas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE,
  fecha_objetivo date NOT NULL,
  cantidad_estimada integer NOT NULL DEFAULT 0,
  ingreso_estimado numeric(10, 2) NOT NULL DEFAULT 0,
  confianza numeric(5, 2) NOT NULL DEFAULT 0,
  metodo text NOT NULL DEFAULT 'promedio_movil',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX idx_productos_subcategoria_id ON productos(subcategoria_id);
CREATE INDEX idx_productos_stock_actual ON productos(stock_actual);
CREATE INDEX idx_productos_oferta ON productos(oferta_activa, oferta_fecha_fin);
CREATE INDEX idx_promociones_tipo_fechas ON promociones(tipo, activa, fecha_inicio, fecha_fin);
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX idx_detalle_pedidos_pedido_id ON detalle_pedidos(pedido_id);
CREATE INDEX idx_pagos_pedido_id ON pagos(pedido_id);
CREATE INDEX idx_insumos_stock ON insumos(stock_actual, stock_minimo);
CREATE INDEX idx_entregas_pedido_id ON entregas(pedido_id);
CREATE INDEX idx_metricas_dashboard_fecha ON metricas_dashboard(fecha);

CREATE OR REPLACE FUNCTION sincronizar_alerta_stock_producto()
RETURNS trigger AS $$
DECLARE
  alerta_id uuid;
BEGIN
  SELECT id INTO alerta_id
  FROM alertas
  WHERE tipo = 'stock_bajo'
    AND referencia_tabla = 'productos'
    AND referencia_id = NEW.id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NEW.stock_actual > 3 THEN
    IF alerta_id IS NOT NULL THEN
      UPDATE alertas SET leida = true, updated_at = now() WHERE id = alerta_id;
    END IF;
    RETURN NEW;
  END IF;

  IF alerta_id IS NULL THEN
    INSERT INTO alertas (tipo, titulo, mensaje, nivel, leida, referencia_tabla, referencia_id)
    VALUES (
      'stock_bajo',
      CASE WHEN NEW.stock_actual <= 0 THEN 'Producto agotado: ' || NEW.nombre ELSE 'Stock bajo: ' || NEW.nombre END,
      CASE
        WHEN NEW.stock_actual <= 0 THEN NEW.nombre || ' no tiene stock disponible. La tarjeta publica se mostrara como agotada.'
        ELSE 'Quedan ' || NEW.stock_actual || ' unidades de ' || NEW.nombre || '. Reponer inventario para evitar quedar sin ventas.'
      END,
      CASE WHEN NEW.stock_actual <= 0 THEN 'critica' ELSE 'advertencia' END,
      false,
      'productos',
      NEW.id
    );
  ELSE
    UPDATE alertas
    SET
      titulo = CASE WHEN NEW.stock_actual <= 0 THEN 'Producto agotado: ' || NEW.nombre ELSE 'Stock bajo: ' || NEW.nombre END,
      mensaje = CASE
        WHEN NEW.stock_actual <= 0 THEN NEW.nombre || ' no tiene stock disponible. La tarjeta publica se mostrara como agotada.'
        ELSE 'Quedan ' || NEW.stock_actual || ' unidades de ' || NEW.nombre || '. Reponer inventario para evitar quedar sin ventas.'
      END,
      nivel = CASE WHEN NEW.stock_actual <= 0 THEN 'critica' ELSE 'advertencia' END,
      leida = false,
      updated_at = now()
    WHERE id = alerta_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_permisos_updated_at BEFORE UPDATE ON permisos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_sucursales_updated_at BEFORE UPDATE ON sucursales FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_configuracion_empresa_updated_at BEFORE UPDATE ON configuracion_empresa FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_direcciones_clientes_updated_at BEFORE UPDATE ON direcciones_clientes FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_categorias_updated_at BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_subcategorias_updated_at BEFORE UPDATE ON subcategorias FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_productos_stock_alerta AFTER INSERT OR UPDATE OF stock_actual, nombre ON productos FOR EACH ROW EXECUTE FUNCTION sincronizar_alerta_stock_producto();
CREATE TRIGGER trg_variantes_productos_updated_at BEFORE UPDATE ON variantes_productos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_imagenes_productos_updated_at BEFORE UPDATE ON imagenes_productos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_etiquetas_updated_at BEFORE UPDATE ON etiquetas FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_promociones_updated_at BEFORE UPDATE ON promociones FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_pedidos_updated_at BEFORE UPDATE ON pedidos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_metodos_pago_updated_at BEFORE UPDATE ON metodos_pago FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_pagos_updated_at BEFORE UPDATE ON pagos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_ingresos_updated_at BEFORE UPDATE ON ingresos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_gastos_updated_at BEFORE UPDATE ON gastos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_proveedores_updated_at BEFORE UPDATE ON proveedores FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_insumos_updated_at BEFORE UPDATE ON insumos FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_compras_updated_at BEFORE UPDATE ON compras FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_producciones_updated_at BEFORE UPDATE ON producciones FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_recetas_updated_at BEFORE UPDATE ON recetas FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_repartidores_updated_at BEFORE UPDATE ON repartidores FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_entregas_updated_at BEFORE UPDATE ON entregas FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_alertas_updated_at BEFORE UPDATE ON alertas FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_notificaciones_updated_at BEFORE UPDATE ON notificaciones FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_metricas_dashboard_updated_at BEFORE UPDATE ON metricas_dashboard FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
CREATE TRIGGER trg_predicciones_ventas_updated_at BEFORE UPDATE ON predicciones_ventas FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rol_permisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE direcciones_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagenes_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE etiquetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_etiquetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE promociones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reglas_promocion ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metodos_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE producciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE repartidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE predicciones_ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lectura_dashboard_roles" ON roles FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_permisos" ON permisos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_rol_permisos" ON rol_permisos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_usuarios" ON usuarios FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_sucursales" ON sucursales FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_configuracion_empresa" ON configuracion_empresa FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_clientes" ON clientes FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_direcciones_clientes" ON direcciones_clientes FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_subcategorias" ON subcategorias FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_productos" ON productos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_variantes_productos" ON variantes_productos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_imagenes_productos" ON imagenes_productos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_etiquetas" ON etiquetas FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_producto_etiquetas" ON producto_etiquetas FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_promociones" ON promociones FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_reglas_promocion" ON reglas_promocion FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_pedidos" ON pedidos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_detalle_pedidos" ON detalle_pedidos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_metodos_pago" ON metodos_pago FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_pagos" ON pagos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_ingresos" ON ingresos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_gastos" ON gastos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_proveedores" ON proveedores FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_insumos" ON insumos FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_movimientos_inventario" ON movimientos_inventario FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_compras" ON compras FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_detalle_compras" ON detalle_compras FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_producciones" ON producciones FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_recetas" ON recetas FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_detalle_recetas" ON detalle_recetas FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_repartidores" ON repartidores FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_entregas" ON entregas FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_alertas" ON alertas FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_notificaciones" ON notificaciones FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_metricas_dashboard" ON metricas_dashboard FOR SELECT USING (true);
CREATE POLICY "lectura_dashboard_predicciones_ventas" ON predicciones_ventas FOR SELECT USING (true);

INSERT INTO roles (nombre, descripcion) VALUES
('Administradora', 'Acceso completo al dashboard y configuración'),
('Pastelera', 'Gestión de producción, recetas e inventario'),
('Atención', 'Gestión de clientes, pedidos, pagos y delivery');

INSERT INTO permisos (codigo, nombre, modulo, descripcion) VALUES
('dashboard.ver', 'Ver dashboard', 'métricas dashboard', 'Consulta de métricas principales'),
('productos.ver', 'Ver productos', 'productos', 'Consulta de catálogo, variantes e imágenes'),
('pedidos.ver', 'Ver pedidos', 'pedidos', 'Consulta de pedidos y detalle'),
('finanzas.ver', 'Ver finanzas', 'ingresos y gastos', 'Consulta de pagos, ingresos y gastos'),
('inventario.ver', 'Ver inventario', 'insumos e inventario', 'Consulta de insumos y movimientos'),
('produccion.ver', 'Ver producción', 'producción', 'Consulta de producciones y recetas'),
('delivery.ver', 'Ver delivery', 'delivery', 'Consulta de entregas y repartidores');

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Administradora';

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
JOIN permisos p ON p.codigo IN ('dashboard.ver', 'productos.ver', 'inventario.ver', 'produccion.ver')
WHERE r.nombre = 'Pastelera';

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
JOIN permisos p ON p.codigo IN ('dashboard.ver', 'pedidos.ver', 'finanzas.ver', 'delivery.ver', 'productos.ver')
WHERE r.nombre = 'Atención';

INSERT INTO usuarios (rol_id, nombres, apellidos, email, telefono)
SELECT id, 'Karla', 'Luna', 'hola@kalupasteleria.pe', '999 555 121'
FROM roles WHERE nombre = 'Administradora';

INSERT INTO usuarios (rol_id, nombres, apellidos, email, telefono)
SELECT id, 'María', 'Quispe', 'produccion@kalupasteleria.pe', '999 555 122'
FROM roles WHERE nombre = 'Pastelera';

INSERT INTO sucursales (nombre, direccion, distrito, ciudad, telefono, horario_atencion, latitud, longitud) VALUES
('Taller Miraflores', 'Av. La Paz 845', 'Miraflores', 'Lima', '999 555 121', 'Lun-Sáb 9:00 a 19:00', -12.1234567, -77.0301234),
('Punto de recojo Surco', 'Jr. Monte Rosa 220', 'Santiago de Surco', 'Lima', '999 555 130', 'Vie-Dom 10:00 a 18:00', -12.1112222, -76.9903333);

INSERT INTO configuracion_empresa (sucursal_id, nombre_comercial, razon_social, ruc, email_contacto, telefono_contacto, whatsapp, direccion_principal)
SELECT id, 'Kalú Pastelería Casera', 'Kalú Pastelería Casera S.A.C.', '20609988771', 'hola@kalupasteleria.pe', '999 555 121', '51999555121', direccion
FROM sucursales WHERE nombre = 'Taller Miraflores';

INSERT INTO clientes (nombres, apellidos, documento_tipo, documento_numero, email, telefono, fecha_nacimiento, notas) VALUES
('Andrea', 'Salazar', 'DNI', '72651428', 'andrea.salazar@mail.com', '987 210 455', '1993-04-18', 'Prefiere tortas con poca crema'),
('Diego', 'Ramos', 'DNI', '70124589', 'diego.ramos@mail.com', '965 841 220', '1988-11-03', 'Cliente frecuente de cupcakes'),
('Lucía', 'Paredes', 'DNI', '73400981', 'lucia.paredes@mail.com', '946 333 907', '1996-07-21', 'Pedidos por Instagram');

INSERT INTO direcciones_clientes (cliente_id, etiqueta, direccion, referencia, distrito, ciudad, latitud, longitud, principal)
SELECT id, 'Casa', 'Calle Los Jazmines 185', 'Frente al parque', 'Miraflores', 'Lima', -12.1191200, -77.0315100, true
FROM clientes WHERE email = 'andrea.salazar@mail.com';

INSERT INTO direcciones_clientes (cliente_id, etiqueta, direccion, referencia, distrito, ciudad, latitud, longitud, principal)
SELECT id, 'Oficina', 'Av. Primavera 1180', 'Recepción principal', 'Santiago de Surco', 'Lima', -12.1129000, -76.9918000, true
FROM clientes WHERE email = 'diego.ramos@mail.com';

INSERT INTO direcciones_clientes (cliente_id, etiqueta, direccion, referencia, distrito, ciudad, latitud, longitud, principal)
SELECT id, 'Departamento', 'Av. Caminos del Inca 480', 'Torre B piso 6', 'Santiago de Surco', 'Lima', -12.1167000, -76.9988000, true
FROM clientes WHERE email = 'lucia.paredes@mail.com';

INSERT INTO categorias (nombre, descripcion, icono, orden) VALUES
('Tortas', 'Tortas caseras para cumpleaños y reuniones', 'cake-slice', 1),
('Cupcakes', 'Cupcakes decorados por docena o media docena', 'cupcake', 2),
('Postres', 'Postres personales y familiares', 'dessert', 3);

INSERT INTO subcategorias (categoria_id, nombre, descripcion, orden)
SELECT id, 'Chocolate', 'Sabores intensos de cacao', 1 FROM categorias WHERE nombre = 'Tortas';
INSERT INTO subcategorias (categoria_id, nombre, descripcion, orden)
SELECT id, 'Frutales', 'Rellenos frescos con fruta', 2 FROM categorias WHERE nombre = 'Tortas';
INSERT INTO subcategorias (categoria_id, nombre, descripcion, orden)
SELECT id, 'Decorados', 'Cupcakes con temática personalizada', 1 FROM categorias WHERE nombre = 'Cupcakes';

INSERT INTO productos (categoria_id, subcategoria_id, nombre, slug, descripcion, precio_venta, costo_unitario, stock_actual, stock_minimo, oferta_activa, oferta_precio, oferta_fecha_fin, destacado, tiempo_preparacion_min)
SELECT c.id, s.id, 'Torta de chocolate húmeda', 'torta-chocolate-humeda', 'Bizcocho húmedo de cacao con fudge casero', 95.00, 42.50, 8, 3, false, null, null, true, 180
FROM categorias c JOIN subcategorias s ON s.categoria_id = c.id AND s.nombre = 'Chocolate'
WHERE c.nombre = 'Tortas';

INSERT INTO productos (categoria_id, subcategoria_id, nombre, slug, descripcion, precio_venta, costo_unitario, stock_actual, stock_minimo, oferta_activa, oferta_precio, oferta_fecha_fin, destacado, tiempo_preparacion_min)
SELECT c.id, s.id, 'Torta de vainilla con frutos rojos', 'torta-vainilla-frutos-rojos', 'Vainilla artesanal con crema ligera y frutos rojos', 110.00, 48.00, 3, 3, true, 89.00, now() + interval '2 days', true, 210
FROM categorias c JOIN subcategorias s ON s.categoria_id = c.id AND s.nombre = 'Frutales'
WHERE c.nombre = 'Tortas';

INSERT INTO productos (categoria_id, subcategoria_id, nombre, slug, descripcion, precio_venta, costo_unitario, stock_actual, stock_minimo, oferta_activa, oferta_precio, oferta_fecha_fin, destacado, tiempo_preparacion_min)
SELECT c.id, s.id, 'Cupcakes surtidos x12', 'cupcakes-surtidos-x12', 'Docena de cupcakes de vainilla, chocolate y red velvet', 72.00, 29.40, 0, 3, false, null, null, false, 120
FROM categorias c JOIN subcategorias s ON s.categoria_id = c.id AND s.nombre = 'Decorados'
WHERE c.nombre = 'Cupcakes';

INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio_venta, costo_unitario, stock_actual, stock_minimo, oferta_activa, oferta_precio, oferta_fecha_fin, destacado, tiempo_preparacion_min)
SELECT id, 'Cheesecake de maracuyá', 'cheesecake-maracuya', 'Cheesecake cremoso con salsa de maracuyá natural', 88.00, 36.20, 6, 3, false, null, null, true, 150
FROM categorias WHERE nombre = 'Postres';

INSERT INTO variantes_productos (producto_id, nombre, sku, precio_adicional, costo_adicional, stock)
SELECT id, 'Molde 18 cm', 'KALU-TCH-18', 0, 0, 8 FROM productos WHERE slug = 'torta-chocolate-humeda';
INSERT INTO variantes_productos (producto_id, nombre, sku, precio_adicional, costo_adicional, stock)
SELECT id, 'Molde 24 cm', 'KALU-TCH-24', 45.00, 18.50, 5 FROM productos WHERE slug = 'torta-chocolate-humeda';
INSERT INTO variantes_productos (producto_id, nombre, sku, precio_adicional, costo_adicional, stock)
SELECT id, 'Media docena', 'KALU-CUP-06', -34.00, -14.00, 12 FROM productos WHERE slug = 'cupcakes-surtidos-x12';

INSERT INTO imagenes_productos (producto_id, url, alt_text, orden, principal)
SELECT id, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80', 'Torta de chocolate Kalú', 1, true FROM productos WHERE slug = 'torta-chocolate-humeda';
INSERT INTO imagenes_productos (producto_id, url, alt_text, orden, principal)
SELECT id, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80', 'Torta de frutos rojos Kalú', 1, true FROM productos WHERE slug = 'torta-vainilla-frutos-rojos';
INSERT INTO imagenes_productos (producto_id, url, alt_text, orden, principal)
SELECT id, 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80', 'Cupcakes surtidos Kalú', 1, true FROM productos WHERE slug = 'cupcakes-surtidos-x12';
INSERT INTO imagenes_productos (producto_id, url, alt_text, orden, principal)
SELECT id, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80', 'Cheesecake de maracuyá Kalú', 1, true FROM productos WHERE slug = 'cheesecake-maracuya';

INSERT INTO etiquetas (nombre, color) VALUES
('Más vendido', '#d96f8a'),
('Sin gluten bajo pedido', '#6b8f71'),
('Personalizable', '#c68b59');

INSERT INTO producto_etiquetas (producto_id, etiqueta_id)
SELECT p.id, e.id FROM productos p CROSS JOIN etiquetas e
WHERE p.slug = 'torta-chocolate-humeda' AND e.nombre IN ('Más vendido', 'Personalizable');
INSERT INTO producto_etiquetas (producto_id, etiqueta_id)
SELECT p.id, e.id FROM productos p CROSS JOIN etiquetas e
WHERE p.slug = 'cupcakes-surtidos-x12' AND e.nombre = 'Personalizable';

INSERT INTO promociones (nombre, descripcion, codigo, tipo_descuento, valor, fecha_inicio, fecha_fin)
VALUES
('Bienvenida Kalú', 'Descuento para primera compra web', 'KALU10', 'porcentaje', 10.00, now() - interval '7 days', now() + interval '60 days'),
('Delivery cercano gratis', 'Envío gratis en Miraflores desde S/ 120', 'CERCAKALU', 'envio_gratis', 0.00, now() - interval '1 day', now() + interval '45 days');

INSERT INTO reglas_promocion (promocion_id, monto_minimo, cantidad_minima, limite_usos)
SELECT id, 80.00, 1, 100 FROM promociones WHERE codigo = 'KALU10';
INSERT INTO reglas_promocion (promocion_id, categoria_id, monto_minimo, cantidad_minima, limite_usos)
SELECT p.id, c.id, 120.00, 1, 50 FROM promociones p CROSS JOIN categorias c
WHERE p.codigo = 'CERCAKALU' AND c.nombre = 'Tortas';

INSERT INTO metodos_pago (nombre, descripcion) VALUES
('Yape', 'Pago móvil con captura de confirmación'),
('Plin', 'Transferencia móvil inmediata'),
('Tarjeta', 'Pago con tarjeta de débito o crédito'),
('Efectivo', 'Pago contra entrega o recojo');

INSERT INTO pedidos (cliente_id, direccion_cliente_id, sucursal_id, usuario_id, promocion_id, codigo, canal, estado, subtotal, descuento, costo_delivery, total, notas, fecha_entrega)
SELECT c.id, d.id, s.id, u.id, pr.id, 'KALU-1001', 'whatsapp', 'entregado', 95.00, 9.50, 8.00, 93.50, 'Dedicatoria: Feliz cumple, mamá', now() - interval '2 days'
FROM clientes c
JOIN direcciones_clientes d ON d.cliente_id = c.id
CROSS JOIN sucursales s
CROSS JOIN usuarios u
CROSS JOIN promociones pr
WHERE c.email = 'andrea.salazar@mail.com' AND s.nombre = 'Taller Miraflores' AND u.email = 'hola@kalupasteleria.pe' AND pr.codigo = 'KALU10';

INSERT INTO pedidos (cliente_id, direccion_cliente_id, sucursal_id, usuario_id, codigo, canal, estado, subtotal, descuento, costo_delivery, total, notas, fecha_entrega)
SELECT c.id, d.id, s.id, u.id, 'KALU-1002', 'web', 'preparacion', 144.00, 0.00, 10.00, 154.00, 'Cupcakes con tonos rosados', now() + interval '1 day'
FROM clientes c
JOIN direcciones_clientes d ON d.cliente_id = c.id
CROSS JOIN sucursales s
CROSS JOIN usuarios u
WHERE c.email = 'diego.ramos@mail.com' AND s.nombre = 'Taller Miraflores' AND u.email = 'produccion@kalupasteleria.pe';

INSERT INTO pedidos (cliente_id, direccion_cliente_id, sucursal_id, codigo, canal, estado, subtotal, descuento, costo_delivery, total, notas, fecha_entrega)
SELECT c.id, d.id, s.id, 'KALU-1003', 'instagram', 'confirmado', 88.00, 0.00, 9.00, 97.00, 'Enviar frío', now() + interval '2 days'
FROM clientes c
JOIN direcciones_clientes d ON d.cliente_id = c.id
CROSS JOIN sucursales s
WHERE c.email = 'lucia.paredes@mail.com' AND s.nombre = 'Punto de recojo Surco';

INSERT INTO detalle_pedidos (pedido_id, producto_id, variante_producto_id, nombre_producto, cantidad, precio_unitario, costo_unitario, subtotal, personalizacion)
SELECT pe.id, p.id, v.id, p.nombre, 1, 95.00, 42.50, 95.00, 'Mensaje sobre la torta'
FROM pedidos pe JOIN productos p ON p.slug = 'torta-chocolate-humeda'
LEFT JOIN variantes_productos v ON v.producto_id = p.id AND v.nombre = 'Molde 18 cm'
WHERE pe.codigo = 'KALU-1001';

INSERT INTO detalle_pedidos (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario, costo_unitario, subtotal, personalizacion)
SELECT pe.id, p.id, p.nombre, 2, 72.00, 29.40, 144.00, 'Decoración rosada'
FROM pedidos pe JOIN productos p ON p.slug = 'cupcakes-surtidos-x12'
WHERE pe.codigo = 'KALU-1002';

INSERT INTO detalle_pedidos (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario, costo_unitario, subtotal)
SELECT pe.id, p.id, p.nombre, 1, 88.00, 36.20, 88.00
FROM pedidos pe JOIN productos p ON p.slug = 'cheesecake-maracuya'
WHERE pe.codigo = 'KALU-1003';

INSERT INTO pagos (pedido_id, metodo_pago_id, monto, estado, referencia, fecha_pago)
SELECT pe.id, mp.id, pe.total, 'pagado', 'YAPE-839201', now() - interval '2 days'
FROM pedidos pe CROSS JOIN metodos_pago mp
WHERE pe.codigo = 'KALU-1001' AND mp.nombre = 'Yape';

INSERT INTO pagos (pedido_id, metodo_pago_id, monto, estado, referencia)
SELECT pe.id, mp.id, 154.00, 'pendiente', 'WEB-PEND-1002'
FROM pedidos pe CROSS JOIN metodos_pago mp
WHERE pe.codigo = 'KALU-1002' AND mp.nombre = 'Tarjeta';

INSERT INTO ingresos (pedido_id, pago_id, categoria, descripcion, monto, fecha)
SELECT pe.id, pa.id, 'venta', 'Venta pedido KALU-1001', pe.total, CURRENT_DATE - 2
FROM pedidos pe JOIN pagos pa ON pa.pedido_id = pe.id
WHERE pe.codigo = 'KALU-1001';

INSERT INTO proveedores (nombre, contacto, telefono, email, direccion, ruc) VALUES
('Insumos Dulce Perú', 'Rosa Medina', '988 410 200', 'ventas@dulceperu.pe', 'Mercado Productores, Santa Anita', '20566778891'),
('Lácteos La Campiña', 'José Torres', '977 322 445', 'pedidos@lacampina.pe', 'Av. Industrial 1420, Ate', '20455112233');

INSERT INTO gastos (proveedor_id, categoria, descripcion, monto, fecha)
SELECT id, 'insumos', 'Compra de chocolate bitter y azúcar', 168.50, CURRENT_DATE - 3
FROM proveedores WHERE nombre = 'Insumos Dulce Perú';

INSERT INTO insumos (proveedor_id, nombre, unidad_medida, costo_unitario, stock_actual, stock_minimo, perecible, fecha_vencimiento)
SELECT id, 'Harina pastelera', 'kg', 4.8000, 18.000, 6.000, false, NULL FROM proveedores WHERE nombre = 'Insumos Dulce Perú';
INSERT INTO insumos (proveedor_id, nombre, unidad_medida, costo_unitario, stock_actual, stock_minimo, perecible, fecha_vencimiento)
SELECT id, 'Chocolate bitter 65%', 'kg', 28.5000, 5.500, 3.000, false, NULL FROM proveedores WHERE nombre = 'Insumos Dulce Perú';
INSERT INTO insumos (proveedor_id, nombre, unidad_medida, costo_unitario, stock_actual, stock_minimo, perecible, fecha_vencimiento)
SELECT id, 'Mantequilla sin sal', 'kg', 24.0000, 2.200, 4.000, true, CURRENT_DATE + 20 FROM proveedores WHERE nombre = 'Lácteos La Campiña';
INSERT INTO insumos (proveedor_id, nombre, unidad_medida, costo_unitario, stock_actual, stock_minimo, perecible, fecha_vencimiento)
SELECT id, 'Huevos', 'unidad', 0.6500, 90.000, 48.000, true, CURRENT_DATE + 10 FROM proveedores WHERE nombre = 'Lácteos La Campiña';

INSERT INTO movimientos_inventario (insumo_id, tipo, cantidad, costo_unitario, motivo, referencia)
SELECT id, 'entrada', 10.000, costo_unitario, 'Compra semanal', 'COMP-2001' FROM insumos WHERE nombre = 'Harina pastelera';
INSERT INTO movimientos_inventario (insumo_id, tipo, cantidad, costo_unitario, motivo, referencia)
SELECT id, 'salida', 1.200, costo_unitario, 'Producción torta chocolate', 'PROD-3001' FROM insumos WHERE nombre = 'Chocolate bitter 65%';

INSERT INTO compras (proveedor_id, usuario_id, codigo, estado, subtotal, igv, total, fecha)
SELECT p.id, u.id, 'COMP-2001', 'recibida', 142.80, 25.70, 168.50, CURRENT_DATE - 3
FROM proveedores p CROSS JOIN usuarios u
WHERE p.nombre = 'Insumos Dulce Perú' AND u.email = 'hola@kalupasteleria.pe';

INSERT INTO detalle_compras (compra_id, insumo_id, cantidad, costo_unitario, subtotal)
SELECT c.id, i.id, 10.000, i.costo_unitario, 48.00
FROM compras c CROSS JOIN insumos i
WHERE c.codigo = 'COMP-2001' AND i.nombre = 'Harina pastelera';
INSERT INTO detalle_compras (compra_id, insumo_id, cantidad, costo_unitario, subtotal)
SELECT c.id, i.id, 3.000, i.costo_unitario, 85.50
FROM compras c CROSS JOIN insumos i
WHERE c.codigo = 'COMP-2001' AND i.nombre = 'Chocolate bitter 65%';

INSERT INTO producciones (producto_id, usuario_id, sucursal_id, codigo, cantidad_planificada, cantidad_obtenida, estado, fecha_inicio, fecha_fin, notas)
SELECT p.id, u.id, s.id, 'PROD-3001', 4, 4, 'terminada', now() - interval '2 days 6 hours', now() - interval '2 days 3 hours', 'Lote para pedidos de fin de semana'
FROM productos p CROSS JOIN usuarios u CROSS JOIN sucursales s
WHERE p.slug = 'torta-chocolate-humeda' AND u.email = 'produccion@kalupasteleria.pe' AND s.nombre = 'Taller Miraflores';

INSERT INTO recetas (producto_id, nombre, rendimiento, instrucciones, costo_estimado)
SELECT id, 'Receta base torta chocolate húmeda', 1, 'Hornear bizcocho húmedo, rellenar con fudge y refrigerar antes de decorar.', 42.50
FROM productos WHERE slug = 'torta-chocolate-humeda';

INSERT INTO detalle_recetas (receta_id, insumo_id, cantidad, unidad_medida, merma_porcentaje)
SELECT r.id, i.id, 0.650, 'kg', 2.00 FROM recetas r CROSS JOIN insumos i
WHERE r.nombre = 'Receta base torta chocolate húmeda' AND i.nombre = 'Harina pastelera';
INSERT INTO detalle_recetas (receta_id, insumo_id, cantidad, unidad_medida, merma_porcentaje)
SELECT r.id, i.id, 0.450, 'kg', 3.00 FROM recetas r CROSS JOIN insumos i
WHERE r.nombre = 'Receta base torta chocolate húmeda' AND i.nombre = 'Chocolate bitter 65%';
INSERT INTO detalle_recetas (receta_id, insumo_id, cantidad, unidad_medida, merma_porcentaje)
SELECT r.id, i.id, 0.300, 'kg', 1.00 FROM recetas r CROSS JOIN insumos i
WHERE r.nombre = 'Receta base torta chocolate húmeda' AND i.nombre = 'Mantequilla sin sal';
INSERT INTO detalle_recetas (receta_id, insumo_id, cantidad, unidad_medida, merma_porcentaje)
SELECT r.id, i.id, 8.000, 'unidad', 0.00 FROM recetas r CROSS JOIN insumos i
WHERE r.nombre = 'Receta base torta chocolate húmeda' AND i.nombre = 'Huevos';

INSERT INTO repartidores (nombres, apellidos, telefono, documento, vehiculo) VALUES
('Carlos', 'Mejía', '955 100 220', 'DNI 71234566', 'moto'),
('Valeria', 'Núñez', '944 880 110', 'DNI 74555120', 'auto');

INSERT INTO entregas (pedido_id, repartidor_id, estado, direccion_entrega, distrito, costo, distancia_km, fecha_asignacion, fecha_entrega, notas)
SELECT pe.id, r.id, 'entregada', d.direccion, d.distrito, pe.costo_delivery, 3.40, now() - interval '2 days 2 hours', now() - interval '2 days 1 hour', 'Entregado en recepción'
FROM pedidos pe JOIN direcciones_clientes d ON d.id = pe.direccion_cliente_id CROSS JOIN repartidores r
WHERE pe.codigo = 'KALU-1001' AND r.telefono = '955 100 220';
INSERT INTO entregas (pedido_id, repartidor_id, estado, direccion_entrega, distrito, costo, distancia_km, fecha_asignacion, notas)
SELECT pe.id, r.id, 'asignada', d.direccion, d.distrito, pe.costo_delivery, 5.80, now(), 'Programado para mañana'
FROM pedidos pe JOIN direcciones_clientes d ON d.id = pe.direccion_cliente_id CROSS JOIN repartidores r
WHERE pe.codigo = 'KALU-1002' AND r.telefono = '944 880 110';

INSERT INTO alertas (tipo, titulo, mensaje, nivel, referencia_tabla, referencia_id)
SELECT 'stock_bajo', 'Mantequilla por debajo del mínimo', 'El stock actual de mantequilla sin sal está por debajo del mínimo configurado.', 'advertencia', 'insumos', id
FROM insumos WHERE nombre = 'Mantequilla sin sal';

INSERT INTO notificaciones (usuario_id, titulo, mensaje, canal, enviada)
SELECT id, 'Pedido en preparación', 'El pedido KALU-1002 ya está en producción.', 'dashboard', true
FROM usuarios WHERE email = 'hola@kalupasteleria.pe';

INSERT INTO metricas_dashboard (fecha, ventas_totales, pedidos_totales, ticket_promedio, clientes_nuevos, gastos_totales, utilidad_estimada)
VALUES
(CURRENT_DATE - 2, 93.50, 1, 93.50, 1, 0.00, 51.00),
(CURRENT_DATE - 1, 0.00, 0, 0.00, 0, 168.50, -168.50),
(CURRENT_DATE, 251.00, 2, 125.50, 2, 0.00, 142.40);

INSERT INTO predicciones_ventas (producto_id, fecha_objetivo, cantidad_estimada, ingreso_estimado, confianza, metodo)
SELECT id, CURRENT_DATE + 1, 3, 285.00, 82.50, 'promedio_movil'
FROM productos WHERE slug = 'torta-chocolate-humeda';
INSERT INTO predicciones_ventas (producto_id, fecha_objetivo, cantidad_estimada, ingreso_estimado, confianza, metodo)
SELECT id, CURRENT_DATE + 1, 5, 360.00, 76.00, 'promedio_movil'
FROM productos WHERE slug = 'cupcakes-surtidos-x12';

CREATE VIEW vista_pedidos_detalle AS
SELECT
  p.id,
  p.codigo,
  p.estado,
  p.canal,
  p.subtotal,
  p.descuento,
  p.costo_delivery,
  p.total,
  p.fecha_entrega,
  p.created_at,
  c.nombres || COALESCE(' ' || c.apellidos, '') AS cliente,
  c.telefono AS cliente_telefono,
  s.nombre AS sucursal,
  COUNT(dp.id) AS items
FROM pedidos p
LEFT JOIN clientes c ON c.id = p.cliente_id
LEFT JOIN sucursales s ON s.id = p.sucursal_id
LEFT JOIN detalle_pedidos dp ON dp.pedido_id = p.id
GROUP BY p.id, c.nombres, c.apellidos, c.telefono, s.nombre;

CREATE VIEW vista_costeo_productos AS
SELECT
  p.id,
  p.nombre,
  p.precio_venta,
  p.costo_unitario,
  p.margen,
  CASE WHEN p.precio_venta > 0 THEN ROUND((p.margen / p.precio_venta) * 100, 2) ELSE 0 END AS margen_porcentaje,
  c.nombre AS categoria,
  s.nombre AS subcategoria
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN subcategorias s ON s.id = p.subcategoria_id;

CREATE VIEW vista_resumen_dashboard AS
SELECT
  (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE estado <> 'cancelado') AS ventas_acumuladas,
  (SELECT COUNT(*) FROM pedidos) AS pedidos_acumulados,
  (SELECT COUNT(*) FROM clientes) AS clientes_totales,
  (SELECT COALESCE(SUM(monto), 0) FROM gastos) AS gastos_acumulados,
  (SELECT COUNT(*) FROM alertas WHERE leida = false) AS alertas_pendientes,
  (SELECT COUNT(*) FROM insumos WHERE stock_actual <= stock_minimo) AS insumos_bajo_minimo;

CREATE OR REPLACE FUNCTION get_schema_overview()
RETURNS TABLE (
  objeto text,
  tipo text,
  columnas jsonb,
  total_columnas integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.table_name::text AS objeto,
    CASE
      WHEN c.table_type = 'BASE TABLE' THEN 'tabla'
      WHEN c.table_type = 'VIEW' THEN 'vista'
      ELSE lower(c.table_type)
    END AS tipo,
    jsonb_agg(
      jsonb_build_object(
        'columna', col.column_name,
        'tipo_dato', col.data_type,
        'es_nullable', col.is_nullable,
        'valor_default', col.column_default
      )
      ORDER BY col.ordinal_position
    ) AS columnas,
    COUNT(col.column_name)::integer AS total_columnas
  FROM information_schema.tables c
  JOIN information_schema.columns col
    ON col.table_schema = c.table_schema
   AND col.table_name = c.table_name
  WHERE c.table_schema = 'public'
    AND c.table_name NOT LIKE 'pg_%'
  GROUP BY c.table_name, c.table_type
  ORDER BY c.table_name;
$$;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_schema_overview() TO anon, authenticated;
