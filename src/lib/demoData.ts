import type {
  Alerta,
  Categoria,
  Cliente,
  ConfiguracionEmpresa,
  Entrega,
  Gasto,
  ImagenProducto,
  Ingreso,
  Insumo,
  MetricaDashboard,
  MovimientoInventario,
  Pago,
  Pedido,
  PrediccionVenta,
  Producto,
  Promocion,
  Proveedor,
  Receta,
  Repartidor,
  SchemaOverview,
  Sucursal,
  Usuario,
  VarianteProducto,
  VistaCosteoProducto,
  VistaPedidosDetalle,
  VistaResumenDashboard,
  Produccion,
  MetodoPago,
} from '../types/esquema';
import { tablasContrato } from '../config/schemaContract';

const now = new Date().toISOString();

export const demoCategorias: Categoria[] = [
  { id: 'cat-tortas', nombre: 'Tortas', descripcion: 'Tortas caseras para celebraciones', icono: 'cake-slice', orden: 1, activa: true, created_at: now, updated_at: now },
  { id: 'cat-cupcakes', nombre: 'Cupcakes', descripcion: 'Cupcakes decorados', icono: 'cupcake', orden: 2, activa: true, created_at: now, updated_at: now },
  { id: 'cat-postres', nombre: 'Postres', descripcion: 'Postres personales y familiares', icono: 'dessert', orden: 3, activa: true, created_at: now, updated_at: now },
];

export const demoProductos: Producto[] = [
  { id: 'prod-1', categoria_id: 'cat-tortas', subcategoria_id: null, nombre: 'Torta de chocolate húmeda', slug: 'torta-chocolate-humeda', descripcion: 'Bizcocho húmedo de cacao con fudge casero.', precio_venta: 95, costo_unitario: 42.5, margen: 52.5, stock_minimo: 2, disponible: true, destacado: true, tiempo_preparacion_min: 180, created_at: now, updated_at: now },
  { id: 'prod-2', categoria_id: 'cat-tortas', subcategoria_id: null, nombre: 'Torta de vainilla con frutos rojos', slug: 'torta-vainilla-frutos-rojos', descripcion: 'Vainilla artesanal con crema ligera y frutos rojos.', precio_venta: 110, costo_unitario: 48, margen: 62, stock_minimo: 2, disponible: true, destacado: true, tiempo_preparacion_min: 210, created_at: now, updated_at: now },
  { id: 'prod-3', categoria_id: 'cat-cupcakes', subcategoria_id: null, nombre: 'Cupcakes surtidos x12', slug: 'cupcakes-surtidos-x12', descripcion: 'Docena de cupcakes de vainilla, chocolate y red velvet.', precio_venta: 72, costo_unitario: 29.4, margen: 42.6, stock_minimo: 4, disponible: true, destacado: false, tiempo_preparacion_min: 120, created_at: now, updated_at: now },
  { id: 'prod-4', categoria_id: 'cat-postres', subcategoria_id: null, nombre: 'Cheesecake de maracuyá', slug: 'cheesecake-maracuya', descripcion: 'Cheesecake cremoso con salsa de maracuyá natural.', precio_venta: 88, costo_unitario: 36.2, margen: 51.8, stock_minimo: 2, disponible: true, destacado: true, tiempo_preparacion_min: 150, created_at: now, updated_at: now },
];

export const demoImagenes: ImagenProducto[] = [
  { id: 'img-1', producto_id: 'prod-1', url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80', alt_text: 'Torta de chocolate Kalú', orden: 1, principal: true, created_at: now, updated_at: now },
  { id: 'img-2', producto_id: 'prod-2', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80', alt_text: 'Torta con frutos rojos Kalú', orden: 1, principal: true, created_at: now, updated_at: now },
  { id: 'img-3', producto_id: 'prod-3', url: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80', alt_text: 'Cupcakes Kalú', orden: 1, principal: true, created_at: now, updated_at: now },
  { id: 'img-4', producto_id: 'prod-4', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80', alt_text: 'Cheesecake Kalú', orden: 1, principal: true, created_at: now, updated_at: now },
];

export const demoPromociones: Promocion[] = [
  { id: 'promo-1', nombre: 'Bienvenida Kalú', descripcion: 'Descuento para primera compra web.', codigo: 'KALU10', tipo_descuento: 'porcentaje', valor: 10, fecha_inicio: now, fecha_fin: new Date(Date.now() + 45 * 86400000).toISOString(), activa: true, created_at: now, updated_at: now },
  { id: 'promo-2', nombre: 'Delivery cercano gratis', descripcion: 'Envío gratis en Miraflores desde S/ 120.', codigo: 'CERCAKALU', tipo_descuento: 'envio_gratis', valor: 0, fecha_inicio: now, fecha_fin: new Date(Date.now() + 30 * 86400000).toISOString(), activa: true, created_at: now, updated_at: now },
];

export const demoClientes: Cliente[] = [
  { id: 'cli-1', nombres: 'Andrea', apellidos: 'Salazar', documento_tipo: 'DNI', documento_numero: '72651428', email: 'andrea.salazar@mail.com', telefono: '987 210 455', fecha_nacimiento: '1993-04-18', notas: 'Prefiere poca crema', activo: true, created_at: now, updated_at: now },
  { id: 'cli-2', nombres: 'Diego', apellidos: 'Ramos', documento_tipo: 'DNI', documento_numero: '70124589', email: 'diego.ramos@mail.com', telefono: '965 841 220', fecha_nacimiento: '1988-11-03', notas: 'Cliente frecuente', activo: true, created_at: now, updated_at: now },
];

export const demoPedidos: Pedido[] = [
  { id: 'ped-1', cliente_id: 'cli-1', direccion_cliente_id: null, sucursal_id: 'suc-1', usuario_id: null, promocion_id: 'promo-1', codigo: 'KALU-1001', canal: 'whatsapp', estado: 'entregado', subtotal: 95, descuento: 9.5, costo_delivery: 8, total: 93.5, notas: 'Dedicatoria: Feliz cumple, mamá', fecha_entrega: now, created_at: now, updated_at: now },
  { id: 'ped-2', cliente_id: 'cli-2', direccion_cliente_id: null, sucursal_id: 'suc-1', usuario_id: null, promocion_id: null, codigo: 'KALU-1002', canal: 'web', estado: 'preparacion', subtotal: 144, descuento: 0, costo_delivery: 10, total: 154, notas: 'Cupcakes con tonos rosados', fecha_entrega: now, created_at: now, updated_at: now },
];

export const demoVistaPedidos: VistaPedidosDetalle[] = [
  { id: 'ped-2', codigo: 'KALU-1002', estado: 'preparacion', canal: 'web', subtotal: 144, descuento: 0, costo_delivery: 10, total: 154, fecha_entrega: now, created_at: now, cliente: 'Diego Ramos', cliente_telefono: '965 841 220', sucursal: 'Taller Miraflores', items: 1 },
  { id: 'ped-1', codigo: 'KALU-1001', estado: 'entregado', canal: 'whatsapp', subtotal: 95, descuento: 9.5, costo_delivery: 8, total: 93.5, fecha_entrega: now, created_at: now, cliente: 'Andrea Salazar', cliente_telefono: '987 210 455', sucursal: 'Taller Miraflores', items: 1 },
];

export const demoMetricas: MetricaDashboard[] = [
  { id: 'met-1', fecha: '2026-06-12', ventas_totales: 93.5, pedidos_totales: 1, ticket_promedio: 93.5, clientes_nuevos: 1, gastos_totales: 0, utilidad_estimada: 51, created_at: now, updated_at: now },
  { id: 'met-2', fecha: '2026-06-13', ventas_totales: 0, pedidos_totales: 0, ticket_promedio: 0, clientes_nuevos: 0, gastos_totales: 168.5, utilidad_estimada: -168.5, created_at: now, updated_at: now },
  { id: 'met-3', fecha: '2026-06-14', ventas_totales: 251, pedidos_totales: 2, ticket_promedio: 125.5, clientes_nuevos: 2, gastos_totales: 0, utilidad_estimada: 142.4, created_at: now, updated_at: now },
];

export const demoResumen: VistaResumenDashboard = {
  ventas_acumuladas: 344.5,
  pedidos_acumulados: 3,
  clientes_totales: 3,
  gastos_acumulados: 168.5,
  alertas_pendientes: 1,
  insumos_bajo_minimo: 1,
};

export const demoInsumos: Insumo[] = [
  { id: 'ins-1', proveedor_id: 'prov-1', nombre: 'Harina pastelera', unidad_medida: 'kg', costo_unitario: 4.8, stock_actual: 18, stock_minimo: 6, perecible: false, fecha_vencimiento: null, activo: true, created_at: now, updated_at: now },
  { id: 'ins-2', proveedor_id: 'prov-1', nombre: 'Chocolate bitter 65%', unidad_medida: 'kg', costo_unitario: 28.5, stock_actual: 5.5, stock_minimo: 3, perecible: false, fecha_vencimiento: null, activo: true, created_at: now, updated_at: now },
  { id: 'ins-3', proveedor_id: 'prov-2', nombre: 'Mantequilla sin sal', unidad_medida: 'kg', costo_unitario: 24, stock_actual: 2.2, stock_minimo: 4, perecible: true, fecha_vencimiento: '2026-07-04', activo: true, created_at: now, updated_at: now },
];

export const demoMovimientos: MovimientoInventario[] = [
  { id: 'mov-1', insumo_id: 'ins-1', tipo: 'entrada', cantidad: 10, costo_unitario: 4.8, motivo: 'Compra semanal', referencia: 'COMP-2001', fecha: now, created_at: now },
  { id: 'mov-2', insumo_id: 'ins-2', tipo: 'salida', cantidad: 1.2, costo_unitario: 28.5, motivo: 'Producción torta chocolate', referencia: 'PROD-3001', fecha: now, created_at: now },
];

export const demoAlertas: Alerta[] = [
  { id: 'ale-1', tipo: 'stock_bajo', titulo: 'Mantequilla por debajo del mínimo', mensaje: 'El stock actual de mantequilla sin sal está por debajo del mínimo configurado.', nivel: 'advertencia', leida: false, referencia_tabla: 'insumos', referencia_id: 'ins-3', created_at: now, updated_at: now },
];

export const demoProducciones: Produccion[] = [
  { id: 'prod-lote-1', producto_id: 'prod-1', usuario_id: null, sucursal_id: 'suc-1', codigo: 'PROD-3001', cantidad_planificada: 4, cantidad_obtenida: 4, estado: 'terminada', fecha_inicio: now, fecha_fin: now, notas: 'Lote para pedidos de fin de semana', created_at: now, updated_at: now },
];

export const demoRecetas: Receta[] = [
  { id: 'rec-1', producto_id: 'prod-1', nombre: 'Receta base torta chocolate húmeda', rendimiento: 1, instrucciones: 'Hornear bizcocho húmedo, rellenar con fudge y refrigerar antes de decorar.', costo_estimado: 42.5, activa: true, created_at: now, updated_at: now },
];

export const demoRepartidores: Repartidor[] = [
  { id: 'rep-1', nombres: 'Carlos', apellidos: 'Mejía', telefono: '955 100 220', documento: 'DNI 71234566', vehiculo: 'moto', activo: true, created_at: now, updated_at: now },
  { id: 'rep-2', nombres: 'Valeria', apellidos: 'Núñez', telefono: '944 880 110', documento: 'DNI 74555120', vehiculo: 'auto', activo: true, created_at: now, updated_at: now },
];

export const demoEntregas: Entrega[] = [
  { id: 'ent-1', pedido_id: 'ped-1', repartidor_id: 'rep-1', estado: 'entregada', direccion_entrega: 'Calle Los Jazmines 185', distrito: 'Miraflores', costo: 8, distancia_km: 3.4, fecha_asignacion: now, fecha_entrega: now, notas: 'Entregado en recepción', created_at: now, updated_at: now },
  { id: 'ent-2', pedido_id: 'ped-2', repartidor_id: 'rep-2', estado: 'asignada', direccion_entrega: 'Av. Primavera 1180', distrito: 'Santiago de Surco', costo: 10, distancia_km: 5.8, fecha_asignacion: now, fecha_entrega: null, notas: 'Programado para mañana', created_at: now, updated_at: now },
];

export const demoPagos: Pago[] = [
  { id: 'pag-1', pedido_id: 'ped-1', metodo_pago_id: 'metodo-1', monto: 93.5, estado: 'pagado', referencia: 'YAPE-839201', fecha_pago: now, created_at: now, updated_at: now },
  { id: 'pag-2', pedido_id: 'ped-2', metodo_pago_id: 'metodo-3', monto: 154, estado: 'pendiente', referencia: 'WEB-PEND-1002', fecha_pago: null, created_at: now, updated_at: now },
];

export const demoMetodosPago: MetodoPago[] = [
  { id: 'metodo-1', nombre: 'Yape', descripcion: 'Pago móvil con captura', activo: true, created_at: now, updated_at: now },
  { id: 'metodo-2', nombre: 'Plin', descripcion: 'Transferencia móvil inmediata', activo: true, created_at: now, updated_at: now },
  { id: 'metodo-3', nombre: 'Tarjeta', descripcion: 'Débito o crédito', activo: true, created_at: now, updated_at: now },
];

export const demoIngresos: Ingreso[] = [
  { id: 'ing-1', pedido_id: 'ped-1', pago_id: 'pag-1', categoria: 'venta', descripcion: 'Venta pedido KALU-1001', monto: 93.5, fecha: '2026-06-12', created_at: now, updated_at: now },
];

export const demoGastos: Gasto[] = [
  { id: 'gas-1', proveedor_id: 'prov-1', categoria: 'insumos', descripcion: 'Compra de chocolate bitter y azúcar', monto: 168.5, fecha: '2026-06-11', comprobante_url: null, created_at: now, updated_at: now },
];

export const demoProveedores: Proveedor[] = [
  { id: 'prov-1', nombre: 'Insumos Dulce Perú', contacto: 'Rosa Medina', telefono: '988 410 200', email: 'ventas@dulceperu.pe', direccion: 'Mercado Productores, Santa Anita', ruc: '20566778891', activo: true, created_at: now, updated_at: now },
  { id: 'prov-2', nombre: 'Lácteos La Campiña', contacto: 'José Torres', telefono: '977 322 445', email: 'pedidos@lacampina.pe', direccion: 'Av. Industrial 1420, Ate', ruc: '20455112233', activo: true, created_at: now, updated_at: now },
];

export const demoUsuarios: Usuario[] = [
  { id: 'usu-1', auth_user_id: null, rol_id: 'rol-1', nombres: 'Karla', apellidos: 'Luna', email: 'hola@kalupasteleria.pe', telefono: '999 555 121', avatar_url: null, activo: true, ultimo_acceso: now, created_at: now, updated_at: now },
];

export const demoSucursales: Sucursal[] = [
  { id: 'suc-1', nombre: 'Taller Miraflores', direccion: 'Av. La Paz 845', distrito: 'Miraflores', ciudad: 'Lima', telefono: '999 555 121', horario_atencion: 'Lun-Sáb 9:00 a 19:00', latitud: -12.1234567, longitud: -77.0301234, activa: true, created_at: now, updated_at: now },
  { id: 'suc-2', nombre: 'Punto de recojo Surco', direccion: 'Jr. Monte Rosa 220', distrito: 'Santiago de Surco', ciudad: 'Lima', telefono: '999 555 130', horario_atencion: 'Vie-Dom 10:00 a 18:00', latitud: -12.1112222, longitud: -76.9903333, activa: true, created_at: now, updated_at: now },
];

export const demoConfiguracion: ConfiguracionEmpresa = {
  id: 'conf-1',
  sucursal_id: 'suc-1',
  nombre_comercial: 'Kalú Pastelería Casera',
  razon_social: 'Kalú Pastelería Casera S.A.C.',
  ruc: '20609988771',
  email_contacto: 'hola@kalupasteleria.pe',
  telefono_contacto: '999 555 121',
  whatsapp: '51999555121',
  moneda: 'PEN',
  igv_porcentaje: 18,
  direccion_principal: 'Av. La Paz 845, Miraflores',
  logo_url: null,
  color_primario: '#7d4b98',
  color_secundario: '#4b332b',
  created_at: now,
  updated_at: now,
};

export const demoCosteo: VistaCosteoProducto[] = demoProductos.map((producto) => ({
  id: producto.id,
  nombre: producto.nombre,
  precio_venta: producto.precio_venta,
  costo_unitario: producto.costo_unitario,
  margen: producto.margen,
  margen_porcentaje: Number(((producto.margen / producto.precio_venta) * 100).toFixed(2)),
  categoria: demoCategorias.find((categoria) => categoria.id === producto.categoria_id)?.nombre ?? null,
  subcategoria: null,
}));

export const demoPredicciones: PrediccionVenta[] = [
  { id: 'pre-1', producto_id: 'prod-1', fecha_objetivo: '2026-06-15', cantidad_estimada: 3, ingreso_estimado: 285, confianza: 82.5, metodo: 'promedio_movil', created_at: now, updated_at: now },
  { id: 'pre-2', producto_id: 'prod-3', fecha_objetivo: '2026-06-15', cantidad_estimada: 5, ingreso_estimado: 360, confianza: 76, metodo: 'promedio_movil', created_at: now, updated_at: now },
];

export const demoVariantes: VarianteProducto[] = [
  { id: 'var-1', producto_id: 'prod-1', nombre: 'Molde 18 cm', sku: 'KALU-TCH-18', precio_adicional: 0, costo_adicional: 0, stock: 8, activa: true, created_at: now, updated_at: now },
  { id: 'var-2', producto_id: 'prod-1', nombre: 'Molde 24 cm', sku: 'KALU-TCH-24', precio_adicional: 45, costo_adicional: 18.5, stock: 5, activa: true, created_at: now, updated_at: now },
];

export const demoSchema: SchemaOverview[] = [
  ...tablasContrato.map((objeto) => ({
    objeto,
    tipo: 'tabla',
    columnas: [
      { columna: 'id', tipo_dato: 'uuid', es_nullable: 'NO', valor_default: 'gen_random_uuid()' },
      { columna: 'created_at', tipo_dato: 'timestamp with time zone', es_nullable: 'NO', valor_default: 'now()' },
    ],
    total_columnas: 8,
  })),
  { objeto: 'vista_resumen_dashboard', tipo: 'vista', columnas: [], total_columnas: 6 },
  { objeto: 'vista_pedidos_detalle', tipo: 'vista', columnas: [], total_columnas: 13 },
  { objeto: 'vista_costeo_productos', tipo: 'vista', columnas: [], total_columnas: 8 },
];
