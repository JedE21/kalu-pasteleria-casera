import { demoCategorias, demoInsumos, demoMovimientos, demoProductos, demoProveedores } from '../demoData';
import type { Categoria, Compra, DetalleCompra, Insumo, MovimientoInventario, Producto, Proveedor } from '../../types/esquema';
import { deleteRow, insertRow, safeQuery, selectTable, updateRow } from './base';
import { requireSupabase } from '../supabase';

export interface ProductoInventario extends Producto {
  categorias?: Pick<Categoria, 'id' | 'nombre'> | null;
  categoria_nombre?: string | null;
}

const demoInventarioProductos: ProductoInventario[] = demoProductos.map((producto) => ({
  ...producto,
  categoria_nombre: demoCategorias.find((categoria) => categoria.id === producto.categoria_id)?.nombre ?? 'Sin categoria',
}));

export const obtenerInsumos = () => selectTable<Insumo>('insumos', demoInsumos, { column: 'nombre' });
export const obtenerInventarioProductos = () => safeQuery<ProductoInventario[]>('inventario.productos', demoInventarioProductos, async () => {
  const client = requireSupabase() as any;
  const { data, error } = await client
    .from('productos')
    .select('*, categorias(id,nombre)')
    .order('nombre');

  if (error) throw new Error(`inventario.productos: ${error.message}`);
  return (data ?? []).map((producto: ProductoInventario) => ({
    ...producto,
    categoria_nombre: producto.categorias?.nombre ?? 'Sin categoria',
  })) as ProductoInventario[];
});
export const obtenerMovimientosInventario = () => selectTable<MovimientoInventario>('movimientos_inventario', demoMovimientos, { column: 'fecha', ascending: false });
export const obtenerProveedores = () => selectTable<Proveedor>('proveedores', demoProveedores, { column: 'nombre' });
export const obtenerCompras = () => selectTable<Compra>('compras', [], { column: 'fecha', ascending: false });
export const obtenerDetalleCompras = () => selectTable<DetalleCompra>('detalle_compras', []);

export const crearInsumo = (payload: Partial<Insumo>) => insertRow<Insumo>('insumos', payload);
export const editarInsumo = (id: string, payload: Partial<Insumo>) => updateRow<Insumo>('insumos', id, payload);
export const eliminarInsumo = (id: string) => deleteRow('insumos', id);
export async function editarInventarioProducto(id: string, payload: Partial<Producto>) {
  const producto = await updateRow<Producto>('productos', id, payload);
  await sincronizarAlertaStockProducto(producto);
  return producto as ProductoInventario;
}
export const crearMovimientoInventario = (payload: Partial<MovimientoInventario>) => insertRow<MovimientoInventario>('movimientos_inventario', payload);
export const crearProveedor = (payload: Partial<Proveedor>) => insertRow<Proveedor>('proveedores', payload);
export const crearCompra = (payload: Partial<Compra>) => insertRow<Compra>('compras', payload);

async function sincronizarAlertaStockProducto(producto: Producto) {
  const client = requireSupabase() as any;
  const { data: existentes, error: searchError } = await client
    .from('alertas')
    .select('id')
    .eq('referencia_tabla', 'productos')
    .eq('referencia_id', producto.id)
    .eq('tipo', 'stock_bajo')
    .limit(1);

  if (searchError) throw new Error(`alertas: ${searchError.message}`);

  const alerta = existentes?.[0];
  const stock = Number(producto.stock_actual ?? 0);
  if (stock > 3) {
    if (alerta?.id) {
      const { error } = await client.from('alertas').update({ leida: true }).eq('id', alerta.id);
      if (error) throw new Error(`alertas: ${error.message}`);
    }
    return;
  }

  const payload = {
    tipo: 'stock_bajo',
    titulo: stock <= 0 ? `Producto agotado: ${producto.nombre}` : `Stock bajo: ${producto.nombre}`,
    mensaje: stock <= 0
      ? `${producto.nombre} no tiene stock disponible. La tarjeta publica se mostrara como agotada.`
      : `Quedan ${stock} unidades de ${producto.nombre}. Reponer inventario para evitar quedar sin ventas.`,
    nivel: stock <= 0 ? 'critica' : 'advertencia',
    leida: false,
    referencia_tabla: 'productos',
    referencia_id: producto.id,
  };

  const query = alerta?.id ? client.from('alertas').update(payload).eq('id', alerta.id) : client.from('alertas').insert(payload);
  const { error } = await query;
  if (error) throw new Error(`alertas: ${error.message}`);
}
