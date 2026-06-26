import { demoProductos } from '../demoData';
import type { Alerta, Notificacion, Producto } from '../../types/esquema';
import { insertRow, safeQuery, selectTable, updateRow } from './base';
import { requireSupabase } from '../supabase';

function alertaStockProducto(producto: Producto): Alerta | null {
  const stock = Number(producto.stock_actual ?? 0);
  if (stock > 3) return null;
  return {
    id: `stock-producto-${producto.id}`,
    tipo: 'stock_bajo',
    titulo: stock <= 0 ? `Producto agotado: ${producto.nombre}` : `Stock bajo: ${producto.nombre}`,
    mensaje: stock <= 0
      ? `${producto.nombre} no tiene stock disponible. La tarjeta publica se muestra como agotada.`
      : `Quedan ${stock} unidades de ${producto.nombre}. Reponer inventario para evitar quedar sin ventas.`,
    nivel: stock <= 0 ? 'critica' : 'advertencia',
    leida: false,
    referencia_tabla: 'productos',
    referencia_id: producto.id,
    created_at: producto.updated_at ?? producto.created_at,
    updated_at: producto.updated_at,
  };
}

export const obtenerAlertas = () => safeQuery<Alerta[]>('alertas', [
  ...demoProductos.map(alertaStockProducto).filter(Boolean) as Alerta[],
], async () => {
  const client = requireSupabase() as any;
  const [{ data: alertas, error: alertasError }, { data: productos, error: productosError }] = await Promise.all([
    client.from('alertas').select('*').order('created_at', { ascending: false }),
    client.from('productos').select('*').lte('stock_actual', 3).order('stock_actual'),
  ]);

  if (alertasError) throw new Error(`alertas: ${alertasError.message}`);
  if (productosError) throw new Error(`productos: ${productosError.message}`);

  const guardadas = (alertas ?? []) as Alerta[];
  const guardadasPorProducto = new Set(guardadas.filter((alerta) => alerta.referencia_tabla === 'productos' && alerta.tipo === 'stock_bajo').map((alerta) => alerta.referencia_id));
  const derivadas = ((productos ?? []) as Producto[])
    .filter((producto) => !guardadasPorProducto.has(producto.id))
    .map(alertaStockProducto)
    .filter(Boolean) as Alerta[];

  return [...derivadas, ...guardadas];
});
export const obtenerNotificaciones = () => selectTable<Notificacion>('notificaciones', [], { column: 'created_at', ascending: false });
export const crearAlerta = (payload: Partial<Alerta>) => insertRow<Alerta>('alertas', payload);
export const editarAlerta = (id: string, payload: Partial<Alerta>) => updateRow<Alerta>('alertas', id, payload);
export const marcarAlertaLeida = (id: string) => updateRow<Alerta>('alertas', id, { leida: true });
