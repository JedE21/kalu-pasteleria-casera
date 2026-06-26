import { AdminCrudPage, badgeColumn, moneyColumn, textColumn, type CrudModule } from '../../components/dashboard/AdminCrudPage';
import type { Alerta, Categoria, Cliente, Entrega, Gasto, Pago, Pedido, Produccion, Producto, Promocion, Receta, Repartidor, Sucursal, Usuario } from '../../types/esquema';
import { crearCategoria, editarCategoria, eliminarCategoria, obtenerCategorias } from '../../lib/queries/categorias';
import { crearCliente, editarCliente, eliminarCliente, obtenerClientes } from '../../lib/queries/clientes';
import { crearEntrega, crearRepartidor, editarEntrega, eliminarEntrega, obtenerEntregas, obtenerRepartidores } from '../../lib/queries/delivery';
import { crearGasto, crearIngreso, editarPago, obtenerGastos, obtenerIngresos, obtenerPagos } from '../../lib/queries/finanzas';
import { editarInventarioProducto, obtenerInventarioProductos, obtenerMovimientosInventario, obtenerProveedores, type ProductoInventario } from '../../lib/queries/inventario';
import { crearPedido, editarPedido, eliminarPedido, obtenerPedidos } from '../../lib/queries/pedidos';
import { crearProduccion, editarProduccion, eliminarProduccion, obtenerProducciones } from '../../lib/queries/produccion';
import { crearProducto, editarProducto, eliminarProducto, obtenerProductos } from '../../lib/queries/productos';
import { crearPromocion, editarPromocion, eliminarPromocion, obtenerPromociones } from '../../lib/queries/promociones';
import { crearReceta, editarReceta, eliminarReceta, obtenerRecetas } from '../../lib/queries/recetas';
import { marcarAlertaLeida, obtenerAlertas } from '../../lib/queries/alertas';
import { crearSucursal, obtenerSucursales } from '../../lib/queries/configuracion';
import { crearUsuario, editarUsuario, obtenerUsuarios } from '../../lib/queries/usuarios';
import { slugify, soles } from '../../lib/utils';
import { ProductImageManager } from '../../components/dashboard/ProductImageManager';
import { useAsync } from '../../hooks/useAsync';
import { CategoryIconManager } from '../../components/dashboard/CategoryIconManager';

export function ProductosAdminPage() {
  const categoriasState = useAsync(obtenerCategorias, ['categorias-para-productos']);
  const categoriasOptions = (categoriasState.data?.data ?? [])
    .filter((categoria) => categoria.activa)
    .map((categoria) => ({ label: categoria.nombre, value: categoria.id }));

  const crearProductoDashboard = (payload: Partial<Producto>) => {
    const nombre = String(payload.nombre ?? '').trim();
    return crearProducto({
      ...payload,
      nombre,
      slug: slugify(nombre),
    });
  };

  const module: CrudModule<Producto> = {
    title: 'Productos',
    description: 'CRUD de `productos`; el margen es generado por Supabase y no se edita directamente.',
    tableName: 'productos',
    loader: obtenerProductos,
    create: crearProductoDashboard,
    update: editarProducto,
    remove: eliminarProducto,
    columns: [textColumn('nombre', 'Producto'), moneyColumn('precio_venta', 'Precio'), moneyColumn('costo_unitario', 'Costo'), moneyColumn('margen', 'Margen'), textColumn('stock_actual', 'Stock'), badgeColumn('disponible', 'Disponible'), badgeColumn('destacado', 'Destacado')],
    fields: [
      { name: 'categoria_id', label: 'Categoría', type: 'select', required: true, options: categoriasOptions },
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' },
      { name: 'precio_venta', label: 'Precio venta', type: 'number', required: true },
      { name: 'costo_unitario', label: 'Costo unitario', type: 'number', required: true },
      { name: 'stock_actual', label: 'Stock actual', type: 'number', step: '1', inputMode: 'numeric' },
      { name: 'disponible', label: 'Disponible', type: 'boolean' },
      { name: 'destacado', label: 'Destacado', type: 'boolean' },
      { name: 'tiempo_preparacion_min', label: 'Tiempo preparación min', type: 'number' },
    ],
  };
  return (
    <div className="grid gap-6">
      <ProductImageManager />
      <AdminCrudPage module={module} />
    </div>
  );
}

export function CategoriasAdminPage() {
  const module: CrudModule<Categoria> = {
    title: 'Categorías',
    description: 'CRUD de `categorias` para organizar el catálogo público.',
    tableName: 'categorias',
    loader: obtenerCategorias,
    create: crearCategoria,
    update: editarCategoria,
    remove: eliminarCategoria,
    columns: [textColumn('nombre', 'Nombre'), textColumn('descripcion', 'Descripción'), textColumn('orden', 'Orden'), badgeColumn('activa', 'Activa')],
    fields: [{ name: 'nombre', label: 'Nombre', required: true }, { name: 'descripcion', label: 'Descripción', type: 'textarea' }, { name: 'orden', label: 'Orden', type: 'number', step: '1', inputMode: 'numeric' }, { name: 'activa', label: 'Activa', type: 'boolean' }],
  };
  return (
    <div className="grid gap-6">
      <CategoryIconManager />
      <AdminCrudPage module={module} />
    </div>
  );
}

export function PromocionesAdminPage() {
  const module: CrudModule<Promocion> = {
    title: 'Promociones',
    description: 'Administra `promociones` y sus reglas vinculadas.',
    tableName: 'promociones',
    loader: obtenerPromociones,
    create: crearPromocion,
    update: editarPromocion,
    remove: eliminarPromocion,
    columns: [textColumn('nombre', 'Promoción'), badgeColumn('tipo', 'Clase'), textColumn('codigo', 'Código'), badgeColumn('tipo_descuento', 'Tipo'), moneyColumn('valor', 'Valor'), badgeColumn('activa', 'Activa')],
    fields: [{ name: 'nombre', label: 'Nombre', required: true }, { name: 'descripcion', label: 'Descripción', type: 'textarea' }, { name: 'codigo', label: 'Código' }, { name: 'tipo', label: 'Clase', type: 'select', options: [{ label: 'Promoción', value: 'promocion' }, { label: 'Oferta', value: 'oferta' }] }, { name: 'tipo_descuento', label: 'Tipo descuento', type: 'select', options: [{ label: 'Porcentaje', value: 'porcentaje' }, { label: 'Monto fijo', value: 'monto_fijo' }, { label: 'Envío gratis', value: 'envio_gratis' }] }, { name: 'valor', label: 'Valor', type: 'number' }, { name: 'fecha_inicio', label: 'Fecha inicio', type: 'datetime' }, { name: 'fecha_fin', label: 'Fecha fin', type: 'datetime' }, { name: 'activa', label: 'Activa', type: 'boolean' }],
  };
  return <AdminCrudPage module={module} />;
}

export function PedidosAdminPage() {
  const module: CrudModule<Pedido> = {
    title: 'Pedidos',
    description: 'Gestión de `pedidos`; permite cambiar estado y crear pedidos manuales.',
    tableName: 'pedidos',
    loader: obtenerPedidos,
    create: crearPedido,
    update: editarPedido,
    remove: eliminarPedido,
    columns: [textColumn('codigo', 'Código'), badgeColumn('estado', 'Estado'), badgeColumn('canal', 'Canal'), moneyColumn('total', 'Total'), textColumn('fecha_entrega', 'Entrega')],
    fields: [{ name: 'codigo', label: 'Código', required: true }, { name: 'canal', label: 'Canal', type: 'select', options: ['web', 'whatsapp', 'tienda', 'instagram', 'telefono'].map((v) => ({ label: v, value: v })) }, { name: 'estado', label: 'Estado', type: 'select', options: ['pendiente', 'confirmado', 'preparacion', 'listo', 'en_camino', 'entregado', 'cancelado'].map((v) => ({ label: v, value: v })) }, { name: 'subtotal', label: 'Subtotal', type: 'number' }, { name: 'descuento', label: 'Descuento', type: 'number' }, { name: 'costo_delivery', label: 'Costo delivery', type: 'number' }, { name: 'total', label: 'Total', type: 'number' }, { name: 'notas', label: 'Notas', type: 'textarea' }],
  };
  return <AdminCrudPage module={module} />;
}

export function ClientesAdminPage() {
  const module: CrudModule<Cliente> = {
    title: 'Clientes',
    description: 'CRUD de `clientes`; direcciones viven en `direcciones_clientes`.',
    tableName: 'clientes',
    loader: obtenerClientes,
    create: crearCliente,
    update: editarCliente,
    remove: eliminarCliente,
    columns: [textColumn('nombres', 'Nombres'), textColumn('apellidos', 'Apellidos'), textColumn('telefono', 'Teléfono'), textColumn('email', 'Email'), badgeColumn('activo', 'Activo')],
    fields: [{ name: 'nombres', label: 'Nombres', required: true }, { name: 'apellidos', label: 'Apellidos' }, { name: 'documento_tipo', label: 'Documento tipo' }, { name: 'documento_numero', label: 'Documento número' }, { name: 'email', label: 'Email' }, { name: 'telefono', label: 'Teléfono' }, { name: 'notas', label: 'Notas', type: 'textarea' }, { name: 'activo', label: 'Activo', type: 'boolean' }],
  };
  return <AdminCrudPage module={module} />;
}

export function DeliveryAdminPage() {
  const module: CrudModule<Entrega> = {
    title: 'Delivery',
    description: 'Asignación y seguimiento con `entregas` y `repartidores`.',
    tableName: 'entregas',
    loader: obtenerEntregas,
    create: crearEntrega,
    update: editarEntrega,
    remove: eliminarEntrega,
    columns: [badgeColumn('estado', 'Estado'), textColumn('direccion_entrega', 'Dirección'), textColumn('distrito', 'Distrito'), moneyColumn('costo', 'Costo'), textColumn('distancia_km', 'Km')],
    fields: [{ name: 'pedido_id', label: 'pedido_id', required: true }, { name: 'repartidor_id', label: 'repartidor_id' }, { name: 'estado', label: 'Estado', type: 'select', options: ['pendiente', 'asignada', 'recogida', 'entregada', 'fallida'].map((v) => ({ label: v, value: v })) }, { name: 'direccion_entrega', label: 'Dirección', required: true }, { name: 'distrito', label: 'Distrito', required: true }, { name: 'costo', label: 'Costo', type: 'number' }, { name: 'distancia_km', label: 'Distancia km', type: 'number' }, { name: 'notas', label: 'Notas', type: 'textarea' }],
  };
  return <AdminCrudPage module={module} />;
}

export function RepartidoresAdminPage() {
  const module: CrudModule<Repartidor> = {
    title: 'Repartidores',
    description: 'CRUD auxiliar de `repartidores`.',
    tableName: 'repartidores',
    loader: obtenerRepartidores,
    create: crearRepartidor,
    columns: [textColumn('nombres', 'Nombres'), textColumn('telefono', 'Teléfono'), textColumn('vehiculo', 'Vehículo'), badgeColumn('activo', 'Activo')],
    fields: [{ name: 'nombres', label: 'Nombres', required: true }, { name: 'apellidos', label: 'Apellidos' }, { name: 'telefono', label: 'Teléfono', required: true }, { name: 'documento', label: 'Documento' }, { name: 'vehiculo', label: 'Vehículo' }, { name: 'activo', label: 'Activo', type: 'boolean' }],
  };
  return <AdminCrudPage module={module} />;
}

export function ProduccionAdminPage() {
  const module: CrudModule<Produccion> = {
    title: 'Producción',
    description: 'Lotes de `producciones` vinculados a `productos` y `sucursales`.',
    tableName: 'producciones',
    loader: obtenerProducciones,
    create: crearProduccion,
    update: editarProduccion,
    remove: eliminarProduccion,
    columns: [textColumn('codigo', 'Código'), badgeColumn('estado', 'Estado'), textColumn('cantidad_planificada', 'Plan'), textColumn('cantidad_obtenida', 'Obtenido'), textColumn('notas', 'Notas')],
    fields: [{ name: 'producto_id', label: 'producto_id' }, { name: 'sucursal_id', label: 'sucursal_id' }, { name: 'codigo', label: 'Código', required: true }, { name: 'cantidad_planificada', label: 'Cantidad planificada', type: 'number' }, { name: 'cantidad_obtenida', label: 'Cantidad obtenida', type: 'number' }, { name: 'estado', label: 'Estado', type: 'select', options: ['planificada', 'en_proceso', 'terminada', 'cancelada'].map((v) => ({ label: v, value: v })) }, { name: 'notas', label: 'Notas', type: 'textarea' }],
  };
  return <AdminCrudPage module={module} />;
}

export function InventarioAdminPage() {
  const module: CrudModule<ProductoInventario> = {
    title: 'Inventario',
    description: 'Stock de productos vendidos por categoria. Al llegar a 3 unidades o menos se muestra una alerta de stock bajo.',
    tableName: 'productos',
    loader: obtenerInventarioProductos,
    update: editarInventarioProducto,
    columns: [textColumn('categoria_nombre', 'Categoria'), textColumn('nombre', 'Producto'), textColumn('stock_actual', 'Stock'), badgeColumn('disponible', 'Disponible')],
    fields: [{ name: 'stock_actual', label: 'Stock actual', type: 'number', step: '1', inputMode: 'numeric' }, { name: 'disponible', label: 'Disponible', type: 'boolean' }],
  };
  return <AdminCrudPage module={module} />;
}

export function RecetasAdminPage() {
  const module: CrudModule<Receta> = {
    title: 'Recetas y Costeo',
    description: 'Administra `recetas` y `detalle_recetas`; costo estimado visible para costeo.',
    tableName: 'recetas',
    loader: obtenerRecetas,
    create: crearReceta,
    update: editarReceta,
    remove: eliminarReceta,
    columns: [textColumn('nombre', 'Receta'), textColumn('producto_id', 'Producto'), textColumn('rendimiento', 'Rendimiento'), moneyColumn('costo_estimado', 'Costo'), badgeColumn('activa', 'Activa')],
    fields: [{ name: 'producto_id', label: 'producto_id', required: true }, { name: 'nombre', label: 'Nombre', required: true }, { name: 'rendimiento', label: 'Rendimiento', type: 'number' }, { name: 'instrucciones', label: 'Instrucciones', type: 'textarea' }, { name: 'costo_estimado', label: 'Costo estimado', type: 'number' }, { name: 'activa', label: 'Activa', type: 'boolean' }],
  };
  return <AdminCrudPage module={module} />;
}

export function FinanzasAdminPage() {
  const module: CrudModule<Gasto> = {
    title: 'Finanzas',
    description: 'Registra `gastos`; ingresos y pagos se consultan desde sus módulos financieros.',
    tableName: 'gastos',
    loader: obtenerGastos,
    create: crearGasto,
    columns: [textColumn('categoria', 'Categoría'), textColumn('descripcion', 'Descripción'), moneyColumn('monto', 'Monto'), textColumn('fecha', 'Fecha')],
    fields: [{ name: 'proveedor_id', label: 'proveedor_id' }, { name: 'categoria', label: 'Categoría', required: true }, { name: 'descripcion', label: 'Descripción', required: true }, { name: 'monto', label: 'Monto', type: 'number' }, { name: 'fecha', label: 'Fecha', type: 'date' }, { name: 'comprobante_url', label: 'Comprobante URL' }],
  };
  return <AdminCrudPage module={module} />;
}

export function AlertasAdminPage() {
  const module: CrudModule<Alerta> = {
    title: 'Alertas',
    description: 'Seguimiento de `alertas` y estado de lectura.',
    tableName: 'alertas',
    loader: obtenerAlertas,
    update: marcarAlertaLeida as never,
    columns: [badgeColumn('nivel', 'Nivel'), badgeColumn('tipo', 'Tipo'), textColumn('titulo', 'Título'), textColumn('mensaje', 'Mensaje'), badgeColumn('leida', 'Leída')],
    fields: [],
  };
  return <AdminCrudPage module={module} />;
}

export function AdministracionAdminPage() {
  const module: CrudModule<Usuario> = {
    title: 'Administración',
    description: 'Usuarios internos desde `usuarios`, preparado para roles y permisos.',
    tableName: 'usuarios',
    loader: obtenerUsuarios,
    create: crearUsuario,
    update: editarUsuario,
    columns: [textColumn('nombres', 'Nombres'), textColumn('email', 'Email'), textColumn('telefono', 'Teléfono'), badgeColumn('rol', 'Rol'), badgeColumn('estado', 'Estado'), badgeColumn('activo', 'Activo')],
    fields: [
      { name: 'auth_user_id', label: 'auth_user_id' },
      { name: 'rol_id', label: 'rol_id' },
      { name: 'nombres', label: 'Nombres', required: true },
      { name: 'apellidos', label: 'Apellidos' },
      { name: 'email', label: 'Email', required: true },
      { name: 'correo', label: 'Correo login' },
      { name: 'telefono', label: 'Teléfono' },
      { name: 'rol', label: 'Rol', type: 'select', options: ['admin', 'cliente', 'vendedor', 'produccion', 'delivery'].map((value) => ({ label: value, value })) },
      { name: 'estado', label: 'Estado', type: 'select', options: ['activo', 'inactivo'].map((value) => ({ label: value, value })) },
      { name: 'activo', label: 'Activo', type: 'boolean' },
    ],
  };
  return <AdminCrudPage module={module} />;
}

export function ConfiguracionAdminPage() {
  const module: CrudModule<Sucursal> = {
    title: 'Configuración',
    description: 'Gestiona `sucursales`; empresa se consulta desde `configuracion_empresa`.',
    tableName: 'sucursales',
    loader: obtenerSucursales,
    create: crearSucursal,
    columns: [textColumn('nombre', 'Sucursal'), textColumn('direccion', 'Dirección'), textColumn('distrito', 'Distrito'), textColumn('telefono', 'Teléfono'), badgeColumn('activa', 'Activa')],
    fields: [{ name: 'nombre', label: 'Nombre', required: true }, { name: 'direccion', label: 'Dirección', required: true }, { name: 'distrito', label: 'Distrito', required: true }, { name: 'ciudad', label: 'Ciudad' }, { name: 'telefono', label: 'Teléfono' }, { name: 'horario_atencion', label: 'Horario' }, { name: 'activa', label: 'Activa', type: 'boolean' }],
  };
  return <AdminCrudPage module={module} />;
}

export function ReportesAdminPage() {
  return <AdminCrudPage module={{ title: 'Reportes', description: 'Vista de pagos desde `pagos` para auditoría rápida.', tableName: 'pagos', loader: obtenerPagos, update: editarPago, columns: [badgeColumn<Pago>('estado', 'Estado'), moneyColumn<Pago>('monto', 'Monto'), textColumn<Pago>('referencia', 'Referencia'), textColumn<Pago>('fecha_pago', 'Fecha pago')], fields: [{ name: 'estado', label: 'Estado', type: 'select', options: ['pendiente', 'pagado', 'fallido', 'reembolsado'].map((v) => ({ label: v, value: v })) }, { name: 'monto', label: 'Monto', type: 'number' }, { name: 'referencia', label: 'Referencia' }] }} />;
}

export function BIAdminPage() {
  return <AdminCrudPage module={{ title: 'Business Intelligence', description: `Proveedores e inventario operativo. Utilidad demo: ${soles(93.5 - 168.5)}`, tableName: 'proveedores', loader: obtenerProveedores, columns: [textColumn('nombre', 'Proveedor'), textColumn('contacto', 'Contacto'), textColumn('telefono', 'Teléfono'), badgeColumn('activo', 'Activo')], fields: [] }} />;
}

export function MovimientosInventarioPage() {
  return <AdminCrudPage module={{ title: 'Movimientos de inventario', description: 'Entradas, salidas y ajustes desde `movimientos_inventario`.', tableName: 'movimientos_inventario', loader: obtenerMovimientosInventario, columns: [badgeColumn('tipo', 'Tipo'), textColumn('cantidad', 'Cantidad'), textColumn('motivo', 'Motivo'), textColumn('referencia', 'Referencia')], fields: [] }} />;
}

export function IngresosAdminPage() {
  return <AdminCrudPage module={{ title: 'Ingresos', description: 'Registro manual de `ingresos`.', tableName: 'ingresos', loader: obtenerIngresos, create: crearIngreso, columns: [textColumn('categoria', 'Categoría'), textColumn('descripcion', 'Descripción'), moneyColumn('monto', 'Monto'), textColumn('fecha', 'Fecha')], fields: [{ name: 'categoria', label: 'Categoría', required: true }, { name: 'descripcion', label: 'Descripción', required: true }, { name: 'monto', label: 'Monto', type: 'number' }, { name: 'fecha', label: 'Fecha', type: 'date' }] }} />;
}
