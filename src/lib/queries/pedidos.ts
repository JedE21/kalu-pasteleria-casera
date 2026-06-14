import { demoPedidos, demoVistaPedidos } from '../demoData';
import type { DetallePedido, Pedido, VistaPedidosDetalle } from '../../types/esquema';
import { deleteRow, insertRow, safeQuery, selectTable, updateRow } from './base';
import { requireSupabase } from '../supabase';

export async function obtenerPedidos() {
  return selectTable<Pedido>('pedidos', demoPedidos, { column: 'created_at', ascending: false });
}

export async function obtenerVistaPedidos() {
  return selectTable<VistaPedidosDetalle>('vista_pedidos_detalle', demoVistaPedidos, { column: 'created_at', ascending: false });
}

export async function obtenerDetallePedidos(pedidoId?: string) {
  return safeQuery<DetallePedido[]>('detalle_pedidos', [], async () => {
    const client = requireSupabase();
    let query = client.from('detalle_pedidos').select('*').order('created_at', { ascending: false });
    if (pedidoId) query = query.eq('pedido_id', pedidoId);
    const { data, error } = await query;
    if (error) throw new Error(`detalle_pedidos: ${error.message}`);
    return (data ?? []) as DetallePedido[];
  });
}

export const crearPedido = (payload: Partial<Pedido>) => insertRow<Pedido>('pedidos', payload);
export const editarPedido = (id: string, payload: Partial<Pedido>) => updateRow<Pedido>('pedidos', id, payload);
export const eliminarPedido = (id: string) => deleteRow('pedidos', id);
export const crearDetallePedido = (payload: Partial<DetallePedido>) => insertRow<DetallePedido>('detalle_pedidos', payload);
