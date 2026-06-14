import { demoAlertas, demoCosteo, demoInsumos, demoMetricas, demoPredicciones, demoResumen, demoVistaPedidos } from '../demoData';
import type { Alerta, Insumo, MetricaDashboard, PrediccionVenta, VistaCosteoProducto, VistaPedidosDetalle, VistaResumenDashboard } from '../../types/esquema';
import { safeQuery, selectTable } from './base';
import { requireSupabase } from '../supabase';

export async function obtenerResumenDashboard() {
  return safeQuery<VistaResumenDashboard>('vista_resumen_dashboard', demoResumen, async () => {
    const client = requireSupabase();
    const { data, error } = await client.from('vista_resumen_dashboard').select('*').single();
    if (error) throw new Error(`vista_resumen_dashboard: ${error.message}`);
    return data as VistaResumenDashboard;
  });
}

export async function obtenerMetricasDashboard() {
  return selectTable<MetricaDashboard>('metricas_dashboard', demoMetricas, { column: 'fecha' });
}

export async function obtenerDashboardCompleto() {
  const [resumen, metricas, pedidos, costeo, insumos, alertas, predicciones] = await Promise.all([
    obtenerResumenDashboard(),
    obtenerMetricasDashboard(),
    selectTable<VistaPedidosDetalle>('vista_pedidos_detalle', demoVistaPedidos, { column: 'created_at', ascending: false }),
    selectTable<VistaCosteoProducto>('vista_costeo_productos', demoCosteo, { column: 'nombre' }),
    selectTable<Insumo>('insumos', demoInsumos, { column: 'nombre' }),
    selectTable<Alerta>('alertas', demoAlertas, { column: 'created_at', ascending: false }),
    selectTable<PrediccionVenta>('predicciones_ventas', demoPredicciones, { column: 'fecha_objetivo' }),
  ]);
  return { resumen, metricas, pedidos, costeo, insumos, alertas, predicciones };
}
