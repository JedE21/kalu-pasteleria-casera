export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type EstadoPedido = 'pendiente' | 'confirmado' | 'preparacion' | 'listo' | 'en_camino' | 'entregado' | 'cancelado';
export type CanalPedido = 'web' | 'whatsapp' | 'tienda' | 'instagram' | 'telefono';
export type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado';
export type TipoMovimientoInventario = 'entrada' | 'salida' | 'ajuste';
export type EstadoEntrega = 'pendiente' | 'asignada' | 'recogida' | 'entregada' | 'fallida';
export type NivelAlerta = 'info' | 'advertencia' | 'critica';

export interface BaseRow {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Categoria extends BaseRow {
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
  activa: boolean;
}

export interface Subcategoria extends BaseRow {
  categoria_id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activa: boolean;
}

export interface Producto extends BaseRow {
  categoria_id: string | null;
  subcategoria_id: string | null;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio_venta: number;
  costo_unitario: number;
  margen: number;
  stock_actual: number;
  stock_minimo: number;
  disponible: boolean;
  destacado: boolean;
  tiempo_preparacion_min: number;
}

export interface VarianteProducto extends BaseRow {
  producto_id: string;
  nombre: string;
  sku: string | null;
  precio_adicional: number;
  costo_adicional: number;
  stock: number;
  activa: boolean;
}

export interface ImagenProducto extends BaseRow {
  producto_id: string;
  url: string;
  alt_text: string | null;
  orden: number;
  principal: boolean;
}

export interface Etiqueta extends BaseRow {
  nombre: string;
  color: string;
}

export interface ProductoEtiqueta extends BaseRow {
  producto_id: string;
  etiqueta_id: string;
}

export interface Promocion extends BaseRow {
  nombre: string;
  descripcion: string | null;
  codigo: string | null;
  tipo: 'promocion' | 'oferta';
  tipo_descuento: 'porcentaje' | 'monto_fijo' | 'envio_gratis';
  valor: number;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

export interface ReglaPromocion extends BaseRow {
  promocion_id: string;
  producto_id: string | null;
  categoria_id: string | null;
  monto_minimo: number;
  cantidad_minima: number;
  limite_usos: number | null;
}

export interface Cliente extends BaseRow {
  nombres: string;
  apellidos: string | null;
  documento_tipo: string | null;
  documento_numero: string | null;
  email: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  notas: string | null;
  activo: boolean;
}

export interface DireccionCliente extends BaseRow {
  cliente_id: string;
  etiqueta: string;
  direccion: string;
  referencia: string | null;
  distrito: string;
  ciudad: string;
  latitud: number | null;
  longitud: number | null;
  principal: boolean;
}

export interface Pedido extends BaseRow {
  cliente_id: string | null;
  direccion_cliente_id: string | null;
  sucursal_id: string | null;
  usuario_id: string | null;
  promocion_id: string | null;
  codigo: string;
  canal: CanalPedido;
  estado: EstadoPedido;
  subtotal: number;
  descuento: number;
  costo_delivery: number;
  total: number;
  notas: string | null;
  fecha_entrega: string | null;
}

export interface DetallePedido extends BaseRow {
  pedido_id: string;
  producto_id: string | null;
  variante_producto_id: string | null;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  costo_unitario: number;
  subtotal: number;
  personalizacion: string | null;
}

export interface MetodoPago extends BaseRow {
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface Pago extends BaseRow {
  pedido_id: string | null;
  metodo_pago_id: string | null;
  monto: number;
  estado: EstadoPago;
  referencia: string | null;
  fecha_pago: string | null;
}

export interface Ingreso extends BaseRow {
  pedido_id: string | null;
  pago_id: string | null;
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
}

export interface Gasto extends BaseRow {
  proveedor_id: string | null;
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  comprobante_url: string | null;
}

export interface Proveedor extends BaseRow {
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  ruc: string | null;
  activo: boolean;
}

export interface Insumo extends BaseRow {
  proveedor_id: string | null;
  nombre: string;
  unidad_medida: string;
  costo_unitario: number;
  stock_actual: number;
  stock_minimo: number;
  perecible: boolean;
  fecha_vencimiento: string | null;
  activo: boolean;
}

export interface MovimientoInventario extends BaseRow {
  insumo_id: string;
  tipo: TipoMovimientoInventario;
  cantidad: number;
  costo_unitario: number | null;
  motivo: string;
  referencia: string | null;
  fecha: string;
}

export interface Compra extends BaseRow {
  proveedor_id: string | null;
  usuario_id: string | null;
  codigo: string;
  estado: 'borrador' | 'solicitada' | 'recibida' | 'cancelada';
  subtotal: number;
  igv: number;
  total: number;
  fecha: string;
}

export interface DetalleCompra extends BaseRow {
  compra_id: string;
  insumo_id: string | null;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
}

export interface Produccion extends BaseRow {
  producto_id: string | null;
  usuario_id: string | null;
  sucursal_id: string | null;
  codigo: string;
  cantidad_planificada: number;
  cantidad_obtenida: number;
  estado: 'planificada' | 'en_proceso' | 'terminada' | 'cancelada';
  fecha_inicio: string | null;
  fecha_fin: string | null;
  notas: string | null;
}

export interface Receta extends BaseRow {
  producto_id: string;
  nombre: string;
  rendimiento: number;
  instrucciones: string | null;
  costo_estimado: number;
  activa: boolean;
}

export interface DetalleReceta extends BaseRow {
  receta_id: string;
  insumo_id: string;
  cantidad: number;
  unidad_medida: string;
  merma_porcentaje: number;
}

export interface Repartidor extends BaseRow {
  nombres: string;
  apellidos: string | null;
  telefono: string;
  documento: string | null;
  vehiculo: string;
  activo: boolean;
}

export interface Entrega extends BaseRow {
  pedido_id: string;
  repartidor_id: string | null;
  estado: EstadoEntrega;
  direccion_entrega: string;
  distrito: string;
  costo: number;
  distancia_km: number | null;
  fecha_asignacion: string | null;
  fecha_entrega: string | null;
  notas: string | null;
}

export interface Alerta extends BaseRow {
  tipo: 'stock_bajo' | 'pedido_retrasado' | 'pago_pendiente' | 'produccion' | 'sistema';
  titulo: string;
  mensaje: string;
  nivel: NivelAlerta;
  leida: boolean;
  referencia_tabla: string | null;
  referencia_id: string | null;
}

export interface Notificacion extends BaseRow {
  usuario_id: string | null;
  titulo: string;
  mensaje: string;
  canal: 'dashboard' | 'email' | 'whatsapp';
  enviada: boolean;
  leida: boolean;
}

export interface MetricaDashboard extends BaseRow {
  fecha: string;
  ventas_totales: number;
  pedidos_totales: number;
  ticket_promedio: number;
  clientes_nuevos: number;
  gastos_totales: number;
  utilidad_estimada: number;
}

export interface PrediccionVenta extends BaseRow {
  producto_id: string | null;
  fecha_objetivo: string;
  cantidad_estimada: number;
  ingreso_estimado: number;
  confianza: number;
  metodo: string;
}

export interface Rol extends BaseRow {
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface Permiso extends BaseRow {
  codigo: string;
  nombre: string;
  modulo: string;
  descripcion: string | null;
}

export interface RolPermiso extends BaseRow {
  rol_id: string;
  permiso_id: string;
}

export interface Usuario extends BaseRow {
  auth_user_id: string | null;
  rol_id: string | null;
  correo?: string | null;
  rol?: string | null;
  estado?: string | null;
  nombres: string;
  apellidos: string | null;
  email: string;
  telefono: string | null;
  avatar_url: string | null;
  activo: boolean;
  ultimo_acceso: string | null;
}

export interface Sucursal extends BaseRow {
  nombre: string;
  direccion: string;
  distrito: string;
  ciudad: string;
  telefono: string | null;
  horario_atencion: string | null;
  latitud: number | null;
  longitud: number | null;
  activa: boolean;
}

export interface ConfiguracionEmpresa extends BaseRow {
  sucursal_id: string | null;
  nombre_comercial: string;
  razon_social: string | null;
  ruc: string | null;
  email_contacto: string | null;
  telefono_contacto: string | null;
  whatsapp: string | null;
  moneda: string;
  igv_porcentaje: number;
  direccion_principal: string | null;
  logo_url: string | null;
  color_primario: string;
  color_secundario: string;
}

export interface VistaPedidosDetalle {
  id: string;
  codigo: string;
  estado: EstadoPedido;
  canal: CanalPedido;
  subtotal: number;
  descuento: number;
  costo_delivery: number;
  total: number;
  fecha_entrega: string | null;
  created_at: string;
  cliente: string | null;
  cliente_telefono: string | null;
  sucursal: string | null;
  items: number;
}

export interface VistaCosteoProducto {
  id: string;
  nombre: string;
  precio_venta: number;
  costo_unitario: number;
  margen: number;
  margen_porcentaje: number;
  categoria: string | null;
  subcategoria: string | null;
}

export interface VistaResumenDashboard {
  ventas_acumuladas: number;
  pedidos_acumulados: number;
  clientes_totales: number;
  gastos_acumulados: number;
  alertas_pendientes: number;
  insumos_bajo_minimo: number;
}

export interface SchemaOverview {
  objeto: string;
  tipo: 'tabla' | 'vista' | string;
  columnas: Array<{
    columna: string;
    tipo_dato: string;
    es_nullable: string;
    valor_default: string | null;
  }>;
  total_columnas: number;
}

export interface Database {
  public: {
    Tables: Record<string, { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }>;
    Views: Record<string, { Row: Record<string, unknown> }>;
    Functions: {
      get_schema_overview: {
        Args: Record<string, never>;
        Returns: SchemaOverview[];
      };
    };
  };
}

export type TablaContrato =
  | 'roles' | 'permisos' | 'rol_permisos' | 'usuarios' | 'sucursales' | 'configuracion_empresa'
  | 'clientes' | 'direcciones_clientes' | 'categorias' | 'subcategorias' | 'productos'
  | 'variantes_productos' | 'imagenes_productos' | 'etiquetas' | 'producto_etiquetas'
  | 'promociones' | 'reglas_promocion' | 'pedidos' | 'detalle_pedidos' | 'metodos_pago'
  | 'pagos' | 'ingresos' | 'gastos' | 'proveedores' | 'insumos' | 'movimientos_inventario'
  | 'compras' | 'detalle_compras' | 'producciones' | 'recetas' | 'detalle_recetas'
  | 'repartidores' | 'entregas' | 'alertas' | 'notificaciones' | 'metricas_dashboard'
  | 'predicciones_ventas';
